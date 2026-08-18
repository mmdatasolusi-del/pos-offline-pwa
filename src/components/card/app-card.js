const VARIANT_MAP = {
  default: 'border shadow-sm',
  elevated: 'border-0 shadow',
  interactive: 'border shadow-sm cursor-pointer',
  bordered: 'border',
};

export function AppCard({ variant = 'default', header, footer, children = [], className = '', onClick, attrs = {} }) {
  const card = document.createElement('div');
  card.className = ['card', 'bg-card', VARIANT_MAP[variant] || VARIANT_MAP.default, className].filter(Boolean).join(' ');
  card.style.backgroundColor = 'var(--color-bg-card)';

  for (const [k, v] of Object.entries(attrs)) {
    card.setAttribute(k, v);
  }

  if (header) {
    const h = document.createElement('div');
    h.className = 'card-header d-flex align-items-center justify-content-between gap-2 bg-transparent border-bottom px-3 py-2';
    if (typeof header === 'string') {
      h.textContent = header;
    } else {
      h.appendChild(header);
    }
    card.appendChild(h);
  }

  const body = document.createElement('div');
  body.className = 'card-body p-3';
  if (children.length > 0) {
    for (const child of children) {
      if (typeof child === 'string') {
        body.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        body.appendChild(child);
      }
    }
  }
  card.appendChild(body);

  if (footer) {
    const f = document.createElement('div');
    f.className = 'card-footer d-flex align-items-center justify-content-end gap-2 bg-transparent border-top px-3 py-2';
    if (typeof footer === 'string') {
      f.textContent = footer;
    } else {
      f.appendChild(footer);
    }
    card.appendChild(f);
  }

  if (onClick) {
    card.addEventListener('click', onClick);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
  }

  return card;
}

export function AppSection({ title, subtitle, children = [], className = '' }) {
  const section = document.createElement('div');
  section.className = ['mb-4', className].filter(Boolean).join(' ');

  if (title) {
    const h = document.createElement('div');
    h.className = 'd-flex align-items-baseline gap-2 mb-3';

    const titleEl = document.createElement('h2');
    titleEl.className = 'h5 fw-semibold mb-0';
    titleEl.style.color = 'var(--color-text-heading)';
    titleEl.textContent = title;
    h.appendChild(titleEl);

    if (subtitle) {
      const sub = document.createElement('span');
      sub.className = 'text-muted text-sm';
      sub.textContent = subtitle;
      h.appendChild(sub);
    }

    section.appendChild(h);
  }

  for (const child of children) {
    if (typeof child === 'string') {
      section.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      section.appendChild(child);
    }
  }

  return section;
}
