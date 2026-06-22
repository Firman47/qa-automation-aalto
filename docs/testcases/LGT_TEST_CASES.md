# Logout Module — Test Cases (LGT)

## Module Info

| Item              | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Prefix**        | `LGT-XXX`                                                    |
| **Module**        | Logout                                                       |
| **URL**           | `/auth/logout` (API endpoint, triggered from User Avatar menu) |
| **API**           | `POST /v1/auth/logout`                                       |
| **Related Docs**  | `docs/WEBSITE_DOCUMENTATION.md` §5.2, `docs/API_DOCUMENTATION.md` §1 |
| **Test Data**     | `tests/data/auth-test-data.ts`                               |

---

## Logout Workflow

```
User is authenticated on dashboard
        ↓
Click user avatar (top right)
        ↓
Dropdown menu appears:
  ├ View Profile → /settings
  ├ Settings → /settings
  └ Sign Out → triggers logout
        ↓
Click "Sign Out"
        ↓
┌──────────────────────────────────────────────┐
│ POST /v1/auth/logout                         │
│ ├ 200 → "Logout successful"                  │
│ │  + Set-Cookie: access_token=; Max-Age=0    │
│ └ Redirect to /auth/login                    │
└──────────────────────────────────────────────┘
```

---

## Test Scenarios

---

### LGT-001: Logout Sukses — Redirect ke Login Page

**Priority:** P1

**Preconditions:**
- User sudah login sebagai role manapun

**Steps:**
1. Klik user avatar (top right)
2. Verifikasi dropdown muncul dengan menu:
   - View Profile
   - Settings
   - Sign Out
3. Klik "Sign Out"
4. Tangkap response API
5. Verifikasi redirect ke `/auth/login`

**Expected Results:**
- API: HTTP **200**, `{ status: true, message: "Logout successful" }`
- Response header: `Set-Cookie: access_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
- Browser redirect ke `https://dental-monitoring.sadigit.co.id/auth/login`
- Halaman login muncul (Welcome back.)

**Selectors / Locators:**
```typescript
// User avatar button — initial letter, top right
page.getByRole("button").filter({ has: page.locator('[class*="avatar"]') })
// Or more specifically:
page.locator('[class*="topbar"] [class*="avatar"]')
// Sign Out button in dropdown
page.getByRole("menuitem", { name: "Sign Out" })
// or
page.getByText("Sign Out")
```

**API Verification:**
```typescript
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().includes("/v1/auth/logout")),
  page.getByText("Sign Out").click(),
]);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.status).toBe(true);
expect(body.message).toBe("Logout successful");

// Verify Set-Cookie header clears auth
const headers = response.headers();
expect(headers["set-cookie"]).toContain("access_token=; Max-Age=0");
```

---

### LGT-002: Setelah Logout — Halaman Terproteksi Tidak Bisa Diakses

**Priority:** P1

**Preconditions:**
- User sudah login
- User sudah logout (LGT-001)

**Steps:**
1. Setelah logout, coba navigasi langsung ke `/dashboard`

**Expected Results:**
- Redirect ke `/auth/login`
- Dashboard tidak bisa diakses tanpa session

---

### LGT-003: Loading State Saat Logout

**Priority:** P2
**Related:** WEBSITE_DOC §10.3 Loading States

**Steps:**
1. Intercept logout route dengan delay 3 detik
2. Klik "Sign Out"
3. Verifikasi loading state (spinner, disabled state)
4. Response tiba → redirect ke login

---

### LGT-004: Logout — API 500 Error Handling

**Priority:** P2

**Steps:**
1. Intercept route `**/v1/auth/logout` untuk return 500
2. Klik "Sign Out"
3. Verifikasi error toast muncul
4. Halaman tetap di dashboard

---

### LGT-005: Logout — Network Error Handling

**Priority:** P2

**Steps:**
1. Intercept route `**/v1/auth/logout` untuk abort
2. Klik "Sign Out"
3. Verifikasi "Connection error" toast

---

### LGT-006: User Avatar Dropdown — Menu Items

**Priority:** P2
**Related:** WEBSITE_DOC §5.2 Top Bar

**Steps:**
1. Klik user avatar di top bar
2. Verifikasi ketiga menu item muncul:
   - "View Profile" → navigasi ke `/settings`
   - "Settings" → navigasi ke `/settings`
   - "Sign Out" → trigger logout

**Expected Results:**
- Dropdown visible
- "View Profile" link → `/settings`
- "Settings" link → `/settings`
- "Sign Out" → POST `/v1/auth/logout`

---

## Test Matrix

| ID      | Description                                     | Priority | Type            | API Endpoint     | Tags            |
| ------- | ----------------------------------------------- | -------- | --------------- | ---------------- | --------------- |
| LGT-001 | Logout sukses — redirect ke login               | P1       | Positive        | POST /logout     | @smoke          |
| LGT-002 | Setelah logout — halaman terproteksi tidak bisa  | P1       | Positive        | —                | @regression     |
| LGT-003 | Loading state saat logout                       | P2       | UI State        | POST /logout     | @regression     |
| LGT-004 | API 500 error handling                          | P2       | Error Handling  | POST /logout     | @error-handling |
| LGT-005 | Network error handling                          | P2       | Error Handling  | POST /logout     | @error-handling |
| LGT-006 | User avatar dropdown menu items                 | P2       | UI Verification | —                | @regression     |

---

## Related API Endpoints

| Method | Endpoint              | Auth | Description                    |
| ------ | --------------------- | ---- | ------------------------------ |
| POST   | `/v1/auth/logout`     | Yes  | Logout, clear auth cookie      |
