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

  test('[FRG-002] Kirim reset link dengan email valid', async ({ page }) => {
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

  test('[FRG-005] Klik Back to login — redirect ke login', async ({ page }) => {
    await test.step('Klik Back to login', async () => {
      await forgotPage.clickBackToLogin();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });
  });
});
