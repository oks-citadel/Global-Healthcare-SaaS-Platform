/**
 * @global-health/policy
 * Policy evaluation engine for feature gating and compliance
 */

// Export types
export * from './types';

// Export policy engine
export * from './engine';

// Export feature gating
export * from './feature-gate';

// Export consent management
export * from './consent';

// Export audit utilities
export * from './audit';

// Re-export for convenience
export { PolicyEngine } from './engine';
export { FeatureGate } from './feature-gate';
export { ConsentManager } from './consent';
export { AuditEmitter } from './audit';
