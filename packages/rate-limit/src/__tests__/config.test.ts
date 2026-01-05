import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DEFAULT_CONFIGS, loadEnvConfig, buildConfigsFromEnv, REDIS_DEFAULTS } from '../config.js';

describe('rate-limit config', () => {
  describe('DEFAULT_CONFIGS', () => {
    it('should have general config with correct defaults', () => {
      expect(DEFAULT_CONFIGS.general).toBeDefined();
      expect(DEFAULT_CONFIGS.general.windowMs).toBe(60000);
      expect(DEFAULT_CONFIGS.general.max).toBe(100);
      expect(DEFAULT_CONFIGS.general.message).toContain('Too many requests');
    });

    it('should have auth config with stricter limits', () => {
      expect(DEFAULT_CONFIGS.auth).toBeDefined();
      expect(DEFAULT_CONFIGS.auth.windowMs).toBe(60000);
      expect(DEFAULT_CONFIGS.auth.max).toBe(10);
      expect(DEFAULT_CONFIGS.auth.skipSuccessfulRequests).toBe(false);
      expect(DEFAULT_CONFIGS.auth.blockDuration).toBe(15 * 60 * 1000);
    });

    it('should have upload config', () => {
      expect(DEFAULT_CONFIGS.upload).toBeDefined();
      expect(DEFAULT_CONFIGS.upload.windowMs).toBe(60000);
      expect(DEFAULT_CONFIGS.upload.max).toBe(20);
    });

    it('should have search config', () => {
      expect(DEFAULT_CONFIGS.search).toBeDefined();
      expect(DEFAULT_CONFIGS.search.windowMs).toBe(60000);
      expect(DEFAULT_CONFIGS.search.max).toBe(60);
    });
  });

  describe('REDIS_DEFAULTS', () => {
    it('should have correct default values', () => {
      expect(REDIS_DEFAULTS.host).toBe('localhost');
      expect(REDIS_DEFAULTS.port).toBe(6379);
      expect(REDIS_DEFAULTS.connectTimeout).toBe(5000);
      expect(REDIS_DEFAULTS.maxRetries).toBe(10);
      expect(REDIS_DEFAULTS.keyPrefix).toBe('rl:');
    });
  });

  describe('loadEnvConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return default values when no env vars set', () => {
      delete process.env.NODE_ENV;
      delete process.env.RATE_LIMIT_REDIS_ENABLED;
      delete process.env.REDIS_HOST;
      delete process.env.REDIS_PORT;

      const config = loadEnvConfig();

      expect(config.REDIS_HOST).toBe('localhost');
      expect(config.REDIS_PORT).toBe(6379);
      expect(config.RATE_LIMIT_GENERAL_MAX).toBe(100);
      expect(config.RATE_LIMIT_AUTH_MAX).toBe(10);
    });

    it('should read custom values from env vars', () => {
      process.env.RATE_LIMIT_GENERAL_MAX = '200';
      process.env.RATE_LIMIT_AUTH_MAX = '5';
      process.env.REDIS_HOST = 'redis.example.com';
      process.env.REDIS_PORT = '6380';

      const config = loadEnvConfig();

      expect(config.RATE_LIMIT_GENERAL_MAX).toBe(200);
      expect(config.RATE_LIMIT_AUTH_MAX).toBe(5);
      expect(config.REDIS_HOST).toBe('redis.example.com');
      expect(config.REDIS_PORT).toBe(6380);
    });

    it('should enable Redis in production by default', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.RATE_LIMIT_REDIS_ENABLED;

      const config = loadEnvConfig();
      expect(config.RATE_LIMIT_REDIS_ENABLED).toBe(true);
    });

    it('should respect explicit RATE_LIMIT_REDIS_ENABLED=false in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.RATE_LIMIT_REDIS_ENABLED = 'false';

      const config = loadEnvConfig();
      expect(config.RATE_LIMIT_REDIS_ENABLED).toBe(false);
    });
  });

  describe('buildConfigsFromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should merge env values with defaults', () => {
      process.env.RATE_LIMIT_GENERAL_MAX = '150';

      const configs = buildConfigsFromEnv();

      expect(configs.general.max).toBe(150);
      expect(configs.general.windowMs).toBe(60000); // Should keep default
      expect(configs.auth.max).toBe(10); // Should keep default
    });

    it('should return all endpoint types', () => {
      const configs = buildConfigsFromEnv();

      expect(configs).toHaveProperty('general');
      expect(configs).toHaveProperty('auth');
      expect(configs).toHaveProperty('upload');
      expect(configs).toHaveProperty('search');
    });
  });
});
