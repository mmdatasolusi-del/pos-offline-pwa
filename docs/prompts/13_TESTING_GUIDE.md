# TASK: Buat Dokumen `13_TESTING_GUIDE.md`

## Peran

Bertindaklah sebagai **Senior QA Engineer**, **Software Test Architect**, **Quality Assurance Lead**, **Technical Lead**, dan **AI Engineering Architect**.

Dokumen ini menjadi standar resmi pengujian untuk seluruh proyek aplikasi POS Offline Progressive Web App.

Dokumen ini digunakan oleh AI Coding Assistant maupun developer manusia.

---

# Tujuan

Buat file:

`docs/13_TESTING_GUIDE.md`

Dokumen ini mendefinisikan strategi, metode, standar, dan checklist pengujian sebelum suatu perubahan dianggap selesai.

Dokumen ini **tidak boleh berisi implementasi fitur aplikasi**.

---

# Filosofi Testing

Jelaskan prinsip:

* Quality First
* Test Early
* Test Often
* Regression Prevention
* Risk Based Testing
* Documentation Driven Testing
* Offline First Validation

Jelaskan bagaimana prinsip tersebut diterapkan pada proyek.

---

# Tujuan Testing

Testing bertujuan memastikan:

* Fitur sesuai kebutuhan.
* Business Rules dipatuhi.
* Tidak ada regresi.
* UI konsisten.
* Data aman.
* Performa tetap baik.
* Pengalaman pengguna tetap nyaman.

---

# Strategi Testing

Gunakan pendekatan bertingkat:

```text
Requirement Review
        ?
Static Review
        ?
Unit Testing
        ?
Integration Testing
        ?
UI Testing
        ?
Business Rule Testing
        ?
Offline Testing
        ?
Performance Testing
        ?
Regression Testing
        ?
Acceptance Testing
```

Jelaskan tujuan setiap tahap.

---

# Jenis Pengujian

## 1. Requirement Review

Pastikan implementasi sesuai:

* Blueprint
* Feature List
* Business Rules
* Roadmap

---

## 2. Static Review

Periksa:

* Struktur folder
* Coding Standard
* Penamaan file
* Dokumentasi
* Konsistensi modul

---

## 3. Unit Testing

Fokus pada:

* Utility
* Helper
* Validator
* Formatter
* Calculator
* Business Logic

Tentukan kriteria lulus.

---

## 4. Integration Testing

Pastikan integrasi:

Page

?

Service

?

Repository

?

Database

berjalan dengan benar.

---

## 5. UI Testing

Periksa:

* Responsive
* Dark Mode
* Tablet
* Mobile
* Desktop
* Font
* Button
* Dialog
* Form
* Table

---

## 6. Business Rule Testing

Verifikasi seluruh aturan bisnis.

Contoh:

* Stok berkurang setelah transaksi sukses.
* Refund tidak menghapus histori.
* Void tetap menyimpan audit.
* Pajak dihitung benar.
* Diskon diterapkan sesuai aturan.

---

## 7. Database Testing

Periksa:

* CRUD
* Index
* Migration
* Backup
* Restore
* Integritas data

---

## 8. Offline Testing

Pastikan:

* Aplikasi tetap berjalan tanpa internet.
* Service Worker aktif.
* IndexedDB berfungsi.
* Data tetap tersimpan.
* PWA dapat dibuka ulang.

---

## 9. Performance Testing

Periksa:

* Waktu buka aplikasi.
* Waktu pencarian produk.
* Waktu transaksi.
* Penggunaan memori.
* Ukuran cache.
* Respons UI.

---

## 10. Regression Testing

Pastikan perubahan baru tidak merusak fitur lama.

---

## 11. Accessibility Testing

Periksa:

* Kontras warna.
* Fokus keyboard.
* Ukuran area sentuh.
* Label form.
* Navigasi yang jelas.

---

## 12. Security Testing

Verifikasi:

* Validasi input.
* Sanitasi data.
* Penyimpanan lokal yang aman.
* Tidak ada penggunaan `eval()`.
* Penanganan error yang aman.

---

# Checklist per Modul

Untuk setiap modul (Product, Sales, Inventory, Purchase, Report, dll.), buat template checklist yang mencakup:

* Fungsi utama bekerja.
* Business Rules dipenuhi.
* Tidak ada error di console.
* UI konsisten.
* Data tersimpan dengan benar.
* Navigasi berjalan baik.
* Dokumentasi diperbarui jika perlu.

---

# Checklist per Halaman

Pastikan setiap halaman:

* Dapat dibuka.
* Responsive.
* Loading cepat.
* Tombol berfungsi.
* Validasi form berjalan.
* Tidak ada elemen rusak.
* Mudah digunakan di tablet.

---

# Testing Data

Jelaskan kebutuhan data uji.

Contoh:

* Produk tanpa stok.
* Produk stok minimum.
* Diskon 0%.
* Diskon maksimum.
* Pajak berbeda.
* Nama produk sangat panjang.
* Ribuan data produk.

---

# Bug Severity

Definisikan tingkat keparahan:

* Critical
* High
* Medium
* Low
* Cosmetic

Berikan contoh masing-masing.

---

# Bug Priority

Definisikan:

* P1
* P2
* P3
* P4

Jelaskan cara menentukan prioritas.

---

# Definition of Ready for Testing

Sebuah fitur boleh diuji jika:

* Implementasi selesai.
* Coding Standard dipatuhi.
* Tidak ada error sintaks.
* Dokumentasi dasar tersedia.

---

# Definition of Pass

Fitur dianggap lulus jika:

* Semua checklist terpenuhi.
* Tidak ada bug Critical.
* Tidak ada bug High yang menghambat fungsi utama.
* Business Rules berjalan benar.
* Offline tetap berfungsi.
* Tidak ada error di console.

---

# Regression Matrix

Jelaskan modul yang harus diuji ulang jika terjadi perubahan pada:

* Database
* Sales
* Inventory
* Payment
* Report
* Theme
* Login

---

# Testing Workflow

Standar alur:

```text
Analisis
    ?
Implementasi
    ?
Self Review
    ?
Static Review
    ?
Functional Testing
    ?
Regression Testing
    ?
Documentation Review
    ?
Release Ready
```

---

# Dokumentasi Testing

Setiap pengujian harus mencatat:

* Nama fitur.
* Tanggal.
* Penguji.
* Hasil.
* Bug yang ditemukan.
* Status.
* Catatan.

Berikan template laporan sederhana.

---

# Continuous Improvement

Jelaskan bagaimana strategi testing dapat berkembang seiring bertambahnya modul, fitur, dan kompleksitas aplikasi.

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumentasi proyek.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Tidak berisi implementasi fitur.
* Menjadi standar resmi QA proyek.

---

# Aturan Kerja AI

Sebelum menyatakan tugas selesai, AI wajib:

* Memastikan fitur telah melalui checklist yang relevan.
* Menjelaskan pengujian yang telah dilakukan (atau yang perlu dilakukan bila belum dapat dijalankan).
* Mengidentifikasi risiko yang masih tersisa.
* Menyarankan langkah validasi berikutnya jika diperlukan.

---

# Output

Hasil akhir berupa file:

`docs/13_TESTING_GUIDE.md`

Dokumen ini harus menjadi pedoman utama Quality Assurance sehingga seluruh fitur aplikasi POS memiliki standar pengujian yang konsisten, terdokumentasi, dan siap digunakan sebelum dinyatakan selesai.
