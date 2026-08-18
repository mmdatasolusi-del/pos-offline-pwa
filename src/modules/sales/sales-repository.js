import { BaseRepository } from '../../repositories/base-repository.js';
import db from '../../database/db.js';

class SalesRepository extends BaseRepository {
  constructor() {
    super('sales');
  }

  async search(query, options = {}) {
    const { sort, pagination, paymentStatus, includeDeleted = false } = options;
    let records = await this.table.toArray();

    if (!includeDeleted) {
      records = records.filter(r => !r.deletedAt);
    }

    if (paymentStatus) {
      records = records.filter(r => r.paymentStatus === paymentStatus);
    }

    if (query) {
      const q = query.toLowerCase();
      records = records.filter(r =>
        (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(q)) ||
        (r.customerName && r.customerName.toLowerCase().includes(q))
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

  async getItems(saleId) {
    return db.saleItems.where('saleId').equals(saleId).toArray();
  }

  async getPayments(saleId) {
    return db.payments.where('saleId').equals(saleId).toArray();
  }
}

export { SalesRepository };
export const salesRepository = new SalesRepository();
