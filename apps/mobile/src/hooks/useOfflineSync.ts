import { useState, useEffect, useCallback, useRef } from 'react';
import {
  offlineService,
  PendingAction,
  SyncResult,
  ActionType,
  ConflictResolutionStrategy,
} from '../services/offline';
import { useAuthStore } from '../store/authStore';

export interface UseOfflineSyncOptions {
  autoSync?: boolean;
  syncInterval?: number; // in milliseconds
  onSyncComplete?: (result: SyncResult) => void;
  onSyncError?: (error: Error) => void;
}

export interface UseOfflineSyncReturn {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActions: PendingAction[];
  lastSync: string | null;
  error: Error | null;
  sync: () => Promise<SyncResult>;
  queueAction: (type: ActionType, payload: any) => Promise<string>;
  clearPending: () => Promise<void>;
  getStorageStats: () => Promise<{
    pendingActions: number;
    cachedMessages: number;
    cachedAppointments: number;
    lastSync: string | null;
  }>;
}

/**
 * Hook for managing offline synchronization
 */
export function useOfflineSync(options: UseOfflineSyncOptions = {}): UseOfflineSyncReturn {
  const {
    autoSync = true,
    syncInterval = 30000, // 30 seconds
    onSyncComplete,
    onSyncError,
  } = options;

  const [isOnline, setIsOnline] = useState(offlineService.getIsOnline());
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { isAuthenticated } = useAuthStore();
  const syncIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isMounted = useRef(true);

  /**
   * Sync pending actions with server
   */
  const sync = useCallback(async (): Promise<SyncResult> => {
    if (!isAuthenticated) {
      return { success: false, processed: 0, failed: 0, errors: [] };
    }

    if (!isOnline) {
      return { success: false, processed: 0, failed: 0, errors: [] };
    }

    setIsSyncing(true);
    setError(null);

    try {
      const result = await offlineService.syncPendingActions();

      if (isMounted.current) {
        const timestamp = await offlineService.getLastSyncTimestamp();
        setLastSync(timestamp);
        setPendingActions(await offlineService.getPendingActions());
        onSyncComplete?.(result);
      }

      return result;
    } catch (err: any) {
      if (isMounted.current) {
        setError(err);
        onSyncError?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setIsSyncing(false);
      }
    }
  }, [isAuthenticated, isOnline, onSyncComplete, onSyncError]);

  /**
   * Queue an action for later sync
   */
  const queueAction = useCallback(
    async (type: ActionType, payload: any): Promise<string> => {
      try {
        const actionId = await offlineService.queueAction(type, payload);
        setPendingActions(await offlineService.getPendingActions());
        return actionId;
      } catch (err: any) {
        console.error('[useOfflineSync] Queue action error:', err);
        throw err;
      }
    },
    []
  );

  /**
   * Clear all pending actions
   */
  const clearPending = useCallback(async (): Promise<void> => {
    try {
      await offlineService.clearPendingActions();
      setPendingActions([]);
    } catch (err: any) {
      throw err;
    }
  }, []);

  /**
   * Get storage statistics
   */
  const getStorageStats = useCallback(async () => {
    return offlineService.getStorageStats();
  }, []);

  /**
   * Load initial state
   */
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [actions, timestamp] = await Promise.all([
          offlineService.getPendingActions(),
          offlineService.getLastSyncTimestamp(),
        ]);

        if (isMounted.current) {
          setPendingActions(actions);
          setLastSync(timestamp);
        }
      } catch (err) {
        // Failed to load initial state
      }
    };

    loadInitialState();
  }, []);

  /**
   * Subscribe to network state changes
   */
  useEffect(() => {
    const unsubscribe = offlineService.subscribe((online) => {
      setIsOnline(online);

      // Auto-sync when coming online
      if (online && autoSync && isAuthenticated) {
        sync().catch(() => {
          // Auto-sync failed silently
        });
      }
    });

    return unsubscribe;
  }, [autoSync, isAuthenticated, sync]);

  /**
   * Setup auto-sync interval
   */
  useEffect(() => {
    if (autoSync && isOnline && isAuthenticated && syncInterval > 0) {
      syncIntervalRef.current = setInterval(() => {
        if (pendingActions.length > 0) {
          sync().catch(() => {
            // Auto-sync interval failed silently
          });
        }
      }, syncInterval);

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [autoSync, isOnline, isAuthenticated, syncInterval, pendingActions.length, sync]);

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  return {
    isOnline,
    isSyncing,
    pendingActions,
    lastSync,
    error,
    sync,
    queueAction,
    clearPending,
    getStorageStats,
  };
}

/**
 * Hook for managing cached data
 */
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    staleTime?: number; // Time in ms before data is considered stale
    refetchOnMount?: boolean;
    refetchOnReconnect?: boolean;
  } = {}
) {
  const { staleTime = 300000, refetchOnMount = true, refetchOnReconnect = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const { isOnline } = useOfflineSync({ autoSync: false });
  const isMounted = useRef(true);

  /**
   * Fetch data from server or cache
   */
  const fetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      let fetchedData: T;

      if (isOnline) {
        // Fetch from server
        fetchedData = await fetchFn();

        // Cache the data
        await offlineService.cacheData(key, fetchedData);

        if (isMounted.current) {
          setData(fetchedData);
          setLastFetch(Date.now());
        }
      } else {
        // Load from cache
        const cachedData = await offlineService.getCachedData<T>(key);

        if (isMounted.current) {
          if (cachedData) {
            setData(cachedData);
          } else {
            throw new Error('No cached data available');
          }
        }
      }
    } catch (err: any) {

      // Try to load from cache on error
      try {
        const cachedData = await offlineService.getCachedData<T>(key);
        if (isMounted.current && cachedData) {
          setData(cachedData);
        } else {
          setError(err);
        }
      } catch (cacheErr) {
        if (isMounted.current) {
          setError(err);
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [key, fetchFn, isOnline]);

  /**
   * Refetch data
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetch();
  }, [fetch]);

  /**
   * Check if data is stale
   */
  const isStale = useCallback((): boolean => {
    return Date.now() - lastFetch > staleTime;
  }, [lastFetch, staleTime]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    if (refetchOnMount) {
      fetch();
    }
  }, [refetchOnMount, fetch]);

  /**
   * Refetch on reconnect
   */
  useEffect(() => {
    if (refetchOnReconnect && isOnline && data && isStale()) {
      fetch();
    }
  }, [refetchOnReconnect, isOnline, data, isStale, fetch]);

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    isStale: isStale(),
  };
}

/**
 * Hook for managing optimistic updates
 */
export function useOptimisticUpdate<T>() {
  const [data, setData] = useState<T | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, T>>(new Map());
  const { isOnline } = useOfflineSync({ autoSync: false });

  /**
   * Perform optimistic update
   */
  const update = useCallback(
    async (
      id: string,
      updateFn: (current: T | null) => T,
      serverUpdateFn: (data: T) => Promise<T>,
      options: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error, rollback: () => void) => void;
        conflictResolution?: ConflictResolutionStrategy;
      } = {}
    ): Promise<void> => {
      const { onSuccess, onError, conflictResolution = 'server-wins' } = options;

      // Apply optimistic update immediately
      const optimisticData = updateFn(data);
      setData(optimisticData);
      setPendingUpdates((prev) => new Map(prev).set(id, optimisticData));

      try {
        if (isOnline) {
          // Send update to server
          const serverData = await serverUpdateFn(optimisticData);

          // Resolve conflicts if needed
          const resolvedData = await offlineService.resolveConflict(
            optimisticData,
            serverData,
            conflictResolution
          );

          setData(resolvedData);
          setPendingUpdates((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });

          onSuccess?.(resolvedData);
        } else {
          // Queue for later sync
          await offlineService.queueAction('update_profile' as ActionType, optimisticData);
        }
      } catch (err: any) {

        // Rollback function
        const rollback = () => {
          setPendingUpdates((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });
          // Could restore previous data here if we tracked it
        };

        onError?.(err, rollback);

        if (!isOnline) {
          // Keep optimistic update even on error if offline
          await offlineService.queueAction('update_profile' as ActionType, optimisticData);
        } else {
          rollback();
        }
      }
    },
    [data, isOnline]
  );

  /**
   * Clear all pending updates
   */
  const clearPending = useCallback(() => {
    setPendingUpdates(new Map());
  }, []);

  return {
    data,
    setData,
    update,
    pendingUpdates: Array.from(pendingUpdates.entries()),
    hasPendingUpdates: pendingUpdates.size > 0,
    clearPending,
  };
}

/**
 * Hook for displaying offline indicator
 */
export function useOfflineIndicator() {
  const { isOnline, pendingActions, isSyncing } = useOfflineSync({ autoSync: true });

  const showIndicator = !isOnline || pendingActions.length > 0;
  const indicatorText = isSyncing
    ? 'Syncing...'
    : !isOnline
    ? 'Offline'
    : pendingActions.length > 0
    ? `${pendingActions.length} pending`
    : '';

  const indicatorType: 'offline' | 'syncing' | 'pending' | 'online' = isSyncing
    ? 'syncing'
    : !isOnline
    ? 'offline'
    : pendingActions.length > 0
    ? 'pending'
    : 'online';

  return {
    showIndicator,
    indicatorText,
    indicatorType,
    isOnline,
    isSyncing,
    pendingCount: pendingActions.length,
  };
}

export default useOfflineSync;
