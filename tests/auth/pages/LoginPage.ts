/**
 * Aalto Dentist Portal — Login Page Object
 * URL: /auth/login
 */
import { type Page, type Locator, type Response } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Form fields
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly showPasswordButton: Locator;
  readonly rememberCheckbox: Locator;

  // Links
  readonly forgotPasswordLink: Locator;
  readonly createAccountLink: Locator;

  // Static text
  readonly heading: Locator;
  readonly welcomeText: Locator;

  // Toast / Notification
  readonly toastDescription: Locator;
  readonly errorAlert: Locator;

  // Top bar user menu (post-login)
  readonly userAvatar: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('your.email@example.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.signInButton = page.getByRole('button', { name: 'SIGN IN' });
    this.showPasswordButton = page.getByRole('button', { name: 'Show password' });
    this.rememberCheckbox = page.getByRole('checkbox', { name: /remember/i });

    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.createAccountLink = page.getByRole('link', { name: 'Create Free Account →' });

    this.heading = page.getByRole('heading', { name: 'PARTNER PORTAL' });
    this.welcomeText = page.getByText('Welcome back.');

    this.toastDescription = page.locator('[data-slot="description"]');
    this.errorAlert = page.getByRole('alert');

    this.userAvatar = page.locator('[data-slot="avatar"]');
    this.signOutButton = page.getByRole('menuitem', { name: /sign.?out/i });
  }

  // === Navigation ===
  async open(): Promise<void> {
    await this.page.goto('/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  // === Actions ===
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountLink.click();
  }

  async toggleShowPassword(): Promise<void> {
    await this.showPasswordButton.click();
  }

  async toggleRemember(): Promise<void> {
    await this.rememberCheckbox.click();
  }

  async clickAvatar(): Promise<void> {
    await this.userAvatar.click();
  }

  async clickSignOut(): Promise<void> {
    await this.signOutButton.click();
  }

  /** Complete login flow: fill email, password, and click SIGN IN */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  /** Login with remember me checked */
  async loginWithRemember(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.toggleRemember();
    await this.clickSignIn();
  }

  // === Wait Methods ===
  async waitForLoginResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/v1/auth/login') && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  async waitForLogoutResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/v1/auth/logout') && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  async waitForMeResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/v1/auth/me') && resp.request().method() === 'GET',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  async waitForDashboard(): Promise<void> {
    await this.page.waitForURL(/dashboard/, { timeout: 15000 });
  }

  async waitForLoginPage(): Promise<void> {
    await this.page.waitForURL(/auth\/login/, { timeout: 10000 });
  }

  async waitForErrorMessage(): Promise<void> {
    await this.errorAlert.waitFor({ state: 'visible', timeout: 5000 });
  }

  // === Cookie helpers ===
  async getAccessTokenCookie(): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    const token = cookies.find((c) => c.name === 'access_token');
    return token?.value;
  }

  async isAccessTokenCookiePresent(): Promise<boolean> {
    const token = await this.getAccessTokenCookie();
    return token !== undefined && token !== '' && token !== 'deleted';
  }

  // === Getters (Error States) ===
  get emailRequiredError(): Locator {
    return this.page.getByText('Email is required');
  }

  get passwordRequiredError(): Locator {
    return this.page.getByText('Password is required');
  }
}
