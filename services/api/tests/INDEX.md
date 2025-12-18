# API Test Suite - Quick Reference Index

**Project:** Unified Healthcare Platform
**API Version:** 1.0.0
**Total Endpoints:** 75
**Total Tests:** 330+

---

## Quick Links

### 📋 Documentation
- [Complete Test Suite README](./README.md)
- [API Quality Summary](../API_QUALITY_SUMMARY.md)
- [Rate Limits & Quotas](../docs/API_RATE_LIMITS_AND_QUOTAS.md)
- [Test Report Template](./API_TEST_REPORT_TEMPLATE.md)

### 🧪 Test Files
- [Authentication Tests](./integration/auth-complete.api.test.ts) - 60+ tests
- [Authorization Tests](./integration/authorization.api.test.ts) - 40+ tests
- [Input Validation Tests](./integration/input-validation.api.test.ts) - 80+ tests
- [Error Handling Tests](./integration/error-handling.api.test.ts) - 50+ tests

### 📊 Load Tests
- [Login Flow](./load/login-flow.k6.js)
- [Appointment Booking](./load/appointment-booking.k6.js)
- [Concurrent Users](./load/concurrent-users.k6.js)

### 🔧 Tools
- [OpenAPI Validator](./validate-openapi.ts)
- [Test Runner Script](../scripts/run-all-tests.sh)

---

## Quick Start

```bash
# Run all integration tests
pnpm test:integration

# Run specific test file
pnpm vitest run tests/integration/auth-complete.api.test.ts

# Run with coverage
pnpm test:coverage

# Run load tests (requires k6 and running API)
cd tests/load
k6 run login-flow.k6.js

# Validate OpenAPI spec
pnpm tsx tests/validate-openapi.ts

# Run everything
./scripts/run-all-tests.sh --all
```

---

## Test Coverage at a Glance

| Category | Tests | Status |
|----------|-------|--------|
| Authentication | 60+ | ✅ |
| Authorization | 40+ | ✅ |
| Input Validation | 80+ | ✅ |
| Error Handling | 50+ | ✅ |
| Load Tests | 3 | ✅ |
| **Total** | **330+** | ✅ |

---

## API Endpoints by Category

### Authentication (6 endpoints)
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- GET `/auth/me`
- GET `/roles`

### Patients (3 endpoints)
- POST `/patients`
- GET `/patients/:id`
- PATCH `/patients/:id`

### Appointments (5 endpoints)
- POST `/appointments`
- GET `/appointments`
- GET `/appointments/:id`
- PATCH `/appointments/:id`
- DELETE `/appointments/:id`

### Encounters (8 endpoints)
- POST `/encounters`
- GET `/encounters`
- GET `/encounters/:id`
- PATCH `/encounters/:id`
- POST `/encounters/:id/notes`
- GET `/encounters/:id/notes`
- POST `/encounters/:id/start`
- POST `/encounters/:id/end`

### Documents (6 endpoints)
- POST `/documents`
- GET `/documents`
- GET `/documents/:id`
- GET `/documents/:id/download`
- DELETE `/documents/:id`
- GET `/patients/:patientId/documents`

### Payments (14 endpoints)
- GET `/payments/config`
- POST `/payments/setup-intent`
- POST `/payments/subscription`
- GET `/payments/subscription`
- DELETE `/payments/subscription`
- POST `/payments/payment-method`
- POST `/payments/payment-method/save`
- GET `/payments/payment-methods`
- DELETE `/payments/payment-method/:id`
- POST `/payments/charge`
- GET `/payments/history`
- GET `/payments/:id`
- POST `/payments/:id/refund`
- GET `/payments/invoices`

### And 28+ more endpoints...

See [API_QUALITY_SUMMARY.md](../API_QUALITY_SUMMARY.md) for complete endpoint list.

---

## Key Test Scenarios

### Authentication Flow
```typescript
✅ User registration with valid data
✅ Registration validation (email, password strength)
✅ Duplicate email prevention
✅ Login with valid/invalid credentials
✅ Token refresh mechanism
✅ Session management
```

### Authorization (RBAC)
```typescript
✅ Admin-only endpoint access
✅ Provider + Admin endpoints
✅ Patient access restrictions
✅ Cross-role authorization
✅ Token validation
```

### Input Validation
```typescript
✅ Email format validation
✅ Password requirements
✅ Required field checks
✅ Type validation
✅ XSS prevention
✅ SQL injection prevention
```

### Error Handling
```typescript
✅ HTTP status codes (400, 401, 403, 404, 409, 429, 500)
✅ Consistent error format
✅ Security in error messages
✅ Edge case handling
```

### Performance
```typescript
✅ Login flow: p95 < 500ms
✅ Appointment booking: p95 < 800ms
✅ Concurrent users: 100+ VUs
✅ Rate limiting: 100 req/min
```

---

## Test Commands Reference

### Integration Tests
```bash
# All integration tests
pnpm test:integration

# Authentication tests only
pnpm vitest run tests/integration/auth-complete.api.test.ts

# Authorization tests only
pnpm vitest run tests/integration/authorization.api.test.ts

# Input validation tests only
pnpm vitest run tests/integration/input-validation.api.test.ts

# Error handling tests only
pnpm vitest run tests/integration/error-handling.api.test.ts

# With coverage
pnpm test:coverage
```

### Load Tests
```bash
# Prerequisites: API server must be running
pnpm dev  # In separate terminal

# Login flow load test
k6 run tests/load/login-flow.k6.js

# Appointment booking load test
k6 run tests/load/appointment-booking.k6.js

# Concurrent user simulation
k6 run tests/load/concurrent-users.k6.js

# With custom parameters
k6 run --vus 200 --duration 15m tests/load/login-flow.k6.js

# Generate JSON report
k6 run --out json=results.json tests/load/concurrent-users.k6.js
```

### Validation
```bash
# Validate OpenAPI specification
pnpm tsx tests/validate-openapi.ts

# Generates report showing:
# - Total endpoints vs documented
# - Coverage percentage
# - Missing endpoints
# - Missing schemas
```

### Complete Test Suite
```bash
# Run everything (integration + validation)
./scripts/run-all-tests.sh

# Run everything including load tests
./scripts/run-all-tests.sh --all

# Integration tests only
./scripts/run-all-tests.sh --integration-only

# Load tests only
./scripts/run-all-tests.sh --load-only
```

---

## Performance Benchmarks

### Response Time Targets

| Endpoint Type | P50 | P95 | P99 |
|--------------|-----|-----|-----|
| Authentication | <150ms | <400ms | <700ms |
| Data Retrieval | <100ms | <300ms | <500ms |
| Data Creation | <200ms | <500ms | <900ms |
| File Operations | <300ms | <800ms | <1500ms |

### Load Capacity

| Scenario | Concurrent Users | RPS | Success Rate |
|----------|-----------------|-----|--------------|
| Login Flow | 100 | 150+ | >95% |
| Appointment Booking | 100 | 120+ | >90% |
| Mixed Workflows | 100 | 180+ | >85% |

---

## Rate Limits Quick Reference

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Authentication | 10 | 15 min |
| Data Retrieval | 100 | 1 min |
| Data Modification | 20-30 | 5 min |
| File Upload | 10 | 15 min |
| Payments | 5-10 | 15 min |
| Global Default | 100 | 1 min |

See [API_RATE_LIMITS_AND_QUOTAS.md](../docs/API_RATE_LIMITS_AND_QUOTAS.md) for details.

---

## Common Issues & Solutions

### Issue: Tests Failing Locally
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
pnpm install

# Restart database
docker-compose down -v
docker-compose up -d
```

### Issue: Load Tests Not Running
```bash
# Solution: Check prerequisites
k6 version  # Verify k6 installed
curl http://localhost:8080/health  # API running

# Use verbose mode
k6 run --verbose tests/load/login-flow.k6.js
```

### Issue: Coverage Not Generated
```bash
# Solution: Install coverage package
pnpm add -D @vitest/coverage-v8

# Run with explicit flag
pnpm vitest run --coverage
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run API Tests
  run: |
    pnpm test:coverage
    pnpm tsx tests/validate-openapi.ts

- name: Run Load Tests
  run: |
    pnpm dev &
    sleep 10
    k6 run tests/load/login-flow.k6.js
```

---

## Next Steps

1. **Review Documentation**
   - Read [README.md](./README.md) for detailed information
   - Check [API_QUALITY_SUMMARY.md](../API_QUALITY_SUMMARY.md) for overview

2. **Run Tests**
   - Start with: `pnpm test:integration`
   - Try load tests: `k6 run tests/load/login-flow.k6.js`

3. **Explore Code**
   - Review test files in `integration/`
   - Study load test scripts in `load/`

4. **Generate Reports**
   - Run coverage: `pnpm test:coverage`
   - View: `coverage/index.html`

---

## Support & Resources

- **Documentation:** [tests/README.md](./README.md)
- **API Docs:** http://localhost:8080/api/docs
- **OpenAPI Spec:** http://localhost:8080/api/docs/openapi.json
- **Coverage Report:** coverage/index.html (after running tests)

---

**Last Updated:** 2025-12-17
**Test Suite Version:** 1.0
**Maintainer:** API Quality Team
