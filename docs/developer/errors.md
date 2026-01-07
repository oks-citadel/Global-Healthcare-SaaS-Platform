# Unified Health Platform - Error Handling Reference

## Overview

This document defines the unified error handling system for the Unified Health platform. All errors follow a three-layer model:

1. **HTTP Status Code** - Transport layer indicator
2. **Backend Error Code** - System truth (ERR_XXXX)
3. **Frontend UX Behavior** - User-facing outcome

## Standard API Error Response

All API errors return this exact JSON structure:

```json
{
  "error": "ErrorClassName",
  "message": "User-friendly message",
  "code": "ERR_1001",
  "statusCode": 400,
  "category": "CLIENT",
  "severity": "LOW",
  "details": [{"field": "email", "message": "Invalid format"}],
  "timestamp": "2024-12-22T00:00:00.000Z",
  "requestId": "correlation-id"
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Error class name (e.g., "ValidationError") |
| `message` | string | User-safe message (no internal details) |
| `code` | string | Error code (ERR_XXXX format) |
| `statusCode` | number | HTTP status code |
| `category` | string | Error category (CLIENT, SERVER, etc.) |
| `severity` | string | Error severity level |
| `details` | array | Field-level validation errors (optional) |
| `timestamp` | string | ISO 8601 timestamp |
| `requestId` | string | Correlation ID for tracing |

## Error Categories

| Category | Description |
|----------|-------------|
| CLIENT | Client-side errors (4xx) |
| SERVER | Server-side errors (5xx) |
| VALIDATION | Data validation failures |
| AUTHENTICATION | Auth/token errors |
| EXTERNAL | Third-party service failures |
| BUSINESS | Business logic violations |

## Severity Levels

| Severity | Description | Action |
|----------|-------------|--------|
| LOW | Minor issue, recoverable | Log info |
| MEDIUM | Significant issue | Log warning, monitor |
| HIGH | Critical issue | Log error, alert |
| CRITICAL | System failure | Log critical, page on-call |

## Error Code Registry

### General Errors (ERR_1000-1999)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_1000 | INTERNAL_ERROR | 500 | Unexpected server error |
| ERR_1001 | BAD_REQUEST | 400 | Invalid request format |
| ERR_1002 | UNAUTHORIZED | 401 | Authentication required |
| ERR_1003 | FORBIDDEN | 403 | Insufficient permissions |
| ERR_1004 | NOT_FOUND | 404 | Resource not found |
| ERR_1005 | CONFLICT | 409 | Resource conflict |
| ERR_1006 | VALIDATION_ERROR | 422 | Validation failed |
| ERR_1007 | RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| ERR_1008 | SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

### Authentication Errors (ERR_2000-2099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_2000 | INVALID_CREDENTIALS | 401 | Wrong username/password |
| ERR_2001 | TOKEN_EXPIRED | 401 | JWT token has expired |
| ERR_2002 | TOKEN_INVALID | 401 | Invalid or malformed token |
| ERR_2003 | MFA_REQUIRED | 401 | Multi-factor auth required |
| ERR_2004 | SESSION_EXPIRED | 401 | Session has expired |

### Authorization Errors (ERR_2100-2199)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_2100 | INSUFFICIENT_PERMISSIONS | 403 | User lacks required role |
| ERR_2101 | RESOURCE_ACCESS_DENIED | 403 | Cannot access this resource |

### User Errors (ERR_3000-3099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_3000 | USER_NOT_FOUND | 404 | User does not exist |
| ERR_3001 | USER_ALREADY_EXISTS | 409 | Email/username taken |
| ERR_3002 | USER_INACTIVE | 403 | Account is deactivated |
| ERR_3003 | INVALID_EMAIL | 422 | Invalid email format |
| ERR_3004 | WEAK_PASSWORD | 422 | Password doesn't meet requirements |

### Appointment Errors (ERR_4000-4099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_4000 | APPOINTMENT_NOT_FOUND | 404 | Appointment doesn't exist |
| ERR_4001 | APPOINTMENT_CONFLICT | 409 | Time slot unavailable |
| ERR_4002 | APPOINTMENT_PAST_DATE | 422 | Cannot book in the past |
| ERR_4003 | APPOINTMENT_CANCELLED | 410 | Appointment was cancelled |

### Medical Record Errors (ERR_5000-5099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_5000 | RECORD_NOT_FOUND | 404 | Medical record not found |
| ERR_5001 | RECORD_ACCESS_DENIED | 403 | Not authorized to view |
| ERR_5002 | RECORD_LOCKED | 423 | Record is locked for editing |

### Payment Errors (ERR_6000-6099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_6000 | PAYMENT_FAILED | 402 | Payment processing failed |
| ERR_6001 | PAYMENT_DECLINED | 402 | Card was declined |
| ERR_6002 | INVALID_CARD | 422 | Invalid card information |
| ERR_6003 | INSUFFICIENT_FUNDS | 402 | Insufficient funds |

### External Service Errors (ERR_7000-7999)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_7000 | EMAIL_SERVICE_ERROR | 503 | Email service unavailable |
| ERR_7001 | SMS_SERVICE_ERROR | 503 | SMS service unavailable |
| ERR_7002 | STORAGE_SERVICE_ERROR | 503 | Storage service unavailable |
| ERR_7003 | PAYMENT_SERVICE_ERROR | 503 | Payment gateway unavailable |

### Database Errors (ERR_8000-8099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_8000 | DATABASE_CONNECTION_ERROR | 503 | Cannot connect to database |
| ERR_8001 | DATABASE_QUERY_ERROR | 500 | Query execution failed |
| ERR_8002 | DATABASE_DEADLOCK | 503 | Transaction deadlock detected |

### File Errors (ERR_9000-9099)

| Code | Name | HTTP | Description |
|------|------|------|-------------|
| ERR_9000 | FILE_NOT_FOUND | 404 | File doesn't exist |
| ERR_9001 | FILE_TOO_LARGE | 413 | File exceeds size limit |
| ERR_9002 | INVALID_FILE_TYPE | 422 | Unsupported file format |

## Frontend UX Mapping

### HTTP Status to UX Behavior

| HTTP | UX Behavior | Implementation |
|------|-------------|----------------|
| 401 | Redirect to login | Clear tokens, navigate to /login |
| 402 | Show billing modal | Navigate to /billing or show upgrade modal |
| 403 | Show permission denied | Display "Access Denied" message |
| 404 | Show 404 page | Navigate to /404 or show "Not Found" |
| 422 | Inline validation | Highlight fields with errors |
| 429 | Show cooldown | Disable action, show countdown timer |
| 500 | Friendly error + retry | Show "Something went wrong" with retry button |
| 503 | Maintenance message | Show "Service temporarily unavailable" |

### React Query Integration

```typescript
// Error handler in query-client.ts
const handleError = (error: AxiosError) => {
  const status = error.response?.status;

  switch (status) {
    case 401:
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      break;
    case 403:
      toast.error('You do not have permission to perform this action.');
      break;
    case 429:
      toast.error('Too many requests. Please wait and try again.');
      break;
    case 500:
    case 502:
    case 503:
      toast.error('Server error. Please try again later.');
      break;
    default:
      toast.error(error.message || 'An error occurred');
  }
};
```

## Backend Usage

### Creating Errors

```typescript
import { BadRequestError, ValidationError, NotFoundError } from '@/utils/errors';

// Simple error
throw new BadRequestError('Invalid input');

// With details
throw new ValidationError('Validation failed', [
  { field: 'email', message: 'Invalid email format' }
]);

// Using ErrorFactory
import { ErrorFactory } from '@/utils/errors';
throw ErrorFactory.create('ERR_3000', 'User not found');
```

### Async Handler Wrapper

```typescript
import { asyncHandler } from '@/middleware/error.middleware';

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json(user);
}));
```

## Enforcement Rules

1. **No raw exceptions**: All endpoints must throw typed AppError subclasses
2. **No local error handling**: Frontend components use global error handler
3. **Registry required**: New error codes must be added to this document
4. **Immutable messages**: Error messages cannot change after release
5. **No internal details**: Production errors never expose stack traces or SQL

## Files

- Backend errors: `services/api/src/utils/errors.ts`
- Error middleware: `services/api/src/middleware/error.middleware.ts`
- Frontend handler: `apps/web/src/lib/query-client.ts`
- Error boundary: `apps/web/src/lib/error-boundary.tsx`
