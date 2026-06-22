# AUTH Test Cases — Login Module

**Module:** Auth / Login
**Page:** `/auth/login`
**Prefix:** `AUTH-XXX`

---

## AUTH-001 @smoke Login valid Doctor — redirect ke dashboard

**Role:** Doctor
**Steps:**
1. Buka `/auth/login`
2. Isi email `tatang.doctor@gmail.com`
3. Isi password `Password123!`
4. Klik "SIGN IN"

**Expected:**
- API response 200
- Redirect ke `/dashboard`
- Menampilkan greeting dengan nama "Tatang Doctor"

---

## AUTH-002 @smoke Login valid Orthodontist — redirect ke dashboard

**Role:** Orthodontist
**Steps:**
1. Buka `/auth/login`
2. Isi email `tatang.orthodontist@gmail.com`
3. Isi password `Password123!`
4. Klik "SIGN IN"

**Expected:**
- API response 200
- Redirect ke `/dashboard`

---

## AUTH-003 @smoke Login valid Admin — redirect ke dashboard

**Role:** Admin
**Steps:**
1. Buka `/auth/login`
2. Isi email `tatang.admin@gmail.com`
3. Isi password `Password123!`
4. Klik "SIGN IN"

**Expected:**
- API response 200
- Redirect ke `/dashboard`

---

## AUTH-004 Login dengan email kosong — validasi client-side

**Steps:**
1. Buka `/auth/login`
2. Biarkan email kosong
3. Isi password
4. Klik "SIGN IN"

**Expected:**
- Validasi "Email is required" muncul
- Tidak ada request API yang terkirim

---

## AUTH-005 Login dengan password kosong — validasi client-side

**Steps:**
1. Buka `/auth/login`
2. Isi email
3. Biarkan password kosong
4. Klik "SIGN IN"

**Expected:**
- Validasi error muncul
- Tidak ada request API yang terkirim

---

## AUTH-006 Login dengan password salah — tampilkan error toast

**Steps:**
1. Buka `/auth/login`
2. Isi email valid
3. Isi password salah
4. Klik "SIGN IN"

**Expected:**
- API response 401
- Error toast muncul dengan pesan sesuai API message
- Tetap di halaman login

---

## AUTH-007 Login dengan email tidak terdaftar — tampilkan error toast

**Steps:**
1. Buka `/auth/login`
2. Isi email yang belum terdaftar
3. Isi password
4. Klik "SIGN IN"

**Expected:**
- API response 401
- Error toast muncul dengan pesan sesuai API message
- Tetap di halaman login

---

## AUTH-008 Toggle show/hide password

**Steps:**
1. Buka `/auth/login`
2. Isi password
3. Klik "Show password"

**Expected:**
- Input type berubah dari "password" ke "text"
- Button label berubah menjadi "Hide password"

---

## AUTH-009 Klik "Forgot password?" — redirect ke forgot password page

**Steps:**
1. Buka `/auth/login`
2. Klik "Forgot password?" link

**Expected:**
- Redirect ke `/auth/forgot-password`

---

## AUTH-010 Klik "Create Free Account" — redirect ke register page

**Steps:**
1. Buka `/auth/login`
2. Klik "Create Free Account →"

**Expected:**
- Redirect ke `/auth/register`

---

## AUTH-011 Rate limiting — 429 after rapid requests

**Steps:**
1. Buka `/auth/login`
2. Kirim 6+ login requests cepat dengan credential salah

**Expected:**
- Request ke-6+ mendapat response 429
- Error toast "Too many requests"
