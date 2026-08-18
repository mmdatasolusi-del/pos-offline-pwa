import { renderKPI } from '../components/KPI.js';
import { renderCard } from '../components/Card.js';

function formatCurrency(n) {
  const num = Number(n) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString('id-ID');
}

function renderActivityList() {
  const activities = [
    { dot: 'blue', text: 'Aplikasi siap digunakan. Database terinisialisasi.', time: 'Sekarang' },
    { dot: 'green', text: 'POS Offline PWA v1.0.0 berjalan.', time: 'Baru saja' },
    { dot: 'amber', text: 'Semua sistem siap. Mulai transaksi pertama Anda.', time: '—' },
  ];

  return `
    <ul class="activity-list">
      ${activities.map(a => `
        <li class="activity-item">
          <div class="activity-dot ${a.dot}"></div>
          <div>
            <p class="activity-text">${a.text}</p>
            <p class="activity-time">${a.time}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

function renderQuickActions() {
  const actions = [
    { icon: 'bi-plus-circle', label: 'Transaksi Baru', href: '#/penjualan' },
    { icon: 'bi-box', label: 'Tambah Produk', href: '#/produk' },
    { icon: 'bi-people', label: 'Tambah Pelanggan', href: '#/pelanggan' },
    { icon: 'bi-file-earmark-bar-graph', label: 'Lihat Laporan', href: '#/laporan' },
  ];

  return `
    <div class="quick-actions">
      ${actions.map(a => `
        <a href="${a.href}" class="quick-action-btn">
          <i class="bi ${a.icon}"></i>
          <span>${a.label}</span>
        </a>
      `).join('')}
    </div>
  `;
}

export async function init(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">Ringkasan bisnis Anda hari ini</p>
  `;
  container.appendChild(header);

  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'kpi-grid';

  const kpis = [
    { icon: 'bi-cart3', label: 'Pendapatan Hari Ini', value: formatCurrency(0), color: 'blue' },
    { icon: 'bi-check-circle', label: 'Total Transaksi', value: formatNumber(0), color: 'green' },
    { icon: 'bi-box', label: 'Jumlah Produk', value: '—', color: 'amber' },
    { icon: 'bi-exclamation-triangle', label: 'Stok Hampir Habis', value: '—', color: 'red' },
  ];

  kpis.forEach(k => kpiGrid.appendChild(renderKPI(k)));
  container.appendChild(kpiGrid);

  const grid = document.createElement('div');
  grid.className = 'dashboard-grid';

  const chartCard = renderCard({
    title: 'Grafik Penjualan',
    body: `
      <div class="chart-placeholder">
        <i class="bi bi-bar-chart-line"></i>
        <span>Grafik akan muncul setelah ada data transaksi</span>
      </div>
    `,
  });

  const activityCard = renderCard({
    title: 'Aktivitas Terbaru',
    body: renderActivityList(),
    headerRight: '<a href="#" class="text-primary text-decoration-none" style="font-size:13px">Lihat Semua</a>',
  });

  grid.appendChild(chartCard);
  grid.appendChild(activityCard);
  container.appendChild(grid);

  const quickSection = document.createElement('div');
  quickSection.style.cssText = 'margin-top:20px';

  const quickCard = renderCard({
    title: 'Aksi Cepat',
    body: renderQuickActions(),
  });

  quickSection.appendChild(quickCard);
  container.appendChild(quickSection);
}
