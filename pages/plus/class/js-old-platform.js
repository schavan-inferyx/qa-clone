import { BasePage } from "../../../base/base-page.js"
import { ModuleDetector } from "../../../utils/api/module-detector.js"
import locators from "../locators/js-old-platform.js"

class JSOldPlatform extends BasePage {
  constructor(page) {
    super(page)
    this.locators = locators.login
    this.dataVisualization = locators.dataVisualization
    this.dataPreparation = locators.dataPreparation
    this.dataPipeline = locators.dataPipeline
    this.dataQuality = locators.dataQuality
    this.dataProfiling = locators.dataProfiling;
    this.dataIngestion = locators.dataIngestion;
    this.dataRecon = locators.dataRecon;

  }

  


  async login(username, password) {
    await this.page.locator(this.locators.usernameInput).fill(username)
    await this.page.locator(this.locators.passwordInput).fill(password)
    await this.page.locator(this.locators.loginButton).click()
    await this.page.waitForSelector("text=Application *", { timeout: 15000 }).catch(() => { })
    await this.page.waitForLoadState("networkidle")
  }

  async openAppSwitcher() {
    const switcher = this.page.locator(this.locators.appSwitcher).first()
    await switcher.waitFor({ state: "visible", timeout: 10000 }).catch(() => { })

    try {
      await switcher.click({ timeout: 8000 })
      await this.page.waitForSelector(this.locators.appSelect, { timeout: 5000 }).catch(() => { })
    } catch (e) {
      try {
        await switcher.click({ force: true, timeout: 5000 })
        await this.page.waitForSelector(this.locators.appSelect, { timeout: 5000 }).catch(() => { })
      } catch (e2) {
        await this.page.evaluate((xp) => {
          const el = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
          if (el) el.click()
        }, this.locators.appSwitcher)
        await this.page.waitForSelector(this.locators.appSelect, { timeout: 5000 }).catch(() => { })
      }
    }
  }


  async selectApplication(appName) {
    if (!appName) {
      throw new Error("Application name is required")
    }

    const appSelect = this.page.locator(this.locators.appSelect)

    if (await appSelect.count() > 0) {
      await appSelect.waitFor({ state: "attached" })
      await appSelect.click()
      await appSelect.selectOption({ label: appName })
    } else {
      // fallback only if dropdown truly does not exist
      await this.page.getByText(appName, { exact: true }).click()
    }
  }

  async selectRole(roleName) {
    if (!roleName) {
      throw new Error("Role name is required")
    }
    await this.page.waitForTimeout(500)
    const roleSelect = this.page.locator(this.locators.roleSelect)

    if (await roleSelect.count() > 0) {
      await roleSelect.waitFor({ state: "attached" })
      await roleSelect.click()
      await roleSelect.selectOption({ label: roleName })
    }
  }


  async submitAppAndRole() {
    const submitBtn = this.page.locator(this.locators.submitButton)
    if (await submitBtn.count()) {
      await submitBtn.click()
    } else {
      await this.page
        .getByRole("button", { name: "Submit" })
        .click()
        .catch(() => { })
    }
    await this.page.waitForTimeout(800)
    await this.waitForLoader()
  }

  async navigateToModule(moduleName) {

    let moduleLocator;

    switch (moduleName) {

      case "Data Quality":
        moduleLocator = this.dataQuality.dataQualityLink;
        break;

      case "Data Profiling":
        moduleLocator = this.dataProfiling.dataProfilingLink;
        break;

      case "Data Ingestion":
        moduleLocator = this.dataIngestion.dataIngestionLink;
        break;

      case "Data Preparation":
        moduleLocator = this.dataPreparation.dataPreparationLink;
        break;

      case "Data Recon":
        moduleLocator = this.dataRecon.dataReconLink;
        break;

      default:
        throw new Error(`Unsupported module: ${moduleName}`);
    }

    const link = this.page.locator(moduleLocator).first();

    if (await link.count()) {
      await link.click();
    } else {
      throw new Error(`${moduleName} module link not found`);
    }

    await this.page.waitForLoadState("networkidle");
  }







  //==========================
  // DATA Pipeline
  //==========================

  async navigateToDataPipeline() {
    const datapipelineLink = this.page.locator(this.dataPipeline.menuLink).first()
    if (await datapipelineLink.count()) {
      await datapipelineLink.click()
    } else {
      await this.page
        .getByRole("link", { name: "Data Pipeline" })
        .click()
        .catch(() => { })
    }
    const listLink = this.page.locator(this.dataPipeline.listLink).first()
    await listLink.waitFor({ state: "visible", timeout: 5000 })
    await listLink.click()

    await this.waitForLoader()

  }

  async searchByUUIDJS(pipeline) {
   
    await this.waitForLoader()
    const searchInput = this.page.locator(this.dataPipeline.searchInput)
    await searchInput.waitFor({ state: "visible", timeout: 1000 })
    await searchInput.fill("")
    await searchInput.click()
    await searchInput.type(pipeline, { delay: 120 })
  }

  async performView() {
    const actionButton = this.page.locator(this.dataPipeline.actionButton)
    await actionButton.waitFor({ state: "visible", timeout: 8000 })
    await actionButton.click()

    const viewButton = this.page.locator(this.dataPipeline.viewJSLink)
    await viewButton.waitFor({ state: "visible", timeout: 8000 })
    await viewButton.click()
  }

  async performDataQualityView() {
    const actionButton = this.page.locator(this.dataPipeline.actionButton)
    await actionButton.waitFor({ state: "visible", timeout: 8000 })
    await actionButton.click()

    const viewButton = this.page.locator(this.dataQuality.viewJSLink)
    await viewButton.waitFor({ state: "visible", timeout: 8000 })
    await viewButton.click()
  }



  async captureDagExecResponse({ pipelineUuid, timeout = 15000 }) {

    let dagExecData = null;

    const handler = async (response) => {
      const url = response.url();

      if (
        url.includes("getOneByUuidAndVersion") &&
        url.includes("type=dagexec") &&
        url.includes(`uuid=${pipelineUuid}`)
      ) {
        dagExecData = await response.json();
      }
    };

    this.page.on("response", handler);

    const start = Date.now();

    while (Date.now() - start < timeout) {
      if (dagExecData) {
        this.page.off("response", handler);
        return dagExecData;
      }
      await this.page.waitForTimeout(200);
    }

    this.page.off("response", handler);
    throw new Error(`Failed to capture dagexec response for ${pipelineUuid}`);
  }




  async logPipelineDetails(pipelineUuid, dagExecData) {

    const nodes = [];

    await this.page.waitForSelector("//div[@id='paper']", { state: "visible" });
    await this.page.waitForSelector(
      "//*[@id='paper']//*[name()='image' and @active='true']",
      { state: "visible" }
    );

    const images = this.page.locator(
      "//*[@id='paper']//*[name()='image' and @active='true']"
    );

    const count = await images.count();

    await this.page.waitForTimeout(5000)

    for (let i = 1; i < count; i++) {

      const image = images.nth(i);
      await image.scrollIntoViewIfNeeded();
      await image.hover({ force: true });

      const tooltip = this.page
        .locator("#divtoshow.tooltipcustom")
        .filter({ has: this.page.locator("#task_Id") })
        .first();

      await tooltip.waitFor({ state: "visible" });

      const elementType = await this.page.locator("#elementTypeText").first().textContent();
      const taskId = await this.page.locator("#task_Id").first().textContent();
      const taskName = await this.page.locator("#task_Name").first().textContent();
      const version = await this.page.locator("#task_Version").first().textContent();

      nodes.push({
        nodeIndex: i,
        type: elementType?.trim(),
        executionUuid: taskId?.trim(),
        name: taskName?.trim(),
        version: version?.trim()
      });
    }

    const taskMap = new Map();

    dagExecData?.stages?.forEach(stage => {
      stage.tasks?.forEach(task => {

        const operatorRef =
          task.operators?.[0]?.operatorInfo?.[0]?.ref;

        taskMap.set(task.taskId, {
          operatorType: operatorRef?.type || null,
          objectUuid: operatorRef?.uuid || null,
          objectName: operatorRef?.name || null,
          objectDisplayName: operatorRef?.displayName || null
        });
      });
    });

    for (const node of nodes) {

      const apiData = taskMap.get(node.executionUuid);

      const operatorType = apiData?.operatorType || null;
      const objectUuid = apiData?.objectUuid || null;
      const objectName = apiData?.objectName || null;
      const objectDisplayName = apiData?.objectDisplayName || null;

      const { module, subModule } =
        await ModuleDetector.resolve(operatorType);

      Object.assign(node, {
        module,
        subModule,
        operatorType,
        objectUuid,
        objectName,
        objectDisplayName
      });
    }

    return nodes;
  }

  async searchAndExecutePipeline(pipelineName) {
    
    await this.waitForLoader()

    const searchInput = this.page.locator(this.dataPipeline.searchInput)
    await searchInput.fill("")
    await searchInput.click()
    await searchInput.type(pipelineName, { delay: 120 })
    await this.waitForLoader()

    const actionButton = this.page.locator(this.dataPipeline.actionButton)
    await actionButton.waitFor({ state: "visible", timeout: 1000 })
    await actionButton.click()

    const executeLink = this.page.locator(this.dataPipeline.executeLink)
    await executeLink.waitFor({ state: "visible", timeout: 1000 })
    await executeLink.click()

    const [response] = await Promise.all([
      this.page.waitForResponse(res =>
        res.url().includes("execute") && res.status() === 200
      ),
      this.page.getByRole("button", { name: "Ok" }).click(),
    ])

    const responseBody = await response.json()

    const uuid =
      responseBody?.ref?.uuid || responseBody?.uuid

    if (!uuid) {
      throw new Error("Execution API response did not contain uuid")
    }

    return uuid
  }

  async navigateToPipelineResult() {
    const spinner = this.page.locator(".spinner");
    const datapipelineLink = this.page.locator(this.dataPipeline.menuLink).first()
    if (await datapipelineLink.count()) {
      await datapipelineLink.click()
    } else {
      await this.page
        .getByRole("link", { name: "Data Pipeline" })
        .click()
        .catch(() => { })
    }

    await this.page.locator(this.dataPipeline.resultsLink).first().click();
    await spinner.waitFor({ state: "hidden", timeout: 15000 }).catch(() => { });

  }

  async waitForPipelineExecution(pipelineUuid) {
    const TOTAL_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    const POLL_INTERVAL = 5000; // 5 seconds
    const start = Date.now();
    let poll = 0;

    const searchInput = this.page.locator(this.dataPipeline.searchInput);
    const refreshBtn = this.page.locator("//i[contains(@class,'panel-refresh')]");
    const spinner = this.page.locator(".spinner");


    // Navigate to Results page
    await this.page.locator(this.dataPipeline.resultsLink).first().click();
    await spinner.waitFor({ state: "hidden", timeout: 15000 }).catch(() => { });

    await this.page
      .locator(this.dataPipeline.spinner)
      .waitFor({ state: "hidden", timeout: 10000 })
      .catch(() => { });

    while (Date.now() - start < TOTAL_TIMEOUT) {
      poll++;

      // Refresh results
      await refreshBtn.click().catch(() => { });
      // await this.page.waitForTimeout(1200); // allow UI repaint
      await spinner.waitFor({ state: "hidden", timeout: 15000 }).catch(() => { });


      // Apply search (refresh clears it)
      await searchInput.fill("");
      await searchInput.type(pipelineUuid, { delay: 100 });

      const elapsed = Math.round((Date.now() - start) / 1000);

      // Read CURRENT visible label (search guarantees single row)
      const label = this.page.locator(
        "//div[contains(@class,'label-sm') and contains(@class,'ng-binding')]"
      );

      const currentLabel =
        (await label.textContent())?.trim().toUpperCase() ?? "UNKNOWN";

      console.log(
        `🔄 Poll #${poll} | ${elapsed}s | Current UI Status: ${currentLabel}`
      );

      // Exit on final states
      if (["COMPLETED", "FAILED", "KILLED"].includes(currentLabel)) {
        return currentLabel;
      }

      await this.page.waitForTimeout(POLL_INTERVAL);
    }

    throw new Error(
      `Pipeline ${pipelineUuid} did not reach final state within timeout`
    );
  }



  //==========================
  // DATA VISUALIZATION
  //==========================

  async navigateToDataVisualization() {
    const dataVisualizationLink = this.page.locator(this.dataVisualization.menuLink).first()
    if (await dataVisualizationLink.count()) {
      await dataVisualizationLink.click()
    } else {
      await this.page
        .getByRole("link", { name: "Data Visualization" })
        .click()
        .catch(() => { })
    }
    // await this.page.waitForTimeout(2000)
  }

  async navigateToDashboard() {
    const dashboardLink = this.page.locator(this.dataVisualization.dashboard).first()
    await dashboardLink.waitFor({ state: "visible", timeout: 10000 })
    await dashboardLink.click()
  }

  async searchForDashboard(name) {
    const searchBox = this.page.locator(this.dataVisualization.dashboardSearch)

    await this.manualTyping(searchBox, name, {
      delay: 30,
      clear: true,
    })
    await this.page.waitForLoadState("networkidle").catch(() => { })
  }


  async clickOnDashboard() {
    const card = this.page.locator(this.dataVisualization.dashboardCard)
    await card.waitFor({ state: "visible", timeout: 10000 })
    await card.click()
  }


  async verifyDashboardBreadcrumb() {
    await this.waitForElementToBeVisible(this.dataVisualization.dashboardTitle, 10000);
    const breadcrumbList = this.page.locator(this.dataVisualization.dashboardBedcrumb)
    const rawTexts = await breadcrumbList.allTextContents()
    const cleaned = rawTexts
      .map(t => t.replace(/\s+/g, " ").trim()) // normalize whitespace
      .filter(t => t.length > 0)                // remove empty
      .filter(t => !t.match(/\d{2} \w{3} \d{4}/)) // remove timestamp

    return cleaned
  }

  async getDashboardName() {
    const dashboardTitle = this.page.locator(this.dataVisualization.dashboardTitle)
    await dashboardTitle.waitFor({ state: "visible", timeout: 10000 })
    return await dashboardTitle.textContent()
  }



  async getHoverTextOnIcons(timeout = 5000) {
    const icons = this.page.locator(this.dataVisualization.breadcrumbIcons)
    const tooltipMap = {}

    const count = await icons.count()
    if (count === 0) return tooltipMap

    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i)

      const rawTooltip =
        (await icon.getAttribute("uib-tooltip")) ||
        (await icon.getAttribute("data-original-title"))

      if (!rawTooltip) continue

      const normalizedTooltip = rawTooltip.replace(/\s+/g, " ").trim()

      await icon.hover()

      const tooltip = this.page.locator(".tooltip-inner")
      await tooltip.waitFor({ state: "visible", timeout })

      const visibleText =
        (await tooltip.innerText()).replace(/\s+/g, " ").trim()

      tooltipMap[normalizedTooltip] = visibleText

      await this.page.mouse.move(0, 0)
      await tooltip.waitFor({ state: "hidden", timeout }).catch(() => { })
    }

    return tooltipMap
  }



  async getDashboardCardTitles(timeout = 15000) {
    //  Wait for JS loader (generic)
    await this.waitForJSLoaderToDisappear()

    const titleLocator = this.page.locator(
      this.dataVisualization.dashboardCardTitles
    )

    //  Wait until at least one title exists in DOM
    await titleLocator.first().waitFor({
      state: "attached",
      timeout,
    })

    // Ensure it is actually visible (Angular render complete)
    await titleLocator.first().waitFor({
      state: "visible",
      timeout,
    })

    // Read titles
    const rawTitles = await titleLocator.allTextContents()

    return rawTitles
      .map(t => t.replace(/\s+/g, " ").trim())
      .filter(Boolean)
  }




  async getDashboardCardRenderStatus() {
    const cards = this.page.locator("//div[@class='tab-pane ng-scope active']//div[contains(@class,'card light')]")
    const count = await cards.count()
    const results = []

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)

      const titleLocator = card.locator(".card-header .caption-subject")

      // 🔥 FILTER: ignore cards without visible title
      if (!(await titleLocator.count())) {
        continue
      }

      const title = (await titleLocator.first().innerText())
        .replace(/\s+/g, " ")
        .trim()

      // 🔥 FILTER: ignore empty titles
      if (!title) {
        continue
      }

      // wait for loader inside card
      await card.locator(".spinner").waitFor({
        state: "hidden",
        timeout: 15000,
      }).catch(() => { })

      const types = []

      if (await card.locator("svg, canvas").count()) types.push("chart")
      if (await card.locator(".score-card, .form-card").count()) types.push("score-card")
      if (await card.locator("img").count()) types.push("image")

      const gridRows = await card.locator(
        ".ui-grid-row:not(.ui-grid-header-row)"
      ).count()
      if (gridRows > 0) types.push("grid")

      results.push({
        index: results.length, // 🔥 logical index, not DOM index
        title,
        hasData: types.length > 0,
        types,
        gridRows,
      })
    }

    return results
  }



  //==========================
  // DATA Quality
  //==========================


  async navigateToDataQuality() {
    const dataQualityLink = this.page.locator(this.dataQuality.dataQualityLink).first()
    if (await dataQualityLink.count()) {
      await dataQualityLink.click()
    }
  }

  async navigateToDataQualityRules() {
    await this.navigateToDataQuality()
    const ruleLink = this.page.locator(this.dataQuality.rule)
    await ruleLink.waitFor({ state: "visible", timeout: 10000 })
    await ruleLink.click()
  }


  async navigateToDataQualityRulesResult() {
    // await this.navigateToDataQuality()
    const ruleLink = this.page.locator(this.dataQuality.ruleResult)
    await ruleLink.waitFor({ state: "visible", timeout: 10000 })
    await ruleLink.click()
    await this.waitForJSLoaderToDisappear()
  }

  async validateDQResult(node) {
    console.log("======== Node ===============")
    console.log(node)
  }

  /* =====================================================
   * Select Rule / Rule Group based on operatorType
   * Returns: 'rule' | 'group'
   * ===================================================== */
  async selectRuleTypeByOperator(operatorType) {
    if (!operatorType) {
      throw new Error("operatorType is required");
    }

    const isGroup = operatorType.toLowerCase().includes("group");

    const ruleRadio = this.page.locator("input.radio-rule[value='dq']");
    const ruleGroupRadio = this.page.locator("input.radio-rule-group[value='dqgroup']");

    let selectedType;

    if (isGroup) {
      await ruleGroupRadio.check();
      selectedType = "group";
    } else {
      await ruleRadio.check();
      selectedType = "rule";
    }

    await this.waitForJSLoaderToDisappear();

    return selectedType;
  }


  async performShowDetailsForEachAction() {
    const showDetailButtons = this.page.locator("a:has-text('Show Detail'):visible");

    const count = await showDetailButtons.count();

    for (let i = 0; i < count; i++) {
      await showDetailButtons.nth(i).click();
      await this.waitForJSLoaderToDisappear();
    }
  }


  async navigateToRule() {
  await this.page.getByRole('link', { name: /Data Ingestion/i }).click();
  await this.page.getByRole('link', { name: /^Rule$/ }).click();
}
  
  async navigateToRule() {
  await this.page.getByRole('link', { name: /Data Ingestion/i }).click();
  await this.page.getByRole('link', { name: /^Rule$/ }).click();
}

async fillRuleCreateForm({
  name,
  sourceType,
  sourceName,
  format,
  target,
  connection,
  loadType,
  targetTable
}) {

  // Name
  await this.page.locator('input[name="ingestData.name"]').fill(name);

  // Source Type
  await this.selectSourceType(sourceType);

  // Source Selection
  await this.selectTreeItem(sourceName);

  // Continue
  await this.clickContinue();

  // Format
  await this.page.getByRole('combobox').nth(1)
    .selectOption(`string:${format}`);

  // Alias / Desc
  await this.page.getByRole('textbox').nth(5).fill("Tester");

  await this.clickContinue();

  // Target
  await this.selectTreeItem(target);

  // Connection
  await this.searchAndSelect(connection);

  // Load Type
  await this.page.locator('select').first()
    .selectOption(`string:${loadType}`);

  await this.clickContinue();

  // Target Table
  await this.selectTreeItem(targetTable);

  await this.clickContinue();
  await this.clickContinue();

  // Mapping
  await this.handleMapping();
}

async fillRuleCreateForm({
  name,
  sourceType,
  sourceName,
  format,
  target,
  connection,
  loadType,
  targetTable
}) {

  // Name
  await this.page.locator('input[name="ingestData.name"]').fill(name);

  // Source Type
  await this.selectSourceType(sourceType);

  // Source Selection
  await this.selectTreeItem(sourceName);

  // Continue
  await this.clickContinue();

  // Format
  await this.page.getByRole('combobox').nth(1)
    .selectOption(`string:${format}`);

  // Alias / Desc
  await this.page.getByRole('textbox').nth(5).fill("Tester");

  await this.clickContinue();

  // Target
  await this.selectTreeItem(target);

  // Connection
  await this.searchAndSelect(connection);

  // Load Type
  await this.page.locator('select').first()
    .selectOption(`string:${loadType}`);

  await this.clickContinue();

  // Target Table
  await this.selectTreeItem(targetTable);

  await this.clickContinue();
  await this.clickContinue();

  // Mapping
  await this.handleMapping();
}

  async selectSourceType(type) {
  await this.page.getByRole('combobox').first().click();
  await this.page.getByRole('treeitem', { name: type }).click();
}
  async selectTreeItem(name) {
  await this.page.getByRole('treeitem', { name, exact: true }).click();
}
  async searchAndSelect(value) {
  await this.page.locator('input[type="search"]').fill(value);
  await this.selectTreeItem(value);
}
  async clickContinue() {
  await this.page.getByRole('button', { name: /Continue/i }).click();
}
async handleMapping() {

  await this.page.getByRole('textbox').nth(4).click();

  await this.page.getByRole('combobox').first()
    .selectOption('string:From File');

  await this.page.locator('.btn-close').click();

  const cell = this.page.getByRole('cell').first().getByRole('textbox');

  await cell.fill("Tester");
  await cell.press('Tab');

  await this.page.getByRole('combobox').first()
    .selectOption('string:From Target');

  await this.page.locator('select').last()
    .selectOption('string:EXPLODE');
}
async handleMapping() {

  await this.page.getByRole('textbox').nth(4).click();

  await this.page.getByRole('combobox').first()
    .selectOption('string:From File');

  await this.page.locator('.btn-close').click();

  const cell = this.page.getByRole('cell').first().getByRole('textbox');

  await cell.fill("Tester");
  await cell.press('Tab');

  await this.page.getByRole('combobox').first()
    .selectOption('string:From Target');

  await this.page.locator('select').last()
    .selectOption('string:EXPLODE');
}

}

export { JSOldPlatform }