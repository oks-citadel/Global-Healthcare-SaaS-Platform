# Kubernetes Deployment Guide - Unified Healthcare Platform

Complete Kubernetes deployment configurations for the Unified Healthcare Platform API with production-ready configurations including security, high availability, and HIPAA/GDPR compliance.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Directory Structure](#directory-structure)
- [Configuration Files](#configuration-files)
- [Deployment Process](#deployment-process)
- [Environment-Specific Deployments](#environment-specific-deployments)
- [Security](#security)
- [Monitoring and Observability](#monitoring-and-observability)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Overview

This Kubernetes configuration provides:

- **High Availability**: Multi-replica deployments with pod anti-affinity
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) based on CPU and memory
- **Security**: Network policies, RBAC, Azure Workload Identity integration
- **Compliance**: HIPAA and GDPR-compliant configurations
- **TLS/SSL**: Automated certificate management with cert-manager
- **Rate Limiting**: NGINX ingress with rate limiting and DDoS protection
- **Observability**: Prometheus metrics, health checks, and logging
- **Resilience**: Pod Disruption Budgets (PDB) for zero-downtime deployments

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NGINX Ingress Controller                  │
│                  (TLS, Rate Limiting, WAF)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
┌───────▼─────────┐           ┌──────────▼──────────┐
│  API Service    │           │  Metrics Service    │
│  (ClusterIP)    │           │  (Prometheus)       │
└───────┬─────────┘           └─────────────────────┘
        │
┌───────▼──────────────────────────────────────────┐
│          API Deployment (3 replicas)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Pod 1   │  │  Pod 2   │  │  Pod 3   │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└────┬──────────────┬────────────────┬─────────────┘
     │              │                │
     │              │                │
┌────▼────┐    ┌───▼─────┐    ┌────▼─────┐
│ Azure   │    │  Redis  │    │ External │
│ PostgreSQL   │  Cache  │    │ Services │
└─────────┘    └─────────┘    └──────────┘
```

## Prerequisites

### Required Tools

1. **kubectl** (v1.27+)
   ```bash
   kubectl version --client
   ```

2. **kustomize** (v5.0+)
   ```bash
   kustomize version
   ```

3. **Azure CLI** (v2.50+)
   ```bash
   az version
   ```

4. **Helm** (v3.12+)
   ```bash
   helm version
   ```

### Required Azure Resources

1. **Azure Kubernetes Service (AKS)**
   ```bash
   az aks create \
     --resource-group unified-health-rg \
     --name unified-health-aks \
     --node-count 3 \
     --enable-managed-identity \
     --enable-workload-identity \
     --enable-oidc-issuer \
     --network-plugin azure \
     --kubernetes-version 1.27
   ```

2. **Azure Container Registry (ACR)**
   ```bash
   az acr create \
     --resource-group unified-health-rg \
     --name unifiedhealthacr \
     --sku Premium
   ```

3. **Azure Key Vault**
   ```bash
   az keyvault create \
     --name unified-health-kv \
     --resource-group unified-health-rg \
     --enable-rbac-authorization
   ```

4. **Azure Database for PostgreSQL**
   ```bash
   az postgres flexible-server create \
     --resource-group unified-health-rg \
     --name unified-health-db \
     --sku-name Standard_D4s_v3 \
     --tier GeneralPurpose \
     --version 15
   ```

### Required Kubernetes Components

1. **NGINX Ingress Controller**
   ```bash
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm install ingress-nginx ingress-nginx/ingress-nginx \
     --namespace ingress-nginx \
     --create-namespace \
     --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
   ```

2. **cert-manager**
   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm install cert-manager jetstack/cert-manager \
     --namespace cert-manager \
     --create-namespace \
     --set installCRDs=true
   ```

3. **Azure Workload Identity**
   ```bash
   helm repo add azure-workload-identity https://azure.github.io/azure-workload-identity/charts
   helm install workload-identity-webhook azure-workload-identity/workload-identity-webhook \
     --namespace azure-workload-identity-system \
     --create-namespace
   ```

## Directory Structure

```
infrastructure/kubernetes/
├── base/                           # Base configurations
│   ├── namespace.yaml             # Namespace definition
│   ├── configmap.yaml             # Application configuration
│   ├── secrets.yaml               # Secrets template (from Azure Key Vault)
│   ├── service-account.yaml       # Service account with Azure Workload Identity
│   ├── api-deployment.yaml        # API deployment
│   ├── api-service.yaml           # ClusterIP service
│   ├── ingress.yaml               # NGINX ingress with TLS
│   ├── network-policy.yaml        # Network policies for security
│   ├── poddisruptionbudget.yaml   # Pod disruption budget
│   └── kustomization.yaml         # Base kustomization
├── overlays/
│   ├── staging/
│   │   └── kustomization.yaml     # Staging-specific patches
│   └── production/
│       ├── kustomization.yaml     # Production-specific patches
│       └── production-pdb.yaml    # Production PDB override
└── README.md                       # This file
```

## Configuration Files

### 1. ConfigMap (base/configmap.yaml)

Non-sensitive application configuration including:
- Service URLs (Redis, Database)
- Feature flags (HIPAA, GDPR, Multi-tenancy)
- API configuration (rate limits, timeouts)
- CORS settings
- Cache configuration
- Security headers

### 2. Secrets (base/secrets.yaml)

Template for sensitive data (populated from Azure Key Vault):
- Database credentials
- JWT secrets
- Redis password
- Encryption keys
- API keys (SendGrid, Twilio, Stripe)
- OAuth credentials

### 3. Service Account (base/service-account.yaml)

Service account with:
- Azure Workload Identity annotations
- RBAC roles and bindings
- Key Vault access permissions

### 4. Deployment (base/api-deployment.yaml)

API deployment with:
- 3 replicas (production)
- Resource limits (CPU, memory)
- Health checks (liveness, readiness)
- Security context (non-root, read-only filesystem)
- Pod anti-affinity
- Horizontal Pod Autoscaler (HPA)

### 5. Service (base/api-service.yaml)

ClusterIP service exposing:
- HTTP port (80 → 8080)
- Health check port (8080)
- Metrics port (9090)

### 6. Ingress (base/ingress.yaml)

NGINX ingress with:
- TLS termination
- Rate limiting (100 req/min, 5000 req/hour)
- CORS configuration
- Security headers
- ModSecurity WAF
- Path routing (/api/v1/*)

### 7. Network Policy (base/network-policy.yaml)

Network policies for:
- Default deny all traffic
- Allow ingress from NGINX
- Allow egress to database, Redis, external services
- Allow DNS resolution
- Restrict pod-to-pod communication

### 8. Pod Disruption Budget (base/poddisruptionbudget.yaml)

PDB configuration:
- Staging: minAvailable = 1
- Production: minAvailable = 2

## Deployment Process

### Step 1: Connect to AKS Cluster

```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group unified-health-rg \
  --name unified-health-aks

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### Step 2: Configure Azure Workload Identity

```bash
# Get OIDC issuer URL
export AKS_OIDC_ISSUER=$(az aks show \
  --resource-group unified-health-rg \
  --name unified-health-aks \
  --query "oidcIssuerProfile.issuerUrl" \
  --output tsv)

# Create Azure AD application
export APP_NAME="unified-health-api"
az ad app create --display-name "${APP_NAME}"

export APPLICATION_CLIENT_ID=$(az ad app list \
  --display-name "${APP_NAME}" \
  --query "[0].appId" \
  --output tsv)

# Create service principal
az ad sp create --id "${APPLICATION_CLIENT_ID}"

# Create federated identity credential
cat <<EOF > federated-identity.json
{
  "name": "unified-health-api-federated-identity",
  "issuer": "${AKS_OIDC_ISSUER}",
  "subject": "system:serviceaccount:unified-health:unified-health-api",
  "audiences": [
    "api://AzureADTokenExchange"
  ]
}
EOF

az ad app federated-credential create \
  --id "${APPLICATION_CLIENT_ID}" \
  --parameters @federated-identity.json

# Grant Key Vault permissions
export KEY_VAULT_NAME="unified-health-kv"
export SERVICE_PRINCIPAL_ID=$(az ad sp list \
  --display-name "${APP_NAME}" \
  --query "[0].id" \
  --output tsv)

az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee "${SERVICE_PRINCIPAL_ID}" \
  --scope "/subscriptions/${AZURE_SUBSCRIPTION_ID}/resourceGroups/unified-health-rg/providers/Microsoft.KeyVault/vaults/${KEY_VAULT_NAME}"
```

### Step 3: Populate Secrets in Azure Key Vault

```bash
# Database credentials
az keyvault secret set \
  --vault-name unified-health-kv \
  --name database-url \
  --value "postgresql://user:password@host:5432/dbname?sslmode=require"

# JWT secret
az keyvault secret set \
  --vault-name unified-health-kv \
  --name jwt-secret \
  --value "$(openssl rand -base64 32)"

# Redis password
az keyvault secret set \
  --vault-name unified-health-kv \
  --name redis-password \
  --value "$(openssl rand -base64 32)"

# Encryption key
az keyvault secret set \
  --vault-name unified-health-kv \
  --name encryption-key \
  --value "$(openssl rand -base64 32)"

# Add other secrets as needed...
```

### Step 4: Deploy to Staging

```bash
# Set environment variables
export ACR_LOGIN_SERVER="unifiedhealthacr.azurecr.io"
export AZURE_CLIENT_ID="${APPLICATION_CLIENT_ID}"
export AZURE_TENANT_ID="$(az account show --query tenantId -o tsv)"

# Build and apply staging configuration
cd infrastructure/kubernetes/overlays/staging

# Preview changes
kustomize build . | envsubst

# Apply configuration
kustomize build . | envsubst | kubectl apply -f -

# Verify deployment
kubectl get all -n unified-health-staging
kubectl get pods -n unified-health-staging -w
```

### Step 5: Verify Staging Deployment

```bash
# Check pod status
kubectl get pods -n unified-health-staging

# Check logs
kubectl logs -n unified-health-staging -l app=unified-health-api --tail=100

# Check service
kubectl get svc -n unified-health-staging

# Check ingress
kubectl get ingress -n unified-health-staging

# Test health endpoint
kubectl port-forward -n unified-health-staging svc/unified-health-api 8080:80
curl http://localhost:8080/health
```

### Step 6: Deploy to Production

```bash
# Build and apply production configuration
cd infrastructure/kubernetes/overlays/production

# Preview changes
kustomize build . | envsubst

# Apply configuration
kustomize build . | envsubst | kubectl apply -f -

# Verify deployment
kubectl get all -n unified-health-production
kubectl get pods -n unified-health-production -w
```

### Step 7: Configure DNS

```bash
# Get ingress external IP
kubectl get ingress -n unified-health-production

# Add DNS A record
# api.unifiedhealth.com → <EXTERNAL-IP>
```

## Environment-Specific Deployments

### Staging Environment

**Configuration:**
- Replicas: 2
- CPU: 200m request, 500m limit
- Memory: 256Mi request, 512Mi limit
- Domain: api-staging.unifiedhealth.com
- Log level: debug
- HPA: 2-10 replicas
- PDB: minAvailable = 1

**Deploy:**
```bash
kubectl apply -k overlays/staging
```

### Production Environment

**Configuration:**
- Replicas: 3
- CPU: 500m request, 2000m limit
- Memory: 512Mi request, 2Gi limit
- Domain: api.unifiedhealth.com
- Log level: info
- HPA: 3-20 replicas
- PDB: minAvailable = 2

**Deploy:**
```bash
kubectl apply -k overlays/production
```

## Security

### Network Policies

Network policies enforce:
- Default deny all ingress and egress
- Explicit allow rules for required traffic
- Isolation between namespaces
- Restriction of external access

### RBAC

Service account permissions:
- Read-only access to ConfigMaps and Secrets
- Service discovery (endpoints, services, pods)
- Event creation for logging

### Azure Workload Identity

Benefits:
- No service principal credentials stored in cluster
- Automatic token rotation
- Integration with Azure Key Vault
- Fine-grained RBAC in Azure

### Pod Security

Deployment security context:
- Run as non-root user (UID 1001)
- Read-only root filesystem
- Drop all capabilities
- No privilege escalation

### TLS/SSL

Certificate management:
- Automated with cert-manager
- Let's Encrypt production certificates
- Automatic renewal (30 days before expiry)
- Support for wildcard certificates

## Monitoring and Observability

### Health Checks

**Liveness Probe:**
- Endpoint: `/health`
- Initial delay: 30s
- Period: 10s
- Timeout: 5s
- Failure threshold: 3

**Readiness Probe:**
- Endpoint: `/ready`
- Initial delay: 5s
- Period: 5s
- Timeout: 3s
- Failure threshold: 3

### Metrics

Prometheus scraping configured:
- Port: 8080
- Path: `/metrics`
- Auto-discovery via annotations

### Logging

Logging configuration:
- Structured JSON logs
- Log level: info (production), debug (staging)
- Audit logging enabled
- Retention: 7 years (HIPAA compliance)

## Troubleshooting

### Common Issues

#### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n unified-health-production

# Describe pod
kubectl describe pod <pod-name> -n unified-health-production

# Check logs
kubectl logs <pod-name> -n unified-health-production
```

#### Image Pull Errors

```bash
# Verify ACR access
az acr login --name unifiedhealthacr

# Attach ACR to AKS
az aks update \
  --resource-group unified-health-rg \
  --name unified-health-aks \
  --attach-acr unifiedhealthacr
```

#### Ingress Not Working

```bash
# Check ingress status
kubectl get ingress -n unified-health-production

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Verify certificate
kubectl get certificate -n unified-health-production
kubectl describe certificate unified-health-tls-cert -n unified-health-production
```

#### Database Connection Errors

```bash
# Verify secrets
kubectl get secret unified-health-secrets -n unified-health-production -o yaml

# Test database connectivity
kubectl run -it --rm debug \
  --image=postgres:15 \
  --restart=Never \
  -- psql "$DATABASE_URL"
```

#### Azure Workload Identity Issues

```bash
# Verify service account
kubectl get sa unified-health-api -n unified-health-production -o yaml

# Check federated identity
az ad app federated-credential list --id "${APPLICATION_CLIENT_ID}"

# Test Key Vault access
kubectl run -it --rm test-workload-identity \
  --image=mcr.microsoft.com/azure-cli \
  --serviceaccount=unified-health-api \
  --namespace=unified-health-production \
  -- az keyvault secret list --vault-name unified-health-kv
```

## Maintenance

### Rolling Updates

```bash
# Update image tag in kustomization.yaml
# Then apply
kubectl apply -k overlays/production

# Monitor rollout
kubectl rollout status deployment/unified-health-api -n unified-health-production

# Rollback if needed
kubectl rollout undo deployment/unified-health-api -n unified-health-production
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment unified-health-api \
  --replicas=5 \
  -n unified-health-production

# Update HPA
kubectl edit hpa unified-health-api-hpa -n unified-health-production
```

### Backup and Disaster Recovery

```bash
# Backup all resources
kubectl get all,configmap,secret,ingress,networkpolicy \
  -n unified-health-production \
  -o yaml > backup-$(date +%Y%m%d).yaml

# Restore from backup
kubectl apply -f backup-20240101.yaml
```

### Certificate Renewal

Certificates auto-renew 30 days before expiry. To force renewal:

```bash
# Delete certificate secret
kubectl delete secret unified-health-tls-cert -n unified-health-production

# Delete certificate
kubectl delete certificate unified-health-tls-cert -n unified-health-production

# Reapply
kubectl apply -f base/ingress.yaml
```

## Best Practices

1. **Version Control**: Always commit configuration changes to Git
2. **GitOps**: Use ArgoCD or Flux for automated deployments
3. **Secrets Management**: Never commit secrets to Git, use Azure Key Vault
4. **Testing**: Test in staging before deploying to production
5. **Monitoring**: Set up alerts for critical metrics
6. **Backup**: Regular backups of cluster state and data
7. **Documentation**: Keep runbooks updated
8. **Compliance**: Regular security audits and compliance checks

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [Azure Workload Identity](https://azure.github.io/azure-workload-identity/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/)

## Support

For issues or questions:
- Email: devops@unifiedhealth.com
- Slack: #unified-health-platform
- Documentation: https://docs.unifiedhealth.com

---

**Last Updated**: 2025-12-17
**Version**: 1.0.0
