# 07_ROADMAP.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Roadmap](#2-filosofi-roadmap)
3. [Versi Aplikasi](#3-versi-aplikasi)
4. [Prioritas Fase](#4-prioritas-fase)
5. [Dependency Roadmap](#5-dependency-roadmap)
6. [Phase 0 — Project Foundation](#6-phase-0--project-foundation)
7. [Phase 1 — Project Setup](#7-phase-1--project-setup)
8. [Phase 2 — Core System](#8-phase-2--core-system)
9. [Phase 3 — Master Data](#9-phase-3--master-data)
10. [Phase 4 — Dashboard](#10-phase-4--dashboard)
11. [Phase 5 — Sales (POS)](#11-phase-5--sales-pos)
12. [Phase 6 — Inventory](#12-phase-6--inventory)
13. [Phase 7 — Purchase](#13-phase-7--purchase)
14. [Phase 8 — Finance](#14-phase-8--finance)
15. [Phase 9 — Reporting](#15-phase-9--reporting)
16. [Phase 10 — v1.1 Enhancement](#16-phase-10--v11-enhancement)
17. [Phase 11 — Cafe (v2.0)](#17-phase-11--cafe-v20)
18. [Phase 12 — Loyalty (v2.5)](#18-phase-12--loyalty-v25)
19. [Phase 13 — Cloud & AI (v3.0)](#19-phase-13--cloud--ai-v30)
20. [Risiko Proyek](#20-risiko-proyek)
21. [Estimasi Kompleksitas](#21-estimasi-kompleksitas)
22. [Timeline Konseptual](#22-timeline-konseptual)
23. [Definition of Done](#23-definition-of-done)
24. [Dokumentasi](#24-dokumentasi)
25. [Continuous Improvement](#25-continuous-improvement)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **Roadmap resmi** pengembangan aplikasi POS Offline PWA. Berisi fase pengembangan, milestone, versi, dependensi, risiko, dan timeline konseptual dari inisiasi hingga rilis fitur lanjutan.

Dokumen ini menjadi **panduan utama** bagi seluruh tim pengembangan — developer manusia, AI, project manager, dan stakeholder — untuk memahami kapan dan dalam urutan apa setiap fitur harus dibangun.

### 1.2 Acuan

Dokumen ini konsisten dengan:

| Dokumen | Fungsi dalam Roadmap |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, batasan teknis |
| `02_DATABASE_SCHEMA.md` | Entitas yang harus tersedia di setiap fase |
| `03_BUSINESS_RULES.md` | Aturan bisnis yang diimplementasikan per fase |
| `04_UI_DESIGN_SYSTEM.md` | Desain UI yang direalisasikan per fase |
| `05_COMPONENT_LIBRARY.md` | Komponen yang dibangun per fase |
| `06_FEATURE_LIST.md` | Daftar fitur lengkap dengan prioritas dan dependensi |

### 1.3 Cara Membaca

| Simbol | Arti |
|---|---|
| **PHASE N** | Fase pengembangan (dikerjakan berurutan) |
| **vX.Y** | Versi rilis aplikasi |
| **DoD** | Definition of Done — kriteria fase selesai |
| ⚠️ | Risiko tinggi |
| 🛡️ | Mitigasi risiko |

---

## 2. Filosofi Roadmap

### 2.1 MVP First

Versi pertama (v1.0) hanya berisi fitur yang benar-benar esensial untuk operasi POS harian. Tidak ada fitur tambahan yang menunda rilis.

**Mengapa**: UMKM membutuhkan solusi yang cepat. Setiap bulan tanpa POS adalah potensi pendapatan yang hilang. Fitur tambahan dapat dirilis setelah fondasi stabil.

### 2.2 Incremental Delivery

Setiap fase menghasilkan **aplikasi yang berfungsi dan bisa digunakan**. Tidak ada fase yang hanya menghasilkan "pekerjaan setengah jadi". Pengguna bisa menggunakan fitur yang sudah selesai sementara fitur lain masih dikembangkan.

**Mengapa**: Memberikan nilai bisnis lebih awal. Mendapatkan feedback lebih cepat. Risiko lebih kecil karena setiap rilis adalah produk yang berfungsi.

### 2.3 Modular Development

Setiap modul dibangun sebagai unit mandiri dengan antarmuka yang jelas. Modular memungkinkan pengembangan paralel dan pengujian independen.

**Mengapa**: Memungkinkan beberapa developer/AI bekerja simultan. Memudahkan penggantian atau peningkatan modul di masa depan.

### 2.4 Continuous Improvement

Roadmap adalah **living document**. Setelah setiap rilis, roadmap dievaluasi dan disesuaikan berdasarkan feedback pengguna, perubahan prioritas bisnis, dan pelajaran teknis.

**Mengapa**: Kebutuhan UMKM berubah. Roadmap yang kaku akan menjadi usang. Fleksibilitas adalah kunci keberhasilan jangka panjang.

### 2.5 Backward Compatibility

Perubahan pada versi baru tidak boleh merusak data atau fitur yang sudah ada di versi sebelumnya. Upgrade harus mulus tanpa migrasi data manual.

**Mengapa**: Pengguna UMKM tidak memiliki resource TI untuk menangani migrasi data. Data adalah aset paling berharga.

### 2.6 Documentation Driven Development

Setiap fase dimulai dengan pembaruan dokumentasi dan diakhiri dengan dokumentasi yang akurat. Dokumentasi adalah **single source of truth** — kode mengikuti dokumen, bukan sebaliknya.

**Mengapa**: AI dan developer baru perlu memahami sistem dengan cepat. Dokumentasi yang usang lebih berbahaya daripada tidak ada dokumentasi.

---

## 3. Versi Aplikasi

| Versi | Nama Rilis | Fase | Fitur Utama |
|---|---|---|---|
| **v0.1** | Foundation | Phase 0-1 | Dokumentasi + Project Setup |
| **v0.2** | Core | Phase 2 | Login, User, Role, Backup |
| **v0.3** | Data | Phase 3-4 | Dashboard + Master Data |
| **v1.0** | **MVP - POS Rilis** | Phase 5-9 | Sales, Inventory, Purchase, Finance, Report |
| **v1.1** | Enhancement | Phase 10 | Refund, Voucher, Export, Import, Fitur tambahan |
| **v2.0** | Cafe | Phase 11 | Table, Kitchen, Reservation, Dine-In |
| **v2.5** | Loyalty | Phase 12 | Membership, Poin, Reward |
| **v3.0** | Cloud & AI | Phase 13 | Multi Outlet, Cloud Sync, AI, API |

---

## 4. Prioritas Fase

| Prioritas | Fase | Alasan |
|---|---|---|
| **Critical** | Phase 0 — Foundation | Tanpa dokumentasi, pengembangan tidak terarah |
| **Critical** | Phase 1 — Project Setup | Tanpa setup, tidak ada yang bisa dijalankan |
| **Critical** | Phase 2 — Core System | Fondasi keamanan dan data |
| **Critical** | Phase 3 — Master Data | Produk adalah inti POS |
| **Critical** | Phase 5 — Sales (POS) | Inti aplikasi — kasir bertransaksi |
| **High** | Phase 4 — Dashboard | Monitoring bisnis |
| **High** | Phase 6 — Inventory | Stok adalah aset |
| **High** | Phase 7 — Purchase | Pengadaan barang |
| **High** | Phase 8 — Finance | Shift dan kas |
| **High** | Phase 9 — Reporting | Laporan bisnis |
| **Medium** | Phase 10 — v1.1 Enhancement | Fitur tambahan setelah MVP stabil |
| **Low** | Phase 11 — Cafe (v2.0) | Modul khusus untuk restoran |
| **Low** | Phase 12 — Loyalty (v2.5) | Program loyalitas |
| **Future** | Phase 13 — Cloud & AI (v3.0) | Memerlukan infrastruktur server |

---

## 5. Dependency Roadmap

### 5.1 Diagram Dependensi Fase

```
                      ┌─────────────────┐
                      │  PHASE 0        │
                      │  Foundation     │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  PHASE 1        │
                      │  Project Setup  │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  PHASE 2        │
                      │  Core System    │
                      └────────┬────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │ PHASE 3    │ │ PHASE 4    │ │            │
        │ Master Data│ │ Dashboard  │ │            │
        └──────┬─────┘ └────────────┘ │            │
               │                      │            │
               ├──────────────────────┤            │
               ▼                      │            │
        ┌────────────┐                │            │
        │ PHASE 5    │◄───────────────┘            │
        │ Sales (POS)│                             │
        └──────┬─────┘                             │
               │                                   │
               ▼                                   │
        ┌────────────┐                             │
        │ PHASE 6    │◄────────────────────────────┘
        │ Inventory  │
        └──────┬─────┘
               │
               ▼
        ┌────────────┐
        │ PHASE 7    │
        │ Purchase   │
        └──────┬─────┘
               │
               ▼
        ┌────────────┐
        │ PHASE 8    │
        │ Finance    │
        └──────┬─────┘
               │
               ▼
        ┌────────────┐
        │ PHASE 9    │
        │ Reporting  │
        └──────┬─────┘
               │
        ┌──────▼──────┐
        │ PHASE 10    │
        │ v1.1 Enhance│
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ PHASE 11    │
        │ Cafe (v2.0) │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ PHASE 12    │
        │ Loyalty     │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ PHASE 13    │
        │ Cloud & AI  │
        └─────────────┘
```

### 5.2 Tabel Dependensi Fase

| Phase | Bergantung Pada | Digunakan Oleh |
|---|---|---|
| 0 — Foundation | - | Semua fase |
| 1 — Project Setup | Phase 0 | Semua fase |
| 2 — Core System | Phase 1 | Semua fase |
| 3 — Master Data | Phase 2 | Phase 5, 6, 7, 9, 11 |
| 4 — Dashboard | Phase 2, 5 | - |
| 5 — Sales (POS) | Phase 2, 3 | Phase 4, 6, 8, 9, 11, 12 |
| 6 — Inventory | Phase 2, 3, 5, 7 | Phase 4, 9 |
| 7 — Purchase | Phase 2, 3 | Phase 6, 9 |
| 8 — Finance | Phase 2, 5, 6 | Phase 9 |
| 9 — Reporting | Phase 5, 6, 7, 8 | - |
| 10 — v1.1 Enhancement | Phase 5, 6, 7, 8, 9 | - |
| 11 — Cafe v2.0 | Phase 5, 3 | - |
| 12 — Loyalty v2.5 | Phase 5, 3 | - |
| 13 — Cloud & AI v3.0 | Semua fase sebelumnya | - |

---

## 6. Phase 0 — Project Foundation

### 6.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Project Foundation |
| **Target Versi** | v0.1 (dokumentasi) |
| **Prioritas** | Critical |
| **Kompleksitas** | Medium |
| **Status** | ✅ **Selesai** |

### 6.2 Tujuan

Mendefinisikan seluruh fondasi proyek sebelum menulis satu baris kode aplikasi. Semua keputusan arsitektur, desain, data, dan bisnis ditetapkan di fase ini.

### 6.3 Deliverable

| Dokumen | Status | Deskripsi |
|---|---|---|
| `01_PROJECT_BLUEPRINT.md` | ✅ Selesai | Visi, arsitektur, stack, struktur folder, standar kode |
| `02_DATABASE_SCHEMA.md` | ✅ Selesai | Semua entitas, relasi, aturan integritas |
| `03_BUSINESS_RULES.md` | ✅ Selesai | 168 aturan bisnis untuk 21 area |
| `04_UI_DESIGN_SYSTEM.md` | ✅ Selesai | Warna, tipografi, komponen, layout, template halaman |
| `05_COMPONENT_LIBRARY.md` | ✅ Selesai | 70+ komponen UI dengan spesifikasi lengkap |
| `06_FEATURE_LIST.md` | ✅ Selesai | 88 fitur dengan prioritas, dependensi, role, status |
| `07_ROADMAP.md` | ✅ Selesai (ini) | Roadmap pengembangan |

### 6.4 Dependensi

Tidak ada — ini adalah fase pertama.

### 6.5 Risiko

| Risiko | Mitigasi |
|---|---|
| Dokumen tidak sinkron satu sama lain | Setiap dokumen me-refer dokumen lain. AI wajib membaca semua dokumen sebelum coding |
| Dokumen terlalu panjang sehingga sulit diikuti | Daftar isi di setiap dokumen. Tabel untuk data terstruktur |
| Keputusan desain berubah di tengah jalan | Dokumentasi adalah living document. Diperbarui saat keputusan berubah |

### 6.6 Definition of Done

| # | Kriteria |
|---|---|
| DoD-00 | Semua 7 dokumen proyek selesai dan konsisten |
| DoD-01 | Setiap dokumen memiliki daftar isi |
| DoD-02 | Setiap dokumen me-refer dokumen lain yang relevan |
| DoD-03 | Semua keputusan arsitektur terdokumentasi |
| DoD-04 | Semua entitas database terdokumentasi |
| DoD-05 | Semua aturan bisnis terdokumentasi |
| DoD-06 | Semua komponen UI terdokumentasi |
| DoD-07 | Semua fitur dengan prioritas dan dependensi terdokumentasi |
| DoD-08 | Roadmap dengan fase dan timeline terdokumentasi |

---

## 7. Phase 1 — Project Setup

### 7.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Project Setup |
| **Target Versi** | v0.1 |
| **Prioritas** | Critical |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 7.2 Tujuan

Membangun kerangka aplikasi (scaffold) yang siap untuk pengembangan fitur. Semua infrastruktur teknis — folder, database, routing, tema, PWA — disiapkan di fase ini.

### 7.3 Deliverable

| # | Item | Deskripsi | Komponen Terkait |
|---|---|---|---|
| PS-01 | Struktur Folder | Seluruh direktori sesuai blueprint | - |
| PS-02 | Entry Point | `index.html` dengan meta, manifest, service worker | - |
| PS-03 | CSS Framework | Bootstrap 5 + CSS variables + custom styles | `04_UI_DESIGN_SYSTEM.md` |
| PS-04 | Dexie.js Setup | Inisialisasi database, schema, migration | `02_DATABASE_SCHEMA.md` |
| PS-05 | Service Worker | Cache assets, offline fallback | - |
| PS-06 | Manifest | PWA manifest: name, icon, theme, display | - |
| PS-07 | Theme System | Light/dark mode via CSS variables | CS-07 |
| PS-08 | Router | Simple hash-based router untuk SPA | - |
| PS-09 | App Layout | AppLayout, AppSidebar, AppTopbar, AppMainContent | `05_COMPONENT_LIBRARY.md` 6.1-6.4 |
| PS-10 | Icon System | Bootstrap Icons atau Lucide SVG sprite | `04_UI_DESIGN_SYSTEM.md` 7 |
| PS-11 | Base Component | AppButton, AppInput, AppCard, AppTable, AppBadge dasar | `05_COMPONENT_LIBRARY.md` 9, 8, 10 |

### 7.4 Dependensi

- Phase 0 (Foundation) — semua dokumen acuan

### 7.5 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Dexie.js schema berubah di fase berikutnya | Gunakan versioning Dexie. Migration per versi |
| Service Worker caching menyebabkan file lama | Cache-first dengan version hash |
| Routing SPA complex | Gunakan hash router sederhana. Tidak perlu library |

### 7.6 Definition of Done

| # | Kriteria |
|---|---|
| DoD-10 | Aplikasi bisa dibuka di browser dengan layout app shell |
| DoD-11 | Sidebar, topbar, dan main content terlihat |
| DoD-12 | Database IndexedDB terinisialisasi dengan semua tabel |
| DoD-13 | Service Worker terdaftar dan caching berjalan |
| DoD-14 | Manifest valid — aplikasi bisa di-install |
| DoD-15 | Theme toggle light/dark berfungsi |
| DoD-16 | Routing dasar (halaman kosong) berfungsi |
| DoD-17 | Komponen dasar (Button, Input, Card, Table, Badge) bisa digunakan |

---

## 8. Phase 2 — Core System

### 8.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Core System |
| **Target Versi** | v0.2 |
| **Prioritas** | Critical |
| **Kompleksitas** | Large |
| **Status** | ❌ Belum Dimulai |

### 8.2 Tujuan

Membangun fondasi aplikasi: keamanan (login, user, role), konfigurasi (setting), dan keselamatan data (backup, restore, audit). Tanpa fase ini, fitur lain tidak bisa berfungsi dengan aman.

### 8.3 Deliverable

| Fitur | ID | Modul | Prioritas | Halaman |
|---|---|---|---|---|
| Login | CS-01 | Core | Critical | Login Page |
| Lock Screen | CS-02 | Core | High | Lock Screen |
| User Management | CS-03 | Core | Critical | Setting > Users |
| Role Management | CS-04 | Core | Critical | Setting > Roles |
| Permission Management | CS-05 | Core | High | Setting > Permissions |
| Store Settings | CS-06 | Core | Critical | Setting > Store |
| Theme Toggle | CS-07 | Core | Low | Topbar |
| Backup Data | CS-08 | Core | Critical | Setting > Backup |
| Restore Data | CS-09 | Core | Critical | Setting > Restore |
| Database Maintenance | CS-10 | Core | Medium | Setting > Database |
| Audit Log | CS-11 | Core | High | Setting > Audit Log |
| Keyboard Shortcuts | CS-12 | Core | Medium | Global |

### 8.4 Komponen yang Dibangun

| Komponen | Kategori | Digunakan Di |
|---|---|---|
| AppBackupPanel | Setting | Halaman Backup |
| AppRestorePanel | Setting | Halaman Restore |
| AppDatabaseStatus | Setting | Halaman Database |
| AppStorageUsage | Setting | Halaman Database |
| AppThemeSwitch | Setting | Topbar / Setting |
| AppAvatar | Data Display | Topbar, User List |
| AppDropdown | Navigation | Topbar User Menu |

### 8.5 Dependensi

- Phase 1 (Project Setup) — layout, routing, database

### 8.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| ⚠️ Backup/restore gagal di tengah | Validasi checksum + auto-backup sebelum restore |
| ⚠️ Password lupa | Reset password via Admin (tidak ada recovery email) |
| Session tidak aman di localStorage | Gunakan sessionStorage (hilang saat tab ditutup) |

### 8.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-20 | Login/logout berfungsi dengan validasi |
| DoD-21 | Lock screen muncul setelah idle 5 menit |
| DoD-22 | User bisa dibuat, diedit, dinonaktifkan |
| DoD-23 | Role bisa dibuat, role sistem tidak bisa dihapus |
| DoD-24 | Permission matriks bisa diatur per role |
| DoD-25 | Setting toko tersimpan dan terbaca |
| DoD-26 | Backup menghasilkan file JSON valid |
| DoD-27 | Restore dari file JSON valid berhasil |
| DoD-28 | Audit log mencatat perubahan kritis |

---

## 9. Phase 3 — Master Data

### 9.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Master Data |
| **Target Versi** | v0.3 |
| **Prioritas** | Critical |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 9.2 Tujuan

Membangun seluruh data master yang menjadi fondasi transaksi: produk, kategori, unit, supplier, pelanggan. Tanpa data master, POS tidak bisa beroperasi.

### 9.3 Deliverable

| Fitur | ID | Modul | Prioritas | Halaman |
|---|---|---|---|---|
| Product Management | MD-01 | Master Data | Critical | Products |
| Category Management | MD-02 | Master Data | Critical | Categories |
| Unit Management | MD-03 | Master Data | Critical | Units |
| Supplier Management | MD-04 | Master Data | High | Suppliers |
| Customer Management | MD-05 | Master Data | High | Customers |

### 9.4 Komponen yang Dibangun

| Komponen | Kategori | Digunakan Di |
|---|---|---|
| AppSearchBox | Form | Semua halaman list |
| AppSelect | Form | Form produk, kategori |
| AppMultiSelect | Form | (jika diperlukan) |
| AppCurrencyInput | Form | Form produk (harga) |
| AppNumberInput | Form | Form produk (stok) |
| AppChip | Data Display | Tags, filter aktif |
| AppPagination | Navigation | Semua halaman list |
| AppBreadcrumb | Navigation | Semua halaman |

### 9.5 Dependensi

- Phase 2 (Core System) — user, setting, audit

### 9.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| SKU/barcode duplikat saat input manual | Validasi real-time setelah user selesai mengetik |
| Kategori dengan depth > 3 | Batasi UI (dropdown hanya menampilkan 3 level) |

### 9.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-30 | Produk CRUD: tambah, edit, duplikasi, nonaktifkan |
| DoD-31 | SKU unik, barcode unik (jika diisi) |
| DoD-32 | Category parent-child maks 3 level |
| DoD-33 | Unit CRUD |
| DoD-34 | Supplier CRUD |
| DoD-35 | Customer CRUD + deteksi duplikasi phone |
| DoD-36 | Semua list memiliki search + pagination |

---

## 10. Phase 4 — Dashboard

### 10.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Dashboard |
| **Target Versi** | v0.3 |
| **Prioritas** | High |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 10.2 Tujuan

Menyediakan antarmuka monitoring bisnis secara real-time. Dashboard adalah halaman pertama setelah login, memberikan gambaran cepat tentang kesehatan toko.

### 10.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| KPI Cards | DB-01 | High |
| Sales Summary | DB-02 | High |
| Recent Transactions | DB-05 | Medium |
| Low Stock Alert | DB-06 | High |
| Quick Actions | DB-07 | Medium |

*Revenue (DB-03), Profit (DB-04), Sales Chart (DB-08), Activity Timeline (DB-09) ditunda ke Phase 10.*

### 10.4 Komponen yang Dibangun

| Komponen | Kategori |
|---|---|
| AppKpiCard | Data Display |
| AppStatCard | Data Display |
| AppSalesSummary | Dashboard |
| AppLowStockCard | Dashboard |
| AppRecentTransaction | Dashboard |
| AppQuickAction | Dashboard |

### 10.5 Dependensi

- Phase 3 (Master Data) — produk, pelanggan
- Phase 2 (Core System) — user, setting

### 10.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Data lama mempengaruhi performa dashboard | Batasi agregasi ke data 30 hari terakhir |
| KPI tidak real-time | Refresh setelah setiap transaksi (event-driven) |

### 10.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-40 | KPI cards menampilkan data penjualan hari ini |
| DoD-41 | Low stock alert menampilkan produk dengan stok menipis |
| DoD-42 | Recent transactions menampilkan 10 transaksi terakhir |
| DoD-43 | Quick actions menavigasi ke halaman yang benar |

---

## 11. Phase 5 — Sales (POS)

### 11.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Sales (POS) |
| **Target Versi** | v1.0 (MVP) |
| **Prioritas** | Critical |
| **Kompleksitas** | Extra Large |
| **Status** | ❌ Belum Dimulai |

### 11.2 Tujuan

Membangun inti aplikasi — antarmuka Point of Sale. Ini adalah fitur yang paling sering digunakan dan paling kompleks. Kasir harus bisa melakukan transaksi penuh: dari memilih produk hingga mencetak struk.

### 11.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| POS Main Screen | SA-01 | Critical |
| Product Grid | SA-02 | Critical |
| Product Search | SA-03 | Critical |
| Barcode Scan | SA-04 | High |
| Cart Management | SA-05 | Critical |
| Quantity Adjustment | SA-06 | Critical |
| Discount Per Item | SA-07 | Medium |
| Discount Per Transaction | SA-08 | Medium |
| Tax Calculation | SA-10 | High |
| Payment (Cash) | SA-11 | Critical |
| Payment (Non-Cash) | SA-12 | High |
| Hold Transaction | SA-15 | Medium |
| Invoice Generation | SA-16 | Critical |
| Receipt Print | SA-17 | High |
| Reprint Receipt | SA-18 | Medium |
| Void Transaction | SA-19 | Critical |

*Voucher (SA-09), QRIS (SA-13), Mixed Payment (SA-14), Refund (SA-20) ditunda ke Phase 10.*

### 11.4 Komponen yang Dibangun

| Komponen | Kategori |
|---|---|
| ProductGrid | POS |
| ProductSearch | POS |
| ProductCard | Data Display |
| AppCart | POS |
| AppCartItem | POS |
| AppQuantitySelector | POS |
| AppDiscountPanel | POS |
| AppTaxPanel | POS |
| AppPaymentPanel | POS |
| AppCalculatorPad | POS |
| AppReceiptPreview | POS |
| AppReceiptItem | POS |
| AppCashSummary | POS |
| AppShiftSummary | POS |
| AppBarcodeScanner | POS |
| AppFullscreenDialog | Overlay |
| AppConfirmDialog | Overlay |
| AppToast | Feedback |
| AppSnackbar | Feedback |
| AppProgressBar | Feedback |

### 11.5 Dependensi

- Phase 3 (Master Data) — produk, kategori, pelanggan
- Phase 2 (Core System) — user, setting
- Phase 6 (Inventory) — pengecekan stok (**paralel**)

### 11.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| ⚠️ **Fase paling kompleks** — banyak state dan interaksi | Bangun secara incremental: grid > cart > payment > receipt |
| ⚠️ Barcode scanner tidak kompatibel di semua browser | Fallback ke search manual. Support QuaggaJS + hardware |
| ⚠️ Printer thermal tidak bisa diakses dari browser | Gunakan browser print sebagai default. Opsi bluetooth di v2.0 |
| Stok tidak konsisten | Setiap perubahan stok melalui StockMovement (wajib) |

### 11.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-50 | Produk muncul di grid dan bisa dipilih |
| DoD-51 | Search berdasarkan nama, SKU, barcode |
| DoD-52 | Barcode scan menambahkan produk ke cart |
| DoD-53 | Cart: tambah, hapus, ubah quantity |
| DoD-54 | Diskon item dan transaksi berfungsi |
| DoD-55 | Pajak dihitung dengan benar |
| DoD-56 | Pembayaran cash: input uang, hitung kembalian |
| DoD-57 | Pembayaran non-cash: pilih metode |
| DoD-58 | Hold/resume transaksi |
| DoD-59 | Invoice number auto-generated |
| DoD-60 | Struk bisa dicetak |
| DoD-61 | Reprint struk dalam 7 hari |
| DoD-62 | Void transaksi: stok kembali, status VOID |
| DoD-63 | Stok berkurang setelah PAID |
| DoD-64 | Dashboard terupdate setelah transaksi |
| DoD-65 | Cash Flow tercatat setelah transaksi |

---

## 12. Phase 6 — Inventory

### 12.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Inventory |
| **Target Versi** | v1.0 (MVP) |
| **Prioritas** | High |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 12.2 Tujuan

Membangun sistem manajemen stok yang akurat. Setiap perubahan stok — dari penjualan, pembelian, atau penyesuaian — harus tercatat dengan jejak audit yang lengkap.

### 12.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| Stock Overview | IN-01 | High |
| Stock Movement History | IN-02 | High |
| Stock Adjustment | IN-03 | High |
| Minimum Stock Alert | IN-05 | High |

*Stock Opname (IN-04) ditunda ke Phase 10.*

### 12.4 Komponen yang Dibangun

| Komponen | Kategori |
|---|---|
| AppSkeleton | Feedback (untuk loading) |
| (Gunakan AppTable, AppBadge, AppSearchBox dari fase sebelumnya) | - |

### 12.5 Dependensi

- Phase 3 (Master Data) — produk
- Phase 5 (Sales) — stok berkurang dari penjualan

### 12.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Stok negatif karena race condition | Semua perubahan stok synchronous. Cek stok sebelum kurangi |
| Data stok tidak sinkron antara inventory dan stockMovement | Inventory adalah agregasi dari stockMovement. Tidak ada dual storage |

### 12.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-70 | Stock overview menampilkan semua produk dengan stok |
| DoD-71 | Stock movement history tercatat untuk setiap perubahan |
| DoD-72 | Stock adjustment: pilih produk, input alasan, stok berubah |
| DoD-73 | Minimum stock alert muncul di stock overview |

---

## 13. Phase 7 — Purchase

### 13.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Purchase |
| **Target Versi** | v1.0 (MVP) |
| **Prioritas** | High |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 13.2 Tujuan

Membangun sistem pembelian barang dari supplier. Purchase Order (PO) dengan status workflow: DRAFT > ORDERED > RECEIVED > COMPLETED > CANCELLED.

### 13.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| Purchase Order | PU-01 | High |
| Purchase Receive | PU-02 | High |
| Purchase History | PU-03 | Medium |

### 13.4 Komponen yang Dibangun

(Gunakan komponen dari fase sebelumnya: AppTable, AppButton, AppSelect, AppCurrencyInput, AppModal, AppConfirmDialog)

### 13.5 Dependensi

- Phase 3 (Master Data) — produk, supplier
- Phase 6 (Inventory) — stok bertambah saat receive

### 13.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| PO di-CANCEL setelah RECEIVED | Tidak bisa. Cancel hanya dari DRAFT/ORDERED |
| Partial receive tidak jelas statusnya | Status RECEIVED untuk PO yang sudah sebagian. COMPLETED hanya jika semua item lengkap |

### 13.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-80 | Purchase Order: buat, edit (DRAFT), order, cancel |
| DoD-81 | Purchase Receive: input receivedQuantity, stok bertambah |
| DoD-82 | PO status berubah sesuai workflow |
| DoD-83 | Purchase History menampilkan semua PO dengan filter |

---

## 14. Phase 8 — Finance

### 14.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Finance |
| **Target Versi** | v1.0 (MVP) |
| **Prioritas** | High |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 14.2 Tujuan

Membangun sistem keuangan: shift kasir, arus kas, dan pencatatan pengeluaran. Setiap transksi tunai harus tercatat dan bisa direkonsiliasi per shift.

### 14.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| Shift Management | FI-01 | High |
| Shift Opening | FI-02 | High |
| Shift Closing | FI-03 | High |
| Cash Flow | FI-04 | High |
| Expense Management | FI-05 | Medium |

*Income Management (FI-06) ditunda ke Phase 10.*

### 14.4 Komponen yang Dibangun

(Gunakan komponen dari fase sebelumnya. Shift Summary menggunakan AppShiftSummary dari Phase 5)

### 14.5 Dependensi

- Phase 2 (Core System) — user
- Phase 5 (Sales) — transaksi cash dicatat di cash flow
- Phase 6 (Inventory) — stock adjustment mempengaruhi cash flow

### 14.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Selisih shift tidak akurat | Hitung expected balance dari semua transaksi cash di shift tsb |
| Expense dicatat di shift yang salah | CashFlow wajib shiftId (jika dalam shift) |

### 14.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-90 | Shift bisa dibuka dengan opening balance |
| DoD-91 | Shift bisa ditutup dengan closing balance |
| DoD-92 | Selisih shift dihitung dan dicatat |
| DoD-93 | Cash flow menampilkan semua transaksi keuangan |
| DoD-94 | Expense bisa ditambahkan dan tercatat di cash flow |

---

## 15. Phase 9 — Reporting

### 15.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Reporting |
| **Target Versi** | v1.0 (MVP) |
| **Prioritas** | High |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 15.2 Tujuan

Menyediakan laporan bisnis yang komprehensif: penjualan, stok, arus kas, shift. Laporan adalah output utama yang digunakan pemilik usaha untuk mengambil keputusan.

### 15.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| Sales Report | RP-01 | Critical |
| Inventory Report | RP-04 | High |
| Cash Flow Report | RP-07 | High |
| Shift Report | RP-08 | Medium |
| Purchase Report | RP-02 | Medium |

### 15.4 Komponen yang Dibangun

| Komponen | Kategori |
|---|---|
| AppChartCard | Dashboard (jika chart diperlukan) |

### 15.5 Dependensi

- Phase 5 (Sales) — data transaksi
- Phase 6 (Inventory) — data stok
- Phase 7 (Purchase) — data pembelian
- Phase 8 (Finance) — data keuangan

### 15.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Laporan lambat jika data banyak | Batasi range date default ke 30 hari. Gunakan Dexie indexing |
| Total tidak balance karena bug | Unit test setiap aggregasi query |

### 15.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-100 | Sales Report: filter date, tabel + summary |
| DoD-101 | Inventory Report: semua produk + nilai stok |
| DoD-102 | Cash Flow Report: IN, OUT, balance |
| DoD-103 | Shift Report: rekap shift |
| DoD-104 | Purchase Report: semua PO |

---

## 16. Phase 10 — v1.1 Enhancement

### 16.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | v1.1 Enhancement |
| **Target Versi** | v1.1 |
| **Prioritas** | Medium |
| **Kompleksitas** | Large |
| **Status** | ❌ Belum Dimulai |

### 16.2 Tujuan

Menambahkan fitur yang sengaja dilewati di MVP, meningkatkan kualitas, dan merespon feedback pengguna dari rilis v1.0.

### 16.3 Deliverable

| Fitur | ID | Prioritas Kategori |
|---|---|---|
| Refund Transaction | SA-20 | High |
| Voucher / Promo Code | SA-09 | Medium |
| QRIS Payment | SA-13 | Medium |
| Mixed Payment | SA-14 | Medium |
| Stock Opname | IN-04 | Medium |
| Income Management | FI-06 | Low |
| Product Import/Export | MD-06 | Medium |
| Theme Toggle | CS-07 | Low |
| Revenue Overview | DB-03 | Medium |
| Profit Overview | DB-04 | Medium |
| Sales Chart | DB-08 | Medium |
| Activity Timeline | DB-09 | Low |
| Profit Report | RP-03 | Medium |
| Customer Report | RP-05 | Low |
| Supplier Report | RP-06 | Low |
| Tax Report | RP-09 | Low |
| Export PDF | RP-10 | Medium |
| Export Excel | RP-11 | Medium |
| Barcode Label Print | MD-07 | Low |
| Price History | MD-08 | Low |
| Supplier Ledger | PU-04 | Low |

### 16.4 Dependensi

- Semua fase sebelumnya (Phase 5-9)

### 16.5 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Refund kompleks dan berisiko tinggi | v1.1 hanya full refund. Partial refund di v2.0 |
| QRIS membutuhkan integrasi eksternal | Simulasi offline: generate QR statis, konfirmasi manual |

### 16.6 Definition of Done

| # | Kriteria |
|---|---|
| DoD-110 | Refund: pilih transaksi, kembalikan stok, catat payment |
| DoD-111 | Voucher: buat, validasi, gunakan di POS |
| DoD-112 | QRIS: generate QR, konfirmasi pembayaran |
| DoD-113 | Mixed payment: minimal 2 metode |
| DoD-114 | Stock opname: buat, input actual, apply adjustment |
| DoD-115 | Import/export produk via Excel |
| DoD-116 | Sales chart menampilkan grafik 7/30/90 hari |
| DoD-117 | Export PDF dan Excel untuk semua laporan |

---

## 17. Phase 11 — Cafe (v2.0)

### 17.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Cafe |
| **Target Versi** | v2.0 |
| **Prioritas** | Low (Future untuk non-cafe) |
| **Kompleksitas** | Large |
| **Status** | ❌ Belum Dimulai |

### 17.2 Tujuan

Memperluas POS untuk mendukung operasional restoran/cafe: meja, dapur, reservasi. Modul terpisah — hanya diaktifkan jika pengguna memilih jenis usaha Cafe.

### 17.3 Deliverable

| Fitur | ID | Prioritas |
|---|---|---|
| Table Management | CF-01 | High (Cafe mode) |
| Table Layout | CF-02 | Medium |
| Dine-In Order | CF-03 | High |
| Kitchen Order | CF-04 | High |
| Kitchen Display | CF-05 | High |
| Reservation | CF-06 | Medium |
| Split Bill | CF-07 | Medium |
| Merge Table | CF-08 | Low |
| Take Away Order | CF-09 | Medium |

### 17.4 Komponen yang Dibangun

| Komponen | Kategori |
|---|---|
| TableLayout | Cafe |
| TableCard | Cafe |
| KitchenTicket | Cafe |
| KitchenQueue | Cafe |
| OrderTimeline | Cafe |
| ReservationCard | Cafe |

### 17.5 Dependensi

- Phase 5 (Sales) — POS untuk mengambil pesanan
- Phase 3 (Master Data) — produk

### 17.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| ⚠️ Kitchen display real-time membutuhkan sinkronisasi | Untuk v2.0, kitchen display di tab/window terpisah dengan Dexie liveQuery |
| Split bill kompleks secara bisnis | Batasi ke split by item (bukan by amount) di v2.0 |

### 17.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-120 | Meja bisa dikelola (tambah, edit, atur posisi) |
| DoD-121 | Pesanan bisa dikaitkan dengan meja |
| DoD-122 | Kitchen order muncul di kitchen display |
| DoD-123 | Status pesanan: PENDING > PREPARING > READY > SERVED |
| DoD-124 | Reservasi meja dengan cek konflik waktu |
| DoD-125 | Split bill: pilih item, bagi tagihan |
| DoD-126 | Merge table: gabung 2+ meja |

---

## 18. Phase 12 — Loyalty (v2.5)

### 18.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Loyalty |
| **Target Versi** | v2.5 |
| **Prioritas** | Low (Future) |
| **Kompleksitas** | Medium |
| **Status** | ❌ Belum Dimulai |

### 18.2 Tujuan

Menambahkan program loyalitas pelanggan: membership, poin, tier, reward. Meningkatkan retensi pelanggan dan frekuensi pembelian.

### 18.3 Deliverable

| Fitur | ID |
|---|---|
| Membership Management | LY-01 |
| Point Earning | LY-02 |
| Point Redemption | LY-03 |
| Tier Management | LY-04 |
| Reward Catalog | LY-05 |

### 18.4 Komponen yang Dibangun

(Komponen baru minimal — menggunakan AppCard, AppTable, AppBadge yang sudah ada)

### 18.5 Dependensi

- Phase 3 (Master Data) — customer
- Phase 5 (Sales) — transaksi untuk earning poin

### 18.6 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| Poin tidak akurat karena batchnya | Setiap earning/redeem tercatat di LoyaltyPoint dengan balance |
| Tier upgrade rumit | Sederhanakan: upgrade berdasarkan totalSpent tahun berjalan |

### 18.7 Definition of Done

| # | Kriteria |
|---|---|
| DoD-130 | Customer bisa didaftarkan sebagai member |
| DoD-131 | Poin otomatis bertambah saat transaksi |
| DoD-132 | Poin bisa ditukarkan (redeem) saat transaksi |
| DoD-133 | Tier member: REGULAR, SILVER, GOLD, PLATINUM |
| DoD-134 | Reward catalog: daftar hadiah yang bisa ditukar |

---

## 19. Phase 13 — Cloud & AI (v3.0)

### 19.1 Ringkasan

| Atribut | Nilai |
|---|---|
| **Nama** | Cloud & AI |
| **Target Versi** | v3.0 |
| **Prioritas** | Future |
| **Kompleksitas** | Extra Large |
| **Status** | ❌ Belum Dimulai |

### 19.2 Tujuan

Membawa aplikasi ke level berikutnya dengan konektivitas cloud, multi-outlet, dan kecerdasan buatan. Fase ini membutuhkan infrastruktur server (backend).

### 19.3 Deliverable

| Fitur | Kategori | Keterangan |
|---|---|---|
| Cloud Sync | Infrastruktur | Sinkronisasi data multi-device |
| Multi Outlet | Bisnis | Dashboard dan manajemen multi-cabang |
| Multi Warehouse | Inventory | Stok multi-gudang |
| Multi Currency | Sales | Mata uang asing |
| REST API | Teknis | Integrasi eksternal |
| AI Assistant | AI | Rekomendasi produk, prediksi stok |
| Forecast | AI | Prediksi penjualan |
| Advanced Analytics | AI | Analisis lanjutan |
| WhatsApp Integration | Notifikasi | Notifikasi ke pelanggan |
| Customer Display | Hardware | Tampilan layar untuk pelanggan |
| QR Menu | Cafe | Menu digital via QR code |
| Self Order Kiosk | Cafe | Pemesanan mandiri |

### 19.4 Dependensi

- Semua fase sebelumnya

### 19.5 Risiko

| Risiko | 🛡️ Mitigasi |
|---|---|
| ⚠️ **Perubahan arsitektur besar** — dari offline-only ke hybrid | Cloud sync opsional. Aplikasi tetap berfungsi offline |
| ⚠️ Biaya server dan maintenance | Gunakan arsitektur serverless jika memungkinkan |
| ⚠️ Keamanan data di cloud | Enkripsi end-to-end. User memilih data yang disinkronkan |

### 19.6 Definition of Done

| # | Kriteria |
|---|---|
| DoD-140 | Cloud sync: push/pull data dengan conflict resolution |
| DoD-141 | Multi outlet: pilih outlet, data terisolasi |
| DoD-142 | Multi warehouse: pilih gudang, stok per gudang |
| DoD-143 | REST API dokumentasi (OpenAPI) |
| DoD-144 | AI recommendation: rekomendasi produk berdasarkan riwayat |
| DoD-145 | Forecast: prediksi penjualan 7 hari ke depan |

---

## 20. Risiko Proyek

### 20.1 Risiko Teknis

| Risiko | Dampak | Probabilitas | 🛡️ Mitigasi |
|---|---|---|---|
| **IndexedDB terbatas** — penyimpanan browser terbatas (50MB-1GB tergantung browser) | Tinggi — data tidak bisa disimpan | Rendah untuk UMKM | Monitor penggunaan storage. Peringatan >80%. Backup rutin |
| **Service Worker caching** — file lama tidak terupdate | Sedang — bug pada versi lama | Sedang | Cache-first + version hash. Tombol "Clear Cache & Reload" |
| **Browser compatibility** — fitur tertentu tidak didukung semua browser | Sedang — pengguna tidak bisa menggunakan fitur tertentu | Rendah | Target Chromium-based browser + Safari. Fitur dengan fallback |
| **Barcode scanner library** — QuaggaJS/ html5-qrcode mungkin tidak sempurna | Sedang — scan gagal | Sedang | Fallback ke manual search. Support hardware scanner USB |
| **Dexie.js migration** — perubahan schema di fase berikutnya | Sedang — data hilang jika migration gagal | Rendah | Setiap migration di-test dengan data dummy |
| **Performance dengan data besar** — 50rb+ transaksi | Sedang — query melambat | Rendah untuk MVP | Indexing di Dexie. Pagination. Arsip data lama |

### 20.2 Risiko Produk

| Risiko | Dampak | Probabilitas | 🛡️ Mitigasi |
|---|---|---|---|
| **Perubahan kebutuhan** — pemilik ingin fitur yang tidak direncanakan | Tinggi — prioritas berubah | Tinggi | Roadmap adalah living document. Evaluasi setiap rilis |
| **Fitur terlalu kompleks untuk MVP** — waktu rilis molor | Tinggi — kehilangan momentum | Sedang | Gunakan MVP scope yang ketat. Fitur baru masuk ke release berikutnya |
| **Adopsi pengguna rendah** — UI terlalu rumit | Tinggi — aplikasi tidak dipakai | Rendah | UX testing sejak dini. Feedback loop dengan pengguna nyata |
| **Data hilang karena bug restore** | Kritis — kehilangan data bisnis | Rendah | Auto-backup sebelum restore. Validasi checksum. Konfirmasi 2 langkah |

### 20.3 Risiko Proyek

| Risiko | Dampak | Probabilitas | 🛡️ Mitigasi |
|---|---|---|---|
| **Dokumentasi tidak diperbarui** — kode dan dokumen tidak sinkron | Sedang — kebingungan developer | Tinggi | Dokumentasi diperbarui di setiap fase. Review dalam code review |
| **AI dan developer tidak konsisten** — kode melanggar standar | Sedang — kualitas menurun | Sedang | Code review otomatis. Blueprint dibaca sebelum coding |

---

## 21. Estimasi Kompleksitas

### 21.1 Per Fase

| Phase | Kompleksitas | Alasan |
|---|---|---|
| **Phase 0** — Foundation | Medium | Menulis 7 dokumen besar. Membutuhkan pemahaman mendalam |
| **Phase 1** — Project Setup | Medium | Setup infrastruktur. Banyak file kecil |
| **Phase 2** — Core System | Large | 12 fitur. Backup/restore kompleks. Permission matriks |
| **Phase 3** — Master Data | Medium | 5 fitur CRUD. Relasi entitas |
| **Phase 4** — Dashboard | Medium | Agregasi data. KPI cards |
| **Phase 5** — Sales (POS) | **Extra Large** | 16 fitur. Paling kompleks. Banyak state dan interaksi |
| **Phase 6** — Inventory | Medium | Stock movement, adjustment. Relatif sederhana |
| **Phase 7** — Purchase | Medium | PO workflow multi-status |
| **Phase 8** — Finance | Medium | Shift, cash flow. Integrasi dengan sales |
| **Phase 9** — Reporting | Medium | Query agregasi. Export |
| **Phase 10** — v1.1 Enhancement | Large | 21 fitur tambahan. Refund kompleks |
| **Phase 11** — Cafe v2.0 | Large | 9 fitur. Kitchen display real-time |
| **Phase 12** — Loyalty v2.5 | Medium | Point system. Tier logic |
| **Phase 13** — Cloud & AI v3.0 | **Extra Large** | Infrastructure server. AI. Multi-outlet |

### 21.2 Estimasi Effort

| Level | Rentang Waktu | Contoh |
|---|---|---|
| Small | 1-2 hari | Theme toggle, income management |
| Medium | 3-5 hari | Product CRUD, Shift management |
| Large | 1-2 minggu | Core system, Purchase, Finance |
| Extra Large | 2-4 minggu | **Sales (POS)**, Cloud & AI |

---

## 22. Timeline Konseptual

### 22.1 Fase Proyek

```
Fase 0  ████████████████████  (Foundation - selesai)
Fase 1  ████████████████████  (Setup)
Fase 2  ██████████████████████████████████  (Core System)
Fase 3  ████████████████████  (Master Data)
Fase 4  ████████████████  (Dashboard)
Fase 5  ██████████████████████████████████████████████████  (Sales/POS)
Fase 6  ████████████████  (Inventory)
Fase 7  ████████████████  (Purchase)
Fase 8  ████████████████████  (Finance)
Fase 9  ████████████████  (Reporting)
══════════════════════════════════════════════════════════════  RILIS v1.0
Fase 10 ██████████████████████████████████  (v1.1 Enhancement)
══════════════════════════════════════════════════════════════  RILIS v1.1
Fase 11 ██████████████████████████████████████████████  (Cafe v2.0)
══════════════════════════════════════════════════════════════  RILIS v2.0
Fase 12 ██████████████████████████  (Loyalty v2.5)
══════════════════════════════════════════════════════════════  RILIS v2.5
Fase 13 ██████████████████████████████████████████████████████  (Cloud & AI v3.0)
══════════════════════════════════════════════════════════════  RILIS v3.0
```

### 22.2 Urutan Logis

| Urutan | Fase | Output | Tergantung |
|---|---|---|---|
| 1 | Phase 0 | Dokumentasi lengkap | - |
| 2 | Phase 1 | Aplikasi bisa dijalankan | Phase 0 |
| 3 | Phase 2 | Login, User, Role, Backup | Phase 1 |
| 4 | Phase 3 | Produk, Kategori, Unit | Phase 2 |
| 5 | Phase 4 | Dashboard | Phase 2, 5 |
| 6 | Phase 5 | **POS - Kasir bisa transaksi** | Phase 2, 3 |
| 7 | Phase 6 | Stok terkontrol | Phase 3, 5 |
| 8 | Phase 7 | Pembelian barang | Phase 3, 6 |
| 9 | Phase 8 | Shift dan kas | Phase 2, 5 |
| 10 | Phase 9 | Laporan siap | Phase 5, 6, 7, 8 |
| | **RILIS v1.0** | **MVP siap digunakan** | Semua di atas |
| 11 | Phase 10 | Fitur tambahan | Phase 5-9 |
| | **RILIS v1.1** | **Enhancement** | Phase 10 |
| 12 | Phase 11 | Cafe/Restoran | Phase 5, 3 |
| | **RILIS v2.0** | **Cafe siap** | Phase 11 |
| 13 | Phase 12 | Loyalty | Phase 5, 3 |
| | **RILIS v2.5** | **Loyalty aktif** | Phase 12 |
| 14 | Phase 13 | Cloud, AI, Multi | Semua sebelumnya |
| | **RILIS v3.0** | **Cloud & AI** | Phase 13 |

---

## 23. Definition of Done

### 23.1 Definition of Done — Umum (Setiap Fase)

| # | Kriteria |
|---|---|
| DoD-G01 | Semua fitur dalam fase telah diimplementasikan |
| DoD-G02 | Semua komponen UI baru telah ditambahkan ke Component Library |
| DoD-G03 | Semua fitur baru telah ditambahkan ke Feature List (status = Completed) |
| DoD-G04 | Database schema telah diperbarui jika ada perubahan |
| DoD-G05 | Business rules yang relevan telah diimplementasikan |
| DoD-G06 | Tidak ada functional bug yang diketahui (critical/high) |
| DoD-G07 | Aplikasi berjalan offline tanpa error |
| DoD-G08 | Lighthouse PWA score >= 90 |
| DoD-G09 | Tidak ada inline CSS atau JavaScript |
| DoD-G10 | CHANGELOG.md telah diperbarui |

### 23.2 Definition of Done — Per Fase

| Phase | DoD Spesifik |
|---|---|
| Phase 0 | Lihat section 6.6 |
| Phase 1 | Lihat section 7.6 |
| Phase 2 | Lihat section 8.7 |
| Phase 3 | Lihat section 9.7 |
| Phase 4 | Lihat section 10.7 |
| Phase 5 | Lihat section 11.7 |
| Phase 6 | Lihat section 12.7 |
| Phase 7 | Lihat section 13.7 |
| Phase 8 | Lihat section 14.7 |
| Phase 9 | Lihat section 15.7 |
| Phase 10 | Lihat section 16.6 |
| Phase 11 | Lihat section 17.7 |
| Phase 12 | Lihat section 18.7 |
| Phase 13 | Lihat section 19.6 |

---

## 24. Dokumentasi

### 24.1 Dokumen yang Diperbarui Setiap Fase

| Dokumen | Update Setiap Fase? | Perubahan |
|---|---|---|
| `01_PROJECT_BLUEPRINT.md` | Jika ada perubahan arsitektur | Stack, struktur folder, aturan |
| `02_DATABASE_SCHEMA.md` | Jika ada perubahan entitas | Tabel baru, field baru, index |
| `03_BUSINESS_RULES.md` | Jika ada aturan baru | Aturan bisnis baru |
| `04_UI_DESIGN_SYSTEM.md` | Jika ada komponen visual baru | Warna, komponen, template |
| `05_COMPONENT_LIBRARY.md` | **Ya — setiap fase** | Komponen baru, perubahan spesifikasi |
| `06_FEATURE_LIST.md` | **Ya — setiap fase** | Status fitur, perubahan prioritas |
| `07_ROADMAP.md` | **Ya — setiap rilis** | Timeline, fase baru, perubahan prioritas |
| `CHANGELOG.md` | **Ya — setiap rilis** | Catatan perubahan per versi |

### 24.2 Template CHANGELOG Entry

```markdown
## [v1.0.0] - 2026-08-15

### Added
- POS Main Screen dengan product grid dan cart
- Payment Cash dan Non-Cash
- Backup dan Restore data
- ...

### Changed
- ...

### Fixed
- ...
```

---

## 25. Continuous Improvement

### 25.1 Kapan Roadmap Diperbarui?

| Situasi | Tindakan |
|---|---|
| **Fitur baru diminta** | Evaluasi nilai bisnis vs effort. Masukkan ke fase yang sesuai atau buat fase baru. Update `06_FEATURE_LIST.md` |
| **Perubahan kebutuhan** | Jika perubahan besar, evaluasi ulang prioritas fase. Update `03_BUSINESS_RULES.md` |
| **Bug besar ditemukan** | Buat hotfix phase — selesaikan sebelum lanjut ke fase berikutnya |
| **Perubahan prioritas bisnis** | Pindahkan fase ke depan/belakang sesuai prioritas baru |
| **Feedback pengguna** | Evaluasi setelah setiap rilis. Masukkan feedback sebagai fitur baru di fase berikutnya |
| **Teknologi baru tersedia** | Evaluasi apakah teknologi baru layak diadopsi. Tidak mengubah roadmap tanpa alasan kuat |

### 25.2 Proses Update Roadmap

```
1. Identifikasi perubahan (fitur baru, bug, prioritas)
2. Evaluasi dampak terhadap fase yang sedang berjalan
3. Update dokumen terkait (Feature List, Roadmap)
4. Komunikasikan ke tim
5. Lanjutkan pengembangan dengan roadmap yang sudah diperbarui
```

### 25.3 Prinsip Perubahan

| Prinsip | Deskripsi |
|---|---|
| **Jangan ubah fase yang sedang berjalan** | Kecuali ada force majeure. Fase yang sedang dikerjakan harus diselesaikan |
| **Fitur baru masuk ke fase berikutnya** | Kecuali fitur tersebut blocking fase saat ini |
| **Dokumentasi diperbarui sebelum kode** | Ubah dokumen dulu, baru implementasi |
| **Evaluasi setiap rilis** | Setelah rilis, evaluasi roadmap untuk rilis berikutnya |

### 25.4 Siklus Rilis

```
Perencanaan → Dokumentasi → Implementasi → Pengujian → Rilis → Evaluasi
     │                                                          │
     └────────────────────── Umpan Balik ───────────────────────┘
```

| Fase | Aktivitas |
|---|---|
| **Perencanaan** | Tentukan fitur untuk rilis berikutnya. Update roadmap |
| **Dokumentasi** | Update dokumen sebelum menulis kode |
| **Implementasi** | Bangun fitur sesuai dokumen. Update status di Feature List |
| **Pengujian** | Uji acceptance criteria. Regression test |
| **Rilis** | Update CHANGELOG. Tag versi. Rilis |
| **Evaluasi** | Kumpulkan feedback. Evaluasi roadmap |

---

> **Dokumen ini adalah Roadmap resmi pengembangan POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md` s.d. `06_FEATURE_LIST.md`.

---

*POS Offline PWA — Roadmap v1.0.0 — 15 Juli 2026*
