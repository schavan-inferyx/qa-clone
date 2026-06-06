import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let REPOSITORY_UUID;
let CLONED_REPOSITORY_UUID;

test.describe.serial("Administration - Repository CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(
      common,
      appConfig.plus.admin.role,
      appConfig.plus.entityStructure.defaultOrg.applications.administration[0]
    );

    await admin.navigateToGeneral();
    await admin.navigateToRepository();

  });


  /* ================= CREATE ================= */

  test("Create Repository", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const repoName = `Repo_${Date.now()}`;

    await admin.openAddForm();

    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillRepositoryCreateForm({

      name: repoName,
      username: repoName,
      password: "Tester!1234",
      clonePath: "testing",
      parameters: [
        { key: "Tester", value: "tester20" }
      ]

    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/saved/i);

    await admin.checkBreadcrumbContainsView("View");

    REPOSITORY_UUID = await admin.getUUIDFromView();

    expect(REPOSITORY_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(REPOSITORY_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(REPOSITORY_UUID);

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

    await common.searchByUUID(REPOSITORY_UUID);

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

    await common.searchByUUID(REPOSITORY_UUID);

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

    await common.searchByUUID(REPOSITORY_UUID);

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

    await common.searchByUUID(REPOSITORY_UUID);

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
        sourceUuid: REPOSITORY_UUID,
        entityType: "repository",
      });

    await common.searchByUUID(REPOSITORY_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;

    CLONED_REPOSITORY_UUID = uuid;

    expect(CLONED_REPOSITORY_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* delete clone first */

    await common.searchByUUID(CLONED_REPOSITORY_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* delete original */

    await common.searchByUUID(REPOSITORY_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});