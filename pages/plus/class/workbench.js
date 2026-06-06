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

class Workbench extends BasePage {

    /* ---------------------------------------------------------------------
     * Constructor & Locators
     * ------------------------------------------------------------------- */
    constructor(page) {
        super(page);

        // Common / Shared
        this.common = commonLayout.common;

        // Menu navigation
        this.menu = admin.menus;

    }

    async loginToWorkbench(username, password) {
        await super.loginWorkbench(username, password);
    }

    /* ---------------------------------------------------------------------
     * App & Role Setup
     * ------------------------------------------------------------------- */
    async setUpWorkbenchApp(common, role, appUnderTest) {

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
     * Toast Message Utility
     * ------------------------------------------------------------------- */


    async getToastMessage({ timeout = 5000 } = {}) {

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


    /* =========================
     * UUID Capture from View
     * ========================= */


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





}

export { Workbench };
