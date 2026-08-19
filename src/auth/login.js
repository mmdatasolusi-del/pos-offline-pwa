import db from '../database/db.js';
import { verifyPassword, isPbkdf2Hash, hashPassword } from '../utils/hash-utils.js';

export async function authenticate(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username dan password wajib diisi' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password minimal 6 karakter' };
  }

  const user = await db.users.where('username').equals(username.toLowerCase()).first();

  if (!user) {
    return { success: false, error: 'Username tidak ditemukan' };
  }

  if (!user.isActive) {
    return { success: false, error: 'Akun telah dinonaktifkan' };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { success: false, error: 'Password salah' };
  }

  // Migrasi lazy & idempotent: hash legacy SHA-256 ditingkatkan ke PBKDF2+salt.
  if (!isPbkdf2Hash(user.passwordHash)) {
    try {
      const upgraded = await hashPassword(password);
      await db.users.update(user.id, {
        passwordHash: upgraded,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[Auth] Gagal mengupgrade hash password lama:', error.message);
    }
  }

  const role = await db.roles.get(user.roleId);
  if (!role) {
    return { success: false, error: 'Role pengguna tidak valid' };
  }

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: role.name,
      isActive: user.isActive,
    },
  };
}
