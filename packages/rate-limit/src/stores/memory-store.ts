import { RateLimitStore } from '../types.js';

interface MemoryEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limit store (fallback when Redis is unavailable)
 * Note: This is not suitable for distributed/multi-instance deployments
 */
export class MemoryStore implements RateLimitStore {
  private store: Map<string, MemoryEntry> = new Map();
  private windowMs: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(windowMs: number = 60000) {
    this.windowMs = windowMs;
    this.startCleanup();
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    // Clean up every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);

    // Unref to not prevent process exit
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[RateLimit:Memory] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Increment the counter for a key
   */
  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    const now = Date.now();
    let entry = this.store.get(key);

    // Check if entry exists and is not expired
    if (entry && now < entry.resetTime) {
      entry.count++;
    } else {
      // Create new entry
      entry = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    }

    this.store.set(key, entry);

    return {
      totalHits: entry.count,
      resetTime: new Date(entry.resetTime),
    };
  }

  /**
   * Decrement the counter for a key
   */
  async decrement(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry && entry.count > 0) {
      entry.count--;
      this.store.set(key, entry);
    }
  }

  /**
   * Reset the counter for a key
   */
  async resetKey(key: string): Promise<void> {
    this.store.delete(key);
  }

  /**
   * Check if store is connected (always true for memory)
   */
  isConnected(): boolean {
    return true;
  }

  /**
   * Get store statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }

  /**
   * Close the store (cleanup)
   */
  async close(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}
