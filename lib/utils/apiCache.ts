/**
 * Simple API Response Cache
 * Prevents redundant API calls and reduces database load
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 30000; // 30 seconds default

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string, ttl: number = this.defaultTTL): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const isExpired = age > ttl;

    if (isExpired) {
      this.cache.delete(key);
      console.log(`⏰ Cache EXPIRED: ${key} (age: ${age}ms)`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key} (age: ${age}ms, ttl: ${ttl}ms)`);
    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  set<T>(key: string, data: T): void {
    console.log(`💾 Cache SET: ${key}`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    const existed = this.cache.has(key);
    this.cache.delete(key);
    if (existed) {
      console.log(`🗑️ Cache INVALIDATE: ${key}`);
    }
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`🗑️ Cache INVALIDATE PATTERN: ${pattern} (${count} entries)`);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 Cache CLEARED (${size} entries)`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const apiCache = new APICache();

// Export for debugging
if (typeof window !== "undefined") {
  (window as any).apiCache = apiCache;
}
