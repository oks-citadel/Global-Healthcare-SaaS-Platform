# Networking Operations

## Overview

Networking operations manage all network-level infrastructure for global healthcare data exchange, ensuring compliant routing, low latency, and high availability.

## Architecture

```
                         ┌─────────────────────────────┐
                         │    GLOBAL DNS (GeoDNS)      │
                         │    api.unifiedhealth.io     │
                         └─────────────┬───────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  AMERICAS EDGE    │    │   EUROPE EDGE     │    │   APAC EDGE       │
│  (Cloudflare)     │    │   (Cloudflare)    │    │   (Cloudflare)    │
└─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
          │                        │                        │
          ▼                        ▼                        ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   US-EAST-1       │    │   EU-WEST-1       │    │   AP-SOUTHEAST-1  │
│   Azure Region    │    │   Azure Region    │    │   Azure Region    │
│                   │    │                   │    │                   │
│  ┌─────────────┐  │    │  ┌─────────────┐  │    │  ┌─────────────┐  │
│  │  Ingress    │  │    │  │  Ingress    │  │    │  │  Ingress    │  │
│  │  Gateway    │  │    │  │  Gateway    │  │    │  │  Gateway    │  │
│  └──────┬──────┘  │    │  └──────┬──────┘  │    │  └──────┬──────┘  │
│         │         │    │         │         │    │         │         │
│  ┌──────▼──────┐  │    │  ┌──────▼──────┐  │    │  ┌──────▼──────┐  │
│  │  Service    │  │    │  │  Service    │  │    │  │  Service    │  │
│  │    Mesh     │  │    │  │    Mesh     │  │    │  │    Mesh     │  │
│  └─────────────┘  │    │  └─────────────┘  │    │  └─────────────┘  │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

## Components

### 1. Global Load Balancer

**Purpose**: Intelligent traffic distribution based on geography and compliance

```yaml
# geo-routing-config.yaml
routing:
  default_region: us-east

  rules:
    - name: eu-gdpr-routing
      match:
        countries:
          [
            DE,
            FR,
            IT,
            ES,
            NL,
            BE,
            AT,
            PL,
            SE,
            DK,
            FI,
            IE,
            PT,
            GR,
            CZ,
            HU,
            RO,
            BG,
            SK,
            SI,
            HR,
            EE,
            LV,
            LT,
            LU,
            CY,
            MT,
          ]
      action:
        route_to: eu-west
        reason: "GDPR data residency"

    - name: uk-routing
      match:
        countries: [GB]
      action:
        route_to: eu-west # Or uk-south when available
        reason: "UK Data Protection Act"

    - name: mena-routing
      match:
        countries: [AE, SA, KW, QA, BH, OM, EG, JO]
      action:
        route_to: uae-north
        reason: "MENA data residency"

    - name: apac-routing
      match:
        countries: [AU, NZ, SG, MY, TH, ID, PH, VN, JP, KR, IN]
      action:
        route_to: ap-southeast
        reason: "APAC data residency"

    - name: africa-routing
      match:
        countries: [ZA, KE, NG, GH, EG, MA, TN, UG, TZ, RW]
      action:
        route_to: africa-south
        reason: "Africa data residency"
```

### 2. Ingress Gateway Configuration

**Per-Region Ingress with TLS Termination**

```yaml
# ingress-config.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: healthcare-api-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - "api.unifiedhealth.io"
        - "api-us.unifiedhealth.io"
      secretName: healthcare-tls
  rules:
    - host: "api.unifiedhealth.io"
      http:
        paths:
          - path: /api/v1
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 443
```

### 3. Service Mesh (Istio)

**mTLS and Traffic Management**

```yaml
# mesh-config.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: healthcare
spec:
  mtls:
    mode: STRICT

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: healthcare-services
spec:
  host: "*.healthcare.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

### 4. Network Policies

**Tenant Isolation**

```yaml
# network-policies.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-isolation
  namespace: healthcare
spec:
  podSelector:
    matchLabels:
      app: healthcare-service
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              network-policy: healthcare
        - podSelector:
            matchLabels:
              role: api-gateway
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              network-policy: healthcare
    - to:
        - ipBlock:
            cidr: 10.0.0.0/8 # Internal services
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0 # External (controlled via policies)
      ports:
        - protocol: TCP
          port: 443
```

## External Connectivity

### VPN/PrivateLink for EHR Systems

```yaml
# external-connectivity.yaml
external_connections:
  - name: epic-fhir-endpoint
    type: private_link
    provider: azure
    target: epic.fhir.endpoint.com
    region: us-east
    encryption: tls-1.3

  - name: cerner-fhir-endpoint
    type: private_link
    provider: azure
    target: cerner.fhir.endpoint.com
    region: us-east
    encryption: tls-1.3

  - name: gematik-ti
    type: site-to-site-vpn
    provider: azure
    target: ti.gematik.de
    region: eu-west
    encryption: ipsec-ikev2

  - name: dhis2-kenya
    type: private_link
    provider: azure
    target: dhis2.health.go.ke
    region: africa-south
    encryption: tls-1.3
```

## DNS Configuration

```yaml
# dns-config.yaml
zones:
  - name: unifiedhealth.io
    records:
      - name: api
        type: CNAME
        value: global-lb.unifiedhealth.io
        health_check: true

      - name: api-us
        type: A
        value: us-east-lb.unifiedhealth.io
        region: americas

      - name: api-eu
        type: A
        value: eu-west-lb.unifiedhealth.io
        region: europe

      - name: api-apac
        type: A
        value: ap-southeast-lb.unifiedhealth.io
        region: asia-pacific

health_checks:
  - name: api-health
    path: /health
    interval: 30s
    timeout: 10s
    healthy_threshold: 2
    unhealthy_threshold: 3
```

## Monitoring

### Key Metrics

- Request latency (p50, p95, p99) per region
- Error rates by status code
- Bandwidth utilization
- Connection pool saturation
- DNS resolution time
- TLS handshake time

### Alerts

```yaml
alerts:
  - name: high-latency
    condition: p99_latency > 500ms
    duration: 5m
    severity: warning

  - name: error-spike
    condition: error_rate > 5%
    duration: 2m
    severity: critical

  - name: region-down
    condition: health_check_failures > 3
    duration: 1m
    severity: critical
    action: failover_to_backup_region
```
