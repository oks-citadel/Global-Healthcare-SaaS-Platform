import { config } from "../config/index.js";
import { logger } from "./logger.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email service that supports SendGrid and AWS SES
 * Falls back to logging in development/when disabled
 */
class EmailService {
  private sendgrid: any = null;
  private ses: any = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (!config.email.enabled) {
      logger.info("Email service disabled - emails will be logged only");
      return;
    }

    try {
      if (config.email.provider === "sendgrid" && config.email.sendgridApiKey) {
        const sgMail = await import("@sendgrid/mail");
        sgMail.default.setApiKey(config.email.sendgridApiKey);
        this.sendgrid = sgMail.default;
        logger.info("Email service initialized with SendGrid");
      } else if (config.email.provider === "ses") {
        const { SESClient, SendEmailCommand } = await import("@aws-sdk/client-ses");
        this.ses = { SESClient, SendEmailCommand };
        logger.info("Email service initialized with AWS SES");
      }
    } catch (error) {
      logger.warn("Email provider initialization failed - emails will be logged only", { error });
    }
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    const { to, subject, html, text } = options;

    // Log email in development or when disabled
    if (!config.email.enabled) {
      logger.info("Email would be sent (disabled):", {
        to,
        subject,
        preview: html.substring(0, 200),
      });
      return { success: true, messageId: "dev-" + Date.now() };
    }

    try {
      if (this.sendgrid) {
        const result = await this.sendgrid.send({
          to,
          from: {
            email: config.email.fromAddress,
            name: config.email.fromName,
          },
          subject,
          html,
          text: text || this.htmlToText(html),
        });

        logger.info("Email sent via SendGrid", { to, subject, messageId: result[0]?.headers?.["x-message-id"] });
        return { success: true, messageId: result[0]?.headers?.["x-message-id"] };
      }

      if (this.ses) {
        const client = new this.ses.SESClient({ region: config.email.sesRegion });
        const command = new this.ses.SendEmailCommand({
          Source: `${config.email.fromName} <${config.email.fromAddress}>`,
          Destination: { ToAddresses: [to] },
          Message: {
            Subject: { Data: subject, Charset: "UTF-8" },
            Body: {
              Html: { Data: html, Charset: "UTF-8" },
              Text: { Data: text || this.htmlToText(html), Charset: "UTF-8" },
            },
          },
        });

        const result = await client.send(command);
        logger.info("Email sent via AWS SES", { to, subject, messageId: result.MessageId });
        return { success: true, messageId: result.MessageId };
      }

      // Fallback: log email
      logger.info("Email logged (no provider configured):", { to, subject });
      return { success: true, messageId: "logged-" + Date.now() };
    } catch (error: any) {
      logger.error("Failed to send email", { to, subject, error: error.message });
      return { success: false, error: error.message };
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  }

  // Email Templates

  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<EmailResult> {
    const resetUrl = `${config.email.appUrl}/auth/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || "there"},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If you didn't request this, you can safely ignore this email. The link will expire in ${config.security.passwordResetExpiry} hour(s).</p>
            <p>For security, this link can only be used once.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Unified Health. All rights reserved.</p>
            <p>If you're having trouble clicking the button, copy and paste this URL:<br>${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to: email,
      subject: "Reset Your Password - The Unified Health",
      html,
    });
  }

  async sendEmailVerificationEmail(email: string, token: string, firstName: string): Promise<EmailResult> {
    const verifyUrl = `${config.email.appUrl}/auth/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || "there"},</p>
            <p>Welcome to The Unified Health! Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </p>
            <p>This link will expire in ${config.security.emailVerificationExpiry} hours.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Unified Health. All rights reserved.</p>
            <p>If you're having trouble clicking the button, copy and paste this URL:<br>${verifyUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to: email,
      subject: "Verify Your Email - The Unified Health",
      html,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<EmailResult> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to The Unified Health!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || "there"},</p>
            <p>Thank you for joining The Unified Health. We're excited to have you on board!</p>
            <p>With your account, you can:</p>
            <ul>
              <li>Book appointments with healthcare providers</li>
              <li>Access telehealth consultations</li>
              <li>View your medical records</li>
              <li>Manage prescriptions and medications</li>
            </ul>
            <p style="text-align: center;">
              <a href="${config.email.appUrl}/dashboard" class="button">Go to Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} The Unified Health. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to: email,
      subject: "Welcome to The Unified Health!",
      html,
    });
  }
}

export const emailService = new EmailService();
