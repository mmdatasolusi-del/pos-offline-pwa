import { settingRepository } from '../repositories/setting-repository.js';

/**
 * Default settings yang di-seed saat first-run / belum tersimpan.
 */
export const DEFAULT_SETTINGS = Object.freeze({
  'business.name': 'Usaha Saya',
  'business.address': '',
  'business.phone': '',
  'business.currency': 'IDR',
  'business.taxNumber': '',
  'receipt.footer': 'Terima kasih atas kunjungan Anda!',
  'receipt.showLogo': false,
  'pos.allowNegativeStock': false,
  'pos.rounding': 'none', // none | hundreds (bulatkan ke ratusan rupiah)
  'theme.mode': 'light',
});

/**
 * Service baca/tulis setting aplikasi.
 * Menambah cache in-memory sederhana agar pembacaan berulang murah.
 */
class SettingService {
  constructor() {
    this._cache = null;
  }

  /** Muat semua settings (defaults + DB) ke cache. */
  async loadAll(force = false) {
    if (this._cache && !force) return this._cache;
    const stored = await settingRepository.getAllAsMap();
    this._cache = { ...DEFAULT_SETTINGS, ...stored };
    return this._cache;
  }

  invalidateCache() {
    this._cache = null;
  }

  /** Ambil satu nilai setting. */
  async get(key, fallback = undefined) {
    const all = await this.loadAll();
    return key in all ? all[key] : (fallback ?? DEFAULT_SETTINGS[key] ?? null);
  }

  /** Ambil beberapa setting sekaligus. */
  async getMany(keys) {
    const all = await this.loadAll();
    return Object.fromEntries(keys.map((k) => [k, all[k] ?? DEFAULT_SETTINGS[k] ?? null]));
  }

  /** Simpan satu setting. */
  async set(key, value, type = this.inferType(value)) {
    await settingRepository.setValue(key, value, type);
    this.invalidateCache();
    return value;
  }

  /** Simpan banyak setting sekaligus. */
  async setMany(entries) {
    for (const [key, value] of Object.entries(entries)) {
      await settingRepository.setValue(key, value, this.inferType(value));
    }
    this.invalidateCache();
  }

  inferType(value) {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (value && typeof value === 'object') return 'json';
    return 'string';
  }

  /** Seed default settings ke DB (dipakai first-run). Tidak menimpa yang sudah ada. */
  async seedDefaults() {
    let created = 0;
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      const existing = await settingRepository.getByKey(key);
      if (!existing) {
        await settingRepository.setValue(key, value, this.inferType(value));
        created += 1;
      }
    }
    this.invalidateCache();
    return { created };
  }
}

export const settingService = new SettingService();
export { SettingService };
