/**
 * Cache Configuration
 * Cost-optimized caching strategy for the healthcare platform
 */

export interface CacheConfig {
  // Redis connection
  redis: {
    host: string;
    port: number;
    password?: string;
    tls: boolean;
    maxRetriesPerRequest: number;
    retryDelayMs: number;
    connectionPoolSize: number;
  };

  // Cache TTLs (in seconds)
  ttl: {
    // Short-lived cache (1-5 minutes)
    realtime: number;
    // Medium cache (5-30 minutes)
    session: number;
    // Long cache (1-24 hours)
    static: number;
    // Very long cache (24+ hours)
    persistent: number;
  };

  // Per-resource TTLs
  resources: {
    user: number;
    provider: number;
    appointment: number;
    medicalRecord: number;
    prescription: number;
    conversation: number;
    notification: number;
    subscription: number;
    specialties: number;
    insuranceList: number;
  };

  // Cache key prefixes
  prefixes: {
    user: string;
    session: string;
    provider: string;
    appointment: string;
    record: string;
    search: string;
    rate: string;
    lock: string;
  };

  // Memory cache (L1) settings
  memory: {
    enabled: boolean;
    maxItems: number;
    ttl: number;
  };

  // Compression settings
  compression: {
    enabled: boolean;
    threshold: number; // bytes
  };
}

const isProduction = process.env.NODE_ENV === 'production';

export const cacheConfig: CacheConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    tls: isProduction,
    maxRetriesPerRequest: 3,
    retryDelayMs: 100,
    connectionPoolSize: isProduction ? 20 : 5,
  },

  ttl: {
    realtime: 60, // 1 minute
    session: 900, // 15 minutes
    static: 3600, // 1 hour
    persistent: 86400, // 24 hours
  },

  resources: {
    user: 900, // 15 minutes
    provider: 1800, // 30 minutes (providers don't change often)
    appointment: 300, // 5 minutes (appointments change frequently)
    medicalRecord: 3600, // 1 hour (records are mostly immutable)
    prescription: 1800, // 30 minutes
    conversation: 60, // 1 minute (for unread counts)
    notification: 300, // 5 minutes
    subscription: 3600, // 1 hour
    specialties: 86400, // 24 hours (rarely changes)
    insuranceList: 86400, // 24 hours
  },

  prefixes: {
    user: 'usr',
    session: 'ses',
    provider: 'prv',
    appointment: 'apt',
    record: 'rec',
    search: 'src',
    rate: 'rte',
    lock: 'lck',
  },

  memory: {
    enabled: true,
    maxItems: 1000,
    ttl: 60, // 1 minute L1 cache
  },

  compression: {
    enabled: true,
    threshold: 1024, // Compress if > 1KB
  },
};

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `${cacheConfig.prefixes.user}:${userId}`,
  userProfile: (userId: string) => `${cacheConfig.prefixes.user}:${userId}:profile`,
  session: (sessionId: string) => `${cacheConfig.prefixes.session}:${sessionId}`,

  provider: (providerId: string) => `${cacheConfig.prefixes.provider}:${providerId}`,
  providerList: (query: string) => `${cacheConfig.prefixes.provider}:list:${query}`,
  providerAvailability: (providerId: string, date: string) =>
    `${cacheConfig.prefixes.provider}:${providerId}:avail:${date}`,

  appointment: (appointmentId: string) => `${cacheConfig.prefixes.appointment}:${appointmentId}`,
  appointmentsByUser: (userId: string, page: number) =>
    `${cacheConfig.prefixes.appointment}:user:${userId}:${page}`,
  appointmentsByProvider: (providerId: string, date: string) =>
    `${cacheConfig.prefixes.appointment}:provider:${providerId}:${date}`,

  medicalRecords: (patientId: string, type?: string) =>
    `${cacheConfig.prefixes.record}:${patientId}${type ? `:${type}` : ''}`,
  medicalRecord: (recordId: string) => `${cacheConfig.prefixes.record}:${recordId}`,

  searchResults: (query: string, page: number) =>
    `${cacheConfig.prefixes.search}:${Buffer.from(query).toString('base64')}:${page}`,

  rateLimit: (key: string) => `${cacheConfig.prefixes.rate}:${key}`,
  lock: (resource: string) => `${cacheConfig.prefixes.lock}:${resource}`,

  // Static data
  specialties: () => `static:specialties`,
  insuranceProviders: () => `static:insurance`,
  pharmacies: (zipCode: string) => `static:pharmacies:${zipCode}`,
};

// Cache invalidation patterns
export const invalidationPatterns = {
  user: (userId: string) => [`${cacheConfig.prefixes.user}:${userId}*`],
  provider: (providerId: string) => [
    `${cacheConfig.prefixes.provider}:${providerId}*`,
    `${cacheConfig.prefixes.provider}:list:*`,
  ],
  appointment: (appointmentId: string, userId: string, providerId: string) => [
    `${cacheConfig.prefixes.appointment}:${appointmentId}`,
    `${cacheConfig.prefixes.appointment}:user:${userId}:*`,
    `${cacheConfig.prefixes.appointment}:provider:${providerId}:*`,
    `${cacheConfig.prefixes.provider}:${providerId}:avail:*`,
  ],
  medicalRecord: (patientId: string) => [`${cacheConfig.prefixes.record}:${patientId}*`],
};

export default cacheConfig;
