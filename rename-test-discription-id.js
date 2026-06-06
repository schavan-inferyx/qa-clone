const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "tests");

let updatedCount = 0;
let skippedCount = 0;

function padTestCaseNumbers(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            padTestCaseNumbers(fullPath);
        } else if (stat.isFile() && file.endsWith(".spec.js")) {
            let content = fs.readFileSync(fullPath, "utf-8");
            let originalContent = content;

            // Regex: match TC-XXX-x.x.x.NUMBER:
            //   content = content.replace(/(TC-[A-Z]+-\d+\.\d+\.\d+\.)(\d+)(:)/g, (match, prefix, num, suffix) => {      test("TC-AML-2.4.1.0011: refresh stats", async ({ authentication }, testInfo) => {

            //  test("TC-AML-2.4.1.0011 : refresh stats", async ({ authentication }, testInfo) => { with space before colon

            content = content.replace(/(TC-[A-Z]+-\d+\.\d+\.\d+\.)(\d+)(\s*:)/g, (match, prefix, num, suffix) => {

                const newNum = num.padStart(4, "0");
                return `${prefix}${newNum}${suffix}`;
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, "utf-8");
                console.log(`Updated test numbers in: ${file}`);
                updatedCount++;
            } else {
                console.log(`No update needed in: ${file}`);
                skippedCount++;
            }
        }
    });
}

padTestCaseNumbers(rootDir);

console.log("--- Summary ---");
console.log(`Files updated: ${updatedCount}`);
console.log(`Files skipped (already correct): ${skippedCount}`);
console.log("Update complete.");
