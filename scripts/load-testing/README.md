# Load Testing Infrastructure

This directory contains k6 load testing scripts for the Global Healthcare SaaS Platform. These tests measure performance, identify bottlenecks, and ensure the platform meets SLA requirements under load.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Test Scenarios](#test-scenarios)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Interpreting Results](#interpreting-results)
- [Target Thresholds](#target-thresholds)
- [CI/CD Integration](#cicd-integration)
- [Safety Features](#safety-features)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ (for local development server)
- k6 installed (see Installation)
- Access to staging environment (for staging tests)

## Installation

### Installing k6

#### macOS
```bash
# Using Homebrew
brew install k6

# Or using MacPorts
sudo port install k6
```

#### Windows
```powershell
# Using Chocolatey
choco install k6

# Using winget
winget install k6 --source winget

# Or download installer from:
# https://dl.k6.io/msi/k6-latest-amd64.msi
```

#### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Linux (RHEL/CentOS/Fedora)
```bash
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

#### Docker
```bash
docker pull grafana/k6
```

### Verify Installation
```bash
k6 version
```

## Quick Start

1. **Start your local development server:**
   ```bash
   # From project root
   npm run dev
   ```

2. **Run a smoke test:**
   ```bash
   cd scripts/load-testing
   ./run-load-test.sh smoke api-health
   ```

3. **View results in terminal**

## Test Scenarios

### 1. API Health Check (`scenarios/api-health.js`)
Tests health and readiness endpoints of all platform services.

**What it tests:**
- Web app health endpoint
- API gateway health/ready endpoints
- Auth service health endpoint
- Service availability under load

**Usage:**
```bash
k6 run scenarios/api-health.js
```

### 2. Authentication Flow (`scenarios/auth-flow.js`)
Tests the complete authentication lifecycle.

**What it tests:**
- User login performance
- Token validation
- Token refresh
- Logout functionality
- Failed login handling

**Usage:**
```bash
K6_TEST_USER=test@example.com K6_TEST_PASSWORD=testpass123 k6 run scenarios/auth-flow.js
```

### 3. API Endpoints (`scenarios/api-endpoints.js`)
Tests main business API endpoints with realistic traffic patterns.

**What it tests:**
- Patient CRUD operations
- Appointment management
- Medical records access
- Search and list operations
- Write operations (create, update)

**Usage:**
```bash
k6 run scenarios/api-endpoints.js
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `K6_BASE_URL` | Web application URL | `http://localhost:3000` |
| `K6_API_URL` | API gateway URL | `http://localhost:4000/api/v1` |
| `K6_AUTH_URL` | Auth service URL | `http://localhost:4001/auth` |
| `K6_ENVIRONMENT` | Environment name | `local` |
| `K6_STAGES` | Test intensity (smoke/load/stress) | `load` |
| `K6_TEST_USER` | Test user email | `loadtest@test.example.com` |
| `K6_TEST_PASSWORD` | Test user password | `LoadTest123!` |
| `K6_VERBOSE` | Enable verbose logging | `false` |
| `K6_ALLOW_PRODUCTION` | Allow production testing | `false` |

### Example: Testing Against Staging
```bash
export K6_BASE_URL=https://staging.healthcare.example.com
export K6_API_URL=https://staging-api.healthcare.example.com/api/v1
export K6_AUTH_URL=https://staging-auth.healthcare.example.com/auth
export K6_ENVIRONMENT=staging

k6 run scenarios/api-health.js
```

### Shared Configuration (`config.js`)

The `config.js` file contains:
- Environment configuration
- Threshold definitions (standard, critical, relaxed)
- Load stage presets (smoke, load, stress, spike, soak)
- Test data generators
- HTTP request helpers
- Common check functions

## Running Tests

### Using the Run Script

The `run-load-test.sh` script provides a convenient wrapper:

```bash
# Basic usage
./run-load-test.sh <test-type> <scenario>

# Examples:
./run-load-test.sh smoke api-health      # Quick smoke test
./run-load-test.sh load auth-flow        # Standard load test
./run-load-test.sh stress api-endpoints  # Stress test

# With custom URL:
./run-load-test.sh load api-health --url http://staging.example.com

# Run all scenarios:
./run-load-test.sh load all
```

### Direct k6 Commands

```bash
# Basic run
k6 run scenarios/api-health.js

# With options
k6 run --vus 50 --duration 5m scenarios/api-health.js

# Output to JSON
k6 run --out json=results.json scenarios/api-health.js

# With environment variables
K6_STAGES=stress k6 run scenarios/api-endpoints.js
```

### Test Types

| Type | Description | VUs | Duration |
|------|-------------|-----|----------|
| `smoke` | Minimal load, verify system works | 5 | 2 min |
| `load` | Typical expected load | 50-100 | 5 min |
| `stress` | Push beyond normal capacity | 100-200 | 10 min |
| `spike` | Sudden traffic spike | 10-500 | 3 min |
| `soak` | Sustained load over time | 100 | 30 min |

## Interpreting Results

### Key Metrics

1. **http_req_duration** - Request latency
   - `p(50)`: Median response time
   - `p(95)`: 95th percentile (SLA target)
   - `p(99)`: 99th percentile (worst case)

2. **http_req_failed** - Error rate
   - Percentage of failed requests
   - Target: < 1%

3. **http_reqs** - Request throughput
   - Total requests made
   - Requests per second

4. **vus** - Virtual users
   - Concurrent simulated users

### Example Output

```
     ✓ get patient - status 200 or 404
     ✓ get patient - response time OK

     checks.........................: 98.52% ✓ 12847    ✗ 193
     data_received..................: 15 MB  251 kB/s
     data_sent......................: 3.2 MB 53 kB/s
     http_req_blocked...............: avg=1.23ms   min=1µs    med=3µs    max=234ms  p(95)=8µs
     http_req_duration..............: avg=45.32ms  min=2ms    med=34ms   max=892ms  p(95)=156ms
       { expected_response:true }...: avg=43.21ms  min=2ms    med=33ms   max=654ms  p(95)=148ms
     http_req_failed................: 0.45%  ✓ 58       ✗ 12789
     http_reqs......................: 12847  214.11/s
     iteration_duration.............: avg=1.12s    min=506ms  med=1.08s  max=3.45s  p(95)=1.89s
     iterations.....................: 6234   103.90/s
     vus............................: 100    min=0      max=100
     vus_max........................: 100    min=100    max=100
```

### Result Files

Results are saved to the `results/` directory:
- `api-health-summary.json` - Health check results
- `auth-flow-summary.json` - Authentication results
- `api-endpoints-summary.json` - API endpoint results

## Target Thresholds

The platform must meet these SLA requirements:

| Metric | Target | Critical |
|--------|--------|----------|
| Response Time (p95) | < 200ms | < 150ms |
| Error Rate | < 1% | < 0.5% |
| Health Check Success | > 99% | > 99.9% |
| Login Duration (p95) | < 300ms | < 200ms |
| Token Refresh (p95) | < 100ms | < 50ms |

### Threshold Configuration in Scripts

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<200'],    // p95 under 200ms
    http_req_failed: ['rate<0.01'],       // Less than 1% failures
    http_req_blocked: ['p(95)<50'],       // Connection time under 50ms
    http_req_waiting: ['p(95)<180'],      // TTFB under 180ms
  },
};
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Load Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run Load Tests
        env:
          K6_API_URL: ${{ secrets.STAGING_API_URL }}
          K6_AUTH_URL: ${{ secrets.STAGING_AUTH_URL }}
          K6_TEST_USER: ${{ secrets.LOAD_TEST_USER }}
          K6_TEST_PASSWORD: ${{ secrets.LOAD_TEST_PASSWORD }}
        run: |
          cd scripts/load-testing
          ./run-load-test.sh load all

      - name: Upload Results
        uses: actions/upload-artifact@v4
        with:
          name: load-test-results
          path: scripts/load-testing/results/
```

### Docker Execution

```bash
docker run -i --rm \
  -v $(pwd)/scripts/load-testing:/scripts \
  -e K6_API_URL=$K6_API_URL \
  grafana/k6 run /scripts/scenarios/api-health.js
```

## Safety Features

### Production Protection

The scripts include built-in safety checks to prevent accidental production testing:

1. **URL Pattern Detection**: Blocks URLs containing production patterns
2. **Explicit Opt-In**: Requires `K6_ALLOW_PRODUCTION=true` to test production
3. **Default to Local**: All URLs default to localhost

### Protected Patterns

The following URL patterns trigger production protection:
- `prod.`, `production.`
- `.prod.`, `-prod.`
- `live.`
- `.healthcare.com`, `.health.com`

### Enabling Production Testing (Use with Caution)

```bash
K6_ALLOW_PRODUCTION=true K6_API_URL=https://api.production.example.com k6 run scenarios/api-health.js
```

## Troubleshooting

### Common Issues

**1. Connection Refused**
```
ERRO[0001] dial tcp 127.0.0.1:3000: connect: connection refused
```
Solution: Ensure the target service is running.

**2. Certificate Errors**
```
ERRO[0001] x509: certificate signed by unknown authority
```
Solution: Use `--insecure-skip-tls-verify` or install proper certificates.

**3. Rate Limiting**
```
status=429 Too Many Requests
```
Solution: Reduce VUs or add delays between requests.

**4. Memory Issues**
```
WARN[0120] some VUs couldn't be allocated
```
Solution: Reduce max VUs or use a more powerful machine.

### Debug Mode

Enable verbose logging:
```bash
K6_VERBOSE=true k6 run scenarios/api-health.js
```

### Viewing Detailed Logs

```bash
k6 run --verbose scenarios/api-health.js 2>&1 | tee test-output.log
```

## Contributing

When adding new load tests:

1. Create new scenario file in `scenarios/`
2. Import shared config from `config.js`
3. Use standard thresholds unless justified
4. Add production safety checks
5. Document in this README
6. Test locally before committing

## Support

For issues with load testing:
1. Check this README troubleshooting section
2. Review k6 documentation: https://k6.io/docs/
3. Open an issue in the repository
