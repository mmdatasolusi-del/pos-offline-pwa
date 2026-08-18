import { authenticate } from '../auth/login.js';
import {
  saveSession,
  getCurrentUser,
  clearSession,
  isSessionValid,
  refreshSession as refreshStoredSession,
  endSession,
} from '../auth/session.js';
import { ensureSystemRoles } from '../auth/auth.js';
import db from '../database/db.js';

const ROLE_PERMISSIONS = {
  Owner: ['dashboard', 'penjualan', 'produk', 'pelanggan', 'supplier', 'pembelian', 'laporan', 'pengaturan'],
  Admin: ['dashboard', 'penjualan', 'produk', 'pelanggan', 'supplier', 'pembelian', 'laporan'],
  Kasir: ['dashboard', 'penjualan'],
};

class AuthService {
  #cache = { user: null };

  async init() {
    await ensureSystemRoles();
  }

  async login(username, password, rememberMe = false) {
    const result = await authenticate(username, password);
    if (result.success) {
      const session = saveSession(result.user, rememberMe);
      this.#cache.user = session.user;
      result.session = session;
    }
    return result;
  }

  logout({ redirect = false } = {}) {
    endSession();
    this.#cache.user = null;

    if (redirect) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      window.location.reload();
    }
  }

  isLoggedIn() {
    return isSessionValid();
  }

  currentUser() {
    if (this.#cache.user) return this.#cache.user;
    this.#cache.user = getCurrentUser();
    return this.#cache.user;
  }

  refreshSession() {
    const session = refreshStoredSession();
    this.#cache.user = session ? session.user : null;
    return session;
  }

  async validateSession() {
    if (!isSessionValid()) {
      clearSession();
      this.#cache.user = null;
      return false;
    }

    const user = this.currentUser();
    if (!user) {
      clearSession();
      this.#cache.user = null;
      return false;
    }

    const dbUser = await db.users.get(user.id);
    if (!dbUser || !dbUser.isActive || dbUser.deletedAt) {
      clearSession();
      this.#cache.user = null;
      return false;
    }

    const role = await db.roles.get(dbUser.roleId);
    if (!role || role.deletedAt) {
      clearSession();
      this.#cache.user = null;
      return false;
    }

    this.#cache.user = getCurrentUser();
    return true;
  }

  hasRole(roleName) {
    const user = this.currentUser();
    return user?.roleName === roleName;
  }

  hasPermission(routeKey) {
    const user = this.currentUser();
    if (!user) return false;
    const allowed = ROLE_PERMISSIONS[user.roleName];
    if (!allowed) return false;
    return allowed.includes(routeKey);
  }

  getMenuForRole() {
    const user = this.currentUser();
    if (!user) return [];
    return ROLE_PERMISSIONS[user.roleName] ?? [];
  }
}

export const authService = new AuthService();
