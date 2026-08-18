# TASK: Buat Dokumen `07_ROADMAP.md`

## Peran

Bertindaklah sebagai **Senior Product Manager**, **Software Architect**, **Technical Project Manager**, dan **Agile Coach** yang berpengalaman mengelola pengembangan aplikasi Point of Sale (POS) skala UMKM hingga menengah.

Sebelum menyusun roadmap, baca dan pahami seluruh dokumen berikut:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`
* `04_UI_DESIGN_SYSTEM.md`
* `05_COMPONENT_LIBRARY.md`
* `06_FEATURE_LIST.md`

Gunakan seluruh dokumen tersebut sebagai dasar penyusunan roadmap.

---

# Tujuan

Buat file:

`docs/07_ROADMAP.md`

Dokumen ini menjadi rencana resmi pengembangan aplikasi dari fase awal hingga versi yang matang.

Dokumen ini **tidak boleh berisi implementasi kode**.

---

# Filosofi Roadmap

Jelaskan prinsip:

* MVP First
* Incremental Delivery
* Modular Development
* Continuous Improvement
* Backward Compatibility
* Documentation Driven Development

Jelaskan alasan penggunaan setiap prinsip.

---

# Struktur Roadmap

Roadmap dibagi menjadi beberapa fase.

---

# PHASE 0 — Project Foundation

Target:

* Blueprint
* Database Schema
* Business Rules
* UI Design System
* Component Library
* Feature List
* Coding Standard
* Project Structure

Output:

Dokumentasi proyek selesai.

---

# PHASE 1 — Project Setup

Target:

* Struktur Folder
* Bootstrap
* Dexie.js
* Service Worker
* Manifest
* Theme
* Routing
* Layout
* Database Initialization

Output:

Framework aplikasi siap digunakan.

---

# PHASE 2 — Core System

Target:

* Login
* User
* Role
* Permission
* Setting
* Backup
* Restore

Output:

Fondasi aplikasi siap.

---

# PHASE 3 — Dashboard

Target:

* KPI
* Revenue
* Sales Chart
* Low Stock
* Recent Transaction
* Quick Action

Output:

Dashboard aktif.

---

# PHASE 4 — Master Data

Target:

* Product
* Category
* Unit
* Supplier
* Customer
* Membership

Output:

Master data lengkap.

---

# PHASE 5 — Sales

Target:

* POS
* Cart
* Barcode
* QR
* Discount
* Voucher
* Payment
* Invoice
* Receipt
* Reprint

Output:

Kasir siap digunakan.

---

# PHASE 6 — Inventory

Target:

* Stock Movement
* Stock Adjustment
* Stock Opname
* Minimum Stock
* Inventory History

---

# PHASE 7 — Purchase

Target:

* Purchase Order
* Receive Goods
* Purchase Return

---

# PHASE 8 — Finance

Target:

* Cash Flow
* Expense
* Income
* Shift
* Closing Shift

---

# PHASE 9 — Reporting

Target:

* Sales Report
* Inventory Report
* Profit Report
* Customer Report
* Supplier Report
* Export PDF
* Export Excel

---

# PHASE 10 — Cafe

Target:

* Table
* Reservation
* Kitchen Display
* Kitchen Order
* Split Bill
* Delivery
* Take Away

---

# PHASE 11 — Advanced Feature

Target:

* Loyalty
* Promotion
* Voucher
* Cashback
* Price Rule
* Customer Display

---

# PHASE 12 — Future

Target:

* Multi Outlet
* Multi Warehouse
* Cloud Sync
* REST API
* Marketplace
* AI Assistant
* Forecast
* Advanced Analytics

---

# Milestone

Untuk setiap phase tentukan:

* Tujuan
* Deliverable
* Dependensi
* Risiko
* Kriteria selesai (Definition of Done)

---

# Versi Aplikasi

Rancang versi pengembangan.

Contoh:

## v1.0

MVP

## v1.1

Master Data Lengkap

## v1.2

Inventory

## v1.3

Purchase

## v2.0

Cafe

## v2.5

Finance

## v3.0

Multi Outlet

Sesuaikan dengan kebutuhan proyek.

---

# Prioritas

Gunakan kategori:

Critical

High

Medium

Low

Future

Jelaskan alasan setiap prioritas.

---

# Dependency Roadmap

Buat diagram hubungan antar fase menggunakan Mermaid atau ASCII.

Contoh:

Project Foundation

?

Project Setup

?

Core System

?

Master Data

?

Sales

?

Inventory

?

Finance

?

Reporting

?

Advanced Feature

?

Future

---

# Risiko Proyek

Identifikasi risiko seperti:

* Perubahan kebutuhan
* Perubahan desain
* Kompleksitas database
* Sinkronisasi data
* Kinerja aplikasi
* Keterbatasan browser
* Penyimpanan lokal
* Dukungan perangkat

Berikan strategi mitigasinya.

---

# Estimasi Kompleksitas

Kelompokkan setiap phase menjadi:

* Small
* Medium
* Large
* Extra Large

Jelaskan alasannya.

---

# Definition of Done

Untuk setiap phase jelaskan kriteria selesai.

Contoh:

Sales selesai jika:

* Produk dapat dipilih
* Keranjang berfungsi
* Pembayaran berhasil
* Invoice terbentuk
* Stok diperbarui
* Cash Flow diperbarui
* Audit Log tercatat
* Lolos pengujian

---

# Timeline Konseptual

Buat estimasi timeline konseptual.

Contoh:

Phase 0

?

Phase 1

?

Phase 2

?

...

Tidak perlu tanggal pasti, gunakan urutan logis.

---

# Dokumentasi

Jelaskan dokumen yang harus diperbarui setiap fase.

Contoh:

* CHANGELOG
* FEATURE LIST
* DATABASE
* ROADMAP

---

# Continuous Improvement

Jelaskan bagaimana roadmap dapat diperbarui jika:

* muncul fitur baru
* ada perubahan kebutuhan
* ditemukan bug besar
* terjadi perubahan prioritas

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Menggunakan tabel dan diagram bila diperlukan.
* Tidak berisi implementasi kode.
* Menjadi panduan utama pengembangan proyek.

---

# Aturan Kerja AI

Selama menyusun roadmap:

* Jangan mengubah urutan fase tanpa alasan yang kuat.
* Prioritaskan fitur yang memberikan nilai bisnis tertinggi lebih dahulu.
* Jelaskan trade-off jika ada beberapa alternatif urutan implementasi.
* Pastikan setiap fase memiliki keluaran yang dapat diuji.

---

# Output

Hasil akhir berupa file:

`docs/07_ROADMAP.md`

Dokumen harus menjadi panduan resmi seluruh proses pengembangan aplikasi POS dari tahap perencanaan hingga fitur lanjutan, sehingga AI maupun developer selalu mengetahui prioritas dan urutan implementasi yang benar.
