# Country-Level Infrastructure Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying country-level infrastructure that extends the existing Global→Region architecture with country-specific segmentation for enhanced compliance and data residency.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        GLOBAL LAYER                              │
│  - Azure Front Door (CDN/WAF)                                   │
│  - Container Registry (geo-replicated)                          │
│  - Traffic Manager (DNS-based routing)                          │
│  - Global Log Analytics                                         │
│  - Global Key Vault                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
┌─────────▼─────────┐ ┌───────▼───────┐ ┌────────▼────────┐
│  AMERICAS REGION  │ │ EUROPE REGION │ │ AFRICA REGION   │
│  (East US)        │ │ (West Europe) │ │ (SA North)      │
│                   │ │               │ │                 │
│  - VNet           │ │ - VNet        │ │ - VNet          │
│  - AKS Cluster    │ │ - AKS Cluster │ │ - AKS Cluster   │
│  - PostgreSQL     │ │ - PostgreSQL  │ │ - PostgreSQL    │
│  - Redis Cache    │ │ - Redis Cache │ │ - Redis Cache   │
└─────────┬─────────┘ └───────┬───────┘ └────────┬────────┘
          │                   │                   │
    ┌─────▼─────┐       ┌─────▼─────┐      ┌─────▼─────┐
    │ Country:  │       │ Country:  │      │ Country:  │
    │    US     │       │    DE     │      │    ZA     │
    │ (Standard)│       │  (High    │      │ (Standard)│
    │           │       │ Isolation)│      │           │
    └───────────┘       └───────────┘      ├───────────┤
                                           │ Country:  │
                                           │    KE     │
                                           │ (Standard)│
                                           ├───────────┤
                                           │ Country:  │
                                           │    NG     │
                                           │ (Standard)│
                                           └───────────┘
```

## What's Been Created

### 1. Country Module (`modules/country/`)

A reusable Terraform module that creates country-specific resources:

**Files:**
- `main.tf` - Country infrastructure resources
- `variables.tf` - Configuration inputs
- `outputs.tf` - Resource outputs
- `README.md` - Module documentation

**Resources Created:**
- Country-specific subnet within regional VNet
- Network Security Group with country-specific rules
- Storage account (for data residency requirements)
- Key Vault (optional, for high-isolation countries)
- AKS node pool (optional, for isolated workloads)
- PostgreSQL database (optional, for strict data sovereignty)

### 2. Country Instance Files (`countries/`)

Individual country configurations:

- `us.tf` - United States (Standard isolation)
- `de.tf` - Germany (High isolation with dedicated resources)
- `ke.tf` - Kenya (Standard isolation)
- `ng.tf` - Nigeria (Standard isolation)
- `za.tf` - South Africa (Standard isolation)

### 3. Integration File (`countries.tf`)

Main orchestration file that:
- Imports all country modules
- Configures country-specific settings
- Provides country infrastructure outputs

## Deployment Prerequisites

### 1. Existing Infrastructure

The country-level modules require the following to be already deployed:

- ✅ Global infrastructure (defined in `global.tf`)
- ✅ Regional infrastructure for at least one region:
  - Americas (`module.americas`)
  - Europe (`module.europe`)
  - Africa (`module.africa`)

### 2. Required Variables

Ensure these variables are defined in your `terraform.tfvars`:

```hcl
# Project Configuration
project_name = "unified-health"
environment  = "prod"

# Regional Deployment Flags
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# Database Credentials (for Germany's dedicated database)
postgresql_admin_username = "dbadmin"
postgresql_admin_password = "SecurePassword123!"  # Use Azure Key Vault in production
```

## Deployment Steps

### Step 1: Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### Step 2: Review the Plan

```bash
terraform plan -out=country-deployment.tfplan
```

**Expected New Resources:**

**If all regions are deployed (Americas + Europe + Africa):**
- 5 country modules (US, DE, KE, NG, ZA)
- 5 country subnets
- 5 Network Security Groups
- 5 storage accounts (for data residency)
- 1 dedicated Key Vault (Germany)
- 1 dedicated AKS node pool (Germany)
- 1 dedicated PostgreSQL database (Germany)

**Total: ~25-30 new resources**

### Step 3: Deploy Country Infrastructure

```bash
terraform apply country-deployment.tfplan
```

### Step 4: Verify Deployment

Check the outputs:

```bash
terraform output country_infrastructure_summary
```

Expected output structure:

```hcl
{
  "united_states" = {
    "country_code"         = "US"
    "compliance_standards" = ["HIPAA", "SOC2", "ISO27001", "FedRAMP"]
    "isolation_level"      = "Standard"
    "storage_account"      = "stuseusprod"
    "subnet_id"            = "/subscriptions/.../subnets/snet-US-workloads"
  }
  "germany" = {
    "country_code"         = "DE"
    "compliance_standards" = ["GDPR", "ISO27001", "SOC2", "BDSG"]
    "database_name"        = "unified_health_DE"
    "isolation_level"      = "High"
    "keyvault_name"        = "kv-DE-weu-prod"
    "node_pool_name"       = "DE"
    "storage_account"      = "stdeweuprod"
    "subnet_id"            = "/subscriptions/.../subnets/snet-DE-workloads"
  }
  # ... more countries
}
```

### Step 5: Access High-Isolation Resources (Germany)

For sensitive outputs (like database connection strings):

```bash
terraform output -json country_high_isolation_resources
```

## Configuration Reference

### Standard Country Configuration

Used for most countries (US, KE, NG, ZA):

```hcl
module "country_xx" {
  source = "./modules/country"

  isolation_enabled       = false  # Uses shared regional resources
  data_residency_required = true   # Country-specific storage
  dedicated_node_pool     = false  # Uses shared AKS node pools
  dedicated_database      = false  # Uses shared regional database
}
```

**Resources Created:**
- 1 Subnet
- 1 NSG
- 1 Storage Account (ZRS)

**Monthly Cost:** ~$20-50

### High-Isolation Country Configuration

Used for countries with strict data protection laws (Germany):

```hcl
module "country_de" {
  source = "./modules/country"

  isolation_enabled       = true   # Dedicated Key Vault
  data_residency_required = true   # Country-specific storage
  dedicated_node_pool     = true   # Dedicated AKS nodes
  dedicated_database      = true   # Dedicated PostgreSQL
}
```

**Resources Created:**
- 1 Subnet
- 1 NSG
- 1 Storage Account (ZRS)
- 1 Key Vault (Premium)
- 1 AKS Node Pool (3+ nodes)
- 1 PostgreSQL Flexible Server (HA enabled)
- 1 Database Subnet

**Monthly Cost:** ~$1,600-1,700

## Network Configuration

### Subnet Allocations

**Americas Region (10.10.0.0/16)**
```
Regional Resources:
├─ AKS Subnet:        10.10.0.0/20    (4,096 IPs)
├─ Database Subnet:   10.10.16.0/24   (256 IPs)
└─ App Gateway:       10.10.32.0/24   (256 IPs)

Country Subnets:
└─ United States:     10.10.48.0/24   (256 IPs)
```

**Europe Region (10.20.0.0/16)**
```
Regional Resources:
├─ AKS Subnet:        10.20.0.0/20    (4,096 IPs)
├─ Database Subnet:   10.20.16.0/24   (256 IPs)
└─ App Gateway:       10.20.32.0/24   (256 IPs)

Country Subnets:
├─ Germany:           10.20.48.0/24   (256 IPs)
└─ Germany DB:        10.20.49.0/24   (256 IPs)
```

**Africa Region (10.30.0.0/16)**
```
Regional Resources:
├─ AKS Subnet:        10.30.0.0/20    (4,096 IPs)
├─ Database Subnet:   10.30.16.0/24   (256 IPs)
└─ App Gateway:       10.30.32.0/24   (256 IPs)

Country Subnets:
├─ South Africa:      10.30.48.0/24   (256 IPs)
├─ Kenya:             10.30.50.0/24   (256 IPs)
└─ Nigeria:           10.30.52.0/24   (256 IPs)
```

## Application Integration

### Deploying Workloads to Country-Specific Resources

#### 1. Standard Country (e.g., United States)

**Kubernetes Namespace:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: healthcare-us
  labels:
    country: US
    region: americas
    compliance: hipaa
```

**Pod Deployment:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: patient-api
  namespace: healthcare-us
spec:
  # Uses regional AKS node pools (shared)
  nodeSelector:
    region: americas

  containers:
  - name: api
    image: your-aws-account-id.dkr.ecr.us-east-1.amazonaws.com/patient-api:latest
    env:
    - name: STORAGE_ACCOUNT
      value: "stuseusprod"  # US-specific storage
    - name: COUNTRY_CODE
      value: "US"
```

#### 2. High-Isolation Country (Germany)

**Kubernetes Namespace:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: healthcare-de
  labels:
    country: DE
    region: europe
    compliance: gdpr
    isolation: high
```

**Pod Deployment:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: patient-api
  namespace: healthcare-de
spec:
  # Uses dedicated German node pool
  nodeSelector:
    country: DE

  tolerations:
  - key: "country"
    operator: "Equal"
    value: "DE"
    effect: "NoSchedule"
  - key: "isolation"
    operator: "Equal"
    value: "high"
    effect: "NoSchedule"

  containers:
  - name: api
    image: your-aws-account-id.dkr.ecr.us-east-1.amazonaws.com/patient-api:latest
    env:
    - name: STORAGE_ACCOUNT
      value: "stdeweuprod"  # DE-specific storage
    - name: KEY_VAULT_URI
      value: "https://kv-DE-weu-prod.vault.azure.net/"  # DE-specific Key Vault
    - name: DATABASE_HOST
      value: "psql-DE-weu-prod.postgres.database.azure.com"  # DE-specific DB
    - name: COUNTRY_CODE
      value: "DE"
```

## Compliance & Data Residency

### Compliance Standards by Country

| Country | Standards | Data Residency | Isolation | Dedicated DB |
|---------|-----------|----------------|-----------|--------------|
| **United States** | HIPAA, SOC2, ISO27001, FedRAMP | ✅ Required | Standard | ❌ |
| **Germany** | GDPR, BDSG, ISO27001, SOC2 | ✅ Required | **High** | ✅ |
| **Kenya** | KDPA, ISO27001, SOC2 | ✅ Required | Standard | ❌ |
| **Nigeria** | NDPR, ISO27001, SOC2 | ✅ Required | Standard | ❌ |
| **South Africa** | POPIA, ISO27001, SOC2 | ✅ Required | Standard | ❌ |

### Data Residency Verification

Verify that data remains in-country:

```bash
# Check storage account location
az storage account show \
  --name stuseusprod \
  --query "location" \
  --output tsv
# Output: eastus (US data stays in East US)

az storage account show \
  --name stdeweuprod \
  --query "location" \
  --output tsv
# Output: westeurope (German data stays in West Europe)
```

## Monitoring & Observability

### View Country-Specific Logs

All country resources send logs to the global Log Analytics workspace:

```kusto
// Query NSG flow logs for US country subnet
AzureNetworkAnalytics_CL
| where SubnetPrefix_s == "10.10.48.0/24"
| where TimeGenerated > ago(1h)
| project TimeGenerated, FlowDirection_s, SrcIP_s, DestIP_s, DestPort_d

// Query Key Vault audit logs for Germany
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT"
| where ResourceId contains "kv-DE-weu-prod"
| where TimeGenerated > ago(24h)
| project TimeGenerated, OperationName, ResultType, CallerIPAddress
```

### Monitoring Dashboard

Access country-specific metrics:

```bash
# Navigate to Azure Portal > Log Analytics Workspace > Workbooks
# Create queries filtered by country tags
```

## Troubleshooting

### Issue 1: Subnet CIDR Conflict

**Error:**
```
Error: creating Subnet: subnet "snet-US-workloads" with CIDR "10.10.48.0/24" overlaps with existing subnet
```

**Solution:**
Update the `subnet_cidr` in the country module to use a non-overlapping range.

### Issue 2: Germany Database Not Accessible

**Error:**
```
Error: connection to database failed: FATAL: no pg_hba.conf entry for host
```

**Solution:**
Ensure your application is running in the German node pool and can access the database subnet:

```bash
kubectl get pods -n healthcare-de -o wide
# Verify pods are running on nodes with label country=DE
```

### Issue 3: Storage Account Access Denied

**Error:**
```
Error: This request is not authorized to perform this operation using this permission.
```

**Solution:**
Grant AKS managed identity access to country storage:

```bash
az role assignment create \
  --role "Storage Blob Data Contributor" \
  --assignee <AKS-kubelet-identity> \
  --scope /subscriptions/.../storageAccounts/stuseusprod
```

## Adding a New Country

To add a new country (e.g., Canada to Americas):

1. **Create country configuration file:**

```bash
# Create countries/ca.tf
```

2. **Add module configuration:**

```hcl
module "country_ca" {
  source = "./modules/country"

  country_code   = "CA"
  country_name   = "Canada"
  region_id      = "americas"
  subnet_cidr    = "10.10.54.0/24"  # Next available subnet

  # ... rest of configuration
}
```

3. **Update outputs in `countries.tf`:**

```hcl
output "country_infrastructure_summary" {
  value = {
    # ... existing countries
    canada = var.deploy_americas ? {
      country_code = module.country_ca[0].country_code
      # ... rest of outputs
    } : null
  }
}
```

4. **Deploy:**

```bash
terraform plan
terraform apply
```

## Rollback Procedure

If you need to remove country-level infrastructure:

```bash
# Remove specific country
terraform destroy -target=module.country_us

# Remove all countries but keep regional infrastructure
terraform destroy -target=module.country_us -target=module.country_de \
  -target=module.country_ke -target=module.country_ng -target=module.country_za
```

## Cost Optimization

### Recommendations

1. **Use Standard Isolation when possible** - Saves ~$1,600/month per country
2. **Right-size node pools** - Germany uses D8s_v3, consider D4s_v3 for lower workloads
3. **Adjust PostgreSQL SKU** - Use GP_Standard_D2s_v3 instead of D4s_v3 for dev/test
4. **Enable autoscaling** - Set aggressive scale-down policies for node pools

### Cost Breakdown (Monthly)

**Full Deployment (All Countries):**
- US (Standard): $20-50
- Germany (High Isolation): $1,600-1,700
- Kenya (Standard): $20-50
- Nigeria (Standard): $20-50
- South Africa (Standard): $20-50

**Total: ~$1,680-1,900/month**

## Support & Documentation

- **Module Documentation**: `modules/country/README.md`
- **Network Architecture**: See subnet allocation diagrams above
- **Compliance Guide**: See compliance matrix
- **Issue Tracker**: GitHub Issues

## Next Steps

1. ✅ Deploy country infrastructure
2. ⬜ Configure application deployments with country awareness
3. ⬜ Set up country-specific monitoring alerts
4. ⬜ Implement country-based request routing
5. ⬜ Configure backup and disaster recovery per country
