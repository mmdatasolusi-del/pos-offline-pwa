# 12_DEVELOPMENT_WORKFLOW.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Pengembangan](#2-filosofi-pengembangan)
3. [Siklus Pengembangan](#3-siklus-pengembangan)
4. [Workflow Menerima Tugas Baru](#4-workflow-menerima-tugas-baru)
5. [Workflow Membuat Fitur Baru](#5-workflow-membuat-fitur-baru)
6. [Workflow Memperbaiki Bug](#6-workflow-memperbaiki-bug)
7. [Workflow Refactoring](#7-workflow-refactoring)
8. [Workflow Perubahan Database](#8-workflow-perubahan-database)
9. [Workflow Perubahan Business Rules](#9-workflow-perubahan-business-rules)
10. [Workflow Perubahan UI](#10-workflow-perubahan-ui)
11. [Workflow Dokumentasi](#11-workflow-dokumentasi)
12. [Workflow Testing](#12-workflow-testing)
13. [Checklist Sebelum Implementasi](#13-checklist-sebelum-implementasi)
14. [Checklist Setelah Implementasi](#14-checklist-setelah-implementasi)
15. [Definition of Ready](#15-definition-of-ready)
16. [Definition of Done](#16-definition-of-done)
17. [Risk Management](#17-risk-management)
18. [Decision Making](#18-decision-making)
19. [AI Communication Standard](#19-ai-communication-standard)
20. [Continuous Improvement](#20-continuous-improvement)
21. [Aturan Kerja AI](#21-aturan-kerja-ai)
22. [Daftar Dokumen Terkait](#22-daftar-dokumen-terkait)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **Standard Operating Procedure (SOP)** resmi pengembangan aplikasi POS Offline PWA. Mendefinisikan alur kerja standar dari menerima tugas hingga tugas dinyatakan selesai — untuk AI Coding Assistant maupun developer manusia.

### 1.2 Siapa yang Membaca

| Pembaca | Kegunaan |
|---|---|
| **AI Coding Assistant** | SOP utama — bagaimana mengerjakan setiap jenis tugas secara konsisten |
| **Developer Manusia** | Panduan alur kerja saat berkontribusi pada proyek |
| **Project Manager** | Standar kualitas dan proses yang diharapkan |
| **Code Reviewer** | Acuan untuk mengevaluasi kesesuaian proses |

### 1.3 Acuan

| Dokumen | Peran dalam Workflow |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, prinsip — acuan keputusan arsitektural |
| `02_DATABASE_SCHEMA.md` | Acuan saat perubahan database |
| `03_BUSINESS_RULES.md` | Acuan validasi business rules di semua workflow |
| `04_UI_DESIGN_SYSTEM.md` | Acuan saat perubahan UI |
| `05_COMPONENT_LIBRARY.md` | Acuan saat membuat/mengubah komponen |
| `06_FEATURE_LIST.md` | Acuan prioritas dan dependensi fitur |
| `07_ROADMAP.md` | Acuan fase dan timeline pengembangan |
| `08_AI_PROMPT_GUIDE.md` | Panduan operasional AI — template dan checklist |
| `09_CODING_STANDARD.md` | Standar teknis implementasi |
| `10_PROJECT_STRUCTURE.md` | Struktur folder dan dependency rule |
| `11_AI_CONTEXT.md` | Ringkasan proyek — baca pertama setiap sesi |

### 1.4 Hierarki Dokumen

Jika terjadi konflik antara workflow dengan dokumentasi lain:

| Prioritas | Dokumen |
|---|---|
| 1 | `01_PROJECT_BLUEPRINT.md` — arsitektur dan prinsip paling fundamental |
| 2 | `03_BUSINESS_RULES.md` — aturan bisnis tidak bisa dikompromikan |
| 3 | `02_DATABASE_SCHEMA.md` — struktur data |
| 4 | Workflow ini — prosedur dapat disesuaikan |
| 5 | Dokumen lainnya |

---

## 2. Filosofi Pengembangan

### 2.1 Documentation Driven Development

Dokumen adalah **kebenaran tertinggi**. Setiap perubahan harus tercermin di dokumentasi terlebih dahulu, baru diimplementasikan dalam kode. Dokumentasi yang tidak akurat lebih berbahaya daripada tidak ada dokumentasi.

**Penerapan**: Sebelum menulis kode, baca dokumen relevan. Setelah selesai, perbarui dokumen jika ada perubahan. Tidak ada implementasi tanpa dokumentasi yang sesuai.

### 2.2 AI Assisted Development

AI adalah **asisten** yang mengusulkan solusi, bukan pengambil keputusan. Manusia menyetujui arsitektur, prioritas, dan keputusan bisnis.

**Penerapan**: AI memberikan rekomendasi dengan kelebihan dan kekurangan. Manusia memutuskan. AI tidak mengubah arsitektur, menghapus file, atau menambah library tanpa persetujuan.

### 2.3 Incremental Development

Setiap perubahan harus kecil, terfokus, dan selesai dalam satu siklus. Satu tugas = satu tujuan. Jangan mencampur beberapa perubahan dalam satu permintaan.

**Penerapan**: Pisahkan tugas besar menjadi sub-tugas kecil. Setiap sub-tugas menghasilkan perubahan yang bisa di-review, di-test, dan di-rollback secara independen.

### 2.4 Small Pull Request Mindset

Setiap perubahan harus sekecil mungkin tanpa mengorbankan kualitas. Perubahan besar lebih berisiko, lebih sulit di-review, dan lebih sulit di-rollback.

**Penerapan**: Jika tugas mempengaruhi lebih dari 5 file atau 300 baris kode, pecah menjadi beberapa langkah. Selesaikan satu langkah, minta review, lalu lanjut ke langkah berikutnya.

### 2.5 Reusable Solution

Jangan membuat ulang solusi yang sudah ada. Selalu cek komponen, service, repository, dan utilitas yang sudah tersedia sebelum membuat yang baru.

**Penerapan**: Sebelum membuat komponen baru, cek `05_COMPONENT_LIBRARY.md`. Sebelum membuat fungsi baru, cek `src/utils/` dan `src/helpers/`. Ekstensi lebih baik daripada duplikasi.

### 2.6 Continuous Improvement

Workflow ini adalah **living document**. Jika ditemukan cara yang lebih baik, workflow diperbarui. Tidak ada proses yang sakral — yang penting adalah konsistensi dan kualitas.

**Penerapan**: Setelah menyelesaikan tugas, catat jika ada bagian workflow yang bisa diperbaiki. Usulkan perbaikan sebagai bagian dari output tugas.

### 2.7 Offline First

Semua keputusan teknis harus mempertimbangkan operasi 100% offline. Tidak ada ketergantungan pada API eksternal, server, atau koneksi internet untuk fungsi inti.

**Penerapan**: Service dan repository harus menyelesaikan dalam satu siklus event loop lokal. Cache strategy untuk PWA. Tidak ada fetch wajib untuk operasi bisnis.

### 2.8 Quality Before Quantity

Kode yang bersih, terdokumentasi, dan teruji lebih berharga daripada kode yang banyak tapi rapuh. Prioritaskan kebenaran dan maintainability daripada kecepatan fitur.

**Penerapan**: Setiap implementasi harus melalui self-review, validasi business rules, dan pengecekan coding standard sebelum dinyatakan selesai. TODO/FIXME dilarang dalam kode final.

---

## 3. Siklus Pengembangan

Setiap pekerjaan harus mengikuti siklus 10 tahap berikut:

```
Analisis
    ↓
Perencanaan
    ↓
Desain
    ↓
Implementasi
    ↓
Self Review
    ↓
Testing
    ↓
Perbaikan
    ↓
Update Dokumentasi
    ↓
Final Review
    ↓
Selesai
```

### 3.1 Analisis

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Baca dokumen relevan (sesuai jenis tugas) | Daftar dokumen yang sudah dibaca | Semua dokumen relevan sudah dibaca |
| Identifikasi modul dan file yang terdampak | Daftar modul dan file | Lingkup pekerjaan jelas |
| Identifikasi dependensi antar modul | Daftar dependensi | Tidak ada dependensi yang terlewat |
| Identifikasi risiko potensial | Daftar risiko | Risiko diketahui dan termitigasi |
| Cek kode yang sudah ada (reusabilitas) | Konfirmasi reuse atau buat baru | Tidak ada duplikasi |

**Jika tahap ini tidak selesai, jangan lanjut ke Perencanaan.**

### 3.2 Perencanaan

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Tentukan file yang akan dibuat/diubah | Daftar file definitif | Semua file teridentifikasi |
| Tentukan urutan implementasi | Step-by-step plan | Urutan logis dan tidak saling blokir |
| Tentukan pendekatan teknis | Strategi solusi | Pendekatan sesuai arsitektur |
| Estimasi kompleksitas | Kecil/Sedang/Besar | Kompleksitas proporsional dengan tugas |

### 3.3 Desain

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Verifikasi desain terhadap dokumentasi | Tidak ada konflik | Semua aturan terpenuhi |
| Tentukan komponen yang akan digunakan | Daftar komponen dari `05_COMPONENT_LIBRARY.md` | Komponen sesuai spesifikasi |
| Tentukan service/repository yang dipanggil | Diagram alur data | Alur data jelas dan sesuai layer |
| Verifikasi UI terhadap `04_UI_DESIGN_SYSTEM.md` | Konfirmasi token desain | Token desain sesuai |

### 3.4 Implementasi

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Tulis kode sesuai perencanaan | File yang dimodifikasi | Kode siap untuk self-review |
| Ikuti `09_CODING_STANDARD.md` | Kode konsisten | Tidak ada pelanggaran coding standard |
| Ikuti `10_PROJECT_STRUCTURE.md` | Struktur file sesuai | File di folder yang benar |
| Satu langkah = satu perubahan kecil | Perubahan fokus | Tidak ada perubahan di luar lingkup |

### 3.5 Self Review

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Cek konsistensi dengan dokumen proyek | Tidak ada konflik | Semua dokumen relevan terpenuhi |
| Cek duplikasi kode | Tidak ada duplikasi | Tidak membuat ulang yang sudah ada |
| Cek error sintaks | Kode bersih | Tidak ada syntax error |
| Cek coding standard | Semua aturan terpenuhi | Checklist lulus |
| Cek inline style/inline event | Tidak ada | DOM terpisah dari logic |

### 3.6 Testing

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Uji fungsionalitas dasar | Fitur berjalan sesuai spesifikasi | Semua use case positif berhasil |
| Uji edge cases | Kasus batas tertangani | Input tidak valid, null, empty |
| Uji error handling | Error tidak menyebabkan crash | User mendapat feedback yang jelas |
| Cek console browser | Tidak ada error/warning | Console bersih |
| Cek responsive | Tampilan baik di tablet & desktop | Tidak ada layout break |

### 3.7 Perbaikan

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Perbaiki masalah yang ditemukan saat testing | Semua bug/issue resolved | Tidak ada open issue |
| Verifikasi perbaikan | Bug tidak muncul ulang | Regression test lulus |

### 3.8 Update Dokumentasi

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Periksa dokumen yang perlu diperbarui | Daftar dokumen yang diupdate | Semua dokumen sinkron |
| Update `06_FEATURE_LIST.md` jika fitur berubah | Status fitur terkini | Akurat dengan implementasi |
| Update `02_DATABASE_SCHEMA.md` jika database berubah | Skema database terkini | Field/entitas baru tercatat |
| Update `03_BUSINESS_RULES.md` jika aturan berubah | Aturan bisnis terkini | Tidak ada aturan usang |
| Update `05_COMPONENT_LIBRARY.md` jika komponen berubah | Spesifikasi komponen terkini | Komponen baru tercatat |

### 3.9 Final Review

| Aktivitas | Output | Kriteria Lanjut |
|---|---|---|
| Review all checklist | Semua checklist lulus | Definition of Done terpenuhi |
| Siapkan catatan untuk reviewer | Ringkasan perubahan lengkap | File, dampak, risiko tercatat |
| Verifikasi tidak ada regresi | Fitur lain tidak rusak | Regression test lulus |

### 3.10 Selesai

| Aktivitas | Output |
|---|---|
| Ringkasan apa yang sudah dilakukan | Pesan ke user / commit message |
| Sebutkan file yang berubah | Daftar file |
| Sebutkan hal yang perlu diperhatikan | Catatan untuk pengembang selanjutnya |
| Catat jika ada perbaikan workflow | Usulan continuous improvement |

---

## 4. Workflow Menerima Tugas Baru

### 4.1 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Pahami permintaan** | Baca tugas dari user. Identifikasi tujuan, lingkup, dan output yang diharapkan |
| 2 | **Baca `11_AI_CONTEXT.md`** | Dokumen pertama setiap sesi — pahami konteks proyek secara keseluruhan |
| 3 | **Identifikasi dokumen relevan** | Tentukan dokumen 01–11 mana yang perlu dibaca berdasarkan jenis tugas |
| 4 | **Tentukan ruang lingkup** | File apa yang akan dibuat/diubah. Modul apa yang terdampak |
| 5 | **Identifikasi dependensi** | Apakah tugas ini bergantung pada modul lain? Apakah tugas lain bergantung pada ini? |
| 6 | **Identifikasi risiko** | Potensi konflik, data loss, performance issue, atau breaking change |
| 7 | **Susun rencana implementasi** | Urutan langkah, file yang diubah, pendekatan teknis |
| 8 | **Presentasikan rencana** (jika kompleks) | Berikan ringkasan rencana ke user sebelum mulai bekerja |

### 4.2 Pertanyaan yang Harus Terjawab

- Apa tujuan tugas ini?
- Modul mana yang terdampak?
- File mana yang perlu dibuat/diubah?
- Apakah ada dependensi yang belum terpenuhi?
- Apakah ada risiko yang perlu dimitigasi?
- Apakah ada solusi yang sudah ada yang bisa digunakan kembali?

### 4.3 Larangan

- Jangan langsung membuat kode tanpa analisis
- Jangan mengubah ruang lingkup tanpa persetujuan
- Jangan membuat asumsi tentang kebutuhan pengguna
- Jangan melebihi ruang lingkup yang diminta

---

## 5. Workflow Membuat Fitur Baru

### 5.1 Langkah Standar

| # | Langkah | Dokumen Acuan |
|---|---|---|
| 1 | **Analisis kebutuhan** | Tujuan fitur, user yang terlibat, alur bisnis |
| 2 | **Verifikasi terhadap Feature List** | `06_FEATURE_LIST.md` — prioritas, dependensi, status |
| 3 | **Verifikasi terhadap Business Rules** | `03_BUSINESS_RULES.md` — aturan bisnis yang berlaku |
| 4 | **Verifikasi terhadap Database Schema** | `02_DATABASE_SCHEMA.md` — entitas, field, relasi |
| 5 | **Verifikasi terhadap UI Design System** | `04_UI_DESIGN_SYSTEM.md` — token desain, template halaman |
| 6 | **Verifikasi terhadap Component Library** | `05_COMPONENT_LIBRARY.md` — komponen yang tersedia |
| 7 | **Tentukan modul terdampak** | Service, repository, page, komponen yang perlu diubah |
| 8 | **Implementasi** | Ikuti siklus pengembangan (section 3) |
| 9 | **Testing** | Fungsional, edge cases, error handling, responsive |
| 10 | **Update dokumentasi** | Feature List status, Business Rules (jika perlu), CHANGELOG |
| 11 | **Final review** | Definition of Done checklist |

### 5.2 Verifikasi Modularitas

- Apakah fitur baru bisa diimplementasikan sebagai modul independen?
- Apakah ada duplikasi dengan fitur yang sudah ada?
- Apakah fitur baru membutuhkan perubahan di modul lain?

### 5.3 Verifikasi Offline

- Apakah fitur berfungsi tanpa koneksi internet?
- Apakah ada ketergantungan pada API eksternal?
- Apakah data disimpan di IndexedDB (bukan localStorage)?

---

## 6. Workflow Memperbaiki Bug

### 6.1 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Identifikasi bug** | Deskripsi jelas: apa yang terjadi vs apa yang diharapkan |
| 2 | **Reproduksi bug** | Langkah reproduksi yang konsisten. Catat environment (browser, device, data) |
| 3 | **Klasifikasi bug** | Tentukan prioritas: Critical (data loss/crash), High (fungsi rusak), Medium (fungsi terganggu), Low (kosmetik) |
| 4 | **Analisis penyebab** | Root cause analysis — lapisan mana yang bermasalah (UI, Service, Repository, Database) |
| 5 | **Tentukan solusi** | Minimal change yang memperbaiki tanpa mengubah perilaku lain |
| 6 | **Cek solusi serupa** | Apakah ada bug serupa yang sudah diperbaiki sebelumnya? |
| 7 | **Implementasi perbaikan** | Ubah file terkait. Jangan refactor besar saat fix bug |
| 8 | **Verifikasi bug selesai** | Bug tidak muncul lagi setelah fix |
| 9 | **Regression testing** | Pastikan fitur terkait tidak rusak |
| 10 | **Update dokumentasi** | Jika bug disebabkan oleh dokumentasi yang salah / tidak lengkap |

### 6.2 Klasifikasi Bug

| Prioritas | Definisi | Tindakan |
|---|---|---|
| **Critical** | Data loss, crash, kehilangan uang | Fix segera. Tidak ada pekerjaan lain sebelum ini selesai |
| **High** | Fungsi utama tidak berjalan | Fix sebelum rilis berikutnya |
| **Medium** | Fungsi berjalan tapi tidak optimal | Fix di siklus berikutnya |
| **Low** | Kosmetik, typo, minor visual | Fix kalau ada waktu atau gabung dengan tugas lain |

### 6.3 Hal yang Tidak Boleh Dilakukan Saat Fix Bug

- Refactor besar-besaran — hanya ubah yang perlu
- Menambah fitur baru — fokus pada perbaikan
- Mengubah dokumentasi tanpa alasan — hanya update jika ada perubahan perilaku
- Mengganti pendekatan arsitektur — fix bug, jangan redesign

---

## 7. Workflow Refactoring

### 7.1 Kapan Refactor Dilakukan

| Situasi | Keputusan |
|---|---|
| Bug disebabkan struktur kode buruk | ✅ Refactor minimal, hanya bagian yang bermasalah |
| Fitur baru membutuhkan perubahan arsitektur | ✅ Refactor setelah analisis dampak |
| Kode duplikat ditemukan | ✅ Gabungkan — buat fungsi/komponen shared |
| Performa buruk | ✅ Optimasi — query, render, caching |
| Ingin memperbaiki nama variable | ❌ Jangan, kecuali diminta eksplisit |
| Kode berfungsi tapi "tidak cantik" | ❌ Jangan, kecuali ada masalah maintainability |
| Tidak ada masalah sama sekali | ❌ Jangan refactor tanpa alasan |

### 7.2 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Analisis** | Identifikasi masalah spesifik. Ukur dampak (duplikasi, performa, maintainability) |
| 2 | **Identifikasi risiko** | Apa yang bisa rusak? Siapa pengguna kode ini (modul lain)? |
| 3 | **Tentukan lingkup** | Batasi refactor pada area yang bermasalah. Jangan meluas |
| 4 | **Backup** | Pastikan data aman. Catat state sebelum refactor |
| 5 | **Refactor bertahap** | Satu perubahan kecil per langkah. Jangan refactor 5 file sekaligus |
| 6 | **Pastikan perilaku tidak berubah** | Output fungsi sama. API publik komponen sama |
| 7 | **Jalankan pengujian** | Regression test. Semua test yang ada harus lulus |
| 8 | **Dokumentasikan perubahan** | Update JSDoc, README, dokumen terkait |
| 9 | **Final review** | Verifikasi tidak ada sisi yang rusak |

### 7.3 Prinsip Refactor

- **Jangan** mengubah API publik yang sudah dipakai modul lain
- **Jangan** mengubah nama file yang sudah di-import di banyak tempat
- **Jangan** menggabungkan refactor dengan implementasi fitur baru
- **Jangan** refactor kode yang sedang bermasalah (fix dulu, refactor kemudian)

---

## 8. Workflow Perubahan Database

### 8.1 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Analisis dampak** | Modul mana yang terpengaruh? Data existing apa yang perlu migrasi? |
| 2 | **Perbarui `02_DATABASE_SCHEMA.md`** | Field baru, entitas baru, relasi baru, index baru |
| 3 | **Verifikasi terhadap Business Rules** | Apakah perubahan database melanggar aturan bisnis yang ada? |
| 4 | **Cek kompatibilitas data lama** | Apakah data lama compatible? Perlu migrasi? |
| 5 | **Tentukan strategi migrasi** | Dexie `version()` — upgrade function, default value untuk data lama |
| 6 | **Perbarui repository** | Tambah method baru jika diperlukan. Perbarui query yang berubah |
| 7 | **Perbarui service** | Validasi baru, business logic baru terkait field baru |
| 8 | **Perbarui UI** | Form, table, detail component yang menampilkan field baru |
| 9 | **Testing** | Data lama masih bisa dibaca? Data baru bisa ditulis? |
| 10 | **Update dokumentasi terkait** | Component library (jika ada komponen baru), Feature List (jika perubahan signifikan) |

### 8.2 Aturan Perubahan Database

- Jangan menghapus field tanpa migrasi data
- Jangan mengubah tipe data field yang sudah ada datanya (kecuali migration)
- Field baru harus punya default value untuk data lama
- Index baru boleh ditambah tanpa migrasi data
- Hapus tabel hanya jika benar-benar tidak dipakai (cek semua referensi)

### 8.3 Contoh Skenario

| Skenario | Tindakan |
|---|---|
| Tambah field baru di tabel existing | Tambah field di schema, update version(), update dokumen |
| Tambah tabel baru | Tambah entitas di schema, buat repository, update dokumen |
| Ubah tipe field (string → number) | Migration script untuk konversi data. Update dokumen |
| Hapus field | Migration: drop field (jika IndexedDB mendukung). Update dokumen |
| Hapus tabel | Migration: drop table. Hapus repository. Update dokumen |

---

## 9. Workflow Perubahan Business Rules

### 9.1 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Perbarui `03_BUSINESS_RULES.md`** | Tambah aturan baru / edit aturan existing / nonaktifkan aturan |
| 2 | **Evaluasi dampak terhadap modul lain** | Service, repository, UI mana yang terpengaruh oleh perubahan aturan |
| 3 | **Perbarui Feature List** `06_FEATURE_LIST.md` | Jika aturan mempengaruhi prioritas atau scope fitur |
| 4 | **Perbarui Roadmap** `07_ROADMAP.md` | Jika perubahan aturan mempengaruhi prioritas atau timeline pengembangan |
| 5 | **Implementasi** | Ubah kode sesuai aturan baru |
| 6 | **Testing** | Verifikasi aturan baru. Regression test untuk aturan yang tidak berubah |
| 7 | **Update dokumen lain** | Jika aturan bisnis mempengaruhi UI (04), component (05), atau data (02) |

### 9.2 Aturan Perubahan Business Rules

- Setiap perubahan aturan bisnis **wajib** tercatat di `03_BUSINESS_RULES.md`
- Aturan lama yang diganti harus ditandai (jangan dihapus — beri catatan "diganti oleh BR-XXX")
- Jika perubahan aturan mempengaruhi data existing, sertakan strategi migrasi data
- Perubahan aturan yang bersifat breaking change harus dikomunikasikan sebelum implementasi

---

## 10. Workflow Perubahan UI

### 10.1 Langkah Standar

| # | Langkah | Detail |
|---|---|---|
| 1 | **Ikuti `04_UI_DESIGN_SYSTEM.md`** | Token warna, font, spacing, shadow, border sesuai standar |
| 2 | **Ikuti `05_COMPONENT_LIBRARY.md`** | Gunakan komponen yang sudah ada. Jangan buat komponen baru jika komponen existing bisa digunakan |
| 3 | **Tentukan jenis perubahan** | Yang perlu diubah: token, komponen, layout, atau template halaman? |
| 4 | **Cek reusabilitas komponen** | Apakah ada komponen yang sudah ada untuk kebutuhan ini? |
| 5 | **Implementasi** | Ubah CSS class (Bootstrap utilities), struktur HTML, atau JavaScript rendering |
| 6 | **Verifikasi responsive** | Cek di tablet 10" (target utama), desktop, dan mobile |
| 7 | **Verifikasi aksesibilitas** | Focus indicator, keyboard nav, label, kontras warna |
| 8 | **Update dokumentasi** | Component Library (jika komponen baru), UI Design System (jika token baru) |

### 10.2 Aturan Perubahan UI

- Jika mengubah komponen yang sudah ada, pastikan tidak merusak halaman lain yang menggunakan komponen tersebut
- Jika menambah variasi komponen baru, pastikan tidak membuat duplikasi fungsional dengan komponen yang sudah ada
- Jangan membuat inline style — gunakan Bootstrap utility classes atau CSS custom di `src/styles/`
- Jangan menambah CSS global yang tidak terkait dengan perubahan

### 10.3 Prioritaskan Komponen Existing

```
Sebelum membuat komponen baru:
1. Cek apakah komponen yang sama sudah ada di COMPONENT_LIBRARY
2. Cek apakah komponen serupa bisa diperluas (props baru, variasi baru)
3. Cek apakah bisa dikomposisi dari komponen yang lebih kecil
4. Baru buat komponen baru jika tidak ada opsi lain
```

---

## 11. Workflow Dokumentasi

### 11.1 Kapan Update Dokumentasi

| Dokumen | Diperbarui Ketika |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Arsitektur berubah, stack teknologi berubah, prinsip baru ditambahkan |
| `02_DATABASE_SCHEMA.md` | Entitas/field/relasi/index berubah. Migration database |
| `03_BUSINESS_RULES.md` | Aturan bisnis baru, aturan existing berubah, aturan dihapus |
| `04_UI_DESIGN_SYSTEM.md` | Token desain baru (warna, font, spacing). Template halaman baru |
| `05_COMPONENT_LIBRARY.md` | Komponen baru, komponen diubah (props, state, variasi) |
| `06_FEATURE_LIST.md` | Status fitur berubah, prioritas berubah, fitur baru ditambahkan |
| `07_ROADMAP.md` | Prioritas fase berubah, timeline berubah, risiko baru teridentifikasi |
| `08_AI_PROMPT_GUIDE.md` | Workflow AI berubah, template baru, checklist baru |
| `09_CODING_STANDARD.md` | Aturan coding baru, anti pattern baru, standar baru |
| `10_PROJECT_STRUCTURE.md` | Struktur folder berubah, modul baru, dependency rule berubah |
| `11_AI_CONTEXT.md` | Ringkasan proyek berubah (teknologi, modul, arsitektur) |
| `12_DEVELOPMENT_WORKFLOW.md` | **(dokumen ini)** Workflow berubah, SOP baru, proses baru |

### 11.2 Prinsip Update Dokumentasi

- Update dokumentasi **segera setelah perubahan**, jangan ditunda
- Satu perubahan = update semua dokumen yang relevan
- Jika informasi muncul di lebih dari satu dokumen, pastikan konsisten
- Jangan menghapus informasi lama tanpa migrasi — beri catatan "deprecated" atau "diganti oleh"

### 11.3 Checklist Setelah Pekerjaan

Setelah selesai implementasi, periksa:

- [ ] Apakah ada entitas/field database baru? → Update `02_DATABASE_SCHEMA.md`
- [ ] Apakah ada aturan bisnis baru/berubah? → Update `03_BUSINESS_RULES.md`
- [ ] Apakah ada token desain baru? → Update `04_UI_DESIGN_SYSTEM.md`
- [ ] Apakah ada komponen baru/berubah? → Update `05_COMPONENT_LIBRARY.md`
- [ ] Apakah status fitur berubah? → Update `06_FEATURE_LIST.md`
- [ ] Apakah prioritas/timeline berubah? → Update `07_ROADMAP.md`
- [ ] Apakah ada dampak pada coding standard? → Update `09_CODING_STANDARD.md`

---

## 12. Workflow Testing

### 12.1 Sebelum Testing

- Pastikan tidak ada error sintaks
- Pastikan tidak ada error di console browser
- Pastikan data test sudah tersedia

### 12.2 Jenis Testing

| Jenis | Fokus | Tools |
|---|---|---|
| **Functional** | Fitur berjalan sesuai spesifikasi | Manual test case dari `08_AI_PROMPT_GUIDE.md` template |
| **Regression** | Fitur lain tidak rusak | Cek modul terkait yang berbagi service/repository/komponen |
| **Edge Cases** | Input tidak valid, null, empty, batas | Manual test case |
| **Responsive** | Tampilan di tablet 10", desktop, mobile | Browser DevTools |
| **Error Handling** | Aplikasi tidak crash saat error | Simulasi error (data kosong, koneksi putus) |
| **Business Rules** | Aturan bisnis terimplementasi | Cek setiap BR yang relevan |

### 12.3 Kriteria Testing Lulus

- Semua fungsionalitas dasar berjalan sesuai spesifikasi
- Tidak ada error di console browser
- Tidak ada warning JavaScript
- Responsive di tablet 10" landscape (target utama)
- Business rules yang relevan terpenuhi
- Edge cases yang diketahui tertangani

### 12.4 Larangan Saat Testing

- Jangan skip testing karena "perubahan kecil"
- Jangan skip regression testing karena "tidak mungkin berdampak"
- Jangan abaikan warning di console browser
- Jangan test hanya di satu browser (minimal Chrome + Edge)

---

## 13. Checklist Sebelum Implementasi

Sebelum menulis kode, AI harus memastikan:

- [ ] **Tujuan tugas jelas** — apa yang harus dicapai, output apa yang diharapkan
- [ ] **Ruang lingkup dipahami** — file mana yang akan dibuat/diubah, modul mana yang terdampak
- [ ] **Tidak ada konflik dengan dokumentasi** — implementasi tidak bertentangan dengan blueprint, database, business rules
- [ ] **Modul terdampak telah diidentifikasi** — service, repository, komponen, halaman yang perlu diubah
- [ ] **Risiko diketahui** — potensi masalah sudah diidentifikasi dan dimitigasi
- [ ] **Dokumen relevan sudah dibaca** — 11_AI_CONTEXT.md + dokumen spesifik sesuai jenis tugas
- [ ] **Tidak ada duplikasi** — solusi yang sama belum ada di codebase
- [ ] **Dependensi tersedia** — modul/service/komponen yang dibutuhkan sudah ada atau akan dibuat

---

## 14. Checklist Setelah Implementasi

Setelah selesai implementasi, AI harus memastikan:

- [ ] **Fitur sesuai kebutuhan** — implementasi menyelesaikan masalah yang diminta
- [ ] **Business Rules dipatuhi** — semua aturan bisnis yang relevan terimplementasi
- [ ] **Coding Standard dipatuhi** — `09_CODING_STANDARD.md` tidak dilanggar
- [ ] **Struktur proyek dipatuhi** — `10_PROJECT_STRUCTURE.md` tidak dilanggar
- [ ] **Dokumentasi diperbarui** — dokumen yang terdampak sudah diupdate
- [ ] **Tidak ada error** — console bersih, tidak ada syntax error
- [ ] **Responsive** — tampilan baik di tablet 10" dan desktop
- [ ] **Tidak ada inline style / inline event** — DOM terpisah dari logic
- [ ] **Semua state component tercover** — loading, empty, error, normal
- [ ] **Data konsisten** — soft delete, audit trail, snapshot rules terpenuhi
- [ ] **Siap diuji** — tidak ada TODO/FIXME, tidak ada placeholder

---

## 15. Definition of Ready

Sebuah tugas **boleh mulai dikerjakan** jika:

| Kriteria | Deskripsi |
|---|---|
| **Tujuan jelas** | Ada deskripsi yang menjelaskan apa yang harus dicapai |
| **Ruang lingkup jelas** | Batasan tugas diketahui — apa yang termasuk dan tidak termasuk |
| **Dependensi diketahui** | Modul, service, data, atau library yang dibutuhkan teridentifikasi |
| **Dokumen acuan tersedia** | Dokumen 01–12 yang relevan sudah dibaca dan dipahami |
| **Tidak ada konflik besar** | Tidak ada perubahan arsitektur atau business rules tanpa persetujuan |
| **Risiko sudah diidentifikasi** | Potensi masalah diketahui, mitigasi sudah dipertimbangkan |

### 15.1 Jika Definition of Ready Belum Terpenuhi

AI harus:

1. Identifikasi kriteria mana yang belum terpenuhi
2. Tanyakan ke user untuk memperjelas
3. Jangan mulai implementasi sampai semua kriteria terpenuhi

---

## 16. Definition of Done

Sebuah tugas **dianggap selesai** jika:

| Kriteria | Deskripsi |
|---|---|
| **Implementasi selesai** | Semua kode yang diperlukan sudah ditulis |
| **Testing lulus** | Fungsional, edge cases, error handling, responsive sudah diuji |
| **Tidak ada error** | Console browser bersih, tidak ada syntax/runtime error |
| **Dokumentasi diperbarui** | Semua dokumen yang terdampak sudah sinkron dengan implementasi |
| **Tidak ada bug kritis** | Tidak ada data loss, crash, atau fungsi utama yang rusak |
| **Coding Standard dipatuhi** | `09_CODING_STANDARD.md` tidak dilanggar |
| **Business Rules dipatuhi** | `03_BUSINESS_RULES.md` yang relevan terimplementasi dengan benar |
| **Struktur proyek dipatuhi** | `10_PROJECT_STRUCTURE.md` tidak dilanggar |
| **Tidak ada duplikasi kode** | Solusi yang sama belum ada di tempat lain |
| **Tidak ada TODO/FIXME** | Kode final siap pakai, tidak ada placeholder |
| **Komunikasi selesai** | Ringkasan perubahan sudah disampaikan ke user |

---

## 17. Risk Management

### 17.1 Risk Register

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| **Perubahan kebutuhan** | Pekerjaan selesai tapi tidak sesuai | Medium | Verifikasi kebutuhan di awal. Konfirmasi dengan user. Dokumentasi sebagai acuan |
| **Perubahan struktur database** | Data existing tidak compatible, migration gagal | Low | Backup sebelum migration. Test migration dengan data dummy. Rollback plan |
| **Perubahan UI** | Inkonsistensi visual, komponen tidak reusable | Medium | Ikuti UI Design System. Ekstensi komponen, bukan duplikasi |
| **Konflik antar modul** | Service/repository berbagi data tidak sinkron | Medium | Definisikan antarmuka modul dengan jelas. Hindari circular dependency |
| **Performa buruk** | Query lambat, render lambat, startup lambat | Medium | Gunakan IndexedDB index. Pagination default 25. Debounce search. Lazy load |
| **Kapasitas penyimpanan browser** | IndexedDB penuh (limit ~50MB-1GB tergantung browser) | Low | Kompresi data. Hapus data lama (housekeeping). Peringatan sebelum penuh |
| **Kehilangan data** | Data transaksi hilang karena bug atau human error | Low | Backup otomatis tiap 6 jam. Auto-backup sebelum restore. Audit trail |
| **Regresi** | Fitur existing rusak karena perubahan baru | Medium | Regression testing. Isolasi perubahan. Small increment |
| **Kesalahan asumsi AI** | Implementasi tidak sesuai konteks proyek | High | Baca dokumen sebelum coding. Tanya jika tidak yakin. Verifikasi dengan user |
| **Browser tidak support** | IndexedDB tidak tersedia / PWA tidak bisa install | Low | Deteksi fitur browser. Fallback warning. Target Chrome 90+ |

### 17.2 Strategi Mitigasi Umum

| Strategi | Penerapan |
|---|---|
| **Backup sebelum perubahan** | Backup data sebelum migration, restore, atau perubahan besar |
| **Test di lingkungan terisolasi** | Gunakan data dummy untuk development/test. Jangan test langsung di data produksi |
| **Incremental change** | Perubahan kecil per langkah. Mudah di-review, di-test, di-rollback |
| **Dokumentasi sebagai acuan** | Semua keputusan tercatat. Jika ada keraguan, cek dokumen |
| **Konfirmasi dengan user** | Jika tidak yakin, tanya. Jangan membuat asumsi |

---

## 18. Decision Making

### 18.1 Prinsip

Jika terdapat beberapa alternatif solusi, AI tidak boleh memilih secara diam-diam.

### 18.2 Format Presentasi Alternatif

```
## Alternatif Solusi

### Opsi A: {nama singkat}
Kelebihan:
- {kelebihan 1}
- {kelebihan 2}
Kekurangan:
- {kekurangan 1}
- {kekurangan 2}

### Opsi B: {nama singkat}
Kelebihan:
- {kelebihan 1}
Kekurangan:
- {kekurangan 1}
- {kekurangan 2}

### Rekomendasi: Opsi A
Alasan: {alasan berdasarkan konteks proyek, arsitektur, dan prioritas}
```

### 18.3 Kapan Decision Making Diperlukan

- Arsitektur berubah
- Library baru diperlukan
- Ada konflik antara dua pendekatan yang sama-sama valid
- Perubahan mempengaruhi lebih dari satu modul
- Ada trade-off antara performa, maintainability, dan kecepatan pengembangan

### 18.4 Larangan

- Jangan memilih solusi tanpa menjelaskan alternatif
- Jangan mengubah arsitektur tanpa persetujuan
- Jangan menambah library tanpa persetujuan
- Jangan mengasumsikan preferensi user

---

## 19. AI Communication Standard

### 19.1 Format Ringkasan Hasil Pekerjaan

Setelah menyelesaikan tugas, AI harus memberikan ringkasan dengan format berikut:

```
## Ringkasan
{Deskripsi singkat apa yang dilakukan}

## File yang Diubah/Dibuat
- {path/file} — {dibuat/dimodifikasi} — {perubahan singkat}

## Dampak
- {modul terdampak}: {deskripsi dampak}
- {modul lain}: {tidak ada dampak / sebutkan}

## Risiko
- {risiko yang tersisa, jika ada}
- {hal yang perlu diwaspadai}

## Langkah Selanjutnya (Opsional)
- {langkah yang disarankan setelah ini}
```

### 19.2 Format Rencana Sebelum Bekerja

Untuk tugas kompleks, AI harus memberikan rencana sebelum mulai:

```
## Rencana
Tujuan: {deskripsi tujuan}

Langkah:
1. {langkah 1} — {file terdampak}
2. {langkah 2} — {file terdampak}

Dampak: {modul terdampak}
Risiko: {risiko yang teridentifikasi}
Estimasi: {jumlah file, perkiraan baris kode}

Setuju? (Y/T)
```

### 19.3 Gaya Komunikasi

| Situasi | Gaya |
|---|---|
| Memberikan rencana | Terstruktur, bullet points, langsung |
| Melaporkan hasil | Ringkas, sebut file dan perubahan |
| Menanyakan keputusan | Jelas, berikan opsi + rekomendasi |
| Melaporkan masalah | Root cause + solusi yang diusulkan |
| Menjawab pertanyaan | Langsung ke jawaban, tanpa basa-basi |

---

## 20. Continuous Improvement

### 20.1 Bagaimana Workflow Berkembang

Workflow ini adalah **living document**. Perubahan dapat terjadi karena:

| Sumber Perubahan | Contoh |
|---|---|
| **Penambahan modul baru** | Modul baru mungkin memerlukan langkah verifikasi tambahan |
| **Penambahan jenis testing** | Integration test, performance test, security test |
| **Penambahan proses review** | Security review, accessibility review, performance review |
| **Penambahan standar keamanan** | Aturan baru untuk data sensitif, enkripsi, audit |
| **Umpan balik dari pengalaman** | Langkah yang ternyata tidak efektif dihilangkan atau dimodifikasi |
| **Perubahan tool/teknologi** | Tool baru untuk testing, code quality, documentation |

### 20.2 Proses Perubahan Workflow

1. Identifikasi kebutuhan perubahan (dari pengalaman, feedback, atau kebutuhan baru)
2. Usulkan perubahan — jelaskan mengapa dan bagaimana
3. Diskusikan dengan tim/manusia
4. Jika disetujui, update `12_DEVELOPMENT_WORKFLOW.md`
5. Komunikasikan perubahan ke semua developer dan AI

### 20.3 Prinsip Perubahan

- Jangan mengubah workflow untuk satu kasus spesifik — buat aturan umum
- Perubahan harus menyederhanakan atau meningkatkan kualitas, bukan menambah birokrasi
- Workflow harus tetap ringkas — informasi detail ada di dokumen lain (08, 09, 10)
- Jika workflow berubah, update juga `11_AI_CONTEXT.md` jika ringkasan berubah

---

## 21. Aturan Kerja AI

### 21.1 Selama Bekerja

| # | Aturan |
|---|---|
| 1 | **Selalu mulai dari analisis** — jangan langsung membuat kode tanpa memahami konteks |
| 2 | **Baca dokumen yang relevan** sebelum menulis kode — baca 11_AI_CONTEXT.md dulu |
| 3 | **Jangan mengubah ruang lingkup** tugas tanpa persetujuan |
| 4 | **Dokumentasikan perubahan penting** — update dokumen yang terdampak |
| 5 | **Prioritaskan kualitas daripada kecepatan** — kode bersih > kode cepat |
| 6 | **Satu perubahan kecil per langkah** — jangan buat 5 perubahan dalam satu commit |
| 7 | **Tanya jika tidak yakin** — jangan membuat asumsi |
| 8 | **Jangan melebihi ruang lingkup** — jangan perbaiki hal yang tidak diminta |
| 9 | **Ikuti semua checklist** — sebelum dan sesudah implementasi |
| 10 | **Akui keterbatasan** — jika tidak bisa menyelesaikan, laporkan |

### 21.2 Prioritas Selama Bekerja

1. **Kebenaran** — kode harus benar secara fungsional dan sesuai business rules
2. **Konsistensi** — kode harus konsisten dengan dokumentasi dan kode existing
3. **Maintainability** — kode harus mudah dibaca dan dirawat
4. **Performa** — kode harus efisien, terutama query IndexedDB
5. **Keamanan** — data sensitif dilindungi, RBAC dijalankan

### 21.3 Jika Terjadi Kesalahan

- Akui kesalahan segera
- Jelaskan apa yang salah dan mengapa
- Usulkan solusi perbaikan
- Jangan menyembunyikan kesalahan

---

## 22. Daftar Dokumen Terkait

| Dokumen | Fungsi dalam Workflow |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Prinsip dasar, arsitektur, batasan teknis |
| `02_DATABASE_SCHEMA.md` | Acuan perubahan database |
| `03_BUSINESS_RULES.md` | Acuan validasi business rules |
| `04_UI_DESIGN_SYSTEM.md` | Acuan perubahan UI |
| `05_COMPONENT_LIBRARY.md` | Acuan pembuatan/perubahan komponen |
| `06_FEATURE_LIST.md` | Prioritas fitur, status, dependensi |
| `07_ROADMAP.md` | Fase pengembangan, timeline |
| `08_AI_PROMPT_GUIDE.md` | Template prompt, checklist AI |
| `09_CODING_STANDARD.md` | Standar penulisan kode |
| `10_PROJECT_STRUCTURE.md` | Struktur folder, dependency rule |
| `11_AI_CONTEXT.md` | Ringkasan proyek untuk AI |
| `12_DEVELOPMENT_WORKFLOW.md` | **(dokumen ini)** SOP pengembangan |

---

> **Dokumen ini adalah SOP resmi pengembangan POS Offline PWA.**  
> Seluruh AI Coding Assistant dan developer manusia wajib mengikuti alur kerja ini.  
> Konsisten dengan seluruh dokumen `01_PROJECT_BLUEPRINT.md` s.d. `11_AI_CONTEXT.md`.

---

*POS Offline PWA — Development Workflow v1.0.0 — 15 Juli 2026*
