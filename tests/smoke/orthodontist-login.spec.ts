/**
 * Aalto Dentist Portal — Smoke Test: Orthodontist Login
 *
 * Test ID: SMOKE-ORTHO
 * Critical path — must pass before deployment
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/pages/LoginPage';
import { ORTHODONTIST } from '../data/auth-test-data';

test.describe('Smoke: Orthodontist Login', () => {
  test('[SMOKE-ORTHO-001] @smoke Orthodontist login flow — redirect ke dashboard', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();

    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.login(ORTHODONTIST.email, ORTHODONTIST.password),
    ]);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);

    await loginPage.waitForDashboard();
    await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
  });
});
