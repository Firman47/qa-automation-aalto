# Aalto Dentist Portal — Website Documentation

**URL:** `https://dental-monitoring.sadigit.co.id`
**Tech:** Nuxt 3 + TypeScript + Nuxt UI + Tailwind CSS + Firebase
**API Base:** `https://dentist-api.sadigit.co.id/v1/`
**Partner DM URL:** `https://partner.dental-monitoring.com`

---

## Table of Contents

1. [Overview](#overview)
2. [Role Definitions](#role-definitions)
3. [Initial Setup (System Configuration)](#3-initial-setup--system-configuration)
4. [Routing Structure](#4-routing-structure)
5. [Layout Components](#5-layout-components)
6. [Page Details](#6-page-details)
7. [End-to-End Case Flow](#7-end-to-end-case-flow)
8. [Leads Lifecycle](#8-leads-lifecycle)
9. [Invoice Flow](#9-invoice-flow)
10. [UI Patterns](#10-ui-patterns)
11. [Firebase Integration](#11-firebase-integration)
12. [Dental Monitoring Integration](#12-dental-monitoring-integration)
    - 12.1 [Case Detail — DM Section](#121-case-detail--dm-section)
    - 12.2 [Monitoring Page](#122-monitoring-page-monitoringcaseid)
    - 12.3 [Monitoring Lifecycle](#123-monitoring-lifecycle)
    - 12.4 [DM Case Verification](#124-dm-case-verification)
    - 12.5 [Monitoring Controls (API)](#125-monitoring-controls-via-api)
    - 12.6 [Engage Files](#126-engage-files)
    - 12.7 [DM Patient ID Format](#127-dm-patient-id-format)
    - 12.8 [Routing Summary](#128-routing-summary)
13. [Manufacturing Flow (Smiley Nova)](#13-manufacturing-flow-smiley-nova)

---

## 1. Overview

Multi-role dental clinic management portal. 1 aplikasi dengan 3 pengalaman berbeda berdasarkan `context_role`:

| Role          | `context_role`   | Description                                                        |
| ------------- | ---------------- | ------------------------------------------------------------------ |
| Doctor        | `dentist`        | Full clinic management, manage patients, cases, leads, & invoices  |
| Orthodontist  | `orthodontist`   | Review cases, create treatment plans, approve/reject 3D plans      |
| Superadmin    | `superadmin`     | System-wide administration, manage clinics, users, leads & invoices |

---

## 2. Role Definitions

### Doctor (Dentist)

**Credentials:**
- Email: `tatang.doctor@gmail.com` / `tatang.admin@gmail.com`
- Password: `Password123!`
- Context Role: `dentist`

**Capabilities:**
- Create and manage patient cases
- Accept leads → booking → convert to case
- Review treatment plans from orthodontist
- Approve/reject treatment plans
- Provide patient consent & medical history
- View AI Summaries (Treatment & Assurance)
- Start/stop/pause patient monitoring (Dental Monitoring)
- Send/receive messages (case threads + support admin)
- Manage personal profile & settings
- Pay invoices

### Orthodontist

**Credentials:**
- Email: `tatang.orthodontist@gmail.com`
- Password: `Password123!`
- Context Role: `orthodontist`

**Capabilities:**
- Review submitted cases from dentists
- Request clarification from dentists
- Create treatment plans
- Approve/reject 3D treatment plans (to Smiley Nova)
- Send treatment plans to dentists
- Send/receive messages (case threads + support admin)
- Manage personal profile & settings

### Superadmin (Admin Bitesoft)

**Credentials:**
- Email: `tatang.admin@gmail.com`
- Password: `Password123!`
- Context Role: `superadmin`

**Capabilities:**
- Create/manage practices (clinics)
- Create/manage users (dentists, orthodontists, admins)
- Assign orthodontists to clinics
- Bulk operations (assign orthodontist, update tier, reassign cases)
- Create leads and assign to dentists
- Create invoices for approved cases ("In Production" status)
- View system statistics & reports
- Manage audit & activity logs

---

## 3. Initial Setup — System Configuration

Setup awal dilakukan oleh **Superadmin** sebelum aplikasi dapat digunakan oleh Dentist dan Orthodontist.

### 3.1 Dental Monitoring Setup

Sebelum menggunakan AALTO, akun **Dental Monitoring** harus dikonfigurasi:

#### 3.1.1 Create Practice (DM)
1. Login ke `https://partner.dental-monitoring.com`
2. Buka menu **Practice**
3. Klik **Create Practice**
4. Isi detail practice & simpan

#### 3.1.2 Create Dentist / Doctor (DM)
1. Buka menu **Dentist / Doctor**
2. Klik **Create Dentist**
3. Assign dentist ke **Practice** yang sudah dibuat
4. Simpan data

#### 3.1.3 Create Protocol / Quickstart (DM)
1. Buka **Detail Dentist**
2. Masuk ke tab **Protocol**
3. Klik **Create Protocol**
4. Pilih tipe **Quickstart**
5. Simpan

### 3.2 AALTO Practice Setup

1. Login AALTO sebagai **Superadmin**
2. Buka menu **Practice** (Settings → Practice)
3. Klik **Create Practice**
4. Isi informasi practice (nama, alamat, telepon, email, practice type)

### 3.3 AALTO Dentist User Setup

1. Login AALTO sebagai **Superadmin**
2. Buka menu **Users**
3. Klik **Create User**
4. Pilih **Role: Admin** (untuk Dentist)
5. Data dentist harus **sama dengan data di Dental Monitoring** (nama, email)
6. Assign ke practice yang sesuai

### 3.4 AALTO Orthodontist Setup

#### 3.4.1 Create Orthodontist User
1. Buka menu **Users**
2. Klik **Create User**
3. Pilih **Role: Orthodontist**

#### 3.4.2 Assign Orthodontist ke Practice
1. Login sebagai **Orthodontist**
2. Buka **Orthodontist Profile** / Assignment section
3. Pilih **Practice** yang sudah dibuat sebelumnya
4. Simpan

---

## 4. Routing Structure

### 4.1 Public Routes (No Auth Required)

| Route                    | Page              | Description                              |
| ------------------------ | ----------------- | ---------------------------------------- |
| `/auth/login`            | Login             | Sign in with email + password            |
| `/auth/register`         | Register          | Multi-step registration (Step 1 & 2)     |
| `/auth/forgot-password`  | Forgot Password   | Request password reset                   |
| `/terms`                 | Terms of Service  | Legal terms                              |
| `/privacy`               | Privacy Policy    | Privacy policy                           |

### 4.2 Protected Routes (Auth Required)

| Route                     | Page                      | Sidebar Label                      | Role Access                          |
| ------------------------- | ------------------------- | ---------------------------------- | ------------------------------------ |
| `/dashboard`              | Dashboard                 | Dashboard                          | All roles                            |
| `/cases`                  | Patient Cases             | Patients                           | All roles                            |
| `/cases/create`           | Create Case               | — (hidden, from button)            | Dentist, Superadmin                  |
| `/cases/:id`              | Case Detail               | — (hidden, from row click)         | All roles                            |
| `/leads`                  | Lead Patients             | Leads → Lead Patients              | Dentist, Superadmin                  |
| `/leads/income`           | Lead Income               | Leads → Lead Income                | Dentist                              |
| `/leads/invoices`         | Invoices                  | Leads → Invoices                   | Dentist, Superadmin                  |
| `/blogs`                  | Blogs (CMS)               | Blogs                              | All roles                            |
| `/users`                  | Users                     | Users                              | Superadmin only                      |
| `/messages`               | Messages — Patients       | Messages → Patients                | All roles (patient messages)         |
| `/messages/support`       | Messages — Support Admin  | Messages → Support Admin           | All roles                            |
| `/settings`               | Settings — General        | Settings → General                 | All roles                            |
| `/settings/bank`          | Bank Account              | Settings → Bank Account            | Dentist                              |
| `/settings/clinic`        | Practice                  | Settings → Practice                | Superadmin, Dentist Admin            |
| `/settings/notifications` | Notification Settings     | Settings → Notifications           | All roles                            |
| `/settings/security`      | Security                  | Settings → Security                | All roles                            |

---

## 5. Layout Components

### 5.1 Sidebar Navigation

Left sidebar with expandable sections, role-based visibility:

| Menu Item          | Icon/Expand | Route         | Visible To                    |
| ------------------ | ----------- | ------------- | ----------------------------- |
| **Aalto Logo**     | —           | `/dashboard`  | All roles                     |
| Dashboard          | Icon        | `/dashboard`  | All roles                     |
| Patients           | Icon        | `/cases`      | All roles                     |
| **Leads** ▼        | Expandable  | —             | Dentist, Superadmin           |
| ├ Lead Patients    | —           | `/leads`      | Dentist, Superadmin           |
| ├ Lead Income      | —           | `/leads/income` | Dentist                     |
| └ Invoices         | —           | `/leads/invoices` | Dentist, Superadmin        |
| Blogs              | Icon        | `/blogs`      | All roles                     |
| Users              | Icon        | `/users`      | Superadmin only               |
| **Messages** ▼     | Expandable  | —             | All roles                     |
| ├ Patients         | —           | `/messages`   | All roles                     |
| └ Support Admin    | —           | `/messages/support` | All roles              |
| **Settings** ▼     | Expandable  | —             | All roles                     |
| ├ General          | —           | `/settings`   | All roles                     |
| ├ Bank Account     | —           | `/settings/bank` | Dentist                    |
| ├ Practice         | —           | `/settings/clinic` | Superadmin, Dentist Admin |
| ├ Notifications    | —           | `/settings/notifications` | All roles          |
| └ Security         | —           | `/settings/security` | All roles              |

**Sidebar Behavior:**
- Collapse/expand toggle button (top bar left side)
- Active state indicator on current route
- Expandable sections open/close on click
- Badge count for unread messages (if applicable)

### 5.2 Top Bar

Right side of top bar berisi:

| Component              | Description                                      |
| ---------------------- | ------------------------------------------------ |
| Notification Bell      | Opens notification panel (F8 keyboard shortcut)  |
| Messages Link          | Link to `/messages` with unread badge            |
| Collapse Sidebar       | Toggle button for sidebar visibility             |
| User Avatar            | Initial letter avatar with dropdown menu:        |
|                        | - View Profile → `/settings`                     |
|                        | - Settings → `/settings`                         |
|                        | - Sign Out → logout action                       |

### 5.3 Notification Panel

- Triggered by bell icon or F8 key
- Lists recent notifications with type icons
- Types: `system`, `case_submitted`, `case_under_review`, `case_reviewed`, `case_approved`, `case_in_treatment`, `lead_accepted`, `lead_booked`, `files_uploaded`, `payment_received`
- Mark as read on click
- "Mark all as read" action

---

## 6. Page Details

### 6.1 Login Page (`/auth/login`)

**Layout:** Split screen — left panel rotating tips, right panel form.

**Left Panel:**
- "DID YOU KNOW?" section with rotating dental statistics
- Feature tags: "Orthodontist Support", "Remote Monitoring", "AI Assisted Workflow"
- Tagline: "The clear aligner operating system for dentists."

**Form Elements:**
| Field            | Type    | Placeholder               | Validation            |
| ---------------- | ------- | ------------------------- | --------------------- |
| Email*           | email   | `your.email@example.com`  | Required, valid email |
| Password*        | password| `••••••••`                | Required, min chars   |

**Controls:**
- Show/Hide password toggle button (icon: eye)
- "SIGN IN" button (uppercase, full width, purple/primary)
- "Forgot password?" link → `/auth/forgot-password`
- "New practice? Create Free Account →" link → `/auth/register`

**Footer:** "Protected by Aalto · 256-bit encryption · HIPAA compliant"

**Behavior:**
| Scenario                    | Result                                            |
| --------------------------- | ------------------------------------------------- |
| Valid credentials           | Redirect to `/dashboard`                          |
| Invalid credentials         | Error toast with API message                      |
| Empty email/password        | Client-side validation message                    |
| Password expired            | 403 response + toast "Reset link sent to email"   |
| Account locked              | 403 response + toast "Try again in 30 minutes"    |
| Double login required       | Email token confirmation required                 |
| Rate limited (429)          | "Too many requests" toast                         |

### 6.2 Register Page (`/auth/register`)

**Layout:** Split screen — same left panel as login, right panel multi-step form.

**Step Progress Indicator:** "Step X of 2" with numbered circles.

#### Step 1 — Personal Information

| Field              | Type       | Placeholder                     | Validation                                      |
| ------------------ | ---------- | ------------------------------- | ----------------------------------------------- |
| First Name*        | text       | `John`                          | Required                                        |
| Last Name*         | text       | `Doe`                           | Required                                        |
| Phone Number*      | tel        | Country code + number           | Required, valid phone format                    |
| Email*             | email      | `your.email@example.com`        | Required, valid email format                    |
| Experience Level*  | combobox   | Select your experience level    | Required                                        |
| Password*          | password   | `Create a password`             | See requirements below                          |
| Confirm Password*  | password   | `Confirm your password`         | Must match password                             |
| Referral Code      | text       | `Enter referral code (optional)`| Optional                                        |

**Password Requirements (live checklist):**
- [ ] Minimum 12 characters
- [ ] At least 1 uppercase letter
- [ ] At least 1 lowercase letter
- [ ] At least 1 number
- [ ] At least 1 special character

**Password Strength Bar:**
- Progress 0-100%
- Color: red → orange → yellow → green

**Checkbox:**
- [ ] I agree to the **Terms of Service** and **Privacy Policy** (required)

**Button:** "Next" — disabled until all validations pass

#### Step 2 — Practice Information

| Field              | Type       | Description                          |
| ------------------ | ---------- | ------------------------------------ |
| Practice Name      | text       | Nama klinik/practice                 |
| Practice Address   | text       | Alamat klinik                        |
| Practice Phone     | tel        | Nomor telepon klinik                 |
| Role in Practice   | text/select| Posisi dalam practice                |

**Button:** "Create Account" — submits registration

**Behavior:**
| Scenario                    | Result                                           |
| --------------------------- | ------------------------------------------------ |
| All valid                   | 201 Created + redirect to login                  |
| Email already registered    | 409 Conflict + error toast "Email is already registered" |
| Invalid password format     | Client-side validation blocks submission         |
| API error (500)             | Error toast with message                         |

### 6.3 Forgot Password Page (`/auth/forgot-password`)

**Form Elements:**
| Field      | Type    | Placeholder                  | Validation            |
| ---------- | ------- | ---------------------------- | --------------------- |
| Email*     | email   | `your.name@example.com`      | Required, valid email |

**Description:** "Enter your email address and we'll send you instructions to reset your password"

**Controls:**
- "Send reset link" button
- "Back to login" link → `/auth/login`

**Behavior:**
| Scenario                    | Result                                 |
| --------------------------- | -------------------------------------- |
| Valid email                 | Success toast + reset link sent to email |
| Invalid email               | Error toast with message               |

### 6.4 Dashboard Page (`/dashboard`)

Data di-load dari `GET /v1/dashboard/stats`. Role-specific content:

#### Dentist Dashboard
- **Greeting:** "Good morning/afternoon/evening, {Full Name} 👋"
- **Subtitle:** "Here's what needs your attention."
- **Overview Section:**
  - "Start a new Submission" card — link to create case (with image)
  - "Appointments" card — shows "No appointments available" (future integrations)
- **Patient Journey Section:**
  - Two tabs: "Show Potential Patients" | "Show Current Patients"
  - Stat cards:
    - New Patient Leads (count)
    - Booked Patient (count)
    - Cases Submitted (count)
    - Design Ready (count)
- **Welcome Modal** (first time only): "Welcome to Aalto!" with "Got it!" dismiss button

#### Orthodontist Dashboard
- Cases assigned: total count
- Pending review: count with link
- In progress: count
- Assigned clinics list
- Workload summary: cases this week / this month
- Recent activities timeline
- Quick stats: cases need review, unread messages, pending approvals

#### Superadmin Dashboard
- System overview: total users, clinics, cases, patients
- Cases by status breakdown (chart)
- User statistics: dentists, orthodontists, admins
- Performance metrics: avg completion time, review time, approval rate
- System health: uptime %, average response time ms

### 6.5 Patients / Cases Page (`/cases`)

**URL:** `/cases`

**Content:**
- **Page Title:** "Patient Cases"
- **Cases Overview** — Donut chart dengan total count + status breakdown:
  - Draft, Pre-treatment, Ready Treatment Plan, Treatment Plan Revision,
    Rejected Treatment Plan, In Production, In Treatment, Completed
- **Search & Filter Bar:**
  - Search input: "Search by name, email, or location..."
  - Status filter dropdown
  - "Archived Cases" toggle button
- **Actions:**
  - "Create New" button → `/cases/create`
- **Data Table Columns:**
  | Column        | Description                            |
  | ------------- | -------------------------------------- |
  | Patient       | Name + avatar/initial                  |
  | Case Type     | e.g., aligner, retainer                |
  | Status        | Badge with color-coded status          |
  | Started On    | Date                                   |
  | Last Updated  | Relative time (e.g., "2 days ago")     |
- **Row Click** → navigate to `/cases/:id` (case detail)
- **Pagination:** 20 per page

### 6.6 Create Case Page (`/cases/create`)

**URL:** `/cases/create`
**Access:** Dentist, Superadmin

Multi-step or single-page form:

#### Section 1 — Basic Information
| Field              | Type       | Description                          |
| ------------------ | ---------- | ------------------------------------ |
| Patient Name       | text       | Search/select existing patient       |
| Practice Type      | select     | national, regional, orthodontic, etc.|
| Case Type          | select     | express, mild, moderate, complex     |
| Assigned Dentist   | select     | Dentist in charge                    |
| Assigned Orthodontist | select  | Orthodontist for review              |

#### Section 2 — Material Diagnostic
| Field              | Type       | Description                          |
| ------------------ | ---------- | ------------------------------------ |
| X-ray Confirmation | checkbox   | Confirm x-ray available              |
| X-ray Date         | date       | Must be within 12 months             |
| Files upload       | file       | STL, photos, x-rays (multipart)      |

#### Section 3 — Treatment Goals
| Field              | Type       | Description                          |
| ------------------ | ---------- | ------------------------------------ |
| Treatment Goals    | textarea   | Free text goals                      |
| Treatment Notes    | textarea   | Additional notes                     |
| Goal Questions     | dynamic    | Answers to treatment goal questions  |

**Button:** "Submit / Save Case"

**Behavior:**
- Success → case created, status = `draft`, auto-create message thread
- Redirect to case detail page

### 6.7 Case Detail Page (`/cases/:id`)

**URL:** `/cases/:id`
**Access:** All roles (action buttons vary by role & status)

**Sections:**

#### Patient Information
- Name, email, phone, DOB, gender
- Emergency contact
- Medical history summary

#### Case Status & Flow
- Current status badge (color-coded)
- Status history / timeline
- Status flow (see [Section 7](#7-end-to-end-case-flow))

#### Treatment Plan
- **Orthodontist Flow:**
  - "View Submission" button
  - Treatment Plan form (for orthodontist)
  - 3D Treatment Detail viewer
  - Approve / Reject buttons
- **Dentist Flow:**
  - Review treatment plan
  - Approve / Reject with feedback
  - Assign dentist button

#### AI Summary Section
Appears when case status >= "Treatment Ready" / "Approved by Dentist":

| Feature                | Description                              |
| ---------------------- | ---------------------------------------- |
| **AI Treatment Summary** | Generate AI-powered treatment summary  |
| **AI Assurance Summary** | Generate AI-powered assurance summary  |
| Actions                | Save to profile, Copy text, Send via email |

#### Files & Documents
- Uploaded files (STL, photos, x-rays)
- File type categories: `stl_upper`, `stl_lower`, `photo_smile`, `photo_no_smile`, `photo_upper`, `photo_lower`, `photo_left`, `photo_right`, `photo_center`, `photo_profile`, `photo_xray`, `xray_image`, `other`

#### Patient Consent
- Status: Not Sent / Sent / Signed
- Actions: Send Consent Form to patient email
- Required before manufacturing

#### Medical History
- Status: Not Sent / Sent / Signed
- Actions: Send Medical History form to patient email
- Required before manufacturing

#### Dental Monitoring
- "Open Monitoring" button (links to DM)
- Status: Not Started / Monitoring / Paused / Stopped
- Actions: Start Monitoring, Pause, Stop

#### Message Thread
- Case-specific message thread
- Chat with assigned orthodontist/dentist

### 6.8 Leads — Lead Patients Page (`/leads`)

**URL:** `/leads`
**Access:** Dentist, Superadmin

#### Summary Cards
| Card              | Description                      |
| ----------------- | -------------------------------- |
| Total Leads       | Total count                      |
| New Leads         | Count with status "new"          |
| Booked Leads      | Count with status "booked"       |
| Cancelled Leads   | Count with status "cancelled"    |
| Total Value       | Sum of treatment values          |
| Total Revenue     | Sum of revenue generated         |
| Booking Rate      | Percentage                        |
| Conversion Rate   | Percentage                        |

#### Lead List
| Column            | Description                      |
| ----------------- | -------------------------------- |
| Patient Name      | Name + contact info              |
| Status            | Color-coded badge                |
| Consultation Date | Scheduled date/time              |
| Treatment Type    | Aligner, retainer, etc.          |
| Treatment Value   | Estimated value                  |
| Actions           | Accept, Book, Complete, etc.     |

**Filters:** Status dropdown, date range

#### Lead Detail (sidebar or separate view)

| Section           | Fields                                         |
| ----------------- | ---------------------------------------------- |
| Basic Information | Name, email, phone, DOB, gender, address       |
| Lead Details      | Status, source, treatment type, value, deposit  |
| Diagnostic        | Clinical notes, smile goals, medical history   |
| Treatment Goals   | Goal answers, notes                            |
| Activities        | Activity log (calls, notes, follow-ups)        |
| Booking           | Scheduled consultation date/time               |

### 6.9 Leads — Lead Income Page (`/leads/income`)

**URL:** `/leads/income`
**Access:** Dentist

- Income statistics chart (12-month view)
- Monthly trends
- Period comparison
- Revenue breakdown

### 6.10 Leads — Invoices Page (`/leads/invoices`)

**URL:** `/leads/invoices`
**Access:** Dentist, Superadmin

- Invoice list per case
- Payment status tracking
- Actions: Pay (Dentist), Create (Superadmin)

**Invoice Status Flow:**
`Pending` → `Paid` / `Overdue`

**Superadmin Actions:**
- Create invoice for cases with status "In Production"
- Case must be approved first

**Dentist Actions:**
- View invoices
- Pay invoice → status changes to "Paid"

### 6.11 Users Page (`/users`)

**URL:** `/users`
**Access:** Superadmin only

**User List Table:**
| Column          | Description                       |
| --------------- | --------------------------------- |
| Name            | Full name with avatar             |
| Email           | Email address                     |
| Role            | Role badge (DENTIST, ORTHODONTIST, ADMIN) |
| Context Role    | dentist, orthodontist, superadmin |
| Clinic          | Assigned clinic name              |
| Status          | Active / Inactive badge           |
| Created         | Date                              |
| Actions         | Edit, Reset Password, Status toggle |

**CRUD Operations:**
- **Create User:** Form with email, password, role, context_role, first/last name, phone, photo, clinic_id, is_active, send_welcome_email
- **Edit User:** Update personal info, role, status
- **Delete User:** Soft delete (deactivated)
- **Reset Password:** Send reset link to email

### 6.12 Messages — Patients Page (`/messages`)

**URL:** `/messages`
**Access:** All roles

**Content:**
- Message list / room list for patient communications
- DM API V2 integration for external patient messaging
- Real-time updates via Firebase Firestore

**Features:**
- View message threads per patient
- Send messages to patient (DM API)
- Send messages to team (internal)
- File attachments (images, documents)

### 6.13 Messages — Support Admin Page (`/messages/support`)

**URL:** `/messages/support`
**Access:** All roles

**Content:**
- Support chat with Superadmin
- Daily reset support rooms (new room each day)
- Send/receive messages

### 6.14 Blogs Page (`/blogs`)

**URL:** `/blogs`
**Access:** All roles

**Content:**
- Blog post list (CMS)
- Categories filter
- Post detail with ratings
- Rating system (1-5 stars, comments)
- Only dentists can rate posts

### 6.15 Settings — General (`/settings`)

**URL:** `/settings`
**Access:** All roles

**Content:**
| Section              | Fields                                         |
| -------------------- | ---------------------------------------------- |
| Profile Photo        | Avatar upload (crop, preview)                  |
| Personal Information | First name, last name, email, phone number     |

**Button:** "Save Changes"

### 6.16 Settings — Bank Account (`/settings/bank`)

**URL:** `/settings/bank`
**Access:** Dentist only

**Fields:**
| Field                | Description                       |
| -------------------- | --------------------------------- |
| Bank Name            | Nama bank                         |
| Bank Routing Number  | Nomor routing                     |
| Bank Account Number  | Nomor rekening                    |
| Bank Account Type    | Checking / Savings                |
| Bank Account Nickname| Label akun                        |
| IBAN                 | International Bank Account Number |
| Swift Code           | SWIFT/BIC code                    |

### 6.17 Settings — Practice (`/settings/clinic`)

**URL:** `/settings/clinic`
**Access:** Superadmin, Dentist Admin

**Fields:**
| Field                | Description                       |
| -------------------- | --------------------------------- |
| Practice Name        | Nama klinik                       |
| Practice Address     | Alamat lengkap                    |
| Apt/Suite            | Nomor unit/suite                  |
| City                 | Kota                              |
| State                | Provinsi/State                    |
| Country              | Negara                            |
| Zip Code             | Kode pos                          |
| Phone Number         | Telepon klinik                    |
| Email                | Email klinik                      |
| Practice Type        | national, regional, orthodontic, special_needs |
| Tier Level           | platinum, gold, silver, bronze    |

### 6.18 Settings — Notifications (`/settings/notifications`)

**URL:** `/settings/notifications`
**Access:** All roles

**Toggles:**
| Setting                    | Type    | Description                        |
| -------------------------- | ------- | ---------------------------------- |
| Case Updates (in-app)      | toggle  | Notifikasi perubahan case          |
| Lead Updates (in-app)      | toggle  | Notifikasi perubahan lead          |
| Message Notifications (in-app) | toggle | Notifikasi pesan baru          |
| Email: Case Updates        | toggle  | Email saat case berubah            |
| Email: Lead Updates        | toggle  | Email saat lead berubah            |
| Email: Messages            | toggle  | Email saat pesan baru              |
| Email: Weekly Summary      | toggle  | Ringkasan mingguan via email       |

**Button:** "Save Changes"

### 6.19 Settings — Security (`/settings/security`)

**URL:** `/settings/security`
**Access:** All roles

**Change Password Form:**
| Field              | Type       | Description                    |
| ------------------ | ---------- | ------------------------------ |
| Current Password   | password   | Password saat ini              |
| New Password       | password   | Password baru (min 12 chars)   |
| Confirm Password   | password   | Ulangi password baru           |

**Button:** "Save Changes"

**Behavior:**
- Success → password changed, can login with new password
- Error → toast with error message

---

## 7. End-to-End Case Flow

### 7.1 Complete Case Lifecycle

```
              ┌─────────────────────────────┐
              │  1. Dentist: Create Case    │
              │  (Basic Info → Diagnostic   │
              │   → Treatment Goals)        │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  2. Case Status: SUBMITTED  │
              │  Auto-create message thread │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  3. Orthodontist: Review    │
              │  ├ Approve (continue)       │
              │  └ Request Clarification    │
              │     → Dentist revises       │
              │     → Back to Ortho         │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  4. Ortho: Treatment Plan   │
              │  ├ Write Treatment Plan     │
              │  ├ Create 3D Plan (Smiley   │
              │  │  Nova integration)       │
              │  └ Send to Dentist          │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  5. Ortho: Approve/Reject   │
              │  3D Plan                    │
              │  ├ Approve → send to Dentist│
              │  └ Reject → feedback to     │
              │     Smiley Nova Team        │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  6. Dentist: Review Plan    │
              │  ├ Approve → Continue       │
              │  └ Reject → feedback to Ortho│
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  7. Patient Consent         │
              │  Send to patient via email: │
              │  ├ Consent Form             │
              │  ├ Treatment Plan           │
              │  └ 3D Treatment View        │
              │  Status: Not Sent → Sent    │
              │  → Signed                   │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  8. Medical History         │
              │  Send form to patient via   │
              │  email                      │
              │  Status: Not Sent → Sent    │
              │  → Signed                   │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  9. AI Summary (optional)   │
              │  ├ AI Treatment Summary     │
              │  └ AI Assurance Summary     │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  10. Manufacturing Flow     │
              │  (Smiley Nova integration)  │
              │  Status: In Production      │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  11. Invoice (Superadmin)   │
              │  Create invoice for case    │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  12. Payment (Dentist)      │
              │  Pay invoice                │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  13. Dental Monitoring      │
              │  Start Monitoring Patient   │
              │  ├ Pause / Resume           │
              │  └ Stop                     │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  14. Case COMPLETED         │
              └─────────────────────────────┘
```

### 7.2 Case Status Definitions

| Status                       | Description                                   | Who Sets It              |
| ---------------------------- | --------------------------------------------- | ------------------------ |
| `Draft`                      | Case baru dibuat, belum dikirim                | Dentist                  |
| `Pre-treatment`              | Dalam persiapan treatment                      | System                   |
| `Ready Treatment Plan`       | Siap untuk dibuatkan treatment plan            | System                   |
| `Treatment Plan Revision`    | Perlu revisi treatment plan                    | Orthodontist / Dentist   |
| `Rejected Treatment Plan`    | Treatment plan ditolak                         | Orthodontist / Dentist   |
| `In Production`              | Dalam produksi (Smiley Nova)                   | System                   |
| `In Treatment`               | Patient sedang dalam treatment                 | System                   |
| `Completed`                  | Case selesai                                   | System                   |

### 7.3 Clarification Flow

```
Dentist submits case
       ↓
Orthodontist reviews
       ↓
Needs clarification? → YES → Ortho sends Request Clarification
       │                          ↓
       │                   Dentist revises case
       │                          ↓
       │                   Dentist resubmits
       │                          ↓
       └────────────────── Ortho reviews again
```

---

## 8. Leads Lifecycle

### 8.1 Complete Lead Flow

```
                ┌──────────────────────────┐
                │ Superadmin: Create Lead  │
                │ ├ Assign to Dentist      │
                │ └ Or leave unassigned    │
                │   (visible to all)       │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │ Dentist: Accept Lead     │
                │ Status → "Accepted"      │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │ Dentist: Booking Time    │
                │ Schedule consultation    │
                │ Status → "Booked"        │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │ Dentist: Complete Task   │
                │ ├ Fill Diagnostic Info   │
                │ ├ Fill Treatment Goals   │
                │ └ Save                   │
                │ Status → "Case Submitted"│
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │ Lead becomes PATIENT /   │
                │ CASE (follow Case Flow)  │
                └──────────────────────────┘
```

### 8.2 Lead Status Definitions

| Status            | Description                                  |
| ----------------- | -------------------------------------------- |
| `New`             | Lead baru, belum di-accept                   |
| `Accepted`        | Dentist sudah accept, belum booking          |
| `Booked`          | Consultation sudah dijadwalkan               |
| `Case Submitted`  | Data lengkap, converted to case              |
| `Cancelled`       | Lead dibatalkan                              |

### 8.3 Lead Creation (Superadmin)

- Buka menu **Leads**
- Klik **Create Lead**
- Isi **Basic Information** (patient name, contact, treatment type)
- **Assign to Dentist:** Pilih dentist tertentu atau kosongkan agar bisa diakses semua dentist
- Simpan

---

## 9. Invoice Flow

### 9.1 Create Invoice (Superadmin)

**Prerequisites:**
- Case status must be **"In Production"**
- Case must have been approved

**Steps:**
1. Login sebagai **Superadmin**
2. Buka menu **Leads → Invoices**
3. Pilih case yang eligible (status "In Production")
4. Klik **Create Invoice**
5. Pilih **Items** (pre-defined: Aligner Set, Retainer, etc.)
6. Set quantity and description
7. Save → Invoice created with status "Pending"

### 9.2 Pay Invoice (Dentist)

1. Login sebagai **Dentist**
2. Buka menu **Leads → Invoices**
3. Lihat daftar invoice (status "Pending")
4. Klik **Pay**
5. Konfirmasi pembayaran
6. Status → "Paid"

---

## 10. UI Patterns

### 10.1 Toast / Notifications

Menggunakan Nuxt UI toast system dengan `data-slot="title"` dan `data-slot="description"`.

| Type      | Color   | Duration  | Example                              |
| --------- | ------- | --------- | ------------------------------------ |
| Success   | Green   | 5s        | "Login successful"                   |
| Error     | Red     | 10s       | "Invalid credentials"                |
| Warning   | Yellow  | 7s        | "Password will expire in 2 days"     |
| Info      | Blue    | 5s        | "New case assigned"                  |

### 10.2 Form Validation

Client-side validation menggunakan browser native + custom validation:
1. **On blur** — per-field validation saat field kehilangan fokus
2. **On submit** — all fields validation sebelum submit
3. **Inline errors** — error message muncul di bawah field

### 10.3 Loading States

| Component           | State                              |
| ------------------- | ---------------------------------- |
| Auth buttons        | Spinner + disabled during API call |
| Data tables         | Skeleton loading rows              |
| Sidebar navigation  | Active state indicator             |
| Page transitions    | Page load spinner (Nuxt)           |
| File uploads        | Progress bar / spinner             |

### 10.4 Error States

| Scenario              | Display                          |
| --------------------- | -------------------------------- |
| API error (4xx/5xx)   | Toast notification               |
| Network error         | Toast "Connection error"         |
| Form field error      | Inline error below field         |
| Empty data            | "No data available" message      |
| 404 page              | Custom not-found page            |

### 10.5 Password Strength

Real-time password strength indicator:

| Strength  | Color  | Bar Width | Requirements Met |
| --------- | ------ | --------- | ---------------- |
| Very Weak | Red    | 0-20%     | 0-1              |
| Weak      | Orange | 21-40%    | 2                |
| Fair      | Yellow | 41-60%    | 3                |
| Strong    | Lime   | 61-80%    | 4                |
| Very Strong| Green | 81-100%   | 5 (all)          |

**Requirements Checklist:**
- [x] Minimum 12 characters
- [x] At least 1 uppercase letter
- [x] At least 1 lowercase letter
- [x] At least 1 number
- [x] At least 1 special character

**Match Confirmation:** Password vs Confirm Password — checkmark when match.

### 10.6 Status Badges

Color-coded status badges digunakan di seluruh aplikasi:

| Status              | Color     |
| ------------------- | --------- |
| Draft               | Gray      |
| Submitted           | Blue      |
| Under Review        | Yellow    |
| Reviewed            | Teal      |
| Approved            | Green     |
| In Treatment        | Purple    |
| Completed           | Dark Green|
| Rejected            | Red       |
| Archived            | Gray      |
| New (Lead)          | Blue      |
| Booked              | Purple    |
| Cancelled           | Red       |
| Paid                | Green     |
| Pending             | Orange    |

### 10.7 File Upload

- Drag & drop zone
- File type restrictions (`.stl`, `.jpg`, `.jpeg`, `.png`, `.pdf`)
- Max file size: 50MB per file, 200MB total per request
- Preview for images
- Progress indicator
- Remove file before submit

---

## 11. Firebase Integration

### 11.1 Authentication
- Firebase Auth untuk login/register
- Custom token generation via backend API (`POST /v1/auth/login`)
- Session management with `access_token` cookie (HttpOnly, Secure, SameSite=Lax)
- Configurable session duration (1 hour default, longer with `remember: true`)

### 11.2 Messaging (Firestore)
- Real-time chat using Firestore collections
- `message_rooms` — chat rooms with participant tracking
- `message_rooms/{room_id}/messages` — individual messages
- Offline support
- File upload via Firebase Storage

#### Room Structure
```json
{
  "id": "room_id",
  "case_id": "case_uuid_or_null",
  "clinic_id": "clinic_uuid_or_null",
  "participant_ids": ["user_id_1", "user_id_2"],
  "participants": {
    "user_id_1": { "id": "uuid", "name": "...", "email": "...", "context_role": "dentist" }
  },
  "unread_count": { "user_id_1": 0, "user_id_2": 5 },
  "last_message": { "content": "...", "sender_id": "...", "created_at": "timestamp" },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Access Control
| Role          | Access                                     |
| ------------- | ------------------------------------------ |
| Superadmin    | All rooms                                  |
| Dentist       | Rooms where participant OR same clinic_id  |
| Orthodontist  | Only rooms where participant               |

### 11.3 Other Firebase Services
- Firebase Storage for file uploads (engage images, profile photos)
- Firebase Cloud Messaging (future push notifications)

---

## 12. Dental Monitoring Integration

### 12.1 Case Detail — DM Section

Pada **Case Detail** page (status "In Treatment"), terdapat section Dental Monitoring yang menampilkan:

- **Open Monitoring** link → URL: `/monitoring/{caseId}`
- **Monitoring status** (Not Started / Monitoring / Paused / Stopped)

**Case Detail card fields (DM-relevant):**
| Field             | Example                           |
| ----------------- | --------------------------------- |
| Case ID (AAL)     | `AAL-20260413-00004`              |
| Status Badge      | `In Treatment`                    |
| Consent Patient   | `Signed` / `Not Sent` / `Sent`    |
| Medical History   | `Signed` / `Not Sent` / `Sent`    |
| Payment Status    | `Approved Payment`                |
| Send To Patient   | Send consent & medical forms      |
| Complete Treatment| Complete treatment button          |

### 12.2 Monitoring Page (`/monitoring/{caseId}`)

Setelah mengklik **Open Monitoring**, user diarahkan ke halaman monitoring dengan layout:

#### 12.2.1 Page Header

- **Breadcrumb:** `Patient` > `{Patient Name}` > `Infos`
- **Patient Identity Card:** Avatar initial + `{First Name} {Last Name}` + `ID: {DM Patient ID}` (format: `XXXX-XXXX-X`)
- Link back to Case Detail page

#### 12.2.2 Monitoring Information Panel (Persistent Sidebar)

Panel ini muncul di semua sub-tab, menampilkan informasi monitoring:

| Field           | Description                                   | Example                         |
| --------------- | --------------------------------------------- | ------------------------------- |
| Plan            | Tipe monitoring plan                          | `3D Monitoring Full`            |
| Started         | Tanggal monitoring dimulai                    | `Apr 15, 2026, 05:08 PM`        |
| Patient App     | Status aktivasi app pasien                    | `Not Activated` / `Activated`   |
| Scan Box        | Scan box identifier                           | `-`                             |
| Next Scan       | Jadwal scan berikutnya                        | `May 15, 2026, 05:08 PM`        |
| Frequency       | Frekuensi scan                                | `Every 4 week(s) and 2 day(s)` |
| Upper/Lower     | Deskripsi upper/lower arch                    | `Orthodontic pre-treatment - No appliance - No appliance` |
| Aligner #       | Nomor aligner saat ini                        | `-`                             |
| Excluded Teeth  | Gigi yang dikecualikan                        | `-`                             |

**Action Buttons (status-dependent):**
| Button  | Action                                     |
| ------- | ------------------------------------------ |
| Start   | Memulai monitoring (jika belum dimulai)    |
| Pause   | Menjeda monitoring                         |
| Stop    | Menghentikan monitoring permanen           |
| Resume  | Melanjutkan monitoring setelah pause       |

#### 12.2.3 Monitoring Sub-Tabs (8 tabs)

Halaman monitoring memiliki 8 navigation tab:

| Tab          | URL Pattern                                     | Description                                   |
| ------------ | ----------------------------------------------- | --------------------------------------------- |
| Monitoring   | `/monitoring/{caseId}/monitoring`               | Main view — scan status & monitoring overview  |
| Protocol     | `/monitoring/{caseId}/protocol`                 | View/edit monitoring protocol settings         |
| Info         | `/monitoring/{caseId}/info`                     | Patient profile details (read-only)            |
| Notes        | `/monitoring/{caseId}/notes`                    | Free-text notes about monitoring               |
| Files        | `/monitoring/{caseId}/files`                    | Upload/manage monitoring-related files         |
| Scans        | `/monitoring/{caseId}/scans`                    | Patient scan history                           |
| History      | `/monitoring/{caseId}/history`                  | Monitoring event timeline                      |
| Agreements   | `/monitoring/{caseId}/agreement`                | DM terms & conditions / consent                |

##### 12.2.3.1 Monitoring Tab (`/monitoring`)

Menampilkan status utama monitoring:
- Jika belum ada scan: **"No Scans Available"** dengan message `"There are no scans available for this patient."`
- Jika ada scan: menampilkan daftar scan pasien

##### 12.2.3.2 Protocol Tab (`/protocol`)

Menampilkan **"Protocol for {Patient Name}"** dengan **Monitoring Information** form yang dapat diedit (Plan type, Frequency, Upper/Lower settings, Excluded Teeth, Scan Box assignment).

##### 12.2.3.3 Info Tab (`/info`)

Menampilkan **Patient Profile** dari DM dengan field berikut:

| Field                    | Example                                  |
| ------------------------ | ---------------------------------------- |
| PATIENT PROFILE ID       | `7225` (numeric)                         |
| FIRST NAME               | `tatang`                                 |
| LAST NAME                | `pasien 15`                              |
| EMAIL                    | `tatang.pasien15@gmail.com`              |
| SECONDARY EMAIL          | `-` (always in CC)                       |
| LANGUAGE                 | `English`                                |
| APP ACTIVATED            | `Not Activated` / `Activated`            |
| MOBILE PHONE             | `+12135550192`                           |
| PRACTICE SOFTWARE ID     | `-`                                      |
| MEDICAL FILE #           | `10668ef2-243d-44bb-918a-897e3a22fe4a` (UUID) |
| DATE OF BIRTH            | `2000-03-13`                             |
| SCAN PROCESS VERSION     | `Scan process V2`                        |
| ADAPTER INSTRUCTION      | `-` (DM App adapter instruction)         |
| HAS LED ADAPTER?         | `Enabled` / `Disabled`                   |
| SCAN SEQUENCE ORDER      | `Not Specified`                          |
| PRACTICE                 | `Tatang Practice`                        |

##### 12.2.3.4 Notes Tab (`/notes`)

- Heading: **"Notes About {Patient Name}"**
- Textarea (disabled when empty): **"No notes available"**
- Notes dapat diedit oleh Dentist

##### 12.2.3.5 Files Tab (`/files`)

- Heading: **"Files"**
- Description: **"Manage and upload files related to this patient."**
- **"Add a File"** button → upload dialog
- Daftar file yang sudah diupload

##### 12.2.3.6 Scans Tab (`/scans`)

Menampilkan riwayat scan pasien:
- Scan images (jika tersedia)
- Scan date & status
- Jika belum ada scan: empty state

##### 12.2.3.7 History Tab (`/history`)

Menampilkan timeline event monitoring:
- Monitoring dimulai
- Scan diambil
- Monitoring dijeda
- Monitoring dilanjutkan

##### 12.2.3.8 Agreements Tab (`/agreement`)

Menampilkan **DM Terms & Conditions** untuk ditandatangani:
- Teks: *"{Patient Name}, to continue using DentalMonitoring services, please read and agree to our latest terms and conditions:"*
- List persyaratan (3+ poin)
- Action untuk agree/accept

### 12.3 Monitoring Lifecycle

```
Case Approved (status: "Approved")
  ↓
Open Monitoring → DM Portal
  ↓
Start Monitoring → status: "Monitoring"
  ├── Pause → status: "Paused" → Resume → status: "Monitoring"
  └── Stop → status: "Stopped" (permanent)
```

**Monitoring Status Values:**
| Status       | Description                              |
| ------------ | ---------------------------------------- |
| Not Started  | Monitoring belum dimulai                 |
| Monitoring   | Monitoring aktif — pasien melakukan scan |
| Paused       | Monitoring dijeda sementara              |
| Stopped      | Monitoring dihentikan permanen           |

**Patient App Status:**
| App Status    | Description                              |
| ------------- | ---------------------------------------- |
| Not Activated | Pasien belum mengaktifkan DM app         |
| Activated     | Pasien sudah aktivasi app dan bisa scan  |

### 12.4 DM Case Verification

Setelah case masuk ke DM, verifikasi data di monitoring tabs:
- **Info tab** — Pastikan data pasien sesuai (nama, email, DOB)
- **Protocol tab** — Pastikan protocol sesuai (Plan, Frequency)
- **Monitoring tab** — Pastikan scan tersedia dan status monitoring aktif
- **Scans tab** — Verifikasi hasil scan (quality, completeness)
- **History tab** — Cek timeline event monitoring

### 12.5 Monitoring Controls (via API)

| Action  | Endpoint                                           |
| ------- | -------------------------------------------------- |
| Start   | `POST /v1/patients/:id/monitoring/start`           |
| Stop    | `POST /v1/patients/:id/monitoring/stop`            |
| Pause   | `POST /v1/patients/:id/monitoring/pause`           |
| Resume  | `POST /v1/patients/:id/monitoring/resume`          |
| Interval| `POST /v1/patients/:id/monitoring/interval`         |

### 12.6 Engage Files

Upload engage images (patient progress photos):
| Image Type | Description                    |
| ---------- | ------------------------------ |
| SMILE      | Front-facing smile photo       |
| LEFT       | Left side profile photo        |
| RIGHT      | Right side profile photo       |

### 12.7 DM Patient ID Format

DM Patient ID format: `XXXX-XXXX-X` (alphanumeric, e.g., `5725-204D-Z`)

### 12.8 Routing Summary

| Page                        | URL Pattern                                     | Access      |
| --------------------------- | ----------------------------------------------- | ----------- |
| Case Detail                 | `/cases/{caseId}`                                | All roles   |
| DM Monitoring               | `/monitoring/{caseId}`                           | Dentist     |
| DM Monitoring (tab)         | `/monitoring/{caseId}/monitoring`                | Dentist     |
| DM Protocol                 | `/monitoring/{caseId}/protocol`                  | Dentist     |
| DM Info                     | `/monitoring/{caseId}/info`                      | Dentist     |
| DM Notes                    | `/monitoring/{caseId}/notes`                     | Dentist     |
| DM Files                    | `/monitoring/{caseId}/files`                     | Dentist     |
| DM Scans                    | `/monitoring/{caseId}/scans`                     | Dentist     |
| DM History                  | `/monitoring/{caseId}/history`                   | Dentist     |
| DM Agreements               | `/monitoring/{caseId}/agreement`                 | Dentist     |

---

## 13. Manufacturing Flow (Smiley Nova)

Setelah Dentist **Approve** treatment plan:

1. Case enters **Manufacturing Flow**
2. **Smiley Nova Team** receives the approved plan
3. 3D printing / aligner manufacturing begins
4. Status updates via webhooks:
   - `POST /v1/webhooks/manufacture/status-update`
   - `POST /v1/webhooks/smileynova`
5. Case status → `In Production`
6. When complete → case delivered to dentist

### Integration Points

| System          | Integration Type     | Description                        |
| --------------- | -------------------- | ---------------------------------- |
| Smiley Nova     | Webhooks + API       | 3D treatment plans, refine cases   |
| Dental Monitoring | API + Firestore    | Patient monitoring, scan data      |
| Calendly (future)| API                | Online booking for consultations   |
| Stripe (future)  | Webhooks            | Payment processing                 |
| GoCardless (future)| Webhooks          | Direct debit payments              |

---

## Appendix: Page Behavior Matrix

### Create Case Button Visibility

| Role          | Visible | Action                                      |
| ------------- | ------- | ------------------------------------------- |
| Dentist       | ✅      | Create new patient case                     |
| Orthodontist  | ❌      | Cannot create cases (review only)           |
| Superadmin    | ✅      | Create case (for testing/setup)             |

### User Menu Visibility

| Menu Item      | Dentist              | Orthodontist         | Superadmin           |
| -------------- | -------------------- | -------------------- | -------------------- |
| Dashboard      | ✅                   | ✅                   | ✅                   |
| Patients       | ✅                   | ✅                   | ✅                   |
| Leads          | ✅                   | ❌                   | ✅                   |
| Blogs          | ✅                   | ✅                   | ✅                   |
| Users          | ❌                   | ❌                   | ✅                   |
| Messages       | ✅                   | ✅                   | ✅                   |
| Settings       | ✅ (all sections)    | ✅ (limited)         | ✅ (all sections)    |

### Settings Sections by Role

| Section        | Dentist              | Orthodontist         | Superadmin           |
| -------------- | -------------------- | -------------------- | -------------------- |
| General        | ✅                   | ✅                   | ✅                   |
| Bank Account   | ✅                   | ❌                   | ❌ (via Users page)  |
| Practice       | ❌ (if user)         | ❌                   | ✅                   |
|                | ✅ (if admin)        |                      |                      |
| Notifications  | ✅                   | ✅                   | ✅                   |
| Security       | ✅                   | ✅                   | ✅                   |

### Case Action Buttons by Status & Role

| Case Status       | Dentist Actions                         | Orthodontist Actions            | Superadmin Actions      |
| ----------------- | --------------------------------------- | ------------------------------- | ----------------------- |
| Draft             | Edit, Submit                            | —                               | —                       |
| Submitted         | —                                       | Review, Request Clarification   | —                       |
| Under Review      | —                                       | Create Treatment Plan           | —                       |
| Need Clarification| Revise & Resubmit                       | —                               | —                       |
| Treatment Ready   | Review, Approve/Reject                  | Approve/Reject 3D Plan          | —                       |
| In Production     | —                                       | —                               | Create Invoice          |
| In Treatment      | Open Monitoring, Pause/Stop Monitoring, Send To Patient, Complete Treatment, View | —                               | —                       |
| Completed         | View                                    | —                               | —                       |
| Rejected          | View Feedback                           | View Feedback                   | —                       |

---

*Last Updated: 2026-06-22*
*Sources: QA-Workflow–Setup-Awal, QA-Workflow–Admin-Bitesoft, QA-Workflow–Dentist-(Admin), QA-Workflow–Dentist-(User), QA-Workflow–Orthodontist*
