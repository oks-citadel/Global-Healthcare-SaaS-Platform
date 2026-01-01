import { io, Socket } from 'socket.io-client';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { tokenStorage } from '../api/client';
import { AuthTokens } from '../types';

const API_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.unifiedhealth.com';

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface SocketEvents {
  // Connection events
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'connect_error': (error: Error) => void;
  'reconnect': (attemptNumber: number) => void;
  'reconnect_attempt': (attemptNumber: number) => void;
  'reconnect_error': (error: Error) => void;
  'reconnect_failed': () => void;

  // Chat events
  'chat-message': (data: ChatMessagePayload) => void;
  'typing': (data: TypingPayload) => void;
  'message-delivered': (data: { messageId: string; timestamp: string }) => void;
  'message-read': (data: { messageId: string; timestamp: string }) => void;

  // Presence events
  'user-online': (data: { userId: string; timestamp: string }) => void;
  'user-offline': (data: { userId: string; timestamp: string }) => void;
  'presence-update': (data: { userId: string; status: 'online' | 'offline' | 'away' }) => void;

  // Notification events
  'notification': (data: NotificationPayload) => void;
  'push-notification': (data: PushNotificationPayload) => void;

  // Video call signaling events
  'webrtc-offer': (data: { from: string; signal: RTCSessionDescriptionInit }) => void;
  'webrtc-answer': (data: { from: string; signal: RTCSessionDescriptionInit }) => void;
  'ice-candidate': (data: { from: string; signal: RTCIceCandidateInit }) => void;
  'peer-joined': (data: { peer: PeerInfo }) => void;
  'peer-left': (data: { peerId: string }) => void;
  'call-ended': (data: { roomId: string; reason: string }) => void;
}

export interface ChatMessagePayload {
  id: string;
  roomId: string;
  userId: string;
  role: 'doctor' | 'patient';
  message: string;
  timestamp: string;
  delivered?: boolean;
  read?: boolean;
}

export interface TypingPayload {
  roomId: string;
  userId: string;
  role: 'doctor' | 'patient';
  isTyping: boolean;
}

export interface NotificationPayload {
  id: string;
  type: 'appointment' | 'message' | 'reminder' | 'update';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: any;
}

export interface PeerInfo {
  id: string;
  userId: string;
  socketId: string;
  role: 'doctor' | 'patient';
}

export type SocketEventCallback<T extends keyof SocketEvents> = SocketEvents[T];

class SocketService {
  private socket: Socket | null = null;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private connectionState: ConnectionState = 'disconnected';
  private listeners: Map<string, Set<Function>> = new Map();
  private appState: AppStateStatus = 'active';
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * Initialize socket connection with JWT authentication
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.socket?.connected) {
      return;
    }

    try {
      const tokens = await tokenStorage.getTokens();

      if (!tokens?.accessToken) {
        throw new Error('No authentication token available');
      }

      await this.connect(tokens);
      this.isInitialized = true;
    } catch (error) {
      this.setConnectionState('error');
      throw error;
    }
  }

  /**
   * Connect to Socket.io server with authentication
   */
  private async connect(tokens: AuthTokens): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    this.setConnectionState('connecting');

    this.socket = io(API_URL, {
      auth: {
        token: tokens.accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: false,
      query: {
        platform: Platform.OS,
        version: Platform.Version.toString(),
      },
    });

    this.setupEventHandlers();
  }

  /**
   * Setup socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      this.setConnectionState('connected');
      this.startKeepAlive();
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason: string) => {
      this.setConnectionState('disconnected');
      this.stopKeepAlive();
      this.emit('disconnect', reason);

      // Auto-reconnect on certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      this.setConnectionState('error');
      this.emit('connect_error', error);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      this.setConnectionState('connected');
      this.emit('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      this.emit('reconnect_attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      this.emit('reconnect_error', error);
    });

    this.socket.on('reconnect_failed', () => {
      this.setConnectionState('error');
      this.emit('reconnect_failed');
    });

    // Authentication error handling
    this.socket.on('unauthorized', async (_error: any) => {
      await this.refreshTokenAndReconnect();
    });
  }

  /**
   * Refresh authentication token and reconnect
   */
  private async refreshTokenAndReconnect(): Promise<void> {
    try {
      const tokens = await tokenStorage.getTokens();
      if (!tokens?.accessToken) {
        throw new Error('No tokens available');
      }

      // Update auth token
      if (this.socket) {
        this.socket.auth = { token: tokens.accessToken };
        this.socket.disconnect();
        this.socket.connect();
      }
    } catch (error) {
      this.disconnect();
    }
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.stopKeepAlive();
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isInitialized = false;
      this.setConnectionState('disconnected');
    }
  }

  /**
   * Emit event to server
   */
  emit<T = any>(event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Socket emit timeout'));
      }, 10000);

      this.socket.emit(event, data, (response: any) => {
        clearTimeout(timeout);
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Listen to socket events
   */
  on<T extends keyof SocketEvents>(
    event: T,
    callback: SocketEventCallback<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());

      // Setup socket listener
      (this.socket as any)?.on(event, (...args: any[]) => {
        const callbacks = this.listeners.get(event);
        callbacks?.forEach((cb) => (cb as Function)(...args));
      });
    }

    this.listeners.get(event)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
      if (this.listeners.get(event)?.size === 0) {
        this.socket?.off(event);
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Listen to event once
   */
  once<T extends keyof SocketEvents>(
    event: T,
    callback: SocketEventCallback<T>
  ): void {
    const unsubscribe = this.on(event, ((...args: any[]) => {
      unsubscribe();
      (callback as Function)(...args);
    }) as SocketEventCallback<T>);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: Function): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  /**
   * Send chat message
   */
  async sendChatMessage(data: {
    roomId: string;
    message: string;
    timestamp?: string;
  }): Promise<ChatMessagePayload> {
    return this.emit('chat-message', {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    });
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(roomId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { roomId, isTyping });
    }
  }

  /**
   * Mark message as delivered
   */
  markMessageDelivered(messageId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message-delivered', {
        messageId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Mark message as read
   */
  markMessageRead(messageId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message-read', {
        messageId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Join chat room
   */
  async joinRoom(roomId: string): Promise<void> {
    return this.emit('join-room', { roomId });
  }

  /**
   * Leave chat room
   */
  async leaveRoom(roomId: string): Promise<void> {
    return this.emit('leave-room', { roomId });
  }

  /**
   * Update presence status
   */
  updatePresence(status: 'online' | 'offline' | 'away'): void {
    if (this.socket?.connected) {
      this.socket.emit('presence-update', { status });
    }
  }

  /**
   * Handle app state changes for background/foreground
   */
  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const previousState = this.appState;
    this.appState = nextAppState;

    if (previousState === 'background' && nextAppState === 'active') {
      // App came to foreground
      if (!this.socket?.connected) {
        await this.initialize();
      }
      this.updatePresence('online');
    } else if (previousState === 'active' && nextAppState === 'background') {
      // App went to background
      this.updatePresence('away');

      // On Android, keep connection alive
      // On iOS, connection will be terminated by OS
      if (Platform.OS === 'ios') {
        this.stopKeepAlive();
      }
    }
  };

  /**
   * Start keep-alive mechanism
   */
  private startKeepAlive(): void {
    if (this.keepAliveInterval) return;

    this.keepAliveInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop keep-alive mechanism
   */
  private stopKeepAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Set connection state and notify listeners
   */
  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
    // Note: AppState.removeEventListener is deprecated, use subscription pattern instead
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
