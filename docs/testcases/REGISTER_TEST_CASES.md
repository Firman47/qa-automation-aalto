# REG Test Cases — Register Module

**Module:** Auth / Register
**Page:** `/auth/register`
**Prefix:** `REG-XXX`

---

## REG-001 @smoke Register valid — Step 1 Personal Info

**Steps:**
1. Buka `/auth/register`
2. Isi semua field Step 1 dengan data valid
3. Centang Terms
4. Klik "Next"

**Expected:**
- Step indicator menunjukkan Step 1 of 2 completed
- Lanjut ke Step 2: Practice Information
- Tidak ada error toast

---

## REG-002 Register dengan First Name kosong — validasi client-side

**Steps:**
1. Buka `/auth/register`
2. Kosongkan First Name
3. Isi field lain dengan valid
4. Klik "Next"

**Expected:**
- Validasi muncul
- Tidak ada request API

---

## REG-003 Register dengan Last Name kosong — validasi client-side

**Steps:**
1. Buka `/auth/register`
2. Kosongkan Last Name
3. Isi field lain dengan valid
4. Klik "Next"

**Expected:**
- Validasi muncul
- Tidak ada request API

---

## REG-004 Register dengan Phone kosong — validasi client-side

**Steps:**
1. Buka `/auth/register`
2. Kosongkan Phone
3. Isi field lain dengan valid
4. Klik "Next"

**Expected:**
- Validasi muncul
- Tidak ada request API

---

## REG-005 Register dengan Email kosong — validasi client-side

**Steps:**
1. Buka `/auth/register`
2. Kosongkan Email
3. Isi field lain dengan valid
4. Klik "Next"

**Expected:**
- Validasi muncul
- Tidak ada request API

---

## REG-006 Register dengan Password lemah — password requirement terlihat

**Steps:**
1. Buka `/auth/register`
2. Isi password pendek (e.g., "pass")

**Expected:**
- Password strength bar menunjukkan low
- Requirement list menunjukkan requirement yang belum terpenuhi

---

## REG-007 Register dengan Password 12 karakter — semua requirement terpenuhi

**Steps:**
1. Buka `/auth/register`
2. Isi password `Password123!`

**Expected:**
- Password strength bar penuh
- Semua requirement checklist tercentang

---

## REG-008 Register dengan Confirm Password tidak sama — validasi

**Steps:**
1. Buka `/auth/register`
2. Isi password `Password123!`
3. Isi confirm password `DifferentPass1!`

**Expected:**
- Validasi "Passwords do not match" muncul
- Tidak bisa lanjut ke Next

---

## REG-009 Register tanpa centang Terms — Next disabled

**Steps:**
1. Buka `/auth/register`
2. Isi semua field valid
3. Jangan centang Terms

**Expected:**
- "Next" button tetap disabled

---

## REG-010 Register dengan referral code opsional — sukses

**Steps:**
1. Buka `/auth/register`
2. Isi semua field valid + referral code
3. Centang Terms
4. Klik "Next"

**Expected:**
- Step 1 completed
- Lanjut ke Step 2

---

## REG-011 Klik "Sign In" link — redirect ke login

**Steps:**
1. Buka `/auth/register`
2. Klik "Sign In" link

**Expected:**
- Redirect ke `/auth/login`

---

## REG-012 Toggle show/hide password di register

**Steps:**
1. Buka `/auth/register`
2. Isi password
3. Klik "Show password"

**Expected:**
- Input type berubah dari "password" ke "text"
