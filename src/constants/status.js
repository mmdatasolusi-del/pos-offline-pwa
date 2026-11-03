/**
 * Status constants — status transaksi, shift, pembelian, pembayaran.
 * Nilai harus konsisten dengan data seed & logika service.
 */

export const SALE_STATUS = Object.freeze({
  DRAFT: 'draft',
  COMPLETED: 'completed',
  VOID: 'void',
});

export const PAYMENT_STATUS = Object.freeze({
  PAID: 'paid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  REFUNDED: 'refunded',
  VOID: 'void',
});

export const SHIFT_STATUS = Object.freeze({
  OPEN: 'open',
  CLOSED: 'closed',
});

export const PURCHASE_STATUS = Object.freeze({
  DRAFT: 'draft',
  ORDERED: 'ordered',
  PARTIAL: 'partial',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
});

/** Label Indonesia untuk badge/table display. */
export const STATUS_LABELS = Object.freeze({
  [SALE_STATUS.DRAFT]: 'Draft',
  [SALE_STATUS.COMPLETED]: 'Selesai',
  [SALE_STATUS.VOID]: 'Batal',
  [PAYMENT_STATUS.PAID]: 'Lunas',
  [PAYMENT_STATUS.PENDING]: 'Menunggu',
  [PAYMENT_STATUS.PARTIAL]: 'Sebagian',
  [PAYMENT_STATUS.REFUNDED]: 'Refund',
  [PAYMENT_STATUS.VOID]: 'Batal',
  [SHIFT_STATUS.OPEN]: 'Berjalan',
  [SHIFT_STATUS.CLOSED]: 'Tutup',
  [PURCHASE_STATUS.DRAFT]: 'Draft',
  [PURCHASE_STATUS.ORDERED]: 'Dipesan',
  [PURCHASE_STATUS.PARTIAL]: 'Diterima Sebagian',
  [PURCHASE_STATUS.RECEIVED]: 'Diterima',
  [PURCHASE_STATUS.CANCELLED]: 'Dibatalkan',
});

export function statusLabel(status) {
  return STATUS_LABELS[status] || status || '-';
}
