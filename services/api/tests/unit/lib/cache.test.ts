import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  CacheService,
  CacheError,
  CacheKeys,
  CacheTTL,
} from "../../../src/lib/cache.js";
import { mockRedisClient } from "../helpers/mocks.js";
import { mockRedisConfig } from "../helpers/fixtures.js";

// Mock Redis
vi.mock("redis", () => ({
  createClient: vi.fn(() => mockRedisClient()),
}));

// Mock logger
vi.mock("../../../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe.skip("CacheService", () => {
  let cacheService: CacheService;
  let redisClient: ReturnType<typeof mockRedisClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { createClient } = await import("redis");
    redisClient = createClient() as any;
    cacheService = new CacheService(mockRedisConfig);
    await cacheService.connect();
  });

  afterEach(async () => {
    await cacheService.disconnect();
  });

  describe("connect", () => {
    it("should connect to Redis successfully", async () => {
      expect(redisClient.connect).toHaveBeenCalled();
      expect(cacheService.isHealthy()).toBe(true);
    });

    it("should set up error handlers", async () => {
      expect(redisClient.on).toHaveBeenCalledWith(
        "error",
        expect.any(Function),
      );
      expect(redisClient.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function),
      );
      expect(redisClient.on).toHaveBeenCalledWith(
        "reconnecting",
        expect.any(Function),
      );
    });

    it("should throw CacheError on connection failure", async () => {
      const { createClient } = await import("redis");
      vi.mocked(createClient).mockReturnValueOnce({
        ...mockRedisClient(),
        connect: vi.fn().mockRejectedValue(new Error("Connection failed")),
      } as any);

      const newService = new CacheService(mockRedisConfig);
      await expect(newService.connect()).rejects.toThrow(CacheError);
      await expect(newService.connect()).rejects.toThrow(
        "Failed to connect to Redis",
      );
    });
  });

  describe("disconnect", () => {
    it("should disconnect from Redis", async () => {
      await cacheService.disconnect();

      expect(redisClient.quit).toHaveBeenCalled();
      expect(cacheService.isHealthy()).toBe(false);
    });

    it("should handle disconnect when not connected", async () => {
      await cacheService.disconnect();
      await cacheService.disconnect();

      expect(redisClient.quit).toHaveBeenCalledTimes(1);
    });
  });

  describe("get", () => {
    it("should get value from cache", async () => {
      const testData = { id: "123", name: "Test" };
      redisClient.get.mockResolvedValue(JSON.stringify(testData));

      const result = await cacheService.get("test-key");

      expect(redisClient.get).toHaveBeenCalledWith("test:test-key");
      expect(result).toEqual(testData);
    });

    it("should return null for cache miss", async () => {
      redisClient.get.mockResolvedValue(null);

      const result = await cacheService.get("missing-key");

      expect(result).toBeNull();
    });

    it("should track cache hits", async () => {
      redisClient.get.mockResolvedValue(JSON.stringify({ data: "test" }));

      await cacheService.get("test-key");
      const stats = cacheService.getStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
    });

    it("should track cache misses", async () => {
      redisClient.get.mockResolvedValue(null);

      await cacheService.get("missing-key");
      const stats = cacheService.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);
    });

    it("should calculate hit rate", async () => {
      redisClient.get
        .mockResolvedValueOnce(JSON.stringify({ data: "test" }))
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(JSON.stringify({ data: "test" }));

      await cacheService.get("key1");
      await cacheService.get("key2");
      await cacheService.get("key3");

      const stats = cacheService.getStats();
      expect(stats.hitRate).toBeCloseTo(0.666, 2);
    });

    it("should handle JSON parse errors", async () => {
      redisClient.get.mockResolvedValue("invalid-json{");

      const result = await cacheService.get("test-key");

      expect(result).toBeNull();
    });

    it("should return null when cache not connected", async () => {
      await cacheService.disconnect();

      const result = await cacheService.get("test-key");

      expect(result).toBeNull();
      expect(redisClient.get).not.toHaveBeenCalled();
    });

    it("should handle Redis errors", async () => {
      redisClient.get.mockRejectedValue(new Error("Redis error"));

      const result = await cacheService.get("test-key");

      expect(result).toBeNull();
      const stats = cacheService.getStats();
      expect(stats.errors).toBe(1);
    });
  });

  describe("set", () => {
    it("should set value in cache with default TTL", async () => {
      const testData = { id: "123", name: "Test" };

      await cacheService.set("test-key", testData);

      expect(redisClient.setEx).toHaveBeenCalledWith(
        "test:test-key",
        3600,
        JSON.stringify(testData),
      );
    });

    it("should set value with custom TTL", async () => {
      const testData = { id: "123" };

      await cacheService.set("test-key", testData, 1800);

      expect(redisClient.setEx).toHaveBeenCalledWith(
        "test:test-key",
        1800,
        JSON.stringify(testData),
      );
    });

    it("should track cache sets", async () => {
      await cacheService.set("test-key", { data: "test" });

      const stats = cacheService.getStats();
      expect(stats.sets).toBe(1);
    });

    it("should handle primitive values", async () => {
      await cacheService.set("string-key", "test-string");
      await cacheService.set("number-key", 123);
      await cacheService.set("boolean-key", true);

      expect(redisClient.setEx).toHaveBeenCalledTimes(3);
    });

    it("should do nothing when cache not connected", async () => {
      await cacheService.disconnect();

      await cacheService.set("test-key", { data: "test" });

      expect(redisClient.setEx).not.toHaveBeenCalled();
    });

    it("should throw CacheError on Redis error", async () => {
      redisClient.setEx.mockRejectedValue(new Error("Redis error"));

      await expect(
        cacheService.set("test-key", { data: "test" }),
      ).rejects.toThrow(CacheError);
    });
  });

  describe("delete", () => {
    it("should delete value from cache", async () => {
      await cacheService.delete("test-key");

      expect(redisClient.del).toHaveBeenCalledWith("test:test-key");
    });

    it("should track cache deletes", async () => {
      await cacheService.delete("test-key");

      const stats = cacheService.getStats();
      expect(stats.deletes).toBe(1);
    });

    it("should do nothing when cache not connected", async () => {
      await cacheService.disconnect();

      await cacheService.delete("test-key");

      expect(redisClient.del).not.toHaveBeenCalled();
    });

    it("should throw CacheError on Redis error", async () => {
      redisClient.del.mockRejectedValue(new Error("Redis error"));

      await expect(cacheService.delete("test-key")).rejects.toThrow(CacheError);
    });
  });

  describe("deletePattern", () => {
    it("should delete keys matching pattern", async () => {
      redisClient.keys.mockResolvedValue(["test:user:1", "test:user:2"]);
      redisClient.del.mockResolvedValue(2);

      const deleted = await cacheService.deletePattern("user:*");

      expect(redisClient.keys).toHaveBeenCalledWith("test:user:*");
      expect(redisClient.del).toHaveBeenCalledWith([
        "test:user:1",
        "test:user:2",
      ]);
      expect(deleted).toBe(2);
    });

    it("should return 0 when no keys match", async () => {
      redisClient.keys.mockResolvedValue([]);

      const deleted = await cacheService.deletePattern("nonexistent:*");

      expect(deleted).toBe(0);
      expect(redisClient.del).not.toHaveBeenCalled();
    });

    it("should track deletes", async () => {
      redisClient.keys.mockResolvedValue(["key1", "key2"]);
      redisClient.del.mockResolvedValue(2);

      await cacheService.deletePattern("pattern:*");

      const stats = cacheService.getStats();
      expect(stats.deletes).toBe(2);
    });

    it("should return 0 when cache not connected", async () => {
      await cacheService.disconnect();

      const result = await cacheService.deletePattern("test:*");

      expect(result).toBe(0);
    });

    it("should throw CacheError on Redis error", async () => {
      redisClient.keys.mockRejectedValue(new Error("Redis error"));

      await expect(cacheService.deletePattern("test:*")).rejects.toThrow(
        CacheError,
      );
    });
  });

  describe("exists", () => {
    it("should return true if key exists", async () => {
      redisClient.exists.mockResolvedValue(1);

      const result = await cacheService.exists("test-key");

      expect(result).toBe(true);
      expect(redisClient.exists).toHaveBeenCalledWith("test:test-key");
    });

    it("should return false if key does not exist", async () => {
      redisClient.exists.mockResolvedValue(0);

      const result = await cacheService.exists("missing-key");

      expect(result).toBe(false);
    });

    it("should return false when cache not connected", async () => {
      await cacheService.disconnect();

      const result = await cacheService.exists("test-key");

      expect(result).toBe(false);
    });

    it("should handle Redis errors", async () => {
      redisClient.exists.mockRejectedValue(new Error("Redis error"));

      const result = await cacheService.exists("test-key");

      expect(result).toBe(false);
    });
  });

  describe("getTTL", () => {
    it("should return TTL for key", async () => {
      redisClient.ttl.mockResolvedValue(3600);

      const ttl = await cacheService.getTTL("test-key");

      expect(ttl).toBe(3600);
      expect(redisClient.ttl).toHaveBeenCalledWith("test:test-key");
    });

    it("should return -1 when cache not connected", async () => {
      await cacheService.disconnect();

      const ttl = await cacheService.getTTL("test-key");

      expect(ttl).toBe(-1);
    });

    it("should handle Redis errors", async () => {
      redisClient.ttl.mockRejectedValue(new Error("Redis error"));

      const ttl = await cacheService.getTTL("test-key");

      expect(ttl).toBe(-1);
    });
  });

  describe("getOrSet", () => {
    it("should return cached value if exists", async () => {
      const cachedData = { id: "123", name: "Cached" };
      redisClient.get.mockResolvedValue(JSON.stringify(cachedData));

      const factory = vi.fn();
      const result = await cacheService.getOrSet("test-key", factory);

      expect(result).toEqual(cachedData);
      expect(factory).not.toHaveBeenCalled();
      expect(redisClient.setEx).not.toHaveBeenCalled();
    });

    it("should compute and cache value if not exists", async () => {
      const computedData = { id: "123", name: "Computed" };
      redisClient.get.mockResolvedValue(null);
      const factory = vi.fn().mockResolvedValue(computedData);

      const result = await cacheService.getOrSet("test-key", factory);

      expect(result).toEqual(computedData);
      expect(factory).toHaveBeenCalled();
      // Wait a tick for the fire-and-forget set
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it("should use custom TTL", async () => {
      redisClient.get.mockResolvedValue(null);
      const factory = vi.fn().mockResolvedValue({ data: "test" });

      await cacheService.getOrSet("test-key", factory, 1800);

      expect(factory).toHaveBeenCalled();
    });

    it("should handle factory errors", async () => {
      redisClient.get.mockResolvedValue(null);
      const factory = vi.fn().mockRejectedValue(new Error("Factory error"));

      await expect(cacheService.getOrSet("test-key", factory)).rejects.toThrow(
        "Factory error",
      );
    });
  });

  describe("invalidateByTag", () => {
    it("should invalidate cache by tag", async () => {
      redisClient.keys.mockResolvedValue([
        "test:tag:user:1",
        "test:tag:user:2",
      ]);
      redisClient.del.mockResolvedValue(2);

      const deleted = await cacheService.invalidateByTag("user");

      expect(redisClient.keys).toHaveBeenCalledWith("test:*:user:*");
      expect(deleted).toBe(2);
    });
  });

  describe("flush", () => {
    it("should flush all cache entries", async () => {
      await cacheService.flush();

      expect(redisClient.flushDb).toHaveBeenCalled();
    });

    it("should do nothing when cache not connected", async () => {
      await cacheService.disconnect();

      await cacheService.flush();

      expect(redisClient.flushDb).not.toHaveBeenCalled();
    });

    it("should throw CacheError on Redis error", async () => {
      redisClient.flushDb.mockRejectedValue(new Error("Redis error"));

      await expect(cacheService.flush()).rejects.toThrow(CacheError);
    });
  });

  describe("stats", () => {
    it("should return cache statistics", () => {
      const stats = cacheService.getStats();

      expect(stats).toHaveProperty("hits");
      expect(stats).toHaveProperty("misses");
      expect(stats).toHaveProperty("sets");
      expect(stats).toHaveProperty("deletes");
      expect(stats).toHaveProperty("errors");
      expect(stats).toHaveProperty("hitRate");
    });

    it("should reset statistics", () => {
      cacheService.resetStats();

      const stats = cacheService.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.sets).toBe(0);
      expect(stats.deletes).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe("ping", () => {
    it("should ping Redis successfully", async () => {
      const result = await cacheService.ping();

      expect(result).toBe(true);
      expect(redisClient.ping).toHaveBeenCalled();
    });

    it("should return false when cache not connected", async () => {
      await cacheService.disconnect();

      const result = await cacheService.ping();

      expect(result).toBe(false);
    });

    it("should return false on ping error", async () => {
      redisClient.ping.mockRejectedValue(new Error("Ping failed"));

      const result = await cacheService.ping();

      expect(result).toBe(false);
    });
  });
});

describe("CacheKeys", () => {
  it("should generate user cache key", () => {
    expect(CacheKeys.user("123")).toBe("user:123");
  });

  it("should generate user profile cache key", () => {
    expect(CacheKeys.userProfile("123")).toBe("user:123:profile");
  });

  it("should generate appointments cache key", () => {
    expect(CacheKeys.appointments("user-123", 2)).toBe(
      "appointments:user:user-123:page:2",
    );
  });

  it("should generate patient cache key", () => {
    expect(CacheKeys.patient("patient-123")).toBe("patient:patient-123");
  });
});

describe("CacheTTL", () => {
  it("should have predefined TTL constants", () => {
    expect(CacheTTL.SHORT).toBe(300);
    expect(CacheTTL.MEDIUM).toBe(1800);
    expect(CacheTTL.LONG).toBe(3600);
    expect(CacheTTL.VERY_LONG).toBe(86400);
    expect(CacheTTL.PERMANENT).toBe(604800);
  });
});
