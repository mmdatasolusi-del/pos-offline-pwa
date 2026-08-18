export function formatCurrency(n) {
  const num = Number(n) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

export function formatStatus(isActive) {
  return isActive
    ? '<span class="badge bg-success px-2 py-1" style="font-size:11px">Aktif</span>'
    : '<span class="badge bg-secondary px-2 py-1" style="font-size:11px">Nonaktif</span>';
}
