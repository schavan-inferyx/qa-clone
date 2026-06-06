// actions.js

/*
1) searchLikeTyping(page, searchText, delay, selector)
2) waitForSpinnerToDisappear(page)
3) fillInputField(page, selector, value)
4) uploadFile(page, selector, filePath)
5) enableRadioButton(selectorOrLocator)
6) fillInputByFormControlName(page, formControlName, inputValue)
7) performActionInListTable(page, columnName, valueToSearch, action)
8) expectActionOpacity(page, actionName, shouldBeDisabled, timeout)
*/


import path from "path";
import { Comman } from "../pages/commans/Common.js";
import { expect } from "../base/BaseTest.js";
import { waitForTableLoad } from "./tableUtils.js";


/**
 * Types into a search input field like a human (with optional delay).
 * Clears the input before typing.
 *
 * @param {object} page - Playwright page object.
 * @param {string} searchText - Text to type in the search input.
 * @param {number} [delay] - Optional typing delay in ms (default: 100ms if not provided).
 * @param {string} [selector] - Optional custom selector for the search input.
 */
export async function searchLikeTyping(
  page,
  searchText,
  delay,
  selector = '.p-datatable-header input[placeholder="Search Keyword"]'
) {
  const searchInput = page.locator(selector);

  await searchInput.waitFor({ state: 'visible' });
  await searchInput.fill(''); // clear existing value

  const typingDelay = delay ?? 10; // default to 100ms if not provided
  await searchInput.type(searchText, { delay: typingDelay });

  await page.waitForTimeout(500); // small buffer for UI updates
}

/**
 * Types text into an input like a real user.
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} text - Text to type
 * @param {number} delay - Delay between keystrokes in ms (optional, default 50ms)
 * @param {string} selector - Input selector (default "#expiryDate")
 */
export async function typeLikeUser(page, text, delay = 50, selector) {
    const input = page.locator(selector);

    await input.waitFor({ state: 'visible' });
    await input.fill(''); // clear existing value
    await input.type(text, { delay }); // types like a human
    await page.waitForTimeout(500); // small buffer for UI updates

}

/**
 * Toggle password visibility by clicking the eye icon.
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} selector - Selector for the eye icon (default: first eyeicon inside p-password)
 */
export async function togglePasswordVisibility(page, selector = 'p-password eyeicon') {
    const eyeIcon = page.locator(selector);
    await eyeIcon.waitFor({ state: 'visible' });
    await eyeIcon.click();
}



/**
 * Waits for the spinner/loading icon to disappear from the page.
 *
 * @param {object} page - Playwright page object.
 */
export async function waitForSpinnerToDisappear(page) {
  const spinnerSelector = 'spinnericon.p-button-loading-icon';

  try {
    await page.waitForSelector(spinnerSelector, { state: 'hidden', timeout: 15000 });
  } catch (error) {
    console.warn(`⚠️ Spinner did not disappear within timeout: ${error.message}`);
  }
}


export async function fillInputField(page, selector, value) {
  await page.locator(selector).click();
  await page.locator(selector).fill(value);
}

export async function uploadFile(page, selector, filePathInput) {
  const filePath = path.resolve(process.cwd(), filePathInput);
  await page.setInputFiles(selector, filePath);
}

export async function enableRadioButton(selectorOrLocator) {
  const locator =
    typeof selectorOrLocator === "string"
      ? this.page.locator(selectorOrLocator)
      : selectorOrLocator;

  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: "visible", timeout: 10000 });

  const isChecked = await locator.isChecked();
  if (!isChecked) {
    await locator.click();
  }
}


/**
 * Fills an input field based on its `formcontrolname` attribute.
 *
 * @param {object} page - Playwright page object.
 * @param {string} formControlName - Value of the `formcontrolname` attribute.
 * @param {string} inputValue - Value to fill in the input.
 */
export async function fillInputByFormControlName(page, formControlName, inputValue) {
  const inputLocator = page.locator(`input[formcontrolname='${formControlName}']`);

  try {
    await inputLocator.waitFor({ state: 'visible' });
    await inputLocator.fill(''); // clear existing value
    await inputLocator.fill(inputValue);
  } catch (error) {
    throw new Error(
      `❌ Failed to fill input with formcontrolname='${formControlName}': ${error.message}`
    );
  }
}


// export async function performActionInListTable(page, columnName, valueToSearch, action) {
//   await searchLikeTyping(page, valueToSearch);
//   const common = new Comman(page);
//   const table = page.locator("table");
//   const headers = table.locator("th");
//   const headerCount = await headers.count();
//   let colIndex = -1;

//   await waitForTableLoad(page)

//   // --- Find column index ---
//   for (let i = 0; i < headerCount; i++) {
//     const headerText = (await headers.nth(i).innerText()).trim();
//     if (headerText.toLowerCase() === columnName.toLowerCase()) {
//       colIndex = i;
//       break;
//     }
//   }
//   if (colIndex === -1)
//     throw new Error(`❌ Column "${columnName}" not found in table.`);

//   const rows = table.locator("tbody tr");
//   const rowCount = await rows.count();
//   let rowActionButton = null;

//   // --- Find the target row ---
//   for (let r = 0; r < rowCount; r++) {
//     const cell = rows.nth(r).locator("td").nth(colIndex);
//     const cellText = (await cell.textContent() || "").trim();

//     if (cellText === valueToSearch) {
//       rowActionButton = rows.nth(r).locator('td button[pbutton][label="Action"]');
//       break;
//     }

//     // Tooltip fallback
//     await cell.hover();
//     await page.waitForTimeout(300);

//     let tooltipText = "";
//     try {
//       const tooltip = page.locator(".p-tooltip-text");
//       if (await tooltip.isVisible()) tooltipText = (await tooltip.innerText()).trim();
//     } catch {
//       tooltipText = "";
//     }

//     if (!tooltipText) {
//       tooltipText = await page.evaluate((el) => {
//         return (
//           el.getAttribute("title") ||
//           el.getAttribute("tooltip") ||
//           el.getAttribute("data-tooltip") ||
//           ""
//         ).trim();
//       }, await cell.elementHandle());
//     }

//     if (tooltipText === valueToSearch) {
//       console.log(`✅ Matched via tooltip: "${tooltipText}"`);
//       rowActionButton = rows.nth(r).locator('td button[pbutton][label="Action"]');
//       break;
//     }
//   }

//   if (!rowActionButton)
//     throw new Error(`❌ Row with value "${valueToSearch}" not found in column "${columnName}".`);

//   // --- Trigger the dropdown ---
//   await rowActionButton.hover();
//   await rowActionButton.click();
//   await waitForSpinnerToDisappear(page);
//   await page.waitForTimeout(300);

//   // --- Map action to dropdown element ---
//   const actionMap = {
//     view: common.viewDropdownMenu,
//     edit: common.editDropdownMenu,
//     delete: common.deleteDropdownMenu,
//     lock: common.lockDropdownMenu,
//     publish: common.publishDropdownMenu,
//     execute: common.executeDropdownMenu,
//     clone: common.cloneDropdownMenu,
//     export: common.exportDropdownMenu,
//     unlock: common.unlockDropdownMenu
//   };

//   const selectedAction = actionMap[action.toLowerCase()];
//   if (!selectedAction)
//     throw new Error(
//       `❌ Unknown action "${action}". Expected one of: ${Object.keys(actionMap).join(", ")}`
//     );

//   // --- Click the dropdown action ---
//   // await selectedAction.waitFor({ state: "visible" });
//   // await selectedAction.click();
//   // await waitForSpinnerToDisappear(page);
//   // --- Click the dropdown action ---
//   await selectedAction.waitFor({ state: "visible" });
//   await selectedAction.click();
//   await waitForSpinnerToDisappear(page);
//   await page.waitForTimeout(200);

//   // --- Click OK button if present ---
//   const okButton = page.getByRole("button", { name: "Ok" });
//   if (await okButton.isVisible()) {
//     await okButton.click();
//     await waitForSpinnerToDisappear(page);
//   }


//   console.log(`✅ Successfully performed "${action}" on "${valueToSearch}" in "${columnName}"`);
// }

export async function performActionInListTable(page, columnName, valueToSearch, action, options = {}) {
  const {
    maxPages = 10, // Maximum pages to search
    searchAllPages = true, // Whether to search through all pages
    exactMatch = true // Whether to use exact match or partial match
  } = options;

  // await searchLikeTyping(page, valueToSearch);
  const common = new Comman(page);
  
  let currentPage = 1;
  let found = false;
  let rowActionButton = null;

  do {
    console.log(`🔍 Searching page ${currentPage}...`);
    
    const table = page.locator("table");
    const headers = table.locator("th");
    const headerCount = await headers.count();
    let colIndex = -1;

    await waitForTableLoad(page);

    // --- Find column index ---
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      if (headerText.toLowerCase() === columnName.toLowerCase()) {
        colIndex = i;
        break;
      }
    }
    if (colIndex === -1)
      throw new Error(`❌ Column "${columnName}" not found in table.`);

    const rows = table.locator("tbody tr");
    const rowCount = await rows.count();
    
    console.log(`Checking ${rowCount} rows on page ${currentPage}`);

    // --- Find the target row ---
    for (let r = 0; r < rowCount; r++) {
      const cell = rows.nth(r).locator("td").nth(colIndex);
      const cellText = (await cell.textContent() || "").trim();

      // Check for direct match
      let isMatch = false;
      if (exactMatch) {
        isMatch = cellText === valueToSearch;
      } else {
        isMatch = cellText.includes(valueToSearch);
      }

      if (isMatch) {
        console.log(`✅ Found match on page ${currentPage}, row ${r}: "${cellText}"`);
        rowActionButton = rows.nth(r).locator('td button[pbutton][label="Action"]');
        found = true;
        break;
      }

      // Tooltip fallback
      if (!found) {
        await cell.hover();
        await page.waitForTimeout(300);

        let tooltipText = "";
        try {
          const tooltip = page.locator(".p-tooltip-text");
          if (await tooltip.isVisible()) tooltipText = (await tooltip.innerText()).trim();
        } catch {
          tooltipText = "";
        }

        if (!tooltipText) {
          tooltipText = await page.evaluate((el) => {
            return (
              el.getAttribute("title") ||
              el.getAttribute("tooltip") ||
              el.getAttribute("data-tooltip") ||
              ""
            ).trim();
          }, await cell.elementHandle());
        }

        if (exactMatch) {
          isMatch = tooltipText === valueToSearch;
        } else {
          isMatch = tooltipText.includes(valueToSearch);
        }

        if (isMatch) {
          console.log(`✅ Found match via tooltip on page ${currentPage}, row ${r}: "${tooltipText}"`);
          rowActionButton = rows.nth(r).locator('td button[pbutton][label="Action"]');
          found = true;
          break;
        }
      }
    }

    // If found, break out of pagination loop
    if (found) break;

    // Check if we should continue to next page
    if (searchAllPages && currentPage < maxPages) {
      const hasNextPage = await goToNextPage(page);
      if (hasNextPage) {
        currentPage++;
        await waitForTableLoad(page);
        await page.waitForTimeout(1000); // Wait for page to load
      } else {
        console.log(`ℹ️ No more pages available. Searched ${currentPage} pages.`);
        break;
      }
    } else {
      break;
    }
  } while (currentPage <= maxPages && !found);

  if (!found || !rowActionButton) {
    throw new Error(`❌ Row with value "${valueToSearch}" not found in column "${columnName}" after searching ${currentPage} pages.`);
  }

  // --- Trigger the dropdown ---
  await rowActionButton.hover();
  await rowActionButton.click();
  await waitForSpinnerToDisappear(page);
  await page.waitForTimeout(300);

  // --- Map action to dropdown element ---
  const actionMap = {
    view: common.viewDropdownMenu,
    edit: common.editDropdownMenu,
    delete: common.deleteDropdownMenu,
    lock: common.lockDropdownMenu,
    publish: common.publishDropdownMenu,
    execute: common.executeDropdownMenu,
    clone: common.cloneDropdownMenu,
    export: common.exportDropdownMenu,
    unlock: common.unlockDropdownMenu
  };

  const selectedAction = actionMap[action.toLowerCase()];
  if (!selectedAction)
    throw new Error(
      `❌ Unknown action "${action}". Expected one of: ${Object.keys(actionMap).join(", ")}`
    );

  // --- Click the dropdown action ---
  await selectedAction.waitFor({ state: "visible" });
  await selectedAction.click();
  await waitForSpinnerToDisappear(page);
  await page.waitForTimeout(200);

  // --- Click OK button if present ---
  const okButton = page.getByRole("button", { name: "Ok" });
  if (await okButton.isVisible()) {
    await okButton.click();
    await waitForSpinnerToDisappear(page);
  }

  console.log(`✅ Successfully performed "${action}" on "${valueToSearch}" in "${columnName}" on page ${currentPage}`);
}

/**
 * Navigate to next page in the table
 */
async function goToNextPage(page) {
  try {
    const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
    
    if (await nextButton.isVisible({ timeout: 3000 })) {
      await nextButton.click();
      await page.waitForTimeout(500); // Wait for page transition
      return true;
    }
    return false;
  } catch (error) {
    console.log('No next page found or error clicking next:', error);
    return false;
  }
}


export async function expectActionOpacity(page, actionName, shouldBeDisabled, timeout = 5000) {
  const actionLocator = page.locator(`//tr[.//span[normalize-space(text())="${actionName}"]]`);
  await actionLocator.waitFor({ state: "visible", timeout: 3000 });

  const startTime = Date.now();
  let lastOpacity = null;
  let isDisabled = null;

  // 🔁 Poll until opacity reaches stable and expected value or timeout
  while (Date.now() - startTime < timeout) {
    const opacity = await actionLocator.evaluate(el => window.getComputedStyle(el).opacity);
    lastOpacity = opacity;
    isDisabled = parseFloat(opacity) < 1;

    if (isDisabled === shouldBeDisabled) {
      break; // ✅ desired state reached
    }

    await page.waitForTimeout(300); // short retry delay
  }

  // console.log(
  //   `Action: ${actionName} | final opacity=${lastOpacity} | detectedDisabled=${isDisabled} | expectedDisabled=${shouldBeDisabled}`
  // );

  await expect(
    isDisabled,
    `Action "${actionName}" expected disabled=${shouldBeDisabled}, but opacity=${lastOpacity}`
  ).toBe(shouldBeDisabled);
};

/**
 * Sets expiry date to today + 1 year in a p-calendar input.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - Input selector (default '#expiryDate')
 */
export async function setExpiryDate(page, selector = '#expiryDate') {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    const input = page.locator(selector);
    
    // Try different date formats that PrimeNG might accept
    const formats = [
        `${(nextYear.getMonth() + 1)}/${nextYear.getDate()}/${nextYear.getFullYear()}`, // M/D/YYYY
        `${(nextYear.getMonth() + 1).toString().padStart(2, '0')}/${nextYear.getDate().toString().padStart(2, '0')}/${nextYear.getFullYear()}`, // MM/DD/YYYY
        `${nextYear.getFullYear()}-${(nextYear.getMonth() + 1).toString().padStart(2, '0')}-${nextYear.getDate().toString().padStart(2, '0')}` // YYYY-MM-DD
    ];

    // Clear any existing value
    await input.click();
    await input.clear();
    
    // Try the first format
    await input.fill(formats[0]);
    
    // Trigger events
    await input.press('Tab');
    
    // Verify the date was accepted
    const currentValue = await input.inputValue();
    if (!currentValue) {
        // If first format didn't work, try others
        for (let i = 1; i < formats.length; i++) {
            await input.clear();
            await input.fill(formats[i]);
            await input.press('Tab');
            await page.waitForTimeout(200);
            
            if (await input.inputValue()) {
                break;
            }
        }
    }
    
    // Final verification
    await page.waitForTimeout(500);
}


// export async function setExpiryDateNewUI(page, calendarRootLocator) {

//   const root = page.locator(calendarRootLocator);

//   const today = new Date();
//   const nextYear = today.getFullYear() + 1;
//   const month = today.toLocaleString("default", { month: "long" });
//   const day = today.getDate();

//   /* open calendar */
//   await root.locator("button[aria-label='Choose Date']").click();

//   /* wait for popup */
//   const popup = page.locator(".p-datepicker");
//   await popup.waitFor({ state: "visible" });

//   /* select year */
//   await popup.locator(".p-datepicker-year").click();
//   await page.getByText(String(nextYear), { exact: true }).click();

//   /* select month */
//   await popup.locator(".p-datepicker-month").click();
//   await page.getByText(month, { exact: true }).click();

//   /* select day */
//   await popup.locator(`[data-date='${nextYear}-${today.getMonth()}-${day}']`).click();

// }

export async function setExpiryDateNewUI(page, calendarRootLocator) {

  const root = page.locator(calendarRootLocator);

  const today = new Date();
  const targetYear = today.getFullYear() + 1;
  const targetMonthShort = today.toLocaleString("default", { month: "short" });
  const targetMonthIndex = today.getMonth();
  const targetDay = today.getDate();

  /* open calendar */
  await root.locator("button[aria-label='Choose Date']").click();

  const popup = page.locator(".p-datepicker");
  await popup.waitFor({ state: "visible" });

  /* select year */
  await popup.locator(".p-datepicker-year").click();

  await page
    .locator(".p-yearpicker-year")
    .filter({ hasText: String(targetYear) })
    .click();

  /* wait for month picker */
  const monthPicker = popup.locator(".p-monthpicker");
  await monthPicker.waitFor({ state: "visible" });

  /* select month */
  await monthPicker
    .locator(".p-monthpicker-month")
    .filter({ hasText: targetMonthShort })
    .click();

  /* wait for day grid */
  const dayGrid = popup.locator(".p-datepicker-calendar");
  await dayGrid.waitFor({ state: "visible" });

  /* select day */
  await dayGrid
    .locator(`[data-date='${targetYear}-${targetMonthIndex}-${targetDay}']`)
    .click();

}


export async function setDateCalendarNew(page, calendarRoot, dateString) {

  /* calendarRoot MUST be locator */
  const root = calendarRoot;

  const target = new Date(dateString);

  const year = target.getFullYear();
  const monthShort = target.toLocaleString("default", { month: "short" });
  const monthIndex = target.getMonth();
  const day = target.getDate();

  /* open calendar */
  await root
    .locator("button[aria-label='Choose Date']")
    .click();

  const popup = page.locator(".p-datepicker");
  await popup.waitFor({ state: "visible" });

  /* select year */
  await popup.locator(".p-datepicker-year").click();

  await page
    .locator(".p-yearpicker-year")
    .filter({ hasText: String(year) })
    .click();

  /* select month */
  const monthPicker = popup.locator(".p-monthpicker");

  if (await monthPicker.isVisible()) {

    await monthPicker
      .locator(".p-monthpicker-month")
      .filter({ hasText: monthShort })
      .click();

  }

  /* select day */
  await popup
    .locator(`[data-date='${year}-${monthIndex}-${day}']`)
    .click();

}

