import db from '../database/db.js';
import { generateUUID } from '../utils/id-utils.js';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'pos', label: 'POS' },
  { key: 'products', label: 'Produk' },
  { key: 'categories', label: 'Kategori' },
  { key: 'units', label: 'Satuan' },
  { key: 'suppliers', label: 'Pemasok' },
  { key: 'customers', label: 'Pelanggan' },
  { key: 'sales', label: 'Penjualan' },
  { key: 'purchases', label: 'Pembelian' },
  { key: 'inventory', label: 'Inventori' },
  { key: 'reports', label: 'Laporan' },
  { key: 'settings', label: 'Pengaturan' },
  { key: 'users', label: 'Pengguna' },
  { key: 'roles', label: 'Role' },
  { key: 'permissions', label: 'Hak Akses' },
  { key: 'backup', label: 'Backup' },
];

const ACTIONS = ['create', 'read', 'update', 'delete'];

const DEFAULT_PERMISSIONS = {
  Admin: MODULES.reduce((acc, m) => {
    acc[m.key] = ACTIONS.reduce((a, k) => ({ ...a, [k]: true }), {});
    return acc;
  }, {}),
  Cashier: {
    dashboard: { create: false, read: true, update: false, delete: false },
    pos: { create: true, read: true, update: true, delete: false },
    products: { create: false, read: true, update: false, delete: false },
    sales: { create: true, read: true, update: false, delete: false },
    customers: { create: true, read: true, update: true, delete: false },
    inventory: { create: false, read: true, update: false, delete: false },
  },
  Staff: {
    dashboard: { create: false, read: true, update: false, delete: false },
    products: { create: true, read: true, update: true, delete: false },
    categories: { create: true, read: true, update: true, delete: false },
    suppliers: { create: true, read: true, update: true, delete: false },
    customers: { create: true, read: true, update: true, delete: false },
    inventory: { create: false, read: true, update: false, delete: false },
    purchases: { create: true, read: true, update: true, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
  },
};

export async function getPermissionsByRole(roleId) {
  const permissions = await db.permissions.where('roleId').equals(roleId).toArray();
  const matrix = {};
  for (const p of permissions) {
    if (!matrix[p.module]) matrix[p.module] = {};
    matrix[p.module][p.action] = true;
  }
  return matrix;
}

export async function setPermission(roleId, module, action, granted) {
  const existing = await db.permissions
    .where({ roleId, module, action })
    .first();

  if (granted) {
    if (!existing) {
      await db.permissions.add({
        id: generateUUID(),
        roleId,
        module,
        action,
      });
    }
  } else {
    if (existing) {
      await db.permissions.delete(existing.id);
    }
  }
}

export async function setModulePermissions(roleId, module, actions) {
  const existing = await db.permissions.where({ roleId, module }).toArray();
  const existingActions = new Set(existing.map((p) => p.action));

  for (const [action, granted] of Object.entries(actions)) {
    if (granted && !existingActions.has(action)) {
      await db.permissions.add({ id: generateUUID(), roleId, module, action });
    } else if (!granted && existingActions.has(action)) {
      const toRemove = existing.find((p) => p.action === action);
      if (toRemove) await db.permissions.delete(toRemove.id);
    }
  }
}

export async function hasPermission(roleId, module, action) {
  const perm = await db.permissions
    .where({ roleId, module, action })
    .first();
  return !!perm;
}

export async function can(module, action) {
  const { authService } = await import('./auth-service.js');
  const user = authService.currentUser();
  if (!user) return false;

  const role = await db.roles.get(user.roleId);
  if (role?.name === 'Admin') return true;

  return hasPermission(user.roleId, module, action);
}

export { MODULES, ACTIONS, DEFAULT_PERMISSIONS };
