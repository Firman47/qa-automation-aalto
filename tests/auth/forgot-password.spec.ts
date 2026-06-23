/**
 * Aalto Dentist Portal — Forgot Password Tests
 *
 * Test ID Prefix: FRG
 * Page: /auth/forgot-password
 */
import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { assertNoApiCall } from './helpers/auth-helper';
import { verifyToastMatchesApi } from './helpers/auth-assertions';
import { validateForgotPasswordResponse } from './helpers/auth-schema';

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
    await test.step('Isi email valid', async () => {
      // FIX: fillEmail harus SEBELUM Promise.all — bukan di dalamnya
      await forgotPage.fillEmail('tatang.doctor@gmail.com');
    });

    await test.step('Klik send, tangkap response, dan verifikasi toast', async () => {
      const [response] = await Promise.all([
        forgotPage.waitForForgotResponse(),
        forgotPage.clickSendReset(),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);

      // Schema validation
      const validation = validateForgotPasswordResponse(response.body);
      if (!validation.valid) {
        throw new Error(
          `FRG-002 BUG_AUTOMATION: Forgot password response schema invalid. Missing: ${validation.missing.join(', ')}`,
        );
      }

      // FIX: verify toast with the SAME response — no second API call needed
      await verifyToastMatchesApi(forgotPage.toastDescription, response, 'FRG-002');
    });
  });

  test('[FRG-003] Kirim reset link dengan email tidak terdaftar', async () => {
    await test.step('Isi email tidak terdaftar', async () => {
      await forgotPage.fillEmail('unregistered@test.com');
    });

    await test.step('Klik send dan verifikasi response', async () => {
      const [response] = await Promise.all([
        forgotPage.waitForForgotResponse(),
        forgotPage.clickSendReset(),
      ]);

      // API mungkin tetap 200 untuk security (tidak reveal user existence)
      expect([200, 404]).toContain(response.status);

      // Verifikasi toast content sesuai API message
      await verifyToastMatchesApi(forgotPage.toastDescription, response, 'FRG-003');
    });
  });

  test('[FRG-004] Kirim reset link dengan email kosong — client-side validation', async ({
    page,
  }) => {
    await test.step('Verifikasi NO API call terkirim saat klik send tanpa email', async () => {
      await assertNoApiCall(page, '/v1/auth/forgot', 'POST', async () => {
        await forgotPage.clickSendReset();
      });
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
    await test.step('Isi email format invalid dan klik send', async () => {
      await forgotPage.fillEmail('not-an-email');
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await assertNoApiCall(page, '/v1/auth/forgot', 'POST', async () => {
        await forgotPage.clickSendReset();
      });
    });
  });

  test('[FRG-008] @error-handling Rate limited pada forgot password — 429 toast', async ({
    page,
  }) => {
    await test.step('Route intercept 429 untuk /v1/auth/forgot', async () => {
      await page.route('**/v1/auth/forgot', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message: 'Too many requests. Please try again later.',
              data: null,
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Isi email dan kirim — intercept 429', async () => {
      await forgotPage.fillEmail('tatang.doctor@gmail.com');
      const [response] = await Promise.all([
        forgotPage.waitForForgotResponse(),
        forgotPage.clickSendReset(),
      ]);

      expect(response.status).toBe(429);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('Too many requests');

      // Verifikasi toast muncul
      await expect(forgotPage.errorAlert).toBeVisible({ timeout: 5000 });
      await verifyToastMatchesApi(forgotPage.toastDescription, response, 'FRG-008');
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('[FRG-009] @error-handling Network error pada forgot password — error handling', async ({
    page,
  }) => {
    await test.step('Route intercept network error untuk /v1/auth/forgot', async () => {
      await page.route('**/v1/auth/forgot', async (route) => {
        if (route.request().method() === 'POST') {
          await route.abort('internetdisconnected');
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Isi email dan kirim — network error', async () => {
      await forgotPage.fillEmail('tatang.doctor@gmail.com');
      await forgotPage.clickSendReset();
    });

    await test.step('Verifikasi error handling muncul', async () => {
      await expect(forgotPage.errorAlert).toBeVisible({ timeout: 10000 });
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
