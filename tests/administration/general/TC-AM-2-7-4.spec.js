import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let WEBHOOK_UUID;
let CLONED_WEBHOOK_UUID;

test.describe.serial("Administration - Webhook CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(
      common,
      appConfig.plus.admin.role,
      appConfig.plus.entityStructure.defaultOrg.applications.administration[0]
    );

    await admin.navigateToGeneral();
    await admin.navigateToWebhook();

  });


  /* ================= CREATE ================= */

  test("Create Webhook", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const webhookName = `Webhook_${Date.now()}`;

    await admin.openAddForm();

    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillWebhookCreateForm({

      name: webhookName,
      datasource: "postgres_framework_admin",
      datapodName: "Tester"

    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/saved/i);

    await admin.checkBreadcrumbContainsView("View");

    WEBHOOK_UUID = await admin.getUUIDFromView();

    expect(WEBHOOK_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(WEBHOOK_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(WEBHOOK_UUID);

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

    await common.searchByUUID(WEBHOOK_UUID);

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

    await common.searchByUUID(WEBHOOK_UUID);

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

    await common.searchByUUID(WEBHOOK_UUID);

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

    await common.searchByUUID(WEBHOOK_UUID);

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
        sourceUuid: WEBHOOK_UUID,
        entityType: "webhook",
      });

    await common.searchByUUID(WEBHOOK_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;

    CLONED_WEBHOOK_UUID = uuid;

    expect(CLONED_WEBHOOK_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* delete clone first */

    await common.searchByUUID(CLONED_WEBHOOK_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* delete original */

    await common.searchByUUID(WEBHOOK_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});