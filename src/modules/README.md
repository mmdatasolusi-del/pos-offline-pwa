# Modul Bisnis

Setiap folder di sini adalah modul bisnis independen yang mengikuti struktur standar:

```
modules/{nama-modul}/
  index.js                  — Re-export public API
  {nama-modul}-service.js   — Business logic
  {nama-modul}-repository.js— Akses database
  {nama-modul}-validator.js — Validasi data (opsional)
  {nama-modul}-events.js    — Custom events (opsional)
  {nama-modul}-utils.js     — Utility khusus modul (opsional)
  README.md                 — Dokumentasi modul
```

## Daftar Modul

| Modul | Status | Target |
|---|---|---|
| `product/` | Scaffold | Phase 3 |
| `sales/` | Scaffold | Phase 5 |
| `purchase/` | Scaffold | Phase 7 |
| `inventory/` | Scaffold | Phase 6 |
| `customer/` | Scaffold | Phase 3 |
| `supplier/` | Scaffold | Phase 3 |
| `finance/` | Scaffold | Phase 8 |
| `report/` | Scaffold | Phase 9 |
| `shift/` | Scaffold | Phase 8 |
| `backup/` | Scaffold | Phase 2 |
| `cafe/` | Scaffold | Phase 11 (v2.0) |
| `loyalty/` | Scaffold | Phase 12 (v2.5) |

## Aturan

- Modul TIDAK boleh bergantung langsung pada modul lain — komunikasi via service.
- Setiap modul minimal memiliki index.js + service + repository.
- Lihat `docs/10_PROJECT_STRUCTURE.md` section 6 untuk detail struktur modul.
