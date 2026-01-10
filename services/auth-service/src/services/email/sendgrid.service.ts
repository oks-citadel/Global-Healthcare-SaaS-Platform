/**
 * SendGrid Email Service
 * Alternative email provider with SendGrid integration
 * Used as a fallback when AWS SES is not available
 *
 * PRODUCTION CONFIGURATION:
 * - Set EMAIL_PROVIDER=sendgrid to use SendGrid as primary
 * - Set SENDGRID_API_KEY to your SendGrid API key
 * - Verify your sending domain in SendGrid
 */

import { logger } from "../../utils/logger.js";
import {
  EmailOptions,
  EmailResult,
  SendGridConfig,
  RateLimitState,
  EmailServiceStats,
  EmailType,
  EmailProviderInterface,
} from "./types.js";

/**
 * Determines if an error is retryable based on HTTP status
 */
function isRetryableError(statusCode: number): boolean {
  const retryableStatusCodes = [429, 500, 502, 503, 504];
  return retryableStatusCodes.includes(statusCode);
}

/**
 * SendGrid Email Service Class
 * Implements EmailProviderInterface for consistent provider handling
 */
export class SendGridEmailService implements EmailProviderInterface {
  private config: SendGridConfig;
  private rateLimitState: RateLimitState;
  private stats: EmailServiceStats;
  private initialized: boolean = false;

  constructor(config: Partial<SendGridConfig>) {
    this.config = {
      apiKey: config.apiKey || "",
      fromAddress: config.fromAddress || "noreply@theunifiedhealth.com",
      fromName: config.fromName || "The Unified Health",
      sandboxMode: config.sandboxMode ?? true,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      rateLimitPerSecond: config.rateLimitPerSecond ?? 100,
    };

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
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (!this.config.apiKey) {
      logger.error("SendGrid API key not configured");
      throw new Error("SendGrid API key is required");
    }

    logger.info("SendGrid Email Service initialized", {
      fromAddress: this.config.fromAddress,
      sandboxMode: this.config.sandboxMode,
      rateLimitPerSecond: this.config.rateLimitPerSecond,
    });

    this.initialized = true;
  }

  /**
   * Send an email via SendGrid
   */
  async send(
    options: EmailOptions,
    emailType?: EmailType,
  ): Promise<EmailResult> {
    await this.initialize();

    // Check rate limit
    if (!this.checkRateLimit()) {
      logger.warn("Rate limit exceeded, queueing email", { to: options.to });
      return {
        success: false,
        error: "Rate limit exceeded. Email queued for later delivery.",
        retryable: true,
      };
    }

    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

    // Build SendGrid message
    const message = {
      personalizations: [
        {
          to: toAddresses.map((email) => ({ email })),
          cc: options.cc?.map((email) => ({ email })),
          bcc: options.bcc?.map((email) => ({ email })),
        },
      ],
      from: {
        email: this.config.fromAddress,
        name: this.config.fromName,
      },
      reply_to: options.replyTo ? { email: options.replyTo } : undefined,
      subject: options.subject,
      content: [
        ...(options.text ? [{ type: "text/plain", value: options.text }] : []),
        { type: "text/html", value: options.html },
      ],
      mail_settings: {
        sandbox_mode: {
          enable: this.config.sandboxMode,
        },
      },
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
      categories: emailType ? [emailType] : undefined,
      custom_args: options.tags?.reduce(
        (acc, tag) => {
          acc[tag.name] = tag.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    // Attempt to send with retry logic
    return this.sendWithRetry(message, emailType, toAddresses);
  }

  /**
   * Send email with exponential backoff retry
   */
  private async sendWithRetry(
    message: Record<string, unknown>,
    emailType?: EmailType,
    toAddresses?: string[],
    attempt: number = 1,
  ): Promise<EmailResult> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // SendGrid returns 202 for successful send
      if (response.status === 202) {
        const messageId =
          response.headers.get("x-message-id") || `sg-${Date.now()}`;

        // Update statistics
        this.stats.totalSent++;
        this.stats.lastHourSent++;
        if (emailType) {
          if (!this.stats.byType[emailType]) {
            this.stats.byType[emailType] = { sent: 0, failed: 0 };
          }
          this.stats.byType[emailType].sent++;
        }

        logger.info("Email sent successfully via SendGrid", {
          messageId,
          to: toAddresses,
          emailType,
          sandboxMode: this.config.sandboxMode,
        });

        return {
          success: true,
          messageId,
        };
      }

      // Handle errors
      const errorBody = await response.text();

      if (
        isRetryableError(response.status) &&
        attempt < this.config.maxRetries
      ) {
        const delay = this.calculateBackoffDelay(attempt);

        logger.warn("Retrying email send via SendGrid", {
          attempt,
          maxRetries: this.config.maxRetries,
          delay,
          status: response.status,
        });

        this.stats.totalRetried++;

        await this.sleep(delay);
        return this.sendWithRetry(message, emailType, toAddresses, attempt + 1);
      }

      // Update failure statistics
      this.stats.totalFailed++;
      if (emailType) {
        if (!this.stats.byType[emailType]) {
          this.stats.byType[emailType] = { sent: 0, failed: 0 };
        }
        this.stats.byType[emailType].failed++;
      }

      logger.error("SendGrid email send failed", {
        status: response.status,
        error: errorBody,
        to: toAddresses,
      });

      return {
        success: false,
        error: `SendGrid error: ${response.status} - ${errorBody}`,
        retryable: false,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (attempt < this.config.maxRetries) {
        const delay = this.calculateBackoffDelay(attempt);

        logger.warn("Retrying email send via SendGrid after network error", {
          attempt,
          maxRetries: this.config.maxRetries,
          delay,
          error: errorMessage,
        });

        this.stats.totalRetried++;

        await this.sleep(delay);
        return this.sendWithRetry(message, emailType, toAddresses, attempt + 1);
      }

      // Update failure statistics
      this.stats.totalFailed++;
      if (emailType) {
        if (!this.stats.byType[emailType]) {
          this.stats.byType[emailType] = { sent: 0, failed: 0 };
        }
        this.stats.byType[emailType].failed++;
      }

      logger.error("SendGrid email send failed with network error", {
        error: errorMessage,
        to: toAddresses,
      });

      return {
        success: false,
        error: errorMessage,
        retryable: true,
      };
    }
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
    this.stats.rateLimitRemaining =
      this.config.rateLimitPerSecond - this.rateLimitState.count;

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
   * Sleep utility for retry delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current service statistics
   */
  getStats(): EmailServiceStats {
    return { ...this.stats };
  }

  /**
   * Get current quota information
   */
  async getQuota(): Promise<{
    maxSendRate?: number;
    max24HourSend?: number;
    sentLast24Hours?: number;
  }> {
    // SendGrid doesn't have a direct quota API like SES
    // Return configured rate limit
    return {
      maxSendRate: this.config.rateLimitPerSecond,
    };
  }

  /**
   * Check if the service is in production mode (not sandbox)
   */
  isProductionMode(): boolean {
    return !this.config.sandboxMode;
  }

  /**
   * Get service configuration (safe subset for debugging)
   */
  getServiceConfig(): {
    fromAddress: string;
    sandboxMode: boolean;
    rateLimitPerSecond: number;
  } {
    return {
      fromAddress: this.config.fromAddress,
      sandboxMode: this.config.sandboxMode,
      rateLimitPerSecond: this.config.rateLimitPerSecond,
    };
  }
}

/**
 * Create SendGrid email service instance
 */
export function createSendGridEmailService(
  config: Partial<SendGridConfig>,
): SendGridEmailService {
  return new SendGridEmailService(config);
}
