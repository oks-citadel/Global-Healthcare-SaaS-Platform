import { Request, Response, NextFunction } from 'express';
import { encrypt, decrypt, encryptFields, decryptFields, phiEncryption } from '../lib/encryption.js';

/**
 * HIPAA Encryption Middleware
 * Provides field-level encryption for sensitive PHI data
 * Implements AES-256-GCM encryption as required by HIPAA
 * Compliant with HIPAA Encryption Standard (45 CFR § 164.312(a)(2)(iv))
 */

/**
 * Configuration for encryption by resource type
 */
const ENCRYPTION_CONFIG: Record<string, string[]> = {
  patient: [
    'ssn',
    'socialSecurityNumber',
    'phone',
    'email',
    'address',
    'emergencyContactPhone',
    'insuranceId',
    'medicalRecordNumber',
  ],
  encounter: [
    'chiefComplaint',
    'diagnosis',
    'treatment',
    'notes',
    'symptoms',
    'prescriptions',
  ],
  document: [
    'content',
    'notes',
    'metadata',
  ],
  visit: [
    'notes',
    'symptoms',
    'diagnosis',
  ],
  appointment: [
    'notes',
    'reason',
  ],
  user: [
    'phone',
    'email',
  ],
};

/**
 * Extract resource type from request path
 */
function getResourceType(path: string): string | null {
  const parts = path.split('/').filter(Boolean);

  for (const resourceType of Object.keys(ENCRYPTION_CONFIG)) {
    if (parts.some(part => part.toLowerCase() === resourceType || part.toLowerCase() === `${resourceType}s`)) {
      return resourceType;
    }
  }

  return null;
}

/**
 * Get fields to encrypt for a resource type
 */
function getEncryptableFields(resourceType: string): string[] {
  return ENCRYPTION_CONFIG[resourceType] || [];
}

/**
 * Encrypt nested objects recursively
 */
function encryptNestedFields(obj: any, fields: string[]): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => encryptNestedFields(item, fields));
  }

  const result: any = { ...obj };

  for (const key in result) {
    if (fields.includes(key) && result[key] !== null && result[key] !== undefined) {
      // Encrypt the field
      try {
        result[key] = encrypt(String(result[key]));
      } catch (error) {
        console.error(`Failed to encrypt field: ${key}`, error);
      }
    } else if (typeof result[key] === 'object') {
      // Recursively process nested objects
      result[key] = encryptNestedFields(result[key], fields);
    }
  }

  return result;
}

/**
 * Decrypt nested objects recursively
 */
function decryptNestedFields(obj: any, fields: string[]): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => decryptNestedFields(item, fields));
  }

  const result: any = { ...obj };

  for (const key in result) {
    if (fields.includes(key) && result[key] !== null && result[key] !== undefined) {
      // Decrypt the field
      try {
        result[key] = decrypt(String(result[key]));
      } catch (error) {
        console.error(`Failed to decrypt field: ${key}`, error);
        // Keep encrypted value if decryption fails
      }
    } else if (typeof result[key] === 'object') {
      // Recursively process nested objects
      result[key] = decryptNestedFields(result[key], fields);
    }
  }

  return result;
}

/**
 * Middleware to automatically encrypt request body fields
 * Use before saving PHI data to database
 */
export const encryptRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Skip if no body
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    // Get resource type and fields to encrypt
    const resourceType = getResourceType(req.path);
    if (!resourceType) {
      return next();
    }

    const fields = getEncryptableFields(resourceType);
    if (fields.length === 0) {
      return next();
    }

    // Encrypt fields in request body
    req.body = encryptNestedFields(req.body, fields);

    next();
  } catch (error) {
    console.error('Encryption middleware error:', error);
    next(error);
  }
};

/**
 * Middleware to automatically decrypt response data
 * Use after fetching PHI data from database
 */
export const decryptResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get resource type and fields to decrypt
    const resourceType = getResourceType(req.path);
    if (!resourceType) {
      return next();
    }

    const fields = getEncryptableFields(resourceType);
    if (fields.length === 0) {
      return next();
    }

    // Override res.json to decrypt before sending
    const originalJson = res.json.bind(res);

    res.json = function(data: any) {
      if (data && typeof data === 'object') {
        // Decrypt data before sending
        const decryptedData = decryptNestedFields(data, fields);
        return originalJson(decryptedData);
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Decryption middleware error:', error);
    next(error);
  }
};

/**
 * Combined middleware for automatic encryption/decryption
 * Encrypts request data and decrypts response data
 */
export const autoEncryptDecrypt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Encrypt request
  encryptRequest(req, res, (err) => {
    if (err) return next(err);

    // Decrypt response
    decryptResponse(req, res, next);
  });
};

/**
 * Middleware for custom field encryption
 * Allows specifying which fields to encrypt/decrypt
 */
export const customFieldEncryption = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Encrypt request body
      if (req.body && typeof req.body === 'object') {
        req.body = encryptNestedFields(req.body, fields);
      }

      // Decrypt response
      const originalJson = res.json.bind(res);
      res.json = function(data: any) {
        if (data && typeof data === 'object') {
          const decryptedData = decryptNestedFields(data, fields);
          return originalJson(decryptedData);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Custom encryption middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware for auto PHI detection and encryption
 * Automatically detects PHI fields and encrypts them
 */
export const autoDetectPHI = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Auto-encrypt PHI in request
    if (req.body && typeof req.body === 'object') {
      req.body = phiEncryption.autoEncrypt(req.body);
    }

    // Auto-decrypt PHI in response
    const originalJson = res.json.bind(res);
    res.json = function(data: any) {
      if (data && typeof data === 'object') {
        const decryptedData = phiEncryption.autoDecrypt(data);
        return originalJson(decryptedData);
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Auto PHI detection error:', error);
    next(error);
  }
};

/**
 * Encryption helper utilities
 */
export const encryptionHelpers = {
  /**
   * Encrypt a single value
   */
  encryptValue(value: string): string {
    return encrypt(value);
  },

  /**
   * Decrypt a single value
   */
  decryptValue(encryptedValue: string): string {
    return decrypt(encryptedValue);
  },

  /**
   * Encrypt specific fields in an object
   */
  encryptObjectFields<T extends Record<string, any>>(obj: T, fields: Array<keyof T>): T {
    return encryptFields(obj, fields);
  },

  /**
   * Decrypt specific fields in an object
   */
  decryptObjectFields<T extends Record<string, any>>(obj: T, fields: Array<keyof T>): T {
    return decryptFields(obj, fields);
  },

  /**
   * Encrypt all PHI fields in an object
   */
  encryptAllPHI<T extends Record<string, any>>(obj: T): T {
    return phiEncryption.autoEncrypt(obj);
  },

  /**
   * Decrypt all PHI fields in an object
   */
  decryptAllPHI<T extends Record<string, any>>(obj: T): T {
    return phiEncryption.autoDecrypt(obj);
  },
};

/**
 * Middleware factory for resource-specific encryption
 */
export const createEncryptionMiddleware = (resourceType: string, customFields?: string[]) => {
  const fields = customFields || getEncryptableFields(resourceType);

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Encrypt request
      if (req.body && typeof req.body === 'object') {
        req.body = encryptNestedFields(req.body, fields);
      }

      // Decrypt response
      const originalJson = res.json.bind(res);
      res.json = function(data: any) {
        if (data && typeof data === 'object') {
          const decryptedData = decryptNestedFields(data, fields);
          return originalJson(decryptedData);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error(`Encryption error for ${resourceType}:`, error);
      next(error);
    }
  };
};

export default {
  encryptRequest,
  decryptResponse,
  autoEncryptDecrypt,
  customFieldEncryption,
  autoDetectPHI,
  createEncryptionMiddleware,
  encryptionHelpers,
};
