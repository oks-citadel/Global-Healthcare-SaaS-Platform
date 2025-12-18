# API Rate Limits and Quotas
## Unified Healthcare Platform API

**Version:** 1.0
**Last Updated:** 2025-12-17

---

## Table of Contents
1. [Overview](#overview)
2. [Rate Limiting Strategy](#rate-limiting-strategy)
3. [Rate Limit Configuration](#rate-limit-configuration)
4. [Endpoint-Specific Limits](#endpoint-specific-limits)
5. [Rate Limit Headers](#rate-limit-headers)
6. [Handling Rate Limit Errors](#handling-rate-limit-errors)
7. [Best Practices](#best-practices)
8. [Quota Management](#quota-management)

---

## Overview

The Unified Healthcare Platform API implements rate limiting to ensure fair usage, prevent abuse, and maintain service quality for all users. Rate limits are applied per IP address and per authenticated user.

### Key Principles
- **Fair Usage:** Ensures resources are distributed equitably
- **System Protection:** Prevents service degradation from excessive requests
- **HIPAA Compliance:** Protects PHI from potential data exfiltration attempts
- **DDoS Mitigation:** Defends against distributed denial-of-service attacks

---

## Rate Limiting Strategy

### Implementation Details
- **Technology:** Express Rate Limit middleware
- **Storage:** In-memory (development) / Redis (production)
- **Window Type:** Sliding window
- **Granularity:** Per IP address + Per authenticated user

### Current Configuration
```typescript
// services/api/src/index.ts
const limiter = rateLimit({
  windowMs: 60 * 1000,           // 1 minute
  max: 100,                       // 100 requests per window
  standardHeaders: true,          // Return rate limit info in headers
  legacyHeaders: false,           // Disable X-RateLimit-* headers
  message: {
    error: 'Too many requests, please try again later'
  },
});
```

---

## Rate Limit Configuration

### Global Rate Limits

| Tier | Requests/Minute | Requests/Hour | Requests/Day | Burst Allowance |
|------|----------------|---------------|--------------|-----------------|
| **Default** | 100 | 6,000 | 144,000 | 150 requests |
| **Authenticated** | 200 | 12,000 | 288,000 | 250 requests |
| **Premium** | 500 | 30,000 | 720,000 | 600 requests |
| **Enterprise** | 1,000 | 60,000 | 1,440,000 | 1,200 requests |

### Configuration by Environment

#### Development
```env
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
```

#### Staging
```env
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
```

#### Production
```env
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
RATE_LIMIT_STORE=redis
```

---

## Endpoint-Specific Limits

### Authentication Endpoints
**Higher restrictions to prevent brute force attacks**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/auth/register` | POST | 5 | 15 min | Prevent spam registrations |
| `/api/v1/auth/login` | POST | 10 | 15 min | Prevent brute force |
| `/api/v1/auth/refresh` | POST | 20 | 15 min | Allow token refreshes |
| `/api/v1/auth/logout` | POST | 10 | 1 min | Standard rate |
| `/api/v1/auth/me` | GET | 60 | 1 min | Frequent access allowed |

**Recommended Implementation:**
```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later' },
});

router.post('/auth/login', authLimiter, authController.login);
```

### Data Retrieval Endpoints
**Moderate limits for read operations**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/appointments` | GET | 100 | 1 min | List appointments |
| `/api/v1/appointments/:id` | GET | 200 | 1 min | Single appointment |
| `/api/v1/patients/:id` | GET | 100 | 1 min | Patient details |
| `/api/v1/encounters` | GET | 100 | 1 min | List encounters |
| `/api/v1/documents` | GET | 100 | 1 min | List documents |
| `/api/v1/dashboard/stats` | GET | 60 | 1 min | Dashboard data |

### Data Modification Endpoints
**Stricter limits for write operations**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/appointments` | POST | 20 | 5 min | Create appointment |
| `/api/v1/appointments/:id` | PATCH | 30 | 5 min | Update appointment |
| `/api/v1/appointments/:id` | DELETE | 10 | 5 min | Cancel appointment |
| `/api/v1/patients` | POST | 10 | 15 min | Create patient |
| `/api/v1/patients/:id` | PATCH | 30 | 5 min | Update patient |
| `/api/v1/encounters` | POST | 30 | 5 min | Create encounter |
| `/api/v1/encounters/:id` | PATCH | 50 | 5 min | Update encounter |

### File Upload Endpoints
**Very strict limits for resource-intensive operations**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/documents` | POST | 10 | 15 min | Upload document |
| `/api/v1/documents/:id/download` | GET | 30 | 5 min | Download document |

**Additional File Upload Constraints:**
- **Max File Size:** 10 MB
- **Allowed Types:** PDF, JPEG, PNG, DOCX
- **Concurrent Uploads:** 3 per user
- **Daily Upload Quota:** 50 files per user

### Admin Endpoints
**Moderate limits with audit logging**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/audit/events` | GET | 50 | 1 min | View audit logs |
| `/api/v1/roles` | GET | 30 | 1 min | List roles |
| `/api/v1/notifications/email` | POST | 20 | 5 min | Send email |
| `/api/v1/notifications/sms` | POST | 10 | 5 min | Send SMS |

### Payment Endpoints
**Strict limits for financial operations**

| Endpoint | Method | Limit | Window | Notes |
|----------|--------|-------|--------|-------|
| `/api/v1/payments/charge` | POST | 5 | 15 min | Create charge |
| `/api/v1/payments/subscription` | POST | 10 | 15 min | Create subscription |
| `/api/v1/payments/subscription` | DELETE | 5 | 15 min | Cancel subscription |
| `/api/v1/payments/payment-method` | POST | 10 | 15 min | Add payment method |
| `/api/v1/payments/history` | GET | 30 | 1 min | Payment history |

### Webhook Endpoints
**Special handling for external integrations**

| Endpoint | Method | Limit | Notes |
|----------|--------|-------|-------|
| `/api/v1/billing/webhook` | POST | 1000 | Per source IP |
| `/api/v1/payments/webhook` | POST | 1000 | Stripe webhook |

**Note:** Webhook endpoints use IP whitelisting instead of strict rate limiting.

---

## Rate Limit Headers

### Standard Headers
All API responses include the following rate limit headers:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640000000
```

| Header | Description | Example |
|--------|-------------|---------|
| `RateLimit-Limit` | Maximum requests allowed in window | `100` |
| `RateLimit-Remaining` | Remaining requests in current window | `95` |
| `RateLimit-Reset` | Unix timestamp when limit resets | `1640000000` |

### Rate Limit Exceeded Response
When rate limit is exceeded, the API returns:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1640000060
Retry-After: 60

{
  "error": "Too many requests, please try again later",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Handling Rate Limit Errors

### Client Implementation Best Practices

#### 1. Check Rate Limit Headers
```typescript
const response = await fetch('/api/v1/appointments');

const limit = response.headers.get('RateLimit-Limit');
const remaining = response.headers.get('RateLimit-Remaining');
const reset = response.headers.get('RateLimit-Reset');

console.log(`Rate Limit: ${remaining}/${limit} (Resets at ${new Date(reset * 1000)})`);
```

#### 2. Implement Exponential Backoff
```typescript
async function apiCallWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      const backoffTime = Math.min(retryAfter * Math.pow(2, attempt), 300); // Max 5 min

      console.log(`Rate limited. Retrying in ${backoffTime}s...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

#### 3. Use Request Queuing
```typescript
class RateLimitedQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute = 100;
  private interval = 60000; // 1 minute

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const delay = this.interval / this.requestsPerMinute;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) await fn();
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.processing = false;
  }
}
```

---

## Best Practices

### For API Consumers

1. **Monitor Rate Limit Headers**
   - Always check `RateLimit-Remaining` before making requests
   - Implement client-side throttling based on limits

2. **Implement Retry Logic**
   - Use exponential backoff for 429 responses
   - Respect the `Retry-After` header

3. **Batch Requests**
   - Combine multiple operations where possible
   - Use bulk endpoints when available

4. **Cache Responses**
   - Cache GET responses to reduce API calls
   - Implement intelligent cache invalidation

5. **Use Webhooks**
   - Subscribe to webhooks for event notifications
   - Reduces need for polling endpoints

### For API Developers

1. **Granular Limits**
   - Apply different limits for different endpoint types
   - Stricter limits for sensitive operations

2. **User-Based Limiting**
   - Track limits per authenticated user
   - Different tiers for different subscription levels

3. **Monitoring & Alerting**
   - Monitor rate limit hit rates
   - Alert on unusual patterns

4. **Documentation**
   - Clearly document all rate limits
   - Provide examples of handling 429 errors

---

## Quota Management

### Daily Quotas by Resource Type

| Resource | Free Tier | Premium | Enterprise |
|----------|-----------|---------|------------|
| API Calls | 10,000/day | 100,000/day | Unlimited |
| File Uploads | 50/day | 500/day | 5,000/day |
| Appointments Created | 100/day | 1,000/day | 10,000/day |
| Email Notifications | 50/day | 500/day | 5,000/day |
| SMS Notifications | 10/day | 100/day | 1,000/day |
| Document Storage | 1 GB | 10 GB | 100 GB |

### Quota Tracking

Quotas are tracked using Redis with daily reset:

```typescript
// Pseudo-code for quota tracking
const dailyQuota = {
  key: `quota:${userId}:${resourceType}:${date}`,
  limit: getTierLimit(user.tier, resourceType),
  used: getCurrentUsage(userId, resourceType),
  resetAt: endOfDay(new Date())
};

// Check quota before operation
if (dailyQuota.used >= dailyQuota.limit) {
  throw new QuotaExceededError(
    `Daily quota exceeded for ${resourceType}. Resets at ${dailyQuota.resetAt}`
  );
}
```

### Quota Headers

```http
X-Daily-Quota-Limit: 10000
X-Daily-Quota-Remaining: 9850
X-Daily-Quota-Reset: 2025-12-18T00:00:00Z
```

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Rate Limit Hit Rate**
   - Percentage of requests hitting rate limits
   - Target: < 1% for normal traffic

2. **Average Requests per User**
   - Baseline: 50-100 requests/hour per active user
   - Spike detection threshold: 3x baseline

3. **Top Rate-Limited Endpoints**
   - Identify endpoints needing limit adjustments
   - Optimize or document high-traffic endpoints

4. **Geographic Distribution**
   - Monitor for unusual geographic patterns
   - Implement region-specific limits if needed

### Alerts

Configure alerts for:
- Rate limit hit rate > 5%
- Individual user exceeds 80% of quota
- Sudden spike in 429 responses
- Potential DDoS patterns detected

---

## Temporary Rate Limit Adjustments

### Requesting Limit Increases

For temporary or permanent rate limit increases:

1. **Contact:** api-support@unifiedhealth.com
2. **Provide:**
   - Use case description
   - Expected request volume
   - Time period needed
   - Business justification

3. **Review Process:** 1-2 business days
4. **Approval:** Based on system capacity and use case

---

## FAQ

**Q: What happens when I hit the rate limit?**
A: You'll receive a 429 status code with a `Retry-After` header indicating when to retry.

**Q: Are rate limits per endpoint or global?**
A: Both. There's a global limit and endpoint-specific limits for sensitive operations.

**Q: How can I check my current usage?**
A: Check the `RateLimit-Remaining` and `X-Daily-Quota-Remaining` headers in API responses.

**Q: Can I increase my rate limits?**
A: Yes, upgrade to Premium or Enterprise tier, or contact support for custom limits.

**Q: Do webhook requests count toward my rate limit?**
A: No, incoming webhooks from Stripe and other services are exempt.

**Q: How are burst requests handled?**
A: The system allows brief bursts (up to 1.5x the limit) before enforcing strict limits.

---

## Contact & Support

For rate limit questions or issues:
- **Email:** api-support@unifiedhealth.com
- **Documentation:** https://docs.unifiedhealth.com/api/rate-limits
- **Status Page:** https://status.unifiedhealth.com

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Next Review:** 2026-03-17
