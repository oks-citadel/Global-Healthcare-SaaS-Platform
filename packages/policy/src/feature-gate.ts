/**
 * Feature Gating Utilities
 * Controls feature access based on country configuration
 */

import type { CountryConfig } from '@global-health/country-config';
import { PolicyEngine } from './engine';
import type { FeatureContext, FeatureFlag } from './types';

export class FeatureGate {
  private static featureFlags: Map<string, FeatureFlag> = new Map();

  /**
   * Check if a feature is enabled for a given context
   */
  static async isEnabled(
    feature: keyof CountryConfig['features'],
    context: FeatureContext
  ): Promise<boolean> {
    // Check policy engine first
    const policyResult = PolicyEngine.evaluateFeature(feature, context);
    if (!policyResult.allowed) {
      return false;
    }

    // Check feature flags if any
    const flagName = `feature.${String(feature)}`;
    const flag = this.featureFlags.get(flagName);

    if (flag) {
      return this.evaluateFlag(flag, context);
    }

    return true;
  }

  /**
   * Check if a custom feature is enabled
   */
  static async isCustomFeatureEnabled(
    featureName: string,
    context: FeatureContext
  ): Promise<boolean> {
    // Check policy engine first
    const policyResult = PolicyEngine.evaluateCustomFeature(featureName, context);
    if (!policyResult.allowed) {
      return false;
    }

    // Check feature flags if any
    const flagName = `custom.${featureName}`;
    const flag = this.featureFlags.get(flagName);

    if (flag) {
      return this.evaluateFlag(flag, context);
    }

    return true;
  }

  /**
   * Register a feature flag
   */
  static registerFlag(flag: FeatureFlag): void {
    this.featureFlags.set(flag.name, flag);
  }

  /**
   * Remove a feature flag
   */
  static removeFlag(name: string): void {
    this.featureFlags.delete(name);
  }

  /**
   * Get all feature flags
   */
  static getAllFlags(): FeatureFlag[] {
    return Array.from(this.featureFlags.values());
  }

  /**
   * Evaluate a feature flag
   */
  private static evaluateFlag(flag: FeatureFlag, context: FeatureContext): boolean {
    if (!flag.enabled) {
      return false;
    }

    // Check country restrictions
    if (flag.countries && !flag.countries.includes(context.countryCode)) {
      return false;
    }

    // Check user restrictions
    if (flag.users && context.userId && !flag.users.includes(context.userId)) {
      return false;
    }

    // Check organization restrictions
    if (
      flag.organizations &&
      context.organizationId &&
      !flag.organizations.includes(context.organizationId)
    ) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      if (context.userId) {
        // Use consistent hashing based on userId
        const hash = this.hashString(context.userId);
        const percentage = (hash % 100) + 1;
        return percentage <= flag.rolloutPercentage;
      }
      return false;
    }

    return true;
  }

  /**
   * Simple hash function for string
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Batch check multiple features
   */
  static async checkFeatures(
    features: Array<keyof CountryConfig['features']>,
    context: FeatureContext
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const feature of features) {
      results[feature] = await this.isEnabled(feature, context);
    }

    return results;
  }

  /**
   * Get all enabled features for a context
   */
  static async getEnabledFeatures(
    context: FeatureContext
  ): Promise<Array<keyof CountryConfig['features']>> {
    const allFeatures: Array<keyof CountryConfig['features']> = [
      'telehealth',
      'videoConsultation',
      'electronicPrescription',
      'aiDiagnosis',
      'aiTreatment',
      'remoteMonitoring',
      'wearableIntegration',
      'mobileHealth',
    ];

    const enabledFeatures: Array<keyof CountryConfig['features']> = [];

    for (const feature of allFeatures) {
      if (await this.isEnabled(feature, context)) {
        enabledFeatures.push(feature);
      }
    }

    return enabledFeatures;
  }

  /**
   * Create a feature gate decorator
   */
  static createDecorator(feature: keyof CountryConfig['features']) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        // Assume first argument contains context
        const context = args[0] as FeatureContext;

        if (!context || !context.countryCode) {
          throw new Error('Feature gate requires context with countryCode');
        }

        const enabled = await FeatureGate.isEnabled(feature, context);

        if (!enabled) {
          throw new Error(`Feature '${String(feature)}' is not enabled for ${context.countryCode}`);
        }

        return originalMethod.apply(this, args);
      };

      return descriptor;
    };
  }
}
