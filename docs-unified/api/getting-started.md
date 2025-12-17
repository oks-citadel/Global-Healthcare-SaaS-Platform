# Getting Started with Unified Healthcare Platform API

Welcome to the Unified Healthcare Platform API documentation. This guide will help you get started with integrating our API into your applications.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Using the TypeScript SDK](#using-the-typescript-sdk)
4. [Making Direct API Calls](#making-direct-api-calls)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Pagination](#pagination)
8. [Examples](#examples)

## Overview

The Unified Healthcare Platform API is a RESTful API that provides comprehensive healthcare management capabilities, including:

- Patient information management
- Appointment scheduling
- Clinical encounters and notes
- Document storage and retrieval
- Telehealth visits
- Billing and subscriptions
- Audit logging and compliance

### Base URL

```
Development: http://localhost:4000/api/v1
Staging: https://api-staging.unifiedhealth.com/api/v1
Production: https://api.unifiedhealth.com/api/v1
```

### API Documentation

- Interactive API docs: `/api/docs`
- OpenAPI specification (JSON): `/api/docs/openapi.json`
- OpenAPI specification (YAML): `/api/docs/openapi.yaml`

## Authentication

The API uses JWT (JSON Web Token) based authentication with access and refresh tokens.

### Authentication Flow

1. **Register or Login** to obtain access and refresh tokens
2. **Use Access Token** in the `Authorization` header for API requests
3. **Refresh Token** when the access token expires

### Registration

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "patient"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePassword123!"
}
```

### Using Access Tokens

Include the access token in the `Authorization` header:

```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refreshing Tokens

When your access token expires, use the refresh token to obtain a new one:

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Using the TypeScript SDK

The easiest way to interact with the API is through our TypeScript SDK.

### Installation

```bash
npm install @unified-health/sdk
```

### Basic Setup

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
  // Optional: provide existing tokens
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',
  // Optional: callback for token refresh
  onTokenRefresh: (tokens) => {
    console.log('Tokens refreshed:', tokens);
    // Save tokens to storage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
});
```

### Using the SDK

```typescript
// Login
const authResponse = await client.login({
  email: 'patient@example.com',
  password: 'SecurePassword123!',
});

console.log('Logged in as:', authResponse.user);

// Get current user
const user = await client.getCurrentUser();

// Create a patient
const patient = await client.createPatient({
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1990-05-15',
  gender: 'female',
  email: 'jane@example.com',
  phone: '+1234567890',
});

// List appointments
const appointments = await client.listAppointments({
  page: 1,
  limit: 20,
  status: 'scheduled',
});

// Create an appointment
const appointment = await client.createAppointment({
  patientId: patient.id,
  providerId: 'provider-id',
  scheduledAt: '2024-12-20T10:00:00Z',
  duration: 30,
  type: 'telehealth',
  reason: 'Follow-up consultation',
});

// Upload a document
const document = await client.uploadDocument({
  file: fileBlob,
  patientId: patient.id,
  category: 'lab-result',
  description: 'Blood test results',
});
```

### Error Handling with SDK

```typescript
try {
  const patient = await client.getPatient('invalid-id');
} catch (error) {
  if (error.error === 'Not Found') {
    console.error('Patient not found');
  } else if (error.error === 'Unauthorized') {
    console.error('Authentication required');
  } else {
    console.error('API Error:', error.message);
  }
}
```

## Making Direct API Calls

If you're not using TypeScript or prefer direct HTTP calls, here's how to interact with the API.

### Using Fetch API

```javascript
// Login
const response = await fetch('http://localhost:4000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'patient@example.com',
    password: 'SecurePassword123!',
  }),
});

const data = await response.json();
const accessToken = data.accessToken;

// Make authenticated request
const userResponse = await fetch('http://localhost:4000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const user = await userResponse.json();
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'patient@example.com',
  password: 'SecurePassword123!',
});

// Set token for future requests
api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

// Make authenticated request
const user = await api.get('/auth/me');
```

## Error Handling

The API returns standard HTTP status codes and error responses in the following format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-12-17T12:00:00.000Z",
  "path": "/api/v1/patients/invalid-id"
}
```

### Common Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or token expired
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Validation Errors

Validation errors include detailed information about each field:

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 12 characters"
    }
  ],
  "timestamp": "2024-12-17T12:00:00.000Z"
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Default limit**: 100 requests per minute per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum number of requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when the limit resets

When rate limit is exceeded, the API returns `429 Too Many Requests`.

## Pagination

List endpoints support pagination using query parameters:

```http
GET /api/v1/appointments?page=1&limit=20
```

### Pagination Parameters

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

### Pagination Response

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

## Examples

### Complete Patient Management Flow

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
});

async function patientFlow() {
  // 1. Register as a patient
  const auth = await client.register({
    email: 'newpatient@example.com',
    password: 'SecurePassword123!',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'patient',
  });

  // 2. Create patient profile
  const patient = await client.createPatient({
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: '1995-08-20',
    gender: 'female',
    email: 'newpatient@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    emergencyContact: {
      name: 'Bob Johnson',
      relationship: 'Spouse',
      phone: '+1234567891',
    },
  });

  // 3. Schedule an appointment
  const appointment = await client.createAppointment({
    patientId: patient.id,
    providerId: 'provider-id-here',
    scheduledAt: '2024-12-20T14:00:00Z',
    duration: 30,
    type: 'telehealth',
    reason: 'Annual checkup',
  });

  // 4. Upload insurance document
  const insuranceDoc = await client.uploadDocument({
    file: insuranceCardFile,
    patientId: patient.id,
    category: 'insurance',
    description: 'Insurance card - front',
  });

  // 5. List all appointments
  const appointments = await client.listAppointments({
    patientId: patient.id,
    page: 1,
    limit: 10,
  });

  console.log('Setup completed:', {
    patient,
    appointment,
    appointments: appointments.data,
  });
}

patientFlow().catch(console.error);
```

### Provider Workflow

```typescript
async function providerFlow() {
  // Login as provider
  await client.login({
    email: 'provider@example.com',
    password: 'ProviderPassword123!',
  });

  // Get appointments for today
  const today = new Date();
  const todayAppointments = await client.listAppointments({
    providerId: 'current-provider-id',
    startDate: today.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    status: 'confirmed',
  });

  // Create encounter for appointment
  const encounter = await client.createEncounter({
    patientId: 'patient-id',
    providerId: 'current-provider-id',
    appointmentId: todayAppointments.data[0].id,
    type: 'consultation',
    chiefComplaint: 'Persistent headache',
  });

  // Start encounter
  await client.startEncounter(encounter.id);

  // Add clinical note
  const note = await client.addClinicalNote(encounter.id, {
    content: `
      S: Patient reports persistent headache for 3 days
      O: Blood pressure 120/80, temperature 98.6°F
      A: Tension headache, likely stress-related
      P: Prescribed ibuprofen 400mg, follow-up in 1 week
    `,
    type: 'soap',
  });

  // Update encounter with diagnosis
  await client.updateEncounter(encounter.id, {
    diagnosis: [
      {
        code: 'R51',
        description: 'Headache',
        type: 'primary',
      },
    ],
    vitals: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 98.6,
      heartRate: 72,
    },
  });

  // End encounter
  await client.endEncounter(encounter.id);
}
```

## Next Steps

- Explore specific endpoint documentation:
  - [Authentication Endpoints](./endpoints/auth.md)
  - [Patient Endpoints](./endpoints/patients.md)
  - [Appointment Endpoints](./endpoints/appointments.md)
  - [Encounter Endpoints](./endpoints/encounters.md)
  - [Document Endpoints](./endpoints/documents.md)

- Review the [OpenAPI specification](http://localhost:4000/api/docs) for complete API reference

- Check out example applications in the repository

## Support

For API support or questions:
- Email: api-support@unifiedhealth.com
- Documentation: https://docs.unifiedhealth.com
- GitHub Issues: https://github.com/unified-health/platform/issues
