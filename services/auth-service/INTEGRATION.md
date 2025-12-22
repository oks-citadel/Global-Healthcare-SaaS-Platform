# API Gateway Integration Guide

This document describes how to integrate the Auth Service with the API Gateway.

## 1. Update Service Registry

Update `services/api-gateway/src/config/services.ts`:

```typescript
export const services: Record<string, ServiceConfig> = {
  auth: {
    name: 'Authentication Service',
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    healthCheck: '/health',
  },
  // Update existing services to new ports (avoid conflicts)
  telehealth: {
    name: 'Telehealth Service',
    url: process.env.TELEHEALTH_SERVICE_URL || 'http://localhost:3010',
    healthCheck: '/health',
  },
  mentalHealth: {
    name: 'Mental Health Service',
    url: process.env.MENTAL_HEALTH_SERVICE_URL || 'http://localhost:3011',
    healthCheck: '/health',
  },
  chronicCare: {
    name: 'Chronic Care Service',
    url: process.env.CHRONIC_CARE_SERVICE_URL || 'http://localhost:3012',
    healthCheck: '/health',
  },
  pharmacy: {
    name: 'Pharmacy Service',
    url: process.env.PHARMACY_SERVICE_URL || 'http://localhost:3013',
    healthCheck: '/health',
  },
  laboratory: {
    name: 'Laboratory Service',
    url: process.env.LABORATORY_SERVICE_URL || 'http://localhost:3014',
    healthCheck: '/health',
  },
};
```

## 2. Add Auth Route to API Gateway

Update `services/api-gateway/src/routes/index.ts`:

```typescript
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getServiceUrl } from '../config/services';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Auth routes - no authentication required (service handles its own auth)
router.use(
  '/auth',
  createProxyMiddleware({
    target: getServiceUrl('auth'),
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '/auth',
    },
  })
);

// ... rest of the routes
```

## 3. Update Auth Middleware

The API Gateway's auth middleware (`services/api-gateway/src/middleware/auth.ts`) should validate tokens issued by the Auth Service:

```typescript
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.substring(7);

    // Use the same JWT secret/public key as auth-service
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

## 4. Environment Variables

Add to API Gateway's `.env`:

```env
# Auth Service
AUTH_SERVICE_URL=http://localhost:3001

# JWT Configuration (must match auth-service)
JWT_SECRET=same-secret-as-auth-service
# or for RS256:
JWT_PUBLIC_KEY_PATH=/path/to/public.key
```

## 5. API Routes

Once integrated, the auth endpoints will be available through the gateway:

- `http://localhost:3000/api/auth/register`
- `http://localhost:3000/api/auth/login`
- `http://localhost:3000/api/auth/refresh`
- `http://localhost:3000/api/auth/logout`
- `http://localhost:3000/api/auth/me`
- `http://localhost:3000/api/auth/forgot-password`
- `http://localhost:3000/api/auth/reset-password`
- `http://localhost:3000/api/auth/verify-email`
- `http://localhost:3000/api/auth/resend-verification`

## 6. Service Deployment Order

1. Deploy Auth Service (port 3001)
2. Update API Gateway configuration
3. Deploy API Gateway (port 3000)
4. Deprecate auth endpoints in monolith (`services/api`)

## 7. Migration Strategy

### Phase 1: Dual Running (Week 1-2)
- Auth Service runs alongside monolith
- API Gateway routes `/api/auth/*` to auth-service
- Monolith auth endpoints remain but unused
- Monitor logs and metrics

### Phase 2: Validation (Week 3)
- Compare auth service metrics with monolith
- Verify all auth flows work correctly
- Test failure scenarios

### Phase 3: Cutover (Week 4)
- Remove auth code from monolith
- Mark monolith auth endpoints as deprecated
- Update documentation

## 8. Rollback Plan

If issues occur, revert API Gateway routes to monolith:

```typescript
// Temporary rollback - route to monolith instead
router.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.API_MONOLITH_URL || 'http://localhost:4000',
    changeOrigin: true,
  })
);
```

## 9. Monitoring

Monitor these metrics:

- Request rate to auth endpoints
- Login success/failure rate
- Token refresh rate
- Account lockout events
- Password reset requests
- Email verification rate

## 10. Health Checks

The API Gateway should periodically check auth service health:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "service": "auth-service",
  "version": "1.0.0",
  "timestamp": "2024-12-21T...",
  "database": "connected"
}
```
