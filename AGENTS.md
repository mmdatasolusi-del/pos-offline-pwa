# AGENTS.md

POS Offline PWA — 100% client-side point-of-sale (vanilla ES modules + Bootstrap 5 + Dexie/IndexedDB). No backend, no bundler, no build step.

## Commands

- `npm install` — install deps. Only `http-server` is a dev dependency; runtime libs load from CDN.
- `npm start` (alias `npm run dev`) — `http-server . -c-1` (serves repo root on http://localhost:8080, HTTP cache disabled).
- There is **no** test runner, linter, formatter, typecheck, or build. Everything under `tests/**` is a placeholder (`// TODO: ...`), not an executable suite. Verify changes in a real browser instead.
- The app must be served over HTTP: `index.html` uses ES modules and a service worker, so opening it via `file://` fails. The README's "open index.html directly" advice is wrong.

## First run / login

- A fresh browser has an empty DB; the app routes to `#/first-run` and requires creating an Owner account (`src/pages/FirstRunPage.js`). There are **no** default credentials.
- `src/database/seeds.js` seeds demo categories, units, suppliers, products, purchases, sales, settings only — no users/roles.
- Roles (Owner/Admin/Kasir) are created by `ensureSystemRoles()` in `src/auth/auth.js`.

## PWA cache — the #1 gotcha

- The cached asset list and cache version are **duplicated** in `src/pwa/pwa-config.js` (`cacheVersion`, `appAssets`) and `service-worker.js` (`CACHE_VERSION`, `APP_ASSETS`). Adding/renaming any served JS/CSS/asset file requires editing **both** lists and bumping the version in **both** files, or clients keep serving stale code.
- The SW registers at `/service-worker.js` (scope `/`) and `src/app/app.js` auto-reloads the page when a new SW activates. During dev, if edits don't show, unregister the SW / clear site data.

## Architecture

- Layers: Page → Service → Repository → Dexie. UI must not touch IndexedDB directly; services must not touch the DOM.
- Boot chain: `index.html` → `src/app/app.js` → `src/app/bootstrap.js` → `src/layouts/AppLayout.js` → `src/router/router.js`.
- Pages export `init(container)`; the router dynamic-imports a page and calls `init`.

## Live vs. dead code (common trap)

- The live router is `src/router/router.js`, with Indonesian route keys (`dashboard`, `penjualan`, `produk`, `pelanggan`, `supplier`, `pembelian`, `laporan`, `pengaturan`, `login`, `lock-screen`). Sidebar links in `src/components/Sidebar.js` must match these keys.
- `src/router/routes.js` and `src/router/navigation-manager.js` are a parallel/legacy registry that the running app does **not** import. Don't wire new routes there.
- Active core screens are PascalCase: `src/pages/LoginPage.js`, `src/pages/Dashboard.js`, `src/pages/FirstRunPage.js`, `src/layouts/AppLayout.js`. The kebab-case duplicates (`src/layouts/app-layout.js`, `src/pages/dashboard/dashboard-page.js`, `src/pages/login/login-page.js`) are unused by the live flow.

## Data

- Single Dexie DB `PosOfflineDB`; schema version lives in `src/config/db.config.js`. A schema change means bumping that version and adding a matching `.version(n)` upgrade in `src/database/schema.js` / `src/database/migrations.js`.
- IDs are UUID strings (seed records use fixed IDs like `role-owner`). Soft delete via `deletedAt`. Money is integer Rupiah.
- New entity/field → also update `docs/02_DATABASE_SCHEMA.md`.

## Conventions

- ES modules, `const`/`let` only (no `var`), `async/await`. Filenames are kebab-case **except** the active core pages/components, which are PascalCase — match the file you're editing.
- No inline styles and no inline event handlers: use Bootstrap 5 utilities / CSS classes and `addEventListener`.
- Runtime libs are pinned in `index.html` and both cache files (Bootstrap 5.3.3, Dexie 4.0.10, Chart.js 4.4.7, xlsx 0.18.5, jsPDF 2.5.2). Some pins are intentional (see `CHANGELOG.md`); keep the three sources in sync.
- Log format: `[Module/Service] message` via `console.info|warn|error`.

## Docs

`docs/` is the project standard (01–27). `docs/11_AI_CONTEXT.md` is the intended AI entry point; `docs/24_AI_DEVELOPMENT_GUIDE.md` and `docs/09_CODING_STANDARD.md` hold the working rules. Docs 01–13 describe a broader/aspirational structure (e.g. all-kebab files, 34 entities, `routes.js`) that can diverge from shipped code — trust the code, and do not rename folders/files/routes or delete files without approval (doc 24 forbids it).
