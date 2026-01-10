export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  bio?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Real-time & Socket.io Types
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  role: 'doctor' | 'patient';
  message: string;
  timestamp: string;
  delivered?: boolean;
  read?: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video';
  url: string;
  name: string;
  size: number;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  type: 'private' | 'group' | 'appointment';
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  role: 'doctor' | 'patient';
  isTyping: boolean;
  timestamp: string;
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  deviceInfo?: {
    platform: string;
    version: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'message' | 'reminder' | 'update' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface PushNotification {
  title: string;
  body: string;
  data?: any;
  badge?: number;
  sound?: string;
}

// Video Call Types
export interface VideoCallSession {
  id: string;
  roomId: string;
  appointmentId?: string;
  participants: CallParticipant[];
  status: 'waiting' | 'active' | 'ended';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
}

export interface CallParticipant {
  id: string;
  userId: string;
  userName: string;
  role: 'doctor' | 'patient';
  socketId: string;
  isMuted: boolean;
  isVideoOff: boolean;
  joinedAt: string;
}

export interface WebRTCSignal {
  from: string;
  to: string;
  signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
  type: 'offer' | 'answer' | 'ice-candidate';
}

// Offline Sync Types
export interface SyncAction {
  id: string;
  type: 'send_message' | 'create_appointment' | 'update_appointment' | 'cancel_appointment' | 'update_profile' | 'mark_message_read';
  payload: any;
  timestamp: string;
  retries: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt?: string;
  lastSyncResult?: {
    success: boolean;
    processed: number;
    failed: number;
  };
}

export interface OfflineCache<T> {
  data: T;
  timestamp: string;
  version: number;
  expiresAt?: string;
}

export interface StorageQuota {
  used: number;
  available: number;
  limit: number;
  percentUsed: number;
}

// Connection State Types
export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface ConnectionInfo {
  state: ConnectionState;
  socketId?: string;
  reconnectAttempts: number;
  lastConnectedAt?: string;
  error?: string;
}

// Re-export all healthcare types
export * from './healthcare';
