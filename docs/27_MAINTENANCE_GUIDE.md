# PANDUAN PEMELIHARAAN (MAINTENANCE GUIDE)
## POS Offline PWA

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Status** | Final (berdasarkan audit baseline) |
| **Tanggal** | 2026-08-18 |
| **Pembuat** | Maintenance Documentation |
| **Basis Fakta** | Audit source code + runtime smoke test — lihat `docs/BASELINE_AUDIT_REPORT.md` |

> **PENTING — Status Dokumen di Repositori:**
> Versi sebelumnya dari file ini hanyalah template tugas (bukan panduan). Dokumen ini adalah
> penggantinya: panduan pemeliharaan operasional yang isinya **fakta dan prosedur**, bukan template.
> Semua prosedur ditulis berdasarkan kondisi kode saat audit (v1.0 baseline). Setiap tempat di mana
> kondisi nyata aplikasi **belum** mendukung prosedur (misalnya fitur backup yang rusak) dicantumkan
> secara eksplisit sebagai **"Diketahui Bermasalah"** agar tidak ada asumsi yang salah.

---

## DAFTAR ISI

1. Maintenance Philosophy
2. Daily Check
3. Weekly Check
4. Monthly Check
5. Database Maintenance
6. Backup Strategy
7. Restore Procedure
8. Service Worker Maintenance
9. PWA Maintenance
10. Performance Monitoring
11. Error Monitoring
12. Troubleshooting
13. Update Procedure
14. Rollback
15. Incident Response
16. Security Maintenance
17. Dependency Maintenance
18. Dead Code & Technical Debt
19. Monitoring Checklist
20. Maintenance Log
21. AI Maintenance Rules
22. Disaster Recovery
23. Long Term Maintenance
24. Maintenance Checklist
25. Referensi & Lampiran

---

## 1. MAINTENANCE PHILOSOPHY

Aplikasi POS Offline PWA disimpan **seluruhnya di perangkat** (IndexedDB/Dexie) dan berjalan
**tanpa koneksi internet** untuk operasional harian. Karena tidak ada server pusat yang menampung
data, **data lokal adalah satu-satunya sumber kebenaran**. Konsekuensi: hilangnya data lokal = data
hilang permanen. Karena itu pemeliharaan difokuskan pada **ketersediaan, keutuhan data, dan
kecepatan pemulihan**.

### 1.1 Lima Jenis Maintenance

| Jenis | Tujuan | Contoh di POS |
|---|---|---|
| **Preventive** | Mencegah masalah sebelum terjadi | Backup rutin, update cache list, uji restore bulanan, review storage |
| **Corrective** | Memperbaiki kerusakan yang terjadi | Fix bug, recovery database corrupt, rollback update gagal |
| **Adaptive** | Menyesuaikan dengan lingkungan baru | Update browser, perubahan versi CDN library, peraturan pajak baru |
| **Perfective** | Meningkatkan kualitas non-bug | Perbaiki performa search, rapikan UX, kurangi technical debt |
| **Security** | Melindungi data & akses | Review auth, perbarui dependency rentan, audit log, backup terenkripsi |

### 1.2 Prinsip Dasar

1. **Data dulu, aplikasi kedua.** Tidak ada perubahan yang boleh mengancam keutuhan data.
2. **Backup sebelum perubahan besar.** Selalu ambil snapshot sebelum update/migrasi.
3. **Verifikasi setelah perubahan.** Setiap prosedur harus diakhiri dengan langkah verifikasi yang terukur.
4. **Dokumentasikan semuanya.** Setiap tindakan maintenance dicatat di Maintenance Log (bagian 20).
5. **Jangan asumsikan.** Konfirmasi ke kode/behavior nyata sebelum mengambil tindakan.
6. **Migrasi wajib untuk perubahan skema.** Dilarang mengubah skema database tanpa migration (`db.js` / `migrations.js`).
7. **Jangan mengubah Business Rules atau API Contract.** Keduanya adalah kontrak yang disepakati (lihat `docs/17_BUSINESS_RULES.md` dan `docs/18_API_CONTRACT.md`).

### 1.3 Flow Maintenance Umum

```
                    ┌───────────────────────────────┐
                    │  Mulai: temukan kondisi tugas │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  1. Identifikasi jenis task   │
                    │  (Preventive/Corrective/…)    │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  2. Backup state saat ini     │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  3. Eksekusi tindakan         │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  4. Uji/verifikasi hasil      │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  5. Catat di Maintenance Log  │
                    └──────────────┬────────────────┘
                                   ▼
                    ┌───────────────────────────────┐
                    │  6. Selesai / perlu follow-up │
                    └───────────────────────────────┘
```

---

## 2. DAILY CHECK

Dilakukan setiap hari operasional oleh **Admin toko** (5–10 menit, saat buka dan tutup toko).

### 2.1 Checklist Saat Buka Toko

| No | Item | Cara Cek | Normal / Abnormal |
|----|------|----------|-------------------|
| 1 | **Aplikasi** | Buka aplikasi di perangkat | App terbuka, tidak blank, tidak ada error console |
| 2 | **Login** | Login dengan akun aktif | Login berhasil, masuk ke Dashboard |
| 3 | **Dashboard** | Lihat halaman utama | Angka/widget tampil, tidak loading terus |
| 4 | **Koneksi data** | Buka halaman Produk | Daftar produk tampil lengkap |
| 5 | **PWA / Service Worker** | DevTools → Application → Service Workers | Status `activated` dan `running`, tanpa error |
| 6 | **Tanggal/waktu** | Lihat jam perangkat | Sesuai waktu lokal hari ini |
| 7 | **Storage** | DevTools → Application → Storage | Kuota normal (tidak > 80%) |

### 2.2 Checklist Saat Tutup Toko

| No | Item | Cara Cek | Normal / Abnormal |
|----|------|----------|-------------------|
| 1 | **Transaksi** | Cek halaman Riwayat Penjualan | Jumlah transaksi hari ini sesuai kas |
| 2 | **Stok** | Cek beberapa produk terlaris | Stok berkurang sesuai penjualan |
| 3 | **Error Log** | DevTools → Console | Tidak ada error yang belum pernah dilihat |
| 4 | **Session** | Pastikan petugas logout / layar terkunci | Tidak ada sesi petugas sebelumnya yang masih aktif |
| 5 | **Backup harian** | Jalankan backup sesuai bagian 6 | File backup terunduh dan valid |

> **Catatan audit:** fitur backup/restore di baseline masih bermasalah (lihat bagian 6.6 dan 7.6).
> Sampai diperbaiki, langkah "Backup harian" dilakukan melalui DevTools → Application → IndexedDB
> (export JSON) sebagai pengganti sementara.

### 2.3 Ringkasan

- **Buka toko:** App OK → Login OK → Dashboard OK → Produk OK → SW OK → Storage OK.
- **Tutup toko:** Riwayat transaksi OK → Stok OK → Error log bersih → Session aman → Backup harian ada.

Jika ada satu item abnormal → ikuti bagan Troubleshooting (bagian 12) atau Incident Response (bagian 15).

---

## 3. WEEKLY CHECK

Dilakukan setiap minggu oleh **Admin/Developer** (30–45 menit).

| No | Item | Metode | Ambang Batas |
|----|------|--------|--------------|
| 1 | **Review Errors** | Console log seluruh flow selama 1 hari | 0 error yang tidak diketahui |
| 2 | **Performance** | Ukur waktu buka app, buka halaman produk, search | App buka < 5 dtk; search < 2 dtk untuk 1000+ produk |
| 3 | **Database Size** | DevTools → Application → IndexedDB → `PosOfflineDB` | Catat ukuran; waspadai pertumbuhan > 20%/minggu |
| 4 | **Storage** | DevTools → Application → Storage | Kuota < 80% |
| 5 | **Backup** | Verifikasi backup harian terbaru ada & bisa dibuka | Backup mingguan terunduh |
| 6 | **Logs** | Cek `console.*` yang menandakan warning berulang | Tidak ada warning berulang yang sama |
| 7 | **Users** | Cek daftar user di halaman Pengaturan | Hanya user aktif; tidak ada akun anonim |
| 8 | **Permissions** | Verifikasi peran (Owner/Admin/Kasir) | Setiap user punya role yang tepat; tidak ada akses berlebih |

### 3.1 Prosedur Singkat

1. Buka aplikasi dengan kredensial admin.
2. Akses Dashboard → catat waktu render.
3. Buka halaman Produk → jalankan pencarian → catat waktu.
4. Cek IndexedDB di DevTools → catat ukuran DB.
5. Jalankan backup (bagian 6) → simpan di lokasi cadangan.
6. Cek Console → saring error/warning baru.
7. Review daftar user & role.
8. Dokumentasikan temuan di Maintenance Log.

---

## 4. MONTHLY CHECK

Dilakukan setiap bulan oleh **Developer/QA** (1–2 jam).

| No | Item | Metode | Hasil yang Diharapkan |
|----|------|--------|-----------------------|
| 1 | **Dependencies** | `npm.cmd outdated` / `npm.cmd audit` | Tidak ada major update yang belum direncanakan; 0 vuln kritis baru |
| 2 | **Security** | Review auth, session, permission (bagian 16) | Tidak ada celah baru yang diketahui |
| 3 | **Database** | Integrity check (bagian 5.5) | Semua tabel konsisten, skema match `docs/02` |
| 4 | **Backup** | Uji backup + restore pada device uji (bagian 7) | Restore berhasil, data lengkap |
| 5 | **Restore Test** | Restore ke browser/device kosong | Semua data kembali identik |
| 6 | **Performance** | Profiling startup, CRUD, transaksi | Tidak ada regresi > 20% dari baseline |
| 7 | **Unused Files** | Scan file src yang tidak di-referensikan | Tidak bertambah dari bulan lalu |
| 8 | **Dead Code** | Scan duplikat/stub (bagian 18) | Tidak bertambah; rencana pembersihan terupdate |
| 9 | **Maintenance Log** | Review seluruh log bulan berjalan | Semua tindakan tercatat & verifikasinya ada |

---

## 5. DATABASE MAINTENANCE

### 5.1 Gambaran Umum

- **Engine:** IndexedDB (native browser).
- **Abstraksi:** Dexie (`src/database/db.js`, `new Dexie('PosOfflineDB')`).
- **Versi skema:** `SCHEMA_VERSION = 2`.
- **Jumlah tabel:** 34 tabel (skema match byte-for-byte dengan `docs/02_DATABASE_SCHEMA.md` & `docs/23`).
- **Seeder:** `DatabaseManager.initialize()` idempotent (5 kategori, 6 unit, 3 supplier, 20 produk, 3 PO + 15 item, 5 sale + 25 item, 13 settings).

### 5.2 Aktivitas Rutin

| Aktivitas | Frekuensi | Tindakan |
|-----------|-----------|----------|
| Pengecekan ukuran DB | Mingguan | Catat ukuran; investigasi jika tumbuh drastis |
| Integrity check | Bulanan | Baca semua tabel, cek jumlah record, cek referensi |
| Cleanup data | Bulanan | Hapus audit/sale lama sesuai kebijakan retensi (bagian 6.5) |
| Verifikasi skema | Bulanan | Bandingkan dengan `docs/02_DATABASE_SCHEMA.md` |
| Backup | Harian/Mingguan | Sesuai strategi backup (bagian 6) |
| Uji restore | Bulanan | Restore ke device uji (bagian 7) |

### 5.3 Database Version & Migration

- Bila skema berubah (tabel/indeks baru), **wajib** menaikkan `SCHEMA_VERSION` dan menambahkan
  migration `.upgrade()`.
- Aturan: **dilarang mengubah skema tanpa migration.** User lama harus tetap bisa membuka data.
- Urutan perubahan skema yang benar:

```
1. Tulis migration baru (Versi N+1)
2. Uji di device uji: upgrade dari Versi N, data lama utuh
3. Uji fresh install: Versi N+1 langsung benar
4. Update dokumentasi skema (docs/02, docs/23)
5. Bump versi aplikasi + changelog
```

> **Diketahui bermasalah (baseline):** `src/database/migrations.js` saat audit hanyalah stub —
> hanya `console.log`, **tanpa** `.upgrade()` yang benar. Konsekuensi: perubahan `SCHEMA_VERSION`
> di masa depan berisiko tidak termigrasi. Perbaiki ini sebelum melakukan perubahan skema pertama.

### 5.4 Integrity Check (Prosedur)

```
┌─────────────────────────┐
│ 1. Tutup aplikasi lain  │  yang memakai DB
├─────────────────────────┤
│ 2. Catat jumlah record  │  per tabel (baseline)
├─────────────────────────┤
│ 3. Cek referensi        │  mis. sale_items → sales, po_items → purchase_orders
├─────────────────────────┤
│ 4. Cek orphan record    │  record tanpa parent
├─────────────────────────┤
│ 5. Cek deletedAt        │  soft-deleted tidak boleh ikut dihitung stok/laporan
├─────────────────────────┤
│ 6. Bandingkan baseline  │  jumlah record tidak boleh kurang tanpa sebab
└─────────────────────────┘
```

### 5.5 Storage Usage

- Buka DevTools → Application → Storage untuk melihat pemakaian per origin.
- Ambang batas: waspadai jika melebihi **80% kuota** browser/device.
- Jika penuh: (a) backup dulu, (b) hapus data audit/riwayat lama sesuai retensi, (c) compact jika
  browser mendukung, (d) jika tetap penuh, evaluasi pemindahan ke device dengan storage lebih besar.

### 5.6 Cleanup

- Hapus data lama hanya melalui **prosedur aplikasi** (jika ada) atau query Dexie yang terkontrol —
  jangan hapus langsung dari panel IndexedDB browser tanpa backup.
- Selalu backup penuh sebelum cleanup.
- Perhatikan tabel-tabel yang tumbuh: `audit_logs`, `sales`, `sale_items`, `inventories` (jika sudah
  terimplementasi).

> **Catatan audit:** banyak tabel (18+) belum memiliki writer/penghuni data (orphan tabel). Ini
> bukan bug, tapi indikasi modul yang belum terimplementasi. Lihat `docs/BASELINE_AUDIT_REPORT.md`.

---

## 6. BACKUP STRATEGY

### 6.1 Apa yang Harus Di-Backup

| Data | Tabel Terkait | Prioritas |
|------|---------------|-----------|
| Master Data | `categories`, `units`, `suppliers`, `products` | Tinggi |
| Transaksi | `sales`, `sale_items`, `purchase_orders`, `po_items`, `returns` (bila ada) | Tinggi |
| User | `users` | Tinggi |
| Settings | `settings` | Tinggi |
| Audit Log | `audit_logs` | Sedang |
| Seluruh DB | Semua 34 tabel | Tinggi (backup penuh) |

### 6.2 Jenis Backup

| Jenis | Isi | Frekuensi | Tujuan |
|-------|-----|-----------|--------|
| **Daily Backup** | Seluruh DB (export JSON/Dexie) | Setiap tutup toko | Pemulihan cepat 1 hari |
| **Weekly Backup** | Seluruh DB | Setiap akhir minggu | Cadangan jangka menengah |
| **Monthly Backup** | Seluruh DB + catatan konfigurasi | Setiap akhir bulan | Arsip jangka panjang |

### 6.3 Prosedur Backup Normal

```
┌───────────────────────────────────────┐
│ 1. Pastikan tidak ada transaksi aktif │
├───────────────────────────────────────┤
│ 2. Buka menu Backup (modul backup)    │
├───────────────────────────────────────┤
│ 3. Pilih "Export / Backup Database"   │
├───────────────────────────────────────┤
│ 4. File JSON/backup terunduh           │
├───────────────────────────────────────┤
│ 5. Simpan di 2 lokasi berbeda          │  (device cadangan + cloud)
├───────────────────────────────────────┤
│ 6. Verifikasi: buka file, cek isinya   │
├───────────────────────────────────────┤
│ 7. Catat di Maintenance Log            │
└───────────────────────────────────────┘
```

### 6.4 Aturan Backup

1. **Backup dilakukan saat aplikasi tidak dipakai** (malam/hari tutup) untuk menghindari race.
2. Simpan di **minimal 2 lokasi**: satu di device lain / penyimpanan eksternal, satu di cloud.
3. Nama file backup wajib memuat tanggal & versi: `pos-backup-YYYY-MM-DD-v1.0.json`.
4. Backup tidak boleh disimpan hanya di dalam IndexedDB yang sama.
5. Sebelum update/migrasi besar, **selalu** ambil backup tambahan.

### 6.5 Retention Policy

| Jenis | Simpan Minimal | Catatan |
|-------|----------------|---------|
| Daily | 7 hari | Setelah 7 hari, boleh tumpuk dengan weekly |
| Weekly | 4 minggu | Setelah 4 minggu, boleh tumpuk dengan monthly |
| Monthly | 12 bulan | Arsip tahunan disimpan selamanya (sesuai kebutuhan bisnis) |
| Pra-update | Sampai versi stabil 1 bulan | Backup pra-migrasi disimpan sampai rollback window lewat |

### 6.6 Status Nyata Fitur Backup (Diketahui Bermasalah)

> **P0 — Backup/restore tidak berfungsi di baseline.** Tabel `tables` (cafe) bertabrakan dengan
> properti bawaan Dexie `db.tables` (array). Akibatnya `db[table.name].toArray()` di
> `src/database/backup.js:17` dan `db[table.name].clear()` di `src/database/restore.js:75`
> melempar `TypeError: ... is not a function`. Backup/export **tidak pernah berhasil** selama ini.
> - **Tindakan sementara:** backup manual via DevTools → Application → IndexedDB → `PosOfflineDB`
>   → export per tabel sebagai JSON.
> - **Perbaikan permanen:** ganti akses `db[name]` dengan `db.table(name)` (Dexie API), lalu uji
>   backup+restore penuh. Detail: finding F-01/F-02 di `docs/BASELINE_AUDIT_REPORT.md`.

---

## 7. RESTORE PROCEDURE

### 7.1 Prosedur Lengkap

```
┌──────────────────────────────┐
│ 1. DETEKSI MASALAH          │
│    - Data hilang / korup     │
│    - Aplikasi error DB       │
├──────────────────────────────┤
│ 2. STOP TRANSAKSI           │
│    - Hentikan operasional   │
│    - Jangan tutup browser   │
├──────────────────────────────┤
│ 3. BACKUP STATE SAAT INI    │
│    - Export DB kondisi      │
│      rusak (untuk forensik) │
├──────────────────────────────┤
│ 4. RESTORE                 │
│    - Buka menu Restore      │
│    - Pilih file backup      │
├──────────────────────────────┤
│ 5. VERIFIKASI               │
│    - Cek jumlah record      │
│    - Cek tanggal terakhir   │
├──────────────────────────────┤
│ 6. TEST                    │
│    - Login, cek produk,     │
│      cek riwayat transaksi  │
├──────────────────────────────┤
│ 7. RESUME OPERASIONAL      │
│    - Catat di log          │
└──────────────────────────────┘
```

### 7.2 Checklist Verifikasi Setelah Restore

| No | Verifikasi | Metode |
|----|------------|--------|
| 1 | Total record per tabel | Bandingkan dengan catatan baseline |
| 2 | Produk terbaru ada | Cari produk yang baru ditambahkan sebelum backup |
| 3 | Transaksi terakhir ada | Riwayat penjualan menampilkan transaksi terakhir yang valid |
| 4 | Settings kembali | Konfigurasi toko, pajak, struk sesuai |
| 5 | User & role | User login berhasil dengan role yang benar |
| 6 | Tidak ada duplicate | Tidak ada primary key error saat buka app |

### 7.3 Restore ke Device Baru

1. Pastikan device baru sudah online saat **instal pertama** (agar PWA terpasang).
2. Buka aplikasi → biarkan DB seed dibuat (default).
3. Buka menu Restore → pilih file backup → konfirmasi overwrite.
4. Tutup & buka kembali aplikasi → verifikasi sesuai checklist 7.2.

### 7.4 Restore Sebagian (Tidak Disarankan)

- Restore **seluruh DB** lebih aman daripada restore per tabel. Restore per tabel berisiko
  referensi antar tabel tidak konsisten (misal `sale_items` tanpa `sales`).
- Jika terpaksa per tabel, ikuti urutan: tabel master → transaksi → anak transaksi.

### 7.5 Uji Restore Berkala

- **Bulanan:** restore ke device/browser uji dari backup mingguan. Ini membuktikan bahwa file
  backup benar-benar dapat digunakan.

### 7.6 Status Nyata Fitur Restore (Diketahui Bermasalah)

> **P0 — sama dengan backup (bagian 6.6).** `restore.js:75` `db[table.name].clear()` rusak karena
> tabrakan nama `tables`. Restore tidak dapat dijalankan sampai diperbaiki. Sampai saat itu, semua
> langkah di bagian 7 adalah **prosedur target**; praktik saat ini memakai export/import JSON manual
> via DevTools.

---

## 8. SERVICE WORKER MAINTENANCE

### 8.1 Fakta Baseline

- File: `service-worker.js`, di-register oleh `src/pwa/pwa-config.js`.
- `CACHE_VERSION = 'v4'` (cache storage dipisah dengan prefix versi).
- 3 cache storage yang dikelola.
- Daftar precache asset (APP_ASSETS, 57 item) diduplikasi antara `service-worker.js` dan
  `pwa-config.js`.

### 8.2 Aktivitas

| Aktivitas | Frekuensi | Tindakan |
|-----------|-----------|----------|
| Cek status SW | Harian | DevTools → Application → Service Workers = `activated & running` |
| Bump cache version | Setiap rilis yang ubah asset | Naikkan `CACHE_VERSION`, update APP_ASSETS |
| Cleanup cache lama | Otomatis saat aktivasi SW baru | SW menghapus cache prefix versi lama |
| Force refresh | Saat user melihat versi lama | `Ctrl+Shift+R` atau tombol refresh paksa di DevTools |
| Recovery | Saat app tidak update | Unregister SW + clear storage, lalu reload (bagian 8.4) |

### 8.3 Prosedur Update Asset / Cache

```
1. Update file asset (JS/CSS/HTML)
2. Buka service-worker.js → naikkan CACHE_VERSION (mis. v4 → v5)
3. Update APP_ASSETS dengan daftar file terbaru
4. Sinkronkan daftar di pwa-config.js (jangan sampai beda)
5. Deploy
6. Buka app pada 2 tab: tab pertama memuat versi baru, tab kedua (tutup) agar SW aktif
7. Verifikasi di DevTools: SW activated, cache versi baru terisi, cache lama terhapus
```

> **Catatan audit:** APP_ASSETS di baseline **basi** — berisi 57 file lama, sedangkan halaman/modul
> baru tidak terdaftar. Setiap rilis yang menambah file WAJIB memperbarui daftar ini, jika tidak
> file baru tidak tersedia offline.

### 8.4 Prosedur Recovery (App Tidak Update / Error)

```
┌─────────────────────────────────────────┐
│ 1. Coba force refresh (Ctrl+Shift+R)    │
├─────────────────────────────────────────┤
│ 2. DevTools → Application → SW →        │
│    "Update" lalu "Unregister"           │
├─────────────────────────────────────────┤
│ 3. DevTools → Application → Storage →   │
│    "Clear site data"                    │
│    ⚠️ Minta konfirmasi: menghapus       │
│    seluruh data termasuk IndexedDB.     │
│    Pastikan backup aman dulu.           │
├─────────────────────────────────────────┤
│ 4. Reload halaman → SW baru terpasang   │
├─────────────────────────────────────────┤
│ 5. Restore data dari backup jika perlu  │
└─────────────────────────────────────────┘
```

> ⚠️ **Peringatan:** "Clear site data" menghapus IndexedDB. Lakukan **hanya** setelah backup penuh
> berhasil dibuat.

---

## 9. PWA MAINTENANCE

### 9.1 Fakta Baseline

- Manifest: `manifest.webmanifest`, `start_url: "/"`, 10 ikon valid.
- Register SW: `src/pwa/pwa-config.js`.
- Aplikasi adalah SPA tanpa build step, dipasang sebagai PWA di device kasir.

### 9.2 Checklist

| Item | Cara Cek | Frekuensi |
|------|----------|-----------|
| **Manifest** | DevTools → Application → Manifest; tidak ada error "installability" | Bulanan |
| **Icons** | Semua ikon yang direferensikan manifest tersedia & ukuran sesuai | Bulanan |
| **Offline** | Uji: aktifkan "Offline" di DevTools → app tetap bisa dibuka & data tersedia | Bulanan |
| **Install** | Pastikan tombol "Install" muncul / prompt install works | Per rilis |
| **Update** | Bump `CACHE_VERSION` saat rilis baru; user dapat versi baru | Per rilis |
| **Uninstall** | Prosedur pemasangan ulang bersih | Sesuai kebutuhan |
| **Reinstall** | Uninstall → install ulang → restore data | Sesuai kebutuhan |

### 9.3 Prosedur Update PWA di Perangkat

1. Buka aplikasi → versi baru terdeteksi → SW baru menunggu.
2. Tutup **semua tab** aplikasi (untuk mengaktivasi SW baru).
3. Buka kembali aplikasi → versi baru aktif.
4. Jika masih versi lama → ikuti Recovery (bagian 8.4) **setelah backup**.

### 9.4 Uninstall / Reinstall Bersih

```
1. Backup penuh dulu (bagian 6)
2. Uninstall PWA dari perangkat (chrome://apps / menu browser)
3. (Opsional) clear site data
4. Install ulang dari URL (butuh koneksi sekali untuk install)
5. Buka app → restore backup
6. Verifikasi sesuai checklist 7.2
```

---

## 10. PERFORMANCE MONITORING

### 10.1 Metrik & Ambang Batas

| Area | Metode Ukur | Ambang Normal |
|------|-------------|---------------|
| **Startup** | Waktu dari klik ikon sampai Dashboard tampil | < 5 detik |
| **Dashboard** | Waktu render widget | < 3 detik |
| **Search** | Pencarian produk (in-memory `toArray()`) | < 2 detik untuk 1000+ produk |
| **CRUD** | Tambah/ubah/hapus produk | < 1 detik per operasi |
| **Transaction** | Simpan transaksi penjualan | < 2 detik |
| **Database** | Baca/query IndexedDB | Query < 100 ms |
| **Memory** | DevTools → Performance/Memory | Tidak membengkak terus; stabil dalam sesi |
| **CPU** | Task Manager browser | Tidak 100% terus-menerus saat idle |
| **Storage** | DevTools → Application → Storage | < 80% kuota |

> **Catatan audit:** pencarian produk di baseline diimplementasikan in-memory (seluruh tabel
> `products` dibaca lalu difilter). Pada katalog sangat besar, ini berpotensi lambat — pantau.

### 10.2 Prosedur Profiling Saat Ada Keluhan

```
┌───────────────────────────────────┐
│ 1. Rekam: DevTools → Performance  │
├───────────────────────────────────┤
│ 2. Ulangi aksi yang lambat        │
├───────────────────────────────────┤
│ 3. Identifikasi script/query      │
│    terberat (di panel Summary)    │
├───────────────────────────────────┤
│ 4. Bandingkan dengan ambang batas │
├───────────────────────────────────┤
│ 5. Catat & buat perbaikan         │
│    (perfective maintenance)       │
└───────────────────────────────────┘
```

---

## 11. ERROR MONITORING

### 11.1 Kategori Error

| Kategori | Contoh Pesan | Sumber |
|----------|--------------|--------|
| **JavaScript** | `TypeError`, `ReferenceError`, `Uncaught` | `src/**/*.js` |
| **Database** | `ConstraintError`, `QuotaExceededError`, `NotFoundError` | IndexedDB/Dexie |
| **Authentication** | Login gagal, session expired | `src/auth/*`, `src/services/auth-service.js` |
| **Router** | Route tidak dikenal, hash invalid | `src/router/router.js` |
| **PWA** | SW activation gagal, cache error | `service-worker.js`, `src/pwa/*` |
| **Import** | Error parsing XLSX, file tidak valid | modul import (mis. `src/modules/import/*`) |
| **Export** | Error generate XLSX/PDF, download diblokir | modul export |
| **Sync** | (Jika ada) sinkronisasi antar device | — |
| **UI** | Elemen tidak render, event tidak jalan | `src/components/*`, `src/pages/*` |

### 11.2 Cara Memantau

1. **Console (harian):** buka DevTools → Console, filter error. Catat error baru.
2. **Network (saat keluhan):** pastikan tidak ada request CDN gagal (bootstrap, dexie, dsb).
3. **Application (PWA):** pastikan SW `activated & running`.
4. **Performance (saat lambat):** catat waktu per halaman (bagian 10).

> **Catatan audit:** terdapat 66 pemanggilan `console.*` di source; mayoritas (62) adalah bypass
> langsung (bukan via logger service). Ini berguna untuk debugging, tetapi wajar disaring ke level
> `error` saat production monitoring agar tidak banjir noise.

### 11.3 Format Catatan Error

```
[Tanggal] [Kategori] [Halaman/Modul] [Pesan] [Frekuensi] [Aksi]
```

---

## 12. TROUBLESHOOTING

### 12.1 Tabel Masalah → Penyebab → Solusi

| No | Problem | Possible Cause | Diagnostic | Solution | Verification |
|----|---------|----------------|------------|----------|--------------|
| 1 | **Blank page** (app tidak tampil sama sekali) | Error saat load JS module; file hilang; SW menyajikan cache rusak; 404 asset | DevTools → Console & Network; cek kode status asset | Perbaiki error module; reload setelah clear cache; verifikasi APP_ASSETS | App render normal |
| 2 | **Dashboard blank** (halaman lain OK) | Error render di `dashboard-page.js`; data kosong; Chart.js gagal | Console error spesifik Dashboard; cek data tabel `sales` | Perbaiki render/query; pastikan seed jalan | Dashboard menampilkan widget |
| 3 | **Login bypass** (akses halaman tanpa login) | Route guard tidak cek role; user buka URL hash langsung | Buka `#/pengaturan` tanpa login; cek `router.js` guard | Enforce login+role di route guard (bagian 16.4) | Akses tanpa login diarahkan ke login |
| 4 | **404 halaman tidak ditemukan** | Hash route tidak terdaftar di `router.js`; salah nama route | Cek hash di URL vs daftar route | Tambah/daftarkan route atau perbaiki link | Route tampil sesuai daftar |
| 5 | **Import XLSX error** | File bukan .xlsx; format kolom salah; parsing library error; sheet kosong | Console error import; buka file dengan sheet viewer | Validasi format; cek kolom sesuai `docs/18_API_CONTRACT.md`; perbaiki file | Import sukses, data masuk |
| 6 | **IndexedDB error** (`QuotaExceededError`) | Storage penuh; data audit/riwayat menumpuk | DevTools → Storage; cek ukuran `PosOfflineDB` | Backup → cleanup data lama → compact (bagian 5.6) | Tidak ada error quota |
| 7 | **IndexedDB version error** (`VersionError`) | `SCHEMA_VERSION` naik tanpa migration; DB korup | Console; cek `db.js` & `migrations.js` | Tambah `.upgrade()` benar; atau restore backup | App buka normal |
| 8 | **Service Worker error** | SW file rusak; precache asset 404; `CACHE_VERSION` tidak dinaikkan | DevTools → Application → SW; cek setiap item APP_ASSETS | Perbaiki daftar precache; naikkan versi (bagian 8.3) | SW `activated & running` |
| 9 | **Cache lama** (app versi lama walau sudah deploy) | `CACHE_VERSION` sama; SW menunggu; tab lama terbuka | DevTools → Application → SW versi saat ini | Bump versi; tutup semua tab; reload (bagian 8.3) | Versi baru tampil |
| 10 | **Route error** (navigasi tidak berubah / error) | Hash tidak terdaftar; router ganda; event handler rusak | Console; cek `location.hash` | Daftarkan route; perbaiki handler; hapus router duplikat | Navigasi mengikuti hash |
| 11 | **Permission error** (halaman tampil tapi akses tak seharusnya) | Role tidak dicek di route; ROLE_PERMISSIONS salah | Bandingkan role user vs ROLE_PERMISSIONS | Enforce permission; perbaiki ROLE_PERMISSIONS (bagian 16.4) | Akses dibatasi per role |
| 12 | **Session error** (tiba-tiba logout / login tidak tahan) | Session expire 24 jam; deviceId berubah; session key korup | Cek localStorage session; cek `sessionStorage`/auth service | Login ulang; periksa deviceId; verifikasi session service | Sesi bertahan normal |
| 13 | **Export error** (XLSX/PDF gagal unduh) | Library CDN tidak ter-load; blob URL error; pop-up diblokir | Console; cek Network CDN jsPDF/XLSX | Reload CDN; izinkan download; perbaiki blok kode export | File terunduh valid |
| 14 | **PWA install error** (tombol install tidak muncul) | Manifest invalid; ikon kurang; SW tidak aktif; HTTPS/localhost tidak | DevTools → Application → Manifest & SW | Perbaiki manifest/ikon; pastikan SW active (bagian 9) | Prompt install muncul |
| 15 | **Backup gagal** (export tidak terunduh) | **Bug P0 `db.tables` collision** (backup.js:17) | Jalankan export; lihat Console `TypeError` | Perbaiki ke `db.table(name)`; sementara pakai export manual | Backup terunduh valid |
| 16 | **Restore gagal** (data tidak kembali) | **Bug P0 `db.tables` collision** (restore.js:75); file backup rusak | Jalankan restore; lihat Console | Perbaiki; sementara restore manual (bagian 7.6) | Data kembali lengkap |
| 17 | **Login valid tapi ditolak** | Hash password tidak cocok (SHA-256 + salt beda); user deleted | Cek hash di `users` vs perhitungan auth | Reset password; periksa algoritma hash (bagian 16.3) | Login berhasil |
| 18 | **Password/PIN lupa** | User lupa; PIN disimpan plaintext (kelemahan baseline) | Hubungi Owner | Reset via prosedur admin; **rencanakan migrasi hash+salt** | User login kembali |
| 19 | **Stok tidak sesuai transaksi** | `inventories` belum ditulis (modul inventory stub); stok hanya di `products.stock` | Bandingkan stok vs sale_items | Implementasi modul inventory; verifikasi aturan stok | Stok konsisten |
| 20 | **Search lambat** | Search in-memory `toArray()` pada katalog besar | Ukur waktu; hitung jumlah produk | Tambah indeks/query terfilter; pertimbangkan paging | Search cepat |
| 21 | **Halaman POS kosong** | Modul POS belum diimplementasikan ("Coming Soon") | Buka `#/pos`; lihat isi `pos-page.js` | Ini **bukan bug** — fitur belum ada; scope ke roadmap | Sesuai rencana rilis |
| 22 | **Chart tidak tampil** | Chart.js CDN gagal load; data kosong; `canvas` tidak ada | Console; Network CDN chart.js | Load ulang CDN; pastikan data; perbaiki render | Chart tampil |
| 23 | **Ikon Bootstrap tidak tampil** | Bootstrap Icons CDN gagal; kelas ikon salah | Network CDN bootstrap-icons | Reload CDN; cek nama ikon | Ikon tampil |
| 24 | **Offline tidak jalan** (app tidak terbuka saat offline) | PWA belum diinstal; precache basi; SW gagal | Uji dengan "Offline" di DevTools | Install PWA; perbaiki APP_ASSETS; aktivasi SW | App jalan offline |
| 25 | **Data hilang setelah refresh** | Data tidak di-persist; salah DB instance; localStorage cleared | Buka app setelah refresh; cek IndexedDB | Pastikan operasi tulis ke Dexie sukses; jangan gunakan hanya memory | Data tetap ada |
| 26 | **Duplicate record / ConstraintError** | PK ganda; seeder tidak idempotent | Cek Console `ConstraintError` | Pastikan seed idempotent; jangan insert manual | Tidak ada error |
| 27 | **Migrasi tidak jalan** | `migrations.js` adalah stub (tanpa `.upgrade()`) | Buka file; cek apakah `SCHEMA_VERSION` naik | Implementasi migration nyata sebelum skema berubah | Upgrade & data utuh |
| 28 | **Audit log kosong** | Belum ada audit writer (tabel selalu kosong) | Buka `audit_logs` di IndexedDB | Ini gap baseline; implementasi writer per modul | Audit tercatat |
| 29 | **Screen lock tidak aktif** | `isScreenLocked()` hardcoded `false` | Cek fungsi auth | Ini gap baseline; implementasi screen lock nyata | Layar terkunci |
| 30 | **Session tidak expire** | Timer/expiry tidak diterapkan (maxLoginAttempts 5 tidak dipakai) | Cek auth service | Terapkan kebijakan lockout & expiry (bagian 16) | Sesuai kebijakan |
| 31 | **Download diblokir browser** | Pop-up/prompt download diblokir; PWA fullscreen | Cek notification area browser | Izinkan download; gunakan anchor + `download` attr | File terunduh |
| 32 | **Aplikasi freeze / lambat saat transaksi besar** | Query besar tanpa indeks; render ulang berlebihan | Profiling Performance (bagian 10.2) | Optimalkan query; batasi render | Interaksi lancar |
| 33 | **Ganda instance browser / konflik multi-tab** | Dua tab membuka app bersamaan tulis data | Tutup tab lain; konsisten gunakan 1 tab kasir | Biasakan 1 tab; dokumentasikan di SOP toko | Tidak ada konflik data |
| 34 | **Laporan tanggal salah** | Zona waktu perangkat tidak sesuai | Cek pengaturan tanggal browser/device | Atur zona waktu perangkat ke lokal | Laporan benar |

### 12.2 Bagan Keputusan Umum

```
Error muncul?
├── App tidak tampil / blank ──→ lihat baris 1, 8, 9
├── Halaman tertentu blank ────→ lihat baris 2, 21, 22
├── Data bermasalah ───────────→ lihat baris 6, 19, 25, 26
├── Backup/Restore gagal ──────→ lihat baris 15, 16
├── Login/Session bermasalah ──→ lihat baris 3, 12, 17, 18, 29, 30
├── Import/Export gagal ───────→ lihat baris 5, 13
├── Versi lama tampil ─────────→ lihat baris 8, 9
└── Semua terselesaikan? ──────→ catat di Maintenance Log
```

---

## 13. UPDATE PROCEDURE

### 13.1 Sebelum Update

| Langkah | Detail |
|---------|--------|
| **Backup** | Ambil backup penuh (bagian 6). Simpan di 2 lokasi. |
| **Test** | Uji versi baru di device/browser uji terlebih dahulu, bukan langsung di device produksi. |
| **Version Check** | Tentukan versi baru; catat perubahan di changelog. |
| **Database Migration Check** | Cek apakah `SCHEMA_VERSION` berubah. Jika ya: pastikan migration nyata sudah ada (bukan stub) dan sudah diuji upgrade. |
| **Rollback Plan** | Siapkan prosedur rollback (bagian 14) sebelum mulai update. |

### 13.2 Sesudah Update

| Langkah | Detail |
|---------|--------|
| **Smoke Test** | Buka app → login → dashboard → produk → transaksi → backup. Semua normal. |
| **Regression Test** | Uji modul yang terdampak + modul inti (auth, session, product, sales). |
| **Data Verification** | Bandingkan jumlah record & sample data sebelum/sesudah update. |

### 13.3 Checklist Mini Update

- [ ] Backup penuh tersedia
- [ ] Versi baru sudah diuji di device uji
- [ ] Changelog & versi diupdate
- [ ] Migration (jika ada) sudah diuji upgrade & fresh install
- [ ] Rollback plan siap
- [ ] Smoke test lulus
- [ ] Regression test lulus
- [ ] Data verification lulus
- [ ] SW `CACHE_VERSION` dinaikkan & APP_ASSETS diupdate
- [ ] Maintenance Log diisi

---

## 14. ROLLBACK

### 14.1 Kapan Rollback Diperlukan

Update gagal di smoke/regression, data hilang setelah update, migration error, atau regresi kritis.

### 14.2 Prosedur Rollback

| Layer | Prosedur |
|-------|----------|
| **Application** | Kembalikan file ke versi sebelumnya (pakai backup versi sebelumnya / git jika tersedia). Reload browser. |
| **Database** | Jika migration sudah jalan & bermasalah: restore dari backup pra-update (bagian 7). Jangan hanya turunkan `SCHEMA_VERSION` tanpa migration balik. |
| **Service Worker** | Naikkan `CACHE_VERSION` dengan daftar asset versi lama, atau unregister SW + clear cache (bagian 8.4). |
| **Configuration** | Kembalikan `manifest.webmanifest`, konfigurasi, dan settings ke versi lama. |

### 14.3 Aturan Rollback

1. Rollback **selalu** didahului backup kondisi saat ini (untuk forensik).
2. DB rollback = restore, bukan sekadar mengubah versi skema.
3. Setelah rollback: smoke test penuh + data verification.
4. Dokumentasikan penyebab & keputusan di Maintenance Log.

```
Update gagal?
│
├── Masalah di app/code ──────────► Rollback Application
├── Masalah di data/migration ────► Restore DB dari backup pra-update
├── Masalah cache/versi tampil ───► Bump CACHE_VERSION / unregister SW
└── Selesai → Smoke Test → Log
```

---

## 15. INCIDENT RESPONSE

### 15.1 Severity

| Severity | Definisi | Contoh | Target Respon |
|----------|----------|--------|---------------|
| **P0 Critical** | Data hilang / operasional toko terhenti total | DB korup, app blank permanen, backup rusak | Segera (jam) |
| **P1 High** | Fitur inti terganggu, ada workaround | Login gagal, transaksi error, export gagal | Hari yang sama |
| **P2 Medium** | Fitur non-kritis terganggu | Laporan lama, kosmetik, slow | < 1 minggu |
| **P3 Low** | Kosmetik / peningkatan | Typo, minor UI | Sesuai jadwal rilis |

### 15.2 Prosedur Incident (7 Langkah)

```
┌───────────────────────────────┐
│ 1. DETEKSI                   │
│    - Dilaporkan user/kasir    │
│    - Ditemukan saat daily check│
├───────────────────────────────┤
│ 2. CONTAIN (tahan kerusakan) │
│    - Stop operasional yang    │
│      terdampak                │
│    - Jangan tutup browser     │
│      (hindari kehilangan data)│
├───────────────────────────────┤
│ 3. INVESTIGATE               │
│    - Reproduksi masalah       │
│    - Kumpulkan console/error  │
├───────────────────────────────┤
│ 4. FIX                       │
│    - Perbaiki / workaround    │
│    - Sesuai severity          │
├───────────────────────────────┤
│ 5. VERIFY                    │
│    - Uji perbaikan            │
│    - Pastikan data aman       │
├───────────────────────────────┤
│ 6. DOCUMENT                  │
│    - Catat di Maintenance Log │
├───────────────────────────────┤
│ 7. PREVENT                   │
│    - Root cause → preventive  │
│    - Tambah checklist/bagian  │
└───────────────────────────────┘
```

### 15.3 Contoh Matriks Incident

| Incident | Severity | Respon Pertama | Rujukan |
|----------|----------|----------------|---------|
| Backup tidak pernah berhasil | P0 | Dokumentasikan; gunakan export manual | Bagian 6.6, 12 baris 15 |
| Restore tidak pernah berhasil | P0 | Dokumentasikan; restore manual | Bagian 7.6, 12 baris 16 |
| Blank page di device kasir | P0 | Recovery SW (8.4) setelah backup | Bagian 8.4, 12 baris 1 |
| Login gagal massal | P1 | Cek hash/auth; reset password | Bagian 16, 12 baris 17 |
| Import XLSX gagal | P1/P2 | Validasi file; cek format | Bagian 12 baris 5 |
| Chart tidak tampil | P2 | Cek CDN chart.js | Bagian 12 baris 22 |
| Search lambat | P2 | Profiling; optimasi query | Bagian 10, 12 baris 20 |

---

## 16. SECURITY MAINTENANCE

### 16.1 Checklist Review Keamanan (Bulanan)

| No | Area | Tinjauan |
|----|------|----------|
| 1 | **Authentication** | Algoritma hash; default credentials; lockout policy |
| 2 | **Authorization** | Route guard cek role? ROLE_PERMISSIONS benar? |
| 3 | **Session** | Masa berlaku 24 jam / 30 hari; deviceId binding; screen lock |
| 4 | **Password** | Kebijakan password; reset procedure; **P1: hash tanpa salt + PIN plaintext** |
| 5 | **Permission** | Hanya Owner/Admin yang akses pengaturan; Kasir terbatas |
| 6 | **Audit Log** | Apakah aksi sensitif tercatat? (saat ini writer belum ada) |
| 7 | **Dependencies** | `npm.cmd audit`; versi CDN cocok dengan package.json; vuln xlsx |
| 8 | **Backup** | Backup terenkripsi/terlindungi; lokasi simpan aman |

### 16.2 Fakta Keamanan Baseline (Wajib Diketahui)

> Temuan dari audit baseline yang perlu dipertimbangkan saat maintenance:
> - **SHA-256 tanpa salt** untuk hash password (`src/utils/hash-utils.js:1-8`, duplikat di
>   `user-service.js:79-86`) dan **PIN tersimpan plaintext** — P1. Rencana perbaikan: PBKDF2/salt.
> - **Route guard hanya cek login, bukan role** — halaman pengaturan bisa dibuka via URL oleh role
>   mana pun (F-03). Rencana perbaikan: enforce permission per route.
> - **`isScreenLocked()` hardcoded `false`** — screen lock belum aktif nyata.
> - **`maxLoginAttempts: 5`** ada di config tapi tidak diterapkan — tidak ada lockout percobaan gagal.
> - **xlsx 0.18.5** punya CVE (CVE-2023-30533, CVE-2024-22363) — prioritaskan upgrade saat modul
>   import/export sudah stabil.

### 16.3 Panduan Perbaikan Keamanan (Saat Maintenance)

```
1. Implementasi hash dengan salt (PBKDF2) + migrasi hash lama
2. Enforce role di route guard
3. Implementasi lockout & expiry yang benar
4. Implementasi screen lock nyata
5. Implementasi audit writer
6. Upgrade xlsx ke versi patched
7. Verifikasi CDN & package.json versi konsisten
```

### 16.4 Prosedur Review RBAC

1. Ambil daftar route dari `src/router/router.js`.
2. Ambil daftar permission dari ROLE_PERMISSIONS (3 role: Owner, Admin, Kasir).
3. Uji manual: login sebagai Kasir → coba akses `#/pengaturan`, `#/users`, `#/backup`.
4. Pastikan akses ditolak/di-blok untuk role yang tidak berhak.
5. Catat hasil di Maintenance Log.

---

## 17. DEPENDENCY MAINTENANCE

### 17.1 Peta Dependency Nyata (Berdasarkan Audit)

> Penting: **jangan mengasumsikan dependency.** Berikut adalah fakta dari `package.json` dan cara
> pemakaian nyata (CDN di `index.html` vs node_modules). Runtime app memakai **CDN**, sedangkan
> package.json dipakai untuk instalasi/tooling.

| Library | package.json | CDN (index.html) | Status Pemakaian |
|---------|--------------|------------------|------------------|
| Bootstrap (CSS) | ^5.3.7 | 5.3.3 | Dipakai (CSS), JS **tidak** dipakai (Topbar memakai dropdown manual) |
| Bootstrap Icons | ^1.13.1 | 1.11.3 | Dipakai |
| Dexie | ^4.2.0 | 4.0.10 | Dipakai (database) |
| Chart.js | ^4.5.0 | 4.4.7 | Dimuat tapi **tidak pernah dipakai** di baseline |
| SheetJS (xlsx) | ^0.18.5 | 0.18.5 | Dipakai (import/export) — **CVE aktif, prioritaskan upgrade** |
| jsPDF | ^3.0.3 | 2.5.2 | Dipakai (export PDF) |

> Catatan: `npm ls --depth=0` bersih; 6 dependency terpasang tapi tidak dipakai dari node_modules
> karena runtime memakai CDN. **Jangan menambahkan dependency baru tanpa verifikasi pemakaian nyata.**

### 17.2 Prosedur Update Dependency

```
1. Identifikasi library yang benar-benar dipakai (tabel 17.1)
2. Cek versi terbaru yang kompatibel (hindari major yang rusak tanpa uji)
3. Uji di device uji: import/export, chart, db, UI
4. Sinkronkan CDN di index.html DAN package.json
5. Uji offline (SW precache) setelah update CDN
6. Update changelog
```

### 17.3 Aturan

- **Node & NPM:** gunakan versi LTS; perbarui bila diperlukan oleh tooling, bukan sembarangan.
- **Jangan menambahkan dependency** yang tidak benar-benar dibutuhkan (aplikasi ini tanpa build step).
- **Update library rentan** (xlsx) setelah uji regresi import/export.
- Setiap update library harus diikuti **smoke test offline** karena CDN di-precache oleh SW.

---

## 18. DEAD CODE & TECHNICAL DEBT

### 18.1 Fakta Baseline

- 46 file stub (~25% dari 187 file source) — modul yang belum diimplementasi.
- 40 komentar TODO.
- 66 pemanggilan `console.*` (62 bypass logger).
- Router ganda: `src/router/router.js` aktif; `src/router/routes.js` & `navigation-manager.js` adalah dead code.
- Duplikat dead: `AppLayout.js` vs `app-layout.js`, `Dashboard.js` vs `dashboard-page.js`, dll.
- `chart.js` dimuat tapi tak dipakai; `product-validator.js` dead code; `migrations.js` stub.
- 14 file test stub tanpa test runner.

### 18.2 Prosedur Pengelolaan

```
┌─────────────────────────────┐
│ 1. DETEKSI                 │
│    - grep import yang      │
│      tidak dipakai         │
│    - bandingkan daftar file│
│      vs referensi          │
├─────────────────────────────┤
│ 2. KLASIFIKASI             │
│    - Dead code (aman hapus)│
│    - Stub (belum lengkap)  │
│    - TODO (belum selesai)  │
├─────────────────────────────┤
│ 3. PRIORITASI              │
│    - Yang membingungkan     │
│      / duplikat dulu       │
├─────────────────────────────┤
│ 4. REMOVE (dengan hati-hati)│
│    - Backup dulu           │
│    - Hapus 1 per 1         │
├─────────────────────────────┤
│ 5. TEST                    │
│    - Smoke test penuh      │
├─────────────────────────────┤
│ 6. DOKUMENTASI             │
│    - Catat di changelog &  │
│      maintenance log       │
└─────────────────────────────┘
```

### 18.3 Aturan untuk AI/Developer

- **Jangan hapus langsung** kode yang belum dipahami; audit dulu (bagian 21).
- Stub yang menjadi placeholder roadmap (mis. `pos-page.js` "Coming Soon") **bukan** dead code
  sampai fitur diputuskan dihapus.
- Cleanup dead code dilakukan per rilis kecil, bukan sekaligus.

---

## 19. MONITORING CHECKLIST

### 19.1 Daily

- [ ] App terbuka normal
- [ ] Login & Dashboard OK
- [ ] Transaksi hari ini bisa dibuat
- [ ] Riwayat transaksi tampil
- [ ] Stok tampak wajar
- [ ] Storage tidak penuh
- [ ] SW activated & running
- [ ] Tidak ada error console baru
- [ ] Backup harian tersimpan
- [ ] Session petugas aman saat tutup toko

### 19.2 Weekly

- [ ] Review error mingguan
- [ ] Ukur startup, search, CRUD
- [ ] Catat ukuran DB
- [ ] Cek kuota storage
- [ ] Backup mingguan tersimpan
- [ ] Review log
- [ ] Review user & role
- [ ] Tidak ada warning berulang

### 19.3 Monthly

- [ ] `npm.cmd audit` & `npm.cmd outdated`
- [ ] Review auth, session, permission
- [ ] Integrity check DB
- [ ] Uji backup + restore di device uji
- [ ] Profiling performa
- [ ] Scan unused files
- [ ] Scan dead code
- [ ] Review maintenance log
- [ ] Verifikasi manifest & ikon PWA
- [ ] Uji offline

### 19.4 Quarterly

- [ ] Review menyeluruh keamanan (16.1)
- [ ] Review arsitektur & technical debt
- [ ] Evaluasi kebijakan retensi backup
- [ ] Uji disaster recovery (bagian 22) penuh
- [ ] Review CDN vs package.json konsisten
- [ ] Evaluasi performa vs baseline

### 19.5 Yearly

- [ ] Audit keamanan menyeluruh
- [ ] Review dependency major
- [ ] Review arsitektur & road map
- [ ] Review UX dengan user kasir
- [ ] Evaluasi lifecycle perangkat
- [ ] Perbarui seluruh dokumentasi (docs 01–27)
- [ ] Perbarui panduan ini jika ada perubahan alur

---

## 20. MAINTENANCE LOG

### 20.1 Template Isian

| Date | Version | Issue | Action | Result | Developer | Test | Notes |
|------|---------|-------|--------|--------|-----------|------|-------|
| YYYY-MM-DD | v1.0 | … | … | … | … | … | … |

### 20.2 Contoh Isi

| Date | Version | Issue | Action | Result | Developer | Test | Notes |
|------|---------|-------|--------|--------|-----------|------|-------|
| 2026-08-18 | v1.0 | Backup gagal (P0) | Dokumentasi temuan; workaround export manual | Tercatat, workaround berjalan | Maintenance | Smoke harness 10/11 | Perbaikan permanen dijadwalkan |

### 20.3 Aturan Pengisian

1. **Satu baris per tindakan.** Jangan menggabungkan beberapa tindakan.
2. `Version` = versi aplikasi yang ditindaklanjuti.
3. `Result` harus terukur (mis. "restore OK, 34 tabel, 20 produk").
4. `Test` = metode verifikasi (manual / smoke test / device uji).
5. `Notes` = rujukan ke finding, file, atau dokumen.

---

## 21. AI MAINTENANCE RULES

Berlaku untuk semua AI Coding Assistant yang bekerja di proyek ini (termasuk opencode & agen).

### 21.1 Kewajiban AI

| No | Aturan | Penjelasan |
|----|--------|------------|
| 1 | **Audit dahulu** | Sebelum mengubah kode, baca file terkait + dokumen terkait; jangan menebak. |
| 2 | **Tidak langsung menghapus kode** | Konfirmasi dulu apakah kode ter-referensi/dipakai; hapus bertahap (bagian 18). |
| 3 | **Tidak mengubah database tanpa migration** | Perubahan skema wajib lewat `SCHEMA_VERSION` + `.upgrade()`, bukan mengedit seed/schema mentah. |
| 4 | **Tidak mengubah Business Rules** | Kontrak `docs/17_BUSINESS_RULES.md` tidak boleh diubah tanpa persetujuan. |
| 5 | **Tidak mengubah API Contract** | Kontrak `docs/18_API_CONTRACT.md` tidak boleh diubah tanpa persetujuan. |
| 6 | **Backup sebelum perubahan besar** | Perubahan yang berisiko data wajib didahului backup (bagian 6). |
| 7 | **Test setelah perubahan** | Setiap perubahan harus diverifikasi (smoke test minimal) — termasuk offline. |
| 8 | **Update dokumentasi** | Jika perubahan memengaruhi skema/API/alur, update dokumen terkait. |
| 9 | **Buat changelog** | Setiap rilis/commit mencatat apa yang berubah dan mengapa. |

### 21.2 Larangan AI

- Dilarang menambahkan dependency tanpa bukti pemakaian nyata.
- Dilarang mengubah `CACHE_VERSION`/APP_ASSETS tanpa update daftar asset yang benar.
- Dilarang mengubah skema, business rule, API contract tanpa persetujuan.
- Dilarang menandai bug sebagai "bukan masalah" tanpa verifikasi runtime.
- Dilarang menyebut sesuatu "sudah diuji" tanpa hasil uji yang nyata.

### 21.3 Alur Kerja AI yang Disarankan

```
Audit file & dokumen → identifikasi dampak → (jika perlu) backup
→ buat perubahan terkecil → test (smoke/offline) → update docs & changelog → lapor
```

---

## 22. DISASTER RECOVERY

### 22.1 Matriks Skenario & Prosedur

| Skenario | Prosedur | Prioritas |
|----------|----------|-----------|
| **Database corrupt** | Jangan tutup browser; export sisa data; restore backup terakhir (bagian 7); jika tak ada backup, rekonstruksi dari riwayat transaksi | P0 |
| **Application corrupt** | Recovery SW (8.4) setelah backup; reinstall PWA; restore | P0 |
| **Cache corrupt** | Clear cache SW + reload; jika gagal, unregister SW (8.4) | P1 |
| **Device rusak** | Gunakan device cadangan; install PWA; restore dari backup harian/mingguan | P0 |
| **Browser rusak** | Hapus data browser / gunakan browser lain; restore; catat data yang hilang | P0 |
| **Data hilang** | Cari backup terbaru; restore; dokumentasikan jangkauan kehilangan data | P0 |
| **Update gagal** | Rollback (bagian 14); restore pra-update; investigasi setelah toko beroperasi lagi | P0 |
| **Migration gagal** | Jangan lanjutkan operasi; restore DB pra-migrasi; analisis migration; uji di device uji dulu | P0 |

### 22.2 Rencana Pemulihan Standar

```
┌─────────────────────────────────────────┐
│ 1. Tentukan skenario (tabel 22.1)      │
├─────────────────────────────────────────┤
│ 2. Stop operasional yang terdampak      │
├─────────────────────────────────────────┤
│ 3. Coba ekspor sisa data               │
├─────────────────────────────────────────┤
│ 4. Restore dari backup terbaru         │
├─────────────────────────────────────────┤
│ 5. Verifikasi data (bagian 7.2)        │
├─────────────────────────────────────────┤
│ 6. Jika tanpa backup:                  │
│    rekonstruksi manual minimal         │
├─────────────────────────────────────────┤
│ 7. Dokumentasikan kehilangan & akar    │
├─────────────────────────────────────────┤
│ 8. Perkuat: perbaiki backup, perbaiki  │
│    SOP, tambah proteksi                │
└─────────────────────────────────────────┘
```

### 22.3 Catatan Penting

- **Tanpa backup yang valid, disaster recovery tidak mungkin dilakukan dengan cepat.** Uji
  restore bulanan adalah prioritas setelah bug P0 backup diperbaiki.
- Skenario "device rusak" → kecepatan pemulihan tergantung backup yang **tersimpan di luar device**
  (aturan bagian 6.4).

---

## 23. LONG TERM MAINTENANCE

### 23.1 Agenda Jangka Panjang

| Area | Frekuensi | Fokus |
|------|-----------|-------|
| **Architecture Review** | Kuartalan | Modularity tetap bersih; hapus router duplikat & dead code; pastikan layer compliance |
| **Dependency Update** | Kuartalan | Update CDN+package.json konsisten; prioritaskan xlsx (CVE); hindari major breaking tanpa uji |
| **Security Review** | Kuartalan | Implementasi hash+salt; enforce RBAC; screen lock; audit writer; evaluasi baru |
| **Performance Review** | Kuartalan | Profiling startup/search/transaksi; optimasi query in-memory; ukur storage growth |
| **Database Review** | Kuartalan | Skema vs docs; migration non-stub; kebijakan retensi; integrity |
| **UX Review** | Tahunan | Feedback kasir/owner; alur POS; form flow; error message |
| **Technical Debt** | Berkelanjutan | Kurangi stub/TODO/dead code sesuai roadmap |

### 23.2 Indikator Health

- **Sehat:** backup+restore lulus uji, tidak ada bug P0 terbuka, storage stabil, dead code tidak bertambah.
- **Perlu perhatian:** ada bug P0 terbuka, DB tumbuh cepat, banyak TODO baru, dependency outdated.
- **Kritis:** backup tidak berfungsi, tidak ada test, tidak ada rollback plan.

### 23.3 Perjalanan Versi

Sesuai `docs/26_RELEASE_ROADMAP.md`: v1.0 (stabil inti) → v1.1 → v1.2 → v1.5 → v2.0. Setiap milestone
diakhiri dengan review bagian 23.1 dan pembaruan dokumen ini bila ada perubahan prosedur.

---

## 24. MAINTENANCE CHECKLIST (100+)

### A. Harian (10)

1. [ ] App terbuka tanpa blank/error
2. [ ] Login berhasil
3. [ ] Dashboard render normal
4. [ ] Transaksi baru bisa dibuat
5. [ ] Riwayat transaksi tampil benar
6. [ ] Stok sesuai transaksi
7. [ ] Storage tidak mendekati penuh
8. [ ] Service worker `activated & running`
9. [ ] Tidak ada error console baru
10. [ ] Backup harian tersimpan valid

### B. Mingguan (15)

11. [ ] Review seluruh error seminggu terakhir
12. [ ] Ukur waktu startup app
13. [ ] Ukur waktu search produk
14. [ ] Ukur waktu CRUD produk
15. [ ] Ukur waktu simpan transaksi
16. [ ] Catat ukuran database
17. [ ] Cek kuota storage
18. [ ] Backup mingguan tersimpan
19. [ ] Verifikasi backup bisa dibuka
20. [ ] Review log maintenance
21. [ ] Review daftar user
22. [ ] Review role/permission
23. [ ] Tidak ada warning berulang
24. [ ] Cek session yang masih aktif
25. [ ] Dokumentasikan temuan

### C. Bulanan (20)

26. [ ] `npm.cmd audit` dijalankan
27. [ ] `npm.cmd outdated` dijalankan
28. [ ] Tidak ada vuln kritis baru
29. [ ] Review autentikasi (hash, lockout)
30. [ ] Review otorisasi (RBAC route)
31. [ ] Review session (expiry, deviceId)
32. [ ] Review password (reset, policy)
33. [ ] Review permission per role
34. [ ] Cek audit log terisi (bila sudah ada writer)
35. [ ] Integrity check semua tabel
36. [ ] Skema match `docs/02` & `docs/23`
37. [ ] Uji backup di device uji
38. [ ] Uji restore di device uji
39. [ ] Data hasil restore identik
40. [ ] Profiling performa (startup/search/CRUD/transaksi)
41. [ ] Tidak ada regresi > 20%
42. [ ] Scan unused files
43. [ ] Scan dead code & duplikat
44. [ ] Review maintenance log bulan ini
45. [ ] Verifikasi manifest & ikon PWA

### D. Kuartalan (20)

46. [ ] Review keamanan menyeluruh
47. [ ] Uji disaster recovery penuh
48. [ ] Review arsitektur (layer compliance)
49. [ ] Hapus router duplikat (jika belum)
50. [ ] Hapus dead code utama
51. [ ] Evaluasi kebijakan retensi backup
52. [ ] Evaluasi pertumbuhan DB
53. [ ] Review CDN vs package.json konsisten
54. [ ] Update dependency minor yang aman
55. [ ] Prioritaskan upgrade xlsx (CVE)
56. [ ] Evaluasi performa vs baseline
57. [ ] Review UX dengan user kasir
58. [ ] Review error message & validasi
59. [ ] Review kebijakan screen lock
60. [ ] Review session timeout
61. [ ] Review backup di lokasi eksternal
62. [ ] Uji offline penuh
63. [ ] Uji PWA install fresh
64. [ ] Uji uninstall/reinstall bersih
65. [ ] Perbarui panduan ini jika alur berubah

### E. Tahunan (15)

66. [ ] Audit keamanan menyeluruh
67. [ ] Review dependency major update
68. [ ] Evaluasi migrasi framework/stack
69. [ ] Review arsitektur keseluruhan
70. [ ] Review road map rilis (docs/26)
71. [ ] Evaluasi lifecycle perangkat kasir
72. [ ] Review kapasitas storage device
73. [ ] Review data retention & arsip
74. [ ] Review compliance business rules (docs/17)
75. [ ] Review compliance API contract (docs/18)
76. [ ] Review ADR (docs/25)
77. [ ] Perbarui seluruh dokumentasi docs 01–27
78. [ ] Evaluasi backup retention setahun
79. [ ] Renovasi kebijakan maintenance
80. [ ] Dokumentasikan hasil akhir tahun

### F. Khusus Saat Update (20)

81. [ ] Backup penuh sebelum update
82. [ ] Backup di 2 lokasi
83. [ ] Versi baru diuji di device uji
84. [ ] Changelog diupdate
85. [ ] Versi aplikasi dinaikkan
86. [ ] Cek perubahan `SCHEMA_VERSION`
87. [ ] Migration (jika ada) bukan stub
88. [ ] Migration diuji upgrade dari versi lama
89. [ ] Migration diuji fresh install
90. [ ] Rollback plan disiapkan
91. [ ] SW `CACHE_VERSION` dinaikkan
92. [ ] APP_ASSETS diupdate (service-worker + pwa-config)
93. [ ] Smoke test login
94. [ ] Smoke test dashboard
95. [ ] Smoke test produk
96. [ ] Smoke test transaksi
97. [ ] Smoke test backup/restore
98. [ ] Smoke test offline
99. [ ] Regression test modul terdampak
100. [ ] Data verification sebelum/sesudah

### G. Khusus Setelah Incident (15)

101. [ ] Incident terdeteksi & dicatat
102. [ ] Operasional terdampak di-stop
103. [ ] Sisa data diekspor (jika mungkin)
104. [ ] Root cause teridentifikasi
105. [ ] Fix/workaround diterapkan
106. [ ] Perbaikan diverifikasi
107. [ ] Data diverifikasi aman
108. [ ] Incident terdokumentasi di log
109. [ ] Preventive action dibuat
110. [ ] Checklist diperbarui jika perlu
111. [ ] Backup baru diambil setelah recovery
112. [ ] Restore diuji setelah recovery
113. [ ] Semua device kasir dalam kondisi sama
114. [ ] Laporan ke pemilik toko
115. [ ] Follow-up terjadwal

### H. Security (10)

116. [ ] Tidak ada default credential
117. [ ] Hash password sudah ber-salt (jika sudah dimigrasi)
118. [ ] PIN tidak plaintext
119. [ ] Route guard enforce role
120. [ ] Session expiry berlaku
121. [ ] Screen lock aktif
122. [ ] Audit log mencatat aksi sensitif
123. [ ] Dependency tidak ada vuln kritis
124. [ ] Backup terlindungi
125. [ ] Hak akses minimal per role

**Total: 125 item checklist.** Simpan salinan checklist ini sebagai tracking di Maintenance Log.

---

## 25. REFERENSI & LAMPIRAN

### 25.1 Dokumen Terkait

| Dokumen | Isi |
|---------|-----|
| `docs/02_DATABASE_SCHEMA.md`, `docs/23` | Skema database (34 tabel) |
| `docs/17_BUSINESS_RULES.md` | Aturan bisnis (kontrak, tidak boleh diubah tanpa persetujuan) |
| `docs/18_API_CONTRACT.md` | Kontrak API internal modul |
| `docs/22_SECURITY_GUIDE.md` | Panduan keamanan |
| `docs/24_AI_DEVELOPMENT_GUIDE.md` | Panduan pengembangan AI |
| `docs/25_ARCHITECTURE_DECISION_RECORDS.md` | ADR (arsitektur & layer compliance) |
| `docs/26_RELEASE_ROADMAP.md` | Roadmap rilis v1.0 → v2.0 |
| `docs/BASELINE_AUDIT_REPORT.md` | Hasil audit baseline: skor 1.9/5, status RED, temuan F-01..F-56, blocker B-01..B-32 |

### 25.2 Lampiran: Ringkasan Temuan yang Mempengaruhi Maintenance

| Temuan | Dampak Maintenance | Rujukan |
|--------|--------------------|---------|
| Backup/restore rusak (`db.tables` collision) | Backup manual sementara; uji restore bulanan tertunda sampai diperbaiki | 6.6, 7.6, 12 (15–16) |
| `migrations.js` stub | Perubahan skema masa depan berisiko; perbaiki sebelum migrasi pertama | 5.3, 12 (27) |
| Route guard tanpa role | Risiko akses tidak sah; enforce saat maintenance RBAC | 16.2, 16.4, 12 (3) |
| Hash tanpa salt + PIN plaintext | Reset password rentan; rencanakan migrasi hash | 16.2, 12 (17–18) |
| APP_ASSETS basi | Update rilis wajib perbarui daftar precache | 8.3, 12 (8–9) |
| xlsx CVE | Prioritaskan upgrade saat import/export stabil | 17.1, 16.2 |
| 46 stub / 14 test stub / tanpa test runner | Tambahkan test saat modul diimplementasikan | 18.1 |

### 25.3 Penutup

Panduan ini adalah **dokumen hidup**. Setiap kali ada perubahan signifikan pada aplikasi (fitur baru,
perubahan skema, perubahan kebijakan retensi), perbarui bagian terkait dan catat di Maintenance Log.
Jika panduan ini sendiri sudah tidak sesuai realitas, revisi dan naikkan versi dokumennya.

---

*— Akhir dokumen —*
