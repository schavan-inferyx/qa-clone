import { expect } from "@playwright/test";
import { BasePage } from "@base/base-page.js";
import appConfig from "@config/app-config.js";
import { setDateCalendarNew, setExpiryDate, setExpiryDateNewUI } from "@utils/actions";
import {
    selectDropdown,
    selectDropdownMultiselectMultiple,
    selectDropdownWithFromControl
} from "@utils/dropdownHelper.js";
import admin from "@locators/admin.js";
import commonLayout from "@locators/common-layout.js";

class Admin extends BasePage {

    /* ---------------------------------------------------------------------
     * Constructor & Locators
     * ------------------------------------------------------------------- */
    constructor(page) {
        super(page);

        // Common / Shared
        this.common = commonLayout.common;

        // Menu navigation
        this.menu = admin.menus;

        // Feature-specific locators
        this.organization = admin.organization;
        this.account = admin.account;
        this.application = admin.application;
        this.security = admin.security;
        this.monitoring = admin.monitoring;
        this.general = admin.general;
        this.crudPage = commonLayout.crudPage
        this.tabs = admin.tabs;
        this.breadcrumb = admin.breadcrumb;
        this.readonly = admin.readonly;
        this.user = admin.user;
        this.sysParam = admin.sysParam;
        this.tag = admin.tag;
        this.apiClient = admin.apiClient;
        this.server = admin.server;
        this.product = admin.product;
        this.group = admin.group;
        this.form = admin.forms;
        this.role = admin.role;
        this.privilege = admin.privilege;
        this.userGroup = admin.userGroup;
        this.calendar = admin.calendar;
        this.category = admin.category;
        this.datasource = admin.datasource;
        this.metadata = admin.metadata;
        this.quickLink = admin.quickLink;
        this.webService = admin.webService;
        this.migrationAssist = admin.migrationAssist;
    }

    /* ---------------------------------------------------------------------
     * App & Role Setup
     * ------------------------------------------------------------------- */
    async setupAdminApp(common, role, appUnderTest) {

        // NOTE:
        // Login intentionally skipped here.
        // Authentication is assumed to be handled at test/base level.
        await super.selectAppAndRole(
            common,
            appUnderTest,
            role
        );
    }

    /* =====================================================================
     * Organisation Module
     * =================================================================== */

    /* ---------------------------------------------------------------------
     * Navigation
     * ------------------------------------------------------------------- */
    async navigateToOrganisation() {
        await this.page.locator(this.menu.organization).click();
    }

    async navigateToAccount() {
        await this.page.locator(this.menu.account).click();
    }

    async navigateToProduct() {
        await this.page.locator(this.menu.product).click();
    }

    async navigateToSecurity() {
        await this.page.locator(this.menu.security).click();
    }

    async navigateToUser() {
        await this.page.locator(this.security.user).click();

    }

    async navigateToGroup() {
        await this.page.locator(this.security.group).click();

    }

    async navigateToRole() {
        await this.page.locator(this.security.role).click();
    }

    async navigateToPrivilege() {
        await this.page.locator(this.security.privilege).click();
    }

    async navigateToUserGroup() {
        await this.page.locator(this.security.userGroup).click();
    }

    async openGeneralMenu() {
        await this.page.locator(this.menu.general).click();
    }

    async navigateToServer() {
        await this.page.locator(this.general.server).click();
    }

    async navigateToGeneral() {
        await this.page.locator(this.menu.general).click();
    }

    async navigateToWebhook() {
        await this.page.locator(this.general.webhook).click();
    }

    async navigateToMigrationAssist() {
        await this.page.locator(this.general.migrationAssist).click();
    }

    async navigateToMigrationImport() {
        await this.page.locator(this.migrationAssist.import.menu).click();
    }

    async navigateToMigrationExport() {
        await this.page.locator(this.migrationAssist.export.menu).click();
    }

    async navigateToDomain() {
        await this.page.locator(this.general.domain).click();
    }

    async navigateToResource() {
        await this.page.locator(this.general.resource).click();
    }

    async navigateToWebService() {
        // await this.page.locator(this.menu.hamburger).click();
        await this.page.locator(this.general.webService.menu).click();
    }

    async navigateToWebServiceList() {
        // await this.page.locator(this.menu.hamburger).click();
        await this.page.locator(this.general.webService.list).click();
    }

    async navigateToQuickLink() {
        await this.page.locator(this.general.quickLink).click();
    }

    async navigateToRepository() {
        await this.page.locator(this.general.repository).click();
    }

    async navigateToLOV() {
        await this.page.locator(this.general.lov).click();
    }

    async navigateToNotificationTemplate() {
        await this.page.locator(this.general.notificationTemplate).click();
    }

    async navigateToPage() {
        await this.page.locator(this.general.page.menu).click();
    }

    async navigateToPageList() {
        await this.page.locator(this.general.page.list).click();
    }



    async navigateToCalendar() {
        await this.page.locator(this.general.calendar).click();
    }

    async navigateToCategory() {
        await this.page.locator(this.general.category).click();
    }

    async navigateToDataSource() {
        await this.page.locator(this.general.dataSource.menu).click();
    }



    async navigateToSysParam() {
        // await this.page.locator(this.menu.hamburger).click();
        await this.page.locator(this.general.sysParam).click();
    }

    async navigateToTag() {
        // await this.page.locator(this.menu.hamburger).click();
        await this.page.locator(this.general.tag).click();
    }

    async navigateToApiClient() {
        await this.page.locator(this.menu.hamburger).click();
        await this.page.locator(this.general.webService.menu).click();
        await this.page.locator(this.general.webService.client).click();
    }


    async navigateToMetaData() {
        await this.page.locator(this.menu.metadata).click();
    }

    async navigateToRegister() {
        await this.page.locator(this.metadata.register.menu).click();
    }



    async navigateToCrawler() {
        await this.page.locator(this.metadata.crawler.menu).click();
    }



    /* ---------------------------------------------------------------------
     * Breadcrumb Validation
     * Ensures user is on "Add Organisation" page
     * ------------------------------------------------------------------- */
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
        return breadcrumbText === "Add";
    }

    /* ---------------------------------------------------------------------
     * Organisation Creation Form
     * Handles inline validation and conditional product assignment
     * ------------------------------------------------------------------- */
    async fillOrganisationCreateForm_Old(org) {

        const {
            organisationName,
            domain,
            authorizedProducts = [],
            description = null,
        } = org;

        const { add } = this.organization.form;

        /* --- Organisation Name --- */
        const nameInput = this.page.locator(add.name);

        await this.manualTyping(nameInput, organisationName, {
            delay: 60,
            clear: true,
        });

        // Trigger inline validation
        await this.page.locator(add.description).click();

        const nameError = this.page.locator(add.nameAlreadyExistsError);

        try {
            await nameError.waitFor({ state: "visible", timeout: 2000 });

            const errorText = (await nameError.textContent())?.trim();

            if (errorText) {
                // ⛔ Stop immediately if backend validation fails
                return {
                    hasError: true,
                    field: "organisationName",
                    message: errorText,
                };
            }
        } catch {
            // No validation error → continue
        }

        /* --- Optional Fields --- */
        if (description) {
            await this.page.locator(add.description).fill(description);
        }

        await this.page.locator(add.domain).fill(domain);

        /* --- Product Authorization (Optional) --- */
        if (!authorizedProducts.length) {
            return { hasError: false };
        }

        await this.page.locator(add.tabs.product).click();

        for (const product of authorizedProducts) {
            await this.page.locator(add.tabActions.productAdd).click();

            await this.selectDropdown(this.page, {
                formControlName: "productType",
                valueToSelect: product,
                useSearch: true,
            });
        }

        return { hasError: false };
    }

    async fillOrganisationCreateForm(
        orgName,
        domain = "",
        authorizedProducts = []
    ) {

        /* ================= Overview TAB ================= */

        await this.switchApplicationTab("overview");

        await this.page.fill(
            this.organization.form.add.name,
            orgName
        );

        /* description optional */
        await this.page.fill(
            this.organization.form.add.description,
            "created via automation"
        );

        /* ================= General TAB ================= */

        await this.switchApplicationTab("general");

        if (domain) {
            await this.page.fill(
                this.organization.form.add.domain,
                domain
            );
        }

        /* ================= Product TAB ================= */

        if (!authorizedProducts.length) {
            return { hasError: false };
        }

        await this.switchApplicationTab("product");

        for (const product of authorizedProducts) {

            await this.page.locator(
                this.organization.form.add.tabActions.productAdd
            ).click();

            await this.selectDropdown(this.page, {
                formControlName: "productType",
                valueToSelect: product,
                useSearch: true,
            });

        }

        return { hasError: false };
    }

    /* ---------------------------------------------------------------------
     * Form Submission
     * ------------------------------------------------------------------- */
    async submitOrganisationForm() {
        await this.page
            .locator(this.organization.form.add.actions.submit)
            .click();

        await this.waitForPlusLoaderToDisappear();
    }

    /* ---------------------------------------------------------------------
     * Inline Validation Assertion (Negative Scenarios)
     * ------------------------------------------------------------------- */
    async verifyOrganisationNameInlineValidation(
        organisationName,
        expectedMessage
    ) {
        if (!expectedMessage) {
            throw new Error("expectedMessage is required");
        }

        const { add } = this.organization.form;

        const nameInput = this.page.locator(add.name);

        await this.manualTyping(nameInput, organisationName, {
            delay: 60,
            clear: true,
        });

        // Trigger validation
        await this.page.locator(add.description).click();

        const errorLocator =
            this.page.locator(add.nameAlreadyExistsError);

        await errorLocator.waitFor({ state: "visible", timeout: 5000 });

        const actualText = (await errorLocator.textContent())?.trim();

        if (!actualText) {
            throw new Error("Organisation name validation message is empty");
        }

        if (actualText !== expectedMessage) {
            throw new Error(
                `Validation mismatch. Expected "${expectedMessage}", got "${actualText}"`
            );
        }

        return actualText;
    }

    /* ---------------------------------------------------------------------
     * Toast Message Utility
     * ------------------------------------------------------------------- */


    async getToastMessage({ timeout = 5000 } = {}) {
        // await this.waitForInbuiltButtonLoaderToDisapper();
        // await this.waitForLoader();

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

    /* ---------------------------------------------------------------------
     * API Capture
     * Captures organisation ID + UUID from backend responses
     * ------------------------------------------------------------------- */
    async apiCaptureOrganisation() {

        let orgId = null;
        let orgUuid = null;

        await this.waitForPlusLoaderToDisappear();

        const responseHandler = async (response) => {
            const url = response.url();

            if (url.includes("submit") && url.includes("type=organization")) {
                const text = (await response.text())?.trim();
                if (text && !orgId) orgId = text;
            }

            if (url.includes("getOneById") && url.includes("type=organization")) {
                const json = await response.json();
                if (json?.uuid && !orgUuid) orgUuid = json.uuid;
            }
        };

        this.page.on("response", responseHandler);

        const start = Date.now();
        while (Date.now() - start < 10000) {
            if (orgId && orgUuid) {
                this.page.off("response", responseHandler);
                return { id: orgId, uuid: orgUuid };
            }
            await this.page.waitForTimeout(200);
        }

        this.page.off("response", responseHandler);
        throw new Error("Failed to capture organisation identifiers");
    }


    /* ---------------------------------------------------------------------
 * Captures cloned organisation identifiers from clone API
 * ------------------------------------------------------------------- */
    async apiCaptureClonedOrganisation(originalUuid) {
        if (!originalUuid) {
            throw new Error("originalUuid is required for clone capture");
        }

        let clonedData = null;

        const responseHandler = async (response) => {
            const url = response.url();

            if (
                url.includes("saveAs") &&
                url.includes("action=clone") &&
                url.includes(`uuid=${originalUuid}`) &&
                url.includes("type=organization")
            ) {
                const json = await response.json();
                if (json?.uuid && !clonedData) {
                    clonedData = json;
                }
            }
        };

        this.page.on("response", responseHandler);

        const start = Date.now();
        while (Date.now() - start < 10000) {
            if (clonedData) {
                this.page.off("response", responseHandler);
                return clonedData;
            }
            await this.page.waitForTimeout(200);
        }

        this.page.off("response", responseHandler);
        throw new Error("Failed to capture cloned organisation response");
    }


    /* ---------------------------------------------------------------------
   * Updates Organisation description field
   * ------------------------------------------------------------------- */
    async updateOrganisationDescription(description) {
        if (!description) {
            throw new Error("description is required");
        }

        await this.page.waitForTimeout(1000)

        await this.waitForPlusLoaderToDisappear()

        const descriptionField =
            this.page.locator(this.organization.form.add.description);

        await descriptionField.waitFor({ state: "visible", timeout: 5000 });
        await descriptionField.fill(description);
    }


    /* ---------------------------------------------------------------------
     * Navigation Back to List
     * ------------------------------------------------------------------- */
    async returnToListPage() {
        await this.page
            .locator(this.organization.form.add.icons.closeIcon)
            .click();

        await this.waitForPlusLoaderToDisappear();
    }

    /* =====================================================================
     * Shared Utilities
     * =================================================================== */

    /* ---------------------------------------------------------------------
     * Dropdown Selector (PrimeNG)
     * Handles dynamic overlays, search, and strict option resolution
     * ------------------------------------------------------------------- */
    async selectDropdown(
        page,
        {
            formControlName,
            valueToSelect,
            useSearch = false,
            placeholderText = "Select",
        }
    ) {
        if (!page) throw new Error("page is required");
        if (!formControlName) throw new Error("formControlName is required");
        if (!valueToSelect) throw new Error("valueToSelect is required");

        try {
            const allDropdowns = page.locator(
                `p-dropdown[formcontrolname="${formControlName}"]`
            );

            const count = await allDropdowns.count();
            if (count === 0) {
                throw new Error(
                    `No dropdown found for formcontrolname="${formControlName}"`
                );
            }

            /* --- Find first EMPTY dropdown --- */
            let dropdown = null;

            for (let i = 0; i < count; i++) {
                const candidate = allDropdowns.nth(i);
                if (!(await candidate.isVisible())) continue;

                const labelText = await candidate
                    .locator(".p-dropdown-label")
                    .textContent();

                if (labelText?.trim() === placeholderText) {
                    dropdown = candidate;
                    break;
                }
            }

            if (!dropdown) {
                throw new Error(
                    `No empty dropdown found (placeholder="${placeholderText}")`
                );
            }

            /* --- Open dropdown --- */
            const trigger = dropdown.getByRole("button", {
                name: "dropdown trigger",
            });

            await trigger.waitFor({ state: "visible", timeout: 5000 });
            await trigger.click();

            /* --- Resolve overlay panel --- */
            const panelId = await dropdown
                .locator(".p-dropdown-label")
                .getAttribute("aria-controls");

            if (!panelId) {
                throw new Error("Dropdown overlay panel ID not found");
            }

            const overlayPanel = page.locator(`#${panelId}`);
            await overlayPanel.waitFor({ state: "visible", timeout: 5000 });

            /* --- Optional search --- */
            if (useSearch) {
                const searchBox =
                    overlayPanel.locator("input.p-dropdown-filter");

                if (await searchBox.count()) {
                    await searchBox.fill(valueToSelect);
                    await page.waitForTimeout(300);
                }
            }

            /* --- Strict option resolution --- */
            const option = overlayPanel
                .locator(".p-dropdown-item")
                .filter({ hasText: new RegExp(`^${valueToSelect}$`) });

            const optionCount = await option.count();

            if (optionCount === 0) {
                throw new Error(`Option "${valueToSelect}" not found`);
            }

            if (optionCount > 1) {
                throw new Error(
                    `Multiple options (${optionCount}) found for "${valueToSelect}"`
                );
            }

            await option.first().click();

            /* --- Lightweight confirmation --- */
            await page.waitForTimeout(150);

            const selectedText = await dropdown
                .locator(".p-dropdown-label")
                .textContent();

            if (selectedText?.trim() !== valueToSelect) {
                throw new Error(
                    `Dropdown selection failed. Expected "${valueToSelect}", got "${selectedText?.trim()}"`
                );
            }

        } catch (error) {
            console.error("Dropdown selection failed", {
                formControlName,
                valueToSelect,
                error: error.message,
            });
            throw error;
        }
    }




    /* =========================
 * Account Navigation
 * ========================= */

    async navigateToAccount() {
        await this.page.locator(this.menu.account).click();
    }

    /* =========================
     * Account Form Actions
     * ========================= */

    async openAddAccountForm() {
        await this.page.locator(this.crudPage.addIcon).click();
    }

    async checkAccountAddBreadcrumb(expected) {
        const breadcrumb =
            this.page.locator(this.account.form.breadcrumb.add);

        const text = (await breadcrumb.textContent())?.trim();
        if (text !== expected) {
            throw new Error(
                `Breadcrumb mismatch. Expected "${expected}", got "${text}"`
            );
        }
    }

    async checkAccountViewBreadcrumb(expected) {
        const breadcrumb =
            this.page.locator(this.account.form.breadcrumb.view);

        const text = (await breadcrumb.textContent())?.trim();
        if (text !== expected) {
            throw new Error(
                `Breadcrumb mismatch. Expected "${expected}", got "${text}"`
            );
        }
    }

    async fillAccountCreateForm(accountName) {
        if (!accountName) {
            throw new Error("accountName is required");
        }

        await this.page
            .locator(this.account.form.fields.name)
            .fill(accountName);

        await this.page
            .locator(this.account.form.fields.displayName)
            .click()
    }

    async updateAccountDescription(description) {
        const desc = await this.page
            .locator(this.account.form.fields.description)
        // .fill(description);

        await this.manualTyping(desc, description)
    }

    async submitAccountForm() {
        await this.page
            .locator(this.account.form.actions.submit)
            .click();
        await this.waitForInbuiltButtonLoaderToDisapper();
        await this.waitForPlusLoaderToDisappear();
    }

    /* =========================
     * Account View Helpers
     * ========================= */

    async getAccountUUIDFromView() {
        const uuidInput =
            this.page.locator(this.account.form.readonly.uuid);

        const value = await uuidInput.inputValue();
        if (!value) {
            throw new Error("Account UUID is empty");
        }
        return value;
    }

    // async getUUIDFromView() {
    //     const uuidInput =
    //         this.page.locator(this.readonly.uuid);

    //     const value = await uuidInput.inputValue();
    //     if (!value) {
    //         throw new Error("UUID is empty");
    //     }
    //     return value;
    // }

    async getUUIDFromView({ timeout = 5000 } = {}) {

        const uuidInput = this.page.locator(this.readonly.uuid).first();

        const start = Date.now();

        while (Date.now() - start < timeout) {

            const value = await uuidInput.inputValue().catch(() => "");

            if (value?.trim()) {
                return value.trim();
            }

            await this.page.waitForTimeout(200);
        }

        throw new Error("UUID did not appear in view within timeout");
    }



    /* =========================
     * API Capture – Clone Account
     * ========================= */

    async apiCaptureClonedAccount(accountUuid) {
        if (!accountUuid) {
            throw new Error("accountUuid is required for clone capture");
        }

        let clonedId = null;
        let clonedUuid = null;

        const handler = async (response) => {
            const url = response.url();

            if (
                url.includes("saveAs") &&
                url.includes("action=clone") &&
                url.includes(`uuid=${accountUuid}`) &&
                url.includes("type=account")
            ) {
                const json = await response.json();
                if (json?.id) clonedId = json.id;
                if (json?.uuid) clonedUuid = json.uuid;
            }
        };

        this.page.on("response", handler);

        const start = Date.now();
        while (Date.now() - start < 10000) {
            if (clonedId && clonedUuid) {
                this.page.off("response", handler);
                return { id: clonedId, uuid: clonedUuid };
            }
            await this.page.waitForTimeout(200);
        }

        this.page.off("response", handler);
        throw new Error("Failed to capture cloned account UUID");
    }


    /* =====================================================
       * Application App
       * =================================================== */
    async navigateToApplication() {
        await this.page.click(this.menu.application);
    }



    async openAddApplicationForm() {
        await this.page.locator(this.crudPage.addIcon).click();
    }

    async openAddForm() {
        await this.page.locator(this.crudPage.addIcon).click();
    }

    /* =====================================================
     * Breadcrumb Validation
     * =================================================== */
    async checkApplicationAddBreadcrumb(expected) {
        const text = await this.page
            .locator(this.application.breadcrumb.add)
            .textContent();

        if (!text?.trim().includes(expected)) {
            throw new Error(
                `Expected breadcrumb '${expected}' but found '${text}'`
            );
        }
    }

    async checkApplicationViewBreadcrumb(expected) {
        const text = await this.page
            .locator(this.application.breadcrumb.view)
            .textContent();

        if (!text?.trim().includes(expected)) {
            throw new Error(
                `Expected breadcrumb '${expected}' but found '${text}'`
            );
        }
    }

    /* =====================================================
     * Create Application
     * =================================================== */
    // async fillApplicationCreateForm(app) {
    //     await this.page.fill(this.application.form.code, app.code);
    //     await this.page.fill(this.application.form.name, app.name);
    //     await this.page.fill(this.application.form.displayName, app.displayName);
    //     await this.page.fill(this.application.form.desc, app.desc);

    //     await this.selectDropdown(
    //         this.application.form.defaultEngine,
    //         app.defaultEngine
    //     );

    //     await this.selectDropdown(
    //         this.application.form.engineName,
    //         app.engineName
    //     );

    //     await this.selectDropdown(
    //         this.application.form.reportingEngine,
    //         app.reportingEngine
    //     );

    //     await this.selectDropdown(
    //         this.application.form.currency,
    //         app.currency
    //     );

    //     await this.selectDropdown(
    //         this.application.form.applicationCategory,
    //         app.applicationCategory
    //     );

    //     await this.page.fill(
    //         this.application.form.modelPort,
    //         app.modelPort
    //     );

    //     await this.selectDropdown(
    //         this.application.form.account,
    //         app.account
    //     );

    //     await this.selectMultiSelect(
    //         this.application.form.module,
    //         app.modules
    //     );
    // }

    async fillApplicationCreateForm_old_ui(app) {
        await this.page.fill(this.application.form.code, app.code);
        await this.page.fill(this.application.form.name, app.name);
        await this.page.fill(this.application.form.displayName, app.displayName);
        await this.page.fill(this.application.form.desc, app.desc);



        await selectDropdownWithFromControl(this.page, {
            formControlName: 'defaultEngine',
            valueToSelect: app.defaultEngine,
        });

        await selectDropdownWithFromControl(this.page, {
            formControlName: 'reportingEngine',
            valueToSelect: app.reportingEngine,
        });


        await selectDropdownWithFromControl(this.page, {
            formControlName: 'currency',
            valueToSelect: app.currency,
        });


        await selectDropdownWithFromControl(this.page, {
            formControlName: 'applicationCategory',
            valueToSelect: app.applicationCategory,
        });



        await this.page.fill(
            this.application.form.modelPort,
            app.modelPort
        );

        await selectDropdownWithFromControl(this.page, {
            formControlName: 'account',
            valueToSelect: app.account,
            useSearch: true,

        });


        await selectDropdownMultiselectMultiple(this.page, { label: "Module", valuesToSelect: ["ALERT_GENERATION"], useSearch: true });

        await selectDropdownWithFromControl(this.page, {
            formControlName: 'batchUser',
            valueToSelect: app.batchUser,
            useSearch: true,

        });

    }


    async submitApplicationForm() {
        await this.page.click(this.application.form.submit);
        await this.waitForLoader();
    }

    // async submitForm() {
    //     await this.page.click(this.crudPage.submitForm);
    //     await this.waitForLoader();
    // }

    async submitForm() {

        const continueBtn = this.page.locator(this.crudPage.continueButton);
        const submitBtn = this.page.locator(this.crudPage.submitForm);

        const start = Date.now();
        const timeout = 20000;

        while (Date.now() - start < timeout) {

            // ✅ If Submit is ready → break
            if (await submitBtn.isVisible() && await submitBtn.isEnabled()) {
                console.log("Submit button available → proceeding to submit");
                break;
            }

            // ❌ Continue visible but disabled → validation issue
            if (await continueBtn.isVisible() && !(await continueBtn.isEnabled())) {
                throw new Error("Continue button is disabled → fix form validation before proceeding");
            }

            // ✅ Handle Continue flow
            if (await continueBtn.isVisible() && await continueBtn.isEnabled()) {

                const currentTab = await this.page
                    .locator(".p-tabview-nav li.p-highlight")
                    .last()
                    .innerText();

                console.log(`Before Continue → ${currentTab.trim()}`);

                await continueBtn.click();
                await this.waitForLoader();

                const nextTab = await this.page
                    .locator(".p-tabview-nav li.p-highlight")
                    .last()
                    .innerText();

                console.log(`After Continue → ${nextTab.trim()}`);

            } else {
                throw new Error("Neither Continue nor Submit is actionable → stuck UI");
            }

            await this.page.waitForTimeout(200); // buffer, not sync
        }

        // ❌ Fail if submit never appeared
        if (!(await submitBtn.isVisible())) {
            throw new Error("Submit button not found after navigating all steps");
        }

        // ✅ Final submit
        await submitBtn.click();
        console.log("Form submitted");

        await this.waitForLoader();
    }

    /* =====================================================
     * View Page
     * =================================================== */
    async getApplicationUUIDFromView() {
        await this.waitForPlusLoaderToDisappear()
        await this.page.waitForTimeout(1000)
        return await this.page
            .locator(this.application.view.uuid)
            .inputValue();
    }

    /* ---------------------------------------------------------------------
 * Capture cloned Application response (UUID)
 * ------------------------------------------------------------------- */
    async apiCaptureClonedApplication(originalUuid) {
        if (!originalUuid) {
            throw new Error("originalUuid is required for clone capture");
        }

        let clonedData = null;

        const responseHandler = async (response) => {
            const url = response.url();

            if (
                url.includes("saveAs") &&
                url.includes("action=clone") &&
                url.includes(`uuid=${originalUuid}`) &&
                url.includes("type=application")
            ) {
                const json = await response.json();

                if (json?.uuid && !clonedData) {
                    clonedData = json;
                }
            }
        };

        this.page.on("response", responseHandler);

        const start = Date.now();
        while (Date.now() - start < 10000) {
            if (clonedData) {
                this.page.off("response", responseHandler);
                return clonedData;
            }
            await this.page.waitForTimeout(200);
        }

        this.page.off("response", responseHandler);
        throw new Error("Failed to capture cloned application response");
    }


    async updateApplicationDescription(description) {
        if (!description) {
            throw new Error("description is required");
        }

        await this.page.waitForTimeout(1000)

        await this.waitForPlusLoaderToDisappear()

        const descriptionField =
            this.page.locator(this.application.form.desc);

        await descriptionField.waitFor({ state: "visible", timeout: 5000 });
        await descriptionField.fill(description);
    }



    /* =====================================================
 * Clone UUID Capture (API-level, NON-VALIDATING)
 * ===================================================== */
    // async captureClonedEntity({
    //     sourceUuid,
    //     action = "clone",
    //     entityType,
    //     timeout = 20000,
    // }) {
    //     if (!sourceUuid) {
    //         throw new Error("sourceUuid is required for clone capture");
    //     }
    //     if (!entityType) {
    //         throw new Error("entityType is required for clone capture");
    //     }
    //     let clonedId = null;
    //     let clonedUuid = null;

    //     const handler = async (response) => {
    //         const url = response.url();

    //         if (
    //             url.includes("saveAs") &&
    //             url.includes(`action=${action}`) &&
    //             url.includes(`uuid=${sourceUuid}`) &&
    //             url.includes(`type=${entityType}`)
    //         ) {
    //             const json = await response.json();
    //             if (json?.id) clonedId = json.id;
    //             if (json?.uuid) clonedUuid = json.uuid;
    //         }
    //     };

    //     this.page.on("response", handler);

    //     const start = Date.now();
    //     while (Date.now() - start < timeout) {
    //         if (clonedId && clonedUuid) {
    //             this.page.off("response", handler);
    //             return { id: clonedId, uuid: clonedUuid };
    //         }
    //         await this.page.waitForTimeout(200);
    //     }

    //     this.page.off("response", handler);
    //     throw new Error(`Failed to capture cloned ${entityType} UUID`);
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
                Application
 * ===================================================== */
    // async switchApplicationTab(tabKey) {

    //     const locator = this.tabs[tabKey];

    //     if (!locator) {
    //         throw new Error(`Unknown Application tab: ${tabKey}`);
    //     }

    //     await this.page.locator(locator).click();

    //     await this.page.waitForTimeout(200);
    // }

    // async switchApplicationTab(tabOrLocator) {

    //     let locator;

    //     if (typeof tabOrLocator === "string" && this.tabs[tabOrLocator]) {

    //         /* tabKey mode */
    //         locator = this.tabs[tabOrLocator];

    //     } else {

    //         /* direct locator mode */
    //         locator = tabOrLocator;

    //     }

    //     const tab = this.page.locator(locator);

    //     await tab.waitFor({
    //         state: "visible",
    //         timeout: 10000
    //     });

    //     await tab.click();

    //     await this.page.waitForTimeout(200);

    // }

    async switchApplicationTab(tabOrLocator) {

        let locator;

        if (typeof tabOrLocator === "string" && this.tabs[tabOrLocator]) {
            locator = this.tabs[tabOrLocator];
        } else {
            locator = tabOrLocator;
        }

        const tab = this.page.locator(locator);

        await tab.waitFor({ state: "visible", timeout: 10000 });

        // 🔥 Detect disabled state properly
        const isDisabled =
            (await tab.getAttribute("aria-disabled")) === "true" ||
            (await tab.getAttribute("data-p-disabled")) === "true" ||
            (await tab.locator("xpath=ancestor::li").getAttribute("data-p-disabled")) === "true";

        if (isDisabled) {
            console.log(`Tab is disabled → Clicking Continue`);

            await this.page.locator(this.crudPage.continueButton).click();

            // Wait for tab to become enabled (don’t rush like amateur scripts)
            await this.page.waitForFunction(
                (el) => el.getAttribute("aria-disabled") !== "true",
                await tab.elementHandle(),
                { timeout: 10000 }
            );

            await tab.click();

            console.log(`Tab switched AFTER clicking Continue`);
        } else {
            await tab.click();
            console.log(`Tab switched DIRECTLY`);
        }

        // Optional but smarter than fixed timeout
        await this.page.waitForLoadState("networkidle");
    }


    async fillApplicationCreateForm(app, applicationName) {

        /* ================= Overview TAB ================= */

        await this.switchApplicationTab("overview");

        await this.page.fill(this.application.form.name, applicationName);

        if (app.displayName) {
            await this.page.fill(this.application.form.displayName, app.displayName);
        }

        await this.page.fill(this.application.form.desc, app.desc);

        /* ================= General TAB ================= */

        await this.switchApplicationTab("general");

        await this.page.fill(this.application.form.code, app.code);

        await selectDropdownWithFromControl(this.page, {
            formControlName: "defaultEngine",
            valueToSelect: app.defaultEngine,
        });

        await selectDropdownWithFromControl(this.page, {
            formControlName: "applicationCategory",
            valueToSelect: "DEFAULT",
        });

        await this.page.fill(
            this.application.form.modelPort,
            app.modelPort
        );

        await selectDropdownWithFromControl(this.page, {
            formControlName: "reportingEngine",
            valueToSelect: app.reportingEngine,
        });

        if (app.datasource) {
            await selectDropdownWithFromControl(this.page, {
                formControlName: "datasource",
                valueToSelect: app.datasource,
                useSearch: true
            });
        }

        if (app.email) {
            await this.page.fill(this.application.form.email, app.email);
        }

        await selectDropdownWithFromControl(this.page, {
            formControlName: "batchUser",
            valueToSelect: app.batchUser,
            useSearch: true
        });

        await selectDropdownWithFromControl(this.page, {
            formControlName: "currency",
            valueToSelect: app.currency,
        });

        // await selectDropdownWithFromControl(this.page, {
        //     formControlName: "applicationType",
        //     valueToSelect: "SYSADMIN",
        // });

        await selectDropdownWithFromControl(this.page, {
            formControlName: "account",
            valueToSelect: app.account,
            useSearch: true
        });

        await selectDropdownMultiselectMultiple(this.page, {
            labelText: "Module",
            valuesToSelect: ["ALERT_GENERATION", "BATCH_SCHEDULER"],
            useSearch: true
        });

        await this.switchApplicationTab("//ul[@role='tablist']//li[contains(.,'Para')]");


    }





    /* =====================================================
                User
 * ===================================================== */


    async fillUserCreateForm({
        username,
        password,
        organization,
        firstName,
        lastName,
        gracePeriod = "5",
        groups = []
    }) {

        /* ================= OVERVIEW TAB ================= */

        await this.switchApplicationTab("overview");


        await this.page.fill(this.user.form.username, username);


        /* ================= GENERAL TAB ================= */

        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {
            labelText: this.user.form.organizationLabel,
            valueToSelect: organization,
            useSearch: true,
        });

        await this.page.fill(this.user.form.firstName, firstName);
        await this.page.fill(this.user.form.lastName, lastName);

        await this.page.fill(this.user.form.gracePeriod, gracePeriod);


        /* ================= SECURITY TAB ================= */

        await this.switchApplicationTab("security");

        const passwordLocator = this.page.locator(this.user.form.password);

        await this.manualTyping(passwordLocator, password, {
            delay: 60,
            clear: true,
        });

        await this.togglePasswordVisibility(
            this.page,
            this.user.form.passwordToggle
        );

        await setExpiryDateNewUI(
            this.page,
            this.user.form.expiryDate
        );

        await this.page.click(this.user.form.email);
        // await this.page.locator(this.user.form.emailField).fill("test@test.com");
        const emailInput = this.page.locator(this.user.form.emailField);

        await emailInput.waitFor({ state: "visible" });
        await emailInput.click();
        await emailInput.fill("test@test.com");
        await this.page.locator(this.user.form.emailSubmit).click();


        /* ================= GROUP TAB ================= */

        if (groups.length) {

            await this.switchApplicationTab(this.user.groups.tab);

            await this.page.locator(this.user.groups.openPicker).click();

            for (const group of groups) {

                await this.page.fill(this.user.groups.searchInput, group);

                const row = this.page.locator(
                    `//tr[.//td[normalize-space()='${group}']]`
                );

                await row.waitFor({ state: "visible" });

                const checkbox = row.locator(".p-checkbox-box");

                const isChecked = await row
                    .locator("input[type='checkbox']")
                    .isChecked()
                    .catch(() => false);

                if (!isChecked) {
                    await checkbox.click();
                }
            }

            await this.page.locator(this.user.groups.dialogSubmit).click();
        }

        /* ================= VERIFY DEFAULT GROUP ================= */


        const defaultGroupLabel = this.page.locator(
            this.user.form.defaultGroupLabel
        );


        /* wait until Angular updates dropdown */
        await defaultGroupLabel.waitFor({ state: "visible" });

        const selectedDefaultGroup = (await defaultGroupLabel.textContent())?.trim();

        /* verify one of selected groups is default */
        const isValidDefault = groups.some(
            g => selectedDefaultGroup?.toLowerCase() === g.toLowerCase()
        );

        if (!isValidDefault) {
            throw new Error(
                `Default group mismatch. Expected one of: ${groups.join(", ")}, but found: ${selectedDefaultGroup}`
            );
        }


    }


    async togglePasswordVisibility(page, toggleLocator) {

        const icon = page.locator(toggleLocator);

        await icon.waitFor({ state: "visible" });

        await icon.click();

        await page.waitForTimeout(200);
    }

    async updateUserDescription(desc) {
        const descField = this.page.locator(this.user.form.description);
        await this.manualTyping(descField, desc);
    }

    /* =====================================================
                Group
 * ===================================================== */


    async fillGroupCreateForm({
        name,
        application,
        role
    }) {

        await this.switchApplicationTab("overview");

        await this.page.locator(this.group.form.name).fill(name);

        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {
            labelText: this.group.form.applicationLabel,
            valueToSelect: application
        });

        await selectDropdown(this.page, {
            labelText: this.group.form.roleLabel,
            valueToSelect: role
        });

    }


    /* =====================================================
            Role
* ===================================================== */


    async fillRoleCreateForm({
        name,
        product,
        role,
        privileges = []
    }) {

        /* ================= OVERVIEW TAB ================= */

        await this.switchApplicationTab("overview");

        await this.page.fill(this.role.form.name, name);


        /* ================= GENERAL TAB ================= */

        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {
            locator: this.role.form.product,
            valueToSelect: product,
            useSearch: true,
        });

        await selectDropdown(this.page, {
            locator: this.role.form.role,
            valueToSelect: role,
            useSearch: false,
        });


        /* ================= PRIVILEGES PICKER ================= */

        if (privileges.length) {

            await this.page.locator(this.role.privileges.openPicker).click();

            for (const privilege of privileges) {

                await this.page.fill(
                    this.role.privileges.searchInput,
                    privilege
                );

                const row = this.page.locator(
                    `//tr[.//td[normalize-space()='${privilege}']]`
                );

                await row.waitFor({ state: "visible" });

                const checkbox = row.locator(".p-checkbox-box");

                const isChecked = await row
                    .locator("input[type='checkbox']")
                    .isChecked()
                    .catch(() => false);

                if (!isChecked) {
                    await checkbox.click();
                }
            }

            await this.page.locator(
                this.role.privileges.dialogSubmit
            ).click();

        }

    }


    /* =====================================================
        Privilege
* ===================================================== */


    async fillPrivilegeCreateForm({
        name,
        metaType,
        type
    }) {

        await this.switchApplicationTab("overview");

        await this.page
            .locator(this.privilege.form.name)
            .fill(name);


        await this.switchApplicationTab("general");


        await selectDropdown(this.page, {

            locator:
                this.privilege.form.metaTypeLabel,

            valueToSelect:
                metaType

        });


        await selectDropdown(this.page, {

            locator:
                this.privilege.form.typeLabel,

            valueToSelect:
                type

        });

    }


    /* =====================================================
        User Group
* ===================================================== */




    async fillUserGroupCreateForm({ name, users = [], groups = [] }) {

        /* ================= Overview TAB ================= */

        await this.switchApplicationTab("overview");
        await this.page.waitForTimeout(500);
        await this.page.fill(
            this.userGroup.form.name,
            name
        );


        /* ================= General TAB ================= */

        await this.switchApplicationTab("general");


        /* ================= Select Users ================= */


        await selectDropdownMultiselectMultiple(this.page, {
            locator: this.userGroup.form.selectUsers,
            valuesToSelect: users,
            useSearch: true
        });




        /* ================= Select Groups ================= */

        await selectDropdownMultiselectMultiple(this.page, {
            locator: this.userGroup.form.selectGroups,
            valuesToSelect: groups,
            useSearch: true
        });



    }



    /* =============================================================================================================================
                General
 * ================================================================================================================================= */


    /* =====================================================
                Calendar
 * ===================================================== */


    async fillCalendarCreateForm({

        name,
        workingDays = [],
        holidays = []

    }) {

        /* ================= OVERVIEW TAB ================= */

        await this.switchApplicationTab("overview");

        await this.page
            .locator(this.calendar.form.name)
            .fill(name);


        /* ================= GENERAL TAB ================= */

        await this.switchApplicationTab(this.calendar.tab.general);


        if (workingDays.length) {

            await selectDropdownMultiselectMultiple(this.page, {

                locator: this.calendar.form.workingDaysLabel,

                valuesToSelect: workingDays,

                useSearch: false

            });

        }


        /* ================= HOLIDAY DETAILS TAB ================= */

        if (holidays.length) {

            await this.switchApplicationTab("holidayDetails");


            for (let i = 0; i < holidays.length; i++) {

                const holiday = holidays[i];

                /* click ADD holiday */
                await this.page
                    .locator(this.calendar.form.addHolidayButton)
                    .click();


                /* get newly added row */
                const row = this.page
                    .locator(this.calendar.form.holidayRow)
                    .nth(i);


                await row.waitFor({ state: "visible" });


                /* holiday name */
                await row
                    .locator(this.calendar.form.holidayName)
                    .fill(holiday.name);


                /* holiday date */
                await setDateCalendarNew(
                    this.page,
                    row.locator(this.calendar.form.holidayDate),
                    holiday.date

                );


                /* optional checkbox */
                if (holiday.optional) {

                    const checkbox = row
                        .locator(this.calendar.form.holidayOptionalCheckbox);

                    const checked =
                        await checkbox.getAttribute("data-p-highlight");

                    if (checked !== "true") {

                        await checkbox.click();

                    }

                }

            }

        }

    }



    /* =====================================================
            Catagory
* ===================================================== */

    async fillCategoryCreateForm({ name }) {

        await this.switchApplicationTab("overview");

        await this.page
            .locator(this.category.form.name)
            .fill(name);

    }



    /* =====================================================
            DataSource
* ===================================================== */



    async fillDatasourceCreateForm({

        name,
        application,
        type,
        category,
        authType,
        access,
        driver,
        host,
        port,
        username,
        password,
        sessionParameters,
        dbName,
        schemaName,
        path,
        catalogName,

    }) {

        await this.switchApplicationTab("overview");

        await this.page.fill(
            this.datasource.form.name,
            name
        );
        await this.switchApplicationTab("//ul[@role='tablist']//span[.='General']");

        await this.waitForPlusLoaderToDisappear()
        await this.page.waitForTimeout(500)
        await selectDropdownMultiselectMultiple(this.page, {

            locator: this.datasource.form.applicationLabel,
            valuesToSelect: application,
            useSearch: true
        });

        await this.switchApplicationTab("//ul[@role='tablist']//span[.='Connection']");


        await this.waitForPlusLoaderToDisappear()
        await this.page.waitForTimeout(500)

        if (category) {
            await selectDropdown(this.page, {
                locator:
                    this.datasource.form.categoryLabel,
                valueToSelect:
                    category,

                useSearch: true

            });
        }

        if (type) {
            await selectDropdown(this.page, {

                locator:
                    this.datasource.form.typeLabel,

                valueToSelect:
                    type
            });
        }

        if (authType) {
            await selectDropdown(this.page, {

                locator:
                    this.datasource.form.authTypeLabel,

                valueToSelect:
                    authType,

                useSearch: true

            });
        }


        if (dbName) {
            await this.page.fill(
                this.datasource.form.dbName,
                dbName
            );
        }

        if (schemaName) {
            await this.page.fill(
                this.datasource.form.schemaName,
                schemaName
            );
        }

        if (path) {
            await this.page.fill(
                this.datasource.form.path,
                path
            );
        }

        if (catalogName) {
            await this.page.fill(
                this.datasource.form.catalogName,
                catalogName
            );
        }

        if (driver) {
            await this.page.fill(
                this.datasource.form.driver,
                driver
            );
        }
        if (host) {
            await this.page.fill(
                this.datasource.form.host,
                host
            );
        }

        if (port) {
            await this.page.fill(
                this.datasource.form.port,
                port
            );
        }

        if (dbName) {
            await this.page.fill(
                this.datasource.form.dbName,
                dbName
            );
        }

        if (username) {
            await this.page.fill(
                this.datasource.form.username,
                username
            );
        }

        if (password) {
            await this.page.fill(
                this.datasource.form.password,
                password
            );
        }

        await this.switchApplicationTab("//ul[@role='tablist']//span[.='Session Parameters']");
        if (sessionParameters) {
            await this.addSessionParameters(sessionParameters);
        }
    }

    // async editDatasourceCreateForm(ownerName , grantte) {
    //     await this.setDataSourceOwner(datasourceData);
    // }

    // async checkOwnerIsAlreadySet(ownerName) {

    //     await this.waitForPlusLoaderToDisappear();
    //     const ownerText = await this.page.locator(`//td[normalize-space()='${ownerName}']`);

    // }

    // async setDataSourceOwner(ownerName) {
    //     await this.checkOwnerIsAlreadySet(ownerName);
    //     await this.waitForPlusLoaderToDisappear();
    //     await this.page.click(this.datasource.form.ownerEditButton);
    //     await this.searchInListTable(ownerName);
    //     await this.page.click(this.datasource.form.checkBox);
    //     await this.page.click(this.datasource.form.selectButton);
    //     await this.waitForPlusLoaderToDisappear();

    // }

    async editDatasourceCreateForm(ownerName, grantee) {

        await this.waitForPlusLoaderToDisappear();

        // -----------------------------
        // OWNER
        // -----------------------------
        const ownerExists = await this.checkOwnerIsAlreadySet(ownerName);

        if (!ownerExists) {
            await this.setDataSourceOwner(ownerName);
        } else {
            console.log(`Owner ${ownerName} already set. Skipping owner update.`);
        }

        // -----------------------------
        // PRIVILEGES
        // -----------------------------
        await this.page.click("//div[@ptooltip='Privileges']");

        await this.waitForPlusLoaderToDisappear();

        const privilegeExists = await this.checkPrivilege(grantee);

        if (privilegeExists) {
            console.log(`Privilege already granted for ${grantee}. Skipping grant.`);
            return;
        }

        await this.grantPrivilege(grantee);
    }


    async checkOwnerIsAlreadySet(ownerName) {

        await this.waitForPlusLoaderToDisappear();

        const ownerLocator = this.page.locator(`//td[normalize-space()='${ownerName}']`);

        const count = await ownerLocator.count();

        if (count > 0) {
            console.log(`Owner ${ownerName} found in list`);
            return true;
        }

        return false;
    }

    async setDataSourceOwner(ownerName) {

        await this.waitForPlusLoaderToDisappear();

        await this.page.click(this.datasource.form.ownerEditButton);
        await this.page.locator(this.datasource.form.ownerAddButton).click();
        await this.waitForPlusLoaderToDisappear();
        const searchBox = await this.page.locator("//input[@placeholder='Search...']")
        await this.manualTyping(searchBox, ownerName, {
            delay: 30,
            clear: true,
        })
        await this.page.waitForLoadState("networkidle").catch(() => { })
        await this.page.click(this.datasource.form.checkBox);

        await this.page.click(this.datasource.form.selectButton);

        await this.waitForPlusLoaderToDisappear();
    }

    async checkPrivilege(grantee) {

        await this.page.click("(//p-radiobutton[@inputid='completed'])[1]");

        await this.waitForPlusLoaderToDisappear();

        const row = this.page.locator(`//tbody//tr[td[normalize-space()='${grantee}']]`);

        const count = await row.count();

        return count > 0;
    }

    async grantPrivilege(grantee) {

        await this.page.click("(//p-radiobutton[@inputid='pending'])[1]");

        await this.waitForPlusLoaderToDisappear();

        await this.page.click("(//button[@ptooltip='Grant'])[1]");

        await this.waitForPlusLoaderToDisappear();

        await selectDropdownMultiselectMultiple(this.page, {
            locator: "//p-multiselect[@placeholder='-Select Users-']",
            valuesToSelect: [grantee],
            useSearch: true
        });

        await selectDropdownMultiselectMultiple(this.page, {
            locator: "//p-multiselect[@placeholder='-Select Privileges-']",
            valuesToSelect: ["ALL"]
        });

        await this.page.click("//button[normalize-space()='Submit']");

        await this.waitForPlusLoaderToDisappear();
    }

    async addSessionParameters(sessionParameters) {

        const entries = Object.entries(sessionParameters);

        for (const [key, value] of entries) {

            await this.page.click(this.datasource.form.addSessionParamButton);

            const lastRow = this.page.locator("tbody tr").last();

            await lastRow.locator(this.datasource.form.sessionParamKey).fill(key);
            await lastRow.locator(this.datasource.form.sessionParamValue).fill(value);
        }
    }


    // async testDatasourceConnection() {

    //     await this.page.click(
    //         this.datasource.form.testConnectionButton
    //     );

    // }

    async testDatasourceConnection() {

        await this.page.click(this.datasource.form.testConnectionButton);

        const successIcon = this.page.locator("i.pi-check-circle.success-icon");
        const errorIcon = this.page.locator("i.pi-times-circle.error-icon");

        await this.page.waitForLoadState("networkidle");

        if (await successIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            return "PASS";
        }

        if (await errorIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            return "FAIL";
        }

        throw new Error("Datasource connection status not detected");
    }

    async waitConnectionSpinnerToDisappear() {

        const spinner =
            this.page.locator(
                this.datasource.form.connectionSpinner
            );

        await spinner.waitFor({
            state: "hidden",
            timeout: 15000
        });

    }


    /* =====================================================
                System Parameter
 * ===================================================== */

    async fillSysParamCreateForm({ name }) {

        await this.page.fill(this.sysParam.form.name, name);

        await this.switchApplicationTab("general");

        await setExpiryDate(
            this.page,
            this.sysParam.form.date
        );
    }

    async updateSysParamDescription(text) {
        // await this.page.fill(this.sysParam.form.desc, text);
        await this.manualTyping(this.page.locator(this.sysParam.form.desc), text)
    }

    async updateDescription(desc) {
        const descField = this.page.locator(this.form.description);
        await this.manualTyping(descField, desc);
    }



    /* =====================================================
                Tag
 * ===================================================== */

    async fillTagCreateForm(name) {
        await this.page.fill(this.tag.form.name, name);
    }

    async updateTagDescription(desc) {
        await this.page.fill(this.tag.form.desc, desc);
    }

    async fillApiClientCreateForm({ name, type }) {

        await this.page.fill(this.apiClient.form.name, name);

        await this.switchApplicationTab("general");

        await selectDropdownMultiselectMultiple(this.page, {
            locator: this.apiClient.form.grantType,
            valuesToSelect: type,
            useSearch: true
        });
    }

    async updateApiClientDescription(desc) {
        await this.page.fill(this.apiClient.form.desc, desc);
    }

    //server
    async fillServerCreateForm({ name, scriptPath }) {

        await this.page.locator(this.server.form.name).fill(name);

        await this.switchApplicationTab("general");

        await this.page.locator(this.server.form.scriptPath).fill(scriptPath);
    }



    /* =====================================================
                Products
 * ===================================================== */


    // async fillProductForm({ name, path }) {
    //     await this.page.locator(this.product.form.name).fill(name);
    //     await this.page.locator(this.product.form.path).fill(path);
    // }       
    async fillProductForm({
        name,
        path,
    }) {

        /* ========= Name ========= */
        await this.page.locator(this.product.form.name).fill(name);

        await this.switchApplicationTab("general");
        /* ========= Path ========= */
        await this.page.locator(this.product.form.path).fill(path);

        /* ========= Icon Selection ========= */
        await this.page.locator(this.product.form.iconSearch).click();
        await this.page.waitForTimeout(100);
        await this.page.locator(this.product.form.fileIcon).click();

        /* ========= Display Sequence ========= */
        await this.page.locator(this.product.form.displaySequence).fill("1");

    }

    async updateProductDescription(desc) {
        await this.page.locator(this.product.form.desc).fill(desc);
    }





    //cralwr > metadata


    async fillCrawlerCreateForm({ name, datasource, loadType }) {

        await this.page.locator('#name').fill(name);

        //   await this.page.getByRole('combobox').first().click();
        //   await this.page.getByText(datasource).click();
        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {

            labelText: "Datasource",

            valueToSelect: datasource,

            useSearch: true

        });

        await selectDropdown(this.page, {

            labelText: "Mode",

            valueToSelect: loadType,

            useSearch: false

        });


    }


    //genral  
    //domain 
    async fillDomainCreateForm({ name }) {

        const nameInput = this.page.getByRole('textbox').first();

        await nameInput.fill(name);

    }

    async fillLovCreateForm({ name, value }) {

        const nameInput = this.page.getByRole('textbox').first();
        await nameInput.fill(name);

        await this.switchApplicationTab("general");

        //   await this.page.locator(this.lov.form.addValueButton).click();

        await this.page.getByRole('option').click();

        await this.page.getByRole('textbox').last().fill(value);

    }



    async fillNotificationTemplateCreateForm({
        name,
        subject,
        message,
        sender,
        sendAttachment
    }) {

        const nameInput = this.page.getByRole('textbox').first();
        await nameInput.fill(name);

        await this.switchApplicationTab("general");

        const subjectInput = this.page.getByRole('textbox').nth(1);
        await subjectInput.fill(subject);

        await this.page.locator('#message').fill(message);

        const senderInput = this.page.getByRole('textbox').nth(2);
        await senderInput.fill(sender);

        if (sendAttachment) {
            await this.page.getByRole('checkbox', { name: 'Send Attachment' }).check();
        }

    }







    async fillPageCreateForm({ name, page, helpUrl }) {

        const nameInput = this.page.getByRole('textbox').first();
        await nameInput.fill(name);

        await this.switchApplicationTab("general");

        await this.page.locator('#page').fill(page);

        await this.page.locator('#helpURL').fill(helpUrl);

    }



    async navigateToQuickLink() {
        await this.page.getByRole('link', { name: 'Quick Link' }).click();
    }



    async fillQuickLinkCreateForm({ name, url, account, selectProducts, cache = true }) {

        await this.page.locator(this.quickLink.form.name).fill(name);

        await this.switchApplicationTab("general");

        await this.page.locator(this.quickLink.form.url).fill(url);

        await selectDropdown(this.page, {
            locator: this.quickLink.form.account,
            valueToSelect: account,
            // useSearch: true
        });
        if (selectProducts) {
            await selectDropdownMultiselectMultiple(this.page, {
                locator: this.quickLink.form.selectProducts,
                valuesToSelect: ["Administration"],
                useSearch: true
            });
        }
        const cacheSwitch = await this.page.locator(this.quickLink.form.cacheSwitch);
        await cacheSwitch.click();


    }


    async fillRepositoryCreateForm({ name, username, password, clonePath, parameters }) {

        await this.page.locator('#name').fill(name);

        await this.switchApplicationTab("general");

        await this.page.locator('#username').fill(username);
        await this.page.locator('#password').fill(password);
        await this.page.locator('#localClonePath').fill(clonePath);

        //   await this.switchApplicationTab("parameter");

        //   if (parameters?.length) {

        //     for (const param of parameters) {

        //       await this.page.getByRole('button').nth(3).click();

        //       await this.page.getByRole('textbox', { name: 'Enter key' }).fill(param.key);

        //       await this.page.getByRole('textbox', { name: 'Enter value' }).fill(param.value);

        //     }

        //   }

    }



    async fillResourceCreateForm({ name, cores, memory, compute, storage, parameters }) {

        await this.page.getByRole('textbox').first().fill(name);

        await this.switchApplicationTab("general");

        await this.page.locator('#cores').fill(String(cores));
        await this.page.locator('#memory').fill(String(memory));
        await this.page.locator('#compute').fill(String(compute));
        await this.page.locator('#storage').fill(String(storage));

        //   await this.switchApplicationTab("resource parameter");

        //   if (parameters?.length) {

        //     for (const param of parameters) {

        //       await this.page.getByRole('button').nth(3).click();

        //       await this.page.getByRole('textbox', { name: 'Enter key' }).fill(param.key);

        //       await this.page.getByRole('textbox', { name: 'Enter value' }).fill(param.value);

        //     }

        //   }

    }


    async fillMigrationImportCreateForm({ name }) {

        await this.page.locator('#name').fill(name);

    }


    async fillMigrationExportCreateForm({ uuid, description }) {

        await this.page.locator('#uuid').first().fill(uuid);

        const textarea = this.page.locator('textarea').first();
        await textarea.fill(description);

    }


    async fillWebhookCreateForm({ name, datasource, datapodName }) {

        await this.page.getByRole('textbox').first().fill(name);

        await this.switchApplicationTab("general");

        await selectDropdown(this.page, {
            locator: '[data-test-id="dropdown_common_webhook_datasource"]',
            valueToSelect: datasource,
            useSearch: true
        });

        await this.page.locator('#datapodName').fill(datapodName);

    }


    // Register Datasource

    async openRegisterListTab() {
        await this.page.locator(this.metadata.register.list).click();
    }


    async regsiterDatasource({ datasource, isRegistered }) {

        await selectDropdown(this.page, {
            locator: this.metadata.register.datasource,
            valueToSelect: datasource,
            useSearch: true
        });

        if (isRegistered) {
            await this.page.locator(this.metadata.register.registerYesRadio).click();
        } else {
            await this.page.locator(this.metadata.register.registerNoRadio).click();
        }
        await this.page.locator(this.metadata.register.searchButton).click();
        await this.page.waitForLoadState("networkidle").catch(() => { })
        await this.waitForPlusLoaderToDisappear();
    }

    async checkStatusLabel(expectedStatus) {
        const statusLabel = this.page.locator(this.metadata.register.registeringStatusLable);
        await expect(statusLabel).toHaveText(expectedStatus, { timeout: 10000 });
    }

    async validateRegisteredItem(datasourceName, datapodName) {

        await this.page.locator(this.metadata.register.refreshIcon).click();

        await selectDropdown(this.page, {
            locator: this.metadata.register.datasource,
            valueToSelect: datasourceName,
            useSearch: true
        });

        await this.page.locator(this.metadata.register.registerYesRadio).click();
        await this.page.locator(this.metadata.register.searchButton).click();

        await this.page.waitForLoadState("networkidle").catch(() => { });
        await this.waitForPlusLoaderToDisappear();

        const searchInput = this.page.locator(this.metadata.register.datasourceSearchInput);
        await this.manualTyping(searchInput, datapodName, { delay: 20, clear: true });

        await this.page.waitForLoadState("networkidle").catch(() => { });

        const statusLabel = this.page.locator(this.metadata.register.registeredStatusLabel).first();
        await statusLabel.waitFor({ state: "visible" });

        const statusText = await statusLabel.textContent();

        return statusText?.trim() === "REGISTERED";
    }


    // async fillWebServiceListCreateForm({
    //   name,
    //   uuid,
    //   apiClient,
    //   outputFormat,
    //   serviceClass,
    //   serviceMethod,
    //   serviceType
    // }) {

    //   await this.page.getByRole('textbox').first().fill(name);

    //   await this.switchApplicationTab("general");

    //   await this.page.locator('#uuid').fill(uuid);

    //   await selectDropdown(this.page, {
    //     locator: this.webServiceList.form.apiClient,
    //     valueToSelect: apiClient
    //   });

    //   await selectDropdown(this.page, {
    //     locator: this.webServiceList.form.outputFormat,
    //     valueToSelect: outputFormat
    //   });

    //   await selectDropdown(this.page, {
    //     locator: '#pn_id_190',
    //     valueToSelect: serviceClass
    //   });

    //   await selectDropdown(this.page, {
    //     locator: '#pn_id_192',
    //     valueToSelect: serviceMethod
    //   });

    //   await selectDropdown(this.page, {
    //     locator: this.page.getByRole('combobox', { name: '-Select-' }),
    //     valueToSelect: serviceType
    //   });

    // }


}

export { Admin };
