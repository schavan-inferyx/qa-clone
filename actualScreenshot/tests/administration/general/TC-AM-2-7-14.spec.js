import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let RESOURCE_UUID;
let CLONED_RESOURCE_UUID;

test.describe.serial("Administration - Resource CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(
      common,
      appConfig.plus.admin.role,
      appConfig.plus.entityStructure.defaultOrg.applications.administration[0]
    );

    await admin.navigateToGeneral();
    await admin.navigateToResource();

  });


  /* ================= CREATE ================= */

  test("Create Resource", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const resourceName = `Resource_${Date.now()}`;

    await admin.openAddForm();

    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillResourceCreateForm({

      name: resourceName,
      cores: 1,
      memory: 19,
      compute: 19,
      storage: 19,
      parameters: [
        { key: "Tester_resource", value: "20" }
      ]

    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/saved/i);

    await admin.checkBreadcrumbContainsView("View");

    RESOURCE_UUID = await admin.getUUIDFromView();

    expect(RESOURCE_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(RESOURCE_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(RESOURCE_UUID);

    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateDescription("edited via automation");

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/saved|updated/i);

  });


  /* ================= LOCK ================= */

  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(RESOURCE_UUID);

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

    await common.searchByUUID(RESOURCE_UUID);

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

    await common.searchByUUID(RESOURCE_UUID);

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

    await common.searchByUUID(RESOURCE_UUID);

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
        sourceUuid: RESOURCE_UUID,
        entityType: "resource",
      });

    await common.searchByUUID(RESOURCE_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;

    CLONED_RESOURCE_UUID = uuid;

    expect(CLONED_RESOURCE_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* delete clone first */

    await common.searchByUUID(CLONED_RESOURCE_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* delete original */

    await common.searchByUUID(RESOURCE_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});