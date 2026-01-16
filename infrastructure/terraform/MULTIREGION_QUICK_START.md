# UnifiedHealth Platform - Multi-Region Quick Start

## Get Started in 5 Minutes

This guide will help you deploy the UnifiedHealth Platform across multiple Azure regions quickly and easily.

## Prerequisites Checklist

- Azure subscription with sufficient quota
- Azure CLI installed and logged in (`az login`)
- Terraform >= 1.6.0 installed
- kubectl installed (optional, for managing clusters)
- 45-60 minutes for deployment

## Quick Deploy

### Option 1: Using the Automated Script (Recommended)

```bash
# Navigate to terraform directory
cd infrastructure/terraform

# Run the deployment script
./deploy-multiregion.sh
```

The script will guide you through:
1. Prerequisites check
2. Configuration setup
3. Region selection
4. Deployment confirmation
5. Infrastructure creation
6. kubectl configuration

### Option 2: Using Makefile

```bash
# 1. Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings

# 2. Initialize
make -f Makefile.multiregion init

# 3. Plan
make -f Makefile.multiregion plan

# 4. Deploy
make -f Makefile.multiregion apply

# 5. Configure kubectl
make -f Makefile.multiregion kubeconfig
```

### Option 3: Using Terraform Directly

```bash
# 1. Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars

# 2. Initialize
terraform init

# 3. Plan
terraform plan -out=multiregion.tfplan

# 4. Apply
terraform apply multiregion.tfplan

# 5. View outputs
terraform output
```

## Essential Configuration

### Minimum Required Changes in terraform.tfvars

```hcl
# 1. Your Azure subscription ID
subscription_id = "your-subscription-id-here"

# 2. Change this password!
postgresql_admin_password = "YourSecurePassword123!"

# 3. Update email addresses
global_alert_email_address   = "ops@your-company.com"
americas_alert_email_address = "ops-americas@your-company.com"
europe_alert_email_address   = "ops-europe@your-company.com"
africa_alert_email_address   = "ops-africa@your-company.com"
```

## After Deployment

### 1. View Deployed Resources
```bash
terraform output
```

### 2. Configure kubectl for AKS
```bash
make -f Makefile.multiregion kubeconfig
kubectl config get-contexts
```

### 3. Login to Container Registry
```bash
ACR_NAME=$(terraform output -raw global_acr_name)
az acr login --name $ACR_NAME
```

## Cost Estimates

**Full Multi-Region (3 regions)**: ~$5,000-10,000/month

## What Gets Deployed?

### Global Resources
- Azure Container Registry (geo-replicated)
- Azure Front Door Premium with WAF
- Global Key Vault
- Log Analytics Workspace

### Per Region (3x)
- AKS Cluster (3+ nodes)
- PostgreSQL with HA
- Redis Premium Cache
- Regional Key Vault
- Virtual Network
- Storage Account

**Total**: ~110 Azure resources

## Regions & Compliance

| Region | Location | Compliance |
|--------|----------|------------|
| Americas | East US | HIPAA, SOC2 |
| Europe | West Europe | GDPR, ISO27001 |
| Africa | South Africa North | POPIA, ISO27001 |

## Next Steps

1. Configure DNS records
2. Deploy applications to AKS
3. Set up monitoring dashboards
4. Review security configurations

## Getting Help

- **Detailed Guide**: [MULTIREGION_DEPLOYMENT_GUIDE.md](./MULTIREGION_DEPLOYMENT_GUIDE.md)
- **Makefile Help**: `make -f Makefile.multiregion help`
- **Support**: devops@thetheunifiedhealth.com

---

**Ready to deploy?** Run `./deploy-multiregion.sh` to get started!
