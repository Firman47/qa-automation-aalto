/**
 * Aalto Dentist Portal — Smoke Test: Doctor Login
 *
 * Test ID: SMOKE-DOC
 * Critical path — must pass before deployment
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/pages/LoginPage';
import { DOCTOR } from '../data/auth-test-data';

test.describe('Smoke: Doctor Login', () => {
  test('[SMOKE-DOC-001] @smoke Doctor login flow — redirect ke dashboard', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();

    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.login(DOCTOR.email, DOCTOR.password),
    ]);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);

    await loginPage.waitForDashboard();
    await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
  });
});
