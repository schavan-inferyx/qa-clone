import { test, expect } from "@base/BaseTest.js";
import { Admin } from "@pages/plus/class/admin.js";
import { CommanLayout } from "@pages/plus/class/common-layout.js";
import appConfig from "@utils/config/app-config.js";

let ACCOUNT_UUID;
let CLONED_ACCOUNT_UUID;

test.describe.serial("Administration - Account CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.navigateToAccount();
  });

  /* ================= Create ================= */
  test("Create", async ({ authentication, mongo }) => {
    const admin = new Admin(authentication);
    const accountName = `Account_${Date.now()}`;

    await admin.openAddAccountForm();
    await admin.checkAccountAddBreadcrumb("Add");

    await admin.fillAccountCreateForm(accountName);
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Account saved successfully");

    await admin.checkAccountViewBreadcrumb("View");

    ACCOUNT_UUID = await admin.getAccountUUIDFromView();
    expect(ACCOUNT_UUID).toBeTruthy();

    // const docs = await mongo.findByUUID("account", ACCOUNT_UUID);
    // console.log("Mongo returned docs:", docs.length);

  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(ACCOUNT_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkAccountViewBreadcrumb("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(ACCOUNT_UUID);

    await common.openActionMenu();
    await common.clickEditAction();
    
    await admin.updateAccountDescription("edited via automation");
    await admin.submitAccountForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Account saved successfully");
  });

  /* ================= Lock ================= */
  test("Lock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(ACCOUNT_UUID);

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

    await common.searchByUUID(ACCOUNT_UUID);

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
      sourceUuid: ACCOUNT_UUID,
      entityType: "account",
    });

    await common.searchByUUID(ACCOUNT_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_ACCOUNT_UUID = uuid;

    expect(CLONED_ACCOUNT_UUID).toBeTruthy();
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* Delete Clone FIRST */
    await common.searchByUUID(CLONED_ACCOUNT_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* Delete Original LAST */
    await common.searchByUUID(ACCOUNT_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/request submitted successfully|request submitted/i);

    await common.assertNoRecordsFound();
  });

});
