import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let SYSPARAM_UUID;
let CLONED_SYSPARAM_UUID;

test.describe.serial("Administration - SysParam CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    // await admin.setupAdminApp(common, appConfig.plus.admin.role);
    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.openGeneralMenu();
    await admin.navigateToSysParam();
  });

  /* ================= Create ================= */
  test("Create", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const paramName = `sysparam_${Date.now()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillSysParamCreateForm({
      name: paramName
    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("SysParam saved successfully");

    await admin.checkBreadcrumbContainsView("View");

    SYSPARAM_UUID = await admin.getUUIDFromView();
    expect(SYSPARAM_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SYSPARAM_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SYSPARAM_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateSysParamDescription("edited via automation");
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("SysParam saved successfully");
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(SYSPARAM_UUID);
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

    await common.searchByUUID(SYSPARAM_UUID);
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

    await common.searchByUUID(SYSPARAM_UUID);
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

    await common.searchByUUID(SYSPARAM_UUID);
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
      sourceUuid: SYSPARAM_UUID,
      entityType: "sysparam",
    });

    await common.searchByUUID(SYSPARAM_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_SYSPARAM_UUID = uuid;

    expect(CLONED_SYSPARAM_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* Delete Clone FIRST */
    await common.searchByUUID(CLONED_SYSPARAM_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* Delete Original LAST */
    await common.searchByUUID(SYSPARAM_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
