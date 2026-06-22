/**
 * Aalto Dentist Portal — Dashboard Tests
 *
 * Test ID Prefix: DSH
 * Page: /dashboard
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DOCTOR } from '../data/auth-test-data';

test.describe('Dashboard Module', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.open();
    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.login(DOCTOR.email, DOCTOR.password),
    ]);
    expect(response.status).toBe(200);

    await loginPage.waitForDashboard();

    dashboardPage = new DashboardPage(page);
    await dashboardPage.dismissWelcomeModal();
  });

  test('[DSH-001] @smoke Dashboard doctor — menampilkan greeting dan overview', async ({
    page,
  }) => {
    await test.step('Verifikasi greeting', async () => {
      await expect(dashboardPage.greeting).toBeVisible();
    });

    await test.step('Verifikasi Overview section', async () => {
      await expect(dashboardPage.overviewHeading).toBeVisible();
    });

    await test.step('Verifikasi Patient Journey tabs', async () => {
      await expect(dashboardPage.potentialPatientsTab).toBeVisible();
      await expect(dashboardPage.currentPatientsTab).toBeVisible();
    });
  });

  test('[DSH-002] Dashboard — Patient Journey tabs bisa diklik', async () => {
    await test.step('Klik Current Patients tab', async () => {
      await dashboardPage.clickCurrentPatientsTab();
      // Verify tab state
    });

    await test.step('Klik Potential Patients tab', async () => {
      await dashboardPage.clickPotentialPatientsTab();
    });
  });
});
