import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";
import { expectedThreshold } from "../../../utils/global-variables.js";
import {captureAndCompareScreenshot} from "../../../utils/screenshotHelper.js"


test.describe("Administration - notification-template", () => {
  test("TC-SAM-0.10.1.0506 : Create", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);
    
  await page.getByRole('link', { name: ' General' }).click();
  await page.getByRole('link', { name: 'Notification Template' }).click();
  await page.locator('#detail-snapshot div').filter({ hasText: 'HomeNotification Template' }).getByRole('button').first().click();
  await page.getByRole('textbox', { name: 'Name *', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name *', exact: true }).fill('alert_template_demo');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('https://dev.inferyx.com/admin/#/login');
  await page.getByRole('textbox', { name: 'Subject' }).press('ControlOrMeta+z');
  await page.getByRole('textbox', { name: 'Subject' }).fill('Alert generated for ${ENTITY_TYPE} ${ENTITY_ID}');
  await page.getByRole('textbox', { name: 'Message' }).click();
  await page.getByRole('textbox', { name: 'Message' }).fill('<br>Please click the link below to see the details.<br><br>${URL}');
  await page.getByRole('textbox', { name: 'Disclaimer' }).click();
  await page.getByRole('textbox', { name: 'Disclaimer' }).dblclick();
  await page.getByRole('textbox', { name: 'Disclaimer' }).fill('This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error please notify the system manager. This message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. If you are not the intended recipient you are notified that disclosing, copying, distributing or taking any action in reliance on the contents of this information is strictly prohibited.');
  await page.getByRole('button', { name: 'Submit' }).click();
  const { matchPercentage, testCaseName } = await captureAndCompareScreenshot(testInfo, page);
  console.log("Screenshot match :", matchPercentage);
  
  expect(matchPercentage,`Screenshot mismatch for ${testCaseName}: Only ${matchPercentage.toFixed(2)}% matched`).toBeGreaterThanOrEqual(expectedThreshold);

});
})