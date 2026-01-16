# Unified Health API Service

## Overview

The API service is the primary backend server for the Unified Health platform. It provides RESTful endpoints for patient management, clinical data, appointments, and real-time communication via WebSocket.

## Technical Stack

| Component     | Technology                  |
| ------------- | --------------------------- |
| Runtime       | Node.js 20+                 |
| Framework     | Express.js                  |
| Database      | PostgreSQL (via Prisma ORM) |
| Cache         | Redis                       |
| Real-time     | Socket.io                   |
| Documentation | Swagger/OpenAPI             |

## Port Configuration

| Environment | Port |
| ----------- | ---- |
| Development | 8080 |
| Production  | 8080 |

## Directory Structure

```
services/api/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # HTTP request handlers
│   ├── docs/            # API documentation (Swagger)
│   ├── dtos/            # Data Transfer Objects
│   ├── examples/        # Example requests
│   ├── generated/       # Prisma generated client
│   ├── jobs/            # Background job processors
│   ├── lib/             # Core libraries (Prisma, WebSocket, Redis)
│   ├── middleware/      # Express middleware
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── templates/       # Email/notification templates
│   ├── tests/           # Unit and integration tests
│   └── utils/           # Utility functions
├── prisma/              # Database schema
├── Dockerfile           # Container image definition
└── package.json         # Dependencies
```

## API Endpoints

### Health & Readiness

| Endpoint  | Method | Description                 |
| --------- | ------ | --------------------------- |
| `/health` | GET    | Liveness probe              |
| `/ready`  | GET    | Readiness probe (checks DB) |

### Core API (`/api/v1`)

| Prefix          | Resource       | Description               |
| --------------- | -------------- | ------------------------- |
| `/patients`     | Patients       | Patient CRUD operations   |
| `/appointments` | Appointments   | Appointment scheduling    |
| `/encounters`   | Encounters     | Clinical encounters       |
| `/observations` | Observations   | Vital signs, measurements |
| `/users`        | Users          | User management           |
| `/auth`         | Authentication | Login, token refresh      |

## Environment Variables

```bash
# Required
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:password@host:5432/db?schema=public
JWT_SECRET=your-jwt-secret

# Optional
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGINS=https://app.unifiedhealth.io
RATE_LIMIT_MAX=100

# Demo Mode
DEMO_MODE=true  # Enables in-memory data without database
```

## Database Access

### Schema Permissions

The API service has **full access** to all database schemas as the primary data service.

| Schema        | Access Level |
| ------------- | ------------ |
| public        | Full         |
| auth          | Full         |
| clinical      | Full         |
| pharmacy      | Read         |
| mental_health | Read         |
| chronic_care  | Read         |
| imaging       | Read         |

### Database Role

```sql
-- Production role
CREATE ROLE role_api_primary WITH LOGIN PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO role_api_primary;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA clinical TO role_api_primary;
```

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional)
- pnpm

### Development

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Start in development mode
pnpm dev

# Start in demo mode (no database required)
DEMO_MODE=true pnpm dev
```

### Demo Mode

Demo mode enables the service to run without a database connection:

```bash
DEMO_MODE=true pnpm dev
```

Demo credentials:

- Patient: `patient@demo.com` / `demo123`
- Doctor: `doctor@demo.com` / `demo123`
- Admin: `admin@demo.com` / `demo123`

## Docker

### Build

```bash
docker build -f Dockerfile -t unifiedhealth/api:latest .
```

### Run

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  unifiedhealth/api:latest
```

## Testing

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration
```

## API Documentation

When running, Swagger UI is available at:

- UI: `http://localhost:8080/api/docs`
- OpenAPI JSON: `http://localhost:8080/api/docs/openapi.json`

## WebSocket Events

### Connection

```javascript
const socket = io("ws://localhost:8080", {
  auth: { token: "jwt-token" },
});
```

### Events

| Event                | Direction       | Description                |
| -------------------- | --------------- | -------------------------- |
| `appointment:update` | Server → Client | Appointment status changed |
| `message:new`        | Bidirectional   | New chat message           |
| `notification`       | Server → Client | System notification        |

## Health Checks

### Liveness (`/health`)

Returns `200 OK` if the process is running.

### Readiness (`/ready`)

Returns `200 OK` only if:

- Database connection is established
- All required services are available

## Security Considerations

- All endpoints require JWT authentication (except health checks)
- Rate limiting: 100 requests/minute per IP
- CORS configured per environment
- Helmet.js for security headers
- Input validation on all endpoints

## Monitoring

### Logs

Structured JSON logging via Winston:

- `info`: Normal operations
- `warn`: Potential issues
- `error`: Errors and exceptions

### Metrics

Prometheus-compatible metrics available at `/metrics`:

- Request duration histogram
- Active connections gauge
- Error rate counter

## Access Control

| Team   | Access Level                |
| ------ | --------------------------- |
| NetOps | Network configuration       |
| SecOps | Audit logs, security events |
| AppOps | Logs, restart, scaling      |
| DevOps | Full administrative access  |

## Related Documentation

- [API Reference](../../docs/api/ENDPOINTS.md)
- [Authentication](../../docs/api/AUTHENTICATION.md)
- [Database Schema](../../docs/database/SCHEMA.md)
- [Deployment Guide](../../docs/deployment/PRODUCTION.md)

## Contact

- **Service Owner**: Backend Team
- **Slack**: #backend-api
- **Email**: api-team@unifiedhealth.io
