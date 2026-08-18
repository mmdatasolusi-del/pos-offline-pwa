# Universal Database Design — POS Offline PWA

> **Target Audience:** Retail, Minimarket, Toko Bangunan, Apotek, Warung Makan, Cafe, Restoran, Bakery, Laundry, Jasa
>
> **Prinsip:** Satu database, satu schema, semua jenis bisnis.

---

## Table of Contents

1. [Filosofi Database](#1-filosofi-database)
2. [Universal Item](#2-universal-item)
3. [Inventory Model](#3-inventory-model)
4. [Recipe / Bill Of Material](#4-recipe--bill-of-material)
5. [Purchase Flow](#5-purchase-flow)
6. [Sales Flow](#6-sales-flow)
7. [Pricing](#7-pricing)
8. [Multi Business Support](#8-multi-business-support)
9. [Scalability](#9-scalability)
10. [Best Practice](#10-best-practice)

---

## 1. Filosofi Database

### 1.1 Masalah

Setiap jenis bisnis memiliki cara pandang berbeda terhadap "barang":

| Bisnis | Barang | Stok | Notes |
|--------|--------|------|-------|
| Retail | Produk jadi | Ya | Beli jadi, jual jadi |
| Minimarket | Produk konsumen | Ya | Seperti retail + expired |
| Cafe | Minuman/Makanan | Resep | Butuh breakdown bahan baku |
| Restoran | Menu masakan | Resep | Kompleks, banyak variant |
| Bakery | Roti / Kue | Resep + Produk Jadi | Production order |
| Apotek | Obat | Batch + Expired | Butuh batch number, expired date |
| Toko Bangunan | Material | Ya | Satuan besar/kecil (sak, kg, pcs) |
| Laundry | Jasa | Tidak | Berat (kg) sebagai quantity |
| Jasa | Service | Tidak | Time-based billing |

**Pendekatan tradisional:** Buat table terpisah untuk setiap jenis → rumit, duplikasi, sulit di-maintain.

### 1.2 Solusi: Universal Item Model

Semua adalah **Item**. Satu table `items` (disebut `products` di schema) menampung semua jenis barang dan jasa.

```
┌─────────────────────────────────────────────────────────┐
│                      UNIVERSAL ITEM                      │
├─────────────┬──────────────┬──────────────┬──────────────┤
│  Produk Jadi │  Bahan Baku  │  Produk Resep│    Jasa     │
│  (Retail)    │  (Cafe)      │  (Restoran)  │  (Laundry)  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│  Barcode    │  Satuan beli │  Memiliki    │  Tidak ada   │
│  SKU        │  ≠           │  Recipe /    │  stok fisik  │
│  Harga Jual │  Satuan jual │  BOM         │  Harga/kg    │
│  Stok Fisik │              │              │              │
└─────────────┴──────────────┴──────────────┴──────────────┘
         │             │              │             │
         └─────────────┴──────────────┴─────────────┘
                           │
                    Satu Table: products
                    Satu Flow: Stock Movement
```

### 1.3 Perbandingan Pendekatan

| Aspek | Traditional Multi-Table | Universal Item |
|-------|------------------------|----------------|
| Jumlah table produk | 5+ (products, ingredients, menus, services, materials) | 1 (products) |
| Report lintas kategori | Join kompleks | Query satu table |
| Maintenance | Berbeda-beda | Seragam |
| Bisnis baru | Tambah table baru | Cukup tambah tipe |
| Code complexity | Tinggi | Rendah |

---

## 2. Universal Item

### 2.1 Definisi

Item adalah entitas yang bisa dijual, dibeli, digunakan dalam produksi, atau disediakan sebagai jasa.

Setiap item memiliki:

- `id` — UUID primary key
- `sku` — Kode unik item (auto-generated atau manual)
- `name` — Nama item
- `type` — Kategori jenis item (lihat 2.2)
- `barcode` — Barcode / EAN / UPC (opsional)
- `categoryId` — Kategori bisnis (Makanan, Minuman, dll)
- `unitId` — Satuan dasar (pcs, kg, liter)
- `buyPrice` — Harga beli / Harga pokok
- `sellPrice` — Harga jual standar
- `stock` — Stok saat ini (dihitung dari movement)
- `minStock` — Batas minimum stok
- `supplierId` — Supplier default
- `isActive` — Status aktif
- `image` — Gambar produk (opsional)
- `description` — Deskripsi

### 2.2 Jenis Item

```
ITEM TYPES HIERARCHY

                    ┌────────────────────┐
                    │      ITEM          │
                    │ (Universal)        │
                    └────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────┴───┐  ┌──────┴──────┐  ┌───┴────────┐
     │  PHYSICAL  │  │  CONSUME    │  │   SERVICE  │
     │  (ada stok)│  │  (habis     │  │  (no stok) │
     │            │  │   dipakai)  │  │            │
     └─────┬──────┘  └──────┬──────┘  └─────┬──────┘
           │                │                │
     ┌─────┴─────┐    ┌────┴────┐      ┌────┴─────┐
     │ RAW_      │    │ FINISHED│      │ SERVICES │
     │ MATERIAL  │    │ _PRODUCT│      │          │
     │           │    │         │      │ Laundry  │
     │ Tepung    │    │ Roti    │      │ Potong   │
     │ Gula      │    │ Kopi    │      │ Rambut   │
     │ Beras     │    │ Kemasan │      │ Servis AC│
     └───────────┘    └─────────┘      └──────────┘

     ┌────────────────────────────────────────────┐
     │ RECIPE_PRODUCT                              │
     │ (Produk yang dibuat dari bahan baku)        │
     │                                             │
     │ Es Teh = Teh Celup + Gula + Air + Es        │
     │ Nasi Goreng = Nasi + Telur + Bumbu          │
     │ Roti Tawar = Tepung + Ragi + Mentega        │
     └─────────────────────────────────────────────┘

     ┌────────────────────────────────────────────┐
     │ NON_STOCK                                   │
     │ (Produk dijual tanpa tracking stok)         │
     │                                             │
     │ Biaya Admin                                │
     │ Biaya Pengiriman                           │
     │ Diskon                                     │
     └─────────────────────────────────────────────┘
```

### 2.3 Tabel Jenis Item

| `type` | Ada Stok? | Bisa Dijual? | Bisa Dibeli? | Punya Recipe? | Contoh |
|--------|-----------|--------------|--------------|---------------|--------|
| `RAW_MATERIAL` | Ya | Tidak langsung | Ya | Tidak | Tepung, Gula, Beras, Kain |
| `FINISHED_PRODUCT` | Ya | Ya | Ya | Tidak | Minuman kemasan, Snack, Sabun |
| `RECIPE_PRODUCT` | Ya (dihitung) | Ya | Tidak | Ya | Es Teh, Nasi Goreng, Kopi |
| `SERVICE` | Tidak | Ya | Tidak | Tidak | Laundry per kg, Potong Rambut |
| `NON_STOCK` | Tidak | Ya | Tidak | Tidak | Biaya kirim, Biaya admin |

### 2.4 Contoh Nyata

**Retail — Minyak Goreng 2L**
```json
{
  "id": "prd-003",
  "sku": "PRD-0003",
  "name": "Minyak Goreng 2L",
  "type": "FINISHED_PRODUCT",
  "barcode": "8991001001003",
  "buyPrice": 22000,
  "sellPrice": 27000,
  "stock": 40,
  "unit": "liter"
}
```

**Cafe — Es Teh Manis**
```json
{
  "id": "prd-021",
  "sku": "PRD-0021",
  "name": "Es Teh Manis",
  "type": "RECIPE_PRODUCT",
  "sellPrice": 5000,
  "stock": null,
  "unit": "gelas"
}
```

**Laundry — Cuci Kering**
```json
{
  "id": "prd-030",
  "sku": "SRV-001",
  "name": "Cuci Kering",
  "type": "SERVICE",
  "sellPrice": 7000,
  "unit": "kg"
}
```

---

## 3. Inventory Model

### 3.1 Prinsip

**Stok tidak disimpan langsung di table item.**

Stok dihitung secara real-time dari `stock_movements`.

Ini adalah **Event Sourcing** sederhana:

```
Setiap perubahan stok = satu baris di stock_movements.

stock saat ini = SUM(qty) WHERE productId = X
```

### 3.2 Table `stock_movements`

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `productId` | UUID | Foreign key ke products |
| `type` | String | Jenis movement (lihat 3.3) |
| `quantity` | Number | + (masuk) / - (keluar) |
| `referenceType` | String | purchase, sale, adjustment, dll |
| `referenceId` | UUID | ID dokumen sumber |
| `unitPrice` | Number | Harga per unit saat movement |
| `userId` | UUID | Pelaku |
| `notes` | String | Catatan |
| `createdAt` | ISO | Timestamp |

### 3.3 Movement Types

```
STOCK MOVEMENT TYPES

MASUK (+QTY)                  KELUAR (-QTY)
─────────────────             ─────────────────
Opening Balance               Sale
Purchase                      Recipe Usage
Return From Customer          Adjustment (-)
Adjustment (+)                Transfer Out
Transfer In                   Production Usage
Production Result (+)         Waste / Damage
Stock Opname (found > book)   Stock Opname (found < book)
```

| Movement Type | Sign | Sumber | Contoh |
|--------------|------|--------|--------|
| `PURCHASE` | + | Purchase diterima | Beli 10 box beras |
| `SALE` | - | Penjualan | Jual 2 pcs sabun |
| `RECIPE_USAGE` | - | Produksi | Pakai 0.5 kg gula buat es teh |
| `RECIPE_RESULT` | + | Hasil produksi | Hasilkan 20 gelas es teh |
| `ADJUSTMENT` | +/- | Manual | Koreksi stok rusak |
| `TRANSFER_IN` | + | Antar toko | Transfer dari gudang A |
| `TRANSFER_OUT` | - | Antar toko | Kirim ke toko B |
| `RETURN` | + | Retur pembelian | Retur barang rusak |
| `OPENING_BALANCE` | + | Stok awal | Stok awal tahun |
| `OPNAME` | +/- | Stock opname | Selisih fisik vs sistem |

### 3.4 Flow Diagram

```
PURCHASE FLOW (MASUK)
═══════════════════════════════════════════════════════════

  Supplier
     │
     ▼
  Penerimaan Barang
     │
     ├── Purchase diterima (status: received)
     │
     ▼
  Stock Movement ── type: PURCHASE, qty: +10
     │
     ▼
  Inventory (calculated)
     Stock saat ini = sebelumnya + 10


SALES FLOW (KELUAR)
═══════════════════════════════════════════════════════════

  Customer Order
     │
     ▼
  Sales Invoice
     │
     ├── Jika FINISHED_PRODUCT ──► Stock Movement (SALE, -qty)
     │
     ├── Jika RECIPE_PRODUCT ──► Recipe Engine
     │                               │
     │                          Recipe Detail
     │                               │
     │                    ┌──────────┼──────────┐
     │                    ▼          ▼          ▼
     │              RAW_MATERIAL  RAW_MATERIAL  RAW_MATERIAL
     │                    │          │          │
     │              Movement(-)  Movement(-)  Movement(-)
     │                    │          │          │
     └────────────────────┴──────────┴──────────┘
                                      │
                                      ▼
                               Inventory Updated


STOCK OPNAME
═══════════════════════════════════════════════════════════

  Sistem: 50 pcs     Fisik: 48 pcs
     │                  │
     └──────────────────┘
              │
          Selisih: -2
              │
              ▼
  Stock Movement ── type: OPNAME, qty: -2
              │
              ▼
  Inventory → 48 pcs (terkoreksi)
```

### 3.5 Contoh Perhitungan Stok

```
Produk: Beras Premium 5kg

Date        Movement Type         Qty    Running Stock
──────────  ───────────────────  ─────   ─────────────
01-Jun-26   OPENING_BALANCE      +50     50
03-Jun-26   PURCHASE              +30     80
05-Jun-26   SALE                  -2      78
06-Jun-26   SALE                  -5      73
07-Jun-26   ADJUSTMENT (hilang)   -1      72
08-Jun-26   RETURN                +2      74
10-Jun-26   SALE                  -10     64
────────────────────────────────────────────────
Current Stock:                         64
```

---

## 4. Recipe / Bill Of Material

### 4.1 Konsep

Recipe adalah blueprint produksi. Menentukan **bahan apa saja** yang diperlukan untuk membuat **satu unit** produk.

### 4.2 Relasi Table

```
┌──────────────────┐       ┌──────────────────────┐
│     products     │       │    recipes            │
├──────────────────┤       ├──────────────────────┤
│ id (PK)          │◄──────│ productId (FK)        │
│ sku              │       │ id (PK)              │
│ name             │       │ name                 │
│ type: RECIPE_    │       │ yield (hasil per     │
│   PRODUCT        │       │        resep)        │
└──────────────────┘       │ instructions (ops)   │
                           └──────────┬───────────┘
                                      │ 1
                                      │
                                      │ N
                           ┌──────────▼───────────┐
                           │   recipe_details      │
                           ├──────────────────────┤
                           │ id (PK)              │
                           │ recipeId (FK)        │
                           │ productId (FK)       │◄──── bahan baku
                           │ quantity             │      (type: RAW_MATERIAL
                           │ unitId               │       atau FINISHED_PRODUCT)
                           └──────────────────────┘
```

### 4.3 Contoh: Es Teh Manis

**Produk Jadi:** Es Teh Manis (RECIPE_PRODUCT)
**Harga Jual:** Rp 5.000
**Yield:** 1 gelas

```
┌─────────────────────────────────────────────────────────┐
│                    ES TEH MANIS                          │
│                    1 gelas                               │
├─────────────────────────────────────────────────────────┤
│ Bahan                    Qty      Satuan   Harga/unit   │
├─────────────────────────────────────────────────────────┤
│ Teh Celup                1        pcs      Rp 500       │
│ Gula Pasir               0.025    kg       Rp 12.000/kg │
│ Air Mineral              0.2      liter    Rp 1.500/L   │
│ Es Batu                  0.1      kg       Rp 500/kg    │
│ Cup + Tutup              1        pcs      Rp 300       │
├─────────────────────────────────────────────────────────┤
│ TOTAL BAHAN                           Rp 1.155          │
│ MARGIN                                Rp 3.845 (77%)    │
└─────────────────────────────────────────────────────────┘
```

**Data dalam database:**

```json
// RECIPE
{
  "id": "recipe-001",
  "productId": "prd-021",
  "name": "Resep Es Teh Manis",
  "yield": 1,
  "yieldUnit": "gelas"
}

// RECIPE_DETAILS
[
  { "productId": "bhn-teh",   "quantity": 1,     "unitId": "pcs" },
  { "productId": "bhn-gula",  "quantity": 0.025,  "unitId": "kg" },
  { "productId": "bhn-air",   "quantity": 0.2,    "unitId": "liter" },
  { "productId": "bhn-es",    "quantity": 0.1,    "unitId": "kg" },
  { "productId": "bhn-cup",   "quantity": 1,      "unitId": "pcs" }
]
```

### 4.4 Flow Produksi

```
                    PRODUCTION FLOW

  Customer order 10 gelas Es Teh
          │
          ▼
  Hitung kebutuhan bahan:
  ├── Teh Celup: 10 × 1 = 10 pcs
  ├── Gula: 10 × 0.025 = 0.25 kg
  ├── Air: 10 × 0.2 = 2 liter
  ├── Es Batu: 10 × 0.1 = 1 kg
  └── Cup: 10 × 1 = 10 pcs
          │
          ▼
  Cek ketersediaan stok
  ├── Teh Celup: 50 pcs ✔
  ├── Gula: 10 kg ✔
  ├── Air: 20 liter ✔
  ├── Es Batu: 5 kg ✔
  └── Cup: 100 pcs ✔
          │
          ▼
  Buat Stock Movements:
  ├── Teh Celup  → RECIPE_USAGE, qty: -10
  ├── Gula       → RECIPE_USAGE, qty: -0.25
  ├── Air        → RECIPE_USAGE, qty: -2
  ├── Es Batu    → RECIPE_USAGE, qty: -1
  ├── Cup        → RECIPE_USAGE, qty: -10
  └── (tidak ada movement untuk Es Teh itu sendiri)
          │
          ▼
  Inventory ter-update
```

### 4.5 Recipe dengan Bahan Bertingkat

Untuk bisnis seperti **Bakery** atau **Restoran**, bahan baku bisa berupa produk jadi lain:

```
ROTI TAWAR (RECIPE_PRODUCT)
  ├── Tepung Terigu (RAW_MATERIAL)
  ├── Ragi (RAW_MATERIAL)
  ├── Mentega (FINISHED_PRODUCT — beli jadi)
  └── Susu Cair (FINISHED_PRODUCT — beli jadi)
```

### 4.6 Multi-Level BOM

Untuk industri yang lebih kompleks:

```
LEVEL 0: KUE ULANG TAHUN (RECIPE_PRODUCT)
           │
           ├── LEVEL 1: SPONGE CAKE (RECIPE_PRODUCT)
           │              ├── Tepung (RAW_MATERIAL)
           │              ├── Telur (RAW_MATERIAL)
           │              ├── Gula (RAW_MATERIAL)
           │              └── Mentega (RAW_MATERIAL)
           │
           ├── LEVEL 1: BUTTER CREAM (RECIPE_PRODUCT)
           │              ├── Mentega (RAW_MATERIAL)
           │              ├── Gula Halus (RAW_MATERIAL)
           │              └── Vanili (RAW_MATERIAL)
           │
           ├── LEVEL 1: TOPPING (FINISHED_PRODUCT — beli jadi)
           │
           └── LEVEL 1: BOX KEMASAN (FINISHED_PRODUCT)
```

---

## 5. Purchase Flow

### 5.1 Flow Lengkap

```
                    PURCHASE FLOW

  ┌──────────┐
  │ Supplier │
  └─────┬────┘
        │
        ▼
  ┌──────────────────┐
  │    PURCHASE      │ ← header transaksi
  │  (PO Number)     │
  │  Status: draft   │
  │         ↓        │
  │  Status: ordered │
  │         ↓        │
  │  Status: received│
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ PURCHASE_DETAILS │ ← items yang dibeli
  │ productId        │
  │ quantity         │
  │ unitPrice        │
  │ totalPrice       │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ STOCK_MOVEMENT   │
  │ type: PURCHASE   │
  │ productId        │
  │ qty: +10         │
  │ unitPrice: 55.000│ ← update average cost
  │ referenceId      │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ INVENTORY        │
  │ (calculated)     │
  │ Total stok += 10 │
  │ Avg Cost update  │
  └──────────────────┘
```

### 5.2 Data Model Purchase

```
┌─────────────────────────┐
│     purchases           │
├─────────────────────────┤
│ id (PK, UUID)           │
│ poNumber (unique)       │
│ supplierId (FK)         │
│ userId (FK)             │
│ status: draft|ordered|  │
│         received|cancel │
│ orderDate               │
│ receivedAt              │
│ subtotal                │
│ discount                │
│ tax                     │
│ grandTotal              │
│ notes                   │
│ createdAt, updatedAt,   │
│   deletedAt             │
└─────────────────────────┘

┌─────────────────────────┐
│   purchase_items        │
├─────────────────────────┤
│ id (PK, UUID)           │
│ purchaseId (FK)         │
│ productId (FK)          │
│ quantity                │
│ unitPrice               │
│ totalPrice              │
│ quantityReceived        │
└─────────────────────────┘
```

### 5.3 Status Flow

```
DRAFT ──► ORDERED ──► RECEIVED
                │           │
                ▼           ▼
             CANCELLED   (Partial OK)
```

### 5.4 Contoh Transaksi

```json
// Purchase
{
  "poNumber": "PO-20260729-0001",
  "supplierId": "sup-makmur",
  "status": "received",
  "subtotal": 620000,
  "grandTotal": 620000
}

// Purchase Items
[
  { "productId": "prd-001", "qty": 10, "unitPrice": 55000, "total": 550000 },
  { "productId": "prd-007", "qty": 20, "unitPrice": 3500,  "total": 70000 }
]

// Stock Movements (created saat status → received)
[
  { "type": "PURCHASE", "productId": "prd-001", "qty": +10, "unitPrice": 55000 },
  { "type": "PURCHASE", "productId": "prd-007", "qty": +20, "unitPrice": 3500 }
]
```

---

## 6. Sales Flow

### 6.1 Flow Lengkap

```
                      SALES FLOW

  ┌──────────┐
  │ Customer │
  └─────┬────┘
        │
        ▼
  ┌──────────────────┐
  │      SALES       │ ← header transaksi
  │ Invoice Number   │
  │ CustomerId       │
  │ SaleDate         │
  │ PaymentStatus    │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │   SALE_ITEMS     │ ← items yang dibeli
  │ productId        │
  │ quantity         │
  │ unitPrice        │
  │ totalPrice       │
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────────────────────────┐
  │     CEK TYPE ITEM                   │
  │                                     │
  │  ┌─────────────┐  ┌──────────────┐  │
  │  │ FINISHED_   │  │ RECIPE_      │  │
  │  │ PRODUCT     │  │ PRODUCT      │  │
  │  └──────┬──────┘  └──────┬───────┘  │
  │         │                │          │
  │         ▼                ▼          │
  │  Stock Movement     Recipe Engine   │
  │  SALE, -qty             │          │
  │                    ┌────┴────┐      │
  │                    │ Process │      │
  │                    │ Recipe  │      │
  │                    │ Details │      │
  │                    └────┬────┘      │
  │                         ▼          │
  │              Stock Movements       │
  │              RECIPE_USAGE          │
  │              per bahan, -qty       │
  └─────────────────────────────────────┘
           │
           ▼
  ┌──────────────────┐
  │    INVENTORY     │
  │  (auto update)   │
  └──────────────────┘
```

### 6.2 Data Model Sales

```
┌─────────────────────────┐
│       sales              │
├─────────────────────────┤
│ id (PK, UUID)           │
│ invoiceNumber (unique)  │
│ customerId (FK)         │
│ userId (FK)             │
│ shiftId (FK)            │
│ saleDate                │
│ subtotal                │
│ discount                │
│ tax                     │
│ grandTotal              │
│ paymentAmount           │
│ changeAmount            │
│ paymentStatus: paid|    │
│   pending|cancel        │
│ paymentMethod: cash|    │
│   debit|credit|qris     │
│ notes                   │
│ createdAt, updatedAt    │
└─────────────────────────┘

┌─────────────────────────┐
│     sale_items          │
├─────────────────────────┤
│ id (PK, UUID)           │
│ saleId (FK)             │
│ productId (FK)          │
│ quantity                │
│ unitPrice               │
│ totalPrice              │
│ discount                │
│ notes                   │
└─────────────────────────┘
```

### 6.3 Recipe Engine Flow Detail

```
RECIPE ENGINE (saat RECIPE_PRODUCT dijual)

  Input: productId = Es Teh Manis, qty = 2
          │
          ▼
  Cari recipe untuk productId
          │
          ▼
  Load recipe_details
          │
          ▼
  Untuk setiap detail:
  ┌──────────────────────────────────────┐
  │ Bahan: Teh Celup, qty: 1 × 2 = 2   │
  │ Cek stok: 50 > 2 → OK              │
  │ Movement: RECIPE_USAGE, qty: -2    │
  ├──────────────────────────────────────┤
  │ Bahan: Gula, qty: 0.025 × 2 = 0.05 │
  │ Cek stok: 10 > 0.05 → OK           │
  │ Movement: RECIPE_USAGE, qty: -0.05 │
  ├──────────────────────────────────────┤
  │ Bahan: Air, qty: 0.2 × 2 = 0.4     │
  │ Cek stok: 20 > 0.4 → OK            │
  │ Movement: RECIPE_USAGE, qty: -0.4  │
  ├──────────────────────────────────────┤
  │ Bahan: Cup, qty: 1 × 2 = 2        │
  │ Cek stok: 100 > 2 → OK            │
  │ Movement: RECIPE_USAGE, qty: -2   │
  └──────────────────────────────────────┘
          │
          ▼
  Batch insert semua movements
          │
          ▼
  Jika ada bahan dengan stok < minStock
  → Trigger notifikasi "Stok Menipis"
```

### 6.4 Contoh Transaksi Penjualan

**Skenario:** Customer membeli 1 Es Teh Manis (Rp 5.000) + 1 Snack (Rp 10.000)

```json
// Sale
{
  "invoiceNumber": "INV-20260729-0001",
  "customerId": null,
  "subtotal": 15000,
  "grandTotal": 15000,
  "paymentMethod": "CASH",
  "paymentAmount": 20000,
  "changeAmount": 5000
}

// Sale Items
[
  {
    "productId": "prd-021",   // Es Teh Manis
    "type": "RECIPE_PRODUCT",
    "qty": 1,
    "unitPrice": 5000
  },
  {
    "productId": "prd-011",   // Keripik Kentang
    "type": "FINISHED_PRODUCT",
    "qty": 1,
    "unitPrice": 10000
  }
]

// Stock Movements (dibuat otomatis)
[
  // Dari snack (FINISHED_PRODUCT)
  { "type": "SALE", "productId": "prd-011", "qty": -1 },

  // Dari recipe engine (RECIPE_PRODUCT)
  { "type": "RECIPE_USAGE", "productId": "bhn-teh", "qty": -1 },
  { "type": "RECIPE_USAGE", "productId": "bhn-gula", "qty": -0.025 },
  { "type": "RECIPE_USAGE", "productId": "bhn-air", "qty": -0.2 },
  { "type": "RECIPE_USAGE", "productId": "bhn-es", "qty": -0.1 },
  { "type": "RECIPE_USAGE", "productId": "bhn-cup", "qty": -1 }
]
```

---

## 7. Pricing

### 7.1 Jenis Harga

| Harga | Definisi | Sumber |
|-------|----------|--------|
| **Buy Price (Harga Beli)** | Harga per unit dari supplier | Purchase transaction |
| **Average Cost (Harga Rata)** | Rata-rata tertimbang dari semua pembelian | Calculated |
| **Sell Price (Harga Jual)** | Harga jual ke customer | Manual / formula |
| **Margin** | (SellPrice - AvgCost) / SellPrice × 100% | Calculated |

### 7.2 Average Cost Calculation

Menggunakan metode **Weighted Average Cost**:

```
AvgCost Baru = (TotalNilaiStok_Akhir + TotalNilaiPembelian_Baru)
               ────────────────────────────────────────────────
               (TotalStok_Akhir + JumlahPembelian_Baru)
```

**Contoh:**

```
Transaksi 1: Beli 10 unit @ Rp 5.000
  AvgCost = 5.000
  Total Stok = 10

Transaksi 2: Beli 20 unit @ Rp 6.000
  AvgCost = (10×5000 + 20×6000) / (10+20)
          = (50.000 + 120.000) / 30
          = 170.000 / 30
          = Rp 5.667

Penjualan: Jual 5 unit
  COGS = 5 × 5.667 = Rp 28.333
  Stok = 25 unit @ AvgCost 5.667

Transaksi 3: Beli 10 unit @ Rp 7.000
  AvgCost = (25×5667 + 10×7000) / (25+10)
          = (141.675 + 70.000) / 35
          = Rp 6.048
```

### 7.3 Margin Analysis

```
PROFITABILITAS PER PRODUK

Produk           Harga Jual     Avg Cost     Margin     Keuntungan
──────────────   ──────────     ────────     ──────     ──────────
Es Teh Manis      Rp 5.000      Rp 1.155     77%        Rp 3.845
Nasi Goreng       Rp 15.000     Rp 7.200     52%        Rp 7.800
Beras 5kg         Rp 65.000     Rp 55.000    15%        Rp 10.000
Snack             Rp 10.000     Rp 7.000     30%        Rp 3.000
Cuci Kering       Rp 7.000/kg   Rp 0         100%       Rp 7.000/kg
```

### 7.4 Multi Price

Satu produk bisa memiliki beberapa harga:

| Tipe Harga | Kegunaan | Contoh |
|------------|----------|--------|
| `REGULAR` | Harga standar | Rp 10.000 |
| `MEMBER` | Harga member | Rp 8.500 |
| `WHOLESALE` | Harga grosir (qty >= 10) | Rp 7.500 |
| `PROMO` | Harga promo (time-limited) | Rp 6.999 |

```json
// Multi Price pada product
{
  "id": "prd-011",
  "name": "Keripik Kentang",
  "sellPrice": 10000,
  "prices": [
    { "tier": "REGULAR",   "price": 10000 },
    { "tier": "MEMBER",    "price": 8500 },
    { "tier": "WHOLESALE", "price": 7500, "minQty": 10 },
    { "tier": "PROMO",     "price": 6999, "validUntil": "2026-08-15" }
  ]
}
```

### 7.5 Cost untuk Recipe Product

Biaya pokok RECIPE_PRODUCT dihitung dari jumlah biaya bahan baku:

```
HPP Es Teh = (1 × 500) + (0.025 × 12000) + (0.2 × 1500) + (0.1 × 500) + (1 × 300)
          = 500 + 300 + 300 + 50 + 300
          = Rp 1.450

HPP Nasi Goreng = (0.2 × 15000) + (1 × 2000) + (0.05 × 40000) + (0.03 × 15000)
               = 3000 + 2000 + 2000 + 450
               = Rp 7.450
```

---

## 8. Multi Business Support

### 8.1 Satu Database, Semua Bisnis

Kekuatan Universal Item Model: semua jenis bisnis menggunakan table yang **sama**.

```
┌──────────────────────────────────────────────────────────────┐
│                     products TABLE                            │
├──────────┬────────────┬──────────┬──────────┬───────────────┤
│ RETAIL   │ CAFE       │ RESTAURANT│ LAUNDRY  │ SERVICE      │
├──────────┼────────────┼──────────┼──────────┼───────────────┤
│ Produk   │ Bahan baku │ Bahan    │ Harga/kg │ Tarif jasa   │
│ dengan   │ + Resep    │ baku +   │ (jasa,   │ (time-based) │
│ barcode  │ minuman    │ Resep    │ no stok) │              │
│ stok     │            │ masakan  │          │              │
└──────────┴────────────┴──────────┴──────────┴───────────────┘
```

### 8.2 Perbedaan Operasional

| Aspek | Retail | Cafe / Restaurant | Laundry | Jasa |
|-------|--------|-------------------|---------|------|
| **Item type** | FINISHED_PRODUCT | RECIPE_PRODUCT | SERVICE | SERVICE |
| **Stok** | Ya | Recipe, bahan baku saja | Tidak ada | Tidak ada |
| **Unit** | pcs, pack, box | pcs, gelas, porsi | kg | jam, kali |
| **Harga per** | Unit | Unit | Berat | Waktu |
| **Purchase** | Produk jadi | Bahan baku | Tidak | Tidak |
| **Recipe** | Tidak | Ya | Tidak | Tidak |
| **Barcode** | Wajib | Opsional | Tidak | Tidak |
| **Expired** | Penting | Penting (bahan) | Tidak | Tidak |

### 8.3 Konfigurasi per Bisnis

Cukup set `app.config`:

```json
{
  "businessType": "CAFE",         // RETAIL | CAFE | RESTAURANT | LAUNDRY | SERVICE
  "enableRecipe": true,
  "enableStock": true,
  "enableExpired": false,
  "enableMultiPrice": true,
  "enableTableManagement": true,  // untuk restoran
  "enableShift": true
}
```

### 8.4 Contoh Mapping per Bisnis

**Toko Retail** (barcode, stok, supplier)
```
products:  FINISHED_PRODUCT (Minyak Goreng, Beras, Sabun)
purchases: Ya — dari supplier
sales:     Ya — ke customer
recipe:    Tidak
```

**Cafe** (bahan baku + menu)
```
products:  RAW_MATERIAL (Teh, Gula, Kopi)
           RECIPE_PRODUCT (Es Teh, Kopi Tubruk)
purchases: Bahan baku
sales:     Menu (recipe → auto kurangi bahan)
recipe:    Es Teh = Teh + Gula + Air
```

**Restoran** (seperti cafe + table management)
```
products:  RAW_MATERIAL (Daging, Sayur, Bumbu)
           RECIPE_PRODUCT (Nasi Goreng, Soto)
tables:    Meja 1-20 (management meja)
kitchen:   Kitchen Order (integrasi dapur)
```

**Laundry** (jasa per kg)
```
products:  SERVICE (Cuci Kering, Setrika)
           NON_STOCK (Biaya Antar Jemput)
stock:     Tidak ada tracking stok
sales:     Berat (kg) sebagai quantity di sale_items
```

**Bakery** (produksi harian)
```
products:  RAW_MATERIAL (Tepung, Ragi, Mentega)
           RECIPE_PRODUCT (Roti Tawar, Donat)
           FINISHED_PRODUCT (Roti bungkus, Kue kotak)
production:Production Order harian
recipe:    Multi-level BOM
```

---

## 9. Scalability

### 9.1 Offline First Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                         │
│                                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │     IndexedDB       │    │   Service Worker Cache   │   │
│  │  (Dexie.js)         │    │                          │   │
│  │                     │    │  HTML, CSS, JS           │   │
│  │  products           │    │  CDN Assets              │   │
│  │  stock_movements    │    │  Images                  │   │
│  │  sales              │    │                          │   │
│  │  purchases          │    │                          │   │
│  │  recipes            │    │                          │   │
│  └─────────┬───────────┘    └──────────────────────────┘   │
│            │                                                 │
│      ┌─────┴──────┐                                          │
│      │ Sync Engine│  (Future: Cloud Sync)                   │
│      │ (offline)  │                                          │
│      └─────┬──────┘                                          │
└────────────┼──────────────────────────────────────────────────┘
             │
             │  (Online → Cloud Sync)
             ▼
┌────────────────────────────────────────────────────────────┐
│                    CLOUD (Future)                           │
│                                                             │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  API Gateway   │  │  PostgreSQL  │  │  Object Store  │ │
│  │  (REST/WS)     │  │  (Central DB)│  │  (Images)      │ │
│  └────────────────┘  └──────────────┘  └────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 9.2 Multi-Store / Warehouse

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Store A     │     │  Store B     │     │  Warehouse   │
│  (Offline)   │     │  (Offline)   │     │  (Offline)   │
│              │     │              │     │              │
│  Stock: 100  │     │  Stock: 50   │     │  Stock: 500  │
│  Sales: Ya   │     │  Sales: Ya   │     │  Sales: No   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       └────────────────────┼─────────────────────┘
                            │
                     ┌──────┴──────┐
                     │  Transfer   │
                     │  Order      │
                     │  (antar     │
                     │   store)    │
                     └─────────────┘
```

### 9.3 Sync Strategy

| Mode | Kapan | Cara |
|------|-------|------|
| **Offline** | Default | Semua operasi lokal ke IndexedDB |
| **Online** | Saat connect | Data otomatis sync ke cloud |
| **Conflict** | Data conflict | Last-write-wins + audit log |
| **Reconnect** | After offline | Pull delta changes + push local changes |

### 9.4 Skalabilitas Data

| Fase | Data | Strategy |
|------|------|----------|
| Startup | < 10.000 products | Semua in-memory (Dexie toArray) |
| Growth | 10k - 100k | IndexedDB query + pagination |
| Scale | > 100k | Dexie compound index + lazy load |
| Enterprise | Multi-store | Cloud sync + partitioned data |

---

## 10. Best Practice

### 10.1 Repository Pattern

```
┌────────────────────────────────────────────────────┐
│                REPOSITORY LAYER                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           BaseRepository                     │   │
│  ├──────────────────────────────────────────────┤   │
│  │  getAll(filter, sort, pagination)            │   │
│  │  getById(id)                                 │   │
│  │  create(data) → otomatis UUID + timestamp    │   │
│  │  update(id, changes) → partial update        │   │
│  │  delete(id) → soft delete (set deletedAt)    │   │
│  │  hardDelete(id) → permanent delete           │   │
│  │  count(filter)                               │   │
│  │  exists(id)                                  │   │
│  └──────────────────────────────────────────────┘   │
│         ▲          ▲          ▲                     │
│         │          │          │                     │
│  ┌──────┴───┐ ┌───┴────┐ ┌───┴───────┐             │
│  │Product   │ │ Sales  │ │ Purchase  │             │
│  │Repo      │ │ Repo   │ │ Repo      │             │
│  └──────────┘ └────────┘ └───────────┘             │
└────────────────────────────────────────────────────┘
```

### 10.2 Service Layer

```
┌────────────────────────────────────────────────────┐
│                SERVICE LAYER                         │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ ProductService                               │   │
│  │                                              │   │
│  │  create(data) → validate + save              │   │
│  │  update(id, data) → validate + save          │   │
│  │  delete(id) → soft delete                    │   │
│  │  getAll() → filter + sort + paginate         │   │
│  │  search(q) → fulltext search                 │   │
│  │  exportToExcel() → SheetJS                   │   │
│  │  importFromExcel(file) → parse + bulk        │   │
│  │  generateSku() → auto code                   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ RecipeEngine                                 │   │
│  │                                              │   │
│  │  calculateBOM(productId, qty)                │   │
│  │  checkStockAvailability(bom)                 │   │
│  │  processRecipe(saleItem) → movements         │   │
│  │  calculateHPP(productId)                     │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

### 10.3 Dexie Practices

| Practice | Detail |
|----------|--------|
| **Compound index** | Gunakan index gabungan untuk query cepat (`[type+deletedAt]`) |
| **Bulk operation** | `bulkAdd`, `bulkPut` untuk batch insert/update |
| **Transaction** | `db.transaction('rw', ...tables, async () => {...})` untuk atomicity |
| **Soft delete** | Set `deletedAt`, jangan hapus fisik |
| **Versioning** | `db.version(N).stores(...)` untuk migrasi schema |
| **Lazy loading** | Pagination dengan `offset()` dan `limit()` untuk data besar |

### 10.4 IndexedDB Best Practices

| Best Practice | Why |
|---------------|-----|
| **Offline first** | Semua operasi lokal, tidak perlu koneksi internet |
| **Limit per query** | Gunakan pagination, jangan `toArray()` untuk semua data |
| **Unique constraint** | Gunakan `&` prefix di Dexie schema untuk unique index |
| **Error handling** | Setiap operasi DB harus try-catch |
| **Audit trail** | Semua perubahan stok punya `stock_movements` |
| **Backup** | Export IndexedDB ke JSON untuk backup offline |

### 10.5 Folder Structure

```
src/
├── database/
│   ├── db.js                # Koneksi Dexie + schema version
│   ├── schema.js            # Definisi semua table + index
│   ├── migrations.js        # Migrasi data antar versi
│   ├── seeds.js             # Data awal (settings, demo products)
│   └── database-manager.js  # Init, open, close, status
│
├── repositories/
│   ├── base-repository.js   # CRUD generic
│   └── ...                  # Repository spesifik per modul
│
├── modules/
│   ├── product/
│   │   ├── product-repository.js  # Akses data produk
│   │   ├── product-service.js     # Business logic produk
│   │   ├── product-validator.js   # Validasi form
│   │   ├── product-utils.js       # Helpers (format, currency)
│   │   └── index.js               # Barrel export
│   ├── sales/
│   │   ├── sales-repository.js
│   │   ├── sales-service.js       # Termasuk RecipeEngine
│   │   └── index.js
│   └── ...                        # purchase, inventory, dll
│
├── services/
│   └── ...                        # Cross-module services
│
└── pages/
    └── products/
        └── products-page.js       # UI layer — panggil service
```

### 10.6 Data Flow Diagram (Ringkasan)

```
UI (pages)
  │
  ▼
Service Layer (business logic, validation)
  │
  ▼
Repository Layer (Dexie CRUD)
  │
  ▼
IndexedDB (persistent storage)
  │
  ▼
Service Worker Cache (offline assets)
```

---

## Appendix: Complete Table Reference

| Table | Primary Key | Key Indexes | Purpose |
|-------|------------|-------------|---------|
| `users` | id | username, roleId | User/login management |
| `roles` | id | name | Role-based access |
| `permissions` | id | roleId, module, action | Permission matrix |
| `settings` | id | key | Store config |
| `categories` | id | name, parentId | Product grouping |
| `units` | id | name | Satuan (pcs, kg) |
| `products` | id | sku, barcode, name, type | Universal items |
| `suppliers` | id | code, name | Vendor master |
| `customers` | id | name, phone | Customer master |
| `recipes` | id | productId | BOM header |
| `recipe_details` | id | recipeId, productId | BOM lines |
| `purchases` | id | poNumber, supplierId, status | Purchase orders |
| `purchase_items` | id | purchaseId, productId | Purchase lines |
| `sales` | id | invoiceNumber, customerId | Sales transactions |
| `sale_items` | id | saleId, productId | Sales lines |
| `stock_movements` | id | productId, type, referenceType | Stock ledger |
| `payments` | id | saleId, method | Payment records |
| `inventories` | productId | productId | Stock snapshot (materialized) |
| `audit_logs` | id | userId, action, entityType | Audit trail |
| `backup_metadata` | id | schemaVersion | Backup tracking |

---

> **Document Version:** 1.0
>
> **Last Updated:** 2026-07-29
>
> **Status:** Active — Referensi utama arsitektur database POS Offline PWA
