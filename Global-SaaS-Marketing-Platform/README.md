# Global SaaS Marketing Platform - Comprehensive Overview

## Project Structure & Organization

The platform uses a **monorepo architecture** with pnpm workspaces and Turborepo for build orchestration. The codebase divides into four primary directories:

- **Services layer**: 12 microservices covering SEO, content, analytics, personalization, lifecycle, growth, commerce, reputation, localization, AI, and community domains
- **Packages layer**: Shared libraries handling common utilities, types, and configurations
- **Platform & infrastructure**: Architecture specifications and IaC (Terraform, Kubernetes manifests, Helm charts)
- **Verification**: Multi-agent verification system for production deployment sign-off

## Core Principle

**Self-advertising through organic SEO, not paid advertising APIs.** This platform is designed to market itself without external integrations to Google Ads, Bing Ads, Facebook Ads, or similar paid advertising platforms.

## Environment Setup & Development

### Prerequisites

- Node.js 20 LTS
- pnpm v8+
- Docker & Docker Compose
- AWS CLI v2 (for deployment)
- kubectl & helm (for Kubernetes deployments)
- Terraform 1.6+ (for infrastructure provisioning)

### Local Development Workflow

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd Global-SaaS-Marketing-Platform
   pnpm install
   ```

2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

3. Start containerized databases using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Run Prisma migrations:
   ```bash
   pnpm db:migrate
   ```

5. Start the entire stack:
   ```bash
   pnpm dev
   ```

### Development Services

| Service | Port | Description |
|---------|------|-------------|
| SEO Service | 3001 | Sitemap generation, robots.txt, structured data |
| Content Service | 3002 | CMS, content marketing, publishing |
| Analytics Service | 3003 | Event tracking, attribution, dashboards |
| Personalization Service | 3004 | A/B testing, feature flags, recommendations |
| Lifecycle Service | 3005 | Email campaigns, drip sequences, automation |
| Growth Service | 3006 | Referrals, lead scoring, viral loops |
| Commerce Service | 3007 | Pricing, subscriptions, checkout |
| Reputation Service | 3008 | Reviews, testimonials, social proof |
| Localization Service | 3009 | i18n, translations, regional content |
| AI Service | 3010 | ML predictions, content generation |
| Community Service | 3011 | Forums, posts, social features |

## Production Deployment Pipeline

The CI/CD architecture leverages AWS services in a multi-stage workflow:

- **Source**: GitHub repository triggers pipeline on commits to main
- **Build**: CodeBuild constructs Docker images for all services
- **Registry**: Amazon ECR stores container images with version tagging
- **Orchestration**: Amazon EKS runs containerized workloads across auto-scaling clusters

### Deployment Commands

```bash
# Deploy Infrastructure
cd terraform/environments/prod
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Deploy Services via Helm
helm dependency update terraform/helm/charts/saas-marketing-platform
helm upgrade --install marketing-platform terraform/helm/charts/saas-marketing-platform \
  -f terraform/helm/values/prod.yaml \
  --namespace marketing \
  --create-namespace

# Apply Kubernetes Configurations
kubectl apply -f k8s/namespaces/namespaces.yaml
kubectl apply -f k8s/namespaces/resource-quotas.yaml
kubectl apply -f k8s/namespaces/limit-ranges.yaml
kubectl apply -f k8s/namespaces/network-policies.yaml
```

## Core Technology Stack

**Backend**: NestJS, TypeScript 5.3, Prisma ORM, PostgreSQL 15+, Redis 7+

**Search**: OpenSearch 2.11 (Elasticsearch-compatible)

**Messaging**: AWS SQS, SNS, EventBridge, Step Functions

**Data Lake**: Kinesis Firehose, AWS Glue, Athena

**Infrastructure**: Amazon EKS, AWS RDS Aurora, ElastiCache Redis, S3, CloudFront

**Observability**: CloudWatch, Prometheus (AMP), Grafana (AMG), X-Ray

## Database Architecture

The platform implements multiple data stores organized by domain:

| Database | Type | Purpose |
|----------|------|---------|
| Aurora PostgreSQL | Relational | Primary transactional data |
| DynamoDB | NoSQL | Sessions, cache, events, campaigns |
| ElastiCache Redis | Cache | Real-time caching, rate limiting |
| OpenSearch | Search | Full-text search, analytics |
| S3 Data Lake | Object Storage | Event streams, analytics data |

### DynamoDB Tables

- `sessions` - User session management with TTL
- `cache` - Application cache with auto-scaling
- `events` - Marketing events with user/campaign indexes
- `campaigns` - Campaign metadata with org index

## Microservices Communication Patterns

Services implement **event-driven architecture** via AWS SNS/SQS for asynchronous communication (campaign events, email processing, analytics) while using **synchronous HTTP calls** for immediate operations requiring responses. Each service exposes health endpoints for Kubernetes liveness/readiness probes.

## API Categories

| Category | Endpoints | Service |
|----------|-----------|---------|
| SEO & Search Visibility | 23 | seo-service |
| Content Marketing | 15 | content-service |
| Growth & Acquisition | 21 | growth-service |
| Email Marketing & Lifecycle | 42 | lifecycle-service |
| Social Media & Community | 15 | community-service |
| Analytics & Attribution | 19 | analytics-service |
| Personalization & Experimentation | 19 | personalization-service |
| Reputation & Trust | 28 | reputation-service |
| Localization & Global | 19 | localization-service |
| Commerce & Revenue | 23 | commerce-service |
| AI Marketing Intelligence | 24 | ai-service |

**Total: 248 API Endpoints**

## Terraform Modules

| Module | Description |
|--------|-------------|
| networking | VPC, subnets, NAT Gateway, VPC endpoints |
| security_baseline | KMS, WAF, Shield, CloudTrail, GuardDuty |
| eks_cluster | EKS cluster, node groups, IRSA, addons |
| edge_cloudfront | CDN distribution, cache policies |
| alb_ingress | Load balancer controller, target groups |
| databases | Aurora PostgreSQL, DynamoDB, Redis, OpenSearch |
| storage | S3 buckets, EFS |
| messaging | EventBridge, SQS, SNS, Step Functions |
| data_lake | Kinesis, Glue, Athena |
| email | SES domain, templates |
| observability | CloudWatch, AMP, AMG, X-Ray |

## Security & Compliance

Technical controls include:

- **No Static Credentials**: All AWS access via IRSA (IAM Roles for Service Accounts)
- **Encryption at Rest**: AES-256 via KMS for all data stores
- **Encryption in Transit**: TLS 1.2+ for all communications
- **WAF Protection**: AWS WAF with rate limiting and bot protection
- **Audit Logging**: CloudTrail enabled for all API calls
- **Threat Detection**: GuardDuty enabled for anomaly detection
- **Network Isolation**: VPC endpoints, security groups, network policies

## Multi-Agent Verification System

The platform includes a verification system with specialized agents:

| Agent | Checks |
|-------|--------|
| Platform Architecture Agent | VPC, subnets, EKS, IRSA |
| Kubernetes/EKS Agent | Pods, deployments, services |
| SEO & Discoverability Agent | Sitemaps, robots.txt, schema |
| Content & Publishing Agent | CMS, templates, workflows |
| Analytics & Attribution Agent | Tracking, dashboards |
| Experimentation Agent | A/B tests, feature flags |
| Lifecycle & Email Agent | Campaigns, deliverability |
| Security & Compliance Agent | Credentials, encryption, WAF |
| Cost & Reliability Agent | Resource sizing, HA |
| CI/CD Gatekeeper Agent | Pipeline validation |

### Run Verification

```bash
cd verification
npm install
npm run verify
npm run report
```

## Critical Rules

1. **No External Integrations**: No Google/Bing/Facebook Ads APIs
2. **SEO is Mandatory**: Crawlable pages, sitemaps, structured data
3. **Production Lockdown**: All changes must be reviewed
4. **Security First**: IRSA, encryption, audit logging
5. **Autonomous Operation**: Self-verify, auto-fix capabilities

## Documentation Standards & Contribution Guidelines

The repository maintains comprehensive documentation covering architecture diagrams, API specifications, and deployment procedures. Contributors must follow conventional commit conventions, pass linting and test suites before pull requests.

### Scripts

```bash
pnpm build        # Build all services
pnpm dev          # Start development servers
pnpm test         # Run test suites
pnpm lint         # Run linting
pnpm typecheck    # TypeScript type checking
pnpm format       # Format code with Prettier
pnpm db:generate  # Generate Prisma clients
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
```

## Project Status

**Version**: 1.0.0
**Status**: Production Ready
**Sign-Off**: Approved by Claude Multi-Agent Verification System

---

*This platform is part of the Unified Health ecosystem, providing comprehensive marketing automation capabilities with a focus on organic growth through SEO.*
