/**
 * Aalto Dentist Portal — Shared Test Fixtures
 *
 * Provides pre-authenticated page objects for each role.
 */
import { test as base } from '@playwright/test';
import { LoginPage } from './auth/pages/LoginPage';
import { DOCTOR, ORTHODONTIST, ADMIN } from './data/auth-test-data';

type MyFixtures = {
  doctorPage: LoginPage;
  orthoPage: LoginPage;
  adminPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  doctorPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.fillEmail(DOCTOR.email);
    await loginPage.fillPassword(DOCTOR.password);
    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.clickSignIn(),
    ]);
    if (response.status !== 200) {
      throw new Error(`Doctor login failed: ${JSON.stringify(response.body)}`);
    }
    await loginPage.waitForDashboard();
    await use(loginPage);
  },

  orthoPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.fillEmail(ORTHODONTIST.email);
    await loginPage.fillPassword(ORTHODONTIST.password);
    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.clickSignIn(),
    ]);
    if (response.status !== 200) {
      throw new Error(`Orthodontist login failed: ${JSON.stringify(response.body)}`);
    }
    // Orthodontist tidak memiliki dashboard
    await loginPage.waitForPostLogin('orthodontist');
    await use(loginPage);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.fillEmail(ADMIN.email);
    await loginPage.fillPassword(ADMIN.password);
    const [response] = await Promise.all([
      loginPage.waitForLoginResponse(),
      loginPage.clickSignIn(),
    ]);
    if (response.status !== 200) {
      throw new Error(`Admin login failed: ${JSON.stringify(response.body)}`);
    }
    await loginPage.waitForDashboard();
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
