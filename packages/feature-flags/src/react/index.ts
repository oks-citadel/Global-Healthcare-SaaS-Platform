/**
 * React hooks and components for Feature Flags
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  FeatureFlagClient,
  EvaluationContext,
  EvaluationResult,
} from "../index";

// ============================================================================
// Context
// ============================================================================

interface FeatureFlagContextValue {
  client: FeatureFlagClient | null;
  context: EvaluationContext;
  flags: Record<string, boolean>;
  loading: boolean;
  error: Error | null;
  isEnabled: (key: string) => boolean;
  getVariant: (key: string) => string | null;
  setContext: (context: EvaluationContext) => void;
  refresh: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export interface FeatureFlagProviderProps {
  client: FeatureFlagClient;
  initialContext?: EvaluationContext;
  initialFlags?: Record<string, boolean>;
  children: React.ReactNode;
}

export function FeatureFlagProvider({
  client,
  initialContext = {},
  initialFlags = {},
  children,
}: FeatureFlagProviderProps): React.ReactElement {
  const [context, setContext] = useState<EvaluationContext>(initialContext);
  const [flags, setFlags] = useState<Record<string, boolean>>(initialFlags);
  const [variants, setVariants] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allFlags = await client.getAllFlags(context);

      const flagValues: Record<string, boolean> = {};
      const variantValues: Record<string, string | null> = {};

      for (const [key, result] of Object.entries(allFlags)) {
        flagValues[key] = result.value;
        variantValues[key] = result.variant || null;
      }

      setFlags(flagValues);
      setVariants(variantValues);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load feature flags"),
      );
    } finally {
      setLoading(false);
    }
  }, [client, context]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isEnabled = useCallback(
    (key: string): boolean => {
      return flags[key] ?? false;
    },
    [flags],
  );

  const getVariant = useCallback(
    (key: string): string | null => {
      return variants[key] ?? null;
    },
    [variants],
  );

  const updateContext = useCallback((newContext: EvaluationContext) => {
    setContext((prev) => ({ ...prev, ...newContext }));
  }, []);

  const value = useMemo(
    () => ({
      client,
      context,
      flags,
      loading,
      error,
      isEnabled,
      getVariant,
      setContext: updateContext,
      refresh,
    }),
    [
      client,
      context,
      flags,
      loading,
      error,
      isEnabled,
      getVariant,
      updateContext,
      refresh,
    ],
  );

  return React.createElement(FeatureFlagContext.Provider, { value }, children);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access the full feature flag context
 */
export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider",
    );
  }
  return context;
}

/**
 * Check if a single feature flag is enabled
 */
export function useFeatureFlag(key: string): boolean {
  const { isEnabled, loading } = useFeatureFlags();

  // Return false while loading to prevent flash
  if (loading) return false;

  return isEnabled(key);
}

/**
 * Get the variant for an A/B test
 */
export function useVariant(key: string): string | null {
  const { getVariant, loading } = useFeatureFlags();

  if (loading) return null;

  return getVariant(key);
}

/**
 * Evaluate multiple flags at once
 */
export function useFeatureFlagBatch(keys: string[]): Record<string, boolean> {
  const { flags, loading } = useFeatureFlags();

  return useMemo(() => {
    if (loading) {
      return keys.reduce((acc, key) => ({ ...acc, [key]: false }), {});
    }

    return keys.reduce(
      (acc, key) => ({ ...acc, [key]: flags[key] ?? false }),
      {},
    );
  }, [keys, flags, loading]);
}

/**
 * Async hook for real-time flag evaluation
 */
export function useFeatureFlagAsync(key: string): {
  enabled: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} {
  const { client, context } = useFeatureFlags();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!client) return;

    try {
      setLoading(true);
      setError(null);
      const result = await client.isEnabled(key, context);
      setEnabled(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to evaluate flag"),
      );
    } finally {
      setLoading(false);
    }
  }, [client, key, context]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { enabled, loading, error, refresh };
}

// ============================================================================
// Components
// ============================================================================

/**
 * Conditionally render children based on feature flag
 */
export interface FeatureProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Feature({
  flag,
  children,
  fallback = null,
}: FeatureProps): React.ReactElement | null {
  const enabled = useFeatureFlag(flag);

  if (enabled) {
    return React.createElement(React.Fragment, null, children);
  }

  if (fallback) {
    return React.createElement(React.Fragment, null, fallback);
  }

  return null;
}

/**
 * Render different variants for A/B testing
 */
export interface VariantProps {
  flag: string;
  variants: Record<string, React.ReactNode>;
  fallback?: React.ReactNode;
}

export function Variant({
  flag,
  variants,
  fallback = null,
}: VariantProps): React.ReactElement | null {
  const variant = useVariant(flag);

  if (variant && variants[variant]) {
    return React.createElement(React.Fragment, null, variants[variant]);
  }

  if (fallback) {
    return React.createElement(React.Fragment, null, fallback);
  }

  return null;
}

/**
 * Loading state wrapper for feature flags
 */
export interface FeatureFlagLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagLoading({
  children,
  fallback = null,
}: FeatureFlagLoadingProps): React.ReactElement {
  const { loading } = useFeatureFlags();

  if (loading) {
    return React.createElement(React.Fragment, null, fallback);
  }

  return React.createElement(React.Fragment, null, children);
}

// ============================================================================
// HOC
// ============================================================================

/**
 * Higher-order component to inject feature flag as prop
 */
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P & { featureEnabled: boolean }>,
  flagKey: string,
): React.FC<P> {
  const WithFeatureFlag: React.FC<P> = (props) => {
    const enabled = useFeatureFlag(flagKey);
    return React.createElement(WrappedComponent, {
      ...props,
      featureEnabled: enabled,
    });
  };

  WithFeatureFlag.displayName = `withFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithFeatureFlag;
}

/**
 * HOC to only render component when flag is enabled
 */
export function withFeatureGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flagKey: string,
  FallbackComponent?: React.ComponentType<P>,
): React.FC<P> {
  const WithFeatureGate: React.FC<P> = (props) => {
    const enabled = useFeatureFlag(flagKey);

    if (enabled) {
      return React.createElement(WrappedComponent, props);
    }

    if (FallbackComponent) {
      return React.createElement(FallbackComponent, props);
    }

    return null;
  };

  WithFeatureGate.displayName = `withFeatureGate(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithFeatureGate;
}

// ============================================================================
// Exports
// ============================================================================

export { FeatureFlagContext };
