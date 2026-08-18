TASK:
Buat dokumen baru:

docs/19_DEVELOPMENT_STANDARDS.md

Jangan mengubah source code.

Hanya membuat dokumentasi standar pengembangan proyek POS Offline PWA.

Dokumen harus lengkap, profesional, dan menjadi pedoman seluruh developer maupun AI yang mengerjakan proyek ini.

=========================================================
ISI DOKUMEN
=========================================================

# DEVELOPMENT STANDARDS

Versi : 1.0

Tujuan:
Menjaga seluruh source code tetap konsisten,
mudah dipelihara,
mudah dikembangkan,
dan tidak menghasilkan technical debt.

---------------------------------------------------------
1. General Principles
---------------------------------------------------------

Seluruh kode harus memenuhi prinsip:

KISS
Keep It Simple

DRY
Don't Repeat Yourself

SOLID

Single Responsibility

Open Closed

Liskov

Interface Segregation

Dependency Inversion

YAGNI

Clean Architecture

Feature First

Low Coupling

High Cohesion

---------------------------------------------------------
2. Folder Structure Rules
---------------------------------------------------------

Jelaskan aturan folder.

src/

app/

auth/

components/

config/

database/

layouts/

modules/

pages/

router/

services/

styles/

utils/

pwa/

Setiap folder memiliki tanggung jawab yang jelas.

Tidak boleh mencampur Business Logic dengan UI.

---------------------------------------------------------
3. Module Standard
---------------------------------------------------------

Setiap module wajib memiliki struktur:

module-name/

index.js

repository.js

service.js

validator.js

utils.js

(optional)

components/

pages/

repository

hanya akses database

service

hanya business rules

page

hanya UI

validator

validasi

---------------------------------------------------------
4. Naming Convention
---------------------------------------------------------

File

kebab-case

contoh

product-service.js

customer-page.js

inventory-validator.js

Function

camelCase

createProduct()

getCustomer()

calculateProfit()

Constant

UPPER_CASE

DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE

Variable

camelCase

Class

PascalCase

ProductRepository

InventoryService

---------------------------------------------------------
5. UI Standards
---------------------------------------------------------

Gunakan Design System.

Tidak boleh hardcode warna.

Semua warna berasal dari variables.css

Gunakan Bootstrap Utility terlebih dahulu.

Jika belum ada baru membuat CSS.

Tidak boleh inline style kecuali benar-benar diperlukan.

Semua icon memakai Bootstrap Icons.

Semua spacing memakai token.

xs

sm

md

lg

xl

---------------------------------------------------------
6. JavaScript Standards
---------------------------------------------------------

ES Modules

Tidak memakai require()

Selalu gunakan

import

export

Gunakan async await.

Dilarang callback hell.

Tidak boleh function >150 baris.

Jika terlalu panjang wajib dipecah.

---------------------------------------------------------
7. Error Handling
---------------------------------------------------------

Semua async wajib

try catch

Semua error masuk logger.

Tidak boleh

console.log

di production.

Gunakan

logger.info()

logger.warn()

logger.error()

---------------------------------------------------------
8. Validation Standard
---------------------------------------------------------

Semua input wajib divalidasi.

UI Validation

Business Validation

Database Validation

Tidak boleh hanya validasi di UI.

---------------------------------------------------------
9. Repository Standard
---------------------------------------------------------

Repository

TIDAK BOLEH

mengandung business logic.

Repository hanya:

CRUD

search

pagination

soft delete

query

---------------------------------------------------------
10. Service Standard
---------------------------------------------------------

Service bertugas:

Business Rules

Calculation

Workflow

Permission

Import

Export

Validation

---------------------------------------------------------
11. Security Standard
---------------------------------------------------------

Tidak boleh password plaintext.

Tidak boleh token hardcode.

Tidak boleh secret dalam source.

Session harus memiliki expiry.

Permission wajib dicek.

---------------------------------------------------------
12. Routing Standard
---------------------------------------------------------

Semua halaman:

ditambahkan ke router

ditambahkan ke sidebar

ditambahkan permission

ditambahkan breadcrumb

Tidak boleh route mati.

---------------------------------------------------------
13. Database Standard
---------------------------------------------------------

Semua perubahan schema:

migration

version

rollback

seed

harus terdokumentasi.

---------------------------------------------------------
14. Performance Standard
---------------------------------------------------------

Lazy Load Page

Debounce Search

Pagination

Virtual Rendering

Memoization jika perlu

---------------------------------------------------------
15. Offline Standard
---------------------------------------------------------

Semua fitur harus tetap berjalan offline.

Tidak boleh bergantung internet.

Service Worker wajib kompatibel.

IndexedDB menjadi sumber utama.

---------------------------------------------------------
16. Documentation Standard
---------------------------------------------------------

Setiap module wajib memiliki:

README

Business Rules

API Contract

Flow Diagram

---------------------------------------------------------
17. Testing Standard
---------------------------------------------------------

Minimal test:

Repository

Service

Validator

Route

Permission

Import Export

---------------------------------------------------------
18. Code Review Checklist
---------------------------------------------------------

Buat checklist sekitar 40 poin.

Contoh:

[]

Tidak ada duplicate code

[]

Import benar

[]

Tidak ada TODO

[]

Tidak ada dead code

[]

Tidak ada console.log

[]

Tidak ada inline style

[]

Business Rules dipatuhi

[]

Permission dicek

[]

Validation lengkap

[]

Route terdaftar

[]

Soft delete berjalan

dst.

---------------------------------------------------------
19. AI Development Rules
---------------------------------------------------------

Aturan khusus untuk AI.

AI tidak boleh:

mengubah struktur folder

mengubah schema database

menghapus file

mengubah Business Rules

mengubah API

tanpa persetujuan.

AI wajib:

audit dahulu

jelaskan perubahan

buat migration jika perlu

buat changelog

update dokumentasi

---------------------------------------------------------
20. Future Ready
---------------------------------------------------------

Standar agar aplikasi siap:

Multi Store

Multi Branch

Cloud Sync

Mobile

Desktop

Electron

Android

iOS

PWA

Apps Script Connector

REST API

=========================================================

OUTPUT

Buat markdown profesional.

Minimal 500 baris.

Menggunakan heading yang rapi.

Menggunakan tabel.

Menggunakan contoh kode.

Menggunakan checklist.

Tidak mengubah file selain

docs/19_DEVELOPMENT_STANDARDS.md