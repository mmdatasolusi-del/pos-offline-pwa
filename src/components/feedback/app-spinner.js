const LOADER_ID = 'page-loader';

export function renderPageLoader() {
  const loader = document.createElement('div');
  loader.id = LOADER_ID;
  loader.className = 'page-loader d-none';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Memuat halaman');
  loader.innerHTML = `<div class="page-loader-spinner">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Memuat...</span>
    </div>
  </div>`;
  return loader;
}

export function showPageLoader() {
  const el = document.getElementById(LOADER_ID);
  if (el) el.classList.remove('d-none');
}

export function hidePageLoader() {
  const el = document.getElementById(LOADER_ID);
  if (el) el.classList.add('d-none');
}
