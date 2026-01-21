# Error Handling Guide

## Overview

The Unified Health Platform implements a comprehensive error handling and resilience system to ensure robust, reliable operation even under adverse conditions. This guide covers all aspects of error handling, from error codes to circuit breakers.

## Table of Contents

1. [Error Classification](#error-classification)
2. [Error Codes Reference](#error-codes-reference)
3. [Backend Error Handling](#backend-error-handling)
4. [Frontend Error Handling](#frontend-error-handling)
5. [Resilience Patterns](#resilience-patterns)
6. [Health Checks](#health-checks)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## Error Classification

Errors are classified into several categories for better handling and monitoring:

### Error Categories

| Category | Description | HTTP Status | Examples |
|----------|-------------|-------------|----------|
| `CLIENT` | Client-side errors (4xx) | 400-499 | Invalid input, missing fields |
| `SERVER` | Server-side errors (5xx) | 500-599 | Internal errors, crashes |
| `EXTERNAL` | External service failures | 503 | Email service down, payment gateway error |
| `VALIDATION` | Data validation errors | 422 | Schema validation failures |
| `AUTHENTICATION` | Auth/authz errors | 401, 403 | Invalid token, insufficient permissions |
| `BUSINESS` | Business logic violations | 400-409 | Appointment conflicts, record locked |

### Error Severity

| Severity | Description | Action |
|----------|-------------|--------|
| `LOW` | Minor issues, user-recoverable | Log, show to user |
| `MEDIUM` | Moderate issues, may need intervention | Log, alert if frequent |
| `HIGH` | Serious issues affecting functionality | Log, alert, investigate |
| `CRITICAL` | System-critical errors | Log, alert immediately, escalate |

---

## Error Codes Reference

### General Errors (1000-1999)

| Code | Message | HTTP Status | Description |
|------|---------|-------------|-------------|
| `ERR_1000` | Internal server error | 500 | Unexpected server error |
| `ERR_1001` | Bad request | 400 | Invalid request format |
| `ERR_1002` | Unauthorized | 401 | Authentication required |
| `ERR_1003` | Forbidden | 403 | Access denied |
| `ERR_1004` | Not found | 404 | Resource not found |
| `ERR_1005` | Conflict | 409 | Resource conflict |
| `ERR_1006` | Validation error | 422 | Request validation failed |
| `ERR_1007` | Rate limit exceeded | 429 | Too many requests |
| `ERR_1008` | Service unavailable | 503 | Service temporarily down |

### Authentication Errors (2000-2099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_2000` | Invalid credentials | Wrong username/password |
| `ERR_2001` | Token expired | JWT token expired |
| `ERR_2002` | Token invalid | Invalid JWT token |
| `ERR_2003` | Token missing | No authentication token provided |
| `ERR_2004` | Session expired | User session expired |
| `ERR_2005` | MFA required | Multi-factor authentication needed |
| `ERR_2006` | MFA invalid | Invalid MFA code |

### Authorization Errors (2100-2199)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_2100` | Insufficient permissions | User lacks required permissions |
| `ERR_2101` | Resource access denied | Cannot access specific resource |
| `ERR_2102` | Organization access denied | No access to organization |

### User Errors (3000-3099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_3000` | User not found | User does not exist |
| `ERR_3001` | User already exists | Email/username taken |
| `ERR_3002` | User inactive | Account is inactive |
| `ERR_3003` | User suspended | Account is suspended |
| `ERR_3004` | Invalid email | Email format invalid |
| `ERR_3005` | Weak password | Password doesn't meet requirements |

### Appointment Errors (4000-4099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_4000` | Appointment not found | Appointment doesn't exist |
| `ERR_4001` | Appointment conflict | Time slot already booked |
| `ERR_4002` | Appointment past date | Cannot schedule in the past |
| `ERR_4003` | Appointment cancelled | Appointment is cancelled |
| `ERR_4004` | Appointment not modifiable | Cannot modify appointment |

### Medical Record Errors (5000-5099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_5000` | Record not found | Medical record not found |
| `ERR_5001` | Record access denied | No permission to access record |
| `ERR_5002` | Record locked | Record is locked for editing |
| `ERR_5003` | Invalid medical data | Medical data validation failed |

### Payment Errors (6000-6099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_6000` | Payment failed | Payment processing failed |
| `ERR_6001` | Payment declined | Payment declined by processor |
| `ERR_6002` | Invalid card | Card information invalid |
| `ERR_6003` | Insufficient funds | Not enough funds |
| `ERR_6004` | Payment gateway error | Payment gateway issue |

### External Service Errors (7000-7999)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_7000` | Email service error | Email sending failed |
| `ERR_7001` | SMS service error | SMS sending failed |
| `ERR_7002` | Storage service error | File storage error |
| `ERR_7003` | Notification service error | Push notification failed |
| `ERR_7004` | Payment service error | Payment service unavailable |

### Database Errors (8000-8099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_8000` | Database connection error | Cannot connect to database |
| `ERR_8001` | Database query error | Query execution failed |
| `ERR_8002` | Database constraint violation | Constraint violated |
| `ERR_8003` | Database deadlock | Deadlock detected |

### Cache Errors (8100-8199)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_8100` | Cache connection error | Cannot connect to cache |
| `ERR_8101` | Cache operation error | Cache operation failed |

### File Errors (9000-9099)

| Code | Message | Description |
|------|---------|-------------|
| `ERR_9000` | File not found | Requested file not found |
| `ERR_9001` | File too large | File exceeds size limit |
| `ERR_9002` | Invalid file type | File type not allowed |
| `ERR_9003` | File upload failed | File upload failed |

---

## Backend Error Handling

### Creating Custom Errors

```typescript
import { AppError, ErrorCode, ErrorCategory, ErrorSeverity } from '@/utils/errors';

// Simple error
throw new BadRequestError('Invalid email format');

// Error with code
throw new BadRequestError('Invalid email', ErrorCode.INVALID_EMAIL);

// Custom error with details
throw new ValidationError('Validation failed', ErrorCode.VALIDATION_ERROR, [
  { field: 'email', message: 'Email is required' },
  { field: 'password', message: 'Password must be at least 8 characters' }
]);

// Using ErrorFactory
throw ErrorFactory.create(
  ErrorCode.APPOINTMENT_CONFLICT,
  'Time slot already booked',
  [{ timeSlot: '2024-01-15 10:00', practitionerId: '123' }]
);
```

### Error Response Format

All API errors follow this structure:

```json
{
  "error": "ValidationError",
  "message": "Request validation failed",
  "code": "ERR_1006",
  "category": "VALIDATION",
  "severity": "LOW",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_abc123"
}
```

### Async Error Handling

```typescript
import { asyncHandler } from '@/middleware/error.middleware';

// Wrap async route handlers
router.post('/appointments', asyncHandler(async (req, res) => {
  const appointment = await createAppointment(req.body);
  res.json(appointment);
}));
```

### Error Tracking Integration

```typescript
import { initializeErrorTracking } from '@/middleware/error.middleware';
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Integrate with error middleware
initializeErrorTracking({
  captureException: (error, context) => {
    Sentry.captureException(error, context);
  },
  captureMessage: (message, level) => {
    Sentry.captureMessage(message, level as any);
  }
});
```

---

## Frontend Error Handling

### Using Error Boundary

```tsx
import { ErrorBoundary, PageErrorBoundary } from '@/lib/error-boundary';

// Page-level error boundary
function App() {
  return (
    <PageErrorBoundary>
      <YourApp />
    </PageErrorBoundary>
  );
}

// Component-level error boundary
function ComponentWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error, errorInfo) => {
        console.error('Error:', error, errorInfo);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}

// Using HOC
const SafeComponent = withErrorBoundary(YourComponent, {
  onError: (error) => console.error(error)
});
```

### Using Error Handler Hook

```tsx
import { useErrorHandler, useAsyncError } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { error, handleError, clearError, hasError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      await submitForm(data);
    } catch (err) {
      handleError(err as Error, {
        showToast: true,
        retryable: true
      });
    }
  };

  return (
    <div>
      {hasError && <ErrorMessage error={error} onClose={clearError} />}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### Async Operations with Error Handling

```tsx
import { useAsyncError } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { execute, isLoading, error } = useAsyncError();

  const loadData = async () => {
    const data = await execute(fetchData);
    if (data) {
      setData(data);
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorAlert error={error} />}
      <button onClick={loadData}>Load Data</button>
    </div>
  );
}
```

### Retry Logic

```tsx
import { useRetry } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { retry, attempts, isRetrying } = useRetry(
    () => fetchData(),
    { maxAttempts: 3, delay: 1000, backoff: true }
  );

  return (
    <div>
      <button onClick={retry} disabled={isRetrying}>
        {isRetrying ? `Retrying (${attempts}/3)...` : 'Retry'}
      </button>
    </div>
  );
}
```

---

## Resilience Patterns

### Circuit Breaker

Prevents cascading failures by stopping calls to failing services.

```typescript
import { emailCircuitBreaker } from '@/lib/circuit-breaker';

// Use circuit breaker
const result = await emailCircuitBreaker.execute(
  async () => {
    return await sendEmail(to, subject, body);
  },
  async () => {
    // Fallback: queue email for later
    return await queueEmail(to, subject, body);
  }
);

// Check circuit breaker status
const stats = emailCircuitBreaker.getStats();
console.log('Circuit breaker state:', stats.state);
console.log('Failure rate:', stats.consecutiveFailures);
```

### Retry with Exponential Backoff

Automatically retry failed operations with increasing delays.

```typescript
import { retry, RetryPresets } from '@/lib/retry';

// Basic retry
const result = await retry(
  async () => {
    return await apiCall();
  },
  RetryPresets.standard
);

// Custom retry configuration
const result = await retry(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
    onRetry: (error, attempt, delay) => {
      console.log(`Retry attempt ${attempt} after ${delay}ms`);
    }
  }
);
```

### Caching

Reduce load and improve performance with caching.

```typescript
import { getCache, CacheKeys, CacheTTL } from '@/lib/cache';

const cache = getCache();

// Cache-aside pattern
const user = await cache.getOrSet(
  CacheKeys.user(userId),
  async () => {
    return await db.user.findUnique({ where: { id: userId } });
  },
  CacheTTL.MEDIUM
);

// Manual caching
await cache.set(CacheKeys.user(userId), user, CacheTTL.LONG);
const cachedUser = await cache.get(CacheKeys.user(userId));

// Cache invalidation
await cache.delete(CacheKeys.user(userId));
await cache.deletePattern('user:*');
```

### Using Decorators

```typescript
import { Retry, Cacheable, CacheInvalidate } from '@/lib/retry';

class UserService {
  @Retry({ maxAttempts: 3, initialDelay: 1000 })
  async findUser(id: string) {
    return await db.user.findUnique({ where: { id } });
  }

  @Cacheable({ key: (args) => `user:${args[0]}`, ttl: 3600 })
  async getUserProfile(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
  }

  @CacheInvalidate({
    keys: (args) => [`user:${args[0]}`, `user:${args[0]}:profile`]
  })
  async updateUser(userId: string, data: any) {
    return await db.user.update({
      where: { id: userId },
      data
    });
  }
}
```

---

## Health Checks

### Endpoints

The system provides three health check endpoints:

#### 1. Liveness Probe - `/health/live`

Checks if the application is running.

```bash
curl http://localhost:3000/health/live
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Readiness Probe - `/health/ready`

Checks if the application is ready to serve traffic.

```bash
curl http://localhost:3000/health/ready
```

Response:
```json
{
  "status": "ready",
  "checks": {
    "database": true,
    "cache": true
  }
}
```

#### 3. Comprehensive Health - `/health`

Detailed health information for all components.

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 15
    },
    "cache": {
      "status": "healthy",
      "responseTime": 5,
      "details": {
        "hitRate": 0.85,
        "errors": 0
      }
    },
    "circuitBreakers": {
      "status": "healthy",
      "details": {
        "breakerCount": 4
      }
    },
    "memory": {
      "status": "healthy",
      "details": {
        "usagePercent": "45.32",
        "heapUsed": "128 MB",
        "heapTotal": "283 MB"
      }
    }
  },
  "degraded": false
}
```

### Health Status Values

- `healthy`: All systems operational
- `degraded`: Some non-critical systems have issues
- `unhealthy`: Critical systems failing

### Kubernetes Integration

```yaml
# kubernetes/deployment.yaml
apiVersion: v1
kind: Pod
metadata:
  name: healthcare-api
spec:
  containers:
  - name: api
    image: healthcare-api:latest
    livenessProbe:
      httpGet:
        path: /health/live
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 30
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 10
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Circuit Breaker Open

**Symptom**: Requests failing with circuit breaker error

**Diagnosis**:
```bash
curl http://localhost:3000/health
# Check circuitBreakers.details for open breakers
```

**Solution**:
- Check the external service health
- Investigate logs for recurring errors
- Wait for timeout period or manually close circuit:
  ```typescript
  emailCircuitBreaker.forceClose();
  ```

#### 2. High Memory Usage

**Symptom**: Memory health check showing degraded/unhealthy

**Diagnosis**:
```bash
# Check current memory
curl http://localhost:3000/health

# Monitor memory over time
watch -n 5 'curl -s http://localhost:3000/health | jq .checks.memory'
```

**Solution**:
- Check for memory leaks
- Review cache size
- Restart application if necessary
- Scale horizontally

#### 3. Database Connection Failures

**Symptom**: Database health check failing

**Diagnosis**:
```bash
# Check database connectivity
curl http://localhost:3000/health/ready

# Check logs
docker logs healthcare-api | grep -i database
```

**Solution**:
- Verify database is running
- Check connection string
- Review connection pool settings
- Check network connectivity

#### 4. Cache Unavailable

**Symptom**: Cache health degraded, high response times

**Diagnosis**:
```bash
# Check cache status
curl http://localhost:3000/health

# Check Redis directly
redis-cli ping
```

**Solution**:
- Verify Redis is running
- Check Redis connection settings
- Review Redis memory usage
- Application will continue without cache (degraded mode)

### Error Rate Monitoring

Monitor error rates to detect issues early:

```bash
# Check error logs
docker logs healthcare-api 2>&1 | grep -i error | tail -50

# Count errors by type
docker logs healthcare-api 2>&1 | grep "error" | \
  jq -r '.error.code' | sort | uniq -c | sort -rn
```

### Debugging Tips

1. **Enable debug logging**:
   ```env
   LOG_LEVEL=debug
   ```

2. **Check request ID correlation**:
   All errors include a `requestId` for tracking across logs

3. **Review circuit breaker stats**:
   ```typescript
   const stats = circuitBreakerManager.getAllStats();
   console.log(stats);
   ```

4. **Monitor cache hit rates**:
   ```typescript
   const cacheStats = cache.getStats();
   console.log('Hit rate:', cacheStats.hitRate);
   ```

### Performance Issues

If experiencing slow responses:

1. Check database query performance
2. Review cache hit rates
3. Monitor circuit breaker states
4. Check external service response times
5. Review retry attempts and delays

### Production Checklist

Before deploying to production:

- [ ] Sentry/error tracking configured
- [ ] Health check endpoints tested
- [ ] Circuit breaker thresholds configured
- [ ] Retry policies configured appropriately
- [ ] Cache TTLs optimized
- [ ] Graceful shutdown tested
- [ ] Error messages sanitized (no sensitive data)
- [ ] Monitoring alerts configured
- [ ] Log retention policies set
- [ ] Backup and recovery procedures documented

---

## Best Practices

### 1. Error Handling

- Always use typed errors (AppError subclasses)
- Include error codes for all errors
- Provide user-friendly messages
- Don't expose sensitive information
- Use appropriate severity levels

### 2. Resilience

- Use circuit breakers for external services
- Implement retry logic with exponential backoff
- Always provide fallback mechanisms
- Cache frequently accessed data
- Implement graceful degradation

### 3. Monitoring

- Log all errors with context
- Track error rates and patterns
- Monitor circuit breaker states
- Set up alerts for critical errors
- Review error trends regularly

### 4. Testing

- Test error scenarios
- Test circuit breaker behavior
- Test retry logic
- Test graceful shutdown
- Load test with failures

### 5. Documentation

- Document error codes
- Document fallback behavior
- Document recovery procedures
- Keep troubleshooting guide updated
- Document SLAs and SLOs

---

## Support

For additional help:
- Check application logs
- Review health check endpoints
- Consult this documentation
- Contact the development team
- File an issue in the repository

## Version History

- **v1.0.0** (2024-01-15): Initial comprehensive error handling implementation
