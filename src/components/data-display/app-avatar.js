const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

const COLORS = [
  '#3B82F6', '#22C55E', '#EAB308', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

export function AppAvatar({ src, name, size = 'md', icon, className = '' }) {
  const px = SIZE_MAP[size] || 32;
  const el = document.createElement('div');
  el.className = ['d-inline-flex align-items-center justify-content-center rounded-circle overflow-hidden flex-shrink-0', className].filter(Boolean).join(' ');
  el.style.width = px + 'px';
  el.style.height = px + 'px';
  el.style.backgroundColor = 'var(--color-gray-200)';
  el.setAttribute('aria-label', name || 'avatar');

  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = name || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    el.appendChild(img);
  } else if (name) {
    const initial = name.charAt(0).toUpperCase();
    const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
    el.style.backgroundColor = COLORS[colorIndex];
    el.style.color = '#fff';
    el.style.fontSize = (px * 0.4) + 'px';
    el.style.fontWeight = '600';
    el.textContent = initial;
  } else if (icon) {
    const i = document.createElement('i');
    i.className = icon.includes('bi-') ? icon : 'bi bi-' + icon;
    i.style.fontSize = (px * 0.5) + 'px';
    i.style.color = 'var(--color-gray-500)';
    el.appendChild(i);
  } else {
    const i = document.createElement('i');
    i.className = 'bi bi-person';
    i.style.fontSize = (px * 0.5) + 'px';
    i.style.color = 'var(--color-gray-500)';
    el.appendChild(i);
  }

  return el;
}
