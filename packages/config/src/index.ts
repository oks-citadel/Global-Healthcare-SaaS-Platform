/**
 * Shared Configuration Validation Package
 * @unified-health/config
 *
 * Provides type-safe configuration validation using Zod for all UnifiedHealth microservices.
 * Implements fail-fast validation with clear error messages and secret masking.
 */

export { z } from 'zod';
export * from './schemas';
export * from './validators';
export * from './logger';
export * from './types';
