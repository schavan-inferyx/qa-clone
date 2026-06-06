import { BasePage } from "@base/base-page.js";
import { selectDropdown } from "@utils/dropdownHelper.js";
import dataCatalog from "@locators/data-catalog.js";
import commonLayout from "@locators/common-layout.js";

export class DataCatalog extends BasePage {

    constructor(page) {
        super(page);
        this.common = commonLayout.common;
        this.listtable = commonLayout.listTable;
        this.dataCatalog = dataCatalog;
        this.crudPage = commonLayout.crudPage;
        this.breadcrumb = dataCatalog.breadcrumb;
        this.dataGlossary = dataCatalog.dataGlossary;
        this.tabs = dataCatalog.tabs;
        this.actionButton = dataCatalog.actions;
        this.ok = dataCatalog.actions.ok;
        this.readonly = dataCatalog.readonly;
        this.dataDomain = dataCatalog.dataDomain;
        this.dataAsset = dataCatalog.dataAsset;
        this.form = dataCatalog.forms;
    }

    async setupDataCatalogApp(common, role, appUnderTest) {
        await super.selectAppAndRole(common, appUnderTest, role);
    }

    async switchToList() {
        const listTab = this.page.locator(this.actionButton.switchToList);
        await listTab.waitFor({ state: "visible", timeout: 10000 });
        await listTab.click();
    }

    async getToastMessage() {
        const toast = this.page.locator(".p-toast-message");
        await toast.waitFor({ timeout: 10000 });
        return await toast.innerText();
    }

    // async getUUIDFromView() {
    //     const uuidInput = this.page.locator(this.common.viewPage.uuid);
    //     const value = await uuidInput.inputValue();
    //     if (!value) {
    //         throw new Error("UUID is empty");
    //     }
    //     return value;
    // }

    async getUUIDFromView({ timeout = 5000 } = {}) {
        await this.waitForPlusLoaderToDisappear();
        const uuidInput = this.page.locator(this.readonly.uuid).first();

        const start = Date.now();
        while (Date.now() - start < timeout) {
            const value = await uuidInput.inputValue().catch(() => "");
            if (value?.trim()) return value.trim();
            await this.page.waitForTimeout(200);
        }

        throw new Error("UUID did not appear in view within timeout");
    }

    async searchByUUID(uuid) {
        await this.page.locator(this.listtable.searchInput).fill(uuid);
        await this.page.keyboard.press("Enter");
    }

    async openActionMenu() {
        await this.page.locator(this.common.actionButton).click();
    }

    async clickViewAction() {
        await this.page.locator(this.common.viewAction).click();
    }

    async clickEditAction() {
        await this.page.locator(this.common.editAction).click();
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

    async clickPublishAction() {
        await this.page.locator(this.common.publishAction).click();
    }

    async clickUnpublishAction() {
        await this.page.locator(this.dataCatalog.unpublishAction).click();
    }

    async clickDeleteAction() {
        await this.page.locator(this.dataCatalog.deleteAction).click();
    }

    async confirmExecution() {
        await this.page.locator('button:has-text("Confirm")').click();
    }

    async openAddForm() {
        await this.page.locator(this.crudPage.addIcon).click();
    }

    async updateDescription(desc) {
        const descField = this.page.locator(this.form.description);
        await this.manualTyping(descField, desc);
    }



   async checkBreadcrumbContainsAdd() {
        const breadcrumb =
            this.page.locator(this.breadcrumb.add);

        await breadcrumb.waitFor({ state: "visible", timeout: 10000 });

        const breadcrumbText = await breadcrumb.innerText();
        return breadcrumbText === "Add";
    }

    async checkBreadcrumbContainsView() {
        const breadcrumb =
            this.page.locator(this.breadcrumb.view);

        await breadcrumb.waitFor({ state: "visible", timeout: 10000 });

        const breadcrumbText = await breadcrumb.innerText();
        return breadcrumbText === "View";
    }

    /* ================= DATA DOMAIN ================= */

    async openDataDomainNavigation() {
        await this.page.waitForLoadState("networkidle");
        await this.waitForPlusLoaderToDisappear();

        const domainMenu = this.page.getByText("Data Domain", { exact: true });
        await domainMenu.waitFor({ state: "visible", timeout: 30000 });
        await domainMenu.click();

        await this.page.waitForURL("**/datadomain/list", { timeout: 30000 });
    }

    async fillDataDomainCreateForm({ name, parentglossary }) {
        await this.page.locator(this.dataDomain.form.name).fill(name);
        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {
            locator: this.dataDomain.form.parent,
            valueToSelect: parentglossary,
            useSearch: true
        });
    }



    async openDataGlossaryNavigation() {
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
    await this.waitForPlusLoaderToDisappear();

    const glossaryMenu = this.page.getByText("Data Glossary", { exact: true });

    await glossaryMenu.waitFor({ state: "visible", timeout: 30000 });

    await glossaryMenu.click();

    await this.page.waitForURL("**/dataglossary/list", { timeout: 30000 });

}
     
    async addGlossaryForDomain() {
        await this.switchApplicationTab("glossary");

        await this.page.locator("//span[contains(@class,'pi-plus')]").click();

        const dialog = this.page.locator("div[role='dialog']");
        await dialog.waitFor({ state: "visible" });

        await dialog.locator("tbody tr").first().waitFor({
            state: "visible",
            timeout: 30000
        });

        const firstCheckbox = dialog.locator("tbody .p-checkbox-box").first();
        await firstCheckbox.click();

        await dialog.getByRole("button", { name: "Add Selected" }).click();
    }

    async submitDataDomainForm() {
        await this.page.locator(this.actionButton.submit).click();

        await Promise.all([
            this.page.waitForURL("**/datadomain-detail**", { timeout: 30000 }),
            this.page.locator(this.ok).click()
        ]);

        await this.waitForPlusLoaderToDisappear();
    }

    /* ================= DATA ASSET ================= */

    async openDataAssetNavigation() {
        await this.page.waitForTimeout(2000);

        await this.page.waitForLoadState("networkidle");
        await this.waitForPlusLoaderToDisappear();

        const assetMenu = this.page.getByText("Data Asset", { exact: true });
        await assetMenu.waitFor({ state: "visible", timeout: 30000 });
        await assetMenu.click();

        await this.page.waitForURL("**/dataasset/list", { timeout: 30000 });
    }

async fillDataAssetCreateForm({
    name,
    parent,
    dataDomain,
    assetType,
    entityName,
    visibility
}) {
    // Fill Name
    await this.page.locator(this.dataAsset.form.name).fill(name);

    // Switch to General Tab
    await this.switchApplicationTab("general");

    // Parent Asset
    //await selectDropdown(this.page, {
        //locator: this.dataAsset.form.parent,
        //valueToSelect: parent,
        //useSearch: true
    //});

    // Data Domain
    await selectDropdown(this.page, {
        locator: this.dataAsset.form.dataDomain,
        valueToSelect: dataDomain,
        useSearch: true
    });

    // Asset Type
    await selectDropdown(this.page, {
        locator: this.dataAsset.form.assetType,
        valueToSelect: assetType,
        useSearch: true
    });

    // Entity Name
    await selectDropdown(this.page, {
        locator: this.dataAsset.form.entity,
        valueToSelect: entity,
        useSearch: true
    });

    // Visibility
    await selectDropdown(this.page, {
        locator: this.dataAsset.form.visibility,
        valueToSelect: visibility,
        useSearch: true
    });
}


    
   async addGlossaryForToAsset() {
    await this.switchApplicationTab("glossary");

    await this.page.locator("//span[contains(@class,'pi-plus')]").click();

    const dialog = this.page.locator("div[role='dialog']");
    await dialog.waitFor({ state: "visible" });

    await dialog.locator("tbody tr").first().waitFor({
        state: "visible",
        timeout: 30000
    });

    const firstCheckbox = dialog.locator("tbody .p-checkbox-box").first();
    await firstCheckbox.click();

    await dialog.getByRole("button", { name: "Add Selected" }).click();

    await dialog.waitFor({ state: "hidden" });

    // 🔽 --------- NEW STEPS ADDED BELOW ---------

    // Select Account Type
    await this.page.locator('#pn_id_143')
        .getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: 'DATAPOD' }).click();

    // Select Status Type
    await this.page.locator('#pn_id_145')
        .getByRole('button', { name: 'dropdown trigger' }).click();

    await this.page.getByRole('searchbox').fill('account_status_type');

    await this.page.getByRole('option', { name: 'account_status_type' }).click();

    // 🔽 Owner tab click
    await this.switchApplicationTab("owner");
}

async addOwnerForAsset() {

    // Click Owner Add button (nth(4) जसे तू दिलेस)
    await this.page.getByRole('button').nth(4).click();

    // ✅ Wait for dialog to appear
    const dialog = this.page.locator("div[role='dialog']");
    await dialog.waitFor({ state: "visible", timeout: 30000 });

    // Search user
    await dialog.getByRole('textbox', { name: 'Search users...' }).fill('user_date');

    // Select first checkbox
    await dialog.locator('.p-checkbox-box').first().click();

    // Click Add Selected
    await dialog.getByRole('button', { name: 'Add Selected' }).click();

    // ✅ Wait for dialog to close
    await dialog.waitFor({ state: "hidden", timeout: 30000 });
}


async addAccessForAsset() {

    // Switch to Access tab
    await this.page.getByRole('tab', { name: ' Access' }).click();

    // Click Add button
    await this.page.getByRole('button').nth(4).click();

    // ✅ Wait for dialog to appear (flaky test prevention)
    const dialog = this.page.locator("div[role='dialog']");
    await dialog.waitFor({ state: "visible", timeout: 30000 });

    // Search user
    await dialog.getByRole('textbox', { name: 'Search users...' }).fill('user_date');

    // Select first checkbox
    await dialog.locator('#pn_id_130-table > .p-element.p-datatable-tbody > tr > td > .p-element > .p-checkbox > .p-checkbox-box')
        .first()
        .click();

    // Click Add Selected
    await dialog.getByRole('button', { name: 'Add Selected' }).click();

    // ✅ Wait for dialog to close
    await dialog.waitFor({ state: "hidden", timeout: 30000 });
}


    async submitDataAssetForm() {
        await this.page.locator(this.actionButton.submit).click();

        await Promise.all([
            this.page.waitForURL("**/dataasset-detail**", { timeout: 30000 }),
            this.page.locator(this.ok).click()
        ]);

        await this.waitForPlusLoaderToDisappear();
    }

    async switchApplicationTab(tabKey) {
        const locator = this.tabs[tabKey];
        const tab = this.page.locator(locator);

        await tab.waitFor({ state: "visible", timeout: 10000 });
        await tab.click();
        await this.page.waitForTimeout(200);
    }

    async captureClonedEntity({ sourceUuid, action = "clone", entityType, timeout = 10000 }) {

        if (!sourceUuid) throw new Error("sourceUuid is required");
        if (!entityType) throw new Error("entityType is required");

        let clonedId = null;
        let clonedUuid = null;

        const handler = async (response) => {
            const url = response.url();
            if (
                url.includes("saveAs") &&
                url.includes(`action=${action}`) &&
                url.includes(`uuid=${sourceUuid}`) &&
                url.includes(`type=${entityType}`)
            ) {
                const json = await response.json();
                if (json?.id) clonedId = json.id;
                if (json?.uuid) clonedUuid = json.uuid;
            }
        };

        this.page.on("response", handler);

        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (clonedId && clonedUuid) {
                this.page.off("response", handler);
                return { id: clonedId, uuid: clonedUuid };
            }
            await this.page.waitForTimeout(200);
        }

        this.page.off("response", handler);
        throw new Error(`Failed to capture cloned ${entityType} UUID`);
    }
}
