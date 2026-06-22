/**
 * Aalto Dentist Portal — Forgot Password Page Object
 * URL: /auth/forgot-password
 */
import { type Page, type Locator, type Response } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly sendResetButton: Locator;
  readonly backToLoginLink: Locator;
  readonly heading: Locator;
  readonly description: Locator;
  readonly toastDescription: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('your.name@example.com');
    this.sendResetButton = page.getByRole('button', { name: 'Send reset link' });
    this.backToLoginLink = page.getByRole('link', { name: 'Back to login' });
    this.heading = page.getByRole('heading', { name: 'Forgot password?' });
    this.description = page.getByText(/Enter your email address/);
    this.toastDescription = page.locator('[data-slot="description"]');
    this.errorAlert = page.getByRole('alert');
  }

  async open(): Promise<void> {
    await this.page.goto('/auth/forgot-password');
    await this.page.waitForLoadState('networkidle');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickSendReset(): Promise<void> {
    await this.sendResetButton.click();
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginLink.click();
  }

  async waitForForgotResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/v1/auth/forgot') && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }
}
