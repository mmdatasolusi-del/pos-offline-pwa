const STATUS_COLORS = {
  PAID: 'bg-success-50 text-success',
  ACTIVE: 'bg-success-50 text-success',
  COMPLETED: 'bg-success-50 text-success',
  VOID: 'bg-danger-50 text-danger',
  CANCELLED: 'bg-danger-50 text-danger',
  ERROR: 'bg-danger-50 text-danger',
  PENDING: 'bg-warning-50 text-warning',
  PARTIAL: 'bg-warning-50 text-warning',
  DRAFT: 'bg-secondary text-light',
  CLOSED: 'bg-secondary text-light',
  OPEN: 'bg-primary-50 text-primary',
  IN_PROGRESS: 'bg-primary-50 text-primary',
  REFUNDED: 'bg-info text-light',
};

const SIZE_MAP = {
  sm: 'px-1 py-0',
  md: 'px-2 py-1',
  lg: 'px-2 py-1',
};

export function AppBadge({ text, variant, size = 'md', color, dot = false, count, className = '' }) {
  const span = document.createElement('span');
  span.className = ['badge', 'fw-medium', 'fs-6', SIZE_MAP[size] || '', className].filter(Boolean).join(' ');

  if (dot) {
    span.className += ' rounded-circle p-1';
    span.style.width = size === 'sm' ? '8px' : '10px';
    span.style.height = size === 'sm' ? '8px' : '10px';
    span.setAttribute('aria-label', text || 'indicator');
  }

  if (variant && STATUS_COLORS[variant]) {
    span.className += ' ' + STATUS_COLORS[variant];
  } else if (color) {
    span.style.backgroundColor = color;
    span.style.color = '#fff';
  }

  if (count !== undefined) {
    span.textContent = count > 99 ? '99+' : String(count);
    span.className += ' rounded-pill';
    if (count === 0) span.classList.add('d-none');
  } else if (!dot && text) {
    span.textContent = text;
    span.className += ' rounded-pill';
  }

  return span;
}
