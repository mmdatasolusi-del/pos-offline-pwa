import { renderCard } from '../../components/Card.js';
import { AppTable } from '../../components/table/app-table.js';
import { reportService } from '../../modules/report/report-service.js';

function formatCurrency(n) {
  const num = Number(n) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function monthStart() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
}

function summaryCard(icon, label, value, sub, color = 'var(--color-primary-500)') {
  const card = document.createElement('div');
  card.className = 'dashboard-card';
  card.innerHTML = `
    <div class="dashboard-card-body d-flex align-items-center gap-3">
      <div class="d-flex align-items-center justify-content-center rounded-3" style="width:48px;height:48px;background:${color}15;color:${color};font-size:22px">
        <i class="bi ${icon}"></i>
      </div>
      <div>
        <div class="text-muted text-sm">${label}</div>
        <div class="fw-bold" style="font-size:18px;color:var(--color-text-heading)">${value}</div>
        ${sub ? `<div class="text-muted text-sm">${sub}</div>` : ''}
      </div>
    </div>
  `;
  return card;
}

export async function init(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header d-flex flex-wrap justify-content-between align-items-center mb-4';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Laporan</h1>
      <p class="page-subtitle">Ringkasan penjualan, stok, dan keuangan</p>
    </div>
  `;
  container.appendChild(header);

  const dateFilter = document.createElement('div');
  dateFilter.className = 'd-flex gap-2 mb-3 align-items-center';
  dateFilter.innerHTML = `
    <label class="text-sm text-muted me-1">Periode:</label>
    <input type="date" id="report-from" class="form-control form-control-sm" style="max-width:160px;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)" value="${monthStart()}">
    <span class="text-muted">s/d</span>
    <input type="date" id="report-to" class="form-control form-control-sm" style="max-width:160px;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)" value="${todayStr()}">
    <button id="btn-refresh" class="btn btn-sm btn-outline-primary"><i class="bi bi-arrow-clockwise me-1"></i>Muat Ulang</button>
  `;
  container.appendChild(dateFilter);

  const summaryGrid = document.createElement('div');
  summaryGrid.id = 'report-summary';
  summaryGrid.className = 'row g-3 mb-4';
  container.appendChild(summaryGrid);

  const detailSection = document.createElement('div');
  detailSection.id = 'report-detail';
  container.appendChild(detailSection);

  document.getElementById('btn-refresh').addEventListener('click', loadReports);

  await loadReports();
}

async function loadReports() {
  const fromDate = document.getElementById('report-from').value;
  const toDate = document.getElementById('report-to').value;

  const [salesSummary, purchaseSummary, stockSummary, topProducts] = await Promise.all([
    reportService.getSalesSummary(fromDate, toDate),
    reportService.getPurchaseSummary(fromDate, toDate),
    reportService.getStockSummary(),
    reportService.getTopProducts(10),
  ]);

  const summaryGrid = document.getElementById('report-summary');
  summaryGrid.innerHTML = '';

  const salesRow = document.createElement('div');
  salesRow.className = 'col-12 mb-2';
  salesRow.innerHTML = '<h5 class="fw-semibold mb-0" style="color:var(--color-text-heading)">Penjualan</h5>';
  summaryGrid.appendChild(salesRow);

  const salesGrid = document.createElement('div');
  salesGrid.className = 'row g-2';
  salesGrid.innerHTML = `
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
  `;
  salesGrid.children[0].appendChild(summaryCard('bi-receipt', 'Total Transaksi', salesSummary.totalSales, '', '#3b82f6'));
  salesGrid.children[1].appendChild(summaryCard('bi-cash-stack', 'Total Pendapatan', formatCurrency(salesSummary.totalRevenue), '', '#22c55e'));
  salesGrid.children[2].appendChild(summaryCard('bi-check-circle', 'Lunas', salesSummary.paidCount, '', '#22c55e'));
  salesGrid.children[3].appendChild(summaryCard('bi-exclamation-circle', 'Belum Lunas', salesSummary.unpaidCount, '', '#f59e0b'));
  summaryGrid.appendChild(salesGrid);

  const purchaseRow = document.createElement('div');
  purchaseRow.className = 'col-12 mb-2 mt-2';
  purchaseRow.innerHTML = '<h5 class="fw-semibold mb-0" style="color:var(--color-text-heading)">Pembelian</h5>';
  summaryGrid.appendChild(purchaseRow);

  const purchaseGrid = document.createElement('div');
  purchaseGrid.className = 'row g-2';
  purchaseGrid.innerHTML = `
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
  `;
  purchaseGrid.children[0].appendChild(summaryCard('bi-bag', 'Total PO', purchaseSummary.totalPurchases, '', '#8b5cf6'));
  purchaseGrid.children[1].appendChild(summaryCard('bi-cash', 'Total Pengeluaran', formatCurrency(purchaseSummary.totalSpent), '', '#ef4444'));
  purchaseGrid.children[2].appendChild(summaryCard('bi-clock', 'Menunggu', purchaseSummary.pendingCount, '', '#f59e0b'));
  purchaseGrid.children[3].appendChild(summaryCard('bi-check-all', 'Diterima', purchaseSummary.receivedCount, '', '#22c55e'));
  summaryGrid.appendChild(purchaseGrid);

  const stockRow = document.createElement('div');
  stockRow.className = 'col-12 mb-2 mt-2';
  stockRow.innerHTML = '<h5 class="fw-semibold mb-0" style="color:var(--color-text-heading)">Stok</h5>';
  summaryGrid.appendChild(stockRow);

  const stockGrid = document.createElement('div');
  stockGrid.className = 'row g-2';
  stockGrid.innerHTML = `
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
    <div class="col-md-3 col-6"></div>
  `;
  stockGrid.children[0].appendChild(summaryCard('bi-box', 'Total Produk', stockSummary.totalProducts, '', '#3b82f6'));
  stockGrid.children[1].appendChild(summaryCard('bi-exclamation-triangle', 'Stok Menipis', stockSummary.lowStock.length, `< ${stockSummary.lowStock.length > 0 ? 'Perlu re-stok' : 'Aman'}`, '#f59e0b'));
  stockGrid.children[2].appendChild(summaryCard('bi-x-circle', 'Stok Habis', stockSummary.outOfStock.length, '', '#ef4444'));
  stockGrid.children[3].appendChild(summaryCard('bi-currency-dollar', 'Nilai Stok', formatCurrency(stockSummary.totalStockValue), formatCurrency(stockSummary.totalSellValue) + ' (jual)', '#22c55e'));
  summaryGrid.appendChild(stockGrid);

  const detail = document.getElementById('report-detail');
  detail.innerHTML = '';

  const detailGrid = document.createElement('div');
  detailGrid.className = 'row g-3 mt-1';

  const leftCol = document.createElement('div');
  leftCol.className = 'col-md-6';

  if (topProducts.length > 0) {
    const topCard = renderCard({
      title: 'Produk Terlaris',
      body: '',
    });
    const topBody = topCard.querySelector('.dashboard-card-body');
    const topColumns = [
      { key: 'sku', label: 'Kode' },
      { key: 'productName', label: 'Nama' },
      { key: 'qty', label: 'Terjual', align: 'right' },
      { key: 'revenue', label: 'Pendapatan', align: 'right', render: (v) => {
        const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
      }},
    ];
    const topTable = AppTable({ columns: topColumns, data: topProducts, emptyText: 'Belum ada data penjualan', className: 'mb-0' });
    topBody.appendChild(topTable);
    leftCol.appendChild(topCard);
  }

  const rightCol = document.createElement('div');
  rightCol.className = 'col-md-6';

  if (stockSummary.lowStock.length > 0) {
    const alertCard = renderCard({
      title: 'Peringatan Stok',
      body: '',
    });
    const alertBody = alertCard.querySelector('.dashboard-card-body');
    const alertItems = stockSummary.lowStock.slice(0, 10).map(p => `
      <div class="d-flex justify-content-between align-items-center py-1 border-bottom" style="border-color:var(--color-border)">
        <div>
          <span class="fw-medium text-sm">${p.name}</span>
          <span class="text-muted text-sm ms-2">${p.sku}</span>
        </div>
        <div>
          <span class="text-sm ${Number(p.stock) === 0 ? 'text-danger' : 'text-warning'}">${p.stock} / ${p.minStock}</span>
        </div>
      </div>
    `).join('');
    alertBody.innerHTML = alertItems;
    rightCol.appendChild(alertCard);
  }

  const stockByCatData = Object.entries(stockSummary.stockByCategory).map(([name, data]) => ({
    category: name,
    count: data.count,
    stockValue: data.stockValue,
    sellValue: data.sellValue,
  }));

  if (stockByCatData.length > 0) {
    const catCard = renderCard({
      title: 'Stok per Kategori',
      body: '',
    });
    const catBody = catCard.querySelector('.dashboard-card-body');
    const catColumns = [
      { key: 'category', label: 'Kategori' },
      { key: 'count', label: 'Produk', align: 'right' },
      { key: 'stockValue', label: 'Nilai Modal', align: 'right', render: (v) => {
        const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
      }},
      { key: 'sellValue', label: 'Nilai Jual', align: 'right', render: (v) => {
        const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
      }},
    ];
    const catTable = AppTable({ columns: catColumns, data: stockByCatData, emptyText: 'Tidak ada data' });
    catBody.appendChild(catTable);
    rightCol.appendChild(catCard);
  }

  detailGrid.appendChild(leftCol);
  detailGrid.appendChild(rightCol);
  detail.appendChild(detailGrid);
}
