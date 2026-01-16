# System Architecture Documentation

## Overview

The Unified Health Global Platform is built on a modern, scalable microservices architecture designed to handle healthcare data securely and efficiently across multiple regions and currencies.

## Architecture Principles

### Core Principles

1. **Security First** - HIPAA, GDPR, and healthcare compliance built-in
2. **Scalability** - Horizontal scaling to support millions of users
3. **Reliability** - 99.9% uptime SLA with multi-region redundancy
4. **Performance** - Sub-200ms API response times
5. **Interoperability** - FHIR R4 compliance for healthcare data exchange
6. **Privacy** - Zero-knowledge encryption for sensitive data
7. **Modularity** - Loosely coupled services for independent deployment
8. **Observability** - Comprehensive monitoring and logging

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Web    │  │   iOS    │  │ Android  │  │  Kiosk   │  │ Provider │ │
│  │ (Next.js)│  │ (React   │  │ (React   │  │   App    │  │  Portal  │ │
│  │          │  │  Native) │  │  Native) │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EDGE & SECURITY LAYER                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │ CloudFlare │  │    WAF     │  │    DDoS    │  │   CDN/Cache    │   │
│  │    DNS     │  │  Firewall  │  │ Protection │  │                │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │   Kong     │  │   OAuth    │  │    Rate    │  │    GraphQL     │   │
│  │  Gateway   │  │   2.0 /    │  │  Limiting  │  │   Federation   │   │
│  │            │  │   OIDC     │  │            │  │                │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES LAYER                                 │
│                                                                           │
│  ┌───────────────────── CLINICAL SERVICES ─────────────────────┐        │
│  │  • Telehealth Service      • Scheduling Service              │        │
│  │  • Prescription Service    • Triage Service                  │        │
│  │  • Provider Service        • Referral Service                │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                           │
│  ┌───────────────────── HEALTH DATA SERVICES ──────────────────┐        │
│  │  • FHIR Server (HAPI)     • Health Records Service          │        │
│  │  • Document Service       • Device Integration               │        │
│  │  • Consent Management     • Sync Service                     │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                           │
│  ┌───────────────────── SPECIALTY SERVICES ─────────────────────┐       │
│  │  • Mental Health          • Chronic Care Management           │       │
│  │  • Pharmacy Service       • Laboratory Service                │       │
│  │  • Imaging Service        • Health Checkup Engine             │       │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                           │
│  ┌───────────────────── PLATFORM SERVICES ──────────────────────┐       │
│  │  • Billing Service        • Analytics Service                 │       │
│  │  • AI/ML Service          • Notification Service              │       │
│  │  • Search Service         • Audit Service                     │       │
│  └──────────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE BUS / EVENT STREAM                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │   Kafka    │  │   Redis    │  │   NATS     │  │   RabbitMQ     │   │
│  │  (Events)  │  │  Pub/Sub   │  │ (Realtime) │  │  (Workflows)   │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │PostgreSQL│  │ MongoDB  │  │  Redis   │  │Elastic   │  │   S3    │ │
│  │(OLTP)    │  │ (Docs)   │  │ (Cache)  │  │ Search   │  │ (Files) │ │
│  │          │  │          │  │          │  │          │  │         │ │
│  │ Primary  │  │ Medical  │  │ Session  │  │ Full     │  │ DICOM   │ │
│  │ Database │  │ Records  │  │ Store    │  │ Text     │  │ Images  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY & MONITORING                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │Prometheus/ │  │    ELK     │  │   Jaeger   │  │    Sentry      │   │
│  │  Grafana   │  │   Stack    │  │  Tracing   │  │  Error Track   │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.x |
| **Next.js** | Web Framework | 14.x |
| **React Native** | Mobile Apps | 0.73.x |
| **TypeScript** | Type Safety | 5.3.x |
| **TailwindCSS** | Styling | 3.x |
| **Zustand** | State Management | 4.x |
| **TanStack Query** | Data Fetching | 5.x |
| **Socket.io Client** | Real-time Communication | 4.x |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 20.x LTS |
| **Express** | API Framework | 4.x |
| **TypeScript** | Type Safety | 5.3.x |
| **Prisma** | ORM | 5.x |
| **Bull** | Job Queue | 4.x |
| **Socket.io** | WebSocket | 4.x |
| **JWT** | Authentication | 9.x |

### Databases

| Technology | Purpose | Use Case |
|------------|---------|----------|
| **PostgreSQL** | Primary Database | Transactional data, user records |
| **MongoDB** | Document Store | Medical records, clinical notes |
| **Redis** | Cache & Session | Session storage, caching, pub/sub |
| **Elasticsearch** | Search Engine | Full-text search, analytics |

### Infrastructure

| Technology | Purpose | Provider |
|------------|---------|----------|
| **Kubernetes** | Orchestration | Self-managed / AKS |
| **Docker** | Containerization | Docker Hub / ACR |
| **Terraform** | IaC | Multi-cloud |
| **Helm** | K8s Package Manager | Charts |
| **ArgoCD** | GitOps | CD Pipeline |
| **GitHub Actions** | CI/CD | GitHub |

### Monitoring & Observability

| Technology | Purpose |
|------------|---------|
| **Prometheus** | Metrics Collection |
| **Grafana** | Visualization |
| **ELK Stack** | Log Aggregation |
| **Jaeger** | Distributed Tracing |
| **Sentry** | Error Tracking |

## Service Architecture

### Service Communication Patterns

#### Synchronous Communication
- **REST APIs** - Primary API protocol
- **GraphQL** - Federated queries across services
- **gRPC** - High-performance inter-service communication

#### Asynchronous Communication
- **Event-Driven** - Kafka for event streaming
- **Pub/Sub** - Redis for real-time updates
- **Message Queue** - RabbitMQ for reliable messaging

### Service Registry & Discovery

Services use **Kubernetes DNS** for service discovery:
```
http://service-name.namespace.svc.cluster.local:port
```

### Load Balancing

- **External:** CloudFlare / Azure Front Door
- **Internal:** Kubernetes Service / NGINX Ingress
- **Client-Side:** Round-robin in SDKs

## Data Architecture

### Database Strategy

#### PostgreSQL (Primary OLTP)
**Schema:**
```
- users
- patients
- providers
- appointments
- subscriptions
- billing_transactions
- audit_logs
```

**Characteristics:**
- ACID compliance
- Referential integrity
- Complex queries
- Structured data

#### MongoDB (Medical Records)
**Collections:**
```
- clinical_encounters
- health_records
- lab_results
- imaging_reports
- prescriptions
- documents
```

**Characteristics:**
- Flexible schema
- JSON documents
- Fast writes
- Version history

#### Redis (Cache & Sessions)
**Usage:**
```
- User sessions
- API response cache
- Rate limiting counters
- Real-time pub/sub
- Job queues
```

### Data Replication

**PostgreSQL:**
- Master-Replica setup
- Streaming replication
- Read replicas for analytics

**MongoDB:**
- Replica Set (3 nodes)
- Automatic failover
- Read preference routing

**Redis:**
- Redis Sentinel for HA
- Master-Slave replication
- Cluster mode for scaling

### Data Backup

| Database | Frequency | Retention | Method |
|----------|-----------|-----------|--------|
| PostgreSQL | Daily | 30 days | pg_dump + WAL archiving |
| MongoDB | Daily | 30 days | mongodump + oplog |
| Redis | Hourly | 7 days | RDB snapshots |
| Files (S3) | Continuous | 90 days | Versioning enabled |

## Security Architecture

### Network Security

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERNET (Untrusted)                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DMZ - Edge Services                             │
│  • CloudFlare (DDoS Protection, WAF)                            │
│  • Load Balancer (SSL Termination)                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Application Layer - Public Subnet                   │
│  • API Gateway (Authentication, Rate Limiting)                  │
│  • Web Servers (Static Content)                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│           Service Layer - Private Subnet (VPN Only)              │
│  • Microservices (No direct internet access)                    │
│  • Internal APIs                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│         Data Layer - Isolated Subnet (No Internet)               │
│  • Databases (PostgreSQL, MongoDB)                              │
│  • Cache (Redis)                                                 │
│  • Private endpoints only                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Encryption

**Data in Transit:**
- TLS 1.3 for all external communication
- mTLS for inter-service communication
- Perfect Forward Secrecy (PFS)

**Data at Rest:**
- AES-256 encryption for databases
- Field-level encryption for PHI
- Encrypted backups

### Authentication & Authorization

**Multi-Layer Security:**
1. **Edge Layer:** WAF rules, IP filtering
2. **Gateway Layer:** JWT validation, OAuth 2.0
3. **Service Layer:** Role-based access control (RBAC)
4. **Data Layer:** Row-level security, encryption

## Scalability Strategy

### Horizontal Scaling

**Stateless Services:**
- API services scale automatically with HPA
- Target: 70% CPU utilization
- Min replicas: 2, Max replicas: 50

**Stateful Services:**
- Database read replicas
- Redis cluster mode
- MongoDB sharding (future)

### Caching Strategy

**Multi-Layer Cache:**

1. **CDN Cache (CloudFlare)**
   - Static assets
   - Public API responses
   - TTL: 1 hour - 1 day

2. **Application Cache (Redis)**
   - User sessions
   - API responses
   - Database query results
   - TTL: 5 minutes - 1 hour

3. **Database Cache**
   - PostgreSQL shared_buffers
   - MongoDB WiredTiger cache

### Auto-Scaling Rules

```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Disaster Recovery

### RTO & RPO Targets

| Component | RTO | RPO | Strategy |
|-----------|-----|-----|----------|
| **Critical Services** | 15 min | 5 min | Multi-region active-active |
| **Databases** | 1 hour | 15 min | Automated failover |
| **File Storage** | 30 min | 0 | Cross-region replication |
| **Cache** | 5 min | 0 | Rebuild on demand |

### Backup Strategy

**Automated Backups:**
- Database: Daily full + continuous WAL
- Files: Continuous replication
- Configuration: Git-based (GitOps)
- Secrets: Encrypted backup to vault

**Backup Testing:**
- Monthly restore drills
- Quarterly DR simulation
- Annual full failover test

## Performance Optimization

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (p95) | < 200ms | 150ms |
| Database Query Time (p95) | < 50ms | 35ms |
| Page Load Time (p95) | < 2s | 1.5s |
| Video Call Setup | < 5s | 3s |
| Uptime | 99.9% | 99.95% |

### Optimization Techniques

1. **Database Optimization**
   - Indexed queries
   - Connection pooling
   - Query caching
   - Read replicas

2. **API Optimization**
   - Response compression
   - Pagination
   - Field filtering
   - ETags for caching

3. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service workers

## Related Documentation

- [Service Dependencies](./SERVICE_DEPENDENCIES.md) - Service dependency map
- [Data Models](./DATA_MODELS.md) - Database schemas and relationships
- [System Design](./SYSTEM_DESIGN.md) - Detailed design decisions
- [Deployment Architecture](../deployment/INFRASTRUCTURE.md) - Infrastructure setup

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0
