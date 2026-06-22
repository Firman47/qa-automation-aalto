# FRG Test Cases — Forgot Password Module

**Module:** Auth / Forgot Password
**Page:** `/auth/forgot-password`
**Prefix:** `FRG-XXX`

---

## FRG-001 @smoke Forgot password page — tampilan benar

**Steps:**
1. Buka `/auth/forgot-password`

**Expected:**
- Heading "Forgot password?" terlihat
- Deskripsi: "Enter your email address and we'll send you instructions to reset your password"
- Email input dengan placeholder `your.name@example.com`
- "Send reset link" button
- "Back to login" link

---

## FRG-002 Kirim reset link dengan email valid

**Steps:**
1. Buka `/auth/forgot-password`
2. Isi email terdaftar
3. Klik "Send reset link"

**Expected:**
- API response 200
- Toast sukses "Reset link sent to your email"

---

## FRG-003 Kirim reset link dengan email kosong — validasi

**Steps:**
1. Buka `/auth/forgot-password`
2. Biarkan email kosong
3. Klik "Send reset link"

**Expected:**
- Validasi "Email is required" muncul
- Tidak ada request API

---

## FRG-004 Kirim reset link dengan email tidak terdaftar

**Steps:**
1. Buka `/auth/forgot-password`
2. Isi email tidak terdaftar
3. Klik "Send reset link"

**Expected:**
- API response 404
- Error toast muncul

---

## FRG-005 Klik "Back to login" — redirect ke login page

**Steps:**
1. Buka `/auth/forgot-password`
2. Klik "Back to login"

**Expected:**
- Redirect ke `/auth/login`
