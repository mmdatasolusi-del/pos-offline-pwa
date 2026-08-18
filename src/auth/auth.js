import db from '../database/db.js';
import { sha256 } from '../utils/hash-utils.js';
import { generateUUID } from '../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

function baseRecord() {
  return { createdAt: now(), updatedAt: now(), deletedAt: null };
}

const DEFAULT_ROLES = [
  { id: 'role-owner', name: 'Owner', isSystem: true, sortOrder: 1 },
  { id: 'role-admin', name: 'Admin', isSystem: true, sortOrder: 2 },
  { id: 'role-kasir', name: 'Kasir', isSystem: true, sortOrder: 3 },
];

// Akun legacy yang dibuat oleh sistem lama dengan password publik.
const LEGACY_DEFAULT_USER_IDS = ['user-owner', 'user-admin', 'user-kasir'];

export async function ensureSystemRoles() {
  let created = false;

  for (const roleDef of DEFAULT_ROLES) {
    const exists = await db.roles.get(roleDef.id);
    if (!exists) {
      await db.roles.add({ ...roleDef, ...baseRecord() });
      created = true;
    }
  }

  return created;
}

export async function hasOwnerAccount() {
  const role = await db.roles.where('name').equals('Owner').first();
  if (!role) return false;

  const count = await db.users
    .where('roleId')
    .equals(role.id)
    .and((u) => !u.deletedAt && u.isActive && !LEGACY_DEFAULT_USER_IDS.includes(u.id))
    .count();

  return count > 0;
}

export async function createOwnerAccount({ username, fullName, password }) {
  const usernameNorm = (username || '').trim().toLowerCase();
  const fullNameNorm = (fullName || '').trim();

  if (!usernameNorm) {
    return { success: false, error: 'Username wajib diisi' };
  }
  if (fullNameNorm.length < 2) {
    return { success: false, error: 'Nama lengkap wajib diisi' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password minimal 6 karakter' };
  }

  const role = await db.roles.where('name').equals('Owner').first();
  if (!role) {
    return { success: false, error: 'Role Owner belum tersedia' };
  }

  const existing = await db.users.where('username').equals(usernameNorm).first();
  if (existing) {
    return { success: false, error: 'Username sudah digunakan' };
  }

  const passwordHash = await sha256(password);

  await db.users.add({
    id: 'user-' + generateUUID(),
    username: usernameNorm,
    passwordHash,
    fullName: fullNameNorm,
    roleId: role.id,
    pin: null,
    isActive: true,
    ...baseRecord(),
  });

  await cleanupLegacyDefaultUsers();

  return { success: true };
}

async function cleanupLegacyDefaultUsers() {
  for (const id of LEGACY_DEFAULT_USER_IDS) {
    const user = await db.users.get(id);
    if (user) {
      await db.users.delete(id);
    }
  }
}
