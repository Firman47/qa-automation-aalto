/**
 * Aalto Dentist Portal — Auth Helper Utilities
 *
 * Reusable utility functions untuk auth test modules.
 * - Request counting (duplicate request detection)
 * - Navigation waits
 * - Cookie/session helpers
 * - Token extraction
 */
import { type Page, type Request } from '@playwright/test';

/**
 * Count API requests matching a URL pattern + method during an action.
 * Returns the count — assertion is caller's responsibility.
 */
export async function countApiCalls(
  page: Page,
  urlPattern: string,
  method: string,
  action: () => Promise<void>,
): Promise<number> {
  let apiCallCount = 0;
  const handler = (req: Request) => {
    if (req.url().includes(urlPattern) && req.method() === method) {
      apiCallCount++;
    }
  };
  page.on('request', handler);
  await action();
  await page.waitForTimeout(50); // microtask drain — minimal, unavoidable
  page.off('request', handler);
  return apiCallCount;
}

/**
 * Assert that NO API call matching a pattern was made during an action.
 * Throws if any matching request was sent.
 */
export async function assertNoApiCall(
  page: Page,
  urlPattern: string,
  method: string,
  action: () => Promise<void>,
): Promise<void> {
  const count = await countApiCalls(page, urlPattern, method, action);
  if (count > 0) {
    throw new Error(
      `Expected NO API calls to ${urlPattern} [${method}], but ${count} were sent. ` +
      'Client-side validation should prevent network requests.',
    );
  }
}

/**
 * Wait for URL matching a pattern with configurable timeout.
 */
export async function waitForNavigation(page: Page, pattern: RegExp, timeout = 10000): Promise<void> {
  await page.waitForURL(pattern, { timeout });
}

/**
 * Get a specific cookie value by name.
 */
export async function getCookieValue(page: Page, name: string): Promise<string | undefined> {
  const cookies = await page.context().cookies();
  return cookies.find((c) => c.name === name)?.value;
}

/**
 * Check if a cookie exists and is not marked as deleted.
 */
export async function isCookiePresent(page: Page, name: string): Promise<boolean> {
  const value = await getCookieValue(page, name);
  return value !== undefined && value !== '' && value !== 'deleted';
}
