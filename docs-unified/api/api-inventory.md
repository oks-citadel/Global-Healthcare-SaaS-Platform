# UnifiedHealth Platform - API Inventory

**Source of Truth for All API Endpoints**

> This document defines every API endpoint in the platform.
> OpenAPI specs are generated from this inventory.

---

## API Overview

| Domain | Base Path | MVP Endpoints | Phase 2 Endpoints |
|--------|-----------|---------------|-------------------|
| Platform & System | `/api/v1` | 4 | 0 |
| Identity & Access | `/api/v1/auth` | 5 | 3 |
| User & Profile | `/api/v1/users` | 2 | 1 |
| Patient & EHR | `/api/v1/patients`, `/api/v1/encounters`, `/api/v1/documents` | 8 | 0 |
| Telemedicine | `/api/v1/appointments`, `/api/v1/visits` | 7 | 1 |
| AI & Clinical Intelligence | `/api/v1/ai` | 0 | 4 |
| Billing & Subscriptions | `/api/v1/plans`, `/api/v1/subscriptions`, `/api/v1/billing` | 4 | 0 |
| Notifications | `/api/v1/notifications` | 1 | 2 |
| Marketing Automation | `/api/v1/leads`, `/api/v1/campaigns` | 0 | 3 |
| Audit & Consent | `/api/v1/audit`, `/api/v1/consents` | 3 | 0 |

**Total: 34 MVP endpoints, 14 Phase 2 endpoints**

---

## Platform & System APIs

### Health & Readiness

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `GET` | `/health` | Basic health check | None | MVP |
| `GET` | `/ready` | Kubernetes readiness probe | None | MVP |
| `GET` | `/version` | API version information | None | MVP |
| `GET` | `/config/public` | Public configuration | None | MVP |

#### GET /health
```yaml
summary: Health check endpoint
responses:
  200:
    description: Service is healthy
    content:
      application/json:
        schema:
          type: object
          properties:
            status: { type: string, enum: [healthy, degraded, unhealthy] }
            timestamp: { type: string, format: date-time }
            version: { type: string }
```

#### GET /ready
```yaml
summary: Readiness probe for Kubernetes
responses:
  200:
    description: Service is ready to accept traffic
  503:
    description: Service not ready
```

#### GET /version
```yaml
summary: API version information
responses:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            version: { type: string }
            build: { type: string }
            commit: { type: string }
            environment: { type: string }
```

#### GET /config/public
```yaml
summary: Public configuration for clients
responses:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            features: { type: object }
            supportedRegions: { type: array, items: { type: string } }
            minAppVersion: { type: string }
```

---

## Identity & Access APIs

### Authentication

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/auth/register` | User registration | None | MVP |
| `POST` | `/auth/login` | User login | None | MVP |
| `POST` | `/auth/refresh` | Refresh access token | Refresh Token | MVP |
| `POST` | `/auth/logout` | Logout user | Bearer | MVP |
| `GET` | `/auth/me` | Get current user | Bearer | MVP |
| `POST` | `/auth/mfa/setup` | Setup MFA | Bearer | Phase 2 |
| `POST` | `/auth/mfa/verify` | Verify MFA code | Bearer | Phase 2 |
| `GET` | `/roles` | List available roles | Bearer (Admin) | MVP |
| `GET` | `/permissions` | List permissions | Bearer (Admin) | Phase 2 |

#### POST /auth/register
```yaml
summary: Register a new user
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [email, password, firstName, lastName]
        properties:
          email: { type: string, format: email }
          password: { type: string, minLength: 12 }
          firstName: { type: string }
          lastName: { type: string }
          phone: { type: string }
          dateOfBirth: { type: string, format: date }
          role: { type: string, enum: [patient, provider, admin], default: patient }
responses:
  201:
    description: User created successfully
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResponse'
  400:
    description: Validation error
  409:
    description: Email already exists
```

#### POST /auth/login
```yaml
summary: Authenticate user
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [email, password]
        properties:
          email: { type: string, format: email }
          password: { type: string }
responses:
  200:
    description: Login successful
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResponse'
  401:
    description: Invalid credentials
```

#### POST /auth/refresh
```yaml
summary: Refresh access token
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [refreshToken]
        properties:
          refreshToken: { type: string }
responses:
  200:
    description: Token refreshed
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AuthResponse'
  401:
    description: Invalid refresh token
```

#### POST /auth/logout
```yaml
summary: Logout user and invalidate tokens
security:
  - bearerAuth: []
responses:
  200:
    description: Logged out successfully
  401:
    description: Unauthorized
```

#### GET /auth/me
```yaml
summary: Get current authenticated user
security:
  - bearerAuth: []
responses:
  200:
    description: Current user details
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
  401:
    description: Unauthorized
```

---

## User & Profile APIs

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `GET` | `/users/{id}` | Get user by ID | Bearer | MVP |
| `PATCH` | `/users/{id}` | Update user | Bearer | MVP |
| `PUT` | `/users/{id}/avatar` | Upload avatar | Bearer | Phase 2 |

#### GET /users/{id}
```yaml
summary: Get user details
security:
  - bearerAuth: []
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: string
      format: uuid
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
  403:
    description: Forbidden - can only access own profile unless admin
  404:
    description: User not found
```

#### PATCH /users/{id}
```yaml
summary: Update user profile
security:
  - bearerAuth: []
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: string
      format: uuid
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          firstName: { type: string }
          lastName: { type: string }
          phone: { type: string }
          address: { $ref: '#/components/schemas/Address' }
          preferences: { type: object }
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

---

## Patient & EHR APIs (FHIR-Aligned)

### Patients

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/patients` | Create patient record | Bearer | MVP |
| `GET` | `/patients/{id}` | Get patient by ID | Bearer | MVP |
| `PATCH` | `/patients/{id}` | Update patient | Bearer | MVP |

#### POST /patients
```yaml
summary: Create a new patient record
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/PatientCreate'
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Patient'
```

#### GET /patients/{id}
```yaml
summary: Get patient record
security:
  - bearerAuth: []
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: string
      format: uuid
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Patient'
```

### Encounters

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/encounters` | Create encounter | Bearer (Provider) | MVP |
| `GET` | `/encounters/{id}` | Get encounter | Bearer | MVP |
| `POST` | `/encounters/{id}/notes` | Add clinical notes | Bearer (Provider) | MVP |

#### POST /encounters
```yaml
summary: Create a clinical encounter
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [patientId, providerId, type]
        properties:
          patientId: { type: string, format: uuid }
          providerId: { type: string, format: uuid }
          appointmentId: { type: string, format: uuid }
          type: { type: string, enum: [virtual, in-person, phone] }
          reasonForVisit: { type: string }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Encounter'
```

### Documents

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/documents` | Upload document | Bearer | MVP |
| `GET` | `/documents/{id}` | Get document | Bearer | MVP |

#### POST /documents
```yaml
summary: Upload a health document
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        required: [file, patientId, type]
        properties:
          file: { type: string, format: binary }
          patientId: { type: string, format: uuid }
          type: { type: string, enum: [lab-result, imaging, prescription, other] }
          description: { type: string }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Document'
```

---

## Telemedicine APIs

### Appointments

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/appointments` | Create appointment | Bearer | MVP |
| `GET` | `/appointments` | List appointments | Bearer | MVP |
| `GET` | `/appointments/{id}` | Get appointment | Bearer | MVP |
| `PATCH` | `/appointments/{id}` | Update appointment | Bearer | MVP |
| `DELETE` | `/appointments/{id}` | Cancel appointment | Bearer | MVP |

#### POST /appointments
```yaml
summary: Create a new appointment
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [patientId, providerId, scheduledAt, type, duration]
        properties:
          patientId: { type: string, format: uuid }
          providerId: { type: string, format: uuid }
          scheduledAt: { type: string, format: date-time }
          type: { type: string, enum: [video, audio, chat, in-person] }
          duration: { type: integer, enum: [15, 30, 45, 60] }
          reasonForVisit: { type: string }
          notes: { type: string }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Appointment'
```

#### GET /appointments
```yaml
summary: List appointments with filters
security:
  - bearerAuth: []
parameters:
  - name: patientId
    in: query
    schema: { type: string, format: uuid }
  - name: providerId
    in: query
    schema: { type: string, format: uuid }
  - name: status
    in: query
    schema: { type: string, enum: [scheduled, confirmed, in-progress, completed, cancelled] }
  - name: from
    in: query
    schema: { type: string, format: date-time }
  - name: to
    in: query
    schema: { type: string, format: date-time }
  - name: page
    in: query
    schema: { type: integer, default: 1 }
  - name: limit
    in: query
    schema: { type: integer, default: 20, maximum: 100 }
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/PaginatedAppointments'
```

### Visits (Virtual Care)

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/visits/{id}/start` | Start virtual visit | Bearer | MVP |
| `POST` | `/visits/{id}/end` | End virtual visit | Bearer | MVP |
| `POST` | `/visits/{id}/chat` | Send chat message | Bearer | MVP |
| `POST` | `/visits/{id}/video-token` | Get video token | Bearer | Phase 2 |

#### POST /visits/{id}/start
```yaml
summary: Start a virtual visit session
security:
  - bearerAuth: []
parameters:
  - name: id
    in: path
    required: true
    schema: { type: string, format: uuid }
responses:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            visitId: { type: string, format: uuid }
            sessionToken: { type: string }
            startedAt: { type: string, format: date-time }
```

#### POST /visits/{id}/chat
```yaml
summary: Send a chat message during visit
security:
  - bearerAuth: []
parameters:
  - name: id
    in: path
    required: true
    schema: { type: string, format: uuid }
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [message]
        properties:
          message: { type: string, maxLength: 2000 }
          attachments: { type: array, items: { type: string, format: uuid } }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ChatMessage'
```

---

## AI & Clinical Intelligence APIs (Phase 2)

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/ai/triage` | AI symptom triage | Bearer | Phase 2 |
| `POST` | `/ai/summarize/encounter` | Summarize encounter | Bearer (Provider) | Phase 2 |
| `POST` | `/ai/risk-score` | Calculate risk score | Bearer | Phase 2 |
| `POST` | `/ai/care-plan` | Generate care plan | Bearer (Provider) | Phase 2 |

---

## Billing & Subscriptions APIs

### Plans

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `GET` | `/plans` | List available plans | None | MVP |

#### GET /plans
```yaml
summary: List all subscription plans
parameters:
  - name: region
    in: query
    schema: { type: string }
  - name: currency
    in: query
    schema: { type: string, default: USD }
responses:
  200:
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Plan'
```

### Subscriptions

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/subscriptions` | Create subscription | Bearer | MVP |
| `DELETE` | `/subscriptions/{id}` | Cancel subscription | Bearer | MVP |

#### POST /subscriptions
```yaml
summary: Create a new subscription
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [planId, paymentMethodId]
        properties:
          planId: { type: string }
          paymentMethodId: { type: string }
          couponCode: { type: string }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Subscription'
```

### Billing Webhooks

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/billing/webhook` | Stripe webhook handler | Stripe Signature | MVP |

---

## Notifications APIs

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/notifications/email` | Send email | Bearer (System) | MVP |
| `POST` | `/notifications/sms` | Send SMS | Bearer (System) | Phase 2 |
| `POST` | `/notifications/push` | Send push notification | Bearer (System) | Phase 2 |

---

## Marketing Automation APIs (Phase 2)

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `POST` | `/leads` | Create lead | None | Phase 2 |
| `POST` | `/campaigns` | Create campaign | Bearer (Admin) | Phase 2 |
| `POST` | `/campaigns/{id}/send` | Send campaign | Bearer (Admin) | Phase 2 |

---

## Audit & Consent APIs

| Method | Endpoint | Description | Auth | Phase |
|--------|----------|-------------|------|-------|
| `GET` | `/audit/events` | Get audit events | Bearer (Admin) | MVP |
| `POST` | `/consents` | Record consent | Bearer | MVP |
| `GET` | `/consents/{id}` | Get consent record | Bearer | MVP |

#### GET /audit/events
```yaml
summary: Query audit events
security:
  - bearerAuth: []
parameters:
  - name: userId
    in: query
    schema: { type: string, format: uuid }
  - name: action
    in: query
    schema: { type: string }
  - name: resource
    in: query
    schema: { type: string }
  - name: from
    in: query
    schema: { type: string, format: date-time }
  - name: to
    in: query
    schema: { type: string, format: date-time }
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/PaginatedAuditEvents'
```

#### POST /consents
```yaml
summary: Record patient consent
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [patientId, type, granted]
        properties:
          patientId: { type: string, format: uuid }
          type: { type: string, enum: [data-sharing, treatment, marketing, research] }
          granted: { type: boolean }
          scope: { type: string }
          expiresAt: { type: string, format: date-time }
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Consent'
```

---

## Common Schemas

```yaml
components:
  schemas:
    AuthResponse:
      type: object
      properties:
        accessToken: { type: string }
        refreshToken: { type: string }
        expiresIn: { type: integer }
        tokenType: { type: string, default: Bearer }
        user: { $ref: '#/components/schemas/User' }

    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        email: { type: string, format: email }
        firstName: { type: string }
        lastName: { type: string }
        phone: { type: string }
        role: { type: string, enum: [patient, provider, admin] }
        status: { type: string, enum: [active, inactive, pending] }
        emailVerified: { type: boolean }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    Patient:
      type: object
      properties:
        id: { type: string, format: uuid }
        userId: { type: string, format: uuid }
        medicalRecordNumber: { type: string }
        dateOfBirth: { type: string, format: date }
        gender: { type: string, enum: [male, female, other, prefer-not-to-say] }
        bloodType: { type: string }
        allergies: { type: array, items: { type: string } }
        medications: { type: array, items: { $ref: '#/components/schemas/Medication' } }
        emergencyContact: { $ref: '#/components/schemas/EmergencyContact' }

    Appointment:
      type: object
      properties:
        id: { type: string, format: uuid }
        patientId: { type: string, format: uuid }
        providerId: { type: string, format: uuid }
        scheduledAt: { type: string, format: date-time }
        duration: { type: integer }
        type: { type: string, enum: [video, audio, chat, in-person] }
        status: { type: string, enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show] }
        reasonForVisit: { type: string }
        notes: { type: string }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    Encounter:
      type: object
      properties:
        id: { type: string, format: uuid }
        patientId: { type: string, format: uuid }
        providerId: { type: string, format: uuid }
        appointmentId: { type: string, format: uuid }
        type: { type: string, enum: [virtual, in-person, phone] }
        status: { type: string, enum: [planned, in-progress, finished, cancelled] }
        startedAt: { type: string, format: date-time }
        endedAt: { type: string, format: date-time }
        notes: { type: array, items: { $ref: '#/components/schemas/ClinicalNote' } }
        diagnosis: { type: array, items: { $ref: '#/components/schemas/Diagnosis' } }

    Plan:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        description: { type: string }
        price: { type: number }
        currency: { type: string }
        interval: { type: string, enum: [monthly, annual] }
        features: { type: array, items: { type: string } }

    Address:
      type: object
      properties:
        street: { type: string }
        city: { type: string }
        state: { type: string }
        postalCode: { type: string }
        country: { type: string }

    Error:
      type: object
      properties:
        code: { type: string }
        message: { type: string }
        details: { type: object }
        timestamp: { type: string, format: date-time }
        requestId: { type: string }

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## API Versioning

- Current version: `v1`
- Version prefix: `/api/v1/`
- Breaking changes require new version
- Deprecated endpoints marked with `X-Deprecated: true` header
- Minimum 6-month deprecation notice

---

## Rate Limiting

| Tier | Requests/minute | Burst |
|------|-----------------|-------|
| Anonymous | 60 | 10 |
| Basic | 300 | 50 |
| Professional | 1000 | 100 |
| Enterprise | 5000 | 500 |

Rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

*Last Updated: December 2024*
*Document Version: 1.0*
