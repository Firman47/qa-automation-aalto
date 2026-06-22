/**
 * Aalto Dentist Portal — Dashboard Page Object
 * URL: /dashboard
 */
import { type Page, type Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Greeting
  readonly greeting: Locator;

  // Overview section
  readonly overviewHeading: Locator;
  readonly newSubmissionCard: Locator;
  readonly appointmentsCard: Locator;

  // Patient Journey tabs
  readonly potentialPatientsTab: Locator;
  readonly currentPatientsTab: Locator;

  // Lead stat cards
  readonly newPatientLeads: Locator;
  readonly bookedPatient: Locator;
  readonly casesSubmitted: Locator;
  readonly designReady: Locator;

  // Welcome modal
  readonly welcomeHeading: Locator;
  readonly gotItButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greeting = page.getByText(/Good (morning|afternoon|evening)/);
    this.overviewHeading = page.getByText('Overview');

    this.newSubmissionCard = page.getByText('Start a new Submission');
    this.appointmentsCard = page.getByText('Appointments');

    this.potentialPatientsTab = page.getByRole('tab', { name: 'Show Potential Patients' });
    this.currentPatientsTab = page.getByRole('tab', { name: 'Show Current Patients' });

    this.newPatientLeads = page.getByText('New Patient Leads');
    this.bookedPatient = page.getByText('Booked Patient');
    this.casesSubmitted = page.getByText('Cases Submitted');
    this.designReady = page.getByText('Design Ready');

    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome to Aalto!' });
    this.gotItButton = page.getByRole('button', { name: 'Got it!' });
  }

  async open(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async dismissWelcomeModal(): Promise<void> {
    try {
      await this.gotItButton.click({ timeout: 3000 });
    } catch {
      // Modal may not appear
    }
  }

  async clickNewSubmission(): Promise<void> {
    await this.newSubmissionCard.click();
  }

  async clickPotentialPatientsTab(): Promise<void> {
    await this.potentialPatientsTab.click();
  }

  async clickCurrentPatientsTab(): Promise<void> {
    await this.currentPatientsTab.click();
  }
}
