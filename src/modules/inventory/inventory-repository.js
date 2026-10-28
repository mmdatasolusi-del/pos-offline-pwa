import db from '../../database/db.js';
import { BaseRepository } from '../../repositories/base-repository.js';
import { generateUUID } from '../../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

/** Tipe pergerakan stok yang diizinkan. */
export const MOVEMENT_TYPES = Object.freeze({
  IN: 'in',           // penerimaan (pembelian, restock)
  OUT: 'out',         // pengeluaran (penjualan, penyusutan)
  ADJUSTMENT: 'adjustment', // koreksi manual / opname
  RETURN_IN: 'return-in',   // retur pelanggan masuk
  RETURN_OUT: 'return-out', // retur ke supplier keluar
});

class InventoryRepository extends BaseRepository {
  constructor() {
    super('inventories');
    this.movements = db.stockMovements;
  }

  /** Ambil (atau buat) record stok untuk satu produk. */
  async getByProductId(productId) {
    const existing = await this.table.where('productId').equals(productId).first();
    if (existing) return existing;
    const created = {
      id: generateUUID(),
      productId,
      quantity: 0,
      updatedAt: now(),
    };
    await this.table.add(created);
    return created;
  }

  /**
   * Catat pergerakan stok dan terapkan ke tabel inventori dalam satu transaksi.
   * @param {{productId:string, type:string, quantity:number, unitPrice?:number,
   *          referenceType?:string, referenceId?:string, note?:string, userId?:string}} data
   * @returns {Promise<object>} record stockMovement
   */
  async recordMovement(data) {
    const delta = this.deltaOf(data.type, Number(data.quantity) || 0);
    return db.transaction('rw', this.table, this.movements, db.products, async () => {
      const inv = await this.getByProductId(data.productId);
      const newQty = (Number(inv.quantity) || 0) + delta;
      if (newQty < 0) {
        throw new Error('Stok tidak mencukupi untuk pergerakan ini');
      }
      await this.table.update(inv.id, { quantity: newQty, updatedAt: now() });

      const movement = {
        id: generateUUID(),
        productId: data.productId,
        type: data.type,
        quantity: Math.abs(delta),
        direction: delta >= 0 ? 'in' : 'out',
        unitPrice: Number(data.unitPrice) || 0,
        referenceType: data.referenceType || null,
        referenceId: data.referenceId || null,
        note: data.note || '',
        userId: data.userId || null,
        createdAt: now(),
      };
      await this.movements.add(movement);
      return movement;
    });
  }

  deltaOf(type, qty) {
    switch (type) {
      case MOVEMENT_TYPES.IN:
      case MOVEMENT_TYPES.RETURN_IN:
        return Math.abs(qty);
      case MOVEMENT_TYPES.OUT:
      case MOVEMENT_TYPES.RETURN_OUT:
        return -Math.abs(qty);
      case MOVEMENT_TYPES.ADJUSTMENT:
        return qty; // boleh negatif (surplus/defisit)
      default:
        throw new Error(`Tipe pergerakan tidak dikenal: ${type}`);
    }
  }

  /** Riwayat pergerakan per produk (terbaru dulu). */
  async getMovementsByProduct(productId, { limit = 50 } = {}) {
    const rows = await this.movements.where('productId').equals(productId).toArray();
    rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return rows.slice(0, limit);
  }

  /** Semua record stok (untuk daftar stok / laporan). */
  async getAllStock() {
    return this.table.toArray();
  }
}

export const inventoryRepository = new InventoryRepository();
export { InventoryRepository };
