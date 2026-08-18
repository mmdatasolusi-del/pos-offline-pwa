import { BaseRepository } from '../../repositories/base-repository.js';

class CustomerRepository extends BaseRepository {
  constructor() {
    super('customers');
  }

  async search(query, options = {}) {
    const { sort, pagination, includeDeleted = false } = options;
    let records = await this.table.toArray();

    if (!includeDeleted) {
      records = records.filter(r => !r.deletedAt);
    }

    if (query) {
      const q = query.toLowerCase();
      records = records.filter(r =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q))
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
}

export { CustomerRepository };
export const customerRepository = new CustomerRepository();
