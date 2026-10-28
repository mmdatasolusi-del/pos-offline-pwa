/**
 * String utilities — kapitalisasi, slug, truncate, strip HTML.
 */

/**
 * Kapitalisasi huruf pertama (default) atau setiap kata (mode 'words').
 * @param {string} str
 * @param {'first'|'words'} [mode='first']
 * @returns {string}
 */
export function capitalize(str, mode = 'first') {
  if (typeof str !== 'string' || str.length === 0) return '';
  if (mode === 'words') {
    return str.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Ubah string menjadi slug URL-friendly.
 * "Kopi Susu Gula Aren!" → "kopi-susu-gula-aren"
 * @param {string} str
 * @param {string} [separator='-']
 * @returns {string}
 */
export function slugify(str, separator = '-') {
  if (typeof str !== 'string') return '';
  return str
    .normalize('NFKD') // pisahkan aksen
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '');
}

/**
 * Potong string hingga panjang maksimum, tambahkan elipsis.
 * @param {string} str
 * @param {number} [maxLength=100]
 * @param {string} [suffix='…']
 * @returns {string}
 */
export function truncate(str, maxLength = 100, suffix = '…') {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, Math.max(0, maxLength - suffix.length)).trimEnd() + suffix;
}

/**
 * Hilangkan semua tag HTML dari string.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape karakter HTML agar aman disisipkan ke innerHTML.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Cek apakah string kosong / hanya whitespace.
 * @param {string} str
 * @returns {boolean}
 */
export function isBlank(str) {
  return typeof str !== 'string' || str.trim().length === 0;
}
