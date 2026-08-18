export function renderKPI({ icon, label, value, color = 'blue' }) {
  const card = document.createElement('article');
  card.className = 'kpi-card';

  card.innerHTML = `
    <div class="kpi-icon ${color}"><i class="bi ${icon}"></i></div>
    <div>
      <div class="kpi-value">${value}</div>
      <p class="kpi-label">${label}</p>
    </div>
  `;

  return card;
}
