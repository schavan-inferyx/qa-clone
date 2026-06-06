
import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import os from "node:os";

dotenv.config();

const isCI = !!process.env.CI;

// ---- TIME BOUNDARIES (DOCUMENTED & HONORED) ----
const TEST_TIMEOUT = 100 * 60 * 1000;          // 100 minutes per test
const EXPECT_TIMEOUT = 15 * 60 * 1000;         // polling / waits
const CI_GLOBAL_TIMEOUT = 6 * 60 * 60 * 1000;  // 6 hours max CI run

export default defineConfig({
  // ------------------------------------------------
  // ROOT
  // ------------------------------------------------
  testDir: "./tests",
  outputDir: "test-results",

    globalSetup: "./global-setup.js",

  globalTeardown: "./global-teardown.js",

  // ------------------------------------------------
  // EXECUTION MODEL
  // ------------------------------------------------
  fullyParallel: false,

  workers: isCI
    ? 2
    : process.env.WORKERS
      ? Number(process.env.WORKERS)
      : 4,

  // forbidOnly: isCI,
  retries: 0,

  // ------------------------------------------------
  // DEBUGGING
  // ------------------------------------------------
  slowMo: isCI ? 0 : 800, // 🔥 CRITICAL FIX

  // ------------------------------------------------
  // TIMEOUT STRATEGY
  // ------------------------------------------------
  timeout: TEST_TIMEOUT,
  expect: { timeout: EXPECT_TIMEOUT },
  globalTimeout: isCI ? CI_GLOBAL_TIMEOUT : undefined,

  // ------------------------------------------------
  // REPORTING
  // ------------------------------------------------
  reporter: [
    ["list"],
    ["./reporters/worker-summary-reporter.js"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          ci: isCI,
        },
      },
    ],
  ],

  // ------------------------------------------------
  // SHARED CONTEXT (CI SAFE)
  // ------------------------------------------------
  use: {
    baseURL: process.env.BASE_URL,

    headless: isCI,
    ignoreHTTPSErrors: true,
    strictSelectors: true,

    // 🔥 ARTIFACTS (VIDEO ENABLED)
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // 🔥 GUARANTEED FULL WINDOW IN CI
    viewport: isCI ? { width: 1920, height: 1080 } : null,

    launchOptions: {
      headless: isCI,
      args: isCI
        ? [
            "--window-size=1920,1080",
            "--force-device-scale-factor=1",
            "--disable-dev-shm-usage",
            "--disable-gpu",
          ]
        : ["--start-maximized"],
    },

    // 🔥 DISABLE ANIMATIONS (PrimeNG SAFE)
    contextOptions: {
      reducedMotion: "reduce",
      recordVideo: {
        dir: "test-results/videos",
        size: { width: 1920, height: 1080 },
      },
    },

    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // ------------------------------------------------
  // PROJECTS
  // ------------------------------------------------
  projects: [
    {
      name: "data-engineering",
      testMatch: "**/data-engineering/**/*.spec.js",
      fullyParallel: false,
    },
    {
      name: "administration",
      testMatch: "**/administration/**/*.spec.js",
      fullyParallel: false,
    },
    {
      name: "pipeline",
      testMatch: "**/pipeline/**/*.spec.js",
      fullyParallel: false,
    },

    {
      name: "data-catalog",
      testMatch: "**/data-catalog/**/*.spec.js",
      fullyParallel: false,
    },
  ],
});



