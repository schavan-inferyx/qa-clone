

// /**
//  * Unified function to scan table data with flexible search conditions
//  */
// export async function scanTableWithConditions(page, options = {}) {
//     const {
//         orgName,
//         orgShouldPresentInTable,
//         orgShouldHaveActiveStatus,
//         orgShouldHavePublicStatus,
//         status,
//         customConditions = {},
//         exactMatch = true,
//         searchAllPages = true,
//         maxPages = 100,
//         returnAllData = false,
//         isOrgColPresent, // Optional parameter - if not provided, will auto-detect
//         onProgress
//     } = options;

//     const allData = [];
//     const matches = [];
//     const missingOrgs = [];
//     let currentPage = 1;
//     let hasNextPage = true;
    
//     // Wait for the table to be visible with more specific selector
//     await page.waitForSelector('p-table .p-datatable-table');
//      const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
//     if (await loader.isVisible().catch(() => false)) {
//       await loader.waitFor({ state: "hidden", timeout: 15000 });
//     }
//     // Detect column structure if not explicitly provided
//     const columnStructure = await detectColumnStructure(page, isOrgColPresent);
//     console.log('Detected column structure:', columnStructure);
    
//     while (hasNextPage && currentPage <= maxPages) {
//         if (onProgress) {
//             onProgress({ page: currentPage, status: 'scanning' });
//         }
        
//         // Wait for table rows to load with more robust selector
//         await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
//         // Get all table rows on current page - use more specific selector
//         const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
//         console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
//         for (let i = 0; i < rows.length; i++) {
//             const row = rows[i];
//             const rowData = await extractRowData(row, columnStructure);
            
//             if (rowData.name || rowData.organization) { // Only process rows with valid data
//                 allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
//                 // Check if this row matches any search conditions
//                 if (matchesConditions(rowData, options)) {
//                     matches.push({ ...rowData, page: currentPage, rowIndex: i });
//                 }
                
//                 // Debug logging
//                 console.log(`Row ${i}:`, rowData);
//             }
//         }
        
//         if (onProgress) {
//             onProgress({ 
//                 page: currentPage, 
//                 recordsScanned: allData.length,
//                 matchesFound: matches.length,
//                 status: 'page_completed' 
//             });
//         }
        
//         // Check if we need to continue to next page
//         if (searchAllPages) {
//             hasNextPage = await goToNextPage(page);
//             if (hasNextPage) {
//                 currentPage++;
//                 // Wait for page to load
//                 await page.waitForTimeout(2000);
//                 await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
//             }
//         } else {
//             hasNextPage = false;
//         }
//     }
    
//     // Check for required organizations if specified
//     if (orgShouldPresentInTable) {
//         const requiredOrgs = Array.isArray(orgShouldPresentInTable) 
//             ? orgShouldPresentInTable 
//             : [orgShouldPresentInTable];
            
//         for (const requiredOrg of requiredOrgs) {
//             const found = allData.some(org => {
//                 const orgNameToCheck = org.name || org.organization;
//                 return exactMatch ? orgNameToCheck === requiredOrg : orgNameToCheck.includes(requiredOrg);
//             });
//             if (!found) {
//                 missingOrgs.push(requiredOrg);
//             }
//         }
//     }
    
//     // Prepare result
//     const result = {
//         success: missingOrgs.length === 0 && (matches.length > 0 || Object.keys(options).length === 0),
//         totalPages: currentPage,
//         totalRecords: allData.length,
//         matchesFound: matches.length,
//         matches: matches,
//         allData: returnAllData ? allData : undefined,
//         missingOrganizations: missingOrgs,
//         columnStructure: columnStructure,
//         searchCriteria: {
//             orgName,
//             orgShouldPresentInTable,
//             orgShouldHaveActiveStatus,
//             orgShouldHavePublicStatus,
//             status,
//             customConditions,
//             isOrgColPresent
//         }
//     };
    
//     if (onProgress) {
//         onProgress({ 
//             status: 'completed', 
//             result: result 
//         });
//     }
    
//     return result;
// }

// // Improved column structure detection
// async function detectColumnStructure(page, isOrgColPresent = null) {
//     try {
//         // If explicitly provided, use that value
//         if (isOrgColPresent !== null && isOrgColPresent !== undefined) {
//             console.log(`Using explicit isOrgColPresent: ${isOrgColPresent}`);
//             return getColumnStructure(isOrgColPresent);
//         }
        
//         // Otherwise, auto-detect by reading table headers
//         console.log('Auto-detecting column structure...');
        
//         // Try multiple selector strategies for headers
//         let headers = [];
        
//         // Strategy 1: Look for header text in th elements
//         const headerCells = await page.locator('thead th').all();
        
//         for (let i = 0; i < headerCells.length; i++) {
//             const cell = headerCells[i];
//             // Try multiple ways to get header text
//             let headerText = await cell.textContent();
            
//             if (!headerText || headerText.trim() === '') {
//                 // Try getting text from child elements
//                 headerText = await cell.locator('.align-items-center.ml-auto').first().textContent().catch(() => '');
//             }
            
//             if (!headerText || headerText.trim() === '') {
//                 // Try getting any text content
//                 headerText = await cell.innerText().catch(() => '');
//             }
            
//             if (headerText && headerText.trim()) {
//                 headers.push(headerText.trim());
//             }
//         }
        
//         console.log('Detected headers:', headers);
        
//         // Check if "Organization" column exists
//         const hasOrganizationColumn = headers.some(header => 
//             header.toLowerCase().includes('organization')
//         );
        
//         console.log(`Auto-detected hasOrganizationColumn: ${hasOrganizationColumn}`);
        
//         return getColumnStructure(hasOrganizationColumn);
        
//     } catch (error) {
//         console.error('Error detecting column structure:', error);
//         // Fallback to default structure without organization column
//         console.log('Falling back to default structure (no organization column)');
//         return getColumnStructure(false);
//     }
// }

// // Helper function to get column structure
// function getColumnStructure(hasOrganizationColumn) {
//     if (hasOrganizationColumn) {
//         return {
//             hasOrganizationColumn: true,
//             totalColumns: 10,
//             mapping: {
//                 name: 0,
//                 organization: 1,
//                 submittedBy: 2,
//                 submittedTime: 3,
//                 updatedBy: 4,
//                 updatedOn: 5,
//                 active: 6,
//                 public: 7,
//                 status: 8,
//                 action: 9
//             }
//         };
//     } else {
//         return {
//             hasOrganizationColumn: false,
//             totalColumns: 9,
//             mapping: {
//                 name: 0,
//                 submittedBy: 1,
//                 submittedTime: 2,
//                 updatedBy: 3,
//                 updatedOn: 4,
//                 active: 5,
//                 public: 6,
//                 status: 7,
//                 action: 8
//             }
//         };
//     }
// }

// // Helper functions for tableScanner.js
// async function extractRowData(row, columnStructure) {
//     const rowData = {};
    
//     try {
//         // Get all visible td elements in the row
//         const cells = await row.locator('td:visible').all();
        
//         console.log(`Found ${cells.length} cells in row, expected ${columnStructure.totalColumns}`);
        
//         for (let i = 0; i < cells.length; i++) {
//             const cell = cells[i];
            
//             // Get the text content and clean it
//             let cellText = await cell.textContent();
//             cellText = cellText ? cellText.trim() : '';
            
//             // Map cells to data fields based on the detected column structure
//             for (const [field, index] of Object.entries(columnStructure.mapping)) {
//                 if (i === index) {
//                     rowData[field] = cellText;
//                     console.log(`Mapped cell ${i} to ${field}: "${cellText}"`);
//                     break;
//                 }
//             }
//         }
        
//         // Alternative approach: try to get data by specific cell selectors
//         if (!rowData.name) {
//             const nameCell = await row.locator('td.nameWidth.text-left').first();
//             if (await nameCell.isVisible()) {
//                 rowData.name = (await nameCell.textContent()).trim();
//                 console.log(`Found name via alternative selector: "${rowData.name}"`);
//             }
//         }
        
//     } catch (error) {
//         console.error('Error extracting row data:', error);
//     }
    
//     return rowData;
// }

// function matchesConditions(rowData, options) {
//     const {
//         orgName,
//         orgShouldHaveActiveStatus,
//         orgShouldHavePublicStatus,
//         status,
//         customConditions = {},
//         exactMatch = true
//     } = options;
    
//     console.log('Checking conditions for row:', rowData);
//     console.log('Search criteria:', { orgName, orgShouldHaveActiveStatus, orgShouldHavePublicStatus, status, customConditions });
    
//     // If no specific search criteria, return true for all rows
//     if (!orgName && orgShouldHaveActiveStatus === undefined && orgShouldHavePublicStatus === undefined && 
//         !status && Object.keys(customConditions).length === 0) {
//         return true;
//     }
    
//     let matches = true;
    
//     // Check organization name - check both name and organization fields
//     if (orgName) {
//         const searchNames = Array.isArray(orgName) ? orgName : [orgName];
//         const nameMatch = searchNames.some(searchName => {
//             const orgNameToCheck = rowData.name || rowData.organization;
//             if (!orgNameToCheck) return false;
            
//             if (exactMatch) {
//                 return orgNameToCheck === searchName;
//             } else {
//                 return orgNameToCheck.includes(searchName);
//             }
//         });
//         console.log(`Name match: ${nameMatch} (looking for: ${orgName}, found: ${rowData.name || rowData.organization})`);
//         matches = matches && nameMatch;
//     }
    
//     // Check active status
//     if (orgShouldHaveActiveStatus !== undefined && rowData.active) {
//         const expectedActive = orgShouldHaveActiveStatus === true ? 'Yes' : 
//                               orgShouldHaveActiveStatus === false ? 'No' : 
//                               orgShouldHaveActiveStatus;
//         const activeMatch = rowData.active === expectedActive;
//         console.log(`Active match: ${activeMatch} (looking for: ${expectedActive}, found: ${rowData.active})`);
//         matches = matches && activeMatch;
//     }
    
//     // Check public status
//     if (orgShouldHavePublicStatus !== undefined && rowData.public) {
//         const expectedPublic = orgShouldHavePublicStatus === true ? 'Yes' : 
//                               orgShouldHavePublicStatus === false ? 'No' : 
//                               orgShouldHavePublicStatus;
//         const publicMatch = rowData.public === expectedPublic;
//         console.log(`Public match: ${publicMatch} (looking for: ${expectedPublic}, found: ${rowData.public})`);
//         matches = matches && publicMatch;
//     }
    
//     // Check status
//     if (status && rowData.status) {
//         const statusMatch = rowData.status === status;
//         console.log(`Status match: ${statusMatch} (looking for: ${status}, found: ${rowData.status})`);
//         matches = matches && statusMatch;
//     }
    
//     // Check custom conditions
//     for (const [field, value] of Object.entries(customConditions)) {
//         if (rowData[field] !== value) {
//             console.log(`Custom condition failed: ${field} (looking for: ${value}, found: ${rowData[field]})`);
//             matches = false;
//             break;
//         } else {
//             console.log(`Custom condition passed: ${field} = ${value}`);
//         }
//     }
    
//     console.log(`Overall match: ${matches}`);
//     return matches;
// }

// async function goToNextPage(page) {
//     try {
//         const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
        
//         if (await nextButton.isVisible({ timeout: 5000 })) {
//             await nextButton.click();
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.log('No next page found or error clicking next:', error);
//         return false;
//     }
// }


/**
 * Unified function to scan table data with flexible search conditions
 */
export async function scanTableWithConditions(page, options = {}) {
    const {
        orgName,
        orgShouldPresentInTable,
        orgShouldHaveActiveStatus,
        orgShouldHavePublicStatus,
        status,
        customConditions = {},
        exactMatch = true,
        searchAllPages = true,
        maxPages = 100,
        returnAllData = false,
        isOrgColPresent, // Optional parameter - if not provided, will auto-detect
        stopOnFirstMatch = true, // NEW: Stop searching when first match is found
        onProgress
    } = options;

    const allData = [];
    const matches = [];
    const missingOrgs = [];
    let currentPage = 1;
    let hasNextPage = true;
    let shouldStopSearching = false; // NEW: Flag to control early termination
    
    // Wait for the table to be visible with more specific selector
    await page.waitForSelector('p-table .p-datatable-table');
    const loader = page.locator("//div[contains(@class,'ngx-spinner-overlay')]");
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "hidden", timeout: 15000 });
    }
    // Detect column structure if not explicitly provided
    const columnStructure = await detectColumnStructure(page, isOrgColPresent);
    // console.log('Detected column structure:', columnStructure);
    
    while (hasNextPage && currentPage <= maxPages && !shouldStopSearching) {
        if (onProgress) {
            onProgress({ page: currentPage, status: 'scanning' });
        }
        
        // Wait for table rows to load with more robust selector
        await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
        // Get all table rows on current page - use more specific selector
        const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
        // console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
        for (let i = 0; i < rows.length && !shouldStopSearching; i++) {
            const row = rows[i];
            const rowData = await extractRowData(row, columnStructure);
            
            if (rowData.name || rowData.organization) { // Only process rows with valid data
                allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
                // Check if this row matches any search conditions
                if (matchesConditions(rowData, options)) {
                    matches.push({ ...rowData, page: currentPage, rowIndex: i });
                    console.log(`✅ Match found! Stopping search as requested.`);
                    
                    // NEW: Stop searching if we found a match and stopOnFirstMatch is true
                    if (stopOnFirstMatch && matches.length > 0) {
                        shouldStopSearching = true;
                        break; // Break out of the row loop
                    }
                }
                
                // Debug logging
                // console.log(`Row ${i}:`, rowData);
            }
        }
        
        if (onProgress) {
            onProgress({ 
                page: currentPage, 
                recordsScanned: allData.length,
                matchesFound: matches.length,
                status: 'page_completed' 
            });
        }
        
        // Check if we need to continue to next page (only if we haven't found a match to stop on)
        if (searchAllPages && !shouldStopSearching) {
            hasNextPage = await goToNextPage(page);
            if (hasNextPage) {
                currentPage++;
                // Wait for page to load
                await page.waitForTimeout(2000);
                await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
            }
        } else {
            hasNextPage = false;
        }
    }
    
    // Check for required organizations if specified
    if (orgShouldPresentInTable && !shouldStopSearching) {
        const requiredOrgs = Array.isArray(orgShouldPresentInTable) 
            ? orgShouldPresentInTable 
            : [orgShouldPresentInTable];
            
        for (const requiredOrg of requiredOrgs) {
            const found = allData.some(org => {
                const orgNameToCheck = org.name || org.organization;
                return exactMatch ? orgNameToCheck === requiredOrg : orgNameToCheck.includes(requiredOrg);
            });
            if (!found) {
                missingOrgs.push(requiredOrg);
            }
        }
    }
    
    // Prepare result
    const result = {
        success: missingOrgs.length === 0 && (matches.length > 0 || Object.keys(options).length === 0),
        totalPages: currentPage,
        totalRecords: allData.length,
        matchesFound: matches.length,
        matches: matches,
        allData: returnAllData ? allData : undefined,
        missingOrganizations: missingOrgs,
        columnStructure: columnStructure,
        searchStoppedEarly: shouldStopSearching, // NEW: Indicate if search was stopped early
        searchCriteria: {
            orgName,
            orgShouldPresentInTable,
            orgShouldHaveActiveStatus,
            orgShouldHavePublicStatus,
            status,
            customConditions,
            isOrgColPresent,
            stopOnFirstMatch
        }
    };
    
    if (onProgress) {
        onProgress({ 
            status: 'completed', 
            result: result 
        });
    }
    
    return result;
}

// Improved column structure detection
async function detectColumnStructure(page, isOrgColPresent = null) {
    try {
        // If explicitly provided, use that value
        if (isOrgColPresent !== null && isOrgColPresent !== undefined) {
            // console.log(`Using explicit isOrgColPresent: ${isOrgColPresent}`);
            return getColumnStructure(isOrgColPresent);
        }
        
        // Otherwise, auto-detect by reading table headers
        // console.log('Auto-detecting column structure...');

        
        // Try multiple selector strategies for headers
        let headers = [];
        
        // Strategy 1: Look for header text in th elements
        const headerCells = await page.locator('thead th').all();
        
        for (let i = 0; i < headerCells.length; i++) {
            const cell = headerCells[i];
            // Try multiple ways to get header text
            let headerText = await cell.textContent();
            
            if (!headerText || headerText.trim() === '') {
                // Try getting text from child elements
                headerText = await cell.locator('.align-items-center.ml-auto').first().textContent().catch(() => '');
            }
            
            if (!headerText || headerText.trim() === '') {
                // Try getting any text content
                headerText = await cell.innerText().catch(() => '');
            }
            
            if (headerText && headerText.trim()) {
                headers.push(headerText.trim());
            }
        }
        
        // console.log('Detected headers:', headers);
        
        // Check if "Organization" column exists
        const hasOrganizationColumn = headers.some(header => 
            header.toLowerCase().includes('organization')
        );
        
        // console.log(`Auto-detected hasOrganizationColumn: ${hasOrganizationColumn}`);
        
        return getColumnStructure(hasOrganizationColumn);
        
    } catch (error) {
        console.error('Error detecting column structure:', error);
        // Fallback to default structure without organization column
        // console.log('Falling back to default structure (no organization column)');
        return getColumnStructure(false);
    }
}

// Helper function to get column structure
function getColumnStructure(hasOrganizationColumn) {
    if (hasOrganizationColumn) {
        return {
            hasOrganizationColumn: true,
            totalColumns: 10,
            mapping: {
                name: 0,
                organization: 1,
                submittedBy: 2,
                submittedTime: 3,
                updatedBy: 4,
                updatedOn: 5,
                active: 6,
                public: 7,
                status: 8,
                action: 9
            }
        };
    } else {
        return {
            hasOrganizationColumn: false,
            totalColumns: 9,
            mapping: {
                name: 0,
                submittedBy: 1,
                submittedTime: 2,
                updatedBy: 3,
                updatedOn: 4,
                active: 5,
                public: 6,
                status: 7,
                action: 8
            }
        };
    }
}

// Helper functions for tableScanner.js
async function extractRowData(row, columnStructure) {
    const rowData = {};
    
    try {
        // Get all visible td elements in the row
        const cells = await row.locator('td:visible').all();
        
        // console.log(`Found ${cells.length} cells in row, expected ${columnStructure.totalColumns}`);
        
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            
            // Get the text content and clean it
            let cellText = await cell.textContent();
            cellText = cellText ? cellText.trim() : '';
            
            // Map cells to data fields based on the detected column structure
            for (const [field, index] of Object.entries(columnStructure.mapping)) {
                if (i === index) {
                    rowData[field] = cellText;
                    // console.log(`Mapped cell ${i} to ${field}: "${cellText}"`);
                    break;
                }
            }
        }
        
        // Alternative approach: try to get data by specific cell selectors
        if (!rowData.name) {
            const nameCell = await row.locator('td.nameWidth.text-left').first();
            if (await nameCell.isVisible()) {
                rowData.name = (await nameCell.textContent()).trim();
                // console.log(`Found name via alternative selector: "${rowData.name}"`);
            }
        }
        
    } catch (error) {
        console.error('Error extracting row data:', error);
    }
    
    return rowData;
}

function matchesConditions(rowData, options) {
    const {
        orgName,
        orgShouldHaveActiveStatus,
        orgShouldHavePublicStatus,
        status,
        customConditions = {},
        exactMatch = true
    } = options;
    
    // console.log('Checking conditions for row:', rowData);
    // console.log('Search criteria:', { orgName, orgShouldHaveActiveStatus, orgShouldHavePublicStatus, status, customConditions });
    
    // If no specific search criteria, return true for all rows
    if (!orgName && orgShouldHaveActiveStatus === undefined && orgShouldHavePublicStatus === undefined && 
        !status && Object.keys(customConditions).length === 0) {
        return true;
    }
    
    let matches = true;
    
    // Check organization name - check both name and organization fields
    if (orgName) {
        const searchNames = Array.isArray(orgName) ? orgName : [orgName];
        const nameMatch = searchNames.some(searchName => {
            const orgNameToCheck = rowData.name || rowData.organization;
            if (!orgNameToCheck) return false;
            
            if (exactMatch) {
                return orgNameToCheck === searchName;
            } else {
                return orgNameToCheck.includes(searchName);
            }
        });
        console.log(`Name match: ${nameMatch} (looking for: ${orgName}, found: ${rowData.name || rowData.organization})`);
        matches = matches && nameMatch;
    }
    
    // Check active status
    if (orgShouldHaveActiveStatus !== undefined && rowData.active) {
        const expectedActive = orgShouldHaveActiveStatus === true ? 'Yes' : 
                              orgShouldHaveActiveStatus === false ? 'No' : 
                              orgShouldHaveActiveStatus;
        const activeMatch = rowData.active === expectedActive;
        console.log(`Active match: ${activeMatch} (looking for: ${expectedActive}, found: ${rowData.active})`);
        matches = matches && activeMatch;
    }
    
    // Check public status
    if (orgShouldHavePublicStatus !== undefined && rowData.public) {
        const expectedPublic = orgShouldHavePublicStatus === true ? 'Yes' : 
                              orgShouldHavePublicStatus === false ? 'No' : 
                              orgShouldHavePublicStatus;
        const publicMatch = rowData.public === expectedPublic;
        console.log(`Public match: ${publicMatch} (looking for: ${expectedPublic}, found: ${rowData.public})`);
        matches = matches && publicMatch;
    }
    
    // Check status
    if (status && rowData.status) {
        const statusMatch = rowData.status === status;
        console.log(`Status match: ${statusMatch} (looking for: ${status}, found: ${rowData.status})`);
        matches = matches && statusMatch;
    }
    
    // Check custom conditions
    for (const [field, value] of Object.entries(customConditions)) {
        if (rowData[field] !== value) {
            console.log(`Custom condition failed: ${field} (looking for: ${value}, found: ${rowData[field]})`);
            matches = false;
            break;
        } else {
            console.log(`Custom condition passed: ${field} = ${value}`);
        }
    }
    
    console.log(`Overall match: ${matches}`);
    return matches;
}

async function goToNextPage(page) {
    try {
        const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
        
        if (await nextButton.isVisible({ timeout: 5000 })) {
            await nextButton.click();
            return true;
        }
        return false;
    } catch (error) {
        console.log('No next page found or error clicking next:', error);
        return false;
    }
}
