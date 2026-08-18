# TASK: Phase 2.2 — Router & Navigation Framework

## Peran

Bertindaklah sebagai **Senior Frontend Architect**, **Software Architect**, **SPA Architect**, dan **UI Engineer**.

Sebelum bekerja, baca dan pahami:

* docs/11_AI_CONTEXT.md
* docs/10_PROJECT_STRUCTURE.md
* docs/09_CODING_STANDARD.md
* docs/12_DEVELOPMENT_WORKFLOW.md
* docs/04_UI_DESIGN_SYSTEM.md
* docs/05_COMPONENT_LIBRARY.md

Gunakan seluruh dokumentasi sebagai acuan implementasi.

---

# Tujuan

Membangun fondasi navigasi aplikasi.

Fokus hanya pada:

* Router
* Layout
* Sidebar
* Topbar
* Breadcrumb
* Navigation Manager
* Page Loader
* Not Found Page

Belum membuat:

* Login
* Dashboard
* Database
* Dexie
* Business Logic
* CRUD
* POS

---

# Router

Bangun SPA Router menggunakan Vanilla JavaScript.

Router harus:

* Menggunakan hash routing (`#/dashboard`) atau pendekatan yang dipilih secara konsisten.
* Mendukung parameter rute.
* Mendukung halaman default.
* Mendukung halaman 404.
* Mudah diperluas.

Jelaskan alasan pemilihan pendekatan.

---

# Route Registry

Seluruh rute didefinisikan di satu tempat.

Contoh kategori:

* Dashboard
* Product
* Sales
* Purchase
* Inventory
* Report
* Setting

Sebagian besar masih berupa placeholder.

---

# Layout

Bangun layout utama aplikasi.

Terdiri dari:

* Sidebar
* Topbar
* Main Content
* Footer (opsional)
* Page Container

Layout harus responsif dan mengikuti `04_UI_DESIGN_SYSTEM.md`.

---

# Sidebar

Sidebar harus:

* Dapat diciutkan (collapse).
* Mendukung submenu.
* Menandai menu aktif.
* Mudah diperluas.
* Ramah tablet.

Gunakan struktur menu sesuai `06_FEATURE_LIST.md`, tetapi halaman selain Dashboard dapat berupa placeholder.

---

# Topbar

Minimal berisi:

* Nama aplikasi.
* Breadcrumb.
* Tombol ganti tema.
* Area profil pengguna (placeholder).
* Tombol menu untuk layar kecil.

Belum perlu autentikasi.

---

# Breadcrumb

Breadcrumb harus diperbarui secara otomatis berdasarkan rute aktif.

---

# Navigation Manager

Buat modul yang bertanggung jawab atas:

* Perpindahan halaman.
* Aktivasi menu.
* Pembaruan breadcrumb.
* Sinkronisasi judul halaman.

Pisahkan dari Router agar mudah dikembangkan.

---

# Page Loader

Siapkan mekanisme loading ringan saat berpindah halaman.

Belum perlu animasi kompleks.

---

# Halaman Placeholder

Buat placeholder untuk:

* Dashboard
* Product
* Sales
* Purchase
* Inventory
* Report
* Setting

Setiap halaman cukup menampilkan:

* Judul halaman.
* Deskripsi singkat.
* Status: "Coming Soon" jika belum diimplementasikan.

---

# Halaman 404

Buat halaman khusus jika rute tidak ditemukan.

Berikan tombol kembali ke Dashboard.

---

# Responsiveness

Pastikan:

* Desktop.
* Tablet Landscape.
* Tablet Portrait.
* Mobile.

Sidebar harus menyesuaikan ukuran layar.

---

# Accessibility

Pastikan:

* Navigasi keyboard dasar.
* Fokus terlihat jelas.
* Area sentuh cukup besar.
* Label navigasi mudah dipahami.

---

# Validasi

Pastikan:

* Router bekerja tanpa reload halaman.
* Tidak ada error di console.
* Sidebar dan Topbar tampil konsisten.
* Breadcrumb sesuai rute.
* Theme dari Sprint 2.1 tetap berfungsi.
* Struktur mengikuti `10_PROJECT_STRUCTURE.md`.

---

# Yang Tidak Boleh Dilakukan

Jangan:

* Membuat Login.
* Membuat Database.
* Menggunakan Dexie.
* Membuat Dashboard sebenarnya.
* Membuat CRUD.
* Membuat Business Logic.
* Menambahkan library SPA tambahan.

---

# Dokumentasi

Jika ada keputusan implementasi yang berbeda dari dokumentasi, jelaskan alasan dan dampaknya.

---

# Output

Setelah selesai, berikan ringkasan:

* File yang dibuat atau diubah.
* Cara kerja Router.
* Cara kerja Navigation Manager.
* Struktur Layout.
* Daftar rute yang tersedia.
* Catatan untuk Sprint 2.3.
