# Forgot Password Module — Test Cases (FRG)

## Module Info

| Item              | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **Prefix**        | `FRG-XXX`                                                             |
| **Module**        | Forgot Password                                                       |
| **URL**           | `/auth/forgot-password`                                               |
| **API**           | `POST /v1/auth/forgot-password`                                       |
| **Related Docs**  | `docs/WEBSITE_DOCUMENTATION.md` §6.3, `docs/API_DOCUMENTATION.md` §1  |
| **Test Data**     | `tests/data/auth-test-data.ts`                                        |

---

## Forgot Password Workflow

```
User navigates to /auth/forgot-password
        ↓
┌──────────────────────────────────────────────┐
│ Form Elements:                               │
│ ├ Email* (placeholder: "your.name@example..")│
│ └ Description: "Enter your email address...  │
│    we'll send you instructions..."           │
│                                              │
│ Controls:                                    │
│ ├ "Send reset link" button                   │
│ └ "Back to login" link → /auth/login         │
└──────────────────┬───────────────────────────┘
                   ↓ (valid email)
┌──────────────────────────────────────────────┐
│ POST /v1/auth/forgot-password                │
│ ├ 200 → "Reset link sent to your email"      │
│ └ 500 → error toast                          │
└──────────────────────────────────────────────┘
```

---

## Test Scenarios

---

### FRG-001: Kirim Reset Link — Email Valid Terdaftar

**Priority:** P1

**Steps:**
1. Buka `/auth/forgot-password`
2. Verifikasi halaman forgot password muncul:
   - Deskripsi: "Enter your email address and we'll send you instructions to reset your password"
   - Field email visible
   - "Send reset link" button visible
   - "Back to login" link visible
3. Isi email dengan `tatang.doctor@gmail.com`
4. Klik "Send reset link"
5. Tangkap response API

**Expected Results:**
- API: HTTP **200**, `{ status: true, message: "Reset link sent to your email" }`
- Toast sukses muncul dengan API message
- Halaman tetap di `/auth/forgot-password`

**Selectors / Locators:**
```typescript
page.getByPlaceholder("your.name@example.com")
page.getByRole("button", { name: "Send reset link" })
page.getByRole("link", { name: "Back to login" })
page.getByText("Enter your email address")
```

**API Verification:**
```typescript
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().includes("/v1/auth/forgot-password")),
  page.getByRole("button", { name: "Send reset link" }).click(),
]);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
expect(body.message).toBe("Reset link sent to your email");
```

---

### FRG-002: Kirim Reset Link — Email Tidak Terdaftar

**Priority:** P1

**Steps:**
1. Isi email: `tidak.terdaftar@example.com`
2. Klik "Send reset link"
3. Tangkap response API

**Expected Results:**
- API: HTTP 200 atau 404 tergantung API behavior
- Jika API return 200 (tidak expose keberadaan email): toast sukses "Reset link sent"
- Jika API return 404: toast error
- Verifikasi UI toast SAMA dengan API message

---

### FRG-003: Email Kosong — Validasi Client-Side (NO API Call)

**Priority:** P1

**Steps:**
1. Biarkan email kosong
2. Klik "Send reset link"

**Expected Results:**
- Error: "Email is required" atau "Please enter your email"
- Tidak ada API call

---

### FRG-004: Email Invalid Format — Validasi Client-Side

**Priority:** P1

**Steps:**
1. Isi email: `bukan-email`
2. Klik "Send reset link"

**Expected Results:**
- Error validasi format email
- Tidak ada API call

---

### FRG-005: Back to Login Link Navigasi

**Priority:** P1

**Steps:**
1. Klik "Back to login" link
2. Verifikasi redirect ke `/auth/login`

**Expected Results:**
- URL: `https://dental-monitoring.sadigit.co.id/auth/login`
- Halaman login muncul

---

### FRG-006: API 500 — Error Handling (Route Intercept)

**Priority:** P2
**Related:** WEBSITE_DOC §10.4 Error States

**Steps:**
1. Intercept route `**/v1/auth/forgot-password` untuk return 500
2. Isi email valid
3. Klik "Send reset link"
4. Verifikasi error toast muncul

**Expected Results:**
- Toast error muncul
- Halaman tetap di `/auth/forgot-password`

---

### FRG-007: Network Error — Error Handling

**Priority:** P2

**Steps:**
1. Intercept route `**/v1/auth/forgot-password` untuk abort
2. Isi email valid
3. Klik "Send reset link"
4. Verifikasi "Connection error" toast

---

### FRG-008: Loading State Selama API Call

**Priority:** P2
**Related:** WEBSITE_DOC §10.3 Loading States

**Steps:**
1. Intercept route dengan delay 3 detik
2. Isi email valid
3. Klik "Send reset link"
4. Verifikasi button disabled + spinner
5. Response tiba, button kembali normal

---

### FRG-009: Forgot Password Page — Layout & UI Elements

**Priority:** P3
**Related:** WEBSITE_DOC §6.3 Forgot Password Page

**Steps:**
1. Buka `/auth/forgot-password`
2. Verifikasi semua UI elements

**Expected Results:**
- Deskripsi: "Enter your email address and we'll send you instructions to reset your password"
- Label Email* visible
- Placeholder: `your.name@example.com`
- "Send reset link" button (full width)
- "Back to login" link
- Same layout as login page (split screen with left panel)

---

## Test Matrix

| ID      | Description                               | Priority | Type              | API Endpoint            | Tags            |
| ------- | ----------------------------------------- | -------- | ----------------- | ----------------------- | --------------- |
| FRG-001 | Kirim reset link — email valid            | P1       | Positive          | POST /forgot-password   | @smoke          |
| FRG-002 | Kirim reset link — email tidak terdaftar  | P1       | Negative          | POST /forgot-password   | @regression     |
| FRG-003 | Email kosong — validasi client-side       | P1       | Client Validation | — (no API)              | @regression     |
| FRG-004 | Email invalid format — validasi           | P1       | Client Validation | — (no API)              | @regression     |
| FRG-005 | Back to login link navigasi               | P1       | Navigation        | —                       | @regression     |
| FRG-006 | API 500 — error handling                  | P2       | Error Handling    | POST /forgot-password   | @error-handling |
| FRG-007 | Network error — error handling            | P2       | Error Handling    | POST /forgot-password   | @error-handling |
| FRG-008 | Loading state selama API call             | P2       | UI State          | POST /forgot-password   | @regression     |
| FRG-009 | Forgot password page layout & UI elements | P3       | UI Verification   | —                       | @regression     |

---

## Related API Endpoints

| Method | Endpoint                     | Auth | Description                  |
| ------ | ---------------------------- | ---- | ---------------------------- |
| POST   | `/v1/auth/forgot-password`   | No   | Kirim reset link ke email    |
| POST   | `/v1/auth/reset-password`    | No   | Reset password dengan token  |
