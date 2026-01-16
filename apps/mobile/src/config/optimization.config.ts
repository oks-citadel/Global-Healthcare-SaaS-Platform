/**
 * Mobile App Optimization Configuration
 * Optimized for battery life, data usage, and performance
 */

import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

/**
 * React Query client with mobile-optimized defaults
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Longer stale time for mobile (reduce network requests)
      staleTime: 10 * 60 * 1000, // 10 minutes

      // Keep data in cache longer
      gcTime: 60 * 60 * 1000, // 1 hour

      // Conservative retry strategy (save battery)
      retry: 1,
      retryDelay: (attemptIndex: number) => Math.min(2000 * 2 ** attemptIndex, 60000),

      // Disable aggressive refetching (save data)
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always' as const,
      refetchOnMount: false,

      // Network mode - prioritize offline
      networkMode: 'offlineFirst' as const,
    },
    mutations: {
      retry: 2,
      networkMode: 'offlineFirst' as const,
    },
  },
};

export const createOptimizedQueryClient = () => new QueryClient(queryClientConfig);

/**
 * Mobile-specific resource cache configurations
 */
export const resourceCacheConfig = {
  // User profile - cache aggressively
  user: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
  },

  // Provider listings - cache for browsing
  providers: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },

  // Appointments - moderate freshness
  appointments: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  // Medical records - very stable, cache long
  medicalRecords: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Messages - real-time needs
  messages: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
};

/**
 * Image optimization for mobile
 */
export const imageConfig = {
  // Size mappings for different contexts
  sizes: {
    avatar: {
      width: 48,
      height: 48,
    },
    thumbnail: {
      width: 100,
      height: 100,
    },
    card: {
      width: 200,
      height: 150,
    },
    full: {
      width: 400,
      height: 300,
    },
  },

  // Quality based on network
  qualityByNetwork: {
    wifi: 85,
    '4g': 75,
    '3g': 60,
    '2g': 40,
    offline: 40,
  },

  // Format preference
  preferredFormat: 'webp',

  // Caching
  cachePolicy: 'disk' as const,
  maxCacheSize: 100 * 1024 * 1024, // 100MB

  // Placeholder
  placeholder: {
    type: 'blurhash' as const,
    blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I',
  },
};

/**
 * Network-aware data fetching
 */
export const networkConfig = {
  // Reduce data usage on metered connections
  meteredConnection: {
    reducedQuality: true,
    deferNonCritical: true,
    disableAutoRefresh: true,
    limitPagination: 10,
  },

  // Offline mode settings
  offline: {
    enabled: true,
    maxStorageSize: 200 * 1024 * 1024, // 200MB
    syncOnReconnect: true,
    prioritySync: ['appointments', 'messages'],
  },

  // Background sync
  backgroundSync: {
    enabled: true,
    minInterval: 15 * 60 * 1000, // 15 minutes
    wifiOnly: true,
  },
};

/**
 * Battery-aware settings
 */
export const batteryConfig = {
  // Low battery thresholds
  lowBatteryThreshold: 20,
  criticalBatteryThreshold: 10,

  // Behavior when battery is low
  lowBatteryMode: {
    disableAnimations: true,
    reducePolling: true,
    deferSync: true,
    reducedImageQuality: true,
  },

  // Polling intervals (ms)
  pollingIntervals: {
    normal: 30000,
    lowBattery: 120000,
    critical: 300000,
  },
};

/**
 * Push notification optimization
 */
export const notificationConfig = {
  // Batch notifications to reduce wake-ups
  batchingEnabled: true,
  batchInterval: 5 * 60 * 1000, // 5 minutes

  // Priority settings
  priorities: {
    appointment_reminder: 'high',
    message: 'high',
    prescription_refill: 'normal',
    health_tip: 'low',
    marketing: 'min',
  },

  // Quiet hours
  quietHours: {
    enabled: true,
    start: 22, // 10 PM
    end: 7, // 7 AM
    exceptions: ['emergency', 'appointment_reminder'],
  },
};

/**
 * Pagination optimized for mobile
 */
export const paginationConfig = {
  // Smaller page sizes for mobile
  defaultPageSize: 15,
  maxPageSize: 30,

  // Infinite scroll settings
  infinite: {
    threshold: 200, // Pixels from bottom to trigger load
    maxPages: 5, // Limit cached pages for memory
  },

  // Pull to refresh
  pullToRefresh: {
    enabled: true,
    threshold: 80,
  },
};

/**
 * Animation and rendering optimization
 */
export const renderingConfig = {
  // Use native driver when possible
  useNativeDriver: true,

  // List optimization
  lists: {
    windowSize: 5,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 10,
    removeClippedSubviews: Platform.OS === 'android',
  },

  // Reduce animations on low-end devices
  reducedMotion: {
    enabled: false, // Detect from system settings
    checkSystemSetting: true,
  },
};

/**
 * Memory management
 */
export const memoryConfig = {
  // Maximum cached items
  maxCachedQueries: 50,
  maxCachedImages: 100,

  // Clear cache thresholds
  memoryClearThreshold: 0.8, // Clear when 80% memory used

  // Eviction strategy
  evictionStrategy: 'lru' as const,
};

/**
 * Analytics and logging (minimal for battery)
 */
export const analyticsConfig = {
  // Batch analytics events
  batchSize: 20,
  batchInterval: 60000, // 1 minute

  // Reduce logging in production
  logLevel: __DEV__ ? 'debug' : 'error',

  // Disable verbose network logging
  networkLogging: __DEV__,
};

/**
 * Video call optimization
 */
export const videoCallConfig = {
  // Adaptive bitrate based on network
  adaptiveBitrate: true,

  // Resolution settings
  resolution: {
    wifi: { width: 1280, height: 720 },
    '4g': { width: 854, height: 480 },
    '3g': { width: 640, height: 360 },
  },

  // Frame rate settings
  frameRate: {
    wifi: 30,
    '4g': 24,
    '3g': 15,
  },

  // Audio-only fallback
  audioOnlyFallback: {
    enabled: true,
    onPoorConnection: true,
    onLowBattery: true,
  },
};

export default {
  queryClientConfig,
  resourceCacheConfig,
  imageConfig,
  networkConfig,
  batteryConfig,
  notificationConfig,
  paginationConfig,
  renderingConfig,
  memoryConfig,
  analyticsConfig,
  videoCallConfig,
};
