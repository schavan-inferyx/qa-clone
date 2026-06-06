import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let TAG_UUID;
let CLONED_TAG_UUID;

test.describe.serial("Administration - Tag CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);


    // await admin.setupAdminApp(common, appConfig.plus.admin.role);
    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.openGeneralMenu();
    await admin.navigateToTag();

  });

  /* ================= Create ================= */
  test("TC-AM-2-7-19 : Create", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const tagName = `Tag_${Date.now()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillTagCreateForm(tagName);
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Tag saved successfully");

    await admin.checkBreadcrumbContainsView("View");

    TAG_UUID = await admin.getUUIDFromView();
    expect(TAG_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(TAG_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(TAG_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateTagDescription("edited via automation");
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/success/i);
  });

  /* ================= Clone ================= */
  test("Clone", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    const cloneCapture = admin.captureClonedEntity({
      sourceUuid: TAG_UUID,
      entityType: "tag",
    });

    await common.searchByUUID(TAG_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_TAG_UUID = uuid;

    expect(CLONED_TAG_UUID).toBeTruthy();
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLONED_TAG_UUID);
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

    await common.searchByUUID(CLONED_TAG_UUID);
    await common.openActionMenu();
    await common.clickUnlockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unlock/i);
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* Delete Clone FIRST */
    await common.searchByUUID(CLONED_TAG_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* Delete Original LAST */
    await common.searchByUUID(TAG_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
