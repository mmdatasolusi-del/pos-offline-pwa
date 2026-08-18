export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

export function isEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value) {
  if (!value) return false;
  return /^\+?[\d\s\-()]{7,20}$/.test(value);
}

export function isNumeric(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return /^-?\d+(\.\d+)?$/.test(value.trim());
  return false;
}

export function isLength(value, min, max) {
  if (typeof value !== 'string') return false;
  const len = value.trim().length;
  if (min !== undefined && len < min) return false;
  if (max !== undefined && len > max) return false;
  return true;
}

export function isPositiveNumber(value) {
  return isNumeric(value) && Number(value) >= 0;
}

export function isInteger(value) {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value === 'string') return /^-?\d+$/.test(value.trim());
  return false;
}

export function validateRequired(fields, data) {
  const errors = {};
  for (const field of fields) {
    if (!isRequired(data[field])) {
      errors[field] = `${field} wajib diisi`;
    }
  }
  return errors;
}
