# ADR-003: Database per Service Pattern

## Status
Accepted

## Date
2025-12

## Context

With the adoption of a microservices architecture (see [ADR-001](./ADR-001-microservices-architecture.md)), we need to determine the data management strategy for the Unified Health Platform.

### Requirements

1. **Data Isolation**: Each service should own its data without tight coupling
2. **Independent Deployments**: Database schema changes shouldn't require coordinated deployments
3. **Scalability**: Different data stores can scale according to their specific needs
4. **Compliance**: PHI and PII data must be isolated and encrypted per regulations
5. **Performance**: Data access patterns differ significantly across services

### Options Considered

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Shared Database** | All services share one database | Simple, ACID transactions | Tight coupling, schema conflicts |
| **Shared Schema, Separate Tables** | One database, tables per service | Some isolation, easier ops | Still coupled, scaling limited |
| **Database per Service** | Each service has dedicated database | Full isolation, independent scaling | Complexity, cross-service queries |

## Decision

We will implement the **Database per Service** pattern where each microservice has its own dedicated database/schema. Services communicate through well-defined APIs rather than direct database access.

### Data Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Database per Service Architecture                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │Auth Service │    │Telehealth   │    │Notification │    │Laboratory   │ │
│   │             │    │Service      │    │Service      │    │Service      │ │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│          │                  │                  │                  │         │
│          ▼                  ▼                  ▼                  ▼         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │ │
│   │             │    │             │    │             │    │             │ │
│   │ - users     │    │ - appts     │    │ - notifs    │    │ - orders    │ │
│   │ - sessions  │    │ - visits    │    │ - templates │    │ - results   │ │
│   │ - tokens    │    │ - messages  │    │ - prefs     │    │ - specimens │ │
│   │             │    │             │    │             │    │             │ │
│   │ [PII Data]  │    │ [PHI Data]  │    │ [Metadata]  │    │ [PHI Data]  │ │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘ │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                       Cross-Service Communication                    │   │
│   │                                                                      │   │
│   │  ┌───────────┐    ┌───────────┐    ┌───────────┐                   │   │
│   │  │   REST    │    │  Events   │    │   Saga    │                   │   │
│   │  │   APIs    │    │  (Async)  │    │  Pattern  │                   │   │
│   │  └───────────┘    └───────────┘    └───────────┘                   │   │
│   │                                                                      │   │
│   │  Synchronous       Azure Event     Distributed                      │   │
│   │  Queries           Hubs            Transactions                     │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Technology Choices

| Service | Database | Rationale |
|---------|----------|-----------|
| **Auth Service** | PostgreSQL | Relational data, ACID for user management |
| **Telehealth Service** | PostgreSQL | Appointments, visits, structured data |
| **Notification Service** | PostgreSQL | Templates, delivery tracking |
| **Laboratory Service** | PostgreSQL | Lab orders, results, audit trail |
| **Audit Service** | Azure Cosmos DB | High write volume, flexible schema |
| **Imaging Service** | PostgreSQL + Blob Storage | Metadata + DICOM files |
| **Cache/Sessions** | Redis | Low-latency session and cache |

### Data Ownership Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Ownership Matrix                              │
├─────────────────┬───────────────────┬───────────────────────────────────────┤
│ Data Entity     │ Owning Service    │ Other Services Access Via             │
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ Users           │ Auth Service      │ API call with user ID                 │
│ User Profiles   │ Auth Service      │ API call with user ID                 │
│ Appointments    │ Telehealth Service│ API call with appointment ID          │
│ Visits          │ Telehealth Service│ Events published on completion        │
│ Notifications   │ Notification Svc  │ Fire-and-forget API calls             │
│ Templates       │ Notification Svc  │ API call for rendering                │
│ Lab Orders      │ Laboratory Service│ API call with order ID                │
│ Lab Results     │ Laboratory Service│ Events published when ready           │
│ Prescriptions   │ Pharmacy Service  │ API call with prescription ID         │
│ Audit Logs      │ Audit Service     │ Fire-and-forget event publishing      │
│ Sessions        │ Auth Service      │ N/A (internal only)                   │
│ Consent Records │ Auth Service      │ API call to verify consent            │
└─────────────────┴───────────────────┴───────────────────────────────────────┘
```

### Cross-Service Data Access Patterns

#### 1. API Composition (for reads)

```
┌────────┐     ┌───────────────┐     ┌───────────────┐
│ Client │────>│  API Gateway  │────>│ Telehealth    │
└────────┘     │               │     │ Service       │
               │  1. Get appt  │     └───────┬───────┘
               │               │             │
               │  2. Get user  │     ┌───────▼───────┐
               │     details   │────>│ Auth Service  │
               │               │     └───────────────┘
               │  3. Combine   │
               │     response  │
               └───────────────┘
```

#### 2. Event-Driven Updates (for writes)

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Telehealth    │     │  Event Hub    │     │ Billing       │
│ Service       │────>│               │────>│ Service       │
└───────────────┘     │ visit.ended   │     └───────────────┘
                      │               │
                      │               │────>┌───────────────┐
                      │               │     │ Notification  │
                      └───────────────┘     │ Service       │
                                            └───────────────┘
```

#### 3. Saga Pattern (for distributed transactions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Appointment Booking Saga                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1: Create Appointment (Telehealth)                                    │
│      │                                                                       │
│      ▼                                                                       │
│  Step 2: Reserve Provider Slot (Calendar Service)                           │
│      │                                                                       │
│      ▼                                                                       │
│  Step 3: Charge Payment (Billing Service)                                   │
│      │                                                                       │
│      ▼                                                                       │
│  Step 4: Send Confirmation (Notification Service)                           │
│                                                                              │
│  Compensation (on failure):                                                  │
│  - Step 4 fails: Log and retry notification                                 │
│  - Step 3 fails: Cancel slot, cancel appointment                            │
│  - Step 2 fails: Cancel appointment                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Isolation per Region

For multi-region deployment and data residency compliance:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Regional Data Isolation                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Americas (eastus)          Europe (westeurope)       Africa (southafrica)  │
│  ┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐   │
│  │ PostgreSQL      │        │ PostgreSQL      │       │ PostgreSQL      │   │
│  │ - US patients   │        │ - EU patients   │       │ - Africa patients│  │
│  │ - US providers  │        │ - EU providers  │       │ - Africa providers│ │
│  │                 │        │                 │       │                 │   │
│  │ HIPAA Compliant │        │ GDPR Compliant  │       │ POPIA Compliant │   │
│  └─────────────────┘        └─────────────────┘       └─────────────────┘   │
│                                                                              │
│  Data Residency: Patient PHI/PII stays within region                        │
│  Sync: Provider catalog, service config replicated globally                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Schema Management

Each service manages its own schema using Prisma ORM:

```
services/
├── auth-service/
│   └── prisma/
│       └── schema.prisma     # Auth service schema
├── telehealth-service/
│   └── prisma/
│       └── schema.prisma     # Telehealth schema
├── notification-service/
│   └── prisma/
│       └── schema.prisma     # Notification schema
└── ...
```

Migration process:
1. Schema changes made in service's `schema.prisma`
2. Migration generated: `npx prisma migrate dev`
3. Migration tested in staging
4. Migration deployed to production: `npx prisma migrate deploy`

## Consequences

### Positive

1. **Loose Coupling**: Services are independent; schema changes don't affect others
2. **Independent Scaling**: Databases scaled based on individual service needs
3. **Technology Freedom**: Each service can use optimal database technology
4. **Fault Isolation**: Database failure affects only its owning service
5. **Security Boundaries**: PHI/PII data isolated with separate access controls
6. **Clear Ownership**: Each team owns their data model completely
7. **Compliance**: Data residency enforced at database level

### Negative

1. **Cross-Service Queries**: No JOINs across services; requires API composition
2. **Eventual Consistency**: Distributed data may be temporarily inconsistent
3. **Data Duplication**: Some data may be duplicated for performance
4. **Operational Overhead**: More databases to manage, backup, and monitor
5. **Distributed Transactions**: No ACID across services; saga pattern needed
6. **ID References**: Foreign keys replaced with soft references via APIs

### Neutral

1. **Query Complexity**: Dashboards/reports may need data aggregation layer
2. **Migration Coordination**: Major refactoring may require coordinated changes

## Mitigations

1. **API Composition Layer**: BFF pattern for complex queries
2. **Event Sourcing**: Events capture all state changes for consistency
3. **Caching**: Redis caching to reduce cross-service API calls
4. **Database Monitoring**: Centralized monitoring with Azure Monitor
5. **Automated Backups**: Point-in-time recovery for all databases
6. **Read Replicas**: Separate read replicas for reporting

## References

- [ADR-001: Microservices Architecture](./ADR-001-microservices-architecture.md)
- [Database Migration Strategy](../database/MIGRATION_STRATEGY.md)
- [Microsoft - Database per Service](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/data-considerations)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
