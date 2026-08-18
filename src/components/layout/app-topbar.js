import { APP_CONFIG } from '../../config/app.config.js';
import { getCurrentTheme, toggleTheme } from '../../services/theme-service.js';

export function renderTopbar() {
  const topbar = document.createElement('header');
  topbar.className = 'app-topbar';
  topbar.setAttribute('role', 'banner');

  const currentTheme = getCurrentTheme();
  const themeIcon = currentTheme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill';

  topbar.innerHTML = `
    <div class="topbar-left d-flex align-items-center gap-2">
      <button type="button" class="btn btn-link topbar-btn d-lg-none" data-action="toggle-sidebar" aria-label="Buka menu navigasi" aria-expanded="true">
        <i class="bi bi-list fs-5"></i>
      </button>
      <nav aria-label="Breadcrumb">
        <ol class="breadcrumb m-0" data-app-breadcrumb></ol>
      </nav>
    </div>
    <div class="topbar-right d-flex align-items-center gap-2">
      <button type="button" class="btn btn-link topbar-btn theme-toggle" data-action="toggle-theme" aria-label="Ganti tema" title="Ganti tema">
        <i class="bi ${themeIcon} fs-5"></i>
      </button>
      <div class="topbar-user dropdown">
        <button type="button" class="btn btn-link topbar-btn dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Menu pengguna">
          <div class="topbar-avatar d-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style="width:32px;height:32px;font-size:14px;font-weight:600">
            <i class="bi bi-person"></i>
          </div>
          <span class="d-none d-md-inline topbar-username text-muted">Kasir</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><h6 class="dropdown-header">Akun</h6></li>
          <li><a class="dropdown-item" href="#/settings"><i class="bi bi-person me-2"></i>Profil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#/login"><i class="bi bi-box-arrow-right me-2"></i>Keluar</a></li>
        </ul>
      </div>
    </div>
  `;

  topbar.querySelector('[data-action="toggle-sidebar"]')
    .addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
    });

  topbar.querySelector('[data-action="toggle-theme"]')
    .addEventListener('click', () => {
      const next = toggleTheme();
      const icon = topbar.querySelector('.theme-toggle i');
      if (icon) {
        icon.className = `bi ${next === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'} fs-5`;
      }
    });

  return topbar;
}
