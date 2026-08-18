# TASK: Buat Dokumen `06_FEATURE_LIST.md`

## Peran

Bertindaklah sebagai **Senior Product Manager**, **Business Analyst**, **Software Architect**, dan **Technical Project Manager** yang berpengalaman membangun aplikasi Point of Sale (POS) untuk retail, minimarket, cafe, restoran, dan UMKM.

Sebelum menyusun dokumen, baca dan pahami seluruh dokumen berikut:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`
* `04_UI_DESIGN_SYSTEM.md`
* `05_COMPONENT_LIBRARY.md`

Gunakan dokumen tersebut sebagai sumber kebenaran.

Jika menemukan konflik, jelaskan sebelum menentukan keputusan.

---

# Tujuan

Buat file:

`docs/06_FEATURE_LIST.md`

Dokumen ini menjadi daftar resmi seluruh fitur aplikasi beserta prioritas, dependensi, status implementasi, dan roadmap pengembangannya.

Dokumen ini **tidak boleh berisi implementasi kode**.

---

# Struktur Dokumen

Minimal memiliki bagian berikut.

---

# 1. Filosofi Pengembangan

Jelaskan prinsip:

* MVP First
* Modular
* Incremental Development
* Reusable
* Maintainable
* Offline First

---

# 2. Kategori Fitur

Kelompokkan fitur menjadi:

## Core System

* Login
* User
* Role
* Permission
* Setting
* Theme
* Backup
* Restore

---

## Dashboard

* KPI
* Sales Summary
* Revenue
* Profit
* Recent Transaction
* Low Stock
* Quick Action
* Chart

---

## Master Data

* Product
* Category
* Unit
* Supplier
* Customer
* Membership

---

## Sales

* POS
* Cart
* Barcode Scan
* QR Scan
* Discount
* Voucher
* Tax
* Payment
* Invoice
* Receipt
* Reprint
* Void
* Refund

---

## Purchase

* Purchase Order
* Purchase Receive
* Purchase Return

---

## Inventory

* Inventory
* Stock Movement
* Stock Adjustment
* Stock Opname
* Minimum Stock
* Stock History

---

## Finance

* Cash Flow
* Expense
* Income
* Shift
* Closing Shift

---

## Report

* Sales Report
* Purchase Report
* Profit Report
* Inventory Report
* Customer Report
* Supplier Report
* Cash Flow Report
* Shift Report

---

## Cafe

* Table
* Reservation
* Kitchen Display
* Kitchen Order
* Split Bill
* Merge Table
* Delivery
* Take Away

---

## Loyalty

* Membership
* Point
* Reward
* Cashback

---

## Utility

* Export Excel
* Export PDF
* Import JSON
* Backup
* Restore
* Database Maintenance

---

# 3. Detail Setiap Fitur

Untuk setiap fitur jelaskan:

* Nama fitur
* Tujuan
* Deskripsi
* Manfaat
* Pengguna
* Modul terkait
* Prioritas
* Status
* Dependensi
* Risiko
* Catatan

---

# 4. Prioritas

Kelompokkan fitur menjadi:

Critical

High

Medium

Low

Future

Jelaskan alasan setiap prioritas.

---

# 5. MVP

Tentukan fitur yang wajib ada pada versi pertama.

Contoh:

Login

Dashboard

Product

Sales

Payment

Backup

Restore

Report Penjualan

Setting

---

# 6. Dependency Matrix

Buat tabel ketergantungan.

Contoh:

Dashboard

?

Sales

?

Inventory

?

Product

?

Category

Jelaskan hubungan antar fitur.

---

# 7. User Role

Untuk setiap fitur tentukan siapa yang dapat mengakses.

Contoh:

Admin

Manager

Kasir

Owner

Gunakan tabel yang mudah dibaca.

---

# 8. Estimasi Kompleksitas

Kelompokkan fitur:

Small

Medium

Large

Extra Large

Berikan alasan.

---

# 9. Status

Gunakan status berikut:

Planned

In Progress

Testing

Completed

Future

Deprecated

Dokumen ini akan menjadi acuan perkembangan proyek.

---

# 10. Feature Flow

Jelaskan alur fitur.

Contoh:

Sales

?

Payment

?

Invoice

?

Stock Update

?

Cash Flow

?

Dashboard

Gunakan Mermaid atau ASCII.

---

# 11. Non Functional Feature

Jelaskan kebutuhan non-fungsional.

Contoh:

Offline

Dark Mode

Responsive

Fast Loading

Accessibility

Performance

Security

Backup

Audit

---

# 12. Future Feature

Daftar fitur masa depan.

Misalnya:

Cloud Sync

Marketplace

WhatsApp

Customer Display

Kitchen Display

API

Multi Outlet

Multi Warehouse

Multi Currency

AI Assistant

Analytics

Forecast

---

# 13. Feature Matrix

Buat tabel yang berisi:

Nama Fitur

Kategori

Prioritas

Role

Status

Dependensi

Target Versi

---

# 14. Acceptance Criteria

Untuk setiap fitur utama buat acceptance criteria.

Contoh:

Sales

? Produk dapat dipilih

? Qty dapat diubah

? Diskon dapat diterapkan

? Pajak dihitung benar

? Pembayaran berhasil

? Invoice tercetak

? Stok berkurang

? Dashboard diperbarui

---

# 15. Out of Scope

Jelaskan fitur yang sengaja tidak masuk pada fase awal.

Misalnya:

Marketplace

Accounting ERP

CRM Lengkap

HR

Payroll

Cloud Native

Mobile Native

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Menggunakan tabel untuk mempermudah pembacaan.
* Tidak berisi implementasi kode.
* Fokus pada kebutuhan produk.

---

# Aturan Kerja AI

Selama menyusun dokumen:

* Jangan menambahkan fitur yang tidak memiliki nilai bisnis.
* Prioritaskan fitur yang benar-benar dibutuhkan oleh UMKM.
* Jelaskan trade-off jika terdapat beberapa pendekatan.
* Tandai fitur sebagai Core, Optional, atau Future jika diperlukan.

---

# Output

Hasil akhir berupa file:

`docs/06_FEATURE_LIST.md`

Dokumen harus menjadi referensi utama dalam menentukan urutan implementasi seluruh fitur aplikasi POS serta memudahkan AI dan developer menentukan prioritas pengembangan.
