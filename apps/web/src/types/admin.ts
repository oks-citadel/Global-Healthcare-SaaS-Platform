import { User } from './auth';

// Extended User type for admin management
export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLogin?: string;
  metadata?: {
    loginCount: number;
    failedLoginAttempts: number;
  };
}

// System statistics
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalPatients: number;
  totalProviders: number;
  totalAdmins: number;
  totalAppointments: number;
  activeSubscriptions: number;
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
}

// System health metrics
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  services: {
    api: 'online' | 'offline';
    auth: 'online' | 'offline';
    storage: 'online' | 'offline';
    email: 'online' | 'offline';
  };
  lastChecked: string;
}

// Audit log types
export interface AuditEvent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  timestamp: string;
}

export type AuditAction =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.login'
  | 'user.logout'
  | 'user.password_reset'
  | 'role.changed'
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.cancelled'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'settings.updated'
  | 'data.exported'
  | 'admin.action';

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export interface SubscriptionStats {
  total: number;
  active: number;
  cancelled: number;
  trial: number;
  byPlan: {
    free: number;
    basic: number;
    premium: number;
    enterprise: number;
  };
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
}

// System settings
export interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  features: {
    registrationEnabled: boolean;
    appointmentBookingEnabled: boolean;
    videoCallsEnabled: boolean;
    chatEnabled: boolean;
    notificationsEnabled: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    accountLockoutDuration: number; // minutes
  };
  email: {
    fromName: string;
    fromEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
  };
  notifications: {
    appointmentReminders: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter types for user management
export interface UserFilters {
  role?: 'patient' | 'doctor' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
  emailVerified?: boolean;
}

// Filter types for audit logs
export interface AuditFilters {
  action?: AuditAction;
  userId?: string;
  resource?: string;
  status?: 'success' | 'failure';
  startDate?: string;
  endDate?: string;
  search?: string;
}

// API request/response types
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'patient' | 'doctor' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdateSettingsRequest {
  general?: Partial<SystemSettings['general']>;
  features?: Partial<SystemSettings['features']>;
  security?: Partial<SystemSettings['security']>;
  email?: Partial<SystemSettings['email']>;
  notifications?: Partial<SystemSettings['notifications']>;
}
