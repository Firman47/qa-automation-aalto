/**
 * Aalto Dentist Portal — Login Tests
 *
 * Test ID Prefix: AUTH
 * Page: /auth/login
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DOCTOR, ORTHODONTIST, ADMIN, ALL_ROLES, INVALID_CREDENTIALS } from '../data/auth-test-data';
import { assertToastMismatch } from '../helpers/bug-assertions';
import { assertNoApiCall } from './helpers/auth-helper';
import { validateLoginResponse } from './helpers/auth-schema';
import { verifyLoggedIn, assertOnLoginPage } from './helpers/auth-state';
import { assertAccessTokenPresent } from './helpers/auth-cookies';

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
    await test.step('Isi password, kosongkan email, klik SIGN IN', async () => {
      await loginPage.fillPassword(DOCTOR.password);
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await assertNoApiCall(page, '/v1/auth/login', 'POST', async () => {
        // Action already happened above; re-trigger to capture
        await loginPage.clickSignIn();
      });
    });
  });

  test('[AUTH-005] Login dengan password kosong — validasi client-side', async ({ page }) => {
    await test.step('Isi email, kosongkan password, klik SIGN IN', async () => {
      await loginPage.fillEmail(DOCTOR.email);
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await assertNoApiCall(page, '/v1/auth/login', 'POST', async () => {
        await loginPage.clickSignIn();
      });
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
      // FIX: Use DOCTOR.password instead of hardcoded string
      await loginPage.fillPassword(DOCTOR.password);
    });

    await test.step('Toggle show password — type berubah ke text', async () => {
      await loginPage.toggleShowPassword();
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(type).toBe('text');
    });

    await test.step('Toggle hide password — type kembali ke password', async () => {
      await loginPage.toggleShowPassword();
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(type).toBe('password');
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

  test('[AUTH-011] Login dengan remember me — session cookie bertahan', async ({
    page,
  }) => {
    await test.step('Login dengan remember true', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.loginWithRemember(DOCTOR.email, DOCTOR.password),
      ]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
    });

    await test.step('Verifikasi cookie access_token ada', async () => {
      await loginPage.waitForDashboard();
      const hasCookie = await loginPage.isAccessTokenCookiePresent();
      expect(hasCookie).toBe(true);
    });
  });

  test('[AUTH-012] Login dengan password expired — 403 toast reset link', async ({
    page,
  }) => {
    // Note: Test ini mensimulasikan response 403 password expired.
    // Diperlukan akun dengan password expired or mock intercept.
    // Jika tidak ada akun expired, test di-skip dengan pesan.
    test.info().annotations.push({
      type: 'requires',
      description: 'Akun dengan password expired. Jika tidak tersedia, gunakan route拦截.',
    });

    await test.step('Route拦截 403 response untuk password expired', async () => {
      await page.route('**/v1/auth/login', async (route) => {
        const request = route.request();
        if (request.method() === 'POST') {
          await route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message:
                'Your password has expired. A password reset link has been sent to your email.',
              data: null,
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Login — intercept 403', async () => {
      await loginPage.login(DOCTOR.email, DOCTOR.password);
    });

    await test.step('Verifikasi toast error muncul', async () => {
      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });
      const toastText = await loginPage.toastDescription.textContent();
      expect(toastText).toContain('password has expired');
    });

    await test.step('Tetap di halaman login', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-013] Login saat account locked — 403 toast locked', async ({
    page,
  }) => {
    await test.step('Route拦截 403 response untuk account locked', async () => {
      await page.route('**/v1/auth/login', async (route) => {
        const request = route.request();
        if (request.method() === 'POST') {
          await route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message:
                'Account has been locked due to too many failed login attempts. Please try again in 30 minutes.',
              data: null,
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Login — intercept 403', async () => {
      await loginPage.login(DOCTOR.email, DOCTOR.password);
    });

    await test.step('Verifikasi toast locked', async () => {
      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });
      const toastText = await loginPage.toastDescription.textContent();
      expect(toastText).toContain('Account has been locked');
    });

    await test.step('Tetap di halaman login', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-014] Double login required — email token confirmation', async ({
    page,
  }) => {
    await test.step('Route拦截 200 dengan requires_double_login', async () => {
      await page.route('**/v1/auth/login', async (route) => {
        const request = route.request();
        if (request.method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: true,
              message:
                'Double login confirmation required. Please check your email for confirmation token.',
              data: {
                requires_double_login: true,
                email: DOCTOR.email,
                message:
                  'A confirmation email has been sent to your email address. Please use the provided token to confirm your login.',
              },
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Login — intercept double login', async () => {
      await loginPage.login(DOCTOR.email, DOCTOR.password);
    });

    await test.step('Verifikasi toast double login muncul', async () => {
      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });
      const toastText = await loginPage.toastDescription.textContent();
      expect(toastText).toContain('Double login');
    });

    await test.step('Verifikasi tidak redirect ke dashboard', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-015] Rate limited (429) — Too many requests toast', async ({
    page,
  }) => {
    await test.step('Route拦截 429 rate limit', async () => {
      await page.route('**/v1/auth/login', async (route) => {
        const request = route.request();
        if (request.method() === 'POST') {
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message: 'Too many requests',
            }),
          });
        } else {
          await route.continue();
        }
      });
    });

    await test.step('Login — intercept 429', async () => {
      await loginPage.login(DOCTOR.email, DOCTOR.password);
    });

    await test.step('Verifikasi toast rate limit', async () => {
      await expect(loginPage.errorAlert).toBeVisible({ timeout: 5000 });
      const toastText = await loginPage.toastDescription.textContent();
      expect(toastText).toContain('Too many requests');
    });

    await test.step('Tetap di halaman login (tidak redirect)', async () => {
      assertOnLoginPage(page);
    });
  });

  test('[AUTH-016] Logout flow — POST logout, cookie cleared, redirect login', async ({
    page,
  }) => {
    await test.step('Login dulu', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('Logout via avatar menu', async () => {
      await loginPage.clickAvatar();
      const [logoutResponse] = await Promise.all([
        loginPage.waitForLogoutResponse(),
        loginPage.clickSignOut(),
      ]);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.status).toBe(true);
    });

    await test.step('Verifikasi redirect ke login page', async () => {
      await loginPage.waitForLoginPage();
      expect(page.url()).toContain('/auth/login');
    });

    await test.step('Verifikasi cookie access_token hilang', async () => {
      const hasCookie = await loginPage.isAccessTokenCookiePresent();
      expect(hasCookie).toBe(false);
    });
  });

  test('[AUTH-017] Login response — verifikasi struktur user + clinic', async ({
    page,
  }) => {
    let response: { status: number; body: Record<string, unknown> };

    await test.step('Login doctor dan tangkap response', async () => {
      const [resp] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      response = resp;
    });

    await test.step('Verifikasi HTTP status dan envelope', async () => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    await test.step('Verifikasi data.user dan field wajib', async () => {
      expect(response.body.data).toBeDefined();
      const data = response.body.data as Record<string, unknown>;
      expect(data.user).toBeDefined();

      const user = data.user as Record<string, unknown>;
      expect(user.id).toBeDefined();
      expect(user.email).toBe(DOCTOR.email);
      expect(user.context_role).toBe('dentist');
    });

    await test.step('Verifikasi user profile lengkap + schema validation', async () => {
      const data = response.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;
      expect(user.full_name).toBe(DOCTOR.displayName);
      expect(user.is_active).toBe(true);
      expect(user.clinic).toBeDefined();

      // Schema validation
      const validation = validateLoginResponse(response.body);
      if (!validation.valid) {
        throw new Error(
          `AUTH-017 BUG_AUTOMATION: Login response schema invalid. Missing: ${validation.missing.join(', ')}`,
        );
      }
    });
  });

  test('[AUTH-018] Login dengan invalid email format — client-side validation', async ({
    page,
  }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/login') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi email format salah (tanpa @)', async () => {
      await loginPage.fillEmail('not-an-email');
      await loginPage.fillPassword('Password123!');
    });

    await test.step('Klik SIGN IN', async () => {
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });

    await test.step('Verifikasi tetap di login page', async () => {
      expect(page.url()).toContain('/auth/login');
    });
  });

  test('[AUTH-019] GET /v1/auth/me — verifikasi profile setelah login (via browser network)', async ({
    page,
  }) => {
    // NOTE: AUTH-019 tests GET /v1/auth/me via browser's native network request.
    // ME-001 tests the same endpoint via API request context.
    // Both are kept — AUTH-019 validates the frontend triggers /auth/me correctly,
    // ME-001 validates the backend response structure directly.
    await test.step('Login doctor', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('GET /v1/auth/me — verifikasi profile', async () => {
      const meResponse = await loginPage.waitForMeResponse();
      expect(meResponse.status).toBe(200);
      expect(meResponse.body.status).toBe(true);

      const data = meResponse.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;
      expect(user.email).toBe(DOCTOR.email);
      expect(user.context_role).toBe('dentist');
    });
  });

  test('[AUTH-020] Login dengan whitespace email — client-side validation', async ({
    page,
  }) => {
    let requestSent = false;

    page.on('request', (req) => {
      if (req.url().includes('/v1/auth/login') && req.method() === 'POST') {
        requestSent = true;
      }
    });

    await test.step('Isi email dengan spasi', async () => {
      await loginPage.fillEmail('   ');
      await loginPage.fillPassword('Password123!');
    });

    await test.step('Klik SIGN IN', async () => {
      await loginPage.clickSignIn();
    });

    await test.step('Verifikasi NO API call terkirim', async () => {
      await page.waitForTimeout(100);
      expect(requestSent).toBe(false);
    });
  });

  test('[AUTH-023] Login page layout — semua element terlihat', async () => {
    await test.step('Verifikasi heading dan welcome text', async () => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.welcomeText).toBeVisible();
    });

    await test.step('Verifikasi form elements', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.rememberCheckbox).toBeVisible();
      await expect(loginPage.showPasswordButton).toBeVisible();
    });

    await test.step('Verifikasi navigation links', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.createAccountLink).toBeVisible();
    });
  });
});
