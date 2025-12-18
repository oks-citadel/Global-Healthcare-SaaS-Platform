# Azure Key Vault Integration - Quick Reference

## Installation (One-Time Setup)

```bash
cd services/api
npm install @azure/keyvault-secrets @azure/identity
```

## Environment Variables

```bash
# .env file
AZURE_KEY_VAULT_URL=https://your-keyvault.vault.azure.net/
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

## Common Usage Patterns

### Basic Key Retrieval
```typescript
import { keyVault } from './lib/encryption';

// Get key (cached for 1 hour)
const key = await keyVault.getEncryptionKey('master-encryption-key');
```

### Force Refresh
```typescript
// Bypass cache, get fresh key
const freshKey = await keyVault.getEncryptionKey('master-encryption-key', true);
```

### Store New Key
```typescript
import { generateSecureToken, keyVault } from './lib/encryption';

const newKey = generateSecureToken(32);
await keyVault.setEncryptionKey('my-key', newKey);
```

### Manual Key Rotation
```typescript
// Rotate and archive old key
const newKey = await keyVault.rotateKey('master-encryption-key');
```

### Schedule Automatic Rotation
```typescript
// Rotate every 90 days (default)
keyVault.scheduleKeyRotation('master-encryption-key');

// Custom interval (30 days)
keyVault.scheduleKeyRotation('my-key', 30 * 24 * 60 * 60 * 1000);
```

### Check Rotation Schedule
```typescript
const schedule = keyVault.getRotationSchedule('master-encryption-key');
console.log(`Next rotation: ${new Date(schedule.nextRotation)}`);
```

### Cache Management
```typescript
// Clear specific key
keyVault.clearCache('master-encryption-key');

// Clear all keys
keyVault.clearCache();

// Get stats
const stats = keyVault.getCacheStats();
console.log(`Cached: ${stats.size} keys`);
```

## Application Startup Pattern

```typescript
import { keyVault } from './lib/encryption';

async function initEncryption() {
  // Pre-load keys
  await keyVault.getEncryptionKey('master-encryption-key');

  // Schedule rotation
  keyVault.scheduleKeyRotation('master-encryption-key');

  // Cleanup on shutdown
  process.on('SIGTERM', () => keyVault.cleanup());
}
```

## Integration with Encryption Functions

```typescript
import { encrypt, decrypt, keyVault } from './lib/encryption';

// Get key from vault
const masterKey = await keyVault.getEncryptionKey('master-encryption-key');

// Use with encryption
const encrypted = encrypt('sensitive-data', masterKey);
const decrypted = decrypt(encrypted, masterKey);
```

## Error Handling

```typescript
try {
  const key = await keyVault.getEncryptionKey('master-encryption-key');
  // Use key...
} catch (error) {
  console.error('Failed to retrieve key:', error);
  // Fallback logic or alert
}
```

## Development vs Production

### Development (No Azure Key Vault)
```typescript
// Automatically falls back to ENCRYPTION_KEY from config
// Logs warnings but doesn't fail
const key = await keyVault.getEncryptionKey('master-encryption-key');
// Returns config.encryption.key
```

### Production (Azure Key Vault Required)
```typescript
// Requires AZURE_KEY_VAULT_URL
// Throws error if not configured
const key = await keyVault.getEncryptionKey('master-encryption-key');
// Returns key from Azure Key Vault
```

## Monitoring

```typescript
// Cache statistics
const { size, keys } = keyVault.getCacheStats();
console.log(`Cached ${size} keys: ${keys.join(', ')}`);

// Rotation schedule
const schedule = keyVault.getRotationSchedule('master-encryption-key');
const daysUntilRotation = (schedule.nextRotation - Date.now()) / (1000 * 60 * 60 * 24);
console.log(`Rotation in ${Math.round(daysUntilRotation)} days`);
```

## Troubleshooting

### Issue: "Azure Key Vault URL is required in production"
**Solution**: Set `AZURE_KEY_VAULT_URL` environment variable

### Issue: Authentication failed
**Solution**:
1. Verify `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`
2. Or use Managed Identity in Azure
3. Or use Azure CLI: `az login`

### Issue: Key not found
**Solution**: Create key in Azure Key Vault:
```bash
az keyvault secret set --vault-name your-vault --name master-encryption-key --value "your-key-here"
```

### Issue: Permission denied
**Solution**: Grant permissions in Azure Key Vault:
```bash
az keyvault set-policy --name your-vault --spn $AZURE_CLIENT_ID --secret-permissions get list set
```

## API Quick Reference

| Method | Purpose | Returns |
|--------|---------|---------|
| `getEncryptionKey(name, force?)` | Get key from vault | `Promise<string>` |
| `setEncryptionKey(name, value, type?, tags?)` | Store key in vault | `Promise<void>` |
| `rotateKey(name, archive?)` | Rotate key | `Promise<string>` |
| `scheduleKeyRotation(name, interval?)` | Schedule auto rotation | `void` |
| `cancelKeyRotation(name)` | Cancel rotation | `void` |
| `getRotationSchedule(name)` | Get schedule info | `KeyRotationSchedule \| null` |
| `clearCache(name?)` | Clear cache | `void` |
| `getCacheStats()` | Get cache stats | `{size, keys}` |
| `cleanup()` | Cleanup resources | `void` |

## Security Events Logged

| Event | Severity | When |
|-------|----------|------|
| `KEY_VAULT_INITIALIZED` | low | Vault client created |
| `ENCRYPTION_KEY_RETRIEVED` | low | Key retrieved successfully |
| `ENCRYPTION_KEY_STORED` | medium | Key stored |
| `ENCRYPTION_KEY_ROTATED` | medium | Key rotated |
| `KEY_ROTATION_SCHEDULED` | low | Rotation scheduled |
| `KEY_RETRIEVAL_FAILED` | high | Retrieval failed |
| `KEY_STORAGE_FAILED` | high | Storage failed |
| `KEY_ROTATION_FAILED` | critical | Rotation failed |

## Constants

| Name | Value | Description |
|------|-------|-------------|
| `CACHE_TTL_MS` | 3600000 | 1 hour cache TTL |
| `DEFAULT_ROTATION_INTERVAL_MS` | 7776000000 | 90 days |
| Min Key Length | 32 chars | For AES-256 |

## File Locations

- **Implementation**: `services/api/src/lib/encryption.ts`
- **Examples**: `services/api/src/lib/encryption.example.ts`
- **Setup Guide**: `services/api/AZURE_KEY_VAULT_SETUP.md`
- **Installation**: `services/api/INSTALLATION_STEPS.md`
- **Summary**: `services/api/IMPLEMENTATION_SUMMARY.md`
- **This Reference**: `services/api/QUICK_REFERENCE.md`

## Need More Help?

- See `AZURE_KEY_VAULT_SETUP.md` for detailed setup instructions
- See `encryption.example.ts` for 13 detailed usage examples
- See `IMPLEMENTATION_SUMMARY.md` for complete implementation details
