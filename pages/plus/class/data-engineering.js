import { BasePage } from "@base/base-page.js";

import {
  selectDropdown,
  selectDropdownMultiselectMultiple,
  selectDropdownWithFromControl
} from "@utils/dropdownHelper.js";

import dataengineering from "@locators/data-engineering.js";
import commonLayout from "@locators/common-layout.js";
import { expect } from "@playwright/test";

class DataEngineering extends BasePage {

  /* =====================================================
   * Constructor & Shared Locators
   * ===================================================== */
  constructor(page) {
    super(page);

    this.common = commonLayout.common;
    this.crudPage = commonLayout.crudPage;
    this.menu = dataengineering.menus;
    this.locators = dataengineering;
    this.datapod = dataengineering.dataPreparation.datapod;
    this.dataset = dataengineering.dataPreparation.dataset;
    this.dataQuality = dataengineering.dataQuality;
    this.breadcrumb = dataengineering.breadcrumb;
    this.dataProfiling = dataengineering.dataProfiling;
    this.dataPreparation = dataengineering.dataPreparation.expressionList;
    this.expression = dataengineering.dataPreparation.expression;
    this.formula = dataengineering.dataPreparation.formula;
    this.function = dataengineering.dataPreparation.function;
    this.relation = dataengineering.dataPreparation.relation;
    this.map = dataengineering.dataPreparation.map;
    this.operator = dataengineering.dataPreparation.operator;
    this.dataIngestion = dataengineering.dataIngestion;
    this.dataArchival = dataengineering.dataArchival;
    this.dataMigration = dataengineering.dataMigration;
    this.batchScheduler = dataengineering.batchScheduler;
    this.dataReconciliation = dataengineering.dataReconciliation;
    this.dataVault = dataengineering.dataVault;
  }

  /* =====================================================
   * App & Role Setup
   * ===================================================== */

  async setupDataEngineeringApp(common, role, appUnderTest) {
    await super.selectAppAndRole(common, appUnderTest, role);
    await this.page.waitForTimeout(9000);

  }

  async openAddForm() {
    await this.page.locator(this.crudPage.addIcon).click();
  }


  async updateDescription(desc) {
    await this.waitForPlusLoaderToDisappear();

    const descField = this.page.locator(this.locators.form.description);

    await descField.waitFor({ state: 'visible' });   // wait until visible
    await descField.scrollIntoViewIfNeeded();       // optional but helpful
    await this.manualTyping(descField, desc);
  }

  /* =====================================================
   * Navigation
   * ===================================================== */
  async navigateToDatapod() {
    await this.page.locator(this.locators.dataPreparation.datapodList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openDataIngestion() {
    await this.page.locator(this.menu.dataIngestion).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openParameterList() {
    await this.page.locator(this.locators.dataIngestion.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openRuleGroup() {
    await this.page.locator(this.locators.dataIngestion.ruleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openRuleResultsRule() {
    await this.page.locator(this.locators.dataIngestion.ruleResults).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataPreparation() {
    await this.page.locator(this.menu.dataPreparation).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataIngestion() {
    await this.page.locator(this.menu.dataIngestion).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToExpression() {
    await this.page.locator(this.locators.dataPreparation.expressionList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToFormula() {
    await this.page.locator(this.locators.dataPreparation.formulaList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToFunction() {
    await this.page.locator(this.locators.dataPreparation.functionList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToRelation() {
    await this.page.locator(this.locators.dataPreparation.relationList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToMap() {
    await this.page.locator(this.locators.dataPreparation.mapList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToMapRule() {
    await this.page.locator(this.locators.dataPreparation.mapRule).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToMapRuleGroup() {
    await this.page.locator(this.locators.dataPreparation.mapRuleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToOperator() {
    await this.page.locator(this.locators.dataPreparation.operatorMenu).click();
    await this.waitForPlusLoaderToDisappear();
  }
  async navigateToOperatorList() {
    await this.page.locator(this.locators.dataPreparation.operatorList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToParameterList() {
    await this.page.locator(this.locators.dataPreparation.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataArchival() {
    await this.page.locator(this.menu.dataArchival).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openArchivalRuleGroup(){
    await this.page.locator(this.dataArchival.ruleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openArchivalParameterList(){
    await this.page.locator(this.dataArchival.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataMigration() {
    await this.page.locator(this.menu.dataMigration).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openMigrationParameterList(){
    await this.page.locator(this.dataMigration.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToBatchScheduler(){
    await this.page.locator(this.menu.batchScheduler).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToScheduler(){
    await this.page.locator(this.batchScheduler.scheduler).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataReconciliation(){
    await this.page.locator(this.menu.dataReconciliation).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openReconRuleGroup(){
    await this.page.locator(this.dataReconciliation.ruleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openReconParameterList(){
    await this.page.locator(this.dataReconciliation.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async navigateToDataVault(){
    await this.page.locator(this.menu.dataVault).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openDataHub(){
    await this.page.locator(this.dataVault.hub).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openDataLink(){
    await this.page.locator(this.dataVault.link).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openDataSatellite(){
    await this.page.locator(this.dataVault.satellite).click();
    await this.waitForPlusLoaderToDisappear();
  }

  /* =====================================================
   * Rule / Parameter List – Create (Atomic)
   * ===================================================== */
  async clickAddRule() {
    await this.page.locator(this.crudPage.addIcon).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillRuleName(name) {
    await this.page.locator(this.locators.form.name).fill(name)
  }

  async submitRule() {
    await this.page.locator(this.crudPage.submitForm).click();
    await this.waitForPlusLoaderToDisappear();
  }

  /* =====================================================
   * Rule – Create (Extended)
   * ===================================================== */


  async selectRuleType(label, value) {
    await selectDropdown(this.page, { labelText: label, valueToSelect: value, useSearch: true })
  }

  async selectRefreshType(refreshType) {
    await selectDropdownWithFromControl(this.page, {
      formControlName: "refreshType",
      valueToSelect: refreshType,
    });
  }

  async selectMappingType(mappingType) {
    await selectDropdownWithFromControl(this.page, {
      formControlName: "mappingType",
      valueToSelect: mappingType,
    });
  }
  // async clickContinue() {

  //   const continueBtn = this.page.getByRole('button', { name: 'Continue' });

  //   await continueBtn.waitFor({ state: "visible" });
  //   await expect(continueBtn).toBeEnabled();

  //   await continueBtn.click();

  // }

  async clickContinue() {

    const continueBtn = await this.page.locator(this.crudPage.continueButton);

    await continueBtn.waitFor({ state: "visible" });
    // await this.page.keyboard.press('Tab');
    // await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
  }

  async selectSource({ dataSource, format, name }) {
    await selectDropdown(this.page, {
      locator: 'p-dropdown[formcontrolname="sourceDatasource"]',
      valueToSelect: dataSource, useSearch: true
    })
    await selectDropdown(this.page, {
      locator: 'p-dropdown[formcontrolname="sourceFormat"]',
      valueToSelect: format,
      useSearch: true
    });
    await this.page.locator(`input[formcontrolname="sourceName"]`).fill(name);
  }

  async selectTarget({ dataSource, format, type, name, saveMode, loadType }) {
    await selectDropdown(this.page, {
      locator: 'p-dropdown[formcontrolname="targetDatasource"]',
      valueToSelect: dataSource, useSearch: true
    })
    await selectDropdown(this.page, {
      locator: 'p-dropdown[formcontrolname="targetFormat"]',
      valueToSelect: format,
    });
    await selectDropdown(this.page, { labelText: "Target Type", valueToSelect: type })
    await selectDropdown(this.page, {
      locator: "//p-dropdown[@formcontrolname='targetDetail']",
      valueToSelect: name,
      useSearch: true
    })
    await selectDropdownWithFromControl(this.page, {
      formControlName: "saveMode",
      valueToSelect: saveMode,
    });

    await selectDropdownWithFromControl(this.page, {
      formControlName: "loadType",
      valueToSelect: loadType,
    });
  }

  async autoPopulate() {
    await this.page.locator('//i[@ptooltip="Auto Populate"]').click();
  }

  /* =====================================================
   * Search & Action Menu (Shared)
   * ===================================================== */

  async searchListByUUID(uuid) {
    await this.searchByUUID(uuid);
  }

  async searchRuleByUUID(uuid) {
    await this.searchByUUID(uuid);
  }

  async searchRuleGroupByUUID(uuid) {
    await this.searchByUUID(uuid, { delay: 10 });
  }



  async openActionMenu() {
    await this.page.locator(this.common.actionButton).hover();
    await this.page.locator(this.common.actionButton).click();
  }

  /* =====================================================
   * View / Edit
   * ===================================================== */
  async clickViewAction() {
    await this.page.locator(this.common.viewAction).click();
  }

  async clickEditAction() {
    await this.page.locator(this.common.editAction).click();
  }

  async updateRuleName(newName) {
    await this.fillRuleName(newName);
  }

  async submitEdit() {
    await this.clickContinue();
    await this.clickContinue();
    await this.clickContinue();
    await this.submitRule();
  }

  /* =====================================================
   * Execute / Clone / Lock / Unlock / Delete
   * ===================================================== */
  async clickExecuteAction() {
    await this.page.locator(this.common.executeAction).click();
  }

  async clickCloneAction() {
    await this.page.locator(this.common.cloneAction).click();
  }

  async clickLockAction() {
    await this.page.locator(this.common.lockAction).click();
  }

  async clickUnlockAction() {
    await this.page.locator(this.common.unlockAction).click();
  }

  async clickDeleteAction() {
    await this.page.locator(this.common.deleteAction).click();
  }

  async confirmExecution() {
    await this.page.getByRole("button", { name: "Ok" }).click();
  }

  /* =====================================================
   * Rule Group – Create / Edit
   * ===================================================== */
  async clickAddRuleGroup() {
    await this.page.locator(this.crudPage.addIcon).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillRuleGroupName(name) {
    await this.fillRuleName(name);
  }

  async updateRuleGroupName(name) {
    await this.fillRuleName(name);
  }

  async clickRulesDropdown() {
    await this.page.locator(this.dataIngestion.form.rulesDropdown).click();
    await this.waitForPlusLoaderToDisappear();
  }

  // async selectRulesForRuleGroup(ruleNames) {
  //   await selectDropdownMultiselectMultiple(this.page, {
  //     labelText: "Rules",
  //     valuesToSelect: ruleNames,
  //     useSearch: true
  //   });
  // }

//reusable method to select single or multiple rules
  async selectRulesForRuleGroup({
  ruleNames = [],   // specific rules
  selectAll = false // select all option
}) {
  if (selectAll) {
    // Click Select All checkbox or option
    await this.page.locator("//div[@aria-label='All items unselected']").click(); // adjust locator if needed
    return;
  }

  if (!ruleNames || ruleNames.length === 0) {
    throw new Error("Provide ruleNames or set selectAll=true");
  }

  await selectDropdownMultiselectMultiple(this.page, {
    labelText: "Rules",
    valuesToSelect: ruleNames,
    useSearch: true,
  });
}

  async submitRuleGroup() {
    await this.submitRule();
  }

  /* =====================================================
   * Toast Capture (ONLY validation mechanism)
   * ===================================================== */
  async captureToastMessage() {
    const toast = this.page.locator(".p-toast-message");
    await toast.waitFor({ timeout: 5000 });
    return await toast.innerText();
  }

//   async captureToastMessage(triggerAction = null, timeout = 10000) {

//   const toastLocator = this.page.locator(".p-toast-message");

//   if (triggerAction) {
//     const [toastText] = await Promise.all([
//       (async () => {
//         await toastLocator.first().waitFor({ state: "visible", timeout });
//         return await toastLocator.first().innerText();
//       })(),
//       triggerAction()
//     ]);

//     return toastText;
//   } else {
//     // fallback mode
//     await toastLocator.first().waitFor({ state: "visible", timeout });
//     return await toastLocator.first().innerText();
//   }
// }

  async getUUIDFromView() {
    const uuidInput =
      await this.page.locator(this.common.viewPage.uuid);
    await this.waitForPlusLoaderToDisappear()
    const value = await uuidInput.inputValue();
    if (!value) {
      throw new Error("UUID is empty");
    }
    return value;
  }

  async checkBreadcrumbContainsAdd() {
    const breadcrumb =
      this.page.locator(this.breadcrumb.add);

    await breadcrumb.waitFor({ state: "visible", timeout: 10000 });

    const breadcrumbText = await breadcrumb.innerText();
    return breadcrumbText === "Add";
  }

  async checkBreadcrumb(expected) {
    await this.page.waitForTimeout(50)
    const breadcrumb =
      await this.page.locator(this.common.breadcrumb.view);
    const text = (await breadcrumb.textContent())?.trim();
    if (text !== expected) {
      throw new Error(
        `Breadcrumb mismatch. Expected "${expected}", got "${text}"`
      );
    }
  }

  /* =====================================================
 * Clone UUID Capture (API-level, NON-VALIDATING)
 * ===================================================== */
  // async captureClonedEntity({
  //   sourceUuid,
  //   action = "clone",
  //   entityType,
  //   timeout = 10000,
  // }) {
  //   if (!sourceUuid) {
  //     throw new Error("sourceUuid is required for clone capture");
  //   }
  //   if (!entityType) {
  //     throw new Error("entityType is required for clone capture");
  //   }

  //   let clonedId = null;
  //   let clonedUuid = null;

  //   const handler = async (response) => {
  //     const url = response.url();

  //     if (
  //       url.includes("saveAs") &&
  //       url.includes(`action=${action}`) &&
  //       url.includes(`uuid=${sourceUuid}`) &&
  //       url.includes(`type=${entityType}`)
  //     ) {
  //       const json = await response.json();
  //       if (json?.id) clonedId = json.id;
  //       if (json?.uuid) clonedUuid = json.uuid;
  //     }
  //   };

  //   this.page.on("response", handler);

  //   const start = Date.now();
  //   while (Date.now() - start < timeout) {
  //     if (clonedId && clonedUuid) {
  //       this.page.off("response", handler);
  //       return { id: clonedId, uuid: clonedUuid };
  //     }
  //     await this.page.waitForTimeout(200);
  //   }

  //   this.page.off("response", handler);
  //   throw new Error(`Failed to capture cloned ${entityType} UUID`);
  // }

     async captureClonedEntity({
    sourceUuid,
    entityType,
    timeout = 20000,
}) {

    if (!sourceUuid) throw new Error("sourceUuid is required");
    if (!entityType) throw new Error("entityType is required");

    console.log(`🎯 Listening for clone API (${entityType}) for source: ${sourceUuid}`);

    return new Promise((resolve, reject) => {

        const timer = setTimeout(() => {
            this.page.off("response", handler);
            reject(new Error(`Failed to capture cloned ${entityType} UUID`));
        }, timeout);

        const handler = async (response) => {
            try {
                const request = response.request();
                const url = response.url();

                // ✅ Only care about POST calls
                if (request.method() !== "POST") return;

                // 🔥 Debug (keep this until stable)
                if (url.includes("save") || url.includes("clone")) {
                    console.log("🔍 Candidate API:", url);
                }

                const json = await response.json().catch(() => null);

                // ✅ Strong signal → response contains uuid
                if (json?.uuid && typeof json.uuid === "string") {

                    // Optional safety: avoid picking unrelated APIs
                    if (json.uuid === sourceUuid) return;

                    clearTimeout(timer);
                    this.page.off("response", handler);

                    console.log(`✅ Clone captured → ${json.uuid}`);

                    resolve({
                        id: json.id,
                        uuid: json.uuid,
                    });
                }

            } catch (e) {
                // ignore parsing errors
            }
        };

        this.page.on("response", handler);
    });
}


  /* =====================================================
   * ⚠️ LEGACY (DO NOT USE IN NEW CRUD)
   * ===================================================== */
  async captureRuleUUID() {
    await this.common.uuid.waitFor();
    return await this.common.uuid.innerText();
  }

  /* =====================================================
 * ⚠️ LEGACY – UI UUID Capture (DO NOT USE IN NEW CRUD)
 * ===================================================== */
  async captureUUIDFromUI() {
    await this.common.uuid.waitFor();
    return await this.common.uuid.innerText();
  }

  async clickPublishAction() {
    await this.page.locator(this.common.publishAction).click();
  }

  async clickUnpublishAction() {
    await this.page.locator(this.common.unpublishAction).click();
  }

  async openRuleResults() {
    await this.page.locator(this.locators.dataIngestion.ruleResults).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async clickLogAction() {
    await this.page.locator(this.common.logAction).click();
  }

  async clickRestartAction() {
    await this.page.locator(this.common.restartAction).click();
  }

  async clickKillAction() {
    await this.page.locator(this.common.killAction).click();
  }


  //data profiling
  //rule
  async openDataProfiling() {
    await this.page.locator(this.menu.dataProfiling).click();
    await this.waitForPlusLoaderToDisappear();
  }
  async openProfilingRule() { /* submenu click + loader wait */ }

  async selectProfilingEntity(entityName) { /* dropdown select */ }
  async selectProfilingAttributes(attributes) { /* multiselect */ }
  async selectProfilingPrimaryAttribute(attribute) { /* dropdown */ }

  //param list
  async openDataProfiling() { /* menu click */ }
  async openProfilingParameterList() { /* submenu click */ }

  //rule group 
  async openProfilingRuleGroup() {
    await this.page.locator(this.dataProfiling.ruleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }




  //param list
  //async openDataQuality() { }
  async openDataQualityParameterList() {
    await this.page.locator(this.dataQuality.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  //rule group 
  //async openDataQuality() { }
  async openDataQualityRuleGroup() {
    await this.page.locator(this.dataQuality.ruleGroup).click();
    await this.waitForPlusLoaderToDisappear();
  }





  /* =====================================================
 * ⚠️ All Create Method required for result to refer - Data Engineering
 * ===================================================== */

  async createDataIngestionRule({
    ruleName,
    ruleType,
    refreshType,
    source,
    target,
  }) {
    await this.clickAddRule();
    await this.fillRuleName(ruleName);

    await this.selectRuleType("Rule Type", ruleType);
    await this.selectRefreshType(refreshType);
    await this.clickContinue();

    await this.selectSource(source);
    await this.selectTarget(target);

    await this.clickContinue();
    await this.autoPopulate();
    await this.clickContinue();
    await this.submitRule();
  }

  async createParameterList({ ruleName }) {
    await this.clickAddRule();
    await this.fillRuleName(ruleName);
    await this.submitRule();
  }

  async clickInferSchema() {
    await this.page.locator(this.locators.form.inferSchema).click()
  }

  async uploadFile(locator, filePath) {
    await this.page.locator(locator).setInputFiles(filePath)
  }

  // Data Prepration for datapod
  async submitAttributeForm() {
    await this.page.locator(this.datapod.form.submitAttributeButton).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillPhysicalName(pname) {
    await this.page.locator(this.datapod.form.physicalName).fill(pname);
  }

  async createDatapod(
    name,
    dataSourceValue,
    datapodTypeValue,
    pname,
    keyType,
    attributeType) {
    // await this.clickAddRule();
    await this.fillRuleName(name)

    await selectDropdown(this.page, {
      labelText: "Data Source",
      valueToSelect: dataSourceValue
    });

    await selectDropdown(this.page, {
      labelText: "Datapod Type",
      valueToSelect: datapodTypeValue
    });

    await this.fillPhysicalName(pname);

    await selectDropdown(this.page, {
      locator: this.datapod.form.keyType,
      valueToSelect: keyType
    });
    //await this.clickInferSchema();
    //await this.uploadFile(this.locators.form, filePath)

    //await this.page.locator(this.locators.form.inferSchemaSubmit);

    // await this.page.waitForSelector('spinnericon.p-button-loading-icon', {
    //   state: 'hidden',
    //   timeout: 15000
    // });

    await this.page.locator(this.datapod.form.addAttributeButton).click();
    //await this.page.locator(this.dataEngineering.columnTypeDropdown).getByRole('button', { name: 'dropdown trigger' }).click();

    // const columnSearch = this.page.locator(this.dataEngineering.columnSearchInput);
    // await columnSearch.waitFor();
    // await columnSearch.fill('varchar');

    // const varcharOption = this.page.locator(this.dataEngineering.varcharOption);
    // await varcharOption.waitFor({ state: "visible", timeout: 10000 });
    // await varcharOption.click();

    // await this.page.locator(this.dataEngineering.lengthInput).fill('20');
    // await this.page.locator(this.dataEngineering.keyRadioYes).click();

    // await this.page.locator(this.dataEngineering.submitAttributeButton).click();
    // await this.page.locator(this.dataEngineering.submitMainButton).waitFor();
    // await this.page.locator(this.dataEngineering.submitMainButton).click();

    await selectDropdown(this.page, {
      locator: this.datapod.form.attributeType,
      valueToSelect: attributeType
    });
    await this.page.locator(this.datapod.form.keyYesRadioButton).click();
    await this.submitAttributeForm();

  }


  async getRowStatus() {
    const statusLocator = this.page.locator(
      '.severity-td-text span'
    );

    await statusLocator.waitFor({
      state: "visible",
      timeout: 10000,
    });

    const status = (await statusLocator.textContent())?.trim();
    return status || "";
  }

  async isViewActionEnabled() {
    await this.openActionMenu();

    const viewAction = this.page
      .locator('li')
      .filter({ hasText: /^View$/ });

    await viewAction.waitFor({ state: "visible" });

    const ariaDisabled =
      (await viewAction.getAttribute("aria-disabled")) === "true";

    const disabledByClass =
      (await viewAction.getAttribute("class"))?.includes("p-disabled");

    return !(ariaDisabled || disabledByClass);
  }

  async openViewActionSafely() {
    const enabled = await this.isViewActionEnabled();

    if (!enabled) {
      throw new Error("View action is disabled for this rule");
    }

    await this.page
      .locator('li')
      .filter({ hasText: /^View$/ })
      .click();
  }

  /* =========================================================
       GET EXECUTION STATUS (GENERIC)
       ========================================================= */
  async getExecutionStatus() {
    const statusCell = this.page.locator(
      "td .severity-td-text span"
    ).first();

    const status = (await statusCell.textContent())?.trim();
    return status; // e.g. COMPLETED | FAILED | RUNNING
  }

  /* =========================================================
     CHECK IF VIEW ACTION IS ENABLED
     ========================================================= */
  async isViewEnabled() {
    const viewBtn = this.page.getByRole("menuitem", { name: "View" });
    return await viewBtn.isEnabled();
  }

  /* =========================================================
     OPEN LOGS PANEL
     ========================================================= */
  async openLogs() {
    await this.openActionMenu();
    await this.page.getByRole("menuitem", { name: "Logs" }).click();
    await this.page.waitForSelector("pre", { timeout: 15000 });
  }

  /* =========================================================
     READ FULL LOG TEXT
     ========================================================= */
  async getExecutionLogsText() {
    const logPre = this.page.locator("pre").first();
    return (await logPre.textContent()) || "";
  }

  /* =========================================================
     EXTRACT FAILURE (GENERIC + EXTENSIBLE)
     ========================================================= */
  async extractFailureFromLogs() {
    const logs = await this.getExecutionLogsText();

    if (!logs.trim()) {
      return {
        found: false,
        category: "NO_LOGS",
        reason: "No logs available",
      };
    }

    const rules = [
      {
        category: "DB_MISSING_TABLE",
        regex: /table .* doesn't exist/i,
      },
      {
        category: "PERMISSION_DENIED",
        regex: /permission denied/i,
      },
      {
        category: "SPARK_RUNTIME",
        regex: /RuntimeException/i,
      },
      {
        category: "EXECUTION_FAILED",
        regex: /\[ERROR\].*Execution Failed/i,
      },
    ];

    for (const rule of rules) {
      const match = logs.match(rule.regex);
      if (match) {
        return {
          found: true,
          category: rule.category,
          reason: match[0],
        };
      }
    }

    return {
      found: true,
      category: "UNKNOWN",
      reason: logs.split("\n").find(l => l.includes("ERROR")) || "Unknown failure",
    };
  }

  //data -prepration for dataset
  // async openDataPreparation() {
  //   await this.page.locator(this.menu.dataPreparation).click();
  //   await this.waitForPlusLoaderToDisappear();
  // }

  async navigateToDatalist() {
    await this.page.locator(this.locators.dataPreparation.datasetList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillSourceName(attributeSourceName) {
    const sourceNameField = this.page.locator(this.dataset.form.attributeSourceName);
    await sourceNameField.waitFor({ state: 'visible' });
    await sourceNameField.waitFor({ state: 'attached' });
    await sourceNameField.fill(attributeSourceName);
  }

  async clickSubmitButton() {
    await this.page.locator(this.dataset.form.submitButton).click();
  }

  // async fillDatasetBasicDetails(name, dataSourceValue, dataSourceName, attributeSourceName) {
  //   await this.fillRuleName(name);
  //   await this.clickContinue();
  //   await selectDropdown(this.page, {
  //     locator: this.dataset.form.selectSource,
  //     valueToSelect: dataSourceValue
  //   });
  //   await selectDropdown(this.page, {
  //     locator: this.dataset.form.sourceName,
  //     valueToSelect: dataSourceName
  //   });
  //   await this.clickContinue();
  //   await this.fillSourceName(attributeSourceName);
  //   await this.clickContinue();
  //   await this.clickSubmitButton();
  // }

  //data preparation for dataset final
  async fillDatasetBasicDetails(
    name,
    dataSourceType,
    dataSourceName,
    attributeSourceName
  ) {

    await this.fillRuleName(name);
    await this.clickContinue();

    // Select Data Source Type
    await selectDropdown(this.page, {
      locator: this.dataset.form.selectSource,
      valueToSelect: dataSourceType
    });

    // Handle dynamic behavior based on source type
    if (dataSourceType === 'DATAPOD' || dataSourceType === 'DATASET') {

      await selectDropdown(this.page, {
        locator: this.dataset.form.sourceName,
        valueToSelect: dataSourceName
      });

    } else if (dataSourceType === 'RELATION') {

      const sourceNameField = this.page.locator(this.dataset.form.sourceName);

      await sourceNameField.waitFor({ state: "visible" });

      const disabled = await sourceNameField.isDisabled();

      if (!disabled) {
        throw new Error("Source Name field should be disabled for RELATION");
      }
    }

    await this.clickContinue();

    // Fill attribute source name if field exists
    if (attributeSourceName) {
      await this.fillSourceName(attributeSourceName);
    }

    await this.clickContinue();
    // await this.clickSubmitButton();
  }


  //data preparation for expression final
  async fillMatchValue(matchValue) {
    await this.fill(this.expression.form.matchValue, matchValue)
  }

  async fillNotMatchValue(notMatchValue) {
    await this.fill(this.expression.form.notMatchValue, notMatchValue)
  }

  async fillExpressionCreateForm({
    name,
    relationType,
    relationName,
    matchType,
    matchValue,
    notMatchType,
    notMatchValue
  }) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.expression.form.relationType,
      valueToSelect: relationType
    });
    await selectDropdown(this.page, {
      locator: this.expression.form.relationName,
      valueToSelect: relationName
    });
    await selectDropdown(this.page, {
      locator: this.expression.form.matchType,
      valueToSelect: matchType
    });
    await this.fillMatchValue(matchValue);


    // If FORMULA → dropdown
    if (matchType.toUpperCase() === "FORMULA") {

      await this.page.locator(this.expression.form.matchValueDD)
      //.waitFor({ state: "visible" });

      await selectDropdown(this.page, {
        locator: this.expression.form.matchValueDD,
        valueToSelect: matchValue
      });
    }

    /* ================= NOT MATCH TYPE ================= */

    await selectDropdown(this.page, {
      locator: this.expression.form.notMatchType,
      valueToSelect: notMatchType
    });

    if (notMatchType.toUpperCase() === "STRING") {

      await this.page.locator(this.expression.form.notMatchValue)
      //.waitFor({ state: "visible" });

      await this.fillNotMatchValue(notMatchValue);
    }

    if (notMatchType.toUpperCase() === "FORMULA") {

      await this.page.locator(this.expression.form.notMatchValueDD)
      //.waitFor({ state: "visible" });

      await selectDropdown(this.page, {
        locator: this.expression.form.notMatchValueDD,
        valueToSelect: notMatchValue
      });
    }
  }



  //data preparation for formula
  async fillSQLExpression(expression) {
    await this.fill(this.formula.form.sqlExpression, expression)
  }

  async fillFormulaCreateForm({
    name,
    sourceType,
    sourceName,
    expression
  }) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.formula.form.sourceType,
      valueToSelect: sourceType
    });
    await selectDropdown(this.page, {
      locator: this.formula.form.sourceName,
      valueToSelect: sourceName
    });
    await this.fillSQLExpression(expression);
  }

  //data preparation for function
  async fillFunctionCreateForm({
    name,
    category
  }) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.function.form.category,
      valueToSelect: category
    });
  }

  //data preparation for relation
  async fillRelationCreateForm({
    name,
    sourceType,
    sourceName
  }) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.relation.form.sourceType,
      valueToSelect: sourceType
    });
    await selectDropdown(this.page, {
      locator: this.relation.form.sourceName,
      valueToSelect: sourceName
    });
  }

  //data preparation for map rule
  async clickAutoPopulateButton() {
    await this.page.locator(this.map.mapRule.form.autoPopulateButton).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async selectByNameTag() {
    await this.page.locator(this.map.mapRule.form.byNameTag).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillMapRuleCreateForm({
    name,
    mapType,
    sourceType,
    sourceName,
    targetType,
    targetName,
    saveMode
  }) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.mapType,
      valueToSelect: mapType
    });
    await this.clickContinue();
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.sourceType,
      valueToSelect: sourceType
    });
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.sourceName,
      valueToSelect: sourceName
    });
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.targetType,
      valueToSelect: targetType
    });
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.targetName,
      valueToSelect: targetName
    });
    await this.clickContinue();
    await this.clickAutoPopulateButton();
    await this.selectByNameTag();
    await this.clickContinue();
    await selectDropdown(this.page, {
      locator: this.map.mapRule.form.saveMode,
      valueToSelect: saveMode
    });
  }

  //data preparation for map rule group
  async fillRuleGroupCreateForm({
    name,
    ruleNames
  }) {
    await this.fillRuleGroupName(name);
    await selectDropdownMultiselectMultiple(this.page, {
      locator: this.map.mapRuleGroup.form.rules,
      valuesToSelect: ruleNames,
      useSearch: true
    });
  }


  //data preparation for Operator
  async fillAPIUrl(url) {
    await this.fill(this.operator.form.apiUrl, url)
  }

  async fillClassName(clsName) {
    await this.fill(this.operator.form.className, clsName)
  }

  async fillOperatorCreateForm({
    name,
    operatorType,
    operatorMode,
    modeValue,
    filePath
  }) {

    // Step 1: Fill Name
    await this.fillRuleName(name);

    // Step 2: Select Type
    await selectDropdown(this.page, {
      locator: this.operator.form.operatorType,
      valueToSelect: operatorType
    });

    // Step 3: Click Continue (form reloads)
    await this.clickContinue();
    await this.waitForPlusLoaderToDisappear();

    // =====================================================
    // TYPE BASED HANDLING
    // =====================================================

    switch (operatorType) {

      // ================== JAVA ==================
      case "JAVA":

        //await this.operator.form.mode.waitFor({ state: "visible" });

        await selectDropdown(this.page, {
          locator: this.operator.form.mode,
          valueToSelect: operatorMode
        });

        if (operatorMode === "API") {
          await this.page.locator(this.operator.form.apiUrl)
          //.waitFor({ state: "visible" });
          await this.fillAPIUrl(modeValue);
        }

        if (operatorMode === "CLASS") {
          await this.page.locator(this.operator.form.className)
          //.waitFor({ state: "visible" });
          await this.fillClassName(modeValue);
        }

        break;

      // ================== PYTHON ==================
      case "PYTHON":

        //await this.operator.form.mode.waitFor({ state: "visible" });

        await selectDropdown(this.page, {
          locator: this.operator.form.mode,
          valueToSelect: operatorMode
        });

        if (operatorMode === "API") {
          await this.page.locator(this.operator.form.apiUrl)
          //.waitFor({ state: "visible" });
          await this.fillAPIUrl(modeValue);
        }

        if (operatorMode === "SCRIPT") {
          await this.page.locator(this.operator.form.scriptUpload)
          //.waitFor({ state: "visible" });
          await this.uploadScriptFile(filePath);
        }

        break;

      // ================== SQL ==================
      case "SQL":

        await this.page.locator(this.operator.form.scriptUpload)
        //.waitFor({ state: "visible" });
        await this.uploadScriptFile(filePath);

        break;

      // ================== UNIX ==================
      case "UNIX":

        await this.page.locator(this.operator.form.scriptUpload)
        //.waitFor({ state: "visible" });
        await this.uploadScriptFile(filePath);

        break;

      default:
        throw new Error(`Unsupported operator type: ${operatorType}`);
    }

  }

  //data profiling rule
  async navigateToDataProfiling() {
    await this.page.locator(this.menu.dataProfiling).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async openDPParameterList() {
    await this.page.locator(this.locators.dataProfiling.parameterList).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async submitDPEdit() {
    await this.clickContinue();
    await this.clickContinue();
    await this.submitRule();
  }
  // async clickmultiselectAttributedd(){
  //   await this.page.locator(this.dataProfiling.dprule.form.sourceAttributes).click();
  //   await this.waitForElementToBeVisible();
  // }

  async fillDataProfilingRuleCreateForm({
    name,
    sourceValue,
    sourceName,
    sourceAttributeValue = [],
    bussinessDate,
    bussinessName }) {
    await this.fillRuleName(name);
    await this.clickContinue();
    await selectDropdown(this.page, {
      locator: this.dataProfiling.dprule.form.sourceType,
      valueToSelect: sourceValue
    });
    await selectDropdown(this.page, {
      locator: this.dataProfiling.dprule.form.sourceName,
      valueToSelect: sourceName
    });
    //await this.clickmultiselectAttributedd();

    if (sourceAttributeValue) {
      await selectDropdownMultiselectMultiple(this.page, {
        locator: this.dataProfiling.dprule.form.sourceAttributes,
        valuesToSelect: sourceAttributeValue,
        useSearch: false,
      });
    }
    await selectDropdown(this.page, {
      locator: this.dataProfiling.dprule.form.bussinessDate,
      valueToSelect: bussinessDate
    });
    await selectDropdown(this.page, {
      locator: this.dataProfiling.dprule.form.bussinessName,
      valueToSelect: bussinessName
    });
    await this.clickContinue();

  }


  // Data Ingestion 
  async clickOnContinue() {
    await this.page.locator(this.crudPage.continueButton).click()
  }

  //data quality 
  //rule 


  async validateTableAutoPopulated({
    tableLocator,
    sourceLocator,
    targetLocator
  }) {
    const rows = this.page.locator(`${tableLocator} tbody tr`);
    const count = await rows.count();

    if (count === 0) {
      throw new Error("No rows found in table");
    }

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);

      const sourceValue = await row.locator(sourceLocator).inputValue();
      const targetValue = await row.locator(targetLocator).textContent();

      if (!sourceValue || sourceValue.trim() === "") {
        throw new Error(`Row ${i + 1}: Source NOT populated`);
      }

      if (
        !targetValue ||
        targetValue.trim() === "" ||
        targetValue.includes("-Select-")
      ) {
        throw new Error(`Row ${i + 1}: Target NOT populated`);
      }
    }
  }

 
  async createDataIngestion({

    name,
    ingestionType,
    refreshType,
    mappingType,
    /* ===== FILE SOURCE ===== */

    sourceDataSource,
    sourceFormat,
    sourcePath,
    archive,
    condtion,

    /* ===== TABLE SOURCE ===== */

    sourceType,
    sourceName,

    /* ===== TARGET ===== */

    targetDataSource,
    targetFormat,
    targetType,
    targetName,
    targetPath,

    saveMode,
    loadType,

    /* ===== TRANSFORMATION ===== */
    autoPopulate,
    sourceAttribute,
    targetAttribute,
    functionName,
    removeCharName

  }) {

    // Step 1
    await this.fillRuleName(name);

    // Step 2
    await selectDropdown(this.page, {
      locator: this.dataIngestion.daRule.form.ingestionType,
      valueToSelect: ingestionType
    });
    if(refreshType){
    await this.selectRefreshType(refreshType);
    }
    if(mappingType){
      await this.selectMappingType(mappingType);
    }
    await this.clickContinue();
    await this.waitForLoader();


    switch (ingestionType) {

      /* ================= FILE → FILE ================= */

      case "File - File":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        // if (sourcePath)
        //   await this.page.locator(this.dataIngestion.daRule.form.sourcePath).fill(sourcePath);

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);

        // if (archive)
        //   await selectDropdown(this.page, {
        //     locator: this.dataIngestion.form.sourceAction,
        //     valueToSelect: archive
        //   });

        // if (condtion)
        //   await selectDropdown(this.page, {
        //     locator: this.dataIngestion.form.condtion,
        //     valueToSelect: condtion
        //   });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });

        // if (targetPath)
        //   await this.page.locator(this.dataIngestion.daRule.form.targetPath).fill(targetPath);

        if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

        //attribute mapping step is common for all ingestion types, so handling it outside switch-case
        // if (sourceAttribute && targetAttribute) {
        //   await selectDropdown(this.page, {
        //     locator: this.dataIngestion.form.sourceAttribute,
        //     valueToSelect: sourceAttribute
        //   });
        //   await selectDropdown(this.page, {
        //     locator: this.dataIngestion.form.targetAttribute,
        //     valueToSelect: targetAttribute
        //   });

        if (sourceAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.sourceAttributeInput).fill(sourceAttribute);
        }
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

          if (targetAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.targetAttributeInput).fill(targetAttribute);
          }
         
          await this.clickOnContinue();
      

        break;


      /* ================= FILE → TABLE ================= */

      case "File - Table":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });

        if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });


        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }
        
        await this.clickOnContinue();

        break;


      /* ================= FILE → FTP ================= */

      case "File - FTP":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });

        if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

        if (sourceAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.sourceAttributeInput).fill(sourceAttribute);
        }
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

          if (targetAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.targetAttributeInput).fill(targetAttribute);
          }
         
          await this.clickOnContinue();

        break;


      /* ================= TABLE → FILE ================= */

      case "Table - File":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });
        
        if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });
        
        await this.clickOnContinue();
        
        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }
        await this.clickOnContinue();
        break;


      /* ================= TABLE → TABLE ================= */

      case "Table - Table":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });


        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });
        
        if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForLoader();
        }
        
        await this.clickOnContinue();

        break;


      /* ================= TABLE → FTP ================= */

      case "Table - FTP":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });

          if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        await this.clickOnContinue();

        if (sourceAttribute){
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceAttributeDD,
            valueToSelect: sourceAttribute
          });
        }
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

          if (targetAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.targetAttributeInput).fill(targetAttribute);
          }
         
          await this.clickOnContinue();


        break;


      /* ================= FTP → FILE ================= */

      case "FTP - File":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });

        if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

        if (sourceAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.sourceAttributeInput).fill(sourceAttribute);
        }
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

          if (targetAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.targetAttributeInput).fill(targetAttribute);
          }
         
          await this.clickOnContinue();

        break;


      /* ================= FTP → TABLE ================= */

      case "FTP - Table":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });

          if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

        await this.clickOnContinue();

        break;


        /* ================= TABLE → GRAPH ================= */

      case "Table - Graph":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });

          if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });

        await this.clickOnContinue();

        await this.clickOnContinue();

        break;


        /* ================= GRAPH → TABLE ================= */

      case "Graph - Table":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });

          if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

        await this.clickOnContinue();

        break;


        /* ================= GRAPH → FILE ================= */

      case "Graph - File":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetFormat,
            valueToSelect: targetFormat
          });

        if (targetName)
          await this.page.locator(this.dataIngestion.daRule.form.targetNameInput).fill(targetName);

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

        await this.clickOnContinue();

        break;


        /* ================= FILE → GRAPH ================= */

      case "File - Graph":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceFormat)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceFormat,
            valueToSelect: sourceFormat
          });

        if (sourceName)
          await this.page.locator(this.dataIngestion.daRule.form.sourceNameInput).fill(sourceName);


        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetType,
            valueToSelect: targetType
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDD,
            valueToSelect: targetName
          });

          if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });

        await this.clickOnContinue();

        if (autoPopulate) {
          await this.page.locator(this.dataIngestion.daRule.form.autoPopulate).click();
          await this.waitForPlusLoaderToDisappear();
        }

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

        await this.clickOnContinue();

        break;



        /* ================= TABLE → COLLECTION ================= */

      case "Table - Collection":

        if (sourceDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceDataSource,
            valueToSelect: sourceDataSource
          });

        if (sourceType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceType,
            valueToSelect: sourceType
          });

        if (sourceName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceNameDD,
            valueToSelect: sourceName
          });

        if (targetDataSource)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetDataSource,
            valueToSelect: targetDataSource
          });

        if (targetName)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.targetNameDDTable_Collection,
            valueToSelect: targetName
          });

          if (saveMode)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.saveMode,
            valueToSelect: saveMode
          });

        if (loadType)
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.loadType,
            valueToSelect: loadType
          });
          
        await this.clickOnContinue();


          if (sourceAttribute){
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.sourceAttributeDD,
            valueToSelect: sourceAttribute
          });
        }
          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.functionDropdown,
            valueToSelect: functionName
          });

          await selectDropdown(this.page, {
            locator: this.dataIngestion.daRule.form.removeCharDrodown,
            valueToSelect: removeCharName
          });

          if (targetAttribute){
          await this.page.locator(this.dataIngestion.daRule.form.targetAttributeInput).fill(targetAttribute);
          }
        await this.clickOnContinue();

        break;


      default:
        throw new Error(`Unsupported ingestion type: ${ingestionType}`);
    }


    /* ================= TRANSFORMATION STEP ================= */

    // if (sourceAttribute) {

    //   await this.page.locator(this.dataIngestion.form.sourceAttributeInput)
    //     .fill(sourceAttribute);

    //   if (functionName)
    //     await selectDropdown(this.page, {
    //       locator: this.dataIngestion.form.functionDropdown,
    //       valueToSelect: functionName
    //     });

    //   if (targetAttribute)
    //     await this.page.locator(this.dataIngestion.form.targetAttributeInput)
    //       .fill(targetAttribute);

    //   await this.clickOnContinue();
    // }

//     await fillAttributeMapping({ mappings = [] }) {

//   for (let i = 0; i < mappings.length; i++) {
//     const { sourceAttribute, functionName, targetAttribute } = mappings[i];

//     // 👇 Dynamic row locator (index based)
//     const sourceLocator = this.page.locator(this.dataIngestion.form.sourceAttribute).nth(i);
//     const functionLocator = this.page.locator(this.dataIngestion.form.functionDropdown).nth(i);
//     const targetLocator = this.page.locator(this.dataIngestion.form.targetAttribute).nth(i);

//     // Source
//     if (sourceAttribute) {
//       await sourceLocator.fill(sourceAttribute);
//     }

//     // Function
//     if (functionName) {
//       await selectDropdown(this.page, {
//         locator: functionLocator,
//         valueToSelect: functionName
//       });
//     }

//     // Target
//     if (targetAttribute) {
//       await targetLocator.fill(targetAttribute);
//     }
//   }
//   await this.clickOnContinue();
// }

  }


  async openDataQuality() {
    await this.page.locator(this.menu.dataQuality).click();
    await this.waitForPlusLoaderToDisappear();
  }
  async openDataQualityRule() {
    await this.page.locator(this.dataQuality.rule).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async fillRuleBasicDetails(name, type) {
    await this.fillRuleName(name);
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.type,
      valueToSelect: type
    });
    await this.clickContinue();
  }

  async configureAttributeRule({
    type: type,
    sourceName: sourceName,
    attribute: attribute,
    rowKeyType: rowKeyType,
    bussinessDate: bussinessDate,
    name: name,
    checkType: checkType,
    targetType: targetType,
    targetName: targetName,
    sourceAttribute: sourceAttribute,
    targetAttribute: targetAttribute
  }) {
    if(type){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.sourceType,
      valueToSelect: type
    });
  }
    if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.sourceName,
      valueToSelect: sourceName
    });
  }
  if(attribute){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.attribute,
      valueToSelect: attribute
    });
  }
  if(rowKeyType){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.rowKeyType,
      valueToSelect: rowKeyType
    });
  }
  if(bussinessDate){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.bussinessDate,
      valueToSelect: bussinessDate
    });
  }
  if(name){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.name,
      valueToSelect: name
    });
  }
    await this.clickContinue();

    if(checkType){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.checkType,
      valueToSelect: checkType
    });
  }

    if(targetType){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.targetType,
      valueToSelect: targetType
    });
  }

  if(targetName){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.targetName,
      valueToSelect: targetName
    });
  }

   if(sourceAttribute){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.sourceAttribute,
      valueToSelect: sourceAttribute
    });
  } 
  
  if(targetAttribute){
    await selectDropdown(this.page, {
      locator: this.dataQuality.dqrule.form.targetAttribute,
      valueToSelect: targetAttribute
    });
  }
    await this.clickContinue();
  }
  async selectQualityEntity(entity) { }
  async selectQualityAttribute(attribute) { }
  async selectQualityCheckType(type) { }
  async selectQualityReferenceAttribute(attribute) { }



  async getToastMessage({ timeout = 15000 } = {}) {
    await this.waitForInbuiltButtonLoaderToDisapper();
    await this.waitForPlusLoaderToDisappear();

    const toastDetail = this.page
      .locator(this.common.toast.container)
      .locator(this.common.toast.detail);

    // Wait for actual message text, not just container
    await toastDetail.waitFor({ state: "visible", timeout });

    await expect(toastDetail).toHaveText(/.+/, { timeout });

    const text = (await toastDetail.textContent())?.trim();

    if (!text) {
      throw new Error("Toast is visible but message text is empty");
    }

    return text;
  }


  // async fillBatchSchedulerCreateForm({ name, selectAllItems = false }) {

  //   await this.page.locator("#name").fill(name);

  //   await this.page.locator("#name").press("Tab");
  //   await this.page.locator("#dname").press("Tab");

  //   await this.openBatchSelectionPanel();

  //   if (selectAllItems) {
  //     await this.selectAllBatchItems();
  //   }

  //   await this.closeBatchSelectionPanel();
  // }

  // async openBatchSelectionPanel() {
  //   await this.page.locator("div").filter({ hasText: /^empty$/ }).first().click();
  // }

  // async selectAllBatchItems() {
  //   await this.page.getByRole("checkbox", { name: /All items/i }).click();
  // }

  // async closeBatchSelectionPanel() {
  //   await this.page.locator("body").click();
  // }

  // async navigateToBatchScheduler() {
  //   await this.page.getByRole('link', { name: /Batch Scheduler/i }).click();

  //   // role selection (if appears)
  //   const dropdown = this.page.locator('[id^="pn_id"]').getByRole('button');
  //   if (await dropdown.isVisible()) {
  //     await dropdown.click();
  //     await this.page.getByRole('option', { name: /Data Engineer/i }).click();
  //     await this.page.getByRole('link', { name: /Batch Scheduler/i }).click();
  //   }
  // }

  async createDataArchival({
    name,
    sourceDatapod,
    refreshType,
    incrementalKey,
    targetDatapod,
    auditKey,
    auditValue,
    audValue,
    audName,
    saveMode
  }){
    await this.fillRuleName(name);
    
    await this.clickContinue();
    
    if(sourceDatapod){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.sourceDatapod,
      valueToSelect: sourceDatapod
    });
  }

  if(refreshType){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.refreshType,
      valueToSelect: refreshType
    });
  }

  if(incrementalKey){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.incrementalKey,
      valueToSelect: incrementalKey
    });
  }

  await this.clickContinue();

  if(targetDatapod){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.targetDatapod,
      valueToSelect: targetDatapod
    });
  }

  if(auditKey){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.auditKey,
      valueToSelect: auditKey
    });
  }

  if(auditValue){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.auditValue,
      valueToSelect: auditValue
    });
  }

  if (audValue){
    await this.page.locator(this.dataArchival.daRule.form.audValue).fill(audValue);
  }

  if(audName){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.audName,
      valueToSelect: audName
    });
  }

  if(saveMode){
    await selectDropdown(this.page, {
      locator: this.dataArchival.daRule.form.saveMode,
      valueToSelect: saveMode
    });
  }

  await this.clickContinue();

  }

  //Data Migration
  async createDataMigration({
    name,
    sourceDataSource,
    targetDataSource,
    saveMode
  }){
    await this.fillRuleName(name);
    
    await this.clickContinue();
    
    if(sourceDataSource){
    await selectDropdown(this.page, {
      locator: this.dataMigration.dmRule.form.sourceDataSource,
      valueToSelect: sourceDataSource
    });
  }

  if(targetDataSource){
    await selectDropdown(this.page, {
      locator: this.dataMigration.dmRule.form.targetDataSource,
      valueToSelect: targetDataSource
    });
  }

    if(saveMode){
    await selectDropdown(this.page, {
      locator: this.dataMigration.dmRule.form.saveMode,
      valueToSelect: saveMode
    });
  }

    await this.clickContinue();
  }

  //Batch scheduler  --- Batch
  async clickPipelineDropdown() {
    await this.page.locator(this.batchScheduler.batchRule.form.pipelineInfo).click();
    await this.waitForPlusLoaderToDisappear();
  }

  async selectPipelinesForBatch({
  pipelineNames = [],   // specific rules
  selectAll = false // select all option
}) {
  if (selectAll) {
    // Click Select All checkbox or option
    await this.page.locator("//div[@aria-label='All items unselected']").click(); // adjust locator if needed
    return;
  }

  if (!pipelineNames || pipelineNames.length === 0) {
    throw new Error("Provide pipelineNames or set selectAll=true");
  }

  await selectDropdownMultiselectMultiple(this.page, {
    labelText: "Pipeline Info",
    valuesToSelect: pipelineNames,
    useSearch: true,
  });
}
async selectNumberOfIteration(itrValue){
  await this.page.locator(this.batchScheduler.batchRule.form.iteration).fill(itrValue);

}
  async createBatchScheduler({
    name,
    pipelineNames,
    itrValue
  }){
    await this.fillRuleName(name);
    await this.clickPipelineDropdown();
    await this.selectPipelinesForBatch(pipelineNames);
    await this.selectNumberOfIteration(itrValue);
  }

  //Batch Scheduler --- Scheduler
  async fillSchedulerCreateForm({
    name,
    type,
    scheduleName,
    startDate,
    endDate,
    frequency,
    suspendAfter,
    maxRetries,
    startCondition
  }){
    await this.fillRuleName(name);

    if(type){
    await selectDropdown(this.page, {
      locator: this.batchScheduler.batchSchedule.form.type,
      valueToSelect: type
    });
  }

    if(scheduleName){
    await selectDropdown(this.page, {
      locator: this.batchScheduler.batchSchedule.form.scheduleName,
      valueToSelect: scheduleName
    });
  }

    if(startDate){
      await this.page.locator(this.batchScheduler.batchSchedule.form.startDateButton).click();
      await this.waitForPlusLoaderToDisappear();
      await this.page.locator(this.batchScheduler.batchSchedule.form.startDate).fill(startDate);
  }

    if(endDate){
    await selectDropdown(this.page, {
      locator: this.batchScheduler.batchSchedule.form.endDate,
      valueToSelect: endDate
    });
  }

    if(frequency){
    await selectDropdown(this.page, {
      locator: this.batchScheduler.batchSchedule.form.frequency,
      valueToSelect: frequency
    });
  }

    if(suspendAfter){
      await this.page.locator(this.batchScheduler.batchSchedule.form.suspendAfter).fill(suspendValue);
    }

    if(maxRetries){
      await this.page.locator(this.batchScheduler.batchSchedule.form.maxRetries).fill(retryValue);
    }

    if(startCondition){
    await selectDropdown(this.page, {
      locator: this.batchScheduler.batchSchedule.form.startCondition,
      valueToSelect: startCondition
    });
  }

  }

  //Data Reconcilation
  async submitReconEdit() {
    await this.clickContinue();
    await this.clickContinue();
    await this.clickContinue();
    await this.clickContinue();
    await this.submitRule();
  }

  async createReconRule({
    name,
    ruleType,
    source,
    sourceName,
    sourceAttribute,
    sourceFunction,
    target,
    targetName,
    targetAttribute,
    targetFunction,
    attributeMapping,
    joinKeyAttribute,
    mapSourceAttribute,
    mapTargetAttribute,
    compareFunction,
    thresholdType
  }){
    await this.fillRuleName(name);

    if(ruleType){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.ruleType,
      valueToSelect: ruleType
    });
  }

    await this.clickContinue();

    if(source){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.source,
      valueToSelect: source
    });
  }

  if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.sourceName,
      valueToSelect: sourceName
    });
  }

  if(sourceAttribute){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.sourceAttribute,
      valueToSelect: sourceAttribute
    });
  }

  if(sourceFunction){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.sourceFunction,
      valueToSelect: sourceFunction
    });
  }

  await this.clickContinue();

  if(target){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.target,
      valueToSelect: target
    });
  }

  if(targetName){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.targetName,
      valueToSelect: targetName
    });
  }

  if(targetAttribute){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.targetAttribute,
      valueToSelect: targetAttribute
    });
  }

  if(targetFunction){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.targetFunction,
      valueToSelect: targetFunction
    });
  }

  await this.clickContinue();
  
  if(attributeMapping){
   await this.page.locator(this.dataReconciliation.drRule.form.autoMapButton).click();
    await this.waitForPlusLoaderToDisappear();
    await this.page.locator(this.dataReconciliation.drRule.form.byOrder).click();
    await this.waitForPlusLoaderToDisappear();
    await this.clickContinue();
  }

  if(joinKeyAttribute){
    await this.page.locator(this.dataReconciliation.drRule.form.joinKeyAttribute).click();
    await this.waitForPlusLoaderToDisappear();
    await this.page.locator(this.dataReconciliation.drRule.form.addButton).click();
    await this.waitForPlusLoaderToDisappear();
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.mapSourceAttribute,
      valueToSelect: mapSourceAttribute
    });
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.mapTargetAttribute,
      valueToSelect: mapTargetAttribute
    });
    await this.page.locator(this.dataReconciliation.drRule.form.submitButton).click();
    await this.waitForPlusLoaderToDisappear();
  }

  if(compareFunction){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.compareFunction,
      valueToSelect: compareFunction
    });
  }

  if(thresholdType){
    await selectDropdown(this.page, {
      locator: this.dataReconciliation.drRule.form.thresholdType,
      valueToSelect: thresholdType
    });
  }
  }

  //Data Vault
  async fillDataVaultForm({
    name,
    type,
    dataSource,
    sourceName,
    hubValue,
    linkValue,
    satelliteValue,
    hashValue,
    loadValue,
    recordValue
  }){
    await this.fillRuleName(name);
   
    if(type){
    await selectDropdown(this.page, {
      locator: this.dataVault.daVault.form.type,
      valueToSelect: type
    });
  }

  if(dataSource){
    await selectDropdown(this.page, {
      locator: this.dataVault.daVault.form.datasource,
      valueToSelect: dataSource
    });
  }

  if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataVault.daVault.form.sourceName,
      valueToSelect: sourceName
    });
  }

  await this.page.locator(this.dataVault.daVault.form.hubEntity).fill(hubValue);
  await this.page.locator(this.dataVault.daVault.form.linkEntity).fill(linkValue);
  await this.page.locator(this.dataVault.daVault.form.satelliteEntity).fill(satelliteValue);
  await this.page.locator(this.dataVault.daVault.form.hashKey).fill(hashValue);
  await this.page.locator(this.dataVault.daVault.form.loadDate).fill(loadValue);
  await this.page.locator(this.dataVault.daVault.form.recordSource).fill(recordValue);

  }

  //Data Hub
  async fillHubForm({
    name,
    vault,
    source,
    sourceName,
    keyAttribute = []
  }){
    await this.fillRuleName(name);
   
    if(vault){
    await selectDropdown(this.page, {
      locator: this.dataVault.daHub.form.vault,
      valueToSelect: vault
    });
  }

  if(source){
    await selectDropdown(this.page, {
      locator: this.dataVault.daHub.form.source,
      valueToSelect: source
    });
  }

  if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataVault.daHub.form.sourceName,
      valueToSelect: sourceName
    });
  }

  if(keyAttribute){
    await selectDropdownMultiselectMultiple(this.page, {
      locator: this.dataVault.daHub.form.keyAttribute,
      valuesToSelect: keyAttribute,
      useSearch: true
    });
  }

  }

  //Data Link
  async fillLinkForm({
    name,
    vault,
    source,
    sourceName
  }){
    await this.fillRuleName(name);

    if(vault){
    await selectDropdown(this.page, {
      locator: this.dataVault.daLink.form.vault,
      valueToSelect: vault
    });
  }

  if(source){
    await selectDropdown(this.page, {
      locator: this.dataVault.daLink.form.source,
      valueToSelect: source
    });
  }

  if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataVault.daLink.form.sourceName,
      valueToSelect: sourceName
    });
  }
  }

  //Data Satellite
  async fillSatelliteForm({
    name,
    vault,
    type,
    sourceName,
    keyAttribute = []
  }){
    await this.fillRuleName(name);

    if(vault){
    await selectDropdown(this.page, {
      locator: this.dataVault.daSatellite.form.vault,
      valueToSelect: vault
    });
  }

  if(type){
    await selectDropdown(this.page, {
      locator: this.dataVault.daSatellite.form.type,
      valueToSelect: type
    });
  }

  if(sourceName){
    await selectDropdown(this.page, {
      locator: this.dataVault.daSatellite.form.sourceName,
      valueToSelect: sourceName
    });
  }

  if(keyAttribute){
    await selectDropdownMultiselectMultiple(this.page, {
      locator: this.dataVault.daSatellite.form.keyAttribute,
      valuesToSelect: keyAttribute,
      useSearch: true
    });
  }
  }

}





export { DataEngineering };
