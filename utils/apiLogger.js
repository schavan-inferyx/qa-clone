const fs = require("fs");
const path = require("path");
const { API_THRESHOLD } = require("./global-variables");

// Configurable threshold for slow APIs

class ApiLogger {
  constructor(projectName, moduleName, testCaseId) {
    this.projectName = projectName;
    this.moduleName = moduleName;
    this.testCaseId = testCaseId;
    this.requests = [];

    const now = new Date();
    const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
    this.fileName = `api-${projectName}-${moduleName}-${testCaseId}-${timestamp}.json`;
    this.dirPath = path.join(process.cwd(), "api-logs");

    if (!fs.existsSync(this.dirPath)) fs.mkdirSync(this.dirPath, { recursive: true });
  }

  attachTo(page) {
    page.on("request", req => req.startTime = Date.now());
    page.on("response", async res => {
      const req = res.request();
      if (req.startTime) {
        const duration = Date.now() - req.startTime;

        this.requests.push({
          project: this.projectName,
          module: this.moduleName,
          testcase: this.testCaseId,
          method: req.method(),
          url: req.url(),
          status: res.status(),
          duration,
          result: this.getEmoji(res.status()) // Only ✅ or ❌
        });
      }
    });
  }

  getEmoji(status) {
    return status >= 200 && status < 300 ? "✅" : "❌";
  }

  async saveLogs() {
    const filePath = path.join(this.dirPath, this.fileName);
    fs.writeFileSync(filePath, JSON.stringify(this.requests, null, 2), "utf-8");

    const globalFile = path.join(this.dirPath, "slow-api-summary.json");
    const slowCalls = this.requests.filter(r => r.duration > API_THRESHOLD);

    let existing = [];
    if (fs.existsSync(globalFile)) {
      existing = JSON.parse(fs.readFileSync(globalFile, "utf-8"));
    }

    fs.writeFileSync(globalFile, JSON.stringify([...existing, ...slowCalls], null, 2), "utf-8");
  }

  getSlowCalls() {
    return this.requests.filter(r => r.duration > API_THRESHOLD);
  }

  getDuplicateCalls() {

    const map = new Map();

    for (const req of this.requests) {

      const url = new URL(req.url);

      const endpoint = url.origin + url.pathname;
      const query = url.searchParams.toString() || "NO_QUERY";

      if (!map.has(endpoint)) {
        map.set(endpoint, new Map());
      }

      const queryMap = map.get(endpoint);

      if (!queryMap.has(query)) {
        queryMap.set(query, 0);
      }

      queryMap.set(query, queryMap.get(query) + 1);
    }

    const duplicates = [];

    for (const [api, queryMap] of map.entries()) {

      let total = 0;
      const queryDetails = [];

      for (const [query, count] of queryMap.entries()) {
        total += count;
        queryDetails.push(`${query} (${count})`);
      }

      if (total > 1) {
        duplicates.push({
          api,
          count: total,
          queries: queryDetails.join(" | ")
        });
      }
    }

    return duplicates;
  }


}

module.exports = { ApiLogger, API_THRESHOLD };
