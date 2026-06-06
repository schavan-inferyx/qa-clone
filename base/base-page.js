import { test } from "@playwright/test";
import commonLayout from "@pages/plus/locators/common-layout";
class BasePage {

  constructor(page) {
    this.page = page
    // this.logger = Logger
    this.locators = commonLayout.login
    this.__wrapAllMethods()
  }


  async login(url, username, password) {
    await this.page.goto(url)
    // this.logger.info(`Logging in as: ${username}`)
    await this.page.locator(this.locators.usernameInput).fill(username)
    await this.page.locator(this.locators.usernameInput).press("Tab")
    await this.page.locator(this.locators.passwordInput).fill(password)
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.locator(this.locators.passwordInput).press("Enter"),
    ])
    await this.waitForInbuiltButtonLoaderToDisapper();
  }

  async loginWorkbench(username, password) {
    await this.page.locator(this.locators.usernameInput).fill(username)
    await this.page.locator(this.locators.usernameInput).press("Tab")
    await this.page.locator(this.locators.passwordInput).fill(password)
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.locator(this.locators.passwordInput).press("Enter"),
    ])
    await this.waitForInbuiltButtonLoaderToDisapper();
  }


  async loginAdmin(username, password) {
    await this.page.locator(this.locators.usernameInput).fill(username)
    await this.page.locator(this.locators.usernameInput).press("Tab")
    await this.page.locator(this.locators.passwordInput).fill(password)
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.locator(this.locators.passwordInput).press("Enter"),
    ])
    await this.waitForInbuiltButtonLoaderToDisapper();
  }

  async selectAppAndRole(common, appName, roleName) {
    if (appName) {
      await common.searchForApplication(appName)
      await common.selectApplication()
      await this.waitForLoader();

    }
    await common.switchRoleInPlusApp(roleName)
    await this.waitForLoader();
    await this.page.waitForLoadState("networkidle")
  }

  async goto(url) {
    // this.logger.info(`Navigating to: ${url}`)
    await this.page.goto(url)
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout)
  }

  async waitForSelector(selector, options = {}) {
    // this.logger.debug(`Waiting for selector: ${selector}`)
    return await this.page.waitForSelector(selector, options)
  }

  async click(selector, options = {}) {
    // this.logger.debug(`Clicking on: ${selector}`)
    await this.page.click(selector, options)
  }

  async fill(selector, value, options = {}) {
    // this.logger.debug(`Filling ${selector} with value`)
    await this.page.fill(selector, value, options)
  }

  async type(selector, text, options = {}) {
    // this.logger.debug(`Typing into ${selector}`)
    await this.page.type(selector, text, options)
  }

  async getText(selector) {
    return await this.page.textContent(selector)
  }

  async isVisible(selector, options = {}) {
    return await this.page.isVisible(selector, options)
  }

  async selectOption(selector, value) {
    // this.logger.debug(`Selecting option ${value} in ${selector}`)
    await this.page.selectOption(selector, value)
  }

  async waitForLoadState(state = "load") {
    await this.page.waitForLoadState(state)
  }

  async screenshot(options = {}) {
    return await this.page.screenshot(options)
  }

  async manualTyping(locator, text, options = {}) {
    const {
      delay = 20,
      clear = true,
      timeout = 1000,
    } = options

    await locator.waitFor({ state: "visible", timeout })


    if (clear) {
      await locator.fill("")
    }

    for (const char of text) {
      await locator.type(char, { delay })
    }
  }

  /**
 * Waits for a JS/Angular loader to fully disappear.
 * Handles visible → hidden → detached cases safely.
 *
 * @param {string} selector - Loader CSS/XPath selector
 * @param {number} timeout - Max wait time (ms)
 */
  async waitForJSLoaderToDisappear(
    selector = ".spinner",
    timeout = 15000
  ) {
    const loader = this.page.locator(selector)
    const start = Date.now()

    while (Date.now() - start < timeout) {
      const count = await loader.count()

      // Loader not in DOM → safe to proceed
      if (count === 0) return

      try {
        // If exists, wait until it is NOT visible
        await loader.first().waitFor({
          state: "hidden",
          timeout: 1000,
        })
        return
      } catch {
        // Loader still visible → retry
      }

      await this.page.waitForTimeout(300)
    }

    // Do NOT fail test – loader timing is flaky by nature
    console.warn(`⚠️ Loader '${selector}' still visible after ${timeout}ms`)
  }


  /**
   * Waits until an element is attached AND visible.
   * Safe for Angular / JS-heavy UIs.
   *
   * @param {string} selector - XPath or CSS selector
   * @param {number} timeout - Max wait time (ms)
   */
  async waitForElementToBeVisible(
    selector,
    timeout = 15000
  ) {
    const element = this.page.locator(selector)
    const start = Date.now()

    while (Date.now() - start < timeout) {
      try {
        if (await element.count()) {
          await element.first().waitFor({
            state: "visible",
            timeout: 1000,
          })
          return
        }
      } catch {
        // Element exists but not visible yet → retry
      }

      await this.page.waitForTimeout(300)
    }

    throw new Error(`Element not visible within ${timeout}ms: ${selector}`)
  }

  async waitForPlusLoaderToDisappear(timeout = 15000) {
    const loader = this.page.locator("//p[normalize-space()='Loading']")
    const start = Date.now()

    while (Date.now() - start < timeout) {
      const count = await loader.count()

      // Loader not in DOM → safe to proceed
      if (count === 0) return

      try {
        // If present, wait until hidden
        await loader.first().waitFor({
          state: "hidden",
          timeout: 3000,
        })
        return
      } catch {
        // Still visible → retry
      }

      await this.page.waitForTimeout(300)
    }

    // Do NOT fail test – loader timing is inherently flaky
    console.warn(`⚠️ Plus loader still visible after ${timeout}ms`)
  }

  async waitForJSListLoadingToDisappear(timeout = 15000) {
    const spinner = this.page.locator("//div[contains(@class,'spinner')]")
    const start = Date.now()

    while (Date.now() - start < timeout) {
      const count = await spinner.count()

      // Spinner not present → safe
      if (count === 0) return

      try {
        // Wait until spinner disappears (hidden OR detached)
        await spinner.first().waitFor({
          state: "detached", // more reliable than hidden for spinners
          timeout: 3000,
        })
        return
      } catch {
        // Still there → retry
      }

      await this.page.waitForTimeout(300)
    }

    // Don't fail – just warn (same philosophy as yours)
    console.warn(`⚠️ JS List loader still visible after ${timeout}ms`)
  }


  // async waitForLoader(timeout = 5000) {
  //   const loader = this.page.locator("#loading-bar .bar, .spinner, .plus-loader") 
  //   const start = Date.now()

  //   while (Date.now() - start < timeout) {
  //     const count = await loader.count()

  //     if (count === 0) return

  //     try {
  //       await loader.first().waitFor({
  //         state: "detached",
  //         timeout: 3000,
  //       })
  //       return
  //     } catch {}

  //     await this.page.waitForTimeout(300)
  //   }

  //   console.warn(`⚠️ Top progress loader still visible after ${timeout}ms`)
  // }

  // async waitForLoader(timeout = 10000) {

  //   const loader = this.page.locator(
  //     "#loading-bar .bar, .spinner, .plus-loader, //p[normalize-space()='Loading']"
  //   );

  //   try {
  //     // Wait until ALL loaders are gone or hidden
  //     await this.page.waitForFunction(
  //       (selectors) => {
  //         const elements = document.querySelectorAll(selectors);
  //         return Array.from(elements).every(el =>
  //           !el || el.offsetParent === null || el.style.visibility === "hidden"
  //         );
  //       },
  //       "#loading-bar .bar, .spinner, .plus-loader, p:has-text('Loading')",
  //       { timeout }
  //     );

  //   } catch (e) {
  //     console.warn(`⚠️ Loader still visible after ${timeout}ms`);
  //   }
  // }

  // async waitForLoader(timeout = 10000) {

  //   const selector = `
  //     #loading-bar .bar,
  //     .spinner,
  //     .plus-loader,
  //     p:has-text("Loading"),
  //     span.p-button-loading-icon.pi-spinner
  //   `;

  //   try {
  //     await this.page.waitForFunction(
  //       (sel) => {
  //         const elements = document.querySelectorAll(sel);

  //         return Array.from(elements).every(el => {
  //           if (!el) return true;

  //           const style = window.getComputedStyle(el);

  //           return (
  //             el.offsetParent === null ||         // not visible
  //             style.visibility === "hidden" ||
  //             style.display === "none" ||
  //             style.opacity === "0"
  //           );
  //         });
  //       },
  //       selector,
  //       { timeout }
  //     );

  //   } catch (e) {
  //     console.warn(`⚠️ Loader still visible after ${timeout}ms`);
  //   }
  // }

  async waitForLoader(timeout = 15000, stableTime = 1000) {

    const selector = `
    #loading-bar .bar,
    .spinner,
    .plus-loader,
    p:has-text("Loading"),
    span.p-button-loading-icon.pi-spinner,
    .pi-spin,
    .p-icon-spin
  `;

    const start = Date.now();
    let lastSeenLoaderTime = Date.now();

    while (Date.now() - start < timeout) {

      const loaders = this.page.locator(selector);
      const count = await loaders.count();

      let anyVisible = false;

      for (let i = 0; i < count; i++) {
        const el = loaders.nth(i);

        if (await el.isVisible()) {
          anyVisible = true;
          lastSeenLoaderTime = Date.now();
          break;
        }
      }

      // ✅ No loader visible for stable duration → safe to proceed
      if (!anyVisible && (Date.now() - lastSeenLoaderTime) > stableTime) {
        return;
      }

      await this.page.waitForTimeout(200);
    }

    console.warn(`⚠️ Loader still unstable after ${timeout}ms`);
  }


  async waitForInbuiltButtonLoaderToDisapper(timeout = 15000) {
    const loader = this.page.locator(
      "//span[contains(@class,'p-button-loading-icon') and contains(@class,'pi-spinner')]"
    )

    const start = Date.now()

    while (Date.now() - start < timeout) {
      const count = await loader.count()

      // Spinner removed from DOM → button is free
      if (count === 0) return

      try {
        // Spinner exists → wait until hidden
        await loader.first().waitFor({
          state: "hidden",
          timeout: 5000,
        })
        return
      } catch {
        // Still spinning → retry
      }

      await this.page.waitForTimeout(500)
    }

    // Intentionally not failing the test
    console.warn(`⚠️ Inbuilt button loader still visible after ${timeout}ms`)
  }


  async safeMenuClick(locator, {
    hover = true,
    waitForLoader = true,
    timeout = 10000,
  } = {}) {

    const menu = this.page.locator(locator).first()
    await menu.waitFor({ state: "visible", timeout: timeout })

    if (hover) {
      await this.page.waitForTimeout(500);
      await menu.hover().catch(() => { })
    }

    try {
      await menu.click({ timeout: 3000 })
    } catch {
      await menu.click({ force: true })
    }

    if (waitForLoader) {
      await this.waitForPlusLoaderToDisappear()
    }
  }


  async searchInListTable(name) {
    await this.waitForPlusLoaderToDisappear();
    const searchBox = this.page.locator("//input[@placeholder='Search Keyword']")
    await this.manualTyping(searchBox, name, {
      delay: 30,
      clear: true,
    })
    await this.page.waitForLoadState("networkidle").catch(() => { })
  }


  //   /* =====================================================
  // * Search by UUID (Generic)
  // * ===================================================== */
  //   async searchByUUID(uuid, options = {}) {
  //     // Using dynamic import to avoid circular dependency
  //     const { CommanLayout } = await import("../pages/plus/class/common-layout.js")

  //     this.waitForPlusLoaderToDisappear();
  //     const commonLayoutPage = new CommanLayout(this.page)
  //     await commonLayoutPage.openColumnChooser();
  //     await commonLayoutPage.selectAllColumns();
  //     await commonLayoutPage.closeColumnChooser();
  //     if (!uuid) {
  //       throw new Error("UUID is required for search");
  //     }

  //     const searchInput = await this.page.locator(
  //       '.p-datatable-header input[placeholder="Search Keyword"]'
  //     );

  //     await this.manualTyping(searchInput, uuid, {
  //       delay: options.delay ?? 20,
  //     });

  //   }


  __wrapAllMethods() {


    const prettify = (name) =>
      name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase())

    const formatArgs = (args) => {
      if (!args || !args.length) return ""

      const values = args
        .map(a =>
          typeof a === "object"
            ? JSON.stringify(a, null, 2)
            : String(a)
        )
        .join(", ")

      return ` → ${values}`
    }

    const proto = Object.getPrototypeOf(this)

    for (const methodName of Object.getOwnPropertyNames(proto)) {

      if (methodName === "constructor") continue
      if (methodName.startsWith("_")) continue

      const original = this[methodName]

      if (typeof original !== "function") continue

      this[methodName] = async (...args) => {

        const stepName =
          `${prettify(methodName)}${formatArgs(args)}`

        return await test.step(stepName, async () => {
          return await original.apply(this, args)
        })

      }

    }

  }



}

export { BasePage }
