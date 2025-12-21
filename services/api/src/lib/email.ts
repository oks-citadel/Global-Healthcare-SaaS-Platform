import sgMail from '@sendgrid/mail';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Email Library
 *
 * Provides SendGrid integration and email template rendering
 */

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@unifiedhealth.com';
const FROM_NAME = process.env.FROM_NAME || 'UnifiedHealth';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  logger.info('SendGrid client initialized');
} else {
  logger.warn('SendGrid API key not configured. Email sending will be in stub mode.');
}

/**
 * Email options interface
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
      const baseHtml = await fs.readFile(basePath, 'utf-8');

      // Replace {{content}} in base with rendered template
      html = baseHtml.replace('{{content}}', html);

      // Apply data to the combined template
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        html = html.replace(regex, String(data[key] ?? ''));
      });
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
 * Send email using SendGrid
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

    // If SendGrid is not configured, log and return stub response
    if (!SENDGRID_API_KEY) {
      logger.info('Email stub - SendGrid not configured', {
        to: options.to,
        subject: options.subject,
        templatePath: options.templatePath,
      });

      return {
        success: true,
        messageId: `stub-${Date.now()}`,
      };
    }

    // Prepare email message
    const message: any = {
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: options.subject,
      html: html,
      text: options.text,
    };

    // Add optional fields
    if (options.cc) {
      message.cc = options.cc;
    }
    if (options.bcc) {
      message.bcc = options.bcc;
    }
    if (options.replyTo) {
      message.replyTo = options.replyTo;
    }
    if (options.attachments) {
      message.attachments = options.attachments;
    }

    // Send email
    const response = await sgMail.send(message);

    logger.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      statusCode: response[0].statusCode,
    });

    return {
      success: true,
      messageId: response[0].headers['x-message-id'] as string,
    };
  } catch (error) {
    logger.error('Failed to send email', {
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
  logger.info('Sending batch emails', {
    recipientCount: recipients.length,
    subject,
  });

  const promises = recipients.map(to =>
    sendEmail({
      to,
      subject,
      ...options,
    })
  );

  return Promise.all(promises);
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

export default {
  sendEmail,
  sendBatchEmail,
  renderTemplate,
  isValidEmail,
};
