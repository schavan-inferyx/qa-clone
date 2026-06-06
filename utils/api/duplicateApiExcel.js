const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const DIR = path.join(process.cwd(), "api-logs-excel");
const FILE_PATH = path.join(DIR, "duplicate-api-report.xlsx");

async function writeDuplicateApis(rows) {

  if (!rows || rows.length === 0) return;

  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  // Load existing workbook
  if (fs.existsSync(FILE_PATH)) {

    await workbook.xlsx.readFile(FILE_PATH);
    worksheet = workbook.getWorksheet("Duplicates");

  }

  // Create sheet if missing
  if (!worksheet) {
    worksheet = workbook.addWorksheet("Duplicates");

    worksheet.addRow([
      "Run Time",
      "Project",
      "Module",
      "Spec File",
      "Test Case ID",
      "Test Name",
      "API",
      "Query Params",
      "Duplicate Count"
    ]);
  }

  const runTime = new Date().toISOString();

  rows.forEach(row => {
    worksheet.addRow([
      runTime,
      row.project,
      row.module,
      row.spec,
      row.tc,
      row.test,
      row.api,
      row.queries,
      row.count
    ]);
  });

  await workbook.xlsx.writeFile(FILE_PATH);
}

module.exports = { writeDuplicateApis };