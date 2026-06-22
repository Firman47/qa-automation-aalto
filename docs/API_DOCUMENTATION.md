# Aalto Dentist Portal — API Documentation

**Base URL:** `https://dentist-api.sadigit.co.id/v1/`

---

## Standard Response Envelope

Semua endpoint mengembalikan format:

```json
{
  "status": true,
  "message": "Operation successful",
  "data": {} | [] | null
}
```

**Catatan:** `status` adalah boolean (`true` = success, `false` = error), `message` adalah string deskriptif, `data` berisi payload response.

---

## Auth Endpoints

### POST /v1/auth/login

Authenticate user dengan email dan password.

**Request Body:**

```json
{
  "email": "tatang.doctor@gmail.com",
  "password": "Password123!",
  "remember": false
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "firebase_jwt_token_or_custom_token",
    "user": {
      "id": "uuid",
      "email": "tatang.doctor@gmail.com",
      "name": "Tatang Doctor",
      "role": "dentist",
      "context_role": "dentist"
    }
  }
}
```

**Error Response (401):**

```json
{
  "status": false,
  "message": "Invalid email or password",
  "data": null
}
```

**Rate Limit:**
- Limit: 5 requests per 60 seconds
- Headers: `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, `ratelimit-policy`
- Response (429): `{ "status": false, "message": "Too many requests" }`

### POST /v1/auth/register

Register new practice account. Multi-step process.

**Step 1 — Personal Information:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+61412345678",
  "email": "john@example.com",
  "experience_level": "General Dentist",
  "password": "Password123!",
  "confirm_password": "Password123!",
  "referral_code": "optional"
}
```

**Password Requirements:**
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Step 2 — Practice Information:**

```json
{
  "practice_name": "My Dental Clinic",
  "practice_address": "123 Main St",
  "practice_phone": "+61412345678",
  "practice_role": "Owner / Partner"
}
```

### POST /v1/auth/forgot

Send password reset link to email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Reset link sent to your email",
  "data": null
}
```

### POST /v1/auth/reset

Reset password with token.

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "password": "NewPassword123!"
}
```

---

## Notifications

### GET /v1/notifications?limit=25

Get user notifications. Requires auth token.

**Response (200):**

```json
{
  "status": true,
  "message": "Notifications fetched successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "is_read": false,
        "read_at": null,
        "created_at": "2026-06-22T07:12:44.691Z",
        "type": "system",
        "title": "Login Notification",
        "message": "You have successfully logged in to your account.",
        "action_url": null
      }
    ],
    "unread_count": 181,
    "next_cursor": "cursor_string"
  }
}
```

**Notification Types:** `system`, `case_submitted`, `case_under_review`, `case_reviewed`, `case_approved`, `case_in_treatment`, `lead_accepted`, `lead_booked`, `files_uploaded`, `payment_received`

---

## Cases

### GET /v1/cases

Get patient cases list. Requires auth.

### POST /v1/cases

Create a new case.

### GET /v1/cases/:id

Get case detail.

---

## Leads

### GET /v1/leads

Get lead patients list.

### GET /v1/leads/income

Get lead income data.

### GET /v1/leads/invoices

Get invoices list.

---

## Users

### GET /v1/users

Get users list (clinic staff).

---

## Messages

### GET /v1/messages

Get patient messages.

### GET /v1/messages/support

Get support admin messages.

---

## Settings

### GET /v1/settings

Get user settings.

### PATCH /v1/settings

Update user settings.

### PATCH /v1/settings/bank

Update bank account information.

### PATCH /v1/settings/clinic

Update practice/clinic information.

### PATCH /v1/settings/notifications

Update notification preferences.

### PATCH /v1/settings/security

Update security settings (password, 2FA, etc.).

---

## HTTP Status Code Mapping

| HTTP | Meaning         | Contoh                                     |
| ---- | --------------- | ------------------------------------------ |
| 200  | Success         | Login berhasil, data fetched               |
| 400  | Invalid request | Missing fields, validation error           |
| 401  | Unauthenticated | Wrong credentials, invalid/expired session |
| 403  | Forbidden       | No permission for resource                 |
| 404  | Not found       | Resource not found                         |
| 409  | Conflict        | Email already registered                   |
| 422  | Unprocessable   | Semantically invalid data                  |
| 429  | Rate limited    | Too many login requests (5/min)            |
| 500  | Server error    | Unexpected error                           |
