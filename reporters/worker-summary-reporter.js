import fs from "fs";
import path from "path";
import XLSX from "xlsx";

/* ===============================
   ANSI HELPERS
   =============================== */

const ANSI = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

const ANSI_REGEX = /\x1B\[[0-9;]*m/g;
const stripAnsi = v => String(v ?? "").replace(ANSI_REGEX, "");
const toStr = v => (v == null ? "" : String(v));

/* ===============================
   FORMAT HELPERS
   =============================== */

function padAnsi(value, width) {
  const raw = toStr(value);
  const visible = stripAnsi(raw);
  return raw + " ".repeat(Math.max(0, width - visible.length));
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

function formatDuration(ms) {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;

  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return `${min}:${String(rem).padStart(2, "0")}`;

  const hr = Math.floor(min / 60);
  const mm = min % 60;
  return `${hr}:${String(mm).padStart(2, "0")}`;
}

function timestamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(
    d.getHours()
  )}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

/* ===============================
   TC ORDER PARSER (RESTORED)
   =============================== */

function extractTcOrder(specPath) {
  const m = specPath.match(/TC-[A-Z]+-([\d-]+)/);
  if (!m) return [];
  return m[1].split("-").map(Number);
}

/* ===============================
   CLEANUP
   =============================== */

function cleanupOldReports(baseDir, days = 2) {
  if (!fs.existsSync(baseDir)) return;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  for (const dir of fs.readdirSync(baseDir)) {
    const full = path.join(baseDir, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    if (fs.statSync(full).mtimeMs < cutoff) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

/* ===============================
   REPORTER
   =============================== */

class WorkerSummaryReporter {
  constructor() {
    this.specResults = new Map();
    this.testTotals = { passed: 0, failed: 0, skipped: 0 };

    this.baseDir = path.resolve(process.cwd(), "custom-result");
    this.runDir = path.join(this.baseDir, timestamp());

    this.fixedDir = path.resolve(process.cwd(), "jenkins-report-helper");


    cleanupOldReports(this.baseDir, 2);
  }

  onTestEnd(test, result) {
    const spec =
      test.location?.file?.replace(process.cwd(), "") || "unknown";

    const parts = spec.split("/tests/")[1]?.split("/") ?? [];
    const product = parts[0] ?? "unknown";
    const module = parts[1] ?? "unknown";

    const entry = this.specResults.get(spec) || {
      spec,
      product,
      module,
      worker: null,
      status: "PASSED",
      testName: "",
      reason: "—",
      durationMs: 0,
    };

    if (result.workerIndex >= 0) entry.worker = result.workerIndex;
    if (typeof result.duration === "number")
      entry.durationMs += result.duration;

    if (result.status === "passed") this.testTotals.passed++;
    if (result.status === "failed") this.testTotals.failed++;
    if (result.status === "skipped") this.testTotals.skipped++;

    if (result.status === "failed" && entry.status !== "FAILED") {
      entry.status = "FAILED";
      entry.testName = test.title;
      entry.reason = stripAnsi(
        result.error?.message || result.error?.stack || "FAILED"
      );
    }

    if (result.status === "skipped" && entry.status === "PASSED") {
      entry.status = "SKIPPED";
    }

    if (entry.status === "PASSED") {
      entry.testName = test.title;
    }

    this.specResults.set(spec, entry);
  }

  onEnd() {
    const rows = [...this.specResults.values()].sort((a, b) => {
      const A = extractTcOrder(a.spec);
      const B = extractTcOrder(b.spec);
      for (let i = 0; i < Math.max(A.length, B.length); i++) {
        const d = (A[i] ?? 0) - (B[i] ?? 0);
        if (d !== 0) return d;
      }
      return 0;
    });

    fs.mkdirSync(this.runDir, { recursive: true });
    fs.mkdirSync(this.fixedDir, { recursive: true });

    /* ===============================
       CONSOLE TABLE
       =============================== */

    const COL = {
      worker: 6,
      product: 18,
      module: 20,
      spec: 26,
      test: 28,
      status: 10,
      duration: 8,
      reason: 52,
    };

    const border = (l, m, r) =>
      l +
      Object.values(COL)
        .map(w => "─".repeat(w))
        .join(m) +
      r;

    console.log("\n=== WORKER EXECUTION SUMMARY ===\n");
    console.log(border("┌", "┬", "┐"));
    console.log(
      `│ ${padAnsi("Wkr", COL.worker - 1)}` +
      `│ ${padAnsi("Product", COL.product - 1)}` +
      `│ ${padAnsi("Module", COL.module - 1)}` +
      `│ ${padAnsi("Spec ID", COL.spec - 1)}` +
      `│ ${padAnsi("TEST", COL.test - 1)}` +
      `│ ${padAnsi("Status", COL.status - 1)}` +
      `│ ${padAnsi("Time", COL.duration - 1)}` +
      `│ ${padAnsi("Reason", COL.reason - 1)}│`
    );
    console.log(border("├", "┼", "┤"));

    for (const r of rows) {
      const reasonLines = wrapText(r.reason, COL.reason - 1);
      reasonLines.forEach((txt, i) => {
        console.log(
          `│ ${padAnsi(i ? "" : r.worker, COL.worker - 1)}` +
          `│ ${padAnsi(i ? "" : r.product, COL.product - 1)}` +
          `│ ${padAnsi(i ? "" : r.module, COL.module - 1)}` +
          `│ ${padAnsi(i ? "" : path.basename(r.spec), COL.spec - 1)}` +
          `│ ${padAnsi(i ? "" : r.testName, COL.test - 1)}` +
          `│ ${padAnsi(i ? "" : colorStatus(r.status), COL.status - 1)}` +
          `│ ${padAnsi(i ? "" : formatDuration(r.durationMs), COL.duration - 1)}` +
          `│ ${padAnsi(txt, COL.reason - 1)}│`
        );
      });
      console.log(border("├", "┼", "┤"));
    }

    console.log(border("└", "┴", "┘"));

    /* ===============================
       ARTIFACTS
       =============================== */

    const jsonPath = path.join(this.runDir, "worker-execution-summary.json");
    const csvPath = path.join(this.runDir, "worker-execution-summary.csv");
    // const failedxls = path.join(this.runDir, "worker-summary-FAILED.xlsx");
    // const passedxls = path.join(this.runDir, "worker-summary-PASSED.xlsx");
    const totalxls = path.join(this.runDir, "worker-summary-TOTAL.xlsx");



    fs.writeFileSync(jsonPath, JSON.stringify({ rows, testTotals: this.testTotals }, null, 2));

    const csv = [
      "Worker,Product,Module,Spec,Test,Status,Duration,Reason",
      ...rows.map(r =>
        [
          r.worker ?? "",
          r.product,
          r.module,
          path.basename(r.spec),
          r.testName,
          r.status,
          formatDuration(r.durationMs),
          stripAnsi(r.reason),
        ]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    fs.writeFileSync(csvPath, csv.join("\n"));

    /* ===============================
       EXCEL FILES (3)
       =============================== */

    const makeExcel = (file, data) => {
      const sheet = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, "Summary");
      XLSX.writeFile(wb, file);
    };

    makeExcel(
      path.join(this.runDir, "worker-summary-PASSED.xlsx"),
      rows.filter(r => r.status === "PASSED")
    );

    makeExcel(
      path.join(this.runDir, "worker-summary-FAILED.xlsx"),
      rows.filter(r => r.status === "FAILED")
    );

    makeExcel(
      path.join(this.runDir, "worker-summary-TOTAL.xlsx"),
      rows.map(r => ({
        Spec: path.basename(r.spec),
        Status: r.status,
        Duration: formatDuration(r.durationMs),
      }))
    );


    fs.writeFileSync(path.join(this.fixedDir, "worker-execution-summary.json"), JSON.stringify({ rows, testTotals: this.testTotals }, null, 2));
    fs.writeFileSync(path.join(this.fixedDir, "worker-execution-summary.csv"), csv.join("\n"));
    makeExcel(path.join(this.fixedDir, "worker-summary-TOTAL.xlsx"), rows.map(r => ({
      Spec: path.basename(r.spec),
      Status: r.status,
      Duration: formatDuration(r.durationMs),
    })));

    console.log("\n📄 REPORT ARTIFACTS");
    // console.log(`• CSV   : ${csvPath}`);
    console.log(`• JSON  : ${jsonPath}`);
    // console.log(`• Passed  : ${passedxls}`);
    // console.log(`• Failed  : ${failedxls}`);
    console.log(`• Total  : ${totalxls}`);

    console.log(`• Cleanup: reports older than 7 days auto-deleted`);
  }
}

export default WorkerSummaryReporter;
