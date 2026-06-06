// // import { compareImagesPercentage } from "./imageCompare.js";
// // import { saveDownloadAs } from "./saveDownload.js";
// // import { Comman } from "../pages/commans/Common.js";

// // export async function captureAndCompareScreenshot(testInfo, page) {
// //   // Create Common object here
// //   const common = new Comman(page);

// //   // Derive test case name from test title
// //   const testId = testInfo.title.split(":")[0].split("spec")[0].trim();
// //   const testCaseName = `${testId}`;

// //   // Trigger screenshot flow
// //   await common.screenshotButton.click();
// //   await common.screenshotNameInput.fill(testCaseName);
// //   await saveDownloadAs(page, common.captureScreenshotButton, testCaseName);

// //   // Compare screenshots and return %
// //   const matchPercentage = await compareImagesPercentage(
// //     `./actualScreenshot/${testCaseName}.png`,
// //     `./expectedScreenshot/${testCaseName}.png`
// //   );

// //   console.log("Screenshot is matched with percentage :",matchPercentage);
  

// //   return { matchPercentage, testCaseName };
// // }
// import { compareImagesPercentage } from "./imageCompare.js";
// import { saveDownloadAs } from "./saveDownload.js";
// import { Comman } from "../pages/commans/Common.js";
// import { allure } from "allure-playwright";  // <-- Import Allure API

// export async function captureAndCompareScreenshot(testInfo, page) {
//   const common = new Comman(page);

//   // Derive test case name
//   const testId = testInfo.title.split(":")[0].split("spec")[0].trim();
//   const testCaseName = `${testId}`;

//   // Trigger screenshot flow
//   await common.screenshotButton.click();
//   await common.screenshotNameInput.fill(testCaseName);
//   await saveDownloadAs(page, common.captureScreenshotButton, testCaseName);

//   // Compare screenshots
//   const matchPercentage = await compareImagesPercentage(
//     `./actualScreenshot/${testCaseName}.png`,
//     `./expectedScreenshot/${testCaseName}.png`
//   );

//   console.log("Screenshot is matched with percentage:", matchPercentage);

//   // ✅ Add as label (shows on top near test name in Allure UI)
//   // allure.label("Match %", `${matchPercentage}%`);

//   // // ✅ Also add as a step (highlighted in test steps)
//   // allure.step(`🖼️ Screenshot matched: ${matchPercentage}%`, async () => {
//   //   // you could also attach files here if needed
//   // });

//     allure.description(`🖼 Screenshot Match Percentage: ${matchPercentage}%`);


//   return { matchPercentage, testCaseName };
// }
import { compareImagesPercentage } from "./imageCompare.js";
import { saveDownloadAs } from "./saveDownload.js";
import { Comman } from "../pages/commans/Common.js";
import { allure } from "allure-playwright";

export async function captureAndCompareScreenshot(testInfo, page) {
  const common = new Comman(page);

  // Derive test case name
  const testId = testInfo.title.split(":")[0].split("spec")[0].trim();
  const testCaseName = `${testId}`;

  // Trigger screenshot flow
  await common.screenshotButton.click();
  await common.screenshotNameInput.fill(testCaseName);
  await saveDownloadAs(page, common.captureScreenshotButton, testCaseName);

  // Compare screenshots
  const matchPercentage = await compareImagesPercentage(
    `./actualScreenshot/${testCaseName}.png`,
    `./expectedScreenshot/${testCaseName}.png`
  );

  console.log("Screenshot is matched with percentage:", matchPercentage);

  allure.description(`🖼 Screenshot Match Percentage: ${matchPercentage}%`);

  return { matchPercentage, testCaseName };
}
