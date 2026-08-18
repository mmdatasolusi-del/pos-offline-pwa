# 13_TESTING_GUIDE.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Testing](#2-filosofi-testing)
3. [Tujuan Testing](#3-tujuan-testing)
4. [Strategi Testing](#4-strategi-testing)
5. [Jenis Pengujian](#5-jenis-pengujian)
6. [Checklist per Modul](#6-checklist-per-modul)
7. [Checklist per Halaman](#7-checklist-per-halaman)
8. [Testing Data](#8-testing-data)
9. [Bug Severity](#9-bug-severity)
10. [Bug Priority](#10-bug-priority)
11. [Definition of Ready for Testing](#11-definition-of-ready-for-testing)
12. [Definition of Pass](#12-definition-of-pass)
13. [Regression Matrix](#13-regression-matrix)
14. [Testing Workflow](#14-testing-workflow)
15. [Dokumentasi Testing](#15-dokumentasi-testing)
16. [Laporan Testing](#16-laporan-testing)
17. [Continuous Improvement](#17-continuous-improvement)
18. [Aturan Kerja AI](#18-aturan-kerja-ai)
19. [Daftar Dokumen Terkait](#19-daftar-dokumen-terkait)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **standar resmi pengujian** untuk aplikasi POS Offline PWA. Mendefinisikan strategi, metode, jenis pengujian, checklist, dan kriteria kelulusan yang harus dipenuhi sebelum suatu perubahan dianggap siap rilis.

### 1.2 Siapa yang Membaca

| Pembaca | Kegunaan |
|---|---|
| **AI Coding Assistant** | Acuan pengujian mandiri sebelum menyelesaikan tugas |
| **Developer Manusia** | Standar kualitas yang harus dipenuhi |
| **QA / Tester** | Pedoman utama dalam menyusun dan menjalankan pengujian |
| **Project Manager** | Kriteria kelulusan untuk setiap rilis |

### 1.3 Acuan

| Dokumen | Peran dalam Testing |
|---|---|
| `02_DATABASE_SCHEMA.md` | Acuan validasi data — field, tipe, relasi, integritas |
| `03_BUSINESS_RULES.md` | 168 aturan bisnis yang harus diverifikasi |
| `04_UI_DESIGN_SYSTEM.md` | Token desain — warna, font, spacing, layout |
| `05_COMPONENT_LIBRARY.md` | Spesifikasi komponen — state, variasi, aksesibilitas |
| `06_FEATURE_LIST.md` | Daftar fitur — prioritas, dependensi, acceptance criteria |
| `08_AI_PROMPT_GUIDE.md` | Template test case, checklist review |
| `09_CODING_STANDARD.md` | Standar kode yang diperiksa saat static review |
| `10_PROJECT_STRUCTURE.md` | Struktur folder testing — fixtures, mocks, test files |
| `12_DEVELOPMENT_WORKFLOW.md` | Siklus pengembangan — kapan testing dilakukan |

---

## 2. Filosofi Testing

### 2.1 Quality First

Kualitas adalah tanggung jawab semua orang, bukan hanya QA. Setiap AI dan developer wajib memastikan kode yang dihasilkan telah diuji sebelum diserahkan.

**Penerapan**: Self-review dan functional testing adalah bagian wajib dari siklus pengembangan. Jangan menyerahkan kode yang belum diuji sendiri.

### 2.2 Test Early

Semakin awal bug ditemukan, semakin murah biaya perbaikannya. Bug yang ditemukan saat desain lebih murah daripada bug yang ditemukan saat production.

**Penerapan**: Requirement review sebelum implementasi. Static review setelah kode ditulis. Jangan menunggu integration testing untuk menemukan masalah mendasar.

### 2.3 Test Often

Pengujian dilakukan secara berkala, bukan hanya di akhir siklus. Setiap perubahan kecil harus diuji.

**Penerapan**: Setelah setiap implementasi (sekecil apa pun), lakukan functional testing. Jangan menumpuk perubahan tanpa pengujian.

### 2.4 Regression Prevention

Perubahan baru tidak boleh merusak fitur yang sudah ada. Regression testing adalah prioritas, bukan opsional.

**Penerapan**: Setiap kali mengubah service, repository, database, atau komponen bersama, uji modul lain yang bergantung padanya. Regression matrix sebagai acuan.

### 2.5 Risk Based Testing

Fokus pengujian pada area yang paling berisiko: transaksi keuangan, pergerakan stok, dan integritas data.

**Penerapan**: Alokasi waktu testing proporsional dengan risiko. Critical business rules (BR-001 s.d. BR-100) diuji lebih ketat daripada aturan Low priority.

### 2.6 Documentation Driven Testing

Setiap test case ditulis berdasarkan dokumentasi, bukan berdasarkan kode. Jika dokumentasi dan implementasi berbeda, dokumentasi yang menjadi acuan.

**Penerapan**: Test case diturunkan dari `03_BUSINESS_RULES.md` dan `06_FEATURE_LIST.md`. Jika business rules berubah, test case harus diperbarui sebelum kode.

### 2.7 Offline First Validation

Semua fitur harus diuji dalam kondisi offline — tanpa koneksi internet, tanpa server, tanpa API eksternal.

**Penerapan**: Setiap fitur diuji dengan jaringan dimatikan. Service Worker caching diverifikasi. IndexedDB persistence dipastikan.

---

## 3. Tujuan Testing

| Tujuan | Deskripsi |
|---|---|
| **Fitur sesuai kebutuhan** | Implementasi menyelesaikan masalah yang diminta sesuai `06_FEATURE_LIST.md` |
| **Business Rules dipatuhi** | Semua aturan bisnis yang relevan terimplementasi dengan benar |
| **Tidak ada regresi** | Fitur yang sudah berjalan tidak rusak oleh perubahan baru |
| **UI konsisten** | Desain sesuai `04_UI_DESIGN_SYSTEM.md` — warna, font, spacing, layout |
| **Data aman** | Integritas data terjaga — soft delete, audit trail, snapshot, backup |
| **Performa tetap baik** | Query IndexedDB, render halaman, startup time dalam batas wajar |
| **Pengalaman nyaman** | Loading state, error handling, feedback yang jelas, responsive |

---

## 4. Strategi Testing

Pendekatan bertingkat — setiap level menguji aspek yang berbeda:

```
Requirement Review
        ↓
Static Review
        ↓
Unit Testing
        ↓
Integration Testing
        ↓
UI Testing
        ↓
Business Rule Testing
        ↓
Offline Testing
        ↓
Performance Testing
        ↓
Regression Testing
        ↓
Acceptance Testing
```

### 4.1 Requirement Review

**Tujuan**: Memastikan implementasi sesuai dengan kebutuhan yang didokumentasikan.

| Aktivitas | Output | Kriteria Lulus |
|---|---|---|
| Verifikasi terhadap `01_PROJECT_BLUEPRINT.md` | Tidak ada konflik arsitektur | Arsitektur sesuai |
| Verifikasi terhadap `06_FEATURE_LIST.md` | Fitur sesuai prioritas dan dependensi | Prioritas dan dependensi terpenuhi |
| Verifikasi terhadap `03_BUSINESS_RULES.md` | Semua BR relevan teridentifikasi | BR siap diuji |
| Verifikasi terhadap `07_ROADMAP.md` | Fase pengembangan sesuai | Timeline sesuai |

### 4.2 Static Review

**Tujuan**: Memeriksa kualitas kode tanpa menjalankan aplikasi.

| Aktivitas | Kriteria Lulus |
|---|---|
| Struktur folder sesuai `10_PROJECT_STRUCTURE.md` | File di folder yang benar |
| Coding Standard sesuai `09_CODING_STANDARD.md` | Tidak ada pelanggaran |
| Penamaan file konsisten | kebab-case / PascalCase sesuai aturan |
| Tidak ada inline style / inline event | DOM terpisah dari logic |
| Tidak ada duplikasi kode | Solusi belum ada di tempat lain |
| JSDoc pada semua fungsi export | Fungsi terdokumentasi |
| Tidak ada TODO / FIXME | Kode final siap pakai |
| Import rule dipatuhi | Tidak ada circular dependency |

### 4.3 Unit Testing

**Tujuan**: Memverifikasi fungsi-fungsi kecil (utility, helper, validator, formatter) bekerja dengan benar secara terisolasi.

| Fokus | Contoh |
|---|---|
| **Utility** | `formatCurrency()`, `formatDate()`, `generateInvoiceNumber()` |
| **Helper** | `calculateDiscount()`, `calculateTax()`, `calculateChange()` |
| **Validator** | `validateProduct()`, `validateSale()`, `validateUser()` |
| **Formatter** | `formatPhone()`, `formatSku()`, `truncateText()` |
| **Calculator** | `computeSubtotal()`, `computeGrandTotal()`, `computeProfit()` |
| **Business Logic** | `canVoidSale()`, `canRefundItem()`, `isStockSufficient()` |

**Kriteria lulus**:
- Semua fungsi mengembalikan nilai yang diharapkan untuk input normal
- Edge cases (null, undefined, empty string, negative number) menghasilkan error atau fallback yang sesuai
- Tidak ada fungsi yang melempar exception tak terduga
- Cover minimal: input normal + 2 edge cases per function

### 4.4 Integration Testing

**Tujuan**: Memverifikasi bahwa layer aplikasi berkomunikasi dengan benar.

```
Page → Service → Repository → Database (IndexedDB)
```

| Skenario | Yang Diuji |
|---|---|
| Page memanggil Service → Service memanggil Repository | Data mengalir dengan benar |
| Repository menulis ke IndexedDB | Data tersimpan |
| Repository membaca dari IndexedDB | Data terbaca |
| Service memvalidasi data sebelum dikirim ke Repository | Validasi berjalan |
| Service melempar error jika Repository gagal | Error handling berjalan |

**Kriteria lulus**:
- Data yang ditulis bisa dibaca kembali dengan benar
- Error di Repository diteruskan ke Service dengan benar
- Service tidak mengakses database langsung
- Tidak ada kebocoran data antar layer

### 4.5 UI Testing

**Tujuan**: Memverifikasi bahwa antarmuka pengguna berfungsi dan konsisten.

| Aspek | Detail |
|---|---|
| **Responsive** | Tampilan baik di tablet 10" landscape (target utama), desktop 1366px+, mobile 375px |
| **Dark Mode** | (v2.0) Warna berubah sesuai tema. Kontras tetap terjaga |
| **Touch Target** | Semua elemen interaktif minimal 44x44px |
| **Font** | Inter untuk body, JetBrains Mono untuk nominal. Ukuran sesuai `04_UI_DESIGN_SYSTEM.md` |
| **Button** | Semua state (default, hover, active, disabled) berfungsi |
| **Dialog/Modal** | Buka, tutup, konfirmasi, cancel. Focus trap di modal |
| **Form** | Input, select, checkbox bekerja. Validasi inline tampil |
| **Table** | Data tampil, search, filter, sort, pagination berfungsi |
| **Toast** | Success, error, warning tampil dan hilang otomatis |
| **Empty State** | Tampilan saat tidak ada data — pesan informatif |
| **Error State** | Tampilan saat terjadi error — tombol retry |

### 4.6 Business Rule Testing

**Tujuan**: Memverifikasi bahwa aturan bisnis dari `03_BUSINESS_RULES.md` diimplementasikan dengan benar.

| Area | Contoh Test |
|---|---|
| **User** | Password min 6 karakter. Username tidak bisa diubah. Soft delete tidak menghapus data |
| **Product** | SKU unik. Service type tidak punya stok. Snapshot nama+harga di SaleItem |
| **Sales** | Stok berkurang saat PAID. Void mengembalikan stok. Void tidak menghapus histori. Invoice auto INV-YYYYMMDD-XXXX |
| **Payment** | Cash > total hitung kembalian. Partial payment = status PARTIAL. QRIS tampilkan QR |
| **Stok** | Setiap perubahan tercatat di StockMovement. Stok negatif dilarang (kecuali setting). Adjustment wajib alasan |
| **Shift** | Buka shift = input openingBalance. Tutup = expected vs actual. 1 shift aktif per user. Transaksi wajib shiftId |
| **Backup** | Auto tiap 6 jam. JSON + SHA-256. Restore wajib konfirmasi. Auto-backup sebelum restore |
| **Discount** | Diskon per-item tidak boleh > unitPrice. Diskon transaksi sebelum pajak. Voucher cek masa berlaku |
| **Audit** | Semua perubahan critical tercatat. Audit log tidak bisa dihapus user |

**Kriteria lulus**:
- Setiap BR yang relevan dengan fitur telah diuji
- BR Critical dan High terverifikasi tanpa error
- Kombinasi BR (misal: diskon + pajak + voucher) menghasilkan nilai yang benar

### 4.7 Database Testing

**Tujuan**: Memverifikasi bahwa operasi database berjalan dengan benar dan data tetap konsisten.

| Aspek | Detail |
|---|---|
| **CRUD** | Create, Read, Update, Delete (soft/hard) berfungsi untuk setiap entitas |
| **Index** | Query dengan index lebih cepat dari tanpa index. Unique index mencegah duplikasi |
| **Migration** | Upgrade dari versi lama ke baru tidak merusak data existing |
| **Backup** | Export JSON lengkap, SHA-256 valid. Import restore semua data |
| **Restore** | Data setelah restore identik dengan sebelum backup |
| **Integritas** | Foreign key konsisten. Tidak ada orphan record. Snapshot tidak berubah |
| **Soft Delete** | `deletedAt` terisi. Data tidak muncul di query normal. Data masih bisa diakses langsung |

**Kriteria lulus**:
- Semua operasi CRUD berjalan tanpa error
- Backup → Restore → verifikasi data: 100% identik
- Migration dari v1 ke vN: data lama masih terbaca dengan benar

### 4.8 Offline Testing

**Tujuan**: Memastikan aplikasi berfungsi penuh tanpa koneksi internet — ini adalah nilai jual utama aplikasi.

| Skenario | Langkah | Ekspektasi |
|---|---|---|
| **Cold start offline** | Matikan jaringan. Buka aplikasi | Aplikasi loading dan siap digunakan |
| **Transaksi offline** | Lakukan transaksi POS tanpa internet | Transaksi selesai, data tersimpan |
| **Install PWA offline** | Install PWA, matikan jaringan, buka dari home screen | Aplikasi terbuka tanpa browser address bar |
| **Service Worker cache** | Buka aplikasi online sekali, matikan jaringan, refresh | Halaman termuat dari cache |
| **IndexedDB persistence** | Isi data, tutup browser, buka lagi | Data tetap ada |
| **Backup offline** | Backup data tanpa internet | File JSON terdownload |
| **Restore offline** | Restore data tanpa internet | Data kembali seperti semula |

**Kriteria lulus**:
- Semua fungsi inti (POS, produk, stok, laporan) berjalan tanpa internet
- Service Worker menyajikan halaman dari cache saat offline
- IndexedDB tetap menyimpan data setelah browser ditutup
- Tidak ada error console terkait fetch/network failure

### 4.9 Performance Testing

**Tujuan**: Memastikan aplikasi tetap responsif dalam kondisi normal dan batas.

| Metrik | Target | Metode Ukur |
|---|---|---|
| **Cold start** (first load) | < 3 detik | Browser DevTools — Network tab |
| **Warm start** (subsequent) | < 1 detik | Stopwatch |
| **Search produk** (1000 item) | < 500ms | Console time |
| **Transaksi POS** (10 item) | < 2 detik selesai | Stopwatch |
| **Load laporan** (30 hari) | < 3 detik | Console time |
| **Backup data** (1000 transaksi) | < 5 detik | Stopwatch |
| **Restore data** (1000 transaksi) | < 5 detik | Stopwatch |
| **Memory usage** | < 200MB idle | Browser Task Manager |
| **IndexedDB size** | < 50MB untuk 10k transaksi | DevTools — Application tab |
| **Cache size** | < 30MB | DevTools — Application tab |

**Kriteria lulus**:
- Cold start < 3 detik pada koneksi 3G simulated
- Search produk < 500ms untuk 1000 produk
- Transaksi POS selesai < 2 detik untuk 10 item
- Tidak ada lag yang terasa saat scrolling atau input

### 4.10 Regression Testing

**Tujuan**: Memastikan perubahan baru tidak merusak fitur yang sudah ada.

**Cakupan**: Tergantung pada jenis perubahan — lihat Regression Matrix (section 13).

**Kriteria lulus**:
- Semua fitur yang masuk dalam regression scope berfungsi normal
- Tidak ada error baru di console
- Data existing tidak berubah strukturnya

### 4.11 Accessibility Testing

**Tujuan**: Memastikan aplikasi dapat digunakan oleh semua pengguna, termasuk pengguna dengan keterbatasan.

| Aspek | Standar | Cara Uji |
|---|---|---|
| **Color contrast** | WCAG 2.1 AA — 4.5:1 normal text, 3:1 large text | Browser DevTools — Contrast checker |
| **Focus indicator** | Visible focus ring pada semua elemen interaktif | Tab navigation |
| **Touch target** | Minimal 44x44px | DevTools — Element size |
| **Form label** | Setiap input punya label eksplisit | Inspect element |
| **Keyboard navigation** | Semua fungsi bisa diakses via keyboard | Tab, Enter, Escape, Arrow keys |
| **ARIA roles** | Komponen interaktif punya role yang sesuai | Inspect element |
| **Heading hierarchy** | h1 > h2 > h3, tidak ada skip level | View page structure |

**Kriteria lulus**:
- Color contrast minimal 4.5:1 untuk text normal
- Semua form input memiliki label
- Navigasi keyboard berfungsi di semua halaman utama
- Touch target > 44x44px

### 4.12 Security Testing

**Tujuan**: Memastikan data aplikasi aman dari kerentanan umum.

| Aspek | Detail |
|---|---|
| **Input validation** | Semua input dari user divalidasi — tipe, format, panjang, rentang |
| **Data sanitization** | XSS prevention — jangan render HTML mentah dari input user |
| **Local storage** | Data bisnis di IndexedDB, bukan localStorage. Session token di sessionStorage |
| **No eval** | Tidak ada penggunaan `eval()`, `new Function()`, `setTimeout(string)` |
| **Error handling** | Error message tidak menampilkan detail teknis ke user |
| **RBAC** | Permission dicek di service layer, bukan hanya di UI |
| **Audit trail** | Perubahan critical tercatat di AuditLog dengan userId + timestamp |

**Kriteria lulus**:
- Tidak ada penggunaan eval()
- Semua input divalidasi
- RBAC berfungsi — user tanpa permission tidak bisa mengakses fitur
- Audit log tercatat untuk operasi critical

---

## 5. Jenis Pengujian

### 5.1 Ringkasan Jenis Pengujian

| No | Jenis | Kapan Dilakukan | Siapa | Tools/Metode |
|---|---|---|---|---|
| 1 | **Requirement Review** | Sebelum implementasi | AI/Developer | Baca dokumen 01, 03, 06 |
| 2 | **Static Review** | Setelah implementasi | AI/Developer | Checklist 09_CODING_STANDARD |
| 3 | **Unit Testing** | Setelah implementasi | Developer | Manual test + console.log |
| 4 | **Integration Testing** | Setelah unit test lulus | Developer | Manual test — ikuti alur data |
| 5 | **UI Testing** | Setelah integration test | Developer/QA | Visual inspection + DevTools |
| 6 | **Business Rule Testing** | Setelah UI testing | QA/AI | Cek per BR di 03_BUSINESS_RULES |
| 7 | **Database Testing** | Setelah migrasi/perubahan DB | Developer | CRUD test, backup/restore test |
| 8 | **Offline Testing** | Sebelum rilis | QA | Matikan jaringan, test semua fitur |
| 9 | **Performance Testing** | Sebelum rilis besar | Developer | Stopwatch, DevTools Performance tab |
| 10 | **Regression Testing** | Setiap perubahan | AI/QA | Regression Matrix — uji modul terkait |
| 11 | **Accessibility Testing** | Sebelum rilis | QA | DevTools, keyboard test |
| 12 | **Security Testing** | Sebelum rilis | Developer | Code review + checklist keamanan |

---

## 6. Checklist per Modul

Setiap modul harus melalui checklist berikut sebelum dinyatakan selesai.

### 6.1 Core (Auth, User, Role, Permission, Setting)

- [ ] Login dengan username + password yang valid berhasil
- [ ] Login dengan password salah -> error message, counter bertambah
- [ ] Login gagal 5 kali -> akun terkunci 30 menit
- [ ] Logout -> session berakhir, redirect ke login
- [ ] Lock screen -> PIN required, salah 3x -> logout
- [ ] Buat user baru -> tersimpan, bisa login
- [ ] User nonaktif -> tidak bisa login
- [ ] Role Admin tidak bisa dihapus
- [ ] Setting tersimpan dan terbaca kembali
- [ ] Permission dicek — user tanpa akses tidak bisa membuka halaman
- [ ] Console bersih, tidak ada error

### 6.2 Master Data (Product, Category, Unit, Supplier, Customer)

- [ ] Tambah produk -> tersimpan, muncul di list
- [ ] Edit produk -> data berubah
- [ ] SKU duplikat -> error validasi
- [ ] Barcode duplikat -> error validasi
- [ ] Soft delete produk -> tidak muncul di POS, data tetap di database
- [ ] Category tree maks 3 level
- [ ] Import produk -> validasi error di-rollback
- [ ] Export produk -> file CSV/Excel terdownload
- [ ] Search, filter, sort, pagination berfungsi
- [ ] Tambah customer -> bisa dipilih di POS
- [ ] Console bersih, tidak ada error

### 6.3 Sales / POS

- [ ] Tambah item ke cart -> quantity 1, total terhitung
- [ ] Scan barcode -> produk ditemukan dan ditambahkan
- [ ] Ubah quantity -> subtotal berubah, stok cukup (kecuali service)
- [ ] Hapus item dari cart -> item hilang
- [ ] Diskon per-item -> total berkurang, diskon tidak > unitPrice
- [ ] Diskon transaksi -> subtotal setelah diskon dihitung
- [ ] Pajak -> dihitung dari subtotal setelah diskon
- [ ] Bayar cash -> hitung kembalian benar
- [ ] Bayar mixed -> jumlah semua metode = grand total
- [ ] Bayar QRIS -> QR code tampil
- [ ] Partial payment -> status PARTIAL
- [ ] Transaksi PAID -> stok berkurang, invoice tergenerate INV-YYYYMMDD-XXXX
- [ ] Void transaksi -> stok kembali, status VOID, audit tercatat
- [ ] Refund item -> stok item kembali
- [ ] Cetak ulang struk -> PDF terdownload
- [ ] Cart kosong -> tombol bayar disabled
- [ ] Console bersih, tidak ada error

### 6.4 Purchase

- [ ] Buat PO -> status DRAFT
- [ ] Order PO -> status ORDERED
- [ ] Receive barang -> receivedQuantity, stok bertambah
- [ ] Complete PO -> status COMPLETED
- [ ] Cancel PO (DRAFT/ORDERED) -> status CANCELLED
- [ ] Partial receive -> sisanya outstanding
- [ ] Console bersih, tidak ada error

### 6.5 Inventory

- [ ] Stok produk tampil benar (quantity = sum movements)
- [ ] Stock adjustment -> alasan wajib, tercatat di StockMovement
- [ ] Stock opname -> isi actual, hitung selisih, apply adjustment
- [ ] Opname APPLIED -> read-only
- [ ] Stok minimum -> warning di dashboard
- [ ] Stok negatif -> error (kecuali setting allowNegativeStock)
- [ ] Setiap perubahan stok tercatat di StockMovement
- [ ] Console bersih, tidak ada error

### 6.6 Finance (Cash Flow, Expense, Income, Shift)

- [ ] Buka shift -> openingBalance, shiftNumber auto
- [ ] Tutup shift -> perbandingan expected vs actual
- [ ] Selisih shift -> adjustment tercatat
- [ ] Cuma 1 shift OPEN per user
- [ ] Transaksi di luar shift -> error
- [ ] Catat expense -> kas berkurang
- [ ] Catat income -> kas bertambah
- [ ] Cash flow tidak bisa dihapus
- [ ] Console bersih, tidak ada error

### 6.7 Report

- [ ] Laporan penjualan harian -> data sesuai transaksi
- [ ] Laporan per produk -> qty terjual, revenue
- [ ] Laporan per kategori -> breakdown benar
- [ ] Laporan per kasir -> total per user
- [ ] Laporan stok -> quantity dan nilai stok
- [ ] Laporan keuangan -> profit, expense, income
- [ ] Filter date range berfungsi
- [ ] Export PDF -> file terdownload, format rapi
- [ ] Export Excel -> file .xlsx terdownload
- [ ] Dashboard summary cards -> angka sesuai
- [ ] Console bersih, tidak ada error

### 6.8 Cafe / Table (v2.0)

- [ ] Lihat denah meja -> status AVAILABLE/OCCUPIED/RESERVED
- [ ] Pilih meja -> order terikat meja
- [ ] Pindah meja -> order pindah
- [ ] Split bill -> item terpisah per bill
- [ ] Kitchen order -> tampil di kitchen display
- [ ] Status kitchen: PENDING -> PREPARING -> READY -> SERVED
- [ ] Reservasi -> meja terpesan di waktu tertentu
- [ ] Console bersih, tidak ada error

### 6.9 Membership / Loyalty (v2.5)

- [ ] Register member -> data tersimpan
- [ ] Poin earned -> sesuai setting (default Rp1000 = 1 poin)
- [ ] Redeem poin -> diskon sesuai setting
- [ ] Riwayat poin -> semua earning/redeem tercatat
- [ ] Member check via phone -> data muncul
- [ ] Console bersih, tidak ada error

### 6.10 Backup & Restore

- [ ] Backup manual -> file JSON terdownload
- [ ] Backup otomatis -> backup terbuat setiap 6 jam jika ada perubahan
- [ ] Restore -> data kembali, verifikasi SHA-256
- [ ] Restore dengan backup corrupt -> error, data aman
- [ ] Auto-backup sebelum restore -> backup lama aman
- [ ] Export CSV/Excel per entitas -> file terdownload
- [ ] Console bersih, tidak ada error

---

## 7. Checklist per Halaman

Setiap halaman harus melalui checklist berikut:

- [ ] **Halaman dapat dibuka** — route benar, tidak ada 404
- [ ] **Loading state** — spinner/skeleton tampil saat data dimuat
- [ ] **Empty state** — pesan informatif saat tidak ada data
- [ ] **Error state** — tampilan error saat gagal muat data, tombol retry
- [ ] **Responsive** — rapi di tablet 10" landscape (target utama)
- [ ] **Responsive mobile** — tidak overflow, touch target cukup (opsional)
- [ ] **Loading cepat** — < 2 detik untuk data normal
- [ ] **Tombol berfungsi** — semua tombol melakukan aksi yang benar
- [ ] **Validasi form** — error inline, format benar, required terpenuhi
- [ ] **Navigasi** — breadcrumb/back button bekerja
- [ ] **Search & filter** — hasil sesuai, tidak error
- [ ] **Sort & pagination** — urutan benar, halaman berfungsi
- [ ] **Keyboard navigasi** — Tab, Enter, Escape bekerja
- [ ] **Focus indicator** — visible, urutan logis
- [ ] **Tidak ada elemen rusak** — gambar broken, icon missing, layout overlap
- [ ] **Console bersih** — tidak ada error atau warning
- [ ] **Tablet friendly** — tombol cukup besar, scroll nyaman

---

## 8. Testing Data

### 8.1 Data Dummy Minimum

Untuk menjalankan pengujian yang komprehensif, siapkan data dummy berikut:

| Kategori | Data | Jumlah Minimal |
|---|---|---|
| **Produk** | Produk normal, produk tanpa stok, produk stok minimum, service type, produk nonaktif | 20+ |
| **Kategori** | Root category, parent-child, 3-level depth | 5+ |
| **Pelanggan** | Dengan transaksi, tanpa transaksi, member, non-member | 10+ |
| **Supplier** | Aktif, nonaktif | 5+ |
| **Transaksi** | PAID, VOID, REFUNDED, PENDING, PARTIAL | 50+ |
| **Pembayaran** | CASH, TRANSFER, QRIS, DEBIT, MIXED | 10+ |
| **Shift** | OPEN, CLOSED — beberapa shift berbeda | 5+ |
| **Pergerakan stok** | Sale, purchase, adjustment, opname | 30+ |

### 8.2 Edge Case Data

| Data | Tujuan |
|---|---|
| Produk dengan nama sangat panjang (200+ karakter) | Uji layout table/card |
| Produk dengan harga 0 (gratis) | Uji perhitungan diskon/pajak |
| Produk dengan harga sangat besar (Rp 999.999.999) | Uji format currency |
| Diskon 0% | Uji tidak ada perubahan harga |
| Diskon 100% | Uji total = 0 |
| Pajak 0% | Uji perhitungan |
| Pajak 100% | Uji total = 2x subtotal |
| Transaksi dengan 1 item | Uji minimum |
| Transaksi dengan 100 item | Uji performa |
| Nama pelanggan empty/null | Uji validasi |
| Barcode tidak dikenal | Uji scan error |
| Quantity 0 atau negatif | Uji validasi |

### 8.3 Stress Test Data

| Skenario | Data | Tujuan |
|---|---|---|
| Produk dalam jumlah besar | 10.000 produk | Uji search, pagination, load time |
| Transaksi dalam jumlah besar | 10.000 transaksi | Uji laporan, backup, restore |
| Transaksi dalam 1 hari | 500 transaksi | Uji invoice number sequential |
| Produk dalam 1 kategori | 1.000 produk | Uji filter kategori |
| Stock movement | 10.000 movement | Uji history loading |

---

## 9. Bug Severity

### 9.1 Tingkat Keparahan

| Severity | Definisi | Contoh |
|---|---|---|
| **Critical** | Aplikasi crash, data hilang, kehilangan uang, fungsi utama tidak berfungsi | Transaksi tidak bisa selesai. Backup gagal dengan data corrupt. Stok tidak konsisten setelah void. Invoice number duplikat |
| **High** | Fungsi penting tidak berjalan sesuai spesifikasi, workaround sulit | Diskon tidak dihitung. Pajak salah. Laporan penjualan tidak akurat. Search produk tidak menemukan data |
| **Medium** | Fungsi berjalan tapi tidak optimal, ada workaround | Tampilan kurang rapi di ukuran tertentu. Validasi form kurang lengkap. Pesan error tidak informatif |
| **Low** | Gangguan minor, tidak mempengaruhi fungsi | Typo di label. Icon kurang sesuai. Warna tidak persis sama dengan design system. Padding sedikit tidak konsisten |
| **Cosmetic** | Hanya masalah visual, tidak mempengaruhi fungsi | Shadow tidak sesuai elevation. Border radius berbeda 1px. Font weight kurang tepat |

### 9.2 Cara Menentukan Severity

```
Apakah data bisa hilang?          → Critical
Apakah uang bisa salah?           → Critical
Apakah fungsi utama tidak jalan?  → Critical/High
Apakah ada workaround?            → Yes = Medium, No = High
Apakah hanya visual?              → Cosmetic/Low
Apakah pengguna bisa lanjut?      → Yes = Medium/Low, No = High
```

---

## 10. Bug Priority

### 10.1 Tingkat Prioritas

| Priority | Definisi | Waktu Perbaikan |
|---|---|---|
| **P1 — Critical** | Harus diperbaiki segera. Blocker untuk rilis | Segera, tidak boleh ada pekerjaan lain |
| **P2 — High** | Harus diperbaiki sebelum rilis berikutnya | Sebelum rilis berikutnya |
| **P3 — Medium** | Perbaiki jika ada waktu. Bisa ditunda ke rilis berikutnya | Siklus berikutnya |
| **P4 — Low** | Perbaiki kapan pun. Tidak menghambat siapa pun | Tidak dijadwalkan |

### 10.2 Matriks Severity × Priority

| Severity | Priority | Alasan |
|---|---|---|
| **Critical** | **P1** | Data hilang, crash, fungsi utama mati |
| **Critical** (dengan workaround) | **P2** | Masih bisa jalan dengan cara lain |
| **High** | **P1/P2** | Tergantung apakah fungsi terhambat total |
| **High** (dengan workaround mudah) | **P3** | Bisa pakai cara lain sementara |
| **Medium** | **P3** | Tidak menghambat |
| **Low** | **P4** | Tidak mendesak |
| **Cosmetic** | **P4** | Bisa dikerjakan kapan pun |

### 10.3 Cara Menentukan Prioritas

```
P1: Blocker — tidak bisa rilis tanpa ini
P2: Harus ada di rilis berikutnya
P3: Penting tapi bisa nanti
P4: Nice to have
```

---

## 11. Definition of Ready for Testing

Sebuah fitur **boleh diuji** (masuk ke tahap testing) jika:

| Kriteria | Detail |
|---|---|
| **Implementasi selesai** | Semua kode untuk fitur sudah ditulis |
| **Coding Standard dipatuhi** | `09_CODING_STANDARD.md` tidak dilanggar |
| **Tidak ada error sintaks** | Aplikasi bisa dijalankan tanpa error |
| **Static review lulus** | Struktur folder, penamaan, import rule sesuai standar |
| **Dokumentasi dasar tersedia** | Setidaknya JSDoc pada fungsi export. Jika ada perubahan database, `02_DATABASE_SCHEMA.md` sudah diupdate |

### 11.1 Jika Belum Siap

Jika fitur belum memenuhi Definition of Ready, AI harus:

1. Identifikasi kriteria mana yang belum terpenuhi
2. Kembali ke tahap implementasi / perbaikan
3. Jangan memaksakan testing pada kode yang belum siap

---

## 12. Definition of Pass

Sebuah fitur **dianggap lulus pengujian** jika:

| Kriteria | Detail |
|---|---|
| **Semua checklist terpenuhi** | Checklist modul + halaman sesuai section 6 dan 7 |
| **Tidak ada bug Critical** | P1 = 0 |
| **Tidak ada bug High yang menghambat fungsi utama** | P2 yang memblokir fungsi utama = 0 |
| **Business Rules berjalan benar** | Semua BR relevan terverifikasi |
| **Offline tetap berfungsi** | Fitur berjalan tanpa internet |
| **Tidak ada error di console** | Console browser bersih |
| **Responsive di tablet** | Target utama: tablet 10" landscape |
| **Data konsisten** | Soft delete, audit, snapshot terpenuhi |
| **Dokumentasi sinkron** | Dokumen yang relevan sudah diperbarui |

### 12.1 Jika Tidak Lulus

- Catat semua bug yang ditemukan dengan severity dan priority
- Prioritaskan perbaikan berdasarkan P1 > P2 > P3 > P4
- Setelah perbaikan, ulangi testing dari awal (regression)
- Fitur belum boleh dirilis sampai Definition of Pass terpenuhi

---

## 13. Regression Matrix

Jika ada perubahan pada suatu area, modul berikut **wajib diuji ulang**:

### 13.1 Perubahan Database

| Yang Berubah | Modul yang Wajib Regression Test |
|---|---|
| Schema entitas **Product** | Product, Sales (POS), Inventory, Report |
| Schema entitas **Sale/SaleItem** | Sales, Payment, Inventory, Report, Shift |
| Schema entitas **Payment** | Sales, Finance (CashFlow), Report |
| Schema entitas **Inventory/StockMovement** | Inventory, Sales, Purchase, Product, Report |
| Schema entitas **Purchase/PurchaseItem** | Purchase, Inventory, Report |
| Schema entitas **Shift** | Sales, Finance, Report |
| Schema entitas **User/Role/Permission** | Auth, semua modul (RBAC) |
| Schema entitas **Setting** | Semua modul (konfigurasi global) |

### 13.2 Perubahan Service

| Yang Berubah | Modul yang Wajib Regression Test |
|---|---|
| **AuthService** | Login, Lock Screen, semua halaman (session) |
| **ProductService** | Product, Sales (POS), Inventory, Report |
| **SalesService** | Sales, Payment, Inventory, Finance, Report |
| **InventoryService** | Inventory, Product, Sales, Purchase |
| **PaymentService** | Payment, Sales, CashFlow, Report |
| **ReportService** | Report, Dashboard |
| **ShiftService** | Shift, Sales, Finance |
| **SettingService** | Semua modul |

### 13.3 Perubahan Komponen Bersama

| Yang Berubah | Halaman yang Wajib Regression Test |
|---|---|
| **AppTable** | Semua halaman yang menggunakan tabel |
| **AppForm** (AppInput, AppSelect, dll) | Semua halaman dengan form |
| **AppModal** | Semua halaman dengan modal/dialog |
| **AppButton** | Semua halaman dengan tombol |
| **AppNavigation** (Sidebar, BottomNav) | Semua halaman |
| **AppPagination** | Semua halaman dengan daftar data |
| **AppToast** | Semua halaman |

### 13.4 Perubahan Layout / Theme

| Yang Berubah | Modul yang Wajib Regression Test |
|---|---|
| **CSS global / Bootstrap override** | Semua halaman — cek layout, spacing, warna |
| **App Shell layout** | Semua halaman — cek header, sidebar, content |
| **Dark mode** | Semua halaman — cek kontras, warna |
| **Responsive breakpoints** | Semua halaman — cek di tablet, desktop, mobile |

### 13.5 Perubahan PWA

| Yang Berubah | Yang Wajib Regression Test |
|---|---|
| **Service Worker** | Cache strategy, offline fallback, install |
| **Manifest** | Install prompt, icons, theme color, display mode |

---

## 14. Testing Workflow

### 14.1 Alur Standar

```
Analisis (pahami fitur, baca dokumentasi)
    ↓
Implementasi (tulis kode sesuai standar)
    ↓
Self Review (static review, cek coding standard)
    ↓
Static Review (struktur, penamaan, dokumentasi)
    ↓
Functional Testing (fitur berjalan sesuai spesifikasi)
    ↓
Integration Testing (data mengalir antar layer)
    ↓
Business Rule Testing (BR terpenuhi)
    ↓
Offline Testing (berfungsi tanpa internet)
    ↓
Regression Testing (fitur lain tidak rusak)
    ↓
Documentation Review (dokumen sinkron)
    ↓
Release Ready
```

### 14.2 Kapan Setiap Tahap Dilakukan

| Tahap | Dilakukan Oleh | Kapan |
|---|---|---|
| Analisis | AI/Developer | Sebelum implementasi |
| Implementasi | AI/Developer | — |
| Self Review | AI/Developer | Setelah implementasi |
| Static Review | AI/Developer | Setelah self review |
| Functional Testing | Developer/QA | Setelah static review lulus |
| Integration Testing | Developer/QA | Setelah functional test lulus |
| Business Rule Testing | QA/AI | Setelah integration test |
| Offline Testing | QA | Sebelum rilis |
| Regression Testing | AI/QA | Setiap perubahan |
| Documentation Review | AI/Developer | Setelah testing selesai |

### 14.3 Workflow Bug Fix

```
Bug dilaporkan
    ↓
Reproduksi bug
    ↓
Klasifikasi (severity + priority)
    ↓
Analisis root cause
    ↓
Perbaiki
    ↓
Verifikasi bug selesai
    ↓
Regression test (sesuai matrix)
    ↓
Update dokumentasi (jika perlu)
    ↓
Tutup issue
```

---

## 15. Dokumentasi Testing

### 15.1 Format Catatan Testing

Setiap sesi testing harus mencatat:

| Field | Deskripsi |
|---|---|
| **Nama Fitur** | Nama fitur yang diuji |
| **ID Fitur** | ID dari `06_FEATURE_LIST.md` (CS-01, SA-01, dll) |
| **Tanggal** | Tanggal pengujian |
| **Penguji** | Nama/role penguji (AI/Developer/QA) |
| **Lingkungan** | Browser, perangkat, mode offline/online |
| **Hasil** | PASS / FAIL / PARTIAL |
| **Bug Ditemukan** | List bug dengan severity + priority |
| **Sisa Risiko** | Hal yang belum bisa diuji atau risiko yang tersisa |
| **Status** | Belum Diuji / Dalam Pengujian / Lulus / Gagal |
| **Catatan** | Informasi tambahan |

### 15.2 Template Laporan Testing

```
## Laporan Testing

| Item | Detail |
|---|---|
| **Fitur** | {nama fitur} |
| **ID Fitur** | {ID dari FEATURE_LIST} |
| **Tanggal** | {YYYY-MM-DD} |
| **Penguji** | {nama/role} |
| **Browser** | {Chrome/Edge/Firefox vX} |
| **Device** | {Tablet 10" / Desktop 1366px / Mobile 375px} |
| **Mode** | {Online / Offline} |

### Hasil Pengujian

| Area | Status | Catatan |
|---|---|---|
| Functional Testing | {PASS/FAIL} | {detail} |
| Business Rules | {PASS/FAIL} | {BR yang diuji} |
| UI / Responsive | {PASS/FAIL} | {detail} |
| Offline | {PASS/FAIL} | {detail} |
| Performance | {PASS/FAIL} | {metrik} |

### Bug Ditemukan

| ID | Deskripsi | Severity | Priority | Status |
|---|---|---|---|---|
| 1 | {deskripsi} | {Critical/High/Medium/Low} | {P1-P4} | {Open/Fixed} |

### Catatan

{informasi tambahan, risiko sisa, saran}
```

### 15.3 Kapan Dokumentasi Testing Diperlukan

- Fitur baru selesai diimplementasikan
- Bug fix selesai
- Sebelum rilis (full regression)
- Setelah perubahan database/migrasi

---

## 16. Laporan Testing

### 16.1 Format Laporan untuk AI

Setelah menyelesaikan tugas, AI harus melaporkan status testing:

```
## Testing Summary

### Functional Testing: ✅ PASS
- {fitur} — semua use case positif berjalan
- {fitur} — edge cases tertangani

### Business Rules: ✅ {N}/{Total} PASS
- BR-{XXX}: ✅ {aturan} — terverifikasi
- BR-{YYY}: ✅ {aturan} — terverifikasi

### Offline Testing: ✅ PASS
- Aplikasi berfungsi tanpa internet
- Data tersimpan di IndexedDB

### Console: ✅ CLEAN
- Tidak ada error atau warning

### Regression: ✅ PASS
- {modul terkait}: tidak ada regresi

### Risiko Sisa
- {deskripsi risiko yang belum bisa diuji/dimitigasi}
```

### 16.2 Format Laporan untuk QA/Manusia

Untuk laporan formal (sebelum rilis):

```
## Release Testing Report - {Versi}

### Summary
- Total Test Cases: {N}
- Passed: {N}
- Failed: {N}
- Blocked: {N}
- Pass Rate: {X}%

### Bug Breakdown
- P1 (Critical): {N} — {status}
- P2 (High): {N} — {status}
- P3 (Medium): {N} — {status}
- P4 (Low): {N} — {status}

### Modules Tested
- {Module A}: PASS / FAIL
- {Module B}: PASS / FAIL

### Verdict
- [ ] PASS — Semua kriteria terpenuhi
- [ ] FAIL — Ada bug yang harus diperbaiki
- [ ] CONDITIONAL PASS — Bug minor,不影响 rilis
```

---

## 17. Continuous Improvement

### 17.1 Bagaimana Testing Berkembang

Seiring bertambahnya modul, fitur, dan kompleksitas, strategi testing harus berkembang:

| Fase | Perubahan |
|---|---|
| **v0.1–v0.8** (MVP) | Manual testing dominan. Fokus pada functional + business rules |
| **v1.0** (Rilis Stabil) | Tambahkan integration test untuk service + repository |
| **v1.1–v1.5** | Tambahkan stress test. Automated regression untuk modul Core |
| **v2.0** (Cafe) | Test case untuk alur cafe + kitchen. Aksesibilitas formal |
| **v2.5** (Loyalty) | Test case untuk poin, tier, redeem. Security testing formal |
| **v3.0** (Cloud) | Network testing. Conflict resolution. Sync testing |

### 17.2 Prinsip Evolusi Testing

- **Jangan tambah proses tanpa nilai** — setiap jenis testing harus memberikan nilai yang jelas
- **Otomatisasi bertahap** — manual dulu, lalu otomatisasi jika value > cost
- **Retrospective testing** — setelah rilis, evaluasi: apa yang terlewat? apa yang perlu ditambah?
- **Regression test suite** — kumpulkan test case yang sering gagal jadi regression suite prioritas

### 17.3 Masukan untuk Perbaikan

Jika selama testing ditemukan:

- Proses yang tidak efisien → usulkan perbaikan workflow
- Area yang sering bermasalah → tambahkan test case spesifik
- Tools yang kurang membantu → usulkan tools baru
- Dokumentasi yang tidak akurat → perbaiki dokumentasi

---

## 18. Aturan Kerja AI

### 18.1 Sebelum Menyatakan Tugas Selesai

AI **wajib**:

| # | Aturan |
|---|---|
| 1 | **Pastikan fitur telah melalui checklist** yang relevan (section 6 dan 7) |
| 2 | **Jelaskan pengujian yang telah dilakukan** — functional, business rules, offline, regression |
| 3 | **Sebutkan pengujian yang belum bisa dijalankan** — dan alasannya (misal: belum ada data test, butuh environment tertentu) |
| 4 | **Identifikasi risiko yang masih tersisa** — apa yang mungkin salah, dan bagaimana mitigasinya |
| 5 | **Saran langkah validasi berikutnya** — apa yang perlu diuji oleh QA/manusia sebelum rilis |

### 18.2 Selama Testing

| # | Aturan |
|---|---|
| 1 | **Test dengan data nyata** — jangan test hanya dengan data minimal. Gunakan data mendekati realita |
| 2 | **Test edge cases** — input kosong, karakter spesial, angka negatif, jumlah besar |
| 3 | **Test offline** — matikan jaringan, pastikan fitur tetap berfungsi |
| 4 | **Cek console** — setiap selesai testing, pastikan tidak ada error/warning di console browser |
| 5 | **Jangan skip regression** — perubahan kecil sekalipun bisa berdampak luas |
| 6 | **Dokumentasikan bug** — severity, priority, langkah reproduksi, environment |
| 7 | **Verifikasi perbaikan** — setelah bug diperbaiki, test ulang untuk memastikan bug benar-benar selesai |

### 18.3 Contoh Laporan Testing dari AI

Setelah menyelesaikan implementasi + testing, AI harus memberikan:

```
## Testing Summary

### Functional: ✅ PASS
- Tambah produk: berhasil, muncul di list, validasi jalan
- Edit produk: data berubah, audit tercatat
- Hapus produk: soft delete, tidak muncul di POS
- Search/filter/sort/pagination: semua berfungsi

### Business Rules: ✅ 5/5 PASS
- BR-020: produk baru wajib name+sku+unitId+sellPrice ✅
- BR-021: SKU tidak bisa diubah setelah dibuat ✅
- BR-023: produk nonaktif tidak muncul di POS ✅
- BR-024: soft delete jika pernah dijual ✅
- BR-026: service type tidak punya stok ✅

### Offline: ✅ PASS
- Produk dimuat tanpa internet
- CRUD produk berjalan offline

### Console: ✅ CLEAN
- Tidak ada error

### Regression: ✅ PASS
- Sales (POS): produk masih muncul dan bisa dijual
- Inventory: stok masih konsisten

### Risiko Sisa
- Import produk (BR-028) belum diuji — butuh file CSV sample
- Performa dengan 10.000 produk belum diuji

### Saran
- Uji import dengan file CSV valid dan invalid
- Uji performa search dengan 10.000 produk
```

---

## 19. Daftar Dokumen Terkait

| Dokumen | Peran dalam Testing |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Prinsip arsitektur — validasi keputusan teknis |
| `02_DATABASE_SCHEMA.md` | 34 entitas, field, relasi — acuan database testing |
| `03_BUSINESS_RULES.md` | 168 aturan bisnis — acuan business rule testing |
| `04_UI_DESIGN_SYSTEM.md` | Token desain — acuan UI testing |
| `05_COMPONENT_LIBRARY.md` | Spesifikasi komponen — acuan component testing |
| `06_FEATURE_LIST.md` | Prioritas fitur — acuan prioritasi testing |
| `08_AI_PROMPT_GUIDE.md` | Template test case, review checklist |
| `09_CODING_STANDARD.md` | Standar kode — acuan static review |
| `10_PROJECT_STRUCTURE.md` | Struktur testing — fixtures, mocks, test files |
| `12_DEVELOPMENT_WORKFLOW.md` | Siklus pengembangan — kapan testing dilakukan |
| `13_TESTING_GUIDE.md` | **(dokumen ini)** Standar QA proyek |

---

> **Dokumen ini adalah standar resmi Quality Assurance untuk POS Offline PWA.**  
> Seluruh AI Coding Assistant, developer, dan QA wajib mengikuti pedoman pengujian ini.  
> Konsisten dengan seluruh dokumen `01_PROJECT_BLUEPRINT.md` s.d. `12_DEVELOPMENT_WORKFLOW.md`.

---

*POS Offline PWA — Testing Guide v1.0.0 — 15 Juli 2026*
