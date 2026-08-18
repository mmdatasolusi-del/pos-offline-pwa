import { APP_CONFIG } from '../config/app.config.js';
import { initLogger } from '../utils/logger.js';
import { initErrorHandler } from '../utils/error-handler.js';
import { DatabaseManager } from '../database/database-manager.js';
import { initPWA } from '../pwa/pwa-service.js';
import { renderAppLayout } from '../layouts/AppLayout.js';
import { initTheme } from '../services/theme-service.js';

export async function bootstrap() {
  initTheme();
  initLogger(APP_CONFIG);
  initErrorHandler();

  const dbManager = new DatabaseManager();
  await dbManager.initialize();

  initPWA();

  await renderAppLayout();

  document.documentElement.setAttribute('data-app', 'ready');
  console.log('[BOOTSTRAP] POS Offline PWA v' + APP_CONFIG.version + ' started');
}
