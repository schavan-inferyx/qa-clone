/**
 * Returns the first visible element from a locator that may match multiple elements
 * @param {Locator} locator - Playwright locator that may resolve multiple elements
 * @returns {Locator} - First visible locator
 */
export async function chooseFirstVisibleLocator(locator) {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    if (await locator.nth(i).isVisible()) return locator.nth(i);
  }
  throw new Error('No visible element found for locator: ' + locator);
}
