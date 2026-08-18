# TUGAS

Buat file:

docs/23_DATABASE_DESIGN.md

JANGAN mengubah source code.

======================================================
ISI
======================================================

# DATABASE DESIGN

POS Offline PWA

Dokumentasikan seluruh desain database IndexedDB.

======================================================

1.

Konsep Database

Mengapa memakai IndexedDB

Mengapa memakai Dexie

Offline First

Migration Strategy

Versioning

======================================================

2.

Daftar seluruh tabel

Users

Products

Categories

Units

Customers

Suppliers

Sales

SalesItems

Purchases

PurchaseItems

Expenses

StockMovements

AuditLogs

Settings

Sessions

Backups

Notifications

DraftTransactions

dst.

======================================================

3.

Untuk SETIAP tabel tuliskan:

Nama tabel

Tujuan

Primary Key

Indexes

Unique Index

Foreign Key (logical)

Contoh data

Relasi

======================================================

4.

Database Schema

Lengkap.

======================================================

5.

Relasi Antar Tabel

Diagram relasi.

Gunakan Mermaid ER Diagram.

Contoh:

erDiagram

CUSTOMERS ||--o{ SALES

SALES ||--|{ SALES_ITEMS

PRODUCTS ||--o{ SALES_ITEMS

dst.

======================================================

6.

Migration

Version 1

Version 2

Version 3

Bagaimana migrasi dilakukan.

Rollback.

======================================================

7.

Repository Pattern

Repository

Service

Validation

UI

Flow.

======================================================

8.

Soft Delete

Status

DeletedAt

Restore

Permanent Delete

======================================================

9.

Index Optimization

Cari produk

Cari transaksi

Laporan

Pagination

Sorting

Search

======================================================

10.

Backup

Export

Import

Recovery

======================================================

11.

Performance

Target:

20.000 Produk

100.000 Transaksi

500 transaksi/hari

Offline.

======================================================

12.

Best Practices

Minimal 40 poin.

======================================================

HASIL

docs/23_DATABASE_DESIGN.md

Minimal ±600 baris.