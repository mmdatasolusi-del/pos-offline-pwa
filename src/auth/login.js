import db from '../database/db.js';
import { sha256 } from '../utils/hash-utils.js';

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

  const hash = await sha256(password);
  if (user.passwordHash !== hash) {
    return { success: false, error: 'Password salah' };
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
