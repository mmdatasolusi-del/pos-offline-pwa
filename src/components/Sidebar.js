import { authService } from '../services/auth-service.js';

const MENU = [
  {
    label: 'Utama', items: [
      { icon: 'bi-speedometer2', label: 'Dashboard', href: '#/dashboard' },
      { icon: 'bi-cart3', label: 'Penjualan', href: '#/penjualan' },
    ],
  },
  {
    label: 'Master Data', items: [
      { icon: 'bi-box', label: 'Produk', href: '#/produk' },
      { icon: 'bi-people', label: 'Pelanggan', href: '#/pelanggan' },
      { icon: 'bi-truck', label: 'Supplier', href: '#/supplier' },
    ],
  },
  {
    label: 'Transaksi', items: [
      { icon: 'bi-bag', label: 'Pembelian', href: '#/pembelian' },
    ],
  },
  {
    label: 'Analitik', items: [
      { icon: 'bi-graph-up', label: 'Laporan', href: '#/laporan' },
    ],
  },
  {
    label: 'Sistem', items: [
      { icon: 'bi-gear', label: 'Pengaturan', href: '#/pengaturan' },
    ],
  },
];

function getFilteredMenu() {
  return MENU.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const key = item.href.replace('#/', '');
      return authService.hasPermission(key);
    }),
  })).filter(section => section.items.length > 0);
}

function renderMenuItems(section) {
  return section.items.map(item => `
    <a href="${item.href}" class="sidebar-item" data-route="${item.href.replace('#/', '')}">
      <i class="bi ${item.icon}"></i>
      <span class="sidebar-item-text">${item.label}</span>
    </a>
  `).join('');
}

function renderSections() {
  return getFilteredMenu().map(section => `
    <div class="sidebar-section">
      <div class="sidebar-section-label">${section.label}</div>
      <ul class="sidebar-menu">${renderMenuItems(section)}</ul>
    </div>
  `).join('');
}

export function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Navigasi utama');

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><i class="bi bi-cpu"></i></div>
      <span class="sidebar-brand-text">POS OFFLINE</span>
    </div>
    <nav class="sidebar-nav">${renderSections()}</nav>
    <div class="sidebar-toggle" data-action="toggle-sidebar" title="Collapse sidebar">
      <i class="bi bi-chevron-left"></i>
    </div>
    <div class="sidebar-backdrop" data-action="close-sidebar"></div>
  `;

  sidebar.querySelector('[data-action="toggle-sidebar"]').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });

  sidebar.querySelector('[data-action="close-sidebar"]')?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });

  return sidebar;
}

export function markActiveRoute(path) {
  document.querySelectorAll('.sidebar-item').forEach(el => {
    const route = el.getAttribute('data-route');
    el.classList.toggle('active', route === path || (path === '' && route === 'dashboard'));
    el.setAttribute('aria-current', route === path ? 'page' : 'false');
  });
}
