import { renderCard } from '../../components/Card.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppButton } from '../../components/button/app-button.js';
import { salesService } from '../../modules/sales/sales-service.js';

let currentSort = ['saleDate', 'desc'];
let currentPage = 1;
let currentSearch = '';
let currentPaymentStatus = '';
const PAGE_SIZE = 10;

function formatCurrency(n) {
  const num = Number(n) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

function paymentBadge(status) {
  const map = {
    paid: 'bg-success',
    partial: 'bg-warning text-dark',
    unpaid: 'bg-danger',
    refunded: 'bg-secondary',
  };
  const labels = {
    paid: 'Lunas',
    partial: 'Sebagian',
    unpaid: 'Belum Dibayar',
    refunded: 'Dikembalikan',
  };
  return `<span class="badge ${map[status] || 'bg-secondary'} px-2 py-1" style="font-size:11px">${labels[status] || status}</span>`;
}

export async function init(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header d-flex flex-wrap justify-content-between align-items-center mb-4';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Penjualan</h1>
      <p class="page-subtitle">Riwayat transaksi penjualan</p>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement('div');
  toolbar.className = 'd-flex flex-wrap gap-2 mb-3 align-items-center';
  toolbar.innerHTML = `
    <div class="input-group" style="max-width:320px">
      <span class="input-group-text bg-white" style="border-right:none"><i class="bi bi-search text-muted"></i></span>
      <input type="text" id="sales-search" class="form-control" placeholder="Cari invoice atau pelanggan..." style="border-left:none;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
    </div>
    <select id="filter-payment" class="form-select form-select-sm" style="max-width:150px;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      <option value="">Semua Status</option>
      <option value="paid">Lunas</option>
      <option value="partial">Sebagian</option>
      <option value="unpaid">Belum Dibayar</option>
      <option value="refunded">Dikembalikan</option>
    </select>
  `;
  container.appendChild(toolbar);

  const searchInput = document.getElementById('sales-search');
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value;
      currentPage = 1;
      loadTable();
    }, 300);
  });

  document.getElementById('filter-payment').addEventListener('change', (e) => {
    currentPaymentStatus = e.target.value;
    currentPage = 1;
    loadTable();
  });

  const cardWrapper = document.createElement('div');
  cardWrapper.id = 'sales-table-wrapper';
  container.appendChild(cardWrapper);

  await loadTable();
}

async function loadTable() {
  const wrapper = document.getElementById('sales-table-wrapper');
  wrapper.innerHTML = '<div class="d-flex justify-content-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div></div>';

  const result = await salesService.getAll({
    search: currentSearch,
    sort: currentSort,
    pagination: { page: currentPage, pageSize: PAGE_SIZE },
    paymentStatus: currentPaymentStatus || undefined,
  });

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice', sortable: true, render: (v, r) => {
      const el = document.createElement('span');
      el.className = 'fw-medium'; el.style.color = 'var(--color-primary-500)';
      el.textContent = v; return el;
    }},
    { key: 'customerName', label: 'Pelanggan', sortable: true },
    { key: 'saleDate', label: 'Tanggal', sortable: true, render: (v) => {
      const el = document.createElement('span');
      el.textContent = v ? new Date(v).toLocaleDateString('id-ID') : '-';
      return el;
    }},
    { key: 'grandTotal', label: 'Total', align: 'right', render: (v) => {
      const el = document.createElement('span'); el.className = 'fw-medium'; el.textContent = formatCurrency(v); return el;
    }},
    { key: 'paymentStatus', label: 'Status Bayar', render: (v) => {
      const el = document.createElement('span'); el.innerHTML = paymentBadge(v); return el;
    }},
    { key: 'paymentMethod', label: 'Metode', render: (v) => {
      const map = { cash: 'Tunai', transfer: 'Transfer', qris: 'QRIS', card: 'Kartu' };
      const el = document.createElement('span');
      el.textContent = map[v] || v || '-';
      el.style.fontSize = '12px';
      return el;
    }},
  ];

  const actions = [
    { key: 'view', icon: 'bi-eye', label: 'Lihat', color: 'var(--color-primary-500)', onClick: (row) => viewDetail(row) },
    { key: 'delete', icon: 'bi-trash', label: 'Hapus', color: '#ef4444', onClick: (row) => confirmDelete(row) },
  ];

  const card = renderCard({
    title: 'Riwayat Penjualan',
    body: '',
    headerRight: `<span class="text-muted" style="font-size:13px">${result.total} item</span>`,
  });

  const tableWrapper = card.querySelector('.dashboard-card-body');
  const tableContainer = document.createElement('div');
  const table = AppTable({ columns, data: result.data, sortable: true, actions, emptyText: 'Belum ada transaksi penjualan.', onSort: (field, order) => {
    currentSort = [field, order];
    currentPage = 1;
    loadTable();
  }});
  tableContainer.appendChild(table);
  tableWrapper.appendChild(tableContainer);

  if (result.totalPages > 1) {
    const pagination = document.createElement('div');
    pagination.className = 'd-flex align-items-center justify-content-between mt-3';
    pagination.innerHTML = `
      <span class="text-muted" style="font-size:13px">Halaman ${result.page} dari ${result.totalPages}</span>
      <div class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-secondary" id="page-prev" ${result.page <= 1 ? 'disabled' : ''}><i class="bi bi-chevron-left"></i></button>
        <span class="d-flex align-items-center px-2 fw-medium" style="font-size:14px">${result.page}</span>
        <button class="btn btn-sm btn-outline-secondary" id="page-next" ${result.page >= result.totalPages ? 'disabled' : ''}><i class="bi bi-chevron-right"></i></button>
      </div>
    `;
    tableWrapper.appendChild(pagination);

    pagination.querySelector('#page-prev').addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; loadTable(); }
    });
    pagination.querySelector('#page-next').addEventListener('click', () => {
      if (currentPage < result.totalPages) { currentPage++; loadTable(); }
    });
  }

  wrapper.innerHTML = '';
  wrapper.appendChild(card);
}

async function viewDetail(sale) {
  const full = await salesService.getById(sale.id);
  if (!full) return;

  const content = document.createElement('div');
  const itemsHtml = (full.items || []).map(item => `
    <tr>
      <td class="text-sm">${item.productName || '-'}</td>
      <td class="text-sm text-end">${item.quantity || 0}</td>
      <td class="text-sm text-end">${formatCurrency(item.unitPrice || 0)}</td>
      <td class="text-sm text-end fw-medium">${formatCurrency(item.subtotal || 0)}</td>
    </tr>
  `).join('');

  const paymentsHtml = (full.payments || []).map(p => `
    <tr>
      <td class="text-sm">${p.method || '-'}</td>
      <td class="text-sm text-end">${formatCurrency(p.amount || 0)}</td>
    </tr>
  `).join('');

  content.innerHTML = `
    <div class="row g-2 mb-2">
      <div class="col-6">
        <div class="text-sm text-muted">Invoice</div>
        <div class="fw-medium">${full.invoiceNumber}</div>
      </div>
      <div class="col-6 text-end">
        <div class="text-sm text-muted">Status</div>
        <div>${paymentBadge(full.paymentStatus)}</div>
      </div>
      <div class="col-6">
        <div class="text-sm text-muted">Pelanggan</div>
        <div class="fw-medium">${full.customerName || 'Umum'}</div>
      </div>
      <div class="col-6 text-end">
        <div class="text-sm text-muted">Tanggal</div>
        <div>${full.saleDate ? new Date(full.saleDate).toLocaleDateString('id-ID') : '-'}</div>
      </div>
    </div>
    <hr class="my-2">
    <div class="fw-medium text-sm mb-1" style="color:var(--color-text-heading)">Item</div>
    <table class="table table-sm mb-0">
      <thead>
        <tr>
          <th class="text-sm">Barang</th>
          <th class="text-sm text-end">Qty</th>
          <th class="text-sm text-end">Harga</th>
          <th class="text-sm text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemsHtml || '<tr><td colspan="4" class="text-center text-muted text-sm">Tidak ada item</td></tr>'}</tbody>
    </table>
    ${paymentsHtml ? `
    <hr class="my-2">
    <div class="fw-medium text-sm mb-1" style="color:var(--color-text-heading)">Pembayaran</div>
    <table class="table table-sm mb-0">
      <thead>
        <tr>
          <th class="text-sm">Metode</th>
          <th class="text-sm text-end">Jumlah</th>
        </tr>
      </thead>
      <tbody>${paymentsHtml}</tbody>
    </table>` : ''}
    <hr class="my-2">
    <div class="d-flex justify-content-end">
      <div class="text-end">
        <div class="text-sm text-muted">Subtotal: ${formatCurrency(full.subtotal)}</div>
        <div class="fw-medium" style="font-size:15px">Grand Total: ${formatCurrency(full.grandTotal)}</div>
      </div>
    </div>
  `;

  AppModal({ title: 'Detail Penjualan: ' + full.invoiceNumber, content, size: 'lg', footer: [] });
}

function confirmDelete(sale) {
  AppConfirmDialog({
    title: 'Hapus Transaksi',
    message: `Yakin ingin menghapus invoice <strong>${sale.invoiceNumber}</strong>?`,
    confirmText: 'Ya, Hapus',
    variant: 'danger',
    onConfirm: async () => {
      await salesService.delete(sale.id);
      await loadTable();
    },
  });
}
