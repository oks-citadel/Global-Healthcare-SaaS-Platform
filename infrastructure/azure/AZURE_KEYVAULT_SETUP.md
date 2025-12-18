# Azure Key Vault Setup Guide

**Purpose:** Secure secret management for the Unified Healthcare Platform
**Compliance:** HIPAA-compliant secret storage
**Last Updated:** 2025-12-17

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Application Integration](#application-integration)
5. [Secret Management](#secret-management)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Prerequisites

### Required Tools

- **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Node.js**: Version 18.x or higher
- **npm/pnpm**: For installing dependencies
- **jq**: JSON processor (for parsing Azure CLI output)

### Azure Requirements

- Azure subscription
- Permissions to create:
  - Resource Groups
  - Key Vaults
  - Service Principals
- Azure AD tenant access

### Install Dependencies

```bash
cd services/api
pnpm install @azure/keyvault-secrets @azure/identity
```

---

## Quick Start

### 1. Login to Azure

```bash
az login
```

### 2. Set Environment Variables

```bash
export AZURE_RESOURCE_GROUP="unified-health-rg"
export AZURE_LOCATION="eastus"
export AZURE_KEY_VAULT_NAME="unified-health-kv-$(date +%s)"
export ENVIRONMENT="production"
```

### 3. Provision Key Vault

```bash
cd infrastructure/azure
chmod +x provision-keyvault.sh
./provision-keyvault.sh
```

### 4. Populate Secrets

```bash
chmod +x populate-keyvault.sh
./populate-keyvault.sh
```

### 5. Configure Application

Add to your `services/api/.env`:

```env
# Azure Key Vault Configuration
AZURE_KEY_VAULT_URL=https://your-keyvault-name.vault.azure.net/
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_KEY_VAULT_ENABLED=true
```

### 6. Test Integration

```bash
cd services/api
pnpm test:keyvault
```

---

## Detailed Setup

### Step 1: Azure Login and Subscription Selection

```bash
# Login to Azure
az login

# List available subscriptions
az account list --output table

# Set the subscription you want to use
az account set --subscription "your-subscription-id"

# Verify current subscription
az account show
```

### Step 2: Create Resource Group

If you don't already have a resource group:

```bash
az group create \
  --name unified-health-rg \
  --location eastus \
  --tags Environment=production Project=UnifiedHealthcare
```

### Step 3: Create Key Vault

```bash
az keyvault create \
  --name unified-health-kv-prod \
  --resource-group unified-health-rg \
  --location eastus \
  --enabled-for-deployment true \
  --enabled-for-disk-encryption true \
  --enabled-for-template-deployment true \
  --enable-soft-delete true \
  --soft-delete-retention-days 90 \
  --enable-purge-protection true \
  --sku premium
```

**Key Vault Features Enabled:**
- **Soft Delete**: Secrets can be recovered within 90 days
- **Purge Protection**: Prevents permanent deletion
- **Premium SKU**: Supports HSM-backed keys
- **Deployment Integration**: Allows VMs and templates to access secrets

### Step 4: Configure Access Policies

#### Grant Your User Access

```bash
# Get your user object ID
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

# Grant full permissions (for setup)
az keyvault set-policy \
  --name unified-health-kv-prod \
  --object-id $USER_OBJECT_ID \
  --secret-permissions get list set delete backup restore recover purge \
  --key-permissions get list create delete backup restore recover purge encrypt decrypt
```

#### Create Service Principal for Application

```bash
# Get Key Vault resource ID
KV_RESOURCE_ID=$(az keyvault show \
  --name unified-health-kv-prod \
  --resource-group unified-health-rg \
  --query id -o tsv)

# Create service principal
az ad sp create-for-rbac \
  --name "unified-health-app-sp-prod" \
  --role "Key Vault Secrets User" \
  --scopes $KV_RESOURCE_ID

# Output will include:
# - appId (AZURE_CLIENT_ID)
# - password (AZURE_CLIENT_SECRET)
# - tenant (AZURE_TENANT_ID)
```

**Save these credentials securely!**

### Step 5: Configure Diagnostic Settings

For HIPAA compliance, enable audit logging:

```bash
# Create Log Analytics workspace (if not exists)
az monitor log-analytics workspace create \
  --resource-group unified-health-rg \
  --workspace-name unified-health-logs

# Get workspace ID
WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group unified-health-rg \
  --workspace-name unified-health-logs \
  --query id -o tsv)

# Enable diagnostic settings
az monitor diagnostic-settings create \
  --name "KeyVault-Diagnostics" \
  --resource $KV_RESOURCE_ID \
  --workspace $WORKSPACE_ID \
  --logs '[
    {
      "category": "AuditEvent",
      "enabled": true,
      "retentionPolicy": {
        "enabled": true,
        "days": 2190
      }
    }
  ]' \
  --metrics '[
    {
      "category": "AllMetrics",
      "enabled": true,
      "retentionPolicy": {
        "enabled": true,
        "days": 365
      }
    }
  ]'
```

**Note:** 2190 days = 6 years (HIPAA requirement)

---

## Application Integration

### Installation

```bash
cd services/api
pnpm install @azure/keyvault-secrets @azure/identity
```

### Update package.json

```json
{
  "dependencies": {
    "@azure/keyvault-secrets": "^4.7.0",
    "@azure/identity": "^4.0.0"
  }
}
```

### Configuration

#### Option 1: Service Principal Authentication

```env
# .env file
AZURE_KEY_VAULT_URL=https://unified-health-kv-prod.vault.azure.net/
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_KEY_VAULT_ENABLED=true
```

#### Option 2: Managed Identity (Recommended for Azure-hosted apps)

```env
# .env file
AZURE_KEY_VAULT_URL=https://unified-health-kv-prod.vault.azure.net/
AZURE_USE_MANAGED_IDENTITY=true
AZURE_KEY_VAULT_ENABLED=true
```

### Usage in Code

```typescript
import { initializeKeyVault, getSecret } from './lib/azure-keyvault.js';

// Initialize at application startup
await initializeKeyVault();

// Get a secret
const jwtSecret = await getSecret('JWT_SECRET');
const dbPassword = await getSecret('DATABASE_PASSWORD');

// Secrets are automatically cached for 5 minutes
```

### Automatic Secret Loading

The Key Vault client automatically loads all secrets into `process.env` at startup:

```typescript
// In src/index.ts
import { initializeKeyVault } from './lib/azure-keyvault.js';

async function startServer() {
  // Load secrets from Key Vault
  await initializeKeyVault();

  // Now all secrets are available via process.env
  const jwtSecret = process.env.JWT_SECRET;
}
```

---

## Secret Management

### Adding Secrets

#### Using Azure CLI

```bash
az keyvault secret set \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET" \
  --value "your-secret-value-here" \
  --description "JWT signing secret" \
  --content-type "text/plain"
```

#### Using the Populate Script

```bash
./populate-keyvault.sh
```

The script will prompt you for each secret value.

### Listing Secrets

```bash
az keyvault secret list \
  --vault-name unified-health-kv-prod \
  --query "[].{Name:name, Enabled:attributes.enabled}" \
  --output table
```

### Retrieving Secrets

```bash
az keyvault secret show \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET" \
  --query value \
  --output tsv
```

### Updating Secrets

```bash
az keyvault secret set \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET" \
  --value "new-secret-value"
```

### Deleting Secrets

```bash
# Soft delete (recoverable for 90 days)
az keyvault secret delete \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET"

# Recover deleted secret
az keyvault secret recover \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET"

# Purge (permanent deletion, requires purge permission)
az keyvault secret purge \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET"
```

### Secret Versioning

Key Vault automatically versions secrets:

```bash
# List all versions
az keyvault secret list-versions \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET"

# Get specific version
az keyvault secret show \
  --vault-name unified-health-kv-prod \
  --name "JWT-SECRET" \
  --version "version-id"
```

---

## Secret Naming Convention

**Format:** Use hyphens (-) in Key Vault, automatically converted to underscores (_) for environment variables.

| Key Vault Secret Name | Environment Variable |
|-----------------------|---------------------|
| JWT-SECRET | JWT_SECRET |
| DATABASE-URL | DATABASE_URL |
| STRIPE-SECRET-KEY | STRIPE_SECRET_KEY |
| TWILIO-AUTH-TOKEN | TWILIO_AUTH_TOKEN |

---

## Secrets to Store

### Critical Secrets

```bash
# Authentication & Encryption
JWT-SECRET
ENCRYPTION-KEY

# Database
DATABASE-URL
DATABASE-PASSWORD

# Redis
REDIS-PASSWORD

# Third-Party Services
STRIPE-SECRET-KEY
STRIPE-WEBHOOK-SECRET
TWILIO-ACCOUNT-SID
TWILIO-AUTH-TOKEN
SENDGRID-API-KEY
ANTHROPIC-API-KEY
OPENAI-API-KEY

# Cloud Storage
AWS-ACCESS-KEY-ID
AWS-SECRET-ACCESS-KEY

# Push Notifications
FCM-SERVER-KEY
APNS-KEY-ID
VAPID-PRIVATE-KEY
```

---

## Troubleshooting

### Issue: Authentication Failed

**Error:** `Authentication failed: Invalid client secret`

**Solutions:**
1. Verify service principal credentials:
   ```bash
   az ad sp show --id $AZURE_CLIENT_ID
   ```
2. Regenerate client secret:
   ```bash
   az ad sp credential reset --id $AZURE_CLIENT_ID
   ```
3. Check `.env` file has correct values

### Issue: Access Denied

**Error:** `Access denied to Key Vault`

**Solutions:**
1. Verify access policy:
   ```bash
   az keyvault show --name unified-health-kv-prod \
     --query "properties.accessPolicies"
   ```
2. Grant access to service principal:
   ```bash
   az keyvault set-policy \
     --name unified-health-kv-prod \
     --spn $AZURE_CLIENT_ID \
     --secret-permissions get list
   ```

### Issue: Key Vault Not Found

**Error:** `The Resource 'Microsoft.KeyVault/vaults/...' could not be found`

**Solutions:**
1. Verify Key Vault exists:
   ```bash
   az keyvault list --query "[].name"
   ```
2. Check subscription and resource group
3. Verify spelling of Key Vault name

### Issue: Slow Secret Retrieval

**Cause:** Network latency to Azure

**Solutions:**
1. Secrets are cached for 5 minutes by default
2. Use `loadAllSecrets()` at startup to preload
3. Consider increasing cache TTL
4. Deploy app in same Azure region as Key Vault

---

## Best Practices

### Security

1. **Use Managed Identity** when hosting on Azure
   - No credentials in code or config
   - Automatic credential rotation

2. **Enable Soft Delete & Purge Protection**
   - Prevents accidental deletion
   - Required for production

3. **Use Premium SKU** for production
   - HSM-backed keys
   - Better performance
   - Enhanced security

4. **Implement Least Privilege**
   - Grant minimum required permissions
   - Separate service principals per application

5. **Enable Diagnostic Logging**
   - Required for HIPAA compliance
   - 6-year retention minimum

### Operational

1. **Secret Rotation**
   - Rotate secrets every 90 days
   - Automate rotation when possible
   - Test rotation in staging first

2. **Monitoring**
   - Monitor access patterns
   - Alert on failed authentication
   - Track secret age

3. **Backup**
   - Key Vault is automatically backed up
   - Export critical secrets securely
   - Document recovery procedures

4. **Environment Separation**
   - Separate Key Vaults per environment
   - dev-keyvault, staging-keyvault, prod-keyvault
   - Never share secrets across environments

5. **Documentation**
   - Document all secrets and their purpose
   - Maintain secret inventory
   - Document rotation procedures

---

## Health Check

Verify Key Vault integration:

```typescript
import { keyVaultClient } from './lib/azure-keyvault.js';

// Check health
const health = await keyVaultClient.healthCheck();
console.log(health);
// { healthy: true, message: 'Key Vault is connected and accessible' }
```

---

## Migration from .env to Key Vault

### Step 1: Inventory Current Secrets

```bash
# List all env vars with sensitive data
grep -E "(SECRET|KEY|PASSWORD|TOKEN)" .env
```

### Step 2: Populate Key Vault

```bash
./populate-keyvault.sh
```

### Step 3: Update Application

Enable Key Vault in `.env`:

```env
AZURE_KEY_VAULT_ENABLED=true
```

### Step 4: Remove Secrets from .env

Comment out or remove secrets that are now in Key Vault:

```env
# JWT_SECRET=... (now in Key Vault)
# DATABASE_PASSWORD=... (now in Key Vault)
```

### Step 5: Test

```bash
pnpm test
pnpm start
```

### Step 6: Cleanup

Once verified, permanently remove secrets from:
- `.env` file
- Git history (if committed)
- CI/CD variables (if duplicated)

---

## Cost Estimation

### Azure Key Vault Pricing (US East, as of 2025)

- **Standard Tier**
  - Operations: $0.03 per 10,000 transactions
  - Certificate renewals: $3.00 per renewal

- **Premium Tier** (Recommended)
  - Operations: $0.03 per 10,000 transactions
  - HSM-protected keys: $1.00 per key per month
  - Certificate renewals: $3.00 per renewal

### Estimated Monthly Cost

For a typical healthcare platform:
- ~1,000,000 secret operations/month: $3.00
- 5 HSM-protected keys: $5.00
- Total: **~$8-10/month**

**Note:** Extremely cost-effective for the security benefits provided.

---

## References

- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
- [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault)
- [Best Practices for Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [HIPAA Compliance with Azure](https://docs.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us)

---

## Support

For issues or questions:
- **Email:** security@unifiedhealth.io
- **Documentation:** `/docs-unified/SECURITY_*.md`
- **Internal Wiki:** [Link to internal documentation]

---

**Last Updated:** 2025-12-17
**Maintained By:** Security Engineering Team
**Review Schedule:** Quarterly
