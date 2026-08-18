# Repositories

Berisi data access layer — abstraksi akses ke IndexedDB via Dexie.js.

## Repository Global

| Repository | Fungsi | Implementasi |
|---|---|---|
| `base-repository.js` | Abstract CRUD (getAll, getById, create, update, delete) | Phase 2 |
| `setting-repository.js` | Akses tabel settings (key-value) | Phase 2 |

## Repository Modul

Repository spesifik modul ada di `src/modules/{modul}/{modul}-repository.js`.

## Aturan

- **Semua akses database melalui Repository** — tidak ada pengecualian.
- Repository TIDAK boleh berisi business logic.
- Repository menerima dan mengembalikan plain object.
- Repository boleh melakukan mapping data (format date, rename field).
- Repository hanya boleh dipanggil oleh Service layer.
