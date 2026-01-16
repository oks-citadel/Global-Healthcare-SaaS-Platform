/**
 * Enhanced Feature Flags Module
 *
 * Extends the base feature flag system with:
 * - Regional availability
 * - Kill switches
 * - Environment variable support
 * - User segments
 * - Composite stores
 */

import { z } from "zod";
import {
  FeatureFlagClient as BaseClient,
  InMemoryFeatureFlagStore,
  type FeatureFlag,
  type FeatureFlagStore,
  type EvaluationContext as BaseContext,
  type EvaluationResult as BaseResult,
  type FeatureFlagClientOptions as BaseOptions,
  FeatureFlagSchema,
} from "./index";

// ============================================================================
// Enhanced Types
// ============================================================================

/**
 * Supported regions for regional feature availability
 */
export const RegionSchema = z.enum([
  "us-east",
  "us-west",
  "eu-west",
  "eu-central",
  "ap-southeast",
  "ap-northeast",
  "sa-east",
  "af-south",
  "me-south",
  "global",
]);
export type Region = z.infer<typeof RegionSchema>;

/**
 * Regional configuration for feature flags
 */
export const RegionalConfigSchema = z.object({
  enabledRegions: z.array(RegionSchema).optional(),
  disabledRegions: z.array(RegionSchema).optional(),
  regionOverrides: z.record(z.boolean()).optional(),
});
export type RegionalConfig = z.infer<typeof RegionalConfigSchema>;

/**
 * Kill switch configuration
 */
export const KillSwitchConfigSchema = z.object({
  killedAt: z.string().datetime().optional(),
  killedBy: z.string().optional(),
  reason: z.string().optional(),
  autoReenableAt: z.string().datetime().optional(),
});
export type KillSwitchConfig = z.infer<typeof KillSwitchConfigSchema>;

/**
 * Segment rule operators
 */
export const SegmentOperatorSchema = z.enum([
  "equals",
  "not_equals",
  "contains",
  "not_contains",
  "gt",
  "lt",
  "gte",
  "lte",
  "in",
  "not_in",
  "regex",
  "starts_with",
  "ends_with",
]);
export type SegmentOperator = z.infer<typeof SegmentOperatorSchema>;

/**
 * User segment definition
 */
export const UserSegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rules: z.array(
    z.object({
      attribute: z.string(),
      operator: SegmentOperatorSchema,
      value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
      ]),
    }),
  ),
  matchType: z.enum(["all", "any"]).default("all"),
});
export type UserSegment = z.infer<typeof UserSegmentSchema>;

/**
 * Extended feature flag with regional, segments, and kill switch support
 */
export interface EnhancedFeatureFlag extends FeatureFlag {
  segments?: UserSegment[];
  regional?: RegionalConfig;
  killSwitch?: KillSwitchConfig;
  tags?: string[];
  owner?: string;
}

/**
 * Extended evaluation context with region
 */
export interface EnhancedEvaluationContext extends BaseContext {
  region?: Region;
  tenant?: string;
  environment?: string;
  clientVersion?: string;
  platform?: "web" | "ios" | "android" | "api";
}

/**
 * Extended evaluation result
 */
export interface EnhancedEvaluationResult extends BaseResult {
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Enhanced Feature Flag Client
// ============================================================================

export interface EnhancedClientOptions extends BaseOptions {
  cacheTTL?: number;
  envPrefix?: string;
}

export class EnhancedFeatureFlagClient extends BaseClient {
  private envPrefix: string;
  private customCacheTTL: number;

  constructor(options: EnhancedClientOptions) {
    super(options);
    this.envPrefix = options.envPrefix || "FEATURE_FLAG_";
    this.customCacheTTL = options.cacheTTL || 60000;
  }

  /**
   * Check if a feature is enabled with enhanced context
   */
  async isFeatureEnabled(
    key: string,
    context?: EnhancedEvaluationContext,
  ): Promise<boolean> {
    // Check environment variable override first
    const envOverride = this.checkEnvOverride(key);
    if (envOverride !== null) {
      return envOverride;
    }

    return super.isEnabled(key, context);
  }

  /**
   * Get list of all feature flags
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return super.getAllFlags().then((flags) =>
      Object.values(flags).map((result) => ({
        key: result.flagKey,
        name: result.flagKey,
        type: "boolean" as const,
        status: result.value ? "enabled" : "disabled",
        defaultValue: result.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  /**
   * Set/update a feature flag
   */
  async setFeatureFlag(
    config: Omit<FeatureFlag, "createdAt" | "updatedAt">,
  ): Promise<FeatureFlag> {
    await super.setFlag(config);
    const flags = await super.getAllFlags();
    const result = flags[config.key];
    return {
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Kill a feature (emergency shutoff)
   */
  async killFeature(
    key: string,
    reason?: string,
    killedBy?: string,
    autoReenableAt?: Date,
  ): Promise<void> {
    const flags = await super.getAllFlags();
    if (!(key in flags)) {
      throw new Error(`Feature flag '${key}' not found`);
    }

    await super.setFlag({
      key,
      name: key,
      type: "boolean",
      status: "disabled",
      defaultValue: false,
      metadata: {
        killSwitch: {
          killedAt: new Date().toISOString(),
          killedBy,
          reason,
          autoReenableAt: autoReenableAt?.toISOString(),
        },
      },
    });
  }

  /**
   * Revive a killed feature
   */
  async reviveFeature(key: string): Promise<void> {
    await super.setFlag({
      key,
      name: key,
      type: "boolean",
      status: "enabled",
      defaultValue: true,
    });
  }

  /**
   * Update percentage rollout
   */
  async updateRolloutPercentage(
    key: string,
    percentage: number,
  ): Promise<void> {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }

    await super.setFlag({
      key,
      name: key,
      type: "percentage",
      status: "enabled",
      defaultValue: false,
      percentage,
    });
  }

  /**
   * Get variant payload
   */
  async getVariantPayload<T = unknown>(
    key: string,
    context?: EnhancedEvaluationContext,
  ): Promise<T | null> {
    const result = await super.evaluate(key, context);
    return null; // Would need access to the full flag to get payload
  }

  /**
   * Set cache TTL
   */
  setCacheTTL(ttl: number): void {
    this.customCacheTTL = ttl;
  }

  private checkEnvOverride(key: string): boolean | null {
    const envKey = `${this.envPrefix}${key.toUpperCase().replace(/-/g, "_")}`;
    const envValue =
      typeof process !== "undefined" ? process.env[envKey] : undefined;

    if (envValue === undefined) {
      return null;
    }

    const lowerValue = envValue.toLowerCase();
    if (
      lowerValue === "true" ||
      lowerValue === "1" ||
      lowerValue === "enabled"
    ) {
      return true;
    }
    if (
      lowerValue === "false" ||
      lowerValue === "0" ||
      lowerValue === "disabled"
    ) {
      return false;
    }

    return null;
  }
}

// ============================================================================
// Environment Variable Store
// ============================================================================

export interface EnvFeatureFlagStoreOptions {
  prefix?: string;
  flagDefinitions?: Record<
    string,
    Omit<FeatureFlag, "key" | "createdAt" | "updatedAt">
  >;
}

export class EnvFeatureFlagStore implements FeatureFlagStore {
  private prefix: string;
  private flagDefinitions: Record<
    string,
    Omit<FeatureFlag, "key" | "createdAt" | "updatedAt">
  >;

  constructor(options: EnvFeatureFlagStoreOptions = {}) {
    this.prefix = options.prefix || "FEATURE_FLAG_";
    this.flagDefinitions = options.flagDefinitions || {};
  }

  async get(key: string): Promise<FeatureFlag | null> {
    const envKey = `${this.prefix}${key.toUpperCase().replace(/-/g, "_")}`;
    const envValue =
      typeof process !== "undefined" ? process.env[envKey] : undefined;

    if (envValue === undefined && !this.flagDefinitions[key]) {
      return null;
    }

    const now = new Date().toISOString();
    const definition = this.flagDefinitions[key] || {
      name: key,
      type: "boolean" as const,
      status: "enabled" as const,
      defaultValue: false,
    };

    let defaultValue = definition.defaultValue;
    if (envValue !== undefined) {
      const lowerValue = envValue.toLowerCase();
      defaultValue =
        lowerValue === "true" || lowerValue === "1" || lowerValue === "enabled";
    }

    return {
      key,
      ...definition,
      defaultValue,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getAll(): Promise<FeatureFlag[]> {
    const flags: FeatureFlag[] = [];
    const now = new Date().toISOString();

    for (const [key, definition] of Object.entries(this.flagDefinitions)) {
      const envKey = `${this.prefix}${key.toUpperCase().replace(/-/g, "_")}`;
      const envValue =
        typeof process !== "undefined" ? process.env[envKey] : undefined;

      let defaultValue = definition.defaultValue;
      if (envValue !== undefined) {
        const lowerValue = envValue.toLowerCase();
        defaultValue =
          lowerValue === "true" ||
          lowerValue === "1" ||
          lowerValue === "enabled";
      }

      flags.push({
        key,
        ...definition,
        defaultValue,
        createdAt: now,
        updatedAt: now,
      });
    }

    return flags;
  }

  async set(_flag: FeatureFlag): Promise<void> {
    throw new Error(
      "EnvFeatureFlagStore is read-only. Use environment variables to set flags.",
    );
  }

  async delete(_key: string): Promise<void> {
    throw new Error(
      "EnvFeatureFlagStore is read-only. Use environment variables to manage flags.",
    );
  }
}

// ============================================================================
// Composite Store
// ============================================================================

export class CompositeFeatureFlagStore implements FeatureFlagStore {
  private stores: FeatureFlagStore[];
  private primaryStore: FeatureFlagStore;

  constructor(stores: FeatureFlagStore[], primaryStoreIndex = 0) {
    if (stores.length === 0) {
      throw new Error("At least one store is required");
    }
    this.stores = stores;
    this.primaryStore = stores[primaryStoreIndex];
  }

  async get(key: string): Promise<FeatureFlag | null> {
    for (const store of this.stores) {
      const flag = await store.get(key);
      if (flag) {
        return flag;
      }
    }
    return null;
  }

  async getAll(): Promise<FeatureFlag[]> {
    const flagMap = new Map<string, FeatureFlag>();

    for (let i = this.stores.length - 1; i >= 0; i--) {
      const flags = await this.stores[i].getAll();
      for (const flag of flags) {
        flagMap.set(flag.key, flag);
      }
    }

    return Array.from(flagMap.values());
  }

  async set(flag: FeatureFlag): Promise<void> {
    await this.primaryStore.set(flag);
  }

  async delete(key: string): Promise<void> {
    await this.primaryStore.delete(key);
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a regional feature flag
 */
export function createRegionalFlag(
  key: string,
  name: string,
  enabledRegions: Region[],
  description?: string,
): Omit<EnhancedFeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "boolean",
    status: "enabled",
    defaultValue: false,
    regional: {
      enabledRegions,
    },
  };
}

/**
 * Create a kill switch flag
 */
export function createKillSwitchFlag(
  key: string,
  name: string,
  description?: string,
): Omit<EnhancedFeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "boolean",
    status: "enabled",
    defaultValue: true,
  };
}

/**
 * Create a user-targeted flag
 */
export function createUserTargetedFlag(
  key: string,
  name: string,
  targetedUsers: string[],
  targetedGroups?: string[],
  description?: string,
): Omit<FeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "user-targeted",
    status: "enabled",
    defaultValue: false,
    targetedUsers,
    targetedGroups,
  };
}

/**
 * Create a segment-based flag
 */
export function createSegmentFlag(
  key: string,
  name: string,
  segments: UserSegment[],
  description?: string,
): Omit<EnhancedFeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "boolean",
    status: "enabled",
    defaultValue: false,
    segments,
  };
}

// ============================================================================
// Singleton Instance Helper
// ============================================================================

let defaultClient: EnhancedFeatureFlagClient | null = null;

export function initializeFeatureFlags(
  options: EnhancedClientOptions,
): EnhancedFeatureFlagClient {
  defaultClient = new EnhancedFeatureFlagClient(options);
  return defaultClient;
}

export function getFeatureFlagClient(): EnhancedFeatureFlagClient {
  if (!defaultClient) {
    throw new Error(
      "Feature flags not initialized. Call initializeFeatureFlags() first.",
    );
  }
  return defaultClient;
}

/**
 * Convenience function to check if a feature is enabled
 */
export async function isFeatureEnabled(
  key: string,
  context?: EnhancedEvaluationContext,
): Promise<boolean> {
  return getFeatureFlagClient().isFeatureEnabled(key, context);
}

// ============================================================================
// Re-exports
// ============================================================================

export {
  FeatureFlagSchema,
  InMemoryFeatureFlagStore,
  type FeatureFlag,
  type FeatureFlagStore,
} from "./index";

export {
  createBooleanFlag,
  createPercentageFlag,
  createVariantFlag,
  UNIFIED_HEALTH_FLAGS,
  type UnifiedHealthFlag,
} from "./index";
