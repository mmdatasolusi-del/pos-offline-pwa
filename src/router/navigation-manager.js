import { ROUTES, NOT_FOUND_ROUTE, ROUTE_GROUPS } from './routes.js';

let currentRoute = null;
let currentParams = {};

export function getCurrentRoute() {
  return currentRoute;
}

export function getCurrentParams() {
  return { ...currentParams };
}

function findRoute(path) {
  return ROUTES.find(r => r.path === path) || null;
}

function buildBreadcrumb(route) {
  if (!route) return [{ label: 'Beranda', path: '/' }];
  const crumbs = [{ label: 'Beranda', path: '/' }];
  if (route.path !== '/') {
    crumbs.push({ label: route.label, path: route.path, active: true });
  } else {
    crumbs[0].active = true;
  }
  return crumbs;
}

export function navigate(path, params = {}) {
  const matched = findRoute(path);
  currentRoute = matched || NOT_FOUND_ROUTE;
  currentParams = params;

  const sidebar = document.querySelector('[data-app-sidebar]');
  if (sidebar) {
    updateSidebar(sidebar);
  }

  const breadcrumbEl = document.querySelector('[data-app-breadcrumb]');
  if (breadcrumbEl) {
    updateBreadcrumb(breadcrumbEl);
  }

  document.title = `${currentRoute.label} — POS Offline PWA`;
}

function updateSidebar(sidebar) {
  sidebar.querySelectorAll('[data-route]').forEach(item => {
    const routeName = item.getAttribute('data-route');
    item.classList.toggle('active', routeName === currentRoute.name);
    item.setAttribute('aria-current', routeName === currentRoute.name ? 'page' : 'false');
  });
}

function updateBreadcrumb(container) {
  const crumbs = buildBreadcrumb(currentRoute);
  container.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    if (isLast) {
      return `<li class="breadcrumb-item active" aria-current="page">${c.label}</li>`;
    }
    return `<li class="breadcrumb-item"><a href="#${c.path}" class="text-decoration-none">${c.label}</a></li>`;
  }).join('');
}

export function initNavigation() {
  const sidebarInner = document.querySelector('[data-app-sidebar] .sidebar-inner');
  if (sidebarInner) {
    sidebarInner.innerHTML = renderSidebarMenu();
  }
}

function renderSidebarMenu() {
  let html = `<div class="sidebar-brand d-flex align-items-center px-3 py-3">
    <i class="bi bi-cpu fs-4 me-2 text-primary"></i>
    <span class="fw-bold sidebar-brand-text">POS Offline</span>
  </div>
  <nav class="sidebar-nav" aria-label="Navigasi utama">`;

  for (const group of ROUTE_GROUPS) {
    const items = ROUTES.filter(r => r.group === group.key);
    if (items.length === 0) continue;

    html += `<div class="sidebar-group">
      <div class="sidebar-group-label">${group.label}</div>
      <ul class="sidebar-menu">`;

    for (const route of items) {
      html += `<li>
        <a href="#${route.path}" class="sidebar-menu-item" data-route="${route.name}" role="menuitem" aria-current="false">
          <i class="bi ${route.icon} sidebar-menu-icon"></i>
          <span class="sidebar-menu-text">${route.label}</span>
        </a>
      </li>`;
    }

    html += `</ul></div>`;
  }

  html += `</nav>`;
  return html;
}

export function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
}
