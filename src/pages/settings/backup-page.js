import { exportBackup, downloadBackup } from '../../database/backup.js';
import { restoreFromBackup } from '../../database/restore.js';
import db from '../../database/db.js';
import { AppButton } from '../../components/button/app-button.js';
import { AppCard } from '../../components/card/app-card.js';
import { AppBadge } from '../../components/data-display/app-badge.js';
import { AppConfirmDialog, AppModal } from '../../components/modal/app-modal.js';
import { showToast } from '../../components/feedback/app-alert.js';
import { generateUUID } from '../../utils/id-utils.js';

export async function init(container) {
  const backups = await db.backupMetadata.orderBy('exportedAt').reverse().toArray();

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Backup & Restore</h2>
        <p class="text-muted text-sm mb-0">Cadangkan dan pulihkan data toko</p>
      </div>
    </div>
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div id="backup-export-card"></div>
      </div>
      <div class="col-md-6">
        <div id="backup-import-card"></div>
      </div>
    </div>
    <div class="card border-0 shadow-sm" style="background-color:var(--color-bg-card)">
      <div class="card-header bg-transparent border-bottom px-3 py-2">
        <h6 class="fw-semibold mb-0" style="color:var(--color-text-heading)">Riwayat Backup</h6>
      </div>
      <div class="card-body p-0">
        ${backups.length === 0 ? `
          <div class="text-center py-4">
            <i class="bi bi-inbox fs-2 text-muted d-block mb-2"></i>
            <p class="text-muted text-sm mb-0">Belum ada backup</p>
          </div>
        ` : `
          <div class="table-responsive">
            <table class="table align-middle mb-0" style="border-color:var(--color-border)">
              <thead class="table-light">
                <tr>
                  <th class="text-sm fw-semibold">Tanggal</th>
                  <th class="text-sm fw-semibold">Ukuran</th>
                  <th class="text-sm fw-semibold">Versi Skema</th>
                  <th class="text-sm fw-semibold">Checksum</th>
                </tr>
              </thead>
              <tbody>
                ${backups.map((b) => `
                  <tr>
                    <td class="text-sm">${new Date(b.exportedAt).toLocaleString('id-ID')}</td>
                    <td class="text-sm">${formatBytes(b.fileSize)}</td>
                    <td>${AppBadge({ text: 'v' + b.schemaVersion, variant: 'ACTIVE' }).outerHTML}</td>
                    <td><code class="text-xs">${b.checksum.slice(0, 16)}...</code></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  const exportCard = buildExportCard();
  document.getElementById('backup-export-card').appendChild(exportCard);

  const importCard = buildImportCard(container);
  document.getElementById('backup-import-card').appendChild(importCard);
}

function buildExportCard() {
  const btn = AppButton({ label: 'Buat Backup', icon: 'bi-cloud-arrow-down', variant: 'primary', size: 'lg', fullWidth: true });

  const card = AppCard({
    header: 'Ekspor Data',
    children: [
      document.createTextNode('Buat cadangan data toko ke file JSON. File akan otomatis diunduh.'),
      document.createElement('br'), document.createElement('br'),
      btn,
    ],
  });

  btn.addEventListener('click', async () => {
    btn.setLoading(true);
    try {
      const backup = await exportBackup();
      downloadBackup(backup);
      showToast('Backup berhasil dibuat dan diunduh', 'success');
    } catch (err) {
      showToast('Gagal membuat backup: ' + err.message, 'error');
    } finally {
      btn.setLoading(false);
    }
  });

  return card;
}

function buildImportCard(container) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.className = 'form-control mb-2';
  fileInput.style.borderColor = 'var(--color-border)';

  const restoreBtn = AppButton({ label: 'Pulihkan Data', icon: 'bi-cloud-arrow-up', variant: 'warning', size: 'lg', fullWidth: true, disabled: true });

  fileInput.addEventListener('change', () => {
    restoreBtn.setDisabled(!fileInput.files.length);
  });

  const card = AppCard({
    header: 'Impor Data',
    children: [
      document.createTextNode('Pulihkan data dari file backup JSON. Data saat ini akan ditimpa.'),
      document.createElement('br'), document.createElement('br'),
      fileInput,
      restoreBtn,
    ],
  });

  restoreBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return;

    AppConfirmDialog({
      title: 'Pulihkan Data',
      message: 'Semua data yang ada akan ditimpa dengan data dari file backup. Lanjutkan?',
      confirmText: 'Ya, Pulihkan',
      variant: 'warning',
      onConfirm: async () => {
        restoreBtn.setLoading(true);
        try {
          const summary = await restoreFromBackup(file);
          showToast(`Data berhasil dipulihkan (${summary.totalRecords} catatan dari ${summary.totalTables} tabel)`, 'success');
          fileInput.value = '';
          restoreBtn.setDisabled(true);
        } catch (err) {
          showToast('Gagal memulihkan: ' + err.message, 'error');
        } finally {
          restoreBtn.setLoading(false);
        }
      },
    });
  });

  return card;
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
