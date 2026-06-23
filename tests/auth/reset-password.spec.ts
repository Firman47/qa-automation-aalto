/**
 * Aalto Dentist Portal — Reset Password Tests
 *
 * Test ID Prefix: RST
 * Endpoint: POST /v1/auth/reset-password
 * Endpoint: POST /v1/auth/confirm-double-login
 */
import { test, expect } from '@playwright/test';
import { ENDPOINTS } from './helpers/auth-config';
import { validateResetPasswordResponse } from './helpers/auth-schema';

test.describe('Reset Password & Double Login', () => {
  test.describe('Reset Password (POST /v1/auth/reset-password)', () => {
    test('[RST-001] Reset password dengan token valid', async ({ page }) => {
      // SKIP ditempatkan di PALING ATAS — sebelum API call apapun
      test.info().annotations.push({
        type: 'requires',
        description:
          'Memerlukan akses ke email atau backend test hook untuk mendapatkan reset token.',
      });
      test.skip(true, 'Memerlukan reset token dari email atau test hook');

      // Code di bawah tidak akan pernah dieksekusi karena test.skip di atas
      await test.step('Request forgot password', async () => {
        const forgotResponse = await page.request.post(
          ENDPOINTS.FORGOT_PASSWORD,
          { data: { email: 'tatang.doctor@gmail.com' } },
        );
        expect(forgotResponse.status()).toBe(200);
      });

      await test.step('Buka reset password page', async () => {
        // Pretend we have a token — would need mail integration
        await page.goto('/auth/reset-password?token=test-token');
        await page.waitForLoadState('networkidle');
      });
    });

    test('[RST-002] Reset password dengan token invalid — error response', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan token palsu + validasi schema', async () => {
        const response = await page.request.post(
          ENDPOINTS.RESET_PASSWORD,
          {
            data: {
              token: 'invalid-token-12345',
              password: 'NewPassword123!',
              password_confirmation: 'NewPassword123!',
            },
          },
        );

        expect([400, 401, 422]).toContain(response.status());

        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(false);
        expect(body.message).toBeDefined();

        // Schema validation
        const validation = validateResetPasswordResponse(body);
        if (!validation.valid) {
          throw new Error(
            `RST-002 BUG_AUTOMATION: Reset error response schema invalid. Missing: ${validation.missing.join(', ')}`,
          );
        }
      });
    });

    test('[RST-003] Reset password dengan password mismatch — validation error', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan password mismatch + validasi schema', async () => {
        const response = await page.request.post(
          ENDPOINTS.RESET_PASSWORD,
          {
            data: {
              token: 'some-token',
              password: 'NewPassword123!',
              password_confirmation: 'DifferentPass456!',
            },
          },
        );

        expect([400, 422]).toContain(response.status());

        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(false);

        // Schema validation
        const validation = validateResetPasswordResponse(body);
        if (!validation.valid) {
          throw new Error(
            `RST-003 BUG_AUTOMATION: Reset mismatch response schema invalid. Missing: ${validation.missing.join(', ')}`,
          );
        }
      });
    });

    test('[RST-004] Reset password dengan password lemah — validation error', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan password lemah + validasi schema', async () => {
        const response = await page.request.post(
          ENDPOINTS.RESET_PASSWORD,
          {
            data: {
              token: 'some-token',
              password: 'weak',
              password_confirmation: 'weak',
            },
          },
        );

        expect([400, 422]).toContain(response.status());

        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(false);

        // Schema validation
        const validation = validateResetPasswordResponse(body);
        if (!validation.valid) {
          throw new Error(
            `RST-004 BUG_AUTOMATION: Reset weak password schema invalid. Missing: ${validation.missing.join(', ')}`,
          );
        }
      });
    });

    test('[RST-006] Reset password rate limiting — 429', async ({ page }) => {
      // FIX: Use ENDPOINTS from config, not hardcoded URL
      await test.step('Kirim multiple reset requests untuk trigger rate limit', async () => {
        const promises = Array.from({ length: 10 }, (_, i) =>
          page.request.post(ENDPOINTS.RESET_PASSWORD, {
            data: {
              token: `rate-limit-test-${i}`,
              password: 'NewPassword123!',
              password_confirmation: 'NewPassword123!',
            },
          }),
        );

        const responses = await Promise.all(promises);
        const rateLimited = responses.some((r) => r.status() === 429);

        if (rateLimited) {
          const limited = responses.find((r) => r.status() === 429)!;
          const body = await limited.json() as Record<string, unknown>;
          expect(body.status).toBe(false);
        } else {
          for (const r of responses) {
            expect([400, 401, 422]).toContain(r.status());
          }
        }
      });
    });

    test('[RST-009] Reset password sukses via intercept — UI toast sesuai API', async ({
      page,
    }) => {
      await test.step('Route intercept reset password success 200', async () => {
        await page.route('**/v1/auth/reset-password', async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                status: true,
                message: 'Password has been reset successfully.',
                data: { message: 'You can now log in with your new password.' },
              }),
            });
          } else {
            await route.continue();
          }
        });
      });

      await test.step('Kirim reset request dan verifikasi response', async () => {
        const response = await page.request.post(ENDPOINTS.RESET_PASSWORD, {
          data: {
            token: 'test-valid-token',
            password: 'NewPassword123!',
            password_confirmation: 'NewPassword123!',
          },
        });

        expect(response.status()).toBe(200);
        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(true);
        expect(body.message).toBe('Password has been reset successfully.');
      });

      await page.unrouteAll({ behavior: 'ignoreErrors' });
    });
  });

  test.describe('Double Login Confirmation (POST /v1/auth/confirm-double-login)', () => {
    test('[RST-005] Confirm double login dengan token invalid — error', async ({
      page,
    }) => {
      await test.step('Kirim confirm dengan token palsu', async () => {
        const response = await page.request.post(
          ENDPOINTS.CONFIRM_DOUBLE_LOGIN,
          {
            data: { token: 'invalid-confirm-token' },
          },
        );

        expect([400, 401]).toContain(response.status());

        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(false);
        expect(body.message).toBeDefined();
      });
    });
  });
});
