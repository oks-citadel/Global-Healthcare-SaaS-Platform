/**
 * Unified Health Feature Flags
 *
 * A lightweight, Redis-backed feature flag system with support for:
 * - Boolean flags
 * - Percentage rollouts
 * - User targeting
 * - A/B testing variants
 */

import { z } from "zod";

// ============================================================================
// Types & Schemas
// ============================================================================

export const FlagTypeSchema = z.enum([
  "boolean",
  "percentage",
  "variant",
  "user-targeted",
]);
export type FlagType = z.infer<typeof FlagTypeSchema>;

export const FlagStatusSchema = z.enum(["enabled", "disabled", "scheduled"]);
export type FlagStatus = z.infer<typeof FlagStatusSchema>;

export const FeatureFlagSchema = z.object({
  key: z.string().min(1),
  name: z.string(),
  description: z.string().optional(),
  type: FlagTypeSchema,
  status: FlagStatusSchema,
  defaultValue: z.boolean().default(false),
  percentage: z.number().min(0).max(100).optional(),
  variants: z
    .array(
      z.object({
        key: z.string(),
        weight: z.number().min(0).max(100),
        payload: z.any().optional(),
      }),
    )
    .optional(),
  targetedUsers: z.array(z.string()).optional(),
  targetedGroups: z.array(z.string()).optional(),
  schedule: z
    .object({
      startAt: z.string().datetime().optional(),
      endAt: z.string().datetime().optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

export interface EvaluationContext {
  userId?: string;
  email?: string;
  groups?: string[];
  attributes?: Record<string, any>;
  sessionId?: string;
}

export interface EvaluationResult<T = boolean> {
  value: T;
  reason:
    | "default"
    | "flag-disabled"
    | "percentage"
    | "targeted"
    | "variant"
    | "scheduled";
  flagKey: string;
  variant?: string;
}

// ============================================================================
// Feature Flag Client
// ============================================================================

export interface FeatureFlagStore {
  get(key: string): Promise<FeatureFlag | null>;
  getAll(): Promise<FeatureFlag[]>;
  set(flag: FeatureFlag): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface FeatureFlagClientOptions {
  store: FeatureFlagStore;
  defaultFlags?: Record<string, boolean>;
  onEvaluation?: (result: EvaluationResult) => void;
  enableLogging?: boolean;
}

export class FeatureFlagClient {
  private store: FeatureFlagStore;
  private defaultFlags: Record<string, boolean>;
  private cache: Map<string, { flag: FeatureFlag; expiresAt: number }> =
    new Map();
  private cacheTTL = 60000; // 1 minute
  private onEvaluation?: (result: EvaluationResult) => void;
  private enableLogging: boolean;

  constructor(options: FeatureFlagClientOptions) {
    this.store = options.store;
    this.defaultFlags = options.defaultFlags || {};
    this.onEvaluation = options.onEvaluation;
    this.enableLogging = options.enableLogging || false;
  }

  /**
   * Evaluate a boolean feature flag
   */
  async isEnabled(key: string, context?: EvaluationContext): Promise<boolean> {
    const result = await this.evaluate(key, context);
    return result.value;
  }

  /**
   * Evaluate a feature flag with full result
   */
  async evaluate(
    key: string,
    context?: EvaluationContext,
  ): Promise<EvaluationResult> {
    const flag = await this.getFlag(key);

    // No flag found - return default
    if (!flag) {
      const defaultValue = this.defaultFlags[key] ?? false;
      return this.createResult(key, defaultValue, "default");
    }

    // Flag is disabled
    if (flag.status === "disabled") {
      return this.createResult(key, false, "flag-disabled");
    }

    // Check schedule
    if (flag.status === "scheduled" && flag.schedule) {
      const now = new Date();
      if (flag.schedule.startAt && new Date(flag.schedule.startAt) > now) {
        return this.createResult(key, false, "scheduled");
      }
      if (flag.schedule.endAt && new Date(flag.schedule.endAt) < now) {
        return this.createResult(key, false, "scheduled");
      }
    }

    // User targeting
    if (context && flag.type === "user-targeted") {
      if (flag.targetedUsers?.includes(context.userId || "")) {
        return this.createResult(key, true, "targeted");
      }
      if (context.groups && flag.targetedGroups) {
        const hasTargetedGroup = context.groups.some((g) =>
          flag.targetedGroups?.includes(g),
        );
        if (hasTargetedGroup) {
          return this.createResult(key, true, "targeted");
        }
      }
      return this.createResult(key, flag.defaultValue, "default");
    }

    // Percentage rollout
    if (flag.type === "percentage" && flag.percentage !== undefined) {
      const hash = this.hashContext(key, context);
      const bucket = hash % 100;
      const enabled = bucket < flag.percentage;
      return this.createResult(key, enabled, "percentage");
    }

    // Variant selection
    if (flag.type === "variant" && flag.variants && flag.variants.length > 0) {
      const hash = this.hashContext(key, context);
      let cumulative = 0;
      for (const variant of flag.variants) {
        cumulative += variant.weight;
        if (hash % 100 < cumulative) {
          return {
            value: true,
            reason: "variant",
            flagKey: key,
            variant: variant.key,
          };
        }
      }
    }

    // Default boolean flag
    return this.createResult(key, flag.defaultValue, "default");
  }

  /**
   * Get variant for A/B testing
   */
  async getVariant(
    key: string,
    context?: EvaluationContext,
  ): Promise<string | null> {
    const result = await this.evaluate(key, context);
    return result.variant || null;
  }

  /**
   * Batch evaluate multiple flags
   */
  async evaluateAll(
    keys: string[],
    context?: EvaluationContext,
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.isEnabled(key, context);
      }),
    );
    return results;
  }

  /**
   * Get all flags for client-side hydration
   */
  async getAllFlags(
    context?: EvaluationContext,
  ): Promise<Record<string, EvaluationResult>> {
    const flags = await this.store.getAll();
    const results: Record<string, EvaluationResult> = {};

    for (const flag of flags) {
      results[flag.key] = await this.evaluate(flag.key, context);
    }

    return results;
  }

  /**
   * Create or update a flag
   */
  async setFlag(
    flag: Omit<FeatureFlag, "createdAt" | "updatedAt">,
  ): Promise<void> {
    const now = new Date().toISOString();
    const existingFlag = await this.store.get(flag.key);

    const fullFlag: FeatureFlag = {
      ...flag,
      createdAt: existingFlag?.createdAt || now,
      updatedAt: now,
    };

    await this.store.set(fullFlag);
    this.cache.delete(flag.key);
  }

  /**
   * Delete a flag
   */
  async deleteFlag(key: string): Promise<void> {
    await this.store.delete(key);
    this.cache.delete(key);
  }

  /**
   * Clear the local cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async getFlag(key: string): Promise<FeatureFlag | null> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.flag;
    }

    // Fetch from store
    const flag = await this.store.get(key);
    if (flag) {
      this.cache.set(key, {
        flag,
        expiresAt: Date.now() + this.cacheTTL,
      });
    }

    return flag;
  }

  private createResult(
    key: string,
    value: boolean,
    reason: EvaluationResult["reason"],
  ): EvaluationResult {
    const result: EvaluationResult = { value, reason, flagKey: key };

    if (this.enableLogging) {
      console.log(`[FeatureFlag] ${key}: ${value} (${reason})`);
    }

    if (this.onEvaluation) {
      this.onEvaluation(result);
    }

    return result;
  }

  private hashContext(flagKey: string, context?: EvaluationContext): number {
    const identifier =
      context?.userId || context?.sessionId || context?.email || "anonymous";
    const str = `${flagKey}:${identifier}`;

    // Simple hash function (FNV-1a)
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash;
  }
}

// ============================================================================
// In-Memory Store (for development/testing)
// ============================================================================

export class InMemoryFeatureFlagStore implements FeatureFlagStore {
  private flags: Map<string, FeatureFlag> = new Map();

  async get(key: string): Promise<FeatureFlag | null> {
    return this.flags.get(key) || null;
  }

  async getAll(): Promise<FeatureFlag[]> {
    return Array.from(this.flags.values());
  }

  async set(flag: FeatureFlag): Promise<void> {
    this.flags.set(flag.key, flag);
  }

  async delete(key: string): Promise<void> {
    this.flags.delete(key);
  }
}

// ============================================================================
// Redis Store
// ============================================================================

export class RedisFeatureFlagStore implements FeatureFlagStore {
  private redis: any;
  private prefix: string;

  constructor(redis: any, prefix = "feature-flags:") {
    this.redis = redis;
    this.prefix = prefix;
  }

  async get(key: string): Promise<FeatureFlag | null> {
    const data = await this.redis.get(`${this.prefix}${key}`);
    if (!data) return null;

    try {
      return FeatureFlagSchema.parse(JSON.parse(data));
    } catch {
      return null;
    }
  }

  async getAll(): Promise<FeatureFlag[]> {
    const keys = await this.redis.keys(`${this.prefix}*`);
    if (keys.length === 0) return [];

    const values = await this.redis.mget(keys);
    return values
      .filter(Boolean)
      .map((v: string) => {
        try {
          return FeatureFlagSchema.parse(JSON.parse(v));
        } catch {
          return null;
        }
      })
      .filter(Boolean) as FeatureFlag[];
  }

  async set(flag: FeatureFlag): Promise<void> {
    await this.redis.set(`${this.prefix}${flag.key}`, JSON.stringify(flag));
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(`${this.prefix}${key}`);
  }
}

// ============================================================================
// Default Flags for Unified Health
// ============================================================================

export const UNIFIED_HEALTH_FLAGS = {
  // UI Features
  NEW_APPOINTMENT_UI: "new-appointment-ui",
  TELEHEALTH_V2: "telehealth-v2",
  DARK_MODE: "dark-mode",
  NEW_DASHBOARD: "new-dashboard",

  // Backend Features
  AI_SYMPTOM_CHECKER: "ai-symptom-checker",
  REAL_TIME_NOTIFICATIONS: "real-time-notifications",
  ADVANCED_ANALYTICS: "advanced-analytics",

  // Billing Features
  NEW_PAYMENT_FLOW: "new-payment-flow",
  SUBSCRIPTION_PAUSE: "subscription-pause",
  FAMILY_PLANS: "family-plans",

  // Provider Features
  PROVIDER_AVAILABILITY_V2: "provider-availability-v2",
  VIDEO_RECORDING: "video-recording",
  E_PRESCRIBE: "e-prescribe",

  // Compliance
  HIPAA_ENHANCED_LOGGING: "hipaa-enhanced-logging",
  CONSENT_V2: "consent-v2",

  // Experimental
  BETA_FEATURES: "beta-features",
  INTERNAL_TESTING: "internal-testing",
} as const;

export type UnifiedHealthFlag =
  (typeof UNIFIED_HEALTH_FLAGS)[keyof typeof UNIFIED_HEALTH_FLAGS];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a simple boolean flag
 */
export function createBooleanFlag(
  key: string,
  name: string,
  enabled: boolean,
  description?: string,
): Omit<FeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "boolean",
    status: enabled ? "enabled" : "disabled",
    defaultValue: enabled,
  };
}

/**
 * Create a percentage rollout flag
 */
export function createPercentageFlag(
  key: string,
  name: string,
  percentage: number,
  description?: string,
): Omit<FeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "percentage",
    status: "enabled",
    defaultValue: false,
    percentage,
  };
}

/**
 * Create an A/B test variant flag
 */
export function createVariantFlag(
  key: string,
  name: string,
  variants: Array<{ key: string; weight: number }>,
  description?: string,
): Omit<FeatureFlag, "createdAt" | "updatedAt"> {
  return {
    key,
    name,
    description,
    type: "variant",
    status: "enabled",
    defaultValue: true,
    variants,
  };
}

// ============================================================================
// Exports
// ============================================================================

export default FeatureFlagClient;
