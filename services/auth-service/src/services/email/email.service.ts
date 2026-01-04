/**
 * Email Service
 * High-level email service that provides authentication-related email methods
 * Supports AWS SES with fallback to logging for development
 */

import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { SESEmailService, createSESEmailService } from './ses.service.js';
import { emailTemplates } from './templates.js';
import {
  EmailResult,
  EmailTemplateData,
  SecurityAlertType,
  EmailType,
} from './types.js';

/**
 * Email Service Class
 * Provides high-level methods for sending authentication-related emails
 */
export class EmailService {
  private sesService: SESEmailService | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = config.email.enabled;

    if (this.enabled && config.email.provider === 'ses') {
      this.initializeSES();
    } else if (!this.enabled) {
      logger.info('Email service disabled - emails will be logged only');
    }
  }

  /**
   * Initialize AWS SES service
   */
  private initializeSES(): void {
    try {
      this.sesService = createSESEmailService({
        region: config.email.sesRegion,
        fromAddress: config.email.fromAddress,
        fromName: config.email.fromName,
        sandboxMode: config.email.sesSandboxMode,
        maxRetries: config.email.sesMaxRetries,
        retryDelay: config.email.sesRetryDelay,
        rateLimitPerSecond: config.email.sesRateLimitPerSecond,
        configurationSetName: config.email.sesConfigurationSet,
      });
      logger.info('Email service initialized with AWS SES');
    } catch (error) {
      logger.error('Failed to initialize SES email service', { error });
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    token: string,
    firstName?: string
  ): Promise<EmailResult> {
    const resetUrl = `${config.email.appUrl}/auth/reset-password?token=${token}`;

    const templateData: EmailTemplateData = {
      firstName,
      email,
      token,
      resetUrl,
      expiryHours: config.security.passwordResetExpiry,
      supportEmail: config.email.supportEmail,
    };

    const { html, text } = emailTemplates.passwordReset(templateData);

    return this.send({
      to: email,
      subject: 'Reset Your Password - The Unified Health',
      html,
      text,
      tags: [
        { name: 'email_type', value: 'password_reset' },
        { name: 'service', value: 'auth-service' },
      ],
    }, 'password_reset');
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(
    email: string,
    token: string,
    firstName?: string
  ): Promise<EmailResult> {
    const verifyUrl = `${config.email.appUrl}/auth/verify-email?token=${token}`;

    const templateData: EmailTemplateData = {
      firstName,
      email,
      token,
      verifyUrl,
      expiryHours: config.security.emailVerificationExpiry,
      supportEmail: config.email.supportEmail,
    };

    const { html, text } = emailTemplates.emailVerification(templateData);

    return this.send({
      to: email,
      subject: 'Verify Your Email - The Unified Health',
      html,
      text,
      tags: [
        { name: 'email_type', value: 'email_verification' },
        { name: 'service', value: 'auth-service' },
      ],
    }, 'email_verification');
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    email: string,
    firstName?: string
  ): Promise<EmailResult> {
    const templateData: EmailTemplateData = {
      firstName,
      email,
      dashboardUrl: `${config.email.appUrl}/dashboard`,
      supportEmail: config.email.supportEmail,
    };

    const { html, text } = emailTemplates.welcome(templateData);

    return this.send({
      to: email,
      subject: 'Welcome to The Unified Health!',
      html,
      text,
      tags: [
        { name: 'email_type', value: 'welcome' },
        { name: 'service', value: 'auth-service' },
      ],
    }, 'welcome');
  }

  /**
   * Send security alert email
   */
  async sendSecurityAlertEmail(
    email: string,
    alertType: SecurityAlertType,
    data: {
      firstName?: string;
      ipAddress?: string;
      userAgent?: string;
      location?: string;
      timestamp?: string;
    }
  ): Promise<EmailResult> {
    const templateData: EmailTemplateData = {
      ...data,
      email,
      alertType,
      loginUrl: `${config.email.appUrl}/auth/login`,
      supportEmail: config.email.supportEmail,
    };

    const { html, text } = emailTemplates.securityAlert(templateData);

    const subjectMap: Record<SecurityAlertType, string> = {
      new_login: 'New Sign-In Detected - The Unified Health',
      password_changed: 'Your Password Was Changed - The Unified Health',
      mfa_enabled: 'Two-Factor Authentication Enabled - The Unified Health',
      mfa_disabled: 'Two-Factor Authentication Disabled - The Unified Health',
      account_locked: 'Account Temporarily Locked - The Unified Health',
      suspicious_activity: 'Suspicious Activity Detected - The Unified Health',
      new_device: 'New Device Sign-In - The Unified Health',
    };

    return this.send({
      to: email,
      subject: subjectMap[alertType],
      html,
      text,
      tags: [
        { name: 'email_type', value: 'security_alert' },
        { name: 'alert_type', value: alertType },
        { name: 'service', value: 'auth-service' },
      ],
    }, 'security_alert');
  }

  /**
   * Send MFA enabled notification
   */
  async sendMfaEnabledEmail(
    email: string,
    firstName?: string,
    ipAddress?: string
  ): Promise<EmailResult> {
    return this.sendSecurityAlertEmail(email, 'mfa_enabled', {
      firstName,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send MFA disabled notification
   */
  async sendMfaDisabledEmail(
    email: string,
    firstName?: string,
    ipAddress?: string
  ): Promise<EmailResult> {
    return this.sendSecurityAlertEmail(email, 'mfa_disabled', {
      firstName,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send account locked notification
   */
  async sendAccountLockedEmail(
    email: string,
    firstName?: string,
    ipAddress?: string
  ): Promise<EmailResult> {
    return this.sendSecurityAlertEmail(email, 'account_locked', {
      firstName,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send new login notification
   */
  async sendLoginNotificationEmail(
    email: string,
    data: {
      firstName?: string;
      ipAddress?: string;
      userAgent?: string;
      location?: string;
    }
  ): Promise<EmailResult> {
    return this.sendSecurityAlertEmail(email, 'new_login', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Core send method
   */
  private async send(
    options: {
      to: string | string[];
      subject: string;
      html: string;
      text?: string;
      tags?: Array<{ name: string; value: string }>;
    },
    emailType?: EmailType
  ): Promise<EmailResult> {
    // Log email in development or when disabled
    if (!this.enabled) {
      logger.info('Email would be sent (disabled)', {
        to: options.to,
        subject: options.subject,
        type: emailType,
        preview: options.html.substring(0, 200),
      });
      return { success: true, messageId: `dev-${Date.now()}` };
    }

    // Send via SES if available
    if (this.sesService) {
      return this.sesService.send(options, emailType);
    }

    // Fallback: log email
    logger.info('Email logged (no provider configured)', {
      to: options.to,
      subject: options.subject,
      type: emailType,
    });
    return { success: true, messageId: `logged-${Date.now()}` };
  }

  /**
   * Get email service statistics
   */
  getStats() {
    if (this.sesService) {
      return this.sesService.getStats();
    }
    return null;
  }

  /**
   * Get SES quota information
   */
  async getQuota() {
    if (this.sesService) {
      return this.sesService.getQuota();
    }
    return null;
  }
}

// Export singleton instance
export const emailService = new EmailService();
