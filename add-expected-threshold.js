const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'tests');
const importStatement = `import { expectedThreshold } from "../../../utils/global-variables.js";`;

let updatedCount = 0;
let skippedCount = 0;

function updateThresholdInFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      updateThresholdInFiles(fullPath); // recurse into subfolders
    } else if (stat.isFile() && file.endsWith('.spec.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let originalContent = content;

      // Replace "toBeGreaterThanOrEqual(95)" with expectedThreshold
      content = content.replace(
        /toBeGreaterThanOrEqual\s*\(\s*95\s*\)/g,
        "toBeGreaterThanOrEqual(expectedThreshold)"
      );

      let modified = content !== originalContent;

      // If modified, ensure import is present
      if (modified) {
        if (!content.includes(importStatement)) {
          // Insert after any existing imports, else on top
          const lines = content.split('\n');
          let insertIndex = 0;
          while (insertIndex < lines.length && lines[insertIndex].startsWith('import')) {
            insertIndex++;
          }
          lines.splice(insertIndex, 0, importStatement);
          content = lines.join('\n');
          console.log(`Added import and updated: ${file}`);
        } else {
          console.log(`Updated threshold only: ${file}`);
        }

        fs.writeFileSync(fullPath, content, 'utf-8');
        updatedCount++;
      } else {
        console.log(`No threshold found: ${file}`);
        skippedCount++;
      }
    }
  });
}

updateThresholdInFiles(rootDir);

console.log('--- Summary ---');
console.log(`Files updated: ${updatedCount}`);
console.log(`Files skipped (no 95 found): ${skippedCount}`);
console.log('Update complete.');
