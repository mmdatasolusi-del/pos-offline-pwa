/**
 * Format configuration — pengaturan tampilan angka/tanggal terpusat.
 * Nilai dapat dioverride lewat settings aplikasi (key `format.*`).
 */

export const FORMAT_CONFIG = Object.freeze({
  currency: {
    code: 'IDR',
    locale: 'id-ID',
    symbol: 'Rp',
    decimals: 0,          // Rupiah umumnya tanpa desimal
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
  date: {
    short: 'DD/MM/YYYY',
    medium: 'DD MMM YYYY',
    long: 'DDDD, DD MMMM YYYY',
    time: 'HH:mm',
    dateTime: 'DD/MM/YYYY HH:mm',
  },
  number: {
    locale: 'id-ID',
    quantityDecimals: 2,
  },
  invoice: {
    prefix: 'INV',
    dateFormat: 'YYYYMMDD',
    sequenceLength: 4,
  },
});
