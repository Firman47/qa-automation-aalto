/**
 * Aalto Dentist Portal — Logout Page Object
 * Post-login: avatar menu → sign out
 * Endpoint: POST /v1/auth/logout
 */
import { type Page, type Locator, type Response } from '@playwright/test';
import { ENDPOINTS, ROUTES } from '../helpers/auth-config';

export class LogoutPage {
  readonly page: Page;

  // User avatar / menu trigger
  readonly userAvatar: Locator;
  readonly signOutMenuItem: Locator;

  // Post-logout verification
  readonly loginHeading: Locator;
  readonly emailInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userAvatar = page.locator('[data-slot="avatar"]');
    this.signOutMenuItem = page.getByRole('menuitem', { name: /sign.?out|log.?out/i });

    // Login page elements for redirect verification
    this.loginHeading = page.getByRole('heading', { name: 'PARTNER PORTAL' });
    this.emailInput = page.getByPlaceholder('your.email@example.com');
    this.signInButton = page.getByRole('button', { name: 'SIGN IN' });
  }

  /** Click avatar to open user menu */
  async clickAvatar(): Promise<void> {
    await this.userAvatar.click();
  }

  /** Click Sign Out from the menu */
  async clickSignOut(): Promise<void> {
    await this.signOutMenuItem.click();
  }

  /** Complete logout flow */
  async logout(): Promise<{ status: number; body: Record<string, unknown> }> {
    await this.clickAvatar();
    const [response] = await Promise.all([
      this.waitForLogoutResponse(),
      this.clickSignOut(),
    ]);
    return response;
  }

  /** Wait for POST /v1/auth/logout response */
  async waitForLogoutResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.LOGOUT) && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  /** Wait for redirect back to login page */
  async waitForLoginPage(): Promise<void> {
    await this.page.waitForURL(/auth\/login/, { timeout: 10000 });
  }

  /** Check if access_token cookie is present */
  async isAccessTokenCookiePresent(): Promise<boolean> {
    const cookies = await this.page.context().cookies();
    const token = cookies.find((c) => c.name === 'access_token');
    return token !== undefined && token !== '' && token !== 'deleted';
  }

  /** Verify we're back on the login page with all key elements visible */
  async verifyOnLoginPage(): Promise<void> {
    await this.waitForLoginPage();
    await this.loginHeading.waitFor({ state: 'visible', timeout: 5000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
  }
}
