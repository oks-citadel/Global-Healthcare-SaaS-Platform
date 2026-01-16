# UnifiedHealth Platform - Multi-Region Infrastructure

## Overview

This directory contains Terraform infrastructure as code for deploying the UnifiedHealth Platform across multiple Azure regions with complete data residency compliance, regional isolation, and global traffic management.

## Quick Start

```bash
# 1. Initialize Terraform
make -f Makefile.multiregion init

# 2. Create terraform.tfvars with your configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings

# 3. Plan deployment
make -f Makefile.multiregion plan

# 4. Deploy infrastructure
make -f Makefile.multiregion apply

# 5. Configure kubectl
make -f Makefile.multiregion kubeconfig
```

## Architecture Overview

### Global Layer (Shared Resources)
```
┌─────────────────────────────────────────────────────────────┐
│                     GLOBAL RESOURCES                        │
├─────────────────────────────────────────────────────────────┤
│ • Azure Front Door Premium (CDN + WAF)                      │
│ • AWS ECR (Elastic Container Registry)                      │
│ • Global Key Vault                                          │
│ • Log Analytics Workspace                                   │
│ • Traffic Manager                                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   AMERICAS   │    │   EUROPE    │    │   AFRICA    │
│   (East US)  │    │(West Europe)│    │(SA North)   │
├──────────────┤    ├─────────────┤    ├─────────────┤
│ • AKS (3+)   │    │ • AKS (3+)  │    │ • AKS (3+)  │
│ • PostgreSQL │    │ • PostgreSQL│    │ • PostgreSQL│
│ • Redis      │    │ • Redis     │    │ • Redis     │
│ • Storage    │    │ • Storage   │    │ • Storage   │
│ • Key Vault  │    │ • Key Vault │    │ • Key Vault │
└──────────────┘    └─────────────┘    └─────────────┘
```

### Regional Isolation
Each region is **fully independent** with:
- Dedicated AKS cluster (3+ nodes)
- Regional PostgreSQL database with HA
- Regional Redis cache
- Regional storage account
- Regional Key Vault for secrets
- Data residency enforcement
- Compliance tagging

## File Structure

```
terraform/
├── main-multiregion.tf              # Multi-region orchestration
├── global.tf                        # Global shared resources
├── variables-multiregion.tf         # Multi-region variables
├── outputs-multiregion.tf           # Multi-region outputs
├── Makefile.multiregion             # Deployment automation
├── MULTIREGION_DEPLOYMENT_GUIDE.md  # Detailed guide
│
├── modules/
│   └── region/                      # Reusable regional module
│       ├── main.tf                  # Regional infrastructure
│       ├── variables.tf             # Regional variables
│       └── outputs.tf               # Regional outputs
│
└── environments/
    ├── prod-americas.tfvars         # Americas configuration
    ├── prod-europe.tfvars           # Europe configuration
    └── prod-africa.tfvars           # Africa configuration
```

## Regional Configurations

### Americas (East US)
- **Compliance**: HIPAA, SOC2, ISO27001
- **Currencies**: USD, CAD, MXN
- **Network**: 10.10.0.0/16
- **Config**: `environments/prod-americas.tfvars`

### Europe (West Europe)
- **Compliance**: GDPR, ISO27001, SOC2
- **Currencies**: EUR, GBP, CHF, SEK, NOK
- **Network**: 10.20.0.0/16
- **Config**: `environments/prod-europe.tfvars`

### Africa (South Africa North)
- **Compliance**: POPIA, ISO27001, SOC2
- **Currencies**: ZAR, NGN, KES, EGP, GHS
- **Network**: 10.30.0.0/16
- **Config**: `environments/prod-africa.tfvars`

## Key Features

### Data Residency Compliance
- ✅ Regional data storage with ZRS replication
- ✅ No cross-region data transfer
- ✅ PostgreSQL geo-replication disabled by default
- ✅ Regional Key Vaults for sensitive data
- ✅ Compliance tags on all resources

### High Availability
- ✅ Zone-redundant AKS clusters (3+ zones)
- ✅ PostgreSQL HA with zone redundancy
- ✅ Redis Premium with persistence
- ✅ Azure Front Door for global routing
- ✅ Traffic Manager for DNS failover

### Security
- ✅ Network isolation per region
- ✅ Private endpoints for all services
- ✅ WAF protection via Front Door
- ✅ RBAC-enabled Key Vaults
- ✅ NSG rules with least privilege

### Monitoring
- ✅ Centralized Log Analytics
- ✅ Regional Application Insights
- ✅ Metric alerts for critical resources
- ✅ Diagnostic settings enabled
- ✅ Compliance audit logs

## Deployment Options

### Full Multi-Region Deployment
```bash
make -f Makefile.multiregion plan
make -f Makefile.multiregion apply
```

### Single Region Deployment
```bash
# Deploy Americas only
make -f Makefile.multiregion plan-americas
make -f Makefile.multiregion apply

# Deploy Europe only
make -f Makefile.multiregion plan-europe
make -f Makefile.multiregion apply

# Deploy Africa only
make -f Makefile.multiregion plan-africa
make -f Makefile.multiregion apply
```

### Global Resources Only
```bash
make -f Makefile.multiregion deploy-global-only
```

## Configuration

### Required Variables

Create `terraform.tfvars`:

```hcl
# Azure Subscription
subscription_id = "your-subscription-id"

# Database Credentials (shared across regions)
postgresql_admin_username = "unifiedhealth_admin"
postgresql_admin_password = "YourSecurePassword123!"

# Region Deployment
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# Monitoring
global_alert_email_address   = "ops@theunifiedhealth.com"
americas_alert_email_address = "ops-americas@theunifiedhealth.com"
europe_alert_email_address   = "ops-europe@theunifiedhealth.com"
africa_alert_email_address   = "ops-africa@theunifiedhealth.com"
```

### Optional Variables

```hcl
# Cross-region networking (default: false)
enable_cross_region_peering = false

# DNS management (default: false)
manage_dns    = false
dns_zone_name = "theunifiedhealth.com"

# Kubernetes version (default: 1.28.3)
kubernetes_version = "1.28.3"
```

## Common Operations

### Deploy Infrastructure
```bash
# Full deployment
make -f Makefile.multiregion deploy-full

# Minimal deployment (1 region)
make -f Makefile.multiregion deploy-minimal
```

### Configure kubectl
```bash
# All regions
make -f Makefile.multiregion kubeconfig

# Specific region
make -f Makefile.multiregion kubeconfig-americas
make -f Makefile.multiregion kubeconfig-europe
make -f Makefile.multiregion kubeconfig-africa
```

### View Resources
```bash
# Show all outputs
make -f Makefile.multiregion output

# Show global resources
make -f Makefile.multiregion show-global

# Show regional resources
make -f Makefile.multiregion show-americas
make -f Makefile.multiregion show-europe
make -f Makefile.multiregion show-africa
```

### Health Checks
```bash
# Check all regions
make -f Makefile.multiregion health-check

# Check compliance
make -f Makefile.multiregion compliance-check
```

### Cost Management
```bash
# View cost estimate
make -f Makefile.multiregion cost-estimate
```

### Cleanup
```bash
# Destroy single region
make -f Makefile.multiregion destroy-americas

# Destroy all (requires confirmation)
make -f Makefile.multiregion destroy
```

## Resource Naming Convention

```
Format: <type>-<project>-<region>-<environment>

Examples:
- rg-unified-health-americas-prod
- aks-unified-health-europe-prod
- psql-unified-health-africa-prod
- kv-unified-health-eus-prod (uses short location code)
```

## Network Architecture

### CIDR Allocation
- **Americas**: 10.10.0.0/16
  - AKS: 10.10.0.0/20
  - Database: 10.10.16.0/24
  - AppGW: 10.10.32.0/24

- **Europe**: 10.20.0.0/16
  - AKS: 10.20.0.0/20
  - Database: 10.20.16.0/24
  - AppGW: 10.20.32.0/24

- **Africa**: 10.30.0.0/16
  - AKS: 10.30.0.0/20
  - Database: 10.30.16.0/24
  - AppGW: 10.30.32.0/24

### Cross-Region Connectivity
By default, regions are **isolated**. Enable VNet peering:

```hcl
enable_cross_region_peering = true
```

## Compliance & Audit

### Compliance Tags
All resources include:
- `ComplianceStandards`: Regional compliance requirements
- `DataResidency`: Required/Optional
- `Region`: Logical region name
- `Environment`: prod/staging

### Audit Logs
Centralized in Log Analytics workspace:

```bash
# Query audit logs
az monitor log-analytics query \
  --workspace $(terraform output -raw global_log_analytics_workspace_id) \
  --analytics-query "AuditLogs | where TimeGenerated > ago(24h)"
```

## Monitoring & Alerts

### Metric Alerts Configured
- AKS node CPU > 80%
- AKS node memory > 80%
- PostgreSQL CPU > 80%
- PostgreSQL storage > 85%
- Redis CPU > 80%
- Redis memory > 85%
- Front Door backend health

### Alert Recipients
- Global alerts → `global_alert_email_address`
- Regional alerts → Regional email addresses

## Disaster Recovery

### Regional Failover
1. Traffic Manager automatically routes to healthy regions
2. Front Door provides instant failover
3. Regional databases remain independent

### Backup Strategy
- PostgreSQL: 35-day retention, daily backups
- Redis: RDB backups every 60 minutes
- Storage: 30-day soft delete
- Container images: Geo-replicated to all regions

## Performance Optimization

### AKS Auto-scaling
- System pool: 3-6 nodes
- User pool: 3-20 nodes (varies by region)
- Zone-redundant for HA

### Database Performance
- PostgreSQL: GP_Standard_D4s_v3 (4 vCPU, 16GB RAM)
- Zone-redundant HA
- Connection pooling recommended

### Caching
- Redis Premium tier
- Zone redundancy
- Persistence enabled

## Cost Optimization

### Estimated Costs
- **Per Region**: $1,500-3,000/month
- **Global Resources**: $500-800/month
- **Total (3 regions)**: $5,000-10,000/month

### Cost Reduction
1. Use Reserved Instances
2. Enable aggressive autoscaling
3. Use lower tiers for non-prod
4. Implement storage lifecycle policies
5. Monitor with Azure Cost Management

## Troubleshooting

### Common Issues

**Terraform State Lock**
```bash
az storage blob lease break \
  --container-name tfstate \
  --blob-name terraform.tfstate \
  --account-name tfstateunifiedhealth
```

**AKS Connectivity**
```bash
kubectl --context americas-prod get nodes
kubectl --context americas-prod get pods -A
```

**PostgreSQL Connection**
```bash
kubectl --context americas-prod run -it --rm pg-test \
  --image=postgres:15 -- \
  psql -h <postgresql-fqdn> -U unifiedhealth_admin
```

**Check Resource Health**
```bash
make -f Makefile.multiregion health-check
```

## Best Practices

### Deployment
1. Always run `terraform plan` before `apply`
2. Deploy to staging first
3. Deploy regions sequentially for easier troubleshooting
4. Monitor deployment progress

### Operations
1. Use kubectl contexts to avoid mistakes
2. Implement GitOps for application deployment
3. Use Azure DevOps/GitHub Actions for CI/CD
4. Regular compliance audits

### Security
1. Rotate database passwords regularly
2. Use managed identities where possible
3. Review NSG rules periodically
4. Enable Azure Defender

## Support & Documentation

- **Detailed Guide**: [MULTIREGION_DEPLOYMENT_GUIDE.md](./MULTIREGION_DEPLOYMENT_GUIDE.md)
- **Module Documentation**: [modules/region/README.md](./modules/region/README.md)
- **Azure Documentation**: https://learn.microsoft.com/azure/
- **Terraform Registry**: https://registry.terraform.io/providers/hashicorp/azurerm/

## Version History

- **v1.0.0** (2025-12-18): Initial multi-region implementation
  - Support for Americas, Europe, and Africa
  - Full compliance controls
  - Data residency enforcement
  - Global traffic management

## Contributing

For changes or improvements:
1. Create a feature branch
2. Test in dev/staging environment
3. Submit pull request with documentation
4. Await review from DevOps team

## License

Copyright (c) 2025 UnifiedHealth Platform. All rights reserved.

---

**Questions?** Contact: devops@thetheunifiedhealth.com
