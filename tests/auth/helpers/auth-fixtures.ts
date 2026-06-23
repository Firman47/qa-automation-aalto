/**
 * Aalto Dentist Portal — Auth Fixtures
 *
 * Custom Playwright fixtures untuk authenticated browser contexts per role.
 * Mengeliminasi duplicated login flow di spec files.
 *
 * Usage:
 *   import { test, expect } from './helpers/auth-fixtures';
 *
 *   test('test as doctor', async ({ doctorPage }) => { ... });
 *   test('test as ortho', async ({ orthoPage }) => { ... });
 *   test('test as admin', async ({ adminPage }) => { ... });
 */
import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DOCTOR, ORTHODONTIST, ADMIN } from '../../data/auth-test-data';
import { ENDPOINTS, ROUTES } from './auth-config';

export { expect };

type AuthFixtures = {
  doctorPage: Page;
  orthoPage: Page;
  adminPage: Page;
  doctorContext: BrowserContext;
  orthoContext: BrowserContext;
  adminContext: BrowserContext;
};

async function loginAndWait(page: Page, email: string, password: string, contextRole: string): Promise<void> {
  const loginPage = new LoginPage(page);
  await page.goto(ROUTES.LOGIN);
  await page.waitForLoadState('networkidle');

  await loginPage.fillEmail(email);
  await loginPage.fillPassword(password);

  const response = await page.waitForResponse(
    (resp) => resp.url().includes(ENDPOINTS.LOGIN) && resp.request().method() === 'POST',
  );
  await loginPage.clickSignIn();
  const respBody = (await response.json()) as Record<string, unknown>;

  if (response.status() !== 200 || respBody.status !== true) {
    throw new Error(`Fixture login failed for ${email}: ${response.status()} ${JSON.stringify(respBody)}`);
  }

  // Gunakan waitForPostLogin — orthodontist redirect ke halaman sendiri (bukan dashboard)
  await loginPage.waitForPostLogin(contextRole);
}

export const test = base.extend<AuthFixtures>({
  doctorPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, DOCTOR.email, DOCTOR.password, 'dentist');
    await use(page);
    await context.close();
  },

  orthoPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, ORTHODONTIST.email, ORTHODONTIST.password, 'orthodontist');
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, ADMIN.email, ADMIN.password, 'superadmin');
    await use(page);
    await context.close();
  },

  doctorContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, DOCTOR.email, DOCTOR.password, 'dentist');
    await use(context);
    await context.close();
  },

  orthoContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, ORTHODONTIST.email, ORTHODONTIST.password, 'orthodontist');
    await use(context);
    await context.close();
  },

  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndWait(page, ADMIN.email, ADMIN.password, 'superadmin');
    await use(context);
    await context.close();
  },
});
