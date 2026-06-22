/**
 * Aalto Dentist Portal — Reset Password Tests
 *
 * Test ID Prefix: RST
 * Endpoint: POST /v1/auth/reset-password
 * Endpoint: POST /v1/auth/confirm-double-login
 */
import { test, expect } from '@playwright/test';

const API_BASE = 'https://dentist-api.sadigit.co.id/v1';

test.describe('Reset Password & Double Login', () => {
  test.describe('Reset Password (POST /v1/auth/reset-password)', () => {
    test('[RST-001] Reset password dengan token valid', async ({ page }) => {
      await test.step('Request forgot password dulu', async () => {
        const forgotResponse = await page.request.post(
          `${API_BASE}/auth/forgot-password`,
          {
            data: { email: 'tatang.doctor@gmail.com' },
          },
        );
        expect(forgotResponse.status()).toBe(200);
      });

      // Note: Test ini membutuhkan akses ke email untuk mendapatkan token.
      // Untuk automation, perlu mail integration atau backend test hook.
      test.info().annotations.push({
        type: 'requires',
        description:
          'Memerlukan akses ke email atau backend test hook untuk mendapatkan reset token. Test ini di-skip secara default.',
      });

      test.skip(true, 'Memerlukan reset token dari email atau test hook');
    });

    test('[RST-002] Reset password dengan token invalid — error response', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan token palsu', async () => {
        const response = await page.request.post(
          `${API_BASE}/auth/reset-password`,
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
      });
    });

    test('[RST-003] Reset password dengan password mismatch — validation error', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan password mismatch', async () => {
        const response = await page.request.post(
          `${API_BASE}/auth/reset-password`,
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
      });
    });

    test('[RST-004] Reset password dengan password lemah — validation error', async ({
      page,
    }) => {
      await test.step('Kirim reset dengan password lemah', async () => {
        const response = await page.request.post(
          `${API_BASE}/auth/reset-password`,
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
      });
    });
  });

  test.describe('Double Login Confirmation (POST /v1/auth/confirm-double-login)', () => {
    test('[RST-005] Confirm double login dengan token invalid — error', async ({
      page,
    }) => {
      await test.step('Kirim confirm dengan token palsu', async () => {
        const response = await page.request.post(
          `${API_BASE}/auth/confirm-double-login`,
          {
            data: { token: 'invalid-confirm-token' },
          },
        );

        expect([400, 401]).toContain(response.status());

        const body = await response.json() as Record<string, unknown>;
        expect(body.status).toBe(false);
      });
    });
  });
});
