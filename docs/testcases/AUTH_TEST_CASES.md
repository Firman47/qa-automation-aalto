# Login Module — Test Cases (AUTH)

## Module Info

| Item              | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Prefix**        | `AUTH-XXX`                                                   |
| **Module**        | Login                                                        |
| **URL**           | `/auth/login`                                                |
| **API**           | `POST /v1/auth/login`                                        |
| **Related Docs**  | `docs/WEBSITE_DOCUMENTATION.md` §6.1, `docs/API_DOCUMENTATION.md` §1 |
| **Test Data**     | `tests/data/auth-test-data.ts`                               |
| **Setup Workflow**| `QA-Workflow–Setup-Awal.md` — Setup awal DM + AALTO           |

## Test Credentials

| Role          | Email                           | Password         | context_role |
| ------------- | ------------------------------- | ---------------- | ------------ |
| Doctor        | `tatang.doctor@gmail.com`       | `Password123!`   | `dentist`    |
| Orthodontist  | `tatang.orthodontist@gmail.com` | `Password123!`   | `orthodontist` |
| Superadmin    | `tatang.admin@gmail.com`        | `Password123!`   | `superadmin` |

---

## Auth Workflow

```
User navigates to /auth/login
        ↓
User fills email + password fields
        ↓
User clicks "SIGN IN"
        ↓
┌──────────────────────────────────────────────┐
│ Client-side validation                       │
│ ├ Email empty → "Email is required"          │
│ ├ Password empty → "Password is required"    │
│ └ Blocked at UI, NO API call                 │
└──────────────────────┬───────────────────────┘
                       ↓ (if valid)
┌──────────────────────────────────────────────┐
│ POST /v1/auth/login                          │
│ ├ 200 Success → redirect to /dashboard       │
│ ├ 200 Double Login → show token input form   │
│ ├ 401 Invalid → error toast                  │
│ ├ 403 Password Expired → warning toast       │
│ ├ 403 Account Locked → lockout toast         │
│ └ 429 Rate Limited → "Too many requests"     │
└──────────────────────────────────────────────┘
                       ↓ (on success)
Redirect to /dashboard with greeting "Good X, {Name}"
```

---

## Test Scenarios

---

### AUTH-001: Login Valid Doctor — Redirect ke Dashboard

**Priority:** P0 (Smoke)
**Related:** SMOKE-DOC

**Preconditions:**
- No existing session
- User on `/auth/login`

**Steps:**
1. Verifikasi semua elemen halaman login muncul
2. Isi email dengan `tatang.doctor@gmail.com`
3. Isi password dengan `Password123!`
4. Klik "SIGN IN"
5. Tangkap response API
6. Verifikasi redirect ke `/dashboard`
7. Verifikasi greeting muncul

**Expected Results:**
- API response: `{ status: true, message: "Login successful", data: { user: { ... }, token: "..." } }`
- HTTP status: **200**
- Response body: `status: true`
- Redirect ke `https://dental-monitoring.sadigit.co.id/dashboard`
- Dashboard menampilkan greeting "Good morning/afternoon/evening, Tatang Doctor 👋"

**Selectors / Locators:**
- Email input: `page.getByPlaceholder("your.email@example.com")`
- Password input: `page.getByPlaceholder("••••••••")`
- SIGN IN button: `page.getByRole("button", { name: "SIGN IN" })`
- Dashboard greeting: `page.getByText(/Good (morning|afternoon|evening)/)`

**API Verification:**
```typescript
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().includes("/v1/auth/login")),
  page.getByRole("button", { name: "SIGN IN" }).click(),
]);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
expect(body.data.user).toBeDefined();
expect(body.data.user.email).toBe("tatang.doctor@gmail.com");
expect(body.data.user.context_role).toBe("dentist");
```

---

### AUTH-002: Login Valid Orthodontist — Redirect ke Dashboard

**Priority:** P0 (Smoke)
**Related:** SMOKE-ORTHO

**Identical to AUTH-001** but with `tatang.orthodontist@gmail.com`.

**Verified:**
- `context_role` is `orthodontist`
- Dashboard greeting shows "Tatang Orthodontist"

---

### AUTH-003: Login Valid Superadmin — Redirect ke Dashboard

**Priority:** P0 (Smoke)
**Related:** SMOKE-ADMIN

**Identical to AUTH-001** but with `tatang.admin@gmail.com`.

**Verified:**
- `context_role` is `superadmin`
- Dashboard greeting shows "Tatang Admin"

---

### AUTH-004: Email Kosong — Validasi Client-Side (NO API Call)

**Priority:** P1

**Steps:**
1. Biarkan email kosong
2. Isi password valid
3. Klik "SIGN IN"
4. Verifikasi error muncul DI BAWAH field email (bukan toast)
5. Verifikasi TIDAK ada API call ke `/v1/auth/login`

**Expected Results:**
- Error message: "Email is required" muncul di bawah field email
- Tidak ada request POST `/v1/auth/login` yang terkirim
- Halaman tetap di `/auth/login`

**Selectors / Locators:**
- Error message: `page.getByText("Email is required")` atau inline validation element

**Client-Side Verification:**
```typescript
let loginRequestCount = 0;
page.on("request", (req) => {
  if (req.url().includes("/v1/auth/login") && req.method() === "POST")
    loginRequestCount++;
});
await loginPage.clickSignIn();
await page.waitForTimeout(100); // microtask drain
expect(loginRequestCount).toBe(0);
```

---

### AUTH-005: Password Kosong — Validasi Client-Side (NO API Call)

**Priority:** P1

**Steps:**
1. Isi email valid
2. Biarkan password kosong
3. Klik "SIGN IN"
4. Verifikasi error muncul DI BAWAH field password
5. Verifikasi TIDAK ada API call

**Expected Results:**
- Error message: "Password is required" muncul di bawah field password
- Tidak ada request POST `/v1/auth/login`

---

### AUTH-006: Email & Password Kosong — Validasi Ganda (NO API Call)

**Priority:** P1

**Steps:**
1. Biarkan email kosong
2. Biarkan password kosong
3. Klik "SIGN IN"
4. Verifikasi kedua error muncul

**Expected Results:**
- "Email is required" dan "Password is required" muncul bersamaan
- Tidak ada request API

---

### AUTH-007: Email Invalid Format — Validasi Client-Side (NO API Call)

**Priority:** P1

**Steps:**
1. Isi email dengan string bukan format email: `bukanemail`
2. Isi password valid
3. Klik "SIGN IN"
4. Verifikasi error validasi format email muncul

**Expected Results:**
- Error: "Please enter a valid email address" atau serupa muncul
- Tidak ada request API

---

### AUTH-008: Show/Hide Password Toggle

**Priority:** P2

**Steps:**
1. Isi password field
2. Klik toggle "Show password" button (icon: eye)
3. Verifikasi type input berubah menjadi `text`
4. Klik toggle "Hide password" button
5. Verifikasi type input kembali menjadi `password`

**Expected Results:**
- Saat show: input type = `text`, password terlihat
- Saat hide: input type = `password`, password tersembunyi

**Selectors / Locators:**
- Toggle show: `page.getByRole("button", { name: "Show password" })`
- Toggle hide: `page.getByRole("button", { name: "Hide password" })`

**Verification:**
```typescript
const type = await passwordInput.getAttribute("type");
expect(type).toBe("text"); // after show
expect(type).toBe("password"); // after hide
```

---

### AUTH-009: Forgot Password Link Navigasi

**Priority:** P1

**Steps:**
1. Klik "Forgot password?" link
2. Verifikasi redirect ke `/auth/forgot-password`

**Expected Results:**
- URL berubah ke `https://dental-monitoring.sadigit.co.id/auth/forgot-password`
- Halaman forgot password muncul dengan field email + tombol "Send reset link"

**Selectors / Locators:**
- Link: `page.getByRole("link", { name: "Forgot password?" })`

---

### AUTH-010: Register Link Navigasi

**Priority:** P1

**Steps:**
1. Klik "Create Free Account →" link
2. Verifikasi redirect ke `/auth/register`

**Expected Results:**
- URL berubah ke `https://dental-monitoring.sadigit.co.id/auth/register`
- Halaman register (Step 1) muncul

**Selectors / Locators:**
- Link: `page.getByRole("link", { name: /Create Free Account/ })`

---

### AUTH-011: Invalid Credentials — Error Toast dari API

**Priority:** P1
**Related:** WEBSITE_DOC §6.1 Behavior Table, API_DOC §1 POST /login

**Preconditions:**
- Rate limit counter available (pastikan belum kena limit)

**Steps:**
1. Isi email: `tatang.doctor@gmail.com`
2. Isi password: `SalahPassword123!`
3. Klik "SIGN IN"
4. Tangkap response API
5. Verifikasi error toast dengan message dari API

**Expected Results:**
- API HTTP status: **401**
- API response: `{ status: false, message: "Invalid credentials", errors: { email: ["Invalid email or password"] } }`
- Toast muncul: `data-slot="title"` menunjukkan "Error" (merah)
- Toast description: SAMA dengan `response.body.message`
- Halaman TETAP di `/auth/login`

**Selectors / Locators:**
- Toast title: `page.locator('[data-slot="title"]')`
- Toast description: `page.locator('[data-slot="description"]')`
- API response: `page.waitForResponse((r) => r.url().includes("/v1/auth/login"))`

**BUG_APP Detection:**
```typescript
const response = await page.waitForResponse((r) =>
  r.url().includes("/v1/auth/login"),
);
const body = await response.json();
const toastText = await page.locator('[data-slot="description"]').textContent();
if (toastText !== body.message) {
  // BUG_APP: UI toast ≠ API message
  assertToastMismatch({
    testCaseId: "AUTH-011",
    apiStatus: response.status(),
    apiMessage: body.message,
    toastMessage: toastText || "",
  });
}
```

---

### AUTH-012: Email Tidak Terdaftar — Error Toast dari API

**Priority:** P1

**Steps:**
1. Isi email: `tidak.terdaftar@example.com`
2. Isi password: `Password123!`
3. Klik "SIGN IN"
4. Tangkap response API
5. Verifikasi error toast

**Expected Results:**
- API HTTP status: **401**
- API message: "Invalid credentials" atau "Invalid email or password"
- Toast muncul dengan message yang SAMA dengan API

---

### AUTH-013: Loading State Selama API Call

**Priority:** P2
**Related:** WEBSITE_DOC §10.3 Loading States

**Steps:**
1. Isi email + password valid
2. Klik "SIGN IN"
3. Selama API call berlangsung, verifikasi:
   - Button "SIGN IN" disabled
   - Spinner muncul di dalam button
4. Setelah API response, verifikasi button kembali enabled (redirect terjadi)

**Expected Results:**
- Button disabled + spinner selama loading
- Button kembali normal setelah selesai

---

### AUTH-014: Response Structure Verification

**Priority:** P2
**Related:** API_DOC §1 POST /login — Success Response Schema

**Steps:**
1. Login dengan kredensial valid
2. Tangkap response API
3. Verifikasi struktur response

**Expected Results — Response body WAJIB contain:**
```typescript
expect(body.status).toBe(true);
expect(body.message).toBe("Login successful");
expect(body.data).toBeDefined();
expect(body.data.user).toBeDefined();
expect(body.data.user.id).toBeDefined();
expect(body.data.user.email).toBeDefined();
expect(body.data.user.role).toBeDefined();
expect(body.data.user.context_role).toBeDefined();
expect(body.data.user.full_name).toBeDefined();
expect(body.data.user.clinic).toBeDefined();
expect(body.data.user.clinic.name).toBeDefined();
```

---

### AUTH-015: Rate Limit (429) — Terlalu Banyak Permintaan

**Priority:** P2
**Related:** API_DOC §1 — Rate Limit

**Preconditions:**
- Harus dikirim 5+ request login dalam 60 detik

**Steps:**
1. Kirim 5 request login berturut-turut dengan kredensial salah
2. Kirim request ke-6
3. Verifikasi HTTP status **429**
4. Verifikasi response: `{ status: false, message: "Too many requests" }`
5. Verifikasi toast "Too many requests" muncul
6. Verifikasi header `RateLimit-Remaining: 0` ada di response

**Expected Results:**
- HTTP 429 dengan message "Too many requests"
- Rate limit headers present: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `RateLimit-Policy`
- Toast muncul dengan API message

**Note:** End-to-end test ini memerlukan rate limit counter yang ter-reset. Bisa menggunakan route interception untuk mensimulasi response 429 tanpa benar-benar kena rate limit.

---

### AUTH-016: API 500 — Error Handling (Route Intercept)

**Priority:** P2
**Related:** WEBSITE_DOC §10.4 Error States, API_DOC §1

**Steps:**
1. Intercept route `**/v1/auth/login` untuk return 500
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi error toast muncul

**Expected Results:**
- Toast dengan message "Internal Server Error" atau generic error
- Halaman tetap di `/auth/login`

---

### AUTH-017: Network Error — Error Handling (Route Abort)

**Priority:** P2
**Related:** WEBSITE_DOC §10.4 Error States

**Steps:**
1. Intercept route `**/v1/auth/login` untuk abort dengan `internetdisconnected`
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi toast "Connection error" muncul

---

### AUTH-018: Slow Response — Loading State Persists

**Priority:** P2
**Related:** WEBSITE_DOC §10.3 Loading States

**Steps:**
1. Intercept route `**/v1/auth/login` dengan delay 5 detik
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi button disabled + spinner selama 5 detik
5. Response tiba, verifikasi redirect ke dashboard

---

### AUTH-019: Login Page — Layout & UI Elements Verification

**Priority:** P3
**Related:** WEBSITE_DOC §6.1 Login Page — Full Layout

**Steps:**
1. Buka `/auth/login`
2. Verifikasi semua elemen layout muncul

**Expected Results — Left Panel:**
- "DID YOU KNOW?" section visible
- Rotating dental statistics visible
- Feature tags: "Orthodontist Support", "Remote Monitoring", "AI Assisted Workflow"
- Tagline: "The clear aligner operating system for dentists."

**Expected Results — Right Panel Form:**
- Label "Welcome back." visible
- Subtitle "Sign in to your practice dashboard" visible
- Label "Email*" visible
- Label "Password*" visible
- Placeholder email: `your.email@example.com`
- Placeholder password: `••••••••`
- Show/Hide password toggle button visible
- "SIGN IN" button (uppercase, full width, primary color) visible
- "Forgot password?" link visible
- "Create Free Account →" link visible

**Expected Results — Footer:**
- "Protected by Aalto · 256-bit encryption · HIPAA compliant" visible

**Selectors / Locators:**
```typescript
page.getByText("Welcome back.")
page.getByText("Sign in to your practice dashboard")
page.getByText("Email*")
page.getByText("Password*")
page.getByPlaceholder("your.email@example.com")
page.getByPlaceholder("••••••••")
page.getByRole("button", { name: "SIGN IN" })
page.getByRole("link", { name: "Forgot password?" })
page.getByRole("link", { name: /Create Free Account/ })
page.getByText("Protected by Aalto")
```

---

### AUTH-020: Password Expiry Warning (200 with Warning)

**Priority:** P3
**Related:** API_DOC §1 — Password Expiry Warning

**Note:** Test ini menggunakan route interception karena memerlukan state password yang mendekati expiry.

**Steps:**
1. Intercept route `**/v1/auth/login` untuk return 200 dengan expiry warning:
   ```json
   { "status": true, "message": "Login successful. Warning: Your password will expire in 2 days.", "data": null }
   ```
2. Isi email + password valid
3. Klik "SIGN IN"
4. Verifikasi warning toast muncul (bukan success toast)
5. Verifikasi redirect ke dashboard tetap terjadi

**Expected Results:**
- HTTP 200 dengan `status: true`
- Toast ber-warna warning (yellow) dengan message "Your password will expire in 2 days"
- Redirect ke `/dashboard`

---

### AUTH-021: Account Locked (403) — Simulasi via Route Intercept

**Priority:** P3
**Related:** API_DOC §1 — Account Locked, WEBSITE_DOC §6.1 Behavior Table

**Steps:**
1. Intercept route `**/v1/auth/login` untuk return 403:
   ```json
   { "status": false, "message": "Account has been locked due to too many failed login attempts. Please try again in 30 minutes.", "data": null }
   ```
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi error toast dengan message tersebut

**Expected Results:**
- HTTP 403
- Toast: "Account has been locked due to too many failed login attempts..."
- Halaman tetap di `/auth/login`

---

### AUTH-022: Double Login Required (200 with requires_double_login)

**Priority:** P3
**Related:** API_DOC §1 — Double Login Required

**Steps:**
1. Intercept route `**/v1/auth/login` untuk return 200 dengan double login:
   ```json
   { "status": true, "message": "Double login confirmation required. Please check your email for confirmation token.", "data": { "requires_double_login": true, "email": "user@example.com", "message": "A confirmation email has been sent..." } }
   ```
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi UI berubah ke form input token
5. Verifikasi instruksi "check your email for confirmation token"

**Expected Results:**
- UI menampilkan form input token (bukan redirect ke dashboard)
- Field untuk memasukkan token dari email
- Instruksi untuk cek email

---

### AUTH-023: Remember Me Checkbox Persistence

**Priority:** P3

**Note:** Jika ada "remember me" checkbox di form login (API field `remember`), verifikasi fungsionalitasnya.

**Steps:**
1. Isi email + password valid
2. Centang "Remember me" (jika ada)
3. Klik "SIGN IN"
4. Tangkap request body API
5. Verifikasi `remember: true` dikirim ke API

**Expected Results:**
- Request body contains `remember: true`

---

## Test Matrix

| ID       | Description                               | Priority | Type            | API Endpoint   | Tags            |
| -------- | ----------------------------------------- | -------- | --------------- | -------------- | --------------- |
| AUTH-001 | Login valid doctor                        | P0       | Positive        | POST /login    | @smoke          |
| AUTH-002 | Login valid orthodontist                  | P0       | Positive        | POST /login    | @smoke          |
| AUTH-003 | Login valid superadmin                    | P0       | Positive        | POST /login    | @smoke          |
| AUTH-004 | Email kosong — validasi client-side       | P1       | Client Validation| — (no API)    | @regression     |
| AUTH-005 | Password kosong — validasi client-side    | P1       | Client Validation| — (no API)    | @regression     |
| AUTH-006 | Email & password kosong — validasi ganda  | P1       | Client Validation| — (no API)    | @regression     |
| AUTH-007 | Email invalid format — validasi client    | P1       | Client Validation| — (no API)    | @regression     |
| AUTH-008 | Show/hide password toggle                 | P2       | UI Component     | —             | @regression     |
| AUTH-009 | Forgot password link navigasi             | P1       | Navigation       | —             | @regression     |
| AUTH-010 | Register link navigasi                    | P1       | Navigation       | —             | @regression     |
| AUTH-011 | Invalid credentials — error toast         | P1       | Negative         | POST /login    | @regression     |
| AUTH-012 | Email tidak terdaftar — error toast       | P1       | Negative         | POST /login    | @regression     |
| AUTH-013 | Loading state selama API call             | P2       | UI State         | POST /login    | @regression     |
| AUTH-014 | Response structure verification           | P2       | API Contract     | POST /login    | @regression     |
| AUTH-015 | Rate limit (429)                          | P2       | Error Handling   | POST /login    | @error-handling |
| AUTH-016 | API 500 — error handling                  | P2       | Error Handling   | POST /login    | @error-handling |
| AUTH-017 | Network error — error handling            | P2       | Error Handling   | POST /login    | @error-handling |
| AUTH-018 | Slow response — loading state persists    | P2       | Error Handling   | POST /login    | @error-handling |
| AUTH-019 | Login page layout & UI elements           | P3       | UI Verification  | —             | @regression     |
| AUTH-020 | Password expiry warning (intercept)       | P3       | Error Handling   | POST /login    | @error-handling |
| AUTH-021 | Account locked (intercept)                | P3       | Error Handling   | POST /login    | @error-handling |
| AUTH-022 | Double login required (intercept)         | P3       | Error Handling   | POST /login    | @error-handling |
| AUTH-023 | Remember me checkbox persistence          | P3       | Positive         | POST /login    | @regression     |

---

## Role-Based Smoke Tests

Login smoke tests untuk setiap role sudah dipisahkan ke `tests/smoke/`:

| File                        | Test ID     | Role          |
| --------------------------- | ----------- | ------------- |
| `tests/smoke/doctor-login.spec.ts`     | SMOKE-DOC   | Doctor        |
| `tests/smoke/orthodontist-login.spec.ts` | SMOKE-ORTHO | Orthodontist  |
| `tests/smoke/admin-login.spec.ts`      | SMOKE-ADMIN | Superadmin    |

---

## Related API Endpoints

| Method | Endpoint                        | Auth | Description                     |
| ------ | ------------------------------- | ---- | ------------------------------- |
| POST   | `/v1/auth/login`                | No   | Login dengan email + password   |
| POST   | `/v1/auth/logout`               | Yes  | Logout session                  |
| GET    | `/v1/auth/me`                   | Yes  | Get current user profile        |
| POST   | `/v1/auth/forgot-password`      | No   | Kirim reset link ke email       |
| POST   | `/v1/auth/reset-password`       | No   | Reset password dengan token     |
| POST   | `/v1/auth/confirm-double-login` | No   | Konfirmasi double login         |
