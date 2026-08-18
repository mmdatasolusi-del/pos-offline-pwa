import { createElement } from '../../utils/dom-utils.js';

export function AppSelect({ label, options = [], value = '', placeholder = 'Pilih...', name, id, required = false, disabled = false, error, className = '', onChange, attrs = {} }) {
  const wrapper = createElement('div', { className: ['mb-3', className].filter(Boolean).join(' ') });

  if (label) {
    const lbl = createElement('label', { className: 'form-label text-sm fw-medium mb-1', for: id || name });
    lbl.style.color = 'var(--color-text-body)';
    lbl.textContent = label;
    if (required) {
      const star = createElement('span', { className: 'text-danger ms-1' });
      star.textContent = '*';
      lbl.appendChild(star);
    }
    wrapper.appendChild(lbl);
  }

  const select = createElement('select', {
    className: ['form-select', error ? 'is-invalid' : ''].filter(Boolean).join(' '),
    id: id || name,
    name,
    ...(required ? { required: '' } : {}),
    ...(disabled ? { disabled: '' } : {}),
    ...attrs,
  });
  select.style.borderColor = 'var(--color-border)';

  if (placeholder) {
    const opt = createElement('option', { value: '' });
    opt.textContent = placeholder;
    select.appendChild(opt);
  }

  for (const opt of options) {
    const el = createElement('option', { value: opt.value });
    el.textContent = opt.label || opt.text;
    if (opt.value === value) el.selected = true;
    if (opt.disabled) el.disabled = true;
    select.appendChild(el);
  }

  if (onChange) select.addEventListener('change', onChange);

  wrapper.appendChild(select);

  if (error) {
    const errEl = createElement('div', { className: 'invalid-feedback d-block' });
    errEl.textContent = error;
    errEl.style.color = 'var(--color-danger-500)';
    wrapper.appendChild(errEl);
  }

  wrapper.select = select;
  wrapper.getValue = () => select.value;
  wrapper.setValue = (v) => { select.value = v; };
  wrapper.setOptions = (newOptions) => {
    while (select.options.length > (placeholder ? 1 : 0)) {
      select.remove(select.options.length - 1);
    }
    for (const opt of newOptions) {
      const el = createElement('option', { value: opt.value });
      el.textContent = opt.label || opt.text;
      select.appendChild(el);
    }
  };

  return wrapper;
}
