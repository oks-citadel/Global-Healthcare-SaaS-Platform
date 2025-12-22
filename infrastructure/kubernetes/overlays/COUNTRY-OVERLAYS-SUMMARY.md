# Country-Level Kubernetes Overlays Summary

## Overview
This document summarizes the country-level Kustomize overlays created to extend the existing regional overlays for the Global Healthcare SaaS Platform.

## Directory Structure

```
overlays/
├── patches/                                    # Base country patch templates
│   ├── country-configmap-patch.yaml           # Template for country-specific ConfigMap patches
│   ├── country-network-policy.yaml            # Template for strict network isolation
│   └── country-resource-quota.yaml            # Template for dedicated resource quotas
│
├── americas/                                   # Americas Region
│   ├── us/                                     # United States
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   ├── ca/                                     # Canada
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   └── configmap-patch.yaml
│   └── br/                                     # Brazil
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       └── configmap-patch.yaml
│
├── europe/                                     # Europe Region
│   ├── de/                                     # Germany (STRICT ISOLATION)
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── configmap-patch.yaml
│   │   ├── network-policy.yaml                # Strict data isolation policies
│   │   ├── resource-quota.yaml                # Dedicated resource allocation
│   │   └── dedicated-pvc.yaml                 # Isolated persistent storage
│   └── gb/                                     # United Kingdom
│       ├── kustomization.yaml
│       ├── namespace.yaml
│       └── configmap-patch.yaml
│
└── africa/                                     # Africa Region
    ├── za/                                     # South Africa
    │   ├── kustomization.yaml
    │   ├── namespace.yaml
    │   └── configmap-patch.yaml
    ├── ng/                                     # Nigeria
    │   ├── kustomization.yaml
    │   ├── namespace.yaml
    │   └── configmap-patch.yaml
    └── ke/                                     # Kenya
        ├── kustomization.yaml
        ├── namespace.yaml
        └── configmap-patch.yaml
```

## Country Overlays Created

### Americas Region

#### 1. United States (us)
- **Namespace**: `healthcare-us`
- **Name Prefix**: `us-`
- **Compliance**: HIPAA, HITECH
- **Data Residency**: Shared (regional)
- **Key Features**:
  - Medicare/Medicaid integration
  - 50-state support
  - DEA controlled substances tracking
  - Epic/Cerner/Allscripts integrations
  - FDA drug formulary

#### 2. Canada (ca)
- **Namespace**: `healthcare-ca`
- **Name Prefix**: `ca-`
- **Compliance**: PIPEDA, PHIPA
- **Data Residency**: Shared (regional)
- **Key Features**:
  - Provincial health integration (13 provinces/territories)
  - Bilingual support (English/French)
  - OHIP, RAMQ integrations
  - Health Canada reporting
  - Indigenous health services

#### 3. Brazil (br)
- **Namespace**: `healthcare-br`
- **Name Prefix**: `br-`
- **Compliance**: LGPD
- **Data Residency**: Shared (regional)
- **Key Features**:
  - SUS (public healthcare) integration
  - ANVISA compliance
  - PIX/Boleto payment support
  - 26-state support
  - ANS operator registry

### Europe Region

#### 4. Germany (de) - STRICT ISOLATION
- **Namespace**: `healthcare-de`
- **Name Prefix**: `de-`
- **Compliance**: GDPR (Strict), BDSG, SGB V
- **Data Residency**: **ISOLATED** (country-specific)
- **Key Features**:
  - **Strict network isolation policies**
  - **Dedicated resource quotas**
  - **Isolated persistent storage**
  - No cross-border data transfers
  - Gematik/Telematik infrastructure
  - E-prescription service
  - BfARM drug formulary
  - GKV/PKV insurance integration
- **Special Components**:
  - Network policies blocking cross-region traffic
  - Dedicated PVCs with Germany-only storage
  - Resource quotas ensuring dedicated allocation
  - Priority class for critical workloads

#### 5. United Kingdom (gb)
- **Namespace**: `healthcare-gb`
- **Name Prefix**: `gb-`
- **Compliance**: UK GDPR, Data Protection Act 2018
- **Data Residency**: Shared (regional)
- **Key Features**:
  - NHS integration
  - NHS Spine connectivity
  - GP Connect integration
  - NHS 111 emergency services
  - BNF drug formulary
  - GMC/NMC professional verification
  - SNOMED CT UK coding

### Africa Region

#### 6. South Africa (za)
- **Namespace**: `healthcare-za`
- **Name Prefix**: `za-`
- **Compliance**: POPIA, National Health Act
- **Data Residency**: Shared (regional)
- **Key Features**:
  - Medical schemes integration
  - 11 official languages support
  - 9-province support
  - HIV/TB treatment programs
  - HPCSA professional verification
  - SAHPRA drug formulary
  - Discovery Health/Medscheme integrations

#### 7. Nigeria (ng)
- **Namespace**: `healthcare-ng`
- **Name Prefix**: `ng-`
- **Compliance**: NDPR
- **Data Residency**: Shared (regional)
- **Key Features**:
  - NHIS integration
  - Mobile-first design
  - M-Pesa/USSD payment support
  - 36-state support
  - NAFDAC drug compliance
  - MDCN professional verification
  - Malaria/HIV/TB programs

#### 8. Kenya (ke)
- **Namespace**: `healthcare-ke`
- **Name Prefix**: `ke-`
- **Compliance**: Data Protection Act 2019
- **Data Residency**: Shared (regional)
- **Key Features**:
  - M-Pesa payment integration
  - 47-county devolved system
  - NHIF/SHA integration
  - Universal Health Coverage (UHC)
  - Linda Mama program
  - KMPDB professional verification
  - PPB drug formulary

## Common Features Across All Countries

Each country overlay includes:

1. **Inheritance**: Extends parent regional overlay (`../../region-name`)
2. **Namespace**: Country-specific namespace (`healthcare-{country-code}`)
3. **Name Prefix**: Country code prefix (`{country-code}-`)
4. **Labels**:
   - `country: {code}`
   - `region: {region-name}`
   - `compliance: {framework}`
   - `data-residency: {shared|isolated}`
   - `environment: production`
5. **ConfigMap Patches**: Country-specific configuration
6. **Image Tags**: Country-versioned container images

## Configuration Parameters

Each country ConfigMap includes:

- **country_code**: ISO 3166-1 alpha-2 code
- **currency**: Local currency code
- **timezone**: Primary timezone
- **language**: Primary language code
- **compliance_framework**: Primary compliance regulation
- **data_residency_mode**: `shared` or `isolated`
- **emergency_hotline**: Local emergency number
- **payment_processor_country**: Country-specific payment provider
- **healthcare_system_type**: System classification

## Data Residency Models

### Shared Regional Storage (Default)
Countries using shared regional storage:
- US, CA, BR (Americas)
- GB (Europe)
- ZA, NG, KE (Africa)

Benefits:
- Cost-effective
- Regional compliance maintained
- Shared infrastructure

### Isolated Country Storage (Strict)
Countries requiring isolated storage:
- **Germany (DE)** - Strict GDPR requirements

Features:
- No cross-border data transfers
- Dedicated network policies
- Dedicated resource quotas
- Country-specific encryption keys
- Isolated persistent volumes

## Germany Strict Isolation Details

Germany has additional security measures:

### Network Policies
- `de-strict-isolation-policy`: Restricts ingress/egress to Germany namespace only
- `de-deny-cross-region`: Explicitly blocks traffic to other regions
- `de-database-isolation`: Database access limited to Germany services

### Resource Quotas
- CPU: 32 requests, 64 limits
- Memory: 64Gi requests, 128Gi limits
- Storage: 1Ti total, 20 PVCs
- Higher limits than shared deployments

### Dedicated Storage
- Medical records: 200Gi PVC
- Lab results: 100Gi PVC
- Medical images: 500Gi PVC
- Database: 200Gi SSD PVC
- Custom storage classes with Germany-specific KMS encryption

## Deployment Commands

### Deploy a specific country:
```bash
# United States
kubectl apply -k overlays/americas/us/

# Germany (with strict isolation)
kubectl apply -k overlays/europe/de/

# Kenya
kubectl apply -k overlays/africa/ke/
```

### View generated manifests:
```bash
# Preview what will be deployed
kubectl kustomize overlays/americas/ca/

# Check Germany's strict isolation config
kubectl kustomize overlays/europe/de/
```

### Deploy all countries in a region:
```bash
# Deploy all Africa countries
for country in za ng ke; do
  kubectl apply -k overlays/africa/$country/
done
```

## Validation

Verify country deployment:
```bash
# Check namespace
kubectl get namespace healthcare-de

# Check resources
kubectl get all -n healthcare-de

# Verify network policies (Germany)
kubectl get networkpolicies -n healthcare-de

# Check resource quotas (Germany)
kubectl get resourcequota -n healthcare-de

# Verify PVCs (Germany)
kubectl get pvc -n healthcare-de
```

## Base Templates (overlays/patches/)

### country-configmap-patch.yaml
Template for creating country-specific ConfigMap overrides. Copy and customize for new countries.

### country-network-policy.yaml
Template for strict network isolation. Use for countries requiring data sovereignty.

### country-resource-quota.yaml
Template for dedicated resource allocation. Use for isolated deployments.

## Adding New Countries

To add a new country overlay:

1. Create country directory: `overlays/{region}/{country-code}/`
2. Copy template files from `overlays/patches/`
3. Create `kustomization.yaml` inheriting from parent region
4. Create `namespace.yaml` with country labels
5. Create `configmap-patch.yaml` with country-specific settings
6. For strict isolation, add network policies, quotas, and PVCs

## Compliance Matrix

| Country | Framework | Data Residency | Isolation Level |
|---------|-----------|----------------|-----------------|
| US      | HIPAA     | Regional       | Standard        |
| CA      | PIPEDA    | Regional       | Standard        |
| BR      | LGPD      | Regional       | Standard        |
| **DE**  | **GDPR**  | **Country**    | **Strict**      |
| GB      | UK GDPR   | Regional       | Standard        |
| ZA      | POPIA     | Regional       | Standard        |
| NG      | NDPR      | Regional       | Standard        |
| KE      | DPA 2019  | Regional       | Standard        |

## Files Created

Total files created: **35**

- Base templates: 3
- US overlay: 3
- CA overlay: 3
- BR overlay: 3
- DE overlay: 6 (includes strict isolation resources)
- GB overlay: 3
- ZA overlay: 3
- NG overlay: 3
- KE overlay: 3
- This summary: 1

## Next Steps

1. **Review and customize** country-specific settings in ConfigMaps
2. **Update image tags** to match your container registry
3. **Configure storage classes** for your cloud provider
4. **Set up KMS encryption keys** for each country/region
5. **Test deployments** in staging environment first
6. **Configure CI/CD pipelines** for country-specific deployments
7. **Set up monitoring** for each country namespace
8. **Document runbooks** for country-specific operations

## Notes

- Germany (DE) is the only country with strict isolation currently
- All overlays inherit from their parent regional overlay
- ConfigMap patches use strategic merge to override regional settings
- Image tags follow the pattern: `v1.2.3-{country-code}`
- Namespaces follow the pattern: `healthcare-{country-code}`
- All namespaces have Istio injection enabled
