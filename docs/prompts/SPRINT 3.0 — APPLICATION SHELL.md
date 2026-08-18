# SPRINT 3.0 — APPLICATION SHELL

Project:
POS Offline PWA

Jangan mengubah struktur database, service worker, ataupun IndexedDB yang sudah ada.

Yang harus dibuat adalah Application Shell modern.

## Tujuan

Menghilangkan halaman putih dan menampilkan UI pertama aplikasi.

## Struktur

src/
    layouts/
        AppLayout.js

    components/
        Sidebar.js
        Topbar.js
        KPI.js
        Card.js

    pages/
        Dashboard.js

    router/
        router.js

    styles/
        sidebar.css
        topbar.css
        dashboard.css

## Sidebar

Brand:

POS OFFLINE

Menu:

Dashboard

Penjualan

Produk

Pelanggan

Supplier

Pembelian

Laporan

Pengaturan

Sidebar harus dapat collapse.

Responsive.

Tablet friendly.

Bootstrap Icons.

## Topbar

Search Box

Dark Mode Toggle

Tanggal Hari Ini

User Profile

## Dashboard

Buat KPI Cards:

Pendapatan Hari Ini

Total Transaksi

Jumlah Produk

Stok Hampir Habis

Tambahkan:

Chart Area

Aktivitas Terbaru

Quick Actions

## Router

router.js

Router sederhana menggunakan hash routing.

Contoh:

#/dashboard

#/produk

#/penjualan

dst.

## AppLayout

Layout harus terdiri dari:

Sidebar

Topbar

Main Content

Footer kecil

## bootstrap.js

Setelah DatabaseManager.initialize()

render AppLayout()

kemudian tampilkan Dashboard sebagai halaman pertama.

## Styling

Modern

Clean

Rounded

Shadow

Bootstrap 5

Responsive

Dark Mode

## Jangan

Jangan mengubah:

Database

Service Worker

Manifest

PWA

Logger

IndexedDB

## Output

Setelah selesai aplikasi ketika dibuka harus langsung menampilkan Dashboard lengkap, bukan halaman putih.

Semua kode harus modular ES Modules.