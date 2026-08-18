import { AppBadge } from '../../components/data-display/app-badge.js';

const TABS = [
  { key: 'store', label: 'Profil Toko', icon: 'bi-shop' },
  { key: 'users', label: 'Pengguna', icon: 'bi-people' },
  { key: 'roles', label: 'Role', icon: 'bi-shield' },
  { key: 'permissions', label: 'Hak Akses', icon: 'bi-lock' },
  { key: 'backup', label: 'Backup', icon: 'bi-cloud-arrow-down' },
  { key: 'database', label: 'Database', icon: 'bi-database' },
  { key: 'audit', label: 'Audit Log', icon: 'bi-journal-text' },
];

export async function init(container) {
  container.innerHTML = `
    <div class="page-header mb-4">
      <h1 class="h3 fw-bold mb-1" style="color:var(--color-text-heading)">Pengaturan</h1>
      <p class="text-muted mb-0">Konfigurasi toko dan aplikasi</p>
    </div>
    <div class="mb-3">
      <div class="d-flex gap-2 flex-wrap" id="settings-tabs" role="tablist"></div>
    </div>
    <div id="settings-content"></div>
  `;

  const tabsContainer = document.getElementById('settings-tabs');
  const contentContainer = document.getElementById('settings-content');

  TABS.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn d-inline-flex align-items-center gap-1 ${index === 0 ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`;
    btn.setAttribute('role', 'tab');
    btn.innerHTML = `<i class="${tab.icon}"></i> ${tab.label}`;
    if (tab.comingSoon) {
      btn.appendChild(AppBadge({ text: 'Segera', variant: 'PENDING', size: 'sm' }));
    }
    btn.addEventListener('click', async () => {
      tabsContainer.querySelectorAll('[role="tab"]').forEach((b) => {
        b.className = 'btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1';
      });
      btn.className = `btn btn-primary btn-sm d-inline-flex align-items-center gap-1`;
      await loadTab(tab.key, contentContainer);
    });
    tabsContainer.appendChild(btn);
  });

  await loadTab('store', contentContainer);
}

async function loadTab(key, container) {
  container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div></div>';

  try {
    switch (key) {
      case 'store': {
        const { init } = await import('./store-page.js');
        await init(container);
        break;
      }
      case 'users': {
        const { init } = await import('./users-page.js');
        await init(container);
        break;
      }
      case 'roles': {
        const { init } = await import('./roles-page.js');
        await init(container);
        break;
      }
      case 'permissions': {
        const { init } = await import('./permissions-page.js');
        await init(container);
        break;
      }
      case 'backup': {
        const { init } = await import('./backup-page.js');
        await init(container);
        break;
      }
      case 'database': {
        const { init } = await import('./database-page.js');
        await init(container);
        break;
      }
      case 'audit': {
        const { init } = await import('./audit-page.js');
        await init(container);
        break;
      }
      default:
        container.innerHTML = `
          <div class="card border-0 shadow-sm text-center py-5" style="background-color:var(--color-bg-card)">
            <i class="bi bi-hourglass-split fs-1 text-muted mb-3 d-block"></i>
            <h5 class="fw-semibold" style="color:var(--color-text-heading)">Coming Soon</h5>
            <p class="text-muted mb-0">Fitur ini akan tersedia di fase pengembangan selanjutnya.</p>
          </div>
        `;
    }
  } catch (err) {
    console.error('[Settings] Error loading tab:', err);
    container.innerHTML = `
      <div class="alert py-2 px-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)">
        <i class="bi bi-exclamation-circle me-1"></i> Gagal memuat: ${err.message}
      </div>
    `;
  }
}
