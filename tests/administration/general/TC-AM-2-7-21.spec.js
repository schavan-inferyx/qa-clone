import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let CLIENT_UUID;
let CLONED_CLIENT_UUID;

test.describe.serial("Administration - API Client CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);


    await admin.setupAdminApp(common, appConfig.plus.admin.role);
    await admin.openGeneralMenu();
    await admin.navigateToApiClient();

  });

  /* ================= Create ================= */
  test("TC-AM-2-7-21 : Create", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const clientName = `client_${Date.now()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillApiClientCreateForm({
      name: clientName,
      type: ["READ", "WRITE"]
    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/saved successfully/i);

    await admin.checkBreadcrumbContainsView("View");

    CLIENT_UUID = await admin.getUUIDFromView();
    expect(CLIENT_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateApiClientDescription("edited via automation");

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/saved successfully/i);
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickLockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/lock/i);
  });

  /* ================= Unlock ================= */
  test("Unlock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickUnlockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unlock/i);
  });

  /* ================= Clone ================= */
  test("Clone", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    const cloneCapture = admin.captureClonedEntity({
      sourceUuid: CLIENT_UUID,
      entityType: "apiclient",
    });

    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_CLIENT_UUID = uuid;

    expect(CLONED_CLIENT_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    // Delete clone first
    await common.searchByUUID(CLONED_CLIENT_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    // Delete original
    await common.searchByUUID(CLIENT_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
