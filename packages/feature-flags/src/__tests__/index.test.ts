/**
 * Feature Flags Test Suite
 *
 * Comprehensive tests for the feature flags system including:
 * - Boolean flags
 * - Percentage rollouts
 * - User targeting
 * - A/B testing variants
 * - Scheduling
 * - Caching
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import FeatureFlagClient, {
  InMemoryFeatureFlagStore,
  RedisFeatureFlagStore,
  createBooleanFlag,
  createPercentageFlag,
  createVariantFlag,
  type FeatureFlag,
  type EvaluationContext,
} from "../index";

describe("FeatureFlagClient", () => {
  let store: InMemoryFeatureFlagStore;
  let client: FeatureFlagClient;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
    client = new FeatureFlagClient({ store });
  });

  afterEach(() => {
    client.clearCache();
  });

  // ==========================================================================
  // Boolean Flags
  // ==========================================================================

  describe("Boolean Flags", () => {
    it("should return false for non-existent flag", async () => {
      const result = await client.isEnabled("non-existent");
      expect(result).toBe(false);
    });

    it("should return default value for non-existent flag when configured", async () => {
      const clientWithDefaults = new FeatureFlagClient({
        store,
        defaultFlags: { "my-flag": true },
      });
      const result = await clientWithDefaults.isEnabled("my-flag");
      expect(result).toBe(true);
    });

    it("should evaluate enabled boolean flag", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", true));
      const result = await client.isEnabled("test-flag");
      expect(result).toBe(true);
    });

    it("should evaluate disabled boolean flag", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", false));
      const result = await client.isEnabled("test-flag");
      expect(result).toBe(false);
    });

    it("should return evaluation result with reason", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", true));
      const result = await client.evaluate("test-flag");
      expect(result.value).toBe(true);
      expect(result.reason).toBe("default");
      expect(result.flagKey).toBe("test-flag");
    });
  });

  // ==========================================================================
  // Percentage Rollouts
  // ==========================================================================

  describe("Percentage Rollouts", () => {
    it("should enable flag for user in rollout percentage", async () => {
      await client.setFlag(
        createPercentageFlag("rollout-flag", "Rollout", 100),
      );
      const result = await client.isEnabled("rollout-flag", {
        userId: "user-1",
      });
      expect(result).toBe(true);
    });

    it("should disable flag for 0% rollout", async () => {
      await client.setFlag(createPercentageFlag("rollout-flag", "Rollout", 0));
      const result = await client.isEnabled("rollout-flag", {
        userId: "user-1",
      });
      expect(result).toBe(false);
    });

    it("should be consistent for same user", async () => {
      await client.setFlag(createPercentageFlag("rollout-flag", "Rollout", 50));

      const results: boolean[] = [];
      for (let i = 0; i < 10; i++) {
        const result = await client.isEnabled("rollout-flag", {
          userId: "consistent-user",
        });
        results.push(result);
      }

      // All results should be the same
      expect(new Set(results).size).toBe(1);
    });

    it("should return percentage reason", async () => {
      await client.setFlag(
        createPercentageFlag("rollout-flag", "Rollout", 100),
      );
      const result = await client.evaluate("rollout-flag", {
        userId: "user-1",
      });
      expect(result.reason).toBe("percentage");
    });
  });

  // ==========================================================================
  // User Targeting
  // ==========================================================================

  describe("User Targeting", () => {
    it("should enable flag for targeted user", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "targeted-flag",
        name: "Targeted",
        type: "user-targeted",
        status: "enabled",
        defaultValue: false,
        targetedUsers: ["user-1", "user-2"],
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("targeted-flag", {
        userId: "user-1",
      });
      expect(result).toBe(true);
    });

    it("should disable flag for non-targeted user", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "targeted-flag",
        name: "Targeted",
        type: "user-targeted",
        status: "enabled",
        defaultValue: false,
        targetedUsers: ["user-1", "user-2"],
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("targeted-flag", {
        userId: "user-3",
      });
      expect(result).toBe(false);
    });

    it("should enable flag for targeted group", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "targeted-flag",
        name: "Targeted",
        type: "user-targeted",
        status: "enabled",
        defaultValue: false,
        targetedUsers: [],
        targetedGroups: ["beta-testers"],
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("targeted-flag", {
        userId: "user-1",
        groups: ["beta-testers"],
      });
      expect(result).toBe(true);
    });

    it("should disable flag for user not in targeted group", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "targeted-flag",
        name: "Targeted",
        type: "user-targeted",
        status: "enabled",
        defaultValue: false,
        targetedGroups: ["beta-testers"],
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("targeted-flag", {
        userId: "user-1",
        groups: ["regular-users"],
      });
      expect(result).toBe(false);
    });
  });

  // ==========================================================================
  // A/B Testing Variants
  // ==========================================================================

  describe("A/B Testing Variants", () => {
    it("should return variant for user", async () => {
      await client.setFlag(
        createVariantFlag("ab-test", "A/B Test", [
          { key: "control", weight: 50 },
          { key: "treatment", weight: 50 },
        ]),
      );
      const variant = await client.getVariant("ab-test", { userId: "user-1" });
      expect(["control", "treatment"]).toContain(variant);
    });

    it("should be consistent for same user", async () => {
      await client.setFlag(
        createVariantFlag("ab-test", "A/B Test", [
          { key: "control", weight: 50 },
          { key: "treatment", weight: 50 },
        ]),
      );

      const variants: (string | null)[] = [];
      for (let i = 0; i < 10; i++) {
        const variant = await client.getVariant("ab-test", {
          userId: "consistent-user",
        });
        variants.push(variant);
      }

      // All variants should be the same
      expect(new Set(variants).size).toBe(1);
    });

    it("should return variant reason in evaluation", async () => {
      await client.setFlag(
        createVariantFlag("ab-test", "A/B Test", [
          { key: "control", weight: 100 },
        ]),
      );

      const result = await client.evaluate("ab-test", { userId: "user-1" });
      expect(result.reason).toBe("variant");
      expect(result.variant).toBe("control");
    });
  });

  // ==========================================================================
  // Disabled Flags
  // ==========================================================================

  describe("Disabled Flags", () => {
    it("should return false for disabled flag", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "disabled-flag",
        name: "Disabled",
        type: "boolean",
        status: "disabled",
        defaultValue: true,
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("disabled-flag");
      expect(result).toBe(false);
    });

    it("should return flag-disabled reason", async () => {
      const now = new Date().toISOString();
      const flag: FeatureFlag = {
        key: "disabled-flag",
        name: "Disabled",
        type: "boolean",
        status: "disabled",
        defaultValue: true,
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.evaluate("disabled-flag");
      expect(result.reason).toBe("flag-disabled");
    });
  });

  // ==========================================================================
  // Schedule
  // ==========================================================================

  describe("Scheduled Flags", () => {
    it("should disable flag before start date", async () => {
      const now = new Date().toISOString();
      const future = new Date(Date.now() + 86400000).toISOString(); // Tomorrow
      const flag: FeatureFlag = {
        key: "scheduled-flag",
        name: "Scheduled",
        type: "boolean",
        status: "scheduled",
        defaultValue: true,
        schedule: {
          startAt: future,
        },
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("scheduled-flag");
      expect(result).toBe(false);
    });

    it("should disable flag after end date", async () => {
      const now = new Date().toISOString();
      const past = new Date(Date.now() - 86400000).toISOString(); // Yesterday
      const flag: FeatureFlag = {
        key: "scheduled-flag",
        name: "Scheduled",
        type: "boolean",
        status: "scheduled",
        defaultValue: true,
        schedule: {
          endAt: past,
        },
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.isEnabled("scheduled-flag");
      expect(result).toBe(false);
    });

    it("should return scheduled reason", async () => {
      const now = new Date().toISOString();
      const future = new Date(Date.now() + 86400000).toISOString();
      const flag: FeatureFlag = {
        key: "scheduled-flag",
        name: "Scheduled",
        type: "boolean",
        status: "scheduled",
        defaultValue: true,
        schedule: {
          startAt: future,
        },
        createdAt: now,
        updatedAt: now,
      };
      await store.set(flag);

      const result = await client.evaluate("scheduled-flag");
      expect(result.reason).toBe("scheduled");
    });
  });

  // ==========================================================================
  // Batch Operations
  // ==========================================================================

  describe("Batch Operations", () => {
    it("should evaluate multiple flags", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));
      await client.setFlag(createBooleanFlag("flag-3", "Flag 3", true));

      const results = await client.evaluateAll(["flag-1", "flag-2", "flag-3"]);

      expect(results["flag-1"]).toBe(true);
      expect(results["flag-2"]).toBe(false);
      expect(results["flag-3"]).toBe(true);
    });

    it("should get all flags with evaluation", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));

      const results = await client.getAllFlags();

      expect(Object.keys(results)).toHaveLength(2);
      expect(results["flag-1"].value).toBe(true);
      expect(results["flag-2"].value).toBe(false);
    });
  });

  // ==========================================================================
  // Caching
  // ==========================================================================

  describe("Caching", () => {
    it("should cache flag evaluations", async () => {
      await client.setFlag(createBooleanFlag("cached-flag", "Cached", true));

      // First evaluation
      await client.isEnabled("cached-flag");

      // Modify the store directly (simulating external change)
      const flag = await store.get("cached-flag");
      if (flag) {
        flag.status = "disabled";
        await store.set(flag);
      }

      // Should still return cached value
      const result = await client.isEnabled("cached-flag");
      expect(result).toBe(true);
    });

    it("should clear cache", async () => {
      await client.setFlag(createBooleanFlag("cached-flag", "Cached", true));

      await client.isEnabled("cached-flag");

      const flag = await store.get("cached-flag");
      if (flag) {
        flag.status = "disabled";
        await store.set(flag);
      }

      client.clearCache();

      const result = await client.isEnabled("cached-flag");
      expect(result).toBe(false);
    });
  });

  // ==========================================================================
  // CRUD Operations
  // ==========================================================================

  describe("CRUD Operations", () => {
    it("should create a new flag", async () => {
      await client.setFlag(createBooleanFlag("new-flag", "New Flag", true));

      const result = await client.isEnabled("new-flag");
      expect(result).toBe(true);
    });

    it("should update an existing flag", async () => {
      await client.setFlag(
        createBooleanFlag("update-flag", "Update Flag", true),
      );

      // Wait a bit to ensure updatedAt changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      await client.setFlag({
        ...createBooleanFlag("update-flag", "Updated Flag", false),
      });

      client.clearCache();
      const result = await client.isEnabled("update-flag");
      expect(result).toBe(false);
    });

    it("should delete a flag", async () => {
      await client.setFlag(
        createBooleanFlag("delete-flag", "Delete Flag", true),
      );
      await client.deleteFlag("delete-flag");

      const flag = await store.get("delete-flag");
      expect(flag).toBeNull();
    });
  });

  // ==========================================================================
  // Callbacks
  // ==========================================================================

  describe("Callbacks", () => {
    it("should call onEvaluation callback", async () => {
      const onEvaluation = vi.fn();
      const clientWithCallback = new FeatureFlagClient({
        store,
        onEvaluation,
      });

      await clientWithCallback.setFlag(
        createBooleanFlag("callback-flag", "Callback", true),
      );
      await clientWithCallback.isEnabled("callback-flag");

      expect(onEvaluation).toHaveBeenCalledWith(
        expect.objectContaining({
          flagKey: "callback-flag",
          value: true,
        }),
      );
    });
  });

  // ==========================================================================
  // Logging
  // ==========================================================================

  describe("Logging", () => {
    it("should log evaluations when enabled", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const clientWithLogging = new FeatureFlagClient({
        store,
        enableLogging: true,
      });

      await clientWithLogging.setFlag(
        createBooleanFlag("log-flag", "Log Flag", true),
      );
      await clientWithLogging.isEnabled("log-flag");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("log-flag"),
      );

      consoleSpy.mockRestore();
    });
  });
});

// ============================================================================
// InMemoryFeatureFlagStore Tests
// ============================================================================

describe("InMemoryFeatureFlagStore", () => {
  let store: InMemoryFeatureFlagStore;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
  });

  it("should store and retrieve a flag", async () => {
    const now = new Date().toISOString();
    const flag: FeatureFlag = {
      key: "test",
      name: "Test",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    };

    await store.set(flag);
    const retrieved = await store.get("test");

    expect(retrieved).toEqual(flag);
  });

  it("should return null for non-existent flag", async () => {
    const retrieved = await store.get("non-existent");
    expect(retrieved).toBeNull();
  });

  it("should return all flags", async () => {
    const now = new Date().toISOString();
    await store.set({
      key: "flag-1",
      name: "Flag 1",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });
    await store.set({
      key: "flag-2",
      name: "Flag 2",
      type: "boolean",
      status: "enabled",
      defaultValue: false,
      createdAt: now,
      updatedAt: now,
    });

    const all = await store.getAll();
    expect(all).toHaveLength(2);
  });

  it("should delete a flag", async () => {
    const now = new Date().toISOString();
    await store.set({
      key: "delete-me",
      name: "Delete Me",
      type: "boolean",
      status: "enabled",
      defaultValue: true,
      createdAt: now,
      updatedAt: now,
    });

    await store.delete("delete-me");
    const retrieved = await store.get("delete-me");

    expect(retrieved).toBeNull();
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe("Helper Functions", () => {
  it("should create boolean flag correctly", () => {
    const flag = createBooleanFlag("test", "Test", true, "Description");

    expect(flag.key).toBe("test");
    expect(flag.name).toBe("Test");
    expect(flag.description).toBe("Description");
    expect(flag.type).toBe("boolean");
    expect(flag.status).toBe("enabled");
    expect(flag.defaultValue).toBe(true);
  });

  it("should create disabled boolean flag", () => {
    const flag = createBooleanFlag("test", "Test", false);

    expect(flag.status).toBe("disabled");
    expect(flag.defaultValue).toBe(false);
  });

  it("should create percentage flag correctly", () => {
    const flag = createPercentageFlag("test", "Test", 50);

    expect(flag.type).toBe("percentage");
    expect(flag.percentage).toBe(50);
    expect(flag.status).toBe("enabled");
  });

  it("should create variant flag correctly", () => {
    const flag = createVariantFlag("test", "Test", [
      { key: "a", weight: 50 },
      { key: "b", weight: 50 },
    ]);

    expect(flag.type).toBe("variant");
    expect(flag.variants).toHaveLength(2);
    expect(flag.defaultValue).toBe(true);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  let store: InMemoryFeatureFlagStore;
  let client: FeatureFlagClient;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
    client = new FeatureFlagClient({ store });
  });

  it("should handle empty variants array", async () => {
    const now = new Date().toISOString();
    const flag: FeatureFlag = {
      key: "empty-variants",
      name: "Empty Variants",
      type: "variant",
      status: "enabled",
      defaultValue: true,
      variants: [],
      createdAt: now,
      updatedAt: now,
    };
    await store.set(flag);

    const result = await client.evaluate("empty-variants");
    expect(result.value).toBe(true);
    expect(result.reason).toBe("default");
  });

  it("should handle missing context for percentage flag", async () => {
    await client.setFlag(createPercentageFlag("no-context", "No Context", 50));

    // Should not throw and should use 'anonymous' as identifier
    const result = await client.isEnabled("no-context");
    expect(typeof result).toBe("boolean");
  });

  it("should handle percentage edge case of 100%", async () => {
    await client.setFlag(
      createPercentageFlag("full-rollout", "Full Rollout", 100),
    );

    // Test multiple users, all should get true
    const users = ["user-1", "user-2", "user-3", "user-4", "user-5"];
    for (const userId of users) {
      const result = await client.isEnabled("full-rollout", { userId });
      expect(result).toBe(true);
    }
  });

  it("should handle percentage edge case of 0%", async () => {
    await client.setFlag(createPercentageFlag("no-rollout", "No Rollout", 0));

    // Test multiple users, all should get false
    const users = ["user-1", "user-2", "user-3", "user-4", "user-5"];
    for (const userId of users) {
      const result = await client.isEnabled("no-rollout", { userId });
      expect(result).toBe(false);
    }
  });

  it("should handle variant with 0 weight", async () => {
    const now = new Date().toISOString();
    const flag: FeatureFlag = {
      key: "zero-weight",
      name: "Zero Weight",
      type: "variant",
      status: "enabled",
      defaultValue: true,
      variants: [
        { key: "zero", weight: 0 },
        { key: "full", weight: 100 },
      ],
      createdAt: now,
      updatedAt: now,
    };
    await store.set(flag);

    const variant = await client.getVariant("zero-weight", {
      userId: "any-user",
    });
    expect(variant).toBe("full");
  });
});
