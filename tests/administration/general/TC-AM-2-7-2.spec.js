import { test, expect } from "../../../base/BaseTest.js";
import { Admin } from "../../../pages/plus/class/admin.js";
import { CommanLayout } from "../../../pages/plus/class/common-layout.js";
import appConfig from "../../../utils/config/app-config.js";

let CALENDAR_UUID;
let CLONED_CALENDAR_UUID;

test.describe.serial("Administration - Calendar CRUD", () => {

  test.beforeEach(async ({ authentication }) => {

    const common = new CommanLayout(authentication);
    const admin = new Admin(authentication);

    await admin.setupAdminApp(common, appConfig.plus.admin.role, appConfig.plus.entityStructure.defaultOrg.applications.administration[0]);

    await admin.navigateToGeneral();
    await admin.navigateToCalendar();

  });


  /* ================= CREATE ================= */

  test("Create Calendar", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication)

    const calendarName = `Calendar_${Date.now()}`;

    await common.openAddForm(); // reuse 

    await admin.checkBreadcrumbContainsAdd("Add");


    await admin.fillCalendarCreateForm({

      name: calendarName,

      workingDays: ["SUN", "MON", "TUE"],

      holidays: [

        {
          name: "Holiday_IndependenceDay",
          date: "2026-01-26",
          optional: false
        },

        {
          name: "Holiday_OfficeParty",
          date: "2026-02-20",
          optional: true
        }

      ]

    });


    await common.submitForm();


    const toast = await admin.getToastMessage();

    expect(toast).toBe("Calendar saved successfully");


    await admin.checkBreadcrumbContainsView("View");


    CALENDAR_UUID = await admin.getUUIDFromView();

    expect(CALENDAR_UUID).toBeTruthy();

  });


  /* ================= VIEW ================= */

  test("View", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CALENDAR_UUID);

    await common.openActionMenu();
    await common.clickViewAction();

    await admin.checkBreadcrumbContainsView("View");

  });


  /* ================= EDIT ================= */

  test("Edit", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CALENDAR_UUID);

    await common.openActionMenu();
    await common.clickEditAction();

    await admin.updateDescription("edited via automation");

    await admin.submitForm();

    const toast = await admin.getToastMessage();

    expect(toast).toBe("Calendar saved successfully");

  });

  

  /* ================= LOCK ================= */

  test("Lock", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);

    await common.searchByUUID(CALENDAR_UUID);

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

    await common.searchByUUID(CALENDAR_UUID);

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

    await common.searchByUUID(CALENDAR_UUID);

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

    await common.searchByUUID(CALENDAR_UUID);

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
        sourceUuid: CALENDAR_UUID,
        entityType: "calendar",
      });


    await common.searchByUUID(CALENDAR_UUID);

    await common.openActionMenu();
    await common.clickCloneAction();

    await common.confirmExecution();

    const toast = await admin.getToastMessage();

    expect(toast).toMatch(/clone|saved/i);


    const { uuid } = await cloneCapture;

    CLONED_CALENDAR_UUID = uuid;

    expect(CLONED_CALENDAR_UUID).toBeTruthy();

  });


  /* ================= DELETE ================= */

  test("Delete", async ({ authentication }) => {

    const admin = new Admin(authentication);
    const common = new CommanLayout(authentication);


    /* delete clone first */

    await common.searchByUUID(CLONED_CALENDAR_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    let toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();


    /* delete original */

    await common.searchByUUID(CALENDAR_UUID);

    await common.openActionMenu();
    await common.clickDeleteAction();

    await common.confirmExecution();

    toast = await admin.getToastMessage();

    expect(toast).toMatch(/deleted/i);

    await common.assertNoRecordsFound();

  });

});
