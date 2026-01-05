# Unified Health - K6 Load Testing Framework

## Overview

This directory contains comprehensive load testing scripts using [K6](https://k6.io/) for the Unified Health platform. These tests validate system performance, capacity, and reliability under various load conditions.

## Prerequisites

1. Install K6:

   ```bash
   # macOS
   brew install k6

   # Windows (Chocolatey)
   choco install k6

   # Docker
   docker pull grafana/k6
   ```

2. Set environment variables:
   ```bash
   export BASE_URL=https://api.theunifiedhealth.com
   export AUTH_TOKEN=your-test-token
   ```

## Test Types

| Test Type  | Purpose                                | Duration | VUs      |
| ---------- | -------------------------------------- | -------- | -------- |
| **Smoke**  | Verify system works under minimal load | 1 min    | 1-5      |
| **Load**   | Test expected normal load              | 10 min   | 50-100   |
| **Stress** | Find system breaking point             | 20 min   | 100-500  |
| **Spike**  | Test sudden traffic spikes             | 5 min    | 1-1000-1 |
| **Soak**   | Test system stability over time        | 2 hrs    | 50       |

## Running Tests

### Quick Start

```bash
# Run smoke test (verify system is working)
npm run test:smoke

# Run standard load test
npm run test:load

# Run stress test (find breaking point)
npm run test:stress
```

### With Docker

```bash
docker run -i grafana/k6 run - < tests/load.js
```

### With Environment Variables

```bash
K6_BASE_URL=https://staging.theunifiedhealth.com \
K6_VUS=100 \
K6_DURATION=5m \
k6 run tests/load.js
```

## Test Scenarios

### 1. API Endpoints (`tests/api-endpoints.js`)

- Health check endpoints
- Patient CRUD operations
- Appointment management
- Provider search

### 2. Authentication Flow (`tests/auth-flow.js`)

- Login with credentials
- JWT token refresh
- MFA verification
- Session management

### 3. Appointment Flow (`tests/appointment-flow.js`)

- Search available slots
- Book appointment
- Cancel/reschedule
- Telehealth session join

### 4. Full User Journey (`tests/user-journey.js`)

- Complete patient workflow
- Provider interaction
- Payment processing

## Performance Thresholds

| Metric            | Target  | Critical |
| ----------------- | ------- | -------- |
| p95 Response Time | < 200ms | > 500ms  |
| p99 Response Time | < 500ms | > 1000ms |
| Error Rate        | < 0.1%  | > 1%     |
| Requests/sec      | > 1000  | < 500    |

## Output & Reporting

### JSON Output

```bash
k6 run --out json=results/output.json tests/load.js
```

### Prometheus/Grafana

```bash
k6 run --out experimental-prometheus-rw tests/load.js
```

### Cloud (K6 Cloud)

```bash
k6 cloud tests/load.js
```

## Results Directory

Test results are saved to `results/` directory:

- `results/smoke-{timestamp}.json`
- `results/load-{timestamp}.json`
- `results/stress-{timestamp}.json`

## CI/CD Integration

Add to your pipeline:

```yaml
load-test:
  stage: test
  image: grafana/k6
  script:
    - k6 run --out json=results.json infrastructure/load-testing/tests/smoke.js
  artifacts:
    paths:
      - results.json
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure target server is running
2. **High error rate**: Check authentication tokens
3. **Timeout errors**: Increase timeout in config
4. **Memory issues**: Reduce VU count or use cloud

## Contributing

When adding new tests:

1. Follow naming convention: `{feature}-{type}.js`
2. Include threshold definitions
3. Add documentation to this README
4. Test locally before committing
