/**
 * Aalto Dentist Portal — Register Tests
 *
 * Test ID Prefix: REG
 * Page: /auth/register
 */
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Register Module', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test('[REG-001] @smoke Register tampilan — form elements terlihat', async () => {
    await test.step('Verifikasi form Step 1 elements', async () => {
      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.phoneInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
      await expect(registerPage.nextButton).toBeDisabled();
    });
  });

  test('[REG-002] @smoke Register isi data valid Step 1 — Next enabled', async () => {
    await test.step('Isi semua field Step 1', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: user.password,
      });
      await registerPage.checkTerms();
    });

    await test.step('Verifikasi Next button enabled', async () => {
      await expect(registerPage.nextButton).toBeEnabled();
    });
  });

  test('[REG-003] Register complete flow — Step 1 + Step 2, 201 Created', async ({
    page,
  }) => {
    test.skip(true, 'E2E register flow requires Step 2 form — implement saat Step 2 page object tersedia');

    await test.step('Isi Step 1 valid + Next', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: user.password,
      });
      await registerPage.checkTerms();
      await registerPage.clickNext();
    });

    await test.step('Verifikasi pindah ke Step 2', async () => {
      await registerPage.waitForNextStep();
      expect(page.url()).toContain('step=2');
    });

    // Step 2 fields need to be added to RegisterPage
  });

  test('[REG-004] Register dengan email sudah terdaftar — 409 Conflict', async () => {
    await test.step('Isi form dengan email existing', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        email: 'tatang.doctor@gmail.com',
        confirmPassword: user.password,
      });
      await registerPage.checkTerms();
    });

    await test.step('Klik Next', async () => {
      const [response] = await Promise.all([
        registerPage.waitForRegisterResponse(),
        registerPage.clickNext(),
      ]);

      // Bisa 409 atau 422 tergantung API implementation
      expect([409, 422, 400]).toContain(response.status);
      expect(response.body.status).toBe(false);
    });

    await test.step('Verifikasi error toast', async () => {
      await expect(registerPage.errorAlert).toBeVisible({ timeout: 5000 });
    });
  });

  test('[REG-005] Register dengan password mismatch — client-side validation', async ({
    page,
  }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/register') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi password tidak match', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: 'DifferentPass456!',
      });
      await registerPage.checkTerms();
    });

    await test.step('Klik Next', async () => {
      await registerPage.clickNext();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });

    await test.step('Verifikasi error message muncul', async () => {
      await expect(
        page.getByText(/password.*match|confirm.*password/i),
      ).toBeVisible();
    });
  });

  test('[REG-006] Password lemah — requirement terlihat', async () => {
    await test.step('Isi password lemah', async () => {
      await registerPage.fillPassword('pass');
    });

    await test.step('Verifikasi requirement list muncul', async () => {
      await expect(
        registerPage.page.getByText('Password must be at least 12 characters'),
      ).toBeVisible();
      await expect(
        registerPage.page.getByText('Password must contain at least one number'),
      ).toBeVisible();
      await expect(
        registerPage.page.getByText('Password must contain at least one uppercase letter'),
      ).toBeVisible();
    });
  });

  test('[REG-007] Password 12 karakter dengan semua requirement — checklist terpenuhi', async () => {
    await test.step('Isi password kuat', async () => {
      await registerPage.fillPassword('Password123!');
    });

    await test.step('Verifikasi strength bar', async () => {
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  test('[REG-008] Toggle show password pada register', async () => {
    await test.step('Isi password', async () => {
      await registerPage.fillPassword('Password123!');
    });

    await test.step('Toggle show password', async () => {
      await registerPage.showPasswordButton.click();
      const type = await registerPage.passwordInput.getAttribute('type');
      expect(type).toBe('text');
    });
  });

  test('[REG-009] Toggle show confirm password pada register', async () => {
    await test.step('Isi confirm password', async () => {
      await registerPage.fillConfirmPassword('Password123!');
    });

    await test.step('Toggle show confirm password', async () => {
      await registerPage.showConfirmPasswordButton.click();
      const type = await registerPage.confirmPasswordInput.getAttribute('type');
      expect(type).toBe('text');
    });
  });

  test('[REG-010] Register tanpa centang terms — Next disabled', async () => {
    await test.step('Isi semua data valid tanpa centang terms', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: user.password,
      });
    });

    await test.step('Verifikasi Next button tetap disabled', async () => {
      await expect(registerPage.nextButton).toBeDisabled();
    });
  });

  test('[REG-011] @smoke Klik Sign In link — redirect ke login', async ({ page }) => {
    await test.step('Klik Sign In link', async () => {
      await registerPage.clickSignIn();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[REG-012] Referral code field — optional, tidak required', async () => {
    await test.step('Isi form tanpa referral code', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: user.password,
      });
    });

    await test.step('Verifikasi referral code field visible', async () => {
      await expect(registerPage.referralCodeInput).toBeVisible();
    });
  });
});
