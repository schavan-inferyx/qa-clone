import path from "path"
import fs from "fs"
import { waitForSpinnerToDisappearInButton } from "./tableUtils"

function getRuntimeScreenshotPath() {
  const cwd = process.cwd()
  const runtimeDir = path.join(cwd, "expectedScreenshot")

  if (!fs.existsSync(runtimeDir)) {
    fs.mkdirSync(runtimeDir, { recursive: true })
  }

  return runtimeDir
}

// export async function saveDownloadAs(page, locator, fileName) {
//   const downloadPath = getRuntimeScreenshotPath()

//   // Ensure folder exists
//   if (!fs.existsSync(downloadPath)) {
//     fs.mkdirSync(downloadPath, { recursive: true })
//   }

//   // await page.waitForSelector('spinnericon.p-button-loading-icon', { state: 'hidden', timeout: 5000 });



//   // Start waiting for download before click
//   const downloadPromise = await page.waitForEvent("download")
//   // Trigger the download
//   await locator.click()
//   await waitForSpinnerToDisappearInButton(page)


//   // Wait for the download
//   const download = await downloadPromise

//   // Auto-detect file extension if not provided
//   const suggestedName = download.suggestedFilename()
//   const ext = path.extname(suggestedName)
//   const finalName = fileName.endsWith(ext) ? fileName : fileName + ext

//   const targetPath = path.join(downloadPath, finalName)
//   await download.saveAs(targetPath)
//   console.log(`Download saved to: ${targetPath}`)
// }


export async function saveDownloadAs(page, locator, fileName) {
  const downloadPath = getRuntimeScreenshotPath();

  // Ensure folder exists
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  const maxRetries = 3;
  let download;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`Attempt ${attempt}: Trying to trigger download...`);

    try {
      // Start listening for download before clicking
      const downloadPromise = page.waitForEvent("download");

      // Click the download button
      await locator.click({ timeout: 5000 });

      // Wait for spinner to disappear if applicable
      await waitForSpinnerToDisappearInButton(page);

      // Wait for download event to resolve (with timeout safeguard)
      download = await Promise.race([
        downloadPromise,
        page.waitForTimeout(4000).then(() => null), // if no event, go to next retry
      ]);

      if (download) {
        console.log("✅ Download triggered successfully!");
        break;
      } else {
        console.warn("⚠️ Download not triggered, retrying...");
      }
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
    }

    // Wait briefly before retrying
    if (attempt < maxRetries) {
      await page.waitForTimeout(2000);
    }
  }

  if (!download) {
    throw new Error(`❌ Failed to trigger download after ${maxRetries} attempts`);
  }

  // Determine correct file extension
  const suggestedName = download.suggestedFilename();
  const ext = path.extname(suggestedName);
  const finalName = fileName.endsWith(ext) ? fileName : fileName + ext;

  const targetPath = path.join(downloadPath, finalName);

  await download.saveAs(targetPath);
  console.log(`✅ Download saved to: ${targetPath}`);
}