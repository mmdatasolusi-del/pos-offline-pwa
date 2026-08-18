import db from '../../database/db.js';

class ReportRepository {
  async getSalesSummary(fromDate, toDate) {
    const all = await db.sales.toArray();
    const filtered = all.filter(s => {
      if (!s.saleDate) return false;
      const d = new Date(s.saleDate);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate + 'T23:59:59')) return false;
      return !s.deletedAt;
    });

    const totalSales = filtered.length;
    const totalRevenue = filtered.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const paidCount = filtered.filter(s => s.paymentStatus === 'paid').length;
    const unpaidCount = filtered.filter(s => s.paymentStatus === 'unpaid' || s.paymentStatus === 'partial').length;

    return { totalSales, totalRevenue, paidCount, unpaidCount, data: filtered };
  }

  async getPurchaseSummary(fromDate, toDate) {
    const all = await db.purchases.toArray();
    const filtered = all.filter(p => {
      if (!p.orderDate) return false;
      const d = new Date(p.orderDate);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate + 'T23:59:59')) return false;
      return !p.deletedAt;
    });

    const totalPurchases = filtered.length;
    const totalSpent = filtered.reduce((sum, p) => sum + (Number(p.grandTotal) || 0), 0);
    const pendingCount = filtered.filter(p => p.status === 'ordered' || p.status === 'draft').length;
    const receivedCount = filtered.filter(p => p.status === 'received').length;

    return { totalPurchases, totalSpent, pendingCount, receivedCount, data: filtered };
  }

  async getStockSummary() {
    const products = await db.products.toArray();
    const active = products.filter(p => !p.deletedAt && p.isActive !== false);

    const totalProducts = active.length;
    const lowStock = active.filter(p => Number(p.stock) <= Number(p.minStock) && Number(p.minStock) > 0);
    const outOfStock = active.filter(p => !p.stock || Number(p.stock) === 0);
    const totalStockValue = active.reduce((sum, p) => sum + (Number(p.stock) || 0) * (Number(p.buyPrice) || 0), 0);
    const totalSellValue = active.reduce((sum, p) => sum + (Number(p.stock) || 0) * (Number(p.sellPrice) || 0), 0);

    const categories = await db.categories.toArray();
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.id] = cat.name;
    }

    const stockByCategory = {};
    for (const p of active) {
      const catName = categoryMap[p.categoryId] || 'Lainnya';
      if (!stockByCategory[catName]) stockByCategory[catName] = { count: 0, stockValue: 0, sellValue: 0 };
      stockByCategory[catName].count++;
      stockByCategory[catName].stockValue += (Number(p.stock) || 0) * (Number(p.buyPrice) || 0);
      stockByCategory[catName].sellValue += (Number(p.stock) || 0) * (Number(p.sellPrice) || 0);
    }

    return { totalProducts, lowStock, outOfStock, totalStockValue, totalSellValue, stockByCategory };
  }

  async getTopProducts(limit = 10) {
    const saleItems = await db.saleItems.toArray();
    const products = await db.products.toArray();
    const productMap = {};
    for (const p of products) productMap[p.id] = p;

    const productCount = {};
    for (const item of saleItems) {
      if (!productCount[item.productId]) productCount[item.productId] = { qty: 0, revenue: 0 };
      productCount[item.productId].qty += Number(item.quantity) || 0;
      productCount[item.productId].revenue += Number(item.subtotal) || 0;
    }

    const sorted = Object.entries(productCount)
      .map(([id, data]) => ({
        productId: id,
        productName: productMap[id]?.name || 'Unknown',
        sku: productMap[id]?.sku || '',
        ...data,
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit);

    return sorted;
  }
}

export { ReportRepository };
export const reportRepository = new ReportRepository();
