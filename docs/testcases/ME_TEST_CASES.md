# Auth Me Module — Test Cases (ME)

## Module Info

| Item              | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Prefix**        | `ME-XXX`                                                     |
| **Module**        | Auth Me (Get Current User Profile)                           |
| **API**           | `GET /v1/auth/me`                                            |
| **Related Docs**  | `docs/WEBSITE_DOCUMENTATION.md` §6.4, `docs/API_DOCUMENTATION.md` §1 |
| **Test Data**     | `tests/data/auth-test-data.ts`                               |

---

## Auth Me Workflow

```
User navigates to protected page (e.g., /dashboard)
        ↓
┌──────────────────────────────────────────────┐
│ GET /v1/auth/me (Bearer token in Cookie)     │
│ ├ 200 → Return user profile + clinic data    │
│ ├ 401 → Token expired/invalid → redirect     │
│ └ 403 → Forbidden                            │
└──────────────────────────────────────────────┘
```

---

## Test Scenarios

---

### ME-001: Auth Me Sukses — User Profile Returns Correct Data

**Priority:** P1

**Preconditions:**
- Login sebagai doctor (`tatang.doctor@gmail.com`)
- Login sebagai orthodontist (`tatang.orthodontist@gmail.com`)
- Login sebagai superadmin (`tatang.admin@gmail.com`)

**Steps:**
1. Login sukses (AUTH-001)
2. Setelah redirect ke dashboard, intercept GET `/v1/auth/me`
3. Verifikasi response profile sesuai role

**Expected Results:**
- HTTP 200
- `body.status` = true
- `body.data.user.email` sesuai role credentials
- `body.data.user.context_role` sesuai role (`dentist`, `orthodontist`, `superadmin`)
- `body.data.user.clinic` ada untuk doctor/superadmin yang punya clinic
- `body.data.user.id` valid UUID

**API Verification:**
```typescript
const response = await page.waitForResponse((r) =>
  r.url().includes("/v1/auth/me")
);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
expect(body.data.user.email).toBe("tatang.doctor@gmail.com");
expect(body.data.user.context_role).toBe("dentist");
```

---

### ME-002: Auth Me — Response Structure Verification

**Priority:** P2
**Related:** API_DOC §1 — GET /auth/me (same response as login)

**Steps:**
1. Login sebagai doctor
2. Tunggu request `/v1/auth/me` (triggered saat navigate ke dashboard)
3. Verifikasi struktur response

**Expected Fields:**
```typescript
expect(body.data.user.id).toBeDefined();
expect(body.data.user.email).toBeDefined();
expect(body.data.user.role).toBeDefined();
expect(body.data.user.context_role).toBeDefined();
expect(body.data.user.first_name).toBeDefined();
expect(body.data.user.last_name).toBeDefined();
expect(body.data.user.full_name).toBeDefined();
expect(body.data.user.phone_number).toBeDefined();
expect(body.data.user.is_active).toBe(true);
expect(body.data.user.is_verified).toBe(true);
expect(body.data.user.created_at).toBeDefined();

// Clinic (should exist for doctor with assigned clinic)
if (body.data.user.clinic) {
  expect(body.data.user.clinic.id).toBeDefined();
  expect(body.data.user.clinic.name).toBeDefined();
}
```

---

### ME-003: Auth Me — Token Expired — Redirect to Login

**Priority:** P2

**Note:** Test ini menggunakan route interception untuk mensimulasi session expired.

**Steps:**
1. Login sukses (dapat token)
2. Clear cookies / inject expired token
3. Navigasi ke `/dashboard`
4. Tangkap response `/v1/auth/me`
5. Verifikasi redirect ke login

**Expected Results (via intercept):**
- `/v1/auth/me` returns HTTP **401**
- Browser redirect ke `/auth/login`
- Halaman login muncul

---

### ME-004: Auth Me — Unauthorized (No Token)

**Priority:** P1

**Steps:**
1. Tanpa login, langsung navigasi ke `/dashboard`

**Expected Results:**
- Redirect ke `/auth/login`
- Tidak bisa mengakses dashboard tanpa autentikasi

---

### ME-005: Auth Me — Role Context Verification

**Priority:** P2

**Steps:**
1. Login sebagai doctor → verify `context_role` = `dentist`
2. Logout
3. Login sebagai orthodontist → verify `context_role` = `orthodontist`
4. Logout
5. Login sebagai superadmin → verify `context_role` = `superadmin`

**Expected Results:**
- Masing-masing role memiliki `context_role` yang sesuai di response `/v1/auth/me`

---

### ME-006: Auth Me — 500 Error Handling

**Priority:** P2

**Steps:**
1. Intercept route `/v1/auth/me` return 500
2. Login atau refresh halaman
3. Verifikasi error toast atau fallback UI

---

## Test Matrix

| ID      | Description                              | Priority | Type            | API Endpoint | Tags            |
| ------- | ---------------------------------------- | -------- | --------------- | ------------ | --------------- |
| ME-001  | Auth me sukses — profile sesuai role     | P1       | Positive        | GET /auth/me | @smoke          |
| ME-002  | Auth me response structure verification  | P2       | API Contract    | GET /auth/me | @regression     |
| ME-003  | Token expired — redirect to login        | P2       | Error Handling  | GET /auth/me | @error-handling |
| ME-004  | Unauthorized (no token) — redirect       | P1       | Negative        | —            | @smoke          |
| ME-005  | Role context verification (3 roles)      | P2       | Positive        | GET /auth/me | @regression     |
| ME-006  | API 500 error handling                   | P2       | Error Handling  | GET /auth/me | @error-handling |

---

## Related API Endpoints

| Method | Endpoint        | Auth | Description                     |
| ------ | --------------- | ---- | ------------------------------- |
| GET    | `/v1/auth/me`   | Yes  | Get current authenticated user  |
