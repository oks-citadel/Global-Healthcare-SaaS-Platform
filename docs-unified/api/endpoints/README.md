# API Endpoint Documentation

Detailed documentation for all Unified Healthcare Platform API endpoints.

## Available Endpoints

### Authentication & Users
- [Authentication Endpoints](./auth.md) - User registration, login, and token management

### Patient Management
- [Patient Endpoints](./patients.md) - Patient information and medical records

### Scheduling
- [Appointment Endpoints](./appointments.md) - Appointment scheduling and management

### Clinical Documentation
- [Encounter Endpoints](./encounters.md) - Clinical encounters, notes, and diagnoses

### Document Management
- [Document Endpoints](./documents.md) - Medical document upload and storage

## Quick Reference

### Authentication
```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login
POST   /api/v1/auth/refresh      - Refresh token
POST   /api/v1/auth/logout       - Logout
GET    /api/v1/auth/me           - Get current user
```

### Patients
```
POST   /api/v1/patients          - Create patient
GET    /api/v1/patients/:id      - Get patient
PATCH  /api/v1/patients/:id      - Update patient
```

### Appointments
```
POST   /api/v1/appointments      - Create appointment
GET    /api/v1/appointments      - List appointments
GET    /api/v1/appointments/:id  - Get appointment
PATCH  /api/v1/appointments/:id  - Update appointment
DELETE /api/v1/appointments/:id  - Delete appointment
```

### Encounters
```
POST   /api/v1/encounters           - Create encounter
GET    /api/v1/encounters           - List encounters
GET    /api/v1/encounters/:id       - Get encounter
PATCH  /api/v1/encounters/:id       - Update encounter
POST   /api/v1/encounters/:id/start - Start encounter
POST   /api/v1/encounters/:id/end   - End encounter
POST   /api/v1/encounters/:id/notes - Add clinical note
GET    /api/v1/encounters/:id/notes - Get clinical notes
```

### Documents
```
POST   /api/v1/documents                    - Upload document
GET    /api/v1/documents                    - List documents
GET    /api/v1/documents/:id                - Get document metadata
GET    /api/v1/documents/:id/download       - Get download URL
DELETE /api/v1/documents/:id                - Delete document
GET    /api/v1/patients/:patientId/documents - Get patient documents
```

## Common Patterns

### Pagination

Most list endpoints support pagination:

```
GET /api/v1/resource?page=1&limit=20
```

### Filtering

Many endpoints support filtering:

```
GET /api/v1/appointments?patientId=xxx&status=scheduled&startDate=2024-12-01
```

### Authentication

All endpoints (except auth and public endpoints) require authentication:

```http
Authorization: Bearer <access-token>
```

## Response Formats

### Success Response
```json
{
  "id": "resource-id",
  "field": "value",
  ...
}
```

### List Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Detailed message",
  "timestamp": "2024-12-17T12:00:00.000Z"
}
```

## Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created
- `204 No Content` - Success with no body
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Additional Resources

- [Getting Started Guide](../getting-started.md)
- [SDK Documentation](../../../packages/sdk/README.md)
- [Interactive API Docs](http://localhost:4000/api/docs)
