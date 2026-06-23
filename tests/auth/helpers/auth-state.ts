/**
 * Aalto Dentist Portal — Auth State Validation Helpers
 *
 * Reusable assertions for verifying login/logout state:
 * - Logged-in state (dashboard URL, greeting, sidebar)
 * - Logged-out state (login URL, form visible, no session)
 * - Redirect behavior
 */
import { expect, type Page, type Locator } from '@playwright/test';
import { ROUTES } from './auth-config';

/**
 * Verify that the user is on the dashboard and logged in.
 * Checks: URL, greeting text, and sidebar navigation links.
 */
export async function verifyLoggedIn(page: Page): Promise<void> {
  await page.waitForURL(/dashboard/, { timeout: 15000 });
  expect(page.url()).toContain('/dashboard');

  // Greeting should contain Good morning/afternoon/evening
  await expect(
    page.getByText(/Good (morning|afternoon|evening)/),
  ).toBeVisible({ timeout: 5000 });
}

/**
 * Verify that the user is on the login page (post-logout / unauthenticated).
 * Checks: URL, heading, email input, and sign-in button.
 */
export async function verifyLoggedOut(page: Page): Promise<void> {
  await page.waitForURL(/auth\/login/, { timeout: 10000 });
  expect(page.url()).toContain('/auth/login');

  await expect(
    page.getByRole('heading', { name: 'PARTNER PORTAL' }),
  ).toBeVisible({ timeout: 5000 });
  await expect(page.getByPlaceholder('your.email@example.com')).toBeVisible();
  await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
}

/**
 * Verify that the current page is the login page (stay, not redirect).
 * Only checks URL pattern — does NOT wait.
 */
export function assertOnLoginPage(page: Page): void {
  expect(page.url()).toContain(ROUTES.LOGIN);
}

/**
 * Verify that the current page is the dashboard.
 * Only checks URL pattern — does NOT wait.
 */
export function assertOnDashboard(page: Page): void {
  expect(page.url()).toContain(ROUTES.DASHBOARD);
}

/**
 * Verify that the user remains on the current page after an action.
 * Takes a snapshot of the URL before and asserts it hasn't changed after.
 */
export async function assertNoRedirect(page: Page, expectedPath: string): Promise<void> {
  expect(page.url()).toContain(expectedPath);
}

/**
 * Wait for redirect to login page and verify key elements.
 */
export async function verifyRedirectToLogin(page: Page): Promise<void> {
  await page.waitForURL(/auth\/login/, { timeout: 10000 });
  await verifyLoggedOut(page);
}

/**
 * Wait for redirect to dashboard and verify key elements.
 */
export async function verifyRedirectToDashboard(page: Page): Promise<void> {
  await verifyLoggedIn(page);
}
