import { markActiveRoute } from '../components/Sidebar.js';
import { authService } from '../services/auth-service.js';
import { guardRoute } from './guards.js';

const routes = {
  login: {
    label: 'Login',
    load: () => import('../pages/LoginPage.js'),
    protected: false,
    authOnly: true,
  },
  'lock-screen': {
    label: 'Lock Screen',
    load: () => import('../pages/lock-screen/lock-screen-page.js'),
    protected: true,
    authOnly: false,
  },
  dashboard: {
    label: 'Dashboard',
    load: () => import('../pages/Dashboard.js'),
    protected: true,
    authOnly: false,
    permission: 'dashboard',
  },
  penjualan: {
    label: 'Penjualan',
    load: () => import('../pages/sales/sales-page.js'),
    protected: true,
    authOnly: false,
    permission: 'penjualan',
  },
  produk: {
    label: 'Produk',
    load: () => import('../pages/products/products-page.js'),
    protected: true,
    authOnly: false,
    permission: 'produk',
  },
  pelanggan: {
    label: 'Pelanggan',
    load: () => import('../pages/customers/customers-page.js'),
    protected: true,
    authOnly: false,
    permission: 'pelanggan',
  },
  supplier: {
    label: 'Supplier',
    load: () => import('../pages/suppliers/suppliers-page.js'),
    protected: true,
    authOnly: false,
    permission: 'supplier',
  },
  pembelian: {
    label: 'Pembelian',
    load: () => import('../pages/purchases/purchases-page.js'),
    protected: true,
    authOnly: false,
    permission: 'pembelian',
  },
  laporan: {
    label: 'Laporan',
    load: () => import('../pages/reports/reports-page.js'),
    protected: true,
    authOnly: false,
    permission: 'laporan',
  },
  pengaturan: {
    label: 'Pengaturan',
    load: () => import('../pages/settings/settings-page.js'),
    protected: true,
    authOnly: false,
    permission: 'pengaturan',
  },
};

let currentCleanup = null;

function getRouteKey(hash) {
  const path = hash.replace(/^#\//, '').replace(/\/.*$/, '');
  return path || 'dashboard';
}

function renderNotFound(container) {
  container.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <i class="bi bi-search" style="font-size:48px;color:var(--kpi-label);margin-bottom:16px"></i>
      <h3 style="font-size:18px;font-weight:600;color:var(--kpi-text);margin:0 0 8px">Halaman Tidak Ditemukan</h3>
      <p style="color:var(--kpi-label);font-size:14px">Halaman yang Anda cari belum tersedia.</p>
      <a href="#/dashboard" class="btn btn-primary mt-3" style="border-radius:10px">Kembali ke Dashboard</a>
    </div>
  `;
}

function renderError(container) {
  container.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <i class="bi bi-exclamation-triangle" style="font-size:48px;color:#ef4444;margin-bottom:16px"></i>
      <h3 style="font-size:18px;font-weight:600;color:var(--kpi-text);margin:0 0 8px">Gagal Memuat Halaman</h3>
      <p style="color:var(--kpi-label);font-size:14px">Terjadi kesalahan. Silakan coba lagi.</p>
      <button class="btn btn-primary mt-3" style="border-radius:10px" onclick="window.location.reload()">Muat Ulang</button>
    </div>
  `;
}

async function renderRoute(container, key) {
  const route = routes[key];

  if (!route) {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    renderNotFound(container);
    markActiveRoute('');
    return;
  }

  // Route Guard: protected + belum login -> redirect #/login
  if (!guardRoute(route)) {
    return;
  }

  // Validasi penuh (termasuk status user di DB) untuk route protected.
  if (route.protected) {
    const valid = await authService.validateSession();
    if (!valid) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      window.location.reload();
      return;
    }
  }

  // RBAC: blokir akses ke route yang role user tidak miliki (F-03).
  if (route.permission && !authService.hasPermission(route.permission)) {
    if (window.location.hash !== '#/dashboard') {
      window.location.hash = '#/dashboard';
    }
    window.location.reload();
    return;
  }

  authService.refreshSession();

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const loader = document.createElement('div');
  loader.className = 'd-flex align-items-center justify-content-center py-5';
  loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div>';
  container.innerHTML = '';
  container.appendChild(loader);

  try {
    const page = await route.load();
    if (page.init) {
      await page.init(container);
    }
    markActiveRoute(key);
  } catch (error) {
    console.error('[Router] Gagal memuat halaman:', error);
    renderError(container);
  }
}

function handleHashChange(container) {
  renderRoute(container, getRouteKey(window.location.hash));
}

export function initRouter(container) {
  if (!authService.isLoggedIn()) {
    window.location.hash = '#/login';
    window.location.reload();
    return () => {};
  }

  const onChange = () => handleHashChange(container);
  window.addEventListener('hashchange', onChange);

  const hash = window.location.hash;

  if (!hash || hash === '#/' || hash === '#/login') {
    window.location.hash = '#/dashboard';
  } else {
    handleHashChange(container);
  }

  return () => {
    window.removeEventListener('hashchange', onChange);
  };
}
