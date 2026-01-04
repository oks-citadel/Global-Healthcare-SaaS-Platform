# Archived Stub Configurations

## Archive Information

- **Archive Date**: 2026-01-03
- **Archived By**: Infrastructure Cleanup
- **Reason**: Files contained stub/development configurations that were not production-ready

## Archived Files

| File | Original Path | Description |
|------|---------------|-------------|
| `deployments.yaml.archived` | `production/deployments.yaml` | Stub deployments using node:20-alpine images with single replicas and minimal resources |
| `configmaps.yaml.archived` | `production/configmaps.yaml` | Application code embedded in ConfigMaps (anti-pattern) |
| `services.yaml.archived` | `production/services.yaml` | Service definitions for stub deployments |

## Why These Were Archived

The archived files had the following issues that made them unsuitable for production:

### deployments.yaml
- Used generic `node:20-alpine` images instead of ECR container images
- Single replica (no high availability)
- Minimal resource limits (50m CPU, 64Mi memory)
- No security contexts (runAsNonRoot, readOnlyRootFilesystem, etc.)
- No service account configuration
- No pod anti-affinity for HA distribution

### configmaps.yaml
- Application code stored directly in ConfigMaps (anti-pattern)
- Simple HTTP servers with hardcoded mock data
- No proper error handling, logging, or observability
- Not production-grade microservices

### services.yaml
- Port mappings (3000-3005) did not match production configs (8080)
- Missing labels required for proper service mesh integration

## Authoritative Deployment Method

For production deployments, use:

1. **Primary Method**: `./scripts/deploy-production.sh`
   - Blue-green deployment
   - Automatic rollback on failure
   - Database backup and migration

2. **Base Configurations**: `infrastructure/kubernetes/base/services/*/deployment.yaml`
   - Production-ready with proper ECR images
   - Full security contexts
   - Multiple replicas for HA
   - Proper resource limits

See: `infrastructure/kubernetes/production/README.md` for complete deployment guidance.

## Recovery

If these files are ever needed for reference or development/testing purposes, they can be found in this folder with the `.archived` extension. To use them (NOT RECOMMENDED for production):

```bash
cp deployments.yaml.archived ../deployments.yaml
```

**WARNING**: Restored files should NEVER be used for production deployments.
