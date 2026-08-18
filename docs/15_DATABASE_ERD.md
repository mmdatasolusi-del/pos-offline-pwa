# Database ERD — POS Offline PWA

> **Blueprint** database untuk Point of Sale 100% offline dengan Universal Item Model.
>
> **Prinsip:** Satu schema, 21 tabel, melayani semua jenis bisnis (retail, cafe, restoran, laundry, jasa).

---

## Table of Contents

1. [Diagram ERD](#1-diagram-erd)
2. [Detail Tabel](#2-detail-tabel)
3. [Relasi dan Cardinality](#3-relasi-dan-cardinality)
4. [Normalisasi](#4-normalisasi)
5. [Alasan Desain](#5-alasan-desain)
6. [Lampiran: Matrix Tabel](#6-lampiran-matrix-tabel)

---

## 1. Diagram ERD

### 1.1 Master Data

```
┌──────────────────────────────────────────────────────────────────────┐
│                           MASTER DATA                                │
│                                                                      │
│  ┌───────────┐     ┌───────────┐     ┌───────────┐                  │
│  │  roles    │1──N │  users    │N──1 │ settings  │                  │
│  └───────────┘     └───────────┘     └───────────┘                  │
│       │                                                              │
│       │N                                                            │
│       ▼                                                              │
│  ┌───────────┐     ┌──────────────┐     ┌───────────┐               │
│  │permissions│     │   items      │N──1 │ categories│               │
│  └───────────┘     └──────────────┘     └───────────┘               │
│                        │    │                                        │
│                        │    │N                                       │
│                        │    ▼                                        │
│                        │  ┌───────────┐     ┌───────────┐            │
│                        └N─│  units    │     │ suppliers │            │
│                           └───────────┘     └───────────┘            │
│                                                                      │
│  ┌───────────┐     ┌───────────┐                                    │
│  │ customers │     │warehouses │                                    │
│  └───────────┘     └───────────┘                                    │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Transaksi Pembelian

```
┌──────────────────────────────────────────────────────────────────────┐
│                          PURCHASE FLOW                               │
│                                                                      │
│  ┌───────────┐     ┌──────────────┐     ┌────────────────┐          │
│  │ suppliers │1──N │  purchases   │1──N │purchase_details│          │
│  └───────────┘     └──────────────┘     └───────┬────────┘          │
│                        │                        │N                  │
│                        │N                       │                   │
│                        ▼                        ▼                   │
│  ┌───────────┐     ┌──────────────────────────────────────┐          │
│  │   users   │1──N │          purchases                    │          │
│  └───────────┘     └──────────────────────────────────────┘          │
│                                                                      │
│  purchase_details ──N──► items (N:1)                                 │
│  purchase_details ──1──► stock_movements (1:N)                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.3 Transaksi Penjualan

```
┌──────────────────────────────────────────────────────────────────────┐
│                          SALES FLOW                                  │
│                                                                      │
│  ┌───────────┐     ┌───────────┐     ┌────────────────┐             │
│  │ customers │1──N │   sales   │1──N │  sale_details  │             │
│  └───────────┘     └───────────┘     └───────┬────────┘             │
│                        │                     │N                     │
│                        │N                    │                      │
│                        ▼                     ▼                      │
│  ┌───────────┐     ┌────────────────────────────────────┐           │
│  │   users   │1──N │            sales                   │           │
│  └───────────┘     └────────────────────────────────────┘           │
│                                                                      │
│  sales ──1──► payments (1:1)                                        │
│  sale_details ──N──► items (N:1)                                     │
│  sale_details ──1──► stock_movements (1:N)                           │
│  sale_details ──N──► recipes (N:1) — jika RECIPE_PRODUCT             │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.4 Stok dan Resep

```
┌──────────────────────────────────────────────────────────────────────┐
│                      INVENTORY & RECIPE                              │
│                                                                      │
│  ┌───────────────────┐                                              │
│  │   stock_movements  │  ← Sumber kebenaran stok                    │
│  └───────────────────┘                                              │
│            │                                                         │
│            │ (dihitung)                                              │
│            ▼                                                         │
│  ┌───────────────────┐                                              │
│  │  stock_balances    │  ← Materialized view / snapshot             │
│  └───────────────────┘                                              │
│                                                                      │
│  ┌───────────┐     ┌──────────────────┐     ┌────────────────┐      │
│  │   items   │1──N │    recipes       │1──N │ recipe_details │      │
│  │(RECIPE_)  │     │ (BOM header)     │     │ (BOM lines)    │      │
│  └───────────┘     └──────────────────┘     └───────┬────────┘      │
│                                                      │              │
│                                                      │N             │
│                                                      ▼              │
│                                                 ┌───────────┐       │
│                                                 │   items   │       │
│                                                 │(RAW_MATER)│       │
│                                                 └───────────┘       │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.5 Ringkasan Relasi

```
                            FULL ERD
                    ┌─────────────────────┐
                    │       roles         │
                    └─────────┬───────────┘
                              │1
                              │N
                    ┌─────────▼───────────┐      ┌──────────────────┐
              ┌─────│       users         │──────│  settings        │
              │     └─────────┬───────────┘      └──────────────────┘
              │1              │1
              │N              │N
     ┌────────▼──────┐ ┌─────▼────────────┐
     │  permissions  │ │  cash_sessions   │
     └───────────────┘ └──────────────────┘
                              │
                    ┌─────────▼───────────┐      ┌──────────────────┐
                    │       sales         │1────1│    payments      │
                    └─────────┬───────────┘      └──────────────────┘
                              │1
                              │N
                    ┌─────────▼───────────┐
                    │   sale_details      │──────┐  (N:1)
                    └─────────┬───────────┘      │
                              │1                 │
                              │N                 │
                              ▼                  │
                    ┌─────────────────────┐      │
                    │  stock_movements    │      │
                    └─────────┬───────────┘      │
                              │N                 │
                              │1                 │
                    ┌─────────▼───────────┐      │
                    │  stock_balances     │      │
                    └─────────────────────┘      │
                                                  │
                    ┌─────────────────────┐       │
                    │  categories         │       │
                    └─────────┬───────────┘       │
                              │1                  │
                              │N                  │
                    ┌─────────▼───────────┐       │
            ┌──────│       items         │◄──────┘
            │      └─────────┬───────────┘
            │                │1
            │                │N
            │      ┌─────────▼───────────┐
            │      │       units         │
            │      └─────────────────────┘
            │
            │      ┌─────────────────────┐
            │      │    suppliers        │
            │      └─────────┬───────────┘
            │                │1
            │                │N
            │      ┌─────────▼───────────┐
            │      │    purchases        │
            │      └─────────┬───────────┘
            │                │1
            │                │N
            │      ┌─────────▼───────────┐
            └──────│  purchase_details   │
                   └─────────────────────┘

                    ┌─────────────────────┐
                    │     recipes         │
                    └─────────┬───────────┘
                              │1
                              │N
                    ┌─────────▼───────────┐
                    │  recipe_details     │────── bahan baku (N:1) ──► items
                    └─────────────────────┘

                    ┌─────────────────────┐
                    │    customers        │
                    └─────────┬───────────┘
                              │1
                              │N
                              ▼
                          sales (di atas)

                    ┌─────────────────────┐
                    │   warehouses        │
                    └─────────┬───────────┘
                              │1
                              │N
                              ▼
                    stock_balances, stock_movements
```

---

## 2. Detail Tabel

### 2.1 `roles`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Menyimpan role / jabatan pengguna (Owner, Admin, Kasir, Staff) |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `name` (unique), `isSystem`, `deletedAt` |
| **Constraint** | `name` unique, `isSystem` boolean untuk proteksi role bawaan |
| **Soft Delete** | `deletedAt` — role sistem tidak bisa dihapus |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Desain Notes:**
- Role sistem (`isSystem: true`) tidak bisa diedit atau dihapus oleh user
- Role kustom bisa ditambahkan oleh user dengan hak akses penuh
- `sortOrder` menentukan urutan tampilan di dropdown

### 2.2 `users`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Menyimpan data pengguna aplikasi |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `roleId` → `roles.id` |
| **Index** | `username` (unique), `roleId`, `isActive`, `deletedAt` |
| **Constraint** | `username` unique, `passwordHash` wajib diisi |
| **Soft Delete** | `deletedAt` — user dinonaktifkan, data tetap ada |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Desain Notes:**
- Password disimpan sebagai SHA-256 hash, tidak pernah plain text
- `isActive` untuk nonaktifkan user tanpa hapus
- `pin` opsional untuk quick login di POS

### 2.3 `permissions`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Matrix hak akses — module + action + role |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `roleId` → `roles.id` |
| **Index** | `roleId`, `module`, `action` |
| **Constraint** | Kombinasi `roleId + module + action` unique |
| **Soft Delete** | Tidak — permission dihapus fisik |
| **Audit Field** | — |

**Desain Notes:**
- Setiap baris = satu izin: "Role X boleh melakukan Action Y di Module Z"
- Action: `create`, `read`, `update`, `delete`
- Module: `dashboard`, `pos`, `products`, `sales`, dll.
- Tidak ada soft delete karena permission bersifat volatile

### 2.4 `items`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Universal Item — semua barang, bahan, jasa dalam satu tabel |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `categoryId` → `categories.id`, `unitId` → `units.id`, `supplierId` → `suppliers.id` |
| **Index** | `sku` (unique), `barcode`, `name`, `type`, `categoryId`, `isActive`, `deletedAt` |
| **Constraint** | `sku` unique, `type` harus salah satu dari: `RAW_MATERIAL`, `FINISHED_PRODUCT`, `RECIPE_PRODUCT`, `SERVICE`, `NON_STOCK` |
| **Soft Delete** | `deletedAt` — item diarsipkan |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Field Detail:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `id` | UUID | Yes | Auto | Primary key |
| `sku` | String | Yes | Auto | Kode unik item |
| `barcode` | String | No | `''` | EAN-13, UPC, atau kode toko |
| `name` | String | Yes | — | Nama item |
| `type` | Enum | Yes | `FINISHED_PRODUCT` | Jenis universal item |
| `categoryId` | UUID | No | `null` | FK ke categories |
| `unitId` | UUID | No | `null` | FK ke units |
| `buyPrice` | Number | Yes | `0` | Harga beli / HPP |
| `sellPrice` | Number | Yes | `0` | Harga jual standar |
| `stock` | Number | No | `0` | Stok (calculated) |
| `minStock` | Number | No | `0` | Minimum stok alert |
| `supplierId` | UUID | No | `null` | Supplier default |
| `isActive` | Boolean | No | `true` | Status aktif |
| `type` | String | Yes | `FINISHED_PRODUCT` | `RAW_MATERIAL`, `FINISHED_PRODUCT`, `RECIPE_PRODUCT`, `SERVICE`, `NON_STOCK` |
| `image` | String | No | `null` | Path gambar |
| `description` | Text | No | `''` | Deskripsi |

### 2.5 `categories`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Kategori item — hierarki parent-child |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `parentId` → `categories.id` (self-referencing) |
| **Index** | `name`, `parentId`, `isActive`, `deletedAt` |
| **Constraint** | `parentId` tidak boleh sama dengan `id` (circular reference guard) |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Desain Notes:**
- Self-referencing untuk kategori bertingkat: Makanan → Makanan Ringan → Keripik
- Level tidak dibatasi (unlimited depth)
- `parentId = null` berarti kategori root

### 2.6 `units`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Satuan item — pcs, kg, liter, pack, box, dus |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `name`, `abbreviation`, `isActive`, `deletedAt` |
| **Constraint** | — |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Desain Notes:**
- Satuan dasar yang digunakan untuk transaksi dan stok
- Konversi satuan (1 box = 24 pcs) bisa ditambahkan di tabel terpisah
- Contoh: `name: "Kilogram", abbreviation: "kg"`

### 2.7 `suppliers`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Data pemasok / vendor |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `code`, `name`, `phone`, `isActive`, `deletedAt` |
| **Constraint** | — |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Field Tambahan:**
`address`, `email`, `contactPerson`, `paymentTerms`, `taxId`

### 2.8 `customers`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Data pelanggan |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `name`, `phone`, `isMember`, `isActive`, `deletedAt` |
| **Constraint** | — |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Field Tambahan:**
`address`, `email`, `birthDate`, `memberNumber` (unique), `points`

### 2.9 `warehouses`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Lokasi fisik penyimpanan barang — gudang, toko, rak |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `code`, `name`, `type`, `isActive`, `deletedAt` |
| **Constraint** | `code` unique |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Desain Notes:**
- Mendukung multi-gudang: toko pusat, gudang belakang, gudang bahan baku
- `type`: `STORE`, `WAREHOUSE`, `KITCHEN`, `COLD_STORAGE`
- Setiap stock_movement wajib mencantumkan `warehouseId`
- Untuk bisnis kecil, cukup satu warehouse default

### 2.10 `stock_movements`

| Atribut | Value |
|---------|-------|
| **Tujuan** | **Sumber kebenaran (source of truth) stok** — setiap perubahan stok dicatat sebagai baris baru |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `itemId` → `items.id`, `warehouseId` → `warehouses.id`, `userId` → `users.id` |
| **Index** | `itemId`, `type`, `referenceType`, `referenceId`, `createdAt` |
| **Constraint** | `quantity` tidak boleh 0; `type` harus dari daftar movement type |
| **Soft Delete** | Tidak — movement bersifat immutable |
| **Audit Field** | `createdAt` (wajib), `userId` (pelaku) |

**Field Lengkap:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `itemId` | UUID | Yes | FK ke items |
| `warehouseId` | UUID | Yes | FK ke warehouses |
| `type` | Enum | Yes | `PURCHASE`, `SALE`, `RECIPE_USAGE`, `RECIPE_RESULT`, `ADJUSTMENT`, `TRANSFER_IN`, `TRANSFER_OUT`, `RETURN`, `OPENING_BALANCE`, `OPNAME` |
| `quantity` | Number | Yes | + untuk masuk, - untuk keluar |
| `unitPrice` | Number | No | Harga per unit saat movement |
| `referenceType` | String | No | `purchase`, `sale`, `recipe`, `adjustment` |
| `referenceId` | UUID | No | ID dokumen sumber |
| `userId` | UUID | Yes | Pelaku |
| `notes` | Text | No | Catatan |
| `createdAt` | ISO | Yes | Timestamp |

**Desain Notes:**
- **Immutable:** Setelah dibuat, stock_movement tidak boleh diubah atau dihapus
- Koreksi dilakukan dengan movement baru (reversal entry)
- `quantity` positif = stok masuk, negatif = stok keluar
- Pola ini disebut **Event Sourcing** — riwayat lengkap, audit trail natural

### 2.11 `stock_balances`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Snapshot stok saat ini — materialized view dari stock_movements |
| **Primary Key** | `itemId + warehouseId` (composite) |
| **Foreign Key** | `itemId` → `items.id`, `warehouseId` → `warehouses.id` |
| **Index** | `itemId`, `warehouseId`, `quantity` |
| **Constraint** | Composite PK unik per item + warehouse |
| **Soft Delete** | Tidak |
| **Audit Field** | `updatedAt` |

**Desain Notes:**
- Bukan primary source — dihitung ulang dari `SUM(quantity)` di `stock_movements`
- Berfungsi sebagai cache untuk query cepat (tanpa SUM setiap kali)
- Diupdate setiap kali ada stock_movement baru
- Untuk recovery, bisa di-rebuild kapan saja dari stock_movements

```
Perhitungan:
  stock_balances.quantity = SUM(stock_movements.quantity)
  WHERE itemId = X AND warehouseId = Y

Query cepat:
  SELECT quantity FROM stock_balances WHERE itemId = X
  → Tanpa SUM, langsung dapat hasil
```

### 2.12 `recipes`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Header resep / Bill of Material — blueprint produksi |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `itemId` → `items.id` (item dengan type `RECIPE_PRODUCT`) |
| **Index** | `itemId`, `name` |
| **Constraint** | `itemId` harus mengacu item dengan `type = RECIPE_PRODUCT` |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `itemId` | UUID | Produk jadi (RECIPE_PRODUCT) |
| `name` | String | Nama resep |
| `yield` | Number | Jumlah output per produksi (default 1) |
| `yieldUnitId` | UUID | Satuan yield (gelas, porsi, kg) |
| `instructions` | Text | Catatan produksi (opsional) |

### 2.13 `recipe_details`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Detail bahan baku yang diperlukan untuk satu resep — BOM lines |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `recipeId` → `recipes.id`, `itemId` → `items.id` (bahan baku) |
| **Index** | `recipeId`, `itemId` |
| **Constraint** | Kombinasi `recipeId + itemId` unique (tidak boleh duplikat bahan dalam satu resep) |
| **Soft Delete** | Tidak — detail resep dihapus fisik |
| **Audit Field** | — |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `recipeId` | UUID | FK ke recipes |
| `itemId` | UUID | Bahan baku (RAW_MATERIAL atau FINISHED_PRODUCT) |
| `quantity` | Number | Jumlah yang diperlukan per yield |
| `unitId` | UUID | Satuan penggunaan (bisa berbeda dari satuan dasar item) |
| `wastePercent` | Number | Persentase waste (default 0) — untuk bakery, daging |

**Contoh Data:**

```
Recipe: Es Teh Manis (yield: 1 gelas)
  ├── Teh Celup      qty: 1      unit: pcs
  ├── Gula Pasir     qty: 0.025  unit: kg
  ├── Air Mineral    qty: 0.2    unit: liter
  ├── Es Batu        qty: 0.1    unit: kg
  └── Cup + Tutup    qty: 1      unit: pcs
```

### 2.14 `purchases`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Header transaksi pembelian dari supplier |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `supplierId` → `suppliers.id`, `userId` → `users.id`, `warehouseId` → `warehouses.id` |
| **Index** | `poNumber` (unique), `supplierId`, `status`, `orderDate`, `deletedAt` |
| **Constraint** | `poNumber` unique, `status` harus: `draft`, `ordered`, `received`, `cancelled` |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Status Lifecycle:**

```
draft ──► ordered ──► received ──► (selesai)
                  │
                  └──► cancelled
```

### 2.15 `purchase_details`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Line items dari purchase — apa yang dibeli |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `purchaseId` → `purchases.id`, `itemId` → `items.id` |
| **Index** | `purchaseId`, `itemId` |
| **Constraint** | `quantity` > 0, `unitPrice` >= 0 |
| **Soft Delete** | Tidak |
| **Audit Field** | — |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `purchaseId` | UUID | FK ke purchases |
| `itemId` | UUID | Item yang dibeli |
| `quantity` | Number | Jumlah |
| `unitPrice` | Number | Harga per unit |
| `totalPrice` | Number | `quantity × unitPrice` (calculated atau manual) |
| `quantityReceived` | Number | Jumlah yang sudah diterima (partial receive) |

### 2.16 `sales`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Header transaksi penjualan ke customer |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `customerId` → `customers.id`, `userId` → `users.id`, `cashSessionId` → `cash_sessions.id` |
| **Index** | `invoiceNumber` (unique), `customerId`, `userId`, `paymentStatus`, `saleDate` |
| **Constraint** | `invoiceNumber` unique, `paymentStatus`: `paid`, `pending`, `cancel` |
| **Soft Delete** | Tidak — transaksi tidak bisa dihapus, hanya di-reverse |
| **Audit Field** | `createdAt`, `updatedAt` |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `invoiceNumber` | String | Auto-generated (INV-YYYYMMDD-XXXX) |
| `customerId` | UUID/null | Customer (null untuk walk-in) |
| `userId` | UUID | Kasir / pelaku |
| `cashSessionId` | UUID | FK ke cash_sessions |
| `saleDate` | ISO | Waktu transaksi |
| `subtotal` | Number | Total sebelum diskon/pajak |
| `discount` | Number | Diskon |
| `tax` | Number | Pajak |
| `grandTotal` | Number | Total akhir |
| `paymentAmount` | Number | Jumlah dibayar |
| `changeAmount` | Number | Kembalian |
| `paymentStatus` | Enum | `paid`, `pending`, `cancel` |
| `paymentMethod` | Enum | `cash`, `debit`, `credit`, `qris` |
| `notes` | Text | Catatan |

### 2.17 `sale_details`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Line items dari penjualan — apa yang dibeli customer |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `saleId` → `sales.id`, `itemId` → `items.id` |
| **Index** | `saleId`, `itemId` |
| **Constraint** | `quantity` > 0 |
| **Soft Delete** | Tidak |
| **Audit Field** | — |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `saleId` | UUID | FK ke sales |
| `itemId` | UUID | Item yang dijual |
| `itemType` | Enum | Copy dari items.type — untuk recipe engine |
| `quantity` | Number | Jumlah |
| `unitPrice` | Number | Harga jual per unit |
| `totalPrice` | Number | `quantity × unitPrice` |
| `discount` | Number | Diskon per item |

### 2.18 `payments`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Detail pembayaran per transaksi — mendukung split payment |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `saleId` → `sales.id` |
| **Index** | `saleId`, `method` |
| **Constraint** | `amount` > 0 |
| **Soft Delete** | Tidak |
| **Audit Field** | `createdAt` |

**Desain Notes:**
- Satu sale bisa memiliki banyak payment (split payment: cash + debit)
- Total semua payment = sale.grandTotal
- `method`: `cash`, `debit_card`, `credit_card`, `qris`, `transfer`

### 2.19 `cash_sessions`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Manajemen kas — buka/tutup shift kasir |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `userId` → `users.id` |
| **Index** | `userId`, `status`, `openedAt` |
| **Constraint** | `status`: `open`, `closed` |
| **Soft Delete** | `deletedAt` |
| **Audit Field** | `createdAt`, `updatedAt`, `deletedAt` |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `shiftNumber` | String | Auto-generated |
| `userId` | UUID | Kasir |
| `openedAt` | ISO | Waktu buka kas |
| `closedAt` | ISO | Waktu tutup kas |
| `openingBalance` | Number | Saldo awal |
| `closingBalance` | Number | Saldo akhir (system calculated) |
| `expectedBalance` | Number | Saldo yang dihitung dari transaksi |
| `actualBalance` | Number | Saldo fisik (input manual saat tutup) |
| `difference` | Number | Selisih expected vs actual |
| `status` | Enum | `open`, `closed` |
| `notes` | Text | Catatan shift |

### 2.20 `settings`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Key-value store untuk konfigurasi aplikasi |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | — |
| **Index** | `key` (unique), `type` |
| **Constraint** | `key` unique |
| **Soft Delete** | Tidak |
| **Audit Field** | `createdAt`, `updatedAt` |

**Contoh Data:**

| Key | Value | Type |
|-----|-------|------|
| `store-name` | Toko Saya | string |
| `store-address` | Jl. Merdeka No. 1 | string |
| `app-theme` | light | string |
| `tax-default-rate` | 11 | number |
| `allow-negative-stock` | false | boolean |

### 2.21 `audit_logs`

| Atribut | Value |
|---------|-------|
| **Tujuan** | Audit trail — mencatat semua operasi penting |
| **Primary Key** | `id` (UUID) |
| **Foreign Key** | `userId` → `users.id` |
| **Index** | `userId`, `action`, `entityType`, `entityId`, `createdAt` |
| **Constraint** | — |
| **Soft Delete** | Tidak — audit log immutable |
| **Audit Field** | `createdAt` |

**Field Detail:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `userId` | UUID | Pelaku |
| `action` | String | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT` |
| `entityType` | String | `product`, `sale`, `purchase`, `user` |
| `entityId` | UUID | ID entitas yang diubah |
| `oldValue` | JSON | Nilai sebelum perubahan |
| `newValue` | JSON | Nilai setelah perubahan |
| `ipAddress` | String | IP address (untuk online mode) |
| `userAgent` | String | Browser/device info |

---

## 3. Relasi dan Cardinality

### 3.1 Ringkasan Cardinality

```
Tabel A              Tabel B              Cardinality      Notes
───────────────────  ───────────────────  ───────────────  ──────────────────────────
roles                users                1 ─── N          Satu role banyak user
users                permissions          1 ─── N          Satu user punya banyak permission
users                cash_sessions        1 ─── N          Satu user bisa buka banyak shift
users                purchases            1 ─── N          Satu user buat banyak PO
users                sales                1 ─── N          Satu user buat banyak invoice
users                stock_movements      1 ─── N          Satu user buat banyak movement
roles                permissions          1 ─── N          Satu role punya banyak permission
items                stock_movements      1 ─── N          Satu item punya banyak movement
items                stock_balances       1 ─── 1          Satu item punya satu balance per warehouse
items                recipes              1 ─── 1          Satu RECIPE_PRODUCT punya satu recipe
items                categories           N ─── 1          Banyak item dalam satu kategori
items                units                N ─── 1          Banyak item pakai satuan yang sama
items                suppliers            N ─── 1          Banyak item dari supplier yang sama
recipes              recipe_details       1 ─── N          Satu recipe punya banyak bahan
recipe_details       items                N ─── 1          Banyak recipe_detail pakai bahan sama
purchases            suppliers            N ─── 1          Banyak PO ke supplier yang sama
purchases            purchase_details     1 ─── N          Satu PO punya banyak item
purchase_details     items                N ─── 1          Banyak PO beli item yang sama
purchase_details     stock_movements      1 ─── N          Satu PO item → banyak movement (partial)
sales                customers            N ─── 1          Banyak transaksi dari customer yang sama
sales                sale_details         1 ─── N          Satu invoice punya banyak item
sales                payments             1 ─── 1          Satu invoice punya satu payment (umumnya)
sale_details         items                N ─── 1          Banyak invoice jual item yang sama
sale_details         stock_movements      1 ─── N          Satu item terjual → movement stok
sale_details         recipes              N ─── 1          Jika RECIPE_PRODUCT, pakai recipe
categories           items                1 ─── N          Satu kategori punya banyak item
categories           categories           1 ─── N          Self-referencing parent-child
warehouses           stock_movements      1 ─── N          Satu warehouse punya banyak movement
warehouses           stock_balances       1 ─── N          Satu warehouse punya banyak balance
```

### 3.2 Diagram Cardinality Detail

```
roles ───1────N─── users ───1────N─── cash_sessions
  │                            │
  │N                           │N
  │                            │
  ▼                            ▼
permissions                 purchases ───N────1─── suppliers
                                │
                                │1
                                │
                                ▼
                          purchase_details ───N────1─── items
                                │
                                │1
                                │
                                ▼
                          stock_movements ───N────1─── warehouses
                                │
                                │N (calculated)
                                ▼
                          stock_balances


items ───1────N─── stock_movements
  │         │
  │1        │N (calculated)
  │         ▼
  └─── stock_balances


items ───1────1─── recipes ───1────N─── recipe_details ───N────1─── items
(idenya)                                                (bahan baku)


sales ───1────N─── sale_details ───N────1─── items
  │                    │
  │1                   │N (jika RECIPE_PRODUCT)
  │                    ▼
  ▼               recipes
payments
```

---

## 4. Normalisasi

### 4.1 First Normal Form (1NF)

**Setiap kolom berisi nilai atomik, tidak ada array atau objek bertingkat.**

| Sebelum (❌) | Sesudah (✅) |
|-------------|-------------|
| `items.prices: [{tier: "MEMBER", price: 8500}]` | Multi-price dipisah ke tabel `item_prices` |
| `sales.items: [{itemId: "x", qty: 2}]` | Dipisah ke `sale_details` |
| `purchases.items: [{itemId: "y", qty: 5}]` | Dipisah ke `purchase_details` |
| `recipes.ingredients: [{itemId: "z", qty: 1}]` | Dipisah ke `recipe_details` |

**1NF tercapai:** Semua field di setiap tabel adalah scalar / simple value.

### 4.2 Second Normal Form (2NF)

**Setiap kolom non-key harus bergantung sepenuhnya pada primary key (bukan sebagian).**

**Contoh 1 — `sale_details`:**

```
Sebelum:
  sale_details(id, saleId, itemId, itemName, itemPrice, quantity)
  → itemName bergantung pada itemId, bukan pada (saleId + itemId)
  → itemPrice bisa berubah setiap transaksi

Sesudah:
  sale_details(id, saleId, itemId, quantity, unitPrice, totalPrice)
  → Semua kolom bergantung pada PK (id)
  → itemName diambil dari tabel items via JOIN
```

**Contoh 2 — `purchase_details`:**

```
Sebelum:
  purchase_details(id, purchaseId, itemId, supplierName, quantity, unitPrice)
  → supplierName bergantung pada supplierId (di purchases header)

Sesudah:
  purchase_details(id, purchaseId, itemId, quantity, unitPrice, totalPrice)
  → supplierName diambil dari purchases → suppliers
```

**2NF tercapai:** Tidak ada partial dependency di semua tabel.

### 4.3 Third Normal Form (3NF)

**Setiap kolom non-key tidak boleh bergantung pada kolom non-key lain (transitive dependency).**

**Contoh — `sales`:**

```
Sebelum:
  sales(id, invoiceNumber, customerId, customerName, subtotal, discount, grandTotal)
  → customerName bergantung pada customerId (transitive)
  → grandTotal bisa dihitung dari subtotal - discount + tax

Sesudah:
  sales(id, invoiceNumber, customerId, subtotal, discount, tax, grandTotal)
  → customerName diambil dari tabel customers via JOIN
  → grandTotal tetap disimpan untuk query cepat (denormalisasi disengaja)
```

**Contoh — `stock_movements`:**

```
Sebelum:
  stock_movements(id, itemId, itemName, warehouseName, quantity, ...)
  → itemName bergantung pada itemId
  → warehouseName bergantung pada warehouseId

Sesudah:
  stock_movements(id, itemId, warehouseId, quantity, ...)
  → Nama item/warehouse diambil dari tabel masing-masing
```

**3NF tercapai dengan satu catatan:**

Terdapat denormalisasi yang disengaja pada:
- `stock_balances` — menyimpan hasil hitungan yang sebenarnya bisa dihitung dari `SUM`
- `sale_details.totalPrice` — bisa dihitung dari `quantity × unitPrice`, tapi disimpan untuk konsistensi jika harga berubah
- `sales.grandTotal` — bisa dihitung, tapi disimpan untuk performance

### 4.4 Tingkat Normalisasi per Tabel

| Tabel | 1NF | 2NF | 3NF | Denormalisasi Disengaja |
|-------|-----|-----|-----|------------------------|
| roles | ✅ | ✅ | ✅ | — |
| users | ✅ | ✅ | ✅ | — |
| permissions | ✅ | ✅ | ✅ | — |
| items | ✅ | ✅ | ✅ | — |
| categories | ✅ | ✅ | ✅ | — |
| units | ✅ | ✅ | ✅ | — |
| suppliers | ✅ | ✅ | ✅ | — |
| customers | ✅ | ✅ | ✅ | — |
| warehouses | ✅ | ✅ | ✅ | — |
| stock_movements | ✅ | ✅ | ✅ | — |
| stock_balances | ✅ | ✅ | ✅ | `quantity` (calculated dari SUM) |
| recipes | ✅ | ✅ | ✅ | — |
| recipe_details | ✅ | ✅ | ✅ | — |
| purchases | ✅ | ✅ | ✅ | — |
| purchase_details | ✅ | ✅ | ✅ | `totalPrice` |
| sales | ✅ | ✅ | ✅ | `grandTotal` |
| sale_details | ✅ | ✅ | ✅ | `totalPrice` |
| payments | ✅ | ✅ | ✅ | — |
| cash_sessions | ✅ | ✅ | ✅ | `expectedBalance` (calculated) |
| settings | ✅ | ✅ | ✅ | — |
| audit_logs | ✅ | ✅ | ✅ | — |

---

## 5. Alasan Desain

### 5.1 Mengapa Stock Movement?

Stok tidak disimpan langsung di tabel `items`. Setiap perubahan dicatat sebagai baris di `stock_movements`.

**Alternatif yang Tidak Dipilih:**

| Pendekatan | Kelemahan |
|------------|-----------|
| **Update langsung** `items.stock += qty` | Tidak ada history, audit mustahil, error susah dilacak |
| **Trigger / Stored Procedure** | Tidak didukung IndexedDB, kompleks |
| **Separate stock table** `inventory(itemId, qty)` | Sama dengan update langsung, hanya dipisah tabel |

**Alasan Memilih Stock Movement:**

```
Situasi: Stok minyak goreng tiba-tiba berkurang 10.

Tanpa Stock Movement:
  "Kok stok kurang 10? Siapa yang salah?"
  → Tidak tahu penyebab
  → Tidak bisa lacak
  → Tidak bisa rollback

Dengan Stock Movement:
  SELECT * FROM stock_movements WHERE itemId = 'prd-003'
    AND createdAt BETWEEN '2026-07-01' AND '2026-07-29'

  Hasil:
  03-Jul  SALE        -2  Invoice INV-20260703-001
  05-Jul  ADJUSTMENT  -5  User: admin — catatan: "Bocor"
  07-Jul  SALE        -3  Invoice INV-20260707-002

  → Jelas: 2 dari penjualan, 5 dari adjustment rusak, 3 dari penjualan lain
  → Bisa audit siapa, kapan, dan mengapa
```

**Keuntungan:**

| Aspek | Benefit |
|-------|---------|
| **Audit** | Setiap perubahan stok tercatat dengan pelaku, waktu, dan alasan |
| **Tracing** | Bisa lacak kapan stok berubah dan penyebabnya |
| **Rollback** | Bisa reverse dengan movement baru (credit note) |
| **Rekonsiliasi** | Stock opname tinggal bandingkan fisik vs kalkulasi movement |
| **Reporting** | Laporan stok harian, mingguan, bulanan — tinggal filter tanggal |

### 5.2 Mengapa Recipe Detail?

**Alternatif yang Tidak Dipilih:**

| Pendekatan | Masalah |
|------------|---------|
| **Simpan bahan baku di JSON field** `items.recipe: [{...}]` | Tidak bisa query, tidak bisa index, 1NF violated |
| **Hardcode di kode** | Setiap ganti resep harus deploy ulang |
| **Table terpisah per jenis** `coffee_recipes`, `food_recipes` | Duplikasi struktur, sulit maintain |

**Alasan Memilih Recipe Detail:**

```
Kasus: Harga gula naik dari Rp 12.000 ke Rp 15.000

Tanpa Recipe Detail:
  → Harus update manual HPP semua produk yang pakai gula
  → Kemungkinan kelewatan

Dengan Recipe Detail:
  1. Update buyPrice gula di tabel items
  2. HPP semua recipe otomatis terhitung ulang:
     SELECT r.name, SUM(rd.quantity * i.buyPrice) AS hpp
     FROM recipes r
     JOIN recipe_details rd ON rd.recipeId = r.id
     JOIN items i ON i.id = rd.itemId
     WHERE i.id = 'bhn-gula'
     GROUP BY r.name
  3. Margin report langsung update
```

**Keuntungan:**

| Aspek | Benefit |
|-------|---------|
| **HPP otomatis** | Biaya produksi selalu update mengikuti harga bahan |
| **BOM fleksibel** | Bahan bisa RAW_MATERIAL atau FINISHED_PRODUCT |
| **Multi-level** | Bisa buat produk dari produk lain (sub-assembly) |
| **Waste** | Bisa hitung waste percent untuk industri makanan |

### 5.3 Mengapa Universal Item?

**Alternatif yang Tidak Dipilih:**

| Pendekatan | Masalah |
|------------|---------|
| **Table terpisah:** `products`, `ingredients`, `services`, `menus` | Query kompleks, join 4+ table untuk report sederhana |
| **Single table + view** | View tidak didukung IndexedDB |
| **EAV (Entity-Attribute-Value)** | Query lambat, SQL kompleks, report susah |

**Alasan Memilih Universal Item:**

```
Tanpa Universal Item — Report: "Semua yang terjual hari ini"

  SELECT name, qty, price FROM products
  UNION ALL
  SELECT name, qty, price FROM menus
  UNION ALL
  SELECT name, qty, price FROM services
  → 3 query + UNION = lambat

Dengan Universal Item:
  SELECT i.name, sd.quantity, sd.unitPrice
  FROM sale_details sd
  JOIN items i ON i.id = sd.itemId
  WHERE sd.saleId IN (...)
  → 1 query, semua jenis item
```

**Keuntungan:**

| Aspek | Benefit |
|-------|---------|
| **Satu source of truth** | Semua "barang" di satu tempat |
| **Query sederhana** | Report lintas jenis item tanpa UNION |
| **Extensible** | Bisnis baru? Cukup tambah type baru, tanpa tabel baru |
| **Code sederhana** | Satu repository, satu service, satu UI pattern |
| **Schema stabil** | Tidak perlu migrasi schema untuk bisnis baru |

### 5.4 Mengapa Soft Delete?

Semua tabel master menggunakan soft delete (`deletedAt`).

**Alasan:**

- Data tidak pernah hilang — bisa dipulihkan
- Integritas referensial terjaga — FK tetap valid
- Audit — tahu kapan dan siapa yang "menghapus"
- Report historic — transaksi lama tetap bisa ditampilkan

**Pengecualian (tanpa soft delete):**
- `stock_movements` — immutable, tidak bisa dihapus
- `audit_logs` — immutable
- `permissions` — volatile, hapus fisik aman

### 5.5 Mengapa Composite Key di stock_balances?

`stock_balances` menggunakan composite primary key `(itemId + warehouseId)`.

**Alasan:**
- Satu item bisa ada di banyak warehouse → butuh baris terpisah
- Query stok per warehouse jadi trivial: `SELECT * FROM stock_balances WHERE itemId = X AND warehouseId = Y`
- Tidak perlu table terpisah untuk `warehouse_stock`

---

## 6. Lampiran: Matrix Tabel

### 6.1 Semua Tabel

| # | Nama | PK | Soft Delete | Audit | Tujuan Utama |
|---|------|----|-------------|-------|-------------|
| 1 | roles | id | ✅ | ✅ | Role / jabatan pengguna |
| 2 | users | id | ✅ | ✅ | Login dan data pengguna |
| 3 | permissions | id | ❌ | ❌ | Matrix hak akses role |
| 4 | items | id | ✅ | ✅ | Universal item / produk |
| 5 | categories | id | ✅ | ✅ | Kategori item (hierarki) |
| 6 | units | id | ✅ | ✅ | Satuan item |
| 7 | suppliers | id | ✅ | ✅ | Pemasok |
| 8 | customers | id | ✅ | ✅ | Pelanggan |
| 9 | warehouses | id | ✅ | ✅ | Gudang / lokasi |
| 10 | stock_movements | id | ❌ | ✅ | Ledger stok (immutable) |
| 11 | stock_balances | itemId + warehouseId | ❌ | ❌ | Snapshot stok |
| 12 | recipes | id | ✅ | ✅ | BOM / resep header |
| 13 | recipe_details | id | ❌ | ❌ | BOM / resep detail |
| 14 | purchases | id | ✅ | ✅ | Transaksi pembelian |
| 15 | purchase_details | id | ❌ | ❌ | Detail pembelian |
| 16 | sales | id | ❌ | ✅ | Transaksi penjualan |
| 17 | sale_details | id | ❌ | ❌ | Detail penjualan |
| 18 | payments | id | ❌ | ❌ | Pembayaran |
| 19 | cash_sessions | id | ✅ | ✅ | Shift / sesi kas |
| 20 | settings | id | ❌ | ✅ | Konfigurasi key-value |
| 21 | audit_logs | id | ❌ | ✅ | Audit trail (immutable) |

### 6.2 Total Index per Tabel

| Tabel | Jumlah Index | Index Kunci |
|-------|-------------|-------------|
| roles | 3 | `&name`, `isSystem`, `deletedAt` |
| users | 4 | `&username`, `roleId`, `isActive`, `deletedAt` |
| permissions | 3 | `roleId`, `module`, `action` |
| items | 7 | `&sku`, `barcode`, `name`, `type`, `categoryId`, `isActive`, `deletedAt` |
| categories | 4 | `name`, `parentId`, `isActive`, `deletedAt` |
| units | 3 | `name`, `abbreviation`, `isActive` |
| suppliers | 4 | `code`, `name`, `phone`, `isActive` |
| customers | 4 | `name`, `phone`, `isMember`, `isActive` |
| warehouses | 4 | `code`, `name`, `type`, `isActive` |
| stock_movements | 5 | `itemId`, `type`, `referenceType`, `referenceId`, `createdAt` |
| stock_balances | 2 | `itemId`, `warehouseId` |
| recipes | 2 | `itemId`, `name` |
| recipe_details | 2 | `recipeId`, `itemId` |
| purchases | 5 | `&poNumber`, `supplierId`, `status`, `orderDate`, `deletedAt` |
| purchase_details | 2 | `purchaseId`, `itemId` |
| sales | 5 | `&invoiceNumber`, `customerId`, `userId`, `paymentStatus`, `saleDate` |
| sale_details | 2 | `saleId`, `itemId` |
| payments | 2 | `saleId`, `method` |
| cash_sessions | 3 | `userId`, `status`, `openedAt` |
| settings | 2 | `&key`, `type` |
| audit_logs | 5 | `userId`, `action`, `entityType`, `entityId`, `createdAt` |

---

> **Document Version:** 1.0
>
> **Last Updated:** 2026-07-29
>
> **Status:** Active — Blueprint database POS Offline PWA
>
> **Total Tables:** 21 | **Total Indexes:** 71 | **Normalization:** 3NF (with selective denormalization)
