# Kubernetes Deployment Guide - Unified Healthcare Platform (AWS)

Complete Kubernetes deployment configurations for the Unified Healthcare Platform API on Amazon Web Services (AWS), with production-ready configurations including security, high availability, and HIPAA/GDPR/POPIA compliance.

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
- [Multi-Region Deployment](#multi-region-deployment)

## Overview

This Kubernetes configuration provides AWS-native deployment using Amazon EKS (Elastic Kubernetes Service):

- **High Availability**: Multi-replica deployments with pod anti-affinity across Availability Zones
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) and Cluster Autoscaler for EKS node groups
- **Security**: Network policies, RBAC, AWS IRSA (IAM Roles for Service Accounts) integration
- **Compliance**: HIPAA, GDPR, and POPIA-compliant configurations
- **TLS/SSL**: Automated certificate management with cert-manager and AWS ACM
- **Load Balancing**: AWS Load Balancer Controller for ALB/NLB integration
- **DNS Management**: Amazon Route 53 for DNS and health checks
- **Rate Limiting**: NGINX ingress with rate limiting and DDoS protection via AWS Shield
- **Observability**: Amazon CloudWatch, Prometheus metrics, and AWS X-Ray tracing
- **Resilience**: Pod Disruption Budgets (PDB) for zero-downtime deployments

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Amazon Route 53                                  │
│                         (DNS, Health Checks, Failover)                        │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────┐
│                    AWS Load Balancer Controller (ALB/NLB)                      │
│                        (TLS Termination, WAF, Shield)                          │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────┐
│                       NGINX Ingress Controller                                 │
│                    (Rate Limiting, Path Routing)                               │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
            ┌───────────────────────┴────────────────┐
            │                                        │
    ┌───────▼─────────┐                   ┌──────────▼──────────┐
    │  API Service    │                   │  Metrics Service    │
    │  (ClusterIP)    │                   │  (Prometheus)       │
    └───────┬─────────┘                   └─────────────────────┘
            │
┌───────────▼──────────────────────────────────────────┐
│          API Deployment (3 replicas)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Pod 1   │  │  Pod 2   │  │  Pod 3   │           │
│  │  (AZ-1a) │  │  (AZ-1b) │  │  (AZ-1c) │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└────┬──────────────┬────────────────┬─────────────────┘
     │              │                │
     │              │                │
┌────▼────┐    ┌───▼─────┐    ┌────▼─────┐    ┌────────────┐
│ Amazon  │    │ Amazon  │    │ Amazon   │    │   AWS      │
│ RDS     │    │ Elasti- │    │ S3       │    │  Secrets   │
│ (Aurora)│    │ Cache   │    │          │    │  Manager   │
└─────────┘    └─────────┘    └──────────┘    └────────────┘
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

3. **AWS CLI** (v2.0+)
   ```bash
   aws --version
   ```

4. **eksctl** (v0.150+)
   ```bash
   eksctl version
   ```

5. **Helm** (v3.12+)
   ```bash
   helm version
   ```

### Required AWS Resources

1. **Amazon Elastic Kubernetes Service (EKS)**
   ```bash
   eksctl create cluster \
     --name unified-health-eks \
     --region us-east-1 \
     --nodegroup-name standard-workers \
     --node-type t3.large \
     --nodes 3 \
     --nodes-min 2 \
     --nodes-max 5 \
     --with-oidc \
     --managed
   ```

2. **Amazon Elastic Container Registry (ECR)**
   ```bash
   aws ecr create-repository \
     --repository-name unified-health-api \
     --region us-east-1 \
     --image-scanning-configuration scanOnPush=true
   ```

3. **AWS Secrets Manager**
   ```bash
   aws secretsmanager create-secret \
     --name unified-health/production \
     --description "Production secrets for UnifiedHealth API"
   ```

4. **Amazon RDS for PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier unified-health-db \
     --db-instance-class db.r6g.large \
     --engine postgres \
     --engine-version 15 \
     --master-username admin \
     --master-user-password <password> \
     --allocated-storage 100
   ```

### Required Kubernetes Components

1. **AWS Load Balancer Controller**
   ```bash
   helm repo add eks https://aws.github.io/eks-charts
   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
     --namespace kube-system \
     --set clusterName=unified-health-eks \
     --set serviceAccount.create=false \
     --set serviceAccount.name=aws-load-balancer-controller
   ```

2. **cert-manager**
   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm install cert-manager jetstack/cert-manager \
     --namespace cert-manager \
     --create-namespace \
     --set installCRDs=true
   ```

3. **AWS Secrets Store CSI Driver**
   ```bash
   helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
   helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
     --namespace kube-system

   # Install AWS provider
   kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
   ```

## Directory Structure

```
infrastructure/kubernetes/
├── base/                           # Base configurations
│   ├── namespace.yaml             # Namespace definition
│   ├── configmap.yaml             # Application configuration
│   ├── secrets.yaml               # Secrets template (from AWS Secrets Manager)
│   ├── service-account.yaml       # Service account with AWS IRSA
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
├── cert-manager/                   # Certificate management
│   ├── dns01-clusterissuer-aws.yaml # Route 53 DNS01 challenge
│   └── http01-clusterissuer.yaml    # HTTP01 challenge issuer
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

Template for sensitive data (populated from AWS Secrets Manager):
- Database credentials
- JWT secrets
- Redis password
- Encryption keys
- API keys (SendGrid, Twilio, Stripe)
- OAuth credentials

### 3. Service Account (base/service-account.yaml)

Service account with:
- AWS IRSA (IAM Roles for Service Accounts) annotations
- RBAC roles and bindings
- Secrets Manager access permissions

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

### Step 1: Connect to EKS Cluster

```bash
# Update kubeconfig for EKS
aws eks update-kubeconfig \
  --region us-east-1 \
  --name unified-health-eks

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### Step 2: Configure AWS IRSA (IAM Roles for Service Accounts)

```bash
# Get OIDC issuer URL
export OIDC_PROVIDER=$(aws eks describe-cluster \
  --name unified-health-eks \
  --query "cluster.identity.oidc.issuer" \
  --output text | sed 's|https://||')

# Create IAM policy for the service account
cat <<EOF > iam-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:unified-health/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::unified-health-*/*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name unified-health-api-policy \
  --policy-document file://iam-policy.json

# Create IAM role with IRSA
eksctl create iamserviceaccount \
  --name unified-health-api \
  --namespace unified-health \
  --cluster unified-health-eks \
  --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/unified-health-api-policy \
  --approve \
  --override-existing-serviceaccounts
```

### Step 3: Populate Secrets in AWS Secrets Manager

```bash
# Database credentials
aws secretsmanager create-secret \
  --name unified-health/database \
  --secret-string '{"url":"postgresql://user:password@host:5432/dbname?sslmode=require"}'

# JWT secret
aws secretsmanager create-secret \
  --name unified-health/jwt \
  --secret-string "{\"secret\":\"$(openssl rand -base64 32)\"}"

# Redis password
aws secretsmanager create-secret \
  --name unified-health/redis \
  --secret-string "{\"password\":\"$(openssl rand -base64 32)\"}"

# Encryption key
aws secretsmanager create-secret \
  --name unified-health/encryption \
  --secret-string "{\"key\":\"$(openssl rand -base64 32)\"}"

# Add other secrets as needed...
```

### Step 4: Deploy to Staging

```bash
# Set environment variables
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_IAM_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/unified-health-api-role"

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

### AWS IRSA (IAM Roles for Service Accounts)

Benefits:
- No AWS credentials stored in cluster
- Automatic token rotation
- Integration with AWS Secrets Manager
- Fine-grained IAM policies

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
# Verify ECR access
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Create ECR pull secret
kubectl create secret docker-registry ecr-secret \
  --docker-server=${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1)
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

#### AWS IRSA Issues

```bash
# Verify service account
kubectl get sa unified-health-api -n unified-health-production -o yaml

# Check IAM role association
kubectl describe sa unified-health-api -n unified-health-production | grep eks.amazonaws.com

# Test Secrets Manager access
kubectl run -it --rm test-irsa \
  --image=amazon/aws-cli \
  --serviceaccount=unified-health-api \
  --namespace=unified-health-production \
  -- aws secretsmanager list-secrets
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
3. **Secrets Management**: Never commit secrets to Git, use AWS Secrets Manager
4. **Testing**: Test in staging before deploying to production
5. **Monitoring**: Set up CloudWatch alarms for critical metrics
6. **Backup**: Regular backups using AWS Backup for EBS, RDS, and S3
7. **Documentation**: Keep runbooks updated
8. **Compliance**: Regular security audits and compliance checks
9. **Cost Optimization**: Use Spot instances for non-critical workloads
10. **Multi-Region**: Deploy across regions for disaster recovery

## Multi-Region Deployment

The platform supports deployment across multiple AWS regions for compliance and latency optimization:

### Supported Regions

| Region | AWS Region | Primary Use Case | Compliance |
|--------|------------|------------------|------------|
| Americas | us-east-1 | North/South America | HIPAA, SOC2 |
| Europe | eu-west-1 | European Union | GDPR, ISO27001 |
| Africa | af-south-1 | African continent | POPIA, ISO27001 |

### Region-Specific Deployment

```bash
# Americas (US East)
aws eks update-kubeconfig --region us-east-1 --name unified-health-dev-americas-eks
kubectl apply -k overlays/production

# Europe (Ireland)
aws eks update-kubeconfig --region eu-west-1 --name unified-health-dev-europe-eks
kubectl apply -k overlays/production

# Africa (Cape Town)
aws eks update-kubeconfig --region af-south-1 --name unified-health-dev-africa-eks
kubectl apply -k overlays/production
```

### Cross-Region Considerations

- **Data Residency**: Ensure data stays within regional boundaries for compliance
- **ECR Replication**: Container images are automatically replicated across regions
- **Route 53**: Configure latency-based or geolocation routing
- **Database**: Use RDS read replicas for cross-region read access
- **Secrets**: Replicate secrets to each region via AWS Secrets Manager

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [Amazon EKS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/)
- [AWS IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
- [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Amazon Route 53 Documentation](https://docs.aws.amazon.com/Route53/)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/)

## Support

For issues or questions:
- Email: devops@unifiedhealth.com
- Slack: #unified-health-platform
- Documentation: https://docs.unifiedhealth.com

---

## Important Notes

### Archived Stub Configurations (2026-01-03)

The stub deployment configurations in `infrastructure/kubernetes/production/` have been archived. These files (deployments.yaml, configmaps.yaml, services.yaml) were development/testing configurations that were not suitable for production use. They have been moved to `infrastructure/kubernetes/production/archived/` with the `.archived` extension.

**For production deployments, always use**:
1. `scripts/deploy-production.sh` - Primary deployment script with blue-green deployments
2. Base configurations in `infrastructure/kubernetes/base/services/*/deployment.yaml`

See `infrastructure/kubernetes/production/README.md` for complete details.

---

**Last Updated**: 2026-01-03
**Version**: 2.0.1 (AWS)
