import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import { isValuePresentInColumn } from "../../../utils/tableUtils.js";

test.describe("TC-AM-2-7-17 - Session View", () => {

  let admin;
  let commonLayout;
  let sessionUUID;

  test.beforeEach(async ({ page }) => {
    admin = new Admin(page);
    commonLayout = new CommanLayout(page);

    // App setup & login handled in BaseTest fixture

    // Navigate to General → Session
    await admin.navigateToModule("General", "Session");
  });

 

  
  test("View Session", async ({ page }) => {

    // 🔹 Precondition:
    // You must supply UUID dynamically (never hardcode)
    // Example: from fixture or previous CRUD spec
    sessionUUID = process.env.SESSION_UUID;

    if (!sessionUUID) {
      throw new Error("SESSION_UUID not provided. 0454 requires runtime UUID.");
    }

    // 🔹 Search strictly by UUID
    await admin.searchByUUID(sessionUUID);

    // 🔹 Action → View (via wrapper only)
    await commonLayout.clickViewAction();

    // 🔹 Validate breadcrumb first
    await admin.checkBreadcrumbContainsView();

    // 🔹 Wait for UUID exposure (never assume view loaded)
    await admin.waitForViewUUID();

    const viewedUUID = await admin.getUUIDFromView();

    expect(viewedUUID).toBe(sessionUUID);
  });

});