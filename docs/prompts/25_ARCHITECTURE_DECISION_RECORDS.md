# TASK

Buat file:

docs/25_ARCHITECTURE_DECISION_RECORDS.md

JANGAN mengubah source code.

JANGAN mengubah database.

JANGAN mengubah struktur folder.

JANGAN melakukan refactor.

Tugas hanya membuat dokumentasi Architecture Decision Records (ADR).

========================================================
TUJUAN
========================================================

Dokumen ini mencatat seluruh keputusan arsitektur penting
yang telah dibuat dalam proyek POS Offline PWA.

Dokumen harus menjelaskan:

- Keputusan apa yang dipilih
- Mengapa keputusan tersebut dipilih
- Alternatif yang dipertimbangkan
- Mengapa alternatif ditolak
- Konsekuensi keputusan
- Status keputusan
- Dampak terhadap pengembangan berikutnya

Dokumen ini menjadi referensi resmi bagi:

Developer
OpenCode
Codex
Cursor
ChatGPT
QA
Project Manager

========================================================
ATURAN PENTING
========================================================

JANGAN mengarang keputusan yang belum pernah dibuat.

Sebelum menulis ADR:

1. Periksa struktur project.
2. Periksa dokumentasi yang sudah tersedia.
3. Periksa konfigurasi aplikasi.
4. Periksa database.
5. Periksa router.
6. Periksa authentication.
7. Periksa PWA.
8. Periksa package.json.
9. Periksa Business Rules.
10. Periksa API Contract.
11. Periksa Development Standards.
12. Periksa Database Design.

Jika suatu keputusan belum dapat dipastikan:

tulis:

"Belum ditetapkan"

Jangan membuat asumsi seolah-olah keputusan tersebut sudah final.

========================================================
FORMAT ADR
========================================================

Gunakan format:

ADR-001

Judul:

Status:

Tanggal:

Context:

Decision:

Alternatives:

Consequences:

Related Documents:

Related Modules:

========================================================
DAFTAR ADR MINIMAL
========================================================

Dokumentasikan keputusan berikut jika memang sudah digunakan
oleh project.

--------------------------------------------------------
ADR-001
--------------------------------------------------------

Offline First Architecture

IndexedDB sebagai database lokal utama.

--------------------------------------------------------
ADR-002
--------------------------------------------------------

PWA Architecture

Menggunakan Progressive Web App.

--------------------------------------------------------
ADR-003
--------------------------------------------------------

Database Engine

Dexie + IndexedDB.

--------------------------------------------------------
ADR-004
--------------------------------------------------------

Repository Pattern

Repository sebagai akses database.

--------------------------------------------------------
ADR-005
--------------------------------------------------------

Service Layer

Business logic berada pada Service.

--------------------------------------------------------
ADR-006
--------------------------------------------------------

Universal Item Model

Product/Item dapat menangani:

Retail

Raw Material

Finished Product

Recipe Product

Service

Non Stock

--------------------------------------------------------
ADR-007
--------------------------------------------------------

Stock Movement

Stok dihitung berdasarkan movement.

--------------------------------------------------------
ADR-008
--------------------------------------------------------

Recipe / BOM

Recipe digunakan untuk produk berbasis bahan baku.

--------------------------------------------------------
ADR-009
--------------------------------------------------------

Authentication Architecture

Login + Session + Route Guard.

--------------------------------------------------------
ADR-010
--------------------------------------------------------

RBAC

Role Based Access Control.

--------------------------------------------------------
ADR-011
--------------------------------------------------------

Soft Delete

Data tidak langsung dihapus permanen.

--------------------------------------------------------
ADR-012
--------------------------------------------------------

Modular Architecture

Feature/module based architecture.

--------------------------------------------------------
ADR-013
--------------------------------------------------------

ES Modules

Menggunakan import/export.

--------------------------------------------------------
ADR-014
--------------------------------------------------------

Design System

CSS variables + reusable components.

--------------------------------------------------------
ADR-015
--------------------------------------------------------

PWA Service Worker Strategy

Cache strategy.

Pastikan dokumentasi sesuai implementasi aktual.

--------------------------------------------------------
ADR-016
--------------------------------------------------------

Routing

Hash routing atau router yang benar-benar digunakan.

Jangan mengasumsikan framework.

--------------------------------------------------------
ADR-017
--------------------------------------------------------

Import / Export

Excel / CSV / PDF.

--------------------------------------------------------
ADR-018
--------------------------------------------------------

Validation

UI validation + business validation.

--------------------------------------------------------
ADR-019
--------------------------------------------------------

Audit Logging

Audit trail untuk aktivitas penting.

--------------------------------------------------------
ADR-020
--------------------------------------------------------

Error Handling

Standardized error handling.

--------------------------------------------------------
ADR-021
--------------------------------------------------------

Testing Strategy

Unit

Integration

UI

Manual

Regression

UAT

--------------------------------------------------------
ADR-022
--------------------------------------------------------

Deployment

Strategi deployment saat ini.

--------------------------------------------------------
ADR-023
--------------------------------------------------------

Security

Authentication

Authorization

Session

Data protection.

--------------------------------------------------------
ADR-024
--------------------------------------------------------

AI Assisted Development

Penggunaan OpenCode/Codex/Cursor/AI.

--------------------------------------------------------
ADR-025
--------------------------------------------------------

Scalability

Future:

Cloud Sync

Multi Store

Multi Device

REST API

ERP

--------------------------------------------------------
ADR-026+
--------------------------------------------------------

Jika ditemukan keputusan arsitektur penting lain,
tambahkan ADR baru.

========================================================
STATUS
========================================================

Gunakan:

PROPOSED

ACCEPTED

SUPERSEDED

DEPRECATED

REJECTED

========================================================
ARCHITECTURE PRINCIPLES
========================================================

Tambahkan bagian khusus:

Core Architecture Principles

Jelaskan:

Offline First

Modular

Layered

Maintainable

Testable

Secure

Scalable

AI Friendly

========================================================
DECISION MATRIX
========================================================

Buat tabel:

Decision

Chosen

Alternative

Reason

Status

========================================================
ARCHITECTURE TIMELINE
========================================================

Buat timeline:

Phase 1

Phase 2

Sprint 2.x

Sprint 3.x

dan seterusnya.

========================================================
DEPENDENCY MAP
========================================================

Buat diagram:

UI

?

Page

?

Service

?

Repository

?

Dexie

?

IndexedDB

Tambahkan:

Router

Auth

PWA

Service Worker

========================================================
HASIL

File:

docs/25_ARCHITECTURE_DECISION_RECORDS.md

Minimal 600 baris.

Dokumen harus faktual berdasarkan project saat ini.

Jangan mengubah file lain.