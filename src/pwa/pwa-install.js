class PWAInstall {
  #deferredPrompt = null;
  #installed = false;

  constructor() {
    this.#checkInstalled();
    this.#listen();
  }

  get canInstall() {
    return this.#deferredPrompt !== null;
  }

  get isInstalled() {
    return this.#installed;
  }

  #checkInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.#installed = true;
    }
  }

  #listen() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.#deferredPrompt = event;
      console.log('[PWA] Install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      this.#installed = true;
      this.#deferredPrompt = null;
      console.log('[PWA] Application installed');
    });
  }

  async showPrompt() {
    if (!this.#deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      this.#deferredPrompt.prompt();
      const result = await this.#deferredPrompt.userChoice;
      this.#deferredPrompt = null;

      if (result.outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        return true;
      }
      console.log('[PWA] User dismissed installation');
      return false;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      this.#deferredPrompt = null;
      return false;
    }
  }

  clearPrompt() {
    this.#deferredPrompt = null;
  }
}

const pwaInstall = new PWAInstall();
export { pwaInstall, PWAInstall };
