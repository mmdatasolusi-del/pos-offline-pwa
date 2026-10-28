/**
 * Role constants — nama role sistem yang dibuat saat instalasi.
 * Konsisten dengan DEFAULT_ROLES di src/auth/auth.js.
 */

export const ROLE = Object.freeze({
  OWNER: 'Owner',
  ADMIN: 'Admin',
  KASIR: 'Kasir',
});

export const ROLE_IDS = Object.freeze({
  [ROLE.OWNER]: 'role-owner',
  [ROLE.ADMIN]: 'role-admin',
  [ROLE.KASIR]: 'role-kasir',
});

export const ROLE_LABELS = Object.freeze({
  [ROLE.OWNER]: 'Pemilik Usaha',
  [ROLE.ADMIN]: 'Administrator',
  [ROLE.KASIR]: 'Kasir',
});
