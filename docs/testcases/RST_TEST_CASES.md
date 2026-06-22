# Reset Password & Double Login Module — Test Cases (RST)

## Module Info

| Item              | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **Prefix**        | `RST-XXX`                                                             |
| **Module**        | Reset Password & Double Login Confirmation                            |
| **API Endpoints** | `POST /v1/auth/reset-password`, `POST /v1/auth/confirm-double-login`   |
| **Related Docs**  | `docs/API_DOCUMENTATION.md` §1 — Reset Password, Double Login          |
| **Test Data**     | `tests/data/auth-test-data.ts`                                        |

---

## Workflows

### Reset Password Workflow

```
User receives reset link via email
        ↓
User clicks link → opens reset password form
        ↓
┌──────────────────────────────────────────────┐
│ POST /v1/auth/reset-password                 │
│ Request: { token, password, password_confirm }│
│ ├ 200 → "Password has been reset successfully"│
│ └ 400 → Invalid/expired token error          │
└──────────────────────────────────────────────┘
        ↓
User can login with new password
```

### Double Login Confirmation Workflow

```
User logs in from new device/location
        ↓
API returns requires_double_login: true
        ↓
User receives confirmation token via email
        ↓
┌──────────────────────────────────────────────┐
│ POST /v1/auth/confirm-double-login           │
│ Request: { token }                           │
│ ├ 200 → "Login confirmed. Previous session   │
│ │        has been logged out."               │
│ └ 400/401 → Invalid token                    │
└──────────────────────────────────────────────┘
```

---

## Test Scenarios

---

### RST-001: Reset Password — Valid Token (API Only)

**Priority:** P2
**Related:** API_DOC §1 — POST /auth/reset-password

**Note:** Test ini dilakukan via API langsung menggunakan `request` context karena memerlukan token dari email yang tidak bisa diakses via UI.

**Steps:**
1. Kirim forgot password request untuk email terdaftar (FRG-001)
2. Dapatkan reset token (simulasi — token dari email)
3. Kirim POST `/v1/auth/reset-password` dengan token valid

**Expected Results:**
- API: HTTP **200**, `{ status: true, message: "Password has been reset successfully. You can now login with your new password." }`

```typescript
const response = await request.post(
  "https://dentist-api.sadigit.co.id/v1/auth/reset-password",
  {
    data: {
      token: resetToken,
      password: "NewPassword123!",
      password_confirmation: "NewPassword123!",
    },
  },
);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
```

---

### RST-002: Reset Password — Invalid Expired Token (API Only)

**Priority:** P2

**Steps:**
1. Kirim POST `/v1/auth/reset-password` dengan token invalid

**Expected Results:**
- API: HTTP **400** atau **401**
- `status: false`
- Message: "Invalid or expired token"

---

### RST-003: Reset Password — Token Kosong (API Only)

**Priority:** P2

**Steps:**
1. Kirim POST `/v1/auth/reset-password` dengan token empty string

**Expected Results:**
- API: HTTP **400**
- `status: false`
- Message: "Token is required"

---

### RST-004: Reset Password — Password Confirmation Mismatch (API Only)

**Priority:** P2

**Steps:**
1. Kirim POST dengan token valid, tapi `password !== password_confirmation`

**Expected Results:**
- API: HTTP **422** atau **400**
- Error: "Passwords do not match"

---

### RST-005: Double Login — Confirm Success (API Only)

**Priority:** P2
**Related:** API_DOC §1 — POST /auth/confirm-double-login

**Note:** Test ini dilakukan via API langsung karena memerlukan state double login + confirmation token dari email.

**Steps:**
1. Kirim POST `/v1/auth/confirm-double-login` dengan token valid

**Expected Results:**
- API: HTTP **200**, `{ status: true, message: "Login confirmed. Previous session has been logged out." }`

```typescript
const response = await request.post(
  "https://dentist-api.sadigit.co.id/v1/auth/confirm-double-login",
  {
    data: { token: confirmationToken },
  },
);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
expect(body.message).toBe("Login confirmed. Previous session has been logged out.");
```

---

### RST-006: Double Login — Invalid Token (API Only)

**Priority:** P2

**Steps:**
1. Kirim POST `/v1/auth/confirm-double-login` dengan token invalid

**Expected Results:**
- API: HTTP **400** atau **401**
- `status: false`
- Message: "Invalid or expired token"

---

### RST-007: Double Login — Token Kosong (API Only)

**Priority:** P2

**Steps:**
1. Kirim POST `/v1/auth/confirm-double-login` dengan token empty string

**Expected Results:**
- API: HTTP **400**
- `status: false`
- Message: "Token is required"

---

### RST-008: Double Login — UI Verification (After Intercept)

**Priority:** P2
**Related:** WEBSITE_DOC §6.1 Behavior Table — Double Login

**Steps:**
1. Intercept `/v1/auth/login` untuk return 200 dengan `requires_double_login: true`
2. Isi email + password
3. Klik "SIGN IN"
4. Verifikasi UI berubah menjadi form input token
5. Isi token (mock)
6. Klik confirm/submit
7. Verifikasi request POST `/v1/auth/confirm-double-login` terkirim

**Expected Results:**
- Setelah login dengan double login flag:
  - Token input form muncul (bukan redirect ke dashboard)
  - Instruksi "check your email" visible
- Setelah submit token:
  - API `/v1/auth/confirm-double-login` terpanggil
  - Jika success → redirect ke dashboard
  - Jika fail → error toast

---

### RST-009: Reset Password — Flow End-to-End (Verify via UI)

**Priority:** P3

**Steps:**
1. Forgot password untuk email terdaftar (API call)
2. Dapatkan reset token (simulasi — perlu akses email atau test mode)
3. Reset password via API (RST-001)
4. Login dengan password baru via UI
5. Verifikasi login sukses
6. (Cleanup) Reset password kembali ke original via API

**Expected Results:**
- Full flow: forgot password → reset → login with new password → success

---

## Test Matrix

| ID      | Description                                       | Priority | Type            | API Endpoint                   | Tags            |
| ------- | ------------------------------------------------- | -------- | --------------- | ------------------------------ | --------------- |
| RST-001 | Reset password — valid token (API only)           | P2       | Positive        | POST /auth/reset-password      | @regression     |
| RST-002 | Reset password — invalid token (API only)         | P2       | Negative        | POST /auth/reset-password      | @error-handling |
| RST-003 | Reset password — token kosong (API only)          | P2       | Negative        | POST /auth/reset-password      | @regression     |
| RST-004 | Reset password — password mismatch (API only)     | P2       | Negative        | POST /auth/reset-password      | @regression     |
| RST-005 | Double login — confirm success (API only)         | P2       | Positive        | POST /auth/confirm-double-login| @regression     |
| RST-006 | Double login — invalid token (API only)           | P2       | Negative        | POST /auth/confirm-double-login| @error-handling |
| RST-007 | Double login — token kosong (API only)            | P2       | Negative        | POST /auth/confirm-double-login| @regression     |
| RST-008 | Double login — UI verification (intercept)        | P2       | UI Verification | POST /login + POST /confirm    | @regression     |
| RST-009 | Reset password — end-to-end flow via UI           | P3       | Positive        | POST /reset-password + /login  | @regression     |

---

## Related API Endpoints

| Method | Endpoint                        | Auth | Description                     |
| ------ | ------------------------------- | ---- | ------------------------------- |
| POST   | `/v1/auth/reset-password`       | No   | Reset password dengan token     |
| POST   | `/v1/auth/confirm-double-login` | No   | Konfirmasi double login         |
| POST   | `/v1/auth/forgot-password`      | No   | Kirim reset link ke email       |
| POST   | `/v1/auth/login`                | No   | Verifikasi login dengan password baru |
