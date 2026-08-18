# TUGAS

Buat file:

docs/24_AI_DEVELOPMENT_GUIDE.md

JANGAN mengubah source code.

Dokumen ini menjadi aturan resmi untuk AI Coding Assistant.

Target:

OpenCode

Cursor

Codex

GitHub Copilot

Claude Code

ChatGPT

Gemini CLI

Qwen Code

dan AI lain.

======================================================
ISI
======================================================

# AI DEVELOPMENT GUIDE

POS Offline PWA

======================================================

Tujuan

Semua AI wajib mengikuti aturan ini.

======================================================

1.

Prinsip Utama

Jangan mengubah arsitektur.

Jangan rename folder.

Jangan rename database.

Jangan rename route.

Jangan rename service.

Jangan menghapus file.

Jangan mengubah Design System.

======================================================

2.

Struktur Project

Jelaskan seluruh folder.

src/

components/

pages/

modules/

services/

database/

styles/

router/

config/

dll.

======================================================

3.

Layer Architecture

UI

?

Service

?

Repository

?

Database

AI tidak boleh melewati layer.

======================================================

4.

Business Rules

AI tidak boleh mengubah Business Rules.

Harus membaca:

17_BUSINESS_RULES.md

======================================================

5.

API Rules

Harus membaca:

18_API_CONTRACT.md

======================================================

6.

Coding Standards

Harus membaca:

19_DEVELOPMENT_STANDARDS.md

======================================================

7.

Testing Rules

Harus membaca:

20_TESTING_GUIDE.md

======================================================

8.

Deployment Rules

Harus membaca:

21_DEPLOYMENT_GUIDE.md

======================================================

9.

Security Rules

Harus membaca:

22_SECURITY_GUIDE.md

======================================================

10.

Database Rules

Harus membaca:

23_DATABASE_DESIGN.md

======================================================

11.

Sebelum Mengubah Kode

AI WAJIB:

Audit

Analisis

Cari dependency

Cari impact

Jelaskan rencana

Baru coding.

======================================================

12.

Sesudah Coding

AI wajib:

Self Review

Broken Import

Broken Export

Dead Code

Lint

Route

Build

Console Error

Testing

======================================================

13.

Yang Dilarang

Menghapus file.

Mengganti struktur.

Mengubah nama tabel.

Mengubah design system.

Mengubah routing tanpa alasan.

Mengubah business rules.

Mengubah API Contract.

======================================================

14.

Checklist AI

Minimal 100 checklist.

======================================================

15.

Prompt Template

Sediakan template prompt untuk:

Tambah Modul

Bug Fix

Refactor

UI

Performance

Security

Testing

Database

Export

Import

Backup

PWA

======================================================

16.

AI Quality Gate

Sebelum dianggap selesai AI wajib menjawab:

? Tidak ada error

? Tidak ada warning

? Tidak ada broken import

? Tidak ada broken export

? Semua route aktif

? Semua permission benar

? Semua test lolos

? Console bersih

? Offline berjalan

? Database aman

======================================================

HASIL

Satu file:

docs/24_AI_DEVELOPMENT_GUIDE.md

Minimal ±800 baris.

Dokumen harus menjadi pedoman utama seluruh AI yang mengembangkan proyek ini.