import twilio from 'twilio';
import { logger } from '../utils/logger.js';

/**
 * SMS Library
 *
 * Provides Twilio integration for SMS messaging
 */

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// Initialize Twilio client
let twilioClient: twilio.Twilio | null = null;

// Only initialize if valid credentials are provided (account SID must start with 'AC')
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    logger.info('Twilio client initialized');
  } catch (error) {
    logger.warn('Failed to initialize Twilio client. SMS sending will be in stub mode.');
  }
} else {
  logger.warn('Twilio credentials not configured. SMS sending will be in stub mode.');
}

/**
 * SMS options interface
 */
export interface SmsOptions {
  to: string;
  message: string;
  from?: string;
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
 * Send SMS using Twilio
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

    // If Twilio is not configured, log and return stub response
    if (!twilioClient || !TWILIO_PHONE_NUMBER) {
      logger.info('SMS stub - Twilio not configured', {
        to: phoneNumber,
        messageLength: options.message.length,
      });

      return {
        success: true,
        messageId: `stub-${Date.now()}`,
        status: 'sent',
      };
    }

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: options.message,
      from: options.from || TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    logger.info('SMS sent successfully', {
      to: phoneNumber,
      messageId: message.sid,
      status: message.status,
    });

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    };
  } catch (error) {
    logger.error('Failed to send SMS', {
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
  logger.info('Sending batch SMS messages', {
    recipientCount: recipients.length,
    messageLength: message.length,
  });

  const promises = recipients.map(to =>
    sendSms({ to, message })
  );

  return Promise.all(promises);
}

/**
 * Send SMS with rate limiting
 *
 * This function implements basic rate limiting to prevent hitting Twilio's rate limits.
 * For production, consider using a proper queue system like Bull.
 *
 * @param options - SMS options
 * @param delayMs - Delay between messages in milliseconds
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
 * Get SMS delivery status
 *
 * @param messageId - Twilio message SID
 * @returns Message status
 */
export async function getSmsStatus(messageId: string): Promise<{
  status: string;
  errorCode?: string;
  errorMessage?: string;
}> {
  try {
    if (!twilioClient) {
      logger.warn('Twilio not configured. Cannot get SMS status.');
      return { status: 'unknown' };
    }

    const message = await twilioClient.messages(messageId).fetch();

    return {
      status: message.status,
      errorCode: message.errorCode?.toString(),
      errorMessage: message.errorMessage || undefined,
    };
  } catch (error) {
    logger.error('Failed to get SMS status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      messageId,
    });

    return {
      status: 'unknown',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default {
  sendSms,
  sendBatchSms,
  sendSmsWithDelay,
  getSmsStatus,
  isValidPhoneNumber,
  formatPhoneNumber,
};
