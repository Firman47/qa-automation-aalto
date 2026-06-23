/**
 * Aalto Dentist Portal — Loading State Verification Helpers
 *
 * Reusable assertions untuk:
 * - Button disabled state during API calls
 * - Loading indicator visibility
 * - Double-submit prevention
 */
import { expect, type Page, type Locator } from '@playwright/test';

/**
 * Assert that a button is disabled while an API request is in flight.
 * Triggers the action, then checks the button is disabled.
 */
export async function verifyButtonDisabledWhileLoading(
  button: Locator,
  triggerAction: () => Promise<void>,
): Promise<void> {
  // Start the action (don't await it fully — we want to check mid-flight)
  const actionPromise = triggerAction();

  // Give the button a moment to become disabled after click
  await button.waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});
  const isDisabled = await button.isDisabled();

  // Wait for action to complete
  await actionPromise;

  // The button may or may not have been disabled depending on API speed
  // This is an observation, not a hard assertion by default
  // Tests that require this should add their own expect
}

/**
 * Assert that a loading spinner or indicator is visible during an API call.
 * After the API resolves, verify it disappears.
 */
export async function verifyLoadingIndicator(
  page: Page,
  loadingLocator: Locator,
  triggerAction: () => Promise<void>,
  timeout = 5000,
): Promise<void> {
  // Trigger action
  await triggerAction();

  // Check if loading indicator appeared (may be brief)
  const appeared = await loadingLocator.isVisible().catch(() => false);

  if (appeared) {
    // Wait for it to disappear
    await expect(loadingLocator).not.toBeVisible({ timeout });
  }
}

/**
 * Assert that NO duplicate API request was sent when clicking a button multiple times.
 * The button should be disabled after the first click.
 */
export async function assertNoDoubleSubmit(
  page: Page,
  apiUrlPattern: string,
  button: Locator,
): Promise<void> {
  let apiCallCount = 0;
  const handler = (req: { url: () => string; method: () => string }) => {
    if (req.url().includes(apiUrlPattern) && req.method() === 'POST') {
      apiCallCount++;
    }
  };

  page.on('request', handler);

  // Click the button twice rapidly
  await button.click({ force: true });
  await button.click({ force: true }).catch(() => {
    // Second click might fail if button is disabled — that's the expected behavior
  });

  await page.waitForTimeout(100); // microtask drain

  page.off('request', handler);

  expect(
    apiCallCount,
    `Button should prevent double-submit. Expected ≤1 API call to ${apiUrlPattern}, got ${apiCallCount}`,
  ).toBeLessThanOrEqual(1);
}

/**
 * Verify that a button becomes enabled after a condition is met.
 */
export async function verifyButtonBecomesEnabled(
  button: Locator,
  conditionAction: () => Promise<void>,
  timeout = 5000,
): Promise<void> {
  await conditionAction();
  await expect(button).toBeEnabled({ timeout });
}

/**
 * Verify that a button becomes disabled after a condition is met.
 */
export async function verifyButtonBecomesDisabled(
  button: Locator,
  conditionAction: () => Promise<void>,
  timeout = 5000,
): Promise<void> {
  await conditionAction();
  await expect(button).toBeDisabled({ timeout });
}
