# Port Allocation

This document defines the port allocation for all services and applications in the UnifiedHealth Platform.

## Frontend Applications

| Application          | Port | Description                     |
| -------------------- | ---- | ------------------------------- |
| Web (Patient Portal) | 3000 | Patient-facing web application  |
| Admin Dashboard      | 3001 | System administration interface |
| Provider Portal      | 3002 | Healthcare provider interface   |
| Kiosk                | 3004 | Hospital lobby check-in kiosk   |
| Mobile               | N/A  | React Native (iOS/Android)      |

## Backend Services

| Service               | Port | Description                           |
| --------------------- | ---- | ------------------------------------- |
| API Gateway           | 4000 | Central API routing and rate limiting |
| Auth Service          | 4001 | Authentication and authorization      |
| API (Main)            | 4002 | Core REST API                         |
| Telehealth Service    | 4003 | Video consultations                   |
| Mental Health Service | 4004 | Therapy and assessments               |
| Chronic Care Service  | 4005 | Remote patient monitoring             |
| Notification Service  | 3006 | Email, SMS, push notifications        |
| Pharmacy Service      | 4007 | E-prescriptions                       |
| Laboratory Service    | 4008 | Lab orders and results                |
| Imaging Service       | 4009 | DICOM radiology                       |

## Infrastructure Services

| Service       | Port | Description           |
| ------------- | ---- | --------------------- |
| PostgreSQL    | 5432 | Primary database      |
| Redis         | 6379 | Caching and sessions  |
| Elasticsearch | 9200 | Search and analytics  |
| Kafka         | 9092 | Event streaming       |
| Prometheus    | 9090 | Metrics collection    |
| Grafana       | 3100 | Monitoring dashboards |

## Port Ranges

| Range     | Purpose                       |
| --------- | ----------------------------- |
| 3000-3099 | Frontend applications         |
| 4000-4099 | Backend services              |
| 5000-5999 | Databases                     |
| 6000-6999 | Cache and messaging           |
| 9000-9999 | Infrastructure and monitoring |

## Development vs Production

In development, services run on their designated ports directly. In production (Kubernetes), services communicate via service discovery and ingress controllers, so port conflicts are not an issue.

## Updating Ports

When adding a new service:

1. Check this document for available ports
2. Update both the service's `package.json` and this document
3. Update any docker-compose files that reference the service
4. Update Kubernetes manifests if applicable
