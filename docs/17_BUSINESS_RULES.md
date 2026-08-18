# Business Rules — POS Offline PWA

> **Single Source of Truth** — Semua aturan bisnis untuk pengembangan aplikasi.
>
> Berlaku untuk: Developer, AI (OpenCode/Cursor AI), QA, Tester.
>
> Jangan membuat source code — dokumen ini hanya aturan.

---

## Table of Contents

1. [Filosofi Aturan Bisnis](#1-filosofi-aturan-bisnis)
2. [Master Data Rules](#2-master-data-rules)
3. [Inventory Rules](#3-inventory-rules)
4. [Product Rules](#4-product-rules)
5. [Recipe Rules (BOM)](#5-recipe-rules-bom)
6. [Purchase Rules](#6-purchase-rules)
7. [Sales Rules](#7-sales-rules)
8. [Discount Rules](#8-discount-rules)
9. [Tax Rules](#9-tax-rules)
10. [Pricing Rules](#10-pricing-rules)
11. [Customer Rules](#11-customer-rules)
12. [Supplier Rules](#12-supplier-rules)
13. [Cashier Rules](#13-cashier-rules)
14. [Reporting Rules](#14-reporting-rules)
15. [Audit Rules](#15-audit-rules)
16. [Backup & Restore Rules](#16-backup--restore-rules)
17. [Synchronization Rules](#17-synchronization-rules)
18. [Security Rules](#18-security-rules)
19. [Validation Rules](#19-validation-rules)
20. [Error Handling Rules](#20-error-handling-rules)
21. [Future Features](#21-future-features)
22. [Business Flow](#22-business-flow)
23. [Best Practices](#23-best-practices)

---

## 1. Filosofi Aturan Bisnis

### 1.1 Prinsip Dasar

| Prinsip | Penjelasan | Dampak |
|---------|------------|--------|
| **Offline First** | Semua fitur harus berfungsi 100% tanpa koneksi internet. Internet adalah bonus, bukan kebutuhan. | IndexedDB sebagai primary storage. Service Worker untuk cache. Cloud sync adalah fitur tambahan. |
| **Data Consistency** | Data harus konsisten bahkan saat offline. Tidak ada split-brain. | Event sourcing untuk stok. Transactional write ke IndexedDB. Validasi sebelum write. |
| **Auditability** | Semua perubahan data harus bisa dilacak. | Stock Movement immutable. Audit log untuk semua operasi CRUD. |
| **Scalability** | Arsitektur harus bisa tumbuh dari toko kecil ke enterprise multi-store. | Universal Item Model. Repository Pattern. Service Layer terpisah. |
| **Simplicity** | Sederhana, mudah dipahami, mudah di-maintain. | Satu tabel `products` untuk semua jenis barang. Flat structure. Minimal dependency. |
| **Security** | Data pengguna dan transaksi aman. | Password di-hash (SHA-256). Session-based auth. Role-based access control. |
| **Universal POS** | Satu aplikasi melayani semua jenis bisnis. | Item type (RAW_MATERIAL, FINISHED_PRODUCT, RECIPE_PRODUCT, SERVICE, NON_STOCK). Config-driven business rules. |
| **Single Source of Truth** | Dokumen ini adalah satu-satunya referensi aturan bisnis. Tidak ada aturan di kode yang tidak tercatat di sini. | Setiap aturan bisnis harus didokumentasikan di sini sebelum diimplementasikan. |

### 1.2 Target Pengguna

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│    RETAIL    │   MAKANAN    │    JASA      │   APOTEK     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Toko Kelontong│ Warung Makan│ Laundry      │ Apotek       │
│ Minimarket   │ Cafe        │ Jasa Cetak   │ Toko Obat    │
│ Toko Bangunan│ Restoran    │ Service HP   │              │
│              │ Bakery      │ Fotocopy     │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 1.3 Edge Cases

Setiap aturan bisnis harus mempertimbangkan:

- **Double click** — User klik submit dua kali
- **Offline submit** — Data masuk saat offline, conflict saat online
- **Decimal quantity** — 0.5 kg gula, 1.25 liter minyak
- **Zero price** — Gratis / hadiah
- **Negative stock** — Apakah diizinkan? Config-driven
- **Cancel after receive** — PO sudah received tapi harus dibatalkan
- **Split payment** — Bayar sebagian cash, sebagian debit
- **Partial receive** — PO 10 item, baru diterima 7
- **Void sale** — Transaksi sudah selesai tapi harus dibatalkan
- **Price change** — Harga produk berubah setelah masuk keranjang

---

## 2. Master Data Rules

### 2.1 Item (Produk / Barang)

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Mewakili semua jenis barang dan jasa yang bisa dijual, dibeli, atau digunakan dalam produksi |
| **Primary Key** | UUID, auto-generated |
| **SKU** | Auto-generated (`PRD-XXXX`) atau manual. **Unique** — tidak boleh duplikat |
| **Barcode** | Opsional. Jika diisi, harus unique. Format bebas (EAN-13, UPC, atau kode toko) |
| **Nama** | **Wajib**. Min 1 karakter. Maks 255 karakter |
| **Tipe** | Wajib. Salah satu: `RAW_MATERIAL`, `FINISHED_PRODUCT`, `RECIPE_PRODUCT`, `SERVICE`, `NON_STOCK` |
| **Harga Beli** | Wajib. >= 0. Untuk SERVICE dan NON_STOCK bisa 0 |
| **Harga Jual** | Wajib. >= 0. Bisa 0 untuk barang gratisan |
| **Stok** | **Calculated** dari stock_movements. Tidak bisa diedit manual. Untuk SERVICE dan NON_STOCK selalu 0 |
| **Stok Minimum** | Opsional. Default 0. Jika stok <= minStock → trigger notifikasi |
| **Status** | Aktif / Nonaktif. Item nonaktif tidak muncul di dropdown penjualan |
| **Soft Delete** | Set `deletedAt`. Data tidak pernah hilang |
| **Audit** | `createdAt`, `updatedAt`, `deletedAt` |

**Validasi Khusus:**

```
Edge Case: Item dengan tipe RECIPE_PRODUCT tidak boleh langsung dijual
           tanpa mengecek ketersediaan bahan baku.

Aturan:    Saat RECIPE_PRODUCT dijual, sistem HARUS:
           1. Load recipe
           2. Cek stok semua bahan
           3. Jika ada bahan kurang → tolak transaksi (kecuali allowNegativeStock = true)
           4. Buat movement RECIPE_USAGE untuk setiap bahan
```

**Status Flow:**

```
DIBUAT ──► AKTIF ──► NONAKTIF ──► DIHAPUS (soft delete)
             │                        │
             └── (bisa balik aktif)    └── (bisa dipulihkan)
```

### 2.2 Kategori

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Mengelompokkan item untuk memudahkan pencarian dan report |
| **Hierarki** | Self-referencing (`parentId`). Unlimited depth |
| **Nama** | Wajib. Unique per level (tidak boleh ada child dengan nama yang sama dalam satu parent) |
| **Circular Reference** | `parentId` tidak boleh sama dengan `id`. Tidak boleh ada rantai yang kembali ke diri sendiri |
| **Soft Delete** | Kategori yang memiliki item aktif tidak bisa dihapus. Harus nonaktifkan item dulu |

**Edge Case:**
```
Kategori "Minuman" memiliki child "Kopi" dan "Teh".
Kategori "Teh" memiliki child "Teh Manis" dan "Teh Tawar".

Yang TIDAK BOLEH:
  "Teh" → parentId = "Teh Manis"  (circular, Teh Manis child dari Teh)
  "Teh" → parentId = "Teh"         (self-reference)
```

### 2.3 Satuan

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Satuan ukuran item — pcs, kg, liter, pack, box, dus |
| **Nama** | Wajib. Unique |
| **Singkatan** | Wajib. Unique |
| **Konversi** | Future: 1 box = 24 pcs. Belum diimplementasikan |

### 2.4 Supplier

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Data pemasok / vendor |
| **Kode** | Auto-generated (`SUP-XXX`) atau manual. Unique |
| **Nama** | Wajib |
| **Soft Delete** | Supplier yang memiliki transaksi tidak bisa dihapus. Di-nonaktifkan saja |

### 2.5 Customer

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Data pelanggan |
| **Nama** | Wajib |
| **Member** | Opsional. Member number unique |
| **Soft Delete** | Customer yang memiliki transaksi tidak bisa dihapus. Di-nonaktifkan saja |
| **Blacklist** | Customer blacklist tidak bisa bertransaksi |

### 2.6 Gudang (Warehouse)

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Lokasi fisik penyimpanan barang |
| **Kode** | Unique |
| **Nama** | Wajib |
| **Default** | Minimal satu warehouse harus ada. Semua transaksi menggunakan warehouse default jika multi-warehouse tidak aktif |
| **Soft Delete** | Warehouse yang memiliki stok tidak bisa dihapus |

### 2.7 Role

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Jabatan / level akses |
| **System Role** | `Owner`, `Admin`, `Kasir` — tidak bisa dihapus atau diedit namanya |
| **Custom Role** | Bisa ditambah oleh Owner |
| **Soft Delete** | Role yang digunakan user tidak bisa dihapus |

### 2.8 Permission

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Matrix hak akses per role |
| **Module** | `dashboard`, `pos`, `products`, `categories`, `suppliers`, `customers`, `sales`, `purchases`, `reports`, `settings`, `users`, `roles`, `permissions` |
| **Action** | `create`, `read`, `update`, `delete` |
| **Owner** | Memiliki semua permission — tidak bisa diubah |
| **Admin** | Default memiliki akses ke semua module. Bisa dikurangi |

### 2.9 Settings

| Atribut | Aturan |
|---------|--------|
| **Tujuan** | Key-value store untuk konfigurasi |
| **Key** | Unique. `snake_case` |
| **Value** | String. Di-parse sesuai `type` |
| **Type** | `string`, `number`, `boolean` |

**Setting Wajib:**

| Key | Default | Deskripsi |
|-----|---------|-----------|
| `store-name` | `Toko Saya` | Nama toko |
| `store-address` | `''` | Alamat toko |
| `store-phone` | `''` | Telepon toko |
| `app-theme` | `light` | Tema aplikasi |
| `currency` | `IDR` | Mata uang |
| `locale` | `id-ID` | Locale |
| `timezone` | `Asia/Jakarta` | Zona waktu |
| `tax-default-rate` | `0` | PPN default (%) |
| `allow-negative-stock` | `false` | Izinkan stok negatif |
| `shift-enabled` | `false` | Aktifkan shift kasir |

---

## 3. Inventory Rules

### 3.1 Prinsip Fundamental

```
┌─────────────────────────────────────────────────────────────────┐
│                 PRINSIP INVENTORY                                │
│                                                                  │
│  🔴 TIDAK BOLEH ADA PROSES YANG LANGSUNG MENGUBAH STOK          │
│                                                                  │
│  ✅ SEMUA PERUBAHAN STOK HARUS MELALUI STOCK MOVEMENT           │
│                                                                  │
│  Stok saat ini = SUM(quantity) FROM stock_movements             │
│                   WHERE itemId = X                              │
│                                                                  │
│  stock_balances adalah MATERIALIZED VIEW — bisa di-rebuild      │
│  kapan saja dari stock_movements                                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Jenis Stock Movement

| Movement Type | Sign | Sumber | Efek Stok | Wajib Reference |
|--------------|------|--------|-----------|-----------------|
| `OPENING_BALANCE` | + | Manual | Menambah | Tidak |
| `PURCHASE` | + | Purchase | Menambah | purchase_detail.id |
| `PURCHASE_RETURN` | - | Purchase | Mengurangi | purchase_detail.id |
| `SALE` | - | Sale | Mengurangi | sale_detail.id |
| `SALE_RETURN` | + | Sale | Menambah | sale_detail.id |
| `PRODUCTION` | +/- | Production | Bisa kedua | production_order.id |
| `RECIPE_CONSUMPTION` | - | Recipe | Mengurangi | recipe_detail.id |
| `ADJUSTMENT` | +/- | Manual | Bisa kedua | Tidak |
| `OPNAME` | +/- | Opname | Bisa kedua | stock_opname.id |
| `TRANSFER_OUT` | - | Transfer | Mengurangi | transfer.id |
| `TRANSFER_IN` | + | Transfer | Menambah | transfer.id |
| `DAMAGE` | - | Manual | Mengurangi | Tidak |
| `EXPIRED` | - | Manual | Mengurangi | Tidak |
| `MANUAL_CORRECTION` | +/- | Manual | Bisa kedua | Tidak |

### 3.3 Flow Diagram Inventory

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INVENTORY FLOW                               │
│                                                                     │
│  OPENING_BALANCE ──(+)──┐                                           │
│  PURCHASE         ──(+)──┤                                           │
│  SALE_RETURN      ──(+)──┤                                           │
│  ADJUSTMENT (+)   ──(+)──┤                                           │
│  OPNAME (found >) ──(+)──┤                                           │
│  TRANSFER_IN      ──(+)──┤                                           │
│  PRODUCTION (+)   ──(+)──┤                                           │
│                          │                                           │
│                          ▼                                           │
│              ┌─────────────────────┐                                │
│              │   STOCK MOVEMENT    │                                │
│              │   (immutable log)   │                                │
│              └──────────┬──────────┘                                │
│                         │                                           │
│              ┌──────────▼──────────┐                                │
│              │   STOCK BALANCE     │  (calculated = SUM)            │
│              └─────────────────────┘                                │
│                         ▲                                           │
│                         │                                           │
│  SALE             ──(─)─┘                                           │
│  PURCHASE_RETURN  ──(─)─┘                                           │
│  RECIPE_CONSUME   ──(─)─┘                                           │
│  ADJUSTMENT (-)   ──(─)─┘                                           │
│  TRANSFER_OUT     ──(─)─┘                                           │
│  DAMAGE           ──(─)─┘                                           │
│  EXPIRED          ──(─)─┘                                           │
│  PRODUCTION (-)   ──(─)─┘                                           │
│  MANUAL_CORRECTION──(─)─┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Aturan Inventory

| # | Aturan | Kategori |
|---|--------|----------|
| 1 | Stok hanya bisa dibaca (read-only). Tidak ada update langsung ke kolom stok | Immutable |
| 2 | Setiap perubahan stok wajib dicatat sebagai Stock Movement | Audit |
| 3 | Stock Movement bersifat **immutable** — tidak bisa diubah atau dihapus setelah dibuat | Immutable |
| 4 | Koreksi stok salah dilakukan dengan movement baru (reversal), bukan edit movement lama | Immutable |
| 5 | Movement `SALE` dan `RECIPE_CONSUMPTION` tidak boleh membuat stok negatif, kecuali `allowNegativeStock = true` | Consistency |
| 6 | Stok minimum bersifat warning, bukan blocking. User tetap bisa menjual meskipun stok di bawah minimum | Flexibility |
| 7 | Stock Opname menghasilkan movement `OPNAME` dengan quantity = selisih (fisik - sistem) | Opname |
| 8 | Satu movement hanya untuk satu item. Tidak bisa batch | Atomicity |
| 9 | Movement wajib mencantumkan `warehouseId` untuk mendukung multi-gudang | Multi-warehouse |
| 10 | Movement wajib mencantumkan `referenceType` dan `referenceId` jika berasal dari transaksi | Traceability |

### 3.5 Stock Opname Rules

```
Flow Stock Opname:

  1. Buat sesi opname (header)
  2. Input stok fisik per item
  3. Sistem hitung selisih: fisik - sistem
  4. Jika selisih != 0:
       a. Buat movement OPNAME dengan qty = selisih
       b. Catat userId, notes, timestamp
  5. Tutup sesi opname
  
Aturan:
  - Selama sesi opname terbuka, item terkait tidak bisa bertransaksi (opsional)
  - Selisih > threshold (configurable) perlu approval
  - Opname wajib selesai dalam 1 shift (default)
```

### 3.6 Negative Stock

```
allowNegativeStock = false (default):
  - Sale ditolak jika stok tidak cukup
  - Recipe Consumption ditolak jika bahan tidak cukup
  - Transfer Out ditolak jika stok tidak cukup

allowNegativeStock = true:
  - Sale tetap diproses meskipun stok kurang
  - Stock Balance bisa negatif
  - Movement tetap tercatat (audit trail)
  - Warning: "Stok tidak cukup" ditampilkan tapi tidak memblokir
  
Edge Case:
  Stok = 2, customer beli 5.
  allowNegativeStock = false → tolak transaksi
  allowNegativeStock = true  → proses, stok jadi -3
```

---

## 4. Product Rules

### 4.1 Item Type

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ITEM TYPE                                  │
├─────────────┬──────────┬──────────┬──────────┬──────────┬───────────┤
│             │RAW       │FINISHED  │RECIPE    │SERVICE   │NON_STOCK  │
│             │MATERIAL  │PRODUCT   │PRODUCT   │          │           │
├─────────────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ Ada Stok?   │ Ya       │ Ya       │ Dihitung  │ Tidak    │ Tidak     │
│ Bisa Jual?  │ Tidak    │ Ya       │ Ya       │ Ya       │ Ya        │
│ Bisa Beli?  │ Ya       │ Ya       │ Tidak    │ Tidak    │ Tidak     │
│ Punya Recipe│ Tidak    │ Tidak    │ Ya       │ Tidak    │ Tidak     │
│ Contoh      │ Tepung   │ Minyak   │ Es Teh   │ Laundry  │ Biaya Kirim│
│             │ Gula     │ Snack    │ Kopi     │ Potong   │ Diskon    │
│             │ Beras    │ Sabun    │ Nasi     │ Rambut   │ Admin     │
└─────────────┴──────────┴──────────┴──────────┴──────────┴───────────┘
```

### 4.2 Inventory Type

Produk bisa memiliki flag yang menentukan bagaimana inventory diperlakukan:

| Flag | Default | Deskripsi |
|------|---------|-----------|
| `stock` | Ya (kecuali SERVICE/NON_STOCK) | Apakah produk dilacak stoknya |
| `nonStock` | Tidak | Produk tanpa tracking stok |
| `sellable` | Ya | Bisa dijual langsung |
| `purchasable` | Ya (kecuali RECIPE_PRODUCT) | Bisa dibeli dari supplier |
| `trackExpired` | Tidak | Apakah expired date dicatat |
| `trackBatch` | Tidak | Apakah batch number dicatat |
| `multiBarcode` | Tidak | Barcode berbeda untuk varian berbeda |
| `multiUnit` | Tidak | Bisa dijual dalam satuan berbeda (1 box = 24 pcs) |
| `bundle` | Tidak | Paket yang berisi beberapa produk |
| `serialNumber` | Tidak | Setiap unit punya serial number unik |

### 4.3 Bundle Product Rules

```
Bundle = Satu produk yang berisi beberapa produk lain dengan harga khusus.

Contoh: Paket Sembako = Beras 5kg + Minyak 2L + Gula 1kg = Rp 85.000
        Harga jika beli terpisah = Rp 65.000 + Rp 27.000 + Rp 15.000 = Rp 107.000

Aturan Bundle:
  1. Bundle adalah FINISHED_PRODUCT dengan flag bundle = true
  2. Bundle memiliki bundle_details (itemId, quantity)
  3. Saat bundle dijual, stok bundle berkurang (+ movement SALE)
  4. Stok item di dalam bundle TIDAK berkurang (bundle adalah produk terpisah)
  5. Bundle bisa dirakit (production) dari item-item di dalamnya
```

### 4.4 Multi Unit Rules

```
Multi Unit = Satu produk bisa dibeli/dijual dalam satuan berbeda.

Contoh: Beras 5kg
  Satuan Dasar: kg
  Satuan Lain: sak (25kg), karung (50kg)

  Konversi:
    1 sak = 25 kg
    1 karung = 50 kg

Aturan Multi Unit:
  1. Satuan dasar adalah satuan stok
  2. Semua transaksi dikonversi ke satuan dasar untuk stok
  3. Harga per satuan: harga_dasar × faktor_konversi atau harga khusus

  Contoh:
    Harga per kg = Rp 12.000
    1 sak = 25 kg → harga sak = 25 × 12.000 = Rp 300.000
    atau harga sak khusus = Rp 290.000
```

### 4.5 Serial Number Rules

```
Serial Number = Setiap unit produk memiliki identitas unik.

  Contoh: Elektronik, HP, Laptop

  Aturan:
    1. Setiap unit produk mendapat satu SN unik
    2. SN dicatat saat pembelian (penerimaan barang)
    3. SN dicatat saat penjualan (untuk garansi)
    4. SN bisa dilacak: siapa beli, kapan, dari supplier mana
    5. SN yang sudah terjual tidak bisa dijual lagi
```

---

## 5. Recipe Rules (BOM)

### 5.1 Struktur Recipe

```
┌─────────────────────────────────────────────────────────────────┐
│                          RECIPE                                  │
│  Header:                                                        │
│    - id (UUID)                                                   │
│    - productId → items.id (RECIPE_PRODUCT)                      │
│    - name                                                        │
│    - yield (jumlah output per produksi, default 1)              │
│    - yieldUnitId → units.id                                     │
│    - instructions (optional)                                    │
│                                                                  │
│  Detail:                                                         │
│    - id (UUID)                                                   │
│    - recipeId → recipes.id                                      │
│    - itemId → items.id (bahan baku)                             │
│    - quantity (jumlah yang diperlukan per yield)                │
│    - unitId → units.id (satuan penggunaan)                      │
│    - wastePercent (default 0)                                   │
│    - isOptional (default false)                                 │
│    - alternativeItemId → items.id (optional)                    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Recipe Rules

| # | Aturan |
|---|--------|
| 1 | Satu RECIPE_PRODUCT hanya memiliki satu recipe aktif |
| 2 | Bahan baku bisa RAW_MATERIAL atau FINISHED_PRODUCT |
| 3 | Yield minimal 1 |
| 4 | Minimal satu detail per recipe |
| 5 | Kombinasi recipeId + itemId unique (tidak boleh duplikat bahan) |
| 6 | Waste percent >= 0. 0 berarti tidak ada waste |
| 7 | Jika stok bahan tidak cukup → proses ditolak (kecuali allowNegativeStock) |

### 5.3 Recipe Consumption

```
Saat RECIPE_PRODUCT dijual:

  1. Load recipe
  2. Untuk setiap detail:
       neededQty = saleQty × detail.quantity × (1 + wastePercent / 100)
       Cek: stockBalance >= neededQty?
         Jika ya → siapkan movement RECIPE_CONSUMPTION (-neededQty)
         Jika tidak → error "Stok [bahan] tidak cukup"
  3. Batch insert semua movement
  4. RECIPE_PRODUCT itu sendiri → tidak ada movement stok
```

### 5.4 Contoh Recipe

**Es Teh Manis (1 gelas)**

| Bahan | Qty | Satuan | Waste% | Harga/unit | Subtotal |
|-------|-----|--------|--------|------------|----------|
| Teh Celup | 1 | pcs | 0 | 500 | 500 |
| Gula Pasir | 0.025 | kg | 2 | 12.000 | 300 |
| Air Mineral | 0.2 | liter | 5 | 1.500 | 300 |
| Es Batu | 0.1 | kg | 10 | 500 | 50 |
| Cup + Tutup | 1 | pcs | 1 | 300 | 300 |
| **Total Bahan** | | | | | **1.450** |
| **Harga Jual** | | | | | **5.000** |
| **Margin** | | | | | **71%** |

**Ayam Geprek (1 porsi)**

| Bahan | Qty | Satuan | Waste% | Subtotal |
|-------|-----|--------|--------|----------|
| Daging Ayam | 0.2 | kg | 5 | 4.000 |
| Tepung Bumbu | 0.05 | kg | 3 | 500 |
| Minyak Goreng | 0.1 | liter | 15 | 1.500 |
| Sambal Bawang | 0.02 | kg | 2 | 300 |
| Nasi Putih | 0.3 | kg | 0 | 3.000 |
| Box + Plastik | 1 | pcs | 0 | 500 |
| **Total Bahan** | | | | **9.800** |
| **Harga Jual** | | | | **18.000** |
| **Margin** | | | | **46%** |

### 5.5 Optional & Alternative Ingredient

```
Optional Ingredient:
  - Bahan yang BISA ditambahkan tapi TIDAK WAJIB
  - Contoh: Es Teh ditambah "Es Batu Ekstra" (opsional, +Rp 500)
  - Saat transaksi, user bisa pilih tambah atau tidak
  - Movement hanya dibuat jika bahan opsional dipilih

Alternative Ingredient:
  - Bahan pengganti jika bahan utama tidak tersedia
  - Contoh: Gula Pasir → Gula Batu (1:1)
  - Sistem otomatis cek stok bahan alternatif jika bahan utama habis
  - Movement menggunakan bahan yang tersedia
  - Harga bisa berbeda (diperhitungkan di HPP)
```

### 5.6 Waste & Shrinkage

```
Waste = Bahan yang terbuang saat produksi.

  Contoh: Minyak goreng untuk menggoreng ayam.
          Dari 1 liter minyak, 15% terserap makanan, sisanya bisa dipakai ulang.
          
  wastePercent = 15
  neededQty = recipe_qty × (1 + waste/100)

  Perhitungan HPP dengan waste:
    HPP = SUM(detail.quantity × (1 + detail.wastePercent/100) × item.buyPrice)

Shrinkage = Bahan yang berkurang karena proses alami.

  Contoh: Daging yang kehilangan air setelah dimasak.
  Berbeda dengan waste — shrinkage adalah penyusutan berat, bukan terbuang.
```

### 5.7 Auto vs Manual Deduction

```
Auto Deduction (default untuk food & beverage):
  - Saat RECIPE_PRODUCT dijual, sistem OTOMATIS membuat movement
  - Tidak perlu input manual
  - Cocok untuk: Cafe, Restoran, Bakery

Manual Deduction (untuk produksi terjadwal):
  - Production Order dibuat terpisah dari penjualan
  - Bahan dikeluarkan berdasarkan production order
  - Cocok untuk: Bakery (produksi massal roti), Pabrik
  - Movement dibuat saat produksi, bukan saat penjualan
```

---

## 6. Purchase Rules

### 6.1 Status Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  DRAFT   │────►│ APPROVED │────►│ RECEIVED│────►│COMPLETED │
│          │     │          │     │          │     │          │
│ - Baru   │     │ - Siap   │     │ - Barang │     │ - Selesai│
│ - Bisa   │     │   dikirim│     │   sampai │     │ - Tidak  │
│   edit   │     │ - PO ke  │     │ - Stok + │     │   bisa   │
│          │     │   supplier│    │ - Sebagian│    │   diubah │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └──────────┘
     │                │                │
     ▼                ▼                ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│CANCELLED │     │CANCELLED │     │ RETURN   │
│          │     │          │     │          │
│ - Hapus  │     │ - Hapus  │     │ - Sebagian│
│   lunak  │     │   lunak  │     │   atau    │
│          │     │          │     │   semua   │
└──────────┘     └──────────┘     └──────────┘
```

### 6.2 Purchase Rules Detail

| # | Aturan |
|---|--------|
| 1 | PO Number auto-generated (`PO-YYYYMMDD-XXXX`). Unique |
| 2 | Status hanya maju: DRAFT → APPROVED → RECEIVED → COMPLETED. Tidak bisa mundur |
| 3 | **DRAFT** — semua field bisa diedit. Bisa dihapus |
| 4 | **APPROVED** — tidak bisa diedit. Hanya bisa cancel atau receive |
| 5 | **RECEIVED** — barang datang. Stok bertambah. Movement PURCHASE dibuat |
| 6 | **COMPLETED** — transaksi selesai. Tidak bisa diubah |
| 7 | **CANCELLED** — dari DRAFT atau APPROVED. Soft delete |
| 8 | **Partial Receive** — sebagian item diterima, sebagian belum. Status tetap RECEIVED |
| 9 | **Return** — dari RECEIVED. Membuat movement PURCHASE_RETURN (-qty) |
| 10 | **Harga Beli** — mempengaruhi average cost |
| 11 | **Diskon** — per item atau per transaksi |
| 12 | **PPN** — tax inclusive atau exclusive |
| 13 | **Biaya Tambahan** — ongkos kirim, biaya bongkar, asuransi |

### 6.3 Harga Beli & Average Cost

```
Saat PURCHASE diterima:

Average Cost Baru = (TotalNilaiStok_Lama + TotalNilaiPembelian_Baru)
                    ─────────────────────────────────────────────
                    (TotalStok_Lama + JumlahPembelian_Baru)

Contoh:
  Stok awal: 10 unit @ Rp 5.000 = Rp 50.000
  Purchase:   5 unit @ Rp 6.000 = Rp 30.000
  
  Avg Cost Baru = (50.000 + 30.000) / (10 + 5) = 80.000 / 15 = Rp 5.333
  
  COGS untuk penjualan berikutnya = qty × Rp 5.333
```

### 6.4 Purchase Return

```
Retur Pembelian = Mengembalikan barang ke supplier.

  Aturan:
    1. Hanya bisa retur dari PO yang sudah RECEIVED
    2. Quantity retur <= quantity_received - quantity_sebelumnya_diretur
    3. Membuat movement PURCHASE_RETURN (-qty)
    4. Average Cost TIDAK berubah saat retur
    5. Nilai retur = qty × harga_beli_saat_purchase

  Flow:
    PO #001 → Receive 10 pcs @ Rp 5.000
    → Stok +10, AvgCost = 5.000
    
    Retur 2 pcs (rusak)
    → Movement PURCHASE_RETURN (-2)
    → Stok -2, AvgCost tetap 5.000
    
    Hasil: Stok = 8, AvgCost = 5.000
```

### 6.5 Partial Receive

```
Partial Receive = Menerima barang tidak sekaligus.

  Contoh:
    PO #002: 10 item @ Rp 5.000
    
    Receive #1: 4 item → Stok +4, AvgCost update
    Receive #2: 3 item → Stok +3, AvgCost update
    Receive #3: 3 item → Stok +3, AvgCost update
    
    Total received: 10 → Status COMPLETED

  Aturan:
    - quantity_received <= quantity
    - Jika quantity_received == quantity → item completed
    - Jika semua item completed → PO completed
    - Movement PURCHASE dibuat per receive
```

---

## 7. Sales Rules

### 7.1 Status Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  DRAFT   │────►│ COMPLETED│────►│   PAID   │────►│  DONE    │
│          │     │          │     │          │     │          │
│ - Belum  │     │ - Selesai│     │ - Lunas  │     │ - Selesai│
│   bayar  │     │   input  │     │ - Stok - │     │ - Cetak  │
│ - Bisa   │     │ - Proses │     │ - Receipt│     │   struk  │
│   edit   │     │   stok   │     │          │     │          │
└────┬─────┘     └────┬─────┘     └──────────┘     └──────────┘
     │                │
     ▼                ▼
┌──────────┐     ┌──────────┐
│ VOID     │     │ RETURN   │
│          │     │          │
│ - Batal  │     │ - Sebagian│
│ - Stok + │     │   atau   │
│ (reverse)│     │   semua  │
└──────────┘     └──────────┘
```

### 7.2 Sales Rules Detail

| # | Aturan |
|---|--------|
| 1 | Invoice Number auto-generated (`INV-YYYYMMDD-XXXX`). Unique |
| 2 | Minimal satu sale detail per transaksi |
| 3 | Sale tidak bisa dihapus — hanya di-void |
| 4 | **Void** — membatalkan transaksi yang sudah selesai. Stok dikembalikan (movement SALE dengan reverse) |
| 5 | **Return** — sebagian barang dikembalikan. Hanya untuk item yang sudah dibayar |
| 6 | **Split Bill** — Satu meja dibagi beberapa bill. Digunakan di restoran |
| 7 | **Merge Bill** — Beberapa bill digabung jadi satu |
| 8 | **Hold Bill** — Transaksi ditahan sementara. Item tetap di keranjang |
| 9 | **Resume Bill** — Melanjutkan bill yang di-hold |

### 7.3 Payment Methods

| Method | Kode | Keterangan |
|--------|------|------------|
| Tunai | `CASH` | Pembayaran tunai. Hitung kembalian |
| QRIS | `QRIS` | Scan QR. Tidak ada kembalian |
| Transfer | `TRANSFER` | Transfer bank. Verifikasi manual |
| Debit | `DEBIT` | Kartu debit. Online/offline tergantung EDC |
| Credit | `CREDIT` | Kartu kredit. Biaya merchant |
| Voucher | `VOUCHER` | Voucher diskon/bayar |
| Store Credit | `STORE_CREDIT` | Deposit pelanggan |

### 7.4 Split Bill Rules

```
Split Bill = Membagi satu transaksi menjadi beberapa bill.

  Contoh:
    Meja 3 pesan:
      - Nasi Goreng Rp 18.000
      - Es Teh Rp 5.000
      - Ayam Geprek Rp 18.000
      Total: Rp 41.000
    
    Split 3 orang:
      Bill A: Nasi Goreng (Rp 18.000)
      Bill B: Es Teh (Rp 5.000)
      Bill C: Ayam Geprek (Rp 18.000)

  Aturan:
    - Setiap bill adalah sale terpisah dengan invoice number masing-masing
    - Item bisa dibagi rata atau dipilih per orang
    - Masing-masing bill bisa bayar dengan metode berbeda
    - Stock movement dibuat per bill (total tetap sama)
```

### 7.5 Hold Bill Rules

```
Hold Bill = Transaksi ditahan.

  Contoh:
    Customer pesan, makanan belum siap, customer ingin bayar nanti.
    
    Aturan:
    - Item tetap "dipesan" — stok belum berkurang
    - Bill bisa di-resume kapan saja
    - Hold timeout: 30 menit (configurable)
    - Setelah timeout, bill otomatis void
    - Hold bill muncul di dashboard "Pesanan Ditahan"
```

### 7.6 Void Rules

```
Void = Membatalkan transaksi yang sudah selesai.

  Aturan:
    1. Void hanya bisa dilakukan oleh user dengan permission `sales.delete`
    2. Void wajib mencantumkan alasan
    3. Void membuat reversal stock movement:
         Sale original: SALE (-qty)
         Void:          SALE (+qty) atau movement terpisah dengan tipe ADJUSTMENT
    4. Void dicatat di audit log
    5. Void tidak bisa di-void (tidak bisa undo)

  Edge Case:
    Transaksi sudah 1 minggu lalu, stok sudah berubah 100 kali.
    Void akan mengembalikan stok ke kondisi saat itu + reversal.
    Average cost TIDAK di-recalculate — menggunakan harga saat void.
```

### 7.7 Refund Rules

```
Refund = Pengembalian uang ke customer.

  Aturan:
    1. Refund hanya bisa untuk transaksi yang sudah PAID
    2. Refund bisa sebagian (sebagian item) atau seluruhnya
    3. Refund dicatat sebagai sale terpisah dengan nilai negatif
    4. Payment refund dicatat: "REFUND ke customer"
    5. Stok dikembalikan (SALE_RETURN movement)
    6. Refund wajib ada approval (untuk jumlah > threshold)
```

---

## 8. Discount Rules

### 8.1 Jenis Diskon

| Tipe | Level | Contoh |
|------|-------|--------|
| **Diskon Nominal** | Item atau Transaksi | Potongan Rp 5.000 |
| **Diskon Persen** | Item atau Transaksi | Potongan 10% |
| **Happy Hour** | Waktu | 15.00-17.00 diskon 20% |
| **Promo Paket** | Kombinasi Item | Beli A + B = diskon 15% |
| **Buy X Get Y** | Item | Beli 2 gratis 1 |
| **Member Discount** | Customer | Member diskon 5% |
| **Manual Discount** | Transaksi | Diskon by request, perlu approval |
| **Diskon Qty** | Item | Beli >= 10, diskon 10% |

### 8.2 Aturan Diskon

| # | Aturan |
|---|--------|
| 1 | Diskon nominal tidak boleh melebihi harga/item |
| 2 | Diskon persen maksimal 100% |
| 3 | Diskon item dihitung sebelum diskon transaksi |
| 4 | Multiple diskon: diskon item dulu, baru diskon transaksi |
| 5 | Diskon tidak berlaku untuk SERVICE dan NON_STOCK (kecuali diizinkan) |
| 6 | Happy Hour hanya berlaku di jam yang ditentukan |
| 7 | Member Discount hanya untuk customer yang terdaftar sebagai member |
| 8 | Manual Discount > threshold (configurable) perlu approval |

### 8.3 Perhitungan Diskon

```
Contoh: Transaksi Rp 100.000

  Skenario 1: Diskon item 10% + Diskon transaksi Rp 5.000
    Subtotal: Rp 100.000
    Diskon item (10%): Rp 10.000
    Subtotal setelah item: Rp 90.000
    Diskon transaksi: Rp 5.000
    Grand Total: Rp 85.000

  Skenario 2: Buy 2 Get 1 (harga Rp 10.000)
    Beli 3 item
    Bayar 2 item = Rp 20.000
    1 item gratis = Rp 0
    Grand Total: Rp 20.000

  Skenario 3: Happy Hour 20% (15.00-17.00)
    Jam 16.00 → diskon 20% otomatis
    Jam 17.01 → diskon tidak berlaku
```

---

## 9. Tax Rules

### 9.1 Jenis Pajak

| Tipe | Default | Deskripsi |
|------|---------|-----------|
| **PPN** | 11% | Pajak Pertambahan Nilai |
| **Non PPN** | 0% | Tidak kena pajak |
| **PPN Inclusive** | Ya | Harga sudah termasuk PPN |
| **PPN Exclusive** | Tidak | PPN ditambahkan di akhir |
| **Service Charge** | 0-10% | Biaya layanan (restoran) |

### 9.2 Perhitungan Pajak

```
PPN Inclusive (harga sudah termasuk PPN):
  Harga tertera: Rp 100.000
  PPN 11%: Rp 9.909 (100.000 × 11/111)
  DPP: Rp 90.091 (100.000 - 9.909)

PPN Exclusive (PPN ditambahkan):
  Harga tertera: Rp 100.000
  PPN 11%: Rp 11.000 (100.000 × 11%)
  Total: Rp 111.000

Service Charge (restoran):
  Subtotal: Rp 100.000
  Service Charge 5%: Rp 5.000
  Subtotal + SC: Rp 105.000
  PPN 11% dari (Subtotal + SC): Rp 11.550
  Grand Total: Rp 116.550
```

### 9.3 Aturan Pajak

| # | Aturan |
|---|--------|
| 1 | Tarif PPN default dari settings (`tax-default-rate`) |
| 2 | PPN bisa dioverride per transaksi |
| 3 | PPN Inclusive = harga sudah termasuk pajak, tidak perlu ditambah |
| 4 | PPN Exclusive = pajak ditambahkan di hitung akhir |
| 5 | Service Charge hanya untuk restoran/cafe mode |
| 6 | Pembulatan: ke bawah (floor) untuk PPN |

---

## 10. Pricing Rules

### 10.1 Jenis Harga

| Harga | Definisi | Sumber |
|-------|----------|--------|
| **Harga Beli** | Harga dari supplier | Purchase transaction |
| **Average Cost** | Rata-rata tertimbang dari semua pembelian | Calculated from stock movements |
| **HPP** | Harga Pokok Penjualan | Average Cost untuk FINISHED_PRODUCT. Sum of materials untuk RECIPE_PRODUCT |
| **Harga Jual** | Harga ke customer | Manual input |
| **Margin** | (Harga Jual - HPP) / Harga Jual × 100% | Calculated |
| **Markup** | (Harga Jual - HPP) / HPP × 100% | Calculated |

### 10.2 Multi Price Tier

| Tier | Syarat | Contoh |
|------|--------|--------|
| `REGULAR` | Tidak ada | Rp 10.000 |
| `MEMBER` | Customer punya kartu member | Rp 8.500 |
| `WHOLESALE` | Quantity >= minQty | Rp 7.500 (min 10) |
| `PROMO` | Dalam periode promo | Rp 6.999 (hingga 15 Agustus) |

**Aturan:**
- Jika customer member → pakai MEMBER price
- Jika quantity >= minQty WHOLESALE → pakai WHOLESALE price (jika lebih murah)
- Jika PROMO aktif → pakai PROMO price (jika lebih murah)
- Priority: PROMO > WHOLESALE > MEMBER > REGULAR

### 10.3 HPP untuk Recipe Product

```
HPP RECIPE_PRODUCT = SUM(
    detail.quantity × item.buyPrice × (1 + detail.wastePercent / 100)
)

Update HPP:
  - Setiap kali ada purchase yang mengubah average cost bahan baku
  - HPP otomatis recalculate
  - Trigger: saat purchase.received atau item.buyPrice berubah
```

---

## 11. Customer Rules

### 11.1 Member Rules

| # | Aturan |
|---|--------|
| 1 | Member number unique. Auto-generated (`MBR-XXXXX`) |
| 2 | Member mendapatkan harga khusus (member price) |
| 3 | Member bisa mengumpulkan poin |
| 4 | Poin: 1 poin per Rp 10.000 belanja (configurable) |
| 5 | Poin bisa ditukar: 100 poin = Rp 1.000 (configurable) |
| 6 | Member level: Regular, Silver, Gold, Platinum (berdasarkan total belanja) |
| 7 | Level naik otomatis saat mencapai threshold |

### 11.2 Piutang Rules

```
Piutang = Customer berhutang.

  Aturan:
    1. Hanya customer tertentu yang boleh memiliki piutang
    2. Limit piutang ditentukan per customer
    3. Transaksi piutang: paymentStatus = "pending"
    4. Pelunasan: payment baru dengan tipe "DEBT_PAYMENT"
    5. Customer dengan piutang > limit tidak bisa transaksi lagi
    6. Piutang otomatis jatuh tempo (configurable, default 30 hari)
```

### 11.3 Blacklist Rules

```
Blacklist = Customer dilarang bertransaksi.

  Aturan:
    1. Blacklist bisa sementara atau permanen
    2. Alasan blacklist dicatat
    3. Customer blacklist tidak bisa:
       - Membuat transaksi baru
       - Mendapatkan diskon member
    4. Customer blacklist tetap bisa melunasi piutang
```

---

## 12. Supplier Rules

### 12.1 Status

| Status | Keterangan |
|--------|------------|
| **Aktif** | Bisa membuat PO |
| **Nonaktif** | Tidak bisa membuat PO baru. PO lama tetap berlaku |

### 12.2 Aturan Supplier

| # | Aturan |
|---|--------|
| 1 | Kode supplier unique |
| 2 | Lead Time: estimasi hari pengiriman. Digunakan untuk rekomendasi PO |
| 3 | Minimum Order: jumlah minimal pemesanan |
| 4 | Termin: jatuh tempo pembayaran (14, 30, 45, 60 hari) |
| 5 | Supplier default bisa di-set per item |
| 6 | History pembelian bisa dilihat per supplier |
| 7 | Supplier nonaktif tidak bisa dipilih untuk PO baru |

---

## 13. Cashier Rules

### 13.1 Shift Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHIFT FLOW                               │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │ LOGIN    │───►│ OPEN     │───►│ CLOSE    │                   │
│  │          │    │ CASH     │    │ CASH     │                   │
│  │ - User   │    │          │    │          │                   │
│  │   login  │    │ - Saldo  │    │ - Hitung │                   │
│  │          │    │   awal   │    │   kas    │                   │
│  └──────────┘    └──────────┘    │ - Input  │                   │
│                                  │   fisik   │                   │
│                                  │ - Hitung  │                   │
│                                  │   selisih │                   │
│                                  └──────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Cashier Rules Detail

| # | Aturan |
|---|--------|
| 1 | Satu user hanya punya satu sesi aktif dalam satu waktu |
| 2 | Shift harus dibuka sebelum bisa bertransaksi |
| 3 | Opening balance = jumlah uang di laci kas saat shift dimulai |
| 4 | Semua transaksi tercatat di shift yang sedang aktif |
| 5 | **Cash In** — uang masuk ke kas (bukan dari penjualan). Contoh: setoran modal |
| 6 | **Cash Out** — uang keluar dari kas (bukan untuk pembelian). Contoh: bayar listrik |
| 7 | **Closing balance** = opening + total_sales - total_payout + cash_in - cash_out |
| 8 | **Expected balance** = saldo yang seharusnya ada berdasarkan system |
| 9 | **Actual balance** = saldo fisik yang dihitung manual |
| 10 | **Selisih** = expected - actual. Jika > threshold → perlu approval |

### 13.3 Shift Reconciliation

```
Saat CLOSE SHIFT:

  1. System calculate:
     expectedBalance = openingBalance 
                       + SUM(sale.grandTotal WHERE paymentMethod = 'CASH')
                       + SUM(cashIn.amount)
                       - SUM(cashOut.amount)

  2. User input actualBalance (hasil hitung manual)

  3. System calculate:
     difference = expectedBalance - actualBalance

  4. Jika difference != 0:
     - difference < threshold → warning, bisa lanjut
     - difference > threshold → perlu approval manager

  5. Simpan cash_session dengan status = "closed"
  6. Generate laporan shift
```

---

## 14. Reporting Rules

### 14.1 Jenis Report

| Report | Sumber Data | Filter |
|--------|-------------|--------|
| **Penjualan Harian** | sales, sale_details | Tanggal, user, metode bayar |
| **Penjualan Per Item** | sale_details, items | Tanggal, kategori, item |
| **Pembelian** | purchases, purchase_details | Tanggal, supplier |
| **Laba Rugi** | sales, purchases | Periode bulan |
| **Pergerakan Stok** | stock_movements, items | Tanggal, item, gudang |
| **Top Produk** | sale_details, items | Periode, limit |
| **Top Customer** | sales, customers | Periode, limit |
| **Top Supplier** | purchases, suppliers | Periode, limit |
| **Kas Harian** | cash_sessions, sales | Tanggal, user |
| **Dashboard** | aggregate semua | Hari ini |

### 14.2 Aturan Report

| # | Aturan |
|---|--------|
| 1 | Semua report read-only — tidak bisa edit data |
| 2 | Data report berasal dari live query ke IndexedDB |
| 3 | Filter tanggal wajib untuk report periodik |
| 4 | Export ke Excel/PDF menggunakan SheetJS/jspDF library |
| 5 | Dashboard auto-refresh setiap 30 detik |
| 6 | Angka ditampilkan dalam format currency (Rp) IDR |
| 7 | Report stok menampilkan: nama, stok saat ini, stok minimum, status |

---

## 15. Audit Rules

### 15.1 Aturan Audit

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT RULES                                  │
│                                                                  │
│  Semua perubahan data harus tercatat:                            │
│                                                                  │
│  CREATE: Catat user, timestamp, data baru                       │
│  UPDATE: Catat user, timestamp, nilai lama, nilai baru          │
│  DELETE: Catat user, timestamp, data yang dihapus               │
│  LOGIN:  Catat user, timestamp, device                          │
│  LOGOUT: Catat user, timestamp                                  │
│                                                                  │
│  Minimal data yang dicatat:                                      │
│  - User ID                                                       │
│  - Timestamp (ISO 8601)                                          │
│  - Action (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)               │
│  - Entity Type (product, sale, purchase, user)                  │
│  - Entity ID                                                     │
│  - Old Value (JSON, untuk UPDATE dan DELETE)                    │
│  - New Value (JSON, untuk CREATE dan UPDATE)                    │
│  - Device Info (user-agent, IP untuk online mode)              │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Entity yang Wajib Audit

| Entity | CREATE | UPDATE | DELETE | Catatan Khusus |
|--------|--------|--------|--------|----------------|
| User | ✅ | ✅ | ✅ | Logout juga dicatat |
| Item | ✅ | ✅ | ✅ | Harga berubah dicatat |
| Purchase | ✅ | ✅ | ✅ | Status change dicatat |
| Sale | ✅ | ❌ | ✅ | Void dicatat sebagai UPDATE |
| Payment | ✅ | ❌ | ❌ | — |
| Stock Movement | ✅ | ❌ | ❌ | Immutable — tidak bisa update/delete |
| Settings | ❌ | ✅ | ❌ | — |

---

## 16. Backup & Restore Rules

### 16.1 Backup

| # | Aturan |
|---|--------|
| 1 | Backup menyimpan seluruh data IndexedDB ke file JSON |
| 2 | Backup mencakup: semua tabel, semua record |
| 3 | Backup bisa dilakukan manual kapan saja |
| 4 | File backup disimpan di lokal (download) |
| 5 | Future: backup otomatis periodik + cloud backup |
| 6 | Setiap backup mencatat: timestamp, schema version, jumlah record per tabel |

### 16.2 Restore

| # | Aturan |
|---|--------|
| 1 | Restore hanya dari file backup yang valid |
| 2 | Restore akan MENIMPA semua data yang ada |
| 3 | Sebelum restore, sistem akan backup otomatis data saat ini |
| 4 | Restore membutuhkan konfirmasi ganda (double confirm) |
| 5 | Restore hanya bisa dilakukan saat tidak ada transaksi aktif |
| 6 | Schema version harus cocok. Jika beda → migrasi |

### 16.3 Export / Import

```
Export (ke file):
  - Excel (.xlsx) — untuk produk, pelanggan, supplier
  - JSON — untuk backup full database
  - PDF — untuk report

Import (dari file):
  - Excel (.xlsx) — untuk produk, pelanggan, supplier
  - JSON — untuk restore

Aturan Import:
  - Validasi setiap baris sebelum import
  - Jika ada baris gagal → dicatat, baris lain tetap diproses
  - Duplicate SKU → dilewati (dicatat sebagai error)
  - Hasil import: X sukses, Y gagal
```

---

## 17. Synchronization Rules

### 17.1 Mode Operasi

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC OPERATION                               │
│                                                                  │
│  OFFLINE (default):                                             │
│    - Semua operasi lokal ke IndexedDB                           │
│    - Tidak perlu koneksi internet                               │
│    - Data tetap ada setelah reload                              │
│                                                                  │
│  ONLINE (future):                                               │
│    - Sinkronisasi data ke cloud server                         │
│    - Pull data dari cloud ke lokal                             │
│    - Conflict resolution                                       │
│                                                                  │
│  HYBRID (future):                                               │
│    - Offline untuk transaksi harian                            │
│    - Online untuk backup dan report lintas toko                │
└─────────────────────────────────────────────────────────────────┘
```

### 17.2 Conflict Resolution

```
Conflict terjadi ketika data yang sama diubah di dua device berbeda
saat offline.

Strategy: Last Write Wins (LWW)
  - Setiap record punya `updatedAt` timestamp
  - Data dengan timestamp terbaru menang
  - Data yang kalah disimpan sebagai conflict log
  - Conflict log bisa direview oleh admin

Edge Cases:
  - Device A: update harga jual → Rp 12.000 (10:00)
  - Device B: update harga jual → Rp 15.000 (10:05)
  - Sync: device B menang (10:05 > 10:00)
  - Harga jual = Rp 15.000
  - Device A mendapat notifikasi: "Harga jual item X diubah dari Rp 12.000 ke Rp 15.000"
```

### 17.3 Multi Device Rules

| # | Aturan |
|---|--------|
| 1 | Setiap device punya Device ID unik |
| 2 | Device ID dicatat di setiap transaksi |
| 3 | Satu user bisa login di beberapa device |
| 4 | Data antar device disinkronkan melalui cloud |
| 5 | Session di satu device tidak mempengaruhi device lain |
| 6 | Future: real-time sync via WebSocket |

---

## 18. Security Rules

### 18.1 Authentication

| # | Aturan |
|---|--------|
| 1 | Setiap user wajib login dengan username + password |
| 2 | Password di-hash dengan SHA-256 sebelum disimpan |
| 3 | Tidak ada plain text password di database |
| 4 | Session disimpan di localStorage (JSON) |
| 5 | Session expired setelah idle timeout |
| 6 | Default user: owner/owner123, admin/admin123, kasir/kasir123 |

### 18.2 Authorization

| # | Aturan |
|---|--------|
| 1 | Setiap halaman/route memiliki permission check |
| 2 | User hanya bisa melihat menu yang diizinkan role-nya |
| 3 | API call (dynamic import) juga dicek permission-nya |
| 4 | Owner memiliki akses penuh ke semua fitur |
| 5 | Admin memiliki akses ke semua fitur kecuali pengaturan role |

### 18.3 Session & Idle Timeout

```
Session:
  - Disimpan di localStorage key: 'pos_offline_session'
  - Berisi: user.id, user.roleName, loginTime
  - Tidak ada expiry (offline, tidak ada server)
  - Logout → hapus session

Idle Timeout:
  - Default: 15 menit (configurable di settings)
  - Setelah idle → screen lock
  - Screen lock: minta password untuk unlock
  - Jika 5 kali salah password → logout paksa
  - Events: mousemove, mousedown, keydown, touchstart, scroll
```

### 18.4 Permission Matrix

| Module | Owner | Admin | Kasir | Staff |
|--------|-------|-------|-------|-------|
| Dashboard | CRUD | R | R | R |
| POS | CRUD | CRUD | CRUD | R |
| Products | CRUD | CRUD | R | CRUD |
| Categories | CRUD | CRUD | - | CRUD |
| Suppliers | CRUD | CRUD | - | CRUD |
| Customers | CRUD | CRUD | CRUD | CRUD |
| Sales | CRUD | CRUD | CRUD | CRUD |
| Purchases | CRUD | CRUD | - | CRUD |
| Reports | CRUD | CRUD | R | R |
| Settings | CRUD | CRUD | - | - |
| Users | CRUD | R | - | - |
| Roles | CRUD | - | - | - |
| Permissions | CRUD | - | - | - |

---

## 19. Validation Rules

### 19.1 Field Validation

| Field Type | Aturan |
|------------|--------|
| **String (wajib)** | Tidak boleh empty, trim whitespace |
| **String (opsional)** | Boleh empty. Jika diisi, trim whitespace |
| **Number (wajib)** | Harus angka valid. Default 0 |
| **Number (opsional)** | Boleh null. Jika diisi, harus angka |
| **UUID** | Format UUID v4 |
| **Email** | Format email valid (jika field email) |
| **Phone** | Format nomor telepon (boleh +62 atau 08) |
| **Date** | Format ISO 8601 |
| **Boolean** | true/false. Default tergantung field |

### 19.2 Business Validation

| Validasi | Aturan | Error Message |
|----------|--------|---------------|
| **Nama unik** | Nama item/category/unit tidak boleh duplikat | "Nama [entity] sudah digunakan" |
| **SKU unik** | SKU item tidak boleh duplikat | "Kode produk sudah digunakan" |
| **Barcode unik** | Barcode tidak boleh duplikat (jika diisi) | "Barcode sudah digunakan" |
| **Harga jual >= harga beli** | Validasi saat simpan (warning, bukan blocking) | "Harga jual lebih rendah dari harga beli" |
| **Stok cukup** | Saat sale, stok harus cukup (kecuali allowNegativeStock) | "Stok [item] tidak cukup" |
| **Angka >= 0** | Harga, quantity, stok minimal | "Nilai tidak boleh negatif" |
| **Referential integrity** | FK harus valid | "[Entity] tidak ditemukan" |
| **Circular reference (kategori)** | parentId != id | "Kategori tidak bisa merujuk ke diri sendiri" |
| **Status flow** | Transisi status valid | "Tidak bisa mengubah status dari [X] ke [Y]" |
| **Date range** | End date >= start date | "Tanggal akhir harus setelah tanggal mulai" |

### 19.3 Edge Case Validation

```
1. Decimal quantity:
   "Beli 0.5 kg gula" → valid. Sistem harus handle decimal.

2. Quantity sangat besar:
   "Beli 999999 item" → valid secara teknis, tapi tampilkan peringatan.

3. Harga nol:
   "Harga jual Rp 0" → valid (item gratis). Tampilkan konfirmasi.

4. Stok negatif:
   Jika allowNegativeStock = false dan stok < qty → tolak.
   Jika allowNegativeStock = true → proses, stok jadi negatif.

5. Delete referenced data:
   Kategori yang memiliki item aktif → tidak bisa soft delete.
   Tampilkan: "Kategori masih digunakan oleh X item."

6. Empty search:
   Search dengan string kosong → tampilkan semua data.

7. Rapid click:
   Double click submit → button disabled selama proses.
```

---

## 20. Error Handling Rules

### 20.1 Jenis Error

| Jenis | Contoh | Handling |
|-------|--------|----------|
| **Validation Error** | Nama kosong, harga negatif | Return error ke user. Jangan throw |
| **Business Error** | Stok tidak cukup, duplikat SKU | Return error ke user dengan pesan jelas |
| **Database Error** | IndexedDB full, corrupt data | Catch + log. Tampilkan error generik ke user |
| **Sync Error** | Gagal sync, conflict | Log + retry. User bisa sync manual |
| **Import Error** | Format Excel salah, data invalid | Catat per baris. Tampilkan summary |
| **Export Error** | Library gagal load, data kosong | Warning. Export data kosong tetap dibuat |

### 20.2 Error Response Format

```
Semua service mengembalikan response dalam format standar:

  Success:
    { success: true, data: { ... } }

  Error:
    { success: false, errors: ['Pesan error 1', 'Pesan error 2'] }

  Partial (import):
    { success: true, data: { imported: 18, failed: 2, errors: [
        'Baris 5: Nama produk wajib diisi',
        'Baris 12: SKU sudah digunakan'
    ]}}
```

### 20.3 UI Error Display

```
Validation Error:
  - Tampilkan merah di form (inline)
  - Field yang error diberi border merah
  - Scroll ke field pertama yang error

Business Error:
  - Tampilkan alert/dialog
  - Pesan jelas: "Stok Beras Premium tidak cukup. Stok: 2, diminta: 5"

Database Error:
  - Tampilkan toast: "Terjadi kesalahan database. Silakan coba lagi."
  - Log detail di console

Import Error:
  - Tampilkan summary: "18 berhasil, 2 gagal"
  - List baris yang gagal + alasan

Network/Offline:
  - Tidak ada error khusus — aplikasi memang offline
  - Tampilkan badge "Offline Mode" di UI
```

---

## 21. Future Features

### 21.1 Multi Gudang

| Fitur | Deskripsi |
|-------|-----------|
| Multiple warehouse | Setiap toko bisa punya > 1 gudang |
| Transfer stok | Pindah stok antar gudang |
| Gudang default | Satu gudang utama |
| Report per gudang | Stok dan nilai per lokasi |

### 21.2 Kitchen Display System (KDS)

| Fitur | Deskripsi |
|-------|-----------|
| Pesan masuk dapur | Order dari POS muncul di layar dapur |
| Status masak | Diterima → Dimasak → Selesai |
| Notifikasi | Suara saat order baru masuk |
| Prioritasi | Urutan berdasarkan waktu order |

### 21.3 Hardware Integration

| Device | Kegunaan |
|--------|----------|
| Bluetooth Printer | Cetak struk thermal |
| Barcode Scanner | Input produk via scan barcode |
| Customer Display | Tampilkan total ke customer |
| Cash Drawer | Buka laci kas otomatis |

### 21.4 Marketplace & Cloud

| Fitur | Deskripsi |
|-------|-----------|
| Cloud Sync | Sinkronisasi data antar device |
| Marketplace | GoFood, GrabFood, ShopeeFood integration |
| Multi Store | Data terpusat untuk jaringan toko |
| E-commerce | Integrasi dengan toko online |

### 21.5 Advanced Features

| Fitur | Fase |
|-------|------|
| Akuntansi (chart of account, jurnal) | Future |
| ERP (purchasing, production, sales, finance) | Future |
| CRM (customer relationship management) | Future |
| Loyalty Program (points, rewards, tiers) | Future |
| Production Planning (MRP) | Future |
| Manufacturing (work order, routing) | Future |
| Human Resource (attendance, payroll) | Future |

---

## 22. Business Flow

### 22.1 Flow Diagram — End to End

```
                    END-TO-END BUSINESS FLOW

┌─────────────────────────────────────────────────────────────────────────┐
│                          MASTER DATA SETUP                              │
│                                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ Category │   │  Unit    │   │ Supplier │   │ Customer │            │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘            │
│       │                                                               │
│       ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          ITEM                                    │  │
│  │  (RAW_MATERIAL / FINISHED_PRODUCT / RECIPE_PRODUCT / SERVICE)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      RECIPE (optional)                           │  │
│  │  Jika RECIPE_PRODUCT, buat BOM: bahan + quantity + waste        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PURCHASE FLOW                                   │
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  DRAFT   │───►│ APPROVED│───►│ RECEIVED│───►│COMPLETED │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                                       │                                 │
│                                       ▼                                 │
│                               ┌──────────────┐                         │
│                               │    STOCK     │                         │
│                               │   MOVEMENT   │                         │
│                               │  PURCHASE +  │                         │
│                               └──────────────┘                         │
│                                       │                                 │
│                                       ▼                                 │
│                               ┌──────────────┐                         │
│                               │  INVENTORY   │                         │
│                               │  (AVG COST)  │                         │
│                               └──────────────┘                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SALES FLOW                                     │
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  DRAFT   │───►│COMPLETED│───►│   PAID   │───►│   DONE   │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                       │                                                │
│                       ▼                                                │
│              ┌──────────────────┐                                      │
│              │  CEK ITEM TYPE  │                                      │
│              └────────┬─────────┘                                      │
│                       │                                                │
│          ┌────────────┼────────────┐                                   │
│          ▼            ▼            ▼                                   │
│  ┌────────────┐ ┌────────────┐ ┌────────┐                              │
│  │ FINISHED   │ │  RECIPE    │ │SERVICE │                              │
│  │ PRODUCT    │ │  PRODUCT   │ │NO STOCK│                              │
│  └──────┬─────┘ └──────┬─────┘ └────────┘                              │
│         │              │                                                │
│         ▼              ▼                                                │
│  ┌────────────┐ ┌────────────┐                                         │
│  │  MOVEMENT  │ │  RECIPE    │                                         │
│  │  SALE -    │ │  ENGINE    │                                         │
│  └────────────┘ │            │                                         │
│                 │  Cek bahan │                                         │
│                 │  Kurangi   │                                         │
│                 │  stok bahan│                                         │
│                 └────────────┘                                         │
│                       │                                                │
│                       ▼                                                │
│              ┌──────────────────┐                                      │
│              │  STOCK MOVEMENT  │                                      │
│              │  (SALE / RECIPE) │                                      │
│              └────────┬─────────┘                                      │
│                       │                                                │
│                       ▼                                                │
│              ┌──────────────────┐                                      │
│              │   INVENTORY      │                                      │
│              └──────────────────┘                                      │
│                       │                                                │
│                       ▼                                                │
│              ┌──────────────────┐                                      │
│              │   PAYMENT        │                                      │
│              │   (CASH/DEBIT/   │                                      │
│              │    QRIS/CREDIT)  │                                      │
│              └──────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REPORT & CLOSING                                │
│                                                                         │
│                        ┌──────────────┐                                 │
│                        │   CLOSE      │                                 │
│                        │   SHIFT      │                                 │
│                        └──────────────┘                                 │
│                              │                                          │
│          ┌───────────────────┼────────────────────┐                     │
│          ▼                   ▼                    ▼                     │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐              │
│  │ SALES REPORT │   │  STOCK       │   │  PROFIT/       │              │
│  │ (Harian)     │   │  REPORT      │   │  LOSS REPORT   │              │
│  └──────────────┘   └──────────────┘   └────────────────┘              │
│          │                   │                    │                     │
│          ▼                   ▼                    ▼                     │
│  ┌──────────────┐   ┌────────────────────┐                             │
│  │   EXPORT     │   │   DASHBOARD        │                             │
│  │ (Excel/PDF)  │   │   (Ringkasan)      │                             │
│  └──────────────┘   └────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 22.2 Flow per Business Type

**Retail / Minimarket / Toko Bangunan**

```
Supplier → Purchase → Receive → Stock (+) → Sale → Stock (-) → Report
                                                                 
Produk: FINISHED_PRODUCT (beli jadi, jual jadi)
Stok:   Normal tracking
Resep:  Tidak ada
```

**Cafe / Warung Makan**

```
Supplier → Purchase (bahan baku) → Stock (+)
  ↓
Recipe → Sale (menu) → Recipe Engine → Stock (- bahan)
  ↓
Report
                                   
Produk: RAW_MATERIAL (bahan) + RECIPE_PRODUCT (menu)
Stok:   Tracking bahan baku saja
Resep:  Setiap menu punya recipe
```

**Restoran**

```
Sama seperti cafe, ditambah:

Table Management → Customer Order → Kitchen Display
  ↓
Split Bill / Merge Bill → Payment
  ↓
Report
                                   
Tambahan: Meja, dapur, split bill
```

**Bakery**

```
Supplier → Purchase (bahan) → Stock (+)
  ↓
Production Order → Recipe Engine → Stock (- bahan) → Stock (+ produk jadi)
  ↓
Sale → Stock (- produk jadi)
  ↓
Report
                                   
Tambahan: Production order harian, multi-level BOM
```

**Laundry**

```
Customer → Drop Off → Timbang (kg) → Proses → Pick Up → Payment
                                   
Produk: SERVICE (Cuci Kering, Setrika per kg)
Stok:   Tidak ada tracking stok
Harga:  Per kg (quantity = berat)
```

**Service (Jasa)**

```
Customer → Order Service → Kerjakan → Selesai → Payment
                                   
Produk: SERVICE (Potong Rambut, Service HP, Cetak)
Stok:   Tidak ada
Harga:  Per jam, per kali, atau per item
```

---

## 23. Best Practices

### 23.1 SOLID

| Prinsip | Penerapan |
|---------|-----------|
| **Single Responsibility** | Satu file = satu tanggung jawab. Service = logic. Repository = data. Page = UI |
| **Open/Closed** | Extend `BaseRepository` untuk query spesifik tanpa modifikasi class induk |
| **Liskov Substitution** | `ProductRepository` bisa menggantikan `BaseRepository` di mana pun |
| **Interface Segregation** | Service hanya expose method yang diperlukan oleh caller |
| **Dependency Inversion** | Service tergantung pada Repository (abstraksi), bukan implementasi konkrit |

### 23.2 DRY

```
JANGAN duplikasi:
  - Timestamp function — pakai yang sudah ada
  - UUID generation — pakai generateUUID()
  - CRUD logic — pakai BaseRepository
  - UI component — pakai AppButton, AppModal, AppTable
  - Format currency — pakai formatCurrency()
```

### 23.3 KISS

```
Sederhana itu lebih baik:
  - toArray() + filter in-memory — cukup untuk ribuan produk
  - Flat structure — bukan nested berlapis
  - ES Module — tanpa build step, tanpa bundler
  - Satu tabel `products` untuk semua jenis barang
```

### 23.4 Repository Pattern

```
- BaseRepository untuk CRUD standar
- Extend untuk query spesifik (search, filter, pagination)
- Service tidak pernah akses Dexie langsung
- Repository return plain object, bukan Dexie instance
```

### 23.5 Service Layer

```
- Service adalah satu-satunya yang boleh:
  - Memanggil repository
  - Melakukan validasi
  - Mengandung business logic
- Service return: { success: true/false, data/errors }
- Service tidak boleh:
  - Akses DOM
  - Menyimpan state UI
  - Import component
```

### 23.6 Domain Driven Design

```
- Setiap domain punya folder sendiri di modules/
- Domain berisi: service, repository, validator, utils
- Domain hanya berkomunikasi via Service layer
- Domain tidak saling import repository
```

### 23.7 Offline First

```
- Semua data di IndexedDB — tidak ada API call
- Service Worker untuk cache assets
- Manifest untuk installable PWA
- Semua fitur berfungsi tanpa internet
```

### 23.8 Clean Architecture

```
UI (pages/) → Service (modules/) → Repository (repositories/) → Database (database/)
                                                                        
Dependency: outer layer → inner layer
Inner layer tidak tahu tentang outer layer
```

> **Document Version:** 1.0
>
> **Last Updated:** 2026-07-29
>
> **Status:** Active — Single Source of Truth untuk aturan bisnis POS Offline PWA
>
> **Total Rules:** ~200 business rules across 23 sections
