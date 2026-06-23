/**
 * Aalto Dentist Portal — Role-Based Test Patterns
 *
 * Reusable helpers for testing across all roles:
 * - Run same scenario against doctor, orthodontist, and admin
 * - Role-specific context_role assertions
 * - Role-based test data access
 */
import { expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ALL_ROLES, type TestUser } from '../../data/auth-test-data';
import { ENDPOINTS } from './auth-config';

export { ALL_ROLES };
export type { TestUser };

/**
 * Run a callback function for each role.
 * Each role gets a fresh LoginPage + login + callback execution.
 *
 * @param page - Playwright Page
 * @param callback - Receives (user, rolePage, roleIndex)
 */
export async function forAllRoles(
  page: Page,
  callback: (user: TestUser, rolePage: LoginPage, index: number) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < ALL_ROLES.length; i++) {
    const user = ALL_ROLES[i];
    const rolePage = new LoginPage(page);
    await rolePage.open();

    await callback(user, rolePage, i);
  }
}

/**
 * Login as a specific role and return the login response.
 * Useful when you need to login+test in one call.
 */
export async function loginAsRole(
  page: Page,
  user: TestUser,
): Promise<{
  loginPage: LoginPage;
  response: { status: number; body: Record<string, unknown> };
}> {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const [response] = await Promise.all([
    loginPage.waitForLoginResponse(),
    loginPage.login(user.email, user.password),
  ]);

  return { loginPage, response };
}

/**
 * Assert that a user profile's context_role matches the expected role.
 */
export function assertContextRole(
  userData: Record<string, unknown>,
  expectedRole: string,
): void {
  expect(
    userData.context_role,
    `Expected context_role to be "${expectedRole}", got "${userData.context_role}"`,
  ).toBe(expectedRole);
}

/**
 * Assert that the /v1/auth/me response has the correct profile for the given user.
 */
export async function assertMeProfile(
  page: Page,
  user: TestUser,
): Promise<void> {
  // Wait for the /v1/auth/me network request to complete
  const response = await page.waitForResponse(
    (resp) =>
      resp.url().includes(ENDPOINTS.AUTH_ME) && resp.request().method() === 'GET',
  );

  const body = (await response.json()) as Record<string, unknown>;
  expect(response.status()).toBe(200);
  expect(body.status).toBe(true);

  const data = body.data as Record<string, unknown>;
  const profile = data.user as Record<string, unknown>;

  expect(profile.email).toBe(user.email);
  assertContextRole(profile, user.contextRole);
}

/**
 * Get the role display label for a user.
 */
export function getRoleLabel(user: TestUser): string {
  return `${user.role} (${user.contextRole})`;
}

/**
 * Generate a unique test email for a given role prefix.
 */
export function generateRoleTestEmail(role: string): string {
  return `test.${role}.${Date.now()}@example.com`;
}
