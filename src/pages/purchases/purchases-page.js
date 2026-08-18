import { renderCard } from '../../components/Card.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppButton } from '../../components/button/app-button.js';
import { purchaseService } from '../../modules/purchase/purchase-service.js';

let currentSort = ['orderDate', 'desc'];
let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
const PAGE_SIZE = 10;

function formatCurrency(n) {
  const num = Number(n) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

function statusBadge(status) {
  const map = {
    draft: 'bg-secondary',
    ordered: 'bg-primary',
    received: 'bg-success',
    cancelled: 'bg-danger',
  };
  const labels = {
    draft: 'Draft',
    ordered: 'Dipesan',
    received: 'Diterima',
    cancelled: 'Dibatalkan',
  };
  return `<span class="badge ${map[status] || 'bg-secondary'} px-2 py-1" style="font-size:11px">${labels[status] || status}</span>`;
}

export async function init(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header d-flex flex-wrap justify-content-between align-items-center mb-4';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Pembelian</h1>
      <p class="page-subtitle">Manajemen purchase order dan penerimaan barang</p>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement('div');
  toolbar.className = 'd-flex flex-wrap gap-2 mb-3 align-items-center';
  toolbar.innerHTML = `
    <div class="input-group" style="max-width:320px">
      <span class="input-group-text bg-white" style="border-right:none"><i class="bi bi-search text-muted"></i></span>
      <input type="text" id="purchase-search" class="form-control" placeholder="Cari nomor PO atau supplier..." style="border-left:none;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
    </div>
    <select id="filter-status" class="form-select form-select-sm" style="max-width:150px;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      <option value="">Semua Status</option>
      <option value="draft">Draft</option>
      <option value="ordered">Dipesan</option>
      <option value="received">Diterima</option>
      <option value="cancelled">Dibatalkan</option>
    </select>
  `;

  const btnAdd = AppButton({ label: 'Buat PO', icon: 'bi-plus-circle', variant: 'primary', size: 'sm' });
  btnAdd.addEventListener('click', () => showForm(null));
  toolbar.appendChild(btnAdd);

  container.appendChild(toolbar);

  const searchInput = document.getElementById('purchase-search');
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value;
      currentPage = 1;
      loadTable();
    }, 300);
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    currentStatus = e.target.value;
    currentPage = 1;
    loadTable();
  });

  const cardWrapper = document.createElement('div');
  cardWrapper.id = 'purchase-table-wrapper';
  container.appendChild(cardWrapper);

  await loadTable();
}

async function loadTable() {
  const wrapper = document.getElementById('purchase-table-wrapper');
  wrapper.innerHTML = '<div class="d-flex justify-content-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div></div>';

  const result = await purchaseService.getAll({
    search: currentSearch,
    sort: currentSort,
    pagination: { page: currentPage, pageSize: PAGE_SIZE },
    status: currentStatus || undefined,
  });

  const columns = [
    { key: 'poNumber', label: 'No. PO', sortable: true, render: (v, r) => {
      const el = document.createElement('span');
      el.className = 'fw-medium'; el.style.color = 'var(--color-primary-500)';
      el.textContent = v; return el;
    }},
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { key: 'orderDate', label: 'Tanggal', sortable: true, render: (v) => {
      const el = document.createElement('span');
      el.textContent = v ? new Date(v).toLocaleDateString('id-ID') : '-';
      return el;
    }},
    { key: 'subtotal', label: 'Subtotal', align: 'right', render: (v) => {
      const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
    }},
    { key: 'grandTotal', label: 'Total', align: 'right', render: (v) => {
      const el = document.createElement('span'); el.className = 'fw-medium'; el.textContent = formatCurrency(v); return el;
    }},
    { key: 'status', label: 'Status', render: (v) => {
      const el = document.createElement('span'); el.innerHTML = statusBadge(v); return el;
    }},
  ];

  const actions = [
    { key: 'view', icon: 'bi-eye', label: 'Lihat', color: 'var(--color-primary-500)', onClick: (row) => viewDetail(row) },
    { key: 'receive', icon: 'bi-check-circle', label: 'Terima', color: '#22c55e', onClick: (row) => receiveGoods(row) },
    { key: 'delete', icon: 'bi-trash', label: 'Hapus', color: '#ef4444', onClick: (row) => confirmDelete(row) },
  ];

  const card = renderCard({
    title: 'Daftar Purchase Order',
    body: '',
    headerRight: `<span class="text-muted" style="font-size:13px">${result.total} item</span>`,
  });

  const tableWrapper = card.querySelector('.dashboard-card-body');
  const tableContainer = document.createElement('div');
  const table = AppTable({ columns, data: result.data, sortable: true, actions, emptyText: 'Belum ada pembelian. Klik "Buat PO" untuk membuat purchase order baru.', onSort: (field, order) => {
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

function showForm(purchase) {
  const isEdit = !!purchase;
  const title = 'Buat Purchase Order';

  let suppliers = [];
  let products = [];
  let lineItems = [];

  const content = document.createElement('div');
  content.innerHTML = `
    <form id="po-form" novalidate>
      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Pemasok <span class="text-danger">*</span></label>
          <select id="f-supplier" class="form-select form-select-sm" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
            <option value="">-- Pilih Pemasok --</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Tanggal</label>
          <input type="date" id="f-date" class="form-control form-control-sm" value="${new Date().toISOString().split('T')[0]}" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Catatan</label>
        <textarea id="f-notes" class="form-control form-control-sm" rows="2" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)"></textarea>
      </div>

      <hr class="my-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-medium text-sm" style="color:var(--color-text-heading)">Item Barang</span>
        <button type="button" id="btn-add-item" class="btn btn-outline-primary btn-sm"><i class="bi bi-plus-circle me-1"></i>Tambah Item</button>
      </div>

      <div id="items-container">
        <div class="text-center text-muted py-3 text-sm" id="items-empty">Belum ada item. Klik "Tambah Item" untuk menambahkan barang.</div>
      </div>

      <div class="d-flex justify-content-end mt-2 pt-2 border-top" style="border-color:var(--color-border)">
        <div class="text-end">
          <div class="text-sm text-muted">Subtotal: <span id="subtotal-display" class="fw-medium" style="color:var(--color-text-heading)">Rp 0</span></div>
          <div class="fw-medium" style="font-size:15px;color:var(--color-text-heading)">Grand Total: <span id="total-display">Rp 0</span></div>
        </div>
      </div>

      <div id="form-errors" class="d-none mt-2"></div>
    </form>
  `;

  const footer = [];
  const cancelBtn = AppButton({ label: 'Batal', variant: 'outline', size: 'sm' });
  const saveBtn = AppButton({ label: 'Simpan PO', icon: 'bi-check-lg', variant: 'primary', size: 'sm' });
  footer.push(cancelBtn, saveBtn);

  const modal = AppModal({ title, content, size: 'xl', footer, onClose: () => {} });

  cancelBtn.addEventListener('click', () => modal.close());

  loadFormData();

  async function loadFormData() {
    [suppliers, products] = await Promise.all([
      purchaseService.getSuppliers(),
      purchaseService.getProducts(),
    ]);

    const select = document.getElementById('f-supplier');
    select.innerHTML = '<option value="">-- Pilih Pemasok --</option>' +
      suppliers.map(s => `<option value="${s.id}" data-name="${s.name}">${s.code} - ${s.name}</option>`).join('');
  }

  document.getElementById('btn-add-item').addEventListener('click', () => addItemRow());

  saveBtn.addEventListener('click', async () => {
    const supplierSelect = document.getElementById('f-supplier');
    const selectedOption = supplierSelect.options[supplierSelect.selectedIndex];
    const supplierName = selectedOption ? selectedOption.getAttribute('data-name') || '' : '';

    const itemRows = document.querySelectorAll('.po-item-row');
    const items = [];
    itemRows.forEach(row => {
      const productId = row.querySelector('.item-product').value;
      const productName = row.querySelector('.item-product').options[row.querySelector('.item-product').selectedIndex]?.text || '';
      const quantity = Number(row.querySelector('.item-qty').value) || 0;
      const unitPrice = Number(row.querySelector('.item-price').value) || 0;
      if (productId && quantity > 0) {
        items.push({ productId, productName, quantity, unitPrice, subtotal: quantity * unitPrice });
      }
    });

    const data = {
      supplierId: supplierSelect.value,
      supplierName,
      orderDate: document.getElementById('f-date').value,
      notes: document.getElementById('f-notes').value.trim(),
      items,
    };

    const result = await purchaseService.create(data);
    if (result.success) {
      modal.close();
      await loadTable();
    } else {
      const errDiv = document.getElementById('form-errors');
      errDiv.className = 'alert alert-danger py-2 px-3 mb-0 text-sm';
      errDiv.innerHTML = result.errors.map(e => `<div><i class="bi bi-exclamation-circle me-1"></i>${e}</div>`).join('');
    }
  });

  function addItemRow(productId, qty, price) {
    const container = document.getElementById('items-container');
    const empty = document.getElementById('items-empty');
    if (empty) empty.remove();

    const row = document.createElement('div');
    row.className = 'po-item-row row g-1 mb-1 align-items-center';
    row.innerHTML = `
      <div class="col-5">
        <select class="form-select form-select-sm item-product" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
          <option value="">-- Pilih Barang --</option>
          ${products.map(p => `<option value="${p.id}" ${p.id === productId ? 'selected' : ''}>${p.sku} - ${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="col-2">
        <input type="number" class="form-control form-control-sm item-qty" value="${qty || 1}" min="1" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      </div>
      <div class="col-3">
        <input type="number" class="form-control form-control-sm item-price" value="${price || 0}" min="0" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      </div>
      <div class="col-2 text-end">
        <button type="button" class="btn btn-sm btn-outline-danger border-0"><i class="bi bi-x-circle"></i></button>
      </div>
    `;

    row.querySelector('.btn-outline-danger').addEventListener('click', () => {
      row.remove();
      recalcTotal();
      if (container.querySelectorAll('.po-item-row').length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-3 text-sm" id="items-empty">Belum ada item. Klik "Tambah Item" untuk menambahkan barang.</div>';
      }
    });

    row.querySelectorAll('.item-qty, .item-price').forEach(el => {
      el.addEventListener('input', recalcTotal);
    });

    container.appendChild(row);
    recalcTotal();
  }

  function recalcTotal() {
    const rows = document.querySelectorAll('.po-item-row');
    let total = 0;
    rows.forEach(row => {
      const qty = Number(row.querySelector('.item-qty').value) || 0;
      const price = Number(row.querySelector('.item-price').value) || 0;
      total += qty * price;
    });
    document.getElementById('subtotal-display').textContent = formatCurrency(total);
    document.getElementById('total-display').textContent = formatCurrency(total);
  }
}

async function viewDetail(purchase) {
  const full = await purchaseService.getById(purchase.id);
  if (!full) return;

  const content = document.createElement('div');
  const itemsHtml = (full.items || []).map(item => `
    <tr>
      <td class="text-sm">${item.productName || '-'}</td>
      <td class="text-sm text-end">${item.quantity}</td>
      <td class="text-sm text-end">${formatCurrency(item.unitPrice)}</td>
      <td class="text-sm text-end fw-medium">${formatCurrency(item.subtotal)}</td>
    </tr>
  `).join('');

  content.innerHTML = `
    <div class="row g-2 mb-2">
      <div class="col-6">
        <div class="text-sm text-muted">No. PO</div>
        <div class="fw-medium">${full.poNumber}</div>
      </div>
      <div class="col-6 text-end">
        <div class="text-sm text-muted">Status</div>
        <div>${statusBadge(full.status)}</div>
      </div>
      <div class="col-6">
        <div class="text-sm text-muted">Supplier</div>
        <div class="fw-medium">${full.supplierName || '-'}</div>
      </div>
      <div class="col-6 text-end">
        <div class="text-sm text-muted">Tanggal</div>
        <div>${full.orderDate ? new Date(full.orderDate).toLocaleDateString('id-ID') : '-'}</div>
      </div>
    </div>
    ${full.notes ? `<div class="mb-2"><div class="text-sm text-muted">Catatan</div><div class="text-sm">${full.notes}</div></div>` : ''}
    <hr class="my-2">
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
    <hr class="my-2">
    <div class="d-flex justify-content-end">
      <div class="text-end">
        <div class="text-sm text-muted">Subtotal: ${formatCurrency(full.subtotal)}</div>
        <div class="fw-medium" style="font-size:15px">Grand Total: ${formatCurrency(full.grandTotal)}</div>
      </div>
    </div>
  `;

  AppModal({ title: 'Detail Purchase Order: ' + full.poNumber, content, size: 'lg', footer: [] });
}

function receiveGoods(purchase) {
  if (purchase.status !== 'ordered') return;
  AppConfirmDialog({
    title: 'Terima Barang',
    message: `Konfirmasi penerimaan barang untuk PO <strong>${purchase.poNumber}</strong>?`,
    confirmText: 'Ya, Terima',
    variant: 'success',
    onConfirm: async () => {
      const result = await purchaseService.updateStatus(purchase.id, 'received');
      if (result.success) {
        await loadTable();
      }
    },
  });
}

function confirmDelete(purchase) {
  AppConfirmDialog({
    title: 'Hapus Purchase Order',
    message: `Yakin ingin menghapus PO <strong>${purchase.poNumber}</strong>?`,
    confirmText: 'Ya, Hapus',
    variant: 'danger',
    onConfirm: async () => {
      await purchaseService.delete(purchase.id);
      await loadTable();
    },
  });
}
