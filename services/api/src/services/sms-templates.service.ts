import { sendSms, sendBatchSms, SmsResponse } from '../lib/aws-sms.js';
import { logger } from '../utils/logger.js';

/**
 * SMS Templates Service
 *
 * Centralized service for sending templated SMS messages with proper formatting,
 * character limits, and error handling.
 */

export interface SmsRecipient {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export class SmsTemplatesService {
  private readonly maxLength = 160; // Standard SMS length
  private readonly platformName = 'Unified Health';

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(
    recipient: SmsRecipient,
    appointmentDetails: {
      providerName: string;
      appointmentDate: Date;
      appointmentTime: string;
      location?: string;
      confirmationLink?: string;
    }
  ): Promise<SmsResponse> {
    try {
      const dateStr = appointmentDetails.appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      let message = `Hi ${recipient.firstName}, reminder: Your appointment with Dr. ${appointmentDetails.providerName} is on ${dateStr} at ${appointmentDetails.appointmentTime}.`;

      if (appointmentDetails.confirmationLink) {
        message += ` Confirm: ${this.shortenUrl(appointmentDetails.confirmationLink)}`;
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Appointment reminder SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send appointment reminder SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send appointment confirmation SMS
   */
  async sendAppointmentConfirmation(
    recipient: SmsRecipient,
    appointmentDetails: {
      appointmentId: string;
      providerName: string;
      appointmentDate: Date;
      appointmentTime: string;
    }
  ): Promise<SmsResponse> {
    try {
      const dateStr = appointmentDetails.appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const message = this.truncateMessage(
        `${this.platformName}: Your appointment with Dr. ${appointmentDetails.providerName} is confirmed for ${dateStr} at ${appointmentDetails.appointmentTime}. Ref: ${appointmentDetails.appointmentId}`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Appointment confirmation SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send appointment confirmation SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send appointment cancellation SMS
   */
  async sendAppointmentCancellation(
    recipient: SmsRecipient,
    appointmentDetails: {
      appointmentId: string;
      providerName: string;
      appointmentDate: Date;
      cancellationReason?: string;
    }
  ): Promise<SmsResponse> {
    try {
      const dateStr = appointmentDetails.appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const message = this.truncateMessage(
        `${this.platformName}: Your appointment with Dr. ${appointmentDetails.providerName} on ${dateStr} has been canceled. Please call to reschedule.`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Appointment cancellation SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send appointment cancellation SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send verification code SMS
   */
  async sendVerificationCode(
    recipient: SmsRecipient,
    verificationCode: string,
    expiresInMinutes: number = 10
  ): Promise<SmsResponse> {
    try {
      const message = this.truncateMessage(
        `${this.platformName}: Your verification code is ${verificationCode}. Valid for ${expiresInMinutes} minutes. Do not share this code.`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Verification code SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send verification code SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send two-factor authentication code
   */
  async send2FACode(
    recipient: SmsRecipient,
    code: string
  ): Promise<SmsResponse> {
    try {
      const message = this.truncateMessage(
        `${this.platformName}: Your 2FA code is ${code}. Never share this code with anyone.`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`2FA code SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send 2FA code SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send payment reminder SMS
   */
  async sendPaymentReminder(
    recipient: SmsRecipient,
    paymentDetails: {
      amountDue: number;
      currency: string;
      dueDate: Date;
      invoiceUrl?: string;
    }
  ): Promise<SmsResponse> {
    try {
      const dateStr = paymentDetails.dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      let message = `${this.platformName}: Payment reminder - ${paymentDetails.currency}${paymentDetails.amountDue.toFixed(2)} due on ${dateStr}.`;

      if (paymentDetails.invoiceUrl) {
        message += ` View: ${this.shortenUrl(paymentDetails.invoiceUrl)}`;
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Payment reminder SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send payment reminder SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send payment confirmation SMS
   */
  async sendPaymentConfirmation(
    recipient: SmsRecipient,
    paymentDetails: {
      amount: number;
      currency: string;
      date: Date;
      receiptUrl?: string;
    }
  ): Promise<SmsResponse> {
    try {
      const dateStr = paymentDetails.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      let message = `${this.platformName}: Payment of ${paymentDetails.currency}${paymentDetails.amount.toFixed(2)} received on ${dateStr}. Thank you!`;

      if (paymentDetails.receiptUrl) {
        message += ` Receipt: ${this.shortenUrl(paymentDetails.receiptUrl)}`;
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Payment confirmation SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send payment confirmation SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send payment failed SMS
   */
  async sendPaymentFailed(
    recipient: SmsRecipient,
    paymentDetails: {
      amount: number;
      currency: string;
      reason?: string;
      updatePaymentUrl?: string;
    }
  ): Promise<SmsResponse> {
    try {
      let message = `${this.platformName}: Payment of ${paymentDetails.currency}${paymentDetails.amount.toFixed(2)} failed.`;

      if (paymentDetails.updatePaymentUrl) {
        message += ` Update payment method: ${this.shortenUrl(paymentDetails.updatePaymentUrl)}`;
      } else {
        message += ' Please update your payment method.';
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Payment failed SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send payment failed SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send prescription ready SMS
   */
  async sendPrescriptionReady(
    recipient: SmsRecipient,
    prescriptionDetails: {
      pharmacyName: string;
      pharmacyPhone: string;
      medicationName: string;
    }
  ): Promise<SmsResponse> {
    try {
      const message = this.truncateMessage(
        `${this.platformName}: Your prescription for ${prescriptionDetails.medicationName} is ready at ${prescriptionDetails.pharmacyName}. Call ${prescriptionDetails.pharmacyPhone}.`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Prescription ready SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send prescription ready SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send test results available SMS
   */
  async sendTestResultsAvailable(
    recipient: SmsRecipient,
    resultsUrl: string
  ): Promise<SmsResponse> {
    try {
      const message = this.truncateMessage(
        `${this.platformName}: Your test results are now available. View securely: ${this.shortenUrl(resultsUrl)}`
      );

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Test results SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send test results SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send trial ending SMS
   */
  async sendTrialEnding(
    recipient: SmsRecipient,
    daysRemaining: number,
    updatePaymentUrl?: string
  ): Promise<SmsResponse> {
    try {
      let message = `${this.platformName}: Your trial ends in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.`;

      if (updatePaymentUrl) {
        message += ` Add payment: ${this.shortenUrl(updatePaymentUrl)}`;
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Trial ending SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send trial ending SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send emergency alert SMS
   */
  async sendEmergencyAlert(
    recipient: SmsRecipient,
    alertMessage: string,
    actionUrl?: string
  ): Promise<SmsResponse> {
    try {
      let message = `URGENT - ${this.platformName}: ${alertMessage}`;

      if (actionUrl) {
        message += ` Details: ${this.shortenUrl(actionUrl)}`;
      }

      message = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message,
      });

      logger.info(`Emergency alert SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send emergency alert SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send custom SMS
   */
  async sendCustomMessage(
    recipient: SmsRecipient,
    message: string
  ): Promise<SmsResponse> {
    try {
      const formattedMessage = this.truncateMessage(message);

      const result = await sendSms({
        to: recipient.phoneNumber,
        message: formattedMessage,
      });

      logger.info(`Custom SMS sent to ${recipient.phoneNumber}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send custom SMS to ${recipient.phoneNumber}`, { error });
      throw error;
    }
  }

  /**
   * Send batch SMS to multiple recipients
   */
  async sendBatchNotification(
    recipients: SmsRecipient[],
    message: string
  ): Promise<SmsResponse[]> {
    try {
      const phoneNumbers = recipients.map(r => r.phoneNumber);
      const formattedMessage = this.truncateMessage(message);

      const results = await sendBatchSms(phoneNumbers, formattedMessage);

      logger.info(`Batch SMS sent to ${recipients.length} recipients`);
      return results;
    } catch (error) {
      logger.error('Failed to send batch SMS', { error, recipientCount: recipients.length });
      throw error;
    }
  }

  /**
   * Truncate message to SMS length limit
   */
  private truncateMessage(message: string): string {
    if (message.length <= this.maxLength) {
      return message;
    }

    // Truncate and add ellipsis
    const truncated = message.substring(0, this.maxLength - 3) + '...';
    logger.warn('SMS message truncated', {
      originalLength: message.length,
      truncatedLength: truncated.length,
    });

    return truncated;
  }

  /**
   * Shorten URL for SMS (placeholder - integrate with URL shortener service)
   */
  private shortenUrl(url: string): string {
    // In production, integrate with bit.ly, TinyURL, or custom URL shortener
    // For now, return original URL
    return url;
  }

  /**
   * Validate phone number before sending
   */
  private validatePhoneNumber(phoneNumber: string): boolean {
    // E.164 format validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export const smsTemplatesService = new SmsTemplatesService();
