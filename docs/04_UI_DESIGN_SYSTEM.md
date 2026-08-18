# 04_UI_DESIGN_SYSTEM.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Tujuan](#2-tujuan)
3. [Prinsip Desain](#3-prinsip-desain)
4. [Spesifikasi Brand](#4-spesifikasi-brand)
5. [Palet Warna](#5-palet-warna)
6. [Tipografi](#6-tipografi)
7. [Iconography](#7-iconography)
8. [Spacing & Grid](#8-spacing--grid)
9. [Shadow & Elevation](#9-shadow--elevation)
10. [Border & Radius](#10-border--radius)
11. [Komponen Dasar (Atoms)](#11-komponen-dasar-atoms)
12. [Button](#12-button)
13. [Input & Form](#13-input--form)
14. [Card & Surface](#14-card--surface)
15. [Table & Data Display](#15-table--data-display)
16. [Badge & Tag](#16-badge--tag)
17. [Modal & Dialog](#17-modal--dialog)
18. [Toast & Notification](#18-toast--notification)
19. [Navigation & Menu](#19-navigation--menu)
20. [Progress & Loading](#20-progress--loading)
21. [Empty State](#21-empty-state)
22. [Error & Boundary](#22-error--boundary)
23. [Layout](#23-layout)
24. [Page Templates — Auth](#24-page-templates--auth)
25. [Page Templates — POS](#25-page-templates--pos)
26. [Page Templates — Dashboard](#26-page-templates--dashboard)
27. [Page Templates — Master Data](#27-page-templates--master-data)
28. [Page Templates — Laporan](#28-page-templates--laporan)
29. [Page Templates — Cafe (v2.0)](#29-page-templates--cafe-v20)
30. [Page Templates — Setting](#30-page-templates--setting)

---

## 1. Pendahuluan

Dokumen ini adalah **Design System** untuk **POS Offline PWA**. Berisi panduan lengkap tentang elemen visual, komponen UI, layout, dan template halaman. Dokumen ini menjadi acuan untuk: Developer (implementasi komponen), Designer (konsistensi visual), QA (verifikasi UI).

**Teknologi**: Tailwind CSS 3.x dengan utility-first approach.

---

## 2. Tujuan

1. Konsistensi visual di semua halaman
2. Mempercepat pengembangan dengan komponen reusable
3. Memudahkan onboarding developer baru
4. Dokumentasi keputusan desain
5. Aksesibilitas (WCAG 2.1 AA)

---

## 3. Prinsip Desain

| Prinsip | Deskripsi |
|---|---|
| **Clarity** | Antarmuka jelas. User tahu apa yang terjadi |
| **Efficiency** | POS harus cepat. Minimal klik untuk tugas utama |
| **Offline First** | Semua fitur berfungsi tanpa koneksi |
| **Consistency** | Pola yang sama diulang di semua halaman |
| **Accessibility** | Kontras cukup, font readable, keyboard navigable |
| **Responsive** | Optimal di tablet 10\" dan layar desktop |

---

## 4. Spesifikasi Brand

- **Nama Aplikasi**: POS Offline PWA
- **Tagline**: Kasir Cerdas, Usaha Maju
- **Tone**: Profesional, Modern, Bersih
- **Target User**: Pemilik UMKM, Kasir, Staff Cafe/Restoran

---

## 5. Palet Warna

### 5.1 Primary

| Token | Tailwind | Hex | Penggunaan |
|---|---|---|---|
| \`--color-primary-50\` | \`blue-50\` | #EFF6FF | Background hover ringan |
| \`--color-primary-100\` | \`blue-100\` | #DBEAFE | Background selected |
| \`--color-primary-500\` | \`blue-500\` | #3B82F6 | Tombol utama, link |
| \`--color-primary-600\` | \`blue-600\` | #2563EB | Hover tombol utama |
| \`--color-primary-700\` | \`blue-700\` | #1D4ED8 | Active tombol utama |

### 5.2 Success / Positive

| Token | Tailwind | Hex | Penggunaan |
|---|---|---|---|
| \`--color-success-50\` | \`green-50\` | #F0FDF4 | Background success |
| \`--color-success-500\` | \`green-500\` | #22C55E | Status PAID, stock OK |
| \`--color-success-600\` | \`green-600\` | #16A34A | Icon success |

### 5.3 Warning / Alert

| Token | Tailwind | Hex | Penggunaan |
|---|---|---|---|
| \`--color-warning-50\` | \`yellow-50\` | #FEFCE8 | Background warning |
| \`--color-warning-500\` | \`yellow-500\` | #EAB308 | Stock menipis, pending |
| \`--color-warning-600\` | \`yellow-600\` | #CA8A04 | Icon warning |

### 5.4 Danger / Error

| Token | Tailwind | Hex | Penggunaan |
|---|---|---|---|
| \`--color-danger-50\` | \`red-50\` | #FEF2F2 | Background error |
| \`--color-danger-500\` | \`red-500\` | #EF4444 | Void, error, hapus |
| \`--color-danger-600\` | \`red-600\` | #DC2626 | Hover tombol danger |

### 5.5 Neutral / Gray

| Token | Tailwind | Hex | Penggunaan |
|---|---|---|---|
| \`--color-gray-50\` | \`gray-50\` | #F9FAFB | Background utama |
| \`--color-gray-100\` | \`gray-100\` | #F3F4F6 | Card background, sidebar |
| \`--color-gray-200\` | \`gray-200\` | #E5E7EB | Border, divider |
| \`--color-gray-500\` | \`gray-500\` | #6B7280 | Secondary text |
| \`--color-gray-700\` | \`gray-700\` | #374151 | Body text |
| \`--color-gray-900\` | \`gray-900\` | #111827 | Heading text |

### 5.6 Dark Mode (Future)

| Token | Terang | Gelap | Notes |
|---|---|---|---|
| bg-primary | \`#F9FAFB\` | \`#111827\` | Swap background |
| bg-card | \`#FFFFFF\` | \`#1F2937\` | Card berubah |
| text-body | \`#374151\` | \`#D1D5DB\` | Teks utama |
| text-heading | \`#111827\` | \`#F9FAFB\` | Heading |

---

## 6. Tipografi

### 6.1 Font Family

| Token | Value | Penggunaan |
|---|---|---|
| \`--font-sans\` | \`Inter, system-ui, sans-serif\` | Body & heading |
| \`--font-mono\` | \`JetBrains Mono, monospace\` | Kode, nominal |

### 6.2 Type Scale

| Token | Size | Weight | Line Height | Penggunaan |
|---|---|---|---|---|
| \`text-xs\` | 12px | 400 | 16px | Caption, helper |
| \`text-sm\` | 14px | 400 | 20px | Body small, table cell |
| \`text-base\` | 16px | 400 | 24px | Body text default |
| \`text-lg\` | 18px | 500 | 28px | Card title |
| \`text-xl\` | 20px | 600 | 28px | Halaman heading |
| \`text-2xl\` | 24px | 700 | 32px | Modal title |
| \`text-3xl\` | 30px | 700 | 36px | POS total display |

### 6.3 Font Weight

| Weight | Tailwind | Penggunaan |
|---|---|---|
| 400 | \`font-normal\` | Body text |
| 500 | \`font-medium\` | Label, button |
| 600 | \`font-semibold\` | Subheading, table header |
| 700 | \`font-bold\` | Heading, total |

---

## 7. Iconography

- **Library**: Lucide React (atau Heroicons)
- **Size default**: 20px (\`w-5 h-5\`)
- **Stroke width**: 1.5px (default Lucide)
- **Warna**: Inherit dari text color

### 7.1 Icon Map

| Konteks | Icon |
|---|---|
| POS / Cart | \`ShoppingCart\` |
| Products | \`Package\` |
| Categories | \`FolderTree\` |
| Customers | \`Users\` |
| Suppliers | \`Truck\` |
| Sales | \`Receipt\` |
| Purchases | \`ShoppingBag\` |
| Inventory | \`Warehouse\` |
| Reports | \`BarChart3\` |
| Settings | \`Settings\` |
| Backup | \`Database\` |
| Shift | \`Clock\` |
| Cash Flow | \`Wallet\` |
| Logout | \`LogOut\` |
| Search | \`Search\` |
| Add | \`Plus\` |
| Edit | \`Pencil\` |
| Delete | \`Trash2\` |
| Print | \`Printer\` |
| Download | \`Download\` |
| Upload | \`Upload\` |
| Filter | \`Filter\` |
| Sort | \`ArrowUpDown\` |
| Void | \`Ban\` |
| Refund | \`Undo2\` |
| Close | \`X\` |
| Check | \`Check\` |
| Alert | \`AlertTriangle\` |

---

## 8. Spacing & Grid

### 8.1 Spacing Scale

Gunakan Tailwind spacing scale (4px base).

| Token | Pixels | Penggunaan |
|---|---|---|
| \`p-1\` | 4px | Padding terkecil |
| \`p-2\` | 8px | Padding dalam komponen |
| \`p-3\` | 12px | Padding card, form |
| \`p-4\` | 16px | Padding halaman |
| \`p-6\` | 24px | Padding section |
| \`p-8\` | 32px | Padding container besar |

### 8.2 Grid

| Layout | Breakpoint | Columns | Gap |
|---|---|---|---|
| Mobile | < 768px | 1 | 4 |
| Tablet | 768px - 1024px | 2 | 4 |
| Desktop | > 1024px | 3-4 | 6 |

### 8.3 Container

- Maks lebar konten: \`max-w-7xl\` (1280px)
- Padding horizontal: \`px-4\` (mobile), \`px-6\` (tablet), \`px-8\` (desktop)

---

## 9. Shadow & Elevation

| Level | Tailwind | Penggunaan |
|---|---|---|
| 0 | \`shadow-none\` | Flat surface |
| 1 | \`shadow-sm\` | Card, form |
| 2 | \`shadow\` | Dropdown, popover |
| 3 | \`shadow-md\` | Modal, drawer |
| 4 | \`shadow-lg\` | Dialog konfirmasi |
| 5 | \`shadow-xl\` | Notification toast |

---

## 10. Border & Radius

| Token | Radius | Penggunaan |
|---|---|---|
| \`rounded-none\` | 0px | Tag, badge tertentu |
| \`rounded-sm\` | 2px | Input, button kecil |
| \`rounded\` | 4px | Card, table |
| \`rounded-md\` | 6px | Modal, dialog |
| \`rounded-lg\` | 8px | Large card |
| \`rounded-full\` | 9999px | Avatar, badge |

### Border Width

| Token | Width | Penggunaan |
|---|---|---|
| \`border\` | 1px | Default border |
| \`border-2\` | 2px | Active, focus state |

---

## 11. Komponen Dasar (Atoms)

Setiap komponen didokumentasikan dengan:

- **Props**: Input dan tipe
- **States**: Default, Hover, Active, Disabled, Focus
- **Usage**: Contoh kode Tailwind
- **Accessibility**: ARIA attributes

---

## 12. Button

### 12.1 Variants

| Variant | Class | Penggunaan |
|---|---|---|
| Primary | \`bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700\` | Aksi utama |
| Secondary | \`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50\` | Aksi alternatif |
| Danger | \`bg-danger-500 text-white hover:bg-danger-600\` | Hapus, void |
| Ghost | \`text-gray-500 hover:bg-gray-100\` | Aksi minimal |
| Link | \`text-primary-500 hover:underline\` | Navigasi |

### 12.2 Sizes

| Size | Class | Padding |
|---|---|---|
| Sm | \`px-2 py-1 text-xs\` | 8px x 4px |
| Md | \`px-4 py-2 text-sm\` | 16px x 8px |
| Lg | \`px-6 py-3 text-base\` | 24px x 12px |

### 12.3 States

| State | Perubahan |
|---|---|
| Default | Warna normal |
| Hover | \`hover:bg-{variant}-600\` |
| Active | \`active:bg-{variant}-700\` |
| Disabled | \`opacity-50 cursor-not-allowed\` |
| Focus | \`focus:ring-2 focus:ring-primary-500 focus:ring-offset-2\` |

### 12.4 Icon Button

- Square, same padding horizontal & vertical
- \`p-2\` untuk md, \`p-1\` untuk sm

---

## 13. Input & Form

### 13.1 Text Input

| State | Class |
|---|---|
| Default | \`border border-gray-300 rounded px-3 py-2 text-sm\` |
| Focus | \`border-primary-500 ring-1 ring-primary-500\` |
| Error | \`border-danger-500 ring-1 ring-danger-500\` |
| Disabled | \`bg-gray-50 text-gray-400 cursor-not-allowed\` |

### 13.2 Label

- \`text-sm font-medium text-gray-700 mb-1\`
- Required indicator: \`<span class="text-danger-500">*</span>\`

### 13.3 Helper Text

- \`text-xs text-gray-500 mt-1\`
- Error helper: \`text-xs text-danger-500 mt-1\`

### 13.4 Select

Sama dengan text input, dengan custom chevron icon.

### 13.5 Checkbox & Radio

| State | Class |
|---|---|
| Unchecked | \`border-gray-300 bg-white\` |
| Checked | \`bg-primary-500 border-primary-500\` |
| Focus | \`ring-2 ring-primary-500 ring-offset-2\` |

### 13.6 Search Input

- Icon search di kiri
- Tombol clear di kanan (jika ada value)

### 13.7 Number Input

- \`text-right\` untuk alignment numeric
- Optional: increment/decrement buttons

### 13.8 Textarea

Sama dengan text input, dengan \`resize-vertical\`.

---

## 14. Card & Surface

### 14.1 Default Card

\`\`\`html
<div class="bg-white rounded shadow-sm border border-gray-200 p-4">
</div>
\`\`\`

### 14.2 Interactive Card

\`\`\`html
<div class="bg-white rounded shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-primary-200 cursor-pointer transition-all">
</div>
\`\`\`

### 14.3 Stat Card

\`\`\`html
<div class="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
    <!-- icon -->
  </div>
  <div>
    <p class="text-sm text-gray-500">Label</p>
    <p class="text-2xl font-bold text-gray-900">Value</p>
  </div>
</div>
\`\`\`

---

## 15. Table & Data Display

### 15.1 Table

| Token | Class |
|---|---|
| Header | \`bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider\` |
| Cell | \`px-4 py-3 text-sm text-gray-700\` |
| Row hover | \`hover:bg-gray-50\` |
| Border | \`border-b border-gray-200\` |

### 15.2 Table Variants

- **Striped**: \`even:bg-gray-50\`
- **Compact**: \`px-2 py-1 text-xs\`
- **With actions**: Kolom terakhir untuk tombol aksi

### 15.3 Data Display Patterns

- **Empty state**: Text + icon jika tidak ada data
- **Loading skeleton**: Animasi pulse untuk loading
- **Pagination**: \`flex items-center gap-2\`

---

## 16. Badge & Tag

### 16.1 Badge Variants

| Variant | Class | Penggunaan |
|---|---|---|
| Primary | \`bg-primary-100 text-primary-700\` | Default |
| Success | \`bg-success-100 text-success-700\` | PAID, ACTIVE, COMPLETED |
| Warning | \`bg-warning-100 text-warning-700\` | PENDING, PARTIAL |
| Danger | \`bg-danger-100 text-danger-700\` | VOID, CANCELLED, INACTIVE |
| Gray | \`bg-gray-100 text-gray-700\` | DRAFT, CLOSED |

### 16.2 Badge Sizes

| Size | Class |
|---|---|
| Sm | \`px-1.5 py-0.5 text-xs\` |
| Md | \`px-2 py-1 text-xs\` |
| Lg | \`px-3 py-1 text-sm\` |

### 16.3 Dot Badge

\`\`\`html
<span class="flex items-center gap-1 text-xs">
  <span class="w-1.5 h-1.5 rounded-full bg-success-500"></span>
  Active
</span>
\`\`\`

---

## 17. Modal & Dialog

### 17.1 Modal

| Layer | Class |
|---|---|
| Overlay | \`fixed inset-0 bg-black/50 z-40\` |
| Container | \`fixed inset-0 z-50 flex items-center justify-center\` |
| Content | \`bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6\` |

### 17.2 Confirmation Dialog

\`\`\`html
<div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
      <AlertTriangle class="w-5 h-5 text-danger-500" />
    </div>
    <div>
      <h2 class="text-lg font-semibold">Konfirmasi</h2>
      <p class="text-sm text-gray-500">Apakah Anda yakin?</p>
    </div>
  </div>
  <div class="flex justify-end gap-2 mt-6">
    <button class="btn-secondary">Batal</button>
    <button class="btn-danger">Ya, Hapus</button>
  </div>
</div>
\`\`\`

### 17.3 Drawer (Side Panel)

- Muncul dari kanan
- Lebar: \`max-w-md\` (mobile), \`w-96\` (desktop)
- Transition: \`translate-x-0\` / \`translate-x-full\`

---

## 18. Toast & Notification

### 18.1 Toast Variants

| Variant | Class | Icon |
|---|---|---|
| Success | \`bg-success-500 text-white\` | CheckCircle |
| Error | \`bg-danger-500 text-white\` | XCircle |
| Warning | \`bg-warning-500 text-white\` | AlertTriangle |
| Info | \`bg-primary-500 text-white\` | Info |

### 18.2 Position

- Fixed top-right: \`fixed top-4 right-4 z-50\`

### 18.3 Behavior

- Auto dismiss: 3 detik (success/info), 5 detik (warning/error)
- Manual dismiss: Tombol X

---

## 19. Navigation & Menu

### 19.1 Sidebar (Desktop)

| Element | Class |
|---|---|
| Container | \`w-64 bg-gray-100 border-r border-gray-200 h-screen fixed left-0 top-0\` |
| Menu item | \`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200\` |
| Active item | \`bg-primary-50 text-primary-700 font-medium\` |
| Section title | \`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider\` |

### 19.2 Bottom Navigation (Mobile)

- Fixed bottom, 5 menu utama
- Background: white
- Active: Primary color

### 19.3 Breadcrumb

\`\`\`html
<nav class="flex items-center gap-1 text-sm text-gray-500">
  <a href="/" class="hover:text-gray-700">Dashboard</a>
  <ChevronRight class="w-4 h-4" />
  <span class="text-gray-900 font-medium">Products</span>
</nav>
\`\`\`

### 19.4 Tabs

| State | Class |
|---|---|
| Default | \`text-gray-500 hover:text-gray-700\` |
| Active | \`text-primary-500 border-b-2 border-primary-500\` |

---

## 20. Progress & Loading

### 20.1 Spinner

\`\`\`html
<div class="animate-spin rounded-full w-6 h-6 border-2 border-gray-200 border-t-primary-500"></div>
\`\`\`

### 20.2 Skeleton

\`\`\`html
<div class="animate-pulse bg-gray-200 rounded h-4 w-full"></div>
\`\`\`

### 20.3 Progress Bar

| Token | Class |
|---|---|
| Track | \`w-full bg-gray-200 rounded-full h-2\` |
| Fill | \`bg-primary-500 rounded-full h-2 transition-all\` |

### 20.4 Full Page Loader

\`\`\`html
<div class="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
  <div class="flex flex-col items-center gap-3">
    <div class="spinner w-8 h-8"></div>
    <p class="text-sm text-gray-500">Memuat...</p>
  </div>
</div>
\`\`\`

---

## 21. Empty State

\`\`\`html
<div class="flex flex-col items-center justify-center py-12 text-center">
  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <Package class="w-8 h-8 text-gray-400" />
  </div>
  <h3 class="text-base font-medium text-gray-900 mb-1">Belum ada produk</h3>
  <p class="text-sm text-gray-500 mb-4">Tambahkan produk pertama Anda</p>
  <button class="btn-primary">+ Tambah Produk</button>
</div>
\`\`\`

---

## 22. Error & Boundary

### 22.1 Inline Error

\`\`\`html
<div class="flex items-center gap-2 p-3 bg-danger-50 rounded text-sm text-danger-600">
  <AlertCircle class="w-4 h-4 flex-shrink-0" />
  <p>Gagal memuat data. Coba lagi.</p>
</div>
\`\`\`

### 22.2 Full Page Error

\`\`\`html
<div class="flex flex-col items-center justify-center min-h-screen p-8 text-center">
  <AlertTriangle class="w-16 h-16 text-danger-500 mb-4" />
  <h1 class="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
  <p class="text-sm text-gray-500 mb-6">{error message}</p>
  <div class="flex gap-2">
    <button onclick="window.location.reload()" class="btn-primary">Muat Ulang</button>
    <button onclick="history.back()" class="btn-secondary">Kembali</button>
  </div>
</div>
\`\`\`

### 22.3 404 Page

\`\`\`html
<div class="flex flex-col items-center justify-center min-h-screen p-8 text-center">
  <h1 class="text-6xl font-bold text-gray-200 mb-2">404</h1>
  <p class="text-lg text-gray-500 mb-6">Halaman tidak ditemukan</p>
  <button onclick="window.location.href='/'" class="btn-primary">Ke Dashboard</button>
</div>
\`\`\`

---

## 23. Layout

### 23.1 App Shell

\`\`\`
+-------------------------------------+
|  Header (logo, search, user)        |
+----------+--------------------------+
| Sidebar  |  Main Content             |
| (fixed)  |  (scrollable)            |
|          |                          |
|          |                          |
+----------+--------------------------+
|  Bottom Nav (mobile only)           |
+-------------------------------------+
\`\`\`

### 23.2 Page Layout

\`\`\`
+-------------------------------------+
|  Breadcrumb                         |
|  Page Header (title + actions)      |
+-------------------------------------+
|  Filter / Search Bar (optional)     |
+-------------------------------------+
|  Content Area                       |
|  (table, cards, or form)            |
+-------------------------------------+
|  Pagination (optional)              |
+-------------------------------------+
\`\`\`

### 23.3 POS Layout

\`\`\`
+-------------------+------------------+
|  Product Grid     |  Cart Panel       |
|  (search, filter) |  (items, total)   |
|                   |                   |
|  [Card][Card]     |  Item 1    x 2    |
|  [Card][Card]     |  Item 2     1     |
|  [Card][Card]     |  -----------------|
|                   |  Subtotal: Rp X   |
|                   |  Diskon:   Rp Y   |
|                   |  Grand:    Rp Z   |
|                   |                   |
|                   |  [Bayar] [Hold]   |
+-------------------+------------------+
\`\`\`

---

## 24. Page Templates — Auth

### 24.1 Login Page

- **Layout**: Center card, single column
- **Content**: Logo, form (username, password), tombol login
- **Actions**: Login, (future) forgot password
- **Route**: \`/login\`
- **State**: Inactive user mendapat error "Akun dinonaktifkan"

### 24.2 Lock Screen

- **Layout**: Center card, single column
- **Content**: Avatar, nama user, PIN input, tombol unlock
- **Route**: \`/lock\`

---

## 25. Page Templates — POS

### 25.1 POS Main

- **Layout**: Product grid (left, 2/3) + Cart panel (right, 1/3)
- **Content**: Search bar, category filter, product cards, cart items, total, payment
- **Actions**: Bayar (modal), Hold, Void
- **Route**: \`/pos\`
- **Mobile**: Cart sebagai drawer

### 25.2 POS — Payment Modal

- **Layout**: Modal center
- **Content**: Grand total, pilih metode, input amount
- **Actions**: Bayar, Batal

### 25.3 POS — Payment Success

- **Layout**: Full center
- **Content**: Check icon, invoice number, change amount
- **Actions**: Cetak Struk, Transaksi Baru

---

## 26. Page Templates — Dashboard

### 26.1 Dashboard

- **Layout**: Grid stat cards (top) + charts/data (bottom)
- **Content**: Today sale, active shift, total products, low stock alert
- **Route**: \`/\` or \`/dashboard\`
- **Charts**: Minimal, prefer numeric KPIs

---

## 27. Page Templates — Master Data

### 27.1 Product List

- **Layout**: Page header + filter/search + table/grid
- **Content**: SKU, name, category, price, stock, status
- **Actions**: Tambah, Edit, Duplicate, Export, Import
- **Route**: \`/products\`

### 27.2 Product Form

- **Layout**: Single column form
- **Content**: SKU, barcode, name, category, unit, buy/sell price, min stock, type
- **Actions**: Save, Cancel

### 27.3 Categories, Units, Suppliers, Customers

- Pola sama dengan Product List
- Table: List dengan inline search
- Form: Modal/dialog

---

## 28. Page Templates — Laporan

### 28.1 Laporan Penjualan

- **Layout**: Filter date range + export buttons + table
- **Content**: Tanggal, invoice, customer, items, total, method
- **Route**: \`/reports/sales\`

### 28.2 Laporan Stok

- **Layout**: Filter + table
- **Content**: SKU, name, stock, min stock, status
- **Route**: \`/reports/stock\`

### 28.3 Laporan Keuangan

- **Layout**: Period filter + summary + detail table
- **Content**: Revenue, expense, profit
- **Route**: \`/reports/finance\`

---

## 29. Page Templates — Cafe (v2.0)

### 29.1 Table Management

- **Layout**: Grid of table cards
- **Content**: Table name, capacity, status (color-coded), action
- **Actions**: Open table (POS), Reserve, Merge, Split

### 29.2 Kitchen Display

- **Layout**: Columnar grid (Pending, Preparing, Ready)
- **Content**: Order number, items, time elapsed

---

## 30. Page Templates — Setting

### 30.1 Store Settings

- **Layout**: Single column form, sections
- **Sections**: General, Tax, Shift, Theme

### 30.2 User Management

- **Layout**: Table + modal form
- **Content**: Username, name, role, status, last login

### 30.3 Role & Permission

- **Layout**: Table of roles, click to show permission matrix
- **Content**: Module x Action checkboxes

### 30.4 Backup & Restore

- **Layout**: Action cards
- **Content**: Backup button, restore button, backup history table

---

> **Dokumen ini adalah acuan desain UI/UX untuk POS Offline PWA.**  
> Konsisten dengan \`01_PROJECT_BLUEPRINT.md\`, \`02_DATABASE_SCHEMA.md\`, dan \`03_BUSINESS_RULES.md\`.

---

*POS Offline PWA — UI Design System v1.0.0 — 15 Juli 2026*
