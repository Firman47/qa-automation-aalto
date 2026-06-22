/**
 * BUG_APP Assertion Helpers
 *
 * Helpers untuk menghasilkan failure message BUG_APP yang informatif dan konsisten.
 * Setiap BUG_APP WAJIB:
 * 1. Menyebabkan test FAIL (throw Error)
 * 2. Memiliki failure message yang jelas di Playwright HTML Report
 * 3. Menjelaskan apa yang salah dan kenapa
 */

export interface ToastMismatchParams {
  testCaseId: string;
  apiStatus: number;
  apiMessage: string;
  toastMessage: string;
}

export interface BugAppParams {
  testCaseId: string;
  description?: string;
  expected: string;
  actual: string;
  apiStatus?: number;
  apiMessage?: string;
  uiMessage?: string;
}

/**
 * Assert that UI toast matches API message.
 * Jika tidak match → throw Error dengan format BUG_APP standar.
 */
export function assertToastMismatch(params: ToastMismatchParams): never {
  throw new Error(
    [
      'BUG_APP',
      '',
      `Test Case: ${params.testCaseId}`,
      '',
      'Expected (API Contract):',
      `  Toast should display: "${params.apiMessage}"`,
      '',
      'Actual (UI):',
      `  Toast displays: "${params.toastMessage}"`,
      '',
      `API Status: ${params.apiStatus}`,
      `API Message: ${params.apiMessage}`,
      `UI Toast: ${params.toastMessage}`,
      '',
      'UI toast tidak konsisten dengan API response.',
      'Test FAIL karena UI menampilkan pesan generik, bukan spesifik dari API.',
    ].join('\n'),
  );
}

/**
 * Generic BUG_APP assertion.
 * Gunakan untuk berbagai jenis ketidaksesuaian antara requirement dan actual behavior.
 */
export function assertBugApp(params: BugAppParams): never {
  const lines: string[] = ['BUG_APP', '', `Test Case: ${params.testCaseId}`];

  if (params.description) {
    lines.push(`Description: ${params.description}`);
  }

  lines.push(
    '',
    'Expected (Requirement):',
    `  ${params.expected}`,
    '',
    'Actual (Observed):',
    `  ${params.actual}`,
  );

  if (params.apiStatus !== undefined) {
    lines.push('', `API Status: ${params.apiStatus}`);
  }
  if (params.apiMessage) {
    lines.push(`API Message: ${params.apiMessage}`);
  }
  if (params.uiMessage) {
    lines.push(`UI Message: ${params.uiMessage}`);
  }

  throw new Error(lines.join('\n'));
}
