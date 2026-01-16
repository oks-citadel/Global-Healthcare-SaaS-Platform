# Test Inventory

**Track test coverage for every API endpoint**

---

## Legend

| Status | Symbol | Description |
|--------|--------|-------------|
| Not Started | - | No tests written |
| Partial | PARTIAL | Some tests exist |
| Complete | Done | Full test coverage |
| Failing | FAIL | Tests exist but failing |

---

## Test Requirements Per Endpoint

Each endpoint requires these test types:

1. **Unit Tests**: Test service logic in isolation
2. **Integration Tests**: Test full request/response cycle
3. **Auth Tests**: Verify authentication requirements
4. **RBAC Tests**: Verify role-based access (if applicable)
5. **Negative Tests**: Test error cases and edge cases
6. **Contract Tests**: Validate OpenAPI spec compliance
7. **CI Smoke Tests**: Basic health check in CI pipeline

---

## MVP Endpoints Test Status

### Platform & System

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| GET /health | - | - | - | N/A | - | - | - | - |
| GET /ready | - | - | - | N/A | - | - | - | - |
| GET /version | - | - | - | N/A | - | - | - | - |
| GET /config/public | - | - | - | N/A | - | - | - | - |

### Identity & Access

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| POST /auth/register | - | - | N/A | N/A | - | - | - | - |
| POST /auth/login | - | - | N/A | N/A | - | - | - | - |
| POST /auth/refresh | - | - | - | N/A | - | - | - | - |
| POST /auth/logout | - | - | - | N/A | - | - | - | - |
| GET /auth/me | - | - | - | N/A | - | - | - | - |
| GET /roles | - | - | - | - | - | - | - | - |

### User & Profile

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| GET /users/{id} | - | - | - | - | - | - | - | - |
| PATCH /users/{id} | - | - | - | - | - | - | - | - |

### Patient & EHR

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| POST /patients | - | - | - | - | - | - | - | - |
| GET /patients/{id} | - | - | - | - | - | - | - | - |
| PATCH /patients/{id} | - | - | - | - | - | - | - | - |
| POST /encounters | - | - | - | - | - | - | - | - |
| GET /encounters/{id} | - | - | - | - | - | - | - | - |
| POST /encounters/{id}/notes | - | - | - | - | - | - | - | - |
| POST /documents | - | - | - | - | - | - | - | - |
| GET /documents/{id} | - | - | - | - | - | - | - | - |

### Telemedicine

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| POST /appointments | - | - | - | - | - | - | - | - |
| GET /appointments | - | - | - | - | - | - | - | - |
| GET /appointments/{id} | - | - | - | - | - | - | - | - |
| PATCH /appointments/{id} | - | - | - | - | - | - | - | - |
| DELETE /appointments/{id} | - | - | - | - | - | - | - | - |
| POST /visits/{id}/start | - | - | - | - | - | - | - | - |
| POST /visits/{id}/end | - | - | - | - | - | - | - | - |
| POST /visits/{id}/chat | - | - | - | - | - | - | - | - |

### Billing & Subscriptions

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| GET /plans | - | - | N/A | N/A | - | - | - | - |
| POST /subscriptions | - | - | - | - | - | - | - | - |
| DELETE /subscriptions/{id} | - | - | - | - | - | - | - | - |
| POST /billing/webhook | - | - | - | N/A | - | - | - | - |

### Notifications

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| POST /notifications/email | - | - | - | - | - | - | - | - |

### Audit & Consent

| Endpoint | Unit | Integration | Auth | RBAC | Negative | Contract | CI Smoke | Status |
|----------|------|-------------|------|------|----------|----------|----------|--------|
| GET /audit/events | - | - | - | - | - | - | - | - |
| POST /consents | - | - | - | - | - | - | - | - |
| GET /consents/{id} | - | - | - | - | - | - | - | - |

---

## Test File Locations

```
services/api/
├── src/
│   └── [source files]
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.ts
│   │   │   ├── users.service.test.ts
│   │   │   ├── patients.service.test.ts
│   │   │   ├── appointments.service.test.ts
│   │   │   └── ...
│   │   └── utils/
│   │       └── [utility tests]
│   ├── integration/
│   │   ├── auth.integration.test.ts
│   │   ├── users.integration.test.ts
│   │   ├── patients.integration.test.ts
│   │   ├── appointments.integration.test.ts
│   │   └── ...
│   ├── contract/
│   │   └── openapi.contract.test.ts
│   └── fixtures/
│       ├── users.fixture.ts
│       ├── patients.fixture.ts
│       └── ...
```

---

## Test Categories Explained

### Unit Tests
- Test service logic in isolation
- Mock all external dependencies
- Fast execution (<100ms per test)
- Coverage target: >80%

### Integration Tests
- Test full HTTP request/response
- Use test database (containerized)
- Include middleware execution
- Verify response shapes

### Auth Tests
- Verify 401 without token
- Verify 401 with expired token
- Verify 200 with valid token
- Test token refresh flow

### RBAC Tests
- Verify 403 for unauthorized roles
- Verify 200 for authorized roles
- Test role inheritance
- Test resource ownership

### Negative Tests
- Invalid input (validation errors)
- Not found (404)
- Conflict (409)
- Internal errors (500)
- Edge cases

### Contract Tests
- Validate request matches OpenAPI spec
- Validate response matches OpenAPI spec
- Auto-generated from openapi.yaml
- Run on every CI build

### CI Smoke Tests
- Basic endpoint reachability
- Health check passes
- Auth endpoint works
- Run post-deployment

---

## Coverage Targets

| Type | Target | Current |
|------|--------|---------|
| Unit Test Coverage | >80% | 0% |
| Integration Test Coverage | >70% | 0% |
| Auth Tests | 100% of protected endpoints | 0% |
| RBAC Tests | 100% of role-protected endpoints | 0% |
| Contract Tests | 100% of endpoints | 0% |

---

## Test Commands

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run with coverage report
pnpm test:coverage

# Run contract tests
pnpm test:contract

# Run specific test file
pnpm test -- auth.service.test.ts

# Run tests in watch mode
pnpm test:watch
```

---

## Progress Summary

| Domain | Total Endpoints | Tests Complete | Tests Partial | Not Started |
|--------|-----------------|----------------|---------------|-------------|
| Platform & System | 4 | 0 | 0 | 4 |
| Identity & Access | 6 | 0 | 0 | 6 |
| User & Profile | 2 | 0 | 0 | 2 |
| Patient & EHR | 8 | 0 | 0 | 8 |
| Telemedicine | 8 | 0 | 0 | 8 |
| Billing & Subscriptions | 4 | 0 | 0 | 4 |
| Notifications | 1 | 0 | 0 | 1 |
| Audit & Consent | 3 | 0 | 0 | 3 |
| **Total** | **36** | **0** | **0** | **36** |

---

*Last Updated: December 2024*
