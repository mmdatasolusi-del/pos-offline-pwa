import * as dashboard from '../pages/dashboard/dashboard-page.js';
import * as pos from '../pages/pos/pos-page.js';
import * as products from '../pages/products/products-page.js';
import * as categories from '../pages/categories/categories-page.js';
import * as customers from '../pages/customers/customers-page.js';
import * as suppliers from '../pages/suppliers/suppliers-page.js';
import * as sales from '../pages/sales/sales-page.js';
import * as purchases from '../pages/purchases/purchases-page.js';
import * as inventory from '../pages/inventory/inventory-page.js';
import * as reports from '../pages/reports/reports-page.js';
import * as settings from '../pages/settings/settings-page.js';
import * as login from '../pages/login/login-page.js';
import * as lockScreen from '../pages/lock-screen/lock-screen-page.js';
import * as notFound from '../pages/not-found/not-found-page.js';

export const ROUTES = [
  {
    path: '/',
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    page: dashboard,
    group: 'main',
    parent: null,
    protected: true,
  },
  {
    path: '/login',
    name: 'login',
    label: 'Login',
    page: login,
    group: 'auth',
    parent: null,
    protected: false,
  },
  {
    path: '/lock-screen',
    name: 'lock-screen',
    label: 'Lock Screen',
    page: lockScreen,
    group: 'auth',
    parent: null,
    protected: false,
  },
  {
    path: '/pos',
    name: 'pos',
    label: 'POS',
    icon: 'bi-cart3',
    page: pos,
    group: 'main',
    parent: null,
    protected: true,
  },
  {
    path: '/products',
    name: 'products',
    label: 'Produk',
    icon: 'bi-box',
    page: products,
    group: 'master',
    parent: null,
    protected: true,
  },
  {
    path: '/categories',
    name: 'categories',
    label: 'Kategori',
    icon: 'bi-folder',
    page: categories,
    group: 'master',
    parent: null,
    protected: true,
  },
  {
    path: '/customers',
    name: 'customers',
    label: 'Pelanggan',
    icon: 'bi-people',
    page: customers,
    group: 'master',
    parent: null,
    protected: true,
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    label: 'Pemasok',
    icon: 'bi-truck',
    page: suppliers,
    group: 'master',
    parent: null,
    protected: true,
  },
  {
    path: '/sales',
    name: 'sales',
    label: 'Penjualan',
    icon: 'bi-receipt',
    page: sales,
    group: 'transaction',
    parent: null,
    protected: true,
  },
  {
    path: '/purchases',
    name: 'purchases',
    label: 'Pembelian',
    icon: 'bi-bag',
    page: purchases,
    group: 'transaction',
    parent: null,
    protected: true,
  },
  {
    path: '/inventory',
    name: 'inventory',
    label: 'Inventori',
    icon: 'bi-archive',
    page: inventory,
    group: 'transaction',
    parent: null,
    protected: true,
  },
  {
    path: '/reports',
    name: 'reports',
    label: 'Laporan',
    icon: 'bi-graph-up',
    page: reports,
    group: 'analytics',
    parent: null,
    protected: true,
  },
  {
    path: '/settings',
    name: 'settings',
    label: 'Pengaturan',
    icon: 'bi-gear',
    page: settings,
    group: 'system',
    parent: null,
    protected: true,
  },
];

export const NOT_FOUND_ROUTE = {
  path: '/404',
  name: 'not-found',
  label: 'Halaman Tidak Ditemukan',
  page: notFound,
};

export const ROUTE_GROUPS = [
  { key: 'main', label: 'Utama' },
  { key: 'master', label: 'Master Data' },
  { key: 'transaction', label: 'Transaksi' },
  { key: 'analytics', label: 'Analitik' },
  { key: 'system', label: 'Sistem' },
];
