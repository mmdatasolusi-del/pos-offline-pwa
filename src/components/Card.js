export function renderCard({ title, body, headerRight, className = '' }) {
  const card = document.createElement('div');
  card.className = `dashboard-card ${className}`;

  let html = '';

  if (title) {
    html += `
      <div class="dashboard-card-header">
        <h3 class="dashboard-card-title">${title}</h3>
        ${headerRight ? `<div>${headerRight}</div>` : ''}
      </div>
    `;
  }

  html += `<div class="dashboard-card-body">${body}</div>`;
  card.innerHTML = html;

  return card;
}
