import { BasePage } from "@base/base-page.js";
import commonLayout from "@locators/common-layout.js"


class CommanLayout extends BasePage {
  constructor(page) {
    super(page)
    this.locators = commonLayout.common
    this.crudPage = commonLayout.crudPage
    this.applicationSelection = commonLayout.applicationSelection
    this.tableLocators = commonLayout.listTable

    // Track tabs (first tab = test start tab)
    this.tabs = new Map();
    this.tabs.set("main", page);
  }

  async isRoleSelected(expectedRole) {
    const roleDropdown = await this.page.locator(this.locators.selectedRole)
    await roleDropdown.waitFor({ state: "visible", timeout: 10000 })
    const actualRole = await roleDropdown.innerText()
    if (!actualRole) {
      return false
    }
    return actualRole === expectedRole
  }

  async switchRoleInPlusApp(roleName) {
    const roleDropdown = await this.page.locator(this.locators.selectedRole)
    await roleDropdown.waitFor({ state: "visible", timeout: 10000 })
    await roleDropdown.click()
    const roleOption = this.page.locator(`//li[@role='option']//span[normalize-space()='${roleName}']`)
    await roleOption.waitFor({ state: "visible", timeout: 10000 })
    await roleOption.click()
    // Logger.info(`Switched to role: ${roleName}`)
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToUrl(url) {
    await this.page.goto(url);
    await this.waitForLoader();
  }



  /* =====================================================
* Search by UUID (Generic)
* ===================================================== */
  async searchByUUID(uuid, options = {}) {

    // await this.waitForPlusLoaderToDisappear();
    await this.waitForLoader();
    await this.openColumnChooser();
    await this.selectAllColumns();
    await this.closeColumnChooser();
    if (!uuid) {
      throw new Error("UUID is required for search");
    }

    const searchInput = await this.page.locator(
      '.p-datatable-header input[placeholder="Search Keyword"]'
    );

    await this.manualTyping(searchInput, uuid, {
      delay: options.delay ?? 20,
    });

    await this.page.waitForLoadState("networkidle").catch(() => { })
    // await this.waitForPlusLoaderToDisappear();
    await this.waitForLoader();

  }


  async searchDatapod(datapodName) {
    this.waitForPlusLoaderToDisappear();
    const searchInput = await this.page.locator(this.locators.datasourceSearchInput);
    await this.manualTyping(searchInput, datapodName, {
      delay: 20,
      clear: true,
    });
    await this.page.waitForLoadState("networkidle").catch(() => { })
  }

  /* =========================
*  Application Selection 
* ========================= */

  /* =========================
*  Application Selection 
* ========================= */

  async searchForApplication(name) {
    await this.waitForPlusLoaderToDisappear();
    const searchBox = this.page.locator(this.applicationSelection.searchInput)
    await this.manualTyping(searchBox, name, {
      delay: 30,
      clear: true,
    })
    await this.page.waitForLoadState("networkidle").catch(() => { })
  }

  async selectApplication() {
    const appCard = await this.page.locator(this.applicationSelection.applicationCard).first()
    await appCard.waitFor({ state: "visible", timeout: 10000 })
    await appCard.click()
    await this.waitForPlusLoaderToDisappear();
  }

  async clickOnAddButton() {
    const addIcon = this.page.locator(this.crudPage.addIcon)
    await addIcon.waitFor({ state: "visible", timeout: 10000 })
    await addIcon.click()
    await this.waitForPlusLoaderToDisappear();
  }



  // Common List Table
  async searchInTable(name) {
    await super.searchInListTable(name)
  }
  async getVisibleColumnCount() {
    return await this.page.locator(this.tableLocators.tableHeaders).count();
  }

  async getFirstColumnHeaderText() {
    return (
      await this.page.locator(this.tableLocators.firstColumnHeader).innerText()
    ).trim();
  }

  async getFirstColumnCellValue() {
    return (
      await this.page.locator(this.tableLocators.firstColumnCell).innerText()
    ).trim();
  }

  async openColumnChooser() {
    await this.waitForLoader()
    await this.page.locator(this.tableLocators.columnToggleBtn).click();
  }


  async selectAllColumns() {
    const items = this.page.locator(this.tableLocators.allCheckbox);
    const totalItems = await items.count();

    for (let i = 0; i < totalItems; i++) {
      const item = items.nth(i);

      const isChecked = await item.getAttribute("aria-checked");
      if (isChecked !== "true") {
        await item.click();
      }
    }

    const selectedCount = await this.page
      .locator(this.tableLocators.checkedCheckbox)
      .count();

    // console.log("selected columns:", selectedCount);
    return selectedCount;
  }



  async closeColumnChooser() {
    const panel = this.page.locator(this.tableLocators.columnList);
    await this.page.keyboard.press("Escape");
    try {
      await panel.waitFor({ state: "hidden", timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }


  /* ---------------------------------------------------------------------
    * Opens Action menu for the first visible row
    * ------------------------------------------------------------------- */
  async openFirstRowActionMenu() {

    const actionButton = this.page
      .locator(this.tableLocators.actionButton)
      .first();

    await actionButton.waitFor({ state: "visible", timeout: 5000 });
    await actionButton.hover();
    await actionButton.click();
  }

  /* ---------------------------------------------------------------------
   * Selects an enabled action from the Action menu
   * ------------------------------------------------------------------- */
  async selectRowAction(actionLabel) {
    if (!actionLabel) {
      throw new Error("actionLabel is required");
    }

    const actionXpath =
      this.tableLocators.actionMenu.actionByLabel.replace(
        "{ACTION}",
        actionLabel
      );

    const actionRow = this.page.locator(
      `${this.tableLocators.actionMenu.container}${actionXpath}`
    );

    const count = await actionRow.count();

    if (count === 0) {
      throw new Error(`Action "${actionLabel}" not found or is disabled`);
    }

    if (count > 1) {
      throw new Error(
        `Multiple enabled actions found for "${actionLabel}" (${count})`
      );
    }

    await actionRow.first().waitFor({ state: "visible", timeout: 5000 });
    await actionRow.first().click();
  }

  /* ---------------------------------------------------------------------
   * Confirms generic confirmation dialog (Ok / Yes)
   * ------------------------------------------------------------------- */
  async confirmDialog() {
    const okButton = this.page.locator(this.tableLocators.popup.ok);
    await okButton.waitFor({ state: "visible", timeout: 5000 });
    await okButton.click();
    await this.waitForInbuiltButtonLoaderToDisapper()
  }

  /* ---------------------------------------------------------------------
   * Returns number of visible rows in list table
   * ------------------------------------------------------------------- */
  async getTableRowCount() {
    const rows = this.page.locator(
      "//tbody[contains(@class,'p-datatable-tbody')]/tr"
    );

    return await rows.count();
  }

  /* ---------------------------------------------------------------------
   * Returns cell value for a given column header in first row
   * Ensures column is visible before resolving
   * ------------------------------------------------------------------- */
  async getCellValueByColumnHeader(headerText) {
    if (!headerText) {
      throw new Error("headerText is required");
    }
    await this.waitForLoader()
    // Ensure all columns are visible (idempotent)
    await this.openColumnChooser();
    await this.selectAllColumns();
    await this.closeColumnChooser();

    // Resolve headers AFTER columns are visible
    const headers = this.page.locator("//th");
    const headerCount = await headers.count();

    let columnIndex = -1;

    for (let i = 0; i < headerCount; i++) {
      const text = (await headers.nth(i).innerText())?.trim();
      if (text === headerText) {
        columnIndex = i + 1; // XPath is 1-based
        break;
      }
    }

    if (columnIndex === -1) {
      throw new Error(`Column header "${headerText}" not found even after enabling columns`);
    }

    const cell = this.page.locator(
      `//tbody[contains(@class,'p-datatable-tbody')]/tr[1]/td[${columnIndex}]`
    );

    return (await cell.innerText())?.trim();
  }



  /* ---------------------------------------------------------------------
   * Asserts that table shows "No Records Found"
   * ------------------------------------------------------------------- */
  async assertNoRecordsFound() {
    const noRecordsCell = this.page.getByRole("cell", {
      name: "No Records Found",
    });

    await this.page.waitForTimeout(1000)

  }



  async openActionMenu() {
    await this.page.locator(this.locators.actionButton).hover();
    await this.page.locator(this.locators.actionButton).click();
  }

  async checkDatapod() {
    await this.page.locator("(//div[@class='p-checkbox-box'])[2]").click()
  }

  /* =====================================================
   * View / Edit
   * ===================================================== */
  async clickViewAction() {
    await this.page.locator(this.locators.viewAction).click();
  }

  async clickEditAction() {
    await this.page.locator(this.locators.editAction).click();
  }

  async clickExecuteAction() {
    await this.page.locator(this.locators.executeAction).click();
  }

  async clickCloneAction() {
    await this.page.locator(this.locators.cloneAction).click();
  }

  async clickLockAction() {
    await this.page.locator(this.locators.lockAction).click();
  }

  async clickUnlockAction() {
    await this.page.locator(this.locators.unlockAction).click();
  }

  async clickDeleteAction() {
    await this.page.locator(this.locators.deleteAction).click();
  }

  async clickPublishAction() {
    await this.page.locator(this.locators.publishAction).click();
  }

  async clickUnpublishAction() {
    await this.page.locator(this.locators.unpublishAction).click();
  }

  async confirmExecution() {
    await this.page.getByRole("button", { name: "Ok" }).click();
    await this.waitForInbuiltButtonLoaderToDisapper();
  }

  async clickDatasourceRegisterAction() {
    await this.page.locator(this.locators.dataSourceRegisterAction).click();
  }

  async confirmDatasourceRegistration() {
    await this.page.getByRole("button", { name: "Ok" }).click();
  }


  async submitForm() {
    await this.page.click(this.crudPage.submitForm);
    await this.waitForPlusLoaderToDisappear();
  }

  async openAddForm() {
    await this.page.locator(this.crudPage.addIcon).click();
  }

  async clickOnContinue() {
    const continueBtn = await this.page.locator("//span[normalize-space()='Continue']");
    await continueBtn.waitFor({ state: "visible" });
    await this.page.keyboard.press('Tab');
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
  }

// ======================
// TAB MANAGEMENT
// ======================

// ---------- GET TAB ----------
async getTab(name) {
  const tab = this.tabs.get(name);

  if (!tab) {
    throw new Error(`Tab '${name}' not found`);
  }

  return tab;
}

// ---------- SWITCH TAB ----------
async switchToTab(name) {
  const tab = await this.getTab(name);

  this.page = tab;
  await tab.bringToFront();
}

// ---------- SWITCH TO MAIN ----------
async switchToMainTab() {
  await this.switchToTab("main");
}

// ---------- OPEN NEW TAB WITH URL ----------
async openUrlInNewTab(name, url) {
  if (this.tabs.has(name)) {
    throw new Error(`Tab '${name}' already exists`);
  }

  const newPage = await this.page.context().newPage();
  await newPage.goto(url);

  this.tabs.set(name, newPage);
  this.page = newPage;

  return newPage; // 🔥 CRITICAL FIX
}

// ---------- CAPTURE UI OPENED TAB ----------
async captureNewTab(name, action) {
  if (this.tabs.has(name)) {
    throw new Error(`Tab '${name}' already exists`);
  }

  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"),
    action()
  ]);

  await newPage.waitForLoadState();

  this.tabs.set(name, newPage);
  this.page = newPage;

  return newPage; // 🔥 keep consistent
}

// ---------- CLOSE TAB ----------
async closeTab(name) {
  const tab = await this.getTab(name);

  await tab.close();
  this.tabs.delete(name);

  if (this.page === tab) {
    await this.switchToMainTab();
  }
}

// ---------- CLOSE CURRENT TAB + SWITCH TO MAIN ----------
async closeCurrentTabAndSwitchToMain() {
  const currentPage = this.page;

  const isMain = this.tabs.get("main") === currentPage;

  if (isMain) {
    throw new Error("Cannot close main tab");
  }

  let currentTabName;
  for (const [name, tab] of this.tabs.entries()) {
    if (tab === currentPage) {
      currentTabName = name;
      break;
    }
  }

  if (!currentTabName) {
    throw new Error("Current tab not tracked");
  }

  await currentPage.close();
  this.tabs.delete(currentTabName);

  await this.switchToMainTab();
}

// ---------- CLEANUP ----------
async closeAllExceptMain() {
  for (const [name, tab] of this.tabs.entries()) {
    if (name !== "main") {
      await tab.close();
      this.tabs.delete(name);
    }
  }

  await this.switchToMainTab();
}



}

export { CommanLayout }