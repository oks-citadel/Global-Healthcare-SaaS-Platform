/**
 * @global-health/country-config
 * Country-specific configuration for healthcare compliance
 */

// Export types
export * from './types';

// Export validation
export * from './validation';

// Export loader
export * from './loader';

// Export country configurations
export { USConfig } from './configs/us';
export { GermanyConfig } from './configs/germany';
export { KenyaConfig } from './configs/kenya';

// Re-export for convenience
import { CountryConfigLoader } from './loader';
import { USConfig } from './configs/us';
import { GermanyConfig } from './configs/germany';
import { KenyaConfig } from './configs/kenya';

/**
 * Initialize with default country configurations
 */
export function initializeDefaultConfigs(): void {
  CountryConfigLoader.registerAll([USConfig, GermanyConfig, KenyaConfig]);
}

/**
 * Quick access to loader
 */
export { CountryConfigLoader as ConfigLoader };
