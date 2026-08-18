TASK:

Buat file baru:

docs/20_TESTING_GUIDE.md

JANGAN mengubah source code apa pun.

JANGAN mengubah struktur folder.

JANGAN mengubah database.

Hanya membuat dokumentasi pengujian proyek.

=========================================================
TUJUAN
=========================================================

Buat panduan testing lengkap untuk proyek POS Offline PWA.

Dokumen ini menjadi standar resmi seluruh proses pengujian sebelum fitur dinyatakan selesai.

Panduan harus dapat digunakan oleh:

- Developer
- QA
- Tester
- AI Coding Assistant
- Project Manager

Dokumen harus profesional, mudah dibaca, dan siap digunakan pada proyek produksi.

=========================================================
ISI DOKUMEN
=========================================================

# TESTING GUIDE

Versi : 1.0

Tanggal :
Auto Generate

=========================================================
1. TUJUAN TESTING
=========================================================

Jelaskan tujuan testing:

- memastikan fitur berjalan
- mencegah bug
- menjaga stabilitas
- menjaga performa
- menjaga kualitas kode
- memastikan business rules dipatuhi

=========================================================
2. TESTING STRATEGY
=========================================================

Jelaskan tingkatan testing:

Level 1
Unit Test

Level 2
Integration Test

Level 3
UI Test

Level 4
Manual Testing

Level 5
Regression Test

Level 6
Performance Test

Level 7
Offline Test

Level 8
Security Test

Level 9
User Acceptance Test (UAT)

Berikan diagram alur testing.

=========================================================
3. TESTING ENVIRONMENT
=========================================================

Jelaskan environment yang digunakan.

Browser:

Chrome

Edge

Firefox

Android Chrome

Desktop

Resolusi layar:

Desktop

Laptop

Tablet

Mobile

OS

Windows

Android

=========================================================
4. UNIT TEST
=========================================================

Jelaskan cara menguji:

Repository

Service

Validator

Utility

Router

Permission

Authentication

Theme

Database

PWA

Berikan contoh struktur test.

Misalnya

describe()

it()

expect()

=========================================================
5. INTEGRATION TEST
=========================================================

Buat skenario integrasi:

Login

?

Dashboard

?

Produk

?

Penjualan

?

Pembayaran

?

Stok

?

Laporan

?

Logout

Semua alur harus diuji.

=========================================================
6. UI TEST
=========================================================

Checklist UI:

Layout

Sidebar

Topbar

Responsive

Dark Mode

Light Mode

Loading

Skeleton

Modal

Notification

Toast

Dropdown

Pagination

Search

Sorting

Validation

Icon

Animation

Accessibility

=========================================================
7. DATABASE TEST
=========================================================

Uji:

Create

Read

Update

Delete

Soft Delete

Restore

Migration

Version

Seed Data

IndexedDB

Dexie

=========================================================
8. AUTHENTICATION TEST
=========================================================

Skenario:

Login berhasil

Password salah

Username salah

Session expired

Logout

Remember Me

Role Owner

Role Admin

Role Kasir

Permission

Session Timeout

Refresh Browser

=========================================================
9. ROUTER TEST
=========================================================

Semua route diuji.

Contoh:

#/

#/login

#/dashboard

#/produk

#/pelanggan

#/supplier

#/penjualan

#/pembelian

#/laporan

#/pengaturan

404

Unauthorized

=========================================================
10. CRUD TEST
=========================================================

Semua master data wajib diuji.

Produk

Pelanggan

Supplier

Kategori

Satuan

User

Kasir

Checklist:

Tambah

Edit

Hapus

Cari

Filter

Sort

Pagination

Export

Import

=========================================================
11. TRANSACTION TEST
=========================================================

Penjualan

Pembelian

Retur

Stok Masuk

Stok Keluar

Pembayaran

Diskon

Pajak

Multi Item

Void

Draft

Cetak

=========================================================
12. REPORT TEST
=========================================================

Dashboard

Laporan Harian

Mingguan

Bulanan

Tahunan

Produk

Stok

Laba

Kas

Export PDF

Export Excel

=========================================================
13. OFFLINE TEST
=========================================================

Matikan internet.

Pastikan:

Login tetap berjalan (session aktif)

CRUD tetap berjalan

Database tetap berjalan

PWA tetap berjalan

Export tetap berjalan

Tidak ada request gagal.

=========================================================
14. PERFORMANCE TEST
=========================================================

Target:

Startup

< 2 detik

Dashboard

< 1 detik

Search

< 300 ms

Pagination

< 200 ms

CRUD

< 500 ms

Import

1000 data

Export

1000 data

Memory

CPU

=========================================================
15. SECURITY TEST
=========================================================

Checklist:

Tidak ada password plaintext

Tidak ada token bocor

Session timeout

Role validation

Permission validation

SQL Injection

XSS

LocalStorage

IndexedDB

Service Worker

=========================================================
16. REGRESSION TEST
=========================================================

Setelah setiap Sprint:

Login

Dashboard

Produk

Pelanggan

Supplier

Penjualan

Pembelian

Laporan

Pengaturan

Semuanya wajib diuji ulang.

=========================================================
17. USER ACCEPTANCE TEST
=========================================================

Buat tabel UAT.

Kolom:

No

Fitur

Skenario

Expected Result

Actual Result

Status

Tester

Tanggal

Catatan

=========================================================
18. BUG REPORT TEMPLATE
=========================================================

Template:

ID

Judul

Modul

Severity

Priority

Langkah Reproduksi

Expected

Actual

Screenshot

Environment

Status

PIC

=========================================================
19. TEST CHECKLIST
=========================================================

Buat checklist sekitar 100 poin.

Contoh:

? Login berhasil

? Logout berhasil

? Dashboard tampil

? Sidebar tampil

? Search bekerja

? Pagination bekerja

? CRUD berhasil

? Export Excel

? Import Excel

? Session timeout

? Dark Mode

? Responsive

? PWA Offline

? Service Worker aktif

? IndexedDB normal

dst.

=========================================================
20. AI TESTING RULES
=========================================================

AI wajib:

- Audit sebelum coding
- Menjalankan regression test setelah coding
- Tidak menghapus test lama
- Menambahkan test untuk fitur baru
- Memastikan seluruh Business Rules tetap berlaku
- Memastikan API Contract tidak berubah
- Memastikan Development Standards dipatuhi

=========================================================
OUTPUT
=========================================================

Buat markdown profesional.

Minimal 600 baris.

Gunakan heading yang rapi.

Gunakan tabel.

Gunakan checklist.

Gunakan flow diagram (Mermaid).

Gunakan contoh kode.

Gunakan contoh test case.

Jangan mengubah file lain.

Hanya membuat:

docs/20_TESTING_GUIDE.md