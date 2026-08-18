export const SCHEMA_VERSION = 2;

export const TABLES = [
  { name: 'users', primaryKey: 'id', indexes: ['&username', 'roleId', 'isActive', 'deletedAt'] },
  { name: 'roles', primaryKey: 'id', indexes: ['&name', 'isSystem', 'deletedAt'] },
  { name: 'permissions', primaryKey: 'id', indexes: ['roleId', 'module', 'action'] },
  { name: 'settings', primaryKey: 'id', indexes: ['&key', 'type'] },
  { name: 'categories', primaryKey: 'id', indexes: ['name', 'parentId', 'isActive', 'deletedAt'] },
  { name: 'units', primaryKey: 'id', indexes: ['name', 'abbreviation', 'isActive', 'deletedAt'] },
  { name: 'suppliers', primaryKey: 'id', indexes: ['code', 'name', 'phone', 'isActive', 'deletedAt'] },
  { name: 'customers', primaryKey: 'id', indexes: ['name', 'phone', 'isMember', 'isActive', 'deletedAt'] },
  { name: 'products', primaryKey: 'id', indexes: ['&sku', 'barcode', 'name', 'categoryId', 'unitId', 'sellPrice', 'minStock', 'isActive', 'type', 'deletedAt'] },
  { name: 'sales', primaryKey: 'id', indexes: ['&invoiceNumber', 'customerId', 'userId', 'shiftId', 'paymentStatus', 'paymentMethod', 'saleDate'] },
  { name: 'saleItems', primaryKey: 'id', indexes: ['saleId', 'productId'] },
  { name: 'payments', primaryKey: 'id', indexes: ['saleId', 'method'] },
  { name: 'discounts', primaryKey: 'id', indexes: ['saleId', 'saleItemId', 'type'] },
  { name: 'taxes', primaryKey: 'id', indexes: ['name', 'isActive', 'isDefault'] },
  { name: 'vouchers', primaryKey: 'id', indexes: ['&code', 'type', 'validFrom', 'validUntil', 'isActive', 'deletedAt'] },
  { name: 'purchases', primaryKey: 'id', indexes: ['&poNumber', 'supplierId', 'userId', 'status', 'orderDate', 'deletedAt'] },
  { name: 'purchaseItems', primaryKey: 'id', indexes: ['purchaseId', 'productId'] },
  { name: 'inventories', primaryKey: 'id', indexes: ['&productId', 'quantity'] },
  { name: 'stockMovements', primaryKey: 'id', indexes: ['productId', 'type', 'referenceType', 'referenceId', 'userId'] },
  { name: 'stockAdjustments', primaryKey: 'id', indexes: ['productId', 'type', 'userId'] },
  { name: 'stockOpnames', primaryKey: 'id', indexes: ['&opnameNumber', 'status', 'userId'] },
  { name: 'stockOpnameItems', primaryKey: 'id', indexes: ['opnameId', 'productId'] },
  { name: 'cashFlows', primaryKey: 'id', indexes: ['type', 'category', 'shiftId', 'userId', 'cashDate'] },
  { name: 'expenses', primaryKey: 'id', indexes: ['&expenseNumber', 'category', 'userId', 'expenseDate'] },
  { name: 'incomes', primaryKey: 'id', indexes: ['&incomeNumber', 'category', 'userId', 'incomeDate'] },
  { name: 'shifts', primaryKey: 'id', indexes: ['&shiftNumber', 'userId', 'openedAt', 'status', 'deletedAt'] },
  { name: 'auditLogs', primaryKey: 'id', indexes: ['userId', 'action', 'entityType', 'entityId'] },
  { name: 'activityLogs', primaryKey: 'id', indexes: ['userId', 'activity', 'module', 'level'] },
  { name: 'tables', primaryKey: 'id', indexes: ['name', 'status', 'isActive', 'deletedAt'] },
  { name: 'kitchenOrders', primaryKey: 'id', indexes: ['saleId', 'tableId', 'status'] },
  { name: 'reservations', primaryKey: 'id', indexes: ['tableId', 'reservationDate', 'status'] },
  { name: 'memberships', primaryKey: 'id', indexes: ['&customerId', '&memberNumber', 'tier', 'points', 'isActive', 'deletedAt'] },
  { name: 'loyaltyPoints', primaryKey: 'id', indexes: ['membershipId', 'type', 'points'] },
  { name: 'backupMetadata', primaryKey: 'id', indexes: ['schemaVersion', 'exportedAt'] },
];

export function buildStoreDefinitions() {
  const stores = {};
  for (const t of TABLES) {
    stores[t.name] = [t.primaryKey, ...t.indexes].join(',');
  }
  return stores;
}
