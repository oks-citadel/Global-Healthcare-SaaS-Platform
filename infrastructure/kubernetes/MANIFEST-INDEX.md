# Kubernetes Manifests Index

Complete index of all Kubernetes manifests and configuration files for multi-region microservices deployment.

## Summary Statistics

- **Total YAML Files**: 54
- **Base Service Definitions**: 19
- **Shared Configurations**: 4
- **Ingress Configurations**: 2
- **Regional Overlays**: 15 (3 regions × 5 files)
- **Scripts**: 3
- **Documentation**: 5

## Base Configurations

### Services (6 microservices × 3 files = 18 files)

#### API Gateway
```
base/services/api-gateway/
├── deployment.yaml      # Deployment with 2-20 replicas, resource limits, health checks
├── service.yaml         # ClusterIP service + ServiceAccount with IAM role
└── hpa.yaml            # HPA scaling on CPU/memory/RPS (70%/80%/1000)
```

#### Telehealth Service
```
base/services/telehealth-service/
├── deployment.yaml      # Deployment with WebSocket support, 2-15 replicas
├── service.yaml         # ClusterIP service with WebSocket port + ServiceAccount
└── hpa.yaml            # HPA scaling on active video sessions (50/pod)
```

#### Mental Health Service
```
base/services/mental-health-service/
├── deployment.yaml      # Deployment with ML model support, 2-12 replicas
├── service.yaml         # ClusterIP service + ServiceAccount
└── hpa.yaml            # HPA scaling on active assessments (100/pod)
```

#### Chronic Care Service
```
base/services/chronic-care-service/
├── deployment.yaml      # Deployment with IoT integration, 2-12 replicas
├── service.yaml         # ClusterIP service + ServiceAccount
└── hpa.yaml            # HPA scaling on IoT events (500/sec/pod)
```

#### Pharmacy Service
```
base/services/pharmacy-service/
├── deployment.yaml      # Deployment with payment gateway, 2-10 replicas
├── service.yaml         # ClusterIP service + ServiceAccount
└── hpa.yaml            # HPA scaling on prescription orders (200/sec/pod)
```

#### Laboratory Service
```
base/services/laboratory-service/
├── deployment.yaml      # Deployment with HL7/FHIR, 2-10 replicas
├── service.yaml         # ClusterIP service + ServiceAccount
└── hpa.yaml            # HPA scaling on lab orders (150/sec/pod)
```

#### Services Kustomization
```
base/services/
└── kustomization.yaml   # Aggregates all service resources
```

### Shared Resources (4 files)

```
base/shared/
├── configmap.yaml              # Shared configuration for all services
│                               # - Environment settings
│                               # - Service discovery
│                               # - Database/cache config
│                               # - Feature flags
│                               # - Compliance settings
│
├── secrets.yaml                # All service secrets
│                               # - Database credentials
│                               # - Redis credentials
│                               # - API keys for each service
│                               # - Encryption keys
│                               # NOTE: Contains CHANGEME placeholders
│
├── networkpolicy.yaml          # Network security policies
│                               # - API Gateway ingress/egress
│                               # - Backend service communication
│                               # - Default deny-all
│                               # - DNS and monitoring access
│
└── poddisruptionbudget.yaml    # High availability settings
                                # - PDB for each service
                                # - Minimum 1 pod available
```

### Ingress Configuration (2 files)

```
base/ingress/
├── ingress.yaml               # NGINX Ingress configuration
│                              # - Path-based routing to all services
│                              # - TLS/SSL termination
│                              # - Rate limiting (100 rps)
│                              # - CORS configuration
│                              # - Security headers
│                              # - WebSocket ingress
│                              # - WAF/ModSecurity
│
└── certificate.yaml           # cert-manager certificates
                               # - Let's Encrypt integration
                               # - Wildcard certificates
                               # - Auto-renewal
                               # - Production and staging issuers
```

## Regional Overlays

### Americas Region (5 files)

```
overlays/americas/
├── kustomization.yaml         # Main overlay configuration
│                              # - Namespace: healthcare-americas
│                              # - Name prefix: americas-
│                              # - 3 replicas per service
│                              # - Image tags: v1.2.3-americas
│                              # - ConfigMap/Secret generators
│
├── namespace.yaml             # Namespace definition
│                              # - Region: americas
│                              # - Istio injection enabled
│
├── configmap-patch.yaml       # Americas-specific configuration
│                              # - Region: us-east-1
│                              # - HIPAA/HITECH compliance
│                              # - Medicare/Medicaid features
│                              # - Epic/Cerner integration
│                              # - Currency: USD, CAD, BRL
│                              # - Languages: en-US, es-US, pt-BR
│
└── patches/
    ├── replicas.yaml          # Set 3 replicas for all services
    └── resources.yaml         # Production-level resources
                               # - Higher CPU/memory allocations
```

### Europe Region (5 files)

```
overlays/europe/
├── kustomization.yaml         # Main overlay configuration
│                              # - Namespace: healthcare-europe
│                              # - Name prefix: europe-
│                              # - 3-4 replicas per service
│                              # - Image tags: v1.2.3-europe
│
├── namespace.yaml             # Namespace definition
│                              # - Region: europe
│                              # - GDPR compliant label
│
├── configmap-patch.yaml       # Europe-specific configuration
│                              # - Region: eu-west-1
│                              # - GDPR compliance settings
│                              # - Right to erasure/portability
│                              # - Consent management
│                              # - Enhanced audit logging
│                              # - NHS/EHIC integration
│                              # - Currency: EUR, GBP, CHF
│                              # - Languages: en-GB, de-DE, fr-FR
│                              # - Privacy by design/default
│                              # - DPO contact information
│
└── patches/
    ├── replicas.yaml          # Set 3-4 replicas (higher for gateway)
    └── resources.yaml         # Production-level resources
```

### Africa Region (5 files)

```
overlays/africa/
├── kustomization.yaml         # Main overlay configuration
│                              # - Namespace: healthcare-africa
│                              # - Name prefix: africa-
│                              # - 2-3 replicas per service
│                              # - Image tags: v1.2.3-africa
│
├── namespace.yaml             # Namespace definition
│                              # - Region: africa
│
├── configmap-patch.yaml       # Africa-specific configuration
│                              # - Region: af-south-1
│                              # - POPIA compliance
│                              # - Mobile health features
│                              # - Offline mode support
│                              # - SMS/USSD integration
│                              # - Mobile money (M-Pesa)
│                              # - Low bandwidth optimization
│                              # - Community health workers
│                              # - DHIS2/OpenMRS integration
│                              # - Currency: ZAR, NGN, KES
│                              # - Languages: en-ZA, sw-KE, etc.
│
└── patches/
    ├── replicas.yaml          # Set 2-3 replicas (cost-optimized)
    └── resources.yaml         # Optimized resources for cost
```

## Scripts

### Deployment Script
```
deploy-regions.sh              # Multi-region deployment automation
Commands:
  - deploy <region>            # Deploy to specific region
  - deploy-all                 # Deploy to all regions
  - preview <region>           # Preview without applying
  - rollback <region>          # Rollback deployments
  - delete <region>            # Delete all resources
  - health <region>            # Check health status
  - logs <region> <service>    # View service logs
  - scale <region> <service> <replicas>  # Scale service
```

### Validation Script
```
validate-manifests.sh          # Manifest validation
Checks:
  - YAML syntax validation
  - Kustomize build validation
  - Secret placeholder detection
  - Resource limits presence
  - Health probes presence
  - Security contexts presence
  - Service accounts presence
  - Report generation
```

### Legacy Deploy Script
```
deploy.sh                      # Original deployment script
```

## Documentation

### Main Documentation
```
KUSTOMIZE-README.md           # Complete deployment guide
                              # - Architecture overview
                              # - Service descriptions
                              # - Regional configurations
                              # - Security features
                              # - HA features
                              # - Deployment instructions
                              # - Monitoring setup
                              # - Troubleshooting guide
```

### Summary Documents
```
DEPLOYMENT-SUMMARY.md         # Deployment summary
                              # - Resource overview
                              # - Security features
                              # - HA features
                              # - Resource allocation tables
                              # - Deployment order
                              # - Next steps

QUICK-REFERENCE.md            # Quick reference guide
                              # - Common commands
                              # - Service names
                              # - Region names
                              # - Troubleshooting quick fixes
                              # - Monitoring endpoints

MANIFEST-INDEX.md             # This file
                              # - Complete file index
                              # - File descriptions
```

### Architecture Documentation
```
ARCHITECTURE.md               # Platform architecture
INDEX.md                      # Platform index
README.md                     # Main README
QUICK-START.md               # Quick start guide
DEPLOYMENT-CHECKLIST.md      # Deployment checklist
```

## Key Features by Component

### Deployments
- Non-root containers (UID 1000)
- Read-only root filesystem
- No privilege escalation
- Security contexts
- Resource requests and limits
- Liveness/readiness/startup probes
- Pod anti-affinity rules
- Graceful shutdown
- Volume mounts for tmp/cache

### Services
- ClusterIP type
- Session affinity where needed
- Multiple port definitions (HTTP, gRPC, metrics)
- Prometheus annotations
- AWS ELB annotations

### Service Accounts
- AWS IAM role annotations (IRSA)
- Service-specific permissions

### HPA (Horizontal Pod Autoscalers)
- CPU-based scaling (70% target)
- Memory-based scaling (80% target)
- Custom metrics (RPS, sessions, etc.)
- Scale-up/down policies
- Stabilization windows

### Ingress
- NGINX Ingress Controller
- TLS/SSL termination
- Path-based routing
- Rate limiting
- CORS configuration
- Security headers (HSTS, CSP, etc.)
- WebSocket support
- WAF/ModSecurity
- Session affinity for WebSocket

### Network Policies
- Default deny-all
- Allow DNS queries
- Allow monitoring scraping
- Service-to-service communication
- Egress to databases/cache

### ConfigMaps
- Environment configuration
- Service discovery
- Feature flags
- Compliance settings
- Region-specific overrides

### Secrets
- Database credentials
- API keys
- Encryption keys
- Service-specific secrets
- NOTE: Contains CHANGEME placeholders to be replaced

## Pre-Deployment Checklist

- [ ] Update all secrets in `base/shared/secrets.yaml`
- [ ] Replace domain names in `base/ingress/ingress.yaml`
- [ ] Update IAM role ARNs in all `service.yaml` files
- [ ] Update image tags in overlay `kustomization.yaml` files
- [ ] Configure DNS records
- [ ] Set up AWS EKS clusters
- [ ] Install cert-manager
- [ ] Install NGINX Ingress Controller
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Set up logging (ELK/CloudWatch)
- [ ] Configure backups
- [ ] Run validation: `./validate-manifests.sh`
- [ ] Preview deployment: `./deploy-regions.sh preview <region>`

## Deployment Order

1. **Validate**: `./validate-manifests.sh`
2. **Preview**: `./deploy-regions.sh preview americas`
3. **Deploy**: `./deploy-regions.sh deploy americas`
4. **Verify**: `./deploy-regions.sh health americas`
5. **Repeat**: For europe and africa regions

## Maintenance

### Update Configuration
1. Edit relevant ConfigMap or patch files
2. Apply: `kubectl apply -k overlays/<region>/`
3. Pods will auto-reload or restart

### Update Secrets
1. Edit `base/shared/secrets.yaml`
2. Apply: `kubectl apply -k overlays/<region>/`
3. Restart affected pods

### Scale Service
```bash
./deploy-regions.sh scale <region> <service> <replicas>
```

### View Logs
```bash
./deploy-regions.sh logs <region> <service>
```

### Rollback
```bash
./deploy-regions.sh rollback <region>
```

## Support

For detailed information, refer to:
- `KUSTOMIZE-README.md` - Complete documentation
- `DEPLOYMENT-SUMMARY.md` - Deployment overview
- `QUICK-REFERENCE.md` - Quick commands

## License

Copyright © 2024 Healthcare Platform. All rights reserved.
