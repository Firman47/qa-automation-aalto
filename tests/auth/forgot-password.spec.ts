/**
 * Aalto Dentist Portal — Forgot Password Tests
 *
 * Test ID Prefix: FRG
 * Page: /auth/forgot-password
 */
import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

test.describe('Forgot Password Module', () => {
  let forgotPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPage = new ForgotPasswordPage(page);
    await forgotPage.open();
    await expect(forgotPage.heading).toBeVisible();
  });

  test('[FRG-001] @smoke Forgot password page — tampilan benar', async () => {
    await test.step('Verifikasi heading dan deskripsi', async () => {
      await expect(forgotPage.heading).toBeVisible();
      await expect(forgotPage.description).toBeVisible();
    });

    await test.step('Verifikasi form elements', async () => {
      await expect(forgotPage.emailInput).toBeVisible();
      await expect(forgotPage.sendResetButton).toBeVisible();
      await expect(forgotPage.backToLoginLink).toBeVisible();
    });
  });

  test('[FRG-002] @smoke Kirim reset link dengan email valid', async () => {
    await test.step('Isi email valid dan klik send', async () => {
      const [response] = await Promise.all([
        forgotPage.waitForForgotResponse(),
        forgotPage.fillEmail('tatang.doctor@gmail.com'),
        forgotPage.clickSendReset(),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
    });
  });

  test('[FRG-003] Kirim reset link dengan email tidak terdaftar', async () => {
    await test.step('Isi email tidak terdaftar dan klik send', async () => {
      const [response] = await Promise.all([
        forgotPage.waitForForgotResponse(),
        forgotPage.fillEmail('unregistered@test.com'),
        forgotPage.clickSendReset(),
      ]);

      // API mungkin tetap 200 untuk security (tidak reveal user existence)
      // atau 404 jika API mengembalikan error
      expect([200, 404]).toContain(response.status);
    });

    await test.step('Verifikasi toast muncul (success atau error)', async () => {
      await expect(forgotPage.errorAlert).toBeVisible({ timeout: 5000 });
    });
  });

  test('[FRG-004] Kirim reset link dengan email kosong — client-side validation', async ({
    page,
  }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/forgot') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Klik Send reset link tanpa isi email', async () => {
      await forgotPage.clickSendReset();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });

    await test.step('Tetap di forgot-password page', async () => {
      expect(page.url()).toContain('/auth/forgot-password');
    });
  });

  test('[FRG-005] @smoke Klik Back to login — redirect ke login', async ({ page }) => {
    await test.step('Klik Back to login', async () => {
      await forgotPage.clickBackToLogin();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[FRG-006] Kirim reset link dengan invalid email format — client-side validation', async ({
    page,
  }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/forgot') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi email format invalid', async () => {
      await forgotPage.fillEmail('not-an-email');
      await forgotPage.clickSendReset();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });
  });
});
