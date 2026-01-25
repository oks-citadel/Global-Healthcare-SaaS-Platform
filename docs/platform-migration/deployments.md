# Deployment Configuration

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24

## Vercel Frontend Configuration

### Project Setup

#### Step 1: Create Vercel Projects

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link each frontend application
cd apps/web && vercel link
cd apps/admin && vercel link
cd apps/provider-portal && vercel link
cd apps/kiosk && vercel link
```

#### Step 2: Configure vercel.json

**`apps/web/vercel.json`:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@unified-health/web",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install",
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.yourdomain.com/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/login",
      "destination": "/auth/login",
      "permanent": true
    }
  ]
}
```

**`apps/admin/vercel.json`:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@unified-health/admin",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
      ]
    }
  ]
}
```

### GitHub Integration

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import from GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `/` (monorepo root)
   - **Build Command:** `pnpm turbo build --filter=@unified-health/web`
   - **Output Directory:** `apps/web/.next`
   - **Install Command:** `pnpm install`

### Environment Variables (Vercel Dashboard)

Navigate to: Project Settings → Environment Variables

#### Production Environment

| Variable | Value | Encrypted |
|----------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` | No |
| `NEXT_PUBLIC_WEBSOCKET_URL` | `wss://ws.yourdomain.com` | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | No |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...` | No |
| `NEXT_PUBLIC_GA_TRACKING_ID` | `G-XXXXXXXXXX` | No |
| `NEXT_PUBLIC_ENABLE_TELEHEALTH` | `true` | No |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | `true` | No |
| `API_SECRET_KEY` | `<server-secret>` | Yes |
| `SESSION_SECRET` | `<session-secret>` | Yes |

#### Preview Environment

| Variable | Value | Encrypted |
|----------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://api-staging.yourdomain.com` | No |
| `NEXT_PUBLIC_WEBSOCKET_URL` | `wss://ws-staging.yourdomain.com` | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | No |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...` | No |
| `NEXT_PUBLIC_ENABLE_TELEHEALTH` | `true` | No |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | `false` | No |

#### Staging Environment

Same as Preview, but linked to `staging` branch.

### Custom Domains (Vercel Dashboard)

Navigate to: Project Settings → Domains

#### Web Application
```
app.yourdomain.com          → Production
staging.yourdomain.com      → Staging (Git Branch: staging)
```

#### Admin Dashboard
```
admin.yourdomain.com        → Production
admin-staging.yourdomain.com → Staging (optional)
```

#### Provider Portal
```
provider.yourdomain.com     → Production
```

### Branch Deployment Configuration

| Branch | Environment | Domain |
|--------|-------------|--------|
| `main` | Production | `app.yourdomain.com` |
| `staging` | Staging | `staging.yourdomain.com` |
| `develop` | Preview | `<branch>-<project>.vercel.app` |
| Pull Requests | Preview | `<pr-name>-<project>.vercel.app` |

---

## Railway Backend Configuration

### Project Setup

#### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Or link existing project
railway link
```

#### Step 2: Create Services

**Via Railway Dashboard (https://railway.app/dashboard):**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your repository
4. Create services for each backend component

**Via CLI:**
```bash
# Create PostgreSQL database
railway add --database postgres

# Create Redis
railway add --database redis

# Create services
railway service create api-gateway
railway service create api
railway service create auth-service
railway service create notification-service
railway service create telehealth-service
# ... repeat for all services
```

### Service Configuration

#### API Gateway Service

**Railway Dashboard Configuration:**
```yaml
Service Name: api-gateway
Source: GitHub
Root Directory: services/api-gateway
Build Command: pnpm install && pnpm build
Start Command: node dist/index.js
Port: 3000
Health Check Path: /health
Replicas: 2
Memory: 512MB
```

**railway.json (services/api-gateway/railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### Core API Service

**Railway Configuration:**
```yaml
Service Name: api
Source: GitHub
Root Directory: services/api
Build Command: pnpm install && pnpm db:generate && pnpm build
Start Command: node dist/index.js
Port: 8080
Health Check Path: /health
Replicas: 2
Memory: 1024MB
```

**railway.json (services/api/railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm db:generate && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm db:migrate:deploy && node dist/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 60,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### Auth Service

**railway.json (services/auth-service/railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm db:generate && pnpm build"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

### Environment Variables (Railway Dashboard)

Navigate to: Service → Variables

#### Shared Variables (Railway Project Level)

```bash
# Database (auto-populated by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (auto-populated by Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Shared secrets
JWT_SECRET=<generated-32-char-secret>
ENCRYPTION_KEY=<generated-64-hex-chars>
FIELD_ENCRYPTION_KEY=<generated-64-hex-chars>
```

#### API Gateway Variables

```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# JWT
JWT_SECRET=${{shared.JWT_SECRET}}

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com,https://provider.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=10

# Service URLs (Railway internal networking)
API_SERVICE_URL=http://api.railway.internal:8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
NOTIFICATION_SERVICE_URL=http://notification-service.railway.internal:3002
TELEHEALTH_SERVICE_URL=http://telehealth-service.railway.internal:3003
# ... other services

# Redis
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}

# Monitoring
SENTRY_DSN=<sentry-dsn>
```

#### Core API Variables

```bash
NODE_ENV=production
PORT=8080
API_VERSION=1.0.0
LOG_LEVEL=info

# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_CONNECTION_LIMIT=20
DB_POOL_TIMEOUT=10

# JWT
JWT_SECRET=${{shared.JWT_SECRET}}
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=${{shared.ENCRYPTION_KEY}}
FIELD_ENCRYPTION_KEY=${{shared.FIELD_ENCRYPTION_KEY}}

# Redis
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# AWS (for S3 file storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_S3_BUCKET=yourdomain-documents

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>
SMTP_FROM=noreply@yourdomain.com

# Push Notifications
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_CLIENT_EMAIL=<client-email>
FIREBASE_PRIVATE_KEY=<private-key>
VAPID_PUBLIC_KEY=<vapid-public>
VAPID_PRIVATE_KEY=<vapid-private>
```

### Custom Domains (Railway)

**Via Dashboard:**
1. Go to Service → Settings → Custom Domain
2. Add domain: `api.yourdomain.com`
3. Railway will provide a CNAME target
4. Add CNAME in GoDaddy DNS

**Railway Custom Domain Configuration:**
```
Service: api-gateway
Domain: api.yourdomain.com
Certificate: Auto (Let's Encrypt)

Service: telehealth-service
Domain: ws.yourdomain.com
Certificate: Auto (Let's Encrypt)
```

### Database Configuration

#### PostgreSQL Setup

Railway automatically provisions PostgreSQL. Access credentials via:

```bash
# Get database URL
railway variables get DATABASE_URL

# Connect to database
railway connect postgres
```

**Database Settings:**
```yaml
PostgreSQL Version: 15
Storage: 100GB (auto-scaling)
Backups: Daily automatic
Point-in-time Recovery: Enabled
```

#### Database Migration

```bash
# Run migrations on deployment
pnpm db:migrate:deploy

# Or via Railway CLI
railway run pnpm db:migrate:deploy
```

**Prisma Migration Configuration:**
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Redis Setup

Railway automatically provisions Redis. Access via:

```bash
# Get Redis URL
railway variables get REDIS_URL

# Connect to Redis
railway connect redis
```

### Cron Jobs (Railway)

Create a dedicated cron service in Railway:

**railway.json (services/cron/railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/cron.js"
  },
  "cron": {
    "schedule": "0 */6 * * *",
    "timezone": "UTC"
  }
}
```

**Or use Railway Cron Jobs feature:**
```yaml
Jobs:
  - Name: database-backup
    Schedule: 0 3 * * *  # Daily at 3 AM UTC
    Command: /scripts/backup-database.sh

  - Name: cleanup-expired-tokens
    Schedule: 0 * * * *  # Every hour
    Command: node scripts/cleanup-tokens.js

  - Name: billing-reconciliation
    Schedule: 0 0 * * *  # Daily at midnight
    Command: node scripts/billing-reconciliation.js
```

### Worker Service (Background Jobs)

**railway.json (services/worker/railway.json):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "node dist/worker.js",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## Health Endpoints

All services must implement health endpoints:

### Standard Health Response

```typescript
// GET /health
{
  "status": "healthy",
  "timestamp": "2026-01-24T12:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### Implementation Example

```typescript
// src/routes/health.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';

const router = Router();

router.get('/health', async (req, res) => {
  const checks = {
    database: 'unknown',
    redis: 'unknown'
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch {
    checks.database = 'unhealthy';
  }

  try {
    await redis.ping();
    checks.redis = 'healthy';
  } catch {
    checks.redis = 'unhealthy';
  }

  const allHealthy = Object.values(checks).every(c => c === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    checks
  });
});

export default router;
```

---

## Deployment Workflow

### Automatic Deployments

```
GitHub Push to `main`
        │
        ├──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
   Vercel Webhook                        Railway Webhook
        │                                      │
        ▼                                      ▼
   Build Frontend                        Build Backend
        │                                      │
        ▼                                      ▼
   Deploy to Edge                        Deploy Services
        │                                      │
        ▼                                      ▼
   Run Health Checks                     Run Health Checks
        │                                      │
        ▼                                      ▼
   ✅ Live                               ✅ Live
```

### Manual Deployment

**Vercel:**
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

**Railway:**
```bash
# Deploy service
railway up

# Deploy specific service
railway up --service api-gateway
```

### Rollback Deployment

See [rollback.md](./rollback.md) for detailed procedures.

**Quick Reference:**

**Vercel:**
```bash
# List recent deployments
vercel ls

# Promote previous deployment
vercel rollback <deployment-url>
```

**Railway:**
```bash
# List deployments
railway deployments

# Rollback to previous
railway rollback
```

---

## Staging Environment

### Vercel Staging

**Branch-based:**
- Create `staging` branch
- Configure staging domain: `staging.yourdomain.com`
- Link to staging branch in Vercel dashboard

**Environment Variables:**
- Copy production variables
- Update API URLs to staging endpoints
- Use test API keys

### Railway Staging

**Create staging environment:**

1. In Railway Dashboard: Project → Environments → New Environment
2. Name: `staging`
3. Fork all services
4. Update environment variables:
   - `NODE_ENV=staging`
   - Use staging database
   - Use test API keys

**Staging URLs:**
```
api-staging.yourdomain.com → Railway staging api-gateway
```

---

## CI/CD Quality Gates

GitHub Actions remain for quality gates only (see `.github/workflows/quality-gates.yml`):

```yaml
name: Quality Gates

on:
  pull_request:
    branches: [main, staging, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=critical
```

**Important:**
- GitHub Actions do NOT deploy
- Vercel deploys frontend automatically on push
- Railway deploys backend automatically on push
- GitHub Actions only run tests and quality checks
