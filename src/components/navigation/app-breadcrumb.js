export function renderBreadcrumb(items) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb m-0';

  if (!items || items.length === 0) {
    items = [{ label: 'Beranda', active: true }];
  }

  ol.innerHTML = items.map((item, i) => {
    const isLast = i === items.length - 1 || item.active;
    if (isLast) {
      return `<li class="breadcrumb-item active" aria-current="page">${item.label}</li>`;
    }
    return `<li class="breadcrumb-item"><a href="#${item.path || '/'}" class="text-decoration-none">${item.label}</a></li>`;
  }).join('');

  nav.appendChild(ol);
  return nav;
}
