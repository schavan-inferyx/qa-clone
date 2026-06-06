import { Workbench } from "@pages/plus/class/workbench.js";
import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let REGISTERED_ITEM;
let APPLICATION_NAME = appConfig.plus.entityStructure.defaultOrg.applications.administration[0];
let DATASOURCE_NAME = "mysql_framework_admin";
let DATAPOD_NAME = "dq_datapod_summary_stats";

test.describe.serial("Administration - Register Check", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(
      common,
      appConfig.plus.admin.role,
      APPLICATION_NAME
    );

    await admin.navigateToMetaData();
    await admin.navigateToRegister();
  });


  let DATASOURCE_NAME = "iceberg_framework_aml";

  test("Add Owner To Iceburge DataSource", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await admin.navigateToGeneral();
    await admin.navigateToDataSource();
    await common.searchByUUID(DATASOURCE_NAME);
    await common.openActionMenu()
    await common.clickEditAction();
    await admin.editDatasourceCreateForm(
      "owner_test",
      "demo"
    );
    await admin.submitForm();

// 🔥 Open Workbench tab
    const workbenchPage = await common.openUrlInNewTab(
      "workbench",
      appConfig.plus.workbench.url
    );
    

    // 🔥 Bind correct page
    const workbench = new Workbench(workbenchPage);

    await workbench.loginToWorkbench(
      appConfig.plus.workbench.username,
      appConfig.plus.workbench.password
    );

    await workbench.setUpWorkbenchApp(
      common,
      appConfig.plus.workbench.role,
      APPLICATION_NAME
    );

    // 🔥 Close tab and return
    await common.closeCurrentTabAndSwitchToMain();

    // 🔥 REQUIRED (until you refactor architecture)
    admin.page = common.page;

  });


  test("Validate Datasource is added to workbench", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);
    const workbench = new Workbench(authentication);

    await workbench.setUpWorkbenchApp(common, appConfig.plus.workbench.role, APPLICATION_NAME);
    await common.searchByUUID(DATASOURCE_NAME);
    await common.checkDatasource();

  });


  /* ================= Search ================= */
  test(`Register Datapod ${DATAPOD_NAME} for Datasource : ${DATASOURCE_NAME} : & Application : ${APPLICATION_NAME}`, async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await admin.openRegisterListTab();

    await admin.regsiterDatasource({
      datasource: DATASOURCE_NAME,
      isRegistered: false
    });

    await common.searchDatapod(DATAPOD_NAME);
    await common.checkDatapod();
    await common.clickDatasourceRegisterAction();
    await common.confirmDatasourceRegistration();
    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/request submitted successfully|request submitted/i);

    await admin.checkStatusLabel("REGISTERING");

    REGISTERED_ITEM = await admin.validateRegisteredItem(DATASOURCE_NAME, DATAPOD_NAME);
    expect(REGISTERED_ITEM).toBeTruthy();
  });

  /* ================= Validation ================= */
  test("isRegistered", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);
    await admin.openRegisterListTab();
    REGISTERED_ITEM = await admin.validateRegisteredItem(DATASOURCE_NAME, DATAPOD_NAME);
    expect(REGISTERED_ITEM).toBeTruthy();
  });

});