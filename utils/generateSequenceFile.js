// const fs = require("fs");
// const path = require("path");

// function generateSequenceFile(dirPath) {
//   const folderName = path.basename(dirPath);
//   const masterFile = path.join(dirPath, `${folderName}.spec.js`);

//   const files = fs.readdirSync(dirPath)
//     .filter(f => f.endsWith(".spec.js") && f !== `${folderName}.spec.js`)
//     .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

//   const imports = files.map(f => `import "./${f}";`).join("\n");

//   const serialWrapper = `
// import { test } from "@playwright/test";

// test.describe.serial("${folderName} Suite", () => {
//   test("Run all in order", async () => {});
// });
// `;

//   const content = `// Auto-generated ${folderName}.spec.js to run tests sequentially
// // Generated: ${new Date().toISOString()}

// ${imports}
// ${serialWrapper}
// `;

//   fs.writeFileSync(masterFile, content);
//   console.log(`✅ Generated ${folderName}.spec.js in ${dirPath} with ${files.length} imports.`);

//   return masterFile;
// }

// module.exports = { generateSequenceFile };
const fs = require("fs");
const path = require("path");

function generateSequenceFile(dirPath, testInfo) {
  const folderName = path.basename(dirPath);
  const masterFile = path.join(dirPath, `${folderName}.spec.js`);  

  // Collect all spec files except master
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith(".spec.js") && f !== `${folderName}.spec.js`)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // ✅ Safely detect single-file run
  let isSingleFile = false;
  if (testInfo && testInfo.file) {
    const currentFile = path.basename(testInfo.file);
    isSingleFile = files.includes(currentFile);
  }

  if (isSingleFile) {
    if (fs.existsSync(masterFile)) {
      fs.unlinkSync(masterFile);
      console.log(`🗑️ Deleted auto-generated ${masterFile} (single test run).`);
    }
    return null;
  }

  // Use ES module imports to avoid loading @playwright/test twice
  const imports = files.map(f => `import "./${f}";`).join("\n");

  const serialWrapper = `
import { test } from "@playwright/test";

test.describe.serial("${folderName} Suite", () => {
  test("Run all in order", async () => {});
});
`;

  const content = `// Auto-generated ${folderName}.spec.js to run tests sequentially
// Generated: ${new Date().toISOString()}

${imports}
${serialWrapper}
`;

  fs.writeFileSync(masterFile, content);
  console.log(`✅ Generated ${folderName}.spec.js in ${dirPath} with ${files.length} requires.`);

  return masterFile;
}

module.exports = { generateSequenceFile };
