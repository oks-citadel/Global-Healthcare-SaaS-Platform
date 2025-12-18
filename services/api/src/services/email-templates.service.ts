import { sendEmail } from '../lib/email.js';
import { logger } from '../utils/logger.js';

/**
 * Email Templates Service
 *
 * Centralized service for sending templated emails with proper formatting
 * and error handling.
 */

export interface EmailRecipient {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export class EmailTemplatesService {
  private readonly baseUrl: string;
  private readonly dashboardUrl: string;
  private readonly helpUrl: string;
  private readonly privacyUrl: string;

  constructor() {
    this.baseUrl = process.env.APP_URL || 'https://app.unifiedhealth.com';
    this.dashboardUrl = `${this.baseUrl}/dashboard`;
    this.helpUrl = `${this.baseUrl}/help`;
    this.privacyUrl = `${this.baseUrl}/privacy`;
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(recipient: EmailRecipient): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Welcome to UnifiedHealth',
        templatePath: 'welcome.html',
        templateData: {
          name: recipient.firstName,
          dashboardUrl: this.dashboardUrl,
          helpUrl: this.helpUrl,
          privacyUrl: this.privacyUrl,
          email: recipient.email,
        },
      });

      logger.info(`Welcome email sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send subscription welcome email
   */
  async sendSubscriptionWelcome(
    recipient: EmailRecipient,
    subscriptionDetails: {
      subscriptionId: string;
      planName: string;
      trialEnd?: Date;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Welcome to Your Healthcare Subscription',
        templatePath: 'subscription-welcome.html',
        templateData: {
          name: `${recipient.firstName} ${recipient.lastName}`,
          subscriptionId: subscriptionDetails.subscriptionId,
          planName: subscriptionDetails.planName,
          trialEnd: subscriptionDetails.trialEnd?.toLocaleDateString(),
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Subscription welcome email sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send subscription welcome email to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send trial ending notification
   */
  async sendTrialEndingNotification(
    recipient: EmailRecipient,
    daysRemaining: number,
    trialEndDate: Date
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: `Your Trial Ends in ${daysRemaining} Days`,
        templatePath: 'trial-ending.html',
        templateData: {
          name: recipient.firstName,
          daysRemaining,
          trialEndDate: trialEndDate.toLocaleDateString(),
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Trial ending notification sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send trial ending notification to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send payment receipt
   */
  async sendPaymentReceipt(
    recipient: EmailRecipient,
    paymentDetails: {
      invoiceNumber: string;
      amountPaid: number;
      currency: string;
      invoiceUrl: string;
      invoicePdf?: string;
      date: Date;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Payment Receipt - Healthcare Platform',
        templatePath: 'payment-receipt.html',
        templateData: {
          name: recipient.firstName,
          invoiceNumber: paymentDetails.invoiceNumber,
          amountPaid: paymentDetails.amountPaid.toFixed(2),
          currency: paymentDetails.currency.toUpperCase(),
          invoiceUrl: paymentDetails.invoiceUrl,
          invoicePdf: paymentDetails.invoicePdf,
          date: paymentDetails.date.toLocaleDateString(),
          email: recipient.email,
        },
      });

      logger.info(`Payment receipt sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send payment receipt to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailedNotification(
    recipient: EmailRecipient,
    paymentDetails: {
      invoiceNumber: string;
      amountDue: number;
      currency: string;
      invoiceUrl: string;
      attemptCount: number;
      nextPaymentAttempt?: Date;
      failureReason?: string;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Payment Failed - Action Required',
        templatePath: 'payment-failed.html',
        templateData: {
          name: recipient.firstName,
          invoiceNumber: paymentDetails.invoiceNumber,
          amountDue: paymentDetails.amountDue.toFixed(2),
          currency: paymentDetails.currency.toUpperCase(),
          invoiceUrl: paymentDetails.invoiceUrl,
          attemptCount: paymentDetails.attemptCount,
          nextPaymentAttempt: paymentDetails.nextPaymentAttempt?.toLocaleDateString(),
          failureReason: paymentDetails.failureReason,
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Payment failed notification sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send payment failed notification to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send subscription canceled notification
   */
  async sendSubscriptionCanceled(
    recipient: EmailRecipient,
    subscriptionDetails: {
      subscriptionId: string;
      endDate: Date;
      reason?: string;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Your Subscription Has Been Canceled',
        templatePath: 'subscription-canceled.html',
        templateData: {
          name: recipient.firstName,
          subscriptionId: subscriptionDetails.subscriptionId,
          endDate: subscriptionDetails.endDate.toLocaleDateString(),
          reason: subscriptionDetails.reason,
          email: recipient.email,
        },
      });

      logger.info(`Subscription canceled notification sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send subscription canceled notification to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(
    recipient: EmailRecipient,
    appointmentDetails: {
      appointmentId: string;
      providerName: string;
      appointmentDate: Date;
      appointmentTime: string;
      type: string;
      location?: string;
      videoUrl?: string;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Appointment Confirmation',
        templatePath: 'appointment-confirmation.html',
        templateData: {
          name: recipient.firstName,
          appointmentId: appointmentDetails.appointmentId,
          providerName: appointmentDetails.providerName,
          appointmentDate: appointmentDetails.appointmentDate.toLocaleDateString(),
          appointmentTime: appointmentDetails.appointmentTime,
          type: appointmentDetails.type,
          location: appointmentDetails.location,
          videoUrl: appointmentDetails.videoUrl,
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Appointment confirmation sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send appointment confirmation to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(
    recipient: EmailRecipient,
    appointmentDetails: {
      appointmentId: string;
      providerName: string;
      appointmentDate: Date;
      appointmentTime: string;
      type: string;
      location?: string;
      videoUrl?: string;
      hoursUntil: number;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: `Appointment Reminder - ${appointmentDetails.hoursUntil} Hours`,
        templatePath: 'appointment-reminder.html',
        templateData: {
          name: recipient.firstName,
          appointmentId: appointmentDetails.appointmentId,
          providerName: appointmentDetails.providerName,
          appointmentDate: appointmentDetails.appointmentDate.toLocaleDateString(),
          appointmentTime: appointmentDetails.appointmentTime,
          type: appointmentDetails.type,
          location: appointmentDetails.location,
          videoUrl: appointmentDetails.videoUrl,
          hoursUntil: appointmentDetails.hoursUntil,
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Appointment reminder sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send appointment reminder to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    recipient: EmailRecipient,
    resetToken: string,
    expiresIn: number = 60
  ): Promise<void> {
    try {
      const resetUrl = `${this.baseUrl}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: recipient.email,
        subject: 'Password Reset Request',
        templatePath: 'password-reset.html',
        templateData: {
          name: recipient.firstName,
          resetUrl,
          expiresIn,
          email: recipient.email,
        },
      });

      logger.info(`Password reset email sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send upcoming invoice notification
   */
  async sendUpcomingInvoice(
    recipient: EmailRecipient,
    invoiceDetails: {
      amountDue: number;
      currency: string;
      dueDate: Date;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Upcoming Payment Notification',
        templatePath: 'upcoming-invoice.html',
        templateData: {
          name: recipient.firstName,
          amountDue: invoiceDetails.amountDue.toFixed(2),
          currency: invoiceDetails.currency.toUpperCase(),
          dueDate: invoiceDetails.dueDate.toLocaleDateString(),
          dashboardUrl: this.dashboardUrl,
          email: recipient.email,
        },
      });

      logger.info(`Upcoming invoice notification sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send upcoming invoice notification to ${recipient.email}`, { error });
      throw error;
    }
  }

  /**
   * Send refund processed notification
   */
  async sendRefundProcessed(
    recipient: EmailRecipient,
    refundDetails: {
      chargeId: string;
      amountRefunded: number;
      currency: string;
      date: Date;
      reason?: string;
    }
  ): Promise<void> {
    try {
      await sendEmail({
        to: recipient.email,
        subject: 'Refund Processed',
        templatePath: 'refund-processed.html',
        templateData: {
          name: recipient.firstName,
          chargeId: refundDetails.chargeId,
          amountRefunded: refundDetails.amountRefunded.toFixed(2),
          currency: refundDetails.currency.toUpperCase(),
          date: refundDetails.date.toLocaleDateString(),
          reason: refundDetails.reason,
          email: recipient.email,
        },
      });

      logger.info(`Refund processed notification sent to ${recipient.email}`);
    } catch (error) {
      logger.error(`Failed to send refund processed notification to ${recipient.email}`, { error });
      throw error;
    }
  }
}

export const emailTemplatesService = new EmailTemplatesService();
