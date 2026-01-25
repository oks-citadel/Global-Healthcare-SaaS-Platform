# Security Baseline

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **Classification:** Internal Use Only

## Security Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Layer 1: Edge Security (Vercel)                                   │
│  ├── DDoS Protection                                               │
│  ├── Bot Detection                                                 │
│  ├── WAF Rules                                                     │
│  └── Geographic Blocking (optional)                                │
│                                                                     │
│  Layer 2: Transport Security                                       │
│  ├── TLS 1.2+ Enforcement                                         │
│  ├── HSTS Headers                                                  │
│  ├── Certificate Pinning (mobile)                                  │
│  └── Secure Cookie Attributes                                      │
│                                                                     │
│  Layer 3: Application Security                                     │
│  ├── Rate Limiting                                                 │
│  ├── Input Validation                                              │
│  ├── Output Encoding                                               │
│  ├── CSRF Protection                                               │
│  └── Authentication/Authorization                                  │
│                                                                     │
│  Layer 4: Data Security                                            │
│  ├── Encryption at Rest                                            │
│  ├── Field-level Encryption (PII)                                 │
│  ├── Secrets Management                                            │
│  └── Audit Logging                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## TLS Configuration

### Requirements

- **Minimum Version:** TLS 1.2
- **Preferred Version:** TLS 1.3
- **Certificate Authority:** Let's Encrypt (auto via Vercel/Railway)
- **Key Size:** RSA 2048-bit or ECDSA P-256

### Vercel TLS

Vercel automatically provisions and renews SSL certificates via Let's Encrypt.

**Verification:**
```bash
# Check TLS version and certificate
echo | openssl s_client -connect app.yourdomain.com:443 -tls1_2 2>/dev/null | openssl x509 -noout -dates

# Check supported protocols
nmap --script ssl-enum-ciphers -p 443 app.yourdomain.com
```

### Railway TLS

Railway automatically provisions SSL for custom domains.

**Verification:**
```bash
echo | openssl s_client -connect api.yourdomain.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

---

## HTTP Security Headers

### Vercel Configuration

**vercel.json:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.yourdomain.com wss://ws.yourdomain.com https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;"
        }
      ]
    }
  ]
}
```

### Backend (Express) Headers

```typescript
// middleware/security.ts
import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware = [
  // Helmet sets various HTTP headers
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    contentSecurityPolicy: false, // Handled separately for API
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true
  }),

  // CORS configuration
  cors({
    origin: [
      'https://app.yourdomain.com',
      'https://admin.yourdomain.com',
      'https://provider.yourdomain.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Remaining'],
    maxAge: 86400 // 24 hours
  })
];
```

---

## Rate Limiting

### API Gateway Rate Limits

```typescript
// services/api-gateway/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

// General API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:api:'
  }),
  message: {
    error: 'Too many requests',
    retryAfter: 60
  },
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  }
});

// Stricter limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:auth:'
  }),
  message: {
    error: 'Too many authentication attempts',
    retryAfter: 900
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Sensitive operations limit
export const sensitiveOpLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 per hour
  standardHeaders: true,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:sensitive:'
  }),
  message: {
    error: 'Rate limit exceeded for sensitive operations',
    retryAfter: 3600
  }
});
```

### Rate Limit Configuration

| Endpoint Type | Window | Max Requests | Block Duration |
|--------------|--------|--------------|----------------|
| General API | 1 min | 100 | Until window resets |
| Authentication | 15 min | 10 | 15 minutes |
| Password Reset | 1 hour | 5 | 1 hour |
| File Upload | 1 hour | 50 | 1 hour |
| Admin Actions | 1 min | 30 | 1 minute |

### IP Blocking

```typescript
// middleware/ipBlock.ts
import { redis } from '../lib/redis';

const BLOCKED_IPS_KEY = 'blocked_ips';

export async function ipBlockMiddleware(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'];

  // Check if IP is blocked
  const isBlocked = await redis.sismember(BLOCKED_IPS_KEY, ip);

  if (isBlocked) {
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_BLOCKED'
    });
  }

  next();
}

// Admin function to block IP
export async function blockIP(ip: string, duration: number = 86400) {
  await redis.sadd(BLOCKED_IPS_KEY, ip);
  // Auto-expire after duration
  await redis.expire(BLOCKED_IPS_KEY, duration);
}

// Admin function to unblock IP
export async function unblockIP(ip: string) {
  await redis.srem(BLOCKED_IPS_KEY, ip);
}
```

---

## Authentication Security

### Session Configuration

```typescript
// Secure cookie configuration
const sessionConfig = {
  name: '__session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
  }
};
```

### JWT Configuration

```typescript
// JWT configuration
const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',
    algorithm: 'HS256' as const
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '30d',
    algorithm: 'HS256' as const
  }
};
```

### Password Requirements

```typescript
// Password validation
const passwordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxRepeatingChars: 3,
  prohibitCommonPasswords: true,
  prohibitUserInfo: true // email, name, etc.
};

// Bcrypt configuration
const bcryptRounds = 12;
```

### Multi-Factor Authentication

```typescript
// MFA configuration
const mfaConfig = {
  issuer: 'Your App Name',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  window: 1, // Allow 1 period before/after
  backupCodes: 10, // Generate 10 backup codes
  backupCodeLength: 8
};
```

---

## CORS Configuration

### Allowed Origins

```typescript
// CORS whitelist
const corsOrigins = {
  production: [
    'https://app.yourdomain.com',
    'https://admin.yourdomain.com',
    'https://provider.yourdomain.com',
    'https://kiosk.yourdomain.com'
  ],
  staging: [
    'https://staging.yourdomain.com',
    'https://admin-staging.yourdomain.com'
  ],
  development: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ]
};

// Get origins based on environment
function getCorsOrigins(): string[] {
  const env = process.env.NODE_ENV || 'development';
  return corsOrigins[env] || corsOrigins.development;
}
```

### WebSocket CORS

```typescript
// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
    methods: ['GET', 'POST']
  }
});
```

---

## Secrets Management

### Environment-Based Secrets

**CRITICAL: Secrets must NEVER exist in GitHub**

| Secret | Vercel | Railway | Notes |
|--------|--------|---------|-------|
| JWT_SECRET | Dashboard | Dashboard | Rotate quarterly |
| ENCRYPTION_KEY | Dashboard | Dashboard | 32 bytes, hex |
| DATABASE_URL | Auto | Auto | Railway auto-populates |
| REDIS_URL | - | Auto | Railway auto-populates |
| STRIPE_SECRET | Dashboard | Dashboard | From Stripe dashboard |
| AWS_SECRET_ACCESS_KEY | Dashboard | Dashboard | IAM credentials |

### Secret Rotation Runbook

```bash
# 1. Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# 2. Update in Railway/Vercel dashboard
# - Add new secret as NEW_JWT_SECRET
# - Deploy with both secrets active

# 3. Update application to accept both secrets during rotation
# (Graceful rotation period: 24-48 hours)

# 4. Remove old secret after rotation period

# 5. Document rotation date
echo "JWT_SECRET rotated: $(date -u +%Y-%m-%d)" >> secrets-rotation-log.txt
```

### Secret Rotation Schedule

| Secret | Rotation Frequency | Last Rotated | Next Due |
|--------|-------------------|--------------|----------|
| JWT_SECRET | Quarterly | YYYY-MM-DD | YYYY-MM-DD |
| ENCRYPTION_KEY | Annually | YYYY-MM-DD | YYYY-MM-DD |
| AWS Keys | 90 days | YYYY-MM-DD | YYYY-MM-DD |
| API Keys | Annually | YYYY-MM-DD | YYYY-MM-DD |

---

## Input Validation

### Request Validation

```typescript
// Using Zod for request validation
import { z } from 'zod';

// User registration schema
const registerSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .transform(val => val.toLowerCase().trim()),

  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),

  firstName: z.string()
    .min(1, 'First name required')
    .max(100, 'First name too long')
    .regex(/^[\p{L}\s'-]+$/u, 'Invalid characters in name'),

  lastName: z.string()
    .min(1, 'Last name required')
    .max(100, 'Last name too long')
    .regex(/^[\p{L}\s'-]+$/u, 'Invalid characters in name')
});
```

### SQL Injection Prevention

```typescript
// Always use parameterized queries with Prisma
// GOOD
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// NEVER do this
// BAD: const user = await prisma.$queryRaw`SELECT * FROM users WHERE email = '${userInput}'`
```

### XSS Prevention

```typescript
// Sanitize HTML output
import DOMPurify from 'isomorphic-dompurify';

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

// React automatically escapes output, but be careful with:
// - dangerouslySetInnerHTML (avoid or sanitize)
// - href attributes (validate URLs)
```

---

## Webhook Security

### Webhook Signature Verification

```typescript
// Stripe webhook verification
import Stripe from 'stripe';

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Must use raw body
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }

  // Process event...
}
```

### Outgoing Webhook Security

```typescript
// Sign outgoing webhooks
import crypto from 'crypto';

function signWebhookPayload(payload: string, secret: string): string {
  const timestamp = Date.now();
  const signaturePayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}
```

---

## API Security Checklist

### Pre-Deployment

- [ ] All endpoints require authentication (except public routes)
- [ ] Rate limiting configured on all endpoints
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection for state-changing operations
- [ ] Secure headers configured
- [ ] CORS properly restricted
- [ ] Sensitive data encrypted
- [ ] Audit logging enabled

### Production Verification

```bash
# Security scan
npm audit

# Check headers
curl -I https://api.yourdomain.com/health | grep -E "^(Strict-Transport|X-Frame|X-Content|Content-Security)"

# Test rate limiting
for i in {1..110}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.yourdomain.com/api/v1/status
done | sort | uniq -c

# Verify TLS
testssl.sh https://api.yourdomain.com
```

---

## Compliance Considerations

### HIPAA (if applicable)

- [ ] PHI encrypted at rest and in transit
- [ ] Access controls and audit logging
- [ ] Business Associate Agreements with vendors
- [ ] Incident response procedures
- [ ] Employee training

### GDPR (if applicable)

- [ ] Data processing lawful basis documented
- [ ] Right to erasure implemented
- [ ] Data portability supported
- [ ] Privacy policy updated
- [ ] Cookie consent implemented

### PCI DSS (if handling payments)

- [ ] Stripe handles card data (reduces scope)
- [ ] Never log card numbers
- [ ] Secure webhook endpoints
- [ ] Regular security assessments

---

## Security Incident Response

### If Compromised

1. **Immediately:**
   - Rotate all secrets
   - Revoke active sessions
   - Enable maintenance mode if needed

2. **Investigate:**
   - Check audit logs
   - Identify scope of breach
   - Document timeline

3. **Remediate:**
   - Patch vulnerabilities
   - Notify affected users
   - Report if required (GDPR: 72 hours)

4. **Post-Incident:**
   - Full post-mortem
   - Update security controls
   - Additional monitoring

### Security Contact

For security issues: security@yourdomain.com

Responsible disclosure program: Follow standard 90-day disclosure policy
