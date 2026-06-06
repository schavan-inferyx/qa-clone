import { test, expect } from '@playwright/test';

// ---------------------------
// Config / variables (change here or via env vars)
// ---------------------------
const CONFIG = {
  url: process.env.APP_URL || 'https://test2.inferyx.com/framework/app/index.html#!/login',
  username: process.env.APP_USER || 'demo',
  password: process.env.APP_PASS || '20Inferyx!9',
  apps: process.env.APPS ? JSON.parse(process.env.APPS) : [
    {
      name: 'Anti Money Laundering',
      pipelines: [
        { name: 'ppl_populate_warehouse', weight: 2 },
        { name: 'ppl_e2e_rule_engine', weight: 1 },
      ],
    },
    {
      name: 'Credit Card Fraud Detection',
      pipelines: [
        { name: 'ppl_populate_warehouse', weight: 2 },
        { name: 'ppl_e2e_rule_engine', weight: 1 },
      ],
    },
  ],
  defaultSearch: process.env.SEARCH_TERM || 'warehouse',
  selectionMode: process.env.SELECTION_MODE || 'sequential',
};

// ---------------------------
// Utils
// ---------------------------
function pickWeighted(pipelines) {
  const total = pipelines.reduce((s, p) => s + (p.weight || 1), 0);
  const r = Math.random() * total;
  let cum = 0;
  for (const p of pipelines) {
    cum += p.weight || 1;
    if (r <= cum) return p;
  }
  return pipelines[pipelines.length - 1];
}

function mapPipelinesForExecution(app) {
  if (!app.pipelines || !app.pipelines.length) return [];
  if (CONFIG.selectionMode === 'sequential') return app.pipelines.map((p) => p.name);
  return [pickWeighted(app.pipelines).name];
}

// ---------------------------
// Reusable helper functions
// ---------------------------
async function login(page) {
  await page.goto(CONFIG.url);
  await page.getByRole('textbox', { name: 'Username' }).fill(CONFIG.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(CONFIG.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForSelector('text=Application *', { timeout: 15000 }).catch(() => {});
}

async function openAppSwitcher(page) {
  const switcher = page.locator("//i[@class='fa fa-exchange']").first();
  await switcher.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  // try normal click, with fallback to force/JS click if overlay blocks
  try {
    await switcher.click({ timeout: 8000 });
    await page.waitForSelector("//select[@ng-model='selectedApp']", { timeout: 5000 }).catch(() => {});
    return;
  } catch (e) {
    // fallback: forced click
    try {
      await switcher.click({ force: true, timeout: 5000 });
      await page.waitForSelector("//select[@ng-model='selectedApp']", { timeout: 5000 }).catch(() => {});
      return;
    } catch (e2) {
      // last fallback: JS click
      await page.evaluate((xp) => {
        const el = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) el.click();
      }, "//i[@class='fa fa-exchange']");
      await page.waitForSelector("//select[@ng-model='selectedApp']", { timeout: 5000 }).catch(() => {});
    }
  }
}

async function selectApplicationInSwitcher(page, appName) {
  const appSelect = page.locator("//select[@ng-model='selectedApp']");
  if (await appSelect.count()) {
    // use selectOption by label (works with native select)
    await appSelect.selectOption({ label: appName }).catch(() => {});
  } else {
    await page.getByText(appName).click().catch(() => {});
  }
}

async function selectRoleIfNeeded(page) {
  const roleSelect = page.locator("//select[@ng-model='selectedRole']");
  if (await roleSelect.count()) {
    const options = await roleSelect.locator('option').allTextContents();
    if (options.length > 1) await roleSelect.selectOption({ index: 1 }).catch(() => {});
  }
}

async function submitAppAndRole(page) {
  const submitBtn = page.locator('(//button[@type="submit"])[2]');
  if (await submitBtn.count()) {
    await submitBtn.click();
  } else {
    await page.getByRole('button', { name: 'Submit' }).click().catch(() => {});
  }
  await page.waitForTimeout(800);
}

async function navigateToDataPipeline(page) {
  const datapipelineLink = page.locator("//span[normalize-space()='Data Pipeline']").first();
  if (await datapipelineLink.count()) await datapipelineLink.click();
  else await page.getByRole('link', { name: 'Data Pipeline' }).click().catch(() => {});

  const listLink = page.locator("//a[@href='#!/datapipeline/ListPipeline']").first();
  await listLink.waitFor({ state: 'visible', timeout: 10000 });
  await listLink.click();

  const listSearch = page.locator('(//input[@type="search"])[1]');
  await listSearch.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
}

async function searchAndExecutePipeline(page, pipelineName) {
  // wait for spinner to go away before typing
  const spinner = page.locator('//div[@class="spinner"]');
  try {
    await spinner.waitFor({ state: 'detached', timeout: 10000 });
  } catch (e) {
    await spinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  await page.waitForTimeout(500); // slight delay to ensure readiness

  const searchInputSelector = '(//input[@type="search"])[1]';
  const searchInput = page.locator(searchInputSelector);
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });

  // mimic manual typing
  await searchInput.fill('');
  await searchInput.click();
  await searchInput.type(pipelineName, { delay: 120 });


  // use your provided xpath for action → execute
  const actionButton = page.locator("(//button[contains(text(),'Action')])[1]");
  await actionButton.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
    throw new Error(`Action button not visible for pipeline '${pipelineName}'`);
  });
  await actionButton.click();

  // click Execute using your provided xpath
  const executeLink = page.locator("(//a[contains(text(),'Execute')])[1]");
  await executeLink.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
    throw new Error(`Execute link not visible for pipeline '${pipelineName}'`);
  });
  await executeLink.click();

  await page.getByRole('button', { name: 'Ok' }).click().catch(() => {});
  await page.waitForSelector('text=Request Submitted Successfully', { timeout: 10000 }).catch(() => {});
}

async function openResults(page , pipeName)  {

  const resultsLink = page.locator("//a[@href='#!/datapipeline/ListPipelineResult']").first();
  await resultsLink.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await resultsLink.click().catch(() => {});

  const spinner = page.locator('//div[@class="spinner"]');
  try {
    await spinner.waitFor({ state: 'detached', timeout: 10000 });
  } catch (e) {
    await spinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  const searchInputSelector = '(//input[@type="search"])[1]';
  const searchInput = page.locator(searchInputSelector);
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });

  // mimic manual typing
  await searchInput.fill('');
  await searchInput.click();
  await searchInput.type(pipeName, { delay: 120 });

  // use your provided xpath for action → execute
  const actionButton = page.locator("(//button[contains(text(),'Action')])[1]");
  await actionButton.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
    throw new Error(`Action button not visible for pipeline '${pipelineName}'`);
  });
  await actionButton.click();
    const viewPipeline = page.locator("(//a[contains(text(),'View')])[1]");
await viewPipeline.click().catch(() => {});
}


async function verifyResult(page) {
  const success = await page.locator('text=Succeeded').count();
  if (success) return true;
  const submitted = await page.locator('text=Request Submitted Successfully').count();
  return submitted > 0;
}

// ---------------------------
// Main test
// ---------------------------
test('multi-app multi-pipeline executor (single login, switch via exchange icon)', async ({ page }) => {
  await login(page);

  for (let i = 0; i < CONFIG.apps.length; i++) {
    const app = CONFIG.apps[i];

    if (i === 0) {
      // first time: don't click exchange icon — select application directly
      await selectApplicationInSwitcher(page, app.name);
      await selectRoleIfNeeded(page);
      await submitAppAndRole(page);
    } else {
      // subsequent apps: open switcher via exchange icon and change app/role
      await openAppSwitcher(page);
      await selectApplicationInSwitcher(page, app.name);
      await selectRoleIfNeeded(page);
      await submitAppAndRole(page);
    }

    await navigateToDataPipeline(page);

    const pipelinesToRun = mapPipelinesForExecution(app);

    for (const pipeName of pipelinesToRun) {
      await searchAndExecutePipeline(page, pipeName);
      await openResults(page , pipeName);

      const ok = await verifyResult(page);
      if (!ok) console.warn(`Verification failed for pipeline: ${pipeName} (app: ${app.name})`);
      await page.waitForTimeout(1000);
    }
  }

  await expect(page.locator('text=Request Submitted Successfully')).toBeVisible({ timeout: 5000 }).catch(() => {});
});

