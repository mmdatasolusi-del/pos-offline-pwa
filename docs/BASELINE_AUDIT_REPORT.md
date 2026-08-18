# PROJECT BASELINE REPORT

**Aplikasi:** POS Offline PWA
**Project Root:** `E:\pos offline\Projects\pos-offline-pwa`
**Tanggal Audit:** 2026-08-10
**Project Version (package.json):** `1.0.0`
**Versi di CHANGELOG.md:** `v0.1.0` (2026-07-29)
**Git Commit:** **TIDAK ADA** — project **bukan git repository** (folder `.git` tidak ada; tidak ada riwayat commit)
**Current Phase:** Phase 2–9 (campuran; lihat rincian per modul)
**Current Sprint:** Sprint 3.2 (ditargetkan)
**Overall Status:** **RED**
**Overall Score:** **1.9 / 5** (rendah-acceptable → poor secara keseluruhan)

**Metode Audit:** AUDIT ONLY. Tidak ada file project yang diubah. Kebenaran berdasar **source code + runtime smoke test**, bukan dokumentasi.

---

## Executive Summary

Project `pos-offline-pwa` adalah PWA POS 100% offline berbasis **HTML/JS vanilla (ES Modules) + IndexedDB (Dexie)** tanpa build step. Dokumen (docs/01–27, 27 file) **sangat lengkap**, namun **implementasi jauh tertinggal dari dokumentasi**.

### Kebenaran inti yang ditemukan saat audit:

1. **Yang benar-benar bekerja (terverifikasi via runtime smoke test):**
   - Inisialisasi & seeding database (Dexie `PosOfflineDB` v2, 34 tabel, 95 baris seed) — **PASS**
   - Login/logout, session (expiry + device binding), reject password salah — **PASS**
   - Backup: **GAGAL saat runtime (bug kritis)** — bukan asumsi; di-reproduksi.
   - Restore: **GAGAL saat runtime (bug kritis)** — di-reproduksi.
   - CRUD + validasi + soft delete via `BaseRepository` — **PASS** (produk diuji langsung)
   - Produk: CRUD, search, sort, pagination, import/export Excel (dengan degradasi bila XLSX belum dimuat) — **PASS di layer service/repo**
   - Purchase: PO + status workflow + receive — **PASS (logika service)**
   - PWA: manifest valid, SW `v4` terdaftar, cache strategy berfungsi — **PASS (statis; behavior offline sebagian)**
   - Server dev: `http-server . -c-1` jalan, `index.html`/`manifest.json`/`service-worker.js` → HTTP 200 — **PASS**

2. **Yang belum selesai / rusak (fakta kode, bukan dari dokumen):**
   - **POS checkout TIDAK ADA** — `pos-page.js` hanya placeholder "Coming Soon"; `sales-service.js` hanya `getAll/getById/delete` (read-only); tidak ada `createTransaction`, tidak ada cart/payment/invoice.
   - **46 file stub (~25% dari 187 file src)** — inventory, finance, shift, backup(modul), cafe, loyalty, sync/backup worker, 5 utils, 4 helpers, 4 services, constants, config, 4 halaman "Coming Soon".
   - **Backup/Restore RUSAK secara runtime** — tabel `tables` bertabrakan dengan properti bawaan Dexie `db.tables` (array) → `exportBackup()` & `restoreFromBackup()` melempar `TypeError` di `backup.js:17` dan `restore.js:75`. **P0.**
   - **0 (nol) test** yang bisa dijalankan; 14 file test semuanya stub; **tidak ada test runner** & tidak ada script `test` di `package.json`.
   - **Bukan git repository** — tidak ada histori, tidak ada commit, tidak ada tag versi.
   - **RBAC sebagian bypassable** — route tidak cek role; Kasir bisa buka `#/pengaturan` langsung via URL.
   - **Service Worker precache list basi** — 57 asset lama, melewatkan hampir semua halaman/modul baru; navigasi pertama offline ke route non-precache gagal.
   - **Migration Dexie tidak ada** — `migrations.js` hanya `console.log`; tidak ada `.upgrade()`; skema v1 tidak pernah dideklarasikan.

3. **Kesesuaian dokumentasi vs implementasi** — gap besar dan terdokumentasi jujur di `docs/25`. Dokumen `27_MAINTENANCE_GUIDE.md` **bukan panduan** — isinya **template tugas (task prompt)**, bukan panduan maintenance aktual.

### Verdict

> **Project belum memiliki baseline yang stabil.** Fondasi struktural (ESM, modular, repository pattern, PWA shell, schema, backup/restore infra) sudah bagus dan sebagian teruji, tetapi **besar modul inti bisnis belum ada** dan **terdapat bug kritis di jalur keselamatan data (backup/restore)**. Tidak ada pengujian terotomasi dan tidak ada version control → **perubahan berisiko tidak terlacak**.
>
> **Sprint 3.2: CONDITIONAL** — dapat dimulai hanya jika (a) bug backup/restore diperbaiki lebih dulu, (b) scope Sprint 3.2 dibatasi eksplisit (mis. hanya POS checkout) tanpa membangun infra test/versi baru di sprint yang sama, dan (c) standar (run test, commit) disepakati. **Tanpa itu: NO.**

---

## Ringkasan Status Per Area

| Area | Status | Skor (0–5) |
|---|---|---|
| Architecture | PARTIAL | 2 |
| Authentication | PARTIAL | 3 |
| Authorization (RBAC) | FAIL | 1 |
| Database | PARTIAL (bug kritis backup) | 2 |
| PWA | PARTIAL | 3 |
| UI | PARTIAL | 2 |
| Modules | FAIL (inti belum ada) | 1 |
| Testing | FAIL | 0 |
| Security | FAIL | 1 |
| Performance | PARTIAL | 2 |
| Documentation | PARTIAL | 3 |
| Deployment | PARTIAL | 3 |
| **Overall** | **RED** | **1.9 / 5** |

---

## 1. PROJECT STRUCTURE AUDIT (Phase 1)

### 1.1 Project Tree (ringkas, setiap folder dengan isi)

```
pos-offline-pwa/
├── index.html                — entry point (9 CSS + 4 lib CDN + module app.js)
├── manifest.json             — PWA manifest (10 ikon)
├── service-worker.js         — SW v4 (cache strategy + precache)
├── offline.html              — (di src/pwa/offline.html)
├── package.json              — 6 deps + 1 devDep; scripts start/dev (http-server)
├── package-lock.json         — lockfile v3 (konsisten)
├── README.md                 — ringkas, tetapi struktur/roadmap tertinggal (docs 01–13 padahal ada 27)
├── CHANGELOG.md              — hanya v0.1.0
├── .gitignore                — ada (node_modules, backups, dst)
├── .git/                     — ❌ TIDAK ADA (bukan git repo)
├── assets/                   — KOSONG
├── public/                   — KOSONG
├── backups/                  — (gitignored; folder kosong)
├── node_modules/             — 85 package top-level (deps TIDAK dipakai runtime; CDN yang dipakai)
├── scripts/                  — hanya README.md (seed-data.js & validate-structure.js TIDAK ada)
├── docs/                     — 27 file .md (01–27)
├── src/
│   ├── app/                  — app.js, bootstrap.js (entry, real)
│   ├── assets/               — KOSONG: images (favicon 0 byte), fonts/, icons/, sounds/ kosong
│   ├── auth/                 — auth.js, login.js, session.js (real)
│   ├── components/           — 11 file util + 15 komponen: 10 dipakai, 5 orphan (breadcrumb, dropdown,
│   │                            avatar, spinner, layout/app-*)
│   ├── config/               — app/db/theme config (real) + feature/performance/format (stub {})
│   ├── constants/            — storage/events/defaults (real) + types/roles/permissions/status/payment (stub {})
│   ├── database/             — schema.js, db.js, seeds.js, backup.js, restore.js, migrations.js (stub),
│   │                            database-manager.js (real)
│   ├── helpers/              — export-helper.js, import-helper.js (real) + form/modal/print/table (stub)
│   ├── layouts/              — AppLayout.js (real, dipakai) + app-layout.js (ORPHAN/dead, duplikat),
│   │                            auth-layout.js, pos-layout.js (stub)
│   ├── modules/              — 13 modul: product, sales, purchase, customer, supplier, report (real/parsial);
│   │                            inventory, finance, shift, backup, cafe, loyalty (stub)
│   ├── pages/                — 25 file: login ×2, dashboard ×2, produk, pembelian, pelanggan, supplier,
│   │                            penjualan, laporan, pengaturan (8 tab), lock-screen, first-run, not-found,
│   │                            + 4 placeholder "Coming Soon" (pos, inventory, categories) + cafe stub
│   ├── pwa/                  — pwa-config, pwa-register, pwa-install, pwa-service, pwa-cache-manager,
│   │                            manifest.js, offline.html, icons (10 file, semua ada)
│   ├── repositories/         — base-repository.js (real) + setting-repository.js (stub)
│   ├── router/               — router.js (AKTIF), routes.js (ORPHAN/dead), guards.js (real),
│   │                            navigation-manager.js (dead)
│   ├── services/             — auth, user, role, permission, theme, idle, shortcuts (real) +
│   │                            setting, audit, backup, notification (stub)
│   ├── styles/               — 9 CSS di index.html + styles/modules + styles/pages (placeholder)
│   ├── utils/                — id, hash, validation, storage, dom, error-handler, logger (real) +
│   │                            string, date, currency, array, number (stub)
│   ├── workers/              — sync-worker.js, backup-worker.js (stub, kosong)
├── tests/                    — 14 file, SEMUA stub/TODO; tidak ada test runner
```

### 1.2 Identifikasi File

| Kategori | Jumlah | Catatan |
|---|---|---|
| File `.js` di `src/` | 187 | 46 di antaranya stub/placeholder/orphan |
| Page | 25 | 4 "Coming Soon" + 2 duplikat login/dashboard |
| Modul | 13 struktur | 6 modul inti hanya stub index |
| Service global | 11 | 4 stub |
| Repository | 1 base + 8 modul + 1 setting | setting-repository stub |
| Component (top-level) | 15 file | 5 orphan |
| Config | 6 | 3 stub `{}` |
| Constant | 8 | 5 stub `{}` |
| Utility | 12 | 5 stub |
| Helper | 6 | 4 stub |
| Test | 14 | 100% stub |
| Dokumen | 27 | lengkap; 1 file (27) isinya template tugas bukan panduan |

### 1.3 Masalah Ditemukan

| Masalah | Detail |
|---|---|
| **Duplicate file (live vs dead)** | `layouts/AppLayout.js` (dipakai) vs `layouts/app-layout.js` (orphan); `pages/Dashboard.js` (aktif) vs `pages/dashboard/dashboard-page.js` (dead route); `pages/LoginPage.js` (aktif) vs `pages/login/login-page.js` (dead) |
| **Orphan file** | `components/layout/app-*.js`, `components/navigation/app-breadcrumb.js`, `app-dropdown.js`, `components/data-display/app-avatar.js`, `feedback/app-spinner.js`, `router/routes.js`, `router/navigation-manager.js`, `layouts/app-layout.js` |
| **Dead file** | Seluruh `components/layout/*` hanya dipakai oleh `layouts/app-layout.js` yang orphan |
| **Stub / placeholder** | 46 file (lihat Phase 3) |
| **Folder kosong** | `assets/`, `public/`, `src/assets/{fonts,icons,sounds}`, `src/styles/modules`, `src/styles/pages` (placeholder), `backups/` |
| **File rusak** | `src/assets/images/favicon.ico` = 0–1 byte (tidak dirujuk; favicon riil = `src/pwa/icons/icon-192.svg`) |
| **Kesalahan versi docs** | README mengklaim "docs 01–13" padahal ada 27; README memetakan v0.1–v3.0 ke Phase 2–13 secara berbeda dengan `07_ROADMAP.md` |

---

## 2. PACKAGE & DEPENDENCY AUDIT (Phase 2)

### 2.1 package.json (verbatim, ringkas)

```
name: pos-offline-pwa, version: 1.0.0, private: true, type: module
scripts: start = "http-server . -c-1", dev = "http-server . -c-1"
dependencies:   bootstrap ^5.3.7, bootstrap-icons ^1.13.1, chart.js ^4.5.0,
                dexie ^4.2.0, jspdf ^3.0.3, xlsx ^0.18.5
devDependencies: http-server ^14.1.1
```

### 2.2 Terpasang (`npm ls --depth=0`)

| Paket | Deklarasi | Terpasang | **Dimuat runtime (CDN di index.html)** | Dipakai? |
|---|---|---|---|---|
| dexie | ^4.2.0 | 4.4.4 | **4.0.10** | Ya — global `Dexie` via CDN (db.js:3), bukan npm |
| bootstrap | ^5.3.7 | 5.3.8 | **5.3.3** (CSS saja) | Ya — CSS CDN; npm TIDAK dipakai |
| bootstrap-icons | ^1.13.1 | 1.13.1 | **1.11.3** (CSS) | Ya — icon font CDN |
| chart.js | ^4.5.0 | 4.5.1 | **4.4.7** | **TIDAK** — dimuat tapi **tidak dipanggil** (dashboard placeholder) |
| xlsx | ^0.18.5 | 0.18.5 | 0.18.5 | Ya — global `XLSX` (export/import) |
| jspdf | ^3.0.3 | 3.0.4 | **2.5.2** | Ya — global `jspdf` (export-helper; jarang dipakai) |
| http-server | ^14.1.1 | 14.1.1 | — | Ya — script dev heredity |

### 2.3 Temuan

| Temuan | Severity |
|---|---|
| **Semua 6 dependency runtime TIDAK dipakai dari node_modules** — aplikasi jalan dari CDN di `index.html`. `node_modules` adalah dead weight (kasus `PASS` untuk integritas, `WARN` untuk desain offline-first). | WARN |
| **Versi CDN ≠ versi package.json** untuk 5 dari 6 library (bootstrap 5.3.3 vs ^5.7; dexie 4.0.10 vs ^4.2.0, dll). Dua sumber kebenaran versi. | P2 |
| **chart.js dimuat tapi tidak pernah digunakan** (payload + permukaan serangan tak perlu). | P2 |
| **xlsx 0.18.5** rentan **CVE-2023-30533** (Prototype Pollution) & **CVE-2024-22363** (ReDoS) — tidak ada versi patched di npm; input user (file Excel) diproses `XLSX.read`. | P1 (Security) |
| **http-server → http-proxy 1.18.1** CVE-2021-44906 (dev-only). | P3 |
| Integritas node_modules: `PASS` (no missing/invalid/extraneous). Lockfile v3 konsisten. Script `test` **tidak ada**. | — |

---

## 3. JAVASCRIPT AUDIT (Phase 3)

### 3.1 Statistik

- 187 file `.js` (src) + `index.html` + `service-worker.js`. Tidak ada `main.js` di root.
- **Import:** 194 pernyataan `import`; **0 broken relative import** (semua `./`/`../` resolve). **0 bare-specifier import** (tidak ada `from 'dexie'` dll).
- **Satu kelemahan global:** `db.js:3` `new Dexie('PosOfflineDB')` tanpa import — bergantung global CDN.

### 3.2 TODO / FIXME / placeholder

| Pola | Jumlah | Detail |
|---|---|---|
| `// TODO:` | 40 | seluruhnya komentar satu-baris; **0 FIXME/XXX** |
| File stub (komentar-only) | 32 | utils/helpers/services/repositories/workers/layouts/pages/modules |
| File stub `export X = {}` | 8 | constants (5) + config (3) |
| File barrel `throw new Error('Not implemented')` | 6 | index.js inventory/loyalty/finance/shift/backup/cafe (tidak diimpor mana pun) |
| Halaman "Coming Soon" | 4 | pos, inventory, categories, dashboard |

**Total file stub/placeholder/orphan di src ≈ 46 (25%).**

### 3.3 console.* (66 pemanggilan; 4 di logger)

| File | Jumlah |
|---|---|
| src/pwa/pwa-register.js | 14 |
| src/pwa/pwa-cache-manager.js | 11 |
| src/repositories/base-repository.js | 9 (semua `console.error` — bypass logger) |
| src/database/seeds.js | 7 |
| src/database/database-manager.js | 6 |
| src/pwa/pwa-install.js | 6 |
| src/utils/logger.js | 4 (disengaja) |
| lainnya (export-helper, bootstrap, router, dll) | 9 |

→ **Mengabaikan layer logger** (`src/utils/logger.js` adalah abstraksi mati; repo/service memakai `console.*`).

### 3.4 `window.` (47 pemakaian, 19 file)

Semua sah: `window.location.hash`, `addEventListener`, `matchMedia`, `onerror`. **5 inline `onclick` string** (error-handler.js:12, router.js:92, not-found-page.js:11, guards) — menyalahi pola module/CSP.

### 3.5 Duplikasi / dead code bernama

| Duplikasi | Keterangan |
|---|---|
| `renderAppLayout` | `AppLayout.js:10` (dipakai) vs `app-layout.js:6` (dead) |
| `renderSidebar` / `renderTopbar` | `Sidebar.js:62` / `Topbar.js:16` (dipakai) vs `components/layout/app-sidebar.js` / `app-topbar.js` (dead) |
| `isXlsxAvailable` | `export-helper.js:11` & `import-helper.js:9` — dua modul, nama sama |
| `MODULES`/`ACTIONS` | `constants/permissions.js` (stub `{}`) vs `permission-service.js` (riil) |
| Dua dashboard | `pages/Dashboard.js` (aktif) vs `pages/dashboard/dashboard-page.js` (dead) |
| Dua halaman login | `pages/LoginPage.js` (aktif) vs `pages/login/login-page.js` (dead; rememberMe diabaikan) |

### 3.6 Bendera sintaks

- **Tidak ada** empty `catch {}` berbahaya; tidak ada circular dependency ditemukan.
- `throw new Error` di luar stub hanya di base-repository (not found), user/role-service (validasi), product-service (XLSX), Login/FirstRun.
- `getById` di base-repository **mengembalikan `null`** sedangkan `update`/`delete` **melempar** saat tidak ditemukan — inkonsistensi API.
- Risiko unhandled rejection: `authenticate()`, `ensureSystemRoles()`, user/role/permission-service, beberapa page init (audit/database/store) tanpa try/catch.

**Phase 3 verdict: PARTIAL (struktur modular solid, 0 import rusak, tetapi 25% file stub dan banyak dead code paralel).**

---

## 4. ARCHITECTURE AUDIT (Phase 4)

Layer yang diinginkan: `UI → Page → Service → Repository → Database`.

### Architecture Compliance Matrix

| Jalur | Status | Bukti |
|---|---|---|
| Page → Service → Repository → Dexie (modul baru) | ✅ KOMPLIAN | `products-page.js` → `productService` → `productRepository` → `db` (tidak ada `db` di page) |
| Page → **db langsung** | ❌ VIOLASI | `store-page.js:8,131`; `audit-page.js:8,9,15`; `backup-page.js:12`; `database-page.js:13,81,100` |
| Service → **db langsung** | ❌ VIOLASI | `user-service.js` (`:5,9,13,30,51,61,68,76`); `role-service.js`; `permission-service.js`; `auth-service.js:78,85` |
| Auth → **db langsung** | ❌ VIOLASI | `auth.js` (`:26,28,37,40,63,68,75,93,95`); `login.js` (`:13,28`) |
| Service → DOM | ✅ Tidak ada | service tidak menyentuh DOM |
| Repository → Business Logic | ✅ Tidak ada | repository murni akses data |
| Business Logic → UI | ✅ Tidak ada | terpisah |
| Circular dependency | ✅ Tidak ditemukan | — |

**Phase 4 verdict: FAIL (12+ file melewati layer Repository, melanggar ADR-004/005 dan 19/24).**

---

## 5. AUTHENTICATION AUDIT (Phase 5)

### 5.1 Alur yang terverifikasi

- **Login** (`auth/login.js:4-44`): validasi non-empty & min 6 char → lookup `users` (lowercase) → cek `isActive` → `sha256(password)` dibanding hash → muat role → return `{success,user}`. Dipanggil `authService.login`.
- **Password hash:** **SHA-256 TANPA SALT** (`utils/hash-utils.js:1-8`, duplikat di `user-service.js:79-86`). Rentan rainbow table / offline attack. Tidak konsisten dengan standar PBKDF2+salt di docs/22 & ADR-023/027.
- **Session** (`auth/session.js`): key `pos_offline_session`; rememberMe→localStorage, non→sessionStorage; durasi 24 jam / 30 hari; field `expiresAt/loginTime/lastActivity/deviceId`; **session expired dihapus & dianggap invalid** (isSessionExpired→clearSession). deviceId bind via `pos_offline_device_id`.
- **Logout** (`auth-service.js:36-46`): `endSession()` (set logoutTime → clear), redirect `#/login` + reload. Berfungsi (diverifikasi runtime & headless test sebelumnya).
- **Route guard** (`guards.js` + `router.js:110-125`): cek login + `validateSession` (DB re-check user/role). Redirect ke `#/login`.
- **First-run owner onboarding** (`auth.js:49-89`, `FirstRunPage.js`): buat akun owner (SHA-256). **Tidak ada default password / auto-login.**
- **RBAC: `ROLE_PERMISSIONS`** (auth-service.js:13-17): Owner=8 route, Admin=7 (tanpa pengaturan), Kasir=2 (dashboard, penjualan). **Hanya dipakai untuk filter sidebar.**

### 5.2 Temuan Auth

| Temuan | Severity |
|---|---|
| `isScreenLocked()` **hardcoded `false`** (idle-service.js:25-27); idle timeout **meng-logout, bukan mengunci**; `lock-screen-page` hanya ter-reach bila ketik `#/lock-screen` manual; tidak ada alur yang menavigasi ke sana. | P1 |
| Username/role dipakai sebagai key RBAC (name-keyed); me-rename role di UI memutus otorisasi. | P1 |
| **Tidak ada rate limiting / lockout** meski `maxLoginAttempts: 5` ada di `app.config.js:14` (tidak pernah dibaca). | P2 |
| `LEGACY_DEFAULT_USER_IDS` ('user-owner/admin/kasir', password "publik") tidak dibuat oleh kode, tetapi bila ada di DB migrasi **tetap bisa login** dan tereksekusi first-run → dihapus. Tepi risiko kecil. | P2 |
| `logoutTime` di-set lalu storage langsung dibersihkan → `getLogoutTime()` selalu `null` (bookkeeping mati). | P3 |
| Page login kedua (`login/login-page.js`) TIDAK mengirim rememberMe. | P3 |
| Session key & const `STORAGE_KEYS` duplikat (string hardcode di session.js:1 vs constants/storage.js:14). | P3 |

**Phase 5 verdict: PARTIAL (inti auth aman & teruji; lock screen dan hashing bermasalah).**

---

## 6. ROUTER AUDIT (Phase 6)

### 6.1 Route Aktif (`src/router/router.js:5-66`)

| key | Page | protected | authOnly |
|---|---|---|---|
| login | LoginPage.js | ✗ | ✓ |
| lock-screen | lock-screen-page.js | ✓ | ✗ |
| dashboard | Dashboard.js | ✓ | ✗ |
| penjualan | sales/sales-page.js | ✓ | ✗ |
| produk | products/products-page.js | ✓ | ✗ |
| pelanggan | customers/customers-page.js | ✓ | ✗ |
| supplier | suppliers/suppliers-page.js | ✓ | ✗ |
| pembelian | purchases/purchases-page.js | ✓ | ✗ |
| laporan | reports/reports-page.js | ✓ | ✗ |
| pengaturan | settings/settings-page.js | ✓ | ✗ |

### 6.2 Temuan Router

| Temuan | Severity |
|---|---|
| **TIDAK ada cek role per route** — hanya cek login. Kasir dapat membuka `#/pengaturan`, `#/laporan`, `#/produk` langsung via URL; sidebar menyembunyikannya tapi page tetap render. | **P0/P1** |
| **Route `#/pos`, `#/inventory`, `#/categories` → 404 inline** padahal halaman ada (pos/inventory/categories placeholder) dan POS adalah fitur inti. | P1 |
| **Dua sistem router**: `router.js` (aktif) vs `routes.js`+`navigation-manager.js` (dead, tidak dipanggil siapa pun; breadcrumb & sidebar kedua tidak pernah terlaksana). | P2 |
| 404 inline (`router.js:75-84`) bukan komponen `not-found-page.js` (hanya dipakai route dead). | P2 |
| `getRouteKey` menghapus setelah `/` pertama → `#/produk/123` = produk (ok). `#/` → dashboard. | — |

**Phase 6 verdict: FAIL (authorization gap + route inti hilang + router ganda).**

---

## 7. DATABASE AUDIT (Phase 7)

### 7.1 Fakta

| Aspek | Nilai |
|---|---|
| DB | `PosOfflineDB` (Dexie v4 CDN 4.0.10) |
| SCHEMA_VERSION | 2 (`db.version(2).stores(...)`) |
| Tabel | **34** (semua sesuai docs/02 & docs/23 — tabel names/indexes MATCH) |
| Primary key | semua `id` string UUID; unique index `&` pada username, name(roles), key(settings), sku, invoiceNumber, poNumber, code(vouchers), productId(inventories), opnameNumber, expenseNumber, incomeNumber, shiftNumber, customerId/memberNumber(memberships) |
| Seed | otomatis via `DatabaseManager.initialize()` (idempotent): 5 kategori, 6 unit, 3 supplier, 20 produk, 3 PO+15 item, 5 sale+25 item, 13 settings |
| Migrasi | **STUB** — `migrations.js` hanya `console.log`; **tidak ada `.upgrade()`, tidak ada deklarasi v1** |
| Transaction | **hanya `restore.js:73`** (satu-satunya `db.transaction` di seluruh codebase) |
| Soft delete | ✅ via `BaseRepository` (`deletedAt`); `hardDelete` ada tapi tak dipakai |

### 7.2 Tabel terpakai vs orphan (20 berkasus)

| Grup | Tabel | Writer | Reader |
|---|---|---|---|
| Aktif dipakai | users, roles, permissions, settings, suppliers, customers, products, purchases, purchaseItems, backupMetadata | ya | ya |
| Parsial (read/seed only) | sales, saleItems | **seeds only** | sales-page/report |
| Read-only (tanpa writer) | payments, auditLogs | **tidak ada** | sales-repository / audit-page |
| **Orphan** | discounts, taxes, vouchers, inventories, stockMovements, stockAdjustments, stockOpnames, stockOpnameItems, cashFlows, expenses, incomes, shifts, activityLogs, tables, kitchenOrders, reservations, memberships, loyaltyPoints | **tidak ada** | tidak ada |

### 7.3 Bug KRITIS — Backup/Restore

Di-reproduksi di runtime (Dexie 4.4.4; akan serupa di CDN 4.0.10 karena `db.tables` adalah properti bawaan Dexie):

```
TypeError: db[table.name].toArray is not a function   (backup.js:17)
TypeError: db[table.name].clear is not a function     (restore.js:75)
```

**Akar:** tabel bernama `tables` (cafe) bertabrakan dengan properti `db.tables` milik Dexie (array of Table). Saat iterasi `TABLES` sampai ke index ke-29 (`tables`), `db['tables']` mengembalikan array, bukan Table → `.toArray()`/`.clear()` tidak ada.

- **Ekspor**: `backup.js:17` selalu gagal lewat iterasi (`tables` adalah salah satu dari 34 tabel). Jadi **backup TIDAK PERNAH berhasil** — kecuali tabel di-skip. P0.
- **Restore**: `restore.js:75` `db['tables'].clear()` pasti gagal → restore TIDAK pernah berjalan. P0.

### 7.4 Temuan DB tambahan

| Temuan | Severity |
|---|---|
| Tidak ada referential integrity enforcement; PO header & items **dua write independen tanpa transaction** (kondisi parsial bila gagal). | P1 |
| `purchase-service.updateStatus` bisa mengubah PO yang sudah soft-deleted (getById tidak filter deletedAt). | P2 |
| `saleItems/purchaseItems/payments` tanpa `deletedAt` → bisa orphan dari parent soft-delete. | P2 |
| `getTopProducts` menghitung saleItems dari sales yang soft-deleted & produk yang dihapus. | P2 |
| `database-page.js:81` "Kompresi Database" sebenarnya memanggil `db.delete()` (hapus seluruh DB). | P2 |
| Tidak ada migration/upgrade handler — mengubah `buildStoreDefinitions()` tanpa menaikkan versi TIDAK akan diterapkan pada DB lama; naikkan konstanta tanpa `db.version(n+1)` membuat angka dan realita drift. | P1 |

**Phase 7 verdict: FAIL (bug kritis backup/restore + migrasi tidak ada).**

---

## 8. MODULE AUDIT (Phase 8)

Status per modul (kode, bukan dokumen):

| Modul | index | Service | Repository | Validator | Status |
|---|---|---|---|---|---|
| product | ✅ | ✅ | ✅ | ✅ (tp. dead code, logic inline) | **COMPLETE** |
| purchase | ✅ | ✅ | ✅ | inline | **COMPLETE** (dengan catatan: tidak sentuh stok) |
| customer | ✅ | ✅ | ✅ | inline | **COMPLETE** |
| supplier | ✅ | ✅ | ✅ | inline | **COMPLETE** |
| report | ✅ | ✅ | ✅ | — | **PARTIAL** (4 report) |
| sales | ✅ | ⚠️ | ⚠️ | — | **PARTIAL → BROKEN utk inti** (hanya baca/hapus) |
| inventory | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** |
| finance | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** |
| shift | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** |
| backup (modul) | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** (real di database/) |
| cafe | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** |
| loyalty | 🚧 | 🚧 | 🚧 | — | **PLANNED/MISSING** |

Setiap modul dinilai untuk: UI / Page / Service / Repository / Validator / Utils / Index / Database / Route / Permission / Testing — lihat **Feature Maturity Matrix** (Phase 32).

---

## 9. PRODUCT MODULE AUDIT (Phase 9) — Deep Dive

**Status keseluruhan: COMPLETE** (salah satu yang paling baik).

### 9.1 Layering — KOMPLIAN
`products-page.js` → `productService` (tanpa `db`) → `productRepository` (satu-satunya yang menyentuh `db.products`) → Dexie. Tidak ada `db` di page; tidak ada DOM di service.

### 9.2 API service
`getAll`, `getById`, `findBySku`, `create` (validasi inline + cek SKU duplikat + auto `PRD-####`), `update` (cek SKU hanya jika berubah), `delete` (soft), `validate`, `exportToExcel`, `importFromExcel`, `getCategories`, `getUnits`, `getSuppliers`.

### 9.3 CRUD / Search / Sort / Pagination
- CRUD end-to-end: PAS (ditrace + diuji runtime: create/update/soft delete bekerja).
- Search: debounce 300ms → filter `name/sku/barcode` (in-memory atas `toArray()` penuh — tidak pakai index).
- Pagination: real (10/halaman), prev/next + "Halaman X dari Y".
- Soft delete terverifikasi runtime: `deletedFromList=true getByIdStillReturns=true`.

### 9.4 Temuan Produk

| Temuan | Severity |
|---|---|
| `product-validator.js` adalah **dead code** (tidak pernah diimpor; validasi diduplikasi inline di service). | P2 |
| **Barcode tidak dicek keunikan** (index `barcode` non-unique) — skema & business rule 17/18 minta unik. | P1 |
| Hasil import Excel (baris gagal) **dibuang** di page (`products-page.js:55`) — user tidak melihat error tiap baris. | P2 |
| `getNextSku` lexicographic-max: `PRD-9`/`PRD-10` atau `PRD-9999` bisa collision. | P2 |
| `getById` tidak filter `deletedAt` → detail produk soft-deleted masih bisa dibuka. | P3 |
| `loadTable` tanpa try/catch untuk `getAll` di page. | P3 |
| Tidak ada validasi `sellPrice >= buyPrice` (hanya warning menurut rule). | P3 |
| Stok tidak dikurangi saat penjualan — **sesuai desain** (sales belum ada), bukan bug modul produk. | — |

---

## 10. PWA AUDIT (Phase 10)

### 10.1 Fakta
- **Manifest**: `POS Offline PWA`; `start_url:"/"`; `scope:"/"`; `display:standalone`; theme `#3B82F6`; **10 ikon lengkap & ada di disk** (8 PNG valid + 2 SVG); favicon → `src/pwa/icons/icon-192.svg` (ada).
- **Service Worker**: `CACHE_VERSION='v4'`; 3 cache (`pos-app-v4`, `pos-cdn-v4`, `pos-dynamic-v4`); strategi: navigasi networkFirst, asset static cacheFirst, CDN cacheFirst; `skipWaiting` + `clients.claim`; reload otomatis saat `controllerchange`; cleanup cache yang bukan `VALID_CACHES`; fallback `offline.html`.
- **Registrasi**: `pwa-register.js` (bukan inline), scope `/`, tidak condition pada localhost/https (hanya feature-check `navigator.serviceWorker`).

### 10.2 Temuan PWA

| Temuan | Severity |
|---|---|
| **Precache `APP_ASSETS` (57 item) berbasis arsitektur lama** — memuat `LoginPage.js/Dashboard.js/Sidebar.js/Topbar.js` dll, tetapi **MELEWATKAN seluruh halaman runtime-router** (products/sales/customers/suppliers/purchases/reports/settings/lock-screen), **semua `src/modules/*`**, komponen app-* baru, services, settings sub-pages, `routes.js`. Navigasi offline pertama ke route non-precache → error router (bukan full white screen). | **P1** |
| **Dua sumber kebenaran list precache** (`service-worker.js` vs `pwa-config.js`) — harus sinkron manual. | P2 |
| Tombol install (`pwaInstall.showPrompt()`) **tidak pernah dipanggil** dari UI mana pun. | P2 |
| **Tidak ada SRI** (`integrity`) pada CDN; library di `<body>` tanpa `defer` (module sudah deferred). | P2 |
| Potensi **double reload** saat update: `app.js` (guard) + `pwa-register.js` (tanpa guard) keduanya bisa reload. | P2 |
| CDN 5.3.3/1.11.3/4.0.10/2.5.2 vs package.json — versi tidak selaras (lihat Phase 2). | P2 |
| Offline behavior shell aman (bootstrap chain di-precache); non-precache dipakai setelah dikunjungi online sekali. | — |

**Phase 10 verdict: PARTIAL (fondasi PWA benar; precache basi = risiko offline).**

---

## 11. HTML & CSS AUDIT (Phase 11)

### index.html
- 9 CSS app + 4 lib CDN + module entry `src/app/app.js` (type=module). **Tidak ada duplikat load; urutan benar** (lib sebelum module).
- Tidak ada `defer` pada lib; tidak ada SRI.

### CSS
- 9 file `src/styles/*` dimuat langung: variables, base, theme, layout, components, utilities, sidebar, topbar, dashboard.
- `src/styles/modules/*` & `src/styles/pages/*` **placeholder** — tidak pernah direferensikan.
- **Dark mode**: `[data-theme="dark"]` + CSS variables (variabel sering di-override inline!).
- **3 `!important`** di components.css/theme.css + inline `!important` di Login/FirstRun.
- **Inline styles luas** (100+ `style=`) di LoginPage, LoginForm, Dashboard, router error, Topbar, products, suppliers, settings pages, app-* komponen — **melanggar standar no-inline-style**.
- **Hardcoded hex di luar variables.css**: dashboard.css (31), layout.css (14), sidebar.css (22), topbar.css (15), plus hex inline di JS (`#FECACA`, `#2563eb`, `#ef4444`, `#fff`, dst).

**Phase 11 verdict: PARTIAL (token system ada tapi dievakuasi inline; banyak placeholder CSS).**

---

## 12. ASSET AUDIT (Phase 12)

| Aset | Status |
|---|---|
| Manifest icons (10) | ✅ semua ada & valid di `src/pwa/icons/` |
| favicon (`icon-192.svg`) | ✅ ada, dirujuk benar |
| `src/assets/images/favicon.ico` | ❌ **0–1 byte (corrupt), tidak dirujuk** — dead asset |
| `src/assets/fonts` / `icons` / `sounds` | ❌ kosong (font via Google Fonts CDN) |
| CSS app (9) | ✅ ada |
| Precache APP_ASSETS (57) | ✅ semua file ada di disk (tidak ada 404), namun list basi (Phase 10) |
| CDN (7) | ✅ URL valid |

**Phase 12 verdict: PASS (tanpa 404-path wrong; satu dead asset corrupt; asset folders kosong).**

---

## 13. ERROR AUDIT (Phase 13)

Tabel ringkasan (detail di Phase 3):

| File | Baris | Problem | Severity | Impact |
|---|---|---|---|---|
| src/database/backup.js | 17 | `db['tables']` = array (collision Dexie) → `.toArray` gagal | **CRITICAL** | Backup tidak pernah berhasil |
| src/database/restore.js | 75 | `db['tables'].clear` gagal | **CRITICAL** | Restore tidak pernah berhasil |
| src/router/router.js | 110–125 | Route hanya cek login, bukan role | **HIGH** | Akses tak berizin via URL |
| src/router/routes.js + navigation-manager.js | seluruh | Router paralel/dead + breadcrumb tak jalan | MEDIUM | Kebingungan/kode mati |
| src/pwa/* | 33 panggilan | console.* bypass logger | LOW | Log tak terpusat |
| src/repositories/base-repository.js | 63–158 | 9× console.error (bukan logger) | LOW | Tidak konsisten log |
| 40 file | 1 | `// TODO:` field/selesai sebagai stub | MEDIUM | Fitur diklaim namun kosong |
| 8 file | 1 | `export X = {}` stub | MEDIUM | Konstanta dipakai return kosong |
| 6 file barrel | 2–3 | `throw new Error('Not implemented')` | MEDIUM | Memanggil = crash (tapi tak diimpor) |
| src/pages/pos / inventory / categories / dashboard | 12–18 | "Coming Soon" placeholder | HIGH | Inti fitur tidak ada |
| src/services/audit-service.js | 1 | auditTidak ada writer | HIGH | Tabel audit selalu kosong |
| session.js | 156–167 | logoutTime dihapus langsung | LOW | getLogoutTime selalu null |
| user-service.js:23,44 | — | PIN plaintext | HIGH | Data sensitif tanpa enkripsi |

---

## 14. SECURITY AUDIT (Phase 14)

Merujuk `docs/22_SECURITY_GUIDE.md`:

| Aspek | Aktual | Status |
|---|---|---|
| Authentication | Login lokal + session expiry + device binding | ✅ OK (gap hashing) |
| Password hashing | **SHA-256 tanpa salt** (bukan PBKDF2+salt) | ❌ GAP |
| Authorization | RBAC 3 role namun **tidak di-enforce di route** | ❌ FAIL |
| Session | Web Storage; expired/device beda → invalid | ✅ OK |
| Rate limiting | Tidak ada (config `maxLoginAttempts` tak dipakai) | ❌ MISSING |
| PIN/PIN user | **plaintext** di database | ❌ FAIL |
| XSS | Input tidak disanitasi secara eksplisit; beberapa template `data-name="${s.name}"` tanpa escape (HTML injection vector) di purchases-page:242 | ⚠️ RISIKO |
| Injection | Tidak ada backend; IndexedDB aman dari SQLi (bukan ancaman) | N/A |
| Hardcoded credential | Tidak ada password/kunci di kode (shift: legacy user ids berpasangan password publik yang tak pernah dibuat) | ✅ (risiko kecil) |
| Larangan token | Tidak ada token/API key | ✅ |
| SW | kontrol penuh cache + offline fallback | ✅, precache basi ⚠️ |
| Audit log | **Writer tidak ada** — tabel selalu kosong; halaman audit menampilkan kosong | ❌ FAIL |
| File upload | Import Excel (XLSX) dari user — **CVE-2023-30533/CVE-2024-22363** pada xlsx 0.18.5 | ⚠️ RISIKO |
| Backup | Plain JSON (unencrypted), checksum SHA-256 atas `data` saja (version/exportedAt tidak dilindungi) | ⚠️ |

**Phase 14 verdict: FAIL (password hashing, permission enforcement, audit writer, plaintext PIN, XSS vector).**

---

## 15. BUSINESS RULE AUDIT (Phase 15)

Merujuk `docs/17_BUSINESS_RULES.md`. Sample rules kritis:

| Rule | Doc ref | Implementasi | Status |
|---|---|---|---|
| SKU unique | 17 §2.1, 18 §10.3 | `&sku` index + `findBySku` | ✅ COMPLIANT |
| Barcode unique | 17 §2.1 | **tidak ada** | ❌ NOT IMPLEMENTED |
| sellPrice >= buyPrice (warning) | 17 §19.2 | tidak ada | ❌ NOT IMPLEMENTED |
| Min stock alert | 17 §2.1 | minStock ≥ 0 saja; **no consumer** | ⚠️ PARTIAL |
| Soft delete | 17 §2.1 | `deletedAt` via BaseRepository | ✅ COMPLIANT |
| PO workflow DRAFT→APPROVED→RECEIVED→COMPLETED; no cancel after received | 17 §6.1, §6.2 | status `draft/ordered/received/cancelled`;**`received → cancelled` DIPERBOLEHKAN** (kontradiksi); DRAFT unreachable (create set 'ordered') | ❌ VIOLATED |
| Receive ⇒ stok bertambah + stockMovement | 17 §6.2 #5 | tidak ada | ❌ NOT IMPLEMENTED |
| Partial receive | 17 §6.5 | tidak ada | ❌ NOT IMPLEMENTED |
| PO number `PO-YYYYMMDD-XXXX` | 17 §6.2 | generator `PO-0001` sequential (format beda; docs 17 vs 18 kontradiktif) | ⚠️ PARTIAL |
| Password min length | 18 §15.6 (8) | 6 di kode | ⚠️ PARTIAL (docs internal beda) |
| Inactive user ditolak | 17/18 | `login.js:19-21` | ✅ COMPLIANT |
| Session expiry / idle lock | 17 §18.3, 18 §15.4 | expiry enforced; lock TIDAK (idle logout) | ⚠️ PARTIAL |
| Login attempt limit | 17 §18.3 | tidak ada | ❌ NOT IMPLEMENTED |
| Invoice `INV-YYYYMMDD-XXXX` unik | 17 §7.2 | tidak ada generator/create | ❌ NOT IMPLEMENTED |
| ≥1 item detail per sale | 17 §7.2 | tidak ada create | ❌ NOT IMPLEMENTED |
| Stok turun saat PAID, void kembalikan | 17 §7.1 | tidak ada | ❌ NOT IMPLEMENTED |
| Hold/Resume bill | 17 §7.5 | tidak ada | ❌ NOT IMPLEMENTED |
| Setiap stok via stockMovement | 17 §3.1 | stock adalah kolom `products.stock` editable langsung; tabel stockMovements tanpa writer | ❌ NOT IMPLEMENTED |
| Recipe/BOM/HPP | 17 §5 | tabel tidak ada di skema | ❌ NOT IMPLEMENTED |
| Refund/return | 17 §7.7 | tidak ada | ❌ NOT IMPLEMENTED |

**Phase 15 verdict: FAIL — mayoritas business rule inti transaksi/inventory belum atau tidak sesuai implementasi; ditemukan kontradiksi langsung antara rule dan kode (PO cancel after received).**

---

## 16. API CONTRACT AUDIT (Phase 16)

Merujuk `docs/18_API_CONTRACT.md`:

| Kontrak | Aktual | Status |
|---|---|---|
| `findById` / `findAll` / `restore` / `paginate` / bulk ops | base-repository pakai `getById`/`getAll`; `restore`/`paginate`/bulk **MISSING** | ❌ MISMATCH |
| Service `product.getAll` return StandardResponse | return raw `PaginatedResult` | ❌ |
| `purchase.update(id,changes)` | hanya `updateStatus` | ⚠️ |
| `sales.create/update/validate` | **tidak ada** | ❌ |
| Envelope response `{success,data,message,errors,meta}` | campur: `{success,data/errors}` vs raw boolean vs plain obj; **meta tidak ada di mana pun**; error type system tidak dipakai | ❌ |
| Nama route permission `{module}:{action}` | `hasPermission` pakai route-key sederhana | ❌ |
| `search(query,options)` | repo implement; service `getAll(options)` | ⚠️ |
| Error handling | `throw Error` (user/role/permission-service) vs `{success:false}` (product/purchase) — tidak konsisten | ❌ |
| Login response | `{success,error(singular),user,session}` — tidak sesuai envelope | ⚠️ |

**Phase 16 verdict: FAIL (banyak kontrak tak terpenuhi/diubah; internal docs 17 vs 18 juga saling kontradiktif).**

---

## 17. DEVELOPMENT STANDARD AUDIT (Phase 17)

| Standar (docs/19) | Status |
|---|---|
| Naming kebab-case | ❌ VIOLATED: legacy PascalCase (Card, KPI, LoginForm, Sidebar, Topbar, AppLayout, Dashboard, FirstRunPage) |
| Folder modular | ✅ COMPLIANT |
| Layer UI→Page→Service→Repo→DB | ❌ VIOLATED (Phase 4) |
| No inline style | ❌ VIOLATED (100+ `style=`) |
| No hardcoded color | ❌ VIOLATED (variabel + inline + css) |
| Error via logger | ⚠️ PARTIAL (62 console bypass) |
| Validasi semua layer | ⚠️ PARTIAL (produk saja) |
| No console.log prod | ❌ VIOLATED |
| No hardcoded secret/plaintext | ⚠️ PARTIAL (PIN plaintext) |
| Fungsi ≤150 baris | ⚠️ sebagian |
| Cleanup dead code | ❌ (banyak duplikat/orphan) |

**Phase 17 verdict: FAIL.**

---

## 18. TESTING AUDIT (Phase 18)

Date: **Semua 14 file test adalah stub — TIDAK ADA satu pun test yang bisa dijalankan.**

| File | Isi |
|---|---|
| tests/unit/* (3) | 1 baris `// TODO: Unit test — ...` |
| tests/integration/* (3) | 1 baris TODO |
| tests/mocks/* (2) | 2 baris TODO |
| tests/fixtures/* (3) | placeholder note + array kosong |
| tests/manual/* (3) | **template** (skenario tanpa hasil/status) |

- **Tidak ada test runner**: `package.json` hanya script `start`/`dev`. Tidak ada vitest/jest; `docs/20` menyebut vitest tapi tidak terinstal.
- 9 level testing didokumentasikan; **0 level yang memiliki artefak aktual.**
- Satu-satunya "pengujian" yang terjadi adalah smoke test harness eksternal (bukan bagian repo).

**Phase 18 verdict: FAIL (MISSING).**

---

## 19. DEPLOYMENT AUDIT (Phase 19)

| Metode (docs/21) | Aktual | Status |
|---|---|---|
| `npm start` / `npm run dev` → http-server `. -c-1` | ✅ berjalan (verified: 200) | **AVAILABLE** |
| `npx serve` | mungkin (tidak diuji) | UNVERIFIED |
| Python http.server | command ada di OS, tidak diuji | UNVERIFIED |
| Hosting di web server statis (Apache/Nginx/XAMPP) | **tidak otomatis**; hanya panduan | **MISSING** (belum disiapkan) |
| PWA production build | **tidak ada build step**; source langsung | N/A (by design) |
| Update via SW | ada (v4 + reload) | AVAILABLE (risiko precache basi) |
| Deployment Android/Desktop | hanya rencana | **PLANNED** |
| Backup sebelum deploy | tidak otomatis | MISSING |

**Phase 19 verdict: PARTIAL (dev server AVAILABLE; produksi belum ada prosesnya).**

---

## 20. DATABASE DESIGN COMPLIANCE (Phase 20)

### Database Compliance Matrix (docs/23 vs aktual)

| Aspek | docs/23 | Aktual | Status |
|---|---|---|---|
| Nama tabel & field (34) | lengkap | **persis sama** (schema.js) | ✅ MATCH |
| Indexes | matching | **byte-for-byte** | ✅ MATCH |
| `inventories` sebagai "stok terkini per produk" | ya | **tidak pernah ditulis**; stok hidup di `products.stock` | ❌ GAP (dual source) |
| Riwayat migrasi v1 | didokumentasikan | **`migrations.js` stub, tidak ada v1 declare** | ❌ GAP |
| Header+detail satu transaction | docs §11.4/12.5 | hanya `restore.js:73` | ❌ GAP |
| Service tidak boleh akses DB langsung | docs §7.5 | dilanggar 12+ file | ❌ GAP |
| Soft delete universal (default filter) | docs §8.5 | `getById`/`getUser` tidak filter | ❌ GAP |
| Audit log diimplementasikan | framing "implemented" | table ada, writer tidak | ❌ GAP |
| Tabel cafe/loyalty "implemented" | framing | modul semua stub | ❌ GAP |

**Phase 20 verdict: FAIL (skema match, perilaku gap luas).**

---

## 21. AI DEVELOPMENT COMPLIANCE (Phase 21)

Merujuk `docs/24_AI_DEVELOPMENT_GUIDE.md`:
- **Struktur dokumen ada** → COMPLIANT (structural).
- **Substance TIDAK**: aturan layer (§3.3), logger (§6.2/§14.2), no-hardcode, test wajib, batas fungsi, DRY -> semua dilanggar (lihat Phase 4/13/17/18).
- Banyak file AI-generated berbentuk stub placeholder (loyalty/cafe/finance/audit) tanpa test & tanpa penerapan aturan. Duplikat (AppLayout vs app-layout, Dashboard vs dashboard-page) menunjukkan artefak AI belum dibersihkan.

**Phase 21 verdict: PARTIAL structural / FAIL substance.**

---

## 22. ARCHITECTURE DECISION AUDIT (Phase 22)

| ADR | Status dokumen | Verdict kode |
|---|---|---|
| ADR-001 Offline First | ACCEPTED | ✅ IMPLEMENTED |
| ADR-002 PWA | ACCEPTED | ✅ IMPLEMENTED (precache basi) |
| ADR-003 Dexie engine | ACCEPTED | ✅ IMPLEMENTED |
| ADR-004 Repository Pattern | ACCEPTED | ⚠️ PARTIAL (bypass di 12+ file) |
| ADR-005 Service Layer | ACCEPTED | ⚠️ PARTIAL |
| ADR-006 Universal Item Model | PROPOSED (partial) | ⚠️ PARTIAL (`products.type` ada; `types.js` stub) |
| ADR-007 Stock Movement | ACCEPTED (skema)/IN PROGRESS | ⚠️ PARTIAL (no writers) |
| ADR-008 Recipe/BOM | PROPOSED | ❌ NOT IMPLEMENTED |
| ADR-009 Auth | ACCEPTED | ✅ IMPLEMENTED |
| ADR-010 RBAC | ACCEPTED (3 role) | ⚠️ PARTIAL (permission matrix tak terhubung) |
| ADR-011 Soft Delete | ACCEPTED | ✅ IMPLEMENTED |
| ADR-012 Modular | ACCEPTED | ⚠️ PARTIAL (banyak stub) |
| ADR-013 ES Modules | ACCEPTED | ✅ IMPLEMENTED |
| ADR-014 Design System | ACCEPTED | ⚠️ PARTIAL (inline/hardcode) |
| ADR-015 SW Strategy | ACCEPTED | ✅ IMPLEMENTED (precache basi) |
| ADR-016 Routing | ACCEPTED | ⚠️ PARTIAL (dual system) |
| ADR-017 Import/Export | ACCEPTED | ✅ IMPLEMENTED |
| ADR-018 Validation | ACCEPTED | ⚠️ PARTIAL (produk saja) |
| ADR-019 Audit Logging | ACCEPTED (skema)/IN PROGRESS | ❌ NOT IMPLEMENTED (writer) |
| ADR-020 Error Handling | ACCEPTED | ⚠️ PARTIAL (console bypass + unhandled) |
| ADR-021 Testing | PROPOSED | ❌ NOT IMPLEMENTED |
| ADR-022 Deployment | ACCEPTED | ✅ IMPLEMENTED (dev; prod belum) |
| ADR-023 Security | ACCEPTED (gap noted) | ⚠️ PARTIAL (SHA-256, hashing gap terkonfirmasi) |
| ADR-024 AI Assisted | ACCEPTED | ⚠️ PARTIAL (rule unenforced) |
| ADR-025 Scalability | PROPOSED | ❌ NOT IMPLEMENTED |
| ADR-026 Role expansion | PROPOSED | ❌ NOT IMPLEMENTED |
| ADR-027 Hashing improvement | PROPOSED | ❌ NOT IMPLEMENTED |

**Phase 22 verdict: dari 27 ADR → ~11 IMPLEMENTED, ~11 PARTIAL, ~5 NOT IMPLEMENTED.**

---

## 23. RELEASE READINESS (Phase 23)

Merujuk `docs/26_RELEASE_ROADMAP.md`:

- **Current Version:** `1.0.0` (label) — produktif aktual ≈ pra-alpa (tidak ada feature gate rilis).
- **Current Phase:** 2/3/5/7 parsial + 6/8 TODO (campuran).
- **Current Sprint:** 3.2 (ditargetkan).
- **Completed Features:** Auth, RBAC menu-level, user/role/permission CRUD, produk CRUD+Excel, customer, supplier, purchase (PO+receive, tanpa stok), settings (8 tab), backup/restore infra (**broken runtime**), PWA shell, theme, laporan sales/purchase/stock/top produk.
- **Partial Features:** sales history, dashboard (statis), reports (4/12+), lock screen (tak terhubung), audit view (table kosong).
- **Broken Features:** backup, restore, permission enforcement (role-by-URL bypass), PO cancel-after-received rule, getNextPO/getNextCode collision, audit log writer.
- **Missing Features:** POS checkout, cart, payment, invoice, receipt, inventory (movement/adjustment/opname), finance, shift, hold/resume, void, return, barcode, printer, promo, loyalty, category/unit CRUD page, test runner, git, CI.
- **Release Blockers:** lihat Phase 30.

**Phase 23 verdict:** v1.0 **JAUH** — mayoritas P0 (POS, inventory, payment, dashboard live, test) belum ada.

---

## 24. MAINTENANCE READINESS (Phase 24)

`docs/27_MAINTENANCE_GUIDE.md` **BUKAN panduan aktual** — isi file tersebut adalah **template tugas (task prompt)**: "Buat file docs/27_MAINTENANCE_GUIDE.md ... JANGAN mengubah source code ...". Tidak ada isi maintenance (checklist harian, prosedur restore, troubleshooting) yang riil.

| Aspek maintenance | Status |
|---|---|
| Backup | Ada infra, **broken runtime** |
| Restore | Ada infra, **broken runtime** |
| Logging | logger + console campur; log tak persist dalam app |
| Troubleshooting | tidak ada panduan riil |
| Monitoring | tidak ada (storage/pend) |
| Update | SW v4, tetapi precache basi & double-source version |
| Rollback | tidak ada prosedur otomatis; backup broken |
| Disaster Recovery | tidak ada panduan riil |

**Phase 24 verdict: FAIL (panduan maintenance belum ditulis; fasilitas recovery broken).**

---

## 25. RUNTIME TEST (Phase 25)

Di lingkungan headless (jsdom + fake-indexeddb + dexie) **di luar project** (tidak mengubah config project):

| Step | Hasil |
|---|---|
| Inisialisasi DB + seeds | ✅ PASS (34 tabel, 95 seed) |
| Login owner + login password salah ditolak | ✅ PASS |
| Session save/get/clear | ✅ PAS (harness-side signature issue sudah tidak relevan — kembali PASS setelah argumen benar) |
| Soft delete produk | ✅ PASS (getByIdStillReturns=true — konfirmasi gap) |
| Export backup | ❌ **FAIL** (bug `tables` collision) — **di-reproduksi** |
| Validate + restore | ❌ **FAIL** (bug `tables` collision) — **di-reproduksi** |
| Server http-server | ✅ PASS (index.html/manifest/SW 200) |

**Catatan runtime:** browser full (UI render, offline toggle, import Excel via file) **tidak dieksekusi** — tidak tersedia browser automation. Dinyatakan **NOT EXECUTED** untuk bagian UI tingkat browser (lihat Phase 26). Runtime ini adalah bukti nyata untuk temuan kritis backup/restore.

---

## 26. BROWSER TEST (Phase 26)

- Browser automation **TIDAK tersedia** di lingkungan ini (tidak ada Playwright/Puppeteer, dependency tidak diinstal, dan tidak diizinkan mengubah config/instal).
- Semua skenario (fresh browser, incognito, expired session, offline toggle, mobile viewport) = **NOT EXECUTED**.
- Tidak ada klaim PASS untuk pengujian browser.
- Yang terverifikasi hanya layer non-UI (Phase 25) + static inspection.

---

## 27. PERFORMANCE BASELINE (Phase 27)

**Sebagian dapat diukur; sebagian UNKNOWN.**

| Metrik | Nilai | Metode |
|---|---|---|
| Startup (DB init + seed) | cepat (< detik, 95 row) — terukur | smoke harness |
| Product list / search / sort | **in-memory full-scan** (`toArray()` + filter) — O(n) per query, tanpa Dexie indexing | static analysis |
| Pagination | dilakukan in-memory setelah full-scan | static |
| CRUD | < detik pada dataset kecil | smoke |
| Import/Export | bergantung CDN XLSX (beberapa detik pada file besar); degradation jelas | static |
| Memory/Storage | **UNKNOWN** — tidak ada monitoring; storage usage adalah "—" di UI database-page | — |
| Skala besar (50k transaksi) | **UNKNOWN / berisiko** — tidak ada benchmark, pagination limit pageSize tidak di-cap | — |

**Phase 27 verdict: PARTIAL → UNKNOWN untuk skala produksi.**

---

## 28. BASELINE SCORE (Phase 28)

Skala: 0=Critical, 1=Poor, 2=Partial, 3=Acceptable, 4=Good, 5=Production Ready.

| Area | Skor | Justifikasi |
|---|---|---|
| Architecture | 2 | Layer modular bagus, tapi violasi layer 12+ file & dead code paralel |
| Authentication | 3 | Fungsi aman (validasi, session expiry, device); hash & lock lemah |
| Authorization | 1 | Route abaikan role; 2 model RBAC tak terhubung |
| Database | 2 | Skema 34 tabel benar & seeds jalan; migrasi & backup/restore broken |
| PWA | 3 | SW v4 + icons + offline shell jalan; precache basi & install UI kosong |
| UI | 2 | Berfungsi namun banyak hardcode/placeholder; dashboard statis |
| Modules | 1 | Inti (POS, inventory, finance, shift) belum ada |
| Testing | 0 | Tidak ada test, tidak ada runner |
| Security | 1 | SHA-256, PERMISSION BYPASS, PIN plaintext, xlsx CVE, audit tak ada |
| Performance | 2 | Kecil OK; skala besar UNKNOWN, in-memory scan |
| Documentation | 3 | Lengkap & jujur; namun 27_MAINTENANCE adalah template; README basi |
| Deployment | 3 | Dev server jalan; produksi belum disiapkan |
| **Overall** | **1.9 / 5** | **RED** |

---

## 29. CRITICAL FINDINGS (Phase 29)

### P0 — Critical

| ID | File | Line | Problem | Impact | Risk | Rec |
|---|---|---|---|---|---|---|
| F-01 | src/database/backup.js | 17 | Tabel `tables` bertabrakan dengan `db.tables` (array Dexie) → `db['tables'].toArray` gagal | **Backup TIDAK PERNAH berhasil**; pelanggan tak bisa mencadangkan data | Total data loss saat restore dibutuhkan | Akses `db.table(name)` bukan `db[name]`, atau hapus tabel `tables` dari TABLES iterasi backup |
| F-02 | src/database/restore.js | 75 | `db['tables'].clear()` gagal (sama F-01) cuando `tables` di-loop | **Restore TIDAK PERNAH berhasil**; pemulihan mustahil | Total data loss | Perbaiki akses tabel; tambah test backup/restore sebelum rilis |
| F-03 | src/router/router.js:110-125 | — | Route hanya cek login; TIDAK cek role | Kasir/role bisa buka `#/pengaturan`, `#/laporan` via URL | Akses tidak sah ke pengaturan & data master | Tambah `hasPermission(routeKey)` di guard; enforce di route parsing |

### P1 — High

| ID | File | Line | Problem | Impact | Rec |
|---|---|---|---|---|---|
| F-10 | src/pages/pos/pos-page.js | 12 | POS = placeholder "Coming Soon"; `sales-service` tanpa `create` | Inti aplikasi tidak ada; bukan POS | Bangun checkout: cart, payment, invoice, stock deduction |
| F-11 | src/modules/inventory/* | 1 | inventory service/repository stub; 6 tabel stok tanpa writer; stock adalah `products.stock` editable | Tidak ada manajemen stok; dashboard & laporan stock berbasis data yang tak terkontrol | Implementasi inventory service + movement + adjustment (Phase 6) |
| F-12 | src/auth/session / idle-service | 25-27 | `isScreenLocked()` hardcoded `false`; idle → logout (bukan lock) | Fitur lock screen mati; harapan UX hilang | Wire idle→lock→unlock; gunakan `lockTimeout` |
| F-13 | src/services/*, src/auth/*, src/pages/settings/* | banyak | Akses DB langsung melewati Repository (layer violasi) | Sulit maintenance/uji; arsitektur melanggar ADR-004/005 | Refactor ke repository; per tegas gating AI |
| F-14 | src/database/migrations.js | 1 | Migrasi stub; tidak ada `.upgrade()`; v1 tak pernah dideklar | Upgrade schema masa depan akan corrupt data | Tambah `.upgrade()` + registry versi sebelum skema v3 (recipe) |
| F-15 | service-worker.js | 9-67 | Precache 57 file berbasis arsitektur lama; halaman/modul baru tidak di-precache | Offline pertama ke route baru gagal | Regenerate APP_ASSETS dari grafik import aktual |
| F-16 | tests/* + package.json | — | 0 test, tidak ada runner & script `test` | Perubahan berisiko tak teruji; regressi tak terdeteksi | Setup runner (vitest direkomendasikan docs/20) + unit test inti |
| F-17 | src/utils/hash-utils.js:1 dst | — | SHA-256 tanpa salt utk password & PIN plaintext (user-service) | Aplikasi offline: hash langsung terserang | Migrasi PBKDF2+salt; enkripsi PIN |
| F-18 | xlsx 0.18.5 | — | CVE-2023-30533/2024-22363 pada import file | Prototype pollution/ReDoS dari spreadsheet user | Pin ke versi patched (bila tersedia) atau sanitasi & sandbox parse |
| F-19 | src/modules/purchase/purchase-service.js:80 | — | Transisi `received → cancelled` diizinkan (kontradiksi business rule) | Stok/Akuntansi aneh (PO diterima lalu dibatalkan) | Hapus transisi; patuhi 17 §6.2 |
| F-20 | src/repositories/base-repository.js:68-75 | — | `getById` tidak filter `deletedAt` | Sof-deleted record tetap terlihat/diproses | Filter `!deletedAt` default |

### P2 — Medium

| ID | Temuan | Rec |
|---|---|---|
| F-30 | `getNextPONumber` (purchase-repository:71-81) & `getNextCode` (supplier:54-64) lexicographic-max → potensi nomor duplikat | Sorting numerik; gunakan count/auto-inc |
| F-31 | PO header+items dua write tanpa transaction | Bungkus `db.transaction('rw',...)` |
| F-32 | Import Excel: hasil per-baris dibuang di UI (products-page:55) | Tampilkan errors |
| F-33 | Barcode tidak unik; index non-unique | Tambah unique index & validasi |
| F-34 | Dua router (routes.js dead) + dua dashboard/login/layout | Hapus dead code; satu sumber kebenaran |
| F-35 | Chart.js dimuat tak pernah dipakai | Hapus dari index/SW/CDN |
| F-36 | Versi CDN ≠ package.json (5 lib) | Sinkronkan atau kelola via single source |
| F-37 | `database-page.js:81` "Kompresi" = `db.delete()` | Perbaiki label/logika |
| F-38 | Session keys duplikat; `logoutTime` tak pernah dapat dibaca | Bersihkan bookkeeping |
| F-39 | Tidak ada SRI pada CDN; no defer | Tambah integrity + defer |
| F-40 | `#/pos`, `#/inventory`, `#/categories` 404 | Daftarkan route |
| F-41 | `getSalesSummary` menghitung refunded ke revenue, revenue termasuk unpaid | Klarifikasi & perbaiki agregasi |
| F-42 | PageSize tidak di-cap → query besar | Terapkan batas 100 (kontrak §8.4) |
| F-43 | `data-name="${s.name}"` tanpa escape di purchases-page:242 | Escape atau pakai dataset/capital dom-utils |

### P3 — Low

| ID | Temuan |
|---|---|
| F-50 | `product-validator.js` dead code; `AppTable.updateData` dead API; `purchaseRepository.deleteItems` tak pernah dipanggil |
| F-51 | favicon.ico corrupt 0-byte (dead), assets folder empty |
| F-52 | console.* banyak (P2 gabung dengan F-39 area) |
| F-53 | README basi (docs 01-13, roadmap versi beda) |
| F-54 | `isScreenLocked` etc. config `lockTimeout` unused |
| F-55 | Inline onclick handlers (5) — module dapat di-semprot |
| F-56 | `hasOwnerAccount()` exclude legacy ids (edge case) |

---

## 30. RELEASE BLOCKERS (Phase 30)

### Critical Blocker (Harus di atas sebelum Sprint 3.2 / v1.0)

| # | Blocker | Referensi |
|---|---|---|
| B-01 | **Backup broken** (F-01) | backup.js:17 |
| B-02 | **Restore broken** (F-02) | restore.js:75 |
| B-03 | **POS checkout tidak ada** (F-10) | pos-page/sales-service |
| B-04 | **Permission enforcement di route tidak ada** (F-03 + Phase 6) | router/guards |
| B-05 | **0 test & tidak ada runner** (F-16) | tests/, package.json |
| B-06 | **Bukan git repository** — tidak ada histori/rollback | `.git/` tidak ada |

### High Risk (harus dikelola di Sprint yang sama)

| # | Blocker |
|---|---|
| B-11 | Precache SW basi (offline pertama ke route baru) |
| B-12 | Migrasi DB tak ada (risiko upgrade schema) |
| B-13 | Layer violasi DB langsung (12+ file) |
| B-14 | Inventory/finance/shift belum ada (dependensi laporan & stok) |
| B-15 | Hashing + PIN plaintext |

### Medium Risk

| # | Blocker |
|---|---|
| B-21 | Nama role keyed (rename → otorisasi memutus) |
| B-22 | PO number / supplier code collision |
| B-23 | Dua router/dead code (maintenace debt) |
| B-24 | versi CDN vs package mismatch |

### Low Risk

| # | Blocker |
|---|---|
| B-31 | UI hardcoded color/inline style (melawan standar) |
| B-32 | README & sebagian docs usang |

---

## 31. DOCUMENTATION VS CODE GAP (Phase 31)

| Document | Claim | Actual Implementation | Status | Gap | Priority |
|---|---|---|---|---|---|
| docs/02 & 23 | 34 tabel skema | 34 tabel match (byte-for-byte) | ✅ MATCH | — | — |
| docs/23 §3.18 "inventories = stok terkini" | inventori dipakai | tabel orphan; stok di products | ❌ | stok dual source | P1 |
| docs/23 §6 migrasi | migration v1→v2 | tidak ada upgrade | ❌ | migrasi absent | P1 |
| docs/23 §7.5 service tidak sentuh db | — | 12+ file akses db | ❌ | layer violasi | P1 |
| docs/24 AI rules | layer/logger/test/no-hardcode | sebagian besar dilanggar | ❌ | substance | P1 |
| docs/20 testing 9 level | tersedia | 0 test, runner tidak ada | ❌ | MISSING | P0 |
| docs/22 standar PBKDF2 (ADR-027) | PBKDF2+salt | SHA-256 no salt | ❌ | hashing | P1 |
| docs/26 roadmap v1.0 | POS dll | POS belum ada | ❌ | feature gap | P0 |
| docs/27 maintenance | panduan maintenance | file = template tugas | ❌ | dokumen belum ditulis | P1 |
| docs/07 roadmap | status fase | banyak fase "Belum Dimulai" padahal beberapa selesai (purchase dll); beberapa belum dimulai benar | ⚠️ | status usang | P2 |
| README | docs 01–13 | ada 27 | ❌ | usang | P3 |
| docs/17 vs 18 | PO number/status/session/hash len | saling kontradiktif internal | ❌ | docs internal conflict | P2 |

---

## 32. FEATURE MATURITY MATRIX (Phase 32)

Legenda: ✅ ada · ⚠️ sebagian · ❌ tidak ada · N/A tidak relevan

| Feature | Code | UI | Database | Business Rule | Permission | Testing | Documentation | **Overall** |
|---|---|---|---|---|---|---|---|---|
| Login/Logout | ✅ | ✅ | ✅ | ⚠️ (hash) | ✅ | ❌ | ✅ | ⚠️ PARTIAL |
| Session/RememberMe | ✅ | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ PARTIAL |
| RBAC (menu-level) | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ route | ❌ | ✅ | ⚠️ PARTIAL |
| User/Role/Permission CRUD | ✅ | ✅ | ✅ | ⚠️ | ❌ enforce | ❌ | ✅ | ⚠️ PARTIAL |
| Dashboard | ⚠️ statis | ⚠️ | ✅(data) | ❌ live | ✅ | ❌ | ✅ | ❌ BROKEN-ish (placeholder) |
| Produk CRUD | ✅ | ✅ | ✅ | ⚠️ barcode | ✅ | ❌ | ✅ | ✅ (caveat) |
| Kategori/Satuan CRUD | ❌ | ❌ | ✅ schema | ⚠️ | ❌ | ❌ | ⚠️ docs | ❌ MISSING |
| Supplier CRUD | ✅ | ✅ | ✅ | ⚠️ dup phone | ✅ | ❌ | ✅ | ✅ |
| Customer CRUD | ✅ | ✅ | ✅ | ⚠️ dup phone | ✅ | ❌ | ✅ | ✅ |
| Purchase (PO/workflow) | ✅ | ✅ | ✅ | ❌ rule cancel | ✅ | ❌ | ✅ | ⚠️ PARTIAL |
| Sales (history) | ✅ (read) | ✅ | ✅ (seed) | ❌ | ✅ | ❌ | ✅ | ⚠️ PARTIAL |
| POS checkout | ❌ | ❌ | ⚠️ schema | ❌ | ❌ | ❌ | ❌ | **❌ MISSING** |
| Payment | ❌ | ❌ | ⚠️ (payments table) | ❌ | ❌ | ❌ | ❌ | **❌ MISSING** |
| Inventory | ❌ | ❌ | ⚠️ 6 tables | ❌ | ❌ | ❌ | ⚠️ docs | **❌ MISSING** |
| Finance/Shift | ❌ | ❌ | ⚠️ tables | ❌ | ❌ | ❌ | ⚠️ | **❌ MISSING** |
| Reports | ⚠️ 4 | ✅ | ✅ | ⚠️ aggregation | ✅ | ❌ | ✅ | ⚠️ PARTIAL |
| Audit Log | ❌ writer | ✅ view | ⚠️ table | ❌ | ✅ | ❌ | ✅ | **❌ MISSING (writer)** |
| Backup/Restore | ⚠️ infra | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | **❌ BROKEN runtime** |
| PWA/Offline | ✅ | ⚠️ | N/A | N/A | N/A | ❌ | ✅ | ⚠️ PARTIAL (precache) |
| Import/Export Excel | ✅ produk | ✅ | N/A | ⚠️ | ⚠️ | ❌ | ✅ | ⚠️ PARTIAL |
| Settings | ✅ 7 tab | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ |
| Theme dark/light | ✅ | ✅ | N/A | N/A | N/A | ❌ | ✅ | ✅ |

---

## 33. FINAL BASELINE (Phase 33)

| Kriteria | Kondisi | Hasil |
|---|---|---|
| Tidak ada blocker critical | backup/restore broken, POS absent, no tests, no git | ❌ TIDAK terpenuhi |
| Issue yang belum critical | — | — |
| **Kesimpulan** | Ada critical issue yang menghalangi pengembangan & rilis | **RED** |

> **Overall Status: RED.**

---

## 34. RECOMMENDATION (Phase 34)

Urutan prioritas (rekomendasi saja — tidak dieksekusi):

1. **Critical Fix (sebelum Sprint 3.2)**
   - Perbaiki backup/restore (gunakan `db.table(name)`; hitung iterasi `tables`).
   - Tambah test backup/restore (baru setelah runner).
   - Perbaiki route permission (enforce `hasPermission` di guard/router).
   - Buat git repo + commit baseline pertama (histori & rollback).

2. **Security Fix**
   - Migrasi hashing ke PBKDF2+salt; enkripsi PIN.
   - Enforce RBAC di route (block grant-by-URL).
   - Update/xabcd xlsx (CVE), SRI di CDN, escape attribute injection.
   - Implementasi audit writer.

3. **Architecture Fix**
   - Satukan router (hapus `routes.js`/`navigation-manager.js` dead; hapus dashboard/login/layout duplikat).
   - Tegakkan layer: refactor direct-db ke repository (user/role/permission/auth/settings pages).
   - Hapus dead code (app-layout, components/layout, unused components), satu source of truth.

4. **Database Fix**
   - Tata `.upgrade()` + registry migrasi; deklarasikan v1 baseline.
   - Bungkus write header+items dalam transaction; perbaiki `getById` deletedAt; hapus transisi `received→cancelled`.

5. **Runtime Fix**
   - Renegenerate APP_ASSETS dari grafik import; sinkronkan `pwa-config.js` & SW; cap pageSize; perbaiki warna/`!important`.

6. **Testing**
   - Setup Vitest (per docs/20); unit test: auth, session, validator, service inti; integration: sales, inventory, product; regression suite; tambah skenario manual backup/restore.

7. **UX**
   - Dashboard data-driven; halaman kategori/satuan; halaman POS (P0); feedback import hasil; tombol install PWA.

8. **Performance**
   - Gunakan Dexie index di search (bukan `toArray()` penuh); pagination cap; monitor storage.

9. **Documentation**
   - Tulis `27_MAINTENANCE_GUIDE.md` (konten riil); update README & 07 status; sinkronkan versi CDN↔package; catat kontradiksi 17 vs 18.

---

## 35. NEXT SPRINT READINESS (Phase 35)

**Apakah project siap masuk Sprint 3.2?**

## **CONDITIONAL**

Tidak **YES** karena: (1) backup/restore broken (P0), (2) tidak ada test runner & 0 test, (3) bukan git repo, (4) permission bypass di route, (5) inti POS belum ada.

Tidak **NO** karena fondasi struktural (ESM, modular, schema 34 tabel & seeds bekerja, auth/session teruji, server dev berjalan) cukup untuk memulai pekerjaan front-end tunggal yang ter-definisi.

**Syarat agar Sprint 3.2 dapat dimulai:**

| # | Syarat |
|---|---|
| S-1 | Fix backup/restore (F-01/F-02) — data safety dulu. |
| S-2 | Scope Sprint 3.2 dibatasi eksplisit pada **satu deliverable** (paling logis: **POS checkout** atau **inventory**), TANPA membangun infra test/versi/arsitektur di sprint yang sama. |
| S-3 | Buat git repo + commit baseline (rollback-trace). |
| S-4 | Enforce route permission minimal (block Kasir → pengaturan) sebagai hot-fix pendek. |
| S-5 | Sepakati "definition of done" ringan per task (verify manual checklist, log di CHANGELOG). |

Jika syarat S-1–S-5 dipenuhi → **CAN START**. Jika S-1/S-2 tidak dipenuhi → **NO**.

---

## Recommended Fix Order (ringkas)

```
1. Backup/Restore fix  [P0]
2. Route RBAC enforce  [P0/P1]
3. Git init + baseline commit
4. Test runner + unit test inti (auth/session/product)
5. POS checkout (satuan sprint 3.2, dengan scope ketat)
6. Inventory service (movement/adjustment/opname) + wire ke purchase/sales
7. Hashing PBKDF2 + PIN encrypt  [P1]
8. Precache SW regenerate + route pos/inventory/categories
9. Migration/upgrade handler
10. Bersihkan dead code + layer refactor
```

---

## Sprint Readiness—Final

> **Overall Status: RED · Overall Score: 1.9/5 · Sprint 3.2: CONDITIONAL (lihat Phase 35).**
> Blocker critical: backup/restore broken, POS absent, no tests, no git, permission bypass di route.
> Foundation yang bisa diandalkan: schema 34 tabel + seeds (300 jeti), auth/session (teruji), produk/purchase/supplier/customer CRUD, PWA shell, settings.

---

*Laporan disusun dari audit source code, runtime smoke test (headless), dan static analysis. Tidak ada file project yang dimodifikasi. Status yang diberi "NOT EXECUTED" berarti tidak dapat diverifikasi di lingkungan audit ini. Beberapa baris dikaburkan untuk kejujuran; semua temuan punya referensi file:line.*