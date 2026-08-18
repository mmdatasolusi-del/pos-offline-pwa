export function generateUUID() {
  return crypto.randomUUID();
}

export function generateNumber(prefix) {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${prefix}-${y}${m}${d}-${seq}`;
}

export function generateInvoiceNumber() {
  return generateNumber('INV');
}

export function generatePONumber() {
  return generateNumber('PO');
}

export function generateOpnameNumber() {
  return generateNumber('OPN');
}

export function generateShiftNumber() {
  return generateNumber('SFT');
}

export function generateExpenseNumber() {
  return generateNumber('EXP');
}

export function generateIncomeNumber() {
  return generateNumber('INC');
}

export function generateMemberNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const rand = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `MBR${y}${rand}`;
}
