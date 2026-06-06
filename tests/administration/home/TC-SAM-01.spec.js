import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";
import { expectedThreshold } from "../../../utils/global-variables.js";
import { captureAndCompareScreenshot } from "../../../utils/screenshotHelper.js";

test.describe("Administration - Home", () => {
  test("TC-SAM-01 : Verify home tabs and Ask Inferyx chatbot are visible as expected", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);

    // ✅ Verify Recents -> Recent Searches tab
    await page.getByRole("button", { name: " Recents" }).click();
    await expect(page.getByRole("tab", { name: "Recent Searches" })).toBeVisible();

    // 📸 Capture screenshot on Recents tab
    // const { matchPercentage, testCaseName } = await captureAndCompareScreenshot(testInfo, page);
    // console.log("Screenshot match (Recents):", matchPercentage);

    // expect(
    //   matchPercentage,
    //   `Screenshot mismatch for ${testCaseName}: Only ${matchPercentage.toFixed(2)}% matched`
    // ).toBeGreaterThanOrEqual(expectedThreshold);

    // ✅ Verify Favorites -> Favorites tab
    await page.getByRole("button", { name: " Favorites" }).click();
    await expect(page.getByRole("tab", { name: "Favorites" })).toBeVisible();

    // ✅ Verify Quick Links -> Quick Links tab
    await page.getByRole("button", { name: " Quick Links" }).click();
    await expect(page.getByRole("tab", { name: "Quick Links" })).toBeVisible();

    // ✅ Verify Ask Inferyx -> Chatbot visible
    await page.getByRole("button", { name: " Ask Inferyx" }).click();
    await expect(
      page.getByRole("heading", { name: "Inferyx AI Chatbot", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Ask anything..." })).toBeEnabled();
  });
});
