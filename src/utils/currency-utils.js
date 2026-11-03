/**
 * Currency utilities — format & parse nilai uang (Rupiah default).
 */

const DEFAULT_LOCALE = 'id-ID';
const DEFAULT_CURRENCY = 'IDR';

/**
 * Format angka menjadi string mata uang.
 * @param {number|string} value - Nilai uang.
 * @param {object} [opts]
 * @param {string} [opts.currency='IDR'] - Kode ISO 4217.
 * @param {string} [opts.locale='id-ID'] - Locale Intl.
 * @param {boolean} [opts.showSymbol=true] - Tampilkan simbol mata uang.
 * @param {number} [opts.fractionDigits] - Desimal (default: 0 untuk IDR, 2 lainnya).
 * @returns {string}
 */
export function formatCurrency(value, opts = {}) {
  const {
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    showSymbol = true,
    fractionDigits,
  } = opts;

  const num = typeof value === 'string' ? parseCurrency(value) : Number(value);
  if (!Number.isFinite(num)) return formatCurrency(0, opts);

  const digits = fractionDigits ?? (currency === DEFAULT_CURRENCY ? 0 : 2);
  return new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(num);
}

/**
 * Parse string mata uang kembali menjadi angka (abaikan simbol & pemisah ribuan).
 * @param {string} str
 * @returns {number} NaN jika tidak valid.
 */
export function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string') return NaN;
  const cleaned = str.replace(/[^\d.,-]/g, '');
  if (!cleaned || /^[-.]?$/.test(cleaned)) return NaN;

  let normalized = cleaned;
  if (cleaned.includes(',')) {
    // Asumsi format id-ID: koma sebagai desimal → jadi titik, buang titik ribuan.
    const lastComma = cleaned.lastIndexOf(',');
    const intPart = cleaned.slice(0, lastComma).replace(/\./g, '');
    const decPart = cleaned.slice(lastComma + 1).replace(/[.,]/g, '');
    normalized = `${intPart}.${decPart}`;
  } else {
    // Titik bisa ribuan (1.000) atau desimal (10.50).
    const dots = (cleaned.match(/\./g) || []).length;
    if (dots > 1) normalized = cleaned.replace(/\./g, '');
    else if (dots === 1 && cleaned.split('.')[1]?.length === 3) {
      normalized = cleaned.replace('.', ''); // kemungkinan ribuan
    }
  }
  const num = Number(normalized);
  return Number.isFinite(num) ? num : NaN;
}

/**
 * Konversi nilai uang ke satuan cents (integer) untuk aritmetika presisi.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number} Integer.
 */
export function toCents(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) || 0) * factor);
}

/**
 * Konversi cents kembali ke nilai uang.
 * @param {number} cents
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function fromCents(cents, decimals = 2) {
  const factor = 10 ** decimals;
  return (Number(cents) || 0) / factor;
}

/**
 * Tambah dua nilai uang dengan aman terhadap floating point.
 * @param {number} a
 * @param {number} b
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function addMoney(a, b, decimals = 2) {
  return fromCents(toCents(a, decimals) + toCents(b, decimals), decimals);
}

/**
 * Kalikan harga dengan qty secara presisi (buang artefak floating point).
 * @param {number} price
 * @param {number} qty
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function multiplyMoney(price, qty, decimals = 2) {
  return fromCents(toCents(price, decimals) * (Number(qty) || 0), decimals);
}
