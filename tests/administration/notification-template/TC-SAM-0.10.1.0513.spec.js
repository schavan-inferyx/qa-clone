import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";
import { expectedThreshold } from "../../../utils/global-variables.js";
import {captureAndCompareScreenshot} from "../../../utils/screenshotHelper.js"


test.describe("Administration - notification-template", () => {
  test("TC-SAM-0.10.1.0513 : Clone", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);
    
  await page.getByRole('link', { name: ' General' }).click();
  await page.getByRole('link', { name: 'Notification Template' }).click();
  await page.getByRole('textbox', { name: 'Search Keyword' }).click();
  await page.getByRole('textbox', { name: 'Search Keyword' }).fill('alert_template_demo');
 // await page.getByRole('button', { name: 'Action' }).click();
  await page.waitForSelector('(//button[@label="Action"][1])[1]')
  await page.hover('(//button[@label="Action"][1])[1]');
  await page.locator('(//button[@label="Action"][1])[1]').click();
  await page.getByText('Clone').click();
  await page.getByRole('button', { name: 'Ok' }).click();
  const { matchPercentage, testCaseName } = await captureAndCompareScreenshot(testInfo, page);
    console.log("Screenshot match :", matchPercentage);
    
    expect(matchPercentage,`Screenshot mismatch for ${testCaseName}: Only ${matchPercentage.toFixed(2)}% matched`).toBeGreaterThanOrEqual(expectedThreshold);

  });
})