# Environment Configuration Guide

## Overview

This document defines all environment configurations required to run the UnifiedHealth Global Platform across different deployment stages.

---

## Runtime Requirements

### Required Tools

| Tool      | Version  | Purpose            |
| --------- | -------- | ------------------ |
| Node.js   | 20.x LTS | JavaScript runtime |
| pnpm      | 9.x      | Package manager    |
| Docker    | 24.x+    | Containerization   |
| kubectl   | 1.30+    | Kubernetes CLI     |
| Azure CLI | 2.60+    | Azure management   |
| Git       | 2.40+    | Version control    |

### Optional Tools

| Tool      | Version | Purpose                    |
| --------- | ------- | -------------------------- |
| Terraform | 1.6+    | Infrastructure as Code     |
| Helm      | 3.14+   | Kubernetes package manager |
| k9s       | Latest  | Kubernetes TUI             |

---

## Environment Variables

### Core Application Variables

```bash
# Application
NODE_ENV=production|staging|development
PORT=3000
API_URL=https://api.unifiedhealth.io

# Feature Flags
NEXT_TELEMETRY_DISABLED=1
ENABLE_ANALYTICS=true
```

### Authentication

```bash
# Auth0 / Azure AD B2C
AUTH_ISSUER_URL=https://login.unifiedhealth.io
AUTH_CLIENT_ID=<client-id>
AUTH_CLIENT_SECRET=<secret>
AUTH_AUDIENCE=https://api.unifiedhealth.io

# JWT Configuration
JWT_SECRET=<32-character-secret>
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800
```

### Database

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DATABASE_POOL_SIZE=20
DATABASE_SSL=true

# Redis (Caching)
REDIS_URL=redis://host:6380?ssl=true
REDIS_PASSWORD=<password>
```

### Azure Services

```bash
# Azure Configuration
AZURE_SUBSCRIPTION_ID=<subscription-id>
AZURE_TENANT_ID=<tenant-id>
AZURE_CLIENT_ID=<client-id>
AZURE_CLIENT_SECRET=<secret>

# Azure Storage
AZURE_STORAGE_ACCOUNT=<account-name>
AZURE_STORAGE_KEY=<key>
AZURE_STORAGE_CONTAINER=uploads

# Azure Key Vault
AZURE_KEY_VAULT_URL=https://<vault-name>.vault.azure.net/
```

### Third-Party Integrations

```bash
# Stripe (Payments)
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AWS SES (Email)
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@unifiedhealth.io
AWS_SES_FROM_NAME=The Unified Health

# AWS SNS (SMS/Push Notifications)
AWS_SNS_REGION=us-east-1
AWS_SNS_SMS_SENDER_ID=UHealth

# OpenAI (AI Features)
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4
```

### Monitoring & Observability

```bash
# Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxx

# Sentry (Error Tracking)
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Environment-Specific Configuration

### Local Development

```bash
# .env.local
NODE_ENV=development
PORT=3000
API_URL=http://localhost:8080

# Local Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/unifiedhealth

# Local Redis
REDIS_URL=redis://localhost:6379

# Development Auth (mock)
AUTH_BYPASS=true
```

**Setup Steps:**

```bash
# 1. Clone repository
git clone https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform.git
cd Global-Healthcare-SaaS-Platform

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start local services
docker-compose up -d postgres redis

# 5. Run database migrations
pnpm db:migrate

# 6. Start development server
pnpm dev
```

### Development Environment (Azure)

| Resource           | Name                        | Location  |
| ------------------ | --------------------------- | --------- |
| Resource Group     | rg-unified-health-dev       | West US 2 |
| AKS Cluster        | aks-unified-health-dev2     | West US 2 |
| PostgreSQL         | unified-health-postgres-dev | West US 2 |
| Container Registry | acrunifiedhealthdev2        | West US 2 |

```bash
# Dev Environment
NODE_ENV=development
API_URL=https://api.dev.unifiedhealth.io
DATABASE_URL=postgresql://...@unified-health-postgres-dev.postgres.database.azure.com:5432/unifiedhealth
```

### Staging Environment

| Resource       | Name                            | Location  |
| -------------- | ------------------------------- | --------- |
| Resource Group | rg-unified-health-staging       | West US 2 |
| AKS Cluster    | aks-unified-health-staging      | West US 2 |
| PostgreSQL     | unified-health-postgres-staging | West US 2 |

```bash
# Staging Environment
NODE_ENV=staging
API_URL=https://api.staging.unifiedhealth.io
```

### Production Environment

| Resource       | Name                         | Location  |
| -------------- | ---------------------------- | --------- |
| Resource Group | rg-unified-health-prod       | West US 2 |
| AKS Cluster    | aks-unified-health-prod      | West US 2 |
| PostgreSQL     | unified-health-postgres-prod | West US 2 |

```bash
# Production Environment
NODE_ENV=production
API_URL=https://api.unifiedhealth.io
```

---

## Secrets Management

### Azure Key Vault

All production secrets are stored in Azure Key Vault:

| Secret Name                  | Purpose               |
| ---------------------------- | --------------------- |
| `database-connection-string` | PostgreSQL connection |
| `redis-password`             | Redis authentication  |
| `jwt-secret`                 | JWT signing key       |
| `stripe-secret-key`          | Stripe API key        |
| `aws-ses-credentials`        | AWS SES credentials   |
| `aws-sns-credentials`        | AWS SNS credentials   |
| `openai-api-key`             | OpenAI API key        |

**Accessing Secrets:**

```bash
# Via Azure CLI
az keyvault secret show --vault-name kv-unified-health-prod --name database-connection-string

# In Kubernetes (via CSI driver)
# Secrets are automatically mounted as environment variables
```

### GitHub Secrets (CI/CD)

| Secret                  | Purpose                       |
| ----------------------- | ----------------------------- |
| `AZURE_CLIENT_ID`       | Azure AD app client ID (OIDC) |
| `AZURE_TENANT_ID`       | Azure AD tenant ID            |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription            |
| `AZURE_CREDENTIALS`     | Service principal (fallback)  |

---

## Database Configuration

### PostgreSQL Settings

```sql
-- Connection Pool Settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 768MB
maintenance_work_mem = 128MB
work_mem = 16MB

-- Logging
log_statement = 'mod'
log_duration = on
log_min_duration_statement = 1000

-- SSL
ssl = on
ssl_cert_file = '/var/lib/postgresql/server.crt'
ssl_key_file = '/var/lib/postgresql/server.key'
```

### Database Schema

The platform uses Prisma for database management:

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

---

## External Service Dependencies

| Service            | Purpose                    | Required                |
| ------------------ | -------------------------- | ----------------------- |
| Azure PostgreSQL   | Primary database           | Yes                     |
| Azure Redis        | Caching, sessions          | Yes                     |
| Azure Blob Storage | File uploads               | Yes                     |
| Azure Key Vault    | Secrets management         | Yes                     |
| Stripe             | Payment processing         | Yes (for billing)       |
| AWS SES            | Email delivery             | Yes                     |
| AWS SNS            | SMS and push notifications | Yes (for notifications) |
| OpenAI             | AI features                | Optional                |

---

## Health Checks

Each service exposes health endpoints:

| Endpoint            | Purpose                         |
| ------------------- | ------------------------------- |
| `/api/health`       | Basic health check              |
| `/api/health/ready` | Readiness check (dependencies)  |
| `/api/health/live`  | Liveness check (process health) |

**Response Format:**

```json
{
  "status": "healthy",
  "timestamp": "2024-12-24T00:00:00.000Z",
  "uptime": 3600,
  "service": "unifiedhealth-web",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Troubleshooting

### Common Issues

| Issue                      | Solution                             |
| -------------------------- | ------------------------------------ |
| Database connection failed | Check DATABASE_URL and network rules |
| Auth token invalid         | Verify AUTH_ISSUER_URL and secrets   |
| Image pull failed          | Check ACR credentials in AKS         |
| Service not responding     | Check pod logs with `kubectl logs`   |

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n unifiedhealth-production

# View pod logs
kubectl logs -f deployment/web -n unifiedhealth-production

# Check environment variables
kubectl exec -it deployment/web -n unifiedhealth-production -- env

# Test database connection
kubectl exec -it deployment/web -n unifiedhealth-production -- \
  wget -qO- http://localhost:3000/api/health
```
