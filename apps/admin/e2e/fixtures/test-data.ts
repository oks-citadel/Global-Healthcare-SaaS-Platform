/**
 * Test Data Fixtures for Admin Dashboard E2E Testing
 *
 * Centralized test data including admin credentials,
 * user information, and system settings.
 */

export interface TestAdmin {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin" | "moderator";
  permissions?: string[];
}

export interface TestUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "doctor" | "nurse" | "admin" | "staff";
  status: "active" | "suspended" | "pending" | "inactive";
  createdAt?: string;
  lastLogin?: string;
}

export interface TestAuditLog {
  id?: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "critical";
}

export interface TestSystemSetting {
  key: string;
  value: string | number | boolean;
  category:
    | "general"
    | "security"
    | "notifications"
    | "integrations"
    | "appearance";
  description: string;
}

// Test Admins
export const testAdmins: Record<string, TestAdmin> = {
  superAdmin: {
    email: "superadmin@unified-health.test",
    password: "Test@SuperAdmin1234",
    firstName: "Super",
    lastName: "Admin",
    role: "super_admin",
    permissions: ["all"],
  },
  admin1: {
    email: "admin1@unified-health.test",
    password: "Test@Admin1234",
    firstName: "John",
    lastName: "Administrator",
    role: "admin",
    permissions: ["users:read", "users:write", "settings:read", "audit:read"],
  },
  moderator1: {
    email: "moderator1@unified-health.test",
    password: "Test@Moderator1234",
    firstName: "Jane",
    lastName: "Moderator",
    role: "moderator",
    permissions: ["users:read", "audit:read"],
  },
};

// Test Users (managed by admin)
export const testUsers: Record<string, TestUser> = {
  activePatient: {
    id: "usr-001",
    email: "active.patient@test.com",
    firstName: "Active",
    lastName: "Patient",
    role: "patient",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    lastLogin: "2024-12-01T14:30:00Z",
  },
  activeDoctor: {
    id: "usr-002",
    email: "active.doctor@unified-health.test",
    firstName: "Active",
    lastName: "Doctor",
    role: "doctor",
    status: "active",
    createdAt: "2024-02-20T09:00:00Z",
    lastLogin: "2024-12-01T08:00:00Z",
  },
  suspendedUser: {
    id: "usr-003",
    email: "suspended.user@test.com",
    firstName: "Suspended",
    lastName: "User",
    role: "patient",
    status: "suspended",
    createdAt: "2024-03-10T11:00:00Z",
    lastLogin: "2024-06-15T16:00:00Z",
  },
  pendingUser: {
    id: "usr-004",
    email: "pending.user@test.com",
    firstName: "Pending",
    lastName: "User",
    role: "staff",
    status: "pending",
    createdAt: "2024-11-28T14:00:00Z",
  },
  inactiveUser: {
    id: "usr-005",
    email: "inactive.user@test.com",
    firstName: "Inactive",
    lastName: "User",
    role: "nurse",
    status: "inactive",
    createdAt: "2023-06-01T08:00:00Z",
    lastLogin: "2023-12-01T10:00:00Z",
  },
};

// Test Audit Logs
export const testAuditLogs: Record<string, TestAuditLog> = {
  loginSuccess: {
    id: "log-001",
    userId: "usr-002",
    action: "LOGIN",
    resource: "auth",
    details: "Successful login from Chrome browser",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: "info",
  },
  loginFailed: {
    id: "log-002",
    userId: "usr-003",
    action: "LOGIN_FAILED",
    resource: "auth",
    details: "Failed login attempt - invalid password",
    ipAddress: "10.0.0.50",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: "warning",
  },
  userCreated: {
    id: "log-003",
    userId: "admin1",
    action: "CREATE",
    resource: "users",
    details: "Created new user: pending.user@test.com",
    ipAddress: "192.168.1.1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    severity: "info",
  },
  userSuspended: {
    id: "log-004",
    userId: "superAdmin",
    action: "SUSPEND",
    resource: "users",
    details:
      "Suspended user: suspended.user@test.com - Reason: Policy violation",
    ipAddress: "192.168.1.1",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    severity: "warning",
  },
  securityAlert: {
    id: "log-005",
    userId: "system",
    action: "SECURITY_ALERT",
    resource: "security",
    details: "Multiple failed login attempts detected from IP 10.0.0.50",
    ipAddress: "10.0.0.50",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: "critical",
  },
  settingsChanged: {
    id: "log-006",
    userId: "superAdmin",
    action: "UPDATE",
    resource: "settings",
    details:
      "Updated security settings: session_timeout changed from 30 to 60 minutes",
    ipAddress: "192.168.1.1",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    severity: "info",
  },
};

// Test System Settings
export const testSystemSettings: Record<string, TestSystemSetting> = {
  sessionTimeout: {
    key: "session_timeout",
    value: 60,
    category: "security",
    description: "Session timeout in minutes",
  },
  maxLoginAttempts: {
    key: "max_login_attempts",
    value: 5,
    category: "security",
    description: "Maximum failed login attempts before account lockout",
  },
  emailNotifications: {
    key: "email_notifications",
    value: true,
    category: "notifications",
    description: "Enable email notifications",
  },
  maintenanceMode: {
    key: "maintenance_mode",
    value: false,
    category: "general",
    description: "Enable maintenance mode",
  },
  twoFactorAuth: {
    key: "require_2fa",
    value: true,
    category: "security",
    description: "Require two-factor authentication for all admin users",
  },
  dataRetentionDays: {
    key: "data_retention_days",
    value: 365,
    category: "general",
    description: "Number of days to retain audit logs",
  },
  systemName: {
    key: "system_name",
    value: "Unified Health Platform",
    category: "appearance",
    description: "System display name",
  },
};

// Invalid credentials for negative testing
export const invalidCredentials = {
  invalidEmail: {
    email: "invalid@test.com",
    password: "Test@1234",
  },
  invalidPassword: {
    email: "admin1@unified-health.test",
    password: "WrongPassword",
  },
  emptyCredentials: {
    email: "",
    password: "",
  },
  malformedEmail: {
    email: "not-an-email",
    password: "Test@1234",
  },
  expiredAccount: {
    email: "expired@unified-health.test",
    password: "Test@1234",
  },
  lockedAccount: {
    email: "locked@unified-health.test",
    password: "Test@1234",
  },
};

// Helper function to generate random user data
export function generateRandomUser(): TestUser {
  const timestamp = Date.now();
  const roles: TestUser["role"][] = ["patient", "doctor", "nurse", "staff"];
  const randomRole = roles[Math.floor(Math.random() * roles.length)];

  return {
    email: `testuser${timestamp}@test.com`,
    firstName: `Test${timestamp}`,
    lastName: `User${timestamp}`,
    role: randomRole,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

// Helper function to generate random audit log
export function generateRandomAuditLog(userId: string): TestAuditLog {
  const actions = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW"];
  const resources = [
    "users",
    "settings",
    "reports",
    "appointments",
    "prescriptions",
  ];
  const severities: TestAuditLog["severity"][] = [
    "info",
    "warning",
    "error",
    "critical",
  ];

  return {
    userId,
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: resources[Math.floor(Math.random() * resources.length)],
    details: "Auto-generated test log entry",
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
  };
}

// API endpoints for testing
export const apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    profile: "/api/auth/profile",
    changePassword: "/api/auth/change-password",
  },
  users: {
    list: "/api/users",
    detail: (id: string) => `/api/users/${id}`,
    create: "/api/users",
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
    suspend: (id: string) => `/api/users/${id}/suspend`,
    activate: (id: string) => `/api/users/${id}/activate`,
    resetPassword: (id: string) => `/api/users/${id}/reset-password`,
  },
  settings: {
    list: "/api/settings",
    get: (key: string) => `/api/settings/${key}`,
    update: (key: string) => `/api/settings/${key}`,
    bulkUpdate: "/api/settings/bulk",
  },
  auditLogs: {
    list: "/api/audit-logs",
    detail: (id: string) => `/api/audit-logs/${id}`,
    export: "/api/audit-logs/export",
    filter: "/api/audit-logs/filter",
  },
  dashboard: {
    stats: "/api/dashboard/stats",
    recentActivity: "/api/dashboard/recent-activity",
    systemHealth: "/api/dashboard/system-health",
  },
};

// Storage keys
export const storageKeys = {
  accessToken: "admin_access_token",
  refreshToken: "admin_refresh_token",
  user: "admin_user",
  preferences: "admin_preferences",
};

// Roles and permissions
export const roles = {
  super_admin: {
    name: "Super Admin",
    permissions: ["all"],
    description: "Full access to all system features",
  },
  admin: {
    name: "Administrator",
    permissions: [
      "users:read",
      "users:write",
      "settings:read",
      "settings:write",
      "audit:read",
    ],
    description: "Can manage users and view audit logs",
  },
  moderator: {
    name: "Moderator",
    permissions: ["users:read", "audit:read"],
    description: "Can view users and audit logs",
  },
};
