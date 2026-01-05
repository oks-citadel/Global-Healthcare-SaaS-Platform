import React from "react";
import type { FeatureFlagClient, EvaluationContext } from "../index";

export interface FeatureFlagContextValue {
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

export interface FeatureFlagProviderProps {
  client: FeatureFlagClient;
  initialContext?: EvaluationContext;
  initialFlags?: Record<string, boolean>;
  children: React.ReactNode;
}

export function FeatureFlagProvider(
  props: FeatureFlagProviderProps,
): React.ReactElement;

export function useFeatureFlags(): FeatureFlagContextValue;
export function useFeatureFlag(key: string): boolean;
export function useVariant(key: string): string | null;
export function useFeatureFlagBatch(keys: string[]): Record<string, boolean>;
export function useFeatureFlagAsync(key: string): {
  enabled: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

export interface FeatureProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Feature(props: FeatureProps): React.ReactElement | null;

export interface VariantProps {
  flag: string;
  variants: Record<string, React.ReactNode>;
  fallback?: React.ReactNode;
}

export function Variant(props: VariantProps): React.ReactElement | null;

export interface FeatureFlagLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagLoading(
  props: FeatureFlagLoadingProps,
): React.ReactElement;

export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P & { featureEnabled: boolean }>,
  flagKey: string,
): React.FC<P>;

export function withFeatureGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flagKey: string,
  FallbackComponent?: React.ComponentType<P>,
): React.FC<P>;
