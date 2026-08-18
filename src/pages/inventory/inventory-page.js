export function init(container) {
  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1" style="color:var(--color-text-heading)">Inventori</h1>
        <p class="text-muted mb-0">Overview stok dan pergerakan barang</p>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-archive fs-1 text-muted mb-3 d-block"></i>
        <h5 class="fw-semibold" style="color:var(--color-text-heading)">Inventori — Coming Soon</h5>
        <p class="text-muted mb-3">Fitur ini akan tersedia di fase pengembangan selanjutnya.</p>
        <span class="badge bg-warning text-dark px-3 py-2">Dalam Pengembangan</span>
      </div>
    </div>
  `;
}
