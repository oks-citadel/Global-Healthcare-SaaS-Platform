# UnifiedHealth Platform - Microservices Architecture

## Overview

The UnifiedHealth Platform has been restructured from a monolithic architecture to a microservices-based architecture for better scalability, maintainability, and deployment flexibility.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Apps                           │
│          (Web, Mobile, Desktop Applications)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 3000)                   │
│  - Central routing & load balancing                         │
│  - JWT authentication & authorization                        │
│  - Rate limiting & throttling                               │
│  - Request/response logging                                 │
└─────────┬───────────┬───────────┬───────────┬──────────┬────┘
          │           │           │           │          │
          ▼           ▼           ▼           ▼          ▼
    ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │Telehealth│ │Mental    │ │Chronic   │ │Pharmacy  │ │Laboratory│
    │Service  │ │Health    │ │Care      │ │Service   │ │Service   │
    │:3001    │ │Service   │ │Service   │ │:3004     │ │:3005     │
    │         │ │:3002     │ │:3003     │ │          │ │          │
    └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
         │           │            │            │            │
         ▼           ▼            ▼            ▼            ▼
    ┌────────────────────────────────────────────────────────┐
    │              PostgreSQL Databases                      │
    │  - telehealth_db    - mental_health_db                │
    │  - chronic_care_db  - pharmacy_db                     │
    │  - laboratory_db                                       │
    └────────────────────────────────────────────────────────┘
```

## Services

### 1. API Gateway (Port 3000)
**Purpose**: Central entry point for all client requests

**Responsibilities**:
- Route requests to appropriate microservices
- JWT token validation
- Rate limiting and throttling
- CORS handling
- Service health monitoring
- Request/response logging

**Key Files**:
- `src/index.ts` - Main gateway server
- `src/routes/index.ts` - Service routing configuration
- `src/middleware/auth.ts` - Authentication middleware
- `src/middleware/rateLimit.ts` - Rate limiting middleware
- `src/config/services.ts` - Service registry

**Technologies**:
- Express.js
- http-proxy-middleware
- jsonwebtoken
- express-rate-limit
- ioredis

---

### 2. Telehealth Service (Port 3001)
**Purpose**: Video consultations, appointments, and virtual visits

**Responsibilities**:
- Appointment scheduling and management
- Virtual visit sessions
- WebRTC signaling for video calls
- Chat messaging during visits
- Provider availability management

**Key Routes**:
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `GET /visits/:visitId` - Get visit details
- `POST /visits/:visitId/start` - Start virtual visit
- `POST /visits/:visitId/messages` - Send chat message

**Database Tables**:
- Appointment
- Visit
- ChatMessage
- ProviderAvailability
- ProviderBreak

**Technologies**:
- Express.js
- Socket.io (WebRTC signaling)
- Prisma ORM
- PostgreSQL

---

### 3. Mental Health Service (Port 3002)
**Purpose**: Therapy sessions, mental health assessments, and crisis support

**Responsibilities**:
- Therapy session management
- Mental health assessments (PHQ9, GAD7, PCL5, etc.)
- Crisis intervention and hotline support
- Treatment plan management
- Mood logging and tracking
- Support group coordination

**Key Routes**:
- `GET /sessions` - List therapy sessions
- `POST /sessions` - Create therapy session
- `GET /assessments` - List mental health assessments
- `POST /assessments` - Create assessment
- `POST /crisis` - Report crisis intervention
- `GET /crisis/hotlines/info` - Emergency hotline information

**Database Tables**:
- TherapySession
- MentalHealthAssessment
- CrisisIntervention
- TreatmentPlan
- MoodLog
- SupportGroup
- SupportGroupMember

**Special Features**:
- 24/7 crisis hotline integration
- Real-time crisis dashboard for responders
- Assessment trend analysis
- Emergency contact information

---

### 4. Chronic Care Service (Port 3003)
**Purpose**: Remote patient monitoring, care plans, and chronic disease management

**Responsibilities**:
- Care plan creation and management
- Remote monitoring device registration
- Vital sign readings collection
- Alert generation for abnormal readings
- Care task tracking
- Patient compliance monitoring

**Key Routes**:
- `GET /care-plans` - List care plans
- `POST /care-plans` - Create care plan
- `GET /devices` - List monitoring devices
- `POST /devices` - Register device
- `GET /alerts` - List alerts
- `PATCH /alerts/:id/acknowledge` - Acknowledge alert

**Database Tables**:
- CarePlan
- CareTask
- MonitoringDevice
- VitalReading
- Alert

**Device Types Supported**:
- Blood pressure monitors
- Glucose meters
- Pulse oximeters
- Weight scales
- Thermometers
- Heart rate monitors
- Peak flow meters
- ECG monitors

---

### 5. Pharmacy Service (Port 3004)
**Purpose**: Prescription management and pharmacy operations

**Responsibilities**:
- Prescription creation and management
- Medication dispensing tracking
- Pharmacy directory
- Refill management
- Medication information database

**Key Routes**:
- `GET /prescriptions` - List prescriptions
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:id` - Get prescription details
- `GET /pharmacies` - List pharmacies
- `POST /pharmacies` - Register pharmacy

**Database Tables**:
- Prescription
- PrescriptionItem
- Pharmacy
- Medication

**Features**:
- Refill tracking
- Generic medication substitution
- Controlled substance handling
- Drug interaction warnings (future)
- Prescription validity management

---

### 6. Laboratory Service (Port 3005)
**Purpose**: Laboratory orders and test results management

**Responsibilities**:
- Lab test ordering
- Sample collection tracking
- Result entry and verification
- Abnormal result flagging
- Diagnostic test catalog management

**Key Routes**:
- `GET /orders` - List lab orders
- `POST /orders` - Create lab order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status
- `GET /results/patient/:patientId` - Get patient results
- `POST /results` - Add lab result

**Database Tables**:
- LabOrder
- LabTest
- LabResult
- DiagnosticTest

**Test Categories**:
- Hematology
- Biochemistry
- Immunology
- Microbiology
- Pathology
- Radiology
- Cardiology
- Endocrinology

---

## Running the Microservices

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Install dependencies for each service**:
```bash
# API Gateway
cd services/api-gateway
npm install

# Telehealth Service
cd ../telehealth-service
npm install

# Mental Health Service
cd ../mental-health-service
npm install

# Chronic Care Service
cd ../chronic-care-service
npm install

# Pharmacy Service
cd ../pharmacy-service
npm install

# Laboratory Service
cd ../laboratory-service
npm install
```

2. **Set up environment variables**:
Create `.env` files in each service directory:

```env
# API Gateway
PORT=3000
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
TELEHEALTH_SERVICE_URL=http://localhost:3001
MENTAL_HEALTH_SERVICE_URL=http://localhost:3002
CHRONIC_CARE_SERVICE_URL=http://localhost:3003
PHARMACY_SERVICE_URL=http://localhost:3004
LABORATORY_SERVICE_URL=http://localhost:3005

# Each service
PORT=300X
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/service_db?schema=public
CORS_ORIGIN=*
```

3. **Generate Prisma clients**:
```bash
cd services/telehealth-service && npx prisma generate
cd services/mental-health-service && npx prisma generate
cd services/chronic-care-service && npx prisma generate
cd services/pharmacy-service && npx prisma generate
cd services/laboratory-service && npx prisma generate
```

4. **Run migrations**:
```bash
cd services/telehealth-service && npx prisma migrate dev
cd services/mental-health-service && npx prisma migrate dev
cd services/chronic-care-service && npx prisma migrate dev
cd services/pharmacy-service && npx prisma migrate dev
cd services/laboratory-service && npx prisma migrate dev
```

5. **Start services in development mode**:
```bash
# Terminal 1 - API Gateway
cd services/api-gateway && npm run dev

# Terminal 2 - Telehealth
cd services/telehealth-service && npm run dev

# Terminal 3 - Mental Health
cd services/mental-health-service && npm run dev

# Terminal 4 - Chronic Care
cd services/chronic-care-service && npm run dev

# Terminal 5 - Pharmacy
cd services/pharmacy-service && npm run dev

# Terminal 6 - Laboratory
cd services/laboratory-service && npm run dev
```

### Docker Deployment

1. **Build and run all services with Docker Compose**:
```bash
cd services
docker-compose -f docker-compose.microservices.yml up --build
```

2. **Run in detached mode**:
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

3. **View logs**:
```bash
docker-compose -f docker-compose.microservices.yml logs -f
```

4. **Stop all services**:
```bash
docker-compose -f docker-compose.microservices.yml down
```

---

## API Gateway Routes

All client requests go through the API Gateway at `http://localhost:3000/api`

### Telehealth Routes
- `GET /api/telehealth/appointments` - List appointments
- `POST /api/telehealth/appointments` - Create appointment
- `GET /api/telehealth/visits/:id` - Get visit details

### Mental Health Routes
- `GET /api/mental-health/sessions` - List therapy sessions
- `POST /api/mental-health/sessions` - Create session
- `GET /api/mental-health/assessments` - List assessments
- `POST /api/mental-health/crisis` - Report crisis

### Chronic Care Routes
- `GET /api/chronic-care/care-plans` - List care plans
- `POST /api/chronic-care/care-plans` - Create care plan
- `GET /api/chronic-care/devices` - List devices
- `GET /api/chronic-care/alerts` - List alerts

### Pharmacy Routes
- `GET /api/pharmacy/prescriptions` - List prescriptions
- `POST /api/pharmacy/prescriptions` - Create prescription
- `GET /api/pharmacy/pharmacies` - List pharmacies

### Laboratory Routes
- `GET /api/laboratory/orders` - List lab orders
- `POST /api/laboratory/orders` - Create lab order
- `GET /api/laboratory/results/patient/:id` - Get patient results

---

## Authentication

All requests (except public endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The API Gateway validates tokens and forwards user information to services via headers:
- `X-User-Id`: User's unique identifier
- `X-User-Role`: User's role (patient, provider, admin)
- `X-User-Email`: User's email address

---

## Service Communication

Services are isolated and communicate through:
1. **HTTP REST APIs** - For synchronous operations
2. **Message Queue** (future) - For asynchronous events
3. **Shared Database per Service** - Each service has its own database

---

## Monitoring & Health Checks

Each service exposes a health check endpoint:
- Gateway: `GET http://localhost:3000/health`
- Telehealth: `GET http://localhost:3001/health`
- Mental Health: `GET http://localhost:3002/health`
- Chronic Care: `GET http://localhost:3003/health`
- Pharmacy: `GET http://localhost:3004/health`
- Laboratory: `GET http://localhost:3005/health`

---

## Database Schema

Each service has its own isolated database with domain-specific tables. See individual service's `prisma/schema.prisma` for detailed schema definitions.

---

## Security Features

1. **JWT Authentication** - Token-based authentication at gateway
2. **Rate Limiting** - Prevent abuse with configurable rate limits
3. **CORS Protection** - Controlled cross-origin access
4. **Helmet.js** - HTTP security headers
5. **Input Validation** - Zod schema validation
6. **Role-Based Access Control** - Provider, patient, admin roles

---

## Scaling Strategy

Each service can be scaled independently based on demand:

```bash
# Scale telehealth service to 3 instances
docker-compose -f docker-compose.microservices.yml up --scale telehealth-service=3
```

---

## Future Enhancements

1. **Service Mesh** - Implement Istio or Linkerd for advanced traffic management
2. **Event Bus** - Add RabbitMQ or Kafka for event-driven architecture
3. **API Documentation** - Swagger/OpenAPI for each service
4. **Circuit Breakers** - Implement resilience patterns
5. **Distributed Tracing** - Add Jaeger or Zipkin
6. **Centralized Logging** - ELK Stack or Loki
7. **Service Discovery** - Consul or Eureka
8. **API Versioning** - Support multiple API versions

---

## Troubleshooting

### Service won't start
1. Check if port is already in use
2. Verify environment variables are set
3. Ensure database is running and accessible
4. Check logs: `docker-compose logs <service-name>`

### Database connection issues
1. Verify DATABASE_URL format
2. Check PostgreSQL is running
3. Run migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`

### Authentication errors
1. Verify JWT_SECRET is set consistently
2. Check token expiration
3. Ensure Authorization header format is correct

---

## Contributing

When adding new features:
1. Follow service boundaries - don't mix domains
2. Add proper input validation with Zod
3. Implement health checks
4. Add proper error handling
5. Update Prisma schema and run migrations
6. Document new endpoints in this README

---

## License

Copyright 2024 UnifiedHealth Platform. All rights reserved.
