class CacheManager {
  async open(name) {
    try {
      const cache = await caches.open(name);
      console.log(`[CACHE] Opened: ${name}`);
      return cache;
    } catch (error) {
      console.error(`[CACHE] Failed to open ${name}:`, error);
      throw error;
    }
  }

  async delete(name) {
    try {
      const result = await caches.delete(name);
      if (result) console.log(`[CACHE] Deleted: ${name}`);
      return result;
    } catch (error) {
      console.error(`[CACHE] Failed to delete ${name}:`, error);
      return false;
    }
  }

  async keys() {
    try {
      return await caches.keys();
    } catch (error) {
      console.error('[CACHE] Failed to list caches:', error);
      return [];
    }
  }

  async cleanup(validNames) {
    try {
      const keys = await this.keys();
      const valid = new Set(validNames);
      const obsolete = keys.filter(key => !valid.has(key));
      await Promise.all(obsolete.map(key => this.delete(key)));
      if (obsolete.length > 0) {
        console.log(`[CACHE] Cleaned up ${obsolete.length} obsolete cache(s)`);
      }
      return obsolete;
    } catch (error) {
      console.error('[CACHE] Cleanup failed:', error);
      return [];
    }
  }

  async info(name) {
    try {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      return {
        name,
        size: requests.length,
        requests: requests.map(r => r.url),
      };
    } catch (error) {
      console.error(`[CACHE] Failed to get info for ${name}:`, error);
      return { name, size: 0, requests: [] };
    }
  }

  async add(url, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      await cache.add(url);
      return true;
    } catch (error) {
      console.warn(`[CACHE] Failed to add ${url}:`, error.message);
      return false;
    }
  }

  async bulkAdd(urls, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const results = await Promise.allSettled(
        urls.map(url =>
          cache.add(url).catch(() => {})
        )
      );
      const failed = results.filter(r => r.status === 'rejected').length;
      return { total: urls.length, failed };
    } catch (error) {
      console.error(`[CACHE] Bulk add failed for ${cacheName}:`, error);
      return { total: urls.length, failed: urls.length };
    }
  }

  async match(request) {
    try {
      return await caches.match(request);
    } catch (error) {
      console.error('[CACHE] Match failed:', error);
      return undefined;
    }
  }
}

const cacheManager = new CacheManager();
export { cacheManager, CacheManager };
