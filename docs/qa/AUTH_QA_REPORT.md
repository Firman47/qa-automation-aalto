# QA Report — Module Auth

> **Periode:** Juni 2026
> **Lingkungan:** `https://dental-monitoring.sadigit.co.id`
> **API Base:** `https://dentist-api.sadigit.co.id/v1/`
> **Browser:** Chromium (Playwright)

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Scope](#2-scope)
3. [Coverage Analysis](#3-coverage-analysis)
4. [Module Breakdown](#4-module-breakdown)
5. [BUG_APP Detection Points](#5-bug_app-detection-points)
6. [Skipped / Blocked Tests](#6-skipped--blocked-tests)
7. [Risk Assessment](#7-risk-assessment)
8. [Observations & Gaps](#8-observations--gaps)
9. [Recommendations](#9-recommendations)

---

## 1. Executive Summary

| Metrik                          | Nilai                               |
| ------------------------------- | ----------------------------------- |
| **Total test cases (docs)**     | 80                                  |
| **Total test spec (implemented)**| 50                                  |
| **Tests active**                | 48                                  |
| **Tests skipped**               | 2 (REG-003, RST-001)                |
| **BUG_APP detection points**    | 2 (AUTH-006, AUTH-007)              |
| **Coverage implementation**     | **62.5%** (50/80)                   |
| **Documentation coverage**      | **100%** (6/6 modul didokumentasi)  |

### Status Legend

| Status | Meaning |
|--------|---------|
| ✅ **Covered** | Test case documented AND implemented |
| 📄 **Documented Only** | Test case documented in docs, NOT yet implemented in spec file |
| ⏭️ **Skipped** | Test exists in spec but skipped (blocker noted) |
| ⚠️ **BUG_APP** | Test has BUG_APP detection logic that will FAIL on mismatch |

---

## 2. Scope

**Module:** Authentication (Auth)

**Sub-modules covered:**

| Modul | Prefix | Doc File | Spec File |
|-------|--------|----------|-----------|
| Login | AUTH | `AUTH_TEST_CASES.md` | `login.spec.ts` |
| Register | REG | `REGISTER_TEST_CASES.md` | `register.spec.ts` |
| Forgot Password | FRG | `FRG_TEST_CASES.md` | `forgot-password.spec.ts` |
| Logout | LGT | `LGT_TEST_CASES.md` | `logout.spec.ts` |
| Auth Me | ME | `ME_TEST_CASES.md` | `auth-me.spec.ts` |
| Reset Password / Double Login | RST | `RST_TEST_CASES.md` | `reset-password.spec.ts` |

**API endpoints covered:**

| Method | Endpoint                        | Covered In                        |
| ------ | ------------------------------- | --------------------------------- |
| POST   | `/v1/auth/login`                | AUTH-001 s.d AUTH-023             |
| POST   | `/v1/auth/register`             | REG-001 s.d REG-027               |
| POST   | `/v1/auth/logout`               | LGT-001 s.d LGT-006               |
| GET    | `/v1/auth/me`                   | ME-001 s.d ME-006                 |
| POST   | `/v1/auth/forgot-password`      | FRG-001 s.d FRG-009               |
| POST   | `/v1/auth/reset-password`       | RST-001 s.d RST-004, RST-009      |
| POST   | `/v1/auth/confirm-double-login` | RST-005 s.d RST-008               |

---

## 3. Coverage Analysis

### 3.1 Overall Coverage

```
Docs Total:   80 test cases
                    │
        ┌───────────┴───────────┐
        │                       │
    Implemented (50)        Missing (30)
        │                       │
    ┌───┴───┐               Gap: 37.5%
    │       │
  Active  Skipped
  (48)    (2)
```

### 3.2 Coverage per Module

| Modul  | Docs  | Impl | Active | Skipped | Missing | Coverage % |
| ------ | ----- | ---- | ------ | ------- | ------- | ---------- |
| AUTH   | 23    | 20   | 20     | 0       | 3       | **87.0%**  |
| REG    | 27    | 12   | 11     | 1       | 15      | **44.4%**  |
| FRG    | 9     | 6    | 6      | 0       | 3       | **66.7%**  |
| LGT    | 6     | 3    | 3      | 0       | 3       | **50.0%**  |
| ME     | 6     | 4    | 4      | 0       | 2       | **66.7%**  |
| RST    | 9     | 5    | 4      | 1       | 4       | **55.6%**  |
| **Total** | **80** | **50** | **48** | **2** | **30** | **62.5%** |

### 3.3 Missing Tests by Category

| Type                | Approx. Count | Key Items |
| ------------------- | ------------- | --------- |
| Error Handling      | ~7            | API 500 (AUTH-016, REG-021, FRG-006, LGT-004, ME-006), network error (AUTH-017, REG-023, FRG-007, LGT-005), slow response (AUTH-018, REG-022) |
| Client Validation   | ~10           | Double empty (AUTH-006), password requirement variants (REG-012→016), phone format (REG-005), Step 2 fields (REG-020), Experience Level (REG-016) |
| UI Component        | ~5            | Password strength bar (REG-009), step progress (REG-017), back navigation (REG-018), checklist live update (REG-008), avatar menu (LGT-006) |
| Loading State       | ~3            | AUTH-013, FRG-008, LGT-003 |
| API Contract / E2E  | ~5            | Reset token validation (RST-003/005/007/008), API 422 + conflict (REG-025/026), multi-tab (REG-027) |
| Layout / UI Verify  | ~3            | AUTH-019, REG-024, ME-003 (token expiry redirect) |
| Incomplete Coverage | ~2            | LGT-003 (multi-role only tests doctor), REG-003 (Step 2 blocked) |

---

## 4. Module Breakdown

### 4.1 AUTH (Login) — 20/23 Implemented

**Implemented (20):**
> **IDs below use SPEC test IDs (AUTH-001 to AUTH-020).** Due to a renumbering shift, spec numbering does not always match doc numbering (see §8.1 for full mapping).

| ID       | Test                          | Type            | Priority | Status |
| -------- | ----------------------------- | --------------- | -------- | ------ |
| AUTH-001 | Login valid Doctor            | Positive        | P0       | ✅     |
| AUTH-002 | Login valid Orthodontist      | Positive        | P0       | ✅     |
| AUTH-003 | Login valid Admin             | Positive        | P0       | ✅     |
| AUTH-004 | Email kosong — client-side    | Client Val      | P1       | ✅     |
| AUTH-005 | Password kosong — client-side | Client Val      | P1       | ✅     |
| AUTH-006 | Password salah — error toast  | Negative        | P1       | ✅ ⚠️ BUG_APP |
| AUTH-007 | Email tidak terdaftar         | Negative        | P1       | ✅ ⚠️ BUG_APP |
| AUTH-008 | Show/hide password toggle     | UI Component    | P2       | ✅     |
| AUTH-009 | Forgot password link          | Navigation      | P1       | ✅     |
| AUTH-010 | Register link                 | Navigation      | P1       | ✅     |
| AUTH-011 | Remember me checkbox          | Positive        | P3       | ✅     |
| AUTH-012 | Password expired (intercept)  | Error Handling  | P3       | ✅     |
| AUTH-013 | Account locked (intercept)    | Error Handling  | P3       | ✅     |
| AUTH-014 | Double login (intercept)      | Error Handling  | P3       | ✅     |
| AUTH-015 | Rate limited (intercept)      | Error Handling  | P2       | ✅     |
| AUTH-016 | Logout flow verification      | Positive        | P1       | ✅     |
| AUTH-017 | Response structure verify     | API Contract    | P2       | ✅     |
| AUTH-018 | Invalid email format          | Client Val      | P1       | ✅     |
| AUTH-019 | GET /auth/me verification     | API Contract    | P2       | ✅     |
| AUTH-020 | Whitespace email validation   | Client Val      | P1       | ✅     |

**Missing (3):** (20 spec tests out of 23 doc = 87.0%)

| ID (Doc) | Test                                | Why Missing                     |
| -------- | ----------------------------------- | ------------------------------- |
| AUTH-013 | Loading state (spinner)             | Not yet implemented             |
| AUTH-016 | API 500 error handling              | Not yet implemented             |
| AUTH-017 | Network error handling              | Not yet implemented             |

> **Note:** 3 AUTH spec tests are miscategorized (AUTH-016=Logout belongs to LGT, AUTH-019=Auth Me belongs to ME, AUTH-020=Whitespace is extra). 6 doc tests have no direct spec counterpart, but 3 are offset by miscategorized spec tests. See §8.1 for full mapping.

---

### 4.2 REG (Register) — 12/27 Implemented

**Implemented (12):**

| ID       | Test                                | Priority | Status |
| -------- | ----------------------------------- | -------- | ------ |
| REG-001  | Register page — form elements       | P1       | ✅     |
| REG-002  | Step 1 valid — Next enabled         | P1       | ✅     |
| REG-003  | Complete flow Step 1+2              | P0       | ⏭️ Skipped |
| REG-004  | Email sudah terdaftar — 409         | P1       | ✅     |
| REG-005  | Password mismatch                   | P1       | ✅     |
| REG-006  | Password lemah — checklist visible  | P1       | ✅     |
| REG-007  | Password 12 chars — checklist full  | P1       | ✅     |
| REG-008  | Toggle show password                | P2       | ✅     |
| REG-009  | Toggle show confirm password        | P2       | ✅     |
| REG-010  | Terms unchecked — Next disabled     | P1       | ✅     |
| REG-011  | Sign In link navigasi               | P0       | ✅     |
| REG-012  | Referral code optional              | P2       | ✅     |

**Missing (15):**

| ID       | Test                                | Why Missing            |
| -------- | ----------------------------------- | ---------------------- |
| REG-008  | Password checklist live update      | Not implemented        |
| REG-009  | Password strength bar               | Not implemented        |
| REG-012  | Password tanpa uppercase            | Not implemented        |
| REG-013  | Password tanpa lowercase            | Not implemented        |
| REG-014  | Password tanpa number               | Not implemented        |
| REG-015  | Password tanpa special char         | Not implemented        |
| REG-016  | Experience Level combobox validasi  | Not implemented        |
| REG-017  | Step progress indicator             | Not implemented        |
| REG-018  | Back from Step 2 to Step 1          | Not implemented        |
| REG-019  | Referral code opsional — sukses     | Not implemented        |
| REG-020  | Step 2 Practice fields validasi     | Not implemented        |
| REG-021  | API 500 error handling              | Not implemented        |
| REG-023  | Network error handling              | Not implemented        |
| REG-024  | Register page layout verification   | Not implemented        |
| REG-026  | API validation error 422            | Not implemented        |

> **Critical Gap:** REG-004 (email already registered — 409) has **NO BUG_APP detection** despite being the exact same pattern as AUTH-006/007. This means if the UI toast doesn't match the API message, the test will silently PASS.

---

### 4.3 FRG (Forgot Password) — 6/9 Implemented

**Implemented (6):**
> **IDs below use SPEC test IDs (FRG-001 to FRG-006).** Mapping: FRG-001 spec = FRG-009 doc (layout), FRG-006 spec = FRG-004 doc (invalid email format).

| ID       | Test                                | Priority | Status |
| -------- | ----------------------------------- | -------- | ------ |
| FRG-001  | Forgot password page — tampilan     | P0       | ✅     |
| FRG-002  | Kirim reset link — email valid      | P0       | ✅     |
| FRG-003  | Kirim reset link — email tdk terdaftar | P1    | ✅     |
| FRG-004  | Email kosong — client-side          | P1       | ✅     |
| FRG-005  | Back to login link                  | P0       | ✅     |
| FRG-006  | Invalid email format                | P1       | ✅     |

**Missing (3):**

| ID (Doc) | Test                                | Why Missing            |
| -------- | ----------------------------------- | ---------------------- |
| FRG-006  | API 500 error handling              | Not implemented        |
| FRG-007  | Network error handling              | Not implemented        |
| FRG-008  | Loading state                       | Not implemented        |

---

### 4.4 LGT (Logout) — 3/6 Implemented

**Implemented (3):**

| ID       | Test                                | Priority | Status |
| -------- | ----------------------------------- | -------- | ------ |
| LGT-001  | Logout via avatar menu              | P0       | ✅     |
| LGT-002  | Protected route after logout        | P1       | ✅     |
| LGT-003  | Logout berbagai role                | P2       | ⚠️ **Hanya doctor** |

**Missing (4):**

| ID (Doc) | Test                                | Why Missing            |
| -------- | ----------------------------------- | ---------------------- |
| LGT-003  | Loading state saat logout           | Not implemented        |
| LGT-004  | API 500 error handling              | Not implemented        |
| LGT-005  | Network error handling              | Not implemented        |
| LGT-006  | Avatar dropdown menu items          | Not implemented        |

> **Issue:** LGT-003 title says "berbagai role" but only iterates over DOCTOR role. ORTHODONTIST and ADMIN are imported but unused.

---

### 4.5 ME (Auth Me) — 4/6 Implemented

**Implemented (4):**

| ID       | Test                                | Priority | Status |
| -------- | ----------------------------------- | -------- | ------ |
| ME-001   | GET /auth/me — profile user         | P0       | ✅     |
| ME-002   | GET /auth/me — clinic info          | P2       | ✅     |
| ME-003   | GET /auth/me — semua role           | P0       | ✅     |
| ME-004   | GET /auth/me — 401 tanpa auth       | P1       | ✅     |

**Missing (2):**

| ID       | Test                                | Why Missing            |
| -------- | ----------------------------------- | ---------------------- |
| ME-005   | Role context verification (3 roles) | Covered by ME-003      |
| ME-006   | API 500 error handling              | Not implemented        |

---

### 4.6 RST (Reset Password / Double Login) — 5/9 Implemented

**Implemented (5):**

| ID       | Test                                | Priority | Status |
| -------- | ----------------------------------- | -------- | ------ |
| RST-001  | Reset password — valid token        | P2       | ⏭️ Skipped |
| RST-002  | Reset password — invalid token      | P2       | ✅     |
| RST-003  | Reset password — password mismatch  | P2       | ✅     |
| RST-004  | Reset password — password lemah     | P2       | ✅     |
| RST-005  | Double login — invalid token        | P2       | ✅     |

**Missing (4):**
> **Note:** Spec RST-005 (double login — invalid token) = Doc RST-006. Doc RST-005 (confirm success) is NOT in spec. See §8.1 for full mapping.

| ID (Doc) | Test                                | Why Missing            |
| -------- | ----------------------------------- | ---------------------- |
| RST-003  | Reset password — token kosong       | Not implemented        |
| RST-005  | Double login — confirm success      | Not implemented        |
| RST-007  | Double login — token kosong         | Not implemented        |
| RST-008  | Double login — UI verification      | Not implemented        |

---

## 5. BUG_APP Detection Points

### 5.1 Active Detection (2 points)

| Test      | Location           | What It Detects                                      | Evidence |
| --------- | ------------------ | ---------------------------------------------------- | -------- |
| **AUTH-006** | `login.spec.ts:133` | UI toast ≠ API message saat password salah (401)    | Comparison: toast vs API `message` field |
| **AUTH-007** | `login.spec.ts:167` | UI toast ≠ API message saat email tidak terdaftar   | Comparison: toast vs API `message` field |

Both use `assertToastMismatch()` helper which throws `Error` with `BUG_APP` prefix, causing test FAIL visible in Playwright HTML Report.

### 5.2 Missing Detection (Critical Gaps)

| Test      | Scenario                                | Risk                                                        |
| --------- | --------------------------------------- | ----------------------------------------------------------- |
| **REG-004** | Email sudah terdaftar — 409             | If UI toast ≠ "Email is already registered", test silently PASSES |
| **FRG-002** | Kirim reset link — API response         | If UI toast ≠ API message, test silently PASSES              |
| **FRG-003** | Email tidak terdaftar — API behavior    | If UI toast ≠ API message, test silently PASSES              |

> **Risk:** These tests validate that an error toast appears, but do NOT verify that the toast text matches the API response. If the app displays a generic "Registration failed" instead of "Email is already registered", the test would still PASS — masking a BUG_APP.
>
> **Verified:** Spec audit confirms REG-004 (`register.spec.ts`), FRG-002, and FRG-003 (`forgot-password.spec.ts`) all have **no `assertToastMismatch`** calls. This is the top-priority gap to close (see §9.1 Quick Wins).

---

## 6. Skipped / Blocked Tests

| Test    | Reason                                                                 | Blocker                                |
| ------- | ---------------------------------------------------------------------- | -------------------------------------- |
| REG-003 | `E2E register flow requires Step 2 form — implement saat Step 2 page object tersedia` | Missing Step 2 Page Object methods     |
| RST-001 | `Memerlukan reset token dari email atau test hook`                     | No email access / test hook for tokens |

### 6.1 Blockers Detail

**REG-003 (Complete Register Flow):**
- Root Cause: `RegisterPage.ts` hanya memiliki Step 1 methods (`fillPersonalInfo`, `clickNext`). Step 2 fields (Practice Name, Practice Address, Practice Phone, Role in Practice) belum ada di Page Object.
- Requires: `fillPracticeInfo()`, `clickCreateAccount()` methods + `waitForRegisterResponse()`

**RST-001 (Reset Password Valid Token):**
- Root Cause: Reset token hanya dikirim via email, tidak ada backend test hook untuk generate token otomatis.
- Requires: Either (1) Email access integration, (2) Backend test hook for token generation, or (3) Admin API to generate reset link

---

## 7. Risk Assessment

| Risk Level | Count | Items |
| ---------- | ----- | ----- |
| 🔴 **High** | 3     | REG-004 missing BUG_APP detection; REG-003 blocked (no complete register flow E2E); 37.5% gap between docs and implementation |
| 🟡 **Medium** | 6   | Auth error handling (500/network) mostly untested; Loading states untested; Password strength bar untested; RST-001 blocked; LGT-003 only tests 1/3 roles; FRG/FRG missing BUG_APP detection |
| 🟢 **Low** | 3      | UI layout verification tests are P3; RST success scenarios are P3; FRG page layout is P3 |

### 7.1 Key Risks

1. **UI/API Message Mismatch undetected in Register & Forgot Password** — REG-004, FRG-002, and FRG-003 have no `assertToastMismatch`, unlike AUTH-006/007 which do. If the app displays a generic toast instead of the specific API message for registration/forgot password errors, it won't be caught.

2. **Complete Register Flow Cannot Be E2E Tested** — REG-003 is skipped because Step 2 Page Object is incomplete. The most critical positive path (user registers → creates account → logs in) is not automated.

3. **Error Handling Coverage Gap** — Majority of error handling tests (API 500, network error, slow response, loading states) across all modules are not implemented. The app's resilience to backend failures is largely untested.

4. **Reset Password Flow Blocked** — The full reset password flow (forgot → receive token → reset → login with new password) cannot be tested end-to-end without email access or a test hook.

---

## 8. Observations & Gaps

### 8.1 Test ID Mapping Inconsistency (Spec → Doc)

Spec IDs do not always match doc IDs. Comprehensive mapping below:

#### AUTH Mapping

| Spec ID  | Spec Title                    | Maps to Doc ID | Notes                 |
| -------- | ----------------------------- | -------------- | --------------------- |
| AUTH-001 | Login valid Doctor            | AUTH-001       | ✅ Match              |
| AUTH-002 | Login valid Orthodontist      | AUTH-002       | ✅ Match              |
| AUTH-003 | Login valid Admin             | AUTH-003       | ✅ Match              |
| AUTH-004 | Email kosong                  | AUTH-004       | ✅ Match              |
| AUTH-005 | Password kosong               | AUTH-005       | ✅ Match              |
| AUTH-006 | Password salah — error toast  | AUTH-011       | ⚠️ Shift (+5)        |
| AUTH-007 | Email tidak terdaftar         | AUTH-012       | ⚠️ Shift (+5)        |
| AUTH-008 | Show/hide password toggle     | AUTH-008       | ✅ Match              |
| AUTH-009 | Forgot password link          | AUTH-009       | ✅ Match              |
| AUTH-010 | Register link                 | AUTH-010       | ✅ Match              |
| AUTH-011 | Remember me checkbox          | AUTH-023       | ⚠️ Shift (+12)       |
| AUTH-012 | Password expired (intercept)  | AUTH-020       | ⚠️ Shift (+8)        |
| AUTH-013 | Account locked (intercept)    | AUTH-021       | ⚠️ Shift (+8)        |
| AUTH-014 | Double login (intercept)      | AUTH-022       | ⚠️ Shift (+8)        |
| AUTH-015 | Rate limited (intercept)      | AUTH-015       | ✅ Match              |
| AUTH-016 | Logout flow verification      | —              | ❌ Miscategorized (→ LGT) |
| AUTH-017 | Response structure verify     | AUTH-014       | ⚠️ Shift (-3)        |
| AUTH-018 | Invalid email format          | AUTH-007       | ⚠️ Shift (-11)       |
| AUTH-019 | GET /auth/me verification     | —              | ❌ Miscategorized (→ ME) |
| AUTH-020 | Whitespace email validation   | —              | ❌ Extra — not in docs |

**Doc tests NOT in spec:** AUTH-006 (double empty), AUTH-016 (API 500), AUTH-017 (network error), AUTH-018 (slow response), AUTH-019 (layout). All 5 are unimplemented.

#### FRG Mapping

| Spec ID  | Spec Title                    | Maps to Doc ID | Notes          |
| -------- | ----------------------------- | -------------- | -------------- |
| FRG-001  | Page — tampilan               | FRG-009        | ⚠️ Layout test |
| FRG-002  | Kirim reset link — valid      | FRG-001        | ⚠️ Shift (-1)  |
| FRG-003  | Kirim reset link — tdk terdftr| FRG-002        | ⚠️ Shift (-1)  |
| FRG-004  | Email kosong                  | FRG-003        | ⚠️ Shift (-1)  |
| FRG-005  | Back to login link            | FRG-005        | ✅ Match        |
| FRG-006  | Invalid email format          | FRG-004        | ⚠️ Shift (-2)  |

**Doc tests NOT in spec:** FRG-006 (API 500), FRG-007 (network error), FRG-008 (loading state).

#### LGT Mapping

| Spec ID  | Spec Title                    | Maps to Doc ID | Notes          |
| -------- | ----------------------------- | -------------- | -------------- |
| LGT-001  | Logout via avatar menu        | LGT-001        | ✅ Match       |
| LGT-002  | Protected route after logout  | LGT-002        | ✅ Match       |
| LGT-003  | Logout berbagai role          | —              | ❌ Extra test  |

**Doc tests NOT in spec:** LGT-003 (loading state), LGT-004 (API 500), LGT-005 (network error), LGT-006 (avatar dropdown menu).

#### ME Mapping

| Spec ID  | Spec Title                    | Maps to Doc ID | Notes          |
| -------- | ----------------------------- | -------------- | -------------- |
| ME-001   | GET /auth/me — profile        | ME-001         | ✅ Match       |
| ME-002   | GET /auth/me — clinic info    | ME-002         | ✅ Match       |
| ME-003   | GET /auth/me — semua role     | ME-005         | ⚠️ Shift (+2)  |
| ME-004   | GET /auth/me — 401 no auth    | ME-004         | ✅ Match       |

**Doc tests NOT in spec:** ME-003 (token expiry), ME-006 (API 500).

#### RST Mapping

| Spec ID  | Spec Title                    | Maps to Doc ID | Notes          |
| -------- | ----------------------------- | -------------- | -------------- |
| RST-001  | Reset — valid token (skipped) | RST-001        | ✅ Match       |
| RST-002  | Reset — invalid token         | RST-002        | ✅ Match       |
| RST-003  | Reset — password mismatch     | RST-004        | ⚠️ Shift (+1)  |
| RST-004  | Reset — password lemah        | —              | ❌ Extra test  |
| RST-005  | Double login — invalid token  | RST-006        | ⚠️ Shift (+1)  |

**Doc tests NOT in spec:** RST-003 (token kosong), RST-005 (confirm success), RST-007 (token kosong DL), RST-008 (DL UI verify), RST-009 (E2E).

> **Recommendation:** Realign spec test IDs to match doc test IDs for traceability, or add a prefix-based mapping comment block at the top of each spec file.

### 8.2 LGT-003 — Role Coverage Incomplete

LGT-003 title: `Logout dari berbagai role — redirect konsisten`
Reality: Only tests DOCTOR role. `ORTHODONTIST` and `ADMIN` are imported but not used in the iteration.

### 8.3 No Negative Loading State Tests

Loading state tests (spinner + disabled button during API call) are documented for AUTH, REG, FRG, and LGT but none are implemented. This is a medium risk — if the API is slow, users might double-click buttons.

### 8.4 Password Strength Bar Not Tested

The password strength bar is documented in WEBSITE_DOC §10.5 with detailed color/percentage mapping but no test validates it renders correctly.

### 8.5 Auth Me Token Expiry Not Tested

ME-003 (token expiry → redirect to login) is documented but not implemented. If the token expires, users might see broken UI instead of being redirected to login.

---

## 9. Recommendations

### Priority 1 — Implement ASAP

| Test      | Effort | Reason |
| --------- | ------ | ------ |
| REG-004 BUG_APP | Small | Add `assertToastMismatch()` to register 409 test |
| FRG-002/FRG-003 BUG_APP | Small | Add `assertToastMismatch()` to forgot password tests |
| REG-003 (Step 2 PO) | Medium | Unblocks complete register E2E flow |
| AUTH-013 Loading State | Small | Prevents double-click issues |
| AUTH-016/AUTH-017 API Error | Medium | Ensures graceful error handling |

### Priority 2 — Short Term

| Test      | Effort | Reason |
| --------- | ------ | ------ |
| REG-009 Password Strength Bar | Small | UI component verification |
| ME-003 Token Expiry | Medium | Critical for session management |
| LGT-003 Multi-Role | Small | Fix incomplete role iteration |
| FRG-006/007 Error Handling | Small | Missing error handling coverage |

### Priority 3 — Medium Term

| Test          | Effort | Reason |
| ------------- | ------ | ------ |
| AUTH-019 Layout | Medium | UI regression coverage |
| REG-017 Step Progress | Small | UI component verification |
| REG-008 Checklist Live | Small | UI component verification |
| RST-001 (test hook) | Large | Requires backend support |

### 9.1 Quick Wins (Sangat Mudah, High Impact)

1. **Add BUG_APP detection to REG-004** — ~10 menit. Copy `assertToastMismatch()` pattern from AUTH-006.
2. **Add BUG_APP detection to FRG-002/FRG-003** — ~10 menit. Same `assertToastMismatch()` pattern, apply to `forgot-password.spec.ts`.
3. **Add LGT-003 roles** — ~5 menit. Add `ORTHODONTIST` and `ADMIN` to the roles array in `logout.spec.ts`.
4. **Add `fillPracticeInfo()` to RegisterPage** — ~30 menit. Unblocks REG-003.

---

## Lampiran

### A. File Reference

| File | Location |
| ---- | -------- |
| QA Report | `docs/qa/AUTH_QA_REPORT.md` |
| AUTH Test Cases | `docs/testcases/AUTH_TEST_CASES.md` |
| REG Test Cases | `docs/testcases/REGISTER_TEST_CASES.md` |
| FRG Test Cases | `docs/testcases/FRG_TEST_CASES.md` |
| LGT Test Cases | `docs/testcases/LGT_TEST_CASES.md` |
| ME Test Cases | `docs/testcases/ME_TEST_CASES.md` |
| RST Test Cases | `docs/testcases/RST_TEST_CASES.md` |
| Login Spec | `tests/auth/login.spec.ts` |
| Register Spec | `tests/auth/register.spec.ts` |
| Forgot Password Spec | `tests/auth/forgot-password.spec.ts` |
| Logout Spec | `tests/auth/logout.spec.ts` |
| Auth Me Spec | `tests/auth/auth-me.spec.ts` |
| Reset Password Spec | `tests/auth/reset-password.spec.ts` |
| Login Page Object | `tests/auth/pages/LoginPage.ts` |
| Register Page Object | `tests/auth/pages/RegisterPage.ts` |
| Forgot Password PO | `tests/auth/pages/ForgotPasswordPage.ts` |
| BUG Assertions Helper | `tests/helpers/bug-assertions.ts` |
| Auth Test Data | `tests/data/auth-test-data.ts` |

### B. Test Execution Matrix (Full)

> **⚠️ Note:** This matrix uses **doc test IDs** for the `ID` column, but **spec implementation status** for `Implemented`/`Status`. Due to renumbering shifts (see §8.1), some entries may appear misaligned (e.g., RST-006 shows 📄 but is actually implemented as spec RST-005).

| ID        | Implemented | Status  | BUG_APP | Priority |
| --------- | ----------- | ------- | ------- | -------- |
| **AUTH**  |             |         |         |          |
| AUTH-001  | ✅ `login.spec.ts` | Active | — | P0 |
| AUTH-002  | ✅ `login.spec.ts` | Active | — | P0 |
| AUTH-003  | ✅ `login.spec.ts` | Active | — | P0 |
| AUTH-004  | ✅ `login.spec.ts` | Active | — | P1 |
| AUTH-005  | ✅ `login.spec.ts` | Active | — | P1 |
| AUTH-006  | ✅ `login.spec.ts` | Active | ⚠️ | P1 |
| AUTH-007  | ✅ `login.spec.ts` | Active | ⚠️ | P1 |
| AUTH-008  | ✅ `login.spec.ts` | Active | — | P2 |
| AUTH-009  | ✅ `login.spec.ts` | Active | — | P1 |
| AUTH-010  | ✅ `login.spec.ts` | Active | — | P1 |
| AUTH-011  | ✅ `login.spec.ts` | Active | — | P3 |
| AUTH-012  | ✅ `login.spec.ts` | Active | — | P3 |
| AUTH-013  | 📄 docs only | — | — | P2 |
| AUTH-014  | ✅ `login.spec.ts` | Active | — | P3 |
| AUTH-015  | ✅ `login.spec.ts` | Active | — | P2 |
| AUTH-016  | 📄 docs only | — | — | P2 |
| AUTH-017  | 📄 docs only | — | — | P2 |
| AUTH-018  | 📄 docs only | — | — | P2 |
| AUTH-019  | 📄 docs only | — | — | P3 |
| AUTH-020  | ✅ `login.spec.ts` | Active | — | P1 |
| AUTH-021  | ✅ `login.spec.ts` | Active | — | P3 |
| AUTH-022  | ✅ `login.spec.ts` | Active | — | P3 |
| AUTH-023  | ✅ `login.spec.ts` | Active | — | P3 |
| **REG**   |             |         |         |          |
| REG-001   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-002   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-003   | ✅ `register.spec.ts` | ⏭️ Skipped | — | P0 |
| REG-004   | ✅ `register.spec.ts` | Active | ❌ MISSING | P1 |
| REG-005   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-006   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-007   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-008   | 📄 docs only | — | — | P2 |
| REG-009   | 📄 docs only | — | — | P2 |
| REG-010   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-011   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-012   | ✅ `register.spec.ts` | Active | — | P1 |
| REG-013   | 📄 docs only | — | — | P1 |
| REG-014   | 📄 docs only | — | — | P1 |
| REG-015   | 📄 docs only | — | — | P1 |
| REG-016   | 📄 docs only | — | — | P1 |
| REG-017   | 📄 docs only | — | — | P2 |
| REG-018   | 📄 docs only | — | — | P2 |
| REG-019   | 📄 docs only | — | — | P2 |
| REG-020   | 📄 docs only | — | — | P1 |
| REG-021   | 📄 docs only | — | — | P2 |
| REG-022   | 📄 docs only | — | — | P2 |
| REG-023   | 📄 docs only | — | — | P2 |
| REG-024   | 📄 docs only | — | — | P3 |
| REG-025   | 📄 docs only | — | — | P1 |
| REG-026   | 📄 docs only | — | — | P2 |
| REG-027   | 📄 docs only | — | — | P3 |
| **FRG**   |             |         |         |          |
| FRG-001   | ✅ `forgot-password.spec.ts` | Active | — | P0 |
| FRG-002   | ✅ `forgot-password.spec.ts` | Active | — | P0 |
| FRG-003   | ✅ `forgot-password.spec.ts` | Active | — | P1 |
| FRG-004   | ✅ `forgot-password.spec.ts` | Active | — | P1 |
| FRG-005   | ✅ `forgot-password.spec.ts` | Active | — | P0 |
| FRG-006   | ✅ `forgot-password.spec.ts` | Active | — | P1 |
| FRG-007   | 📄 docs only | — | — | P2 |
| FRG-008   | 📄 docs only | — | — | P2 |
| FRG-009   | 📄 docs only | — | — | P3 |
| **LGT**   |             |         |         |          |
| LGT-001   | ✅ `logout.spec.ts` | Active | — | P0 |
| LGT-002   | ✅ `logout.spec.ts` | Active | — | P1 |
| LGT-003   | ✅ `logout.spec.ts` | ⚠️ Incomplete | — | P2 |
| LGT-004   | 📄 docs only | — | — | P2 |
| LGT-005   | 📄 docs only | — | — | P2 |
| LGT-006   | 📄 docs only | — | — | P2 |
| **ME**    |             |         |         |          |
| ME-001   | ✅ `auth-me.spec.ts` | Active | — | P0 |
| ME-002   | ✅ `auth-me.spec.ts` | Active | — | P2 |
| ME-003   | ✅ `auth-me.spec.ts` | Active | — | P0 |
| ME-004   | ✅ `auth-me.spec.ts` | Active | — | P1 |
| ME-005   | 📄 docs only | — | — | P2 |
| ME-006   | 📄 docs only | — | — | P2 |
| **RST**   |             |         |         |          |
| RST-001   | ✅ `reset-password.spec.ts` | ⏭️ Skipped | — | P2 |
| RST-002   | ✅ `reset-password.spec.ts` | Active | — | P2 |
| RST-003   | ✅ `reset-password.spec.ts` | Active | — | P2 |
| RST-004   | ✅ `reset-password.spec.ts` | Active | — | P2 |
| RST-005   | ✅ `reset-password.spec.ts` | Active | — | P2 |
| RST-006   | 📄 docs only | — | — | P2 |
| RST-007   | 📄 docs only | — | — | P2 |
| RST-008   | 📄 docs only | — | — | P2 |
| RST-009   | 📄 docs only | — | — | P3 |

---

> **Report generated:** June 23, 2026
> **Based on:** Test case docs v1.0 + Spec file audit (playwright-engineer audit)
> **Next review:** Setelah implementasi gap coverage dan Quick Wins
