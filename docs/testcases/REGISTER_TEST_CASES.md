# Register Module — Test Cases (REG)

## Module Info

| Item              | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **Prefix**        | `REG-XXX`                                                             |
| **Module**        | Register                                                              |
| **URL**           | `/auth/register`                                                      |
| **API**           | `POST /v1/auth/register`                                              |
| **Related Docs**  | `docs/WEBSITE_DOCUMENTATION.md` §6.2, `docs/API_DOCUMENTATION.md` §1  |
| **Test Data**     | `tests/data/auth-test-data.ts`                                        |
| **Setup Workflow**| `QA-Workflow–Setup-Awal.md` — Setup awal DM + AALTO                   |

---

## Register Workflow

```
User navigates to /auth/register
        ↓
┌──────────────────────────────────────────────┐
│ Step 1 — Personal Information                │
│ Fields:                                      │
│ ├ First Name* (text, placeholder: "John")    │
│ ├ Last Name* (text, placeholder: "Doe")      │
│ ├ Phone Number* (tel, country code + number) │
│ ├ Email* (email, placeholder: "your.email..")│
│ ├ Experience Level* (combobox)               │
│ ├ Password* (password, placeholder: "Create")│
│ ├ Confirm Password* (password, placeholder)  │
│ └ Referral Code (text, optional)             │
│                                              │
│ Password Requirements (live checklist):       │
│ ├ Min 12 characters                          │
│ ├ 1+ uppercase letter                        │
│ ├ 1+ lowercase letter                        │
│ ├ 1+ number                                  │
│ └ 1+ special character                       │
│                                              │
│ Password Strength Bar (0-100%):              │
│ ├ 0-20% Red (Very Weak)                      │
│ ├ 21-40% Orange (Weak)                       │
│ ├ 41-60% Yellow (Fair)                       │
│ ├ 61-80% Lime (Strong)                       │
│ └ 81-100% Green (Very Strong)                │
│                                              │
│ Checkbox: I agree to Terms & Privacy Policy  │
│ Button: "Next" (disabled until valid)        │
└──────────────────┬───────────────────────────┘
                   ↓ (Step 1 valid)
┌──────────────────────────────────────────────┐
│ Step 2 — Practice Information                │
│ Fields:                                      │
│ ├ Practice Name (text)                       │
│ ├ Practice Address (text)                    │
│ ├ Practice Phone (tel)                       │
│ └ Role in Practice (text/select)             │
│                                              │
│ Button: "Create Account"                     │
└──────────────────┬───────────────────────────┘
                   ↓ (submitted)
┌──────────────────────────────────────────────┐
│ POST /v1/auth/register                       │
│ ├ 201 Created → redirect to /auth/login      │
│ ├ 409 Conflict → error toast                 │
│ ├ 422 Validation → field errors              │
│ └ 500 Server Error → error toast             │
└──────────────────────────────────────────────┘
```

---

## Test Scenarios

---

### REG-001: Register Sukses — Semua Data Valid, Full Flow

**Priority:** P1

**Preconditions:**
- Belum ada user dengan email yang akan digunakan
- Generate data unik menggunakan `Date.now()`

**Steps:**
1. Buka `/auth/register`
2. Verifikasi layout Step 1 muncul
3. Isi Step 1 dengan data valid:
   - First Name: `Test`
   - Last Name: `User`
   - Phone: `+614` + 9 digit random
   - Email: `test_{timestamp}@example.com`
   - Experience Level: pilih opsi pertama
   - Password & Confirm: `Password123!`
   - Referral Code: kosong
4. Centang checkbox Terms & Privacy
5. Klik "Next"
6. Verifikasi Step 2 muncul (Practice Information)
7. Isi Step 2:
   - Practice Name: `Test Clinic`
   - Practice Address: `123 Test St`
   - Practice Phone: `+614987654321`
   - Role in Practice: `Dentist`
8. Klik "Create Account"
9. Tangkap response API
10. Verifikasi redirect ke `/auth/login`

**Expected Results:**
- API: HTTP 201, `{ status: true, message: "User registered successfully..." }`
- Redirect ke `/auth/login`
- User bisa login dengan email + password yang baru didaftarkan

**Selectors / Locators — Step 1:**
```typescript
page.getByPlaceholder("John")                           // First Name
page.getByPlaceholder("Doe")                            // Last Name
page.getByRole("textbox", { name: "Phone Number" })    // Phone
page.getByPlaceholder("your.email@example.com")         // Email
page.getByRole("combobox", { name: /describes you/ })  // Experience Level
page.getByPlaceholder("Create a password")              // Password
page.getByPlaceholder("Confirm your password")          // Confirm Password
page.getByPlaceholder("Enter referral code (optional)") // Referral Code
page.getByRole("checkbox", { name: /I agree to/ })     // Terms checkbox
page.getByRole("button", { name: "Next" })             // Next button
```

**Selectors / Locators — Step 2:**
```typescript
page.getByRole("button", { name: /Create Account|Register/i })
```

---

### REG-002: Register dengan Email Sudah Terdaftar — Error 409

**Priority:** P1
**Related:** API_DOC §1 — Register 409 Conflict

**Preconditions:**
- Email `tatang.doctor@gmail.com` sudah terdaftar

**Steps:**
1. Isi Step 1 dengan email: `tatang.doctor@gmail.com`
2. Data lainnya valid
3. Klik "Next"
4. Isi Step 2
5. Klik "Create Account"
6. Tangkap response API

**Expected Results:**
- API: HTTP **409**, `{ status: false, message: "Email is already registered" }`
- Toast: description SAMA dengan `response.body.message`
- Halaman tetap di register (tidak redirect)

**BUG_APP Detection:**
```typescript
const toastText = await page.locator('[data-slot="description"]').textContent();
if (toastText !== "Email is already registered") {
  assertToastMismatch({
    testCaseId: "REG-002",
    apiStatus: 409,
    apiMessage: "Email is already registered",
    toastMessage: toastText || "",
  });
}
```

---

### REG-003: Field Wajib Kosong — Validasi Client-Side

**Priority:** P1

**Steps:**
1. Buka Step 1
2. Biarkan semua field kosong
3. Klik "Next"
4. Verifikasi validasi muncul untuk semua field required

**Expected Results:**
- Tiap field required menampilkan error inline (contoh: "First Name is required")
- Button "Next" tetap disabled
- Tidak ada request API `POST /v1/auth/register`

---

### REG-004: Email Invalid Format — Validasi Client-Side

**Priority:** P1

**Steps:**
1. Isi email: `bukan-email`
2. Isi field lainnya valid
3. Klik "Next"
4. Verifikasi error validasi email muncul

---

### REG-005: Phone Number Invalid Format — Validasi

**Priority:** P1

**Steps:**
1. Isi phone: `abc` (non-numeric)
2. Field lainnya valid
3. Klik "Next"
4. Verifikasi error validasi phone muncul

---

### REG-006: Password Konfirmasi Tidak Cocok — Validasi Client-Side

**Priority:** P1
**Related:** WEBSITE_DOC §6.2 — Password Match Confirmation

**Steps:**
1. Isi Password: `Password123!`
2. Isi Confirm Password: `Password456!`
3. Klik "Next"
4. Verifikasi error "Passwords do not match" atau "must match"
5. Verifikasi tidak ada API call

---

### REG-007: Password Kurang dari 12 Karakter — Validasi Checklist

**Priority:** P1
**Related:** WEBSITE_DOC §6.2 — Password Requirements Checklist

**Steps:**
1. Isi Password: `Abc1!` (5 karakter)
2. Klik di field confirm password (blur)
3. Verifikasi password requirements checklist muncul
4. Verifikasi item "Minimum 12 characters" belum tercentang (belum terpenuhi)
5. Klik "Next"
6. Button "Next" tetap disabled

**Expected Results:**
- Password requirements checklist visible
- Item "Minimum 12 characters" unchecked (cross/x mark)
- Tidak ada API call

---

### REG-008: Password Checklist Verifikasi — Live Update Saat Mengetik

**Priority:** P2
**Related:** WEBSITE_DOC §6.2 — Password Requirements Checklist

**Steps:**
1. Ketik password secara bertahap dan verifikasi checklist ter-update:
   - `Abcdef12345!` → semua 5 item tercentang
   - `abcdef12345!` → hilang uppercase centang
   - `ABCDEF12345!` → hilang lowercase centang
   - `Abcdefghijkl` → hilang number & special char centang
   - `Abcdef1!` → hilang minimum 12 characters centang

**Expected Results:**
- Checklist item tercentang/hilang secara real-time
- Tidak perlu klik submit untuk melihat perubahan

---

### REG-009: Password Strength Bar — 0-100% Sesuai Kekuatan

**Priority:** P2
**Related:** WEBSITE_DOC §10.5 Password Strength

**Steps:**
1. Ketik password lemah: `Abc1!`
2. Verifikasi strength bar <= 20% (Very Weak, Red)
3. Ketik password medium: `Abcdef1!` (8 chars, 3 requirements)
4. Verifikasi strength bar 41-60% (Fair, Yellow)
5. Ketik password kuat: `Abcdefgh1!` (10 chars, 4 requirements)
6. Verifikasi strength bar 61-80% (Strong, Lime)
7. Ketik password sangat kuat: `Abcdefgh1!@` (12 chars, 5 requirements)
8. Verifikasi strength bar 81-100% (Very Strong, Green)

**Expected Results:**
- Strength bar berubah secara real-time
- Warna berubah sesuai strength level

---

### REG-010: Terms Checkbox Tidak Dicentang — Block Submit

**Priority:** P1

**Steps:**
1. Isi semua data valid di Step 1 & Step 2
2. Jangan centang "I agree to the Terms of Service and Privacy Policy"
3. Klik "Create Account"

**Expected Results:**
- Button disabled atau validasi unchecked muncul
- Tidak ada API call

---

### REG-011: Password 12+ Karakter + Semua Requirement Terpenuhi — Sukses

**Priority:** P1

**Steps:**
1. Isi Password: `Abcdef1234!@` (13 karakter, all requirements)
2. Confirm: `Abcdef1234!@`
3. Verifikasi semua 5 checklist items tercentang
4. Verifikasi strength bar 81-100% (Very Strong)
5. Lanjutkan register hingga sukses

**Expected Results:**
- Semua validasi lolos
- API 201 Created

---

### REG-012: Password Tanpa Uppercase — Checklist Gagal

**Priority:** P1

**Steps:**
1. Isi Password: `abcdef1234!@`
2. Verifikasi item "at least one uppercase letter" tidak tercentang

---

### REG-013: Password Tanpa Lowercase — Checklist Gagal

**Priority:** P1

**Steps:**
1. Isi Password: `ABCDEF1234!@`
2. Verifikasi item "at least one lowercase letter" tidak tercentang

---

### REG-014: Password Tanpa Number — Checklist Gagal

**Priority:** P1

**Steps:**
1. Isi Password: `Abcdefghi!@`
2. Verifikasi item "at least one number" tidak tercentang

---

### REG-015: Password Tanpa Special Character — Checklist Gagal

**Priority:** P1

**Steps:**
1. Isi Password: `Abcdefghi123`
2. Verifikasi item "at least one special character" tidak tercentang

---

### REG-016: Experience Level Tidak Dipilih — Validasi Combobox

**Priority:** P1
**Related:** WEBSITE_DOC §6.2 Step 1 — Experience Level*

**Steps:**
1. Jangan pilih Experience Level
2. Klik "Next"
3. Verifikasi error validasi pada combobox

---

### REG-017: Step 1 ke Step 2 — Progress Indicator & Field Transisi

**Priority:** P2
**Related:** WEBSITE_DOC §6.2 — Step Progress Indicator

**Steps:**
1. Di Step 1, isi semua field valid
2. Verifikasi progress indicator "Step 1 of 2" muncul
3. Klik "Next"
4. Verifikasi progress indicator berubah ke "Step 2 of 2"
5. Verifikasi Step 2 fields muncul (Practice Information)
6. Verifikasi ada tombol "Create Account"

**Expected Results:**
- Progress indicator visible: "Step X of 2" dengan numbered circles
- Step 1 → Step 2 transisi smooth
- Step 2 fields: Practice Name, Practice Address, Practice Phone, Role in Practice

**Selectors / Locators:**
```typescript
// Progress indicator content
page.getByText(/Step (1|2) of 2/)
```

---

### REG-018: Kembali dari Step 2 ke Step 1 — Data Tetap

**Priority:** P2

**Steps:**
1. Isi Step 1 data
2. Klik "Next" → Step 2
3. Klik browser back atau tombol back (jika ada)
4. Verifikasi kembali ke Step 1
5. Verifikasi data Step 1 masih terisi

---

### REG-019: Referral Code Opsional — Tidak Diisi

**Priority:** P2

**Steps:**
1. Biarkan referral code kosong
2. Isi semua field lainnya valid
3. Register sukses

**Expected Results:**
- Referral code yang tidak diisi tidak mempengaruhi registrasi
- API 201 Created

---

### REG-020: Step 2 Practice Information — Field Wajib

**Priority:** P1

**Steps:**
1. Step 1 valid → klik "Next" ke Step 2
2. Biarkan semua field Step 2 kosong
3. Klik "Create Account"

**Expected Results:**
- Validasi muncul untuk field Practice Name, Practice Address, Practice Phone
- Tidak ada API call

---

### REG-021: Register — API 500 Error Handling

**Priority:** P2
**Related:** WEBSITE_DOC §10.4 Error States

**Steps:**
1. Intercept route `**/v1/auth/register` untuk return 500
2. Isi data valid di Step 1 & Step 2
3. Klik "Create Account"
4. Verifikasi error toast muncul

**Expected Results:**
- Toast error muncul
- Halaman tetap di register

---

### REG-022: Register Slow Response — Loading State

**Priority:** P2
**Related:** WEBSITE_DOC §10.3 Loading States

**Steps:**
1. Intercept route `**/v1/auth/register` dengan delay 5 detik
2. Isi data valid
3. Klik "Create Account"
4. Verifikasi button disabled + spinner selama loading
5. Response tiba, verifikasi redirect

---

### REG-023: Register — Network Error Handling

**Priority:** P2

**Steps:**
1. Intercept route `**/v1/auth/register` untuk abort
2. Isi data valid
3. Klik "Create Account"
4. Verifikasi "Connection error" toast

---

### REG-024: Register Page — Layout & UI Elements Verification

**Priority:** P3
**Related:** WEBSITE_DOC §6.2 Register Page

**Steps:**
1. Buka `/auth/register`
2. Verifikasi layout split screen (left panel sama dengan login)
3. Verifikasi Step 1 semua field dan label muncul
4. Verifikasi password requirements checklist visible (saat password field aktif)
5. Verifikasi tombol "Next" dalam keadaan disabled
6. Verifikasi link "Sign In" tersedia

**Expected Results:**
- Left panel: "DID YOU KNOW?", rotating tips, feature tags
- All Step 1 fields with labels and placeholders
- Password requirements checklist (hidden/visible based on focus)
- "Next" button visible but disabled initially
- "Sign In" link navigates to `/auth/login`

---

### REG-025: Duplicate Username — Error 409 (Jika Ada Username Field)

**Priority:** P1

**Note:** Jika aplikasi memiliki username field, uji duplicate. Saat ini tidak ada username field di register form (hanya email).

---

### REG-026: API Validation Error 422 — Field-Specific Errors

**Priority:** P2
**Related:** API_DOC — Validation Failed

**Steps:**
1. Kirim data dengan format invalid (phone: `abc`, email: `bukan-email`)
2. Tangkap response API
3. Verifikasi API return 422/400 dengan field errors

**Expected Results:**
- HTTP 400 atau 422
- Body containing `errors` object with per-field validation messages
- UI menampilkan field-specific errors

---

### REG-027: Register Multiple Tabs — No Conflict

**Priority:** P3

**Steps:**
1. Buka 2 tab browser
2. Di tab 1, isi data registrasi dengan email unik
3. Di tab 2, isi data registrasi dengan email unik berbeda
4. Submit tab 1 → success
5. Submit tab 2 → success

**Expected Results:**
- Kedua registrasi sukses (tidak saling conflict karena email berbeda)
- Masing-masing redirect ke login

---

## Test Matrix

| ID       | Description                                    | Priority | Type              | API Endpoint       | Tags            |
| -------- | ---------------------------------------------- | -------- | ----------------- | ------------------ | --------------- |
| REG-001  | Register sukses — full flow                    | P1       | Positive          | POST /register     | @smoke          |
| REG-002  | Email sudah terdaftar — 409                    | P1       | Negative          | POST /register     | @regression     |
| REG-003  | Field wajib kosong — validasi client-side      | P1       | Client Validation | — (no API)         | @regression     |
| REG-004  | Email invalid format — validasi                | P1       | Client Validation | — (no API)         | @regression     |
| REG-005  | Phone invalid format — validasi                | P1       | Client Validation | — (no API)         | @regression     |
| REG-006  | Password konfirmasi tidak cocok                | P1       | Client Validation | — (no API)         | @regression     |
| REG-007  | Password < 12 karakter — checklist gagal       | P1       | Client Validation | — (no API)         | @regression     |
| REG-008  | Password checklist live update                 | P2       | UI Component      | —                  | @regression     |
| REG-009  | Password strength bar                          | P2       | UI Component      | —                  | @regression     |
| REG-010  | Terms checkbox tidak dicentang                 | P1       | Client Validation | — (no API)         | @regression     |
| REG-011  | Password 13 chars + all requirements           | P1       | Positive          | POST /register     | @regression     |
| REG-012  | Password tanpa uppercase                       | P1       | Client Validation | — (no API)         | @regression     |
| REG-013  | Password tanpa lowercase                       | P1       | Client Validation | — (no API)         | @regression     |
| REG-014  | Password tanpa number                          | P1       | Client Validation | — (no API)         | @regression     |
| REG-015  | Password tanpa special character               | P1       | Client Validation | — (no API)         | @regression     |
| REG-016  | Experience Level tidak dipilih                 | P1       | Client Validation | — (no API)         | @regression     |
| REG-017  | Step progress indicator + transisi Step 1→2    | P2       | UI Component      | —                  | @regression     |
| REG-018  | Back dari Step 2 ke Step 1 — data tetap        | P2       | UI Component      | —                  | @regression     |
| REG-019  | Referral code opsional — tidak diisi           | P2       | Positive          | POST /register     | @regression     |
| REG-020  | Step 2 Practice Information — field wajib      | P1       | Client Validation | — (no API)         | @regression     |
| REG-021  | API 500 error handling                         | P2       | Error Handling    | POST /register     | @error-handling |
| REG-022  | Slow response — loading state                  | P2       | Error Handling    | POST /register     | @error-handling |
| REG-023  | Network error handling                         | P2       | Error Handling    | POST /register     | @error-handling |
| REG-024  | Register page layout & UI elements             | P3       | UI Verification   | —                  | @regression     |
| REG-025  | Duplicate username (if field exists)           | P1       | Negative          | POST /register     | @regression     |
| REG-026  | API validation error 422                       | P2       | Negative          | POST /register     | @regression     |
| REG-027  | Multiple tabs — no conflict                    | P3       | Positive          | POST /register     | @regression     |

---

## Related API Endpoints

| Method | Endpoint                  | Auth | Description                      |
| ------ | ------------------------- | ---- | -------------------------------- |
| POST   | `/v1/auth/register`       | No   | Registrasi user baru             |
| POST   | `/v1/auth/login`          | No   | Verifikasi user bisa login       |
