import { execSync } from "child_process";
import path from "path";

export function truncateFrameworkAML() {
  const script = path.resolve(
    process.cwd(),
    "db/truncate_framework_aml.exp"
  );

  console.log("🧹 Truncating framework_aml database...");

  execSync(script, {
    stdio: "inherit",
  });
}
