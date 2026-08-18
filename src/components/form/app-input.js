import { createElement } from '../../utils/dom-utils.js';

export function AppInput({ label, type = 'text', value = '', placeholder = '', name, id, required = false, disabled = false, readonly = false, error, helpText, prefix, className = '', onInput, onChange, onBlur, attrs = {} }) {
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

  const inputGroup = createElement('div', { className: 'd-flex align-items-stretch' });

  if (prefix) {
    const pre = createElement('span', { className: 'd-flex align-items-center px-2 border rounded-start' });
    pre.style.backgroundColor = 'var(--color-gray-50)';
    pre.style.borderColor = 'var(--color-border)';
    pre.textContent = prefix;
    inputGroup.appendChild(pre);
  }

  const input = createElement('input', {
    type,
    className: ['form-control', error ? 'is-invalid' : '', prefix ? 'rounded-0 rounded-end' : ''].filter(Boolean).join(' '),
    id: id || name,
    name,
    placeholder,
    value,
    ...(required ? { required: '' } : {}),
    ...(disabled ? { disabled: '' } : {}),
    ...(readonly ? { readonly: '' } : {}),
    ...attrs,
  });

  input.style.borderColor = 'var(--color-border)';

  if (error) {
    input.setAttribute('aria-invalid', 'true');
  }

  if (onInput) input.addEventListener('input', onInput);
  if (onChange) input.addEventListener('change', onChange);
  if (onBlur) input.addEventListener('blur', onBlur);

  inputGroup.appendChild(input);
  wrapper.appendChild(inputGroup);

  if (error) {
    const errEl = createElement('div', { className: 'invalid-feedback d-block' });
    errEl.textContent = error;
    errEl.style.color = 'var(--color-danger-500)';
    wrapper.appendChild(errEl);
  } else if (helpText) {
    const help = createElement('div', { className: 'form-text text-muted text-sm mt-1' });
    help.textContent = helpText;
    wrapper.appendChild(help);
  }

  wrapper.input = input;

  wrapper.setValue = (v) => { input.value = v; };
  wrapper.getValue = () => input.value;
  wrapper.setError = (msg) => {
    input.classList.toggle('is-invalid', !!msg);
    let errEl = wrapper.querySelector('.invalid-feedback');
    if (msg) {
      if (!errEl) {
        errEl = createElement('div', { className: 'invalid-feedback d-block' });
        errEl.style.color = 'var(--color-danger-500)';
        wrapper.appendChild(errEl);
      }
      errEl.textContent = msg;
    } else {
      errEl?.remove();
    }
  };
  wrapper.setDisabled = (d) => { input.disabled = d; };

  return wrapper;
}

export function AppSearchBox({ value = '', placeholder = 'Cari...', onSearch, debounceMs = 300, className = '' }) {
  const wrapper = createElement('div', { className: ['position-relative', className].filter(Boolean).join(' ') });

  const icon = createElement('i', { className: 'bi bi-search position-absolute text-muted' });
  icon.style.left = '12px';
  icon.style.top = '50%';
  icon.style.transform = 'translateY(-50%)';
  icon.style.zIndex = '5';

  const input = createElement('input', {
    type: 'text',
    className: 'form-control ps-4 pe-4',
    placeholder,
    value,
  });
  input.style.borderColor = 'var(--color-border)';
  input.style.paddingLeft = '36px';

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const val = input.value;
    const clearBtn = wrapper.querySelector('[data-action="clear"]');
    if (clearBtn) {
      clearBtn.classList.toggle('d-none', !val);
    }
    timer = setTimeout(() => onSearch?.(val), debounceMs);
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(input);

  const clearBtn = createElement('button', {
    type: 'button',
    className: 'btn btn-sm position-absolute border-0 d-none',
    'data-action': 'clear',
    'aria-label': 'Hapus pencarian',
  });
  clearBtn.style.right = '4px';
  clearBtn.style.top = '50%';
  clearBtn.style.transform = 'translateY(-50%)';
  clearBtn.style.zIndex = '5';
  clearBtn.style.color = 'var(--color-gray-500)';
  clearBtn.innerHTML = '<i class="bi bi-x"></i>';

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('d-none');
    onSearch?.('');
    input.focus();
  });

  wrapper.appendChild(clearBtn);

  if (value) clearBtn.classList.remove('d-none');

  wrapper.input = input;
  wrapper.getValue = () => input.value;
  wrapper.setValue = (v) => { input.value = v; };

  return wrapper;
}
