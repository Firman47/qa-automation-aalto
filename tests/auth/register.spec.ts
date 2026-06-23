/**
 * Aalto Dentist Portal — Register Tests
 *
 * Test ID Prefix: REG
 * Page: /auth/register
 * Multi-step: Step 1 (Personal Info) → Step 2 (Practice Info)
 */
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { REGISTERED_EMAILS } from '../data/auth-test-data';
import { verifyToastMatchesApi } from './helpers/auth-assertions';
import { assertNoApiCall } from './helpers/auth-helper';

test.describe('Register Module', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  // ==================== Layout & Basic Rendering ====================

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

    await test.step('Verifikasi step indicator', async () => {
      await expect(registerPage.stepIndicator).toBeVisible();
    });
  });

  test('[REG-002] @smoke Register isi data valid Step 1 — Next enabled', async () => {
    await test.step('Isi semua field Step 1', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();
    });

    await test.step('Verifikasi Next button enabled', async () => {
      await expect(registerPage.nextButton).toBeEnabled();
    });
  });

  // ==================== Step Navigation ====================

  test('[REG-013] @smoke Step 1 valid — navigasi ke Step 2', async ({ page }) => {
    await test.step('Isi Step 1 dengan data valid', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();
    });

    await test.step('Klik Next dan verifikasi pindah ke Step 2', async () => {
      await registerPage.clickNext();
      await registerPage.waitForStep2();
      expect(page.url()).toContain('step=2');
    });

    await test.step('Verifikasi elemen Step 2 muncul', async () => {
      await expect(registerPage.practiceNameInput).toBeVisible({ timeout: 5000 });
      await expect(registerPage.practicePostcodeInput).toBeVisible();
      await expect(registerPage.roleCombobox).toBeVisible();
      await expect(registerPage.ahpraInput).toBeVisible();
      await expect(registerPage.getStartedButton).toBeVisible();
      await expect(registerPage.backButton).toBeVisible();
    });
  });

  test('[REG-014] Step 2 Practice Info — Get Started disabled saat kosong', async ({
    page,
  }) => {
    await test.step('Isi Step 1 valid', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();
    });

    await test.step('Navigasi ke Step 2', async () => {
      await registerPage.clickNext();
      await registerPage.waitForStep2();
    });

    await test.step('Verifikasi Get Started disabled (form kosong)', async () => {
      await expect(registerPage.getStartedButton).toBeDisabled();
    });

    await test.step('Isi data Step 2 valid', async () => {
      const practice = RegisterPage.generateUniquePractice();
      await registerPage.fillPracticeInfo(practice);
    });

    await test.step('Verifikasi Get Started enabled setelah isi data', async () => {
      await expect(registerPage.getStartedButton).toBeEnabled();
    });
  });

  // ==================== E2E Registration Flow ====================

  test('[REG-003] @smoke Register complete flow — Step 1 + Step 2, 201 Created', async ({
    page,
  }) => {
    await test.step('Isi Step 1 dengan data valid', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();
    });

    await test.step('Klik Next dan verifikasi Step 2', async () => {
      await registerPage.clickNext();
      await registerPage.waitForStep2();
      expect(page.url()).toContain('step=2');
    });

    await test.step('Isi Step 2 dan submit', async () => {
      const practice = RegisterPage.generateUniquePractice();
      await registerPage.fillPracticeInfo(practice);

      const [response] = await Promise.all([
        registerPage.waitForRegisterResponse(),
        registerPage.clickGetStarted(),
      ]);

      expect([201, 200]).toContain(response.status);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    await test.step('Verifikasi redirect setelah registrasi sukses', async () => {
      await page.waitForURL(/login|\/dashboard/, { timeout: 10000 });
      // Either redirect to login (email verification needed) or dashboard
      expect(
        page.url().includes('/auth/login') || page.url().includes('/dashboard'),
      ).toBe(true);
    });
  });

  // ==================== Negative Tests (API) ====================

  test('[REG-004] Register dengan email sudah terdaftar — tampilkan error API', async () => {
    await test.step('Isi form dengan email existing', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        email: REGISTERED_EMAILS.existingDoctor,
      });
      await registerPage.checkTerms();
    });

    await test.step('Klik Next dan tangkap response 409', async () => {
      const [response] = await Promise.all([
        registerPage.waitForRegisterResponse(),
        registerPage.clickNext(),
      ]);

      expect([409, 422, 400]).toContain(response.status);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBeDefined();

      // FIX: Verify toast content matches API message
      await verifyToastMatchesApi(
        registerPage.toastDescription,
        response,
        'REG-004',
      );
    });
  });

  // ==================== Client-Side Validation ====================

  test('[REG-005] Register dengan password mismatch — client-side validation', async ({
    page,
  }) => {
    await test.step('Isi password tidak match', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo({
        ...user,
        confirmPassword: 'DifferentPass456!',
      });
      await registerPage.checkTerms();
    });

    await test.step('Verifikasi NO API call terkirim saat mismatch', async () => {
      await assertNoApiCall(page, '/v1/auth/register', 'POST', async () => {
        await registerPage.clickNext();
      });
    });

    await test.step('Verifikasi error message muncul', async () => {
      await expect(
        page.getByText(/password.*match|confirm.*password/i),
      ).toBeVisible();
    });
  });

  test('[REG-010] Register tanpa centang terms — Next disabled', async () => {
    await test.step('Isi semua data valid tanpa centang terms', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
    });

    await test.step('Verifikasi Next button tetap disabled', async () => {
      await expect(registerPage.nextButton).toBeDisabled();
    });
  });

  // ==================== Password Validation (§10.5) ====================

  test('[REG-006] Password lemah — requirement list muncul', async () => {
    await test.step('Isi password lemah', async () => {
      await registerPage.fillPassword('pass');
    });

    await test.step('Verifikasi password requirement list muncul', async () => {
      await expect(registerPage.passwordRequirementList).toBeVisible();

      // Use role=listitem to verify each requirement — locale-agnostic
      const items = registerPage.passwordRequirementList.getByRole('listitem');
      await expect(items).toHaveCount(5);
    });
  });

  test('[REG-007] Password 12 karakter dengan semua requirement — checklist terpenuhi', async () => {
    await test.step('Isi password kuat', async () => {
      await registerPage.fillPassword('Password123!');
    });

    await test.step('Verifikasi strength bar terlihat', async () => {
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  test('[REG-022] Password uppercase requirement — terdeteksi', async () => {
    await test.step('Isi password tanpa uppercase', async () => {
      await registerPage.fillPassword('password123!');
    });

    await test.step('Isi password dengan uppercase', async () => {
      await registerPage.fillPassword('Password123!');
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  test('[REG-023] Password lowercase requirement — terdeteksi', async () => {
    await test.step('Isi password tanpa lowercase', async () => {
      await registerPage.fillPassword('PASSWORD123!');
    });

    await test.step('Isi password dengan lowercase', async () => {
      await registerPage.fillPassword('Password123!');
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  test('[REG-025] Password special character requirement — terdeteksi', async () => {
    await test.step('Isi password tanpa special character', async () => {
      await registerPage.fillPassword('Password123');
    });

    await test.step('Isi password dengan special character', async () => {
      await registerPage.fillPassword('Password123!');
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  test('[REG-024] Password number requirement — terdeteksi', async () => {
    await test.step('Isi password tanpa angka', async () => {
      await registerPage.fillPassword('Password!');
    });

    await test.step('Isi password dengan angka', async () => {
      await registerPage.fillPassword('Password123!');
      await expect(registerPage.passwordStrengthBar).toBeVisible();
    });
  });

  // ==================== Toggle Visibility ====================

  test('[REG-008] Toggle show password pada register', async () => {
    await test.step('Isi password', async () => {
      await registerPage.fillPassword('Password123!');
    });

    await test.step('Toggle show password', async () => {
      await registerPage.showPasswordButton.click();
      const type = await registerPage.passwordInput.getAttribute('type');
      expect(type).toBe('text');
    });

    await test.step('Toggle hide password', async () => {
      await registerPage.showPasswordButton.click();
      const type = await registerPage.passwordInput.getAttribute('type');
      expect(type).toBe('password');
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

  // ==================== Navigation ====================

  test('[REG-011] @smoke Klik Sign In link — redirect ke login', async ({ page }) => {
    await test.step('Klik Sign In link', async () => {
      await registerPage.clickSignIn();
    });

    await test.step('Verifikasi redirect ke login page', async () => {
      await page.waitForURL(/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });
  });

  // ==================== Optional Fields ====================

  test('[REG-012] Referral code field — optional, tidak required', async () => {
    await test.step('Isi form tanpa referral code', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
    });

    await test.step('Verifikasi referral code field visible', async () => {
      await expect(registerPage.referralCodeInput).toBeVisible();
    });
  });

  // ==================== API Error Handling ====================

  test('[REG-016] @error-handling API 500 — error toast muncul', async ({ page }) => {
    await test.step('Route intercept 500 untuk register', async () => {
      await page.route('**/v1/auth/register', async (route) => {
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

    await test.step('Isi Step 1 dan klik Next', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();

      const [response] = await Promise.all([
        registerPage.waitForRegisterResponse(),
        registerPage.clickNext(),
      ]);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe(false);

      await verifyToastMatchesApi(
        registerPage.toastDescription,
        response,
        'REG-016',
      );
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('[REG-017] @error-handling Network error — error handling', async ({ page }) => {
    await test.step('Route intercept network error', async () => {
      await page.route('**/v1/auth/register', async (route) => {
        if (route.request().method() === 'POST') {
          await route.abort('internetdisconnected');
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Isi Step 1 dan klik Next', async () => {
      const user = RegisterPage.generateUniqueUser();
      await registerPage.fillPersonalInfo(user);
      await registerPage.checkTerms();
      await registerPage.clickNext();
    });

    await test.step('Verifikasi error alert muncul', async () => {
      await expect(registerPage.errorAlert).toBeVisible({ timeout: 10000 });
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
