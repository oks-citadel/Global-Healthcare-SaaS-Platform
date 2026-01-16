# Healthcare Domain Microservices

## Overview

This directory contains the domain-driven microservices architecture for the Global Healthcare Platform. Each service is designed as an independent, deployable unit with its own data store, following FHIR R4 as the canonical data model.

## Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                  │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   Web App   │  │ Mobile App  │  │Provider App │  │  External Systems   ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘│
│         │                │                │                     │          │
│         └────────────────┼────────────────┼─────────────────────┘          │
│                          │                │                                 │
│                          ▼                ▼                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      API GATEWAY (Kong/NGINX)                           ││
│  │   • Rate limiting  • Authentication  • Routing  • Load balancing       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ mTLS / Service Mesh
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CORE SERVICES LAYER                                   │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   AUTH SERVICE   │  │  PATIENT SERVICE │  │   FHIR SERVICE   │          │
│  │                  │  │                  │  │                  │          │
│  │ • Authentication │  │ • Demographics   │  │ • FHIR R4 API    │          │
│  │ • Authorization  │  │ • MPI/EMPI       │  │ • Resource CRUD  │          │
│  │ • Token mgmt     │  │ • Consent mgmt   │  │ • Search params  │          │
│  │ • SSO/SAML       │  │ • Patient merge  │  │ • $operations    │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                     │                     │
└───────────┼─────────────────────┼─────────────────────┼─────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DOMAIN SERVICES LAYER                                  │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ APPOINTMENT  │ │  ENCOUNTER   │ │  TELEHEALTH  │ │   PHARMACY   │       │
│  │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │       │
│  │              │ │              │ │              │ │              │       │
│  │ • Scheduling │ │ • Visits     │ │ • Video call │ │ • E-prescribe│       │
│  │ • Reminders  │ │ • Notes      │ │ • Chat       │ │ • Dispense   │       │
│  │ • Waitlist   │ │ • Orders     │ │ • Waiting rm │ │ • Refills    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  LABORATORY  │ │   IMAGING    │ │MENTAL HEALTH │ │ CHRONIC CARE │       │
│  │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │       │
│  │              │ │              │ │              │ │              │       │
│  │ • Orders     │ │ • DICOM      │ │ • Assessments│ │ • Care plans │       │
│  │ • Results    │ │ • Reports    │ │ • Therapy    │ │ • Goals      │       │
│  │ • Panels     │ │ • PACS       │ │ • Sessions   │ │ • Monitoring │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION SERVICES LAYER                              │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ EHR ADAPTER  │ │ HIE ADAPTER  │ │ TERMINOLOGY  │ │ NOTIFICATION │       │
│  │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │       │
│  │              │ │              │ │              │ │              │       │
│  │ • Epic       │ │ • CommonWell │ │ • SNOMED CT  │ │ • Email      │       │
│  │ • Cerner     │ │ • Carequality│ │ • LOINC      │ │ • SMS        │       │
│  │ • Meditech   │ │ • NHS Spine  │ │ • ICD-10     │ │ • Push       │       │
│  │ • gematik    │ │ • MyHealth@EU│ │ • RxNorm     │ │ • In-app     │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SUPPORT SERVICES LAYER                                 │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   BILLING    │ │   DOCUMENT   │ │  ANALYTICS   │ │    AUDIT     │       │
│  │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │       │
│  │              │ │              │ │              │ │              │       │
│  │ • Claims     │ │ • Storage    │ │ • Reporting  │ │ • Logging    │       │
│  │ • Payments   │ │ • Signing    │ │ • Dashboards │ │ • Compliance │       │
│  │ • Insurance  │ │ • Templates  │ │ • ML/AI      │ │ • HIPAA      │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Service Catalog

### Core Services

| Service         | Port | Description                  | FHIR Resources         |
| --------------- | ---- | ---------------------------- | ---------------------- |
| api-gateway     | 8080 | Entry point, routing, auth   | -                      |
| auth-service    | 8081 | Authentication/Authorization | -                      |
| patient-service | 8082 | Patient demographics, MPI    | Patient, RelatedPerson |
| fhir-service    | 8083 | FHIR R4 REST API             | All FHIR R4            |

### Domain Services

| Service               | Port | Description               | FHIR Resources                                |
| --------------------- | ---- | ------------------------- | --------------------------------------------- |
| appointment-service   | 8084 | Scheduling, calendar      | Appointment, Slot, Schedule                   |
| encounter-service     | 8085 | Clinical encounters       | Encounter, EpisodeOfCare                      |
| telehealth-service    | 8086 | Video/chat/remote care    | Communication, DeviceRequest                  |
| pharmacy-service      | 8087 | Prescriptions, dispensing | MedicationRequest, MedicationDispense         |
| laboratory-service    | 8088 | Lab orders/results        | ServiceRequest, Observation, DiagnosticReport |
| imaging-service       | 8089 | DICOM, radiology          | ImagingStudy, DiagnosticReport                |
| mental-health-service | 8090 | Behavioral health         | QuestionnaireResponse, Observation            |
| chronic-care-service  | 8091 | Care management           | CarePlan, Goal, CareTeam                      |

### Integration Services

| Service              | Port | Description      | External Systems        |
| -------------------- | ---- | ---------------- | ----------------------- |
| ehr-adapter-service  | 8092 | EHR connectivity | Epic, Cerner, etc.      |
| hie-adapter-service  | 8093 | HIE connectivity | CommonWell, Carequality |
| terminology-service  | 8094 | Code systems     | SNOMED, LOINC, ICD      |
| notification-service | 8095 | Messaging        | Email, SMS, Push        |

### Support Services

| Service           | Port | Description           | Purpose          |
| ----------------- | ---- | --------------------- | ---------------- |
| billing-service   | 8096 | Financial operations  | Claims, payments |
| document-service  | 8097 | Document management   | Storage, signing |
| analytics-service | 8098 | Business intelligence | Reports, ML      |
| audit-service     | 8099 | Compliance logging    | HIPAA, GDPR      |

## Service Directory Structure

Each microservice follows this standard structure:

```
{service-name}/
├── src/
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # Domain models
│   ├── dtos/             # Data transfer objects
│   ├── events/           # Event publishers/subscribers
│   ├── adapters/         # External system adapters
│   └── utils/            # Helper functions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── prisma/               # Database schema (if applicable)
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Inter-Service Communication

### Synchronous (REST/gRPC)

```yaml
communication:
  internal:
    protocol: gRPC
    discovery: kubernetes_dns
    load_balancing: round_robin
    timeout: 30s
    retry:
      max_attempts: 3
      backoff: exponential

  external:
    protocol: REST/HTTP
    authentication: OAuth 2.0
    rate_limiting: true
```

### Asynchronous (Event-Driven)

```yaml
events:
  broker: kafka
  schema_registry: true

  topics:
    # Patient events
    - name: healthcare.patient.created
      partitions: 6
      retention: 7d

    - name: healthcare.patient.updated
      partitions: 6
      retention: 7d

    # Appointment events
    - name: healthcare.appointment.scheduled
      partitions: 6
      retention: 7d

    - name: healthcare.appointment.cancelled
      partitions: 6
      retention: 7d

    # Encounter events
    - name: healthcare.encounter.started
      partitions: 6
      retention: 7d

    - name: healthcare.encounter.completed
      partitions: 6
      retention: 7d

    # Clinical events
    - name: healthcare.observation.created
      partitions: 12
      retention: 30d

    - name: healthcare.medication.prescribed
      partitions: 6
      retention: 30d

    # Audit events
    - name: healthcare.audit.phi_access
      partitions: 12
      retention: 2190d # 6 years (HIPAA)
```

## Data Management

### Database per Service

```yaml
databases:
  auth-service:
    type: postgresql
    purpose: authentication_data
    encryption: at_rest

  patient-service:
    type: postgresql
    purpose: patient_demographics
    encryption: at_rest_and_phi_fields

  fhir-service:
    type: postgresql
    purpose: fhir_resources
    extensions: [jsonb, full-text-search]

  appointment-service:
    type: postgresql
    purpose: scheduling_data

  document-service:
    type: azure_blob
    purpose: document_storage
    encryption: customer_managed_keys

  analytics-service:
    type: azure_synapse
    purpose: analytical_queries
```

### Data Consistency

```yaml
consistency:
  pattern: saga

  compensating_transactions:
    appointment_booking:
      steps:
        - service: patient-service
          action: verify_patient
          compensation: none

        - service: appointment-service
          action: create_appointment
          compensation: cancel_appointment

        - service: notification-service
          action: send_confirmation
          compensation: send_cancellation

        - service: billing-service
          action: create_charge
          compensation: void_charge
```

## Deployment Configuration

### Kubernetes Manifests

```yaml
# Example: patient-service deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-service
  namespace: healthcare
spec:
  replicas: 3
  selector:
    matchLabels:
      app: patient-service
  template:
    metadata:
      labels:
        app: patient-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8082"
    spec:
      containers:
        - name: patient-service
          image: ghcr.io/global-healthcare/patient-service:latest
          ports:
            - containerPort: 8082
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: patient-service-secrets
                  key: database-url
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 2Gi
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8082
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8082
            initialDelaySeconds: 5
            periodSeconds: 5
```

## Migration from Monolith

### Phase 1: Strangler Fig Pattern

```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
└───────────────────────┬─────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  New Service  │ │  New Service  │ │   Monolith    │
│  (Patient)    │ │  (Appointment)│ │  (remaining)  │
└───────────────┘ └───────────────┘ └───────────────┘
```

### Migration Steps

1. **Extract Auth Service** (Week 1-2)
   - Move authentication logic
   - Implement OAuth 2.0/OIDC
   - Token-based session management

2. **Extract Patient Service** (Week 3-4)
   - Move patient CRUD operations
   - Implement MPI/EMPI logic
   - Set up patient event publishing

3. **Extract Appointment Service** (Week 5-6)
   - Move scheduling logic
   - Implement slot management
   - Connect to notification service

4. **Extract Encounter Service** (Week 7-8)
   - Move visit management
   - Clinical documentation
   - Order management

5. **Extract Remaining Services** (Week 9-16)
   - Telehealth, Pharmacy, Lab, etc.
   - Integration adapters
   - Support services

## Getting Started

### Local Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# Start specific service
docker-compose up -d patient-service

# Run tests
pnpm test:patient-service

# Generate FHIR types
pnpm generate:fhir-types
```

### Service Development

```bash
# Create new service from template
pnpm create:service --name=my-service --port=8100

# Add FHIR resource support
pnpm add:fhir-resource --service=my-service --resource=Observation
```
