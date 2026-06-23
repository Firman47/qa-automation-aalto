/**
 * Aalto Dentist Portal — Reset Password Page Object
 * URL: /auth/reset-password (dynamic, requires token)
 * Endpoints: POST /v1/auth/reset-password, POST /v1/auth/confirm-double-login
 */
import { type Page, type Locator, type Response } from '@playwright/test';
import { ENDPOINTS } from '../helpers/auth-config';

export class ResetPasswordPage {
  readonly page: Page;

  // Form fields
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetButton: Locator;

  // Toast
  readonly toastDescription: Locator;
  readonly successAlert: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newPasswordInput = page.getByPlaceholder('New password');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm new password');
    this.resetButton = page.getByRole('button', { name: /reset|change/i });

    this.toastDescription = page.locator('[data-slot="description"]');
    this.successAlert = page.getByRole('alert').filter({ hasText: /success|sent|check/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /error|invalid|expired/i });
  }

  /** Navigate to reset password page with a token */
  async openWithToken(token: string): Promise<void> {
    await this.page.goto(`/auth/reset-password?token=${encodeURIComponent(token)}`);
    await this.page.waitForLoadState('networkidle');
  }

  async fillNewPassword(password: string): Promise<void> {
    await this.newPasswordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /** Complete reset flow: fill both password fields and click reset */
  async resetPassword(newPassword: string, confirmPassword: string): Promise<void> {
    await this.fillNewPassword(newPassword);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickReset();
  }

  /** Wait for POST /v1/auth/reset-password response */
  async waitForResetResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.RESET_PASSWORD) && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  /** Wait for POST /v1/auth/confirm-double-login response */
  async waitForConfirmDoubleLoginResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.CONFIRM_DOUBLE_LOGIN) && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }
}
