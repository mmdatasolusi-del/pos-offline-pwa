import db from '../database/db.js';

function now() {
  return new Date().toISOString();
}

function compareValues(a, b, order) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') {
    return order === 'desc' ? b - a : a - b;
  }
  const aStr = String(a);
  const bStr = String(b);
  return order === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
}

class BaseRepository {
  constructor(tableName) {
    this.table = db[tableName];
    this.tableName = tableName;
  }

  async getAll(options = {}) {
    const { filter, sort, pagination, includeDeleted = false } = options;
    try {
      let records = await this.table.toArray();

      if (filter) {
        for (const [field, value] of Object.entries(filter)) {
          if (value !== undefined && value !== null) {
            records = records.filter(r => r[field] === value);
          }
        }
      }

      if (!includeDeleted) {
        records = records.filter(r => !r.deletedAt);
      }

      const total = records.length;

      if (sort) {
        const [field, order] = Array.isArray(sort) ? sort : [sort, 'asc'];
        records.sort((a, b) => compareValues(a[field], b[field], order));
      }

      if (pagination) {
        const { page = 1, pageSize = 50 } = pagination;
        const offset = (page - 1) * pageSize;
        records = records.slice(offset, offset + pageSize);
      }

      return {
        data: records,
        total,
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? total,
        totalPages: pagination?.pageSize ? Math.ceil(total / pagination.pageSize) : 1,
      };
    } catch (error) {
      console.error(`[BaseRepo] getAll ${this.tableName} failed:`, error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return (await this.table.get(id)) ?? null;
    } catch (error) {
      console.error(`[BaseRepo] getById ${this.tableName}(${id}) failed:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const nowISO = now();
      const record = {
        id: data.id || crypto.randomUUID(),
        ...data,
        createdAt: data.createdAt || nowISO,
        updatedAt: nowISO,
        deletedAt: data.deletedAt ?? null,
      };
      await this.table.add(record);
      return record;
    } catch (error) {
      console.error(`[BaseRepo] create ${this.tableName} failed:`, error);
      throw error;
    }
  }

  async update(id, changes) {
    try {
      const existing = await this.table.get(id);
      if (!existing) {
        throw new Error(`${this.tableName} with id ${id} not found`);
      }
      const updated = { ...existing, ...changes, updatedAt: now() };
      await this.table.put(updated);
      return updated;
    } catch (error) {
      console.error(`[BaseRepo] update ${this.tableName}(${id}) failed:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const existing = await this.table.get(id);
      if (!existing) return false;
      await this.table.put({ ...existing, deletedAt: now(), updatedAt: now() });
      return true;
    } catch (error) {
      console.error(`[BaseRepo] delete ${this.tableName}(${id}) failed:`, error);
      throw error;
    }
  }

  async hardDelete(id) {
    try {
      await this.table.delete(id);
      return true;
    } catch (error) {
      console.error(`[BaseRepo] hardDelete ${this.tableName}(${id}) failed:`, error);
      throw error;
    }
  }

  async count(filter) {
    try {
      if (filter) {
        return await this.table.where(filter).count();
      }
      return await this.table.count();
    } catch (error) {
      console.error(`[BaseRepo] count ${this.tableName} failed:`, error);
      throw error;
    }
  }

  async exists(id) {
    try {
      return !!(await this.table.get(id));
    } catch (error) {
      console.error(`[BaseRepo] exists ${this.tableName}(${id}) failed:`, error);
      return false;
    }
  }

  async find(predicate) {
    try {
      const all = await this.table.toArray();
      return all.filter(predicate);
    } catch (error) {
      console.error(`[BaseRepo] find ${this.tableName} failed:`, error);
      throw error;
    }
  }
}

export { BaseRepository };
