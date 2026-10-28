/**
 * Permission constants — modul & aksi untuk sistem RBAC.
 */

export const MODULES = Object.freeze({
  DASHBOARD: 'dashboard',
  POS: 'pos',
  SALES: 'sales',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  INVENTORY: 'inventory',
  FINANCE: 'finance',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  USERS: 'users',
  ROLES: 'roles',
  BACKUP: 'backup',
});

export const ACTIONS = Object.freeze({
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
});

/** Bentuk kunci permission: `${module}:${action}` */
export function permissionKey(module, action) {
  return `${module}:${action}`;
}

const ALL = Object.values(MODULES);
const A = Object.values(ACTIONS);

export const OWNER_PERMISSIONS = Object.freeze(
  ALL.flatMap((m) => A.map((a) => permissionKey(m, a))),
);

export const ADMIN_PERMISSIONS = Object.freeze(
  ALL.filter((m) => m !== MODULES.ROLES).flatMap((m) => A.map((a) => permissionKey(m, a))),
);

export const KASIR_PERMISSIONS = Object.freeze([
  permissionKey(MODULES.DASHBOARD, ACTIONS.VIEW),
  permissionKey(MODULES.POS, ACTIONS.VIEW),
  permissionKey(MODULES.POS, ACTIONS.CREATE),
  permissionKey(MODULES.SALES, ACTIONS.VIEW),
  permissionKey(MODULES.PRODUCTS, ACTIONS.VIEW),
  permissionKey(MODULES.CUSTOMERS, ACTIONS.VIEW),
  permissionKey(MODULES.CUSTOMERS, ACTIONS.CREATE),
]);

/** Peta role → daftar permission key (fallback bila tabel permissions kosong). */
import { ROLE } from './roles.js';

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLE.OWNER]: OWNER_PERMISSIONS,
  [ROLE.ADMIN]: ADMIN_PERMISSIONS,
  [ROLE.KASIR]: KASIR_PERMISSIONS,
});
