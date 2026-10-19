import db from '../database/db.js';
import { generateUUID } from '../utils/id-utils.js';

export async function getRoles() {
  // `sortOrder` tidak diindeks di skema `roles`, jadi urutkan di memori
  // (IndexedDB menolak orderBy pada key path yang tidak diindeks).
  const roles = await db.roles.toArray();
  return roles.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getRole(id) {
  return db.roles.get(id);
}

export async function createRole(data) {
  const existing = await db.roles.where('name').equals(data.name).first();
  if (existing) throw new Error('Nama role sudah digunakan');

  const roles = await db.roles.toArray();
  const maxSort = roles.reduce((max, r) => Math.max(max, r.sortOrder ?? 0), 0);
  const role = {
    id: generateUUID(),
    name: data.name,
    isSystem: false,
    sortOrder: maxSort + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  await db.roles.add(role);
  return role;
}

export async function updateRole(id, data) {
  const role = await db.roles.get(id);
  if (!role) throw new Error('Role tidak ditemukan');

  if (data.name !== undefined && data.name !== role.name) {
    const existing = await db.roles.where('name').equals(data.name).first();
    if (existing && existing.id !== id) throw new Error('Nama role sudah digunakan');
  }

  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (data.name !== undefined) updates.name = data.name;
  if (data.sortOrder !== undefined) updates.sortOrder = data.sortOrder;

  await db.roles.update(id, updates);
  return { ...role, ...updates };
}

export async function deleteRole(id) {
  const role = await db.roles.get(id);
  if (!role) throw new Error('Role tidak ditemukan');
  if (role.isSystem) throw new Error('Role sistem tidak bisa dihapus');

  const userCount = await db.users.where('roleId').equals(id).count();
  if (userCount > 0) throw new Error('Role masih digunakan oleh ' + userCount + ' user');

  await db.roles.delete(id);
}
