const SHORTCUTS = [
  { key: 'ctrl+k', label: 'Fokus pencarian', global: true },
  { key: 'ctrl+n', label: 'Tambah data baru', global: true },
  { key: 'ctrl+s', label: 'Simpan', global: true },
  { key: 'escape', label: 'Batal / Tutup', global: true },
  { key: 'f1', label: 'Panduan keyboard', global: true },
];

let handlers = {};
let enabled = true;

export function registerShortcut(key, handler) {
  if (!handlers[key]) handlers[key] = [];
  handlers[key].push(handler);
}

export function unregisterShortcut(key, handler) {
  if (!handlers[key]) return;
  handlers[key] = handlers[key].filter((h) => h !== handler);
}

export function setEnabled(state) {
  enabled = state;
}

export function getShortcuts() {
  return [...SHORTCUTS];
}

document.addEventListener('keydown', (e) => {
  if (!enabled) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    if (e.key === 'Escape') {
      e.target.blur();
    }
    if (e.key === 'Enter') {
      const form = e.target.closest('form');
      form?.requestSubmit();
    }
    if (!e.ctrlKey && !e.metaKey && e.key !== 'Escape') return;
  }

  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key.toLowerCase());

  const key = parts.join('+');

  if (handlers[key]) {
    e.preventDefault();
    for (const handler of handlers[key]) {
      handler(e);
    }
  }
});

export function showShortcutsHelp() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center';

  const panel = document.createElement('div');
  panel.style.cssText = 'background:var(--color-bg-card);border-radius:8px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 25px rgba(0,0,0,0.2)';

  panel.innerHTML = `
    <h3 class="h5 fw-bold mb-3" style="color:var(--color-text-heading)">Pintasan Keyboard</h3>
    <div class="d-flex flex-column gap-2">
      ${SHORTCUTS.map((s) => `
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-sm" style="color:var(--color-text-body)">${s.label}</span>
          <kbd class="px-2 py-1 rounded text-xs" style="background:var(--color-gray-100);border:1px solid var(--color-border);font-family:var(--font-mono)">${s.key}</kbd>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-sm w-100 mt-3" onclick="this.closest('[style*=\\'position:fixed\\']').remove()">Tutup</button>
  `;

  panel.addEventListener('click', (e) => e.stopPropagation());
  modal.addEventListener('click', () => modal.remove());
  modal.appendChild(panel);
  document.body.appendChild(modal);
}

registerShortcut('f1', () => showShortcutsHelp());
