
import fs from "fs";
import { PNG } from "pngjs";
// import sharp from "sharp";

export async function compareImagesPercentage(actualPath, expectedPath) {
  // ✅ Lazy import pixelmatch and sharp
  const { default: pixelmatch } = await import("pixelmatch");
  const { default: sharp } = await import("sharp");

  // ✅ Read actual image (baseline)
  const actual = PNG.sync.read(fs.readFileSync(actualPath));

  // ✅ Read expected image (runtime)
  let expectedBuffer = fs.readFileSync(expectedPath);
  let expected = PNG.sync.read(expectedBuffer);

  // ✅ If sizes differ → resize expected image to match actual image
  if (expected.width !== actual.width || expected.height !== actual.height) {
    console.log(
      `⚠️ Resizing expected image: ${expectedPath} from ${expected.width}x${expected.height} → ${actual.width}x${actual.height}`
    );

    const resizedBuffer = await sharp(expectedBuffer)
      .resize(actual.width, actual.height)
      .toBuffer(); // resize in memory only

    expectedBuffer = resizedBuffer;
    expected = PNG.sync.read(resizedBuffer);
  }

  const { width, height } = actual;

  // ✅ Compare with pixelmatch
  const diffPixels = pixelmatch(
    actual.data,
    expected.data,
    null,
    width,
    height,
    {
      threshold: 0.2,
      includeAA: true,
    }
  );

  const totalPixels = width * height;
  const matchedPixels = totalPixels - diffPixels;
  const matchPercentage = (matchedPixels / totalPixels) * 100;

  return matchPercentage; // ✅ return only matchPercentage
}
