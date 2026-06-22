# **QA Workflow – Admin Bitesoft**

Dokumen ini menjelaskan **alur workflow untuk pengetesan QA** pada role **Admin Bitesoft**. Format disusun secara terstruktur dan sistematis agar memudahkan proses testing, validasi fitur, dan pencatatan hasil uji.

---

## **1\. Menu Patient (Cases)**

### **1.1 Review Case**

**Tujuan:** 

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Klik salah satu pasien detail  
3. review apakah case ini perlu ada klarifikasi dari dentist  
4. Submit permintaan klarifikasi

**Hasil yang Diharapkan:**

---

### **1.2 Detail Case (View & create treatment plan)**

**Tujuan:**.

**Langkah Pengujian:**

1. Buka menu **Patient (Cases)**  
2. Pilih case yang sudah dibuat  
3. Klik **View Submission**  
4. Isi data untuk treatment plan  
5. Klik **Save**

**Hasil yang Diharapkan:**

* Perubahan data berhasil disimpan  
* Data terbaru langsung terlihat di detail case

---

### **1.3 Approve / Reject 3D Plan**

**Tujuan:** Memastikan dentist dapat melakukan review treatment plan dan 3D detail.

**Langkah Pengujian:**

1. Buka detail case  
2. Review **3D Treatment Detail**  
3. Tentukan keputusan:  
   * **Reject:** isi feedback lalu submit  
   * **Approve:** konfirmasi persetujuan 3D plan kepada smiley nova

**Hasil yang Diharapkan:**

* Jika **Reject**: feedback terkirim ke smiley nova team dan status case diperbarui  
* Jika **Approve**: case lanjut ke **Dentist flow**

---

## **2\. leads**

create leads:  
\-buka menu leads  
\- create leads  
\- isi basic information  
\- pilih assign to dentist atau kosongkan agar bisa diakses siapapun

## 

## **3\. Menu Message**

### **3.1 Message (Cases)**

**Tujuan:** Memastikan message otomatis dibuat saat case baru dibuat.

**Langkah Pengujian:**

1. Buat case baru  
2. Buka menu **Message**  
3. Pilih case terkait

**Hasil yang Diharapkan:**

* Message thread untuk case tersedia secara otomatis

---

### **3.2 Message (Admin)**

**Tujuan:** Memastikan dentist dapat mengirim pesan ke admin Bitesoft.

**Langkah Pengujian:**

1. Buka menu **Message (Admin)**  
2. Tulis pesan  
3. Kirim pesan

**Hasil yang Diharapkan:**

* Pesan berhasil terkirim ke admin Bitesoft

---

## **4\. Menu Settings**

### **4.1 Settings – General**

**Tujuan:** Memastikan dentist dapat memperbarui data profil.

**Langkah Pengujian:**

1. Buka menu **Settings \> General**  
2. Update foto profil  
3. Update personal information  
4. Klik **Save Changes**

**Hasil yang Diharapkan:**

* Data profil berhasil diperbarui

---

### **4.2 Settings – Notification**

**Tujuan:** Memastikan pengaturan notifikasi berfungsi.

**Langkah Pengujian:**

1. Buka **Settings \> Notification**  
2. Toggle enable / disable notifikasi  
3. Simpan pengaturan

**Hasil yang Diharapkan:**

* Status notifikasi berubah sesuai pengaturan

---

### **4.3 Settings – Security**

**Tujuan:** Memastikan dentist dapat mengubah password.

**Langkah Pengujian:**

1. Buka **Settings \> Security**  
2. Masukkan password lama  
3. Masukkan password baru  
4. Simpan perubahan

**Hasil yang Diharapkan:**

* Password berhasil diperbarui  
* User dapat login menggunakan password baru

