/**
 * Policy Evaluation Engine
 * Evaluates policies based on country configuration and context
 */

import type { CountryConfig } from '@global-health/country-config';
import { CountryConfigLoader } from '@global-health/country-config';
import type { PolicyResult, FeatureContext, PolicyDecision } from './types';

export class PolicyEngine {
  /**
   * Evaluate if a feature is allowed based on country configuration
   */
  static evaluateFeature(
    feature: keyof CountryConfig['features'],
    context: FeatureContext
  ): PolicyResult {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config) {
        return {
          allowed: false,
          reason: `No configuration found for country: ${context.countryCode}`,
        };
      }

      if (!config.enabled) {
        return {
          allowed: false,
          reason: `Country configuration is disabled: ${context.countryCode}`,
        };
      }

      const featureAllowed = config.features[feature];

      if (!featureAllowed) {
        return {
          allowed: false,
          reason: `Feature '${feature}' is not allowed in ${config.name}`,
          metadata: {
            countryCode: config.countryCode,
            regulatoryFramework: config.regulatoryFramework,
          },
        };
      }

      return {
        allowed: true,
        metadata: {
          countryCode: config.countryCode,
          feature,
        },
      };
    } catch (error) {
      return {
        allowed: false,
        reason: `Error evaluating feature: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Evaluate custom feature based on country config
   */
  static evaluateCustomFeature(
    featureName: string,
    context: FeatureContext
  ): PolicyResult {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config) {
        return {
          allowed: false,
          reason: `No configuration found for country: ${context.countryCode}`,
        };
      }

      const customFeatures = config.features.customFeatures;
      if (!customFeatures || !(featureName in customFeatures)) {
        return {
          allowed: false,
          reason: `Custom feature '${featureName}' not configured for ${config.name}`,
        };
      }

      const featureAllowed = customFeatures[featureName];

      return {
        allowed: featureAllowed,
        reason: featureAllowed
          ? undefined
          : `Custom feature '${featureName}' is disabled in ${config.name}`,
        metadata: {
          countryCode: config.countryCode,
          feature: featureName,
        },
      };
    } catch (error) {
      return {
        allowed: false,
        reason: `Error evaluating custom feature: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Evaluate data residency requirements
   */
  static evaluateDataResidency(
    targetRegion: string,
    context: FeatureContext
  ): PolicyResult {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config) {
        return {
          allowed: false,
          reason: `No configuration found for country: ${context.countryCode}`,
        };
      }

      const { residency } = config;

      // Check if cross-border transfer is allowed
      if (targetRegion !== context.countryCode && !residency.allowCrossBorderTransfer) {
        return {
          allowed: false,
          reason: `Cross-border data transfer not allowed for ${config.name}`,
          metadata: {
            dataLocation: residency.dataLocation,
            targetRegion,
          },
        };
      }

      // Check if target region is in allowed regions
      if (residency.allowedRegions && !residency.allowedRegions.includes(targetRegion)) {
        return {
          allowed: false,
          reason: `Target region '${targetRegion}' not in allowed regions`,
          metadata: {
            allowedRegions: residency.allowedRegions,
            targetRegion,
          },
        };
      }

      const warnings: string[] = [];
      if (residency.transferSafeguards && residency.transferSafeguards.length > 0) {
        warnings.push(
          `Required safeguards: ${residency.transferSafeguards.join(', ')}`
        );
      }

      return {
        allowed: true,
        warnings: warnings.length > 0 ? warnings : undefined,
        metadata: {
          dataLocation: residency.dataLocation,
          targetRegion,
          encryptionRequired: residency.encryptionRequired,
        },
      };
    } catch (error) {
      return {
        allowed: false,
        reason: `Error evaluating data residency: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if encryption is required
   */
  static requiresEncryption(context: FeatureContext): PolicyResult {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config) {
        return {
          allowed: false,
          reason: `No configuration found for country: ${context.countryCode}`,
        };
      }

      return {
        allowed: config.residency.encryptionRequired,
        metadata: {
          encryptionRequired: config.residency.encryptionRequired,
          encryptionStandards: config.residency.encryptionStandards,
        },
      };
    } catch (error) {
      return {
        allowed: false,
        reason: `Error checking encryption requirements: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get retention period for a data type
   */
  static getRetentionPeriod(
    dataType: keyof CountryConfig['retention'] | string,
    context: FeatureContext
  ): number | null {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config) {
        return null;
      }

      const { retention } = config;

      // Check standard retention periods
      if (dataType in retention) {
        return retention[dataType as keyof typeof retention] as number;
      }

      // Check custom retention periods
      if (retention.custom && dataType in retention.custom) {
        return retention.custom[dataType];
      }

      return null;
    } catch (error) {
      console.error('Error getting retention period:', error);
      return null;
    }
  }

  /**
   * Get required audit events
   */
  static getRequiredAuditEvents(context: FeatureContext): string[] {
    try {
      const config = CountryConfigLoader.load(context.countryCode);

      if (!config || !config.audit.required) {
        return [];
      }

      return config.audit.requiredEvents;
    } catch (error) {
      console.error('Error getting required audit events:', error);
      return [];
    }
  }

  /**
   * Evaluate multiple policies at once
   */
  static evaluatePolicies(
    policies: Array<{
      type: 'feature' | 'custom-feature' | 'data-residency';
      name: string;
      context: FeatureContext;
      targetRegion?: string;
    }>
  ): PolicyDecision[] {
    return policies.map(policy => {
      let result: PolicyResult;

      switch (policy.type) {
        case 'feature':
          result = this.evaluateFeature(
            policy.name as keyof CountryConfig['features'],
            policy.context
          );
          break;
        case 'custom-feature':
          result = this.evaluateCustomFeature(policy.name, policy.context);
          break;
        case 'data-residency':
          result = this.evaluateDataResidency(
            policy.targetRegion || policy.context.countryCode,
            policy.context
          );
          break;
        default:
          result = {
            allowed: false,
            reason: `Unknown policy type: ${(policy as any).type}`,
          };
      }

      return {
        decision: result.allowed ? 'allow' : 'deny',
        reason: result.reason || (result.allowed ? 'Policy allows action' : 'Policy denies action'),
        requirements: result.warnings,
        timestamp: new Date().toISOString(),
      };
    });
  }
}
