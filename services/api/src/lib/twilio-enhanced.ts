import twilio from 'twilio';
import { logger } from '../utils/logger.js';

/**
 * Enhanced Twilio Integration
 *
 * Provides comprehensive Twilio functionality including:
 * - SMS with retry logic
 * - Voice calls
 * - Call recording
 * - Call forwarding
 * - Conference calls
 * - TwiML generation
 * - Error handling and exponential backoff
 */

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
const TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID || '';

// Initialize Twilio client
let twilioClient: twilio.Twilio | null = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    logger.info('Enhanced Twilio client initialized');
  } catch (error) {
    logger.warn('Failed to initialize Twilio client', { error });
  }
} else {
  logger.warn('Twilio credentials not configured');
}

/**
 * SMS Interfaces
 */
export interface SmsOptions {
  to: string;
  message: string;
  from?: string;
  statusCallback?: string;
  mediaUrl?: string[];
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
}

/**
 * Voice Call Interfaces
 */
export interface VoiceCallOptions {
  to: string;
  from?: string;
  url?: string;
  twiml?: string;
  statusCallback?: string;
  statusCallbackEvent?: string[];
  record?: boolean;
  recordingStatusCallback?: string;
  timeout?: number;
  machineDetection?: 'Enable' | 'DetectMessageEnd';
}

export interface VoiceCallResponse {
  success: boolean;
  callId?: string;
  status?: string;
  error?: string;
}

/**
 * Retry Configuration
 */
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

/**
 * Enhanced SMS Service with Retry
 */
export class TwilioEnhancedService {
  /**
   * Send SMS with retry logic
   */
  async sendSmsWithRetry(
    options: SmsOptions,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<SmsResponse> {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await this.sendSms(options);
        if (result.success) {
          return result;
        }
        lastError = new Error(result.error || 'SMS send failed');
      } catch (error) {
        lastError = error as Error;
      }

      if (attempt < config.maxRetries) {
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffFactor, attempt),
          config.maxDelay
        );

        logger.warn(`SMS send failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries: config.maxRetries,
          to: options.to,
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    logger.error('SMS send failed after all retries', {
      to: options.to,
      attempts: config.maxRetries + 1,
      error: lastError,
    });

    return {
      success: false,
      error: lastError?.message || 'SMS send failed after retries',
    };
  }

  /**
   * Send SMS
   */
  private async sendSms(options: SmsOptions): Promise<SmsResponse> {
    try {
      if (!twilioClient || !TWILIO_PHONE_NUMBER) {
        logger.warn('Twilio not configured, returning stub response');
        return {
          success: true,
          messageId: `stub-${Date.now()}`,
          status: 'sent',
        };
      }

      const message = await twilioClient.messages.create({
        body: options.message,
        from: options.from || TWILIO_PHONE_NUMBER,
        to: options.to,
        statusCallback: options.statusCallback,
        mediaUrl: options.mediaUrl,
      });

      logger.info('SMS sent successfully', {
        messageId: message.sid,
        to: options.to,
        status: message.status,
      });

      return {
        success: true,
        messageId: message.sid,
        status: message.status,
      };
    } catch (error) {
      logger.error('SMS send error', { error, to: options.to });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Make voice call
   */
  async makeCall(options: VoiceCallOptions): Promise<VoiceCallResponse> {
    try {
      if (!twilioClient || !TWILIO_PHONE_NUMBER) {
        logger.warn('Twilio not configured, returning stub response');
        return {
          success: true,
          callId: `stub-call-${Date.now()}`,
          status: 'initiated',
        };
      }

      const callParams: any = {
        to: options.to,
        from: options.from || TWILIO_PHONE_NUMBER,
        statusCallback: options.statusCallback,
        statusCallbackEvent: options.statusCallbackEvent,
        timeout: options.timeout || 60,
        machineDetection: options.machineDetection,
      };

      // Use either TwiML URL or inline TwiML
      if (options.url) {
        callParams.url = options.url;
      } else if (options.twiml) {
        callParams.twiml = options.twiml;
      } else {
        throw new Error('Either url or twiml must be provided');
      }

      // Add recording if requested
      if (options.record) {
        callParams.record = true;
        callParams.recordingStatusCallback = options.recordingStatusCallback;
      }

      const call = await twilioClient.calls.create(callParams);

      logger.info('Voice call initiated', {
        callId: call.sid,
        to: options.to,
        status: call.status,
      });

      return {
        success: true,
        callId: call.sid,
        status: call.status,
      };
    } catch (error) {
      logger.error('Voice call error', { error, to: options.to });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Make call with retry logic
   */
  async makeCallWithRetry(
    options: VoiceCallOptions,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<VoiceCallResponse> {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await this.makeCall(options);
        if (result.success) {
          return result;
        }
        lastError = new Error(result.error || 'Call failed');
      } catch (error) {
        lastError = error as Error;
      }

      if (attempt < config.maxRetries) {
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffFactor, attempt),
          config.maxDelay
        );

        logger.warn(`Call failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries: config.maxRetries,
          to: options.to,
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    logger.error('Call failed after all retries', {
      to: options.to,
      attempts: config.maxRetries + 1,
      error: lastError,
    });

    return {
      success: false,
      error: lastError?.message || 'Call failed after retries',
    };
  }

  /**
   * Get call status
   */
  async getCallStatus(callSid: string): Promise<any> {
    try {
      if (!twilioClient) {
        throw new Error('Twilio not configured');
      }

      const call = await twilioClient.calls(callSid).fetch();

      return {
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
        direction: call.direction,
        from: call.from,
        to: call.to,
        price: call.price,
        priceUnit: call.priceUnit,
      };
    } catch (error) {
      logger.error('Failed to get call status', { error, callSid });
      throw error;
    }
  }

  /**
   * Get recording URL
   */
  async getRecordingUrl(recordingSid: string): Promise<string> {
    try {
      if (!twilioClient) {
        throw new Error('Twilio not configured');
      }

      const recording = await twilioClient.recordings(recordingSid).fetch();
      return `https://api.twilio.com${recording.uri.replace('.json', '.mp3')}`;
    } catch (error) {
      logger.error('Failed to get recording URL', { error, recordingSid });
      throw error;
    }
  }

  /**
   * Send MMS (SMS with media)
   */
  async sendMms(
    to: string,
    message: string,
    mediaUrls: string[]
  ): Promise<SmsResponse> {
    return this.sendSmsWithRetry({
      to,
      message,
      mediaUrl: mediaUrls,
    });
  }

  /**
   * Forward call to another number
   */
  async forwardCall(callSid: string, to: string): Promise<void> {
    try {
      if (!twilioClient) {
        throw new Error('Twilio not configured');
      }

      const twiml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial>${to}</Dial>
        </Response>
      `;

      await twilioClient.calls(callSid).update({
        twiml,
      });

      logger.info('Call forwarded', { callSid, to });
    } catch (error) {
      logger.error('Failed to forward call', { error, callSid, to });
      throw error;
    }
  }

  /**
   * Create conference call
   */
  async createConference(
    participants: string[],
    conferenceName: string
  ): Promise<string> {
    try {
      if (!twilioClient || !TWILIO_PHONE_NUMBER) {
        throw new Error('Twilio not configured');
      }

      const twiml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Dial>
            <Conference>${conferenceName}</Conference>
          </Dial>
        </Response>
      `;

      const calls = await Promise.all(
        participants.map(participant =>
          twilioClient!.calls.create({
            to: participant,
            from: TWILIO_PHONE_NUMBER,
            twiml,
          })
        )
      );

      logger.info('Conference call created', {
        conferenceName,
        participantCount: participants.length,
      });

      return conferenceName;
    } catch (error) {
      logger.error('Failed to create conference', { error, conferenceName });
      throw error;
    }
  }

  /**
   * Generate TwiML for voicemail
   */
  generateVoicemailTwiML(
    message: string,
    recordingCallback: string
  ): string {
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>${message}</Say>
        <Record
          action="${recordingCallback}"
          maxLength="120"
          playBeep="true"
        />
      </Response>
    `;
  }

  /**
   * Generate TwiML for call forwarding
   */
  generateForwardTwiML(forwardTo: string, timeout: number = 30): string {
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Dial timeout="${timeout}">
          <Number>${forwardTo}</Number>
        </Dial>
      </Response>
    `;
  }

  /**
   * Generate TwiML for IVR menu
   */
  generateIvrTwiML(
    welcomeMessage: string,
    menuOptions: { digit: string; action: string }[]
  ): string {
    const gatherOptions = menuOptions
      .map(opt => `<Gather numDigits="1" action="${opt.action}"></Gather>`)
      .join('\n');

    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>${welcomeMessage}</Say>
        ${gatherOptions}
        <Say>Invalid option. Please try again.</Say>
        <Redirect>/voice/ivr</Redirect>
      </Response>
    `;
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(phoneNumber: string): Promise<{
    valid: boolean;
    formatted?: string;
    carrier?: string;
    type?: string;
  }> {
    try {
      if (!twilioClient) {
        throw new Error('Twilio not configured');
      }

      const lookup = await twilioClient.lookups.v1
        .phoneNumbers(phoneNumber)
        .fetch({ type: ['carrier'] });

      return {
        valid: true,
        formatted: lookup.phoneNumber,
        carrier: lookup.carrier?.name,
        type: lookup.carrier?.type,
      };
    } catch (error) {
      logger.error('Phone number validation failed', { error, phoneNumber });
      return {
        valid: false,
      };
    }
  }
}

export const twilioEnhancedService = new TwilioEnhancedService();
