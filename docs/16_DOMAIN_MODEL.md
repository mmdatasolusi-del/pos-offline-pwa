# Domain Model — POS Offline PWA

> **Pendekatan:** Domain-Driven Design (DDD) untuk Point of Sale 100% offline.
>
> **Tujuan:** Pedoman bagi seluruh developer dan AI — memahami konsep, aturan bisnis, dan arsitektur.

---

## Table of Contents

1. [Pendahuluan DDD](#1-pendahuluan-ddd)
2. [Bounded Context](#2-bounded-context)
3. [Domain Detail](#3-domain-detail)
4. [Lifecycle](#4-lifecycle)
5. [Architectural Pattern](#5-architectural-pattern)
6. [Prinsip Desain](#6-prinsip-desain)
7. [Coding Standard](#7-coding-standard)
8. [Lampiran: Matrix Domain](#8-lampiran-matrix-domain)

---

## 1. Pendahuluan DDD

### 1.1 Apa itu Domain?

Domain adalah area pengetahuan dan aktivitas bisnis. Dalam POS Offline PWA, domain adalah:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     POS OFFLINE PWA — DOMAIN MAP                     │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CORE DOMAIN                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  Item    │  │  Sale    │  │ Purchase │  │  Inventory   │  │  │
│  │  │ (Produk) │  │(Penjualan)│  │ (Pembelian)│  │ (Stok)      │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   SUPPORTING DOMAIN                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │   User   │  │   Role   │  │Settings  │  │  Cash Session│  │  │
│  │  │(Pengguna)│  │  (Jabatan)│  │(Konfig)  │  │  (Shift Kas) │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   GENERIC DOMAIN                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  Dashboard│  │  Report  │  │  Audit   │  │  Payment     │  │  │
│  │  │ (Beranda) │  │ (Laporan)│  │ (Log)    │  │ (Pembayaran) │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Ubiquitous Language

Semua istilah dalam kode, database, dan dokumen menggunakan bahasa yang sama:

| DDD Term | Bahasa | Database | Kode |
|----------|--------|----------|------|
| Item | Produk / Barang | `products` | `ProductService` |
| Sale | Penjualan | `sales` | `SalesService` |
| Purchase | Pembelian | `purchases` | `PurchaseService` |
| Stock Movement | Mutasi Stok | `stock_movements` | `StockMovement` |
| Cash Session | Shift Kas | `cash_sessions` | `CashSession` |
| Recipe | Resep | `recipes` | `RecipeService` |

### 1.3 Domain Event

Event adalah notifikasi bahwa sesuatu terjadi di domain lain:

```
sale.created        → Inventory.updateStock()
purchase.received   → Inventory.updateStock() + Dashboard.refresh()
item.priceChanged   → Recipe.recalculateHPP()
user.loggedIn       → CashSession.verify()
stock.belowMinimum  → Notification.alert()
```

---

## 2. Bounded Context

### 2.1 Context Map

```
┌─────────────────────────┐      ┌─────────────────────────┐
│   CONTEXT: MASTER DATA  │      │  CONTEXT: TRANSACTION   │
│                         │      │                         │
│  Item                   │      │  Sale                   │
│  Category               │◄─────│  Sale Detail            │
│  Unit                   │      │  Purchase               │
│  Supplier               │─────►│  Purchase Detail        │
│  Customer               │      │  Payment                │
│  Warehouse              │      │  Cash Session           │
└─────────────────────────┘      └──────────┬──────────────┘
         │                                   │
         │                                   ▼
         │                         ┌─────────────────────────┐
         │                         │  CONTEXT: INVENTORY     │
         │                         │                         │
         └────────────────────────►│  Stock Movement         │
                                   │  Stock Balance          │
                                   │  Recipe                 │
                                   │  Recipe Detail          │
                                   └─────────────────────────┘
```

### 2.2 Dependency Graph

```
CONTEXT MASTER DATA ──► CONTEXT TRANSACTION ──► CONTEXT INVENTORY
       │                                                  │
       └──────────────────► CONTEXT REPORT ◄──────────────┘
                                   │
                                   ▼
                          CONTEXT DASHBOARD
```

### 2.3 Aturan Dependency

- **Master Data** tidak boleh bergantung pada Transaction atau Inventory
- **Transaction** bergantung pada Master Data (Item, Customer, Supplier)
- **Inventory** bergantung pada Transaction (Sale, Purchase) dan Master Data (Item)
- **Report** bergantung pada semua context (read-only)
- **Dashboard** bergantung pada Report (read-only aggregation)

```
✅ BENAR:
  SaleService → ItemRepository (membaca data item)
  PurchaseService → SupplierRepository (membaca data supplier)

❌ SALAH:
  ItemService → SaleRepository (item tidak perlu tahu penjualan)
  CategoryService → ProductService (category tidak bergantung product)
```

---

## 3. Domain Detail

### 3.1 Item Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola semua produk, bahan baku, jasa — Universal Item |
| **Tanggung Jawab** | CRUD produk, generate SKU, validasi data, import/export Excel |
| **Business Rules** | SKU harus unique; Harga jual >= Harga beli; Stok minimal tidak boleh negatif; Item dengan tipe `RECIPE_PRODUCT` harus memiliki recipe; Item dengan tipe `SERVICE` tidak memiliki stok |
| **Validation Rules** | `name` wajib; `buyPrice` >= 0; `sellPrice` >= 0; `stock` >= 0 (jika `FINISHED_PRODUCT`); `type` harus salah satu dari 5 tipe yang ditentukan |
| **Dependencies** | Category, Unit, Supplier (opsional) |
| **Repository** | `ProductRepository` extends `BaseRepository` — tambahan method: `search()`, `getNextSku()`, `getAllCategories()`, `getAllUnits()` |
| **Service** | `ProductService` — `create()`, `update()`, `delete()`, `validate()`, `exportToExcel()`, `importFromExcel()`, `findBySku()` |
| **UI** | `products-page.js` — tabel + search + sort + pagination + modal form |

### 3.2 Category Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelompokkan item ke dalam kategori hierarkis |
| **Tanggung Jawab** | CRUD kategori, parent-child relationship |
| **Business Rules** | Nama kategori tidak boleh duplikat dalam satu level; Circular reference tidak diperbolehkan (parentId != id); Kategori yang memiliki item tidak bisa dihapus (harus diarsipkan) |
| **Validation Rules** | `name` wajib; `parentId` tidak boleh sama dengan `id` |
| **Dependencies** | Self-referencing (parentId → categories.id) |
| **Repository** | `BaseRepository` — getAll dengan filter parentId |
| **Service** | `CategoryService` — CRUD + validasi circular reference |
| **UI** | Settings → categories-page |

### 3.3 Unit Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mendefinisikan satuan ukuran item (pcs, kg, liter, pack) |
| **Tanggung Jawab** | CRUD satuan, digunakan sebagai referensi item |
| **Business Rules** | Nama satuan tidak boleh duplikat; Satuan yang sudah dipakai item tidak bisa dihapus (soft delete) |
| **Validation Rules** | `name` wajib; `abbreviation` wajib |
| **Dependencies** | — |
| **Repository** | `BaseRepository` |
| **Service** | `UnitService` |
| **UI** | Settings → units-page |

### 3.4 Supplier Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola data pemasok / vendor |
| **Tanggung Jawab** | CRUD supplier, digunakan sebagai referensi purchase dan item |
| **Business Rules** | Kode supplier unique; Supplier yang memiliki transaksi tidak bisa dihapus (soft delete) |
| **Validation Rules** | `name` wajib; `phone` opsional |
| **Dependencies** | — |
| **Repository** | `BaseRepository` |
| **Service** | `SupplierService` |
| **UI** | Settings → suppliers-page |

### 3.5 Customer Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola data pelanggan |
| **Tanggung Jawab** | CRUD customer, digunakan sebagai referensi sales |
| **Business Rules** | Customer bisa memiliki membership; Nomor member unique; Poin loyalty bisa dikumpulkan |
| **Validation Rules** | `name` wajib; `phone` opsional |
| **Dependencies** | — |
| **Repository** | `BaseRepository` |
| **Service** | `CustomerService` |
| **UI** | Settings → customers-page |

### 3.6 Warehouse Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola lokasi penyimpanan barang |
| **Tanggung Jawab** | CRUD warehouse, digunakan sebagai referensi stock movement |
| **Business Rules** | Kode warehouse unique; Minimal satu warehouse default harus ada; Warehouse yang memiliki stok tidak bisa dihapus (soft delete) |
| **Validation Rules** | `name` wajib; `code` wajib unique |
| **Dependencies** | — |
| **Repository** | `BaseRepository` |
| **Service** | `WarehouseService` |
| **UI** | Settings → warehouse-page |

### 3.7 User Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola pengguna aplikasi |
| **Tanggung Jawab** | CRUD user, autentikasi login/logout, manajemen sesi |
| **Business Rules** | Username unique; Password di-hash SHA-256; User default (Owner, Admin, Kasir) dibuat saat inisialisasi; User non-aktif tidak bisa login |
| **Validation Rules** | `username` wajib unique; `password` min 6 karakter; `roleId` harus valid |
| **Dependencies** | Role |
| **Repository** | `BaseRepository` — find by username |
| **Service** | `AuthService` — login, logout, isLoggedIn, currentUser, hasRole, hasPermission |
| **UI** | LoginPage, LockScreenPage, Settings → users-page |

**Lifecycle Login:**

```
User Input Username/Password
        │
        ▼
  AuthService.login()
        │
        ├── Cari user by username → jika tidak ada → "User tidak ditemukan"
        │
        ├── Hash input password → bandingkan dengan passwordHash
        │       │
        │       ├── Cocok? → Save session ke localStorage
        │       │              │
        │       │              ├── Redirect ke dashboard
        │       │              └── Event: user.loggedIn
        │       │
        │       └── Tidak cocok? → "Password salah"
        │
        └── Cek isActive → jika false → "Akun non-aktif"
```

### 3.8 Role Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mendefinisikan jabatan / level akses pengguna |
| **Tanggung Jawab** | CRUD role, menentukan permission matrix |
| **Business Rules** | Role sistem (Owner, Admin, Kasir) tidak bisa dihapus; Nama role unique; Setiap user minimal punya satu role |
| **Validation Rules** | `name` wajib unique |
| **Dependencies** | Permission |
| **Repository** | `BaseRepository` |
| **Service** | `RoleService` |
| **UI** | Settings → roles-page |

### 3.9 Permission Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Matrix hak akses — module + action untuk setiap role |
| **Tanggung Jawab** | Grant/revoke permission, cek akses |
| **Business Rules** | Role Admin memiliki semua permission; Role Owner memiliki akses penuh termasuk pengaturan sistem; Permission di-cache untuk performance |
| **Validation Rules** | `module` harus terdaftar di MODULES list; `action` harus salah satu: `create`, `read`, `update`, `delete` |
| **Dependencies** | Role, User |
| **Repository** | `BaseRepository` — query by roleId + module |
| **Service** | `PermissionService` — hasPermission(), can(), setPermission() |
| **UI** | Settings → permissions-page |

### 3.10 Recipe Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Blueprint produksi — menentukan bahan baku yang diperlukan untuk membuat produk resep |
| **Tanggung Jawab** | CRUD recipe, kalkulasi HPP, validasi ketersediaan bahan |
| **Business Rules** | Satu RECIPE_PRODUCT hanya punya satu recipe; Bahan baku bisa RAW_MATERIAL atau FINISHED_PRODUCT; Yield minimal 1; Waste percent opsional (default 0) |
| **Validation Rules** | `itemId` harus RECIPE_PRODUCT; Minimal satu recipe detail; Total bahan tidak boleh kosong; Setiap bahan harus unique dalam satu recipe |
| **Dependencies** | Item (RECIPE_PRODUCT), Item (bahan baku), Unit |
| **Repository** | `RecipeRepository` — getByProductId, getWithDetails |
| **Service** | `RecipeService` — createRecipe, calculateHPP, checkStockAvailability, processRecipe |
| **UI** | Products → tab Recipe |

**Struktur Recipe:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        RECIPE DOMAIN                             │
│                                                                  │
│  RecipeService                                                   │
│    │                                                            │
│    ├── createRecipe(productId, details[])                       │
│    │     ├── Validasi: productId harus RECIPE_PRODUCT           │
│    │     ├── Validasi: details tidak boleh kosong               │
│    │     ├── Validasi: setiap detail punya itemId + quantity    │
│    │     └── Simpan: Recipe header + Recipe details             │
│    │                                                            │
│    ├── calculateHPP(productId)                                  │
│    │     └── SUM(detail.quantity × item.buyPrice)               │
│    │                                                            │
│    ├── checkStockAvailability(productId, qty)                   │
│    │     ├── Load recipe details                                │
│    │     ├── Untuk setiap bahan: stok >= qty × detail.qty       │
│    │     └── Return {ok, insufficient: [{item, needed, have}]}  │
│    │                                                            │
│    └── processRecipe(saleDetail)                                │
│          ├── Load recipe                                        │
│          ├── Hitung kebutuhan: neededQty = saleQty × detail.qty │
│          ├── Cek stok → jika kurang? throw "Stok tidak cukup"   │
│          └── Buat StockMovement RECIPE_USAGE per bahan          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.11 Purchase Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mengelola transaksi pembelian dari supplier |
| **Tanggung Jawab** | CRUD purchase, manajemen status (draft → ordered → received), update stok |
| **Business Rules** | PO Number auto-generated; Status tidak bisa mundur (received → draft tidak boleh); Partial receive diperbolehkan; Harga beli mempengaruhi average cost |
| **Validation Rules** | `supplierId` wajib; Minimal satu purchase detail; `quantity` > 0; `unitPrice` >= 0 |
| **Dependencies** | Supplier, Item, User, Warehouse |
| **Repository** | `PurchaseRepository` — getByStatus, getBySupplier |
| **Service** | `PurchaseService` — create, order, receive, cancel |
| **UI** | purchases-page.js |

**Lifecycle Purchase:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  DRAFT   │────►│ ORDERED  │────►│ RECEIVED │────►│ SELESAI  │
│          │     │          │     │          │     │          │
│ Buat PO  │     │ Kirim ke │     │ Barang   │     │ Stok +   │
│ Isi item │     │ supplier │     │ diterima │     │ AvgCost  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                                    │
     ▼                ▼                                    ▼
  Cancelled        Cancelled                           Stok Update
  (soft delete)    (soft delete)                    StockMovement
```

### 3.12 Purchase Detail Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Line items dari purchase |
| **Tanggung Jawab** | Menyimpan item, quantity, harga per PO |
| **Business Rules** | `quantityReceived` <= `quantity`; Total price = quantity × unitPrice |
| **Validation Rules** | `itemId` wajib; `quantity` > 0; `unitPrice` >= 0 |
| **Dependencies** | Purchase, Item |
| **Repository** | Bagian dari PurchaseRepository (getDetails, addDetail) |
| **Service** | Bagian dari PurchaseService |
| **UI** | Bagian dari purchases-page (form) |

### 3.13 Sale Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | **Core domain** — mengelola transaksi penjualan ke customer |
| **Tanggung Jawab** | Buat invoice, kalkulasi total, proses pembayaran, update stok, engine recipe |
| **Business Rules** | Invoice number auto-generated; Setiap sale mengurangi stok; Jika item RECIPE_PRODUCT → jalankan recipe engine; Payment bisa split (cash + debit); Sale tidak bisa dihapus (hanya dibatalkan dengan reverse) |
| **Validation Rules** | Minimal satu sale detail; `quantity` > 0; `unitPrice` >= 0; Jika customer dipilih, customer harus valid |
| **Dependencies** | Customer, Item, User, Payment, CashSession |
| **Repository** | `SalesRepository` — getByDate, getByCustomer, getByInvoiceNumber |
| **Service** | `SalesService` — createInvoice, processPayment, cancelInvoice, applyDiscount |
| **UI** | sales-page.js (penjualan) |

**Lifecycle Sale:**

```
Customer Order
      │
      ▼
  Input items + quantity
      │
      ▼
  Pilih customer (opsional)
      │
      ▼
  Pilih metode pembayaran
      │
      ▼
  Proses pembayaran
      │
      ├── Jika FINISHED_PRODUCT → StockMovement SALE (-qty)
      │
      ├── Jika RECIPE_PRODUCT → RecipeEngine.process()
      │                            │
      │                            ├── Load recipe
      │                            ├── Hitung kebutuhan bahan
      │                            ├── Cek stok → jika kurang → alert
      │                            └── StockMovement RECIPE_USAGE per bahan
      │
      └── Jika SERVICE → tidak ada movement stok
      │
      ▼
  Hitung grandTotal
      │
      ▼
  Simpan sale + sale_details + payments
      │
      ├── Buat StockMovement untuk setiap item
      │
      └── Event: sale.created
              │
              ├── CashSession.updateTotal()
              ├── Dashboard.refresh()
              └── Jika stok < minStock → Notification.alert()
      │
      ▼
  Cetak struk / invoice
      │
      ▼
  SELESAI
```

### 3.14 Sale Detail Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Line items dari penjualan |
| **Tanggung Jawab** | Menyimpan item, quantity, harga per invoice |
| **Business Rules** | `itemType` di-copy dari items.type untuk recipe engine; Total price = quantity × unitPrice; Diskon per item opsional |
| **Validation Rules** | `itemId` wajib; `quantity` > 0 |
| **Dependencies** | Sale, Item |
| **Repository** | Bagian dari SalesRepository |
| **Service** | Bagian dari SalesService |
| **UI** | Bagian dari sales-page |

### 3.15 Inventory Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | **Core domain** — mengelola stok barang |
| **Tanggung Jawab** | Menyediakan informasi stok real-time, peringatan stok minimum, stock opname |
| **Business Rules** | Stok dihitung dari stock_movements (event sourcing); Stok tidak bisa negatif jika `allowNegativeStock = false`; Jika stok <= `minStock` → trigger peringatan; Stock opname menghasilkan adjustment movement |
| **Validation Rules** | — |
| **Dependencies** | Item, StockMovement, Warehouse |
| **Repository** | `InventoryRepository` — getStockByItem, getStockByWarehouse, getAllLowStock |
| **Service** | `InventoryService` — getCurrentStock, getStockMovementHistory, adjustStock, getLowStockItems |
| **UI** | inventory-page.js |

**Model Inventory:**

```
Inventory bukan tabel yang ditulis langsung.
Stok adalah HASIL PERHITUNGAN dari StockMovement:

  Current Stock = SUM(quantity) FROM stock_movements
                   WHERE itemId = X AND warehouseId = Y

  snapshot di stock_balances untuk query cepat.
```

### 3.16 Stock Movement Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mencatat setiap perubahan stok — immutable ledger |
| **Tanggung Jawab** | Mencatat masuk/keluar stok dengan referensi dokumen sumber |
| **Business Rules** | **Immutable** — tidak bisa diubah atau dihapus setelah dibuat; Setiap movement punya type yang jelas; Quantity positif = masuk, negatif = keluar; Setiap movement wajib punya userId (pelaku) |
| **Validation Rules** | `quantity` != 0; `type` harus dari daftar yang ditentukan; `itemId` wajib; `warehouseId` wajib |
| **Dependencies** | Item, User, Warehouse |
| **Repository** | `StockMovementRepository` — getByItem, getByReference, getByDate |
| **Service** | `StockMovementService` — recordMovement, getHistory, reverseMovement |
| **UI** | inventory-page.js → detail history |

### 3.17 Payment Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Mencatat pembayaran transaksi penjualan |
| **Tanggung Jawab** | Validasi pembayaran, hitung kembalian, split payment |
| **Business Rules** | Total semua payment = grandTotal sale; Kembalian dihitung jika cash > grandTotal; Split payment diperbolehkan (cash + debit) |
| **Validation Rules** | `amount` > 0; `method` harus valid (`cash`, `debit`, `credit`, `qris`); `saleId` harus valid |
| **Dependencies** | Sale |
| **Repository** | `BaseRepository` |
| **Service** | `PaymentService` — processPayment, calculateChange, validatePayment |
| **UI** | Bagian dari sales-page (form pembayaran) |

### 3.18 Cash Session Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Manajemen shift kasir — buka/tutup kas |
| **Tanggung Jawab** | Mencatat saldo awal/akhir, merekonsiliasi transaksi, menghitung selisih |
| **Business Rules** | Satu user hanya punya satu sesi aktif dalam satu waktu; Sesi tidak bisa ditutup jika masih ada sale pending; Selisih > threshold → perlu approval; Sesi harus ditutup setiap akhir shift |
| **Validation Rules** | `openingBalance` >= 0; `actualBalance` >= 0 (saat tutup) |
| **Dependencies** | User, Sale |
| **Repository** | `BaseRepository` — getActiveByUser, getByDate |
| **Service** | `CashSessionService` — openSession, closeSession, getSessionSummary, reconcile |
| **UI** | cashier-page.js |

**Lifecycle Cash Session:**

```
Open Session
  │
  ├── Set openingBalance (saldo awal)
  ├── Set status = open
  └── Simpan cash_session
      │
      ▼
  Transaksi berjalan (sale → payment)
      │
      ▼
  Close Session
      │
      ├── Hitung expectedBalance = opening + totalSales - totalPayout
      ├── Input actualBalance (saldo fisik)
      ├── Hitung difference = expected - actual
      ├── Catat notes jika ada selisih
      ├── Set status = closed
      └── Simpan cash_session
```

### 3.19 Dashboard Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Ringkasan bisnis real-time |
| **Tanggung Jawab** | Menampilkan KPI, grafik penjualan, aktivitas terbaru, quick actions |
| **Business Rules** | Data bersifat read-only aggregate; Refresh periodik (setiap 30 detik atau manual); Data hari ini jadi default |
| **Validation Rules** | — |
| **Dependencies** | Sale (untuk revenue), Inventory (untuk stok), Item (untuk product count) |
| **Repository** | Tidak ada — query langsung ke service domain lain |
| **Service** | `DashboardService` — getTodaySummary, getRecentActivities, getLowStockAlert |
| **UI** | Dashboard.js — KPI cards + chart placeholder + activity list |

### 3.20 Report Domain

| Aspek | Deskripsi |
|-------|-----------|
| **Tujuan** | Laporan bisnis — penjualan, stok, keuangan |
| **Tanggung Jawab** | Generate report, export (PDF/Excel), filter (tanggal, kategori, user) |
| **Business Rules** | Data read-only; Report bisa di-filter berdasarkan periode, kategori, user, item; Export dilakukan di client-side (jsPDF, SheetJS) |
| **Validation Rules** | Date range valid (end >= start) |
| **Dependencies** | Sale, Purchase, Inventory, Item, Customer, Supplier |
| **Repository** | Tidak ada — query langsung |
| **Service** | `ReportService` — getSalesReport, getStockReport, getProfitReport, getCustomerReport |
| **UI** | reports-page.js |

---

## 4. Lifecycle

### 4.1 Lifecycle Umum Domain

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GENERIC DOMAIN LIFECYCLE                              │
│                                                                          │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│  │ CREATE  │───►│ VALIDATE │───►│ EXECUTE  │───►│ COMPLETE │           │
│  │ (Form)  │    │ (Rules)  │    │ (Service)│    │ (DB + UI)│           │
│  └─────────┘    └──────────┘    └──────────┘    └──────────┘           │
│       │              │               │               │                  │
│       ▼              ▼               ▼               ▼                  │
│  User input      Jika gagal       Jika gagal      Refresh UI           │
│  → Isi data      → Tampilkan     → Tampilkan     → Notifikasi         │
│                   error           error                                │
│                   ke user         ke user                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Lifecycle Create Product

```
User klik "Tambah Produk"
      │
      ▼
  showForm(null)
      │
      ├── Modal terbuka
      ├── SKU auto-generated
      ├── Dropdown kategori, satuan, supplier diisi
      └── User mengisi form
      │
      ▼
  User klik "Simpan"
      │
      ▼
  saveBtn.onClick()
      │
      ├── Ambil data dari form (getElementById)
      │
      ├── Panggil productService.create(data)
      │       │
      │       ├── productService.validate(data)
      │       │       ├── name.trim() ? → jika kosong → error
      │       │       ├── buyPrice >= 0 ? → jika negatif → error
      │       │       ├── sellPrice >= 0 ? → jika negatif → error
      │       │       └── return errors[]
      │       │
      │       ├── Jika validasi gagal → return { success: false, errors }
      │       │       └── Tampilkan error di form
      │       │
      │       ├── Generate UUID
      │       ├── Set timestamps (createdAt, updatedAt)
      │       │
      │       ├── Panggil productRepository.create(product)
      │       │       ├── baseRepository.create()
      │       │       ├── db.products.add(record)
      │       │       └── return record
      │       │
      │       └── return { success: true, data: product }
      │
      ├── Jika success → modal.close() → loadTable()
      │
      └── Jika gagal → tampilkan error di form
      │
      ▼
  loadTable()
      │
      ├── Panggil productService.getAll({ search, sort, pagination })
      │       └── productRepository.search(query, options)
      │
      ├── Render table dengan data baru
      └── Hitung ulang pagination
```

### 4.3 Lifecycle Process Sale (dengan Recipe Engine)

```
User pilih item + quantity
      │
      ▼
  Sale Detail terbentuk
      │
      │  Untuk setiap item:
      │
      ├── Jika item.type === 'FINISHED_PRODUCT'
      │       └── Siapkan StockMovement(SALE, -qty)
      │
      ├── Jika item.type === 'RECIPE_PRODUCT'
      │       │
      │       ├── RecipeService.processRecipe(saleDetail)
      │       │       │
      │       │       ├── Load recipe by productId
      │       │       ├── Load recipe_details
      │       │       │
      │       │       ├── Untuk setiap detail bahan:
      │       │       │       ├── neededQty = saleQty × detail.quantity
      │       │       │       ├── Cek stok:
      │       │       │       │       └── stockBalance >= neededQty?
      │       │       │       │               ├── Ya → lanjut
      │       │       │       │               └── Tidak → throw error
      │       │       │       └── Siapkan StockMovement(RECIPE_USAGE, -neededQty)
      │       │       │
      │       │       └── return movements[]
      │       │
      │       └── RECIPE_PRODUCT sendiri → tidak ada movement stok
      │
      ├── Jika item.type === 'SERVICE' atau 'NON_STOCK'
      │       └── Tidak ada movement stok
      │
      ▼
  Proses pembayaran
      │
      ├── Input jumlah bayar
      ├── Hitung kembalian
      └── Simpan payment
      │
      ▼
  Simpan transaksi (sale + sale_details + payments)
      │
      ▼
  Batch insert semua StockMovement
      │
      ▼
  Update stock_balances (SUM ulang)
      │
      ▼
  Cetak struk
```

---

## 5. Architectural Pattern

### 5.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UI LAYER (pages/)                           │
│                                                                     │
│  Tanggung jawab: Render, event handling, DOM manipulation           │
│  Tidak boleh: Memanggil repository langsung, logic bisnis           │
│  imports: Service layer only                                        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER (modules/*/)                    │
│                                                                     │
│  Tanggung jawab: Business logic, validasi, orchestration            │
│  Tidak boleh: Akses DOM, akses database langsung                    │
│  imports: Repository layer, Utility layer                           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     REPOSITORY LAYER (repositories/)                │
│                                                                     │
│  Tanggung jawab: Akses data (CRUD), query, pagination, sorting     │
│  Tidak boleh: Logic bisnis, validasi                                │
│  imports: Database layer (db.js)                                    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER (database/)                    │
│                                                                     │
│  Tanggung jawab: Koneksi Dexie, schema, migrasi, seeding           │
│  Tidak boleh: Logic bisnis                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Service Layer Pattern

```
┌────────────────────────────────────────────────────────────────┐
│                        SERVICE                                  │
│                                                                 │
│  create(data) → validate + execute                             │
│  update(id, changes) → validate + execute                      │
│  delete(id) → soft delete                                      │
│  getAll(filter) → query + transform                            │
│  getById(id) → query                                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Factory Methods                                        │   │
│  │                                                         │   │
│  │  ProductService.create(data) → {                        │   │
│  │    validate(data)                                        │   │
│  │    generateSku()                                         │   │
│  │    buildEntity() ← Factory                               │   │
│  │    repository.create(entity)                             │   │
│  │    return result                                         │   │
│  │  }                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Kapan service dibuat?
  → Jika ada validasi lebih dari 1 field
  → Jika melibatkan lebih dari 1 repository
  → Jika ada logic bisnis (transaksi, kalkulasi)
  → Jika ada event/notification setelah operasi

Kapan TIDAK perlu service?
  → Simple CRUD tanpa logic → bisa pakai repository langsung
  → Read-only lookup → query langsung
```

### 5.3 Repository Pattern

```
┌───────────────────────────────────────────────────────────────┐
│                      REPOSITORY                                │
│                                                                │
│  Abstraksi akses data — menyembunyikan kompleksitas DB       │
│                                                                │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  BaseRepository                                        │    │
│  │                                                        │    │
│  │  getAll({ filter, sort, pagination })                  │    │
│  │  getById(id) → record                                  │    │
│  │  create(data) → record with timestamps                 │    │
│  │  update(id, changes) → updated record                  │    │
│  │  delete(id) → soft delete (set deletedAt)              │    │
│  │  hardDelete(id) → permanent delete                     │    │
│  │  count(filter) → number                                │    │
│  │  exists(id) → boolean                                  │    │
│  │  find(predicate) → records[]                           │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  ProductRepository extends BaseRepository              │    │
│  │                                                        │    │
│  │  search(query, options) → { data, total, pages }      │    │
│  │  getNextSku() → string                                 │    │
│  │  getAllCategories() → categories[]                     │    │
│  │  getAllUnits() → units[]                               │    │
│  │  getAllSuppliers() → suppliers[]                       │    │
│  └───────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘

Kapan extend BaseRepository?
  → Jika ada query spesifik (search, filter khusus)
  → Jika perlu method helper (getNextSku, getLookups)
  → Jika query kompleks (join, aggregate)

Kapan langsung pakai BaseRepository?
  → CRUD sederhana tanpa query spesifik
  → Read-only reference data (categories, units)
```

### 5.4 Factory Pattern

```
Factory digunakan untuk membangun entity dengan default value.

Contoh — Product Factory:

  buildProduct(data) → {
    id: generateUUID(),
    sku: data.sku || 'AUTO',
    name: data.name.trim(),
    type: data.type || 'FINISHED_PRODUCT',
    categoryId: data.categoryId || null,
    unitId: data.unitId || null,
    buyPrice: Number(data.buyPrice) || 0,
    sellPrice: Number(data.sellPrice) || 0,
    stock: Number(data.stock) || 0,
    minStock: Number(data.minStock) || 0,
    isActive: data.isActive !== false,
    image: data.image || null,
    description: data.description || '',
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  }

Kapan pakai Factory?
  → Object construction dengan banyak default value
  → Entity creation yang butuh default logic
  → Transform data dari form ke entity
```

### 5.5 Helper / Utility Pattern

```
┌──────────────────────────────────────────────────────────┐
│  HELPER (domain-specific)                                 │
│                                                           │
│  product-utils.js                                         │
│    formatCurrency() — Rp 10.000                           │
│    formatStatus() — badge HTML                            │
│                                                           │
│  Kapan pakai Helper?                                      │
│    → Format data untuk ditampilkan (UI helper)            │
│    → Domain-specific transformation                       │
│    → Bisa di-test tanpa DOM                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  UTILITY (generic, cross-domain)                          │
│                                                           │
│  id-utils.js — generateUUID(), generateInvoiceNumber()   │
│  hash-utils.js — sha256()                                │
│  logger.js — info(), warn(), error(), debug()            │
│  error-handler.js — initErrorHandler()                   │
│  dom-utils.js — qs(), qsa(), createElement()             │
│                                                           │
│  Kapan pakai Utility?                                     │
│    → Generic function, tidak spesifik ke domain tertentu  │
│    → Pure function, tidak punya side effect (kecuali I/O) │
│    → Bisa dipindahkan ke project lain                     │
└──────────────────────────────────────────────────────────┘
```

### 5.6 Validation Pattern

```
Validasi dilakukan di Service Layer, bukan di UI atau Repository.

┌──────────────────────────────────────────────────────────┐
│  VALIDATION FLOW                                          │
│                                                           │
│  UI → User input                                         │
│       │                                                  │
│       ▼                                                  │
│  Service.create(data)                                    │
│       │                                                  │
│       ▼                                                  │
│  this.validate(data) → errors[]                          │
│       │                                                  │
│       ├── Jika errors.length > 0                         │
│       │     └── return { success: false, errors }        │
│       │                                                  │
│       └── Jika lolos                                     │
│             └── Execute business logic                   │
│                                                           │
│  Return ke UI:                                           │
│    { success: true, data: ... }                          │
│    { success: false, errors: ['Nama wajib diisi'] }      │
└──────────────────────────────────────────────────────────┘

Tingkat validasi:
  1. UI validation — required attribute, input type number
  2. Service validation — business rules, unique check
  3. Database constraint — unique index, FK reference
```

### 5.7 DTO / Mapper Pattern

```
DTO digunakan untuk memisahkan entity internal dari data yang dikirim ke UI.

  Entity (DB)                          DTO (UI)
  ────────────                         ────────
  {                                       {
    id: 'abc',                            sku: 'PRD-001',
    sku: 'PRD-001',                       name: 'Minyak Goreng',
    name: 'Minyak Goreng',                buyPrice: 22000,
    buyPrice: 22000,                      sellPrice: 27000,
    categoryId: 'cat-001',    ───►        categoryName: 'Sembako',
    createdAt: '2026-...',                isActive: true,
    deletedAt: null,                     }
    ...                                   (data siap render)
  }

  Kapan pakai Mapper?
    → Transform data dari DB format ke UI format
    → Join lookup name (categoryName, unitName, supplierName)
    → Format currency, date, status
    → Di pages/ — saat mapping rows untuk table
```

### 5.8 Barrel Export Pattern

```
Setiap module punya index.js yang me-re-export semua public API:

  src/modules/product/
    ├── product-service.js     → class ProductService, instance productService
    ├── product-repository.js  → class ProductRepository, instance productRepository
    ├── product-validator.js   → validateProduct()
    ├── product-utils.js       → formatCurrency(), formatStatus()
    └── index.js               → export { ProductService, productService, ... }

  Keuntungan:
    → Importer cukup: import { productService } from '../modules/product/index.js'
    → Internal refactor: selama public API sama, index.js tidak berubah
    → Tree-shaking: hanya export yang dipakai yang di-import
```

---

## 6. Prinsip Desain

### 6.1 SOLID

| Prinsip | Penerapan |
|---------|-----------|
| **S**ingle Responsibility | Satu class satu tanggung jawab — Service untuk bisnis logic, Repository untuk data access, UI untuk rendering |
| **O**pen/Closed | Extend BaseRepository (tambah method search) tanpa modifikasi BaseRepository itu sendiri |
| **L**iskov Substitution | ProductRepository bisa menggantikan BaseRepository di mana pun |
| **I**nterface Segregation | ProductService hanya expose method yang diperlukan — tidak dipaksa implement method yang tidak dipakai |
| **D**ependency Inversion | Service tergantung pada abstraksi (Repository), bukan konkrit — bisa ganti implementasi tanpa ganti service |

### 6.2 DRY (Don't Repeat Yourself)

**Diterapkan dengan:**
- `BaseRepository` — CRUD generic dipakai oleh semua repository
- `generateUUID()` — satu fungsi, dipakai semua entity
- `now()` / `baseRecord()` — satu fungsi untuk timestamp, dipakai semua seeder
- `renderCard()`, `AppButton()`, `AppTable()`, `AppModal()` — reusable component

**Contoh sebelum DRY:**
```js
// Di setiap file — ❌ JANGAN
const now = () => new Date().toISOString();
const id = crypto.randomUUID();
```

**Contoh setelah DRY:**
```js
// BaseRepository sudah handle createdAt, updatedAt
// generateUUID() dari id-utils.js
```

### 6.3 KISS (Keep It Simple, Stupid)

**Diterapkan dengan:**
- Offline first — tanpa backend, tanpa server, tanpa API
- `BaseRepository.getAll()` — pakai `toArray()` + filter in-memory (cukup untuk < 10.000 records)
- Flat file structure — `src/modules/product/` bukan `src/domains/catalog/product/context/...`
- ES Module — tanpa build step, tanpa bundler, langsung jalan di browser

### 6.4 Clean Architecture

```
  ┌──────────────────────────────────────┐
  │  UI Layer (pages, components)        │  → Framework: Vanilla JS
  │                                      │
  │  Dependency: Service Layer            │
  └──────────────┬───────────────────────┘
                 │
  ┌──────────────▼───────────────────────┐
  │  Service Layer (modules/*/)          │  → Business Logic
  │                                      │
  │  Dependency: Repository Layer         │
  └──────────────┬───────────────────────┘
                 │
  ┌──────────────▼───────────────────────┐
  │  Repository Layer (repositories/)    │  → Data Access
  │                                      │
  │  Dependency: Database Layer           │
  └──────────────┬───────────────────────┘
                 │
  ┌──────────────▼───────────────────────┐
  │  Database Layer (database/)          │  → Dexie / IndexedDB
  │                                      │
  │  Dependency: None (base)              │
  └──────────────────────────────────────┘
```

**Aturan Dependency:**
- Layer dalam tidak tahu tentang layer luar
- `Service` tahu tentang `Repository` tapi tidak tahu tentang `UI`
- `Repository` tahu tentang `Database` tapi tidak tahu tentang `Service`
- `UI` tahu tentang `Service` tapi tidak tahu tentang `Repository`

### 6.5 Offline First

```
┌────────────────────────────────────────────────────────────┐
│                    OFFLINE FIRST PRINCIPLES                 │
│                                                             │
│  1. Semua operasi 100% offline                             │
│     → Tidak perlu koneksi internet untuk transaksi         │
│     → IndexedDB sebagai primary storage                    │
│     → Service Worker sebagai cache layer                   │
│                                                             │
│  2. Online = bonus, bukan requirement                      │
│     → Cloud sync adalah fitur tambahan, bukan wajib        │
│     → Semua fitur harus berfungsi tanpa internet           │
│                                                             │
│  3. Data tetap ada setelah reload                          │
│     → IndexedDB persistent storage                         │
│     → localStorage untuk session                           │
│                                                             │
│  4. PWA — installable, offline-capable                     │
│     → Manifest untuk install prompt                        │
│     → Service Worker untuk cache strategi                  │
│     → offline.html sebagai fallback                        │
└────────────────────────────────────────────────────────────┘
```

### 6.6 DDD (Domain-Driven Design)

| Konsep DDD | Implementasi |
|------------|--------------|
| **Entity** | Item, Sale, Purchase — memiliki identity (id) |
| **Value Object** | Address, Money, Quantity — tidak punya identity, dibandingkan berdasarkan value |
| **Aggregate** | Sale → { sale header + sale details } sebagai satu unit |
| **Repository** | ProductRepository, SalesRepository — abstraction for data access |
| **Domain Service** | ProductService, SalesService — business logic yang tidak cocok di entity |
| **Domain Event** | `sale.created`, `stock.belowMinimum` — notifikasi perubahan state |
| **Bounded Context** | Master Data, Transaction, Inventory — batas konteks yang jelas |

---

## 7. Coding Standard

### 7.1 Naming Convention

| Elemen | Convention | Contoh |
|--------|------------|--------|
| **File** | `kebab-case` | `product-service.js`, `base-repository.js` |
| **Folder** | `kebab-case` | `src/modules/product/`, `src/pages/settings/` |
| **Class** | `PascalCase` | `class ProductService`, `class BaseRepository` |
| **Function** | `camelCase` | `function loadTable()`, `function showForm()` |
| **Variable** | `camelCase` | `const currentPage`, `let searchTimer` |
| **Constant** | `UPPER_SNAKE` | `const PAGE_SIZE = 10`, `const MAX_RETRY = 3` |
| **Private** | `#` prefix (class) | `this.#initialized`, `this.#status` |
| **Event handler** | `handle` prefix | `function handleLogin()`, `function handleUnlock()` |
| **Boolean** | `is`, `has`, `can` prefix | `isActive`, `hasPermission`, `canDelete` |
| **Export** | `default` | Hindari — selalu named export |
| **Import** | Named import | `import { productService } from '...'` |

### 7.2 Folder Convention

```
src/
├── app/                 # Entry point (app.js, bootstrap.js)
├── auth/                # Autentikasi (session, login, auth.js)
├── components/          # Reusable UI components
│   ├── button/          #   app-button.js
│   ├── modal/           #   app-modal.js
│   ├── table/           #   app-table.js
│   ├── card/            #   app-card.js
│   ├── form/            #   app-input.js, app-select.js
│   ├── feedback/        #   app-spinner.js, app-alert.js
│   ├── navigation/      #   app-breadcrumb.js, app-dropdown.js
│   ├── data-display/    #   app-badge.js, app-avatar.js
│   └── layout/          #   app-sidebar.js, app-topbar.js, app-page-container.js
├── config/              # Configuration files
├── constants/           # Constants / enum
├── database/            # Dexie schema, migrations, seeds
├── helpers/             # Domain helpers (export, import, print, form)
├── layouts/             # Page layouts (AppLayout, auth-layout, pos-layout)
├── modules/             # Domain modules (DDD)
│   ├── product/         #   product-service.js, product-repository.js, ...
│   ├── sales/           #   sales-service.js, sales-repository.js, ...
│   ├── purchase/        #   purchase-service.js, purchase-repository.js, ...
│   └── ...              #   Setiap domain punya folder sendiri
├── pages/               # Pages (satu file per route)
│   ├── products/        #   products-page.js
│   ├── sales/           #   sales-page.js
│   ├── settings/        #   settings-page.js, store-page.js, users-page.js
│   └── ...
├── pwa/                 # PWA support (manifest, service worker registration, install)
├── repositories/        # Base repository + shared repos
├── router/              # Client-side routing
├── services/            # Cross-module services (auth, theme, permission, idle)
├── styles/              # CSS files
└── utils/               # Utility functions (cross-domain)
```

### 7.3 Import Convention

```js
// 1. Core / framework imports (paling atas)
import { initLogger } from '../utils/logger.js';

// 2. Service imports
import { authService } from '../services/auth-service.js';

// 3. Repository imports
import { productRepository } from './product-repository.js';

// 4. Component imports
import { renderCard } from '../../components/Card.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppButton } from '../../components/button/app-button.js';

// 5. Utility imports
import { formatCurrency } from '../../modules/product/product-utils.js';

// 6. Asset / constant imports
import { APP_CONFIG } from '../../config/app.config.js';
```

**Aturan:**
- Path relatif dari `./` atau `../` — tidak ada alias
- File extension `.js` wajib untuk ES Module
- Named import, hindari `export default`
- Satu baris per import group (dipisah baris kosong)

### 7.4 Error Handling

```
┌──────────────────────────────────────────────────────────┐
│  ERROR HANDLING STRATEGY                                  │
│                                                           │
│  Service Layer:                                           │
│    → Return object: { success: true/false, data/errors } │
│    → Throw exception hanya untuk unexpected error         │
│    → Log error via logger.error()                         │
│                                                           │
│  Repository Layer:                                        │
│    → Throw exception jika data tidak ditemukan            │
│    → console.error + rethrow untuk DB error               │
│                                                           │
│  UI Layer:                                                │
│    → Tampilkan error ke user (modal, alert)              │
│    → Jangan throw — handle dengan try-catch               │
│    → Loading state + disabled button selama proses        │
└──────────────────────────────────────────────────────────┘

  Contoh Service Error:

  async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) return { success: false, errors };
    try {
      await repository.create(entity);
      return { success: true, data: entity };
    } catch (err) {
      logger.error('[ProductService] Create failed:', err);
      return { success: false, errors: ['Gagal menyimpan data'] };
    }
  }

  Contoh UI Handling:

  const result = await productService.create(data);
  if (result.success) {
    modal.close();
    await loadTable();
  } else {
    showErrors(result.errors);
  }
```

### 7.5 Logging

```
┌──────────────────────────────────────────────────────────┐
│  LOGGING STRATEGY                                         │
│                                                           │
│  Gunakan logger dari src/utils/logger.js:                │
│                                                           │
│  logger.info('[Module] Pesan informasional')             │
│    → Startup, inisialisasi, proses berhasil              │
│                                                           │
│  logger.warn('[Module] Peringatan...')                   │
│    → Stok menipis, deprecation, fallback aktif            │
│                                                           │
│  logger.error('[Module] Gagal:', err)                    │
│    → Error yang ditangani (catch), operasi gagal          │
│                                                           │
│  logger.debug('[Module] Variable value:', x)             │
│    → Development only — bisa dihapus sebelum production   │
│                                                           │
│  logger.log('[Module] Raw log')                          │
│    → Sama dengan console.log — hindari jika bisa          │
│                                                           │
│  JANGAN pakai console.log / console.error langsung:       │
│    ❌ console.error('Gagal:', err)                        │
│    ✅ logger.error('[PurchaseService] Gagal:', err)       │
│                                                           │
│  Format: [ModuleName] Pesan                               │
└──────────────────────────────────────────────────────────┘
```

### 7.6 Code Organization per File

```
// 1. Imports (terurut sesuai 7.3)
import { ... } from '...';

// 2. Constants
const PAGE_SIZE = 10;

// 3. Module-level state
let currentPage = 1;
let currentSearch = '';

// 4. Exported functions (public API)
export async function init(container) { ... }

// 5. Internal functions (module-private)
async function loadTable() { ... }
function showForm(product) { ... }
function confirmDelete(product) { ... }
```

---

## 8. Lampiran: Matrix Domain

| # | Domain | Type | Service | Repository | Page | Dependencies |
|---|--------|------|---------|------------|------|-------------|
| 1 | Item | Core | `ProductService` | `ProductRepository` | `products-page` | Category, Unit, Supplier |
| 2 | Category | Supporting | `CategoryService` | `BaseRepository` | settings | — |
| 3 | Unit | Supporting | `UnitService` | `BaseRepository` | settings | — |
| 4 | Supplier | Supporting | `SupplierService` | `BaseRepository` | settings | — |
| 5 | Customer | Supporting | `CustomerService` | `BaseRepository` | settings | — |
| 6 | Warehouse | Supporting | `WarehouseService` | `BaseRepository` | settings | — |
| 7 | User | Supporting | `AuthService` | `BaseRepository` | settings | Role |
| 8 | Role | Supporting | `RoleService` | `BaseRepository` | settings | — |
| 9 | Permission | Supporting | `PermissionService` | `BaseRepository` | settings | Role |
| 10 | Recipe | Core | `RecipeService` | `RecipeRepository` | products | Item |
| 11 | Purchase | Core | `PurchaseService` | `PurchaseRepository` | purchases | Supplier, Item |
| 12 | Purchase Detail | Core | — (via Purchase) | — (via Purchase) | purchases | Purchase, Item |
| 13 | Sale | Core | `SalesService` | `SalesRepository` | sales | Customer, Item |
| 14 | Sale Detail | Core | — (via Sale) | — (via Sale) | sales | Sale, Item |
| 15 | Inventory | Core | `InventoryService` | `InventoryRepository` | inventory | Item, Warehouse |
| 16 | Stock Movement | Core | `StockMovementService` | `StockMovementRepository` | inventory | Item, User, Warehouse |
| 17 | Payment | Generic | `PaymentService` | `BaseRepository` | sales | Sale |
| 18 | Cash Session | Supporting | `CashSessionService` | `BaseRepository` | cashier | User |
| 19 | Dashboard | Generic | `DashboardService` | — (read-only) | Dashboard | Sale, Inventory |
| 20 | Report | Generic | `ReportService` | — (read-only) | reports | All domains |

> **Document Version:** 1.0
>
> **Last Updated:** 2026-07-29
>
> **Status:** Active — Pedoman developer dan AI untuk POS Offline PWA
>
> **Total Domains:** 20 | **Layers:** 4 | **Patterns:** 8 | **Prinsip:** 6
