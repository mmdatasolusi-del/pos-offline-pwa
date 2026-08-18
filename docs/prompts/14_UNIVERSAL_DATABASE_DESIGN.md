# TASK

Buat dokumen:

docs/14_UNIVERSAL_DATABASE_DESIGN.md

Jangan membuat source code.

Fokus hanya membuat dokumentasi arsitektur database.

========================================================

PROJECT

POS OFFLINE PWA

Target pengguna:

- Retail
- Minimarket
- Toko Bangunan
- Apotek
- Warung Makan
- Cafe
- Restoran
- Bakery
- Laundry
- Jasa

Database harus mampu menangani semuanya tanpa mengubah struktur utama.

========================================================

Isi dokumen harus meliputi:

# 1 Filosofi Database

Mengapa menggunakan Universal Item Model.

Perbedaan:

Retail POS

vs

Restaurant POS

vs

Inventory System

dan bagaimana semuanya disatukan.

--------------------------------------------------------

# 2 Universal Item

Jelaskan konsep bahwa semua barang adalah Item.

Jenis Item:

RAW_MATERIAL

FINISHED_PRODUCT

RECIPE_PRODUCT

SERVICE

NON_STOCK

Lengkapi contoh nyata.

--------------------------------------------------------

# 3 Inventory Model

Jelaskan bahwa stok tidak disimpan langsung.

Gunakan Stock Movement.

Movement Type:

Purchase

Sale

Recipe Usage

Adjustment

Transfer

Production

Return

Opening Balance

Stock Opname

Lengkapi flow diagram.

--------------------------------------------------------

# 4 Recipe / Bill Of Material

Jelaskan relasi:

Recipe

Recipe Detail

Item

Stock Movement

sertakan contoh Es Teh.

--------------------------------------------------------

# 5 Purchase Flow

Purchase

?

Purchase Detail

?

Stock Movement

?

Inventory

--------------------------------------------------------

# 6 Sales Flow

Sales

?

Sales Detail

?

Stock Movement

?

Inventory

?

Recipe Engine (jika Recipe Product)

--------------------------------------------------------

# 7 Pricing

Cost

Average Cost

Selling Price

Margin

Multi Price

--------------------------------------------------------

# 8 Multi Business Support

Retail

Cafe

Restaurant

Laundry

Service

jelaskan bagaimana semuanya memakai database yang sama.

--------------------------------------------------------

# 9 Scalability

Offline First

Cloud Sync

Multi Store

Warehouse

Future ERP

--------------------------------------------------------

# 10 Best Practice

Repository Pattern

Service Layer

Dexie

IndexedDB

Offline First

PWA

========================================================

Output berupa markdown profesional.

Minimal 400 baris.

Tambahkan diagram ASCII.

Tambahkan tabel.

Tambahkan contoh nyata.

Jangan membuat source code.

Dokumen ini akan menjadi referensi utama seluruh project.