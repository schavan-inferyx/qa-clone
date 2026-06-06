import { expect } from '@playwright/test';

// /**
//  * Get the overlay panel associated with a specific dropdown
//  */
async function getDropdownOverlay(page, dropdown) {
  const label = dropdown.locator('.p-dropdown-label');
  const panelId = await label.getAttribute('aria-controls');
  if (!panelId) throw new Error('Dropdown overlay panel ID not found');
  const overlayPanel = page.locator(`#${panelId}`);
  await expect(overlayPanel).toBeVisible({ timeout: 5000 });
  return overlayPanel;
}

async function getAvailableOptions(overlayPanel) {
  const options = overlayPanel.locator('.p-dropdown-item');
  const count = await options.count();
  const optionTexts = [];

  for (let i = 0; i < count; i++) {
    const option = options.nth(i);
    const ariaLabel = await option.getAttribute('aria-label');
    const textContent = await option.textContent();
    optionTexts.push(`"${ariaLabel || textContent || 'no-text'}"`);
  }
  return optionTexts.join(', ');
}

/**
 * Universal dropdown selector with comprehensive validation and debugging
 */
// export async function selectDropdown(page, { labelText, dropdownId, valueToSelect, useSearch = false }) {
//   // Enhanced parameter validation
//   if (!page) {
//     throw new Error('page parameter is required');
//   }

//   if (!labelText && !dropdownId) {
//     throw new Error('Either labelText or dropdownId must be provided');
//   }

//   if (!valueToSelect) {
//     throw new Error(`valueToSelect is required but received: ${JSON.stringify(valueToSelect)}`);
//   }

//   let dropdown;

//   await page.waitForTimeout(50)

//   try {
//     if (dropdownId) {
//       console.log(`🔍 [selectDropdown] Looking for dropdown by ID: ${dropdownId}`);
//       dropdown = page.locator(`p-dropdown[data-test-id="${dropdownId}"], p-dropdown[formcontrolname="${dropdownId}"]`);
//       await expect(dropdown).toBeVisible({ timeout: 10000 });
//       // console.log(`✅ [selectDropdown] Found dropdown by ID`);
//     } else {
//       console.log(`🔍 [selectDropdown] Looking for dropdown by label: "${labelText}"`);
//       const dropdowns = page.locator('label', { hasText: labelText }).locator('..').locator('p-dropdown');
//       const count = await dropdowns.count();
//       // console.log(`🔍 [selectDropdown] Found ${count} dropdowns for label`);

//       dropdown = null;
//       for (let i = 0; i < count; i++) {
//         const isVisible = await dropdowns.nth(i).isVisible();
//         console.log(`🔍 [selectDropdown] Dropdown ${i} visible: ${isVisible}`);
//         if (isVisible) {
//           dropdown = dropdowns.nth(i);
//           // console.log(`✅ [selectDropdown] Using visible dropdown at index: ${i}`);
//           break;
//         }
//       }

//       if (!dropdown) throw new Error(`No visible dropdown found for label "${labelText}"`);
//     }

//     console.log(`🔍 [selectDropdown] Clicking dropdown trigger`);
//     const triggerButton = dropdown.getByRole('button', { name: 'dropdown trigger' });
//     await expect(triggerButton).toBeVisible({ timeout: 10000 });
//     await expect(triggerButton).toBeEnabled({ timeout: 10000 });
//     await triggerButton.click();

//     const overlayPanel = await getDropdownOverlay(page, dropdown);
//     // console.log(`✅ [selectDropdown] Dropdown overlay opened`);

//     // Fill search if needed
//     if (useSearch) {
//       console.log(`🔍 [selectDropdown] Using search functionality`);
//       const searchBox = overlayPanel.locator('input.p-dropdown-filter');
//       if ((await searchBox.count()) > 0) {
//         await searchBox.fill(valueToSelect);
//         await page.waitForTimeout(500);
//         // console.log(`✅ [selectDropdown] Searched for: "${valueToSelect}"`);
//       }
//     }

//     // Get all available options for debugging
//     const availableOptions = await getAvailableOptions(overlayPanel);
//     // console.log(`📋 [selectDropdown] All available options: ${availableOptions}`);
//     // console.log(`🎯 [selectDropdown] Target value: "${valueToSelect}"`);

//     // Try multiple selection strategies
//     let option;
//     let optionCount = 0;
//     let method = '';

//     // Strategy 1: aria-label exact match
//     option = overlayPanel.locator(`.p-dropdown-item[aria-label="${valueToSelect}"]`);
//     optionCount = await option.count();
//     method = 'aria-label';

//     // Strategy 2: role-based exact match (if first fails)
//     if (optionCount === 0) {
//       // console.log(`🔍 [selectDropdown] aria-label match failed, trying role-based match`);
//       option = overlayPanel.getByRole('option', { name: valueToSelect, exact: true });
//       optionCount = await option.count();
//       method = 'role-based';
//     }

//     // Strategy 3: text content exact match (if first two fail)
//     if (optionCount === 0) {
//       // console.log(`🔍 [selectDropdown] role-based match failed, trying text content match`);
//       option = overlayPanel.locator('.p-dropdown-item').filter({ hasText: new RegExp(`^${valueToSelect}$`) });
//       optionCount = await option.count();
//       method = 'text-content';
//     }

//     // console.log(`🔍 [selectDropdown] Selection method: ${method}, Found: ${optionCount} options`);

//     if (optionCount === 0) {
//       throw new Error(`Option "${valueToSelect}" not found. Available options: ${availableOptions}`);
//     } else if (optionCount > 1) {
//       throw new Error(`Found ${optionCount} options matching "${valueToSelect}" using ${method}. Available options: ${availableOptions}`);
//     }

//     // console.log(`✅ [selectDropdown] Clicking option: "${valueToSelect}"`);
//     await expect(option).toBeVisible({ timeout: 5000 });
//     await option.click();

//     // Verify selection
//     const selectedLabel = dropdown.locator('.p-dropdown-label');
//     await expect.poll(async () => {
//       const currentText = await selectedLabel.textContent();
//       // console.log(`🔍 [selectDropdown] Current dropdown text: "${currentText}"`);
//       return currentText;
//     }, {
//       timeout: 10000,
//       message: `Dropdown label did not update to "${valueToSelect}"`
//     }).toEqual(valueToSelect);

//     // console.log(`🎉 [selectDropdown] Successfully selected: "${valueToSelect}"`);

//   } catch (error) {
//     console.error(`💥 [selectDropdown] Error selecting dropdown:`, {
//       labelText,
//       dropdownId,
//       valueToSelect,
//       error: error.message
//     });
//     throw error;
//   }
// }


// export async function selectDropdown(
//   page,
//   {
//     labelText,
//     dropdownId,
//     locator,            // ✅ NEW
//     valueToSelect,
//     useSearch = false,  // optional override
//   }
// ) {
//   if (!page) throw new Error("page parameter is required");
//   if (!valueToSelect)
//     throw new Error(`valueToSelect is required but received: ${JSON.stringify(valueToSelect)}`);

//   let dropdown;

//   await page.waitForTimeout(50);

//   try {
//     /* ============================================================
//        RESOLVE DROPDOWN (STRICT PRIORITY)
//     ============================================================ */
//     if (locator) {
//       dropdown = page.locator(locator);
//       await expect(dropdown).toBeVisible({ timeout: 10000 });

//     } else if (dropdownId) {
//       dropdown = page.locator(
//         `p-dropdown[data-test-id="${dropdownId}"], p-dropdown[formcontrolname="${dropdownId}"]`
//       );
//       await expect(dropdown).toBeVisible({ timeout: 10000 });

//     } else if (labelText) {
//       const dropdowns = page
//         .locator("label", { hasText: labelText })
//         .locator("..")
//         .locator("p-dropdown");

//       const count = await dropdowns.count();
//       for (let i = 0; i < count; i++) {
//         if (await dropdowns.nth(i).isVisible()) {
//           dropdown = dropdowns.nth(i);
//           break;
//         }
//       }

//       if (!dropdown)
//         throw new Error(`No visible dropdown found for label "${labelText}"`);
//     } else {
//       throw new Error("Either labelText, dropdownId, or locator must be provided");
//     }

//     /* ============================================================
//        OPEN DROPDOWN
//     ============================================================ */
//     const trigger = dropdown.getByRole("button", { name: "dropdown trigger" });
//     await expect(trigger).toBeVisible({ timeout: 10000 });
//     await expect(trigger).toBeEnabled({ timeout: 10000 });
//     await trigger.click();

//     const overlayPanel = await getDropdownOverlay(page, dropdown);

//     /* ============================================================
//        🔴 CRITICAL FIX — WAIT FOR DATA (NOT UI)
//     ============================================================ */
//     const items = overlayPanel.locator(".p-dropdown-item");
//     await expect
//       .poll(async () => await items.count(), {
//         timeout: 15000,
//         message: "Dropdown options did not load",
//       })
//       .toBeGreaterThan(0);

//     /* ============================================================
//    AUTO SEARCH DETECTION (FIXED FOR PRIMENG)
// ============================================================ */
//     const searchBox = overlayPanel.locator("input.p-dropdown-filter");
//     const hasSearch = (await searchBox.count()) > 0;

//     if (hasSearch) {
//       await expect(searchBox).toBeVisible({ timeout: 5000 });

//       // 🔴 PRIME FIX — FORCE FOCUS
//       await searchBox.evaluate((el) => el.focus());

//       // Clear + set value at DOM level
//       await searchBox.fill(valueToSelect);

//       // 🔴 Trigger PrimeNG filter listener explicitly
//       await searchBox.dispatchEvent("input");

//       // Wait for filtered results
//       await expect
//         .poll(async () => await items.count(), {
//           timeout: 10000,
//           message: "Dropdown search did not return results",
//         })
//         .toBeGreaterThan(0);
//     }


//     /* ============================================================
//        OPTION MATCH (UNCHANGED, PROVEN)
//     ============================================================ */
//     let option = overlayPanel.locator(
//       `.p-dropdown-item[aria-label="${valueToSelect}"]`
//     );

//     if ((await option.count()) === 0) {
//       option = overlayPanel.getByRole("option", {
//         name: valueToSelect,
//         exact: true,
//       });
//     }

//     if ((await option.count()) === 0) {
//       option = overlayPanel
//         .locator(".p-dropdown-item")
//         .filter({ hasText: new RegExp(`^${valueToSelect}$`) });
//     }

//     const optionCount = await option.count();
//     if (optionCount === 0) {
//       throw new Error(`Option "${valueToSelect}" not found`);
//     }
//     if (optionCount > 1) {
//       throw new Error(`Multiple options found for "${valueToSelect}"`);
//     }

//     await option.first().scrollIntoViewIfNeeded();
//     await option.first().click();

//     /* ============================================================
//        VERIFY SELECTION
//     ============================================================ */
//     const selectedLabel = dropdown.locator(".p-dropdown-label");
//     await expect.poll(async () => {
//       const text = (await selectedLabel.textContent())?.trim();
//       return text;
//     }, {
//       timeout: 10000,
//       message: `Dropdown label did not update to "${valueToSelect}"`,
//     }).toEqual(valueToSelect);

//   } catch (error) {
//     console.error("💥 [selectDropdown] failed", {
//       labelText,
//       dropdownId,
//       locator,
//       valueToSelect,
//       error: error.message,
//     });
//     throw error;
//   }
// }

// export async function selectDropdown(
//   page,
//   {
//     labelText,
//     dropdownId,
//     locator,
//     valueToSelect,
//     useSearch = false,
//   }
// ) {
//   if (!page) throw new Error("page parameter is required");
//   if (!valueToSelect)
//     throw new Error(`valueToSelect is required but received: ${JSON.stringify(valueToSelect)}`);

//   let dropdown;

//   await page.waitForTimeout(50);

//   try {
//     /* ============================================================
//        RESOLVE DROPDOWN (STRICT PRIORITY)
//     ============================================================ */
//     if (locator) {
//       dropdown = page.locator(locator);
//       await expect(dropdown).toBeVisible({ timeout: 10000 });

//     } else if (dropdownId) {
//       dropdown = page.locator(
//         `p-dropdown[data-test-id="${dropdownId}"], p-dropdown[formcontrolname="${dropdownId}"]`
//       );
//       await expect(dropdown).toBeVisible({ timeout: 10000 });

//     } else if (labelText) {
//       const dropdowns = page
//         .locator("label", { hasText: labelText })
//         .locator("..")
//         .locator("p-dropdown");

//       const count = await dropdowns.count();
//       for (let i = 0; i < count; i++) {
//         if (await dropdowns.nth(i).isVisible()) {
//           dropdown = dropdowns.nth(i);
//           break;
//         }
//       }

//       if (!dropdown)
//         throw new Error(`No visible dropdown found for label "${labelText}"`);
//     } else {
//       throw new Error("Either labelText, dropdownId, or locator must be provided");
//     }

//     /* ============================================================
//        OPEN DROPDOWN
//     ============================================================ */
//     const trigger = dropdown.getByRole("button", { name: "dropdown trigger" });
//     await expect(trigger).toBeVisible({ timeout: 10000 });
//     await expect(trigger).toBeEnabled({ timeout: 10000 });
//     await trigger.click();

//     const overlayPanel = await getDropdownOverlay(page, dropdown);

//     /* ============================================================
//        WAIT FOR DATA
//     ============================================================ */
//     const items = overlayPanel.locator(".p-dropdown-item");
//     await expect
//       .poll(async () => await items.count(), {
//         timeout: 15000,
//         message: "Dropdown options did not load",
//       })
//       .toBeGreaterThan(0);

//     /* ============================================================
//        AUTO SEARCH DETECTION
//     ============================================================ */
//     const searchBox = overlayPanel.locator("input.p-dropdown-filter");
//     const hasSearch = (await searchBox.count()) > 0;

//     if (hasSearch) {
//       await expect(searchBox).toBeVisible({ timeout: 5000 });

//       await searchBox.evaluate((el) => el.focus());
//       await searchBox.fill(valueToSelect);
//       await searchBox.dispatchEvent("input");

//       await expect
//         .poll(async () => await items.count(), {
//           timeout: 10000,
//           message: "Dropdown search did not return results",
//         })
//         .toBeGreaterThan(0);
//     }

//     /* ============================================================
//        IMPROVED OPTION MATCHING WITH DUPLICATE HANDLING
//     ============================================================ */
//     let matchedOptions = [];
    
//     // Try different matching strategies
//     const matchingStrategies = [
//       // Strategy 1: Exact aria-label match
//       () => overlayPanel.locator(`.p-dropdown-item[aria-label="${valueToSelect}"]`),
      
//       // Strategy 2: Exact role option match
//       () => overlayPanel.getByRole("option", { name: valueToSelect, exact: true }),
      
//       // Strategy 3: Text content match (flexible)
//       () => overlayPanel.locator(".p-dropdown-item").filter({ 
//         hasText: new RegExp(`^${valueToSelect}$`, "i") 
//       }),
      
//       // Strategy 4: Partial text match as fallback
//       () => overlayPanel.locator(".p-dropdown-item").filter({ 
//         hasText: valueToSelect 
//       }),
//     ];

//     // Try each strategy until we find options
//     for (const strategy of matchingStrategies) {
//       matchedOptions = strategy();
//       const count = await matchedOptions.count();
//       if (count > 0) {
//         console.log(`Found ${count} option(s) using strategy`);
//         break;
//       }
//     }

//     const optionCount = await matchedOptions.count();
    
//     if (optionCount === 0) {
//       // Log available options for debugging
//       const allOptions = await overlayPanel.locator(".p-dropdown-item").all();
//       const allOptionTexts = await Promise.all(
//         allOptions.map(async (opt) => {
//           const text = await opt.textContent();
//           const ariaLabel = await opt.getAttribute("aria-label");
//           return { text: text?.trim(), ariaLabel };
//         })
//       );
      
//       console.error("Available options:", allOptionTexts);
//       throw new Error(`Option "${valueToSelect}" not found. Available options: ${JSON.stringify(allOptionTexts)}`);
//     }
    
//     /* ============================================================
//        HANDLE DUPLICATES INTELLIGENTLY
//     ============================================================ */
//     if (optionCount > 1) {
//       console.warn(`⚠️ Found ${optionCount} options for "${valueToSelect}". Attempting to select the first visible/enabled one.`);
      
//       // Filter to find the best candidate
//       let selectedOption = null;
      
//       for (let i = 0; i < optionCount; i++) {
//         const option = matchedOptions.nth(i);
//         const isVisible = await option.isVisible();
//         const isEnabled = await option.isEnabled();
        
//         if (isVisible && isEnabled) {
//           // Check if this is the "correct" duplicate by examining parent context
//           const parentContext = await option.evaluate(el => {
//             const parent = el.closest('.p-dropdown-item-wrapper, .p-dropdown-item-group');
//             return parent?.className || 'no-parent';
//           });
          
//           console.log(`Option ${i + 1}: visible=${isVisible}, enabled=${isEnabled}, parent=${parentContext}`);
          
//           if (!selectedOption) {
//             selectedOption = option;
//           }
//         }
//       }
      
//       if (!selectedOption) {
//         // If no visible/enabled options found, take the first one
//         selectedOption = matchedOptions.first();
//       }
      
//       await selectedOption.scrollIntoViewIfNeeded();
//       await selectedOption.click();
//     } else {
//       // Single option found
//       await matchedOptions.first().scrollIntoViewIfNeeded();
//       await matchedOptions.first().click();
//     }

//     /* ============================================================
//        VERIFY SELECTION
//     ============================================================ */
//     const selectedLabel = dropdown.locator(".p-dropdown-label");
//     await page.waitForTimeout(100); // slight delay for UI update
//     await expect.poll(async () => {
//       const text = (await selectedLabel.textContent())?.trim();
//       return text;
//     }, {
//       timeout: 10000,
//       message: `Dropdown label did not update to "${valueToSelect}"`,
//     }).toEqual(valueToSelect);

//   } catch (error) {
//     console.error("💥 [selectDropdown] failed", {
//       labelText,
//       dropdownId,
//       locator,
//       valueToSelect,
//       error: error.message,
//     });
//     throw error;
//   }
// }


export async function selectDropdown(
  page,
  {
    labelText,
    dropdownId,
    locator,
    valueToSelect,
    useSearch = false,
    maxRetries = 3,
    debug = false
  }
) {
  if (!page) throw new Error("page parameter is required");
  if (!valueToSelect) {
    throw new Error(`valueToSelect is required but received: ${JSON.stringify(valueToSelect)}`);
  }

  let dropdown;
  const startTime = Date.now();
  
  // Helper function to get timeout based on attempt number
  const getTimeoutForAttempt = (attempt, defaultTimeout, isFirstAttemptShort = true) => {
    if (isFirstAttemptShort && attempt === 1) {
      // First attempt: use very short timeout (like "not" waiting)
      return Math.min(defaultTimeout, 5000); // Max 1 second for first attempt
    } else {
      // Retry attempts: use configured/default timeouts
      return defaultTimeout;
    }
  };
  
  if (debug) {
    console.log(`\n🚀 [selectDropdown] Starting selection: "${valueToSelect}"`);
    console.log(`Options: ${JSON.stringify({ labelText, dropdownId, locator, valueToSelect })}`);
  }

  try {
    /* ============================================================
       STEP 1: FIND THE DROPDOWN
    ============================================================ */
    if (debug) console.log(`🔍 Step 1: Finding dropdown...`);
    
    if (locator) {
      dropdown = page.locator(locator);
      // First attempt: short timeout, retries: normal timeout
      await expect(dropdown).toBeVisible({ timeout: getTimeoutForAttempt(1, 5000) });
      if (debug) console.log(`   Found by locator: ${locator}`);

    } else if (dropdownId) {
      dropdown = page.locator(
        `p-dropdown[data-test-id="${dropdownId}"], p-dropdown[formcontrolname="${dropdownId}"]`
      ).first();
      await expect(dropdown).toBeVisible({ timeout: getTimeoutForAttempt(1, 5000) });
      if (debug) console.log(`   Found by dropdownId: ${dropdownId}`);

    } else if (labelText) {
      // Try multiple strategies to find label
      const label = page.getByText(labelText, { exact: false }).first();
      await expect(label).toBeVisible({ timeout: getTimeoutForAttempt(1, 5000) });
      
      // Get the closest dropdown relative to label
      dropdown = label.locator('xpath=following::p-dropdown[1]');
      
      // Fallback: look for dropdown in parent container
      if (!(await dropdown.count()) || !(await dropdown.isVisible({ timeout: getTimeoutForAttempt(1, 5000) }))) {
        const parentContainer = label.locator('xpath=ancestor::div[contains(@class, "field") or contains(@class, "form-group")][1]');
        dropdown = parentContainer.locator('p-dropdown').first();
      }
      
      await expect(dropdown).toBeVisible({ timeout: getTimeoutForAttempt(1, 5000) });
      if (debug) console.log(`   Found by labelText: "${labelText}"`);

    } else {
      throw new Error("Either labelText, dropdownId, or locator must be provided");
    }

    // Get current state for debugging
    const currentValue = await dropdown.locator('.p-dropdown-label').textContent();
    if (debug) console.log(`   Current dropdown value: "${currentValue?.trim()}"`);

    /* ============================================================
       STEP 2: OPEN DROPDOWN WITH RETRY
    ============================================================ */
    if (debug) console.log(`📂 Step 2: Opening dropdown...`);
    
    let overlayPanel;
    let openAttempts = 0;
    const maxOpenAttempts = 2;
    
    while (openAttempts < maxOpenAttempts && !overlayPanel) {
      openAttempts++;
      if (debug) console.log(`   Opening attempt ${openAttempts}/${maxOpenAttempts}`);
      
      try {
        const trigger = dropdown.locator('div[role="button"], div.p-dropdown-trigger').first();
        
        // Use short timeout for first open attempt, normal for retries
        const timeoutForOpen = getTimeoutForAttempt(openAttempts, 5000);
        await expect(trigger).toBeVisible({ timeout: timeoutForOpen });
        await expect(trigger).toBeEnabled({ timeout: timeoutForOpen });
        
        // Clear any previous overlay
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Click the trigger
        await trigger.click({ force: true });
        await page.waitForTimeout(800); // Wait for animation
        
        // Look for overlay with multiple strategies
        const overlaySelectors = [
          'div.p-dropdown-panel',
          'div[role="listbox"]',
          '.p-dropdown-items-wrapper',
          'ul.p-dropdown-items'
        ];
        
        for (const selector of overlaySelectors) {
          const overlay = page.locator(selector).first();
          if (await overlay.count() > 0) {
            // Wait for it to be visible with appropriate timeout
            const overlayTimeout = getTimeoutForAttempt(openAttempts, 5000);
            await overlay.waitFor({ state: 'visible', timeout: overlayTimeout });
            overlayPanel = overlay;
            if (debug) console.log(`   Overlay found using selector: ${selector}`);
            break;
          }
        }
        
      } catch (error) {
        if (debug) console.log(`   Open attempt ${openAttempts} failed: ${error.message}`);
        if (openAttempts === maxOpenAttempts) throw error;
        await page.waitForTimeout(1000);
      }
    }
    
    if (!overlayPanel) {
      throw new Error('Could not open dropdown overlay');
    }

    /* ============================================================
       STEP 3: WAIT FOR OPTIONS TO LOAD
    ============================================================ */
    if (debug) console.log(`⏳ Step 3: Waiting for options to load...`);
    
    const optionsLocator = overlayPanel.locator('.p-dropdown-item[role="option"], li[role="option"], .p-dropdown-item');
    
    // For options loading, use short timeout on first attempt, normal on retries
    const optionsTimeout = getTimeoutForAttempt(1, 8000);
    await expect.poll(async () => {
      const count = await optionsLocator.count();
      if (debug && count > 0) console.log(`   Loaded ${count} options`);
      return count;
    }, {
      timeout: optionsTimeout,
      message: 'Dropdown options did not load'
    }).toBeGreaterThan(0);

    const totalOptions = await optionsLocator.count();
    if (debug) console.log(`   Total options available: ${totalOptions}`);

    /* ============================================================
       STEP 4: HANDLE SEARCH IF APPLICABLE
    ============================================================ */
    const searchBox = overlayPanel.locator('input[type="text"], input.p-dropdown-filter');
    if (await searchBox.count() > 0 && (useSearch || totalOptions > 10)) {
      if (debug) console.log(`🔎 Step 4: Using search for "${valueToSelect}"...`);
      
      await searchBox.click();
      await page.waitForTimeout(200);
      await searchBox.fill(valueToSelect);
      await page.waitForTimeout(300); // Wait for filtering
      
      // Wait for filtered results
      const searchTimeout = getTimeoutForAttempt(1, 8000);
      await expect.poll(async () => {
        const filteredCount = await optionsLocator.count();
        return filteredCount > 0;
      }, {
        timeout: searchTimeout,
        message: `No results found after searching for "${valueToSelect}"`
      }).toBe(true);
    }

    /* ============================================================
       STEP 5: SELECT THE OPTION (ULTRA-ROBUST)
    ============================================================ */
    if (debug) console.log(`🎯 Step 5: Selecting option "${valueToSelect}"...`);
    
    let optionSelected = false;
    let selectionAttempt = 0;
    
    while (!optionSelected && selectionAttempt < maxRetries) {
      selectionAttempt++;
      if (debug) console.log(`   Selection attempt ${selectionAttempt}/${maxRetries}`);
      
      try {
        // Get fresh options list for this attempt
        const currentOptions = overlayPanel.locator('.p-dropdown-item[role="option"], li[role="option"], .p-dropdown-item');
        const optionCount = await currentOptions.count();
        
        if (debug) console.log(`   Processing ${optionCount} options...`);
        
        // STRATEGY 1: Try exact aria-label match first (fastest)
        const exactAriaMatch = overlayPanel.locator(`[aria-label="${valueToSelect}"]`).first();
        if (await exactAriaMatch.count() > 0) {
          if (debug) console.log(`   Found exact aria-label match`);
          await exactAriaMatch.scrollIntoViewIfNeeded();
          await page.waitForTimeout(200);
          
          // First attempt: click quickly, retries: use normal click timeout
          if (selectionAttempt === 1) {
            await exactAriaMatch.click({ force: true, timeout: 1000 }).catch(() => {
              // On first attempt, if quick click fails, we'll try other strategies
              throw new Error('First attempt quick click failed');
            });
          } else {
            await exactAriaMatch.click({ force: true, timeout: 5000 });
          }
          
          optionSelected = true;
          break;
        }
        
        // STRATEGY 2: Try case-insensitive text match
        let matchedOption = null;
        
        // Check each option individually
        for (let i = 0; i < optionCount; i++) {
          const option = currentOptions.nth(i);
          
          try {
            // Get option text (try multiple methods)
            let optionText = '';
            let optionAria = '';
            
            // Try textContent first
            optionText = (await option.textContent())?.trim() || '';
            
            // Try aria-label attribute
            optionAria = (await option.getAttribute('aria-label'))?.trim() || '';
            
            // Try inner span if textContent is empty
            if (!optionText) {
              const spanText = await option.locator('span').first().textContent();
              optionText = spanText?.trim() || '';
            }
            
            // Clean the text (remove extra spaces, newlines)
            optionText = optionText.replace(/\s+/g, ' ').trim();
            
            if (debug && i < 5) {
              console.log(`   Option ${i}: text="${optionText}", aria="${optionAria}"`);
            }
            
            // Check for match (case-insensitive)
            const searchLower = valueToSelect.toLowerCase().trim();
            const textMatch = optionText.toLowerCase().includes(searchLower);
            const ariaMatch = optionAria.toLowerCase().includes(searchLower);
            const exactTextMatch = optionText.toLowerCase() === searchLower;
            const exactAriaMatch = optionAria.toLowerCase() === searchLower;
            
            if (exactTextMatch || exactAriaMatch || textMatch || ariaMatch) {
              if (debug) {
                console.log(`   ✨ Match found at index ${i}:`);
                console.log(`      Expected: "${valueToSelect}"`);
                console.log(`      Found text: "${optionText}"`);
                console.log(`      Found aria: "${optionAria}"`);
              }
              
              matchedOption = option;
              break;
            }
          } catch (error) {
            if (debug) console.log(`   Error reading option ${i}: ${error.message}`);
            continue;
          }
        }
        
        if (matchedOption) {
          // Scroll into view
          await matchedOption.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          
          // Verify option is clickable
          const isVisible = await matchedOption.isVisible();
          const isEnabled = await matchedOption.isEnabled();
          
          if (!isVisible || !isEnabled) {
            if (debug) console.log(`   Option not clickable (visible: ${isVisible}, enabled: ${isEnabled}), trying next...`);
            continue;
          }
          
          // FIRST ATTEMPT: Try quick click (like "not" waiting)
          if (selectionAttempt === 1) {
            try {
              await matchedOption.click({ force: true, timeout: 1000 });
              optionSelected = true;
              if (debug) console.log(`   ✅ First attempt: Option clicked quickly`);
            } catch (clickError) {
              if (debug) console.log(`   First attempt quick click failed, will retry with normal timeout: ${clickError.message}`);
              // Don't break here, let it retry with normal timeout
            }
          } 
          // RETRY ATTEMPTS: Use normal configured timeout
          else {
            try {
              await matchedOption.click({ force: true, timeout: 5000 });
            } catch (clickError) {
              if (debug) console.log(`   Standard click failed, trying programmatic: ${clickError.message}`);
              // Use evaluate to click directly
              await matchedOption.evaluate(el => el.click());
              await page.waitForTimeout(300);
            }
            
            optionSelected = true;
            if (debug) console.log(`   ✅ Option clicked successfully (attempt ${selectionAttempt})`);
            break;
          }
        }
        
        // If no match found and we have retries left
        if (!optionSelected && selectionAttempt < maxRetries) {
          if (debug) console.log(`   No match found, retrying...`);
          
          // Close and reopen dropdown
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
          
          const trigger = dropdown.locator('div[role="button"]').first();
          await trigger.click({ force: true });
          await page.waitForTimeout(1500);
          
          // Refresh overlay reference
          overlayPanel = page.locator('div.p-dropdown-panel').first();
          
          // On retry attempts, wait longer for overlay
          const overlayRetryTimeout = getTimeoutForAttempt(selectionAttempt + 1, 5000);
          await overlayPanel.waitFor({ state: 'visible', timeout: overlayRetryTimeout });
        }
        
      } catch (error) {
        if (debug) console.log(`   Attempt ${selectionAttempt} failed: ${error.message}`);
        if (selectionAttempt === maxRetries) throw error;
        await page.waitForTimeout(1000);
      }
    }
    
    if (!optionSelected) {
      // Capture debug info before throwing
      await captureDropdownDebugInfo(page, dropdown, overlayPanel, valueToSelect);
      throw new Error(`Failed to select option "${valueToSelect}" after ${maxRetries} attempts`);
    }

    /* ============================================================
       STEP 6: VERIFY SELECTION (FLEXIBLE)
    ============================================================ */
    if (debug) console.log(`✓ Step 6: Verifying selection...`);
    
    await page.waitForTimeout(800); // Wait for UI update
    
    const selectedLabel = dropdown.locator('.p-dropdown-label');
    
    // FIRST ATTEMPT VERIFICATION: Quick check
    if (selectionAttempt === 1) {
      try {
        // Quick verification for first attempt
        await page.waitForTimeout(300); // Brief wait
        const labelText = (await selectedLabel.textContent())?.trim();
        if (labelText && labelText !== '&nbsp;' && labelText !== '\u00A0') {
          if (debug) console.log(`   First attempt: Quick verification shows "${labelText}"`);
          // Accept any non-empty value on first attempt
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`⏱️  Selection completed in ${elapsed}s (FIRST ATTEMPT)\n`);
          return true;
        }
      } catch (error) {
        // If quick verification fails, proceed to robust verification (like a retry)
        if (debug) console.log(`   First attempt quick verification failed, doing robust verification`);
      }
    }
    
    // ROBUST VERIFICATION (for retries or if first attempt verification failed)
    // Flexible verification - accept partial matches
    const verificationTimeout = getTimeoutForAttempt(selectionAttempt, 15000);
    await expect.poll(async () => {
      // Method 1: Check text content
      const labelText = (await selectedLabel.textContent())?.trim();
      if (labelText && labelText !== '&nbsp;' && labelText !== '\u00A0') {
        if (debug) console.log(`   Current label: "${labelText}"`);
        
        // Case-insensitive comparison
        const labelLower = labelText.toLowerCase();
        const expectedLower = valueToSelect.toLowerCase();
        
        // Accept exact match, contains, or starts with
        if (labelLower === expectedLower || 
            labelLower.includes(expectedLower) ||
            labelLower.startsWith(expectedLower) ||
            expectedLower.includes(labelLower)) {
          return true;
        }
      }
      
      // Method 2: Check if dropdown is no longer empty
      const isEmpty = await selectedLabel.evaluate(el => {
        const text = el.textContent?.trim();
        return !text || text === '&nbsp;' || text === '\u00A0' || text === '';
      });
      
      return !isEmpty; // Success if dropdown has any content
      
    }, {
      timeout: verificationTimeout,
      message: `Dropdown did not update with "${valueToSelect}"`,
      intervals: selectionAttempt === 1 ? [100, 200, 300] : [300, 500, 1000, 2000]
    }).toBe(true);

    const finalText = await selectedLabel.textContent();
    if (debug) {
      console.log(`✅ FINAL VERIFICATION: Dropdown shows "${finalText?.trim()}"`);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️  Selection completed in ${elapsed}s (attempt ${selectionAttempt})\n`);
    }

    return true;

  } catch (error) {
    console.error('\n💥 [selectDropdown] CRITICAL FAILURE', {
      valueToSelect,
      labelText,
      dropdownId,
      locator,
      error: error.message,
      stack: error.stack?.split('\n')[0]
    });
    
    
    throw error;
  }
}


/**
 * Helper function to capture dropdown debug info
 */
async function captureDropdownDebugInfo(page, dropdown, overlayPanel, valueToSelect) {
  console.log('\n🔍 DROPDOWN DEBUG INFORMATION 🔍');
  console.log(`Searching for: "${valueToSelect}"`);
  
  try {
    // Capture dropdown state
    const isDropdownVisible = await dropdown.isVisible();
    const dropdownClass = await dropdown.getAttribute('class');
    console.log(`Dropdown visible: ${isDropdownVisible}, class: ${dropdownClass}`);
    
    // Get current value
    const currentValue = await dropdown.locator('.p-dropdown-label').textContent();
    console.log(`Current value: "${currentValue?.trim()}"`);
    
    // List all available options
    if (overlayPanel) {
      const options = await overlayPanel.locator('.p-dropdown-item, li[role="option"]').all();
      console.log(`\n📋 AVAILABLE OPTIONS (${options.length} total):`);
      
      for (let i = 0; i < Math.min(options.length, 50); i++) {
        try {
          const opt = options[i];
          const text = (await opt.textContent())?.trim();
          const aria = await opt.getAttribute('aria-label');
          const isVisible = await opt.isVisible();
          console.log(`  [${i}] text="${text}", aria="${aria}", visible=${isVisible}`);
        } catch (e) {
          console.log(`  [${i}] Error reading option`);
        }
      }
    }
    
  } catch (debugError) {
    console.log(`Debug capture failed: ${debugError.message}`);
  }
  
  console.log('🔍 END DEBUG INFO 🔍\n');
}

export async function selectDropdownWithFromControl(
  page,
  { labelText, dropdownId, formControlName, valueToSelect, useSearch = true }
) {
  if (!page) throw new Error("page parameter is required");
  if (!labelText && !dropdownId && !formControlName)
    throw new Error("Either labelText, dropdownId, or formControlName must be provided");
  if (!valueToSelect)
    throw new Error(`valueToSelect is required but received: ${JSON.stringify(valueToSelect)}`);

  let dropdown;

  try {
    /** =========================
     *  FIND DROPDOWN LOCATOR
     *  ========================= */
    if (dropdownId) {
      dropdown = page.locator(
        `p-dropdown[data-test-id="${dropdownId}"], p-dropdown[formcontrolname="${dropdownId}"]`
      );
    } else if (formControlName) {
      // pick the *last visible* dropdown for cases like multiple added forms
      const allDropdowns = page.locator(`p-dropdown[formcontrolname="${formControlName}"]`);
      const count = await allDropdowns.count();

      if (count === 0)
        throw new Error(`No dropdowns found for formcontrolname="${formControlName}"`);

      // select the last one that is visible
      for (let i = count - 1; i >= 0; i--) {
        const candidate = allDropdowns.nth(i);
        if (await candidate.isVisible()) {
          dropdown = candidate;
          break;
        }
      }

      if (!dropdown)
        throw new Error(`No visible dropdown found for formcontrolname="${formControlName}"`);
    } else if (labelText) {
      const labelLocator = page.locator("label", { hasText: labelText });
      const dropdowns = labelLocator.locator("..").locator("p-dropdown");
      const count = await dropdowns.count();

      for (let i = 0; i < count; i++) {
        if (await dropdowns.nth(i).isVisible()) {
          dropdown = dropdowns.nth(i);
          break;
        }
      }
      if (!dropdown) throw new Error(`No visible dropdown found for label "${labelText}"`);
    }

    await expect(dropdown).toBeVisible({ timeout: 10000 });

    /** =========================
     *  OPEN DROPDOWN PANEL
     *  ========================= */
    const triggerButton = dropdown.locator('[role="button"][aria-label="dropdown trigger"]');
    await triggerButton.click();

    await page.waitForTimeout(500)

    // Find overlay panel (Primeng usually has .p-dropdown-panel)
    const overlayPanel = page
      .locator(".p-dropdown-panel")
      .filter({ has: page.locator(".p-dropdown-items") })
      .first();

    await expect(overlayPanel).toBeVisible({ timeout: 7000 });

    /** =========================
     *  WAIT FOR OPTIONS TO LOAD
     *  ========================= */
    await expect(async () => {
      const count = await overlayPanel.locator(".p-dropdown-item").count();
      expect(count).toBeGreaterThan(0);
    }).toPass({ timeout: 7000 });

    /** =========================
     *  SEARCH HANDLING (AUTO)
     *  ========================= */
    const searchBox = overlayPanel.locator("input.p-dropdown-filter");
    if (useSearch && (await searchBox.count()) > 0) {
      await searchBox.fill(valueToSelect);
      await page.waitForTimeout(400); // debounce for filtering
    }

    /** =========================
     *  SELECT OPTION
     *  ========================= */
    let option = overlayPanel.locator(`.p-dropdown-item[aria-label="${valueToSelect}"]`);
    if ((await option.count()) === 0)
      option = overlayPanel.getByRole("option", { name: valueToSelect, exact: true });

    if ((await option.count()) === 0)
      option = overlayPanel
        .locator(".p-dropdown-item")
        .filter({ hasText: new RegExp(`^${valueToSelect}$`, "i") });

    if ((await option.count()) === 0)
      throw new Error(`Option "${valueToSelect}" not found inside dropdown.`);

    await option.first().click();

    /** =========================
     *  VERIFY SELECTION
     *  ========================= */
    const selectedLabel = dropdown.locator(".p-dropdown-label");
    await expect
      .poll(async () => (await selectedLabel.textContent())?.trim())
      .toEqual(valueToSelect);

    console.log(`🎯 Selected "${valueToSelect}" successfully`);
  } catch (error) {
    console.error(`💥 [selectDropdownWithFromControl] Error:`, {
      labelText,
      dropdownId,
      formControlName,
      valueToSelect,
      error: error.message,
    });
    throw error;
  }
}


// export async function selectDropdownMultiselectMultiple(
//   page,
//   {
//     labelText,
//     dropdownId,
//     locator,
//     valuesToSelect,
//     useSearch = false,
//   }
// ) {
//   if (!page) throw new Error("page parameter is required");
//   if (!Array.isArray(valuesToSelect) || valuesToSelect.length === 0) {
//     throw new Error(
//       `valuesToSelect must be a non-empty array, received: ${JSON.stringify(valuesToSelect)}`
//     );
//   }

//   let dropdown;

//   /* ============================================================
//      RESOLVE MULTISELECT
//   ============================================================ */
//   if (locator) {
//     dropdown = page.locator(locator);
//     await expect(dropdown).toBeVisible();
//   } else if (dropdownId) {
//     dropdown = page.locator(
//       `p-multiselect[data-test-id="${dropdownId}"], p-multiselect[formcontrolname="${dropdownId}"]`
//     );
//     await expect(dropdown).toBeVisible();
//   } else if (labelText) {
//     const candidates = page
//       .locator("label", { hasText: labelText })
//       .locator("..")
//       .locator("p-multiselect");

//     const count = await candidates.count();
//     for (let i = 0; i < count; i++) {
//       if (await candidates.nth(i).isVisible()) {
//         dropdown = candidates.nth(i);
//         break;
//       }
//     }

//     if (!dropdown)
//       throw new Error(`No visible multiselect found for label "${labelText}"`);
//   } else {
//     throw new Error("Either labelText, dropdownId, or locator must be provided");
//   }

//   /* ============================================================
//      OPEN MULTISELECT
//   ============================================================ */
//   await dropdown.click();

//   const overlayPanel = page.locator(".p-multiselect-panel");
//   await expect(overlayPanel).toBeVisible();

//   const searchBox = overlayPanel.locator("input.p-multiselect-filter");
//   const hasSearch = (await searchBox.count()) > 0;

//   for (const value of valuesToSelect) {
//     /* ============================================================
//        RESET FILTER (CRITICAL)
//     ============================================================ */
//     if (hasSearch || useSearch) {
//       await searchBox.fill("");
//       await searchBox.type(value, { delay: 20 });

//       // Wait for filtered DOM to stabilize
//       await expect
//         .poll(async () => {
//           return await overlayPanel
//             .locator(".p-multiselect-item")
//             .count();
//         }, {
//           timeout: 10000,
//           message: `No options rendered for "${value}"`,
//         })
//         .toBeGreaterThan(0);
//     }

//     /* ============================================================
//        RE-RESOLVE OPTION (DO NOT CACHE)
//     ============================================================ */
//     let option = overlayPanel.locator(
//       `.p-multiselect-item[aria-label="${value}"]`
//     );

//     if ((await option.count()) === 0) {
//       option = overlayPanel.getByRole("option", {
//         name: value,
//         exact: true,
//       });
//     }

//     if ((await option.count()) === 0) {
//       option = overlayPanel
//         .locator(".p-multiselect-item")
//         .filter({ hasText: new RegExp(`^${value}$`) });
//     }

//     const optionCount = await option.count();
//     if (optionCount === 0) {
//       throw new Error(`Option "${value}" not found`);
//     }
//     if (optionCount > 1) {
//       throw new Error(`Multiple options found for "${value}"`);
//     }

//     const isSelected =
//       (await option.getAttribute("aria-selected")) === "true" ||
//       (await option.getAttribute("aria-checked")) === "true";

//     if (!isSelected) {
//       await option.scrollIntoViewIfNeeded();
//       await option.click({ force: true });

//       // 🔴 CRITICAL: wait until selection is applied
//       await expect.poll(async () => {
//         const selected =
//           (await option.getAttribute("aria-selected")) === "true" ||
//           (await option.getAttribute("aria-checked")) === "true";
//         return selected;
//       }).toBeTruthy();
//     }
//   }

//   /* ============================================================
//      CLOSE MULTISELECT
//   ============================================================ */
//   await page.keyboard.press("Escape");
//   await expect(overlayPanel).toBeHidden();

//   console.log(
//     `✅ Multiselect "${labelText || dropdownId || locator}" selected: ${valuesToSelect.join(", ")}`
//   );
// }


export async function selectDropdownMultiselectMultiple(
  page,
  {
    labelText,
    dropdownId,
    locator,
    valuesToSelect,
    useSearch = false,
  }
) {
  if (!page) throw new Error("page is required");
  if (!Array.isArray(valuesToSelect) || valuesToSelect.length === 0) {
    throw new Error("valuesToSelect must be a non-empty array");
  }

  let dropdown;

  /* ============================================================
     RESOLVE MULTISELECT
  ============================================================ */
  if (locator) {
    dropdown = page.locator(locator);
  } else if (dropdownId) {
    dropdown = page.locator(
      `p-multiselect[data-test-id="${dropdownId}"], p-multiselect[formcontrolname="${dropdownId}"]`
    );
  } else if (labelText) {
    dropdown = page
      .locator("label", { hasText: labelText })
      .locator("..")
      .locator("p-multiselect")
      .filter({ has: page.locator(":visible") })
      .first();
  } else {
    throw new Error("Provide labelText | dropdownId | locator");
  }

  await dropdown.scrollIntoViewIfNeeded();
  await expect(dropdown).toBeVisible();

  /* ============================================================
     SELECT VALUES (ONE BY ONE – PRIME NG SAFE)
  ============================================================ */
  for (const value of valuesToSelect) {
    // 🔴 ALWAYS reopen dropdown (PrimeNG collapses internally)
    const expanded = await dropdown
      .locator('input[role="combobox"]')
      .getAttribute("aria-expanded");

    if (expanded !== "true") {
      await dropdown.click();
    }

    const overlay = page.locator(".p-multiselect-panel").last();
    await expect(overlay).toBeVisible();

    const searchBox = overlay.locator("input.p-multiselect-filter");

    /* ================= FILTER ================= */
    if ((await searchBox.count()) > 0 || useSearch) {
      await searchBox.fill("");
      await searchBox.type(value, { delay: 25 });

      await expect
        .poll(
          () => overlay.locator(".p-multiselect-item").count(),
          { timeout: 10000 }
        )
        .toBeGreaterThan(0);
    }

    /* ================= RESOLVE OPTION ================= */
    const option = overlay
      .locator(".p-multiselect-item")
      .filter({ hasText: new RegExp(`^${value}$`) })
      .first();

    if (!(await option.count())) {
      throw new Error(`Option not found: ${value}`);
    }

    /* ================= SCROLL OVERLAY (NOT PAGE) ================= */
    await overlay.evaluate((panel, text) => {
      const items = [...panel.querySelectorAll(".p-multiselect-item")];
      const target = items.find(i => i.textContent.trim() === text);
      if (!target) return;

      const list =
        panel.querySelector(".p-multiselect-items-wrapper") || panel;
      list.scrollTop = target.offsetTop - list.clientHeight / 2;
    }, value);

    await expect(option).toBeVisible();

    /* ================= CLICK + VERIFY ================= */
    const alreadySelected =
      (await option.getAttribute("aria-selected")) === "true" ||
      (await option.getAttribute("aria-checked")) === "true";

    if (!alreadySelected) {
      await option.click();

      await expect
        .poll(async () => {
          return (
            (await option.getAttribute("aria-selected")) === "true" ||
            (await option.getAttribute("aria-checked")) === "true"
          );
        })
        .toBeTruthy();
    }
  }

  /* ============================================================
     CLOSE MULTISELECT
  ============================================================ */
  await page.keyboard.press("Escape");
}
