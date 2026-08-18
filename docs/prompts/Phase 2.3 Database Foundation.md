# TASK: Phase 2.3 — Database Foundation (IndexedDB + Dexie.js)

## Peran

Bertindaklah sebagai **Senior Software Architect**, **Database Architect**, **IndexedDB Specialist**, dan **Technical Lead**.

Sebelum bekerja, baca dan pahami dokumen berikut:

* docs/11_AI_CONTEXT.md
* docs/10_PROJECT_STRUCTURE.md
* docs/09_CODING_STANDARD.md
* docs/12_DEVELOPMENT_WORKFLOW.md
* docs/02_DATABASE_SCHEMA.md
* docs/03_BUSINESS_RULES.md

Seluruh implementasi harus mengikuti dokumentasi proyek.

---

# Tujuan

Membangun fondasi database lokal menggunakan **IndexedDB** dengan **Dexie.js**.

Hasil akhir harus berupa aplikasi yang dapat dijalankan, di mana database otomatis dibuat saat aplikasi pertama kali dibuka.

Belum membuat CRUD atau fitur bisnis.

---

# Target Hasil

Saat aplikasi dijalankan:

Application Start

?

Initialize Database

?

Create Database (jika belum ada)

?

Create Tables

?

Insert Seed Data (jika diperlukan)

?

Database Ready

?

Application Ready

Tidak boleh ada error di console.

---

# Teknologi

Gunakan:

* IndexedDB
* Dexie.js (versi stabil terbaru)
* Vanilla JavaScript (ES2022+)

Jangan menggunakan database lain.

---

# Struktur Folder

Gunakan struktur sesuai `10_PROJECT_STRUCTURE.md`.

Minimal:

src/database/

* db.js
* schema.js
* migrations.js
* seed.js
* database-manager.js

src/repositories/

* base-repository.js

Jangan membuat repository bisnis (ProductRepository, SalesRepository, dll.) pada sprint ini.

---

# Database Manager

Implementasikan modul yang bertanggung jawab untuk:

* Inisialisasi database.
* Membuka koneksi.
* Menutup koneksi (jika diperlukan).
* Menampilkan status database.
* Menangani error inisialisasi.

Database Manager menjadi satu-satunya pintu masuk untuk inisialisasi database.

---

# Schema

Implementasikan schema awal sesuai `02_DATABASE_SCHEMA.md`.

Jika jumlah tabel sangat banyak, cukup buat tabel inti dan siapkan mekanisme untuk menambahkan tabel pada migrasi berikutnya.

Pastikan struktur mudah dikembangkan.

---

# Migration System

Bangun sistem migrasi sederhana menggunakan mekanisme versi Dexie.

Persyaratan:

* Mendukung penambahan versi baru.
* Tidak menghapus data lama.
* Mudah diperluas.
* Memiliki komentar dokumentasi yang jelas.

---

# Seed Data

Bangun mekanisme seed data.

Minimal dapat mengisi data awal seperti:

* Pengaturan aplikasi.
* Role default.
* Satuan dasar.
* Kategori contoh (opsional).

Seed hanya dijalankan pada instalasi pertama atau ketika database baru dibuat.

---

# Base Repository

Buat `BaseRepository` yang menyediakan operasi dasar:

* Create
* Read
* Update
* Delete
* Find
* Count
* Exists

Repository ini akan diwarisi oleh repository lain pada sprint berikutnya.

Jangan membuat repository spesifik modul.

---

# Database Status

Siapkan utilitas untuk menampilkan informasi dasar:

* Nama database.
* Versi database.
* Status koneksi.
* Jumlah tabel.
* Waktu inisialisasi (opsional).

Informasi ini dapat digunakan untuk debugging.

---

# Error Handling

Pastikan:

* Error saat membuka database ditangani dengan baik.
* Error migrasi memiliki pesan yang jelas.
* Error seed data tidak menyebabkan aplikasi gagal dimuat tanpa penjelasan.

---

# Logging

Tambahkan logging sederhana yang mengikuti konfigurasi aplikasi.

Contoh log:

[DB] Initializing...

[DB] Database opened.

[DB] Migration completed.

[DB] Seed completed.

[DB] Ready.

---

# Validasi

Pastikan:

* Database dibuat otomatis saat pertama kali aplikasi dibuka.
* Tidak ada error di console.
* Seed hanya berjalan sekali.
* Migration dapat ditambahkan di masa depan.
* Struktur mengikuti `10_PROJECT_STRUCTURE.md`.
* Kode mengikuti `09_CODING_STANDARD.md`.

---

# Yang Tidak Boleh Dilakukan

Jangan:

* Membuat halaman Product.
* Membuat CRUD Product.
* Membuat Login.
* Membuat Dashboard bisnis.
* Membuat transaksi penjualan.
* Membuat laporan.
* Menambahkan logika bisnis.

Fokus hanya pada fondasi database.

---

# Dokumentasi

Jika terdapat keputusan implementasi yang berbeda dari dokumentasi, jelaskan alasan dan dampaknya.

Perbarui README modul database jika diperlukan.

---

# Output

Setelah selesai, berikan ringkasan:

* File yang dibuat atau diubah.
* Struktur database yang diimplementasikan.
* Cara kerja Database Manager.
* Cara kerja Migration.
* Cara kerja Seed Data.
* Cara menggunakan BaseRepository.
* Status validasi (database berhasil dibuat, migrasi berjalan, seed berhasil, tidak ada error di console).
* Catatan untuk Sprint 2.4.
