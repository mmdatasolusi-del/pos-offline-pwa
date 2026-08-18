export function init(container) {
  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1" style="color:var(--color-text-heading)">Dashboard</h1>
        <p class="text-muted mb-0">Ringkasan bisnis Anda hari ini</p>
      </div>
    </div>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle bg-primary-50 d-flex align-items-center justify-content-center" style="width:48px;height:48px">
                <i class="bi bi-cart3 fs-5" style="color:var(--color-primary-500)"></i>
              </div>
              <div>
                <p class="text-muted text-sm mb-0">Penjualan Hari Ini</p>
                <h4 class="fw-bold mb-0" style="color:var(--color-text-heading)">Rp 0</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:48px;height:48px;background-color:var(--color-success-50)">
                <i class="bi bi-check-circle fs-5" style="color:var(--color-success-500)"></i>
              </div>
              <div>
                <p class="text-muted text-sm mb-0">Transaksi</p>
                <h4 class="fw-bold mb-0" style="color:var(--color-text-heading)">0</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:48px;height:48px;background-color:var(--color-warning-50)">
                <i class="bi bi-box fs-5" style="color:var(--color-warning-500)"></i>
              </div>
              <div>
                <p class="text-muted text-sm mb-0">Produk</p>
                <h4 class="fw-bold mb-0" style="color:var(--color-text-heading)">—</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:48px;height:48px;background-color:var(--color-danger-50)">
                <i class="bi bi-exclamation-triangle fs-5" style="color:var(--color-danger-500)"></i>
              </div>
              <div>
                <p class="text-muted text-sm mb-0">Stok Menipis</p>
                <h4 class="fw-bold mb-0" style="color:var(--color-text-heading)">—</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-hourglass-split fs-1 text-muted mb-3 d-block"></i>
        <h5 class="fw-semibold" style="color:var(--color-text-heading)">Dashboard — Coming Soon</h5>
        <p class="text-muted mb-0">Data penjualan dan statistik akan muncul di sini setelah modul POS diimplementasikan.</p>
      </div>
    </div>
  `;
}
