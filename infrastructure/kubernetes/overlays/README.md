# Kubernetes Overlays - Multi-Region, Multi-Country Architecture

## Overview

This directory contains Kustomize overlays for deploying the Global Healthcare SaaS Platform across multiple regions and countries with appropriate compliance, data residency, and feature configurations.

## Architecture Hierarchy

```
Base Layer (../../base/)
    ↓
Regional Layer (americas/, europe/, africa/)
    ↓
Country Layer (us/, ca/, br/, de/, gb/, za/, ng/, ke/)
```

Each layer inherits and extends the configuration from the layer above it, allowing for:
- **Shared base configuration** across all deployments
- **Regional customization** for geographic areas
- **Country-specific settings** for compliance and features

## Directory Structure

```
overlays/
├── README.md                           # This file
├── COUNTRY-OVERLAYS-SUMMARY.md         # Detailed country overlay documentation
├── COUNTRY-DEPLOYMENT-GUIDE.md         # Quick reference deployment guide
│
├── patches/                            # Reusable patch templates
│   ├── country-configmap-patch.yaml    # Template for country ConfigMaps
│   ├── country-network-policy.yaml     # Template for network isolation
│   └── country-resource-quota.yaml     # Template for resource quotas
│
├── americas/                           # Americas Regional Overlay
│   ├── kustomization.yaml              # Regional base configuration
│   ├── namespace.yaml
│   ├── configmap-patch.yaml
│   ├── patches/
│   ├── us/                             # United States
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   ├── ca/                             # Canada
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   └── br/                             # Brazil
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       └── configmap-patch.yaml
│
├── europe/                             # Europe Regional Overlay
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── configmap-patch.yaml
│   ├── patches/
│   ├── de/                             # Germany (STRICT ISOLATION)
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── configmap-patch.yaml
│   │   ├── network-policy.yaml         # Strict network isolation
│   │   ├── resource-quota.yaml         # Dedicated resources
│   │   └── dedicated-pvc.yaml          # Isolated storage
│   └── gb/                             # United Kingdom
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       └── configmap-patch.yaml
│
├── africa/                             # Africa Regional Overlay
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── configmap-patch.yaml
│   ├── patches/
│   ├── za/                             # South Africa
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   ├── ng/                             # Nigeria
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   └── ke/                             # Kenya
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       └── configmap-patch.yaml
│
├── production/                         # Production environment overlay
└── staging/                            # Staging environment overlay
```

## Supported Countries

### Americas Region (3 countries)
- **🇺🇸 United States (us)** - HIPAA/HITECH compliance
- **🇨🇦 Canada (ca)** - PIPEDA/PHIPA compliance
- **🇧🇷 Brazil (br)** - LGPD compliance

### Europe Region (2 countries)
- **🇩🇪 Germany (de)** - GDPR Strict + BDSG (Isolated deployment)
- **🇬🇧 United Kingdom (gb)** - UK GDPR + DPA 2018

### Africa Region (3 countries)
- **🇿🇦 South Africa (za)** - POPIA compliance
- **🇳🇬 Nigeria (ng)** - NDPR compliance
- **🇰🇪 Kenya (ke)** - DPA 2019 compliance

**Total: 8 countries across 3 regions**

## Quick Start

### Deploy a Country

```bash
# Deploy United States
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/

# Deploy Germany (with strict isolation)
kubectl apply -k infrastructure/kubernetes/overlays/europe/de/

# Deploy Kenya
kubectl apply -k infrastructure/kubernetes/overlays/africa/ke/
```

### Preview Configuration

```bash
# See what will be deployed
kubectl kustomize infrastructure/kubernetes/overlays/americas/ca/

# Check Germany's network policies
kubectl kustomize infrastructure/kubernetes/overlays/europe/de/ | grep -A 30 NetworkPolicy
```

### Verify Deployment

```bash
# Check namespace
kubectl get namespace healthcare-us

# View all resources
kubectl get all -n healthcare-gb

# Check Germany's isolation
kubectl get networkpolicies,resourcequotas,pvc -n healthcare-de
```

## Data Residency Models

### Shared Regional Storage
Most countries use shared regional storage for cost-effectiveness while maintaining compliance:
- **Americas**: US, CA, BR → `us-east-1` / `ca-central-1` / `sa-east-1`
- **Europe**: GB → `eu-west-2`
- **Africa**: ZA, NG, KE → `af-south-1` / `af-west-1` / `af-east-1`

### Isolated Country Storage
**Germany (DE)** requires strict data isolation:
- ✅ No cross-border data transfers
- ✅ Dedicated network policies
- ✅ Dedicated resource quotas
- ✅ Country-specific encryption keys
- ✅ Isolated persistent volumes

## Compliance Matrix

| Country | Compliance Framework | Data Residency | Isolation Level |
|---------|---------------------|----------------|-----------------|
| US      | HIPAA, HITECH       | Regional       | Standard        |
| CA      | PIPEDA, PHIPA       | Regional       | Standard        |
| BR      | LGPD                | Regional       | Standard        |
| **DE**  | **GDPR, BDSG**      | **Country**    | **Strict**      |
| GB      | UK GDPR, DPA 2018   | Regional       | Standard        |
| ZA      | POPIA               | Regional       | Standard        |
| NG      | NDPR                | Regional       | Standard        |
| KE      | DPA 2019            | Regional       | Standard        |

## Key Features by Country

### Healthcare System Types
- **Public Universal**: CA (Medicare), GB (NHS), KE (UHC)
- **Private Insurance**: US (Medicare/Medicaid)
- **Mixed Public-Private**: BR (SUS), ZA (Medical Schemes), NG (NHIS)

### Payment Processors
- **Stripe**: US, CA, GB, DE
- **MercadoPago**: BR (PIX, Boleto)
- **Paystack**: ZA, NG
- **M-Pesa**: KE

### Language Support
- **English**: US, CA, GB, ZA, NG, KE
- **Portuguese**: BR
- **German**: DE
- **French**: CA (bilingual)
- **Multiple African Languages**: ZA (11), NG (4), KE (2)

## Special Configurations

### Germany (DE) - Strict Isolation

Germany has the most stringent requirements:

**Network Policies:**
- Blocks all cross-region traffic
- Allows only intra-country communication
- Isolated database access
- Whitelist-only external APIs

**Resource Allocation:**
- Dedicated CPU/Memory quotas
- Separate storage classes
- Priority scheduling
- No shared resources

**Storage:**
- 200Gi medical records (isolated)
- 100Gi lab results (isolated)
- 500Gi medical images (isolated)
- 200Gi database (SSD, isolated)
- Germany-specific KMS encryption

**Deployment:**
```bash
# Deploy Germany with all isolation features
kubectl apply -k infrastructure/kubernetes/overlays/europe/de/

# Verify isolation
kubectl get networkpolicies -n healthcare-de
kubectl get resourcequota de-dedicated-quota -n healthcare-de
kubectl get pvc -n healthcare-de
kubectl get storageclass | grep de-isolated
```

## Common Operations

### Update Country Configuration
```bash
# 1. Edit the country's configmap-patch.yaml
vim infrastructure/kubernetes/overlays/americas/us/configmap-patch.yaml

# 2. Apply changes
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/

# 3. Verify
kubectl get configmap shared-config -n healthcare-us -o yaml
```

### Scale Country Deployment
```bash
# Edit replicas in kustomization.yaml
vim infrastructure/kubernetes/overlays/europe/gb/kustomization.yaml

# Apply
kubectl apply -k infrastructure/kubernetes/overlays/europe/gb/
```

### Add New Country

1. Create country directory under appropriate region
2. Copy template files from `overlays/patches/`
3. Create `kustomization.yaml` inheriting from region
4. Customize `namespace.yaml` and `configmap-patch.yaml`
5. For strict isolation, add network policies, quotas, PVCs

Example:
```bash
mkdir -p overlays/europe/fr
cp overlays/patches/country-configmap-patch.yaml overlays/europe/fr/configmap-patch.yaml
# Edit and customize...
```

## Documentation

- **[COUNTRY-OVERLAYS-SUMMARY.md](./COUNTRY-OVERLAYS-SUMMARY.md)** - Comprehensive documentation of all country overlays
- **[COUNTRY-DEPLOYMENT-GUIDE.md](./COUNTRY-DEPLOYMENT-GUIDE.md)** - Quick reference for deployments and operations
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall Kubernetes architecture
- **[../KUSTOMIZE-README.md](../KUSTOMIZE-README.md)** - Kustomize usage guide

## Files Created

This country overlay implementation includes:

- **8 country overlays** (us, ca, br, de, gb, za, ng, ke)
- **3 base patch templates** (ConfigMap, NetworkPolicy, ResourceQuota)
- **Germany special resources** (6 files for strict isolation)
- **Documentation** (3 comprehensive guides)

**Total: 38 files**

## Deployment Scripts

### Deploy All Countries
```bash
#!/bin/bash
COUNTRIES=(
  "americas/us"
  "americas/ca"
  "americas/br"
  "europe/de"
  "europe/gb"
  "africa/za"
  "africa/ng"
  "africa/ke"
)

for country in "${COUNTRIES[@]}"; do
  echo "Deploying $country..."
  kubectl apply -k infrastructure/kubernetes/overlays/$country/
  sleep 10
done
```

### Health Check
```bash
#!/bin/bash
for ns in healthcare-{us,ca,br,de,gb,za,ng,ke}; do
  echo "=== $ns ==="
  kubectl get pods -n $ns --field-selector=status.phase!=Running
done
```

## CI/CD Integration

Each country can be deployed independently via CI/CD:

```yaml
# .github/workflows/deploy-country.yml
name: Deploy Country
on:
  workflow_dispatch:
    inputs:
      country:
        description: 'Country to deploy (us/ca/br/de/gb/za/ng/ke)'
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: kubectl apply -k infrastructure/kubernetes/overlays/${{ github.event.inputs.country }}/
```

## Monitoring & Observability

Each country namespace has:
- Prometheus metrics collection
- Grafana dashboards (country-specific)
- Log aggregation by country
- Distributed tracing
- Health check endpoints

View country-specific metrics:
```bash
kubectl top pods -n healthcare-{country-code}
kubectl logs -l country={country-code} -n healthcare-{country-code}
```

## Security Considerations

1. **Network Segmentation**: Each country runs in isolated namespace
2. **RBAC**: Country-specific service accounts and roles
3. **Secrets Management**: Country-specific encryption keys
4. **Data Encryption**: At-rest and in-transit encryption
5. **Compliance**: Country-specific audit logging
6. **Network Policies**: Especially strict for Germany

## Support

For questions or issues:
- **Platform Team**: platform-team@healthcare.com
- **Security**: security@healthcare.com
- **Compliance**: compliance@healthcare.com

## License

Copyright © 2024 Global Healthcare Platform
All rights reserved.
