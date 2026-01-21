# Monolith Extraction Plan

**World Unified Health Platform - Strangler Pattern Migration**

## Executive Summary

This document outlines the phased extraction of bounded contexts from the existing monolith (`services/api`) into independent microservices, following the strangler pattern to ensure zero-downtime migration and continuous delivery.

---

## 1. Current State Analysis

### Existing Services (Extracted)

| Service | Status | Port | Domain |
|---------|--------|------|--------|
| api-gateway | Active | 3000 | Routing, Auth Proxy |
| telehealth-service | Active | 3010 | Video Consultations |
| mental-health-service | Active | 3011 | Mental Health Workflows |
| chronic-care-service | Active | 3012 | Care Plans, Monitoring |
| pharmacy-service | Active | 3013 | Prescriptions, eRx |
| laboratory-service | Active | 3014 | Lab Orders, Results |
| imaging-service | Active | 3015 | DICOM, Radiology |

### Monolith Domains (To Extract)

| Domain | Priority | Complexity | Data Sensitivity |
|--------|----------|------------|------------------|
| Identity & Auth | P0 | High | Critical |
| Patient Core | P0 | High | PHI |
| Provider Core | P0 | Medium | PII |
| Scheduling | P1 | Medium | PHI |
| Clinical Data (FHIR) | P0 | High | PHI |
| Billing | P1 | High | PCI |
| Notifications | P2 | Low | PHI |
| Audit | P0 | Medium | Compliance |
| Entitlements | P1 | Medium | Business |
| Compliance Policy | P0 | High | Compliance |
| Integration Hub | P1 | High | PHI |

---

## 2. Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Azure Front Door + WAF                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │  Americas │   │  Europe   │   │  Africa   │
            │   AKS     │   │   AKS     │   │   AKS     │
            └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                  │               │               │
    ┌─────────────┴─────────────────────────────────────────────────┐
    │                       API Gateway                              │
    │  (Kong/NGINX - Auth, Rate Limit, Region Routing)              │
    └─────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                     Service Mesh (Istio)                       │
    └───────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────┬───────────┬───────────┬───────────┬───────────────┐
    │           │           │           │           │               │
    ▼           ▼           ▼           ▼           ▼               ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐
│Identity│ │Patient │ │Provider│ │Clinical│ │Billing │ │ Integration  │
│Service │ │ Core   │ │ Core   │ │Data Svc│ │Service │ │     Hub      │
└────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └──────┬───────┘
     │          │          │          │          │            │
     ▼          ▼          ▼          ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐
│Identity│ │Patient │ │Provider│ │FHIR R4 │ │Billing │ │   Adapter    │
│  DB    │ │  DB    │ │  DB    │ │  DB    │ │  DB    │ │   Registry   │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └──────────────┘
```

---

## 3. Extraction Phases

### Phase 0: Foundation (Weeks 1-4)

**Objective**: Establish infrastructure for service extraction

1. **Service Mesh Setup**
   - Deploy Istio in all regional AKS clusters
   - Configure mTLS between services
   - Setup distributed tracing (Jaeger)

2. **Event Bus**
   - Deploy Azure Event Hubs per region
   - Define event schemas
   - Implement dead-letter queues

3. **Shared Libraries**
   - `@global-health/service-common`: Logging, metrics, health checks
   - `@global-health/auth-client`: Token validation, RBAC
   - `@global-health/event-client`: Event publishing/subscription

4. **Database Strategy**
   - Plan database-per-service migration
   - Setup cross-service read replicas (temporary)
   - Implement event sourcing patterns

### Phase 1: Core Services (Weeks 5-12)

#### 1.1 Identity Service (P0)

**Port**: 3001

**Responsibilities**:
- User authentication (OAuth2/OIDC)
- Session management
- MFA/passwordless
- Token issuance and validation
- User directory

**Database**: PostgreSQL (identity schema)

**Events Published**:
- `user.created`
- `user.authenticated`
- `user.session.created`
- `user.mfa.enabled`

**Migration Steps**:
1. Extract auth routes from monolith
2. Implement token validation service
3. Update api-gateway to delegate auth
4. Migrate user tables
5. Deprecate monolith auth endpoints

#### 1.2 Audit Service (P0)

**Port**: 3002

**Responsibilities**:
- Immutable audit log storage
- Event ingestion
- Compliance reporting
- Tamper-proof sealing

**Database**: Azure Table Storage (append-only)

**Events Consumed**:
- All service events (audit trail)

**Migration Steps**:
1. Deploy event consumer
2. Implement audit log writer
3. Create compliance report generators
4. Migrate historical audit data

#### 1.3 Compliance Policy Service (P0)

**Port**: 3003

**Responsibilities**:
- Policy evaluation engine
- CountryConfig management
- Feature flag enforcement
- Consent verification

**Database**: PostgreSQL (policies schema)

**APIs**:
- `POST /policies/evaluate`
- `GET /countries/{code}/config`
- `GET /features/{feature}/allowed`

**Migration Steps**:
1. Deploy policy engine (OPA integration)
2. Load CountryConfig schemas
3. Integrate with api-gateway
4. Add policy middleware to all services

#### 1.4 Clinical Data Service (P0)

**Port**: 3004

**Responsibilities**:
- FHIR R4 canonical storage
- Resource validation
- R4 ↔ R5 conversion
- Terminology hooks

**Database**: PostgreSQL (FHIR schema)

**Events Published**:
- `fhir.resource.created`
- `fhir.resource.updated`
- `fhir.bundle.processed`

**Migration Steps**:
1. Deploy FHIR repository
2. Implement validation layer
3. Create R4/R5 conversion API
4. Migrate clinical data from monolith
5. Update domain services to use FHIR service

### Phase 2: Domain Services (Weeks 13-20)

#### 2.1 Patient Core Service (P0)

**Port**: 3005

**Responsibilities**:
- Patient demographics
- Patient matching (MPI)
- Consent management
- Care team assignments

**Database**: PostgreSQL (patients schema)

**Events Published**:
- `patient.registered`
- `patient.updated`
- `patient.consent.granted`
- `patient.consent.revoked`

#### 2.2 Provider Core Service (P0)

**Port**: 3006

**Responsibilities**:
- Provider profiles
- Credentials verification
- Availability management
- Organization hierarchy

**Database**: PostgreSQL (providers schema)

**Events Published**:
- `provider.registered`
- `provider.credentialed`
- `provider.availability.updated`

#### 2.3 Scheduling Service (P1)

**Port**: 3007

**Responsibilities**:
- Appointment scheduling
- Waitlist management
- Reminder notifications
- Calendar integration

**Database**: PostgreSQL (scheduling schema)

**Events Published**:
- `appointment.scheduled`
- `appointment.cancelled`
- `appointment.reminder.sent`

#### 2.4 Entitlements Service (P1)

**Port**: 3008

**Responsibilities**:
- Subscription management
- Plan enforcement
- Feature access control
- Usage metering

**Database**: PostgreSQL (entitlements schema)

**Events Published**:
- `subscription.created`
- `subscription.upgraded`
- `entitlement.granted`
- `usage.limit.reached`

#### 2.5 Billing Service (P1)

**Port**: 3009

**Responsibilities**:
- Payment processing (Stripe)
- Invoice generation
- Multi-currency support
- Tax calculation

**Database**: PostgreSQL (billing schema)

**Events Published**:
- `payment.processed`
- `invoice.generated`
- `subscription.renewed`

### Phase 3: Supporting Services (Weeks 21-26)

#### 3.1 Notification Service (P2)

**Port**: 3016

**Responsibilities**:
- Email (SendGrid)
- SMS (Twilio)
- Push notifications
- In-app messaging

**Events Consumed**:
- `appointment.reminder.sent`
- `patient.message.received`
- `payment.processed`

#### 3.2 Integration Hub Service (P1)

**Port**: 3017

**Responsibilities**:
- EHR adapter orchestration
- HIE connectivity
- Provider adapter registry
- Message transformation

**APIs**:
- `POST /adapters/{adapterId}/send`
- `GET /adapters/registry`
- `POST /integrations/fhir/bundle`

---

## 4. Data Migration Strategy

### Approach: Dual-Write with Event Sourcing

1. **Dual-Write Phase**
   - Monolith writes to both old and new databases
   - New service reads from new database
   - Events track all changes

2. **Verification Phase**
   - Compare data consistency
   - Run parallel reads
   - Validate event stream

3. **Cutover Phase**
   - Route reads to new service
   - Disable monolith writes
   - Archive old tables

### Schema Migration

```sql
-- Example: Patient extraction
-- Step 1: Create new schema
CREATE SCHEMA patient_service;

-- Step 2: Replicate tables
CREATE TABLE patient_service.patients AS
SELECT * FROM public.patients;

-- Step 3: Add event triggers
CREATE OR REPLACE FUNCTION patient_change_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('patient_changes', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. API Gateway Routing

### Strangler Routing Rules

```yaml
# Kong declarative config
services:
  - name: identity-service
    url: http://identity-service.default.svc.cluster.local:3001
    routes:
      - name: auth-routes
        paths:
          - /api/v1/auth
          - /api/v1/users
          - /api/v1/sessions

  - name: patient-core-service
    url: http://patient-core-service.default.svc.cluster.local:3005
    routes:
      - name: patient-routes
        paths:
          - /api/v1/patients

  - name: monolith-legacy
    url: http://api-service.default.svc.cluster.local:3000
    routes:
      - name: legacy-routes
        paths:
          - /api/v1  # Catch-all for not-yet-extracted
```

---

## 6. Rollback Strategy

### Per-Service Rollback

1. **Feature Flag**: Disable new service routing
2. **Traffic Shift**: Return traffic to monolith
3. **Data Sync**: Replay events to monolith
4. **Validation**: Verify data consistency

### Emergency Rollback

```bash
# Immediate rollback script
kubectl set env deployment/api-gateway \
  FEATURE_FLAG_USE_IDENTITY_SERVICE=false \
  FEATURE_FLAG_USE_PATIENT_SERVICE=false

# Verify traffic routing
kubectl logs -l app=api-gateway | grep "route:"
```

---

## 7. Success Criteria

### Phase Completion Criteria

- [ ] Service passes all integration tests
- [ ] Latency < 100ms p95
- [ ] Error rate < 0.1%
- [ ] Zero data loss verified
- [ ] Audit trail complete
- [ ] Rollback tested
- [ ] Documentation updated
- [ ] Runbook created

### Overall Migration Success

- [ ] All P0 services extracted
- [ ] Monolith reduced to legacy wrapper
- [ ] Event-driven architecture functional
- [ ] Multi-region replication working
- [ ] Compliance audits passing
- [ ] Performance benchmarks met

---

## 8. Service Ports Reference

| Service | Port | Priority | Status |
|---------|------|----------|--------|
| api-gateway | 3000 | - | Active |
| identity-service | 3001 | P0 | Planned |
| audit-service | 3002 | P0 | Planned |
| compliance-policy-service | 3003 | P0 | Planned |
| clinical-data-service | 3004 | P0 | Planned |
| patient-core-service | 3005 | P0 | Planned |
| provider-core-service | 3006 | P0 | Planned |
| scheduling-service | 3007 | P1 | Planned |
| entitlements-service | 3008 | P1 | Planned |
| billing-service | 3009 | P1 | Planned |
| telehealth-service | 3010 | - | Active |
| mental-health-service | 3011 | - | Active |
| chronic-care-service | 3012 | - | Active |
| pharmacy-service | 3013 | - | Active |
| laboratory-service | 3014 | - | Active |
| imaging-service | 3015 | - | Active |
| notification-service | 3016 | P2 | Planned |
| integration-hub-service | 3017 | P1 | Planned |

---

## 9. Next Steps

1. **Immediate**: Deploy service mesh (Istio) to all clusters
2. **Week 1**: Create shared libraries package
3. **Week 2**: Extract identity-service
4. **Week 3**: Extract audit-service
5. **Week 4**: Extract compliance-policy-service
6. **Week 5+**: Continue with Phase 1 services

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Owner: Platform Architecture Team*
