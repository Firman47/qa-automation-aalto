/**
 * Aalto Dentist Portal — Logout Tests
 *
 * Test ID Prefix: LGT
 * Endpoint: POST /v1/auth/logout
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { DOCTOR, ORTHODONTIST, ADMIN, ALL_ROLES } from '../data/auth-test-data';

test.describe('Logout Module', () => {
  let loginPage: LoginPage;
  let logoutPage: LogoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    logoutPage = new LogoutPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
  });

  test('[LGT-001] @smoke Logout via avatar menu — sukses ke login page', async ({
    page,
  }) => {
    await test.step('Login doctor terlebih dahulu', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('Klik avatar dan logout', async () => {
      const { status, body } = await logoutPage.logout();
      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.message).toBeDefined();
    });

    await test.step('Verifikasi redirect ke login page', async () => {
      await logoutPage.verifyOnLoginPage();
    });

    await test.step('Verifikasi cookie access_token dihapus', async () => {
      const hasCookie = await logoutPage.isAccessTokenCookiePresent();
      expect(hasCookie).toBe(false);
    });
  });

  test('[LGT-002] Setelah logout, akses protected route redirect ke login', async ({
    page,
  }) => {
    await test.step('Login lalu logout', async () => {
      const [loginResponse] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(loginResponse.status).toBe(200);
      await loginPage.waitForDashboard();

      await logoutPage.logout();
      await logoutPage.waitForLoginPage();
    });

    await test.step('Coba akses /dashboard langsung', async () => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verifikasi redirect ke login dengan semua element login terlihat', async () => {
      // FIX: Verifikasi URL dan element login
      expect(page.url()).toContain('/auth/login');
      await expect(loginPage.heading).toBeVisible({ timeout: 10000 });
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    });
  });

  test('[LGT-003] Logout dari berbagai role — redirect konsisten', async ({
    page,
  }) => {
    for (const role of ALL_ROLES) {
      await test.step(`Logout role: ${role.role}`, async () => {
        const lp = new LoginPage(page);
        const lgp = new LogoutPage(page);
        await lp.open();

        const [loginResponse] = await Promise.all([
          lp.waitForLoginResponse(),
          lp.login(role.email, role.password),
        ]);
        expect(loginResponse.status).toBe(200);
        await lp.waitForDashboard();

        const { status, body } = await lgp.logout();
        expect(status).toBe(200);
        expect(body.status).toBe(true);

        await lgp.verifyOnLoginPage();
      });
    }
  });
});
