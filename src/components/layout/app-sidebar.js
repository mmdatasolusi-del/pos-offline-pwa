export function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.setAttribute('data-app-sidebar', '');
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Navigasi utama');
  sidebar.innerHTML = `<div class="sidebar-inner"></div>`;
  return sidebar;
}

export function toggleSidebarCollapse() {
  document.body.classList.toggle('sidebar-collapsed');
  const isCollapsed = document.body.classList.contains('sidebar-collapsed');
  const btn = document.querySelector('[data-action="toggle-sidebar"]');
  if (btn) {
    btn.setAttribute('aria-expanded', String(!isCollapsed));
  }
}
