/**
 * Configuration logging utilities
 *
 * Provides functions to log validated configuration at startup
 * with proper secret masking and formatting.
 */

import { maskSensitiveValues } from './validators';

/**
 * Configuration log options
 */
export interface ConfigLogOptions {
  /** Service name for log header */
  serviceName: string;
  /** Additional keys to mask as sensitive */
  additionalSensitiveKeys?: string[];
  /** Custom logger function (defaults to console.log) */
  logger?: (message: string) => void;
  /** Whether to use colored output (defaults to true in TTY) */
  useColors?: boolean;
}

/**
 * Log validated configuration at startup with sensitive values masked
 *
 * @param config - Configuration object to log
 * @param options - Logging options
 */
export function logConfig<T extends Record<string, unknown>>(
  config: T,
  options: ConfigLogOptions
): void {
  const {
    serviceName,
    additionalSensitiveKeys = [],
    logger = console.log,
    useColors = process.stdout.isTTY,
  } = options;

  const maskedConfig = maskSensitiveValues(config, additionalSensitiveKeys);
  const divider = '='.repeat(60);

  const header = useColors
    ? `\x1b[36m${divider}\x1b[0m\n\x1b[1m  ${serviceName} Configuration\x1b[0m\n\x1b[36m${divider}\x1b[0m`
    : `${divider}\n  ${serviceName} Configuration\n${divider}`;

  const footer = useColors ? `\x1b[36m${divider}\x1b[0m` : divider;

  logger(header);
  logger('');
  logConfigObject(maskedConfig, logger, useColors, 0);
  logger('');
  logger(footer);
}

/**
 * Recursively log a configuration object with proper indentation
 */
function logConfigObject(
  obj: Record<string, unknown>,
  logger: (message: string) => void,
  useColors: boolean,
  depth: number
): void {
  const indent = '  '.repeat(depth + 1);

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const keyStr = useColors ? `\x1b[33m${key}\x1b[0m:` : `${key}:`;
      logger(`${indent}${keyStr}`);
      logConfigObject(value as Record<string, unknown>, logger, useColors, depth + 1);
    } else {
      const formattedValue = formatValue(value, useColors);
      const keyStr = useColors ? `\x1b[33m${key}\x1b[0m` : key;
      logger(`${indent}${keyStr}: ${formattedValue}`);
    }
  }
}

/**
 * Format a value for logging with optional colors
 */
function formatValue(value: unknown, useColors: boolean): string {
  if (value === undefined) {
    return useColors ? '\x1b[90mundefined\x1b[0m' : 'undefined';
  }

  if (value === null) {
    return useColors ? '\x1b[90mnull\x1b[0m' : 'null';
  }

  if (typeof value === 'string') {
    // Check if it looks like a masked value
    if (value.includes('****')) {
      return useColors ? `\x1b[31m"${value}"\x1b[0m` : `"${value}"`;
    }
    return useColors ? `\x1b[32m"${value}"\x1b[0m` : `"${value}"`;
  }

  if (typeof value === 'number') {
    return useColors ? `\x1b[34m${value}\x1b[0m` : String(value);
  }

  if (typeof value === 'boolean') {
    return useColors ? `\x1b[35m${value}\x1b[0m` : String(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => formatValue(item, useColors));
    return `[${items.join(', ')}]`;
  }

  return String(value);
}

/**
 * Log a startup success message
 */
export function logStartupSuccess(
  serviceName: string,
  port: number,
  env: string,
  logger: (message: string) => void = console.log,
  useColors: boolean = process.stdout.isTTY ?? false
): void {
  const checkMark = useColors ? '\x1b[32m[OK]\x1b[0m' : '[OK]';
  const serviceNameColored = useColors ? `\x1b[1m${serviceName}\x1b[0m` : serviceName;
  const portColored = useColors ? `\x1b[34m${port}\x1b[0m` : String(port);
  const envColored = useColors ? `\x1b[33m${env}\x1b[0m` : env;

  logger('');
  logger(`${checkMark} ${serviceNameColored} started successfully`);
  logger(`    Port: ${portColored}`);
  logger(`    Environment: ${envColored}`);
  logger(`    Health: http://localhost:${port}/health`);
  logger('');
}

/**
 * Log a configuration validation failure and exit
 */
export function logConfigError(
  serviceName: string,
  error: Error,
  logger: (message: string) => void = console.error,
  useColors: boolean = process.stdout.isTTY ?? false
): never {
  const errorMark = useColors ? '\x1b[31m[ERROR]\x1b[0m' : '[ERROR]';
  const serviceNameColored = useColors ? `\x1b[1m${serviceName}\x1b[0m` : serviceName;

  logger('');
  logger(`${errorMark} ${serviceNameColored} failed to start due to configuration errors`);
  logger('');
  logger(error.message);
  logger('');

  process.exit(1);
}
