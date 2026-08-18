import { productRepository } from './product-repository.js';
import { generateUUID } from '../../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

class ProductService {
  async getAll(options = {}) {
    return productRepository.search(options.search, {
      sort: options.sort || ['name', 'asc'],
      pagination: options.pagination || { page: 1, pageSize: 10 },
    });
  }

  async getById(id) {
    return productRepository.getById(id);
  }

  async create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) return { success: false, errors };

    const sku = data.sku || await productRepository.getNextSku();
    const existing = await this.findBySku(sku);
    if (existing) return { success: false, errors: ['Kode produk sudah digunakan'] };

    const product = {
      id: generateUUID(),
      sku,
      barcode: data.barcode || '',
      name: data.name.trim(),
      categoryId: data.categoryId || null,
      unitId: data.unitId || null,
      buyPrice: Number(data.buyPrice) || 0,
      sellPrice: Number(data.sellPrice) || 0,
      stock: Number(data.stock) || 0,
      minStock: Number(data.minStock) || 0,
      supplierId: data.supplierId || null,
      isActive: data.isActive !== false,
      type: data.type || 'product',
      image: data.image || null,
      description: data.description || '',
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    await productRepository.create(product);
    return { success: true, data: product };
  }

  async update(id, changes) {
    const existing = await productRepository.getById(id);
    if (!existing) return { success: false, errors: ['Produk tidak ditemukan'] };

    const updated = {
      sku: changes.sku ?? existing.sku,
      barcode: changes.barcode ?? existing.barcode,
      name: changes.name !== undefined ? changes.name.trim() : existing.name,
      categoryId: changes.categoryId !== undefined ? changes.categoryId : existing.categoryId,
      unitId: changes.unitId !== undefined ? changes.unitId : existing.unitId,
      buyPrice: changes.buyPrice !== undefined ? Number(changes.buyPrice) : existing.buyPrice,
      sellPrice: changes.sellPrice !== undefined ? Number(changes.sellPrice) : existing.sellPrice,
      stock: changes.stock !== undefined ? Number(changes.stock) : existing.stock,
      minStock: changes.minStock !== undefined ? Number(changes.minStock) : existing.minStock,
      supplierId: changes.supplierId !== undefined ? changes.supplierId : existing.supplierId,
      isActive: changes.isActive !== undefined ? changes.isActive : existing.isActive,
      image: changes.image !== undefined ? changes.image : existing.image,
      description: changes.description !== undefined ? changes.description : existing.description,
      updatedAt: now(),
    };

    const errors = this.validate(updated);
    if (errors.length > 0) return { success: false, errors };

    if (updated.sku !== existing.sku) {
      const dup = await this.findBySku(updated.sku);
      if (dup && dup.id !== id) return { success: false, errors: ['Kode produk sudah digunakan'] };
    }

    await productRepository.update(id, updated);
    return { success: true, data: { ...existing, ...updated } };
  }

  async delete(id) {
    return productRepository.delete(id);
  }

  async findBySku(sku) {
    if (!sku) return null;
    const all = await productRepository.table.toArray();
    return all.find(p => p.sku === sku && !p.deletedAt) || null;
  }

  validate(data) {
    const errors = [];
    if (!data.name || !data.name.trim()) errors.push('Nama produk wajib diisi');
    if (data.buyPrice === undefined || data.buyPrice === null || Number(data.buyPrice) < 0) errors.push('Harga beli tidak valid');
    if (data.sellPrice === undefined || data.sellPrice === null || Number(data.sellPrice) < 0) errors.push('Harga jual tidak valid');
    if (data.stock !== undefined && data.stock !== null && Number(data.stock) < 0) errors.push('Stok awal tidak valid');
    if (data.minStock !== undefined && data.minStock !== null && Number(data.minStock) < 0) errors.push('Stok minimum tidak valid');
    return errors;
  }

  async getCategories() {
    return productRepository.getAllCategories();
  }

  async getUnits() {
    return productRepository.getAllUnits();
  }

  async getSuppliers() {
    return productRepository.getAllSuppliers();
  }

  async exportToExcel() {
    const { data } = await productRepository.search('', { pagination: null });
    if (typeof XLSX === 'undefined') { console.warn('[Produk] XLSX library not loaded'); return; }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data.map(p => ({
      'Kode': p.sku, 'Barcode': p.barcode, 'Nama': p.name,
      'Harga Beli': p.buyPrice, 'Harga Jual': p.sellPrice,
      'Stok': p.stock, 'Stok Min': p.minStock, 'Status': p.isActive ? 'Aktif' : 'Nonaktif',
    })));
    XLSX.utils.book_append_sheet(wb, ws, 'Produk');
    XLSX.writeFile(wb, 'produk.xlsx');
  }

  async importFromExcel(file) {
    if (typeof XLSX === 'undefined') throw new Error('XLSX library not loaded');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'array' });
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          const results = { success: 0, failed: 0, errors: [] };
          for (const row of rows) {
            const result = await this.create({
              sku: row['Kode'] || await productRepository.getNextSku(),
              barcode: String(row['Barcode'] || ''),
              name: String(row['Nama'] || ''),
              buyPrice: Number(row['Harga Beli']) || 0,
              sellPrice: Number(row['Harga Jual']) || 0,
              stock: Number(row['Stok']) || 0,
              minStock: Number(row['Stok Min']) || 0,
              isActive: (row['Status'] || 'Aktif') === 'Aktif',
            });
            if (result.success) results.success++;
            else { results.failed++; results.errors.push(`Baris ${results.success + results.failed}: ${result.errors.join(', ')}`); }
          }
          resolve(results);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}

export { ProductService };
export const productService = new ProductService();
