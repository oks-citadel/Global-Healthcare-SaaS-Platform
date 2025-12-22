/**
 * Adapter Registry
 * Central registry for managing and discovering healthcare adapters
 */

import {
  AdapterConfig,
  AdapterType,
  AdapterStatus,
  AdapterRegistration,
  AdapterContext,
  AdapterRequest,
  AdapterResponse,
} from './types';
import { BaseAdapter } from './base-adapter';

/**
 * Adapter factory function type
 */
export type AdapterFactory = (config: AdapterConfig) => BaseAdapter;

/**
 * Adapter registry class
 */
export class AdapterRegistry {
  private adapters: Map<string, AdapterRegistration> = new Map();
  private instances: Map<string, BaseAdapter> = new Map();
  private factories: Map<string, AdapterFactory> = new Map();

  /**
   * Register an adapter factory
   */
  registerFactory(name: string, factory: AdapterFactory): void {
    this.factories.set(name, factory);
  }

  /**
   * Register an adapter configuration
   */
  registerAdapter(config: AdapterConfig, operations: string[]): void {
    const registration: AdapterRegistration = {
      config,
      operations,
    };
    this.adapters.set(config.id, registration);
  }

  /**
   * Unregister an adapter
   */
  unregisterAdapter(adapterId: string): void {
    this.adapters.delete(adapterId);
    this.instances.delete(adapterId);
  }

  /**
   * Get adapter by ID
   */
  getAdapter(adapterId: string): BaseAdapter | undefined {
    // Return cached instance if exists
    if (this.instances.has(adapterId)) {
      return this.instances.get(adapterId);
    }

    // Get registration
    const registration = this.adapters.get(adapterId);
    if (!registration) {
      return undefined;
    }

    // Create instance using factory
    const factory = this.factories.get(registration.config.type);
    if (!factory) {
      throw new Error(`No factory registered for adapter type: ${registration.config.type}`);
    }

    const instance = factory(registration.config);
    this.instances.set(adapterId, instance);
    return instance;
  }

  /**
   * Get all adapters of a specific type
   */
  getAdaptersByType(type: AdapterType): AdapterRegistration[] {
    const results: AdapterRegistration[] = [];
    for (const registration of this.adapters.values()) {
      if (registration.config.type === type) {
        results.push(registration);
      }
    }
    return results;
  }

  /**
   * Get adapters for a specific country
   */
  getAdaptersForCountry(countryCode: string, type?: AdapterType): AdapterRegistration[] {
    const results: AdapterRegistration[] = [];
    for (const registration of this.adapters.values()) {
      if (registration.config.countryCode === countryCode) {
        if (!type || registration.config.type === type) {
          results.push(registration);
        }
      }
    }
    return results;
  }

  /**
   * Get adapters for a specific region
   */
  getAdaptersForRegion(regionId: string, type?: AdapterType): AdapterRegistration[] {
    const results: AdapterRegistration[] = [];
    for (const registration of this.adapters.values()) {
      if (registration.config.regionId === regionId) {
        if (!type || registration.config.type === type) {
          results.push(registration);
        }
      }
    }
    return results;
  }

  /**
   * Get active adapters only
   */
  getActiveAdapters(type?: AdapterType): AdapterRegistration[] {
    const results: AdapterRegistration[] = [];
    for (const registration of this.adapters.values()) {
      if (registration.config.status === AdapterStatus.ACTIVE) {
        if (!type || registration.config.type === type) {
          results.push(registration);
        }
      }
    }
    return results;
  }

  /**
   * Find adapter that supports a specific operation
   */
  findAdapterForOperation(
    operation: string,
    context: { countryCode?: string; regionId?: string; type?: AdapterType }
  ): AdapterRegistration | undefined {
    for (const registration of this.adapters.values()) {
      // Check if adapter supports operation
      if (!registration.operations.includes(operation)) {
        continue;
      }

      // Check status
      if (registration.config.status !== AdapterStatus.ACTIVE) {
        continue;
      }

      // Check type filter
      if (context.type && registration.config.type !== context.type) {
        continue;
      }

      // Check country filter
      if (context.countryCode && registration.config.countryCode !== context.countryCode) {
        continue;
      }

      // Check region filter
      if (context.regionId && registration.config.regionId !== context.regionId) {
        continue;
      }

      return registration;
    }

    return undefined;
  }

  /**
   * Execute operation on appropriate adapter
   */
  async executeOperation<T, R>(
    operation: string,
    payload: T,
    context: AdapterContext
  ): Promise<AdapterResponse<R>> {
    // Find appropriate adapter
    const registration = this.findAdapterForOperation(operation, {
      countryCode: context.countryCode,
      regionId: context.regionId,
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: 'NO_ADAPTER_FOUND',
          message: `No adapter found for operation: ${operation}`,
          retryable: false,
        },
        metadata: {
          requestId: context.requestId,
          adapterId: 'none',
          durationMs: 0,
        },
      };
    }

    // Get adapter instance
    const adapter = this.getAdapter(registration.config.id);
    if (!adapter) {
      return {
        success: false,
        error: {
          code: 'ADAPTER_NOT_AVAILABLE',
          message: `Adapter not available: ${registration.config.id}`,
          retryable: true,
        },
        metadata: {
          requestId: context.requestId,
          adapterId: registration.config.id,
          durationMs: 0,
        },
      };
    }

    // Build request
    const request: AdapterRequest<T> = {
      adapterId: registration.config.id,
      operation,
      context,
      payload,
    };

    // Execute request
    return adapter.execute<T, R>(request);
  }

  /**
   * Run health checks on all adapters
   */
  async healthCheckAll(): Promise<Map<string, { healthy: boolean; latencyMs: number; error?: string }>> {
    const results = new Map<string, { healthy: boolean; latencyMs: number; error?: string }>();

    for (const [adapterId, registration] of this.adapters) {
      try {
        const adapter = this.getAdapter(adapterId);
        if (adapter) {
          const result = await adapter.healthCheck();
          results.set(adapterId, result);

          // Update registration
          registration.lastHealthCheck = {
            timestamp: new Date(),
            healthy: result.healthy,
            latencyMs: result.latencyMs,
            error: result.error,
          };
        }
      } catch (error) {
        results.set(adapterId, {
          healthy: false,
          latencyMs: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Get all registrations
   */
  getAllRegistrations(): AdapterRegistration[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Clear all registrations (for testing)
   */
  clear(): void {
    this.adapters.clear();
    this.instances.clear();
  }
}

/**
 * Singleton registry instance
 */
let registryInstance: AdapterRegistry | null = null;

/**
 * Get the adapter registry instance
 */
export function getAdapterRegistry(): AdapterRegistry {
  if (!registryInstance) {
    registryInstance = new AdapterRegistry();
  }
  return registryInstance;
}
