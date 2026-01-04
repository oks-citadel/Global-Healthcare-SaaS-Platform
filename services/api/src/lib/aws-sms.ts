import { SNSClient, PublishCommand, SetSMSAttributesCommand, CheckIfPhoneNumberIsOptedOutCommand } from '@aws-sdk/client-sns';
import { logger } from '../utils/logger.js';

/**
 * AWS SNS SMS Library
 *
 * Provides AWS SNS integration for SMS messaging
 * REPLACES: Twilio (twilio npm package)
 * COMPLIANCE: HIPAA-compliant SMS delivery via AWS SNS
 *
 * NOTE: AWS SNS SMS has specific setup requirements:
 * 1. Account must be moved out of SMS sandbox for production
 * 2. Spending limits must be configured
 * 3. Origination identity (Sender ID or phone number) may be required
 */

// AWS SNS Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const SMS_SENDER_ID = process.env.SNS_SMS_SENDER_ID || 'UnifiedHealth';
const SMS_MONTHLY_SPEND_LIMIT = process.env.SNS_SMS_MONTHLY_SPEND_LIMIT || '1000';

// Initialize SNS Client
const snsClient = new SNSClient({
  region: AWS_REGION,
});

logger.info('AWS SNS SMS client initialized', { region: AWS_REGION });

/**
 * SMS options interface (compatible with previous Twilio interface)
 */
export interface SmsOptions {
  to: string;
  message: string;
  from?: string;
  messageType?: 'Transactional' | 'Promotional';
  senderId?: string;
}

/**
 * SMS response interface
 */
export interface SmsResponse {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
}

/**
 * Validate phone number format (E.164)
 *
 * @param phoneNumber - Phone number to validate
 * @returns True if valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // E.164 format: +[country code][number]
  // Length: 1-15 digits (excluding the +)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Format phone number to E.164
 *
 * @param phoneNumber - Phone number to format
 * @param defaultCountryCode - Default country code (default: '+1' for US)
 * @returns Formatted phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  defaultCountryCode: string = '+1'
): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Add country code if not present
  if (!phoneNumber.startsWith('+')) {
    // If number starts with country code without +, add +
    if (cleaned.length > 10) {
      cleaned = '+' + cleaned;
    } else {
      // Add default country code
      cleaned = defaultCountryCode + cleaned;
    }
  } else {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

/**
 * Configure SNS SMS attributes
 * Call this once at startup or when changing settings
 */
export async function configureSmsAttributes(): Promise<void> {
  try {
    const command = new SetSMSAttributesCommand({
      attributes: {
        DefaultSMSType: 'Transactional', // Use Transactional for healthcare
        DefaultSenderID: SMS_SENDER_ID,
        MonthlySpendLimit: SMS_MONTHLY_SPEND_LIMIT,
        UsageReportS3Bucket: process.env.SNS_SMS_USAGE_BUCKET || '',
      },
    });

    await snsClient.send(command);
    logger.info('AWS SNS SMS attributes configured');
  } catch (error) {
    logger.error('Failed to configure SNS SMS attributes', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Check if phone number has opted out of SMS
 *
 * @param phoneNumber - Phone number to check
 * @returns True if opted out
 */
export async function isOptedOut(phoneNumber: string): Promise<boolean> {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const command = new CheckIfPhoneNumberIsOptedOutCommand({
      phoneNumber: formattedNumber,
    });

    const response = await snsClient.send(command);
    return response.isOptedOut || false;
  } catch (error) {
    logger.error('Failed to check opt-out status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    return false;
  }
}

/**
 * Send SMS using AWS SNS
 *
 * @param options - SMS options
 * @returns SmsResponse with success status
 */
export async function sendSms(options: SmsOptions): Promise<SmsResponse> {
  try {
    // Validate phone number
    const phoneNumber = formatPhoneNumber(options.to);
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format. Use E.164 format (e.g., +1234567890)');
    }

    // Validate message
    if (!options.message || options.message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    // Check message length (SMS limit is 1600 characters for concatenated messages)
    if (options.message.length > 1600) {
      throw new Error('Message too long. Maximum 1600 characters.');
    }

    // Check opt-out status
    const optedOut = await isOptedOut(phoneNumber);
    if (optedOut) {
      logger.warn('SMS not sent - phone number has opted out', { phoneNumber });
      return {
        success: false,
        error: 'Phone number has opted out of SMS',
        status: 'opted_out',
      };
    }

    // Build SNS publish command
    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: options.message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: options.messageType || 'Transactional',
        },
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: options.senderId || SMS_SENDER_ID,
        },
      },
    });

    // Send SMS
    const response = await snsClient.send(command);

    logger.info('SMS sent successfully via AWS SNS', {
      to: phoneNumber,
      messageId: response.MessageId,
      messageLength: options.message.length,
    });

    return {
      success: true,
      messageId: response.MessageId,
      status: 'sent',
    };
  } catch (error) {
    logger.error('Failed to send SMS via AWS SNS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: options.to,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send batch SMS messages
 *
 * @param recipients - Array of phone numbers
 * @param message - SMS message
 * @returns Array of SmsResponse
 */
export async function sendBatchSms(
  recipients: string[],
  message: string
): Promise<SmsResponse[]> {
  logger.info('Sending batch SMS messages via AWS SNS', {
    recipientCount: recipients.length,
    messageLength: message.length,
  });

  // SNS has rate limits, process in batches with small delay
  const results: SmsResponse[] = [];
  const batchSize = 10;
  const delayMs = 100;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const batchPromises = batch.map(to => sendSms({ to, message }));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Send SMS with rate limiting
 *
 * This function implements basic rate limiting to prevent hitting SNS rate limits.
 *
 * @param options - SMS options
 * @param delayMs - Delay in milliseconds before sending
 * @returns SmsResponse with success status
 */
export async function sendSmsWithDelay(
  options: SmsOptions,
  delayMs: number = 1000
): Promise<SmsResponse> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return sendSms(options);
}

/**
 * Healthcare-specific SMS templates
 */
export const healthcareSms = {
  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(to: string, data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, reminder: You have an appointment with ${data.providerName} on ${data.appointmentDate} at ${data.appointmentTime}. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send appointment confirmation SMS
   */
  async sendAppointmentConfirmation(to: string, data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, your appointment with ${data.providerName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send appointment cancellation SMS
   */
  async sendAppointmentCancellation(to: string, data: {
    patientName: string;
    appointmentDate: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, your appointment on ${data.appointmentDate} has been cancelled. Please contact us to reschedule. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send prescription ready SMS
   */
  async sendPrescriptionReady(to: string, data: {
    patientName: string;
    pharmacyName: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, your prescription is ready for pickup at ${data.pharmacyName}. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send lab results ready SMS
   */
  async sendLabResultsReady(to: string, data: {
    patientName: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, your lab results are ready. Log in to your patient portal to view them. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send two-factor authentication code
   */
  async send2FACode(to: string, data: {
    code: string;
    expiresIn: string;
  }): Promise<SmsResponse> {
    const message = `Your The Unified Health verification code is: ${data.code}. Expires in ${data.expiresIn}. Do not share this code.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send password reset code
   */
  async sendPasswordResetCode(to: string, data: {
    code: string;
    expiresIn: string;
  }): Promise<SmsResponse> {
    const message = `Your The Unified Health password reset code is: ${data.code}. Expires in ${data.expiresIn}. If you didn't request this, please ignore.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send telehealth session reminder
   */
  async sendTelehealthReminder(to: string, data: {
    patientName: string;
    providerName: string;
    sessionTime: string;
    sessionLink: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, your telehealth session with ${data.providerName} starts at ${data.sessionTime}. Join at: ${data.sessionLink}. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(to: string, data: {
    patientName: string;
    amount: string;
    dueDate: string;
  }): Promise<SmsResponse> {
    const message = `Hi ${data.patientName}, reminder: Payment of ${data.amount} is due on ${data.dueDate}. Log in to your portal to pay. Reply STOP to opt out.`;
    return sendSms({ to, message, messageType: 'Transactional' });
  },
};

export default {
  sendSms,
  sendBatchSms,
  sendSmsWithDelay,
  isValidPhoneNumber,
  formatPhoneNumber,
  isOptedOut,
  configureSmsAttributes,
  healthcareSms,
};
