# TASK

Buat file **01_PROJECT_BLUEPRINT.md** untuk sebuah proyek aplikasi **POS (Point of Sale) Offline** yang akan menjadi dokumen utama dan acuan seluruh pengembangan proyek.

Dokumen harus ditulis dalam format **Markdown** yang rapi, profesional, mudah dibaca, dan siap digunakan sebagai pedoman oleh AI maupun developer manusia.

---

# Tujuan Aplikasi

Membangun aplikasi POS modern yang dapat digunakan oleh:

* Toko
* Minimarket
* Cafe
* Coffee Shop
* Warung
* Laundry
* Salon
* Bengkel
* Apotek
* UMKM

Aplikasi harus berjalan sepenuhnya secara offline tanpa server.

---

# Teknologi

Gunakan teknologi berikut:

Frontend

* HTML5
* CSS3
* JavaScript ES2023

UI

* Bootstrap 5
* Bootstrap Icons

Database

* IndexedDB
* Dexie.js

Chart

* Chart.js

Export

* SheetJS
* jsPDF

Scanner

* html5-qrcode
* QuaggaJS

PWA

* Manifest
* Service Worker

Version Control

* Git

Editor

* Cursor AI

---

# Prinsip Utama

Dokumen harus menjelaskan secara rinci bahwa aplikasi wajib memenuhi prinsip berikut:

* Offline First
* Mobile First
* Responsive
* Fast Loading
* Modular
* Reusable Component
* Clean Architecture
* Maintainable
* Extensible
* Progressive Web App
* No Backend
* No PHP
* No MySQL
* No Firebase
* No Node Server

Seluruh data harus disimpan menggunakan IndexedDB.

---

# Target Platform

Dokumen harus menjelaskan bahwa aplikasi harus berjalan pada:

* Android Tablet
* Android Phone
* Windows
* Linux
* macOS

melalui browser modern.

Aplikasi juga harus dapat di-install sebagai PWA.

---

# Arsitektur

Jelaskan arsitektur aplikasi.

Gunakan diagram Markdown seperti berikut dan kembangkan menjadi lebih profesional.

User

?

PWA

?

UI Layer

?

Service Layer

?

Database Layer

?

IndexedDB

Jelaskan fungsi masing-masing layer.

---

# Struktur Folder

Buat struktur folder lengkap yang scalable.

Contoh:

assets/

css/

js/

components/

layouts/

pages/

services/

database/

models/

repositories/

utils/

hooks/

config/

icons/

images/

fonts/

backup/

reports/

docs/

Jelaskan fungsi setiap folder.

---

# Coding Standard

Buat aturan coding.

Contoh:

* Gunakan camelCase
* Nama file menggunakan kebab-case
* Hindari global variable
* Gunakan const sebelum let
* Tidak menggunakan inline CSS
* Tidak menggunakan inline JavaScript
* Semua fungsi memiliki komentar JSDoc
* Pisahkan logic dan UI
* Maksimal panjang fungsi sekitar 50 baris (pecah menjadi helper jika diperlukan)
* Hindari duplikasi kode (DRY)

Jelaskan secara detail.

---

# UI Standard

Jelaskan standar UI.

Contoh:

* Bootstrap 5
* Rounded modern
* Soft shadow
* Smooth animation
* Dark Mode
* Light Mode
* Sidebar collapse
* Card layout
* Responsive Grid
* Material feeling

---

# UX Standard

Jelaskan pengalaman pengguna.

Contoh:

* Maksimal 3 klik menuju fitur utama
* Tidak ada loading yang tidak perlu
* Shortcut keyboard
* Tombol besar untuk tablet
* Mudah digunakan kasir

---

# Performance Rules

Jelaskan target performa.

Contoh:

* Startup < 2 detik
* Render cepat
* Lazy loading
* Asset minimal
* Tidak ada library yang tidak digunakan

---

# Security Rules

Walaupun offline, jelaskan aturan keamanan.

Contoh:

* Validasi input
* Escape HTML
* Sanitasi data
* Backup terenkripsi (opsional)
* Konfirmasi sebelum menghapus data

---

# Data Management

Jelaskan aturan:

* Backup JSON
* Restore JSON
* Auto Backup
* Version Backup
* Import Export

---

# Accessibility

Jelaskan standar aksesibilitas.

Contoh:

* Kontras warna
* Keyboard navigation
* Focus indicator
* Ukuran font minimal
* Ukuran tombol minimal untuk tablet

---

# Future Development

Jelaskan roadmap besar.

Versi:

v1.0
v2.0
v3.0
v4.0

Tanpa menjelaskan implementasi detail.

---

# AI Development Rules

Ini bagian paling penting.

Buat aturan bahwa seluruh pengembangan menggunakan Cursor AI.

AI wajib:

* membaca PROJECT_BLUEPRINT terlebih dahulu
* tidak mengubah arsitektur tanpa izin
* tidak membuat file di luar struktur folder
* selalu menjaga konsistensi style
* tidak membuat kode duplikat
* selalu reusable
* selalu modular
* selalu membuat kode production-ready
* memberikan komentar pada bagian kompleks
* memperbarui CHANGELOG jika ada perubahan besar

---

# Output

Hasil akhir harus berupa file Markdown profesional sekitar 10–20 halaman jika dicetak, lengkap dengan daftar isi, heading yang konsisten, diagram ASCII/Markdown bila diperlukan, tabel untuk standar dan aturan, serta bahasa teknis yang jelas. Dokumen ini akan menjadi sumber kebenaran (single source of truth) untuk seluruh pengembangan aplikasi.
