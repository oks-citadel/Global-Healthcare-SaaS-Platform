# Country Module

## Overview

The Country module extends the Global→Region architecture with country-level segmentation, enabling fine-grained control over data residency, compliance, and resource isolation for individual countries within a regional deployment.

## Architecture

```
Global (Shared Services)
  │
  ├─ Region: Americas
  │   ├─ Country: United States (US)
  │   ├─ Country: Canada (CA) [future]
  │   └─ Country: Mexico (MX) [future]
  │
  ├─ Region: Europe
  │   ├─ Country: Germany (DE) - HIGH ISOLATION
  │   ├─ Country: France (FR) [future]
  │   └─ Country: United Kingdom (GB) [future]
  │
  └─ Region: Africa
      ├─ Country: South Africa (ZA)
      ├─ Country: Kenya (KE)
      └─ Country: Nigeria (NG)
```

## Resource Hierarchy

### Global Resources (Shared)
- Azure Front Door (CDN/WAF)
- Container Registry (geo-replicated)
- Traffic Manager
- Global Log Analytics Workspace
- Global Key Vault

### Regional Resources
- Virtual Network (VNet)
- AKS Cluster
- Regional PostgreSQL Database
- Regional Redis Cache
- Regional Key Vault
- Regional Storage Account

### Country Resources (This Module)
- **Country-specific Subnet** within regional VNet
- **Network Security Group** with country-specific rules
- **Storage Account** (for data residency)
- **Key Vault** (optional, for high-isolation countries)
- **AKS Node Pool** (optional, for isolated workloads)
- **PostgreSQL Database** (optional, for strict data sovereignty)

## Features

### 1. Data Residency Enforcement
- Country-specific storage accounts ensure data remains within country boundaries
- Configurable per-country based on local data protection laws
- Zone-redundant storage (ZRS) for high availability within the same region

### 2. Compliance Isolation Levels

#### Standard Isolation (Default)
- Shared regional resources (Key Vault, Database, Node Pools)
- Country-specific subnet and storage
- Suitable for: US, Kenya, Nigeria, South Africa

#### High Isolation
- Dedicated Key Vault for country-specific secrets
- Dedicated AKS node pool with country labels and taints
- Dedicated PostgreSQL database
- Suitable for: Germany (GDPR/BDSG), Switzerland, countries with strict data protection laws

### 3. Network Segmentation
- Each country gets its own subnet within the regional VNet
- Country-specific Network Security Groups
- Service endpoints for Azure services (Storage, Key Vault, SQL, Web)

### 4. Compliance Tagging
- Automatic tagging with compliance standards (GDPR, HIPAA, POPIA, NDPR, KDPA)
- Regulatory body identification
- Data classification levels

## Module Inputs

### Required Variables

| Variable | Description | Type |
|----------|-------------|------|
| `country_code` | ISO 3166-1 alpha-2 country code (e.g., US, DE, KE) | string |
| `country_name` | Full country name | string |
| `region_id` | Regional identifier (americas, europe, africa) | string |
| `location` | Azure region location | string |
| `subnet_cidr` | CIDR block for country subnet | string |
| `regional_resource_group_name` | Regional resource group name | string |
| `regional_vnet_name` | Regional VNet name | string |
| `regional_aks_cluster_name` | Regional AKS cluster name | string |

### Isolation & Compliance

| Variable | Description | Default |
|----------|-------------|---------|
| `isolation_enabled` | Enable high isolation (dedicated Key Vault, etc.) | false |
| `data_residency_required` | Create country-specific storage account | true |
| `compliance_tags` | List of compliance standards | [] |

### Dedicated Resources

| Variable | Description | Default |
|----------|-------------|---------|
| `dedicated_node_pool` | Create dedicated AKS node pool | false |
| `dedicated_database` | Create dedicated PostgreSQL database | false |
| `node_pool_vm_size` | VM size for node pool | Standard_D4s_v3 |
| `postgresql_storage_mb` | PostgreSQL storage in MB | 65536 (64 GB) |

## Module Outputs

### Network Outputs
- `subnet_id` - Country subnet ID
- `subnet_name` - Country subnet name
- `network_security_group_id` - NSG ID

### Storage Outputs
- `storage_account_id` - Storage account ID (if data residency enabled)
- `storage_account_name` - Storage account name
- `storage_containers` - Map of container names

### High-Isolation Outputs
- `keyvault_id` - Key Vault ID (if isolation enabled)
- `keyvault_uri` - Key Vault URI
- `node_pool_id` - Dedicated node pool ID
- `postgresql_server_fqdn` - Dedicated database FQDN

## Usage Examples

### Standard Country Deployment (United States)

```hcl
module "country_us" {
  source = "./modules/country"

  # Basic Configuration
  country_code   = "US"
  country_name   = "United States"
  region_id      = "americas"
  location       = "eastus"
  location_short = "eus"

  # Regional References
  regional_resource_group_name = module.americas.resource_group_name
  regional_vnet_name           = module.americas.vnet_name
  regional_aks_cluster_name    = module.americas.aks_cluster_name
  regional_aks_subnet_prefix   = "10.10.0.0/20"

  # Network
  subnet_cidr = "10.10.48.0/24"

  # Compliance
  isolation_enabled       = false  # Standard isolation
  data_residency_required = true   # HIPAA requires US data residency
  compliance_tags         = ["HIPAA", "SOC2", "ISO27001"]

  # Resources
  dedicated_node_pool = false  # Use shared regional node pools
  dedicated_database  = false  # Use shared regional database
}
```

### High-Isolation Country Deployment (Germany)

```hcl
module "country_de" {
  source = "./modules/country"

  # Basic Configuration
  country_code   = "DE"
  country_name   = "Germany"
  region_id      = "europe"
  location       = "westeurope"
  location_short = "weu"

  # Regional References
  regional_resource_group_name = module.europe.resource_group_name
  regional_vnet_name           = module.europe.vnet_name
  regional_aks_cluster_name    = module.europe.aks_cluster_name
  regional_aks_subnet_prefix   = "10.20.0.0/20"

  # Network
  subnet_cidr          = "10.20.48.0/24"
  database_subnet_cidr = "10.20.49.0/24"

  # Compliance (HIGH ISOLATION)
  isolation_enabled       = true  # Dedicated Key Vault required
  data_residency_required = true  # Strict data sovereignty
  compliance_tags         = ["GDPR", "ISO27001", "BDSG"]

  # Dedicated Resources
  dedicated_node_pool = true
  node_pool_vm_size   = "Standard_D8s_v3"
  node_pool_min_count = 3
  node_pool_max_count = 12

  dedicated_database        = true
  postgresql_admin_username = var.db_admin_username
  postgresql_admin_password = var.db_admin_password
  postgresql_storage_mb     = 131072  # 128 GB
}
```

## Compliance Standards by Country

| Country | Code | Compliance Standards | Isolation Level | Dedicated DB |
|---------|------|---------------------|-----------------|--------------|
| United States | US | HIPAA, SOC2, ISO27001, FedRAMP | Standard | No |
| Germany | DE | GDPR, ISO27001, BDSG | **High** | **Yes** |
| Kenya | KE | KDPA, ISO27001, SOC2 | Standard | No |
| Nigeria | NG | NDPR, ISO27001, SOC2 | Standard | No |
| South Africa | ZA | POPIA, ISO27001, SOC2 | Standard | No |

## Network Architecture

### Subnet Allocation

**Americas Region (10.10.0.0/16)**
- Regional AKS: `10.10.0.0/20`
- Regional Database: `10.10.16.0/24`
- Regional App Gateway: `10.10.32.0/24`
- US Country Subnet: `10.10.48.0/24`

**Europe Region (10.20.0.0/16)**
- Regional AKS: `10.20.0.0/20`
- Regional Database: `10.20.16.0/24`
- Regional App Gateway: `10.20.32.0/24`
- DE Country Subnet: `10.20.48.0/24`
- DE Country Database: `10.20.49.0/24`

**Africa Region (10.30.0.0/16)**
- Regional AKS: `10.30.0.0/20`
- Regional Database: `10.30.16.0/24`
- Regional App Gateway: `10.30.32.0/24`
- ZA Country Subnet: `10.30.48.0/24`
- KE Country Subnet: `10.30.50.0/24`
- NG Country Subnet: `10.30.52.0/24`

## Security

### Network Security Group Rules

**Inbound**
- Allow traffic from regional AKS subnet (ports 443, 80, 8080)
- Allow internal country subnet traffic
- Allow Azure Load Balancer
- Deny all other inbound traffic

**Outbound**
- Allow to Azure services (AzureCloud)
- Allow to VNet (VirtualNetwork)
- Allow to Internet

### Storage Account Security
- Private endpoints enabled
- Public network access denied
- Network rules restrict access to country subnet
- Soft delete enabled (30 days)
- Versioning enabled
- Change feed enabled

### Key Vault Security (High-Isolation Countries)
- RBAC authorization enabled
- Purge protection enabled
- Soft delete (90 days)
- Network ACLs restrict to country subnet
- Premium SKU with HSM backing

## Monitoring & Diagnostics

All country resources send diagnostics to the global Log Analytics workspace:

- **Network Security Group**: Flow logs, rule counter logs
- **Key Vault**: Audit events, policy evaluations
- **Storage Account**: Transaction metrics, capacity metrics
- **PostgreSQL**: Database logs, performance metrics

## Cost Considerations

### Standard Isolation Country
- Subnet: Free
- NSG: Free
- Storage Account: ~$20-50/month (ZRS)
- **Total**: ~$20-50/month

### High-Isolation Country (e.g., Germany)
- Subnet: Free
- NSG: Free
- Storage Account: ~$20-50/month (ZRS)
- Key Vault Premium: ~$200/month
- AKS Node Pool (3 x D8s_v3): ~$600/month
- PostgreSQL (D4s_v3 with HA): ~$800/month
- **Total**: ~$1,620-1,650/month

## Future Enhancements

- [ ] Country-specific Redis cache for session isolation
- [ ] Country-specific Azure Firewall for advanced network filtering
- [ ] Country-specific Application Gateway for L7 routing
- [ ] Private DNS zones for country-specific endpoints
- [ ] Cross-country replication with encryption

## Related Documentation

- [Global Infrastructure](../../../docs/infrastructure/global.md)
- [Regional Architecture](../../../docs/infrastructure/regional.md)
- [Compliance Guide](../../../docs/compliance/README.md)
- [Network Security](../../../docs/security/network.md)
