# UnifiedHealth Platform - Multi-Region Deployment Guide

## Overview

This guide covers the deployment of the UnifiedHealth Platform across multiple Azure regions with full data residency compliance, regional isolation, and global traffic management.

## Architecture

### Global Resources
- **Azure Front Door Premium**: Global CDN and WAF with regional routing
- **Azure Container Registry**: Global registry with geo-replication to all regions
- **Azure Key Vault**: Global secrets management
- **Log Analytics Workspace**: Centralized logging and monitoring
- **Traffic Manager**: DNS-based global load balancing

### Regional Resources (Per Region)
Each region is fully independent with:
- **AKS Cluster**: 3+ system nodes, 3+ user nodes with zone redundancy
- **PostgreSQL Flexible Server**: Zone-redundant with HA configuration
- **Redis Cache**: Premium tier with persistence
- **Regional Key Vault**: Region-specific secrets
- **Virtual Network**: Isolated networking with optional peering
- **Storage Account**: Regional data storage with compliance controls
- **Application Insights**: Regional application monitoring

## Supported Regions

### 1. Americas (East US)
- **Location**: `eastus`
- **Compliance**: HIPAA, SOC2, ISO27001
- **Currencies**: USD, CAD, MXN
- **Data Residency**: Required
- **Config File**: `environments/prod-americas.tfvars`

### 2. Europe (West Europe)
- **Location**: `westeurope`
- **Compliance**: GDPR, ISO27001, SOC2
- **Currencies**: EUR, GBP, CHF, SEK, NOK
- **Data Residency**: Required
- **Config File**: `environments/prod-europe.tfvars`

### 3. Africa (South Africa North)
- **Location**: `southafricanorth`
- **Compliance**: POPIA, ISO27001, SOC2
- **Currencies**: ZAR, NGN, KES, EGP, GHS
- **Data Residency**: Required
- **Config File**: `environments/prod-africa.tfvars`

## Prerequisites

1. **Azure Subscription**
   - Active Azure subscription with sufficient quota
   - Owner or Contributor role
   - Ability to create Service Principals

2. **Required CLI Tools**
   ```bash
   # Azure CLI
   az --version  # Should be 2.50.0 or higher

   # Terraform
   terraform --version  # Should be 1.6.0 or higher

   # kubectl
   kubectl version --client  # Should be 1.28.0 or higher
   ```

3. **Resource Provider Registration**
   ```bash
   az provider register --namespace Microsoft.ContainerService
   az provider register --namespace Microsoft.Cdn
   az provider register --namespace Microsoft.Network
   az provider register --namespace Microsoft.DBforPostgreSQL
   az provider register --namespace Microsoft.Cache
   az provider register --namespace Microsoft.KeyVault
   az provider register --namespace Microsoft.OperationalInsights
   ```

4. **Terraform Backend** (Recommended)
   ```bash
   # Create storage account for Terraform state
   az group create --name rg-terraform-state --location eastus
   az storage account create --name tfstateunifiedhealth --resource-group rg-terraform-state --location eastus --sku Standard_LRS
   az storage container create --name tfstate --account-name tfstateunifiedhealth
   ```

## Deployment Steps

### Step 1: Clone and Navigate
```bash
cd "C:/Users/Dell/OneDrive/Documents/Unified Health Platform/Global-Healthcare-SaaS-Platform/infrastructure/terraform"
```

### Step 2: Review and Customize Configuration

Edit the regional tfvars files as needed:
- `environments/prod-americas.tfvars`
- `environments/prod-europe.tfvars`
- `environments/prod-africa.tfvars`

Key customizations:
- Email addresses for alerts
- Node counts and VM sizes
- PostgreSQL storage sizes
- Network CIDR ranges

### Step 3: Create Terraform Variables File

Create `terraform.tfvars`:
```hcl
# Azure Subscription
subscription_id = "your-subscription-id"

# Project Configuration
project_name = "unified-health"
environment  = "prod"

# Region Deployment Flags
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# Cross-Region Configuration
enable_cross_region_peering = false

# Database Credentials
postgresql_admin_username = "unifiedhealth_admin"
postgresql_admin_password = "YourSecurePassword123!"  # Change this!

# DNS Configuration
manage_dns    = false
dns_zone_name = "theunifiedhealth.com"

# Global Monitoring
global_alert_email_address = "ops@theunifiedhealth.com"
americas_alert_email_address = "ops-americas@theunifiedhealth.com"
europe_alert_email_address = "ops-europe@theunifiedhealth.com"
africa_alert_email_address = "ops-africa@theunifiedhealth.com"
```

### Step 4: Initialize Terraform
```bash
terraform init
```

### Step 5: Validate Configuration
```bash
terraform validate
```

### Step 6: Plan Deployment
```bash
# Full deployment
terraform plan -out=multiregion.tfplan

# Single region deployment (Americas only)
terraform plan -var="deploy_europe=false" -var="deploy_africa=false" -out=multiregion.tfplan
```

### Step 7: Apply Infrastructure
```bash
# Review the plan carefully before applying
terraform apply multiregion.tfplan

# This will take 45-60 minutes for full multi-region deployment
```

### Step 8: Verify Deployment
```bash
# Get deployment outputs
terraform output

# Verify global resources
terraform output global_acr_login_server
terraform output frontdoor_api_endpoint

# Verify regional resources
terraform output americas_aks_cluster_name
terraform output europe_aks_cluster_name
terraform output africa_aks_cluster_name
```

## Post-Deployment Configuration

### 1. Configure kubectl Access

```bash
# Americas
az aks get-credentials \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --name $(terraform output -raw americas_aks_cluster_name) \
  --context americas-prod

# Europe
az aks get-credentials \
  --resource-group $(terraform output -raw europe_resource_group_name) \
  --name $(terraform output -raw europe_aks_cluster_name) \
  --context europe-prod

# Africa
az aks get-credentials \
  --resource-group $(terraform output -raw africa_resource_group_name) \
  --name $(terraform output -raw africa_aks_cluster_name) \
  --context africa-prod

# Verify contexts
kubectl config get-contexts
```

### 2. Configure ECR Access

```bash
# Login to ECR
ECR_URL=$(terraform output -raw global_ecr_repository_url)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL

# Verify repositories
aws ecr describe-repositories
```

### 3. Deploy Application to Each Region

```bash
# Build and push container images
docker build -t $ECR_URL/unified-health-api:latest ./api
docker push $ECR_URL/unified-health-api:latest

# Deploy to Americas
kubectl --context americas-prod apply -f k8s/manifests/

# Deploy to Europe
kubectl --context europe-prod apply -f k8s/manifests/

# Deploy to Africa
kubectl --context africa-prod apply -f k8s/manifests/
```

### 4. Configure DNS

#### Option A: Using Azure DNS
```bash
# Get Front Door endpoint
FRONTDOOR_ENDPOINT=$(terraform output -raw frontdoor_api_endpoint)

# Add DNS records
az network dns record-set cname create \
  --resource-group rg-unified-health-global \
  --zone-name theunifiedhealth.com \
  --name api \
  --target $FRONTDOOR_ENDPOINT
```

#### Option B: External DNS Provider
Add CNAME records pointing to:
- API: `api.thetheunifiedhealth.com` → `<frontdoor_api_endpoint>`
- Web: `www.thetheunifiedhealth.com` → `<frontdoor_web_endpoint>`

### 5. Configure SSL/TLS Certificates

```bash
# Upload custom certificates to Azure Front Door
az afd custom-domain create \
  --profile-name $(terraform output -raw frontdoor_profile_name) \
  --resource-group rg-unified-health-global \
  --custom-domain-name api-unifiedhealth \
  --host-name api.thetheunifiedhealth.com \
  --certificate-type ManagedCertificate
```

## Monitoring and Operations

### View Logs (Centralized)
```bash
# Query Log Analytics workspace
WORKSPACE_ID=$(terraform output -raw global_log_analytics_workspace_id)

az monitor log-analytics query \
  --workspace $WORKSPACE_ID \
  --analytics-query "AzureDiagnostics | where TimeGenerated > ago(1h) | limit 100"
```

### Check Resource Health
```bash
# Americas AKS
az aks show \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --name $(terraform output -raw americas_aks_cluster_name) \
  --query "provisioningState"

# Check all regional databases
az postgres flexible-server list --output table
```

### Monitor Front Door Performance
```bash
# View Front Door metrics
az monitor metrics list \
  --resource $(terraform output -raw frontdoor_profile_name) \
  --metric "TotalLatency" \
  --interval PT1H
```

## Scaling Operations

### Scale AKS Nodes
```bash
# Scale Americas user node pool
az aks nodepool scale \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --cluster-name $(terraform output -raw americas_aks_cluster_name) \
  --name user \
  --node-count 10
```

### Scale PostgreSQL
```bash
# Scale Americas PostgreSQL
az postgres flexible-server update \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --name $(terraform output -raw americas_postgresql_fqdn | cut -d'.' -f1) \
  --sku-name GP_Standard_D8s_v3
```

## Disaster Recovery

### Regional Failover Process
1. Update Traffic Manager weights to redirect traffic
2. Verify backup region health
3. Update DNS if needed
4. Monitor application metrics

### Database Backup and Restore
```bash
# Trigger manual backup
az postgres flexible-server backup create \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --name $(terraform output -raw americas_postgresql_fqdn | cut -d'.' -f1) \
  --backup-name manual-backup-$(date +%Y%m%d)

# List available backups
az postgres flexible-server backup list \
  --resource-group $(terraform output -raw americas_resource_group_name) \
  --name $(terraform output -raw americas_postgresql_fqdn | cut -d'.' -f1)
```

## Cost Optimization

### Estimated Monthly Costs (per region)
- **AKS**: $500-1000 (depending on node count)
- **PostgreSQL**: $400-800 (GP_Standard_D4s_v3)
- **Redis Premium**: $300-500
- **Storage**: $50-100
- **Networking**: $100-200
- **Total per region**: ~$1,500-3,000/month

### Global Resources
- **Front Door Premium**: $300-500/month
- **ACR Premium**: $200-300/month
- **Total global**: ~$500-800/month

### Multi-Region Total
- **3 Regions + Global**: ~$5,000-10,000/month

### Cost Reduction Strategies
1. Use lower-tier VMs for non-prod environments
2. Enable autoscaling with aggressive scale-down policies
3. Use Azure Reserved Instances for predictable workloads
4. Implement data lifecycle policies for storage
5. Use Azure Cost Management for monitoring

## Compliance and Security

### Data Residency Verification
Each region enforces data residency through:
- Storage replication set to `ZRS` (Zone-Redundant Storage)
- PostgreSQL geo-replication disabled
- Regional Key Vaults for sensitive data
- Compliance tags on all resources

### Audit Logs
All resources send logs to centralized Log Analytics:
```bash
# Query audit logs
az monitor log-analytics query \
  --workspace $WORKSPACE_ID \
  --analytics-query "AuditLogs | where TimeGenerated > ago(24h)"
```

### Security Scanning
```bash
# Scan ACR images
az acr task create \
  --registry $ACR_NAME \
  --name vulnerability-scan \
  --context /dev/null \
  --cmd "az acr check-health --name $ACR_NAME"
```

## Troubleshooting

### Common Issues

#### 1. Terraform State Lock
```bash
# If deployment fails with state lock error
az storage blob lease break \
  --container-name tfstate \
  --blob-name terraform.tfstate \
  --account-name tfstateunifiedhealth
```

#### 2. AKS Node Not Ready
```bash
kubectl --context americas-prod get nodes
kubectl --context americas-prod describe node <node-name>
```

#### 3. PostgreSQL Connection Issues
```bash
# Test connectivity from AKS
kubectl --context americas-prod run -it --rm pg-test \
  --image=postgres:15 \
  --restart=Never \
  -- psql -h $(terraform output -raw americas_postgresql_fqdn) -U unifiedhealth_admin
```

#### 4. Front Door Routing Issues
```bash
# Check Front Door health probes
az afd endpoint show \
  --profile-name $(terraform output -raw frontdoor_profile_name) \
  --endpoint-name api-unified-health \
  --resource-group rg-unified-health-global
```

## Cleanup

### Destroy Single Region
```bash
terraform destroy -target=module.africa
```

### Destroy Entire Multi-Region Deployment
```bash
# WARNING: This will destroy ALL resources
terraform destroy

# Confirm by typing 'yes' when prompted
```

## Additional Resources

- [Azure AKS Documentation](https://learn.microsoft.com/azure/aks/)
- [Azure Front Door Documentation](https://learn.microsoft.com/azure/frontdoor/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [HIPAA Compliance on Azure](https://learn.microsoft.com/azure/compliance/offerings/offering-hipaa-us)
- [GDPR Compliance on Azure](https://learn.microsoft.com/azure/compliance/offerings/offering-gdpr-eu)

## Support

For issues or questions:
- Open an issue in the repository
- Contact the DevOps team: devops@thetheunifiedhealth.com
- Check the monitoring dashboard for real-time status

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
**Maintained By**: UnifiedHealth DevOps Team
