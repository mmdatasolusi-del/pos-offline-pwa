# TASK: Buat Dokumen `04_UI_DESIGN_SYSTEM.md`

## Peran

Bertindaklah sebagai **Senior UI/UX Designer**, **Design System Architect**, dan **Frontend Architect** yang berpengalaman membangun aplikasi POS modern untuk tablet Android, desktop, dan Progressive Web App.

Sebelum membuat dokumen, pahami bahwa proyek ini telah memiliki:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`

Seluruh keputusan desain harus konsisten dengan dokumen tersebut.

Jika ada konflik, jelaskan terlebih dahulu sebelum menentukan solusi.

---

# Tujuan

Buat file:

`docs/04_UI_DESIGN_SYSTEM.md`

Dokumen ini menjadi standar visual seluruh aplikasi.

Dokumen ini **tidak berisi implementasi HTML maupun CSS**.

Fokus pada aturan desain.

---

# Filosofi Desain

Jelaskan filosofi UI yang digunakan.

Contoh:

* Clean
* Modern
* Professional
* Fast
* Tablet Friendly
* Touch Friendly
* Minimal Learning Curve
* Accessible
* Consistent
* Responsive
* Mobile First
* Offline First

---

# Prinsip Desain

Jelaskan prinsip berikut:

* Consistency
* Simplicity
* Readability
* Hierarchy
* Accessibility
* Feedback
* Predictability
* Efficiency

Jelaskan penerapannya pada aplikasi POS.

---

# Target Device

Desain harus optimal pada:

* Android Tablet 8"
* Android Tablet 10"
* Android Tablet 12"
* Desktop
* Laptop

Pastikan layout tetap nyaman pada resolusi kecil maupun besar.

---

# Grid System

Tentukan:

* Bootstrap Grid
* Container
* Margin
* Gutter
* Breakpoint
* Responsive Behavior

Jelaskan aturan penggunaannya.

---

# Color System

Rancang Color Palette.

Minimal meliputi:

Primary

Secondary

Success

Warning

Danger

Info

Background

Surface

Border

Text Primary

Text Secondary

Disabled

Dark Mode

Light Mode

Jelaskan fungsi setiap warna.

Jangan menentukan kode warna secara acak.

Gunakan pendekatan profesional.

---

# Typography

Jelaskan:

Font Family

Heading

Body

Caption

Button

Table

Input

Line Height

Letter Spacing

Font Weight

Minimum Font Size

Tablet Font Rules

---

# Icon System

Gunakan:

Bootstrap Icons

Tentukan aturan:

Ukuran

Konsistensi

Posisi

Spacing

Penggunaan Icon + Text

---

# Spacing System

Buat standar:

4px

8px

12px

16px

20px

24px

32px

40px

48px

Jelaskan kapan digunakan.

---

# Border Radius

Tentukan standar.

Misalnya:

Card

Button

Input

Modal

Toast

Badge

---

# Shadow System

Jelaskan level shadow.

Misalnya:

None

Small

Medium

Large

Floating

---

# Layout

Jelaskan layout utama.

Sidebar

Topbar

Main Content

Footer

Floating Button

Status Bar

Empty State

Loading State

---

# Sidebar

Jelaskan:

Lebar

Collapse

Icon

Label

Active Menu

Hover

Badge

Scroll

Nested Menu

---

# Topbar

Jelaskan:

Search

Notification

User Menu

Theme Switch

Sync Status

Shift Status

Outlet

---

# Dashboard

Jelaskan standar:

KPI Card

Chart

Statistic

Recent Activity

Low Stock

Quick Action

Shortcut

---

# Card System

Tentukan aturan:

Padding

Shadow

Radius

Header

Body

Footer

Hover

Loading

Empty

---

# Button System

Jenis:

Primary

Secondary

Outline

Danger

Success

Ghost

Link

Icon Button

Floating Button

Loading Button

Disabled Button

Jelaskan penggunaan masing-masing.

---

# Form System

Standar:

Input

Textarea

Number

Currency

Date

Time

Select

Search

Switch

Checkbox

Radio

Validation

Helper Text

---

# Table System

Jelaskan:

Sticky Header

Pagination

Sorting

Filtering

Search

Responsive

Row Height

Hover

Empty State

Loading

---

# Modal

Standar:

Width

Header

Body

Footer

Close Action

Confirmation

Danger Action

---

# Notification

Jelaskan:

Toast

Alert

Snackbar

Confirmation Dialog

Error Dialog

Success Dialog

---

# Loading

Standar:

Skeleton

Spinner

Progress Bar

Overlay

Lazy Loading

---

# Empty State

Jelaskan desain untuk:

Tidak ada data

Pencarian kosong

Belum ada transaksi

Belum ada produk

Offline

---

# Error State

Jelaskan tampilan untuk:

Database Error

Restore Error

Validation Error

Permission Error

Unexpected Error

---

# Dark Mode

Tentukan aturan lengkap:

Background

Card

Text

Table

Modal

Sidebar

Chart

Button

Border

---

# Animation

Gunakan animasi sederhana.

Contoh:

Fade

Slide

Scale

Collapse

Toast

Modal

Loading

Jelaskan durasi yang direkomendasikan.

---

# Accessibility

Jelaskan:

Kontras warna

Ukuran tombol minimum

Area sentuh minimum

Navigasi keyboard

Focus Indicator

ARIA (konseptual)

---

# Responsive Rules

Jelaskan perubahan layout untuk:

Phone

Tablet Portrait

Tablet Landscape

Desktop

---

# Komponen Khusus POS

Rancang aturan visual untuk:

Product Grid

Cart

Payment Panel

Calculator

Quantity Selector

Receipt Preview

Barcode Scanner

QR Scanner

Kitchen Order

Table Layout

Cash Drawer

Shift Panel

---

# Design Tokens

Definisikan token konseptual seperti:

Color

Spacing

Radius

Shadow

Typography

Z-index

Transition

Gunakan format yang konsisten agar mudah diterapkan pada CSS di tahap implementasi.

---

# UI Anti Pattern

Jelaskan hal-hal yang harus dihindari.

Contoh:

* Terlalu banyak warna
* Tombol terlalu kecil
* Tabel terlalu padat
* Popup berlebihan
* Animasi berlebihan
* Ikon tanpa label pada fungsi penting

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya
* Tidak berisi implementasi HTML/CSS
* Menggunakan Markdown yang rapi
* Memiliki daftar isi
* Menggunakan tabel bila diperlukan
* Memberikan alasan desain, bukan hanya aturan
* Berorientasi pada pengalaman pengguna di tablet Android

---

# Aturan Kerja AI

Selama menyusun dokumen:

* Jangan membuat komponen di luar kebutuhan aplikasi POS.
* Utamakan keterbacaan dan efisiensi penggunaan.
* Seluruh desain harus mudah diimplementasikan menggunakan Bootstrap 5.
* Hindari keputusan desain yang bergantung pada framework frontend tertentu.

---

# Output

Hasil akhir berupa file:

`docs/04_UI_DESIGN_SYSTEM.md`

Dokumen harus cukup lengkap sehingga seluruh halaman aplikasi dapat dibuat dengan tampilan yang konsisten, profesional, responsif, dan mudah digunakan tanpa perlu mendesain ulang setiap modul.
