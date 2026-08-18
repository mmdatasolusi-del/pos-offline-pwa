export function getManifestInfo() {
  const link = document.querySelector('link[rel="manifest"]');
  if (!link) return null;
  return { href: link.href };
}

export function isInstallable() {
  return 'BeforeInstallPromptEvent' in window;
}

export function getDisplayMode() {
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  return 'browser';
}
