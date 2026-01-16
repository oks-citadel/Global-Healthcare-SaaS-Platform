/**
 * AWS Secrets Manager Integration
 *
 * Purpose: Securely manage application secrets using AWS Secrets Manager
 * Compliance: HIPAA-compliant secret management
 *
 * Features:
 * - Automatic secret retrieval from AWS Secrets Manager
 * - Local caching for performance
 * - Fallback to environment variables
 * - Secret rotation support
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
  ListSecretsCommand,
  DescribeSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import { logger } from '../utils/logger.js';

/**
 * Configuration for AWS Secrets Manager
 */
interface SecretsManagerConfig {
  enabled: boolean;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

/**
 * Secret cache entry
 */
interface CachedSecret {
  value: string;
  expiresAt: number;
}

/**
 * AWS Secrets Manager Client
 */
class AWSSecretsManagerClient {
  private client: SecretsManagerClient | null = null;
  private config: SecretsManagerConfig;
  private secretCache = new Map<string, CachedSecret>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      enabled: process.env.AWS_SECRETS_MANAGER_ENABLED === 'true',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    if (this.config.enabled) {
      this.initializationPromise = this.initialize();
    }
  }

  /**
   * Initialize the Secrets Manager client
   */
  private async initialize(): Promise<void> {
    try {
      if (!this.config.accessKeyId || !this.config.secretAccessKey) {
        logger.warn('AWS credentials not configured, secrets will be loaded from environment variables');
        this.config.enabled = false;
        return;
      }

      logger.info('Initializing AWS Secrets Manager client...');

      // Create Secrets Manager client
      this.client = new SecretsManagerClient({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });

      // Test connection by listing secrets
      const listCommand = new ListSecretsCommand({ MaxResults: 1 });
      await this.client.send(listCommand);

      logger.info('AWS Secrets Manager connected successfully');
    } catch (error) {
      logger.error('Failed to initialize AWS Secrets Manager client', { error });
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
   * Convert environment variable name to Secrets Manager secret name
   * Example: JWT_SECRET -> jwt-secret
   */
  private envToSecretName(envName: string): string {
    return envName.toLowerCase().replace(/_/g, '-');
  }

  /**
   * Get a secret from Secrets Manager or environment variable
   */
  async getSecret(name: string): Promise<string | undefined> {
    await this.ensureInitialized();

    // If Secrets Manager is not enabled, return from environment
    if (!this.config.enabled || !this.client) {
      return process.env[name];
    }

    try {
      // Check cache first
      const cached = this.secretCache.get(name);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.value;
      }

      // Convert env name to Secrets Manager secret name
      const secretName = this.envToSecretName(name);

      // Retrieve from Secrets Manager
      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const response = await this.client.send(command);

      if (response.SecretString) {
        // Try to parse as JSON
        let secretValue: string;
        try {
          const parsed = JSON.parse(response.SecretString);
          secretValue = parsed.value || parsed.key || response.SecretString;
        } catch {
          secretValue = response.SecretString;
        }

        // Cache the secret
        this.secretCache.set(name, {
          value: secretValue,
          expiresAt: Date.now() + this.CACHE_TTL,
        });

        return secretValue;
      }

      // Fallback to environment variable
      logger.warn(`Secret '${secretName}' not found in Secrets Manager, using environment variable`);
      return process.env[name];
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') {
        logger.warn(`Secret '${name}' not found in Secrets Manager, using environment variable`);
      } else {
        logger.warn(`Failed to retrieve secret '${name}' from Secrets Manager, using environment variable`, { error });
      }
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
   * Set a secret in Secrets Manager
   * Note: Only use this for programmatic secret updates
   */
  async setSecret(name: string, value: string): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      throw new Error('AWS Secrets Manager is not enabled');
    }

    try {
      const secretName = this.envToSecretName(name);
      const secretValue = JSON.stringify({ value });

      // Check if secret exists
      let secretExists = false;
      try {
        await this.client.send(new DescribeSecretCommand({ SecretId: secretName }));
        secretExists = true;
      } catch (error: any) {
        if (error.name !== 'ResourceNotFoundException') {
          throw error;
        }
      }

      if (secretExists) {
        // Update existing secret
        await this.client.send(new UpdateSecretCommand({
          SecretId: secretName,
          SecretString: secretValue,
        }));
      } else {
        // Create new secret
        await this.client.send(new CreateSecretCommand({
          Name: secretName,
          SecretString: secretValue,
          Tags: [
            { Key: 'Environment', Value: process.env.NODE_ENV || 'development' },
            { Key: 'ManagedBy', Value: 'application' },
          ],
        }));
      }

      // Invalidate cache
      this.secretCache.delete(name);

      logger.info(`Secret '${secretName}' updated in Secrets Manager`);
    } catch (error) {
      logger.error(`Failed to set secret '${name}' in Secrets Manager`, { error });
      throw error;
    }
  }

  /**
   * Delete a secret from Secrets Manager
   */
  async deleteSecret(name: string): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      throw new Error('AWS Secrets Manager is not enabled');
    }

    try {
      const secretName = this.envToSecretName(name);
      await this.client.send(new DeleteSecretCommand({
        SecretId: secretName,
        ForceDeleteWithoutRecovery: false, // Allow recovery within 30 days
      }));

      // Invalidate cache
      this.secretCache.delete(name);

      logger.info(`Secret '${secretName}' deleted from Secrets Manager`);
    } catch (error) {
      logger.error(`Failed to delete secret '${name}' from Secrets Manager`, { error });
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
      throw new Error('AWS Secrets Manager is not enabled');
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
   * Check if Secrets Manager is enabled and connected
   */
  isEnabled(): boolean {
    return this.config.enabled && this.client !== null;
  }

  /**
   * Get Secrets Manager health status
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    await this.ensureInitialized();

    if (!this.config.enabled) {
      return {
        healthy: true,
        message: 'Secrets Manager is disabled, using environment variables',
      };
    }

    if (!this.client) {
      return {
        healthy: false,
        message: 'Secrets Manager client is not initialized',
      };
    }

    try {
      // Try to list secrets to verify connection
      const command = new ListSecretsCommand({ MaxResults: 1 });
      await this.client.send(command);

      return {
        healthy: true,
        message: 'Secrets Manager is connected and accessible',
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Secrets Manager health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Load all secrets from Secrets Manager into process.env
   * Useful for initialization
   */
  async loadAllSecrets(): Promise<void> {
    await this.ensureInitialized();

    if (!this.config.enabled || !this.client) {
      logger.info('Secrets Manager not enabled, skipping secret loading');
      return;
    }

    try {
      logger.info('Loading all secrets from AWS Secrets Manager...');

      let nextToken: string | undefined;
      let count = 0;

      do {
        const command = new ListSecretsCommand({
          MaxResults: 100,
          NextToken: nextToken,
        });

        const response = await this.client.send(command);

        for (const secret of response.SecretList || []) {
          if (!secret.Name) continue;

          try {
            const getCommand = new GetSecretValueCommand({
              SecretId: secret.Name,
            });

            const secretResponse = await this.client.send(getCommand);

            if (secretResponse.SecretString) {
              // Convert secret name to env var name
              const envName = secret.Name.toUpperCase().replace(/-/g, '_');

              // Try to parse as JSON
              let secretValue: string;
              try {
                const parsed = JSON.parse(secretResponse.SecretString);
                secretValue = parsed.value || parsed.key || secretResponse.SecretString;
              } catch {
                secretValue = secretResponse.SecretString;
              }

              // Only set if not already in environment (env vars take precedence)
              if (!process.env[envName]) {
                process.env[envName] = secretValue;
                count++;
              }

              // Cache the secret
              this.secretCache.set(envName, {
                value: secretValue,
                expiresAt: Date.now() + this.CACHE_TTL,
              });
            }
          } catch (error) {
            logger.warn(`Failed to load secret '${secret.Name}'`, { error });
          }
        }

        nextToken = response.NextToken;
      } while (nextToken);

      logger.info(`Loaded ${count} secrets from AWS Secrets Manager`);
    } catch (error) {
      logger.error('Failed to load secrets from Secrets Manager', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const secretsManagerClient = new AWSSecretsManagerClient();

// Backward compatible exports (matching Azure Key Vault API)
export const keyVaultClient = secretsManagerClient;

/**
 * Helper function to get a secret
 */
export async function getSecret(name: string): Promise<string | undefined> {
  return secretsManagerClient.getSecret(name);
}

/**
 * Helper function to get multiple secrets
 */
export async function getSecrets(names: string[]): Promise<Record<string, string | undefined>> {
  return secretsManagerClient.getSecrets(names);
}

/**
 * Initialize Secrets Manager and load secrets
 */
export async function initializeSecretsManager(): Promise<void> {
  try {
    await secretsManagerClient.loadAllSecrets();
    logger.info('AWS Secrets Manager initialized successfully');
  } catch (error) {
    logger.warn('AWS Secrets Manager initialization failed, using environment variables', { error });
  }
}

// Backward compatible export
export const initializeKeyVault = initializeSecretsManager;

export default secretsManagerClient;
