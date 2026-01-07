# UnifiedHealth Platform - Infrastructure Summary

## Overview

This document provides a comprehensive overview of the Azure infrastructure setup for the UnifiedHealth Platform, including all resources, security configurations, and deployment procedures.

## Infrastructure Components

### Core Infrastructure (main.tf)

#### 1. Resource Group
- **Name Pattern**: `rg-unified-health-{environment}`
- **Purpose**: Logical container for all environment resources
- **Tags**: Project, Environment, ManagedBy, CostCenter

#### 2. Virtual Network
- **Name Pattern**: `vnet-unified-health-{environment}`
- **Address Spaces**:
  - Dev: `10.1.0.0/16`
  - Staging: `10.2.0.0/16`
  - Prod: `10.0.0.0/16`

**Subnets**:
- **AKS Subnet**: `/20` CIDR (4,096 IPs)
  - System and user node pools
  - Azure CNI networking
- **Database Subnet**: `/24` CIDR (256 IPs)
  - PostgreSQL Flexible Server
  - Delegated to Microsoft.DBforPostgreSQL/flexibleServers
- **Application Gateway Subnet**: `/24` CIDR (256 IPs)
  - Optional, for Application Gateway deployment

#### 3. Azure Kubernetes Service (AKS)
- **Name Pattern**: `aks-unified-health-{environment}`
- **Kubernetes Version**: 1.28.3
- **Network Plugin**: Azure CNI
- **Network Policy**: Calico

**Node Pools**:

| Environment | System Nodes | User Nodes | VM Size (System) | VM Size (User) |
|-------------|--------------|------------|------------------|----------------|
| Dev         | 2-3          | 2-5        | Standard_DS2_v2  | Standard_DS2_v2 |
| Staging     | 2-4          | 3-8        | Standard_DS2_v2  | Standard_DS3_v2 |
| Prod        | 3-6          | 5-20       | Standard_DS3_v2  | Standard_DS4_v2 |

**Features**:
- Auto-scaling enabled on all node pools
- Azure Monitor integration (OMS agent)
- Key Vault Secrets Provider with secret rotation
- System-assigned managed identity
- RBAC enabled

#### 4. Azure Container Registry (ACR)
- **Name Pattern**: `acrunifiedhealth{environment}`
- **SKU**:
  - Dev/Staging: Standard
  - Prod: Premium (with geo-replication)
- **Geo-Replication** (Prod only):
  - Primary: East US
  - Replicas: West US, West Europe (zone-redundant)
- **Admin Access**: Disabled (managed identity authentication)

#### 5. Azure Key Vault
- **Name Pattern**: `kv-unified-health-{environment}`
- **SKU**: Standard
- **Soft Delete**: 90 days retention
- **Purge Protection**: Enabled
- **RBAC**: Enabled (no access policies)
- **Audit Logs**: Enabled via diagnostic settings

#### 6. PostgreSQL Flexible Server
- **Name Pattern**: `psql-unified-health-{environment}`
- **Version**: 15
- **SKU**:
  - Dev: `B_Standard_B1ms` (Burstable)
  - Staging: `GP_Standard_D2s_v3` (General Purpose)
  - Prod: `MO_Standard_E4s_v3` (Memory Optimized)
- **Storage**:
  - Dev: 32 GB
  - Staging: 64 GB
  - Prod: 256 GB
- **Backup Retention**: 35 days
- **Private Access**: Via delegated subnet and private DNS zone
- **Database**: `unified_health` (UTF8, en_US.utf8)

#### 7. Azure Redis Cache
- **Name Pattern**: `redis-unified-health-{environment}`
- **SKU**:
  - Dev: Basic (C0)
  - Staging: Standard (C1)
  - Prod: Premium (P2)
- **TLS**: 1.2 minimum
- **Non-SSL Port**: Disabled
- **Maxmemory Policy**: allkeys-lru

#### 8. Storage Account
- **Name Pattern**: `stunifiedhealth{environment}`
- **Tier**: Standard
- **Replication**:
  - Dev: LRS (Locally Redundant)
  - Staging: GRS (Geo-Redundant)
  - Prod: GRS (Geo-Redundant)
- **TLS**: 1.2 minimum
- **Blob Versioning**: Enabled
- **Public Access**: Disabled
- **Containers**: `documents` (private)

#### 9. Log Analytics Workspace
- **Name Pattern**: `log-unified-health-{environment}`
- **SKU**: PerGB2018
- **Retention**: 30 days
- **Purpose**: Centralized logging for all Azure resources

### Network Security

#### Network Security Groups (NSGs)

**AKS NSG** (`nsg-aks-{environment}`):

| Priority | Direction | Protocol | Ports | Source | Destination | Action |
|----------|-----------|----------|-------|--------|-------------|--------|
| 100 | Inbound | TCP | 443, 80 | AppGW Subnet | AKS Subnet | Allow |
| 110 | Inbound | TCP | 443 | AzureCloud | AKS Subnet | Allow |
| 120 | Inbound | * | * | AKS Subnet | AKS Subnet | Allow |
| 130 | Inbound | * | * | AzureLoadBalancer | * | Allow |
| 4096 | Inbound | * | * | * | * | Deny |
| 100 | Outbound | TCP | 5432 | AKS Subnet | DB Subnet | Allow |
| 110 | Outbound | * | * | VirtualNetwork | VirtualNetwork | Allow |
| 120 | Outbound | * | * | VirtualNetwork | AzureCloud | Allow |
| 130 | Outbound | * | * | VirtualNetwork | Internet | Allow |

**Database NSG** (`nsg-database-{environment}`):

| Priority | Direction | Protocol | Ports | Source | Destination | Action |
|----------|-----------|----------|-------|--------|-------------|--------|
| 100 | Inbound | TCP | 5432 | AKS Subnet | DB Subnet | Allow |
| 4096 | Inbound | * | * | * | * | Deny |
| 100 | Outbound | * | * | VirtualNetwork | AzureCloud | Allow |

### Monitoring & Alerting

#### Application Insights
- **Name Pattern**: `appi-unified-health-{environment}`
- **Type**: Web
- **Retention**: 90 days
- **Integration**: Log Analytics workspace

#### Action Groups
- **Critical Alerts**: Email and webhook notifications
- **Email**: Configurable via `alert_email_address` variable
- **Webhook**: Optional (PagerDuty, Slack, Teams)

#### Metric Alerts

| Resource | Metric | Threshold | Severity |
|----------|--------|-----------|----------|
| AKS | Node CPU % | >80% | 2 |
| AKS | Node Memory % | >80% | 2 |
| PostgreSQL | CPU % | >80% | 2 |
| PostgreSQL | Storage % | >85% | 1 |
| Redis | CPU % | >80% | 2 |
| Redis | Memory % | >85% | 2 |

All alerts trigger every 5 minutes with a 15-minute evaluation window.

#### Diagnostic Settings

All resources send logs to Log Analytics:
- **Key Vault**: Audit events
- **Storage Account**: Transactions and capacity metrics
- **PostgreSQL**: Database logs and metrics
- **Redis**: Connected clients and metrics
- **AKS**: Container insights and metrics

## Optional Modules

### 1. Azure Front Door Module

**Location**: `modules/frontdoor/`

**Features**:
- Global CDN and load balancing
- Web Application Firewall (Premium tier)
- SSL/TLS termination
- Custom domain support
- Geo-filtering and rate limiting

**WAF Protection**:
- OWASP Core Rule Set 2.1
- Bot Manager Rule Set 1.0
- Custom rate limiting rules
- Security headers injection

**Usage**:
```hcl
module "frontdoor" {
  source              = "./modules/frontdoor"
  project_name        = var.project_name
  environment         = var.environment
  resource_group_name = azurerm_resource_group.main.name
  sku_name            = "Premium_AzureFrontDoor"

  origins = {
    primary = {
      host_name              = azurerm_kubernetes_cluster.main.fqdn
      origin_host_header     = "api.thetheunifiedhealth.com"
      priority               = 1
      weight                 = 1000
      location               = azurerm_resource_group.main.location
      private_link_target_id = azurerm_kubernetes_cluster.main.id
    }
  }
}
```

### 2. Application Gateway Module

**Location**: `modules/application-gateway/`

**Features**:
- Regional Layer 7 load balancing
- WAF v2 with OWASP 3.2
- SSL/TLS offloading
- Auto-scaling (2-10 instances)
- Zone redundancy (zones 1, 2, 3)

**Configuration**:
- HTTP to HTTPS redirect
- TLS 1.2+ enforcement
- Health probes with customizable paths
- Backend pool integration with AKS

**Usage**:
```hcl
module "application_gateway" {
  source                     = "./modules/application-gateway"
  project_name               = var.project_name
  environment                = var.environment
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  virtual_network_name       = azurerm_virtual_network.main.name
  appgw_subnet_prefix        = "10.0.32.0/24"
  key_vault_id               = azurerm_key_vault.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  ssl_certificate_name              = "unifiedhealth-ssl"
  ssl_certificate_key_vault_secret_id = azurerm_key_vault_certificate.ssl.secret_id
  backend_fqdns                     = [azurerm_kubernetes_cluster.main.fqdn]
}
```

### 3. Private Endpoints Module

**Location**: `modules/private-endpoints/`

**Features**:
- Private connectivity for Azure PaaS services
- Private DNS zones for name resolution
- Network isolation for HIPAA compliance

**Supported Services**:
- Key Vault (`privatelink.vaultcore.azure.net`)
- Storage Account - Blob (`privatelink.blob.core.windows.net`)
- Storage Account - File (`privatelink.file.core.windows.net`)
- Redis Cache (`privatelink.redis.cache.windows.net`)
- Container Registry (`privatelink.azurecr.io`)

**Usage**:
```hcl
module "private_endpoints" {
  source                        = "./modules/private-endpoints"
  project_name                  = var.project_name
  environment                   = var.environment
  location                      = azurerm_resource_group.main.location
  resource_group_name           = azurerm_resource_group.main.name
  virtual_network_name          = azurerm_virtual_network.main.name
  virtual_network_id            = azurerm_virtual_network.main.id
  private_endpoint_subnet_prefix = "10.0.48.0/24"

  key_vault_id           = azurerm_key_vault.main.id
  storage_account_id     = azurerm_storage_account.main.id
  redis_cache_id         = azurerm_redis_cache.main.id
  container_registry_id  = azurerm_container_registry.main.id
}
```

## Deployment Scripts

### Bash Script (deploy.sh)

**Features**:
- Pre-flight checks (Azure CLI, Terraform, authentication)
- Environment validation
- Terraform formatting and validation
- Backend initialization
- Plan, apply, or destroy actions
- Production safeguards (manual confirmation for destruction)

**Usage**:
```bash
# Plan deployment
./deploy.sh -e dev -a plan

# Apply deployment
./deploy.sh -e staging -a apply

# Destroy with auto-approve
./deploy.sh -e dev -a destroy -y
```

### PowerShell Script (deploy.ps1)

**Features**:
- Same functionality as Bash script
- Windows-native implementation
- Color-coded output
- Error handling and logging

**Usage**:
```powershell
# Plan deployment
.\deploy.ps1 -Environment dev -Action plan

# Apply deployment
.\deploy.ps1 -Environment staging -Action apply

# Auto-approve apply
.\deploy.ps1 -Environment dev -Action apply -AutoApprove
```

### Backend Setup Script (setup-backend.sh)

**Features**:
- Creates resource group for Terraform state
- Creates storage accounts for each environment
- Enables versioning and soft delete
- Configures retention policies
- Applies resource locks (production)

**Storage Accounts Created**:
- `unifiedhealthtfstatedev` (Standard_LRS, 7-day soft delete)
- `unifiedhealthtfstatestg` (Standard_GRS, 14-day soft delete)
- `unifiedhealthtfstateprd` (Standard_GZRS, 30-day soft delete, locked)

## Security & Compliance

### HIPAA Compliance Features

1. **Encryption**
   - All data encrypted at rest (Azure Storage Service Encryption)
   - TLS 1.2+ enforced for all connections
   - SSL certificate management via Key Vault

2. **Network Isolation**
   - Virtual network with micro-segmentation
   - NSGs with deny-by-default rules
   - Optional private endpoints for PaaS services
   - Database accessible only from application subnet

3. **Access Control**
   - Azure RBAC for all resources
   - Managed identities (no service principal keys)
   - Key Vault for secrets management
   - Role assignments with least privilege

4. **Audit & Monitoring**
   - Centralized logging to Log Analytics
   - Diagnostic settings on all resources
   - Real-time metric alerts
   - 90-day retention for audit logs
   - Application Insights for APM

5. **Data Protection**
   - Automated backups (35 days for PostgreSQL)
   - Blob versioning and soft delete
   - Geo-redundant storage (staging/prod)
   - Terraform state versioning and soft delete

### Security Best Practices Implemented

- No public IP addresses on backend services
- Service endpoints and private endpoints
- WAF protection (Application Gateway / Front Door)
- DDoS protection (Standard SKU load balancers)
- Resource locks on critical resources
- Soft delete and purge protection
- Secrets rotation via Key Vault
- Container image scanning (ACR)

## Cost Analysis

### Monthly Cost Estimates (USD)

#### Development Environment
| Resource | SKU/Size | Quantity | Monthly Cost |
|----------|----------|----------|--------------|
| AKS Nodes | DS2_v2 | 4 nodes | $140 |
| PostgreSQL | B1ms | 1 instance | $15 |
| Redis | Basic C0 | 1 instance | $17 |
| ACR | Standard | 1 registry | $20 |
| Storage | LRS | 100 GB | $2 |
| Log Analytics | PerGB | 10 GB/day | $30 |
| **Total** | | | **~$224/month** |

#### Staging Environment
| Resource | SKU/Size | Quantity | Monthly Cost |
|----------|----------|----------|--------------|
| AKS Nodes | DS2_v2/DS3_v2 | 5 nodes | $280 |
| PostgreSQL | D2s_v3 | 1 instance | $140 |
| Redis | Standard C1 | 1 instance | $75 |
| ACR | Standard | 1 registry | $20 |
| Storage | GRS | 500 GB | $25 |
| Log Analytics | PerGB | 20 GB/day | $60 |
| **Total** | | | **~$600/month** |

#### Production Environment
| Resource | SKU/Size | Quantity | Monthly Cost |
|----------|----------|----------|--------------|
| AKS Nodes | DS3_v2/DS4_v2 | 8-25 nodes | $800-2,500 |
| PostgreSQL | E4s_v3 | 1 instance | $580 |
| Redis | Premium P2 | 1 instance | $330 |
| ACR | Premium + Geo | 3 locations | $200 |
| Storage | GRS | 2 TB | $80 |
| Log Analytics | PerGB | 50 GB/day | $150 |
| App Gateway | WAF_v2 | Auto-scale | $300 |
| Front Door | Premium | 1 profile | $400 |
| **Total** | | | **~$2,840-4,540/month** |

### Cost Optimization Recommendations

1. **Reserved Instances**: 1-3 year commitments for 30-70% savings
2. **Auto-scaling**: Match capacity to demand
3. **Spot Instances**: For non-critical workloads (up to 90% savings)
4. **Storage Tiering**: Move cold data to Cool/Archive tiers
5. **Log Retention**: Adjust based on compliance requirements
6. **Right-sizing**: Monitor and adjust VM sizes based on utilization

## Outputs

The infrastructure produces the following outputs:

### Resource Identifiers
- `resource_group_name`: Resource group name
- `aks_cluster_name`: AKS cluster name
- `aks_cluster_id`: AKS cluster ID
- `acr_login_server`: ACR login server URL
- `acr_name`: ACR name

### Connection Information
- `aks_kube_config`: Kubernetes config (sensitive)
- `postgresql_fqdn`: PostgreSQL server FQDN
- `postgresql_database`: Database name
- `redis_hostname`: Redis hostname
- `redis_primary_key`: Redis access key (sensitive)

### Storage & Monitoring
- `storage_account_name`: Storage account name
- `storage_primary_connection_string`: Connection string (sensitive)
- `log_analytics_workspace_id`: Log Analytics workspace ID
- `application_insights_instrumentation_key`: App Insights key (sensitive)
- `application_insights_connection_string`: App Insights connection (sensitive)

### Key Vault
- `key_vault_uri`: Key Vault URI
- `key_vault_name`: Key Vault name

## Disaster Recovery

### Backup Strategy

1. **PostgreSQL**:
   - Automated daily backups
   - 35-day retention period
   - Point-in-time restore capability
   - Geo-redundant backup storage (prod)

2. **Storage Account**:
   - Blob versioning enabled
   - Soft delete (7-30 days)
   - Geo-redundant storage (GRS)
   - Manual snapshots for critical data

3. **Terraform State**:
   - Versioning enabled
   - Soft delete protection
   - Geo-redundant storage
   - State file backups before major changes

### Recovery Procedures

**RTO (Recovery Time Objective)**: 4 hours
**RPO (Recovery Point Objective)**: 1 hour

1. **Database Recovery**: Point-in-time restore via Azure CLI
2. **Storage Recovery**: Blob version rollback or soft delete restore
3. **Infrastructure Recovery**: Terraform state rollback and re-apply
4. **AKS Recovery**: Cluster re-creation with stored manifests

## Maintenance & Operations

### Regular Maintenance Tasks

**Daily**:
- Monitor alerts and dashboards
- Review Application Insights for errors
- Check backup completion

**Weekly**:
- Review cost analysis
- Security patching (AKS nodes auto-update)
- Log retention cleanup

**Monthly**:
- Certificate expiration checks
- Access review (RBAC assignments)
- Unused resource cleanup
- Performance tuning

**Quarterly**:
- Disaster recovery testing
- Terraform version updates
- Azure provider version updates
- Security audit

### Upgrade Procedures

1. **Kubernetes Upgrades**:
   - Test in dev/staging first
   - Review breaking changes
   - Upgrade during maintenance window
   - Monitor pod health post-upgrade

2. **PostgreSQL Upgrades**:
   - In-place version upgrade (15 -> 16)
   - Or restore to new server with new version
   - Test application compatibility

3. **Terraform Updates**:
   - Update provider versions
   - Run `terraform plan` to detect changes
   - Apply in dev first

## Support & Documentation

- **Terraform Registry**: https://registry.terraform.io/providers/hashicorp/azurerm/
- **Azure Documentation**: https://docs.microsoft.com/azure/
- **HIPAA Compliance**: https://docs.microsoft.com/azure/compliance/offerings/offering-hipaa-us
- **Azure Architecture**: https://docs.microsoft.com/azure/architecture/

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-17 | 1.0.0 | Initial infrastructure setup |
| | | - Core AKS, PostgreSQL, Redis infrastructure |
| | | - Front Door, Application Gateway, Private Endpoints modules |
| | | - NSG configurations for network security |
| | | - Monitoring and alerting setup |
| | | - Deployment automation scripts |

---

**Document Version**: 1.0.0
**Last Updated**: December 17, 2024
**Maintained By**: Infrastructure Team
