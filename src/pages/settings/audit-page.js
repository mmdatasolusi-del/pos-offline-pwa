import db from '../../database/db.js';
import { AppTable } from '../../components/table/app-table.js';
import { AppBadge } from '../../components/data-display/app-badge.js';

const PAGE_SIZE = 50;

export async function init(container) {
  const totalLogs = await db.auditLogs.count();
  const logs = await db.auditLogs
    .orderBy('id')
    .reverse()
    .limit(PAGE_SIZE)
    .toArray();

  const users = await db.users.toArray();
  const userMap = {};
  for (const u of users) userMap[u.id] = u.fullName || u.username;

  container.innerHTML = `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h5 fw-bold mb-1" style="color:var(--color-text-heading)">Audit Log</h2>
        <p class="text-muted text-sm mb-0">Riwayat perubahan data dan aktivitas sistem</p>
      </div>
    </div>
    <div class="card border-0 shadow-sm" style="background-color:var(--color-bg-card)">
      <div class="card-body p-0">
        <div id="audit-table"></div>
      </div>
      ${totalLogs > PAGE_SIZE ? `
        <div class="card-footer bg-transparent border-top px-3 py-2 text-center">
          <span class="text-muted text-sm">Menampilkan ${PAGE_SIZE} dari ${totalLogs} catatan</span>
        </div>
      ` : ''}
    </div>
  `;

  const actionColors = {
    CREATE: 'success',
    UPDATE: 'primary',
    DELETE: 'danger',
    VOID: 'warning',
    LOGIN: 'info',
    LOGOUT: 'secondary',
  };

  const columns = [
    { key: 'time', label: 'Waktu', render: (val) => {
      const el = document.createElement('span');
      el.className = 'text-sm ws-nowrap';
      el.textContent = val ? new Date(val).toLocaleString('id-ID') : '-';
      return el;
    }},
    { key: 'user', label: 'User', render: (val) => {
      const el = document.createElement('span');
      el.className = 'text-sm';
      el.textContent = val || '-';
      return el;
    }},
    { key: 'action', label: 'Aksi', render: (val) => AppBadge({ text: val, variant: actionColors[val] || 'PENDING' }) },
    { key: 'entityType', label: 'Entitas', render: (val) => {
      const el = document.createElement('span');
      el.className = 'text-sm';
      el.textContent = val || '-';
      return el;
    }},
    { key: 'description', label: 'Keterangan', render: (val) => {
      const el = document.createElement('span');
      el.className = 'text-sm text-muted';
      el.textContent = val || '-';
      return el;
    }},
  ];

  const data = logs.map((log) => ({
    time: log.createdAt,
    user: userMap[log.userId] || '-',
    action: log.action,
    entityType: log.entityType,
    description: getActionDescription(log),
  }));

  const tableEl = AppTable({ columns, data, variant: 'striped', emptyText: 'Belum ada catatan audit' });
  document.getElementById('audit-table').appendChild(tableEl);
}

function getActionDescription(log) {
  const actionMap = {
    CREATE: 'membuat',
    UPDATE: 'mengubah',
    DELETE: 'menghapus',
    VOID: 'membatalkan',
    LOGIN: 'login',
    LOGOUT: 'logout',
  };
  const action = actionMap[log.action] || log.action;
  return `${action} ${log.entityType}${log.entityId ? ': ' + log.entityId.slice(0, 8) : ''}`;
}
