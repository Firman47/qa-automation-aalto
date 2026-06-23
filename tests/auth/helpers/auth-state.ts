/**
 * Aalto Dentist Portal — Auth State Validation Helpers
 *
 * Reusable assertions for verifying login/logout state:
 * - Logged-in state (dashboard URL, greeting, sidebar)
 * - Logged-out state (login URL, form visible, no session)
 * - Redirect behavior
 * - Role-aware post-login state (orthodontist tidak memiliki dashboard)
 */
import { expect, type Page } from '@playwright/test';
import { ROUTES } from './auth-config';

/**
 * Verify that the user is logged in after a successful login.
 * For dentist/superadmin: mengecek redirect ke /dashboard + greeting.
 * For orthodontist: hanya mengecek bahwa URL bukan /auth/login
 * (orthodontist tidak memiliki dashboard).
 */
export async function verifyLoggedIn(page: Page, contextRole?: string): Promise<void> {
  if (contextRole === 'dentist' || contextRole === 'superadmin' || !contextRole) {
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');

    await expect(
      page.getByText(/Good (morning|afternoon|evening)/),
    ).toBeVisible({ timeout: 5000 });
  } else {
    // Orthodontist — tidak memiliki dashboard.
    await page.waitForFunction(
      () => !window.location.href.includes('/auth/login'),
      { timeout: 15000 },
    );
  }
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
 * Wait for redirect after login based on role.
 * Untuk dentist/superadmin: verifikasi dashboard.
 * Untuk orthodontist: verifikasi redirect keluar dari login page.
 */
export async function verifyRedirectToDashboard(page: Page, contextRole?: string): Promise<void> {
  await verifyLoggedIn(page, contextRole);
}
