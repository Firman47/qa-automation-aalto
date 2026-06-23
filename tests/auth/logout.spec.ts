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
import { validateLogoutResponse } from './helpers/auth-schema';
import { assertAccessTokenAbsent } from './helpers/auth-cookies';

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

    await test.step('Klik avatar dan logout + validasi schema', async () => {
      const { status, body } = await logoutPage.logout();
      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.message).toBeDefined();

      // Schema validation
      const validation = validateLogoutResponse(body);
      if (!validation.valid) {
        throw new Error(
          `LGT-001 BUG_AUTOMATION: Logout response schema invalid. Missing: ${validation.missing.join(', ')}`,
        );
      }
    });

    await test.step('Verifikasi redirect ke login page', async () => {
      await logoutPage.verifyOnLoginPage();
    });

    await test.step('Verifikasi cookie access_token dihapus', async () => {
      await assertAccessTokenAbsent(logoutPage.page);
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

        // Schema validation for each role
        const validation = validateLogoutResponse(body);
        if (!validation.valid) {
          throw new Error(
            `LGT-003 BUG_AUTOMATION: Logout response schema invalid for ${role.role}. Missing: ${validation.missing.join(', ')}`,
          );
        }

        await lgp.verifyOnLoginPage();
      });
    }
  });

  test('[LGT-004] @error-handling Logout API 500 — error handling', async ({ page }) => {
    await test.step('Login doctor', async () => {
      loginPage = new LoginPage(page);
      logoutPage = new LogoutPage(page);
      await loginPage.open();

      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('Route intercept 500 untuk POST logout', async () => {
      await page.route('**/v1/auth/logout', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message: 'Internal Server Error',
              data: null,
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Klik avatar dan logout — intercept 500', async () => {
      const { status, body } = await logoutPage.logout();
      expect(status).toBe(500);
      expect(body.status).toBe(false);
      expect(body.message).toBeDefined();
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('[LGT-005] @error-handling Logout network error — error handling', async ({ page }) => {
    await test.step('Login doctor', async () => {
      loginPage = new LoginPage(page);
      logoutPage = new LogoutPage(page);
      await loginPage.open();

      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('Route intercept network error untuk POST logout', async () => {
      await page.route('**/v1/auth/logout', async (route) => {
        if (route.request().method() === 'POST') {
          await route.abort('internetdisconnected');
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Klik avatar dan logout — network error', async () => {
      // Network error might prevent the menu from rendering fully
      // Attempt logout and verify no crash
      await logoutPage.clickAvatar();
      await logoutPage.clickSignOut().catch(() => {});
      // Verify still on dashboard (logout failed)
      expect(page.url()).toContain('/dashboard');
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('[LGT-006] Setelah logout, access_token benar-benar hilang', async ({ page }) => {
    await test.step('Login lalu logout', async () => {
      loginPage = new LoginPage(page);
      logoutPage = new LogoutPage(page);
      await loginPage.open();

      const [loginResponse] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(loginResponse.status).toBe(200);
      await loginPage.waitForDashboard();

      await logoutPage.logout();
      await logoutPage.verifyOnLoginPage();
    });

    await test.step('Verifikasi access_token benar-benar hilang via cookie helper', async () => {
      await assertAccessTokenAbsent(logoutPage.page);
    });
  });
});
