# 09_CODING_STANDARD.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Coding](#2-filosofi-coding)
3. [Teknologi](#3-teknologi)
4. [Struktur Penamaan](#4-struktur-penamaan)
5. [Struktur File](#5-struktur-file)
6. [Standar JavaScript](#6-standar-javascript)
7. [Penanganan Error](#7-penanganan-error)
8. [Struktur Modul](#8-struktur-modul)
9. [Standar HTML](#9-standar-html)
10. [Standar CSS](#10-standar-css)
11. [Standar Komentar](#11-standar-komentar)
12. [Logging](#12-logging)
13. [Validasi](#13-validasi)
14. [Performance](#14-performance)
15. [Keamanan](#15-keamanan)
16. [Struktur Event](#16-struktur-event)
17. [Struktur Database](#17-struktur-database)
18. [Standar UI](#18-standar-ui)
19. [Dokumentasi Kode](#19-dokumentasi-kode)
20. [Anti Pattern](#20-anti-pattern)
21. [Code Review Checklist](#21-code-review-checklist)
22. [Refactoring](#22-refactoring)
23. [Definition of Done](#23-definition-of-done)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **standar resmi penulisan kode** untuk aplikasi POS Offline PWA. Setiap kode yang ditulis — oleh AI maupun developer manusia — **wajib** mengikuti standar ini.

Dokumen ini melengkapi section 8 (Coding Standard) dari `01_PROJECT_BLUEPRINT.md` dengan detail yang lebih mendalam.

### 1.2 Siapa yang Membaca

| Pembaca | Kegunaan |
|---|---|
| **Developer** | Acuan menulis kode yang konsisten |
| **AI Coding Assistant** | Aturan implementasi yang harus diikuti |
| **Code Reviewer** | Checklist untuk review kode |
| **Technical Lead** | Standar kualitas yang ditegakkan |

### 1.3 Acuan

| Dokumen | Hubungan |
|---|---|
| `01_PROJECT_BLUEPRINT.md` (section 8) | Aturan dasar penamaan, JS rules, JSDoc, pemisahan layer |
| `02_DATABASE_SCHEMA.md` | Struktur data yang diakses kode |
| `03_BUSINESS_RULES.md` | Aturan bisnis yang diimplementasikan |
| `04_UI_DESIGN_SYSTEM.md` | Token desain yang digunakan CSS |
| `05_COMPONENT_LIBRARY.md` | Spesifikasi komponen yang diimplementasikan |
| `08_AI_PROMPT_GUIDE.md` | Workflow dan template untuk AI |

---

## 2. Filosofi Coding

### 2.1 Clean Code

Kode harus mudah dibaca seolah-olah ditulis oleh satu orang. Nama variabel dan fungsi harus mengungkapkan niat. Kode yang bersih adalah kode yang self-documenting.

**Implementasi**: Gunakan nama yang deskriptif. Satu fungsi = satu tanggung jawab. Hindari komentar yang menjelaskan "apa" (kode sudah menjelaskan), simpan komentar untuk "mengapa".

### 2.2 Readability First

Kode ditulis untuk dibaca manusia, bukan hanya untuk dijalankan mesin. Kode yang mudah dibaca lebih mudah di-debug, di-review, dan di-maintain.

**Implementasi**: Prioritaskan kode yang jelas dan lugas daripada kode yang "pintar" tapi sulit dipahami.

### 2.3 Simplicity

Solusi paling sederhana adalah yang terbaik. Jangan membuat abstraksi sebelum benar-benar dibutuhkan.

**Implementasi**: Tanya "Apakah ini menyederhanakan atau mempersulit?" sebelum menulis abstraksi.

### 2.4 Maintainability

Kode akan dirawat oleh banyak developer dan AI dalam jangka panjang. Buat kode yang mudah dipahami oleh orang yang tidak menulisnya.

**Implementasi**: Gunakan pola yang konsisten. Dokumentasikan keputusan desain. Hindari hack dan workaround yang tidak jelas.

### 2.5 Reusability

Jangan menulis ulang kode yang sudah ada. Selalu cek apakah ada fungsi, komponen, atau utilitas yang bisa digunakan kembali.

**Implementasi**: Ekstrak logika yang digunakan di beberapa tempat ke service/helper. Gunakan komponen dari `05_COMPONENT_LIBRARY.md`.

### 2.6 Consistency

Kode yang konsisten lebih mudah diprediksi. Pengembang bisa membaca satu bagian dan sudah tahu bagaimana bagian lain ditulis.

**Implementasi**: Ikuti aturan penamaan, struktur file, dan pola yang ditetapkan di dokumen ini tanpa pengecualian.

### 2.7 SOLID (diterapkan seperlunya)

| Prinsip | Implementasi di JavaScript |
|---|---|
| **Single Responsibility** | Satu fungsi/file hanya punya satu alasan untuk berubah |
| **Open/Closed** | Ekstensi via parameter/opsi, bukan modifikasi fungsi inti |
| **Liskov Substitution** | Gunakan dengan hati-hati (JS tidak strict typing). Pastikan subclass bisa menggantikan parent |
| **Interface Segregation** | Jangan paksa caller menerima parameter yang tidak dibutuhkan |
| **Dependency Inversion** | Service tergantung pada Repository (abstraksi), bukan pada implementasi spesifik |

### 2.8 DRY — Don't Repeat Yourself

Jika kode yang sama muncul di dua tempat, ekstrak ke fungsi/komponen yang bisa digunakan bersama.

**Pengecualian**: Duplikasi yang tidak disengaja lebih baik daripada abstraksi yang salah. Jangan abstraksi terlalu dini.

### 2.9 KISS — Keep It Simple, Stupid

Solusi paling sederhana yang memenuhi kebutuhan adalah yang terbaik. Jangan tambahkan kompleksitas untuk skenario yang belum terjadi.

**Implementasi**: Jika ada dua pendekatan, pilih yang paling sederhana.

### 2.10 YAGNI — You Aren't Gonna Need It

Jangan menulis kode untuk fitur yang "mungkin" dibutuhkan di masa depan. Tulis kode hanya untuk kebutuhan saat ini.

**Implementasi**: Jika tidak ada requirement sekarang, jangan tulis kodenya.

---

## 3. Teknologi

| Teknologi | Versi | Alasan |
|---|---|---|
| **HTML5** | - | Standar web. Semantic elements, form validation, history API |
| **CSS3** | - | Custom properties (variables), grid, flexbox, transitions |
| **Bootstrap 5** | 5.3.x | Grid responsif, komponen UI, utilities, konsistensi antar browser. Tidak perlu menulis ulang CSS umum |
| **Vanilla JavaScript** | ES2022+ | Tidak ada framework frontend. ES Modules, async/await, optional chaining, nullish coalescing |
| **IndexedDB** | (native) | Penyimpanan structured data di browser — satu-satunya opsi untuk data offline yang besar |
| **Dexie.js** | 4.x | Wrapper IndexedDB yang memberikan query API, versioning, migration, liveQuery |
| **PWA** | (standar) | manifest.json, service-worker.js, offline caching, installable |
| **Chart.js** | 4.x | Grafik penjualan dan laporan — ringan, responsif |
| **Bootstrap Icons** | 1.x | Icon set yang konsisten dengan Bootstrap. SVG inline |
| **SheetJS (xlsx)** | 0.20.x | Export/import Excel |
| **jsPDF** | 2.x | Generate PDF untuk laporan |
| **html5-qrcode** | 2.x | Scan QR code via kamera |
| **QuaggaJS** | - | Scan barcode 1D via kamera |

### 3.1 Larangan Teknologi

| Teknologi | Alasan |
|---|---|
| **React, Vue, Angular** | Overhead untuk aplikasi ini. Vanilla JS + ES Modules sudah cukup |
| **TypeScript** | Menambah kompleksitas build step. JSDoc sudah memberikan type hinting |
| **jQuery** | Bootstrap 5 sudah Vanilla JS. Tidak perlu jQuery |
| **Node.js / Express** | Aplikasi 100% client-side. Tidak ada server backend |
| **PHP / MySQL / Firebase** | Offline first. Semua data di IndexedDB |
| **localStorage** | Untuk data bisnis. Gunakan IndexedDB. localStorage hanya untuk preferensi (theme) |

---

## 4. Struktur Penamaan

### 4.1 Tabel Konvensi

| Elemen | Konvensi | Contoh | Keterangan |
|---|---|---|---|
| **Folder** | kebab-case | `product/`, `sales/`, `repositories/` | Semua huruf kecil, pisah dengan dash |
| **File JavaScript** | kebab-case | `product-service.js`, `sales-repository.js` | Deskriptif, akhiri dengan jenis modul |
| **File CSS** | kebab-case | `main.css`, `dark-mode.css`, `components.css` | - |
| **File HTML** | kebab-case | `index.html`, `offline.html` | - |
| **Variable** | camelCase | `productName`, `cartItems`, `isActive` | Kata pertama huruf kecil, kata berikutnya kapital |
| **Function** | camelCase | `calculateTotal()`, `getProductById()` | Awalan kata kerja (get, set, calculate, handle, render) |
| **Class** | PascalCase | `ProductRepository`, `SalesService` | Setiap kata diawali huruf kapital |
| **Constanta** | UPPER_SNAKE_CASE | `MAX_CART_ITEMS`, `DEFAULT_TAX_RATE` | Semua huruf kapital, pisah dengan underscore |
| **Enum** | UPPER_SNAKE_CASE | `SALE_STATUS.PAID`, `PAYMENT_METHOD.CASH` | Objek dengan property UPPER_SNAKE_CASE |
| **Export default** | kebab-case (file) | `export default productService` | Satu export default per file |
| **Custom Event** | kebab-case | `product:selected`, `cart:updated`, `sale:completed` | Gunakan namespace dengan colon |
| **CSS Class** | Bootstrap utility + custom | `btn btn-primary`, `product-card`, `cart-panel` | Bootstrap utility untuk umum, custom untuk spesifik |
| **Data Attribute** | kebab-case | `data-product-id`, `data-action="delete"` | - |

### 4.2 Awalan Fungsi yang Direkomendasikan

| Awalan | Aksi | Contoh |
|---|---|---|
| `get` | Mengambil data | `getProductById(id)` |
| `set` | Mengatur nilai | `setTheme(mode)` |
| `create` | Membuat baru | `createProduct(data)` |
| `update` | Memperbarui | `updateProduct(id, changes)` |
| `delete` | Menghapus | `deleteProduct(id)` |
| `handle` | Menangani event | `handleClick`, `handleSubmit` |
| `render` | Merender UI | `renderProductList(products)` |
| `calculate` | Perhitungan | `calculateTotal(items)` |
| `validate` | Validasi | `validateProductForm(data)` |
| `format` | Format data | `formatCurrency(amount)` |
| `is` / `has` | Boolean check | `isValid()`, `hasStock(productId)` |
| `to` | Konversi | `toCurrency(amount)` |

### 4.3 Nama File Berdasarkan Jenis

| Jenis | Akhiran | Contoh |
|---|---|---|
| Service | `-service.js` | `product-service.js` |
| Repository | `-repository.js` | `product-repository.js` |
| Component | `.js` | `app-button.js`, `product-card.js` |
| Page | `.js` | `pos-page.js`, `login-page.js` |
| Utility | `.js` | `currency-utils.js`, `date-utils.js` |
| Config | `.js` | `db-config.js`, `app-config.js` |
| Layout | `.js` | `app-layout.js`, `auth-layout.js` |

---

## 5. Struktur File

### 5.1 Struktur Umum File JavaScript

Setiap file JavaScript mengikuti urutan berikut:

```
// ============================================================
// [Nama Modul] — [Deskripsi singkat tujuan file]
// ============================================================

// --- 1. Import ---
import { formatCurrency } from '../utils/currency-utils.js';
import { ProductRepository } from '../repositories/product-repository.js';

// --- 2. Konstanta ---
const DEFAULT_PAGE_SIZE = 50;
const SORT_DIRECTIONS = { ASC: 'asc', DESC: 'desc' };

// --- 3. Class / Fungsi Utama ---
export class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getAll(filter = {}) {
    // ...
  }
}

// --- 4. Helper (private — tidak di-export) ---
function mapToResponse(product) {
  return {
    id: product.id,
    name: product.name,
    price: formatCurrency(product.sellPrice),
  };
}

// --- 5. Export (jika bukan class) ---
// (sudah di export di atas)
```

### 5.2 Struktur File Halaman (Page)

```
// ============================================================
// [Nama Page] — [Deskripsi]
// Route: /products
// ============================================================

import { ProductService } from '../../services/product-service.js';
import { AppTable } from '../../components/app-table.js';
// ...

const productService = new ProductService();

// --- State ---
let state = {
  products: [],
  filter: { search: '', categoryId: null },
  pagination: { page: 1, limit: 50, total: 0 },
  loading: false,
};

// --- Init ---
export async function init(container) {
  renderLayout(container);
  await loadProducts();
  attachEvents();
}

// --- Render ---
function renderLayout(container) {
  container.innerHTML = `...`;
}

// --- Data ---
async function loadProducts() {
  state.loading = true;
  // ...
}

// --- Events ---
function attachEvents() {
  // ...
}
```

### 5.3 Struktur File Komponen

```
// ============================================================
// ProductCard — Komponen kartu produk untuk POS grid
// ============================================================

import { formatCurrency } from '../../utils/currency-utils.js';

// --- Props ---
// { product: { id, name, sellPrice, stock, image }, onAdd: (product) => void }

// --- Render ---
export function render(product, onAdd) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__image">...</div>
    <div class="product-card__info">
      <p class="product-card__name">${product.name}</p>
      <p class="product-card__price">${formatCurrency(product.sellPrice)}</p>
    </div>
    <button class="btn btn-primary btn-sm" data-action="add">
      + Tambah
    </button>
  `;

  card.querySelector('[data-action="add"]')
    .addEventListener('click', () => onAdd(product));

  return card;
}
```

---

## 6. Standar JavaScript

### 6.1 Variable Declaration

```js
// ✅ BENAR
const productName = 'Kopi Arabika';
let cartItems = [];
const TAX_RATE = 0.11;

// ❌ SALAH
var productName = 'Kopi Arabika';  // hindari var
product_name = 'Kopi Arabika';     // snake_case bukan untuk variabel
```

### 6.2 Equality

```js
// ✅ BENAR
if (status === 'PAID') { }
if (count !== 0) { }

// ❌ SALAH
if (status == 'PAID') { }     // loose equality
if (count != 0) { }           // loose inequality
```

### 6.3 Optional Chaining & Nullish Coalescing

```js
// ✅ BENAR
const customerName = sale?.customer?.name ?? 'Umum';
const count = inventory?.quantity ?? 0;

// ❌ SALAH
const customerName = sale && sale.customer && sale.customer.name ? sale.customer.name : 'Umum';
const count = inventory ? inventory.quantity : 0;
```

### 6.4 Template Literals

```js
// ✅ BENAR
const message = `Produk ${productName} seharga ${formatCurrency(price)}`;
const url = `/products/${productId}/edit`;

// ❌ SALAH
const message = 'Produk ' + productName + ' seharga ' + formatCurrency(price);
```

### 6.5 Arrow Functions

```js
// ✅ — callback pendek
const total = items.reduce((sum, item) => sum + item.subtotal, 0);
const activeProducts = products.filter(p => p.isActive);

// ✅ — function declaration untuk top-level
export async function getProductById(id) { }

// ❌ — jangan arrow function untuk method object
const obj = {
  getName: () => this.name,  // this tidak mengacu ke obj
};
```

### 6.6 Destructuring

```js
// ✅ — function parameter
function formatProduct({ name, sellPrice, sku }) { }

// ✅ — assignment
const { id, name } = product;
const [first, ...rest] = items;
```

### 6.7 Async/Await

```js
// ✅ BENAR
export async function createProduct(data) {
  try {
    const validated = validateProductData(data);
    const result = await productRepository.create(validated);
    await auditService.log('CREATE', 'product', result.id);
    return result;
  } catch (error) {
    console.error('[ProductService] Gagal membuat produk:', error);
    throw error;
  }
}

// ❌ SALAH — Promise chain tanpa need
export function createProduct(data) {
  return validateProductData(data)
    .then(validated => productRepository.create(validated))
    .then(result => auditService.log('CREATE', 'product', result.id));
}
```

### 6.8 Array Methods

```js
// ✅ — pilih yang tepat
products.filter(p => p.isActive);
products.find(p => p.id === id);
products.some(p => p.stock < p.minStock);
products.map(p => ({ ...p, price: formatCurrency(p.sellPrice) }));
products.sort((a, b) => a.name.localeCompare(b.name));
```

### 6.9 Spread & Rest

```js
// ✅ — copy object dengan perubahan
const updated = { ...product, sellPrice: 15000 };

// ✅ — merge default + override
const options = { ...defaultOptions, ...userOptions };

// ✅ — rest parameter
function formatProducts(...products) {
  return products.map(formatProduct);
}
```

### 6.10 Module Pattern

```js
// ✅ — ES Modules
// file: services/product-service.js
export class ProductService { }
export function formatProduct() { }

// file lain
import { ProductService, formatProduct } from '../services/product-service.js';

// ❌ — IIFE / global namespace
window.ProductService = function() { };
```

---

## 7. Penanganan Error

### 7.1 Try/Catch

Setiap operasi async yang bisa gagal (terutama akses database) **wajib** dibungkus try/catch.

```js
export async function getProductById(id) {
  try {
    const product = await productRepository.getById(id);
    if (!product) {
      throw new NotFoundError(`Produk dengan id ${id} tidak ditemukan`);
    }
    return product;
  } catch (error) {
    console.error(`[ProductService] Gagal mengambil produk ${id}:`, error);
    throw error; // lempar ke caller untuk di-handle UI
  }
}
```

### 7.2 Custom Error Classes

```js
// utils/errors.js
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(errors) {
    super('Validasi gagal', 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors; // array of { field, message }
  }
}

export class BusinessRuleError extends AppError {
  constructor(message, ruleId) {
    super(message, 'BUSINESS_RULE');
    this.name = 'BusinessRuleError';
    this.ruleId = ruleId; // BR-XXX
  }
}
```

### 7.3 Error di Layer UI

```js
// UI Layer bertanggung jawab menampilkan error ke user
try {
  await productService.createProduct(formData);
  showToast('Produk berhasil ditambahkan', 'success');
  closeModal();
  await loadProducts();
} catch (error) {
  if (error instanceof ValidationError) {
    showValidationErrors(error.errors);
  } else if (error instanceof BusinessRuleError) {
    showToast(error.message, 'warning');
  } else {
    showToast('Terjadi kesalahan. Coba lagi.', 'error');
    console.error('[ProductPage] Error:', error);
  }
}
```

### 7.4 Error yang Harus Ditampilkan ke User

| Tipe Error | Tampilkan | Contoh |
|---|---|---|
| Validation | Pesan field spesifik | "SKU sudah digunakan" |
| Business Rule | Toast/Alert dengan pesan jelas | "Tidak bisa void transaksi yang sudah di-refund" |
| Database | Toast "Terjadi kesalahan. Coba lagi." | (log detail ke console) |
| Network/Offline | Tidak ada (offline first) | - |

---

## 8. Struktur Modul

### 8.1 Layer Architecture

```
┌─────────────────────────────────────────────┐
│              UI LAYER                        │
│  pages/         — halaman aplikasi           │
│  components/    — komponen UI reusable       │
│  layouts/       — layout template            │
├─────────────────────────────────────────────┤
│             SERVICE LAYER                    │
│  services/      — business logic             │
├─────────────────────────────────────────────┤
│           REPOSITORY LAYER                   │
│  repositories/  — akses database             │
├─────────────────────────────────────────────┤
│           DATABASE LAYER                     │
│  db/            — Dexie setup, schema        │
├─────────────────────────────────────────────┤
│             UTILITY LAYER                    │
│  utils/         — fungsi bantuan             │
└─────────────────────────────────────────────┘
```

### 8.2 Tanggung Jawab Setiap Layer

| Layer | Tanggung Jawab | Boleh Akses | Contoh |
|---|---|---|---|
| **Page** | Render halaman, event handling, routing | Component, Service | `pos-page.js`, `login-page.js` |
| **Component** | Render UI, event internal, props | Utility | `app-button.js`, `product-card.js` |
| **Service** | Business logic, validasi, koordinasi antar repository | Repository, Utility | `product-service.js` |
| **Repository** | Query IndexedDB, CRUD | Database (Dexie) | `product-repository.js` |
| **Database** | Schema, migration, koneksi Dexie | - | `db.js`, `schema.js` |
| **Utility** | Fungsi bantuan murni (format, hitung) | - | `currency-utils.js` |

### 8.3 Aturan Layer

```
❌ UI Layer → langsung akses IndexedDB
❌ Service Layer → manipulasi DOM
❌ Repository Layer → business logic
❌ Utility Layer → side effect

✅ UI Layer → Service Layer → Repository Layer → IndexedDB
✅ Service Layer → panggil Repository, validasi, audit
```

---

## 9. Standar HTML

### 9.1 Semantic HTML

```html
<!-- ✅ BENAR -->
<header role="banner">
  <nav role="navigation" aria-label="Navigasi utama">...</nav>
</header>
<main role="main">
  <h1>Daftar Produk</h1>
  <section aria-labelledby="product-list">
    <table role="table" aria-label="Daftar produk">...</table>
  </section>
</main>
<footer role="contentinfo">...</footer>

<!-- ❌ SALAH -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="title">Daftar Produk</div>
  <div class="table">...</div>
</div>
```

### 9.2 Heading Hierarchy

```html
<!-- ✅ — h1 > h2 > h3, tidak ada yang dilewati -->
<h1>POS Offline</h1>
  <h2>Daftar Produk</h2>
    <h3>Filter</h3>
    <h3>Data Produk</h3>

<!-- ❌ — lompat dari h1 ke h4 -->
<h1>POS Offline</h1>
  <h4>Filter</h4>
```

### 9.3 Form

```html
<!-- ✅ — label eksplisit, aria-required -->
<div class="mb-3">
  <label for="product-name" class="form-label">
    Nama Produk <span class="text-danger" aria-hidden="true">*</span>
  </label>
  <input
    id="product-name"
    name="productName"
    class="form-control"
    required
    aria-required="true"
    maxlength="100"
  />
  <div class="invalid-feedback" id="product-name-error" role="alert">
    Nama produk wajib diisi
  </div>
</div>
```

### 9.4 Button

```html
<!-- ✅ — type eksplisit -->
<button type="button" class="btn btn-primary" data-action="save">Simpan</button>
<button type="submit" class="btn btn-primary">Simpan</button>

<!-- ❌ — tanpa type, bisa submit form tidak sengaja -->
<button class="btn btn-primary">Simpan</button>
```

### 9.5 Table

```html
<!-- ✅ — semantic, scope di header -->
<table class="table" aria-label="Daftar produk">
  <thead>
    <tr>
      <th scope="col">SKU</th>
      <th scope="col">Nama</th>
      <th scope="col">Harga</th>
      <th scope="col">Aksi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>KD-001</td>
      <td>Kopi Arabika</td>
      <td class="text-end">Rp 25.000</td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-primary"
                data-action="edit" aria-label="Edit Kopi Arabika">
          Edit
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 10. Standar CSS

### 10.1 Bootstrap First

Gunakan Bootstrap utility classes sebanyak mungkin sebelum menulis custom CSS.

```html
<!-- ✅ — Bootstrap utility -->
<div class="d-flex align-items-center gap-2 p-3 bg-white rounded shadow-sm">
  <i class="bi bi-box text-primary fs-4"></i>
  <div>
    <p class="fw-bold mb-0">Kopi Arabika</p>
    <small class="text-muted">SKU: KD-001</small>
  </div>
</div>
```

### 10.2 Custom CSS

Jika Bootstrap tidak mencukupi, gunakan CSS class dengan pola:

```
{kategori}__{elemen}--{variant}
```

```css
/* ✅ — custom CSS hanya jika Bootstrap tidak cukup */
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card__price {
  color: var(--bs-primary);
  font-weight: 700;
}
```

### 10.3 CSS Custom Properties

```css
/* ✅ — gunakan CSS variables untuk konsistensi */
:root {
  --sidebar-width: 260px;
  --topbar-height: 56px;
  --transition-fast: 0.2s ease;
}

/* ❌ — hardcoded value yang tidak konsisten */
.sidebar {
  width: 260px;
}
```

### 10.4 Larangan CSS

```css
/* ❌ — inline style (di HTML) */
<div style="color: blue; margin-top: 10px;">...</div>

/* ❌ — !important tanpa alasan */
.product-card {
  color: blue !important;
}

/* ❌ — ID selector untuk styling */
#product-list { }

/* ❌ — nesting berlebihan (CSS biasa, bukan preprocessor) */
.product-card .product-card__info .product-card__name { }
```

---

## 11. Standar Komentar

### 11.1 Kapan Komentar Diperlukan

```js
// ✅ — Logika kompleks yang perlu penjelasan
// Hitung prorata diskon: setiap item mendapat diskon
// proporsional berdasarkan subtotal item / subtotal total
function calculateProRataDiscount(items, discountTotal) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  return items.map(item => ({
    ...item,
    discount: (item.subtotal / subtotal) * discountTotal,
  }));
}

// ✅ — Keputusan desain
// Gunakan Map instead of Object karena iterasi lebih cepat
// untuk data > 1000 items
const productMap = new Map();

// ✅ — Workaround (dengan referensi issue)
// TODO(v2.0): Ganti dengan library resmi QRIS
// Saat ini menggunakan QR statis karena offline mode
```

### 11.2 Kapan Komentar Tidak Diperlukan

```js
// ❌ — Komentar yang mengulang kode
// Set tax rate ke 0.11
const taxRate = 0.11;

// ❌ — Komentar yang jelas dari kode
// Panggil fungsi untuk menghitung total
const total = calculateTotal(items);

// ❌ — Komentar usang
// Dulu pake API, sekarang IndexedDB — komentar tidak diperbarui
```

### 11.3 JSDoc — Wajib untuk Semua Fungsi Export

```js
/**
 * Mengambil daftar produk dengan filter dan pagination.
 *
 * @param {Object} options
 * @param {string} [options.search] - Kata kunci pencarian (nama, SKU)
 * @param {string} [options.categoryId] - Filter kategori
 * @param {number} [options.page=1] - Halaman
 * @param {number} [options.limit=50] - Item per halaman
 * @param {string} [options.sortBy='name'] - Field sorting
 * @param {'asc'|'desc'} [options.sortDir='asc'] - Arah sorting
 * @returns {Promise<{data: Array, total: number}>}
 * @throws {ValidationError} - Jika parameter tidak valid
 */
export async function getProducts(options = {}) {
  // ...
}
```

```js
/**
 * @typedef {Object} ProductData
 * @property {string} name - Nama produk
 * @property {string} sku - SKU unik
 * @property {number} sellPrice - Harga jual
 */
```

---

## 12. Logging

### 12.1 Level Logging

| Level | Prefix | Penggunaan | Contoh |
|---|---|---|---|
| **INFO** | `[INFO]` | Informasi operasi normal | Produk dibuat, backup selesai |
| **WARN** | `[WARN]` | Kondisi tidak ideal tapi tidak error | Stok menipis, setting tidak ditemukan |
| **ERROR** | `[ERROR]` | Error yang menghentikan operasi | Gagal query DB, exception tidak terhandle |
| **DEBUG** | `[DEBUG]` | Informasi untuk debugging (development only) | Data yang dikirim, response query |

### 12.2 Format

```js
// ✅ — Format konsisten
console.info('[ProductService] Produk dibuat:', { id: result.id, name: result.name });
console.warn('[Inventory] Stok menipis:', { productId, stock, minStock });
console.error('[ProductService] Gagal mengambil produk:', error);

// ❌ — Format tidak konsisten
console.log('produk dibuat'); // tidak ada prefix
console.log(stock);           // tidak ada konteks
```

### 12.3 Kapan Menggunakan

```js
// ✅ — INFO: operasi berhasil
console.info(`[ProductService] Produk ${data.name} (${result.id}) berhasil dibuat`);

// ✅ — WARN: kondisi tidak ideal
if (product.quantity <= product.minStock) {
  console.warn(`[Inventory] Stok ${product.name} menipis: ${product.quantity}/${product.minStock}`);
}

// ✅ — ERROR: operasi gagal
try {
  // ...
} catch (error) {
  console.error(`[ProductService] Gagal menyimpan produk ${data?.name}:`, error);
}

// ✅ — DEBUG: detail untuk troubleshooting (hapus sebelum production)
console.debug('[ProductService] Data yang dikirim:', JSON.stringify(data));
```

### 12.4 Larangan Logging

```js
// ❌ — Logging data sensitif
console.log('Password:', password);

// ❌ — Logging berlebihan di production
console.log('Loop iteration:', i);

// ❌ — console.log tanpa konteks (di production)
console.log(total);
```

---

## 13. Validasi

### 13.1 Layer Validasi

| Layer | Jenis Validasi | Contoh |
|---|---|---|
| **UI (HTML)** | Attribute HTML5 | `required`, `maxlength`, `type="number"`, `pattern` |
| **UI (JavaScript)** | Form-level, feedback instan | Format input, disable tombol |
| **Service** | Business rules, format data | BR-021 (SKU unik), BR-024 (soft delete) |
| **Repository** | Schema constraint, referential integrity | Unique index, foreign key |

### 13.2 Validasi di Service Layer

```js
export async function createProduct(data) {
  // Validasi field wajib
  const errors = [];
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Nama produk wajib diisi' });
  }
  if (!data.sku?.trim()) {
    errors.push({ field: 'sku', message: 'SKU wajib diisi' });
  }
  if (data.sellPrice == null || data.sellPrice < 0) {
    errors.push({ field: 'sellPrice', message: 'Harga jual harus >= 0' });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  // Business rules
  const existing = await this.repository.getBySku(data.sku);
  if (existing) {
    throw new BusinessRuleError('SKU sudah digunakan', 'BR-021');
  }

  // Simpan
  return this.repository.create(data);
}
```

### 13.3 Validasi di UI Layer

```js
function validateProductForm(formData) {
  let isValid = true;

  if (!formData.name.trim()) {
    showFieldError('name', 'Nama produk wajib diisi');
    isValid = false;
  }

  if (formData.sellPrice < 0) {
    showFieldError('sellPrice', 'Harga jual tidak boleh negatif');
    isValid = false;
  }

  return isValid;
}
```

---

## 14. Performance

### 14.1 Aturan Performa

| # | Aturan | Alasan |
|---|---|---|
| 1 | **Gunakan Dexie index** untuk semua field yang di-query | Query tanpa index = scan seluruh tabel |
| 2 | **Pagination di semua list** — max 50 items per halaman | Render ribuan item akan lambat |
| 3 | **Debounce search** — 300ms | Mencegah query berulang saat user mengetik |
| 4 | **Lazy loading library berat** — Chart.js, jsPDF, SheetJS | Bundle size > 500KB akan memperlambat cold start |
| 5 | **Event delegation** untuk elemen dinamis | Hindari attach event per item |
| 6 | **Hindari DOM query berulang** — cache reference | `document.querySelector` di loop sangat lambat |
| 7 | **Batch IndexedDB operation** — `bulkAdd`, `bulkDelete` | Operasi per-item lambat untuk data banyak |
| 8 | **Batasi data laporan** — default 30 hari | Agregasi data > 1 tahun bisa lambat |

### 14.2 Contoh

```js
// ✅ — Debounce search
let searchTimeout;
function onSearch(keyword) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadProducts({ search: keyword });
  }, 300);
}

// ✅ — Event delegation
container.addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  if (action === 'edit') handleEdit(actionEl.dataset.productId);
  if (action === 'delete') handleDelete(actionEl.dataset.productId);
});

// ❌ — Attach event per item (lambat)
products.forEach(product => {
  const button = document.getElementById(`edit-${product.id}`);
  button.addEventListener('click', () => handleEdit(product.id));
});

// ✅ — Lazy loading Chart.js
async function renderChart() {
  const { Chart, registerables } = await import('https://cdn.jsdelivr.net/npm/chart.js');
  Chart.register(...registerables);
  new Chart(ctx, { /* ... */ });
}

// ✅ — Batch operation
export async function bulkImport(products) {
  await db.transaction('rw', db.products, async () => {
    await db.products.bulkAdd(products);
  });
}
```

---

## 15. Keamanan

### 15.1 Aturan Keamanan

| # | Aturan | Contoh |
|---|---|---|
| 1 | **Hash password** — SHA-256 via Web Crypto API | Jangan simpan plain text |
| 2 | **Validasi semua input** — di service layer | Jangan percaya input dari UI |
| 3 | **Jangan eval()** — dilarang keras | `eval(response)` tidak pernah diizinkan |
| 4 | **Sanitasi sebelum simpan** — trim string, Number untuk angka | `data.name.trim()` |
| 5 | **Jangan simpan data sensitif tanpa proteksi** | Password, PIN harus di-hash |
| 6 | **Permission check** — cek role di setiap aksi | Hanya Admin bisa hapus produk |
| 7 | **Konfirmasi aksi destruktif** | Hapus, void, refund wajib konfirmasi |
| 8 | **Audit log** — semua perubahan kritis | Siapa, kapan, apa yang berubah |

### 15.2 Password Hashing

```js
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 15.3 Permission Check

```js
export function requirePermission(action, module) {
  const user = getCurrentUser();
  if (!user) throw new BusinessRuleError('Silakan login terlebih dahulu', 'BR-180');

  // Admin memiliki semua akses
  if (user.role === 'Admin') return;

  // Cek permission
  const hasPermission = permissionService.check(user.roleId, module, action);
  if (!hasPermission) {
    console.warn(`[Security] User ${user.username} mencoba ${action} ${module} tanpa izin`);
    throw new BusinessRuleError('Anda tidak memiliki izin untuk aksi ini', 'BR-189');
  }
}
```

---

## 16. Struktur Event

### 16.1 Event Naming Convention

Gunakan namespace dengan colon untuk custom events:

```
{modul}:{aksi}
```

| Event | Trigger | Data |
|---|---|---|
| `product:selected` | Klik produk di POS | `{ productId, name, price }` |
| `cart:updated` | Perubahan cart | `{ items, subtotal, total }` |
| `sale:completed` | Transaksi selesai | `{ invoiceNumber, grandTotal }` |
| `shift:opened` | Shift dibuka | `{ shiftId, userId }` |
| `shift:closed` | Shift ditutup | `{ shiftId, difference }` |
| `backup:completed` | Backup selesai | `{ fileName, fileSize }` |
| `theme:changed` | Tema berubah | `{ theme: 'light' | 'dark' }` |

### 16.2 Custom Event Dispatch

```js
// ✅ — Dispatch custom event
export function dispatchCartUpdated(cart) {
  const event = new CustomEvent('cart:updated', {
    detail: { items: cart.items, subtotal: cart.subtotal, total: cart.grandTotal },
    bubbles: true,
  });
  document.dispatchEvent(event);
}

// ✅ — Listen
document.addEventListener('cart:updated', (e) => {
  updateCartBadge(e.detail.items.length);
  updateTotalDisplay(e.detail.total);
});
```

### 16.3 Event Handler Pattern

```js
// ✅ — Handler function dengan nama jelas
function handleAddToCart(productId) { }
function handleQuantityChange(productId, newQty) { }
function handleCheckout() { }

// ✅ — Event map untuk organisasi
const eventHandlers = {
  'click': {
    '[data-action="add-to-cart"]': (e) => {
      const productId = e.target.closest('[data-product-id]').dataset.productId;
      handleAddToCart(productId);
    },
    '[data-action="checkout"]': handleCheckout,
  },
  'change': {
    '#quantity-input': (e) => handleQuantityChange(e.target.dataset.productId, +e.target.value),
  },
};

function setupEventListeners(container, handlers) {
  for (const [eventType, actions] of Object.entries(handlers)) {
    for (const [selector, handler] of Object.entries(actions)) {
      container.addEventListener(eventType, (e) => {
        const target = e.target.closest(selector);
        if (target) handler(e);
      });
    }
  }
}
```

---

## 17. Struktur Database

### 17.1 Akses Database

```
❌ UI Layer → db.products.get(id)
❌ Component → db.transaction('rw', db.products, ...)

✅ UI → Service → Repository → db
✅ Component → Utility (data sudah diformat oleh Service)
```

### 17.2 Repository Pattern

Setiap entitas memiliki repository sendiri yang menjadi **satu-satunya** akses ke tabel terkait.

```js
// repositories/product-repository.js
export class ProductRepository {
  async getAll(options = {}) {
    const { search, categoryId, page = 1, limit = 50, sortBy = 'name', sortDir = 'asc' } = options;

    let collection = db.products
      .filter(p => !p.deletedAt); // soft delete filter

    if (categoryId) {
      collection = collection.filter(p => p.categoryId === categoryId);
    }

    if (search) {
      const keyword = search.toLowerCase();
      collection = collection.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.sku.toLowerCase().includes(keyword)
      );
    }

    const total = await collection.count();
    const data = await collection
      .offset((page - 1) * limit)
      .limit(limit)
      .toArray();

    return { data, total };
  }

  async getById(id) {
    return db.products.get(id);
  }

  async getBySku(sku) {
    return db.products.where('sku').equals(sku).first();
  }

  async create(data) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { id, ...data, createdAt: now, updatedAt: now };
    await db.products.add(record);
    return record;
  }

  async update(id, changes) {
    const updated = { ...changes, updatedAt: new Date().toISOString() };
    await db.products.update(id, updated);
    return id;
  }

  async delete(id) {
    // Soft delete
    await db.products.update(id, { deletedAt: new Date().toISOString() });
  }

  async hardDelete(id) {
    await db.products.delete(id);
  }
}
```

### 17.3 Transaction

Operasi yang melibatkan lebih dari satu tabel **wajib** menggunakan Dexie transaction.

```js
export async function processSale(saleData) {
  await db.transaction('rw', db.sales, db.saleItems, db.inventories, db.stockMovements, async () => {
    const saleId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 1. Buat sale
    await db.sales.add({ id: saleId, ...saleData, createdAt: now });

    // 2. Buat sale items
    const items = saleData.items.map(item => ({
      id: crypto.randomUUID(),
      saleId,
      ...item,
    }));
    await db.saleItems.bulkAdd(items);

    // 3. Kurangi stok
    for (const item of items) {
      const inventory = await db.inventories.get(item.productId);
      const quantityBefore = inventory?.quantity ?? 0;
      const quantityAfter = quantityBefore - item.quantity;

      await db.inventories.put({ productId: item.productId, quantity: quantityAfter });

      // 4. Catat stock movement
      await db.stockMovements.add({
        id: crypto.randomUUID(),
        productId: item.productId,
        type: 'SALE',
        referenceType: 'sale',
        referenceId: saleId,
        quantityBefore,
        quantityChange: -item.quantity,
        quantityAfter,
        userId: saleData.userId,
        createdAt: now,
      });
    }
  });
}
```

---

## 18. Standar UI

### 18.1 Konsistensi dengan UI Design System

Semua implementasi UI harus mengacu pada `04_UI_DESIGN_SYSTEM.md`:

| Aspek | Token | Contoh |
|---|---|---|
| Warna | `--color-primary-500`, `--color-danger-500` | Tombol simpan = primary, hapus = danger |
| Font | `Inter, system-ui, sans-serif` | Body dan heading |
| Spacing | Bootstrap spacing scale | `p-3`, `gap-2`, `mb-4` |
| Radius | `rounded`, `rounded-md`, `rounded-lg` | Card = rounded, modal = rounded-md |
| Shadow | `shadow-sm`, `shadow-md`, `shadow-lg` | Card = shadow-sm, modal = shadow-lg |

### 18.2 Konsistensi dengan Component Library

Semua komponen UI harus menggunakan komponen dari `05_COMPONENT_LIBRARY.md`:

```js
// ✅ — Gunakan komponen dari library
import { renderAppButton } from '../components/app-button.js';
import { renderAppTable } from '../components/app-table.js';
import { renderAppModal } from '../components/app-modal.js';

// ❌ — Buat button sendiri di page
<button class="my-custom-button">Simpan</button>
```

### 18.3 Theme Support

Semua komponen harus mendukung light dan dark mode via CSS variables:

```css
/* ✅ — Pakai CSS variables yang berubah sesuai theme */
.card {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-color: var(--bs-border-color);
}
```

---

## 19. Dokumentasi Kode

### 19.1 Header File

Setiap file JavaScript harus memiliki header singkat:

```js
// ============================================================
// ProductService — Business logic untuk manajemen produk
// Dependencies: ProductRepository, AuditService
// ============================================================
```

### 19.2 JSDoc untuk Semua Fungsi Export

```js
/**
 * Menghitung grand total transaksi setelah diskon dan pajak.
 *
 * @param {Array<{subtotal: number, discount: number}>} items - Item dalam transaksi
 * @param {number} transactionDiscount - Diskon transaksi (nominal)
 * @param {number} taxRate - Tarif pajak dalam persen (0-100)
 * @returns {{ subtotal: number, discountTotal: number, taxableAmount: number, taxTotal: number, grandTotal: number }}
 */
export function calculateGrandTotal(items, transactionDiscount, taxRate) {
  // ...
}
```

### 19.3 Komentar untuk Logika Kompleks

```js
// Strategi: Hitung ulang stok berdasarkan semua stockMovement
// (bukan menyimpan nilai stok terpisah) untuk memastikan
// tidak ada inkonsistensi antara stok dan movement history.
async function recalculateStock(productId) {
  const movements = await db.stockMovements
    .where('productId').equals(productId)
    .toArray();

  return movements.reduce((sum, m) => sum + m.quantityChange, 0);
}
```

---

## 20. Anti Pattern

### 20.1 God Function

```js
// ❌ — Fungsi melakukan terlalu banyak hal
function processSale(cart, customer, payment, discount, tax) {
  // validasi
  // hitung total
  // simpan sale
  // simpan items
  // kurangi stok
  // catat cash flow
  // update dashboard
  // kirim notifikasi
  // cetak struk
}

// ✅ — Dipisah per tanggung jawab
async function processSale(cart, paymentInfo) {
  const saleData = await salesService.createSale(cart, paymentInfo);
  await inventoryService.deductStock(cart.items);
  await financeService.recordCashFlow(saleData);
  await dashboardService.refresh();
}
```

### 2.0.2 Magic Number

```js
// ❌ — Angka tanpa konteks
if (items.length > 50) { }

// ✅ — Konstanta jelas
const MAX_CART_ITEMS = 50;
if (items.length > MAX_CART_ITEMS) { }
```

### 2.0.3 Hardcoded String

```js
// ❌ — String berulang tanpa konstanta
if (status === 'PAID') { }
if (status === 'PAID') { }

// ✅ — Enum atau konstanta
export const SALE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  VOID: 'VOID',
  REFUNDED: 'REFUNDED',
};

if (status === SALE_STATUS.PAID) { }
```

### 2.0.4 Duplikasi Kode

```js
// ❌ — Format currency di dua tempat
// di cart
const formattedPrice = `Rp ${price.toLocaleString('id-ID')}`;
// di report
const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

// ✅ — Satu fungsi, dipakai di mana saja
// utils/currency-utils.js
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

### 2.0.5 Callback Nesting

```js
// ❌ — Callback hell
getProduct(id, product => {
  getCustomer(product.customerId, customer => {
    calculateDiscount(product, customer, discount => {
      // ...
    });
  });
});

// ✅ — Async/await
async function process() {
  const product = await getProduct(id);
  const customer = await getCustomer(product.customerId);
  const discount = await calculateDiscount(product, customer);
}
```

### 2.0.6 Mutasi Data Tidak Terkontrol

```js
// ❌ — Mutasi langsung
product.name = 'Nama Baru';
productService.update(product);

// ✅ — Immutable update
const changes = { name: 'Nama Baru' };
productService.update(product.id, changes);
```

### 2.0.7 Inline Event & Inline Style

```js
// ❌ — Inline event
<button onclick="handleClick()">Klik</button>

// ❌ — Inline style
<div style="margin-top: 10px; color: blue;">...</div>
```

---

## 21. Code Review Checklist

### 21.1 Checklist Sebelum Kode Dianggap Selesai

| # | Item | Cek |
|---|---|---|
| **Konsistensi** | | |
| 1 | Kode mengikuti standar penamaan (section 4)? | ☐ |
| 2 | Struktur file sesuai aturan (section 5)? | ☐ |
| 3 | Menggunakan komponen dari `05_COMPONENT_LIBRARY.md`? | ☐ |
| 4 | Mengikuti token desain dari `04_UI_DESIGN_SYSTEM.md`? | ☐ |
| 5 | Business rules terimplementasi dengan benar? | ☐ |
| **Kualitas** | | |
| 6 | Tidak ada duplikasi kode? | ☐ |
| 7 | Tidak ada magic number atau hardcoded string? | ☐ |
| 8 | Fungsi tidak terlalu panjang (< 50 baris per fungsi)? | ☐ |
| 9 | Mudah dibaca (nama jelas, logika sederhana)? | ☐ |
| 10 | Mudah diuji (fungsi murni, dependensi injection)? | ☐ |
| 11 | Tidak ada TODO/FIXME/HACK? | ☐ |
| **Teknis** | | |
| 12 | Tidak ada error linting? | ☐ |
| 13 | Error handling (try/catch) untuk operasi async? | ☐ |
| 14 | Loading state untuk setiap operasi async? | ☐ |
| 15 | Tidak ada inline style atau inline event? | ☐ |
| 16 | ES Modules (import/export) bukan global? | ☐ |
| 17 | JSDoc pada semua fungsi export? | ☐ |
| **UI** | | |
| 18 | Responsive (mobile, tablet, desktop)? | ☐ |
| 19 | Touch target >= 44x44px? | ☐ |
| 20 | Focus indicator visible? | ☐ |
| 21 | Label pada semua form input? | ☐ |
| **Data** | | |
| 22 | Akses database melalui Repository (bukan langsung)? | ☐ |
| 23 | Transaction untuk multi-table operation? | ☐ |
| 24 | Validasi input di service layer? | ☐ |
| **Performa** | | |
| 25 | Query menggunakan Dexie index? | ☐ |
| 26 | Pagination untuk list data? | ☐ |
| 27 | Debounce untuk search? | ☐ |

---

## 22. Refactoring

### 22.1 Kapan Refactor Diperlukan

| Kondisi | Tindakan | Contoh |
|---|---|---|
| Fungsi > 50 baris | Pecah menjadi beberapa fungsi | Pisah validasi, logic, dan formatting |
| Kode duplikat > 3 kali | Ekstrak ke fungsi/komponen reusable | Buat utility function atau service method |
| Nama tidak jelas | Rename variable/fungsi | `data` → `productData`, `doSomething` → `calculateTotal` |
| Fungsi punya > 3 parameter | Gunakan object parameter | `function create(format, data, opt1, opt2)` → `function create({ format, data, options })` |
| Kompleksitas tinggi (banyak if bersarang) | Sederhanakan dengan early return atau guard clause | `if (!valid) return;` |
| Sulit di-test | Ekstrak logic ke service | Pisahkan DOM manipulation dari business logic |

### 22.2 Refactor Guidelines

```js
// ❌ — Sebelum: fungsi panjang, banyak tanggung jawab
function saveProduct(formData) {
  // validasi (10 baris)
  // format data (5 baris)
  // simpan ke DB (10 baris)
  // audit (5 baris)
  // render ulang list (10 baris)
}

// ✅ — Sesudah: dipisah per tanggung jawab
function saveProduct(formData) {
  const validated = validateProductForm(formData);
  const formatted = formatProductData(validated);
  const result = await productService.create(formatted);
  await renderProductList();
  showToast('Produk berhasil ditambahkan', 'success');
  return result;
}
```

### 22.3 Aturan Refactor

| # | Aturan |
|---|---|
| 1 | **Jangan refactor dan tambah fitur dalam satu perubahan** — pisahkan |
| 2 | **Jangan refactor tanpa test** — pastikan perilaku tidak berubah |
| 3 | **Satu refactor per commit** — memudahkan review |
| 4 | **Dokumentasi diperbarui** jika API publik berubah |

---

## 23. Definition of Done

Kode dianggap **selesai** jika memenuhi semua kriteria berikut:

### 23.1 Kriteria Wajib

| # | Kriteria | Check |
|---|---|---|
| 1 | Sesuai dengan `01_PROJECT_BLUEPRINT.md` (arsitektur, struktur folder) | ☐ |
| 2 | Mengikuti Coding Standard (dokumen ini) | ☐ |
| 3 | Business rules dari `03_BUSINESS_RULES.md` terimplementasi | ☐ |
| 4 | Tidak menghasilkan error di console browser | ☐ |
| 5 | Mudah dipelihara (single responsibility, nama jelas) | ☐ |

### 23.2 Kriteria Teknis

| # | Kriteria | Check |
|---|---|---|
| 6 | ES Modules, const/let, async/await | ☐ |
| 7 | JSDoc pada semua fungsi export | ☐ |
| 8 | Error handling (try/catch) | ☐ |
| 9 | Tidak ada inline style / inline event | ☐ |
| 10 | Tidak ada TODO/FIXME | ☐ |
| 11 | Tidak ada global variable | ☐ |
| 12 | Tidak ada magic number | ☐ |

### 23.3 Kriteria Fungsional

| # | Kriteria | Check |
|---|---|---|
| 13 | Input validation berfungsi | ☐ |
| 14 | Loading state ditampilkan saat operasi async | ☐ |
| 15 | Error state ditampilkan jika gagal | ☐ |
| 16 | Empty state ditampilkan jika tidak ada data | ☐ |
| 17 | Responsive di mobile, tablet, desktop | ☐ |
| 18 | Touch target >= 44x44px | ☐ |
| 19 | Focus indicator visible | ☐ |

### 23.4 Kriteria Data

| # | Kriteria | Check |
|---|---|---|
| 20 | Akses database melalui Repository | ☐ |
| 21 | Multi-table operation dalam transaction | ☐ |
| 22 | Data bisnis di IndexedDB (bukan localStorage) | ☐ |
| 23 | Audit log untuk perubahan kritis | ☐ |

### 23.5 Kriteria Kinerja

| # | Kriteria | Check |
|---|---|---|
| 24 | Query menggunakan Dexie index | ☐ |
| 25 | Pagination untuk list > 50 items | ☐ |
| 26 | Debounce untuk search | ☐ |

---

> **Dokumen ini adalah standar resmi penulisan kode untuk POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md`, `02_DATABASE_SCHEMA.md`, `03_BUSINESS_RULES.md`, `04_UI_DESIGN_SYSTEM.md`, `05_COMPONENT_LIBRARY.md`, dan `08_AI_PROMPT_GUIDE.md`.

---

*POS Offline PWA — Coding Standard v1.0.0 — 15 Juli 2026*
