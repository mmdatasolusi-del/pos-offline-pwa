import { bootstrap } from './bootstrap.js';

let reloadedForUpdate = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (reloadedForUpdate) return;
  reloadedForUpdate = true;
  window.location.reload();
});

document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});
