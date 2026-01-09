# Port Allocation

This document defines the authoritative port allocation for all services and applications in the Unified Health Platform. All Dockerfiles and ECS Terraform configurations MUST align with these port assignments.

**Last Updated:** 2026-01-09
**Source of Truth:** This document + `infrastructure/terraform-aws/modules/ecs-fargate/main.tf`

## Backend Services (3000-3015)

| Service                    | Port | Description                           |
| -------------------------- | ---- | ------------------------------------- |
| API Gateway                | 3000 | Central API routing and rate limiting |
| Auth Service               | 3001 | Authentication and authorization      |
| Notification Service       | 3002 | Email, SMS, push notifications        |
| Telehealth Service         | 3003 | Video consultations                   |
| Pharmacy Service           | 3004 | E-prescriptions                       |
| Laboratory Service         | 3005 | Lab orders and results                |
| Imaging Service            | 3006 | DICOM radiology                       |
| Mental Health Service      | 3007 | Therapy and assessments               |
| Chronic Care Service       | 3008 | Remote patient monitoring             |
| Clinical Trials Service    | 3009 | Clinical trial management             |
| Denial Management Service  | 3010 | Claims denial management              |
| Home Health Service        | 3011 | Home healthcare coordination          |
| Population Health Service  | 3012 | Population health analytics           |
| Price Transparency Service | 3013 | Healthcare pricing transparency       |
| Vendor Risk Service        | 3014 | Third-party vendor risk management    |
| Interoperability Service   | 3015 | FHIR R4 interoperability              |

## Frontend Applications (3100-3104)

| Application          | Port | Description                     |
| -------------------- | ---- | ------------------------------- |
| Web (Patient Portal) | 3100 | Patient-facing web application  |
| Admin Dashboard      | 3101 | System administration interface |
| Provider Portal      | 3102 | Healthcare provider interface   |
| Kiosk                | 3103 | Hospital lobby check-in kiosk   |
| Mobile               | 3104 | Mobile app backend (for BFF)    |

## Core API Service

| Service | Port | Description                         |
| ------- | ---- | ----------------------------------- |
| API     | 8080 | Core REST API (Kubernetes standard) |

## Infrastructure Services

| Service       | Port | Description           |
| ------------- | ---- | --------------------- |
| PostgreSQL    | 5432 | Primary database      |
| Redis         | 6379 | Caching and sessions  |
| Elasticsearch | 9200 | Search and analytics  |
| Kafka         | 9092 | Event streaming       |
| Prometheus    | 9090 | Metrics collection    |
| Grafana       | 3200 | Monitoring dashboards |

## Port Ranges

| Range     | Purpose                       |
| --------- | ----------------------------- |
| 3000-3099 | Backend microservices         |
| 3100-3199 | Frontend applications         |
| 3200-3299 | Monitoring tools              |
| 5000-5999 | Databases                     |
| 6000-6999 | Cache and messaging           |
| 8080      | Core API (K8s standard)       |
| 9000-9999 | Infrastructure and monitoring |

## Development vs Production

In development, services run on their designated ports directly. In production (ECS Fargate/Kubernetes), services communicate via:

- AWS ECS: Service discovery and Application Load Balancer
- Kubernetes: Service discovery and ingress controllers

## Updating Ports

When adding a new service:

1. Check this document for the next available port in the appropriate range
2. Update this document first (source of truth)
3. Update the service's Dockerfile with EXPOSE and ENV PORT
4. Update `infrastructure/terraform-aws/modules/ecs-fargate/main.tf` services map
5. Update any docker-compose files that reference the service
6. Update Kubernetes manifests if applicable

## Verification

Run the verification script to ensure all configurations are aligned:

```bash
# From project root
pnpm run verify:ports  # (if available)
# Or manually check:
grep -r "EXPOSE" services/*/Dockerfile
grep -r "port\s*=" infrastructure/terraform-aws/modules/ecs-fargate/main.tf
```
