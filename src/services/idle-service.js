import { APP_CONFIG } from '../config/app.config.js';
import { authService } from './auth-service.js';

const IDLE_TIMEOUT_MS = (APP_CONFIG.sessionTimeout || 30) * 60 * 1000;

let idleTimer = null;
let lastPersist = 0;

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

export function startIdleMonitor() {
  if (!authService.isLoggedIn()) return;

  stopIdleMonitor();
  resetTimer();
  EVENTS.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
}

export function stopIdleMonitor() {
  clearTimeout(idleTimer);
  idleTimer = null;
  EVENTS.forEach((ev) => window.removeEventListener(ev, resetTimer));
}

export function isScreenLocked() {
  return false;
}

export function unlockScreen() {
  if (authService.isLoggedIn()) {
    startIdleMonitor();
  }
}

function resetTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(handleIdleTimeout, IDLE_TIMEOUT_MS);

  const now = Date.now();
  if (now - lastPersist > 15000) {
    lastPersist = now;
    authService.refreshSession();
  }
}

function handleIdleTimeout() {
  stopIdleMonitor();
  authService.logout({ redirect: true });
}
