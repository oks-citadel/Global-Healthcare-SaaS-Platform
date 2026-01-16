/**
 * Type definitions for configuration validation
 */

import { z } from 'zod';

/**
 * Result of configuration validation
 */
export interface ConfigValidationResult<T> {
  success: boolean;
  config: T | null;
  errors: ConfigError[];
  warnings: ConfigWarning[];
}

/**
 * Configuration error details
 */
export interface ConfigError {
  field: string;
  message: string;
  received?: unknown;
  expected?: string;
}

/**
 * Configuration warning details
 */
export interface ConfigWarning {
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Base configuration that all services share
 */
export interface BaseServiceConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  serviceName: string;
  version: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  url: string;
  poolMin?: number;
  poolMax?: number;
  ssl?: boolean;
}

/**
 * Redis configuration
 */
export interface RedisConfig {
  url?: string;
  host: string;
  port: number;
  password?: string;
  tls?: boolean;
}

/**
 * JWT configuration
 */
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn?: string;
  issuer?: string;
}

/**
 * CORS configuration
 */
export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Fields that should be masked in logs
 */
export const SENSITIVE_FIELDS = [
  'password',
  'secret',
  'token',
  'key',
  'apiKey',
  'api_key',
  'authToken',
  'auth_token',
  'credential',
  'private',
  'encryption',
] as const;

export type SensitiveField = typeof SENSITIVE_FIELDS[number];
