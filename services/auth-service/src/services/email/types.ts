/**
 * Email Service Types
 * Comprehensive type definitions for AWS SES email integration
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  tags?: EmailTag[];
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryable?: boolean;
}

export interface SESConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  fromAddress: string;
  fromName: string;
  configurationSetName?: string;
  sandboxMode: boolean;
  maxRetries: number;
  retryDelay: number;
  rateLimitPerSecond: number;
}

export interface EmailTemplateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  token?: string;
  resetUrl?: string;
  verifyUrl?: string;
  dashboardUrl?: string;
  loginUrl?: string;
  supportEmail?: string;
  expiryHours?: number;
  expiryMinutes?: number;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  timestamp?: string;
  alertType?: SecurityAlertType;
  alertMessage?: string;
}

export type SecurityAlertType =
  | 'new_login'
  | 'password_changed'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'account_locked'
  | 'suspicious_activity'
  | 'new_device';

export interface RateLimitState {
  count: number;
  windowStart: number;
  lastReset: number;
}

export type EmailType =
  | 'password_reset'
  | 'email_verification'
  | 'welcome'
  | 'security_alert'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'account_locked'
  | 'login_notification';

export interface EmailQueueItem {
  id: string;
  type: EmailType;
  options: EmailOptions;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Date;
  scheduledFor: Date;
  createdAt: Date;
}

export interface EmailServiceStats {
  totalSent: number;
  totalFailed: number;
  totalRetried: number;
  byType: Record<EmailType, { sent: number; failed: number }>;
  lastHourSent: number;
  rateLimitRemaining: number;
}
