export function validateProduct(data) {
  const errors = [];
  if (!data.name || !data.name.trim()) errors.push('Nama produk wajib diisi');
  if (data.buyPrice == null || data.buyPrice < 0) errors.push('Harga beli tidak valid');
  if (data.sellPrice == null || data.sellPrice < 0) errors.push('Harga jual tidak valid');
  if (data.stock != null && data.stock < 0) errors.push('Stok tidak valid');
  if (data.minStock != null && data.minStock < 0) errors.push('Stok minimum tidak valid');
  return errors;
}
