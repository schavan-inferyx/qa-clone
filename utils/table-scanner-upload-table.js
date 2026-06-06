// // // /**
// // //  * Specialized function to scan upload table data with flexible search conditions
// // //  */
// // // export async function scanUploadTableWithConditions(page, options = {}) {
// // //     const {
// // //         fileName,
// // //         submittedBy,
// // //         status,
// // //         customConditions = {},
// // //         exactMatch = true,
// // //         searchAllPages = true,
// // //         maxPages = 100,
// // //         returnAllData = false,
// // //         stopOnFirstMatch = true,
// // //         onProgress
// // //     } = options;

// // //     const allData = [];
// // //     const matches = [];
// // //     const missingFiles = [];
// // //     let currentPage = 1;
// // //     let hasNextPage = true;
// // //     let shouldStopSearching = false;
    
// // //     // Wait for the upload table to be visible
// // //     await page.waitForSelector('lib-table-list p-table .p-datatable-table');
    
// // //     // Detect column structure for upload table
// // //     const columnStructure = await detectUploadColumnStructure(page);
// // //     console.log('Detected upload column structure:', columnStructure);
    
// // //     while (hasNextPage && currentPage <= maxPages && !shouldStopSearching) {
// // //         if (onProgress) {
// // //             onProgress({ page: currentPage, status: 'scanning' });
// // //         }
        
// // //         // Wait for table rows to load
// // //         await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
// // //         // Get all table rows on current page
// // //         const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
// // //         console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
// // //         for (let i = 0; i < rows.length && !shouldStopSearching; i++) {
// // //             const row = rows[i];
// // //             const rowData = await extractUploadRowData(row, columnStructure);
            
// // //             if (rowData.name) { // Only process rows with valid data
// // //                 allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
// // //                 // Check if this row matches any search conditions
// // //                 if (matchesUploadConditions(rowData, options)) {
// // //                     matches.push({ ...rowData, page: currentPage, rowIndex: i });
// // //                     console.log(`✅ Match found in upload table! Stopping search as requested.`);
                    
// // //                     // Stop searching if we found a match and stopOnFirstMatch is true
// // //                     if (stopOnFirstMatch && matches.length > 0) {
// // //                         shouldStopSearching = true;
// // //                         break; // Break out of the row loop
// // //                     }
// // //                 }
                
// // //                 // Debug logging
// // //                 console.log(`Upload Row ${i}:`, rowData);
// // //             }
// // //         }
        
// // //         if (onProgress) {
// // //             onProgress({ 
// // //                 page: currentPage, 
// // //                 recordsScanned: allData.length,
// // //                 matchesFound: matches.length,
// // //                 status: 'page_completed' 
// // //             });
// // //         }
        
// // //         // Check if we need to continue to next page
// // //         if (searchAllPages && !shouldStopSearching) {
// // //             hasNextPage = await goToNextUploadPage(page);
// // //             if (hasNextPage) {
// // //                 currentPage++;
// // //                 // Wait for page to load
// // //                 await page.waitForTimeout(2000);
// // //                 await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
// // //             }
// // //         } else {
// // //             hasNextPage = false;
// // //         }
// // //     }
    
// // //     // Check for required files if specified
// // //     if (options.fileShouldPresentInTable) {
// // //         const requiredFiles = Array.isArray(options.fileShouldPresentInTable) 
// // //             ? options.fileShouldPresentInTable 
// // //             : [options.fileShouldPresentInTable];
            
// // //         for (const requiredFile of requiredFiles) {
// // //             const found = allData.some(file => 
// // //                 exactMatch ? file.name === requiredFile : file.name.includes(requiredFile)
// // //             );
// // //             if (!found) {
// // //                 missingFiles.push(requiredFile);
// // //             }
// // //         }
// // //     }
    
// // //     // Prepare result
// // //     const result = {
// // //         success: missingFiles.length === 0 && (matches.length > 0 || Object.keys(options).length === 0),
// // //         totalPages: currentPage,
// // //         totalRecords: allData.length,
// // //         matchesFound: matches.length,
// // //         matches: matches,
// // //         allData: returnAllData ? allData : undefined,
// // //         missingFiles: missingFiles,
// // //         columnStructure: columnStructure,
// // //         searchStoppedEarly: shouldStopSearching,
// // //         searchCriteria: {
// // //             fileName,
// // //             submittedBy,
// // //             status,
// // //             customConditions,
// // //             stopOnFirstMatch
// // //         }
// // //     };
    
// // //     if (onProgress) {
// // //         onProgress({ 
// // //             status: 'completed', 
// // //             result: result 
// // //         });
// // //     }
    
// // //     return result;
// // // }

// // // // Detect column structure for upload table
// // // async function detectUploadColumnStructure(page) {
// // //     try {
// // //         console.log('Detecting upload table column structure...');
        
// // //         let headers = [];
// // //         const headerCells = await page.locator('thead th').all();
        
// // //         for (let i = 0; i < headerCells.length; i++) {
// // //             const cell = headerCells[i];
// // //             let headerText = await cell.textContent();
            
// // //             if (!headerText || headerText.trim() === '') {
// // //                 headerText = await cell.locator('.align-items-center.ml-auto').first().textContent().catch(() => '');
// // //             }
            
// // //             if (!headerText || headerText.trim() === '') {
// // //                 headerText = await cell.innerText().catch(() => '');
// // //             }
            
// // //             if (headerText && headerText.trim()) {
// // //                 headers.push(headerText.trim());
// // //             }
// // //         }
        
// // //         console.log('Detected upload headers:', headers);
        
// // //         // Based on the DOM structure: Name, Submited By, Submited Time, Size MB, Rows, Status, Action
// // //         return {
// // //             totalColumns: headers.length,
// // //             mapping: {
// // //                 name: 0,
// // //                 submittedBy: 1,
// // //                 submittedTime: 2,
// // //                 sizeMB: 3,
// // //                 rows: 4,
// // //                 status: 5,
// // //                 action: 6
// // //             },
// // //             headers: headers
// // //         };
        
// // //     } catch (error) {
// // //         console.error('Error detecting upload column structure:', error);
// // //         // Fallback to default upload structure
// // //         return {
// // //             totalColumns: 7,
// // //             mapping: {
// // //                 name: 0,
// // //                 submittedBy: 1,
// // //                 submittedTime: 2,
// // //                 sizeMB: 3,
// // //                 rows: 4,
// // //                 status: 5,
// // //                 action: 6
// // //             },
// // //             headers: ['Name', 'Submited By', 'Submited Time', 'Size MB', 'Rows', 'Status', 'Action']
// // //         };
// // //     }
// // // }

// // // // Extract data from upload table row
// // // async function extractUploadRowData(row, columnStructure) {
// // //     const rowData = {};
    
// // //     try {
// // //         // Get all visible td elements in the row
// // //         const cells = await row.locator('td:visible').all();
        
// // //         console.log(`Found ${cells.length} cells in upload row, expected ${columnStructure.totalColumns}`);
        
// // //         for (let i = 0; i < cells.length; i++) {
// // //             const cell = cells[i];
            
// // //             // Get the text content and clean it
// // //             let cellText = await cell.textContent();
// // //             cellText = cellText ? cellText.trim() : '';
            
// // //             // Map cells to data fields based on the detected column structure
// // //             for (const [field, index] of Object.entries(columnStructure.mapping)) {
// // //                 if (i === index) {
// // //                     rowData[field] = cellText;
// // //                     console.log(`Mapped upload cell ${i} to ${field}: "${cellText}"`);
// // //                     break;
// // //                 }
// // //             }
// // //         }
        
// // //     } catch (error) {
// // //         console.error('Error extracting upload row data:', error);
// // //     }
    
// // //     return rowData;
// // // }

// // // // Check if upload row matches conditions
// // // function matchesUploadConditions(rowData, options) {
// // //     const {
// // //         fileName,
// // //         submittedBy,
// // //         status,
// // //         customConditions = {},
// // //         exactMatch = true
// // //     } = options;
    
// // //     console.log('Checking upload conditions for row:', rowData);
// // //     console.log('Upload search criteria:', { fileName, submittedBy, status, customConditions });
    
// // //     // If no specific search criteria, return true for all rows
// // //     if (!fileName && !submittedBy && !status && Object.keys(customConditions).length === 0) {
// // //         return true;
// // //     }
    
// // //     let matches = true;
    
// // //     // Check file name
// // //     if (fileName && rowData.name) {
// // //         const searchNames = Array.isArray(fileName) ? fileName : [fileName];
// // //         const nameMatch = searchNames.some(searchName => {
// // //             if (exactMatch) {
// // //                 return rowData.name === searchName;
// // //             } else {
// // //                 return rowData.name.includes(searchName);
// // //             }
// // //         });
// // //         console.log(`File name match: ${nameMatch} (looking for: ${fileName}, found: ${rowData.name})`);
// // //         matches = matches && nameMatch;
// // //     }
    
// // //     // Check submitted by
// // //     if (submittedBy && rowData.submittedBy) {
// // //         const submittedMatch = exactMatch ? 
// // //             rowData.submittedBy === submittedBy : 
// // //             rowData.submittedBy.includes(submittedBy);
// // //         console.log(`Submitted by match: ${submittedMatch} (looking for: ${submittedBy}, found: ${rowData.submittedBy})`);
// // //         matches = matches && submittedMatch;
// // //     }
    
// // //     // Check status
// // //     if (status && rowData.status) {
// // //         const statusMatch = rowData.status === status;
// // //         console.log(`Status match: ${statusMatch} (looking for: ${status}, found: ${rowData.status})`);
// // //         matches = matches && statusMatch;
// // //     }
    
// // //     // Check custom conditions
// // //     for (const [field, value] of Object.entries(customConditions)) {
// // //         if (rowData[field] !== value) {
// // //             console.log(`Upload custom condition failed: ${field} (looking for: ${value}, found: ${rowData[field]})`);
// // //             matches = false;
// // //             break;
// // //         } else {
// // //             console.log(`Upload custom condition passed: ${field} = ${value}`);
// // //         }
// // //     }
    
// // //     console.log(`Upload overall match: ${matches}`);
// // //     return matches;
// // // }

// // // // Navigate to next page in upload table
// // // async function goToNextUploadPage(page) {
// // //     try {
// // //         const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
        
// // //         if (await nextButton.isVisible({ timeout: 5000 })) {
// // //             await nextButton.click();
// // //             return true;
// // //         }
// // //         return false;
// // //     } catch (error) {
// // //         console.log('No next page found in upload table or error clicking next:', error);
// // //         return false;
// // //     }
// // // }
// // /**
// //  * Specialized function to scan upload table data with flexible search conditions and soft assertions
// //  */
// // export async function scanUploadTableWithConditions(page, options = {}) {
// //     const {
// //         fileName,
// //         submittedBy,
// //         status,
// //         customConditions = {},
// //         exactMatch = true,
// //         searchAllPages = true,
// //         maxPages = 100,
// //         returnAllData = false,
// //         stopOnFirstMatch = true,
// //         specificRowIndex = null, // NEW: Check specific row only
// //         onProgress
// //     } = options;

// //     const allData = [];
// //     const matches = [];
// //     const missingFiles = [];
// //     const validationResults = []; // NEW: Store individual validation results
// //     let currentPage = 1;
// //     let hasNextPage = true;
// //     let shouldStopSearching = false;
    
// //     // Wait for the upload table to be visible
// //     await page.waitForSelector('lib-table-list p-table .p-datatable-table');
    
// //     // Detect column structure for upload table
// //     const columnStructure = await detectUploadColumnStructure(page);
// //     console.log('Detected upload column structure:', columnStructure);
    
// //     while (hasNextPage && currentPage <= maxPages && !shouldStopSearching) {
// //         if (onProgress) {
// //             onProgress({ page: currentPage, status: 'scanning' });
// //         }
        
// //         // Wait for table rows to load
// //         await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
// //         // Get all table rows on current page
// //         const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
// //         console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
// //         for (let i = 0; i < rows.length && !shouldStopSearching; i++) {
// //             // NEW: If specificRowIndex is provided, only check that row
// //             if (specificRowIndex !== null && i !== specificRowIndex) {
// //                 continue;
// //             }
            
// //             const row = rows[i];
// //             const rowData = await extractUploadRowData(row, columnStructure);
            
// //             if (rowData.name) {
// //                 allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
// //                 // NEW: Perform soft assertions and get detailed validation results
// //                 const validationResult = validateRowConditions(rowData, options, i);
// //                 validationResults.push(validationResult);
                
// //                 // Check if this row matches all conditions
// //                 if (validationResult.allConditionsMet) {
// //                     matches.push({ 
// //                         ...rowData, 
// //                         page: currentPage, 
// //                         rowIndex: i,
// //                         validationDetails: validationResult // Include validation details
// //                     });
// //                     console.log(`✅ All conditions met for row ${i}!`);
                    
// //                     // Stop searching if we found a match and stopOnFirstMatch is true
// //                     if (stopOnFirstMatch && matches.length > 0) {
// //                         shouldStopSearching = true;
// //                         break;
// //                     }
// //                 } else {
// //                     console.log(`❌ Some conditions failed for row ${i}`);
// //                 }
                
// //                 // Debug logging
// //                 console.log(`Upload Row ${i}:`, rowData);
// //             }
// //         }
        
// //         // NEW: If we're only checking a specific row and found it, stop searching
// //         if (specificRowIndex !== null && validationResults.length > 0) {
// //             shouldStopSearching = true;
// //         }
        
// //         if (onProgress) {
// //             onProgress({ 
// //                 page: currentPage, 
// //                 recordsScanned: allData.length,
// //                 matchesFound: matches.length,
// //                 status: 'page_completed' 
// //             });
// //         }
        
// //         // Check if we need to continue to next page
// //         if (searchAllPages && !shouldStopSearching) {
// //             hasNextPage = await goToNextUploadPage(page);
// //             if (hasNextPage) {
// //                 currentPage++;
// //                 await page.waitForTimeout(2000);
// //                 await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
// //             }
// //         } else {
// //             hasNextPage = false;
// //         }
// //     }
    
// //     // Check for required files if specified
// //     if (options.fileShouldPresentInTable) {
// //         const requiredFiles = Array.isArray(options.fileShouldPresentInTable) 
// //             ? options.fileShouldPresentInTable 
// //             : [options.fileShouldPresentInTable];
            
// //         for (const requiredFile of requiredFiles) {
// //             const found = allData.some(file => 
// //                 exactMatch ? file.name === requiredFile : file.name.includes(requiredFile)
// //             );
// //             if (!found) {
// //                 missingFiles.push(requiredFile);
// //             }
// //         }
// //     }
    
// //     // NEW: Calculate overall success based on validation results
// //     const overallSuccess = calculateOverallSuccess(
// //         validationResults, 
// //         matches, 
// //         missingFiles, 
// //         options
// //     );
    
// //     // Prepare comprehensive result
// //     const result = {
// //         success: overallSuccess,
// //         totalPages: currentPage,
// //         totalRecords: allData.length,
// //         matchesFound: matches.length,
// //         matches: matches,
// //         allData: returnAllData ? allData : undefined,
// //         missingFiles: missingFiles,
// //         columnStructure: columnStructure,
// //         searchStoppedEarly: shouldStopSearching,
// //         validationResults: validationResults, // NEW: Include all validation details
// //         searchCriteria: {
// //             fileName,
// //             submittedBy,
// //             status,
// //             customConditions,
// //             stopOnFirstMatch,
// //             specificRowIndex
// //         },
// //         // NEW: Summary of validation
// //         validationSummary: {
// //             totalConditionsChecked: validationResults.length,
// //             conditionsPassed: validationResults.filter(r => r.allConditionsMet).length,
// //             conditionsFailed: validationResults.filter(r => !r.allConditionsMet).length,
// //             failedValidations: validationResults.filter(r => !r.allConditionsMet)
// //         }
// //     };
    
// //     if (onProgress) {
// //         onProgress({ 
// //             status: 'completed', 
// //             result: result 
// //         });
// //     }
    
// //     return result;
// // }

// // // NEW: Perform soft assertions on a single row
// // function validateRowConditions(rowData, options, rowIndex) {
// //     const {
// //         fileName,
// //         submittedBy,
// //         status,
// //         customConditions = {},
// //         exactMatch = true
// //     } = options;
    
// //     const validationResult = {
// //         rowIndex: rowIndex,
// //         rowData: rowData,
// //         conditions: [],
// //         allConditionsMet: true,
// //         failedConditions: []
// //     };
    
// //     console.log(`🔍 Validating conditions for row ${rowIndex}:`, rowData);
    
// //     // Validate file name
// //     if (fileName) {
// //         const searchNames = Array.isArray(fileName) ? fileName : [fileName];
// //         const nameMatch = searchNames.some(searchName => {
// //             if (exactMatch) {
// //                 return rowData.name === searchName;
// //             } else {
// //                 return rowData.name.includes(searchName);
// //             }
// //         });
        
// //         const condition = {
// //             field: 'fileName',
// //             expected: fileName,
// //             actual: rowData.name,
// //             passed: nameMatch,
// //             message: nameMatch ? 
// //                 `File name matches: "${rowData.name}"` : 
// //                 `File name mismatch. Expected: "${fileName}", Actual: "${rowData.name}"`
// //         };
        
// //         validationResult.conditions.push(condition);
// //         if (!nameMatch) {
// //             validationResult.allConditionsMet = false;
// //             validationResult.failedConditions.push(condition);
// //         }
// //         console.log(`  ${nameMatch ? '✅' : '❌'} ${condition.message}`);
// //     }
    
// //     // Validate status
// //     if (status) {
// //         const statusMatch = rowData.status === status;
// //         const condition = {
// //             field: 'status',
// //             expected: status,
// //             actual: rowData.status,
// //             passed: statusMatch,
// //             message: statusMatch ? 
// //                 `Status matches: "${rowData.status}"` : 
// //                 `Status mismatch. Expected: "${status}", Actual: "${rowData.status}"`
// //         };
        
// //         validationResult.conditions.push(condition);
// //         if (!statusMatch) {
// //             validationResult.allConditionsMet = false;
// //             validationResult.failedConditions.push(condition);
// //         }
// //         console.log(`  ${statusMatch ? '✅' : '❌'} ${condition.message}`);
// //     }
    
// //     // Validate submitted by
// //     if (submittedBy && rowData.submittedBy) {
// //         const submittedMatch = exactMatch ? 
// //             rowData.submittedBy === submittedBy : 
// //             rowData.submittedBy.includes(submittedBy);
// //         const condition = {
// //             field: 'submittedBy',
// //             expected: submittedBy,
// //             actual: rowData.submittedBy,
// //             passed: submittedMatch,
// //             message: submittedMatch ? 
// //                 `Submitted by matches: "${rowData.submittedBy}"` : 
// //                 `Submitted by mismatch. Expected: "${submittedBy}", Actual: "${rowData.submittedBy}"`
// //         };
        
// //         validationResult.conditions.push(condition);
// //         if (!submittedMatch) {
// //             validationResult.allConditionsMet = false;
// //             validationResult.failedConditions.push(condition);
// //         }
// //         console.log(`  ${submittedMatch ? '✅' : '❌'} ${condition.message}`);
// //     }
    
// //     // Validate custom conditions
// //     for (const [field, expectedValue] of Object.entries(customConditions)) {
// //         const actualValue = rowData[field];
// //         const conditionMatch = actualValue === expectedValue.toString();
// //         const condition = {
// //             field: field,
// //             expected: expectedValue,
// //             actual: actualValue,
// //             passed: conditionMatch,
// //             message: conditionMatch ? 
// //                 `${field} matches: "${actualValue}"` : 
// //                 `${field} mismatch. Expected: "${expectedValue}", Actual: "${actualValue}"`
// //         };
        
// //         validationResult.conditions.push(condition);
// //         if (!conditionMatch) {
// //             validationResult.allConditionsMet = false;
// //             validationResult.failedConditions.push(condition);
// //         }
// //         console.log(`  ${conditionMatch ? '✅' : '❌'} ${condition.message}`);
// //     }
    
// //     console.log(`  ${validationResult.allConditionsMet ? '✅ ALL' : '❌ SOME'} conditions met for row ${rowIndex}`);
// //     return validationResult;
// // }

// // // NEW: Calculate overall success
// // function calculateOverallSuccess(validationResults, matches, missingFiles, options) {
// //     // If no search criteria provided, consider it successful
// //     if (!options.fileName && !options.submittedBy && !options.status && 
// //         Object.keys(options.customConditions || {}).length === 0) {
// //         return true;
// //     }
    
// //     // If checking specific row, check if that row passed
// //     if (options.specificRowIndex !== null) {
// //         const specificRowResult = validationResults.find(r => r.rowIndex === options.specificRowIndex);
// //         return specificRowResult ? specificRowResult.allConditionsMet : false;
// //     }
    
// //     // If fileShouldPresentInTable is specified, check for missing files
// //     if (options.fileShouldPresentInTable && missingFiles.length > 0) {
// //         return false;
// //     }
    
// //     // Otherwise, success if we found at least one match
// //     return matches.length > 0;
// // }

// /**
//  * Specialized function to scan upload table data with flexible search conditions and soft assertions
//  */
// export async function scanUploadTableWithConditions(page, options = {}) {
//     const {
//         fileName,
//         submittedBy,
//         status,
//         customConditions = {},
//         exactMatch = true,
//         searchAllPages = true,
//         maxPages = 100,
//         returnAllData = false,
//         stopOnFirstMatch = true,
//         specificRowIndex = null,
//         checkInFirstRowOnly = false, // NEW: Check only first row
//         onProgress
//     } = options;

//     const allData = [];
//     const matches = [];
//     const missingFiles = [];
//     const validationResults = [];
//     let currentPage = 1;
//     let hasNextPage = true;
//     let shouldStopSearching = false;
    
//     // Wait for the upload table to be visible
//     await page.waitForSelector('lib-table-list p-table .p-datatable-table');
    
//     // Detect column structure for upload table
//     const columnStructure = await detectUploadColumnStructure(page);
//     console.log('Detected upload column structure:', columnStructure);
    
//     while (hasNextPage && currentPage <= maxPages && !shouldStopSearching) {
//         if (onProgress) {
//             onProgress({ page: currentPage, status: 'scanning' });
//         }
        
//         // Wait for table rows to load
//         await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
//         // Get all table rows on current page
//         const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
//         console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
//         for (let i = 0; i < rows.length && !shouldStopSearching; i++) {
//             // NEW: Handle checkInFirstRowOnly
//             if (checkInFirstRowOnly && i > 0) {
//                 console.log(`Skipping row ${i} because checkInFirstRowOnly is true`);
//                 continue;
//             }
            
//             // If specificRowIndex is provided, only check that row
//             if (specificRowIndex !== null && i !== specificRowIndex) {
//                 continue;
//             }
            
//             const row = rows[i];
//             const rowData = await extractUploadRowData(row, columnStructure);
            
//             if (rowData.name) {
//                 allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
//                 // Perform soft assertions and get detailed validation results
//                 const validationResult = validateRowConditions(rowData, options, i);
//                 validationResults.push(validationResult);
                
//                 // Check if this row matches all conditions
//                 if (validationResult.allConditionsMet) {
//                     matches.push({ 
//                         ...rowData, 
//                         page: currentPage, 
//                         rowIndex: i,
//                         validationDetails: validationResult
//                     });
//                     console.log(`✅ All conditions met for row ${i}!`);
                    
//                     // Stop searching if we found a match and stopOnFirstMatch is true
//                     if (stopOnFirstMatch && matches.length > 0) {
//                         shouldStopSearching = true;
//                         break;
//                     }
//                 } else {
//                     console.log(`❌ Some conditions failed for row ${i}`);
//                 }
                
//                 // Debug logging
//                 console.log(`Upload Row ${i}:`, rowData);
//             }
            
//             // NEW: If checkInFirstRowOnly is true, stop after first row
//             if (checkInFirstRowOnly && i === 0) {
//                 console.log('Stopping after first row because checkInFirstRowOnly is true');
//                 shouldStopSearching = true;
//                 break;
//             }
//         }
        
//         // If we're only checking a specific row and found it, stop searching
//         if (specificRowIndex !== null && validationResults.length > 0) {
//             shouldStopSearching = true;
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
//         if (searchAllPages && !shouldStopSearching) {
//             hasNextPage = await goToNextUploadPage(page);
//             if (hasNextPage) {
//                 currentPage++;
//                 await page.waitForTimeout(2000);
//                 await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
//             }
//         } else {
//             hasNextPage = false;
//         }
//     }
    
//     // Check for required files if specified
//     if (options.fileShouldPresentInTable) {
//         const requiredFiles = Array.isArray(options.fileShouldPresentInTable) 
//             ? options.fileShouldPresentInTable 
//             : [options.fileShouldPresentInTable];
            
//         for (const requiredFile of requiredFiles) {
//             const found = allData.some(file => 
//                 exactMatch ? file.name === requiredFile : file.name.includes(requiredFile)
//             );
//             if (!found) {
//                 missingFiles.push(requiredFile);
//             }
//         }
//     }
    
//     // Calculate overall success based on validation results
//     const overallSuccess = calculateOverallSuccess(
//         validationResults, 
//         matches, 
//         missingFiles, 
//         options
//     );
    
//     // Prepare comprehensive result
//     const result = {
//         success: overallSuccess,
//         totalPages: currentPage,
//         totalRecords: allData.length,
//         matchesFound: matches.length,
//         matches: matches,
//         allData: returnAllData ? allData : undefined,
//         missingFiles: missingFiles,
//         columnStructure: columnStructure,
//         searchStoppedEarly: shouldStopSearching,
//         validationResults: validationResults,
//         searchCriteria: {
//             fileName,
//             submittedBy,
//             status,
//             customConditions,
//             exactMatch,
//             stopOnFirstMatch,
//             specificRowIndex,
//             checkInFirstRowOnly // Include in search criteria
//         },
//         validationSummary: {
//             totalConditionsChecked: validationResults.length,
//             conditionsPassed: validationResults.filter(r => r.allConditionsMet).length,
//             conditionsFailed: validationResults.filter(r => !r.allConditionsMet).length,
//             failedValidations: validationResults.filter(r => !r.allConditionsMet),
//             checkedRows: validationResults.map(r => r.rowIndex) // Which rows were checked
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

// // NEW: Enhanced overall success calculation
// function calculateOverallSuccess(validationResults, matches, missingFiles, options) {
//     // If no search criteria provided, consider it successful
//     if (!options.fileName && !options.submittedBy && !options.status && 
//         Object.keys(options.customConditions || {}).length === 0) {
//         return true;
//     }
    
//     // If checkInFirstRowOnly is true, check only the first row result
//     if (options.checkInFirstRowOnly) {
//         const firstRowResult = validationResults.find(r => r.rowIndex === 0);
//         return firstRowResult ? firstRowResult.allConditionsMet : false;
//     }
    
//     // If checking specific row, check if that row passed
//     if (options.specificRowIndex !== null) {
//         const specificRowResult = validationResults.find(r => r.rowIndex === options.specificRowIndex);
//         return specificRowResult ? specificRowResult.allConditionsMet : false;
//     }
    
//     // If fileShouldPresentInTable is specified, check for missing files
//     if (options.fileShouldPresentInTable && missingFiles.length > 0) {
//         return false;
//     }
    
//     // Otherwise, success if we found at least one match
//     return matches.length > 0;
// }

/**
 * Specialized function to scan upload table data with flexible search conditions and soft assertions
 */
export async function scanUploadTableWithConditions(page, options = {}) {
    const {
        fileName,
        submittedBy,
        status,
        customConditions = {},
        exactMatch = true,
        searchAllPages = true,
        maxPages = 100,
        returnAllData = false,
        stopOnFirstMatch = true,
        specificRowIndex = null,
        checkInFirstRowOnly = false,
        onProgress
    } = options;

    const allData = [];
    const matches = [];
    const missingFiles = [];
    const validationResults = [];
    let currentPage = 1;
    let hasNextPage = true;
    let shouldStopSearching = false;
    
    // Wait for the upload table to be visible
    await page.waitForSelector('lib-table-list p-table .p-datatable-table');
    
    // Detect column structure for upload table
    const columnStructure = await detectUploadColumnStructure(page);
    console.log('Detected upload column structure:', columnStructure);
    
    while (hasNextPage && currentPage <= maxPages && !shouldStopSearching) {
        if (onProgress) {
            onProgress({ page: currentPage, status: 'scanning' });
        }
        
        // Wait for table rows to load
        await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
        
        // Get all table rows on current page
        const rows = await page.locator('tbody tr.ng-star-inserted').all();
        
        console.log(`Found ${rows.length} rows on page ${currentPage}`);
        
        for (let i = 0; i < rows.length && !shouldStopSearching; i++) {
            // Handle checkInFirstRowOnly
            if (checkInFirstRowOnly && i > 0) {
                console.log(`Skipping row ${i} because checkInFirstRowOnly is true`);
                continue;
            }
            
            // If specificRowIndex is provided, only check that row
            if (specificRowIndex !== null && i !== specificRowIndex) {
                continue;
            }
            
            const row = rows[i];
            const rowData = await extractUploadRowData(row, columnStructure);
            
            if (rowData.name) {
                allData.push({ ...rowData, page: currentPage, rowIndex: i });
                
                // Perform soft assertions and get detailed validation results
                const validationResult = validateRowConditions(rowData, options, i);
                validationResults.push(validationResult);
                
                // Check if this row matches all conditions
                if (validationResult.allConditionsMet) {
                    matches.push({ 
                        ...rowData, 
                        page: currentPage, 
                        rowIndex: i,
                        validationDetails: validationResult
                    });
                    console.log(`✅ All conditions met for row ${i}!`);
                    
                    // Stop searching if we found a match and stopOnFirstMatch is true
                    if (stopOnFirstMatch && matches.length > 0) {
                        shouldStopSearching = true;
                        break;
                    }
                } else {
                    console.log(`❌ Some conditions failed for row ${i}`);
                }
                
                // Debug logging
                console.log(`Upload Row ${i}:`, rowData);
            }
            
            // If checkInFirstRowOnly is true, stop after first row
            if (checkInFirstRowOnly && i === 0) {
                console.log('Stopping after first row because checkInFirstRowOnly is true');
                shouldStopSearching = true;
                break;
            }
        }
        
        // If we're only checking a specific row and found it, stop searching
        if (specificRowIndex !== null && validationResults.length > 0) {
            shouldStopSearching = true;
        }
        
        if (onProgress) {
            onProgress({ 
                page: currentPage, 
                recordsScanned: allData.length,
                matchesFound: matches.length,
                status: 'page_completed' 
            });
        }
        
        // Check if we need to continue to next page
        if (searchAllPages && !shouldStopSearching) {
            hasNextPage = await goToNextUploadPage(page);
            if (hasNextPage) {
                currentPage++;
                await page.waitForTimeout(2000);
                await page.waitForSelector('tbody tr.ng-star-inserted', { timeout: 10000 });
            }
        } else {
            hasNextPage = false;
        }
    }
    
    // Check for required files if specified
    if (options.fileShouldPresentInTable) {
        const requiredFiles = Array.isArray(options.fileShouldPresentInTable) 
            ? options.fileShouldPresentInTable 
            : [options.fileShouldPresentInTable];
            
        for (const requiredFile of requiredFiles) {
            const found = allData.some(file => 
                exactMatch ? file.name === requiredFile : file.name.includes(requiredFile)
            );
            if (!found) {
                missingFiles.push(requiredFile);
            }
        }
    }
    
    // Calculate overall success based on validation results
    const overallSuccess = calculateOverallSuccess(
        validationResults, 
        matches, 
        missingFiles, 
        options
    );
    
    // Prepare comprehensive result
    const result = {
        success: overallSuccess,
        totalPages: currentPage,
        totalRecords: allData.length,
        matchesFound: matches.length,
        matches: matches,
        allData: returnAllData ? allData : undefined,
        missingFiles: missingFiles,
        columnStructure: columnStructure,
        searchStoppedEarly: shouldStopSearching,
        validationResults: validationResults,
        searchCriteria: {
            fileName,
            submittedBy,
            status,
            customConditions,
            exactMatch,
            stopOnFirstMatch,
            specificRowIndex,
            checkInFirstRowOnly
        },
        validationSummary: {
            totalConditionsChecked: validationResults.length,
            conditionsPassed: validationResults.filter(r => r.allConditionsMet).length,
            conditionsFailed: validationResults.filter(r => !r.allConditionsMet).length,
            failedValidations: validationResults.filter(r => !r.allConditionsMet),
            checkedRows: validationResults.map(r => r.rowIndex)
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

/**
 * Detect column structure for upload table
 */
async function detectUploadColumnStructure(page) {
    try {
        console.log('Detecting upload table column structure...');
        
        let headers = [];
        const headerCells = await page.locator('thead th').all();
        
        for (let i = 0; i < headerCells.length; i++) {
            const cell = headerCells[i];
            let headerText = await cell.textContent();
            
            if (!headerText || headerText.trim() === '') {
                headerText = await cell.locator('.align-items-center.ml-auto').first().textContent().catch(() => '');
            }
            
            if (!headerText || headerText.trim() === '') {
                headerText = await cell.innerText().catch(() => '');
            }
            
            if (headerText && headerText.trim()) {
                headers.push(headerText.trim());
            }
        }
        
        console.log('Detected upload headers:', headers);
        
        // Based on the DOM structure: Name, Submited By, Submited Time, Size MB, Rows, Status, Action
        return {
            totalColumns: headers.length,
            mapping: {
                name: 0,
                submittedBy: 1,
                submittedTime: 2,
                sizeMB: 3,
                rows: 4,
                status: 5,
                action: 6
            },
            headers: headers
        };
        
    } catch (error) {
        console.error('Error detecting upload column structure:', error);
        // Fallback to default upload structure
        return {
            totalColumns: 7,
            mapping: {
                name: 0,
                submittedBy: 1,
                submittedTime: 2,
                sizeMB: 3,
                rows: 4,
                status: 5,
                action: 6
            },
            headers: ['Name', 'Submited By', 'Submited Time', 'Size MB', 'Rows', 'Status', 'Action']
        };
    }
}

/**
 * Extract data from upload table row
 */
async function extractUploadRowData(row, columnStructure) {
    const rowData = {};
    
    try {
        // Get all visible td elements in the row
        const cells = await row.locator('td:visible').all();
        
        console.log(`Found ${cells.length} cells in upload row, expected ${columnStructure.totalColumns}`);
        
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            
            // Get the text content and clean it
            let cellText = await cell.textContent();
            cellText = cellText ? cellText.trim() : '';
            
            // Map cells to data fields based on the detected column structure
            for (const [field, index] of Object.entries(columnStructure.mapping)) {
                if (i === index) {
                    rowData[field] = cellText;
                    console.log(`Mapped upload cell ${i} to ${field}: "${cellText}"`);
                    break;
                }
            }
        }
        
    } catch (error) {
        console.error('Error extracting upload row data:', error);
    }
    
    return rowData;
}

/**
 * Perform soft assertions on a single row
 */
function validateRowConditions(rowData, options, rowIndex) {
    const {
        fileName,
        submittedBy,
        status,
        customConditions = {},
        exactMatch = true
    } = options;
    
    const validationResult = {
        rowIndex: rowIndex,
        rowData: rowData,
        conditions: [],
        allConditionsMet: true,
        failedConditions: []
    };
    
    console.log(`🔍 Validating conditions for row ${rowIndex}:`, rowData);
    
    // Validate file name
    if (fileName) {
        const searchNames = Array.isArray(fileName) ? fileName : [fileName];
        const nameMatch = searchNames.some(searchName => {
            if (exactMatch) {
                return rowData.name === searchName;
            } else {
                return rowData.name.includes(searchName);
            }
        });
        
        const condition = {
            field: 'fileName',
            expected: fileName,
            actual: rowData.name,
            passed: nameMatch,
            message: nameMatch ? 
                `File name matches: "${rowData.name}"` : 
                `File name mismatch. Expected: "${fileName}", Actual: "${rowData.name}"`
        };
        
        validationResult.conditions.push(condition);
        if (!nameMatch) {
            validationResult.allConditionsMet = false;
            validationResult.failedConditions.push(condition);
        }
        console.log(`  ${nameMatch ? '✅' : '❌'} ${condition.message}`);
    }
    
    // Validate status
    if (status) {
        const statusMatch = rowData.status === status;
        const condition = {
            field: 'status',
            expected: status,
            actual: rowData.status,
            passed: statusMatch,
            message: statusMatch ? 
                `Status matches: "${rowData.status}"` : 
                `Status mismatch. Expected: "${status}", Actual: "${rowData.status}"`
        };
        
        validationResult.conditions.push(condition);
        if (!statusMatch) {
            validationResult.allConditionsMet = false;
            validationResult.failedConditions.push(condition);
        }
        console.log(`  ${statusMatch ? '✅' : '❌'} ${condition.message}`);
    }
    
    // Validate submitted by
    if (submittedBy && rowData.submittedBy) {
        const submittedMatch = exactMatch ? 
            rowData.submittedBy === submittedBy : 
            rowData.submittedBy.includes(submittedBy);
        const condition = {
            field: 'submittedBy',
            expected: submittedBy,
            actual: rowData.submittedBy,
            passed: submittedMatch,
            message: submittedMatch ? 
                `Submitted by matches: "${rowData.submittedBy}"` : 
                `Submitted by mismatch. Expected: "${submittedBy}", Actual: "${rowData.submittedBy}"`
        };
        
        validationResult.conditions.push(condition);
        if (!submittedMatch) {
            validationResult.allConditionsMet = false;
            validationResult.failedConditions.push(condition);
        }
        console.log(`  ${submittedMatch ? '✅' : '❌'} ${condition.message}`);
    }
    
    // Validate custom conditions
    for (const [field, expectedValue] of Object.entries(customConditions)) {
        const actualValue = rowData[field];
        const conditionMatch = actualValue === expectedValue.toString();
        const condition = {
            field: field,
            expected: expectedValue,
            actual: actualValue,
            passed: conditionMatch,
            message: conditionMatch ? 
                `${field} matches: "${actualValue}"` : 
                `${field} mismatch. Expected: "${expectedValue}", Actual: "${actualValue}"`
        };
        
        validationResult.conditions.push(condition);
        if (!conditionMatch) {
            validationResult.allConditionsMet = false;
            validationResult.failedConditions.push(condition);
        }
        console.log(`  ${conditionMatch ? '✅' : '❌'} ${condition.message}`);
    }
    
    console.log(`  ${validationResult.allConditionsMet ? '✅ ALL' : '❌ SOME'} conditions met for row ${rowIndex}`);
    return validationResult;
}

/**
 * Calculate overall success based on validation results
 */
function calculateOverallSuccess(validationResults, matches, missingFiles, options) {
    // If no search criteria provided, consider it successful
    if (!options.fileName && !options.submittedBy && !options.status && 
        Object.keys(options.customConditions || {}).length === 0 && 
        !options.fileShouldPresentInTable) {
        return true;
    }
    
    // If checkInFirstRowOnly is true, check only the first row result
    if (options.checkInFirstRowOnly) {
        const firstRowResult = validationResults.find(r => r.rowIndex === 0);
        return firstRowResult ? firstRowResult.allConditionsMet : false;
    }
    
    // If checking specific row, check if that row passed
    if (options.specificRowIndex !== null) {
        const specificRowResult = validationResults.find(r => r.rowIndex === options.specificRowIndex);
        return specificRowResult ? specificRowResult.allConditionsMet : false;
    }
    
    // If fileShouldPresentInTable is specified, check for missing files
    if (options.fileShouldPresentInTable && missingFiles.length > 0) {
        return false;
    }
    
    // Otherwise, success if we found at least one match
    return matches.length > 0;
}

/**
 * Navigate to next page in upload table
 */
async function goToNextUploadPage(page) {
    try {
        const nextButton = page.locator('p-paginator .p-paginator-next:not(.p-disabled)');
        
        if (await nextButton.isVisible({ timeout: 5000 })) {
            await nextButton.click();
            return true;
        }
        return false;
    } catch (error) {
        console.log('No next page found in upload table or error clicking next:', error);
        return false;
    }
}

/**
 * Utility function to print validation summary
 */
export function printValidationSummary(result) {
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('====================');
    console.log(`Overall Success: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Total Records Scanned: ${result.totalRecords}`);
    console.log(`Matches Found: ${result.matchesFound}`);
    console.log(`Pages Scanned: ${result.totalPages}`);
    console.log(`Search Stopped Early: ${result.searchStoppedEarly ? 'Yes' : 'No'}`);
    
    if (result.validationSummary) {
        console.log(`\nValidation Results:`);
        console.log(`  Total Conditions Checked: ${result.validationSummary.totalConditionsChecked}`);
        console.log(`  Conditions Passed: ${result.validationSummary.conditionsPassed}`);
        console.log(`  Conditions Failed: ${result.validationSummary.conditionsFailed}`);
        console.log(`  Checked Rows: [${result.validationSummary.checkedRows.join(', ')}]`);
    }
    
    if (result.missingFiles && result.missingFiles.length > 0) {
        console.log(`\n❌ Missing Files:`, result.missingFiles);
    }
    
    if (result.validationResults && result.validationResults.length > 0) {
        console.log(`\nDetailed Results:`);
        result.validationResults.forEach((validation, index) => {
            console.log(`\nRow ${validation.rowIndex}: ${validation.allConditionsMet ? '✅ PASS' : '❌ FAIL'}`);
            validation.conditions.forEach(condition => {
                console.log(`  ${condition.passed ? '✅' : '❌'} ${condition.field}: ${condition.message}`);
            });
        });
    }
    
    console.log('====================\n');
}

/**
 * Quick check function for common scenarios
 */
export async function quickUploadCheck(page, fileName, expectedStatus = 'Completed') {
    const result = await scanUploadTableWithConditions(page, {
        fileName: fileName,
        status: expectedStatus,
        checkInFirstRowOnly: true,
        stopOnFirstMatch: true
    });
    
    return result;
}

/**
 * Check if file exists in table (simple boolean)
 */
export async function doesFileExist(page, fileName, exactMatch = true) {
    const result = await scanUploadTableWithConditions(page, {
        fileName: fileName,
        exactMatch: exactMatch,
        checkInFirstRowOnly: false,
        stopOnFirstMatch: true
    });
    
    return result.matchesFound > 0;
}