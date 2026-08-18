# TASK: Buat Dokumen `02_DATABASE_SCHEMA.md`

## Peran

Bertindaklah sebagai **Software Architect**, **Database Architect**, dan **Business System Analyst** yang berpengalaman membangun aplikasi POS (Point of Sale) untuk UMKM, toko retail, dan cafe.

Sebelum menjawab, anggap bahwa proyek ini sudah memiliki dokumen `01_PROJECT_BLUEPRINT.md` sebagai sumber kebenaran (single source of truth). Seluruh keputusan desain database harus konsisten dengan dokumen tersebut.

Jika menemukan konflik atau ketidaksesuaian dengan Blueprint, jangan membuat asumsi diam-diam. Tuliskan konflik tersebut beserta rekomendasi penyelesaiannya.

---

# Tujuan

Buat file **`docs/02_DATABASE_SCHEMA.md`**.

Dokumen ini adalah desain database konseptual dan logis untuk aplikasi **Offline POS Progressive Web App**.

**Jangan membuat implementasi kode JavaScript, Dexie.js, atau IndexedDB.**

Fokus pada desain data dan aturan bisnis.

---

# Target Sistem

Database harus dirancang agar mendukung:

* Offline First
* Progressive Web App
* IndexedDB (implementasi dilakukan pada tahap berikutnya)
* Mudah dikembangkan
* Modular
* Skalabel
* Mudah dipelihara
* Siap mendukung fitur masa depan

---

# Modul yang Harus Didukung

Database harus mampu mengakomodasi kebutuhan modul berikut:

## Core

* User
* Role
* Permission
* Setting

## Master Data

* Product
* Category
* Unit
* Supplier
* Customer

## Penjualan

* Sale
* Sale Item
* Payment
* Discount
* Tax
* Voucher

## Pembelian

* Purchase
* Purchase Item

## Inventory

* Inventory
* Stock Movement
* Stock Adjustment
* Stock Opname

## Keuangan

* Cash Flow
* Expense
* Income

## Operasional

* Shift
* Audit Log
* Activity Log

## Cafe

* Table
* Kitchen Order
* Reservation

## Loyalty

* Membership
* Loyalty Point

## Backup

* Backup Metadata

## Future

* Multi Outlet
* Multi Warehouse
* Sync Queue
* API Integration

---

# Untuk Setiap Entitas

Jelaskan secara lengkap:

1. Nama entitas
2. Tujuan entitas
3. Deskripsi bisnis
4. Daftar field
5. Tipe data konseptual
6. Primary Key
7. Foreign Key (konseptual)
8. Field wajib
9. Field opsional
10. Nilai default
11. Index yang disarankan
12. Validasi data
13. Aturan bisnis
14. Catatan implementasi

---

# Relasi Antar Entitas

Buat diagram relasi menggunakan Mermaid ER Diagram atau ASCII.

Jelaskan relasi seperti:

* Category ? Product
* Supplier ? Purchase
* Purchase ? Purchase Item
* Customer ? Sale
* Sale ? Sale Item
* Product ? Stock Movement
* User ? Sale
* User ? Shift
* Shift ? Cash Flow

Sertakan penjelasan kardinalitas.

---

# Integritas Data

Jelaskan aturan untuk menjaga konsistensi data.

Contoh:

* SKU harus unik.
* Barcode harus unik jika digunakan.
* Produk nonaktif tidak boleh dijual.
* Tidak boleh ada stok negatif kecuali diizinkan pengaturan.
* Penjualan selesai tidak boleh diedit langsung.
* Perubahan dilakukan melalui mekanisme pembatalan, retur, atau penyesuaian.

Tambahkan aturan lain yang dianggap penting.

---

# Soft Delete

Kelompokkan entitas menjadi:

* Soft Delete
* Hard Delete
* Tidak Boleh Dihapus

Berikan alasan bisnis untuk setiap keputusan.

---

# Audit dan Riwayat

Rancang kebutuhan data untuk:

* Audit Log
* Activity Log
* Stock History
* Price History

Jelaskan:

* kapan data dicatat
* siapa yang mencatat
* tujuan pencatatan

---

# Penomoran Dokumen

Rancang format nomor otomatis untuk:

* Invoice
* Purchase Order
* Stock Opname
* Expense
* Income
* Shift

Contoh:

INV-YYYYMMDD-0001

Jelaskan pola dan alasan pemilihannya.

---

# Backup dan Restore

Jelaskan strategi:

* Backup JSON
* Restore
* Versioning Schema
* Validasi sebelum Restore
* Migrasi bila skema berubah

---

# Skalabilitas

Pastikan desain database tetap kompatibel jika suatu saat ditambahkan:

* Multi Outlet
* Multi Gudang
* Multi Kasir
* Multi Pajak
* Multi Mata Uang
* Sinkronisasi Cloud
* REST API

Jelaskan bagaimana desain saat ini mengakomodasi pengembangan tersebut tanpa perubahan besar.

---

# Naming Convention

Tentukan standar penamaan untuk:

* Entitas
* Field
* Primary Key
* Foreign Key
* Timestamp
* Boolean
* Enum
* Status

Gunakan gaya yang konsisten di seluruh dokumen.

---

# Data Dictionary

Buat tabel ringkasan yang memuat:

* Nama Entitas
* Fungsi
* Relasi Utama
* Perkiraan Jumlah Field
* Status (Core / Optional / Future)

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan `01_PROJECT_BLUEPRINT.md`
* Menggunakan Markdown yang rapi
* Memiliki daftar isi
* Menggunakan heading yang konsisten
* Menggunakan tabel jika diperlukan
* Menggunakan diagram relasi
* Menggunakan istilah teknis yang jelas
* Tidak berisi implementasi kode

---

# Aturan Kerja AI

Selama menyusun dokumen:

* Jangan mengubah arsitektur proyek.
* Jangan menambahkan fitur di luar ruang lingkup tanpa menjelaskan alasannya.
* Jika ada asumsi, tuliskan secara eksplisit.
* Jika ada keputusan desain yang memiliki beberapa alternatif, tampilkan rekomendasi beserta trade-off.
* Prioritaskan desain yang sederhana, konsisten, dan mudah dipelihara.

---

# Output

Hasil akhir berupa file **`docs/02_DATABASE_SCHEMA.md`** yang siap digunakan sebagai acuan implementasi pada tahap berikutnya dan cukup lengkap sehingga pengembang dapat mulai membuat struktur IndexedDB tanpa perlu mendesain ulang database.
