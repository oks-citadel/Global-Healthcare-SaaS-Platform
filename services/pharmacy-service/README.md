# Unified Health Pharmacy Service

## Overview

The Pharmacy Service manages e-prescriptions, medication dispensing, and pharmacy network integration for the Unified Health platform.

## Technical Stack

| Component | Technology                          |
| --------- | ----------------------------------- |
| Runtime   | Node.js 20+                         |
| Framework | Express.js (TypeScript)             |
| Database  | PostgreSQL (via Prisma)             |
| Queue     | Redis (for prescription processing) |

## Port Configuration

| Environment | Port |
| ----------- | ---- |
| Development | 3004 |
| Production  | 8083 |

## Directory Structure

```
services/pharmacy-service/
├── src/
│   ├── middleware/
│   │   └── extractUser.ts      # User context from gateway
│   ├── routes/
│   │   ├── prescriptions.ts    # Prescription endpoints
│   │   └── pharmacies.ts       # Pharmacy network endpoints
│   ├── services/               # Business logic
│   └── index.ts
├── Dockerfile
└── package.json
```

## API Endpoints

### Health

| Endpoint  | Method | Description          |
| --------- | ------ | -------------------- |
| `/health` | GET    | Service health check |

### Prescriptions (`/prescriptions`)

| Endpoint        | Method | Description                  |
| --------------- | ------ | ---------------------------- |
| `/`             | GET    | List prescriptions           |
| `/`             | POST   | Create prescription          |
| `/:id`          | GET    | Get prescription details     |
| `/:id/refill`   | POST   | Request refill               |
| `/:id/cancel`   | POST   | Cancel prescription          |
| `/:id/status`   | GET    | Check prescription status    |
| `/:id/transfer` | POST   | Transfer to another pharmacy |

### Pharmacies (`/pharmacies`)

| Endpoint         | Method | Description                   |
| ---------------- | ------ | ----------------------------- |
| `/`              | GET    | List pharmacies               |
| `/search`        | GET    | Search pharmacies by location |
| `/:id`           | GET    | Get pharmacy details          |
| `/:id/inventory` | GET    | Check medication availability |

## Prescription Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRESCRIPTION WORKFLOW                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Provider Creates Rx                                             │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  PENDING    │───▶│  APPROVED   │───▶│  PROCESSING │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                                     │                  │
│         ▼                                     ▼                  │
│  ┌─────────────┐                      ┌─────────────┐            │
│  │  REJECTED   │                      │  DISPENSED  │            │
│  └─────────────┘                      └─────────────┘            │
│                                              │                   │
│                                              ▼                   │
│                                       ┌─────────────┐            │
│                                       │  DELIVERED  │            │
│                                       └─────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

## Environment Variables

```bash
# Required
NODE_ENV=production
PORT=8083
DATABASE_URL=postgresql://user:password@host:5432/db?schema=pharmacy

# Pharmacy Network Integration
PHARMACY_API_KEY=...
PHARMACY_API_URL=https://pharmacy-network.com/api

# Notifications
NOTIFICATION_SERVICE_URL=http://api:8080/api/v1/notifications

# Optional
CORS_ORIGIN=https://app.unifiedhealth.io
```

## Database Access

### Schema: `pharmacy`

| Table                | Description               |
| -------------------- | ------------------------- |
| `prescriptions`      | Prescription records      |
| `prescription_items` | Line items (medications)  |
| `pharmacies`         | Pharmacy network registry |
| `pharmacy_inventory` | Medication availability   |
| `refill_requests`    | Refill request tracking   |

### Cross-Schema Access

| Schema   | Access Level                  |
| -------- | ----------------------------- |
| pharmacy | Full                          |
| clinical | Read (patient, provider info) |
| public   | Read                          |

### Database Role

```sql
CREATE ROLE role_pharmacy WITH LOGIN PASSWORD 'secure_password';
GRANT USAGE ON SCHEMA pharmacy TO role_pharmacy;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA pharmacy TO role_pharmacy;
GRANT SELECT ON clinical.patients TO role_pharmacy;
GRANT SELECT ON clinical.providers TO role_pharmacy;
```

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm

### Development

```bash
# Install dependencies
pnpm install

# Start service
pnpm dev
```

### Docker

```bash
# Build
docker build -t unifiedhealth/pharmacy-service:latest .

# Run
docker run -p 8083:8083 \
  -e DATABASE_URL="postgresql://..." \
  unifiedhealth/pharmacy-service:latest
```

## Security & Compliance

### DEA Compliance (Controlled Substances)

- EPCS (Electronic Prescribing for Controlled Substances) compliant
- Two-factor authentication for Schedule II-V
- Audit trail for all prescription activities

### HIPAA Requirements

- All PHI encrypted at rest and in transit
- Audit logging for all data access
- Role-based access control

## Access Control

| Team   | Access Level               |
| ------ | -------------------------- |
| NetOps | Network configuration      |
| SecOps | Read (audit, compliance)   |
| AppOps | Manage, scale, configure   |
| DevOps | Full administrative access |

### User Roles

| Role       | Permissions                             |
| ---------- | --------------------------------------- |
| Patient    | View own prescriptions, request refills |
| Provider   | Create/cancel prescriptions             |
| Pharmacist | Dispense, update status                 |
| Admin      | Full access                             |

## Integration Points

### External Systems

| System                 | Integration |
| ---------------------- | ----------- |
| Pharmacy Network       | REST API    |
| Drug Interaction DB    | REST API    |
| Insurance Verification | REST API    |
| Delivery Services      | Webhook     |

### Internal Services

| Service              | Purpose                 |
| -------------------- | ----------------------- |
| api                  | Patient/provider lookup |
| auth-service         | Authentication          |
| notification-service | Alerts                  |

## Monitoring

### Metrics

| Metric                    | Description             |
| ------------------------- | ----------------------- |
| `prescriptions_created`   | New prescriptions count |
| `prescriptions_dispensed` | Dispensed count         |
| `refill_requests`         | Refill request count    |
| `processing_time_seconds` | Average processing time |

### Alerts

| Alert               | Threshold       |
| ------------------- | --------------- |
| High error rate     | >1% of requests |
| Slow processing     | >30s average    |
| Pending queue depth | >100 items      |

## Testing

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage
```

## Related Documentation

- [Pharmacy Integration Guide](../../docs/integrations/PHARMACY.md)
- [DEA Compliance](../../docs/compliance/DEA.md)
- [Access Control Matrix](../../docs/ACCESS_CONTROL_MATRIX.md)

## Contact

- **Service Owner**: Pharmacy Integration Team
- **Slack**: #pharmacy-service
- **Email**: pharmacy@unifiedhealth.io
