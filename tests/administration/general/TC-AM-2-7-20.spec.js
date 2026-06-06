import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let WS_LIST_UUID;
let CLONED_WS_LIST_UUID;

test.describe.serial("Administration - Web Service List CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(
      common,
      appConfig.plus.admin.role,
      appConfig.plus.entityStructure.defaultOrg.applications.administration[0]
    );

    await admin.navigateToGeneral();
    await admin.navigateToWebService();
    await admin.navigateToWebServiceList();

  });


  /* ================= CREATE ================= */

  test("Create Web Service List", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const wsName = `WS_List_${Date.now()}`;

    await admin.openAddForm();

    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillWebServiceListCreateForm({

      name: wsName,
      uuid: "tester",
      inputFormat: "CSV",
      outputFormat: "CSV",
      serviceClass: "com.inferyx.framework.service",
      serviceMethod: "prepareBusinessRule",
      serviceType: "REST"

    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/saved/i);

    await admin.checkBreadcrumbContainsView("View");

    WS_LIST_UUID = await admin.getUUIDFromView();

    expect(WS_LIST_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(WS_LIST_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(WS_LIST_UUID);

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

    await common.searchByUUID(WS_LIST_UUID);

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

    await common.searchByUUID(WS_LIST_UUID);

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

    await common.searchByUUID(WS_LIST_UUID);

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

    await common.searchByUUID(WS_LIST_UUID);

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
        sourceUuid: WS_LIST_UUID,
        entityType: "webservice_list",
      });

    await common.searchByUUID(WS_LIST_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;

    CLONED_WS_LIST_UUID = uuid;

    expect(CLONED_WS_LIST_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* delete clone first */

    await common.searchByUUID(CLONED_WS_LIST_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* delete original */

    await common.searchByUUID(WS_LIST_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});