export function init(container) {
  container.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 text-center">
      <h1 class="display-1 fw-bold mb-0" style="font-size:6rem;color:var(--color-gray-200)">404</h1>
      <h2 class="h4 fw-semibold mb-2" style="color:var(--color-text-heading)">Halaman Tidak Ditemukan</h2>
      <p class="text-muted mb-4" style="max-width:400px">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <div class="d-flex gap-2">
        <a href="#/" class="btn btn-primary">
          <i class="bi bi-speedometer2 me-1"></i> Ke Dashboard
        </a>
        <button type="button" class="btn btn-outline-secondary" onclick="window.history.back()">
          <i class="bi bi-arrow-left me-1"></i> Kembali
        </button>
      </div>
    </div>
  `;
}
