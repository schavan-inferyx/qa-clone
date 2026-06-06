import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let APPLICATION_UUID;
let CLONED_APPLICATION_UUID;

const appData =
  appConfig.plus.entityStructure.defaultOrg.appList[0];

test.describe.serial("Administration - Application CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.navigateToApplication();
  });

  /* ================= Create ================= */
  test("Create", async ({ authentication }) => {
    const admin = new Admin(authentication);
        const applicationName = `Application_${Date.now()}`;


    await admin.openAddApplicationForm();
    await admin.checkApplicationAddBreadcrumb("Add");

    await admin.fillApplicationCreateForm(appData, applicationName);
    await admin.submitForm();
    
    const toast = await admin.getToastMessage();
    expect(toast).toBe("Application saved successfully");

    await admin.checkApplicationViewBreadcrumb("View");

    APPLICATION_UUID = await admin.getApplicationUUIDFromView();
    expect(APPLICATION_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkApplicationViewBreadcrumb("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateApplicationDescription("edited via automation");
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Application saved successfully");
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(APPLICATION_UUID);
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

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickUnlockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unlock/i);
  });

  /* ================= Publish ================= */
  test("Publish", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickPublishAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/publish/i);
  });

  /* ================= Unpublish ================= */
  test("Unpublish", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickUnpublishAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unpublish/i);
  });

  /* ================= Clone ================= */
  test("Clone", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    const cloneCapture = admin.captureClonedEntity({
      sourceUuid: APPLICATION_UUID,
      entityType: "application",
    });

    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_APPLICATION_UUID = uuid;

    expect(CLONED_APPLICATION_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* Delete Clone FIRST */
    await common.searchByUUID(CLONED_APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/request submitted successfully|request submitted/i);

    await common.assertNoRecordsFound();

    /* Delete Original LAST */
    await common.searchByUUID(APPLICATION_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/request submitted successfully|request submitted/i);

    await common.assertNoRecordsFound();
  });

});
