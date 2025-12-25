import { describe, it, expect } from 'vitest';
import {
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
} from '../../../src/utils/validators.js';
import { BadRequestError } from '../../../src/utils/errors.js';

describe('Validators', () => {
  describe('sanitizeString', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeString('javascript:alert("xss")')).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      expect(sanitizeString('onclick="alert()"')).toBe('"alert()"');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
      expect(sanitizeString(123 as any)).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
    });

    it('should remove iframe tags', () => {
      expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('');
    });

    it('should remove inline event handlers', () => {
      expect(sanitizeHtml('<div onclick="alert()">Test</div>')).toBe('<div >Test</div>');
    });

    it('should remove style tags', () => {
      expect(sanitizeHtml('<style>body {display:none}</style>')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizeHtml(null as any)).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<div>test</div>')).toBe('&lt;div&gt;test&lt;&#x2F;div&gt;');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('"test" \'test\'')).toBe('&quot;test&quot; &#x27;test&#x27;');
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should handle non-string input', () => {
      expect(escapeHtml(null as any)).toBe('');
    });
  });

  describe('sanitizeSql', () => {
    it('should remove dangerous SQL characters', () => {
      expect(sanitizeSql("'; DROP TABLE users--")).toBe('TABLE users');
    });

    it('should remove SQL comments', () => {
      expect(sanitizeSql('test--comment')).toBe('testcomment');
    });

    it('should remove SQL keywords', () => {
      expect(sanitizeSql('SELECT * FROM users')).toBe('* FROM users');
    });

    it('should handle non-string input', () => {
      expect(sanitizeSql(null as any)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('should trim and lowercase email', () => {
      const result = validateEmail('  Test@Example.COM  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.valid).toBe(false);
    });

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is too long');
    });

    it('should require email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should handle null input', () => {
      const result = validateEmail(null as any);
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate 10-digit phone number', () => {
      const result = validatePhone('1234567890');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('1234567890');
    });

    it('should remove formatting characters', () => {
      const result = validatePhone('(123) 456-7890');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('1234567890');
    });

    it('should accept 11-digit phone with country code', () => {
      const result = validatePhone('11234567890');
      expect(result.valid).toBe(true);
    });

    it('should reject phone number that is too short', () => {
      const result = validatePhone('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid phone number length');
    });

    it('should reject phone number that is too long', () => {
      const result = validatePhone('123456789012');
      expect(result.valid).toBe(false);
    });

    it('should require phone number', () => {
      const result = validatePhone('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateSSN', () => {
    it('should validate correct SSN', () => {
      const result = validateSSN('234567890');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('234567890');
    });

    it('should remove formatting', () => {
      const result = validateSSN('234-56-7890');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('234567890');
    });

    it('should reject invalid SSN patterns', () => {
      expect(validateSSN('000000000').valid).toBe(false);
      expect(validateSSN('111111111').valid).toBe(false);
      expect(validateSSN('234567890').valid).toBe(true);
    });

    it('should reject wrong length', () => {
      const result = validateSSN('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('SSN must be 9 digits');
    });

    it('should require SSN', () => {
      const result = validateSSN('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('should validate date string', () => {
      const result = validateDate('2025-01-01');
      expect(result.valid).toBe(true);
      expect(result.date).toBeInstanceOf(Date);
    });

    it('should validate Date object', () => {
      const date = new Date('2025-01-01');
      const result = validateDate(date);
      expect(result.valid).toBe(true);
      expect(result.date).toBe(date);
    });

    it('should reject invalid date format', () => {
      const result = validateDate('invalid-date');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid date format');
    });

    it('should reject date out of range', () => {
      expect(validateDate('1800-01-01').valid).toBe(false);
      expect(validateDate('2200-01-01').valid).toBe(false);
    });

    it('should accept dates in valid range', () => {
      // Use Date objects to avoid timezone parsing issues
      expect(validateDate(new Date(1900, 0, 1)).valid).toBe(true);
      expect(validateDate(new Date(2100, 11, 31)).valid).toBe(true);
    });

    it('should require date', () => {
      const result = validateDate('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateDateOfBirth', () => {
    it('should validate valid date of birth', () => {
      const result = validateDateOfBirth('1990-01-01');
      expect(result.valid).toBe(true);
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDateOfBirth(futureDate);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date of birth cannot be in the future');
    });

    it('should reject age over 150', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 151);
      const result = validateDateOfBirth(oldDate);
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('MyStr0ngP@ssw0rd!');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.errors).toHaveLength(0);
    });

    it('should require minimum length', () => {
      const result = validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 12 characters long');
    });

    it('should require uppercase', () => {
      const result = validatePassword('nouppercasepass1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase', () => {
      const result = validatePassword('NOLOWERCASE1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = validatePassword('NoNumberPass!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const result = validatePassword('NoSpecialChar1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject common patterns', () => {
      expect(validatePassword('Password123456!').errors).toContain('Password contains common patterns');
      expect(validatePassword('Qwerty123456!').errors).toContain('Password contains common patterns');
    });

    it('should reject password with repeated characters', () => {
      const result = validatePassword('AAAAAAaaa111!');
      expect(result.errors).toContain('Password contains common patterns');
    });

    it('should classify medium strength password', () => {
      const result = validatePassword('GoodPass123!');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should reject too long password', () => {
      const longPass = 'A'.repeat(130) + '1!a';
      const result = validatePassword(longPass);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is too long (max 128 characters)');
    });
  });

  describe('validateUsername', () => {
    it('should validate correct username', () => {
      const result = validateUsername('john_doe-123');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('john_doe-123');
    });

    it('should trim whitespace', () => {
      const result = validateUsername('  username  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('username');
    });

    it('should reject short username', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 3 and 50 characters');
    });

    it('should reject long username', () => {
      const result = validateUsername('a'.repeat(51));
      expect(result.valid).toBe(false);
    });

    it('should reject special characters', () => {
      const result = validateUsername('user@name!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('can only contain letters, numbers, underscores, and hyphens');
    });
  });

  describe('validateUrl', () => {
    it('should validate HTTP URL', () => {
      const result = validateUrl('http://example.com');
      expect(result.valid).toBe(true);
    });

    it('should validate HTTPS URL', () => {
      const result = validateUrl('https://example.com/path?query=value');
      expect(result.valid).toBe(true);
    });

    it('should reject non-HTTP protocols', () => {
      expect(validateUrl('ftp://example.com').valid).toBe(false);
      expect(validateUrl('file:///etc/passwd').valid).toBe(false);
      expect(validateUrl('javascript:alert()').valid).toBe(false);
    });

    it('should reject invalid URL format', () => {
      const result = validateUrl('not-a-url');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });
  });

  describe('validateUuid', () => {
    it('should validate correct UUID', () => {
      const result = validateUuid('123e4567-e89b-12d3-a456-426614174000');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const result = validateUuid('not-a-uuid');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid UUID format');
    });

    it('should reject UUID with wrong version', () => {
      const result = validateUuid('123e4567-e89b-62d3-a456-426614174000');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFileName', () => {
    it('should validate correct file name', () => {
      const result = validateFileName('document.pdf');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('document.pdf');
    });

    it('should remove path traversal', () => {
      const result = validateFileName('../../../etc/passwd');
      expect(result.sanitized).toBe('etcpasswd');
    });

    it('should remove dangerous characters', () => {
      const result = validateFileName('file<>:"|?*.txt');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('file.txt');
    });

    it('should reject reserved Windows names', () => {
      expect(validateFileName('CON.txt').valid).toBe(false);
      expect(validateFileName('PRN.doc').valid).toBe(false);
      expect(validateFileName('AUX').valid).toBe(false);
    });

    it('should reject empty file name', () => {
      const result = validateFileName('   ');
      expect(result.valid).toBe(false);
    });

    it('should reject too long file name', () => {
      const result = validateFileName('a'.repeat(256) + '.txt');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateMRN', () => {
    it('should validate correct MRN', () => {
      const result = validateMRN('MRN123456');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('MRN123456');
    });

    it('should convert to uppercase', () => {
      const result = validateMRN('mrn123456');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('MRN123456');
    });

    it('should reject too short MRN', () => {
      const result = validateMRN('MRN12');
      expect(result.valid).toBe(false);
    });

    it('should reject too long MRN', () => {
      const result = validateMRN('MRN' + '1'.repeat(20));
      expect(result.valid).toBe(false);
    });

    it('should reject MRN with special characters', () => {
      const result = validateMRN('MRN-123456');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize object', () => {
      const obj = {
        name: 'test',
        value: 123,
      };
      const result = sanitizeObject(obj);
      expect(result).toEqual(obj);
    });

    it('should remove dangerous keys', () => {
      const obj = {
        name: 'test',
        __proto__: { admin: true },
        constructor: {},
        prototype: {},
      };
      const result = sanitizeObject(obj);
      expect(result).toEqual({ name: 'test' });
      expect(result).not.toHaveProperty('__proto__');
      expect(result).not.toHaveProperty('constructor');
      expect(result).not.toHaveProperty('prototype');
    });

    it('should recursively sanitize nested objects', () => {
      const obj = {
        user: {
          name: 'test',
          __proto__: { admin: true },
        },
      };
      const result = sanitizeObject(obj);
      expect(result.user).toEqual({ name: 'test' });
    });

    it('should handle arrays', () => {
      const obj = {
        items: [
          { name: 'item1', __proto__: {} },
          { name: 'item2' },
        ],
      };
      const result = sanitizeObject(obj);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual({ name: 'item1' });
    });

    it('should handle null input', () => {
      expect(sanitizeObject(null as any)).toBeNull();
    });
  });

  describe('validateRequestBody', () => {
    it('should validate valid request body', () => {
      const body = {
        email: 'test@example.com',
        phone: '1234567890',
        age: 25,
      };

      const schema = {
        email: { type: 'email' as const, required: true },
        phone: { type: 'phone' as const, required: true },
        age: { type: 'number' as const, required: true, min: 18, max: 120 },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(true);
      expect(result.data?.email).toBe('test@example.com');
    });

    it('should detect missing required fields', () => {
      const body = {};
      const schema = {
        email: { type: 'email' as const, required: true },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toContain('required');
    });

    it('should validate string length', () => {
      const body = { name: 'ab' };
      const schema = {
        name: { type: 'string' as const, required: true, min: 3, max: 50 },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toContain('at least 3 characters');
    });

    it('should validate number range', () => {
      const body = { age: 200 };
      const schema = {
        age: { type: 'number' as const, required: true, min: 0, max: 150 },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.age).toContain('at most 150');
    });

    it('should run custom validation', () => {
      const body = { value: 'test' };
      const schema = {
        value: {
          type: 'string' as const,
          required: true,
          custom: (val: string) => ({
            valid: val === 'allowed',
            error: 'Value must be "allowed"',
          }),
        },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.value).toBe('Value must be "allowed"');
    });

    it('should skip optional fields', () => {
      const body = { email: 'test@example.com' };
      const schema = {
        email: { type: 'email' as const, required: true },
        phone: { type: 'phone' as const, required: false },
      };

      const result = validateRequestBody(body, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateOrThrow', () => {
    it('should return data if validation passes', () => {
      const body = { email: 'test@example.com' };
      const schema = {
        email: { type: 'email' as const, required: true },
      };

      const result = validateOrThrow(body, schema);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw BadRequestError if validation fails', () => {
      const body = { email: 'invalid' };
      const schema = {
        email: { type: 'email' as const, required: true },
      };

      expect(() => validateOrThrow(body, schema)).toThrow(BadRequestError);
      expect(() => validateOrThrow(body, schema)).toThrow('Validation failed');
    });
  });
});
