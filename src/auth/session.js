const SESSION_KEY = 'pos_offline_session';
const DEVICE_ID_KEY = 'pos_offline_device_id';

const SESSION_MAX_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 jam utk sesi non-rememberMe
const REMEMBER_ME_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari utk rememberMe

function generateDeviceId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  } catch {
    return 'unknown-device';
  }
}

export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return generateDeviceId();
  }
}

function storageFor(rememberMe) {
  try {
    return rememberMe ? localStorage : sessionStorage;
  } catch {
    return localStorage;
  }
}

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(user, rememberMe = false) {
  const now = Date.now();
  const duration = rememberMe ? REMEMBER_ME_DURATION_MS : SESSION_MAX_LIFETIME_MS;

  const session = {
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.roleName,
      isActive: user.isActive,
    },
    createdAt: now,
    loginTime: now,
    lastActivity: now,
    expiresAt: now + duration,
    rememberMe: !!rememberMe,
    deviceId: getDeviceId(),
    logoutTime: null,
  };

  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    storageFor(session.rememberMe).setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }

  return session;
}

export function getSession() {
  const data = readStoredSession();
  if (!data || !data.user) return null;

  // Session lama (sebelum refactor) tanpa expiresAt/loginTime dianggap tidak valid.
  if (typeof data.expiresAt !== 'number' || typeof data.loginTime !== 'number') {
    clearSession();
    return null;
  }

  // Session yang dibuat di perangkat lain (deviceId berbeda) dianggap tidak valid.
  if (data.deviceId && data.deviceId !== getDeviceId()) {
    clearSession();
    return null;
  }

  return data;
}

export function isSessionExpired(session) {
  if (!session) return true;
  if (typeof session.expiresAt !== 'number') return true;
  return Date.now() >= session.expiresAt;
}

export function isSessionValid() {
  const session = getSession();
  if (!session) return false;

  if (isSessionExpired(session)) {
    clearSession();
    return false;
  }

  if (!session.user?.isActive) {
    clearSession();
    return false;
  }

  return true;
}

export function getCurrentUser() {
  const session = getSession();
  return session?.user ?? null;
}

export function refreshSession() {
  const session = getSession();
  if (!session || isSessionExpired(session)) {
    clearSession();
    return null;
  }

  session.lastActivity = Date.now();

  try {
    storageFor(session.rememberMe).setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }

  return session;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function endSession() {
  const session = getSession();
  if (session) {
    session.logoutTime = Date.now();
    try {
      storageFor(session.rememberMe).setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable */
    }
  }
  clearSession();
}

export function getLoginTime() {
  return getSession()?.loginTime ?? null;
}

export function getLogoutTime() {
  return getSession()?.logoutTime ?? null;
}

export function getLastActivity() {
  return getSession()?.lastActivity ?? null;
}

export function isRemembered() {
  return !!getSession()?.rememberMe;
}
