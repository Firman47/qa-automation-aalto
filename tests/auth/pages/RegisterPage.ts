/**
 * Aalto Dentist Portal — Register Page Object
 * URL: /auth/register
 * Multi-step: Personal Information → Practice Information
 */
import { type Page, type Locator, type Response } from '@playwright/test';
import { ENDPOINTS } from '../helpers/auth-config';

export class RegisterPage {
  readonly page: Page;

  // ========== Step Progress ==========
  readonly stepIndicator: Locator;
  readonly personalInfoButton: Locator;
  readonly practiceInfoButton: Locator;
  readonly getStartedButton: Locator;
  readonly backButton: Locator;

  // ========== Step 1: Personal Information ==========
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

  // Password requirement checkmarks (5 items)
  readonly passwordRequirementList: Locator;

  // Terms & Agreement
  readonly termsCheckbox: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;

  // Buttons
  readonly nextButton: Locator;

  // ========== Step 2: Practice Information ==========
  readonly practiceNameInput: Locator;
  readonly practicePostcodeInput: Locator;
  readonly roleCombobox: Locator;
  readonly alignerCasesCombobox: Locator;
  readonly ahpraInput: Locator;
  readonly hearAboutUsCombobox: Locator;

  // ========== Links ==========
  readonly signInLink: Locator;

  // ========== Toast ==========
  readonly toastDescription: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    // ===== Step Progress =====
    this.stepIndicator = page.locator('[role="progressbar"]');
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.personalInfoButton = page.getByRole('button', { name: 'Personal Information' });
    this.practiceInfoButton = page.getByRole('button', { name: 'Practice Information' });

    // ===== Step 1 fields =====
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
    this.passwordRequirementList = page.getByRole('list', { name: 'Password requirements' });

    this.termsCheckbox = page.getByRole('checkbox', { name: /I agree to the/ });

    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });

    // ===== Step 2 fields =====
    this.practiceNameInput = page.getByPlaceholder('Enter your practice name');
    this.practicePostcodeInput = page.getByPlaceholder('Enter postcode or zipcode');
    this.roleCombobox = page.getByRole('combobox', { name: 'What is your role?*' });
    this.alignerCasesCombobox = page.getByRole('combobox', {
      name: 'How many clear aligner cases have you done in the last year?*',
    });
    this.ahpraInput = page.getByPlaceholder('Enter your AHPRA registration number');
    this.hearAboutUsCombobox = page.getByRole('combobox', { name: 'Where did you hear about us?*' });

    // ===== Toast =====
    this.errorAlert = page.getByRole('alert');
    this.successAlert = page.getByRole('alert').filter({ hasText: /success/i });
    this.toastDescription = page.locator('[data-slot="description"]');
  }

  // ==================== Navigation ====================
  async open(): Promise<void> {
    await this.page.goto('/auth/register');
    await this.page.waitForLoadState('networkidle');
  }

  // ==================== Step 1 Actions ====================
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
    await this.experienceLevelDropdown.click();
    await this.page.getByRole('option', { name: level }).click();
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

  /** Complete Step 1: fill all personal info fields */
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

  /** Complete Step 1 and click Next */
  async fillStep1AndNext(params: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    experienceLevel: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  }): Promise<void> {
    await this.fillPersonalInfo(params);
    await this.checkTerms();
    await this.clickNext();
  }

  // ==================== Step 2 Actions ====================
  async fillPracticeName(name: string): Promise<void> {
    await this.practiceNameInput.fill(name);
  }

  async fillPracticePostcode(postcode: string): Promise<void> {
    await this.practicePostcodeInput.fill(postcode);
  }

  async selectRole(role: string): Promise<void> {
    await this.roleCombobox.click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async selectAlignerCases(option: string): Promise<void> {
    await this.alignerCasesCombobox.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async fillAhpra(ahpra: string): Promise<void> {
    await this.ahpraInput.fill(ahpra);
  }

  async selectHearAboutUs(option: string): Promise<void> {
    await this.hearAboutUsCombobox.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  async clickBack(): Promise<void> {
    await this.backButton.click();
  }

  /** Complete Step 2: fill all practice info fields */
  async fillPracticeInfo(params: {
    practiceName: string;
    postcode: string;
    role: string;
    alignerCases: string;
    ahpra: string;
    hearAboutUs: string;
  }): Promise<void> {
    await this.fillPracticeName(params.practiceName);
    await this.fillPracticePostcode(params.postcode);
    await this.selectRole(params.role);
    await this.selectAlignerCases(params.alignerCases);
    await this.fillAhpra(params.ahpra);
    await this.selectHearAboutUs(params.hearAboutUs);
  }

  // ==================== Wait Methods ====================
  async waitForRegisterResponse(
    method: 'POST' | 'GET' = 'POST',
  ): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes(ENDPOINTS.REGISTER) && resp.request().method() === method,
    );
    return {
      status: response.status(),
      body: (await response.json()) as Record<string, unknown>,
    };
  }

  async waitForStep2(): Promise<void> {
    await this.page.waitForURL(/\?step=2/, { timeout: 10000 });
  }

  async waitForStep1(): Promise<void> {
    await this.page.waitForURL(/auth\/register(\?step=1)?$/, { timeout: 10000 });
  }

  // ==================== Static Factory ====================
  static generateUniqueUser(): {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    experienceLevel: string;
    password: string;
    confirmPassword: string;
  } {
    const ts = Date.now();
    return {
      firstName: 'Test',
      lastName: `User${ts.toString().slice(-4)}`,
      phone: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `test_${ts}@example.com`,
      experienceLevel: 'Some experience',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
  }

  static generateUniquePractice(): {
    practiceName: string;
    postcode: string;
    role: string;
    alignerCases: string;
    ahpra: string;
    hearAboutUs: string;
  } {
    const ts = Date.now();
    return {
      practiceName: `Aalto Test Practice ${ts.toString().slice(-6)}`,
      postcode: '2000',
      role: 'Associate Dentist',
      alignerCases: '1-10 cases',
      ahpra: `AHPRATEST${ts.toString().slice(-6)}`,
      hearAboutUs: 'Google',
    };
  }
}
