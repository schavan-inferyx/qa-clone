import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let PRODUCT_UUID;
let CLONED_PRODUCT_UUID;

test.describe.serial("Administration - Product CRUD", () => {

  test.beforeEach(async ({ authentication }) => {
    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);    
    await admin.navigateToProduct();
  });

  /* ================= Create ================= */
  test("Create", async ({ authentication }) => {
    const admin = new Admin(authentication);

    const productName = `Product_${Date.now()}`;
    const productPath = `/products-${productName.toLowerCase()}`;

    await admin.openAddForm();
    await admin.checkBreadcrumbContainsAdd("Add");

    await admin.fillProductForm({
      name: productName,
      path: productPath,
    });

    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Product saved successfully!");

    await admin.checkBreadcrumbContainsView("View");

    PRODUCT_UUID = await admin.getUUIDFromView();
    expect(PRODUCT_UUID).toBeTruthy();
  });

  /* ================= View ================= */
  test("View", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");
  });

  /* ================= Edit ================= */
  test("Edit", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateProductDescription("edited via automation");
    await admin.submitForm();

    const toast = await admin.getToastMessage();
    expect(toast).toBe("Product saved successfully!");
  });


  /* ================= Clone ================= */
  test("Clone", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    const cloneCapture = admin.captureClonedEntity({
      sourceUuid: PRODUCT_UUID,
      entityType: "product",
    });

    await common.searchByUUID(PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickCloneAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/clone|saved/i);

    const { uuid } = await cloneCapture;
    CLONED_PRODUCT_UUID = uuid;

    expect(CLONED_PRODUCT_UUID).toBeTruthy();
  });

  /* ================= Lock (Cloned) ================= */
  test("Lock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLONED_PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickLockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/lock/i);
  });

  /* ================= Unlock (Cloned) ================= */
  test("Unlock", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLONED_PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickUnlockAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unlock/i);
  });

  /* ================= Publish (Cloned) ================= */
  test("Publish", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLONED_PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickPublishAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/publish/i);
  });

  /* ================= Unpublish (Cloned) ================= */
  test("Unpublish", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CLONED_PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickUnpublishAction();
    await common.confirmExecution();

    const toast = await admin.getToastMessage();
    expect(toast).toMatch(/unpublish/i);
  });

  /* ================= Delete ================= */
  test("Delete", async ({ authentication }) => {
    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    /* Delete Clone FIRST */
    await common.searchByUUID(CLONED_PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    let toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

    /* Delete Original LAST */
    await common.searchByUUID(PRODUCT_UUID);
    await common.openActionMenu();
    await common.clickDeleteAction();
    await common.confirmExecution();

    toast = await admin.getToastMessage();
    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();
  });

});
