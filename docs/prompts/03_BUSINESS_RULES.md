# TASK: Buat Dokumen `03_BUSINESS_RULES.md`

## Peran

Bertindaklah sebagai **Business Analyst**, **POS Consultant**, **Software Architect**, dan **System Analyst** yang berpengalaman merancang sistem Point of Sale untuk toko retail, minimarket, cafe, restoran, laundry, bengkel, dan UMKM.

Sebelum menyusun dokumen, pahami bahwa proyek ini telah memiliki:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`

Gunakan kedua dokumen tersebut sebagai **single source of truth**.

Jika terdapat konflik dengan blueprint atau database schema, jangan membuat asumsi. Jelaskan konflik tersebut dan berikan rekomendasi penyelesaiannya.

---

# Tujuan

Buat file:

`docs/03_BUSINESS_RULES.md`

Dokumen ini harus menjelaskan seluruh aturan bisnis aplikasi POS secara lengkap.

Dokumen ini **tidak boleh berisi implementasi kode**.

Fokus hanya pada logika bisnis.

---

# Ruang Lingkup

Business Rules harus mencakup seluruh proses bisnis aplikasi POS Offline.

Dokumen harus menjadi referensi utama sebelum implementasi.

---

# Struktur Dokumen

Minimal memiliki bagian berikut.

---

# 1. Prinsip Umum

Jelaskan prinsip bisnis aplikasi.

Contoh:

* Offline First
* Data harus konsisten
* Semua transaksi dapat diaudit
* Tidak boleh ada kehilangan stok
* Semua perubahan penting harus tercatat
* Integritas data lebih penting daripada kecepatan

---

# 2. Master Data

Jelaskan aturan untuk:

## Produk

* membuat produk
* mengubah produk
* menghapus produk
* menonaktifkan produk
* perubahan harga
* perubahan barcode
* perubahan kategori
* stok minimum

## Supplier

## Customer

## Membership

## User

## Role

## Permission

---

# 3. Penjualan

Jelaskan alur lengkap.

Mulai dari:

Kasir membuka transaksi

?

memilih produk

?

mengubah qty

?

diskon

?

voucher

?

pajak

?

subtotal

?

total

?

pembayaran

?

invoice

?

stok berkurang

?

cashflow bertambah

?

audit log

?

dashboard diperbarui

Jelaskan setiap langkah.

---

# 4. Pembelian

Jelaskan aturan:

* membuat pembelian
* menerima barang
* update stok
* update harga rata-rata (jika digunakan)
* pembatalan pembelian
* retur pembelian

---

# 5. Inventory

Jelaskan:

Stock Movement

Stock Adjustment

Stock Opname

Transfer Gudang (future)

Negative Stock

Expired Product (future)

Minimum Stock Alert

---

# 6. Pembayaran

Jelaskan aturan:

Tunai

Transfer

QRIS

Debit

Kredit

Split Payment

Kembalian

Pembulatan

Void Payment

Refund

---

# 7. Diskon

Jelaskan seluruh jenis diskon.

Contoh:

Diskon nominal

Diskon persen

Diskon produk

Diskon kategori

Diskon invoice

Diskon member

Voucher

Promo

Cashback

Tentukan prioritas jika lebih dari satu diskon aktif.

---

# 8. Pajak

Jelaskan:

PPN

Include Tax

Exclude Tax

Pembulatan

Urutan perhitungan:

Subtotal

?

Diskon

?

Pajak

?

Total

---

# 9. Shift Kasir

Jelaskan:

Buka Shift

Saldo Awal

Transaksi

Kas Masuk

Kas Keluar

Tutup Shift

Perhitungan Selisih

Approval jika selisih

---

# 10. Kas dan Keuangan

Aturan:

Cash Flow

Expense

Income

Void

Refund

Saldo Kas

Audit

---

# 11. Cafe

Jelaskan:

Meja

Pindah Meja

Gabung Meja

Pisah Bill

Kitchen Order

Status Pesanan

Take Away

Delivery

Reservasi

---

# 12. Loyalty

Membership

Point

Redeem

Expired Point

Level Member

Reward

---

# 13. Backup

Aturan:

Backup Manual

Backup Otomatis

Restore

Validasi

Versi

Rollback

---

# 14. Audit

Jelaskan:

Apa saja yang harus dicatat.

Contoh:

Login

Logout

Edit Harga

Hapus Produk

Void

Refund

Stock Adjustment

Backup

Restore

Setting

Permission

---

# 15. Dashboard

Jelaskan bagaimana KPI dihitung.

Misalnya:

Omzet Hari Ini

Profit

Penjualan Bulanan

Produk Terlaris

Member Baru

Stok Menipis

Grafik

Kas

---

# 16. Validasi

Jelaskan validasi.

Contoh:

Produk wajib aktif

Qty > 0

Harga >= 0

Diskon tidak boleh melebihi subtotal

Voucher harus valid

Member harus aktif

Shift harus terbuka

Kasir harus login

---

# 17. Exception Handling

Jelaskan skenario gagal.

Misalnya:

Produk habis

Barcode tidak ditemukan

Pembayaran kurang

Shift belum dibuka

Restore gagal

Backup rusak

Database penuh

Storage hampir habis

---

# 18. Future Rules

Siapkan aturan konseptual untuk:

Multi Outlet

Multi Gudang

Cloud Sync

API

Marketplace

WhatsApp

Kitchen Display

Customer Display

Self Order

---

# Flow Diagram

Buat flow diagram menggunakan Mermaid atau ASCII untuk proses berikut:

* Penjualan
* Pembelian
* Stock Movement
* Shift
* Backup
* Restore

---

# Decision Table

Untuk aturan kompleks, gunakan Decision Table.

Contoh:

Jika:

Member = Ya

Promo = Ya

Voucher = Ya

?

Diskon yang berlaku?

Buat tabel keputusan yang jelas.

---

# Business Glossary

Tambahkan glosarium istilah seperti:

Invoice

Shift

Void

Refund

Stock Opname

Cash Flow

Audit

Voucher

Membership

Kitchen Order

Split Bill

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan `01_PROJECT_BLUEPRINT.md`
* Konsisten dengan `02_DATABASE_SCHEMA.md`
* Tidak berisi implementasi kode
* Menggunakan Markdown yang rapi
* Memiliki daftar isi
* Menggunakan tabel dan diagram bila diperlukan
* Menjelaskan alasan bisnis, bukan hanya aturan
* Menandai fitur sebagai Core, Optional, atau Future jika relevan

---

# Aturan Kerja AI

Selama menyusun dokumen:

* Jangan mengubah arsitektur proyek.
* Jangan mengubah struktur database tanpa alasan yang jelas.
* Jika ada aturan yang dapat diterapkan dengan beberapa cara, jelaskan pilihan beserta trade-off.
* Prioritaskan aturan yang sederhana, konsisten, dan mudah dipahami oleh developer maupun pemilik bisnis.

---

# Output

Hasil akhir berupa file:

`docs/03_BUSINESS_RULES.md`

Dokumen harus cukup lengkap sehingga developer dapat mengimplementasikan seluruh logika aplikasi tanpa perlu menebak aturan bisnis.
