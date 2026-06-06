import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let USER_UUID;
let CLONED_USER_UUID;

test.describe.serial("Administration - User CRUD", () => {

  /* =====================================================
   * Global Setup
   * ===================================================== */
  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    // await admin.setupAdminApp(common, appConfig.plus.admin.role);
    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.navigateToUser();
  });

  /* ================= Create ================= */
  test("Create User", async ({ authentication }) => {
    const admin = new Admin(authentication);

    const userName = `user_${Date.now()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillUserCreateForm({
      username: userName,
      password: "20Inferyx!19",
      organization: "Inferyx",
      groups: ["Org Admin"],
      defaultGroup: "Org Admin",
      firstName: "John",
      lastName: "Doe",
      gracePeriod: "5"
    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/saved/i);

    await admin.checkBreadcrumbContainsView("View");

    USER_UUID = await admin.getUUIDFromView();
    expect(USER_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(USER_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(USER_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateUserDescription("edited via automation");
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/saved/i);
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(USER_UUID);
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

    await common.searchByUUID(USER_UUID);
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

    await common.searchByUUID(USER_UUID);
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

    await common.searchByUUID(USER_UUID);
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
      sourceUuid: USER_UUID,
      entityType: "user",
    });

    await common.searchByUUID(USER_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_USER_UUID = uuid;

    expect(CLONED_USER_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* ---- Delete Clone FIRST ---- */
    await common.searchByUUID(CLONED_USER_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* ---- Delete Original LAST ---- */
    await common.searchByUUID(USER_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
