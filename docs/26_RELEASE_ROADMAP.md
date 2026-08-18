# 26_RELEASE_ROADMAP.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Prinsip Kejujuran Audit](#2-prinsip-kejujuran-audit)
3. [Status Proyek Saat Ini](#3-status-proyek-saat-ini)
4. [Release Strategy](#4-release-strategy)
5. [Versi Rilis](#5-versi-rilis)
6. [Versi 1.0 — POS Offline Stabil untuk UMKM](#6-versi-10--pos-offline-stabil-untuk-umkm)
7. [Roadmap Modul Inti](#7-roadmap-modul-inti)
8. [Roadmap Inventory](#8-roadmap-inventory)
9. [Roadmap Sales](#9-roadmap-sales)
10. [Roadmap Report](#10-roadmap-report)
11. [Versi 1.1 — Stabilization](#11-versi-11--stabilization)
12. [Versi 1.2 — Advanced POS](#12-versi-12--advanced-pos)
13. [Versi 1.5 — Advanced Inventory](#13-versi-15--advanced-inventory)
14. [Versi 2.0 — Future Architecture](#14-versi-20--future-architecture)
15. [Priority Matrix](#15-priority-matrix)
16. [Dependency Roadmap](#16-dependency-roadmap)
17. [Milestone](#17-milestone)
18. [Definition of Done](#18-definition-of-done)
19. [Release Checklist](#19-release-checklist)
20. [Risiko & Mitigasi](#20-risiko--mitigasi)
21. [Lampiran — Definisi Status](#21-lampiran--definisi-status)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **roadmap rilis (release roadmap)** resmi untuk aplikasi **POS Offline PWA**. Berbeda dari `07_ROADMAP.md` yang berbasis **fase pengembangan**, dokumen ini berbasis **versi rilis** (v1.0, v1.1, v1.2, v1.5, v2.0) dan berfokus pada:

- Fitur apa yang harus selesai di setiap versi.
- Urutan pengerjaan (dependency roadmap).
- Prioritas (P0–P3).
- Status faktual setiap fitur (IMPLEMENTED / PARTIAL / PLANNED / TODO / BROKEN / DEPRECATED).
- Definisi selesai (Definition of Done) dan checklist rilis.

### 1.2 Acuan

| Dokumen | Fungsi |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, batasan |
| `07_ROADMAP.md` | Fase pengembangan & timeline konseptual |
| `23_DATABASE_DESIGN.md` | Skema & tabel database |
| `20_TESTING_GUIDE.md` | Standar pengujian 9 level |
| `21_DEPLOYMENT_GUIDE.md` | Deployment & opsi masa depan |
| `22_SECURITY_GUIDE.md` | Keamanan, RBAC, hashing |
| `25_ARCHITECTURE_DECISION_RECORDS.md` | Keputusan arsitektur & gap dokumentasi |
| `06_FEATURE_LIST.md` | Daftar fitur lengkap |
| `CHANGELOG.md` | Riwayat perubahan nyata |

### 1.3 Keterkaitan dengan Roadmap Fase

Roadmap versi ini **menggantikan** penomoran versi konseptual di `07_ROADMAP.md`. Pemetaannya:

| Roadmap Fase (`07_ROADMAP.md`) | Roadmap Rilis (dokumen ini) |
|---|---|
| Phase 0–1 (Foundation & Setup) | Sudah tuntas (fondasi) |
| Phase 2–4 (Core, Master Data, Dashboard) | v1.0 (sebagian sudah ada) |
| Phase 5–9 (Sales, Inventory, Purchase, Finance, Reporting) | v1.0 |
| Phase 10 (Enhancement) | v1.1 |
| Phase 11–12 (Cafe, Loyalty) | v1.2 / v2.0 |
| Phase 13 (Cloud & AI) | v2.0 |

---

## 2. Prinsip Kejujuran Audit

Roadmap ini ditulis **berdasarkan audit kode aktual**, bukan berdasarkan dokumentasi saja.

### 2.1 Aturan

1. Fitur tidak dianggap selesai hanya karena tercantum di dokumentasi.
2. Setiap fitur diberi status dari salah satu: **IMPLEMENTED**, **PARTIAL**, **PLANNED**, **TODO**, **BROKEN**, **DEPRECATED** (lihat Lampiran).
3. Fitur dengan file ada tapi isi kosong/stub diberi status **TODO**, bukan IMPLEMENTED.
4. Fitur yang berfungsi sebagian diberi status **PARTIAL** dengan catatan.
5. Versi rilis bersifat **target** — tanggal di dalam dokumen ini adalah estimasi konseptual, bukan komitmen.
6. Tidak ada asumsi bahwa tabel database = fitur berfungsi.

### 2.2 Metode Audit

| Area | Metode |
|---|---|
| Source code (`src/`) | Pembacaan file per modul, pengecekan body fungsi vs stub/TODO |
| Skema database | `src/database/schema.js`, `db.js`, `seeds.js` |
| PWA | `service-worker.js`, `src/pwa/`, `manifest.json` |
| Testing | `package.json` scripts, `tests/` isi file |
| Deployment | `package.json`, `index.html`, `21_DEPLOYMENT_GUIDE.md` |
| Dokumen | `docs/01` s.d. `docs/25` |

---

## 3. Status Proyek Saat Ini

### 3.1 Faktur Versi

| Aspek | Nilai Aktual |
|---|---|
| Version `package.json` | `1.0.0` |
| Versi terakhir di `CHANGELOG.md` | `v0.1.0` (2026-07-29) |
| Schema database | Dexie `PosOfflineDB`, `SCHEMA_VERSION = 2` |
| Jumlah tabel | **34 tabel** |
| Service Worker cache | **v4** (`pos-app-v4`, `pos-cdn-v4`, `pos-dynamic-v4`) |
| Type module | ES Modules (`"type": "module"`) |
| Build step | Tidak ada (aplikasi berjalan langsung dari source) |
| Dependensi CDN | Bootstrap CSS 5.3.3, Bootstrap Icons 1.11.3, Dexie 4.0.10, Chart.js 4.4.7, XLSX 0.18.5, jsPDF 2.5.2 |

### 3.2 Status Modul (`src/modules/`)

| Modul | `index.js` | Service | Repository | Status |
|---|---|---|---|---|
| product | ✅ | ✅ | ✅ | **IMPLEMENTED** (CRUD + import/export Excel) |
| purchase | ✅ | ✅ | ✅ | **IMPLEMENTED** (PO + receive + status workflow) |
| customer | ✅ | ✅ | ✅ | **IMPLEMENTED** (CRUD) |
| supplier | ✅ | ✅ | ✅ | **IMPLEMENTED** (CRUD) |
| report | ✅ | ✅ | ✅ | **PARTIAL** (4 dari 12+ jenis laporan) |
| sales | ✅ | ⚠️ | ⚠️ | **PARTIAL** (hanya history: list, detail, delete; **tidak ada checkout/POS**) |
| inventory | 🚧 | 🚧 | 🚧 | **TODO** (stub Phase 6) |
| finance | 🚧 | 🚧 | 🚧 | **TODO** (stub Phase 8) |
| shift | 🚧 | 🚧 | 🚧 | **TODO** (stub Phase 8) |
| backup (modul) | 🚧 | 🚧 | 🚧 | **TODO** (stub; backup nyata di `src/database/`) |
| cafe | 🚧 | 🚧 | 🚧 | **TODO** (stub Phase 11 / v2.0) |
| loyalty | 🚧 | 🚧 | 🚧 | **TODO** (stub Phase 12 / v1.2) |

### 3.3 Status Halaman (`src/pages/`)

| Halaman | Status | Catatan |
|---|---|---|
| Login / First Run / Lock Screen / Not Found | ✅ IMPLEMENTED | Lengkap dengan owner onboarding |
| Dashboard | ⚠️ PARTIAL | KPI statis (Rp 0 / 0 / —), belum data-driven |
| Produk | ✅ IMPLEMENTED | CRUD + Excel import/export |
| Pembelian | ✅ IMPLEMENTED | Buat PO, detail, terima barang, hapus |
| Pelanggan | ✅ IMPLEMENTED | CRUD |
| Supplier | ✅ IMPLEMENTED | CRUD |
| Penjualan | ⚠️ PARTIAL | Hanya riwayat + detail + hapus |
| Laporan | ⚠️ PARTIAL | 4 jenis laporan (summary) |
| Pengaturan | ✅ IMPLEMENTED | 8 tab: store, users, roles, permissions, backup, database, audit |
| POS | ❌ PLANNED | Placeholder "Coming Soon" |
| Inventori | ❌ PLANNED | Placeholder "Coming Soon" |
| Kategori | ❌ PLANNED | Placeholder "Coming Soon" (schema+seed ada) |
| Satuan | ❌ PLANNED | Tidak ada halaman CRUD terpisah (via produk/seeds) |
| Cafe | 🚧 TODO | Stub |

### 3.4 Status Infrastruktur

| Area | Status | Catatan |
|---|---|---|
| Auth (`src/auth/`) | ✅ IMPLEMENTED | login, session (device-bound, expiry), logout, guard |
| RBAC | ✅ IMPLEMENTED | 3 role (Owner, Admin, Kasir) via `ROLE_PERMISSIONS` |
| User / Role / Permission service | ✅ IMPLEMENTED | `user-service.js`, `role-service.js`, `permission-service.js` |
| Router | ✅ IMPLEMENTED | Hash router kustom; ada 2 sistem paralel (`router.js` & `routes.js`) |
| Base Repository | ✅ IMPLEMENTED | CRUD + soft delete + pagination |
| Backup / Restore | ✅ IMPLEMENTED | `src/database/backup.js` + `restore.js` (SHA-256 checksum) |
| PWA | ✅ IMPLEMENTED | manifest, register, install, cache manager, offline.html |
| Theme | ✅ IMPLEMENTED | Light/dark via `theme-service.js` |
| Idle timeout / Lock screen | ⚠️ PARTIAL | ada; `isScreenLocked()` hardcoded `false` |
| Error handler / Logger | ✅ IMPLEMENTED | `src/utils/error-handler.js`, `logger.js` |
| Audit writer | ❌ BROKEN/PARTIAL | Tabel ada, **tidak ada penulis** — audit page hanya baca, tabel tetap kosong |
| Hashing password | ⚠️ GAP | Aktual **SHA-256 tanpa salt**; target PBKDF2+salt belum diterapkan |
| Testing | ❌ TODO | Semua file test adalah stub; **tidak ada test runner** (`package.json` tanpa script `test`) |
| Service Worker precache | ⚠️ GAP | Daftar `APP_ASSETS` tidak memuat file yang lebih baru (pos-page, products-page, sales-page, dst.) |
| Scripts (`scripts/`) | ❌ TODO | `seed-data.js` & `validate-structure.js` tidak ada |
| Constants/Config stubs | 🚧 TODO | `types.js`, `roles.js`, `permissions.js`, `status.js`, `payment.js`, `feature.config.js`, `performance.config.js` masih stub |
| Utils/helpers | ⚠️ PARTIAL | beberapa util & `print-helper.js` masih stub |

### 3.5 Kesimpulan Audit

> **Kondisi saat ini bukan v1.0 yang layak rilis.** Fitur inti POS (checkout, keranjang, pembayaran, struk) **belum ada**. Yang sudah solid: auth, RBAC, master data (produk/pelanggan/supplier), pembelian, backup/restore, PWA, dan sebagian laporan.
>
> Untuk mencapai **v1.0**, pekerjaan terbesar adalah **membangun alur transaksi POS lengkap** beserta **modul inventory** dan **finance/shift** yang menjadi dependensinya, lalu **menstabilkan** dengan test runner & perbaikan cache SW.

---

## 4. Release Strategy

### 4.1 Alur Rilis

```
Development
     │
     ▼
   Alpha  ──► Beta  ──► Release Candidate (RC)  ──► v1.0
     │                        │
     ▼                        ▼
  Fitur baru               Hotfix / Patch  ──► v1.0.x
                                    │
                                    ▼
                              v1.1 (stabilisasi)
                                    │
                                    ▼
                              v1.2 (advanced POS)
                                    │
                                    ▼
                              v1.5 (advanced inventory)
                                    │
                                    ▼
                              v2.0 (future architecture)
```

### 4.2 Tahapan

| Tahap | Tujuan | Kriteria Masuk | Kriteria Keluar |
|---|---|---|---|
| **Development** | Menulis fitur per milestone | Task siap di sprint | Fitur lulus unit/integration test, UI selesai |
| **Alpha** | Fitur inti berfungsi di lingkungan dev | Fitur P0/P1 selesai | Tidak ada bug P0 (critical) |
| **Beta** | Uji di lingkungan pengguna nyata (sebagian) | Alpha stabil | Tidak ada bug P0/P1, data aman |
| **Release Candidate** | Fitur frozen, hanya bug fix | Beta stabil | Semua regression lulus, checklist rilis lengkap |
| **v1.0** | Rilis stabil untuk UMKM | RC lulus | DoD v1.0 terpenuhi |
| **v1.x** | Stabilisasi & fitur bertahap | Umpan balik v1.0 | Roadmap v1.x terpenuhi |
| **v2.0** | Arsitektur masa depan | v1.5 stabil | DoD v2.0 terpenuhi |

### 4.3 Kebijakan Semver

- **Major (x.0.0)** — perubahan arsitektur besar / arsitektur cloud, multi-store.
- **Minor (1.x.0)** — fitur baru yang kompatibel ke belakang.
- **Patch (1.0.x)** — bug fix, perbaikan kecil, tanpa fitur baru.
- Setiap rilis wajib menaikkan `CACHE_VERSION` service worker.

---

## 5. Versi Rilis

| Versi | Tema | Target Fitur Utama | Status Rilis |
|---|---|---|---|
| **v1.0** | MVP POS Offline | POS checkout, inventory, shift/cash, laporan, stabil | **TARGET (belum)** |
| **v1.1** | Stabilization | Bug fix, performance, UX, testing, backup/recovery | Rencana |
| **v1.2** | Advanced POS | Barcode, printer, diskon lanjutan, promosi, loyalitas | Rencana |
| **v1.5** | Advanced Inventory | Recipe/BOM, production, multi warehouse, laporan lanjutan | Rencana |
| **v2.0** | Future Architecture | Cloud sync, multi store, multi device, REST API, mobile/desktop | Rencana |

---

## 6. Versi 1.0 — POS Offline Stabil untuk UMKM

### 6.1 Target

> POS Offline yang **stabil dan dapat dioperasikan** untuk usaha kecil-menengah: kasir dapat melakukan transaksi jual, mengelola stok, membuka/menutup shift, dan melihat laporan inti — semuanya **100% offline**.

### 6.2 Skala Prioritas

| Prioritas | Definisi |
|---|---|
| **P0 — Critical** | Wajib ada; tanpa ini aplikasi tidak dapat beroperasi |
| **P1 — High** | Sangat penting; memperlambat/merugikan jika tidak ada |
| **P2 — Medium** | Penting tapi bisa ditunda ke v1.1 bila molor |
| **P3 — Low** | Bagus untuk dimiliki; tidak menghalangi rilis |

### 6.3 Pekerjaan P0 untuk v1.0

| # | Item | Alasan |
|---|---|---|
| P0-1 | **POS checkout (keranjang → bayar → simpan)** | Inti aplikasi — saat ini tidak ada |
| P0-2 | **Invoice/struk number auto-generate** | Legalitas transaksi |
| P0-3 | **Pengurangan stok otomatis saat transaksi PAID** | Konsistensi stok |
| P0-4 | **Modul inventory** (stock movement + adjustment) | Stok adalah aset |
| P0-5 | **Pembuatan stok awal (opening stock)** | Sebelum jual harus ada stok |
| P0-6 | **Dashboard KPI data-driven** | Monitoring bisnis harian |
| P0-7 | **Test runner dikonfigurasi + unit test inti** | Jaminan kualitas |
| P0-8 | **Perbaikan precache Service Worker** | File baru harus ter-cache |

### 6.4 Prioritas Modul di v1.0

| Modul | Prioritas | Status Awal | Target v1.0 |
|---|---|---|---|
| Authentication | P0 | IMPLEMENTED | Stabil + hardening (PBKDF2) |
| Sales (POS) | P0 | PARTIAL | **IMPLEMENTED penuh** |
| Inventory | P0 | TODO | IMPLEMENTED (inti) |
| Dashboard | P1 | PARTIAL | IMPLEMENTED |
| Produk | P0 | IMPLEMENTED | IMPLEMENTED (tambah kategori/satuan page) |
| Kategori | P1 | PLANNED | IMPLEMENTED (CRUD page) |
| Satuan | P1 | PLANNED | IMPLEMENTED (CRUD page) |
| Supplier | P1 | IMPLEMENTED | IMPLEMENTED |
| Customer | P1 | IMPLEMENTED | IMPLEMENTED |
| Purchase | P1 | IMPLEMENTED | IMPLEMENTED (+ integrasi stok saat receive) |
| Payment (Cash) | P0 | PLANNED | IMPLEMENTED |
| Cashier / Shift | P1 | TODO | IMPLEMENTED |
| Reports | P1 | PARTIAL | IMPLEMENTED (inti: sales, purchase, stock, cash) |
| Settings | P1 | IMPLEMENTED | IMPLEMENTED |
| Audit Log | P1 | BROKEN (no writer) | IMPLEMENTED (writer) |
| Backup / Restore | P0 | IMPLEMENTED | IMPLEMENTED (+ auto-backup sebelum restore) |
| PWA / Offline | P0 | IMPLEMENTED | IMPLEMENTED (perbaiki precache) |

---

## 7. Roadmap Modul Inti

Detail per modul untuk v1.0 s.d. masa depan.

| Modul | Fitur | Status Saat Ini | Release | Prioritas |
|---|---|---|---|---|
| **Authentication** | Login username/password | IMPLEMENTED | v1.0 | P0 |
| | Session (device-bound, expiry) | IMPLEMENTED | v1.0 | P0 |
| | Logout | IMPLEMENTED | v1.0 | P0 |
| | Lock screen | PARTIAL (idle check hardcoded) | v1.0 | P2 |
| | Hashing PBKDF2 + salt | PLANNED (gap) | v1.0 | P1 |
| **Dashboard** | KPI cards live | PARTIAL (statis) | v1.0 | P1 |
| | Penjualan hari ini | PLANNED | v1.0 | P1 |
| | Low stock alert | PLANNED | v1.0 | P1 |
| | Recent transactions | PLANNED | v1.0 | P2 |
| | Quick actions | PARTIAL | v1.0 | P2 |
| **Produk** | CRUD + SKU + barcode field | IMPLEMENTED | v1.0 | P0 |
| | Import/Export Excel | IMPLEMENTED | v1.0 | P2 |
| | Harga jual/beli, min stock | IMPLEMENTED | v1.0 | P0 |
| | Price history | PLANNED | v1.1 | P3 |
| **Kategori** | CRUD parent-child (maks 3 level) | PLANNED (schema ada) | v1.0 | P1 |
| **Satuan** | CRUD satuan | PLANNED (schema ada) | v1.0 | P1 |
| **Supplier** | CRUD | IMPLEMENTED | v1.0 | P1 |
| **Customer** | CRUD + deteksi duplikat phone | IMPLEMENTED | v1.0 | P1 |
| **Inventory** | Stock movement history | TODO | v1.0 | P0 |
| | Stock adjustment | TODO | v1.0 | P0 |
| | Minimum stock alert | TODO | v1.0 | P1 |
| | Stock opname | PLANNED | v1.1 | P2 |
| | Multi warehouse | PLANNED | v1.5 | P1 |
| **Purchase** | PO workflow (draft/ordered/received/cancel) | IMPLEMENTED | v1.0 | P1 |
| | Receive menambah stok | PARTIAL (perlu integrasi) | v1.0 | P0 |
| | Purchase history + filter | IMPLEMENTED | v1.0 | P2 |
| | Supplier ledger | PLANNED | v1.1 | P3 |
| **Sales** | POS checkout | TODO | v1.0 | P0 |
| | Riwayat transaksi | IMPLEMENTED | v1.0 | P0 |
| | Void | PLANNED | v1.0 | P1 |
| | Return/refund | PLANNED | v1.1 | P1 |
| **Payment** | Cash (input uang, kembalian) | PLANNED | v1.0 | P0 |
| | Non-cash (debit/kredit/transfer) | PLANNED | v1.0 | P1 |
| | QRIS | PLANNED | v1.1 | P2 |
| | Multiple payment | PLANNED | v1.1 | P2 |
| **Cashier / Shift** | Open shift (opening balance) | TODO | v1.0 | P1 |
| | Close shift (closing + selisih) | TODO | v1.0 | P1 |
| | Shift report | PLANNED | v1.1 | P2 |
| **Reports** | Sales summary | PARTIAL | v1.0 | P0 |
| | Stock summary | PARTIAL | v1.0 | P1 |
| | Purchase summary | IMPLEMENTED | v1.0 | P1 |
| | Cash flow report | PLANNED | v1.0 | P1 |
| | Profit report | PLANNED | v1.1 | P2 |
| **Settings** | Store profile | IMPLEMENTED | v1.0 | P1 |
| | Users / Roles / Permissions | IMPLEMENTED | v1.0 | P1 |
| | Database maintenance | IMPLEMENTED | v1.0 | P2 |
| **Audit Log** | Tabel tersedia | IMPLEMENTED (schema) | v1.0 | P1 |
| | Writer (catat aksi) | BROKEN (tidak ada) | v1.0 | P1 |
| **Backup** | Export JSON + checksum | IMPLEMENTED | v1.0 | P0 |
| **Restore** | Validate + restore | IMPLEMENTED | v1.0 | P0 |
| | Auto-backup sebelum restore | PLANNED | v1.0 | P1 |
| **PWA** | Installable, offline | IMPLEMENTED | v1.0 | P0 |
| | Precache lengkap | PARTIAL (stale list) | v1.0 | P0 |
| **Offline** | Semua modul berfungsi tanpa jaringan | IMPLEMENTED (inti) | v1.0 | P0 |

---

## 8. Roadmap Inventory

Fokus pada sistem stok yang akurat & auditable. Konsep: `inventories` (stok terkini) + `stockMovements` (mutasi) + `products.stock`.

| Fitur | Deskripsi | Status Saat Ini | Release | Prioritas |
|---|---|---|---|---|
| **Opening Stock** | Set stok awal produk saat setup | PLANNED (tabel inventories) | v1.0 | P0 |
| **Purchase** | Stok bertambah saat PO received | PARTIAL (PO ada, integrasi stok belum) | v1.0 | P0 |
| **Sale** | Stok berkurang saat transaksi PAID | PLANNED (alur belum ada) | v1.0 | P0 |
| **Return** | Stok kembali saat refund | PLANNED | v1.1 | P1 |
| **Adjustment** | Koreksi manual dengan alasan | TODO (stub) | v1.0 | P0 |
| **Stock Opname** | Hitung fisik vs sistem, apply selisih | PLANNED (tabel ada) | v1.1 | P2 |
| **Transfer** | Pindah stok antar gudang | PLANNED | v1.5 | P1 |
| **Stock Movement** | Riwayat semua mutasi stok | PARTIAL (tabel ada, writer belum) | v1.0 | P0 |
| **Recipe** | Resep produk jadi dari bahan baku | PLANNED (belum di skema) | v1.5 | P1 |
| **BOM** | Bill of materials per recipe | PLANNED (belum di skema) | v1.5 | P1 |
| **HPP** | Hitung harga pokok (dari BOM/bahan) | PLANNED | v1.5 | P1 |

---

## 9. Roadmap Sales

Fokus pada alur kasir: pilih produk → keranjang → diskon → bayar → struk.

| Fitur | Deskripsi | Status Saat Ini | Release | Prioritas |
|---|---|---|---|---|
| **POS** | Layar utama kasir (grid produk + cart) | TODO (placeholder) | v1.0 | P0 |
| **Cart** | Tambah/hapus/ubah qty | PLANNED | v1.0 | P0 |
| **Discount** | Diskon per item & per transaksi | PLANNED | v1.0 | P2 |
| **Tax** | Perhitungan pajak | PLANNED (tabel taxes) | v1.0 | P2 |
| **Payment** | Cash + non-cash | PLANNED | v1.0 | P0 |
| **Multiple Payment** | Gabungan 2+ metode | PLANNED | v1.1 | P2 |
| **Hold Bill** | Tunda transaksi, lanjutkan nanti | PLANNED | v1.0 | P2 |
| **Resume Bill** | Lanjutkan bill yang di-hold | PLANNED | v1.0 | P2 |
| **Void** | Batalkan transaksi (stok kembali) | PLANNED | v1.0 | P1 |
| **Return** | Refund penuh/parsial | PLANNED | v1.1 | P1 |
| **Receipt** | Cetak struk (browser print) | PLANNED (print-helper stub) | v1.0 | P1 |

---

## 10. Roadmap Report

Fokus pada laporan untuk pengambilan keputusan. Modul report ada; perlu ditambah jenis & rentang waktu.

| Laporan | Rentang Waktu | Status Saat Ini | Release | Prioritas |
|---|---|---|---|---|
| **Daily** | Per hari | PARTIAL (summary by date filter) | v1.0 | P0 |
| **Weekly** | Per minggu | PARTIAL | v1.0 | P1 |
| **Monthly** | Per bulan | PARTIAL | v1.0 | P1 |
| **Yearly** | Per tahun | PARTIAL | v1.1 | P2 |
| **Sales** | Nilai & qty penjualan | PARTIAL (sales summary + top products) | v1.0 | P0 |
| **Purchase** | Pembelian per periode | IMPLEMENTED (purchase summary) | v1.0 | P1 |
| **Profit** | Laba (revenue - HPP) | PLANNED | v1.1 | P2 |
| **Stock** | Nilai & stok per produk | PARTIAL (stock summary) | v1.0 | P1 |
| **Cash** | Arus kas masuk/keluar | PLANNED | v1.0 | P1 |
| **Product** | Kinerja produk | PARTIAL (top products) | v1.0 | P2 |
| **Customer** | Pembelian per pelanggan | PLANNED | v1.1 | P2 |
| **Supplier** | Pembelian per supplier | PLANNED | v1.1 | P3 |
| **Shift** | Rekap per shift | PLANNED | v1.1 | P2 |
| **Tax** | Rekap pajak | PLANNED | v1.1 | P3 |

---

## 11. Versi 1.1 — Stabilization

Tujuan: memperkuat fondasi v1.0 — **bukan menambah fitur besar**, melainkan memperbaiki kualitas, performa, pengalaman pengguna, dan keselamatan data.

### 11.1 Cakupan

| Area | Item | Status Awal | Prioritas |
|---|---|---|---|
| **Bug Fix** | Penutupan semua bug P0/P1 dari v1.0 | — | P0 |
| **Performance** | Indexing Dexie, pagination konsisten, batas agregasi 30 hari | PARTIAL | P1 |
| **UX Improvement** | Feedback loading, validasi real-time, empty states, shortcut lengkap | PARTIAL | P1 |
| **Testing** | Unit test inti, integration test (sales, inventory), regression suite | TODO | P0 |
| **Backup** | Auto-backup sebelum restore, peringatan penyimpanan >80% | PARTIAL | P1 |
| **Recovery** | Uji skenario data hilang/corrupt, panduan pemulihan | PARTIAL | P1 |
| **Security** | Migrasi hashing PBKDF2 + salt, audit writer aktif | GAP | P1 |
| **Offline Test** | Verifikasi semua fitur offline penuh | TODO | P1 |

### 11.2 Fitur Tambahan Kecil (Deferred dari v1.0)

| Fitur | Prioritas |
|---|---|
| Return/refund transaksi | P1 |
| Multiple payment (mixed) | P2 |
| QRIS payment (simulasi offline) | P2 |
| Stock opname | P2 |
| Voucher / promo code | P2 |
| Profit report | P2 |
| Customer report | P2 |
| Export PDF/Excel untuk semua laporan | P2 |
| Price history produk | P3 |

### 11.3 Exit Criteria

- Tidak ada bug P0/P1 terbuka.
- Coverage test inti ≥ 70% (modul sales, inventory, product, auth).
- Lighthouse PWA score ≥ 90.
- Backup/restore tervalidasi di 3 skenario (kosong, rusak, valid).
- Tidak ada degradasi performa pada 10.000 transaksi.

---

## 12. Versi 1.2 — Advanced POS

Tujuan: meningkatkan kemampuan POS untuk efisiensi kasir & keterlibatan pelanggan.

| Fitur | Deskripsi | Dependensi | Prioritas |
|---|---|---|---|
| **Barcode** | Scan barcode (hardware USB + kamera), fallback search | Produk (barcode field) | P1 |
| **Printer** | Struk thermal (browser/ESC-POS), layout struk | Receipt v1.0 | P1 |
| **Discount** | Diskon lanjutan (persen/harga, min qty, kategori) | POS v1.0 | P2 |
| **Promotion** | Promo aktif (buy X get Y, diskon periode), kelola promo | Discount | P2 |
| **Customer Loyalty** | Membership, poin earn/redeem, tier (REGULAR/SILVER/GOLD/PLATINUM) | Customer | P2 |
| **Voucher / Promo Code** | Kode voucher dengan aturan | Payment | P2 |
| **Refund / Return** | Refund penuh & parsial dengan stok kembali | Sales v1.0 | P1 |
| **Multiple Payment** | Gabungan beberapa metode dalam satu transaksi | Payment | P2 |
| **Reprint Struk** | Cetak ulang struk transaksi lama | Receipt | P2 |

> Modul `loyalty` (stub) menjadi aktif pada v1.2. Tabel `memberships`, `loyaltyPoints` sudah ada di skema.

### 12.1 Exit Criteria

- Scan barcode menambah produk ke cart < 2 detik.
- Struk bisa dicetak offline.
- Poin otomatis bertambah saat transaksi member.
- Promo & voucher tervalidasi (tidak saling menimpa secara ilegal).

---

## 13. Versi 1.5 — Advanced Inventory

Tujuan: stok lanjutan untuk usaha manufaktur/F&B — resep, produksi, multi gudang, laporan mendalam.

| Fitur | Deskripsi | Dependensi | Prioritas |
|---|---|---|---|
| **Recipe / BOM** | Resep produk dari bahan baku, detail bahan | Inventory v1.0 | P1 |
| **Production** | Proses produksi (input bahan → output produk jadi), catat stok | Recipe | P1 |
| **HPP** | Hitung harga pokok produksi dari BOM | Recipe | P1 |
| **Multi Warehouse** | Stok per gudang, transfer antar gudang | Inventory v1.0 | P1 |
| **Advanced Reporting** | Laporan produksi, nilai stok per gudang, profit per produk | Report + semua di atas | P2 |
| **Stock Opname Lanjutan** | Opname per gudang, approve/adjust | Stock Opname v1.1 | P2 |
| **Recipe check stock** | Cek ketersediaan bahan sebelum produksi | Inventory | P1 |

> **Penting:** Tabel `recipes` dan `recipe_details` **belum ada** di skema — menambahkan ini memerlukan migrasi Dexie (SCHEMA_VERSION 3) dan diperkuat oleh ADR-008.

### 13.1 Exit Criteria

- Produk resep bisa dijual; stok bahan berkurang sesuai BOM saat produksi.
- Transfer antar gudang tercatat sebagai stock movement.
- HPP terhitung otomatis & bisa dilihat di laporan.
- Migrasi skema v2 → v3 lulus dengan data lama tetap ada.

---

## 14. Versi 2.0 — Future Architecture

Tujuan: mengubah arsitektur dari **offline-only** menjadi **offline-first + cloud**. Memerlukan keputusan teknologi baru (lihat ADR-025) dan **persetujuan developer** sebelum implementasi.

### 14.1 Pilar

| Pilar | Deskripsi | Dependensi | Prioritas |
|---|---|---|---|
| **Cloud Sync** | Push/pull data dengan conflict resolution | Seluruh modul stabil | P1 |
| **Multi Store** | Banyak cabang/outlet, data terisolasi per outlet | Cloud Sync | P1 |
| **Multi Device** | Satu akun di banyak perangkat, sinkron real-time | Cloud Sync | P1 |
| **Central Database** | Database terpusat (server/cloud) sebagai source of truth | Cloud Sync | P1 |
| **REST API** | API publik + dokumentasi OpenAPI | Service layer (sudah siap) | P1 |
| **Mobile App** | Aplikasi mobile (TWA/Capacitor) membungkus PWA | PWA | P2 |
| **Android** | Distribusi Android (TWA/PWA2APK/Play Store) | Mobile App | P2 |
| **Desktop** | Aplikasi desktop (Electron/Tauri) | PWA | P2 |
| **ERP Integration** | Konektor ke sistem ERP/akuntansi | REST API | P3 |

### 14.2 Hal yang Belum Diputuskan (Perlu Kajian)

| Keputusan | Status |
|---|---|
| Teknologi cloud (Firebase vs Supabase vs REST API sendiri) | **Belum ditetapkan** |
| Model conflict resolution (timestamp, LWW, manual) | **Belum ditetapkan** |
| Arsitektur multi-outlet (shared DB vs per-outlet) | **Belum ditetapkan** |
| Enkripsi data di cloud | **Belum ditetapkan** |
| Kapasitas & harga server | **Belum ditetapkan** |

### 14.3 Prasyarat Arsitektur yang Sudah Disiapkan

- Repository terpisah → siap diganti ke remote.
- Service terpisah dari UI → siap di-expose REST API.
- Timestamp & soft delete di semua record → siap sinkronisasi.
- PWA → siap multi-device.

### 14.4 Exit Criteria (Indikatif)

- Cloud sync push/pull dengan conflict resolution berfungsi.
- Data per outlet terisolasi & aman.
- REST API terdokumentasi (OpenAPI) dan tervalidasi.
- Aplikasi tetap berfungsi penuh saat offline.

---

## 15. Priority Matrix

**Feature | Priority | Complexity | Dependency | Release | Status**

| Feature | Priority | Complexity | Dependency | Release | Status |
|---|---|---|---|---|---|
| Authentication (login/session/logout) | P0 | Medium | — | v1.0 | IMPLEMENTED |
| RBAC (Owner/Admin/Kasir) | P0 | Medium | Auth | v1.0 | IMPLEMENTED |
| User management | P0 | Medium | Auth, RBAC | v1.0 | IMPLEMENTED |
| Role & permission management | P1 | Medium | RBAC | v1.0 | IMPLEMENTED |
| Hashing PBKDF2 + salt | P1 | Medium | Auth | v1.0 | PLANNED (gap) |
| Lock screen (idle) | P2 | Low | Auth | v1.0 | PARTIAL |
| Dashboard KPI live | P1 | Medium | Sales, Stock | v1.0 | PARTIAL |
| Produk CRUD | P0 | Medium | — | v1.0 | IMPLEMENTED |
| Produk import/export Excel | P2 | Medium | Produk | v1.0 | IMPLEMENTED |
| Kategori CRUD | P1 | Low | Produk | v1.0 | PLANNED |
| Satuan CRUD | P1 | Low | Produk | v1.0 | PLANNED |
| Supplier CRUD | P1 | Low | — | v1.0 | IMPLEMENTED |
| Customer CRUD | P1 | Low | — | v1.0 | IMPLEMENTED |
| Customer loyalty/membership | P2 | Medium | Customer, Sales | v1.2 | TODO (stub) |
| Inventory (movement, adjustment) | P0 | Medium | Produk | v1.0 | TODO (stub) |
| Opening stock | P0 | Low | Inventory | v1.0 | PLANNED |
| Stock opname | P2 | Medium | Inventory | v1.1 | PLANNED |
| Stock transfer antar gudang | P1 | Medium | Inventory, Warehouse | v1.5 | PLANNED |
| Recipe / BOM | P1 | High | Inventory, Produk | v1.5 | PLANNED |
| Production | P1 | High | Recipe | v1.5 | PLANNED |
| HPP | P1 | Medium | Recipe, Purchase | v1.5 | PLANNED |
| Multi warehouse | P1 | High | Inventory | v1.5 | PLANNED |
| Purchase Order + workflow | P1 | High | Supplier, Produk | v1.0 | IMPLEMENTED |
| Purchase receive → +stok | P0 | Medium | Purchase, Inventory | v1.0 | PARTIAL |
| POS checkout | P0 | Extra Large | Produk, Inventory | v1.0 | TODO |
| Cart (tambah/hapus/qty) | P0 | Medium | POS | v1.0 | PLANNED |
| Diskon item & transaksi | P2 | Medium | POS, Sales | v1.0 | PLANNED |
| Tax | P2 | Medium | POS | v1.0 | PLANNED |
| Payment cash | P0 | Medium | POS | v1.0 | PLANNED |
| Payment non-cash | P1 | Medium | Payment | v1.0 | PLANNED |
| Multiple payment | P2 | Medium | Payment | v1.1 | PLANNED |
| QRIS (offline simulation) | P2 | Medium | Payment | v1.1 | PLANNED |
| Hold / resume bill | P2 | Medium | POS | v1.0 | PLANNED |
| Void transaksi | P1 | Medium | POS, Inventory | v1.0 | PLANNED |
| Return / refund | P1 | High | Sales, Inventory | v1.1 | PLANNED |
| Struk / receipt (browser print) | P1 | Medium | Sales | v1.0 | PLANNED (helper stub) |
| Barcode scan | P1 | Medium | Produk, POS | v1.2 | PLANNED |
| Printer thermal | P1 | Medium | Receipt | v1.2 | PLANNED |
| Promo & voucher | P2 | Medium | Discount | v1.2 | PLANNED |
| Shift open/close + selisih | P1 | Medium | Sales, Cash | v1.0 | TODO (stub) |
| Cash flow (kasir) | P1 | Medium | Sales, Shift | v1.0 | PLANNED |
| Expense/income | P2 | Medium | Finance | v1.1 | TODO (stub) |
| Report sales summary | P0 | Medium | Sales | v1.0 | PARTIAL |
| Report purchase summary | P1 | Medium | Purchase | v1.0 | IMPLEMENTED |
| Report stock summary | P1 | Medium | Inventory | v1.0 | PARTIAL |
| Report cash flow | P1 | Medium | Finance, Shift | v1.0 | PLANNED |
| Report profit | P2 | Medium | Sales, HPP | v1.1 | PLANNED |
| Report customer / supplier | P2 | Low | Sales, Purchase | v1.1 | PLANNED |
| Report shift | P2 | Low | Shift | v1.1 | PLANNED |
| Export PDF/Excel semua laporan | P2 | Medium | Report | v1.1 | PLANNED |
| Audit log writer | P1 | Low | Service layer | v1.0 | BROKEN (tidak ada writer) |
| Backup JSON + checksum | P0 | Medium | DB | v1.0 | IMPLEMENTED |
| Restore + validasi | P0 | Medium | DB | v1.0 | IMPLEMENTED |
| Auto-backup sebelum restore | P1 | Low | Restore | v1.0 | PLANNED |
| PWA install + offline | P0 | Medium | — | v1.0 | IMPLEMENTED |
| SW precache lengkap | P0 | Low | PWA | v1.0 | PARTIAL (stale list) |
| Test runner + unit/integration | P0 | Medium | semua modul | v1.0 | TODO |
| Cloud sync | P1 | Extra Large | semua | v2.0 | PLANNED |
| Multi store | P1 | Extra Large | Cloud Sync | v2.0 | PLANNED |
| Multi device | P1 | Large | Cloud Sync | v2.0 | PLANNED |
| REST API | P1 | Extra Large | Service layer | v2.0 | PLANNED |
| Mobile / Android / Desktop | P2 | Large | PWA, API | v2.0 | PLANNED |
| ERP integration | P3 | Extra Large | REST API | v2.0 | PLANNED |

---

## 16. Dependency Roadmap

### 16.1 Diagram Dependensi

```
Authentication
     │
     ▼
RBAC & User Management
     │
     ▼
Master Data (Produk, Kategori, Satuan, Supplier, Customer)
     │
     ├─────────────────────────────┐
     ▼                             ▼
Inventory (opening stock,        Purchase (PO)
movement, adjustment)             │
     │                             │
     └──────────────┬──────────────┘
                    ▼
               POS / Sales (checkout, payment, receipt)
                    │
                    ▼
          Shift & Cash Flow (Finance)
                    │
                    ▼
                  Reports
                    │
                    ▼
         Stabilization (Testing, Backup/Recovery)
                    │
                    ▼
                    v1.0
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
       v1.1      v1.2        v1.5
      (Stabil)  (Barcode,   (Recipe,
                Printer,    Production,
                Loyalty)    Multi-Warehouse)
          └─────────┬──────────┘
                    ▼
                    v2.0
          (Cloud Sync, Multi Store,
           REST API, Mobile/Desktop)
```

### 16.2 Aturan Dependensi Utama

| Fitur | Harus Selesai Sebelum | Karena |
|---|---|---|
| Authentication | Semua fitur | Semua halaman protected |
| RBAC / User | Settings, Shift | Perlu identitas user & peran |
| Master Data | POS, Inventory, Purchase, Reports | POS menjual produk; stok milik produk |
| Inventory | POS (checkout), Reports | POS harus tahu stok; laporan butuh data stok |
| Purchase → Receive | Inventory | Receive menambah stok |
| Sales (checkout) | Shift, Cash Flow, Reports, Dashboard | Transaksi jual menjadi sumber data |
| Shift / Cash | Reports (cash) | Laporan arus kas butuh shift |
| Reports | v1.0 Release | Laporan adalah output bisnis |
| Testing | Stabilization (v1.1) | Tanpa test runner, stabilisasi tidak terukur |
| Recipe/BOM | HPP, Production | HPP dihitung dari BOM |
| HPP | Profit report, Reports | Laba butuh HPP |
| Cloud Sync | Multi Store, Multi Device, Central DB | Semua fitur v2.0 bergantung sinkronisasi |
| REST API | Mobile, Android, Desktop, ERP | Aplikasi eksternal butuh API |

### 16.3 Contoh Rantai Dependensi

```
Authentication
  ↓
User Management
  ↓
Permission
  ↓
Master Data
  ↓
Sales (POS)
  ↓
Reports
  ↓
v1.0
```

---

## 17. Milestone

| Milestone | Nama | Cakupan | Status |
|---|---|---|---|
| **M1** | Foundation | Dokumen 01–25, struktur proyek, arsitektur | ✅ Selesai |
| **M2** | Authentication | Login, session, RBAC, user/role/permission, lock screen | ✅ Selesai |
| **M3** | Master Data | Produk, kategori, satuan, supplier, customer | ⚠️ Sebagian (kategori/satuan page belum) |
| **M4** | Inventory | Opening stock, movement, adjustment, min stock alert | 🔲 Belum (stub) |
| **M5** | Purchase | PO workflow, receive + stok, history | ⚠️ Sebagian (integrasi stok belum) |
| **M6** | Sales | POS checkout, cart, payment, invoice, void, receipt | 🔲 Belum (hanya history) |
| **M7** | Reporting | Sales, purchase, stock, cash, profit, export | ⚠️ Sebagian (4 jenis) |
| **M8** | Stabilization | Test runner, bug fix, performance, backup/recovery, security | 🔲 Belum |
| **M9** | v1.0 Release | RC + checklist rilis + rilis stabil | 🔲 Target |
| **M10** | v2.0 | Cloud sync, multi store, REST API, mobile/desktop | 🔲 Rencana |

### 17.1 Urutan Milestone

```
M1 → M2 → M3 → (M4 & M5) → M6 → M7 → M8 → M9 (v1.0)
                                        ↓
                                M9b (v1.1) → M9c (v1.2) → M9d (v1.5)
                                        ↓
                                       M10 (v2.0)
```

### 17.2 Exit Criteria per Milestone

| Milestone | Kriteria Keluar |
|---|---|
| M1 | Semua dokumen 01–25 lengkap & konsisten |
| M2 | Login/logout, session expiry, RBAC 3 role, user CRUD berfungsi |
| M3 | CRUD produk/kategori/satuan/supplier/customer + search + pagination |
| M4 | Stok tercatat, adjustment berfungsi, min stock alert |
| M5 | PO dibuat/order/receive, stok bertambah saat receive |
| M6 | Transaksi jual penuh: cart → bayar → simpan → stok turun → struk |
| M7 | Laporan inti (sales/purchase/stock/cash) + export |
| M8 | Test lulus, bug P0/P1 nol, performa & backup/recovery terverifikasi |
| M9 | Checklist rilis v1.0 100% terpenuhi |
| M10 | Arsitektur cloud berfungsi sesuai DoD v2.0 |

---

## 18. Definition of Done

Sebuah fitur **hanya dianggap selesai** jika **semua** kriteria di bawah terpenuhi.

### 18.1 Kriteria Umum (Setiap Fitur)

| # | Kriteria | Keterangan |
|---|---|---|
| DoD-1 | **Code selesai** | Implementasi sesuai coding standard (`19_DEVELOPMENT_STANDARDS.md`) |
| DoD-2 | **Business Rules selesai** | Sesuai `03_BUSINESS_RULES.md` / `17_BUSINESS_RULES.md` |
| DoD-3 | **Validation selesai** | Validasi UI + business + repository |
| DoD-4 | **Testing selesai** | Unit/integration test untuk fitur ada & lulus |
| DoD-5 | **UI selesai** | Sesuai design system, berfungsi di desktop & mobile, dark mode |
| DoD-6 | **Security selesai** | RBAC, input sanitasi, tidak ada data sensitif bocor |
| DoD-7 | **Documentation selesai** | Fitur dicatat di feature list, changelog, komponen/library |
| DoD-8 | **Regression test lulus** | Fitur lain yang terdampak tidak rusak |

### 18.2 Kriteria Khusus

| Area | Kriteria Tambahan |
|---|---|
| Transaksi (Sales/Purchase) | Numerik invoice/PO, stok konsisten setelah commit, rollback bila gagal |
| Inventory | Setiap mutasi stok memiliki stock movement + user + timestamp |
| Auth | Session valid, logout bersih, guard aktif di semua route protected |
| PWA | SW cache ter-update, offline penuh, installable |
| Backup/Restore | Validasi checksum, tidak merusak data, konfirmasi 2 langkah |
| Report | Angka dapat dilacak (traceable) ke transaksi sumber |

---

## 19. Release Checklist

> **Checklist rilis minimum 50 item.** Sebuah rilis **tidak boleh dirilis** sebelum semua item bernilai **Passed**.

### 19.1 Build & Versi

| # | Item | Status |
|---|---|---|
| 1 | Version di `package.json` & `app.config.js` diperbarui | ☐ |
| 2 | `CHANGELOG.md` diperbarui | ☐ |
| 3 | `CACHE_VERSION` service worker dinaikkan | ☐ |
| 4 | Daftar `APP_ASSETS` SW memuat semua file baru | ☐ |
| 5 | Tidak ada dependensi CDN yang 404 | ☐ |
| 6 | Aplikasi berjalan tanpa error di console | ☐ |

### 19.2 Fungsionalitas Inti

| # | Item | Status |
|---|---|---|
| 7 | Login & logout berfungsi | ☐ |
| 8 | Session expired & device binding berfungsi | ☐ |
| 9 | First-run owner onboarding berfungsi | ☐ |
| 10 | RBAC: Kasir tidak bisa akses halaman tanpa izin | ☐ |
| 11 | Master data CRUD (produk/kategori/satuan/supplier/customer) berfungsi | ☐ |
| 12 | POS: pilih produk → cart → qty → bayar → simpan transaksi | ☐ |
| 13 | Invoice number auto-generated & unik | ☐ |
| 14 | Stok berkurang saat transaksi PAID | ☐ |
| 15 | Void mengembalikan stok & mengubah status | ☐ |
| 16 | Hold/resume bill berfungsi | ☐ |
| 17 | Payment cash: input uang, hitung kembalian benar | ☐ |
| 18 | Payment non-cash: metode tercatat benar | ☐ |
| 19 | Struk dapat dicetak (browser print) | ☐ |
| 20 | Purchase: buat PO, order, receive, cancel sesuai workflow | ☐ |
| 21 | Receive PO menambah stok sesuai qty diterima | ☐ |
| 22 | Stock adjustment tercatat di stock movement | ☐ |
| 23 | Min stock alert tampil benar | ☐ |
| 24 | Shift open & close dengan opening/closing balance | ☐ |
| 25 | Selisih shift dihitung dengan benar | ☐ |
| 26 | Laporan sales/purchase/stock/cash akurat & traceable | ☐ |

### 19.3 Data & Keamanan

| # | Item | Status |
|---|---|---|
| 27 | Backup menghasilkan file JSON valid dengan checksum | ☐ |
| 28 | Restore dari file valid berhasil & data tidak rusak | ☐ |
| 29 | Restore file rusak/salah versi ditolak dengan pesan jelas | ☐ |
| 30 | Auto-backup dibuat sebelum restore | ☐ |
| 31 | Password di-hash (target PBKDF2 + salt) | ☐ |
| 32 | Audit log mencatat aksi login & perubahan data kritis | ☐ |
| 33 | Tidak ada password/kunci tersimpan plaintext | ☐ |
| 34 | Semua route protected oleh guard | ☐ |
| 35 | Input user divalidasi (tidak ada XSS/injection via input) | ☐ |

### 19.4 Offline & PWA

| # | Item | Status |
|---|---|---|
| 36 | Aplikasi berfungsi penuh tanpa internet | ☐ |
| 37 | SW cache tersaji dari cache saat offline | ☐ |
| 38 | Update SW: build baru tersaji setelah 1–2 reload | ☐ |
| 39 | Aplikasi installable (manifest valid, ikon lengkap) | ☐ |
| 40 | Offline page tampil saat navigasi gagal | ☐ |

### 19.5 Testing & Kualitas

| # | Item | Status |
|---|---|---|
| 41 | Unit test inti lulus (auth, product, sales, inventory) | ☐ |
| 42 | Integration test alur transaksi lulus | ☐ |
| 43 | Manual test scenario (sales, backup, shift) dijalankan | ☐ |
| 44 | Regression test lulus tanpa bug baru | ☐ |
| 45 | Bug P0/P1 = 0 | ☐ |
| 46 | Performa: interaksi inti < 1 detik (data normal) | ☐ |
| 47 | Tidak ada console error/warning berbahaya | ☐ |
| 48 | Dark mode & responsivitas mobile terverifikasi | ☐ |
| 49 | Lighthouse PWA ≥ 90 | ☐ |
| 50 | Validasi tidak ada inline CSS/JS | ☐ |
| 51 | Tidak ada kode TODO/stub di modul inti yang dirilis | ☐ |

### 19.6 Dokumentasi & Rilis

| # | Item | Status |
|---|---|---|
| 52 | Feature list status diperbarui (Completed) | ☐ |
| 53 | Komponen baru didokumentasikan di component library | ☐ |
| 54 | Skema database didokumentasikan (jika berubah) | ☐ |
| 55 | Panduan backup/restore terbaru tersedia | ☐ |
| 56 | Panduan instalasi/PWA/update terbaru tersedia | ☐ |
| 57 | Tag versi dibuat & file rilis diarsipkan | ☐ |
| 58 | UAT dengan pengguna nyata (minimal 1 toko uji) selesai | ☐ |
| 59 | Roadmap diperbarui setelah rilis | ☐ |
| 60 | Backup data produksi dibuat sebelum rilis | ☐ |

---

## 20. Risiko & Mitigasi

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| POS checkout belum ada — effort besar | v1.0 molor | Tinggi | Kerjakan P0-1 lebih dulu, scope ketat |
| Stok tidak konsisten antar modul | Data salah, bisnis rugi | Sedang | Semua mutasi stok via inventory service |
| SW precache stale | Pengguna dapat build lama | Tinggi | Audit ulang APP_ASSETS sebelum rilis |
| Tidak ada test runner | Bug lolos ke produksi | Tinggi | Setup runner di awal M6/M8 |
| Hashing SHA-256 (gap keamanan) | Risiko data lemah | Sedang | Migrasi PBKDF2+salt di v1.0 |
| Audit writer tidak ada | Tidak ada jejak | Sedang | Implementasi writer di v1.0 |
| Recipe/BOM butuh migrasi skema | Migrasi berisiko | Sedang | Uji migrasi v2→v3 di v1.5 |
| v2.0 arsitektur cloud belum diputuskan | Scope meluas | Sedang | Study ADR-025; keputusan eksplisit |
| CDN versi package vs index.html beda | Perilaku tak terduga | Sedang | Sinkronkan versi atau ganti lokal |
| Backup tidak terenkripsi | Data sensitif terbaca | Sedang | Enkripsi opsional di v1.1 |

---

## 21. Lampiran — Definisi Status

| Status | Arti | Contoh |
|---|---|---|
| **IMPLEMENTED** | Fitur berfungsi penuh & teruji secara aktual | Auth, Produk CRUD, Backup |
| **PARTIAL** | Berfungsi sebagian; bagian lain belum | Sales (history saja), Dashboard (statis) |
| **PLANNED** | Didesain/dijadwalkan, belum ada implementasi | POS checkout, Barcode |
| **TODO** | File/placeholder ada tapi isi stub | inventory-service, shift-service |
| **BROKEN** | Infrastruktur ada tapi fungsinya tidak berjalan | Audit log (tabel ada, writer tidak) |
| **DEPRECATED** | Tidak lagi dipakai/direkomendasikan | — (belum ada saat ini) |

### Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 2026-08-07 | Versi awal roadmap rilis (v1.0 → v2.0) berdasarkan audit kode aktual |

---

> **POS Offline PWA — Release Roadmap v1.0 — 7 Agustus 2026.**  
> Dokumen ditulis berdasarkan audit faktual kode (`src/`), skema database, PWA, dan dokumentasi terkini. Status fitur bersifat jujur terhadap kondisi nyata; versi rilis adalah target.
