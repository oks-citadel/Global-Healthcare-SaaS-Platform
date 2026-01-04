# Production Kubernetes Deployment Guide

## Overview

This document describes the authoritative method for deploying the UnifiedHealth platform to production environments.

## Important Notice

**WARNING**: This folder previously contained stub deployment configurations that were NOT suitable for production use. Those files have been archived to the `archived/` subfolder. DO NOT use the archived files for production deployments.

### Archived Files (DO NOT USE)

The following files have been archived and should NOT be used:

| File | Reason Archived |
|------|-----------------|
| `archived/deployments.yaml.archived` | Stub deployments using node:20-alpine images, single replica, no security contexts |
| `archived/configmaps.yaml.archived` | Code embedded in ConfigMaps (anti-pattern), mock data instead of real services |
| `archived/services.yaml.archived` | Service definitions for stub deployments with incorrect port mappings |

These archived files were development/testing configurations that:
- Used generic `node:20-alpine` images instead of ECR container images
- Had single replicas (no high availability)
- Had minimal resources (50m CPU, 64Mi memory)
- Lacked security contexts (runAsNonRoot, readOnlyRootFilesystem)
- Mounted code via ConfigMaps instead of proper container images
- Had no service account configuration
- Had no pod anti-affinity for HA distribution

## Authoritative Deployment Configurations

### Primary Deployment Method

For production deployments, use the **deploy-production.sh** script:

```bash
./scripts/deploy-production.sh
```

This script is the **AUTHORITATIVE** method for production deployments and provides:
- Blue-green deployment strategy
- Automatic rollback on failure
- Database backup before deployment
- Database migration execution
- Health verification
- Traffic switching
- Post-deployment monitoring

### Base Service Configurations

The authoritative Kubernetes manifests are located in:

```
infrastructure/kubernetes/base/services/
  api-gateway/
    deployment.yaml    # Production-ready API gateway deployment
    service.yaml       # Service definition
    hpa.yaml          # Horizontal Pod Autoscaler
  telehealth-service/
    deployment.yaml
    service.yaml
    hpa.yaml
  mental-health-service/
    deployment.yaml
    service.yaml
    hpa.yaml
  chronic-care-service/
    deployment.yaml
    service.yaml
    hpa.yaml
  pharmacy-service/
    deployment.yaml
    service.yaml
    hpa.yaml
  laboratory-service/
    deployment.yaml
    service.yaml
    hpa.yaml
  web/
    deployment.yaml
    service.yaml
    kustomization.yaml
```

### Production Features of Base Configurations

The base service deployments include all production requirements:

| Feature | Details |
|---------|---------|
| **Container Images** | ECR images: `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/unifiedhealth/*` |
| **Replicas** | 2+ replicas per service for high availability |
| **Resource Limits** | Proper CPU/memory requests and limits (e.g., 200m-1500m CPU, 256Mi-2Gi memory) |
| **Security Context** | `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, dropped capabilities |
| **Health Probes** | Liveness, readiness, and startup probes configured |
| **Pod Anti-Affinity** | Distribution across nodes and availability zones |
| **Service Accounts** | Dedicated service accounts per service |
| **Secrets** | Integration with AWS Secrets Manager via secretKeyRef |
| **Observability** | Prometheus annotations, OpenTelemetry integration |

## Deployment Workflow

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. kubectl configured to access the EKS cluster
3. Docker installed for building images
4. Access to ECR for pushing images

### Step-by-Step Production Deployment

1. **Ensure you're on main branch or a release tag**
   ```bash
   git checkout main
   # OR
   git checkout v1.2.3
   ```

2. **Run the production deployment script**
   ```bash
   ./scripts/deploy-production.sh
   ```

3. **Monitor the deployment**
   The script will:
   - Check prerequisites
   - Request confirmation
   - Build and push Docker images to ECR
   - Create database backup
   - Run database migrations
   - Deploy to the new color (blue/green)
   - Wait for rollout completion
   - Verify health checks
   - Switch traffic
   - Monitor for issues
   - Scale down old deployment

### Alternative: Kustomize Deployment

For environment-specific deployments using Kustomize:

```bash
# Navigate to the overlay directory
cd infrastructure/kubernetes/overlays/production

# Build and apply
kustomize build . | envsubst | kubectl apply -f -

# Or use the deploy.sh script
./infrastructure/kubernetes/deploy.sh production deploy
```

## Valid Production Files in This Folder

The following files in this folder ARE valid for production use:

| File | Purpose |
|------|---------|
| `namespace.yaml` | Production namespace definition with resource quotas |
| `ingress.yaml` | Production ingress configuration |
| `README.md` | This documentation file |

## Environment Configuration

Production deployments use the following namespaces and configurations:

- **Namespace**: `unified-health-prod`
- **EKS Cluster**: `unified-health-eks-prod`
- **ECR Registry**: `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com`

## Monitoring and Observability

Production deployments include:
- Prometheus metrics scraping via annotations
- OpenTelemetry tracing to collector at `http://otel-collector:4317`
- Structured JSON logging
- Health endpoints: `/health/live`, `/health/ready`, `/health/startup`

## Rollback Procedure

If a deployment fails:

1. The deploy-production.sh script will automatically rollback
2. For manual rollback:
   ```bash
   # Switch traffic back to previous color
   kubectl patch svc unified-health-api -n unified-health-prod \
     -p '{"spec":{"selector":{"color":"<previous-color>"}}}'

   # Scale down failed deployment
   kubectl scale deployment unified-health-api-<failed-color> \
     -n unified-health-prod --replicas=0
   ```

## Related Documentation

- [Main Kubernetes README](../README.md) - Complete deployment guide
- [Architecture](../ARCHITECTURE.md) - System architecture documentation
- [Deployment Checklist](../DEPLOYMENT-CHECKLIST.md) - Pre-deployment checklist
- [Quick Reference](../QUICK-REFERENCE.md) - Command quick reference

## Changelog

### 2026-01-03
- Archived stub deployment configurations (deployments.yaml, configmaps.yaml, services.yaml)
- Created this README documenting authoritative deployment methods
- Stub files moved to `archived/` folder with `.archived` extension

## Contact

For deployment issues or questions:
- Slack: #unified-health-platform
- Email: devops@unifiedhealth.com

---

**Last Updated**: 2026-01-03
