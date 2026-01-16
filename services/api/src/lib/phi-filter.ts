/**
 * PHI Filter Library
 * Filters and redacts PHI from logs and error messages
 * Ensures HIPAA compliance by preventing PHI exposure in logs
 * Compliant with HIPAA Minimum Necessary Standard (45 CFR § 164.502(b))
 */

/**
 * List of PHI field names to filter
 */
const PHI_FIELDS = [
  // Personal identifiers
  'ssn',
  'socialSecurityNumber',
  'social_security_number',
  'dateOfBirth',
  'date_of_birth',
  'dob',
  'birthDate',
  'birth_date',

  // Contact information
  'phone',
  'phoneNumber',
  'phone_number',
  'mobilePhone',
  'mobile_phone',
  'homePhone',
  'home_phone',
  'email',
  'emailAddress',
  'email_address',

  // Address information
  'address',
  'streetAddress',
  'street_address',
  'street',
  'city',
  'state',
  'zipCode',
  'zip_code',
  'postalCode',
  'postal_code',
  'country',

  // Medical identifiers
  'medicalRecordNumber',
  'medical_record_number',
  'mrn',
  'patientId',
  'patient_id',
  'insuranceId',
  'insurance_id',
  'policyNumber',
  'policy_number',
  'memberId',
  'member_id',

  // Medical information
  'diagnosis',
  'diagnoses',
  'treatment',
  'treatments',
  'medication',
  'medications',
  'prescription',
  'prescriptions',
  'allergies',
  'allergy',
  'symptoms',
  'symptom',
  'condition',
  'conditions',
  'procedure',
  'procedures',
  'labResult',
  'lab_result',
  'testResult',
  'test_result',

  // Clinical notes
  'notes',
  'clinicalNotes',
  'clinical_notes',
  'chiefComplaint',
  'chief_complaint',
  'historyOfPresentIllness',
  'history_of_present_illness',
  'physicalExam',
  'physical_exam',
  'assessment',
  'plan',

  // Biometric data
  'fingerprint',
  'voicePrint',
  'voice_print',
  'retinaScan',
  'retina_scan',
  'facialRecognition',
  'facial_recognition',

  // Financial information
  'creditCard',
  'credit_card',
  'cardNumber',
  'card_number',
  'cvv',
  'bankAccount',
  'bank_account',
  'accountNumber',
  'account_number',
  'routingNumber',
  'routing_number',

  // Authentication
  'password',
  'passwordHash',
  'password_hash',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'apiKey',
  'api_key',
  'secret',
];

/**
 * Patterns to detect PHI in strings
 */
const PHI_PATTERNS = [
  // SSN: 123-45-6789 or 123456789
  { pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g, replacement: '***-**-****' },

  // Phone: (123) 456-7890 or 123-456-7890 or 1234567890
  { pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '***-***-****' },

  // Email: user@example.com
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***@***.***' },

  // Date of Birth: YYYY-MM-DD or MM/DD/YYYY
  { pattern: /\b(19|20)\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g, replacement: '****-**-**' },
  { pattern: /\b(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/](19|20)\d{2}\b/g, replacement: '**/**/****' },

  // Credit Card: 1234-5678-9012-3456 or 1234567890123456
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '****-****-****-****' },

  // IP Address (can be PHI in some contexts)
  { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '***.***.***.***' },

  // ZIP Code
  { pattern: /\b\d{5}(-\d{4})?\b/g, replacement: '*****' },
];

/**
 * Redact PHI patterns from string
 */
function redactPHIPatterns(text: string): string {
  let result = text;

  for (const { pattern, replacement } of PHI_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Check if a field name indicates PHI
 */
function isPHIField(fieldName: string): boolean {
  const lowerName = fieldName.toLowerCase();
  return PHI_FIELDS.some(phi => {
    const lowerPhi = phi.toLowerCase();
    return lowerName === lowerPhi || lowerName.includes(lowerPhi);
  });
}

/**
 * Filter PHI from object (recursive)
 * @param obj - Object to filter
 * @param depth - Current recursion depth (to prevent infinite loops)
 * @returns Filtered object with PHI redacted
 */
export function filterPHI(obj: any, depth: number = 0): any {
  // Prevent infinite recursion
  if (depth > 10) {
    return '[REDACTED: Max depth reached]';
  }

  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj === 'string') {
    return redactPHIPatterns(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return '[REDACTED: Date]';
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => filterPHI(item, depth + 1));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const filtered: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Check if key indicates PHI
        if (isPHIField(key)) {
          filtered[key] = '[REDACTED]';
        } else {
          // Recursively filter nested objects
          filtered[key] = filterPHI(obj[key], depth + 1);
        }
      }
    }

    return filtered;
  }

  return obj;
}

/**
 * Redact sensitive fields from error messages
 * @param error - Error object or message
 * @returns Sanitized error message
 */
export function sanitizeError(error: any): any {
  if (typeof error === 'string') {
    return redactPHIPatterns(error);
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: redactPHIPatterns(error.message),
      stack: error.stack ? redactPHIPatterns(error.stack) : undefined,
    };
  }

  if (typeof error === 'object' && error !== null) {
    return filterPHI(error);
  }

  return error;
}

/**
 * Safe JSON serialization with PHI filtering
 * @param obj - Object to serialize
 * @param space - Indentation spaces (default: 2)
 * @returns JSON string with PHI redacted
 */
export function safeStringify(obj: any, space?: number): string {
  try {
    const filtered = filterPHI(obj);
    return JSON.stringify(filtered, null, space);
  } catch (error) {
    return JSON.stringify({ error: 'Failed to serialize object' });
  }
}

/**
 * Create a safe logger that filters PHI
 * Wraps console methods to automatically filter PHI
 */
export const safeLogger = {
  log: (...args: any[]) => {
    console.log(...args.map(arg => filterPHI(arg)));
  },

  info: (...args: any[]) => {
    console.info(...args.map(arg => filterPHI(arg)));
  },

  warn: (...args: any[]) => {
    console.warn(...args.map(arg => filterPHI(arg)));
  },

  error: (...args: any[]) => {
    console.error(...args.map(arg => sanitizeError(arg)));
  },

  debug: (...args: any[]) => {
    console.debug(...args.map(arg => filterPHI(arg)));
  },
};

/**
 * Mask specific field values for display
 * Shows partial information while hiding sensitive parts
 */
export function maskField(value: string, fieldType: 'ssn' | 'phone' | 'email' | 'card' | 'default'): string {
  if (!value) return '';

  switch (fieldType) {
    case 'ssn':
      // Show last 4 digits: ***-**-1234
      return value.length >= 4 ? `***-**-${value.slice(-4)}` : '***-**-****';

    case 'phone':
      // Show last 4 digits: ***-***-1234
      const digits = value.replace(/\D/g, '');
      return digits.length >= 4 ? `***-***-${digits.slice(-4)}` : '***-***-****';

    case 'email':
      // Show first char and domain: j***@example.com
      const parts = value.split('@');
      if (parts.length === 2) {
        const [user, domain] = parts;
        const maskedUser = user.length > 0 ? `${user[0]}***` : '***';
        return `${maskedUser}@${domain}`;
      }
      return '***@***.***';

    case 'card':
      // Show last 4 digits: ****-****-****-1234
      const cardDigits = value.replace(/\D/g, '');
      return cardDigits.length >= 4 ? `****-****-****-${cardDigits.slice(-4)}` : '****-****-****-****';

    case 'default':
    default:
      // Show first and last char: j***n
      if (value.length <= 2) return '***';
      return `${value[0]}***${value[value.length - 1]}`;
  }
}

/**
 * Redact entire value (for highly sensitive data)
 */
export function redact(value: any): string {
  return '[REDACTED]';
}

/**
 * Get field masking type based on field name
 */
export function getFieldMaskType(fieldName: string): 'ssn' | 'phone' | 'email' | 'card' | 'default' {
  const lowerName = fieldName.toLowerCase();

  if (lowerName.includes('ssn') || lowerName.includes('social')) {
    return 'ssn';
  }
  if (lowerName.includes('phone') || lowerName.includes('mobile')) {
    return 'phone';
  }
  if (lowerName.includes('email')) {
    return 'email';
  }
  if (lowerName.includes('card') || lowerName.includes('credit')) {
    return 'card';
  }

  return 'default';
}

/**
 * Smart mask that auto-detects field type
 */
export function smartMask(value: string, fieldName?: string): string {
  if (!value) return '';

  const maskType = fieldName ? getFieldMaskType(fieldName) : 'default';
  return maskField(value, maskType);
}

/**
 * Create a display-safe version of an object
 * Masks PHI fields instead of completely redacting them
 */
export function createDisplaySafeObject(obj: any, depth: number = 0): any {
  // Prevent infinite recursion
  if (depth > 10) {
    return '[Max depth reached]';
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => createDisplaySafeObject(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const safe: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isPHIField(key) && typeof obj[key] === 'string') {
          safe[key] = smartMask(obj[key], key);
        } else {
          safe[key] = createDisplaySafeObject(obj[key], depth + 1);
        }
      }
    }

    return safe;
  }

  return obj;
}

/**
 * Validate that object doesn't contain raw PHI
 * Useful for validating data before sending to external services
 */
export function containsPHI(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }

  if (typeof obj === 'string') {
    // Check for PHI patterns
    return PHI_PATTERNS.some(({ pattern }) => pattern.test(obj));
  }

  if (Array.isArray(obj)) {
    return obj.some(item => containsPHI(item));
  }

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isPHIField(key) || containsPHI(obj[key])) {
          return true;
        }
      }
    }
  }

  return false;
}

export default {
  filterPHI,
  sanitizeError,
  safeStringify,
  safeLogger,
  maskField,
  redact,
  smartMask,
  createDisplaySafeObject,
  containsPHI,
  isPHIField,
};
