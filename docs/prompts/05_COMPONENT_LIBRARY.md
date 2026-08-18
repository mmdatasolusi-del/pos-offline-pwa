# TASK: Buat Dokumen `05_COMPONENT_LIBRARY.md`

## Peran

Bertindaklah sebagai **Senior Frontend Architect**, **UI Component Designer**, dan **Software Architect** yang berpengalaman membangun Design System untuk aplikasi POS berbasis Progressive Web App.

Sebelum membuat dokumen, baca dan pahami:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`
* `04_UI_DESIGN_SYSTEM.md`

Seluruh keputusan harus konsisten dengan dokumen tersebut.

Jika menemukan konflik atau kebutuhan perubahan, jelaskan terlebih dahulu beserta alasan dan dampaknya.

---

# Tujuan

Buat file:

`docs/05_COMPONENT_LIBRARY.md`

Dokumen ini menjadi katalog resmi seluruh komponen UI yang akan digunakan di aplikasi.

Dokumen ini **tidak boleh berisi implementasi HTML, CSS, atau JavaScript**.

Fokus pada spesifikasi komponen.

---

# Filosofi Komponen

Jelaskan prinsip berikut:

* Reusable
* Modular
* Consistent
* Responsive
* Accessible
* Maintainable
* Composable
* Touch Friendly
* Tablet Optimized

Jelaskan mengapa setiap prinsip penting.

---

# Struktur Komponen

Kelompokkan komponen ke dalam kategori berikut.

## Foundation

* Color Token
* Typography
* Icon
* Grid
* Spacing
* Radius
* Shadow
* Animation

---

## Layout Components

Rancang spesifikasi:

* App Layout
* Sidebar
* Topbar
* Main Content
* Footer
* Page Container
* Section
* Divider

Untuk setiap komponen jelaskan:

* Tujuan
* Fungsi
* Variasi
* Perilaku
* Responsive Rules

---

## Navigation Components

Spesifikasi:

* Sidebar Menu
* Breadcrumb
* Tab
* Pagination
* Dropdown
* Navigation Drawer
* Context Menu

---

## Form Components

Rancang:

* Text Input
* Number Input
* Currency Input
* Date Picker
* Time Picker
* Textarea
* Search Box
* Select
* Multi Select
* Checkbox
* Radio Button
* Toggle Switch
* File Upload

Untuk setiap komponen jelaskan:

* Tujuan
* State
* Validasi
* Error State
* Disabled State
* Readonly State

---

## Button Components

Definisikan:

* Primary
* Secondary
* Outline
* Success
* Warning
* Danger
* Ghost
* Link
* Icon Button
* Floating Button

Jelaskan:

* Ukuran
* Variasi
* Penggunaan
* Ikon
* Loading
* Disabled

---

## Data Display Components

Rancang:

* Card
* KPI Card
* Statistic Card
* Product Card
* Table
* Badge
* Avatar
* Chip
* Label
* Tooltip

---

## Feedback Components

Spesifikasi:

* Alert
* Toast
* Snackbar
* Progress Bar
* Loading Spinner
* Skeleton Loader
* Empty State
* Error State

---

## Overlay Components

Definisikan:

* Modal
* Drawer
* Dialog
* Confirm Dialog
* Fullscreen Dialog

Jelaskan:

* Kapan digunakan
* Ukuran
* Prioritas
* Responsif

---

## POS Components

Komponen khusus POS:

* Product Grid
* Product List
* Product Search
* Cart
* Cart Item
* Quantity Selector
* Discount Panel
* Tax Panel
* Payment Panel
* Calculator Pad
* Receipt Preview
* Cash Summary
* Shift Summary
* Barcode Scanner
* QR Scanner
* Receipt Item

---

## Cafe Components

Komponen:

* Table Layout
* Table Card
* Kitchen Ticket
* Kitchen Queue
* Order Timeline
* Reservation Card

---

## Dashboard Components

Rancang:

* Sales Summary
* Revenue Card
* Profit Card
* Chart Card
* Low Stock Card
* Activity Timeline
* Recent Transaction
* Quick Action

---

## Setting Components

Komponen:

* Theme Switch
* Language Selector
* Backup Panel
* Restore Panel
* Database Status
* Storage Usage

---

# Component State

Untuk seluruh komponen tentukan state standar:

* Default
* Hover
* Focus
* Active
* Disabled
* Loading
* Error
* Success
* Empty

Jelaskan perilaku setiap state.

---

# Responsiveness

Jelaskan perubahan perilaku komponen pada:

* Mobile
* Tablet Portrait
* Tablet Landscape
* Desktop

---

# Accessibility

Definisikan standar:

* Focus Indicator
* Keyboard Navigation
* Screen Reader (konseptual)
* Minimum Touch Area
* Kontras Warna
* Label yang jelas

---

# Naming Convention

Tentukan standar penamaan komponen.

Contoh:

* AppSidebar
* AppButton
* ProductCard
* SalesTable
* PaymentDialog

Gunakan pola yang konsisten.

---

# Komposisi Komponen

Jelaskan bagaimana komponen dapat digabungkan.

Contoh:

Dashboard

? KPI Card

? Chart Card

? Activity Timeline

? Quick Action

Kasir

? Product Search

? Product Grid

? Cart

? Payment Panel

? Receipt Preview

---

# Component Dependency

Jelaskan ketergantungan antar komponen.

Contoh:

Payment Panel membutuhkan:

* Currency Input
* Button
* Modal
* Alert

Dashboard membutuhkan:

* KPI Card
* Chart
* Table
* Badge

---

# Anti Pattern

Jelaskan hal yang harus dihindari.

Contoh:

* Komponen dengan banyak tanggung jawab.
* Komponen yang tidak dapat digunakan kembali.
* Terlalu banyak variasi visual.
* Komponen yang bergantung pada halaman tertentu.
* Inline style.
* Inline event.

---

# Future Components

Rancang komponen yang mungkin dibutuhkan nanti.

Contoh:

* Customer Display
* Kitchen Display
* QR Menu
* Self Order
* Multi Outlet Dashboard
* Warehouse Selector

Jangan implementasikan, cukup definisikan.

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Menggunakan tabel jika diperlukan.
* Menjelaskan fungsi setiap komponen.
* Tidak berisi implementasi HTML, CSS, maupun JavaScript.
* Mudah dipahami oleh developer dan AI.

---

# Aturan Kerja AI

Selama menyusun dokumen:

* Jangan membuat komponen yang tidak memiliki tujuan jelas.
* Prioritaskan reusable component.
* Pastikan seluruh komponen dapat diimplementasikan menggunakan Bootstrap 5.
* Hindari ketergantungan pada framework frontend tertentu.
* Jika terdapat beberapa pendekatan desain, jelaskan rekomendasi beserta trade-off.

---

# Output

Hasil akhir berupa file:

`docs/05_COMPONENT_LIBRARY.md`

Dokumen harus menjadi katalog lengkap seluruh komponen aplikasi sehingga implementasi UI pada tahap pengembangan dapat dilakukan secara konsisten tanpa perlu mendesain ulang setiap halaman.
