import db from './db.js';
import { DB_CONFIG } from '../config/db.config.js';
import { runMigrations } from './migrations.js';
import { seedDatabase } from './seeds.js';

class DatabaseManager {
  #initialized = false;
  #initializedAt = null;
  #status = 'closed';

  async initialize() {
    if (this.#initialized) {
      console.log('[DB] Already initialized');
      return { success: true, seeded: false };
    }

    try {
      console.log('[DB] Initializing database...');

      await db.open();

      await runMigrations();

      const seeded = await seedDatabase();

      this.#initialized = true;
      this.#initializedAt = new Date().toISOString();
      this.#status = 'connected';

      console.log('[DB] Database ready' + (seeded ? ' (with seed data)' : ''));

      return { success: true, seeded };
    } catch (error) {
      this.#status = 'error';
      console.error('[DB] Initialization failed:', error);
      throw error;
    }
  }

  async close() {
    try {
      await db.close();
      this.#initialized = false;
      this.#status = 'closed';
      console.log('[DB] Database connection closed');
    } catch (error) {
      console.error('[DB] Error closing database:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      databaseName: DB_CONFIG.databaseName,
      schemaVersion: DB_CONFIG.schemaVersion,
      initialized: this.#initialized,
      initializedAt: this.#initializedAt,
      status: this.#status,
      tables: db.tables ? db.tables.map(t => t.name) : [],
    };
  }
}

export { DatabaseManager };
