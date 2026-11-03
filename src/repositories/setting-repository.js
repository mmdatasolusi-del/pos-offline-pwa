import { BaseRepository } from './base-repository.js';

/**
 * Repository key-value untuk tabel `settings`.
 * Setiap record: { id, key, value, type, description?, updatedAt }
 */
class SettingRepository extends BaseRepository {
  constructor() {
    super('settings');
  }

  /** Ambil satu setting berdasarkan key (null jika belum ada). */
  async getByKey(key) {
    return (await this.table.where('key').equals(key).first()) ?? null;
  }

  /** Baca nilai setting dengan default. */
  async getValue(key, fallback = null) {
    const record = await this.getByKey(key);
    return record ? record.value : fallback;
  }

  /** Simpan/perbarui nilai setting (upsert by key). */
  async setValue(key, value, type = 'string') {
    const existing = await this.getByKey(key);
    const nowISO = new Date().toISOString();
    if (existing) {
      return this.update(existing.id, { value, type, updatedAt: nowISO });
    }
    return this.create({ key, value, type, updatedAt: nowISO });
  }

  /** Semua settings sebagai objek plain { key: value }. */
  async getAllAsMap() {
    const rows = await this.table.toArray();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
}

export const settingRepository = new SettingRepository();
export { SettingRepository };
