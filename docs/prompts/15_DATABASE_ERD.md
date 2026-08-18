# TASK

Buat dokumen:

docs/15_DATABASE_ERD.md

Jangan membuat source code.

======================================================

Buat ERD lengkap untuk project POS Offline PWA.

======================================================

Database minimal memiliki tabel berikut:

users

roles

permissions

items

categories

units

suppliers

customers

warehouses

stock_movements

stock_balances

recipes

recipe_details

purchases

purchase_details

sales

sale_details

payments

cash_sessions

settings

audit_logs

======================================================

Untuk setiap tabel jelaskan:

Nama tabel

Tujuan

Primary Key

Foreign Key

Index

Constraint

Soft Delete

Audit Field

======================================================

Buat relasi antar tabel.

Gunakan diagram ASCII.

Contoh:

Customer

|

Sales

|

Sales Detail

|

Item

|

Stock Movement

======================================================

Tambahkan:

Cardinality

One to One

One to Many

Many to One

======================================================

Tambahkan normalisasi.

1NF

2NF

3NF

======================================================

Tambahkan alasan desain.

Mengapa memakai Stock Movement.

Mengapa memakai Recipe Detail.

Mengapa memakai Universal Item.

======================================================

Output markdown profesional.

Minimal 500 baris.

Jangan membuat source code.

Dokumen ini akan menjadi blueprint database project.