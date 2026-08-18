# TASK: Buat Dokumen `12_DEVELOPMENT_WORKFLOW.md`

## Peran

Bertindaklah sebagai **Senior Technical Project Manager**, **Software Architect**, **Agile Coach**, **Tech Lead**, dan **AI Engineering Architect**.

Dokumen ini akan menjadi **Standard Operating Procedure (SOP)** pengembangan aplikasi POS Offline Progressive Web App.

Dokumen ini digunakan oleh AI Coding Assistant maupun developer manusia.

---

# Tujuan

Buat file:

`docs/12_DEVELOPMENT_WORKFLOW.md`

Dokumen ini mendefinisikan alur kerja resmi mulai dari menerima tugas hingga tugas dinyatakan selesai.

Dokumen ini **tidak boleh berisi implementasi kode**.

---

# Filosofi Pengembangan

Jelaskan prinsip berikut:

* Documentation Driven Development
* AI Assisted Development
* Incremental Development
* Small Pull Request Mindset
* Reusable Solution
* Continuous Improvement
* Offline First
* Quality Before Quantity

Jelaskan penerapan setiap prinsip dalam proyek.

---

# Siklus Pengembangan

Seluruh pekerjaan harus mengikuti urutan berikut:

```
Analisis
    ?
Perencanaan
    ?
Desain
    ?
Implementasi
    ?
Self Review
    ?
Testing
    ?
Perbaikan
    ?
Update Dokumentasi
    ?
Final Review
    ?
Selesai
```

Jelaskan tujuan setiap tahap dan kriteria untuk melanjutkan ke tahap berikutnya.

---

# Workflow Saat Menerima Tugas Baru

AI harus:

1. Memahami permintaan pengguna.
2. Membaca `11_AI_CONTEXT.md`.
3. Mengidentifikasi dokumen lain yang relevan.
4. Menentukan ruang lingkup pekerjaan.
5. Mengidentifikasi dependensi.
6. Mengidentifikasi risiko.
7. Menyusun rencana implementasi.
8. Baru mulai bekerja.

---

# Workflow Membuat Fitur Baru

Jelaskan langkah standar:

1. Analisis kebutuhan.
2. Verifikasi terhadap Feature List.
3. Verifikasi terhadap Business Rules.
4. Verifikasi terhadap Database Schema.
5. Verifikasi terhadap UI Design System.
6. Tentukan modul yang terdampak.
7. Implementasi.
8. Testing.
9. Update dokumentasi.
10. Final review.

---

# Workflow Memperbaiki Bug

Standar:

1. Identifikasi bug.
2. Reproduksi bug.
3. Analisis penyebab.
4. Tentukan solusi.
5. Implementasi perbaikan.
6. Regression testing.
7. Update dokumentasi jika diperlukan.

---

# Workflow Refactoring

Jelaskan kapan refactor dilakukan.

Langkah:

* Analisis.
* Identifikasi risiko.
* Refactor bertahap.
* Pastikan perilaku tidak berubah.
* Jalankan pengujian.
* Dokumentasikan perubahan.

---

# Workflow Perubahan Database

Setiap perubahan database harus:

* Dianalisis dampaknya.
* Diperbarui di `02_DATABASE_SCHEMA.md`.
* Diverifikasi terhadap Business Rules.
* Memperhatikan kompatibilitas data lama.
* Memiliki strategi migrasi bila diperlukan.

---

# Workflow Perubahan Business Rules

Jika ada perubahan aturan bisnis:

* Perbarui `03_BUSINESS_RULES.md`.
* Evaluasi dampak terhadap modul lain.
* Perbarui Feature List bila perlu.
* Perbarui Roadmap jika prioritas berubah.

---

# Workflow Perubahan UI

Jika mengubah UI:

* Ikuti `04_UI_DESIGN_SYSTEM.md`.
* Ikuti `05_COMPONENT_LIBRARY.md`.
* Hindari membuat komponen baru jika komponen yang ada masih dapat digunakan.

---

# Workflow Dokumentasi

Setelah pekerjaan selesai, AI harus memeriksa apakah dokumen berikut perlu diperbarui:

* FEATURE_LIST
* ROADMAP
* CHANGELOG
* DATABASE_SCHEMA
* BUSINESS_RULES
* COMPONENT_LIBRARY

Jelaskan kapan setiap dokumen perlu diperbarui.

---

# Workflow Testing

Sebelum pekerjaan selesai:

* Jalankan validasi.
* Lakukan pengujian sesuai `13_TESTING_GUIDE.md`.
* Pastikan tidak ada regresi.
* Pastikan tidak ada error di console.
* Pastikan UI tetap responsif.

---

# Checklist Sebelum Implementasi

AI harus memastikan:

* Tujuan tugas jelas.
* Ruang lingkup dipahami.
* Tidak ada konflik dengan dokumentasi.
* Modul yang terdampak telah diidentifikasi.
* Risiko diketahui.

---

# Checklist Setelah Implementasi

AI harus memastikan:

* Fitur sesuai kebutuhan.
* Business Rules dipatuhi.
* Coding Standard dipatuhi.
* Struktur proyek dipatuhi.
* Dokumentasi diperbarui.
* Tidak ada error.
* Siap diuji.

---

# Definition of Ready

Sebuah tugas boleh mulai dikerjakan jika:

* Tujuan jelas.
* Ruang lingkup jelas.
* Dependensi diketahui.
* Tidak ada konflik besar.
* Dokumen acuan tersedia.

---

# Definition of Done

Sebuah tugas dianggap selesai jika:

* Implementasi selesai.
* Pengujian lulus.
* Dokumentasi diperbarui.
* Tidak ada bug kritis.
* Tidak melanggar Coding Standard.
* Tidak melanggar Business Rules.

---

# Risk Management

Identifikasi risiko seperti:

* Perubahan kebutuhan.
* Perubahan struktur database.
* Perubahan UI.
* Konflik modul.
* Performa.
* Kapasitas penyimpanan browser.
* Kehilangan data.

Berikan strategi mitigasi untuk setiap risiko.

---

# Decision Making

Jika terdapat beberapa alternatif solusi:

AI harus:

* Menjelaskan pilihan yang tersedia.
* Menjelaskan kelebihan dan kekurangan.
* Memberikan rekomendasi.
* Tidak memilih solusi secara diam-diam.

---

# AI Communication Standard

Saat memberikan hasil pekerjaan, AI harus menjelaskan:

* Tujuan perubahan.
* File yang dibuat atau diubah.
* Dampak terhadap modul lain.
* Langkah berikutnya yang disarankan.

---

# Continuous Improvement

Jelaskan bagaimana workflow dapat berkembang tanpa mengganggu struktur proyek.

Misalnya:

* Penambahan modul baru.
* Penambahan jenis testing.
* Penambahan proses review.
* Penambahan standar keamanan.

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumentasi proyek.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Tidak berisi implementasi kode.
* Menjadi SOP resmi pengembangan.

---

# Aturan Kerja AI

Selama bekerja:

* Selalu mulai dari analisis.
* Jangan langsung membuat kode tanpa memahami konteks.
* Jangan mengubah ruang lingkup tugas tanpa persetujuan.
* Dokumentasikan perubahan penting.
* Prioritaskan kualitas daripada kecepatan.

---

# Output

Hasil akhir berupa file:

`docs/12_DEVELOPMENT_WORKFLOW.md`

Dokumen ini harus menjadi panduan resmi seluruh proses pengembangan aplikasi, mulai dari analisis kebutuhan hingga tugas dinyatakan selesai, sehingga AI maupun developer bekerja dengan alur yang konsisten, terdokumentasi, dan mudah dipelihara.
