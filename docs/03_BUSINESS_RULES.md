# 03_BUSINESS_RULES.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Ringkasan](#2-ringkasan)
3. [Konvensi Penulisan](#3-konvensi-penulisan)
4. [Manajemen Pengguna](#4-manajemen-pengguna)
5. [Manajemen Produk](#5-manajemen-produk)
6. [Manajemen Kategori](#6-manajemen-kategori)
7. [Manajemen Harga](#7-manajemen-harga)
8. [Proses Penjualan (POS)](#8-proses-penjualan-pos)
9. [Pembayaran](#9-pembayaran)
10. [Diskon dan Promo](#10-diskon-dan-promo)
11. [Pajak](#11-pajak)
12. [Manajemen Stok](#12-manajemen-stok)
13. [Pembelian (Purchasing)](#13-pembelian-purchasing)
14. [Manajemen Shift](#14-manajemen-shift)
15. [Manajemen Pelanggan](#15-manajemen-pelanggan)
16. [Manajemen Kas (Cash Flow)](#16-manajemen-kas-cash-flow)
17. [Laporan](#17-laporan)
18. [Backup dan Sinkronisasi](#18-backup-dan-sinkronisasi)
19. [Keamanan](#19-keamanan)
20. [Cafe (Tables & Kitchen) (v2.0)](#20-cafe-tables--kitchen-v20)
21. [Loyalty Program](#21-loyalty-program)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini mendefinisikan aturan bisnis (business rules) untuk aplikasi POS Offline PWA. Setiap aturan di sini menjadi acuan implementasi — jika ada kode yang bertentangan dengan dokumen ini, perubahan harus dilakukan pada kode, bukan dokumen.

### 1.2 Siapa yang Membaca Dokumen Ini

- **Developer**: Untuk memahami logika bisnis sebelum implementasi
- **QA / Tester**: Untuk menyusun test case
- **Product Owner / Stakeholder**: Untuk validasi alur bisnis
- **Technical Writer**: Untuk dokumentasi pengguna

### 1.3 Cara Membaca

Setiap aturan ditulis dengan format:

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-NNN | [Skenario/Kondisi] | [Hasil/Sikap yang diharapkan] | [Critical/High/Medium/Low] |

---

## 2. Ringkasan

| Area | Jumlah Aturan | Halaman |
|---|---|---|
| Manajemen Pengguna | 12 | 4-5 |
| Manajemen Produk | 10 | 5-6 |
| Manajemen Kategori | 5 | 6-7 |
| Manajemen Harga | 8 | 7-8 |
| Proses Penjualan (POS) | 18 | 8-9 |
| Pembayaran | 10 | 9-10 |
| Diskon dan Promo | 8 | 10-11 |
| Pajak | 5 | 11 |
| Manajemen Stok | 12 | 11-13 |
| Pembelian (Purchasing) | 8 | 13-14 |
| Manajemen Shift | 8 | 14 |
| Manajemen Pelanggan | 6 | 14-15 |
| Manajemen Kas | 6 | 15 |
| Laporan | 8 | 15-16 |
| Backup dan Sinkronisasi | 8 | 16 |
| Keamanan | 10 | 16-17 |
| Cafe (Tables) | 8 | 17 |
| Loyalty Program | 8 | 17-18 |

**Total**: 168 aturan

---

## 3. Konvensi Penulisan

### 3.1 Status / Kondisi

| Status | Makna |
|---|---|
| ACTIVE / INACTIVE | Aktif atau tidaknya suatu data |
| PAID / PENDING / VOID / REFUNDED / PARTIAL | Status transaksi |
| OPEN / CLOSED | Status shift |
| DRAFT / ORDERED / RECEIVED / COMPLETED / CANCELLED | Status purchase |
| AVAILABLE / OCCUPIED / RESERVED / CLEANING | Status meja |
| REGULAR / SILVER / GOLD / PLATINUM | Tier membership |

### 3.2 Prioritas

| Prioritas | Makna |
|---|---|
| **Critical** | Pelanggaran menyebabkan error, data tidak konsisten, atau kehilangan uang |
| **High** | Pelanggaran menyebabkan fungsionalitas tidak berjalan sesuai |
| **Medium** | Pelanggaran mengurangi pengalaman pengguna |
| **Low** | Pelanggaran bersifat kosmetik atau preferensi |

---

## 4. Manajemen Pengguna

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-001 | Membuat user baru | Wajib: username (unique), password, fullname, role | Critical |
| BR-002 | Password strength | Min 6 karakter, kombinasi huruf dan angka | Critical |
| BR-003 | Username | Tidak bisa diubah setelah dibuat | Critical |
| BR-004 | User dinonaktifkan | Tidak bisa login. Tidak bisa memproses transaksi | Critical |
| BR-005 | Hapus user | Tidak bisa. Hanya nonaktifkan (soft delete) | Critical |
| BR-006 | Role Admin | Minimal 1 user Admin harus selalu aktif | Critical |
| BR-007 | Role system | Role \"Admin\" tidak bisa diubah atau dihapus | Critical |
| BR-008 | Login gagal | Maks 5 percobaan gagal, akun terkunci 30 menit | High |
| BR-009 | Ubah password sendiri | Wajib: password lama benar, password baru != lama, confirm match | Critical |
| BR-010 | Reset password | Hanya Admin yang bisa reset password user lain | High |
| BR-011 | Session | Token JWT expire 24 jam, auto logout | High |
| BR-012 | Audit login | Setiap login/logout tercatat di AuditLog | Medium |

---

## 5. Manajemen Produk

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-020 | Membuat produk baru | Wajib: name, sku (unique), unitId, sellPrice | Critical |
| BR-021 | SKU | Tidak bisa diubah setelah dibuat | Critical |
| BR-022 | Barcode | Opsional. Jika diisi harus unik | Critical |
| BR-023 | Produk nonaktif | Tidak muncul di POS, tidak bisa dijual | High |
| BR-024 | Hapus produk | Tidak bisa jika pernah dijual. Hanya soft delete | Critical |
| BR-025 | Product snapshots | SaleItem menyimpan productName + unitPrice (snapshot) | Critical |
| BR-026 | Service type | Service type (`type=service`) tidak memiliki stok dan inventory, sellPrice bisa 0 | High |
| BR-027 | Duplikasi produk | Tombol duplicate menyalin field kecuali SKU, barcode, createdAt | Medium |
| BR-028 | Import produk | Validasi SKU duplikat, barcode duplikat. Rollback jika ada error | High |
| BR-029 | Export produk | Export ke CSV/Excel dengan semua field | Low |

---

## 6. Manajemen Kategori

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-030 | Membuat kategori | Wajib: name. parentId opsional (null = root) | Medium |
| BR-031 | Depth kategori | Maksimal 3 level (parent > child > grandchild) | High |
| BR-032 | Hapus kategori | Tidak bisa jika memiliki produk aktif. Pindahkan dulu produk | High |
| BR-033 | Pindahkan kategori | Memindahkan kategori juga memindahkan child-nya | Medium |
| BR-034 | Root category | Minimal 1 root category harus ada | Low |

---

## 7. Manajemen Harga

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-040 | Harga jual (sellPrice) | Minimal 0. Untuk produk = 0 berarti gratis | High |
| BR-041 | Harga beli (buyPrice) | Boleh 0 jika tidak diketahui | Low |
| BR-042 | Harga jual < harga beli | Tidak dilarang tapi menampilkan warning | Medium |
| BR-043 | Riwayat perubahan harga | Semua perubahan harga dicatat di auditLog | High |
| BR-044 | Harga khusus pelanggan | (v2.0) Tabel customerPrice terpisah | Future |
| BR-045 | Update harga massal | Bisa update sellPrice dengan persentase atau nominal tetap | Medium |
| BR-046 | Harga termasuk pajak | Konfigurasi settings: `priceIncludeTax` = true/false | Medium |
| BR-047 | Pembulatan | Grand total dibulatkan ke 50 atau 100 terdekat (setting) | Low |

---

## 8. Proses Penjualan (POS)

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-050 | Tambah item ke keranjang | Produk harus active. Stok > 0 (kecuali service) | Critical |
| BR-051 | Kuantitas item | Min 1. Max ditentukan setting `maxItemQuantity` (default 999) | Critical |
| BR-052 | Keranjang kosong | Tombol bayar disabled jika tidak ada item | Critical |
| BR-053 | Ubah quantity item | Stok mencukupi (kecuali service). Hanya saat status PENDING | Critical |
| BR-054 | Hapus item dari keranjang | Bisa dilakukan selama status PENDING | Medium |
| BR-055 | Simpan transaksi pending | Sale disimpan sebagai PENDING, item stok tidak terkurangi | High |
| BR-056 | Proses transaksi ke PAID | Setelah pembayaran sukses: subtotal >= grandTotal, kurangi stok | Critical |
| BR-057 | Void transaksi | Hanya PAID bisa di-void. Wajib alasan. Stok dikembalikan | Critical |
| BR-058 | Void transaksi | Void membatalkan item, mengembalikan stok | Critical |
| BR-059 | Refund transaksi | Partial refund = sebagian. Full refund = seluruhnya + pengembalian stok | High |
| BR-060 | Cetak ulang struk | Struk bisa dicetak ulang selama 7 hari | Medium |
| BR-061 | Invoice number | Auto-generated, format INV-YYYYMMDD-XXXX, sequential per hari | Critical |
| BR-062 | No invoice tidak bisa diubah | Read-only setelah PAID | Critical |
| BR-063 | Diskon per item | Bisa diatur per-barang. Diskon tidak boleh > unitPrice | High |
| BR-064 | Diskon per transaksi | Diskon diterapkan ke subtotal sebelum pajak | High |
| BR-065 | Pajak per transaksi | Pajak dihitung dari subtotal setelah diskon | High |
| BR-066 | Pending transaksi | Shift bisa di-CLOSE meski ada PENDING. Notifikasi untuk resume | Medium |
| BR-067 | Hold transaksi | Sale bisa disimpan sebagai HOLD, items tidak dikurangi | Medium |

---

## 9. Pembayaran

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-070 | Metode pembayaran | CASH, TRANSFER, QRIS, DEBIT, CREDIT | Critical |
| BR-071 | Cash > grand total | Hitung kembalian. Kembalian = cash - grandTotal | Critical |
| BR-072 | Cash < grand total | Tidak bisa lanjut (kecuali partial payment) | Critical |
| BR-073 | Pembayaran campuran (MIXED) | Minimal 2 metode. Total semua payment = grandTotal | High |
| BR-074 | Pembayaran QRIS | Tampilkan QR code. Tunggu konfirmasi | High |
| BR-075 | Pembayaran transfer | Input reference number opsional | Medium |
| BR-076 | Partial payment | Status = PARTIAL. Sisa dibuat sebagai piutang | High |
| BR-077 | Pembayaran > grand total | Tidak bisa. Kecuali cash (kembalian) | Critical |
| BR-078 | Gagal pembayaran | Transaksi tetap PENDING. Tidak ada perubahan stok | High |
| BR-079 | Verifikasi pembayaran | Untuk DEBIT/CREDIT, verifikasi melalui tool EDC | High |

---

## 10. Diskon dan Promo

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-080 | Diskon persentase | Nilai 0-100. Dihitung dari harga barang | Critical |
| BR-081 | Diskon nominal | Nilai > 0. Tidak boleh melebihi harga barang | Critical |
| BR-082 | Diskon manual | Input manual oleh kasir. Tercatat siapa pemberi diskon | High |
| BR-083 | Voucher | Kode unik. Cek masa berlaku, usage limit, min purchase | High |
| BR-084 | Voucher expired | Voucher lewat validUntil tidak bisa digunakan | Critical |
| BR-085 | Voucher habis | usageLimit tercapai = voucher tidak valid | High |
| BR-086 | Multi diskon | Bisa kombinasi diskon item + diskon transaksi + voucher | Medium |
| BR-087 | Diskon berantai | Diskon persentase bertumpuk: diskon2 dihitung dari harga setelah diskon1 | Medium |

---

## 11. Pajak

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-090 | Pajak default | Ambil dari settings `tax-default-rate` jika ada | High |
| BR-091 | Pajak multiple | Satu transaksi bisa kena >1 pajak | Medium |
| BR-092 | Perubahan tarif pajak | tidak mempengaruhi transaksi yang sudah PAID (snapshot) | High |
| BR-093 | Non-taxable item | Produk tertentu bisa exempt dari pajak (field `isTaxExempt`) | Medium |
| BR-094 | Laporan pajak | Hitung total pajak per periode. Export untuk SPT | Medium |

---

## 12. Manajemen Stok

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-100 | Setiap perubahan stok | Wajib tercatat di StockMovement dengan reference | Critical |
| BR-101 | Stok negatif | Tidak diizinkan (kecuali setting allowNegativeStock = true) | Critical |
| BR-102 | Stok minimum | Field minStock. Jika quantity <= minStock, tampilkan warning | High |
| BR-103 | Notifikasi stok menipis | Tampilkan notifikasi dashboard jika quantity <= minStock | Medium |
| BR-104 | Penyesuaian stok (adjustment) | Wajib: alasan (damage/loss/correction), tercatat di StockMovement | Critical |
| BR-105 | Stok opname | Buat opname, isi actualQuantity, hitung selisih. Apply = adjustment | High |
| BR-106 | Opname tidak bisa diubah | Setelah APPLIED, opname read-only | High |
| BR-107 | Pengembalian stok (void/refund) | Void = seluruh item. Refund = item tertentu | Critical |
| BR-108 | Purchase diterima | Received quantity menambah stok | Critical |
| BR-109 | Service tidak punya stok | Service type tidak punya Inventory record | High |
| BR-110 | Transfer stok antar gudang | (v2.0) field warehouseId | Future |
| BR-111 | Batch / Expiry date | (v2.0) Tabel terpisah untuk batch management | Future |

---

## 13. Pembelian (Purchasing)

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-120 | Purchase Order | DRAFT: bisa diedit. ORDERED: dikirim ke supplier | Critical |
| BR-121 | Menerima barang (RECEIVED) | receivedQuantity <= quantity. Menambah stok | Critical |
| BR-122 | Complete PO | Semua item receivedQuantity = quantity. Status = COMPLETED | High |
| BR-123 | PO tidak lengkap | Partial receive diperbolehkan. Sisanya outstanding | High |
| BR-124 | Cancel PO | Hanya bisa cancel jika status masih DRAFT atau ORDERED | Critical |
| BR-125 | Harga beli di PO | Mempengaruhi harga beli produk (rata-rata atau latest) | Medium |
| BR-126 | Supplier di PO | Wajib. Pilih dari data supplier | High |
| BR-127 | Riwayat PO | Menyediakan history harga beli per produk | Medium |

---

## 14. Manajemen Shift

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-130 | Buka shift | Wajib: userId, openingBalance (uang awal). ShiftNumber auto | Critical |
| BR-131 | Tutup shift | Kasir input closingBalance. Sistem hitung expectedBalance dari transaksi | Critical |
| BR-132 | Selisih shift | Jika difference != 0, catat di CashFlow sebagai adjustment | High |
| BR-133 | Satu shift aktif per user | Maks 1 shift OPEN per user. Tidak bisa buka shift baru | High |
| BR-134 | Transaksi di luar shift | Tidak bisa. Sale wajib shiftId | Critical |
| BR-135 | Shift tidak bisa dibuka ulang | Shift sudah CLOSED tidak bisa diubah | Critical |
| BR-136 | Rekap shift | Tampilkan: total sale, total cash, total non-cash, selisih | High |
| BR-137 | Multi shift per hari | Boleh, shift dibuka dan ditutup dalam 1 hari | Medium |

---

## 15. Manajemen Pelanggan

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-140 | Tambah pelanggan | Wajib: name. phone opsional | Medium |
| BR-141 | Pelanggan anonim | Transaksi bisa tanpa pelanggan (customerId = null) | High |
| BR-142 | Duplikasi pelanggan | Deteksi duplikasi berdasarkan phone (warning) | Low |
| BR-143 | Riwayat pelanggan | Tampilkan: total transaksi, total belanja, kunjungan terakhir | Medium |
| BR-144 | Hapus pelanggan | Soft delete. Riwayat transaksi tetap ada | High |
| BR-145 | Pelanggan menjadi member | Ubah isMember = true. Buat Membership record | Medium |

---

## 16. Manajemen Kas (Cash Flow)

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-150 | Kas masuk (IN) | Sumber: sale, refund, opening_balance, income | Critical |
| BR-151 | Kas keluar (OUT) | Tujuan: expense, closing_balance, refund | Critical |
| BR-152 | Transaksi non-shift | CashFlow untuk expense/income tidak perlu shiftId | Medium |
| BR-153 | Edit cash flow | Setelah dicatat tidak bisa dihapus. Hanya adjustment | Critical |
| BR-154 | Rekap kas per shift | Hitung: opening + (sale cash) - (expense) = closing | High |
| BR-155 | Laporan arus kas | Filter by: date range, category, type. Export | Medium |

---

## 17. Laporan

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-160 | Laporan penjualan harian | Total: transaksi, subtotal, diskon, pajak, grand total, metode bayar | High |
| BR-161 | Laporan per produk | Qty terjual, total revenue, avg price | Medium |
| BR-162 | Laporan per kategori | Breakdown transaksi per kategori produk | Medium |
| BR-163 | Laporan per kasir | Total transaksi per user per periode | Medium |
| BR-164 | Laporan stok | Stok terkini, stok minimum, nilai stok (buyPrice * qty) | High |
| BR-165 | Laporan keuangan | Profit kotor: (sellPrice - buyPrice) * qty. Expense | Medium |
| BR-166 | Laporan pajak | Total pajak per periode, export | Medium |
| BR-167 | Dashboard | Summary cards: today sale, active shift, low stock alert | High |

---

## 18. Backup dan Sinkronisasi

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-170 | Backup otomatis | Setiap 6 jam jika ada perubahan data | Critical |
| BR-171 | Backup manual | Bisa dilakukan kapan pun oleh Admin | High |
| BR-172 | Format backup | JSON dengan checksum SHA-256 dan schema version | Critical |
| BR-173 | Restore backup | Wajib konfirmasi. Auto-backup sebelum restore. Verifikasi | Critical |
| BR-174 | Sinkronisasi cloud | (v2.0) Push/pull data, conflict resolution menggunakan lastUpdatedAt | Future |
| BR-175 | Enkripsi backup | Opsional dengan password. File .json.enc | Medium |
| BR-176 | Riwayat backup | BackupMetadata menyimpan 10 backup terakhir | Low |
| BR-177 | Export data | Bisa export ke CSV/Excel per entitas | Low |

---

## 19. Keamanan

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-180 | Password minimum | 6 karakter, kombinasi huruf dan angka | Critical |
| BR-181 | Session timeout | 24 jam idle. Jika idle, auto logout | Critical |
| BR-182 | Multiple login | 1 user hanya bisa 1 session aktif | High |
| BR-183 | IP restriction | (v2.0) Whitelist IP tertentu | Future |
| BR-184 | Data di lokal | Semua data tetap aman di IndexedDB (local) | High |
| BR-185 | Lock screen | Aplikasi auto-lock jika idle > 5 menit (PIN diperlukan) | High |
| BR-186 | Audit trail | Semua perubahan critical data tercatat di auditLog | Critical |
| BR-187 | Hapus audit log | Tidak bisa dihapus oleh user. Hanya housekeeping otomatis | Critical |
| BR-188 | Sensitive data | Password di-hash (SHA-256). PIN di-hash. Tidak disimpan plain | Critical |
| BR-189 | RBAC | Setiap akses ke modul dicek permission | Critical |

---

## 20. Cafe (Tables & Kitchen) (v2.0)

Untuk versi Cafe/Restaurant.

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-200 | Meja tersedia | Meja status = AVAILABLE bisa dipakai | Future |
| BR-201 | Pesan ke dapur | KitchenOrder dengan items dikirim ke display dapur | Future |
| BR-202 | Status kitchen order | PENDING > PREPARING > READY > SERVED | Future |
| BR-203 | Reservasi meja | Reserve untuk customer. Cek konflik waktu | Future |
| BR-204 | Meja okupansi | Satu meja hanya 1 transaksi aktif. Bisa gabung meja | Future |
| BR-205 | Pindah meja | Pindahkan order ke meja lain | Future |
| BR-206 | Split bill | 1 meja bisa split bill per item | Future |
| BR-207 | Print kitchen note | Nota dapur tercetak otomatis setelah bayar | Future |

---

## 21. Loyalty Program

Untuk versi Loyalty.

| ID | Kondisi | Ekspektasi | Prioritas |
|---|---|---|---|
| BR-210 | Earning poin | Setting: Rp X = 1 poin. Default: 1000 = 1 | Future |
| BR-211 | Redeem poin | Setting: Y poin = Rp Z diskon. Default: 100 = 1000 | Future |
| BR-212 | Poin expired | (v2.0) Poin expire 6 bulan setelah earn | Future |
| BR-213 | Tier upgrade | REGULAR (0), SILVER (500rb/thn), GOLD (2jt/thn), PLATINUM (5jt/thn) | Future |
| BR-214 | Tier benefits | SILVER: 5% extra poin. GOLD: 10%. PLATINUM: 15% + free delivery | Future |
| BR-215 | Riwayat poin | Semua earning/redeem tercatat di LoyaltyPoint | Future |
| BR-216 | Poin tidak hangus | (v1.0) Poin tidak expire, (v2.0) expire | Future |
| BR-217 | Member check | Cek member via phone atau memberNumber | Future |

---

> **Dokumen ini adalah acuan aturan bisnis untuk POS Offline PWA.**  
> Konsisten dengan \`01_PROJECT_BLUEPRINT.md\` dan \`02_DATABASE_SCHEMA.md\`.

---

*POS Offline PWA — Business Rules v1.0.0 — 15 Juli 2026*
