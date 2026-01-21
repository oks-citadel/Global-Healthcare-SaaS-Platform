/**
 * Schema Validator for API Contract Testing
 * Uses JSON Schema validation for response contract verification
 */

import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache compiled schemas
const schemaCache: Map<string, ValidateFunction> = new Map();

/**
 * Validates data against a JSON schema
 */
export function validateSchema(data: unknown, schema: object, schemaName?: string): ValidationResult {
  const cacheKey = schemaName || JSON.stringify(schema);

  let validate = schemaCache.get(cacheKey);
  if (!validate) {
    validate = ajv.compile(schema);
    schemaCache.set(cacheKey, validate);
  }

  const valid = validate(data);

  return {
    valid: valid === true,
    errors: validate.errors?.map(err => ({
      path: err.instancePath || '/',
      message: err.message || 'Validation error',
      params: err.params,
    })) || [],
  };
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  params?: Record<string, unknown>;
}

/**
 * Pre-defined schemas for common API responses
 */
export const schemas = {
  // Success response wrapper
  successResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', const: true },
      data: { type: 'object' },
    },
    required: ['success', 'data'],
  },

  // Error response
  errorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
        },
        required: ['code', 'message'],
      },
    },
    required: ['error'],
  },

  // Pagination wrapper
  paginatedResponse: {
    type: 'object',
    properties: {
      data: { type: 'array' },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1 },
          total: { type: 'integer', minimum: 0 },
          totalPages: { type: 'integer', minimum: 0 },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
        required: ['page', 'limit', 'total'],
      },
    },
    required: ['data', 'pagination'],
  },

  // User schema
  user: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string', minLength: 1 },
      lastName: { type: 'string', minLength: 1 },
      role: {
        type: 'string',
        enum: ['patient', 'provider', 'admin', 'super_admin']
      },
      emailVerified: { type: 'boolean' },
      phone: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'email', 'role'],
    additionalProperties: true,
  },

  // Auth response
  authResponse: {
    type: 'object',
    properties: {
      accessToken: { type: 'string', minLength: 1 },
      refreshToken: { type: 'string', minLength: 1 },
      expiresIn: { type: 'integer', minimum: 0 },
      tokenType: { type: 'string', const: 'Bearer' },
      user: { $ref: '#/definitions/user' },
    },
    required: ['accessToken', 'expiresIn'],
    definitions: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
        },
      },
    },
  },

  // Appointment schema
  appointment: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      providerId: { type: 'string', format: 'uuid' },
      type: {
        type: 'string',
        enum: ['checkup', 'consultation', 'follow_up', 'emergency', 'telehealth']
      },
      status: {
        type: 'string',
        enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']
      },
      scheduledAt: { type: 'string', format: 'date-time' },
      duration: { type: 'integer', minimum: 5 },
      reason: { type: 'string' },
      notes: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'patientId', 'providerId', 'status', 'scheduledAt'],
    additionalProperties: true,
  },

  // Patient schema
  patient: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      dateOfBirth: { type: 'string', format: 'date' },
      gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
      bloodType: { type: 'string' },
      allergies: { type: 'array', items: { type: 'string' } },
      medications: { type: 'array', items: { type: 'string' } },
      conditions: { type: 'array', items: { type: 'string' } },
      emergencyContact: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          relationship: { type: 'string' },
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'userId'],
    additionalProperties: true,
  },

  // Encounter schema
  encounter: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      providerId: { type: 'string', format: 'uuid' },
      appointmentId: { type: 'string', format: 'uuid' },
      type: { type: 'string', enum: ['in_person', 'telehealth', 'phone'] },
      status: {
        type: 'string',
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled']
      },
      chiefComplaint: { type: 'string' },
      diagnosis: { type: 'string' },
      startedAt: { type: 'string', format: 'date-time' },
      endedAt: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'patientId', 'providerId', 'status'],
    additionalProperties: true,
  },

  // Document schema
  document: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      uploadedBy: { type: 'string', format: 'uuid' },
      type: {
        type: 'string',
        enum: ['lab_result', 'prescription', 'imaging', 'discharge_summary', 'other']
      },
      name: { type: 'string', minLength: 1 },
      mimeType: { type: 'string' },
      size: { type: 'integer', minimum: 0 },
      status: { type: 'string', enum: ['active', 'archived', 'deleted'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'patientId', 'name', 'type'],
    additionalProperties: true,
  },

  // Plan schema
  plan: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 1 },
      price: { type: 'number', minimum: 0 },
      interval: { type: 'string', enum: ['month', 'year'] },
      features: { type: 'array', items: { type: 'string' } },
      isActive: { type: 'boolean' },
    },
    required: ['id', 'name', 'price'],
    additionalProperties: true,
  },

  // Health check schema
  healthCheck: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
      version: { type: 'string' },
      timestamp: { type: 'string', format: 'date-time' },
      services: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            latency: { type: 'number' },
          },
        },
      },
    },
    required: ['status'],
    additionalProperties: true,
  },
};

/**
 * Helper to assert schema validation in tests
 */
export function expectValidSchema(data: unknown, schema: object, schemaName?: string): void {
  const result = validateSchema(data, schema, schemaName);

  if (!result.valid) {
    const errorMessages = result.errors.map(e => `${e.path}: ${e.message}`).join('\n');
    throw new Error(`Schema validation failed:\n${errorMessages}\n\nData: ${JSON.stringify(data, null, 2)}`);
  }
}
