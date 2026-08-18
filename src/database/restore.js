import db from './db.js';
import { TABLES, SCHEMA_VERSION } from './schema.js';

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

class RestoreError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'RestoreError';
    this.code = code;
  }
}

export async function validateBackupFile(file) {
  if (!file.name.endsWith('.json')) {
    throw new RestoreError('File harus berformat JSON', 'INVALID_FORMAT');
  }

  const text = await file.text();
  let backup;

  try {
    backup = JSON.parse(text);
  } catch {
    throw new RestoreError('File JSON tidak valid', 'INVALID_JSON');
  }

  if (!backup.version || !backup.exportedAt || !backup.checksum || !backup.data) {
    throw new RestoreError('Struktur backup tidak lengkap', 'INVALID_STRUCTURE');
  }

  if (backup.version > SCHEMA_VERSION) {
    throw new RestoreError(
      `Versi skema backup (${backup.version}) lebih baru dari aplikasi (${SCHEMA_VERSION})`,
      'VERSION_MISMATCH'
    );
  }

  const payload = JSON.stringify(backup.data);
  const computedChecksum = await sha256(payload);

  if (computedChecksum !== backup.checksum) {
    throw new RestoreError('Checksum tidak cocok — data mungkin rusak', 'CHECKSUM_MISMATCH');
  }

  const tableSummary = {};
  for (const [tableName, records] of Object.entries(backup.data)) {
    if (Array.isArray(records)) {
      tableSummary[tableName] = records.length;
    }
  }

  return {
    original: backup,
    tableSummary,
    totalTables: Object.keys(backup.data).length,
    totalRecords: Object.values(backup.data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
    exportedAt: backup.exportedAt,
    version: backup.version,
  };
}

export async function restoreFromBackup(file) {
  const summary = await validateBackupFile(file);

  const knownTables = new Set(TABLES.map((t) => t.name));

  await db.transaction('rw', TABLES.map((t) => t.name), async () => {
    for (const table of TABLES) {
      await db.table(table.name).clear();
    }

    for (const [tableName, records] of Object.entries(summary.original.data)) {
      if (knownTables.has(tableName) && Array.isArray(records) && records.length > 0) {
        await db.table(tableName).bulkAdd(records);
      }
    }
  });

  return summary;
}
