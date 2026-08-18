# Database Layer

Berisi semua yang terkait dengan IndexedDB dan Dexie.js.

## File

| File | Tanggung Jawab | Implementasi |
|---|---|---|
| `db.js` | Inisialisasi Dexie, koneksi, versioning | Phase 2 |
| `schema.js` | Definisi tabel, index, unique constraints | Phase 2 |
| `migrations.js` | Migration handler per versi Dexie | Phase 2 |
| `seeds.js` | Data awal (roles, admin, settings) | Phase 2 |
| `backup.js` | Export seluruh database ke JSON | Phase 2 |
| `restore.js` | Import data dari JSON ke database | Phase 2 |

## Aturan

- Satu database: `PosOfflineDB`
- Semua akses database melalui Repository layer — tidak boleh langsung dari UI.
- Lihat `docs/02_DATABASE_SCHEMA.md` untuk detail 34 entitas.
