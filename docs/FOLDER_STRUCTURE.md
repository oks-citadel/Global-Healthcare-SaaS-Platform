# Unified Health Global Platform - Canonical Folder Structure

## Overview

This document defines the authoritative folder structure for the Unified Health Global Healthcare SaaS Platform. All team members should follow this structure for consistency and maintainability.

---

## Root Directory Structure

```
Global-Healthcare-SaaS-Platform/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD pipelines (GitHub Actions)
│   └── CODEOWNERS              # Code ownership rules
├── .husky/                     # Git hooks
├── apps/                       # Frontend applications (Required)
├── packages/                   # Shared packages/libraries (Required)
├── services/                   # Backend microservices (Required)
├── infrastructure/             # Infrastructure as Code (Required)
├── k8s/                        # Kubernetes manifests (Required)
├── docs/                       # Documentation (Required)
├── scripts/                    # Operational scripts (Required)
├── security-reports/           # Security scan artifacts (Generated)
├── .env.example                # Environment template
├── docker-compose.yml          # Local development
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspace definition
├── turbo.json                  # Turborepo configuration
└── README.md                   # Project entry point
```

---

## Directory Details

### `/apps` - Frontend Applications (Required)

Contains all user-facing applications built with Next.js and React Native.

| Directory              | Purpose                                 | Status | Environment |
| ---------------------- | --------------------------------------- | ------ | ----------- |
| `apps/web`             | Patient portal (Next.js)                | Active | All         |
| `apps/admin`           | Admin dashboard (Next.js)               | Active | All         |
| `apps/provider-portal` | Healthcare provider interface (Next.js) | Active | All         |
| `apps/kiosk`           | Check-in kiosk for facilities (Next.js) | Active | All         |
| `apps/mobile`          | Mobile app (React Native/Expo)          | Active | All         |

**Standard Structure per App:**

```
apps/{app-name}/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── store/            # State management
│   └── types/            # TypeScript definitions
├── public/               # Static assets
├── package.json          # App dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
└── README.md             # App-specific documentation
```

---

### `/packages` - Shared Packages (Required)

Reusable libraries shared across applications and services.

| Package                   | Purpose                              | Status   |
| ------------------------- | ------------------------------------ | -------- |
| `packages/sdk`            | API client SDK for frontend apps     | Required |
| `packages/ui`             | Shared UI component library          | Required |
| `packages/i18n`           | Internationalization (50+ languages) | Required |
| `packages/fhir`           | FHIR R4 interoperability utilities   | Required |
| `packages/compliance`     | HIPAA/GDPR compliance utilities      | Required |
| `packages/adapters`       | External service adapters            | Optional |
| `packages/ai-workflows`   | AI/ML workflow integrations          | Future   |
| `packages/country-config` | Region-specific configurations       | Required |
| `packages/entitlements`   | Subscription tier management         | Required |
| `packages/policy`         | Authorization policy engine          | Required |

**Standard Structure per Package:**

```
packages/{package-name}/
├── src/
│   ├── index.ts          # Public exports
│   └── ...               # Implementation files
├── dist/                 # Compiled output (generated)
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config
└── README.md             # Package documentation
```

---

### `/services` - Backend Microservices (Required)

API and microservices providing business logic and data access.

| Service                          | Purpose                        | Port | Status   |
| -------------------------------- | ------------------------------ | ---- | -------- |
| `services/api`                   | Main API server (NestJS)       | 8080 | Required |
| `services/api-gateway`           | API Gateway/Load balancer      | 8000 | Required |
| `services/auth-service`          | Authentication & authorization | 8081 | Required |
| `services/telehealth-service`    | Video consultations (WebRTC)   | 8082 | Required |
| `services/pharmacy-service`      | E-pharmacy & prescriptions     | 8083 | Required |
| `services/laboratory-service`    | Lab orders & results           | 8084 | Required |
| `services/mental-health-service` | Mental health assessments      | 8085 | Required |
| `services/chronic-care-service`  | Chronic disease management     | 8086 | Required |
| `services/imaging-service`       | Medical imaging with AI        | 8087 | Future   |

**Standard Structure per Service:**

```
services/{service-name}/
├── src/
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   ├── entities/         # Database models
│   ├── dto/              # Data transfer objects
│   └── main.ts           # Entry point
├── prisma/               # Database schema (if applicable)
├── Dockerfile            # Container image
├── package.json          # Service dependencies
└── README.md             # Service documentation
```

---

### `/infrastructure` - Infrastructure as Code (Required)

All cloud infrastructure definitions and deployment configurations.

| Directory                   | Purpose                            | Status   |
| --------------------------- | ---------------------------------- | -------- |
| `infrastructure/terraform`  | Terraform IaC for Azure            | Required |
| `infrastructure/azure`      | Azure-specific configs (ARM/Bicep) | Optional |
| `infrastructure/kubernetes` | K8s base manifests                 | Required |
| `infrastructure/helm`       | Helm charts                        | Future   |
| `infrastructure/monitoring` | Observability configs              | Required |
| `infrastructure/nginx`      | Reverse proxy configs              | Optional |
| `infrastructure/compliance` | Compliance policy definitions      | Required |
| `infrastructure/scripts`    | Infrastructure scripts             | Required |

---

### `/k8s` - Kubernetes Production Manifests (Required)

Production-ready Kubernetes manifests organized by environment.

```
k8s/
├── production/
│   ├── web-deployment.yaml      # Web frontend deployment
│   ├── web-service.yaml         # LoadBalancer service
│   └── web-hpa.yaml             # Horizontal Pod Autoscaler
├── staging/                     # Staging environment (Future)
└── base/                        # Kustomize base (Future)
```

---

### `/docs` - Documentation (Required)

Centralized documentation hub.

```
docs/
├── README.md                    # Documentation index
├── FOLDER_STRUCTURE.md          # This file
├── ARCHITECTURE.md              # System architecture
├── api/                         # API documentation
│   ├── AUTHENTICATION.md        # Auth flows
│   └── ENDPOINTS.md             # API reference
├── architecture/                # Architecture deep-dives
├── compliance/                  # Regulatory compliance
│   ├── HIPAA.md                 # HIPAA compliance
│   ├── GDPR.md                  # GDPR compliance
│   └── POPIA.md                 # POPIA compliance
├── database/                    # Database documentation
├── deployment/                  # Deployment guides
│   ├── LOCAL.md                 # Local development
│   ├── STAGING.md               # Staging deployment
│   └── PRODUCTION.md            # Production deployment
├── developer/                   # Developer guides
├── operations/                  # Operations runbooks
└── user/                        # End-user documentation
```

---

### `/scripts` - Operational Scripts (Required)

Automation scripts for development and operations.

| Script                 | Purpose                    |
| ---------------------- | -------------------------- |
| `setup-azure.sh`       | Azure infrastructure setup |
| `deploy-production.sh` | Production deployment      |
| `deploy-staging.sh`    | Staging deployment         |
| `rollback.sh`          | Deployment rollback        |
| `db-backup.sh`         | Database backup            |
| `db-restore.sh`        | Database restore           |
| `security-scan.sh`     | Security scanning          |
| `docker-build.sh`      | Docker image builds        |

---

## Environment Mapping

| Environment    | Purpose             | Apps | Services | Database                   |
| -------------- | ------------------- | ---- | -------- | -------------------------- |
| **Local**      | Development         | All  | All      | Local PostgreSQL           |
| **Dev**        | Integration testing | All  | All      | Azure PostgreSQL (dev)     |
| **Staging**    | Pre-production      | All  | All      | Azure PostgreSQL (staging) |
| **Production** | Live traffic        | All  | All      | Azure PostgreSQL (prod)    |

---

## Files at Root Level

These files remain at root level for tooling compatibility:

| File                  | Purpose                | Required |
| --------------------- | ---------------------- | -------- |
| `README.md`           | Project overview       | Yes      |
| `package.json`        | Workspace root         | Yes      |
| `pnpm-workspace.yaml` | Workspace definition   | Yes      |
| `pnpm-lock.yaml`      | Dependency lock file   | Yes      |
| `turbo.json`          | Turborepo config       | Yes      |
| `.env.example`        | Environment template   | Yes      |
| `docker-compose.yml`  | Local development      | Yes      |
| `Dockerfile.web.pnpm` | Production build       | Yes      |
| `Makefile`            | Common commands        | Optional |
| `SECURITY.md`         | Security policy        | Yes      |
| `DEPLOYMENT.md`       | Quick deployment guide | Yes      |

---

## Deprecated/To Be Removed

The following should be consolidated:

| Item                                                          | Action                          |
| ------------------------------------------------------------- | ------------------------------- |
| `docs-unified/`                                               | Merge into `docs/`, then remove |
| Root-level `*.md` files (except README, SECURITY, DEPLOYMENT) | Move to `docs/`                 |

---

## Adding New Components

### Adding a New App

1. Create directory in `apps/{app-name}/`
2. Follow the standard app structure
3. Add to `pnpm-workspace.yaml`
4. Update turbo.json if needed
5. Add README.md with setup instructions

### Adding a New Service

1. Create directory in `services/{service-name}/`
2. Follow the standard service structure
3. Add Dockerfile
4. Add to docker-compose.yml
5. Create Kubernetes manifests in `k8s/`
6. Document in `docs/api/`

### Adding a New Package

1. Create directory in `packages/{package-name}/`
2. Configure as workspace package
3. Export from `src/index.ts`
4. Add README.md with usage examples
