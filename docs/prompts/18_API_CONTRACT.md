# TASK

Buat dokumen:

docs/18_API_CONTRACT.md

JANGAN membuat source code.

Dokumen ini menjadi standar kontrak komunikasi antar modul (Internal API Contract) dan acuan jika di masa depan aplikasi menggunakan REST API, GraphQL, Cloud Sync, atau ERP Integration.

======================================================================
PROJECT
======================================================================

Nama:

POS Offline PWA

Platform:

Offline First

PWA

Dexie

IndexedDB

Repository Pattern

Service Layer

Clean Architecture

Future Ready untuk:

REST API

GraphQL

Cloud Sync

ERP

Marketplace

Mobile App

======================================================================
TUJUAN DOKUMEN
======================================================================

Dokumen ini mendefinisikan:

- Service Contract
- Repository Contract
- DTO
- Request
- Response
- Error Format
- Event Contract
- Validation Contract
- Sync Contract

Tidak menghasilkan source code.

======================================================================
STRUKTUR DOKUMEN
======================================================================

# 1. API Philosophy

Jelaskan prinsip:

Single Source of Truth

Repository Pattern

Service Layer

DTO

Loose Coupling

Dependency Injection

Offline First

Backward Compatibility

Versioning

======================================================================

# 2. Naming Convention

Gunakan standar:

get

find

search

list

create

update

delete

restore

validate

sync

import

export

approve

cancel

complete

close

reopen

======================================================================

# 3. Standard Response

Semua service harus memiliki format response yang konsisten.

Contoh struktur:

success

message

data

errors

meta

pagination

timestamp

executionTime

requestId

======================================================================

# 4. Standard Error

BusinessError

ValidationError

DatabaseError

NetworkError

PermissionError

AuthenticationError

NotFoundError

ConflictError

ImportError

ExportError

======================================================================

Jelaskan:

Kode

Kapan digunakan

Contoh

======================================================================

# 5. DTO (Data Transfer Object)

Jelaskan DTO untuk:

Product

Category

Unit

Supplier

Customer

Purchase

Purchase Detail

Sale

Sale Detail

Inventory

Recipe

Payment

Cash Session

User

Role

Permission

Settings

======================================================================

Untuk setiap DTO jelaskan:

Field

Type

Required

Nullable

Validation

Default Value

Example

======================================================================

# 6. Repository Contract

Standarkan seluruh repository.

Minimal method:

findById()

findAll()

search()

create()

update()

delete()

restore()

exists()

count()

paginate()

bulkInsert()

bulkUpdate()

bulkDelete()

======================================================================

# 7. Service Contract

Standarkan seluruh service.

Minimal:

validate()

beforeCreate()

afterCreate()

beforeUpdate()

afterUpdate()

beforeDelete()

afterDelete()

beforeImport()

afterImport()

beforeExport()

afterExport()

======================================================================

# 8. Pagination Contract

page

pageSize

totalItems

totalPages

sort

order

filters

search

======================================================================

# 9. Search Contract

Keyword

Barcode

SKU

Date Range

Status

Category

Supplier

Customer

Warehouse

======================================================================

# 10. Validation Contract

Field Validation

Business Validation

Duplicate Validation

Stock Validation

Permission Validation

======================================================================

# 11. Event Contract

Jelaskan event internal.

Contoh:

ProductCreated

ProductUpdated

StockChanged

PurchaseCompleted

SaleCompleted

RecipeExecuted

CustomerCreated

PaymentReceived

CashClosed

======================================================================

Untuk setiap event jelaskan:

Producer

Consumer

Payload

Trigger

======================================================================

# 12. Offline Sync Contract

Pending Queue

Device ID

Transaction ID

Conflict Resolution

Retry

Sync Status

Last Sync

======================================================================

# 13. Import Contract

Excel

CSV

JSON

Validation

Rollback

Duplicate

Preview

======================================================================

# 14. Export Contract

Excel

CSV

PDF

JSON

Report

======================================================================

# 15. Security Contract

Authentication

Authorization

Role

Permission

Session

Token (Future)

======================================================================

# 16. Audit Contract

Created By

Updated By

Deleted By

Created At

Updated At

Deleted At

Device ID

======================================================================

# 17. Versioning

API Version

Repository Version

Migration Strategy

Backward Compatibility

======================================================================

# 18. Future REST API Mapping

Jelaskan bagaimana Internal Service akan dipetakan menjadi REST API.

Contoh:

GET /products

POST /products

PUT /products/{id}

DELETE /products/{id}

GET /sales

POST /sales

dst.

======================================================================

# 19. Future GraphQL Mapping

Contoh Query

Mutation

Subscription

======================================================================

# 20. Best Practices

Gunakan prinsip:

SOLID

DRY

KISS

Repository Pattern

Service Layer

Dependency Injection

DTO

Offline First

Clean Architecture

======================================================================

OUTPUT

Format Markdown profesional.

Minimal 700 baris.

Gunakan:

- Heading konsisten
- Tabel
- Diagram ASCII
- Contoh Request/Response (konseptual, bukan source code)
- Contoh DTO
- Contoh Event
- Contoh Error
- Contoh Pagination
- Contoh Search
- Contoh Sync

Jangan menghasilkan source code.

======================================================================

KRITERIA SELESAI

Dokumen ini harus cukup lengkap sehingga seluruh modul berikut dapat dibuat dengan kontrak yang konsisten:

- Master Data
- Inventory
- Purchase
- Sales
- Recipe
- Dashboard
- Report
- Authentication
- Synchronization
- Future REST API
- Future GraphQL