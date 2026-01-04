import { SESClient, SendEmailCommand, SendRawEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * AWS SES Email Library
 *
 * Provides AWS SES integration for email sending
 * REPLACES: SendGrid (@sendgrid/mail)
 * COMPLIANCE: HIPAA-compliant email delivery
 */

// AWS SES Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@theunifiedhealth.com';
const FROM_NAME = process.env.FROM_NAME || 'The Unified Health';
const CONFIGURATION_SET = process.env.SES_CONFIGURATION_SET || 'unified-health-prod-config';

// Initialize SES Client
const sesClient = new SESClient({
  region: AWS_REGION,
});

logger.info('AWS SES client initialized', { region: AWS_REGION });

/**
 * Email options interface (compatible with previous SendGrid interface)
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templatePath?: string;
  templateData?: Record<string, any>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
  tags?: Record<string, string>;
}

/**
 * Email response interface
 */
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Convert string or array to array of email addresses
 */
function normalizeEmailAddresses(addresses: string | string[] | undefined): string[] {
  if (!addresses) return [];
  return Array.isArray(addresses) ? addresses : [addresses];
}

/**
 * Load and render email template
 *
 * @param templatePath - Path to template file relative to templates/emails/
 * @param data - Data to inject into template
 * @returns Rendered HTML string
 */
export async function renderTemplate(
  templatePath: string,
  data: Record<string, any> = {}
): Promise<string> {
  try {
    const templatesDir = path.join(process.cwd(), 'src', 'templates', 'emails');
    const fullPath = path.join(templatesDir, templatePath);

    // Read template file
    let html = await fs.readFile(fullPath, 'utf-8');

    // Simple template rendering - replace {{variable}} with data values
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, String(data[key] ?? ''));
    });

    // Load base template if this is not the base template
    if (!templatePath.includes('base.html')) {
      const basePath = path.join(templatesDir, 'base.html');
      try {
        const baseHtml = await fs.readFile(basePath, 'utf-8');

        // Replace {{content}} in base with rendered template
        html = baseHtml.replace('{{content}}', html);

        // Apply data to the combined template
        Object.keys(data).forEach(key => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          html = html.replace(regex, String(data[key] ?? ''));
        });
      } catch {
        // Base template not found, use template as-is
      }
    }

    return html;
  } catch (error) {
    logger.error('Failed to render email template', {
      error: error instanceof Error ? error.message : 'Unknown error',
      templatePath,
    });
    throw error;
  }
}

/**
 * Send email using AWS SES
 *
 * @param options - Email options
 * @returns EmailResponse with success status
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    // If template path is provided, render it
    let html = options.html;
    if (options.templatePath && options.templateData) {
      html = await renderTemplate(options.templatePath, options.templateData);
    }

    // Validate required fields
    if (!options.to || !options.subject) {
      throw new Error('Missing required fields: to, subject');
    }

    if (!html && !options.text) {
      throw new Error('Either html or text content must be provided');
    }

    // Normalize email addresses
    const toAddresses = normalizeEmailAddresses(options.to);
    const ccAddresses = normalizeEmailAddresses(options.cc);
    const bccAddresses = normalizeEmailAddresses(options.bcc);

    // Build SES send email command
    const command = new SendEmailCommand({
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: toAddresses,
        CcAddresses: ccAddresses.length > 0 ? ccAddresses : undefined,
        BccAddresses: bccAddresses.length > 0 ? bccAddresses : undefined,
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          ...(html && {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          }),
          ...(options.text && {
            Text: {
              Data: options.text,
              Charset: 'UTF-8',
            },
          }),
        },
      },
      ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
      ConfigurationSetName: CONFIGURATION_SET,
      Tags: options.tags
        ? Object.entries(options.tags).map(([Name, Value]) => ({ Name, Value }))
        : [
            { Name: 'Environment', Value: process.env.NODE_ENV || 'development' },
            { Name: 'Application', Value: 'unified-health-api' },
          ],
    });

    // Send email
    const response = await sesClient.send(command);

    logger.info('Email sent successfully via AWS SES', {
      to: toAddresses,
      subject: options.subject,
      messageId: response.MessageId,
    });

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    logger.error('Failed to send email via AWS SES', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: options.to,
      subject: options.subject,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send raw email with attachments using AWS SES
 *
 * @param options - Email options including attachments
 * @returns EmailResponse with success status
 */
export async function sendRawEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    // If template path is provided, render it
    let html = options.html;
    if (options.templatePath && options.templateData) {
      html = await renderTemplate(options.templatePath, options.templateData);
    }

    // Validate required fields
    if (!options.to || !options.subject) {
      throw new Error('Missing required fields: to, subject');
    }

    const toAddresses = normalizeEmailAddresses(options.to);
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Build raw email message
    let rawMessage = '';
    rawMessage += `From: ${FROM_NAME} <${FROM_EMAIL}>\r\n`;
    rawMessage += `To: ${toAddresses.join(', ')}\r\n`;
    if (options.cc) {
      rawMessage += `Cc: ${normalizeEmailAddresses(options.cc).join(', ')}\r\n`;
    }
    rawMessage += `Subject: ${options.subject}\r\n`;
    rawMessage += `MIME-Version: 1.0\r\n`;
    rawMessage += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // Add body
    if (html) {
      rawMessage += `--${boundary}\r\n`;
      rawMessage += `Content-Type: text/html; charset=UTF-8\r\n`;
      rawMessage += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
      rawMessage += `${html}\r\n`;
    } else if (options.text) {
      rawMessage += `--${boundary}\r\n`;
      rawMessage += `Content-Type: text/plain; charset=UTF-8\r\n`;
      rawMessage += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
      rawMessage += `${options.text}\r\n`;
    }

    // Add attachments
    if (options.attachments && options.attachments.length > 0) {
      for (const attachment of options.attachments) {
        rawMessage += `--${boundary}\r\n`;
        rawMessage += `Content-Type: ${attachment.type || 'application/octet-stream'}; name="${attachment.filename}"\r\n`;
        rawMessage += `Content-Disposition: ${attachment.disposition || 'attachment'}; filename="${attachment.filename}"\r\n`;
        rawMessage += `Content-Transfer-Encoding: base64\r\n\r\n`;
        rawMessage += `${attachment.content}\r\n`;
      }
    }

    rawMessage += `--${boundary}--`;

    // Send raw email
    const command = new SendRawEmailCommand({
      RawMessage: {
        Data: Buffer.from(rawMessage),
      },
      ConfigurationSetName: CONFIGURATION_SET,
    });

    const response = await sesClient.send(command);

    logger.info('Raw email sent successfully via AWS SES', {
      to: toAddresses,
      subject: options.subject,
      messageId: response.MessageId,
      hasAttachments: (options.attachments?.length || 0) > 0,
    });

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    logger.error('Failed to send raw email via AWS SES', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: options.to,
      subject: options.subject,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send batch emails
 *
 * @param recipients - Array of email addresses
 * @param subject - Email subject
 * @param options - Email options (html, text, or template)
 * @returns Array of EmailResponse
 */
export async function sendBatchEmail(
  recipients: string[],
  subject: string,
  options: {
    html?: string;
    text?: string;
    templatePath?: string;
    templateData?: Record<string, any>;
  }
): Promise<EmailResponse[]> {
  logger.info('Sending batch emails via AWS SES', {
    recipientCount: recipients.length,
    subject,
  });

  // SES has a limit of 50 recipients per API call
  const batchSize = 50;
  const results: EmailResponse[] = [];

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const batchPromises = batch.map(to =>
      sendEmail({
        to,
        subject,
        ...options,
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Validate email address
 *
 * @param email - Email address to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send transactional email types (convenience functions)
 */
export const transactional = {
  /**
   * Send welcome email to new user
   */
  async sendWelcome(to: string, userData: { name: string; verificationLink?: string }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Welcome to The Unified Health',
      templatePath: 'welcome.html',
      templateData: {
        name: userData.name,
        verificationLink: userData.verificationLink,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'welcome' },
    });
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(to: string, data: { name: string; resetLink: string; expiresIn: string }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Reset Your Password - The Unified Health',
      templatePath: 'password-reset.html',
      templateData: {
        name: data.name,
        resetLink: data.resetLink,
        expiresIn: data.expiresIn,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'password-reset' },
    });
  },

  /**
   * Send email verification
   */
  async sendVerification(to: string, data: { name: string; verificationLink: string }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Verify Your Email - The Unified Health',
      templatePath: 'verification.html',
      templateData: {
        name: data.name,
        verificationLink: data.verificationLink,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'verification' },
    });
  },

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(to: string, data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    appointmentType: string;
  }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Appointment Confirmed - The Unified Health',
      templatePath: 'appointment-confirmation.html',
      templateData: {
        ...data,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'appointment-confirmation' },
    });
  },

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(to: string, data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
  }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Appointment Reminder - The Unified Health',
      templatePath: 'appointment-reminder.html',
      templateData: {
        ...data,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'appointment-reminder' },
    });
  },

  /**
   * Send payment receipt
   */
  async sendPaymentReceipt(to: string, data: {
    patientName: string;
    amount: string;
    paymentDate: string;
    invoiceNumber: string;
    description: string;
  }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Payment Receipt - The Unified Health',
      templatePath: 'payment-receipt.html',
      templateData: {
        ...data,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'payment-receipt' },
    });
  },

  /**
   * Send security alert
   */
  async sendSecurityAlert(to: string, data: {
    name: string;
    alertType: string;
    ipAddress: string;
    location: string;
    timestamp: string;
  }): Promise<EmailResponse> {
    return sendEmail({
      to,
      subject: 'Security Alert - The Unified Health',
      templatePath: 'security-alert.html',
      templateData: {
        ...data,
        year: new Date().getFullYear(),
      },
      tags: { EmailType: 'security-alert' },
    });
  },
};

export default {
  sendEmail,
  sendRawEmail,
  sendBatchEmail,
  renderTemplate,
  isValidEmail,
  transactional,
};
