const { execSync } = require("child_process");

const files = process.env.TEST_FILE_ORDER
  ? JSON.parse(process.env.TEST_FILE_ORDER)
  : [];

if (!files.length) {
  console.error("No sorted test files found. Did you run global-setup?");
  process.exit(1);
}

// You can add more Playwright CLI args as needed
const cmd = `npx playwright test ${files.map(f => `"${f}"`).join(" ")}`;
console.log("Running:", cmd);
execSync(cmd, { stdio: "inherit" });
