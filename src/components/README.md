# Komponen UI

Berisi komponen UI reusable yang digunakan di seluruh aplikasi.

## Kategori

| Kategori | Isi | Implementasi |
|---|---|---|
| `button/` | AppButton, AppIconButton, AppFloatingButton | Phase 2 |
| `card/` | AppCard, AppKpiCard, AppStatCard, ProductCard | Phase 2 |
| `table/` | AppTable, AppPagination | Phase 2 |
| `modal/` | AppModal, AppConfirmDialog, AppDrawer | Phase 2 |
| `form/` | AppInput, AppSelect, AppToggle, dll | Phase 2 |
| `feedback/` | AppToast, AppAlert, AppSpinner, AppSkeleton | Phase 2 |
| `navigation/` | AppSidebar, AppBreadcrumb, AppTab | Phase 2 |
| `data-display/` | AppBadge, AppAvatar, AppChip, AppTooltip | Phase 2 |
| `pos/` | ProductGrid, AppCart, AppPaymentPanel, dll | Phase 5 |
| `dashboard/` | AppSalesSummary, AppLowStockCard, dll | Phase 4 |
| `layout/` | AppLayout, AppSidebar, AppTopbar, dll | Phase 2 |
| `cafe/` | TableLayout, KitchenTicket, dll (v2.0) | Phase 11 |
| `setting/` | AppThemeSwitch, AppBackupPanel, dll | Phase 2 |

## Aturan

- Setiap komponen harus reusable di >1 tempat.
- Komponen boleh mengimpor utility, tidak boleh mengimpor service/repository/database.
- Setiap komponen memiliki file .js + README.md (CSS opsional, prefer Bootstrap utilities).
- Lihat `docs/05_COMPONENT_LIBRARY.md` untuk spesifikasi lengkap.
