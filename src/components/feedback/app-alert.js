import { createElement, removeElement } from '../../utils/dom-utils.js';

const VARIANT_MAP = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A', icon: 'bi-check-circle-fill' },
  error: { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: 'bi-x-circle-fill' },
  warning: { bg: '#FEFCE8', border: '#FEF08A', color: '#CA8A04', icon: 'bi-exclamation-triangle-fill' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB', icon: 'bi-info-circle-fill' },
};

export function AppAlert({ variant = 'info', message, dismissible = true, icon = true, className = '' }) {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.info;

  const alert = createElement('div', {
    className: ['d-flex align-items-start gap-2 px-3 py-2 rounded', className].filter(Boolean).join(' '),
    role: 'alert',
  });
  alert.style.backgroundColor = v.bg;
  alert.style.border = `1px solid ${v.border}`;
  alert.style.color = v.color;

  if (icon) {
    const i = createElement('i', { className: `bi ${v.icon} mt-1` });
    i.style.color = v.color;
    alert.appendChild(i);
  }

  const msg = createElement('div', { className: 'flex-grow-1 text-sm' });
  msg.textContent = message;
  alert.appendChild(msg);

  if (dismissible) {
    const btn = createElement('button', {
      type: 'button',
      className: 'btn-close btn-close-sm',
      'aria-label': 'Tutup',
    });
    btn.style.fontSize = '12px';
    btn.addEventListener('click', () => removeElement(alert));
    alert.appendChild(btn);
  }

  return alert;
}

export function AppToast({ variant = 'info', message, duration = 3000, className = '' }) {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.info;

  const toast = createElement('div', {
    className: ['d-flex align-items-start gap-2 px-3 py-2 rounded shadow', className].filter(Boolean).join(' '),
    role: 'alert',
  });
  toast.style.backgroundColor = v.bg;
  toast.style.border = `1px solid ${v.border}`;
  toast.style.color = v.color;
  toast.style.position = 'fixed';
  toast.style.top = '16px';
  toast.style.right = '16px';
  toast.style.zIndex = '9999';
  toast.style.maxWidth = '400px';
  toast.style.animation = 'slideInRight 0.3s ease';

  const i = createElement('i', { className: `bi ${v.icon} mt-1` });
  toast.appendChild(i);

  const msg = createElement('div', { className: 'flex-grow-1 text-sm' });
  msg.textContent = message;
  toast.appendChild(msg);

  const closeBtn = createElement('button', {
    type: 'button',
    className: 'btn-close btn-close-sm',
    'aria-label': 'Tutup',
  });
  closeBtn.style.fontSize = '12px';
  closeBtn.addEventListener('click', () => removeElement(toast));
  toast.appendChild(closeBtn);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => removeElement(toast), 300);
  }, duration);

  return toast;
}

export function showToast(message, variant = 'info', duration) {
  return AppToast({ message, variant, duration });
}
