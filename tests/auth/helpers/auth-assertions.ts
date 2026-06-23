/**
 * Aalto Dentist Portal — Auth Assertion Helpers
 *
 * Standardized assertion helpers for:
 * - Toast content vs API message validation (BUG_APP detection)
 * - Response schema validation
 * - Response status validation
 */
import { expect, type Locator } from '@playwright/test';
import { assertToastMismatch } from '../../helpers/bug-assertions';
import { validateUserProfile, validateClinicInfo } from './auth-schema';

export interface ApiResponseShape {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Assert that the API response matches the expected HTTP status and body.status.
 */
export function assertApiSuccess(response: ApiResponseShape): void {
  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);
}

/**
 * Assert that the API response is an error with expected HTTP status range and body.status=false.
 */
export function assertApiError(response: ApiResponseShape, expectedStatuses: number[]): void {
  expect(expectedStatuses).toContain(response.status);
  expect(response.body.status).toBe(false);
}

/**
 * Verify that the UI toast description matches the API response message.
 * If mismatch — throws BUG_APP error via assertToastMismatch.
 */
export async function verifyToastMatchesApi(
  toastLocator: Locator,
  response: ApiResponseShape,
  testCaseId: string,
): Promise<void> {
  await expect(toastLocator).toBeVisible({ timeout: 5000 });
  const toastText = await toastLocator.textContent();
  const apiMessage = response.body.message as string;

  if (toastText !== apiMessage) {
    assertToastMismatch({
      testCaseId,
      apiStatus: response.status,
      apiMessage,
      toastMessage: toastText || '',
    });
  }
}

/**
 * Verify user profile structure from an API response data field.
 * Validates required fields and optionally checks email + context_role.
 */
export function verifyUserProfile(
  response: ApiResponseShape,
  options?: { expectedEmail?: string; expectedRole?: string },
): void {
  expect(response.status).toBe(200);
  expect(response.body.status).toBe(true);

  const data = response.body.data as Record<string, unknown>;
  expect(data).toBeDefined();

  const user = (data.user || data) as Record<string, unknown>;
  expect(user).toBeDefined();

  const validation = validateUserProfile(user);
  if (!validation.valid) {
    throw new Error(
      `User profile validation failed. Missing fields: ${validation.missing.join(', ')}`,
    );
  }

  if (options?.expectedEmail) {
    expect(user.email).toBe(options.expectedEmail);
  }
  if (options?.expectedRole) {
    expect(user.context_role).toBe(options.expectedRole);
  }
}

/**
 * Verify clinic info structure from login response data.
 */
export function verifyClinicInfo(response: ApiResponseShape): void {
  const data = response.body.data as Record<string, unknown>;
  const user = data.user as Record<string, unknown> | undefined;
  const clinic = user?.clinic || data.clinic as Record<string, unknown> | undefined;

  if (!clinic) {
    throw new Error('Clinic info is missing from the response');
  }

  const validation = validateClinicInfo(clinic);
  if (!validation.valid) {
    throw new Error(
      `Clinic info validation failed. Missing fields: ${validation.missing.join(', ')}`,
    );
  }
}
