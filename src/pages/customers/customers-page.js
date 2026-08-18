import { renderCard } from '../../components/Card.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppButton } from '../../components/button/app-button.js';
import { customerService } from '../../modules/customer/customer-service.js';

let currentSort = ['name', 'asc'];
let currentPage = 1;
let currentSearch = '';
const PAGE_SIZE = 10;

export async function init(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header d-flex flex-wrap justify-content-between align-items-center mb-4';
  header.innerHTML = `
    <div>
      <h1 class="page-title">Pelanggan</h1>
      <p class="page-subtitle">Kelola data pelanggan</p>
    </div>
  `;
  container.appendChild(header);

  const toolbar = document.createElement('div');
  toolbar.className = 'd-flex flex-wrap gap-2 mb-3 align-items-center';
  toolbar.innerHTML = `
    <div class="input-group" style="max-width:320px">
      <span class="input-group-text bg-white" style="border-right:none"><i class="bi bi-search text-muted"></i></span>
      <input type="text" id="customer-search" class="form-control" placeholder="Cari nama, telepon, atau email..." style="border-left:none;background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
    </div>
  `;

  const btnAdd = AppButton({ label: 'Tambah', icon: 'bi-plus-circle', variant: 'primary', size: 'sm' });
  btnAdd.addEventListener('click', () => showForm(null));
  toolbar.appendChild(btnAdd);

  container.appendChild(toolbar);

  const searchInput = document.getElementById('customer-search');
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
  cardWrapper.id = 'customer-table-wrapper';
  container.appendChild(cardWrapper);

  await loadTable();
}

function formatStatus(isActive) {
  return isActive
    ? '<span class="badge bg-success px-2 py-1" style="font-size:11px">Aktif</span>'
    : '<span class="badge bg-secondary px-2 py-1" style="font-size:11px">Nonaktif</span>';
}

async function loadTable() {
  const wrapper = document.getElementById('customer-table-wrapper');
  wrapper.innerHTML = '<div class="d-flex justify-content-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat...</span></div></div>';

  const result = await customerService.getAll({
    search: currentSearch,
    sort: currentSort,
    pagination: { page: currentPage, pageSize: PAGE_SIZE },
  });

  const columns = [
    { key: 'name', label: 'Nama', sortable: true, render: (v, r) => {
      const el = document.createElement('span');
      el.className = 'fw-medium'; el.style.color = 'var(--color-primary-500)';
      el.textContent = v; return el;
    }},
    { key: 'phone', label: 'Telepon' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Alamat' },
    { key: 'isMember', label: 'Member', render: (v) => {
      const el = document.createElement('span');
      el.innerHTML = v
        ? '<span class="badge bg-info px-2 py-1" style="font-size:11px">Member</span>'
        : '<span class="text-muted" style="font-size:12px">-</span>';
      return el;
    }},
    { key: 'isActive', label: 'Status', render: (v) => {
      const el = document.createElement('span'); el.innerHTML = formatStatus(v); return el;
    }},
  ];

  const actions = [
    { key: 'edit', icon: 'bi-pencil', label: 'Edit', color: 'var(--color-primary-500)', onClick: (row) => showForm(row) },
    { key: 'delete', icon: 'bi-trash', label: 'Hapus', color: '#ef4444', onClick: (row) => confirmDelete(row) },
  ];

  const card = renderCard({
    title: 'Daftar Pelanggan',
    body: '',
    headerRight: `<span class="text-muted" style="font-size:13px">${result.total} item</span>`,
  });

  const tableWrapper = card.querySelector('.dashboard-card-body');
  const tableContainer = document.createElement('div');
  const table = AppTable({ columns, data: result.data, sortable: true, actions, emptyText: 'Belum ada pelanggan. Klik "Tambah" untuk menambahkan.', onSort: (field, order) => {
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

function showForm(customer) {
  const isEdit = !!customer;
  const title = isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan';

  const content = document.createElement('div');
  content.innerHTML = `
    <form id="customer-form" novalidate>
      <div class="mb-2">
        <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Nama Pelanggan <span class="text-danger">*</span></label>
        <input type="text" id="f-name" class="form-control form-control-sm" value="${isEdit ? customer.name : ''}" required style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
      </div>
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Telepon</label>
          <input type="text" id="f-phone" class="form-control form-control-sm" value="${isEdit ? (customer.phone || '') : ''}" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Email</label>
          <input type="email" id="f-email" class="form-control form-control-sm" value="${isEdit ? (customer.email || '') : ''}" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Alamat</label>
        <textarea id="f-address" class="form-control form-control-sm" rows="2" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">${isEdit ? (customer.address || '') : ''}</textarea>
      </div>
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label text-sm fw-medium mb-1" style="color:var(--color-text-body)">Catatan</label>
          <input type="text" id="f-notes" class="form-control form-control-sm" value="${isEdit ? (customer.notes || '') : ''}" style="background:var(--color-bg-card);color:var(--color-text-body);border-color:var(--color-border)">
        </div>
        <div class="col-6 d-flex align-items-end pb-1">
          <div class="form-check">
            <input type="checkbox" id="f-member" class="form-check-input" ${isEdit ? (customer.isMember ? 'checked' : '') : ''}>
            <label class="form-check-label text-sm" for="f-member" style="color:var(--color-text-body)">Member</label>
          </div>
        </div>
      </div>
      <div class="mb-2">
        <div class="form-check">
          <input type="checkbox" id="f-active" class="form-check-input" ${isEdit ? (customer.isActive ? 'checked' : '') : 'checked'}>
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
      name: document.getElementById('f-name').value.trim(),
      phone: document.getElementById('f-phone').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      address: document.getElementById('f-address').value.trim(),
      notes: document.getElementById('f-notes').value.trim(),
      isMember: document.getElementById('f-member').checked,
      isActive: document.getElementById('f-active').checked,
    };

    const result = isEdit
      ? await customerService.update(customer.id, data)
      : await customerService.create(data);

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

function confirmDelete(customer) {
  AppConfirmDialog({
    title: 'Hapus Pelanggan',
    message: `Yakin ingin menghapus <strong>${customer.name}</strong>? Data akan diarsipkan dan dapat dipulihkan kembali.`,
    confirmText: 'Ya, Hapus',
    variant: 'danger',
    onConfirm: async () => {
      await customerService.delete(customer.id);
      await loadTable();
    },
  });
}
