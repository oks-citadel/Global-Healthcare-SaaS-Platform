# UnifiedHealth API Gateway

## Overview

The API Gateway is the single entry point for all client applications. It handles request routing, rate limiting, authentication verification, and service discovery.

## Technical Stack

| Component     | Technology            |
| ------------- | --------------------- |
| Runtime       | Node.js 20+           |
| Framework     | Express.js            |
| Rate Limiting | express-rate-limit    |
| Proxy         | http-proxy-middleware |

## Port Configuration

| Environment | Port |
| ----------- | ---- |
| Development | 3000 |
| Production  | 8000 |

## Directory Structure

```
services/api-gateway/
├── src/
│   ├── config/
│   │   └── services.ts    # Service registry
│   ├── middleware/
│   │   ├── auth.ts        # JWT validation
│   │   ├── rateLimit.ts   # Rate limiting
│   │   └── proxy.ts       # Service proxy
│   ├── routes/
│   │   └── index.ts       # Route definitions
│   └── index.ts           # Application entry
├── Dockerfile
└── package.json
```

## Service Registry

The gateway routes requests to the following backend services:

| Route                  | Service               | Port | Description        |
| ---------------------- | --------------------- | ---- | ------------------ |
| `/api/auth/*`          | auth-service          | 8081 | Authentication     |
| `/api/patients/*`      | api                   | 8080 | Patient management |
| `/api/appointments/*`  | api                   | 8080 | Scheduling         |
| `/api/telehealth/*`    | telehealth-service    | 8082 | Video calls        |
| `/api/pharmacy/*`      | pharmacy-service      | 8083 | Prescriptions      |
| `/api/laboratory/*`    | laboratory-service    | 8084 | Lab orders         |
| `/api/mental-health/*` | mental-health-service | 8085 | Mental health      |
| `/api/chronic-care/*`  | chronic-care-service  | 8086 | Care plans         |
| `/api/imaging/*`       | imaging-service       | 8087 | Medical imaging    |

## Endpoints

### Gateway Endpoints

| Endpoint    | Method | Description              |
| ----------- | ------ | ------------------------ |
| `/health`   | GET    | Gateway health check     |
| `/services` | GET    | List registered services |

### Proxied Routes

All requests to `/api/*` are proxied to backend services based on the routing table.

## Environment Variables

```bash
# Required
NODE_ENV=production
PORT=8000

# Service URLs
API_SERVICE_URL=http://api:8080
AUTH_SERVICE_URL=http://auth-service:8081
TELEHEALTH_SERVICE_URL=http://telehealth-service:8082
PHARMACY_SERVICE_URL=http://pharmacy-service:8083
LABORATORY_SERVICE_URL=http://laboratory-service:8084
MENTAL_HEALTH_SERVICE_URL=http://mental-health-service:8085
CHRONIC_CARE_SERVICE_URL=http://chronic-care-service:8086
IMAGING_SERVICE_URL=http://imaging-service:8087

# Security
JWT_PUBLIC_KEY=...
CORS_ORIGIN=https://app.unifiedhealth.io

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## Rate Limiting

| Client Type        | Window | Max Requests |
| ------------------ | ------ | ------------ |
| Anonymous          | 1 min  | 20           |
| Authenticated      | 1 min  | 100          |
| Service-to-Service | 1 min  | 1000         |

## Request Flow

```
Client Request
     │
     ▼
┌─────────────────┐
│   API Gateway   │
├─────────────────┤
│ 1. Rate Limit   │
│ 2. CORS Check   │
│ 3. JWT Verify   │
│ 4. Route Match  │
│ 5. Proxy        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend Service │
└─────────────────┘
```

## Running Locally

### Prerequisites

- Node.js 20+
- pnpm
- Backend services running

### Development

```bash
# Install dependencies
pnpm install

# Start in development mode
pnpm dev
```

### Docker

```bash
# Build
docker build -t unifiedhealth/api-gateway:latest .

# Run
docker run -p 8000:8000 \
  -e API_SERVICE_URL="http://api:8080" \
  -e AUTH_SERVICE_URL="http://auth-service:8081" \
  unifiedhealth/api-gateway:latest
```

## Headers

### Request Headers Added

| Header            | Description                      |
| ----------------- | -------------------------------- |
| `X-Request-ID`    | Unique request identifier        |
| `X-User-ID`       | Authenticated user ID (from JWT) |
| `X-User-Role`     | User role (from JWT)             |
| `X-Forwarded-For` | Original client IP               |

### Response Headers

| Header                  | Description            |
| ----------------------- | ---------------------- |
| `X-Request-ID`          | Echo of request ID     |
| `X-Response-Time`       | Request duration in ms |
| `X-RateLimit-Remaining` | Remaining requests     |

## Security

- TLS termination at gateway level
- JWT validation before proxying
- Helmet.js security headers
- CORS enforcement
- Request size limits (10MB)

## Monitoring

### Metrics

- Request count by service
- Response time percentiles
- Error rate by service
- Rate limit hits

### Health Check

The `/health` endpoint returns:

```json
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2024-12-23T00:00:00Z"
}
```

## Kubernetes Deployment

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8000
  selector:
    app: api-gateway
```

## Access Control

| Team   | Access Level                   |
| ------ | ------------------------------ |
| NetOps | Full (routing, load balancing) |
| SecOps | Monitor, rate limit config     |
| AppOps | Configure service routes       |
| DevOps | Full administrative access     |

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**: Backend service is down
2. **429 Too Many Requests**: Rate limit exceeded
3. **502 Bad Gateway**: Service URL misconfigured
4. **401 Unauthorized**: Invalid or expired JWT

### Debug Mode

```bash
DEBUG=gateway:* pnpm dev
```

## Related Documentation

- [Service Architecture](../../docs/architecture/SERVICES.md)
- [Authentication Flow](../../docs/api/AUTHENTICATION.md)
- [Deployment Guide](../../docs/deployment/PRODUCTION.md)

## Contact

- **Service Owner**: Platform Team
- **Slack**: #platform-gateway
- **Email**: gateway-team@unifiedhealth.io
