# Adding Monitoring Dependencies to Services

This guide explains how to add monitoring dependencies to all microservices in the Unified Health Platform.

---

## Required Dependencies

All microservices need the following npm packages:

```json
{
  "dependencies": {
    "prom-client": "^15.1.0",
    "applicationinsights": "^2.9.1"
  }
}
```

---

## Quick Installation Script

Run this script from the root of the project to add dependencies to all services:

```bash
#!/bin/bash

# Array of service directories
services=(
  "services/api"
  "services/api-gateway"
  "services/telehealth-service"
  "services/chronic-care-service"
  "services/mental-health-service"
  "services/pharmacy-service"
  "services/laboratory-service"
)

# Install dependencies in each service
for service in "${services[@]}"; do
  echo "Installing monitoring dependencies in $service..."

  if [ -d "$service" ]; then
    cd "$service"
    npm install prom-client@^15.1.0 applicationinsights@^2.9.1
    cd ../..
  else
    echo "Warning: $service directory not found"
  fi
done

echo "All dependencies installed!"
```

Save this as `install-monitoring-deps.sh` and run:

```bash
chmod +x install-monitoring-deps.sh
./install-monitoring-deps.sh
```

---

## Manual Installation (Per Service)

For each service, navigate to the service directory and run:

```bash
cd services/api
npm install prom-client applicationinsights

cd ../api-gateway
npm install prom-client applicationinsights

cd ../telehealth-service
npm install prom-client applicationinsights

cd ../chronic-care-service
npm install prom-client applicationinsights

cd ../mental-health-service
npm install prom-client applicationinsights

cd ../pharmacy-service
npm install prom-client applicationinsights

cd ../laboratory-service
npm install prom-client applicationinsights
```

---

## Verification

After installation, verify each service has the dependencies:

```bash
# Check api service
cat services/api/package.json | grep -A 2 "prom-client\|applicationinsights"

# Repeat for other services
```

---

## Package.json Template

Here's what the dependencies section should look like after installation:

```json
{
  "name": "@unified-health/your-service",
  "version": "1.0.0",
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "applicationinsights": "^2.9.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "prom-client": "^15.1.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  }
}
```

---

## Next Steps

After installing dependencies:

1. Copy metrics implementation from `services/telehealth-service/src/lib/metrics.ts`
2. Create similar files in other services
3. Add metrics middleware to Express app
4. Add /metrics endpoint
5. Initialize Azure Application Insights
6. Deploy and verify metrics are being collected

See `MONITORING_INTEGRATION_GUIDE.md` for detailed integration steps.
