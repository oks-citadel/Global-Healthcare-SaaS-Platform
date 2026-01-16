# Service Migration Map

## Overview

This document maps the existing monolith API (`services/api`) to the new microservices architecture under `platform/services/`.

## Migration Strategy: Strangler Fig Pattern

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CURRENT STATE (Monolith)                         │
│                                                                          │
│  services/api/src/                                                       │
│  ├── controllers/     ──────────────────────────────────────────────────┤
│  │   ├── auth.controller.ts          → auth-service                     │
│  │   ├── user.controller.ts          → auth-service                     │
│  │   ├── patient.controller.ts       → patient-service                  │
│  │   ├── consent.controller.ts       → patient-service                  │
│  │   ├── appointment.controller.ts   → appointment-service              │
│  │   ├── encounter.controller.ts     → encounter-service                │
│  │   ├── visit.controller.ts         → telehealth-service               │
│  │   ├── document.controller.ts      → document-service                 │
│  │   ├── payment.controller.ts       → billing-service                  │
│  │   ├── subscription.controller.ts  → billing-service                  │
│  │   ├── plan.controller.ts          → billing-service                  │
│  │   ├── notification.controller.ts  → notification-service             │
│  │   ├── push.controller.ts          → notification-service             │
│  │   ├── audit.controller.ts         → audit-service                    │
│  │   ├── dashboard.controller.ts     → analytics-service                │
│  │   ├── health.controller.ts        → api-gateway (shared)             │
│  │   └── realtime.controller.ts      → telehealth-service               │
│  │                                                                       │
│  ├── services/        ──────────────────────────────────────────────────┤
│  │   ├── auth.service.ts             → auth-service                     │
│  │   ├── patient.service.ts          → patient-service                  │
│  │   ├── consent.service.ts          → patient-service                  │
│  │   ├── appointment.service.ts      → appointment-service              │
│  │   ├── encounter.service.ts        → encounter-service                │
│  │   ├── visit.service.ts            → telehealth-service               │
│  │   ├── webrtc.service.ts           → telehealth-service               │
│  │   ├── document.service.ts         → document-service                 │
│  │   ├── payment.service.ts          → billing-service                  │
│  │   ├── subscription.service.ts     → billing-service                  │
│  │   ├── plan.service.ts             → billing-service                  │
│  │   ├── email.service.ts            → notification-service             │
│  │   ├── notification.service.ts     → notification-service             │
│  │   ├── email-templates.service.ts  → notification-service             │
│  │   ├── sms-templates.service.ts    → notification-service             │
│  │   ├── audit.service.ts            → audit-service                    │
│  │   └── user.service.ts             → auth-service                     │
│  │                                                                       │
│  ├── repositories/    ──────────────────────────────────────────────────┤
│  │   ├── user.repository.ts          → auth-service                     │
│  │   ├── patient.repository.ts       → patient-service                  │
│  │   ├── consent.repository.ts       → patient-service                  │
│  │   ├── appointment.repository.ts   → appointment-service              │
│  │   ├── encounter.repository.ts     → encounter-service                │
│  │   ├── document.repository.ts      → document-service                 │
│  │   ├── subscription.repository.ts  → billing-service                  │
│  │   ├── audit.repository.ts         → audit-service                    │
│  │   ├── provider.repository.ts      → provider-service (new)           │
│  │   └── base.repository.ts          → shared/packages                  │
│  │                                                                       │
│  ├── middleware/      ──────────────────────────────────────────────────┤
│  │   ├── auth.middleware.ts          → api-gateway + auth-service       │
│  │   ├── audit.middleware.ts         → audit-service                    │
│  │   ├── cache.middleware.ts         → shared/packages                  │
│  │   ├── compliance.middleware.ts    → api-gateway                      │
│  │   ├── compression.middleware.ts   → api-gateway                      │
│  │   ├── correlation.middleware.ts   → api-gateway                      │
│  │   ├── encryption.middleware.ts    → shared/packages                  │
│  │   ├── error.middleware.ts         → shared/packages                  │
│  │   ├── metrics.middleware.ts       → api-gateway                      │
│  │   ├── rate-limit.middleware.ts    → api-gateway                      │
│  │   ├── security-headers.middleware → api-gateway                      │
│  │   ├── security.middleware.ts      → api-gateway                      │
│  │   └── session.middleware.ts       → auth-service                     │
│  │                                                                       │
│  ├── lib/             ──────────────────────────────────────────────────┤
│  │   ├── prisma.ts                   → shared/packages/database         │
│  │   ├── cache.ts                    → shared/packages/cache            │
│  │   ├── redis-cache.ts              → shared/packages/cache            │
│  │   ├── encryption.ts               → shared/packages/security         │
│  │   ├── phi-filter.ts               → shared/packages/security         │
│  │   ├── email.ts                    → notification-service             │
│  │   ├── sms.ts                      → notification-service             │
│  │   ├── push.ts                     → notification-service             │
│  │   ├── stripe.ts                   → billing-service                  │
│  │   ├── storage.ts                  → document-service                 │
│  │   ├── socket.ts                   → telehealth-service               │
│  │   ├── websocket.ts                → telehealth-service               │
│  │   ├── websocket-*.ts              → telehealth-service               │
│  │   ├── metrics.ts                  → shared/packages/observability    │
│  │   ├── tracing.ts                  → shared/packages/observability    │
│  │   ├── circuit-breaker.ts          → shared/packages/resilience       │
│  │   ├── retry.ts                    → shared/packages/resilience       │
│  │   ├── queue.ts                    → shared/packages/messaging        │
│  │   ├── azure-keyvault.ts           → shared/packages/secrets          │
│  │   ├── graceful-shutdown.ts        → shared/packages/lifecycle        │
│  │   └── health-checks.ts            → shared/packages/health           │
│  │                                                                       │
│  └── dtos/            ──────────────────────────────────────────────────┤
│      ├── auth.dto.ts                 → auth-service                     │
│      ├── patient.dto.ts              → patient-service                  │
│      ├── appointment.dto.ts          → appointment-service              │
│      ├── encounter.dto.ts            → encounter-service                │
│      ├── document.dto.ts             → document-service                 │
│      ├── payment.dto.ts              → billing-service                  │
│      ├── notification.dto.ts         → notification-service             │
│      ├── push.dto.ts                 → notification-service             │
│      └── user.dto.ts                 → auth-service                     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Target Microservices Architecture

### 1. Auth Service (`platform/services/auth-service`)

**Source Files:**

- `controllers/auth.controller.ts`
- `controllers/user.controller.ts`
- `services/auth.service.ts`
- `services/user.service.ts`
- `repositories/user.repository.ts`
- `middleware/auth.middleware.ts`
- `middleware/session.middleware.ts`
- `dtos/auth.dto.ts`
- `dtos/user.dto.ts`

**API Routes:**

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
GET    /roles
GET    /users/:id
PATCH  /users/:id
```

**Port:** 8081

---

### 2. Patient Service (`platform/services/patient-service`)

**Source Files:**

- `controllers/patient.controller.ts`
- `controllers/consent.controller.ts`
- `services/patient.service.ts`
- `services/consent.service.ts`
- `repositories/patient.repository.ts`
- `repositories/consent.repository.ts`
- `dtos/patient.dto.ts`

**API Routes:**

```
POST   /patients
GET    /patients/:id
PATCH  /patients/:id
POST   /consents
GET    /consents/:id
GET    /patients/:id/consents
```

**Port:** 8082

---

### 3. Appointment Service (`platform/services/appointment-service`)

**Source Files:**

- `controllers/appointment.controller.ts`
- `services/appointment.service.ts`
- `repositories/appointment.repository.ts`
- `dtos/appointment.dto.ts`

**API Routes:**

```
POST   /appointments
GET    /appointments
GET    /appointments/:id
PATCH  /appointments/:id
DELETE /appointments/:id
```

**Port:** 8084

---

### 4. Encounter Service (`platform/services/encounter-service`)

**Source Files:**

- `controllers/encounter.controller.ts`
- `services/encounter.service.ts`
- `repositories/encounter.repository.ts`
- `dtos/encounter.dto.ts`

**API Routes:**

```
POST   /encounters
GET    /encounters
GET    /encounters/:id
PATCH  /encounters/:id
POST   /encounters/:id/notes
GET    /encounters/:id/notes
POST   /encounters/:id/start
POST   /encounters/:id/end
```

**Port:** 8085

---

### 5. Telehealth Service (`platform/services/telehealth-service`)

**Source Files:**

- `controllers/visit.controller.ts`
- `controllers/realtime.controller.ts`
- `services/visit.service.ts`
- `services/webrtc.service.ts`
- `lib/socket.ts`
- `lib/websocket.ts`
- `lib/websocket-*.ts`

**API Routes:**

```
POST   /visits/:id/start
POST   /visits/:id/end
POST   /visits/:id/chat
WS     /ws (WebSocket connections)
```

**Port:** 8086

---

### 6. Document Service (`platform/services/document-service`)

**Source Files:**

- `controllers/document.controller.ts`
- `services/document.service.ts`
- `repositories/document.repository.ts`
- `lib/storage.ts`
- `dtos/document.dto.ts`

**API Routes:**

```
POST   /documents
GET    /documents
GET    /documents/:id
GET    /documents/:id/download
DELETE /documents/:id
GET    /patients/:patientId/documents
```

**Port:** 8097

---

### 7. Billing Service (`platform/services/billing-service`)

**Source Files:**

- `controllers/payment.controller.ts`
- `controllers/subscription.controller.ts`
- `controllers/plan.controller.ts`
- `services/payment.service.ts`
- `services/subscription.service.ts`
- `services/plan.service.ts`
- `repositories/subscription.repository.ts`
- `lib/stripe.ts`
- `routes/webhooks/stripe.ts`
- `dtos/payment.dto.ts`

**API Routes:**

```
GET    /plans
POST   /subscriptions
DELETE /subscriptions/:id
GET    /payments/config
POST   /payments/setup-intent
POST   /payments/subscription
GET    /payments/subscription
DELETE /payments/subscription
POST   /payments/payment-method
POST   /payments/payment-method/save
GET    /payments/payment-methods
DELETE /payments/payment-method/:id
POST   /payments/charge
GET    /payments/history
GET    /payments/:id
POST   /payments/:id/refund
GET    /payments/invoices
POST   /webhooks/stripe
```

**Port:** 8096

---

### 8. Notification Service (`platform/services/notification-service`)

**Source Files:**

- `controllers/notification.controller.ts`
- `controllers/push.controller.ts`
- `services/notification.service.ts`
- `services/email.service.ts`
- `services/email-templates.service.ts`
- `services/sms-templates.service.ts`
- `lib/email.ts`
- `lib/sms.ts`
- `lib/push.ts`
- `lib/twilio-enhanced.ts`
- `templates/*`
- `dtos/notification.dto.ts`
- `dtos/push.dto.ts`

**API Routes:**

```
POST   /notifications/email
POST   /notifications/sms
POST   /notifications/email/batch
POST   /notifications/sms/batch
GET    /notifications/sms/:id/status
POST   /push/register
DELETE /push/unregister
GET    /push/devices
GET    /push/notifications
PATCH  /push/notifications/:id/read
POST   /push/notifications/mark-all-read
GET    /push/unread-count
GET    /push/preferences
PUT    /push/preferences
POST   /push/send
POST   /push/send-batch
```

**Port:** 8095

---

### 9. Audit Service (`platform/services/audit-service`)

**Source Files:**

- `controllers/audit.controller.ts`
- `services/audit.service.ts`
- `repositories/audit.repository.ts`
- `middleware/audit.middleware.ts`

**API Routes:**

```
GET    /audit/events
POST   /audit/events (internal)
```

**Port:** 8099

---

## Shared Packages

### `packages/shared-lib`

Common utilities shared across services:

```
packages/shared-lib/
├── src/
│   ├── database/
│   │   ├── prisma.ts
│   │   └── base.repository.ts
│   ├── cache/
│   │   ├── cache.ts
│   │   └── redis-cache.ts
│   ├── security/
│   │   ├── encryption.ts
│   │   └── phi-filter.ts
│   ├── observability/
│   │   ├── metrics.ts
│   │   ├── tracing.ts
│   │   └── logging.ts
│   ├── resilience/
│   │   ├── circuit-breaker.ts
│   │   └── retry.ts
│   ├── messaging/
│   │   └── queue.ts
│   ├── secrets/
│   │   └── azure-keyvault.ts
│   ├── health/
│   │   └── health-checks.ts
│   └── lifecycle/
│       └── graceful-shutdown.ts
└── package.json
```

## Migration Phases

### Phase 1: Extract Core Services (Week 1-4)

1. **Auth Service** (Week 1-2)
   - Extract authentication logic
   - Implement JWT/OAuth2 handling
   - Set up user management

2. **Patient Service** (Week 2-3)
   - Extract patient CRUD
   - Implement consent management
   - Set up MPI/EMPI logic

3. **Appointment Service** (Week 3-4)
   - Extract scheduling logic
   - Implement calendar integration

### Phase 2: Extract Domain Services (Week 5-8)

4. **Encounter Service** (Week 5)
   - Extract clinical encounter logic
   - Implement clinical notes

5. **Telehealth Service** (Week 6)
   - Extract video/chat functionality
   - Implement WebRTC handling
   - Migrate WebSocket handlers

6. **Document Service** (Week 7)
   - Extract document management
   - Implement storage abstraction

### Phase 3: Extract Support Services (Week 9-12)

7. **Billing Service** (Week 9-10)
   - Extract Stripe integration
   - Implement subscription management
   - Migrate webhooks

8. **Notification Service** (Week 10-11)
   - Extract email/SMS/push logic
   - Implement template management

9. **Audit Service** (Week 11-12)
   - Extract audit logging
   - Implement compliance reporting

### Phase 4: Integration & Testing (Week 13-16)

- API Gateway configuration
- Service mesh setup
- End-to-end testing
- Performance optimization
- Documentation

## Database Segmentation

Each service gets its own database schema:

```sql
-- Auth Service Schema
CREATE SCHEMA auth_service;

-- Patient Service Schema
CREATE SCHEMA patient_service;

-- Appointment Service Schema
CREATE SCHEMA appointment_service;

-- Encounter Service Schema
CREATE SCHEMA encounter_service;

-- Document Service Schema
CREATE SCHEMA document_service;

-- Billing Service Schema
CREATE SCHEMA billing_service;

-- Notification Service Schema
CREATE SCHEMA notification_service;

-- Audit Service Schema
CREATE SCHEMA audit_service;
```

## Event-Driven Communication

Services communicate via events:

```yaml
events:
  # Auth Service Events
  - auth.user.created
  - auth.user.updated
  - auth.session.started
  - auth.session.ended

  # Patient Service Events
  - patient.created
  - patient.updated
  - patient.consent.granted
  - patient.consent.revoked

  # Appointment Service Events
  - appointment.created
  - appointment.updated
  - appointment.cancelled
  - appointment.reminder.due

  # Encounter Service Events
  - encounter.started
  - encounter.completed
  - encounter.note.added

  # Telehealth Service Events
  - visit.started
  - visit.ended
  - visit.chat.message

  # Document Service Events
  - document.uploaded
  - document.deleted

  # Billing Service Events
  - subscription.created
  - subscription.cancelled
  - payment.completed
  - payment.failed

  # Notification Service Events
  - notification.sent
  - notification.failed

  # Audit Service Events
  - audit.event.logged
```

## Running the Migration

```bash
# Create service from monolith code
pnpm migrate:service --name=auth-service --source=services/api

# Validate service extraction
pnpm validate:service --name=auth-service

# Run integration tests
pnpm test:integration --service=auth-service

# Deploy service
pnpm deploy:service --name=auth-service --env=staging
```
