const PBKDF2_ITERATIONS = 600000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

function toHex(bytes) {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return toHex(hash);
}

export function generateSalt() {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export function isPbkdf2Hash(storedHash) {
  return typeof storedHash === 'string' && storedHash.startsWith('pbkdf2$');
}

export async function derivePbkdf2(password, saltHex, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password)),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: fromHex(saltHex),
      iterations,
    },
    keyMaterial,
    KEY_BYTES * 8
  );

  return toHex(bits);
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex || generateSalt();
  const derived = await derivePbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${derived}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;

  if (isPbkdf2Hash(storedHash)) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = Number(parts[1]);
    if (!Number.isInteger(iterations) || iterations <= 0) return false;
    const actual = await derivePbkdf2(password, parts[2], iterations);
    return timingSafeEqualHex(actual, parts[3]);
  }

  // Fallback: hash SHA-256 legacy (tanpa salt) — untuk user yang dibuat sebelum migrasi.
  const legacy = await sha256(String(password));
  return timingSafeEqualHex(legacy, storedHash);
}

function timingSafeEqualHex(a, b) {
  const ha = String(a || '').toLowerCase();
  const hb = String(b || '').toLowerCase();
  if (ha.length !== hb.length) return false;
  let diff = 0;
  for (let i = 0; i < ha.length; i++) {
    diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  }
  return diff === 0;
}
