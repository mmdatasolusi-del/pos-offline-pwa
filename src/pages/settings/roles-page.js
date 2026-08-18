import { getRoles, createRole, updateRole, deleteRole } from '../../services/role-service.js';
import { AppButton } from '../../components/button/app-button.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppBadge } from '../../components/data-display/app-badge.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { showToast } from '../../components/feedback/app-alert.js';

export async function init(container) {
  const roles = await getRoles();

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Role</h2>
        <p class="text-muted text-sm mb-0">Kelola grup akses pengguna</p>
      </div>
      <div id="role-add-btn"></div>
    </div>
    <div id="role-table"></div>
  `;

  const addBtn = AppButton({ label: 'Tambah Role', icon: 'bi-plus-lg', variant: 'primary', size: 'sm' });
  document.getElementById('role-add-btn').appendChild(addBtn);
  addBtn.addEventListener('click', () => showRoleForm(null, container));

  const columns = [
    { key: 'name', label: 'Nama Role' },
    { key: 'sortOrder', label: 'Urutan' },
    { key: 'type', label: 'Tipe', render: (val) => AppBadge({ text: val, variant: val === 'Sistem' ? 'ACTIVE' : 'PENDING' }) },
  ];

  const data = roles.map((r) => ({ ...r, type: r.isSystem ? 'Sistem' : 'Kustom' }));

  const tableEl = AppTable({
    columns,
    data,
    actions: [
      { key: 'edit', icon: 'bi-pencil', label: 'Edit', onClick: (row) => showRoleForm(row, container) },
      {
        key: 'delete', icon: 'bi-trash', label: 'Hapus', color: 'var(--color-danger-500)',
        onClick: (row) => {
          AppConfirmDialog({
            title: 'Hapus Role',
            message: `Yakin ingin menghapus role "${row.name}"?`,
            confirmText: 'Ya, Hapus',
            variant: 'danger',
            onConfirm: async () => {
              try {
                await deleteRole(row.id);
                showToast('Role berhasil dihapus', 'success');
                await init(container);
              } catch (err) {
                showToast(err.message, 'error');
              }
            },
          });
        },
      },
    ],
  });

  document.getElementById('role-table').appendChild(tableEl);
}

function showRoleForm(role, container) {
  const isEdit = !!role;
  const title = isEdit ? 'Edit Role' : 'Tambah Role';

  const form = document.createElement('div');
  form.innerHTML = `
    <form id="role-form" novalidate>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">Nama Role</label>
        <input type="text" id="rf-name" class="form-control" value="${isEdit ? role.name : ''}" required style="border-color:var(--color-border)">
      </div>
      <div id="rf-error" class="alert d-none py-2 px-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)"></div>
    </form>
  `;

  const footer = [
    AppButton({ label: 'Batal', variant: 'outline', size: 'sm', onClick: () => modal.close() }),
    AppButton({ label: isEdit ? 'Simpan' : 'Tambah', variant: 'primary', size: 'sm', onClick: handleSubmit }),
  ];

  const modal = AppModal({ title, content: form, footer, size: 'sm' });

  async function handleSubmit() {
    const name = document.getElementById('rf-name').value.trim();
    const errorEl = document.getElementById('rf-error');
    errorEl.classList.add('d-none');

    if (!name) { errorEl.textContent = 'Nama role wajib diisi'; errorEl.classList.remove('d-none'); return; }

    try {
      if (isEdit) {
        await updateRole(role.id, { name });
        showToast('Role berhasil diperbarui', 'success');
      } else {
        await createRole({ name });
        showToast('Role berhasil ditambahkan', 'success');
      }
      modal.close();
      await init(container);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('d-none');
    }
  }
}
