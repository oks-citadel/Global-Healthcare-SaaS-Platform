# Terraform Environment Configuration Guide

This guide provides instructions for working with the Terraform configurations across different environments.

## Environment Overview

| Environment | Purpose | Resource Sizing | High Availability |
|-------------|---------|-----------------|-------------------|
| **Development** | Local development and testing | Minimal resources, Basic tier services | No |
| **Staging** | Pre-production testing and validation | Medium resources, Standard tier services | Partial |
| **Production** | Live production workloads | High resources, Premium tier services | Full |

## File Structure

```
infrastructure/terraform/
├── backend.tf                      # Backend configuration (Azure Storage)
├── variables.tf                    # Variable definitions
├── main.tf                         # Main infrastructure code
└── environments/
    ├── dev.tfvars                  # Development variables
    ├── dev.tfbackend              # Development backend config
    ├── staging.tfvars             # Staging variables
    ├── staging.tfbackend          # Staging backend config
    ├── prod.tfvars                # Production variables
    └── prod.tfbackend             # Production backend config
```

## Quick Start

### 1. Setup Azure Storage Backend (One-time setup)

Before using Terraform, create the Azure Storage infrastructure for state management:

```bash
# Set variables
RESOURCE_GROUP="unified-health-tfstate-rg"
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create storage accounts (one per environment)
az storage account create \
  --name unifiedhealthtfstatedev \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2

az storage account create \
  --name unifiedhealthtfstatestg \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_GRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2

az storage account create \
  --name unifiedhealthtfstateprd \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_GZRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2

# Create containers
az storage container create --name tfstate-dev --account-name unifiedhealthtfstatedev
az storage container create --name tfstate-staging --account-name unifiedhealthtfstatestg
az storage container create --name tfstate-prod --account-name unifiedhealthtfstateprd

# Enable versioning (recommended for production)
az storage account blob-service-properties update \
  --account-name unifiedhealthtfstateprd \
  --resource-group $RESOURCE_GROUP \
  --enable-versioning true

# Enable soft delete (recommended for production)
az storage account blob-service-properties update \
  --account-name unifiedhealthtfstateprd \
  --resource-group $RESOURCE_GROUP \
  --enable-delete-retention true \
  --delete-retention-days 30
```

### 2. Initialize Terraform for Each Environment

```bash
# Development
terraform init -backend-config=environments/dev.tfbackend

# Staging
terraform init -backend-config=environments/staging.tfbackend

# Production
terraform init -backend-config=environments/prod.tfbackend
```

### 3. Create PostgreSQL Password Secret

Before running terraform, set the PostgreSQL admin password:

```bash
# For development
export TF_VAR_postgresql_admin_password="YourSecureDevPassword123!"

# For staging
export TF_VAR_postgresql_admin_password="YourSecureStagingPassword123!"

# For production
export TF_VAR_postgresql_admin_password="YourSecureProductionPassword123!"
```

Alternatively, create a `terraform.tfvars` file (DO NOT commit this to git):

```hcl
postgresql_admin_password = "YourSecurePassword123!"
```

### 4. Plan and Apply

```bash
# Development
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars

# Staging
terraform plan -var-file=environments/staging.tfvars
terraform apply -var-file=environments/staging.tfvars

# Production
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

## Environment-Specific Configurations

### Development Environment

**Purpose**: Local development, feature testing, experimentation

**Configuration Highlights**:
- Minimal resources to reduce costs
- Basic tier services (PostgreSQL Basic, Redis Basic)
- Small VM sizes (Standard_DS2_v2)
- Limited scaling (2-5 nodes)
- No geo-replication

**Network**: 10.1.0.0/16

### Staging Environment

**Purpose**: Pre-production testing, integration validation, load testing

**Configuration Highlights**:
- Production-like architecture with reduced capacity
- Standard tier services
- Medium VM sizes (Standard_DS3_v2)
- Moderate scaling (3-8 nodes)
- No geo-replication (cost optimization)

**Network**: 10.2.0.0/16

### Production Environment

**Purpose**: Live production workloads serving real users

**Configuration Highlights**:
- High availability and scalability
- Premium tier services (Redis Premium)
- Memory-optimized database (MO_Standard_E4s_v3)
- Large VM sizes (Standard_DS4_v2 for user nodes)
- Aggressive scaling (5-20 nodes)
- ACR geo-replication to West US and West Europe
- Zone redundancy enabled

**Network**: 10.0.0.0/16

## Resource Comparison

| Resource | Development | Staging | Production |
|----------|-------------|---------|------------|
| **AKS System Nodes** | 2-3 nodes, DS2_v2 | 2-4 nodes, DS2_v2 | 3-6 nodes, DS3_v2 |
| **AKS User Nodes** | 2-5 nodes, DS2_v2 | 3-8 nodes, DS3_v2 | 5-20 nodes, DS4_v2 |
| **PostgreSQL** | Basic B1ms, 32 GB | GP D2s_v3, 64 GB | MO E4s_v3, 256 GB |
| **Redis Cache** | Basic C0 | Standard C1 | Premium P2 |
| **ACR Geo-Replication** | None | None | 2 regions |

## Best Practices

### Security

1. **Never commit sensitive data**:
   - Add `*.tfvars` with secrets to `.gitignore`
   - Use environment variables or Azure Key Vault for secrets
   - Use `terraform.tfvars.example` for reference

2. **Use Azure AD authentication**:
   - Avoid using storage account access keys
   - Grant "Storage Blob Data Contributor" role to users/service principals

3. **Enable audit logging**:
   - Monitor state file access
   - Review changes regularly

### State Management

1. **Always use backend configuration**:
   - Never use local state for shared infrastructure
   - Always specify `-backend-config` during init

2. **Protect production state**:
   - Enable versioning and soft delete
   - Use resource locks to prevent deletion
   - Implement approval workflows for production changes

3. **Separate state per environment**:
   - Use different storage accounts for isolation
   - Prevents accidental cross-environment changes

### Workflow

1. **Development workflow**:
   ```bash
   terraform init -backend-config=environments/dev.tfbackend
   terraform plan -var-file=environments/dev.tfvars
   terraform apply -var-file=environments/dev.tfvars
   ```

2. **Promotion to staging**:
   - Test in dev first
   - Review plan carefully
   - Apply to staging for integration testing

3. **Production deployment**:
   - Test in both dev and staging
   - Require peer review of plan
   - Apply during maintenance window
   - Have rollback plan ready

## Troubleshooting

### Backend Initialization Errors

**Problem**: `Error: Failed to get existing workspaces`

**Solution**: Ensure storage account exists and you have proper permissions

```bash
# Verify storage account exists
az storage account show --name unifiedhealthtfstatedev --resource-group unified-health-tfstate-rg

# Grant yourself permissions
az role assignment create \
  --role "Storage Blob Data Contributor" \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/unified-health-tfstate-rg
```

### State Lock Errors

**Problem**: `Error acquiring the state lock`

**Solution**: Release the lease if no one is actually running Terraform

```bash
# Check for active leases
az storage blob lease list \
  --container-name tfstate-dev \
  --account-name unifiedhealthtfstatedev

# Break lease if stuck (use with caution)
az storage blob lease break \
  --blob-name dev/terraform.tfstate \
  --container-name tfstate-dev \
  --account-name unifiedhealthtfstatedev
```

## HIPAA Compliance Notes

Terraform state files may contain:
- Resource identifiers
- Network configurations
- Connection strings (if not using secrets properly)

To maintain compliance:
- Encrypt state at rest (enabled by default in Azure Storage)
- Restrict access using RBAC
- Enable audit logging
- Use private endpoints for storage accounts
- Never commit state files to version control
- Implement data retention policies

## Support

For questions or issues:
1. Review this documentation
2. Check Azure Terraform provider docs
3. Consult with DevOps team
4. Refer to backend.tf for detailed setup instructions
