# Changelog

## v0.1.0 — 2026-07-29

### Added
- Project scaffold (Phase 1 — Project Setup)
- Folder structure sesuai 10_PROJECT_STRUCTURE.md
- Auth module (session, login, auth-service, LoginForm, LoginPage)
- App shell (AppLayout, Sidebar, Topbar, router)
- Bootstrap 5.3.3 + Dexie 4.0.10 + Chart.js 4.4.7 + jsPDF 2.5.2 + XLSX 0.18.5 CDN integration
- PWA manifest (10 icon sizes) and service worker with full cache strategy
- Database schema, migrations, seeds (settings only)
- Dashboard page with KPI cards, chart placeholder, activity list, quick-actions
- Chart.js fallback (static summary when Chart undefined)
- XLSX / jsPDF fallback (graceful degradation in export/import helpers)
- page-loader overlay CSS, responsive breakpoints, dark mode persistence

### Fixed
- XLSX CDN version: 0.20.1 (404) → 0.18.5 (200)
- Favicon: missing favicon.ico → src/pwa/icons/icon-192.svg
- PNG icons: regenerated 192×192, 512×512 (were 0 bytes)
- Generated 6 additional PNG sizes (72, 96, 128, 144, 152, 384)
- seeds.js: removed role/user seeding (conflict with auth.js)
- bootstrap.js: added initTheme() call for dark mode persistence
- AppLayout.js: made async, awaits initLoginPage for proper sequencing
- service-worker.js: skipWaiting inside event.waitUntil(); APP_ASSETS complete
- pwa-config.js: appAssets synced with all module JS/CSS files
- All ES module import paths verified: 130+ files, 0 broken
- package.json: full project config written
