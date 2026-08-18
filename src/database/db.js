import { buildStoreDefinitions } from './schema.js';

const db = new Dexie('PosOfflineDB');

db.version(2).stores(buildStoreDefinitions());

export default db;
