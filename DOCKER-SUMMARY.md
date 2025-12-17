# Docker Configuration Summary

## Overview

This document provides a summary of all Docker configurations created for the UnifiedHealth Platform production deployment.

## Files Created

### 1. Dockerfiles

#### services/api/Dockerfile (Optimized)
- **Location**: `services/api/Dockerfile`
- **Type**: Multi-stage build (3 stages: deps, builder, production)
- **Base Image**: node:20-alpine
- **Features**:
  - Optimized layer caching with separate dependency stage
  - Production dependencies only in final image
  - Non-root user (nodejs:1001)
  - dumb-init for proper signal handling (graceful shutdown)
  - Prisma client generation
  - Health check on `/health` endpoint
  - Security updates and minimal packages
  - LABEL metadata for version tracking
- **Size**: ~150MB (production)
- **Ports**: 8080
- **Health Check**: Every 30s, timeout 5s, start period 10s

#### apps/web/Dockerfile (Next.js)
- **Location**: `apps/web/Dockerfile`
- **Type**: Multi-stage build (3 stages: deps, builder, production)
- **Base Image**: node:20-alpine
- **Features**:
  - Next.js standalone output mode (minimal size)
  - Optimized for production deployment
  - Static assets properly copied
  - Non-root user (nodejs:1001)
  - dumb-init for signal handling
  - Health check on `/api/health` endpoint
  - Telemetry disabled
- **Size**: ~120MB (production)
- **Ports**: 3000
- **Health Check**: Every 30s, timeout 5s, start period 15s

#### apps/mobile/Dockerfile (CI/EAS Builds)
- **Location**: `apps/mobile/Dockerfile`
- **Type**: Multi-stage build (base, deps, builder, development)
- **Base Image**: node:20-alpine
- **Features**:
  - Expo CLI and EAS CLI pre-installed
  - Optimized for CI/CD pipelines
  - Build cache optimization with mount caching
  - Separate development stage for local testing
  - Non-root user (expo:1001)
  - Metro bundler ports exposed
- **Size**: ~400MB (includes build tools)
- **Ports**: 8081 (Metro), 19000-19002 (Expo)
- **Primary Use**: CI/CD builds, not for production runtime

### 2. Docker Compose Files

#### docker-compose.yml (Development - Existing)
- **Location**: `docker-compose.yml`
- **Purpose**: Local development environment
- **Services**: API, PostgreSQL, Redis, MongoDB, Elasticsearch, MinIO, HAPI FHIR
- **Features**:
  - Development database (unified_health_dev)
  - Volume mounts for source code
  - Health checks for all services
  - Simple credentials for development
  - Automatically uses docker-compose.override.yml

#### docker-compose.prod.yml (Production-like)
- **Location**: `docker-compose.prod.yml`
- **Purpose**: Production-like environment for local testing
- **Services**: API, Web, PostgreSQL, Redis, MongoDB, Elasticsearch, MinIO
- **Features**:
  - Resource limits (CPU and memory)
  - Production database (unified_health_prod)
  - Password-protected services
  - Enhanced security settings
  - Log rotation (10MB max, 3 files)
  - Optimized performance settings
  - Health checks with longer timeouts
  - Custom network with subnet
  - Persistent volumes with local driver

#### docker-compose.override.yml (Development Overrides)
- **Location**: `docker-compose.override.yml`
- **Purpose**: Development-specific overrides (auto-applied)
- **Features**:
  - Source code volume mounts for hot reload
  - Debug port exposure (9229 for Node.js)
  - Development build targets
  - Reduced resource limits
  - Additional dev tools:
    - Mailhog (email testing) - port 8025
    - Adminer (database UI) - port 8081
    - Redis Commander (Redis UI) - port 8083
  - Disabled authentication for services
  - Debug logging enabled

#### docker-compose.ci.yml (CI/CD)
- **Location**: `docker-compose.ci.yml`
- **Purpose**: Minimal configuration for CI/CD pipelines
- **Services**: API, Web, PostgreSQL, Redis, Test Runner
- **Features**:
  - Test environment configuration
  - tmpfs for faster tests (ephemeral storage)
  - Fast health check intervals
  - Build cache optimization
  - Test runner service for coverage
  - No persistent volumes (ephemeral)
  - Minimal resource usage

### 3. .dockerignore Files

#### Root .dockerignore
- **Location**: `.dockerignore`
- **Purpose**: Root-level builds
- **Excludes**: node_modules, build outputs, tests, docs, IDE files, Git, CI/CD configs

#### services/api/.dockerignore
- **Location**: `services/api/.dockerignore`
- **Purpose**: API service builds
- **Excludes**: Tests, coverage, dev dependencies, environment files, documentation

#### apps/web/.dockerignore
- **Location**: `apps/web/.dockerignore`
- **Purpose**: Web app builds
- **Excludes**: .next, out, tests, coverage, Vercel configs, dev files

#### apps/mobile/.dockerignore
- **Location**: `apps/mobile/.dockerignore`
- **Purpose**: Mobile app builds
- **Excludes**: .expo, builds (.ipa/.apk), tests, native builds, Fastlane outputs

### 4. Build Scripts

#### scripts/docker-build.sh (Linux/Mac)
- **Location**: `scripts/docker-build.sh`
- **Purpose**: Build and tag Docker images
- **Features**:
  - Builds all services (API, Web, Mobile)
  - Automatic Git SHA tagging
  - Version tagging
  - Branch-specific tagging (stable, dev)
  - Push to Azure Container Registry
  - Colored output and logging
  - Error handling and validation
  - Docker availability check
  - Registry authentication (ACR or Docker Hub)
- **Usage**:
  ```bash
  ./scripts/docker-build.sh                    # Build only
  PUSH=true ./scripts/docker-build.sh          # Build and push
  VERSION=2.0.0 ./scripts/docker-build.sh      # Custom version
  ```

#### scripts/docker-build.bat (Windows)
- **Location**: `scripts/docker-build.bat`
- **Purpose**: Windows equivalent of docker-build.sh
- **Features**: Same as Linux version, adapted for Windows batch

#### scripts/docker-health-check.sh (Linux/Mac)
- **Location**: `scripts/docker-health-check.sh`
- **Purpose**: Verify all services are healthy
- **Features**:
  - Checks container running status
  - HTTP health checks for API and Web
  - Database connectivity checks
  - Redis connectivity checks
  - Configurable retries and intervals
  - Detailed logging output
  - Shows container logs on failure
  - Exit codes for CI/CD integration
- **Usage**:
  ```bash
  ./scripts/docker-health-check.sh                              # Default checks
  MAX_RETRIES=60 ./scripts/docker-health-check.sh              # Custom retries
  ./scripts/docker-health-check.sh -f docker-compose.prod.yml  # Production
  ```

#### scripts/docker-health-check.bat (Windows)
- **Location**: `scripts/docker-health-check.bat`
- **Purpose**: Windows equivalent of docker-health-check.sh
- **Features**: Same as Linux version, adapted for Windows batch

### 5. Configuration Files

#### .env.docker.example
- **Location**: `.env.docker.example`
- **Purpose**: Environment variable template for Docker
- **Contains**:
  - Database credentials
  - Redis configuration
  - MongoDB configuration
  - Elasticsearch configuration
  - MinIO configuration
  - JWT secrets
  - API URLs
  - Next.js configuration
  - Email/SMTP settings
  - Azure configuration
  - Docker registry credentials
  - Feature flags
  - Build configuration
  - Health check settings
- **Usage**: Copy to `.env` and update values

#### apps/web/src/pages/api/health.ts
- **Location**: `apps/web/src/pages/api/health.ts`
- **Purpose**: Health check endpoint for Web service
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-12-17T...",
    "uptime": 123.45,
    "service": "unifiedhealth-web",
    "version": "1.0.0",
    "environment": "production"
  }
  ```

### 6. Documentation

#### DOCKER.md
- **Location**: `DOCKER.md`
- **Purpose**: Comprehensive Docker documentation
- **Contents**:
  - Quick start guides
  - Docker file descriptions
  - Docker Compose configurations
  - Environment variables
  - Building and running services
  - Health check instructions
  - Best practices (security, performance, development, CI/CD)
  - Troubleshooting guide
  - Common issues and solutions

#### DOCKER-SUMMARY.md (This File)
- **Location**: `DOCKER-SUMMARY.md`
- **Purpose**: Quick reference for all Docker configurations

### 7. Makefile Updates

#### Updated Makefile
- **Location**: `Makefile`
- **Added Commands**:
  - `make docker-build` - Build all images using script
  - `make docker-build-api` - Build API image
  - `make docker-build-web` - Build Web image
  - `make docker-build-mobile` - Build Mobile image
  - `make docker-push` - Push images to registry
  - `make docker-up` - Start development environment
  - `make docker-down` - Stop environment
  - `make docker-logs` - View logs
  - `make docker-prod-up` - Start production environment
  - `make docker-prod-down` - Stop production environment
  - `make docker-health` - Check health
  - `make docker-restart` - Restart services
  - `make docker-clean` - Clean all resources
  - `make docker-shell-api` - Shell into API container
  - `make docker-shell-web` - Shell into Web container
  - `make docker-stats` - Show resource usage

## Quick Reference

### Common Commands

```bash
# Development
make docker-up              # Start development environment
make docker-down            # Stop development environment
make docker-logs            # View logs
make docker-health          # Check health

# Production
make docker-prod-up         # Start production-like environment
make docker-prod-down       # Stop production environment

# Building
make docker-build           # Build all images
PUSH=true make docker-push  # Build and push to registry

# Maintenance
make docker-restart         # Restart services
make docker-clean           # Clean all resources

# Database
make db-migrate             # Run migrations
make db-seed                # Seed database
make db-studio              # Open Prisma Studio
```

### Service URLs (Development)

- **API**: http://localhost:8080
- **API Health**: http://localhost:8080/health
- **Web**: http://localhost:3000
- **Web Health**: http://localhost:3000/api/health
- **Adminer**: http://localhost:8081
- **Redis Commander**: http://localhost:8083
- **Mailhog**: http://localhost:8025
- **Elasticsearch**: http://localhost:9200
- **MinIO Console**: http://localhost:9001

### Image Tags

All images are tagged with:
- Git SHA: `unifiedhealth/api:abc1234`
- Version: `unifiedhealth/api:1.0.0`
- Latest: `unifiedhealth/api:latest`
- Branch: `unifiedhealth/api:stable` (main/master) or `unifiedhealth/api:dev` (develop)

### Resource Requirements

#### Development
- **Minimum**: 8GB RAM, 4 CPU cores, 20GB disk
- **Recommended**: 16GB RAM, 8 CPU cores, 50GB disk

#### Production
- **API**: 512MB-2GB RAM, 0.5-2 CPUs
- **Web**: 256MB-1GB RAM, 0.25-1 CPUs
- **PostgreSQL**: 512MB-2GB RAM, 0.5-2 CPUs
- **Redis**: 256MB-768MB RAM, 0.25-1 CPUs
- **Elasticsearch**: 1GB-2GB RAM, 1-2 CPUs

## Best Practices Implemented

### Security
- Non-root users in all containers
- dumb-init for proper signal handling
- Security updates in base images
- Minimal attack surface (Alpine Linux)
- No secrets in images
- Health checks for all services

### Performance
- Multi-stage builds for minimal image sizes
- Layer caching optimization
- Production dependencies only
- Optimized Dockerfile ordering
- Resource limits in production

### Development
- Hot reload with volume mounts
- Debug ports exposed
- Development tools included
- Override files for customization

### CI/CD
- Build scripts with error handling
- Health check scripts for verification
- CI-optimized compose file
- Image tagging strategy
- Registry push automation

## Next Steps

1. **Development Setup**:
   ```bash
   cp .env.docker.example .env
   make docker-up
   make docker-health
   ```

2. **Production Build**:
   ```bash
   # Set environment variables
   export DOCKER_REGISTRY=unifiedhealth.azurecr.io
   export ACR_SERVICE_PRINCIPAL_ID=your_id
   export ACR_SERVICE_PRINCIPAL_PASSWORD=your_password

   # Build and push
   PUSH=true make docker-push
   ```

3. **CI/CD Integration**:
   - Use `docker-compose.ci.yml` for testing
   - Use `scripts/docker-build.sh` in build pipeline
   - Use `scripts/docker-health-check.sh` for verification
   - Tag images with git SHA for traceability

4. **Monitoring**:
   - Implement health check endpoints in all services
   - Set up log aggregation (ELK/Azure Monitor)
   - Configure resource monitoring
   - Set up alerts for container health

## Troubleshooting

See `DOCKER.md` for detailed troubleshooting guide including:
- Port conflicts
- Container restart loops
- Disk space issues
- Permission errors
- Database connection issues
- Performance optimization

## Support

For issues or questions:
1. Check `DOCKER.md` documentation
2. Review container logs: `make docker-logs`
3. Check health status: `make docker-health`
4. Contact DevOps team
5. Create an issue in the repository

## Version History

- **v1.0.0** (2025-12-17): Initial Docker configuration
  - Optimized Dockerfiles for all services
  - Production and development compose files
  - Build and health check scripts
  - Comprehensive documentation
