import { createElement, removeElement } from '../../utils/dom-utils.js';

export function AppModal({ title, content, size = 'md', footer, closable = true, onClose, className = '' }) {
  const sizes = { sm: 'modal-sm', md: '', lg: 'modal-lg', xl: 'modal-xl' };

  const overlay = createElement('div', {
    className: 'modal d-block',
    tabindex: '-1',
    role: 'dialog',
    style: 'background-color:rgba(0,0,0,0.5);z-index:1055',
  });

  const dialog = createElement('div', {
    className: ['modal-dialog modal-dialog-centered modal-dialog-scrollable', sizes[size] || '', className].filter(Boolean).join(' '),
    role: 'document',
  });

  const modalContent = createElement('div', { className: 'modal-content border-0 shadow' });
  modalContent.style.backgroundColor = 'var(--color-bg-card)';

  if (title || closable) {
    const h = createElement('div', { className: 'modal-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom' });
    h.style.borderColor = 'var(--color-border)';

    if (title) {
      const t = createElement('h5', { className: 'modal-title fw-semibold mb-0' });
      t.style.color = 'var(--color-text-heading)';
      t.textContent = title;
      h.appendChild(t);
    }

    if (closable) {
      const btn = createElement('button', { type: 'button', className: 'btn-close', 'aria-label': 'Tutup' });
      btn.addEventListener('click', () => close());
      h.appendChild(btn);
    }

    modalContent.appendChild(h);
  }

  const body = createElement('div', { className: 'modal-body p-3' });
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  } else if (Array.isArray(content)) {
    for (const el of content) {
      if (typeof el === 'string') body.appendChild(document.createTextNode(el));
      else if (el instanceof Node) body.appendChild(el);
    }
  }
  modalContent.appendChild(body);

  if (footer) {
    const f = createElement('div', { className: 'modal-footer d-flex align-items-center justify-content-end gap-2 px-3 py-2 border-top' });
    f.style.borderColor = 'var(--color-border)';
    if (typeof footer === 'string') {
      f.innerHTML = footer;
    } else if (Array.isArray(footer)) {
      for (const el of footer) {
        if (el instanceof Node) f.appendChild(el);
      }
    } else if (footer instanceof Node) {
      f.appendChild(footer);
    }
    modalContent.appendChild(f);
  }

  dialog.appendChild(modalContent);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && closable) close();
  });

  document.addEventListener('keydown', keyHandler);

  function keyHandler(e) {
    if (e.key === 'Escape' && closable) close();
  }

  function close() {
    document.removeEventListener('keydown', keyHandler);
    removeElement(overlay);
    onClose?.();
  }

  overlay.close = close;
  overlay.querySelector = (sel) => modalContent.querySelector(sel);

  return overlay;
}

export function AppConfirmDialog({ title = 'Konfirmasi', message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', variant = 'primary', onConfirm, onCancel }) {
  const footer = [];

  const cancelBtn = createElement('button', { type: 'button', className: 'btn btn-outline-secondary btn-sm' });
  cancelBtn.textContent = cancelText;

  const confirmBtn = createElement('button', { type: 'button', className: `btn btn-${variant} btn-sm` });
  confirmBtn.textContent = confirmText;

  footer.push(cancelBtn, confirmBtn);

  const modal = AppModal({
    title,
    content: createElement('p', { className: 'mb-0 text-sm' }, [message]),
    size: 'sm',
    footer,
    onClose: onCancel,
  });

  cancelBtn.addEventListener('click', () => {
    modal.close();
    onCancel?.();
  });

  confirmBtn.addEventListener('click', () => {
    modal.close();
    onConfirm?.();
  });

  return modal;
}
