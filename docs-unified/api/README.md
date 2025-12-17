# API Documentation

Comprehensive documentation for the Unified Healthcare Platform API.

## Table of Contents

- [Getting Started](./getting-started.md) - Quick start guide and authentication
- [API Endpoints](#api-endpoints) - Detailed endpoint documentation
- [SDK Usage](#sdk-usage) - TypeScript/JavaScript SDK
- [API Reference](#api-reference) - OpenAPI specification

## Overview

The Unified Healthcare Platform API is a comprehensive RESTful API for managing healthcare operations:

- Patient information management
- Appointment scheduling
- Clinical encounters and documentation
- Medical document storage
- Telehealth visits
- Billing and subscriptions
- Audit logging and compliance

## API Endpoints

### Authentication
- [Authentication Endpoints](./endpoints/auth.md) - User registration, login, and token management

### Core Resources
- [Patient Endpoints](./endpoints/patients.md) - Patient information management
- [Appointment Endpoints](./endpoints/appointments.md) - Appointment scheduling
- [Encounter Endpoints](./endpoints/encounters.md) - Clinical encounters and notes
- [Document Endpoints](./endpoints/documents.md) - Medical document storage

## SDK Usage

### Installation

```bash
npm install @unified-health/sdk
```

### Quick Start

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
});

// Login
const auth = await client.login({
  email: 'user@example.com',
  password: 'password',
});

// Use the API
const appointments = await client.listAppointments();
```

See the [SDK README](../../packages/sdk/README.md) for complete documentation.

## API Reference

### Interactive Documentation

Access the interactive API documentation (Swagger UI):
- Development: http://localhost:4000/api/docs
- Staging: https://api-staging.unifiedhealth.com/api/docs
- Production: https://api.unifiedhealth.com/api/docs

### OpenAPI Specification

Download the OpenAPI specification:
- JSON: `/api/docs/openapi.json`
- YAML: `/api/docs/openapi.yaml`

## Setup Instructions

### 1. Install Dependencies

For the API service:
```bash
cd services/api
npm install
```

For the SDK:
```bash
cd packages/sdk
npm install
```

### 2. Configure Environment

Create a `.env` file in `services/api/`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/unified_health"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=3600
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN=2592000

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

# Rate Limiting
RATE_LIMIT_MAX=100
```

### 3. Run Database Migrations

```bash
cd services/api
npm run db:migrate
npm run db:seed
```

### 4. Start the API Server

```bash
cd services/api
npm run dev
```

The API will be available at http://localhost:4000

### 5. Build the SDK

```bash
cd packages/sdk
npm run build
```

### 6. Use SDK in Your Apps

For the web app:
```bash
cd apps/web
npm install
npm run dev
```

For the mobile app:
```bash
cd apps/mobile
npm install
npm run dev
```

## SDK Generation

To regenerate the SDK from the OpenAPI specification:

```bash
chmod +x scripts/generate-sdk.sh
./scripts/generate-sdk.sh
```

This script will:
1. Check if the API is running
2. Download the OpenAPI specification
3. Generate TypeScript client code (optional)
4. Build the SDK package

## Authentication

The API uses JWT-based authentication:

1. **Register or Login** to obtain access and refresh tokens
2. **Include Access Token** in the `Authorization` header for API requests
3. **Refresh Token** automatically when the access token expires (SDK handles this)

Example:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limiting

- Default: 100 requests per minute per IP
- Authentication endpoints: 5 requests per minute
- Rate limit information is included in response headers

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-12-17T12:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

Common status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Pagination

List endpoints support pagination:

```http
GET /api/v1/appointments?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Security & Compliance

### HIPAA Compliance

- All PHI is encrypted at rest and in transit
- Access controls and audit logging
- Business Associate Agreement (BAA) in place
- Regular security audits

### Data Protection

- TLS 1.3 for all connections
- AES-256 encryption for stored data
- Secure token management
- Rate limiting and DDoS protection

### Access Control

Role-based access control (RBAC):
- **Patient**: View and manage own records
- **Provider**: View and manage patient records
- **Admin**: Full system access

## Support

### Documentation
- API Documentation: https://docs.unifiedhealth.com
- SDK Documentation: [packages/sdk/README.md](../../packages/sdk/README.md)
- Getting Started: [getting-started.md](./getting-started.md)

### Contact
- Email: api-support@unifiedhealth.com
- GitHub: https://github.com/unified-health/platform
- Issues: https://github.com/unified-health/platform/issues

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md).

## License

Proprietary - All rights reserved

---

Last updated: December 17, 2024
