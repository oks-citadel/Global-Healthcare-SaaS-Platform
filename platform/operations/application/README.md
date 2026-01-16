# Application Operations

## Overview

Application operations manage the deployment, scaling, monitoring, and lifecycle of healthcare microservices across global regions.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitOps Control Plane                         │
│                        (ArgoCD / Flux)                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   Americas    │       │    Europe     │       │     APAC      │
│   Cluster     │       │    Cluster    │       │    Cluster    │
│               │       │               │       │               │
│ ┌───────────┐ │       │ ┌───────────┐ │       │ ┌───────────┐ │
│ │ Namespace │ │       │ │ Namespace │ │       │ │ Namespace │ │
│ │  per-     │ │       │ │  per-     │ │       │ │  per-     │ │
│ │  tenant   │ │       │ │  tenant   │ │       │ │  tenant   │ │
│ └───────────┘ │       │ └───────────┘ │       │ └───────────┘ │
│               │       │               │       │               │
│ ┌───────────┐ │       │ ┌───────────┐ │       │ ┌───────────┐ │
│ │  HPA/VPA  │ │       │ │  HPA/VPA  │ │       │ │  HPA/VPA  │ │
│ │ Autoscale │ │       │ │ Autoscale │ │       │ │ Autoscale │ │
│ └───────────┘ │       │ └───────────┘ │       │ └───────────┘ │
└───────────────┘       └───────────────┘       └───────────────┘
```

## Microservices Deployment Model

### Service Categories

```yaml
# service-catalog.yaml
services:
  # Gateway Layer
  gateway:
    - name: api-gateway
      replicas: 3
      resources:
        cpu: 500m-2000m
        memory: 512Mi-2Gi
      scaling: horizontal
      critical: true

  # Core Services
  core:
    - name: auth-service
      replicas: 3
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal
      critical: true

    - name: patient-service
      replicas: 3
      resources:
        cpu: 500m-2000m
        memory: 512Mi-2Gi
      scaling: horizontal
      critical: true

    - name: fhir-server
      replicas: 3
      resources:
        cpu: 1000m-4000m
        memory: 2Gi-8Gi
      scaling: horizontal
      critical: true

  # Domain Services
  domain:
    - name: appointment-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: encounter-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: telehealth-service
      replicas: 3
      resources:
        cpu: 500m-2000m
        memory: 512Mi-2Gi
      scaling: horizontal

    - name: pharmacy-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: laboratory-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: imaging-service
      replicas: 2
      resources:
        cpu: 1000m-4000m
        memory: 2Gi-8Gi
      scaling: horizontal

    - name: mental-health-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: chronic-care-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

  # Integration Services
  integration:
    - name: ehr-adapter-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: hie-adapter-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: terminology-service
      replicas: 2
      resources:
        cpu: 500m-2000m
        memory: 1Gi-4Gi
      scaling: horizontal

    - name: notification-service
      replicas: 2
      resources:
        cpu: 250m-500m
        memory: 256Mi-512Mi
      scaling: horizontal

  # Support Services
  support:
    - name: billing-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: document-service
      replicas: 2
      resources:
        cpu: 250m-1000m
        memory: 256Mi-1Gi
      scaling: horizontal

    - name: analytics-service
      replicas: 2
      resources:
        cpu: 500m-2000m
        memory: 512Mi-2Gi
      scaling: horizontal
```

### Deployment Strategy

```yaml
# deployment-strategy.yaml
deployment:
  # Blue-Green for critical services
  critical_services:
    strategy: blue-green
    services:
      - api-gateway
      - auth-service
      - patient-service
      - fhir-server
    config:
      switch_threshold: 100% # All health checks pass
      rollback_timeout: 5m
      preserve_old: 1h

  # Canary for domain services
  domain_services:
    strategy: canary
    config:
      stages:
        - weight: 5
          duration: 5m
          metrics_threshold:
            error_rate: 0.1%
            latency_p99: 500ms

        - weight: 25
          duration: 10m
          metrics_threshold:
            error_rate: 0.5%
            latency_p99: 500ms

        - weight: 50
          duration: 15m
          metrics_threshold:
            error_rate: 1%
            latency_p99: 750ms

        - weight: 100
          duration: 0
      rollback_on_failure: true

  # Rolling update for support services
  support_services:
    strategy: rolling
    config:
      max_unavailable: 25%
      max_surge: 25%
      progress_deadline: 10m
```

### Auto-Scaling Configuration

```yaml
# autoscaling.yaml
horizontal_pod_autoscaler:
  api_gateway:
    min_replicas: 3
    max_replicas: 20
    metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 70
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 80
      - type: External
        external:
          metric:
            name: requests_per_second
          target:
            type: AverageValue
            averageValue: "1000"

  fhir_server:
    min_replicas: 3
    max_replicas: 15
    metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 60
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 70

vertical_pod_autoscaler:
  enabled: true
  update_mode: "Auto"
  resource_policy:
    container_policies:
      - container_name: "*"
        min_allowed:
          cpu: 100m
          memory: 128Mi
        max_allowed:
          cpu: 8000m
          memory: 16Gi
        controlled_resources: ["cpu", "memory"]

cluster_autoscaler:
  enabled: true
  min_nodes: 3
  max_nodes: 50
  scale_down_delay: 10m
  scale_down_utilization_threshold: 0.5
```

## Health Monitoring

```yaml
# health-checks.yaml
probes:
  liveness:
    http_get:
      path: /health/live
      port: 8080
    initial_delay_seconds: 30
    period_seconds: 10
    timeout_seconds: 5
    failure_threshold: 3

  readiness:
    http_get:
      path: /health/ready
      port: 8080
    initial_delay_seconds: 5
    period_seconds: 5
    timeout_seconds: 3
    failure_threshold: 3

  startup:
    http_get:
      path: /health/startup
      port: 8080
    initial_delay_seconds: 0
    period_seconds: 10
    timeout_seconds: 3
    failure_threshold: 30

health_endpoints:
  /health/live:
    checks:
      - process_running
      - memory_not_exhausted

  /health/ready:
    checks:
      - database_connected
      - cache_connected
      - dependent_services_reachable

  /health/startup:
    checks:
      - configuration_loaded
      - migrations_complete
      - warmup_complete
```

## Configuration Management

```yaml
# config-management.yaml
configuration:
  sources:
    - type: configmap
      name: app-config
      mount_path: /config

    - type: secret
      name: app-secrets
      mount_path: /secrets

    - type: vault
      path: healthcare/kv/app
      refresh_interval: 5m

  environment_hierarchy:
    - base # Common across all environments
    - environment # dev, staging, prod
    - region # americas, europe, apac
    - country # us, de, ke, etc.
    - tenant # Per-tenant overrides

  feature_flags:
    provider: launchdarkly
    cache_ttl: 30s
    fallback_enabled: true

  dynamic_config:
    enabled: true
    poll_interval: 30s
    watchers:
      - path: /config/features
        on_change: reload_features
      - path: /config/limits
        on_change: update_limits
```

## Logging Configuration

```yaml
# logging.yaml
logging:
  format: json
  level: info

  structure:
    timestamp: "@timestamp"
    level: "level"
    message: "message"
    service: "service.name"
    version: "service.version"
    trace_id: "trace.id"
    span_id: "span.id"
    tenant_id: "tenant.id"
    user_id: "user.id"

  phi_redaction:
    enabled: true
    fields:
      - "*.ssn"
      - "*.dob"
      - "*.name"
      - "*.email"
      - "*.phone"
      - "*.address"
      - "*.mrn"
      - "patient.*"
    replacement: "[REDACTED]"

  output:
    stdout:
      enabled: true
      format: json

    file:
      enabled: false # Use stdout for containers

    remote:
      enabled: true
      type: fluentbit
      endpoint: fluentbit.logging.svc.cluster.local:24224

  sampling:
    enabled: true
    rate: 0.1 # 10% of debug logs
    always_log:
      - level: error
      - level: warn
      - contains: "PHI_ACCESS"
```

## Service Mesh Integration

```yaml
# service-mesh.yaml
istio:
  injection: enabled

  traffic_management:
    timeout: 30s
    retry:
      attempts: 3
      per_try_timeout: 10s
      retry_on: "5xx,reset,connect-failure,retriable-4xx"

    circuit_breaker:
      consecutive_errors: 5
      interval: 30s
      base_ejection_time: 30s
      max_ejection_percent: 50

  observability:
    tracing:
      enabled: true
      sampling: 100 # 100% for healthcare audit
      provider: jaeger

    metrics:
      enabled: true
      merge_metrics: true

    access_logging:
      enabled: true
      format: json
```
