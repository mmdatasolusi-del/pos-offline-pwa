import { supplierRepository } from './supplier-repository.js';
import { generateUUID } from '../../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

class SupplierService {
  async getAll(options = {}) {
    return supplierRepository.search(options.search, {
      sort: options.sort || ['name', 'asc'],
      pagination: options.pagination || { page: 1, pageSize: 10 },
    });
  }

  async getById(id) {
    return supplierRepository.getById(id);
  }

  async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) return { success: false, errors };

    const code = data.code || await supplierRepository.getNextCode();
    const supplier = {
      id: generateUUID(),
      code,
      name: data.name.trim(),
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      contactPerson: data.contactPerson || '',
      notes: data.notes || '',
      isActive: data.isActive !== false,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    await supplierRepository.create(supplier);
    return { success: true, data: supplier };
  }

  async update(id, changes) {
    const existing = await supplierRepository.getById(id);
    if (!existing) return { success: false, errors: ['Pemasok tidak ditemukan'] };

    const updated = {
      name: changes.name !== undefined ? changes.name.trim() : existing.name,
      phone: changes.phone !== undefined ? changes.phone : existing.phone,
      email: changes.email !== undefined ? changes.email : existing.email,
      address: changes.address !== undefined ? changes.address : existing.address,
      contactPerson: changes.contactPerson !== undefined ? changes.contactPerson : existing.contactPerson,
      notes: changes.notes !== undefined ? changes.notes : existing.notes,
      isActive: changes.isActive !== undefined ? changes.isActive : existing.isActive,
      updatedAt: now(),
    };

    const errors = this.validate(updated);
    if (errors.length > 0) return { success: false, errors };

    await supplierRepository.update(id, updated);
    return { success: true, data: { ...existing, ...updated } };
  }

  async delete(id) {
    return supplierRepository.delete(id);
  }

  validate(data) {
    const errors = [];
    if (!data.name || !data.name.trim()) errors.push('Nama pemasok wajib diisi');
    return errors;
  }
}

export { SupplierService };
export const supplierService = new SupplierService();
