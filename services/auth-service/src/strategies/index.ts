import { OAuthProvider } from '../dtos/oauth.dto.js';
import { OAuthBaseStrategy } from './oauth-base.strategy.js';
import { googleStrategy } from './google.strategy.js';
import { facebookStrategy } from './facebook.strategy.js';
import { appleStrategy } from './apple.strategy.js';
import { logger } from '../utils/logger.js';

/**
 * Strategy registry
 */
const strategies: Map<OAuthProvider, OAuthBaseStrategy> = new Map([
  ['google', googleStrategy],
  ['facebook', facebookStrategy],
  ['apple', appleStrategy],
]);

/**
 * Get OAuth strategy for a provider
 */
export function getStrategy(provider: OAuthProvider): OAuthBaseStrategy {
  const strategy = strategies.get(provider);

  if (!strategy) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }

  if (!strategy.isEnabled()) {
    throw new Error(`OAuth provider ${provider} is not enabled`);
  }

  return strategy;
}

/**
 * Get all enabled OAuth providers
 */
export function getEnabledProviders(): OAuthProvider[] {
  const enabled: OAuthProvider[] = [];

  for (const [provider, strategy] of strategies) {
    if (strategy.isEnabled()) {
      enabled.push(provider);
    }
  }

  return enabled;
}

/**
 * Check if a provider is enabled
 */
export function isProviderEnabled(provider: OAuthProvider): boolean {
  const strategy = strategies.get(provider);
  return strategy?.isEnabled() ?? false;
}

/**
 * Log enabled providers on startup
 */
export function logEnabledProviders(): void {
  const enabled = getEnabledProviders();

  if (enabled.length === 0) {
    logger.warn('No OAuth providers are enabled');
  } else {
    logger.info('OAuth providers enabled', { providers: enabled });
  }
}

// Export strategies for direct access if needed
export { googleStrategy, facebookStrategy, appleStrategy };
export { OAuthBaseStrategy, OAuthTokenResponse } from './oauth-base.strategy.js';
