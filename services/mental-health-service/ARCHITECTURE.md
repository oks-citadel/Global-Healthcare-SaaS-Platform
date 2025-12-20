# Mental Health Service - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│  (Authentication, Rate Limiting, Load Balancing)                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               Mental Health Service (Port 3002)                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express.js App                         │  │
│  │  - CORS, Helmet (Security)                               │  │
│  │  - JSON Body Parsing                                     │  │
│  │  - User Extraction Middleware                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴──────────────────────────────┐     │
│  │                                                         │     │
│  │              Route Handlers (8 modules)                │     │
│  │                                                         │     │
│  │  ┌──────────────┐  ┌─────────────────┐               │     │
│  │  │  Sessions    │  │ Treatment Plans │               │     │
│  │  │  Routes      │  │     Routes      │               │     │
│  │  └──────────────┘  └─────────────────┘               │     │
│  │                                                         │     │
│  │  ┌──────────────┐  ┌─────────────────┐               │     │
│  │  │ Assessments  │  │  Medications    │               │     │
│  │  │   Routes     │  │     Routes      │               │     │
│  │  └──────────────┘  └─────────────────┘               │     │
│  │                                                         │     │
│  │  ┌──────────────┐  ┌─────────────────┐               │     │
│  │  │    Crisis    │  │  Group Sessions │               │     │
│  │  │   Routes     │  │     Routes      │               │     │
│  │  └──────────────┘  └─────────────────┘               │     │
│  │                                                         │     │
│  │  ┌──────────────┐  ┌─────────────────┐               │     │
│  │  │Progress Notes│  │    Consent      │               │     │
│  │  │   Routes     │  │    Routes       │               │     │
│  │  └──────────────┘  └─────────────────┘               │     │
│  └─────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────┴───────────────────────────────┐  │
│  │                                                           │  │
│  │           Service Layer (Business Logic)                 │  │
│  │                                                           │  │
│  │  ┌──────────────────┐  ┌──────────────────┐            │  │
│  │  │ Assessment       │  │ Treatment Plan   │            │  │
│  │  │   Service        │  │    Service       │            │  │
│  │  │ - PHQ-9 Scoring  │  │ - Goal Tracking  │            │  │
│  │  │ - GAD-7 Scoring  │  │ - Progress Calc  │            │  │
│  │  │ - C-SSRS Risk    │  │                  │            │  │
│  │  └──────────────────┘  └──────────────────┘            │  │
│  │                                                           │  │
│  │  ┌──────────────────┐                                    │  │
│  │  │   Consent        │                                    │  │
│  │  │   Service        │                                    │  │
│  │  │ - Validation     │                                    │  │
│  │  │ - 42 CFR Part 2  │                                    │  │
│  │  │ - Access Control │                                    │  │
│  │  └──────────────────┘                                    │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────┴───────────────────────────────┐  │
│  │                                                           │  │
│  │                  Prisma ORM Layer                        │  │
│  │  - Type-safe database queries                           │  │
│  │  - Connection pooling                                   │  │
│  │  - Migration management                                 │  │
│  │                                                           │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└──────────────────────────┬─┴───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│                                                                   │
│  Tables:                                                         │
│  - TherapySession         - CrisisIntervention                  │
│  - TreatmentPlan          - PsychMedication                     │
│  - TreatmentGoal          - GroupSession                        │
│  - MentalHealthAssessment - GroupSessionAttendee               │
│  - AssessmentResponse     - SupportGroup                        │
│  - ProgressNote           - SupportGroupMember                  │
│  - ConsentRecord          - MoodLog                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Session Creation Flow

```
Patient App
     │
     │ POST /sessions
     ▼
API Gateway
     │
     │ Add auth headers (x-user-id, x-user-role, x-user-email)
     ▼
Mental Health Service
     │
     ├──> Extract User Middleware
     │         │
     │         ▼
     ├──> Sessions Route Handler
     │         │
     │         ├──> Validate user role (patient)
     │         │
     │         ├──> Validate request body (Zod)
     │         │
     │         ▼
     ├──> Prisma Client
     │         │
     │         ▼
     └──> Database (INSERT TherapySession)
              │
              ▼
         Return Session Data
```

### 2. Assessment Scoring Flow

```
Provider App
     │
     │ POST /assessments
     ▼
Mental Health Service
     │
     ├──> Sessions Route Handler
     │         │
     │         ├──> Validate user role (provider)
     │         │
     │         ▼
     ├──> Assessment Service
     │         │
     │         ├──> Extract responses from request
     │         │
     │         ├──> Call scoring algorithm
     │         │      │
     │         │      ├──> scorePHQ9() or
     │         │      ├──> scoreGAD7() or
     │         │      └──> scoreCSSRS()
     │         │
     │         ├──> Calculate severity
     │         │
     │         └──> Generate recommendations
     │
     ├──> Prisma Client
     │         │
     │         ▼
     └──> Database (INSERT MentalHealthAssessment)
              │
              ▼
         Return Assessment + Score + Recommendations
```

### 3. Consent Validation Flow (42 CFR Part 2)

```
Provider requests patient record
     │
     │ GET /progress-notes/patient/:patientId
     ▼
Mental Health Service
     │
     ├──> Progress Notes Route Handler
     │         │
     │         ▼
     ├──> Consent Service
     │         │
     │         ├──> Check if record is confidential
     │         │
     │         ├──> Query ConsentRecord table
     │         │      WHERE patientId = :patientId
     │         │      AND grantedTo contains providerId
     │         │      AND status = 'active'
     │         │      AND (expiresAt IS NULL OR expiresAt > NOW())
     │         │
     │         ├──> Check substanceUseDisclosure flag
     │         │
     │         └──> Return validation result
     │
     ├──> If valid consent:
     │         │
     │         └──> Return patient records
     │
     └──> If no consent:
              │
              └──> Return 403 Forbidden
```

### 4. Crisis Alert Flow

```
Patient/Provider
     │
     │ POST /crisis-alerts
     ▼
Mental Health Service
     │
     ├──> Crisis Route Handler
     │         │
     │         ├──> Validate crisis data
     │         │
     │         ├──> Assess severity
     │         │      │
     │         │      └──> If CRITICAL:
     │         │           - Set status to 'active'
     │         │           - Priority notification
     │         │
     │         ▼
     ├──> Prisma Client
     │         │
     │         ▼
     └──> Database (INSERT CrisisIntervention)
              │
              ├──> Trigger notifications (future)
              │
              └──> Return intervention + emergency contacts
                   (988, Crisis Text Line, etc.)
```

## Security Architecture

### Authentication Flow

```
┌──────────────┐
│  Client App  │
└──────┬───────┘
       │ JWT Token in Authorization header
       ▼
┌──────────────────────────────┐
│       API Gateway            │
│  - Verify JWT                │
│  - Extract user info         │
│  - Set headers:              │
│    x-user-id                 │
│    x-user-email              │
│    x-user-role               │
└──────┬───────────────────────┘
       │ Request + User Headers
       ▼
┌──────────────────────────────┐
│  Mental Health Service       │
│  - Extract User Middleware   │
│  - Attach to req.user        │
│  - Role-based access control │
└──────────────────────────────┘
```

### Authorization Layers

```
┌─────────────────────────────────────────────────┐
│         Layer 1: User Authentication            │
│  - Valid user headers required                  │
│  - User role verified                           │
└─────────────────┬───────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────┐
│         Layer 2: Resource Ownership             │
│  - Patient can only access own records          │
│  - Provider can access assigned patients        │
│  - Admin has full access                        │
└─────────────────┬───────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────┐
│         Layer 3: Consent Validation             │
│  - Check ConsentRecord for sensitive data       │
│  - Validate 42 CFR Part 2 requirements         │
│  - Verify consent not expired or revoked        │
└─────────────────┬───────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────┐
│         Layer 4: Action Authorization           │
│  - Only providers can create assessments        │
│  - Only providers can prescribe medications     │
│  - Only patients can grant/revoke consent       │
└─────────────────────────────────────────────────┘
```

## Database Schema Architecture

### Core Entities

```
┌─────────────────┐
│  TherapySession │
├─────────────────┤
│ id (PK)         │
│ patientId (FK)  │──────┐
│ therapistId(FK) │      │
│ sessionType     │      │
│ status          │      │
│ scheduledAt     │      │
│ duration        │      │
└─────────────────┘      │
                         │
┌─────────────────┐      │
│ TreatmentPlan   │      │
├─────────────────┤      │
│ id (PK)         │      │
│ patientId (FK)  │──────┤
│ providerId (FK) │      │
│ diagnosis[]     │      │
│ status          │      │
└─────┬───────────┘      │
      │                  │
      │ 1:N              │
      ▼                  │
┌─────────────────┐      │
│ TreatmentGoal   │      │
├─────────────────┤      │
│ id (PK)         │      │      ┌──────────────────┐
│ treatmentPlanId │      │      │ ProgressNote     │
│ description     │      │      ├──────────────────┤
│ status          │      │      │ id (PK)          │
│ progress        │      └──────│ patientId (FK)   │
└─────────────────┘             │ providerId (FK)  │
                                │ sessionId (FK)   │
┌─────────────────────────┐     │ noteType         │
│ MentalHealthAssessment  │     │ subjective       │
├─────────────────────────┤     │ objective        │
│ id (PK)                 │     │ assessment       │
│ patientId (FK)          │─────│ plan             │
│ assessedBy (FK)         │     │ isConfidential   │
│ assessmentType          │     └──────────────────┘
│ score                   │
│ severity                │     ┌──────────────────┐
└─────────────────────────┘     │ ConsentRecord    │
                                ├──────────────────┤
┌─────────────────────────┐     │ id (PK)          │
│ CrisisIntervention      │     │ patientId (FK)   │
├─────────────────────────┤     │ consentType      │
│ id (PK)                 │     │ grantedTo[]      │
│ patientId (FK)          │─────│ purpose          │
│ responderId (FK)        │     │ expiresAt        │
│ crisisType              │     │ status           │
│ severity                │     │ substanceUse...  │
│ status                  │     └──────────────────┘
└─────────────────────────┘
```

### Relationships

- **TherapySession** → Patient (N:1)
- **TherapySession** → Provider/Therapist (N:1)
- **TreatmentPlan** → Patient (N:1)
- **TreatmentPlan** → TreatmentGoal (1:N)
- **ProgressNote** → TherapySession (N:1, optional)
- **ProgressNote** → Patient (N:1)
- **ConsentRecord** → Patient (N:1)
- **GroupSession** → GroupSessionAttendee (1:N)

## Technology Stack

```
┌────────────────────────────────────────┐
│          Application Layer             │
│  - TypeScript 5.3+                     │
│  - Node.js 18+                         │
│  - Express.js 4.18                     │
└────────────────┬───────────────────────┘
                 │
┌────────────────┴───────────────────────┐
│         Middleware Layer               │
│  - Helmet (Security headers)           │
│  - CORS (Cross-origin)                 │
│  - Zod (Validation)                    │
└────────────────┬───────────────────────┘
                 │
┌────────────────┴───────────────────────┐
│         Database Layer                 │
│  - Prisma ORM 5.7+                     │
│  - PostgreSQL 14+                      │
└────────────────────────────────────────┘
```

## Deployment Architecture

### Development

```
┌──────────────┐
│  Developer   │
│   Machine    │
│              │
│  - npm run   │
│    dev       │
│  - Port 3002 │
│  - Local DB  │
└──────────────┘
```

### Production (Recommended)

```
┌─────────────────────────────────────────────────┐
│              Load Balancer                      │
└────┬────────────────────────────────────┬───────┘
     │                                    │
     ▼                                    ▼
┌────────────────┐              ┌────────────────┐
│   Instance 1   │              │   Instance 2   │
│   Docker       │              │   Docker       │
│   Container    │              │   Container    │
└────┬───────────┘              └────┬───────────┘
     │                              │
     └──────────┬───────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│         PostgreSQL Database                     │
│  - Primary (Read/Write)                         │
│  - Replica (Read-only) [Optional]              │
└─────────────────────────────────────────────────┘
```

## API Design Patterns

### RESTful Resource Structure

```
/sessions
  GET    /              - List sessions
  POST   /              - Create session
  GET    /:id           - Get session
  PATCH  /:id           - Update session
  DELETE /:id           - Cancel session

/treatment-plans
  POST   /              - Create plan
  GET    /patient/:id   - Get patient plan
  GET    /:id           - Get plan details
  PATCH  /:id           - Update plan
  POST   /:id/goals     - Add goal
  GET    /:id/progress  - Get progress

/assessments
  GET    /instruments/:type/questions  - Get questions
  POST   /              - Submit assessment
  POST   /score         - Preview score
  GET    /              - List assessments
  GET    /stats/:id     - Get statistics
```

### Request/Response Pattern

```javascript
// Request
{
  "data": { /* request payload */ }
}

// Success Response
{
  "data": { /* result object */ },
  "message": "Success message"
}

// Error Response
{
  "error": "Error Type",
  "message": "Error description",
  "details": { /* optional */ }
}
```

## Monitoring Points

```
Application Metrics:
  - Request rate by endpoint
  - Response times (p50, p95, p99)
  - Error rates by type
  - Active sessions count

Business Metrics:
  - Assessments completed per day
  - Crisis interventions (by severity)
  - Active treatment plans
  - Consent grants/revocations

Database Metrics:
  - Connection pool usage
  - Query performance
  - Slow query log
  - Database size growth

Health Checks:
  - Service uptime
  - Database connectivity
  - Memory usage
  - CPU utilization
```

## Future Architecture Considerations

### Microservices Evolution

```
Current (Monolith):
  Mental Health Service
    - All features in one service

Future (Microservices):
  ├── Session Service
  ├── Assessment Service
  ├── Treatment Planning Service
  ├── Crisis Service
  ├── Medication Service
  └── Consent Service

Benefits:
  - Independent scaling
  - Technology flexibility
  - Fault isolation
  - Team autonomy
```

### Event-Driven Architecture

```
Service Events:
  - SessionCreated
  - AssessmentCompleted
  - CrisisAlertTriggered
  - MedicationPrescribed
  - ConsentGranted
  - ConsentRevoked

Subscribers:
  - Notification Service
  - Analytics Service
  - Audit Service
  - Billing Service
```

## Summary

The Mental Health Service follows a **layered architecture** with:
- **Route handlers** for HTTP/REST interface
- **Service layer** for business logic
- **Prisma ORM** for type-safe database access
- **PostgreSQL** for reliable data storage

Security is enforced through:
- **Multi-layer authentication and authorization**
- **Consent-based access control (42 CFR Part 2)**
- **Role-based permissions**
- **Request validation at every layer**

The architecture is designed for:
- **Scalability** - Stateless design, horizontal scaling
- **Maintainability** - Clear separation of concerns
- **Security** - Defense in depth
- **Compliance** - HIPAA and 42 CFR Part 2 ready
