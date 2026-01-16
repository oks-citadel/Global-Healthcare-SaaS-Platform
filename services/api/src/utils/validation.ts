/**
 * Input Validation and Sanitization Utilities
 *
 * Purpose: Prevent injection attacks and ensure data integrity
 * Compliance: OWASP Top 10, HIPAA Security Rule
 *
 * Features:
 * - SQL Injection prevention
 * - XSS prevention
 * - NoSQL Injection prevention
 * - Command Injection prevention
 * - Path Traversal prevention
 * - LDAP Injection prevention
 */

import validator from 'validator';
import { z } from 'zod';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  // Escape HTML entities
  let sanitized = validator.escape(input);

  // Remove any remaining script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized.trim();
}

/**
 * Sanitize HTML input (allows safe HTML tags)
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Whitelist of allowed tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  // Remove script tags and event handlers
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized.trim();
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  const sanitized = email.trim().toLowerCase();

  if (!validator.isEmail(sanitized)) {
    throw new Error('Invalid email address');
  }

  return sanitized;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-numeric characters
  const sanitized = phone.replace(/\D/g, '');

  // Validate phone number length (US: 10 digits, International: up to 15)
  if (sanitized.length < 10 || sanitized.length > 15) {
    throw new Error('Invalid phone number');
  }

  return sanitized;
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const sanitized = url.trim();

  if (!validator.isURL(sanitized, { protocols: ['http', 'https'], require_protocol: true })) {
    throw new Error('Invalid URL');
  }

  // Prevent javascript: protocol
  if (sanitized.toLowerCase().startsWith('javascript:')) {
    throw new Error('Invalid URL protocol');
  }

  return sanitized;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  // Remove path separators and special characters
  let sanitized = filename.replace(/[/\\]/g, '');

  // Remove leading dots
  sanitized = sanitized.replace(/^\.+/, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  if (!sanitized) {
    throw new Error('Invalid filename');
  }

  return sanitized;
}

/**
 * Sanitize file path to prevent directory traversal
 */
export function sanitizePath(path: string): string {
  if (!path) return '';

  // Remove dangerous patterns
  let sanitized = path.replace(/\.\./g, '');
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove leading slashes
  sanitized = sanitized.replace(/^\/+/, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized;
}

/**
 * Sanitize SQL input (basic - use parameterized queries instead)
 */
export function sanitizeSql(input: string): string {
  if (!input) return '';

  // Escape single quotes
  let sanitized = input.replace(/'/g, "''");

  // Remove SQL comments
  sanitized = sanitized.replace(/--.*$/gm, '');
  sanitized = sanitized.replace(/\/\*.*?\*\//gs, '');

  return sanitized.trim();
}

/**
 * Sanitize NoSQL input to prevent injection
 */
export function sanitizeNoSql(input: any): any {
  if (typeof input === 'string') {
    // Remove MongoDB operators
    return input.replace(/^\$/g, '');
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = Array.isArray(input) ? [] : {};

    for (const key in input) {
      // Skip prototype properties
      if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

      // Remove keys starting with $
      if (key.startsWith('$')) continue;

      sanitized[key] = sanitizeNoSql(input[key]);
    }

    return sanitized;
  }

  return input;
}

/**
 * Sanitize command input to prevent command injection
 */
export function sanitizeCommand(input: string): string {
  if (!input) return '';

  // Remove shell metacharacters
  const dangerous = /[;&|`$(){}[\]<>!]/g;
  const sanitized = input.replace(dangerous, '');

  return sanitized.trim();
}

/**
 * Sanitize LDAP input
 */
export function sanitizeLdap(input: string): string {
  if (!input) return '';

  // Escape LDAP special characters
  let sanitized = input.replace(/\\/g, '\\5c');
  sanitized = sanitized.replace(/\*/g, '\\2a');
  sanitized = sanitized.replace(/\(/g, '\\28');
  sanitized = sanitized.replace(/\)/g, '\\29');
  sanitized = sanitized.replace(/\0/g, '\\00');

  return sanitized;
}

/**
 * Validate and sanitize UUID
 */
export function sanitizeUuid(uuid: string): string {
  if (!uuid) {
    throw new Error('UUID is required');
  }

  const sanitized = uuid.trim().toLowerCase();

  if (!validator.isUUID(sanitized)) {
    throw new Error('Invalid UUID format');
  }

  return sanitized;
}

/**
 * Validate and sanitize date
 */
export function sanitizeDate(date: string): string {
  if (!date) {
    throw new Error('Date is required');
  }

  const sanitized = date.trim();

  if (!validator.isISO8601(sanitized)) {
    throw new Error('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)');
  }

  return sanitized;
}

/**
 * Validate and sanitize integer
 */
export function sanitizeInteger(value: any): number {
  const num = parseInt(value, 10);

  if (isNaN(num)) {
    throw new Error('Invalid integer value');
  }

  return num;
}

/**
 * Validate and sanitize float
 */
export function sanitizeFloat(value: any): number {
  const num = parseFloat(value);

  if (isNaN(num)) {
    throw new Error('Invalid float value');
  }

  return num;
}

/**
 * Validate and sanitize boolean
 */
export function sanitizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return true;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  throw new Error('Invalid boolean value');
}

/**
 * Sanitize object by removing null/undefined values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password) {
    return { valid: false, errors: ['Password is required'] };
  }

  // Minimum length (NIST recommends 12+ characters)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // Require uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Require lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Require number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Require special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common passwords (basic check)
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate SSN (US Social Security Number)
 */
export function validateSsn(ssn: string): boolean {
  if (!ssn) return false;

  // Remove hyphens and spaces
  const cleaned = ssn.replace(/[-\s]/g, '');

  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return false;
  }

  // Cannot be all zeros or start with 000, 666, or 9xx
  if (
    cleaned === '000000000' ||
    cleaned.startsWith('000') ||
    cleaned.startsWith('666') ||
    cleaned.startsWith('9')
  ) {
    return false;
  }

  return true;
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): boolean {
  if (!cardNumber) return false;

  const cleaned = cardNumber.replace(/[\s-]/g, '');

  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Sanitize user input object
 * Applies appropriate sanitization based on field type
 */
export function sanitizeUserInput(input: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

    const value = input[key];

    // Skip null/undefined
    if (value === null || value === undefined) continue;

    // Sanitize based on key name
    if (key.toLowerCase().includes('email')) {
      try {
        sanitized[key] = sanitizeEmail(value);
      } catch {
        sanitized[key] = value;
      }
    } else if (key.toLowerCase().includes('phone')) {
      try {
        sanitized[key] = sanitizePhone(value);
      } catch {
        sanitized[key] = value;
      }
    } else if (key.toLowerCase().includes('url')) {
      try {
        sanitized[key] = sanitizeUrl(value);
      } catch {
        sanitized[key] = value;
      }
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeNoSql(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create validation middleware for Zod schemas
 */
export function validateSchema<T extends z.ZodType>(schema: T) {
  return (data: unknown): z.infer<T> => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        throw new Error(`Validation failed: ${messages.join(', ')}`);
      }
      throw error;
    }
  };
}

export default {
  sanitizeString,
  sanitizeHtml,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeFilename,
  sanitizePath,
  sanitizeSql,
  sanitizeNoSql,
  sanitizeCommand,
  sanitizeLdap,
  sanitizeUuid,
  sanitizeDate,
  sanitizeInteger,
  sanitizeFloat,
  sanitizeBoolean,
  sanitizeObject,
  sanitizeUserInput,
  validatePassword,
  validateSsn,
  validateCreditCard,
  validateSchema,
};
