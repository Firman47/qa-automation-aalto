# **QA Workflow – Dentist (Admin)**

Dokumen ini menjelaskan **alur workflow untuk pengetesan QA** pada role **Dentist (Admin)**. Format disusun secara terstruktur dan sistematis agar memudahkan proses testing, validasi fitur, serta pencatatan hasil uji.

---

## **1\. Menu Patient (Cases)**

### **1.1 Create Case**

**Tujuan:**  
Memastikan Dentist (Admin) dapat membuat case baru dan meneruskannya ke alur orthodontist.

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Klik tombol **Create Patient**  
3. Isi **Basic Information**  
4. Isi **Material Diagnostic**  
5. Isi **Treatment Goals**  
6. Klik **Submit / Save Case**

**Hasil yang Diharapkan:**

* Case berhasil dibuat  
* Status case berpindah ke **Orthodontist Flow / Review**  
* Sistem otomatis membuat **message thread** untuk case tersebut  
  ---

  ### **1.2 Detail Case (View & Update)**

**Tujuan:**  
Memastikan Dentist (Admin) dapat melihat dan memperbarui data case selama case masih dapat diedit.

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Pilih case yang sudah dibuat  
3. Klik **View Submission**  
4. Lakukan edit atau update data  
5. Klik **Save**

**Hasil yang Diharapkan:**

* Perubahan data berhasil disimpan  
* Data terbaru langsung ditampilkan pada detail case  
  ---

  ### **1.3 Approve / Reject Treatment Plan**

**Tujuan:**  
Memastikan Dentist (Admin) dapat melakukan review, approval, dan assignment treatment plan.

**Langkah Pengujian:**

1. Buka **detail case**  
2. Review **Treatment Plan**  
3. Review **3D Treatment Detail**  
4. Tentukan keputusan:  
   * **Reject:** isi feedback lalu submit  
   * **Approve:** konfirmasi persetujuan treatment plan dan **assign dentist**

**Hasil yang Diharapkan:**

* Jika **Reject**:  
  * Feedback terkirim ke orthodontist  
  * Status case diperbarui sesuai flow  
* Jika **Approve**:  
  * Dentist berhasil di-assign  
  * Case lanjut ke **Manufacturing Flow**

  ---

  ## **2\. Menu Leads**

  ### **2.1 Accept Leads**

**Tujuan:**  
Memastikan Dentist (Admin) dapat menerima patient leads.

**Langkah Pengujian:**

1. Buka menu **Leads**  
2. Pilih detail patient lead  
3. Klik **Accept Lead**

**Hasil yang Diharapkan:**

* Status lead berubah menjadi **Accepted**  
  ---

  ### **2.2 Booking Leads**

**Tujuan:**  
Memastikan Dentist (Admin) dapat membuat jadwal booking untuk lead.

**Langkah Pengujian:**

1. Buka detail patient lead  
2. Buat **Booking Time**  
3. Simpan jadwal

**Hasil yang Diharapkan:**

* Booking time tersimpan dengan benar  
* Jadwal dapat dilihat kembali di detail lead  
  ---

  ### **2.3 Complete Task Leads**

**Tujuan:**  
Memastikan Dentist (Admin) dapat melengkapi data lead hingga menjadi case.

**Langkah Pengujian:**

1. Buka detail patient lead  
2. Isi informasi **Diagnostic**  
3. Isi **Treatment Goals**  
4. Simpan data

**Hasil yang Diharapkan:**

* Data diagnostic dan treatment goals tersimpan  
* Status lead diperbarui sesuai proses bisnis  
* Lead resmi berubah menjadi **patient/case**  
  ---

  ## **3\. Menu Message**

  ### **3.1 Message (Cases)**

**Tujuan:**  
Memastikan message otomatis dibuat saat case baru dibuat.

**Langkah Pengujian:**

1. Buat case baru  
2. Buka menu **Message**  
3. Pilih case terkait

**Hasil yang Diharapkan:**

* Message thread untuk case tersedia secara otomatis  
  ---

  ### **3.2 Message (Admin)**

**Tujuan:**  
Memastikan Dentist (Admin) dapat mengirim pesan ke admin Bitesoft.

**Langkah Pengujian:**

1. Buka menu **Message (Admin)**  
2. Tulis pesan  
3. Kirim pesan

**Hasil yang Diharapkan:**

* Pesan berhasil terkirim ke admin Bitesoft  
  ---

  ## **4\. Menu Settings**

  ### **4.1 Settings – General**

**Tujuan:**  
Memastikan Dentist (Admin) dapat memperbarui data profil dan klinik.

**Langkah Pengujian:**

1. Buka menu **Settings \> General**  
2. Update foto profil  
3. Update personal information  
4. Update informasi klinik (jika tersedia)  
5. Klik **Save Changes**

**Hasil yang Diharapkan:**

* Data profil dan klinik berhasil diperbarui  
  ---

  ### **4.2 Settings – Notification**

**Tujuan:**  
Memastikan pengaturan notifikasi berfungsi dengan benar.

**Langkah Pengujian:**

1. Buka **Settings \> Notification**  
2. Toggle **enable / disable** notifikasi  
3. Simpan pengaturan

**Hasil yang Diharapkan:**

* Status notifikasi berubah sesuai pengaturan  
  ---

  ### **4.3 Settings – Security**

**Tujuan:**  
Memastikan Dentist (Admin) dapat mengubah password akun.

**Langkah Pengujian:**

1. Buka **Settings \> Security**  
2. Masukkan password lama  
3. Masukkan password baru  
4. Simpan perubahan

**Hasil yang Diharapkan:**

* Password berhasil diperbarui  
* User dapat login menggunakan password baru


