# UnifiedHealth Global Platform

<div align="center">

<!-- TODO: Replace with actual logo path once brand assets are finalized -->
<!-- Suggested locations: packages/asset-branding/logos/ or brand/logos/ -->
<!-- Example: ![UnifiedHealth](./packages/asset-branding/logos/unifiedhealth-logo.svg) -->
**UnifiedHealth Global**

**Multi-Currency | Multi-Region | AI-Powered The Unified Health Ecosystem**

[![Build Status](https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform/actions/workflows/web-frontend-deploy.yml/badge.svg)](https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform/actions)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](CHANGELOG.md)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success.svg)](#1-production-status)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-brightgreen.svg)](docs/compliance/HIPAA.md)
[![FHIR](https://img.shields.io/badge/FHIR-R4-orange.svg)](docs/interoperability/FHIR.md)
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-blue.svg)](docs/compliance/GDPR.md)

**Production Ready | Revenue Score: 100/100 | All Services Operational**

</div>

---

## Documentation Guidelines

This section outlines the standards for contributing to and maintaining this documentation.

### How to Contribute to Documentation

1. **Fork and Branch**: Create a feature branch from `main` with the naming convention `docs/description-of-change`
2. **Follow Standards**: Adhere to the naming conventions and section ordering rules below
3. **Test Links**: Verify all internal links and anchors work correctly before submitting
4. **Review Process**: Submit a Pull Request with a clear description of documentation changes
5. **Conventional Commits**: Use commit messages like `docs: update API documentation` or `docs: add new module section`

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Section Headers | Title Case with section numbers | `## 4. Platform Capabilities` |
| Subsection Headers | Title Case with decimal numbering | `### 4.1 Clinical Operations` |
| Table Column Headers | **Bold** with Title Case | `| **Module** | **Description** |` |
| File References | Lowercase with hyphens | `docs/compliance/hipaa-guide.md` |
| Code References | Backticks with exact case | `` `AuthService` ``, `` `/api/v1/patients` `` |
| Module Names | Title Case | `AI Clinical Documentation` |
| Service Names | Title Case with "Service" suffix | `Auth Service`, `Pharmacy Service` |

### Section Ordering Rules

1. **Main Sections**: Numbered sequentially (1, 2, 3, etc.) in logical reading order
2. **Subsections**: Use decimal notation (4.1, 4.2, 4.3) ordered alphabetically by topic name
3. **Lists within Sections**:
   - Services: Alphabetically within each domain
   - Technologies: Alphabetically by technology name
   - API Endpoints: Alphabetically by endpoint path
   - Features: Assigned sequential numerical IDs (F-001, F-002, etc.)
4. **Tables**:
   - Module tables: Sequential numerical IDs (1, 2, 3...)
   - Service tables: Alphabetically by service name or by port number
   - Sorted consistently within each table type

---

## Table of Contents

- [1. Production Status](#1-production-status)
- [2. Executive Summary](#2-executive-summary)
- [3. Platform at a Glance](#3-platform-at-a-glance)
- [4. Platform Capabilities (22 Enterprise Modules)](#4-platform-capabilities-21-enterprise-modules)
  - [4.1 Clinical Operations](#41-clinical-operations)
  - [4.2 Compliance & Security](#42-compliance--security)
  - [4.3 Data & Analytics](#43-data--analytics)
  - [4.4 Patient Engagement](#44-patient-engagement)
  - [4.5 Revenue Cycle Management](#45-revenue-cycle-management)
  - [4.6 Specialty Solutions](#46-specialty-solutions)
- [5. EHR Telehealth Integration](#5-ehr-telehealth-integration-module-21)
- [6. Healthcare Data Standards & Interoperability](#6-healthcare-data-standards--interoperability)
- [7. Key Features](#7-key-features)
- [8. Architecture](#8-architecture)
- [9. Microservices Architecture (Detailed)](#9-microservices-architecture-detailed)
- [10. Project Structure](#10-project-structure)
- [11. Technology Stack](#11-technology-stack)
- [12. Business Logic & Domain Scope](#12-business-logic--domain-scope)
- [13. Subscription Model](#13-subscription-model)
- [14. User Research & Personas](#14-user-research--personas)
- [15. Quick Start](#15-quick-start)
- [16. CI/CD Pipeline](#16-cicd-pipeline)
- [17. Security & Compliance](#17-security--compliance)
- [18. API Documentation](#18-api-documentation)
- [19. Contributing](#19-contributing)
- [20. Support](#20-support)

---

## 1. Production Status

> **Last Updated:** January 20, 2026

### 1.1 Platform Readiness Overview

| Component            | Status              | Details                                     |
| -------------------- | ------------------- | ------------------------------------------- |
| **Backend Services** | ✅ Production Ready | 22 enterprise modules fully operational     |
| **CI/CD Pipelines**  | ✅ Operational      | GitHub Actions workflows configured         |
| **Compliance**       | ✅ Compliant        | HIPAA, GDPR, POPIA frameworks implemented   |
| **Frontend Apps**    | ✅ Production Ready | 5 applications with real API integration    |
| **Infrastructure**   | ✅ Configured       | AWS/Azure Terraform modules ready           |
| **Security**         | ✅ Hardened         | Rate limiting, JWT auth, encryption enabled |

### 1.2 Services Status (22 Enterprise Modules)

| Service                    | Port | Status   | Database           | Rate Limiting |
| -------------------------- | ---- | -------- | ------------------ | ------------- |
| AI Health Service          | 3020 | ✅ Ready | PostgreSQL         | ✅            |
| API Gateway                | 3000 | ✅ Ready | Stateless          | ✅            |
| Attendance AI Service      | 3021 | ✅ Ready | PostgreSQL         | ✅            |
| Auth Service               | 3001 | ✅ Ready | PostgreSQL         | ✅            |
| Chronic Care Service       | 3003 | ✅ Ready | PostgreSQL         | ✅            |
| Clinical Trials Service    | 3014 | ✅ Ready | PostgreSQL         | ✅            |
| Core API                   | 8080 | ✅ Ready | PostgreSQL         | ✅            |
| Data Normalization Engine  | N/A  | ✅ Ready | Package (FHIR)     | N/A           |
| Interoperability Service   | 3025 | ✅ Ready | PostgreSQL         | ✅            |
| Denial Management Service  | 3010 | ✅ Ready | PostgreSQL         | ✅            |
| Enviro Health Service      | 3022 | ✅ Ready | PostgreSQL         | ✅            |
| Home Health Service        | 3019 | ✅ Ready | PostgreSQL         | ✅            |
| Imaging Service            | 3006 | ✅ Ready | PostgreSQL         | ✅            |
| Laboratory Service         | 3005 | ✅ Ready | PostgreSQL         | ✅            |
| Mental Health Service      | 3002 | ✅ Ready | PostgreSQL         | ✅            |
| Notification Service       | 3007 | ✅ Ready | PostgreSQL + Redis | ✅            |
| Pharmacy Service           | 3004 | ✅ Ready | PostgreSQL         | ✅            |
| Population Health Service  | 3013 | ✅ Ready | PostgreSQL         | ✅            |
| Price Transparency Service | 3011 | ✅ Ready | PostgreSQL         | ✅            |
| Smart Reminders Service    | 3023 | ✅ Ready | PostgreSQL         | ✅            |
| Telehealth Service         | 3001 | ✅ Ready | PostgreSQL         | ✅            |
| Vendor Risk Service        | 3016 | ✅ Ready | PostgreSQL         | ✅            |

### 1.3 Frontend Applications Status

| Application     | Port | Status   | API Integration | Security Config |
| --------------- | ---- | -------- | --------------- | --------------- |
| Admin Dashboard | 3001 | ✅ Ready | Real API calls  | ✅ Hardened     |
| Kiosk App       | 3004 | ✅ Ready | Real API calls  | ✅ Hardened     |
| Mobile App      | N/A  | ✅ Ready | Real API calls  | ✅ Hardened     |
| Provider Portal | 3002 | ✅ Ready | Real API calls  | ✅ Hardened     |
| Web Portal      | 3000 | ✅ Ready | Real API calls  | ✅ Hardened     |

### 1.4 Revenue Readiness Score: 100/100

- ✅ Billing API Endpoints
- ✅ Invoice Generation
- ✅ Multi-Currency Support (50+ currencies)
- ✅ Payment Processing (Stripe Integration)
- ✅ Subscription Management (6-tier plans)

### 1.5 Pre-Deployment Checklist

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your production values

# 3. Run database migrations
pnpm prisma migrate deploy

# 4. Apply infrastructure (optional)
cd infrastructure/terraform-aws && terraform apply

# 5. Start services
pnpm build && pnpm start
```

---

## 2. Executive Summary

### 2.1 The Problem: Fragmented Global Healthcare Delivery

Healthcare systems worldwide face critical challenges that cost lives and drain resources:

| Challenge                          | Impact                                             | Current Reality                                        |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **Digital Divide**                 | Unequal access to telehealth                       | 40% of emerging markets lack reliable connectivity     |
| **Fragmented Patient Records**     | Medical errors, duplicate tests, delayed diagnoses | Average patient has records in 6+ disconnected systems |
| **Lack of Preventive Focus**       | Reactive vs. proactive care                        | Only 8% of healthcare spending on prevention           |
| **Limited Access to Care**         | 50% of world lacks basic healthcare access         | Rural areas: 2+ hours to nearest provider              |
| **Prohibitive Costs**              | Delayed treatment, worse outcomes                  | Traditional EHR: $500K+ implementation                 |
| **Provider Administrative Burden** | Burnout, reduced patient time                      | 34% of physician time spent on documentation           |
| **Siloed Specialty Care**          | Poor care coordination, treatment gaps             | Mental health + chronic care rarely integrated         |

### 2.2 The Solution: UnifiedHealth Global Platform

UnifiedHealth is a **next-generation, AI-powered healthcare SaaS platform** that transforms fragmented healthcare delivery into a unified, intelligent ecosystem. By consolidating telehealth, preventive care, chronic disease management, mental health services, pharmacy operations, and diagnostics into a single patient-centric system, we enable healthcare organizations to deliver better outcomes at lower costs.

### 2.3 Why UnifiedHealth Wins

| Capability             | UnifiedHealth               | Traditional EHR       | Telehealth Apps |
| ---------------------- | --------------------------- | --------------------- | --------------- |
| **AI Integration**     | Native AI/ML workflows      | Add-on modules        | Basic           |
| **Chronic Care + IoT** | Real-time monitoring        | Manual entry          | None            |
| **Deployment Time**    | 24-72 hours (SaaS)          | 6-12 months           | 2-4 weeks       |
| **FHIR Native**        | Built-in R4 compliance      | Retrofitted           | None            |
| **Global Regions**     | 5 continents, 50+ countries | Single region         | US-focused      |
| **Health Checkups**    | Complete engine             | None                  | None            |
| **Mental Health**      | Fully integrated            | Separate system       | Limited         |
| **Multi-Currency**     | 50+ currencies              | USD only              | Limited         |
| **Offline Support**    | Full functionality          | None                  | None            |
| **Starting Cost**      | $500/month                  | $500K+ implementation | Per-visit fees  |

### 2.4 Strategic Value Proposition

**For Employers & Insurers:**

- Chronic disease management reduces claims
- Comprehensive employee wellness platform
- Real-time utilization analytics
- Reduce healthcare costs through prevention

**For Healthcare Organizations:**

- Compliance built-in (HIPAA, GDPR, POPIA)
- Deploy in days, not months
- Enterprise analytics and population health insights
- Multi-tenant architecture with data isolation
- Scalable from single clinic to multi-national enterprise

**For Healthcare Providers:**

- Built-in billing and subscription management
- FHIR-compliant data exchange with any system
- Reduce documentation time by 40% with AI assistance
- Unified view of patient across all touchpoints
- White-label deployment options

**For Patients:**

- Access care anywhere, anytime (offline-first)
- AI-powered symptom assessment and triage
- Family health management in one place
- Single app for all healthcare needs
- Transparent pricing in local currency

### 2.5 Market Opportunity

The global digital health market is projected to reach **$1.5 trillion by 2030**, driven by:

- Chronic disease epidemic (60% of adults have 1+ condition)
- Emerging market healthcare expansion
- Mental health crisis (demand up 25% annually)
- Post-pandemic telehealth adoption (500%+ growth sustained)
- Value-based care transition

UnifiedHealth is uniquely positioned to capture this opportunity with the **only platform combining preventive care + clinical services + AI + global compliance** in a single offering.

---

## 3. Platform at a Glance

> **One Platform. Complete Healthcare.**

A unified, enterprise-grade healthcare platform connecting patients, providers, and organizations with secure, compliant, and interoperable solutions across the entire care continuum.

| Metric | Value |
|--------|-------|
| **Cloud Regions** | Multi-Region (Africa, Americas, Asia-Pacific, Europe, Middle East) |
| **Compliance Frameworks** | 5 (GDPR, HIPAA, HITRUST, POPIA, SOC 2) |
| **Data Standards** | 6+ Healthcare Standards |
| **Integrated Modules** | 22 Enterprise Modules |
| **Interoperability** | C-CDA, DICOM, FHIR R4, HL7v2, NCPDP, X12 EDI |

### 3.1 How The Platform Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CONNECT   │───▶│  NORMALIZE  │───▶│  AUTOMATE   │───▶│  OPTIMIZE   │
│             │    │             │    │             │    │             │
│ Integrate   │    │ Transform   │    │ Deploy AI   │    │ Gain        │
│ with EHR,   │    │ disparate   │    │ workflows   │    │ insights,   │
│ devices,    │    │ data into   │    │ for docs,   │    │ improve     │
│ systems     │    │ standards   │    │ billing,    │    │ outcomes    │
│             │    │             │    │ care coord  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 4. Platform Capabilities (22 Enterprise Modules)

### 4.1 Clinical Operations

Streamline clinical workflows, documentation, and care coordination.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 1 | **AI Clinical Documentation** | Ambient listening that auto-generates clinical notes and suggests billing codes | Auto ICD-10/CPT coding, Multi-specialty templates, Provider attestation, Voice-to-SOAP notes | C-CDA, EHR systems, FHIR R4 |
| 2 | **Care Coordination Hub** | Multi-provider care plan management for complex patients | ADT alerts, SDOH tracking, Secure messaging, Shared care plans, Task assignment | Direct messaging, FHIR CarePlan, HIEs |
| 3 | **EHR Telehealth Integration** | Seamless virtual care embedded directly within EHR workflows | Auto-documentation, Multi-party sessions, One-click video visits, RPM integration, SMART on FHIR auth | FHIR R4 APIs, HL7 ADT/SIU, SMART on FHIR OAuth 2.0, WebRTC |
| 4 | **Prior Authorization Automation** | AI-driven payer submissions with real-time eligibility verification | Appeal generation, Auto-submission, Clinical criteria matching, Real-time eligibility checks | FHIR CRD/DTR, Payer APIs, X12 278/275 |
| 5 | **Surgical Scheduling Optimizer** | AI-powered OR scheduling to maximize utilization | Block optimization, Cancellation prediction, Case duration prediction, Resource allocation | EHR scheduling, OR management systems |

**Benefits:** 10-15% OR utilization improvement, 50%+ documentation time savings, improved coding accuracy, reduced physician burnout.

---

### 4.2 Compliance & Security

Automate compliance and protect sensitive health data.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 6 | **HIPAA Compliance Automation** | Continuous monitoring and audit trail generation | Audit logs, Incident management, Policy templates, Risk assessment automation, Training tracking | Cloud providers, HR systems, SIEM platforms |
| 7 | **Medical Device Security** | IoMT discovery and vulnerability management | Anomaly detection, Device discovery, Network segmentation, Vulnerability scanning | Asset management, Network infrastructure |
| 8 | **Vendor Risk Management** | Third-party security and BAA lifecycle management | BAA management, Continuous monitoring, Risk scoring, Security questionnaires | Contract management, Security rating services |

**Benefits:** Audit readiness, reduced attack surface, reduced compliance burden, regulatory compliance, third-party visibility.

---

### 4.3 Data & Analytics

Transform healthcare data into actionable insights.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 9 | **Clinical Trial Matching** | AI-powered patient-to-trial matching | EHR-based matching, Eligibility parsing, Regulatory compliance, Site feasibility | FHIR ResearchStudy, Trial registries |
| 10 | **Data Normalization Engine** | Standardize multi-source clinical data for analytics | Data quality scoring, HL7v2 to FHIR transformation, Patient matching, Terminology mapping | C-CDA, Custom files, FHIR R4, HL7v2, X12 |
| 11 | **Population Health** | Risk stratification for ACOs and value-based care | Care gap identification, Multi-factor risk models, Quality measure tracking, SDOH integration | Claims data, FHIR Bundles, Health exchanges |

**Benefits:** Analytics-ready data, faster trial enrollment, high-risk patient identification, quality bonus achievement, true interoperability.

---

### 4.4 Patient Engagement

Empower patients with digital tools for better health outcomes.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 12 | **Chronic Care Management** | Remote monitoring + care plan adherence for value-based programs | Alert escalation, Billing automation, Care plan tracking, Device integration (BP, glucose, weight) | Bluetooth/cellular devices, FHIR Observation |
| 13 | **Digital Front Door** | Pre-visit registration, insurance verification, and intake | Copay estimation, Digital consents, Eligibility check, Insurance card OCR, Online scheduling | FHIR Patient/Coverage, X12 270/271 |
| 14 | **Medication Adherence** | Smart reminders and pharmacy coordination | Adherence analytics, Drug interaction alerts, Multi-channel reminders, Refill coordination | FHIR MedicationRequest, NCPDP SCRIPT, Pharmacy networks |
| 15 | **Post-Discharge Follow-Up** | Automated check-ins and readmission prevention | Automated outreach, Escalation workflows, Risk scoring, Symptom assessment | ADT feeds, FHIR Encounter |

**Benefits:** 20%+ readmission reduction, better chronic disease control, CCM/RPM revenue capture, improved PDC scores.

---

### 4.5 Revenue Cycle Management

Optimize financial performance from claim to collection.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 16 | **AI Denial Management** | Predict denials before submission and automate appeals | Auto-appeal generation, Payer analytics, Pre-submission prediction, Root cause analysis | Clearinghouses, X12 835/837 |
| 17 | **Patient Financing** | Embedded payment plans in clinical workflows | Collections optimization, Credit assessment, Financial assistance screening, Payment plan creation | EHR billing, Payment processors |
| 18 | **Price Transparency** | Compliance tools for pricing disclosure requirements | Compliance monitoring, Good faith estimates, Machine-readable files, Patient price lookup | Chargemaster, Payer contracts |

**Benefits:** 30%+ denial reduction, faster recovery, improved collections, reduced bad debt, regulatory compliance.

---

### 4.6 Specialty Solutions

Purpose-built tools for specialized care settings.

| ID | Module | Description | Key Features | Integrations |
|----|--------|-------------|--------------|--------------|
| 19 | **Behavioral Health Platform** | EHR + billing + telehealth for mental health practices | Group therapy support, Integrated telehealth, Outcome assessments, Therapy note templates | Clearinghouses, FHIR QuestionnaireResponse, WebRTC telehealth |
| 20 | **Home Health Workforce** | Scheduling, EVV compliance, and route optimization | Electronic visit verification, Mobile caregiver app, Payroll integration, Route optimization | Payroll systems, State EVV systems |
| 21 | **Imaging Workflow** | DICOM routing and AI-assisted reading prioritization | AI triage, Critical findings alerts, Intelligent routing, Worklist management | DICOM, HL7 ORM/ORU, PACS systems |

**Benefits:** Critical case prioritization, faster turnaround, reduced travel time, regulatory compliance, specialty-optimized workflows.

---

## 5. EHR Telehealth Integration (Module #21)

### 5.1 Seamless Virtual Care Within Your Clinical Workflow

Our EHR telehealth integration enables healthcare providers to conduct virtual visits directly from their existing clinical workflows. Using industry-standard FHIR APIs and SMART on FHIR authentication, the platform provides a unified experience for both providers and patients.

### 5.2 Patient Experience

| Feature | Description | Capabilities |
|---------|-------------|--------------|
| **Family & Caregiver Access** | Include family members or caregivers in visits | Care team collaboration, Interpreter services, Multi-party support |
| **Flexible Join Options** | Multiple ways for patients to connect | Email/SMS links, Portal launch, QR code access |
| **Patient Portal Integration** | Patients launch visits from their secure health portal | Mobile-optimized, No downloads required, Pre-visit check-in |

### 5.3 Provider Experience

| Feature | Description | Capabilities |
|---------|-------------|--------------|
| **Clinic-to-Clinic Workflows** | Support teleconsultation between facilities and specialists | Multi-party video, Remote specialist consults, Shared screen viewing |
| **Mobile Provider Apps** | Conduct visits from mobile devices with full EHR access | Android support, iOS support, Offline documentation, Secure authentication |
| **Provider Desktop Application** | Launch video visits with one click directly from the provider workflow | Integrated patient context, Multi-specialty support, Real-time documentation |

### 5.4 Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EHR TELEHEALTH INTEGRATION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐ │
│  │  SMART on FHIR  │     │   FHIR R4 Data  │     │    WebRTC     │ │
│  │   OAuth 2.0     │     │    Exchange     │     │    Video      │ │
│  │                 │     │                 │     │               │ │
│  │ • Single sign-on│     │ • Patient       │     │ • End-to-end  │ │
│  │ • Role-based    │     │ • Appointment   │     │   encryption  │ │
│  │ • Session mgmt  │     │ • Encounter     │     │ • Adaptive    │ │
│  │ • Token refresh │     │ • DocumentRef   │     │   bitrate     │ │
│  │                 │     │ • Observation   │     │ • Low latency │ │
│  └────────┬────────┘     └────────┬────────┘     └───────┬───────┘ │
│           │                       │                       │         │
│           └───────────────────────┴───────────────────────┘         │
│                                   │                                  │
│                    ┌──────────────▼──────────────┐                  │
│                    │     Auto-Documentation      │                  │
│                    │  • FHIR DocumentReference   │                  │
│                    │  • C-CDA support            │                  │
│                    │  • Structured data capture  │                  │
│                    └─────────────────────────────┘                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.5 Supported Workflows

#### 5.5.1 On-Demand Virtual Visit
```
1. Patient requests urgent virtual visit
2. Triage questionnaire completed
3. Available provider matched
4. Immediate video session launched
5. Visit conducted and documented
6. Prescriptions, referrals as needed
7. Summary shared with primary care
```

#### 5.5.2 Remote Monitoring Check-In
```
1. Patient vitals received from RPM devices
2. Alert triggered based on thresholds
3. Care team notified
4. Video check-in initiated
5. Intervention documented
6. Care plan adjusted if needed
```

#### 5.5.3 Scheduled Video Visit
```
1. Appointment created in EHR scheduler
2. Patient receives confirmation with join instructions
3. Pre-visit: Patient completes intake questionnaire
4. Provider launches from worklist → video session opens
5. Patient joins from portal/email link
6. Visit conducted with real-time documentation
7. Post-visit: Notes auto-filed to EHR
8. Follow-up scheduling and care plan updates
```

### 5.6 Telehealth Compliance

| Standard | Status | Description |
|----------|--------|-------------|
| HIPAA | ✅ Compliant | BAA available, encryption at rest/transit |
| HITRUST | ✅ Certified | CSF certification for healthcare |
| SOC 2 Type II | ✅ Attested | Annual security attestation |
| State Regulations | ✅ Monitored | Telehealth licensing compliance |

---

## 6. Healthcare Data Standards & Interoperability

### 6.1 Cloud & Security Infrastructure

| Component | Features |
|-----------|----------|
| **Audit** | 7-year log retention, Compliance reporting, Immutable audit trails, Real-time anomaly detection |
| **Multi-Cloud** | Auto-scaling infrastructure, Country data residency options, Healthcare-certified regions, Kubernetes orchestration |
| **Security** | AES-256 encryption, HSM key management, TLS 1.3 in transit, Zero-trust architecture |

### 6.2 EHR System Connectivity

#### 6.2.1 FHIR-Based Integration
- Bulk FHIR for population data export
- CDS Hooks for clinical decision support
- SMART on FHIR OAuth 2.0 authentication
- US Core Data for Interoperability (USCDI)

#### 6.2.2 Legacy Integration
- Flat file processing
- HL7v2 message parsing and routing
- Interface engine connectivity
- MLLP and HTTP transport

### 6.3 Healthcare Data Standards

| Standard | Description | Use Cases |
|----------|-------------|-----------|
| **C-CDA** | Clinical document architecture | Care summaries, transitions |
| **DICOM** | Medical imaging standard | Cardiology imaging, Radiology |
| **FHIR R4** | Modern REST-based clinical data exchange | Primary interoperability standard |
| **HL7v2** | Legacy message-based integration | ADT, ORM, ORU, SIU messages |
| **NCPDP SCRIPT** | Pharmacy transactions | E-prescribing, refills |
| **X12 EDI** | Administrative transactions | Authorization, Claims, Eligibility |

### 6.4 Terminology Standards

| Code System | Domain | Description |
|-------------|--------|-------------|
| **CPT/HCPCS** | Procedures | Procedure billing codes |
| **CVX** | Vaccines | Vaccine administered codes |
| **ICD-10-CM** | Diagnoses | Diagnosis classification |
| **LOINC** | Lab observations | Laboratory test codes |
| **NDC** | Drug products | National drug codes |
| **RxNorm** | Medications | Drug terminology |
| **SNOMED CT** | Clinical terms | Comprehensive clinical terminology |
| **UCUM** | Units of measure | Unified units system |

---

## 7. Key Features

### 7.1 Chronic Care Management

| Disease Program   | Monitoring                 | Interventions                               |
| ----------------- | -------------------------- | ------------------------------------------- |
| **Arthritis**     | Mobility, Pain scores      | Medication management, Physical therapy     |
| **COPD**          | Peak flow, SpO2, Symptoms  | Inhaler technique, Pulmonary rehab          |
| **Diabetes**      | Foot exams, Glucose, HbA1c | Medication adjustment, Nutrition counseling |
| **Heart Disease** | ECG, Symptoms, Weight      | Cardiac rehab, Risk factor management       |
| **Hypertension**  | BP monitoring, Heart rate  | Lifestyle modification, Med titration       |

**IoT Device Integration:**

- Activity trackers
- Blood pressure monitors
- Glucose meters
- Pulse oximeters
- Weight scales

### 7.2 Clinical Services

| Feature ID | Feature               | Description                             | Key Capabilities                                            |
|------------|-----------------------|-----------------------------------------|-------------------------------------------------------------|
| F-001 | **15+ Specialties**   | Comprehensive specialty coverage        | Cardiology, Dermatology, Neurology, Oncology, Psychiatry    |
| F-002 | **Care Coordination** | Seamless referral management            | Care team collaboration, Handoffs, Second opinions          |
| F-003 | **E-Prescriptions**   | Digital prescription management         | Allergy alerts, Drug interaction checking, Pharmacy network |
| F-004 | **Telemedicine**      | HD video, audio, and chat consultations | Screen sharing, Waiting room, WebRTC peer-to-peer           |

### 7.3 Enterprise Features

- **API access** for third-party integrations
- **Bulk user management** and provisioning
- **Custom compliance** configurations per region
- **Enterprise analytics** and reporting dashboards
- **Multi-tenant architecture** with complete data isolation
- **SSO integration** (OIDC, SAML 2.0)
- **White-label customization** (branding, domains, workflows)

### 7.4 Health Checkup Engine

- 50+ laboratory tests (CBC, hormones, metabolic panels, tumor markers)
- AI-powered package recommendations based on demographics and risk factors
- Automated workflow with digital queue management
- Imaging diagnostics (DEXA, ECG, Mammography, Ultrasound, X-ray) with AI analysis

**Package Categories:**

- Annual Physical
- Cardiac Risk Assessment
- Diabetes Screening & Management
- Executive Health (comprehensive)
- General Wellness (50+ tests)
- Men's Health (including PSA)
- Pediatric Wellness
- Pre-employment Screening
- Women's Health (including mammography)

### 7.5 Mental Health Services

| Service                      | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| **24/7 Crisis Intervention** | Escalation protocols, hotline integration         |
| **Digital Therapeutics**     | CBT modules, meditation library, mindfulness      |
| **Licensed Therapy**         | Couples, Family, Group, Individual sessions       |
| **Validated Assessments**    | AUDIT, DAST, GAD-7, MDQ, PCL-5, PHQ-9, PSS, YBOCS |

---

## 8. Architecture

### 8.1 Multi-Region Deployment

```
                         +---------------------+
                         |   Global DNS        |
                         |   (Latency-based)   |
                         +----------+----------+
                                    |
           +------------------------+------------------------+
           |                        |                        |
           v                        v                        v
    +-------------+          +-------------+          +-------------+
    |  Americas   |          |   Europe    |          |Asia-Pacific |
    |  US-East-2  |          |  EU-West-1  |          |AP-Southeast |
    +-------------+          +-------------+          +-------------+
    | - ECS       |          | - ECS       |          | - ECS       |
    | - RDS       |          | - RDS       |          | - RDS       |
    | - ElastiCache|         | - ElastiCache|         | - ElastiCache|
    | - S3        |          | - S3        |          | - S3        |
    +-------------+          +-------------+          +-------------+

    Data Residency: Patient data stays in-region per compliance requirements
```

### 8.2 System Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                              CLIENT LAYER                                    |
|  +-----------+  +-----------+  +-----------+  +-----------+  +--------+     |
|  |Admin Panel|  | Kiosk App |  |Mobile App |  | Provider  |  |Web     |     |
|  |(Next.js 14|  | (Port     |  |(React     |  |  Portal   |  |Portal  |     |
|  | Port 3001)|  |  3004)    |  | Native)   |  | Port 3002 |  |(Next.js|     |
|  +-----+-----+  +-----+-----+  +-----+-----+  +-----+-----+  |16 3000)|     |
+--------+---------------+---------------+---------------+-----+---+----------+
         |               |               |               |         |
         +-------+-------+-------+-------+-------+-------+---------+
                                 |
                        +--------v--------+
                        |   CloudFlare    |
                        |   CDN + WAF     |
                        +--------+--------+
                                 |
                                 v
+-----------------------------------------------------------------------------+
|                           API GATEWAY LAYER                                  |
|  +-----------------------------------------------------------------------+  |
|  |                      Express API Gateway (Port 3000)                   |  |
|  |  +--------+  +--------+  +--------+  +--------+  +--------+          |  |
|  |  | CORS   |  | Health |  |  JWT   |  |  Rate  |  |Service |          |  |
|  |  |Handler |  | Checks |  |  Auth  |  |Limiting|  |Registry|          |  |
|  |  +--------+  +--------+  +--------+  +--------+  +--------+          |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
+-----------------------------------------------------------------------------+
|                   MICROSERVICES LAYER (22 Enterprise Modules)                |
|                                                                              |
|  +---------------- DOMAIN 1: CLINICAL OPERATIONS -----------------------+   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  | |AI Clinical| |   Care    | |   Prior   | | Surgical  |              |   |
|  | |   Doc     | |Coordination|    Auth    | |  Scheduler|              |   |
|  | |  (8080)   | |  (3002)   | |  (3004)   | |  (8080)   |              |   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------- DOMAIN 2: COMPLIANCE & SECURITY --------------------+   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  | |  Device   | |  HIPAA    | | Vendor    |                            |   |
|  | | Security  | |Compliance | |   Risk    |                            |   |
|  | |  (3003)   | | (Audit)   | |  (3016)   |                            |   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------- DOMAIN 3: DATA & ANALYTICS --------------------------+   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  | | Clinical  | |   Data    | |Population |                            |   |
|  | |  Trials   | |   Norm    | |  Health   |                            |   |
|  | |  (3014)   | |  (8080)   | |  (3013)   |                            |   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------- DOMAIN 4: PATIENT ENGAGEMENT ------------------------+   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  | | Chronic   | |Medication | |   Post    | |  Patient  |              |   |
|  | |   Care    | | Adherence | | Discharge | |  Intake   |              |   |
|  | |  (3003)   | |  (3004)   | |  (8080)   | |  (8080)   |              |   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------- DOMAIN 5: REVENUE CYCLE MGMT ------------------------+   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  | |AI Denial  | | Patient   | |  Price    |                            |   |
|  | |   Mgmt    | | Financing | |Transparent|                            |   |
|  | |  (3010)   | |  (8080)   | |  (3011)   |                            |   |
|  | +-----------+ +-----------+ +-----------+                            |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------- DOMAIN 6: SPECIALTY SOLUTIONS -----------------------+   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  | |Behavioral | |  Home     | | Imaging   | |Telehealth |              |   |
|  | |  Health   | |  Health   | | Workflow  | |  + EHR    |              |   |
|  | |  (3002)   | |  (3019)   | |  (3006)   | |  (3001)   |              |   |
|  | +-----------+ +-----------+ +-----------+ +-----------+              |   |
|  +----------------------------------------------------------------------+   |
|                                                                              |
|  +---------------------- CORE INFRASTRUCTURE ---------------------------+   |
|  | +-----------+ +-----------+ +-----------+ +-----------+ +----------+ |   |
|  | |   API     | |   Auth    | |Laboratory | |Notification| | Pharmacy| |   |
|  | | Gateway   | | Service   | | Service   | | Service   | | Service | |   |
|  | |  (3000)   | |  (3001)   | |  (3005)   | |  (3006)   | |  (3004) | |   |
|  | +-----------+ +-----------+ +-----------+ +-----------+ +----------+ |   |
|  +----------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
+-----------------------------------------------------------------------------+
|                              DATA LAYER                                      |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
|  |Elasticsearch| |  MinIO   |  |  MongoDB  |  |PostgreSQL |                 |
|  |   8.11.3   |  |S3 Storage|  |  7 (FHIR) |  | 15+Prisma |                 |
|  |   Search   |  |  Files   |  |           |  | Primary DB|                 |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
|                                                                              |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
|  |  Amazon   |  |   AWS     |  | HAPI FHIR |  |   Redis   |                 |
|  |    S3     |  |  Secrets  |  |  Server   |  |  7 Cache  |                 |
|  |  Storage  |  |  Manager  |  |    R4     |  |  +Queues  |                 |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
+-----------------------------------------------------------------------------+
                                 |
                                 v
+-----------------------------------------------------------------------------+
|                          OBSERVABILITY LAYER                                 |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
|  |Application|  |  Jaeger   |  |Prometheus |  |  Winston  |                 |
|  | Insights  |  |  Tracing  |  |  Metrics  |  |  Logging  |                 |
|  +-----------+  +-----------+  +-----------+  +-----------+                 |
+-----------------------------------------------------------------------------+
```

---

## 9. Microservices Architecture (Detailed)

The platform consists of **22 enterprise microservices** organized across 6 operational domains, each following Domain-Driven Design principles with independent databases, APIs, and deployment lifecycles.

### 9.1 Core Infrastructure Services

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| - | API Gateway | 3000 | None (stateless) | JWT validation, Rate limiting, Request routing |
| - | Auth Service | 3001 | PostgreSQL (auth_db) | Authentication, JWT issuance, MFA |
| - | Laboratory Service | 3005 | PostgreSQL (laboratory_db) | Lab orders, LOINC codes, Results |
| - | Notification Service | 3006 | PostgreSQL + Redis | Email, Push notifications, SMS |
| - | Pharmacy Service | 3004 | PostgreSQL (pharmacy_db) | Drug interactions, E-prescriptions, PDMP |

### 9.2 Service Overview by Domain

#### 9.2.1 Domain 1: Clinical Operations (5 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 1 | AI Clinical Documentation | 8080 | PostgreSQL (healthcare_db) | AI SOAP notes, Ambient listening, Coding assistance |
| 2 | Care Coordination | 3002 | PostgreSQL (mental_health_db) | Care transitions, Provider messaging, Task routing |
| 3 | EHR Telehealth Integration | 3001 | PostgreSQL (telehealth_db) | Epic/Cerner integration, Waiting room, WebRTC video |
| 4 | Prior Authorization | 3004 | PostgreSQL (pharmacy_db) | Electronic submission, Payer rules, Status tracking |
| 5 | Surgical Scheduling | 8080 | PostgreSQL (healthcare_db) | AI duration prediction, OR block scheduling |

#### 9.2.2 Domain 2: Compliance & Security (3 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 6 | HIPAA Compliance | N/A | PostgreSQL (audit_db) | Access logging, BAA automation, Breach detection |
| 7 | Medical Device Security | 3003 | PostgreSQL (chronic_care_db) | FDA recalls, Patch management, Vulnerability scanning |
| 8 | Vendor Risk Management | 3016 | PostgreSQL (vendor_db) | Contract tracking, Third-party security assessments |

#### 9.2.3 Domain 3: Data & Analytics (3 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 9 | Clinical Trial Matching | 3014 | PostgreSQL (trials_db) | ClinicalTrials.gov API, Eligibility matching, Enrollment |
| 10 | Data Normalization | 8080 | PostgreSQL (healthcare_db) | C-CDA parsing, FHIR R4, HL7v2, Terminology mapping |
| 11 | Population Health | 3013 | PostgreSQL (population_db) | Cohort analysis, HEDIS/CMS Stars, Risk stratification |

#### 9.2.4 Domain 4: Patient Engagement (4 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 12 | Chronic Care Service | 3003 | PostgreSQL (chronic_care_db) | Care plans, IoT vitals, Remote patient monitoring |
| 13 | Medication Adherence | 3004 | PostgreSQL (pharmacy_db) | PDMP queries, Refill automation, Smart reminders |
| 14 | Patient Intake | 8080 | PostgreSQL (healthcare_db) | Digital forms, Insurance verification, Waitlists |
| 15 | Post-Discharge | 8080 | PostgreSQL (healthcare_db) | Automated outreach, LACE+ scoring, Readmission risk |

#### 9.2.5 Domain 5: Revenue Cycle Management (3 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 16 | AI Denial Management | 3010 | PostgreSQL (denial_db) | Appeal letter AI, Denial prediction, Recovery tracking |
| 17 | Patient Financing | 8080 | PostgreSQL (healthcare_db) | Collection workflows, Credit checks, Payment plans |
| 18 | Price Transparency | 3011 | PostgreSQL (pricing_db) | CMS compliance, Good Faith Estimates, MRF generation |

#### 9.2.6 Domain 6: Specialty Solutions (4 Modules)

| ID | Service | Port | Database | Primary Responsibility |
|----|---------|------|----------|------------------------|
| 19 | Behavioral Health Platform | 3002 | PostgreSQL (mental_health_db) | Crisis intervention, PHQ-9/GAD-7, Therapy sessions |
| 20 | Home Health Workforce | 3019 | PostgreSQL (home_health_db) | Caregiver management, EVV, Visit scheduling |
| 21 | Imaging Workflow | 3006 | PostgreSQL (imaging_db) | AI findings, Critical alerts, DICOM integration |

---

### 9.3 Service Details

#### 9.3.1 API Gateway Service

| Property       | Details                           |
| -------------- | --------------------------------- |
| **Database**   | None (stateless proxy)            |
| **Port**       | 3000                              |
| **Tech Stack** | Express.js, http-proxy-middleware |

**Responsibilities:**

- Central entry point for all API requests
- CORS handling and security headers
- Health check aggregation
- JWT token validation and authentication
- Rate limiting and request throttling
- Service discovery and request routing

**Key Routes:**

```
GET    /api/v1/patients  -> API Service (8080)
GET    /chronic-care/*   -> Chronic Care Service (3003)
GET    /imaging/*        -> Imaging Service (3006)
GET    /laboratory/*     -> Laboratory Service (3005)
GET    /mental-health/*  -> Mental Health Service (3002)
POST   /appointments     -> Telehealth Service (3001)
POST   /auth/*           -> Auth Service (3001)
POST   /pharmacy/*       -> Pharmacy Service (3004)
```

**Service Registry Configuration:**

```javascript
const services = {
  api: { target: "http://api-service:8080", pathRewrite: { "^/api": "" } },
  auth: { target: "http://auth-service:3001", pathRewrite: { "^/auth": "" } },
  chronicCare: { target: "http://chronic-care-service:3003" },
  imaging: { target: "http://imaging-service:3006" },
  laboratory: { target: "http://laboratory-service:3005" },
  mentalHealth: { target: "http://mental-health-service:3002" },
  pharmacy: { target: "http://pharmacy-service:3004" },
  telehealth: { target: "http://telehealth-service:3001" },
};
```

**Dependencies:** `cors`, `express`, `express-rate-limit`, `helmet`, `http-proxy-middleware`, `jsonwebtoken`

---

#### 9.3.2 Auth Service

| Property       | Details                |
| -------------- | ---------------------- |
| **Database**   | PostgreSQL (`auth_db`) |
| **Port**       | 3001                   |
| **Tech Stack** | Express.js, Prisma ORM |

**Responsibilities:**

- Login/logout with JWT issuance
- Multi-factor authentication (MFA)
- OAuth2/OIDC integration (Google, Microsoft)
- Password reset flow
- Refresh token rotation
- Session management
- User registration with email verification

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/forgot-password` | Password reset initiation |
| `POST` | `/auth/login` | Login and JWT issuance |
| `POST` | `/auth/logout` | Invalidate refresh tokens |
| `POST` | `/auth/mfa/enable` | Enable 2FA |
| `POST` | `/auth/mfa/verify` | Verify 2FA code |
| `POST` | `/auth/refresh` | Rotate refresh token |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/reset-password` | Password reset completion |
| `POST` | `/auth/verify-email` | Email verification |

**Database Models:**

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  role          Role     @default(PATIENT)
  mfaEnabled    Boolean  @default(false)
  mfaSecret     String?
  emailVerified Boolean  @default(false)
  refreshTokens RefreshToken[]
  createdAt     DateTime @default(now())
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  revoked   Boolean  @default(false)
}
```

**Inter-Service Communication:**

- Publishes: `PASSWORD_CHANGED`, `USER_REGISTERED`, `USER_VERIFIED` events
- Consumed by: API Service, Notification Service

**Dependencies:** `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `speakeasy`

---

#### 9.3.3 Chronic Care Service

| Property       | Details                                   |
| -------------- | ----------------------------------------- |
| **Database**   | PostgreSQL (`chronic_care_db`)            |
| **Port**       | 3003                                      |
| **Tech Stack** | Bull (job queues), Express.js, Prisma ORM |

**Responsibilities:**

- Alert generation and escalation
- Care plan creation and management
- Disease-specific protocols (COPD, diabetes, hypertension, etc.)
- Goal setting and progress tracking
- IoT device data ingestion
- Medication adherence tracking
- Vital signs monitoring

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/alerts/:patientId` | Get patient alerts |
| `GET` | `/care-plans/:patientId` | Get patient care plan |
| `GET` | `/goals/:patientId/progress` | Goal progress |
| `GET` | `/vitals/:patientId` | Get vital history |
| `POST` | `/care-plans` | Create care plan |
| `POST` | `/devices/register` | Register IoT device |
| `POST` | `/goals` | Set health goal |
| `POST` | `/vitals` | Submit vital reading |
| `PUT` | `/care-plans/:id` | Update care plan |

**Supported IoT Devices:**
| Device Type | Metrics | Brands Supported |
|-------------|---------|-----------------|
| Activity Tracker | Heart Rate, Sleep, Steps | Apple, Fitbit, Garmin |
| Blood Pressure Monitor | Diastolic, Pulse, Systolic | iHealth, Omron, Withings |
| Glucose Meter | Blood glucose, HbA1c | Abbott, Accu-Chek, Dexcom |
| Pulse Oximeter | Heart Rate, SpO2 | Masimo, Nonin |
| Smart Scale | BMI, Body Fat, Weight | Fitbit, Garmin, Withings |

**Database Models:**

```prisma
model CarePlan {
  id           String   @id @default(uuid())
  patientId    String
  condition    ChronicCondition // DIABETES, HYPERTENSION, COPD, HEART_DISEASE
  status       CarePlanStatus
  goals        Goal[]
  medications  Medication[]
  checkIns     CheckIn[]
  createdAt    DateTime @default(now())
}

model VitalReading {
  id        String   @id @default(uuid())
  patientId String
  type      VitalType // BP, GLUCOSE, SPO2, WEIGHT, HEART_RATE
  value     Float
  unit      String
  deviceId  String?
  recordedAt DateTime
}

model Alert {
  id        String   @id @default(uuid())
  patientId String
  type      AlertType // CRITICAL, WARNING, INFO
  message   String
  vitalId   String?
  acknowledged Boolean @default(false)
  createdAt DateTime @default(now())
}
```

**Alert Thresholds:**
| Condition | Critical Alert | Warning Alert |
|-----------|---------------|---------------|
| Blood Glucose | >300 or <70 mg/dL | >180 or <80 mg/dL |
| Blood Pressure | >180/120 or <90/60 | >140/90 or <100/70 |
| Heart Rate | >150 or <40 bpm | >100 or <50 bpm |
| SpO2 | <90% | <94% |

**Dependencies:** `@prisma/client`, `bull`, `ioredis`, `node-cron`

---

#### 9.3.4 Core API Service

| Property       | Details                      |
| -------------- | ---------------------------- |
| **Database**   | PostgreSQL (`healthcare_db`) |
| **Port**       | 8080                         |
| **Tech Stack** | Express.js, Prisma ORM       |

**Responsibilities:**

- Audit logging
- Document management
- FHIR R4 data export
- Health package management
- Patient profile management
- Provider profile and availability
- Subscription and billing (Stripe integration)

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/documents` | List patient documents |
| `GET` | `/fhir/Patient/:id` | FHIR patient export |
| `GET` | `/health-packages` | List health packages |
| `GET` | `/providers` | Search providers |
| `GET/PUT` | `/patients/:id` | Patient profile CRUD |
| `GET/PUT` | `/providers/:id` | Provider profile |
| `POST` | `/documents/upload` | Upload document |
| `POST` | `/health-packages/book` | Book health package |
| `POST` | `/payments` | Process payment |
| `POST` | `/subscriptions` | Create subscription |

**Database Models (31 total):**

```
Appointment, AuditEvent, ChatMessage, ClinicalNote, Consent, DeviceToken,
DiagnosticTest, Document, Encounter, HealthPackage, HealthPackageBooking,
Invoice, InvoiceItem, LabResult, NotificationPreference, Patient, Payment,
PaymentMethod, Plan, Prescription, PrescriptionItem, Provider, PushNotification,
RefreshToken, Subscription, User, Visit, WebhookEventLog
```

**External Integrations:**

- **AWS S3**: Document storage
- **SendGrid**: Transactional emails
- **Stripe**: Payment processing, subscription management

**Dependencies:** `@aws-sdk/client-s3`, `@prisma/client`, `multer`, `stripe`, `winston`

---

#### 9.3.5 Imaging Service

| Property       | Details                   |
| -------------- | ------------------------- |
| **Database**   | PostgreSQL (`imaging_db`) |
| **Port**       | 3006                      |
| **Tech Stack** | Express.js, Prisma ORM    |

**Responsibilities:**

- AI-assisted image analysis
- DICOM image handling
- Multi-modality support
- PACS integration
- Radiology order management
- Report generation and delivery

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/modalities` | List imaging modalities |
| `GET` | `/orders/:id` | Get order details |
| `GET` | `/orders/patient/:id` | Patient imaging orders |
| `GET` | `/reports/:orderId` | Get imaging report |
| `GET` | `/studies/:id` | Get study images |
| `POST` | `/orders` | Create imaging order |
| `POST` | `/reports` | Submit radiology report |
| `POST` | `/studies/:id/upload` | Upload DICOM study |

**Supported Modalities:**
| Modality | Description | AI Features |
|----------|-------------|-------------|
| **CT** | Computed tomography | Abnormality highlighting |
| **DEXA** | Bone density | Osteoporosis scoring |
| **ECG** | Electrocardiogram | Arrhythmia detection |
| **Mammography** | Breast imaging | CAD (Computer-Aided Detection) |
| **MRI** | Magnetic resonance | Brain lesion detection |
| **Ultrasound** | Sonography | Measurement assistance |
| **X-Ray** | General radiography | Lung nodule detection |

**Database Models:**

```prisma
model ImagingOrder {
  id          String   @id @default(uuid())
  patientId   String
  providerId  String
  modality    Modality
  bodyPart    String
  indication  String
  status      OrderStatus
  priority    Priority
  scheduledAt DateTime?
  study       Study?
  report      ImagingReport?
  createdAt   DateTime @default(now())
}

model Study {
  id        String   @id @default(uuid())
  orderId   String   @unique
  studyUid  String   @unique // DICOM Study Instance UID
  accession String
  images    Image[]
  performedAt DateTime
}

model ImagingReport {
  id           String   @id @default(uuid())
  orderId      String   @unique
  radiologistId String
  findings     String
  impression   String
  critical     Boolean  @default(false)
  signedAt     DateTime
}
```

**External Integrations:**

- **AI Providers**: Aidoc, Google Health AI
- **DICOM Standard**: Image storage and retrieval
- **PACS Systems**: dcm4chee, Orthanc

**Dependencies:** `@prisma/client`, `cornerstone-core`, `dicom-parser`, `multer`

---

#### 9.3.6 Laboratory Service

| Property       | Details                      |
| -------------- | ---------------------------- |
| **Database**   | PostgreSQL (`laboratory_db`) |
| **Port**       | 3005                         |
| **Tech Stack** | Express.js, Prisma ORM       |

**Responsibilities:**

- Abnormal result flagging
- HL7/FHIR result ingestion
- Lab network integration
- Lab order management
- Reference range interpretation
- Result processing and delivery
- Test catalog maintenance

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/labs` | Find lab locations |
| `GET` | `/orders/:id` | Get order details |
| `GET` | `/orders/patient/:id` | Patient lab orders |
| `GET` | `/results/:orderId` | Get order results |
| `GET` | `/tests` | List available tests |
| `GET` | `/tests/:code` | Test details |
| `POST` | `/orders` | Create lab order |
| `POST` | `/results` | Submit lab result |

**Test Catalog (Sample):**
| Category | Tests |
|----------|-------|
| **Cardiac** | BNP, CK-MB, Troponin |
| **Chemistry** | BMP, CMP, LFT, Lipid Panel, RFT |
| **Endocrine** | Cortisol, HbA1c, T3, T4, TSH |
| **Hematology** | CBC, Coagulation Panel, ESR |
| **Infectious** | Hepatitis Panel, HIV, STI Panel |
| **Tumor Markers** | AFP, CA-125, CEA, PSA |
| **Urinalysis** | Complete UA, Microalbumin |

**Database Models:**

```prisma
model LabOrder {
  id          String   @id @default(uuid())
  patientId   String
  providerId  String
  status      OrderStatus // PENDING, COLLECTED, PROCESSING, COMPLETED
  priority    Priority    // ROUTINE, URGENT, STAT
  tests       LabOrderTest[]
  results     LabResult[]
  labId       String?
  collectedAt DateTime?
  createdAt   DateTime @default(now())
}

model LabResult {
  id          String   @id @default(uuid())
  orderId     String
  testCode    String
  value       String
  unit        String
  refRangeLow Float?
  refRangeHigh Float?
  flag        ResultFlag? // HIGH, LOW, CRITICAL, ABNORMAL
  notes       String?
  reportedAt  DateTime
}

model LabTest {
  id           String   @id @default(uuid())
  code         String   @unique // LOINC code
  name         String
  category     String
  specimenType String   // BLOOD, URINE, SALIVA, STOOL
  turnaround   Int      // Hours
  price        Decimal
}
```

**External Integrations:**

- **HL7 FHIR**: DiagnosticReport resources
- **LabCorp**: Lab network
- **Quest Diagnostics**: Lab network

**Dependencies:** `@prisma/client`, `decimal.js`, `fhir`, `hl7`

---

#### 9.3.7 Mental Health Service

| Property       | Details                         |
| -------------- | ------------------------------- |
| **Database**   | PostgreSQL (`mental_health_db`) |
| **Port**       | 3002                            |
| **Tech Stack** | Express.js, Prisma ORM          |

**Responsibilities:**

- Crisis intervention protocols
- Digital therapeutic content
- Mood tracking and journaling
- Therapist matching
- Therapy session management (couples, family, group, individual)
- Treatment plan management
- Validated clinical assessments

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/assessments/:patientId` | Assessment history |
| `GET` | `/content/cbt-modules` | CBT content library |
| `GET` | `/mood-entries/:patientId` | Mood tracking data |
| `GET` | `/sessions/:patientId` | Patient session history |
| `GET` | `/therapists` | Search therapists |
| `POST` | `/assessments` | Submit assessment |
| `POST` | `/crisis/escalate` | Crisis escalation |
| `POST` | `/mood-entries` | Log mood entry |
| `POST` | `/sessions` | Book therapy session |

**Validated Assessments:**
| Assessment | Description | Scoring |
|------------|-------------|---------|
| **AUDIT** | Alcohol use | 0-40 (>=8 hazardous) |
| **DAST-10** | Drug abuse screening | 0-10 (>=3 moderate) |
| **GAD-7** | Anxiety screening | 0-21 (>=10 moderate) |
| **MDQ** | Bipolar disorder | Positive if >=7 |
| **PCL-5** | PTSD checklist | 0-80 (>=33 probable PTSD) |
| **PHQ-9** | Depression screening | 0-27 (>=10 moderate) |
| **PSS** | Perceived stress | 0-40 (>=14 moderate) |
| **Y-BOCS** | OCD severity | 0-40 (>=16 moderate) |

**Database Models:**

```prisma
model TherapySession {
  id          String   @id @default(uuid())
  patientId   String
  therapistId String
  sessionType SessionType // INDIVIDUAL, COUPLES, FAMILY, GROUP
  scheduledAt DateTime
  duration    Int      @default(50)
  notes       String?
  status      SessionStatus
}

model Assessment {
  id         String   @id @default(uuid())
  patientId  String
  type       AssessmentType
  responses  Json
  score      Int
  severity   String
  completedAt DateTime
}

model MoodEntry {
  id        String   @id @default(uuid())
  patientId String
  mood      Int      // 1-10 scale
  energy    Int      // 1-10 scale
  anxiety   Int      // 1-10 scale
  notes     String?
  createdAt DateTime @default(now())
}
```

**Crisis Protocol:**

- 24/7 crisis hotline integration
- Automatic escalation for high-risk scores
- Emergency contact notification
- Safety plan generation

**Dependencies:** `@prisma/client`, `express-validator`, `winston`

---

#### 9.3.8 Notification Service

| Property       | Details                               |
| -------------- | ------------------------------------- |
| **Database**   | PostgreSQL (`notification_db`), Redis |
| **Port**       | 3006                                  |
| **Tech Stack** | Bull (job queues), Express.js         |

**Responsibilities:**

- Batch processing
- Delivery tracking and analytics
- Multi-channel notification delivery (Email, Push, SMS)
- Notification preferences
- Scheduled notifications
- Template management

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `DELETE` | `/devices/:token` | Unregister device |
| `GET` | `/history/:userId` | User notification history |
| `GET` | `/preferences/:userId` | Get preferences |
| `GET` | `/templates` | List templates |
| `POST` | `/devices/register` | Register push device |
| `POST` | `/send` | Send notification |
| `POST` | `/send/batch` | Batch send |
| `PUT` | `/preferences/:userId` | Update preferences |

**Notification Channels:**
| Channel | Provider | Use Cases |
|---------|----------|-----------|
| **Email** | SendGrid | Appointments, billing, reports |
| **In-App** | WebSocket | Live notifications |
| **Push (Android)** | FCM | Real-time updates |
| **Push (iOS)** | APNs | Real-time updates |
| **SMS** | Twilio | Alerts, OTP, reminders |

**Notification Types:**

```javascript
const notificationTypes = {
  APPOINTMENT_CONFIRMED: { channels: ["email", "push"] },
  APPOINTMENT_REMINDER: {
    channels: ["email", "sms", "push"],
    timing: "-24h, -1h",
  },
  CRITICAL_ALERT: { channels: ["sms", "push", "email"], priority: "high" },
  LAB_RESULTS_READY: { channels: ["email", "sms", "push"] },
  MEDICATION_REMINDER: { channels: ["push"], recurring: true },
  PAYMENT_RECEIVED: { channels: ["email"] },
  PRESCRIPTION_READY: { channels: ["sms", "push"] },
};
```

**Database Models:**

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String
  channel   Channel  // EMAIL, SMS, PUSH, IN_APP
  status    Status   // PENDING, SENT, DELIVERED, FAILED
  content   Json
  sentAt    DateTime?
  deliveredAt DateTime?
  failReason String?
  createdAt DateTime @default(now())
}

model DeviceToken {
  id       String   @id @default(uuid())
  userId   String
  token    String   @unique
  platform Platform // IOS, ANDROID, WEB
  active   Boolean  @default(true)
  createdAt DateTime @default(now())
}

model NotificationPreference {
  id        String   @id @default(uuid())
  userId    String   @unique
  email     Boolean  @default(true)
  sms       Boolean  @default(true)
  push      Boolean  @default(true)
  quietHoursStart String? // "22:00"
  quietHoursEnd   String? // "07:00"
}
```

**External Integrations:**

- **Apple Push Notification Service (APNs)**: iOS push
- **Firebase Cloud Messaging (FCM)**: Android push
- **SendGrid**: Transactional email (templates, tracking)
- **Twilio**: SMS and voice

**Dependencies:** `@sendgrid/mail`, `apn`, `bull`, `firebase-admin`, `ioredis`, `twilio`

---

#### 9.3.9 Pharmacy Service

| Property       | Details                    |
| -------------- | -------------------------- |
| **Database**   | PostgreSQL (`pharmacy_db`) |
| **Port**       | 3004                       |
| **Tech Stack** | Express.js, Prisma ORM     |

**Responsibilities:**

- Allergy alert system
- Drug database and formulary
- Drug interaction checking
- E-prescription management
- Medication delivery tracking
- Pharmacy network integration
- Refill management

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/medications/search` | Search drug database |
| `GET` | `/orders/:id/track` | Track delivery |
| `GET` | `/pharmacies` | Find nearby pharmacies |
| `GET` | `/prescriptions/:id` | Get prescription |
| `GET` | `/prescriptions/patient/:id` | Patient prescriptions |
| `POST` | `/interactions/check` | Check drug interactions |
| `POST` | `/orders` | Place pharmacy order |
| `POST` | `/prescriptions` | Create prescription |
| `POST` | `/prescriptions/:id/refill` | Request refill |

**Drug Interaction Checking:**

```javascript
// Interaction severity levels (alphabetical)
CONTRAINDICATED; // Do not use together
MINOR; // Generally safe, be aware
MODERATE; // Monitor closely
SEVERE; // Use alternative if possible
```

**Database Models:**

```prisma
model Prescription {
  id          String   @id @default(uuid())
  patientId   String
  providerId  String
  status      PrescriptionStatus // ACTIVE, FILLED, EXPIRED, CANCELLED
  items       PrescriptionItem[]
  pharmacyId  String?
  createdAt   DateTime @default(now())
  expiresAt   DateTime
}

model PrescriptionItem {
  id             String   @id @default(uuid())
  prescriptionId String
  medicationId   String
  dosage         String
  frequency      String
  quantity       Int
  refillsAllowed Int
  refillsUsed    Int      @default(0)
  instructions   String?
}

model Medication {
  id             String   @id @default(uuid())
  name           String
  genericName    String
  ndc            String   @unique // National Drug Code
  strength       String
  form           String   // TABLET, CAPSULE, LIQUID, INJECTION
  manufacturer   String
  interactions   Json     // Drug interaction data
}
```

**External Integrations:**

- **DrugBank API**: Drug information and interactions
- **Pharmacy chains**: CVS, Independent pharmacies, Walgreens
- **Surescripts**: E-prescribing network

**Dependencies:** `@prisma/client`, `axios`, `express-validator`

---

#### 9.3.10 Telehealth Service

| Property       | Details                           |
| -------------- | --------------------------------- |
| **Database**   | PostgreSQL (`telehealth_db`)      |
| **Port**       | 3001                              |
| **Tech Stack** | Express.js, Prisma ORM, Socket.io |

**Responsibilities:**

- Appointment scheduling and management
- Call recording consent
- In-call chat messaging
- Post-consultation notes
- Video consultation room management
- Waiting room functionality
- WebRTC signaling for peer-to-peer video

**Key Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/appointments/:id` | Get appointment details |
| `GET` | `/appointments/patient/:id` | Patient appointments |
| `GET` | `/appointments/provider/:id` | Provider schedule |
| `POST` | `/appointments` | Create appointment |
| `POST` | `/consultations/:id/end` | End consultation |
| `POST` | `/consultations/:id/start` | Start consultation |
| `PUT` | `/appointments/:id/status` | Update status |

**WebSocket Events:**
| Event | Direction | Description |
|-------|-----------|-------------|
| `ANSWER` | Client <-> Client | WebRTC SDP answer |
| `CALL_ENDED` | Server -> Client | Call termination |
| `CHAT_MESSAGE` | Bidirectional | In-call text chat |
| `ICE_CANDIDATE` | Client <-> Client | ICE candidate exchange |
| `JOIN_ROOM` | Client -> Server | Join consultation room |
| `LEAVE_ROOM` | Client -> Server | Leave consultation |
| `OFFER` | Client <-> Client | WebRTC SDP offer |
| `PARTICIPANT_JOINED` | Server -> Client | New participant notification |

**Database Models:**

```prisma
model Appointment {
  id          String   @id @default(uuid())
  patientId   String
  providerId  String
  scheduledAt DateTime
  duration    Int      @default(30)
  type        AppointmentType // VIDEO, AUDIO, CHAT, IN_PERSON
  status      AppointmentStatus // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  roomId      String?
  notes       String?
}

model Consultation {
  id            String   @id @default(uuid())
  appointmentId String   @unique
  startedAt     DateTime
  endedAt       DateTime?
  recording     Boolean  @default(false)
  chatMessages  ChatMessage[]
}
```

**Dependencies:** `@prisma/client`, `ioredis` (for Socket.io adapter), `simple-peer`, `socket.io`

---

### 9.4 Inter-Service Communication

```
+-----------------------------------------------------------------------------+
|                        EVENT-DRIVEN ARCHITECTURE                             |
+-----------------------------------------------------------------------------+
|                                                                              |
|   +----------+      Events        +-------------+                           |
|   |   Auth   | -----------------> |             |                           |
|   | Service  | USER_REGISTERED    |             |                           |
|   +----------+ USER_VERIFIED      |             |                           |
|                                    |             |                           |
|   +----------+      Events        |             |     +--------------+      |
|   | Chronic  | -----------------> |   Redis     | --> | Notification |      |
|   |   Care   | CRITICAL_ALERT     |   Pub/Sub   |     |   Service    |      |
|   +----------+ GOAL_ACHIEVED      |             |     +--------------+      |
|                                    |             |                           |
|   +----------+      Events        |             |                           |
|   |Laboratory| -----------------> |             |                           |
|   | Service  | CRITICAL_RESULT    |             |                           |
|   +----------+ RESULTS_READY      +-------------+                           |
|                                                                              |
|   +----------+      Events                                                  |
|   |Telehealth| -----------------> (Redis Pub/Sub)                           |
|   | Service  | APPOINTMENT_BOOKED                                           |
|   +----------+ CONSULTATION_ENDED                                           |
|                                                                              |
+-----------------------------------------------------------------------------+
|                        SYNCHRONOUS HTTP CALLS                                |
+-----------------------------------------------------------------------------+
|                                                                              |
|   All Services -----> Notification Service (Send notifications)             |
|   API Gateway ------> Auth Service (JWT validation)                         |
|   Laboratory  ------> API Service (Order creation)                          |
|   Pharmacy    ------> API Service (Prescription creation)                   |
|   Telehealth  ------> API Service (Patient lookup)                          |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## 10. Project Structure

```
Global-Healthcare-SaaS-Platform/
|-- .github/workflows/                    # CI/CD Pipelines
|-- apps/                                 # Client Applications
|   |-- admin/                            # Admin Dashboard (Port 3001)
|   |-- kiosk/                            # Hospital Kiosk (Port 3004)
|   |-- mobile/                           # React Native/Expo App (iOS + Android)
|   |-- provider-portal/                  # Provider Workspace (Port 3002)
|   +-- web/                              # Next.js 16 Patient Portal (Port 3000)
|
|-- docker-compose.yml                    # Local development
|-- docs-unified/                         # Documentation
|-- infrastructure/                       # Infrastructure as Code (K8s, Terraform)
|-- k8s/production/                       # Production K8s manifests
|-- package.json                          # Root package
|-- packages/                             # Shared Libraries
|   |-- adapters/                         # Third-party integrations
|   |-- ai-workflows/                     # AI orchestration
|   |-- compliance/                       # HIPAA/GDPR/POPIA utilities
|   |-- country-config/                   # Country-specific configs
|   |-- entitlements/                     # Subscription management
|   |-- fhir/                             # FHIR R4 Resources
|   |-- i18n/                             # Internationalization (25+ languages)
|   |-- policy/                           # Policy engine
|   |-- sdk/                              # TypeScript API Client
|   +-- ui/                               # React Component Library
|
|-- platform/                             # Platform Architecture Specs
|-- pnpm-workspace.yaml                   # Monorepo config
|-- services/                             # Backend Microservices
|   |-- api/                              # Core API Service (Port 8080)
|   |-- api-gateway/                      # Express API Gateway
|   |-- auth-service/                     # Authentication & JWT
|   |-- chronic-care-service/             # Chronic care
|   |-- imaging-service/                  # Medical imaging
|   |-- laboratory-service/               # Lab services
|   |-- mental-health-service/            # Mental health
|   |-- notification-service/             # Email, SMS, Push
|   |-- pharmacy-service/                 # E-pharmacy
|   +-- telehealth-service/               # Video consultations
|
+-- turbo.json                            # Turbo build config
```

---

## 11. Technology Stack

### 11.1 Backend Technologies

| Technology        | Version | Purpose                        | Status |
| ----------------- | ------- | ------------------------------ | ------ |
| **AWS SES**       | 3.x     | Email Delivery (Alternate)     | ✅     |
| **BullMQ**        | 5.x     | Background Job Queue           | ✅     |
| **Elasticsearch** | 8.11.x  | Full-text Search               | ✅     |
| **Express.js**    | 4.21.x  | Web Framework                  | ✅     |
| **MongoDB**       | 7+      | FHIR Document Storage          | ✅     |
| **Node.js**       | 20 LTS  | Runtime Environment            | ✅     |
| **OpenTelemetry** | 1.x     | Distributed Tracing            | ✅     |
| **PostgreSQL**    | 16+     | Primary Relational Database    | ✅     |
| **Prisma**        | 6.1.x   | ORM & Database Client          | ✅     |
| **Redis**         | 7+      | Caching, Sessions & Job Queues | ✅     |
| **SendGrid**      | 8.x     | Email Delivery                 | ✅     |
| **Socket.io**     | 4.8.x   | WebSocket Server               | ✅     |
| **Stripe**        | 17.x    | Payment Processing             | ✅     |
| **Winston**       | 3.17.x  | Structured Logging             | ✅     |

### 11.2 Frontend Technologies

| Technology           | Version | Purpose                     | Status |
| -------------------- | ------- | --------------------------- | ------ |
| **Expo**             | 52.x    | Mobile Development Platform | ✅     |
| **Next.js**          | 15.1.0  | Web Application Framework   | ✅     |
| **React**            | 19.0.0  | UI Framework                | ✅     |
| **React Hook Form**  | 7.54.x  | Form Management             | ✅     |
| **React Native**     | 0.76.x  | Mobile App Framework        | ✅     |
| **Recharts**         | 2.15.x  | Data Visualization          | ✅     |
| **simple-peer**      | 9.11.x  | WebRTC Peer Connections     | ✅     |
| **Socket.io-client** | 4.8.x   | Real-time Communication     | ✅     |
| **Tailwind CSS**     | 3.4.x   | Utility-First Styling       | ✅     |
| **TanStack Query**   | 5.62.x  | Data Fetching & Caching     | ✅     |
| **TypeScript**       | 5.6.3   | Type Safety                 | ✅     |
| **Zod**              | 3.24.x  | Schema Validation           | ✅     |
| **Zustand**          | 5.0.x   | State Management            | ✅     |

### 11.3 Infrastructure & DevOps

| Technology                                  | Purpose                    | Status |
| ------------------------------------------- | -------------------------- | ------ |
| **Amazon ECS Fargate**                      | Serverless Containers      | ✅     |
| **Amazon Elastic Container Registry (ECR)** | Docker Image Storage       | ✅     |
| **Amazon ElastiCache for Redis**            | Managed Cache              | ✅     |
| **Amazon RDS for PostgreSQL**               | Managed Database           | ✅     |
| **Amazon S3**                               | File & Media Storage       | ✅     |
| **AWS CDK**                                 | Infrastructure as Code     | ✅     |
| **AWS Secrets Manager**                     | Secrets Management         | ✅     |
| **Azure Blob Storage**                      | File & Media Storage       | ✅     |
| **Azure Cache for Redis**                   | Managed Cache              | ✅     |
| **Azure Container Apps**                    | Serverless Containers      | ✅     |
| **Azure Container Registry (ACR)**          | Docker Image Storage       | ✅     |
| **Azure Database for PostgreSQL**           | Managed Database           | ✅     |
| **Azure Key Vault**                         | Secrets Management         | ✅     |
| **Docker**                                  | Containerization           | ✅     |
| **GitHub Actions**                          | CI/CD Pipelines            | ✅     |
| **pnpm**                                    | Package Manager            | ✅     |
| **Terraform**                               | Infrastructure as Code     | ✅     |
| **Turborepo**                               | Monorepo Build System      | ✅     |

### 11.4 Security & Compliance

| Technology               | Purpose                  | Status |
| ------------------------ | ------------------------ | ------ |
| **AES-256-GCM**          | Field-Level Encryption   | ✅     |
| **AWS WAF / CloudFlare** | Web Application Firewall | ✅     |
| **bcrypt**               | Password Hashing         | ✅     |
| **CORS**                 | Cross-Origin Protection  | ✅     |
| **express-rate-limit**   | Rate Limiting            | ✅     |
| **helmet**               | Security Headers         | ✅     |
| **JWT + Refresh Tokens** | Authentication           | ✅     |
| **TLS 1.3**              | Transport Encryption     | ✅     |

### 11.5 Testing Stack

| Tool              | Purpose                     | Status |
| ----------------- | --------------------------- | ------ |
| **CodeQL**        | Static Analysis (SAST)      | ✅     |
| **Cypress**       | Component Testing           | ✅     |
| **Gitleaks**      | Secret Detection            | ✅     |
| **Lighthouse CI** | Performance Testing         | ✅     |
| **npm audit**     | Dependency Scanning         | ✅     |
| **Playwright**    | E2E & Accessibility Testing | ✅     |
| **Trivy**         | Container Security Scanning | ✅     |
| **Vitest**        | Unit & Integration Testing  | ✅     |

---

## 12. Business Logic & Domain Scope

### 12.1 Core Business Rules

- **Appointments**: 4 modalities (audio, chat, in-person, video) with status workflow
- **Billing**: 6-tier subscription model, multi-currency, Stripe integration
- **Compliance**: Audit trails, consent tracking, GDPR right to be forgotten
- **Health Checkups**: AI-powered package recommendations, digital queue, result aggregation
- **Prescriptions**: Allergy alerts, Drug interaction checking, Refill management

### 12.2 Database Schema (31 Models)

| Domain            | Models                                                           | Key Relationships                    |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------ |
| **Appointments**  | Appointment, ChatMessage, Visit                                  | Appointment -> Patient, Provider     |
| **Billing**       | Invoice, InvoiceItem, Payment, PaymentMethod, Plan, Subscription | User -> Subscription -> Plan         |
| **Clinical**      | ClinicalNote, Document, Encounter                                | Encounter -> ClinicalNote            |
| **Compliance**    | AuditEvent, WebhookEventLog                                      | All entities -> AuditEvent           |
| **Diagnostics**   | DiagnosticTest, HealthPackage, HealthPackageBooking, LabResult   | Package -> Booking -> Results        |
| **Notifications** | DeviceToken, NotificationPreference, PushNotification            | User -> Preferences                  |
| **Patient**       | Consent, Patient                                                 | Patient -> Appointments, Documents   |
| **Prescriptions** | Prescription, PrescriptionItem                                   | Prescription -> Patient, Provider    |
| **Provider**      | Provider                                                         | Provider -> Appointments, Encounters |
| **User & Auth**   | RefreshToken, User                                               | User -> Patient/Provider             |

### 12.3 Healthcare Domain Model

The platform covers 5 core healthcare domains:

1. **Billing Domain** - Invoices, Payments, Plans, Subscriptions
2. **Clinical Domain** - Clinical notes, Encounters, Lab results, Prescriptions
3. **Compliance Domain** - Audit events, Consent management, Data retention, FHIR translation
4. **Patient Domain** - Appointments, Documents, Patient profiles, Visit history
5. **Provider Domain** - Availability, Credentials, Provider profiles, Specialties

---

## 13. Subscription Model

### 13.1 Enterprise Plans

| Plan                    | Price            | Features                                 |
| ----------------------- | ---------------- | ---------------------------------------- |
| **Enterprise**          | $499/employee/yr | Custom integrations, Full suite, SLA     |
| **Healthcare Provider** | Custom           | FHIR integration, Hospital deployment    |
| **Professional**        | $249/employee/yr | + Analytics, Chronic care, Mental health |
| **Starter**             | $99/employee/yr  | Basic telehealth, wellness content       |

### 13.2 Individual Plans

| Tier                  | Monthly | Annual    | Key Features                                  |
| --------------------- | ------- | --------- | --------------------------------------------- |
| **Chronic Care**      | $49/mo  | $490/yr   | + IoT devices, Remote monitoring              |
| **Essential**         | $19/mo  | $190/yr   | Health records, Scheduling, Virtual GP visits |
| **Mental Wellness**   | $39/mo  | $390/yr   | + Crisis support, Psychiatry, Therapy         |
| **Premium Concierge** | $199/mo | $1,990/yr | 24/7 VIP, Family (5 members), Unlimited       |
| **Preventive**        | $29/mo  | $290/yr   | + Wearable integration, Wellness coaching     |
| **Specialist Access** | $59/mo  | $590/yr   | + 15+ specialties, Priority scheduling        |

### 13.3 Multi-Currency Support

| Region           | Currencies         | Payment Methods  |
| ---------------- | ------------------ | ---------------- |
| **Africa**       | KES, NGN, ZAR      | M-Pesa, Paystack |
| **Americas**     | BRL, CAD, MXN, USD | Square, Stripe   |
| **Asia-Pacific** | AUD, INR, SGD      | Razorpay, Stripe |
| **Europe**       | CHF, EUR, GBP      | Adyen, Stripe    |

---

## 14. User Research & Personas

### 14.1 Accessibility Standards (WCAG 2.1 AA)

- 44px minimum touch targets
- 4.5:1 color contrast ratio
- Full ARIA labels and semantic HTML
- Keyboard navigation with skip links
- Video consultation live captions

### 14.2 Primary Personas

#### 14.2.1 Dr. James - The Overworked Physician (Provider)

- **Age**: 40-55, Low-Moderate tech savvy
- **Features**: AI-assisted documentation, unified patient view
- **Goals**: Reduce documentation, see complete patient picture
- **Pain Points**: 34% time on documentation, EHR complexity

#### 14.2.2 Michael - HR Benefits Manager (Enterprise)

- **Age**: 35-50, Moderate tech savvy
- **Features**: Analytics dashboard, bulk enrollment, reporting
- **Goals**: Employee wellness, demonstrate ROI
- **Pain Points**: Multiple vendors, poor utilization data

#### 14.2.3 Sarah - The Busy Parent (Patient)

- **Age**: 35-45, Moderate tech savvy
- **Features**: 3-click booking, Family dashboard, Medication reminders
- **Goals**: Manage family health, quick care access
- **Pain Points**: Confusing billing, Scattered records, Waiting times

---

## 15. Quick Start

### 15.1 Access Points

| Service         | URL                        |
| --------------- | -------------------------- |
| Admin Dashboard | http://localhost:3001      |
| API Docs        | http://localhost:8080/docs |
| Provider Portal | http://localhost:3002      |
| Web Portal      | http://localhost:3000      |

### 15.2 Development Setup

```bash
# Clone and install
git clone https://github.com/oks-citadel/Global-Healthcare-SaaS-Platform.git
cd Global-Healthcare-SaaS-Platform
pnpm install

# Configure environment
cp .env.example .env

# Start databases
docker compose up -d postgres redis elasticsearch minio

# Run migrations and start
pnpm db:migrate
pnpm dev
```

### 15.3 Prerequisites

```bash
# Install Node.js 20
nvm install 20 && nvm use 20

# Install pnpm
npm install -g pnpm@9
```

---

## 16. CI/CD Pipeline

### 16.1 AWS CodePipeline Architecture

```
GitHub Repository
       │
       ▼
┌──────────────────┐
│   CodePipeline   │ ◄── Orchestrates the entire pipeline
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    CodeBuild     │ ◄── Builds Docker images
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Amazon ECR     │ ◄── Stores container images
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  ECS Fargate     │ ◄── Runs serverless containers
└──────────────────┘
```

### 16.2 Deployment Commands

```bash
# Deploy infrastructure with Terraform
cd infrastructure/terraform
terraform init
terraform plan -var="environment=prod"
terraform apply -var="environment=prod"

# Verify pipeline status
aws codepipeline get-pipeline-state --name unified-health-prod-pipeline

# Check ECR repositories
aws ecr describe-repositories --repository-names unified-health-prod/api-gateway

# View ECS cluster status
aws ecs describe-clusters --clusters unified-health-prod --region us-east-1
```

### 16.3 Pipeline Stages

| Stage      | Action    | Description                           |
| ---------- | --------- | ------------------------------------- |
| **Build**  | CodeBuild | Builds Docker images for all services |
| **Deploy** | ECS       | Updates ECS Fargate services          |
| **Push**   | ECR       | Pushes images to container registry   |
| **Source** | GitHub    | Triggered on push to main branch      |

### 16.4 Services Built

| Service               | ECR Repository                              | Port |
| --------------------- | ------------------------------------------- | ---- |
| Admin Portal          | `unified-health-prod/admin-portal`          | 3001 |
| API Gateway           | `unified-health-prod/api-gateway`           | 3000 |
| Auth Service          | `unified-health-prod/auth-service`          | 3001 |
| Chronic Care Service  | `unified-health-prod/chronic-care-service`  | 3003 |
| Core API              | `unified-health-prod/api`                   | 8080 |
| Imaging Service       | `unified-health-prod/imaging-service`       | 3006 |
| Laboratory Service    | `unified-health-prod/laboratory-service`    | 3005 |
| Mental Health Service | `unified-health-prod/mental-health-service` | 3002 |
| Notification Service  | `unified-health-prod/notification-service`  | 3007 |
| Pharmacy Service      | `unified-health-prod/pharmacy-service`      | 3004 |
| Provider Portal       | `unified-health-prod/provider-portal`       | 3002 |
| Telehealth Service    | `unified-health-prod/telehealth-service`    | 3001 |
| Web App               | `unified-health-prod/web-app`               | 3000 |

---

## 17. Security & Compliance

### 17.1 Compliance Certifications

| Standard          | Status      |
| ----------------- | ----------- |
| **FHIR R4**       | Implemented |
| **GDPR**          | Compliant   |
| **HIPAA**         | Compliant   |
| **POPIA**         | Compliant   |
| **SOC 2 Type II** | In Progress |

### 17.2 Security Features

| Feature                   | Implementation                   |
| ------------------------- | -------------------------------- |
| **Audit Logging**         | Immutable audit trails           |
| **Authentication**        | JWT with refresh tokens, MFA     |
| **Authorization**         | Role-based access control (RBAC) |
| **Encryption at Rest**    | AES-256 via AWS KMS              |
| **Encryption in Transit** | TLS 1.3                          |
| **Secret Management**     | AWS Secrets Manager              |

---

## 18. API Documentation

### 18.1 Core Endpoints

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| `GET`  | `/api/v1/patients/:id`  | Get patient profile |
| `GET`  | `/api/v1/providers`     | Search providers    |
| `POST` | `/api/v1/appointments`  | Create appointment  |
| `POST` | `/api/v1/auth/login`    | User login          |
| `POST` | `/api/v1/auth/register` | User registration   |
| `POST` | `/api/v1/subscriptions` | Create subscription |

### 18.2 WebSocket Events

| Event          | Direction         | Description       |
| -------------- | ----------------- | ----------------- |
| `CHAT_MESSAGE` | Bidirectional     | In-call messaging |
| `JOIN_ROOM`    | Client -> Server  | Join consultation |
| `OFFER/ANSWER` | Client <-> Client | WebRTC signaling  |

---

## 19. Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pnpm lint && pnpm test`)
4. Commit with conventional commits (`feat: add feature`)
5. Open Pull Request

---

## 20. Support

| Channel               | Contact                     |
| --------------------- | --------------------------- |
| **Enterprise Sales**  | enterprise@unifiedhealth.io |
| **Security Issues**   | security@unifiedhealth.io   |
| **Technical Support** | support@unifiedhealth.io    |

---

<div align="center">

**Built for Global Healthcare Transformation**

Copyright 2026 UnifiedHealth Global. All rights reserved.

</div>
