const fs = require('fs');
const path = require('path');

// Root tests directory
const rootDir = path.join(__dirname, 'tests');

let renamedCount = 0;
let skippedCount = 0;

function padFileNumbers(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subfolders
      padFileNumbers(fullPath);
    } else if (stat.isFile()) {
      // Match files like TC-XXX-X.X.X.123.spec.js
      const match = file.match(/^(TC-[A-Z]+-\d+\.\d+\.\d+\.)(\d+)(\.spec\.js)$/);
      if (match) {
        const prefix = match[1];
        const number = match[2];
        const suffix = match[3];

        // Pad last number to 4 digits
        const newNumber = number.padStart(4, '0');
        const newFileName = `${prefix}${newNumber}${suffix}`;

        if (newFileName !== file) {
          const newFullPath = path.join(dir, newFileName);
          console.log(`Renaming: ${file} -> ${newFileName}`);
          fs.renameSync(fullPath, newFullPath);
          renamedCount++;
        } else {
          console.log(`Already correct: ${file} (skipped)`);
          skippedCount++;
        }
      }
    }
  });
}

padFileNumbers(rootDir);

console.log('--- Summary ---');
console.log(`Total renamed files: ${renamedCount}`);
console.log(`Total skipped files: ${skippedCount}`);
console.log('File renaming complete.');
