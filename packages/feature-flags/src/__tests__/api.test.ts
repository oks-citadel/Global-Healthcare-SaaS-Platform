/**
 * Feature Flags API Test Suite
 *
 * Tests for the API endpoints.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  FeatureFlagsApi,
  EvaluateRequestSchema,
  BatchEvaluateRequestSchema,
  CreateFlagRequestSchema,
  UpdateFlagRequestSchema,
  KillFlagRequestSchema,
  UpdatePercentageRequestSchema,
} from "../api";
import FeatureFlagClient, {
  InMemoryFeatureFlagStore,
  createBooleanFlag,
} from "../index";

describe("FeatureFlagsApi", () => {
  let store: InMemoryFeatureFlagStore;
  let client: FeatureFlagClient;
  let api: FeatureFlagsApi;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
    client = new FeatureFlagClient({ store });
    api = new FeatureFlagsApi(client);
  });

  describe("evaluate", () => {
    it("should evaluate a flag", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", true));

      const response = await api.evaluate({
        body: { flagKey: "test-flag" },
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.flagKey).toBe("test-flag");
      expect(response.data?.enabled).toBe(true);
    });

    it("should evaluate with context", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", true));

      const response = await api.evaluate({
        body: {
          flagKey: "test-flag",
          context: { userId: "user-1" },
        },
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.enabled).toBe(true);
    });

    it("should return validation error for invalid request", async () => {
      const response = await api.evaluate({
        body: {},
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("evaluateBatch", () => {
    it("should evaluate multiple flags", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));

      const response = await api.evaluateBatch({
        body: { flagKeys: ["flag-1", "flag-2"] },
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.flags["flag-1"].enabled).toBe(true);
      expect(response.data?.flags["flag-2"].enabled).toBe(false);
    });
  });

  describe("listFlags", () => {
    it("should list all flags", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));

      const response = await api.listFlags({
        body: {},
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.flags).toHaveLength(2);
      expect(response.data?.total).toBe(2);
    });

    it("should filter by status", async () => {
      await client.setFlag(createBooleanFlag("enabled-flag", "Enabled", true));
      await client.setFlag(
        createBooleanFlag("disabled-flag", "Disabled", false),
      );

      const response = await api.listFlags({
        body: {},
        params: {},
        query: { status: "enabled" },
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.flags).toHaveLength(1);
      expect(response.data?.flags[0].key).toBe("enabled-flag");
    });

    it("should filter by type", async () => {
      await client.setFlag(createBooleanFlag("bool-flag", "Boolean", true));
      await client.setFlag({
        key: "percent-flag",
        name: "Percentage",
        type: "percentage",
        status: "enabled",
        defaultValue: false,
        percentage: 50,
      });

      const response = await api.listFlags({
        body: {},
        params: {},
        query: { type: "percentage" },
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.flags).toHaveLength(1);
      expect(response.data?.flags[0].key).toBe("percent-flag");
    });
  });

  describe("getFlag", () => {
    it("should get a single flag", async () => {
      await client.setFlag(createBooleanFlag("test-flag", "Test Flag", true));

      const response = await api.getFlag({
        body: {},
        params: { key: "test-flag" },
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.key).toBe("test-flag");
    });

    it("should return not found for non-existent flag", async () => {
      const response = await api.getFlag({
        body: {},
        params: { key: "non-existent" },
        query: {},
        headers: {},
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe("NOT_FOUND");
    });

    it("should return error for missing key param", async () => {
      const response = await api.getFlag({
        body: {},
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe("INVALID_PARAMS");
    });
  });

  describe("createFlag", () => {
    it("should create a new flag", async () => {
      const response = await api.createFlag({
        body: {
          key: "new-flag",
          name: "New Flag",
          type: "boolean",
          status: "enabled",
          defaultValue: true,
        },
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.key).toBe("new-flag");

      const flag = await store.get("new-flag");
      expect(flag).not.toBeNull();
    });

    it("should return error for existing flag", async () => {
      await client.setFlag(
        createBooleanFlag("existing-flag", "Existing", true),
      );

      const response = await api.createFlag({
        body: {
          key: "existing-flag",
          name: "Duplicate",
          type: "boolean",
          status: "enabled",
          defaultValue: true,
        },
        params: {},
        query: {},
        headers: {},
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe("ALREADY_EXISTS");
    });
  });

  describe("updateFlag", () => {
    it("should update an existing flag", async () => {
      await client.setFlag(
        createBooleanFlag("update-flag", "Update Flag", true),
      );

      const response = await api.updateFlag({
        body: { name: "Updated Name", defaultValue: false },
        params: { key: "update-flag" },
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe("Updated Name");
    });

    it("should return not found for non-existent flag", async () => {
      const response = await api.updateFlag({
        body: { name: "Updated" },
        params: { key: "non-existent" },
        query: {},
        headers: {},
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe("NOT_FOUND");
    });
  });

  describe("deleteFlag", () => {
    it("should delete a flag", async () => {
      await client.setFlag(
        createBooleanFlag("delete-flag", "Delete Flag", true),
      );

      const response = await api.deleteFlag({
        body: {},
        params: { key: "delete-flag" },
        query: {},
        headers: {},
      });

      expect(response.success).toBe(true);
      expect(response.data?.deleted).toBe(true);

      const flag = await store.get("delete-flag");
      expect(flag).toBeNull();
    });
  });

  describe("clearCache", () => {
    it("should clear the cache", async () => {
      const response = await api.clearCache();

      expect(response.success).toBe(true);
      expect(response.data?.cleared).toBe(true);
    });
  });
});

// ============================================================================
// Request Schema Tests
// ============================================================================

describe("Request Schemas", () => {
  describe("EvaluateRequestSchema", () => {
    it("should validate valid request", () => {
      const result = EvaluateRequestSchema.safeParse({
        flagKey: "test-flag",
        context: { userId: "user-1" },
      });
      expect(result.success).toBe(true);
    });

    it("should require flagKey", () => {
      const result = EvaluateRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should allow missing context", () => {
      const result = EvaluateRequestSchema.safeParse({
        flagKey: "test-flag",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("BatchEvaluateRequestSchema", () => {
    it("should validate valid request", () => {
      const result = BatchEvaluateRequestSchema.safeParse({
        flagKeys: ["flag-1", "flag-2"],
      });
      expect(result.success).toBe(true);
    });

    it("should require flagKeys array", () => {
      const result = BatchEvaluateRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("CreateFlagRequestSchema", () => {
    it("should validate valid flag creation", () => {
      const result = CreateFlagRequestSchema.safeParse({
        key: "new-flag",
        name: "New Flag",
        type: "boolean",
        status: "enabled",
        defaultValue: true,
      });
      expect(result.success).toBe(true);
    });

    it("should require key and name", () => {
      const result = CreateFlagRequestSchema.safeParse({
        type: "boolean",
        status: "enabled",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateFlagRequestSchema", () => {
    it("should validate partial update", () => {
      const result = UpdateFlagRequestSchema.safeParse({
        name: "Updated Name",
      });
      expect(result.success).toBe(true);
    });

    it("should allow empty object", () => {
      const result = UpdateFlagRequestSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("KillFlagRequestSchema", () => {
    it("should validate with reason", () => {
      const result = KillFlagRequestSchema.safeParse({
        reason: "Emergency shutoff",
        killedBy: "admin@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should allow empty object", () => {
      const result = KillFlagRequestSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("UpdatePercentageRequestSchema", () => {
    it("should validate valid percentage", () => {
      const result = UpdatePercentageRequestSchema.safeParse({
        percentage: 50,
      });
      expect(result.success).toBe(true);
    });

    it("should reject percentage over 100", () => {
      const result = UpdatePercentageRequestSchema.safeParse({
        percentage: 150,
      });
      expect(result.success).toBe(false);
    });

    it("should reject negative percentage", () => {
      const result = UpdatePercentageRequestSchema.safeParse({
        percentage: -10,
      });
      expect(result.success).toBe(false);
    });
  });
});
