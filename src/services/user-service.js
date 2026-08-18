import db from '../database/db.js';
import { generateUUID } from '../utils/id-utils.js';

export async function getUsers() {
  return db.users.where('deletedAt').equals(null).toArray();
}

export async function getUser(id) {
  return db.users.get(id);
}

export async function createUser(data) {
  const existing = await db.users.where('username').equals(data.username.toLowerCase()).first();
  if (existing) throw new Error('Username sudah digunakan');

  const hash = await sha256(data.password);
  const user = {
    id: generateUUID(),
    username: data.username.toLowerCase(),
    passwordHash: hash,
    fullName: data.fullName,
    roleId: data.roleId,
    pin: data.pin || null,
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  await db.users.add(user);
  return user;
}

export async function updateUser(id, data) {
  const user = await db.users.get(id);
  if (!user) throw new Error('User tidak ditemukan');

  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.roleId !== undefined) updates.roleId = data.roleId;
  if (data.pin !== undefined) updates.pin = data.pin || null;
  if (data.isActive !== undefined) updates.isActive = data.isActive;

  if (data.password) {
    updates.passwordHash = await sha256(data.password);
  }

  await db.users.update(id, updates);
  return { ...user, ...updates };
}

export async function deleteUser(id) {
  const user = await db.users.get(id);
  if (!user) throw new Error('User tidak ditemukan');

  const role = await db.roles.get(user.roleId);
  if (role?.name === 'Admin') {
    const adminCount = await db.users
      .where('roleId').equals(user.roleId)
      .and((u) => u.deletedAt === null)
      .count();
    if (adminCount <= 1) throw new Error('Tidak bisa menonaktifkan admin terakhir');
  }

  await db.users.update(id, {
    isActive: false,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getUsersByRole(roleId) {
  return db.users.where({ roleId, deletedAt: null }).toArray();
}

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
