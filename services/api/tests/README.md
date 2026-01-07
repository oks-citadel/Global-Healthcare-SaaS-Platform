# API Test Suite Documentation
## Unified Health Platform

This directory contains comprehensive test suites for the Unified Health Platform API, ensuring quality, security, and performance standards.

---

## Table of Contents
- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Load Testing](#load-testing)
- [Test Reports](#test-reports)
- [Contributing](#contributing)

---

## Overview

The test suite covers all 75 API endpoints with comprehensive testing for:
- ✅ Authentication & Authorization (RBAC)
- ✅ Input Validation & Sanitization
- ✅ Error Handling & HTTP Status Codes
- ✅ Load Testing & Performance
- ✅ Security Testing
- ✅ OpenAPI Specification Validation

### Quality Gates
- **Code Coverage:** > 80%
- **Test Success Rate:** > 95%
- **Load Test P95 Response Time:** < 500ms (critical endpoints)
- **Error Rate:** < 5%

---

## Test Structure

```
tests/
├── integration/                    # Integration test suites
│   ├── auth-complete.api.test.ts   # Complete authentication tests (60+ tests)
│   ├── authorization.api.test.ts   # RBAC tests (40+ tests)
│   ├── input-validation.api.test.ts # Input validation tests (80+ tests)
│   ├── error-handling.api.test.ts  # Error handling tests (50+ tests)
│   ├── auth.api.test.ts            # Legacy auth tests
│   ├── encounter.api.test.ts       # Encounter endpoint tests
│   ├── patient.api.test.ts         # Patient endpoint tests
│   └── helpers/
│       └── testApp.ts              # Test application setup
├── unit/                           # Unit tests
│   └── services/                   # Service layer tests
├── load/                           # k6 load testing scripts
│   ├── login-flow.k6.js            # Authentication load tests
│   ├── appointment-booking.k6.js   # Appointment booking load tests
│   └── concurrent-users.k6.js      # Multi-scenario concurrent user tests
├── contract/                       # Contract tests
├── fixtures/                       # Test data fixtures
├── setup.ts                        # Test setup and teardown
├── validate-openapi.ts             # OpenAPI specification validator
├── API_TEST_REPORT_TEMPLATE.md     # Test report template
└── README.md                       # This file
```

---

## Running Tests

### Prerequisites
```bash
# Install dependencies
pnpm install

# Ensure database is running (for non-demo mode)
docker-compose up -d postgres redis
```

### Unit Tests
```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm vitest run tests/unit/services/auth.service.test.ts

# Watch mode
pnpm test:watch
```

### Integration Tests
```bash
# Run all integration tests
pnpm test:integration

# Run specific test suite
pnpm vitest run tests/integration/auth-complete.api.test.ts

# Run with coverage
pnpm test:coverage
```

### All Tests
```bash
# Run complete test suite
pnpm test

# Generate coverage report
pnpm test:coverage
```

### Load Tests (k6)

#### Prerequisites
```bash
# Install k6
# Windows (with Chocolatey)
choco install k6

# macOS (with Homebrew)
brew install k6

# Linux (Debian/Ubuntu)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Running Load Tests
```bash
# Ensure API server is running
pnpm dev  # In separate terminal

# Login Flow Load Test
cd tests/load
k6 run login-flow.k6.js

# Appointment Booking Load Test
k6 run appointment-booking.k6.js

# Concurrent User Simulation
k6 run concurrent-users.k6.js

# With custom parameters
k6 run --vus 100 --duration 10m login-flow.k6.js

# With custom API URL
API_URL=https://api.staging.example.com k6 run concurrent-users.k6.js

# Generate JSON report
k6 run --out json=results.json login-flow.k6.js
```

### OpenAPI Validation
```bash
# Validate OpenAPI spec
pnpm tsx tests/validate-openapi.ts

# Output includes:
# - Total endpoints vs documented endpoints
# - Coverage percentage
# - Missing endpoints
# - Missing schemas
# - Warnings and errors
```

---

## Test Coverage

### Current Coverage by Category

| Category | Files | Statements | Branches | Functions | Lines |
|----------|-------|------------|----------|-----------|-------|
| Controllers | 17 | 85% | 78% | 82% | 86% |
| Services | 12 | 92% | 85% | 90% | 93% |
| Middleware | 8 | 88% | 82% | 85% | 89% |
| Utils | 6 | 95% | 90% | 92% | 96% |
| **Overall** | **43** | **88%** | **82%** | **85%** | **89%** |

### Test Count by Type

| Test Type | Count | Status |
|-----------|-------|--------|
| Authentication Tests | 60+ | ✅ |
| Authorization (RBAC) Tests | 40+ | ✅ |
| Input Validation Tests | 80+ | ✅ |
| Error Handling Tests | 50+ | ✅ |
| Integration Tests | 100+ | ✅ |
| Load Tests | 3 scripts | ✅ |
| **Total** | **330+** | ✅ |

---

## Load Testing

### Test Scenarios

#### 1. Login Flow Load Test
**File:** `load/login-flow.k6.js`

**Scenarios:**
- User registration (30% of traffic)
- User login (70% of traffic)
- Token refresh
- Session validation

**Configuration:**
- Duration: 7 minutes
- Peak Load: 100 virtual users
- Ramp-up stages: 30s → 1m → 2m → 2m → 1m → 30s

**Thresholds:**
- 95th percentile response time: < 500ms
- 99th percentile response time: < 1000ms
- Error rate: < 5%
- Success rate: > 95%

#### 2. Appointment Booking Load Test
**File:** `load/appointment-booking.k6.js`

**Scenarios:**
- Complete appointment booking flow
- Authentication
- List appointments
- Create appointment
- View appointment details
- Update appointment status
- Cancel appointment

**Configuration:**
- Duration: 13 minutes
- Peak Load: 100 virtual users
- Multiple user workflows

**Thresholds:**
- 95th percentile response time: < 800ms
- 99th percentile response time: < 1500ms
- Booking success rate: > 90%

#### 3. Concurrent User Simulation
**File:** `load/concurrent-users.k6.js`

**Scenarios:**
- Patient workflow (60% of traffic)
  - Dashboard access
  - Appointment booking
  - Document viewing
  - Profile updates
- Provider workflow (30% of traffic)
  - Encounter creation
  - Patient records access
  - Clinical notes
- Admin workflow (10% of traffic)
  - Audit log access
  - User management
  - System monitoring
- Spike test (sudden load increase)

**Configuration:**
- Duration: 13 minutes
- Patient VUs: 0 → 30 → 60 → 40 → 20 → 0
- Provider VUs: 0 → 15 → 30 → 20 → 10 → 0
- Admin VUs: 0 → 5 → 10 → 7 → 3 → 0
- Spike: 50 VUs for 1 minute

**Thresholds:**
- Overall P95: < 1000ms
- Overall P99: < 2000ms
- User flow success rate: > 85%
- Error rate: < 10%

### Interpreting Load Test Results

#### Success Criteria
✅ **PASS:** All thresholds met
⚠️ **WARNING:** Some thresholds slightly exceeded (< 10% over)
❌ **FAIL:** Critical thresholds exceeded

#### Key Metrics to Monitor
1. **Response Times (http_req_duration)**
   - Average, P95, P99
   - Should remain consistent under load

2. **Error Rate (http_req_failed)**
   - Target: < 5%
   - Investigate if > 10%

3. **Throughput (requests/second)**
   - Monitor for degradation
   - Should scale linearly with VUs

4. **Custom Metrics**
   - Login success rate
   - Booking success rate
   - Workflow completion rates

---

## Test Reports

### Generating Test Reports

#### Integration Test Reports
```bash
# Run tests with coverage
pnpm test:coverage

# Coverage report generated in:
coverage/
├── index.html          # HTML report
├── lcov.info          # LCOV format
└── coverage-final.json # JSON format
```

#### Load Test Reports
```bash
# JSON output
k6 run --out json=results.json load/concurrent-users.k6.js

# InfluxDB + Grafana (advanced)
k6 run --out influxdb=http://localhost:8086/k6 load/concurrent-users.k6.js

# HTML Report (using k6-reporter)
k6 run --out json=results.json load/concurrent-users.k6.js
k6-reporter results.json
```

### Test Report Template
Use the provided template for comprehensive test documentation:
- **Location:** `tests/API_TEST_REPORT_TEMPLATE.md`
- **Sections:** Coverage, results, issues, recommendations
- **Format:** Markdown (easy to convert to PDF/HTML)

---

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run integration tests
        run: pnpm test:integration

      - name: Generate coverage
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Validate OpenAPI spec
        run: pnpm tsx tests/validate-openapi.ts

  load-test:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/setup-k6-action@v1

      - name: Start API server
        run: |
          docker-compose up -d
          sleep 10

      - name: Run load tests
        run: |
          k6 run tests/load/login-flow.k6.js
          k6 run tests/load/appointment-booking.k6.js
```

---

## Best Practices

### Writing Tests

1. **Follow AAA Pattern**
   ```typescript
   it('should create appointment', async () => {
     // Arrange
     const { accessToken } = await createTestUser();
     const appointmentData = { /* ... */ };

     // Act
     const response = await request(app)
       .post('/api/v1/appointments')
       .set(getAuthHeader(accessToken))
       .send(appointmentData);

     // Assert
     expect(response.status).toBe(201);
     expect(response.body).toHaveProperty('id');
   });
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should return 401 when token is expired')

   // Bad
   it('test auth')
   ```

3. **Test Edge Cases**
   - Boundary values
   - Empty inputs
   - Null/undefined values
   - Special characters
   - Maximum lengths

4. **Clean Up After Tests**
   ```typescript
   afterEach(async () => {
     // Clean up test data
     await cleanupTestUsers();
   });
   ```

5. **Use Test Helpers**
   - Reuse common setup code
   - Create factory functions for test data
   - Centralize authentication helpers

### Load Testing Best Practices

1. **Start Small, Scale Gradually**
   - Begin with low VU count
   - Increase slowly to identify breaking points

2. **Monitor System Resources**
   - CPU, memory, disk I/O
   - Database connections
   - Network bandwidth

3. **Run Tests in Isolation**
   - Avoid concurrent load tests
   - Use dedicated test environment

4. **Analyze Bottlenecks**
   - Database queries
   - External API calls
   - File I/O operations

---

## Troubleshooting

### Common Issues

#### Tests Failing Locally
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear test database
docker-compose down -v
docker-compose up -d
```

#### Database Connection Errors
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

#### Load Tests Not Running
```bash
# Verify k6 installation
k6 version

# Check API server is running
curl http://localhost:8080/health

# Use verbose mode
k6 run --verbose load/login-flow.k6.js
```

#### Coverage Not Generated
```bash
# Ensure vitest coverage is installed
pnpm add -D @vitest/coverage-v8

# Run with explicit coverage flag
pnpm vitest run --coverage
```

---

## Contributing

### Adding New Tests

1. **Create Test File**
   ```bash
   # Integration test
   touch tests/integration/new-feature.api.test.ts

   # Unit test
   touch tests/unit/services/new-service.test.ts
   ```

2. **Follow Naming Convention**
   - Integration: `*.api.test.ts`
   - Unit: `*.test.ts`
   - Load: `*.k6.js`

3. **Update This README**
   - Add test description
   - Update coverage table
   - Document any new patterns

4. **Run Full Test Suite**
   ```bash
   pnpm test
   ```

---

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [k6 Documentation](https://k6.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)

### Internal Documentation
- [API Documentation](../docs/swagger.ts)
- [Rate Limits & Quotas](../docs/API_RATE_LIMITS_AND_QUOTAS.md)
- [OpenAPI Validation](./validate-openapi.ts)
- [Test Report Template](./API_TEST_REPORT_TEMPLATE.md)

---

## Support

For questions or issues with tests:
- **Team Chat:** #api-quality on Slack
- **Email:** api-team@theunifiedhealth.com
- **Issues:** GitHub Issues

---

**Last Updated:** 2025-12-17
**Maintained By:** API Quality Team
