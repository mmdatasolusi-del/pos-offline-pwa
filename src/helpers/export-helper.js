/**
 * Export helper — exports data to PDF (jsPDF) and Excel (SheetJS).
 * Both libraries are loaded globally via CDN <script> tags.
 * If a library is unavailable (CDN failed / offline), a warning is logged
 * and the export silently degrades.
 */

const _xlsx = typeof XLSX !== 'undefined' ? XLSX : null;
const _jspdf = typeof jspdf !== 'undefined' ? jspdf : null;

export function isXlsxAvailable() { return _xlsx !== null; }
export function isJsPdfAvailable() { return _jspdf !== null; }

export function exportToExcel(data, filename = 'export.xlsx') {
  if (!_xlsx) { console.warn('[export] XLSX library not loaded'); return; }
  const wb = _xlsx.utils.book_new();
  const ws = _xlsx.utils.json_to_sheet(data);
  _xlsx.utils.book_append_sheet(wb, ws, 'Data');
  _xlsx.writeFile(wb, filename);
}

export function exportToPdf(content, filename = 'export.pdf') {
  if (!_jspdf) { console.warn('[export] jsPDF library not loaded'); return; }
  const doc = new _jspdf.jsPDF();
  doc.text(content, 10, 10);
  doc.save(filename);
}
