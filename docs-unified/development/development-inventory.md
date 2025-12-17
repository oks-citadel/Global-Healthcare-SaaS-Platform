# Development Inventory

**Track development status for every API endpoint**

---

## Legend

| Status | Symbol | Description |
|--------|--------|-------------|
| Not Started | - | Work has not begun |
| In Progress | WIP | Currently being developed |
| Complete | Done | Implemented and tested |
| Blocked | BLOCKED | Waiting on dependency |

---

## MVP Endpoints Development Status

### Platform & System

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| GET /health | Done | - | - | - | - | - | - | - | Done |
| GET /ready | Done | - | - | - | - | - | - | - | Done |
| GET /version | Done | - | Done | - | - | - | - | - | Done |
| GET /config/public | Done | - | Done | - | - | - | - | - | Done |

### Identity & Access

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| POST /auth/register | Done | Done | Done | WIP | - | - | - | - | Done |
| POST /auth/login | Done | Done | Done | WIP | - | - | - | - | Done |
| POST /auth/refresh | Done | Done | Done | WIP | - | - | - | - | Done |
| POST /auth/logout | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /auth/me | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /roles | Done | - | Done | - | Done | - | - | - | Done |

### User & Profile

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| GET /users/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| PATCH /users/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |

### Patient & EHR

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| POST /patients | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /patients/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| PATCH /patients/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| POST /encounters | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /encounters/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| POST /encounters/{id}/notes | Done | Done | Done | WIP | Done | - | - | - | Done |
| POST /documents | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /documents/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |

### Telemedicine

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| POST /appointments | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /appointments | Done | Done | Done | WIP | Done | - | - | - | Done |
| GET /appointments/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| PATCH /appointments/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| DELETE /appointments/{id} | Done | Done | Done | WIP | Done | - | - | - | Done |
| POST /visits/{id}/start | Done | - | Done | WIP | Done | - | - | - | Done |
| POST /visits/{id}/end | Done | - | Done | WIP | Done | - | - | - | Done |
| POST /visits/{id}/chat | Done | - | Done | WIP | Done | - | - | - | Done |

### Billing & Subscriptions

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| GET /plans | Done | - | Done | WIP | - | - | - | - | Done |
| POST /subscriptions | Done | - | Done | WIP | Done | - | - | - | Done |
| DELETE /subscriptions/{id} | Done | - | Done | WIP | Done | - | - | - | Done |
| POST /billing/webhook | Done | - | Done | - | - | - | - | - | Done |

### Notifications

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| POST /notifications/email | - | - | - | - | - | - | - | - | - |

### Audit & Consent

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Web Client | Mobile Client | Status |
|----------|------------|------|---------|------------|------|---------|------------|---------------|--------|
| GET /audit/events | Done | - | Done | WIP | Done | - | - | - | Done |
| POST /consents | Done | - | Done | WIP | Done | - | - | - | Done |
| GET /consents/{id} | Done | - | Done | WIP | Done | - | - | - | Done |

---

## Additional Endpoints Implemented

### Encounters (Extended)

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Status |
|----------|------------|------|---------|------------|------|---------|--------|
| GET /encounters | Done | Done | Done | WIP | Done | - | Done |
| PATCH /encounters/{id} | Done | Done | Done | WIP | Done | - | Done |
| GET /encounters/{id}/notes | Done | Done | Done | WIP | Done | - | Done |
| POST /encounters/{id}/start | Done | Done | Done | WIP | Done | - | Done |
| POST /encounters/{id}/end | Done | Done | Done | WIP | Done | - | Done |

### Documents (Extended)

| Endpoint | Controller | DTOs | Service | Repository | Auth | OpenAPI | Status |
|----------|------------|------|---------|------------|------|---------|--------|
| GET /documents | Done | Done | Done | WIP | Done | - | Done |
| GET /documents/{id}/download | Done | Done | Done | WIP | Done | - | Done |
| DELETE /documents/{id} | Done | Done | Done | WIP | Done | - | Done |
| GET /patients/{id}/documents | Done | Done | Done | WIP | Done | - | Done |

---

## Test Coverage

### Unit Tests

| Service | Tests | Coverage | Status |
|---------|-------|----------|--------|
| auth.service | 12 tests | High | Done |
| patient.service | 10 tests | High | Done |
| encounter.service | 15 tests | High | Done |
| document.service | 14 tests | High | Done |

### Integration Tests

| API Domain | Tests | Coverage | Status |
|------------|-------|----------|--------|
| Auth API | 12 tests | High | Done |
| Patient API | 8 tests | High | Done |
| Encounter API | 14 tests | High | Done |

---

## Development Checklist Per Endpoint

For each endpoint, complete these items:

### Backend

- [x] **Controller/Handler**: Route handler with request/response
- [x] **DTOs**: Request and response data transfer objects
- [x] **Validation**: Input validation with Zod
- [x] **Service Logic**: Business logic implementation
- [ ] **Repository**: Prisma database operations (in-memory store currently)
- [x] **Auth Middleware**: JWT authentication
- [x] **RBAC**: Role-based access control
- [ ] **OpenAPI Spec**: Document in openapi.yaml

### Frontend (Web)

- [ ] **API Client**: Generated from OpenAPI
- [ ] **Hook/Query**: React Query hook for data fetching
- [ ] **UI Component**: User interface implementation
- [ ] **Form Handling**: Form state and validation
- [ ] **Error Handling**: User-friendly error messages

### Mobile (Expo)

- [ ] **API Client**: Shared or mobile-specific client
- [ ] **Screen/Component**: Mobile UI implementation
- [ ] **Offline Support**: Offline-first data handling
- [ ] **Error Handling**: Mobile error states

---

## Service File Locations

### Backend (services/api/)

```
services/api/
├── src/
│   ├── controllers/
│   │   ├── health.controller.ts      ✅
│   │   ├── auth.controller.ts        ✅
│   │   ├── user.controller.ts        ✅
│   │   ├── patient.controller.ts     ✅
│   │   ├── encounter.controller.ts   ✅
│   │   ├── document.controller.ts    ✅
│   │   ├── appointment.controller.ts ✅
│   │   ├── visit.controller.ts       ✅
│   │   ├── plan.controller.ts        ✅
│   │   ├── subscription.controller.ts✅
│   │   ├── audit.controller.ts       ✅
│   │   └── consent.controller.ts     ✅
│   ├── services/
│   │   ├── auth.service.ts           ✅
│   │   ├── user.service.ts           ✅
│   │   ├── patient.service.ts        ✅
│   │   ├── encounter.service.ts      ✅
│   │   ├── document.service.ts       ✅
│   │   ├── appointment.service.ts    ✅
│   │   ├── visit.service.ts          ✅
│   │   ├── plan.service.ts           ✅
│   │   ├── subscription.service.ts   ✅
│   │   ├── audit.service.ts          ✅
│   │   └── consent.service.ts        ✅
│   ├── dtos/
│   │   ├── auth.dto.ts               ✅
│   │   ├── user.dto.ts               ✅
│   │   ├── patient.dto.ts            ✅
│   │   ├── encounter.dto.ts          ✅
│   │   ├── document.dto.ts           ✅
│   │   └── appointment.dto.ts        ✅
│   ├── middleware/
│   │   ├── auth.middleware.ts        ✅
│   │   └── error.middleware.ts       ✅
│   ├── lib/
│   │   ├── prisma.ts                 ✅
│   │   └── database.service.ts       ✅
│   ├── utils/
│   │   ├── errors.ts                 ✅
│   │   └── logger.ts                 ✅
│   ├── config/
│   │   └── index.ts                  ✅
│   └── routes/
│       └── index.ts                  ✅
├── tests/
│   ├── unit/
│   │   └── services/
│   │       ├── auth.service.test.ts      ✅
│   │       ├── patient.service.test.ts   ✅
│   │       ├── encounter.service.test.ts ✅
│   │       └── document.service.test.ts  ✅
│   └── integration/
│       ├── auth.api.test.ts          ✅
│       ├── patient.api.test.ts       ✅
│       └── encounter.api.test.ts     ✅
└── prisma/
    └── schema.prisma                 ✅
```

### Frontend (apps/web/)

```
apps/web/
├── src/
│   ├── api/
│   │   └── generated/      # OpenAPI generated client (pending)
│   ├── hooks/
│   │   ├── useAuth.ts      (pending)
│   │   ├── usePatients.ts  (pending)
│   │   └── ...
│   ├── components/
│   │   └── [feature-based components] (pending)
│   └── pages/
│       └── [route pages] (pending)
```

### Mobile (apps/mobile/)

```
apps/mobile/
├── src/
│   ├── api/
│   │   └── client.ts (pending)
│   ├── hooks/
│   │   └── [shared hooks] (pending)
│   ├── screens/
│   │   └── [screen components] (pending)
│   └── components/
│       └── [reusable components] (pending)
```

---

## Progress Summary

| Domain | Total Endpoints | Complete | In Progress | Not Started |
|--------|-----------------|----------|-------------|-------------|
| Platform & System | 4 | 4 | 0 | 0 |
| Identity & Access | 6 | 6 | 0 | 0 |
| User & Profile | 2 | 2 | 0 | 0 |
| Patient & EHR | 8 | 8 | 0 | 0 |
| Telemedicine | 8 | 8 | 0 | 0 |
| Billing & Subscriptions | 4 | 4 | 0 | 0 |
| Notifications | 1 | 0 | 0 | 1 |
| Audit & Consent | 3 | 3 | 0 | 0 |
| **Total** | **36** | **35** | **0** | **1** |

### Backend Implementation: 97% Complete
### Repository Layer: In Progress (using in-memory stores)
### Frontend/Mobile: Not Started

---

## Next Steps

1. **Migrate to Prisma repositories** - Replace in-memory stores with Prisma database operations
2. **Generate OpenAPI specification** - Document all endpoints
3. **Implement Notifications endpoint** - Complete the remaining stub
4. **Begin frontend development** - Start web portal implementation
5. **Begin mobile development** - Start Expo/React Native implementation

---

*Last Updated: December 2024*
