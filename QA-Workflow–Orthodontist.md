# **QA Workflow – Orthodontist**

Dokumen ini menjelaskan **alur workflow untuk pengetesan QA** pada role **Orthodontist**. Format disusun secara terstruktur dan sistematis agar memudahkan proses testing, validasi fitur, serta pencatatan hasil uji.

---

## **1\. Menu Patient (Cases)**

### **1.1 Review Case (Request Clarification)**

**Tujuan:**  
Memastikan Orthodontist dapat mereview case dan mengajukan permintaan klarifikasi kepada dentist jika diperlukan.

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Pilih salah satu **case detail**  
3. Review data case secara keseluruhan  
4. Tentukan apakah diperlukan klarifikasi dari dentist  
5. Ajukan **Request Clarification**  
6. Submit permintaan klarifikasi

**Hasil yang Diharapkan:**

* Permintaan klarifikasi berhasil dikirim ke dentist  
* Status case berubah sesuai flow klarifikasi  
* Notifikasi/message terkirim ke dentist terkait  
  ---

  ### **1.2 Detail Case (View & Create Treatment Plan)**

**Tujuan:**  
Memastikan Orthodontist dapat melihat detail case dan membuat treatment plan.

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Pilih case yang sudah dibuat  
3. Klik **View Submission**  
4. Isi data **Treatment Plan**  
5. Klik **Save**

**Hasil yang Diharapkan:**

* Treatment plan berhasil disimpan  
* Data terbaru langsung ditampilkan pada detail case  
  ---

  ### **1.3 Approve / Reject 3D Plan**

**Tujuan:**  
Memastikan Orthodontist dapat melakukan review dan keputusan terhadap 3D treatment plan.

**Langkah Pengujian:**

1. Buka **detail case**  
2. Review **3D Treatment Detail**  
3. Tentukan keputusan:  
   * **Reject:** isi feedback lalu submit  
   * **Approve:** konfirmasi persetujuan 3D plan kepada **Smiley Nova Team**

**Hasil yang Diharapkan:**

* Jika **Reject**:  
  * Feedback terkirim ke **Smiley Nova Team**  
  * Status case diperbarui sesuai proses revisi  
* Jika **Approve**:  
  * Case berpindah ke **Dentist Flow**

  ---

  ## **2\. Menu Message**

  ### **2.1 Message (Cases)**

**Tujuan:**  
Memastikan message thread tersedia untuk setiap case.

**Langkah Pengujian:**

1. Buka menu **Message**  
2. Pilih case terkait

**Hasil yang Diharapkan:**

* Message thread untuk case tersedia dan dapat digunakan  
  ---

  ### **2.2 Message (Admin)**

**Tujuan:**  
Memastikan Orthodontist dapat mengirim pesan ke admin Bitesoft.

**Langkah Pengujian:**

1. Buka menu **Message (Admin)**  
2. Tulis pesan  
3. Kirim pesan

**Hasil yang Diharapkan:**

* Pesan berhasil terkirim ke admin Bitesoft  
  ---

  ## **3\. Menu Settings**

  ### **3.1 Settings – General**

**Tujuan:**  
Memastikan Orthodontist dapat memperbarui data profil.

**Langkah Pengujian:**

1. Buka menu **Settings \> General**  
2. Update foto profil  
3. Update personal information  
4. Klik **Save Changes**

**Hasil yang Diharapkan:**

* Data profil berhasil diperbarui  
  ---

  ### **3.2 Settings – Notification**

**Tujuan:**  
Memastikan pengaturan notifikasi dapat diubah.

**Langkah Pengujian:**

1. Buka **Settings \> Notification**  
2. Toggle **enable / disable** notifikasi  
3. Simpan pengaturan

**Hasil yang Diharapkan:**

* Status notifikasi berubah sesuai pengaturan  
  ---

  ### **3.3 Settings – Security**

**Tujuan:**  
Memastikan Orthodontist dapat mengubah password akun.

**Langkah Pengujian:**

1. Buka **Settings \> Security**  
2. Masukkan password lama  
3. Masukkan password baru  
4. Simpan perubahan

**Hasil yang Diharapkan:**

* Password berhasil diperbarui  
* User dapat login menggunakan password baru

