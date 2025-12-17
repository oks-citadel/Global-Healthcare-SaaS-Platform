# Kubernetes Architecture - Unified Healthcare Platform

Visual representation and detailed explanation of the Kubernetes deployment architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Internet / Users                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS (443)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Azure Load Balancer                                  │
│                    (External Load Balancer)                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   NGINX Ingress Controller                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ • TLS Termination (Let's Encrypt)                                 │  │
│  │ • Rate Limiting (100 req/min, 5000 req/hour)                      │  │
│  │ • ModSecurity WAF (OWASP Core Rules)                              │  │
│  │ • CORS Configuration                                              │  │
│  │ • Security Headers (HSTS, CSP, X-Frame-Options)                   │  │
│  │ • DDoS Protection                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Path Routing
                                 │ /api/v1/* → API Service
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      API Service (ClusterIP)                             │
│                    Session Affinity Enabled                              │
│                                                                          │
│  Ports:                                                                  │
│  • 80 → 8080 (HTTP)                                                     │
│  • 8080 → 8080 (Health)                                                 │
│  • 9090 → 9090 (Metrics)                                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Load Balancing
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐        ┌───────────────┐       ┌───────────────┐
│   API Pod 1   │        │   API Pod 2   │       │   API Pod 3   │
│               │        │               │       │               │
│ ┌───────────┐ │        │ ┌───────────┐ │       │ ┌───────────┐ │
│ │Container  │ │        │ │Container  │ │       │ │Container  │ │
│ │Node.js API│ │        │ │Node.js API│ │       │ │Node.js API│ │
│ │Port: 8080 │ │        │ │Port: 8080 │ │       │ │Port: 8080 │ │
│ └───────────┘ │        │ └───────────┘ │       │ └───────────┘ │
│               │        │               │       │               │
│ Resources:    │        │ Resources:    │       │ Resources:    │
│ CPU: 500m-2000m        │ CPU: 500m-2000m       │ CPU: 500m-2000m│
│ Mem: 512Mi-2Gi│        │ Mem: 512Mi-2Gi│       │ Mem: 512Mi-2Gi│
│               │        │               │       │               │
│ Security:     │        │ Security:     │       │ Security:     │
│ • Non-root    │        │ • Non-root    │       │ • Non-root    │
│ • Read-only FS│        │ • Read-only FS│       │ • Read-only FS│
│ • No caps     │        │ • No caps     │       │ • No caps     │
└───────┬───────┘        └───────┬───────┘       └───────┬───────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
        ┌──────────────┐  ┌──────────┐  ┌─────────────┐
        │  PostgreSQL  │  │  Redis   │  │  Azure      │
        │  (Azure)     │  │  Cache   │  │  Services   │
        │              │  │          │  │             │
        │  Port: 5432  │  │Port: 6379│  │ • Key Vault │
        │  SSL: TLS    │  │          │  │ • Storage   │
        └──────────────┘  └──────────┘  │ • SendGrid  │
                                        │ • Twilio    │
                                        └─────────────┘
```

## Network Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster (AKS)                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Namespace: unified-health                    │    │
│  │                                                                 │    │
│  │  Network Policies Applied:                                      │    │
│  │  • Default Deny All Ingress                                     │    │
│  │  • Default Deny All Egress                                      │    │
│  │                                                                 │    │
│  │  Allowed Traffic:                                               │    │
│  │  ┌──────────────────────────────────────────────────────────┐  │    │
│  │  │ INGRESS:                                                  │  │    │
│  │  │ ✓ From: ingress-nginx namespace → Port: 8080            │  │    │
│  │  │ ✓ From: monitoring namespace → Port: 8080, 9090         │  │    │
│  │  │ ✓ From: kube-system (health checks) → Port: 8080        │  │    │
│  │  │ ✓ From: Same namespace (inter-pod) → Port: 8080         │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  │                                                                 │    │
│  │  ┌──────────────────────────────────────────────────────────┐  │    │
│  │  │ EGRESS:                                                   │  │    │
│  │  │ ✓ To: database namespace → Port: 5432 (PostgreSQL)       │  │    │
│  │  │ ✓ To: same namespace → Port: 6379 (Redis)                │  │    │
│  │  │ ✓ To: kube-system → Port: 53 (DNS)                       │  │    │
│  │  │ ✓ To: any → Port: 443 (HTTPS - Azure services)           │  │    │
│  │  │ ✓ To: any → Port: 587, 465 (SMTP - email)                │  │    │
│  │  │ ✓ To: Kubernetes API → Port: 443, 6443                   │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Security Layers                                 │
│                                                                          │
│  Layer 1: Network Security                                              │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Azure NSG (Network Security Groups)                           │    │
│  │ • Kubernetes Network Policies                                   │    │
│  │ • Private AKS cluster (optional)                                │    │
│  │ • Azure Firewall / Application Gateway                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Layer 2: Ingress Security                                              │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • TLS/SSL termination (Let's Encrypt)                           │    │
│  │ • Rate limiting (per IP, per route)                             │    │
│  │ • ModSecurity WAF (OWASP Core Rules)                            │    │
│  │ • DDoS protection                                               │    │
│  │ • Request size limits                                           │    │
│  │ • Security headers (HSTS, CSP, X-Frame-Options, etc.)           │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Layer 3: Application Security                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • JWT authentication                                            │    │
│  │ • RBAC authorization                                            │    │
│  │ • Input validation                                              │    │
│  │ • SQL injection prevention                                      │    │
│  │ • XSS protection                                                │    │
│  │ • CSRF protection                                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Layer 4: Pod Security                                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Run as non-root user (UID 1001)                               │    │
│  │ • Read-only root filesystem                                     │    │
│  │ • Drop all capabilities                                         │    │
│  │ • No privilege escalation                                       │    │
│  │ • Security context constraints                                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Layer 5: Identity & Access                                             │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Azure Workload Identity                                       │    │
│  │ • Kubernetes RBAC                                               │    │
│  │ • Service Account with minimal permissions                      │    │
│  │ • Azure Key Vault integration                                   │    │
│  │ • Federated identity credentials                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Layer 6: Data Security                                                 │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Encryption at rest (Azure Storage Service Encryption)         │    │
│  │ • Encryption in transit (TLS 1.2+)                              │    │
│  │ • PHI-specific encryption                                       │    │
│  │ • Secret management (Azure Key Vault)                           │    │
│  │ • Database encryption (PostgreSQL SSL)                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## High Availability Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     High Availability Components                         │
│                                                                          │
│  1. Multi-Replica Deployment                                            │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ Production: 3 replicas minimum                              │     │
│     │ Staging: 2 replicas minimum                                 │     │
│     │ Pod Anti-Affinity: Spread across different nodes            │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  2. Horizontal Pod Autoscaler (HPA)                                     │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ Production: 3-20 replicas                                   │     │
│     │ Staging: 2-10 replicas                                      │     │
│     │ Metrics: CPU (60-70%), Memory (70-80%)                      │     │
│     │ Scale up: Fast (evaluate every 15s)                         │     │
│     │ Scale down: Conservative (evaluate every 5m)                │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  3. Pod Disruption Budget (PDB)                                         │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ Production: minAvailable = 2                                │     │
│     │ Staging: minAvailable = 1                                   │     │
│     │ Ensures availability during voluntary disruptions            │     │
│     │ (node drains, rolling updates, cluster autoscaling)          │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  4. Health Checks                                                       │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ Liveness Probe:                                             │     │
│     │   Path: /health                                             │     │
│     │   Initial Delay: 30s                                        │     │
│     │   Period: 10s                                               │     │
│     │   Timeout: 5s                                               │     │
│     │   Failure Threshold: 3                                      │     │
│     │                                                             │     │
│     │ Readiness Probe:                                            │     │
│     │   Path: /ready                                              │     │
│     │   Initial Delay: 5s                                         │     │
│     │   Period: 5s                                                │     │
│     │   Timeout: 3s                                               │     │
│     │   Failure Threshold: 3                                      │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  5. Rolling Update Strategy                                             │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ Max Surge: 1 (one extra pod during update)                  │     │
│     │ Max Unavailable: 0 (no downtime during update)              │     │
│     │ Zero-downtime deployments                                   │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  6. Multi-AZ Deployment                                                 │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ AKS nodes spread across availability zones                  │     │
│     │ Pod anti-affinity ensures cross-zone distribution           │     │
│     │ Zone-redundant storage for persistent data                  │     │
│     └────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Request Flow                                   │
│                                                                          │
│  1. User Request                                                        │
│     ↓                                                                   │
│  2. Azure Load Balancer (L4 load balancing)                            │
│     ↓                                                                   │
│  3. NGINX Ingress Controller                                            │
│     ├─ TLS termination                                                 │
│     ├─ Rate limiting check                                             │
│     ├─ WAF rules evaluation                                            │
│     ├─ Path routing (/api/v1/*)                                        │
│     └─ Security header injection                                       │
│     ↓                                                                   │
│  4. API Service (ClusterIP)                                             │
│     ├─ Session affinity (if enabled)                                   │
│     └─ Load balancing across pods                                      │
│     ↓                                                                   │
│  5. API Pod                                                             │
│     ├─ Readiness check (is pod ready?)                                 │
│     ├─ JWT validation                                                  │
│     ├─ RBAC authorization                                              │
│     ├─ Input validation                                                │
│     └─ Business logic execution                                        │
│     ↓                                                                   │
│  6. Data Layer                                                          │
│     ├─ Cache check (Redis)                                             │
│     │  └─ Cache hit → Return cached data                               │
│     │  └─ Cache miss → Query database                                  │
│     ├─ Database query (PostgreSQL)                                     │
│     │  └─ Connection pooling                                           │
│     │  └─ SSL/TLS encryption                                           │
│     └─ External services (if needed)                                   │
│        ├─ Email (SendGrid)                                             │
│        ├─ SMS (Twilio)                                                 │
│        ├─ Storage (Azure Blob)                                         │
│        └─ Secrets (Azure Key Vault)                                    │
│     ↓                                                                   │
│  7. Response                                                            │
│     ├─ Data serialization (JSON)                                       │
│     ├─ Cache update (if applicable)                                    │
│     ├─ Audit logging                                                   │
│     └─ Metrics recording                                               │
│     ↓                                                                   │
│  8. NGINX Ingress → Client                                              │
│     ├─ Response compression (gzip)                                     │
│     ├─ Security headers                                                │
│     └─ HTTPS encryption                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Monitoring & Observability Stack                      │
│                                                                          │
│  Metrics Collection                                                     │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  API Pods ──→ Prometheus Metrics Endpoint (/metrics:9090)      │    │
│  │      │                      ↓                                   │    │
│  │      │            Prometheus Server                             │    │
│  │      │                      │                                   │    │
│  │      │                      ↓                                   │    │
│  │      │              Grafana Dashboards                          │    │
│  │      │                                                          │    │
│  │      └──→ Azure Monitor / Application Insights                 │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Logging                                                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  API Pods ──→ stdout/stderr (JSON structured logs)             │    │
│  │                      ↓                                          │    │
│  │              Container Runtime                                  │    │
│  │                      ↓                                          │    │
│  │              Azure Monitor Logs                                 │    │
│  │                      ↓                                          │    │
│  │              Log Analytics Workspace                            │    │
│  │                      ↓                                          │    │
│  │              Kusto Queries / Dashboards                         │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Tracing (Optional)                                                     │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  API Pods ──→ OpenTelemetry SDK                                │    │
│  │                      ↓                                          │    │
│  │              OpenTelemetry Collector                            │    │
│  │                      ↓                                          │    │
│  │              Azure Monitor / Jaeger                             │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Alerting                                                               │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  Prometheus Rules ──→ Alertmanager                             │    │
│  │                           ↓                                     │    │
│  │                    ┌──────┴───────┐                            │    │
│  │                    │              │                            │    │
│  │                    ↓              ↓                            │    │
│  │                 Email         PagerDuty                        │    │
│  │                                   │                            │    │
│  │                                   ↓                            │    │
│  │                            On-Call Engineer                    │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                                    │
│                                                                          │
│  1. Developer Push                                                      │
│     │                                                                   │
│     ├─ Git push to feature branch                                      │
│     └─ Pull request created                                            │
│                                                                          │
│  2. CI Pipeline (GitHub Actions / Azure DevOps)                        │
│     │                                                                   │
│     ├─ Checkout code                                                   │
│     ├─ Run linting (ESLint, Prettier)                                  │
│     ├─ Run unit tests (Jest)                                           │
│     ├─ Run integration tests                                           │
│     ├─ Security scanning (Snyk, SonarQube)                             │
│     ├─ Build Docker image                                              │
│     ├─ Tag image (git commit SHA)                                      │
│     ├─ Push to ACR                                                     │
│     └─ Generate deployment artifacts                                   │
│                                                                          │
│  3. Staging Deployment (Automatic)                                      │
│     │                                                                   │
│     ├─ Update staging kustomization with new image tag                 │
│     ├─ kubectl apply -k overlays/staging                               │
│     ├─ Wait for rollout completion                                     │
│     ├─ Run smoke tests                                                 │
│     ├─ Run E2E tests                                                   │
│     └─ Performance tests (load testing)                                │
│                                                                          │
│  4. Production Approval                                                 │
│     │                                                                   │
│     ├─ Manual approval gate                                            │
│     ├─ Security review                                                 │
│     ├─ Compliance review                                               │
│     └─ Change management approval                                      │
│                                                                          │
│  5. Production Deployment (Manual / Scheduled)                          │
│     │                                                                   │
│     ├─ Backup current state                                            │
│     ├─ Update production kustomization                                 │
│     ├─ kubectl apply -k overlays/production                            │
│     ├─ Monitor rollout                                                 │
│     ├─ Verify health checks                                            │
│     ├─ Run smoke tests                                                 │
│     └─ Monitor metrics for 24-48 hours                                 │
│                                                                          │
│  6. Post-Deployment                                                     │
│     │                                                                   │
│     ├─ Send deployment notification                                    │
│     ├─ Update documentation                                            │
│     ├─ Tag release in Git                                              │
│     └─ Archive deployment artifacts                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Resource Topology

```
Kubernetes Cluster
│
├─ Namespaces
│  ├─ unified-health-staging
│  │  ├─ Deployments
│  │  │  └─ staging-unified-health-api (2 replicas)
│  │  ├─ Services
│  │  │  ├─ staging-unified-health-api (ClusterIP)
│  │  │  └─ staging-unified-health-api-headless
│  │  ├─ ConfigMaps
│  │  │  ├─ staging-unified-health-config
│  │  │  └─ staging-config
│  │  ├─ Secrets
│  │  │  ├─ staging-unified-health-secrets
│  │  │  └─ staging-secrets
│  │  ├─ ServiceAccounts
│  │  │  └─ staging-unified-health-api
│  │  ├─ Ingress
│  │  │  └─ staging-unified-health-api-ingress
│  │  ├─ HPA
│  │  │  └─ staging-unified-health-api-hpa
│  │  ├─ PDB
│  │  │  └─ staging-unified-health-api-pdb
│  │  └─ NetworkPolicies
│  │     ├─ default-deny-all-ingress
│  │     ├─ default-deny-all-egress
│  │     ├─ allow-ingress-to-api
│  │     └─ allow-api-egress-*
│  │
│  ├─ unified-health-production
│  │  ├─ Deployments
│  │  │  └─ prod-unified-health-api (3 replicas)
│  │  ├─ Services
│  │  │  ├─ prod-unified-health-api (ClusterIP)
│  │  │  └─ prod-unified-health-api-headless
│  │  ├─ ConfigMaps
│  │  │  ├─ prod-unified-health-config
│  │  │  └─ production-config
│  │  ├─ Secrets
│  │  │  ├─ prod-unified-health-secrets
│  │  │  └─ production-secrets
│  │  ├─ ServiceAccounts
│  │  │  └─ prod-unified-health-api
│  │  ├─ Ingress
│  │  │  └─ prod-unified-health-api-ingress
│  │  ├─ HPA
│  │  │  └─ prod-unified-health-api-hpa
│  │  ├─ PDB
│  │  │  ├─ prod-unified-health-api-pdb
│  │  │  └─ prod-unified-health-api-pdb-production
│  │  └─ NetworkPolicies
│  │     ├─ default-deny-all-ingress
│  │     ├─ default-deny-all-egress
│  │     ├─ allow-ingress-to-api
│  │     └─ allow-api-egress-*
│  │
│  ├─ ingress-nginx
│  │  └─ NGINX Ingress Controller
│  │
│  ├─ cert-manager
│  │  └─ Certificate Management
│  │
│  └─ azure-workload-identity-system
│     └─ Workload Identity Webhook
│
└─ Cluster-Wide Resources
   ├─ ClusterRoles
   │  └─ unified-health-api-clusterrole
   ├─ ClusterRoleBindings
   │  └─ unified-health-api-clusterrolebinding
   └─ ClusterIssuers
      └─ letsencrypt-prod
```

## Scaling Behavior

```
Time-based scaling and load patterns:

  Replicas
    20 ┤                                    ╭─────╮
       │                               ╭────╯     ╰────╮
    15 ┤                          ╭────╯                ╰────╮
       │                     ╭────╯                          ╰────╮
    10 ┤                ╭────╯                                    ╰────╮
       │           ╭────╯                                              ╰────
     5 ┤      ╭────╯
       │ ╭────╯
     3 ┼─╯ (min replicas in production)
       │
     0 └─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────
           0000  0400  0800  1200  1600  2000  0000  0400  0800  1200  1600
                                Time of Day

HPA Scaling Logic:
- Scale up when CPU > 60% or Memory > 70% for 15 seconds
- Scale down when CPU < 60% and Memory < 70% for 5 minutes
- Max scale-up: 2x current replicas per scaling event
- Max scale-down: 50% of current replicas per scaling event
```

## Disaster Recovery

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Disaster Recovery Strategy                           │
│                                                                          │
│  RTO (Recovery Time Objective): 30 minutes                              │
│  RPO (Recovery Point Objective): 5 minutes                              │
│                                                                          │
│  Backup Strategy:                                                       │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Kubernetes manifests: Git version control                     │    │
│  │ • Database: Continuous backup to geo-redundant storage          │    │
│  │ • Secrets: Azure Key Vault with geo-replication                 │    │
│  │ • Container images: ACR with geo-replication                    │    │
│  │ • Configuration state: Daily snapshots                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Recovery Procedures:                                                   │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 1. Activate secondary AKS cluster                               │    │
│  │ 2. Restore database from backup                                 │    │
│  │ 3. Deploy application using Git manifests                       │    │
│  │ 4. Update DNS to point to secondary region                      │    │
│  │ 5. Verify application functionality                             │    │
│  │ 6. Monitor for issues                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2025-12-17
**Architecture Version**: 1.0.0
