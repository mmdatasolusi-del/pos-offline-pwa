# 08_AI_PROMPT_GUIDE.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi](#2-filosofi)
3. [Sebelum Mengerjakan Tugas](#3-sebelum-mengerjakan-tugas)
4. [Prioritas Dokumen](#4-prioritas-dokumen)
5. [Workflow AI](#5-workflow-ai)
6. [Format Jawaban AI](#6-format-jawaban-ai)
7. [Aturan Implementasi](#7-aturan-implementasi)
8. [Prompt Template — Membuat File Baru](#8-prompt-template--membuat-file-baru)
9. [Prompt Template — Modul & Komponen](#9-prompt-template--modul--komponen)
10. [Prompt Template — Service & Repository](#10-prompt-template--service--repository)
11. [Prompt Template — Database & Data](#11-prompt-template--database--data)
12. [Prompt Template — Laporan & Ekspor](#12-prompt-template--laporan--ekspor)
13. [Prompt Template — Scanner & Hardware](#13-prompt-template--scanner--hardware)
14. [Prompt Template — Refactor](#14-prompt-template--refactor)
15. [Prompt Template — Bug Fix](#15-prompt-template--bug-fix)
16. [Prompt Template — Review](#16-prompt-template--review)
17. [Prompt Template — Testing](#17-prompt-template--testing)
18. [Prompt Template — Dokumentasi](#18-prompt-template--dokumentasi)
19. [Checklist AI](#19-checklist-ai)
20. [Hal yang Dilarang](#20-hal-yang-dilarang)
21. [Best Practice](#21-best-practice)
22. [AI Memory](#22-ai-memory)
23. [Future AI Support](#23-future-ai-support)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **panduan operasional resmi** untuk AI Coding Assistant yang bekerja pada proyek POS Offline PWA. Dokumen ini mendefinisikan bagaimana AI harus berpikir, merencanakan, mengimplementasikan, memvalidasi, dan mendokumentasikan kode.

Dokumen ini **bukan untuk pengguna akhir aplikasi** — melainkan untuk AI seperti OpenCode, Cursor, Claude Code, Codex CLI, GitHub Copilot, dan AI Coding Assistant sejenis.

### 1.2 Siapa yang Membaca Dokumen Ini

| Pembaca | Kegunaan |
|---|---|
| **AI Coding Assistant** | Panduan utama dalam mengerjakan tugas pengembangan |
| **Developer Manusia** | Memahami bagaimana AI bekerja, mengevaluasi output AI |
| **Project Manager** | Standar kualitas yang diharapkan dari AI |

### 1.3 Acuan

| Dokumen | Peran |
|---|---|
| `01_PROJECT_BLUEPRINT.md` | Visi, arsitektur, stack, struktur folder, standar kode |
| `02_DATABASE_SCHEMA.md` | Entitas, relasi, field, aturan integritas |
| `03_BUSINESS_RULES.md` | 168 aturan bisnis yang mengatur perilaku fitur |
| `04_UI_DESIGN_SYSTEM.md` | Warna, tipografi, spacing, layout, template halaman |
| `05_COMPONENT_LIBRARY.md` | 70+ komponen UI — spesifikasi, state, komposisi |
| `06_FEATURE_LIST.md` | 88 fitur — prioritas, dependensi, role, status |
| `07_ROADMAP.md` | 13 fase pengembangan, versi, timeline |

---

## 2. Filosofi

### 2.1 Documentation Driven Development

**Dokumen adalah kebenaran tertinggi.** AI tidak boleh menulis kode yang bertentangan dengan dokumen proyek. Jika kode memerlukan perubahan yang tidak tercakup di dokumen, dokumen harus diperbarui **sebelum** kode ditulis.

**Alasan**: Proyek ini dikerjakan oleh banyak AI dan developer dalam jangka panjang. Tanpa dokumentasi yang akurat, akan terjadi inkonsistensi dan kebingungan.

### 2.2 AI Assisted Development

AI adalah **asisten** — bukan pengganti developer manusia. AI mengusulkan, manusia menyetujui. AI tidak boleh mengambil keputusan arsitektur tanpa persetujuan.

**Alasan**: Keputusan arsitektur memiliki dampak jangka panjang. Manusia yang bertanggung jawab atas produk harus terlibat.

### 2.3 Reusable Prompt

Prompt dan template dalam dokumen ini dirancang untuk dapat digunakan kembali (copy-paste) untuk tugas serupa. AI harus menggunakan template yang ada daripada membuat prompt dari nol.

**Alasan**: Menghemat waktu, konsistensi output, mengurangi kesalahan.

### 2.4 Small Increment

Setiap tugas AI harus menghasilkan perubahan yang kecil dan terfokus. Satu prompt = satu tujuan. Hindari perubahan besar dalam satu kali permintaan.

**Alasan**: Perubahan kecil lebih mudah direview, di-test, dan di-rollback jika terjadi kesalahan.

### 2.5 Continuous Improvement

Panduan ini dievaluasi dan diperbarui secara berkala. Jika AI menemukan cara yang lebih baik untuk melakukan sesuatu, AI harus mendokumentasikannya.

**Alasan**: Teknologi AI berkembang cepat. Panduan yang statis akan cepat usang.

### 2.6 Single Source of Truth

Tidak boleh ada duplikasi informasi. Jika suatu informasi muncul di lebih dari satu dokumen, informasi tersebut harus konsisten. Jika ada perubahan, semua dokumen yang relevan harus diperbarui.

**Alasan**: Informasi yang bertentangan menyebabkan kebingungan dan bug.

---

## 3. Sebelum Mengerjakan Tugas

### 3.1 Protokol Wajib

Sebelum AI menulis kode apa pun, AI **wajib** melakukan langkah berikut:

| # | Langkah | Deskripsi |
|---|---|---|
| 1 | **Baca dokumen relevan** | Baca dokumen di `docs/` yang terkait dengan tugas |
| 2 | **Pahami konteks** | Identifikasi modul, komponen, service, repository yang sudah ada |
| 3 | **Identifikasi dependensi** | Cek apakah ada modul lain yang perlu dimodifikasi |
| 4 | **Cek konflik** | Pastikan implementasi tidak bertentangan dengan dokumen mana pun |
| 5 | **Cari duplikasi** | Pastikan tidak membuat ulang fungsi/komponen yang sudah ada |
| 6 | **Ringkasan** | Berikan ringkasan rencana sebelum mulai (jika diminta atau jika tugas kompleks) |

### 3.2 Urutan Membaca Dokumen

| Prioritas | Dokumen | Kapan Dibaca |
|---|---|---|
| 1 | `01_PROJECT_BLUEPRINT.md` | **Setiap kali memulai sesi baru** — pahami arsitektur dan aturan |
| 2 | `02_DATABASE_SCHEMA.md` | Jika tugas menyangkut data |
| 3 | `03_BUSINESS_RULES.md` | Jika tugas menyangkut logika bisnis |
| 4 | `04_UI_DESIGN_SYSTEM.md` | Jika tugas menyangkut UI |
| 5 | `05_COMPONENT_LIBRARY.md` | Jika tugas menyangkut komponen UI |
| 6 | `06_FEATURE_LIST.md` | Untuk memahami prioritas dan dependensi fitur |
| 7 | `07_ROADMAP.md` | Untuk memahami fase pengembangan saat ini |
| 8 | `08_AI_PROMPT_GUIDE.md` | **Dokumen ini** — baca di awal sesi |

### 3.3 Contoh Ringkasan Sebelum Bekerja

```
📋 Rencana:
1. Buat file: src/pages/products/product-list.js
2. Gunakan komponen: AppTable, AppSearchBox, AppButton, AppPagination
3. Service: ProductService.getAll(), ProductService.search()
4. Repository: ProductRepository
5. Dampak: Tidak ada perubahan pada modul lain
6. Risiko: Tidak ada
```

---

## 4. Prioritas Dokumen

### 4.1 Hierarki Dokumen

Jika terjadi konflik antara dokumen, gunakan urutan prioritas berikut (1 = tertinggi):

| Prioritas | Dokumen | Alasan |
|---|---|---|
| **1** | `01_PROJECT_BLUEPRINT.md` | Arsitektur dan aturan paling fundamental |
| **2** | `02_DATABASE_SCHEMA.md` | Struktur data — jika berubah, semua layer terpengaruh |
| **3** | `03_BUSINESS_RULES.md` | Aturan bisnis — jika dilanggar, aplikasi salah secara fungsional |
| **4** | `04_UI_DESIGN_SYSTEM.md` | Desain visual — konsistensi UI |
| **5** | `05_COMPONENT_LIBRARY.md` | Spesifikasi komponen |
| **6** | `06_FEATURE_LIST.md` | Prioritas fitur |
| **7** | `07_ROADMAP.md` | Urutan pengembangan |
| **8** | (Coding standard yang ada di blueprint) | Aturan teknis |

### 4.2 Cara Mengambil Keputusan Saat Konflik

| Skenario | Tindakan |
|---|---|
| Blueprint vs Database Schema | **Blueprint menang** — arsitektur adalah fondasi |
| Business Rules vs UI Design | **Business Rules menang** — fungsi > tampilan |
| Component Library vs UI Design | **UI Design menang** — token desain lebih fundamental |
| Roadmap vs Feature List | **Roadmap menang** — urutan pengembangan |
| Semua konflik | **Tanyakan ke manusia** — AI tidak boleh memutuskan sendiri |

---

## 5. Workflow AI

Setiap tugas yang diberikan ke AI harus melalui workflow berikut:

```
Analisis → Perencanaan → Implementasi → Validasi → Testing → Review → Update Dokumentasi → Selesai
```

### 5.1 Tahap 1 — Analisis

| Aktivitas | Output |
|---|---|
| Baca dokumen relevan | Daftar dokumen yang sudah dibaca |
| Identifikasi dependensi | Modul/komponen yang terpengaruh |
| Cek kode yang sudah ada | Apakah ada yang bisa di-reuse |
| Identifikasi risiko | Potensi masalah |

### 5.2 Tahap 2 — Perencanaan

| Aktivitas | Output |
|---|---|
| Tentukan file yang akan dibuat/diubah | Daftar file |
| Tentukan pendekatan implementasi | Strategi teknis |
| Tentukan urutan langkah | Step-by-step |

### 5.3 Tahap 3 — Implementasi

| Aktivitas | Output |
|---|---|
| Tulis kode sesuai perencanaan | File yang dimodifikasi |
| Ikuti coding standard | Kode konsisten |
| Satu langkah = satu perubahan kecil | Perubahan fokus |

### 5.4 Tahap 4 — Validasi

| Aktivitas | Output |
|---|---|
| Cek konsistensi dengan dokumen | Tidak ada konflik |
| Cek duplikasi kode | Tidak ada duplikasi |
| Cek error sintaks | Kode siap running |

### 5.5 Tahap 5 — Testing

| Aktivitas | Output |
|---|---|
| Test secara manual (jika bisa) | Fungsi berjalan |
| Pastikan tidak merusak fitur lain | Regression OK |

### 5.6 Tahap 6 — Review

| Aktivitas | Output |
|---|---|
| Review kode terhadap checklist AI | Semua item checklist terpenuhi |
| Siapkan catatan untuk reviewer | Penjelasan perubahan |

### 5.7 Tahap 7 — Update Dokumentasi

| Aktivitas | Output |
|---|---|
| Update CHANGELOG jika perubahan signifikan | CHANGELOG terbaru |
| Update Feature List jika ada perubahan fitur | Status fitur terbaru |
| Update dokumen lain yang relevan | Semua dokumen sinkron |

### 5.8 Tahap 8 — Selesai

| Aktivitas | Output |
|---|---|
| Ringkasan apa yang sudah dilakukan | Pesan ke user |
| Sebutkan file yang berubah | Daftar file |
| Sebutkan hal yang perlu diperhatikan | Catatan |

---

## 6. Format Jawaban AI

### 6.1 Struktur Jawaban

AI harus merespons dengan format berikut ketika menyelesaikan tugas:

```
## Ringkasan
{Deskripsi singkat apa yang dilakukan}

## File yang Diubah
- src/pages/products/product-list.js — dibuat
- src/services/product-service.js — dimodifikasi (tambah method getAll)

## Dampak
- Tidak ada perubahan pada modul lain
- Product list page sekarang menggunakan ProductService

## Catatan
- Pagination menggunakan offset-based (bukan cursor)
- Butuh testing dengan data dummy > 100 items untuk validasi performa
```

### 6.2 Kapan Memberikan Rencana

AI harus memberikan rencana di awal jika:

- Tugas kompleks (lebih dari 3 file)
- Tugas melibatkan perubahan arsitektur
- Diminta secara eksplisit oleh user
- AI tidak yakin dengan pendekatan terbaik

### 6.3 Gaya Bahasa

| Situasi | Gaya |
|---|---|
| Menjelaskan rencana | Langsung, terstruktur, bullet points |
| Menjelaskan implementasi | Teknis, spesifik, sebut file dan baris |
| Menjelaskan masalah | Jelas, sebut root cause, tawarkan solusi |
| Menjawab pertanyaan | Langsung ke jawaban, tanpa basa-basi |

---

## 7. Aturan Implementasi

### 7.1 Aturan Wajib

| # | Aturan | Pelanggaran |
|---|---|---|
| 1 | **Ubah seminimal mungkin** — hanya file yang relevan dengan tugas | Membuat perubahan pada file yang tidak terkait |
| 2 | **Jangan refactor besar tanpa diminta** — perbaiki bug, jangan redesign | Mengubah arsitektur tanpa izin |
| 3 | **Jangan ubah struktur folder** — ikuti struktur yang sudah ditetapkan di blueprint | Membuat folder baru di luar struktur |
| 4 | **Jangan hapus file tanpa konfirmasi** — tanya dulu | Menghapus file yang masih digunakan |
| 5 | **Jangan buat kode bertentangan dengan dokumen** — blueprint, DB, business rules | Melanggar aturan yang sudah ditetapkan |
| 6 | **Satu file = satu concern** — tidak ada god file | File dengan > 300 line tanpa pemisahan jelas |
| 7 | **JSDoc pada semua fungsi export** — dokumentasi inline | Fungsi tanpa JSDoc |
| 8 | **Tidak ada TODO placeholder** — kode harus siap pakai | TODO, FIXME, HACK dalam kode final |

### 7.2 Aturan Layer

| Layer | Boleh | Tidak Boleh |
|---|---|---|
| **UI Layer** (pages/, components/) | Render HTML, attach event, validasi UI | Akses IndexedDB langsung, logic bisnis |
| **Service Layer** (services/) | Business logic, validasi, koordinasi | Manipulasi DOM |
| **Repository Layer** (repositories/) | Query IndexedDB, CRUD data | Business logic |
| **Database Layer** | Schema, migration, index | - |

### 7.3 Aturan Kode

| Aspek | Standar |
|---|---|
| **Import** | ES Modules (`import/export`) |
| **Variable** | `const` first, `let` jika reassignment, no `var` |
| **Async** | `async/await` over raw Promise |
| **Equality** | `===` dan `!==` |
| **Null safety** | Optional chaining `?.`, nullish coalescing `??` |
| **Logging** | `console.log` untuk development saja |
| **CSS** | Bootstrap utility classes. No inline style |
| **Event** | Event delegation jika memungkinkan |

---

## 8. Prompt Template — Membuat File Baru

### 8.1 Template: Membuat Halaman Baru

```
Buat halaman {nama halaman} di {path/file}.

Tujuan: {deskripsi singkat tujuan halaman}

Route: {path route}

Fitur yang diimplementasikan:
- {fitur 1}
- {fitur 2}

Komponen yang digunakan:
- {komponen 1}
- {komponen 2}

Service yang dipanggil:
- {service 1}
- {service 2}

Layout: {AppLayout / POS Layout / Auth Layout}

Role akses: {Admin, Manager, Kasir, Owner}

State halaman:
- Loading
- Empty
- Error
- Normal

Catatan:
- {catatan tambahan}
```

### 8.2 Template: Membuat Modul Baru

```
Buat modul {nama modul} di {path}.

Tujuan modul: {deskripsi}

Fitur dalam modul:
1. {fitur 1} — {ID fitur dari FEATURE_LIST}
2. {fitur 2} — {ID fitur}

Entitas database terkait:
- {entitas 1} (lihat DATABASE_SCHEMA section {X})
- {entitas 2}

Halaman yang diperlukan:
1. {nama halaman} — {route}
2. {nama form} — modal/dialog

Service: {nama service yang sudah ada atau perlu dibuat}

Repository: {nama repository yang sudah ada atau perlu dibuat}

Komponen baru yang perlu dibuat:
- {komponen 1}
- {komponen 2}

Dependensi modul lain:
- {modul 1}
- {modul 2}

Prioritas (dari FEATURE_LIST): {Critical/High/Medium/Low}
Target fase (dari ROADMAP): {Phase X}

Ikuti struktur folder yang sudah ditetapkan di PROJECT_BLUEPRINT section 7.
```

### 8.3 Template: Membuat Komponen Baru

```
Buat komponen {NamaKomponen} di {path}.

Tujuan: {deskripsi}

Kategori: {Layout/Navigation/Form/Button/DataDisplay/Feedback/Overlay/POS/Cafe/Dashboard/Setting}

Props/Attributes:
- {prop1}: {tipe} — {deskripsi}
- {prop2}: {tipe} — {deskripsi}

State:
- Default: {deskripsi visual}
- Hover: {perubahan}
- Active: {perubahan}
- Disabled: {opacity, cursor}
- Error: {border, helper text}
- Loading: {spinner}

Variasi:
1. {variasi 1} — {penggunaan}
2. {variasi 2} — {penggunaan}

Ukuran:
- Sm: {dimensi}
- Md: {dimensi}
- Lg: {dimensi}

Aksesibilitas:
- Role: {ARIA role}
- Keyboard: {interaksi keyboard}
- Label: {aria-label atau label eksplisit}

Gunakan token desain dari UI_DESIGN_SYSTEM:
- Warna: {token}
- Spacing: {token}
- Radius: {token}
- Shadow: {level}

Lihat spesifikasi lengkap di COMPONENT_LIBRARY section {X}.
```

---

## 9. Prompt Template — Modul & Komponen

### 9.1 Template: Membuat Form

```
Buat form {nama form} untuk {entitas}.

Flow:
1. User membuka form (modal/halaman)
2. Form diisi dengan data existing (jika edit) atau kosong (jika tambah)
3. Validasi: {required fields, format validations}
4. Submit: panggil {service}.{method}()
5. Sukses: tampilkan toast "{pesan sukses}", tutup form, refresh list
6. Error: tampilkan error alert di form

Field:
1. {field 1} — tipe: {text/number/currency/select/date/textarea} — required: {ya/tidak}
2. {field 2} — tipe: {text/number/currency/select/date/textarea} — required: {ya/tidak}

Validasi:
- {field}: {aturan validasi}
- {field}: {aturan validasi}

Komponen form yang digunakan:
- AppInput, AppSelect, AppCurrencyInput, AppButton, AppAlert, AppModal

Business rules yang relevan (dari BUSINESS_RULES):
- BR-{XXX}: {aturan}
```

### 9.2 Template: Membuat Tabel

```
Buat tabel data untuk {entitas} di halaman {halaman}.

Kolom:
1. {kolom 1} — {lebar, alignment}
2. {kolom 2} — {lebar, alignment}
3. Aksi — {icon button: edit, hapus, duplicate}

Data source: {service}.{method}()

Fitur:
- Search: AppSearchBox — cari berdasarkan {field}
- Filter: AppSelect — filter by {field}
- Sort: klik header
- Pagination: AppPagination — {limit} items per page
- Empty state: AppEmptyState — "{pesan}"
- Loading: AppSkeleton

Aksi:
- Tambah: tombol "Tambah {entitas}" — buka form modal
- Edit: icon pencil — buka form modal dengan data existing
- Hapus: icon trash — AppConfirmDialog — panggil {service}.delete()

Komponen:
- AppTable, AppSearchBox, AppSelect, AppPagination, AppEmptyState, AppSkeleton
- AppButton, AppIconButton, AppConfirmDialog
```

### 9.3 Template: Membuat Dialog

```
Buat dialog konfirmasi untuk aksi {deskripsi aksi}.

Trigger: {kapan dialog muncul — klik tombol hapus/void/cancel}

Isi dialog:
- Icon: AlertTriangle (untuk destruktif) / Info (untuk informasi)
- Judul: "{judul}"
- Pesan: "{pesan konfirmasi}"
- Tombol kiri: "Batal" — variant secondary
- Tombol kanan: "{aksi}" — variant danger (destruktif) / primary (non-destruktif)

Aksi setelah konfirmasi:
1. Panggil {service}.{method}()
2. Sukses: toast "{pesan sukses}", refresh data
3. Error: toast "{pesan error}"

Komponen: AppConfirmDialog

Business rules:
- BR-{XXX}: {aturan yang relevan — misal void wajib alasan}
```

### 9.4 Template: Membuat Setting

```
Buat halaman setting untuk {nama setting group}.

Setting items:
1. {key 1} — tipe: {text/number/boolean/select} — default: {value} — deskripsi: {deskripsi}
2. {key 2} — tipe: {text/number/boolean/select} — default: {value} — deskripsi: {deskripsi}

Layout:
- Section per group
- Setiap item: label + input + deskripsi
- Tombol simpan di footer

Komponen:
- AppInput, AppToggle, AppSelect, AppButton

Penyimpanan:
- Service: SettingService.get(key), SettingService.set(key, value)
- Database: tabel settings (key-value)

Referensi:
- DATABASE_SCHEMA section 5.4 (Setting)
- BUSINESS_RULES CS-06 (Store Settings)
```

---

## 10. Prompt Template — Service & Repository

### 10.1 Template: Membuat Service

```
Buat service {NamaService} di services/{nama-service}.js.

Tujuan: {deskripsi bisnis — validasi, perhitungan, koordinasi}

Method:
1. async getAll(filter) -> Promise<{data, total}>
   - Query dari repository
   - Filter: {field1, field2}
   - Sort: {field}, {ASC/DESC}
   - Return: {data: items[], total: number}

2. async getById(id) -> Promise<object>
   - Validasi: id wajib
   - Return: item atau null

3. async create(data) -> Promise<object>
   - Validasi: {field wajib, format}
   - Business rules: BR-{XXX}, BR-{YYY}
   - Hitung: {perhitungan jika ada}
   - Simpan via repository
   - Audit: catat ke auditLog
   - Return: created item

4. async update(id, data) -> Promise<object>
   - Validasi: item exists
   - Business rules: BR-{XXX}
   - Simpan via repository
   - Audit: catat perubahan
   - Return: updated item

5. async delete(id) -> Promise<void>
   - Validasi: BOLEH dihapus? (cegah hard delete jika ada aturan soft delete)
   - Business rules: BR-{XXX}
   - Soft delete atau hard delete
   - Audit: catat

Tidak boleh mengakses IndexedDB langsung — gunakan repository.

Referensi business rules: BUSINESS_RULES section {X}.
Referensi entitas: DATABASE_SCHEMA section {X}.
```

### 10.2 Template: Membuat Repository

```
Buat repository {NamaRepository} di repositories/{nama-repository}.js.

Tujuan: {deskripsi akses data}

Entity: {nama tabel} (dari DATABASE_SCHEMA)

Method:
1. async getAll(options) -> Promise<{data, total}>
   - options: { filter, sort, page, limit }
   - Gunakan Dexie query dengan index yang sesuai
   - Return: { data: items[], total: count }

2. async getById(id) -> Promise<object | null>
   - Gunakan table.get(id)

3. async create(data) -> Promise<object>
   - Tambah field: id (UUID), createdAt, updatedAt
   - Gunakan table.add(data)
   - Return: created item dengan id

4. async update(id, changes) -> Promise<number>
   - Updated: updatedAt = new Date()
   - Gunakan table.update(id, changes)
   - Return: number of updated records

5. async delete(id) -> Promise<void>
   - Gunakan table.delete(id)
   - Atau soft delete: update deletedAt

6. async bulkAdd(items) -> Promise<number>
   - Untuk import
   - Gunakan table.bulkAdd(items)

7. async bulkDelete(ids) -> Promise<void>
   - Gunakan table.bulkDelete(ids)

Indexes (dari DATABASE_SCHEMA):
- {field 1}: unique / non-unique
- {field 2}: unique / non-unique

Tidak boleh berisi business logic — hanya query.
```

### 10.3 Template: Membuat Database Migration

```
Buat migration database untuk perubahan berikut:

Perubahan:
- {deskripsi perubahan — tambah tabel / tambah field / ubah index}

Detail teknis:
- Tabel: {nama tabel}
- Field baru: {field} — tipe: {tipe} — default: {value}
- Index baru: {field} — unique: {ya/tidak}
- Data migration: {deskripsi jika ada data yang perlu dipindah}

Gunakan Dexie version() untuk migration:
- Version baru: {current version + 1}
- Migration: {detail migration}

Referensi: DATABASE_SCHEMA section {X}

Wajib update DATABASE_SCHEMA.md setelah migration.
```

---

## 11. Prompt Template — Database & Data

### 11.1 Template: Menambah Field Database

```
Tambah field pada entitas {nama entitas} di tabel {nama tabel}.

Field baru:
- Nama: {field name}
- Tipe: {string/number/boolean/date/json}
- Wajib: {ya/tidak}
- Default: {value}
- Index: {ya/tidak — unique/non-unique}
- Deskripsi: {deskripsi}

Alasan: {alasan bisnis atau teknis}

Dampak:
- UI yang perlu diubah: {form, table, detail}
- Service yang perlu diubah: {validasi, perhitungan}
- Migration: perlu update Dexie schema version

Update dokumen:
- DATABASE_SCHEMA: tambah field di tabel {X}
- COMPONENT_LIBRARY: jika ada komponen baru terkait field ini
```

---

## 12. Prompt Template — Laporan & Ekspor

### 12.1 Template: Membuat Laporan

```
Buat halaman laporan {nama laporan} di {path}.

Jenis laporan: {penjualan/stok/keuangan/shift}

Filter:
- Date range: AppDatePicker (start + end)
- {filter tambahan}: {AppSelect, AppSearchBox}

Data source: {service}.{method}({startDate, endDate, filter})

Tabel laporan:
- Kolom: {kolom 1}, {kolom 2}, {kolom 3}
- Summary di footer: {total, subtotal, rata-rata}

Aksi:
- Export PDF: tombol — panggil exportPdf(data, filename)
- Export Excel: tombol — panggil exportExcel(data, filename)

Gunakan komponen:
- AppDatePicker, AppSelect, AppButton
- AppTable dengan footer summary
- AppKpiCard untuk total di atas tabel

Referensi:
- FEATURE_LIST: RP-{XX}
- BUSINESS_RULES: BR-{XXX}
- DATABASE_SCHEMA: entitas terkait
```

### 12.2 Template: Membuat Export PDF

```
Buat fungsi export PDF untuk {entitas/laporan}.

Library: jsPDF

Konten PDF:
- Header: nama toko (dari setting), judul laporan, periode
- Body: tabel dengan header dan data
- Footer: tanggal cetak, halaman

Layout:
- Font: mono untuk nominal
- Header: bold
- Tabel: border sederhana
- Summary: bold di baris terakhir

Input: data (array of objects), filename (string), title (string), period (string)

Output: download file PDF

Panggil dari: tombol export di halaman laporan

Service terkait: {service yang menyediakan data}
```

### 12.3 Template: Membuat Export Excel

```
Buat fungsi export Excel untuk {entitas/laporan}.

Library: SheetJS (xlsx)

Konten Excel:
- Sheet name: "{nama sheet}"
- Header row: bold, background biru muda
- Data rows: sesuai kolom
- Auto-width: sesuaikan lebar kolom
- Number format: currency untuk nominal

Input: data (array of objects), filename (string), columns (array of {header, key, type})

Output: download file .xlsx

Panggil dari: tombol export di halaman laporan

Service terkait: {service yang menyediakan data}
```

---

## 13. Prompt Template — Scanner & Hardware

### 13.1 Template: Membuat Barcode Scanner

```
Implementasi barcode scanner di halaman POS.

Mode:
1. Hardware scanner (default):
   - Fokus otomatis di search input
   - Scanner mengirim karakter seperti keyboard
   - Deteksi akhir input: Enter key (barcode selesai)
   - Cari produk berdasarkan barcode
   - Jika ditemukan: tambahkan ke cart
   - Jika tidak: tampilkan notifikasi "Produk tidak ditemukan"

2. Kamera scanner (fallback):
   - Tombol kamera di samping search
   - Buka kamera (gunakan QuaggaJS atau html5-qrcode)
   - Deteksi barcode 1D (EAN, UPC, Code128)
   - Hasil scan: sama dengan hardware

Library: html5-qrcode, QuaggaJS
Fallback: jika kamera tidak tersedia, sembunyikan tombol kamera

Referensi:
- COMPONENT_LIBRARY: AppBarcodeScanner (13.13)
- BUSINESS_RULES: BR-051 (stok cukup saat scan)
```

### 13.2 Template: Membuat QR Scanner

```
Implementasi QR scanner untuk pembayaran QRIS.

Flow:
1. POS menghitung grand total
2. Kasir pilih metode QRIS
3. Sistem generate QR code (berisi data pembayaran — untuk offline: QR statis toko)
4. Pelanggan scan dengan e-wallet
5. Kasir konfirmasi pembayaran (manual — karena offline)
6. Transaksi selesai

Library: html5-qrcode (untuk generate QR jika dinamis)

Mode offline: QR statis (berisi data toko, bukan nominal transaksi)
Mode online (v3.0): QR dinamis (berisi nominal + invoice)

Referensi:
- COMPONENT_LIBRARY: AppQrScanner (13.14)
- BUSINESS_RULES: BR-074 (QRIS payment flow)
```

---

## 14. Prompt Template — Refactor

### 14.1 Kapan Refactor Dilakukan

| Situasi | Lakukan Refactor? |
|---|---|
| Bug yang disebabkan oleh struktur kode buruk | ✅ Ya, minimal |
| Fitur baru membutuhkan perubahan arsitektur | ✅ Ya, setelah analisis |
| Kode duplikat ditemukan | ✅ Ya, gabungkan |
| Hanya perubahan kosmetik (nama variable) | ❌ Tidak, kecuali diminta |
| Performa buruk | ✅ Ya, optimasi |
| Tidak ada masalah | ❌ Jangan refactor tanpa alasan |

### 14.2 Template: Refactor Component

```
Refactor komponen {NamaKomponen} di {path}.

Masalah: {deskripsi masalah — terlalu besar, duplikasi, sulit di-test}

Rencana:
1. {langkah 1 — pisah bagian X ke sub-komponen}
2. {langkah 2 — extract logic ke service}
3. {langkah 3 — sederhanakan props}

File yang diubah:
- {file 1}: {perubahan}
- {file 2}: {perubahan}

Dampak:
- {komponen lain yang terpengaruh}
- {test yang perlu diperbarui}

Tidak mengubah:
- API publik komponen (props yang sudah ada)
- Perilaku visual
- Nama file
```

### 14.3 Template: Refactor Module

```
Refactor modul {nama modul}.

Masalah: {deskripsi — misal: satu file services terlalu besar}

Rencana:
1. Pisahkan {bagian} ke file terpisah
2. Buat index.js untuk re-export
3. Update import di semua pengguna

File baru:
- {file baru 1}
- {file baru 2}

File yang diubah:
- {file yang import berubah}

Tidak mengubah:
- API publik modul
- Nama fungsi yang sudah dipakai
```

### 14.4 Template: Refactor Database

```
Refactor database — {deskripsi perubahan skema}.

Perubahan:
- {tabel diubah / tabel baru / field diubah}

Alasan: {alasan}

Migration plan:
1. Version: {new version}
2. Upgrade function: {detail}
3. Data migration: {jika ada}

Update dokumentasi:
- DATABASE_SCHEMA: {section yang berubah}
- SERVICE: {service yang perlu update query}
- COMPONENT: {komponen yang menampilkan data ini}

Risiko:
- Data bisa hilang jika migration gagal
- Backup sebelum migration
```

---

## 15. Prompt Template — Bug Fix

### 15.1 Template: UI Bug

```
Perbaiki bug UI di {lokasi — halaman/komponen}.

Deskripsi bug: {deskripsi — apa yang terjadi vs apa yang diharapkan}
Langkah reproduksi:
1. {langkah 1}
2. {langkah 2}

Root cause: {penyebab}

Solusi: {perbaikan}

File yang diubah:
- {file}: {perubahan baris}

Dampak: {tidak ada / sebutkan}
```

### 15.2 Template: Database Bug

```
Perbaiki bug database di {lokasi}.

Deskripsi bug: {deskripsi}
Error: {error message dari console/indexedDB}

Root cause: {penyebab — query salah, index tidak ada, data korup}

Solusi: {perbaikan — tambah index, perbaiki query, migration data}

File yang diubah:
- {file}: {perubahan}

Risiko: {risiko kehilangan data / performa}
```

### 15.3 Template: Performance Bug

```
Perbaiki masalah performa di {lokasi}.

Gejala: {halaman lambat, query lama, render lama}
Metrik: {sebelum: Xms, target: Yms}

Root cause: {penyebab — query tanpa index, render ulang tidak perlu, data terlalu besar}

Solusi:
1. {solusi 1 — tambah index}
2. {solusi 2 — pagination}
3. {solusi 3 — memoization}

File yang diubah:
- {file}: {perubahan}

Verifikasi: {cara menguji perbaikan performa}
```

### 15.4 Template: Responsive Bug

```
Perbaiki bug responsive di {halaman/komponen}.

Deskripsi: {tampilan rusak di ukuran layar X}

Ukuran layar: {mobile/tablet/desktop — specific width}

Root cause: {penyebab — CSS tidak responsif, layout overflow}

Solusi: {perbaikan — tambah breakpoint, ubah grid, gunakan utility classes}

File yang diubah:
- {file}: {perubahan}
```

---

## 16. Prompt Template — Review

### 16.1 Template: Review Kode

```
Review kode di {file path}.

Fokus review:
1. Konsistensi dengan coding standard
2. Duplikasi kode
3. Error handling
4. Performance
5. Keamanan

Checklist:
- [] ES Modules (import/export)
- [] const/let (no var)
- [] JSDoc pada fungsi export
- [] Tidak ada inline style
- [] Tidak ada inline event handler
- [] Tidak ada TODO/FIXME
- [] Error handling (try/catch)
- [] Optional chaining untuk null safety
- [] Single responsibility

Catatan:
- {positif: apa yang sudah baik}
- {perlu diperbaiki: apa yang perlu diubah}
```

### 16.2 Template: Review UI

```
Review UI halaman {halaman/komponen}.

Fokus:
1. Konsistensi dengan UI_DESIGN_SYSTEM
2. Konsistensi dengan COMPONENT_LIBRARY
3. Responsiveness
4. Aksesibilitas
5. Touch target

Checklist:
- [] Warna sesuai token (primary, success, danger, warning, gray)
- [] Font sesuai type scale
- [] Spacing konsisten
- [] Shadow sesuai elevation
- [] Radius sesuai aturan
- [] Komponen menggunakan nama dari component library
- [] Touch target minimal 44x44px
- [] Focus indicator visible
- [] Keyboard navigable
- [] Label pada semua input
```

### 16.3 Template: Review Business Rules

```
Review implementasi business rules di {file/modul}.

Business rules yang diimplementasikan:
- BR-{XXX}: {aturan}
- BR-{YYY}: {aturan}

Checklist:
- [] BR-{XXX} terimplementasi dengan benar
- [] BR-{YYY} terimplementasi dengan benar
- [] Edge cases tertangani
- [] Error handling sesuai ekspektasi
- [] Tidak ada aturan yang saling bertentangan

Catatan:
- {rules yang sudah sesuai}
- {rules yang perlu diperbaiki}
```

### 16.4 Template: Review Security

```
Review keamanan di {file/modul}.

Fokus:
1. Input validation
2. RBAC (permission check)
3. Data sanitization
4. Sensitive data handling

Checklist:
- [] Semua input divalidasi
- [] Password di-hash (SHA-256)
- [] PIN di-hash
- [] Permission dicek sebelum aksi
- [] Tidak ada data sensitif di console.log
- [] Session menggunakan sessionStorage (bukan localStorage)
- [] Audit log untuk perubahan kritis
```

### 16.5 Template: Review Accessibility

```
Review aksesibilitas di {halaman/komponen}.

Standar: WCAG 2.1 AA

Checklist:
- [] Skip link tersedia
- [] Heading hierarchy (h1 > h2 > h3)
- [] Setiap input punya label
- [] Color contrast >= 4.5:1 (normal text)
- [] Focus indicator visible
- [] Keyboard: Tab, Enter, Escape
- [] ARIA roles sesuai
- [] aria-live untuk dynamic content
- [] Touch target >= 44x44px
- [] Alt text untuk gambar
- [] Form error terhubung ke input (aria-describedby)
```

---

## 17. Prompt Template — Testing

### 17.1 Template: Manual Test Case

```
Buat test case manual untuk {fitur/halaman}.

Test scenario:
1. {skenario 1}
   - Langkah: {detail langkah}
   - Expected: {hasil yang diharapkan}

2. {skenario 2}
   - Langkah: {detail langkah}
   - Expected: {hasil yang diharapkan}

Edge cases:
- {edge case 1}
- {edge case 2}

Data test:
- {data yang perlu disiapkan}
```

### 17.2 Template: Regression Test

```
Regression test untuk {rilis/fitur yang berubah}.

Fitur yang berubah: {fitur}
Potensi dampak: {modul yang mungkin terpengaruh}

Test checklist:
1. {fitur A} — {test yang perlu dijalankan}
2. {fitur B} — {test yang perlu dijalankan}
3. {fitur C} — {test yang perlu dijalankan}

Prioritas: {high/medium — jalankan semua high priority}
```

---

## 18. Prompt Template — Dokumentasi

### 18.1 Template: Update CHANGELOG

```
Update CHANGELOG untuk rilis/pekerjaan berikut:

Versi: {vX.Y.Z}
Tanggal: {YYYY-MM-DD}

Perubahan:
### Added
- {fitur baru 1}
- {fitur baru 2}

### Changed
- {perubahan pada fitur existing}

### Fixed
- {bug fix 1}
- {bug fix 2}

### Deprecated
- {fitur yang mulai tidak didukung}

Format: Keep a Changelog (https://keepachangelog.com)
File: CHANGELOG.md
```

### 18.2 Template: Update FEATURE_LIST

```
Update FEATURE_LIST untuk perubahan berikut:

Fitur: {ID fitur — CS-XX / SA-XX / MD-XX}
Perubahan: {deskripsi perubahan}

Field yang diupdate:
- Status: {Planned / In Progress / Testing / Completed / Future}
- Prioritas: {Critical / High / Medium / Low}
- Catatan: {catatan tambahan}
- Target Versi: {vX.Y}

File: docs/06_FEATURE_LIST.md
```

### 18.3 Template: Update ROADMAP

```
Update ROADMAP untuk perubahan berikut:

Fase: {Phase X — nama fase}
Perubahan: {deskripsi perubahan — fitur baru, perubahan prioritas, perubahan timeline}

Detail:
- {detail perubahan 1}
- {detail perubahan 2}

Dampak pada fase lain: {fase yang terpengaruh}

File: docs/07_ROADMAP.md
```

---

## 19. Checklist AI

Sebelum menyelesaikan tugas, AI **wajib** memeriksa semua item berikut:

### 19.1 Konsistensi

| # | Item | Ya/Tidak |
|---|---|---|
| 1 | Konsisten dengan `01_PROJECT_BLUEPRINT.md` (arsitektur, stack, struktur folder)? | |
| 2 | Konsisten dengan `02_DATABASE_SCHEMA.md` (entitas, field, relasi)? | |
| 3 | Konsisten dengan `03_BUSINESS_RULES.md` (aturan bisnis terimplementasi)? | |
| 4 | Konsisten dengan `04_UI_DESIGN_SYSTEM.md` (token desain digunakan)? | |
| 5 | Menggunakan komponen dari `05_COMPONENT_LIBRARY.md`? | |
| 6 | Sesuai dengan prioritas di `06_FEATURE_LIST.md`? | |

### 19.2 Kualitas

| # | Item | Ya/Tidak |
|---|---|---|
| 7 | Tidak membuat duplikasi kode? | |
| 8 | Responsive (mobile, tablet, desktop)? | |
| 9 | Mudah dipelihara (single responsibility)? | |
| 10 | Siap untuk offline (tidak bergantung koneksi)? | |
| 11 | Input validation pada semua form? | |
| 12 | Error handling (try/catch + user feedback)? | |
| 13 | Loading state untuk setiap operasi async? | |
| 14 | Mengikuti coding standard (ES Modules, const/let, JSDoc)? | |
| 15 | Tidak ada TODO/FIXME placeholder? | |

### 19.3 Aksesibilitas

| # | Item | Ya/Tidak |
|---|---|---|
| 16 | Focus indicator visible? | |
| 17 | Keyboard navigable (Tab, Enter, Escape)? | |
| 18 | Label pada semua form input? | |
| 19 | Touch target >= 44x44px? | |

---

## 20. Hal yang Dilarang

### 20.1 Larangan Absolut

| # | Larangan | Sanksi |
|---|---|---|
| 1 | **Mengubah arsitektur tanpa izin** — struktur layer, pola repository/service | Kode di-revert |
| 2 | **Menambah library tanpa persetujuan** — npm, CDN, dependency baru | Dependency dihapus |
| 3 | **Menghapus data tanpa alasan** — drop table, delete record | Data harus di-restore |
| 4 | **Membuat kode duplikat** — fungsi/komponen yang sudah ada dibuat ulang | Digabung/dihapus |
| 5 | **Implementasi bertentangan dengan Business Rules** — melanggar BR | Kode diperbaiki |
| 6 | **Mengubah database tanpa dokumentasi** — tanpa update DATABASE_SCHEMA.md | Dokumentasi ditambah |
| 7 | **Membuat global variable** — `window.*` | Diganti dengan module scope |
| 8 | **Menggunakan localStorage untuk data bisnis** — transaksi, produk | Data harus di IndexedDB |
| 9 | **Inline CSS** — style attribute di HTML | Pindah ke CSS class |
| 10 | **Inline event handler** — `onclick="..."` | Pindah ke addEventListener |

### 20.2 Larangan Bersyarat

| # | Larangan | Kecuali |
|---|---|---|
| 1 | Refactor besar-besaran | Diminta eksplisit oleh user |
| 2 | Menghapus file | File sudah tidak dipakai di mana pun |
| 3 | Mengubah struktur folder | Ada alasan arsitektur yang kuat |
| 4 | Mengganti library | Library bermasalah (security, performa) |
| 5 | TODO dalam kode final | Hanya untuk development sementara |

---

## 21. Best Practice

### 21.1 Satu Tugas = Satu Tujuan

Setiap prompt yang diberikan ke AI harus memiliki satu tujuan yang jelas. Jangan mencampur "buat halaman produk" dengan "refactor sidebar" dalam satu permintaan.

**Mengapa**: Perubahan kecil lebih mudah direview, di-test, dan di-rollback.

### 21.2 Perubahan Kecil Lebih Baik

| ❌ Jangan | ✅ Lakukan |
|---|---|
| "Buat seluruh modul sales" | "Buat ProductGrid component dulu" |
| "Refactor semua service" | "Refactor ProductService dulu" |
| "Buat 5 halaman sekaligus" | "Buat halaman Product List dulu" |

### 21.3 Selalu Perbarui Dokumentasi

Jika perubahan mempengaruhi:

- Database → update `02_DATABASE_SCHEMA.md`
- Aturan bisnis → update `03_BUSINESS_RULES.md`
- Komponen UI → update `05_COMPONENT_LIBRARY.md`
- Fitur → update `06_FEATURE_LIST.md` (status)
- Arsitektur → update `01_PROJECT_BLUEPRINT.md`

### 21.4 Jangan Mengerjakan Lebih dari Ruang Lingkup

| ❌ Jangan | ✅ Lakukan |
|---|---|
| "Saya juga memperbaiki sidebar karena ada di file yang sama" | Kerjakan sesuai permintaan |
| "Saya menambahkan fitur export karena sekalian" | Tanya dulu apakah diperlukan |

### 21.5 Gunakan Istilah yang Konsisten

| Istilah Proyek | Jangan Gunakan |
|---|---|
| AppButton, AppTable, AppModal | "button component", "my-table" |
| ProductService, SalesService | "product data handler" |
| Repository | "data access object" |
| Shift, Sale, Purchase | "work session", "order", "procurement" |

### 21.6 Tanya Jika Tidak Yakin

AI harus bertanya jika:

- Tidak yakin dengan pendekatan implementasi
- Menemukan konflik antar dokumen
- Ada lebih dari satu cara yang sama-sama valid
- Perubahan berpotensi merusak fitur lain

---

## 22. AI Memory

### 22.1 Menjaga Konteks Proyek

| Strategi | Deskripsi |
|---|---|
| **Baca dokumen di awal sesi** | Selalu baca dokumen relevan sebelum bekerja — terutama `01_PROJECT_BLUEPRINT.md` |
| **Gunakan istilah konsisten** | Jangan mengganti istilah yang sudah ditetapkan (AppButton, ProductService, dll) |
| **Tidak membuat asumsi** | Jika tidak yakin, cek dokumen atau tanya. Jangan tebak |
| **Acu struktur proyek** | Selalu acu folder structure yang sudah ditetapkan — jangan buat folder di luar struktur |
| **Ingat coding standard** | ES Modules, const/let, JSDoc, async/await — ini sudah ditetapkan |

### 22.2 Sesi Baru = Refresh Konteks

Setiap kali memulai sesi baru (atau setelah jeda panjang), AI harus:

1. Membaca `01_PROJECT_BLUEPRINT.md` section 1-8 (visi, stack, arsitektur, folder, coding standard)
2. Membaca `08_AI_PROMPT_GUIDE.md` (dokumen ini)
3. Membaca section dari dokumen lain yang relevan dengan tugas

### 22.3 Catatan untuk Sesi Berikutnya

Setelah menyelesaikan tugas, AI harus meninggalkan catatan yang cukup untuk AI lain (atau AI yang sama di sesi berikutnya):

```
## Status Pekerjaan
- Phase 2 (Core System) sedang dikerjakan
- Login dan User Management selesai
- Permission masih perlu implementasi
- Backup/restore belum dimulai
```

---

## 23. Future AI Support

### 23.1 Platform Independen

Panduan ini dirancang untuk bekerja dengan berbagai AI Coding Assistant:

| Platform | Kompatibilitas |
|---|---|
| **OpenCode** | ✅ Sepenuhnya — platform utama |
| **Cursor** | ✅ Sepenuhnya — ikuti workflow dan template |
| **Claude Code** | ✅ Sepenuhnya — format prompt kompatibel |
| **Codex CLI** | ✅ Sepenuhnya — aturan implementasi berlaku |
| **GitHub Copilot** | ⚠️ Sebagian — Copilot tidak membaca file konteks sepenuhnya. Manusia harus memberikan konteks manual |
| **AI Coding Assistant lain** | ✅ — selama bisa membaca file dan mengikuti instruksi |

### 23.2 Prinsip Lintas Platform

| Prinsip | Berlaku di Semua Platform |
|---|---|
| Baca dokumen sebelum coding | ✅ |
| Ikuti struktur folder | ✅ |
| Gunakan komponen dari library | ✅ |
| Ikuti business rules | ✅ |
| Update dokumentasi | ✅ |
| Checklist sebelum selesai | ✅ |

### 23.3 Keterbatasan per Platform

| Platform | Keterbatasan | Mitigasi |
|---|---|---|
| **Copilot** | Tidak bisa membaca seluruh konteks proyek | Manusia harus memberikan ringkasan konteks di prompt |
| **Codex CLI** | Tidak bisa mengakses file system secara langsung | Gunakan tool yang tersedia di platform |
| **Chat-based AI** | Konteks terbatas pada sesi chat | Pecah tugas besar menjadi beberapa sesi |

### 23.4 Tidak Ada Aturan Spesifik Platform

Panduan ini sengaja **tidak** membuat aturan yang bergantung pada satu platform tertentu. Semua aturan menggunakan konsep universal: baca dokumen, ikuti standar, update dokumentasi.

---

> **Dokumen ini adalah panduan operasional AI untuk pengembangan POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md` s.d. `07_ROADMAP.md`.

---

*POS Offline PWA — AI Prompt Guide v1.0.0 — 15 Juli 2026*
