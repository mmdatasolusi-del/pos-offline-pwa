/**
 * Payment constants — metode & status pembayaran.
 * Nilai `value` konsisten dengan data yang tersimpan di DB (sales.paymentMethod).
 */

export const PAYMENT_METHOD = Object.freeze({
  CASH: 'cash',
  TRANSFER: 'transfer',
  QRIS: 'qris',
  CARD: 'card',
});

export const PAYMENT_METHOD_LABELS = Object.freeze({
  [PAYMENT_METHOD.CASH]: 'Tunai',
  [PAYMENT_METHOD.TRANSFER]: 'Transfer',
  [PAYMENT_METHOD.QRIS]: 'QRIS',
  [PAYMENT_METHOD.CARD]: 'Kartu',
});

export const PAYMENT_STATUS = Object.freeze({
  PAID: 'paid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  REFUNDED: 'refunded',
  VOID: 'void',
});

export const PAYMENT_STATUS_LABELS = Object.freeze({
  [PAYMENT_STATUS.PAID]: 'Lunas',
  [PAYMENT_STATUS.PENDING]: 'Menunggu',
  [PAYMENT_STATUS.PARTIAL]: 'DP / Sebagian',
  [PAYMENT_STATUS.REFUNDED]: 'Refund',
  [PAYMENT_STATUS.VOID]: 'Batal',
});

/** Label metode bayar; fallback ke nilai mentah. */
export function paymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS[method] || method || '-';
}

/** Label status bayar; fallback ke nilai mentah. */
export function paymentStatusLabel(status) {
  return PAYMENT_STATUS_LABELS[status] || status || '-';
}
