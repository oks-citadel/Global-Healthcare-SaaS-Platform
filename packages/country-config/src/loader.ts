/**
 * Country Configuration Loader
 * Loads and caches country configurations
 */

import type { CountryConfig } from './types';
import { validateComplete } from './validation';

/**
 * Configuration loader with caching
 */
export class CountryConfigLoader {
  private static configs: Map<string, CountryConfig> = new Map();
  private static defaultConfig: CountryConfig | null = null;

  /**
   * Load a configuration for a specific country
   */
  static load(countryCode: string): CountryConfig | null {
    // Check cache first
    const cached = this.configs.get(countryCode.toUpperCase());
    if (cached) {
      return cached;
    }

    // In production, this would load from a database or file system
    // For now, return null if not found
    return null;
  }

  /**
   * Register a country configuration
   */
  static register(config: CountryConfig): void {
    // Validate configuration
    const validation = validateComplete(config);
    if (!validation.valid) {
      throw new Error(
        `Invalid configuration for ${config.countryCode}: ${validation.errors?.join(', ')}`
      );
    }

    // Log warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      console.warn(
        `Warnings for ${config.countryCode} configuration:`,
        validation.warnings
      );
    }

    // Store in cache
    this.configs.set(config.countryCode.toUpperCase(), config);
  }

  /**
   * Register multiple configurations
   */
  static registerAll(configs: CountryConfig[]): void {
    configs.forEach(config => this.register(config));
  }

  /**
   * Get all registered configurations
   */
  static getAll(): CountryConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Get all enabled configurations
   */
  static getAllEnabled(): CountryConfig[] {
    return this.getAll().filter(config => config.enabled);
  }

  /**
   * Check if a country is supported
   */
  static isSupported(countryCode: string): boolean {
    return this.configs.has(countryCode.toUpperCase());
  }

  /**
   * Set default configuration (fallback)
   */
  static setDefault(config: CountryConfig): void {
    const validation = validateComplete(config);
    if (!validation.valid) {
      throw new Error(`Invalid default configuration: ${validation.errors?.join(', ')}`);
    }
    this.defaultConfig = config;
  }

  /**
   * Get default configuration
   */
  static getDefault(): CountryConfig | null {
    return this.defaultConfig;
  }

  /**
   * Load configuration with fallback to default
   */
  static loadOrDefault(countryCode: string): CountryConfig {
    const config = this.load(countryCode);
    if (config) {
      return config;
    }

    if (this.defaultConfig) {
      console.warn(
        `No configuration found for ${countryCode}, using default configuration`
      );
      return this.defaultConfig;
    }

    throw new Error(
      `No configuration found for ${countryCode} and no default configuration set`
    );
  }

  /**
   * Clear all cached configurations
   */
  static clearCache(): void {
    this.configs.clear();
  }

  /**
   * Remove a specific configuration
   */
  static remove(countryCode: string): boolean {
    return this.configs.delete(countryCode.toUpperCase());
  }

  /**
   * Get configuration by region
   */
  static getByRegion(region: string): CountryConfig[] {
    return this.getAll().filter(
      config => config.region.toLowerCase() === region.toLowerCase()
    );
  }

  /**
   * Get configurations by regulatory framework
   */
  static getByFramework(framework: string): CountryConfig[] {
    return this.getAll().filter(config =>
      config.regulatoryFramework.some(
        f => f.toLowerCase() === framework.toLowerCase()
      )
    );
  }

  /**
   * Check if a feature is allowed in a country
   */
  static isFeatureAllowed(
    countryCode: string,
    feature: keyof CountryConfig['features']
  ): boolean {
    const config = this.load(countryCode);
    if (!config) {
      return false;
    }
    return config.features[feature] === true;
  }

  /**
   * Get provider configuration for a country
   */
  static getProviders(countryCode: string, type?: string): any[] {
    const config = this.load(countryCode);
    if (!config) {
      return [];
    }

    if (type) {
      return config.providers.filter(p => p.type === type);
    }

    return config.providers;
  }

  /**
   * Export configuration as JSON
   */
  static export(countryCode: string): string | null {
    const config = this.load(countryCode);
    if (!config) {
      return null;
    }
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  static import(json: string): void {
    try {
      const config = JSON.parse(json) as CountryConfig;
      this.register(config);
    } catch (error) {
      throw new Error(
        `Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
