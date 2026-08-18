import { salesRepository } from './sales-repository.js';

class SalesService {
  async getAll(options = {}) {
    return salesRepository.search(options.search, {
      sort: options.sort || ['saleDate', 'desc'],
      pagination: options.pagination || { page: 1, pageSize: 10 },
      paymentStatus: options.paymentStatus,
    });
  }

  async getById(id) {
    const sale = await salesRepository.getById(id);
    if (!sale) return null;
    const [items, payments] = await Promise.all([
      salesRepository.getItems(id),
      salesRepository.getPayments(id),
    ]);
    return { ...sale, items, payments };
  }

  async delete(id) {
    return salesRepository.delete(id);
  }
}

export { SalesService };
export const salesService = new SalesService();
