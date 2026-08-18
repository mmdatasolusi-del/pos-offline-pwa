import { purchaseRepository } from './purchase-repository.js';
import { generateUUID } from '../../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

class PurchaseService {
  async getAll(options = {}) {
    return purchaseRepository.search(options.search, {
      sort: options.sort || ['orderDate', 'desc'],
      pagination: options.pagination || { page: 1, pageSize: 10 },
      status: options.status,
    });
  }

  async getById(id) {
    const purchase = await purchaseRepository.getById(id);
    if (!purchase) return null;
    const items = await purchaseRepository.getItems(id);
    return { ...purchase, items };
  }

  async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) return { success: false, errors };

    if (!data.items || data.items.length === 0) {
      return { success: false, errors: ['Minimal satu item barang wajib ditambahkan'] };
    }

    const poNumber = await purchaseRepository.getNextPONumber();

    const itemTotal = data.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    }, 0);
    const tax = Number(data.tax) || 0;
    const grandTotal = itemTotal + tax;

    const purchase = {
      id: generateUUID(),
      poNumber,
      supplierId: data.supplierId || null,
      supplierName: data.supplierName || '',
      userId: data.userId || null,
      status: 'ordered',
      orderDate: data.orderDate || now(),
      subtotal: itemTotal,
      tax,
      grandTotal,
      notes: data.notes || '',
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    await purchaseRepository.create(purchase);

    const items = data.items.map(item => ({
      id: generateUUID(),
      purchaseId: purchase.id,
      productId: item.productId,
      productName: item.productName || '',
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      subtotal: (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    }));

    await purchaseRepository.addItems(items);

    return { success: true, data: { ...purchase, items } };
  }

  async updateStatus(id, status) {
    const existing = await purchaseRepository.getById(id);
    if (!existing) return { success: false, errors: ['Pembelian tidak ditemukan'] };

    const validTransitions = {
      ordered: ['received', 'cancelled'],
      received: ['cancelled'],
      cancelled: [],
      draft: ['ordered', 'cancelled'],
    };

    const allowed = validTransitions[existing.status] || [];
    if (!allowed.includes(status)) {
      return { success: false, errors: [`Status tidak dapat berubah dari ${existing.status} ke ${status}`] };
    }

    await purchaseRepository.update(id, { status, updatedAt: now() });
    return { success: true, data: { ...existing, status } };
  }

  async delete(id) {
    return purchaseRepository.delete(id);
  }

  validate(data) {
    const errors = [];
    if (!data.supplierId) errors.push('Pemasok wajib dipilih');
    return errors;
  }

  async getSuppliers() {
    const all = await purchaseRepository.getAllSuppliers();
    return all.filter(s => !s.deletedAt && s.isActive !== false);
  }

  async getProducts() {
    const all = await purchaseRepository.getAllProducts();
    return all.filter(p => !p.deletedAt && p.isActive !== false);
  }
}

export { PurchaseService };
export const purchaseService = new PurchaseService();
