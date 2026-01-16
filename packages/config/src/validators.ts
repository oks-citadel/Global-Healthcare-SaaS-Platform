/**
 * Configuration validation utilities
 *
 * Provides functions to validate environment variables and create typed config objects.
 * Implements fail-fast behavior with clear, actionable error messages.
 */

import { z, ZodError, ZodSchema } from 'zod';
import { ConfigValidationResult, ConfigError, ConfigWarning, SENSITIVE_FIELDS } from './types';

/**
 * Validate environment variables against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param env - Environment variables object (defaults to process.env)
 * @returns Validation result with typed config or errors
 */
export function validateEnv<T extends ZodSchema>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): ConfigValidationResult<z.infer<T>> {
  const result = schema.safeParse(env);

  if (result.success) {
    return {
      success: true,
      config: result.data,
      errors: [],
      warnings: [],
    };
  }

  const errors = formatZodErrors(result.error);

  return {
    success: false,
    config: null,
    errors,
    warnings: [],
  };
}

/**
 * Validate environment variables and throw on failure (fail-fast)
 *
 * @param schema - Zod schema to validate against
 * @param serviceName - Name of the service for error messages
 * @param env - Environment variables object (defaults to process.env)
 * @returns Validated and typed configuration object
 * @throws Error with detailed validation failure message
 */
export function validateEnvOrThrow<T extends ZodSchema>(
  schema: T,
  serviceName: string,
  env: Record<string, string | undefined> = process.env
): z.infer<T> {
  const result = validateEnv(schema, env);

  if (!result.success) {
    const errorMessage = formatValidationError(serviceName, result.errors);
    throw new Error(errorMessage);
  }

  return result.config;
}

/**
 * Format Zod errors into a consistent structure
 */
function formatZodErrors(error: ZodError): ConfigError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.') || 'root',
    message: err.message,
    received: err.code === 'invalid_type' ? (err as z.ZodInvalidTypeIssue).received : undefined,
    expected: err.code === 'invalid_type' ? (err as z.ZodInvalidTypeIssue).expected : undefined,
  }));
}

/**
 * Format validation errors into a user-friendly error message
 */
function formatValidationError(serviceName: string, errors: ConfigError[]): string {
  const header = `\n${'='.repeat(60)}\n  CONFIGURATION ERROR: ${serviceName}\n${'='.repeat(60)}\n`;
  const footer = `\n${'='.repeat(60)}\n  Please fix the above configuration issues and restart.\n${'='.repeat(60)}\n`;

  const errorLines = errors.map((err) => {
    let line = `  - ${err.field}: ${err.message}`;
    if (err.received !== undefined) {
      line += `\n    Received: ${JSON.stringify(err.received)}`;
    }
    if (err.expected !== undefined) {
      line += `\n    Expected: ${err.expected}`;
    }
    return line;
  });

  return header + '\nMissing or invalid environment variables:\n\n' + errorLines.join('\n') + footer;
}

/**
 * Mask sensitive values in a configuration object for logging
 *
 * @param config - Configuration object to mask
 * @param additionalSensitiveKeys - Additional keys to treat as sensitive
 * @returns Configuration object with sensitive values masked
 */
export function maskSensitiveValues<T extends Record<string, unknown>>(
  config: T,
  additionalSensitiveKeys: string[] = []
): Record<string, unknown> {
  const sensitivePatterns = [...SENSITIVE_FIELDS, ...additionalSensitiveKeys];
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    const isSensitive = sensitivePatterns.some(
      (pattern) => key.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isSensitive && typeof value === 'string') {
      masked[key] = maskString(value);
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveValues(value as Record<string, unknown>, additionalSensitiveKeys);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Mask a string value, showing only first and last few characters
 */
function maskString(value: string): string {
  if (value.length <= 8) {
    return '****';
  }
  const visibleChars = Math.min(4, Math.floor(value.length / 4));
  return `${value.substring(0, visibleChars)}${'*'.repeat(8)}${value.substring(value.length - visibleChars)}`;
}

/**
 * Check if running in production environment
 */
export function isProduction(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in development environment
 */
export function isDevelopment(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'development' || !env.NODE_ENV;
}

/**
 * Check if running in test environment
 */
export function isTest(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'test';
}

/**
 * Create a configuration factory with environment-aware defaults
 *
 * @param schema - Zod schema for the configuration
 * @param devDefaults - Default values for development mode
 * @returns Function that creates validated configuration
 */
export function createConfigFactory<T extends ZodSchema>(
  schema: T,
  devDefaults?: Partial<z.infer<T>>
) {
  return (
    serviceName: string,
    env: Record<string, string | undefined> = process.env
  ): z.infer<T> => {
    // In development, merge in default values for missing env vars
    if (isDevelopment(env) && devDefaults) {
      const mergedEnv = { ...devDefaults };
      for (const [key, value] of Object.entries(env)) {
        if (value !== undefined) {
          (mergedEnv as Record<string, unknown>)[key] = value;
        }
      }
      return validateEnvOrThrow(schema, serviceName, mergedEnv as Record<string, string>);
    }

    return validateEnvOrThrow(schema, serviceName, env);
  };
}

/**
 * Validate that all required environment variables are present
 * Useful for quick checks before full schema validation
 */
export function checkRequiredEnvVars(
  requiredVars: string[],
  env: Record<string, string | undefined> = process.env
): { missing: string[]; valid: boolean } {
  const missing = requiredVars.filter((varName) => !env[varName]);
  return {
    missing,
    valid: missing.length === 0,
  };
}
