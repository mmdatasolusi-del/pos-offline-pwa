/**
 * Import helper — imports data from Excel (SheetJS) and JSON.
 * SheetJS is loaded globally via CDN <script> tag.
 * If the library is unavailable, a warning is logged.
 */

const _xlsx = typeof XLSX !== 'undefined' ? XLSX : null;

export function isXlsxAvailable() { return _xlsx !== null; }

export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    if (!_xlsx) { reject(new Error('[import] XLSX library not loaded')); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = _xlsx.read(e.target.result, { type: 'array' });
        const data = _xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        resolve(data);
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { resolve(JSON.parse(e.target.result)); }
      catch (err) { reject(err); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
