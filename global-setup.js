import fs from "fs";
import path from "path";

export default async function globalSetup() {
  const root = process.cwd();

  const dirsToClean = [
    "allure-results",
    "allure-report",
    "playwright-report",
    "test-results",
  ];

  console.log("\n🧹 Global setup: cleaning old reports");

  for (const dir of dirsToClean) {
    const full = path.join(root, dir);
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log(`✔ Cleaned ${dir}`);
    }
  }

  console.log("🧹 Cleanup done\n");
}
