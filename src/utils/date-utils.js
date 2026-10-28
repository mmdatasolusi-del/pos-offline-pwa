/**
 * Date utilities — format & manipulasi tanggal ringan (tanpa library eksternal).
 */

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  if (typeof input === 'string') {
    // "YYYY-MM-DD" dianggap waktu lokal (bukan UTC).
    const m = /^(\d{4})-(\d{2})-(\d{2})([T ].*)?$/.exec(input);
    if (m) {
      const [, y, mo, d, rest] = m;
      const base = new Date(Number(y), Number(mo) - 1, Number(d));
      if (rest) {
        const tm = /(\d{2}):(\d{2})(?::(\d{2}))?/.exec(rest);
        if (tm) base.setHours(Number(tm[1]), Number(tm[2]), Number(tm[3] || 0));
      }
      return base;
    }
  }
  return new Date(input);
}

/**
 * Parse input menjadi Date; mengembalikan null jika tidak valid.
 * @param {Date|string|number} input
 * @returns {Date|null}
 */
export function parseDate(input) {
  const d = toDate(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Format tanggal. Token: YYYY MM MMM MMMM DDD HH mm ss
 * @param {Date|string|number} date
 * @param {string} [pattern='DD/MM/YYYY']
 * @returns {string}
 */
export function formatDate(date, pattern = 'DD/MM/YYYY') {
  const d = parseDate(date);
  if (!d) return '';
  return pattern
    .replace('MMMM', MONTHS_ID[d.getMonth()])
    .replace('MMM', MONTHS_ID[d.getMonth()].slice(0, 3))
    .replace('DDD', DAYS_ID[d.getDay()])
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad2(d.getMonth() + 1))
    .replace('DD', pad2(d.getDate()))
    .replace('HH', pad2(d.getHours()))
    .replace('mm', pad2(d.getMinutes()))
    .replace('ss', pad2(d.getSeconds()));
}

/**
 * Format tanggal + waktu, mis. "28/10/2026 14:30".
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return formatDate(date, 'DD/MM/YYYY HH:mm');
}

/**
 * Format tanggal panjang Indonesia, mis. "Selasa, 28 Oktober 2026".
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateLong(date) {
  return formatDate(date, 'DDD, DD MMMM YYYY');
}

/**
 * Tanggal sebagai string "YYYY-MM-DD" (untuk input type=date & query DB).
 * @param {Date|string|number} [date=new Date()]
 * @returns {string}
 */
export function toISODate(date = new Date()) {
  const d = parseDate(date);
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Rentang tanggal preset.
 * @param {'today'|'yesterday'|'week'|'month'|'last-month'|'year'} range
 * @returns {{start: Date, end: Date}} start pukul 00:00, end pukul 23:59:59.999
 */
export function getDateRange(range) {
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return { start: startOfDay(y), end: endOfDay(y) };
    }
    case 'week': {
      const s = new Date(now);
      s.setDate(s.getDate() - 6);
      return { start: startOfDay(s), end: endOfDay(now) };
    }
    case 'month':
      return {
        start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
        end: endOfDay(now),
      };
    case 'last-month': {
      const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1);
      return { start: startOfDay(prevStart), end: endOfDay(prevEnd) };
    }
    case 'year':
      return { start: startOfDay(new Date(now.getFullYear(), 0, 1)), end: endOfDay(now) };
    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
}

/**
 * Selisih hari antara dua tanggal (a - b).
 * @param {Date|string} a
 * @param {Date|string} b
 * @returns {number}
 */
export function diffInDays(a, b) {
  const da = parseDate(a);
  const db = parseDate(b);
  if (!da || !db) return NaN;
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((da - db) / MS);
}

/**
 * Cek apakah tanggal berada dalam rentang [start, end] inklusif.
 * @param {Date|string} date
 * @param {Date|string} start
 * @param {Date|string} end
 * @returns {boolean}
 */
export function isInRange(date, start, end) {
  const d = parseDate(date);
  const s = parseDate(start);
  const e = parseDate(end);
  if (!d || !s || !e) return false;
  return d >= s && d <= e;
}
