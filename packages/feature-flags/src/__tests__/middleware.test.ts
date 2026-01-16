/**
 * Feature Flags Middleware Test Suite
 *
 * Tests for the middleware components.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createFeatureFlagMiddleware,
  requireFeature,
  requireAllFeatures,
  requireAnyFeature,
  conditionalRoute,
  abTestRoute,
  regionMiddleware,
  type MiddlewareRequest,
  type MiddlewareResponse,
  type MiddlewareNext,
} from "../middleware";
import FeatureFlagClient, {
  InMemoryFeatureFlagStore,
  createBooleanFlag,
  createVariantFlag,
} from "../index";

describe("Feature Flag Middleware", () => {
  let store: InMemoryFeatureFlagStore;
  let client: FeatureFlagClient;

  beforeEach(() => {
    store = new InMemoryFeatureFlagStore();
    client = new FeatureFlagClient({ store });
  });

  // Helper function to create mock request/response
  const createMocks = () => {
    const req: MiddlewareRequest = {
      headers: {},
      query: {},
      params: {},
      body: undefined,
    };

    let statusCode = 200;
    let responseData: unknown = null;

    const res: MiddlewareResponse = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: unknown) => {
        responseData = data;
      },
      send: (data: unknown) => {
        responseData = data;
      },
      locals: {},
    };

    const next: MiddlewareNext = vi.fn();

    return {
      req,
      res,
      next,
      getStatusCode: () => statusCode,
      getResponseData: () => responseData,
    };
  };

  describe("createFeatureFlagMiddleware", () => {
    it("should attach feature flag context to request", async () => {
      const middleware = createFeatureFlagMiddleware({ client });
      const { req, res, next } = createMocks();

      await middleware(req, res, next);

      expect(req.featureFlags).toBeDefined();
      expect(req.featureFlags?.client).toBe(client);
      expect(next).toHaveBeenCalled();
    });

    it("should preload specified flags", async () => {
      await client.setFlag(createBooleanFlag("preload-flag", "Preload", true));

      const middleware = createFeatureFlagMiddleware({
        client,
        preloadFlags: ["preload-flag"],
      });
      const { req, res, next } = createMocks();

      await middleware(req, res, next);

      expect(req.featureFlags?.flags["preload-flag"]).toBeDefined();
      expect(req.featureFlags?.flags["preload-flag"].value).toBe(true);
    });

    it("should extract context from user object", async () => {
      const middleware = createFeatureFlagMiddleware({ client });
      const { req, res, next } = createMocks();
      req.user = {
        id: "user-123",
        email: "user@example.com",
        groups: ["beta"],
      };

      await middleware(req, res, next);

      expect(req.featureFlags?.context.userId).toBe("user-123");
      expect(req.featureFlags?.context.email).toBe("user@example.com");
      expect(req.featureFlags?.context.groups).toEqual(["beta"]);
    });

    it("should extract region from header", async () => {
      const middleware = createFeatureFlagMiddleware({ client });
      const { req, res, next } = createMocks();
      req.headers["x-region"] = "eu-west";

      await middleware(req, res, next);

      expect(req.featureFlags?.context.region).toBe("eu-west");
    });

    it("should attach to response locals when enabled", async () => {
      const middleware = createFeatureFlagMiddleware({
        client,
        attachToLocals: true,
      });
      const { req, res, next } = createMocks();

      await middleware(req, res, next);

      expect(res.locals?.featureFlags).toBeDefined();
    });

    it("should use custom context extractor", async () => {
      const middleware = createFeatureFlagMiddleware({
        client,
        getContext: () => ({ userId: "custom-user" }),
      });
      const { req, res, next } = createMocks();

      await middleware(req, res, next);

      expect(req.featureFlags?.context.userId).toBe("custom-user");
    });

    it("should handle errors gracefully", async () => {
      const middleware = createFeatureFlagMiddleware({
        client,
        getContext: () => {
          throw new Error("Context error");
        },
      });
      const { req, res, next } = createMocks();

      await middleware(req, res, next);

      // Should not throw, should continue with empty context
      expect(req.featureFlags).toBeDefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("requireFeature", () => {
    it("should call next when feature is enabled", async () => {
      await client.setFlag(
        createBooleanFlag("required-flag", "Required", true),
      );

      const middleware = requireFeature("required-flag");
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 404 when feature is disabled", async () => {
      await client.setFlag(
        createBooleanFlag("disabled-flag", "Disabled", false),
      );

      const middleware = requireFeature("disabled-flag");
      const { req, res, next, getStatusCode, getResponseData } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(getStatusCode()).toBe(404);
      expect((getResponseData() as { code?: string })?.code).toBe(
        "FEATURE_DISABLED",
      );
    });

    it("should use custom status code", async () => {
      const middleware = requireFeature("missing-flag", { statusCode: 403 });
      const { req, res, next, getStatusCode } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(getStatusCode()).toBe(403);
    });

    it("should use custom message", async () => {
      const middleware = requireFeature("missing-flag", {
        message: "Custom message",
      });
      const { req, res, next, getResponseData } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect((getResponseData() as { error?: string })?.error).toBe(
        "Custom message",
      );
    });

    it("should call custom onDisabled handler", async () => {
      const onDisabled = vi.fn();
      const middleware = requireFeature("missing-flag", { onDisabled });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(onDisabled).toHaveBeenCalledWith(req, res, "missing-flag");
    });

    it("should block when no feature flag context", async () => {
      const middleware = requireFeature("any-flag");
      const { req, res, next, getStatusCode } = createMocks();

      await middleware(req, res, next);

      expect(getStatusCode()).toBe(404);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireAllFeatures", () => {
    it("should call next when all features are enabled", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", true));

      const middleware = requireAllFeatures(["flag-1", "flag-2"]);
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should block when any feature is disabled", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", true));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));

      const middleware = requireAllFeatures(["flag-1", "flag-2"]);
      const { req, res, next, getStatusCode } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(getStatusCode()).toBe(404);
    });
  });

  describe("requireAnyFeature", () => {
    it("should call next when any feature is enabled", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", false));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", true));

      const middleware = requireAnyFeature(["flag-1", "flag-2"]);
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should block when all features are disabled", async () => {
      await client.setFlag(createBooleanFlag("flag-1", "Flag 1", false));
      await client.setFlag(createBooleanFlag("flag-2", "Flag 2", false));

      const middleware = requireAnyFeature(["flag-1", "flag-2"]);
      const { req, res, next, getStatusCode } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(getStatusCode()).toBe(404);
    });
  });

  describe("conditionalRoute", () => {
    it("should call enabled handler when feature is enabled", async () => {
      await client.setFlag(createBooleanFlag("route-flag", "Route", true));

      const enabledHandler = vi.fn();
      const disabledHandler = vi.fn();

      const middleware = conditionalRoute({
        flagKey: "route-flag",
        enabledHandler,
        disabledHandler,
      });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(enabledHandler).toHaveBeenCalled();
      expect(disabledHandler).not.toHaveBeenCalled();
    });

    it("should call disabled handler when feature is disabled", async () => {
      await client.setFlag(createBooleanFlag("route-flag", "Route", false));

      const enabledHandler = vi.fn();
      const disabledHandler = vi.fn();

      const middleware = conditionalRoute({
        flagKey: "route-flag",
        enabledHandler,
        disabledHandler,
      });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(disabledHandler).toHaveBeenCalled();
      expect(enabledHandler).not.toHaveBeenCalled();
    });

    it("should call next when disabled handler not provided", async () => {
      await client.setFlag(createBooleanFlag("route-flag", "Route", false));

      const enabledHandler = vi.fn();

      const middleware = conditionalRoute({
        flagKey: "route-flag",
        enabledHandler,
      });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("abTestRoute", () => {
    it("should route to correct variant handler", async () => {
      await client.setFlag(
        createVariantFlag("ab-flag", "A/B", [
          { key: "treatment", weight: 100 },
        ]),
      );

      const controlHandler = vi.fn();
      const treatmentHandler = vi.fn();

      const middleware = abTestRoute({
        flagKey: "ab-flag",
        variants: {
          control: controlHandler,
          treatment: treatmentHandler,
        },
      });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(treatmentHandler).toHaveBeenCalled();
    });

    it("should call default handler when no variant match", async () => {
      await client.setFlag(createBooleanFlag("no-variant", "No Variant", true));

      const defaultHandler = vi.fn();

      const middleware = abTestRoute({
        flagKey: "no-variant",
        variants: {},
        defaultHandler,
      });
      const { req, res, next } = createMocks();
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      await middleware(req, res, next);

      expect(defaultHandler).toHaveBeenCalled();
    });
  });

  describe("regionMiddleware", () => {
    it("should extract region from header", () => {
      const middleware = regionMiddleware();
      const { req, res, next } = createMocks();
      req.headers["x-region"] = "eu-west";

      middleware(req, res, next);

      expect(req.region).toBe("eu-west");
      expect(next).toHaveBeenCalled();
    });

    it("should extract region from query param", () => {
      const middleware = regionMiddleware();
      const { req, res, next } = createMocks();
      req.query.region = "ap-southeast";

      middleware(req, res, next);

      expect(req.region).toBe("ap-southeast");
      expect(next).toHaveBeenCalled();
    });

    it("should use default region", () => {
      const middleware = regionMiddleware({ defaultRegion: "us-west" });
      const { req, res, next } = createMocks();

      middleware(req, res, next);

      expect(req.region).toBe("us-west");
      expect(next).toHaveBeenCalled();
    });

    it("should reject invalid region", () => {
      const middleware = regionMiddleware();
      const { req, res, next, getStatusCode } = createMocks();
      req.headers["x-region"] = "invalid-region";

      middleware(req, res, next);

      expect(getStatusCode()).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject disallowed region", () => {
      const middleware = regionMiddleware({
        allowedRegions: ["us-east", "us-west"],
      });
      const { req, res, next, getStatusCode } = createMocks();
      req.headers["x-region"] = "eu-west";

      middleware(req, res, next);

      expect(getStatusCode()).toBe(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("should update feature flag context with region", () => {
      const middleware = regionMiddleware();
      const { req, res, next } = createMocks();
      req.headers["x-region"] = "eu-central";
      req.featureFlags = {
        client,
        context: {},
        flags: {},
        isEnabled: () => false,
        getVariant: () => null,
      };

      middleware(req, res, next);

      expect(req.featureFlags?.context.region).toBe("eu-central");
    });
  });
});
