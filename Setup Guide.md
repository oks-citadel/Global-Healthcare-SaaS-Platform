# UnifiedHealth Global Platform
## Setup & Deployment Guide

**Document Version:** 1.0  
**Classification:** Technical - Internal  
**Owner:** Platform Engineering  
**Last Updated:** December 2024

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Local Development](#3-local-development)
4. [Infrastructure Deployment](#4-infrastructure-deployment)
5. [Service Configuration](#5-service-configuration)
6. [Database Setup](#6-database-setup)
7. [External Integrations](#7-external-integrations)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Security Configuration](#9-security-configuration)
10. [Production Deployment](#10-production-deployment)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

### 1.1 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 4 cores | 8+ cores |
| **RAM** | 16 GB | 32+ GB |
| **Storage** | 100 GB SSD | 500+ GB NVMe SSD |
| **OS** | macOS 12+, Ubuntu 22.04+, Windows 11 (WSL2) | macOS 14+, Ubuntu 24.04 |

### 1.2 Required Software

```bash
# Node.js (v20 LTS or later)
node --version  # Should be >= 20.0.0

# Package Manager (pnpm recommended)
pnpm --version  # Should be >= 8.0.0

# Python (3.11 or later)
python3 --version  # Should be >= 3.11.0

# Docker & Docker Compose
docker --version  # Should be >= 24.0.0
docker compose version  # Should be >= 2.20.0

# Kubernetes CLI
kubectl version --client  # Should be >= 1.28.0

# Terraform
terraform --version  # Should be >= 1.6.0

# Git
git --version  # Should be >= 2.40.0
```

### 1.3 Cloud Provider CLIs (for deployment)

```bash
# AWS CLI
aws --version  # Should be >= 2.13.0

# Azure CLI
az --version  # Should be >= 2.53.0

# Google Cloud SDK
gcloud --version  # Should be >= 450.0.0
```

### 1.4 Installation Scripts

**macOS (using Homebrew):**
```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install node@20 pnpm python@3.11 docker docker-compose kubectl terraform git

# Install cloud CLIs
brew install awscli azure-cli google-cloud-sdk

# Start Docker Desktop
open -a Docker
```

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

---

## 2. Development Environment Setup

### 2.1 Clone Repository

```bash
# Clone the main repository
git clone https://github.com/unified-health/platform.git
cd platform

# Initialize submodules (if any)
git submodule update --init --recursive
```

### 2.2 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Essential Environment Variables (.env):**

```env
# ============================================
# ENVIRONMENT CONFIGURATION
# ============================================
NODE_ENV=development
LOG_LEVEL=debug

# ============================================
# DATABASE CONFIGURATION
# ============================================
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=unified_health
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=unified_health_dev

# MongoDB
MONGODB_URI=mongodb://localhost:27017/unified_health_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# ============================================
# AUTHENTICATION
# ============================================
# Auth0/Okta Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://api.unifiedhealth.io

# JWT Configuration
JWT_SECRET=your_jwt_secret_minimum_32_characters
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# ============================================
# EXTERNAL SERVICES
# ============================================
# Twilio (Video/SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid (Email)
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# ============================================
# AI/ML SERVICES
# ============================================
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional

# ============================================
# FHIR SERVER
# ============================================
FHIR_SERVER_URL=http://localhost:8082/fhir
FHIR_SERVER_VERSION=R4

# ============================================
# STORAGE
# ============================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=unified-health-dev-storage

# ============================================
# ENCRYPTION
# ============================================
ENCRYPTION_KEY=your_32_byte_encryption_key_here
DATA_ENCRYPTION_AT_REST=true
```

### 2.3 Install Dependencies

```bash
# Install all workspace dependencies
pnpm install

# Install Python dependencies for AI services
cd services/ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..

# Install Go dependencies (for high-performance services)
cd services/device-service
go mod download
cd ../..
```

---

## 3. Local Development

### 3.1 Start Development Infrastructure

```bash
# Start all required databases and services
docker compose -f docker-compose.dev.yml up -d

# Verify all containers are running
docker compose ps
```

**docker-compose.dev.yml** includes:
- PostgreSQL 15
- MongoDB 7
- Redis 7
- Elasticsearch 8
- Kafka (with Zookeeper)
- HAPI FHIR Server
- MinIO (S3-compatible storage)

### 3.2 Database Migrations

```bash
# Run PostgreSQL migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Generate Prisma client
pnpm db:generate
```

### 3.3 Start Development Servers

**Option 1: Start All Services (Recommended for first-time setup)**
```bash
# Start all services concurrently
pnpm dev
```

**Option 2: Start Specific Services**
```bash
# Terminal 1: API Gateway
cd apps/api-gateway && pnpm dev

# Terminal 2: Web Application
cd apps/web && pnpm dev

# Terminal 3: Backend Services
pnpm dev:services

# Terminal 4: AI Service
cd services/ai-service && python main.py
```

### 3.4 Access Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Patient Portal |
| Provider Portal | http://localhost:3001 | Healthcare Provider Interface |
| Admin Dashboard | http://localhost:3002 | Administration |
| API Gateway | http://localhost:8080 | REST/GraphQL API |
| API Docs | http://localhost:8080/docs | OpenAPI/Swagger |
| GraphQL Playground | http://localhost:8080/graphql | GraphQL IDE |
| FHIR Server | http://localhost:8082/fhir | HAPI FHIR |
| Kibana | http://localhost:5601 | Elasticsearch UI |
| MinIO Console | http://localhost:9001 | Object Storage UI |

### 3.5 Development Commands

```bash
# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e

# Format code
pnpm format

# Build all packages
pnpm build

# Clean build artifacts
pnpm clean
```

---

## 4. Infrastructure Deployment

### 4.1 Terraform Setup

```bash
# Navigate to infrastructure directory
cd infrastructure/terraform

# Initialize Terraform (first time only)
terraform init

# Select workspace based on environment
terraform workspace new dev     # For development
terraform workspace new staging # For staging
terraform workspace new prod    # For production

terraform workspace select dev
```

### 4.2 Cloud Provider Configuration

**AWS Configuration:**
```bash
# Configure AWS credentials
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_DEFAULT_REGION="us-east-1"
```

**Azure Configuration:**
```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "your-subscription-id"
```

**GCP Configuration:**
```bash
# Login to GCP
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project your-project-id
```

### 4.3 Infrastructure Deployment

```bash
# Review infrastructure plan
terraform plan -var-file=environments/dev.tfvars

# Apply infrastructure changes
terraform apply -var-file=environments/dev.tfvars

# Output important values
terraform output
```

**Key Infrastructure Components Created:**
- VPC/Network configuration
- Kubernetes cluster (EKS/AKS/GKE)
- PostgreSQL RDS/Cloud SQL
- Redis ElastiCache/MemoryStore
- S3/Blob Storage buckets
- CloudFront/CDN distribution
- Load balancers
- Security groups/Firewall rules
- IAM roles and policies

---

## 5. Service Configuration

### 5.1 Kubernetes Configuration

```bash
# Configure kubectl to use the deployed cluster
aws eks update-kubeconfig --name unified-health-dev --region us-east-1
# OR
az aks get-credentials --resource-group unified-health-rg --name unified-health-dev
# OR
gcloud container clusters get-credentials unified-health-dev --region us-central1

# Verify connection
kubectl get nodes
```

### 5.2 Deploy Kubernetes Resources

```bash
# Navigate to kubernetes manifests
cd infrastructure/kubernetes

# Create namespace
kubectl apply -f namespaces/

# Deploy secrets (use sealed-secrets or external-secrets in production)
kubectl apply -f secrets/

# Deploy config maps
kubectl apply -f configmaps/

# Deploy services
kubectl apply -f services/

# Deploy ingress
kubectl apply -f ingress/
```

### 5.3 ArgoCD GitOps Setup (Production)

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Configure application
kubectl apply -f argocd/applications/
```

---

## 6. Database Setup

### 6.1 PostgreSQL Setup

```bash
# Connect to PostgreSQL
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB

# Run initial schema
\i scripts/sql/schema.sql

# Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 6.2 MongoDB Setup

```bash
# Connect to MongoDB
mongosh $MONGODB_URI

# Create indexes
use unified_health_dev
db.healthRecords.createIndex({ "patientId": 1, "type": 1 })
db.healthRecords.createIndex({ "lastUpdated": -1 })
db.messages.createIndex({ "conversationId": 1, "timestamp": -1 })
```

### 6.3 Elasticsearch Setup

```bash
# Create index templates
curl -X PUT "localhost:9200/_index_template/patients" \
  -H "Content-Type: application/json" \
  -d @scripts/elasticsearch/patient-template.json

curl -X PUT "localhost:9200/_index_template/providers" \
  -H "Content-Type: application/json" \
  -d @scripts/elasticsearch/provider-template.json
```

### 6.4 Redis Configuration

```bash
# Connect to Redis
redis-cli -h $REDIS_HOST -p $REDIS_PORT

# Verify connection
PING
# Response: PONG

# Configure memory policy (production)
CONFIG SET maxmemory-policy allkeys-lru
```

---

## 7. External Integrations

### 7.1 Authentication Provider (Auth0)

1. Create Auth0 tenant at https://auth0.com
2. Configure Application:
   - **Application Type:** Regular Web Application
   - **Allowed Callback URLs:** `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
3. Configure API:
   - **Identifier:** `https://api.unifiedhealth.io`
   - **Signing Algorithm:** RS256
4. Update `.env` with credentials

### 7.2 Payment Integration (Stripe)

```bash
# Install Stripe CLI for local testing
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8080/webhooks/stripe
```

### 7.3 Communication Services (Twilio)

1. Create Twilio account at https://www.twilio.com
2. Enable Programmable Video
3. Create API Key and Secret
4. Configure TwiML apps for voice
5. Update `.env` with credentials

### 7.4 FHIR Integration

```bash
# Start HAPI FHIR server
docker run -p 8082:8080 hapiproject/hapi:latest

# Verify FHIR server
curl http://localhost:8082/fhir/metadata
```

---

## 8. Monitoring & Observability

### 8.1 Deploy Monitoring Stack

```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Deploy Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f infrastructure/monitoring/prometheus-values.yaml

# Deploy Loki for logs
helm install loki grafana/loki-stack \
  -n monitoring \
  -f infrastructure/monitoring/loki-values.yaml
```

### 8.2 Access Monitoring Dashboards

```bash
# Port forward Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Get Grafana password
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d
```

### 8.3 Configure Alerts

```bash
# Apply alerting rules
kubectl apply -f infrastructure/monitoring/alerting-rules.yaml

# Configure PagerDuty/Slack integration
kubectl apply -f infrastructure/monitoring/alert-manager-config.yaml
```

---

## 9. Security Configuration

### 9.1 SSL/TLS Certificates

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Configure Let's Encrypt issuer
kubectl apply -f infrastructure/security/letsencrypt-issuer.yaml

# Apply certificate
kubectl apply -f infrastructure/security/certificates.yaml
```

### 9.2 Secrets Management

```bash
# Install Sealed Secrets (for GitOps)
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Seal a secret
kubeseal --format yaml < secret.yaml > sealed-secret.yaml

# Or use HashiCorp Vault
helm install vault hashicorp/vault -n vault --create-namespace
```

### 9.3 Network Policies

```bash
# Apply network policies
kubectl apply -f infrastructure/security/network-policies/

# Verify policies
kubectl get networkpolicies -A
```

---

## 10. Production Deployment

### 10.1 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] SSL certificates provisioned
- [ ] Database backups configured
- [ ] Monitoring and alerting enabled
- [ ] Security scan completed
- [ ] Load testing completed
- [ ] Disaster recovery plan documented
- [ ] Compliance audit completed (HIPAA, GDPR)

### 10.2 Production Deployment Steps

```bash
# Switch to production workspace
terraform workspace select prod

# Plan production deployment
terraform plan -var-file=environments/prod.tfvars -out=prod.plan

# Review plan carefully, then apply
terraform apply prod.plan

# Deploy applications via ArgoCD
# (Automatic via GitOps on merge to main branch)
```

### 10.3 Post-Deployment Verification

```bash
# Run smoke tests
pnpm test:smoke --env=production

# Verify health endpoints
curl https://api.unifiedhealth.io/health

# Check all pods are running
kubectl get pods -n unified-health

# Verify database connections
kubectl exec -it deployment/api-gateway -- npm run db:health
```

---

## 11. Troubleshooting

### 11.1 Common Issues

**Issue: Database Connection Failed**
```bash
# Check database is running
docker compose ps postgres

# Check connection from container
docker compose exec api-gateway nc -zv postgres 5432

# Reset database
docker compose down -v
docker compose up -d postgres
pnpm db:migrate
```

**Issue: Node Modules Issues**
```bash
# Clear node modules and reinstall
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: Docker Out of Space**
```bash
# Clean Docker resources
docker system prune -a
docker volume prune
```

**Issue: Kubernetes Pod CrashLoopBackOff**
```bash
# Check pod logs
kubectl logs -f deployment/service-name --tail=100

# Describe pod for events
kubectl describe pod pod-name

# Check resource limits
kubectl top pods
```

### 11.2 Useful Commands

```bash
# View all logs
pnpm logs

# Reset development environment
pnpm dev:reset

# Check service health
pnpm health:check

# Generate API client
pnpm api:generate

# Update dependencies
pnpm update:deps
```

### 11.3 Getting Help

- **Internal Wiki:** https://wiki.unifiedhealth.io
- **Slack Channel:** #platform-support
- **On-Call:** PagerDuty escalation
- **Documentation:** https://docs.unifiedhealth.io

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Owner: Platform Engineering*
