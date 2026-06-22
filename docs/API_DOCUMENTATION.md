# Aalto Dentist Portal — API Documentation

**Base URL:** `https://dentist-api.sadigit.co.id/v1/`

**Authentication:** JWT-based via `access_token` cookie (HttpOnly, Secure, SameSite=Lax)

**Response Format:** JSON

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

**Catatan:**

- `status` — boolean (`true` = success, `false` = error)
- `message` — string deskriptif
- `data` — payload response (object, array, atau null)
- **Error responses** menyertakan field `errors` untuk detail validasi per-field:

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

---

## HTTP Methods Usage

| Method   | Usage                         |
| -------- | ----------------------------- |
| `GET`    | Retrieve resource(s)          |
| `POST`   | Create new resource           |
| `PATCH`  | Partial update                |
| `PUT`    | Full update (langka)          |
| `DELETE` | Remove resource (soft delete) |

**Note:** API ini umumnya menggunakan `PATCH` untuk update (partial — hanya kirim field yang perlu diubah).

---

## Pagination

Endpoint list biasanya mendukung pagination dengan parameter query:

| Parameter    | Type   | Default | Description         |
| ------------ | ------ | ------- | ------------------- |
| `page`       | number | 1       | Halaman saat ini    |
| `limit`      | number | 20      | Items per halaman   |
| `search`     | string | -       | Pencarian           |
| `sort_by`    | string | -       | Field untuk sorting |
| `sort_order` | string | -       | `asc` atau `desc`   |

**Response pagination:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Endpoints

### 1. Authentication (`AUTH`)

| Method | Endpoint                        | Auth | Description                            |
| ------ | ------------------------------- | ---- | -------------------------------------- |
| POST   | `/v1/auth/login`                | No   | Login dengan email dan password        |
| POST   | `/v1/auth/register`             | No   | Registrasi user baru                   |
| POST   | `/v1/auth/logout`               | Yes  | Logout session                         |
| GET    | `/v1/auth/me`                   | Yes  | Get current authenticated user profile |
| POST   | `/v1/auth/forgot-password`      | No   | Kirim reset link ke email              |
| POST   | `/v1/auth/reset-password`       | No   | Reset password dengan token            |
| POST   | `/v1/auth/confirm-double-login` | No   | Konfirmasi double login                |

#### POST `/v1/auth/login`

**Request:**

```json
{
  "email": "tatang.doctor@gmail.com",
  "password": "Password123!",
  "remember": false
}
```

**Success (200):**

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "28f263ed-e8ad-40c9-9d56-0a6f3718341e",
      "email": "tatang.doctor@gmail.com",
      "role": "admin",
      "context_role": "dentist",
      "first_name": "Tatang",
      "middle_name": null,
      "last_name": "Doctor",
      "preferred_name": null,
      "full_name": "Tatang Doctor",
      "phone_number": "+628111222333",
      "photo_url": "https://...",
      "is_active": true,
      "is_verified": true,
      "last_login_at": "2026-01-10T05:36:17.944Z",
      "created_at": "2026-01-05T09:40:59.648Z",
      "updated_at": "2026-01-10T05:36:17.951Z",
      "clinic": {
        "id": "8c6a9c9b-0f43-4e3f-92d7-9234a7059b71",
        "name": "Smile Dental Clinic Jakarta",
        "photo_url": null,
        "address": "Jl. Sudirman No. 123",
        "apt_suite": "Suite 501",
        "city": "Jakarta",
        "state": "DKI Jakarta",
        "country": "Indonesia",
        "zip_code": "12190",
        "phone_number": "+622123456789",
        "email": "info@smilejakarta.com",
        "practice_type": "national",
        "tier_level": "platinum"
      }
    }
  }
}
```

**Double Login Required (200):**

```json
{
  "status": true,
  "message": "Double login confirmation required. Please check your email for confirmation token.",
  "data": {
    "requires_double_login": true,
    "email": "user@example.com",
    "message": "A confirmation email has been sent to your email address. Please use the provided token to confirm your login."
  }
}
```

**Error (401):**

```json
{
  "status": false,
  "message": "Invalid credentials",
  "errors": {
    "email": ["Invalid email or password"]
  }
}
```

**Password Expired (403):**

```json
{
  "status": false,
  "message": "Your password has expired. A password reset link has been sent to your email.",
  "data": null
}
```

**Account Locked (403):**

```json
{
  "status": false,
  "message": "Account has been locked due to too many failed login attempts. Please try again in 30 minutes.",
  "data": null
}
```

**Password Expiry Warning:**

```json
{
  "status": true,
  "message": "Login successful. Warning: Your password will expire in 2 days.",
  "data": null
}
```

**Rate Limit:**

- 5 requests per 60 seconds per IP/user
- Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `RateLimit-Policy`
- Response (429): `{ "status": false, "message": "Too many requests" }`

#### POST `/v1/auth/register`

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "clinic_id": "optional-clinic-uuid",
  "context_role": "dentist",
  "referral_code": "optional-referral-code",
  "bank_account": {
    "bank_name": "Chase Bank",
    "bank_routing_number": "021000021",
    "bank_account_number": "123456789",
    "bank_account_type": "checking",
    "bank_account_nickname": "Business Account"
  }
}
```

**Password Requirements:**

- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Success (201):**

```json
{
  "status": true,
  "message": "User registered successfully. Please verify your email address.",
  "data": {
    "user": {
      "id": "789e0123-f456-78d9-0123-456789012345",
      "email": "newuser@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+1234567890",
      "role": "DENTIST",
      "is_active": true,
      "is_verified": false,
      "created_at": "2026-03-09T10:00:00Z"
    },
    "verification_required": true,
    "message": "Please check your email for verification instructions."
  }
}
```

**Error (409 — Email already registered):**

```json
{
  "status": false,
  "message": "Email is already registered",
  "data": null
}
```

#### POST `/v1/auth/logout`

**Response (200):**

```json
{
  "status": true,
  "message": "Logout successful",
  "data": null
}
```

Headers: `Set-Cookie: access_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`

#### GET `/v1/auth/me`

Get current authenticated user profile. Response sama dengan login sukses (field user + clinic).

#### POST `/v1/auth/forgot-password`

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "status": true,
  "message": "Reset link sent to your email",
  "data": null
}
```

#### POST `/v1/auth/reset-password`

**Request:**

```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response (200):**

```json
{
  "status": true,
  "message": "Password has been reset successfully. You can now login with your new password.",
  "data": null
}
```

#### POST `/v1/auth/confirm-double-login`

**Request:**

```json
{
  "token": "confirmation-token-from-email"
}
```

**Response (200):**

```json
{
  "status": true,
  "message": "Login confirmed. Previous session has been logged out.",
  "data": null
}
```

---

### 2. Dashboard (`DASHBOARD`)

| Method | Endpoint              | Auth | Description                        |
| ------ | --------------------- | ---- | ---------------------------------- |
| GET    | `/v1/dashboard/stats` | Yes  | Role-specific dashboard statistics |

#### GET `/v1/dashboard/stats`

Role-specific dashboard statistics.

**Dentist Response:**

```json
{
  "status": true,
  "data": {
    "role": "dentist",
    "user": { "id": "uuid", "full_name": "Dr. Michael Smith" },
    "clinic": { "id": "uuid", "name": "Sunshine Dental", "tier_level": "gold" },
    "cases": {
      "total": 45,
      "draft": 3,
      "submitted": 5,
      "under_review": 4,
      "reviewed": 2,
      "approved": 3,
      "in_treatment": 12,
      "need_verification": 1,
      "completed": 15,
      "rejected": 0
    },
    "patients": { "total": 120, "with_active_cases": 12, "new_this_month": 8 },
    "leads": {
      "total": 28,
      "new": 5,
      "accepted": 12,
      "rejected": 3,
      "booked": 6,
      "started": 2,
      "total_value": 140000.0,
      "total_revenue": 28000.0,
      "acceptance_rate": 75.0,
      "conversion_rate": 42.8
    },
    "recent_activities": [],
    "quick_stats": {
      "cases_need_action": 3,
      "unread_messages": 5,
      "pending_leads": 5
    }
  }
}
```

**Orthodontist Response:**

```json
{
  "status": true,
  "data": {
    "role": "orthodontist",
    "user": { "id": "uuid", "full_name": "Dr. Emily Johnson" },
    "cases": {
      "total_assigned": 120,
      "pending_review": 8,
      "in_progress": 15,
      "sent_to_dentist": 12,
      "approved": 10,
      "completed": 75,
      "average_review_time_hours": 24.5
    },
    "assigned_clinics": [],
    "workload": { "cases_this_week": 5, "cases_this_month": 18 },
    "recent_activities": [],
    "quick_stats": {
      "cases_need_review": 8,
      "unread_messages": 3,
      "pending_approvals": 12
    }
  }
}
```

**Admin Response:**

```json
{
  "status": true,
  "data": {
    "role": "admin",
    "user": { "id": "uuid", "full_name": "Admin User" },
    "system": {
      "total_users": 150,
      "total_clinics": 25,
      "total_cases": 1250,
      "total_patients": 3500
    },
    "cases": {
      "total": 1250,
      "draft": 45,
      "submitted": 68,
      "under_review": 52,
      "in_treatment": 145,
      "completed": 920,
      "rejected": 20
    },
    "users": {
      "total_dentists": 85,
      "total_orthodontists": 15,
      "total_admins": 5
    },
    "performance": {
      "average_case_completion_days": 45.5,
      "average_review_time_hours": 26.3,
      "case_approval_rate": 94.5
    },
    "system_health": {
      "status": "healthy",
      "api_uptime": 99.98,
      "average_response_time_ms": 145
    }
  }
}
```

---

### 3. Referrals (`REFERRAL`)

| Method | Endpoint                  | Auth | Description                   |
| ------ | ------------------------- | ---- | ----------------------------- |
| GET    | `/v1/referrals/dashboard` | Yes  | Referral dashboard statistics |

---

### 4. Messages — Support (`MESSAGES.SUPPORT`)

| Method | Endpoint               | Auth | Description                           |
| ------ | ---------------------- | ---- | ------------------------------------- |
| POST   | `/v1/messages/support` | Yes  | Send email to admin/support from user |

#### POST `/v1/messages/support`

**Request:**

```json
{
  "user_id": null,
  "message": "Message From User"
}
```

---

### 5. Patients (`PATIENTS`)

| Method | Endpoint                             | Auth | Description                               |
| ------ | ------------------------------------ | ---- | ----------------------------------------- |
| GET    | `/v1/patients`                       | Yes  | List patients (filtered by clinic)        |
| POST   | `/v1/patients`                       | Yes  | Create new patient                        |
| GET    | `/v1/patients/:id`                   | Yes  | Get patient detail                        |
| PATCH  | `/v1/patients/:id`                   | Yes  | Update patient (partial)                  |
| DELETE | `/v1/patients/:id`                   | Yes  | Soft delete patient                       |
| GET    | `/v1/patients/getEx/:id`             | Yes  | Get external patient by ID (DM API)       |
| POST   | `/v1/patients/:id/monitoring/start`  | Yes  | Start patient monitoring                  |
| POST   | `/v1/patients/:id/monitoring/stop`   | Yes  | Stop patient monitoring                   |
| POST   | `/v1/patients/:id/monitoring/pause`  | Yes  | Pause patient monitoring                  |
| POST   | `/v1/patients/:id/monitoring/resume` | Yes  | Resume patient monitoring                 |
| GET    | `/v1/patients/:id/events`            | Yes  | Get patient monitoring history/events     |
| GET    | `/v1/patients/:id/notifications`     | Yes  | Get patient notifications                 |
| POST   | `/v1/patients/:id/engage-files`      | Yes  | Upload engage files (photos)              |
| GET    | `/v1/patients/:id/engage-files`      | Yes  | Get engage files                          |
| DELETE | `/v1/patients/engage-files/:fileId`  | Yes  | Delete engage file                        |
| POST   | `/v1/patients/transfer`              | Yes  | Transfer patient to another clinic/doctor |
| GET    | `/v1/patients/:id/scans`             | Yes  | Get patient scans (DM API)                |

#### GET `/v1/patients`

List patients (filtered by clinic for dentist).

**Query Parameters:** `search`, `page`, `limit`, `sort_by`, `sort_order`

**Response:**

```json
{
  "status": true,
  "message": "Patients retrieved successfully",
  "data": {
    "patients": [
      {
        "id": "789e0123-f456-78d9-0123-456789012345",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone_number": "+1234567890",
        "date_of_birth": "1990-01-01T00:00:00.000Z",
        "gender": "FEMALE",
        "patient_type": "REGULAR",
        "is_active": true,
        "created_at": "2026-03-09T10:00:00Z",
        "updated_at": "2026-03-09T10:00:00Z",
        "address": "123 Patient St",
        "city": "New York",
        "state": "NY",
        "zip_code": "10001",
        "country": "USA",
        "emergency_contact": {
          "name": "John Smith",
          "phone_number": "+0987654321",
          "relationship": "Spouse"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### POST `/v1/patients`

**Request:**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "address": "123 Patient St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "country": "USA",
  "gender": "FEMALE",
  "emergency_contact": {
    "name": "John Smith",
    "phone_number": "+0987654321",
    "relationship": "Spouse"
  }
}
```

**Response (201):**

```json
{
  "status": true,
  "message": "Patient created successfully",
  "data": {
    "id": "789e0123-f456-78d9-0123-456789012345",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-01-01T00:00:00.000Z",
    "address": "123 Patient St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA",
    "gender": "FEMALE",
    "patient_type": "REGULAR",
    "is_active": true,
    "created_at": "2026-03-09T10:00:00Z",
    "updated_at": "2026-03-09T10:00:00Z",
    "emergency_contact": {
      "name": "John Smith",
      "phone_number": "+0987654321",
      "relationship": "Spouse"
    },
    "clinic": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Downtown Dental Clinic"
    }
  }
}
```

#### GET/PATCH/DELETE `/v1/patients/:id`

- **GET**: Get patient detail (termasuk `cases` array dan field lengkap)
- **PATCH**: Partial update — semua field opsional
- **DELETE**: Soft delete

#### POST `/v1/patients/:id/monitoring/start|stop|pause|resume`

Monitoring control endpoints. Tidak ada request body khusus.

#### POST `/v1/patients/:id/monitoring/pause`

**Request:**

```json
{
  "interval_days": 7
}
```

#### GET `/v1/patients/:id/events`

Get patient monitoring history/events timeline.

#### GET `/v1/patients/:id/notifications`

Get patient-specific notifications.

#### POST `/v1/patients/:id/engage-files`

Upload engage images (multipart/form-data — SMILE, LEFT, RIGHT photos).

**Response:**

```json
{
  "status": true,
  "message": "3 engage images successfully uploaded",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "image_type": "RIGHT",
      "image_url": "http://localhost:3000/uploads/engage-images/.../RIGHT/right-...jpg",
      "created_at": "2026-03-09T10:30:00.000Z",
      "patient_id": "123e4567-e89b-12d3-a456-426614174000"
    }
  ]
}
```

**Image Types:** `SMILE`, `LEFT`, `RIGHT`

#### GET `/v1/patients/:id/engage-files`

**Response:**

```json
{
  "status": true,
  "message": "Engage images retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "image_type": "SMILE",
      "image_url": "http://localhost:3000/uploads/engage-images/.../SMILE/smile-...jpg",
      "created_at": "2026-03-09T10:30:00.000Z"
    }
  ]
}
```

#### DELETE `/v1/patients/engage-files/:fileId`

**Response:**

```json
{
  "status": true,
  "message": "Engage image successfully deleted",
  "data": {
    "deleted_file_id": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

#### POST `/v1/patients/transfer`

Transfer patient to another clinic/doctor.

**Request:**

```json
{
  "patient_id": "a7e55d1c-1b4e-4206-95ea-adcf95501526",
  "from_clinic_id": "93b8293b-05da-48bb-9743-ad5b1cd12ec2",
  "target_clinic_id": "5d799d5b-c4f8-44ee-9e31-8b9096ad1dba",
  "target_dm_doctor_id": 0,
  "target_orthodontist_id": "asd"
}
```

---

### 6. Treatments (`TREATMENTS`)

| Method | Endpoint                  | Auth | Description                       |
| ------ | ------------------------- | ---- | --------------------------------- |
| GET    | `/v1/treatments`          | Yes  | List treatments                   |
| POST   | `/v1/treatments`          | Yes  | Create treatment summary          |
| PATCH  | `/v1/treatments/:id`      | Yes  | Update treatment (partial)        |
| POST   | `/v1/treatments/:id/send` | Yes  | Send treatment summary to dentist |
| DELETE | `/v1/treatments/:id`      | Yes  | Delete treatment                  |

---

### 7. Appointments (`APPOINTMENTS`)

| Method | Endpoint               | Auth | Description                     |
| ------ | ---------------------- | ---- | ------------------------------- |
| GET    | `/v1/appointments`     | Yes  | List appointments/consultations |
| POST   | `/v1/appointments`     | Yes  | Schedule consultation           |
| PATCH  | `/v1/appointments/:id` | Yes  | Update consultation schedule    |

#### POST `/v1/appointments`

**Request:**

```json
{
  "lead_id": "lead-uuid",
  "consultation_date": "2025-03-10T10:00:00.000Z",
  "doctor_id": 123,
  "notes": "Initial consultation for aligner treatment"
}
```

#### PATCH `/v1/appointments/:lead_id`

**Request:**

```json
{
  "consultation_date": "2025-03-11T14:00:00.000Z",
  "doctor_id": 456,
  "notes": "Rescheduled consultation"
}
```

---

### 8. Leads (`LEADS`)

| Method | Endpoint                        | Auth | Description                     |
| ------ | ------------------------------- | ---- | ------------------------------- |
| GET    | `/v1/leads`                     | Yes  | List leads (dentist role)       |
| POST   | `/v1/leads`                     | Yes  | Create new lead                 |
| GET    | `/v1/leads/:id`                 | Yes  | Get lead detail                 |
| PATCH  | `/v1/leads/:id`                 | Yes  | Update lead (partial)           |
| PATCH  | `/v1/leads/:id/status`          | Yes  | Update lead status              |
| POST   | `/v1/leads/:id/accept`          | Yes  | Accept lead                     |
| POST   | `/v1/leads/:id/reject`          | Yes  | Reject lead                     |
| POST   | `/v1/leads/:id/convert-to-case` | Yes  | Convert lead to case            |
| GET    | `/v1/leads/:id/activities`      | Yes  | List lead activities            |
| POST   | `/v1/leads/:id/activities`      | Yes  | Create lead activity            |
| GET    | `/v1/leads/income-summary`      | Yes  | Get income statistics           |
| GET    | `/v1/leads/summaries`           | Yes  | Get lead summaries/aggregations |

#### GET `/v1/leads`

List leads (dentist role).

**Query Parameters:** `status`, `page`, `limit`, `sort_by`, `sort_order`, `start_date`, `end_date`, `clinic_id`

**Response includes `summary` object:**

```json
{
  "summary": {
    "total_leads": 45,
    "new_leads": 12,
    "booked_leads": 28,
    "case_submitted_leads": 3,
    "cancelled_leads": 2,
    "total_value": 225000.0,
    "total_revenue": 45000.0,
    "booking_rate": 75.0,
    "conversion_rate": 9.7
  }
}
```

**Lead Status Flow:** `new` → `booked` → (Patient Visit Offline) → `case_submitted` → `cancelled`

#### POST `/v1/leads`

**Request — Create Lead:**

```json
{
  "patient_id": "patient-uuid",
  "clinic_id": "clinic-uuid",
  "first_name": "John",
  "middle_name": null,
  "last_name": "Doe",
  "preferred_name": "Johnny",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "status": "NEW",
  "consultation_date": "2025-03-10T00:00:00.000Z",
  "treatment_type": "ALIGNER",
  "deposit_amount": 500,
  "deposit_status": "PENDING",
  "treatment_value": 3000,
  "revenue_generated": 0,
  "smile_goals": "Straighten teeth",
  "ai_smile_preview_url": null,
  "notes": "Interested in treatment",
  "bitesoft_notes": null,
  "source": "Website",
  "address": "123 Main St",
  "apt_suite": null,
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zip_code": "10001",
  "gender": "MALE",
  "medical_history": null,
  "emergency_contact": {
    "name": "Jane Doe",
    "phone_number": "+0987654321",
    "relationship": "Spouse"
  },
  "paying_on_clinic": "DIRECT",
  "not_available": null
}
```

#### PATCH `/v1/leads/:id/status`

**Request:**

```json
{
  "status": "booked",
  "consultation_date": "2024-11-25T14:00:00Z"
}
```

#### POST `/v1/leads/:id/activities`

**Request:**

```json
{
  "activity_type": "CALL",
  "notes": "Called patient, interested in proceeding"
}
```

#### GET `/v1/leads/income-summary`

Get income statistics.

**Query Parameters:** `start_date`, `end_date`

---

### 9. Cases (`CASES`)

| Method | Endpoint                        | Auth | Description                              |
| ------ | ------------------------------- | ---- | ---------------------------------------- |
| GET    | `/v1/cases`                     | Yes  | List cases (filtered by role)            |
| POST   | `/v1/cases`                     | Yes  | Create new case                          |
| GET    | `/v1/cases/:id`                 | Yes  | Get case detail                          |
| PATCH  | `/v1/cases/:id`                 | Yes  | Update case (partial)                    |
| PATCH  | `/v1/cases/:id/status`          | Yes  | Update case status                       |
| GET    | `/v1/cases/:id/tracker-events`  | Yes  | Get case tracker events (timeline)       |
| POST   | `/v1/cases/:id/tracker-events`  | Yes  | Create tracker event                     |
| POST   | `/v1/cases/:id/files`           | Yes  | Upload case files (multipart)            |
| DELETE | `/v1/cases/:id/files/:fileId`   | Yes  | Delete case file                         |
| POST   | `/v1/cases/:id/files/auto-map`  | Yes  | Auto-map/reorganize case files           |
| GET    | `/v1/cases/qr-code`             | Yes  | Generate QR code for quick case creation |
| GET    | `/v1/cases/quick-create/:token` | No   | Get mobile quick-create form             |
| POST   | `/v1/cases/quick-create/:token` | No   | Submit quick create from mobile          |
| GET    | `/v1/cases/summaries`           | Yes  | Get case summaries/aggregations          |
| POST   | `/v1/cases/:id/invoice`         | Yes  | Add invoice item to case                 |
| GET    | `/v1/cases/:id/information`     | No   | Get case information (public)            |
| POST   | `/v1/cases/:id/email`           | Yes  | Send case information email to patient   |
| POST   | `/v1/cases/:id/message`         | Yes  | Send case message to room                |
| POST   | `/v1/cases/:id/paid`            | Yes  | Mark invoice as paid                     |
| POST   | `/v1/cases/:id/approval`        | Yes  | Send approval to user                    |
| POST   | `/v1/cases/:id/refine`          | Yes  | Refine/resubmit case                     |
| POST   | `/v1/cases/:id/cases`           | Yes  | Archive case                             |

#### GET `/v1/cases`

**Query Parameters:** `status`, `page`, `limit`, `search`, `sort_by`, `sort_order`, `clinic_id`, `patient_id`

**Response:**

```json
{
  "status": true,
  "message": "Cases retrieved successfully",
  "data": {
    "cases": [
      {
        "id": "789e0123-f456-78d9-0123-456789012345",
        "case_number": "CASE-001",
        "patient_id": "123e4567-e89b-12d3-a456-426614174000",
        "clinic_id": "uuid",
        "created_by_id": "uuid",
        "practice_type": "ALIGNER",
        "treatment_goals": "Improve smile alignment",
        "case_type": "FULL_TREATMENT",
        "status": "IN_PROGRESS",
        "xray_confirmation": true,
        "xray_date": "2024-11-15",
        "progress_percentage": 25.5,
        "created_at": "2026-03-09T10:00:00Z",
        "updated_at": "2026-03-09T10:00:00Z",
        "patient": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "first_name": "Sarah",
          "last_name": "Johnson",
          "email": "sarah.johnson@example.com"
        },
        "assigned_dentist": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "first_name": "Dr. Michael",
          "last_name": "Chen"
        },
        "assigned_orthodontist": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "first_name": "Dr. Emily",
          "last_name": "Rodriguez"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### POST `/v1/cases`

**Request — Complete Case:**

```json
{
  "patient_id": "patient-uuid",
  "case_number": "CASE-001",
  "practice_type": "ALIGNER",
  "treatment_goals": "Improve smile alignment",
  "treatment_notes": "Patient wants to fix crowding",
  "assigned_dentist_id": "dentist-uuid",
  "assigned_orthodontist_id": "orthodontist-uuid",
  "xray_confirmation": true,
  "xray_date": "2025-03-03T00:00:00.000Z",
  "case_type": "FULL_TREATMENT",
  "doctor_id": 123,
  "treatment_goal_answers": [
    {
      "question_id": "question-uuid",
      "answer": "Yes"
    }
  ]
}
```

**Minimum (Draft):**

```json
{
  "patient_id": "uuid",
  "practice_type": "national"
}
```

**Case Status Flow:**

- `draft` → `submitted` → `under_review` → `reviewed` → `approved` → `in_treatment` → `completed`
- `under_review` → `need_verification` (if ortho requests more info)
- Any status → `rejected` (with rejection_reason)

**Case Types:** `express`, `mild`, `moderate`, `complex`, `FULL_TREATMENT`, `RETAINER`
**Practice Types:** `national`, `regional`, `orthodontic`, `special_needs`, `ALIGNER`, `RETAINER`

#### PATCH `/v1/cases/:id/status`

**Request:**

```json
{
  "status": "approved",
  "notes": "Approved for treatment"
}
```

Query param: `?status=IN_TREATMENT`

#### POST `/v1/cases/:id/tracker-events`

**Request:**

```json
{
  "event_type": "STATUS_CHANGE",
  "description": "Case status updated",
  "metadata": {}
}
```

#### POST `/v1/cases/:id/files`

Upload multiple files (multipart/form-data).

**Form Fields:**

- `files[]`: binary files
- `file_types[]`: file type identifier

**File Types:** `stl_upper`, `stl_lower`, `photo_smile`, `photo_no_smile`, `photo_upper`, `photo_lower`, `photo_left`, `photo_right`, `photo_center`, `photo_profile`, `photo_xray`, `xray_image`, `other`

**Max file size:** 50MB per file, 200MB total per request.

#### POST `/v1/cases/:id/invoice`

**Request:**

```json
{
  "item_id": "item-uuid",
  "quantity": 1,
  "description": "Aligner set"
}
```

#### POST `/v1/cases/:id/refine`

**Request:**

```json
{
  "patient_id": "patient-uuid",
  "case_number": "CASE-001-REVISED",
  "practice_type": "ALIGNER",
  "treatment_goals": "Updated treatment goals",
  "treatment_notes": "Refinement needed"
}
```

---

### 10. Meetings (`MEETINGS`)

| Method | Endpoint                          | Auth | Description                   |
| ------ | --------------------------------- | ---- | ----------------------------- |
| POST   | `/v1/meetings/create-google-meet` | Yes  | Create Google Meet video call |

#### POST `/v1/meetings/create-google-meet`

**Request:**

```json
{
  "room_id": "case-uuid",
  "title": "Case Review Meeting"
}
```

---

### 11. Users (`USERS`)

| Method | Endpoint                       | Auth | Description               |
| ------ | ------------------------------ | ---- | ------------------------- |
| GET    | `/v1/users`                    | Yes  | List users                |
| POST   | `/v1/users`                    | Yes  | Create new user           |
| GET    | `/v1/users/:id`                | Yes  | Get user detail           |
| PATCH  | `/v1/users/:id`                | Yes  | Update user (partial)     |
| DELETE | `/v1/users/:id`                | Yes  | Delete user (soft delete) |
| GET    | `/v1/users/:id/reset-password` | Yes  | Send reset password email |
| PATCH  | `/v1/users/:id/status`         | Yes  | Update user active status |
| PATCH  | `/v1/users/:id/bank-account`   | Yes  | Update user bank account  |

#### GET `/v1/users`

**Query Parameters:** `page`, `limit`, `search`, `role`, `context_role`

**Response:**

```json
{
  "status": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "DENTIST",
        "context_role": "DENTIST",
        "phone_number": "+1234567890",
        "is_active": true,
        "is_verified": true,
        "clinic_id": "550e8400-e29b-41d4-a716-446655440000",
        "clinic": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Downtown Dental Clinic"
        },
        "created_at": "2026-02-01T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
  }
}
```

#### POST `/v1/users`

Create new user (multipart/form-data).

**Fields:** `email`, `username`, `password`, `role`, `context_role`, `first_name`, `middle_name`, `last_name`, `preferred_name`, `phone_number`, `photo` (file), `clinic_id`, `is_active`, `send_welcome_email`

**Response (201):**

```json
{
  "status": true,
  "message": "User created successfully",
  "data": {
    "id": "789e0123-f456-78d9-0123-456789012345",
    "email": "newuser@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "DENTIST",
    "context_role": "DENTIST",
    "phone_number": "+1234567890",
    "clinic_id": "550e8400-e29b-41d4-a716-446655440000",
    "doctor_id": "123e4567-e89b-12d3-a456-426614174000",
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-03-09T10:00:00Z",
    "updated_at": "2026-03-09T10:00:00Z",
    "photo_url": null,
    "clinic": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Downtown Dental Clinic",
      "address": "123 Main St, New York, NY",
      "phone": "+1-555-0123"
    }
  }
}
```

#### PATCH `/v1/users/:id/status`

**Request:**

```json
{
  "is_active": false
}
```

#### PATCH `/v1/users/:id/bank-account`

**Request:**

```json
{
  "bank_name": "Chase Bank",
  "bank_routing_number": "021000021",
  "bank_account_number": "123456789",
  "bank_account_type": "checking",
  "bank_account_nickname": "Business Account",
  "bank_iban": null,
  "bank_swift_code": null
}
```

---

### 12. Clinics (`CLINICS`)

| Method | Endpoint                                    | Auth | Description                 |
| ------ | ------------------------------------------- | ---- | --------------------------- |
| GET    | `/v1/clinics`                               | Yes  | List clinics                |
| POST   | `/v1/clinics`                               | Yes  | Create clinic               |
| GET    | `/v1/clinics/:id`                           | Yes  | Get clinic detail           |
| PATCH  | `/v1/clinics/:id`                           | Yes  | Update clinic (partial)     |
| DELETE | `/v1/clinics/:id`                           | Yes  | Delete clinic (soft delete) |
| PATCH  | `/v1/clinics/:id/status`                    | Yes  | Update clinic status        |
| PATCH  | `/v1/clinics/:id/tier`                      | Yes  | Update clinic tier level    |
| POST   | `/v1/clinics/:id/transfer-owner`            | Yes  | Transfer clinic ownership   |
| GET    | `/v1/clinics/:clinic_id/members`            | Yes  | List clinic members         |
| POST   | `/v1/clinics/:clinic_id/members`            | Yes  | Add clinic member           |
| DELETE | `/v1/clinics/:clinic_id/members/:member_id` | Yes  | Remove clinic member        |
| GET    | `/v1/practices`                             | Yes  | List practices              |

#### POST `/v1/clinics/:id/transfer-owner`

**Request:**

```json
{
  "new_owner_user_id": "new-owner-uuid",
  "reason": "Transferring ownership to new clinic manager"
}
```

#### POST `/v1/clinics/:clinic_id/members`

**Request:**

```json
{
  "user_id": "member-uuid",
  "role": "DENTIST"
}
```

---

### 13. Orthodontists (`ORTHODONTISTS`)

| Method | Endpoint                | Auth | Description                   |
| ------ | ----------------------- | ---- | ----------------------------- |
| GET    | `/v1/orthodontists/:id` | Yes  | Get orthodontist detail       |
| PATCH  | `/v1/orthodontists/:id` | Yes  | Update orthodontist (partial) |
| DELETE | `/v1/orthodontists/:id` | Yes  | Delete orthodontist           |

---

### 14. Orthodontist Assignments (`ORTHODONTIST_ASSIGNMENTS`)

| Method | Endpoint                                      | Auth | Description                 |
| ------ | --------------------------------------------- | ---- | --------------------------- |
| GET    | `/v1/orthodontist-assignments`                | Yes  | List assignments            |
| POST   | `/v1/orthodontist-assignments`                | Yes  | Create assignment           |
| GET    | `/v1/orthodontist-assignments/:id`            | Yes  | Get assignment detail       |
| PATCH  | `/v1/orthodontist-assignments/:id`            | Yes  | Update assignment           |
| DELETE | `/v1/orthodontist-assignments/:id`            | Yes  | Delete assignment           |
| POST   | `/v1/orthodontist-assignments/:id/deactivate` | Yes  | Deactivate assignment       |
| POST   | `/v1/orthodontist-assignments/:id/reactivate` | Yes  | Reactivate assignment       |
| GET    | `/v1/orthodontist-assignments/available`      | Yes  | Get available orthodontists |

#### POST `/v1/orthodontist-assignments`

**Request:**

```json
{
  "orthodontist_id": "orthodontist-uuid",
  "clinic_id": "clinic-uuid"
}
```

#### PATCH `/v1/orthodontist-assignments/:id`

**Request:**

```json
{
  "notes": "Update assignment notes"
}
```

---

### 15. Admin Operations (`ADMIN`)

| Method | Endpoint                             | Auth | Description                         |
| ------ | ------------------------------------ | ---- | ----------------------------------- |
| POST   | `/v1/admin/bulk-assign-orthodontist` | Yes  | Bulk assign orthodontist to clinics |
| POST   | `/v1/admin/bulk-update-clinic-tier`  | Yes  | Bulk update clinic tier levels      |
| POST   | `/v1/admin/bulk-reassign-cases`      | Yes  | Bulk reassign cases                 |
| GET    | `/v1/admin/statistics/overview`      | Yes  | System overview statistics          |
| GET    | `/v1/admin/statistics/clinics`       | Yes  | Clinic statistics                   |
| GET    | `/v1/admin/statistics/orthodontists` | Yes  | Orthodontist statistics             |
| GET    | `/v1/admin/statistics/workload`      | Yes  | Workload distribution               |

#### POST `/v1/admin/bulk-assign-orthodontist`

**Request:**

```json
{
  "clinic_ids": ["clinic-uuid-1", "clinic-uuid-2"],
  "orthodontist_id": "orthodontist-uuid"
}
```

#### POST `/v1/admin/bulk-update-clinic-tier`

**Request:**

```json
{
  "clinic_ids": ["clinic-uuid-1", "clinic-uuid-2"],
  "tier_level": "SILVER"
}
```

#### POST `/v1/admin/bulk-reassign-cases`

**Request:**

```json
{
  "from_orthodontist_id": "old-orthodontist-uuid",
  "to_orthodontist_id": "new-orthodontist-uuid",
  "case_ids": ["case-uuid-1", "case-uuid-2"]
}
```

---

### 16. Reports (`REPORTS`)

| Method | Endpoint                  | Auth | Description         |
| ------ | ------------------------- | ---- | ------------------- |
| GET    | `/v1/reports/cases`       | Yes  | Case reports        |
| GET    | `/v1/reports/leads`       | Yes  | Lead reports        |
| GET    | `/v1/reports/revenue`     | Yes  | Revenue reports     |
| GET    | `/v1/reports/performance` | Yes  | Performance reports |
| GET    | `/v1/reports/patients`    | Yes  | Patient reports     |
| GET    | `/v1/reports/treatments`  | Yes  | Treatment reports   |

---

### 17. Activity Logs (`ACTIVITY_LOGS`)

| Method | Endpoint            | Auth | Description        |
| ------ | ------------------- | ---- | ------------------ |
| GET    | `/v1/activity-logs` | Yes  | List activity logs |

**Query Parameters:** `page`, `limit`, `entity_type`, `user_id`

---

### 18. Notifications (`NOTIFICATIONS`)

| Method | Endpoint                     | Auth | Description                    |
| ------ | ---------------------------- | ---- | ------------------------------ |
| GET    | `/v1/notifications`          | Yes  | List notifications             |
| PATCH  | `/v1/notifications/:id/read` | Yes  | Mark notification as read      |
| PATCH  | `/v1/notifications/read-all` | Yes  | Mark all notifications as read |
| DELETE | `/v1/notifications/:id`      | Yes  | Delete notification            |

**Query Parameters:** `page`, `limit`, `unread_only`

**Notification Types:** `system`, `case_submitted`, `case_under_review`, `case_reviewed`, `case_approved`, `case_in_treatment`, `lead_accepted`, `lead_booked`, `files_uploaded`, `payment_received`

---

### 19. Profile (`PROFILE`)

| Method | Endpoint                      | Auth | Description          |
| ------ | ----------------------------- | ---- | -------------------- |
| GET    | `/v1/profile`                 | Yes  | Get profile          |
| PATCH  | `/v1/profile`                 | Yes  | Update profile       |
| POST   | `/v1/profile/change-password` | Yes  | Change password      |
| POST   | `/v1/profile/upload-photo`    | Yes  | Upload profile photo |

#### POST `/v1/profile/change-password`

**Request:**

```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
```

---

### 20. Settings — Notifications (`SETTINGS.NOTIFICATIONS`)

| Method | Endpoint                     | Auth | Description                  |
| ------ | ---------------------------- | ---- | ---------------------------- |
| GET    | `/v1/settings/notifications` | Yes  | Get notification settings    |
| PATCH  | `/v1/settings/notifications` | Yes  | Update notification settings |

#### PATCH `/v1/settings/notifications`

**Request:**

```json
{
  "case_updates": true,
  "lead_updates": true,
  "message_notifications": true,
  "email_case_updates": false,
  "email_lead_updates": false,
  "email_messages": false,
  "email_weekly_summary": true
}
```

---

### 21. Audit Logs (`AUDIT_LOGS`)

| Method | Endpoint         | Auth | Description                  |
| ------ | ---------------- | ---- | ---------------------------- |
| GET    | `/v1/audit-logs` | Yes  | List audit logs (admin only) |

**Query Parameters:** `page`, `limit`, `entity_type`, `user_id`

---

### 22. Treatment Goal Questions (`TREATMENT_GOAL_QUESTIONS`)

| Method | Endpoint                                 | Auth       | Description      |
| ------ | ---------------------------------------- | ---------- | ---------------- |
| GET    | `/v1/treatment-goal-questions`           | Yes        | List questions   |
| POST   | `/v1/treatment-goal-questions`           | Superadmin | Create question  |
| PATCH  | `/v1/treatment-goal-questions/:id`       | Superadmin | Update question  |
| DELETE | `/v1/treatment-goal-questions/:id`       | Superadmin | Delete question  |
| PATCH  | `/v1/treatment-goal-questions/:id/order` | Superadmin | Reorder question |

**Question Types:** `MULTIPLE_CHOICE`, `text`, `textarea`, `radio`, `checkbox`, `dental_chart`, `number`, `date`

#### POST `/v1/treatment-goal-questions`

**Request:**

```json
{
  "question": "What is your primary smile goal?",
  "question_type": "MULTIPLE_CHOICE",
  "options": ["Straighten teeth", "Close gaps", "Fix overbite"],
  "is_active": true,
  "order": 1
}
```

#### PATCH `/v1/treatment-goal-questions/:id/order`

**Request:**

```json
{
  "order": 5
}
```

---

### 23. Health Check (`HEALTH`)

| Method | Endpoint     | Auth | Description           |
| ------ | ------------ | ---- | --------------------- |
| GET    | `/v1/health` | No   | Health check endpoint |

---

### 24. Files (`FILES`)

| Method | Endpoint                 | Auth | Description              |
| ------ | ------------------------ | ---- | ------------------------ |
| GET    | `/v1/files`              | Yes  | List files               |
| POST   | `/v1/files/upload`       | Yes  | Upload file              |
| GET    | `/v1/files/:id`          | Yes  | Get file by ID           |
| PATCH  | `/v1/files/:id`          | Yes  | Update file metadata     |
| DELETE | `/v1/files/:id/delete`   | Yes  | Delete file              |
| GET    | `/v1/files/:id/download` | Yes  | Download file            |
| GET    | `/v1/files/external`     | Yes  | Get external file by URL |

**Query Parameters for external:** `file_url`, `server`

---

### 25. Doctors / DM API (`DOCTOR`)

| Method | Endpoint                      | Auth | Description            |
| ------ | ----------------------------- | ---- | ---------------------- |
| GET    | `/v1/doctors`                 | Yes  | List doctors           |
| GET    | `/v1/doctors/:id`             | Yes  | Get doctor by ID       |
| GET    | `/v1/doctors/:id/quickstarts` | Yes  | Get doctor quickstarts |

---

### 26. Patient Messages / DM API V2 (`PATIENT_MESSAGES`)

| Method | Endpoint                              | Auth | Description                        |
| ------ | ------------------------------------- | ---- | ---------------------------------- |
| GET    | `/v1/messages/:patient_id`            | Yes  | List messages for patient          |
| POST   | `/v1/messages/:patient_id/to-patient` | Yes  | Send message to patient            |
| POST   | `/v1/messages/:patient_id/to-team`    | Yes  | Send message to team about patient |

#### POST `/v1/messages/:patient_id/to-team`

**Request:**

```json
{
  "message": "Patient case update needed",
  "recipient_ids": ["user-uuid-1", "user-uuid-2"]
}
```

---

### 27. Patient Files / DM API V2 (`PATIENT_FILES`)

| Method | Endpoint                         | Auth | Description             |
| ------ | -------------------------------- | ---- | ----------------------- |
| POST   | `/v1/files/:patient_id/upload`   | Yes  | Upload file for patient |
| GET    | `/v1/files/:patient_id`          | Yes  | List files for patient  |
| DELETE | `/v1/files/:patient_id/:file_id` | Yes  | Delete patient file     |

---

### 28. Medical History Questions (`MEDICAL_HISTORY_QUESTIONS`)

| Method | Endpoint                                  | Auth       | Description      |
| ------ | ----------------------------------------- | ---------- | ---------------- |
| GET    | `/v1/medical-history-questions`           | Yes        | List questions   |
| POST   | `/v1/medical-history-questions`           | Superadmin | Create question  |
| PATCH  | `/v1/medical-history-questions/:id`       | Superadmin | Update question  |
| DELETE | `/v1/medical-history-questions/:id`       | Superadmin | Delete question  |
| PATCH  | `/v1/medical-history-questions/:id/order` | Superadmin | Reorder question |

**Question Types:** `YES_NO`, `text`, `textarea`, `radio`, `checkbox`, `dental_chart`, `number`, `date`

#### POST `/v1/medical-history-questions`

**Request:**

```json
{
  "question": "Do you have any allergies?",
  "question_type": "YES_NO",
  "is_active": true,
  "order": 1
}
```

---

### 29. Dental Insurance (`DENTAL_INSURANCE`)

| Method | Endpoint                                             | Auth | Description                              |
| ------ | ---------------------------------------------------- | ---- | ---------------------------------------- |
| POST   | `/v1/dental-insurance/generate-treatment-summary`    | Yes  | Generate treatment summary for insurance |
| POST   | `/v1/dental-insurance/generate-progress-note`        | Yes  | Generate progress note                   |
| POST   | `/v1/dental-insurance/generate-insurance-summary`    | Yes  | Generate insurance summary (v1)          |
| POST   | `/v2/dental-insurance/generate-insurance-summary`    | Yes  | Generate insurance summary (v2)          |
| GET    | `/v2/dental-insurance/generate-sugestions-ada-codes` | Yes  | Generate ADA code suggestions (AU)       |
| POST   | `/v2/dental-insurance/confirm-sugestions-ada-codes`  | Yes  | Confirm ADA code suggestions (AU)        |

#### POST `/v1/dental-insurance/generate-treatment-summary`

**Request:**

```json
{
  "case_id": "case-uuid"
}
```

#### POST `/v1/dental-insurance/generate-progress-note`

**Request:**

```json
{
  "case_id": "case-uuid"
}
```

#### POST `/v1/dental-insurance/generate-insurance-summary`

**Request:**

```json
{
  "case_id": "case-uuid"
}
```

#### GET `/v2/dental-insurance/generate-sugestions-ada-codes`

**Query Parameters:** `tier`, `arches`, `aligner_count`

#### POST `/v2/dental-insurance/confirm-sugestions-ada-codes`

Confirm ADA code suggestions (request body TBD based on suggestion response).

---

### 30. Invoices / Items (`INVOICES`)

| Method | Endpoint        | Auth | Description         |
| ------ | --------------- | ---- | ------------------- |
| GET    | `/v1/items`     | Yes  | List invoice items  |
| POST   | `/v1/items`     | Yes  | Create invoice item |
| PATCH  | `/v1/items/:id` | Yes  | Update item         |
| DELETE | `/v1/items/:id` | Yes  | Delete item         |

#### GET `/v1/items`

**Query Parameters:** `page`, `limit`

#### POST `/v1/items`

**Request:**

```json
{
  "name": "Aligner Set - Upper",
  "description": "Clear aligners for upper arch",
  "price": 1500
}
```

#### PATCH `/v1/items/:id`

**Request:**

```json
{
  "name": "Updated Item Name",
  "price": 1750
}
```

---

### 31. Blogs / CMS (`BLOGS`)

#### Posts

| Method | Endpoint                          | Auth | Description               |
| ------ | --------------------------------- | ---- | ------------------------- |
| GET    | `/v1/cms/posts`                   | Yes  | List posts                |
| POST   | `/v1/cms/posts`                   | Yes  | Create post               |
| GET    | `/v1/cms/posts/:id`               | Yes  | Get post by ID            |
| PATCH  | `/v1/cms/posts/:id`               | Yes  | Update post               |
| DELETE | `/v1/cms/posts/:id`               | Yes  | Delete post               |
| PATCH  | `/v1/cms/posts/:id/status`        | Yes  | Update post status        |
| PATCH  | `/v1/cms/posts/:id/featured`      | Yes  | Toggle featured status    |
| GET    | `/v1/cms/posts/public/slug/:slug` | No   | Get post by slug (public) |

#### Categories

| Method | Endpoint                               | Auth | Description                   |
| ------ | -------------------------------------- | ---- | ----------------------------- |
| GET    | `/v1/cms/categories`                   | Yes  | List categories               |
| POST   | `/v1/cms/categories`                   | Yes  | Create category               |
| GET    | `/v1/cms/categories/:id`               | Yes  | Get category by ID            |
| PATCH  | `/v1/cms/categories/:id`               | Yes  | Update category               |
| DELETE | `/v1/cms/categories/:id`               | Yes  | Delete category               |
| PATCH  | `/v1/cms/categories/:id/status`        | Yes  | Update category status        |
| GET    | `/v1/cms/categories/public/slug/:slug` | No   | Get category by slug (public) |

#### Ratings

| Method | Endpoint                           | Auth | Description                 |
| ------ | ---------------------------------- | ---- | --------------------------- |
| GET    | `/v1/cms/posts/:post_id/my-rating` | Yes  | Get my rating for post      |
| GET    | `/v1/cms/posts/:post_id/summary`   | No   | Get rating summary (public) |
| POST   | `/v1/cms/posts/:post_id/rating`    | Yes  | Create or update rating     |
| DELETE | `/v1/cms/posts/:post_id/rating`    | Yes  | Delete my rating            |

#### PATCH `/v1/cms/posts/:id/status`

**Request:**

```json
{
  "status": "PUBLISHED"
}
```

#### PATCH `/v1/cms/posts/:id/featured`

**Request:**

```json
{
  "is_featured": true
}
```

#### POST `/v1/cms/categories`

**Request:**

```json
{
  "name": "Treatment Guides",
  "description": "Category for treatment guides",
  "meta_title": "Treatment Guides - Bitesoft",
  "meta_description": "Learn about our treatments",
  "meta_keywords": "treatment, guides, dental",
  "is_active": true
}
```

#### POST `/v1/cms/posts/:post_id/rating`

**Request:**

```json
{
  "rating": 5,
  "comment": "Great post! Very informative."
}
```

**Response (Created):**

```json
{
  "status": true,
  "message": "Rating created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Great post! Very informative.",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z",
    "post_id": "123e4567-e89b-12d3-a456-426614174000",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "full_name": "Dr. Sarah Johnson",
      "first_name": "Sarah",
      "middle_name": null,
      "last_name": "Johnson",
      "photo_url": "https://example.com/photos/sarah.jpg",
      "context_role": "dentist"
    }
  }
}
```

**Error (Only dentists can rate):**

```json
{
  "status": false,
  "message": "Only dentist users can rate posts",
  "data": null
}
```

#### GET `/v1/cms/posts/:post_id/summary`

**Response:**

```json
{
  "status": true,
  "message": "Rating summary retrieved successfully",
  "data": {
    "average_rating": 4.5,
    "total_ratings": 24,
    "rating_distribution": {
      "1": 1,
      "2": 0,
      "3": 3,
      "4": 8,
      "5": 12
    }
  }
}
```

#### GET `/v1/cms/posts/:post_id/my-rating`

**Response (Has rating):**

```json
{
  "status": true,
  "message": "User rating retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Excellent article! Very helpful for my practice.",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z",
    "post_id": "123e4567-e89b-12d3-a456-426614174000",
    "user": {
      "id": "uuid",
      "full_name": "Dr. Sarah Johnson",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "photo_url": "https://...",
      "context_role": "dentist"
    }
  }
}
```

**Response (No rating):**

```json
{
  "status": true,
  "message": "No rating found",
  "data": null
}
```

---

## Endpoints Summary Table (All)

| #         | Module            | Count              | Endpoints                                                                                                                                                                                  |
| --------- | ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Auth              | 7                  | login, register, logout, me, forgot-password, reset-password, confirm-double-login                                                                                                         |
| 2         | Dashboard         | 1                  | stats                                                                                                                                                                                      |
| 3         | Referrals         | 1                  | dashboard                                                                                                                                                                                  |
| 4         | Messages Support  | 1                  | support                                                                                                                                                                                    |
| 5         | Patients          | 16                 | list, create, get, update, delete, getEx, monitoring (4x), events, notifications, engage-files (3x), transfer, scans                                                                       |
| 6         | Treatments        | 5                  | list, create, update, send, delete                                                                                                                                                         |
| 7         | Appointments      | 3                  | list, create, update                                                                                                                                                                       |
| 8         | Leads             | 12                 | list, create, get, update, status, accept, reject, convert-to-case, activities (2x), income-summary, summaries                                                                             |
| 9         | Cases             | 17                 | list, create, get, update, status, tracker-events (2x), files (2x), auto-map, qr-code, quick-create (2x), summaries, invoice, information, email, message, paid, approval, refine, archive |
| 10        | Meetings          | 1                  | create-google-meet                                                                                                                                                                         |
| 11        | Users             | 8                  | list, create, get, update, delete, reset-password, status, bank-account                                                                                                                    |
| 12        | Clinics           | 12                 | list, create, get, update, delete, status, tier, transfer-owner, members (3x), practices                                                                                                   |
| 13        | Orthodontists     | 3                  | get, update, delete                                                                                                                                                                        |
| 14        | Ortho Assignments | 8                  | list, create, get, update, delete, deactivate, reactivate, available                                                                                                                       |
| 15        | Admin             | 7                  | bulk-assign, bulk-tier, bulk-reassign, statistics (4x)                                                                                                                                     |
| 16        | Reports           | 6                  | cases, leads, revenue, performance, patients, treatments                                                                                                                                   |
| 17        | Activity Logs     | 1                  | list                                                                                                                                                                                       |
| 18        | Notifications     | 4                  | list, read, read-all, delete                                                                                                                                                               |
| 19        | Profile           | 4                  | get, update, change-password, upload-photo                                                                                                                                                 |
| 20        | Settings          | 2                  | get notifications, update notifications                                                                                                                                                    |
| 21        | Audit Logs        | 1                  | list                                                                                                                                                                                       |
| 22        | Treatment Goals   | 5                  | list, create, update, delete, reorder                                                                                                                                                      |
| 23        | Health            | 1                  | health check                                                                                                                                                                               |
| 24        | Files             | 7                  | list, upload, get, update, delete, download, external                                                                                                                                      |
| 25        | Doctors           | 3                  | list, get, quickstarts                                                                                                                                                                     |
| 26        | Patient Messages  | 3                  | list, to-patient, to-team                                                                                                                                                                  |
| 27        | Patient Files     | 3                  | upload, list, delete                                                                                                                                                                       |
| 28        | Medical History   | 5                  | list, create, update, delete, reorder                                                                                                                                                      |
| 29        | Dental Insurance  | 6                  | treatment-summary, progress-note, insurance-summary (v1+v2), ada-suggestions, confirm-ada                                                                                                  |
| 30        | Invoices/Items    | 4                  | list, create, update, delete                                                                                                                                                               |
| 31        | Blogs CMS         | 15                 | posts (8x), categories (7x), ratings (4x)                                                                                                                                                  |
| **Total** |                   | **~166 endpoints** |                                                                                                                                                                                            |

---

## HTTP Status Code Mapping

| HTTP | Meaning           | Contoh                                          |
| ---- | ----------------- | ----------------------------------------------- |
| 200  | Success           | Login berhasil, data fetched, update sukses     |
| 201  | Created           | Resource created successfully                   |
| 207  | Multi-Status      | Partial success (file upload)                   |
| 400  | Bad Request       | Missing fields, validation error                |
| 401  | Unauthorized      | Wrong credentials, expired session              |
| 403  | Forbidden         | No permission, password expired, account locked |
| 404  | Not Found         | Resource not found                              |
| 409  | Conflict          | Email already registered / duplicate request    |
| 413  | Payload Too Large | File upload exceeds size limit                  |
| 422  | Unprocessable     | Semantically invalid data                       |
| 429  | Rate Limited      | Too many requests (5/min for login)             |
| 500  | Server Error      | Unexpected error                                |

---

## Notes for Backend Team

1. **Authentication**: JWT-based with `access_token` cookie (HttpOnly, Secure, SameSite=Lax). RBAC via `context_role`.

2. **Consistency between List and Detail**: List endpoints SHOULD return the same field structure as detail endpoints, except for heavy nested collections (activities, timeline, messages).

3. **File Uploads**: Support `multipart/form-data`. Max 50MB per file. Supported: `.stl`, `.jpg`, `.jpeg`, `.png`, `.pdf`. Store in `/uploads/{entity}/{id}/`.

4. **Pagination**: Offset-based with `page` and `limit`. Default 20 items. Include `total_items` or `total` and `totalPages`.

5. **Validation**: Validate all inputs server-side. Return field-specific error messages via `errors` object.

6. **Security**: Rate limiting (100 req/min/user general, 5/min for login). SQL injection prevention. XSS sanitization. bcrypt password hashing (rounds >= 10).

7. **Database**: Soft deletes (`deleted_at`) for users, clinics, cases. Maintain referential integrity. Case number format: `BSC-YYYY-NNNNN`.

8. **Real-time**: Firebase Firestore untuk messaging (message_rooms collection).

9. **Cookie Settings**: `access_token` cookie has configurable Max-Age (default 1 hour for session, longer with `remember: true`).

10. **Versioning**: v1 for stable endpoints, v2 for newer versions (e.g., dental insurance ADA codes, insurance summary v2).

---

## API Version History

### Version 1.1 (Current) — 2025-01-05

- Added Dental Insurance endpoints (ADA AU suggestions)
- Added Scans endpoints (DM API Integration)
- Added Patients external & monitoring endpoints
- Added Treatment Goal & Medical History Questions
- Added confirm-double-login endpoint
- Added Webhooks endpoints
- Deprecated old Messages endpoints (migrated to Firebase)

### Version 1.0 — 2024-11-21

- Initial Release
- Complete CRUD for all entities
- Role-based auth & authorization
- File upload support
- Lead management
- Dashboard statistics
- Activity logging & notification system
