# API Documentation

## Overview

The Unified Health API is a RESTful API that provides access to all platform functionality including patient management, appointments, clinical documentation, billing, and telemedicine services.

**Base URLs:**
- Local Development: `http://localhost:8080/api/v1`
- Development: `https://api-dev.unifiedhealthcare.com/api/v1`
- Staging: `https://api-staging.unifiedhealthcare.com/api/v1`
- Production: `https://api.unifiedhealthcare.com/api/v1`

**Current Version:** 1.0.0

## Quick Start

### 1. Authentication

Obtain an access token by authenticating:

```bash
curl -X POST https://api.unifiedhealthcare.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_123456",
      "email": "user@example.com",
      "role": "patient"
    }
  }
}
```

### 2. Make Authenticated Requests

Include the access token in the Authorization header:

```bash
curl -X GET https://api.unifiedhealthcare.com/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## API Features

### Core Services

| Service | Description | Endpoints |
|---------|-------------|-----------|
| **Authentication** | User authentication and authorization | `/auth/*` |
| **User Management** | User profiles and settings | `/users/*` |
| **Patient Records** | Patient health records (PHR/EHR) | `/patients/*` |
| **Appointments** | Scheduling and booking | `/appointments/*` |
| **Encounters** | Clinical encounters and documentation | `/encounters/*` |
| **Telemedicine** | Virtual visits and video consultations | `/visits/*` |
| **Prescriptions** | E-prescribing and medication management | `/prescriptions/*` |
| **Laboratory** | Lab orders and results | `/lab/*` |
| **Imaging** | Medical imaging and DICOM | `/imaging/*` |
| **Billing** | Payments and invoicing | `/billing/*` |
| **Subscriptions** | Plan management | `/subscriptions/*` |

### API Standards

- **Protocol:** HTTPS only (TLS 1.3)
- **Format:** JSON (application/json)
- **Authentication:** JWT Bearer tokens
- **Versioning:** URL-based (`/api/v1/`)
- **Rate Limiting:** 100 requests/minute per IP
- **Pagination:** Cursor-based or offset-based
- **Filtering:** Query parameters
- **Sorting:** `?sort=field:asc|desc`

## Documentation Sections

### 1. [Authentication Guide](./AUTHENTICATION.md)
Complete guide to authentication, authorization, and security:
- JWT token management
- OAuth 2.0 / OIDC integration
- API key authentication
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)

### 2. [Endpoint Reference](./ENDPOINTS.md)
Detailed documentation for all API endpoints:
- Request/response schemas
- Query parameters
- Path parameters
- Request body examples
- Response codes

### 3. [Error Codes Reference](./ERROR_CODES.md)
Comprehensive error handling guide:
- HTTP status codes
- Error response format
- Common error scenarios
- Debugging tips

### 4. [Integration Examples](./EXAMPLES.md)
Practical integration examples:
- Patient registration flow
- Appointment booking
- Video consultation setup
- Payment processing
- FHIR resource access

## Interactive API Documentation

### Swagger/OpenAPI UI

Access the interactive API documentation at:
- **Local:** http://localhost:8080/docs
- **Production:** https://api.unifiedhealthcare.com/docs

The Swagger UI allows you to:
- Browse all available endpoints
- View request/response schemas
- Test API calls directly from the browser
- Download the OpenAPI specification

### OpenAPI Specification

Download the complete OpenAPI 3.0 specification:
```bash
curl https://api.unifiedhealthcare.com/api/v1/openapi.yaml > openapi.yaml
```

## API Conventions

### Request Format

All API requests must include:

```http
POST /api/v1/resource HTTP/1.1
Host: api.unifiedhealthcare.com
Content-Type: application/json
Authorization: Bearer {access_token}
X-Request-ID: {unique-request-id}

{request-body}
```

### Response Format

All API responses follow a standard format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "requestId": "req_123456",
    "timestamp": "2025-12-17T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "requestId": "req_123456",
    "timestamp": "2025-12-17T10:30:00Z"
  }
}
```

### Pagination

Endpoints that return lists support pagination:

**Request:**
```http
GET /api/v1/patients?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

### Filtering and Sorting

**Filtering:**
```http
GET /api/v1/appointments?status=scheduled&date=2025-12-17
```

**Sorting:**
```http
GET /api/v1/patients?sort=lastName:asc,createdAt:desc
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

| Tier | Requests/Minute | Requests/Hour | Requests/Day |
|------|----------------|---------------|--------------|
| **Free** | 60 | 1,000 | 10,000 |
| **Basic** | 120 | 5,000 | 50,000 |
| **Professional** | 300 | 15,000 | 200,000 |
| **Enterprise** | Custom | Custom | Custom |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1702819200
```

When rate limit is exceeded, you'll receive:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

## Idempotency

For POST, PUT, and PATCH requests, include an idempotency key to ensure safe retries:

```http
POST /api/v1/payments
Idempotency-Key: unique-key-12345
```

## Webhooks

The platform can send webhooks for important events:

- Appointment status changes
- Payment events
- Document uploads
- Lab results available
- Prescription ready

See [Webhook Documentation](./WEBHOOKS.md) for setup and event types.

## FHIR Compatibility

The platform supports FHIR R4 resources. Access FHIR endpoints at:
```
https://api.unifiedhealthcare.com/fhir/
```

Supported resources:
- Patient
- Practitioner
- Appointment
- Encounter
- Observation
- MedicationRequest
- DiagnosticReport
- DocumentReference

## SDK Libraries

Official SDKs are available for popular languages:

| Language | Package | Documentation |
|----------|---------|---------------|
| **JavaScript/TypeScript** | `@unified-health/sdk` | [Docs](./SDK_JS.md) |
| **Python** | `unified-health-sdk` | [Docs](./SDK_PYTHON.md) |
| **Java** | `com.unifiedhealth:sdk` | [Docs](./SDK_JAVA.md) |
| **Go** | `github.com/unified-health/sdk-go` | [Docs](./SDK_GO.md) |
| **PHP** | `unified-health/sdk` | [Docs](./SDK_PHP.md) |

### JavaScript SDK Example

```javascript
import { UnifiedHealthClient } from '@unified-health/sdk';

const client = new UnifiedHealthClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create appointment
const appointment = await client.appointments.create({
  patientId: 'pat_123',
  providerId: 'prov_456',
  startTime: '2025-12-17T14:00:00Z',
  type: 'video_consultation'
});
```

## Testing

### Sandbox Environment

Use the sandbox environment for testing:
```
https://api-sandbox.unifiedhealthcare.com/api/v1
```

**Test Credentials:**
```json
{
  "email": "test@example.com",
  "password": "TestPassword123!"
}
```

**Test Payment Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

## Support

### Getting Help

- **API Status:** https://status.unifiedhealthcare.com
- **Support Email:** support@unifiedhealth.io
- **Developer Portal:** https://developers.unifiedhealthcare.com
- **Community Forum:** https://community.unifiedhealthcare.com
- **GitHub Issues:** https://github.com/unified-health/platform/issues

### API Changelog

Track API changes and updates:
- [Changelog](./CHANGELOG.md) - Detailed change history
- [Migration Guides](./MIGRATIONS.md) - Version migration guides
- [Deprecation Notice](./DEPRECATIONS.md) - Deprecated endpoints

## Best Practices

1. **Always use HTTPS** - Never send requests over HTTP
2. **Implement retry logic** - Handle transient failures gracefully
3. **Cache responses** - Use caching to reduce API calls
4. **Validate inputs** - Validate data before sending to API
5. **Handle errors** - Implement comprehensive error handling
6. **Use webhooks** - Subscribe to events instead of polling
7. **Respect rate limits** - Implement exponential backoff
8. **Secure credentials** - Never expose API keys in client-side code
9. **Use SDKs** - Use official SDKs when available
10. **Monitor usage** - Track API usage and performance

---

**Last Updated:** 2025-12-17
**API Version:** 1.0.0
