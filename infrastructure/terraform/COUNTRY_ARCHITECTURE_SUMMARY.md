# Country-Level Architecture Summary

## Executive Overview

The country-level Terraform modules extend the existing Global→Region architecture with fine-grained country segmentation, enabling:

- **Data Residency Compliance**: Country-specific storage ensures data remains within national boundaries
- **Flexible Isolation Levels**: Standard or high-isolation configurations based on regulatory requirements
- **Cost Optimization**: Shared regional resources for most countries, dedicated resources only where required
- **Compliance Automation**: Automatic tagging and resource configuration per compliance framework

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              GLOBAL LAYER                                │
│  Scope: Worldwide                                                        │
│  Resources:                                                              │
│    - Azure Front Door (Premium with WAF)                                │
│    - Container Registry (geo-replicated to all regions)                 │
│    - Traffic Manager (Performance-based routing)                        │
│    - Global Log Analytics Workspace                                     │
│    - Global Key Vault                                                   │
│  Cost: ~$500-800/month                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
┌────────▼────────┐        ┌─────────▼─────────┐       ┌────────▼────────┐
│ REGIONAL LAYER  │        │ REGIONAL LAYER    │       │ REGIONAL LAYER  │
│ Americas        │        │ Europe            │       │ Africa          │
│ (East US)       │        │ (West Europe)     │       │ (SA North)      │
├─────────────────┤        ├───────────────────┤       ├─────────────────┤
│ Resources:      │        │ Resources:        │       │ Resources:      │
│  - VNet         │        │  - VNet           │       │  - VNet         │
│    10.10.0.0/16 │        │    10.20.0.0/16   │       │    10.30.0.0/16 │
│  - AKS Cluster  │        │  - AKS Cluster    │       │  - AKS Cluster  │
│  - PostgreSQL   │        │  - PostgreSQL     │       │  - PostgreSQL   │
│  - Redis Cache  │        │  - Redis Cache    │       │  - Redis Cache  │
│  - Regional KV  │        │  - Regional KV    │       │  - Regional KV  │
│  - Storage Acct │        │  - Storage Acct   │       │  - Storage Acct │
│                 │        │                   │       │                 │
│ Cost:           │        │ Cost:             │       │ Cost:           │
│ ~$3,000/month   │        │ ~$3,000/month     │       │ ~$2,500/month   │
└────────┬────────┘        └─────────┬─────────┘       └────────┬────────┘
         │                           │                           │
    ┌────▼────┐              ┌───────▼───────┐          ┌───────▼───────┐
    │ COUNTRY │              │ COUNTRY       │          │ COUNTRY       │
    │ LAYER   │              │ LAYER         │          │ LAYER         │
    │         │              │               │          │               │
    │ US      │              │ DE (Germany)  │          │ ZA (S.Africa) │
    │ ────────│              │ ─────────────│          │ ──────────────│
    │ Type:   │              │ Type:         │          │ Type:         │
    │ Standard│              │ High Isolation│          │ Standard      │
    │         │              │               │          │               │
    │ ✓ Subnet│              │ ✓ Subnet      │          │ ✓ Subnet      │
    │ ✓ NSG   │              │ ✓ NSG         │          │ ✓ NSG         │
    │ ✓ Storage│             │ ✓ Storage     │          │ ✓ Storage     │
    │ ✗ KeyVault│            │ ✓ KeyVault    │          │ ✗ KeyVault    │
    │ ✗ NodePool│            │ ✓ NodePool    │          │ ✗ NodePool    │
    │ ✗ Database│            │ ✓ Database    │          │ ✗ Database    │
    │         │              │               │          │               │
    │ Cost:   │              │ Cost:         │          │ Cost:         │
    │ ~$30/mo │              │ ~$1,650/mo    │          │ ~$30/mo       │
    └─────────┘              └───────────────┘          ├───────────────┤
                                                        │ KE (Kenya)    │
                                                        │ ──────────────│
                                                        │ Type: Standard│
                                                        │ Cost: ~$30/mo │
                                                        ├───────────────┤
                                                        │ NG (Nigeria)  │
                                                        │ ──────────────│
                                                        │ Type: Standard│
                                                        │ Cost: ~$30/mo │
                                                        └───────────────┘
```

## Resource Comparison

### Standard Country Configuration
**Examples: US, Kenya, Nigeria, South Africa**

| Resource | Provisioned | Details |
|----------|-------------|---------|
| **Subnet** | ✅ Yes | /24 subnet within regional VNet |
| **NSG** | ✅ Yes | Country-specific security rules |
| **Storage Account** | ✅ Yes | ZRS, 30-day soft delete |
| **Key Vault** | ❌ No | Uses regional Key Vault |
| **AKS Node Pool** | ❌ No | Uses shared regional pools |
| **PostgreSQL DB** | ❌ No | Uses shared regional database |
| **Monthly Cost** | | **~$20-50** |

**Use Case:** Countries with standard data residency requirements where resource sharing is acceptable.

### High-Isolation Country Configuration
**Example: Germany (GDPR/BDSG compliance)**

| Resource | Provisioned | Details |
|----------|-------------|---------|
| **Subnet** | ✅ Yes | /24 subnet for workloads |
| **Database Subnet** | ✅ Yes | /24 subnet for dedicated PostgreSQL |
| **NSG** | ✅ Yes | Enhanced security rules |
| **Storage Account** | ✅ Yes | ZRS, 30-day soft delete |
| **Key Vault** | ✅ Yes | Premium SKU, HSM-backed |
| **AKS Node Pool** | ✅ Yes | 3-12 nodes, dedicated with taints |
| **PostgreSQL DB** | ✅ Yes | Dedicated with HA, 128GB |
| **Monthly Cost** | | **~$1,600-1,700** |

**Use Case:** Countries with strict data protection laws requiring complete data sovereignty and isolation.

## File Structure

```
infrastructure/terraform/
│
├── main-multiregion.tf          # Main orchestration (regions)
├── global.tf                     # Global resources
├── countries.tf                  # NEW: Country integrations
├── COUNTRY_DEPLOYMENT_GUIDE.md   # NEW: Deployment guide
├── COUNTRY_ARCHITECTURE_SUMMARY.md # NEW: This file
│
├── modules/
│   ├── region/                   # Regional module (existing)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── country/                  # NEW: Country module
│       ├── main.tf               # Country resources
│       ├── variables.tf          # Country config inputs
│       ├── outputs.tf            # Country outputs
│       └── README.md             # Module documentation
│
└── countries/                    # NEW: Country instances
    ├── us.tf                     # United States
    ├── de.tf                     # Germany (high isolation)
    ├── ke.tf                     # Kenya
    ├── ng.tf                     # Nigeria
    └── za.tf                     # South Africa
```

## Network Topology

### Complete Network Map

```
Global Network: Azure Backbone

┌─────────────────────────────────────────────────────────────────┐
│ Americas Region VNet: 10.10.0.0/16                              │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Shared Regional Subnets                                  │    │
│ │ ├─ AKS Subnet:         10.10.0.0/20   (4,096 IPs)       │    │
│ │ ├─ Database Subnet:    10.10.16.0/24  (256 IPs)         │    │
│ │ └─ App Gateway Subnet: 10.10.32.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Country-Specific Subnets                                 │    │
│ │ └─ US (Standard):      10.10.48.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Europe Region VNet: 10.20.0.0/16                                │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Shared Regional Subnets                                  │    │
│ │ ├─ AKS Subnet:         10.20.0.0/20   (4,096 IPs)       │    │
│ │ ├─ Database Subnet:    10.20.16.0/24  (256 IPs)         │    │
│ │ └─ App Gateway Subnet: 10.20.32.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Country-Specific Subnets                                 │    │
│ │ ├─ DE (High Iso):      10.20.48.0/24  (256 IPs)         │    │
│ │ └─ DE Database:        10.20.49.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Africa Region VNet: 10.30.0.0/16                                │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Shared Regional Subnets                                  │    │
│ │ ├─ AKS Subnet:         10.30.0.0/20   (4,096 IPs)       │    │
│ │ ├─ Database Subnet:    10.30.16.0/24  (256 IPs)         │    │
│ │ └─ App Gateway Subnet: 10.30.32.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Country-Specific Subnets                                 │    │
│ │ ├─ ZA (Standard):      10.30.48.0/24  (256 IPs)         │    │
│ │ ├─ KE (Standard):      10.30.50.0/24  (256 IPs)         │    │
│ │ └─ NG (Standard):      10.30.52.0/24  (256 IPs)         │    │
│ └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

Reserved for Future Countries:
  Americas: 10.10.50.0/24 - 10.10.63.0/24 (14 /24 subnets)
  Europe:   10.20.50.0/24 - 10.20.63.0/24 (14 /24 subnets)
  Africa:   10.30.54.0/24 - 10.30.63.0/24 (10 /24 subnets)
```

## Compliance Matrix

| Country | Code | Primary Laws | Isolation | Storage | Key Vault | Node Pool | Database |
|---------|------|--------------|-----------|---------|-----------|-----------|----------|
| **United States** | US | HIPAA, FedRAMP | Standard | ZRS (US) | Regional | Shared | Shared |
| **Germany** | DE | GDPR, BDSG | **High** | ZRS (EU) | Dedicated | Dedicated | Dedicated |
| **Kenya** | KE | KDPA | Standard | ZRS (ZA) | Regional | Shared | Shared |
| **Nigeria** | NG | NDPR | Standard | ZRS (ZA) | Regional | Shared | Shared |
| **South Africa** | ZA | POPIA | Standard | ZRS (ZA) | Regional | Shared | Shared |

### Compliance Features by Country

#### United States (HIPAA)
- ✅ Data stored in US region (East US)
- ✅ Encryption at rest and in transit
- ✅ Audit logging to global Log Analytics
- ✅ Access controls via RBAC
- ❌ No dedicated resources (acceptable under HIPAA)

#### Germany (GDPR/BDSG)
- ✅ Data stored exclusively in EU (West Europe)
- ✅ Dedicated Key Vault (no shared secrets)
- ✅ Dedicated database (complete data sovereignty)
- ✅ Dedicated node pool (workload isolation)
- ✅ No geo-replication (data stays in EU)
- ✅ Enhanced audit logging
- ✅ RBAC with Germany-specific policies

#### Kenya (KDPA)
- ✅ Data stored in Africa region (South Africa North)
- ✅ Country-specific storage account
- ✅ Compliance tagging for KDPA
- ✅ Shared regional resources (acceptable)

#### Nigeria (NDPR)
- ✅ Data stored in Africa region (South Africa North)
- ✅ Country-specific storage account
- ✅ Compliance tagging for NDPR
- ✅ Shared regional resources (acceptable)

#### South Africa (POPIA)
- ✅ Data stored in South Africa
- ✅ Country-specific storage account
- ✅ Compliance tagging for POPIA
- ✅ Shared regional resources (acceptable)

## Resource Naming Convention

### Storage Accounts
```
st{country_code}{location_short}{environment}

Examples:
  stuseusprod         → US, East US, Production
  stdeweuprod         → Germany, West Europe, Production
  stkesanprod         → Kenya, South Africa North, Production
```

### Key Vaults (High-Isolation Only)
```
kv-{country_code}-{location_short}-{environment}

Examples:
  kv-DE-weu-prod      → Germany, West Europe, Production
```

### Subnets
```
snet-{country_code}-{purpose}

Examples:
  snet-US-workloads   → US workload subnet
  snet-DE-workloads   → Germany workload subnet
  snet-DE-database    → Germany database subnet
```

### Network Security Groups
```
nsg-{country_code}-{region_id}

Examples:
  nsg-US-americas     → US NSG in Americas region
  nsg-DE-europe       → Germany NSG in Europe region
```

### AKS Node Pools
```
{country_code}

Examples:
  DE                  → Germany dedicated node pool
```

### PostgreSQL Servers (High-Isolation Only)
```
psql-{country_code}-{location_short}-{environment}

Examples:
  psql-DE-weu-prod    → Germany PostgreSQL, West Europe, Production
```

## Cost Analysis

### Monthly Cost Breakdown (All Regions Deployed)

```
┌──────────────────────────────────────────────────────────────┐
│ Global Infrastructure                        $500-800/month  │
│  - Front Door Premium                        $300            │
│  - Container Registry Premium                $100            │
│  - Traffic Manager                           $20             │
│  - Global Log Analytics                      $50             │
│  - Global Key Vault                          $30             │
├──────────────────────────────────────────────────────────────┤
│ Regional Infrastructure                      $8,500/month    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Americas Region                  $3,000                │  │
│  │  - AKS (8 nodes)                 $1,800               │  │
│  │  - PostgreSQL (HA)               $800                 │  │
│  │  - Redis Premium                 $300                 │  │
│  │  - Other services                $100                 │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Europe Region                    $3,000                │  │
│  │  - AKS (8 nodes)                 $1,800               │  │
│  │  - PostgreSQL (HA)               $800                 │  │
│  │  - Redis Premium                 $300                 │  │
│  │  - Other services                $100                 │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Africa Region                    $2,500                │  │
│  │  - AKS (7 nodes)                 $1,600               │  │
│  │  - PostgreSQL (HA)               $600                 │  │
│  │  - Redis Premium                 $200                 │  │
│  │  - Other services                $100                 │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ Country Infrastructure                       $1,780/month    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ United States (Standard)         $30                   │  │
│  │  - Storage Account (ZRS)         $30                   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Germany (High Isolation)         $1,650                │  │
│  │  - Storage Account (ZRS)         $30                   │  │
│  │  - Key Vault Premium             $200                  │  │
│  │  - AKS Node Pool (3 nodes)       $600                  │  │
│  │  - PostgreSQL Dedicated (HA)     $820                  │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Kenya (Standard)                 $30                   │  │
│  │  - Storage Account (ZRS)         $30                   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Nigeria (Standard)               $30                   │  │
│  │  - Storage Account (ZRS)         $30                   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ South Africa (Standard)          $40                   │  │
│  │  - Storage Account (ZRS)         $40                   │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ TOTAL MONTHLY COST                           $10,780-11,080  │
└──────────────────────────────────────────────────────────────┘

Cost Optimization Opportunities:
  - Use Standard isolation for Germany:   -$1,600/month
  - Reduce German node pool to 2 nodes:   -$200/month
  - Use smaller PostgreSQL SKU (Germany): -$300/month
```

## Deployment Sequence

```
Step 1: Global Infrastructure (already exists)
  └─ Deploy global.tf
     Duration: ~15 minutes

Step 2: Regional Infrastructure (already exists)
  └─ Deploy main-multiregion.tf
     ├─ Americas module
     ├─ Europe module
     └─ Africa module
     Duration: ~45 minutes

Step 3: Country Infrastructure (NEW)
  └─ Deploy countries.tf
     ├─ country_us module    (Standard)  ~5 min
     ├─ country_de module    (High Iso)  ~20 min
     ├─ country_ke module    (Standard)  ~5 min
     ├─ country_ng module    (Standard)  ~5 min
     └─ country_za module    (Standard)  ~5 min
     Duration: ~40 minutes

Total Deployment Time: ~1 hour 40 minutes
```

## Key Benefits

### 1. Data Sovereignty
- ✅ Country-specific storage accounts ensure data never leaves national boundaries
- ✅ Configurable per-country based on local laws
- ✅ Automated compliance through infrastructure as code

### 2. Flexible Isolation
- ✅ Standard isolation for cost efficiency (most countries)
- ✅ High isolation for strict compliance (Germany, etc.)
- ✅ Easy to upgrade from standard to high isolation

### 3. Cost Optimization
- ✅ Shared regional resources reduce costs by ~95% for standard countries
- ✅ Only $30-50/month per standard country
- ✅ Dedicated resources only where legally required

### 4. Scalability
- ✅ Easy to add new countries (just copy template)
- ✅ Subnet space reserved for future expansion
- ✅ Modular architecture supports growth

### 5. Compliance Automation
- ✅ Automatic tagging with compliance standards
- ✅ Resource policies enforce data residency
- ✅ Audit logs for regulatory reporting

## Next Steps

1. **Review & Validate**
   - Review country configurations
   - Validate subnet allocations
   - Confirm compliance requirements

2. **Deploy Infrastructure**
   - Follow COUNTRY_DEPLOYMENT_GUIDE.md
   - Start with one country
   - Expand to all countries

3. **Configure Applications**
   - Update application configs for country awareness
   - Implement country-based routing
   - Test data residency

4. **Monitor & Optimize**
   - Set up country-specific monitoring
   - Review costs monthly
   - Optimize resource allocation

5. **Expand Coverage**
   - Add more countries as needed
   - Implement cross-country replication (encrypted)
   - Enhance monitoring and alerting
