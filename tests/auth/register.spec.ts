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

  test('[REG-011] Klik Sign In link — redirect ke login', async ({ page }) => {
    await test.step('Klik Sign In link', async () => {
      await registerPage.clickSignIn();
    });

    await test.step('Verifikasi redirect', async () => {
      await page.waitForURL(/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });
  });
});
