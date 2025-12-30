# UnifiedHealth Platform Helm Chart

This Helm chart deploys the UnifiedHealth Global Platform on Kubernetes with support for multi-environment deployments, blue-green strategies, and comprehensive monitoring.

## Features

- Multi-environment support (staging, production)
- Blue-green deployment strategy
- Horizontal Pod Autoscaling (HPA)
- Pod Disruption Budgets (PDB)
- Network policies for security
- Prometheus metrics integration
- AWS integration (ECR, Secrets Manager, RDS, ElastiCache)
- SSL/TLS termination
- Health checks and readiness probes

## Prerequisites

- Kubernetes 1.24+
- Helm 3.8+
- Amazon ECR access
- Configured AWS credentials
- AWS Load Balancer Controller (ALB ingress recommended)
- Cert-manager for TLS certificates

## Installation

### Staging Environment

```bash
helm install unified-health ./infrastructure/helm/unified-health \
  --namespace unified-health-staging \
  --create-namespace \
  --values ./infrastructure/helm/unified-health/values-staging.yaml
```

### Production Environment

```bash
helm install unified-health ./infrastructure/helm/unified-health \
  --namespace unified-health-prod \
  --create-namespace \
  --values ./infrastructure/helm/unified-health/values-production.yaml
```

## Configuration

### Required Secrets

Create the following Kubernetes secrets before installation:

```bash
# ECR credentials
kubectl create secret docker-registry ecr-secret \
  --docker-server=${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1) \
  --namespace=<namespace>

# Application secrets
kubectl create secret generic unified-health-secrets \
  --from-literal=DATABASE_URL=<database-url> \
  --from-literal=REDIS_URL=<redis-url> \
  --from-literal=JWT_SECRET=<jwt-secret> \
  --from-literal=STRIPE_SECRET_KEY=<stripe-key> \
  --from-literal=STRIPE_WEBHOOK_SECRET=<webhook-secret> \
  --namespace=<namespace>
```

### Key Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.environment` | Environment name | `production` |
| `global.imageRegistry` | Container registry | `${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com` |
| `replicaCount.api` | API replica count | `3` |
| `replicaCount.web` | Web replica count | `3` |
| `autoscaling.enabled` | Enable HPA | `true` |
| `ingress.enabled` | Enable ingress | `true` |
| `resources.api.requests.cpu` | API CPU request | `500m` |
| `resources.api.requests.memory` | API memory request | `512Mi` |

## Upgrading

### Staging

```bash
helm upgrade unified-health ./infrastructure/helm/unified-health \
  --namespace unified-health-staging \
  --values ./infrastructure/helm/unified-health/values-staging.yaml \
  --set image.api.tag=v1.2.3 \
  --set image.web.tag=v1.2.3
```

### Production (Blue-Green)

```bash
# Deploy to new color
helm upgrade unified-health ./infrastructure/helm/unified-health \
  --namespace unified-health-prod \
  --values ./infrastructure/helm/unified-health/values-production.yaml \
  --set blueGreen.activeColor=green \
  --set image.api.tag=v1.2.3 \
  --set image.web.tag=v1.2.3
```

## Uninstallation

```bash
helm uninstall unified-health --namespace <namespace>
```

## Monitoring

The chart includes Prometheus annotations for metrics scraping:

- API metrics: `http://api-pod:8080/metrics`
- Web metrics: `http://web-pod:3000/api/metrics`

## Health Checks

- Liveness probe: `/health`
- Readiness probe: `/ready`

## Troubleshooting

### Check pod status

```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
```

### Check services

```bash
kubectl get svc -n <namespace>
kubectl describe svc unified-health-api -n <namespace>
```

### Check ingress

```bash
kubectl get ingress -n <namespace>
kubectl describe ingress unified-health -n <namespace>
```

### Test database connectivity

```bash
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  psql postgresql://user:pass@host:5432/dbname
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/your-org/unified-health-platform/issues
- Documentation: https://docs.unifiedhealth.com
- Email: devops@unifiedhealth.com
