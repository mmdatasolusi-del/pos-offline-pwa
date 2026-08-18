# 11_AI_CONTEXT.md

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Ringkasan Proyek](#2-ringkasan-proyek)
3. [Teknologi](#3-teknologi)
4. [Filosofi Pengembangan](#4-filosofi-pengembangan)
5. [Ringkasan Arsitektur](#5-ringkasan-arsitektur)
6. [Ringkasan Struktur Folder](#6-ringkasan-struktur-folder)
7. [Ringkasan Modul](#7-ringkasan-modul)
8. [Ringkasan Database](#8-ringkasan-database)
9. [Ringkasan Business Rules](#9-ringkasan-business-rules)
10. [Ringkasan UI](#10-ringkasan-ui)
11. [Ringkasan Component](#11-ringkasan-component)
12. [Ringkasan Coding Standard](#12-ringkasan-coding-standard)
13. [Ringkasan Workflow](#13-ringkasan-workflow)
14. [Aturan AI](#14-aturan-ai)
15. [Hal yang Tidak Boleh Dilakukan](#15-hal-yang-tidak-boleh-dilakukan)
16. [Checklist Sebelum Coding](#16-checklist-sebelum-coding)
17. [Checklist Setelah Coding](#17-checklist-setelah-coding)
18. [Daftar Dokumen](#18-daftar-dokumen)
19. [Cara AI Menggunakan Dokumen](#19-cara-ai-menggunakan-dokumen)
20. [Konteks Pengembangan](#20-konteks-pengembangan)
21. [Future Context](#21-future-context)
22. [Executive Summary (One-Pager)](#22-executive-summary-one-pager)

---

## 1. Executive Summary

Dokumen ini adalah **ringkasan resmi proyek POS Offline PWA** yang dirancang khusus untuk AI Coding Assistant. Baca dokumen ini **pertama kali** sebelum membaca dokumen lain. Dokumen ini tidak menggantikan dokumen 01–10 — ia adalah pintu masuk yang memberikan konteks cepat agar AI tidak tersesat.

---

## 2. Ringkasan Proyek

| Atribut | Nilai |
|---|---|
| **Nama Proyek** | POS Offline PWA |
| **Tujuan** | Aplikasi Point of Sale 100% offline untuk UMKM yang berjalan di browser tanpa server backend |
| **Jenis Aplikasi** | Progressive Web App (PWA) — installable, offline-first |
| **Target Pengguna** | Kasir, pemilik toko, staff cafe/restoran, UMKM (toko, warung, laundry, salon, bengkel, apotek) |
| **Target Perangkat** | Tablet 10" landscape (utama), desktop, smartphone Android |
| **Prinsip Utama** | Offline First, Mobile First, Modular, Reusable Component, Clean Architecture, No Backend |
| **Nilai Bisnis** | Biaya nol langganan, privasi data lokal, operasional tanpa internet, install seperti native |

---

## 3. Teknologi

| Teknologi | Fungsi | Alasan |
|---|---|---|
| **HTML5 + CSS3** | Struktur semantik, styling | Standar web, tanpa build step |
| **Bootstrap 5** | Grid, komponen UI, responsive utility | Framework CSS ringan, ekosistem luas, familiar |
| **Vanilla JavaScript ES2023** | Semua logika aplikasi | Tidak ada framework SPA — menghindari build step dan bundle besar |
| **IndexedDB** | Database browser persisten | Satu-satunya database client-side yang reliable untuk data besar |
| **Dexie.js** | Wrapper IndexedDB | Schema migration, query indexing, transaction, promise-based |
| **Chart.js** | Grafik & dashboard | Ringan (60KB), animasi, responsive |
| **SheetJS (xlsx)** | Export/import Excel | Satu-satunya library Excel client-side yang matang |
| **jsPDF** | Generate PDF (struk, laporan) | Standar de facto untuk PDF client-side |
| **html5-qrcode** | Scan QR code | Library QR scanner kamera tanpa dependency |
| **QuaggaJS** | Scan barcode 1D (EAN, UPC) | Real-time barcode decoding dari kamera |
| **Bootstrap Icons** | Icon set | Gratis, SVG inline, match dengan Bootstrap |
| **Service Worker** | Cache asset, offline fallback | Wajib PWA — cache strategi Cache First untuk assets |
| **Web App Manifest** | Install prompt, icons, theme | Wajib PWA — metadata install |

---

## 4. Filosofi Pengembangan

| Filosofi | Inti |
|---|---|
| **Offline First** | Semua operasi inti berfungsi tanpa internet. Tidak ada fetch API wajib |
| **Documentation Driven Development** | Dokumen adalah kebenaran tertinggi. Kode mengikuti dokumen, bukan sebaliknya |
| **Reusable Component** | UI dan logic dapat dipakai ulang. Komponen generik: modal, table, form, scanner |
| **Modular** | Fitur terpisah dalam modul independen. Satu modul = satu domain bisnis |
| **Scalable** | Struktur mendukung pertumbuhan 10 file menjadi 500+ tanpa reorganisasi |
| **Maintainable** | Mudah dibaca dan diubah. Konvensi konsisten, dokumentasi JSDoc |
| **Clean Code** | Nama variabel/function mengungkapkan niat. Satu fungsi = satu tanggung jawab |
| **Consistency** | Kode yang konsisten lebih mudah diprediksi. Tidak ada pengecualian |
| **MVP First** | v1.0 hanya fitur esensial POS. Fitur tambahan setelah fondasi kokoh |
| **Incremental Delivery** | Setiap fase menghasilkan aplikasi yang berfungsi dan bisa digunakan |

---

## 5. Ringkasan Arsitektur

```
Presentation (UI/Halaman)
    ↓
Application (Router, Events, State)
    ↓
Business (Services — validasi, aturan bisnis)
    ↓
Repository (Akses data — abstraksi IndexedDB)
    ↓
Database (Dexie.js schema, migrations)
    ↓
IndexedDB (Penyimpanan browser)
```

**Aturan ketat:**
- UI **tidak boleh** langsung mengakses IndexedDB
- Service **tidak boleh** memanipulasi DOM
- Service **tidak boleh** langsung mengakses database — harus melalui Repository
- Repository hanya boleh dipanggil oleh Service layer
- Presentation layer hanya berkomunikasi dengan Application dan Service

---

## 6. Ringkasan Struktur Folder

| Folder | Isi |
|---|---|
| `docs/` | 11 dokumen proyek (01–11) |
| `src/` | Semua kode sumber aplikasi |
| `src/components/` | 70+ komponen UI reusable (11 subkategori) |
| `src/modules/` | Modul fitur bisnis (2–7 file per modul) |
| `src/pages/` | 13+ halaman dengan route |
| `src/database/` | Dexie schema, migrations, seeds, backup |
| `src/services/` | Business logic layer |
| `src/repositories/` | Data access layer (abstraksi IndexedDB) |
| `src/utils/` | Fungsi umum (format currency, date, number) |
| `src/config/` | Konfigurasi aplikasi |
| `src/styles/` | CSS custom, Bootstrap overrides |
| `src/workers/` | Service Worker |
| `src/pwa/` | manifest.json, icons |
| `tests/` | Unit & integration tests |
| `backups/` | Backup data JSON |
| `public/` | index.html, favicon, static assets |

---

## 7. Ringkasan Modul

| Modul | Status | Versi Target | Entitas |
|---|---|---|---|
| **Core** (Auth, User, Role, Permission, Setting) | Phase 2 | v0.1 | user, role, permission, setting |
| **Dashboard** | Phase 4 | v0.3 | — (aggregasi) |
| **Master Data** (Product, Category, Unit, Supplier, Customer) | Phase 3 | v0.2 | product, category, unit, supplier, customer |
| **Sales** (POS, Payment, Discount, Voucher, Tax) | Phase 5 | v0.4 | sale, saleItem, payment, discount, tax, voucher |
| **Inventory** (Stock, Movement, Adjustment, Opname) | Phase 6 | v0.5 | inventory, stockMovement, stockAdjustment, stockOpname, stockOpnameItem |
| **Purchase** (PO, Receive) | Phase 7 | v0.6 | purchase, purchaseItem |
| **Finance** (Cash Flow, Expense, Income, Shift) | Phase 8 | v0.7 | cashFlow, expense, income, shift |
| **Report** (Sales, Stock, Finance, Pajak) | Phase 9 | v0.8 | — (aggregasi) |
| **Cafe** (Table, Kitchen, Reservation) | Phase 11 | v2.0 | table, kitchenOrder, reservation |
| **Membership** (Member, Loyalty Point) | Phase 12 | v2.5 | membership, loyaltyPoint |
| **Backup & Restore** | Phase 2 | v0.1 | backupMetadata |

**Total**: 34 entitas database, 88 fitur, 168 business rules, 70+ komponen UI.

---

## 8. Ringkasan Database

| Aspek | Aturan |
|---|---|
| **Engine** | IndexedDB (browser-native, 100% lokal) |
| **Wrapper** | Dexie.js — schema, query, migration, transaction |
| **Database** | Tunggal: `PosOfflineDB` |
| **Primary Key** | UUID v4 (string) — memungkinkan ID unik offline tanpa konflik |
| **Currency** | Number integer dalam satuan Rupiah utuh |
| **Timestamp** | String ISO 8601 — portabel antar format |
| **Status** | String enum (PAID, PENDING, VOID, dll) |
| **Snapshot** | Field snapshot untuk data transaksional (productName, unitPrice) |
| **Akses** | WAJIB melalui Repository layer. Business logic TIDAK boleh langsung akses IndexedDB |
| **Soft Delete** | `deletedAt` timestamp untuk: user, product, customer, supplier |
| **Hard Delete** | Tidak ada. Data immutabel: Sale, SaleItem, Payment, PurchaseItem, StockMovement, LoyaltyPoint, CashFlow, AuditLog |
| **Audit** | Semua perubahan data critical tercatat di AuditLog |

---

## 9. Ringkasan Business Rules

| Area | Poin Penting |
|---|---|
| **User** | Min 6 karakter password. Username immutable. Soft delete. Maks 5 gagal login -> lock 30 menit. RBAC ketat |
| **Product** | SKU unik & immutable. Snapshot nama + harga di SaleItem. Service type tidak punya stok |
| **Sales (POS)** | Stok berkurang SAAT transaksi PAID. Void mengembalikan stok. Refund tercatat. Invoice number auto INV-YYYYMMDD-XXXX. Diskon per-item & per-transaksi |
| **Payment** | Cash = hitung kembalian. QRIS tampilkan QR. Partial payment = PARTIAL. Tidak boleh > grand total (kecuali cash) |
| **Stok** | Setiap perubahan stok wajib tercatat di StockMovement. Stok negatif dilarang (kecuali setting). Adjustment wajib alasan |
| **Shift** | Buka shift = input openingBalance. Tutup = hitung expected vs actual. Transaksi WAJIB shiftId. 1 shift aktif per user |
| **Backup** | Otomatis tiap 6 jam. JSON + SHA-256 checksum. Restore wajib konfirmasi + auto-backup sebelumnya |
| **Keamanan** | Password di-hash SHA-256. Session 24 jam idle timeout. Auto-lock 5 menit. Audit trail immutabel |

> **Total**: 168 aturan bisnis di `03_BUSINESS_RULES.md`.

---

## 10. Ringkasan UI

| Aspek | Spesifikasi |
|---|---|
| **Framework** | Bootstrap 5 (grid, komponen, utilities) |
| **Target** | Tablet 10" landscape (POS), responsive ke desktop & mobile |
| **Mode** | Light mode (default), Dark mode (v2.0) |
| **Touch** | Semua elemen interaktif min 44x44px |
| **Font** | Inter (sans), JetBrains Mono (monospace) |
| **Icons** | Bootstrap Icons (SVG inline) |
| **Color** | Blue primary, Green success, Yellow warning, Red danger |
| **Spacing** | 4px base scale (p-1 = 4px hingga p-8 = 32px) |
| **Layout** | App Shell: sidebar (desktop) / bottom nav (mobile) + content area |
| **POS Layout** | Full height: produk (left) + cart (right) di tablet |

---

## 11. Ringkasan Component

| Prinsip | Makna |
|---|---|
| **Reusable** | Setiap komponen harus dapat digunakan di >1 tempat |
| **Composable** | Komponen kecil digabung membentuk komponen besar |
| **Consistent** | Semua state (hover, active, disabled, focus) konsisten |
| **Accessible** | WCAG 2.1 AA — keyboard nav, screen reader, kontras warna |
| **Touch Friendly** | Min 44x44px target sentuh |
| **State Coverage** | 10 states: default, hover, active, disabled, focus, loading, empty, error, success, readonly |

**Kategori**: Layout (8), Navigation (7), Form (13), Button (10), Data Display (9), Feedback (8), Overlay (5), POS (15), Cafe (6), Dashboard (8), Setting (5) — total **70+ komponen**.

---

## 12. Ringkasan Coding Standard

| Aturan | Spesifikasi |
|---|---|
| **Variable** | `const` > `let`. Tidak ada `var` |
| **Naming** | `camelCase` (variabel, fungsi), `PascalCase` (class, komponen), `UPPER_SNAKE_CASE` (konstanta, enum), `kebab-case` (CSS class, file HTML) |
| **File naming** | `kebab-case.js` (service, repository, util), `PascalCase.js` (component class) |
| **Inline style** | Dilarang keras. Gunakan CSS class |
| **Inline event** | Dilarang keras. Gunakan `addEventListener` |
| **DOM manipulation** | Hanya di Presentation layer. Service tidak boleh menyentuh DOM |
| **Error handling** | Custom error classes (`ValidationError`, `BusinessError`, `DatabaseError`) |
| **Logging** | Format: `[LEVEL] [MODUL] Pesan — context` |
| **Validasi** | 3 layer: UI (frontend), Service (business), Database (constraint) |
| **Performance** | Batch IndexedDB write. Debounce search. Pagination default 25. Lazy load images |
| **Keamanan** | RBAC di service layer. Input sanitization. Tidak ada eval. Content Security Policy |

---

## 13. Ringkasan Workflow

```
1. Analisis  →  Baca dokumen relevan, pahami konteks
2. Rencana   →  Tentukan file yang akan diubah/dibuat
3. Implementasi  →  Tulis kode sesuai standar
4. Testing   →  Verifikasi fungsional, cek border cases
5. Review    →  Self-review, cek checklist
6. Update Dokumentasi  →  Jika ada perubahan signifikan
```

---

## 14. Aturan AI

1. **WAJIB** membaca dokumen yang relevan sebelum bekerja
2. **WAJIB** mengikuti seluruh Coding Standard (`09_CODING_STANDARD.md`)
3. **WAJIB** mengikuti Business Rules (`03_BUSINESS_RULES.md`)
4. **WAJIB** mengikuti UI Design System (`04_UI_DESIGN_SYSTEM.md`)
5. **WAJIB** menggunakan komponen dari Component Library (`05_COMPONENT_LIBRARY.md`)
6. **WAJIB** mengikuti struktur proyek (`10_PROJECT_STRUCTURE.md`)
7. **TIDAK BOLEH** membuat asumsi tanpa penjelasan
8. **TIDAK BOLEH** mengubah arsitektur tanpa izin
9. **TIDAK BOLEH** menulis kode yang bertentangan dengan dokumen
10. **WAJIB** menggunakan `const` dan `let`, bukan `var`

---

## 15. Hal yang Tidak Boleh Dilakukan

1. **Mengakses database langsung dari UI** — WAJIB melalui Repository + Service
2. **Mengubah struktur folder** — WAJIB sesuai `10_PROJECT_STRUCTURE.md`
3. **Membuat kode duplikat** — Cek komponen/service yang sudah ada
4. **Menghapus file tanpa konfirmasi** — Tanya dulu
5. **Mengubah Business Rules tanpa dokumentasi** — Update `03_BUSINESS_RULES.md` dulu
6. **Inline CSS atau inline JavaScript** — Dilarang keras
7. **Menyimpan data bisnis di localStorage** — Hanya IndexedDB
8. **Memanggil API eksternal untuk operasi inti** — 100% offline
9. **Menambahkan framework SPA** — React, Vue, Angular, jQuery dilarang
10. **Menyimpan state bisnis di global variable**

---

## 16. Checklist Sebelum Coding

- [ ] Blueprint (`01_PROJECT_BLUEPRINT.md`) — arsitektur, stack, prinsip sesuai?
- [ ] Database (`02_DATABASE_SCHEMA.md`) — entitas, field, relasi sesuai?
- [ ] Business Rules (`03_BUSINESS_RULES.md`) — aturan bisnis diikuti?
- [ ] UI Design (`04_UI_DESIGN_SYSTEM.md`) — token, layout, template sesuai?
- [ ] Component (`05_COMPONENT_LIBRARY.md`) — komponen yang akan digunakan?
- [ ] Coding Standard (`09_CODING_STANDARD.md`) — penamaan, struktur, pola sesuai?
- [ ] Project Structure (`10_PROJECT_STRUCTURE.md`) — folder, file, import sesuai?
- [ ] Feature List (`06_FEATURE_LIST.md`) — prioritas, dependensi sesuai?

---

## 17. Checklist Setelah Coding

- [ ] Tidak ada error sintaks/logika
- [ ] Responsive di tablet 10" dan desktop
- [ ] Mudah dipelihara — nama jelas, kode bersih
- [ ] Dokumentasi diperbarui jika ada perubahan signifikan
- [ ] Konsisten dengan seluruh dokumen proyek
- [ ] Tidak ada inline style/inline event
- [ ] Semua state component tercover (loading, empty, error)
- [ ] Data tetap konsisten (soft delete, audit, snapshot)

---

## 18. Daftar Dokumen

| Dokumen | Fungsi | Dibaca Sebelum |
|---|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, stack, prinsip, roadmap | Tugas apa pun |
| `02_DATABASE_SCHEMA.md` | 34 entitas, field, relasi, integritas | Buat/ubah data |
| `03_BUSINESS_RULES.md` | 168 aturan bisnis — logika aplikasi | Semua implementasi |
| `04_UI_DESIGN_SYSTEM.md` | Token desain — warna, font, spacing, layout | Semua UI |
| `05_COMPONENT_LIBRARY.md` | 70+ komponen UI — spesifikasi, state, komposisi | Buat UI baru |
| `06_FEATURE_LIST.md` | 88 fitur — prioritas, dependensi, role, status | Tentukan prioritas |
| `07_ROADMAP.md` | 13 fase, 8 versi, timeline, risiko | Perencanaan |
| `08_AI_PROMPT_GUIDE.md` | Workflow AI, prompt templates, checklist | Sebelum coding |
| `09_CODING_STANDARD.md` | Penamaan, struktur file, JS rules, anti pattern | Saat coding |
| `10_PROJECT_STRUCTURE.md` | Folder tree, modul, dependency rule | Buat file baru |
| `11_AI_CONTEXT.md` | **(dokumen ini)** Ringkasan proyek untuk AI | **Pertama kali** |

---

## 19. Cara AI Menggunakan Dokumen

### Membuat halaman/modul baru

```
1. Baca 01 (arsitektur & prinsip)
2. Baca 03 (business rules domain terkait)
3. Baca 04 (template halaman)
4. Baca 05 (komponen yang tersedia)
5. Baca 09 (coding standard)
6. Baca 10 (folder, import rule)
7. Implementasi
```

### Memperbaiki bug

```
1. Baca 03 (business rules — apakah ini bug atau expected?)
2. Baca 09 (coding standard — cek pola yang salah)
3. Perbaiki
4. Update 06 (status fitur jika perlu)
```

### Menambah fitur

```
1. Baca 06 (prioritas & dependensi)
2. Baca 07 (fase & timeline)
3. Baca 02 (entitas database)
4. Baca 03 (business rules)
5. Baca 05 (komponen)
6. Baca 09 + 10 (standar & struktur)
7. Implementasi
```

### Mengefaktor ulang

```
1. Baca 09 (anti pattern, refactoring guide)
2. Baca 10 (dependency rule)
3. Baca 08 (refactor prompt template)
4. Refaktor
```

---

## 20. Konteks Pengembangan

- Proyek dikembangkan **bertahap** per Phase (0–13) sesuai `07_ROADMAP.md`
- Setiap modul independen — bisa dikembangkan paralel
- Fitur masa depan (v2.0+) sudah dirancang dalam arsitektur — tidak perlu rewrite
- Dokumentasi diutamakan — semua keputusan arsitektur tercatat
- AI bekerja sebagai **asisten** — mengusulkan, manusia menyetujui
- Perubahan besar harus melalui dokumentasi dulu, baru kode
- Saat ini proyek berada di **Phase 0 selesai**, siap **Phase 1** (Project Setup)

---

## 21. Future Context

Arsitektur dan kode harus kompatibel jika proyek berkembang menjadi:

| Fitur Masa Depan | Dampak pada Arsitektur |
|---|---|
| **Multi Outlet** | `outletId` field pada tabel transaksional. Filter data per outlet |
| **Multi Warehouse** | `warehouseId` di Inventory, StockMovement. Transfer antar gudang |
| **REST API** | Service layer sudah terpisah dari UI — tinggal tambah endpoint |
| **Cloud Sync** | `lastUpdatedAt` timestamp untuk conflict resolution. Push/pull service |
| **Plugin System** | Modul sudah independen — plugin bisa register via event bus |
| **Marketplace** | Struktur data sudah mendukung ekstensi produk, kategori tambahan |

> **Prinsip**: Tulis kode seolah-olah fitur ini akan datang besok. Jangan hardcode asumsi single-outlet atau single-warehouse.

---

## 22. Executive Summary (One-Pager)

```
POS OFFLINE PWA — Ringkasan Satu Halaman
=========================================

APA INI?
  Aplikasi POS 100% offline untuk UMKM. Berjalan di browser, bisa di-install
  seperti aplikasi native. Tanpa server, tanpa biaya langganan, tanpa internet.

TEKNOLOGI:
  Vanilla JS + Bootstrap 5 + Dexie.js (IndexedDB) + Chart.js + PWA

ARSITEKTUR:
  UI → Service → Repository → Database (IndexedDB)
  Layer dipisah ketat. UI tidak boleh langsung akses database.

DATABASE:
  34 entitas (User, Role, Permission, Setting, Category, Unit, Supplier,
  Customer, Product, Sale, SaleItem, Payment, Discount, Tax, Voucher,
  Purchase, PurchaseItem, Inventory, StockMovement, StockAdjustment,
  StockOpname, StockOpnameItem, CashFlow, Expense, Income, Shift, AuditLog,
  ActivityLog, Table, KitchenOrder, Reservation, Membership, LoyaltyPoint,
  BackupMetadata). Semua di IndexedDB via Dexie.js.

FITUR:
  88 fitur, 168 business rules, 70+ komponen UI.
  v1.0: Core + Master Data + POS Sales + Inventory + Purchase + Finance + Report
  v2.0: Cafe (Table, Kitchen, Reservation)
  v2.5: Membership & Loyalty
  v3.0: Cloud Sync, AI, Multi Outlet

FASE SAAT INI:
  Phase 0 (Dokumentasi) selesai. Siap Phase 1 (Project Setup).

ATURAN UTAMA:
  - Offline First — semua fungsi tanpa internet
  - Documentation Driven — dokumen > kode
  - Modular — setiap fitur adalah modul independen
  - Reusable — komponen & service dipakai ulang
  - RBAC — role-based access control

LARANGAN:
  - Tidak ada React/Vue/Angular/jQuery
  - Tidak ada inline CSS/inline JS
  - Tidak ada akses DB langsung dari UI
  - Tidak ada penyimpanan data di localStorage
  - Tidak ada API eksternal untuk operasi inti

DOKUMENTASI:
  11 dokumen di docs/ (01–11). Baca 11_AI_CONTEXT.md dulu, baru dokumen lain.

AI WAJIB:
  Membaca dokumen relevan sebelum coding. Mengikuti standar, aturan, dan
  struktur yang sudah ditetapkan. Tidak mengubah arsitektur tanpa izin.
```

---

> **Dokumen ini adalah pintu masuk seluruh dokumentasi POS Offline PWA.**  
> Baca ini pertama, lalu baca dokumen relevan sesuai kebutuhan tugas.  
> Konsisten dengan dokumen `01_PROJECT_BLUEPRINT.md` s.d. `10_PROJECT_STRUCTURE.md`.

---

*POS Offline PWA — AI Context v1.0.0 — 15 Juli 2026*
