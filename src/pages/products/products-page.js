import { renderCard } from '../../components/Card.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppButton } from '../../components/button/app-button.js';
import { productService } from '../../modules/product/product-service.js';
import { formatCurrency, formatStatus } from '../../modules/product/product-utils.js';

let currentSort = ['name', 'asc'];
let currentPage = 1;
let currentSearch = '';
const PAGE_SIZE = 10;

let categories = [];
let units = [];
let suppliers = [];

export async function init(container) {
  container.innerHTML = '';

  [categories, units, suppliers] = await Promise.all([
    productService.getCategories(),
    productService.getUnits(),
    productService.getSuppliers(),
  ]);

  const header = document.createElement('div');
  header.className = 'page-header d-flex flex-wrap justify-content-between align-items-center mb-4';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Produk</h1>
      <p class="page-subtitle">Kelola data produk barang dan jasa</p>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement('div');
  toolbar.className = 'd-flex flex-wrap gap-2 mb-3 align-items-center';
  toolbar.innerHTML = `
    <div class="input-group" style="max-width:320px">
      <span class="input-group-text bg-white" style="border-right:none"><i class="bi bi-search text-muted"></i></span>
      <input type="text" id="product-search" class="form-control" placeholder="Cari nama, kode, atau barcode..." style="border-left:none;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
    </div>
  `;

  const btnAdd = AppButton({ label: 'Tambah', icon: 'bi-plus-circle', variant: 'primary', size: 'sm' });
  btnAdd.addEventListener('click', () => showForm(null));
  toolbar.appendChild(btnAdd);

  const btnImport = AppButton({ label: 'Import Excel', icon: 'bi-upload', variant: 'outline', size: 'sm' });
  const fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = '.xlsx,.xls'; fileInput.style.display = 'none';
  fileInput.addEventListener('change', async (e) => {
    if (fileInput.files.length) {
      try {
        await productService.importFromExcel(fileInput.files[0]);
        await loadTable();
      } catch (err) { alert('Gagal import: ' + err.message); }
      fileInput.value = '';
    }
  });
  btnImport.appendChild(fileInput);
  btnImport.addEventListener('click', () => fileInput.click());
  toolbar.appendChild(btnImport);

  const btnExport = AppButton({ label: 'Export Excel', icon: 'bi-download', variant: 'outline', size: 'sm' });
  btnExport.addEventListener('click', () => productService.exportToExcel());
  toolbar.appendChild(btnExport);

  container.appendChild(toolbar);

  const searchInput = document.getElementById('product-search');
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value;
      currentPage = 1;
      loadTable();
    }, 300);
  });

  const cardWrapper = document.createElement('div');
  cardWrapper.id = 'product-table-wrapper';
  container.appendChild(cardWrapper);

  await loadTable();
}

async function loadTable() {
  const wrapper = document.getElementById('product-table-wrapper');
  wrapper.innerHTML = '<div class="d-flex justify-content-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div></div>';

  const result = await productService.getAll({
    search: currentSearch,
    sort: currentSort,
    pagination: { page: currentPage, pageSize: PAGE_SIZE },
  });

  const mapName = (list, id) => list.find(c => c.id === id)?.name || '-';

  const rows = result.data.map(p => ({
    ...p,
    categoryName: mapName(categories, p.categoryId),
    unitName: mapName(units, p.unitId),
    supplierName: mapName(suppliers, p.supplierId),
  }));

  const columns = [
    { key: 'sku', label: 'Kode', sortable: true, render: (v, r) => {
      const el = document.createElement('span');
      el.className = 'fw-medium'; el.style.color = 'var(--color-primary-500)';
      el.textContent = v; return el;
    }},
    { key: 'barcode', label: 'Barcode' },
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'categoryName', label: 'Kategori' },
    { key: 'buyPrice', label: 'Harga Beli', align: 'right', render: (v) => {
      const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
    }},
    { key: 'sellPrice', label: 'Harga Jual', align: 'right', render: (v) => {
      const el = document.createElement('span'); el.textContent = formatCurrency(v); return el;
    }},
    { key: 'stock', label: 'Stok', align: 'right' },
    { key: 'isActive', label: 'Status', render: (v) => {
      const el = document.createElement('span'); el.innerHTML = formatStatus(v); return el;
    }},
  ];

  const actions = [
    { key: 'edit', icon: 'bi-pencil', label: 'Edit', color: 'var(--color-primary-500)', onClick: (row) => showForm(row) },
    { key: 'delete', icon: 'bi-trash', label: 'Hapus', color: '#ef4444', onClick: (row) => confirmDelete(row) },
  ];

  const card = renderCard({
    title: 'Daftar Produk',
    body: '',
    headerRight: `<span class="text-muted" style="font-size:13px">${result.total} item</span>`,
  });

  const tableWrapper = card.querySelector('.dashboard-card-body');
  const tableContainer = document.createElement('div');
  const table = AppTable({ columns, data: rows, sortable: true, actions, emptyText: 'Belum ada produk. Klik "Tambah" untuk menambahkan.', onSort: (field, order) => {
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

function showForm(product) {
  const isEdit = !!product;
  const title = isEdit ? 'Edit Produk' : 'Tambah Produk';

  const content = document.createElement('div');
  content.innerHTML = `
    <form id="product-form" novalidate>
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Kode Produk</label>
          <input type="text" id="f-sku" class="form-control form-control-sm" value="${isEdit ? product.sku : ''}" ${isEdit ? '' : 'readonly'} style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Barcode</label>
          <input type="text" id="f-barcode" class="form-control form-control-sm" value="${isEdit ? (product.barcode || '') : ''}" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Nama Produk <span class="text-danger">*</span></label>
        <input type="text" id="f-name" class="form-control form-control-sm" value="${isEdit ? product.name : ''}" required style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      </div>
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Kategori</label>
          <select id="f-category" class="form-select form-select-sm" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
            <option value="">-- Pilih --</option>
            ${categories.map(c => `<option value="${c.id}" ${isEdit && product.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Satuan</label>
          <select id="f-unit" class="form-select form-select-sm" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
            <option value="">-- Pilih --</option>
            ${units.map(u => `<option value="${u.id}" ${isEdit && product.unitId === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="row g-2">
        <div class="col-4">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Harga Beli <span class="text-danger">*</span></label>
          <input type="number" id="f-buy-price" class="form-control form-control-sm" value="${isEdit ? product.buyPrice : 0}" min="0" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-4">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Harga Jual <span class="text-danger">*</span></label>
          <input type="number" id="f-sell-price" class="form-control form-control-sm" value="${isEdit ? product.sellPrice : 0}" min="0" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-4">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Stok Awal</label>
          <input type="number" id="f-stock" class="form-control form-control-sm" value="${isEdit ? product.stock : 0}" min="0" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
      </div>
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Stok Minimum</label>
          <input type="number" id="f-min-stock" class="form-control form-control-sm" value="${isEdit ? product.minStock : 0}" min="0" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Supplier Default</label>
          <select id="f-supplier" class="form-select form-select-sm" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
            <option value="">-- Pilih --</option>
            ${suppliers.map(s => `<option value="${s.id}" ${isEdit && product.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="mb-2">
        <div class="form-check">
          <input type="checkbox" id="f-active" class="form-check-input" ${isEdit ? (product.isActive ? 'checked' : '') : 'checked'}>
          <label class="form-check-label text-sm" for="f-active" style="color:var(--color-text-body)">Status Aktif</label>
        </div>
      </div>
      <div id="form-errors" class="d-none"></div>
    </form>
  `;

  const footer = [];
  const cancelBtn = AppButton({ label: 'Batal', variant: 'outline', size: 'sm' });
  const saveBtn = AppButton({ label: 'Simpan', icon: 'bi-check-lg', variant: 'primary', size: 'sm' });
  footer.push(cancelBtn, saveBtn);

  const modal = AppModal({ title, content, size: 'lg', footer, onClose: () => {} });

  cancelBtn.addEventListener('click', () => modal.close());

  saveBtn.addEventListener('click', async () => {
    const data = {
      sku: document.getElementById('f-sku').value.trim(),
      barcode: document.getElementById('f-barcode').value.trim(),
      name: document.getElementById('f-name').value.trim(),
      categoryId: document.getElementById('f-category').value || null,
      unitId: document.getElementById('f-unit').value || null,
      buyPrice: Number(document.getElementById('f-buy-price').value) || 0,
      sellPrice: Number(document.getElementById('f-sell-price').value) || 0,
      stock: Number(document.getElementById('f-stock').value) || 0,
      minStock: Number(document.getElementById('f-min-stock').value) || 0,
      supplierId: document.getElementById('f-supplier').value || null,
      isActive: document.getElementById('f-active').checked,
    };

    const result = isEdit
      ? await productService.update(product.id, data)
      : await productService.create(data);

    if (result.success) {
      modal.close();
      await loadTable();
    } else {
      const errDiv = document.getElementById('form-errors');
      errDiv.className = 'alert alert-danger py-2 px-3 mb-0 text-sm';
      errDiv.innerHTML = result.errors.map(e => `<div><i class="bi bi-exclamation-circle me-1"></i>${e}</div>`).join('');
    }
  });
}

function confirmDelete(product) {
  AppConfirmDialog({
    title: 'Hapus Produk',
    message: `Yakin ingin menghapus <strong>${product.name}</strong>? Data akan diarsipkan dan dapat dipulihkan kembali.`,
    confirmText: 'Ya, Hapus',
    variant: 'danger',
    onConfirm: async () => {
      await productService.delete(product.id);
      await loadTable();
    },
  });
}
