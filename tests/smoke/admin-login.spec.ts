/**
 * Aalto Dentist Portal — Smoke Test: Admin Login
 *
 * Test ID: SMOKE-ADMIN
 * Critical path — must pass before deployment
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/pages/LoginPage';
import { ADMIN } from '../data/auth-test-data';

test.describe('Smoke: Admin Login', () => {
  test('[SMOKE-ADMIN-001] @smoke Admin login flow — redirect ke dashboard', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();

    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.login(ADMIN.email, ADMIN.password),
    ]);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);

    await loginPage.waitForDashboard();
    await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
  });
});
