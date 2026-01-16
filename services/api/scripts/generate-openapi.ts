#!/usr/bin/env tsx
/**
 * OpenAPI Specification Generator
 *
 * This script generates the OpenAPI specification from the registered
 * schemas and writes it to docs/api/openapi.yaml
 *
 * Usage: npm run docs:generate
 */

import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { registry, generateOpenAPIDocument, z } from '../src/lib/openapi.js';

// ==========================================
// Register API Paths
// ==========================================

// Helper to create bearer auth security requirement
const bearerAuth = [{ bearerAuth: [] }];

// ==========================================
// System Endpoints
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/version',
  tags: ['System'],
  summary: 'Get API version',
  security: [],
  responses: {
    200: {
      description: 'API version information',
      content: {
        'application/json': {
          schema: z.object({
            version: z.string().openapi({ example: '1.0.0' }),
            environment: z.string().openapi({ example: 'development' }),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/config/public',
  tags: ['System'],
  summary: 'Get public configuration',
  security: [],
  responses: {
    200: {
      description: 'Public configuration settings',
      content: {
        'application/json': {
          schema: z.object({
            stripePublishableKey: z.string().optional(),
            features: z.record(z.boolean()),
          }),
        },
      },
    },
  },
});

// ==========================================
// Dashboard Endpoints
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/dashboard/stats',
  tags: ['Dashboard'],
  summary: 'Get dashboard statistics',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Dashboard statistics',
      content: {
        'application/json': {
          schema: z.object({
            patients: z.number().openapi({ example: 150 }),
            appointments: z.number().openapi({ example: 25 }),
            encounters: z.number().openapi({ example: 200 }),
            documents: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/dashboard/quick-actions',
  tags: ['Dashboard'],
  summary: 'Get quick actions for dashboard',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Available quick actions',
      content: {
        'application/json': {
          schema: z.object({
            actions: z.array(z.object({
              id: z.string(),
              label: z.string(),
              icon: z.string(),
              href: z.string(),
            })),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

// ==========================================
// Authentication Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Authentication'],
  summary: 'Register a new user',
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(12),
            firstName: z.string(),
            lastName: z.string(),
            phone: z.string().optional(),
            dateOfBirth: z.string().optional(),
            role: z.enum(['patient', 'provider', 'admin']).optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              firstName: z.string(),
              lastName: z.string(),
              role: z.string(),
            }),
          }),
        },
      },
    },
    400: { description: 'Validation error' },
    409: { description: 'Email already exists' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Authentication'],
  summary: 'Login with email and password',
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expiresIn: z.number(),
            tokenType: z.literal('Bearer'),
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              firstName: z.string(),
              lastName: z.string(),
              role: z.string(),
            }),
          }),
        },
      },
    },
    401: { description: 'Invalid credentials' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Authentication'],
  summary: 'Refresh access token',
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            refreshToken: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Token refreshed successfully',
      content: {
        'application/json': {
          schema: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expiresIn: z.number(),
          }),
        },
      },
    },
    401: { description: 'Invalid refresh token' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Authentication'],
  summary: 'Logout current user',
  security: bearerAuth,
  responses: {
    200: { description: 'Logged out successfully' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Authentication'],
  summary: 'Get current user profile',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Current user profile',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.string(),
            createdAt: z.string().datetime(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

// ==========================================
// User Endpoints
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.string(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    404: { description: 'User not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Update user',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            phone: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'User updated successfully' },
    401: { description: 'Unauthorized' },
    404: { description: 'User not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/me/export',
  tags: ['Users'],
  summary: 'Export user data (GDPR Article 20)',
  security: bearerAuth,
  responses: {
    200: {
      description: 'User data export',
      content: {
        'application/json': {
          schema: z.object({
            user: z.object({}),
            patients: z.array(z.object({})),
            appointments: z.array(z.object({})),
            documents: z.array(z.object({})),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/me',
  tags: ['Users'],
  summary: 'Delete user account (GDPR Article 17)',
  security: bearerAuth,
  responses: {
    200: { description: 'Account deleted successfully' },
    401: { description: 'Unauthorized' },
  },
});

// ==========================================
// Patient Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/patients',
  tags: ['Patients'],
  summary: 'Create a new patient',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            firstName: z.string(),
            lastName: z.string(),
            dateOfBirth: z.string(),
            gender: z.enum(['male', 'female', 'other']),
            email: z.string().email(),
            phone: z.string(),
            address: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Patient created successfully' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/patients/{id}',
  tags: ['Patients'],
  summary: 'Get patient by ID',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Patient details' },
    401: { description: 'Unauthorized' },
    404: { description: 'Patient not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/patients/{id}',
  tags: ['Patients'],
  summary: 'Update patient',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            phone: z.string().optional(),
            address: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Patient updated successfully' },
    401: { description: 'Unauthorized' },
    404: { description: 'Patient not found' },
  },
});

// ==========================================
// Encounter Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/encounters',
  tags: ['Encounters'],
  summary: 'Create a new encounter',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            patientId: z.string().uuid(),
            appointmentId: z.string().uuid().optional(),
            type: z.string(),
            chiefComplaint: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Encounter created successfully' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden - requires provider or admin role' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/encounters',
  tags: ['Encounters'],
  summary: 'List encounters',
  security: bearerAuth,
  request: {
    query: z.object({
      patientId: z.string().uuid().optional(),
      status: z.enum(['planned', 'in-progress', 'finished', 'cancelled']).optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'List of encounters' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/encounters/{id}',
  tags: ['Encounters'],
  summary: 'Get encounter by ID',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Encounter details' },
    401: { description: 'Unauthorized' },
    404: { description: 'Encounter not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/encounters/{id}',
  tags: ['Encounters'],
  summary: 'Update encounter',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Encounter updated successfully' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
    404: { description: 'Encounter not found' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/encounters/{id}/notes',
  tags: ['Encounters'],
  summary: 'Add clinical note to encounter',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            content: z.string(),
            type: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Clinical note added' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/encounters/{id}/notes',
  tags: ['Encounters'],
  summary: 'Get clinical notes for encounter',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'List of clinical notes' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/encounters/{id}/start',
  tags: ['Encounters'],
  summary: 'Start an encounter',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Encounter started' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/encounters/{id}/end',
  tags: ['Encounters'],
  summary: 'End an encounter',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Encounter ended' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

// ==========================================
// Document Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/documents',
  tags: ['Documents'],
  summary: 'Upload a document',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.any(),
            patientId: z.string().uuid(),
            category: z.enum(['lab-result', 'imaging', 'prescription', 'insurance', 'consent', 'other']),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Document uploaded successfully' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/documents',
  tags: ['Documents'],
  summary: 'List documents',
  security: bearerAuth,
  request: {
    query: z.object({
      patientId: z.string().uuid().optional(),
      category: z.string().optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'List of documents' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/documents/{id}',
  tags: ['Documents'],
  summary: 'Get document metadata',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Document metadata' },
    401: { description: 'Unauthorized' },
    404: { description: 'Document not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/documents/{id}/download',
  tags: ['Documents'],
  summary: 'Get document download URL',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Presigned download URL',
      content: {
        'application/json': {
          schema: z.object({
            url: z.string().url(),
            expiresAt: z.string().datetime(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    404: { description: 'Document not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/documents/{id}',
  tags: ['Documents'],
  summary: 'Delete a document',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Document deleted' },
    401: { description: 'Unauthorized' },
    404: { description: 'Document not found' },
  },
});

// ==========================================
// Appointment Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/appointments',
  tags: ['Appointments'],
  summary: 'Create an appointment',
  description: 'Requires active subscription',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            patientId: z.string().uuid(),
            providerId: z.string().uuid(),
            scheduledAt: z.string().datetime(),
            duration: z.number().int(),
            type: z.enum(['in-person', 'telehealth']),
            reason: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Appointment created' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    402: { description: 'Payment required - subscription needed' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/appointments',
  tags: ['Appointments'],
  summary: 'List appointments',
  security: bearerAuth,
  request: {
    query: z.object({
      patientId: z.string().uuid().optional(),
      providerId: z.string().uuid().optional(),
      status: z.string().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'List of appointments' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/appointments/{id}',
  tags: ['Appointments'],
  summary: 'Get appointment by ID',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Appointment details' },
    401: { description: 'Unauthorized' },
    404: { description: 'Appointment not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/appointments/{id}',
  tags: ['Appointments'],
  summary: 'Update appointment',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Appointment updated' },
    401: { description: 'Unauthorized' },
    402: { description: 'Payment required' },
    404: { description: 'Appointment not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/appointments/{id}',
  tags: ['Appointments'],
  summary: 'Cancel appointment',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Appointment cancelled' },
    401: { description: 'Unauthorized' },
    404: { description: 'Appointment not found' },
  },
});

// ==========================================
// Plans Endpoints
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/plans',
  tags: ['Plans'],
  summary: 'List available subscription plans',
  security: [],
  responses: {
    200: {
      description: 'List of plans',
      content: {
        'application/json': {
          schema: z.object({
            plans: z.array(z.object({
              id: z.string().uuid(),
              name: z.string(),
              price: z.number(),
              interval: z.enum(['month', 'year']),
              features: z.array(z.string()),
            })),
          }),
        },
      },
    },
  },
});

// ==========================================
// Subscription Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/subscriptions',
  tags: ['Subscriptions'],
  summary: 'Create a subscription',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            planId: z.string().uuid(),
            paymentMethodId: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Subscription created' },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/subscriptions/{id}',
  tags: ['Subscriptions'],
  summary: 'Cancel subscription',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Subscription cancelled' },
    401: { description: 'Unauthorized' },
    404: { description: 'Subscription not found' },
  },
});

// ==========================================
// Payment Endpoints
// ==========================================

registry.registerPath({
  method: 'get',
  path: '/payments/config',
  tags: ['Payments'],
  summary: 'Get payment configuration',
  security: [],
  responses: {
    200: {
      description: 'Payment configuration',
      content: {
        'application/json': {
          schema: z.object({
            publishableKey: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/payments/setup-intent',
  tags: ['Payments'],
  summary: 'Create a Stripe SetupIntent',
  security: bearerAuth,
  responses: {
    200: {
      description: 'SetupIntent created',
      content: {
        'application/json': {
          schema: z.object({
            clientSecret: z.string(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/payments/payment-methods',
  tags: ['Payments'],
  summary: 'List saved payment methods',
  security: bearerAuth,
  responses: {
    200: { description: 'List of payment methods' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/payments/history',
  tags: ['Payments'],
  summary: 'Get payment history',
  security: bearerAuth,
  responses: {
    200: { description: 'Payment history' },
    401: { description: 'Unauthorized' },
  },
});

// ==========================================
// Premium Feature Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/telehealth/video-session',
  tags: ['Premium'],
  summary: 'Create a telehealth video session',
  description: 'Requires active subscription',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            patientId: z.string().uuid(),
            providerId: z.string().uuid(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Video session created',
      content: {
        'application/json': {
          schema: z.object({
            sessionId: z.string(),
            roomUrl: z.string().url(),
            expiresAt: z.string().datetime(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    402: { description: 'Payment required - subscription needed' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/ai/analyze-symptoms',
  tags: ['Premium'],
  summary: 'AI-powered symptom analysis',
  description: 'Requires premium tier subscription',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            symptoms: z.array(z.string()),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Symptom analysis results',
      content: {
        'application/json': {
          schema: z.object({
            analysisId: z.string(),
            possibleConditions: z.array(z.object({
              name: z.string(),
              probability: z.number(),
            })),
            recommendation: z.string(),
            disclaimer: z.string(),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    402: { description: 'Payment required - premium subscription needed' },
  },
});

// ==========================================
// Discharge Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/discharges/{encounterId}/initiate',
  tags: ['Discharges'],
  summary: 'Initiate discharge workflow',
  security: bearerAuth,
  request: {
    params: z.object({
      encounterId: z.string().uuid(),
    }),
  },
  responses: {
    201: { description: 'Discharge workflow initiated' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/discharges/{id}',
  tags: ['Discharges'],
  summary: 'Get discharge workflow details',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Discharge workflow details' },
    401: { description: 'Unauthorized' },
    404: { description: 'Discharge not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/discharges/{patientId}/risk-score',
  tags: ['Discharges'],
  summary: 'Get LACE+ readmission risk score',
  security: bearerAuth,
  request: {
    params: z.object({
      patientId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Risk score',
      content: {
        'application/json': {
          schema: z.object({
            score: z.number(),
            riskLevel: z.enum(['low', 'medium', 'high']),
            factors: z.array(z.object({
              name: z.string(),
              value: z.number(),
              contribution: z.number(),
            })),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

// ==========================================
// Surgical Scheduling Endpoints
// ==========================================

registry.registerPath({
  method: 'post',
  path: '/surgical/blocks',
  tags: ['Surgical'],
  summary: 'Create OR block schedule',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            operatingRoomId: z.string().uuid(),
            surgeonId: z.string().uuid(),
            date: z.string().datetime(),
            startTime: z.string(),
            endTime: z.string(),
            blockType: z.enum(['dedicated', 'shared', 'open', 'emergency_reserve']),
            specialty: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'OR block created' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/surgical/blocks',
  tags: ['Surgical'],
  summary: 'List OR blocks',
  security: bearerAuth,
  request: {
    query: z.object({
      operatingRoomId: z.string().uuid().optional(),
      surgeonId: z.string().uuid().optional(),
      date: z.string().optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'List of OR blocks' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/surgical/cases',
  tags: ['Surgical'],
  summary: 'Schedule a surgical case',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            patientId: z.string().uuid(),
            primarySurgeonId: z.string().uuid(),
            procedureCode: z.string(),
            procedureName: z.string(),
            scheduledDate: z.string().datetime(),
            estimatedDuration: z.number().int(),
            priority: z.enum(['elective', 'urgent', 'emergent']),
            anesthesiaType: z.enum(['general', 'regional', 'local', 'sedation', 'none']),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Surgical case scheduled' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/surgical/utilization',
  tags: ['Surgical'],
  summary: 'Get utilization analytics',
  security: bearerAuth,
  request: {
    query: z.object({
      from: z.string().datetime(),
      to: z.string().datetime(),
      groupBy: z.enum(['room', 'surgeon', 'specialty', 'day', 'week', 'month']).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Utilization analytics',
      content: {
        'application/json': {
          schema: z.object({
            period: z.object({
              from: z.string().datetime(),
              to: z.string().datetime(),
            }),
            summary: z.object({
              totalCases: z.number(),
              averageUtilization: z.number(),
              totalMinutes: z.number(),
            }),
            breakdown: z.array(z.object({})),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/surgical/emergency-insert',
  tags: ['Surgical'],
  summary: 'Insert emergency case into schedule',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            patientId: z.string().uuid(),
            primarySurgeonId: z.string().uuid(),
            procedureCode: z.string(),
            procedureName: z.string(),
            estimatedDuration: z.number().int(),
            priority: z.enum(['urgent', 'emergent']),
            anesthesiaType: z.string(),
            preOpDiagnosis: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Emergency case inserted',
      content: {
        'application/json': {
          schema: z.object({
            caseId: z.string().uuid(),
            insertionSuccessful: z.boolean(),
            assignedRoom: z.object({}).optional(),
            estimatedStartTime: z.string().datetime().optional(),
            displacedCases: z.array(z.object({})),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});

// ==========================================
// Generate OpenAPI Document
// ==========================================

console.log('Generating OpenAPI specification...');

// Add security scheme to the generated document
const document = generateOpenAPIDocument();

// Add security schemes
(document as any).components = (document as any).components || {};
(document as any).components.securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your JWT token in the format: Bearer {token}',
  },
};

// Convert to YAML
const yamlDoc = YAML.stringify(document, {
  indent: 2,
  lineWidth: 0,
});

// Write to file
const outputDir = path.resolve(__dirname, '../../../docs/api');
const outputPath = path.join(outputDir, 'openapi.yaml');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, yamlDoc, 'utf-8');
console.log(`OpenAPI specification written to: ${outputPath}`);

// Also write JSON version
const jsonPath = path.join(outputDir, 'openapi.json');
fs.writeFileSync(jsonPath, JSON.stringify(document, null, 2), 'utf-8');
console.log(`OpenAPI JSON specification written to: ${jsonPath}`);

console.log('\nGeneration complete!');
console.log(`Total paths registered: ${Object.keys((document as any).paths || {}).length}`);
console.log(`Total schemas registered: ${Object.keys((document as any).components?.schemas || {}).length}`);
