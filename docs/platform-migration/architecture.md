# Architecture and Dependency Mapping

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24

## Current State → Target State

### Infrastructure Transition

```
CURRENT STATE (AWS)                    TARGET STATE (Vercel + Railway)
═══════════════════                    ═══════════════════════════════

┌─────────────────────┐                ┌─────────────────────────────┐
│    Route 53 DNS     │                │      GoDaddy DNS            │
└──────────┬──────────┘                └──────────┬──────────────────┘
           │                                      │
           ▼                                      ▼
┌─────────────────────┐                ┌─────────────────────────────┐
│    CloudFront CDN   │                │      Vercel Edge CDN        │
│    + WAF            │                │      (built-in WAF)         │
└──────────┬──────────┘                └──────────┬──────────────────┘
           │                                      │
           ▼                                      │
┌─────────────────────┐                           │
│    ALB              │                           │
└──────────┬──────────┘                           │
           │                                      │
     ┌─────┴─────┐                         ┌──────┴──────┐
     │           │                         │             │
     ▼           ▼                         ▼             ▼
┌─────────┐ ┌─────────┐              ┌─────────┐  ┌─────────────┐
│ ECS     │ │ ECS     │              │ Vercel  │  │  Railway    │
│Frontend │ │Backend  │              │Frontend │  │  Backend    │
└────┬────┘ └────┬────┘              └─────────┘  └──────┬──────┘
     │           │                                       │
     │           ▼                                       ▼
     │    ┌─────────────┐                    ┌─────────────────┐
     │    │    RDS      │                    │ Railway Postgres │
     │    │ PostgreSQL  │                    │     + Redis      │
     │    └─────────────┘                    └─────────────────┘
     │           │
     │           ▼
     │    ┌─────────────┐
     │    │ ElastiCache │
     │    │   Redis     │
     │    └─────────────┘
     │
     └────────────────────────────────────────────────────────────
```

## Service Architecture

### Frontend Applications (→ Vercel)

| Application | Current Port | Vercel Deployment | Custom Domain |
|-------------|--------------|-------------------|---------------|
| Web App | 3000 | Production | `app.yourdomain.com` |
| Admin Dashboard | 3001 | Production | `admin.yourdomain.com` |
| Provider Portal | 3002 | Production | `provider.yourdomain.com` |
| Kiosk | 3004 | Production | `kiosk.yourdomain.com` |
| Marketing Site | - | Production | `yourdomain.com` (root) |

**Vercel Configuration per App:**
```
├── apps/web           → vercel.json (main application)
├── apps/admin         → vercel.json (admin dashboard)
├── apps/provider-portal → vercel.json (provider portal)
└── apps/kiosk         → vercel.json (kiosk application)
```

### Backend Services (→ Railway)

| Service | Port | Railway Service | Instances | Memory |
|---------|------|-----------------|-----------|--------|
| API Gateway | 3000 | `api-gateway` | 2 | 512MB |
| Core API | 8080 | `api` | 2 | 1GB |
| Auth Service | 3001 | `auth-service` | 2 | 512MB |
| Notification | 3002 | `notification-service` | 1 | 512MB |
| Telehealth | 3003 | `telehealth-service` | 2 | 1GB |
| Pharmacy | 3004 | `pharmacy-service` | 1 | 512MB |
| Laboratory | 3005 | `laboratory-service` | 1 | 512MB |
| Imaging | 3006 | `imaging-service` | 1 | 1GB |
| Mental Health | 3007 | `mental-health-service` | 1 | 512MB |
| Chronic Care | 3008 | `chronic-care-service` | 1 | 512MB |
| Clinical Trials | 3009 | `clinical-trials-service` | 1 | 512MB |
| Denial Management | 3010 | `denial-management-service` | 1 | 512MB |
| Home Health | 3011 | `home-health-service` | 1 | 512MB |
| Population Health | 3012 | `population-health-service` | 1 | 512MB |
| Price Transparency | 3014 | `price-transparency-service` | 1 | 512MB |
| Vendor Risk | 3013 | `vendor-risk-service` | 1 | 512MB |
| Interoperability | 3015 | `interoperability-service` | 1 | 512MB |

### Data Stores (→ Railway)

| Store | Current | Target | Notes |
|-------|---------|--------|-------|
| PostgreSQL | RDS (db.r6g.large) | Railway PostgreSQL | Managed backup |
| Redis | ElastiCache | Railway Redis | Sessions, cache, queues |

## Dependency Map

```
                                    ┌─────────────────┐
                                    │   GoDaddy DNS   │
                                    └────────┬────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
              ▼                              ▼                              ▼
    ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
    │  Vercel (app)   │           │  Vercel (admin) │           │ Railway (api)   │
    │                 │           │                 │           │                 │
    │ - Next.js       │           │ - Next.js       │           │ - Express       │
    │ - React Query   │           │ - React Query   │           │ - Prisma        │
    │ - Zustand       │           │ - Zustand       │           │ - Bull          │
    └────────┬────────┘           └────────┬────────┘           └────────┬────────┘
             │                             │                             │
             │        API Requests         │                             │
             └─────────────────────────────┼─────────────────────────────┘
                                           │
                                           ▼
                               ┌─────────────────────┐
                               │   API Gateway       │
                               │   (Railway)         │
                               │                     │
                               │ - JWT Validation    │
                               │ - Rate Limiting     │
                               │ - Request Routing   │
                               └──────────┬──────────┘
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         │                    │           │           │                    │
         ▼                    ▼           ▼           ▼                    ▼
┌──────────────┐    ┌──────────────┐ ┌─────────┐ ┌─────────────┐  ┌──────────────┐
│ Auth Service │    │ Core API     │ │Telehealth│ │Notification │  │ ...Other     │
│              │    │              │ │ Service  │ │  Service    │  │   Services   │
└──────┬───────┘    └──────┬───────┘ └────┬────┘ └──────┬──────┘  └──────────────┘
       │                   │              │             │
       │                   │              │             │
       └───────────────────┴──────────────┴─────────────┘
                                    │
                           ┌────────┴────────┐
                           │                 │
                           ▼                 ▼
                   ┌──────────────┐   ┌──────────────┐
                   │  PostgreSQL  │   │    Redis     │
                   │  (Railway)   │   │  (Railway)   │
                   │              │   │              │
                   │ - Users      │   │ - Sessions   │
                   │ - Patients   │   │ - Cache      │
                   │ - Records    │   │ - Job Queue  │
                   └──────────────┘   └──────────────┘
```

## Traffic Flow

### User Request Flow

```
1. User Browser
       │
       ▼
2. GoDaddy DNS (A/CNAME lookup)
       │
       ▼
3. Vercel Edge (CDN + WAF)
       │
       ├──▶ Static Assets (served from edge)
       │
       └──▶ Dynamic Request
             │
             ▼
4. Vercel Serverless Function (SSR)
       │
       ▼
5. API Request to api.yourdomain.com
       │
       ▼
6. Railway API Gateway
       │
       ├──▶ JWT Validation
       ├──▶ Rate Limit Check
       │
       ▼
7. Backend Service (Railway)
       │
       ▼
8. Database/Cache (Railway PostgreSQL/Redis)
```

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Client  │────▶│  Vercel  │────▶│  API Gateway │────▶│   Auth   │
│  (app)   │     │  (SSR)   │     │  (Railway)   │     │ Service  │
└──────────┘     └──────────┘     └──────────────┘     └────┬─────┘
                                                            │
     ┌──────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Auth Service Actions:                                           │
│ 1. Validate credentials against PostgreSQL                      │
│ 2. Generate JWT (access token: 15m, refresh token: 30d)        │
│ 3. Store refresh token hash in Redis                            │
│ 4. Return tokens to client                                      │
└─────────────────────────────────────────────────────────────────┘
```

### WebSocket Flow (Telehealth/Realtime)

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  Client  │────▶│  GoDaddy DNS │────▶│   Railway       │
│  (app)   │     │  ws.domain   │     │   Telehealth    │
└──────────┘     └──────────────┘     └────────┬────────┘
     │                                          │
     │           WebSocket Upgrade              │
     │◀─────────────────────────────────────────┤
     │                                          │
     │           Bidirectional Messages         │
     │◀────────────────────────────────────────▶│
```

## Railway Project Structure

```
Railway Project: unified-health
├── Environments
│   ├── production
│   └── staging
│
├── Services
│   ├── api-gateway (Docker)
│   │   ├── Custom Domain: api.yourdomain.com
│   │   ├── Health Check: /health
│   │   └── Replicas: 2
│   │
│   ├── api (Docker)
│   │   ├── Internal networking only
│   │   ├── Health Check: /health
│   │   └── Replicas: 2
│   │
│   ├── auth-service (Docker)
│   │   ├── Internal networking only
│   │   └── Health Check: /health
│   │
│   ├── telehealth-service (Docker)
│   │   ├── Custom Domain: ws.yourdomain.com
│   │   ├── Health Check: /health
│   │   └── WebSocket support enabled
│   │
│   └── ... (other services)
│
├── Databases
│   ├── PostgreSQL
│   │   ├── Version: 15
│   │   ├── Storage: 100GB
│   │   └── Backups: Daily
│   │
│   └── Redis
│       ├── Version: 7
│       └── Memory: 1GB
│
└── Cron Jobs
    ├── backup-database (daily @ 03:00 UTC)
    ├── cleanup-expired-tokens (hourly)
    └── billing-reconciliation (daily @ 00:00 UTC)
```

## Vercel Project Structure

```
Vercel Organization: unified-health
├── Projects
│   ├── unified-health-web
│   │   ├── Framework: Next.js
│   │   ├── Build Command: pnpm turbo build --filter=@unified-health/web
│   │   ├── Output Directory: apps/web/.next
│   │   ├── Root Directory: /
│   │   ├── Domains:
│   │   │   ├── app.yourdomain.com (production)
│   │   │   └── staging.yourdomain.com (staging)
│   │   └── Environment Variables: (see env-vars-inventory.md)
│   │
│   ├── unified-health-admin
│   │   ├── Framework: Next.js
│   │   ├── Build Command: pnpm turbo build --filter=@unified-health/admin
│   │   ├── Root Directory: /
│   │   ├── Domains:
│   │   │   └── admin.yourdomain.com (production)
│   │   └── Environment Variables: (see env-vars-inventory.md)
│   │
│   └── unified-health-provider
│       ├── Framework: Next.js
│       ├── Build Command: pnpm turbo build --filter=@unified-health/provider-portal
│       ├── Root Directory: /
│       ├── Domains:
│       │   └── provider.yourdomain.com (production)
│       └── Environment Variables: (see env-vars-inventory.md)
│
└── Team Settings
    ├── Git Integration: GitHub
    ├── Preview Deployments: Enabled
    └── Production Branch: main
```

## Internal Service Communication (Railway)

Railway provides private networking between services. All backend services communicate over the private network using internal hostnames.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Railway Private Network                       │
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │ api-gateway  │────▶│     api      │────▶│ auth-service │    │
│  │              │     │              │     │              │    │
│  │ Port: 3000   │     │ Port: 8080   │     │ Port: 3001   │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                    │                    │             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL + Redis                    │   │
│  │           (accessible via internal hostname)             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Internal Service URLs:
- api.railway.internal:8080
- auth-service.railway.internal:3001
- notification-service.railway.internal:3002
- ... etc
```

## Database Schema Migration Strategy

### Migration Plan

1. **Pre-Migration (T-7 days)**
   - Enable logical replication on source PostgreSQL
   - Create Railway PostgreSQL instance
   - Set up pgloader or pg_dump for migration

2. **Data Migration (T-1 day)**
   ```bash
   # Export from current database
   pg_dump -Fc -v -h $SOURCE_HOST -U $SOURCE_USER -d $SOURCE_DB > backup.dump

   # Import to Railway PostgreSQL
   pg_restore -v -h $RAILWAY_HOST -U $RAILWAY_USER -d $RAILWAY_DB backup.dump
   ```

3. **Validation**
   ```sql
   -- Verify row counts match
   SELECT 'users' as table_name, COUNT(*) as count FROM users
   UNION ALL
   SELECT 'patients', COUNT(*) FROM patients
   UNION ALL
   SELECT 'appointments', COUNT(*) FROM appointments;
   ```

4. **Cutover**
   - Set source database to read-only
   - Final incremental sync
   - Switch connection strings
   - Verify application functionality

### Redis Migration

Redis data is ephemeral (sessions, cache). No migration required.

1. Clear sessions before cutover (users will need to re-authenticate)
2. Cache will warm up naturally after cutover
3. Job queues should be drained before cutover

```bash
# Pre-cutover: Drain job queues
NODE_ENV=production node scripts/drain-queues.js

# Post-cutover: Verify Redis connectivity
redis-cli -h $RAILWAY_REDIS_HOST -p $RAILWAY_REDIS_PORT PING
```

## CI/CD Integration

### GitHub → Vercel (Frontend)

```yaml
# Automatic deployment via Vercel GitHub integration
# No GitHub Actions needed for deployment

Triggers:
- Push to main → Production deployment
- Push to develop → Preview deployment
- Pull Request → Preview deployment with unique URL
```

### GitHub → Railway (Backend)

```yaml
# Automatic deployment via Railway GitHub integration

Triggers:
- Push to main → Production deployment
- Push to develop → Staging deployment (if configured)
```

### Quality Gates (GitHub Actions)

GitHub Actions remain as quality gates only:

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm test

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm typecheck
```

## Key Differences from Current Architecture

| Aspect | Current (AWS) | Target (Vercel + Railway) |
|--------|---------------|---------------------------|
| **Frontend Hosting** | ECS + ALB + CloudFront | Vercel Edge Network |
| **Backend Hosting** | ECS Fargate | Railway Containers |
| **Database** | RDS (managed) | Railway PostgreSQL |
| **Cache** | ElastiCache | Railway Redis |
| **CDN** | CloudFront | Vercel Edge (built-in) |
| **WAF** | AWS WAF | Vercel Firewall + App-level |
| **DNS** | Route 53 | GoDaddy |
| **SSL/TLS** | ACM | Auto (Vercel + Railway) |
| **Deployment** | GitHub Actions → ECS | GitHub → Vercel/Railway |
| **Scaling** | ECS Auto Scaling | Railway Auto Scaling |
| **Logs** | CloudWatch | Vercel/Railway native |
| **Metrics** | CloudWatch + X-Ray | Vercel Analytics + Railway |
