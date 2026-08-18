# TASK

Buat dokumen:

docs/17_BUSINESS_RULES.md

JANGAN membuat source code.

Dokumen ini akan menjadi SATU-SATUNYA referensi aturan bisnis (Single Source of Truth) untuk seluruh pengembangan aplikasi POS Offline PWA.

======================================================================
PROJECT
======================================================================

Nama:
POS Offline PWA

Target pengguna:

- Toko Kelontong
- Minimarket
- Toko Bangunan
- Warung Makan
- Cafe
- Restoran
- Bakery
- Laundry
- Apotek
- Jasa

Aplikasi harus dapat digunakan secara Offline First menggunakan IndexedDB (Dexie) dan PWA.

Dokumen ini harus menjadi acuan utama bagi Developer, AI (OpenCode/Cursor AI), QA, dan Tester.

======================================================================
STRUKTUR DOKUMEN
======================================================================

# 1. Filosofi Aturan Bisnis

Jelaskan prinsip:

- Offline First
- Data Consistency
- Auditability
- Scalability
- Simplicity
- Security
- Universal POS
- Single Source of Truth

======================================================================

# 2. Master Data Rules

Jelaskan aturan bisnis untuk:

Item

Kategori

Satuan

Supplier

Customer

Gudang

Kasir

Role

Permission

Settings

Untuk setiap master data jelaskan:

- Tujuan
- Validasi
- Kode unik
- Status aktif/nonaktif
- Soft Delete
- Audit Trail
- Relasi

======================================================================

# 3. Inventory Rules

Jelaskan secara rinci:

Semua stok berasal dari Stock Movement.

Tidak boleh ada proses yang langsung mengubah stok.

Jenis Stock Movement:

Opening Balance

Purchase

Purchase Return

Sale

Sale Return

Production

Recipe Consumption

Stock Adjustment

Stock Opname

Transfer Gudang

Damage

Expired

Manual Correction

Untuk setiap movement jelaskan:

- Menambah stok
- Mengurangi stok
- Tidak mengubah stok

Lengkapi flow diagram.

======================================================================

# 4. Product Rules

Item Type:

RAW MATERIAL

FINISHED PRODUCT

RECIPE PRODUCT

SERVICE

NON STOCK

Inventory Type:

Stock

Non Stock

Sellable

Purchasable

Track Expired

Track Batch

Multi Barcode

Multi Unit

Bundle Product

Serial Number

======================================================================

# 5. Recipe Rules (BOM)

Jelaskan:

Recipe Header

Recipe Detail

Yield

Waste

Shrinkage

Optional Ingredient

Alternative Ingredient

Auto Deduction

Manual Deduction

Contoh:

Es Teh

Ayam Geprek

Roti

Kopi Susu

======================================================================

# 6. Purchase Rules

Draft

Approved

Received

Completed

Cancelled

Retur

Partial Receive

Harga Beli

Diskon

PPN

Biaya Tambahan

Supplier Default

Jatuh Tempo

Hutang

======================================================================

# 7. Sales Rules

Draft

Open Bill

Completed

Void

Cancelled

Refund

Retur

Split Bill

Merge Bill

Hold Bill

Resume Bill

Multiple Payment

Cash

QRIS

Transfer

Debit

Credit

Voucher

Store Credit

======================================================================

# 8. Discount Rules

Diskon Nominal

Diskon Persen

Diskon Item

Diskon Transaksi

Happy Hour

Promo Paket

Buy X Get Y

Member Discount

Manual Discount

Approval Discount

======================================================================

# 9. Tax Rules

PPN

Non PPN

Tax Inclusive

Tax Exclusive

Service Charge

Pembulatan

======================================================================

# 10. Pricing Rules

Harga Beli

Average Cost

Moving Average

Harga Pokok Penjualan (HPP)

Harga Jual

Margin

Markup

Multi Price

Member Price

Wholesale Price

Promo Price

======================================================================

# 11. Customer Rules

Member

Non Member

Point Reward

Level

Limit Piutang

Blacklist

History

======================================================================

# 12. Supplier Rules

Aktif

Nonaktif

Lead Time

Minimum Order

Termin

History Pembelian

======================================================================

# 13. Cashier Rules

Login

Logout

Shift

Open Cash

Close Cash

Cash In

Cash Out

Kas Akhir

Selisih Kas

======================================================================

# 14. Reporting Rules

Penjualan

Pembelian

Laba Rugi

Pergerakan Stok

Top Produk

Top Customer

Top Supplier

Kas Harian

Dashboard

======================================================================

# 15. Audit Rules

Semua perubahan data harus tercatat.

Catat:

User

Tanggal

Jam

Device

Aksi

Nilai Lama

Nilai Baru

======================================================================

# 16. Backup & Restore Rules

Backup Lokal

Backup Cloud (Future)

Restore

Export

Import

======================================================================

# 17. Synchronization Rules

Offline

Online

Conflict Resolution

Last Sync

Device ID

Multi Device

Future Multi Store

======================================================================

# 18. Security Rules

Authentication

Authorization

Permission

Role

Session

Auto Logout

Idle Timeout

======================================================================

# 19. Validation Rules

Semua field wajib

Validasi angka

Validasi stok

Validasi harga

Validasi barcode

Validasi duplicate

Validasi referential integrity

======================================================================

# 20. Error Handling Rules

Business Error

Validation Error

Database Error

Sync Error

Import Error

Export Error

======================================================================

# 21. Future Features

Multi Gudang

Kitchen Display System (KDS)

Printer Bluetooth

Barcode Scanner

Customer Display

Cloud Sync

Marketplace Integration

Akuntansi

ERP

CRM

Loyalty

Production

Manufacturing

======================================================================

# 22. Business Flow

Buat diagram ASCII lengkap.

Contoh:

Supplier
    ¦
Purchase
    ¦
Receive
    ¦
Stock Movement
    ¦
Inventory
    ¦
Sale
    ¦
Payment
    ¦
Report

Buat juga flow:

Retail

Cafe

Restaurant

Laundry

Service

======================================================================

# 23. Best Practices

Gunakan prinsip:

SOLID

DRY

KISS

Repository Pattern

Service Layer

Domain Driven Design

Offline First

PWA

Clean Architecture

======================================================================

OUTPUT

- Format Markdown profesional.
- Minimal 800 baris.
- Gunakan heading yang konsisten.
- Sertakan tabel, diagram ASCII, contoh kasus nyata, dan skenario edge case.
- Jangan menghasilkan source code.
- Dokumen ini harus menjadi referensi utama seluruh pengembangan aplikasi.

======================================================================

KRITERIA SELESAI

Dokumen cukup lengkap sehingga seluruh modul berikut dapat dibuat tanpa perlu mendefinisikan ulang aturan bisnis:

- Master Data
- Inventory
- Recipe
- Purchase
- Sales
- Cashier
- Report
- Dashboard
- Sync
- ERP Extension