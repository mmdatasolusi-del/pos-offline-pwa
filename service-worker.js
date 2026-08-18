const CACHE_VERSION = 'v4';

const APP_CACHE = `pos-app-${CACHE_VERSION}`;
const CDN_CACHE = `pos-cdn-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `pos-dynamic-${CACHE_VERSION}`;

const VALID_CACHES = [APP_CACHE, CDN_CACHE, DYNAMIC_CACHE];

const APP_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/pwa/offline.html',
  '/src/pwa/icons/icon-192.svg',
  '/src/pwa/icons/icon-512.svg',
  '/src/pwa/pwa-config.js',
  '/src/pwa/pwa-cache-manager.js',
  '/src/pwa/pwa-register.js',
  '/src/pwa/pwa-install.js',
  '/src/pwa/pwa-service.js',
  '/src/pwa/manifest.js',
  '/src/app/app.js',
  '/src/app/bootstrap.js',
  '/src/config/app.config.js',
  '/src/config/db.config.js',
  '/src/config/theme.config.js',
  '/src/utils/logger.js',
  '/src/utils/error-handler.js',
  '/src/utils/id-utils.js',
  '/src/utils/hash-utils.js',
  '/src/database/db.js',
  '/src/database/schema.js',
  '/src/database/migrations.js',
  '/src/database/seeds.js',
  '/src/database/database-manager.js',
  '/src/database/backup.js',
  '/src/database/restore.js',
  '/src/repositories/base-repository.js',
  '/src/services/theme-service.js',
  '/src/services/auth-service.js',
  '/src/services/idle-service.js',
  '/src/auth/session.js',
  '/src/auth/login.js',
  '/src/auth/auth.js',
  '/src/components/Sidebar.js',
  '/src/components/Topbar.js',
  '/src/components/LoginForm.js',
  '/src/components/KPI.js',
  '/src/components/Card.js',
  '/src/pages/LoginPage.js',
  '/src/pages/Dashboard.js',
  '/src/pages/FirstRunPage.js',
  '/src/layouts/AppLayout.js',
  '/src/router/router.js',
  '/src/router/guards.js',
  '/src/helpers/export-helper.js',
  '/src/helpers/import-helper.js',
  '/src/styles/variables.css',
  '/src/styles/base.css',
  '/src/styles/theme.css',
  '/src/styles/layout.css',
  '/src/styles/components.css',
  '/src/styles/utilities.css',
  '/src/styles/sidebar.css',
  '/src/styles/topbar.css',
  '/src/styles/dashboard.css',
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/dexie@4.0.10/dist/dexie.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
];

async function cacheAppAssets() {
  const cache = await caches.open(APP_CACHE);
  await cache.addAll(APP_ASSETS);
}

async function cacheCdnAssets() {
  const cache = await caches.open(CDN_CACHE);
  await Promise.allSettled(
    CDN_ASSETS.map(url =>
      cache.add(url).catch(() => {})
    )
  );
}

async function cleanupCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter(key => !VALID_CACHES.includes(key))
      .map(key => caches.delete(key))
  );
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then(response => {
        if (response.ok) {
          caches.open(cacheName).then(cache => cache.put(request, response));
        }
      })
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (request.mode === 'navigate') {
      return caches.match('/src/pwa/offline.html');
    }
    return new Response('', { status: 408 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('/src/pwa/offline.html');
    }
    return new Response('', { status: 408 });
  }
}

function isAppOrigin(url) {
  return url.origin === self.location.origin;
}

function isCDNOrigin(url) {
  return /cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.origin);
}

function isAppAsset(url) {
  if (!isAppOrigin(url)) return false;
  const path = url.pathname;
  return (
    path === '/' ||
    path === '/index.html' ||
    path === '/manifest.json' ||
    path.startsWith('/src/')
  );
}

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      cacheAppAssets(),
      cacheCdnAssets(),
    ]).then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      cleanupCaches(),
      self.clients.claim(),
    ])
  );
});

// Update flow
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (isCDNOrigin(url)) {
    event.respondWith(cacheFirst(request, CDN_CACHE));
    return;
  }

  if (isAppAsset(url)) {
    // Navigasi: Network First agar build baru langsung digunakan.
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
      event.respondWith(networkFirst(request));
    } else {
      // Asset statis: Cache First.
      event.respondWith(cacheFirst(request, APP_CACHE));
    }
    return;
  }

  event.respondWith(networkFirst(request));
});
