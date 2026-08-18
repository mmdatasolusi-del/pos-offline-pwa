import { customerRepository } from './customer-repository.js';
import { generateUUID } from '../../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

class CustomerService {
  async getAll(options = {}) {
    return customerRepository.search(options.search, {
      sort: options.sort || ['name', 'asc'],
      pagination: options.pagination || { page: 1, pageSize: 10 },
    });
  }

  async getById(id) {
    return customerRepository.getById(id);
  }

  async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) return { success: false, errors };

    const customer = {
      id: generateUUID(),
      name: data.name.trim(),
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      isMember: data.isMember === true,
      notes: data.notes || '',
      isActive: data.isActive !== false,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    await customerRepository.create(customer);
    return { success: true, data: customer };
  }

  async update(id, changes) {
    const existing = await customerRepository.getById(id);
    if (!existing) return { success: false, errors: ['Pelanggan tidak ditemukan'] };

    const updated = {
      name: changes.name !== undefined ? changes.name.trim() : existing.name,
      phone: changes.phone !== undefined ? changes.phone : existing.phone,
      email: changes.email !== undefined ? changes.email : existing.email,
      address: changes.address !== undefined ? changes.address : existing.address,
      isMember: changes.isMember !== undefined ? changes.isMember : existing.isMember,
      notes: changes.notes !== undefined ? changes.notes : existing.notes,
      isActive: changes.isActive !== undefined ? changes.isActive : existing.isActive,
      updatedAt: now(),
    };

    const errors = this.validate(updated);
    if (errors.length > 0) return { success: false, errors };

    await customerRepository.update(id, updated);
    return { success: true, data: { ...existing, ...updated } };
  }

  async delete(id) {
    return customerRepository.delete(id);
  }

  validate(data) {
    const errors = [];
    if (!data.name || !data.name.trim()) errors.push('Nama pelanggan wajib diisi');
    return errors;
  }
}

export { CustomerService };
export const customerService = new CustomerService();
