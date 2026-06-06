import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let DATASOURCE_UUID;
let CLONED_DATASOURCE_UUID;

test.describe.serial("Administration - Datasource CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);
    await admin.navigateToGeneral();
    await admin.navigateToDataSource();

  });


  /* ================= CREATE ================= */

  test("Create Iceburge DataSource", async ({ authentication }) => {

    const admin = new Admin(authentication);

    const datasourceName =
      `iceberg_framework_aml${Date.now()}`;

    await admin.openAddForm();

    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillDatasourceCreateForm({

      name: datasourceName,
      application: ["Anti Money Laundering"],
      category: "RDBMS",
      type: "ICEBERG",
      authType:"Basic",
      dbName: "framework_aml",
      schemaName:"framework_aml",
      path:"s3a://inferyx/inferyx/automation",
      catalogName:"automation",
      sessionParameters: {
        "framework.iceberg.sparkcatalog.name": "automation",
        "spark.hadoop.fs.s3a.access.key": "AKIA2MQMR5ABLRCKWGOP",
        "spark.hadoop.fs.s3a.secret.key": "qjv1+nET3reejNbMBGhe+CsNfXbmY3It9Xe7utcrQUezC",
        "spark.hadoop.fs.s3a.endpoint": "s3.amazonaws.com",
        "spark.hadoop.fs.s3a.path.style.access": "true",
        "spark.hadoop.fs.s3a.region": "us-east-1",
      }

    });


    await admin.submitForm();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toBe("Datasource saved successfully");


    await admin.checkBreadcrumbContainsView("View");

    DATASOURCE_UUID =
      await admin.getUUIDFromView();

    expect(DATASOURCE_UUID)
      .toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateDescription(
      "edited via automation"
    );

    await admin.submitForm();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toBe("Datasource saved successfully");

  });


  /* ================= LOCK ================= */

  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickLockAction();

    await common.confirmExecution();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/lock/i);

  });


  /* ================= UNLOCK ================= */

  test("Unlock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickUnlockAction();

    await common.confirmExecution();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/unlock/i);

  });


  /* ================= PUBLISH ================= */

  test("Publish", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickPublishAction();

    await common.confirmExecution();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/publish/i);

  });


  /* ================= UNPUBLISH ================= */

  test("Unpublish", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickUnpublishAction();

    await common.confirmExecution();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/unpublish/i);

  });


  /* ================= CLONE ================= */

  test("Clone", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    const cloneCapture =
      admin.captureClonedEntity({

        sourceUuid: DATASOURCE_UUID,

        entityType: "datasource"

      });


    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/clone|saved/i);


    const { uuid } =
      await cloneCapture;

    CLONED_DATASOURCE_UUID =
      uuid;

    expect(CLONED_DATASOURCE_UUID)
      .toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    await common.searchByUUID(CLONED_DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/deleted/i);

    await common.assertNoRecordsFound();


    await common.searchByUUID(DATASOURCE_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast =
      await admin.getToastMessage();

    expect(toast)
      .toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});
