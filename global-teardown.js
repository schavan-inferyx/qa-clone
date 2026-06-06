import fs from "fs";
import path from "path";

export default async function globalTeardown() {
  console.log("\n🧹 Global teardown: cleaning session artifacts…");

  const root = process.cwd();

  // ✅ ACTUAL session directory (from your tree)
  const sessionDir = path.join(root, ".sessions");

  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, {
        recursive: true,
        force: true,
      });
      console.log(`✔ Removed .sessions directory`);
    } else {
      console.log(`ℹ No .sessions directory found`);
    }
  } catch (err) {
    console.warn(
      `⚠ Failed to clean .sessions: ${err.message}`
    );
  }

  console.log("🧹 Global teardown complete.\n");
}
