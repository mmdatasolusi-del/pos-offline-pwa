import { createElement } from '../../utils/dom-utils.js';

export function AppToggle({ label, checked = false, disabled = false, name, onChange, className = '' }) {
  const wrapper = createElement('div', { className: ['d-flex align-items-center gap-2', className].filter(Boolean).join(' ') });

  const toggle = createElement('div', {
    className: ['form-check form-switch mb-0', disabled ? 'opacity-50' : ''].filter(Boolean).join(' '),
  });

  const input = createElement('input', {
    type: 'checkbox',
    className: 'form-check-input cursor-pointer',
    role: 'switch',
    name,
    ...(checked ? { checked: '' } : {}),
    ...(disabled ? { disabled: '' } : {}),
  });

  toggle.appendChild(input);

  if (label) {
    const lbl = createElement('label', { className: 'form-check-label text-sm cursor-pointer' });
    lbl.style.color = 'var(--color-text-body)';
    lbl.textContent = label;
    lbl.addEventListener('click', () => {
      if (!disabled) {
        input.checked = !input.checked;
        onChange?.(input.checked);
      }
    });
    toggle.appendChild(lbl);
  }

  input.addEventListener('change', () => onChange?.(input.checked));

  wrapper.appendChild(toggle);

  wrapper.input = input;
  wrapper.checked = () => input.checked;
  wrapper.setChecked = (v) => { input.checked = v; };

  return wrapper;
}
