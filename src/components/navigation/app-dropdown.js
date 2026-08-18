import { createElement, removeElement } from '../../utils/dom-utils.js';

export function AppDropdown({ trigger, items = [], align = 'start', className = '' }) {
  const wrapper = createElement('div', { className: ['dropdown d-inline-block', className].filter(Boolean).join(' ') });

  const toggle = createElement('button', {
    type: 'button',
    className: 'dropdown-toggle d-flex align-items-center gap-1 btn btn-link text-decoration-none p-0 border-0',
    'data-bs-toggle': 'dropdown',
    'aria-expanded': 'false',
  });
  toggle.style.color = 'var(--color-text-body)';

  if (typeof trigger === 'string') {
    toggle.innerHTML = trigger;
  } else if (trigger instanceof Node) {
    toggle.appendChild(trigger);
  }

  const menu = createElement('ul', {
    className: ['dropdown-menu', align === 'end' ? 'dropdown-menu-end' : ''].filter(Boolean).join(' '),
  });

  for (const item of items) {
    if (item.divider) {
      const divider = createElement('li', { className: 'dropdown-divider' });
      menu.appendChild(divider);
      continue;
    }

    const li = createElement('li');
    const a = createElement('a', {
      className: ['dropdown-item d-flex align-items-center gap-2', item.active ? 'active' : '', item.disabled ? 'disabled' : ''].filter(Boolean).join(' '),
      href: item.href || '#',
      role: 'menuitem',
    });
    a.style.cursor = 'pointer';
    a.style.fontSize = '14px';

    if (item.icon) {
      const i = createElement('i', { className: item.icon.includes('bi-') ? item.icon : 'bi bi-' + item.icon });
      a.appendChild(i);
    }

    if (item.label) {
      const span = createElement('span');
      span.textContent = item.label;
      a.appendChild(span);
    }

    if (item.badge) {
      const badge = createElement('span', { className: 'ms-auto badge bg-' + (item.badgeVariant || 'secondary') + ' rounded-pill' });
      badge.textContent = item.badge;
      a.appendChild(badge);
    }

    if (!item.disabled) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.onClick) item.onClick(e);
        if (item.href && item.href !== '#') {
          window.location.hash = item.href;
        }
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    li.appendChild(a);
    menu.appendChild(li);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('show');
    closeAllDropdowns();
    if (!isOpen) {
      menu.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  wrapper.appendChild(toggle);
  wrapper.appendChild(menu);

  return wrapper;
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.show').forEach((m) => {
    m.classList.remove('show');
    const btn = m.closest('.dropdown')?.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}
