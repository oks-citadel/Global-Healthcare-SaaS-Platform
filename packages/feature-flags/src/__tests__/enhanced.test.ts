/**
 * Enhanced Feature Flags Test Suite
 *
 * Tests for the enhanced feature flag module including:
 * - Regional availability
 * - Kill switches
 * - Environment variable store
 * - Composite stores
 * - User segments
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  EnhancedFeatureFlagClient,
  EnvFeatureFlagStore,
  CompositeFeatureFlagStore,
  createRegionalFlag,
  createKillSwitchFlag,
  createUserTargetedFlag,
  createSegmentFlag,
  InMemoryFeatureFlagStore,
  type Region,
} from "../enhanced";

describe("EnhancedFeatureFlagClient", () => {
  let store: InMemoryFeatureFlagStore;
  let client: EnhancedFeatureFlagClient;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
    client = new EnhancedFeatureFlagClient({ store });
  });

  afterEach(() => {
    client.clearCache();
  });

  describe("Environment Variable Override", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should respect environment variable override", async () => {
      process.env.FEATURE_FLAG_MY_FLAG = "true";

      const result = await client.isFeatureEnabled("my-flag");
      expect(result).toBe(true);
    });

    it("should handle false environment variable", async () => {
      process.env.FEATURE_FLAG_MY_FLAG = "false";

      const result = await client.isFeatureEnabled("my-flag");
      expect(result).toBe(false);
    });

    it("should handle numeric environment variable", async () => {
      process.env.FEATURE_FLAG_MY_FLAG = "1";

      const result = await client.isFeatureEnabled("my-flag");
      expect(result).toBe(true);

      process.env.FEATURE_FLAG_MY_FLAG = "0";
      const result2 = await client.isFeatureEnabled("my-flag");
      expect(result2).toBe(false);
    });

    it("should use custom prefix", async () => {
      const customClient = new EnhancedFeatureFlagClient({
        store,
        envPrefix: "FF_",
      });

      process.env.FF_CUSTOM_FLAG = "true";

      const result = await customClient.isFeatureEnabled("custom-flag");
      expect(result).toBe(true);
    });
  });

  describe("Cache TTL", () => {
    it("should allow setting cache TTL", () => {
      expect(() => client.setCacheTTL(30000)).not.toThrow();
    });
  });
});

// ============================================================================
// EnvFeatureFlagStore Tests
// ============================================================================

describe("EnvFeatureFlagStore", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should read flag from environment variable", async () => {
    process.env.FEATURE_FLAG_TEST_FLAG = "true";

    const store = new EnvFeatureFlagStore();
    const flag = await store.get("test-flag");

    expect(flag).not.toBeNull();
    expect(flag?.defaultValue).toBe(true);
  });

  it("should handle false values", async () => {
    process.env.FEATURE_FLAG_TEST_FLAG = "false";

    const store = new EnvFeatureFlagStore();
    const flag = await store.get("test-flag");

    expect(flag).not.toBeNull();
    expect(flag?.defaultValue).toBe(false);
  });

  it("should use custom prefix", async () => {
    process.env.CUSTOM_PREFIX_TEST_FLAG = "true";

    const store = new EnvFeatureFlagStore({ prefix: "CUSTOM_PREFIX_" });
    const flag = await store.get("test-flag");

    expect(flag).not.toBeNull();
    expect(flag?.defaultValue).toBe(true);
  });

  it("should use flag definitions", async () => {
    const store = new EnvFeatureFlagStore({
      flagDefinitions: {
        "my-flag": {
          name: "My Flag",
          type: "boolean",
          status: "enabled",
          defaultValue: true,
          description: "Test description",
        },
      },
    });

    const flag = await store.get("my-flag");

    expect(flag).not.toBeNull();
    expect(flag?.name).toBe("My Flag");
    expect(flag?.description).toBe("Test description");
    expect(flag?.defaultValue).toBe(true);
  });

  it("should override definition with env var", async () => {
    process.env.FEATURE_FLAG_MY_FLAG = "false";

    const store = new EnvFeatureFlagStore({
      flagDefinitions: {
        "my-flag": {
          name: "My Flag",
          type: "boolean",
          status: "enabled",
          defaultValue: true,
        },
      },
    });

    const flag = await store.get("my-flag");

    expect(flag?.defaultValue).toBe(false);
  });

  it("should return null for undefined flag without definition", async () => {
    const store = new EnvFeatureFlagStore();
    const flag = await store.get("undefined-flag");

    expect(flag).toBeNull();
  });

  it("should return all flags from definitions", async () => {
    const store = new EnvFeatureFlagStore({
      flagDefinitions: {
        "flag-1": {
          name: "Flag 1",
          type: "boolean",
          status: "enabled",
          defaultValue: true,
        },
        "flag-2": {
          name: "Flag 2",
          type: "boolean",
          status: "enabled",
          defaultValue: false,
        },
      },
    });

    const flags = await store.getAll();

    expect(flags).toHaveLength(2);
  });

  it("should throw on set operation", async () => {
    const store = new EnvFeatureFlagStore();

    await expect(
      store.set({
        key: "test",
        name: "Test",
        type: "boolean",
        status: "enabled",
        defaultValue: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ).rejects.toThrow("read-only");
  });

  it("should throw on delete operation", async () => {
    const store = new EnvFeatureFlagStore();

    await expect(store.delete("test")).rejects.toThrow("read-only");
  });
});

// ============================================================================
// CompositeFeatureFlagStore Tests
// ============================================================================

describe("CompositeFeatureFlagStore", () => {
  it("should get flag from first store that has it", async () => {
    const store1 = new InMemoryFeatureFlagStore();
    const store2 = new InMemoryFeatureFlagStore();

    const now = new Date().toISOString();
    await store2.set({
      key: "flag-in-store-2",
      name: "Flag in Store 2",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });

    const composite = new CompositeFeatureFlagStore([store1, store2]);
    const flag = await composite.get("flag-in-store-2");

    expect(flag).not.toBeNull();
    expect(flag?.key).toBe("flag-in-store-2");
  });

  it("should prioritize earlier stores", async () => {
    const store1 = new InMemoryFeatureFlagStore();
    const store2 = new InMemoryFeatureFlagStore();

    const now = new Date().toISOString();
    await store1.set({
      key: "shared-flag",
      name: "From Store 1",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });
    await store2.set({
      key: "shared-flag",
      name: "From Store 2",
      type: "boolean",
      status: "disabled",
      defaultValue: false,
      createdAt: now,
      updatedAt: now,
    });

    const composite = new CompositeFeatureFlagStore([store1, store2]);
    const flag = await composite.get("shared-flag");

    expect(flag?.name).toBe("From Store 1");
  });

  it("should write to primary store", async () => {
    const store1 = new InMemoryFeatureFlagStore();
    const store2 = new InMemoryFeatureFlagStore();

    const composite = new CompositeFeatureFlagStore([store1, store2], 0);

    const now = new Date().toISOString();
    await composite.set({
      key: "new-flag",
      name: "New Flag",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });

    const flag1 = await store1.get("new-flag");
    const flag2 = await store2.get("new-flag");

    expect(flag1).not.toBeNull();
    expect(flag2).toBeNull();
  });

  it("should delete from primary store", async () => {
    const store1 = new InMemoryFeatureFlagStore();
    const store2 = new InMemoryFeatureFlagStore();

    const now = new Date().toISOString();
    await store1.set({
      key: "delete-me",
      name: "Delete Me",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });

    const composite = new CompositeFeatureFlagStore([store1, store2]);
    await composite.delete("delete-me");

    const flag = await store1.get("delete-me");
    expect(flag).toBeNull();
  });

  it("should get all flags from all stores", async () => {
    const store1 = new InMemoryFeatureFlagStore();
    const store2 = new InMemoryFeatureFlagStore();

    const now = new Date().toISOString();
    await store1.set({
      key: "flag-1",
      name: "Flag 1",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });
    await store2.set({
      key: "flag-2",
      name: "Flag 2",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });

    const composite = new CompositeFeatureFlagStore([store1, store2]);
    const flags = await composite.getAll();

    expect(flags).toHaveLength(2);
  });

  it("should throw error for empty stores array", () => {
    expect(() => new CompositeFeatureFlagStore([])).toThrow(
      "At least one store is required",
    );
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe("Enhanced Helper Functions", () => {
  it("should create regional flag correctly", () => {
    const flag = createRegionalFlag(
      "regional-test",
      "Regional Test",
      ["us-east", "eu-west"],
      "Description",
    );

    expect(flag.key).toBe("regional-test");
    expect(flag.type).toBe("boolean");
    expect(flag.regional?.enabledRegions).toEqual(["us-east", "eu-west"]);
  });

  it("should create kill switch flag correctly", () => {
    const flag = createKillSwitchFlag("kill-switch-test", "Kill Switch Test");

    expect(flag.key).toBe("kill-switch-test");
    expect(flag.type).toBe("boolean");
    expect(flag.defaultValue).toBe(true);
  });

  it("should create user targeted flag correctly", () => {
    const flag = createUserTargetedFlag(
      "targeted-test",
      "Targeted Test",
      ["user-1", "user-2"],
      ["group-1"],
      "Description",
    );

    expect(flag.key).toBe("targeted-test");
    expect(flag.type).toBe("user-targeted");
    expect(flag.targetedUsers).toEqual(["user-1", "user-2"]);
    expect(flag.targetedGroups).toEqual(["group-1"]);
  });

  it("should create segment flag correctly", () => {
    const flag = createSegmentFlag(
      "segment-test",
      "Segment Test",
      [
        {
          id: "seg-1",
          name: "Segment 1",
          rules: [{ attribute: "plan", operator: "equals", value: "premium" }],
          matchType: "all",
        },
      ],
      "Description",
    );

    expect(flag.key).toBe("segment-test");
    expect(flag.type).toBe("boolean");
    expect(flag.segments).toHaveLength(1);
    expect(flag.segments?.[0].id).toBe("seg-1");
  });
});
