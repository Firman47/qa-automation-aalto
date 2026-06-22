# **QA Workflow – Dentist (User)**

Dokumen ini menjelaskan alur Quality Assurance (QA) untuk pengujian fitur berdasarkan **role Dentist (User)**. Tujuan utama dokumen ini adalah memastikan setiap fungsi berjalan sesuai kebutuhan bisnis, mudah divalidasi, dan terdokumentasi dengan jelas selama proses testing.

---

## **0\. Initial Setup – Dental Monitoring**

### **0.1 Create Practice**

**Tujuan**  
Memastikan sistem memungkinkan pembuatan practice sebelum doctor dibuat.

**Langkah Pengujian**

1. Buka menu **Doctor \> Practice**  
2. Buat practice baru  
3. Simpan data practice

**Hasil yang Diharapkan**

* Practice berhasil dibuat  
* Practice muncul pada daftar practice  
  ---

  ### **0.2 Create Doctor**

**Tujuan**  
Memastikan doctor dapat dibuat dan di-assign ke practice yang telah ada.

**Langkah Pengujian**

1. Buka menu **Doctor \> Doctor**  
2. Buat doctor baru  
3. Assign doctor ke practice yang telah dibuat sebelumnya  
4. Simpan data  
5. buka detail doctor   
6. manage protocol  
7. buat protocol baru  
8. masuk ke quickstart   
9. buat quickstart baru 

**Hasil yang Diharapkan**

* Doctor berhasil dibuat  
* Doctor terhubung dengan practice yang dipilih  
  ---

  ## **1\. Menu Patient (Cases)**

  ### **1.1 Create Case**

**Tujuan**  
Memastikan dentist dapat membuat case baru dan meneruskannya ke alur Orthodontist.

**Langkah Pengujian**

1. Buka menu **Patient (Cases)**  
2. Klik **Create Patient**  
3. Isi **Basic Information**  
4. Isi **Material Diagnostic**  
5. Isi **Treatment Goals**  
6. Submit / simpan case

**Hasil yang Diharapkan**

* Case berhasil dibuat  
* Status case berpindah ke **Orthodontist Flow / Review**  
* Sistem otomatis membuat **message thread** untuk case tersebut  
  ---

  ### **1.2 Detail Case (View & Update)**

**Tujuan**  
Memastikan dentist dapat melihat dan memperbarui data case sebelum direview orthodontist.

**Langkah Pengujian**

1. Buka menu **Patient (Cases)**  
2. Pilih case yang telah dibuat  
3. Klik **View Submission**  
4. Lakukan perubahan data  
5. Klik **Save**

**Hasil yang Diharapkan**

* Perubahan data berhasil disimpan  
* Data terbaru langsung tampil pada detail case  
  ---

  ### **1.3 Approve / Reject Treatment Plan**

**Tujuan**  
Memastikan dentist dapat melakukan review terhadap treatment plan dan detail 3D.

**Langkah Pengujian**

1. Buka detail case  
2. Review **Treatment Plan**  
3. Review **3D Treatment Detail**  
4. Tentukan keputusan:  
   * **Reject** → isi feedback lalu submit  
   * **Approve** → konfirmasi persetujuan

**Hasil yang Diharapkan**

* Jika **Reject**: feedback terkirim ke orthodontist dan status case diperbarui  
* Jika **Approve**: case lanjut ke **Manufacturing Flow**  
  ---

  ### **1.4 AI Summary**

**Tujuan**  
Memastikan fitur AI Summary dapat menghasilkan dan menyimpan ringkasan treatment dan assurance.

#### **AI Treatment Summary**

**Langkah Pengujian**

1. Buka detail case (status **Approved by Dentist**)  
2. Klik tombol **AI Summary**  
3. Generate **Treatment Summary (AI)**  
4. Edit (opsional)  
5. Simpan hasil

**Hasil yang Diharapkan**

* Summary berhasil digenerate  
* Hasil dapat:  
  * Disimpan ke profile  
  * Disalin  
  * Dikirim melalui email

  #### **AI Assurance Summary**

**Langkah Pengujian**

1. Buka detail case (status **Approved by Dentist**)  
2. Klik tombol **AI Summary**  
3. Generate **Assurance Summary (AI)**  
4. Edit (opsional)  
5. Simpan hasil

**Hasil yang Diharapkan**

* Assurance summary berhasil digenerate dan disimpan  
* Opsi save, copy, dan send email tersedia  
  ---

  ### **1.5 Dental Monitoring**

**Tujuan**  
Memastikan fitur monitoring dapat dijalankan setelah case disetujui.

**Langkah Pengujian**

1. Buka detail case (status **Approved**)  
2. Pada bagian profile, klik **Open Monitoring**  
3. Masuk ke halaman monitoring  
4. Klik **Start Monitoring**  
5. Lakukan **Pause** atau **Stop**

**Hasil yang Diharapkan**

* Monitoring dapat dimulai, dijeda, dan dihentikan tanpa error  
  ---

  ### **1.6 Patient Consent**

**Tujuan**  
Memastikan patient consent wajib ditandatangani sebelum lanjut ke manufacturing.

**Langkah Pengujian**

1. Buka detail case  
2. Cek status **Patient Consent**  
3. Sistem mengirim:  
   * Consent form  
   * Treatment plan  
   * 3D treatment  
     melalui email ke patient  
4. Patient menandatangani consent

**Hasil yang Diharapkan**

* Status berubah menjadi **Signed**  
* Case baru dapat dilanjutkan ke manufacturing  
  ---

  ### **1.7 Medical History**

**Tujuan**  
Memastikan medical history wajib ditandatangani oleh patient.

**Langkah Pengujian**

1. Buka detail case  
2. Kirim form **Medical History** ke patient  
3. Patient menandatangani form

**Hasil yang Diharapkan**

* Status medical history menjadi **Signed**  
* Case dapat melanjutkan proses berikutnya  
  ---

  ## **2\. Menu Leads**

  ### **2.1 Accept Leads**

**Tujuan**  
Memastikan dentist dapat menerima patient leads.

**Langkah Pengujian**

1. Buka menu **Leads**  
2. Pilih detail lead  
3. Klik **Accept Lead**

**Hasil yang Diharapkan**

* Status lead berubah menjadi **Accepted**  
  ---

  ### **2.2 Booking Leads**

**Tujuan**  
Memastikan dentist dapat membuat jadwal booking untuk lead.

**Langkah Pengujian**

1. Buka detail lead  
2. Tentukan **Booking Time**  
3. Simpan jadwal

**Hasil yang Diharapkan**

* Jadwal tersimpan dengan benar  
* Booking time tampil di detail lead  
  ---

  ### **2.3 Complete Task Leads**

**Tujuan**  
Memastikan lead dapat dilengkapi dan dikonversi menjadi patient/case.

**Langkah Pengujian**

1. Buka detail lead  
2. Isi **Diagnostic Information**  
3. Isi **Treatment Goals**  
4. Simpan data

**Hasil yang Diharapkan**

* Data tersimpan dengan benar  
* Status lead diperbarui  
* Lead resmi menjadi **Patient / Case**

  ### **2.4 Complete Task Leads**

**Tujuan**  
untuk pemabayaran invoice tiap case

**Langkah Pengujian**

1. buka menu leads \-\> patient  
2. buka detail 

**Hasil yang Diharapkan**

* Data tersimpan dengan benar  
* Status lead diperbarui  
* Lead resmi menjadi **Patient / Case**

  ---

  ## **3\. Menu Message**

  ### **3.1 Message (Cases)**

**Tujuan**  
Memastikan message thread otomatis dibuat saat case dibuat.

**Langkah Pengujian**

1. Buat case baru  
2. Buka menu **Message**  
3. Pilih case terkait

**Hasil yang Diharapkan**

* Message thread tersedia secara otomatis  
  ---

  ### **3.2 Message (Admin)**

**Tujuan**  
Memastikan dentist dapat mengirim pesan ke admin Bitesoft.

**Langkah Pengujian**

1. Buka menu **Message (Admin)**  
2. Tulis pesan  
3. Kirim pesan

**Hasil yang Diharapkan**

* Pesan berhasil terkirim ke admin  
  ---

  ## **4\. Menu Settings**

  ### **4.1 Settings – General**

**Tujuan**  
Memastikan dentist dapat memperbarui data profil.

**Langkah Pengujian**

1. Buka **Settings \> General**  
2. Update foto profil  
3. Update personal information  
4. Klik **Save Changes**

**Hasil yang Diharapkan**

* Data profil berhasil diperbarui  
  ---

  ### **4.2 Settings – Notification**

**Tujuan**  
Memastikan pengaturan notifikasi berfungsi.

**Langkah Pengujian**

1. Buka **Settings \> Notification**  
2. Aktifkan / nonaktifkan notifikasi  
3. Simpan pengaturan

**Hasil yang Diharapkan**

* Status notifikasi berubah sesuai pengaturan  
  ---

  ### **4.3 Settings – Security**

**Tujuan**  
Memastikan dentist dapat mengubah password akun.

**Langkah Pengujian**

1. Buka **Settings \> Security**  
2. Masukkan password lama  
3. Masukkan password baru  
4. Simpan perubahan

**Hasil yang Diharapkan**

* Password berhasil diperbarui  
* User dapat login menggunakan password baru


