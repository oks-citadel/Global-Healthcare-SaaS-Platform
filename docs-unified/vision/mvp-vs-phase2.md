# MVP vs Phase 2 Feature Breakdown

## Overview

This document defines the clear boundary between MVP (Minimum Viable Product) and Phase 2 features. **Phase 2 features are blocked until MVP is stable, observable, and secure.**

---

## MVP Features (Phase 1)

### MVP Completion Criteria

All MVP features must meet these criteria before Phase 2 work begins:

- [ ] API endpoint implemented and documented
- [ ] Unit tests with >80% coverage
- [ ] Integration tests passing
- [ ] Auth and RBAC tests passing
- [ ] OpenAPI contract tests passing
- [ ] Frontend client integrated
- [ ] Mobile client integrated
- [ ] CI pipeline passing
- [ ] CD deployment successful
- [ ] Monitoring and alerts configured
- [ ] Documentation updated

---

## Feature Matrix

### Platform & System

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Health endpoint | Yes | - | Required for K8s probes |
| Readiness endpoint | Yes | - | Required for K8s probes |
| Version endpoint | Yes | - | For deployment tracking |
| Public config | Yes | - | Feature flags, min versions |
| Metrics endpoint | Yes | - | Prometheus scraping |

### Identity & Access

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| User registration | Yes | - | Email + password |
| User login | Yes | - | JWT-based |
| Token refresh | Yes | - | Refresh token flow |
| Logout | Yes | - | Token invalidation |
| Get current user | Yes | - | /auth/me |
| Password reset | Yes | - | Email-based flow |
| MFA setup | - | Yes | TOTP/SMS |
| MFA verification | - | Yes | Second factor |
| SSO integration | - | Yes | SAML/OIDC |
| Biometric auth | - | Yes | Mobile only |
| Permission management | - | Yes | Fine-grained permissions |

### User & Profile

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Get user profile | Yes | - | By ID |
| Update user profile | Yes | - | Partial updates |
| Avatar upload | - | Yes | Image storage |
| Profile preferences | Yes | - | Settings |
| Data export (GDPR) | - | Yes | Compliance |

### Patient & EHR

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Create patient record | Yes | - | FHIR-aligned |
| Get patient | Yes | - | By ID |
| Update patient | Yes | - | Partial updates |
| Create encounter | Yes | - | Visit records |
| Get encounter | Yes | - | By ID |
| Add clinical notes | Yes | - | Provider only |
| Upload document | Yes | - | Lab results, etc. |
| Get document | Yes | - | By ID |
| External EHR import | - | Yes | FHIR integration |
| Document OCR | - | Yes | AI extraction |
| Health timeline | - | Yes | Aggregated view |

### Telemedicine

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Create appointment | Yes | - | Scheduling |
| List appointments | Yes | - | With filters |
| Get appointment | Yes | - | By ID |
| Update appointment | Yes | - | Reschedule |
| Cancel appointment | Yes | - | Soft delete |
| Start visit | Yes | - | Session init |
| End visit | Yes | - | Session close |
| Chat during visit | Yes | - | Text messaging |
| Video token | - | Yes | Twilio integration |
| Screen sharing | - | Yes | WebRTC |
| Recording | - | Yes | Consent-based |
| Waiting room | - | Yes | Queue management |

### AI & Clinical Intelligence

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Symptom triage | - | Yes | AI-powered |
| Encounter summary | - | Yes | Claude AI |
| Risk scoring | - | Yes | CVD, diabetes |
| Care plan generation | - | Yes | AI-assisted |
| Lab anomaly detection | - | Yes | ML model |
| Clinical NLP | - | Yes | ICD coding |

### Billing & Subscriptions

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| List plans | Yes | - | Public endpoint |
| Create subscription | Yes | - | Stripe integration |
| Cancel subscription | Yes | - | User-initiated |
| Webhook handling | Yes | - | Stripe events |
| Multi-currency | - | Yes | 50+ currencies |
| Insurance billing | - | Yes | Claims integration |
| Split billing | - | Yes | Patient + sponsor |

### Notifications

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Email notifications | Yes | - | SendGrid |
| SMS notifications | - | Yes | Twilio |
| Push notifications | - | Yes | Firebase/APNs |
| Notification preferences | - | Yes | User settings |
| Scheduled notifications | - | Yes | Reminders |

### Marketing Automation

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Lead capture | - | Yes | Landing pages |
| Campaign creation | - | Yes | Admin only |
| Campaign sending | - | Yes | Batch emails |
| Analytics | - | Yes | Open/click rates |

### Audit & Consent

| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Audit event logging | Yes | - | All PHI access |
| Audit event query | Yes | - | Admin only |
| Record consent | Yes | - | Patient consent |
| Get consent | Yes | - | By ID |
| Consent history | - | Yes | Timeline |
| Consent revocation | - | Yes | Patient-initiated |

---

## MVP API Endpoints Summary

### Must Have (34 endpoints)

```
# Platform
GET  /health
GET  /ready
GET  /version
GET  /config/public

# Auth
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me

# Users
GET  /users/{id}
PATCH /users/{id}

# Roles
GET  /roles

# Patients
POST /patients
GET  /patients/{id}
PATCH /patients/{id}

# Encounters
POST /encounters
GET  /encounters/{id}
POST /encounters/{id}/notes

# Documents
POST /documents
GET  /documents/{id}

# Appointments
POST /appointments
GET  /appointments
GET  /appointments/{id}
PATCH /appointments/{id}
DELETE /appointments/{id}

# Visits
POST /visits/{id}/start
POST /visits/{id}/end
POST /visits/{id}/chat

# Billing
GET  /plans
POST /subscriptions
DELETE /subscriptions/{id}
POST /billing/webhook

# Notifications
POST /notifications/email

# Audit
GET  /audit/events
POST /consents
GET  /consents/{id}
```

### Phase 2 (14 endpoints)

```
# Auth
POST /auth/mfa/setup
POST /auth/mfa/verify
GET  /permissions

# Users
PUT  /users/{id}/avatar

# Visits
POST /visits/{id}/video-token

# AI
POST /ai/triage
POST /ai/summarize/encounter
POST /ai/risk-score
POST /ai/care-plan

# Notifications
POST /notifications/sms
POST /notifications/push

# Marketing
POST /leads
POST /campaigns
POST /campaigns/{id}/send
```

---

## MVP Gate Checklist

Before any Phase 2 work begins:

### Backend
- [ ] All 34 MVP endpoints implemented
- [ ] All endpoints have OpenAPI specs
- [ ] Unit test coverage >80%
- [ ] Integration tests for all endpoints
- [ ] Auth tests for protected endpoints
- [ ] RBAC tests for role-based endpoints
- [ ] Backend builds without errors
- [ ] Docker image builds successfully
- [ ] Database migrations run cleanly

### Frontend (Web)
- [ ] Patient portal with core flows
- [ ] Provider portal with core flows
- [ ] Admin dashboard with core views
- [ ] All API clients generated from OpenAPI
- [ ] Frontend builds without errors
- [ ] Responsive design tested

### Mobile (Expo/EAS)
- [ ] iOS app builds via EAS
- [ ] Android app builds via EAS
- [ ] Core patient flows working
- [ ] Push notification setup (placeholder)
- [ ] Offline-first architecture foundation

### Infrastructure
- [ ] Terraform configuration complete
- [ ] AKS cluster deployed
- [ ] PostgreSQL provisioned
- [ ] Redis provisioned
- [ ] Azure Key Vault configured
- [ ] ACR (Container Registry) configured
- [ ] Networking/ingress configured

### CI/CD
- [ ] GitHub Actions CI pipeline
  - [ ] Lint
  - [ ] Type check
  - [ ] Unit tests
  - [ ] Build
  - [ ] Docker build
  - [ ] SAST scan
  - [ ] OpenAPI validation
- [ ] Jenkins CD pipeline
  - [ ] Deploy to staging
  - [ ] Run integration tests
  - [ ] Deploy to production (with approval)
  - [ ] Post-deploy verification
  - [ ] Rollback capability

### Observability
- [ ] Health endpoints monitored
- [ ] Metrics exported to Prometheus
- [ ] Logs aggregated
- [ ] Alerts configured for critical paths
- [ ] Dashboards created

### Security
- [ ] No plaintext secrets
- [ ] All secrets in Azure Key Vault
- [ ] TLS configured
- [ ] RBAC enforced
- [ ] Audit logging active
- [ ] Dependency scan clean

### Documentation
- [ ] API inventory current
- [ ] Development inventory current
- [ ] Test inventory current
- [ ] Architecture diagrams current
- [ ] Runbooks documented

---

*Last Updated: December 2024*
