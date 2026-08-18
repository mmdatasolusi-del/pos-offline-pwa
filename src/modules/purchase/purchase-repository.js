import { BaseRepository } from '../../repositories/base-repository.js';
import db from '../../database/db.js';

class PurchaseRepository extends BaseRepository {
  constructor() {
    super('purchases');
  }

  async search(query, options = {}) {
    const { sort, pagination, status, includeDeleted = false } = options;
    let records = await this.table.toArray();

    if (!includeDeleted) {
      records = records.filter(r => !r.deletedAt);
    }

    if (status) {
      records = records.filter(r => r.status === status);
    }

    if (query) {
      const q = query.toLowerCase();
      records = records.filter(r =>
        (r.poNumber && r.poNumber.toLowerCase().includes(q)) ||
        (r.supplierName && r.supplierName.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    const total = records.length;

    if (sort) {
      const [field, order] = Array.isArray(sort) ? sort : [sort, 'asc'];
      records.sort((a, b) => {
        const aVal = a[field]; const bVal = b[field];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1; if (bVal == null) return -1;
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return order === 'desc' ? -cmp : cmp;
      });
    }

    if (pagination) {
      const { page = 1, pageSize = 10 } = pagination;
      const offset = (page - 1) * pageSize;
      records = records.slice(offset, offset + pageSize);
    }

    return {
      data: records,
      total,
      page: pagination?.page ?? 1,
      pageSize: pagination?.pageSize ?? total,
      totalPages: pagination?.pageSize ? Math.ceil(total / pagination.pageSize) : 1,
    };
  }

  async getItems(purchaseId) {
    return db.purchaseItems.where('purchaseId').equals(purchaseId).toArray();
  }

  async addItems(items) {
    await db.purchaseItems.bulkAdd(items);
  }

  async deleteItems(purchaseId) {
    const items = await db.purchaseItems.where('purchaseId').equals(purchaseId).toArray();
    await db.purchaseItems.bulkDelete(items.map(i => i.id));
  }

  async getNextPONumber() {
    const all = await this.table.toArray();
    const existing = all
      .map(p => p.poNumber)
      .filter(s => s && s.startsWith('PO-'))
      .sort()
      .pop();
    if (!existing) return 'PO-0001';
    const num = parseInt(existing.split('-')[1], 10);
    return 'PO-' + String(num + 1).padStart(4, '0');
  }

  async getAllSuppliers() {
    return db.suppliers.toArray();
  }

  async getAllProducts() {
    return db.products.toArray();
  }
}

export { PurchaseRepository };
export const purchaseRepository = new PurchaseRepository();
