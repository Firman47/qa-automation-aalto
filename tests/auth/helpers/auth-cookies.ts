/**
 * Aalto Dentist Portal — Cookie & Session Validation Helpers
 *
 * Reusable assertions dan utilities untuk:
 * - Cookie presence/absence checks
 * - Session persistence verification
 * - Token extraction
 */
import { expect, type Page } from '@playwright/test';

/**
 * Get the value of a specific cookie by name.
 */
export async function getCookieValue(page: Page, name: string): Promise<string | undefined> {
  const cookies = await page.context().cookies();
  return cookies.find((c) => c.name === name)?.value;
}

/**
 * Get all cookies as a key-value map.
 */
export async function getAllCookies(page: Page): Promise<Record<string, string>> {
  const cookies = await page.context().cookies();
  return cookies.reduce(
    (acc, c) => {
      acc[c.name] = c.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Assert that a cookie exists and is not empty/deleted.
 */
export async function assertCookiePresent(page: Page, name: string): Promise<string> {
  const value = await getCookieValue(page, name);
  expect(
    value,
    `Expected cookie "${name}" to be present, but it was ${value === undefined ? 'undefined' : value === '' ? 'empty' : value === 'deleted' ? 'deleted' : 'found'}`,
  ).toBeDefined();
  expect(value).not.toBe('');
  expect(value).not.toBe('deleted');
  return value!;
}

/**
 * Assert that a cookie is absent (undefined, empty, or "deleted").
 */
export async function assertCookieAbsent(page: Page, name: string): Promise<void> {
  const value = await getCookieValue(page, name);
  const isAbsent = value === undefined || value === '' || value === 'deleted';
  expect(
    isAbsent,
    `Expected cookie "${name}" to be absent, but found value: "${value}"`,
  ).toBe(true);
}

/**
 * Assert that the access_token cookie is present (logged in).
 */
export async function assertAccessTokenPresent(page: Page): Promise<string> {
  return assertCookiePresent(page, 'access_token');
}

/**
 * Assert that the access_token cookie is absent (logged out).
 */
export async function assertAccessTokenAbsent(page: Page): Promise<void> {
  await assertCookieAbsent(page, 'access_token');
}

/**
 * Clear all cookies for the current page context.
 */
export async function clearAllCookies(page: Page): Promise<void> {
  await page.context().clearCookies();
}

/**
 * Verify session persistence across page reload.
 * Asserts that the access_token cookie survives a page reload.
 */
export async function verifySessionPersists(page: Page): Promise<void> {
  const beforeToken = await assertAccessTokenPresent(page);

  // Reload the page
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Check token still exists after reload
  const afterToken = await assertAccessTokenPresent(page);
  expect(
    afterToken,
    'Session should persist after page reload — access_token cookie should remain',
  ).toBe(beforeToken);
}
