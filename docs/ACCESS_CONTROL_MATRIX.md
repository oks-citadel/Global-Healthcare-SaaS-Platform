# Unified Health Access Control Matrix

## Overview

This document defines the access control segmentation for the Unified Health Global Healthcare SaaS Platform. It establishes clear boundaries between operational teams (NetOps, SecOps, AppOps, DevOps) and their respective access levels to applications, services, and infrastructure.

---

## Team Definitions

| Team       | Role                   | Responsibility                                                                        |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------- |
| **NetOps** | Network Operations     | Database connectivity, network security groups, load balancers, DNS, VPNs             |
| **SecOps** | Security Operations    | Security monitoring, incident response, compliance auditing, vulnerability management |
| **AppOps** | Application Operations | Application monitoring, scaling, configuration management, incident triage            |
| **DevOps** | Development Operations | CI/CD pipelines, container orchestration, infrastructure as code, deployments         |

---

## Application Access Matrix

### Frontend Applications (`/apps`)

| Application       | Description                   | NetOps | SecOps | AppOps     | DevOps |
| ----------------- | ----------------------------- | ------ | ------ | ---------- | ------ |
| `web`             | Patient Portal (Next.js)      | Read   | Read   | Read/Write | Full   |
| `admin`           | Admin Dashboard (Next.js)     | Read   | Full   | Read/Write | Full   |
| `provider-portal` | Healthcare Provider Interface | Read   | Read   | Read/Write | Full   |
| `kiosk`           | Facility Check-in Kiosk       | Read   | Read   | Read/Write | Full   |
| `mobile`          | Mobile App (React Native)     | Read   | Read   | Read/Write | Full   |

**Access Levels:**

- **Read**: View logs, metrics, and configurations
- **Read/Write**: Modify configurations, restart services
- **Full**: Deploy, modify code, full administrative access

---

## Service Access Matrix

### Backend Microservices (`/services`)

| Service                 | Port | Database Access  | NetOps  | SecOps  | AppOps    | DevOps |
| ----------------------- | ---- | ---------------- | ------- | ------- | --------- | ------ |
| `api`                   | 8080 | Full (Primary)   | Network | Audit   | Manage    | Full   |
| `api-gateway`           | 8000 | None             | Full    | Monitor | Configure | Full   |
| `auth-service`          | 8081 | Auth Tables Only | Network | Full    | Read      | Full   |
| `telehealth-service`    | 8082 | Session Tables   | Network | Read    | Manage    | Full   |
| `pharmacy-service`      | 8083 | Pharmacy Tables  | Network | Read    | Manage    | Full   |
| `laboratory-service`    | 8084 | Lab Tables       | Network | Read    | Manage    | Full   |
| `mental-health-service` | 8085 | MH Tables        | Network | Read    | Manage    | Full   |
| `chronic-care-service`  | 8086 | Care Tables      | Network | Read    | Manage    | Full   |
| `imaging-service`       | 8087 | Imaging Tables   | Network | Read    | Manage    | Full   |

---

## Database Access Segmentation (NetOps)

### PostgreSQL Schema Permissions

```
unified_health_db/
├── public/                    # Shared types and functions
├── auth/                      # auth-service ONLY
│   ├── users
│   ├── sessions
│   ├── tokens
│   └── audit_logs
├── clinical/                  # api, telehealth, laboratory, imaging
│   ├── patients
│   ├── encounters
│   ├── observations
│   └── diagnostic_reports
├── pharmacy/                  # pharmacy-service ONLY
│   ├── prescriptions
│   ├── medications
│   └── pharmacies
├── mental_health/             # mental-health-service ONLY
│   ├── assessments
│   ├── sessions
│   └── crisis_records
├── chronic_care/              # chronic-care-service ONLY
│   ├── care_plans
│   ├── devices
│   └── alerts
└── imaging/                   # imaging-service ONLY
    ├── studies
    ├── series
    └── instances
```

### Database Role Mapping

| Database Role        | Allowed Schemas                        | Services              |
| -------------------- | -------------------------------------- | --------------------- |
| `role_api_primary`   | ALL                                    | api                   |
| `role_auth`          | auth, public                           | auth-service          |
| `role_telehealth`    | clinical, public                       | telehealth-service    |
| `role_pharmacy`      | pharmacy, clinical (read), public      | pharmacy-service      |
| `role_laboratory`    | clinical, public                       | laboratory-service    |
| `role_mental_health` | mental_health, clinical (read), public | mental-health-service |
| `role_chronic_care`  | chronic_care, clinical (read), public  | chronic-care-service  |
| `role_imaging`       | imaging, clinical (read), public       | imaging-service       |

### Connection String Template

```bash
# Service-specific connection (read-write to own schema)
DATABASE_URL="postgresql://${SERVICE_USER}:${SERVICE_PASSWORD}@${DB_HOST}:5432/unified_health?schema=${SCHEMA_NAME}"

# Read-only cross-schema access
DATABASE_URL_READONLY="postgresql://${SERVICE_USER}_ro:${PASSWORD}@${DB_HOST}:5432/unified_health?schema=public"
```

---

## Security Operations (SecOps) Access

### Audit & Monitoring Access

| Component             | Access Level | Purpose                   |
| --------------------- | ------------ | ------------------------- |
| Azure Log Analytics   | Full         | Security event monitoring |
| Azure Sentinel        | Full         | SIEM and threat detection |
| Kubernetes Audit Logs | Full         | Container security        |
| Application Logs      | Read         | Incident investigation    |
| Database Audit Logs   | Full         | Data access tracking      |
| Network Flow Logs     | Full         | Network security analysis |

### Security Tools Access

| Tool                        | SecOps  | Others       |
| --------------------------- | ------- | ------------ |
| Trivy (Container Scanning)  | Execute | View Reports |
| Gitleaks (Secret Detection) | Execute | View Reports |
| OWASP ZAP (DAST)            | Execute | None         |
| SonarQube (SAST)            | Full    | View Reports |
| Snyk (Dependency Scan)      | Execute | View Reports |

### Incident Response

```
┌─────────────────────────────────────────────────────────────┐
│                    INCIDENT RESPONSE FLOW                    │
├─────────────────────────────────────────────────────────────┤
│  Detection → SecOps (Primary)                               │
│  Containment → SecOps + NetOps (Network isolation)          │
│  Investigation → SecOps + AppOps (Log analysis)             │
│  Recovery → AppOps + DevOps (Service restoration)           │
│  Post-Mortem → All Teams                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Application Operations (AppOps) Access

### Service Management

| Action                         | AppOps Permission       |
| ------------------------------ | ----------------------- |
| View pod status                | Yes                     |
| View logs                      | Yes                     |
| Restart pods                   | Yes                     |
| Scale replicas (within limits) | Yes                     |
| Modify environment variables   | Yes (non-secret)        |
| Access secrets                 | No (request via SecOps) |
| Deploy new versions            | No (request via DevOps) |
| Modify database schema         | No (request via DevOps) |

### Monitoring Access

| System               | Access Level        |
| -------------------- | ------------------- |
| Azure Monitor        | Read/Write Alerts   |
| Application Insights | Full                |
| Prometheus Metrics   | Read                |
| Grafana Dashboards   | Read/Create         |
| PagerDuty/OpsGenie   | Acknowledge/Resolve |

### Runbook Permissions

| Runbook Type       | AppOps Can Execute |
| ------------------ | ------------------ |
| Service restart    | Yes                |
| Cache clear        | Yes                |
| Log rotation       | Yes                |
| Failover (manual)  | Yes                |
| Database migration | No                 |
| Security patching  | No                 |

---

## DevOps Access

### CI/CD Pipeline Access

| Pipeline Stage      | DevOps  | AppOps  | SecOps  |
| ------------------- | ------- | ------- | ------- |
| Build               | Full    | View    | View    |
| Test                | Full    | View    | View    |
| Security Scan       | Execute | View    | Full    |
| Deploy (Dev)        | Full    | View    | View    |
| Deploy (Staging)    | Full    | Approve | View    |
| Deploy (Production) | Execute | Approve | Approve |

### Infrastructure Access

| Resource        | DevOps Access               |
| --------------- | --------------------------- |
| Terraform State | Full                        |
| AKS Cluster     | Full Admin                  |
| ACR Registry    | Push/Pull/Admin             |
| Key Vault       | Read (via managed identity) |
| PostgreSQL      | Schema Admin                |
| Redis Cache     | Full Admin                  |

### Deployment Permissions

```yaml
# Production Deployment Approval Matrix
production_deployment:
  requires:
    - devops_approval: 1
    - appops_approval: 1
    - secops_approval: 1 # For security-sensitive changes
  excludes:
    - direct_database_access
    - secret_modification
```

---

## Network Segmentation (NetOps)

### Kubernetes Network Policies

```yaml
# Service-to-Service Communication
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: service-isolation
  namespace: unifiedhealth-production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: unifiedhealth-production
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: unifiedhealth-production
```

### Database Network Access

| Source             | Destination     | Port      | Protocol | NetOps Managed |
| ------------------ | --------------- | --------- | -------- | -------------- |
| api-gateway        | All services    | 8080-8087 | TCP      | Yes            |
| All services       | PostgreSQL      | 5432      | TCP      | Yes            |
| api                | Redis           | 6379      | TCP      | Yes            |
| telehealth-service | TURN/STUN       | 3478      | UDP      | Yes            |
| All services       | Azure Key Vault | 443       | HTTPS    | Yes            |

### NSG Rules Summary

| NSG       | Inbound Rules                               | Outbound Rules     |
| --------- | ------------------------------------------- | ------------------ |
| aks-nsg   | HTTP(80), HTTPS(443), NodePort(30000-32767) | All Azure Services |
| db-nsg    | PostgreSQL(5432) from AKS only              | None               |
| redis-nsg | Redis(6379) from AKS only                   | None               |

---

## Kubernetes RBAC

### Role Definitions

```yaml
# AppOps Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: appops-role
  namespace: unifiedhealth-production
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["delete"] # For restart
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["autoscaling"]
    resources: ["horizontalpodautoscalers"]
    verbs: ["get", "list", "watch", "patch"]

---
# DevOps Role
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: devops-role
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["*"]

---
# SecOps Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secops-role
  namespace: unifiedhealth-production
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "events", "secrets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["networkpolicies"]
    verbs: ["get", "list", "watch", "create", "update", "delete"]
```

---

## App-to-Service Mapping

### Which Apps Connect to Which Services

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         APP TO SERVICE MAPPING                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐     ┌─────────────────┐                                   │
│  │   web   │────▶│   api-gateway   │                                   │
│  └─────────┘     └────────┬────────┘                                   │
│                           │                                             │
│  ┌─────────┐              ▼                                            │
│  │  admin  │────▶┌─────────────────┐     ┌──────────────────┐         │
│  └─────────┘     │       api       │◀───▶│    PostgreSQL    │         │
│                  └────────┬────────┘     └──────────────────┘         │
│  ┌──────────────┐         │                                            │
│  │provider-portal│────▶   │                                            │
│  └──────────────┘         ▼                                            │
│                  ┌─────────────────┐                                   │
│  ┌─────────┐     │  auth-service   │──▶ auth schema                   │
│  │  kiosk  │────▶└─────────────────┘                                   │
│  └─────────┘             │                                             │
│                          ▼                                             │
│  ┌─────────┐     ┌─────────────────┐                                   │
│  │ mobile  │────▶│telehealth-service│──▶ clinical schema              │
│  └─────────┘     │pharmacy-service  │──▶ pharmacy schema              │
│                  │laboratory-service│──▶ clinical schema              │
│                  │mental-health-svc │──▶ mental_health schema         │
│                  │chronic-care-svc  │──▶ chronic_care schema          │
│                  │imaging-service   │──▶ imaging schema               │
│                  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### App Permissions by User Type

| User Type  | Apps                 | Services                                                                | Data Access         |
| ---------- | -------------------- | ----------------------------------------------------------------------- | ------------------- |
| Patient    | web, mobile          | api, auth, telehealth, pharmacy, laboratory, chronic-care               | Own records only    |
| Provider   | provider-portal, web | api, auth, telehealth, laboratory, mental-health, chronic-care, imaging | Assigned patients   |
| Admin      | admin, web           | All services                                                            | Full (audit logged) |
| Kiosk User | kiosk                | api, auth                                                               | Check-in only       |

---

## Compliance Considerations

### HIPAA Requirements

| Requirement           | Implementation            | Team Responsible |
| --------------------- | ------------------------- | ---------------- |
| Access Controls       | RBAC + Row-Level Security | SecOps + DevOps  |
| Audit Logging         | All data access logged    | SecOps           |
| Encryption at Rest    | Azure Disk Encryption     | NetOps           |
| Encryption in Transit | TLS 1.3 enforced          | NetOps           |
| Minimum Necessary     | Schema-level isolation    | DevOps           |

### GDPR Requirements

| Requirement        | Implementation                       | Team Responsible |
| ------------------ | ------------------------------------ | ---------------- |
| Right to Access    | Data export API                      | DevOps + AppOps  |
| Right to Erasure   | Soft delete + hard delete procedures | DevOps + SecOps  |
| Data Portability   | FHIR export                          | DevOps           |
| Consent Management | Consent service                      | DevOps + AppOps  |

---

## Emergency Access

### Break-Glass Procedures

1. **Trigger**: Security incident or critical production issue
2. **Authorization**: Requires 2-person approval (on-call manager + security)
3. **Access**: Temporary elevated privileges for 4 hours max
4. **Audit**: All actions logged and reviewed within 24 hours
5. **Revocation**: Automatic after timeout or manual revocation

### Emergency Contacts

| Escalation Level | Team           | Contact Method    |
| ---------------- | -------------- | ----------------- |
| L1               | AppOps On-Call | PagerDuty         |
| L2               | DevOps On-Call | PagerDuty         |
| L3               | SecOps On-Call | PagerDuty + Phone |
| L4               | Platform Lead  | Direct Phone      |

---

## Review and Audit

### Access Review Schedule

| Review Type     | Frequency     | Owner           |
| --------------- | ------------- | --------------- |
| User Access     | Monthly       | SecOps          |
| Service Account | Quarterly     | DevOps          |
| Database Roles  | Quarterly     | NetOps + SecOps |
| Network Rules   | Quarterly     | NetOps          |
| RBAC Policies   | Semi-annually | SecOps          |

### Audit Log Retention

| Log Type            | Retention Period |
| ------------------- | ---------------- |
| Application Logs    | 30 days          |
| Audit Logs          | 7 years          |
| Security Events     | 1 year           |
| Database Query Logs | 90 days          |

---

## Contact

For access requests or questions:

- **NetOps**: netops@unifiedhealth.io
- **SecOps**: security@unifiedhealth.io
- **AppOps**: appops@unifiedhealth.io
- **DevOps**: devops@unifiedhealth.io
