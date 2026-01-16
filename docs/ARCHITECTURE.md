# Unified Health Platform - Enterprise Architecture

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Architecture](#current-architecture)
3. [Target Architecture](#target-architecture)
4. [Service Separation](#service-separation)
5. [Global Deployment](#global-deployment)
6. [Data Architecture](#data-architecture)
7. [Security & Compliance](#security--compliance)

---

## Executive Summary

The Unified Health Platform is a global healthcare SaaS solution designed to serve patients across multiple regions (Americas, Europe, Africa) with specialized healthcare services including:

- **Telehealth** - Virtual consultations
- **Mental & Behavioral Health** - Therapy, psychiatry, crisis support
- **Chronic Disease Management** - RPM, care coordination
- **Pharmacy Services** - E-prescribing, dispensing
- **Laboratory Services** - Diagnostics, results delivery

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CURRENT STATE (Monolithic)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│    │   Web App    │    │  Mobile App  │    │ Admin Portal │             │
│    │  (Next.js)   │    │(React Native)│    │  (Next.js)   │             │
│    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │
│           │                   │                   │                      │
│           └───────────────────┼───────────────────┘                      │
│                               │                                          │
│                    ┌──────────▼──────────┐                               │
│                    │   NGINX Ingress     │                               │
│                    │   (LoadBalancer)    │                               │
│                    │    20.3.27.63       │                               │
│                    └──────────┬──────────┘                               │
│                               │                                          │
│           ┌───────────────────┼───────────────────┐                      │
│           │                   │                   │                      │
│    ┌──────▼──────┐    ┌───────▼───────┐   ┌──────▼──────┐               │
│    │  Web Demo   │    │  Monolithic   │   │  (Future)   │               │
│    │   Service   │    │     API       │   │  Services   │               │
│    └─────────────┘    │               │   └─────────────┘               │
│                       │ ┌───────────┐ │                                  │
│                       │ │Telehealth │ │                                  │
│                       │ ├───────────┤ │                                  │
│                       │ │Mental Hlth│ │                                  │
│                       │ ├───────────┤ │                                  │
│                       │ │Chronic Cre│ │                                  │
│                       │ ├───────────┤ │                                  │
│                       │ │ Pharmacy  │ │                                  │
│                       │ ├───────────┤ │                                  │
│                       │ │Laboratory │ │                                  │
│                       │ ├───────────┤ │                                  │
│                       │ │ Billing   │ │                                  │
│                       │ └───────────┘ │                                  │
│                       └───────┬───────┘                                  │
│                               │                                          │
│           ┌───────────────────┼───────────────────┐                      │
│           │                   │                   │                      │
│    ┌──────▼──────┐    ┌───────▼───────┐   ┌──────▼──────┐               │
│    │ PostgreSQL  │    │    Redis      │   │  Key Vault  │               │
│    │ (Single)    │    │   (Single)    │   │  (Secrets)  │               │
│    └─────────────┘    └───────────────┘   └─────────────┘               │
│                                                                          │
│    Region: West US 2 (Single Region)                                     │
│    Environment: dev2                                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Current Components

| Component | Technology | Status |
|-----------|------------|--------|
| Web Portal | Next.js 14 | Designed |
| Mobile App | React Native | Designed |
| Admin Dashboard | Next.js 14 | Designed |
| API Service | Express.js/Node.js | Deployed |
| Database | PostgreSQL 15 | Deployed |
| Cache | Redis 6 | Deployed |
| Container Registry | Azure ACR | Deployed |
| Orchestration | AKS (K8s 1.32) | Deployed |
| Ingress | NGINX Ingress | Deployed |
| TLS | cert-manager + Let's Encrypt | Configured |

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        TARGET STATE (Microservices + Multi-Region)                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                              ┌─────────────────────┐                                     │
│                              │   Azure Front Door  │                                     │
│                              │  (Global LB + CDN)  │                                     │
│                              │  unified.health.com │                                     │
│                              └──────────┬──────────┘                                     │
│                                         │                                                │
│         ┌───────────────────────────────┼───────────────────────────────┐               │
│         │                               │                               │               │
│         ▼                               ▼                               ▼               │
│  ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐       │
│  │    AMERICAS     │           │     EUROPE      │           │     AFRICA      │       │
│  │    (eastus)     │           │  (westeurope)   │           │(southafricanorth)│       │
│  │                 │           │                 │           │                 │       │
│  │ ┌─────────────┐ │           │ ┌─────────────┐ │           │ ┌─────────────┐ │       │
│  │ │ AKS Cluster │ │           │ │ AKS Cluster │ │           │ │ AKS Cluster │ │       │
│  │ │             │ │           │ │             │ │           │ │             │ │       │
│  │ │ ┌─────────┐ │ │           │ │ ┌─────────┐ │ │           │ │ ┌─────────┐ │ │       │
│  │ │ │API GW   │ │ │           │ │ │API GW   │ │ │           │ │ │API GW   │ │ │       │
│  │ │ └────┬────┘ │ │           │ │ └────┬────┘ │ │           │ │ └────┬────┘ │ │       │
│  │ │      │      │ │           │ │      │      │ │           │ │      │      │ │       │
│  │ │ ┌────┴────┐ │ │           │ │ ┌────┴────┐ │ │           │ │ ┌────┴────┐ │ │       │
│  │ │ │Services │ │ │           │ │ │Services │ │ │           │ │ │Services │ │ │       │
│  │ │ │(6 pods) │ │ │           │ │ │(6 pods) │ │ │           │ │ │(6 pods) │ │ │       │
│  │ │ └─────────┘ │ │           │ │ └─────────┘ │ │           │ │ └─────────┘ │ │       │
│  │ └─────────────┘ │           │ └─────────────┘ │           │ └─────────────┘ │       │
│  │                 │           │                 │           │                 │       │
│  │ ┌─────────────┐ │           │ ┌─────────────┐ │           │ ┌─────────────┐ │       │
│  │ │ PostgreSQL  │ │           │ │ PostgreSQL  │ │           │ │ PostgreSQL  │ │       │
│  │ │  (Primary)  │◄──Async─────│►│  (Primary)  │◄──Async────│►│  (Primary)  │ │       │
│  │ │             │  Replication│ │             │ Replication│ │             │ │       │
│  │ └─────────────┘ │           │ └─────────────┘ │           │ └─────────────┘ │       │
│  │                 │           │                 │           │                 │       │
│  │ ┌─────────────┐ │           │ ┌─────────────┐ │           │ ┌─────────────┐ │       │
│  │ │    Redis    │ │           │ │    Redis    │ │           │ │    Redis    │ │       │
│  │ │   (Cache)   │ │           │ │   (Cache)   │ │           │ │   (Cache)   │ │       │
│  │ └─────────────┘ │           │ └─────────────┘ │           │ └─────────────┘ │       │
│  │                 │           │                 │           │                 │       │
│  │ Compliance:     │           │ Compliance:     │           │ Compliance:     │       │
│  │ HIPAA, SOC2     │           │ GDPR, ISO27001  │           │ POPIA, ISO27001 │       │
│  │                 │           │                 │           │                 │       │
│  │ Currencies:     │           │ Currencies:     │           │ Currencies:     │       │
│  │ USD             │           │ EUR, GBP        │           │ ZAR, NGN, KES   │       │
│  └─────────────────┘           └─────────────────┘           └─────────────────┘       │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              GLOBAL SERVICES                                      │   │
│  │                                                                                   │   │
│  │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐    ┌────────────┐ │   │
│  │   │  Azure ACR    │    │  Key Vault    │    │ Log Analytics │    │  Cosmos DB │ │   │
│  │   │(Geo-Replicated│    │   (Global)    │    │   (Central)   │    │  (Global   │ │   │
│  │   │ eastus,west   │    │               │    │               │    │   Config)  │ │   │
│  │   │ europe,africa)│    │               │    │               │    │            │ │   │
│  │   └───────────────┘    └───────────────┘    └───────────────┘    └────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Separation

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              MICROSERVICES ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                                 ┌─────────────────┐                                     │
│                                 │   API Gateway   │                                     │
│                                 │  (Kong/Traefik) │                                     │
│                                 │                 │                                     │
│                                 │ - Auth/JWT      │                                     │
│                                 │ - Rate Limiting │                                     │
│                                 │ - Routing       │                                     │
│                                 │ - SSL Term      │                                     │
│                                 └────────┬────────┘                                     │
│                                          │                                              │
│     ┌────────────────────────────────────┼────────────────────────────────────┐        │
│     │                    │               │               │                    │        │
│     ▼                    ▼               ▼               ▼                    ▼        │
│ ┌────────┐         ┌────────┐      ┌────────┐      ┌────────┐          ┌────────┐     │
│ │TELEHLTH│         │MENTAL  │      │CHRONIC │      │PHARMACY│          │  LAB   │     │
│ │SERVICE │         │HEALTH  │      │ CARE   │      │SERVICE │          │SERVICE │     │
│ │        │         │SERVICE │      │SERVICE │      │        │          │        │     │
│ │/api/v1/│         │/api/v1/│      │/api/v1/│      │/api/v1/│          │/api/v1/│     │
│ │telehlth│         │mental  │      │chronic │      │pharmacy│          │lab     │     │
│ └───┬────┘         └───┬────┘      └───┬────┘      └───┬────┘          └───┬────┘     │
│     │                  │               │               │                    │          │
│     │ ┌────────────────┴───────────────┴───────────────┴────────────────────┘          │
│     │ │                                                                                 │
│     │ │    ┌─────────────────────────────────────────────────────────────────┐         │
│     │ │    │                    SHARED SERVICES                               │         │
│     │ │    │                                                                  │         │
│     │ │    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │         │
│     │ │    │  │  AUTH    │  │ BILLING  │  │NOTIFICAT │  │  AUDIT   │        │         │
│     │ │    │  │ SERVICE  │  │ SERVICE  │  │ SERVICE  │  │ SERVICE  │        │         │
│     │ │    │  │          │  │          │  │          │  │          │        │         │
│     │ │    │  │- JWT     │  │- Stripe  │  │- Email   │  │- Events  │        │         │
│     │ │    │  │- OAuth   │  │- Invoices│  │- SMS     │  │- HIPAA   │        │         │
│     │ │    │  │- RBAC    │  │- Subs    │  │- Push    │  │- Logs    │        │         │
│     │ │    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │         │
│     │ │    │                                                                  │         │
│     │ │    └─────────────────────────────────────────────────────────────────┘         │
│     │ │                                                                                 │
│     │ │    ┌─────────────────────────────────────────────────────────────────┐         │
│     │ │    │                    DATA LAYER                                    │         │
│     │ │    │                                                                  │         │
│     │ └────┼──►┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │         │
│     │      │   │Patient   │  │Provider  │  │Clinical  │  │Financial │       │         │
│     │      │   │Database  │  │Database  │  │Database  │  │Database  │       │         │
│     │      │   │(PII)     │  │          │  │(PHI)     │  │          │       │         │
│     │      │   └──────────┘  └──────────┘  └──────────┘  └──────────┘       │         │
│     │      │                                                                  │         │
│     └──────┼──►┌──────────┐  ┌──────────┐  ┌──────────┐                     │         │
│            │   │  Redis   │  │  Kafka   │  │   S3/    │                     │         │
│            │   │ (Cache)  │  │ (Events) │  │  Blob    │                     │         │
│            │   └──────────┘  └──────────┘  └──────────┘                     │         │
│            │                                                                  │         │
│            └─────────────────────────────────────────────────────────────────┘         │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Service Boundaries

| Service | Responsibility | Database | Events |
|---------|---------------|----------|--------|
| **Telehealth** | Video/audio consultations, scheduling | appointments, visits | appointment.created, visit.started |
| **Mental Health** | Therapy sessions, psychiatry, crisis | therapy_sessions, assessments | session.completed, crisis.triggered |
| **Chronic Care** | RPM monitoring, care plans | device_readings, care_plans | reading.abnormal, plan.updated |
| **Pharmacy** | Prescriptions, dispensing | prescriptions, pharmacies | rx.created, rx.dispensed |
| **Laboratory** | Test orders, results | lab_orders, lab_results | result.ready, result.abnormal |
| **Auth** | Authentication, authorization | users, tokens | user.created, token.revoked |
| **Billing** | Payments, subscriptions | payments, subscriptions | payment.success, subscription.renewed |
| **Notification** | Email, SMS, push | notifications, preferences | notification.sent |
| **Audit** | Compliance logging | audit_events | event.logged |

---

## Global Deployment

### Regional Configuration

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              REGIONAL DEPLOYMENT MAP                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│    ╔═══════════════════════════════════════════════════════════════════════════════╗   │
│    ║                              WORLD MAP                                         ║   │
│    ║                                                                                ║   │
│    ║                    ┌─────────────┐                                            ║   │
│    ║                    │   EUROPE    │                                            ║   │
│    ║      ┌────────┐    │ westeurope  │                                            ║   │
│    ║      │AMERICAS│    │ Netherlands │                                            ║   │
│    ║      │ eastus │    │             │                                            ║   │
│    ║      │Virginia│    │ GDPR        │                                            ║   │
│    ║      │        │    │ EUR, GBP    │         ┌──────────┐                       ║   │
│    ║      │ HIPAA  │    └─────────────┘         │  AFRICA  │                       ║   │
│    ║      │ USD    │                            │southafrica│                       ║   │
│    ║      └────────┘                            │  north   │                       ║   │
│    ║                                            │Joburg    │                       ║   │
│    ║                                            │          │                       ║   │
│    ║                                            │ POPIA    │                       ║   │
│    ║                                            │ZAR,NGN,KES                       ║   │
│    ║                                            └──────────┘                       ║   │
│    ║                                                                                ║   │
│    ╚═══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Regional Specifications

| Region | Azure Region | Primary Use | Compliance | Currencies | Languages |
|--------|-------------|-------------|------------|------------|-----------|
| **Americas** | eastus | US, Canada, Latin America | HIPAA, SOC2, HITECH | USD, CAD | en, es, pt |
| **Europe** | westeurope | EU, UK | GDPR, ISO27001, NHS | EUR, GBP | en, de, fr, es |
| **Africa** | southafricanorth | Africa | POPIA, ISO27001 | ZAR, NGN, KES | en, sw, fr |

### Data Residency Rules

```yaml
# Data Residency Configuration
data_residency:
  americas:
    patient_pii: "eastus"           # Must stay in US
    phi_data: "eastus"              # HIPAA requirement
    backups: "eastus2"              # Secondary US region
    allowed_regions: ["eastus", "eastus2", "westus"]

  europe:
    patient_pii: "westeurope"       # Must stay in EU
    phi_data: "westeurope"          # GDPR requirement
    backups: "northeurope"          # Secondary EU region
    allowed_regions: ["westeurope", "northeurope", "uksouth"]

  africa:
    patient_pii: "southafricanorth" # Must stay in Africa
    phi_data: "southafricanorth"    # POPIA requirement
    backups: "southafricanorth"     # Same region (limited options)
    allowed_regions: ["southafricanorth"]
```

---

## Data Architecture

### Database Per Service (Logical Separation)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        REGIONAL POSTGRESQL CLUSTER                               │   │
│   │                                                                                  │   │
│   │   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐              │   │
│   │   │   Schema:       │   │   Schema:       │   │   Schema:       │              │   │
│   │   │   patient_core  │   │   clinical      │   │   billing       │              │   │
│   │   │                 │   │                 │   │                 │              │   │
│   │   │ - users         │   │ - appointments  │   │ - payments      │              │   │
│   │   │ - patients      │   │ - encounters    │   │ - subscriptions │              │   │
│   │   │ - providers     │   │ - prescriptions │   │ - invoices      │              │   │
│   │   │ - consents      │   │ - lab_results   │   │ - plans         │              │   │
│   │   │                 │   │ - documents     │   │                 │              │   │
│   │   │ [PII - Encrypted]   │ [PHI - Encrypted]   │ [PCI - Encrypted] │              │   │
│   │   └─────────────────┘   └─────────────────┘   └─────────────────┘              │   │
│   │                                                                                  │   │
│   │   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐              │   │
│   │   │   Schema:       │   │   Schema:       │   │   Schema:       │              │   │
│   │   │   telehealth    │   │   mental_health │   │   chronic_care  │              │   │
│   │   │                 │   │                 │   │                 │              │   │
│   │   │ - visits        │   │ - sessions      │   │ - care_plans    │              │   │
│   │   │ - chat_messages │   │ - assessments   │   │ - device_readings│              │   │
│   │   │ - recordings    │   │ - mood_logs     │   │ - alerts        │              │   │
│   │   │                 │   │ - crisis_events │   │ - medications   │              │   │
│   │   └─────────────────┘   └─────────────────┘   └─────────────────┘              │   │
│   │                                                                                  │   │
│   │   ┌─────────────────┐   ┌─────────────────┐                                    │   │
│   │   │   Schema:       │   │   Schema:       │                                    │   │
│   │   │   pharmacy      │   │   laboratory    │                                    │   │
│   │   │                 │   │                 │                                    │   │
│   │   │ - rx_orders     │   │ - test_orders   │                                    │   │
│   │   │ - pharmacies    │   │ - lab_results   │                                    │   │
│   │   │ - medications   │   │ - test_catalog  │                                    │   │
│   │   │ - inventory     │   │ - lab_partners  │                                    │   │
│   │   └─────────────────┘   └─────────────────┘                                    │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        CROSS-REGION SYNC (Event-Driven)                          │   │
│   │                                                                                  │   │
│   │   Americas ◄────────► Europe ◄────────► Africa                                  │   │
│   │      │                   │                 │                                     │   │
│   │      └───────────────────┴─────────────────┘                                    │   │
│   │                          │                                                       │   │
│   │                   ┌──────▼──────┐                                               │   │
│   │                   │ Azure Event │                                               │   │
│   │                   │    Hubs     │                                               │   │
│   │                   │  (Kafka)    │                                               │   │
│   │                   └─────────────┘                                               │   │
│   │                                                                                  │   │
│   │   Sync Strategy:                                                                │   │
│   │   - Provider profiles: Global (replicated to all regions)                       │   │
│   │   - Patient data: Regional only (data residency)                                │   │
│   │   - Service catalog: Global (replicated)                                        │   │
│   │   - Audit logs: Regional with global aggregation                                │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                           PERIMETER SECURITY                                     │   │
│   │                                                                                  │   │
│   │   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                    │   │
│   │   │  CloudFlare   │   │  Azure WAF    │   │  DDoS Shield  │                    │   │
│   │   │  (CDN + DDoS) │   │  (Rules)      │   │  (Standard)   │                    │   │
│   │   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘                    │   │
│   │           └───────────────────┴───────────────────┘                             │   │
│   │                               │                                                  │   │
│   └───────────────────────────────┼──────────────────────────────────────────────────┘   │
│                                   │                                                      │
│   ┌───────────────────────────────▼──────────────────────────────────────────────────┐   │
│   │                           NETWORK SECURITY                                        │   │
│   │                                                                                  │   │
│   │   ┌───────────────────────────────────────────────────────────────────────────┐ │   │
│   │   │                        Virtual Network                                     │ │   │
│   │   │                                                                            │ │   │
│   │   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌────────────┐  │ │   │
│   │   │   │   Public    │   │  Private    │   │  Database   │   │   Redis    │  │ │   │
│   │   │   │   Subnet    │   │  Subnet     │   │   Subnet    │   │   Subnet   │  │ │   │
│   │   │   │             │   │             │   │             │   │            │  │ │   │
│   │   │   │ - Ingress   │   │ - AKS Pods  │   │ - PostgreSQL│   │ - Redis    │  │ │   │
│   │   │   │ - LB        │   │ - Services  │   │ - Private   │   │ - Private  │  │ │   │
│   │   │   │             │   │             │   │   Endpoint  │   │  Endpoint  │  │ │   │
│   │   │   └─────────────┘   └─────────────┘   └─────────────┘   └────────────┘  │ │   │
│   │   │                                                                            │ │   │
│   │   │   NSG Rules:                                                               │ │   │
│   │   │   - Inbound: 80, 443 from Internet                                        │ │   │
│   │   │   - Internal: Pod-to-pod communication                                    │ │   │
│   │   │   - Database: Only from AKS subnet                                        │ │   │
│   │   │                                                                            │ │   │
│   │   └───────────────────────────────────────────────────────────────────────────┘ │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                           APPLICATION SECURITY                                   │   │
│   │                                                                                  │   │
│   │   Authentication:              Authorization:           Encryption:             │   │
│   │   ┌──────────────┐            ┌──────────────┐         ┌──────────────┐        │   │
│   │   │ JWT Tokens   │            │ RBAC         │         │ TLS 1.3      │        │   │
│   │   │ - Access: 15m│            │ - Roles      │         │ AES-256      │        │   │
│   │   │ - Refresh: 7d│            │ - Permissions│         │ Key Rotation │        │   │
│   │   │ OAuth 2.0    │            │ - Policies   │         │              │        │   │
│   │   │ MFA Support  │            │              │         │              │        │   │
│   │   └──────────────┘            └──────────────┘         └──────────────┘        │   │
│   │                                                                                  │   │
│   │   Secrets Management:          Audit:                                           │   │
│   │   ┌──────────────┐            ┌──────────────┐                                 │   │
│   │   │ Azure Key    │            │ Comprehensive│                                 │   │
│   │   │ Vault        │            │ Audit Logs   │                                 │   │
│   │   │ - DB Creds   │            │ - All Access │                                 │   │
│   │   │ - API Keys   │            │ - All Changes│                                 │   │
│   │   │ - Certs      │            │ - Retention  │                                 │   │
│   │   └──────────────┘            └──────────────┘                                 │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Compliance Matrix

| Requirement | Americas (HIPAA) | Europe (GDPR) | Africa (POPIA) |
|-------------|-----------------|---------------|----------------|
| Data Encryption at Rest | AES-256 | AES-256 | AES-256 |
| Data Encryption in Transit | TLS 1.3 | TLS 1.3 | TLS 1.3 |
| Data Residency | US only | EU only | SA only |
| Consent Management | Required | Required | Required |
| Right to Deletion | 30 days | 30 days | 30 days |
| Breach Notification | 72 hours | 72 hours | 72 hours |
| Audit Logging | 7 years | 6 years | 5 years |
| Access Controls | RBAC + MFA | RBAC + MFA | RBAC + MFA |
| BAA Required | Yes | DPA | PAIA |

---

## Implementation Roadmap

### Phase 1: Microservices Separation (4-6 weeks)
1. Extract Auth Service
2. Extract Billing Service
3. Extract Notification Service
4. Extract Telehealth Service
5. Extract Mental Health Service
6. Extract Chronic Care Service
7. Extract Pharmacy Service
8. Extract Laboratory Service
9. Implement API Gateway

### Phase 2: Multi-Region Infrastructure (4-6 weeks)
1. Deploy Americas region (eastus)
2. Deploy Europe region (westeurope)
3. Deploy Africa region (southafricanorth)
4. Configure Azure Front Door
5. Set up regional databases
6. Configure geo-replication

### Phase 3: Data & Compliance (2-4 weeks)
1. Implement data residency rules
2. Configure regional compliance
3. Set up audit logging
4. Implement consent management
5. Security hardening

### Phase 4: Testing & Launch (2-4 weeks)
1. Integration testing
2. Performance testing
3. Security audit
4. Compliance certification
5. Staged rollout

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Claude | Initial architecture documentation |

---

*This document is maintained as part of the Unified Health Platform documentation.*
