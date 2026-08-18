import db from '../../database/db.js';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/user-service.js';
import { getRoles } from '../../services/role-service.js';
import { AppButton } from '../../components/button/app-button.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppBadge } from '../../components/data-display/app-badge.js';
import { AppModal, AppConfirmDialog } from '../../components/modal/app-modal.js';
import { showToast } from '../../components/feedback/app-alert.js';

export async function init(container) {
  const users = await getUsers();
  const roles = await getRoles();

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Pengguna</h2>
        <p class="text-muted text-sm mb-0">Kelola akun pengguna aplikasi</p>
      </div>
      <div id="user-add-btn"></div>
    </div>
    <div id="user-table"></div>
  `;

  const addBtn = AppButton({ label: 'Tambah Pengguna', icon: 'bi-plus-lg', variant: 'primary', size: 'sm' });
  document.getElementById('user-add-btn').appendChild(addBtn);
  addBtn.addEventListener('click', () => showUserForm(null, roles, container));

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Nama Lengkap' },
    { key: 'roleName', label: 'Role' },
    { key: 'status', label: 'Status', render: (val) => AppBadge({ text: val, variant: val === 'Aktif' ? 'ACTIVE' : 'VOID' }) },
  ];

  const data = users.map((u) => ({
    ...u,
    roleName: roles.find((r) => r.id === u.roleId)?.name || '-',
    status: u.isActive ? 'Aktif' : 'Nonaktif',
  }));

  const tableEl = AppTable({
    columns,
    data,
    actions: [
      { key: 'edit', icon: 'bi-pencil', label: 'Edit', onClick: (row) => showUserForm(row, roles, container) },
      { key: 'toggle', icon: 'bi-power', label: row => row.isActive ? 'Nonaktifkan' : 'Aktifkan', onClick: toggleUser },
    ],
  });

  document.getElementById('user-table').appendChild(tableEl);

  async function toggleUser(row) {
    const action = row.isActive ? 'nonaktifkan' : 'aktifkan';
    AppConfirmDialog({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Pengguna`,
      message: `Yakin ingin ${action} user "${row.fullName || row.username}"?`,
      confirmText: `Ya, ${action}`,
      variant: row.isActive ? 'warning' : 'success',
      onConfirm: async () => {
        try {
          await updateUser(row.id, { isActive: !row.isActive });
          showToast(`User berhasil di${action}`, 'success');
          await init(container);
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }
}

function showUserForm(user, roles, container) {
  const isEdit = !!user;
  const title = isEdit ? 'Edit Pengguna' : 'Tambah Pengguna';

  const form = document.createElement('div');
  form.innerHTML = `
    <form id="user-form" novalidate>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">Username</label>
        <input type="text" id="uf-username" class="form-control" value="${isEdit ? user.username : ''}" ${isEdit ? 'readonly' : 'required'} style="border-color:var(--color-border)">
      </div>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">Nama Lengkap</label>
        <input type="text" id="uf-fullname" class="form-control" value="${isEdit ? user.fullName : ''}" required style="border-color:var(--color-border)">
      </div>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">Password</label>
        <input type="password" id="uf-password" class="form-control" ${isEdit ? 'placeholder="Kosongkan jika tidak diubah"' : 'required'} style="border-color:var(--color-border)">
      </div>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">Role</label>
        <select id="uf-role" class="form-select" required style="border-color:var(--color-border)">
          <option value="">Pilih Role</option>
          ${roles.map((r) => `<option value="${r.id}" ${isEdit && user.roleId === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label text-sm fw-medium">PIN (6 digit, opsional)</label>
        <input type="text" id="uf-pin" class="form-control" value="${isEdit && user.pin ? user.pin : ''}" maxlength="6" pattern="\\d{0,6}" placeholder="Kosongkan jika tidak perlu" style="border-color:var(--color-border)">
      </div>
      <div id="uf-error" class="alert d-none py-2 px-3 text-sm" role="alert" style="background-color:var(--color-danger-50);border:1px solid #FECACA;color:var(--color-danger-600)"></div>
    </form>
  `;

  const footer = [
    AppButton({ label: 'Batal', variant: 'outline', size: 'sm', onClick: () => modal.close() }),
    AppButton({ label: isEdit ? 'Simpan' : 'Tambah', variant: 'primary', size: 'sm', onClick: handleSubmit }),
  ];

  const modal = AppModal({ title, content: form, footer, size: 'md' });

  async function handleSubmit() {
    const data = {
      username: document.getElementById('uf-username').value.trim(),
      fullName: document.getElementById('uf-fullname').value.trim(),
      password: document.getElementById('uf-password').value,
      roleId: document.getElementById('uf-role').value,
      pin: document.getElementById('uf-pin').value || null,
    };

    const errorEl = document.getElementById('uf-error');
    errorEl.classList.add('d-none');

    if (!data.fullName) { showFormError('Nama lengkap wajib diisi'); return; }
    if (!data.roleId) { showFormError('Role wajib dipilih'); return; }
    if (!isEdit && !data.password) { showFormError('Password wajib diisi'); return; }
    if (data.password && data.password.length < 6) { showFormError('Password minimal 6 karakter'); return; }

    try {
      if (isEdit) {
        await updateUser(user.id, data);
        showToast('User berhasil diperbarui', 'success');
      } else {
        await createUser(data);
        showToast('User berhasil ditambahkan', 'success');
      }
      modal.close();
      await init(container);
    } catch (err) {
      showFormError(err.message);
    }
  }

  function showFormError(msg) {
    const el = document.getElementById('uf-error');
    el.textContent = msg;
    el.classList.remove('d-none');
  }
}
