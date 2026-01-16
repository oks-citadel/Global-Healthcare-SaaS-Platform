# Docker Configuration Guide

This document provides comprehensive information about the Docker setup for the UnifiedHealth Platform.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Files](#docker-files)
- [Docker Compose Files](#docker-compose-files)
- [Environment Variables](#environment-variables)
- [Building Images](#building-images)
- [Running Services](#running-services)
- [Health Checks](#health-checks)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The UnifiedHealth Platform uses Docker for containerization with the following key features:

- Multi-stage builds for optimized image sizes
- Non-root users for enhanced security
- Health checks for all services
- Proper signal handling with dumb-init
- Layer caching optimization
- Production-ready configurations

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+
- Git (for build scripts)
- 8GB+ RAM recommended
- 20GB+ free disk space

## Quick Start

### Development Mode

Start all services in development mode with hot-reload:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production-like Mode

Start services with production configurations:

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## Docker Files

### API Service (services/api/Dockerfile)

**Key Features:**
- Three-stage build: deps, builder, production
- Node.js 20 Alpine base image
- pnpm package manager
- Prisma ORM with client generation
- Production dependencies only in final image
- Non-root nodejs user (UID 1001)
- dumb-init for signal handling
- Health check on /health endpoint

**Image Size:** ~150MB (production)

### Web Service (apps/web/Dockerfile)

**Key Features:**
- Three-stage build for Next.js
- Standalone output mode for minimal size
- Static assets optimization
- Non-root nodejs user
- Health check on /api/health endpoint

**Image Size:** ~120MB (production)

### Mobile Service (apps/mobile/Dockerfile)

**Key Features:**
- Designed for CI/EAS builds
- Expo CLI and EAS CLI pre-installed
- Build cache optimization
- Development and builder stages
- Non-root expo user

**Usage:** Primarily for CI/CD pipelines

## Docker Compose Files

### docker-compose.yml (Development)

Default configuration for local development:
- API service with volume mounts for hot reload
- PostgreSQL with persistent volume
- Redis with data persistence
- MongoDB for FHIR documents
- Elasticsearch for search
- MinIO for S3-compatible storage
- HAPI FHIR server

**Automatically uses:** `docker-compose.override.yml`

### docker-compose.override.yml (Development Overrides)

Extends `docker-compose.yml` with:
- Source code volume mounts
- Debug ports (9229 for Node.js)
- Reduced resource limits
- Additional dev tools:
  - Mailhog (email testing on port 8025)
  - Adminer (database UI on port 8081)
  - Redis Commander (Redis UI on port 8083)

### docker-compose.prod.yml (Production-like)

Production-ready configuration:
- Resource limits (CPU and memory)
- Security-hardened settings
- Password-protected services
- Health checks with proper timeouts
- Log rotation
- Optimized performance settings

## Environment Variables

### Required Variables

Create a `.env` file in the root directory:

```bash
# Database
DB_PASSWORD=secure_password_change_me

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Redis
REDIS_PASSWORD=redis_secure_password

# MongoDB
MONGO_PASSWORD=mongo_secure_password

# Elasticsearch
ELASTIC_PASSWORD=elastic_secure_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minio_secure_password

# Application
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Optional Variables

```bash
# Docker Registry (AWS ECR)
DOCKER_REGISTRY=your-aws-account-id.dkr.ecr.us-east-1.amazonaws.com
DOCKER_USERNAME=your_username
DOCKER_PASSWORD=your_password

# Build Configuration
VERSION=1.0.0
BUILD_MODE=prod
```

## Building Images

### Using the Build Script

The recommended way to build images:

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

### Manual Building

```bash
# Build API service
docker build -t unifiedhealth/api:latest \
  --target production \
  -f services/api/Dockerfile \
  services/api

# Build Web service
docker build -t unifiedhealth/web:latest \
  --target production \
  -f apps/web/Dockerfile \
  apps/web

# Build Mobile service
docker build -t unifiedhealth/mobile:latest \
  --target builder \
  -f apps/mobile/Dockerfile \
  apps/mobile
```

## Running Services

### Start All Services

```bash
# Development mode
docker-compose up -d

# Production mode
docker-compose -f docker-compose.prod.yml up -d

# With build
docker-compose up -d --build
```

### Start Specific Services

```bash
# Start only API and database
docker-compose up -d api postgres redis

# Start with dependencies
docker-compose up -d api
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop api
```

## Health Checks

### Using the Health Check Script

```bash
# Check all services
./scripts/docker-health-check.sh

# Custom configuration
MAX_RETRIES=60 RETRY_INTERVAL=5 ./scripts/docker-health-check.sh

# Check production services
./scripts/docker-health-check.sh -f docker-compose.prod.yml
```

### Manual Health Checks

```bash
# Check API health
curl http://localhost:8080/health

# Check Web health
curl http://localhost:3000/api/health

# Check container health status
docker inspect --format='{{.State.Health.Status}}' unifiedhealth-api-prod

# Check PostgreSQL
docker-compose exec postgres pg_isready -U unified_health

# Check Redis
docker-compose exec redis redis-cli ping
```

## Best Practices

### Security

1. **Never commit secrets** - Use environment variables
2. **Run as non-root user** - All services use non-root users
3. **Use security scanning** - Integrate with Trivy or Snyk
4. **Keep images updated** - Regularly update base images
5. **Minimal attack surface** - Only install necessary packages

### Performance

1. **Layer caching** - Order Dockerfile commands by change frequency
2. **Multi-stage builds** - Keep production images minimal
3. **Resource limits** - Set appropriate CPU/memory limits
4. **Volume mounts** - Use cached or delegated modes on macOS

### Development

1. **Use docker-compose.override.yml** - Don't modify docker-compose.yml
2. **Hot reload** - Volume mount source code in development
3. **Debug ports** - Expose Node.js inspector port 9229
4. **Dev tools** - Use Adminer, Redis Commander, Mailhog

### CI/CD

1. **Build script** - Use provided docker-build.sh
2. **Health checks** - Use docker-health-check.sh in pipelines
3. **Image tagging** - Tag with git SHA and version
4. **Registry** - Push to Azure Container Registry

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Stop the conflicting service or change ports
```

#### Container Keeps Restarting

```bash
# Check logs
docker-compose logs api

# Check health status
docker inspect unifiedhealth-api

# Check resource usage
docker stats
```

#### Out of Disk Space

```bash
# Clean up unused resources
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

#### Permission Denied Errors

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Fix file ownership
sudo chown -R $USER:$USER .
```

#### Database Connection Failed

```bash
# Ensure database is healthy
docker-compose exec postgres pg_isready

# Check connection string
docker-compose exec api env | grep DATABASE_URL

# Restart services
docker-compose restart api postgres
```

### Performance Issues

#### Slow Build Times

- Enable BuildKit: `export DOCKER_BUILDKIT=1`
- Use build cache: don't use `--no-cache` unless necessary
- Optimize .dockerignore files

#### High Memory Usage

- Set resource limits in docker-compose files
- Increase Docker Desktop memory allocation
- Optimize application code

### Debugging

#### Enter Running Container

```bash
# API service
docker-compose exec api sh

# With specific user
docker-compose exec -u root api sh
```

#### Inspect Container

```bash
# View container details
docker inspect unifiedhealth-api

# View environment variables
docker-compose exec api env

# View filesystem
docker-compose exec api ls -la /app
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Support

For issues or questions:
- Check existing documentation
- Review Docker logs
- Contact DevOps team
- Create an issue in the repository
