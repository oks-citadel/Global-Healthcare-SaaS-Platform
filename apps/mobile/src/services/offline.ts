import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetInfo } from '@react-native-community/netinfo';
import apiClient from '../api/client';
import { socketService } from './socket';

// Storage keys
const STORAGE_KEYS = {
  PENDING_ACTIONS: '@offline_pending_actions',
  MESSAGES_CACHE: '@offline_messages_cache',
  APPOINTMENTS_CACHE: '@offline_appointments_cache',
  USER_DATA_CACHE: '@offline_user_data_cache',
  SYNC_TIMESTAMP: '@offline_sync_timestamp',
  OFFLINE_MODE: '@offline_mode',
} as const;

export type ActionType =
  | 'send_message'
  | 'create_appointment'
  | 'update_appointment'
  | 'cancel_appointment'
  | 'update_profile'
  | 'mark_message_read';

export interface PendingAction {
  id: string;
  type: ActionType;
  payload: any;
  timestamp: string;
  retries: number;
  error?: string;
}

export interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{ actionId: string; error: string }>;
}

export interface OfflineData<T> {
  data: T;
  timestamp: string;
  version: number;
}

export type ConflictResolutionStrategy = 'server-wins' | 'client-wins' | 'newest-wins' | 'merge';

class OfflineService {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private unsubscribeNetInfo?: () => void;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize offline service
   */
  async initialize(): Promise<void> {
    // Subscribe to network state changes
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // Notify listeners
      this.notifyListeners();

      // If we just came online, trigger sync
      if (!wasOnline && this.isOnline) {
        this.syncPendingActions().catch(() => {
          // Auto-sync failed
        });
      }
    });

    // Get initial network state
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
  }

  /**
   * Check if device is online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to network state changes
   */
  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of network state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isOnline));
  }

  /**
   * Queue an action for later execution when online
   */
  async queueAction(type: ActionType, payload: any): Promise<string> {
    const action: PendingAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    const actions = await this.getPendingActions();
    actions.push(action);
    await this.savePendingActions(actions);

    return action.id;
  }

  /**
   * Get all pending actions
   */
  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Save pending actions
   */
  private async savePendingActions(actions: PendingAction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(actions));
    } catch (error) {
      // Failed to save pending actions
    }
  }

  /**
   * Remove an action from the queue
   */
  async removeAction(actionId: string): Promise<void> {
    const actions = await this.getPendingActions();
    const filtered = actions.filter((a) => a.id !== actionId);
    await this.savePendingActions(filtered);
  }

  /**
   * Clear all pending actions
   */
  async clearPendingActions(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS);
  }

  /**
   * Execute a pending action
   */
  private async executeAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'send_message':
        await socketService.sendChatMessage(action.payload);
        break;

      case 'create_appointment':
        await apiClient.post('/appointments', action.payload);
        break;

      case 'update_appointment':
        await apiClient.put(`/appointments/${action.payload.id}`, action.payload);
        break;

      case 'cancel_appointment':
        await apiClient.delete(`/appointments/${action.payload.id}`);
        break;

      case 'update_profile':
        await apiClient.put('/users/profile', action.payload);
        break;

      case 'mark_message_read':
        socketService.markMessageRead(action.payload.messageId);
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Sync all pending actions
   */
  async syncPendingActions(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { success: false, processed: 0, failed: 0, errors: [] };
    }

    if (!this.isOnline) {
      return { success: false, processed: 0, failed: 0, errors: [] };
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
    };

    try {
      const actions = await this.getPendingActions();

      if (actions.length === 0) {
        return result;
      }

      // Process actions sequentially to maintain order
      for (const action of actions) {
        try {
          await this.executeAction(action);
          await this.removeAction(action.id);
          result.processed++;
        } catch (error: any) {

          action.retries++;
          action.error = error.message;

          // Remove action if it has failed too many times
          if (action.retries >= 3) {
            await this.removeAction(action.id);
            result.failed++;
            result.errors.push({
              actionId: action.id,
              error: error.message,
            });
          } else {
            // Update action with error and retry count
            const actions = await this.getPendingActions();
            const index = actions.findIndex((a) => a.id === action.id);
            if (index !== -1) {
              actions[index] = action;
              await this.savePendingActions(actions);
            }
          }
        }
      }

      // Update sync timestamp
      await this.updateSyncTimestamp();

      result.success = result.failed === 0;
    } catch (error) {
      result.success = false;
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  /**
   * Cache data for offline access
   */
  async cacheData<T>(key: string, data: T): Promise<void> {
    try {
      const offlineData: OfflineData<T> = {
        data,
        timestamp: new Date().toISOString(),
        version: 1,
      };
      await AsyncStorage.setItem(key, JSON.stringify(offlineData));
    } catch (error) {
      // Failed to cache data
    }
  }

  /**
   * Get cached data
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const offlineData: OfflineData<T> = JSON.parse(data);
      return offlineData.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Remove cached data
   */
  async removeCachedData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Failed to remove cached data
    }
  }

  /**
   * Cache messages for offline access
   */
  async cacheMessages(roomId: string, messages: any[]): Promise<void> {
    const key = `${STORAGE_KEYS.MESSAGES_CACHE}_${roomId}`;
    await this.cacheData(key, messages);
  }

  /**
   * Get cached messages
   */
  async getCachedMessages(roomId: string): Promise<any[]> {
    const key = `${STORAGE_KEYS.MESSAGES_CACHE}_${roomId}`;
    return (await this.getCachedData<any[]>(key)) || [];
  }

  /**
   * Cache appointments
   */
  async cacheAppointments(appointments: any[]): Promise<void> {
    await this.cacheData(STORAGE_KEYS.APPOINTMENTS_CACHE, appointments);
  }

  /**
   * Get cached appointments
   */
  async getCachedAppointments(): Promise<any[]> {
    return (await this.getCachedData<any[]>(STORAGE_KEYS.APPOINTMENTS_CACHE)) || [];
  }

  /**
   * Cache user data
   */
  async cacheUserData(userData: any): Promise<void> {
    await this.cacheData(STORAGE_KEYS.USER_DATA_CACHE, userData);
  }

  /**
   * Get cached user data
   */
  async getCachedUserData(): Promise<any | null> {
    return this.getCachedData(STORAGE_KEYS.USER_DATA_CACHE);
  }

  /**
   * Update sync timestamp
   */
  private async updateSyncTimestamp(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_TIMESTAMP,
        new Date().toISOString()
      );
    } catch (error) {
      // Failed to update sync timestamp
    }
  }

  /**
   * Get last sync timestamp
   */
  async getLastSyncTimestamp(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SYNC_TIMESTAMP);
    } catch (error) {
      return null;
    }
  }

  /**
   * Resolve conflicts between local and server data
   */
  async resolveConflict<T>(
    localData: T,
    serverData: T,
    strategy: ConflictResolutionStrategy = 'server-wins'
  ): Promise<T> {
    switch (strategy) {
      case 'server-wins':
        return serverData;

      case 'client-wins':
        return localData;

      case 'newest-wins':
        const localTimestamp = (localData as any).updatedAt || (localData as any).timestamp;
        const serverTimestamp = (serverData as any).updatedAt || (serverData as any).timestamp;
        return new Date(localTimestamp) > new Date(serverTimestamp) ? localData : serverData;

      case 'merge':
        // Simple merge strategy - can be customized per data type
        return { ...serverData, ...localData };

      default:
        return serverData;
    }
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS),
        AsyncStorage.removeItem(STORAGE_KEYS.MESSAGES_CACHE),
        AsyncStorage.removeItem(STORAGE_KEYS.APPOINTMENTS_CACHE),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA_CACHE),
        AsyncStorage.removeItem(STORAGE_KEYS.SYNC_TIMESTAMP),
      ]);
    } catch (error) {
      // Failed to clear offline data
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    pendingActions: number;
    cachedMessages: number;
    cachedAppointments: number;
    lastSync: string | null;
  }> {
    const [pendingActions, lastSync] = await Promise.all([
      this.getPendingActions(),
      this.getLastSyncTimestamp(),
    ]);

    return {
      pendingActions: pendingActions.length,
      cachedMessages: 0, // Would need to iterate all message caches
      cachedAppointments: 0, // Would need to count cached appointments
      lastSync,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.unsubscribeNetInfo?.();
    this.listeners.clear();
  }
}

// Export singleton instance
export const offlineService = new OfflineService();
export default offlineService;
