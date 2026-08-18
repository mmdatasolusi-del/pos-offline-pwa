# Manual Test — POS Transaction

## Prerequisites
- Login sebagai kasir
- Shift sudah dibuka
- Minimal 5 produk aktif dengan stok

## Test Scenarios

### 1. Basic Transaction
1. Buka halaman POS
2. Tambah 3 item ke cart
3. Bayar dengan CASH
4. Verifikasi: struk tampil, stok berkurang, invoice tergenerate

### 2. Discount + Tax
1. Tambah item
2. Terapkan diskon per-item 10%
3. Terapkan diskon transaksi Rp5.000
4. Bayar dengan CASH
5. Verifikasi: perhitungan benar

[More scenarios will be added in Phase 5]
