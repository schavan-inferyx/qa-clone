/**
 * @fileoverview Playwright table utility for handling various table structures
 * Supports Angular UI-Grid, HTML tables, and other common grid structures
 */

const { expect } = require('@playwright/test');

/**
 * Universal table utility for Playwright
 * @param {Page} page - Playwright page object
 * @param {Object} rowSelector - Criteria to find the row (e.g., { Name: 'rule_analysis' })
 * @param {Object} statusCondition - Status condition to check (e.g., { Status: 'Running' })
 * @param {Object} actionConfig - Action to perform (e.g., { Action: 'View' })
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Result object with pass/fail status and details
 */
async function jsTablePlaywright(page, rowSelector, statusCondition, actionConfig, options = {}) {
  const defaultOptions = {
    requireStatusEqualsBeforeAction: true,
    tableSelector: '.ui-grid',
    tableType: 'auto', // 'auto', 'ui-grid', 'html-table', 'div-table'
    timeout: 30000,
    maxRetries: 3,
    pollingInterval: 1000,
    waitForTable: true,
    actionButtonText: null, // If specific button text is needed
    debug: false
  };

  const config = { ...defaultOptions, ...options };
  let result = {
    pass: false,
    message: '',
    rowFound: false,
    statusMatched: false,
    actionPerformed: false,
    rowIndex: -1,
    details: {}
  };

  try {
    // Debug logging
    const debugLog = (message, data = null) => {
      if (config.debug) {
        console.log(`[Table Util Debug] ${message}`, data || '');
      }
    };

    debugLog('Starting table utility with config:', config);
    debugLog('Row selector:', rowSelector);
    debugLog('Status condition:', statusCondition);
    debugLog('Action config:', actionConfig);

    // Wait for table to be visible
    if (config.waitForTable) {
      debugLog('Waiting for table to be visible');
      await page.waitForSelector(config.tableSelector, { timeout: config.timeout });
    }

    // Detect table type if set to auto
    let tableType = config.tableType;
    if (tableType === 'auto') {
      tableType = await detectTableType(page, config.tableSelector);
      debugLog(`Detected table type: ${tableType}`);
    }

    // Find the target row
    debugLog('Looking for target row');
    const rowInfo = await findRow(page, tableType, rowSelector, config);
    
    if (!rowInfo.found) {
      result.message = `Row not found with criteria: ${JSON.stringify(rowSelector)}`;
      debugLog(result.message);
      return result;
    }

    result.rowFound = true;
    result.rowIndex = rowInfo.index;
    result.details.rowData = rowInfo.data;
    debugLog(`Row found at index ${rowInfo.index}`, rowInfo.data);

    // Check status if required
    if (config.requireStatusEqualsBeforeAction && statusCondition) {
      debugLog('Checking status condition');
      const statusMatch = await checkStatusCondition(
        page, 
        tableType, 
        rowInfo, 
        statusCondition, 
        config
      );

      if (!statusMatch.matched) {
        result.message = `Status check failed. Expected: ${JSON.stringify(statusCondition)}, Actual: ${statusMatch.actualStatus}`;
        result.details.actualStatus = statusMatch.actualStatus;
        debugLog(result.message);
        return result;
      }

      result.statusMatched = true;
      result.details.actualStatus = statusMatch.actualStatus;
      debugLog(`Status matched: ${statusMatch.actualStatus}`);
    }

    // Perform action
    debugLog('Performing action');
    const actionResult = await performAction(
      page, 
      tableType, 
      rowInfo, 
      actionConfig, 
      config
    );

    if (!actionResult.performed) {
      result.message = `Failed to perform action: ${actionResult.error || 'Unknown error'}`;
      debugLog(result.message);
      return result;
    }

    result.actionPerformed = true;
    result.pass = true;
    result.message = 'Successfully found row, checked status, and performed action';
    debugLog('Action performed successfully');

    return result;

  } catch (error) {
    result.message = `Error in table utility: ${error.message}`;
    debugLog('Error occurred:', error);
    return result;
  }
}

/**
 * Detect table type
 */
async function detectTableType(page, tableSelector) {
  try {
    // Check for Angular UI-Grid
    const uiGridExists = await page.locator(tableSelector).filter({ has: page.locator('.ui-grid-contents-wrapper') }).count() > 0;
    if (uiGridExists) return 'ui-grid';

    // Check for HTML table
    const htmlTableExists = await page.locator('table').count() > 0;
    if (htmlTableExists) return 'html-table';

    // Check for div-based table
    const divTableExists = await page.locator('[role="grid"], [role="table"]').count() > 0;
    if (divTableExists) return 'div-table';

    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Find row based on selector criteria
 */
async function findRow(page, tableType, rowSelector, config) {
  let retries = 0;
  
  while (retries < config.maxRetries) {
    try {
      switch (tableType) {
        case 'ui-grid':
          return await findRowInUiGrid(page, rowSelector, config);
        case 'html-table':
          return await findRowInHtmlTable(page, rowSelector, config);
        case 'div-table':
          return await findRowInDivTable(page, rowSelector, config);
        default:
          return await findRowGeneric(page, rowSelector, config);
      }
    } catch (error) {
      retries++;
      if (retries >= config.maxRetries) throw error;
      await page.waitForTimeout(config.pollingInterval);
    }
  }
  
  return { found: false, index: -1, data: null };
}

/**
 * Find row in Angular UI-Grid
 */
async function findRowInUiGrid(page, rowSelector, config) {
  const result = { found: false, index: -1, data: {} };
  
  // Get all rows
  const rows = page.locator('.ui-grid-row');
  const rowCount = await rows.count();
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    let rowMatches = true;
    const rowData = {};
    
    // Get all cells in this row
    const cells = row.locator('.ui-grid-cell');
    const cellCount = await cells.count();
    
    // We need to match column headers to cell values
    const headers = page.locator('.ui-grid-header-cell .ui-grid-header-cell-label');
    const headerCount = await headers.count();
    
    for (let j = 0; j < Math.min(cellCount, headerCount); j++) {
      const header = await headers.nth(j).textContent();
      const cell = cells.nth(j);
      
      // Get cell text (handle nested content)
      let cellText = await cell.textContent();
      cellText = cellText ? cellText.trim() : '';
      
      rowData[header] = cellText;
      
      // Check if this column/value matches our selector
      if (rowSelector[header] && rowSelector[header] !== cellText) {
        rowMatches = false;
      }
    }
    
    // Check all selector criteria
    for (const [key, value] of Object.entries(rowSelector)) {
      if (rowData[key] !== value) {
        rowMatches = false;
        break;
      }
    }
    
    if (rowMatches) {
      result.found = true;
      result.index = i;
      result.data = rowData;
      break;
    }
  }
  
  return result;
}

/**
 * Find row in HTML table
 */
async function findRowInHtmlTable(page, rowSelector, config) {
  const result = { found: false, index: -1, data: {} };
  
  const table = page.locator('table').first();
  const rows = table.locator('tr');
  const rowCount = await rows.count();
  
  // Get headers from first row (assuming first row is header)
  const headerRow = rows.first();
  const headerCells = headerRow.locator('th, td');
  const headers = [];
  
  const headerCount = await headerCells.count();
  for (let h = 0; h < headerCount; h++) {
    const headerText = await headerCells.nth(h).textContent();
    headers.push(headerText ? headerText.trim() : `Column${h}`);
  }
  
  // Check data rows (skip header if it's a thead/tbody structure)
  const startRow = await table.locator('thead').count() > 0 ? 1 : 0;
  
  for (let i = startRow; i < rowCount; i++) {
    const row = rows.nth(i);
    const cells = row.locator('td');
    const cellCount = await cells.count();
    
    let rowMatches = true;
    const rowData = {};
    
    for (let j = 0; j < Math.min(cellCount, headers.length); j++) {
      const cellText = await cells.nth(j).textContent();
      rowData[headers[j]] = cellText ? cellText.trim() : '';
      
      if (rowSelector[headers[j]] && rowSelector[headers[j]] !== rowData[headers[j]]) {
        rowMatches = false;
      }
    }
    
    // Check all selector criteria
    for (const [key, value] of Object.entries(rowSelector)) {
      if (rowData[key] !== value) {
        rowMatches = false;
        break;
      }
    }
    
    if (rowMatches) {
      result.found = true;
      result.index = i - startRow;
      result.data = rowData;
      break;
    }
  }
  
  return result;
}

/**
 * Find row in div-based table (ARIA roles)
 */
async function findRowInDivTable(page, rowSelector, config) {
  const result = { found: false, index: -1, data: {} };
  
  const grid = page.locator('[role="grid"], [role="table"]').first();
  const rows = grid.locator('[role="row"]:not([role="rowheader"])');
  const rowCount = await rows.count();
  
  // Get column headers
  const headers = grid.locator('[role="columnheader"]');
  const headerTexts = [];
  const headerCount = await headers.count();
  
  for (let h = 0; h < headerCount; h++) {
    const headerText = await headers.nth(h).textContent();
    headerTexts.push(headerText ? headerText.trim() : `Column${h}`);
  }
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const cells = row.locator('[role="gridcell"], [role="cell"]');
    const cellCount = await cells.count();
    
    let rowMatches = true;
    const rowData = {};
    
    for (let j = 0; j < Math.min(cellCount, headerTexts.length); j++) {
      const cellText = await cells.nth(j).textContent();
      rowData[headerTexts[j]] = cellText ? cellText.trim() : '';
      
      if (rowSelector[headerTexts[j]] && rowSelector[headerTexts[j]] !== rowData[headerTexts[j]]) {
        rowMatches = false;
      }
    }
    
    // Check all selector criteria
    for (const [key, value] of Object.entries(rowSelector)) {
      if (rowData[key] !== value) {
        rowMatches = false;
        break;
      }
    }
    
    if (rowMatches) {
      result.found = true;
      result.index = i;
      result.data = rowData;
      break;
    }
  }
  
  return result;
}

/**
 * Generic row finder as fallback
 */
async function findRowGeneric(page, rowSelector, config) {
  const result = { found: false, index: -1, data: {} };
  
  // Try to find any element containing the target text
  for (const [key, value] of Object.entries(rowSelector)) {
    const element = page.locator(`:has-text("${value}")`).first();
    if (await element.count() > 0) {
      result.found = true;
      result.data[key] = value;
      // Try to find parent row
      const row = element.locator('xpath=ancestor::tr | ancestor::div[contains(@class, "row")] | ancestor::div[@role="row"]');
      if (await row.count() > 0) {
        result.data.fullRow = await row.textContent();
      }
      break;
    }
  }
  
  return result;
}

/**
 * Check status condition
 */
async function checkStatusCondition(page, tableType, rowInfo, statusCondition, config) {
  const result = { matched: false, actualStatus: null };
  
  if (!statusCondition || Object.keys(statusCondition).length === 0) {
    result.matched = true;
    return result;
  }
  
  const [statusKey, expectedStatus] = Object.entries(statusCondition)[0];
  result.actualStatus = rowInfo.data[statusKey] || 'Status not found';
  
  // Flexible status matching (case-insensitive, partial match)
  const normalizedExpected = expectedStatus.toLowerCase().trim();
  const normalizedActual = result.actualStatus.toLowerCase().trim();
  
  result.matched = normalizedActual.includes(normalizedExpected) || 
                   normalizedExpected.includes(normalizedActual);
  
  // If not matched with simple check, try to find status in row
  if (!result.matched) {
    // Look for status elements in the row
    const rowLocator = await getRowLocator(page, tableType, rowInfo.index);
    const statusElements = rowLocator.locator(':has-text("Running"), :has-text("Failed"), :has-text("Completed"), :has-text("Starting"), [class*="status"], [class*="label"]');
    
    for (let i = 0; i < await statusElements.count(); i++) {
      const element = statusElements.nth(i);
      const elementText = await element.textContent();
      if (elementText && elementText.toLowerCase().includes(normalizedExpected)) {
        result.actualStatus = elementText.trim();
        result.matched = true;
        break;
      }
    }
  }
  
  return result;
}

/**
 * Perform action on row
 */
async function performAction(page, tableType, rowInfo, actionConfig, config) {
  const result = { performed: false, error: null };
  
  try {
    const rowLocator = await getRowLocator(page, tableType, rowInfo.index);
    
    if (!rowLocator) {
      result.error = 'Could not locate row';
      return result;
    }
    
    const [actionKey, actionValue] = Object.entries(actionConfig)[0];
    
    // Find action button/element
    let actionElement = null;
    
    // Strategy 1: Look for button with exact text
    actionElement = rowLocator.locator(`button:has-text("${actionValue}"), a:has-text("${actionValue}")`);
    
    // Strategy 2: Look in action column
    if (await actionElement.count() === 0) {
      const actionColumn = rowLocator.locator(`[aria-label*="${actionKey}"], :has-text("${actionKey}")`);
      if (await actionColumn.count() > 0) {
        actionElement = actionColumn.locator(`button, a`).first();
      }
    }
    
    // Strategy 3: Look for dropdown/action menu
    if (await actionElement.count() === 0) {
      const dropdown = rowLocator.locator('[uib-dropdown], .dropdown, [role="menu"]');
      if (await dropdown.count() > 0) {
        // Open dropdown first
        const toggle = dropdown.locator('[uib-dropdown-toggle], .dropdown-toggle, [aria-haspopup="true"]');
        await toggle.click();
        await page.waitForTimeout(500);
        
        // Now look for the action in the dropdown
        actionElement = page.locator(`.dropdown-menu a:has-text("${actionValue}"), [role="menu"] a:has-text("${actionValue}")`);
      }
    }
    
    // Strategy 4: Generic fallback
    if (await actionElement.count() === 0) {
      // Look for any clickable element with action text in the row
      actionElement = rowLocator.locator(`:has-text("${actionValue}"):visible`);
    }
    
    if (await actionElement.count() === 0) {
      result.error = `Action element "${actionValue}" not found in row`;
      return result;
    }
    
    // Check if element is enabled
    const isDisabled = await actionElement.getAttribute('disabled') === 'disabled' || 
                      await actionElement.getAttribute('aria-disabled') === 'true' ||
                      (await actionElement.getAttribute('class') || '').includes('disabled');
    
    if (isDisabled) {
      result.error = `Action "${actionValue}" is disabled`;
      return result;
    }
    
    // Perform action
    await actionElement.click();
    result.performed = true;
    
    // Wait for any potential navigation or modal
    await page.waitForTimeout(1000);
    
  } catch (error) {
    result.error = error.message;
  }
  
  return result;
}

/**
 * Get row locator by index
 */
async function getRowLocator(page, tableType, rowIndex) {
  switch (tableType) {
    case 'ui-grid':
      return page.locator('.ui-grid-row').nth(rowIndex);
    case 'html-table':
      const table = page.locator('table').first();
      const hasHeader = await table.locator('thead').count() > 0;
      return table.locator('tr').nth(hasHeader ? rowIndex + 1 : rowIndex);
    case 'div-table':
      return page.locator('[role="grid"], [role="table"]')
        .first()
        .locator('[role="row"]:not([role="rowheader"])')
        .nth(rowIndex);
    default:
      return null;
  }
}

/**
 * Alternative: Find row by column name and value (simpler version)
 */
async function findRowByColumnValue(page, columnName, columnValue, options = {}) {
  const config = {
    tableSelector: '.ui-grid',
    timeout: 10000,
    ...options
  };
  
  try {
    await page.waitForSelector(config.tableSelector, { timeout: config.timeout });
    
    // Get all headers
    const headers = page.locator('.ui-grid-header-cell .ui-grid-header-cell-label');
    let targetColumnIndex = -1;
    
    // Find column index
    const headerCount = await headers.count();
    for (let i = 0; i < headerCount; i++) {
      const headerText = await headers.nth(i).textContent();
      if (headerText && headerText.trim() === columnName) {
        targetColumnIndex = i;
        break;
      }
    }
    
    if (targetColumnIndex === -1) {
      return { found: false, rowIndex: -1 };
    }
    
    // Find row with matching value
    const rows = page.locator('.ui-grid-row');
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('.ui-grid-cell');
      
      if (await cells.count() > targetColumnIndex) {
        const cell = cells.nth(targetColumnIndex);
        const cellText = await cell.textContent();
        
        if (cellText && cellText.trim() === columnValue) {
          return { found: true, rowIndex: i, rowElement: row };
        }
      }
    }
    
    return { found: false, rowIndex: -1 };
    
  } catch (error) {
    console.error('Error finding row:', error);
    return { found: false, rowIndex: -1, error: error.message };
  }
}

/**
 * Get all table data as array of objects
 */
async function getTableData(page, options = {}) {
  const config = {
    tableSelector: '.ui-grid',
    includeHeaders: true,
    ...options
  };
  
  const data = [];
  
  try {
    await page.waitForSelector(config.tableSelector, { timeout: 10000 });
    
    // Get headers
    const headers = [];
    const headerElements = page.locator('.ui-grid-header-cell .ui-grid-header-cell-label');
    const headerCount = await headerElements.count();
    
    for (let i = 0; i < headerCount; i++) {
      const headerText = await headerElements.nth(i).textContent();
      headers.push(headerText ? headerText.trim() : `Column${i}`);
    }
    
    // Get rows
    const rows = page.locator('.ui-grid-row');
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('.ui-grid-cell');
      const cellCount = await cells.count();
      
      const rowData = {};
      for (let j = 0; j < Math.min(cellCount, headers.length); j++) {
        const cellText = await cells.nth(j).textContent();
        rowData[headers[j]] = cellText ? cellText.trim() : '';
      }
      
      data.push(rowData);
    }
    
    return { success: true, data, headers, rowCount };
    
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

module.exports = {
  jsTablePlaywright,
  findRowByColumnValue,
  getTableData
};