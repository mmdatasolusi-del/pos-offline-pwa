import { APP_CONFIG } from '../config/app.config.js';

const P = APP_CONFIG.storagePrefix;

export const STORAGE_KEYS = Object.freeze({
  THEME: P + 'theme',
  AUTH: P + 'auth',
  USER: P + 'user',
  SHIFT: P + 'shift',
  CART: P + 'cart',
  SETTINGS: P + 'settings',
  LAST_SYNC: P + 'last_sync',
  BACKUP: P + 'backup',
  SESSION: P + 'session',
});
