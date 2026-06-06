export class Comman {
  constructor(page) {
    this.page = page;

    //login page

    this.usernameInput = this.page.getByRole("textbox", { name: "User Name" });
    this.passwordInput = this.page.getByRole("textbox", { name: "Password" });
    this.loginButton = this.page.locator("(//span[contains(text(),'Login')])[1]");
    this.profileMenu = this.page.locator("app-topbar i:nth-child(4)");
    this.logoutButton = this.page.getByRole("cell", { name: "Logout" });
    this.platformTitle = this.page.getByText("Inferyx System Admin Platform");
    this.errorMessage = this.page.locator(".error-message, .alert-danger");

    // icon menu sidebar
    this.homeIcon = this.page.locator('(//ul[@class="layout-menu"]//li[1])[1]//li[1]');
    this.productIcon = this.page.locator('(//ul[@class="layout-menu"]//li[1])[1]//li[2]');
    this.orgIcon = this.page.locator('(//ul[@class="layout-menu"]//li[1])[1]//li[3]');


    //data-engineering side bar
    this.dataPrepIcon = this.page.locator('(//ul[@class="layout-menu"]//li[1])[1]//li[5]');
    this.dataIngestionIcon = this.page.locator("(//ul[@class='layout-menu']//li[1])[1]//span[contains(text(),'Data Ingestion')]");

    //list page sidebar 
    this.ruleResultList = this.page.locator("//span[contains(text(),'Rule Results')]");
    this.parameterList = this.page.locator("(//span[contains(text(),'Parameter List')])[1]");
    this.ruleGroupList = this.page.locator("(//span[contains(text(),'Rule Group')])[1]");
    this.rule = this.page.locator("(//span[contains(text(),'Rule')])[1]");
    this.bulkAction = this.page.locator("//span[contains(text(),'Bulk Action')]");
    //data-prepration
    this.datapod = this.page.locator("(//span[contains(text(),'Datapod')])[1]");
    this.datapodList = this.page.locator("(//span[contains(text(),'List')])[1]");
    this.datapodBulkAction = this.page.locator("(//span[contains(text(),'Bulk Action')])[1]");
    this.dataset = this.page.locator("(//span[contains(text(),'Dataset')])[1]");
    this.datasetList = this.page.locator("(//span[contains(text(),'List')])[1]");
    this.expression = this.page.locator("(//span[contains(text(),'Expression')])[1]");

    //landing page
    this.continue    = this.page.locator("//span[normalize-space()='Continue']");
    this.actionButton = this.page.locator('(//button[@label="Action"][1])[1]');
    this.addButton = this.page.locator("//button[@icon='pi pi-plus']");
    this.viewDropdownMenu = this.page.locator('//span[contains(text(),"View")]');
    this.editDropdownMenu = this.page.locator('//span[contains(text(),"Edit")]');
    this.deleteDropdownMenu = this.page.locator('//span[contains(text(),"Delete")]');
    this.lockDropdownMenu = this.page.locator('//span[contains(text(),"Lock")]');
    this.publishDropdownMenu = this.page.locator('//span[contains(text(),"Publish")]');
    this.executeDropdownMenu = this.page.locator('//span[contains(text(),"Execute")]');
    this.cloneDropdownMenu = this.page.locator('//span[contains(text(),"Clone")]');
    this.exportDropdownMenu = this.page.locator('//span[contains(text(),"Export")]');
    this.searchBox = this.page.locator("//input[@placeholder='Search Keyword']")
    this.logDropdownMenu = this.page.locator('//span[contains(text(),"Log")]');
    this.filterButton = this.page.locator("//span[@class='p-button-icon pi pi-filter']");
    this.filterSearchButton = this.page.locator("//span[contains(text(),'Search')]");
    this.unlockDropdownMenu = this.page.locator('//span[contains(text(),"Unlock")]');


    //view page
    this.uuid = this.page.locator("//label[normalize-space()='UUID']")

    //create page
    this.searchBoxDropdown = this.page.locator("//input[@role='searchbox']");
    this.nameInputBox = this.page.locator("//input[@formcontrolname='name']")


    //screenshot
    this.screenshotButton = this.page.locator(".p-element[data-test-id='screenshot']")
        // this.screenshotButton = this.page.locator("(//button[.//span[text()='Submit']])[2]")

    this.screenshotNameInput = this.page.locator('[data-test-id="screenshot-name"]')
    this.captureScreenshotButton = this.page.locator('[data-test-id="capture-screenshot"]')

    this.submitButton = this.page.locator("(//span[normalize-space()='Submit'])[2]");
    this.cancelButton = this.page.locator("(//span[normalize-space()='Cancel'])[2]");

    //adminstartion
    this.submitButtonOrganisation = this.page.locator("(//span[normalize-space()='Submit'])[1]");

  }}