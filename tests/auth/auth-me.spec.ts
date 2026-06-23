/**
 * Aalto Dentist Portal — Auth Me (Profile) Tests
 *
 * Test ID Prefix: ME
 * Endpoint: GET /v1/auth/me
 *
 * NOTE: ME-001 is intentionally different from AUTH-019 (login.spec.ts).
 * AUTH-019 focuses on page-based flow; ME-001 uses AuthMePage with API request context.
 * Keep both — they validate the same endpoint through different paths.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AuthMePage } from './pages/AuthMePage';
import { DOCTOR, ORTHODONTIST, ADMIN } from '../data/auth-test-data';
import { ENDPOINTS } from './helpers/auth-config';
import { validateUserProfile } from './helpers/auth-schema';

test.describe('Auth Me (GET /v1/auth/me)', () => {
  let loginPage: LoginPage;
  let authMePage: AuthMePage;

  test('[ME-001] @smoke GET /v1/auth/me — mengembalikan profile user setelah login', async ({
    page,
    request,
  }) => {
    loginPage = new LoginPage(page);
    authMePage = new AuthMePage(page, request);
    await loginPage.open();

    await test.step('Login doctor', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('GET /v1/auth/me via request context — verifikasi profile + schema', async () => {
      const meResponse = await authMePage.getMeViaApi();
      expect(meResponse.status).toBe(200);
      expect(meResponse.body.status).toBe(true);

      const data = meResponse.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;

      // Schema validation
      const validation = validateUserProfile(user);
      if (!validation.valid) {
        throw new Error(
          `ME-001 BUG_AUTOMATION: User profile schema invalid. Missing: ${validation.missing.join(', ')}`,
        );
      }

      expect(user.email).toBe(DOCTOR.email);
      expect(user.context_role).toBe('dentist');
      expect(user.id).toBeDefined();
      expect(user.full_name).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.is_active).toBe(true);
      expect(user.clinic).toBeDefined();
    });
  });

  test('[ME-002] GET /v1/auth/me — profile mengandung clinic info', async ({
    page,
  }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();

    await test.step('Login doctor', async () => {
      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await test.step('Verifikasi response mengandung clinic + schema', async () => {
      const meResponse = await loginPage.waitForMeResponse();
      const data = meResponse.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;

      // Schema validation for user object first
      const userValidation = validateUserProfile(user);
      if (!userValidation.valid) {
        throw new Error(
          `ME-002 BUG_AUTOMATION: User profile schema invalid. Missing: ${userValidation.missing.join(', ')}`,
        );
      }

      const clinic = user.clinic as Record<string, unknown>;
      expect(clinic).toBeDefined();
      expect(clinic.id).toBeDefined();
      expect(clinic.name).toBeDefined();
      expect(clinic.address).toBeDefined();
    });
  });

  test('[ME-003] @smoke GET /v1/auth/me — semua role mengembalikan profile valid', async ({
    page,
    request,
  }) => {
    const roles = [
      { email: DOCTOR.email, password: DOCTOR.password, label: 'doctor', expectedRole: 'dentist' },
      { email: ORTHODONTIST.email, password: ORTHODONTIST.password, label: 'orthodontist', expectedRole: 'orthodontist' },
      { email: ADMIN.email, password: ADMIN.password, label: 'admin', expectedRole: 'superadmin' },
    ];

    for (const role of roles) {
      await test.step(`Role: ${role.label}`, async () => {
        const lp = new LoginPage(page);
        const amp = new AuthMePage(page, request);
        await lp.open();

        const [loginResponse] = await Promise.all([
          lp.waitForLoginResponse(),
          lp.login(role.email, role.password),
        ]);
        expect(loginResponse.status).toBe(200);

        // Orthodontist tidak memiliki dashboard — gunakan waitForPostLogin
        const contextRole = role.expectedRole === 'orthodontist' ? 'orthodontist' : role.expectedRole;
        await lp.waitForPostLogin(contextRole);

        const meResponse = await amp.getMeViaApi();
        expect(meResponse.status).toBe(200);

        const data = meResponse.body.data as Record<string, unknown>;
        const user = data.user as Record<string, unknown>;

        // Schema validation per role
        const validation = validateUserProfile(user);
        if (!validation.valid) {
          throw new Error(
            `ME-003 BUG_AUTOMATION: Profile schema invalid for ${role.label}. Missing: ${validation.missing.join(', ')}`,
          );
        }

        expect(user.email).toBe(role.email);
        expect(user.context_role).toBe(role.expectedRole);
      });
    }
  });

  test('[ME-004] GET /v1/auth/me — tanpa auth returns 401', async ({
    page,
    request,
  }) => {
    authMePage = new AuthMePage(page, request);

    await test.step('Akses /v1/auth/me langsung tanpa token', async () => {
      // FIX: Use ENDPOINTS from config instead of hardcoded URL
      const response = await authMePage.getMeViaApi();
      expect(response.status).toBe(401);

      const body = response.body;
      expect(body.status).toBe(false);
    });
  });

  test('[ME-005] GET /v1/auth/me — expired token returns 401', async ({
    page,
    request,
  }) => {
    authMePage = new AuthMePage(page, request);

    await test.step('Akses /v1/auth/me dengan token expired', async () => {
      const response = await authMePage.getMeViaApi('expired-token-value');
      expect(response.status).toBe(401);

      const body = response.body;
      expect(body.status).toBe(false);
    });
  });

  test('[ME-006] GET /v1/auth/me — API 500 error handling', async ({
    page,
    request,
  }) => {
    authMePage = new AuthMePage(page, request);

    await test.step('Route intercept 500 untuk /v1/auth/me', async () => {
      await page.route('**/v1/auth/me', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            status: false,
            message: 'Internal Server Error',
            data: null,
          }),
        });
      });
    });

    await test.step('Login dan verify response', async () => {
      loginPage = new LoginPage(page);
      await loginPage.open();

      const [response] = await Promise.all([
        loginPage.waitForLoginResponse(),
        loginPage.login(DOCTOR.email, DOCTOR.password),
      ]);
      expect(response.status).toBe(200);
      await loginPage.waitForDashboard();
    });

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
