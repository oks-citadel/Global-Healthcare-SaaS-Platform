# Getting Started

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)
- Azure CLI (for cloud deployment)
- kubectl (for Kubernetes deployment)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/global-healthcare/platform.git
cd platform

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure essential variables
# Edit .env with your values:
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - ENCRYPTION_KEY
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run database migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed
```

### 4. Start Services

```bash
# Development mode (all services)
pnpm dev

# Or start specific services
pnpm dev:api
pnpm dev:web
```

### 5. Verify Installation

```bash
# Check API health
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","version":"1.0.0"}
```

## Project Structure

```
Global-Healthcare-SaaS-Platform/
├── apps/                    # Frontend applications
│   ├── web/                 # Patient web portal
│   ├── admin/               # Admin dashboard
│   ├── provider-portal/     # Provider interface
│   └── mobile/              # React Native app
│
├── services/                # Backend services
│   ├── api/                 # Main API service
│   └── api-gateway/         # API gateway
│
├── packages/                # Shared packages
│   ├── fhir/                # FHIR types and utilities
│   ├── country-config/      # Country configurations
│   ├── adapters/            # External system adapters
│   └── ui/                  # Shared UI components
│
├── platform/                # Platform architecture
│   ├── operations/          # Operations layer
│   │   ├── networking/      # Network configuration
│   │   ├── security/        # Security configuration
│   │   ├── application/     # App deployment config
│   │   └── data/            # Data operations
│   │
│   ├── regions/             # Regional configurations
│   │   ├── americas/
│   │   ├── europe/
│   │   ├── africa/
│   │   ├── middle-east/
│   │   └── asia-pacific/
│   │
│   ├── services/            # Microservices specs
│   ├── adapters/            # Adapter framework
│   ├── compliance/          # Compliance docs
│   └── docs/                # Documentation
│
├── infra/                   # Infrastructure as Code
│   ├── kubernetes/          # K8s manifests
│   ├── terraform/           # Terraform configs
│   └── helm/                # Helm charts
│
└── tools/                   # Development tools
```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test:api
pnpm test:fhir

# Run with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Type check
pnpm typecheck

# Format code
pnpm format
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:api
pnpm build:web
```

## Configuration

### Country Configuration

Each country has specific configurations in `packages/country-config/`:

```typescript
// Example: Adding a new country
import { CountryConfig } from "@healthcare/country-config";

export const newCountryConfig: CountryConfig = {
  code: "XX",
  name: "New Country",
  region: "region-name",
  enabled: true,
  regulatory: {
    primary: "Primary Regulation",
    secondary: ["Secondary 1", "Secondary 2"],
  },
  dataResidency: {
    location: "in-country",
    allowedRegions: ["XX"],
  },
  consent: {
    model: "opt-in",
    minimumAge: 18,
  },
};
```

### Adding an Adapter

```bash
# Generate adapter scaffold
pnpm create:adapter --name=my-system --country=XX --protocol=fhir-r4

# Implement the adapter interface
# See platform/adapters/README.md for details
```

### Environment Variables

| Variable          | Description                     | Required |
| ----------------- | ------------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string    | Yes      |
| `REDIS_URL`       | Redis connection string         | Yes      |
| `JWT_SECRET`      | JWT signing secret              | Yes      |
| `ENCRYPTION_KEY`  | PHI encryption key              | Yes      |
| `FHIR_SERVER_URL` | External FHIR server (optional) | No       |
| `COUNTRY_CODE`    | Default country code            | No       |

## Docker Development

### Using Docker Compose

```yaml
# docker-compose.yml (dev)
services:
  api:
    build: ./services/api
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/healthcare
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    depends_on:
      - api

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Kubernetes Development

### Local Kubernetes (minikube)

```bash
# Start minikube
minikube start --cpus=4 --memory=8192

# Enable ingress
minikube addons enable ingress

# Deploy services
kubectl apply -f infra/kubernetes/dev/

# Get service URL
minikube service api --url
```

## Common Tasks

### Creating a Patient (FHIR)

```bash
curl -X POST http://localhost:8080/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resourceType": "Patient",
    "identifier": [{
      "system": "http://hospital.example.org/patients",
      "value": "12345"
    }],
    "name": [{
      "family": "Smith",
      "given": ["John"]
    }],
    "birthDate": "1990-01-15",
    "gender": "male"
  }'
```

### Searching Patients

```bash
# Search by name
curl "http://localhost:8080/fhir/r4/Patient?name=Smith" \
  -H "Authorization: Bearer $TOKEN"

# Search by identifier
curl "http://localhost:8080/fhir/r4/Patient?identifier=12345" \
  -H "Authorization: Bearer $TOKEN"
```

### Running Database Migrations

```bash
# Create a new migration
pnpm db:migrate:create --name=add_new_table

# Run pending migrations
pnpm db:migrate

# Rollback last migration
pnpm db:migrate:rollback

# Reset database (caution!)
pnpm db:reset
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps db

# Check connection
psql $DATABASE_URL -c "SELECT 1"

# View logs
docker-compose logs db
```

### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -u $REDIS_URL ping
```

### Build Errors

```bash
# Clear caches
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

## Next Steps

1. **Explore the API**: Review [API Reference](./API_REFERENCE.md)
2. **Understand FHIR**: Read [FHIR Implementation](../fhir/README.md)
3. **Configure for Your Country**: See [Regional Configurations](../regions/README.md)
4. **Set Up Adapters**: Follow [Adapter Framework](../adapters/README.md)
5. **Deploy to Production**: Use [Deployment Guide](./DEPLOYMENT.md)

## Support

- **Issues**: [GitHub Issues](https://github.com/global-healthcare/platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/global-healthcare/platform/discussions)
- **Security**: security@global-healthcare.io
