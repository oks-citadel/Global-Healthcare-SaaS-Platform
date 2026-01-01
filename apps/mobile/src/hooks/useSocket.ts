import { useState, useEffect, useCallback, useRef } from 'react';
import {
  socketService,
  ConnectionState,
  SocketEventCallback,
  ChatMessagePayload,
  TypingPayload,
  NotificationPayload,
} from '../services/socket';
import { useAuthStore } from '../store/authStore';
import { offlineService } from '../services/offline';

export interface UseSocketOptions {
  autoConnect?: boolean;
  reconnectOnAuth?: boolean;
}

export interface UseSocketReturn {
  isConnected: boolean;
  connectionState: ConnectionState;
  socketId?: string;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  emit: <T = any>(event: string, data?: any) => Promise<T>;
  on: <T extends keyof import('../services/socket').SocketEvents>(
    event: T,
    callback: SocketEventCallback<T>
  ) => () => void;
  sendMessage: (roomId: string, message: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  sendTyping: (roomId: string, isTyping: boolean) => void;
  updatePresence: (status: 'online' | 'offline' | 'away') => void;
}

/**
 * Hook for managing Socket.io connection and real-time features
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { autoConnect = true, reconnectOnAuth: _reconnectOnAuth = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [socketId, setSocketId] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const { isAuthenticated } = useAuthStore();
  const isInitialized = useRef(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Initialize socket connection
   */
  const connect = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setError(null);
      await socketService.initialize();
      setIsConnected(socketService.isConnected());
      setConnectionState(socketService.getConnectionState());
      setSocketId(socketService.getSocketId());
    } catch (err: any) {
      setError(err);
      setIsConnected(false);
      setConnectionState('error');
    }
  }, [isAuthenticated]);

  /**
   * Disconnect socket
   */
  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setConnectionState('disconnected');
    setSocketId(undefined);
  }, []);

  /**
   * Emit event to server
   */
  const emit = useCallback(
    async <T = any>(event: string, data?: any): Promise<T> => {
      try {
        return await socketService.emit<T>(event, data);
      } catch (err: any) {
        // If offline, queue the action
        if (!offlineService.getIsOnline()) {
          await offlineService.queueAction(event as any, data);
        }
        throw err;
      }
    },
    []
  );

  /**
   * Listen to socket events
   */
  const on = useCallback(
    <T extends keyof import('../services/socket').SocketEvents>(
      event: T,
      callback: SocketEventCallback<T>
    ): (() => void) => {
      return socketService.on(event, callback);
    },
    []
  );

  /**
   * Send chat message
   */
  const sendMessage = useCallback(
    async (roomId: string, message: string): Promise<void> => {
      try {
        if (offlineService.getIsOnline()) {
          await socketService.sendChatMessage({ roomId, message });
        } else {
          // Queue message for later sending
          await offlineService.queueAction('send_message', { roomId, message });
        }
      } catch (err: any) {
        // Queue for retry
        await offlineService.queueAction('send_message', { roomId, message });
        throw err;
      }
    },
    []
  );

  /**
   * Join chat room
   */
  const joinRoom = useCallback(async (roomId: string): Promise<void> => {
    try {
      await socketService.joinRoom(roomId);
    } catch (err: any) {
      throw err;
    }
  }, []);

  /**
   * Leave chat room
   */
  const leaveRoom = useCallback(async (roomId: string): Promise<void> => {
    try {
      await socketService.leaveRoom(roomId);
    } catch (err: any) {
      throw err;
    }
  }, []);

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback((roomId: string, isTyping: boolean): void => {
    socketService.sendTypingIndicator(roomId, isTyping);
  }, []);

  /**
   * Update presence status
   */
  const updatePresence = useCallback((status: 'online' | 'offline' | 'away'): void => {
    socketService.updatePresence(status);
  }, []);

  /**
   * Setup connection state listeners
   */
  useEffect(() => {
    const unsubscribeConnect = socketService.on('connect', () => {
      setIsConnected(true);
      setConnectionState('connected');
      setSocketId(socketService.getSocketId());
      setError(null);
    });

    const unsubscribeDisconnect = socketService.on('disconnect', () => {
      setIsConnected(false);
      setConnectionState('disconnected');
    });

    const unsubscribeError = socketService.on('connect_error', (err: Error) => {
      setError(err);
      setConnectionState('error');
      setIsConnected(false);
    });

    const unsubscribeReconnect = socketService.on('reconnect', () => {
      setIsConnected(true);
      setConnectionState('connected');
      setError(null);
    });

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      unsubscribeReconnect();
    };
  }, []);

  /**
   * Auto-connect when authenticated
   */
  useEffect(() => {
    if (autoConnect && isAuthenticated && !isInitialized.current) {
      isInitialized.current = true;
      connect();
    }

    if (!isAuthenticated && isInitialized.current) {
      isInitialized.current = false;
      disconnect();
    }
  }, [autoConnect, isAuthenticated, connect, disconnect]);

  /**
   * Reconnect when coming back online
   */
  useEffect(() => {
    const unsubscribe = offlineService.subscribe((online) => {
      if (online && isAuthenticated && !isConnected) {
        // Delay reconnection slightly to ensure network is stable
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, 1000);
      }
    });

    return () => {
      unsubscribe();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [isAuthenticated, isConnected, connect]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  return {
    isConnected,
    connectionState,
    socketId,
    error,
    connect,
    disconnect,
    emit,
    on,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendTyping,
    updatePresence,
  };
}

/**
 * Hook for managing chat messaging
 */
export function useChatMessages(roomId: string) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingPayload[]>([]);
  const { sendMessage, sendTyping, joinRoom, leaveRoom, on } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Send a message
   */
  const send = useCallback(
    async (message: string) => {
      await sendMessage(roomId, message);
      stopTyping();
    },
    [roomId, sendMessage]
  );

  /**
   * Start typing indicator
   */
  const startTyping = useCallback(() => {
    sendTyping(roomId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [roomId, sendTyping]);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback(() => {
    sendTyping(roomId, false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [roomId, sendTyping]);

  /**
   * Setup message and typing listeners
   */
  useEffect(() => {
    // Join room
    joinRoom(roomId).catch(() => {
      // Failed to join room
    });

    // Listen for messages
    const unsubscribeMessages = on('chat-message', (message: ChatMessagePayload) => {
      if (message.roomId === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Remove typing indicator for this user
        setTypingUsers((prev) => prev.filter((u) => u.userId !== message.userId));
      }
    });

    // Listen for typing indicators
    const unsubscribeTyping = on('typing', (data: TypingPayload) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.userId !== data.userId);
          if (data.isTyping) {
            return [...filtered, data];
          }
          return filtered;
        });
      }
    });

    // Cleanup
    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      leaveRoom(roomId).catch(() => {
        // Failed to leave room
      });
      stopTyping();
    };
  }, [roomId, on, joinRoom, leaveRoom, stopTyping]);

  return {
    messages,
    typingUsers,
    sendMessage: send,
    startTyping,
    stopTyping,
  };
}

/**
 * Hook for managing push notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { on } = useSocket();

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /**
   * Setup notification listeners
   */
  useEffect(() => {
    const unsubscribe = on('notification', (notification: NotificationPayload) => {
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }, [on]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };
}

/**
 * Hook for managing user presence
 */
export function usePresence(userId?: string) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const { on, updatePresence } = useSocket();

  useEffect(() => {
    if (!userId) return;

    const unsubscribeOnline = on('user-online', (data) => {
      if (data.userId === userId) {
        setIsOnline(true);
        setLastSeen(null);
      }
    });

    const unsubscribeOffline = on('user-offline', (data) => {
      if (data.userId === userId) {
        setIsOnline(false);
        setLastSeen(data.timestamp);
      }
    });

    const unsubscribePresence = on('presence-update', (data) => {
      if (data.userId === userId) {
        setIsOnline(data.status === 'online');
      }
    });

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
      unsubscribePresence();
    };
  }, [userId, on]);

  return {
    isOnline,
    lastSeen,
    updatePresence,
  };
}

export default useSocket;
