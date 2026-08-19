import db from '../database/db.js';
import { generateUUID } from '../utils/id-utils.js';
import { hashPassword } from '../utils/hash-utils.js';

export async function getUsers() {
  const users = await db.users.where('deletedAt').equals(null).toArray();
  for (const user of users) {
    await migratePlaintextPin(user);
  }
  return users.map(stripCredentialFields);
}

export async function getUser(id) {
  const user = await db.users.get(id);
  if (!user) return null;
  await migratePlaintextPin(user);
  return stripCredentialFields(user);
}

export async function createUser(data) {
  const existing = await db.users.where('username').equals(data.username.toLowerCase()).first();
  if (existing) throw new Error('Username sudah digunakan');

  const passwordHash = await hashPassword(data.password);
  const pinHash = data.pin ? await hashPassword(String(data.pin)) : null;
  const user = {
    id: generateUUID(),
    username: data.username.toLowerCase(),
    passwordHash,
    fullName: data.fullName,
    roleId: data.roleId,
    pinHash,
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  await db.users.add(user);
  return stripCredentialFields(user);
}

export async function updateUser(id, data) {
  const user = await db.users.get(id);
  if (!user) throw new Error('User tidak ditemukan');

  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.roleId !== undefined) updates.roleId = data.roleId;
  if (data.isActive !== undefined) updates.isActive = data.isActive;

  if (typeof data.pin === 'string' && data.pin !== '') {
    updates.pinHash = await hashPassword(data.pin);
    updates.pin = undefined; // hapus kemungkinan pin plaintext dari record lama
  }

  if (data.password) {
    updates.passwordHash = await hashPassword(data.password);
  }

  await db.users.update(id, updates);
  return stripCredentialFields({ ...user, ...updates });
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
  const users = await db.users.where({ roleId, deletedAt: null }).toArray();
  for (const user of users) {
    await migratePlaintextPin(user);
  }
  return users.map(stripCredentialFields);
}

async function migratePlaintextPin(user) {
  if (!user || user.pinHash || !user.pin) return;
  try {
    const pinHash = await hashPassword(String(user.pin));
    await db.users.update(user.id, {
      pinHash,
      pin: undefined,
      updatedAt: new Date().toISOString(),
    });
    delete user.pin;
    user.pinHash = pinHash;
  } catch (error) {
    // Jangan gagalkan operasi baca; PIN lama tidak boleh diekspos ke response.
    delete user.pin;
  }
}

function stripCredentialFields(user) {
  if (!user) return user;
  const { passwordHash, pin, pinHash, ...safe } = user;
  return safe;
}
