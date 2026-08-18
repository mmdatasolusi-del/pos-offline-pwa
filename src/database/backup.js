import db from './db.js';
import { TABLES, SCHEMA_VERSION } from './schema.js';
import { generateUUID } from '../utils/id-utils.js';

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function exportBackup() {
  const data = {};
  for (const table of TABLES) {
    const records = await db.table(table.name).toArray();
    if (records.length > 0) {
      data[table.name] = records;
    }
  }

  const payload = JSON.stringify(data);
  const checksum = await sha256(payload);

  const backup = {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    checksum,
    encrypted: false,
    data,
  };

  const meta = {
    id: generateUUID(),
    fileName: `backup-${new Date().toISOString().slice(0, 10)}.json`,
    fileSize: new Blob([JSON.stringify(backup)]).size,
    checksum,
    schemaVersion: String(SCHEMA_VERSION),
    exportedAt: backup.exportedAt,
  };

  await db.backupMetadata.add(meta);

  return backup;
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backup.exportedAt.slice(0, 10) + '-pos-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
