# 05_COMPONENT_LIBRARY.md

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Filosofi Komponen](#2-filosofi-komponen)
3. [Component State](#3-component-state)
4. [Naming Convention](#4-naming-convention)
5. [Foundation](#5-foundation)
6. [Layout Components](#6-layout-components)
7. [Navigation Components](#7-navigation-components)
8. [Form Components](#8-form-components)
9. [Button Components](#9-button-components)
10. [Data Display Components](#10-data-display-components)
11. [Feedback Components](#11-feedback-components)
12. [Overlay Components](#12-overlay-components)
13. [POS Components](#13-pos-components)
14. [Cafe Components](#14-cafe-components)
15. [Dashboard Components](#15-dashboard-components)
16. [Setting Components](#16-setting-components)
17. [Responsiveness](#17-responsiveness)
18. [Accessibility](#18-accessibility)
19. [Komposisi Komponen](#19-komposisi-komponen)
20. [Component Dependency](#20-component-dependency)
21. [Anti Pattern](#21-anti-pattern)
22. [Future Components](#22-future-components)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini adalah **katalog resmi** seluruh komponen UI yang digunakan di aplikasi POS Offline PWA. Setiap komponen didefinisikan secara spesifik — tujuan, fungsi, variasi, state, perilaku, dan aturan penggunaan — tanpa menyertakan implementasi HTML, CSS, atau JavaScript.

Dokumen ini menjadi jembatan antara **Design System** (`04_UI_DESIGN_SYSTEM.md`) dan implementasi teknis. Developer dan AI menggunakan dokumen ini untuk membangun antarmuka yang konsisten.

### 1.2 Acuan

Dokumen ini konsisten dengan:

- `01_PROJECT_BLUEPRINT.md` — Arsitektur dan prinsip aplikasi
- `02_DATABASE_SCHEMA.md` — Struktur data yang ditampilkan komponen
- `03_BUSINESS_RULES.md` — Aturan bisnis yang mengatur perilaku komponen
- `04_UI_DESIGN_SYSTEM.md` — Token desain (warna, tipografi, spacing, shadow)

### 1.3 Framework

Komponen dirancang framework-agnostic. Seluruh komponen dapat diimplementasikan menggunakan **Bootstrap 5**, **Tailwind CSS**, atau framework utility-first lainnya. Tidak ada ketergantungan pada framework frontend tertentu (React, Vue, Angular).

---

## 2. Filosofi Komponen

### 2.1 Reusable

Setiap komponen harus dapat digunakan di lebih dari satu tempat. Komponen yang hanya dipakai di satu halaman harus dihindari atau direfaktor menjadi komponen yang lebih umum.

**Mengapa**: Mengurangi duplikasi kode, mempercepat pengembangan, dan memudahkan pemeliharaan.

### 2.2 Modular

Komponen dibangun sebagai unit mandiri yang dapat berdiri sendiri. Setiap komponen memiliki satu tanggung jawab dan menerima input melalui props/attributes yang terdefinisi.

**Mengapa**: Memudahkan pengujian, penggantian, dan pengembangan paralel.

### 2.3 Consistent

Seluruh komponen mengikuti standar visual dan perilaku yang sama. Tidak ada variasi yang tidak perlu. Setiap state (hover, active, disabled) konsisten di semua komponen.

**Mengapa**: Pengguna tidak perlu mempelajari ulang pola interaksi yang berbeda di halaman berbeda.

### 2.4 Responsive

Setiap komponen harus berfungsi dengan baik di semua ukuran layar: tablet (10" — target utama), desktop, dan smartphone. Responsivitas adalah bagian dari desain, bukan lapisan tambahan.

**Mengapa**: Aplikasi digunakan di berbagai perangkat — kasir di tablet, admin di laptop.

### 2.5 Accessible

Setiap komponen memenuhi standar WCAG 2.1 AA. Fokus indicator, keyboard navigation, screen reader support, dan kontras warna adalah persyaratan, bukan opsional.

**Mengapa**: Aplikasi harus dapat digunakan oleh semua orang, termasuk pengguna dengan keterbatasan.

### 2.6 Maintainable

Komponen dirancang dengan kompleksitas minimal. Hindari terlalu banyak props, terlalu banyak variasi, atau logika internal yang rumit. Komponen yang sulit dipahami akan sulit dirawat.

**Mengapa**: Proyek akan dikelola oleh banyak developer dan AI sepanjang siklus hidupnya.

### 2.7 Composable

Komponen kecil dapat digabungkan untuk membentuk komponen yang lebih besar. Pola komposisi lebih diutamakan daripada pewarisan atau konfigurasi monolitik.

**Mengapa**: Memberikan fleksibilitas maksimal tanpa menambah kompleksitas.

### 2.8 Touch Friendly

Semua elemen interaktif memiliki ukuran minimum 44x44px (target sentuh). Gesture swipe, tap, dan long-press dipertimbangkan dalam desain.

**Mengapa**: Target utama adalah perangkat layar sentuh (tablet, smartphone).

### 2.9 Tablet Optimized

Layout dan interaksi dioptimalkan untuk layar 10" dalam orientasi landscape. Ini adalah mode operasi utama kasir.

**Mengapa**: Sebagian besar pengguna akan menjalankan POS di tablet yang diletakkan di meja kasir.

---

## 3. Component State

Seluruh komponen interaktif mendukung state berikut:

| State | Trigger | Perilaku |
|---|---|---|
| **Default** | Komponen dirender pertama kali | Tampilan normal sesuai variasi |
| **Hover** | Pointer berada di atas komponen | Perubahan visual ringan (warna, shadow) sebagai indikasi interaktivitas |
| **Focus** | Komponen menerima fokus keyboard/tap | Outline atau ring berwarna primary. Wajib untuk accessibility |
| **Active** | Pointer ditekan di atas komponen | Perubahan visual lebih kuat dari hover, biasanya warna lebih gelap |
| **Disabled** | Komponen tidak tersedia untuk interaksi | Opacity 50%, cursor not-allowed. Tidak merespons hover/focus/active |
| **Loading** | Komponen sedang memproses aksi | Spinner menggantikan atau muncul di samping label. Semua interaksi diblokir |
| **Error** | Komponen dalam kondisi error (khusus form) | Border merah, icon error, helper text merah |
| **Success** | Aksi berhasil dilakukan | Animasi sukses singkat (centang, highlight hijau) |
| **Empty** | Komponen data tidak memiliki konten | Tampilkan empty state dengan ilustrasi dan ajakan bertindak |
| **Readonly** | Komponen menampilkan data yang tidak bisa diedit (khusus form) | Tampilan seperti default, tanpa interaksi edit |

---

## 4. Naming Convention

### 4.1 Pola Umum

```
{Context}{Component}{Variant}
```

| Bagian | Deskripsi | Contoh |
|---|---|---|
| Context | Modul atau area fungsi | `App`, `Product`, `Sale`, `Payment`, `Dashboard` |
| Component | Nama komponen | `Button`, `Card`, `Table`, `Input`, `Modal` |
| Variant | Variasi spesifik (opsional) | `Primary`, `Danger`, `Large`, `Compact` |

### 4.2 Daftar Nama Komponen

| Nama Komponen | Kategori | Keterangan |
|---|---|---|
| `AppLayout` | Layout | Kerangka utama aplikasi |
| `AppSidebar` | Navigation | Sidebar navigasi desktop |
| `AppTopbar` | Layout | Header aplikasi |
| `AppBottomNav` | Navigation | Navigasi bawah mobile |
| `AppBreadcrumb` | Navigation | Breadcrumb navigasi |
| `AppButton` | Button | Tombol universal |
| `AppIconButton` | Button | Tombol icon |
| `AppFloatingButton` | Button | Tombol floating aksi |
| `AppInput` | Form | Input teks universal |
| `AppNumberInput` | Form | Input angka |
| `AppCurrencyInput` | Form | Input mata uang |
| `AppSearchBox` | Form | Pencarian |
| `AppSelect` | Form | Dropdown pilihan |
| `AppMultiSelect` | Form | Pilihan ganda |
| `AppCheckbox` | Form | Ceklis |
| `AppRadio` | Form | Radio button |
| `AppToggle` | Form | Switch |
| `AppTextarea` | Form | Input teks panjang |
| `AppDatePicker` | Form | Pilih tanggal |
| `AppTimePicker` | Form | Pilih waktu |
| `AppFileUpload` | Form | Upload file |
| `AppCard` | Data Display | Kartu konten |
| `AppStatCard` | Data Display | Kartu statistik |
| `AppKpiCard` | Data Display | Kartu KPI |
| `AppTable` | Data Display | Tabel data |
| `AppBadge` | Data Display | Label status |
| `AppAvatar` | Data Display | Foto profil |
| `AppChip` | Data Display | Tag informasi |
| `AppTooltip` | Data Display | Informasi tambahan hover |
| `AppAlert` | Feedback | Pesan peringatan |
| `AppToast` | Feedback | Notifikasi sementara |
| `AppSnackbar` | Feedback | Notifikasi bawah |
| `AppProgressBar` | Feedback | Progress linear |
| `AppSpinner` | Feedback | Loading melingkar |
| `AppSkeleton` | Feedback | Placeholder loading |
| `AppEmptyState` | Feedback | Kondisi tanpa data |
| `AppErrorState` | Feedback | Kondisi error |
| `AppModal` | Overlay | Jendela modal |
| `AppDrawer` | Overlay | Panel samping |
| `AppDialog` | Overlay | Dialog konfirmasi |
| `AppConfirmDialog` | Overlay | Dialog konfirmasi dengan aksi |
| `AppFullscreenDialog` | Overlay | Dialog layar penuh |
| `ProductCard` | POS | Kartu produk di POS |
| `ProductGrid` | POS | Grid produk |
| `ProductSearch` | POS | Pencarian produk POS |
| `AppCart` | POS | Keranjang belanja |
| `AppCartItem` | POS | Item keranjang |
| `AppQuantitySelector` | POS | Pengatur jumlah |
| `AppDiscountPanel` | POS | Panel diskon |
| `AppTaxPanel` | POS | Panel pajak |
| `AppPaymentPanel` | POS | Panel pembayaran |
| `AppCalculatorPad` | POS | Kalkulator numerik |
| `AppReceiptPreview` | POS | Pratinjau struk |
| `AppCashSummary` | POS | Ringkasan kas |
| `AppShiftSummary` | POS | Ringkasan shift |
| `AppBarcodeScanner` | POS | Scanner barcode |
| `AppQrScanner` | POS | Scanner QR |
| `AppReceiptItem` | POS | Item struk |
| `AppSalesSummary` | Dashboard | Ringkasan penjualan |
| `AppRevenueCard` | Dashboard | Kartu pendapatan |
| `AppProfitCard` | Dashboard | Kartu laba |
| `AppChartCard` | Dashboard | Kartu grafik |
| `AppLowStockCard` | Dashboard | Kartu stok menipis |
| `AppActivityTimeline` | Dashboard | Timeline aktivitas |
| `AppRecentTransaction` | Dashboard | Transaksi terbaru |
| `AppQuickAction` | Dashboard | Aksi cepat |
| `TableCard` | Cafe | Kartu meja |
| `TableLayout` | Cafe | Layout meja |
| `KitchenTicket` | Cafe | Tiket dapur |
| `KitchenQueue` | Cafe | Antrian dapur |
| `OrderTimeline` | Cafe | Timeline pesanan |
| `ReservationCard` | Cafe | Kartu reservasi |
| `AppThemeSwitch` | Setting | Toggle tema |
| `AppBackupPanel` | Setting | Panel backup |
| `AppRestorePanel` | Setting | Panel restore |
| `AppDatabaseStatus` | Setting | Status database |
| `AppStorageUsage` | Setting | Penggunaan penyimpanan |
| `AppTab` | Navigation | Tab navigasi |
| `AppPagination` | Navigation | Navigasi halaman |
| `AppDropdown` | Navigation | Dropdown menu |
| `AppNavDrawer` | Navigation | Drawer navigasi mobile |
| `AppContextMenu` | Navigation | Menu konteks |
| `AppPageContainer` | Layout | Container halaman |
| `AppSection` | Layout | Section dalam halaman |
| `AppDivider` | Layout | Garis pemisah |

---

## 5. Foundation

Foundation adalah token desain yang menjadi dasar seluruh komponen. Token didefinisikan di `04_UI_DESIGN_SYSTEM.md` dan diacu oleh komponen.

### 5.1 Color Token

| Token | Digunakan Oleh |
|---|---|
| `--color-primary-*` | Button, Badge, Link, Active state, Focus ring |
| `--color-success-*` | Badge (PAID, ACTIVE), Alert sukses, Icon sukses |
| `--color-warning-*` | Badge (PENDING, PARTIAL), Alert warning, Low stock |
| `--color-danger-*` | Button danger, Badge (VOID, ERROR), Alert error |
| `--color-gray-*` | Background, Card, Text, Border, Divider |

### 5.2 Typography

| Token | Digunakan Oleh |
|---|---|
| `--font-sans` | Body, Heading, Button, Label, Table |
| `--font-mono` | Nominal, Kode produk, Invoice number |
| Type scale (xs-3xl) | Seluruh komponen teks |

### 5.3 Icon

| Atribut | Spesifikasi |
|---|---|
| Library | Lucide (framework-agnostic — import sebagai SVG atau icon font) |
| Ukuran default | 20x20px |
| Ukuran kecil | 16x16px |
| Ukuran besar | 24x24px |
| Warna | Inherit dari text color, atau token warna spesifik |
| Stroke | 1.5px |

### 5.4 Grid

| Atribut | Spesifikasi |
|---|---|
| Sistem | 12-column grid |
| Gap default | 16px |
| Breakpoint | Mobile: <768px, Tablet: 768-1024px, Desktop: >1024px |
| Max width container | 1280px |

### 5.5 Spacing

| Token | Pixel | Penggunaan |
|---|---|---|
| `spacing-1` | 4px | Padding internal komponen kecil |
| `spacing-2` | 8px | Gap antar elemen dalam komponen |
| `spacing-3` | 12px | Padding form, card kecil |
| `spacing-4` | 16px | Padding card, page |
| `spacing-6` | 24px | Padding section |
| `spacing-8` | 32px | Padding container, margin section |

### 5.6 Radius

| Token | Value | Penggunaan |
|---|---|---|
| `radius-sm` | 2px | Input, button kecil |
| `radius-md` | 4px | Card, table, komponen standar |
| `radius-lg` | 6px | Modal, dialog |
| `radius-xl` | 8px | Large card |
| `radius-full` | 9999px | Avatar, badge, dot |

### 5.7 Shadow

| Level | Penggunaan |
|---|---|
| 0 (none) | Flat surface, background |
| 1 (sm) | Card, form |
| 2 (md) | Dropdown, popover |
| 3 (lg) | Modal, drawer |
| 4 (xl) | Dialog konfirmasi, toast |

### 5.8 Animation

| Atribut | Spesifikasi |
|---|---|
| Durasi default | 200ms |
| Durasi modal/drawer | 300ms |
| Durasi toast | 300ms masuk, 300ms keluar |
| Easing | ease-in-out |
| Transisi properti | opacity, transform, background-color, box-shadow |
| Prefers-reduced-motion | Semua animasi di-respect |

---

## 6. Layout Components

### 6.1 AppLayout

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Kerangka utama aplikasi yang menggabungkan Sidebar, Topbar, Main Content, dan Bottom Nav |
| Fungsi | Mengatur tata letak tetap: sidebar tetap di kiri, topbar tetap di atas, konten scrollable |
| Variasi | Default (dengan sidebar), Compact (tanpa sidebar — untuk POS layar penuh) |
| Perilaku | Sidebar visible di desktop, tersembunyi di mobile (diganti BottomNav). Topbar selalu visible |
| Responsive | Mobile: bottom nav + topbar. Desktop: sidebar + topbar. POS: topbar + konten penuh |

### 6.2 AppSidebar

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Navigasi utama aplikasi untuk desktop |
| Fungsi | Menampilkan menu navigasi, logo, dan user info |
| Variasi | Default (64px + label), Collapsed (64px, icon only) |
| Perilaku | Fixed di kiri. Bisa di-collapse/expand. Menu aktif ditandai. Scroll jika konten melebihi tinggi layar |
| Responsive | Visible di >=1024px. Hidden di <1024px (diganti AppBottomNav) |

### 6.3 AppTopbar

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Header aplikasi yang menampilkan judul halaman, pencarian global, dan aksi pengguna |
| Fungsi | Menampilkan breadcrumb, tombol menu mobile, notifikasi, avatar user |
| Variasi | Default (dengan sidebar), POS mode (tanpa sidebar, judul POS) |
| Perilaku | Fixed di atas. Tinggi 56px. Selalu visible |
| Responsive | Mobile: hamburger menu di kiri. Desktop: breadcrumb di kiri |

### 6.4 AppMainContent

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Area konten utama yang scrollable |
| Fungsi | Menampung seluruh konten halaman |
| Perilaku | Scroll overflow-y. Padding konsisten. Margin-top untuk topbar. Margin-left untuk sidebar (desktop) |

### 6.5 AppPageContainer

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pembungkus konten halaman dengan padding dan lebar maksimal |
| Fungsi | Membatasi lebar konten dan memberikan padding konsisten |
| Variasi | Default (max-w-7xl), Full (100% lebar — untuk POS) |
| Perilaku | Padding responsive. Lebar maksimal 1280px |

### 6.6 AppSection

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Membagi halaman menjadi beberapa bagian vertikal |
| Fungsi | Memberi jarak antar kelompok konten |
| Variasi | Default (padding 24px), Compact (padding 16px) |
| Perilaku | Margin-bottom konsisten. Opsional judul section |

### 6.7 AppDivider

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pemisah visual antar konten |
| Fungsi | Garis horizontal atau vertikal untuk memisahkan konten |
| Variasi | Horizontal (default), Vertical (untuk inline). Opsional label |
| Perilaku | Warna gray-200. Ketebalan 1px |

### 6.8 AppFooter

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Footer halaman |
| Fungsi | Menampilkan informasi versi, status koneksi, copyright |
| Perilaku | Muncul di bagian bawah konten. Tidak fixed |

---

## 7. Navigation Components

### 7.1 AppSidebarMenu

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menu navigasi di dalam sidebar |
| Fungsi | Menampilkan daftar menu dengan icon dan label. Mendukung nesting dan section |
| Variasi | Section header, Menu item, Sub-menu, Active state |
| Perilaku | Klik menu navigasi ke route. Active item ditandai. Sub-menu expand/collapse dengan animasi |

### 7.2 AppBreadcrumb

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menunjukkan posisi halaman dalam hierarki navigasi |
| Fungsi | Menampilkan trail halaman saat ini sampai root. Setiap segmen bisa diklik |
| Perilaku | Segmen aktif (terakhir) tidak bisa diklik. Pemisah chevron di antara segmen |

### 7.3 AppTab

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Navigasi horizontal dalam satu halaman |
| Fungsi | Menampilkan tab yang bisa diklik untuk mengganti konten di bawahnya |
| Variasi | Underline (default), Pill, Filled |
| Perilaku | Tab aktif ditandai. Scrollable horizontal jika terlalu banyak. Animasi underline slide (opsional) |

### 7.4 AppPagination

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Navigasi antar halaman data |
| Fungsi | Menampilkan tombol prev, next, nomor halaman, dan total data |
| Variasi | Default (dengan nomor), Compact (prev-next only), Simple (load more) |
| Perilaku | Halaman aktif ditandai. Prev nonaktif di halaman 1. Next nonaktif di halaman terakhir |

### 7.5 AppDropdown

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menu pop-up yang muncul saat tombol diklik |
| Fungsi | Menampilkan daftar aksi atau navigasi dalam panel mengambang |
| Variasi | Icon dropdown (titik tiga), Button dropdown, Avatar dropdown |
| Perilaku | Posisi menyesuaikan ruang. Tutup saat klik di luar (click outside). Item dengan icon |

### 7.6 AppNavDrawer

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Drawer navigasi untuk mobile |
| Fungsi | Panel geser dari kiri yang berisi menu navigasi lengkap |
| Perilaku | Muncul dari kiri dengan overlay. Tutup saat klik overlay atau pilih menu |

### 7.7 AppContextMenu

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menu pop-up pada klik kanan |
| Fungsi | Menampilkan aksi kontekstual untuk elemen tertentu |
| Variasi | Table row context menu, Card context menu |
| Perilaku | Posisi mengikuti kursor. Tutup saat klik di luar. Menu dikelompokkan dengan separator |

---

## 8. Form Components

### 8.1 AppInput

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Input teks satu baris |
| Fungsi | Menerima input teks dari pengguna |
| State | Default, Focus, Error, Disabled, Readonly |
| Validasi | Required, minLength, maxLength, pattern (regex) |
| Error State | Border merah, icon error, helper text merah |
| Disabled State | Background abu-abu, opacity 50%, cursor not-allowed |
| Readonly State | Tampilan normal, tidak bisa diedit, cursor default |

### 8.2 AppNumberInput

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Input angka — stok, quantity, harga |
| Fungsi | Menerima input numerik. Opsional increment/decrement buttons |
| State | Sama dengan AppInput |
| Validasi | Min, max, step, integer-only |
| Perilaku | Text-align right. Tombol +/- di kanan (opsional). Cegah input non-numerik |

### 8.3 AppCurrencyInput

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Input nilai mata uang (Rupiah) |
| Fungsi | Menerima input nominal dengan format uang. Prefix Rp |
| State | Sama dengan AppInput |
| Validasi | Min 0, max sesuai konteks. Format ribuan otomatis |
| Perilaku | Text-align right. Prefix "Rp" di kiri. Format number dengan separator ribuan saat blur |

### 8.4 AppDatePicker

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih tanggal |
| Fungsi | Menampilkan kalender untuk memilih tanggal. Bisa input manual |
| State | Default, Focus, Error, Disabled |
| Variasi | Single date, Date range (v2.0) |
| Perilaku | Kalender pop-up di bawah input. Navigasi bulan/tahun. Tombol hari ini |

### 8.5 AppTimePicker

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih waktu |
| Fungsi | Menampilkan dropdown jam:menit |
| Perilaku | Format 24 jam. Dropdown atau scroll wheel |

### 8.6 AppTextarea

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Input teks multi-baris |
| Fungsi | Menerima input teks panjang (catatan, alamat, deskripsi) |
| State | Sama dengan AppInput |
| Perilaku | Resize vertical. Min-height 3 baris. Character count (opsional) |

### 8.7 AppSearchBox

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pencarian data |
| Fungsi | Input teks dengan icon search di kiri dan tombol clear di kanan |
| State | Default, Focus, Active (sedang mengetik), Empty |
| Perilaku | Debounce 300ms untuk trigger pencarian. Tombol clear muncul saat ada value |

### 8.8 AppSelect

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih satu opsi dari daftar |
| Fungsi | Dropdown dengan daftar pilihan |
| State | Default, Focus, Error, Disabled |
| Variasi | Default (native select), Custom (div dropdown) |
| Perilaku | Placeholder sebagai opsi pertama. Scroll jika opsi banyak. Searchable (opsional) |

### 8.9 AppMultiSelect

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih beberapa opsi dari daftar |
| Fungsi | Dropdown dengan checkbox di setiap opsi. Tag dari opsi terpilih |
| State | Default, Focus, Error, Disabled |
| Perilaku | Tag opsi terpilih di dalam input. Tombol clear semua. Searchable |

### 8.10 AppCheckbox

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih opsi boolean atau multiple dari grup |
| Fungsi | Kotak ceklis yang bisa dicentang |
| State | Unchecked, Checked, Indeterminate, Disabled |
| Perilaku | Label di kanan checkbox. Grup checkbox menggunakan fieldset/legend |

### 8.11 AppRadio

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Memilih satu opsi dari beberapa pilihan |
| Fungsi | Radio button melingkar |
| State | Unselected, Selected, Disabled |
| Perilaku | Hanya satu yang bisa dipilih dalam satu grup. Label di kanan |

### 8.12 AppToggle

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Mengaktifkan/menonaktifkan pengaturan |
| Fungsi | Switch slider dengan label |
| State | On, Off, Disabled |
| Perilaku | Animasi slide. Warna hijau saat on. Label di kiri atau kanan |

### 8.13 AppFileUpload

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Upload file (foto produk, backup) |
| Fungsi | Area drop zone atau tombol upload |
| State | Empty, Selected (dengan preview), Uploading, Success, Error |
| Perilaku | Validasi tipe file dan ukuran. Preview gambar untuk foto. Progress bar saat uploading |

---

## 9. Button Components

### 9.1 AppButton

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tombol aksi utama dalam aplikasi |
| Fungsi | Memicu aksi saat diklik |

#### Variasi

| Variasi | Penggunaan | Konteks |
|---|---|---|
| **Primary** | Aksi utama halaman | Simpan, Bayar, Tambah |
| **Secondary** | Aksi alternatif | Batal, Kembali |
| **Outline** | Aksi dengan penekanan lebih rendah | Filter, Terapkan |
| **Success** | Konfirmasi positif | Setujui, Aktifkan, PAID |
| **Warning** | Aksi dengan risiko rendah | Hold, Pending |
| **Danger** | Aksi destruktif | Hapus, Void, Nonaktifkan |
| **Ghost** | Aksi minimal dalam card/table | Edit, Detail |
| **Link** | Navigasi atau aksi dalam teks | Lihat semua, Atur |

#### Ukuran

| Ukuran | Height | Padding | Font | Icon |
|---|---|---|---|---|
| Sm | 28px | 8px 12px | 12px | 14px |
| Md | 36px | 8px 16px | 14px | 16px |
| Lg | 44px | 12px 24px | 16px | 20px |

#### Perilaku

| Aspek | Spesifikasi |
|---|---|
| Loading | Spinner menggantikan icon, label tetap. Button disabled selama loading |
| Disabled | Opacity 50%, cursor not-allowed. Tidak ada hover/active state |
| Icon only | Square button. Ukuran sama dengan height. Tooltip untuk aksesibilitas |
| Full width | `width: 100%` untuk form mobile |
| Group | Button group untuk aksi terkait (misal: simpan + lanjutkan) |

### 9.2 AppIconButton

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tombol dengan icon saja — untuk aksi toolbar, table action |
| Fungsi | Sama dengan AppButton tetapi tanpa label teks |
| Variasi | Sama dengan AppButton |
| Ukuran | Sm (28x28px), Md (36x36px), Lg (44x44px) |
| Perilaku | Tooltip muncul saat hover/focus untuk menjelaskan aksi. Touch area minimal 44x44px |

### 9.3 AppFloatingButton

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tombol aksi cepat melayang di sudut kanan bawah |
| Fungsi | Menambahkan data baru atau aksi utama pada halaman (mobile-first) |
| Variasi | Single (icon + label), Extended (icon + text) |
| Perilaku | Fixed bottom-right. Z-index tinggi. Shadow lg. Muncul di mobile dan tablet |

---

## 10. Data Display Components

### 10.1 AppCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Container untuk konten informasi |
| Fungsi | Membungkus konten dalam surface dengan border dan shadow |
| Variasi | Default (border + shadow-sm), Elevated (shadow-md), Interactive (hover shadow + border color), Bordered (border only, no shadow) |
| Bagian | Header (opsional, judul + aksi), Body (konten utama), Footer (opsional, aksi) |

### 10.2 AppKpiCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan Key Performance Indicator |
| Fungsi | Menampilkan angka besar, label, dan indikator tren (naik/turun) |
| Bagian | Icon (lingkaran berwarna), Label, Value, Change indicator (persentase + arrow), Periode |
| Variasi | Default, Trending up (hijau), Trending down (merah), Neutral |

### 10.3 AppStatCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan data statistik sederhana |
| Fungsi | Sama dengan KPI Card tetapi lebih kecil (compact) untuk grid |
| Perilaku | Layout horizontal (icon + label + value dalam satu baris) |

### 10.4 ProductCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Kartu produk di POS grid |
| Fungsi | Menampilkan nama, harga, stok, dan tombol tambah |
| Bagian | Thumbnail/foto, Nama produk, Harga, Stok indicator, Tombol tambah |
| Perilaku | Klik card = tambah ke keranjang (quantity 1). Stok habis = disabled. Harga format currency |

### 10.5 AppTable

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan data tabular |
| Fungsi | Menyajikan data dalam baris dan kolom |

#### Variasi

| Variasi | Penggunaan |
|---|---|
| Default | Tabel standar — semua halaman data |
| Striped | Baris ganjil/genap berbeda — untuk tabel panjang |
| Compact | Padding kecil — untuk tabel dengan banyak kolom |
| With actions | Kolom terakhir berisi tombol aksi |
| Sortable | Header bisa diklik untuk sort |
| Selectable | Baris bisa dipilih dengan checkbox |

#### Bagian

| Bagian | Keterangan |
|---|---|
| Header | Background gray-50, uppercase, font semibold |
| Body | Scroll horizontal jika konten melebihi lebar |
| Footer | Rangkuman, total (untuk laporan) |

#### Perilaku

| Aspek | Spesifikasi |
|---|---|
| Empty state | Tampilkan AppEmptyState jika tidak ada data |
| Row hover | Background gray-50 saat hover |
| Loading state | Tampilkan AppSkeleton sebagai placeholder baris |
| Sort | Klik header untuk sort ASC/DESC. Indikator arrow di header |

### 10.6 AppBadge

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Label status atau jumlah |
| Fungsi | Menandai status (PAID, VOID) atau jumlah notifikasi |
| Variasi | Status (PAID, ACTIVE, VOID, PENDING, DRAFT), Count (angka notifikasi), Dot (indikator kecil) |
| Ukuran | Sm (16px font 10px), Md (20px font 12px), Lg (24px font 12px) |
| Warna | Primary (default), Success (PAID, ACTIVE), Warning (PENDING, PARTIAL), Danger (VOID, ERROR), Gray (DRAFT, CLOSED) |

### 10.7 AppAvatar

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Foto profil atau placeholder pengguna |
| Fungsi | Menampilkan gambar profil user. Fallback initial huruf |
| Ukuran | Sm (24px), Md (32px), Lg (40px), Xl (56px) |
| Variasi | Image (dengan foto), Initial (background warna + huruf pertama nama), Icon (icon user default) |

### 10.8 AppChip

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tag informasi kecil yang bisa dihapus |
| Fungsi | Menampilkan filter aktif, opsi terpilih, atau label ringan |
| Variasi | Default, Removable (dengan icon X), Active (terpilih) |
| Perilaku | Tombol hapus di kanan untuk removable. Klik chip untuk toggle (jika interactive) |

### 10.9 AppTooltip

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Informasi tambahan saat hover/focus |
| Fungsi | Menampilkan teks bantuan singkat di atas/bawah/kiri/kanan elemen |
| Perilaku | Muncul setelah 500ms hover. Posisi menyesuaikan ruang layar. Muncul juga saat focus (keyboard) |

---

## 11. Feedback Components

### 11.1 AppAlert

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pesan informasi dalam halaman |
| Fungsi | Menampilkan pesan sukses, error, warning, atau info yang melekat di halaman |
| Variasi | Success (hijau), Error (merah), Warning (kuning), Info (biru) |
| Perilaku | Icon di kiri. Tombol dismiss di kanan (opsional). Tidak auto-dismiss (beda dengan toast) |

### 11.2 AppToast

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Notifikasi sementara |
| Fungsi | Pesan singkat yang muncul dan menghilang otomatis |
| Variasi | Success, Error, Warning, Info |
| Perilaku | Posisi top-right. Auto-dismiss 3 detik (success/info) / 5 detik (warning/error). Animasi slide in/out. Stack multiple toast |

### 11.3 AppSnackbar

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Notifikasi bawah dengan aksi opsional |
| Fungsi | Pesan di bagian bawah layar yang bisa memiliki tombol aksi |
| Perilaku | Posisi bottom-center. Muncul dengan animasi slide up. Bisa manual dismiss. Aksi "Undo" umum untuk snackbar |

### 11.4 AppProgressBar

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan progress suatu proses |
| Fungsi | Indikator linear yang mengisi dari kiri ke kanan |
| Variasi | Determinate (persentase tetap), Indeterminate (animasi berulang — untuk proses tanpa durasi jelas) |
| Perilaku | Animasi smooth transitition. Label persentase di samping (opsional) |

### 11.5 AppSpinner

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Indikator loading melingkar |
| Fungsi | Animasi rotasi tak terbatas untuk menandai proses |
| Ukuran | Sm (16px), Md (24px), Lg (40px) |
| Variasi | Default (border + primary top), Overlay (full page dengan backdrop) |
| Perilaku | Animasi smooth. Warna primary. Diameter proporsional |

### 11.6 AppSkeleton

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Placeholder saat konten sedang dimuat |
| Fungsi | Meniru bentuk konten dengan blok abu-abu animasi pulse |
| Variasi | Text (baris), Card (rectangle), Table (baris tabel), Avatar (lingkaran) |
| Perilaku | Animasi pulse infinite. Warna gray-200. Bentuk meniru konten asli |

### 11.7 AppEmptyState

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan kondisi ketika tidak ada data |
| Fungsi | Ilustrasi + pesan + ajakan bertindak |
| Bagian | Icon (64x64px, gray-400), Judul, Deskripsi, Tombol aksi (opsional) |
| Perilaku | Muncul di area konten (bukan full screen). Ajakan bertindak bergantung konteks (tambah data, filter ulang) |

### 11.8 AppErrorState

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menampilkan kondisi error |
| Fungsi | Pesan error dengan opsi untuk mencoba lagi |
| Variasi | Inline error (dalam card/section), Full page error (halaman error), 404 error |
| Bagian | Icon error, Pesan error, Tombol "Coba Lagi" / "Kembali" |

---

## 12. Overlay Components

### 12.1 AppModal

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Jendela mengambang untuk konten atau formulir |
| Fungsi | Menampilkan konten di atas layer dengan backdrop gelap |

#### Kapan Digunakan

- Form input (tambah/edit data kecil)
- Detail data
- Konfirmasi sederhana
- Pilihan (select, date picker)

#### Ukuran

| Ukuran | Max Width | Penggunaan |
|---|---|---|
| Sm | 400px | Konfirmasi, input kecil |
| Md | 560px | Form standar |
| Lg | 720px | Form panjang, detail |
| Xl | 960px | Tabel dalam modal |

#### Perilaku

| Aspek | Spesifikasi |
|---|---|
| Backdrop | Hitam opacity 50%. Klik backdrop = tutup modal (kecuali form dengan perubahan) |
| Posisi | Center vertikal dan horizontal |
| Scroll | Konten modal scrollable jika melebihi tinggi layar |
| Animasi | Fade in backdrop + scale up content |
| Close | Tombol X di pojok kanan atas. Escape keyboard |
| Prioritas | Z-index 50. Hanya satu modal dalam satu waktu |

### 12.2 AppDrawer

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel samping untuk konten tambahan |
| Fungsi | Slide in dari kanan atau kiri — untuk cart mobile, filter, detail |

#### Kapan Digunakan

- Cart panel di mobile
- Filter panel
- Detail item
- Navigasi mobile

#### Ukuran

| Posisi | Lebar |
|---|---|
| Kiri | 300px (mobile), 320px (desktop) |
| Kanan | 320px (mobile), 400px (desktop) |
| Full | 100% (mobile) |

#### Perilaku

| Aspek | Spesifikasi |
|---|---|
| Backdrop | Sama dengan modal. Klik backdrop = tutup |
| Animasi | Slide dari kiri/kanan. Backdrop fade |
| Scroll | Konten drawer scrollable |
| Close | Tombol X di header. Escape keyboard |

### 12.3 AppDialog

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Dialog informasional tanpa aksi destruktif |
| Fungsi | Menampilkan informasi penting yang perlu diperhatikan pengguna |
| Perilaku | Sama dengan modal. Biasanya tanpa aksi input. Tombol "Mengerti" atau "OK" |

### 12.4 AppConfirmDialog

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Dialog konfirmasi untuk aksi berisiko |
| Fungsi | Meminta konfirmasi sebelum aksi destruktif (hapus, void, cancel) |

| Aspek | Spesifikasi |
|---|---|
| Ukuran | Sm (400px) |
| Icon | AlertTriangle untuk aksi destruktif |
| Judul | "Konfirmasi" + konteks spesifik |
| Tombol | "Batal" (secondary) + aksi (danger/primary) |
| Tombol default focus | "Batal" — untuk mencegah aksi tidak sengaja |

#### Kapan Digunakan

- Hapus data
- Void transaksi
- Cancel PO
- Tutup shift
- Restore backup

### 12.5 AppFullscreenDialog

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Dialog layar penuh untuk konten kompleks |
| Fungsi | Form panjang, payment panel, receipt preview |
| Perilaku | Menutup seluruh layar. Backdrop tidak perlu (full). Tombol close/X. Animasi slide up dari bawah. Khusus mobile/tablet |

---

## 13. POS Components

Komponen khusus untuk halaman POS — inti dari aplikasi.

### 13.1 ProductGrid

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Grid produk yang bisa dipilih di POS |
| Fungsi | Menampilkan produk dalam grid card yang bisa diklik untuk ditambahkan ke cart |
| Perilaku | Grid responsif (3-4 kolom di desktop, 2 kolom di mobile). Klik = tambah 1 item ke cart. Produk nonaktif disembunyikan |
| State | Loading (skeleton), Empty ("Tidak ada produk"), Error |

### 13.2 ProductSearch

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pencarian cepat produk di POS |
| Fungsi | Search box dengan debounce, memfilter ProductGrid |
| Perilaku | Fokus otomatis saat halaman POS dibuka. Pencarian berdasarkan nama, SKU, barcode. Ikon scan barcode di kanan (jika scanner tersedia) |

### 13.3 AppCart

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Keranjang belanja di POS |
| Fungsi | Menampilkan item yang akan dibeli, subtotal, diskon, pajak, dan grand total |
| Bagian | Daftar item, Subtotal, Diskon, Pajak, Grand Total, Tombol aksi (Bayar, Hold, Void) |
| Perilaku | Panel tetap di kanan (desktop) atau drawer (mobile). Scrollable item list |

### 13.4 AppCartItem

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Item dalam keranjang |
| Fungsi | Menampilkan nama produk, harga, quantity, subtotal, dan aksi |
| Bagian | Nama produk, Harga satuan, Quantity selector, Subtotal, Tombol hapus |
| Perilaku | Quantity bisa diubah dengan +/- atau tap langsung. Hapus dengan tombol X |

### 13.5 AppQuantitySelector

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pengatur jumlah barang |
| Fungsi | Tombol minus, angka, tombol plus |
| Perilaku | Min 1, Max sesuai setting. Tombol minus disabled jika quantity = 1. Bisa tap angka untuk input manual |

### 13.6 AppDiscountPanel

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel input diskon |
| Fungsi | Input diskon per item atau per transaksi — persentase atau nominal |
| Bagian | Pilihan tipe diskon (persentase/nominal), Input value, Tombol terapkan |
| Perilaku | Diskon item mengurangi subtotal item. Diskon transaksi mengurangi subtotal sebelum pajak |

### 13.7 AppTaxPanel

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel informasi pajak |
| Fungsi | Menampilkan pajak yang diterapkan pada transaksi |
| Bagian | Nama pajak, tarif, jumlah |
| Perilaku | Read-only (pajak sudah dikonfigurasi di setting). Menampilkan breakdown pajak |

### 13.8 AppPaymentPanel

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel pembayaran |
| Fungsi | Memilih metode, input jumlah, menghitung kembalian |
| Bagian | Grand total, Pilihan metode (CASH, QRIS, TRANSFER, DEBIT, CREDIT), Input jumlah, Kembalian, Tombol bayar |
| Perilaku | Metode CASH: input cash, hitung kembalian otomatis. Metode non-cash: amount = grand total. QRIS: tampilkan QR code |

### 13.9 AppCalculatorPad

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Keypad numerik untuk input cepat |
| Fungsi | Tombol angka 0-9, koma, hapus, clear |
| Perilaku | Muncul saat input amount di payment. Layout seperti kalkulator (3x4 grid). Tombol Enter untuk konfirmasi |

### 13.10 AppReceiptPreview

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pratinjau struk sebelum dicetak |
| Fungsi | Menampilkan tampilan struk di layar |
| Bagian | Header toko, Invoice number, Daftar item, Total, Pembayaran, Footer |
| Perilaku | Tampilan struk thermal (font mono, lebar terbatas). Tombol cetak |

### 13.11 AppCashSummary

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Ringkasan kas shift |
| Fungsi | Menampilkan total uang masuk dan keluar dalam shift |
| Bagian | Opening balance, Total sale (cash), Total expense, Closing balance, Selisih |

### 13.12 AppShiftSummary

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Ringkasan shift |
| Fungsi | Informasi shift yang sedang berjalan atau telah ditutup |
| Bagian | Shift number, Kasir, Waktu buka, Waktu tutup, Total transaksi, Total penjualan |

### 13.13 AppBarcodeScanner

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Scan barcode produk |
| Fungsi | Mengaktifkan kamera untuk scan barcode — atau menerima input dari scanner hardware |
| Perilaku | Mode hardware: fokus otomatis di input, scan barcode = langsung cari produk. Mode kamera: buka kamera, deteksi barcode otomatis |

### 13.14 AppQrScanner

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Scan QR code pembayaran |
| Fungsi | Mengaktifkan kamera untuk scan QRIS |
| Perilaku | Buka kamera, deteksi QR, konfirmasi pembayaran |

### 13.15 AppReceiptItem

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Baris item dalam struk |
| Fungsi | Menampilkan nama, qty, harga, subtotal dalam format struk |
| Perilaku | Font mono. Format rapi dengan alignment |

---

## 14. Cafe Components

Komponen untuk fitur Cafe/Restoran (v2.0).

### 14.1 TableLayout

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Layout denah meja restoran |
| Fungsi | Grid meja yang bisa diatur posisinya |
| Perilaku | Drag and drop posisi meja (admin). Grid responsif |

### 14.2 TableCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Kartu meja |
| Fungsi | Menampilkan nama meja, kapasitas, status |
| Variasi warna | AVAILABLE (hijau), OCCUPIED (merah), RESERVED (kuning), CLEANING (abu-abu) |
| Perilaku | Klik meja = buka POS untuk meja tsb. Status OCCUPIED = tampilkan total tagihan |

### 14.3 KitchenTicket

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tiket pesanan untuk dapur |
| Fungsi | Menampilkan nomor meja, item pesanan, waktu, catatan |
| Perilaku | Auto-print saat pesanan masuk. Update status (PENDING > PREPARING > READY) |

### 14.4 KitchenQueue

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Antrian pesanan dapur |
| Fungsi | Tampilan kolom: Pending | Preparing | Ready |
| Perilaku | Drag and drop antar kolom untuk update status. Timer waktu tunggu |

### 14.5 OrderTimeline

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Timeline status pesanan |
| Fungsi | Visual timeline horizontal: Order > Prepare > Serve > Done |
| Perilaku | Step aktif ditandai. Waktu setiap step ditampilkan |

### 14.6 ReservationCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Kartu reservasi |
| Fungsi | Menampilkan nama, jumlah tamu, waktu, status reservasi |
| Perilaku | Klik untuk detail. Tombol konfirmasi/batal |

---

## 15. Dashboard Components

### 15.1 AppSalesSummary

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Ringkasan penjualan hari ini |
| Fungsi | Total transaksi, total nominal, rata-rata transaksi |
| Layout | Horizontal stat cards atau satu card dengan multiple value |

### 15.2 AppRevenueCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Card pendapatan |
| Fungsi | Menampilkan pendapatan periode tertentu dengan perbandingan |
| Bagian | Label, Nilai (format currency), Change indicator, Periode |

### 15.3 AppProfitCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Card laba kotor |
| Fungsi | Menampilkan laba (revenue - cost) dengan indikator tren |
| Perilaku | Perubahan laba dari periode sebelumnya ditampilkan sebagai persentase dengan arrow |

### 15.4 AppChartCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Container grafik |
| Fungsi | Card dengan judul, grafik di dalamnya, dan filter periode |
| Variasi | Bar chart (penjualan harian), Line chart (tren), Pie chart (metode bayar) |
| Perilaku | Rendering chart menggunakan library chart (Chart.js, ApexCharts). Responsif. Filter periode (7 hari, 30 hari, 90 hari) |

### 15.5 AppLowStockCard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Card peringatan stok menipis |
| Fungsi | Menampilkan produk dengan stok <= minStock |
| Bagian | Jumlah produk, Daftar (nama + stok), Tombol "Lihat Semua" |
| Perilaku | Urut dari stok paling kritis. Warna merah untuk stok = 0 |

### 15.6 AppActivityTimeline

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Timeline aktivitas terbaru |
| Fungsi | Menampilkan aktivitas kronologis (penjualan, adjustment, backup) |
| Perilaku | Urut descending by time. Setiap item: icon, deskripsi, timestamp. Maks 10 item |

### 15.7 AppRecentTransaction

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Transaksi terbaru |
| Fungsi | Menampilkan daftar transaksi terakhir |
| Perilaku | Format tabel ringkas: invoice, customer, total, status, waktu. Klik ke detail |

### 15.8 AppQuickAction

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tombol aksi cepat di dashboard |
| Fungsi | Grid tombol dengan icon dan label untuk akses cepat ke fitur utama |
| Layout | 2x2 atau 3x2 grid. Icon besar. Label di bawah icon |

---

## 16. Setting Components

### 16.1 AppThemeSwitch

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Toggle tema terang/gelap |
| Fungsi | Switch yang mengubah tema aplikasi |
| Perilaku | Icon matahari/bulan. Simpan preferensi di localStorage |

### 16.2 AppBackupPanel

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel untuk melakukan backup |
| Fungsi | Tombol backup, informasi backup terakhir, daftar backup |
| Bagian | Informasi (ukuran DB, jumlah data), Tombol backup, Riwayat backup |
| Perilaku | Backup = export JSON. Progress bar selama proses. Validasi sukses |

### 16.3 AppRestorePanel

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Panel untuk restore data |
| Fungsi | Upload file backup, validasi, konfirmasi, restore |
| Perilaku | Upload file .json. Validasi checksum. Konfirmasi (data akan ditimpa). Auto-backup sebelum restore |

### 16.4 AppDatabaseStatus

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Status kesehatan database |
| Fungsi | Menampilkan versi DB, jumlah record per tabel, ukuran |
| Perilaku | Tabel dengan baris per entitas: nama tabel, jumlah record, status |

### 16.5 AppStorageUsage

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Penggunaan penyimpanan |
| Fungsi | Menampilkan ukuran data yang tersimpan dan sisa kapasitas |
| Perilaku | Progress bar. Informasi dalam MB/GB. Peringatan jika >80% |

---

## 17. Responsiveness

### 17.1 Mobile (<768px)

| Perubahan | Detail |
|---|---|
| Layout | Single column. Sidebar diganti BottomNav. Kartu full width |
| POS | Cart berubah menjadi drawer (slide dari kanan) |
| Form | Full width input. Tombol full width |
| Table | Horizontal scroll. Kolom penting saja yang visible |
| Modal | Mendekati full width (margin 16px). Drawer full width |
| Touch | Semua target minimal 44x44px |

### 17.2 Tablet Portrait (768px - 1024px)

| Perubahan | Detail |
|---|---|
| Layout | 2 column grid. Sidebar collapsible (icon only) |
| POS | 2/3 grid produk + 1/3 cart. Bisa toggle cart |
| Form | 2 column layout untuk form panjang |
| Table | Striped variant. Horizontal scroll jika perlu |

### 17.3 Tablet Landscape (1024px - 1366px)

| Perubahan | Detail |
|---|---|
| Layout | 3 column grid. Sidebar visible dengan label |
| POS | Layout utama (produk grid 2/3 + cart 1/3) |
| Form | Multi-column form. Sampingan untuk input terkait |
| Table | Full table tanpa scroll |

### 17.4 Desktop (>1366px)

| Perubahan | Detail |
|---|---|
| Layout | 4 column grid maksimal. Sidebar full |
| POS | Sama dengan tablet landscape, lebih lega |
| Form | Multi-column dengan layout optimal |
| Table | Full table dengan semua kolom |

---

## 18. Accessibility

### 18.1 Focus Indicator

| Atribut | Spesifikasi |
|---|---|
| Warna | Primary-500 |
| Ketebalan | 2px |
| Offset | 2px |
| Style | Solid outline atau ring |
| Visible | Wajib visible di semua state (keyboard dan mouse) |

### 18.2 Keyboard Navigation

| Fungsionalitas | Spesifikasi |
|---|---|
| Tab order | Logis — sesuai urutan visual |
| Skip link | Tombol "Lewati ke konten" — pertama di halaman |
| Arrow keys | Navigasi dalam komponen (tabs, dropdown, table) |
| Escape | Tutup modal, drawer, dropdown |
| Enter/Space | Aktivasi tombol, pilih opsi |
| Shortcuts | Ctrl+K (search), F8 (POS mode) |

### 18.3 Screen Reader

| Aspek | Spesifikasi |
|---|---|
| Role | Gunakan ARIA role yang tepat (button, dialog, tabpanel) |
| Label | Setiap elemen interaktif memiliki aria-label yang jelas |
| Live region | Gunakan aria-live untuk konten yang berubah secara dinamis |
| Status | aria-live="polite" untuk notifikasi |
| Error | aria-describedby menghubungkan input ke pesan error |

### 18.4 Minimum Touch Area

| Atribut | Spesifikasi |
|---|---|
| Minimum | 44x44px (WCAG 2.5.5) |
| Target | Semua elemen interaktif (button, link, input, checkbox, switch) |
| Gap | Minimal 4px antar touch target |

### 18.5 Kontras Warna

| Atribut | Spesifikasi |
|---|---|
| Normal text | Rasio kontras minimal 4.5:1 |
| Large text | Rasio kontras minimal 3:1 |
| UI components | Rasio kontras minimal 3:1 |
| WCAG level | AA (minimal) |

### 18.6 Label

| Atribut | Spesifikasi |
|---|---|
| Form | Setiap input harus memiliki label eksplisit |
| Icon | Setiap icon button harus memiliki aria-label |
| Group | Fieldset + legend untuk grup checkbox/radio |
| Placeholder | Placeholder bukan pengganti label |

---

## 19. Komposisi Komponen

### 19.1 Halaman POS

```
AppLayout (mode: pos)
  ├── AppTopbar (mode: pos)
  ├── AppPageContainer (mode: full)
  │   ├── ProductSearch
  │   ├── AppTab (kategori produk)
  │   ├── ProductGrid
  │   │   └── ProductCard (multiple)
  │   ├── AppDivider
  │   └── AppCart
  │       ├── AppCartItem (multiple)
  │       │   └── AppQuantitySelector
  │       ├── AppDiscountPanel
  │       ├── AppTaxPanel
  │       ├── AppDivider
  │       └── AppButton (Bayar, Hold, Void)
  ├── AppPaymentPanel (modal)
  │   ├── AppCalculatorPad
  │   ├── AppButton (CASH, QRIS, TRANSFER)
  │   └── AppButton (Bayar, Batal)
  └── AppReceiptPreview (modal)
```

### 19.2 Halaman Dashboard

```
AppLayout
  ├── AppTopbar
  ├── AppSidebar
  │   └── AppSidebarMenu
  ├── AppPageContainer
  │   ├── AppBreadcrumb
  │   ├── AppSection ("Ringkasan Hari Ini")
  │   │   ├── AppKpiCard (Penjualan)
  │   │   ├── AppKpiCard (Transaksi)
  │   │   ├── AppRevenueCard
  │   │   └── AppProfitCard
  │   ├── AppSection ("Aktivitas Terbaru")
  │   │   ├── AppActivityTimeline
  │   │   └── AppRecentTransaction
  │   ├── AppSection ("Stok Menipis")
  │   │   └── AppLowStockCard
  │   └── AppSection ("Aksi Cepat")
  │       └── AppQuickAction (multiple)
```

### 19.3 Halaman Master Data (Produk)

```
AppLayout
  ├── AppTopbar
  ├── AppSidebar
  ├── AppPageContainer
  │   ├── AppBreadcrumb
  │   ├── Page Header
  │   │   ├── Judul Halaman
  │   │   └── AppButton (Tambah, Export, Import)
  │   ├── AppSection (Filter)
  │   │   ├── AppSearchBox
  │   │   └── AppSelect (kategori, status)
  │   └── AppSection (Data)
  │       ├── AppTable
  │       │   ├── AppBadge (status)
  │       │   └── AppIconButton (edit, hapus)
  │       └── AppPagination
  ├── AppModal (Form)
  │   ├── AppInput (SKU, Nama)
  │   ├── AppSelect (Kategori, Unit)
  │   ├── AppCurrencyInput (Harga)
  │   ├── AppNumberInput (Stok min)
  │   └── AppButton (Simpan, Batal)
  └── AppConfirmDialog (Hapus)
```

### 19.4 Halaman Laporan

```
AppLayout
  ├── AppTopbar
  ├── AppSidebar
  ├── AppPageContainer
  │   ├── AppBreadcrumb
  │   ├── AppSection (Filter)
  │   │   ├── AppDatePicker (range)
  │   │   ├── AppSelect (tipe laporan)
  │   │   └── AppButton (Terapkan, Export)
  │   └── AppSection (Data)
  │       ├── AppKpiCard (total)
  │       ├── AppChartCard
  │       └── AppTable
  │           └── AppPagination
```

### 19.5 Halaman Setting

```
AppLayout
  ├── AppTopbar
  ├── AppSidebar
  ├── AppPageContainer
  │   ├── AppBreadcrumb
  │   ├── AppTab (General, User, Backup)
  │   ├── AppSection (General)
  │   │   ├── AppInput (Nama Toko)
  │   │   ├── AppCurrencyInput (Pajak)
  │   │   └── AppToggle (Fitur)
  │   └── AppSection (Backup)
  │       ├── AppBackupPanel
  │       ├── AppRestorePanel
  │       ├── AppDatabaseStatus
  │       └── AppStorageUsage
```

---

## 20. Component Dependency

### 20.1 Dependency Tree

| Komponen | Membutuhkan | Dibutuhkan Oleh |
|---|---|---|
| AppLayout | AppSidebar, AppTopbar, AppMainContent, AppBottomNav | Semua halaman |
| AppSidebar | AppSidebarMenu | AppLayout |
| AppModal | AppButton, AppAlert | AppPaymentPanel, ProductForm |
| AppConfirmDialog | AppButton | Semua halaman (hapus/void) |
| AppCart | AppCartItem, AppQuantitySelector, AppDiscountPanel, AppDivider | POS |
| AppCartItem | AppQuantitySelector, AppIconButton | AppCart |
| AppPaymentPanel | AppButton, AppCalculatorPad, AppModal | POS |
| AppTable | AppBadge, AppIconButton, AppPagination, AppEmptyState, AppSkeleton | Semua halaman data |
| AppDrawer | AppButton | POS (mobile cart), Filter |
| AppToast | AppAlert | Global (auto-invoke) |
| AppKpiCard | AppCard | Dashboard |
| AppChartCard | AppCard | Dashboard |
| ProductGrid | ProductCard, AppSkeleton, AppEmptyState | POS |
| ProductSearch | AppInput | POS |
| AppBackupPanel | AppButton, AppProgressBar, AppTable | Setting |
| AppRestorePanel | AppFileUpload, AppButton, AppConfirmDialog | Setting |
| Dashboard | AppKpiCard, AppChartCard, AppLowStockCard, AppActivityTimeline, AppRecentTransaction, AppQuickAction | Halaman Dashboard |
| POS Page | ProductGrid, ProductSearch, AppCart, AppPaymentPanel, AppReceiptPreview, AppBarcodeScanner | Halaman POS |

### 20.2 Global Components

Komponen yang tersedia di seluruh aplikasi (injected di root level):

- AppToast
- AppConfirmDialog (invocable secara global)
- AppModal (invocable secara global)
- AppDrawer

### 20.3 Service Components

Komponen yang tidak visible di UI tetapi menyediakan data ke komponen lain:

- BarcodeScannerService (memberi data ke ProductSearch)
- ExportService (memberi data ke AppTable)
- NotificationService (memicu AppToast)

---

## 21. Anti Pattern

### 21.1 Yang Harus Dihindari

| Anti Pattern | Alasan | Solusi |
|---|---|---|
| Komponen monolitik | Sulit diuji, sulit di-maintain | Pecah menjadi komponen kecil dengan satu tanggung jawab |
| Komponen spesifik halaman | Tidak reusable, duplikasi | Abstraksi ke komponen umum dengan props |
| Terlalu banyak variasi visual | Membingungkan pengguna, sulit konsisten | Batasi variasi. Jika > 4 variasi, evaluasi ulang |
| Inline style | Tidak konsisten, sulit di-dark-mode | Gunakan token desain (CSS variables, utility classes) |
| Inline event handler | Sulit diuji, tidak accessible | Gunakan event delegation atau handler terpusat |
| Prop drilling berlebihan | Komponen menjadi rapuh | Gunakan context state (untuk data global) atau komposisi |
| Komponen tergantung data API langsung | Tidak bisa di-test secara independen | Komponen menerima data sebagai props (presentational) |
| Mengganti state tanpa konfirmasi | Risiko kehilangan data | Gunakan AppConfirmDialog untuk aksi destruktif |
| Notifikasi tanpa dismiss | Mengganggu pengguna | Setiap toast harus auto-dismiss atau memiliki tombol tutup |
| Loading tanpa feedback | Pengguna tidak tahu aplikasi sedang bekerja | Gunakan AppSkeleton atau AppSpinner dengan jelas |

### 21.2 Contoh Konkret

| ❌ Jangan | ✅ Lakukan |
|---|---|
| Satu komponen `ProductPage` berisi search, table, form, modal | Pisah: `ProductSearch`, `ProductTable`, `ProductForm`, `AppModal` |
| `dangerButton` dengan style merah di-hardcode | Gunakan `AppButton` dengan variant `danger` |
| `<button style="color: blue">` | `<button class="btn-primary">` atau `<AppButton variant="primary">` |
| `<div onclick="doSomething()">` | `<button onClick={doSomething} aria-label="Aksi">` |
| Props 15+ untuk satu komponen | Komposisi: children, slot, atau komponen terpisah |

---

## 22. Future Components

Komponen yang mungkin dibutuhkan di versi mendatang — didefinisikan untuk antisipasi arsitektur.

### 22.1 CustomerDisplay

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tampilan untuk pelanggan (layar kedua) |
| Fungsi | Menampilkan item yang dibeli, total, dan status pembayaran |
| Target | v2.0 — fitur dual screen |

### 22.2 KitchenDisplay

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Tampilan dapur (layar terpisah) |
| Fungsi | Menampilkan pesanan masuk, status persiapan |
| Target | v2.0 — cafe/restaurant |

### 22.3 QRMenu

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Menu digital via QR code |
| Fungsi | Pelanggan scan QR untuk melihat menu dan melakukan self-order |
| Target | v2.0 — cafe/restaurant |

### 22.4 SelfOrderKiosk

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Kiosk pemesanan mandiri |
| Fungsi | Pelanggan memesan sendiri tanpa kasir |
| Target | v3.0 — retail besar, fast food |

### 22.5 MultiOutletDashboard

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Dashboard untuk pemilik multi-outlet |
| Fungsi | Menampilkan ringkasan seluruh outlet |
| Target | v3.0 — membutuhkan cloud sync |

### 22.6 WarehouseSelector

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Pemilih gudang untuk multi-warehouse |
| Fungsi | Dropdown untuk memilih gudang saat transaksi atau stok opname |
| Target | v2.0 — inventory lanjutan |

### 22.7 PrintLayoutEditor

| Atribut | Spesifikasi |
|---|---|
| Tujuan | Editor layout struk |
| Fungsi | Atur tata letak struk (header, footer, ukuran font) |
| Target | v2.0 — kustomisasi |

---

> **Dokumen ini adalah katalog resmi komponen UI untuk POS Offline PWA.**  
> Konsisten dengan `01_PROJECT_BLUEPRINT.md`, `02_DATABASE_SCHEMA.md`, `03_BUSINESS_RULES.md`, dan `04_UI_DESIGN_SYSTEM.md`.

---

*POS Offline PWA — Component Library v1.0.0 — 15 Juli 2026*
