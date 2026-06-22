/**
 * Aalto Dentist Portal — Register Page Object
 * URL: /auth/register
 * Multi-step: Personal Information → Practice Information
 */
import { type Page, type Locator, type Response } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Step indicators
  readonly stepIndicator: Locator;
  readonly personalInfoButton: Locator;
  readonly practiceInfoButton: Locator;

  // Step 1: Personal Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly experienceLevelDropdown: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly referralCodeInput: Locator;

  // Password visibility toggles
  readonly showPasswordButton: Locator;
  readonly showConfirmPasswordButton: Locator;

  // Password strength
  readonly passwordStrengthBar: Locator;

  // Terms & Agreement
  readonly termsCheckbox: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;

  // Buttons
  readonly nextButton: Locator;

  // Links
  readonly signInLink: Locator;

  // Toast
  readonly toastDescription: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepIndicator = page.locator('[role="progressbar"]');

    // Step 1 fields
    this.firstNameInput = page.getByPlaceholder('John');
    this.lastNameInput = page.getByPlaceholder('Doe');
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.emailInput = page.getByPlaceholder('your.email@example.com');
    this.experienceLevelDropdown = page.getByRole('combobox', {
      name: 'Which of the following describes you?*',
    });
    this.passwordInput = page.getByPlaceholder('Create a password');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm your password');
    this.referralCodeInput = page.getByPlaceholder('Enter referral code (optional)');

    this.showPasswordButton = page.getByRole('button', { name: 'Show password' }).first();
    this.showConfirmPasswordButton = page.getByRole('button', { name: 'Show password' }).last();

    this.passwordStrengthBar = page.locator('[role="progressbar"]');

    this.termsCheckbox = page.getByRole('checkbox', { name: /I agree to the/ });

    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });

    this.errorAlert = page.getByRole('alert');
    this.toastDescription = page.locator('[data-slot="description"]');
  }

  // === Navigation ===
  async open(): Promise<void> {
    await this.page.goto('/auth/register');
    await this.page.waitForLoadState('networkidle');
  }

  // === Actions ===
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async selectExperienceLevel(level: string): Promise<void> {
    await this.experienceLevelDropdown.selectOption({ label: level });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async fillReferralCode(code: string): Promise<void> {
    await this.referralCodeInput.fill(code);
  }

  async checkTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  /** Complete Step 1 registration form */
  async fillPersonalInfo(params: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    experienceLevel: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  }): Promise<void> {
    await this.fillFirstName(params.firstName);
    await this.fillLastName(params.lastName);
    await this.fillPhone(params.phone);
    await this.fillEmail(params.email);
    await this.selectExperienceLevel(params.experienceLevel);
    await this.fillPassword(params.password);
    await this.fillConfirmPassword(params.confirmPassword);
    if (params.referralCode) {
      await this.fillReferralCode(params.referralCode);
    }
  }

  // === Wait Methods ===
  async waitForRegisterResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/v1/auth/register') && resp.request().method() === 'POST',
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  async waitForNextStep(): Promise<void> {
    await this.page.waitForURL(/\?step=2/, { timeout: 10000 }).catch(() => {});
  }

  // === Static Factory ===
  static generateUniqueUser() {
    const ts = Date.now();
    return {
      firstName: 'Test',
      lastName: `User${ts.toString().slice(-4)}`,
      phone: `+614${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `test_${ts}@example.com`,
      experienceLevel: 'General Dentist',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
  }
}
