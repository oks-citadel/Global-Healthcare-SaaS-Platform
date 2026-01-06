/**
 * OpenAPI Registry and Schema Configuration
 *
 * This module sets up the OpenAPI registry using @asteasolutions/zod-to-openapi
 * to generate type-safe API documentation from Zod schemas.
 */

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Create the OpenAPI registry
export const registry = new OpenAPIRegistry();

// ==========================================
// Common Schemas
// ==========================================

// UUID Schema
export const UUIDSchema = z.string().uuid().openapi({
  description: 'UUID identifier',
  example: '550e8400-e29b-41d4-a716-446655440000',
});

// Pagination Query Parameters
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    description: 'Page number',
    example: 1,
  }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({
    description: 'Items per page',
    example: 20,
  }),
});

// Pagination Response Schema
export const PaginationMetaSchema = z.object({
  page: z.number().int().openapi({ example: 1 }),
  limit: z.number().int().openapi({ example: 20 }),
  total: z.number().int().openapi({ example: 100 }),
  totalPages: z.number().int().openapi({ example: 5 }),
});

// Error Response Schema
export const ErrorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Error' }),
  message: z.string().openapi({ example: 'An error occurred' }),
  timestamp: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
  path: z.string().optional().openapi({ example: '/api/v1/resource' }),
});

// Validation Error Schema
export const ValidationErrorSchema = z.object({
  error: z.literal('Validation Error'),
  message: z.string().openapi({ example: 'Invalid request data' }),
  errors: z.array(
    z.object({
      field: z.string().openapi({ example: 'email' }),
      message: z.string().openapi({ example: 'Invalid email format' }),
    })
  ),
});

// Register common schemas
registry.register('UUID', UUIDSchema);
registry.register('PaginationQuery', PaginationQuerySchema);
registry.register('PaginationMeta', PaginationMetaSchema);
registry.register('Error', ErrorResponseSchema);
registry.register('ValidationError', ValidationErrorSchema);

// ==========================================
// Authentication Schemas
// ==========================================

export const RegisterRequestSchema = z.object({
  email: z.string().email().openapi({
    description: 'User email address',
    example: 'user@example.com',
  }),
  password: z.string().min(12).openapi({
    description: 'Password (minimum 12 characters)',
    example: 'SecurePassword123!',
  }),
  firstName: z.string().min(1).max(100).openapi({
    description: 'First name',
    example: 'John',
  }),
  lastName: z.string().min(1).max(100).openapi({
    description: 'Last name',
    example: 'Doe',
  }),
  phone: z.string().optional().openapi({
    description: 'Phone number',
    example: '+1-555-555-5555',
  }),
  dateOfBirth: z.string().optional().openapi({
    description: 'Date of birth (ISO format)',
    example: '1990-01-15',
  }),
  role: z.enum(['patient', 'provider', 'admin']).default('patient').openapi({
    description: 'User role',
    example: 'patient',
  }),
});

export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({
    description: 'User email address',
    example: 'user@example.com',
  }),
  password: z.string().openapi({
    description: 'User password',
    example: 'SecurePassword123!',
  }),
});

export const UserSchema = z.object({
  id: UUIDSchema.openapi({ description: 'User ID' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
  firstName: z.string().openapi({ example: 'John' }),
  lastName: z.string().openapi({ example: 'Doe' }),
  role: z.enum(['patient', 'provider', 'admin']).openapi({ example: 'patient' }),
  createdAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string().openapi({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
  refreshToken: z.string().openapi({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
  expiresIn: z.number().int().openapi({
    description: 'Token expiration time in seconds',
    example: 3600,
  }),
  tokenType: z.literal('Bearer').openapi({ example: 'Bearer' }),
  user: UserSchema,
});

registry.register('RegisterRequest', RegisterRequestSchema);
registry.register('LoginRequest', LoginRequestSchema);
registry.register('User', UserSchema);
registry.register('AuthResponse', AuthResponseSchema);

// ==========================================
// Patient Schemas
// ==========================================

export const PatientSchema = z.object({
  id: UUIDSchema.openapi({ description: 'Patient ID' }),
  userId: UUIDSchema.openapi({ description: 'Associated user ID' }),
  mrn: z.string().openapi({
    description: 'Medical Record Number',
    example: 'MRN-2024-001234',
  }),
  firstName: z.string().openapi({ example: 'John' }),
  lastName: z.string().openapi({ example: 'Doe' }),
  dateOfBirth: z.string().openapi({ example: '1990-01-15' }),
  gender: z.enum(['male', 'female', 'other']).openapi({ example: 'male' }),
  email: z.string().email().openapi({ example: 'patient@example.com' }),
  phone: z.string().openapi({ example: '+1-555-555-5555' }),
  address: z.string().optional().openapi({ example: '123 Main St, City, ST 12345' }),
  emergencyContact: z.object({
    name: z.string().openapi({ example: 'Jane Doe' }),
    relationship: z.string().openapi({ example: 'Spouse' }),
    phone: z.string().openapi({ example: '+1-555-555-5556' }),
  }).optional(),
  createdAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
});

registry.register('Patient', PatientSchema);

// ==========================================
// Appointment Schemas
// ==========================================

export const AppointmentSchema = z.object({
  id: UUIDSchema.openapi({ description: 'Appointment ID' }),
  patientId: UUIDSchema.openapi({ description: 'Patient ID' }),
  providerId: UUIDSchema.openapi({ description: 'Provider ID' }),
  scheduledAt: z.string().datetime().openapi({ example: '2024-01-20T10:00:00.000Z' }),
  duration: z.number().int().openapi({
    description: 'Duration in minutes',
    example: 30,
  }),
  type: z.enum(['in-person', 'telehealth']).openapi({ example: 'telehealth' }),
  status: z.enum([
    'scheduled',
    'confirmed',
    'checked-in',
    'in-progress',
    'completed',
    'cancelled',
    'no-show',
  ]).openapi({ example: 'scheduled' }),
  reason: z.string().optional().openapi({ example: 'Annual checkup' }),
  notes: z.string().optional().openapi({ example: 'Patient requested early morning slot' }),
  createdAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
});

registry.register('Appointment', AppointmentSchema);

// ==========================================
// Encounter Schemas
// ==========================================

export const EncounterSchema = z.object({
  id: UUIDSchema.openapi({ description: 'Encounter ID' }),
  patientId: UUIDSchema.openapi({ description: 'Patient ID' }),
  providerId: UUIDSchema.openapi({ description: 'Provider ID' }),
  appointmentId: UUIDSchema.optional().openapi({ description: 'Associated appointment ID' }),
  status: z.enum(['planned', 'in-progress', 'finished', 'cancelled']).openapi({
    example: 'in-progress',
  }),
  type: z.string().openapi({ example: 'consultation' }),
  chiefComplaint: z.string().optional().openapi({ example: 'Persistent headache' }),
  diagnosis: z.array(
    z.object({
      code: z.string().openapi({ example: 'G43.909' }),
      description: z.string().openapi({ example: 'Migraine, unspecified' }),
    })
  ).optional(),
  vitals: z.object({
    bloodPressureSystolic: z.number().optional().openapi({ example: 120 }),
    bloodPressureDiastolic: z.number().optional().openapi({ example: 80 }),
    heartRate: z.number().optional().openapi({ example: 72 }),
    temperature: z.number().optional().openapi({ example: 98.6 }),
    weight: z.number().optional().openapi({ example: 165 }),
  }).optional(),
  startedAt: z.string().datetime().optional().openapi({ example: '2024-01-20T10:00:00.000Z' }),
  endedAt: z.string().datetime().optional().openapi({ example: '2024-01-20T10:30:00.000Z' }),
  createdAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
});

registry.register('Encounter', EncounterSchema);

// ==========================================
// Document Schemas
// ==========================================

export const DocumentSchema = z.object({
  id: UUIDSchema.openapi({ description: 'Document ID' }),
  patientId: UUIDSchema.openapi({ description: 'Patient ID' }),
  uploadedBy: UUIDSchema.openapi({ description: 'Uploader user ID' }),
  filename: z.string().openapi({ example: 'lab-results-2024.pdf' }),
  mimeType: z.string().openapi({ example: 'application/pdf' }),
  size: z.number().int().openapi({
    description: 'File size in bytes',
    example: 102400,
  }),
  category: z.enum([
    'lab-result',
    'imaging',
    'prescription',
    'insurance',
    'consent',
    'other',
  ]).openapi({ example: 'lab-result' }),
  encrypted: z.boolean().openapi({ example: true }),
  createdAt: z.string().datetime().openapi({ example: '2024-01-15T12:00:00.000Z' }),
});

registry.register('Document', DocumentSchema);

// ==========================================
// Subscription/Plan Schemas
// ==========================================

export const PlanSchema = z.object({
  id: UUIDSchema.openapi({ description: 'Plan ID' }),
  name: z.string().openapi({ example: 'Professional' }),
  description: z.string().openapi({ example: 'Full-featured plan for healthcare providers' }),
  price: z.number().openapi({ example: 99.99 }),
  interval: z.enum(['month', 'year']).openapi({ example: 'month' }),
  features: z.array(z.string()).openapi({
    example: ['Unlimited patients', 'Telehealth', 'AI features'],
  }),
  tier: z.enum(['free', 'basic', 'professional', 'enterprise']).openapi({
    example: 'professional',
  }),
});

registry.register('Plan', PlanSchema);

// ==========================================
// Generate OpenAPI Document
// ==========================================

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Unified Health Platform API',
      version: '1.0.0',
      description: `
Comprehensive healthcare API for managing patients, appointments, encounters, documents, and more.

## Features
- Multi-tenant architecture
- HIPAA-compliant data handling
- Role-based access control (RBAC)
- Real-time notifications
- Document management with encryption
- Telehealth capabilities
- Billing and subscription management

## Authentication
All endpoints (except health checks and public config) require JWT authentication.
Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`
      `,
      contact: {
        name: 'API Support',
        email: 'api-support@theunifiedhealth.com',
        url: 'https://docs.theunifiedhealth.com',
      },
      license: {
        name: 'Proprietary',
        url: 'https://theunifiedhealth.com/license',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api-staging.unifiedhealth.com/api/v1',
        description: 'Staging server',
      },
      {
        url: 'https://api.unifiedhealth.com/api/v1',
        description: 'Production server',
      },
    ],
    tags: [
      { name: 'System', description: 'System health and configuration' },
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Patients', description: 'Patient information management' },
      { name: 'Appointments', description: 'Appointment scheduling and management' },
      { name: 'Encounters', description: 'Clinical encounters and notes' },
      { name: 'Documents', description: 'Document storage and retrieval' },
      { name: 'Visits', description: 'Telehealth visits' },
      { name: 'Plans', description: 'Subscription plans' },
      { name: 'Subscriptions', description: 'Organization subscriptions' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Billing', description: 'Billing webhooks and management' },
      { name: 'Notifications', description: 'Email, SMS, and push notifications' },
      { name: 'Audit', description: 'Audit logs and compliance' },
      { name: 'Consent', description: 'Patient consent management' },
      { name: 'Dashboard', description: 'Dashboard statistics and quick actions' },
      { name: 'Premium', description: 'Premium subscription features' },
      { name: 'Discharges', description: 'Post-discharge follow-up management' },
      { name: 'Surgical', description: 'Surgical scheduling and OR management' },
    ],
    security: [{ bearerAuth: [] }],
  });
}

export { z };
