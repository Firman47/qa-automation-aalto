

---

## **1\. Dental Monitoring – Setup Awal**

### **1.1 Create Practice**

* Buka **Dental Monitoring**  
* Masuk menu **Practice**  
* Create **Practice**

### **1.2 Create Dentist (Doctor)**

* Buka menu **Dentist / Doctor**  
* Create **Dentist**  
* Assign dentist ke **Practice** yang sudah dibuat

---

## **2\. Dental Monitoring – Protocol Setup**

### **2.1 Create Protocol (Quickstart)**

* Buka **Detail Dentist**  
* Masuk ke tab **Protocol**  
* Create **Protocol**  
* Pilih tipe **Quickstart**

---

## **3\. AALTO – Practice Management (CRUD)**

### **3.1 Create Practice**

* Login sebagai **Superadmin**  
  * Email: `ikhsan@sadigit.com`  
  * Password: `Password123!`  
* Buka menu **Practice**  
* Create **Practice** (contoh: *Aalto*)

---

## **4\. AALTO – Dentist Management (CRUD)**

### **4.1 Create Dentist User**

* Buka menu **User**  
* Create user untuk **Dentist**  
  * Role: **Admin**  
* Set data **Dentist** harus sama dengan data di **Dental Monitoring**

### **4.2 Create Admin User**

* Create user tambahan  
  * Role: **Admin**  
  * Digunakan untuk kebutuhan operasional

---

## **5\. AALTO – Orthodontist Management (CRUD)**

### **5.1 Create Orthodontist User**

* Buka menu **User**  
* Create user untuk **Orthodontist**

### **5.2 Assign Orthodontist ke Practice**

* Login sebagai **Orthodontist**  
* Pilih **Orthodontist Profile**  
* Assign ke **Practice** yang sudah dibuat sebelumnya

---

## **6\. Case Flow – Dentist → Orthodontist → Dentist**

### **6.1 Create Case (Dentist)**

* Login sebagai **Dentist**  
* Buka menu **Patient**  
* Create **New Case**  
* Isi detail case  
* Lanjutkan ke flow **Orthodontist**

### **6.2 Orthodontist Flow**

* Login sebagai **Orthodontist**  
* Request **3D**  
  * Koordinasi via Discord (A / Eko / Ikhsan)  
* Write **Treatment** atau **Need Clarification**  
* Send **Treatment** ke Dentist

### **6.3 Dentist Approval Flow**

* Login kembali sebagai **Dentist**  
* Isi:  
  * **Patient Consent**  
  * **Medical History**  
  * **Patient Signature**  
* Approve atau Reject  
* Jika **Approve**, lanjut ke **Manufacture Dashboard**

---

## **7\. Dental Monitoring – Case Validation**

* Cek case di **Dental Monitoring**  
* Pastikan DM case sudah diisi (scan tersedia)  
* Verifikasi setiap tab di Dental Monitoring:  
  * Scan  
  * Monitoring  
  * Timeline  
  * Alerts

---

## **8\. AI Summary (AALTO)**

* Pastikan case status minimal **“Treatment Ready”**  
* Buka **Ask AALTO AI**  
* Generate **AI Summary**  
* Lakukan **Regenerate** jika diperlukan

---

## **9\. Leads Flow**

### **9.1 Create Leads (Superadmin)**

* Login sebagai **Superadmin**  
* Buka menu **Leads**  
* Create **Lead**  
  * Jika **Practice kosong** → tampil ke semua Dentist  
  * Jika **Practice dipilih** → hanya ke Dentist dalam Practice tersebut

### **9.2 Dentist Lead Handling**

* Login sebagai **Dentist**  
* Accept **Lead**  
* Isi data Lead  
* Booking waktu  
* Setelah lengkap → otomatis menjadi **Case**  
* Flow mengikuti **Case Flow** standar

---

## **10\. Invoice Flow**

### **10.1 Create Invoice (Superadmin)**

* Login sebagai **Superadmin**  
* Case yang tersedia adalah case dengan status **“In Production”**  
* Buat **Invoice** pada case yang sudah di-approve

### **10.2 Payment (Dentist)**

* Login sebagai **Dentist**  
* Lakukan **Paid Invoice**

---

