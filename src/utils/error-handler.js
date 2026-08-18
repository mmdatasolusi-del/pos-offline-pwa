import { logger } from './logger.js';

function renderErrorUI(error) {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 text-center">
      <i class="bi bi-exclamation-triangle" style="font-size:3rem;color:var(--color-danger-500);margin-bottom:1rem"></i>
      <h1 class="fs-4 fw-bold" style="color:var(--color-text-heading);margin-bottom:0.5rem">Terjadi Kesalahan</h1>
      <p class="text-muted mb-4" style="max-width:400px">${error?.message || 'Terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.'}</p>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" onclick="window.location.reload()">Muat Ulang</button>
      </div>
    </div>
  `;
}

export function initErrorHandler() {
  window.onerror = function (msg, source, line, col, error) {
    logger.error('Uncaught error:', msg, error);
    renderErrorUI(error || new Error(msg));
    return true;
  };

  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    logger.error('Unhandled rejection:', reason);
    renderErrorUI(reason instanceof Error ? reason : new Error(String(reason)));
  });
}
