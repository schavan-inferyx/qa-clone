import { test, expect } from "../../base/BaseTest";
import { CommanLayout } from "../../pages/plus/class/common-layout.js";
import { DataCatalog } from "../../pages/plus/class/data-catalog.js";
import appConfig from "../../utils/config/app-config.js";


let GLOSSARY_UUID;
let CLONED_GLOSSARY_UUID;

test.describe.serial("Data Catalog - Glossary CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const dataCatalog = new DataCatalog(authentication);

    await dataCatalog.setupDataCatalogApp(
      common,
      appConfig.plus.dataCatalog.defaultRole,
      appConfig.plus.entityStructure.defaultOrg.applications.dataCatalog[0]
    );

    await dataCatalog.openDataGlossaryNavigation();

  });

  /* ================= CREATE ================= */

  test("Create", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);

    const glossaryName = `Glossary_${Date.now()}`;

    await dataCatalog.openAddForm();

    await dataCatalog.checkBreadcrumbContainsAdd("Add");

    await dataCatalog.fillGlossaryCreateForm({
      name: glossaryName,
      parentglossary: "data_glossary_demo"
    });

    await dataCatalog.submitForm();
    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/saved|success/i);

    await dataCatalog.checkBreadcrumbContainsView("View");

    GLOSSARY_UUID = await dataCatalog.getUUIDFromView();

    expect(GLOSSARY_UUID).toBeTruthy();
  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();
    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickViewAction();

    await dataCatalog.checkBreadcrumbContainsView("View");

  });

  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickEditAction();

    await dataCatalog.updateDescription("Edited via automation");

    await dataCatalog.submitForm();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/saved|success/i);

  });

  /* ================= LOCK ================= */

  test("Lock", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickLockAction();
    await common.confirmExecution();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/lock/i);

  });

  /* ================= UNLOCK ================= */

  test("Unlock", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickUnlockAction();
    await common.confirmExecution();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/unlock/i);

  });

  /* ================= PUBLISH ================= */

  test("Publish", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickPublishAction();
    await common.confirmExecution();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/publish/i);

  });

  /* ================= UNPUBLISH ================= */

  test("Unpublish", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    await common.searchByUUID(GLOSSARY_UUID);

    await common.openActionMenu();
    await common.clickUnpublishAction();
    await common.confirmExecution();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/unpublish/i);

  });

  /* ================= CLONE ================= */

  test("Clone", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    const cloneCapture =
      dataCatalog.captureClonedEntity({
        sourceUuid: GLOSSARY_UUID,
        entityType: "dataglossary",
      });

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/clone|saved|success/i);

    const { uuid } = await cloneCapture;
    CLONED_GLOSSARY_UUID = uuid;

    expect(CLONED_GLOSSARY_UUID).toBeTruthy();

  });

  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const dataCatalog = new DataCatalog(authentication);
    const common = new CommanLayout(authentication);
    await dataCatalog.switchToList();

    /* delete clone first */

    await dataCatalog.searchByUUID(CLONED_GLOSSARY_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* delete original */

    await common.searchByUUID(GLOSSARY_UUID);


    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await dataCatalog.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});


