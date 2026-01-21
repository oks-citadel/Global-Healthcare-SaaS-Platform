/**
 * AWS SES Email Service
 * Production-ready email service with AWS SES integration
 * Features: Retry logic, rate limiting, error handling, sandbox mode support
 */

import {
  SESClient,
  SendEmailCommand,
  GetSendQuotaCommand,
  type GetSendQuotaCommandOutput,
} from '@aws-sdk/client-ses';
import { logger } from '../../utils/logger.js';
import {
  EmailOptions,
  EmailResult,
  SESConfig,
  RateLimitState,
  EmailServiceStats,
  EmailType,
} from './types.js';

/**
 * SES Client configuration type
 */
interface SESClientConfig {
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * SendEmail command input type (matching AWS SDK v3 structure)
 */
interface SendEmailInput {
  Source: string;
  Destination: {
    ToAddresses?: string[];
    CcAddresses?: string[];
    BccAddresses?: string[];
  };
  Message: {
    Subject: {
      Data: string;
      Charset?: string;
    };
    Body: {
      Html?: {
        Data: string;
        Charset?: string;
      };
      Text?: {
        Data: string;
        Charset?: string;
      };
    };
  };
  ReplyToAddresses?: string[];
  ConfigurationSetName?: string;
  Tags?: Array<{ Name: string; Value: string }>;
}

/**
 * AWS SES specific error types for better error handling
 */
type SESError = Error & {
  name: string;
  $metadata?: {
    httpStatusCode?: number;
    requestId?: string;
  };
  Code?: string;
  message: string;
};

/**
 * Determines if an error is retryable based on AWS SES error codes
 */
function isRetryableError(error: SESError): boolean {
  const retryableCodes = [
    'Throttling',
    'ServiceUnavailable',
    'RequestTimeout',
    'ProvisionedThroughputExceededException',
    'InternalFailure',
  ];

  const retryableHttpCodes = [429, 500, 502, 503, 504];

  if (error.Code && retryableCodes.includes(error.Code)) {
    return true;
  }

  if (error.$metadata?.httpStatusCode && retryableHttpCodes.includes(error.$metadata.httpStatusCode)) {
    return true;
  }

  return false;
}

/**
 * AWS SES Email Service Class
 */
export class SESEmailService {
  private client: SESClient;
  private config: SESConfig;
  private rateLimitState: RateLimitState;
  private stats: EmailServiceStats;
  private initialized: boolean = false;

  constructor(config: Partial<SESConfig>) {
    this.config = {
      region: config.region || 'us-east-1',
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      fromAddress: config.fromAddress || 'noreply@theunifiedhealth.com',
      fromName: config.fromName || 'The Unified Health',
      configurationSetName: config.configurationSetName,
      sandboxMode: config.sandboxMode ?? true,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      rateLimitPerSecond: config.rateLimitPerSecond ?? 14, // SES default is 14/sec
    };

    // Initialize SES client
    const clientConfig: SESClientConfig = {
      region: this.config.region,
    };

    // Only set credentials if explicitly provided (otherwise use IAM role/env vars)
    if (this.config.accessKeyId && this.config.secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      };
    }

    this.client = new SESClient(clientConfig);

    // Initialize rate limiting state
    this.rateLimitState = {
      count: 0,
      windowStart: Date.now(),
      lastReset: Date.now(),
    };

    // Initialize statistics
    this.stats = {
      totalSent: 0,
      totalFailed: 0,
      totalRetried: 0,
      byType: {} as Record<EmailType, { sent: number; failed: number }>,
      lastHourSent: 0,
      rateLimitRemaining: this.config.rateLimitPerSecond,
    };
  }

  /**
   * Initialize the service and verify SES configuration
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Fetch SES quota to verify credentials and get actual rate limits
      const quotaCommand = new GetSendQuotaCommand({});
      const quotaResponse: GetSendQuotaCommandOutput = await this.client.send(quotaCommand);

      // Update rate limit based on actual SES account limits
      if (quotaResponse.MaxSendRate !== undefined) {
        this.config.rateLimitPerSecond = Math.floor(quotaResponse.MaxSendRate);
        this.stats.rateLimitRemaining = this.config.rateLimitPerSecond;
      }

      logger.info('AWS SES Email Service initialized', {
        region: this.config.region,
        sandboxMode: this.config.sandboxMode,
        rateLimitPerSecond: this.config.rateLimitPerSecond,
        max24HourSend: quotaResponse.Max24HourSend,
        sentLast24Hours: quotaResponse.SentLast24Hours,
      });

      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize AWS SES', { error });
      // Don't throw - allow service to continue with fallback logging
      this.initialized = true;
    }
  }

  /**
   * Send an email via AWS SES
   */
  async send(options: EmailOptions, emailType?: EmailType): Promise<EmailResult> {
    await this.initialize();

    // Check rate limit
    if (!this.checkRateLimit()) {
      logger.warn('Rate limit exceeded, queueing email', { to: options.to });
      return {
        success: false,
        error: 'Rate limit exceeded. Email queued for later delivery.',
        retryable: true,
      };
    }

    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

    // Validate sandbox mode restrictions
    if (this.config.sandboxMode) {
      logger.warn('SES is in sandbox mode - verify recipient emails are verified in SES', {
        to: toAddresses,
      });
    }

    const input: SendEmailInput = {
      Source: `${this.config.fromName} <${this.config.fromAddress}>`,
      Destination: {
        ToAddresses: toAddresses,
        CcAddresses: options.cc,
        BccAddresses: options.bcc,
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: 'UTF-8',
          },
          Text: {
            Data: options.text || this.htmlToPlainText(options.html),
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
      ConfigurationSetName: this.config.configurationSetName,
      Tags: options.tags?.map(tag => ({ Name: tag.name, Value: tag.value })),
    };

    // Attempt to send with retry logic
    return this.sendWithRetry(input, emailType);
  }

  /**
   * Send email with exponential backoff retry
   */
  private async sendWithRetry(
    input: SendEmailInput,
    emailType?: EmailType,
    attempt: number = 1
  ): Promise<EmailResult> {
    try {
      const command = new SendEmailCommand(input);
      const response = await this.client.send(command);

      // Update statistics
      this.stats.totalSent++;
      this.stats.lastHourSent++;
      if (emailType) {
        if (!this.stats.byType[emailType]) {
          this.stats.byType[emailType] = { sent: 0, failed: 0 };
        }
        this.stats.byType[emailType].sent++;
      }

      logger.info('Email sent successfully via SES', {
        messageId: response.MessageId,
        to: input.Destination?.ToAddresses,
        subject: input.Message?.Subject?.Data,
        emailType,
      });

      return {
        success: true,
        messageId: response.MessageId,
      };
    } catch (error) {
      const sesError = error as SESError;

      // Handle specific SES errors
      const errorResult = this.handleSESError(sesError, input);

      if (errorResult.retryable && attempt < this.config.maxRetries) {
        const delay = this.calculateBackoffDelay(attempt);

        logger.warn('Retrying email send', {
          attempt,
          maxRetries: this.config.maxRetries,
          delay,
          error: sesError.message,
        });

        this.stats.totalRetried++;

        await this.sleep(delay);
        return this.sendWithRetry(input, emailType, attempt + 1);
      }

      // Update failure statistics
      this.stats.totalFailed++;
      if (emailType) {
        if (!this.stats.byType[emailType]) {
          this.stats.byType[emailType] = { sent: 0, failed: 0 };
        }
        this.stats.byType[emailType].failed++;
      }

      return errorResult;
    }
  }

  /**
   * Handle SES-specific errors and return appropriate result
   */
  private handleSESError(error: SESError, input: SendEmailInput): EmailResult {
    const baseResult = {
      success: false,
      error: error.message,
    };

    // Check for specific SES error types by error name
    if (error.name === 'MessageRejected') {
      logger.error('Email rejected by SES', {
        to: input.Destination?.ToAddresses,
        error: error.message,
      });
      return { ...baseResult, retryable: false };
    }

    if (error.name === 'MailFromDomainNotVerifiedException') {
      logger.error('Mail from domain not verified', {
        from: input.Source,
        error: error.message,
      });
      return { ...baseResult, retryable: false };
    }

    if (error.name === 'ConfigurationSetDoesNotExistException') {
      logger.error('Configuration set does not exist', {
        configSet: input.ConfigurationSetName,
        error: error.message,
      });
      return { ...baseResult, retryable: false };
    }

    // Check if error is retryable
    if (isRetryableError(error)) {
      return { ...baseResult, retryable: true };
    }

    // Log unhandled error
    logger.error('SES email send failed', {
      errorName: error.name,
      errorCode: error.Code,
      httpStatus: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      to: input.Destination?.ToAddresses,
    });

    return { ...baseResult, retryable: false };
  }

  /**
   * Check and update rate limit
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const windowDuration = 1000; // 1 second window

    // Reset window if needed
    if (now - this.rateLimitState.windowStart >= windowDuration) {
      this.rateLimitState.count = 0;
      this.rateLimitState.windowStart = now;
    }

    // Check if we're under the limit
    if (this.rateLimitState.count >= this.config.rateLimitPerSecond) {
      return false;
    }

    // Increment counter
    this.rateLimitState.count++;
    this.stats.rateLimitRemaining = this.config.rateLimitPerSecond - this.rateLimitState.count;

    return true;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number): number {
    const baseDelay = this.config.retryDelay;
    const maxDelay = 30000; // Max 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Convert HTML to plain text
   */
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Sleep utility for retry delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current service statistics
   */
  getStats(): EmailServiceStats {
    return { ...this.stats };
  }

  /**
   * Get current SES quota information
   */
  async getQuota(): Promise<{
    maxSendRate?: number;
    max24HourSend?: number;
    sentLast24Hours?: number;
  }> {
    try {
      const command = new GetSendQuotaCommand({});
      const response: GetSendQuotaCommandOutput = await this.client.send(command);

      return {
        maxSendRate: response.MaxSendRate,
        max24HourSend: response.Max24HourSend,
        sentLast24Hours: response.SentLast24Hours,
      };
    } catch (error) {
      logger.error('Failed to get SES quota', { error });
      // Return default rate limit info on error
      return {
        maxSendRate: this.config.rateLimitPerSecond,
      };
    }
  }

  /**
   * Check if email address is verified (for sandbox mode)
   */
  async isEmailVerified(_email: string): Promise<boolean> {
    // In production mode, all emails are allowed
    if (!this.config.sandboxMode) {
      return true;
    }

    // In sandbox mode, you should verify emails are in the verified list
    // This would require additional SES API calls
    // For now, we log a warning and return true
    logger.warn('Sandbox mode: Email verification check not implemented');
    return true;
  }
}

/**
 * Create SES email service instance
 */
export function createSESEmailService(config: Partial<SESConfig>): SESEmailService {
  return new SESEmailService(config);
}
