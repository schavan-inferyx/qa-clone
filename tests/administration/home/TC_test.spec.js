const { test, expect } = require('@playwright/test');
const { jsTablePlaywright } = require('../../../utils/table-util-js');

test('find row by name and click view if status is STARTING', async ({ page }) => {
  
  await page.goto('https://test2.inferyx.com/framework/app/index.html#!/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('demo');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('20Inferyx!9');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: ' Data Pipeline' }).click();
  await page.getByRole('link', { name: 'Results 11' }).click();

  
  const result = await jsTablePlaywright(page,
    { Name: 'rule_analysis' },             // row selector
    { Status: 'Running' },                 // statusCondition (we'll check it matches)
    { Action: 'View' },                    // action to perform
    { requireStatusEqualsBeforeAction: true, timeoutMs: 30000 } // options
  );
  expect(result.pass).toBe(true);
});
