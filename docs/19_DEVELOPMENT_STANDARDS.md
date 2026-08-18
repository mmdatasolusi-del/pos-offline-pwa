# DEVELOPMENT STANDARDS

> **Versi** : 1.0  
> **Status** : Wajib Diikuti  
> **Berlaku Untuk** : Seluruh Developer & AI yang mengerjakan POS Offline PWA

---

## Tujuan

Dokumen ini adalah **standar resmi pengembangan** proyek POS Offline PWA. Standar dibuat agar:

1. Seluruh source code tetap **konsisten** di semua modul dan halaman.
2. Kode **mudah dipelihara** oleh siapa pun — manusia maupun AI.
3. Kode **mudah dikembangkan** tanpa takut merusak bagian lain.
4. Proyek **tidak menghasilkan technical debt** di masa depan.

Setiap kode yang dikirim ke repositori **wajib** mengikuti seluruh aturan dalam dokumen ini. Pelanggaran terhadap standar dianggap sebagai bug dan harus diperbaiki sebelum merge.

---

## Daftar Isi

1. [General Principles](#1-general-principles)
2. [Folder Structure Rules](#2-folder-structure-rules)
3. [Module Standard](#3-module-standard)
4. [Naming Convention](#4-naming-convention)
5. [UI Standards](#5-ui-standards)
6. [JavaScript Standards](#6-javascript-standards)
7. [Error Handling](#7-error-handling)
8. [Validation Standard](#8-validation-standard)
9. [Repository Standard](#9-repository-standard)
10. [Service Standard](#10-service-standard)
11. [Security Standard](#11-security-standard)
12. [Routing Standard](#12-routing-standard)
13. [Database Standard](#13-database-standard)
14. [Performance Standard](#14-performance-standard)
15. [Offline Standard](#15-offline-standard)
16. [Documentation Standard](#16-documentation-standard)
17. [Testing Standard](#17-testing-standard)
18. [Code Review Checklist](#18-code-review-checklist)
19. [AI Development Rules](#19-ai-development-rules)
20. [Future Ready](#20-future-ready)

---

## 1. General Principles

Seluruh kode yang ditulis **wajib** memenuhi prinsip-prinsip berikut. Prinsip ini adalah fondasi kualitas proyek.

### 1.1 KISS — Keep It Simple

Solusi paling sederhana adalah yang terbaik.

| Aturan | Keterangan |
|---|---|
| Sederhana | Jangan membuat kompleksitas yang tidak diperlukan |
| Mudah dibaca | Orang lain harus paham kode tanpa bertanya |
| Mudah diubah | Perubahan kecil tidak memerlukan perubahan besar |
| Hindari "pintar" | Kode yang pintar tapi sulit dibaca = buruk |

```js
// BURUK — terlalu pintar
const r = arr.reduce((a, c, i) => (c > a.max ? { max: c, i } : a), { max: -Infinity, i: -1 });

// BAIK — sederhana dan jelas
let max = -Infinity;
let index = -1;
for (let i = 0; i < arr.length; i++) {
  if (arr[i] > max) {
    max = arr[i];
    index = i;
  }
}
```

### 1.2 DRY — Don't Repeat Yourself

Jangan menduplikasi logika. Kode yang sama **wajib** di-extract ke fungsi, modul, atau komponen yang dapat digunakan ulang.

```js
// BURUK — logika diskon diulang 3x
const priceA = baseA - baseA * 0.1;
const priceB = baseB - baseB * 0.1;
const priceC = baseC - baseC * 0.1;

// BAIK — satu fungsi, dipakai ulang
function applyDiscount(price, discountRate = 0.1) {
  return price - price * discountRate;
}
const priceA = applyDiscount(baseA);
const priceB = applyDiscount(baseB);
const priceC = applyDiscount(baseC);
```

### 1.3 SOLID

| Prinsip | Penjelasan | Implementasi |
|---|---|---|
| **S** — Single Responsibility | Satu class/fungsi hanya punya satu alasan untuk berubah | Repository hanya akses DB, Service hanya business rules, Page hanya UI |
| **O** — Open Closed | Terbuka untuk ekstensi, tertutup untuk modifikasi | Tambah fitur dengan menambah file baru, bukan mengubah fungsi lama |
| **L** — Liskov Substitution | Subclass harus bisa menggantikan base class tanpa merusak | Jangan override perilaku dasar secara tidak wajar |
| **I** — Interface Segregation | Jangan memaksa class mengimplementasikan yang tidak dipakai | Pecah interface menjadi kecil dan spesifik |
| **D** — Dependency Inversion | Bergantung pada abstraksi, bukan implementasi konkret | Page bergantung pada Service, bukan langsung ke Dexie |

### 1.4 YAGNI — You Ain't Gonna Need It

Jangan menambahkan fitur atau abstraksi yang belum dibutuhkan saat ini.

```js
// BURUK — menambahkan fitur yang tidak diminta
export function getProduct(id, { withHistory = false, withImage = false, withSync = false } = {}) {
  // implementasi 3 fitur sekaligus padahal hanya id yang dibutuhkan
}

// BAIK — hanya yang dibutuhkan sekarang
export function getProduct(id) {
  // implementasi minimal
}
```

### 1.5 Clean Architecture

Lapisan aplikasi **wajib** dipisahkan dan arah dependency hanya satu arah:

```
Pages (UI)  -->  Services (Business Rules)  -->  Repositories (Data)
```

| Lapisan | Isi | Tidak Boleh |
|---|---|---|
| Page / Component | UI, event handler | Akses database langsung |
| Service | Business rules, workflow | Query IndexedDB langsung |
| Repository | Akses data, query | Berisi logika bisnis |

### 1.6 Feature First

Pengembangan diorganisir berdasarkan **fitur/modul**, bukan berdasarkan tipe file. Satu fitur diletakkan dalam satu folder modul.

```
src/modules/product/
  index.js
  product-service.js
  product-repository.js
  product-validator.js
```

### 1.7 Low Coupling & High Cohesion

| Konsep | Aturan |
|---|---|
| **Low Coupling** | Modul harus sedikit bergantung satu sama lain. Perubahan satu modul tidak boleh merambat ke banyak modul |
| **High Cohesion** | Isi dalam satu modul harus memiliki keterkaitan yang erat. Semua yang berhubungan dengan "produk" berada di satu tempat |

---

## 2. Folder Structure Rules

Struktur folder proyek memiliki tanggung jawab yang jelas dan **tidak boleh dicampur aduk**. Business Logic tidak boleh bercampur dengan UI.

```
src/
├── app/          # Entry point aplikasi, bootstrap, lifecycle
├── auth/         # Autentikasi & session (login, session, guard)
├── components/   # Komponen UI reusable (belum spesifik modul)
├── config/       # Konfigurasi global (app, db, theme)
├── database/     # Dexie, schema, migration, seed, backup
├── layouts/      # Layout halaman (AppLayout, dll)
├── modules/      # Modul bisnis (produk, penjualan, pelanggan, ...)
├── pages/        # Halaman & route handler
├── router/       # Routing, navigation, guard
├── services/     # Service lintas-modul (auth, theme, idle, logger)
├── styles/       # CSS global, design system, token
├── utils/        # Helper umum murni (tanpa efek samping)
└── pwa/          # Service Worker, manifest, cache, install
```

### 2.1 Tabel Tanggung Jawab Folder

| Folder | Tanggung Jawab | Berisi | DILARANG Berisi |
|---|---|---|---|
| `src/app/` | Entry point & lifecycle aplikasi | `app.js`, `bootstrap.js` | Business logic |
| `src/auth/` | Autentikasi & session | `login.js`, `session.js`, `auth.js` | Komponen UI |
| `src/components/` | Komponen UI reusable | `Sidebar.js`, `Topbar.js`, `LoginForm.js` | Query database |
| `src/config/` | Konfigurasi global | `app.config.js`, `db.config.js` | Logika |
| `src/database/` | Lapisan data | `db.js`, `schema.js`, `migrations.js`, `seeds.js` | Business rules |
| `src/layouts/` | Kerangka halaman | `AppLayout.js` | Business logic |
| `src/modules/` | Modul bisnis | Folder per fitur (lihat Section 3) | Kode acak |
| `src/pages/` | Halaman & route handler | `LoginPage.js`, `Dashboard.js` | Query DB langsung |
| `src/router/` | Routing & navigation | `router.js`, `guards.js` | Business rules |
| `src/services/` | Service lintas-modul | `auth-service.js`, `theme-service.js` | Query DB langsung |
| `src/styles/` | CSS & design system | `variables.css`, `base.css`, `theme.css` | JavaScript |
| `src/utils/` | Helper murni | `id-utils.js`, `hash-utils.js` | Efek samping / side effect |
| `src/pwa/` | PWA lifecycle | `pwa-service.js`, `pwa-config.js` | Business logic |

### 2.2 Aturan Pemisahan Business Logic dan UI

```
X  Page  -->  query IndexedDB langsung
✓  Page  -->  Service  -->  Repository  -->  IndexedDB
```

| Larangan | Contoh | Solusi |
|---|---|---|
| Page memanggil Dexie langsung | `db.products.where(...)` di `products-page.js` | Panggil `productService.getProducts()` |
| Service melakukan rendering DOM | `document.getElementById(...)` di service | Service hanya mengembalikan data |
| Repository berisi perhitungan bisnis | `total = qty * price * tax` di repository | Pindah ke Service |
| Utils menulis ke database | `save()` di `id-utils.js` | Utils murni, tanpa efek samping |

### 2.3 Aturan Penempatan File Baru

1. File yang dipakai **satu modul** → taruh di dalam folder modul tersebut.
2. File yang dipakai **banyak modul** → taruh di `src/components/`, `src/services/`, atau `src/utils/` sesuai jenisnya.
3. File **bukan UI dan bukan data** yang dipakai banyak modul → `src/utils/`.
4. Komponen UI yang dipakai banyak modul → `src/components/`.
5. Business rule yang dipakai banyak modul → `src/services/`.

---

## 3. Module Standard

Setiap module bisnis **wajib** memiliki struktur berikut:

```
module-name/
├── index.js          # Public API / barrel export
├── repository.js     # Akses database saja
├── service.js        # Business rules saja
├── validator.js      # Validasi input
├── utils.js          # Helper khusus modul (opsional)
├── components/       # Komponen UI khusus modul (opsional)
└── pages/            # Halaman khusus modul (opsional)
```

### 3.1 Contoh Struktur Modul Produk

```
src/modules/product/
├── index.js
├── product-repository.js
├── product-service.js
├── product-validator.js
├── components/
│   └── product-form.js
└── pages/
    └── product-list-page.js
```

### 3.2 Tanggung Jawab Tiap File

| File | Tanggung Jawab | Boleh Mengakses | Tidak Boleh |
|---|---|---|---|
| `index.js` | Men-export API publik modul | File dalam modul | Business logic |
| `repository.js` | CRUD, query, search, pagination, soft delete | Database (Dexie) | Business rules, kalkulasi |
| `service.js` | Business rules, workflow, kalkulasi | Repository, Validator | Database langsung, DOM |
| `validator.js` | Validasi input (format, kelengkapan, aturan) | Utils | Database, DOM |
| `utils.js` | Helper murni khusus modul | — | Efek samping |
| `components/` | Komponen UI khusus modul | Service | Database langsung |
| `pages/` | Halaman & route handler modul | Service, Komponen | Database langsung |

### 3.3 Alur Dependency Module

```
pages/  -->  service.js  -->  repository.js  -->  database
   \          |
    \         +--> validator.js
     \--> components/  -->  service.js
```

Dependency **hanya boleh satu arah**: UI bergantung pada Service, Service bergantung pada Repository. Dilarang dependency terbalik.

### 3.4 `index.js` — Barrel Export

`index.js` menjadi satu-satunya pintu masuk publik modul. Bagian dalam modul boleh diimport langsung, namun konsumen modul disarankan memakai `index.js`.

```js
// src/modules/product/index.js
export { productService } from './product-service.js';
export { productValidator } from './product-validator.js';
```

### 3.5 Aturan Implementasi

- Repository **hanya** berisi operasi data (lihat Section 9).
- Service **hanya** berisi business rules (lihat Section 10).
- Validator **murni** tanpa efek samping: fungsi `(input) => { errors }` atau `(input) => boolean`.
- Function di dalam modul tidak boleh melebihi 150 baris (lihat Section 6.4).

---

## 4. Naming Convention

### 4.1 File — kebab-case

Nama file menggunakan **kebab-case** (huruf kecil, dipisah `-`).

| Contoh Benar | Contoh Salah |
|---|---|
| `product-service.js` | `productService.js` |
| `customer-page.js` | `CustomerPage.js` |
| `inventory-validator.js` | `inventory_validator.js` |
| `app.config.js` | `appConfig.js` |

### 4.2 Function — camelCase

Nama fungsi menggunakan **camelCase**, diawali huruf kecil, kata berikutnya kapital.

```js
function createProduct(data) { }
function getCustomer(id) { }
function calculateProfit(price, cost) { }
function applyDiscount(price) { }
```

### 4.3 Constant — UPPER_CASE

Konstanta global menggunakan **UPPER_SNAKE_CASE** dengan underscore.

```js
const DEFAULT_PAGE_SIZE = 20;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const SESSION_MAX_LIFETIME_MS = 24 * 60 * 60 * 1000;
```

### 4.4 Variable — camelCase

Variabel lokal menggunakan **camelCase**.

```js
const productList = [];
let totalQuantity = 0;
const isActiveUser = true;
```

### 4.5 Class — PascalCase

Nama class menggunakan **PascalCase**, setiap kata diawali huruf kapital.

```js
class ProductRepository { }
class InventoryService { }
class DatabaseManager { }
```

### 4.6 Nama Berdasarkan Peran

| Jenis | Suffix | Contoh |
|---|---|---|
| Repository | `Repository` | `ProductRepository` |
| Service | `Service` | `InventoryService` |
| Validator | `Validator` | `CustomerValidator` |
| Page | `Page` | `LoginPage` |
| Component | sesuai peran | `Sidebar`, `Topbar`, `Card` |

### 4.7 Penamaan Boolean

Gunakan prefix yang menjelaskan sifat yes/no.

| Benar | Salah |
|---|---|
| `isActive` | `active` |
| `hasPermission` | `permission` |
| `canEdit` | `edit` |
| `shouldRender` | `render` |

---

## 5. UI Standards

### 5.1 Gunakan Design System

Seluruh elemen UI **wajib** mengacu pada Design System proyek. Token desain didefinisikan di `src/styles/variables.css` dan dipakai ulang di semua file CSS.

### 5.2 Dilarang Hardcode Warna

**Tidak boleh** menuliskan nilai warna mentah di dalam komponen atau file CSS selain `variables.css`.

```css
/* BURUK — warna hardcode */
.card {
  background: #1e293b;
  color: #94a3b8;
}

/* BAIK — memakai token dari variables.css */
.card {
  background: var(--card-bg);
  color: var(--kpi-label);
}
```

### 5.3 Semua Warna Berasal dari `variables.css`

| Jenis Token | Contoh | Dipakai Untuk |
|---|---|---|
| Warna latar | `--topbar-bg`, `--card-bg` | Background |
| Warna teks | `--kpi-text`, `--topbar-text` | Font color |
| Warna border | `--topbar-border`, `--card-border` | Border |
| Warna aksen | `#3b82f6` (didefinisikan sekali) | Primary, focus |

### 5.4 Bootstrap Utility Dulu, CSS Sendiri Belakangan

Urutan prioritas styling:

1. **Bootstrap Utility** yang sudah ada (`d-flex`, `text-center`, `mt-3`, `gap-2`, dll).
2. Jika utility tidak cukup, gunakan **component class** dari Design System.
3. Jika tetap tidak cukup, baru tulis **CSS khusus** di file `*.css` yang sesuai.

```html
<!-- BAIK — memakai Bootstrap utility -->
<div class="d-flex align-items-center gap-2 mb-3">
  <i class="bi bi-box"></i>
  <span class="fw-semibold">Produk</span>
</div>
```

### 5.5 Dilarang Inline Style (Kecuali Benar-Benar Diperlukan)

Inline style hanya diperbolehkan untuk kasus yang benar-benar membutuhkan nilai dinamis (misal posisi/ukuran dari data). Untuk styling statis, wajib menggunakan class.

```html
<!-- BURUK — inline style untuk styling statis -->
<button style="background: blue; color: white; border-radius: 10px;">Simpan</button>

<!-- BAIK — menggunakan class -->
<button class="btn btn-primary">Simpan</button>
```

### 5.6 Semua Icon Memakai Bootstrap Icons

Jangan membuat icon sendiri, gunakan paket **Bootstrap Icons** (`bi`).

```html
<i class="bi bi-plus-circle"></i>   <!-- Benar -->
<i class="bi bi-cart3"></i>          <!-- Benar -->
<!-- Dilarang pakai emoji sebagai icon utama -->
```

### 5.7 Semua Spacing Memakai Token

Spacing menggunakan token `xs`, `sm`, `md`, `lg`, `xl` — bukan angka mentah yang tersebar.

| Token | Nilai Rekomendasi | Contoh Penggunaan |
|---|---|---|
| `xs` | 4px | Jarak antar icon dan teks dalam tombol |
| `sm` | 8px | Gap antar elemen kecil |
| `md` | 16px | Padding kartu, jarak antar komponen |
| `lg` | 24px | Margin antar section |
| `xl` | 32px+ | Spasi antar blok halaman |

```css
.card-body {
  padding: var(--space-md);
}
.section-gap {
  margin-bottom: var(--space-lg);
}
```

---

## 6. JavaScript Standards

### 6.1 ES Modules

Proyek menggunakan **ES Modules**. Dilarang menggunakan `require()`.

```js
// BAIK — ES Module
import { productService } from '../modules/product/product-service.js';
import { getDeviceId } from '../auth/session.js';
export function calculateProfit(price, cost) { }

// DILARANG
const productService = require('../modules/product/product-service.js');
```

### 6.2 Import / Export

- Selalu gunakan `import` / `export` eksplisit.
- Nama yang diimport ditulis `camelCase` untuk fungsi/variabel dan `PascalCase` untuk class.
- Impor berdampingan dan konsisten.

```js
import { renderSidebar } from '../components/Sidebar.js';
import { authService } from '../services/auth-service.js';
import { saveSession } from '../auth/session.js';
```

### 6.3 Async / Await

Gunakan `async/await` untuk seluruh operasi asinkron. **Dilarang callback hell** (nested callback bertingkat).

```js
// BAIK — async/await yang jelas
async function loadDashboard() {
  const products = await productService.getAll();
  const sales = await saleService.getToday();
  renderKpi(products, sales);
}

// DILARANG — callback hell
function loadDashboard() {
  productService.getAll((products) => {
    saleService.getToday((sales) => {
      renderKpi(products, sales);
    });
  });
}
```

### 6.4 Batas Panjang Function: 150 Baris

Function **tidak boleh lebih dari 150 baris**. Jika melebihi, wajib dipecah menjadi fungsi-fungsi kecil.

```js
// BAIK — dipecah menjadi fungsi kecil
async function loadDashboardData() { /* < 150 baris */ }
function renderKpi(data) { /* < 150 baris */ }
function renderChart(data) { /* < 150 baris */ }

// DILARANG — satu fungsi 400 baris
async function loadDashboard() { /* 400 baris */ }
```

---

## 7. Error Handling

### 7.1 Semua Async Wajib try/catch

Setiap operasi asinkron **wajib** dibungkus `try/catch` untuk mencegah unhandled rejection.

```js
async function fetchProducts() {
  try {
    return await productService.getAll();
  } catch (error) {
    logger.error('[Product] Gagal memuat produk', error);
    return [];
  }
}
```

### 7.2 Semua Error Masuk Logger

Setiap error yang tertangkap **wajib** dicatat ke logger. Error tidak boleh ditelan diam-diam (`catch {}` tanpa isi).

```js
// BAIK — error dicatat
catch (error) {
  logger.error('Gagal menyimpan produk', error);
  throw error;
}

// DILARANG — error dibuang tanpa jejak
catch (error) {
  // abaikan
}
```

### 7.3 Dilarang console.log di Production

**Tidak boleh** ada `console.log`, `console.warn`, atau `console.error` di kode production. Gunakan logger aplikasi:

| Alih-alih `console.*` | Gunakan |
|---|---|
| `console.log('...')` | `logger.info('...')` |
| `console.warn('...')` | `logger.warn('...')` |
| `console.error('...')` | `logger.error('...')` |

```js
// DILARANG
console.log('Produk berhasil disimpan');

// BAIK
logger.info('[Product] Produk berhasil disimpan', { id: product.id });
```

### 7.4 Tingkatan Logger

| Level | Fungsi | Dipakai Untuk |
|---|---|---|
| Info | `logger.info()` | Proses normal: berhasil simpan, login, export |
| Warn | `logger.warn()` | Peringatan: data tidak ditemukan, cache kosong |
| Error | `logger.error()` | Gagal total: query gagal, exception, network error |

---

## 8. Validation Standard

### 8.1 Semua Input Wajib Divalidasi

Setiap input dari pengguna **wajib** melewati validasi pada **semua** lapisan berikut:

| Lapisan | Tugas | Lokasi |
|---|---|---|
| **UI Validation** | Validasi real-time, feedback visual | Komponen / Page |
| **Business Validation** | Aturan bisnis, kelengkapan data | Service |
| **Database Validation** | Integritas data, constraint | Repository / Schema |

### 8.2 Dilarang Validasi Hanya di UI

Validasi UI bersifat kosmetik. **Wajib** ada validasi di Service (business validation) dan Repository (database validation) sebagai benteng terakhir.

```js
// UI Validation — feedback ke pengguna
if (!name.trim()) {
  showFieldError('name', 'Nama wajib diisi');
  return;
}

// Business Validation — aturan bisnis
const errors = productValidator.validate({ name, price, stock });
if (errors.length > 0) throw new ValidationError(errors);

// Database Validation — constraint saat persist
await productRepository.save(validatedProduct);
```

### 8.3 Contoh Validator Murni

Validator harus **murni**: input masuk, hasil keluar, tanpa efek samping.

```js
// src/modules/product/product-validator.js
export function validateProduct(input) {
  const errors = [];
  if (!input.name || input.name.trim() === '') {
    errors.push({ field: 'name', message: 'Nama produk wajib diisi' });
  }
  if (typeof input.price !== 'number' || input.price < 0) {
    errors.push({ field: 'price', message: 'Harga tidak valid' });
  }
  return errors;
}
```

---

## 9. Repository Standard

### 9.1 Repository TIDAK BOLEH Mengandung Business Logic

Repository adalah lapisan **akses data murni**. Repository **tidak boleh** menghitung harga, menerapkan kebijakan, atau memvalidasi aturan bisnis.

### 9.2 Yang Boleh Dilakukan Repository

| Operasi | Contoh |
|---|---|
| CRUD | `add()`, `get()`, `update()`, `delete()` |
| Search | `search(keyword)` |
| Pagination | `getPage(page, size)` |
| Soft delete | `softDelete(id)` |
| Query | `where(...).filter(...)` |

```js
// src/modules/product/product-repository.js
export async function getById(id) {
  return db.products.get(id);
}

export async function getPage({ page = 1, size = 20 }) {
  return db.products
    .orderBy('createdAt')
    .reverse()
    .offset((page - 1) * size)
    .limit(size)
    .toArray();
}

export async function softDelete(id) {
  return db.products.update(id, {
    deletedAt: new Date().toISOString(),
  });
}
```

### 9.3 Contoh PELANGGARAN (Dilarang)

```js
// DILARANG — repository mengandung business logic
export async function getTotalProfit() {
  const products = await db.products.toArray();
  return products.reduce((sum, p) => sum + (p.salePrice - p.costPrice) * p.qty, 0); // ← logika bisnis!
}

// BAIK — repository hanya mengambil data
export async function getProducts() {
  return db.products.toArray();
}

// Kalkulasi profit dipindah ke Service
```

---

## 10. Service Standard

Service adalah pusat **business logic** aplikasi. Service memanggil Repository untuk mengambil data dan menerapkan aturan bisnis sebelum mengembalikan hasil ke UI.

### 10.1 Tanggung Jawab Service

| Tanggung Jawab | Contoh |
|---|---|
| **Business Rules** | Diskon maksimum, batas stok minimum |
| **Calculation** | Total transaksi, profit, pajak |
| **Workflow** | Alur checkout, alur retur |
| **Permission** | Cek hak akses sebelum operasi |
| **Import** | Memproses file import (Excel/CSV) |
| **Export** | Menyiapkan data export (PDF/Excel) |
| **Validation** | Memanggil validator business rule |

### 10.2 Contoh Service

```js
// src/modules/sale/sale-service.js
export async function createSale(items, customerId) {
  const errors = saleValidator.validate({ items, customerId });
  if (errors.length > 0) throw new ValidationError(errors);

  const total = calculateTotal(items);
  const stockOk = await checkStock(items);
  if (!stockOk) throw new BusinessError('Stok tidak mencukupi');

  const sale = await saleRepository.create({ items, customerId, total });
  await productRepository.decreaseStock(items);
  return sale;
}
```

### 10.3 Dilarang di Service

| Dilarang | Alasan |
|---|---|
| Query IndexedDB langsung | Melanggar Clean Architecture |
| Manipulasi DOM (`document...`) | Service tidak tahu UI |
| Menulis session/storage langsung | Tugas Auth Service |

---

## 11. Security Standard

### 11.1 Dilarang Password Plaintext

Password **wajib** disimpan sebagai hash yang aman. Jangan pernah menyimpan atau menampilkan password dalam bentuk teks biasa.

```js
// BAIK — simpan hasil hash
const passwordHash = await hashPassword(password);
await userRepository.save({ username, passwordHash });

// DILARANG — simpan plaintext
await userRepository.save({ username, password });
```

### 11.2 Dilarang Token Hardcode

Jangan menempatkan token, API key, atau kredensial sebagai nilai tetap di dalam kode.

```js
// DILARANG
const API_KEY = 'sk-1234567890abcdef';

// BAIK — ambil dari konfigurasi yang aman / input pengguna
const apiKey = getSecureConfig('apiKey');
```

### 11.3 Dilarang Secret dalam Source Code

Semua rahasia (password default, kunci enkripsi, token) **tidak boleh** tertanam di source code. Jika terpaksa ada default, wajib diganti saat first-run dan dicatat di dokumentasi.

### 11.4 Session Wajib Memiliki Expiry

Setiap session autentikasi **wajib** memiliki waktu kedaluwarsa dan diperiksa setiap kali halaman diakses.

```js
// BAIK — session punya expiresAt dan dicek
if (Date.now() >= session.expiresAt) {
  clearSession();
  redirectToLogin();
}
```

### 11.5 Permission Wajib Dicek

Setiap akses halaman/aksi **wajib** melewati cek permission. Jangan hanya menyembunyikan tombol — cek tetap dilakukan di sisi logic.

```js
if (!authService.hasPermission('produk')) {
  throw new BusinessError('Anda tidak memiliki akses');
}
```

---

## 12. Routing Standard

### 12.1 Semua Halaman Wajib Terdaftar Lengkap

Setiap halaman baru **wajib** didaftarkan pada **empat tempat**:

| Tempat | Tujuan |
|---|---|
| **Router** | `router.js` — route + loader + guard |
| **Sidebar** | `Sidebar.js` — menu navigasi |
| **Permission** | `auth-service.js` / `ROLE_PERMISSIONS` — hak akses |
| **Breadcrumb** | Alur navigasi/posisi halaman |

```js
// router.js — route wajib terdaftar
dashboard: {
  label: 'Dashboard',
  load: () => import('../pages/Dashboard.js'),
  protected: true,
  authOnly: false,
},
```

### 12.2 Dilarang Route Mati

Route mati adalah route yang tidak bisa diakses atau menuju halaman yang tidak ada. Setiap route **wajib**:

- Menampilkan halaman yang nyata.
- Dapat dijangkau dari UI (sidebar atau navigasi lain).
- Memiliki guard yang benar (`protected` / `authOnly`).

### 12.3 Contoh Checklist Route Baru

```text
[]  Route terdaftar di router.js
[]  Route terdaftar di sidebar
[]  Permission ditambahkan untuk role yang relevan
[]  Breadcrumb/navigasi diperbarui
[]  Guard dipastikan benar (protected / authOnly)
[]  Tidak ada hash/route yang menuju halaman tidak ada
```

---

## 13. Database Standard

### 13.1 Semua Perubahan Schema Terdokumentasi

Setiap perubahan skema database **wajib** melalui mekanisme yang terdokumentasi:

| Komponen | Keterangan |
|---|---|
| **Migration** | File perubahan skema yang dapat dieksekusi |
| **Version** | Nomor versi skema yang naik setiap ada perubahan |
| **Rollback** | Rencana/cara mengembalikan ke versi sebelumnya |
| **Seed** | Data awal yang dibuat ulang secara idempoten |

### 13.2 Aturan Migration

```js
// migration — versi naik, perubahan terdefinisi jelas
db.version(2).stores({
  products: '++id, name, price, deletedAt',
  product_sync: 'id, lastSyncedAt', // contoh tambahan
});
```

| Aturan | Penjelasan |
|---|---|
| Satu versi = satu tujuan perubahan | Jangan mencampur banyak perubahan dalam satu versi |
| Migration harus idempoten | Menjalankan ulang tidak boleh merusak data |
| Seed tidak boleh dobel | Seed memeriksa apakah data sudah ada sebelum insert |
| Dokumentasi di update | Perubahan dicatat di dokumen database (`02_DATABASE_SCHEMA.md`, `14_UNIVERSAL_DATABASE_DESIGN.md`) |

### 13.3 Contoh Seed Idempoten

```js
// seeds.js — aman dijalankan berkali-kali
const count = await db.roles.count();
if (count === 0) {
  await db.roles.bulkAdd(INITIAL_ROLES);
}
```

---

## 14. Performance Standard

### 14.1 Lazy Load Page

Setiap halaman **wajib** dimuat secara lazy (dinamis) sehingga hanya diunduh saat dibutuhkan.

```js
// BAIK — lazy load via dynamic import
load: () => import('../pages/reports/reports-page.js'),

// DILARANG — semua halaman di-import statis sejak awal
import { ReportsPage } from '../pages/reports/reports-page.js';
```

### 14.2 Debounce Search

Pencarian yang memicu operasi (query DB, rendering) **wajib** di-debounce untuk mengurangi beban.

```js
let debounceTimer;
function onSearchInput(value) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runSearch(value);
  }, 300);
}
```

### 14.3 Pagination

Daftar data yang panjang **wajib** menggunakan pagination — jangan memuat semua data sekaligus.

```js
// BAIK — ambil satu halaman
const page = await productRepository.getPage({ page, size: 20 });
```

### 14.4 Virtual Rendering

Untuk daftar dengan jumlah item sangat besar, gunakan virtual rendering hanya untuk item yang terlihat.

### 14.5 Memoization (Jika Perlu)

Gunakan memoization untuk perhitungan mahal yang hasilnya tidak berubah.

```js
const cache = new Map();
function getCached(key, compute) {
  if (cache.has(key)) return cache.get(key);
  const value = compute();
  cache.set(key, value);
  return value;
}
```

### 14.6 Checklist Performance

```text
[]  Halaman di-load secara lazy
[]  Search di-debounce
[]  List panjang memakai pagination
[]  Virtual rendering untuk list sangat besar
[]  Tidak ada query berulang yang tidak perlu
[]  DOM dirender ulang seminimal mungkin
```

---

## 15. Offline Standard

### 15.1 Semua Fitur Wajib Berjalan Offline

POS Offline PWA dirancang **offline-first**. Semua fitur inti harus tetap berfungsi saat tanpa internet.

### 15.2 Tidak Boleh Bergantung pada Internet

| Aturan | Penjelasan |
|---|---|
| Data utama di IndexedDB | Sumber kebenaran lokal |
| CDN wajib di-cache | Asset CDN di-cache Service Worker agar tetap jalan offline |
| Tidak ada panggilan API wajib | Fitur tidak boleh gagal hanya karena tidak ada koneksi |
| Fallback halaman offline | `offline.html` disajikan saat navigasi gagal |

### 15.3 Service Worker Wajib Kompatibel

Service Worker harus dikelola dengan benar:

- **Cache version** naik setiap ada perubahan asset/build.
- **Network-first untuk navigasi** agar build baru selalu digunakan.
- **Cache-first untuk asset statis** agar cepat dan offline.
- **Cleanup cache lama** saat aktivasi versi baru.
- **Reload otomatis** saat SW baru aktif (`controllerchange`).

```js
const CACHE_VERSION = 'v4';
const APP_CACHE = `pos-app-${CACHE_VERSION}`;
const VALID_CACHES = [APP_CACHE, CDN_CACHE, DYNAMIC_CACHE];
```

### 15.4 IndexedDB Sebagai Sumber Utama

| Data | Penyimpanan |
|---|---|
| Produk, pelanggan, supplier | IndexedDB (Dexie) |
| Transaksi, laporan | IndexedDB (Dexie) |
| Session auth (remember me) | localStorage |
| Session auth (tidak remember) | sessionStorage |
| Pengaturan tema | localStorage |

IndexedDB adalah sumber utama data aplikasi. Cache HTTP dan storage hanya pendukung.

### 15.5 Checklist Offline

```text
[]  Fitur dapat digunakan tanpa internet
[]  Asset CDN tercache oleh Service Worker
[]  Navigasi offline menampilkan offline.html
[]  Cache version naik saat ada perubahan asset
[]  Tidak ada fetch ke server untuk operasi inti
[]  Data lokal (IndexedDB) tersinkron ketika online (bila ada sync)
```

---

## 16. Documentation Standard

### 16.1 Setiap Module Wajib Memiliki Dokumentasi

| Dokumentasi | Isi |
|---|---|
| **README** | Ringkasan module, cara pakai, cara test |
| **Business Rules** | Aturan bisnis yang diimplementasikan module |
| **API Contract** | Fungsi/ekspos public module, parameter, hasil |
| **Flow Diagram** | Alur kerja utama module (teks/skema) |

### 16.2 Template README Module

```markdown
# Module Product

## Deskripsi
Mengelola data produk: CRUD, kategori, stok, harga.

## Struktur
product-repository.js, product-service.js, product-validator.js

## Business Rules
- Harga jual wajib lebih besar dari harga beli.
- Stok tidak boleh negatif.

## API Contract
- productService.getAll() -> Product[]
- productService.create(data) -> Product

## Flow Diagram
Page -> Service -> Validator -> Repository -> IndexedDB
```

### 16.3 Setiap Perubahan Kode Wajib Update Dokumentasi

| Perubahan | Dokumen yang Harus Diperbarui |
|---|---|
| Skema database | `02_DATABASE_SCHEMA.md`, migration, ERD |
| Business rules | `03_BUSINESS_RULES.md` / `17_BUSINESS_RULES.md` |
| API/route | `18_API_CONTRACT.md` |
| Struktur folder | `10_PROJECT_STRUCTURE.md` |
| Standar kode | `09_CODING_STANDARD.md`, dokumen ini |

---

## 17. Testing Standard

### 17.1 Minimal Test yang Wajib Ada

| Target | Minimal Test | Contoh |
|---|---|---|
| **Repository** | CRUD, query, pagination | `getById`, `getPage`, `softDelete` |
| **Service** | Business rules, workflow | kalkulasi total, cek stok |
| **Validator** | Kasus valid & tidak valid | input kosong, harga negatif |
| **Route** | Guard & navigasi | route protected, route auth-only |
| **Permission** | Akses per role | Owner vs Kasir |
| **Import/Export** | Format & hasil | import Excel valid, export PDF |

### 17.2 Checklist Test

```text
[]  Repository: create, read, update, delete, search, pagination, soft delete
[]  Service: valid & invalid business rules
[]  Validator: input valid, input invalid, boundary
[]  Route: halaman login tanpa session, halaman protected dengan session
[]  Permission: setiap role hanya akses yang diizinkan
[]  Import: file valid, file korup, duplikat
[]  Export: data sesuai format, file dapat dibuka
```

---

## 18. Code Review Checklist

Checklist berikut **wajib** dijalankan untuk setiap perubahan kode sebelum dianggap selesai.

### 18.1 Kebersihan Kode

- [ ] Tidak ada duplicate code
- [ ] Tidak ada dead code (kode tidak terpakai)
- [ ] Tidak ada TODO / FIXME / placeholder tersisa
- [ ] Tidak ada code yang dicomment tanpa alasan
- [ ] Tidak ada console.log / console.warn / console.error
- [ ] Semua kode memakai import/export ES Module (bukan require)
- [ ] Tidak ada inline style (kecuali benar-benar diperlukan)
- [ ] Tidak ada warna hardcode (semua dari variables.css)
- [ ] Tidak ada string ajaib tanpa konstanta bernama
- [ ] Tidak ada magic number

### 18.2 Struktur & Arsitektur

- [ ] Business logic tidak bercampur dengan UI
- [ ] Repository hanya akses database, tanpa business logic
- [ ] Service memuat business rules, tanpa akses DB/DOM langsung
- [ ] File ditempatkan di folder yang sesuai (modul/komponen/service/utils)
- [ ] Fungsi tidak melebihi 150 baris
- [ ] Class/komponen dipakai ulang bila memungkinkan (DRY)
- [ ] Dependency arahnya benar (Page -> Service -> Repository)
- [ ] Tidak ada file baru yang seharusnya masuk ke folder lain

### 18.3 Business Rules

- [ ] Business rules dipatuhi
- [ ] Perhitungan (harga, total, diskon, stok) benar
- [ ] Tidak ada logika bisnis yang bocor ke UI
- [ ] Perubahan business rules sudah disetujui & terdokumentasi

### 18.4 Keamanan

- [ ] Permission dicek untuk setiap akses
- [ ] Tidak ada password/token/secret hardcode
- [ ] Session memiliki expiry dan dicek
- [ ] Input divalidasi di semua lapisan
- [ ] Tidak ada data sensitif yang ditampilkan di log

### 18.5 Validasi & Error

- [ ] Validation lengkap (UI + Business + Database)
- [ ] Semua async dibungkus try/catch
- [ ] Semua error masuk logger
- [ ] Tidak ada error yang ditelan diam-diam
- [ ] Pesan error informatif untuk pengguna

### 18.6 Routing & Navigasi

- [ ] Route terdaftar di router
- [ ] Route terdaftar di sidebar
- [ ] Permission route sudah benar (protected / authOnly)
- [ ] Breadcrumb/navigasi diperbarui
- [ ] Tidak ada route mati

### 18.7 Data & Offline

- [ ] Soft delete berjalan (deletedAt, bukan delete permanen bila dipersyaratkan)
- [ ] Perubahan schema punya migration + version + rollback + seed
- [ ] Fitur tetap berjalan offline
- [ ] Cache version Service Worker dinaikkan bila ada perubahan asset
- [ ] Tidak ada dependensi internet untuk operasi inti

### 18.8 Performance & Kualitas

- [ ] Page di-load lazy
- [ ] Search di-debounce
- [ ] List panjang memakai pagination
- [ ] Tidak ada query berulang yang tidak perlu
- [ ] Tidak ada render ulang DOM berlebihan

### 18.9 Dokumentasi

- [ ] Kode sudah didokumentasikan (JSDoc bila perlu)
- [ ] Perubahan dicatat di changelog
- [ ] Dokumentasi terkait diperbarui (schema, API, business rules)
- [ ] README module diperbarui bila ada perubahan struktur

---

## 19. AI Development Rules

Aturan khusus yang **wajib** diikuti oleh AI (coding assistant) yang mengerjakan proyek ini.

### 19.1 AI TIDAK BOLEH Tanpa Persetujuan

AI **tidak boleh** melakukan hal berikut tanpa persetujuan eksplisit dari pengguna/developer:

| Dilarang | Contoh |
|---|---|
| **Mengubah struktur folder** | Memindahkan folder modul, mengganti nama direktori |
| **Mengubah schema database** | Menambah/menghapus kolom, tabel, mengubah index |
| **Menghapus file** | Menghapus file lama yang masih dipakai/dokumentasi |
| **Mengubah Business Rules** | Mengubah aturan diskon, margin, alur transaksi |
| **Mengubah API** | Mengubah kontrak fungsi/route yang sudah dipakai |

### 19.2 AI WAJIB Melakukan

| Kewajiban | Keterangan |
|---|---|
| **Audit dahulu** | Periksa kode terkait sebelum mengubah |
| **Jelaskan perubahan** | Sampaikan apa, mengapa, dan dampaknya |
| **Buat migration jika perlu** | Setiap perubahan schema wajib migration |
| **Buat changelog** | Catat perubahan di changelog |
| **Update dokumentasi** | Perbarui dokumen yang terdampak |

### 19.3 Workflow AI Wajib

```text
1. Audit kode terkait (baca file, cari dependensi).
2. Jelaskan rencana perubahan ke pengguna.
3. Tunggu persetujuan untuk perubahan besar.
4. Implementasi mengikuti standar dokumen ini.
5. Buat migration bila schema berubah.
6. Jalankan test & validasi sintaks.
7. Update changelog dan dokumentasi.
8. Laporkan hasil dengan ringkas.
```

### 19.4 Contoh Persetujuan yang Dibutuhkan

```text
"AI ingin mengubah struktur folder modules/product menjadi:
   modules/catalog/product
   Dampak: import di 5 file berubah.
   Apakah disetujui?"
```

---

## 20. Future Ready

Standar ini dirancang agar aplikasi siap menghadapi kebutuhan masa depan. Setiap keputusan arsitektur saat ini **tidak boleh** mempersulit adopsi berikut:

### 20.1 Skenario Masa Depan

| Skenario | Kesiapan yang Dijaga |
|---|---|
| **Multi Store** | Data lokal terstruktur per cabang; identitas cabang sebagai bagian dari data |
| **Multi Branch** | Permission per cabang; scope query per cabang |
| **Cloud Sync** | Repository terisolasi dari UI sehingga mudah diganti dengan remote |
| **Mobile** | PWA responsif; UI menggunakan Bootstrap responsive |
| **Desktop** | Struktur modular dipisah dari platform |
| **Electron** | Entry point `src/app/` terpisah dari UI, mudah dibungkus |
| **Android / iOS** | PWA kompatibel; Service Worker + manifest sudah disiapkan |
| **PWA** | Offline-first, cache, install (sudah menjadi fondasi) |
| **Apps Script Connector** | Service/API contract terdokumentasi sehingga mudah di-expose |
| **REST API** | Service menampung business logic — siap di-back oleh server API |

### 20.2 Prinsip yang Menjaga Kesiapan Masa Depan

| Prinsip | Manfaat Masa Depan |
|---|---|
| Business logic di Service | Siap dipindah ke REST API/server |
| Repository terpisah | Siap ganti dari IndexedDB ke remote/cloud |
| Clean Architecture | Platform-agnostic (web, desktop, mobile) |
| Offline-first | Sinkronisasi ke cloud tinggal ditambahkan di atas data lokal |
| Permission terpusat | Siap untuk multi-role multi-branch |
| Dokumentasi lengkap | Onboarding developer & integrasi eksternal lebih mudah |

### 20.3 Checklist Future Ready

```text
[]  Business logic tidak menempel di UI (siap di-expose ke API)
[]  Repository dapat diganti tanpa mengubah Service
[]  Identitas cabang/toko dapat ditambahkan tanpa merombak schema
[]  Permission dapat diperluas per role/branch
[]  Data lokal siap di-sync (timestamp, status sync)
[]  Build dapat dijalankan untuk PWA/desktop/mobile
[]  Service Worker & manifest selalu dijaga kompatibel
```

---

## Lampiran

### A. Referensi Dokumen

| Dokumen | Topik |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, aturan dasar |
| `02_DATABASE_SCHEMA.md` | Struktur database |
| `03_BUSINESS_RULES.md` / `17_BUSINESS_RULES.md` | Aturan bisnis |
| `04_UI_DESIGN_SYSTEM.md` | Token desain & style guide |
| `05_COMPONENT_LIBRARY.md` | Spesifikasi komponen |
| `09_CODING_STANDARD.md` | Standar penulisan kode |
| `10_PROJECT_STRUCTURE.md` | Struktur proyek |
| `13_TESTING_GUIDE.md` | Pedoman pengujian |
| `18_API_CONTRACT.md` | Kontrak API |

### B. Definisi Selesai (Definition of Done)

Suatu task/feature dinyatakan **selesai** jika memenuhi:

- [ ] Kode mengikuti seluruh standar dokumen ini
- [ ] Tidak ada pelanggaran checklist Section 18
- [ ] Test minimal (Section 17) lulus
- [ ] Error handling & logger diterapkan
- [ ] Dokumentasi & changelog diperbarui
- [ ] Fitur tetap berjalan offline
- [ ] Tidak ada technical debt baru yang disengaja

---

> **Versi 1.0** — Dokumen standar pengembangan POS Offline PWA.  
> Revisi berikutnya harus dicatat di bawah ini.

### Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 2026-08-06 | Versi awal: 20 section standar pengembangan |
