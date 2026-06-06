import { test as base, expect } from "@playwright/test";
import path from "path";
import { Comman } from "@common/Common.js";
import { generateSequenceFile } from "@utils/generateSequenceFile.js";
import { SessionManager } from "@utils/sessionManager.js";
import { ProjectManager } from "@utils/projectManager.js";
import { API_THRESHOLD, ApiLogger } from "@utils/apiLogger.js";
import { MongoService } from "@db/mongo.js";
import { PostgresService } from "@db/postgres-service.js";
import { MySQLService } from "@db/mysql-service.js";
import { SnowflakeService } from "@db/snowflake-service.js";
import { IcebergService } from "@db/iceberge.js";
import { writeDuplicateApis } from "@api/duplicateApiExcel.js";
import { allure } from "allure-playwright";

/* =========================================================
   🔒 LOGIN VALIDATION
   ========================================================= */
async function assertLoggedIn(page, projectConfig) {
  if (!projectConfig.waitForUrl) {
    throw new Error(
      `waitForUrl not defined for project ${projectConfig.name}`
    );
  }

  try {
    await page.waitForLoadState("networkidle");

    await page.waitForURL(projectConfig.waitForUrl, {
      timeout: 20_000,
    });
  } catch {
    throw new Error(
      `❌ AUTHENTICATION FAILED for project "${projectConfig.name}"\n` +
      `Expected route: ${projectConfig.waitForUrl}\n` +
      `Actual URL: ${page.url()}`
    );
  }
}

/* =========================================================
   RUN-LEVEL SESSION CACHE (PER WORKER)
   ========================================================= */

// workerIndex -> Set<projectName>
const validatedProjectsByWorker = new Map();

/* =========================================================
   TEST BASE
   ========================================================= */

export const test = base.extend({

  postgres: async ({ }, use) => {

    const pg = new PostgresService();

    await pg.connect();

    await use(pg);

    await pg.close();
  },

  mongo: async ({ }, use) => {

    const mongo = new MongoService();

    await mongo.connect();

    if (!mongo.isConnected)
      throw new Error("Mongo connection failed");

    await use(mongo);

    await mongo.close();
  },
  authentication: async ({ browser }, use, testInfo) => {
    // -----------------------------
    // WORKER CONTEXT
    // -----------------------------
    const workerIndex = testInfo.workerIndex;

    if (!validatedProjectsByWorker.has(workerIndex)) {
      validatedProjectsByWorker.set(workerIndex, new Set());
    }

    const validatedProjects =
      validatedProjectsByWorker.get(workerIndex);

    const sessionManager = new SessionManager(workerIndex);
    const projectManager = new ProjectManager();

    const dirPath = path.dirname(testInfo.file);
    generateSequenceFile(dirPath, testInfo);

    const projectConfig = projectManager.detectProject(testInfo.file);
    const module = projectManager.detectModule(testInfo.file);
    const runLevel = projectManager.getRunLevel(testInfo.file);

    /* =========================================================
   ALLURE SUITE STRUCTURE
   ========================================================= */

    await allure.parentSuite(projectConfig.name);
    await allure.suite(module);
    await allure.subSuite(path.basename(testInfo.file));

    const testCaseId =
      testInfo.title.match(/TC-[\w.-]+/)?.[0] || "unknown";

    /* =========================================================
   ALLURE SEVERITY FROM TAGS
  ========================================================= */

    const title = testInfo.title.toLowerCase();

    if (title.includes("@smoke")) {
      await allure.severity("critical");
    }
    else if (title.includes("@create")) {
      await allure.severity("blocker");
    }
    else if (title.includes("@delete")) {
      await allure.severity("normal");
    }
    else if (title.includes("@edit")) {
      await allure.severity("normal");
    }
    else if (title.includes("@view")) {
      await allure.severity("minor");
    }

    console.log(
      `🎯 Running ${runLevel} test for project: ${projectConfig.name}, module: ${module}, worker: ${workerIndex}`
    );

    // -----------------------------
    // RESOLVE URLS
    // -----------------------------
    const serverUrl = projectManager.getServerUrl(
      projectConfig.server
    );
    const loginUrl = `${serverUrl}${projectConfig.loginPath}`;
    const baseUrl = `${serverUrl}${projectConfig.basePath}`;

    const { username, password } = projectConfig.credentials;

    if (!username || !password) {
      throw new Error(
        `Missing credentials for project ${projectConfig.name}`
      );
    }

    let context;

    /* =========================================================
       SESSION ESTABLISHMENT
       ========================================================= */

    // 1️⃣ Product session exists
    if (sessionManager.hasProductSession(projectConfig.name)) {
      context = await browser.newContext({
        storageState: sessionManager.getProductSessionPath(
          projectConfig.name
        ),
        ignoreHTTPSErrors: true,
      });
    }

    // 2️⃣ Auth session exists → enter product
    else if (sessionManager.hasAuthSession()) {
      context = await browser.newContext({
        storageState: sessionManager.getAuthSessionPath(),
        ignoreHTTPSErrors: true,
      });

      const page = await context.newPage();
      await page.goto(baseUrl);

      // Validate only once per worker+project
      if (!validatedProjects.has(projectConfig.name)) {
        await assertLoggedIn(page, projectConfig);
        validatedProjects.add(projectConfig.name);
      }

      await sessionManager.saveProductSession(
        projectConfig.name,
        await context.storageState()
      );

      await page.close();
    }

    // 3️⃣ No auth → full login
    else {
      const loginContext = await browser.newContext({
        ignoreHTTPSErrors: true,
      });

      const loginPage = await loginContext.newPage();
      const login = new Comman(loginPage);

      await loginPage.goto(loginUrl);
      await login.usernameInput.fill(username);
      await login.passwordInput.fill(password);
      await login.loginButton.click();

      await assertLoggedIn(loginPage, projectConfig);

      await sessionManager.saveAuthSession(
        await loginContext.storageState()
      );

      await loginPage.close();
      await loginContext.close();

      context = await browser.newContext({
        storageState: sessionManager.getAuthSessionPath(),
        ignoreHTTPSErrors: true,
      });

      const page = await context.newPage();
      await page.goto(baseUrl);

      validatedProjects.add(projectConfig.name);

      await sessionManager.saveProductSession(
        projectConfig.name,
        await context.storageState()
      );

      await page.close();
    }

    /* =========================================================
       TEST PAGE (NO MORE VALIDATION)
       ========================================================= */

    const page = await context.newPage();
    await page.goto(baseUrl);

    /* =========================================================
       API LOGGER
       ========================================================= */

    const apiLogger = new ApiLogger(
      projectConfig.name,
      module,
      testCaseId
    );
    apiLogger.attachTo(page);

    /* =========================================================
       RUN TEST
       ========================================================= */

    await use(page);

    /* =========================================================
       UI ERROR CHECK
       ========================================================= */

    const errors = page.locator(".p-error");
    const errorCount = await errors.count();

    if (errorCount > 0) {
      const messages = await errors.allInnerTexts();
      expect(
        messages.length,
        `UI errors detected:\n${messages.join("\n")}`
      ).toBe(0);
    }

    /* =========================================================
       API VALIDATION
       ========================================================= */


    // await apiLogger.saveLogs();
    // const slowCalls = apiLogger.getSlowCalls();

    // if (slowCalls.length > 0) {
    //   const table = slowCalls
    //     .map(
    //       c =>
    //         `❌ | ${projectConfig.name} | ${module} | ${testCaseId} | ${c.method} ${c.url} | ${c.status} | ${c.duration}ms`
    //     )
    //     .join("\n");

    //   await testInfo.attach(
    //     `Slow API Calls (> ${API_THRESHOLD}ms)`,
    //     {
    //       body: table,
    //       contentType: "text/plain",
    //     }
    //   );

    //   throw new Error(
    //     `Test failed due to ${slowCalls.length} slow API call(s)`
    //   );
    // }




    /* =========================================================
       DUPLICATE API DETECTION
       ========================================================= */

    // const duplicateCalls = apiLogger.getDuplicateCalls();

    // if (duplicateCalls.length > 0) {

    //   const rows = duplicateCalls.map(d => ({
    //     project: projectConfig.name,
    //     module: module,
    //     spec: path.basename(testInfo.file),
    //     tc: testCaseId,
    //     test: testInfo.title,
    //     api: d.api,
    //     queries: d.queries,
    //     count: d.count
    //   }));

    //   await writeDuplicateApis(rows);
    // }

    await page.close();
    await context.close();
  },

  iceberg: async ({ }, use) => {

    const iceberg =
      new IcebergService();

    await iceberg.connect();

    if (!iceberg.isConnected)
      throw new Error(
        "Iceberg connection failed"
      );

    try {

      await use(iceberg);

    }
    finally {

      await iceberg.close();
    }
  },

  snowflake: async ({ }, use) => {

    const snowflake =
      new SnowflakeService();

    await snowflake.connect();

    try {

      await use(snowflake);

    }
    finally {

      await snowflake.close();
    }
  },

  mysql: async ({ }, use) => {

    const mysql =
      new MySQLService();

    await mysql.connect();

    try {

      await use(mysql);

    }
    finally {

      await mysql.close();
    }
  }


});

export { expect };

