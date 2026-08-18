# ARCHITECTURE DECISION RECORDS

> **Aplikasi** : POS Offline PWA  
> **Versi** : 1.0  
> **Tanggal** : 2026-08-06  
> **Status** : Dokumen Resmi ADR

---

## Tujuan

Dokumen ini mencatat **seluruh keputusan arsitektur penting** yang telah dibuat pada proyek POS Offline PWA. Setiap ADR menjelaskan:

| Elemen | Keterangan |
|---|---|
| **Keputusan** | Apa yang dipilih |
| **Alasan** | Mengapa dipilih |
| **Alternatif** | Opsi yang dipertimbangkan |
| **Penolakan** | Mengapa alternatif ditolak |
| **Konsekuensi** | Dampak keputusan |
| **Status** | Kondisi keputusan saat ini |
| **Dampak lanjutan** | Pengaruh terhadap pengembangan berikutnya |

Dokumen ini menjadi **referensi resmi** bagi:

- Developer
- OpenCode / Codex / Cursor / ChatGPT (AI Coding Assistant)
- QA / Tester
- Project Manager

---

## Penting — Prinsip Kejujuran Dokumentasi

ADR berikut ditulis **berdasarkan kondisi faktual proyek saat ini** (hasil audit kode & dokumentasi). Ketentuan:

1. Status **ACCEPTED** hanya untuk keputusan yang benar-benar diterapkan di kode.
2. Keputusan yang hanya **dirancang** di dokumentasi (belum diimplementasi) ditandai **PROPOSED**.
3. Keputusan yang belum dapat dipastikan ditulis **"Belum ditetapkan"**.
4. Tidak ada asumsi yang ditulis seolah-olah sudah final.

---

## Daftar Isi

1. [ADR-001 — Offline First Architecture](#adr-001--offline-first-architecture)
2. [ADR-002 — PWA Architecture](#adr-002--pwa-architecture)
3. [ADR-003 — Database Engine](#adr-003--database-engine)
4. [ADR-004 — Repository Pattern](#adr-004--repository-pattern)
5. [ADR-005 — Service Layer](#adr-005--service-layer)
6. [ADR-006 — Universal Item Model](#adr-006--universal-item-model)
7. [ADR-007 — Stock Movement](#adr-007--stock-movement)
8. [ADR-008 — Recipe / BOM](#adr-008--recipe--bom)
9. [ADR-009 — Authentication Architecture](#adr-009--authentication-architecture)
10. [ADR-010 — RBAC](#adr-010--rbac)
11. [ADR-011 — Soft Delete](#adr-011--soft-delete)
12. [ADR-012 — Modular Architecture](#adr-012--modular-architecture)
13. [ADR-013 — ES Modules](#adr-013--es-modules)
14. [ADR-014 — Design System](#adr-014--design-system)
15. [ADR-015 — PWA Service Worker Strategy](#adr-015--pwa-service-worker-strategy)
16. [ADR-016 — Routing](#adr-016--routing)
17. [ADR-017 — Import / Export](#adr-017--import--export)
18. [ADR-018 — Validation](#adr-018--validation)
19. [ADR-019 — Audit Logging](#adr-019--audit-logging)
20. [ADR-020 — Error Handling](#adr-020--error-handling)
21. [ADR-021 — Testing Strategy](#adr-021--testing-strategy)
22. [ADR-022 — Deployment](#adr-022--deployment)
23. [ADR-023 — Security](#adr-023--security)
24. [ADR-024 — AI Assisted Development](#adr-024--ai-assisted-development)
25. [ADR-025 — Scalability](#adr-025--scalability)
26. [ADR-026+ — Keputusan Tambahan](#adr-026--keputusan-tambahan)
27. [Core Architecture Principles](#core-architecture-principles)
28. [Decision Matrix](#decision-matrix)
29. [Architecture Timeline](#architecture-timeline)
30. [Dependency Map](#dependency-map)

---

# ADR-001 — Offline First Architecture

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi; keputusan diambil sejak fase awal proyek)

**Context:**

Aplikasi adalah Point of Sale yang ditujukan untuk UMKM/retail yang beroperasi **100% offline** tanpa server backend, database cloud, atau ketergantungan internet untuk operasional harian (dinyatakan di `docs/01_PROJECT_BLUEPRINT.md`).

**Decision:**

Arsitektur **Offline First** — seluruh data operasional disimpan dan diproses **lokal** di perangkat. IndexedDB menjadi penyimpanan utama. Aplikasi berjalan penuh tanpa internet.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Client-server (backend + cloud DB) | Membutuhkan server, biaya, dan internet — bertentangan dengan kebutuhan kasir offline |
| LocalStorage sebagai DB utama | Kapasitas kecil, tanpa query/index, tidak cocok untuk transaksi volume besar |
| Firebase / Supabase (sync) | Menambah kompleksitas & ketergantungan internet |

**Consequences:**

- Seluruh data tersimpan lokal (IndexedDB).
- Aplikasi tetap berfungsi saat jaringan mati.
- Sinkronisasi ke cloud menjadi pekerjaan masa depan (bukan sekarang).
- Data bersifat per-perangkat (per origin browser).

**Related Documents:**

- `docs/01_PROJECT_BLUEPRINT.md`
- `docs/20_TESTING_GUIDE.md` (section 13 — Offline Test)
- `docs/21_DEPLOYMENT_GUIDE.md` (section 15 — Offline Standard)

**Related Modules:**

- Seluruh modul (semua bergantung pada data lokal)

---

# ADR-002 — PWA Architecture

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Aplikasi perlu dapat **diinstall** sebagai aplikasi, berjalan offline, dan di-update tanpa toko aplikasi.

**Decision:**

Mengadopsi **Progressive Web App (PWA)**: `manifest.json` (installable, splash, theme color, icon), `service-worker.js` (offline cache, update), dan folder `src/pwa/` (register, install, cache manager, service).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Native Android/iOS app | Perlu dua codebase, distribusi toko, keahlian native — belum dibutuhkan |
| Electron desktop (utama) | Ukuran besar, kompleks — ditunda sebagai opsi masa depan |

**Consequences:**

- Aplikasi dapat diinstall dari browser (Add to Home Screen).
- Update dilakukan lewat Service Worker (bukan toko aplikasi).
- PWA menjadi fondasi untuk deployment Android/Desktop di masa depan.

**Related Documents:**

- `docs/21_DEPLOYMENT_GUIDE.md` (section 7 — PWA Deployment)
- `manifest.json`, `service-worker.js`, `src/pwa/`

**Related Modules:**

- `src/pwa/` (seluruhnya), `index.html`, `manifest.json`

---

# ADR-003 — Database Engine

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu engine database lokal yang transaksional, mendukung index & query, dan mudah dimigrasi.

**Decision:**

Menggunakan **Dexie.js** (wrapper di atas **IndexedDB**). Database bernama `PosOfflineDB` (`src/database/db.js`). Skema didefinisikan di `src/database/schema.js` (versi 2), dikelola lewat versioning Dexie.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| IndexedDB murni (raw API) | Verbose, event-based, migrasi rumit |
| localStorage / sessionStorage | Kapasitas kecil, tanpa index/transaksi |
| SQLite via plugin | Tidak tersedia langsung di browser web standar |
| SQL.js (WASM) | Menambah dependensi besar; data in-memory |

**Consequences:**

- Query sederhana via Dexie API.
- Versioning & migration otomatis oleh Dexie.
- Data persisten di IndexedDB per origin.

**Related Documents:**

- `docs/23_DATABASE_DESIGN.md`
- `docs/02_DATABASE_SCHEMA.md`, `docs/14_UNIVERSAL_DATABASE_DESIGN.md`
- `src/database/db.js`, `src/database/schema.js`

**Related Modules:**

- `src/database/` (seluruhnya)

---

# ADR-004 — Repository Pattern

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu memisahkan akses data dari business logic agar kode mudah dipelihara dan diuji.

**Decision:**

Menerapkan **Repository Pattern**: `BaseRepository` (`src/repositories/base-repository.js`) menyediakan CRUD generik; setiap modul memiliki repository turunan (contoh: `product-repository.js`, `sales-repository.js`, `finance-repository.js`). Repository adalah satu-satunya lapisan yang mengakses database.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Page/service langsung query DB | Melanggar pemisahan layer, sulit diuji |
| ORM berat (mis. kembali ke raw Dexie di mana-mana) | Tidak memberi pemisahan data |

**Consequences:**

- Akses data terpusat & konsisten.
- Soft delete, timestamp, pagination di-handle di repository.
- Repository mudah diganti (mis. ke remote) di masa depan.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 9)
- `docs/23_DATABASE_DESIGN.md` (section 7)
- `src/repositories/base-repository.js`

**Related Modules:**

- Semua repository modul (`src/modules/*/repository.js`)

---

# ADR-005 — Service Layer

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Business logic harus terpisah dari UI dan dari akses data.

**Decision:**

Business logic berada pada **Service Layer**. Setiap modul memiliki service (contoh: `product-service.js`, `sales-service.js`). Service memanggil Repository, melakukan validasi business, kalkulasi, dan mengembalikan hasil ke UI.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Business logic di page/komponen | Mengotori UI, sulit diuji & dipelihara |
| Business logic di repository | Repository seharusnya hanya akses data |

**Consequences:**

- UI tetap tipis.
- Business rules terpusat & dapat diuji.
- Service siap di-expose ke REST API / backend di masa depan.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 10)
- `docs/24_AI_DEVELOPMENT_GUIDE.md` (section 3)

**Related Modules:**

- Semua service modul (`src/modules/*/service.js`), `src/services/*`

---

# ADR-006 — Universal Item Model

**Status:** PROPOSED (dirancang; implementasi sebagian)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Kebutuhan untuk menangani banyak jenis item: Retail, Raw Material, Finished Product, Recipe Product, Service, Non Stock. Desain dijelaskan di `docs/16_DOMAIN_MODEL.md` (Product/Item domain).

**Decision:**

Menggunakan **Universal Item Model** — satu entitas `products` dengan field `type` untuk membedakan jenis item. Field `products.type` sudah ada di skema (default `'product'`), dan domain model mendefinisikan tipe item.

**Catatan Implementasi Aktual:**

- `products.type` ada di skema (`schema.js`).
- Konstanta tipe produk (`src/constants/types.js`) masih **TODO (stub kosong)**.
- Tabel `recipes`/`recipe_details` **belum ada** di skema.
- Perilaku khusus tipe (mis. SERVICE tanpa stok, RECIPE_PRODUCT dengan recipe) **belum diimplementasi penuh**.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tabel terpisah per jenis item | Rumit, banyak tabel, sulit di-maintain |
| Item model universal | Fleksibel, satu tabel — dipilih |

**Consequences:**

- Satu tabel produk untuk semua jenis (didesain).
- Implementasi penuh tipe item masih **PROPOSED** — menunggu fase terkait.
- Business rules tipe item mengikuti `docs/16_DOMAIN_MODEL.md`.

**Related Documents:**

- `docs/16_DOMAIN_MODEL.md` (Product domain, Item types)
- `docs/23_DATABASE_DESIGN.md`

**Related Modules:**

- `src/modules/product/`, `src/constants/types.js`

---

# ADR-007 — Stock Movement

**Status:** ACCEPTED (skema) / implementasi IN PROGRESS (Phase 6)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Stok perlu dilacak dari mutasi (masuk/keluar) agar akurat dan bisa diaudit.

**Decision:**

Skema menyediakan tabel `stockMovements`, `inventories` (stok terkini), `stockAdjustments`, `stockOpnames`/`stockOpnameItems`. Konsep stok berbasis movement didesain untuk menghitung stok dari mutasi.

**Catatan Implementasi Aktual:**

- Tabel-tabel inventori **sudah ada di skema**.
- Modul `src/modules/inventory/` (`inventory-service.js`, `inventory-repository.js`) masih **TODO (Phase 6)**.
- Saat ini produk menyimpan `stock` langsung di tabel `products` (field `stock`), belum sepenuhnya dihitung dari `stockMovements`.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Stok hanya dihitung dari movement | Lebih akurat, tapi butuh query kompleks setiap akses |
| Stok disimpan di produk (status sekarang) | Cepat, tapi kurang auditable |

**Consequences:**

- Kedua pendekatan berjalan saat ini (stok di produk + tabel movement tersedia).
- Konsolidasi penuh ke movement-based dijadwalkan pada **Phase 6 (Inventory)**.

**Related Documents:**

- `docs/23_DATABASE_DESIGN.md` (tabel inventori)
- `docs/07_ROADMAP.md` (Phase 6)

**Related Modules:**

- `src/modules/inventory/`, `src/modules/product/`

---

# ADR-008 — Recipe / BOM

**Status:** PROPOSED (dirancang; belum diimplementasi)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Produk berbasis resep (Recipe Product) perlu menentukan bahan baku yang dibutuhkan (BOM) dan menghitung HPP. Desain di `docs/16_DOMAIN_MODEL.md` (Recipe Domain).

**Decision:**

Mengadopsi **Recipe/BOM** untuk produk bertipe `RECIPE_PRODUCT`: satu product memiliki satu recipe dengan detail bahan baku (`recipe_details`), ditangani oleh `RecipeService` (createRecipe, calculateHPP, checkStockAvailability, processRecipe).

**Catatan Implementasi Aktual:**

- **Belum diimplementasi**: tabel `recipes`/`recipe_details` **tidak ada** di skema saat ini.
- `RecipeService` **belum ada** di kode.
- Hanya didesain di domain model (`docs/16_DOMAIN_MODEL.md`).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tidak menggunakan recipe (produk dijual langsung) | Tidak bisa menghitung HPP bahan baku |
| Recipe di-hardcode di service | Tidak fleksibel |

**Consequences:**

- Recipe/BOM adalah **PROPOSED** — akan diimplementasikan saat fase produk resep.
- Perlu migration (tabel `recipes`, `recipe_details`) saat implementasi.
- Business rules mengikuti domain model.

**Related Documents:**

- `docs/16_DOMAIN_MODEL.md` (Recipe Domain)
- `docs/23_DATABASE_DESIGN.md`

**Related Modules:**

- `src/modules/product/` (masa depan: RecipeService)

---

# ADR-009 — Authentication Architecture

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Aplikasi offline perlu autentikasi lokal yang aman, tanpa server.

**Decision:**

Arsitektur autentikasi terdiri dari:

1. **Login** — `src/auth/login.js` (`authenticate()`): validasi username/password terhadap tabel `users`, memeriksa role.
2. **Session** — `src/auth/session.js`: session disimpan di **Web Storage** (localStorage untuk remember-me, sessionStorage untuk non-remember) dengan `expiresAt`, `loginTime`, `deviceId`, `logoutTime`.
3. **Route Guard** — `src/router/guards.js` + `src/router/router.js`: halaman protected wajib session valid.
4. **Logout** — `authService.logout()` membersihkan session & redirect ke `#/login`.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| JWT / token server | Butuh backend — tidak cocok offline |
| Session hanya di IndexedDB | Web Storage lebih sederhana untuk session; IndexedDB untuk data |

**Consequences:**

- Autentikasi berjalan penuh offline.
- Session memiliki masa berlaku & validasi device.
- Password user dicek via hash (lihat ADR-023 untuk detail hashing).

**Related Documents:**

- `docs/22_SECURITY_GUIDE.md` (section 1, 4)
- `docs/20_TESTING_GUIDE.md` (section 8)

**Related Modules:**

- `src/auth/`, `src/services/auth-service.js`, `src/router/guards.js`

---

# ADR-010 — RBAC

**Status:** ACCEPTED (3 role) — perluasan role PROPOSED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu kontrol akses berbasis peran (role).

**Decision:**

Menggunakan **Role Based Access Control (RBAC)**. Role didefinisikan di tabel `roles` dan permission di `ROLE_PERMISSIONS` pada `auth-service.js`.

**Role yang Saat Ini Diimplementasikan:**

| Role | Keterangan |
|---|---|
| **Owner** | Akses semua fitur termasuk pengaturan |
| **Admin** | Dashboard, penjualan, produk, pelanggan, supplier, pembelian, laporan |
| **Kasir** | Dashboard, penjualan |

**Role yang Tercantum pada Dokumentasi namun Belum Diimplementasikan:**

| Role | Status |
|---|---|
| Gudang | **Belum ditetapkan** (belum ada di kode) |
| Supervisor | **Belum ditetapkan** (belum ada di kode) |
| Manager | **Belum ditetapkan** (belum ada di kode) |

> Catatan: `src/constants/roles.js` dan `src/constants/permissions.js` masih **TODO (stub)**; matriks akses aktif ada di `auth-service.js` (`ROLE_PERMISSIONS`).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Access Control List (ACL) per user | Rumit untuk banyak user |
| Tanpa kontrol akses | Tidak aman untuk multi-karyawan |

**Consequences:**

- Owner/Admin/Kasir berfungsi saat ini.
- Role Gudang/Supervisor/Manager dapat ditambahkan di masa depan (perlu update `ROLE_PERMISSIONS` + dokumentasi).

**Related Documents:**

- `docs/22_SECURITY_GUIDE.md` (section 2, 9)
- `src/services/auth-service.js`

**Related Modules:**

- `src/auth/`, `src/services/auth-service.js`, `src/components/Sidebar.js`

---

# ADR-011 — Soft Delete

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Data tidak boleh langsung hilang permanen saat dihapus — perlu ada pemulihan (restore).

**Decision:**

Menerapkan **Soft Delete**: setiap record memiliki field `deletedAt` (`null` = aktif, timestamp = terhapus). `BaseRepository.delete()` menandai `deletedAt` (bukan hapus fisik); `hardDelete()` untuk hapus permanen; restore dengan mengembalikan `deletedAt = null`. Query default memfilter `!deletedAt`.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Hard delete langsung | Data hilang permanen, sulit di-audit/dipulihkan |
| Tabel arsip terpisah | Kompleks, duplikasi |

**Consequences:**

- Data dapat direstore.
- Riwayat tetap ada.
- Perlu disiplin memfilter `deletedAt` di semua query.

**Related Documents:**

- `docs/23_DATABASE_DESIGN.md` (section 8)
- `docs/19_DEVELOPMENT_STANDARDS.md`

**Related Modules:**

- `src/repositories/base-repository.js`, seluruh repository modul

---

# ADR-012 — Modular Architecture

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Kode perlu terorganisir per fitur agar mudah dikembangkan & dipelihara.

**Decision:**

Arsitektur **feature/module based**: setiap domain bisnis berada di `src/modules/<module>/` dengan struktur `index.js`, `<module>-repository.js`, `<module>-service.js`, dan file pendukung. Ditambah folder pendukung global (`components/`, `pages/`, `services/`, `helpers/`, `config/`, dll).

**Modul yang Sudah Ada:**

| Modul | Repository | Service |
|---|---|---|
| `product` | ✓ | ✓ |
| `sales` | ✓ | ✓ |
| `finance` | ✓ | ✓ |
| `shift` | ✓ | ✓ |
| `inventory` | TODO (Phase 6) | TODO (Phase 6) |
| `backup`, `cafe`, `customer`, `loyalty`, `purchase`, `report`, `supplier` | bervariasi | bervariasi |

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Folder per tipe file (semua page, semua service) | Sulit menemukan & mengembangkan fitur |
| Monolith satu file besar | Tidak terpelihara |

**Consequences:**

- Fitur terisolasi (low coupling, high cohesion).
- Perlu konsistensi struktur antar modul.
- Modul yang masih TODO harus dilengkapi sesuai fase roadmap.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 2, 3)
- `docs/10_PROJECT_STRUCTURE.md`

**Related Modules:**

- `src/modules/` (seluruhnya)

---

# ADR-013 — ES Modules

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Kode perlu modular & modern, memakai standard JS saat ini.

**Decision:**

Menggunakan **ES Modules** (`import`/`export`). `package.json` bertipe `"type": "module"`. Tidak ada `require()`/CommonJS di kode aplikasi.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| CommonJS (require) | Tidak cocok untuk browser modern tanpa bundler |
| Bundler (Webpack/Vite) | Menambah build step; proyek berjalan langsung tanpa build |

**Consequences:**

- File dimuat langsung sebagai module di browser.
- Lazy loading mudah (dynamic `import()`).
- Tanpa step build (sesuai deployment statis).

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 6)
- `package.json`

**Related Modules:**

- Seluruh modul `src/`

---

# ADR-014 — Design System

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

UI perlu konsisten (warna, spacing, komponen) di seluruh halaman.

**Decision:**

Menggunakan **Design System**: token CSS variables di `src/styles/variables.css`, tema terang/gelap via `theme-service.js` + `theme.css`, dan komponen UI reusable di `src/components/`. Bootstrap 5 (CSS) + Bootstrap Icons dipakai sebagai basis utility/icon.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Styling inline / warna hardcode di mana-mana | Tidak konsisten, sulit di-maintain |
| Framework UI penuh (mis. MUI, Tailwind di react) | Proyek vanilla JS; memakai Bootstrap CSS + custom token |

**Consequences:**

- Warna/spacing terpusat di token.
- Dark/light mode didukung.
- Standar "no hardcode color, no inline style" berlaku (lihat `19_DEVELOPMENT_STANDARDS.md`).

**Related Documents:**

- `docs/04_UI_DESIGN_SYSTEM.md`, `docs/05_COMPONENT_LIBRARY.md`
- `docs/19_DEVELOPMENT_STANDARDS.md` (section 5)
- `src/styles/variables.css`, `src/components/`

**Related Modules:**

- `src/styles/`, `src/components/`, `src/services/theme-service.js`

---

# ADR-015 — PWA Service Worker Strategy

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu strategi cache Service Worker yang seimbang antara update cepat dan ketersediaan offline.

**Decision:**

Strategi cache di `service-worker.js`:

| Jenis Request | Strategi |
|---|---|
| **Navigasi** (`navigate`, `/`, `/index.html`) | **Network First** (build baru selalu dipakai) |
| **Asset statis `/src/...`** | **Cache First** (cepat & offline) |
| **CDN (bootstrap, icons, libs)** | **Cache First** (offline) |
| Lainnya | Network First |

Cache berversi (`pos-app-<version>`, `pos-cdn-<version>`, `pos-dynamic-<version>`), cleanup cache lama saat aktivasi, `skipWaiting` + `clients.claim`, dan reload otomatis saat SW baru aktif (`controllerchange`).

**Catatan:** Versi cache saat ini **v4** (update terakhir saat perbaikan dropdown topbar).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Cache First penuh untuk navigasi | Build lama tersajikan terus, user tidak dapat update |
| Network Only | Tidak offline |
| Stale While Revalidate untuk navigasi | Cenderung menyajikan versi lama (pernah bermasalah) |

**Consequences:**

- Update butuh minimal 1-2 reload untuk fully apply.
- Cache lama dibersihkan otomatis.
- Setiap perubahan asset wajib menaikkan `CACHE_VERSION` (sync `pwa-config.js`).

**Related Documents:**

- `docs/21_DEPLOYMENT_GUIDE.md` (section 7, 8)
- `service-worker.js`, `src/pwa/pwa-config.js`

**Related Modules:**

- `src/pwa/`, `service-worker.js`

---

# ADR-016 — Routing

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu navigasi antar halaman yang bekerja tanpa server (SPA statis).

**Decision:**

Menggunakan **Hash Routing** berbasis `window.location.hash` pada router kustom (`src/router/router.js`) — **bukan framework** (bukan React Router/Vue Router). Route didefinisikan sebagai peta `{ login, lock-screen, dashboard, penjualan, produk, pelanggan, supplier, pembelian, laporan, pengaturan }`. Guard diterapkan via `src/router/guards.js`.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| History API (pushState) | Perlu konfigurasi server untuk fallback; tidak perlu untuk statis |
| Framework router | Menambah dependensi; proyek vanilla JS |

**Consequences:**

- URL berbentuk `#/route`.
- Berfungsi pada server statis & file-based.
- Route wajib terdaftar di router + sidebar + permission.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 12)
- `src/router/router.js`, `src/router/guards.js`

**Related Modules:**

- `src/router/`, `src/components/Sidebar.js`

---

# ADR-017 — Import / Export

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu ekspor data (Excel/PDF) dan impor (Excel) untuk kebutuhan operasional.

**Decision:**

Memakai **SheetJS (XLSX)** untuk Excel dan **jsPDF** untuk PDF. Library dimuat global via CDN (`index.html`) dan diakses dari `src/helpers/export-helper.js` / `import-helper.js`; modul bisnis juga memiliki export/import sendiri (contoh: `product-service.js` `exportToExcel`/`importFromExcel`).

**Catatan:** Library di-load via CDN dan di-cache Service Worker. Jika offline & CDN belum tercache, export memberi peringatan dan menurunkan fungsionalitas.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| CSV manual | Kurang mumpuni untuk format Excel/PDF |
| Library native npm via bundler | Proyek tanpa build step |

**Consequences:**

- Export/import berjalan offline bila asset tercache.
- `XLSX`/`jspdf` diakses sebagai global.
- Format & validasi import diatur di helper + service.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md`
- `src/helpers/export-helper.js`, `src/helpers/import-helper.js`

**Related Modules:**

- `src/helpers/`, `src/modules/product/`

---

# ADR-018 — Validation

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Input pengguna harus divalidasi di lebih dari satu lapisan.

**Decision:**

Menerapkan validasi bertingkat:

| Lapisan | Lokasi | Contoh |
|---|---|---|
| **UI Validation** | Komponen/Page | `LoginForm`, form produk |
| **Business Validation** | Service | `product-service.validate()`, cek SKU duplikat |
| **Database/Repository** | Repository/DB | unique index, constraint |

Modul memiliki validator tersendiri (contoh: `product-validator.js`).

**Catatan:** Cakupan implementasi validasi bervariasi per modul; standar "validasi di semua lapisan" dijadikan pedoman (`19_DEVELOPMENT_STANDARDS.md`).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Validasi hanya di UI | Mudah di-bypass |
| Validasi hanya di DB | Feedback buruk untuk user |

**Consequences:**

- Feedback cepat di UI + keamanan di logic.
- Konsistensi perlu dijaga per modul.

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 8)
- `src/modules/product/product-validator.js`, `src/modules/product/product-service.js`

**Related Modules:**

- Modul produk; seluruh form di `src/components/form/`

---

# ADR-019 — Audit Logging

**Status:** ACCEPTED (skema) / implementasi IN PROGRESS

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Perlu jejak (audit trail) untuk aktivitas penting (login, perubahan data, export, backup, dll).

**Decision:**

Skema menyediakan tabel **`auditLogs`** (userId, action, entityType, entityId) dan **`activityLogs`** (userId, activity, module, level). Standar audit dijelaskan di `docs/22_SECURITY_GUIDE.md` (section 8).

**Catatan Implementasi Aktual:**

- Tabel `auditLogs` & `activityLogs` **sudah ada di skema**.
- **Belum ada penulis (writer)** di kode — tidak ada modul yang menulis ke tabel audit saat ini.
- Implementasi penulisan log masih **IN PROGRESS**.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tanpa audit log | Tidak ada jejak untuk investigasi |
| Log hanya di console | Tidak persisten |

**Consequences:**

- Infrastruktur tersedia (tabel).
- Perlu implementasi writer + integrasi ke service saat fitur audit aktif.

**Related Documents:**

- `docs/22_SECURITY_GUIDE.md` (section 8)
- `src/database/schema.js`

**Related Modules:**

- `src/database/` (schema); writer masa depan di service

---

# ADR-020 — Error Handling

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Error harus ditangani secara konsisten, tercatat, dan tidak membuat aplikasi blank.

**Decision:**

Menggunakan **logger** terpusat (`src/utils/logger.js`) + **error handler global** (`src/utils/error-handler.js`):

- `window.onerror` & `unhandledrejection` ditangkap → dicatat ke logger → menampilkan UI error.
- Repository/service membungkus operasi dengan `try/catch`.
- Standar logging: `logger.info/warn/error`, tanpa `console.log` di production.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tanpa error handler global | Error tak tertangani bikin blank page |
| Hanya console.log | Tidak terpusat |

**Consequences:**

- Error global tidak membuat aplikasi diam.
- UI error tampil saat crash.
- Disiplin logger dijaga (lihat `19_DEVELOPMENT_STANDARDS.md`).

**Related Documents:**

- `docs/19_DEVELOPMENT_STANDARDS.md` (section 7)
- `src/utils/logger.js`, `src/utils/error-handler.js`

**Related Modules:**

- `src/utils/`, `src/app/bootstrap.js`

---

# ADR-021 — Testing Strategy

**Status:** PROPOSED (dokumentasi lengkap; infrastruktur belum ditetapkan)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Kualitas perlu dijaga melalui pengujian bertingkat.

**Decision:**

Strategi pengujian 9 level dijelaskan di `docs/20_TESTING_GUIDE.md` (Unit, Integration, UI, Manual, Regression, Performance, Offline, Security, UAT).

**Catatan Implementasi Aktual:**

- Dokumentasi testing **lengkap** (`20_TESTING_GUIDE.md`).
- **Belum ada runner/framework test** terkonfigurasi di `package.json` (tidak ada script `test`).
- Belum ada file unit test otomatis yang terhubung ke project.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tanpa dokumentasi testing | Tidak ada standar |
| Framework tertentu (Jest/Vitest) | **Belum ditetapkan** — perlu keputusan di masa depan |

**Consequences:**

- Standar & checklist tersedia.
- Keputusan framework test runner **belum ditetapkan**.
- Testing otomatis menjadi pekerjaan mendatang.

**Related Documents:**

- `docs/20_TESTING_GUIDE.md`, `docs/13_TESTING_GUIDE.md`
- `package.json`

**Related Modules:**

- Menyentuh semua modul (saat test runner tersedia)

---

# ADR-022 — Deployment

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Aplikasi statis (tanpa build) perlu di-deploy & di-update.

**Decision:**

Deployment saat ini berupa **website statis**:

- Dev/uji: `http-server . -c-1` (`npm start` / `npm run dev`) atau `python -m http.server`.
- Produksi: salin ke web server statis (Apache/Nginx/XAMPP/Laragon/shared hosting/LAN).
- Update: lewat Service Worker (bump `CACHE_VERSION`, auto reload).
- Opsi masa depan: Electron (desktop), TWA/Capacitor (Android) — dijelaskan di `21_DEPLOYMENT_GUIDE.md`.

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Server dengan build tool | Proyek berjalan langsung tanpa build |
| Native app sejak awal | Ditunda; PWA sudah mencukupi |

**Consequences:**

- Tidak ada build step (file source langsung).
- HTTPS dibutuhkan untuk SW di luar localhost.
- Update via SW + cache version.

**Related Documents:**

- `docs/21_DEPLOYMENT_GUIDE.md`
- `package.json`, `service-worker.js`

**Related Modules:**

- `src/pwa/`, `src/app/`

---

# ADR-023 — Security

**Status:** ACCEPTED (dengan catatan)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Aplikasi offline menyimpan data sensitif lokal; keamanan penting (autentikasi, otorisasi, session, proteksi data).

**Decision:**

Mekanisme keamanan yang diterapkan:

| Aspek | Implementasi Aktual |
|---|---|
| **Authentication** | Login lokal, session dengan `expiresAt`, `deviceId`, guard |
| **Authorization** | RBAC (Owner/Admin/Kasir) via `ROLE_PERMISSIONS` |
| **Session** | Web Storage (local/session), expiry, idle timeout (logout) |
| **Password hashing** | Saat ini **SHA-256** (`sha256(password)` di `login.js`/`auth.js`) |
| **Data protection** | Data lokal di IndexedDB; backup dengan checksum |

**Catatan Penting (kejujuran dokumentasi):**

- **Hashing password saat ini memakai SHA-256 (tanpa salt)** di `login.js` & `auth.js`.
- **Dokumentasi keamanan** (`22_SECURITY_GUIDE.md`) menargetkan **PBKDF2 + salt** sebagai standar — ini **belum diterapkan**, sehingga merupakan kesenjangan (gap) antara dokumentasi dan implementasi.
- Migration ke PBKDF2 + salt adalah pekerjaan yang perlu direncanakan.

**Alternatives:**

| Alternatif | Alasan Ditolak / Catatan |
|---|---|
| PBKDF2 + salt (standar target) | Belum diterapkan — perlu migrasi hash |
| bcrypt | Tidak tersedia langsung di browser tanpa lib — opsi masa depan |
| Plaintext password | Ditolak |

**Consequences:**

- Session & RBAC berfungsi.
- Hashing perlu ditingkatkan ke PBKDF2 + salt (lihat `22_SECURITY_GUIDE.md`).
- Setiap fitur baru wajib melewati checklist keamanan.

**Related Documents:**

- `docs/22_SECURITY_GUIDE.md`
- `src/auth/login.js`, `src/auth/auth.js`, `src/services/auth-service.js`

**Related Modules:**

- `src/auth/`, `src/services/auth-service.js`

---

# ADR-024 — AI Assisted Development

**Status:** ACCEPTED

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Proyek dikembangkan dengan bantuan AI Coding Assistant (OpenCode, Codex, Cursor, ChatGPT, dll) dan perlu aturan yang jelas.

**Decision:**

Menerapkan **AI Assisted Development** dengan aturan resmi:

- `docs/24_AI_DEVELOPMENT_GUIDE.md` — pedoman utama AI (layer, larangan, checklist, quality gate).
- `docs/08_AI_PROMPT_GUIDE.md` — panduan prompt.
- Dokumen referensi wajib dibaca AI sebelum coding (business rules, API contract, standards, testing, deployment, security, database).

**Alternatives:**

| Alternatif | Alasan Ditolak |
|---|---|
| Tanpa aturan AI | AI bisa merusak arsitektur/business rules |
| Mengandalkan manusia saja | Kurang efisien |

**Consequences:**

- AI mengikuti layer & larangan (tidak ubah arsitektur, tidak hapus file, dll).
- AI wajib audit, jelaskan rencana, self-review, dan lapor quality gate.
- Perubahan besar butuh persetujuan developer.

**Related Documents:**

- `docs/24_AI_DEVELOPMENT_GUIDE.md`, `docs/08_AI_PROMPT_GUIDE.md`

**Related Modules:**

- Seluruh proyek

---

# ADR-025 — Scalability

**Status:** PROPOSED (rencana masa depan)

**Tanggal:** 2026-08-06 (tanggal dokumentasi)

**Context:**

Kebutuhan masa depan: Cloud Sync, Multi Store, Multi Device, REST API, ERP. Diuraikan pada roadmap (`07_ROADMAP.md` Phase 13, `21_DEPLOYMENT_GUIDE.md` future roadmap).

**Decision:**

**Belum ditetapkan secara final.** Arsitektur saat ini sudah menyiapkan fondasi:

- Repository terpisah → siap diganti ke remote.
- Service terpisah dari UI → siap di-expose REST API.
- Data lokal terstruktur (timestamp, soft delete) → siap sync.
- PWA → siap multi-device.

Namun teknologi spesifik (Firebase vs Supabase vs REST API sendiri, arsitektur multi-outlet, dll) **belum ditetapkan**.

**Alternatives:**

| Alternatif | Status |
|---|---|
| Firebase / Supabase | **Belum ditetapkan** |
| REST API sendiri | **Belum ditetapkan** |
| Cloud Sync multi-device | **Belum ditetapkan** |
| ERP integration | **Belum ditetapkan** |

**Consequences:**

- Keputusan diambil saat Phase 13 (Cloud & AI).
- Prinsip pemisahan layer menjaga opsi tetap terbuka.

**Related Documents:**

- `docs/07_ROADMAP.md`, `docs/21_DEPLOYMENT_GUIDE.md` (section 20)

**Related Modules:**

- Seluruh proyek (persiapan)

---

# ADR-026+ — Keputusan Tambahan

Bagian ini untuk keputusan arsitektur penting lain yang ditemukan saat audit. Tambahkan ADR baru dengan format yang sama jika ditemukan.

### ADR-026 — Perluasan Role (Potential)

**Status:** PROPOSED

**Context:** Dokumentasi keamanan menyebut 6 role (Owner, Admin, Kasir, Gudang, Supervisor, Manager) namun kode hanya menerapkan 3.

**Decision:** **Belum ditetapkan** — penambahan role Gudang/Supervisor/Manager belum diputuskan & belum diimplementasi.

**Related:** `docs/22_SECURITY_GUIDE.md`, `src/services/auth-service.js`

### ADR-027 — Perbaikan Hashing Password (Potential)

**Status:** PROPOSED

**Context:** Implementasi saat ini SHA-256 tanpa salt; standar target PBKDF2 + salt.

**Decision:** **Belum ditetapkan** — perlu migrasi hash dengan persetujuan.

**Related:** `docs/22_SECURITY_GUIDE.md`, `src/auth/login.js`, `src/auth/auth.js`

---

# Core Architecture Principles

Prinsip inti arsitektur yang menjadi dasar seluruh keputusan.

| Prinsip | Penjelasan | Implementasi |
|---|---|---|
| **Offline First** | Operasi inti berjalan tanpa internet | IndexedDB lokal, PWA cache |
| **Modular** | Kode per fitur | `src/modules/<module>/` |
| **Layered** | UI → Service → Repository → DB | Repository Pattern + Service Layer |
| **Maintainable** | Mudah dipelihara | Standar dokumentasi, naming, folder |
| **Testable** | Mudah diuji | Layer terpisah, validator murni |
| **Secure** | Proteksi data & akses | RBAC, session expiry, guard, soft delete |
| **Scalable** | Siap berkembang | Repository/service siap di-expose |
| **AI Friendly** | Siap dikerjakan AI | `24_AI_DEVELOPMENT_GUIDE.md` |

---

# Decision Matrix

Ringkasan keputusan & status.

| Decision | Chosen | Alternative | Reason | Status |
|---|---|---|---|---|
| Offline First | IndexedDB lokal | Client-server | Operasional tanpa internet | ACCEPTED |
| PWA | PWA + SW | Native app | Installable + offline + update SW | ACCEPTED |
| Database Engine | Dexie + IndexedDB | Raw IndexedDB | Sederhana, versioning | ACCEPTED |
| Repository Pattern | BaseRepository + per-modul | Query langsung | Pemisahan data | ACCEPTED |
| Service Layer | Service per modul | Logic di UI/Repo | Business logic terpusat | ACCEPTED |
| Universal Item Model | Produk dgn field `type` | Tabel terpisah per jenis | Fleksibel | PROPOSED (parsial) |
| Stock Movement | Tabel movement + inventories | Hanya stok di produk | Auditable | ACCEPTED (skema) |
| Recipe / BOM | RecipeService + recipe_details | Tanpa recipe | HPP bahan baku | PROPOSED |
| Authentication | Login + Session + Guard | JWT/token | Offline tanpa server | ACCEPTED |
| RBAC | Role-based | ACL per user | Multi-karyawan | ACCEPTED (3 role) |
| Soft Delete | `deletedAt` | Hard delete | Restore & audit | ACCEPTED |
| Modular Architecture | Modul per fitur | Per tipe file | Maintainability | ACCEPTED |
| ES Modules | import/export | require/bundler | Modern, tanpa build | ACCEPTED |
| Design System | CSS vars + komponen | Inline/hardcode | Konsistensi | ACCEPTED |
| SW Strategy | Network-first navigasi + cache-first asset | Cache-first penuh | Update & offline seimbang | ACCEPTED |
| Routing | Hash router kustom | History API / framework | Statis tanpa server | ACCEPTED |
| Import/Export | SheetJS + jsPDF (CDN) | CSV manual | Format lengkap | ACCEPTED |
| Validation | UI + Business + DB | Hanya UI | Anti-bypass | ACCEPTED |
| Audit Logging | Tabel auditLogs/activityLogs | Tanpa audit | Jejak aktivitas | ACCEPTED (skema) |
| Error Handling | Logger + global handler | console.log | Tidak blank screen | ACCEPTED |
| Testing | 9 level (dokumentasi) | Tanpa standar | Kualitas | PROPOSED (infra belum) |
| Deployment | Static web + SW update | Build server/native | Sederhana | ACCEPTED |
| Security | RBAC + session + guard | — | Proteksi lokal | ACCEPTED (hashing gap) |
| AI Assisted | Aturan AI resmi | Tanpa aturan | Konsistensi | ACCEPTED |
| Scalability | Belum ditetapkan | Firebase/Supabase/API | Masa depan | PROPOSED |

---

# Architecture Timeline

Timeline fase pengembangan berdasarkan `docs/07_ROADMAP.md` dan kondisi aktual.

| Fase | Target | Status Saat Ini | Catatan |
|---|---|---|---|
| **Phase 0-1** | Foundation & Setup | Selesai | Dokumentasi + project setup |
| **Phase 2** | Core System | Sebagian | Login, user, role, backup (schema) |
| **Phase 3-4** | Master Data & Dashboard | Sebagian | Produk, kategori, unit, supplier, seed |
| **Phase 5** | Sales (POS) | In progress | Sales service/repository ada; flow create belum lengkap |
| **Phase 6** | Inventory | TODO | `inventory-service/repository` masih stub |
| **Phase 7** | Purchase | Parsial | Tabel + seed; service perlu dilengkapi |
| **Phase 8** | Finance | Parsial | Finance service/repository ada |
| **Phase 9** | Reporting | Parsial | Modul report ada |
| **Phase 10** | v1.1 Enhancement | Rencana | Refund, voucher, import/export lengkap |
| **Phase 11** | Cafe (v2.0) | Rencana | Table, kitchen, reservation |
| **Phase 12** | Loyalty (v2.5) | Rencana | Membership, poin |
| **Phase 13** | Cloud & AI (v3.0) | Rencana | Multi-outlet, sync, AI, API |

> **Catatan Sprint**: Struktur roadmap proyek memakai istilah **Phase** (bukan Sprint). Referensi "Sprint 2.x / Sprint 3.x" pada dokumentasi lain menunjuk pada iterasi pengembangan refactor autentikasi & standar yang sudah dijalankan. Keputusan granular per sprint dicatat di dokumen roadmap.

---

# Dependency Map

Alur dependency arsitektur.

```mermaid
flowchart TD
    UI[UI / Components] --> PAGES[Pages]
    PAGES --> SERVICE[Service]
    SERVICE --> VALIDATOR[Validator]
    SERVICE --> REPO[Repository]
    VALIDATOR --> REPO
    REPO --> DEXIE[Dexie]
    DEXIE --> IDB[(IndexedDB)]

    ROUTER[Router] --> GUARD[Route Guard]
    GUARD --> AUTH[Auth Service]
    AUTH --> SESSION[Session (Web Storage)]
    AUTH --> IDB

    PWA[PWA] --> SW[Service Worker]
    SW --> CACHE[Cache]
    PWA --> MANIFEST[Manifest]

    AUTH --> ROUTER
    SERVICE --> AUTH
    PAGES --> ROUTER
```

**Keterangan dependency:**

| Lapisan | Bergantung pada | Tidak Bergantung pada |
|---|---|---|
| UI / Components | Pages, Router | Database langsung |
| Pages | Service, Router, Auth | Database langsung |
| Service | Repository, Validator, Auth | Database langsung, DOM |
| Repository | Dexie (IndexedDB) | Business logic |
| Router | Guard, Auth | Database |
| Auth | Session (Web Storage), IndexedDB | UI |
| PWA / SW | Cache, Manifest | Business logic |

---

## Lampiran

### A. Definisi Status

| Status | Arti |
|---|---|
| **PROPOSED** | Diusulkan / dirancang, belum (sepenuhnya) diterapkan |
| **ACCEPTED** | Diterima & diterapkan |
| **SUPERSEDED** | Digantikan keputusan lain |
| **DEPRECATED** | Tidak lagi disarankan |
| **REJECTED** | Ditolak |

### B. Dokumen Acuan Audit

| Dokumen | Dipakai Untuk |
|---|---|
| `docs/01_PROJECT_BLUEPRINT.md` | Visi & arsitektur |
| `docs/07_ROADMAP.md` | Timeline fase |
| `docs/16_DOMAIN_MODEL.md` | Item model, recipe |
| `docs/22_SECURITY_GUIDE.md` | Keamanan & hashing |
| `docs/23_DATABASE_DESIGN.md` | Database & skema |
| `src/database/schema.js`, `src/database/db.js` | Skema aktual |
| `src/services/auth-service.js`, `src/auth/` | Auth & RBAC |
| `src/router/` | Routing & guard |
| `service-worker.js`, `src/pwa/` | PWA & cache |
| `package.json` | Dependensi & scripts |

### C. Catatan Kejujuran (Discrepancy)

Ditemukan perbedaan antara dokumentasi dan implementasi yang wajib menjadi perhatian:

| Area | Dokumentasi | Implementasi Aktual |
|---|---|---|
| Hashing password | PBKDF2 + salt (standar) | SHA-256 tanpa salt |
| Role | 6 role (Owner, Admin, Kasir, Gudang, Supervisor, Manager) | 3 role (Owner, Admin, Kasir) |
| Recipe/BOM | Domain model lengkap | Belum ada di kode/skema |
| Audit log | Writer harus mencatat aktivitas | Tabel ada, writer belum ada |
| Testing | 9 level & checklist | Dokumentasi ada, runner belum ada |

Perbedaan di atas **belum menjadi keputusan final** dan dicatat sebagai pekerjaan masa depan.

---

> **Versi 1.0** — Architecture Decision Records POS Offline PWA.  
> Dokumen ditulis berdasarkan audit faktual proyek (2026-08-06). Keputusan yang belum pasti ditandai **PROPOSED** / **Belum ditetapkan**.

### Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 2026-08-06 | Versi awal: 27 ADR (ADR-001 s.d. ADR-027) + prinsip, matrix, timeline, dependency map |
