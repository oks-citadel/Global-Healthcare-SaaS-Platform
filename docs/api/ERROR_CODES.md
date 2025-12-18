# API Error Codes Reference

## Overview

The UnifiedHealth API uses standard HTTP status codes and provides detailed error responses to help you understand and resolve issues quickly.

## Error Response Format

All error responses follow a consistent structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error message"
      }
    ]
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2025-12-17T10:30:00Z",
    "path": "/api/v1/patients",
    "method": "POST"
  }
}
```

## HTTP Status Codes

### 2xx Success

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted for processing |
| 204 | No Content | Request succeeded with no response body |

### 4xx Client Errors

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 405 | Method Not Allowed | HTTP method not supported |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors

| Code | Status | Description |
|------|--------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Invalid upstream response |
| 503 | Service Unavailable | Service temporarily unavailable |
| 504 | Gateway Timeout | Upstream request timeout |

## Error Codes by Category

### Authentication Errors (AUTH_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Email or password incorrect | Verify credentials and retry |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired | Refresh the token |
| `AUTH_TOKEN_INVALID` | 401 | Token is malformed or invalid | Re-authenticate |
| `AUTH_TOKEN_MISSING` | 401 | Authorization header missing | Include Bearer token |
| `AUTH_REFRESH_TOKEN_EXPIRED` | 401 | Refresh token expired | Re-authenticate |
| `AUTH_REFRESH_TOKEN_INVALID` | 401 | Invalid refresh token | Re-authenticate |
| `AUTH_MFA_REQUIRED` | 401 | MFA verification required | Complete MFA flow |
| `AUTH_MFA_INVALID_CODE` | 401 | Invalid MFA code | Retry with correct code |
| `AUTH_ACCOUNT_LOCKED` | 403 | Account locked due to failed attempts | Wait 15 minutes or contact support |
| `AUTH_ACCOUNT_DISABLED` | 403 | Account has been disabled | Contact support |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Email verification required | Verify email address |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | Missing required permissions | Check role and scopes |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Your session has expired. Please log in again.",
    "details": []
  }
}
```

### Validation Errors (VALIDATION_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `VALIDATION_ERROR` | 422 | Request validation failed | Check error details |
| `VALIDATION_REQUIRED_FIELD` | 422 | Required field is missing | Provide missing field |
| `VALIDATION_INVALID_FORMAT` | 422 | Field format is invalid | Check field format |
| `VALIDATION_INVALID_EMAIL` | 422 | Email format is invalid | Provide valid email |
| `VALIDATION_INVALID_PHONE` | 422 | Phone number format invalid | Provide valid phone |
| `VALIDATION_INVALID_DATE` | 422 | Date format is invalid | Use ISO 8601 format |
| `VALIDATION_PASSWORD_WEAK` | 422 | Password doesn't meet requirements | Use stronger password |
| `VALIDATION_FILE_TOO_LARGE` | 422 | Uploaded file exceeds limit | Reduce file size |
| `VALIDATION_UNSUPPORTED_FILE_TYPE` | 422 | File type not supported | Use supported file type |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

### Resource Errors (RESOURCE_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `RESOURCE_NOT_FOUND` | 404 | Resource doesn't exist | Verify resource ID |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource already exists | Use existing resource |
| `RESOURCE_CONFLICT` | 409 | Resource state conflict | Resolve conflict |
| `RESOURCE_DELETED` | 410 | Resource has been deleted | Resource no longer available |
| `RESOURCE_LOCKED` | 423 | Resource is locked | Wait or unlock resource |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Patient with ID 'pat_123' not found",
    "details": []
  }
}
```

### Rate Limiting Errors (RATE_LIMIT_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait before retrying |
| `RATE_LIMIT_QUOTA_EXCEEDED` | 429 | Monthly quota exceeded | Upgrade plan or wait |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": [
      {
        "retryAfter": 60,
        "limit": 100,
        "remaining": 0,
        "reset": 1702822800
      }
    ]
  }
}
```

### Payment Errors (PAYMENT_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `PAYMENT_FAILED` | 402 | Payment processing failed | Check payment details |
| `PAYMENT_DECLINED` | 402 | Payment declined by processor | Try different payment method |
| `PAYMENT_INSUFFICIENT_FUNDS` | 402 | Insufficient funds | Add funds or use different card |
| `PAYMENT_CARD_EXPIRED` | 402 | Card has expired | Use valid card |
| `PAYMENT_INVALID_CARD` | 422 | Invalid card number | Check card number |
| `PAYMENT_CURRENCY_NOT_SUPPORTED` | 422 | Currency not supported | Use supported currency |
| `PAYMENT_AMOUNT_INVALID` | 422 | Invalid payment amount | Check amount |
| `PAYMENT_DUPLICATE` | 409 | Duplicate payment detected | Check previous transactions |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Your payment was declined by your bank",
    "details": [
      {
        "declineCode": "insufficient_funds",
        "declineMessage": "Your card has insufficient funds"
      }
    ]
  }
}
```

### Appointment Errors (APPOINTMENT_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `APPOINTMENT_SLOT_UNAVAILABLE` | 409 | Time slot not available | Choose different time |
| `APPOINTMENT_ALREADY_BOOKED` | 409 | You have appointment at this time | Cancel existing or reschedule |
| `APPOINTMENT_TOO_SOON` | 422 | Booking too close to start time | Book earlier |
| `APPOINTMENT_PROVIDER_UNAVAILABLE` | 422 | Provider not available | Choose different provider/time |
| `APPOINTMENT_CANNOT_CANCEL` | 422 | Too late to cancel | Contact support |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_SLOT_UNAVAILABLE",
    "message": "This appointment slot is no longer available",
    "details": [
      {
        "requestedTime": "2025-12-17T14:00:00Z",
        "providerId": "prov_123",
        "nextAvailable": "2025-12-17T15:00:00Z"
      }
    ]
  }
}
```

### Clinical Errors (CLINICAL_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `CLINICAL_INCOMPLETE_DATA` | 422 | Required clinical data missing | Complete all fields |
| `CLINICAL_INVALID_ICD_CODE` | 422 | Invalid diagnosis code | Use valid ICD-10 code |
| `CLINICAL_INVALID_CPT_CODE` | 422 | Invalid procedure code | Use valid CPT code |
| `CLINICAL_PRESCRIPTION_ERROR` | 422 | Prescription validation failed | Review prescription details |
| `CLINICAL_DRUG_INTERACTION` | 422 | Dangerous drug interaction detected | Review medications |
| `CLINICAL_ALLERGY_CONFLICT` | 422 | Medication conflicts with allergy | Choose different medication |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "CLINICAL_DRUG_INTERACTION",
    "message": "Dangerous drug interaction detected",
    "details": [
      {
        "medication": "Warfarin",
        "interactsWith": "Aspirin",
        "severity": "high",
        "description": "Increased risk of bleeding"
      }
    ]
  }
}
```

### Integration Errors (INTEGRATION_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `INTEGRATION_PROVIDER_ERROR` | 502 | External provider error | Retry or contact support |
| `INTEGRATION_TIMEOUT` | 504 | External service timeout | Retry request |
| `INTEGRATION_UNAVAILABLE` | 503 | External service unavailable | Try again later |
| `INTEGRATION_INVALID_RESPONSE` | 502 | Invalid response from provider | Contact support |

### File Errors (FILE_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `FILE_TOO_LARGE` | 422 | File size exceeds limit | Reduce file size |
| `FILE_INVALID_TYPE` | 422 | Unsupported file type | Use supported format |
| `FILE_CORRUPT` | 422 | File is corrupted | Upload valid file |
| `FILE_SCAN_FAILED` | 422 | Virus scan failed | Upload clean file |
| `FILE_NOT_FOUND` | 404 | File not found | Verify file ID |

**Supported File Types:**
- Documents: PDF, DOC, DOCX
- Images: JPG, PNG, DICOM
- Lab Results: PDF, HL7
- Max Size: 50MB per file

### Server Errors (SERVER_*)

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `SERVER_ERROR` | 500 | Internal server error | Contact support |
| `SERVER_DATABASE_ERROR` | 500 | Database operation failed | Retry or contact support |
| `SERVER_MAINTENANCE` | 503 | System under maintenance | Wait for maintenance completion |
| `SERVER_OVERLOADED` | 503 | Server overloaded | Retry with backoff |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred. Our team has been notified.",
    "details": []
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2025-12-17T10:30:00Z"
  }
}
```

## Error Handling Best Practices

### 1. Implement Retry Logic

```javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(await response.text());
      }

      // Retry server errors (5xx)
      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
        continue;
      }

      throw new Error('Max retries exceeded');
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 2. Handle Rate Limiting

```javascript
async function handleRateLimit(response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    await sleep(retryAfter * 1000);
    return makeRequest(); // Retry request
  }
}
```

### 3. Graceful Error Display

```javascript
function getUserFriendlyMessage(errorCode) {
  const messages = {
    'AUTH_TOKEN_EXPIRED': 'Your session has expired. Please log in again.',
    'PAYMENT_DECLINED': 'Your payment was declined. Please try a different card.',
    'APPOINTMENT_SLOT_UNAVAILABLE': 'This time slot is no longer available.',
    // Add more mappings
  };

  return messages[errorCode] || 'An error occurred. Please try again.';
}
```

### 4. Log Errors for Debugging

```javascript
function logError(error, context) {
  console.error({
    errorCode: error.code,
    message: error.message,
    requestId: error.meta?.requestId,
    timestamp: error.meta?.timestamp,
    context: context,
    stackTrace: error.stack
  });
}
```

## Debugging Tips

### 1. Use Request IDs

Every response includes a `requestId` in the meta object. Include this when contacting support:

```
Request ID: req_abc123
```

### 2. Check Rate Limit Headers

Monitor these headers to avoid rate limiting:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1702822800
```

### 3. Enable Debug Mode

In development, include debug headers:
```
X-Debug: true
```

### 4. Test Error Scenarios

Use sandbox environment to test error handling:
```
https://api-sandbox.unifiedhealthcare.com/api/v1
```

## Getting Help

If you encounter persistent errors:

1. **Check API Status:** https://status.unifiedhealthcare.com
2. **Review Documentation:** https://docs.unifiedhealthcare.com
3. **Search Community:** https://community.unifiedhealthcare.com
4. **Contact Support:** support@unifiedhealth.io (Include request ID)

---

**Last Updated:** 2025-12-17
