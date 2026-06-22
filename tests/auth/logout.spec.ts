/**
 * Aalto Dentist Portal — Logout Tests
 *
 * Test ID Prefix: LGT
 * Endpoint: POST /v1/auth/logout
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DOCTOR } from '../data/auth-test-data';

test.describe('Logout Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
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
      await loginPage.clickAvatar();
      const [logoutResponse] = await Promise.all([
        loginPage.waitForLogoutResponse(),
        loginPage.clickSignOut(),
      ]);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.status).toBe(true);
      expect(logoutResponse.body.message).toContain('Logout');
    });

    await test.step('Verifikasi redirect ke login page', async () => {
      await loginPage.waitForLoginPage();
      expect(page.url()).toContain('/auth/login');
    });

    await test.step('Verifikasi cookie access_token dihapus', async () => {
      const hasCookie = await loginPage.isAccessTokenCookiePresent();
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

      await loginPage.clickAvatar();
      await Promise.all([
        loginPage.waitForLogoutResponse(),
        loginPage.clickSignOut(),
      ]);
      await loginPage.waitForLoginPage();
    });

    await test.step('Coba akses /dashboard langsung', async () => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verifikasi redirect ke login', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[LGT-003] Logout dari berbagai role — redirect konsisten', async ({
    page,
  }) => {
    const roles = [
      { email: DOCTOR.email, password: DOCTOR.password, label: 'doctor' },
    ];

    for (const role of roles) {
      await test.step(`Logout role: ${role.label}`, async () => {
        const lp = new LoginPage(page);
        await lp.open();

        const [loginResponse] = await Promise.all([
          lp.waitForLoginResponse(),
          lp.login(role.email, role.password),
        ]);
        expect(loginResponse.status).toBe(200);
        await lp.waitForDashboard();

        await lp.clickAvatar();
        const [logoutResponse] = await Promise.all([
          lp.waitForLogoutResponse(),
          lp.clickSignOut(),
        ]);

        expect(logoutResponse.status).toBe(200);
        await lp.waitForLoginPage();
        expect(page.url()).toContain('/auth/login');
      });
    }
  });
});
