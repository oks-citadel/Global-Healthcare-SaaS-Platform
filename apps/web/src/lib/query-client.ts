import { QueryClient, DefaultOptions, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner'; // Assuming you're using sonner for toast notifications

/**
 * Default query options for React Query
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time - how long data is considered fresh
    staleTime: 1000 * 60 * 5, // 5 minutes

    // Cache time - how long inactive data stays in cache
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)

    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch configuration
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,

    // Network mode
    networkMode: 'online',
  },

  mutations: {
    // Retry configuration for mutations
    retry: false, // Don't retry mutations by default

    // Network mode
    networkMode: 'online',
  },
};

/**
 * Query cache with global error handling
 */
const queryCache = new QueryCache({
  onError: (error: any, query) => {
    // Log errors
    console.error('Query error:', error, query);

    // Show toast for specific errors
    if (error?.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Optionally redirect to login
      // window.location.href = '/login';
    } else if (error?.response?.status === 403) {
      toast.error('You do not have permission to access this resource.');
    } else if (error?.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error?.message && !error?.response) {
      // Network errors
      toast.error('Network error. Please check your connection.');
    }
  },
  onSuccess: (data, query) => {
    // Optional: Log successful queries in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Query success:', query.queryKey);
    }
  },
});

/**
 * Mutation cache with global error handling
 */
const mutationCache = new MutationCache({
  onError: (error: any, variables, context, mutation) => {
    console.error('Mutation error:', error, mutation);

    // Default error handling
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
  },
  onSuccess: (data: any, variables, context, mutation) => {
    // Optional: Show success toast for mutations
    if (data?.message) {
      toast.success(data.message);
    }
  },
});

/**
 * Create and configure the Query Client
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
    queryCache,
    mutationCache,
  });
}

/**
 * Singleton query client instance
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get or create the query client
 * Use this for client-side rendering
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: create once and reuse
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Query key factories for better organization and type safety
 */
export const queryKeys = {
  // User queries
  user: {
    all: ['users'] as const,
    lists: () => [...queryKeys.user.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.user.lists(), filters] as const,
    details: () => [...queryKeys.user.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.user.details(), id] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },

  // Appointment queries
  appointment: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointment.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.appointment.lists(), filters] as const,
    details: () => [...queryKeys.appointment.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointment.details(), id] as const,
    upcoming: () => [...queryKeys.appointment.all, 'upcoming'] as const,
  },

  // Medical record queries
  medicalRecord: {
    all: ['medical-records'] as const,
    lists: () => [...queryKeys.medicalRecord.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.medicalRecord.lists(), filters] as const,
    details: () => [...queryKeys.medicalRecord.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.medicalRecord.details(), id] as const,
  },

  // Doctor queries
  doctor: {
    all: ['doctors'] as const,
    lists: () => [...queryKeys.doctor.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.doctor.lists(), filters] as const,
    details: () => [...queryKeys.doctor.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.doctor.details(), id] as const,
    available: (date: string) =>
      [...queryKeys.doctor.all, 'available', date] as const,
  },
};

/**
 * Prefetch strategies
 */
export const prefetchStrategies = {
  /**
   * Prefetch related data on hover
   */
  onHover: async (queryClient: QueryClient, queryKey: any[], queryFn: any) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },

  /**
   * Prefetch next page for pagination
   */
  nextPage: async (
    queryClient: QueryClient,
    queryKey: any[],
    queryFn: any,
    currentPage: number
  ) => {
    const nextPageKey = [...queryKey.slice(0, -1), { page: currentPage + 1 }];
    await queryClient.prefetchQuery({
      queryKey: nextPageKey,
      queryFn: () => queryFn(currentPage + 1),
      staleTime: 1000 * 60 * 5,
    });
  },

  /**
   * Prefetch details when viewing list
   */
  listToDetail: async (
    queryClient: QueryClient,
    detailKeys: any[][],
    queryFns: any[]
  ) => {
    await Promise.all(
      detailKeys.map((key, index) =>
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: queryFns[index],
          staleTime: 1000 * 60 * 5,
        })
      )
    );
  },
};

/**
 * Cache persistence utilities
 */
export const cacheUtils = {
  /**
   * Persist query cache to localStorage
   */
  persistCache: (queryClient: QueryClient) => {
    if (typeof window === 'undefined') return;

    try {
      const cache = queryClient.getQueryCache().getAll();
      const serialized = cache
        .filter(query => query.state.data !== undefined)
        .map(query => ({
          queryKey: query.queryKey,
          queryHash: query.queryHash,
          state: query.state,
        }));

      localStorage.setItem('REACT_QUERY_CACHE', JSON.stringify(serialized));
    } catch (error) {
      console.error('Error persisting cache:', error);
    }
  },

  /**
   * Restore query cache from localStorage
   */
  restoreCache: (queryClient: QueryClient) => {
    if (typeof window === 'undefined') return;

    try {
      const cached = localStorage.getItem('REACT_QUERY_CACHE');
      if (!cached) return;

      const parsed = JSON.parse(cached);
      parsed.forEach((query: any) => {
        queryClient.setQueryData(query.queryKey, query.state.data);
      });
    } catch (error) {
      console.error('Error restoring cache:', error);
      localStorage.removeItem('REACT_QUERY_CACHE');
    }
  },

  /**
   * Clear persisted cache
   */
  clearPersistedCache: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('REACT_QUERY_CACHE');
  },
};

/**
 * Optimistic update helpers
 */
export const optimisticUtils = {
  /**
   * Generic optimistic update
   */
  update: async <T>(
    queryClient: QueryClient,
    queryKey: any[],
    updater: (old: T | undefined) => T,
    rollback?: (old: T | undefined) => void
  ) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = queryClient.getQueryData<T>(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData<T>(queryKey, updater);

    // Return a context object with the snapshotted value
    return { previousData, rollback };
  },

  /**
   * Rollback optimistic update
   */
  rollback: <T>(
    queryClient: QueryClient,
    queryKey: any[],
    previousData: T | undefined
  ) => {
    queryClient.setQueryData(queryKey, previousData);
  },
};

/**
 * Background sync configuration
 */
export const backgroundSync = {
  /**
   * Setup periodic background sync for specific queries
   */
  setupSync: (
    queryClient: QueryClient,
    queryKey: any[],
    interval: number = 30000 // 30 seconds default
  ) => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
    }, interval);

    return () => clearInterval(intervalId);
  },

  /**
   * Sync on network reconnection
   */
  syncOnReconnect: (queryClient: QueryClient) => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      queryClient.refetchQueries({
        type: 'active',
        stale: true,
      });
    };

    window.addEventListener('online', handleOnline);

    return () => window.removeEventListener('online', handleOnline);
  },
};

/**
 * Performance monitoring
 */
export const performanceMonitoring = {
  /**
   * Log slow queries
   */
  logSlowQueries: (queryClient: QueryClient, threshold: number = 1000) => {
    queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'updated' && event.action.type === 'success') {
        const query = event.query;
        const fetchDuration = query.state.dataUpdatedAt - query.state.fetchFailureCount;

        if (fetchDuration > threshold) {
          console.warn('Slow query detected:', {
            queryKey: query.queryKey,
            duration: fetchDuration,
          });
        }
      }
    });
  },

  /**
   * Track cache hit rate
   */
  trackCacheHitRate: (queryClient: QueryClient) => {
    let hits = 0;
    let misses = 0;

    queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'updated') {
        if (event.action.type === 'success' && event.query.state.data) {
          if (event.query.state.dataUpdatedAt === event.query.state.dataUpdateCount) {
            misses++;
          } else {
            hits++;
          }
        }
      }
    });

    return () => {
      const total = hits + misses;
      const hitRate = total > 0 ? (hits / total) * 100 : 0;
      console.log(`Cache hit rate: ${hitRate.toFixed(2)}% (${hits}/${total})`);
    };
  },
};

export default getQueryClient;
