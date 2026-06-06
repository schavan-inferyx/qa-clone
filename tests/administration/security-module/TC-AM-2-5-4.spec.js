import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let PRIVILEGE_UUID;
let CLONED_PRIVILEGE_UUID;

test.describe.serial("Administration - Privilege CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    // await admin.setupAdminApp(common, appConfig.plus.admin.role);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);

    await admin.navigateToSecurity();

    await admin.navigateToPrivilege();

  });


  /* ================= CREATE ================= */

  test("Create Privilege", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const privilegeName = `Privilege_${Date.now()}`;

    await admin.openAddForm();

    // await admin.checkBreadcrumbContainsAdd("Add");


    await admin.fillPrivilegeCreateForm({

      name: privilegeName,

      metaType: "application",

      type: "Add"

    });


    await admin.submitForm();


    const toast = await admin.getToastMessage();

    expect(toast).toBe("Privilege saved successfully");


    // await admin.checkBreadcrumbContainsView("View");


    PRIVILEGE_UUID = await admin.getUUIDFromView();

    expect(PRIVILEGE_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickViewAction();


    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickEditAction();


    await admin.updateDescription(
      "edited via automation"
    );


    await admin.submitForm();


    const toast = await admin.getToastMessage();

    expect(toast).toBe("Privilege saved successfully");

  });


  /* ================= LOCK ================= */

  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickLockAction();

    await common.confirmExecution();


    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/lock/i);

  });


  /* ================= UNLOCK ================= */

  test("Unlock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickUnlockAction();

    await common.confirmExecution();


    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/unlock/i);

  });


  /* ================= PUBLISH ================= */

  test("Publish", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickPublishAction();

    await common.confirmExecution();


    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/publish/i);

  });


  /* ================= UNPUBLISH ================= */

  test("Unpublish", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickUnpublishAction();

    await common.confirmExecution();


    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/unpublish/i);

  });


  /* ================= CLONE ================= */

  test("Clone", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    const cloneCapture =
      admin.captureClonedEntity({

        sourceUuid: PRIVILEGE_UUID,

        entityType: "privilege"

      });


    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickCloneAction();

    await common.confirmExecution();


    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);


    const { uuid } = await cloneCapture;

    CLONED_PRIVILEGE_UUID = uuid;

    expect(CLONED_PRIVILEGE_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    /* Delete Clone FIRST */

    await common.searchByUUID(CLONED_PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickDeleteAction();

    await common.confirmExecution();


    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);


    await common.assertNoRecordsFound();


    /* Delete Original LAST */

    await common.searchByUUID(PRIVILEGE_UUID);

    await common.openActionMenu();

    await common.clickDeleteAction();

    await common.confirmExecution();


    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);


    await common.assertNoRecordsFound();

  });

});
