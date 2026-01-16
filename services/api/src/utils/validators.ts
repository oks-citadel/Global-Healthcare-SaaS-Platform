/**
 * Input Validation and Sanitization Utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 * HIPAA-compliant input handling
 */

import { BadRequestError } from './errors.js';

/**
 * Sanitize string input to prevent XSS attacks
 * Removes or escapes potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize HTML content
 * More aggressive than sanitizeString, strips all HTML tags
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*>/gi, '') // Remove embed tags
    .replace(/<link\b[^<]*>/gi, '') // Remove link tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove inline event handlers
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '') // Remove inline event handlers (unquoted)
    .trim();
}

/**
 * Escape HTML entities
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, char => htmlEntities[char]);
}

/**
 * Sanitize SQL input to prevent SQL injection
 * Note: This is a basic implementation. Always use parameterized queries!
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/['";\\]/g, '') // Remove dangerous SQL characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .replace(/xp_/gi, '') // Remove SQL Server extended procedures
    .replace(/exec/gi, '') // Remove exec command
    .replace(/execute/gi, '') // Remove execute command
    .replace(/union/gi, '') // Remove union command
    .replace(/select/gi, '') // Remove select command
    .replace(/insert/gi, '') // Remove insert command
    .replace(/update/gi, '') // Remove update command
    .replace(/delete/gi, '') // Remove delete command
    .replace(/drop/gi, '') // Remove drop command
    .trim();
}

/**
 * Validate and sanitize email address
 */
export function validateEmail(email: string): { valid: boolean; sanitized: string; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = email.trim().toLowerCase();

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized, error: 'Invalid email format' };
  }

  if (sanitized.length > 254) {
    return { valid: false, sanitized, error: 'Email is too long' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string): { valid: boolean; sanitized: string; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, sanitized: '', error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const sanitized = phone.replace(/\D/g, '');

  // Check length (10 digits for US, allow 11 for country code)
  if (sanitized.length < 10 || sanitized.length > 11) {
    return { valid: false, sanitized, error: 'Invalid phone number length' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate SSN format
 */
export function validateSSN(ssn: string): { valid: boolean; sanitized: string; error?: string } {
  if (!ssn || typeof ssn !== 'string') {
    return { valid: false, sanitized: '', error: 'SSN is required' };
  }

  // Remove all non-digit characters
  const sanitized = ssn.replace(/\D/g, '');

  // Check length
  if (sanitized.length !== 9) {
    return { valid: false, sanitized, error: 'SSN must be 9 digits' };
  }

  // Check for invalid SSNs
  if (sanitized === '000000000' || sanitized === '111111111' || sanitized === '123456789') {
    return { valid: false, sanitized, error: 'Invalid SSN' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate date format and range
 */
export function validateDate(date: string | Date): { valid: boolean; date?: Date; error?: string } {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }

  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  // Check reasonable date range (1900 to 2100)
  const year = parsedDate.getFullYear();
  if (year < 1900 || year > 2100) {
    return { valid: false, error: 'Date out of valid range' };
  }

  return { valid: true, date: parsedDate };
}

/**
 * Validate date of birth
 */
export function validateDateOfBirth(dob: string | Date): { valid: boolean; date?: Date; error?: string } {
  const dateResult = validateDate(dob);

  if (!dateResult.valid || !dateResult.date) {
    return dateResult;
  }

  const now = new Date();
  const age = now.getFullYear() - dateResult.date.getFullYear();

  // Check if DOB is in the future
  if (dateResult.date > now) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }

  // Check for reasonable age (0-150 years)
  if (age < 0 || age > 150) {
    return { valid: false, error: 'Invalid date of birth' };
  }

  return { valid: true, date: dateResult.date };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, strength, errors };
  }

  // Minimum length
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns');
      break;
    }
  }

  // Calculate strength
  if (errors.length === 0) {
    if (password.length >= 16 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    valid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Validate and sanitize username
 */
export function validateUsername(username: string): { valid: boolean; sanitized: string; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, sanitized: '', error: 'Username is required' };
  }

  const sanitized = username.trim();

  // Check length
  if (sanitized.length < 3 || sanitized.length > 50) {
    return { valid: false, sanitized, error: 'Username must be between 3 and 50 characters' };
  }

  // Check format (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return { valid: false, sanitized, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate URL
 */
export function validateUrl(url: string): { valid: boolean; sanitized: string; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, sanitized: '', error: 'URL is required' };
  }

  const sanitized = url.trim();

  try {
    const parsed = new URL(sanitized);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, sanitized, error: 'URL must use HTTP or HTTPS protocol' };
    }

    return { valid: true, sanitized };
  } catch {
    return { valid: false, sanitized, error: 'Invalid URL format' };
  }
}

/**
 * Validate UUID
 */
export function validateUuid(uuid: string): { valid: boolean; error?: string } {
  if (!uuid || typeof uuid !== 'string') {
    return { valid: false, error: 'UUID is required' };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' };
  }

  return { valid: true };
}

/**
 * Validate and sanitize file name
 */
export function validateFileName(fileName: string): { valid: boolean; sanitized: string; error?: string } {
  if (!fileName || typeof fileName !== 'string') {
    return { valid: false, sanitized: '', error: 'File name is required' };
  }

  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '').replace(/[/\\]/g, '');

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  // Trim
  sanitized = sanitized.trim();

  // Check length
  if (sanitized.length === 0) {
    return { valid: false, sanitized, error: 'File name is invalid' };
  }

  if (sanitized.length > 255) {
    return { valid: false, sanitized, error: 'File name is too long' };
  }

  // Check for reserved names (Windows)
  const reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = sanitized.split('.')[0].toUpperCase();
  if (reserved.includes(nameWithoutExt)) {
    return { valid: false, sanitized, error: 'File name is reserved' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate medical record number format
 */
export function validateMRN(mrn: string): { valid: boolean; sanitized: string; error?: string } {
  if (!mrn || typeof mrn !== 'string') {
    return { valid: false, sanitized: '', error: 'Medical record number is required' };
  }

  const sanitized = mrn.trim().toUpperCase();

  // Check format (alphanumeric, 6-20 characters)
  if (!/^[A-Z0-9]{6,20}$/.test(sanitized)) {
    return { valid: false, sanitized, error: 'Invalid medical record number format' };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize object keys to prevent prototype pollution
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized: any = {};
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip dangerous keys
      if (dangerousKeys.includes(key)) {
        continue;
      }

      // Recursively sanitize nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          sanitized[key] = (obj[key] as any[]).map(item =>
            typeof item === 'object' ? sanitizeObject(item) : item
          );
        } else {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      } else {
        sanitized[key] = obj[key];
      }
    }
  }

  return sanitized;
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(
  body: any,
  schema: {
    [K in keyof T]: {
      type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'date' | 'uuid';
      required?: boolean;
      min?: number;
      max?: number;
      pattern?: RegExp;
      custom?: (value: any) => { valid: boolean; error?: string };
    };
  }
): { valid: boolean; data?: Partial<T>; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const data: any = {};

  for (const key in schema) {
    const field = schema[key];
    const value = body[key];

    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[key] = `${key} is required`;
      continue;
    }

    // Skip validation if not required and not provided
    if (!field.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    switch (field.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors[key] = `${key} must be a string`;
        } else {
          data[key] = sanitizeString(value);
          if (field.min && data[key].length < field.min) {
            errors[key] = `${key} must be at least ${field.min} characters`;
          }
          if (field.max && data[key].length > field.max) {
            errors[key] = `${key} must be at most ${field.max} characters`;
          }
          if (field.pattern && !field.pattern.test(data[key])) {
            errors[key] = `${key} format is invalid`;
          }
        }
        break;

      case 'email':
        const emailResult = validateEmail(value);
        if (!emailResult.valid) {
          errors[key] = emailResult.error || `${key} is invalid`;
        } else {
          data[key] = emailResult.sanitized;
        }
        break;

      case 'phone':
        const phoneResult = validatePhone(value);
        if (!phoneResult.valid) {
          errors[key] = phoneResult.error || `${key} is invalid`;
        } else {
          data[key] = phoneResult.sanitized;
        }
        break;

      case 'date':
        const dateResult = validateDate(value);
        if (!dateResult.valid) {
          errors[key] = dateResult.error || `${key} is invalid`;
        } else {
          data[key] = dateResult.date;
        }
        break;

      case 'uuid':
        const uuidResult = validateUuid(value);
        if (!uuidResult.valid) {
          errors[key] = uuidResult.error || `${key} is invalid`;
        } else {
          data[key] = value;
        }
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors[key] = `${key} must be a number`;
        } else {
          data[key] = num;
          if (field.min !== undefined && num < field.min) {
            errors[key] = `${key} must be at least ${field.min}`;
          }
          if (field.max !== undefined && num > field.max) {
            errors[key] = `${key} must be at most ${field.max}`;
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors[key] = `${key} must be a boolean`;
        } else {
          data[key] = value;
        }
        break;
    }

    // Custom validation
    if (field.custom && !errors[key]) {
      const customResult = field.custom(value);
      if (!customResult.valid) {
        errors[key] = customResult.error || `${key} is invalid`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors,
  };
}

/**
 * Throw error if validation fails
 */
export function validateOrThrow<T>(
  body: any,
  schema: Parameters<typeof validateRequestBody<T>>[1]
): T {
  const result = validateRequestBody<T>(body, schema);

  if (!result.valid) {
    const errorMessage = Object.entries(result.errors)
      .map(([key, error]) => `${key}: ${error}`)
      .join(', ');
    throw new BadRequestError(`Validation failed: ${errorMessage}`);
  }

  return result.data as T;
}

export default {
  sanitizeString,
  sanitizeHtml,
  escapeHtml,
  sanitizeSql,
  validateEmail,
  validatePhone,
  validateSSN,
  validateDate,
  validateDateOfBirth,
  validatePassword,
  validateUsername,
  validateUrl,
  validateUuid,
  validateFileName,
  validateMRN,
  sanitizeObject,
  validateRequestBody,
  validateOrThrow,
};
