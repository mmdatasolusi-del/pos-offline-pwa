import { inventoryRepository, MOVEMENT_TYPES } from './inventory-repository.js';
import db from '../../database/db.js';

function now() {
  return new Date().toISOString();
}

class InventoryService {
  /** Stok saat ini untuk satu produk (0 jika belum ada record). */
  async getStock(productId) {
    const inv = await inventoryRepository.getByProductId(productId);
    return inv.quantity;
  }

  /** Daftar stok semua produk digabung dengan nama produk. */
  async getStockList() {
    const [stocks, products] = await Promise.all([
      inventoryRepository.getAllStock(),
      db.products.toArray(),
    ]);
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    return stocks
      .filter((s) => byId[s.productId] && !byId[s.productId].deletedAt)
      .map((s) => ({
        productId: s.productId,
        sku: byId[s.productId].sku,
        name: byId[s.productId].name,
        unit: byId[s.productId].unitId || null,
        quantity: s.quantity,
        minStock: byId[s.productId].minStock ?? 0,
        isLow: s.quantity <= (byId[s.productId].minStock ?? 0),
        updatedAt: s.updatedAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Produk dengan stok menipis (quantity <= minStock). */
  async getLowStock() {
    const list = await this.getStockList();
    return list.filter((item) => item.isLow);
  }

  /** Terima stok masuk (mis. dari pembelian). */
  async stockIn({ productId, quantity, unitPrice, referenceType, referenceId, note, userId }) {
    if (!productId || !(Number(quantity) > 0)) {
      return { success: false, errors: ['productId dan quantity (>0) wajib diisi'] };
    }
    const movement = await inventoryRepository.recordMovement({
      productId, type: MOVEMENT_TYPES.IN, quantity: Number(quantity),
      unitPrice, referenceType, referenceId, note, userId,
    });
    return { success: true, data: movement };
  }

  /** Keluarkan stok (mis. penyusutan, pemakaian internal). */
  async stockOut({ productId, quantity, referenceType, referenceId, note, userId }) {
    if (!productId || !(Number(quantity) > 0)) {
      return { success: false, errors: ['productId dan quantity (>0) wajib diisi'] };
    }
    try {
      const movement = await inventoryRepository.recordMovement({
        productId, type: MOVEMENT_TYPES.OUT, quantity: Number(quantity),
        referenceType, referenceId, note, userId,
      });
      return { success: true, data: movement };
    } catch (e) {
      return { success: false, errors: [e.message] };
    }
  }

  /** Koreksi stok manual — selisih dihitung terhadap jumlah sistem. */
  async adjust({ productId, countedQuantity, note, userId }) {
    const current = await this.getStock(productId);
    const target = Number(countedQuantity);
    if (!productId || !Number.isFinite(target) || target < 0) {
      return { success: false, errors: ['productId dan countedQuantity (>=0) wajib diisi'] };
    }
    const delta = target - current;
    if (delta === 0) {
      return { success: true, data: null, message: 'Tidak ada selisih stok' };
    }
    const movement = await inventoryRepository.recordMovement({
      productId, type: MOVEMENT_TYPES.ADJUSTMENT, quantity: delta,
      note: note || `Penyesuaian: ${current} → ${target}`, userId,
    });
    return { success: true, data: movement };
  }

  /** Riwayat pergerakan stok per produk. */
  async getMovementHistory(productId, options = {}) {
    return inventoryRepository.getMovementsByProduct(productId, options);
  }

  /** Nilai total persediaan berdasarkan harga beli. */
  async getStockValue() {
    const [stocks, products] = await Promise.all([
      inventoryRepository.getAllStock(),
      db.products.toArray(),
    ]);
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    let totalCost = 0;
    let totalSell = 0;
    for (const s of stocks) {
      const p = byId[s.productId];
      if (!p || p.deletedAt) continue;
      totalCost += (Number(p.buyPrice) || 0) * s.quantity;
      totalSell += (Number(p.sellPrice) || 0) * s.quantity;
    }
    return { totalCost, totalSell, items: stocks.length };
  }
}

export const inventoryService = new InventoryService();
export { InventoryService, MOVEMENT_TYPES };
