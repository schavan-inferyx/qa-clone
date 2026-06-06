

import fs from "fs";
import path from "path";

/* ===============================
   ANSI HELPERS (SAFE)
   =============================== */

const ANSI = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

const ANSI_REGEX = /\x1B\[[0-9;]*m/g;

function toStr(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function stripAnsi(v) {
  return toStr(v).replace(ANSI_REGEX, "");
}

/* ===============================
   TEXT FORMATTERS
   =============================== */

function padAnsi(value, width) {
  const raw = toStr(value);
  const visible = stripAnsi(raw);
  const padding = Math.max(0, width - visible.length);
  return raw + " ".repeat(padding);
}

function wrapText(value, width) {
  const text = stripAnsi(value);
  if (!text) return [""];

  const lines = [];
  for (const rawLine of text.split("\n")) {
    let line = "";
    for (const word of rawLine.split(" ")) {
      if ((line + word).length > width) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line += word + " ";
      }
    }
    if (line.trim()) lines.push(line.trim());
  }
  return lines.length ? lines : [""];
}

function colorStatus(status) {
  if (status === "FAILED") return `${ANSI.red}${status}${ANSI.reset}`;
  if (status === "PASSED") return `${ANSI.green}${status}${ANSI.reset}`;
  if (status === "SKIPPED") return `${ANSI.yellow}${status}${ANSI.reset}`;
  return status;
}

/* ===============================
   REPORTER
   =============================== */

class WorkerSummaryReporter {
  constructor() {
    this.specResults = new Map();

    // 🔢 TEST-LEVEL TOTALS
    this.testTotals = {
      passed: 0,
      failed: 0,
      skipped: 0,
    };

    this.outputDir = path.resolve(process.cwd(), "test-results");
    this.jsonOutput = path.join(this.outputDir, "worker-execution-summary.json");
    this.mdOutput = path.join(this.outputDir, "worker-execution-summary.md");
  }

  onTestEnd(test, result) {
    const spec =
      test.location?.file?.replace(process.cwd(), "") || "unknown";

    const product =
      spec.split("/tests/")[1]?.split("/")[0] ?? "unknown";

    const entry = this.specResults.get(spec) || {
      spec,
      product,
      worker: null,
      status: "PASSED",
      reason: "—",
      durationMs: 0,
    };

    // Worker
    if (typeof result.workerIndex === "number" && result.workerIndex >= 0) {
      entry.worker = result.workerIndex;
    }

    // Duration
    if (typeof result.duration === "number") {
      entry.durationMs += result.duration;
    }

    // ✅ TEST TOTALS (THIS WAS THE MISSING PIECE)
    if (result.status === "passed") this.testTotals.passed++;
    if (result.status === "failed") this.testTotals.failed++;
    if (result.status === "skipped") this.testTotals.skipped++;

    // ❌ SPEC FAILURE (first failure locks spec)
    if (result.status === "failed" && entry.status !== "FAILED") {
      const raw =
        result.error?.message ||
        result.error?.stack ||
        "FAILED";

      entry.status = "FAILED";
      entry.reason = stripAnsi(raw)
        .split("\n")
        .map(l => l.trimEnd())
        .filter(Boolean)
        .join("\n");
    }

    // Skipped spec only if nothing failed
    if (result.status === "skipped" && entry.status === "PASSED") {
      entry.status = "SKIPPED";
    }

    this.specResults.set(spec, entry);
  }

  onEnd() {
    console.log("\n=== WORKER EXECUTION SUMMARY ===\n");

    const COL = {
      worker: 7,
      product: 20,
      spec: 32,
      status: 12,
      duration: 12,
      reason: 56,
    };

    /* ===============================
       SORT SPECS BY TC NUMBER
       =============================== */

    const extractOrder = spec => {
      const m = spec.match(/TC-[A-Z]+-([\d-]+)/);
      return m ? m[1].split("-").map(Number) : [];
    };

    const rows = Array.from(this.specResults.values()).sort((a, b) => {
      const A = extractOrder(a.spec);
      const B = extractOrder(b.spec);
      for (let i = 0; i < Math.max(A.length, B.length); i++) {
        const d = (A[i] ?? 0) - (B[i] ?? 0);
        if (d !== 0) return d;
      }
      return 0;
    });

    /* ===============================
       SPEC TOTALS
       =============================== */

    const specTotals = {
      passed: rows.filter(r => r.status === "PASSED").length,
      failed: rows.filter(r => r.status === "FAILED").length,
      skipped: rows.filter(r => r.status === "SKIPPED").length,
      durationMs: rows.reduce((s, r) => s + r.durationMs, 0),
    };

    /* ===============================
       TABLE BORDERS
       =============================== */

    const line = (w, c) => "─".repeat(w) + c;

    const top =
      `┌${line(COL.worker, "┬")}` +
      `${line(COL.product, "┬")}` +
      `${line(COL.spec, "┬")}` +
      `${line(COL.status, "┬")}` +
      `${line(COL.duration, "┬")}` +
      `${"─".repeat(COL.reason)}┐`;

    const sep =
      `├${line(COL.worker, "┼")}` +
      `${line(COL.product, "┼")}` +
      `${line(COL.spec, "┼")}` +
      `${line(COL.status, "┼")}` +
      `${line(COL.duration, "┼")}` +
      `${"─".repeat(COL.reason)}┤`;

    const bottom =
      `└${line(COL.worker, "┴")}` +
      `${line(COL.product, "┴")}` +
      `${line(COL.spec, "┴")}` +
      `${line(COL.status, "┴")}` +
      `${line(COL.duration, "┴")}` +
      `${"─".repeat(COL.reason)}┘`;

    /* ===============================
       HEADER
       =============================== */

    console.log(top);
    console.log(
      `│ ${padAnsi("Wkr", COL.worker - 1)}` +
      `│ ${padAnsi("Product", COL.product - 1)}` +
      `│ ${padAnsi("Spec", COL.spec - 1)}` +
      `│ ${padAnsi("Status", COL.status - 1)}` +
      `│ ${padAnsi("Dur(s)", COL.duration - 1)}` +
      `│ ${padAnsi("Reason", COL.reason - 1)}│`
    );
    console.log(sep);

    /* ===============================
       ROWS
       =============================== */

    for (const r of rows) {
      const reasonLines = wrapText(r.reason, COL.reason - 1);

      reasonLines.forEach((txt, i) => {
        console.log(
          `│ ${padAnsi(i === 0 ? r.worker : "", COL.worker - 1)}` +
          `│ ${padAnsi(i === 0 ? r.product : "", COL.product - 1)}` +
          `│ ${padAnsi(i === 0 ? path.basename(r.spec) : "", COL.spec - 1)}` +
          `│ ${padAnsi(i === 0 ? colorStatus(r.status) : "", COL.status - 1)}` +
          `│ ${padAnsi(i === 0 ? (r.durationMs / 1000).toFixed(1) : "", COL.duration - 1)}` +
          `│ ${padAnsi(txt, COL.reason - 1)}│`
        );
      });

      console.log(sep);
    }

    /* ===============================
       TOTAL ROW (YOUR REQUIRED ORDER)
       =============================== */

    const totalLabel =
      `${ANSI.cyan}TEST TOTAL${ANSI.reset} ` +
      `(✔ ${this.testTotals.passed} ✖ ${this.testTotals.failed} ➟ ${this.testTotals.skipped})  ` +
      `|  SPEC TOTAL (✔ ${specTotals.passed} ✖ ${specTotals.failed} ➟ ${specTotals.skipped})`;

    console.log(
      `│ ${padAnsi("", COL.worker - 1)}` +
      `│ ${padAnsi("", COL.product - 1)}` +
      `│ ${padAnsi(totalLabel, COL.spec - 1)}` +
      `│ ${padAnsi(
        specTotals.failed > 0 ? colorStatus("FAILED") : colorStatus("PASSED"),
        COL.status - 1
      )}` +
      `│ ${padAnsi(
        (specTotals.durationMs / 1000).toFixed(1),
        COL.duration - 1
      )}` +
      `│ ${padAnsi("—", COL.reason - 1)}│`
    );

    console.log(bottom);

    /* ===============================
       ARTIFACTS
       =============================== */

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    fs.writeFileSync(
      this.jsonOutput,
      JSON.stringify(
        {
          specs: rows,
          testTotals: this.testTotals,
          specTotals,
        },
        null,
        2
      )
    );

    const md = [];
    md.push("# 🧪 Playwright Execution Summary\n");
    md.push("| Worker | Product | Spec | Status | Duration (s) | Reason |");
    md.push("|--------|---------|------|--------|--------------|--------|");

    for (const r of rows) {
      md.push(
        `| ${r.worker ?? "—"} | ${r.product} | ${path.basename(
          r.spec
        )} | ${r.status} | ${(r.durationMs / 1000).toFixed(
          1
        )} | ${stripAnsi(r.reason).replace(/\|/g, "\\|").replace(/\n/g, "<br/>")} |`
      );
    }

    md.push("");
    md.push(
      `**TEST TOTAL:** ✔ ${this.testTotals.passed} ✖ ${this.testTotals.failed} ➟ ${this.testTotals.skipped}  |  ` +
      `**SPEC TOTAL:** ✔ ${specTotals.passed} ✖ ${specTotals.failed} ➟ ${specTotals.skipped}`
    );

    fs.writeFileSync(this.mdOutput, md.join("\n"));
  }
}

export default WorkerSummaryReporter;
