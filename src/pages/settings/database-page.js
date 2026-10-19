import db from '../../database/db.js';
import { TABLES } from '../../database/schema.js';
import { AppButton } from '../../components/button/app-button.js';
import { AppBadge } from '../../components/data-display/app-badge.js';
import { AppConfirmDialog } from '../../components/modal/app-modal.js';
import { showToast } from '../../components/feedback/app-alert.js';

export async function init(container) {
  const tableStats = [];
  let totalRecords = 0;

  for (const table of TABLES) {
    const count = await db.table(table.name).count();
    tableStats.push({ name: table.name, count });
    totalRecords += count;
  }

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Database</h2>
        <p class="text-muted text-sm mb-0">Status dan pemeliharaan database lokal</p>
      </div>
    </div>
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-3" style="background-color:var(--color-bg-card)">
          <p class="text-muted text-sm mb-0">Total Tabel</p>
          <h3 class="fw-bold mb-0" style="color:var(--color-text-heading)">${TABLES.length}</h3>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-3" style="background-color:var(--color-bg-card)">
          <p class="text-muted text-sm mb-0">Total Catatan</p>
          <h3 class="fw-bold mb-0" style="color:var(--color-text-heading)">${totalRecords}</h3>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-3" style="background-color:var(--color-bg-card)">
          <p class="text-muted text-sm mb-0">Ukuran Database</p>
          <h3 class="fw-bold mb-0" style="color:var(--color-text-heading)">—</h3>
          <p class="text-muted text-xs mb-0">(dihitung saat akses)</p>
        </div>
      </div>
    </div>
    <div class="card border-0 shadow-sm mb-4" style="background-color:var(--color-bg-card)">
      <div class="card-header bg-transparent border-bottom px-3 py-2">
        <h6 class="fw-semibold mb-0" style="color:var(--color-text-heading)">Statistik Tabel</h6>
      </div>
      <div class="table-responsive">
        <table class="table align-middle mb-0" style="border-color:var(--color-border)">
          <thead class="table-light">
            <tr>
              <th class="text-sm fw-semibold">Nama Tabel</th>
              <th class="text-end text-sm fw-semibold">Jumlah Catatan</th>
              <th class="text-center text-sm fw-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableStats.map((ts) => `
              <tr>
                <td class="text-sm">${ts.name}</td>
                <td class="text-end text-sm">${ts.count.toLocaleString('id-ID')}</td>
                <td class="text-center">${AppBadge({ text: ts.count > 0 ? 'Aktif' : 'Kosong', variant: ts.count > 0 ? 'ACTIVE' : 'DRAFT' }).outerHTML}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex gap-2 flex-wrap" id="db-actions"></div>
  `;

  const compactBtn = AppButton({ label: 'Kompresi Database', icon: 'bi-compress', variant: 'outline' });
  const clearBtn = AppButton({ label: 'Hapus Semua Data', icon: 'bi-exclamation-triangle', variant: 'danger' });
  document.getElementById('db-actions').appendChild(compactBtn, clearBtn);

  compactBtn.addEventListener('click', async () => {
    compactBtn.setLoading(true);
    try {
      await db.delete();
      showToast('Database berhasil dikompresi. Refresh halaman...', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error');
      compactBtn.setLoading(false);
    }
  });

  clearBtn.addEventListener('click', () => {
    AppConfirmDialog({
      title: 'Hapus Semua Data',
      message: 'Semua data akan dihapus permanen. Tindakan ini tidak bisa dibatalkan!',
      confirmText: 'Ya, Hapus Semua',
      variant: 'danger',
      onConfirm: async () => {
        clearBtn.setLoading(true);
        try {
          for (const table of TABLES) {
            await db.table(table.name).clear();
          }
          showToast('Semua data berhasil dihapus', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
          showToast('Gagal: ' + err.message, 'error');
          clearBtn.setLoading(false);
        }
      },
    });
  });
}
