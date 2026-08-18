# API Contract — POS Offline PWA

> **Dokumen**: 18_API_CONTRACT.md
> **Versi**: 1.0.0
> **Status**: Final Draft
> **Audience**: Backend Engineer, Frontend Engineer, Integrator, DevOps
> **Standar**: Internal Service Contract, REST API Mapping, GraphQL Mapping, Offline Sync

---

## Daftar Isi

1. [API Philosophy](#1-api-philosophy)
2. [Naming Convention](#2-naming-convention)
3. [Standard Response](#3-standard-response)
4. [Standard Error](#4-standard-error)
5. [DTO (Data Transfer Object)](#5-dto-data-transfer-object)
6. [Repository Contract](#6-repository-contract)
7. [Service Contract](#7-service-contract)
8. [Pagination Contract](#8-pagination-contract)
9. [Search Contract](#9-search-contract)
10. [Validation Contract](#10-validation-contract)
11. [Event Contract](#11-event-contract)
12. [Offline Sync Contract](#12-offline-sync-contract)
13. [Import Contract](#13-import-contract)
14. [Export Contract](#14-export-contract)
15. [Security Contract](#15-security-contract)
16. [Audit Contract](#16-audit-contract)
17. [Versioning](#17-versioning)
18. [Future REST API Mapping](#18-future-rest-api-mapping)
19. [Future GraphQL Mapping](#19-future-graphql-mapping)
20. [Best Practices](#20-best-practices)

---

## 1. API Philosophy

### 1.1 Single Source of Truth

Setiap entitas bisnis memiliki satu repository yang menjadi otoritas data. Tidak ada duplikasi logika CRUD di seluruh modul. Semua akses data melewati repository yang telah ditentukan.

```
+------------------+       +------------------+       +------------------+
|    Page / UI     | ----> |  Service Layer   | ----> |   Repository     |
| (Consumer)       |       | (Business Logic)  |       | (Data Access)    |
+------------------+       +------------------+       +------------------+
                                                             |
                                                             v
                                                      +------------------+
                                                      |   IndexedDB      |
                                                      |   (Dexie)        |
                                                      +------------------+
```

### 1.2 Repository Pattern

Repository adalah satu-satunya lapisan yang berinteraksi langsung dengan database (IndexedDB via Dexie). Tidak ada modul lain yang boleh memanggil Dexie API secara langsung. Repository bertanggung jawab atas:

- Query execution
- Sorting dan filtering
- Pagination
- Soft delete filtering
- Bulk operations

### 1.3 Service Layer

Service adalah lapisan bisnis yang berdiri di atas repository. Service tidak mengetahui detail penyimpanan data. Service hanya berbicara dengan repository melalui kontrak DTO. Service bertanggung jawab atas:

- Validasi bisnis
- Orchestrasi multi-repository
- Event publishing
- Transformasi DTO
- Import/Export processing
- Sync queue management

### 1.4 DTO (Data Transfer Object)

DTO adalah objek polos yang menjadi kontrak komunikasi antar lapisan. DTO tidak memiliki method, hanya properti. DTO menjamin bahwa format data yang masuk dan keluar dari setiap lapisan konsisten.

### 1.5 Loose Coupling

Setiap modul hanya bergantung pada kontrak (interface), bukan pada implementasi konkret. Perubahan implementasi repository atau service tidak boleh memengaruhi konsumen selama kontrak DTO dan method signature tidak berubah.

### 1.6 Dependency Injection

Service menerima repository melalui constructor, bukan melakukan instantiate sendiri. Ini memungkinkan:

- Unit testing dengan mock repository
- Pergantian implementasi (IndexedDB → REST API → GraphQL)
- Middleware injection (audit, logging, cache)

```
+------------------+
|    Service       |
|                  |
|  - repository    |<---- Dependency Injection
|  - eventBus      |<---- Dependency Injection
|  - validator     |<---- Dependency Injection
+------------------+
```

### 1.7 Offline First

Semua operasi data terjadi secara lokal (IndexedDB). Tidak ada ketergantungan pada koneksi jaringan. Ketika online, data dapat disinkronkan ke server cloud melalui Sync Engine. Arsitektur ini menjamin:

- Aplikasi berfungsi penuh tanpa internet
- Semua data tersedia secara lokal
- Sinkronasi terjadi di latar belakang
- Konflik data diselesaikan dengan aturan Last Write Wins (LWW)

### 1.8 Backward Compatibility

Setiap perubahan kontrak API harus backward compatible. Perubahan breaking memerlukan version bump. Strategi yang digunakan:

- Additive changes: field baru boleh ditambahkan tanpa version bump
- Deprecation: field lama diberi label deprecated, dihapus setelah 2 rilis
- Breaking changes: version bump dan migration guide

### 1.9 Versioning

API Internal menggunakan Semantic Versioning:

- **Major**: perubahan breaking pada kontrak (method signature berubah, DTO breaking)
- **Minor**: penambahan method baru, field baru, tanpa breaking
- **Patch**: bug fix, dokumentasi, internal refactor tanpa perubahan kontrak

---

## 2. Naming Convention

### 2.1 Method Prefix

| Prefix | Tujuan | Contoh |
|--------|--------|--------|
| `get` | Mengambil satu entitas berdasarkan ID | `getById(id)` |
| `find` | Mencari entitas dengan kriteria spesifik | `findBySku(sku)` |
| `search` | Pencarian full-text dengan pagination | `search(keyword, options)` |
| `list` | Mengambil banyak entitas, umumnya tanpa query kompleks | `listAll()` |
| `create` | Membuat entitas baru | `create(data)` |
| `update` | Memperbarui entitas yang sudah ada | `update(id, changes)` |
| `delete` | Soft-delete entitas | `delete(id)` |
| `restore` | Mengembalikan entitas yang di-soft-delete | `restore(id)` |
| `validate` | Validasi data tanpa menyimpan | `validate(data)` |
| `sync` | Sinkronisasi data ke/dari server | `syncPull()`, `syncPush()` |
| `import` | Import data dari file eksternal | `importFromExcel(file)` |
| `export` | Export data ke file eksternal | `exportToExcel()` |
| `approve` | Menyetujui entitas (PO, pengajuan) | `approve(id)` |
| `cancel` | Membatalkan entitas | `cancel(id)` |
| `complete` | Menandai entitas sebagai selesai | `complete(id)` |
| `close` | Menutup entitas (shift, sesi) | `close(id)` |
| `reopen` | Membuka kembali entitas yang sudah ditutup | `reopen(id)` |
| `beforeCreate` | Hook sebelum create | `beforeCreate(data)` |
| `afterCreate` | Hook setelah create | `afterCreate(record)` |

### 2.2 Variable Naming

| Entity | Variable | Type |
|--------|----------|------|
| ID | `id` | string (UUID) |
| Waktu dibuat | `createdAt` | string (ISO 8601) |
| Waktu diupdate | `updatedAt` | string (ISO 8601) |
| Waktu dihapus | `deletedAt` | string (ISO 8601) \| null |
| Halaman | `page` | number |
| Ukuran halaman | `pageSize` | number |
| Total | `total` | number |
| Total halaman | `totalPages` | number |
| Urutan | `sort` | string \| [string, string] |
| Filter | `filter` | object |
| Pencarian | `search` | string |
| Status | `status` | string |

### 2.3 File Naming Convention

```
src/modules/{module}/
  {module}-repository.js    → ProductRepository
  {module}-service.js       → ProductService
  {module}-validator.js     → validateProduct()
  {module}-utils.js         → formatCurrency()
  index.js                 → re-exports
```

---

## 3. Standard Response

### 3.1 Format Dasar Response

Semua method service mengembalikan objek respons dengan struktur berikut:

```
{
  success: boolean,
  message: string | null,
  data: T | null,
  errors: string[] | null,
  meta: {
    timestamp: string (ISO 8601),
    executionTime: number (ms),
    requestId: string (UUID)
  } | null
}
```

### 3.2 Response Sukses — Single Entity

```
Method:   create(data)
Response:
{
  success: true,
  message: "Produk berhasil dibuat",
  data: {
    id: "uuid-xxx",
    sku: "PRD-0021",
    name: "Produk Baru",
    ...
  },
  errors: null,
  meta: {
    timestamp: "2026-01-15T10:30:00.000Z",
    executionTime: 45,
    requestId: "req-uuid-xxx"
  }
}
```

### 3.3 Response Sukses — List dengan Pagination

```
Method:   getAll(options)
Response:
{
  success: true,
  message: null,
  data: [ ...entities ],
  errors: null,
  meta: {
    timestamp: "2026-01-15T10:30:00.000Z",
    executionTime: 120,
    requestId: "req-uuid-xxx",
    pagination: {
      page: 1,
      pageSize: 10,
      total: 157,
      totalPages: 16,
      sort: "name",
      order: "asc"
    }
  }
}
```

### 3.4 Response Error

```
{
  success: false,
  message: "Validasi gagal",
  data: null,
  errors: [
    "Nama produk wajib diisi",
    "Harga beli tidak valid"
  ],
  meta: {
    timestamp: "2026-01-15T10:30:00.000Z",
    executionTime: 12,
    requestId: "req-uuid-xxx"
  }
}
```

### 3.5 Response untuk Bulk Operation

```
{
  success: true,
  message: "Import selesai",
  data: {
    total: 150,
    successCount: 147,
    failedCount: 3,
    failedRows: [
      { row: 12, errors: ["SKU sudah ada"] },
      { row: 45, errors: ["Harga tidak valid"] },
      { row: 88, errors: ["Nama wajib diisi"] }
    ],
    imported: [ ...records ]
  },
  errors: null,
  meta: { ... }
}
```

---

## 4. Standard Error

### 4.1 Error Taxonomy

| Error Type | Kode | Kapan Digunakan |
|-----------|------|----------------|
| `BusinessError` | `BUSINESS_ERROR` | Pelanggaran aturan bisnis (stok negatif, PO sudah diterima) |
| `ValidationError` | `VALIDATION_ERROR` | Data tidak valid saat create/update (nama kosong, harga negatif) |
| `DatabaseError` | `DATABASE_ERROR` | Gagal menyimpan/mengambil data dari IndexedDB |
| `NetworkError` | `NETWORK_ERROR` | Gagal terhubung ke server saat sync |
| `PermissionError` | `PERMISSION_ERROR` | User tidak memiliki akses ke modul/aksi tertentu |
| `AuthenticationError` | `AUTH_ERROR` | Session expired, token tidak valid |
| `NotFoundError` | `NOT_FOUND` | Entitas dengan ID tertentu tidak ditemukan |
| `ConflictError` | `CONFLICT` | Duplikasi data (SKU sudah ada, kode sudah digunakan) |
| `ImportError` | `IMPORT_ERROR` | Gagal parsing file import (format salah, kolom tidak sesuai) |
| `ExportError` | `EXPORT_ERROR` | Gagal menghasilkan file export |

### 4.2 Error Detail Structure

Setiap error memiliki struktur detail:

```
{
  type: "VALIDATION_ERROR",
  code: "FIELD_REQUIRED",
  field: "name",
  message: "Nama produk wajib diisi",
  value: null
}
```

### 4.3 Contoh Per Type

**ValidationError**
```
Field: nama produk tidak boleh kosong
{
  type: "VALIDATION_ERROR",
  code: "FIELD_REQUIRED",
  field: "name",
  message: "Nama produk wajib diisi",
  value: ""
}
```

**BusinessError**
```
Stok tidak mencukupi untuk penjualan
{
  type: "BUSINESS_ERROR",
  code: "INSUFFICIENT_STOCK",
  field: "stock",
  message: "Stok tidak mencukupi. Tersedia: 5, diminta: 10",
  value: { available: 5, requested: 10 }
}
```

**ConflictError**
```
SKU sudah digunakan oleh produk lain
{
  type: "CONFLICT",
  code: "DUPLICATE_SKU",
  field: "sku",
  message: "Kode produk PRD-0001 sudah digunakan",
  value: "PRD-0001"
}
```

**NotFoundError**
```
Produk dengan ID tertentu tidak ditemukan
{
  type: "NOT_FOUND",
  code: "ENTITY_NOT_FOUND",
  field: "id",
  message: "Produk dengan id uuid-xxx tidak ditemukan",
  value: "uuid-xxx"
}
```

**PermissionError**
```
User tidak memiliki hak akses
{
  type: "PERMISSION_ERROR",
  code: "ACCESS_DENIED",
  field: null,
  message: "Anda tidak memiliki izin untuk menghapus produk",
  value: { userId: "uuid-user", requiredPermission: "product:delete" }
}
```

**DatabaseError**
```
Gagal menyimpan ke IndexedDB
{
  type: "DATABASE_ERROR",
  code: "STORAGE_FAILED",
  field: null,
  message: "Gagal menyimpan data ke database",
  value: { operation: "bulkAdd", table: "products" }
}
```

### 4.4 Error Response Flow

```
+--------+     +-----------+     +------------+     +----------+
|  User  | --> |  Service  | --> | Repository | --> | IndexedDB|
+--------+     +-----------+     +------------+     +----------+
    |               |                 |                  |
    |           ValidationError       |                  |
    |<---------- (sync)               |                  |
    |               |              DatabaseError         |
    |               |<------------- (catch)              |
    |               |                                    |
    |        BusinessError                               |
    |<---------- (sync)                                  |
    |               |                                    |
    |        NotFoundError                               |
    |<---------- (async)                                 |
```

---

## 5. DTO (Data Transfer Object)

### 5.1 Product DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string (UUID) | Auto | No | Auto-generated | — | `"a1b2c3d4-..."` |
| `sku` | string | Yes | No | Unique, max 20 char, pattern: `PRD-\d{4}` | Auto | `"PRD-0021"` |
| `barcode` | string | No | Yes | Max 50 char | `""` | `"8991001001021"` |
| `name` | string | Yes | No | 1–200 char, trimmed | — | `"Beras Premium 5kg"` |
| `categoryId` | string | No | Yes | Must exist in categories | `null` | `"cat-sembako"` |
| `unitId` | string | No | Yes | Must exist in units | `null` | `"unit-kg"` |
| `buyPrice` | number | Yes | No | >= 0 | `0` | `55000` |
| `sellPrice` | number | Yes | No | >= 0 | `0` | `65000` |
| `stock` | number | No | No | >= 0, integer | `0` | `50` |
| `minStock` | number | No | No | >= 0, integer | `0` | `10` |
| `supplierId` | string | No | Yes | Must exist in suppliers | `null` | `"sup-makmur"` |
| `type` | string | No | No | Enum: `product`, `service`, `package` | `"product"` | `"product"` |
| `image` | string | No | Yes | Base64 or URL | `null` | `"data:image/..."` |
| `description` | string | No | Yes | Max 1000 char | `""` | `"Beras premium grade A"` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | ISO 8601 | Auto | `"2026-01-15T..."` |
| `updatedAt` | string | Auto | No | ISO 8601 | Auto | `"2026-01-15T..."` |
| `deletedAt` | string\|null | Auto | Yes | ISO 8601 | `null` | `null` |

### 5.2 Category DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string (UUID) | Auto | No | — | Auto | `"cat-makanan"` |
| `name` | string | Yes | No | 1–100 char | — | `"Makanan"` |
| `parentId` | string\|null | No | Yes | Must exist in categories | `null` | `null` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | ISO 8601 | Auto | — |
| `updatedAt` | string | Auto | No | ISO 8601 | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | ISO 8601 | `null` | — |

### 5.3 Unit DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"unit-kg"` |
| `name` | string | Yes | No | 1–50 char | — | `"Kilogram"` |
| `abbreviation` | string | No | Yes | 1–10 char | `""` | `"kg"` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.4 Supplier DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"sup-makmur"` |
| `code` | string | Yes | No | Unique, pattern: `SUP-\d{4}` | Auto | `"SUP-0001"` |
| `name` | string | Yes | No | 1–200 char | — | `"PT Sumber Makmur"` |
| `phone` | string | No | Yes | Max 20 char | `""` | `"021-5550001"` |
| `email` | string | No | Yes | Email format | `""` | `"info@sumbermakmur.com"` |
| `address` | string | No | Yes | Max 500 char | `""` | `"Jl. Merdeka No. 1, Jakarta"` |
| `contactPerson` | string | No | Yes | Max 100 char | `""` | `"Budi Santoso"` |
| `notes` | string | No | Yes | Max 1000 char | `""` | `"Supplier utama"` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.5 Customer DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"cst-001"` |
| `name` | string | Yes | No | 1–200 char | — | `"Ahmad Fauzi"` |
| `phone` | string | No | Yes | Max 20 char | `""` | `"0812-3456-7890"` |
| `email` | string | No | Yes | Email format | `""` | `"ahmad@email.com"` |
| `address` | string | No | Yes | Max 500 char | `""` | `"Jl. Sudirman No. 5"` |
| `isMember` | boolean | No | No | — | `false` | `true` |
| `notes` | string | No | Yes | Max 1000 char | `""` | `"Pelanggan tetap"` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.6 Purchase DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"po-001"` |
| `poNumber` | string | Auto | No | Unique, pattern: `PO-\d{4}` | Auto | `"PO-0001"` |
| `supplierId` | string | Yes | No | Must exist in suppliers | — | `"sup-makmur"` |
| `supplierName` | string | No | Yes | Denormalized | `""` | `"PT Sumber Makmur"` |
| `userId` | string\|null | No | Yes | Must exist in users | `null` | `"user-001"` |
| `status` | string | Yes | No | Enum: `draft`, `ordered`, `received`, `cancelled` | `"ordered"` | `"received"` |
| `orderDate` | string | Yes | No | ISO 8601, not future | Auto | `"2026-01-15T..."` |
| `subtotal` | number | Auto | No | Sum of items | Auto | `1375000` |
| `tax` | number | No | No | >= 0 | `0` | `0` |
| `grandTotal` | number | Auto | No | subtotal + tax | Auto | `1375000` |
| `notes` | string | No | Yes | Max 1000 char | `""` | `"Stok bulanan"` |
| `items` | array | Yes | No | Min 1 item | — | `[PurchaseItem]` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.7 PurchaseItem DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"poi-001"` |
| `purchaseId` | string | Auto | No | Foreign key to purchases | — | `"po-001"` |
| `productId` | string | Yes | No | Must exist in products | — | `"prd-001"` |
| `productName` | string | No | Yes | Denormalized | `""` | `"Beras Premium 5kg"` |
| `quantity` | number | Yes | No | >= 1, integer | — | `10` |
| `unitPrice` | number | Yes | No | >= 0 | — | `55000` |
| `subtotal` | number | Auto | No | quantity * unitPrice | Auto | `550000` |

### 5.8 Sale DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"sls-001"` |
| `invoiceNumber` | string | Auto | No | Unique, pattern: `INV-\d{8}-\d{4}` | Auto | `"INV-20260115-0001"` |
| `customerId` | string\|null | No | Yes | Must exist in customers | `null` | `"cst-001"` |
| `customerName` | string | No | Yes | Denormalized | `"Umum"` | `"Ahmad Fauzi"` |
| `userId` | string\|null | No | Yes | Must exist in users | `null` | `"user-001"` |
| `shiftId` | string\|null | No | Yes | Must exist in shifts | `null` | `"sft-001"` |
| `paymentStatus` | string | Yes | No | Enum: `paid`, `partial`, `unpaid`, `refunded` | `"unpaid"` | `"paid"` |
| `paymentMethod` | string | No | Yes | Enum: `cash`, `transfer`, `qris`, `card` | `null` | `"cash"` |
| `saleDate` | string | Yes | No | ISO 8601 | Auto | `"2026-01-15T..."` |
| `subtotal` | number | Auto | No | Sum of items | Auto | `143000` |
| `discount` | number | No | No | >= 0 | `0` | `0` |
| `tax` | number | No | No | >= 0 | `0` | `0` |
| `grandTotal` | number | Auto | No | subtotal - discount + tax | Auto | `143000` |
| `notes` | string | No | Yes | Max 1000 char | `""` | `"Pembayaran tunai"` |
| `items` | array | Yes | No | Min 1 item | — | `[SaleItem]` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.9 SaleItem DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"sli-001"` |
| `saleId` | string | Auto | No | Foreign key to sales | — | `"sls-001"` |
| `productId` | string | Yes | No | Must exist in products | — | `"prd-013"` |
| `productName` | string | No | Yes | Denormalized | `""` | `"Air Mineral 600ml"` |
| `quantity` | number | Yes | No | >= 1, integer | — | `2` |
| `unitPrice` | number | Yes | No | >= 0 | — | `3000` |
| `subtotal` | number | Auto | No | quantity * unitPrice | Auto | `6000` |

### 5.10 Inventory / StockMovement DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"stm-001"` |
| `productId` | string | Yes | No | Must exist in products | — | `"prd-001"` |
| `type` | string | Yes | No | Enum: `in`, `out`, `adjustment`, `opname` | — | `"in"` |
| `quantity` | number | Yes | No | != 0, integer | — | `10` |
| `referenceType` | string | Yes | No | Enum: `purchase`, `sale`, `adjustment`, `opname` | — | `"purchase"` |
| `referenceId` | string | Yes | No | Foreign key to reference | — | `"po-001"` |
| `userId` | string\|null | No | Yes | Must exist in users | `null` | `"user-001"` |
| `notes` | string | No | Yes | Max 500 char | `""` | `"Penerimaan PO-0001"` |
| `createdAt` | string | Auto | No | — | Auto | — |

### 5.11 Recipe DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"rcp-001"` |
| `productId` | string | Yes | No | Must exist in products | — | `"prd-030"` |
| `name` | string | Yes | No | 1–200 char | — | `"Resep Nasi Goreng"` |
| `yield` | number | Yes | No | >= 1, integer | `1` | `1` |
| `yieldUnit` | string | Yes | No | Enum: `serving`, `piece`, `pack` | `"serving"` | `"serving"` |
| `instruction` | string | No | Yes | Max 5000 char | `""` | `"Tumis bumbu hingga harum..."` |
| `ingredients` | array | Yes | No | Min 1 ingredient | — | `[RecipeIngredient]` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.12 RecipeIngredient DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"rci-001"` |
| `recipeId` | string | Auto | No | Foreign key | — | `"rcp-001"` |
| `productId` | string | Yes | No | Must exist in products | — | `"prd-001"` |
| `productName` | string | No | Yes | Denormalized | `""` | `"Beras"` |
| `quantity` | number | Yes | No | > 0 | — | `0.2` |
| `unitId` | string | No | Yes | Must exist in units | `null` | `"unit-kg"` |

### 5.13 Payment DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"pmt-001"` |
| `saleId` | string | Auto | No | Foreign key to sales | — | `"sls-001"` |
| `method` | string | Yes | No | Enum: `cash`, `transfer`, `qris`, `card` | — | `"cash"` |
| `amount` | number | Yes | No | > 0 | — | `143000` |
| `reference` | string | No | Yes | Max 100 char | `""` | `"TRF-20260115-001"` |
| `createdAt` | string | Auto | No | — | Auto | — |

### 5.14 Cash Session / Shift DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"sft-001"` |
| `shiftNumber` | string | Auto | No | Unique, pattern: `SFT-\d{8}-\d{4}` | Auto | `"SFT-20260115-0001"` |
| `userId` | string | Yes | No | Must exist in users | — | `"user-001"` |
| `openedAt` | string | Auto | No | ISO 8601 | Auto | — |
| `closedAt` | string\|null | Auto | Yes | ISO 8601 | `null` | — |
| `openingBalance` | number | Yes | No | >= 0 | `0` | `500000` |
| `closingBalance` | number\|null | No | Yes | >= 0 | `null` | `1250000` |
| `expectedBalance` | number\|null | Auto | Yes | Calculated | `null` | `1200000` |
| `difference` | number\|null | Auto | Yes | closing - expected | `null` | `50000` |
| `status` | string | Yes | No | Enum: `open`, `closed`, `reconciled` | `"open"` | `"closed"` |
| `notes` | string | No | Yes | Max 500 char | `""` | `"Shift pagi"` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.15 User DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"user-001"` |
| `username` | string | Yes | No | Unique, 3–50 char | — | `"admin"` |
| `name` | string | Yes | No | 1–200 char | — | `"Admin Utama"` |
| `email` | string | No | Yes | Email format | `""` | `"admin@toko.com"` |
| `roleId` | string | Yes | No | Must exist in roles | — | `"role-admin"` |
| `isActive` | boolean | No | No | — | `true` | `true` |
| `lastLogin` | string\|null | Auto | Yes | ISO 8601 | `null` | — |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.16 Role DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"role-admin"` |
| `name` | string | Yes | No | Unique, 1–50 char | — | `"Administrator"` |
| `isSystem` | boolean | Auto | No | System roles cannot be deleted | `false` | `true` |
| `permissions` | string[] | No | Yes | Array of permission keys | `[]` | `["product:*", ...]` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |
| `deletedAt` | string\|null | Auto | Yes | — | `null` | — |

### 5.17 Settings DTO

| Field | Type | Required | Nullable | Validation | Default | Example |
|-------|------|----------|----------|------------|---------|---------|
| `id` | string | Auto | No | — | Auto | `"set-001"` |
| `key` | string | Yes | No | Unique, snake_case | — | `"store-name"` |
| `value` | any | Yes | No | Type depends on setting | — | `"Toko Saya"` |
| `type` | string | Yes | No | Enum: `string`, `number`, `boolean`, `json` | `"string"` | `"string"` |
| `isEditable` | boolean | No | No | — | `true` | `true` |
| `createdAt` | string | Auto | No | — | Auto | — |
| `updatedAt` | string | Auto | No | — | Auto | — |

---

## 6. Repository Contract

### 6.1 Standard Method Signature

Setiap repository harus mengimplementasikan method berikut dengan signature yang konsisten:

| Method | Parameters | Return Type | Deskripsi |
|--------|-----------|-------------|-----------|
| `findById(id)` | `id: string` | `T \| null` | Mengambil satu entitas berdasarkan primary key |
| `findAll(options)` | `options?: RepositoryOptions` | `T[]` | Mengambil semua entitas tanpa pagination |
| `search(query, options)` | `query: string, options?: SearchOptions` | `PaginatedResult<T>` | Pencarian dengan keyword dan pagination |
| `create(data)` | `data: Partial<T>` | `T` | Membuat entitas baru, mengembalikan record lengkap |
| `update(id, changes)` | `id: string, changes: Partial<T>` | `T` | Memperbarui entitas, mengembalikan record setelah update |
| `delete(id)` | `id: string` | `boolean` | Soft delete (set deletedAt) |
| `restore(id)` | `id: string` | `boolean` | Mengembalikan entitas yang di-soft-delete |
| `exists(id)` | `id: string` | `boolean` | Mengecek apakah entitas dengan ID tersebut ada |
| `count(filter?)` | `filter?: Partial<T>` | `number` | Menghitung jumlah entitas |
| `paginate(options)` | `options: PaginationOptions` | `PaginatedResult<T>` | Pagination standar |
| `bulkInsert(records)` | `records: Partial<T>[]` | `T[]` | Insert banyak record dalam satu transaksi |
| `bulkUpdate(records)` | `records: { id: string, changes: Partial<T> }[]` | `number` | Update banyak record |
| `bulkDelete(ids)` | `ids: string[]` | `number` | Soft delete banyak record |

### 6.2 RepositoryOptions

```
{
  filter?: { [field: string]: any },
  sort?: string | [string, string],
  pagination?: {
    page: number,
    pageSize: number
  },
  includeDeleted?: boolean
}
```

### 6.3 PaginatedResult

```
{
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

### 6.4 SearchOptions

```
{
  sort?: string | [string, string],
  pagination?: {
    page: number,
    pageSize: number
  },
  includeDeleted?: boolean,
  [additionalFilter: string]: any
}
```

### 6.5 Inheritance Diagram

```
+-------------------+
|  BaseRepository   |  ← Abstract class
+-------------------+
| - table: Dexie    |
| - tableName: str  |
+-------------------+
| + findById()      |
| + findAll()       |
| + create()        |
| + update()        |
| + delete()        |
| + exists()        |
| + count()         |
| + paginate()      |
| + bulkInsert()    |
| + bulkUpdate()    |
| + bulkDelete()    |
+-------------------+
         |
         v
+-----------+-----------+-----------+-----------+
| Product   | Supplier  | Customer  | Purchase  |
| Repository| Repository| Repository| Repository|
+-----------+-----------+-----------+-----------+
| + search()| + search()| + search()| + search()|
| + getNext | + getNext |           | + getItems|
|   Sku()   |   Code()  |           | + addItems|
| + getAll  |           |           | + getNext |
|   Categ.. |           |           |   PONum() |
+-----------+-----------+-----------+-----------+
```

---

## 7. Service Contract

### 7.1 Standard Service Methods

| Method | Parameters | Return Type | Deskripsi |
|--------|-----------|-------------|-----------|
| `getAll(options)` | `options?: ServiceQueryOptions` | `StandardResponse<PaginatedResult<T>>` | Ambil semua dengan search, sort, pagination |
| `getById(id)` | `id: string` | `StandardResponse<T \| null>` | Ambil satu entitas |
| `create(data)` | `data: CreateDTO` | `StandardResponse<T>` | Buat entitas baru (termasuk validasi + hooks) |
| `update(id, changes)` | `id: string, changes: UpdateDTO` | `StandardResponse<T>` | Update entitas (termasuk validasi + hooks) |
| `delete(id)` | `id: string` | `StandardResponse<boolean>` | Soft delete |
| `validate(data)` | `data: Partial<T>` | `string[]` | Validasi tanpa menyimpan |

### 7.2 Service Hooks

Setiap service dapat mengimplementasikan hooks berikut untuk cross-cutting concerns:

```
+------------------+
|  beforeCreate()  |  ← Validasi, enrichment, authorization
+------------------+
         |
         v
+------------------+
|  Repository      |  ← Persistence
|  .create()       |
+------------------+
         |
         v
+------------------+
|  afterCreate()   |  ← Event publishing, audit log, notification
+------------------+
```

**Hook signature:**

| Hook | Tujuan | Contoh |
|------|--------|--------|
| `beforeCreate(data)` | Validasi, set default, authorization | `if (!hasPermission) throw PermissionError` |
| `afterCreate(record)` | Publish event, audit log | `eventBus.emit('ProductCreated', record)` |
| `beforeUpdate(id, changes)` | Validasi perubahan, cek status | `if (record.status === 'received') throw Error` |
| `afterUpdate(record)` | Publish event, sync | `syncQueue.enqueue('product:updated', record)` |
| `beforeDelete(id)` | Cek referensi, authorization | `if (hasRelatedData) throw Error` |
| `afterDelete(id)` | Publish event | `eventBus.emit('ProductDeleted', id)` |
| `beforeImport(rows)` | Validasi massal, mapping | `rows.map(normalizeRow)` |
| `afterImport(result)` | Notifikasi, sync | `notification.success(result)` |
| `beforeExport(filter)` | Filter data, authorization | `if (!canExport) throw Error` |
| `afterExport(file)` | Log export | `audit.log('export', file.length)` |

### 7.3 Service Lifecycle Flow

```
Request → validate() → beforeCreate() → repository.create() → afterCreate() → Response
                                                                    |
                                                                    v
                                                              eventBus.emit()
                                                                    |
                                                           +---------+---------+
                                                           |                   |
                                                           v                   v
                                                      Audit Log          Sync Queue
```

### 7.4 ServiceQueryOptions

```
{
  search?: string,
  sort?: string | [string, string],
  pagination?: {
    page: number,
    pageSize: number
  },
  status?: string,
  [additionalFilter: string]: any
}
```

---

## 8. Pagination Contract

### 8.1 Request Format

```
{
  page: number,       // Halaman dimulai dari 1
  pageSize: number,   // Jumlah item per halaman (default: 10, max: 100)
  sort: string,       // Field untuk sorting (contoh: "name")
  order: string,      // "asc" atau "desc" (default: "asc")
  filters: object,    // Filter object (contoh: { status: "active", categoryId: "cat-xxx" })
  search: string      // Keyword pencarian (opsional)
}
```

### 8.2 Response Format

```
{
  data: [ ... ],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 157,
    totalPages: 16,
    sort: "name",
    order: "asc"
  }
}
```

### 8.3 Contoh Request/Response

```
Request:
{
  page: 2,
  pageSize: 20,
  sort: "name",
  order: "asc",
  filters: { categoryId: "cat-makanan", isActive: true },
  search: "beras"
}

Response:
{
  data: [ ...20 produk dalam kategori makanan... ],
  pagination: {
    page: 2,
    pageSize: 20,
    totalItems: 45,
    totalPages: 3,
    sort: "name",
    order: "asc"
  }
}
```

### 8.4 Aturan Pagination

1. `page` minimal 1. Jika < 1, dianggap 1.
2. `pageSize` minimal 1, maksimal 100. Jika > 100, dibatasi 100.
3. Jika `pageSize` tidak disediakan, default 10.
4. Jika `page` melebihi `totalPages`, kembalikan halaman terakhir.
5. `totalPages` dihitung dengan `Math.ceil(totalItems / pageSize)`.

---

## 9. Search Contract

### 9.1 Search Fields per Entity

| Entity | Searchable Fields |
|--------|------------------|
| Product | `name`, `sku`, `barcode` |
| Category | `name` |
| Supplier | `name`, `code`, `phone`, `email` |
| Customer | `name`, `phone`, `email` |
| Purchase | `poNumber`, `supplierName`, `notes` |
| Sale | `invoiceNumber`, `customerName` |
| User | `username`, `name`, `email` |
| Recipe | `name` |

### 9.2 Search Behavior

1. Case-insensitive (semua query di-lowercase sebelum dibandingkan)
2. Partial match (query "beras" cocok dengan "Beras Premium 5kg")
3. Multi-field (query "beras" mencari di name, sku, dan barcode)
4. Whitespace diabaikan (trimmed)

### 9.3 Filter Options per Entity

| Entity | Filterable Fields |
|--------|------------------|
| Product | `categoryId`, `supplierId`, `isActive`, `type` |
| Purchase | `supplierId`, `status` |
| Sale | `paymentStatus`, `paymentMethod` |
| Report | `fromDate`, `toDate`, `status` |

### 9.4 Date Range Search

Untuk laporan dan entitas yang memiliki tanggal, format date range:

```
{
  fromDate: "2026-01-01",     // ISO 8601 date only
  toDate: "2026-01-31"        // ISO 8601 date only
}
```

Implementasi: `toDate` disertakan dengan `T23:59:59` agar mencakup seluruh hari.

---

## 10. Validation Contract

### 10.1 Field Validation

| Rule | Keterangan | Contoh Error |
|------|-----------|-------------|
| `required` | Field wajib diisi | `"Nama produk wajib diisi"` |
| `minLength` | Minimal panjang karakter | `"Nama minimal 1 karakter"` |
| `maxLength` | Maksimal panjang karakter | `"Nama maksimal 200 karakter"` |
| `min` | Nilai minimal | `"Harga beli minimal 0"` |
| `max` | Nilai maksimal | `"Diskon maksimal 100%"` |
| `pattern` | Regex pattern | `"Format SKU tidak valid"` |
| `email` | Format email | `"Format email tidak valid"` |
| `integer` | Harus bilangan bulat | `"Stok harus bilangan bulat"` |
| `enum` | Harus salah satu dari daftar | `"Tipe harus product, service, atau package"` |

### 10.2 Business Validation

| Rule | Entity | Keterangan |
|------|--------|-----------|
| `sellPrice >= buyPrice` | Product | Harga jual tidak boleh kurang dari harga beli |
| `stock >= 0` | Product | Stok tidak boleh negatif (jika allow-negative-stock = false) |
| `quantity > 0` | PurchaseItem/SaleItem | Quantity harus lebih dari 0 |
| `status transition valid` | Purchase | Status hanya bisa berubah sesuai state machine |
| `cannot delete referenced` | Product/Supplier/Customer | Tidak bisa menghapus jika masih direferensi |
| `openingBalance >= 0` | Shift | Saldo awal tidak boleh negatif |
| `yield >= 1` | Recipe | Yield minimal 1 |

### 10.3 Duplicate Validation

| Entity | Unique Fields | Error Message |
|--------|--------------|---------------|
| Product | `sku` | `"Kode produk sudah digunakan"` |
| Product | `barcode` (if provided) | `"Barcode sudah digunakan"` |
| Supplier | `code` | `"Kode pemasok sudah digunakan"` |
| User | `username` | `"Username sudah digunakan"` |
| Role | `name` | `"Nama role sudah digunakan"` |
| Settings | `key` | `"Key setting sudah ada"` |

### 10.4 Stock Validation

| Skenario | Validasi |
|----------|---------|
| Sale transaction | `stock >= quantity` untuk setiap item |
| Stock adjustment | `newStock >= 0` (jika negative stock disabled) |
| Recipe execution | `stock >= ingredient.quantity` untuk setiap ingredient |
| Purchase receive | Tidak ada validasi stok (pembelian menambah stok) |

### 10.5 Permission Validation

Setiap service method harus memeriksa:

```
User memiliki permission:
- {module}:create  → untuk create
- {module}:read    → untuk getAll/getById
- {module}:update  → untuk update
- {module}:delete  → untuk delete
- {module}:export  → untuk export
- {module}:import  → untuk import
```

Contoh: `product:create`, `purchase:approve`, `report:read`

### 10.6 Validation Flow

```
+------------------+
|   Input Data     |
+------------------+
         |
         v
+------------------+
| Field Validation |  ← Required, min/max, pattern, enum
+------------------+
         |
         v
+------------------+
| Duplicate Check  |  ← SKU, code, username
+------------------+
         |
         v
+------------------+
| Business Rules   |  ← Status transition, stock, reference
+------------------+
         |
         v
+------------------+
| Permission Check |  ← User role & permission
+------------------+
         |
         v
+------------------+
|   Save Data      |
+------------------+
```

---

## 11. Event Contract

### 11.1 Event Naming Convention

Format: `{entity}:{action}`

- `product:created`
- `product:updated`
- `product:deleted`
- `stock:changed`
- `purchase:completed`
- `sale:completed`
- `recipe:executed`
- `customer:created`
- `payment:received`
- `shift:closed`

### 11.2 Event Catalog

#### ProductCreated

| Atribut | Value |
|---------|-------|
| **Producer** | ProductService.afterCreate |
| **Consumer** | AuditService, NotificationService, SearchIndex |
| **Trigger** | Produk baru berhasil dibuat |
| **Payload** | `{ id, sku, name, categoryId, timestamp }` |

```
Event: product:created
Payload:
{
  eventId: "evt-uuid-xxx",
  eventName: "product:created",
  producer: "ProductService",
  timestamp: "2026-01-15T10:30:00.000Z",
  data: {
    id: "prd-021",
    sku: "PRD-0021",
    name: "Produk Baru",
    categoryId: "cat-makanan"
  }
}
```

#### ProductUpdated

| Atribut | Value |
|---------|-------|
| **Producer** | ProductService.afterUpdate |
| **Consumer** | AuditService, SyncQueue |
| **Trigger** | Data produk berhasil diperbarui |
| **Payload** | `{ id, sku, changes, previous, timestamp }` |

#### ProductDeleted

| Atribut | Value |
|---------|-------|
| **Producer** | ProductService.afterDelete |
| **Consumer** | AuditService, SearchIndex |
| **Trigger** | Produk di-soft-delete |
| **Payload** | `{ id, sku, name, timestamp }` |

#### StockChanged

| Atribut | Value |
|---------|-------|
| **Producer** | InventoryService |
| **Consumer** | NotificationService (low stock alert), Dashboard |
| **Trigger** | Stok berubah karena pembelian, penjualan, atau penyesuaian |
| **Payload** | `{ productId, sku, productName, previousStock, newStock, change, referenceType, referenceId }` |

```
Event: stock:changed
Payload:
{
  eventId: "evt-uuid-yyy",
  eventName: "stock:changed",
  producer: "InventoryService",
  timestamp: "2026-01-15T11:00:00.000Z",
  data: {
    productId: "prd-001",
    sku: "PRD-0001",
    productName: "Beras Premium 5kg",
    previousStock: 50,
    newStock: 60,
    change: 10,
    referenceType: "purchase",
    referenceId: "po-001"
  }
}
```

#### LowStockAlert

| Atribut | Value |
|---------|-------|
| **Producer** | InventoryService |
| **Consumer** | NotificationService |
| **Trigger** | Stok <= minStock setelah perubahan |
| **Payload** | `{ productId, sku, name, currentStock, minStock }` |

#### PurchaseCompleted

| Atribut | Value |
|---------|-------|
| **Producer** | PurchaseService.afterUpdate (status → received) |
| **Consumer** | InventoryService, AuditService |
| **Trigger** | Purchase order diterima (status = received) |
| **Payload** | `{ purchaseId, poNumber, supplierId, totalItems, grandTotal }` |

#### SaleCompleted

| Atribut | Value |
|---------|-------|
| **Producer** | SalesService (after payment) |
| **Consumer** | InventoryService, Dashboard, ReportService |
| **Trigger** | Transaksi penjualan selesai (status = paid) |
| **Payload** | `{ saleId, invoiceNumber, customerId, totalItems, grandTotal, paymentMethod }` |

```
Event: sale:completed
Payload:
{
  eventId: "evt-uuid-zzz",
  eventName: "sale:completed",
  producer: "SalesService",
  timestamp: "2026-01-15T12:00:00.000Z",
  data: {
    saleId: "sls-006",
    invoiceNumber: "INV-20260115-0006",
    customerName: "Ahmad Fauzi",
    totalItems: 5,
    grandTotal: 175000,
    paymentMethod: "cash"
  }
}
```

#### RecipeExecuted

| Atribut | Value |
|---------|-------|
| **Producer** | RecipeService |
| **Consumer** | InventoryService, AuditService |
| **Trigger** | Resep dieksekusi (produk dihasilkan dari bahan baku) |
| **Payload** | `{ recipeId, productId, yield, ingredients: [...] }` |

#### ShiftClosed

| Atribut | Value |
|---------|-------|
| **Producer** | ShiftService |
| **Consumer** | ReportService, AuditService |
| **Trigger** | Shift kasir ditutup |
| **Payload** | `{ shiftId, userId, openedAt, closedAt, openingBalance, closingBalance, difference }` |

### 11.3 Event Bus Interface

```
+------------------+          +------------------+
|   Producer       |  emit    |   Event Bus      |
|   (Service)      | -------> |  (EventEmitter)  |
+------------------+          +------------------+
                                     |
                        +------------+------------+
                        |            |            |
                        v            v            v
                   +---------+  +---------+  +---------+
                   | Consumer|  | Consumer|  | Consumer|
                   | (Audit) |  | (Notify)|  | (Sync)  |
                   +---------+  +---------+  +---------+
```

---

## 12. Offline Sync Contract

### 12.1 Sync Architecture

```
+------------------+          +------------------+          +------------------+
|   Local DB       |  Push    |   Sync Engine     |  HTTP   |   Cloud Server   |
|   (IndexedDB)    | -------> |  (Service Worker) | -------> |   (REST API)     |
|                  | <------- |                   | <------- |                  |
|                  |  Pull    |                   |  HTTP   |                  |
+------------------+          +------------------+          +------------------+
```

### 12.2 Pending Queue

Setiap perubahan data yang perlu disinkronkan disimpan dalam antrian lokal:

```
{
  id: string (UUID),
  deviceId: string,
  entity: string,          // "product", "sale", "purchase", dll
  action: string,          // "create", "update", "delete"
  entityId: string,        // ID entitas yang diubah
  payload: object,         // Data perubahan
  status: string,          // "pending", "syncing", "synced", "failed"
  retryCount: number,      // Berapa kali sudah dicoba
  maxRetries: number,      // Maksimal percobaan
  lastError: string|null,  // Error terakhir
  createdAt: string,
  updatedAt: string
}
```

### 12.3 Device ID

Setiap instalasi memiliki device ID unik yang di-generate saat pertama kali aplikasi dijalankan. Device ID disimpan di localStorage dan digunakan untuk:

- Identifikasi sumber data
- Conflict resolution
- Tracking riwayat sinkronasi

### 12.4 Transaction ID

Setiap transaksi (sale, purchase) memiliki transaction ID unik berupa UUID. Transaction ID digunakan untuk:

- Idempotency (mencegah duplikasi saat retry)
- Tracking di server
- Rollback jika terjadi error

### 12.5 Conflict Resolution

Strategi: **Last Write Wins (LWW)** berdasarkan timestamp `updatedAt`.

```
Jika data lokal.updatedAt > server.updatedAt:
    Kirim data lokal ke server (push)

Jika data server.updatedAt > server.updatedAt:
    Terima data server (pull)

Jika data server.updatedAt == data lokal.updatedAt:
    Tidak ada konflik, skip
```

### 12.6 Retry Policy

| Parameter | Value |
|-----------|-------|
| Max retries | 5 |
| Backoff | Exponential: 1s, 2s, 4s, 8s, 16s |
| Queue persistence | IndexedDB (tahan restart) |
| Auto retry | Ya, saat koneksi kembali |

### 12.7 Sync Status per Entity

Setiap entitas yang dapat disinkronkan memiliki field:

```
{
  syncStatus: "synced" | "pending" | "conflict" | "failed",
  lastSyncedAt: string (ISO 8601) | null,
  syncVersion: number
}
```

### 12.8 Last Sync

Informasi sinkronasi terakhir disimpan di settings:

```
{
  key: "last-sync",
  value: {
    deviceId: "device-uuid-xxx",
    lastSyncAt: "2026-01-15T10:30:00.000Z",
    tableVersions: {
      products: 3,
      sales: 5,
      purchases: 2
    },
    status: "success" | "failed" | "in-progress"
  }
}
```

### 12.9 Sync Flow

```
+---------------------+
|   Perubahan Data    |
|   (Create/Update)   |
+---------------------+
         |
         v
+---------------------+
|   Simpan ke Local   |  ← Langsung ke IndexedDB
+---------------------+
         |
         v
+---------------------+
|   Enqueue ke Sync   |
|   Queue             |
+---------------------+
         |
         v
+---------------------+
|   Cek Koneksi       |
+---------------------+
    |           |
    v           v
Online      Offline
    |           |
    v           v
+----------+  +-----------+
| Push to  |  | Wait in   |
| Server   |  | Queue     |
+----------+  +-----------+
    |
    v
+----------+
| Update   |
| Status   |
+----------+
```

---

## 13. Import Contract

### 13.1 Supported Formats

| Format | Extension | Library | Status |
|--------|-----------|---------|--------|
| Excel | `.xlsx`, `.xls` | SheetJS (XLSX) | ✅ Active |
| CSV | `.csv` | SheetJS | ⏳ Planned |
| JSON | `.json` | Native | ⏳ Planned |

### 13.2 Import Response

```
{
  success: true,
  message: "Import selesai",
  data: {
    totalRows: 150,
    successCount: 147,
    failedCount: 3,
    failedRows: [
      { row: 12, errors: ["SKU sudah ada: PRD-0001"] },
      { row: 45, errors: ["Nama tidak boleh kosong"] },
      { row: 88, errors: ["Harga beli harus >= 0"] }
    ],
    importedRecords: [ ... ]
  },
  errors: null,
  meta: { ... }
}
```

### 13.3 Validation Before Import

Sebelum import, sistem melakukan:

1. **Header validation**: memastikan kolom yang diperlukan ada
2. **Row validation**: memvalidasi setiap baris data
3. **Duplicate check**: memeriksa SKU/kode unik
4. **Reference check**: memastikan foreign key valid

Jika ditemukan error, sistem tetap memproses baris yang valid dan melaporkan baris yang gagal.

### 13.4 Rollback Strategy

Import dapat di-rollback jika:

1. Semua baris gagal validasi (tidak ada data yang diimpor)
2. Pengguna memilih batal setelah preview

Rollback tidak dilakukan otomatis untuk import sukses sebagian (partial import).

### 13.5 Duplicate Handling

| Mode | Behavior |
|------|----------|
| `skip` | Lewati baris duplikat, laporkan di failedRows |
| `update` | Update data yang sudah ada |
| `error` | Hentikan import, rollback |
| Default | `skip` |

### 13.6 Preview

Preview memungkinkan pengguna melihat hasil import sebelum dieksekusi:

```
Preview Response:
{
  data: {
    totalRows: 150,
    validRows: 147,
    invalidRows: 3,
    newRecords: 140,
    updatedRecords: 7,
    skippedRecords: 3,
    preview: [ ... 5 sample rows ... ],
    errors: [ ... ]
  }
}
```

### 13.7 Per-Entity Import Mapping

#### Product Import

| Excel Column | DTO Field | Required | Format |
|-------------|-----------|----------|--------|
| Kode | `sku` | No (auto) | Text |
| Barcode | `barcode` | No | Text |
| Nama | `name` | Yes | Text |
| Kategori | `categoryName` | No | Text (matched by name) |
| Satuan | `unitName` | No | Text (matched by name) |
| Harga Beli | `buyPrice` | Yes | Number |
| Harga Jual | `sellPrice` | Yes | Number |
| Stok | `stock` | No | Number |
| Stok Min | `minStock` | No | Number |

#### Supplier Import

| Excel Column | DTO Field | Required |
|-------------|-----------|----------|
| Kode | `code` | No (auto) |
| Nama | `name` | Yes |
| Telepon | `phone` | No |
| Email | `email` | No |
| Alamat | `address` | No |
| Kontak Person | `contactPerson` | No |

---

## 14. Export Contract

### 14.1 Supported Formats

| Format | Extension | Library | Status |
|--------|-----------|---------|--------|
| Excel | `.xlsx` | SheetJS | ✅ Active |
| PDF | `.pdf` | jsPDF | ✅ Active |
| CSV | `.csv` | SheetJS | ⏳ Planned |
| JSON | `.json` | Native | ⏳ Planned |

### 14.2 Export Options

```
{
  format: "xlsx" | "pdf" | "csv" | "json",
  filters: { ... },          // Filter data yang akan diexport
  fields: string[],          // Field yang akan disertakan
  sort: string | [string, string],
  dateRange: {
    fromDate: string,
    toDate: string
  },
  includeDeleted: boolean,   // Sertakan data yang sudah dihapus
  limit: number             // Batas maksimal record
}
```

### 14.3 Per-Entity Export Mapping

#### Product Export (Default Fields)

| Column | DTO Field | Format |
|--------|-----------|--------|
| Kode | `sku` | Text |
| Barcode | `barcode` | Text |
| Nama | `name` | Text |
| Kategori | `categoryName` | Text (lookup) |
| Satuan | `unitName` | Text (lookup) |
| Harga Beli | `buyPrice` | Currency (Rp) |
| Harga Jual | `sellPrice` | Currency (Rp) |
| Stok | `stock` | Number |
| Stok Min | `minStock` | Number |
| Status | `isActive` | "Aktif" / "Nonaktif" |

#### Sale Report Export

| Column | DTO Field | Format |
|--------|-----------|--------|
| Invoice | `invoiceNumber` | Text |
| Tanggal | `saleDate` | Date (dd/mm/yyyy) |
| Pelanggan | `customerName` | Text |
| Total Item | Item count | Number |
| Subtotal | `subtotal` | Currency |
| Diskon | `discount` | Currency |
| Total | `grandTotal` | Currency |
| Status Bayar | `paymentStatus` | "Lunas" / "Belum" |
| Metode | `paymentMethod` | Text |

### 14.4 Export File Naming

Format: `{entity}-{date}-{timestamp}.{ext}`

Contoh: `products-20260115-103000.xlsx`

### 14.5 Export Size Limit

| Format | Max Records | Notes |
|--------|------------|-------|
| Excel | 100,000 | SheetJS limit |
| PDF | 5,000 | Performance |
| CSV | 500,000 | Row limit |
| JSON | Unlimited | Stream |

---

## 15. Security Contract

### 15.1 Authentication

**Current (Offline):**
- Login dengan username + password
- Password disimpan dengan hash (SHA-256) di IndexedDB
- Session disimpan di localStorage
- Session timeout setelah idle (configurable via settings)

**Future (Online):**
- JWT Token dari server
- OAuth2 / OpenID Connect
- Refresh token rotation
- MFA support

### 15.2 Authorization Model

```
+----------+         +----------+         +-------------+
|   User   |  has    |   Role   |  has    | Permission  |
+----------+         +----------+         +-------------+
| id       | ------> | id       | ------> | id          |
| username |         | name     |         | roleId      |
| roleId   |         | isSystem |         | module      |
+----------+         +----------+         | action      |
                                          +-------------+
```

### 15.3 Permission Structure

Format: `{module}:{action}`

| Module | Actions |
|--------|---------|
| `product` | `create`, `read`, `update`, `delete`, `import`, `export` |
| `category` | `create`, `read`, `update`, `delete` |
| `supplier` | `create`, `read`, `update`, `delete` |
| `customer` | `create`, `read`, `update`, `delete` |
| `purchase` | `create`, `read`, `update`, `delete`, `approve`, `receive` |
| `sales` | `create`, `read`, `update`, `delete`, `refund` |
| `inventory` | `read`, `adjust`, `opname` |
| `report` | `read`, `export` |
| `user` | `create`, `read`, `update`, `delete` |
| `role` | `create`, `read`, `update`, `delete` |
| `settings` | `read`, `update` |
| `shift` | `open`, `close`, `read` |
| `sync` | `push`, `pull` |

Role wildcard: `*` berarti semua aksi. Contoh: `product:*` berarti akses penuh ke modul produk.

### 15.4 Session Management

| Atribut | Value |
|---------|-------|
| Storage | localStorage |
| Key | `session:current` |
| Format | `{ userId, username, roleId, permissions[], loginAt, expiresAt }` |
| Duration | 8 jam (configurable) |
| Idle timeout | 30 menit (configurable) |
| Lock screen | Ya, setelah idle timeout |

### 15.5 Token (Future)

Saat aplikasi terhubung ke server, autentikasi menggunakan JWT:

```
{
  accessToken: "eyJhbGciOiJI...",
  refreshToken: "dGhpcyBpcyBh...",
  expiresIn: 3600,
  tokenType: "Bearer"
}
```

### 15.6 Security Best Practices

1. Password minimal 8 karakter
2. Lock screen setelah idle
3. Audit log untuk semua operasi kritis
4. Session dihapus saat logout
5. Data sensitif tidak disimpan di URL
6. Semua input di-trim dan di-escape

---

## 16. Audit Contract

### 16.1 Standard Audit Fields

Setiap entitas memiliki audit fields berikut:

```
{
  createdBy: string | null,      // User ID yang membuat
  updatedBy: string | null,      // User ID yang terakhir mengupdate
  deletedBy: string | null,      // User ID yang menghapus
  createdAt: string,             // ISO 8601
  updatedAt: string,             // ISO 8601
  deletedAt: string | null,      // ISO 8601, null jika tidak dihapus
  deviceId: string | null        // Device ID (untuk sync tracking)
}
```

### 16.2 Audit Log

Untuk operasi bisnis kritis, buat record di tabel auditLogs:

```
{
  id: string (UUID),
  userId: string,
  action: string,          // "create", "update", "delete", "approve", "cancel"
  entityType: string,      // "product", "purchase", "sale"
  entityId: string,
  previousValue: object,   // Data sebelum perubahan (untuk update)
  newValue: object,        // Data setelah perubahan
  ipAddress: string | null,
  deviceId: string | null,
  userAgent: string | null,
  timestamp: string
}
```

### 16.3 Activity Log

Untuk aktivitas non-kritis, gunakan activityLogs:

```
{
  id: string (UUID),
  userId: string,
  activity: string,        // "login", "logout", "view_report", "export_data"
  module: string,          // "auth", "report", "product"
  level: string,           // "info", "warning", "error"
  details: object | null,
  timestamp: string
}
```

### 16.4 Auditable Actions

| Action | Audit Log | Activity Log |
|--------|-----------|-------------|
| Login | — | ✅ |
| Logout | — | ✅ |
| Create product | ✅ | ✅ |
| Update product | ✅ | ✅ |
| Delete product | ✅ | ✅ |
| Create purchase | ✅ | ✅ |
| Approve purchase | ✅ | ✅ |
| Receive purchase | ✅ | ✅ |
| Complete sale | ✅ | ✅ |
| Refund sale | ✅ | ✅ |
| Adjust stock | ✅ | ✅ |
| Close shift | ✅ | ✅ |
| Export data | — | ✅ |
| Import data | ✅ | ✅ |
| Change settings | ✅ | ✅ |
| Create user | ✅ | ✅ |

---

## 17. Versioning

### 17.1 API Version

Format: `v{MAJOR}`

- Current version: `v1`
- Versi ditentukan di settings dengan key `api-version`
- Versi ditingkatkan saat ada breaking change pada kontrak

### 17.2 Repository Version

Setiap repository dapat memiliki versi yang dilacak:

```
{
  tableName: "products",
  schemaVersion: 2,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
  migrationScript: "m002_add_type_field.js"
}
```

### 17.3 Migration Strategy

```
+------------------+
|   Schema v1      |
+------------------+
         |
         v
+------------------+
|   Migration      |  ← migrate-v1-to-v2.js
|   Script         |
+------------------+
         |
         v
+------------------+
|   Schema v2      |
+------------------+
```

**Migration rules:**

1. Setiap migrasi harus idempotent
2. Migrasi berjalan di `db.version().upgrade()`
3. Data tidak boleh hilang saat migrasi
4. Downgrade tidak didukung (hanya maju)
5. Migration log disimpan di `backupMetadata`

### 17.4 Backward Compatibility

| Perubahan | Backward Compatible? | Version Impact |
|-----------|---------------------|----------------|
| Menambah field baru | ✅ Ya | Minor |
| Menambah method baru | ✅ Ya | Minor |
| Menambah enum value | ✅ Ya | Patch |
| Mengubah tipe field | ❌ Tidak | Major |
| Menghapus field | ❌ Tidak | Major |
| Mengubah method signature | ❌ Tidak | Major |
| Menghapus method | ❌ Tidak | Major |
| Rename field | ❌ Tidak | Major |
| Bug fix (tidak ubah kontrak) | ✅ Ya | Patch |

### 17.5 Deprecation Policy

1. Field/method yang di-deprecate diberi label `@deprecated` di dokumentasi
2. Deprecated field tetap berfungsi selama 2 rilis minor
3. Setelah 2 rilis minor, field dapat dihapus di major berikutnya

---

## 18. Future REST API Mapping

### 18.1 Base URL

```
https://api.toko-saya.com/v1
```

### 18.2 Authentication Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/refresh` | Refresh token |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/me` | Profile user saat ini |

**Request:**
```
POST /auth/login
{
  username: "admin",
  password: "*****",
  deviceId: "device-uuid-xxx"
}
```

**Response:**
```
{
  success: true,
  data: {
    accessToken: "eyJhbGciOiJI...",
    refreshToken: "...",
    expiresIn: 3600,
    user: { id, username, name, roleId }
  }
}
```

### 18.3 Product Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/products` | `getAll({ search, sort, pagination })` |
| `GET` | `/products/{id}` | `getById(id)` |
| `POST` | `/products` | `create(data)` |
| `PUT` | `/products/{id}` | `update(id, data)` |
| `DELETE` | `/products/{id}` | `delete(id)` |
| `GET` | `/products/search` | `search(keyword, options)` |
| `GET` | `/products/{id}/stock` | `getStock(id)` |
| `POST` | `/products/import` | `importFromExcel(file)` |
| `GET` | `/products/export` | `exportToExcel()` |

**Request:**
```
GET /products?page=1&pageSize=20&sort=name&order=asc&search=beras&categoryId=cat-sembako
```

**Response:**
```
{
  success: true,
  data: [ ... ],
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 45,
    totalPages: 3
  }
}
```

### 18.4 Category Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/categories` | `getAll()` |
| `GET` | `/categories/{id}` | `getById(id)` |
| `POST` | `/categories` | `create(data)` |
| `PUT` | `/categories/{id}` | `update(id, data)` |
| `DELETE` | `/categories/{id}` | `delete(id)` |

### 18.5 Supplier Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/suppliers` | `getAll()` |
| `GET` | `/suppliers/{id}` | `getById(id)` |
| `POST` | `/suppliers` | `create(data)` |
| `PUT` | `/suppliers/{id}` | `update(id, data)` |
| `DELETE` | `/suppliers/{id}` | `delete(id)` |

### 18.6 Customer Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/customers` | `getAll()` |
| `GET` | `/customers/{id}` | `getById(id)` |
| `POST` | `/customers` | `create(data)` |
| `PUT` | `/customers/{id}` | `update(id, data)` |
| `DELETE` | `/customers/{id}` | `delete(id)` |

### 18.7 Purchase Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/purchases` | `getAll({ search, status, pagination })` |
| `GET` | `/purchases/{id}` | `getById(id)` |
| `POST` | `/purchases` | `create(data)` |
| `PUT` | `/purchases/{id}` | `update(id, data)` |
| `DELETE` | `/purchases/{id}` | `delete(id)` |
| `PUT` | `/purchases/{id}/status` | `updateStatus(id, status)` |
| `GET` | `/purchases/{id}/items` | `getItems(id)` |

### 18.8 Sales Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/sales` | `getAll({ search, paymentStatus, pagination })` |
| `GET` | `/sales/{id}` | `getById(id)` |
| `POST` | `/sales` | `create(data)` |
| `DELETE` | `/sales/{id}` | `delete(id)` |
| `POST` | `/sales/{id}/payment` | `addPayment(id, data)` |
| `POST` | `/sales/{id}/refund` | `refund(id)` |

### 18.9 Inventory Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/inventory` | `getAllProducts()` |
| `GET` | `/inventory/{productId}` | `getStock(productId)` |
| `POST` | `/inventory/adjust` | `adjustStock(data)` |
| `GET` | `/inventory/movements` | `getMovements(filters)` |
| `POST` | `/inventory/opname` | `startOpname(data)` |

### 18.10 Recipe Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/recipes` | `getAll()` |
| `GET` | `/recipes/{id}` | `getById(id)` |
| `POST` | `/recipes` | `create(data)` |
| `PUT` | `/recipes/{id}` | `update(id, data)` |
| `DELETE` | `/recipes/{id}` | `delete(id)` |
| `POST` | `/recipes/{id}/execute` | `execute(id, quantity)` |

### 18.11 Report Endpoints

| Method | Endpoint | Maps to Service |
|--------|----------|----------------|
| `GET` | `/reports/sales-summary` | `getSalesSummary(from, to)` |
| `GET` | `/reports/purchase-summary` | `getPurchaseSummary(from, to)` |
| `GET` | `/reports/stock-summary` | `getStockSummary()` |
| `GET` | `/reports/top-products` | `getTopProducts(limit)` |
| `GET` | `/reports/profit-loss` | `getProfitLoss(from, to)` |
| `GET` | `/reports/daily` | `getDailyReport(date)` |

### 18.12 Sync Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/sync/push` | Kirim perubahan lokal ke server |
| `POST` | `/sync/pull` | Ambil perubahan dari server |
| `GET` | `/sync/status` | Status sinkronasi |
| `POST` | `/sync/resolve` | Resolusi konflik |

### 18.13 User & Role Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/users` | List users |
| `POST` | `/users` | Create user |
| `PUT` | `/users/{id}` | Update user |
| `DELETE` | `/users/{id}` | Delete user |
| `GET` | `/roles` | List roles |
| `POST` | `/roles` | Create role |
| `PUT` | `/roles/{id}` | Update role |
| `DELETE` | `/roles/{id}` | Delete role |

### 18.14 Settings Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/settings` | List semua settings |
| `GET` | `/settings/{key}` | Get setting by key |
| `PUT` | `/settings/{key}` | Update setting |

### 18.15 Shift Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/shifts` | List shifts |
| `POST` | `/shifts` | Open shift |
| `PUT` | `/shifts/{id}/close` | Close shift |

---

## 19. Future GraphQL Mapping

### 19.1 Schema Structure

```
type Query {
  # Product
  product(id: ID!): Product
  products(filter: ProductFilter, pagination: PaginationInput): ProductConnection!

  # Category
  categories(filter: CategoryFilter): [Category!]!

  # Supplier
  supplier(id: ID!): Supplier
  suppliers(filter: SupplierFilter, pagination: PaginationInput): SupplierConnection!

  # Customer
  customer(id: ID!): Customer
  customers(filter: CustomerFilter, pagination: PaginationInput): CustomerConnection!

  # Purchase
  purchase(id: ID!): Purchase
  purchases(filter: PurchaseFilter, pagination: PaginationInput): PurchaseConnection!

  # Sale
  sale(id: ID!): Sale
  sales(filter: SaleFilter, pagination: PaginationInput): SaleConnection!

  # Inventory
  inventory(productId: ID!): Inventory
  stockMovements(filter: StockMovementFilter): [StockMovement!]!

  # Recipe
  recipe(id: ID!): Recipe
  recipes(filter: RecipeFilter): [Recipe!]!

  # Report
  salesSummary(fromDate: String!, toDate: String!): SalesSummary!
  stockSummary: StockSummary!
  topProducts(limit: Int): [ProductSales!]!

  # Auth
  me: User

  # Settings
  settings: [Setting!]!
  setting(key: String!): Setting
}

type Mutation {
  # Product
  createProduct(input: CreateProductInput!): ProductMutationResult!
  updateProduct(id: ID!, input: UpdateProductInput!): ProductMutationResult!
  deleteProduct(id: ID!): DeleteResult!

  # Supplier
  createSupplier(input: CreateSupplierInput!): SupplierMutationResult!
  updateSupplier(id: ID!, input: UpdateSupplierInput!): SupplierMutationResult!
  deleteSupplier(id: ID!): DeleteResult!

  # Customer
  createCustomer(input: CreateCustomerInput!): CustomerMutationResult!
  updateCustomer(id: ID!, input: UpdateCustomerInput!): CustomerMutationResult!
  deleteCustomer(id: ID!): DeleteResult!

  # Purchase
  createPurchase(input: CreatePurchaseInput!): PurchaseMutationResult!
  updatePurchaseStatus(id: ID!, status: PurchaseStatus!): PurchaseMutationResult!
  deletePurchase(id: ID!): DeleteResult!

  # Sale
  createSale(input: CreateSaleInput!): SaleMutationResult!
  deleteSale(id: ID!): DeleteResult!

  # Inventory
  adjustStock(input: AdjustStockInput!): StockMutationResult!
  startOpname(input: StartOpnameInput!): OpnameResult!

  # Recipe
  createRecipe(input: CreateRecipeInput!): RecipeMutationResult!
  executeRecipe(id: ID!, quantity: Int!): RecipeExecutionResult!

  # Auth
  login(input: LoginInput!): AuthResult!
  refreshToken(refreshToken: String!): AuthResult!

  # Sync
  syncPush(input: SyncPushInput!): SyncPushResult!
}

type Subscription {
  stockChanged(productId: ID): StockChangedEvent!
  saleCompleted: SaleEvent!
  lowStockAlert: LowStockEvent!
}
```

### 19.2 Example Queries

**Get products with pagination and filter:**
```graphql
query GetProducts {
  products(
    filter: { search: "beras", categoryId: "cat-sembako", isActive: true },
    pagination: { page: 1, pageSize: 20, sort: "name", order: "asc" }
  ) {
    edges {
      id
      sku
      name
      buyPrice
      sellPrice
      stock
      category { name }
      unit { name }
      supplier { name }
    }
    pagination {
      page
      pageSize
      totalItems
      totalPages
    }
  }
}
```

**Get single sale with items:**
```graphql
query GetSale($id: ID!) {
  sale(id: $id) {
    id
    invoiceNumber
    customerName
    saleDate
    grandTotal
    paymentStatus
    paymentMethod
    items {
      productName
      quantity
      unitPrice
      subtotal
    }
    payments {
      method
      amount
    }
  }
}
```

**Get report summary:**
```graphql
query GetReport($fromDate: String!, $toDate: String!) {
  salesSummary(fromDate: $fromDate, toDate: $toDate) {
    totalSales
    totalRevenue
    paidCount
    unpaidCount
  }
  stockSummary {
    totalProducts
    lowStock { id name stock minStock }
    outOfStock { id name }
    totalStockValue
  }
  topProducts(limit: 5) {
    productName
    sku
    qty
    revenue
  }
}
```

### 19.3 Example Mutations

**Create product:**
```graphql
mutation CreateProduct {
  createProduct(input: {
    sku: "PRD-0021"
    name: "Produk Baru"
    buyPrice: 50000
    sellPrice: 65000
    categoryId: "cat-sembako"
    unitId: "unit-kg"
    stock: 10
    minStock: 5
    supplierId: "sup-makmur"
  }) {
    success
    data {
      id
      sku
      name
      createdAt
    }
    errors
  }
}
```

**Execute recipe:**
```graphql
mutation ExecuteRecipe {
  executeRecipe(id: "rcp-001", quantity: 5) {
    success
    data {
      productId
      productName
      yield
      ingredients {
        productName
        quantityUsed
        stockAfter
      }
    }
  }
}
```

### 19.4 Example Subscription

```graphql
subscription OnLowStock {
  lowStockAlert {
    productId
    sku
    productName
    currentStock
    minStock
  }
}
```

### 19.5 Type Definitions

```graphql
# Pagination
input PaginationInput {
  page: Int = 1
  pageSize: Int = 10
  sort: String
  order: SortOrder = asc
}

enum SortOrder {
  asc
  desc
}

type PaginationInfo {
  page: Int!
  pageSize: Int!
  totalItems: Int!
  totalPages: Int!
}

# Standard Result
interface MutationResult {
  success: Boolean!
  message: String
  errors: [String!]
}

type DeleteResult {
  success: Boolean!
  message: String
}

# Product
type Product {
  id: ID!
  sku: String!
  barcode: String
  name: String!
  category: Category
  unit: Unit
  buyPrice: Float!
  sellPrice: Float!
  stock: Int!
  minStock: Int!
  supplier: Supplier
  type: String!
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type ProductConnection {
  edges: [Product!]!
  pagination: PaginationInfo!
}

input ProductFilter {
  search: String
  categoryId: ID
  supplierId: ID
  isActive: Boolean
  type: String
}

input CreateProductInput {
  sku: String
  barcode: String
  name: String!
  categoryId: ID
  unitId: ID
  buyPrice: Float!
  sellPrice: Float!
  stock: Int
  minStock: Int
  supplierId: ID
  type: String
  isActive: Boolean
}

input UpdateProductInput {
  name: String
  buyPrice: Float
  sellPrice: Float
  stock: Int
  minStock: Int
  isActive: Boolean
}

type ProductMutationResult implements MutationResult {
  success: Boolean!
  message: String
  data: Product
  errors: [String!]
}

# Sale
type Sale {
  id: ID!
  invoiceNumber: String!
  customerName: String
  saleDate: String!
  subtotal: Float!
  discount: Float!
  tax: Float!
  grandTotal: Float!
  paymentStatus: String!
  paymentMethod: String
  items: [SaleItem!]!
  payments: [Payment!]!
  createdAt: String!
}

type SaleItem {
  id: ID!
  productName: String!
  quantity: Int!
  unitPrice: Float!
  subtotal: Float!
}

type Payment {
  id: ID!
  method: String!
  amount: Float!
}

input CreateSaleInput {
  customerId: ID
  items: [CreateSaleItemInput!]!
  payments: [CreatePaymentInput!]
}

input CreateSaleItemInput {
  productId: ID!
  quantity: Int!
  unitPrice: Float!
}

# Report
type SalesSummary {
  totalSales: Int!
  totalRevenue: Float!
  paidCount: Int!
  unpaidCount: Int!
}

type StockSummary {
  totalProducts: Int!
  lowStock: [Product!]!
  outOfStock: [Product!]!
  totalStockValue: Float!
  totalSellValue: Float!
}

# Event / Subscription
type StockChangedEvent {
  productId: ID!
  sku: String!
  productName: String!
  previousStock: Int!
  newStock: Int!
  change: Int!
  referenceType: String!
  timestamp: String!
}

type LowStockEvent {
  productId: ID!
  sku: String!
  productName: String!
  currentStock: Int!
  minStock: Int!
}

type SaleEvent {
  saleId: ID!
  invoiceNumber: String!
  grandTotal: Float!
  timestamp: String!
}
```

---

## 20. Best Practices

### 20.1 SOLID Principles

| Principle | Implementation |
|-----------|---------------|
| **S**ingle Responsibility | Setiap service memiliki satu tanggung jawab bisnis |
| **O**pen/Closed | Service dapat diperluas dengan hook tanpa diubah |
| **L**iskov Substitution | Semua repository dapat digantikan oleh implementasi lain |
| **I**nterface Segregation | Kontrak dipisah per modul, tidak ada god interface |
| **D**ependency Inversion | Service tergantung pada abstraksi (repository interface) |

### 20.2 DRY (Don't Repeat Yourself)

- BaseRepository mengimplementasikan CRUD standar
- Service hooks (beforeCreate/afterCreate) reusable
- Validasi dipisah ke `*-validator.js`
- Utility functions di `*-utils.js`
- Format response konsisten melalui helper

### 20.3 KISS (Keep It Simple, Stupid)

- Repository hanya melakukan query, tidak ada logika bisnis
- Service hanya melakukan orkestrasi, tidak ada query langsung
- Validasi dipisah dari service logic
- Event handling asynchronous
- Sync queue sederhana (FIFO)

### 20.4 Repository Pattern

```
+--------------+      +--------------+      +--------------+
|   Service    | ---> |  Repository  | ---> |  IndexedDB   |
|              |      |              |      |  (Dexie)     |
|  Business    |      |  Data Query  |      |  Storage     |
|  Logic       |      |  Pagination  |      |              |
|  Validation  |      |  Sorting     |      |              |
+--------------+      +--------------+      +--------------+
```

### 20.5 Service Layer

```
+--------------+      +--------------+      +--------------+
|   Controller | ---> |   Service    | ---> |  Repository  |
|   (Router)   |      |              |      |              |
|              |      |  Validasi    |      |  Data Access |
|  Input       |      |  Transform   |      |              |
|  Parsing     |      |  Orchestrate |      |              |
+--------------+      +--------------+      +--------------+
```

### 20.6 Dependency Injection

```
// Konseptual — bukan source code
class ProductService {
  // Menerima repository melalui constructor
  constructor(repository, eventBus, validator) {
    this.repository = repository
    this.eventBus = eventBus
    this.validator = validator
  }

  create(data) {
    errors = this.validator.validate(data)
    if errors.length > 0 return { success: false, errors }

    record = this.repository.create(data)

    this.eventBus.emit("product:created", record)

    return { success: true, data: record }
  }
}
```

### 20.7 DTO (Data Transfer Object)

- DTO adalah objek polos (plain object), bukan class instance
- DTO hanya berisi data, tidak ada method
- DTO digunakan untuk input dan output service
- DTO menjamin konsistensi format data antar lapisan

### 20.8 Offline First

- Semua operasi berjalan di IndexedDB lokal
- Tidak ada loading state untuk data lokal
- Sync berjalan di background tanpa mengganggu UX
- Data dapat diakses tanpa koneksi internet
- Konflik diselesaikan dengan LWW (Last Write Wins)

### 20.9 Clean Architecture

```
+------------------------------+
|         UI Layer             |
|  (Pages, Components)         |
+------------------------------+
         |         ^
         v         |
+------------------------------+
|      Service Layer           |  ← Business Logic
|  (Services, Validators)      |
+------------------------------+
         |         ^
         v         |
+------------------------------+
|     Repository Layer         |  ← Data Access
|  (BaseRepository, impl)      |
+------------------------------+
         |         ^
         v         |
+------------------------------+
|   Data Source Layer          |  ← IndexedDB / API
|  (Dexie, Fetch)              |
+------------------------------+
```

### 20.10 Error Handling

- Jangan pernah throw error mentah ke UI
- Tangkap error di service layer
- Kembalikan Standard Response dengan errors array
- Log error ke auditLogs untuk debugging
- Jangan tampilkan technical error ke user

### 20.11 Testing Strategy

| Layer | Testing Approach |
|-------|-----------------|
| Validator | Unit test (input → expected errors) |
| Repository | Integration test (create → read → update → delete) |
| Service | Unit test dengan mock repository |
| Page | Integration test (render → interact → verify) |
| Sync | Integration test (local → server round trip) |

---

*Dokumen ini adalah kontrak resmi komunikasi antar modul POS Offline PWA. Seluruh pengembangan modul baru harus mengikuti kontrak ini untuk menjaga konsistensi dan interoperability.*

*EOF — 18_API_CONTRACT.md*
