# ============================================
# Terraform Backend Configuration
# ============================================
# Configures Azure Storage as the backend for Terraform state management
# Provides state locking, versioning, and team collaboration capabilities
#
# IMPORTANT: Before using this backend, you must:
# 1. Create an Azure Storage Account for state storage
# 2. Create containers for each environment (tfstate-dev, tfstate-staging, tfstate-prod)
# 3. Enable versioning and soft delete on the storage account
# 4. Configure appropriate RBAC permissions
#
# Usage:
#   terraform init -backend-config=environments/dev.tfbackend
#   terraform init -backend-config=environments/staging.tfbackend
#   terraform init -backend-config=environments/prod.tfbackend

terraform {
  backend "azurerm" {
    # Backend configuration is provided via -backend-config flag during init
    # This allows different state files per environment while keeping code DRY

    # Key features of Azure Storage backend:
    # - Automatic state locking using blob leases (prevents concurrent modifications)
    # - Encryption at rest (Azure Storage Service Encryption)
    # - Versioning support (when enabled on storage account)
    # - Soft delete protection (when enabled on storage account)
    # - Access control via Azure RBAC
    # - Geo-redundant storage options available

    # Configuration values are loaded from environment-specific .tfbackend files:
    # - resource_group_name: Resource group containing the storage account
    # - storage_account_name: Azure Storage account name (must be globally unique)
    # - container_name: Blob container for state files
    # - key: Path to the state file within the container
  }
}

# ============================================
# Backend Setup Instructions
# ============================================
#
# To create the required Azure Storage infrastructure, run these commands:
#
# 1. Create resource group for state storage:
#    az group create --name unified-health-tfstate-rg --location eastus
#
# 2. Create storage accounts (one per environment for isolation):
#    az storage account create \
#      --name unifiedhealthtfstatedev \
#      --resource-group unified-health-tfstate-rg \
#      --location eastus \
#      --sku Standard_LRS \
#      --encryption-services blob \
#      --https-only true \
#      --min-tls-version TLS1_2
#
#    az storage account create \
#      --name unifiedhealthtfstatestg \
#      --resource-group unified-health-tfstate-rg \
#      --location eastus \
#      --sku Standard_GRS \
#      --encryption-services blob \
#      --https-only true \
#      --min-tls-version TLS1_2
#
#    az storage account create \
#      --name unifiedhealthtfstateprd \
#      --resource-group unified-health-tfstate-rg \
#      --location eastus \
#      --sku Standard_GZRS \
#      --encryption-services blob \
#      --https-only true \
#      --min-tls-version TLS1_2
#
# 3. Enable versioning (recommended for all, required for prod):
#    az storage account blob-service-properties update \
#      --account-name unifiedhealthtfstateprd \
#      --resource-group unified-health-tfstate-rg \
#      --enable-versioning true
#
# 4. Enable soft delete (recommended, especially for prod):
#    az storage account blob-service-properties update \
#      --account-name unifiedhealthtfstateprd \
#      --resource-group unified-health-tfstate-rg \
#      --enable-delete-retention true \
#      --delete-retention-days 30
#
# 5. Create blob containers:
#    az storage container create \
#      --name tfstate-dev \
#      --account-name unifiedhealthtfstatedev
#
#    az storage container create \
#      --name tfstate-staging \
#      --account-name unifiedhealthtfstatestg
#
#    az storage container create \
#      --name tfstate-prod \
#      --account-name unifiedhealthtfstateprd
#
# 6. Configure access (use Azure AD authentication instead of access keys):
#    az role assignment create \
#      --role "Storage Blob Data Contributor" \
#      --assignee <your-user-or-service-principal-id> \
#      --scope /subscriptions/<subscription-id>/resourceGroups/unified-health-tfstate-rg
#
# ============================================
# Security Recommendations
# ============================================
#
# For Production:
# - Use Standard_GZRS (geo-zone-redundant storage) for disaster recovery
# - Enable versioning and soft delete
# - Restrict network access using firewall rules
# - Use Azure AD authentication (avoid access keys)
# - Enable Azure Defender for Storage
# - Implement backup strategy
# - Use separate storage accounts per environment
# - Enable audit logging
# - Apply resource locks to prevent accidental deletion
#
# For Staging:
# - Use Standard_GRS (geo-redundant storage) for redundancy
# - Enable versioning
# - Use Azure AD authentication
#
# For Development:
# - Standard_LRS (locally redundant) is sufficient
# - Basic security controls are acceptable
#
# ============================================
# HIPAA Compliance Considerations
# ============================================
#
# Terraform state files may contain sensitive information:
# - Database connection strings
# - IP addresses and network configurations
# - Resource identifiers
#
# To maintain HIPAA compliance:
# - Use encrypted storage (enabled by default in Azure)
# - Restrict access using RBAC
# - Enable audit logging
# - Regularly review access logs
# - Implement data retention policies
# - Use private endpoints for storage accounts
# - Ensure state files are never committed to version control
