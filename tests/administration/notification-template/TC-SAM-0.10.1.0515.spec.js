import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";
import { expectedThreshold } from "../../../utils/global-variables.js";
import {captureAndCompareScreenshot} from "../../../utils/screenshotHelper.js"


test.describe("Administration - notification-template", () => {
  test("TC-SAM-0.10.1.0515 : Filter", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);
    
  await page.getByRole('link', { name: ' General' }).click();
  await page.getByRole('link', { name: 'Notification Template' }).click();
  await page.locator('#detail-snapshot div').filter({ hasText: 'HomeNotification Template' }).getByRole('button').nth(1).click();
  await page.locator('[data-test-id="dropdown_search_list_1"]').getByRole('combobox', { name: '-Select-' }).click();
  await page.getByRole('searchbox').fill('alert_template_demo');
  await page.locator('[data-test-id="dropdown_search_list_1"]').getByText('alert_template_demo').click();
  await page.locator('[data-test-id="dropdown_search_list_7"]').getByRole('button', { name: 'dropdown trigger' }).click();
  await page.getByRole('option', { name: 'YES' }).click();
  await page.locator('[data-test-id="dropdown_search_list_8"]').getByRole('button', { name: 'dropdown trigger' }).click();
  await page.getByRole('option', { name: 'ALL' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  const { matchPercentage, testCaseName } = await captureAndCompareScreenshot(testInfo, page);
    console.log("Screenshot match :", matchPercentage);
    
    expect(matchPercentage,`Screenshot mismatch for ${testCaseName}: Only ${matchPercentage.toFixed(2)}% matched`).toBeGreaterThanOrEqual(expectedThreshold);

  });
})