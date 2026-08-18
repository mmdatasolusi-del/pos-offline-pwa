import { pwaRegister } from './pwa-register.js';
import { pwaInstall } from './pwa-install.js';
import { cacheManager } from './pwa-cache-manager.js';
import { PWA_CONFIG } from './pwa-config.js';

export { pwaRegister, pwaInstall, cacheManager, PWA_CONFIG };

export async function initPWA() {
  console.log('[PWA] Initializing...');

  await pwaRegister.register();

  if (pwaRegister.status === 'active') {
    console.log('[PWA] Offline mode ready');
  }

  return {
    registered: pwaRegister.status === 'active',
    installable: pwaInstall.canInstall,
    installed: pwaInstall.isInstalled,
  };
}

export function checkOnlineStatus() {
  return navigator.onLine;
}

export function onOnlineChange(handler) {
  window.addEventListener('online', () => handler(true));
  window.addEventListener('offline', () => handler(false));
}
