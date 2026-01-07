// @ts-nocheck
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from '../config/index.js';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Unified Health Platform API',
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
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api-staging.theunifiedhealth.com/api/v1',
        description: 'Staging server',
      },
      {
        url: 'https://api.theunifiedhealth.com/api/v1',
        description: 'Production server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Patients', description: 'Patient information management' },
      { name: 'Appointments', description: 'Appointment scheduling and management' },
      { name: 'Encounters', description: 'Clinical encounters and notes' },
      { name: 'Documents', description: 'Document storage and retrieval' },
      { name: 'Visits', description: 'Telehealth visits' },
      { name: 'Plans', description: 'Subscription plans' },
      { name: 'Subscriptions', description: 'Organization subscriptions' },
      { name: 'Billing', description: 'Billing webhooks and management' },
      { name: 'Audit', description: 'Audit logs and compliance' },
      { name: 'Consent', description: 'Patient consent management' },
      { name: 'System', description: 'System health and configuration' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}',
        },
      },
      schemas: {
        // Common schemas
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
            path: {
              type: 'string',
              description: 'Request path',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation Error',
            },
            message: {
              type: 'string',
              example: 'Invalid request data',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        PaginationParams: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              default: 1,
              description: 'Page number',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 20,
              description: 'Items per page',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {},
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        // Auth schemas
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 12,
              description: 'Password (minimum 12 characters)',
            },
            firstName: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'First name',
            },
            lastName: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Last name',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
            },
            role: {
              type: 'string',
              enum: ['patient', 'provider', 'admin'],
              default: 'patient',
              description: 'User role',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
            expiresIn: {
              type: 'integer',
              description: 'Token expiration time in seconds',
            },
            tokenType: {
              type: 'string',
              example: 'Bearer',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            role: {
              type: 'string',
              enum: ['patient', 'provider', 'admin'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Patient ID',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'Associated user ID',
            },
            mrn: {
              type: 'string',
              description: 'Medical Record Number',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            address: {
              type: 'string',
              description: 'Physical address',
            },
            emergencyContact: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                relationship: { type: 'string' },
                phone: { type: 'string' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            patientId: {
              type: 'string',
              format: 'uuid',
            },
            providerId: {
              type: 'string',
              format: 'uuid',
            },
            scheduledAt: {
              type: 'string',
              format: 'date-time',
            },
            duration: {
              type: 'integer',
              description: 'Duration in minutes',
            },
            type: {
              type: 'string',
              enum: ['in-person', 'telehealth'],
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'],
            },
            reason: {
              type: 'string',
            },
            notes: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Encounter: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            patientId: {
              type: 'string',
              format: 'uuid',
            },
            providerId: {
              type: 'string',
              format: 'uuid',
            },
            appointmentId: {
              type: 'string',
              format: 'uuid',
            },
            status: {
              type: 'string',
              enum: ['planned', 'in-progress', 'finished', 'cancelled'],
            },
            type: {
              type: 'string',
            },
            chiefComplaint: {
              type: 'string',
            },
            diagnosis: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
            vitals: {
              type: 'object',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
            },
            endedAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Document: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            patientId: {
              type: 'string',
              format: 'uuid',
            },
            uploadedBy: {
              type: 'string',
              format: 'uuid',
            },
            filename: {
              type: 'string',
            },
            mimeType: {
              type: 'string',
            },
            size: {
              type: 'integer',
              description: 'File size in bytes',
            },
            category: {
              type: 'string',
              enum: ['lab-result', 'imaging', 'prescription', 'insurance', 'consent', 'other'],
            },
            encrypted: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/docs/paths/*.yaml',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
  // Serve Swagger UI
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'The Unified Health API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
      },
    })
  );

  // Serve OpenAPI spec as JSON
  app.get('/api/docs/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve OpenAPI spec as YAML
  app.get('/api/docs/openapi.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    const yaml = convertToYAML(swaggerSpec);
    res.send(yaml);
  });
}

// Simple JSON to YAML converter
function convertToYAML(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach((item) => {
        if (typeof item === 'object') {
          yaml += `${spaces}- \n${convertToYAML(item, indent + 1)}`;
        } else {
          yaml += `${spaces}- ${item}\n`;
        }
      });
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n${convertToYAML(value, indent + 1)}`;
    } else if (typeof value === 'string') {
      yaml += `${spaces}${key}: "${value}"\n`;
    } else {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }

  return yaml;
}

export { swaggerSpec };
