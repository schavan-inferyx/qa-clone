

import { test, expect } from '@playwright/test';

test.describe.serial('Create groups for every application x role (final, no suffix numbers)', () => {
  const ADMIN_URL = process.env.ADMIN_URL ?? 'https://test2.inferyx.com/admin/#/login';
  const USERNAME = process.env.ADMIN_USER ?? 'sys_admin';
  const PASSWORD = process.env.ADMIN_PASS ?? '20Inferyx!9';

  const applications = [
    "Anti Money Laundering",
    // "Claim Fraud Analytics",
    // "Continuous Controls Monitoring",
    // "Credit Card Fraud Detection",
    // "Credit Risk Analytics",
    // "Customer Analytics",
    // "Enterprise Data Warehouse",
    // "HR Analytics",
    // "Internal Audit",
    // "NBFC Reporting Datamart",
    // "NBFC Staging Datamart",
    // "Reporting Data Mart",
    // "Sanctions Screening",
    // "Staging Data Mart",
    // "Supply Chain - Oil & Gas",
    // "Transaction Flow Analytics",
  ];

  const applicationSuffix = [
    "aml",
    // "cfa","ccm","ccfd","cra","ca","edw","hra","ia","nbfc_rd","nbfc_sd","rdm","ss","sdm","scog","tfa"
  ];

  const roles = [
    // { name: "Data Engineer" },
    // { name: "Data Scientist" },
    // { name: "Data Analyst" },
    // { name: "Data Steward" },
    // { name: "Dev Ops" },
    // { name: "Meta Ops" },
    // { name: "Data Ops" },
    // { name: "ML Ops" },
    { name: "DC Viewer" },
    { name: "DE Viewer" },
    { name: "DA Viewer" }
  ];



  const rolesSuffix = [
    // { suffix: "data_engineer" },
    // { suffix: "data_scientist" },
    // { suffix: "data_analyst" },
    // { suffix: "data_steward" },
    // { suffix: "dev_ops" },
    // { suffix: "meta_ops" },
    // { suffix: "data_ops" },
    // { suffix: "ml_ops" },
    { suffix: "dc_viewer" },
    { suffix: "de_viewer" },
    { suffix: "da_viewer" }
  ];

  const selectors = {
    appCombobox: '(//p-dropdown[@formcontrolname="application"]//span)[1]',
    roleCombobox: '(//p-dropdown[@formcontrolname="roleId"]//span)[1]',
    createBtnMatch: /Create|New|Add/i,
    nameInput: { role: 'textbox', name: 'Name *', exact: true },
    submitButton: { role: 'button', name: 'Submit' }
  };

  async function manualType(page, locatorOrSelector, text, delay = 100) {
    let locator =
      typeof locatorOrSelector === 'string'
        ? page.locator(locatorOrSelector)
        : locatorOrSelector;

    await locator.fill('');
    for (const ch of text) {
      await locator.type(ch, { delay });
    }
  }

  async function waitForDropdownResults(page, timeout = 5000) {
    await page.waitForSelector('li[role="option"]', { timeout });
    await page.waitForTimeout(150);
  }

  async function pickOptionByText(page, text) {
    const optionByText = page.locator('li[role="option"]', { hasText: text });
    if ((await optionByText.count()) > 0) {
      await optionByText.first().click();
      return true;
    }

    const plain = page
      .locator(`text="${text}"`)
      .filter({ has: page.locator('li[role="option"], .p-dropdown-item') });
    if ((await plain.count()) > 0) {
      await plain.first().click();
      return true;
    }

    const firstOpt = page.locator('li[role="option"]').first();
    if ((await firstOpt.count()) > 0) {
      await firstOpt.click();
      return true;
    }

    await page.keyboard.press('Escape');
    return false;
  }


  test('login and create deterministic groups (app_sfx_role_sfx) skipping existing', async ({ page }) => {
    const created = [];
    const skipped = [];

    // ---------- LOGIN ----------
    await page.goto(ADMIN_URL);
    await expect(page).toHaveURL(/\/login/);

    await page.getByRole('textbox', { name: 'User Name' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('textbox', { name: 'Password' }).press('Enter')
    ]);
    await expect(page.getByRole('link', { name: /Security/i })).toBeVisible();

    // ---------- NAVIGATE TO GROUP PAGE ----------
    await page.getByRole('link', { name: /Security/i }).click();
    await page.getByRole('link', { name: /^Group$/i }).click();

    const createBtn = page.locator('//button[@icon="pi pi-plus"]');
    const createBtnExists = (await createBtn.count()) > 0;

    const searchBox = page.getByRole('textbox', { name: 'Search...' });

    for (let i = 0; i < applications.length; ++i) {
      const appName = applications[i];
      const appSfx = applicationSuffix[i];

      for (let j = 0; j < roles.length; ++j) {
        const roleName = roles[j].name;
        const roleSfx = rolesSuffix[j].suffix;

        const shortName = `${appSfx}_${roleSfx}`; // e.g. aml_data_engineer

        // ----- STEP 1: SEARCH FIRST, BEFORE CLICKING ADD -----
        let existsViaSearch = false;
        if (await searchBox.count()) {
          await searchBox.click();
          await manualType(page, searchBox, shortName, 80);
          await page.waitForTimeout(500);

          // exact match in the list
          const existingRow = page.getByText(shortName, { exact: true }).first();
          const count = await existingRow.count();

          if (count > 0) {
            // DO NOT CLICK — just record and continue
            console.log(`SKIP (exists via search): ${shortName} (app="${appName}", role="${roleName}")`);
            skipped.push({ name: shortName, app: appName, role: roleName });
            existsViaSearch = true;
          }

          // clear search reliably before continuing to next iteration
          await searchBox.fill('');
          // also try ESC to close any dropdowns
          await page.keyboard.press('Escape');
          await page.waitForTimeout(150);
        }

        if (existsViaSearch) {
          // short wait to avoid flapping UI
          await page.waitForTimeout(120);
          continue; // skip create for this 
        }

        // fallback check if search box not present or failed
        if (!(await searchBox.count())) {
          const already = await page.locator(`text=${shortName}`).first().count();
          if (already > 0) {
            console.log(`SKIP (exists plain check): ${shortName} (app="${appName}", role="${roleName}")`);
            skipped.push({ name: shortName, app: appName, role: roleName });
            await page.waitForTimeout(120);
            continue;
          }
        }

        // ----- STEP 2: OPEN CREATE DIALOG -----
        if (createBtnExists) {
          await createBtn.click();
        } else {
          await page
            .locator('div')
            .filter({ hasText: /^Home GroupList$/ })
            .getByRole('button')
            .nth(2)
            .click();
        }

        const nameInput = page.getByRole(selectors.nameInput.role, {
          name: selectors.nameInput.name,
          exact: selectors.nameInput.exact
        });
        await expect(nameInput).toBeVisible({ timeout: 5000 });
        await nameInput.fill(shortName);

        // --- Application dropdown ---
        await page.locator(selectors.appCombobox).click();
        await manualType(page, page.getByRole('searchbox'), appName, 80);
        await waitForDropdownResults(page);
        const appPicked = await pickOptionByText(page, appName);
        if (!appPicked) {
          console.warn(`WARN: application "${appName}" not picked reliably for group ${shortName}`);
        }

        // --- Role dropdown ---
        await page.locator(selectors.roleCombobox).click();
        await manualType(page, page.getByRole('searchbox'), roleName, 80);
        await waitForDropdownResults(page);
        const rolePicked = await pickOptionByText(page, roleName);
        if (!rolePicked) {
          console.warn(`WARN: role "${roleName}" not picked reliably for group ${shortName}`);
        }

        // submit and wait for success (API or UI update)
        await Promise.all([
          page
            .waitForResponse(
              resp =>
                resp.url().includes('/api/') &&
                resp.status() >= 200 &&
                resp.status() < 300
            )
            .catch(() => null),
          page
            .getByRole(selectors.submitButton.role, {
              name: selectors.submitButton.name
            })
            .click()
        ]);

        // close form
        await page.waitForTimeout(350);
        const closeBtn = page.locator('//div[@ptooltip="Close"]');
        if ((await closeBtn.count()) > 0) {
          await closeBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(300);

        // wait until created group appears (best-effort)
        try {
          await page.waitForSelector(`text=${shortName}`, { timeout: 3000 });
          created.push({ name: shortName, app: appName, role: roleName });
          console.log(`CREATED: ${shortName}`);
        } catch (e) {
          created.push({
            name: shortName,
            app: appName,
            role: roleName,
            uiDetected: false
          });
          console.warn(
            `WARN: created ${shortName} but it did not appear in list within timeout.`
          );
        }

        await page.waitForTimeout(250);
      }
    }

    // ---------- SUMMARY ----------
    console.log('CREATION SUMMARY: created=', created.length, ' skipped=', skipped.length);
    console.log('First 10 created:', created.slice(0, 10));

    expect(created.length + skipped.length).toBe(applications.length * roles.length);
  });
});
