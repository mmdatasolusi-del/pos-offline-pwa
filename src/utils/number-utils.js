/**
 * Number utilities — pembulatan, clamp, persentase, konversi integer.
 */

/**
 * Bulatkan angka ke jumlah desimal tertentu (aman terhadap artefak floating point).
 * @param {number} value
 * @param {number} [decimals=0]
 * @returns {number}
 */
export function round(value, decimals = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  const factor = 10 ** Math.max(0, Math.min(15, decimals));
  return Math.round((n + Number.EPSILON * n) * factor) / factor;
}

/**
 * Batasi nilai dalam rentang [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  return Math.min(max, Math.max(min, n));
}

/**
 * Hitung persentase bagian dari total (0–100), dibulatkan 2 desimal.
 * Mengembalikan 0 jika total nol.
 * @param {number} part
 * @param {number} total
 * @returns {number}
 */
export function percentage(part, total) {
  const p = Number(part);
  const t = Number(total);
  if (!Number.isFinite(p) || !Number.isFinite(t) || t === 0) return 0;
  return round((p / t) * 100, 2);
}

/**
 * Konversi ke integer (truncate ke arah nol); NaN → default.
 * @param {number|string} value
 * @param {number} [fallback=0]
 * @returns {number}
 */
export function toInteger(value, fallback = 0) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

/**
 * Konversi ke float; NaN → default.
 * @param {number|string} value
 * @param {number} [fallback=0]
 * @returns {number}
 */
export function toFloat(value, fallback = 0) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? fallback : n;
}

/**
 * Format angka dengan pemisah ribuan locale (tanpa simbol mata uang).
 * @param {number} value
 * @param {number} [decimals=0]
 * @param {string} [locale='id-ID']
 * @returns {string}
 */
export function formatNumber(value, decimals = 0, locale = 'id-ID') {
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}
