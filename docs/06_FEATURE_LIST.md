# 06_FEATURE_LIST.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Pengembangan](#2-filosofi-pengembangan)
3. [Kategori Fitur](#3-kategori-fitur)
4. [Detail Fitur](#4-detail-fitur)
5. [Prioritas](#5-prioritas)
6. [MVP v1.0](#6-mvp-v10)
7. [Dependency Matrix](#7-dependency-matrix)
8. [User Role](#8-user-role)
9. [Estimasi Kompleksitas](#9-estimasi-kompleksitas)
10. [Status](#10-status)
11. [Feature Flow](#11-feature-flow)
12. [Non Functional Feature](#12-non-functional-feature)
13. [Future Feature](#13-future-feature)
14. [Feature Matrix](#14-feature-matrix)
15. [Acceptance Criteria](#15-acceptance-criteria)
16. [Out of Scope](#16-out-of-scope)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **daftar resmi** seluruh fitur aplikasi POS Offline PWA. Setiap fitur didefinisikan dengan prioritas, dependensi, status implementasi, target versi, dan role yang mengakses.

Dokumen ini menjadi acuan utama dalam menentukan urutan implementasi — membantu AI, developer, dan project manager memutuskan apa yang harus dikerjakan selanjutnya.

### 1.2 Siapa yang Membaca

| Role | Kegunaan |
|---|---|
| Developer | Mengetahui fitur yang harus diimplementasikan dan urutannya |
| Product Owner | Memantau progress dan prioritas |
| QA / Tester | Menyusun test case berdasarkan acceptance criteria |
| Project Manager | Mengatur resource dan timeline |

### 1.3 Acuan

Dokumen ini konsisten dengan:

- `01_PROJECT_BLUEPRINT.md` — Visi, arsitektur, roadmap
- `02_DATABASE_SCHEMA.md` — Entitas yang mendukung setiap fitur
- `03_BUSINESS_RULES.md` — Aturan bisnis yang mengatur fitur
- `04_UI_DESIGN_SYSTEM.md` — Desain UI untuk setiap fitur
- `05_COMPONENT_LIBRARY.md` — Komponen yang digunakan setiap fitur

---

## 2. Filosofi Pengembangan

### 2.1 MVP First

Fitur dibangun secara bertahap. Versi pertama (v1.0) hanya berisi fitur yang benar-benar esensial untuk operasi POS harian. Fitur kompleks ditunda ke versi berikutnya.

**Mengapa**: UMKM membutuhkan solusi yang cepat dan stabil. Fitur tambahan dapat ditambahkan setelah fondasi kokoh.

### 2.2 Modular

Setiap fitur adalah modul mandiri. Matikan atau hidupkan fitur tanpa mempengaruhi modul lain.

**Mengapa**: Memudahkan pengujian, memungkinkan konfigurasi per jenis usaha (toko vs cafe).

### 2.3 Incremental Development

Fitur besar dipecah menjadi sub-fitur kecil yang bisa dirilis secara independen. Setiap rilis menambah nilai tanpa menunggu fitur besar selesai.

**Mengapa**: Pengguna mendapatkan manfaat lebih cepat. Risiko lebih kecil.

### 2.4 Reusable

Fitur dibangun di atas service, repository, dan komponen yang sudah ada. Hindari duplikasi logika antar fitur.

**Mengapa**: Mengurangi duplikasi, mempercepat pengembangan, dan memudahkan pemeliharaan.

### 2.5 Maintainable

Setiap fitur memiliki batasan yang jelas. Kompleksitas dijaga minimum. Dokumentasi diperbarui saat fitur berubah.

**Mengapa**: Proyek akan dikelola oleh banyak developer dan AI dalam jangka panjang.

### 2.6 Offline First

Semua fitur harus berfungsi penuh tanpa koneksi internet. Konektivitas adalah opsional dan hanya untuk sinkronisasi (v2.0+).

**Mengapa**: Ini adalah nilai jual utama aplikasi. Pengguna di daerah dengan koneksi tidak stabil tidak boleh terhambat.

---

## 3. Kategori Fitur

### 3.1 Core System

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| CS-01 | Login | Auth | user |
| CS-02 | Lock Screen | Auth | user |
| CS-03 | User Management | Core | user |
| CS-04 | Role Management | Core | role, permission |
| CS-05 | Permission Management | Core | permission |
| CS-06 | Store Settings | Core | setting |
| CS-07 | Theme Toggle | Core | - |
| CS-08 | Backup Data | Core | backupMetadata |
| CS-09 | Restore Data | Core | - |
| CS-10 | Database Maintenance | Core | - |
| CS-11 | Audit Log | Core | auditLog, activityLog |
| CS-12 | Keyboard Shortcuts | Core | - |

### 3.2 Dashboard

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| DB-01 | KPI Cards | Dashboard | sale, product |
| DB-02 | Sales Summary | Dashboard | sale |
| DB-03 | Revenue Overview | Dashboard | sale, cashFlow |
| DB-04 | Profit Overview | Dashboard | sale, purchaseItem |
| DB-05 | Recent Transactions | Dashboard | sale |
| DB-06 | Low Stock Alert | Dashboard | inventory, product |
| DB-07 | Quick Actions | Dashboard | - |
| DB-08 | Sales Chart | Dashboard | sale |
| DB-09 | Activity Timeline | Dashboard | activityLog |

### 3.3 Master Data

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| MD-01 | Product Management | Master Data | product |
| MD-02 | Category Management | Master Data | category |
| MD-03 | Unit Management | Master Data | unit |
| MD-04 | Supplier Management | Master Data | supplier |
| MD-05 | Customer Management | Master Data | customer |
| MD-06 | Product Import/Export | Master Data | product |
| MD-07 | Barcode Label Print | Master Data | product |
| MD-08 | Price History | Master Data | auditLog |

### 3.4 Sales (POS)

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| SA-01 | POS Main Screen | Sales | - |
| SA-02 | Product Grid | Sales | product |
| SA-03 | Product Search | Sales | product |
| SA-04 | Barcode Scan | Sales | product |
| SA-05 | Cart Management | Sales | saleItem |
| SA-06 | Quantity Adjustment | Sales | saleItem |
| SA-07 | Discount Per Item | Sales | discount |
| SA-08 | Discount Per Transaction | Sales | discount |
| SA-09 | Voucher / Promo Code | Sales | voucher |
| SA-10 | Tax Calculation | Sales | tax |
| SA-11 | Payment (Cash) | Sales | payment |
| SA-12 | Payment (Non-Cash) | Sales | payment |
| SA-13 | QRIS Payment | Sales | payment |
| SA-14 | Mixed Payment | Sales | payment |
| SA-15 | Hold Transaction | Sales | sale |
| SA-16 | Invoice Generation | Sales | sale |
| SA-17 | Receipt Print | Sales | - |
| SA-18 | Reprint Receipt | Sales | sale |
| SA-19 | Void Transaction | Sales | sale |
| SA-20 | Refund Transaction | Sales | sale |

### 3.5 Purchase

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| PU-01 | Purchase Order | Purchase | purchase |
| PU-02 | Purchase Receive | Purchase | purchaseItem |
| PU-03 | Purchase History | Purchase | purchase |
| PU-04 | Supplier Ledger | Purchase | purchase |

### 3.6 Inventory

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| IN-01 | Stock Overview | Inventory | inventory |
| IN-02 | Stock Movement History | Inventory | stockMovement |
| IN-03 | Stock Adjustment | Inventory | stockAdjustment |
| IN-04 | Stock Opname | Inventory | stockOpname |
| IN-05 | Minimum Stock Alert | Inventory | inventory, product |

### 3.7 Finance

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| FI-01 | Shift Management | Finance | shift |
| FI-02 | Shift Opening | Finance | shift |
| FI-03 | Shift Closing | Finance | shift |
| FI-04 | Cash Flow | Finance | cashFlow |
| FI-05 | Expense Management | Finance | expense |
| FI-06 | Income Management | Finance | income |

### 3.8 Report

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| RP-01 | Sales Report | Report | sale |
| RP-02 | Purchase Report | Report | purchase |
| RP-03 | Profit Report | Report | sale, purchaseItem |
| RP-04 | Inventory Report | Report | inventory |
| RP-05 | Customer Report | Report | customer, sale |
| RP-06 | Supplier Report | Report | supplier, purchase |
| RP-07 | Cash Flow Report | Report | cashFlow |
| RP-08 | Shift Report | Report | shift, sale |
| RP-09 | Tax Report | Report | tax |
| RP-10 | Export PDF | Report | - |
| RP-11 | Export Excel | Report | - |

### 3.9 Cafe (v2.0)

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| CF-01 | Table Management | Cafe | table |
| CF-02 | Table Layout | Cafe | table |
| CF-03 | Dine-In Order | Cafe | sale |
| CF-04 | Kitchen Order | Cafe | kitchenOrder |
| CF-05 | Kitchen Display | Cafe | kitchenOrder |
| CF-06 | Reservation | Cafe | reservation |
| CF-07 | Split Bill | Cafe | sale |
| CF-08 | Merge Table | Cafe | table, sale |
| CF-09 | Take Away Order | Cafe | sale |

### 3.10 Loyalty (v2.0)

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| LY-01 | Membership Management | Loyalty | membership |
| LY-02 | Point Earning | Loyalty | loyaltyPoint |
| LY-03 | Point Redemption | Loyalty | loyaltyPoint |
| LY-04 | Tier Management | Loyalty | membership |
| LY-05 | Reward Catalog | Loyalty | - |

### 3.11 Utility

| # | Fitur | Modul | Entitas DB |
|---|---|---|---|
| UT-01 | Backup | Utility | backupMetadata |
| UT-02 | Restore | Utility | - |
| UT-03 | Export JSON | Utility | - |
| UT-04 | Import JSON | Utility | - |
| UT-05 | Database Info | Utility | - |
| UT-06 | Storage Info | Utility | - |
| UT-07 | Activity Log Viewer | Utility | activityLog |
| UT-08 | Audit Log Viewer | Utility | auditLog |

---

## 4. Detail Fitur

### 4.1 Core System

---

#### CS-01: Login

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Login |
| **Tujuan** | Mengotentikasi pengguna sebelum mengakses aplikasi |
| **Deskripsi** | Form login dengan username dan password. Validasi kredensial terhadap data user di IndexedDB. Session token (JWT) disimpan di sessionStorage. Auto-redirect ke halaman utama setelah sukses |
| **Manfaat** | Keamanan data toko. Hanya pengguna terotorisasi yang bisa mengakses |
| **Pengguna** | Admin, Kasir, Manager, Owner |
| **Modul terkait** | Core, User |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | User Management (CS-03), Role Management (CS-04) |
| **Risiko** | Rendah — autentikasi lokal, tidak ada jaringan |
| **Catatan** | Password di-hash dengan SHA-256. JWT expire 24 jam. Lock screen setelah idle 5 menit |

---

#### CS-02: Lock Screen

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Lock Screen |
| **Tujuan** | Mengamankan aplikasi saat ditinggalkan |
| **Deskripsi** | Setelah idle 5 menit, aplikasi otomatis mengunci dan menampilkan layar lock. Membutuhkan PIN user yang sedang login untuk membuka |
| **Manfaat** | Mencegah akses tidak sah saat kasir meninggalkan POS |
| **Pengguna** | Semua role |
| **Modul terkait** | Core, Login |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Login (CS-01), User Management (CS-03) |
| **Risiko** | Rendah |
| **Catatan** | PIN 6 digit. Bisa dilewati di pengaturan (untuk toko kecil) |

---

#### CS-03: User Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | User Management |
| **Tujuan** | CRUD pengguna aplikasi |
| **Deskripsi** | Membuat, mengedit, menonaktifkan pengguna. Atur username, password, fullname, role. Username tidak bisa diubah setelah dibuat. Password harus min 6 karakter kombinasi huruf dan angka |
| **Manfaat** | Kontrol akses pengguna ke aplikasi |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Role |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Role Management (CS-04) |
| **Risiko** | Rendah |
| **Catatan** | Minimal 1 user Admin harus selalu aktif. Soft delete (nonaktifkan, bukan hapus) |

---

#### CS-04: Role Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Role Management |
| **Tujuan** | Mengelola grup pengguna |
| **Deskripsi** | CRUD role. Role sistem (Admin) tidak bisa diubah/dihapus. Setiap role memiliki sort order untuk tampilan |
| **Manfaat** | Mengelompokkan pengguna berdasarkan akses |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Permission, User |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Role default: Admin, Cashier, Manager, Owner |

---

#### CS-05: Permission Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Permission Management |
| **Tujuan** | Mengatur hak akses per role per modul |
| **Deskripsi** | Matriks permission: modul x action (create, read, update, delete). Setiap role memiliki set permission yang bisa diaktifkan/nonaktifkan |
| **Manfaat** | Keamanan berbasis RBAC |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Role |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Role Management (CS-04) |
| **Risiko** | Rendah |
| **Catatan** | Default: Admin dapat semua. Role baru tidak memiliki permission sampai diatur |

---

#### CS-06: Store Settings

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Store Settings |
| **Tujuan** | Konfigurasi toko dan aplikasi |
| **Deskripsi** | Kelola pengaturan: nama toko, alamat, telepon, pajak default, metode bayar default, enable/disable fitur (shift, loyalty, cafe), max item per transaksi, allow negative stock |
| **Manfaat** | Fleksibilitas konfigurasi tanpa mengubah kode |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Sales, Inventory |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Setting disimpan di tabel `settings` dengan format key-value. Beberapa setting mempengaruhi business rules |

---

#### CS-07: Theme Toggle

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Theme Toggle |
| **Tujuan** | Beralih antara tema terang dan gelap |
| **Deskripsi** | Tombol toggle di topbar untuk beralih light/dark mode. Preferensi disimpan di localStorage |
| **Manfaat** | Kenyamanan pengguna di berbagai kondisi pencahayaan |
| **Pengguna** | Semua role |
| **Modul terkait** | Core |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Mengubah CSS variables. Dark mode default saat sistem dalam mode gelap |

---

#### CS-08: Backup Data

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Backup Data |
| **Tujuan** | Ekspor seluruh data ke file JSON |
| **Deskripsi** | Backup semua data di IndexedDB ke file JSON dengan checksum SHA-256 dan schema version. Backup bisa manual atau otomatis setiap 6 jam. File bisa dienkripsi dengan password |
| **Manfaat** | Keamanan data. Pemulihan jika perangkat rusak |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Restore |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Database Maintenance (CS-10) |
| **Risiko** | Rendah |
| **Catatan** | Riwayat backup disimpan di BackupMetadata. Maks 10 backup terakhir |

---

#### CS-09: Restore Data

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Restore Data |
| **Tujuan** | Mengembalikan data dari file backup |
| **Deskripsi** | Upload file backup JSON. Validasi format, checksum, schema version. Auto-backup sebelum restore. Konfirmasi dua langkah. Progress bar selama proses |
| **Manfaat** | Pemulihan data setelah kerusakan atau penggantian perangkat |
| **Pengguna** | Admin |
| **Modul terkait** | Core, Backup |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Backup Data (CS-08) |
| **Risiko** | Sedang — risiko kehilangan data jika dibatalkan di tengah jalan. Auto-backup mengurangi risiko |
| **Catatan** | Hanya bisa restore dari file yang valid. Konfirmasi wajib |

---

#### CS-10: Database Maintenance

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Database Maintenance |
| **Tujuan** | Informasi dan perawatan database |
| **Deskripsi** | Menampilkan versi DB, jumlah record per tabel, ukuran database. Tombol untuk compact database (IndexedDB), hapus data lama (activity log > 30 hari) |
| **Manfaat** | Menjaga performa database |
| **Pengguna** | Admin |
| **Modul terkait** | Core |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Housekeeping otomatis untuk audit/activity log |

---

#### CS-11: Audit Log

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Audit Log |
| **Tujuan** | Mencatat perubahan kritis untuk keperluan audit |
| **Deskripsi** | Setiap create/update/delete data kritis (user, produk, transaksi) dicatat di auditLog: siapa, kapan, aksi, entitas, perubahan (JSON diff) |
| **Manfaat** | Transparansi dan akuntabilitas |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Core, Semua modul |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | User Management (CS-03) |
| **Risiko** | Rendah |
| **Catatan** | Tidak bisa dihapus oleh user. Hanya housekeeping otomatis |

---

#### CS-12: Keyboard Shortcuts

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Keyboard Shortcuts |
| **Tujuan** | Mempercepat navigasi dan aksi dengan keyboard |
| **Deskripsi** | F1: POS, F2: Search, F4: Bayar, Ctrl+K: Pencarian global. Tampilkan daftar shortcut dengan tombol ? |
| **Manfaat** | Efisiensi kasir. Mengurangi ketergantungan mouse |
| **Pengguna** | Semua role |
| **Modul terkait** | Core, Sales |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Shortcut bisa dikustomisasi di pengaturan (v2.0) |

---

### 4.2 Dashboard

---

#### DB-01: KPI Cards

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | KPI Cards |
| **Tujuan** | Menampilkan indikator utama bisnis |
| **Deskripsi** | Kartu statistik: Penjualan Hari Ini, Jumlah Transaksi, Produk Terjual, Rata-rata Transaksi. Setiap card memiliki icon, label, nilai, dan perubahan persentase |
| **Manfaat** | Pemilik dan kasir melihat kinerja bisnis secara real-time |
| **Pengguna** | Semua role |
| **Modul terkait** | Dashboard, Report |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Data dari sale hari ini. Refresh otomatis setiap transaksi |

---

#### DB-02: Sales Summary

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Sales Summary |
| **Tujuan** | Ringkasan penjualan komprehensif |
| **Deskripsi** | Total penjualan, total diskon, total pajak, total bersih. Ditampilkan dalam card atau baris terpisah |
| **Manfaat** | Overview penjualan harian |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Dashboard, Sales |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Bisa difilter per hari, minggu, bulan |

---

#### DB-03: Revenue Overview

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Revenue Overview |
| **Tujuan** | Gambaran pendapatan |
| **Deskripsi** | Total pendapatan periode ini vs periode sebelumnya. Indikator naik/turun |
| **Manfaat** | Memantau tren pendapatan |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Dashboard, Finance |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Perbandingan dengan periode sebelumnya |

---

#### DB-04: Profit Overview

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Profit Overview |
| **Tujuan** | Menampilkan laba kotor |
| **Deskripsi** | Laba = (harga jual - harga beli) * quantity terjual. Ditampilkan per hari/bulan |
| **Manfaat** | Memahami margin keuntungan |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Dashboard, Report, Sales, Purchase |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Sales, Purchase |
| **Risiko** | Sedang — membutuhkan data buyPrice yang akurat |
| **Catatan** | Laba kotor (belum dikurangi expense) |

---

#### DB-05: Recent Transactions

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Recent Transactions |
| **Tujuan** | Menampilkan transaksi terbaru |
| **Deskripsi** | Daftar 10 transaksi terakhir: invoice, customer, total, status, waktu. Klik untuk detail |
| **Manfaat** | Monitoring transaksi real-time |
| **Pengguna** | Semua role |
| **Modul terkait** | Dashboard, Sales |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Refresh setiap transaksi baru |

---

#### DB-06: Low Stock Alert

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Low Stock Alert |
| **Tujuan** | Peringatan stok menipis |
| **Deskripsi** | Menampilkan produk dengan stok <= minStock. Urut dari stok paling kritis. Warna merah untuk stok 0 |
| **Manfaat** | Mencegah kehabisan stok |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Dashboard, Inventory |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Inventory (IN-01), Product (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Notifikasi juga muncul saat stok menipis di POS |

---

#### DB-07: Quick Actions

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Quick Actions |
| **Tujuan** | Akses cepat ke fitur utama |
| **Deskripsi** | Grid tombol: Buka POS, Tambah Produk, Laporan, Backup, Pengaturan |
| **Manfaat** | Navigasi cepat ke fitur yang sering digunakan |
| **Pengguna** | Semua role |
| **Modul terkait** | Dashboard |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Icon + label. 2x3 grid |

---

#### DB-08: Sales Chart

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Sales Chart |
| **Tujuan** | Visual tren penjualan |
| **Deskripsi** | Bar chart penjualan 7/30/90 hari terakhir. Line chart tren. Pie chart metode pembayaran |
| **Manfaat** | Analisis visual tren bisnis |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Dashboard, Report |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Gunakan Chart.js. Filter periode |

---

#### DB-09: Activity Timeline

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Activity Timeline |
| **Tujuan** | Riwayat aktivitas terkini |
| **Deskripsi** | Timeline aktivitas: produk ditambahkan, backup dilakukan, shift ditutup. Icon + deskripsi + timestamp |
| **Manfaat** | Memonitor aktivitas sistem |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Dashboard, Core |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Activity Log (CS-11) |
| **Risiko** | Rendah |
| **Catatan** | Maks 10 aktivitas terbaru |

---

### 4.3 Master Data

---

#### MD-01: Product Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Product Management |
| **Tujuan** | CRUD produk |
| **Deskripsi** | Tambah, edit, duplikasi, nonaktifkan produk. Field: SKU (unique), barcode (unique opsional), name, category, unit, buyPrice, sellPrice, minStock, type (product/service), isActive |
| **Manfaat** | Data produk yang akurat untuk transaksi dan stok |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Inventory, Sales |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Category (MD-02), Unit (MD-03) |
| **Risiko** | Rendah |
| **Catatan** | SKU tidak bisa diubah setelah dibuat. Service type tidak memiliki stok |

---

#### MD-02: Category Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Category Management |
| **Tujuan** | CRUD kategori produk |
| **Deskripsi** | Kategori dengan parent-child (maks 3 level). Sort order. Tidak bisa dihapus jika memiliki produk aktif |
| **Manfaat** | Pengelompokan produk untuk kemudahan pencarian dan laporan |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Product |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Root category minimal 1. Depth maks 3 level |

---

#### MD-03: Unit Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Unit Management |
| **Tujuan** | CRUD satuan produk |
| **Deskripsi** | Tambah, edit, nonaktifkan unit: name (Pieces, Kg, Liter), abbreviation (Pcs, Kg, L) |
| **Manfaat** | Standarisasi satuan produk |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Product |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Unit dengan produk terakit tidak bisa dihapus |

---

#### MD-04: Supplier Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Supplier Management |
| **Tujuan** | CRUD data pemasok |
| **Deskripsi** | Tambah, edit, nonaktifkan supplier: code, name, phone, address |
| **Manfaat** | Data pemasok untuk pembelian |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Purchase |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Opsional — bisa bertransaksi tanpa supplier |

---

#### MD-05: Customer Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Customer Management |
| **Tujuan** | CRUD data pelanggan |
| **Deskripsi** | Tambah, edit, nonaktifkan pelanggan: name, phone, totalVisits, totalSpent, isMember. Deteksi duplikasi berdasarkan phone |
| **Manfaat** | Data pelanggan untuk laporan dan loyalitas |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Master Data, Sales, Loyalty |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Tidak ada |
| **Risiko** | Rendah |
| **Catatan** | Transaksi bisa tanpa pelanggan (anonim) |

---

#### MD-06: Product Import/Export

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Product Import/Export |
| **Tujuan** | Import/export produk via file Excel |
| **Deskripsi** | Export produk ke XLSX. Import dari XLSX dengan validasi SKU duplikat, barcode duplikat. Rollback jika ada error |
| **Manfaat** | Memudahkan migrasi data dari sistem lain |
| **Pengguna** | Admin |
| **Modul terkait** | Master Data, Product |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Product Management (MD-01) |
| **Risiko** | Sedang — validasi data penting |
| **Catatan** | Template Excel disediakan. Gunakan SheetJS |

---

#### MD-07: Barcode Label Print

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Barcode Label Print |
| **Tujuan** | Cetak label barcode produk |
| **Deskripsi** | Pilih produk, atur jumlah label, cetak. Format label: nama produk, harga, barcode |
| **Manfaat** | Memudahkan pelabelan produk |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Product |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Product Management (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Menggunakan library barcode generator |

---

#### MD-08: Price History

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Price History |
| **Tujuan** | Riwayat perubahan harga produk |
| **Deskripsi** | Menampilkan history harga beli dan jual dari auditLog |
| **Manfaat** | Transparansi perubahan harga |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Master Data, Core (Audit) |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Product Management (MD-01), Audit Log (CS-11) |
| **Risiko** | Rendah |
| **Catatan** | Data dari auditLog.changes |

---

### 4.4 Sales (POS)

---

#### SA-01: POS Main Screen

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | POS Main Screen |
| **Tujuan** | Antarmuka utama transaksi penjualan |
| **Deskripsi** | Layout dua panel: kiri (product grid + search) dan kanan (cart + total). Produk bisa dicari, difilter per kategori, dan ditambahkan ke cart |
| **Manfaat** | Inti aplikasi — kasir melakukan transaksi sehari-hari |
| **Pengguna** | Kasir, Admin, Manager |
| **Modul terkait** | Sales, Inventory, Customer, Payment |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Product (MD-01), Customer (MD-05), Inventory (IN-01) |
| **Risiko** | Tinggi — fitur paling kompleks dan paling sering digunakan |
| **Catatan** | Landing page setelah login. Keyboard shortcut: F1 |

---

#### SA-02: Product Grid

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Product Grid |
| **Tujuan** | Menampilkan produk yang bisa dipilih |
| **Deskripsi** | Grid card produk: thumbnail (jika ada), nama, harga, stok. Produk nonaktif dan stok habis disembunyikan/dinonaktifkan |
| **Manfaat** | Kasir melihat dan memilih produk dengan cepat |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Product |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Product (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Klik = tambah 1 ke cart. 3-4 kolom di desktop |

---

#### SA-03: Product Search

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Product Search |
| **Tujuan** | Pencarian cepat produk |
| **Deskripsi** | Search box dengan debounce 300ms. Cari berdasarkan nama, SKU, barcode. Filter hasil grid secara real-time |
| **Manfaat** | Kasir menemukan produk tanpa scrolling |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Product |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Product (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Fokus otomatis saat POS dibuka. Ikon scan di kanan |

---

#### SA-04: Barcode Scan

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Barcode Scan |
| **Tujuan** | Menambahkan produk dengan scan barcode |
| **Deskripsi** | Mode hardware: input barcode dari scanner USB langsung mencari produk. Mode kamera: buka kamera, deteksi barcode 1D/2D |
| **Manfaat** | Mempercepat input produk — tidak perlu mencari manual |
| **Pengguna** | Kasir |
| **Modul terkait** | Sales, Product |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Product (MD-01) |
| **Risiko** | Sedang — library scanner mungkin tidak kompatibel di semua browser |
| **Catatan** | Gunakan QuaggaJS untuk barcode 1D. Fallback ke search jika kamera tidak tersedia |

---

#### SA-05: Cart Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Cart Management |
| **Tujuan** | Mengelola item dalam keranjang |
| **Deskripsi** | Tambah, hapus, ubah quantity item di cart. Menampilkan subtotal per item. Scrollable jika banyak item |
| **Manfaat** | Kasir mengontrol item sebelum pembayaran |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | POS Main Screen (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Cart kosong = tombol bayar disabled |

---

#### SA-06: Quantity Adjustment

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Quantity Adjustment |
| **Tujuan** | Mengubah jumlah barang di cart |
| **Deskripsi** | Tombol +/- untuk adjust quantity. Bisa tap angka untuk input manual. Min 1, Max sesuai setting. Cek stok tersedia |
| **Manfaat** | Kasir mengatur jumlah barang yang dibeli |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Inventory |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Stok dicek setiap perubahan quantity |

---

#### SA-07: Discount Per Item

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Discount Per Item |
| **Tujuan** | Memberikan diskon pada item tertentu |
| **Deskripsi** | Pilih item, atur diskon persentase (0-100%) atau nominal. Nilai diskon tidak boleh > harga item |
| **Manfaat** | Fleksibilitas diskon untuk situasi tertentu |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Sales, Discount |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Tercatat siapa yang memberi diskon (audit) |

---

#### SA-08: Discount Per Transaction

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Discount Per Transaction |
| **Tujuan** | Diskon untuk seluruh transaksi |
| **Deskripsi** | Diskon diterapkan ke subtotal sebelum pajak. Bisa persentase atau nominal |
| **Manfaat** | Diskon umum untuk promosi |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Sales, Discount |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Bisa dikombinasikan dengan diskon item |

---

#### SA-09: Voucher / Promo Code

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Voucher / Promo Code |
| **Tujuan** | Menggunakan kode promo |
| **Deskripsi** | Input kode voucher. Validasi: masa berlaku, usage limit, min purchase. Diskon diterapkan ke transaksi |
| **Manfaat** | Program promosi terstruktur |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Voucher |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Discount (SA-08) |
| **Risiko** | Rendah |
| **Catatan** | Kode unik, bisa percentage atau fixed |

---

#### SA-10: Tax Calculation

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Tax Calculation |
| **Tujuan** | Menghitung pajak transaksi |
| **Deskripsi** | Ambil tarif pajak dari setting. Hitung pajak dari subtotal setelah diskon. Dukungan multiple tax. Produk tertentu bisa tax-exempt |
| **Manfaat** | Kepatuhan pajak |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Tax |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Setting (CS-06) |
| **Risiko** | Rendah |
| **Catatan** | Pajak di-snapshot saat transaksi (tidak berubah walau tarif pajak berubah) |

---

#### SA-11: Payment (Cash)

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Payment (Cash) |
| **Tujuan** | Pembayaran tunai |
| **Deskripsi** | Input jumlah uang, hitung kembalian otomatis. Jika uang kurang, tampilkan pesan error |
| **Manfaat** | Metode pembayaran paling umum |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Payment |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Hitung kembalian real-time saat input angka |

---

#### SA-12: Payment (Non-Cash)

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Payment (Non-Cash) |
| **Tujuan** | Pembayaran non-tunai |
| **Deskripsi** | Pilih metode: TRANSFER, DEBIT, CREDIT. Jumlah = grand total. Input reference number opsional |
| **Manfaat** | Fleksibilitas metode bayar |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Payment |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Non-cash bisa dikombinasikan dengan cash (mixed) |

---

#### SA-13: QRIS Payment

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | QRIS Payment |
| **Tujuan** | Pembayaran via QRIS |
| **Deskripsi** | Generate QR code dari data pembayaran. Pelanggan scan dengan e-wallet. Tunggu konfirmasi (manual) |
| **Manfaat** | Mengakomodasi tren pembayaran digital |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Payment |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Payment (SA-12) |
| **Risiko** | Sedang — integrasi QRIS tergantung pada penyedia payment gateway (akan disimulasikan offline) |
| **Catatan** | QRIS statis atau dinamis. Untuk offline: gunakan QR statis |

---

#### SA-14: Mixed Payment

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Mixed Payment |
| **Tujuan** | Pembayaran dengan kombinasi metode |
| **Deskripsi** | Bagi total ke beberapa metode (contoh: Cash Rp50,000 + QRIS sisanya). Total semua payment = grand total |
| **Manfaat** | Fleksibilitas saat pelanggan tidak punya uang tunai cukup |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales, Payment |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Payment (SA-11, SA-12) |
| **Risiko** | Rendah |
| **Catatan** | Minimal 2 metode |

---

#### SA-15: Hold Transaction

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Hold Transaction |
| **Tujuan** | Menunda transaksi tanpa kehilangan data |
| **Deskripsi** | Simpan transaksi sebagai HOLD. Item di cart tidak mengurangi stok. Bisa di-resume nanti |
| **Manfaat** | Mengatasi situasi di mana pelanggan menunggu sesuatu (pesanan tambahan) |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Cart (SA-05) |
| **Risiko** | Rendah |
| **Catatan** | Shift bisa ditutup meski ada HOLD. Notifikasi untuk resume |

---

#### SA-16: Invoice Generation

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Invoice Generation |
| **Tujuan** | Membuat nomor invoice |
| **Deskripsi** | Auto-generate nomor invoice: INV-YYYYMMDD-XXXX. Sequential per hari. Tidak bisa diubah setelah PAID |
| **Manfaat** | Nomor transaksi unik untuk referensi |
| **Pengguna** | Sistem |
| **Modul terkait** | Sales |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Payment success |
| **Risiko** | Rendah |
| **Catatan** | Format bisa dikustomisasi di pengaturan |

---

#### SA-17: Receipt Print

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Receipt Print |
| **Tujuan** | Mencetak struk transaksi |
| **Deskripsi** | Preview struk: toko, invoice, item, total, metode bayar, kembalian. Cetak via browser print atau printer thermal (jika terhubung) |
| **Manfaat** | Bukti transaksi untuk pelanggan |
| **Pengguna** | Semua role (POS) |
| **Modul terkait** | Sales |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Invoice (SA-16) |
| **Risiko** | Sedang — browser print vs printer thermal membutuhkan penanganan berbeda |
| **Catatan** | Font mono. Format lebar terbatas (thermal). Opsi cetak otomatis setelah bayar |

---

#### SA-18: Reprint Receipt

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Reprint Receipt |
| **Tujuan** | Cetak ulang struk |
| **Deskripsi** | Cari transaksi yang sudah PAID. Cetak ulang struk. Tersedia dalam 7 hari |
| **Manfaat** | Mengganti struk yang hilang |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Sales |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Receipt (SA-17) |
| **Risiko** | Rendah |
| **Catatan** | Struk reprint memiliki watermark "COPY" |

---

#### SA-19: Void Transaction

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Void Transaction |
| **Tujuan** | Membatalkan transaksi yang sudah PAID |
| **Deskripsi** | Void hanya untuk transaksi PAID. Wajib alasan. Stok dikembalikan ke inventory. Dicatat di auditLog |
| **Manfaat** | Membatalkan transaksi yang salah |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Sales, Inventory, Audit |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01), Inventory (IN-01) |
| **Risiko** | Sedang — mempengaruhi stok, laporan, dan kas |
| **Catatan** | Void tidak bisa dibatalkan. Nomor invoice tetap ada (status VOID) |

---

#### SA-20: Refund Transaction

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Refund Transaction |
| **Tujuan** | Mengembalikan barang dan uang |
| **Deskripsi** | Pilih satu atau beberapa item dari transaksi PAID. Kembalikan stok. Catat refund di payment. Bisa full atau partial refund |
| **Manfaat** | Menangani retur barang |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Sales, Inventory, Payment |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Void (SA-19) |
| **Risiko** | Tinggi — melibatkan perhitungan uang dan stok yang kompleks |
| **Catatan** | Partial refund lebih kompleks. v1.0 hanya full refund |

---

### 4.5 Purchase

---

#### PU-01: Purchase Order

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Purchase Order |
| **Tujuan** | Membuat pesanan pembelian |
| **Deskripsi** | Buat PO dengan supplier, items (produk + quantity + harga). Status: DRAFT > ORDERED > RECEIVED > COMPLETED > CANCELLED. PO Number auto-generated |
| **Manfaat** | Mencatat pembelian barang dari supplier |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Purchase, Inventory, Supplier |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Product (MD-01), Supplier (MD-04) |
| **Risiko** | Sedang — melibatkan perubahan stok |
| **Catatan** | DRAFT bisa diedit. ORDERED tidak bisa diedit. CANCELLED hanya dari DRAFT/ORDERED |

---

#### PU-02: Purchase Receive

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Purchase Receive |
| **Tujuan** | Menerima barang dari PO |
| **Deskripsi** | Input receivedQuantity per item (<= quantity). Status berubah ke RECEIVED. Stok bertambah sesuai receivedQuantity |
| **Manfaat** | Mencatat barang yang benar-benar diterima |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Purchase, Inventory |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Purchase Order (PU-01) |
| **Risiko** | Rendah |
| **Catatan** | Partial receive diperbolehkan |

---

#### PU-03: Purchase History

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Purchase History |
| **Tujuan** | Riwayat pembelian |
| **Deskripsi** | Daftar semua PO: nomor, supplier, tanggal, total, status. Filter by range, supplier, status |
| **Manfaat** | Monitoring pembelian |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Purchase, Report |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Purchase Order (PU-01) |
| **Risiko** | Rendah |
| **Catatan** | Bisa export ke Excel |

---

#### PU-04: Supplier Ledger

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Supplier Ledger |
| **Tujuan** | Riwayat transaksi per supplier |
| **Deskripsi** | Tampilkan semua PO per supplier: jumlah PO, total pembelian, status terakhir |
| **Manfaat** | Evaluasi kinerja supplier |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Purchase, Supplier |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Purchase History (PU-03) |
| **Risiko** | Rendah |
| **Catatan** | Opsional |

---

### 4.6 Inventory

---

#### IN-01: Stock Overview

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Stock Overview |
| **Tujuan** | Melihat stok semua produk |
| **Deskripsi** | Tabel stok: produk, SKU, stok terkini, min stok, status (OK / MENIPIS / HABIS). Filter by kategori, status |
| **Manfaat** | Monitoring stok real-time |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Inventory, Product |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Product (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Stok = quantity di inventory. Service tidak memiliki stok |

---

#### IN-02: Stock Movement History

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Stock Movement History |
| **Tujuan** | Riwayat pergerakan stok per produk |
| **Deskripsi** | Tabel: tanggal, tipe (IN/OUT/SALE/PURCHASE/ADJUSTMENT), quantity before/change/after, referensi (sale/PO), pelaku |
| **Manfaat** | Audit trail stok |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Inventory, Audit |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Product (MD-01) |
| **Risiko** | Rendah |
| **Catatan** | Read-only. Setiap perubahan stok tercatat otomatis |

---

#### IN-03: Stock Adjustment

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Stock Adjustment |
| **Tujuan** | Menyesuaikan stok secara manual |
| **Deskripsi** | Pilih produk, input tipe (IN/OUT), quantity, alasan (damage/loss/correction). Stok berubah. Tercatat di StockMovement |
| **Manfaat** | Koreksi stok jika ada selisih |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Inventory |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Stock Overview (IN-01) |
| **Risiko** | Sedang — mempengaruhi stok dan laporan |
| **Catatan** | Wajib alasan. Dicatat di auditLog |

---

#### IN-04: Stock Opname

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Stock Opname |
| **Tujuan** | Siklus opname stok periodik |
| **Deskripsi** | Buat opname (DRAFT). Input actualQuantity per produk. Sistem hitung selisih vs systemQuantity. APPLIED = adjustment otomatis |
| **Manfaat** | Memastikan data stok akurat |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Inventory |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Stock Adjustment (IN-03) |
| **Risiko** | Sedang — besar data, perlu performa |
| **Catatan** | Status: DRAFT > IN_PROGRESS > COMPLETED > APPLIED. APPLIED tidak bisa diubah |

---

#### IN-05: Minimum Stock Alert

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Minimum Stock Alert |
| **Tujuan** | Notifikasi stok menipis |
| **Deskripsi** | Cek produk dengan quantity <= minStock. Tampilkan alert di dashboard, POS, dan halaman stok. Update real-time |
| **Manfaat** | Mencegah out-of-stock |
| **Pengguna** | Semua role |
| **Modul terkait** | Inventory, Dashboard |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Stock Overview (IN-01) |
| **Risiko** | Rendah |
| **Catatan** | Warna: kuning (menipis), merah (habis) |

---

### 4.7 Finance

---

#### FI-01: Shift Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Shift Management |
| **Tujuan** | Mengelola shift kasir |
| **Deskripsi** | Buka shift dengan modal awal. Tutup shift dengan hitung expected vs actual. Catat selisih. Satu shift aktif per user |
| **Manfaat** | Akuntabilitas kasir per shift |
| **Pengguna** | Admin, Manager, Kasir |
| **Modul terkait** | Finance, Sales |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | User (CS-03) |
| **Risiko** | Rendah |
| **Catatan** | Shift wajib untuk transaksi. Multi shift per hari diperbolehkan |

---

#### FI-02: Shift Opening

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Shift Opening |
| **Tujuan** | Membuka shift baru |
| **Deskripsi** | Input opening balance (uang tunai awal). Sistem generate shift number SFT-YYYYMMDD-XXXX. Shift status = OPEN |
| **Manfaat** | Mencatat awal shift |
| **Pengguna** | Kasir, Admin, Manager |
| **Modul terkait** | Finance, Shift |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Shift Management (FI-01) |
| **Risiko** | Rendah |
| **Catatan** | Tidak bisa buka shift baru jika masih ada shift OPEN |

---

#### FI-03: Shift Closing

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Shift Closing |
| **Tujuan** | Menutup shift dan rekonsiliasi |
| **Deskripsi** | Kasir input closing balance (uang tunai akhir). Sistem hitung expected balance dari transaksi cash + opening. Selisih dicatat. Status = CLOSED |
| **Manfaat** | Rekonsiliasi kas per shift |
| **Pengguna** | Kasir, Admin, Manager |
| **Modul terkait** | Finance, Shift, Cash Flow |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Shift Opening (FI-02) |
| **Risiko** | Sedang — selisih mempengaruhi Cash Flow |
| **Catatan** | Selisih dicatat sebagai adjustment di Cash Flow |

---

#### FI-04: Cash Flow

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Cash Flow |
| **Tujuan** | Mencatat arus kas |
| **Deskripsi** | Setiap transaksi tunai dan non-tunai dicatat di cashFlow: tipe (IN/OUT), kategori, jumlah, shift, user. Read-only setelah dicatat |
| **Manfaat** | Buku kas yang akurat |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Finance, Sales, Expense, Income |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Shift (FI-01), Expense (FI-05), Income (FI-06) |
| **Risiko** | Rendah |
| **Catatan** | Tidak bisa dihapus. Hanya adjustment via Stock Adjustment |

---

#### FI-05: Expense Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Expense Management |
| **Tujuan** | Mencatat pengeluaran |
| **Deskripsi** | Input expense: category (UTILITY/RENT/SALARY/SUPPLIES/OTHER), amount, notes. Number auto-generated EXP-YYYYMMDD-XXXX |
| **Manfaat** | Mencatat biaya operasional |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Finance, Cash Flow |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Cash Flow (FI-04) |
| **Risiko** | Rendah |
| **Catatan** | Expense mengurangi kas (OUT) |

---

#### FI-06: Income Management

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Income Management |
| **Tujuan** | Mencatat pemasukan non-penjualan |
| **Deskripsi** | Input income: category (OTHER_SERVICE/INVESTMENT/OTHER), amount, notes. Number auto-generated INC-YYYYMMDD-XXXX |
| **Manfaat** | Mencatat pemasukan selain penjualan |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Finance, Cash Flow |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Cash Flow (FI-04) |
| **Risiko** | Rendah |
| **Catatan** | Income menambah kas (IN) |

---

### 4.8 Report

---

#### RP-01: Sales Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Sales Report |
| **Tujuan** | Laporan penjualan |
| **Deskripsi** | Filter date range. Tabel: tanggal, invoice, customer, items count, subtotal, diskon, pajak, grand total, metode bayar, kasir. Summary: total transaksi, total nominal |
| **Manfaat** | Analisis penjualan |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Report, Sales |
| **Prioritas** | Critical |
| **Status** | Planned |
| **Dependensi** | Sales (SA-01) |
| **Risiko** | Rendah |
| **Catatan** | Export ke Excel/PDF |

---

#### RP-02: Purchase Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Purchase Report |
| **Tujuan** | Laporan pembelian |
| **Deskripsi** | Filter date range, supplier. Tabel: PO, tanggal, supplier, items, total |
| **Manfaat** | Monitoring pengeluaran pembelian |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report, Purchase |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Purchase (PU-01) |
| **Risiko** | Rendah |
| **Catatan** | Export ke Excel/PDF |

---

#### RP-03: Profit Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Profit Report |
| **Tujuan** | Laporan laba rugi |
| **Deskripsi** | Revenue (total penjualan) - COGS (harga beli barang terjual) = Gross Profit. Filter periode |
| **Manfaat** | Memahami profitabilitas |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Report, Sales, Purchase, Finance |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Sales Report (RP-01), Inventory (IN-01) |
| **Risiko** | Sedang — akurasi tergantung buyPrice |
| **Catatan** | Laba kotor. Belum termasuk expense |

---

#### RP-04: Inventory Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Inventory Report |
| **Tujuan** | Laporan stok |
| **Deskripsi** | Daftar semua produk: SKU, nama, stok, min stok, status, nilai stok (buyPrice * qty). Filter by kategori, status. Export |
| **Manfaat** | Valuasi stok |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report, Inventory |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Stock Overview (IN-01) |
| **Risiko** | Rendah |
| **Catatan** | Nilai stok berdasarkan harga beli |

---

#### RP-05: Customer Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Customer Report |
| **Tujuan** | Laporan pelanggan |
| **Deskripsi** | Daftar pelanggan: nama, telepon, total transaksi, total belanja, last visit, status member |
| **Manfaat** | Analisis basis pelanggan |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Report, Customer |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Customer (MD-05) |
| **Risiko** | Rendah |
| **Catatan** | Top customers berdasarkan total belanja |

---

#### RP-06: Supplier Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Supplier Report |
| **Tujuan** | Laporan supplier |
| **Deskripsi** | Daftar supplier: nama, total PO, total pembelian, status |
| **Manfaat** | Evaluasi supplier |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report, Supplier |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Supplier (MD-04), Purchase (PU-01) |
| **Risiko** | Rendah |
| **Catatan** | Opsional |

---

#### RP-07: Cash Flow Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Cash Flow Report |
| **Tujuan** | Laporan arus kas |
| **Deskripsi** | Filter date range. Tabel: tanggal, tipe (IN/OUT), kategori, jumlah, shift, user. Summary: total IN, total OUT, balance |
| **Manfaat** | Transparansi keuangan |
| **Pengguna** | Admin, Manager, Owner |
| **Modul terkait** | Report, Finance |
| **Prioritas** | High |
| **Status** | Planned |
| **Dependensi** | Cash Flow (FI-04) |
| **Risiko** | Rendah |
| **Catatan** | Export ke Excel |

---

#### RP-08: Shift Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Shift Report |
| **Tujuan** | Laporan rekap shift |
| **Deskripsi** | Tabel: shift number, kasir, jam buka/tutup, opening, expected, closing, selisih, total transaksi, total penjualan |
| **Manfaat** | Rekonsiliasi shift |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report, Finance, Shift |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Shift (FI-01) |
| **Risiko** | Rendah |
| **Catatan** | Filter date range |

---

#### RP-09: Tax Report

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Tax Report |
| **Tujuan** | Laporan pajak |
| **Deskripsi** | Total pajak per periode. Breakdown per tarif pajak. Export untuk SPT |
| **Manfaat** | Kepatuhan pajak |
| **Pengguna** | Admin, Owner |
| **Modul terkait** | Report, Sales |
| **Prioritas** | Low |
| **Status** | Planned |
| **Dependensi** | Tax (SA-10) |
| **Risiko** | Rendah |
| **Catatan** | Format sesuai kebutuhan pelaporan pajak |

---

#### RP-10: Export PDF

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Export PDF |
| **Tujuan** | Ekspor laporan ke PDF |
| **Deskripsi** | Generate PDF dari data laporan: header toko, judul, periode, tabel, footer |
| **Manfaat** | Arsip dan presentasi |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Semua modul laporan |
| **Risiko** | Rendah |
| **Catatan** | Gunakan jsPDF. Layout responsif |

---

#### RP-11: Export Excel

| Atribut | Nilai |
|---|---|
| **Nama Fitur** | Export Excel |
| **Tujuan** | Ekspor data ke Excel |
| **Deskripsi** | Export tabel ke XLSX. Header, data, auto-width, styling minimal |
| **Manfaat** | Analisis lebih lanjut di Excel |
| **Pengguna** | Admin, Manager |
| **Modul terkait** | Report |
| **Prioritas** | Medium |
| **Status** | Planned |
| **Dependensi** | Semua modul laporan |
| **Risiko** | Rendah |
| **Catatan** | Gunakan SheetJS |

---

### 4.9 Cafe (v2.0)

| Detail | Deskripsi |
|---|---|
| **Total Fitur** | 9 fitur (CF-01 s.d. CF-09) |
| **Target Versi** | v2.0 |
| **Prioritas** | Future — tidak masuk MVP |
| **Dependensi** | Sales (SA-01), Product (MD-01) |
| **Detail** | Table Management, Table Layout, Dine-In Order, Kitchen Order, Kitchen Display, Reservation, Split Bill, Merge Table, Take Away Order |

Lihat `02_DATABASE_SCHEMA.md` entitas Table, KitchenOrder, Reservation. Lihat `05_COMPONENT_LIBRARY.md` section 14 untuk komponen UI.

---

### 4.10 Loyalty (v2.0)

| Detail | Deskripsi |
|---|---|
| **Total Fitur** | 5 fitur (LY-01 s.d. LY-05) |
| **Target Versi** | v2.0 |
| **Prioritas** | Future — tidak masuk MVP |
| **Dependensi** | Customer (MD-05), Sales (SA-01) |
| **Detail** | Membership Management, Point Earning, Point Redemption, Tier Management, Reward Catalog |

Lihat `02_DATABASE_SCHEMA.md` entitas Membership, LoyaltyPoint. Lihat `03_BUSINESS_RULES.md` section 21.

---

### 4.11 Utility

| Detail | Deskripsi |
|---|---|
| **UT-01 Backup** | Backup data ke file JSON. Lihat CS-08 |
| **UT-02 Restore** | Restore dari file JSON. Lihat CS-09 |
| **UT-03 Export JSON** | Export data per entitas ke JSON |
| **UT-04 Import JSON** | Import data per entitas dari JSON |
| **UT-05 Database Info** | Informasi database (versi, record count, ukuran) |
| **UT-06 Storage Info** | Informasi penyimpanan browser |
| **UT-07 Activity Log Viewer** | Lihat activity log dengan filter |
| **UT-08 Audit Log Viewer** | Lihat audit log dengan filter |

---

## 5. Prioritas

### 5.1 Critical

Fitur yang **wajib** ada — tanpa fitur ini aplikasi tidak berfungsi sebagai POS.

| Fitur | Alasan |
|---|---|
| Login (CS-01) | Keamanan dasar |
| User Management (CS-03) | Mengelola pengguna |
| Role Management (CS-04) | Kontrol akses |
| Store Settings (CS-06) | Konfigurasi toko |
| Backup (CS-08) / Restore (CS-09) | Keamanan data |
| Product Management (MD-01) | Data produk |
| Category Management (MD-02) | Pengelompokan produk |
| Unit Management (MD-03) | Satuan produk |
| POS Main Screen (SA-01) | Inti aplikasi |
| Product Grid (SA-02) | Memilih produk |
| Product Search (SA-03) | Mencari produk |
| Cart Management (SA-05) | Keranjang |
| Quantity Adjustment (SA-06) | Mengatur jumlah |
| Payment Cash (SA-11) | Pembayaran utama |
| Invoice Generation (SA-16) | Nomor transaksi |
| Void Transaction (SA-19) | Membatalkan transaksi |
| Sales Report (RP-01) | Laporan wajib |

### 5.2 High

Fitur penting untuk operasional yang lebih lengkap.

| Fitur | Alasan |
|---|---|
| Lock Screen (CS-02) | Keamanan saat idle |
| Permission (CS-05) | RBAC |
| Audit Log (CS-11) | Akuntabilitas |
| KPI Dashboard (DB-01, DB-02, DB-06) | Monitoring |
| Customer Management (MD-05) | Data pelanggan |
| Supplier Management (MD-04) | Data supplier |
| Barcode Scan (SA-04) | Efisiensi kasir |
| Tax Calculation (SA-10) | Pajak |
| Payment Non-Cash (SA-12) | Metode bayar |
| Receipt Print (SA-17) | Struk |
| Refund (SA-20) | Retur |
| Purchase Order (PU-01) | Pembelian |
| Purchase Receive (PU-02) | Terima barang |
| Stock Overview (IN-01) | Monitoring stok |
| Stock Movement (IN-02) | Riwayat stok |
| Stock Adjustment (IN-03) | Koreksi stok |
| Minimum Stock Alert (IN-05) | Peringatan stok |
| Shift Management (FI-01, FI-02, FI-03) | Shift kasir |
| Cash Flow (FI-04) | Arus kas |
| Inventory Report (RP-04) | Laporan stok |
| Cash Flow Report (RP-07) | Laporan kas |

### 5.3 Medium

Fitur yang meningkatkan fungsionalitas tetapi tidak kritis.

| Fitur | Alasan |
|---|---|
| Database Maintenance (CS-10) | Perawatan opsional |
| Keyboard Shortcuts (CS-12) | Efisiensi |
| Revenue (DB-03) & Profit (DB-04) | Analisis |
| Recent Transactions (DB-05) | Monitoring |
| Quick Actions (DB-07) | Navigasi |
| Sales Chart (DB-08) | Visualisasi |
| Product Import/Export (MD-06) | Migrasi data |
| Voucher (SA-09) | Promo |
| QRIS Payment (SA-13) | Pembayaran digital |
| Mixed Payment (SA-14) | Pembayaran campuran |
| Hold Transaction (SA-15) | Tunda transaksi |
| Reprint Receipt (SA-18) | Cetak ulang |
| Purchase History (PU-03) | Riwayat PO |
| Stock Opname (IN-04) | Siklus opname |
| Expense Management (FI-05) | Pengeluaran |
| Purchase Report (RP-02) | Laporan PO |
| Profit Report (RP-03) | Laba |
| Shift Report (RP-08) | Rekap shift |
| Export PDF (RP-10) | PDF |
| Export Excel (RP-11) | Excel |
| Activity Timeline (DB-09) | Timeline |

### 5.4 Low

Fitur yang bersifat nice-to-have.

| Fitur | Alasan |
|---|---|
| Theme Toggle (CS-07) | Kosmetik |
| Barcode Label Print (MD-07) | Pelabelan |
| Price History (MD-08) | Riwayat harga |
| Supplier Ledger (PU-04) | Detail supplier |
| Income Management (FI-06) | Pemasukan non-sale |
| Customer Report (RP-05) | Laporan pelanggan |
| Supplier Report (RP-06) | Laporan supplier |
| Tax Report (RP-09) | Laporan pajak |

### 5.5 Future

Fitur untuk v2.0+.

| Fitur | Alasan |
|---|---|
| Semua fitur Cafe (CF-01 s.d. CF-09) | v2.0 — membutuhkan modul tambahan |
| Semua fitur Loyalty (LY-01 s.d. LY-05) | v2.0 — membutuhkan Customer + Sales |
| Cloud Sync | v3.0 |
| AI Assistant | v3.0 |

---

## 6. MVP v1.0

### 6.1 Fitur Wajib MVP

| Kategori | Fitur |
|---|---|
| **Core** | Login, Lock Screen, User Management, Role Management, Store Settings, Backup, Restore, Audit Log |
| **Dashboard** | KPI Cards, Sales Summary, Low Stock Alert, Quick Actions |
| **Master Data** | Product Management, Category Management, Unit Management, Customer Management |
| **Sales (POS)** | POS Main Screen, Product Grid, Product Search, Cart Management, Quantity Adjustment, Tax Calculation, Payment (Cash & Non-Cash), Hold Transaction, Invoice, Receipt Print, Void Transaction |
| **Purchase** | Purchase Order, Purchase Receive |
| **Inventory** | Stock Overview, Stock Movement History, Stock Adjustment, Minimum Stock Alert |
| **Finance** | Shift Management, Shift Opening, Shift Closing, Cash Flow, Expense Management |
| **Report** | Sales Report, Inventory Report, Cash Flow Report, Shift Report |
| **Utility** | Database Info, Storage Info |

### 6.2 Fitur Dilewati di MVP

| Fitur | Alasan |
|---|---|
| Voucher | Kompleksitas tambahan, tidak esensial |
| QRIS Payment | Membutuhkan integrasi pihak ketiga |
| Mixed Payment | Kompleksitas |
| Stock Opname | Bisa dilakukan manual via adjustment |
| Loyalty | v2.0 |
| Cafe | v2.0 |
| Theme Toggle | Prioritas rendah |
| Export PDF/Excel | Bisa ditambahkan setelah MVP stabil |
| Refund | v1.1 — void sudah mencakup sebagian kebutuhan |
| Import/Export Produk | v1.1 |

---

## 7. Dependency Matrix

### 7.1 Dependency Diagram

```
                        ┌─────────────┐
                        │  Core (CS)  │
                        │ User, Role  │
                        │ Setting     │
                        └──────┬──────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Master   │        │ Dashboard│        │ Finance  │
   │ Data     │◄───────│ (DB)     │        │ (FI)     │
   │ (MD)     │        └──────────┘        └────┬─────┘
   └────┬─────┘                                  │
        │                                        │
        ├──────────────┐                         │
        ▼              ▼                         │
   ┌──────────┐  ┌──────────┐                    │
   │ Purchase │  │  Sales   │◄───────────────────┘
   │ (PU)     │  │  (SA)    │
   └────┬─────┘  └────┬─────┘
        │              │
        ▼              ▼
   ┌──────────┐  ┌──────────┐
   │Inventory │◄─│          │
   │ (IN)     │  │          │
   └──────────┘  └──────────┘
        │
        ▼
   ┌──────────┐
   │ Report   │
   │ (RP)     │
   └──────────┘
```

### 7.2 Dependency Table

| Fitur | Bergantung Pada | Dependen (Digunakan Oleh) |
|---|---|---|
| **Core (CS)** | - | Semua modul |
| **Master Data (MD)** | Core | Sales, Purchase, Inventory, Report |
| **Sales (SA)** | Master Data, Core, Inventory | Dashboard, Report, Finance |
| **Purchase (PU)** | Master Data, Core | Inventory, Report |
| **Inventory (IN)** | Master Data, Sales, Purchase | Dashboard, Report |
| **Finance (FI)** | Core, Sales | Report |
| **Dashboard (DB)** | Sales, Inventory, Core | - |
| **Report (RP)** | Sales, Purchase, Inventory, Finance | - |
| **Cafe (CF)** | Sales, Master Data | - |
| **Loyalty (LY)** | Sales, Customer | - |

### 7.3 Implied Dependencies

- **Sales** membutuhkan **Inventory** untuk pengecekan stok
- **Inventory** diperbarui oleh **Sales** (pengurangan) dan **Purchase** (penambahan)
- **Finance.CashFlow** diperbarui oleh **Sales.Payment** dan **Finance.Expense**
- **Dashboard** membaca data dari **Sales** dan **Inventory**

---

## 8. User Role

### 8.1 Definisi Role

| Role | Deskripsi |
|---|---|
| **Admin** | Akses penuh ke semua fitur. Mengelola user, role, setting, backup |
| **Manager** | Akses ke operasional (produk, stok, laporan) tetapi tidak ke pengaturan sistem |
| **Kasir** | Akses ke POS, customer, dan melihat stok. Tidak bisa void/refund tanpa approval |
| **Owner** | Akses ke laporan, dashboard, dan data keuangan. Tidak mengelola user/shift |

### 8.2 Feature Access Matrix

| Fitur | Admin | Manager | Kasir | Owner |
|---|---|---|---|---|
| **Core** | | | | |
| Login | ✓ | ✓ | ✓ | ✓ |
| Lock Screen | ✓ | ✓ | ✓ | ✓ |
| User Management | ✓ | - | - | - |
| Role Management | ✓ | - | - | - |
| Permission Management | ✓ | - | - | - |
| Store Settings | ✓ | - | - | - |
| Theme Toggle | ✓ | ✓ | ✓ | ✓ |
| Backup Data | ✓ | ✓ | - | - |
| Restore Data | ✓ | - | - | - |
| Database Maintenance | ✓ | - | - | - |
| Audit Log | ✓ | ✓ | - | - |
| Keyboard Shortcuts | ✓ | ✓ | ✓ | ✓ |
| **Dashboard** | | | | |
| KPI Cards | ✓ | ✓ | ✓ | ✓ |
| Sales Summary | ✓ | ✓ | ✓ | ✓ |
| Revenue / Profit | ✓ | ✓ | - | ✓ |
| Recent Transactions | ✓ | ✓ | ✓ | ✓ |
| Low Stock Alert | ✓ | ✓ | ✓ | ✓ |
| Quick Actions | ✓ | ✓ | ✓ | ✓ |
| Sales Chart | ✓ | ✓ | - | ✓ |
| Activity Timeline | ✓ | ✓ | - | - |
| **Master Data** | | | | |
| Product (CRUD) | ✓ | ✓ | - | ✓ |
| Product (View) | ✓ | ✓ | ✓ | ✓ |
| Category Management | ✓ | ✓ | - | - |
| Unit Management | ✓ | ✓ | - | - |
| Supplier Management | ✓ | ✓ | - | - |
| Customer Management | ✓ | ✓ | ✓ | ✓ |
| Import/Export Produk | ✓ | ✓ | - | - |
| **Sales (POS)** | | | | |
| POS Transaksi | ✓ | ✓ | ✓ | ✓ |
| Barcode Scan | ✓ | ✓ | ✓ | ✓ |
| Diskon Item | ✓ | ✓ | ✓ | - |
| Diskon Transaksi | ✓ | ✓ | Terbatas | - |
| Voucher | ✓ | ✓ | ✓ | - |
| Void Transaksi | ✓ | ✓ | - | - |
| Refund Transaksi | ✓ | ✓ | - | - |
| Reprint Receipt | ✓ | ✓ | ✓ | ✓ |
| Hold / Resume | ✓ | ✓ | ✓ | ✓ |
| **Purchase** | | | | |
| Purchase Order | ✓ | ✓ | - | - |
| Purchase Receive | ✓ | ✓ | - | - |
| Purchase History | ✓ | ✓ | - | ✓ |
| **Inventory** | | | | |
| Stock Overview | ✓ | ✓ | ✓ | ✓ |
| Stock Movement | ✓ | ✓ | - | ✓ |
| Stock Adjustment | ✓ | ✓ | - | - |
| Stock Opname | ✓ | ✓ | - | - |
| **Finance** | | | | |
| Shift Management | ✓ | ✓ | ✓ | - |
| Shift Opening | ✓ | ✓ | ✓ | - |
| Shift Closing | ✓ | ✓ | ✓ | - |
| Cash Flow | ✓ | ✓ | ✓ | ✓ |
| Expense | ✓ | ✓ | - | ✓ |
| Income | ✓ | ✓ | - | ✓ |
| **Report** | | | | |
| Sales Report | ✓ | ✓ | ✓ | ✓ |
| Purchase Report | ✓ | ✓ | - | ✓ |
| Profit Report | ✓ | ✓ | - | ✓ |
| Inventory Report | ✓ | ✓ | ✓ | ✓ |
| Customer Report | ✓ | ✓ | - | ✓ |
| Cash Flow Report | ✓ | ✓ | ✓ | ✓ |
| Shift Report | ✓ | ✓ | - | ✓ |
| Tax Report | ✓ | ✓ | - | ✓ |
| Export PDF/Excel | ✓ | ✓ | - | ✓ |

---

## 9. Estimasi Kompleksitas

### 9.1 Small (1-2 hari)

Fitur dengan CRUD sederhana, satu entitas, tanpa logika bisnis kompleks.

| Fitur | Alasan |
|---|---|
| Unit Management | CRUD sederhana. Satu entitas. Tanpa relasi kompleks |
| Category Management | CRUD dengan parent-child. Validasi depth |
| Theme Toggle | Switch + CSS variables. Simpel |
| Lock Screen | Form PIN + validasi. Standalone |
| Activity Timeline | Read-only dari activityLog |
| Database Info | Read-only dari Dexie API |
| Storage Info | Read-only dari StorageManager API |
| Barcode Label Print | Generate + print. Library sudah siap |
| Price History | Read-only dari auditLog |

### 9.2 Medium (3-5 hari)

CRUD dengan validasi, relasi, dan beberapa state.

| Fitur | Alasan |
|---|---|
| User Management | CRUD + validasi + hash password. Soft delete |
| Role Management | CRUD + system role protection |
| Permission Management | Matriks role x module. Checkbox UI |
| Store Settings | Key-value. Form multi-tipe |
| Customer Management | CRUD + deteksi duplikasi |
| Supplier Management | CRUD standar |
| Product Management | CRUD + validasi SKU/barcode unique |
| Product Search | Debounce + filter real-time |
| Quantity Selector | Validasi stok, min/max |
| Stock Overview | Read + filter + status badge |
| Stock Movement History | Read-only + filter |
| Minimum Stock Alert | Read + komparasi |
| Cash Flow | Read + filter. Data dari berbagai sumber |
| Expense Management | CRUD + auto-number |
| Income Management | CRUD + auto-number |
| Purchase History | Read + filter |
| Recent Transactions | Read 10 item |
| Quick Actions | Tombol navigasi statis |
| Login | Auth + session + redirect |
| Activity Log Viewer | Read + filter |
| Audit Log Viewer | Read + filter |
| Export Excel | Integrasi SheetJS. Format data |

### 9.3 Large (1-2 minggu)

Multi-entitas, state machine, business logic signifikan.

| Fitur | Alasan |
|---|---|
| POS Main Screen | Layout dua panel. Event coordination |
| Product Grid | Grid + filter + klik handler |
| Cart Management | Add, remove, update quantity, stok check |
| Discount Per Item / Transaction | Validasi, kombinasi, audit |
| Tax Calculation | Multiple tax, exempt, snapshot |
| Payment (Cash) | Real-time change calculation |
| Payment (Non-Cash) | Multiple method, reference |
| Invoice Generation | Auto-number sequential per hari |
| Receipt Print | Layout thermal, preview, print |
| Hold Transaction | Status management, resume |
| Purchase Order | Multi-status (DRAFT-ORDERED-RECEIVED-COMPLETED-CANCELLED) |
| Purchase Receive | Partial receive, update stok |
| Stock Adjustment | Validasi alasan, update stok + movement |
| Stock Opname | Multi-status, bulk input, apply adjustment |
| Shift Opening / Closing | Status management, rekonsiliasi |
| Backup Data | Full DB read + JSON generate + checksum |
| Restore Data | Upload + validasi + preview + apply |
| KPI Dashboard | Read multi-source data |
| Sales Summary | Aggregasi data transaksi |
| Sales Chart | Chart.js integrasi, filter periode |
| Sales Report | Filter + tabel + summary + export |
| Inventory Report | Filter + tabel + summary |
| Cash Flow Report | Aggregasi multi-source |
| Shift Report | Aggregasi shift |

### 9.4 Extra Large (2-4 minggu)

Fitur yang membutuhkan banyak sub-komponen, state kompleks, dan integrasi.

| Fitur | Alasan |
|---|---|
| **Full POS Transaction Flow** | Dari search > cart > discount > tax > payment > invoice > receipt > stok update > dashboard update. Melibatkan 10+ komponen |
| **Void Transaction** | Validasi status, restore stok, audit, cash flow adjustment |
| **Refund Transaction** | Full/partial, stok return, payment reversal, cash flow |
| **Mixed Payment** | Multiple payment records, validasi total |
| **QRIS Payment** | Generate QR, integration concept offline |
| **Backup + Restore Full Flow** | Encrypt, decrypt, checksum verify, schema versioning, progress, confirmation |
| **Kategori dengan Produk** | Parent-child, move, depth validation |

---

## 10. Status

| Status | Makna |
|---|---|
| **Planned** | Fitur sudah didefinisikan tetapi belum mulai dikerjakan |
| **In Progress** | Sedang dalam pengembangan |
| **Testing** | Implementasi selesai, dalam pengujian |
| **Completed** | Selesai dan sudah dirilis |
| **Future** | Ditunda ke versi mendatang |
| **Deprecated** | Tidak lagi didukung |

### 10.1 Status Saat Ini

Semua fitur berstatus **Planned** — proyek dalam fase perencanaan dan dokumentasi.

---

## 11. Feature Flow

### 11.1 Alur Transaksi POS (End-to-End)

```
                    ┌──────────────┐
                    │ Buka Shift   │
                    │ (FI-02)      │
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐
              ┌─────┤ POS Main     │
              │     │ (SA-01)      │
              │     └──────┬───────┘
              │            │
              │            ▼
              │     ┌──────────────┐
              │     │ Cari/Tambah  │
              │     │ Produk       │
              │     │ (SA-02/03/04)│
              │     └──────┬───────┘
              │            ▼
              │     ┌──────────────┐
              │     │ Atur Qty    │
              │     │ Diskon Item │
              │     │ (SA-06/07)  │
              │     └──────┬───────┘
              │            │
         ┌────┴────┐      │
         │ Hold    │      ▼
         │ (SA-15) │  ┌──────────────┐
         └────┬────┘  │ Diskon Trans │
              │       │ Voucher      │
              │       │ Pajak        │
              │       │ (SA-08/09/10)│
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Payment      │
              │       │ (SA-11/12/13)│
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Invoice      │
              │       │ (SA-16)      │
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Stok Berkurang│
              │       │ (IN-02)      │
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Cetak Struk  │
              │       │ (SA-17)      │
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Cash Flow    │
              │       │ (FI-04)      │
              │       └──────┬───────┘
              │              ▼
              │       ┌──────────────┐
              │       │ Update       │
              └───────┤ Dashboard    │
                      │ (DB)         │
                      └──────────────┘
```

### 11.2 Alur Backend Data (Perubahan Stok)

```
Sale PAID (SA-16)
    │
    ▼
StockMovement: type=SALE, qty=-N (IN-02)
    │
    ▼
Inventory: quantity -= N (IN-01)
    │
    ▼
Dashboard: LowStockAlert check (DB-06)
    │
    ▼
Dashboard: SalesSummary update (DB-02)
```

### 11.3 Alur Shift

```
Open Shift (FI-02)
    │
    ▼
[Transaksi terjadi sepanjang shift]
    │
    ▼
Close Shift (FI-03)
    │
    ├── Hitung Expected Balance (dari Cash Flow)
    ├── Input Closing Balance
    ├── Hitung Selisih
    ├── Catat Adjustment di Cash Flow (jika ada selisih)
    └── Status = CLOSED
```

### 11.4 Alur Pembelian

```
Buat PO (PU-01) → Status: DRAFT
    │
    ├── Edit → tetap DRAFT
    ├── Cancel → CANCELLED
    └── Order → ORDERED
              │
              ▼
        Receive Barang (PU-02) → Status: RECEIVED
              │
              ├── Stok Bertambah (IN-02)
              ├── Partial? → Sisanya outstanding
              └── Semua diterima? → COMPLETED
```

---

## 12. Non Functional Feature

| # | Fitur | Kategori | Deskripsi | Target |
|---|---|---|---|---|
| NF-01 | **Offline First** | Performa | Semua fitur berfungsi tanpa koneksi internet | 100% offline |
| NF-02 | **Dark Mode** | UI | Tema gelap untuk kenyamanan pengguna | Toggle light/dark |
| NF-03 | **Responsive** | UI | Optimal di semua ukuran layar | Tablet 10" + |
| NF-04 | **Fast Loading** | Performa | Cold start < 2 detik | Lighthouse |
| NF-05 | **Accessibility** | UI | WCAG 2.1 AA | Kontras, keyboard, screen reader |
| NF-06 | **Performance** | Performa | Transaksi < 1 detik, query < 200ms | Dexie indexed |
| NF-07 | **Security** | Keamanan | Password hash, RBAC, input validation | SHA-256, JWT |
| NF-08 | **Backup** | Data | Backup otomatis + manual | JSON + checksum |
| NF-09 | **Audit Trail** | Data | Semua perubahan kritis tercatat | AuditLog |
| NF-10 | **PWA Installable** | Platform | Install dari browser ke home screen | manifest.json |
| NF-11 | **Touch Friendly** | UI | Target sentuh minimal 44x44px | WCAG 2.5.5 |
| NF-12 | **Keyboard Shortcuts** | UX | Navigasi dan aksi via keyboard | F1, F2, F4 |
| NF-13 | **Input Validation** | Keamanan | Validasi semua input user | Server-side (lokal) |
| NF-14 | **Data Integrity** | Data | Unique constraints, referential integrity | Dexie |

---

## 13. Future Feature

### 13.1 v1.1 — Enhancement

| Fitur | Deskripsi |
|---|---|
| Refund Full | Pengembalian barang penuh |
| Product Import/Export | Excel |
| Export PDF / Excel | Laporan |
| Voucher / Promo | Kode promo terbatas |

### 13.2 v2.0 — Cafe & Loyalty

| Fitur | Deskripsi |
|---|---|
| Table Management | Meja restoran |
| Dine-In Order | Pesanan makan di tempat |
| Kitchen Display | Layar dapur |
| Kitchen Order | Tiket dapur |
| Reservation | Reservasi meja |
| Split Bill | Bagi tagihan |
| Merge Table | Gabung meja |
| Take Away | Bungkus |
| Membership | Member pelanggan |
| Point Earning | Poin belanja |
| Point Redemption | Tukar poin |
| Tier Management | Level member |

### 13.3 v3.0 — Cloud & AI

| Fitur | Deskripsi |
|---|---|
| Cloud Sync | Sinkronisasi multi-device |
| Multi Outlet | Dashboard multi-cabang |
| Multi Warehouse | Stok multi-gudang |
| Multi Currency | Mata uang asing |
| AI Assistant | Rekomendasi produk, prediksi stok |
| Analytics | Analisis lanjutan |
| Forecast | Prediksi penjualan |
| WhatsApp Integration | Notifikasi pelanggan |

### 13.4 Future Technical Features

| Fitur | Deskripsi |
|---|---|
| Customer Display | Tampilan untuk pelanggan |
| QR Menu | Menu digital via QR |
| Self Order Kiosk | Pesan mandiri |
| Bluetooth Printer | Printer thermal Bluetooth |
| Cash Drawer | Laci uang otomatis |
| Plugin System | Ekstensi modular |
| REST API | Integrasi eksternal |

---

## 14. Feature Matrix

| # | Fitur | Kategori | Prioritas | Role | Status | Dependensi | Target |
|---|---|---|---|---|---|---|---|
| CS-01 | Login | Core | Critical | All | Planned | CS-03, CS-04 | v1.0 |
| CS-02 | Lock Screen | Core | High | All | Planned | CS-01 | v1.0 |
| CS-03 | User Management | Core | Critical | Admin | Planned | CS-04 | v1.0 |
| CS-04 | Role Management | Core | Critical | Admin | Planned | - | v1.0 |
| CS-05 | Permission | Core | High | Admin | Planned | CS-04 | v1.0 |
| CS-06 | Store Settings | Core | Critical | Admin | Planned | - | v1.0 |
| CS-07 | Theme Toggle | Core | Low | All | Planned | - | v1.1 |
| CS-08 | Backup Data | Core | Critical | Admin | Planned | CS-10 | v1.0 |
| CS-09 | Restore Data | Core | Critical | Admin | Planned | CS-08 | v1.0 |
| CS-10 | DB Maintenance | Core | Medium | Admin | Planned | - | v1.0 |
| CS-11 | Audit Log | Core | High | Admin, Mgr | Planned | CS-03 | v1.0 |
| CS-12 | Keyboard Shortcuts | Core | Medium | All | Planned | - | v1.0 |
| DB-01 | KPI Cards | Dashboard | High | All | Planned | SA-01 | v1.0 |
| DB-02 | Sales Summary | Dashboard | High | All | Planned | SA-01 | v1.0 |
| DB-03 | Revenue Overview | Dashboard | Medium | Admin, Mgr, Owner | Planned | SA-01 | v1.1 |
| DB-04 | Profit Overview | Dashboard | Medium | Admin, Mgr, Owner | Planned | SA-01, PU-01 | v1.1 |
| DB-05 | Recent Transactions | Dashboard | Medium | All | Planned | SA-01 | v1.0 |
| DB-06 | Low Stock Alert | Dashboard | High | All | Planned | IN-01 | v1.0 |
| DB-07 | Quick Actions | Dashboard | Medium | All | Planned | - | v1.0 |
| DB-08 | Sales Chart | Dashboard | Medium | Admin, Mgr, Owner | Planned | SA-01 | v1.1 |
| DB-09 | Activity Timeline | Dashboard | Low | Admin, Mgr | Planned | CS-11 | v1.1 |
| MD-01 | Product Management | Master Data | Critical | Admin, Mgr | Planned | MD-02, MD-03 | v1.0 |
| MD-02 | Category Management | Master Data | Critical | Admin, Mgr | Planned | - | v1.0 |
| MD-03 | Unit Management | Master Data | Critical | Admin, Mgr | Planned | - | v1.0 |
| MD-04 | Supplier Management | Master Data | High | Admin, Mgr | Planned | - | v1.0 |
| MD-05 | Customer Management | Master Data | High | Admin, Mgr, Kasir | Planned | - | v1.0 |
| MD-06 | Product Import/Export | Master Data | Medium | Admin | Planned | MD-01 | v1.1 |
| MD-07 | Barcode Label Print | Master Data | Low | Admin, Mgr | Planned | MD-01 | v1.1 |
| MD-08 | Price History | Master Data | Low | Admin, Mgr | Planned | MD-01, CS-11 | v1.1 |
| SA-01 | POS Main Screen | Sales | Critical | All | Planned | MD-01, IN-01 | v1.0 |
| SA-02 | Product Grid | Sales | Critical | All | Planned | MD-01 | v1.0 |
| SA-03 | Product Search | Sales | Critical | All | Planned | MD-01 | v1.0 |
| SA-04 | Barcode Scan | Sales | High | Kasir | Planned | MD-01 | v1.0 |
| SA-05 | Cart Management | Sales | Critical | All | Planned | SA-01 | v1.0 |
| SA-06 | Quantity Adjustment | Sales | Critical | All | Planned | SA-05, IN-01 | v1.0 |
| SA-07 | Discount Per Item | Sales | Medium | Admin, Mgr, Kasir | Planned | SA-05 | v1.0 |
| SA-08 | Discount Trans | Sales | Medium | Admin, Mgr, Kasir | Planned | SA-05 | v1.0 |
| SA-09 | Voucher | Sales | Low | Admin, Mgr, Kasir | Planned | SA-08 | v1.1 |
| SA-10 | Tax Calculation | Sales | High | All | Planned | CS-06 | v1.0 |
| SA-11 | Payment Cash | Sales | Critical | All | Planned | SA-05 | v1.0 |
| SA-12 | Payment Non-Cash | Sales | High | All | Planned | SA-05 | v1.0 |
| SA-13 | QRIS Payment | Sales | Medium | All | Planned | SA-12 | v1.1 |
| SA-14 | Mixed Payment | Sales | Medium | All | Planned | SA-11, SA-12 | v1.1 |
| SA-15 | Hold Transaction | Sales | Medium | All | Planned | SA-05 | v1.0 |
| SA-16 | Invoice Generation | Sales | Critical | System | Planned | SA-11 | v1.0 |
| SA-17 | Receipt Print | Sales | High | All | Planned | SA-16 | v1.0 |
| SA-18 | Reprint Receipt | Sales | Medium | Admin, Mgr, Kasir | Planned | SA-17 | v1.0 |
| SA-19 | Void Transaction | Sales | Critical | Admin, Mgr | Planned | SA-01, IN-01 | v1.0 |
| SA-20 | Refund Transaction | Sales | High | Admin, Mgr | Planned | SA-19 | v1.1 |
| PU-01 | Purchase Order | Purchase | High | Admin, Mgr | Planned | MD-01, MD-04 | v1.0 |
| PU-02 | Purchase Receive | Purchase | High | Admin, Mgr | Planned | PU-01, IN-01 | v1.0 |
| PU-03 | Purchase History | Purchase | Medium | Admin, Mgr | Planned | PU-01 | v1.0 |
| PU-04 | Supplier Ledger | Purchase | Low | Admin, Mgr | Planned | PU-03 | v1.1 |
| IN-01 | Stock Overview | Inventory | High | All | Planned | MD-01 | v1.0 |
| IN-02 | Stock Movement | Inventory | High | Admin, Mgr | Planned | MD-01 | v1.0 |
| IN-03 | Stock Adjustment | Inventory | High | Admin, Mgr | Planned | IN-01 | v1.0 |
| IN-04 | Stock Opname | Inventory | Medium | Admin, Mgr | Planned | IN-03 | v1.1 |
| IN-05 | Min Stock Alert | Inventory | High | All | Planned | IN-01 | v1.0 |
| FI-01 | Shift Management | Finance | High | All | Planned | CS-03 | v1.0 |
| FI-02 | Shift Opening | Finance | High | Kasir | Planned | FI-01 | v1.0 |
| FI-03 | Shift Closing | Finance | High | Kasir | Planned | FI-02 | v1.0 |
| FI-04 | Cash Flow | Finance | High | Admin, Mgr | Planned | FI-01, SA-01 | v1.0 |
| FI-05 | Expense | Finance | Medium | Admin, Mgr | Planned | FI-04 | v1.0 |
| FI-06 | Income | Finance | Low | Admin, Mgr | Planned | FI-04 | v1.1 |
| RP-01 | Sales Report | Report | Critical | Admin, Mgr, Owner | Planned | SA-01 | v1.0 |
| RP-02 | Purchase Report | Report | Medium | Admin, Mgr | Planned | PU-01 | v1.0 |
| RP-03 | Profit Report | Report | Medium | Admin, Mgr, Owner | Planned | SA-01, IN-01 | v1.1 |
| RP-04 | Inventory Report | Report | High | Admin, Mgr | Planned | IN-01 | v1.0 |
| RP-05 | Customer Report | Report | Low | Admin, Mgr, Owner | Planned | MD-05 | v1.1 |
| RP-06 | Supplier Report | Report | Low | Admin, Mgr | Planned | MD-04, PU-01 | v1.1 |
| RP-07 | Cash Flow Report | Report | High | Admin, Mgr, Owner | Planned | FI-04 | v1.0 |
| RP-08 | Shift Report | Report | Medium | Admin, Mgr | Planned | FI-01 | v1.0 |
| RP-09 | Tax Report | Report | Low | Admin, Owner | Planned | SA-10 | v1.1 |
| RP-10 | Export PDF | Report | Medium | Admin, Mgr | Planned | RP | v1.1 |
| RP-11 | Export Excel | Report | Medium | Admin, Mgr | Planned | RP | v1.1 |
| CF-01..09 | Cafe | Cafe | Future | All | Planned | SA-01 | v2.0 |
| LY-01..05 | Loyalty | Loyalty | Future | Admin, Mgr | Planned | MD-05 | v2.0 |
| UT-01..08 | Utility | Utility | Medium | Admin | Planned | CS | v1.0 |

---

## 15. Acceptance Criteria

### 15.1 Login (CS-01)

| # | Kriteria | Hasil |
|---|---|---|
| AC-01 | Username dan password valid → masuk ke dashboard | ✓ |
| AC-02 | Username valid, password salah → pesan error | ✓ |
| AC-03 | Username tidak ditemukan → pesan error | ✓ |
| AC-04 | User nonaktif → pesan "Akun dinonaktifkan" | ✓ |
| AC-05 | Password salah 5x → akun terkunci 30 menit | ✓ |
| AC-06 | Session expire 24 jam → redirect ke login | ✓ |

### 15.2 POS Transaksi (SA-01 s.d. SA-17)

| # | Kriteria | Hasil |
|---|---|---|
| AC-10 | Produk muncul di grid sesuai kategori | ✓ |
| AC-11 | Pencarian berdasarkan nama, SKU, barcode | ✓ |
| AC-12 | Klik produk → masuk ke cart (qty 1) | ✓ |
| AC-13 | Scan barcode → produk langsung masuk cart | ✓ |
| AC-14 | Quantity bisa ditambah/kurang dengan +/- | ✓ |
| AC-15 | Quantity tidak bisa < 1 | ✓ |
| AC-16 | Quantity tidak bisa > stok tersedia | ✓ |
| AC-17 | Diskon item tidak boleh > harga item | ✓ |
| AC-18 | Diskon transaksi mengurangi subtotal | ✓ |
| AC-19 | Pajak dihitung dari subtotal setelah diskon | ✓ |
| AC-20 | Cash input → kembalian dihitung real-time | ✓ |
| AC-21 | Cash < grand total → error | ✓ |
| AC-22 | Pembayaran sukses → status PAID | ✓ |
| AC-23 | Invoice number auto-generated | ✓ |
| AC-24 | Stok berkurang setelah PAID | ✓ |
| AC-25 | Struk bisa dicetak setelah PAID | ✓ |
| AC-26 | Transaksi PAID muncul di dashboard | ✓ |

### 15.3 Void Transaksi (SA-19)

| # | Kriteria | Hasil |
|---|---|---|
| AC-30 | Void hanya untuk transaksi PAID | ✓ |
| AC-31 | Void wajib mengisi alasan | ✓ |
| AC-32 | Setelah void, stok kembali seperti sebelum transaksi | ✓ |
| AC-33 | Status transaksi menjadi VOID | ✓ |
| AC-34 | Void tercatat di audit log | ✓ |
| AC-35 | Void tidak bisa dibatalkan | ✓ |

### 15.4 Manajemen Produk (MD-01)

| # | Kriteria | Hasil |
|---|---|---|
| AC-40 | Tambah produk: semua field wajib terisi | ✓ |
| AC-41 | SKU unik → error jika duplikat | ✓ |
| AC-42 | Barcode unik (jika diisi) → error jika duplikat | ✓ |
| AC-43 | Produk nonaktif tidak muncul di POS | ✓ |
| AC-44 | Produk dengan tipe service tidak punya stok | ✓ |
| AC-45 | Edit produk: SKU tidak bisa diubah | ✓ |
| AC-46 | Hapus produk yang sudah pernah dijual → soft delete | ✓ |

### 15.5 Backup & Restore (CS-08, CS-09)

| # | Kriteria | Hasil |
|---|---|---|
| AC-50 | Backup menghasilkan file JSON | ✓ |
| AC-51 | File JSON memiliki checksum SHA-256 | ✓ |
| AC-52 | File JSON memiliki schema version | ✓ |
| AC-53 | Restore validasi checksum → gagal jika rusak | ✓ |
| AC-54 | Restore membuat auto-backup sebelum proses | ✓ |
| AC-55 | Restore membutuhkan konfirmasi 2 langkah | ✓ |
| AC-56 | Progress bar selama backup/restore | ✓ |

### 15.6 Shift (FI-01, FI-02, FI-03)

| # | Kriteria | Hasil |
|---|---|---|
| AC-60 | Buka shift dengan opening balance | ✓ |
| AC-61 | Tidak bisa buka shift baru jika masih ada shift OPEN | ✓ |
| AC-62 | Tutup shift: expected balance vs closing balance | ✓ |
| AC-63 | Selisih dicatat di cash flow | ✓ |
| AC-64 | Setelah CLOSED, shift tidak bisa diubah | ✓ |
| AC-65 | Multi shift per hari diperbolehkan | ✓ |

### 15.7 Laporan (RP-01)

| # | Kriteria | Hasil |
|---|---|---|
| AC-70 | Filter date range berfungsi | ✓ |
| AC-71 | Total transaksi dan nominal sesuai | ✓ |
| AC-72 | Detail per transaksi ditampilkan | ✓ |
| AC-73 | Export Excel berisi data sesuai filter | ✓ |

---

## 16. Out of Scope

### 16.1 Fase Awal (v1.0-v1.1) — Tidak Termasuk

| Fitur | Alasan |
|---|---|
| **Marketplace** | Bukan POS — aplikasi terpisah |
| **Full Accounting / ERP** | POS fokus pada penjualan dan stok. Neraca, jurnal umum tidak termasuk |
| **CRM Lengkap** | Customer management dasar cukup untuk v1.0 |
| **HR / Payroll** | Di luar scope aplikasi POS |
| **Cloud Native** | Offline first adalah prioritas. Cloud sync adalah v3.0 |
| **Mobile Native (iOS/Android)** | PWA cukup untuk semua platform |
| **E-Commerce Integration** | Tidak relevan untuk POS offline |
| **Payment Gateway Online** | POS offline tidak bergantung pada payment gateway real-time |
| **Multi Language** | Bahasa Indonesia cukup untuk target pasar |
| **Real-time Multi-device** | Memerlukan server backend |
| **Inventory Forecasting** | v3.0 dengan AI |
| **Customer Facing Display Real-time** | v2.0 |

### 16.2 Batasan Arsitektur

| Batasan | Alasan |
|---|---|
| Tidak ada server backend | Aplikasi 100% client-side |
| Tidak ada API REST | Semua data di IndexedDB |
| Tidak ada real-time sync | v3.0 |
| Tidak ada autentikasi online | Login lokal |
| Tidak ada PHP / MySQL / Firebase | Stack: Vanilla JS + Dexie + Bootstrap |

---

> **Dokumen ini adalah daftar fitur resmi untuk POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md`, `02_DATABASE_SCHEMA.md`, `03_BUSINESS_RULES.md`, `04_UI_DESIGN_SYSTEM.md`, dan `05_COMPONENT_LIBRARY.md`.

---

*POS Offline PWA — Feature List v1.0.0 — 15 Juli 2026*
