
// import { test, expect } from "@playwright/test";

// /* =========================================================
//    CONFIG
// ========================================================= */
// const ADMIN_URL = "https://test2.inferyx.com/admin/#/login";
// const USERNAME = "sys_admin";
// const PASSWORD = "20Inferyx!9";

// const roles = [
//     { name: "DC Viewer", product: "Data Catalog", roleScope: "Application" },
//     { name: "DE Viewer", product: "Data Engineering", roleScope: "Application" },
//     { name: "DA Viewer", product: "Data Analytics", roleScope: "Application" }
// ];

// const privilegesMap = {
//     "Data Catalog": [
//         "dataglossary",
//         "datadomain",
//         "dataasset",
//         "dataproduct",
//         "classification",
//         "classificationExec",
//         "classificationGroup",
//         "classificationGroupExec"
//     ],

//     "Data Engineering": [
//         "dag", "dagexec",
//         "dataarchive", "dataarchiveexec", "dataarchivegroup", "dataarchivegroupexec",
//         "datadomain", "dataasset", "dataproduct", "dataset", "datastore",
//         "dq", "dqexec", "dqgroup", "dqgroupexec",
//         "expression", "formula", "function",
//         "hub", "hubexec",
//         "ingest", "ingestExec", "ingestgroup", "ingestgroupexec",
//         "map", "mapExec", "mapgroup", "mapgroupexec",
//         "migrate", "migrateexec",
//         "profile", "profileexec", "profilegroup", "profilegroupexec",
//         "recon", "reconexec", "recongroup", "recongroupexec",
//         "relation", "satellite", "satelliteexec",
//         "schedule", "vault", "vaultexec"
//     ],

//     "Data Analytics": [
//         "featurepod", "vizpod", "graphpod", "graphpod2",
//         "graphanalysis", "graphexec",
//         "graphSimulate", "graphSimulateexec", "simulate",
//         "model", "modelexec", "train", "trainexec", "predict",
//         "rule", "ruleexec", "rulegroup", "rulegroupexec",
//         "routine", "routineexec",
//         "report", "reportexec",
//         "vizexec",
//         "wfprocess", "wfprocessexec"
//     ]
// };

// /* =========================================================
//    HELPERS (FINAL, DO NOT MODIFY)
// ========================================================= */

// // ---- manual typing (PrimeNG filter trigger) ----
// async function manualType(page, locatorOrSelector, text, delay = 80) {
//     const locator =
//         typeof locatorOrSelector === "string"
//             ? page.locator(locatorOrSelector)
//             : locatorOrSelector;

//     await locator.fill("");
//     for (const ch of text) {
//         await locator.type(ch, { delay });
//     }
// }

// // ---- wait for dropdown results ----
// async function waitForDropdownResults(page, timeout = 5000) {
//     await page.waitForSelector("li[role='option']", { timeout });
//     await page.waitForTimeout(150);
// }

// // ---- pick dropdown option by text (NO GUESSING) ----
// async function pickOptionByText(page, text) {
//     const option = page.locator("li[role='option']", { hasText: text });
//     if (await option.count()) {
//         await option.first().click();
//         return true;
//     }

//     const plain = page
//         .locator(`text="${text}"`)
//         .filter({ has: page.locator("li[role='option'], .p-dropdown-item") });

//     if (await plain.count()) {
//         await plain.first().click();
//         return true;
//     }

//     await page.keyboard.press("Escape");
//     throw new Error(`Dropdown option not found after filtering: ${text}`);
// }

// // ---- PrimeNG dropdown select + assert ----
// async function selectPrimeNgDropdown(page, label, value) {
//     const combo = page.getByRole("combobox", { name: label });

//     await combo.scrollIntoViewIfNeeded();
//     await combo.click({ force: true });

//     const searchBox = page.getByRole("searchbox");
//     await manualType(page, searchBox, value);

//     await waitForDropdownResults(page);
//     const selected = await pickOptionByText(page, value);
//     expect(selected).toBeTruthy();

// }


// // ---- privilege selection (row-scoped, stable) ----
// async function selectPrivileges(page, privileges) {
//     const searchBox = page.getByRole("textbox", {
//         name: "Search Privileges..."
//     });

//     for (const privilege of privileges) {
//         await searchBox.fill("");
//         await searchBox.type(`${privilege}view`, { delay: 80 });

//         await page.waitForTimeout(500);

//         // ❗ check "No privileges found"
//         const noFound = page.locator(
//             "//td[normalize-space()='No privileges found']"
//         );

//         if (await noFound.isVisible()) {
//             console.log(`Privilege not found: ${privilege}`);
//             continue; // skip checkbox click
//         }

//         // click checkbox only if result exists
//         const checkbox = page.locator("//th//div[@class='p-checkbox-box']");
//         await checkbox.click();

//         await page.waitForTimeout(500);
//     }
// }


// /* =========================================================
//    TEST
// ========================================================= */

// test.describe.serial("Create roles with PrimeNG-safe dropdowns & privileges", () => {
//     test("create roles", async ({ page }) => {

//         /* ---------- LOGIN ---------- */
//         await page.goto(ADMIN_URL);
//         await page.getByRole("textbox", { name: "User Name" }).fill(USERNAME);
//         await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD);
//         await page.getByRole("button", { name: "Login", exact: true }).click();

//         await expect(page.getByRole("link", { name: /Security/i })).toBeVisible();

//         /* ---------- NAVIGATION ---------- */
//         await page.getByRole("link", { name: /Security/i }).click();
//         await page.getByRole("link", { name: "Role" }).click();

//         for (const role of roles) {
//             console.log(`Creating role: ${role.name}`);

//             /* ---------- CREATE ---------- */
//             await page.locator("//span[contains(@class,'pi-plus')]").click();

//             /* ---------- NAME ---------- */
//             //   await page.getByRole("textbox", { name: "Name" }).fill(role.name);
//             await page.locator("//input[@formcontrolname='name']").fill(role.name);

//             /* ---------- PRODUCT ---------- */
//             await selectPrimeNgDropdown(
//                 page,
//                 "Select Product",
//                 role.product
//             );

//             await page.waitForTimeout(1500); // slight delay to avoid dropdown clash

//             /* ---------- ROLE SCOPE ---------- */
//             await selectPrimeNgDropdown(
//                 page,
//                 "Select a Role Scope",
//                 role.roleScope
//             );

//             /* ---------- PRIVILEGES ---------- */
//             await page.locator("#step-1 i").click();
//             await selectPrivileges(
//                 page,
//                 privilegesMap[role.product] ?? []
//             );

//             await page.locator("//button[@label='Submit']").click();
//             await page.waitForTimeout(500); // wait for submission to process

//             await page.locator("//p-button[@label='Submit']").click();
//             await page.waitForTimeout(500); // wait for submission to process

//             await page
//                 .locator("//i[@ptooltip='Close']")
//                 .waitFor({ state: 'visible', timeout: 15000 });

//             await page.locator("//i[@ptooltip='Close']").click();
//         }
//     });
// });


import { test, expect } from "@playwright/test";

/* =========================================================
   CONFIG
========================================================= */
const ADMIN_URL = "https://test2.inferyx.com/admin/#/login";
const USERNAME = "sys_admin";
const PASSWORD = "20Inferyx!9";

const roles = [
  { name: "DC Viewer", product: "Data Catalog", roleScope: "Application" },
  { name: "DE Viewer", product: "Data Engineering", roleScope: "Application" },
  { name: "DA Viewer", product: "Data Analytics", roleScope: "Application" }
];

const privilegesMap = {
  "Data Catalog": [
    "dataglossary",
    "datadomain",
    "dataasset",
    "dataproduct",
    "classification",
    "classificationExec",
    "classificationGroup",
    "classificationGroupExec"
  ],
  "Data Engineering": [
    "dag","dagexec",
    "dataarchive","dataarchiveexec","dataarchivegroup","dataarchivegroupexec",
    "datadomain","dataasset","dataproduct","dataset","datastore",
    "dq","dqexec","dqgroup","dqgroupexec",
    "expression","formula","function",
    "hub","hubexec",
    "ingest","ingestExec","ingestgroup","ingestgroupexec",
    "map","mapExec","mapgroup","mapgroupexec",
    "migrate","migrateexec",
    "profile","profileexec","profilegroup","profilegroupexec",
    "recon","reconexec","recongroup","recongroupexec",
    "relation","satellite","satelliteexec",
    "schedule","vault","vaultexec"
  ],
  "Data Analytics": [
    "featurepod","vizpod","graphpod","graphpod2",
    "graphanalysis","graphexec",
    "graphSimulate","graphSimulateexec","simulate",
    "model","modelexec","train","trainexec","predict",
    "rule","ruleexec","rulegroup","rulegroupexec",
    "routine","routineexec",
    "report","reportexec",
    "vizexec",
    "wfprocess","wfprocessexec"
  ]
};

/* =========================================================
   HELPERS
========================================================= */

// ---- manual typing (PrimeNG filter trigger) ----
async function manualType(page, locatorOrSelector, text, delay = 80) {
  const locator =
    typeof locatorOrSelector === "string"
      ? page.locator(locatorOrSelector)
      : locatorOrSelector;

  await locator.fill("");
  for (const ch of text) {
    await locator.type(ch, { delay });
  }
}

// ---- wait for dropdown results ----
async function waitForDropdownResults(page, timeout = 5000) {
  await page.waitForSelector("li[role='option']", { timeout });
  await page.waitForTimeout(150);
}

// ---- pick dropdown option by text ----
async function pickOptionByText(page, text) {
  const option = page.locator("li[role='option']", { hasText: text });
  if (await option.count()) {
    await option.first().click();
    return true;
  }
  await page.keyboard.press("Escape");
  throw new Error(`Dropdown option not found: ${text}`);
}

// ---- PrimeNG dropdown select ----
async function selectPrimeNgDropdown(page, label, value) {
  const combo = page.getByRole("combobox", { name: label });
  await combo.click({ force: true });

  const searchBox = page.getByRole("searchbox");
  await manualType(page, searchBox, value);

  await waitForDropdownResults(page);
  await pickOptionByText(page, value);
}

// ---- privilege selection ----
async function selectPrivileges(page, privileges) {
  const searchBox = page.getByRole("textbox", { name: "Search Privileges..." });

  for (const privilege of privileges) {
    await searchBox.fill("");
    await searchBox.type(`${privilege}view`, { delay: 80 });
    await page.waitForTimeout(400);

    const noFound = page.locator("//td[normalize-space()='No privileges found']");
    if (await noFound.isVisible()) {
      console.log(`Privilege missing: ${privilege}`);
      continue;
    }

    await page.locator("//th//div[@class='p-checkbox-box']").click();
  }
}

// ---- check if role exists ----
async function roleExists(page, roleName) {
  const searchBox = page.locator("//input[@placeholder='Search Keyword']");
  const roleCell = page.locator(`//td[normalize-space()='${roleName}']`);

  await searchBox.fill("");
  await searchBox.type(roleName, { delay: 80 });
  await waitForSpinnerToDisappear(page);

  return await roleCell.isVisible();
}

// ---- clear role search ----
async function clearRoleSearch(page) {
  await page.locator("//input[@placeholder='Search Keyword']").fill("");
  await page.waitForTimeout(300);
}


// ---- wait for ngx-spinner to disappear (stable & reusable) ----
async function waitForSpinnerToDisappear(page, timeout = 20000) {
  const spinner = page.locator(".ngx-spinner-overlay");

  // spinner may or may not appear
  if (await spinner.count()) {
    await spinner.first().waitFor({
      state: "hidden",
      timeout
    }).catch(() => {});
  }
}


/* =========================================================
   TEST
========================================================= */

test.describe.serial("Create roles only if not present", () => {
  test("idempotent role creation", async ({ page }) => {

    /* ---------- LOGIN ---------- */
    await page.goto(ADMIN_URL);
    await page.getByRole("textbox", { name: "User Name" }).fill(USERNAME);
    await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD);
    await page.getByRole("button", { name: "Login", exact: true }).click();

    /* ---------- NAVIGATION ---------- */
    await page.getByRole("link", { name: /Security/i }).click();
    await page.getByRole("link", { name: "Role" }).click();

    for (const role of roles) {
      console.log(`\n🔍 Checking role: ${role.name}`);

        await waitForSpinnerToDisappear(page);


      if (await roleExists(page, role.name)) {
        console.log(`⏭️  Role already exists. Skipping.`);
        await clearRoleSearch(page);
        continue;
      }

      console.log(`➕ Creating role: ${role.name}`);
      await clearRoleSearch(page);

      /* ---------- CREATE ---------- */
      await page.locator("//span[contains(@class,'pi-plus')]").click();
      await page.locator("//input[@formcontrolname='name']").fill(role.name);

      await selectPrimeNgDropdown(page, "Select Product", role.product);
      await selectPrimeNgDropdown(page, "Select a Role Scope", role.roleScope);

      await page.locator("#step-1 i").click();
      await selectPrivileges(page, privilegesMap[role.product] ?? []);

      await page.locator("//button[@label='Submit']").click();
      await page.waitForTimeout(400);
      await page.locator("//p-button[@label='Submit']").click();

      await page.locator("//i[@ptooltip='Close']").waitFor({ state: "visible" });
      await page.locator("//i[@ptooltip='Close']").click();
    }
  });
});
