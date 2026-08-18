# 10_PROJECT_STRUCTURE.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Struktur Proyek](#2-filosofi-struktur-proyek)
3. [Arsitektur Aplikasi](#3-arsitektur-aplikasi)
4. [Struktur Folder — Root](#4-struktur-folder--root)
5. [Struktur Folder — src/](#5-struktur-folder--src)
6. [Struktur Modul](#6-struktur-modul)
7. [Struktur Komponen](#7-struktur-komponen)
8. [Struktur Halaman](#8-struktur-halaman)
9. [Struktur Database](#9-struktur-database)
10. [Struktur Service](#10-struktur-service)
11. [Struktur Repository](#11-struktur-repository)
12. [Struktur Utility](#12-struktur-utility)
13. [Struktur Config](#13-struktur-config)
14. [Struktur Constants](#14-struktur-constants)
15. [Struktur Styles](#15-struktur-styles)
16. [Struktur Assets](#16-struktur-assets)
17. [Struktur PWA](#17-struktur-pwa)
18. [Struktur Testing](#18-struktur-testing)
19. [Struktur Backup](#19-struktur-backup)
20. [Naming Convention](#20-naming-convention)
21. [Dependency Rule](#21-dependency-rule)
22. [Import Rule](#22-import-rule)
23. [Modul Baru](#23-modul-baru)
24. [Dokumentasi Modul](#24-dokumentasi-modul)
25. [Anti Pattern](#25-anti-pattern)
26. [Skalabilitas](#26-skalabilitas)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **standar resmi struktur proyek** untuk aplikasi POS Offline PWA. Mendefinisikan organisasi folder, pembagian modul, arsitektur layer, dan aturan penempatan file.

Setiap file yang dibuat — oleh AI maupun developer — **wajib** mengikuti struktur ini.

### 1.2 Acuan

| Dokumen | Hubungan dengan Struktur |
|---|---|
| `01_PROJECT_BLUEPRINT.md` (section 6-7) | Layer arsitektur, pohon direktori root |
| `05_COMPONENT_LIBRARY.md` | Komponen yang ditempatkan di `src/components/` |
| `06_FEATURE_LIST.md` | Modul yang diimplementasikan per fitur |
| `08_AI_PROMPT_GUIDE.md` | Workflow pembuatan file baru |
| `09_CODING_STANDARD.md` | Aturan penamaan dan struktur file |

---

## 2. Filosofi Struktur Proyek

### 2.1 Modular

Setiap fitur bisnis adalah modul mandiri yang bisa dikembangkan, diuji, dan diaktifkan/nonaktifkan secara independen.

**Implementasi**: Satu folder per modul di `src/modules/`. Modul tidak saling bergantung secara langsung.

### 2.2 Feature Based

Struktur diorganisir berdasarkan fitur bisnis, bukan jenis teknis. Semua file untuk satu fitur berada dalam satu folder.

**Implementasi**: `modules/product/` berisi page, service, repository, validator untuk product — bukan dipisah ke folder `pages/`, `services/`, `repositories/` terpisah.

### 2.3 Separation of Concerns

Setiap layer memiliki tanggung jawab yang jelas. UI tidak boleh langsung akses database. Service tidak boleh manipulasi DOM.

**Implementasi**: Layer architecture (Presentation → Application → Business → Repository → Database) dipisah secara ketat.

### 2.4 Reusable

Kode yang digunakan di banyak tempat ditempatkan di folder bersama (`components/`, `utils/`, `helpers/`), bukan di dalam modul spesifik.

**Implementasi**: AppButton, AppTable, formatCurrency, dateUtils — semua di folder global.

### 2.5 Scalable

Struktur harus mendukung pertumbuhan dari 10 file menjadi 500+ file tanpa perlu reorganisasi besar.

**Implementasi**: Folder per modul dengan struktur standar. Setiap modul maksimal 10-15 file.

### 2.6 Maintainable

Developers dan AI baru harus bisa memahami struktur dalam 5 menit. Nama folder dan file harus self-explanatory.

**Implementasi**: Nama folder = nama modul bisnis (product, sales, report). Nama file = fungsi (product-service.js, product-repository.js).

### 2.7 Offline First

Struktur mendukung operasi 100% offline: semua service dan repository berjalan di client-side tanpa backend.

**Implementasi**: Tidak ada folder `api/` atau `server/`. Semua data melalui `database/` (Dexie/IndexedDB).

### 2.8 Documentation Driven Development

Setiap folder modul memiliki `README.md` yang menjelaskan tujuan, fitur, dependensi, dan business rules.

**Implementasi**: `modules/product/README.md`

---

## 3. Arsitektur Aplikasi

### 3.1 Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Layouts  │  │  Router  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Events  │  │  Config  │  │Constants │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                     BUSINESS LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Services │  │Validator │  │  Helpers │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    REPOSITORY LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Repositori│  │  Models  │  │  Mapper  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                     DATABASE LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Schema  │  │Migration │  │  Seeds   │  │  Dexie   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PWA / SW  │  │  Assets  │  │  Styles  │  │  Tests   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Tanggung Jawab Layer

| Layer | Tanggung Jawab | Boleh Akses | File Contoh |
|---|---|---|---|
| **Presentation** | Render HTML, event handling, routing, animasi | Application, Business | `pos-page.js`, `app-button.js` |
| **Application** | Konfigurasi, konstanta, routing, event bus | Business | `app.config.js`, `router.js` |
| **Business** | Business logic, validasi, perhitungan, koordinasi | Repository | `product-service.js` |
| **Repository** | Akses database, query, CRUD, mapping data | Database | `product-repository.js` |
| **Database** | Koneksi Dexie, schema, migration, seed | IndexedDB | `db.js`, `schema.js` |
| **Infrastructure** | PWA, styling, asset, testing | - | `service-worker.js` |

### 3.3 Aturan Layer (Tidak Boleh Dilanggar)

```
✅  Page → Service → Repository → Database
❌  Page → Database (langsung)
❌  Service → DOM
❌  Component → Database
❌  Repository → Business Logic
```

---

## 4. Struktur Folder — Root

```
pos-offline-pwa/
│
├── 📁 docs/                      # Dokumentasi proyek (dibaca AI & developer)
├── 📁 public/                    # File publik (tidak di-build)
├── 📁 src/                       # Kode sumber aplikasi
├── 📁 tests/                     # File testing
├── 📁 scripts/                   # Script utility development
├── 📁 backups/                   # File backup (tidak di-commit)
│
├── 📄 index.html                 # Entry point aplikasi
├── 📄 manifest.json              # PWA manifest
├── 📄 service-worker.js          # Service Worker
├── 📄 .gitignore                 # Git ignore rules
├── 📄 README.md                  # Informasi proyek
└── 📄 CHANGELOG.md               # Catatan perubahan per rilis
```

### 4.1 docs/

| File / Folder | Tujuan |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, target, stack, roadmap |
| `02_DATABASE_SCHEMA.md` | Entitas, relasi, field, aturan integritas |
| `03_BUSINESS_RULES.md` | Aturan bisnis (168+ rules) |
| `04_UI_DESIGN_SYSTEM.md` | Warna, tipografi, spacing, komponen UI |
| `05_COMPONENT_LIBRARY.md` | Katalog komponen UI (70+ komponen) |
| `06_FEATURE_LIST.md` | Daftar fitur (88+ fitur) |
| `07_ROADMAP.md` | 13 fase pengembangan |
| `08_AI_PROMPT_GUIDE.md` | Panduan AI coding assistant |
| `09_CODING_STANDARD.md` | Standar penulisan kode |
| `10_PROJECT_STRUCTURE.md` | (dokumen ini) Standar struktur proyek |
| `CHANGELOG.md` | Catatan perubahan per rilis |

### 4.2 root files

| File | Tujuan |
|---|---|
| `index.html` | Entry point. Load app shell, manifest, service worker |
| `manifest.json` | PWA manifest: name, icons, theme_color, display |
| `service-worker.js` | Service Worker: cache assets, offline fallback |
| `README.md` | Informasi proyek untuk pengguna/deploy |
| `CHANGELOG.md` | Catatan perubahan per versi |
| `.gitignore` | Node, backup, environment files |

---

## 5. Struktur Folder — src/

```
src/
│
├── 📁 app/                       # Aplikasi utama
│   ├── app.js                    # Initialisasi aplikasi
│   └── bootstrap.js              # Load order: DB > Config > Auth > Router
│
├── 📁 assets/                    # Aset statis
│   ├── 📁 icons/                 # Icon aplikasi (PWA, favicon)
│   ├── 📁 images/                # Gambar (logo, ilustrasi)
│   ├── 📁 fonts/                 # Font (jika self-hosted)
│   └── 📁 sounds/                # Suara (notifikasi, scan berhasil)
│
├── 📁 components/                # Komponen UI global (reusable)
│   ├── 📁 button/                # AppButton, AppIconButton
│   ├── 📁 card/                  # AppCard, AppKpiCard, ProductCard
│   ├── 📁 table/                 # AppTable
│   ├── 📁 modal/                 # AppModal, AppConfirmDialog
│   ├── 📁 form/                  # AppInput, AppSelect, AppToggle
│   ├── 📁 feedback/              # AppToast, AppAlert, AppSpinner
│   ├── 📁 navigation/            # AppSidebar, AppBreadcrumb, AppTab
│   ├── 📁 data-display/          # AppBadge, AppAvatar, AppTooltip
│   ├── 📁 overlay/               # AppDrawer, AppFullscreenDialog
│   ├── 📁 pos/                   # ProductGrid, AppCart, AppPaymentPanel
│   ├── 📁 dashboard/             # AppSalesSummary, AppLowStockCard
│   ├── 📁 layout/                # AppLayout, AppTopbar, AppSidebar
│   └── 📁 setting/               # AppThemeSwitch, AppBackupPanel
│
├── 📁 layouts/                   # Layout template
│   ├── app-layout.js             # Layout utama (sidebar + topbar + content)
│   ├── auth-layout.js            # Layout login/lock
│   └── pos-layout.js             # Layout POS (full screen)
│
├── 📁 pages/                     # Halaman aplikasi
│   ├── 📁 login/                 # Login page
│   ├── 📁 pos/                   # POS main page
│   ├── 📁 dashboard/             # Dashboard page
│   ├── 📁 products/              # Product list, form
│   ├── 📁 categories/            # Category list
│   ├── 📁 customers/             # Customer list, form
│   ├── 📁 sales/                 # Sales history
│   ├── 📁 purchases/             # Purchase list, form
│   ├── 📁 inventory/             # Stock overview, adjustment
│   ├── 📁 reports/               # Report pages
│   ├── 📁 settings/              # Setting pages
│   └── 📁 cafe/                  # Cafe pages (v2.0)
│
├── 📁 modules/                   # Modul bisnis (feature-based)
│   ├── 📁 product/
│   ├── 📁 sales/
│   ├── 📁 purchase/
│   ├── 📁 inventory/
│   ├── 📁 customer/
│   ├── 📁 supplier/
│   ├── 📁 finance/
│   ├── 📁 report/
│   ├── 📁 shift/
│   ├── 📁 backup/
│   ├── 📁 cafe/                  # (v2.0)
│   └── 📁 loyalty/               # (v2.5)
│
├── 📁 services/                  # Service global (cross-module)
│   ├── auth-service.js           # Login, logout, session
│   ├── audit-service.js          # Audit logging
│   ├── permission-service.js     # RBAC check
│   ├── theme-service.js          # Theme management
│   └── notification-service.js   # Toast, notifikasi
│
├── 📁 repositories/              # Repository global (cross-module)
│   ├── base-repository.js        # Abstract CRUD
│   └── setting-repository.js     # Setting table
│
├── 📁 database/                  # Database layer
│   ├── db.js                     # Koneksi & inisialisasi Dexie
│   ├── schema.js                 # Definisi tabel & index
│   ├── migrations.js             # Migration per versi
│   ├── seeds.js                  # Data awal (default roles, settings)
│   ├── backup.js                 # Backup seluruh DB ke JSON
│   └── restore.js                # Restore DB dari JSON
│
├── 📁 router/                    # Routing
│   ├── router.js                 # Hash-based router
│   ├── routes.js                 # Daftar route
│   └── guards.js                 # Auth guard, role guard
│
├── 📁 config/                    # Konfigurasi
│   ├── app.config.js             # Konfigurasi umum
│   ├── db.config.js              # Database version, table list
│   ├── theme.config.js           # Tema color tokens
│   └── feature.config.js         # Fitur enable/disable flags
│
├── 📁 constants/                 # Konstanta global
│   ├── status.js                 # SALE_STATUS, SHIFT_STATUS
│   ├── roles.js                  # Role enum
│   ├── permissions.js            # Module & action enum
│   ├── payment.js                # PAYMENT_METHOD enum
│   ├── events.js                 # Custom event names
│   └── defaults.js               # Default values
│
├── 📁 utils/                     # Fungsi utility murni
│   ├── currency-utils.js         # formatCurrency, parseCurrency
│   ├── date-utils.js             # formatDate, parseDate, dateRange
│   ├── number-utils.js           # round, clamp, percentage
│   ├── string-utils.js           # capitalize, slugify, truncate
│   ├── id-utils.js               # generateId, generateInvoiceNumber
│   ├── validation-utils.js       # isEmail, isPhone, isRequired
│   ├── array-utils.js            # groupBy, sortBy, paginate
│   ├── dom-utils.js              # qs, qsa, delegate, createElement
│   ├── storage-utils.js          # localStorage wrapper (preferences only)
│   └── hash-utils.js             # SHA-256 hashing
│
├── 📁 helpers/                   # Helper fungsi dengan dependensi
│   ├── form-helper.js            # Form handling, validation display
│   ├── table-helper.js           # Table sorting, filtering
│   ├── modal-helper.js           # Modal open/close management
│   ├── export-helper.js          # Export data (PDF, Excel)
│   ├── import-helper.js          # Import data (Excel, JSON)
│   └── print-helper.js           # Print receipt, label
│
├── 📁 styles/                    # Stylesheet
│   ├── base.css                  # Reset, CSS variables
│   ├── theme.css                 # Light & dark mode variables
│   ├── layout.css                # App shell, sidebar, topbar
│   ├── components.css            # Custom component styles
│   ├── utilities.css             # Custom utility classes
│   └── 📁 pages/                 # Page-specific styles (minimal)
│
├── 📁 workers/                   # Web Workers
│   ├── backup-worker.js          # Background backup process
│   └── sync-worker.js            # (v3.0) Cloud sync
│
└── 📁 pwa/                       # PWA support files
    ├── 📁 icons/                 # PWA icons (192x192, 512x512)
    └── offline.html              # Fallback offline page
```

---

## 6. Struktur Modul

### 6.1 Struktur Standar Setiap Modul

Setiap modul bisnis di `src/modules/` mengikuti struktur berikut:

```
modules/{nama-modul}/
│
├── index.js                     # Re-export semua fungsi publik
├── {nama-modul}-page.js         # Halaman utama (entry point UI)
├── {nama-modul}-service.js      # Business logic
├── {nama-modul}-repository.js   # Akses database
├── {nama-modul}-validator.js    # Validasi data
├── {nama-modul}-events.js       # Custom events
├── {nama-modul}-utils.js        # Utility khusus modul
└── README.md                    # Dokumentasi modul
```

### 6.2 Fungsi Setiap File

| File | Tanggung Jawab | Contoh Isi |
|---|---|---|
| `index.js` | Re-export public API modul | `export { ProductService } from './product-service.js'` |
| `{modul}-page.js` | Render halaman, event handling, inisialisasi | Render tabel, form modal, panggil service |
| `{modul}-service.js` | Business logic, validasi BR, koordinasi | Validasi SKU, hitung pajak, panggil repository |
| `{modul}-repository.js` | CRUD database, query | `getAll`, `getById`, `create`, `update`, `delete` |
| `{modul}-validator.js` | Validasi input data | `validateCreate`, `validateUpdate` |
| `{modul}-events.js` | Custom events spesifik modul | `dispatchProductCreated`, `listenProductUpdate` |
| `{modul}-utils.js` | Helper khusus modul | `formatProductName`, `calculateProductMargin` |
| `README.md` | Dokumentasi modul | Tujuan, fitur, dependensi, BR terkait |

### 6.3 Contoh Struktur Modul Product

```
modules/product/
│
├── index.js
├── product-page.js           # Daftar produk + CRUD
├── product-service.js        # Business logic produk
├── product-repository.js     # Akses tabel products
├── product-validator.js      # Validasi form produk
├── product-events.js         # product:created, product:updated
├── product-utils.js          # formatProductType, generateSku
└── README.md
```

### 6.4 Modul yang Tidak Perlu Semua File

Tidak semua modul membutuhkan semua file. Panduan:

| File | Wajib? | Kapan Tidak Perlu |
|---|---|---|
| `index.js` | ✅ Wajib | - |
| `{modul}-service.js` | ✅ Wajib | Modul sangat sederhana (Unit, Category) |
| `{modul}-repository.js` | ✅ Wajib | Modul menggunakan repository global |
| `{modul}-page.js` | ✅ Jika punya UI | Modul backend-only (backup, sync) |
| `{modul}-validator.js` | ❌ Opsional | Validasi sederhana bisa di service |
| `{modul}-events.js` | ❌ Opsional | Jika tidak ada custom event |
| `{modul}-utils.js` | ❌ Opsional | Jika fungsi bisa masuk utility global |
| `README.md` | ✅ Wajib | Minimal 3 baris |

---

## 7. Struktur Komponen

### 7.1 Struktur Setiap Komponen

```
components/{kategori}/{nama-komponen}/
│
├── {nama-komponen}.js         # Fungsi render & behavior
├── {nama-komponen}.css        # Style spesifik komponen (jika diperlukan)
└── README.md                  # Dokumentasi komponen
```

### 7.2 Kategori Komponen

```
components/
│
├── button/
│   ├── app-button.js
│   ├── app-icon-button.js
│   └── app-floating-button.js
│
├── card/
│   ├── app-card.js
│   ├── app-kpi-card.js
│   ├── app-stat-card.js
│   ├── product-card.js
│   └── table-card.js           # (v2.0 Cafe)
│
├── table/
│   ├── app-table.js
│   └── app-pagination.js
│
├── modal/
│   ├── app-modal.js
│   ├── app-confirm-dialog.js
│   ├── app-drawer.js
│   └── app-fullscreen-dialog.js
│
├── form/
│   ├── app-input.js
│   ├── app-number-input.js
│   ├── app-currency-input.js
│   ├── app-search-box.js
│   ├── app-select.js
│   ├── app-multi-select.js
│   ├── app-checkbox.js
│   ├── app-radio.js
│   ├── app-toggle.js
│   ├── app-textarea.js
│   ├── app-date-picker.js
│   ├── app-time-picker.js
│   └── app-file-upload.js
│
├── feedback/
│   ├── app-alert.js
│   ├── app-toast.js
│   ├── app-snackbar.js
│   ├── app-progress-bar.js
│   ├── app-spinner.js
│   ├── app-skeleton.js
│   ├── app-empty-state.js
│   └── app-error-state.js
│
├── navigation/
│   ├── app-sidebar-menu.js
│   ├── app-breadcrumb.js
│   ├── app-tab.js
│   ├── app-dropdown.js
│   ├── app-nav-drawer.js
│   └── app-context-menu.js
│
├── data-display/
│   ├── app-badge.js
│   ├── app-avatar.js
│   ├── app-chip.js
│   └── app-tooltip.js
│
├── overlay/
│   (disatukan dengan modal/)
│
├── pos/
│   ├── product-grid.js
│   ├── product-search.js
│   ├── app-cart.js
│   ├── app-cart-item.js
│   ├── app-quantity-selector.js
│   ├── app-discount-panel.js
│   ├── app-tax-panel.js
│   ├── app-payment-panel.js
│   ├── app-calculator-pad.js
│   ├── app-receipt-preview.js
│   ├── app-receipt-item.js
│   ├── app-cash-summary.js
│   ├── app-shift-summary.js
│   ├── app-barcode-scanner.js
│   └── app-qr-scanner.js
│
├── dashboard/
│   ├── app-sales-summary.js
│   ├── app-revenue-card.js
│   ├── app-profit-card.js
│   ├── app-chart-card.js
│   ├── app-low-stock-card.js
│   ├── app-activity-timeline.js
│   ├── app-recent-transaction.js
│   └── app-quick-action.js
│
├── layout/
│   ├── app-layout.js
│   ├── app-sidebar.js
│   ├── app-topbar.js
│   ├── app-main-content.js
│   ├── app-page-container.js
│   ├── app-section.js
│   ├── app-footer.js
│   └── app-divider.js
│
├── cafe/                       # (v2.0)
│   ├── table-layout.js
│   ├── kitchen-ticket.js
│   ├── kitchen-queue.js
│   ├── order-timeline.js
│   └── reservation-card.js
│
└── setting/
    ├── app-theme-switch.js
    ├── app-backup-panel.js
    ├── app-restore-panel.js
    ├── app-database-status.js
    └── app-storage-usage.js
```

### 7.3 Standar Dokumentasi Komponen

Setiap folder komponen harus memiliki `README.md`:

```markdown
# AppButton

Tombol universal aplikasi.

## Variants
- primary, secondary, outline, success, warning, danger, ghost, link

## Props
- variant: string
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- loading: boolean
- icon: string (icon name)

## Usage
import { renderAppButton } from './components/button/app-button.js';
```

---

## 8. Struktur Halaman

### 8.1 Struktur Setiap Halaman

```
pages/{nama-halaman}/
│
├── {nama-halaman}-page.js      # Entry point halaman
└── README.md                   # Dokumentasi halaman (opsional)
```

### 8.2 Daftar Halaman

| Folder | Route | Modul | Fitur (dari 06) |
|---|---|---|---|
| `login/` | `/login` | Auth | CS-01 |
| `pos/` | `/pos` | Sales | SA-01 s.d. SA-20 |
| `dashboard/` | `/` | Dashboard | DB-01 s.d. DB-09 |
| `products/` | `/products` | Product | MD-01 |
| `categories/` | `/categories` | Product | MD-02 |
| `customers/` | `/customers` | Customer | MD-05 |
| `suppliers/` | `/suppliers` | Supplier | MD-04 |
| `sales/` | `/sales` | Sales | RP-01 |
| `purchases/` | `/purchases` | Purchase | PU-01 |
| `inventory/` | `/inventory` | Inventory | IN-01 s.d. IN-05 |
| `reports/` | `/reports` | Report | RP-01 s.d. RP-11 |
| `settings/` | `/settings` | Core | CS-03 s.d. CS-10 |
| `cafe/` | `/cafe` | Cafe (v2.0) | CF-01 s.d. CF-09 |

### 8.3 Pola Halaman

Setiap halaman mengikuti pola:

```
1. Import dependensi (komponen, service, utility)
2. State lokal (loading, data, error)
3. init() — dipanggil router, menerima container
4. renderLayout() — render HTML ke container
5. loadData() — ambil data dari service
6. attachEvents() — event handler
7. Helper functions (render item, update UI)
```

---

## 9. Struktur Database

### 9.1 Folder & File

```
database/
│
├── db.js              # Inisialisasi Dexie, koneksi, versioning
├── schema.js          # Definisi tabel, index, relasi
├── migrations.js      # Migration handler per versi
├── seeds.js           # Data awal (default roles, admin, settings)
├── backup.js          # Export seluruh data ke JSON
└── restore.js         # Import data dari JSON
```

### 9.2 Tanggung Jawab

| File | Tanggung Jawab | Contoh Isi |
|---|---|---|
| `db.js` | Buat instance Dexie, set version, panggil upgrade | `const db = new Dexie('PosOfflineDB')` |
| `schema.js` | Definisi tabel: field, index, unique | `db.version(1).stores({ products: 'id, sku, name' })` |
| `migrations.js` | Handler upgrade antar versi | `db.version(2).stores({ ... }).upgrade(tx => { ... })` |
| `seeds.js` | Data default saat DB pertama dibuat | Admin user, default settings, default roles |
| `backup.js` | Baca semua tabel, format JSON, checksum | `export async function backupDatabase() { }` |
| `restore.js` | Validasi JSON, clear DB, bulk insert | `export async function restoreDatabase(data) { }` |

### 9.3 Aturan Database

| # | Aturan |
|---|---|
| 1 | Satu database: `PosOfflineDB` |
| 2 | Versioning: increment setiap ada perubahan schema |
| 3 | Migration: setiap versi harus punya upgrade handler |
| 4 | Index: semua field yang di-query harus punya index |
| 5 | Unique: SKU, barcode, username harus unique index |
| 6 | Soft delete: field `deletedAt` (timestamp or null) |

---

## 10. Struktur Service

### 10.1 Service Global (Cross-Module)

Service yang digunakan oleh banyak modul ditempatkan di `src/services/`:

```
services/
│
├── auth-service.js           # Login, logout, session management
├── audit-service.js           # Catat audit log
├── permission-service.js     # Cek RBAC
├── theme-service.js          # Apply theme, toggle light/dark
├── notification-service.js   # Push notification, toast
├── setting-service.js        # Baca/tulis setting
└── backup-service.js         # Orchestrasi backup/restore
```

### 10.2 Service Modul

Service spesifik modul ditempatkan di dalam folder modul:

```
modules/product/product-service.js
modules/sales/sales-service.js
modules/inventory/inventory-service.js
```

### 10.3 Pola Service

Setiap service harus:

1. Menerima parameter yang sudah divalidasi
2. Memanggil repository untuk akses data
3. Menerapkan business rules (validasi, perhitungan)
4. Mencatat audit log untuk perubahan kritis
5. Melempar error jika terjadi masalah (tidak di-swallow)

---

## 11. Struktur Repository

### 11.1 Repository Global

```
repositories/
│
├── base-repository.js         # Abstract class dengan CRUD standar
└── setting-repository.js      # Setting table (key-value)
```

### 11.2 Repository Modul

```
modules/product/product-repository.js
modules/sales/sales-repository.js
```

### 11.3 Aturan Repository

| # | Aturan |
|---|---|
| 1 | **Semua akses database melalui Repository** — tidak ada pengecualian |
| 2 | Repository tidak boleh berisi business logic |
| 3 | Repository menerima dan mengembalikan plain object |
| 4 | Repository boleh melakukan mapping data (format date, rename field) |
| 5 | BaseRepository menyediakan CRUD standar (`getAll`, `getById`, `create`, `update`, `delete`) |

---

## 12. Struktur Utility

### 12.1 Daftar Utility

```
utils/
│
├── currency-utils.js         # formatCurrency, parseCurrency
├── date-utils.js              # formatDate, formatDateTime, getDateRange
├── number-utils.js            # round, clamp, percentage, toInteger
├── string-utils.js            # capitalize, slugify, truncate, stripHtml
├── id-utils.js                # generateUUID, generateInvoiceNumber, generateSku
├── validation-utils.js        # isRequired, isEmail, isPhone, isNumeric
├── array-utils.js             # groupBy, sortBy, paginate, unique
├── dom-utils.js               # qs, qsa, delegate, createElement, removeElement
├── storage-utils.js           # localStorage set/get/remove (preferences only)
└── hash-utils.js              # sha256 (Web Crypto API)
```

### 12.2 Aturan Utility

| # | Aturan |
|---|---|
| 1 | Utility adalah **pure function** — tidak ada side effect |
| 2 | Utility tidak boleh mengakses database, DOM, atau service |
| 3 | Utility tidak boleh melempar error (return null/default) |
| 4 | Utility bisa digunakan di semua layer |

---

## 13. Struktur Config

### 13.1 Daftar Config

```
config/
│
├── app.config.js              # Nama aplikasi, versi, default page
├── db.config.js               # Database name, current version, table list
├── theme.config.js            # Color tokens light & dark
├── feature.config.js          # Fitur enable/disable (isCafeEnabled, isLoyaltyEnabled)
├── format.config.js           # Date format, currency format, locale
└── performance.config.js      # Page size, debounce delay, cache TTL
```

### 13.2 Pola Config

```js
// config/app.config.js
export const APP_CONFIG = {
  name: 'POS Offline PWA',
  version: '1.0.0',
  defaultPage: '/pos',
  supportEmail: 'support@posoffline.app',
};
```

---

## 14. Struktur Constants

### 14.1 Daftar Constants

```
constants/
│
├── status.js                  # SALE_STATUS, SHIFT_STATUS, PURCHASE_STATUS, PAYMENT_STATUS
├── roles.js                   # ROLE = { ADMIN, CASHIER, MANAGER, OWNER }
├── permissions.js             # MODULES, ACTIONS
├── payment.js                 # PAYMENT_METHOD
├── events.js                  # CUSTOM_EVENTS (event name constants)
├── defaults.js                # DEFAULT_PAGE_SIZE, MAX_CART_ITEMS, DEBOUNCE_DELAY
├── types.js                   # PRODUCT_TYPE, EXPENSE_CATEGORY, INCOME_CATEGORY
└── storage.js                 # STORAGE_KEYS (localStorage keys for preferences)
```

---

## 15. Struktur Styles

### 15.1 Pembagian Stylesheet

```
styles/
│
├── base.css                   # CSS reset, CSS variables (warna, spacing, font)
├── theme.css                  # Light mode & dark mode variable overrides
├── layout.css                 # App shell: sidebar, topbar, main content, footer
├── components.css             # Custom component styles (yang tidak bisa Bootstrap)
├── utilities.css              # Custom utility classes
│
├── pages/                     # Page-specific styles (minimal)
│   ├── pos.css
│   ├── dashboard.css
│   └── login.css
│
└── modules/                   # Module-specific styles (jika diperlukan)
    └── product.css
```

### 15.2 Aturan Stylesheet

| # | Aturan |
|---|---|
| 1 | Bootstrap utility classes adalah prioritas utama |
| 2 | Custom CSS hanya untuk yang tidak bisa Bootstrap |
| 3 | Page-specific CSS minimal — prefer inline atau utility |
| 4 | Semua warna menggunakan CSS variables (light/dark ready) |
| 5 | Tidak ada `!important` tanpa alasan terdokumentasi |

---

## 16. Struktur Assets

```
assets/
│
├── icons/                     # SVG icons (Bootstrap Icons via CDN, custom SVG)
├── images/                    # Logo, ilustrasi, foto default
│   ├── logo.svg
│   ├── logo-dark.svg
│   ├── empty-state.svg
│   └── error-state.svg
├── fonts/                     # Font self-hosted (jika tidak pakai Google Fonts)
└── sounds/                    # Suara notifikasi (opsional)
    ├── scan-success.mp3
    └── payment-success.mp3
```

---

## 17. Struktur PWA

```
pwa/
│
├── icons/                     # Ikon PWA (berbagai ukuran)
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
├── offline.html               # Halaman offline fallback
└── manifest.js                # Generate manifest.json (jika dinamis)
```

File di root:

| File | Fungsi |
|---|---|
| `manifest.json` | Metadata PWA: name, short_name, icons, theme_color, display |
| `service-worker.js` | Cache assets, offline fallback, background sync (v3.0) |

---

## 18. Struktur Testing

### 18.1 Folder

```
tests/
│
├── unit/                      # Unit test (fungsi utility, validator)
│   ├── currency-utils.test.js
│   ├── date-utils.test.js
│   └── product-validator.test.js
│
├── integration/               # Integration test (service + repository)
│   ├── product-service.test.js
│   ├── sales-service.test.js
│   └── inventory-service.test.js
│
├── manual/                    # Skenario test manual
│   ├── pos-transaction.md
│   ├── backup-restore.md
│   └── shift-management.md
│
├── fixtures/                  # Data dummy untuk testing
│   ├── products.json
│   ├── customers.json
│   └── sales.json
│
└── mocks/                     # Mock objects
    ├── mock-db.js
    └── mock-repository.js
```

### 18.2 Aturan Testing

| # | Aturan |
|---|---|
| 1 | Unit test untuk semua utility function |
| 2 | Integration test untuk service + repository |
| 3 | Manual test untuk alur bisnis kompleks (POS, shift, backup) |
| 4 | Fixtures sebagai JSON (bisa di-import langsung) |
| 5 | Mock database untuk test yang tidak perlu IndexedDB sungguhan |

---

## 19. Struktur Backup

```
backups/
│
├── manual/                    # Backup yang dibuat manual oleh user
├── auto/                      # Backup otomatis (setiap 6 jam)
├── export/                    # Data export (Excel, JSON per entitas)
└── import/                    # Data import (temporary)
```

(Isi folder backup tidak di-commit ke git — masuk `.gitignore`)

---

## 20. Naming Convention

### 20.1 Tabel Penamaan

| Elemen | Konvensi | Contoh | Berlaku untuk |
|---|---|---|---|
| **Folder** | kebab-case | `product-service`, `app-button` | Semua folder |
| **File JavaScript** | kebab-case | `product-service.js` | Semua file .js |
| **File CSS** | kebab-case | `main.css`, `dark-mode.css` | Semua file .css |
| **File HTML** | kebab-case | `index.html`, `offline.html` | Semua file .html |
| **File JSON** | kebab-case | `products.json`, `settings.json` | Semua file .json |
| **Class** | PascalCase | `ProductService`, `AppButton` | Service, Repository, Component class |
| **Function** | camelCase | `getProductById`, `formatCurrency` | Semua fungsi |
| **Variable** | camelCase | `productName`, `cartItems` | Semua variabel |
| **Constanta** | UPPER_SNAKE_CASE | `MAX_CART_ITEMS`, `SALE_STATUS` | Konstanta global |
| **Enum** | UPPER_SNAKE_CASE | `PAYMENT_METHOD.CASH` | Objek konstan |
| **CSS Class (custom)** | kebab-case | `product-card`, `cart-panel` | Class CSS kustom |
| **Data Attribute** | kebab-case | `data-product-id` | HTML attribute |
| **Custom Event** | kebab-case:namespace | `product:created` | Event name |

### 20.2 Prefiks Berdasarkan Jenis

| Jenis | Prefiks | Contoh |
|---|---|---|
| App component | `App` | `AppButton`, `AppTable`, `AppModal` |
| Modul component | (nama modul) | `ProductCard`, `PaymentPanel` |
| Service | (nama)Service | `ProductService`, `SalesService` |
| Repository | (nama)Repository | `ProductRepository` |
| Page | (nama)-page | `pos-page.js` |

---

## 21. Dependency Rule

### 21.1 Aturan Dependency

```
┌─────────────┐
│    Page     │  ← boleh import: Component, Service, Layout, Utility
├─────────────┤
│  Component  │  ← boleh import: Utility, Component lain (jarang)
├─────────────┤
│   Service   │  ← boleh import: Repository, Utility, Service lain
├─────────────┤
│ Repository  │  ← boleh import: Database (db), Utility
├─────────────┤
│    DB       │  ← boleh import: Config, Constants
├─────────────┤
│   Utility   │  ← tidak boleh import apapun dari proyek (pure function)
└─────────────┘
```

### 21.2 Aturan Ketat

```
✅  Page → Component, Service, Layout, Utility
❌  Page → Repository, Database

✅  Component → Utility
❌  Component → Service, Repository, Database

✅  Service → Repository, Utility, Service lain
❌  Service → Component, Page, DOM

✅  Repository → Database (db), Utility
❌  Repository → Service, Component

✅  Utility → nothing from project (pure)
❌  Utility → Service, Repository, Database
```

---

## 22. Import Rule

### 22.1 Urutan Import

Setiap file mengelompokkan import dalam urutan berikut:

```js
// 1. Library eksternal
import { Dexie } from 'https://cdn.jsdelivr.net/npm/dexie@4/+esm';

// 2. Config & Constants
import { APP_CONFIG } from '../../config/app.config.js';
import { SALE_STATUS } from '../../constants/status.js';

// 3. Utility
import { formatCurrency } from '../../utils/currency-utils.js';
import { generateId } from '../../utils/id-utils.js';

// 4. Service / Repository
import { ProductService } from '../../modules/product/product-service.js';

// 5. Komponen
import { renderAppTable } from '../../components/table/app-table.js';
import { renderAppButton } from '../../components/button/app-button.js';
```

### 22.2 Path Convention

| Lokasi File | Path dari src/ | Contoh Import |
|---|---|---|
| `src/pages/products/product-page.js` | `./` | `../services/...` |
| `src/modules/product/product-service.js` | `src/modules/product/` | `../../utils/...` |
| `src/components/button/app-button.js` | `src/components/button/` | `../../utils/...` |
| Root files (`src/`) | `./` | `./components/...` |

### 22.3 Larangan Import

```
❌  Circular dependency (A import B, B import A)
❌  Import dari dalam modul ke luar modus tanpa index.js
❌  Relative path yang terlalu panjang (../../../../)
❌  Import file .css dari JavaScript (kecuali Bootstrap sudah CDN)
❌  Dynamic import untuk komponen yang selalu dipakai (hanya untuk lazy load)
```

---

## 23. Modul Baru

### 23.1 Langkah Standar Membuat Modul Baru

```
Step 1: Buat folder modul
  src/modules/{nama-modul}/

Step 2: Buat service
  {nama-modul}-service.js  — business logic

Step 3: Buat repository
  {nama-modul}-repository.js  — akses database

Step 4: Buat validator (jika diperlukan)
  {nama-modul}-validator.js  — validasi data

Step 5: Buat events (jika diperlukan)
  {nama-modul}-events.js  — custom events

Step 6: Buat halaman
  pages/{nama-modul}/{nama-modul}-page.js  — UI

Step 7: Daftarkan route
  router/routes.js

Step 8: Update dokumentasi
  - modules/{nama-modul}/README.md
  - Feature List (status)
  - Component Library (jika ada komponen baru)

Step 9: Update database (jika ada tabel baru)
  - database/schema.js
  - DATABASE_SCHEMA.md

Step 10: Testing
  - Test manual / integration
```

---

## 24. Dokumentasi Modul

### 24.1 Template README.md Modul

Setiap folder modul **wajib** memiliki `README.md`:

```markdown
# Modul Product

## Tujuan
Mengelola data produk (barang/jasa) — CRUD, import/export, barcode.

## Fitur
- Product CRUD (MD-01)
- Product Import/Export Excel (MD-06)
- Barcode Label Print (MD-07)
- Price History (MD-08)

## Dependensi
- Category (parentId)
- Unit (unitId)
- Inventory (stok)

## Business Rules Terkait
- BR-020 s.d. BR-029 (Manajemen Produk)
- BR-030 s.d. BR-034 (Kategori)
- BR-040 s.d. BR-047 (Manajemen Harga)

## Struktur File
- product-service.js      — Business logic
- product-repository.js    — CRUD database
- product-validator.js     — Validasi data
- product-events.js        — product:created, product:updated
- product-utils.js         — generateSku, formatProductType
```

---

## 25. Anti Pattern

### 25.1 Yang Harus Dihindari

| Anti Pattern | Masalah | Solusi |
|---|---|---|
| **Folder terlalu dalam** | Sulit dinavigasi | Maks 4 level dari `src/` |
| **Utility jadi tempat sampah** | Tidak terorganisir | Pisah per domain (currency, date, number) |
| **Komponen saling bergantung langsung** | Sulit di-test | Gunakan event bus atau props |
| **Service mengakses DOM** | Melanggar layer | Pindah ke page/component |
| **UI mengakses database** | Melanggar layer | Harus melalui service → repository |
| **Hardcoded path** | Rapuh saat direfaktor | Gunakan konstanta atau config |
| **Satu file > 300 baris** | Sulit dibaca | Pecah per tanggung jawab |
| **File index.js tidak digunakan** | Tidak ada entry point jelas | Setiap modul harus punya index.js |
| **CSS di file JS** | Sulit di-maintain | Gunakan CSS class |
| **Fungsi tanpa JSDoc** | Tidak ada dokumentasi | Wajib JSDoc di fungsi export |

---

## 26. Skalabilitas

### 26.1 Dukungan untuk Fitur Masa Depan

| Fitur Masa Depan | Dukungan Struktur |
|---|---|
| **Multi Outlet** | Field `outletId` di entitas utama (sudah disiapkan di schema) |
| **Multi Warehouse** | Field `warehouseId` di inventories. Struktur folder tidak berubah |
| **Marketplace** | Modul baru: `src/modules/marketplace/` — tidak perlu ubah struktur |
| **Cloud Sync** | Service baru: `src/services/sync-service.js` + worker: `src/workers/sync-worker.js` |
| **REST API** | Folder baru: `src/api/` — tidak mengganggu struktur existing |
| **Plugin System** | Folder baru: `src/plugins/` — setiap plugin folder sendiri |
| **Modul Tambahan** | Cukup tambah folder di `src/modules/` — tidak perlu reorganisasi |

### 26.2 Prinsip Skalabilitas

| Prinsip | Implementasi |
|---|---|
| **Open for extension, closed for modification** | Modul baru = folder baru, bukan modifikasi struktur existing |
| **Separation of concerns** | Layer dipisah — penambahan fitur tidak mengganggu layer lain |
| **Feature-based** | Semua file fitur dalam satu folder — mudah ditemukan dan dipindahkan |
| **Loose coupling** | Modul tidak bergantung langsung — komunikasi via service |

---

> **Dokumen ini adalah standar resmi struktur proyek untuk POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md` s.d. `09_CODING_STANDARD.md`.

---

*POS Offline PWA — Project Structure v1.0.0 — 15 Juli 2026*
