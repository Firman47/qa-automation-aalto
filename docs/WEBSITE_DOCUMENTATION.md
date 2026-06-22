# Aalto Dentist Portal — Website Documentation

**URL:** `https://dental-monitoring.sadigit.co.id`
**Tech:** Nuxt 3 + TypeScript + Nuxt UI + Tailwind CSS + Firebase

---

## Overview

Multi-role dental clinic management portal. 1 aplikasi dengan 3 pengalaman berbeda berdasarkan `context_role`:

| Role | context_role | Description |
|------|-------------|-------------|
| Doctor | `dentist` | Full clinic management, assign cases to staff |
| Orthodontist | `orthodontist` | Review cases & create treatment plans |
| Superadmin | `superadmin` | System-wide administration |

---

## Routing Structure

### Public Routes (No Auth Required)

| Route | Page | Description |
|-------|------|-------------|
| `/auth/login` | Login | Sign in with email + password |
| `/auth/register` | Register | Multi-step registration (Personal Info → Practice Info) |
| `/auth/forgot-password` | Forgot Password | Request password reset |
| `/terms` | Terms of Service | Legal terms |
| `/privacy` | Privacy Policy | Privacy policy |

### Protected Routes (Auth Required)

| Route | Page | Sidebar Label |
|-------|------|---------------|
| `/dashboard` | Dashboard | Dashboard |
| `/cases` | Patient Cases | Patients |
| `/cases/create` | Create Case | — |
| `/leads` | Lead Patients | Leads → Lead Patients |
| `/leads/income` | Lead Income | Leads → Lead Income |
| `/leads/invoices` | Invoices | Leads → Invoices |
| `/blogs` | Blogs | Blogs |
| `/users` | Users | Users |
| `/messages` | Messages Patients | Messages → Patients |
| `/messages/support` | Messages Support Admin | Messages → Support Admin |
| `/settings` | Settings General | Settings → General |
| `/settings/bank` | Bank Account | Settings → Bank Account |
| `/settings/clinic` | Practice | Settings → Practice |
| `/settings/notifications` | Notification Settings | Settings → Notifications |
| `/settings/security` | Security | Settings → Security |

---

## Layout Components

### Sidebar

Left sidebar navigation with:
- **Aalto Logo** — links to `/dashboard`
- **Dashboard** — `/dashboard`
- **Patients** — `/cases`
- **Leads** (expandable) — Lead Patients `/leads`, Lead Income `/leads/income`, Invoices `/leads/invoices`
- **Blogs** — `/blogs`
- **Users** — `/users`
- **Messages** (expandable) — Patients `/messages`, Support Admin `/messages/support`
- **Settings** (expandable) — General `/settings`, Bank Account `/settings/bank`, Practice `/settings/clinic`, Notifications `/settings/notifications`, Security `/settings/security`

### Top Bar

Right side of top bar contains:
- Notification bell (opens notification panel with F8 shortcut)
- Messages link → `/messages`
- Theme/menu toggle
- User avatar (initial letter) with dropdown

---

## Page Details

### Login Page (`/auth/login`)

**Layout:** Split screen — left panel has rotating tips, right panel has form.

**Form Elements:**
- Email* input (placeholder: `your.email@example.com`)
- Password* input (placeholder: `••••••••`)
- Show/Hide password toggle button
- "SIGN IN" button (uppercase, full width)
- "Forgot password?" link below password
- "New practice? Create Free Account →" link at top
- Aalto Logo + "PARTNER PORTAL" heading
- "Protected by Aalto · 256-bit encryption · HIPAA compliant" footer

**Left Panel:**
- "DID YOU KNOW?" section with rotating stats
- Feature tags: "Orthodontist Support", "Remote Monitoring", "AI Assisted Workflow"
- Tagline: "The clear aligner operating system for dentists."

**Behavior:**
- Successful login → redirect to `/dashboard`
- Failed login → error toast with API message
- Client-side validation: empty email/password shows validation message

### Register Page (`/auth/register`)

**Layout:** Split screen — same left panel as login, right panel has multi-step form.

**Step 1 — Personal Information:**
- First Name* (placeholder: `John`)
- Last Name* (placeholder: `Doe`)
- Phone Number* (country code + number)
- Email* (placeholder: `your.email@example.com`)
- Experience Level* (combobox: select your experience level)
- Password* (placeholder: `Create a password`)
  - Show/Hide toggle
  - Password strength bar (progress 0-100%)
  - Requirements list (12 chars, number, lowercase, uppercase, special char)
- Confirm Password* (placeholder: `Confirm your password`)
  - Show/Hide toggle
- Referral Code (optional, placeholder: `Enter referral code (optional)`)
- Terms of Service & Privacy Policy checkbox
- "Next" button (disabled until form valid)

**Step 2 — Practice Information:**
- Practice Name
- Practice Address
- Practice Phone
- Role in Practice
- "Create Account" button

**Step Progress:** "Step 0 of 2" with numbered indicators

### Forgot Password Page (`/auth/forgot-password`)

**Layout:** Split screen — same left panel.

**Form Elements:**
- "Forgot password?" heading
- Description: "Enter your email address and we'll send you instructions to reset your password"
- Email* input (placeholder: `your.name@example.com`)
- "Send reset link" button
- "Back to login" link

### Dashboard Page (`/dashboard`)

**Content:**
- Greeting: "Good morning/afternoon/evening, {Full Name} 👋"
- Subtitle: "Here's what needs your attention."
- **Overview** section:
  - "Start a new Submission" card (with image)
  - "Appointments" card (shows "No appointments available")
- **Patient Journey** section:
  - Two tabs: "Show Potential Patients" | "Show Current Patients"
  - Tab content shows stat cards:
    - New Patient Leads (count)
    - Booked Patient (count)
    - Cases Submitted (count)
    - Design Ready (count + patient names)
- **Welcome Modal** (first time only): "Welcome to Aalto!" with "Got it!" dismiss button

### Patients Page (`/cases`)

**Content:**
- **Cases Overview** — Donut chart with total count + status breakdown:
  - Draft, Pre-treatment, Ready Treatment Plan, Treatment Plan Revision, Rejected Treatment Plan, In Production, In Treatment, Completed
- **Patient Cases Management**:
  - Search input: "Search by name, email, or location..."
  - Status filter dropdown
  - "Archived Cases" toggle button
  - "Create New" link → `/cases/create`
  - Table with columns: Patient, Case Type, Started on, Last Updated
  - Row click → case detail page
  - Pagination: Show 20 per page

---

## UI Patterns

### Toast / Notifications

Aalto uses Nuxt UI toast system with `data-slot="title"` and `data-slot="description"` attributes.

### Form Validation

Client-side validation uses browser native validation + custom validation. Validation happens:
1. On blur (per-field)
2. On form submit (all fields)

### Loading States

- Auth operations show spinner on button
- Data tables show skeleton/loading state
- Sidebar navigation shows active state

### Error States

- API errors shown as toast notifications
- Form field errors shown inline below fields
- Network errors shown as toast
