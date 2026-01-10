/**
 * Client-side Optimization Configuration
 * Reduces API calls, bandwidth usage, and improves performance
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client with cost-optimized defaults
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (reduces refetches)
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: How long inactive data stays in cache
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)

      // Retry configuration
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch settings (disable aggressive refetching)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true,
      refetchOnMount: false, // Use cached data on mount

      // Network mode
      networkMode: 'offlineFirst' as const,
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst' as const,
    },
  },
};

export const createOptimizedQueryClient = () => new QueryClient(queryClientConfig);

/**
 * Resource-specific cache configurations
 */
export const resourceCacheConfig = {
  // User data - longer cache, user-specific
  user: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  // Provider listings - moderate cache
  providers: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  // Appointments - shorter cache for accuracy
  appointments: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Medical records - longer cache, rarely changes
  medicalRecords: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },

  // Static content - very long cache
  static: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Messages - real-time, shorter cache
  messages: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // Notifications - very short cache
  notifications: {
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  },
};

/**
 * Pagination configuration to reduce data transfer
 */
export const paginationConfig = {
  defaultPageSize: 20,
  maxPageSize: 50,

  // Prefetch adjacent pages for smoother UX
  prefetchPages: 1,

  // Infinite query configuration
  infinite: {
    getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
    getPreviousPageParam: (firstPage: any) => firstPage.prevCursor || undefined,
    maxPages: 10, // Limit cached pages to save memory
  },
};

/**
 * Image optimization configuration
 */
export const imageOptimizationConfig = {
  // Responsive image sizes
  sizes: {
    thumbnail: 64,
    small: 128,
    medium: 256,
    large: 512,
    full: 1024,
  },

  // Quality settings
  quality: {
    thumbnail: 60,
    small: 70,
    medium: 80,
    large: 85,
    full: 90,
  },

  // WebP support detection
  supportsWebP: typeof document !== 'undefined' &&
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,

  // AVIF support (future)
  supportsAvif: false,

  // Lazy loading settings
  lazyLoading: {
    enabled: true,
    rootMargin: '100px',
    threshold: 0.1,
  },

  // Placeholder settings
  placeholder: {
    type: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==',
  },
};

/**
 * API request optimization
 */
export const apiOptimizationConfig = {
  // Request deduplication
  deduplication: {
    enabled: true,
    windowMs: 100, // Dedupe requests within 100ms window
  },

  // Request batching
  batching: {
    enabled: true,
    maxBatchSize: 10,
    maxWaitMs: 50,
  },

  // Compression
  compression: {
    enabled: true,
    minSize: 1024, // Only compress requests > 1KB
  },

  // Caching headers
  headers: {
    // Tell server we accept compressed responses
    'Accept-Encoding': 'gzip, deflate, br',
    // Accept JSON primarily
    'Accept': 'application/json',
  },
};

/**
 * Offline support configuration
 */
export const offlineConfig = {
  // Enable offline mode
  enabled: true,

  // Sync strategy
  syncStrategy: 'background' as const,

  // Retry configuration for failed mutations
  mutationRetry: {
    maxRetries: 3,
    retryDelay: 5000,
  },

  // Storage limit (in bytes)
  storageLimit: 50 * 1024 * 1024, // 50MB

  // Priority for offline sync
  syncPriority: [
    'appointments', // Sync appointments first
    'messages',
    'healthRecords',
    'notifications',
  ],
};

/**
 * Prefetching configuration
 */
export const prefetchConfig = {
  // Routes to prefetch data for
  routes: {
    dashboard: ['appointments', 'notifications', 'healthSummary'],
    providers: ['specialties', 'featuredProviders'],
    appointments: ['upcomingAppointments'],
    records: ['recentRecords', 'prescriptions'],
  },

  // Hover prefetch delay (ms)
  hoverDelay: 200,

  // Link prefetch delay (ms)
  linkDelay: 100,
};

/**
 * Bundle splitting configuration hints
 */
export const bundleConfig = {
  // Routes to lazy load
  lazyRoutes: [
    'video-call',
    'medical-records',
    'billing',
    'settings',
    'provider-portal',
  ],

  // Preload on idle
  preloadOnIdle: [
    'appointments',
    'messages',
  ],
};

/**
 * Performance monitoring thresholds
 */
export const performanceThresholds = {
  // Core Web Vitals targets
  lcp: 2500, // Largest Contentful Paint (ms)
  fid: 100,  // First Input Delay (ms)
  cls: 0.1,  // Cumulative Layout Shift

  // API response time targets
  apiResponseTime: {
    fast: 100,
    acceptable: 500,
    slow: 2000,
  },

  // Bundle size budgets (KB)
  bundleSize: {
    main: 200,
    vendor: 300,
    total: 500,
  },
};

export default {
  queryClientConfig,
  resourceCacheConfig,
  paginationConfig,
  imageOptimizationConfig,
  apiOptimizationConfig,
  offlineConfig,
  prefetchConfig,
  bundleConfig,
  performanceThresholds,
};
