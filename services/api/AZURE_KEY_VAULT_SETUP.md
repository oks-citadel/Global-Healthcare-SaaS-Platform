# Azure Key Vault Integration - Setup Guide

## Overview

The Azure Key Vault integration has been successfully implemented in `services/api/src/lib/encryption.ts` with all three TODO items completed:

1. Azure Key Vault integration for retrieving encryption keys (Line 289)
2. Key storage implementation (Line 301)
3. Key rotation implementation (Line 311)

## Installation

Install the required Azure packages:

```bash
cd services/api
npm install @azure/keyvault-secrets @azure/identity
```

## Environment Variables

Configure the following environment variables in your `.env` file:

```env
# Required for Production
AZURE_KEY_VAULT_URL=https://your-keyvault-name.vault.azure.net/

# Authentication (one of the following methods)
# Method 1: Service Principal (Recommended for production)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# Method 2: Managed Identity (Automatically used in Azure environments)
# No additional environment variables needed

# Optional
NODE_ENV=production
ENCRYPTION_KEY=fallback-key-for-development-only
```

## Features Implemented

### 1. Secure Key Retrieval with Caching

```typescript
// Retrieve encryption key with automatic caching (1 hour TTL)
const key = await keyVault.getEncryptionKey('master-encryption-key');

// Force refresh from Key Vault, bypassing cache
const freshKey = await keyVault.getEncryptionKey('master-encryption-key', true);
```

**Features:**
- Automatic caching with 1-hour TTL to minimize API calls
- Cache validation before each use
- Fallback to expired cache if Key Vault is unavailable
- Development mode fallback to local config keys

### 2. Key Storage

```typescript
// Store a new encryption key
const newKey = generateSecureToken(32);
await keyVault.setEncryptionKey('master-encryption-key', newKey);

// Store with custom metadata
await keyVault.setEncryptionKey(
  'master-encryption-key',
  newKey,
  'application/x-encryption-key',
  {
    purpose: 'PHI-encryption',
    createdBy: 'admin@example.com'
  }
);
```

**Features:**
- Automatic key validation (minimum 32 characters for AES-256)
- Metadata tagging with environment, creation time, and purpose
- Automatic cache update after storage
- Graceful handling in development mode

### 3. Automatic Key Rotation

```typescript
// Manual key rotation
const newKey = await keyVault.rotateKey('master-encryption-key');

// Schedule automatic rotation (90 days by default)
keyVault.scheduleKeyRotation('master-encryption-key');

// Schedule with custom interval (30 days)
keyVault.scheduleKeyRotation('master-encryption-key', 30 * 24 * 60 * 60 * 1000);

// Get rotation schedule info
const schedule = keyVault.getRotationSchedule('master-encryption-key');
console.log(`Next rotation: ${new Date(schedule.nextRotation)}`);

// Cancel scheduled rotation
keyVault.cancelKeyRotation('master-encryption-key');
```

**Features:**
- Automatic old key archival with timestamp
- Configurable rotation intervals (default: 90 days)
- Auto-rescheduling after successful rotation
- Retry mechanism on failure (1 hour delay)
- Security event logging for all rotation operations

## Authentication Methods

The implementation uses `DefaultAzureCredential` which automatically tries multiple authentication methods in order:

1. **Environment Variables** (Service Principal)
   - AZURE_TENANT_ID
   - AZURE_CLIENT_ID
   - AZURE_CLIENT_SECRET

2. **Managed Identity** (Automatic in Azure)
   - Used when running in Azure App Service, Azure Functions, Azure VMs, etc.

3. **Azure CLI Credentials**
   - Used during local development if Azure CLI is installed

4. **Visual Studio Code Credentials**
   - Used during development in VS Code

## Security Features

### Proper Error Handling

- All Key Vault operations have comprehensive error handling
- Fallback to cached keys on temporary failures
- Development mode fallbacks for local testing
- Production mode requires Key Vault configuration

### Security Event Logging

All key operations are logged with appropriate security levels:

```typescript
// Logged events:
- KEY_VAULT_INITIALIZED (low)
- ENCRYPTION_KEY_RETRIEVED (low)
- ENCRYPTION_KEY_STORED (medium)
- ENCRYPTION_KEY_ROTATED (medium)
- KEY_ROTATION_SCHEDULED (low)
- KEY_RETRIEVAL_FAILED (high)
- KEY_STORAGE_FAILED (high)
- KEY_ROTATION_FAILED (critical)
```

### Cache Management

```typescript
// Clear specific key cache
keyVault.clearCache('master-encryption-key');

// Clear all cached keys
keyVault.clearCache();

// Get cache statistics
const stats = keyVault.getCacheStats();
console.log(`Cached keys: ${stats.size}, Keys: ${stats.keys.join(', ')}`);
```

## Usage Examples

### Basic Usage with Existing Encryption Functions

```typescript
import { encrypt, decrypt, keyVault } from './lib/encryption';

// Initialize (typically in your app startup)
// Schedule automatic key rotation for the master key
keyVault.scheduleKeyRotation('master-encryption-key', 90 * 24 * 60 * 60 * 1000);

// Use with encryption (the encrypt/decrypt functions still work as before)
const encrypted = encrypt('sensitive-data');
const decrypted = decrypt(encrypted);

// Retrieve key from Key Vault when needed
const masterKey = await keyVault.getEncryptionKey('master-encryption-key');
const encryptedWithKV = encrypt('sensitive-data', masterKey);
```

### Production Deployment Checklist

1. **Set up Azure Key Vault**
   ```bash
   # Create Key Vault
   az keyvault create --name your-keyvault-name --resource-group your-rg --location eastus

   # Create encryption key secret
   az keyvault secret set --vault-name your-keyvault-name --name master-encryption-key --value "your-32-byte-or-longer-key"
   ```

2. **Configure Service Principal (if not using Managed Identity)**
   ```bash
   # Create service principal
   az ad sp create-for-rbac --name your-app-name --role "Key Vault Secrets User" --scopes /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.KeyVault/vaults/{vault-name}
   ```

3. **Set Environment Variables**
   - Add AZURE_KEY_VAULT_URL to your production environment
   - Add service principal credentials (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)

4. **Enable Application Logging**
   - Monitor security events in your logging system
   - Set up alerts for critical events (KEY_ROTATION_FAILED, KEY_RETRIEVAL_FAILED)

5. **Initialize Key Rotation**
   ```typescript
   // In your app startup (e.g., index.ts)
   import { keyVault } from './lib/encryption';

   // Schedule rotation on app start
   keyVault.scheduleKeyRotation('master-encryption-key');
   ```

6. **Graceful Shutdown**
   ```typescript
   // In your shutdown handler
   process.on('SIGTERM', () => {
     keyVault.cleanup(); // Clear timers and resources
     // ... other cleanup
   });
   ```

## Development Mode

In development, the implementation gracefully falls back to local keys:

1. If AZURE_KEY_VAULT_URL is not set, uses ENCRYPTION_KEY from config
2. Logs warnings for all fallback operations
3. Key rotation and storage operations are no-ops
4. All API interfaces remain the same for consistency

## Testing

```typescript
// Example test setup
import { keyVault } from './lib/encryption';

// Before tests - clear cache
keyVault.clearCache();

// Test key retrieval
const key = await keyVault.getEncryptionKey('test-key');

// Test key storage
await keyVault.setEncryptionKey('test-key', 'your-32-byte-test-key-here-12345');

// Test rotation
const newKey = await keyVault.rotateKey('test-key', false); // Don't archive in tests

// After tests - cleanup
keyVault.cleanup();
```

## Troubleshooting

### "Azure Key Vault URL is required in production environment"

- Set AZURE_KEY_VAULT_URL in your environment variables
- Format: `https://your-keyvault-name.vault.azure.net/`

### "Failed to retrieve encryption key"

- Check Azure Key Vault permissions (need "Get" and "List" permissions)
- Verify service principal credentials
- Check network connectivity to Azure
- Review Azure Key Vault firewall rules

### "Key must be at least 32 characters for AES-256 encryption"

- Ensure stored keys are at least 32 characters long
- Generate keys using `generateSecureToken(32)` or longer

### Cache Issues

```typescript
// Force refresh from Key Vault
const freshKey = await keyVault.getEncryptionKey('master-encryption-key', true);

// Or clear cache manually
keyVault.clearCache('master-encryption-key');
```

## Security Best Practices

1. **Never commit keys to version control**
   - Use environment variables
   - Use Azure Key Vault for production

2. **Rotate keys regularly**
   - Schedule automatic rotation (recommended: 90 days)
   - Monitor rotation events

3. **Use Managed Identity when possible**
   - Eliminates need for credential management
   - Automatically managed by Azure

4. **Monitor security events**
   - Set up alerts for failed operations
   - Review audit logs regularly

5. **Limit Key Vault access**
   - Use RBAC with least privilege
   - Enable Key Vault firewall
   - Use Private Endpoints in production

6. **Test disaster recovery**
   - Verify fallback to cached keys works
   - Test key rotation rollback procedures

## API Reference

### keyVault.getEncryptionKey(keyName, forceRefresh?)
Retrieves encryption key from Azure Key Vault with caching.

**Parameters:**
- `keyName` (string): Name of the key in Key Vault
- `forceRefresh` (boolean, optional): Force refresh from Key Vault, bypassing cache

**Returns:** Promise<string> - The encryption key

### keyVault.setEncryptionKey(keyName, keyValue, contentType?, tags?)
Stores encryption key in Azure Key Vault.

**Parameters:**
- `keyName` (string): Name of the key
- `keyValue` (string): Key value to store (min 32 characters)
- `contentType` (string, optional): Content type metadata
- `tags` (Record<string, string>, optional): Custom tags

**Returns:** Promise<void>

### keyVault.rotateKey(keyName, archiveOldKey?)
Rotates encryption key and optionally archives the old key.

**Parameters:**
- `keyName` (string): Name of the key to rotate
- `archiveOldKey` (boolean, optional): Whether to archive old key (default: true)

**Returns:** Promise<string> - The new key value

### keyVault.scheduleKeyRotation(keyName, rotationIntervalMs?)
Schedules automatic key rotation.

**Parameters:**
- `keyName` (string): Name of the key to rotate
- `rotationIntervalMs` (number, optional): Rotation interval in milliseconds (default: 90 days)

**Returns:** void

### keyVault.cancelKeyRotation(keyName)
Cancels scheduled key rotation.

**Parameters:**
- `keyName` (string): Name of the key

**Returns:** void

### keyVault.getRotationSchedule(keyName)
Gets rotation schedule information.

**Parameters:**
- `keyName` (string): Name of the key

**Returns:** KeyRotationSchedule | null

### keyVault.clearCache(keyName?)
Clears key cache.

**Parameters:**
- `keyName` (string, optional): Specific key to clear, or all if omitted

**Returns:** void

### keyVault.getCacheStats()
Gets cache statistics.

**Returns:** { size: number; keys: string[] }

### keyVault.cleanup()
Cleanup all timers and resources.

**Returns:** void

## License

This implementation is part of the Unified Healthcare Platform and follows HIPAA compliance standards.
