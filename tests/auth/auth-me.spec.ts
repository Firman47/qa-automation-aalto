/**
 * Aalto Dentist Portal — Auth Me (Profile) Tests
 *
 * Test ID Prefix: ME
 * Endpoint: GET /v1/auth/me
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DOCTOR, ORTHODONTIST, ADMIN } from '../data/auth-test-data';

test.describe('Auth Me (GET /v1/auth/me)', () => {
  let loginPage: LoginPage;

  test('[ME-001] @smoke GET /v1/auth/me — mengembalikan profile user setelah login', async ({
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

    await test.step('GET /v1/auth/me — verifikasi data user', async () => {
      const meResponse = await loginPage.waitForMeResponse();
      expect(meResponse.status).toBe(200);
      expect(meResponse.body.status).toBe(true);

      const data = meResponse.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;
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

    await test.step('Verifikasi response mengandung clinic', async () => {
      const meResponse = await loginPage.waitForMeResponse();
      const data = meResponse.body.data as Record<string, unknown>;
      const user = data.user as Record<string, unknown>;
      const clinic = user.clinic as Record<string, unknown>;

      expect(clinic).toBeDefined();
      expect(clinic.id).toBeDefined();
      expect(clinic.name).toBeDefined();
      expect(clinic.address).toBeDefined();
    });
  });

  test('[ME-003] @smoke GET /v1/auth/me — semua role mengembalikan profile valid', async ({
    page,
  }) => {
    const roles = [
      { email: DOCTOR.email, password: DOCTOR.password, label: 'doctor', expectedRole: 'dentist' },
      { email: ORTHODONTIST.email, password: ORTHODONTIST.password, label: 'orthodontist', expectedRole: 'orthodontist' },
      { email: ADMIN.email, password: ADMIN.password, label: 'admin', expectedRole: 'superadmin' },
    ];

    for (const role of roles) {
      await test.step(`Role: ${role.label}`, async () => {
        const lp = new LoginPage(page);
        await lp.open();

        const [loginResponse] = await Promise.all([
          lp.waitForLoginResponse(),
          lp.login(role.email, role.password),
        ]);
        expect(loginResponse.status).toBe(200);
        await lp.waitForDashboard();

        const meResponse = await lp.waitForMeResponse();
        expect(meResponse.status).toBe(200);

        const data = meResponse.body.data as Record<string, unknown>;
        const user = data.user as Record<string, unknown>;
        expect(user.email).toBe(role.email);
        expect(user.context_role).toBe(role.expectedRole);
      });
    }
  });

  test('[ME-004] GET /v1/auth/me — tanpa auth returns 401', async ({
    page,
  }) => {
    loginPage = new LoginPage(page);

    await test.step('Akses /v1/auth/me langsung tanpa token', async () => {
      const response = await page.request.get(
        'https://dentist-api.sadigit.co.id/v1/auth/me',
      );
      expect(response.status()).toBe(401);

      const body = await response.json() as Record<string, unknown>;
      expect(body.status).toBe(false);
    });
  });
});
