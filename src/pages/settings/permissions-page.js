import { getRoles } from '../../services/role-service.js';
import { getPermissionsByRole, setModulePermissions, MODULES, ACTIONS } from '../../services/permission-service.js';
import { showToast } from '../../components/feedback/app-alert.js';

export async function init(container) {
  const roles = await getRoles();

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Hak Akses</h2>
        <p class="text-muted text-sm mb-0">Atur izin akses per modul untuk setiap role</p>
      </div>
    </div>
    <div id="permission-tabs" class="mb-3"></div>
    <div id="permission-content"></div>
  `;

  const tabsContainer = document.getElementById('permission-tabs');
  const contentContainer = document.getElementById('permission-content');

  const tabBar = document.createElement('div');
  tabBar.className = 'd-flex gap-2 flex-wrap';

  roles.forEach((role, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `btn btn-sm ${index === 0 ? 'btn-primary' : 'btn-outline-secondary'}`;
    tab.textContent = role.name;
    tab.addEventListener('click', () => renderPermissionMatrix(role, contentContainer, tabBar));
    tabBar.appendChild(tab);
  });

  tabsContainer.appendChild(tabBar);

  if (roles.length > 0) {
    await renderPermissionMatrix(roles[0], contentContainer, tabBar);
  }
}

async function renderPermissionMatrix(role, container, tabBar) {
  tabBar.querySelectorAll('.btn-primary').forEach((b) => {
    b.className = 'btn btn-sm btn-outline-secondary';
  });
  const tabs = tabBar.querySelectorAll('button');
  for (const tab of tabs) {
    if (tab.textContent === role.name) {
      tab.className = 'btn btn-sm btn-primary';
      break;
    }
  }

  const permissions = await getPermissionsByRole(role.id);

  container.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-2">
      <p class="text-sm text-muted mb-0">Role: <strong>${role.name}</strong></p>
      <span id="perm-status" class="badge bg-success-50 text-success d-none px-2 py-1">Tersimpan</span>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered align-middle mb-0" style="border-color:var(--color-border)">
        <thead class="table-light">
          <tr>
            <th style="width:200px" class="text-sm fw-semibold">Modul</th>
            ${ACTIONS.map((a) => `<th class="text-center text-sm fw-semibold" style="width:80px;text-transform:capitalize">${translateAction(a)}</th>`).join('')}
          </tr>
        </thead>
        <tbody id="perm-body">
          ${MODULES.map((m) => `
            <tr>
              <td class="text-sm">${m.label}</td>
              ${ACTIONS.map((a) => {
                const checked = permissions[m.key]?.[a] || false;
                return `<td class="text-center">
                  <input type="checkbox" class="form-check-input perm-check" data-module="${m.key}" data-action="${a}" ${checked ? 'checked' : ''} ${role.isSystem ? 'disabled' : ''}>
                </td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${role.isSystem ? '<p class="text-muted text-sm mt-2"><i class="bi bi-info-circle me-1"></i>Role sistem tidak bisa diubah izinnya</p>' : ''}
  `;

  if (!role.isSystem) {
    container.querySelectorAll('.perm-check').forEach((cb) => {
      cb.addEventListener('change', async () => {
        const module = cb.dataset.module;
        const action = cb.dataset.action;
        try {
          await setModulePermissions(role.id, module, { [action]: cb.checked });
          const status = document.getElementById('perm-status');
          status.classList.remove('d-none');
          setTimeout(() => status.classList.add('d-none'), 2000);
        } catch (err) {
          showToast('Gagal menyimpan izin: ' + err.message, 'error');
          cb.checked = !cb.checked;
        }
      });
    });
  }
}

function translateAction(action) {
  const map = { create: 'Tambah', read: 'Lihat', update: 'Ubah', delete: 'Hapus' };
  return map[action] || action;
}