# Setup Awal — QA Workflow

> **Dokumen ini mencakup:** Seluruh konfigurasi awal yang harus dilakukan sebelum aplikasi AALTO dapat digunakan.
> **Referensi:** `docs/WEBSITE_DOCUMENTATION.md` §3 (Initial Setup), `docs/API_DOCUMENTATION.md`

---

## Daftar Isi

1. [Dental Monitoring – Setup Awal](#1-dental-monitoring--setup-awal)
2. [Dental Monitoring – Protocol Setup](#2-dental-monitoring--protocol-setup)
3. [AALTO – Practice Management (CRUD)](#3-aalto--practice-management-crud)
4. [AALTO – Dentist Management (CRUD)](#4-aalto--dentist-management-crud)
5. [AALTO – Orthodontist Management (CRUD)](#5-aalto--orthodontist-management-crud)
6. [Case Flow – Dentist → Orthodontist → Dentist](#6-case-flow--dentist--orthodontist--dentist)
7. [Dental Monitoring – Case Validation](#7-dental-monitoring--case-validation)
8. [AI Summary (AALTO)](#8-ai-summary-aalto)
9. [Leads Flow](#9-leads-flow)
10. [Invoice Flow](#10-invoice-flow)

---

## Prerequisites

Sebelum memulai setup, pastikan memiliki akses ke:

| Platform            | URL                                       | Kredensial |
| ------------------- | ----------------------------------------- | ---------- |
| **Dental Monitoring** | `https://partner.dental-monitoring.com` | Lihat di bawah |
| **AALTO Portal**     | `https://dental-monitoring.sadigit.co.id` | Lihat credentials role |
| **Discord**          | —                                         | Kontak: A / Eko / Ikhsan |

---

## 1. Dental Monitoring — Setup Awal

> **URL:** `https://partner.dental-monitoring.com`
>
> **Credentials DM:**
> - Email: `e5be48b6-c784-461c-8910-71eb66130ba2@dentalmonitoring.com`
> - Password: `ab06683134:3bf4ffffb01cde186_c14`

Sebelum menggunakan AALTO, akun **Dental Monitoring** harus dikonfigurasi terlebih dahulu.

### 1.1 Login ke Dental Monitoring

1. Buka `https://partner.dental-monitoring.com`
2. Masukkan email DM: `e5be48b6-c784-461c-8910-71eb66130ba2@dentalmonitoring.com`
3. Masukkan password: `ab06683134:3bf4ffffb01cde186_c14`
4. Klik **Sign In**

### 1.2 Create Practice (DM)

1. Login ke Dental Monitoring (langkah 1.1)
2. Buka menu **Practice** di sidebar
3. Klik **Create Practice**
4. Isi detail practice:
   - **Practice Name:** Nama klinik (contoh: "Smile Dental Clinic Jakarta")
   - **Address:** Alamat lengkap
   - **Phone:** Nomor telepon
   - **Email:** Email klinik
5. Klik **Save / Create**

### 1.3 Create Dentist / Doctor (DM)

1. Buka menu **Dentist / Doctor**
2. Klik **Create Dentist**
3. Isi data dentist:
   - **First Name:** Nama depan (contoh: "Tatang")
   - **Last Name:** Nama belakang (contoh: "Doctor")
   - **Email:** `tatang.doctor@gmail.com`
   - **Phone:** Nomor telepon
4. **Assign** dentist ke **Practice** yang sudah dibuat (dari langkah 1.2)
5. Klik **Save**
6. Verifikasi dentist muncul di daftar

> **⚠️ Penting:** Data dentist di DM harus **sama persis** dengan data yang akan dibuat di AALTO (nama, email). Ketidaksesuaian data akan menyebabkan error saat integrasi.

---

## 2. Dental Monitoring — Protocol Setup

### 2.1 Create Protocol (Quickstart)

1. Buka daftar **Dentist / Doctor**
2. Klik nama **Dentist** yang sudah dibuat → masuk ke **Detail Dentist**
3. Masuk ke tab **Protocol**
4. Klik **Create Protocol**
5. Pilih tipe **Quickstart**
6. Isi detail protocol (jika ada):
   - **Protocol Name:** Nama protocol (contoh: "Standard Aligner Protocol")
   - **Duration:** Durasi monitoring
   - **Frequency:** Frekuensi scan
7. Klik **Save**

### 2.2 Manage Protocol (Optional — Edit/Create Additional)

1. Buka daftar **Doctor** di DM
2. Pilih doctor yang sudah dibuat
3. Klik **Manage Protocol**
4. Dari sini bisa:
   - **Buat protocol baru** — Create → pilih Quickstart → isi detail → Save
   - **Edit protocol yang sudah ada** — klik nama protocol → edit → Save
5. Setelah protocol aktif, **pastikan Quickstart type sudah terpilih dan tersimpan**

> **Catatan:** Protocol Quickstart diperlukan agar pasien bisa langsung memulai monitoring tanpa perlu konfigurasi tambahan.

---

## 3. AALTO — Practice Management (CRUD)

### 3.1 Login AALTO sebagai Superadmin

**Credentials Superadmin:**
| Role | Email | Password |
|------|-------|----------|
| Superadmin (utama) | `ikhsan@sadigit.com` | `Password123!` |
| Superadmin (test) | `tatang.admin@gmail.com` | `Password123!` |

1. Buka `https://dental-monitoring.sadigit.co.id/auth/login`
2. Login dengan email superadmin
3. Setelah login, verifikasi sidebar menampilkan menu **Users** (superadmin only)

### 3.2 Create Practice

1. Buka menu **Settings → Practice** (di sidebar, di bawah **Settings**)
   - Atau langsung ke `/settings/clinic`
2. Klik **Create Practice**
3. Isi informasi practice:

| Field              | Contoh                          | Keterangan                     |
| ------------------ | ------------------------------- | ------------------------------ |
| Practice Name      | `Smile Dental Clinic Jakarta`   | Nama klinik                    |
| Practice Address   | `Jl. Sudirman No. 123`          | Alamat lengkap                 |
| Apt/Suite          | `Suite 501`                     | Opsional                       |
| City               | `Jakarta`                       | Kota                           |
| State              | `DKI Jakarta`                   | Provinsi                       |
| Country            | `Indonesia`                     | Negara                         |
| Zip Code           | `12190`                         | Kode pos                       |
| Phone Number       | `+622123456789`                 | Telepon klinik                 |
| Email              | `info@smilejakarta.com`         | Email klinik                   |
| Practice Type      | `national` / `regional` / `orthodontic` / `special_needs` | Tipe practice |
| Tier Level         | `platinum` / `gold` / `silver` / `bronze` | Level tier         |

4. Klik **Save**
5. Verifikasi practice muncul di daftar

---

## 4. AALTO — Dentist Management (CRUD)

### 4.1 Create Dentist User

1. Login sebagai **Superadmin** di AALTO
2. Buka menu **Users** di sidebar
3. Klik **Create User**
4. Isi data user:

| Field              | Contoh                          | Keterangan                        |
| ------------------ | ------------------------------- | --------------------------------- |
| Email              | `tatang.doctor@gmail.com`       | **WAJIB sama dengan DM**          |
| Password           | `Password123!`                  | Min 12 karakter                   |
| Role               | `Admin`                         | Role untuk Dentist adalah **Admin** |
| Context Role       | `dentist`                       | Context role: dentist             |
| First Name         | `Tatang`                        | **WAJIB sama dengan DM**          |
| Last Name          | `Doctor`                        | **WAJIB sama dengan DM**          |
| Phone Number       | `+628111222333`                 | Nomor telepon                     |
| Clinic             | Pilih practice yang sudah dibuat | Assign ke practice               |
| is_active          | ✅ Centang                       | Aktif                             |
| send_welcome_email | Opsional                        | Kirim email selamat datang        |

> **⚠️ Kritikal:** Data dentist (nama, email) harus **sama persis** dengan data yang sudah dibuat di Dental Monitoring (langkah 1.3). Jika berbeda, integrasi DM-AALTO tidak akan berfungsi.

5. Klik **Save**
6. Verifikasi user muncul di daftar dengan role **Admin** dan context role **dentist**

### 4.2 Create Additional Admin User

1. Buka menu **Users**
2. Klik **Create User**
3. Isi dengan data yang sama pattern-nya:
   - Role: **Admin**
   - Context Role: **dentist**
   - Email berbeda (contoh: untuk admin operasional)
4. Assign ke practice yang sama
5. Klik **Save**

---

## 5. AALTO — Orthodontist Management (CRUD)

### 5.1 Create Orthodontist User

1. Login sebagai **Superadmin** di AALTO
2. Buka menu **Users**
3. Klik **Create User**
4. Isi data orthodontist:

| Field              | Contoh                                | Keterangan            |
| ------------------ | ------------------------------------- | --------------------- |
| Email              | `tatang.orthodontist@gmail.com`       | Email orthodontist    |
| Password           | `Password123!`                        | Min 12 karakter       |
| Role               | `Orthodontist`                        | Role = Orthodontist   |
| Context Role       | `orthodontist`                        | Context role          |
| First Name         | `Tatang`                              |                       |
| Last Name          | `Orthodontist`                        |                       |
| is_active          | ✅ Centang                             | Aktif                 |

5. Klik **Save**

### 5.2 Assign Orthodontist ke Practice

1. **Logout** dari akun superadmin
2. **Login** sebagai **Orthodontist** yang baru dibuat:
   - Email: `tatang.orthodontist@gmail.com`
   - Password: `Password123!`
3. Buka **Settings** atau menu profile orthodontist
4. Cari bagian **Practice Assignment** atau **Clinic Assignment**
5. Pilih **Practice** yang sudah dibuat sebelumnya (dari langkah 3.2) dari daftar yang tersedia
6. Klik **Save / Assign**
7. Verifikasi: orthodontist sekarang terhubung dengan practice dan bisa melihat case dari practice tersebut

> **⚠️ Catatan:** Orthodontist **hanya** bisa melihat dan mereview case dari practice yang sudah di-assign. Jika belum di-assign ke practice, orthodontist tidak akan melihat case apapun.

---

## 6. Case Flow — Dentist → Orthodontist → Dentist

### 6.1 Flow Diagram

```
Dentist: Create Case (Basic Info → Diagnostic → Treatment Goals)
        ↓
Case Status: SUBMITTED (auto-create message thread)
        ↓
Orthodontist: Review Case
  ├ Approve → Continue to Treatment Plan
  └ Request Clarification → Dentist revises → Back to Ortho
        ↓
Orthodontist: Create Treatment Plan
  ├ Write Treatment Plan
  ├ Request 3D via Discord (koordinasi dengan Smiley Nova Team)
  │  (Kontak: A / Eko / Ikhsan via Discord)
  ├ Create 3D Plan (Smiley Nova integration)
  └ Send to Dentist
        ↓
Orthodontist: Approve/Reject 3D Plan
  ├ Approve → send to Dentist
  └ Reject → feedback to Smiley Nova Team
        ↓
Dentist: Review Plan
  ├ Approve → Continue
  └ Reject → feedback to Ortho
        ↓
Patient Consent (Send via email)
  ├ Consent Form
  ├ Treatment Plan
  └ 3D Treatment View
  Status: Not Sent → Sent → Signed
        ↓
Medical History (Send via email)
  Status: Not Sent → Sent → Signed
        ↓
AI Summary (optional, status ≥ "Treatment Ready")
        ↓
Manufacturing Flow (Smiley Nova integration) — Status: In Production
        ↓
Invoice (Superadmin)
        ↓
Payment (Dentist)
        ↓
Dental Monitoring — Start/Stop/Pause
        ↓
Case COMPLETED
```

### 6.2 Detailed Steps

#### 6.2.1 Create Case (Dentist)

1. Login sebagai **Dentist** (`tatang.doctor@gmail.com`)
2. Buka menu **Patients** (sidebar)
3. Klik **Create New** → `/cases/create`
4. Isi **Basic Information**:
   - **Patient Name:** Cari/select existing patient atau create baru
   - **Practice Type:** Pilih tipe (national/regional/orthodontic)
   - **Case Type:** Pilih tipe (express/mild/moderate/complex)
   - **Assigned Dentist:** Pilih dentist
   - **Assigned Orthodontist:** Pilih orthodontist
5. Isi **Material Diagnostic**:
   - **X-ray Confirmation:** Centang jika ada
   - **X-ray Date:** Pilih tanggal (max 12 bulan)
   - **Files Upload:** Upload STL, photos, x-rays
6. Isi **Treatment Goals**:
   - **Treatment Goals:** Free text
   - **Treatment Notes:** Additional notes
7. Klik **Submit / Save Case**
8. Case terbuat dengan status **Draft**
9. **Auto-create message thread** — sistem otomatis membuat message room dengan participant: dentist + assigned orthodontist

#### 6.2.2 Orthodontist Flow

1. Login sebagai **Orthodontist** (`tatang.orthodontist@gmail.com`)
2. Buka menu **Patients** → cari case yang masuk
3. **Review Case**:
   - Klik **View Submission**
   - Review data dan file yang diupload
4. **Create Treatment Plan**:
   - **Write Treatment Plan:** Isi rencana perawatan
   - **Request 3D via Discord:** Koordinasi dengan Smiley Nova Team (kontak: A / Eko / Ikhsan)
   - Setelah 3D selesai, review 3D plan
5. **Send Treatment ke Dentist**

#### 6.2.3 Dentist Approval Flow

1. Login kembali sebagai **Dentist**
2. Buka case detail
3. **Review Treatment Plan** dari orthodontist
4. Isi **Patient Consent**:
   - Send consent form ke email patient
   - Tunggu patient sign
   - Status: Not Sent → Sent → Signed
5. Isi **Medical History**:
   - Send form ke patient via email
   - Status: Not Sent → Sent → Signed
6. **Approve atau Reject** treatment plan
   - Jika **Approve** → case lanjut ke **Manufacture Dashboard**
   - Jika **Reject** → feedback ke Orthodontist

### 6.3 Case Status Definitions

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

---

## 7. Dental Monitoring — Case Validation

Setelah case mencapai status **In Treatment**, lakukan validasi di Dental Monitoring:

1. Buka `https://partner.dental-monitoring.com`
2. Login dengan credentials DM
3. Cari **Case** berdasarkan nama pasien
4. Verifikasi data case di Dental Monitoring:
   - **Scan tab** — pastikan scan tersedia dan lengkap
   - **Monitoring tab** — pastikan monitoring berjalan
   - **Timeline tab** — cek history monitoring
   - **Alerts tab** — cek apakah ada alert

**Yang perlu dicek:**
- Apakah DM case sudah terisi dengan benar?
- Apakah scan tersedia dan bisa diakses?
- Apakah monitoring aktif?
- Apakah tidak ada error/alert yang mengganggu?

---

## 8. AI Summary (AALTO)

**Prerequisites:**
- Case status minimal **"Treatment Ready"** atau **"Approved by Dentist"**

**Steps:**
1. Login sebagai **Dentist**
2. Buka **Case Detail** yang eligible
3. Scroll ke **AI Summary Section**
4. Klik **Ask AALTO AI**
5. Generate:
   - **AI Treatment Summary** — Generate + review
   - **AI Assurance Summary** — Generate + review
6. Jika perlu, klik **Regenerate**
7. Actions setelah generate:
   - **Save to profile**
   - **Copy text**
   - **Send via email**

---

## 9. Leads Flow

### 9.1 Complete Lead Flow

```
Superadmin: Create Lead
  ├ Assign to Dentist
  └ Or leave unassigned (visible to all dentists)
        ↓
Dentist: Accept Lead → Status "Accepted"
        ↓
Dentist: Booking Time → Schedule consultation → Status "Booked"
        ↓
Dentist: Complete Task
  ├ Fill Diagnostic Info
  ├ Fill Treatment Goals
  └ Save → Status "Case Submitted"
        ↓
Lead becomes PATIENT / CASE (follow Case Flow §6)
```

### 9.2 Lead Status Definitions

| Status            | Description                                  |
| ----------------- | -------------------------------------------- |
| `New`             | Lead baru, belum di-accept                   |
| `Accepted`        | Dentist sudah accept, belum booking          |
| `Booked`          | Consultation sudah dijadwalkan               |
| `Case Submitted`  | Data lengkap, converted to case              |
| `Cancelled`       | Lead dibatalkan                              |

### 9.3 Create Leads (Superadmin)

1. Login sebagai **Superadmin** (`tatang.admin@gmail.com`)
2. Buka menu **Leads → Lead Patients**
3. Klik **Create Lead**
4. Isi **Basic Information**:
   - Patient name, contact, treatment type
5. **Assign to Dentist**:
   - Pilih dentist tertentu, ATAU
   - Kosongkan agar bisa diakses **semua dentist**
6. **Practice Assignment**:
   - Jika **Practice kosong (tidak dipilih)** → lead tampil ke **semua dentist** di semua practice
   - Jika **Practice dipilih** → lead hanya tampil ke **dentist dalam practice tersebut**
7. Klik **Save**

### 9.4 Dentist Lead Handling

1. Login sebagai **Dentist** (`tatang.doctor@gmail.com`)
2. Buka menu **Leads → Lead Patients**
3. **Accept Lead** → klik Accept → status berubah "Accepted"
4. **Booking Time** → jadwalkan consultation → status "Booked"
5. **Isi Data Lead**:
   - **Diagnostic:** Clinical notes, smile goals, medical history
   - **Treatment Goals:** Goal answers, treatment notes
6. **Save** → status berubah "Case Submitted"
7. Lead **otomatis menjadi Patient / Case**
8. Flow selanjutnya mengikuti **Case Flow** standar (section 6)

> **⚠️ Catatan:** Proses ini adalah konversi satu arah — setelah lead menjadi case, data tidak bisa kembali ke status lead.

---

## 10. Invoice Flow

### 10.1 Create Invoice (Superadmin)

**Prerequisites:**
- Case status harus **"In Production"**
- Case harus sudah di-approve

**Steps:**
1. Login sebagai **Superadmin** (`tatang.admin@gmail.com`)
2. Buka menu **Leads → Invoices** atau `/leads/invoices`
3. Cari case yang eligible (status "In Production")
4. Klik **Create Invoice** pada case tersebut
5. Pilih **Invoice Items**:
   - Pre-defined items: Aligner Set, Retainer, dll
   - Atau create item baru
6. Set **Quantity** dan **Description**
7. Klik **Save**
8. Invoice terbuat dengan status **"Pending"**

### 10.2 Payment (Dentist)

1. Login sebagai **Dentist** (`tatang.doctor@gmail.com`)
2. Buka menu **Leads → Invoices**
3. Lihat daftar invoice dengan status **"Pending"**
4. Klik **Pay**
5. Konfirmasi pembayaran
6. Status invoice berubah menjadi **"Paid"**

### 10.3 Invoice Status Flow

```
Pending → Paid / Overdue
```

- **Pending** — Menunggu pembayaran dari Dentist
- **Paid** — Sudah dibayar
- **Overdue** — Melewati jatuh tempo

---

## Lampiran: Credentials Reference

### Dental Monitoring
| Item | Value |
|------|-------|
| URL | `https://partner.dental-monitoring.com` |
| Email | `e5be48b6-c784-461c-8910-71eb66130ba2@dentalmonitoring.com` |
| Password | `ab06683134:3bf4ffffb01cde186_c14` |

### AALTO Portal
| Role | Email | Password |
|------|-------|----------|
| Superadmin (utama) | `ikhsan@sadigit.com` | `Password123!` |
| Superadmin (test) | `tatang.admin@gmail.com` | `Password123!` |
| Doctor | `tatang.doctor@gmail.com` | `Password123!` |
| Orthodontist | `tatang.orthodontist@gmail.com` | `Password123!` |

### Discord
| Kontak | Platform |
|--------|----------|
| A | Discord (Smiley Nova Team) |
| Eko | Discord (Smiley Nova Team) |
| Ikhsan | Discord (Smiley Nova Team) |

---

> **Dokumen ini sinkron dengan:** `docs/WEBSITE_DOCUMENTATION.md` (terutama §3 Initial Setup, §7 Case Flow, §8 Leads, §9 Invoice)
