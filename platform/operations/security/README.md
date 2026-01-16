# Security Operations

## Overview

Security operations implement defense-in-depth for healthcare data protection, ensuring HIPAA, GDPR, and regional compliance across all platform services.

## Security Architecture

```
                    ┌─────────────────────────────────────┐
                    │          WAF / DDoS Shield          │
                    │         (Layer 7 Protection)        │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │        API Gateway Security          │
                    │  (Rate Limiting, Auth, Validation)   │
                    └──────────────────┬──────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          │                          │
            ▼                          ▼                          ▼
    ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
    │     IAM       │          │  Encryption   │          │    Audit      │
    │   Service     │          │   Service     │          │   Logging     │
    │               │          │               │          │               │
    │ • OAuth 2.0   │          │ • KMS         │          │ • Real-time   │
    │ • OIDC        │          │ • Envelope    │          │ • Immutable   │
    │ • SAML 2.0    │          │ • HSM-backed  │          │ • Tamper-proof│
    │ • MFA         │          │               │          │               │
    └───────────────┘          └───────────────┘          └───────────────┘
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │         Secret Management            │
                    │          (HashiCorp Vault)           │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │            SIEM / SOAR              │
                    │     (Threat Detection & Response)   │
                    └─────────────────────────────────────┘
```

## Components

### 1. Identity & Access Management

#### OAuth 2.0 / OIDC Configuration

```yaml
# iam-config.yaml
identity_providers:
  primary:
    type: oidc
    issuer: https://auth.unifiedhealth.io
    algorithms: [RS256, ES256]
    token_lifetime:
      access: 15m
      refresh: 24h
      id_token: 1h

  enterprise_sso:
    - type: saml2
      name: enterprise-okta
      metadata_url: https://company.okta.com/metadata
      attribute_mapping:
        email: "saml:Email"
        roles: "saml:Roles"
        tenant: "saml:TenantId"

    - type: oidc
      name: enterprise-azure-ad
      discovery_url: https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration

mfa:
  required: true
  methods:
    - totp
    - webauthn
    - sms # Only for non-PHI access
  grace_period: 0 # No grace period for healthcare
```

#### Role-Based Access Control

```yaml
# rbac-policies.yaml
roles:
  - name: patient
    description: Patient self-service access
    permissions:
      - resource: patient/*
        actions: [read]
        scope: self
      - resource: appointments/*
        actions: [read, create, cancel]
        scope: self
      - resource: documents/*
        actions: [read, upload]
        scope: self

  - name: provider
    description: Healthcare provider access
    permissions:
      - resource: patient/*
        actions: [read, update]
        scope: assigned_patients
      - resource: encounters/*
        actions: [read, create, update]
        scope: assigned_patients
      - resource: prescriptions/*
        actions: [create, update]
        scope: assigned_patients
      - resource: lab-orders/*
        actions: [create, read]
        scope: assigned_patients

  - name: admin
    description: System administrator
    permissions:
      - resource: users/*
        actions: [read, create, update, delete]
        scope: tenant
      - resource: audit/*
        actions: [read]
        scope: tenant
      - resource: settings/*
        actions: [read, update]
        scope: tenant

  - name: compliance_officer
    description: Compliance and audit access
    permissions:
      - resource: audit/*
        actions: [read, export]
        scope: tenant
      - resource: consent/*
        actions: [read]
        scope: tenant
      - resource: data-access-reports/*
        actions: [read, generate]
        scope: tenant
```

### 2. Web Application Firewall

```yaml
# waf-rules.yaml
waf_configuration:
  mode: block

  managed_rules:
    - name: OWASP-CRS
      version: "3.3.2"
      enabled: true
      exceptions:
        - rule_id: 942200 # SQL injection false positive for medical codes
          path: /api/v1/fhir/*

    - name: Healthcare-Specific
      rules:
        - name: block-phi-in-url
          pattern: "(ssn|dob|mrn)=\\d+"
          action: block
          log: true

        - name: block-sensitive-headers
          headers:
            - X-Patient-SSN
            - X-Patient-MRN
          action: block

  rate_limiting:
    - name: auth-endpoints
      path: /api/v1/auth/*
      requests: 10
      window: 1m
      action: block

    - name: api-general
      path: /api/v1/*
      requests: 1000
      window: 1m
      action: throttle

    - name: bulk-export
      path: /api/v1/fhir/$export
      requests: 5
      window: 1h
      action: block

  geo_blocking:
    enabled: true
    mode: whitelist
    allowed_countries: ${ALLOWED_COUNTRIES} # Country-specific deployment

  bot_protection:
    enabled: true
    challenge_suspicious: true
    block_known_bad: true
```

### 3. Encryption Management

```yaml
# encryption-config.yaml
encryption:
  at_rest:
    algorithm: AES-256-GCM
    key_management: azure-keyvault
    key_rotation: 90d
    envelope_encryption: true

    database:
      type: TDE # Transparent Data Encryption
      key_source: customer-managed

    storage:
      type: SSE
      key_source: customer-managed

    backups:
      type: client-side
      key_source: customer-managed

  in_transit:
    minimum_tls: "1.3"
    cipher_suites:
      - TLS_AES_256_GCM_SHA384
      - TLS_CHACHA20_POLY1305_SHA256
    certificate_management: cert-manager
    mtls_internal: true

  key_hierarchy:
    master_key:
      location: HSM
      type: RSA-4096
      usage: wrap-unwrap

    data_encryption_keys:
      type: AES-256
      rotation: 30d
      per_tenant: true

    field_encryption_keys:
      type: AES-256
      per_field_type: true
      rotation: 7d

# Field-level encryption for PHI
field_encryption:
  enabled: true
  fields:
    - path: patient.ssn
      algorithm: AES-256-GCM
      searchable: false
    - path: patient.dob
      algorithm: AES-256-GCM
      searchable: true # Range queries allowed
    - path: patient.name
      algorithm: AES-256-GCM
      searchable: true # Encrypted search enabled
    - path: observation.value
      algorithm: AES-256-GCM
      searchable: false
```

### 4. Secret Management

```yaml
# vault-config.yaml
vault:
  backend: hashicorp-vault

  secrets_engines:
    - path: healthcare/kv
      type: kv-v2
      description: Application secrets

    - path: healthcare/database
      type: database
      description: Dynamic database credentials

    - path: healthcare/pki
      type: pki
      description: Internal PKI

  auth_methods:
    - type: kubernetes
      path: auth/kubernetes
      config:
        kubernetes_host: https://kubernetes.default.svc

    - type: oidc
      path: auth/oidc
      config:
        oidc_discovery_url: https://auth.unifiedhealth.io

  policies:
    - name: api-service
      rules: |
        path "healthcare/kv/data/api/*" {
          capabilities = ["read"]
        }
        path "healthcare/database/creds/api-readonly" {
          capabilities = ["read"]
        }

    - name: encryption-service
      rules: |
        path "healthcare/kv/data/encryption/*" {
          capabilities = ["read"]
        }
        path "transit/encrypt/phi-key" {
          capabilities = ["update"]
        }
        path "transit/decrypt/phi-key" {
          capabilities = ["update"]
        }
```

### 5. Audit Logging

```yaml
# audit-config.yaml
audit:
  enabled: true

  events:
    - category: authentication
      events: [login, logout, mfa_challenge, password_reset]
      level: required

    - category: authorization
      events: [access_granted, access_denied, permission_change]
      level: required

    - category: data_access
      events: [read, create, update, delete, export, print]
      level: required

    - category: phi_access
      events: [view, modify, disclose, transmit]
      level: required
      retention_override: 6y # HIPAA requirement

    - category: consent
      events: [grant, revoke, modify]
      level: required

    - category: system
      events: [config_change, service_start, service_stop]
      level: required

  storage:
    primary:
      type: immutable-blob
      provider: azure
      encryption: customer-managed
      retention: 6y

    siem:
      type: azure-sentinel
      realtime: true

    compliance:
      type: cold-storage
      retention: 10y # GDPR max

  format:
    type: json
    schema: CEF # Common Event Format
    fields:
      - timestamp
      - event_type
      - actor_id
      - actor_type
      - resource_type
      - resource_id
      - action
      - outcome
      - client_ip
      - user_agent
      - correlation_id
      - tenant_id
      - region

  integrity:
    signing: true
    algorithm: ECDSA-P256
    chain: merkle-tree
    verification_interval: 1h
```

### 6. Threat Detection

```yaml
# threat-detection.yaml
siem:
  provider: azure-sentinel

  detection_rules:
    - name: brute-force-attack
      condition: |
        AuthenticationLogs
        | where Result == "Failure"
        | summarize FailureCount = count() by UserPrincipalName, bin(TimeGenerated, 5m)
        | where FailureCount > 10
      severity: high
      response: block_ip_and_alert

    - name: unusual-phi-access
      condition: |
        DataAccessLogs
        | where ResourceType == "Patient"
        | summarize AccessCount = count() by UserId, bin(TimeGenerated, 1h)
        | where AccessCount > 50
      severity: medium
      response: alert_security_team

    - name: after-hours-access
      condition: |
        DataAccessLogs
        | where ResourceType in ("Patient", "Encounter", "Observation")
        | where hourofday(TimeGenerated) < 6 or hourofday(TimeGenerated) > 22
        | where UserRole != "Emergency"
      severity: low
      response: log_for_review

    - name: data-exfiltration
      condition: |
        DataExportLogs
        | where ExportSize > 100MB
        | where not(ExportReason in ("Backup", "Regulatory"))
      severity: critical
      response: block_and_investigate

  automated_response:
    - trigger: critical
      actions:
        - isolate_user
        - notify_security_team
        - create_incident
        - preserve_evidence

    - trigger: high
      actions:
        - notify_security_team
        - create_ticket
        - increase_monitoring
```

## Compliance Mapping

| Requirement           | HIPAA              | GDPR    | Implementation           |
| --------------------- | ------------------ | ------- | ------------------------ |
| Access Control        | §164.312(a)(1)     | Art. 32 | IAM with RBAC/ABAC       |
| Audit Controls        | §164.312(b)        | Art. 30 | Immutable audit logs     |
| Encryption            | §164.312(a)(2)(iv) | Art. 32 | AES-256, TLS 1.3         |
| Integrity             | §164.312(c)(1)     | Art. 32 | Digital signatures       |
| Authentication        | §164.312(d)        | Art. 32 | MFA, strong passwords    |
| Transmission Security | §164.312(e)(1)     | Art. 32 | mTLS, encrypted channels |
