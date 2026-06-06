import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let SERVER_UUID;
let CLONED_SERVER_UUID;

test.describe.serial("Administration - Server CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);


    // await admin.setupAdminApp(common, appConfig.plus.admin.role);
    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.openGeneralMenu();    
    await admin.navigateToServer();
  });

  /* ================= Create ================= */
  test("TC-AM-2-7-15 : Create", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const serverName = `server_${Date.now()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillServerCreateForm({
      name: serverName,
      scriptPath: "/test"
    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/server saved successfully/i);

    await admin.checkBreadcrumbContainsView("View");

    SERVER_UUID = await admin.getUUIDFromView();
    expect(SERVER_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SERVER_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SERVER_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateServerDescription("edited via automation");

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/saved successfully/i);
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SERVER_UUID);
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

    await common.searchByUUID(SERVER_UUID);
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
      sourceUuid: SERVER_UUID,
      entityType: "server",
    });

    await common.searchByUUID(SERVER_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_SERVER_UUID = uuid;

    expect(CLONED_SERVER_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    // Delete clone first
    await common.searchByUUID(CLONED_SERVER_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    // Delete original
    await common.searchByUUID(SERVER_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
