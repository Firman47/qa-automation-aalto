/**
 * Aalto Dentist Portal — Login Tests
 *
 * Test ID Prefix: AUTH
 * Page: /auth/login
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DOCTOR, ORTHODONTIST, ADMIN, INVALID_CREDENTIALS } from '../data/auth-test-data';
import { assertToastMismatch } from '../helpers/bug-assertions';

test.describe('Login Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
  });

  test('[AUTH-001] @smoke Login valid Doctor — redirect ke dashboard', async ({ page }) => {
    await test.step('Login dengan kredensial doctor', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
    });

    await test.step('Verifikasi redirect ke dashboard', async () => {
      await loginPage.waitForDashboard();
      await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
    });
  });

  test('[AUTH-002] @smoke Login valid Orthodontist — redirect ke dashboard', async ({ page }) => {
    await test.step('Login dengan kredensial orthodontist', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(ORTHODONTIST.email, ORTHODONTIST.password),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
    });

    await test.step('Verifikasi redirect ke dashboard', async () => {
      await loginPage.waitForDashboard();
      await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
    });
  });

  test('[AUTH-003] @smoke Login valid Admin — redirect ke dashboard', async ({ page }) => {
    await test.step('Login dengan kredensial admin', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(ADMIN.email, ADMIN.password),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
    });

    await test.step('Verifikasi redirect ke dashboard', async () => {
      await loginPage.waitForDashboard();
      await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible();
    });
  });

  test('[AUTH-004] Login dengan email kosong — validasi client-side', async ({ page }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/login') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi password, kosongkan email, klik SIGN IN', async () => {
      await loginPage.fillPassword(DOCTOR.password);
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100); // microtask drain
      expect(requestSent).toBe(false);
    });
  });

  test('[AUTH-005] Login dengan password kosong — validasi client-side', async ({ page }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/login') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi email, kosongkan password, klik SIGN IN', async () => {
      await loginPage.fillEmail(DOCTOR.email);
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });
  });

  test('[AUTH-006] Login dengan password salah — tampilkan error toast', async ({
    page,
  }) => {
    await test.step('Login dengan password salah', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, 'WrongPassword123!'),
      ]);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBeDefined();

      // Verifikasi toast muncul
      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });

      // === BUG_APP DETECTION ===
      // Bandingkan UI toast dengan API message
      const toastText = await loginPage.toastDescription.textContent();
      const apiMessage = response.body.message as string;

      if (toastText !== apiMessage) {
        assertToastMismatch({
          testCaseId: 'AUTH-006',
          apiStatus: response.status,
          apiMessage,
          toastMessage: toastText || '',
        });
      }
    });

    await test.step('Tetap di halaman login (tidak redirect)', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-007] Login dengan email tidak terdaftar — tampilkan error toast', async ({
    page,
  }) => {
    await test.step('Login dengan email tidak terdaftar', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login('unregistered@test.com', 'SomePass123!'),
      ]);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBeDefined();

      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });

      // === BUG_APP DETECTION ===
      const toastText = await loginPage.toastDescription.textContent();
      const apiMessage = response.body.message as string;

      if (toastText !== apiMessage) {
        assertToastMismatch({
          testCaseId: 'AUTH-007',
          apiStatus: response.status,
          apiMessage,
          toastMessage: toastText || '',
        });
      }
    });

    await test.step('Tetap di halaman login', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-008] Toggle show/hide password', async ({ page }) => {
    await test.step('Isi password', async () => {
      await loginPage.fillPassword('Password123!');
    });

    await test.step('Toggle show password', async () => {
      await loginPage.toggleShowPassword();
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(type).toBe('text');
    });
  });

  test('[AUTH-009] Klik Forgot password — redirect ke forgot-password page', async ({
    page,
  }) => {
    await test.step('Klik Forgot password link', async () => {
      await loginPage.clickForgotPassword();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/forgot-password/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/forgot-password');
    });
  });

  test('[AUTH-010] Klik Create Free Account — redirect ke register page', async ({
    page,
  }) => {
    await test.step('Klik Create Free Account link', async () => {
      await loginPage.clickCreateAccount();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/register/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/register');
    });
  });
});
