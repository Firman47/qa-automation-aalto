# Aalto Dentist Portal — QA Automation

End-to-end test suite untuk [Aalto Dentist Portal](https://dental-monitoring.sadigit.co.id) menggunakan **Playwright** + **TypeScript**.

## Prerequisites

| Tool  | Version     | Catatan                              |
| ----- | ----------- | ------------------------------------ |
| pnpm  | `^11.8.0`   | Wajib — npm/yarn tidak didukung      |
| Node  | `^22`       |    |
| OS    | Windows/Mac | Browser Chromium ter-install otomatis |

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Install Playwright browsers (pertama kali saja)
pnpx playwright install chromium

# 3. Jalankan semua test
pnpm playwright test

# 4. Buka HTML report
pnpm playwright show-report
```

## Project Structure

```
├── playwright.config.ts          # Konfigurasi Playwright
├── package.json                  # Dependencies + engine lock
│
├── tests/                        # Root test directory
│   ├── auth/                     # Auth module (login, register, forgot, reset, me, logout)
│   │   ├── login.spec.ts         # 21 tests — AUTH-001 s.d. AUTH-023
│   │   ├── register.spec.ts      # 24 tests — REG-001 s.d. REG-026
│   │   ├── forgot-password.spec.ts
│   │   ├── reset-password.spec.ts
│   │   ├── auth-me.spec.ts
│   │   ├── logout.spec.ts
│   │   ├── pages/                # Page Objects per modul
│   │   │   ├── LoginPage.ts
│   │   │   ├── RegisterPage.ts
│   │   │   ├── ForgotPasswordPage.ts
│   │   │   ├── ResetPasswordPage.ts
│   │   │   ├── LogoutPage.ts
│   │   │   └── AuthMePage.ts
│   │   └── helpers/              # Helper spesifik auth
│   │       ├── auth-config.ts    # API_BASE, ENDPOINTS, ROUTES
│   │       ├── auth-schema.ts    # Response schema + validators
│   │       ├── auth-assertions.ts
│   │       ├── auth-state.ts     # Login/logout state helpers
│   │       ├── auth-cookies.ts   # Cookie/session helpers
│   │       ├── auth-loading.ts   # Loading state helpers
│   │       ├── auth-role.ts      # Role-based test patterns
│   │       ├── auth-helper.ts    # Utilities (countApiCalls, dll)
│   │       └── auth-fixtures.ts  # Login fixtures per role
│   │
│   ├── dashboard/                # Dashboard module (DSH-XXX)
│   ├── patients/                 # Patients/Cases module (PAT-XXX)
│   ├── leads/                    # Leads module (LDS-XXX, LDI-XXX, INV-XXX)
│   ├── cms/                      # CMS module (BLG-XXX, CAT-XXX)
│   ├── users/                    # Users module (USR-XXX)
│   ├── messages/                 # Messages module (MSG-XXX)
│   ├── settings/                 # Settings module (SET-XXX)
│   ├── smoke/                    # Smoke tests per role (SMOKE-DOC, SMOKE-ORTHO, SMOKE-ADMIN)
│   ├── data/                     # Test data lintas-modul
│   │   └── auth-test-data.ts     # DOCTOR, ORTHODONTIST, ADMIN, credentials
│   ├── fixtures.ts               # Custom fixtures global
│   └── helpers/                  # Helpers global
│       └── bug-assertions.ts      # BUG_APP assertion helpers
│
├── docs/
│   ├── API_DOCUMENTATION.md      # API contracts & error codes
│   ├── WEBSITE_DOCUMENTATION.md  # UI structure & routing
│   ├── testcases/                # Test case specifications per modul
│   │   ├── AUTH_TEST_CASES.md
│   │   ├── REGISTER_TEST_CASES.md
│   │   └── FRG_TEST_CASES.md
│   └── qa/
│       ├── BUG_REPORT_TEMPLATE.md
│       └── PLAYWRIGHT_ENGINEER_AGENT.md
│
├── playwright-report/            # HTML report output (auto-generated)
└── test-results/                 # Screenshots, video, traces (auto-generated)
```

## Test Coverage (Auth Module — 72 Tests)

| Modul          | Prefix    | Jumlah | Cakupan                                                    |
| -------------- | --------- | ------ | ---------------------------------------------------------- |
| Login          | `AUTH`    | 21     | Login valid 3 role, validasi, error handling, layout, dll  |
| Register       | `REG`     | 24     | Step 1→2 flow, password rules, error handling, double-click|
| Forgot Password| `FRG`     | 8      | Email valid/invalid, rate limit, network error             |
| Reset Password | `RST`     | 7      | Token valid/invalid, mismatch, rate limit, double login    |
| Auth Me        | `ME`      | 6      | Profile valid, expired token, API 500, all roles           |
| Logout         | `LGT`     | 6      | All roles, redirect, cookie cleanup, API 500, network err  |
| **Total**      |           | **72** | Schema validation di semua endpoint                        |

## Running Tests

```bash
# Semua test
pnpm playwright test

# Satu file
pnpm playwright test tests/auth/login.spec.ts

# Satu modul
pnpm playwright test tests/auth/

# Visible browser
pnpm playwright test --headed

# UI Mode
pnpm playwright test --ui

# Berdasarkan tag
pnpm playwright test --grep @smoke
pnpm playwright test --grep @error-handling

# Debug
pnpm playwright test --debug
```

## Test ID Convention

Setiap test memiliki ID unik sesuai modul:

| Prefix    | Modul               | Contoh              |
|-----------|---------------------|---------------------|
| `AUTH`    | Login               | `AUTH-001`          |
| `REG`     | Register            | `REG-003`           |
| `FRG`     | Forgot Password     | `FRG-002`           |
| `RST`     | Reset Password      | `RST-006`           |
| `ME`      | Auth Me             | `ME-001`            |
| `LGT`     | Logout              | `LGT-003`           |
| `DSH`     | Dashboard           | `DSH-001`           |
| `PAT`     | Patients (Cases)    | `PAT-001`           |
| `LDS`     | Lead Patients       | `LDS-001`           |
| `LDI`     | Lead Income         | `LDI-001`           |
| `INV`     | Invoices            | `INV-001`           |
| `BLG`     | Blogs               | `BLG-001`           |
| `USR`     | Users               | `USR-001`           |
| `MSG`     | Messages            | `MSG-001`           |
| `SET`     | Settings            | `SET-001`           |

## Tags

| Tag               | Kegunaan                        |
| ----------------- | ------------------------------- |
| `@smoke`          | Critical path — deployment gate |
| `@regression`     | Full regression suite           |
| `@error-handling` | Skenario error (500, timeout)   |
| `@slow`           | Test durasi > 30 detik          |
| `@flaky`          | Known flaky — prioritas fix     |

## Test Credentials

| Role          | Email                           | Password     |
| ------------- | ------------------------------- | ------------ |
| Doctor        | `tatang.doctor@gmail.com`       | `Password123!` |
| Orthodontist  | `tatang.orthodontist@gmail.com` | `Password123!` |
| Superadmin    | `tatang.admin@gmail.com`        | `Password123!` |

## Architecture

### Page Object Model

Setiap halaman memiliki Page Object di `tests/<module>/pages/`:

```typescript
// Contoh: LoginPage
export class LoginPage {
  readonly emailInput: Locator;
  readonly signInButton: Locator;

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async waitForLoginResponse(): Promise<{ status: number; body: Record<string, unknown> }> {
    const response = await this.page.waitForResponse(
      (resp) => resp.url().includes('/v1/auth/login') && resp.request().method() === 'POST',
    );
    return { status: response.status(), body: await response.json() };
  }
}
```

### Helpers

Helper reusable di `tests/auth/helpers/`:

| File               | Fungsi                                                      |
| ------------------ | ----------------------------------------------------------- |
| `auth-config.ts`   | `API_BASE`, `ENDPOINTS`, `ROUTES` — single source of truth  |
| `auth-schema.ts`   | Interface + validator untuk setiap endpoint response        |
| `auth-state.ts`    | `verifyLoggedIn()`, `verifyLoggedOut()`, `assertOnLoginPage()` |
| `auth-cookies.ts`  | `assertAccessTokenPresent()`, `assertAccessTokenAbsent()`   |
| `auth-loading.ts`  | `verifyButtonDisabledWhileLoading()`, `assertNoDoubleSubmit()` |
| `auth-role.ts`     | `forAllRoles()`, `loginAsRole()`, `assertContextRole()`     |
| `auth-assertions.ts` | `verifyToastMatchesApi()` — BUG_APP detection            |
| `auth-helper.ts`   | `assertNoApiCall()`, `countApiCalls()`                     |
| `auth-fixtures.ts` | `doctorPage`, `orthoPage`, `adminPage` — login fixtures    |

### BUG_APP Detection

Ketika UI toast tidak sesuai API message, test WAJIB FAIL dengan pesan jelas:

```typescript
// Di spec file:
const toastText = await pageObj.toastDescription.textContent();
if (toastText !== response.body.message) {
  assertToastMismatch({
    testCaseId: 'AUTH-006',
    apiStatus: 401,
    apiMessage: response.body.message as string,
    toastMessage: toastText || '',
  });
}
```

## Reports

```bash
# HTML Report (interaktif)
pnpm playwright show-report

# Trace Viewer (untuk debug test failure)
pnpm playwright show-trace test-results/<file>.zip
```

Report output:
- `playwright-report/` — HTML report
- `test-results/` — Screenshot, video, trace (hanya jika test gagal)

## Environment Variables

Bisa di-set via `.env` file atau environment:

```env
API_BASE=https://dentist-api.sadigit.co.id/v1
DOCTOR_EMAIL=tatang.doctor@gmail.com
DOCTOR_PASSWORD=Password123!
ORTHO_EMAIL=tatang.orthodontist@gmail.com
ORTHO_PASSWORD=Password123!
ADMIN_EMAIL=tatang.admin@gmail.com
ADMIN_PASSWORD=Password123!
```

## Writing Tests

### Aturan Dasar

1. **Gunakan `test.step()`** — setiap action + verification sebagai step terpisah
2. **Satu assertion per concern** — jangan gabung multiple expects
3. **Gunakan `waitForResponse`** — jangan `waitForTimeout` (kecuali microtask drain 50ms)
4. **Gunakan `getByRole`/`getByText`** — hindari CSS selector
5. **Data unik per test** — gunakan `Date.now()` untuk email/username

### Menambahkan Test Baru

```typescript
import { test, expect } from '@playwright/test';
import { XxxPage } from './pages/XxxPage';

test('[MODULE-XXX] Deskripsi skenario', async ({ page }) => {
  const pageObj = new XxxPage(page);
  await pageObj.open();

  await test.step('Action', async () => {
    await pageObj.doSomething();
  });

  await test.step('Verifikasi', async () => {
    await expect(pageObj.element).toBeVisible();
  });
});
```

## CI/CD

Pipeline sudah dikonfigurasi melalui `.github/` workflows.
Di environment CI:

- `retries: 2` — retry otomatis 2x untuk flaky tests
- `workers: 1` — sequential execution
- Screenshot + video otomatis pada failure

## Troubleshooting

| Masalah                      | Solusi                                              |
| ---------------------------- | --------------------------------------------------- |
| `EBADDEVENGINES`             | Gunakan `pnpm`, bukan `npm`                         |
| `locator not found`          | Cek DOM dengan `--headed` atau `--debug`            |
| `Timeout 30000ms exceeded`   | Server lambat — cek koneksi atau naikkan timeout    |
| Test flaky                   | Jalankan `--repeat-each=10` untuk konfirmasi        |
| Auth test gagal              | Cek apakah kredensial masih valid                   |
