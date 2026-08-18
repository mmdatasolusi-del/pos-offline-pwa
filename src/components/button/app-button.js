const VARIANT_MAP = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline-primary',
  success: 'btn-success',
  warning: 'btn-warning',
  danger: 'btn-danger',
  ghost: 'btn-link text-decoration-none',
  link: 'btn-link',
};

const SIZE_MAP = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export function AppButton({ label, variant = 'primary', size = 'md', icon, iconPos = 'left', loading = false, disabled = false, fullWidth = false, type = 'button', className = '', onClick, attrs = {} }) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = ['btn', VARIANT_MAP[variant] || VARIANT_MAP.primary, SIZE_MAP[size] || '', fullWidth ? 'w-100' : '', className].filter(Boolean).join(' ');

  if (disabled || loading) btn.disabled = true;
  if (loading) btn.setAttribute('data-loading', '');

  for (const [k, v] of Object.entries(attrs)) {
    btn.setAttribute(k, v);
  }

  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm d-none';
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = '<span class="visually-hidden">Memuat...</span>';

  const iconEl = icon ? createIcon(icon) : null;
  const labelEl = label ? document.createTextNode(label) : null;

  if (loading && iconPos === 'left') {
    btn.appendChild(spinner);
    spinner.classList.remove('d-none');
    btn.appendChild(document.createTextNode(' '));
  } else if (icon && iconPos === 'left') {
    btn.appendChild(iconEl);
    btn.appendChild(document.createTextNode(' '));
  }

  if (labelEl) btn.appendChild(labelEl);

  if (icon && iconPos === 'right') {
    btn.appendChild(document.createTextNode(' '));
    btn.appendChild(iconEl);
  }

  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  btn.setLoading = function (isLoading) {
    const sp = btn.querySelector('.spinner-border');
    if (sp) {
      sp.classList.toggle('d-none', !isLoading);
    }
    btn.disabled = isLoading;
  };

  btn.setDisabled = function (isDisabled) {
    btn.disabled = isDisabled;
  };

  return btn;
}

export function AppIconButton({ icon, variant = 'ghost', size = 'md', label, onClick, disabled = false, className = '', attrs = {} }) {
  const sizePx = { sm: 28, md: 36, lg: 44 }[size] || 36;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = ['btn', VARIANT_MAP[variant] || VARIANT_MAP.ghost, 'd-inline-flex align-items-center justify-content-center p-0 border-0', className].filter(Boolean).join(' ');
  btn.style.width = sizePx + 'px';
  btn.style.height = sizePx + 'px';
  btn.disabled = disabled;
  btn.setAttribute('aria-label', label || '');

  if (label) {
    const tip = document.createElement('span');
    tip.className = 'visually-hidden';
    tip.textContent = label;
    btn.appendChild(tip);
  }

  if (icon) {
    btn.appendChild(createIcon(icon));
  }

  for (const [k, v] of Object.entries(attrs)) {
    btn.setAttribute(k, v);
  }

  if (onClick) btn.addEventListener('click', onClick);

  return btn;
}

function createIcon(name) {
  const i = document.createElement('i');
  i.className = name.includes('bi-') ? name : 'bi bi-' + name;
  return i;
}
