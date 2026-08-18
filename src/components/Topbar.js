import { getCurrentTheme, toggleTheme } from '../services/theme-service.js';
import { authService } from '../services/auth-service.js';

function formatDate() {
  const d = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('id-ID', opts);
}

function getInitials() {
  const user = authService.currentUser();
  if (!user || !user.fullName) return 'U';
  return user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export function renderTopbar() {
  const topbar = document.createElement('header');
  topbar.className = 'app-topbar';
  topbar.setAttribute('role', 'banner');

  const theme = getCurrentTheme();
  const themeIcon = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill';

  topbar.innerHTML = `
    <div class="topbar-left">
      <button type="button" class="topbar-hamburger" data-action="toggle-mobile-sidebar" aria-label="Buka menu">
        <i class="bi bi-list"></i>
      </button>
      <div class="topbar-search">
        <i class="bi bi-search"></i>
        <input type="search" placeholder="Cari menu atau fitur..." aria-label="Pencarian">
      </div>
    </div>
    <div class="topbar-right">
      <span class="topbar-date"><i class="bi bi-calendar3 me-1"></i>${formatDate()}</span>
      <button type="button" class="topbar-btn" data-action="toggle-theme" aria-label="Ganti tema" title="Ganti tema">
        <i class="bi ${themeIcon}"></i>
      </button>
      <div class="topbar-user dropdown">
        <button type="button" class="topbar-user" data-bs-toggle="dropdown" aria-expanded="false" style="background:none;border:none;width:auto">
          <div class="topbar-user-avatar">${getInitials()}</div>
          <span class="topbar-user-name">${(authService.currentUser()?.fullName) || 'User'}</span>
          <i class="bi bi-chevron-down" style="font-size:12px;color:var(--topbar-text);margin-left:2px"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="border-radius:12px;border:1px solid var(--topbar-border);padding:6px">
          <li><span class="dropdown-item-text py-1 small text-muted" style="font-size:12px">${(authService.currentUser()?.roleName) || ''}</span></li>
          <li><hr class="dropdown-divider my-1"></li>
          <li><a class="dropdown-item py-2" href="#/pengaturan"><i class="bi bi-person me-2"></i>Profil</a></li>
          <li><hr class="dropdown-divider my-1"></li>
          <li><button type="button" class="dropdown-item py-2 text-danger" id="logout-btn"><i class="bi bi-box-arrow-right me-2"></i>Keluar</button></li>
        </ul>
      </div>
    </div>
  `;

  topbar.querySelector('[data-action="toggle-mobile-sidebar"]').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  topbar.querySelector('[data-action="toggle-theme"]').addEventListener('click', () => {
    const next = toggleTheme();
    const icon = topbar.querySelector('[data-action="toggle-theme"] i');
    if (icon) {
      icon.className = `bi ${next === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`;
    }
  });

  const userToggle = topbar.querySelector('[data-bs-toggle="dropdown"]');
  const userMenu = topbar.querySelector('.dropdown-menu');

  const closeUserMenu = () => {
    userMenu?.classList.remove('show');
    userToggle?.setAttribute('aria-expanded', 'false');
  };

  userToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = userMenu?.classList.contains('show');
    closeAllTopbarDropdowns();
    if (!isOpen) {
      userMenu?.classList.add('show');
      userToggle.setAttribute('aria-expanded', 'true');
    }
  });

  topbar.querySelectorAll('.dropdown-menu .dropdown-item').forEach((item) => {
    item.addEventListener('click', closeUserMenu);
  });

  document.addEventListener('click', (e) => {
    if (!topbar.contains(e.target)) {
      closeUserMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeUserMenu();
    }
  });

  const logoutBtn = topbar.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout({ redirect: true });
    });
  }

  return topbar;
}

function closeAllTopbarDropdowns() {
  document.querySelectorAll('.app-topbar .dropdown-menu.show').forEach((m) => {
    m.classList.remove('show');
    const btn = m.closest('.dropdown')?.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}
