import { swaggerSpec } from '../src/docs/swagger.js';
import fs from 'fs';
import path from 'path';

/**
 * OpenAPI Specification Validation Script
 * Validates that OpenAPI spec matches actual implementation
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalEndpoints: number;
    documentedEndpoints: number;
    undocumentedEndpoints: string[];
    missingSchemas: string[];
  };
}

// Known endpoints from routes/index.ts
const ACTUAL_ENDPOINTS = [
  // Platform & System
  { method: 'GET', path: '/version' },
  { method: 'GET', path: '/config/public' },

  // Dashboard
  { method: 'GET', path: '/dashboard/stats' },
  { method: 'GET', path: '/dashboard/quick-actions' },

  // Auth
  { method: 'POST', path: '/auth/register' },
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/refresh' },
  { method: 'POST', path: '/auth/logout' },
  { method: 'GET', path: '/auth/me' },
  { method: 'GET', path: '/roles' },

  // Users
  { method: 'GET', path: '/users/:id' },
  { method: 'PATCH', path: '/users/:id' },

  // Patients
  { method: 'POST', path: '/patients' },
  { method: 'GET', path: '/patients/:id' },
  { method: 'PATCH', path: '/patients/:id' },

  // Encounters
  { method: 'POST', path: '/encounters' },
  { method: 'GET', path: '/encounters' },
  { method: 'GET', path: '/encounters/:id' },
  { method: 'PATCH', path: '/encounters/:id' },
  { method: 'POST', path: '/encounters/:id/notes' },
  { method: 'GET', path: '/encounters/:id/notes' },
  { method: 'POST', path: '/encounters/:id/start' },
  { method: 'POST', path: '/encounters/:id/end' },

  // Documents
  { method: 'POST', path: '/documents' },
  { method: 'GET', path: '/documents' },
  { method: 'GET', path: '/documents/:id' },
  { method: 'GET', path: '/documents/:id/download' },
  { method: 'DELETE', path: '/documents/:id' },
  { method: 'GET', path: '/patients/:patientId/documents' },

  // Appointments
  { method: 'POST', path: '/appointments' },
  { method: 'GET', path: '/appointments' },
  { method: 'GET', path: '/appointments/:id' },
  { method: 'PATCH', path: '/appointments/:id' },
  { method: 'DELETE', path: '/appointments/:id' },

  // Visits
  { method: 'POST', path: '/visits/:id/start' },
  { method: 'POST', path: '/visits/:id/end' },
  { method: 'POST', path: '/visits/:id/chat' },

  // Plans
  { method: 'GET', path: '/plans' },

  // Subscriptions
  { method: 'POST', path: '/subscriptions' },
  { method: 'DELETE', path: '/subscriptions/:id' },

  // Billing
  { method: 'POST', path: '/billing/webhook' },

  // Payments
  { method: 'GET', path: '/payments/config' },
  { method: 'POST', path: '/payments/setup-intent' },
  { method: 'POST', path: '/payments/subscription' },
  { method: 'GET', path: '/payments/subscription' },
  { method: 'DELETE', path: '/payments/subscription' },
  { method: 'POST', path: '/payments/payment-method' },
  { method: 'POST', path: '/payments/payment-method/save' },
  { method: 'GET', path: '/payments/payment-methods' },
  { method: 'DELETE', path: '/payments/payment-method/:id' },
  { method: 'POST', path: '/payments/charge' },
  { method: 'GET', path: '/payments/history' },
  { method: 'GET', path: '/payments/:id' },
  { method: 'POST', path: '/payments/:id/refund' },
  { method: 'GET', path: '/payments/invoices' },
  { method: 'POST', path: '/payments/webhook' },

  // Notifications
  { method: 'POST', path: '/notifications/email' },
  { method: 'POST', path: '/notifications/sms' },
  { method: 'POST', path: '/notifications/email/batch' },
  { method: 'POST', path: '/notifications/sms/batch' },
  { method: 'GET', path: '/notifications/sms/:id/status' },

  // Audit
  { method: 'GET', path: '/audit/events' },

  // Consents
  { method: 'POST', path: '/consents' },
  { method: 'GET', path: '/consents/:id' },

  // Push Notifications
  { method: 'POST', path: '/push/register' },
  { method: 'DELETE', path: '/push/unregister' },
  { method: 'GET', path: '/push/devices' },
  { method: 'GET', path: '/push/notifications' },
  { method: 'PATCH', path: '/push/notifications/:id/read' },
  { method: 'POST', path: '/push/notifications/mark-all-read' },
  { method: 'GET', path: '/push/unread-count' },
  { method: 'GET', path: '/push/preferences' },
  { method: 'PUT', path: '/push/preferences' },
  { method: 'POST', path: '/push/send' },
  { method: 'POST', path: '/push/send-batch' },
];

function validateOpenAPISpec(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const undocumentedEndpoints: string[] = [];
  const missingSchemas: string[] = [];

  console.log('🔍 Validating OpenAPI Specification...\n');

  // Check if spec exists
  if (!swaggerSpec) {
    errors.push('OpenAPI specification not found');
    return {
      valid: false,
      errors,
      warnings,
      summary: {
        totalEndpoints: ACTUAL_ENDPOINTS.length,
        documentedEndpoints: 0,
        undocumentedEndpoints: ACTUAL_ENDPOINTS.map(e => `${e.method} ${e.path}`),
        missingSchemas: [],
      },
    };
  }

  // Validate basic structure
  if (!swaggerSpec.openapi) {
    errors.push('Missing OpenAPI version');
  }

  if (!swaggerSpec.info) {
    errors.push('Missing API info section');
  } else {
    if (!swaggerSpec.info.title) warnings.push('Missing API title');
    if (!swaggerSpec.info.version) warnings.push('Missing API version');
    if (!swaggerSpec.info.description) warnings.push('Missing API description');
  }

  if (!swaggerSpec.servers || swaggerSpec.servers.length === 0) {
    warnings.push('No servers defined');
  }

  // Validate security schemes
  if (!swaggerSpec.components?.securitySchemes) {
    errors.push('Missing security schemes definition');
  } else {
    if (!swaggerSpec.components.securitySchemes.bearerAuth) {
      errors.push('Missing bearerAuth security scheme');
    }
  }

  // Validate schemas
  const requiredSchemas = [
    'User',
    'Patient',
    'Appointment',
    'Encounter',
    'Document',
    'Error',
    'ValidationError',
    'RegisterRequest',
    'LoginRequest',
    'AuthResponse',
  ];

  requiredSchemas.forEach(schema => {
    if (!swaggerSpec.components?.schemas?.[schema]) {
      missingSchemas.push(schema);
      warnings.push(`Missing schema definition: ${schema}`);
    }
  });

  // Validate endpoints (would need actual path parsing from swagger spec)
  const documentedEndpoints = new Set<string>();

  // Note: In a real implementation, you would parse swaggerSpec.paths
  // For now, we'll check if the paths object exists
  if (!swaggerSpec.paths) {
    errors.push('No paths defined in OpenAPI spec');
  } else {
    // Count documented endpoints
    Object.keys(swaggerSpec.paths || {}).forEach(path => {
      const methods = Object.keys(swaggerSpec.paths[path]);
      methods.forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
          documentedEndpoints.add(`${method.toUpperCase()} ${path}`);
        }
      });
    });
  }

  // Check for undocumented endpoints
  ACTUAL_ENDPOINTS.forEach(endpoint => {
    const endpointKey = `${endpoint.method} /api/v1${endpoint.path}`;
    const normalizedPath = endpoint.path.replace(/:([^/]+)/g, '{$1}');
    const alternateKey = `${endpoint.method} /api/v1${normalizedPath}`;

    if (!documentedEndpoints.has(endpointKey) && !documentedEndpoints.has(alternateKey)) {
      undocumentedEndpoints.push(endpointKey);
    }
  });

  // Validate response schemas
  if (swaggerSpec.paths) {
    Object.entries(swaggerSpec.paths).forEach(([path, pathItem]: [string, any]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          // Check for response definitions
          if (!operation.responses) {
            warnings.push(`${method.toUpperCase()} ${path}: Missing responses`);
          } else {
            if (!operation.responses['200'] && !operation.responses['201']) {
              warnings.push(`${method.toUpperCase()} ${path}: Missing success response`);
            }
            if (!operation.responses['400']) {
              warnings.push(`${method.toUpperCase()} ${path}: Missing 400 error response`);
            }
            if (!operation.responses['401']) {
              warnings.push(`${method.toUpperCase()} ${path}: Missing 401 error response`);
            }
          }

          // Check for request body validation
          if (['post', 'put', 'patch'].includes(method)) {
            if (!operation.requestBody) {
              warnings.push(`${method.toUpperCase()} ${path}: Missing request body definition`);
            }
          }
        }
      });
    });
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    summary: {
      totalEndpoints: ACTUAL_ENDPOINTS.length,
      documentedEndpoints: documentedEndpoints.size,
      undocumentedEndpoints,
      missingSchemas,
    },
  };
}

// Run validation
function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   OpenAPI Specification Validation Report');
  console.log('═══════════════════════════════════════════════════\n');

  const result = validateOpenAPISpec();

  // Print results
  console.log('📊 Summary:');
  console.log(`   Total Endpoints: ${result.summary.totalEndpoints}`);
  console.log(`   Documented Endpoints: ${result.summary.documentedEndpoints}`);
  console.log(`   Coverage: ${((result.summary.documentedEndpoints / result.summary.totalEndpoints) * 100).toFixed(1)}%\n`);

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log(`   - ${error}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log(`⚠️  Warnings (${result.warnings.length}):`);
    result.warnings.slice(0, 10).forEach(warning => console.log(`   - ${warning}`));
    if (result.warnings.length > 10) {
      console.log(`   ... and ${result.warnings.length - 10} more`);
    }
    console.log('');
  }

  if (result.summary.undocumentedEndpoints.length > 0) {
    console.log('📝 Undocumented Endpoints:');
    result.summary.undocumentedEndpoints.forEach(endpoint => {
      console.log(`   - ${endpoint}`);
    });
    console.log('');
  }

  if (result.summary.missingSchemas.length > 0) {
    console.log('📋 Missing Schemas:');
    result.summary.missingSchemas.forEach(schema => {
      console.log(`   - ${schema}`);
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════');
  console.log(`Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}`);
  console.log('═══════════════════════════════════════════════════\n');

  // Save report to file
  const reportPath = path.join(__dirname, 'openapi-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}\n`);

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1);
}

if (require.main === module) {
  main();
}

export { validateOpenAPISpec, ValidationResult };
