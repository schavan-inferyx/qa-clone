import { expect } from "@playwright/test";
import { searchLikeTyping } from "./actions";

export async function isValuePresentInColumn(page, columnName, value, tableSelector = "table") {
  try {
    await page.waitForSelector(tableSelector);

    const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "hidden", timeout: 15000 });
    }

    const table = page.locator(tableSelector);

    // Get headers
    const headers = table.locator("th");
    const headerCount = await headers.count();

    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      if (headerText.toLowerCase() === columnName.toLowerCase()) {
        colIndex = i;
        break;
      }
    }

    if (colIndex === -1) {
      throw new Error(`Column "${columnName}" not found in table`);
    }

    // Try tbody rows first, fallback to all tr
    let rows = table.locator("tbody tr");
    let rowCount = await rows.count();
    if (rowCount === 0) {
      rows = table.locator("tr");
      rowCount = await rows.count();
    }

    // console.log("Row count found:", rowCount);

    for (let r = 0; r < rowCount; r++) {
      const cell = rows.nth(r).locator("td").nth(colIndex);
      const cellText = (await cell.textContent() || "").trim();
      console.log(`Row ${r}, column ${columnName}:`, cellText);
      if (cellText === value) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(`Error in isValuePresentInColumn: ${error.message}`);
    return false;
  }
}


export async function isRowDeletedFromColumn(page, columnName, value, tableSelector = "table") {
  try {
    await page.waitForSelector(tableSelector);

    // ✅ Wait for loader spinner to disappear
    const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "hidden", timeout: 15000 });
    }

    const table = page.locator(tableSelector);

    // Get headers
    const headers = table.locator("th");
    const headerCount = await headers.count();

    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      if (headerText.toLowerCase() === columnName.toLowerCase()) {
        colIndex = i;
        break;
      }
    }

    if (colIndex === -1) {
      throw new Error(`Column "${columnName}" not found in table`);
    }

    // Try tbody rows first, fallback to all tr
    let rows = table.locator("tbody tr");
    let rowCount = await rows.count();
    if (rowCount === 0) {
      rows = table.locator("tr");
      rowCount = await rows.count();
    }

    for (let r = 0; r < rowCount; r++) {
      const cell = rows.nth(r).locator("td").nth(colIndex);
      const cellText = (await cell.textContent() || "").trim();
      if (cellText === value) {
        // ❌ Row still exists
        return false;
      }
    }

    // ✅ Row not found = deleted
    return true;
  } catch (error) {
    console.error(`Error in isRowDeletedFromColumn: ${error.message}`);
    return false;
  }
}


// Helper to get the action button for a row based on exact column value
// export async function getActionButtonForRow  (page, columnName, value) {
//   const table = page.locator("table");
//   const headers = table.locator("th");
//   const headerCount = await headers.count();
//   let colIndex = -1;

//   for (let i = 0; i < headerCount; i++) {
//     const headerText = (await headers.nth(i).innerText()).trim();
//     if (headerText.toLowerCase() === columnName.toLowerCase()) {
//       colIndex = i;
//       break;
//     }
//   }

//   if (colIndex === -1) throw new Error(`Column "${columnName}" not found`);

//   const rows = table.locator("tbody tr");
//   const rowCount = await rows.count();

//   for (let r = 0; r < rowCount; r++) {
//     const cell = rows.nth(r).locator("td").nth(colIndex);
//     const cellText = (await cell.textContent() || "").trim();
//     if (cellText === value) {
//       // Only target the actual action button
//       return rows.nth(r).locator('td button[pbutton][label="Action"]');
//     }
//   }

//   throw new Error(`Value "${value}" not found in column "${columnName}"`);
// };

export async function getActionButtonForRow(page, columnName, value) {
  const table = page.locator("table");
  const headers = table.locator("th");
  const headerCount = await headers.count();
  let colIndex = -1;

  await searchLikeTyping(page, value);

  // --- Find the column index ---
  for (let i = 0; i < headerCount; i++) {
    const headerText = (await headers.nth(i).innerText()).trim();
    if (headerText.toLowerCase() === columnName.toLowerCase()) {
      colIndex = i;
      break;
    }
  }

  if (colIndex === -1) throw new Error(`Column "${columnName}" not found`);

  const rows = table.locator("tbody tr");
  const rowCount = await rows.count();

  for (let r = 0; r < rowCount; r++) {
    const cell = rows.nth(r).locator("td").nth(colIndex);
    const cellText = (await cell.textContent() || "").trim();

    // Direct text match
    if (cellText === value) {
      return rows.nth(r).locator('td button[pbutton][label="Action"]');
    }

    // Hover to trigger tooltip
    await cell.hover();
    await page.waitForTimeout(300); // allow tooltip to render

    // Check for overlay tooltip content
    let tooltipText = '';
    try {
      const tooltip = page.locator('.p-tooltip-text');
      if (await tooltip.isVisible()) {
        tooltipText = (await tooltip.innerText()).trim();
      }
    } catch (err) {
      // fallback if tooltip not found
      tooltipText = '';
    }

    // Also try checking tooltip attributes (title, tooltip, data-tooltip)
    if (!tooltipText) {
      tooltipText = await page.evaluate((el) => {
        return (
          el.getAttribute('title') ||
          el.getAttribute('tooltip') ||
          el.getAttribute('data-tooltip') ||
          ''
        ).trim();
      }, await cell.elementHandle());
    }

    if (tooltipText === value) {
      console.log(`✅ Matched via tooltip overlay: "${tooltipText}"`);
      return rows.nth(r).locator('td button[pbutton][label="Action"]');
    }
  }

  throw new Error(`❌ Value "${value}" not found in column "${columnName}" (even after tooltip check)`);
}


export async function isNameWithStatusPresent(
  page,
  nameColumn,
  nameValue,
  statusColumn,
  expectedStatus,
  tableSelector = "table"
) {
  try {
    await page.waitForSelector(tableSelector);

    // Wait for loader (if any)
    const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "hidden", timeout: 15000 });
    }

    const table = page.locator(tableSelector);
    const headers = table.locator("th");
    const headerCount = await headers.count();

    let nameColIndex = -1;
    let statusColIndex = -1;

    // 🔹 Find indices for both columns
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).innerText()).trim().toLowerCase();
      if (headerText === nameColumn.toLowerCase()) nameColIndex = i;
      if (headerText === statusColumn.toLowerCase()) statusColIndex = i;
    }

    if (nameColIndex === -1) throw new Error(`Column "${nameColumn}" not found`);
    if (statusColIndex === -1) throw new Error(`Column "${statusColumn}" not found`);

    // 🔹 Get all rows
    let rows = table.locator("tbody tr");
    let rowCount = await rows.count();
    if (rowCount === 0) {
      rows = table.locator("tr");
      rowCount = await rows.count();
    }

    // 🔹 Iterate rows
    for (let r = 0; r < rowCount; r++) {
      const nameCell = rows.nth(r).locator("td").nth(nameColIndex);
      const statusCell = rows.nth(r).locator("td").nth(statusColIndex);

      let nameText = (await nameCell.textContent() || "").trim();
      let statusText = (await statusCell.textContent() || "").trim();

      // --- 🟡 Hover & check tooltip if text doesn’t match directly ---
      if (!nameText.toLowerCase().includes(nameValue.toLowerCase())) {
        await nameCell.hover();
        await page.waitForTimeout(300);

        try {
          const tooltip = page.locator(".p-tooltip-text");
          if (await tooltip.isVisible()) {
            const tooltipText = (await tooltip.innerText()).trim();
            if (tooltipText.toLowerCase().includes(nameValue.toLowerCase())) {
              nameText = tooltipText;
            }
          }
        } catch {
          // ignore if tooltip not found
        }

        // also check attributes like title, tooltip, data-tooltip
        if (!nameText.toLowerCase().includes(nameValue.toLowerCase())) {
          const attrTooltip = await page.evaluate((el) => {
            return (
              el.getAttribute("title") ||
              el.getAttribute("tooltip") ||
              el.getAttribute("data-tooltip") ||
              ""
            ).trim();
          }, await nameCell.elementHandle());
          if (attrTooltip.toLowerCase().includes(nameValue.toLowerCase())) {
            nameText = attrTooltip;
          }
        }
      }

      console.log(`Row ${r}: Name="${nameText}", Status="${statusText}"`);

      // --- ✅ Match (partial) name and exact status ---
      if (
        nameText.toLowerCase().includes(nameValue.toLowerCase()) &&
        statusText.trim().toLowerCase() === expectedStatus.toLowerCase()
      ) {
        console.log(`✅ Found match: Name="${nameText}" | Status="${statusText}"`);
        return true;
      }
    }

    console.log(`❌ No match found for Name="${nameValue}" with Status="${expectedStatus}"`);
    return false;
  } catch (error) {
    console.error(`Error in isNameWithStatusPresent: ${error.message}`);
    return false;
  }
}



export async function waitForTableLoad(page,) {
  const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
  if (await loader.isVisible().catch(() => false)) {
    await loader.waitFor({ state: "hidden", timeout: 15000 });
  }
}

export async function waitForSpinnerToDisappearInButton(page) {
  const spinnerSelector = 'spinnericon.p-button-loading-icon';

  try {
    await page.waitForSelector(spinnerSelector, { state: 'hidden', timeout: 15000 });
  } catch (error) {
    console.warn(`⚠️ Spinner did not disappear within timeout: ${error.message}`);
  }
}


/**
 * Waits for a toast message, extracts the cloned entity name based on a given prefix.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page instance.
 * @param {string} prefix - The base name pattern to look for (e.g., "data_ingest", "paramlist").
 * @param {number} [timeout=10000] - Optional timeout for toast visibility.
 * @returns {Promise<string>} - The extracted cloned entity name.
 */
export async function extractClonedNameFromToast(page, prefix, timeout = 10000) {
  const toastLocator = page.locator(".p-toast-message");

  // Wait for toast visibility
  await expect(toastLocator).toBeVisible({ timeout });

  const toastText = await toastLocator.innerText();

  // Dynamic regex pattern for matching names like paramlist_pr_automation_1759779880506
  const regex = new RegExp(`(${prefix}_[\\w\\d_]+)\\s+Cloned Successfully`, "i");

  const match = toastText.match(regex);
  if (!match) {
    throw new Error(`❌ Could not extract cloned name with prefix "${prefix}" from toast: ${toastText}`);
  }

  const clonedName = match[1];
  console.log(`✅ Extracted cloned name: ${clonedName}`);

  return clonedName;
}
