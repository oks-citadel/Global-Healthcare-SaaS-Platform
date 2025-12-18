/**
 * Azure Key Vault Integration
 *
 * Purpose: Securely manage application secrets using Azure Key Vault
 * Compliance: HIPAA-compliant secret management
 *
 * Features:
 * - Automatic secret retrieval from Azure Key Vault
 * - Local caching for performance
 * - Fallback to environment variables
 * - Secret rotation support
 */

import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential, ClientSecretCredential } from '@azure/identity';
import { logger } from '../utils/logger.js';

/**
 * Configuration for Azure Key Vault
 */
interface KeyVaultConfig {
  enabled: boolean;
  vaultUrl?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  useManagedIdentity?: boolean;
}

/**
 * Secret cache entry
 */
interface CachedSecret {
  value: string;
  expiresAt: number;
}

/**
 * Azure Key Vault Client
 */
class AzureKeyVaultClient {
  private client: SecretClient | null = null;
  private config: KeyVaultConfig;
  private secretCache = new Map<string, CachedSecret>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      enabled: process.env.AZURE_KEY_VAULT_ENABLED === 'true',
      vaultUrl: process.env.AZURE_KEY_VAULT_URL,
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID,
      useManagedIdentity: process.env.AZURE_USE_MANAGED_IDENTITY === 'true',
    };

    if (this.config.enabled) {
      this.initializationPromise = this.initialize();
    }
  }

  /**
   * Initialize the Key Vault client
   */
  private async initialize(): Promise<void> {
    try {
      if (!this.config.vaultUrl) {
        logger.warn('Azure Key Vault URL not configured, secrets will be loaded from environment variables');
        this.config.enabled = false;
        return;
      }

      logger.info('Initializing Azure Key Vault client...');

      // Create credential based on configuration
      let credential;

      if (this.config.useManagedIdentity) {
        // Use Managed Identity (recommended for Azure-hosted applications)
        logger.info('Using Azure Managed Identity for Key Vault authentication');
        credential = new DefaultAzureCredential();
      } else if (this.config.clientId && this.config.clientSecret && this.config.tenantId) {
        // Use Service Principal
        logger.info('Using Service Principal for Key Vault authentication');
        credential = new ClientSecretCredential(
          this.config.tenantId,
          this.config.clientId,
          this.config.clientSecret
        );
      } else {
        // Use Default Azure Credential (works in development with Azure CLI)
        logger.info('Using Default Azure Credential for Key Vault authentication');
        credential = new DefaultAzureCredential();
      }

      // Create Key Vault client
      this.client = new SecretClient(this.config.vaultUrl, credential);

      // Test connection by listing secrets
      const secretsIterator = this.client.listPropertiesOfSecrets();
      const secrets = [];
      for await (const secret of secretsIterator) {
        secrets.push(secret.name);
      }

      logger.info(`Azure Key Vault connected successfully. Found ${secrets.length} secrets.`);
    } catch (error) {
      logger.error('Failed to initialize Azure Key Vault client', { error });
      logger.warn('Falling back to environment variables for secrets');
      this.config.enabled = false;
      this.client = null;
    }
  }

  /**
   * Ensure client is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
      this.initializationPromise = null;
    }
  }

  /**
   * Convert environment variable name to Key Vault secret name
   * Example: JWT_SECRET -> JWT-SECRET
   */
  private envToSecretName(envName: string): string {
    return envName.replace(/_/g, '-');
  }

  /**
   * Get a secret from Key Vault or environment variable
   */
  async getSecret(name: string): Promise<string | undefined> {
    await this.ensureInitialized();

    // If Key Vault is not enabled, return from environment
    if (!this.config.enabled || !this.client) {
      return process.env[name];
    }

    try {
      // Check cache first
      const cached = this.secretCache.get(name);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.value;
      }

      // Convert env name to Key Vault secret name
      const secretName = this.envToSecretName(name);

      // Retrieve from Key Vault
      const secret = await this.client.getSecret(secretName);

      if (secret.value) {
        // Cache the secret
        this.secretCache.set(name, {
          value: secret.value,
          expiresAt: Date.now() + this.CACHE_TTL,
        });

        return secret.value;
      }

      // Fallback to environment variable
      logger.warn(`Secret '${secretName}' not found in Key Vault, using environment variable`);
      return process.env[name];
    } catch (error) {
      logger.warn(`Failed to retrieve secret '${name}' from Key Vault, using environment variable`, { error });
      return process.env[name];
    }
  }

  /**
   * Get multiple secrets at once
   */
  async getSecrets(names: string[]): Promise<Record<string, string | undefined>> {
    const secrets: Record<string, string | undefined> = {};

    await Promise.all(
      names.map(async (name) => {
        secrets[name] = await this.getSecret(name);
      })
    );

    return secrets;
  }

  /**
   * Set a secret in Key Vault
   * Note: Only use this for programmatic secret updates
   */
  async setSecret(name: string, value: string): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      throw new Error('Azure Key Vault is not enabled');
    }

    try {
      const secretName = this.envToSecretName(name);
      await this.client.setSecret(secretName, value);

      // Invalidate cache
      this.secretCache.delete(name);

      logger.info(`Secret '${secretName}' updated in Key Vault`);
    } catch (error) {
      logger.error(`Failed to set secret '${name}' in Key Vault`, { error });
      throw error;
    }
  }

  /**
   * Delete a secret from Key Vault
   */
  async deleteSecret(name: string): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      throw new Error('Azure Key Vault is not enabled');
    }

    try {
      const secretName = this.envToSecretName(name);
      await this.client.beginDeleteSecret(secretName);

      // Invalidate cache
      this.secretCache.delete(name);

      logger.info(`Secret '${secretName}' deleted from Key Vault`);
    } catch (error) {
      logger.error(`Failed to delete secret '${name}' from Key Vault`, { error });
      throw error;
    }
  }

  /**
   * Clear the secret cache
   */
  clearCache(): void {
    this.secretCache.clear();
    logger.info('Secret cache cleared');
  }

  /**
   * Rotate a secret (generate new value and update)
   */
  async rotateSecret(name: string, generator: () => string): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      throw new Error('Azure Key Vault is not enabled');
    }

    try {
      const newValue = generator();
      await this.setSecret(name, newValue);

      logger.info(`Secret '${name}' rotated successfully`);
    } catch (error) {
      logger.error(`Failed to rotate secret '${name}'`, { error });
      throw error;
    }
  }

  /**
   * Check if Key Vault is enabled and connected
   */
  isEnabled(): boolean {
    return this.config.enabled && this.client !== null;
  }

  /**
   * Get Key Vault health status
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    await this.ensureInitialized();

    if (!this.config.enabled) {
      return {
        healthy: true,
        message: 'Key Vault is disabled, using environment variables',
      };
    }

    if (!this.client) {
      return {
        healthy: false,
        message: 'Key Vault client is not initialized',
      };
    }

    try {
      // Try to list secrets to verify connection
      const iterator = this.client.listPropertiesOfSecrets();
      await iterator.next();

      return {
        healthy: true,
        message: 'Key Vault is connected and accessible',
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Key Vault health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Load all secrets from Key Vault into process.env
   * Useful for initialization
   */
  async loadAllSecrets(): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      logger.info('Key Vault not enabled, skipping secret loading');
      return;
    }

    try {
      logger.info('Loading all secrets from Key Vault...');

      const secretsIterator = this.client.listPropertiesOfSecrets();
      let count = 0;

      for await (const secretProperties of secretsIterator) {
        if (!secretProperties.name || !secretProperties.enabled) {
          continue;
        }

        try {
          const secret = await this.client.getSecret(secretProperties.name);

          if (secret.value) {
            // Convert secret name to env var name
            const envName = secretProperties.name.replace(/-/g, '_');

            // Only set if not already in environment (env vars take precedence)
            if (!process.env[envName]) {
              process.env[envName] = secret.value;
              count++;
            }

            // Cache the secret
            this.secretCache.set(envName, {
              value: secret.value,
              expiresAt: Date.now() + this.CACHE_TTL,
            });
          }
        } catch (error) {
          logger.warn(`Failed to load secret '${secretProperties.name}'`, { error });
        }
      }

      logger.info(`Loaded ${count} secrets from Key Vault`);
    } catch (error) {
      logger.error('Failed to load secrets from Key Vault', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const keyVaultClient = new AzureKeyVaultClient();

/**
 * Helper function to get a secret
 */
export async function getSecret(name: string): Promise<string | undefined> {
  return keyVaultClient.getSecret(name);
}

/**
 * Helper function to get multiple secrets
 */
export async function getSecrets(names: string[]): Promise<Record<string, string | undefined>> {
  return keyVaultClient.getSecrets(names);
}

/**
 * Initialize Key Vault and load secrets
 */
export async function initializeKeyVault(): Promise<void> {
  try {
    await keyVaultClient.loadAllSecrets();
    logger.info('Azure Key Vault initialized successfully');
  } catch (error) {
    logger.warn('Azure Key Vault initialization failed, using environment variables', { error });
  }
}

export default keyVaultClient;
