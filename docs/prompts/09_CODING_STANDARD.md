# TASK: Buat Dokumen `09_CODING_STANDARD.md`

## Peran

Bertindaklah sebagai **Senior Software Architect**, **Lead Frontend Engineer**, **Code Quality Engineer**, dan **Technical Lead** yang bertanggung jawab menetapkan standar penulisan kode untuk seluruh proyek aplikasi POS Offline Progressive Web App.

Sebelum menyusun dokumen, baca dan pahami seluruh dokumen berikut:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`
* `04_UI_DESIGN_SYSTEM.md`
* `05_COMPONENT_LIBRARY.md`
* `06_FEATURE_LIST.md`
* `07_ROADMAP.md`
* `08_AI_PROMPT_GUIDE.md`

Gunakan dokumen tersebut sebagai dasar penyusunan standar coding.

---

# Tujuan

Buat file:

`docs/09_CODING_STANDARD.md`

Dokumen ini menjadi standar resmi penulisan kode untuk seluruh proyek.

Dokumen ini **tidak boleh berisi implementasi fitur aplikasi**, tetapi boleh menggunakan potongan kode singkat sebagai contoh aturan.

---

# Filosofi Coding

Jelaskan prinsip:

* Clean Code
* Readability First
* Simplicity
* Maintainability
* Reusability
* Consistency
* SOLID (diterapkan seperlunya pada JavaScript)
* DRY (Don't Repeat Yourself)
* KISS (Keep It Simple, Stupid)
* YAGNI (You Aren't Gonna Need It)

Jelaskan bagaimana prinsip tersebut diterapkan pada proyek ini.

---

# Teknologi

Tentukan standar teknologi:

* HTML5
* CSS3
* Bootstrap 5
* Vanilla JavaScript (ES2022+)
* IndexedDB
* Dexie.js
* Progressive Web App
* Chart.js
* Bootstrap Icons

Jelaskan alasan pemilihan setiap teknologi.

---

# Struktur Penamaan

Tentukan aturan penamaan untuk:

* Folder
* File
* Class
* Function
* Variable
* Constant
* Enum
* Event
* CSS Class
* Custom Data Attribute

Contoh:

* `product-service.js`
* `ProductRepository`
* `calculateTotal()`
* `DEFAULT_TAX_RATE`

---

# Struktur File

Jelaskan isi standar sebuah file JavaScript.

Contoh urutan:

1. Import (jika ada)
2. Konstanta
3. Class / Function utama
4. Helper
5. Export (jika ada)

---

# Standar JavaScript

Jelaskan aturan:

* Gunakan `const` secara default.
* Gunakan `let` hanya jika nilainya berubah.
* Hindari `var`.
* Gunakan `===` dan `!==`.
* Gunakan optional chaining (`?.`) bila sesuai.
* Gunakan nullish coalescing (`??`) bila sesuai.
* Gunakan template literal.
* Gunakan arrow function hanya jika memang lebih tepat.
* Hindari callback yang terlalu dalam.

---

# Penanganan Error

Standarkan penggunaan:

* `try...catch`
* Validasi input
* Error message yang jelas
* Logging
* Error khusus untuk pengguna
* Error untuk debugging

---

# Struktur Modul

Definisikan pola modul.

Misalnya:

* Service
* Repository
* Controller
* View
* Utility
* Helper

Jelaskan tanggung jawab masing-masing.

---

# Standar HTML

Jelaskan aturan:

* Semantic HTML
* Accessibility
* Struktur heading
* Form
* Label
* Button
* Table
* ARIA (konseptual)

---

# Standar CSS

Jelaskan aturan:

* Gunakan Bootstrap sebagai dasar.
* Hindari inline style.
* Gunakan CSS Custom Properties.
* Gunakan utility class jika memungkinkan.
* Penamaan class yang konsisten (misalnya BEM atau pendekatan lain yang dipilih).

---

# Standar Komentar

Jelaskan kapan komentar diperlukan.

Komentari:

* Logika kompleks.
* Keputusan desain.
* Workaround.

Hindari komentar yang hanya mengulang isi kode.

---

# Logging

Definisikan aturan:

* Info
* Warning
* Error
* Debug

Jelaskan kapan masing-masing digunakan.

---

# Validasi

Jelaskan standar validasi:

* Client-side
* Data
* Form
* Database

---

# Performance

Aturan:

* Hindari query IndexedDB yang tidak perlu.
* Kurangi manipulasi DOM berulang.
* Gunakan event delegation jika sesuai.
* Lazy loading bila relevan.
* Hindari render ulang yang tidak diperlukan.

---

# Keamanan

Standar:

* Escape output bila diperlukan.
* Validasi input.
* Jangan menyimpan data sensitif tanpa perlindungan.
* Hindari penggunaan `eval()`.
* Sanitasi data sebelum diproses.

---

# Struktur Event

Jelaskan standar penanganan event.

Contoh:

* Click
* Input
* Change
* Submit

Gunakan penamaan yang konsisten.

---

# Struktur Database

Jelaskan aturan akses database:

* Semua akses melalui Repository.
* Jangan mengakses IndexedDB langsung dari UI.
* Pisahkan logika bisnis dari akses data.

---

# Standar UI

Jelaskan aturan implementasi:

* Konsisten dengan `04_UI_DESIGN_SYSTEM.md`
* Konsisten dengan `05_COMPONENT_LIBRARY.md`

---

# Dokumentasi Kode

Setiap modul harus memiliki:

* Tujuan
* Dependensi
* Fungsi utama
* Catatan jika diperlukan

---

# Anti Pattern

Jelaskan hal yang harus dihindari.

Contoh:

* God Function
* God Class
* Inline Event
* Inline Style
* Hardcoded Value
* Duplikasi Kode
* Magic Number
* Fungsi terlalu panjang

---

# Code Review Checklist

Buat checklist sebelum kode dianggap selesai.

Contoh:

* Mengikuti Coding Standard.
* Tidak ada duplikasi.
* Mudah dibaca.
* Mudah diuji.
* Tidak ada error linting.
* Responsif.
* Konsisten dengan Business Rules.

---

# Refactoring

Jelaskan kapan refactor diperlukan.

Contoh:

* Fungsi terlalu panjang.
* Banyak kode berulang.
* Kompleksitas meningkat.
* Sulit diuji.

---

# Definition of Done

Kode dianggap selesai jika:

* Sesuai Blueprint.
* Lolos validasi.
* Mengikuti Coding Standard.
* Mengikuti Business Rules.
* Dokumentasi diperbarui bila diperlukan.
* Tidak menghasilkan error di console.
* Mudah dipelihara.

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Menggunakan contoh seperlunya.
* Tidak berisi implementasi fitur.
* Menjadi acuan resmi seluruh developer dan AI.

---

# Aturan Kerja AI

Selama menghasilkan kode:

* Selalu ikuti Coding Standard ini.
* Jangan membuat pengecualian tanpa alasan yang jelas.
* Jika ada konflik dengan dokumen lain, jelaskan terlebih dahulu.
* Utamakan keterbacaan daripada optimasi prematur.

---

# Output

Hasil akhir berupa file:

`docs/09_CODING_STANDARD.md`

Dokumen ini harus menjadi standar resmi seluruh penulisan kode proyek sehingga semua modul memiliki gaya, struktur, dan kualitas yang konsisten, baik dikerjakan oleh AI maupun developer manusia.
