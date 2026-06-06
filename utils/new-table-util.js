/**
 * ROBUST TABLE ACTION HANDLER - Uses dynamic scanning with tooltip preference
 * Based on your existing performActionInListTable approach
 */
export async function listTableAction(page, options = {}) {
    const {
        // REQUIRED
        columnName,
        value,
        
        // ACTIONS
        actionToPerform,
        actionPermissionEnabled = [],
        actionPermissionDisabled = [],
        
        // VALIDATIONS
        isDeleted = false,
        validateOrganization = false,
        expectedOrganization,
        
        // SEARCH OPTIONS
        exactMatch = true,
        useSearch = false,
        searchText = value,
        scanWithTooltip = true, // Always prefer tooltip like your original approach
        
        // ROBUSTNESS
        maxRetries = 2,
        retryDelay = 1000,
        searchAllPages = true,
        maxPages = 10
    } = options;

    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
        attempt++;
        if (attempt > 1) {
            console.log(`🔄 Retry attempt ${attempt}/${maxRetries}`);
            await page.waitForTimeout(retryDelay);
            
            // Refresh on retry
            try {
                await page.reload();
                await waitForTableLoad(page);
            } catch {
                // Continue anyway
            }
        }

        try {
            return await executeDynamicTableAction(page, options);

        } catch (error) {
            lastError = error;
            console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

            if (attempt > maxRetries) {
                throw new Error(`Table action failed after ${maxRetries} attempts: ${lastError.message}`);
            }
        }
    }
}

/**
 * Dynamic table action execution using your existing approach
 */
async function executeDynamicTableAction(page, options) {
    const {
        columnName,
        value,
        actionToPerform,
        actionPermissionEnabled,
        actionPermissionDisabled,
        isDeleted,
        validateOrganization,
        expectedOrganization,
        exactMatch,
        useSearch,
        searchText,
        scanWithTooltip,
        searchAllPages,
        maxPages
    } = options;

    const common = new Comman(page);
    
    // 1. SEARCH IF REQUESTED
    if (useSearch) {
        await searchLikeTyping(page, searchText || value);
        await waitForTableLoad(page);
    }

    let currentPage = 1;
    let found = false;
    let targetRow = null;
    let rowData = null;
    let colIndex = -1;

    // 2. DYNAMIC SCANNING LOOP (like your original approach)
    do {
        console.log(`🔍 Scanning page ${currentPage}...`);
        
        // Dynamic table detection
        const table = page.locator("table");
        const headers = table.locator("th");
        const headerCount = await headers.count();
        
        // 3. DYNAMIC COLUMN INDEX FINDING
        if (colIndex === -1) {
            for (let i = 0; i < headerCount; i++) {
                const headerText = (await headers.nth(i).innerText()).trim();
                if (headerText.toLowerCase() === columnName.toLowerCase()) {
                    colIndex = i;
                    console.log(`✅ Found column "${columnName}" at index: ${colIndex}`);
                    break;
                }
            }
            
            if (colIndex === -1) {
                // Get available columns for error message
                const availableColumns = [];
                for (let i = 0; i < headerCount; i++) {
                    const headerText = (await headers.nth(i).innerText()).trim();
                    if (headerText) availableColumns.push(headerText);
                }
                throw new Error(`Column "${columnName}" not found. Available: ${availableColumns.join(', ')}`);
            }
        }

        const rows = table.locator("tbody tr");
        const rowCount = await rows.count();
        console.log(`📊 Checking ${rowCount} rows on page ${currentPage}`);

        // 4. DYNAMIC ROW SCANNING WITH TOOLTIP PREFERENCE
        for (let r = 0; r < rowCount; r++) {
            const row = rows.nth(r);
            const cell = row.locator("td").nth(colIndex);
            const cellText = (await cell.textContent() || "").trim();

            // Direct text match (quick check)
            let isMatch = exactMatch ? 
                cellText === value : 
                cellText.toLowerCase().includes(value.toLowerCase());

            if (isMatch) {
                console.log(`✅ Direct match found: "${cellText}"`);
                targetRow = row;
                rowData = await extractRowDataDynamic(row, headers);
                found = true;
                break;
            }

            // TOOLTIP SCAN (your preferred approach)
            if (scanWithTooltip && !found) {
                await cell.hover();
                await page.waitForTimeout(300);

                let tooltipText = "";
                try {
                    const tooltip = page.locator(".p-tooltip-text");
                    if (await tooltip.isVisible()) {
                        tooltipText = (await tooltip.innerText()).trim();
                    }
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

                if (tooltipText) {
                    const tooltipMatch = exactMatch ?
                        tooltipText === value :
                        tooltipText.toLowerCase().includes(value.toLowerCase());

                    if (tooltipMatch) {
                        console.log(`✅ Tooltip match found: "${tooltipText}"`);
                        targetRow = row;
                        rowData = await extractRowDataDynamic(row, headers);
                        found = true;
                        break;
                    }
                }
            }
        }

        if (found) break;

        // Pagination
        if (searchAllPages && currentPage < maxPages) {
            const hasNextPage = await goToNextPage(page);
            if (hasNextPage) {
                currentPage++;
                await waitForTableLoad(page);
                await page.waitForTimeout(1000);
            } else {
                console.log(`ℹ️ No more pages available. Searched ${currentPage} pages.`);
                break;
            }
        } else {
            break;
        }
    } while (currentPage <= maxPages && !found);

    if (!found || !targetRow) {
        throw new Error(`Value "${value}" not found in column "${columnName}" after searching ${currentPage} pages`);
    }

    const result = {
        success: true,
        found: true,
        row: await getRowIndex(targetRow),
        page: currentPage,
        data: rowData
    };

    // 5. VALIDATE ORGANIZATION
    if (validateOrganization || expectedOrganization) {
        const orgValidation = await validateOrganizationDynamic(rowData, expectedOrganization);
        result.organizationValidation = orgValidation;
        
        if (!orgValidation.isValid) {
            throw new Error(`Organization validation failed: ${orgValidation.message}`);
        }
    }

    // 6. CHECK DELETED STATE
    if (isDeleted) {
        const deletedCheck = await checkDeletedStateDynamic(rowData);
        result.deletedState = deletedCheck;
        
        if (!deletedCheck.isDeleted) {
            throw new Error(`Deleted state check failed: ${deletedCheck.message}`);
        }
    }

    // 7. VALIDATE ACTION PERMISSIONS
    if (actionPermissionEnabled.length > 0 || actionPermissionDisabled.length > 0) {
        const rowIndex = await getRowIndex(targetRow);
        const permissionResults = await validateActionPermissionsDynamic(page, rowIndex, {
            enabled: actionPermissionEnabled,
            disabled: actionPermissionDisabled
        });
        
        result.actionPermissions = permissionResults;
        
        const permissionErrors = getPermissionErrorsDynamic(permissionResults);
        if (permissionErrors.length > 0) {
            throw new Error(`Action permission errors: ${permissionErrors.join(', ')}`);
        }
    }

    // 8. PERFORM ACTION
    if (actionToPerform) {
        console.log(`🎯 Performing action: ${actionToPerform}`);
        const rowIndex = await getRowIndex(targetRow);
        await performActionDynamic(page, rowIndex, actionToPerform, common);
        result.actionPerformed = actionToPerform;
    }

    return result;
}

// ==================== DYNAMIC HELPER FUNCTIONS ====================

/**
 * Extract row data dynamically based on headers
 */
async function extractRowDataDynamic(row, headers) {
    const data = {};
    const cells = row.locator("td");
    const cellCount = await cells.count();
    const headerCount = await headers.count();

    for (let i = 0; i < Math.min(cellCount, headerCount); i++) {
        try {
            const headerText = (await headers.nth(i).innerText()).trim();
            const cellText = (await cells.nth(i).textContent() || "").trim();
            
            if (headerText) {
                data[headerText] = cellText;
                // Add normalized key
                const normalizedKey = headerText.toLowerCase().replace(/\s+/g, '_');
                data[normalizedKey] = cellText;
            }
        } catch (error) {
            // Continue if individual cell fails
            console.warn(`Could not extract data for column ${i}`);
        }
    }

    return data;
}

/**
 * Get row index dynamically
 */
async function getRowIndex(row) {
    const table = row.locator("xpath=ancestor::table");
    const rows = table.locator("tbody tr");
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
        if (await rows.nth(i).evaluate((el1, el2) => el1 === el2, await row.elementHandle())) {
            return i + 1; // 1-based index
        }
    }
    return -1;
}

/**
 * Dynamic organization validation
 */
async function validateOrganizationDynamic(rowData, expectedOrganization) {
    // Find organization column dynamically
    const orgKey = Object.keys(rowData).find(key => 
        key.toLowerCase().includes('organization') || 
        key.toLowerCase().includes('organisation') ||
        key === 'org' || key === 'company'
    );

    if (!orgKey) {
        return {
            isValid: false,
            message: 'No organization column found in row data',
            expected: expectedOrganization,
            actual: null
        };
    }

    const actualOrganization = rowData[orgKey];
    const isValid = actualOrganization === expectedOrganization;
    
    return {
        isValid,
        message: isValid ? 
            `Organization matches: ${actualOrganization}` : 
            `Organization mismatch. Expected: "${expectedOrganization}", Actual: "${actualOrganization}"`,
        expected: expectedOrganization,
        actual: actualOrganization,
        column: orgKey
    };
}

/**
 * Dynamic deleted state check
 */
async function checkDeletedStateDynamic(rowData) {
    // Check common status columns dynamically
    const statusKeys = Object.keys(rowData).filter(key => 
        key.toLowerCase().includes('status') ||
        key.toLowerCase().includes('state') ||
        key.toLowerCase().includes('active')
    );

    let isDeleted = false;
    let indicators = {};

    for (const key of statusKeys) {
        const value = rowData[key];
        indicators[key] = value;
        
        if (value && (
            value.toLowerCase().includes('deleted') ||
            value.toLowerCase().includes('inactive') ||
            value.toLowerCase() === 'no' ||
            value.toLowerCase() === 'false'
        )) {
            isDeleted = true;
        }
    }

    return {
        isDeleted,
        message: isDeleted ? 'Record is in deleted state' : 'Record is not in deleted state',
        indicators
    };
}

/**
 * Dynamic action permission validation
 */
async function validateActionPermissionsDynamic(page, rowIndex, permissions) {
    const table = page.locator("table");
    const rows = table.locator("tbody tr");
    const actionButton = rows.nth(rowIndex - 1).locator('button[pbutton][label="Action"]');

    // Open action dropdown
    await actionButton.click();
    await page.waitForTimeout(500);

    const results = {
        enabled: [],
        disabled: [],
        errors: []
    };

    const common = new Comman(page);
    const actionMap = {
        'view': common.viewDropdownMenu,
        'edit': common.editDropdownMenu,
        'delete': common.deleteDropdownMenu,
        'lock': common.lockDropdownMenu,
        'publish': common.publishDropdownMenu,
        'execute': common.executeDropdownMenu,
        'clone': common.cloneDropdownMenu,
        'export': common.exportDropdownMenu,
        'unlock': common.unlockDropdownMenu,
        'public': common.publishDropdownMenu
    };

    // Check enabled actions
    for (const actionName of permissions.enabled) {
        const actionLocator = actionMap[actionName.toLowerCase()];
        if (!actionLocator) {
            results.errors.push(`Unknown action: ${actionName}`);
            continue;
        }

        const isEnabled = await isActionEnabledDynamic(actionLocator);
        results.enabled.push({
            action: actionName,
            expected: true,
            actual: isEnabled,
            valid: isEnabled === true
        });
    }

    // Check disabled actions
    for (const actionName of permissions.disabled) {
        const actionLocator = actionMap[actionName.toLowerCase()];
        if (!actionLocator) {
            results.errors.push(`Unknown action: ${actionName}`);
            continue;
        }

        const isEnabled = await isActionEnabledDynamic(actionLocator);
        results.disabled.push({
            action: actionName,
            expected: false,
            actual: isEnabled,
            valid: isEnabled === false
        });
    }

    // Close dropdown
    await page.keyboard.press('Escape');
    
    return results;
}

/**
 * Dynamic action enabled check
 */
async function isActionEnabledDynamic(actionLocator) {
    try {
        const isVisible = await actionLocator.isVisible();
        if (!isVisible) return false;
        
        const opacity = await actionLocator.evaluate(el => 
            window.getComputedStyle(el).opacity
        );
        return parseFloat(opacity) > 0.5;
    } catch {
        return false;
    }
}

/**
 * Dynamic permission error extraction
 */
function getPermissionErrorsDynamic(permissionResults) {
    const errors = [];
    
    permissionResults.enabled.forEach(action => {
        if (!action.valid) {
            errors.push(`"${action.action}" should be ENABLED but is DISABLED`);
        }
    });
    
    permissionResults.disabled.forEach(action => {
        if (!action.valid) {
            errors.push(`"${action.action}" should be DISABLED but is ENABLED`);
        }
    });
    
    errors.push(...permissionResults.errors);
    
    return errors;
}

/**
 * Dynamic action performance
 */
async function performActionDynamic(page, rowIndex, action, common) {
    const table = page.locator("table");
    const rows = table.locator("tbody tr");
    const actionButton = rows.nth(rowIndex - 1).locator('button[pbutton][label="Action"]');

    if (!(await actionButton.isVisible())) {
        throw new Error('Action button not found');
    }

    // Open action dropdown
    await actionButton.click();
    await waitForSpinnerToDisappear(page);
    await page.waitForTimeout(500);

    // Map action dynamically
    const actionMap = {
        'view': common.viewDropdownMenu,
        'edit': common.editDropdownMenu,
        'delete': common.deleteDropdownMenu,
        'lock': common.lockDropdownMenu,
        'publish': common.publishDropdownMenu,
        'execute': common.executeDropdownMenu,
        'clone': common.cloneDropdownMenu,
        'export': common.exportDropdownMenu,
        'unlock': common.unlockDropdownMenu
    };

    const actionLocator = actionMap[action.toLowerCase()];
    if (!actionLocator) {
        throw new Error(`Unknown action "${action}". Available: ${Object.keys(actionMap).join(', ')}`);
    }

    // Perform action
    await actionLocator.click();
    await waitForSpinnerToDisappear(page);
    
    // Handle confirmation
    await handleConfirmationDynamic(page);
}

/**
 * Dynamic confirmation handling
 */
async function handleConfirmationDynamic(page) {
    const buttons = ['Ok', 'Yes', 'Confirm', 'Continue', 'Delete'];
    
    for (const buttonText of buttons) {
        const button = page.getByRole('button', { name: buttonText });
        if (await button.isVisible({ timeout: 2000 })) {
            await button.click();
            await waitForSpinnerToDisappear(page);
            break;
        }
    }
}

// Keep your existing goToNextPage function
async function goToNextPage(page) {
    try {
        const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
        if (await nextButton.isVisible({ timeout: 3000 })) {
            await nextButton.click();
            await page.waitForTimeout(500);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}







// // 1. Basic find with dynamic scanning
// const result1 = await listTableAction(page, {
//     columnName: "Organisation", 
//     value: "Inferyx"
// });

// // 2. Find and perform action
// const result2 = await listTableAction(page, {
//     columnName: "Organisation",
//     value: "Inferyx", 
//     actionToPerform: "View"
// });

// // 3. Check action permissions
// const result3 = await listTableAction(page, {
//     columnName: "Organisation",
//     value: "Inferyx",
//     actionPermissionDisabled: ["View", "Edit", "Delete"],
//     actionPermissionEnabled: ["Public", "Export"]
// });

// // 4. Validate organization
// const result4 = await listTableAction(page, {
//     columnName: "Name", 
//     value: "Inferyx",
//     validateOrganization: true,
//     expectedOrganization: "Inferyx Solutions"
// });

// // 5. Check deleted state
// const result5 = await listTableAction(page, {
//     columnName: "Name",
//     value: "xyz",
//     isDeleted: true
// });

// // 6. Complex scenario
// const result6 = await listTableAction(page, {
//     columnName: "Organisation",
//     value: "Inferyx",
//     actionToPerform: "View",
//     actionPermissionEnabled: ["Export", "Clone"],
//     actionPermissionDisabled: ["Delete", "Edit"],
//     validateOrganization: true,
//     expectedOrganization: "Inferyx Inc",
//     useSearch: true,
//     searchText: "Inferyx",
//     maxRetries: 3
// });