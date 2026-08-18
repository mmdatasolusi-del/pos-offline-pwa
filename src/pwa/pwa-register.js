const SW_PATH = '/service-worker.js';

class PWARegister {
  #registration = null;
  #status = 'unsupported';

  get status() {
    return this.#status;
  }

  get registration() {
    return this.#registration;
  }

  async register() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker not supported');
      this.#status = 'unsupported';
      return null;
    }

    try {
      console.log('[PWA] Registering Service Worker...');

      this.#registration = await navigator.serviceWorker.register(SW_PATH, {
        scope: '/',
      });

      this.#registration.addEventListener('updatefound', () => {
        const installing = this.#registration.installing;
        if (installing) {
          console.log('[PWA] New Service Worker installing...');

          installing.addEventListener('statechange', () => {
            switch (installing.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available — will activate on next load');
                } else {
                  console.log('[PWA] Cache ready');
                }
                break;
              case 'activated':
                console.log('[PWA] Service Worker activated');
                // Update SW yang sedang dipakai oleh page -> muat ulang agar build baru
                // langsung digunakan (aman untuk first-run karena controller masih null saat itu).
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] Reloading to apply new build');
                  window.location.reload();
                }
                break;
              case 'redundant':
                console.log('[PWA] Service Worker became redundant');
                break;
            }
          });
        }
      });

      if (this.#registration.active) {
        this.#status = 'active';
        console.log('[PWA] Service Worker registered');
      }

      return this.#registration;
    } catch (error) {
      this.#status = 'error';
      console.error('[PWA] Service Worker registration failed:', error.message);
      return null;
    }
  }

  async unregister() {
    if (!this.#registration) return false;
    try {
      const result = await this.#registration.unregister();
      if (result) {
        this.#registration = null;
        this.#status = 'unregistered';
        console.log('[PWA] Service Worker unregistered');
      }
      return result;
    } catch (error) {
      console.error('[PWA] Unregister failed:', error);
      return false;
    }
  }

  async update() {
    if (!this.#registration) return false;
    try {
      await this.#registration.update();
      console.log('[PWA] Checking for Service Worker update...');
      return true;
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
      return false;
    }
  }

  getController() {
    return navigator.serviceWorker.controller;
  }

  isControlled() {
    return !!navigator.serviceWorker.controller;
  }
}

const pwaRegister = new PWARegister();
export { pwaRegister, PWARegister };
