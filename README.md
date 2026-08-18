# POS Offline PWA

**Kasir Cerdas, Usaha Maju.**

Aplikasi Point of Sale 100% offline untuk UMKM. Berjalan di browser, bisa di-install seperti aplikasi native. Tanpa server, tanpa biaya langganan, tanpa internet.

## Teknologi

| Teknologi | Fungsi |
|---|---|
| HTML5 + CSS3 | Struktur dan styling |
| Bootstrap 5 | Grid, komponen UI, utilities responsif |
| Vanilla JavaScript (ES2023) | Semua logika aplikasi |
| IndexedDB + Dexie.js | Database lokal offline |
| Chart.js | Grafik dan dashboard |
| SheetJS (xlsx) | Export/import Excel |
| jsPDF | Generate PDF (struk, laporan) |
| PWA | Installable, offline-capable |

## Struktur Folder

```
pos-offline-pwa/
├── docs/           — Dokumentasi proyek (01–13)
├── public/         — File publik statis
├── src/            — Kode sumber aplikasi
│   ├── app/        — Entry point dan bootstrap
│   ├── components/ — Komponen UI reusable (13 kategori)
│   ├── layouts/    — Layout template (app, auth, pos)
│   ├── pages/      — Halaman aplikasi (13 halaman)
│   ├── modules/    — Modul bisnis (12 modul)
│   ├── services/   — Business logic layer (7 service global)
│   ├── repositories/ — Data access layer (2 repository global)
│   ├── database/   — Dexie schema, migration, backup
│   ├── router/     — Hash-based SPA router
│   ├── config/     — Konfigurasi aplikasi
│   ├── constants/  — Konstanta global (status, roles, permissions)
│   ├── utils/      — Pure function utilities (10 file)
│   ├── helpers/    — Helper dengan dependensi (6 file)
│   ├── styles/     — CSS custom (6 file + pages + modules)
│   ├── workers/    — Web workers (backup, sync)
│   └── pwa/        — PWA support (icons, offline.html)
├── tests/          — Unit, integration, manual tests
├── scripts/        — Development utility scripts
└── backups/        — Backup data (gitignored)
```

Lihat `docs/10_PROJECT_STRUCTURE.md` untuk detail lengkap.

## Cara Menjalankan

Aplikasi ini 100% client-side — tidak perlu build step atau server.

1. Clone repositori
2. Buka `index.html` di browser (Chrome 90+ / Edge 90+)
3. Aplikasi siap digunakan

Atau gunakan HTTP server lokal untuk pengembangan:
```bash
npx serve .
```

## Roadmap Singkat

| Versi | Fase | Fitur |
|---|---|---|
| v0.1 | Phase 2 | Core System (Auth, User, Role, Backup) |
| v0.2 | Phase 3 | Master Data (Product, Category, Customer, Supplier) |
| v0.3 | Phase 4 | Dashboard |
| v0.4 | Phase 5 | Sales (POS) |
| v0.5 | Phase 6 | Inventory |
| v0.6 | Phase 7 | Purchase |
| v0.7 | Phase 8 | Finance |
| v0.8 | Phase 9 | Reporting |
| v1.0 | — | Rilis Stabil MVP |
| v2.0 | Phase 11 | Cafe Module |
| v2.5 | Phase 12 | Loyalty Program |
| v3.0 | Phase 13 | Cloud & AI |

Lihat `docs/07_ROADMAP.md` untuk detail lengkap.

## Dokumentasi

Semua dokumentasi proyek ada di folder `docs/`:

| Dokumen | Isi |
|---|---|
| 01_PROJECT_BLUEPRINT.md | Visi, arsitektur, stack, target |
| 02_DATABASE_SCHEMA.md | 34 entitas, relasi, field |
| 03_BUSINESS_RULES.md | 168 aturan bisnis |
| 04_UI_DESIGN_SYSTEM.md | Token desain, template halaman |
| 05_COMPONENT_LIBRARY.md | 70+ komponen UI |
| 06_FEATURE_LIST.md | 88 fitur, prioritas, dependensi |
| 07_ROADMAP.md | 13 fase pengembangan |
| 08_AI_PROMPT_GUIDE.md | Panduan AI Coding Assistant |
| 09_CODING_STANDARD.md | Standar penulisan kode |
| 10_PROJECT_STRUCTURE.md | Standar struktur proyek |
| 11_AI_CONTEXT.md | Ringkasan proyek untuk AI |
| 12_DEVELOPMENT_WORKFLOW.md | SOP pengembangan |
| 13_TESTING_GUIDE.md | Standar Quality Assurance |

## Status Proyek

Saat ini: **Phase 1 — Project Scaffold** (struktur folder, file placeholder)
