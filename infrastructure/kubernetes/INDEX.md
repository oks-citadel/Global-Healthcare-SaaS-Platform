# Kubernetes Configuration Files - Index

Complete index of all Kubernetes deployment configurations for the Unified Healthcare Platform.

## Directory Structure

```
infrastructure/kubernetes/
├── base/                              # Base Kubernetes configurations
│   ├── namespace.yaml                # Namespace definition
│   ├── configmap.yaml                # Application ConfigMap (96 lines)
│   ├── secrets.yaml                  # Secrets template (116 lines)
│   ├── service-account.yaml          # ServiceAccount + RBAC (189 lines)
│   ├── api-deployment.yaml           # API Deployment (155 lines)
│   ├── api-service.yaml              # ClusterIP Services (60 lines)
│   ├── ingress.yaml                  # NGINX Ingress + TLS (175 lines)
│   ├── network-policy.yaml           # Network Policies (232 lines)
│   ├── poddisruptionbudget.yaml      # PodDisruptionBudget (44 lines)
│   └── kustomization.yaml            # Base Kustomization (66 lines)
├── overlays/
│   ├── staging/
│   │   └── kustomization.yaml        # Staging overrides (110 lines)
│   └── production/
│       ├── kustomization.yaml        # Production overrides (163 lines)
│       └── production-pdb.yaml       # Production PDB override (24 lines)
├── README.md                          # Comprehensive deployment guide
├── QUICK-START.md                     # Quick reference commands
├── DEPLOYMENT-CHECKLIST.md            # Pre/post deployment checklist
└── deploy.sh                          # Deployment automation script
```

## File Descriptions

### Base Configuration Files

#### 1. namespace.yaml
**Purpose**: Defines the Kubernetes namespace for the application
**Contents**:
- Namespace definition with labels
- Resource quotas (optional)
- Limit ranges (optional)

#### 2. configmap.yaml (96 lines)
**Purpose**: Non-sensitive application configuration
**Contents**:
- Application settings (NODE_ENV, PORT, LOG_LEVEL)
- Service URLs (Redis, Database, Email, Notification)
- Feature flags (HIPAA, GDPR, Multi-tenancy, Telemedicine, etc.)
- API configuration (rate limits, timeouts, payload size)
- CORS settings
- Session configuration
- Cache TTL settings
- Health check paths
- File upload configuration
- Audit logging settings
- Security headers configuration
- Monitoring settings
- Timezone configuration

**Key Feature Flags**:
- `feature-hipaa-compliance: "true"`
- `feature-gdpr-compliance: "true"`
- `feature-multi-tenancy: "true"`
- `feature-telemedicine: "true"`
- `feature-appointment-scheduling: "true"`
- `feature-prescription-management: "true"`

#### 3. secrets.yaml (116 lines)
**Purpose**: Template for sensitive configuration (Azure Key Vault integration)
**Contents**:
- Database credentials (username, password, connection URL)
- JWT secrets (signing, refresh)
- Redis password
- Encryption keys (general, PHI-specific)
- API keys (SendGrid, Twilio, Stripe)
- Azure Storage credentials
- OAuth2/OIDC configuration
- Session secrets
- Webhook signing secrets

**Important Notes**:
- This is a TEMPLATE file with placeholders
- Actual values should come from Azure Key Vault
- Never commit actual secrets to source control
- Supports multiple population methods (CSI Driver, External Secrets, envsubst)

#### 4. service-account.yaml (189 lines)
**Purpose**: Service account with Azure Workload Identity and RBAC
**Contents**:
- ServiceAccount with Azure Workload Identity annotations
- Role with minimal required permissions
- RoleBinding to bind role to service account
- ClusterRole for cluster-wide permissions
- ClusterRoleBinding
- Setup instructions for Azure Workload Identity

**Permissions Granted**:
- Read ConfigMaps and Secrets
- Read Services and Endpoints
- Read Pods (for service discovery)
- Create Events (for logging)
- Read Nodes (cluster awareness)

**Azure Integration**:
- Azure Workload Identity annotations
- Federated identity credential configuration
- Key Vault RBAC integration
- Storage account RBAC integration

#### 5. api-deployment.yaml (155 lines)
**Purpose**: Kubernetes Deployment for the API
**Contents**:
- Deployment with 3 replicas (production default)
- Container specification with resource limits
- Health checks (liveness and readiness probes)
- Security context (non-root, read-only filesystem)
- Environment variables (from ConfigMaps and Secrets)
- Volume mounts
- Pod anti-affinity rules
- Service definition
- ServiceAccount reference
- HorizontalPodAutoscaler (HPA) configuration

**Resource Limits** (Base):
- CPU: 200m request, 1000m limit
- Memory: 256Mi request, 1Gi limit

**Health Checks**:
- Liveness: `/health` endpoint
- Readiness: `/ready` endpoint

**Autoscaling**:
- Min replicas: 3
- Max replicas: 20
- CPU target: 70%
- Memory target: 80%

#### 6. api-service.yaml (60 lines)
**Purpose**: ClusterIP service for internal communication
**Contents**:
- Main ClusterIP service
- Headless service for direct pod discovery
- Port mappings (HTTP, health, metrics)
- Session affinity configuration
- Service annotations for Prometheus scraping

**Ports Exposed**:
- 80 → 8080 (HTTP)
- 8080 → 8080 (Health checks)
- 9090 → metrics (Prometheus)

#### 7. ingress.yaml (175 lines)
**Purpose**: NGINX Ingress with TLS, rate limiting, and security
**Contents**:
- Ingress resource with TLS configuration
- NGINX-specific annotations
- Rate limiting configuration
- CORS settings
- Security headers
- ModSecurity WAF configuration
- Certificate resource (cert-manager)
- ClusterIssuer for Let's Encrypt

**Security Features**:
- TLS/SSL enforcement
- Rate limiting (100 req/min, 5000 req/hour)
- CORS configuration
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- ModSecurity WAF with OWASP Core Rules
- DDoS protection
- Request size limits (10MB)

**Paths Configured**:
- `/api/v1/*` → API service
- `/health` → Health check
- `/ready` → Readiness check

#### 8. network-policy.yaml (232 lines)
**Purpose**: Network policies for pod-to-pod communication security
**Contents**:
- Default deny all ingress
- Default deny all egress
- Allow ingress from NGINX Ingress Controller
- Allow ingress from Prometheus
- Allow egress to PostgreSQL
- Allow egress to Redis
- Allow egress to DNS (CoreDNS)
- Allow egress to external services (HTTPS)
- Allow egress to Kubernetes API server
- Allow inter-pod communication within API
- Allow egress to email services (SMTP)
- Allow egress to Azure services

**Security Posture**:
- Zero-trust network model
- Explicit allow rules only
- Namespace isolation
- Protocol-specific rules

#### 9. poddisruptionbudget.yaml (44 lines)
**Purpose**: Ensures high availability during voluntary disruptions
**Contents**:
- PodDisruptionBudget with minAvailable configuration
- Unhealthy pod eviction policy
- Selector for API pods
- Documentation on PDB usage

**Configuration**:
- Base: minAvailable = 1
- Staging override: minAvailable = 1
- Production override: minAvailable = 2

#### 10. kustomization.yaml (66 lines)
**Purpose**: Base Kustomize configuration
**Contents**:
- Resource list
- Common labels and annotations
- ConfigMap generator
- Secret generator
- Image configuration
- Replica count
- JSON patches
- Variable substitution

### Overlay Configuration Files

#### Staging (overlays/staging/kustomization.yaml) - 110 lines
**Purpose**: Staging-specific configuration overrides
**Contents**:
- Reference to base configuration
- Staging namespace
- Name prefix for resources
- Staging-specific labels and annotations
- Replica count: 2
- Resource limits (lower than production)
- HPA configuration (2-10 replicas)
- PDB configuration (minAvailable = 1)
- Ingress domain override (api-staging.unifiedhealth.com)
- ConfigMap patches (debug logging)
- Image tag override (staging-latest)

**Resource Limits** (Staging):
- CPU: 200m request, 500m limit
- Memory: 256Mi request, 512Mi limit

#### Production (overlays/production/kustomization.yaml) - 163 lines
**Purpose**: Production-specific configuration overrides
**Contents**:
- Reference to base configuration
- Production namespace
- Name prefix for resources
- Production-specific labels (compliance tags)
- Replica count: 3
- Higher resource limits
- HPA configuration (3-20 replicas)
- PDB configuration (minAvailable = 2)
- Ingress domain override (api.unifiedhealth.com)
- ConfigMap patches (info logging, higher rate limits)
- Image tag with specific version (v1.0.0)
- Pod affinity rules (required anti-affinity)
- Node affinity preferences
- Tolerations for production nodes

**Resource Limits** (Production):
- CPU: 500m request, 2000m limit
- Memory: 512Mi request, 2Gi limit

**Additional Production Features**:
- Stricter anti-affinity rules
- Node affinity for specific instance types
- Higher database connection pool (50)
- Increased rate limits (200 req/min, 10000 req/hour)

#### Production PDB Override (overlays/production/production-pdb.yaml) - 24 lines
**Purpose**: Production-specific PodDisruptionBudget
**Contents**:
- PDB with minAvailable = 2
- Production-specific labels
- Unhealthy pod eviction policy

## Documentation Files

### README.md
**Purpose**: Comprehensive deployment guide
**Sections**:
- Overview and architecture
- Prerequisites (tools and Azure resources)
- Directory structure
- Configuration file descriptions
- Deployment process (step-by-step)
- Environment-specific deployments
- Security configuration
- Monitoring and observability
- Troubleshooting guide
- Maintenance procedures
- Best practices

**Length**: ~700 lines
**Audience**: DevOps engineers, platform engineers

### QUICK-START.md
**Purpose**: Quick reference for common commands
**Sections**:
- Prerequisites checklist
- Quick deploy commands
- Common operations
- Troubleshooting quick fixes
- Monitoring commands
- Cleanup commands
- Performance tuning
- Health check endpoints

**Length**: ~300 lines
**Audience**: Developers, on-call engineers

### DEPLOYMENT-CHECKLIST.md
**Purpose**: Comprehensive deployment checklist
**Sections**:
- Pre-deployment checklist (Azure infrastructure, secrets, components)
- Staging deployment checklist
- Production deployment checklist
- Security validation
- Compliance validation (HIPAA/GDPR)
- Monitoring setup
- Documentation requirements
- Rollback preparation
- Post-deployment tasks
- Emergency contacts
- Sign-off section

**Length**: ~400 lines
**Audience**: Release managers, DevOps leads

## Automation Files

### deploy.sh
**Purpose**: Automated deployment script
**Features**:
- Prerequisites checking
- Environment variable configuration
- AKS connection
- Environment-specific deployment
- Deployment verification
- Rollback capability
- Color-coded output
- Interactive confirmation

**Usage**:
```bash
./deploy.sh staging deploy     # Deploy to staging
./deploy.sh production deploy  # Deploy to production
./deploy.sh staging verify     # Verify staging deployment
./deploy.sh production rollback # Rollback production
```

**Length**: ~250 lines

## Configuration Summary

### Namespaces
- **Staging**: `unified-health-staging`
- **Production**: `unified-health-production`

### Domains
- **Staging**: `api-staging.unifiedhealth.com`
- **Production**: `api.unifiedhealth.com`

### Replicas
- **Staging**: 2 (min), 10 (max with HPA)
- **Production**: 3 (min), 20 (max with HPA)

### Resource Allocations

| Environment | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-------------|-------------|-----------|----------------|--------------|
| Base        | 200m        | 1000m     | 256Mi          | 1Gi          |
| Staging     | 200m        | 500m      | 256Mi          | 512Mi        |
| Production  | 500m        | 2000m     | 512Mi          | 2Gi          |

### Security Features
- Network Policies (zero-trust model)
- RBAC with minimal permissions
- Azure Workload Identity
- TLS/SSL enforcement
- Rate limiting
- ModSecurity WAF
- Security headers
- Pod Security Context (non-root, read-only filesystem)
- Secret management via Azure Key Vault

### Compliance Features
- HIPAA compliance settings
- GDPR compliance settings
- Audit logging (7-year retention)
- PHI encryption
- Access controls
- Data retention policies

### High Availability Features
- Multiple replicas (3 in production)
- Pod anti-affinity
- PodDisruptionBudget
- Health checks (liveness and readiness)
- Horizontal Pod Autoscaler
- Load balancing via service

### Monitoring & Observability
- Prometheus metrics
- Health check endpoints
- Readiness checks
- Structured logging
- Distributed tracing (optional)
- Application Insights integration

## Deployment Workflow

1. **Prerequisites**: Install tools, create Azure resources
2. **Configuration**: Populate Azure Key Vault with secrets
3. **Azure Workload Identity**: Configure federated identity
4. **Staging Deployment**: Deploy and test in staging
5. **Validation**: Run integration and E2E tests
6. **Production Deployment**: Deploy to production with approval
7. **Monitoring**: Monitor deployment for 24-48 hours
8. **Documentation**: Update runbooks and documentation

## Maintenance Tasks

### Regular Tasks
- Certificate renewal (automated via cert-manager)
- Security updates (monthly)
- Dependency updates (quarterly)
- Performance review (quarterly)
- Compliance audit (annually)

### Emergency Procedures
- Rollback procedure documented
- Incident response plan
- Escalation contacts
- Post-mortem template

## Support and Resources

- **Documentation**: Full README with 700+ lines
- **Quick Reference**: QUICK-START guide
- **Checklist**: Comprehensive deployment checklist
- **Automation**: Deployment script for common tasks
- **Monitoring**: Health checks and metrics
- **Troubleshooting**: Common issues and solutions

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0.0   | 2025-12-17 | Initial production-ready release |

## Contributors

This configuration was designed for:
- **Platform**: Unified Healthcare Platform
- **Compliance**: HIPAA, GDPR, SOC2
- **Environment**: Azure Kubernetes Service (AKS)
- **Features**: Multi-tenancy, telemedicine, AI diagnostics

---

**Total Files Created**: 17
**Total Lines of Configuration**: ~2,000+ lines
**Environments Supported**: Staging, Production
**Cloud Provider**: Microsoft Azure
**Orchestration**: Kubernetes with Kustomize

---

**Last Updated**: 2025-12-17
