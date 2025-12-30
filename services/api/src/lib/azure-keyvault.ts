/**
 * Azure Key Vault Compatibility Layer
 *
 * This module provides backward compatibility with Azure Key Vault API
 * while redirecting all calls to AWS Secrets Manager.
 *
 * @deprecated This module is deprecated. Use aws-secrets-manager.ts instead.
 */

// Re-export everything from AWS Secrets Manager for backward compatibility
export * from './aws-secrets-manager.js';

import {
  secretsManagerClient,
  getSecret,
  getSecrets,
  initializeSecretsManager,
} from './aws-secrets-manager.js';

// Backward compatible aliases
export const keyVaultClient = secretsManagerClient;
export const initializeKeyVault = initializeSecretsManager;

/**
 * @deprecated Use secretsManagerClient instead
 */
export default secretsManagerClient;
