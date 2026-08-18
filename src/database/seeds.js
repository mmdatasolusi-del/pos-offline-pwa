import db from './db.js';
import { generateUUID } from '../utils/id-utils.js';

function now() {
  return new Date().toISOString();
}

function baseRecord() {
  return { createdAt: now(), updatedAt: now(), deletedAt: null };
}

const CATEGORIES = [
  { id: 'cat-makanan', name: 'Makanan', parentId: null, isActive: true },
  { id: 'cat-minuman', name: 'Minuman', parentId: null, isActive: true },
  { id: 'cat-snack', name: 'Snack', parentId: null, isActive: true },
  { id: 'cat-sembako', name: 'Sembako', parentId: null, isActive: true },
  { id: 'cat-rumah', name: 'Perlengkapan Rumah', parentId: null, isActive: true },
];

const UNITS = [
  { id: 'unit-pcs', name: 'Pcs', abbreviation: 'pcs', isActive: true },
  { id: 'unit-kg', name: 'Kg', abbreviation: 'kg', isActive: true },
  { id: 'unit-liter', name: 'Liter', abbreviation: 'Ltr', isActive: true },
  { id: 'unit-pack', name: 'Pack', abbreviation: 'Pack', isActive: true },
  { id: 'unit-box', name: 'Box', abbreviation: 'Box', isActive: true },
  { id: 'unit-dus', name: 'Dus', abbreviation: 'Dus', isActive: true },
];

const SUPPLIERS = [
  { id: 'sup-makmur', code: 'SUP-001', name: 'PT Sumber Makmur', phone: '021-5550001', isActive: true },
  { id: 'sup-usaha', code: 'SUP-002', name: 'CV Usaha Jaya', phone: '021-5550002', isActive: true },
  { id: 'sup-abc', code: 'SUP-003', name: 'Toko ABC', phone: '021-5550003', isActive: true },
];

const PRODUCTS = [
  { id: 'prd-001', sku: 'PRD-0001', barcode: '8991001001001', name: 'Beras Premium 5kg', categoryId: 'cat-sembako', unitId: 'unit-kg', buyPrice: 55000, sellPrice: 65000, stock: 50, minStock: 10, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-002', sku: 'PRD-0002', barcode: '8991001001002', name: 'Gula Pasir 1kg', categoryId: 'cat-sembako', unitId: 'unit-kg', buyPrice: 12000, sellPrice: 15000, stock: 100, minStock: 20, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-003', sku: 'PRD-0003', barcode: '8991001001003', name: 'Minyak Goreng 2L', categoryId: 'cat-sembako', unitId: 'unit-liter', buyPrice: 22000, sellPrice: 27000, stock: 40, minStock: 10, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-004', sku: 'PRD-0004', barcode: '8991001001004', name: 'Telur Ayam 1kg', categoryId: 'cat-makanan', unitId: 'unit-kg', buyPrice: 18000, sellPrice: 22000, stock: 30, minStock: 5, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-005', sku: 'PRD-0005', barcode: '8991001001005', name: 'Kopi Bubuk 200g', categoryId: 'cat-minuman', unitId: 'unit-pcs', buyPrice: 15000, sellPrice: 20000, stock: 60, minStock: 10, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-006', sku: 'PRD-0006', barcode: '8991001001006', name: 'Teh Celup 25s', categoryId: 'cat-minuman', unitId: 'unit-pack', buyPrice: 5000, sellPrice: 7500, stock: 80, minStock: 15, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-007', sku: 'PRD-0007', barcode: '8991001001007', name: 'Mie Instan Goreng', categoryId: 'cat-makanan', unitId: 'unit-pack', buyPrice: 2500, sellPrice: 3500, stock: 200, minStock: 50, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-008', sku: 'PRD-0008', barcode: '8991001001008', name: 'Kecap Manis 600ml', categoryId: 'cat-makanan', unitId: 'unit-pcs', buyPrice: 8000, sellPrice: 11000, stock: 45, minStock: 10, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-009', sku: 'PRD-0009', barcode: '8991001001009', name: 'Sabun Mandi 80g', categoryId: 'cat-rumah', unitId: 'unit-pcs', buyPrice: 3000, sellPrice: 4500, stock: 120, minStock: 20, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-010', sku: 'PRD-0010', barcode: '8991001001010', name: 'Shampo Sachet 12ml', categoryId: 'cat-rumah', unitId: 'unit-pcs', buyPrice: 500, sellPrice: 1000, stock: 500, minStock: 100, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-011', sku: 'PRD-0011', barcode: '8991001001011', name: 'Keripik Kentang 150g', categoryId: 'cat-snack', unitId: 'unit-pcs', buyPrice: 7000, sellPrice: 10000, stock: 35, minStock: 10, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-012', sku: 'PRD-0012', barcode: '8991001001012', name: 'Biskuit Coklat 200g', categoryId: 'cat-snack', unitId: 'unit-pcs', buyPrice: 9000, sellPrice: 12500, stock: 40, minStock: 8, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-013', sku: 'PRD-0013', barcode: '8991001001013', name: 'Air Mineral 600ml', categoryId: 'cat-minuman', unitId: 'unit-pcs', buyPrice: 1500, sellPrice: 3000, stock: 150, minStock: 30, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-014', sku: 'PRD-0014', barcode: '8991001001014', name: 'Tepung Terigu 1kg', categoryId: 'cat-sembako', unitId: 'unit-kg', buyPrice: 9000, sellPrice: 12000, stock: 55, minStock: 10, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-015', sku: 'PRD-0015', barcode: '8991001001015', name: 'Susu Kental Manis 370g', categoryId: 'cat-minuman', unitId: 'unit-pcs', buyPrice: 8000, sellPrice: 11000, stock: 60, minStock: 15, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-016', sku: 'PRD-0016', barcode: '8991001001016', name: 'Pasta Gigi 120g', categoryId: 'cat-rumah', unitId: 'unit-pcs', buyPrice: 6000, sellPrice: 9000, stock: 70, minStock: 15, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-017', sku: 'PRD-0017', barcode: '8991001001017', name: 'Saos Sambal 300ml', categoryId: 'cat-makanan', unitId: 'unit-pcs', buyPrice: 7000, sellPrice: 10000, stock: 25, minStock: 8, supplierId: 'sup-usaha', isActive: true, type: 'product' },
  { id: 'prd-018', sku: 'PRD-0018', barcode: '8991001001018', name: 'Margarin 200g', categoryId: 'cat-makanan', unitId: 'unit-pcs', buyPrice: 4000, sellPrice: 6500, stock: 35, minStock: 10, supplierId: 'sup-makmur', isActive: true, type: 'product' },
  { id: 'prd-019', sku: 'PRD-0019', barcode: '8991001001019', name: 'Detergen Bubuk 800g', categoryId: 'cat-rumah', unitId: 'unit-pcs', buyPrice: 11000, sellPrice: 15000, stock: 20, minStock: 5, supplierId: 'sup-abc', isActive: true, type: 'product' },
  { id: 'prd-020', sku: 'PRD-0020', barcode: '8991001001020', name: 'Permen Gula', categoryId: 'cat-snack', unitId: 'unit-pack', buyPrice: 2000, sellPrice: 3000, stock: 100, minStock: 20, supplierId: 'sup-abc', isActive: true, type: 'product' },
];

const PURCHASES = [
  { id: 'po-001', poNumber: 'PO-0001', supplierId: 'sup-makmur', supplierName: 'PT Sumber Makmur', userId: null, status: 'received', orderDate: new Date(Date.now() - 7 * 86400000).toISOString(), subtotal: 1375000, tax: 0, grandTotal: 1375000, notes: 'Stok bulanan' },
  { id: 'po-002', poNumber: 'PO-0002', supplierId: 'sup-usaha', supplierName: 'CV Usaha Jaya', userId: null, status: 'received', orderDate: new Date(Date.now() - 3 * 86400000).toISOString(), subtotal: 840000, tax: 0, grandTotal: 840000, notes: '' },
  { id: 'po-003', poNumber: 'PO-0003', supplierId: 'sup-abc', supplierName: 'Toko ABC', userId: null, status: 'ordered', orderDate: new Date(Date.now() - 1 * 86400000).toISOString(), subtotal: 520000, tax: 0, grandTotal: 520000, notes: 'PO mingguan' },
];

const PURCHASE_ITEMS = [
  { id: 'poi-001', purchaseId: 'po-001', productId: 'prd-001', productName: 'Beras Premium 5kg', quantity: 10, unitPrice: 55000, subtotal: 550000 },
  { id: 'poi-002', purchaseId: 'po-001', productId: 'prd-002', productName: 'Gula Pasir 1kg', quantity: 20, unitPrice: 12000, subtotal: 240000 },
  { id: 'poi-003', purchaseId: 'po-001', productId: 'prd-003', productName: 'Minyak Goreng 2L', quantity: 10, unitPrice: 22000, subtotal: 220000 },
  { id: 'poi-004', purchaseId: 'po-001', productId: 'prd-007', productName: 'Mie Instan Goreng', quantity: 50, unitPrice: 2500, subtotal: 125000 },
  { id: 'poi-005', purchaseId: 'po-001', productId: 'prd-013', productName: 'Air Mineral 600ml', quantity: 24, unitPrice: 1500, subtotal: 36000 },
  { id: 'poi-006', purchaseId: 'po-002', productId: 'prd-004', productName: 'Telur Ayam 1kg', quantity: 15, unitPrice: 18000, subtotal: 270000 },
  { id: 'poi-007', purchaseId: 'po-002', productId: 'prd-014', productName: 'Tepung Terigu 1kg', quantity: 20, unitPrice: 9000, subtotal: 180000 },
  { id: 'poi-008', purchaseId: 'po-002', productId: 'prd-005', productName: 'Kopi Bubuk 200g', quantity: 10, unitPrice: 15000, subtotal: 150000 },
  { id: 'poi-009', purchaseId: 'po-002', productId: 'prd-018', productName: 'Margarin 200g', quantity: 30, unitPrice: 4000, subtotal: 120000 },
  { id: 'poi-010', purchaseId: 'po-002', productId: 'prd-006', productName: 'Teh Celup 25s', quantity: 15, unitPrice: 5000, subtotal: 75000 },
  { id: 'poi-011', purchaseId: 'po-003', productId: 'prd-009', productName: 'Sabun Mandi 80g', quantity: 25, unitPrice: 3000, subtotal: 75000 },
  { id: 'poi-012', purchaseId: 'po-003', productId: 'prd-011', productName: 'Keripik Kentang 150g', quantity: 20, unitPrice: 7000, subtotal: 140000 },
  { id: 'poi-013', purchaseId: 'po-003', productId: 'prd-012', productName: 'Biskuit Coklat 200g', quantity: 15, unitPrice: 9000, subtotal: 135000 },
  { id: 'poi-014', purchaseId: 'po-003', productId: 'prd-016', productName: 'Pasta Gigi 120g', quantity: 20, unitPrice: 6000, subtotal: 120000 },
  { id: 'poi-015', purchaseId: 'po-003', productId: 'prd-020', productName: 'Permen Gula', quantity: 25, unitPrice: 2000, subtotal: 50000 },
];

const SALES = [
  { id: 'sls-001', invoiceNumber: 'INV-20260101-0001', customerId: null, customerName: 'Umum', userId: null, shiftId: null, paymentStatus: 'paid', paymentMethod: 'cash', saleDate: new Date(Date.now() - 6 * 86400000).toISOString(), subtotal: 143000, grandTotal: 143000 },
  { id: 'sls-002', invoiceNumber: 'INV-20260102-0002', customerId: null, customerName: 'Umum', userId: null, shiftId: null, paymentStatus: 'paid', paymentMethod: 'cash', saleDate: new Date(Date.now() - 5 * 86400000).toISOString(), subtotal: 227000, grandTotal: 227000 },
  { id: 'sls-003', invoiceNumber: 'INV-20260103-0003', customerId: null, customerName: 'Toko ABC', userId: null, shiftId: null, paymentStatus: 'paid', paymentMethod: 'transfer', saleDate: new Date(Date.now() - 4 * 86400000).toISOString(), subtotal: 325000, grandTotal: 325000 },
  { id: 'sls-004', invoiceNumber: 'INV-20260104-0004', customerId: null, customerName: 'Umum', userId: null, shiftId: null, paymentStatus: 'paid', paymentMethod: 'qris', saleDate: new Date(Date.now() - 2 * 86400000).toISOString(), subtotal: 98000, grandTotal: 98000 },
  { id: 'sls-005', invoiceNumber: 'INV-20260105-0005', customerId: null, customerName: 'Umum', userId: null, shiftId: null, paymentStatus: 'paid', paymentMethod: 'cash', saleDate: new Date(Date.now() - 1 * 86400000).toISOString(), subtotal: 510000, grandTotal: 510000 },
];

const SALE_ITEMS = [
  { id: 'sli-001', saleId: 'sls-001', productId: 'prd-013', productName: 'Air Mineral 600ml', quantity: 2, unitPrice: 3000, subtotal: 6000 },
  { id: 'sli-002', saleId: 'sls-001', productId: 'prd-007', productName: 'Mie Instan Goreng', quantity: 5, unitPrice: 3500, subtotal: 17500 },
  { id: 'sli-003', saleId: 'sls-001', productId: 'prd-001', productName: 'Beras Premium 5kg', quantity: 1, unitPrice: 65000, subtotal: 65000 },
  { id: 'sli-004', saleId: 'sls-001', productId: 'prd-020', productName: 'Permen Gula', quantity: 10, unitPrice: 3000, subtotal: 30000 },
  { id: 'sli-005', saleId: 'sls-001', productId: 'prd-009', productName: 'Sabun Mandi 80g', quantity: 3, unitPrice: 4500, subtotal: 13500 },
  { id: 'sli-006', saleId: 'sls-001', productId: 'prd-005', productName: 'Kopi Bubuk 200g', quantity: 1, unitPrice: 20000, subtotal: 20000 },
  { id: 'sli-007', saleId: 'sls-002', productId: 'prd-003', productName: 'Minyak Goreng 2L', quantity: 3, unitPrice: 27000, subtotal: 81000 },
  { id: 'sli-008', saleId: 'sls-002', productId: 'prd-004', productName: 'Telur Ayam 1kg', quantity: 2, unitPrice: 22000, subtotal: 44000 },
  { id: 'sli-009', saleId: 'sls-002', productId: 'prd-002', productName: 'Gula Pasir 1kg', quantity: 2, unitPrice: 15000, subtotal: 30000 },
  { id: 'sli-010', saleId: 'sls-002', productId: 'prd-006', productName: 'Teh Celup 25s', quantity: 3, unitPrice: 7500, subtotal: 22500 },
  { id: 'sli-011', saleId: 'sls-002', productId: 'prd-017', productName: 'Saos Sambal 300ml', quantity: 2, unitPrice: 10000, subtotal: 20000 },
  { id: 'sli-012', saleId: 'sls-002', productId: 'prd-020', productName: 'Permen Gula', quantity: 5, unitPrice: 3000, subtotal: 15000 },
  { id: 'sli-013', saleId: 'sls-002', productId: 'prd-011', productName: 'Keripik Kentang 150g', quantity: 1, unitPrice: 10000, subtotal: 10000 },
  { id: 'sli-014', saleId: 'sls-002', productId: 'prd-015', productName: 'Susu Kental Manis 370g', quantity: 2, unitPrice: 11000, subtotal: 22000 },
  { id: 'sli-015', saleId: 'sls-003', productId: 'prd-001', productName: 'Beras Premium 5kg', quantity: 5, unitPrice: 65000, subtotal: 325000 },
  { id: 'sli-016', saleId: 'sls-004', productId: 'prd-007', productName: 'Mie Instan Goreng', quantity: 10, unitPrice: 3500, subtotal: 35000 },
  { id: 'sli-017', saleId: 'sls-004', productId: 'prd-020', productName: 'Permen Gula', quantity: 15, unitPrice: 3000, subtotal: 45000 },
  { id: 'sli-018', saleId: 'sls-004', productId: 'prd-013', productName: 'Air Mineral 600ml', quantity: 6, unitPrice: 3000, subtotal: 18000 },
  { id: 'sli-019', saleId: 'sls-005', productId: 'prd-002', productName: 'Gula Pasir 1kg', quantity: 10, unitPrice: 15000, subtotal: 150000 },
  { id: 'sli-020', saleId: 'sls-005', productId: 'prd-003', productName: 'Minyak Goreng 2L', quantity: 5, unitPrice: 27000, subtotal: 135000 },
  { id: 'sli-021', saleId: 'sls-005', productId: 'prd-005', productName: 'Kopi Bubuk 200g', quantity: 3, unitPrice: 20000, subtotal: 60000 },
  { id: 'sli-022', saleId: 'sls-005', productId: 'prd-012', productName: 'Biskuit Coklat 200g', quantity: 2, unitPrice: 12500, subtotal: 25000 },
  { id: 'sli-023', saleId: 'sls-005', productId: 'prd-019', productName: 'Detergen Bubuk 800g', quantity: 4, unitPrice: 15000, subtotal: 60000 },
  { id: 'sli-024', saleId: 'sls-005', productId: 'prd-016', productName: 'Pasta Gigi 120g', quantity: 5, unitPrice: 9000, subtotal: 45000 },
  { id: 'sli-025', saleId: 'sls-005', productId: 'prd-009', productName: 'Sabun Mandi 80g', quantity: 7, unitPrice: 4500, subtotal: 31500 },
];

const SETTINGS = [
  { id: generateUUID(), key: 'store-name', value: 'Toko Saya', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'store-address', value: '', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'store-phone', value: '', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'pos-default-payment', value: 'CASH', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'tax-default-rate', value: 0, type: 'number', isEditable: true },
  { id: generateUUID(), key: 'app-theme', value: 'light', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'shift-enabled', value: false, type: 'boolean', isEditable: true },
  { id: generateUUID(), key: 'currency', value: 'IDR', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'locale', value: 'id-ID', type: 'string', isEditable: false },
  { id: generateUUID(), key: 'timezone', value: 'Asia/Jakarta', type: 'string', isEditable: false },
  { id: generateUUID(), key: 'invoice-prefix', value: 'INV', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'po-prefix', value: 'PO', type: 'string', isEditable: true },
  { id: generateUUID(), key: 'allow-negative-stock', value: false, type: 'boolean', isEditable: true },
];

export async function seedDatabase() {
  let seeded = false;

  if (await seedSettings()) { seeded = true; }
  if (await seedCategories()) { seeded = true; }
  if (await seedUnits()) { seeded = true; }
  if (await seedSuppliers()) { seeded = true; }
  if (await seedProducts()) { seeded = true; }
  if (await seedPurchases()) { seeded = true; }
  if (await seedSales()) { seeded = true; }

  return seeded;
}

async function seedCategories() {
  const count = await db.categories.count();
  if (count > 0) return false;
  const records = CATEGORIES.map(s => ({ ...s, ...baseRecord() }));
  await db.categories.bulkAdd(records);
  console.log('[SEED] categories: ' + CATEGORIES.length + ' records inserted');
  return true;
}

async function seedUnits() {
  const count = await db.units.count();
  if (count > 0) return false;
  const records = UNITS.map(s => ({ ...s, ...baseRecord() }));
  await db.units.bulkAdd(records);
  console.log('[SEED] units: ' + UNITS.length + ' records inserted');
  return true;
}

async function seedSuppliers() {
  const count = await db.suppliers.count();
  if (count > 0) return false;
  const records = SUPPLIERS.map(s => ({ ...s, ...baseRecord() }));
  await db.suppliers.bulkAdd(records);
  console.log('[SEED] suppliers: ' + SUPPLIERS.length + ' records inserted');
  return true;
}

async function seedProducts() {
  const count = await db.products.count();
  if (count > 0) return false;
  const records = PRODUCTS.map(s => ({ ...s, ...baseRecord() }));
  await db.products.bulkAdd(records);
  console.log('[SEED] products: ' + PRODUCTS.length + ' records inserted');
  return true;
}

async function seedPurchases() {
  const count = await db.purchases.count();
  if (count > 0) return false;
  const records = PURCHASES.map(s => ({ ...s, ...baseRecord() }));
  await db.purchases.bulkAdd(records);
  const itemRecords = PURCHASE_ITEMS.map(s => ({ ...s, ...baseRecord() }));
  await db.purchaseItems.bulkAdd(itemRecords);
  console.log('[SEED] purchases: ' + PURCHASES.length + ' records + ' + PURCHASE_ITEMS.length + ' items');
  return true;
}

async function seedSales() {
  const count = await db.sales.count();
  if (count > 0) return false;
  const records = SALES.map(s => ({ ...s, ...baseRecord() }));
  await db.sales.bulkAdd(records);
  const itemRecords = SALE_ITEMS.map(s => ({ ...s, ...baseRecord() }));
  await db.saleItems.bulkAdd(itemRecords);
  console.log('[SEED] sales: ' + SALES.length + ' records + ' + SALE_ITEMS.length + ' items');
  return true;
}

async function seedSettings() {
  const count = await db.settings.count();
  if (count > 0) return false;

  const records = SETTINGS.map(s => ({ ...s, ...baseRecord() }));
  await db.settings.bulkAdd(records);
  console.log('[SEED] settings: ' + SETTINGS.length + ' records inserted');
  return true;
}


