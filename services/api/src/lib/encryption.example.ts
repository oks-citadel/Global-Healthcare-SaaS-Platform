/**
 * Azure Key Vault Integration - Usage Examples
 *
 * This file demonstrates how to use the Azure Key Vault integration
 * for encryption key management in the Unified Health Platform.
 */

import { keyVault, encrypt, decrypt, generateSecureToken } from './encryption';

/**
 * Example 1: Basic Key Retrieval
 * Retrieve encryption key from Azure Key Vault with automatic caching
 */
export async function example1_basicKeyRetrieval() {
  try {
    // Retrieve key (will be cached for 1 hour)
    const key = await keyVault.getEncryptionKey('master-encryption-key');

    console.log('Key retrieved successfully');

    // Use the key for encryption
    const encrypted = encrypt('sensitive-patient-data', key);
    const decrypted = decrypt(encrypted, key);

    console.log('Encryption/Decryption successful');
  } catch (error) {
    console.error('Failed to retrieve key:', error);
  }
}

/**
 * Example 2: Force Refresh Key
 * Bypass cache and force fresh retrieval from Key Vault
 */
export async function example2_forceRefresh() {
  try {
    // Force refresh from Key Vault (bypasses cache)
    const freshKey = await keyVault.getEncryptionKey('master-encryption-key', true);

    console.log('Fresh key retrieved from Key Vault');
  } catch (error) {
    console.error('Failed to refresh key:', error);
  }
}

/**
 * Example 3: Store New Encryption Key
 * Generate and store a new encryption key in Azure Key Vault
 */
export async function example3_storeNewKey() {
  try {
    // Generate a secure 256-bit (32-byte) key
    const newKey = generateSecureToken(32);

    // Store in Key Vault with custom metadata
    await keyVault.setEncryptionKey(
      'phi-encryption-key',
      newKey,
      'application/x-encryption-key',
      {
        purpose: 'PHI-data-encryption',
        createdBy: 'system',
        department: 'healthcare'
      }
    );

    console.log('New encryption key stored successfully');
  } catch (error) {
    console.error('Failed to store key:', error);
  }
}

/**
 * Example 4: Manual Key Rotation
 * Manually rotate an encryption key and archive the old one
 */
export async function example4_manualKeyRotation() {
  try {
    // Rotate key and archive old key
    const newKey = await keyVault.rotateKey('master-encryption-key', true);

    console.log('Key rotated successfully');
    console.log('New key generated and old key archived');

    // Important: Update application to re-encrypt data with new key
    // This is a manual process that depends on your data migration strategy
  } catch (error) {
    console.error('Failed to rotate key:', error);
  }
}

/**
 * Example 5: Schedule Automatic Key Rotation
 * Set up automatic key rotation on a schedule (recommended for production)
 */
export async function example5_scheduleKeyRotation() {
  try {
    // Schedule rotation every 90 days (default)
    keyVault.scheduleKeyRotation('master-encryption-key');

    // Or schedule with custom interval (30 days)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    keyVault.scheduleKeyRotation('phi-encryption-key', thirtyDaysMs);

    console.log('Key rotation scheduled');

    // Get schedule information
    const schedule = keyVault.getRotationSchedule('master-encryption-key');
    if (schedule) {
      console.log(`Next rotation: ${new Date(schedule.nextRotation).toISOString()}`);
      console.log(`Rotation interval: ${schedule.rotationIntervalMs / (1000 * 60 * 60 * 24)} days`);
    }
  } catch (error) {
    console.error('Failed to schedule key rotation:', error);
  }
}

/**
 * Example 6: Cancel Scheduled Rotation
 * Cancel a previously scheduled key rotation
 */
export async function example6_cancelRotation() {
  try {
    keyVault.cancelKeyRotation('master-encryption-key');
    console.log('Key rotation cancelled');
  } catch (error) {
    console.error('Failed to cancel rotation:', error);
  }
}

/**
 * Example 7: Cache Management
 * Manage the key cache for optimal performance
 */
export async function example7_cacheManagement() {
  try {
    // Get cache statistics
    const stats = keyVault.getCacheStats();
    console.log(`Cached keys: ${stats.size}`);
    console.log(`Keys: ${stats.keys.join(', ')}`);

    // Clear specific key cache
    keyVault.clearCache('master-encryption-key');
    console.log('Specific key cache cleared');

    // Clear all cached keys
    keyVault.clearCache();
    console.log('All key caches cleared');
  } catch (error) {
    console.error('Failed to manage cache:', error);
  }
}

/**
 * Example 8: Application Startup Configuration
 * Typical setup for production application
 */
export async function example8_applicationStartup() {
  try {
    console.log('Initializing encryption key management...');

    // 1. Schedule automatic rotation for master keys
    keyVault.scheduleKeyRotation('master-encryption-key', 90 * 24 * 60 * 60 * 1000); // 90 days
    keyVault.scheduleKeyRotation('phi-encryption-key', 90 * 24 * 60 * 60 * 1000);

    // 2. Pre-load critical keys into cache
    await keyVault.getEncryptionKey('master-encryption-key');
    await keyVault.getEncryptionKey('phi-encryption-key');

    console.log('Encryption key management initialized');

    // 3. Log cache status
    const stats = keyVault.getCacheStats();
    console.log(`Cached ${stats.size} encryption keys`);
  } catch (error) {
    console.error('Failed to initialize key management:', error);
    throw error; // Critical error, app should not start
  }
}

/**
 * Example 9: Graceful Shutdown
 * Cleanup resources before application shutdown
 */
export async function example9_gracefulShutdown() {
  try {
    console.log('Cleaning up key management resources...');

    // Cleanup timers and resources
    keyVault.cleanup();

    console.log('Key management cleanup complete');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

/**
 * Example 10: Error Handling and Fallbacks
 * Demonstrate proper error handling with fallback strategies
 */
export async function example10_errorHandling() {
  try {
    // Attempt to retrieve key
    const key = await keyVault.getEncryptionKey('master-encryption-key');

    // Use key for encryption
    const encrypted = encrypt('patient-data', key);

    console.log('Operation successful');
  } catch (error) {
    console.error('Primary operation failed:', error);

    // Fallback strategy 1: Try to force refresh
    try {
      const key = await keyVault.getEncryptionKey('master-encryption-key', true);
      console.log('Fallback successful with force refresh');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);

      // Fallback strategy 2: Use cached key even if expired
      // (This is automatically handled by the implementation)

      // Fallback strategy 3: Alert operations team
      // sendAlert('KEY_RETRIEVAL_FAILED', error);

      throw new Error('Unable to retrieve encryption key after all fallback attempts');
    }
  }
}

/**
 * Example 11: Multi-Environment Configuration
 * Handle different environments (dev, staging, production)
 */
export async function example11_multiEnvironment() {
  const env = process.env.NODE_ENV || 'development';

  try {
    if (env === 'production') {
      // Production: Use Azure Key Vault with strict requirements
      await keyVault.getEncryptionKey('master-encryption-key');
      keyVault.scheduleKeyRotation('master-encryption-key');
      console.log('Production mode: Azure Key Vault configured');

    } else if (env === 'staging') {
      // Staging: Use Azure Key Vault but with warnings
      await keyVault.getEncryptionKey('staging-encryption-key');
      console.log('Staging mode: Using staging Key Vault');

    } else {
      // Development: Fallback to local keys
      console.log('Development mode: Using local encryption keys');
      // The implementation automatically falls back to config keys
    }
  } catch (error) {
    console.error(`Failed to initialize ${env} environment:`, error);
    throw error;
  }
}

/**
 * Example 12: Integration with Existing Encryption Functions
 * Use Key Vault keys with the existing encryption utilities
 */
export async function example12_integrationWithEncryption() {
  try {
    // Retrieve key from Key Vault
    const masterKey = await keyVault.getEncryptionKey('master-encryption-key');

    // Use with existing encryption functions
    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      ssn: '123-45-6789',
      dateOfBirth: '1980-01-01',
      diagnosis: 'Type 2 Diabetes'
    };

    // Encrypt individual fields
    const encryptedSSN = encrypt(patientData.ssn, masterKey);
    const encryptedDOB = encrypt(patientData.dateOfBirth, masterKey);
    const encryptedDiagnosis = encrypt(patientData.diagnosis, masterKey);

    console.log('PHI fields encrypted successfully');

    // Decrypt when needed
    const decryptedSSN = decrypt(encryptedSSN, masterKey);
    const decryptedDOB = decrypt(encryptedDOB, masterKey);

    console.log('PHI fields decrypted successfully');
  } catch (error) {
    console.error('Failed to encrypt/decrypt data:', error);
  }
}

/**
 * Example 13: Monitoring and Observability
 * Monitor key usage and rotation status
 */
export async function example13_monitoringObservability() {
  try {
    // Check cache statistics
    const cacheStats = keyVault.getCacheStats();
    console.log('Cache Statistics:', {
      totalCachedKeys: cacheStats.size,
      keyNames: cacheStats.keys
    });

    // Check rotation schedules
    const masterKeySchedule = keyVault.getRotationSchedule('master-encryption-key');
    if (masterKeySchedule) {
      const daysUntilRotation = (masterKeySchedule.nextRotation - Date.now()) / (1000 * 60 * 60 * 24);
      console.log('Master Key Rotation:', {
        nextRotation: new Date(masterKeySchedule.nextRotation).toISOString(),
        daysUntilRotation: Math.round(daysUntilRotation),
        lastRotation: new Date(masterKeySchedule.lastRotation).toISOString()
      });

      // Alert if rotation is soon
      if (daysUntilRotation < 7) {
        console.warn('Key rotation scheduled within 7 days!');
      }
    }

    // Log metrics for monitoring systems (Prometheus, CloudWatch, etc.)
    // metrics.gauge('key_vault.cached_keys', cacheStats.size);
    // metrics.gauge('key_vault.days_until_rotation', daysUntilRotation);
  } catch (error) {
    console.error('Failed to collect monitoring data:', error);
  }
}

/**
 * Express.js Middleware Example
 * Ensure encryption keys are loaded before handling requests
 */
export function keyVaultMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Ensure master key is cached
      await keyVault.getEncryptionKey('master-encryption-key');
      next();
    } catch (error) {
      console.error('Key Vault middleware error:', error);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Encryption service unavailable'
      });
    }
  };
}

/**
 * Complete Application Setup Example
 * Recommended setup for production applications
 */
export async function setupEncryptionService() {
  try {
    console.log('Setting up encryption service...');

    // 1. Pre-load encryption keys
    console.log('Pre-loading encryption keys...');
    await Promise.all([
      keyVault.getEncryptionKey('master-encryption-key'),
      keyVault.getEncryptionKey('phi-encryption-key'),
    ]);

    // 2. Schedule automatic key rotation
    console.log('Scheduling key rotation...');
    keyVault.scheduleKeyRotation('master-encryption-key', 90 * 24 * 60 * 60 * 1000);
    keyVault.scheduleKeyRotation('phi-encryption-key', 90 * 24 * 60 * 60 * 1000);

    // 3. Set up graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, cleaning up...');
      keyVault.cleanup();
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, cleaning up...');
      keyVault.cleanup();
    });

    // 4. Log status
    const stats = keyVault.getCacheStats();
    console.log(`Encryption service ready (${stats.size} keys cached)`);

    return true;
  } catch (error) {
    console.error('Failed to setup encryption service:', error);
    throw error;
  }
}

// Export all examples for documentation
export const examples = {
  basicKeyRetrieval: example1_basicKeyRetrieval,
  forceRefresh: example2_forceRefresh,
  storeNewKey: example3_storeNewKey,
  manualKeyRotation: example4_manualKeyRotation,
  scheduleKeyRotation: example5_scheduleKeyRotation,
  cancelRotation: example6_cancelRotation,
  cacheManagement: example7_cacheManagement,
  applicationStartup: example8_applicationStartup,
  gracefulShutdown: example9_gracefulShutdown,
  errorHandling: example10_errorHandling,
  multiEnvironment: example11_multiEnvironment,
  integrationWithEncryption: example12_integrationWithEncryption,
  monitoringObservability: example13_monitoringObservability,
  setupEncryptionService,
  keyVaultMiddleware,
};
