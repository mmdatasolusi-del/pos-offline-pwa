/**
 * Array utilities — groupBy, sortBy, paginate, unique, chunk.
 */

/**
 * Kelompokkan elemen array berdasarkan kunci hasil fungsi/properti.
 * @param {Array} arr
 * @param {string|Function} keyOrFn - Nama properti atau fungsi penghasil kunci.
 * @returns {Object<string, Array>}
 */
export function groupBy(arr, keyOrFn) {
  const getKey = typeof keyOrFn === 'function'
    ? keyOrFn
    : (item) => item?.[keyOrFn];
  return (arr || []).reduce((acc, item) => {
    const key = String(getKey(item));
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

/**
 * Urutkan salinan array berdasarkan properti/fungsi dan arah.
 * @param {Array} arr
 * @param {string|Function} keyOrFn
 * @param {'asc'|'desc'} [order='asc']
 * @returns {Array} Baru (tidak mengubah array asli).
 */
export function sortBy(arr, keyOrFn, order = 'asc') {
  const getKey = typeof keyOrFn === 'function'
    ? keyOrFn
    : (item) => item?.[keyOrFn];
  const dir = order === 'desc' ? -1 : 1;
  return [...(arr || [])].sort((a, b) => {
    const ka = getKey(a);
    const kb = getKey(b);
    if (ka === kb) return 0;
    if (ka == null) return 1;
    if (kb == null) return -1;
    return (ka > kb ? 1 : -1) * dir;
  });
}

/**
 * Ambil satu halaman dari array.
 * @param {Array} arr
 * @param {number} page - Mulai dari 1.
 * @param {number} pageSize
 * @returns {{items: Array, page: number, pageSize: number, total: number, totalPages: number}}
 */
export function paginate(arr, page = 1, pageSize = 10) {
  const items = arr || [];
  const p = Math.max(1, Math.trunc(page) || 1);
  const size = Math.max(1, Math.trunc(pageSize) || 1);
  const total = items.length;
  const totalPages = Math.ceil(total / size) || 1;
  const safePage = Math.min(p, totalPages);
  return {
    items: items.slice((safePage - 1) * size, safePage * size),
    page: safePage,
    pageSize: size,
    total,
    totalPages,
  };
}

/**
 * Elemen unik berdasarkan properti/fungsi identitas.
 * @param {Array} arr
 * @param {string|Function} [keyOrFn] - Jika tidak diberikan, bandingkan nilai langsung.
 * @returns {Array}
 */
export function unique(arr, keyOrFn) {
  const items = arr || [];
  if (!keyOrFn) return [...new Set(items)];
  const getKey = typeof keyOrFn === 'function'
    ? keyOrFn
    : (item) => item?.[keyOrFn];
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Pecah array menjadi beberapa potongan berukuran size.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array<Array>}
 */
export function chunk(arr, size = 1) {
  const items = arr || [];
  const s = Math.max(1, Math.trunc(size) || 1);
  const out = [];
  for (let i = 0; i < items.length; i += s) {
    out.push(items.slice(i, i + s));
  }
  return out;
}

/**
 * Jumlahkan nilai numerik dari properti/fungsi pada tiap elemen.
 * @param {Array} arr
 * @param {string|Function} keyOrFn
 * @returns {number}
 */
export function sumBy(arr, keyOrFn) {
  const getKey = typeof keyOrFn === 'function'
    ? keyOrFn
    : (item) => item?.[keyOrFn];
  return (arr || []).reduce((acc, item) => acc + (Number(getKey(item)) || 0), 0);
}
