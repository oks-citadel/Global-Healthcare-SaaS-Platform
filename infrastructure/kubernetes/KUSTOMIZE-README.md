# Kubernetes Multi-Region Microservices Deployment

This directory contains Kubernetes manifests organized using Kustomize for multi-region deployment of the Healthcare Platform microservices.

## Directory Structure

```
kubernetes/
├── base/                           # Base configurations
│   ├── services/                   # Microservice definitions
│   │   ├── api-gateway/
│   │   │   ├── deployment.yaml     # API Gateway deployment
│   │   │   ├── service.yaml        # Service and ServiceAccount
│   │   │   └── hpa.yaml            # Horizontal Pod Autoscaler
│   │   ├── telehealth-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── mental-health-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── chronic-care-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── pharmacy-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── laboratory-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   └── kustomization.yaml
│   ├── shared/                     # Shared configurations
│   │   ├── configmap.yaml          # Shared configuration
│   │   ├── secrets.yaml            # Secret references
│   │   ├── networkpolicy.yaml      # Network policies
│   │   └── poddisruptionbudget.yaml # HA settings
│   └── ingress/                    # Ingress configurations
│       ├── ingress.yaml            # NGINX ingress rules
│       └── certificate.yaml        # TLS certificates
├── overlays/                       # Region-specific overlays
│   ├── americas/
│   │   ├── kustomization.yaml      # Americas overlay config
│   │   ├── namespace.yaml          # Namespace definition
│   │   ├── patches/
│   │   │   ├── replicas.yaml       # 3 replicas per service
│   │   │   └── resources.yaml      # Production resources
│   │   └── configmap-patch.yaml    # US-specific config
│   ├── europe/
│   │   ├── kustomization.yaml      # Europe overlay config
│   │   ├── namespace.yaml          # Namespace definition
│   │   ├── patches/
│   │   │   ├── replicas.yaml       # 3-4 replicas per service
│   │   │   └── resources.yaml      # Production resources
│   │   └── configmap-patch.yaml    # EU-specific config (GDPR)
│   └── africa/
│       ├── kustomization.yaml      # Africa overlay config
│       ├── namespace.yaml          # Namespace definition
│       ├── patches/
│       │   ├── replicas.yaml       # 2-3 replicas per service
│       │   └── resources.yaml      # Optimized resources
│       └── configmap-patch.yaml    # Africa-specific config
```

## Microservices

### 1. API Gateway
- **Purpose**: Entry point for all API requests
- **Features**: Rate limiting, authentication, routing
- **Ports**: 8080 (HTTP), 9090 (gRPC), 9091 (metrics)
- **Scaling**: 2-20 pods based on CPU/memory/RPS

### 2. Telehealth Service
- **Purpose**: Video consultations and appointments
- **Features**: WebSocket support, video API integration
- **Ports**: 8080 (HTTP), 9090 (gRPC), 8081 (WebSocket), 9091 (metrics)
- **Scaling**: 2-15 pods based on active sessions

### 3. Mental Health Service
- **Purpose**: Mental health assessments and therapy
- **Features**: PHQ-9/GAD-7 scoring, ML integration
- **Ports**: 8080 (HTTP), 9090 (gRPC), 9091 (metrics)
- **Scaling**: 2-12 pods based on active assessments

### 4. Chronic Care Service
- **Purpose**: Chronic disease monitoring
- **Features**: IoT device integration, time-series data
- **Ports**: 8080 (HTTP), 9090 (gRPC), 9091 (metrics)
- **Scaling**: 2-12 pods based on IoT events

### 5. Pharmacy Service
- **Purpose**: Prescription and medication management
- **Features**: Drug database integration, payment processing
- **Ports**: 8080 (HTTP), 9090 (gRPC), 9091 (metrics)
- **Scaling**: 2-10 pods based on orders

### 6. Laboratory Service
- **Purpose**: Lab orders and results
- **Features**: HL7/FHIR integration, result processing
- **Ports**: 8080 (HTTP), 9090 (gRPC), 9091 (metrics)
- **Scaling**: 2-10 pods based on lab orders

## Regional Configurations

### Americas Region
- **Namespace**: `healthcare-americas`
- **Replicas**: 3 per service
- **Compliance**: HIPAA, HITECH
- **Features**: Medicare/Medicaid integration, Epic/Cerner
- **Currency**: USD, CAD, BRL
- **Languages**: en-US, es-US, pt-BR, fr-CA

### Europe Region
- **Namespace**: `healthcare-europe`
- **Replicas**: 3-4 per service (higher for gateway/telehealth)
- **Compliance**: GDPR, Schrems II
- **Features**: NHS integration, EHIC support, cross-border care
- **Currency**: EUR, GBP, CHF, SEK, NOK, DKK
- **Languages**: en-GB, de-DE, fr-FR, es-ES, it-IT, nl-NL, sv-SE

### Africa Region
- **Namespace**: `healthcare-africa`
- **Replicas**: 2-3 per service (optimized for cost)
- **Compliance**: POPIA, AU Convention
- **Features**: Mobile money, SMS/USSD, offline mode, DHIS2
- **Currency**: ZAR, NGN, KES, EGP, GHS
- **Languages**: en-ZA, en-NG, en-KE, fr-FR, ar-EG, sw-KE

## Security Features

### Pod Security
- Non-root user (UID 1000)
- Read-only root filesystem
- No privilege escalation
- Dropped all capabilities
- Security context constraints

### Network Security
- Network policies for pod-to-pod communication
- Service mesh support (Istio)
- mTLS between services
- WAF enabled on ingress
- OWASP ModSecurity rules

### Secrets Management
- Kubernetes secrets for credentials
- AWS IAM role annotations for EKS
- External secrets operator support
- Encryption at rest

## High Availability

### Pod Disruption Budgets
- Minimum 1 pod available during disruptions
- Prevents complete service outages
- Supports rolling updates and node maintenance

### Anti-Affinity Rules
- Preferred pod anti-affinity on hostname
- Spread pods across availability zones
- Improves resilience to node failures

### Health Checks
- **Liveness Probe**: Restarts unhealthy containers
- **Readiness Probe**: Removes unhealthy pods from service
- **Startup Probe**: Extended time for slow-starting apps

## Resource Management

### Base Resources (per pod)
| Service | CPU Request | Memory Request | CPU Limit | Memory Limit |
|---------|-------------|----------------|-----------|--------------|
| API Gateway | 200m | 256Mi | 1000m | 1Gi |
| Telehealth | 300m | 512Mi | 1500m | 2Gi |
| Mental Health | 250m | 512Mi | 1200m | 1.5Gi |
| Chronic Care | 300m | 512Mi | 1500m | 2Gi |
| Pharmacy | 200m | 384Mi | 1000m | 1Gi |
| Laboratory | 250m | 512Mi | 1200m | 1.5Gi |

### Regional Adjustments
- **Americas**: Production-level resources
- **Europe**: Slightly higher for gateway/telehealth
- **Africa**: Optimized for cost-efficiency

## Deployment Instructions

### Prerequisites
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install kustomize
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash

# Configure kubectl for your cluster
aws eks update-kubeconfig --region us-east-1 --name healthcare-americas-cluster
```

### Deploy to a Region

#### Americas
```bash
# Preview what will be deployed
kubectl kustomize overlays/americas/

# Apply the configuration
kubectl apply -k overlays/americas/

# Verify deployment
kubectl get pods -n healthcare-americas
kubectl get svc -n healthcare-americas
kubectl get ingress -n healthcare-americas
```

#### Europe
```bash
# Preview what will be deployed
kubectl kustomize overlays/europe/

# Apply the configuration
kubectl apply -k overlays/europe/

# Verify deployment
kubectl get pods -n healthcare-europe
kubectl get svc -n healthcare-europe
kubectl get ingress -n healthcare-europe
```

#### Africa
```bash
# Preview what will be deployed
kubectl kustomize overlays/africa/

# Apply the configuration
kubectl apply -k overlays/africa/

# Verify deployment
kubectl get pods -n healthcare-africa
kubectl get svc -n healthcare-africa
kubectl get ingress -n healthcare-africa
```

### Update Secrets

**IMPORTANT**: Before deploying, update all secrets in `base/shared/secrets.yaml`:

```bash
# Generate secure random keys
openssl rand -base64 32

# Edit secrets file
vi base/shared/secrets.yaml

# Replace all CHANGEME values with actual credentials
# - Database passwords
# - API keys
# - Encryption keys
# - JWT secrets
```

### Update Configuration

1. **Update ConfigMaps**: Edit `base/shared/configmap.yaml` and overlay-specific patches
2. **Update Image Tags**: Edit `overlays/*/kustomization.yaml` to set proper image versions
3. **Update Domains**: Edit `base/ingress/ingress.yaml` with your actual domain names
4. **Update IAM Roles**: Edit service account annotations with actual AWS IAM role ARNs

## Monitoring

### Metrics Endpoints
All services expose Prometheus metrics on port 9091:
- `/metrics` - Application metrics
- `/health/live` - Liveness probe
- `/health/ready` - Readiness probe
- `/health/startup` - Startup probe

### Accessing Metrics
```bash
# Port-forward to a service
kubectl port-forward -n healthcare-americas svc/api-gateway 9091:9091

# View metrics
curl http://localhost:9091/metrics
```

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n healthcare-americas
kubectl describe pod <pod-name> -n healthcare-americas
kubectl logs <pod-name> -n healthcare-americas
```

### Check Service Endpoints
```bash
kubectl get endpoints -n healthcare-americas
kubectl describe svc api-gateway -n healthcare-americas
```

### Check Ingress
```bash
kubectl get ingress -n healthcare-americas
kubectl describe ingress healthcare-platform-ingress -n healthcare-americas
```

### Check HPA Status
```bash
kubectl get hpa -n healthcare-americas
kubectl describe hpa api-gateway -n healthcare-americas
```

### Check Network Policies
```bash
kubectl get networkpolicies -n healthcare-americas
kubectl describe networkpolicy api-gateway-network-policy -n healthcare-americas
```

## Scaling

### Manual Scaling
```bash
# Scale a specific deployment
kubectl scale deployment api-gateway -n healthcare-americas --replicas=5

# Check status
kubectl get deployment api-gateway -n healthcare-americas
```

### Autoscaling
HPA automatically scales based on:
- CPU utilization (70% target)
- Memory utilization (80% target)
- Custom metrics (requests per second, active sessions, etc.)

## Updates and Rollbacks

### Rolling Update
```bash
# Update image version in kustomization.yaml, then apply
kubectl apply -k overlays/americas/

# Watch rollout status
kubectl rollout status deployment/api-gateway -n healthcare-americas
```

### Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/api-gateway -n healthcare-americas

# Rollback to specific revision
kubectl rollout undo deployment/api-gateway -n healthcare-americas --to-revision=2

# Check rollout history
kubectl rollout history deployment/api-gateway -n healthcare-americas
```

## Cleanup

### Remove a Region
```bash
# Delete all resources in a namespace
kubectl delete -k overlays/americas/

# Or delete the namespace (cascading delete)
kubectl delete namespace healthcare-americas
```

## Best Practices

1. **Never commit secrets**: Use external secret management (AWS Secrets Manager, HashiCorp Vault)
2. **Use image digests**: Pin images by digest for reproducible deployments
3. **Test in staging**: Always test changes in staging environment first
4. **Monitor metrics**: Set up alerts for abnormal behavior
5. **Regular backups**: Backup cluster state and persistent data
6. **Resource limits**: Always set resource requests and limits
7. **Use namespaces**: Keep regions/environments isolated
8. **Label everything**: Use consistent labeling for resource management
9. **Document changes**: Keep this README updated with configuration changes
10. **Version control**: Track all changes in Git with meaningful commit messages

## Support

For issues or questions:
- **Documentation**: See main platform README
- **Issues**: Open a GitHub issue
- **Emergency**: Contact DevOps team

## License

Copyright © 2024 Healthcare Platform. All rights reserved.
