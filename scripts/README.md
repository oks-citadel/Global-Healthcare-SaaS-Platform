# Deployment Scripts Documentation

This directory contains all deployment and infrastructure management scripts for the UnifiedHealth Platform.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Scripts](#scripts)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

The deployment infrastructure uses:
- **Azure Kubernetes Service (AKS)** for container orchestration
- **Azure Container Registry (ACR)** for Docker images
- **Azure PostgreSQL Flexible Server** for the database
- **Azure Redis Cache** for caching
- **Azure Key Vault** for secrets management
- **Azure Blob Storage** for backups

## Prerequisites

Before running these scripts, ensure you have:

1. **Azure CLI** installed and configured
   ```bash
   az --version
   az login
   ```

2. **kubectl** installed
   ```bash
   kubectl version --client
   ```

3. **Docker** installed
   ```bash
   docker --version
   ```

4. **PostgreSQL client tools** (for backup/restore)
   ```bash
   psql --version
   pg_dump --version
   pg_restore --version
   ```

5. **jq** (for JSON processing)
   ```bash
   jq --version
   ```

6. **Required Azure permissions**:
   - Contributor role on the subscription
   - Ability to create resource groups and resources
   - Ability to assign roles

## Scripts

### Docker Scripts

#### `docker-build.sh` / `docker-build.bat`
Builds, tags, and pushes Docker images for all services.

**Usage (Linux/Mac):**
```bash
# Build all images
./scripts/docker-build.sh

# Build and push to registry
PUSH=true ./scripts/docker-build.sh

# Build with custom version
VERSION=2.0.0 ./scripts/docker-build.sh

# Build development images
BUILD_MODE=dev ./scripts/docker-build.sh
```

**Usage (Windows):**
```cmd
REM Build all images
scripts\docker-build.bat

REM Build and push to registry
SET PUSH=true
scripts\docker-build.bat
```

**What it builds:**
- API service (Node.js/Express with Prisma)
- Web service (Next.js)
- Mobile service (Expo - for CI only)

**Features:**
- Multi-stage builds for optimization
- Automatic Git SHA tagging
- Version tagging
- Branch-specific tags (stable/dev)
- Registry authentication (ACR or Docker Hub)
- Build caching
- Error handling

**Environment Variables:**
- `DOCKER_REGISTRY` - Registry URL (default: unifiedhealth.azurecr.io)
- `VERSION` - Version tag (default: 1.0.0)
- `BUILD_MODE` - Build mode: prod or dev (default: prod)
- `PUSH` - Push to registry (default: false)
- `DOCKER_USERNAME` / `DOCKER_PASSWORD` - Docker Hub credentials
- `ACR_SERVICE_PRINCIPAL_ID` / `ACR_SERVICE_PRINCIPAL_PASSWORD` - Azure ACR credentials

#### `docker-health-check.sh` / `docker-health-check.bat`
Verifies that all Docker services are healthy and ready.

**Usage (Linux/Mac):**
```bash
# Check default compose file
./scripts/docker-health-check.sh

# Check production compose file
./scripts/docker-health-check.sh -f docker-compose.prod.yml

# Custom configuration
MAX_RETRIES=60 RETRY_INTERVAL=5 ./scripts/docker-health-check.sh

# With options
./scripts/docker-health-check.sh --file docker-compose.prod.yml --retries 60 --interval 5
```

**Usage (Windows):**
```cmd
REM Check default compose file
scripts\docker-health-check.bat

REM Check production compose file
SET COMPOSE_FILE=docker-compose.prod.yml
scripts\docker-health-check.bat
```

**Health Checks Performed:**
1. Container running status
2. PostgreSQL database connectivity
3. Redis connectivity
4. API HTTP endpoint (/health)
5. Web HTTP endpoint (/api/health)

**Features:**
- Configurable retries and intervals
- Detailed status output
- Shows logs on failure
- Exit codes for CI/CD (0=success, 1=failure)
- Timeout handling

**Environment Variables:**
- `COMPOSE_FILE` - Docker Compose file (default: docker-compose.yml)
- `MAX_RETRIES` - Maximum retry attempts (default: 30)
- `RETRY_INTERVAL` - Seconds between retries (default: 10)

**Exit Codes:**
- `0` - All services healthy
- `1` - One or more services unhealthy or errors occurred

### Infrastructure Setup

#### `setup-azure.sh`
Creates all required Azure infrastructure for an environment.

**Usage:**
```bash
./scripts/setup-azure.sh [environment]
```

**What it creates:**
- Resource Group
- Virtual Network with subnets
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS) cluster
- PostgreSQL Flexible Server
- Redis Cache
- Key Vault
- Storage Account with containers
- Network Security Group
- Log Analytics Workspace
- Application Insights

**Example:**
```bash
# Setup staging environment
./scripts/setup-azure.sh staging

# Setup production environment
./scripts/setup-azure.sh production
```

**Environment Variables:**
- `LOCATION` - Azure region (default: eastus)
- `AKS_NODE_COUNT` - Number of AKS nodes (default: 3)
- `AKS_NODE_SIZE` - VM size for nodes (default: Standard_D4s_v3)
- `SKIP_CONFIRMATION` - Skip confirmation prompt (default: false)

#### `setup-secrets.sh`
Creates Kubernetes secrets from Azure Key Vault.

**Usage:**
```bash
./scripts/setup-secrets.sh [environment]
```

**What it does:**
- Generates random secrets (JWT, encryption keys, etc.)
- Stores secrets in Azure Key Vault
- Creates Kubernetes secrets
- Creates ConfigMaps
- Sets up Azure Key Vault CSI driver

**Example:**
```bash
./scripts/setup-secrets.sh staging
```

**Environment Variables:**
- `ROTATE_SECRETS` - Rotate existing secrets (default: false)

### Deployment Scripts

#### `deploy-staging.sh`
Deploys the application to staging environment.

**Usage:**
```bash
./scripts/deploy-staging.sh
```

**What it does:**
1. Builds Docker images
2. Pushes images to ACR
3. Applies Kubernetes configurations
4. Runs database migrations
5. Waits for deployment rollout
6. Verifies deployment health
7. Runs smoke tests

**Environment Variables:**
- `ACR_NAME` - Azure Container Registry name
- `AKS_CLUSTER` - AKS cluster name
- `RESOURCE_GROUP` - Azure resource group
- `VERSION` - Version tag (default: git short SHA)

#### `deploy-production.sh`
Deploys the application to production using blue-green deployment.

**Usage:**
```bash
./scripts/deploy-production.sh
```

**What it does:**
1. Validates prerequisites and branch
2. Builds and pushes Docker images
3. Creates database backup
4. Determines current/new deployment colors
5. Runs database migrations
6. Deploys to new color (green/blue)
7. Verifies new deployment
8. Switches traffic to new deployment
9. Monitors for issues
10. Scales down old deployment
11. Rolls back on failure

**Features:**
- Blue-green deployment for zero-downtime
- Automatic rollback on failure
- Database backup before deployment
- Traffic switching validation
- Health monitoring

**Environment Variables:**
- `SKIP_CONFIRMATION` - Skip confirmation prompt (default: false)
- All variables from `deploy-staging.sh`

### Rollback Script

#### `rollback.sh`
Performs a quick rollback to a previous version.

**Usage:**
```bash
./scripts/rollback.sh [environment] [version]
```

**What it does:**
1. Lists available versions
2. Confirms rollback action
3. Rolls back Kubernetes deployment
4. Optionally rolls back database
5. Verifies rollback success
6. Runs health checks

**Examples:**
```bash
# Rollback to previous version
./scripts/rollback.sh production

# Rollback to specific version
./scripts/rollback.sh production v1.2.3

# Rollback with database restore
ROLLBACK_DATABASE=true DB_BACKUP_NAME=backup-20240101-120000 ./scripts/rollback.sh production
```

**Environment Variables:**
- `ROLLBACK_DATABASE` - Also rollback database (default: false)
- `DB_BACKUP_NAME` - Backup to restore (required if ROLLBACK_DATABASE=true)
- `SKIP_CONFIRMATION` - Skip confirmation prompt (default: false)

### Database Scripts

#### `db-backup.sh`
Creates a backup of the PostgreSQL database.

**Usage:**
```bash
./scripts/db-backup.sh [environment]
```

**What it does:**
1. Connects to PostgreSQL server
2. Backs up main database (unified_health)
3. Backs up FHIR database (hapi_fhir)
4. Backs up schema
5. Creates backup metadata
6. Compresses backup
7. Uploads to Azure Blob Storage
8. Verifies backup
9. Applies retention policy
10. Cleans up local files

**Example:**
```bash
./scripts/db-backup.sh production
```

**Environment Variables:**
- `BACKUP_RETENTION_DAYS` - Days to keep backups (default: 30)

#### `db-restore.sh`
Restores the database from a backup.

**Usage:**
```bash
./scripts/db-restore.sh [backup_name] [environment]
```

**What it does:**
1. Lists available backups
2. Downloads backup from Azure
3. Verifies backup integrity
4. Creates pre-restore backup
5. Drops and recreates databases
6. Restores from backup
7. Verifies restore
8. Restarts application

**Examples:**
```bash
# Interactive mode (lists backups)
./scripts/db-restore.sh

# Restore specific backup
./scripts/db-restore.sh backup-production-20240101-120000 production

# Point-in-time recovery
PITR_TARGET_TIME="2024-01-01T12:00:00Z" ./scripts/db-restore.sh production
```

**Environment Variables:**
- `SKIP_CONFIRMATION` - Skip confirmation prompt (default: false)
- `PITR_TARGET_TIME` - Point-in-time recovery timestamp

## Usage

### Initial Setup

1. **Create Azure infrastructure:**
   ```bash
   ./scripts/setup-azure.sh staging
   ./scripts/setup-azure.sh production
   ```

2. **Setup secrets:**
   ```bash
   ./scripts/setup-secrets.sh staging
   ./scripts/setup-secrets.sh production
   ```

3. **Get AKS credentials:**
   ```bash
   az aks get-credentials --resource-group unified-health-rg-staging --name unified-health-aks-staging
   ```

### Regular Deployment

**Staging:**
```bash
# Automatic on push to main via GitHub Actions
# Or manually:
./scripts/deploy-staging.sh
```

**Production:**
```bash
# Via GitHub Actions (recommended):
# 1. Go to Actions tab
# 2. Select "Deploy to Production"
# 3. Click "Run workflow"
# 4. Enter version tag

# Or manually:
./scripts/deploy-production.sh
```

### Backup and Restore

**Create backup:**
```bash
# Staging
./scripts/db-backup.sh staging

# Production
./scripts/db-backup.sh production
```

**Restore backup:**
```bash
# List available backups first
./scripts/db-restore.sh

# Restore specific backup
./scripts/db-restore.sh backup-production-20240101-120000 production
```

### Rollback

**Rollback deployment:**
```bash
# To previous version
./scripts/rollback.sh production

# To specific version
./scripts/rollback.sh production v1.2.3

# With database rollback
ROLLBACK_DATABASE=true DB_BACKUP_NAME=backup-20240101-120000 ./scripts/rollback.sh production
```

## Environment Variables

### Common Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name (staging/production) | staging |
| `LOCATION` | Azure region | eastus |
| `ACR_NAME` | Azure Container Registry name | unifiedhealthacr |
| `RESOURCE_GROUP` | Azure resource group | unified-health-rg-{env} |
| `AKS_CLUSTER` | AKS cluster name | unified-health-aks-{env} |
| `SKIP_CONFIRMATION` | Skip confirmation prompts | false |

### Deployment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VERSION` | Version tag | git short SHA |
| `IMAGE_TAG` | Docker image tag | {version}-{timestamp} |

### Database Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKUP_RETENTION_DAYS` | Backup retention period | 30 |
| `ROLLBACK_DATABASE` | Enable database rollback | false |
| `DB_BACKUP_NAME` | Backup to restore | - |
| `PITR_TARGET_TIME` | Point-in-time recovery time | - |

### Notification Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | - |
| `NOTIFICATION_EMAIL` | Email for notifications | - |

## Troubleshooting

### Common Issues

#### 1. Azure Login Failed

**Error:** `Not logged in to Azure`

**Solution:**
```bash
az login
az account show
```

#### 2. AKS Access Denied

**Error:** `Failed to get AKS credentials`

**Solution:**
```bash
# Check your permissions
az role assignment list --assignee $(az account show --query user.name -o tsv)

# Get credentials again
az aks get-credentials --resource-group unified-health-rg-staging --name unified-health-aks-staging --overwrite-existing
```

#### 3. Docker Build Failed

**Error:** `Failed to build Docker image`

**Solution:**
```bash
# Check Docker is running
docker ps

# Check Dockerfile syntax
docker build --no-cache -t test -f services/api/Dockerfile services/api

# Check disk space
df -h
```

#### 4. Database Migration Failed

**Error:** `Database migration failed`

**Solution:**
```bash
# Check database connectivity
kubectl exec -it -n unified-health-staging $(kubectl get pod -n unified-health-staging -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}') -- env | grep DATABASE_URL

# Check migration logs
kubectl logs -n unified-health-staging job/db-migration-xxxxx

# Manually run migrations
cd services/api
pnpm db:migrate:deploy
```

#### 5. Pod Not Ready

**Error:** `No pods are running`

**Solution:**
```bash
# Check pod status
kubectl get pods -n unified-health-staging

# Describe pod
kubectl describe pod <pod-name> -n unified-health-staging

# Check logs
kubectl logs <pod-name> -n unified-health-staging

# Check events
kubectl get events -n unified-health-staging --sort-by='.lastTimestamp'
```

#### 6. Secret Not Found

**Error:** `Failed to get secret from Key Vault`

**Solution:**
```bash
# Check Key Vault access
az keyvault secret list --vault-name unified-health-kv-staging

# Grant access to your user
az keyvault set-policy --name unified-health-kv-staging --upn $(az account show --query user.name -o tsv) --secret-permissions get list set

# Check AKS identity has access
AKS_IDENTITY=$(az aks show --name unified-health-aks-staging --resource-group unified-health-rg-staging --query identityProfile.kubeletidentity.clientId -o tsv)
az role assignment create --assignee $AKS_IDENTITY --role "Key Vault Secrets User" --scope $(az keyvault show --name unified-health-kv-staging --query id -o tsv)
```

### Debug Mode

To enable debug mode for any script, add `-x` to the bash shebang or run with `bash -x`:

```bash
bash -x ./scripts/deploy-staging.sh
```

### Getting Help

Each script has a help message. Run without arguments or with `--help`:

```bash
./scripts/deploy-staging.sh --help
```

## Best Practices

1. **Always test in staging first** before deploying to production
2. **Create backups** before major changes or deployments
3. **Use blue-green deployment** for production (built-in)
4. **Monitor deployments** for at least 5-10 minutes after switching traffic
5. **Keep rollback plan ready** - know your last good backup name
6. **Use version tags** for production deployments
7. **Review changes** in staging before promoting to production
8. **Check logs** regularly for any issues
9. **Rotate secrets** periodically
10. **Test rollback procedures** in staging

## Security Considerations

1. **Never commit secrets** to the repository
2. **Use Azure Key Vault** for all sensitive data
3. **Rotate secrets** every 90 days
4. **Use managed identities** for Azure resource access
5. **Enable RBAC** on AKS clusters
6. **Use network policies** to restrict pod communication
7. **Scan Docker images** for vulnerabilities
8. **Use private endpoints** for Azure services
9. **Enable audit logging** for all operations
10. **Restrict access** to production environments

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review deployment logs
- Contact the DevOps team
- Check Azure Portal for resource status
