# Services

Berisi business logic layer — validasi, perhitungan, koordinasi antar repository.

## Service Global (Cross-Module)

| Service | Fungsi | Implementasi |
|---|---|---|
| `auth-service.js` | Login, logout, session, lock screen | Phase 2 |
| `audit-service.js` | Catat audit log | Phase 2 |
| `permission-service.js` | RBAC — cek role + module + action | Phase 2 |
| `theme-service.js` | Toggle light/dark mode | Phase 2 |
| `notification-service.js` | Toast, alert, push notification | Phase 2 |
| `setting-service.js` | Baca/tulis setting (key-value) | Phase 2 |
| `backup-service.js` | Orchestrasi backup/restore | Phase 2 |

## Service Modul

Service spesifik modul ada di `src/modules/{modul}/{modul}-service.js`.

## Aturan

- Service boleh memanggil Repository, Utility, dan Service lain.
- Service TIDAK boleh memanipulasi DOM.
- Service TIDAK boleh mengakses database langsung — harus melalui Repository.
- Setiap method service harus menerapkan business rules dari `docs/03_BUSINESS_RULES.md`.
