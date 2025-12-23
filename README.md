# UnifiedHealth Global Platform

<div align="center">

![UnifiedHealth](https://via.placeholder.com/280x70/0F4C81/FFFFFF?text=UnifiedHealth+Global)

**Multi-Currency | Multi-Region | AI-Powered Unified Healthcare Ecosystem**

[![Build Status](https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform/actions/workflows/web-frontend-deploy.yml/badge.svg)](https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform/actions)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](CHANGELOG.md)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-brightgreen.svg)](docs/compliance/HIPAA.md)
[![FHIR](https://img.shields.io/badge/FHIR-R4-orange.svg)](docs/interoperability/FHIR.md)
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-blue.svg)](docs/compliance/GDPR.md)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [6-Tier Subscription Model](#-6-tier-subscription-model)
- [Project Structure](#-project-structure)
- [Architecture & Traffic Flow](#-architecture--traffic-flow)
- [Tech Stack](#-tech-stack)
- [Azure Cloud Infrastructure](#-azure-cloud-infrastructure)
- [Platform Requirements](#-platform-requirements)
- [Business Segmentation](#-business-segmentation)
- [UX Research Analysis](#-ux-research-analysis)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Security & Compliance](#-security--compliance)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## Overview

**UnifiedHealth Global** is a next-generation, AI-powered healthcare SaaS platform built on a cloud-native microservices architecture. It transforms fragmented healthcare delivery into a unified, intelligent ecosystem combining:

- Comprehensive health checkup programs
- Telemedicine & virtual consultations
- Chronic disease management with IoT integration
- Mental health services with validated assessments
- E-pharmacy with drug interaction checking
- Laboratory & imaging services with AI analysis
- Multi-currency billing across 50+ currencies

### Platform Differentiators

| Feature | UnifiedHealth | Traditional EHR | Telehealth Apps |
|---------|--------------|-----------------|-----------------|
| **Deployment Time** | 24-72 hours (SaaS) | 6-12 months | 2-4 weeks |
| **Offline Support** | Full functionality | None | None |
| **Multi-Currency** | 50+ currencies | USD only | Limited |
| **AI Integration** | Native AI/ML | Add-on modules | Basic |
| **Health Checkups** | Complete engine | None | None |
| **Global Regions** | 4 continents | Single region | US-focused |
| **Starting Cost** | $500/month | $500K+ implementation | Per-visit fees |

---

## Key Features

### Clinical Services
- **Telemedicine**: HD video, audio, and chat consultations with WebRTC
- **15+ Specialties**: Cardiology, dermatology, neurology, oncology, psychiatry, etc.
- **E-Prescriptions**: Drug interaction checking, allergy alerts, pharmacy network
- **Care Coordination**: Referrals, second opinions, care team collaboration

### Health Checkup Engine
- AI-powered package recommendations based on demographics and risk factors
- 50+ laboratory tests (CBC, metabolic panels, tumor markers, hormones)
- Imaging diagnostics (X-ray, ultrasound, mammography, DEXA, ECG) with AI analysis
- Automated workflow with digital queue management

### Mental Health Services
- Licensed therapy (individual, couples, family, group)
- Validated assessments: PHQ-9, GAD-7, PCL-5, AUDIT, DAST, MDQ, YBOCS, PSS
- 24/7 crisis intervention with escalation protocols
- CBT modules, mindfulness programs, meditation library

### Chronic Care Management
- Disease programs: Diabetes, Hypertension, COPD, Heart Disease, Arthritis
- IoT device integration (BP monitors, glucose meters, pulse oximeters)
- Real-time vital sign monitoring with threshold alerts
- Care coordinator check-ins based on risk stratification

### Enterprise Features
- Multi-tenant architecture with data isolation
- White-label customization options
- SSO integration (SAML 2.0, OIDC)
- Enterprise analytics and reporting dashboards
- API access for third-party integrations

---

## 6-Tier Subscription Model

### Individual Plans

| Tier | Price | Features |
|------|-------|----------|
| **Essential** | $19/mo | Virtual GP visits, digital health records, appointment scheduling, symptom checker |
| **Preventive** | $29/mo | + Wellness coaching, wearable integration, health risk assessments, preventive reminders |
| **Mental Wellness** | $39/mo | + Licensed therapy sessions, psychiatry, crisis support, mindfulness programs |
| **Chronic Care** | $49/mo | + Remote monitoring, IoT device support, care coordination, medication tracking |
| **Specialist Access** | $59/mo | + 15+ specialties, priority scheduling, second opinions, specialist consultations |
| **Premium Concierge** | $199/mo | Unlimited access, 24/7 VIP support, dedicated health concierge, family coverage (5 members) |

### Enterprise Plans

| Plan | Annual/Employee | Features |
|------|-----------------|----------|
| **Starter** | $99 | Basic telehealth, wellness content, employee portal |
| **Professional** | $249 | + Mental health, chronic care, basic analytics, API access |
| **Enterprise** | $499 | Full suite, custom integrations, dedicated support, SLA |
| **Healthcare Provider** | Custom | Hospital/clinic deployment, health checkup engine, FHIR integration |

### Add-On Services

| Service | Price |
|---------|-------|
| Pharmacy & Prescription Delivery | $15/mo |
| At-Home Lab Testing | $25/mo |
| AI Health Insights & Reports | $10/mo |
| Family Member (additional) | $10/mo each |

---

## Project Structure

```
Global-Healthcare-SaaS-Platform/
├── apps/                                 # Client Applications
│   ├── web/                              # Next.js 16 Patient Portal (Port 3000)
│   │   ├── src/
│   │   │   ├── app/                      # App Router pages
│   │   │   ├── components/               # React components
│   │   │   │   ├── a11y/                 # Accessibility components
│   │   │   │   ├── layout/               # Layout components
│   │   │   │   └── ui/                   # UI primitives
│   │   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── lib/                      # Utilities
│   │   │   └── providers/                # Context providers
│   │   └── e2e/                          # Playwright E2E tests
│   │
│   ├── mobile/                           # React Native/Expo App
│   │   ├── src/
│   │   │   ├── screens/                  # Mobile screens
│   │   │   ├── components/               # Mobile components
│   │   │   └── navigation/               # Navigation config
│   │   └── app.json                      # Expo configuration
│   │
│   ├── admin/                            # Admin Dashboard (Port 3001)
│   │   └── src/app/                      # Admin pages
│   │       ├── dashboard/                # Analytics dashboard
│   │       ├── users/                    # User management
│   │       ├── providers/                # Provider verification
│   │       ├── billing/                  # Revenue & subscriptions
│   │       └── settings/                 # System configuration
│   │
│   ├── provider-portal/                  # Provider Workspace (Port 3001)
│   │   └── src/app/                      # Provider pages
│   │       ├── appointments/             # Appointment management
│   │       ├── patients/                 # Patient records
│   │       └── consultations/            # Video consultation room
│   │
│   └── kiosk/                            # Hospital Kiosk (Port 3004)
│       └── src/app/                      # Check-in workflow
│
├── services/                             # Backend Microservices
│   ├── api-gateway/                      # Express API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── middleware/               # Auth, rate limiting
│   │   │   ├── routes/                   # Route definitions
│   │   │   └── services/                 # Service registry
│   │   └── Dockerfile
│   │
│   ├── api/                              # Core API Service (Port 8080)
│   │   ├── prisma/                       # Prisma schema & migrations
│   │   ├── src/
│   │   │   ├── routes/                   # API endpoints
│   │   │   ├── services/                 # Business logic
│   │   │   └── middleware/               # Request middleware
│   │   └── tests/                        # API tests
│   │
│   ├── telehealth-service/               # Video Consultations (Port 3001)
│   │   ├── prisma/                       # Telehealth schema
│   │   └── src/
│   │       ├── routes/                   # Appointments, visits
│   │       └── services/                 # WebRTC signaling
│   │
│   ├── mental-health-service/            # Mental Health (Port 3002)
│   │   ├── prisma/                       # Mental health schema
│   │   └── src/
│   │       ├── routes/                   # Therapy, assessments
│   │       └── services/                 # Assessment scoring
│   │
│   ├── chronic-care-service/             # Chronic Care (Port 3003)
│   │   ├── prisma/                       # Care plans, vitals
│   │   └── src/
│   │       ├── routes/                   # Care plans, devices
│   │       └── services/                 # Alert management
│   │
│   ├── pharmacy-service/                 # E-Pharmacy (Port 3004)
│   │   ├── prisma/                       # Prescriptions schema
│   │   └── src/
│   │       ├── routes/                   # Prescriptions, refills
│   │       └── services/                 # Drug interactions
│   │
│   ├── laboratory-service/               # Lab Services (Port 3005)
│   │   ├── prisma/                       # Lab orders schema
│   │   └── src/
│   │       ├── routes/                   # Orders, results
│   │       └── services/                 # Result processing
│   │
│   ├── imaging-service/                  # Medical Imaging (Port 3006)
│   │   ├── prisma/                       # Imaging schema
│   │   └── src/
│   │       ├── routes/                   # Studies, reports
│   │       └── services/                 # AI analysis
│   │
│   └── auth-service/                     # Authentication Service
│       └── src/
│           ├── routes/                   # Auth endpoints
│           └── services/                 # OAuth, MFA
│
├── packages/                             # Shared Libraries
│   ├── sdk/                              # TypeScript API Client
│   │   ├── src/
│   │   │   ├── client.ts                 # API client class
│   │   │   └── types/                    # Type definitions
│   │   └── dist/                         # Built output
│   │
│   ├── ui/                               # React Component Library
│   │   └── src/components/               # Button, Input, Modal, etc.
│   │
│   ├── fhir/                             # FHIR R4 Resources
│   │   └── src/
│   │       ├── resources/                # Patient, Practitioner, etc.
│   │       ├── validation/               # Zod schemas
│   │       └── utils/                    # FHIR utilities
│   │
│   ├── i18n/                             # Internationalization
│   │   └── src/
│   │       ├── locales/                  # Translation files
│   │       └── hooks/                    # useTranslation hook
│   │
│   ├── compliance/                       # Compliance Utilities
│   │   └── src/
│   │       ├── audit/                    # Audit logging
│   │       ├── encryption/               # Field encryption
│   │       └── consent/                  # Consent management
│   │
│   ├── country-config/                   # Country Configurations
│   │   └── src/configs/                  # US, DE, KE, BR, etc.
│   │
│   ├── policy/                           # Policy Engine
│   │   └── src/                          # Feature gates, rules
│   │
│   ├── entitlements/                     # Subscription Entitlements
│   │   └── src/                          # Plan features, quotas
│   │
│   ├── adapters/                         # Third-Party Adapters
│   │   └── src/                          # Payment, SMS, Email
│   │
│   └── ai-workflows/                     # AI Orchestration
│       └── src/
│           ├── assistants/               # AI assistants
│           └── guardrails/               # Safety rules
│
├── infrastructure/                       # Infrastructure as Code
│   ├── kubernetes/                       # K8s Manifests
│   │   ├── base/                         # Base configurations
│   │   │   ├── deployments/              # Deployment specs
│   │   │   ├── services/                 # Service definitions
│   │   │   └── configmaps/               # ConfigMaps
│   │   └── overlays/                     # Environment overlays
│   │       ├── americas/us/              # US deployment
│   │       ├── europe/de/                # Germany deployment
│   │       └── africa/ke/                # Kenya deployment
│   │
│   ├── helm/unified-health/              # Helm Chart
│   │   ├── templates/                    # K8s templates
│   │   ├── values.yaml                   # Default values
│   │   ├── values-staging.yaml           # Staging config
│   │   └── values-production.yaml        # Production config
│   │
│   ├── terraform/                        # Terraform IaC
│   │   ├── azure/                        # Azure infrastructure
│   │   │   ├── main.tf                   # Main config
│   │   │   ├── aks.tf                    # AKS cluster
│   │   │   ├── postgres.tf               # PostgreSQL
│   │   │   └── redis.tf                  # Redis cache
│   │   ├── modules/                      # Reusable modules
│   │   │   ├── country/                  # Country module
│   │   │   └── dns/                      # DNS module
│   │   └── countries/                    # Country configs
│   │
│   └── nginx/                            # Nginx Configuration
│       └── nginx.conf                    # Reverse proxy config
│
├── .github/                              # GitHub Configuration
│   ├── workflows/                        # CI/CD Pipelines
│   │   ├── web-frontend-deploy.yml       # Web frontend CI/CD
│   │   ├── ci.yml                        # Main CI pipeline
│   │   ├── security-gate.yml             # Security scanning
│   │   ├── deploy-staging.yml            # Staging deployment
│   │   └── deploy-production.yml         # Production deployment
│   └── dependabot.yml                    # Dependency updates
│
├── docs/                                 # Documentation
│   ├── architecture/                     # Architecture docs
│   ├── compliance/                       # Compliance guides
│   ├── deployment/                       # Deployment runbooks
│   └── api/                              # API documentation
│
├── scripts/                              # Utility Scripts
│   ├── deploy-production.sh              # Production deploy
│   ├── deploy-staging.sh                 # Staging deploy
│   ├── setup-azure.sh                    # Azure setup
│   └── rollback.sh                       # Deployment rollback
│
├── docker-compose.yml                    # Local development
├── docker-compose.prod.yml               # Production compose
├── pnpm-workspace.yaml                   # Monorepo config
├── turbo.json                            # Turbo build config
├── package.json                          # Root package
└── README.md                             # This file
```

---

## Architecture & Traffic Flow

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐│
│  │ Web Portal  │  │ Mobile App  │  │ Admin Panel │  │  Provider   │  │ Kiosk  ││
│  │ (Next.js 16)│  │(React Native│  │ (Next.js 14)│  │   Portal    │  │  App   ││
│  │  Port 3000  │  │   Expo 54)  │  │  Port 3001  │  │  Port 3001  │  │  3004  ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └───┬────┘│
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┼──────┘
          │                │                │                │             │
          └────────────────┴────────────────┴────────────────┴─────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                      Express API Gateway (Port 3000)                         ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      ││
│  │  │   JWT    │  │   Rate   │  │   CORS   │  │  Service │  │  Health  │      ││
│  │  │   Auth   │  │ Limiting │  │  Handler │  │ Registry │  │  Checks  │      ││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                            │
              ┌─────────────────────────────┼─────────────────────────────┐
              │                             │                             │
              ▼                             ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MICROSERVICES LAYER                                     │
│                                                                                  │
│  ┌─────────────────────────── CLINICAL DOMAIN ─────────────────────────────────┐│
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            ││
│  │ │ Telehealth  │ │   Mental    │ │  Chronic    │ │   Auth      │            ││
│  │ │  Service    │ │   Health    │ │    Care     │ │  Service    │            ││
│  │ │  (3001)     │ │   (3002)    │ │   (3003)    │ │             │            ││
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            ││
│  └──────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────── SUPPORT DOMAIN ──────────────────────────────────┐│
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            ││
│  │ │  Pharmacy   │ │ Laboratory  │ │   Imaging   │ │  Core API   │            ││
│  │ │  Service    │ │  Service    │ │   Service   │ │   (8080)    │            ││
│  │ │  (3004)     │ │   (3005)    │ │   (3006)    │ │             │            ││
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            ││
│  └──────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │    Azure    │  │   Azure     │            │
│  │  Databases  │  │    Cache    │  │    Blob     │  │  Key Vault  │            │
│  │  (per svc)  │  │   Session   │  │   Storage   │  │   Secrets   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Request Flow Example: Patient Books Appointment

```
1. Patient → Web Portal (Next.js)
   └─→ User clicks "Book Appointment"

2. Web Portal → API Gateway
   └─→ POST /api/v1/appointments
   └─→ Headers: Authorization: Bearer <JWT>

3. API Gateway → JWT Validation
   └─→ Validates token, extracts user claims
   └─→ Checks rate limits (100 req/min)

4. API Gateway → Service Registry
   └─→ Routes to Telehealth Service

5. Telehealth Service → PostgreSQL
   └─→ Creates appointment record
   └─→ Checks provider availability

6. Telehealth Service → Notification Service
   └─→ Queues confirmation email/SMS

7. Response → Web Portal
   └─→ 201 Created with appointment details

8. Web Portal → Updates UI
   └─→ Shows confirmation to patient
```

### WebRTC Video Call Flow

```
1. Patient joins consultation
   └─→ Socket.io connection established
   └─→ JOIN_ROOM event with appointment ID

2. Provider joins consultation
   └─→ Socket.io connection established
   └─→ USER_JOINED event broadcast

3. WebRTC Signaling (via Socket.io)
   └─→ Patient sends OFFER (SDP)
   └─→ Provider sends ANSWER (SDP)
   └─→ ICE candidates exchanged

4. Peer-to-Peer Connection
   └─→ Direct video/audio stream
   └─→ No server relay (STUN/TURN for NAT traversal)

5. Chat Messages
   └─→ Socket.io: CHAT_MESSAGE events
   └─→ Stored in PostgreSQL for records
```

---

## Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI Framework |
| **Next.js** | 16.1.0 | Web Application Framework |
| **React Native** | 0.83.1 | Mobile App Framework |
| **Expo** | 54.0.30 | Mobile Development Platform |
| **TypeScript** | 5.3.3 | Type Safety |
| **Tailwind CSS** | 4.1.18 | Utility-First Styling |
| **Zustand** | 5.0.9 | State Management |
| **TanStack Query** | 5.17+ | Data Fetching & Caching |
| **React Hook Form** | 7.49+ | Form Management |
| **Zod** | 3.22.4 | Schema Validation |
| **Socket.io-client** | 4.6.1 | Real-time Communication |
| **SimplePeer** | 9.11.1 | WebRTC Abstraction |
| **Recharts** | 3.6.0 | Data Visualization |
| **Lucide React** | 0.300+ | Icon Library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS | Runtime Environment |
| **Express.js** | 4.18.2 | Web Framework |
| **Prisma** | 5.7.1 | ORM & Database Client |
| **PostgreSQL** | 15+ | Primary Database |
| **Redis** | 7+ | Caching & Sessions |
| **Socket.io** | 4.6.1 | WebSocket Server |
| **Bull** | 4.16.5 | Job Queue |
| **jsonwebtoken** | 9.0.2 | JWT Authentication |
| **bcryptjs** | 2.4.3 | Password Hashing |
| **Stripe** | 20.1.0 | Payment Processing |
| **Twilio** | 5.10.7 | SMS & Voice |
| **SendGrid** | 8.1.6 | Email Delivery |
| **Firebase Admin** | 13.6.0 | Push Notifications |
| **Winston** | 3.11.0 | Logging |
| **OpenTelemetry** | 1.19+ | Distributed Tracing |

### Infrastructure & DevOps

| Technology | Purpose |
|------------|---------|
| **Azure Kubernetes Service (AKS)** | Container Orchestration |
| **Azure Container Registry (ACR)** | Docker Image Storage |
| **Azure Database for PostgreSQL** | Managed Database |
| **Azure Cache for Redis** | Managed Cache |
| **Azure Key Vault** | Secrets Management |
| **Azure Blob Storage** | File Storage |
| **Application Insights** | Monitoring & APM |
| **GitHub Actions** | CI/CD Pipelines |
| **Terraform** | Infrastructure as Code |
| **Helm** | Kubernetes Package Manager |
| **Kustomize** | K8s Configuration Management |
| **Docker** | Containerization |
| **pnpm** | Package Manager |
| **Turbo** | Monorepo Build System |

### Testing Stack

| Tool | Purpose |
|------|---------|
| **Playwright** | E2E Testing |
| **Vitest** | Unit Testing |
| **Lighthouse CI** | Performance Testing |
| **Axe Core** | Accessibility Testing |
| **Trivy** | Security Scanning |
| **Gitleaks** | Secret Detection |
| **CodeQL** | SAST Analysis |

---

## Azure Cloud Infrastructure

### Container Registry (ACR)

**Registry:** `acrunifiedhealthdev2.azurecr.io`

| Image | Description | Latest Tag |
|-------|-------------|------------|
| `unifiedhealth/web` | Patient Portal (Next.js) | `latest`, `main-*` |
| `unifiedhealth/api` | Core API Service | `latest` |
| `unifiedhealth/api-gateway` | API Gateway | `latest` |
| `unifiedhealth/telehealth` | Telehealth Service | `latest` |
| `unifiedhealth/mental-health` | Mental Health Service | `latest` |
| `unifiedhealth/chronic-care` | Chronic Care Service | `latest` |
| `unifiedhealth/pharmacy` | Pharmacy Service | `latest` |
| `unifiedhealth/laboratory` | Laboratory Service | `latest` |
| `unifiedhealth/imaging` | Imaging Service | `latest` |

### Azure Resources

| Resource | Name | Purpose |
|----------|------|---------|
| **Resource Group** | `rg-unified-health-dev2` | Resource container |
| **AKS Cluster** | `aks-unified-health-dev2` | Kubernetes cluster |
| **ACR** | `acrunifiedhealthdev2` | Container registry |
| **PostgreSQL** | `psql-unified-health-dev2` | Database server |
| **Redis** | `redis-unified-health-dev2` | Cache server |
| **Key Vault** | `kv-unified-health-dev2` | Secrets storage |
| **Storage** | `stunifiedhealthdev2` | Blob storage |

### Pulling Images

```bash
# Login to ACR
az acr login --name acrunifiedhealthdev2

# Pull web frontend
docker pull acrunifiedhealthdev2.azurecr.io/unifiedhealth/web:latest

# Pull API
docker pull acrunifiedhealthdev2.azurecr.io/unifiedhealth/api:latest
```

---

## Platform Requirements

### System Requirements

#### Development Environment
- **OS**: Windows 10+, macOS 12+, Ubuntu 20.04+
- **Node.js**: 20.x LTS
- **pnpm**: 9.0.0+
- **Docker**: 24.0+
- **Git**: 2.40+

#### Production Environment
- **Kubernetes**: 1.28+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Container Runtime**: containerd 1.7+

### Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

### Mobile Requirements

| Platform | Minimum Version |
|----------|-----------------|
| iOS | 14.0+ |
| Android | 10.0+ (API 29) |

### Network Requirements

| Port | Service | Protocol |
|------|---------|----------|
| 443 | HTTPS | TCP |
| 80 | HTTP (redirect) | TCP |
| 3000 | Web App (dev) | TCP |
| 8080 | API Gateway (dev) | TCP |

### Healthcare Compliance Requirements

- HIPAA Business Associate Agreement (BAA)
- GDPR Data Processing Agreement (DPA)
- SOC 2 Type II Certification
- PCI DSS Compliance for payments
- Regional data residency requirements

---

## Business Segmentation

### Target Markets

#### B2C - Individual Consumers
- Health-conscious individuals seeking preventive care
- Patients with chronic conditions requiring monitoring
- Mental health support seekers
- Families needing comprehensive healthcare access

#### B2B - Healthcare Providers
- Hospitals implementing digital transformation
- Clinics expanding virtual care capabilities
- Diagnostic centers adding AI-enhanced services
- Pharmacy chains integrating e-prescription systems

#### B2B2C - Employers & Insurers
- Corporations offering employee health benefits
- Insurance companies providing digital health add-ons
- Government health programs modernizing delivery
- Wellness companies expanding service offerings

### Geographic Segments

| Region | Focus | Payment Methods | Compliance |
|--------|-------|-----------------|------------|
| **Americas** | US, Canada, Brazil | Stripe, Square | HIPAA |
| **Europe** | Germany, UK, France | Stripe, Adyen | GDPR |
| **Africa** | Nigeria, Kenya, South Africa | Paystack, M-Pesa, Flutterwave | NDPR, POPIA |
| **Asia-Pacific** | India, Singapore, Australia | Razorpay, Stripe | Local regulations |

### Revenue Streams

1. **Subscription Revenue** - Monthly/annual recurring subscriptions
2. **Transaction Fees** - Per-consultation fees for pay-as-you-go
3. **Enterprise Licensing** - Custom deployment fees
4. **Add-On Services** - Lab tests, prescriptions, premium features
5. **Platform Fees** - Marketplace commissions from providers
6. **API Access** - Usage-based API billing for integrations

---

## UX Research Analysis

### User Personas

#### Primary: Sarah (Patient)
- **Age**: 35-45
- **Tech Savvy**: Moderate
- **Goals**: Convenient healthcare access, manage family health
- **Pain Points**: Long wait times, scattered records, confusing billing
- **Key Features**: Easy booking, family management, unified records

#### Primary: Dr. James (Provider)
- **Age**: 40-55
- **Tech Savvy**: Low-Moderate
- **Goals**: Efficient patient care, reduced admin burden
- **Pain Points**: EHR complexity, documentation time, scheduling chaos
- **Key Features**: Quick access to records, automated documentation

#### Secondary: HR Manager (Enterprise)
- **Age**: 35-50
- **Tech Savvy**: Moderate
- **Goals**: Employee wellness, cost control, compliance
- **Pain Points**: Multiple vendor management, poor utilization data
- **Key Features**: Analytics dashboard, bulk enrollment, reporting

### User Journey Mapping

#### Patient Booking Flow
```
Discovery → Registration → Profile Setup → Provider Search →
Slot Selection → Payment → Confirmation → Appointment →
Consultation → Follow-up → Records Access
```

**Optimizations Applied:**
- 3-click booking process
- Auto-fill from previous visits
- Smart provider recommendations
- Real-time availability updates
- One-tap payment with saved methods

### Accessibility Standards

- **WCAG 2.1 AA Compliance**
- Screen reader optimized (ARIA labels)
- Keyboard navigation support
- Color contrast ratios (4.5:1 minimum)
- Focus management for modals
- Skip links for main content
- Reduced motion options

### Mobile-First Design

- Touch-optimized targets (44px minimum)
- Offline-first architecture
- Progressive image loading
- Native-like gestures
- Biometric authentication support

---

## Quick Start

### Prerequisites

```bash
# Install Node.js 20
nvm install 20
nvm use 20

# Install pnpm
npm install -g pnpm@9

# Verify installations
node --version  # v20.x.x
pnpm --version  # 9.x.x
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform.git
cd Global-Healthcare-SaaS-Platform

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development databases
docker-compose up -d postgres redis

# Run database migrations
pnpm db:migrate

# Start all services
pnpm dev
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Web Portal | http://localhost:3000 | Register new account |
| Admin Dashboard | http://localhost:3001 | admin@example.com |
| API Documentation | http://localhost:8080/docs | N/A |
| API Health Check | http://localhost:8080/health | N/A |

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

---

## Deployment

### CI/CD Pipeline

The platform uses GitHub Actions for automated deployments:

```yaml
# Trigger: Push to main branch
# Steps:
1. Checkout code
2. Setup Node.js & pnpm
3. Install dependencies
4. Build SDK package
5. Type check (non-blocking)
6. Build Docker image
7. Push to Azure ACR
8. Security scan with Trivy
9. Deploy to AKS (if enabled)
```

### Manual Deployment

```bash
# Build all services
pnpm build

# Build Docker images
docker build -f Dockerfile.web.pnpm -t unifiedhealth/web:latest .

# Push to ACR
az acr login --name acrunifiedhealthdev2
docker tag unifiedhealth/web:latest acrunifiedhealthdev2.azurecr.io/unifiedhealth/web:latest
docker push acrunifiedhealthdev2.azurecr.io/unifiedhealth/web:latest

# Deploy to AKS
az aks get-credentials --resource-group rg-unified-health-dev2 --name aks-unified-health-dev2
kubectl apply -k infrastructure/kubernetes/overlays/dev
```

### Environment Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `JWT_SECRET` | JWT signing key | Yes |
| `STRIPE_SECRET_KEY` | Stripe API key | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account ID | Yes |
| `SENDGRID_API_KEY` | SendGrid API key | Yes |
| `AZURE_STORAGE_CONNECTION` | Azure Blob connection | Yes |

---

## Security & Compliance

### Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT with RS256, MFA support |
| **Authorization** | RBAC with role hierarchy |
| **Encryption at Rest** | AES-256 via Azure |
| **Encryption in Transit** | TLS 1.3 |
| **API Security** | Rate limiting, CORS, Helmet |
| **Secret Management** | Azure Key Vault |
| **Audit Logging** | Immutable audit trails |
| **Vulnerability Scanning** | Trivy, Snyk, CodeQL |

### Compliance Certifications

| Standard | Status | Scope |
|----------|--------|-------|
| **HIPAA** | Compliant | US Healthcare Data |
| **GDPR** | Compliant | EU Data Protection |
| **POPIA** | Compliant | South Africa |
| **SOC 2 Type II** | In Progress | Security Controls |
| **ISO 27001** | Planned | Information Security |
| **FHIR R4** | Implemented | Healthcare Interoperability |

### Security Scanning Pipeline

```bash
# Pre-commit hooks
- Gitleaks (secret detection)
- ESLint security rules

# CI Pipeline
- Trivy (container scanning)
- CodeQL (SAST)
- npm audit (dependency check)

# Runtime
- WAF protection
- DDoS mitigation
- Intrusion detection
```

---

## API Documentation

### Authentication

```bash
# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

# Response
{
  "token": "eyJhbGciOiJSUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/register` | User registration |
| `GET` | `/api/v1/patients/:id` | Get patient details |
| `POST` | `/api/v1/appointments` | Create appointment |
| `GET` | `/api/v1/appointments` | List appointments |
| `POST` | `/api/v1/prescriptions` | Create prescription |
| `GET` | `/api/v1/medical-records` | Get medical records |
| `POST` | `/api/v1/payments/subscription` | Create subscription |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `JOIN_ROOM` | Client → Server | Join consultation room |
| `USER_JOINED` | Server → Client | User joined notification |
| `OFFER` | Client → Client | WebRTC offer |
| `ANSWER` | Client → Client | WebRTC answer |
| `ICE_CANDIDATE` | Client → Client | ICE candidate |
| `CHAT_MESSAGE` | Bidirectional | Chat message |
| `CALL_ENDED` | Server → Client | Call termination |

---

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and write tests
4. Run linting (`pnpm lint`)
5. Run tests (`pnpm test`)
6. Commit with conventional commits (`feat: add amazing feature`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style change
refactor: Code refactoring
test: Test addition/modification
chore: Build/tooling changes
```

### Code Review Checklist

- [ ] Tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Security scan passes
- [ ] Documentation updated
- [ ] Accessibility verified

---

## Support & Contact

| Channel | Contact |
|---------|---------|
| **Documentation** | [docs.unifiedhealth.io](https://docs.unifiedhealth.io) |
| **Technical Support** | support@unifiedhealth.io |
| **Enterprise Sales** | enterprise@unifiedhealth.io |
| **Security Issues** | security@unifiedhealth.io |
| **GitHub Issues** | [Create Issue](https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform/issues) |

---

## License

This software is proprietary. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for Global Healthcare Transformation**

© 2025 UnifiedHealth Global. All rights reserved.

</div>

---

## Global Growth Flywheel

### How the Platform Scales

UnifiedHealth's growth strategy is built on a self-reinforcing flywheel that accelerates adoption and revenue expansion across global markets:

```
                    ┌─────────────────────────────────┐
                    │      PLATFORM EXPANSION         │
                    │   (New Countries & Features)    │
                    └─────────────────┬───────────────┘
                                      │
                                      ▼
    ┌──────────────────┐      ┌───────────────────┐      ┌──────────────────┐
    │  COST EFFICIENCY │◄────►│  CUSTOMER VALUE   │◄────►│  USAGE EXPANSION │
    │  Lower unit costs│      │  Better outcomes  │      │  More services   │
    │  Scale economies │      │  Higher retention │      │  Family members  │
    └────────┬─────────┘      └─────────┬─────────┘      └────────┬─────────┘
             │                          │                          │
             │                          ▼                          │
             └─────────────►┌───────────────────────┐◄─────────────┘
                            │    REVENUE GROWTH     │
                            │   ARPU × DAU × LTV    │
                            └───────────────────────┘
```

### Revenue Model by Region

| Region | Primary Revenue | Secondary Revenue | Growth Levers |
|--------|----------------|-------------------|---------------|
| **North America** | Enterprise B2B ($499/employee) | Individual subscriptions | Employer health benefits, insurance partnerships |
| **Europe** | B2B2C insurance ($15/member) | Provider licensing | GDPR-compliant data services, NHS integration |
| **Africa** | B2C subscriptions ($19-49/mo) | Mobile money micropayments | M-Pesa integration, offline-first features |
| **Latin America** | Hybrid B2B + B2C | Pharmacy marketplace fees | Telemedicine adoption, chronic care programs |
| **Asia-Pacific** | Provider SaaS ($10K+/clinic) | API access fees | Digital health mandates, interoperability |

### Customer Usage Expansion Strategy

**Stage 1: Land (Initial Adoption)**
- Single user sign-up with Essential plan ($19/mo)
- First virtual consultation completed
- Health records imported

**Stage 2: Adopt (Core Usage)**
- 3+ consultations per quarter
- At least 2 service categories used
- Mobile app installed

**Stage 3: Expand (Cross-Sell)**
- Family members added (+$10/mo each)
- Mental health or chronic care add-ons
- Lab testing integration

**Stage 4: Advocate (Network Effects)**
- Provider referral to platform
- Employer introduction
- 3+ referrals generated

### Cost Efficiency at Scale

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| **CAC (Customer Acquisition Cost)** | $45 | $28 | $18 |
| **LTV (Lifetime Value)** | $380 | $720 | $1,200 |
| **LTV:CAC Ratio** | 8.4x | 25.7x | 66.7x |
| **Gross Margin** | 62% | 74% | 82% |
| **Server Cost/User/Month** | $2.40 | $0.85 | $0.35 |

**Cost Reduction Drivers:**
1. **Infrastructure Scale** - Azure reserved instances, spot instances for non-critical workloads
2. **AI Automation** - Symptom checker reduces unnecessary consultations by 40%
3. **Shared Services** - Multi-tenant architecture spreads fixed costs
4. **Provider Network** - Higher utilization means lower per-consultation costs
5. **Data Leverage** - Anonymized insights improve matching, reduce churn

### Strategic Advantages

#### 1. Multi-Region Data Residency
- Data stays in-country per compliance requirements
- Enables government health program partnerships
- Reduces latency for local users

#### 2. Offline-First Architecture
- Full functionality without internet (syncs when connected)
- Critical for emerging markets with unreliable connectivity
- Reduces data costs in mobile-heavy regions

#### 3. Currency & Payment Flexibility
- 50+ currencies supported natively
- Local payment methods (M-Pesa, Paystack, Razorpay)
- Automatic FX handling and settlement

#### 4. AI-Native Platform
- Symptom assessment reduces triage time by 60%
- Drug interaction checking prevents errors
- Predictive analytics identify at-risk patients
- Automated documentation saves provider time

#### 5. FHIR Interoperability
- Seamless integration with hospital EHRs
- Patient-controlled data portability
- Reduced vendor lock-in for health systems

