import Bull, { Queue, Job, JobOptions } from 'bull';
import { logger } from '../utils/logger.js';
import { sendEmail } from './email.js';
import { sendSms } from './sms.js';

/**
 * Queue Library
 *
 * Provides Bull queue setup for async notification processing
 */

// Redis connection configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  db: REDIS_DB,
};

/**
 * Email job data interface
 */
export interface EmailJobData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templatePath?: string;
  templateData?: Record<string, any>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/**
 * SMS job data interface
 */
export interface SmsJobData {
  to: string;
  message: string;
}

/**
 * Notification queues
 */
export class NotificationQueues {
  private emailQueue: Queue<EmailJobData>;
  private smsQueue: Queue<SmsJobData>;
  private scheduledQueue: Queue<any>;

  constructor() {
    // Initialize email queue
    this.emailQueue = new Bull<EmailJobData>('email-notifications', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 500, // Keep last 500 failed jobs
      },
    });

    // Initialize SMS queue
    this.smsQueue = new Bull<SmsJobData>('sms-notifications', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    // Initialize scheduled notifications queue
    this.scheduledQueue = new Bull('scheduled-notifications', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    // Set up processors
    this.setupProcessors();

    // Set up event listeners
    this.setupEventListeners();

    logger.info('Notification queues initialized');
  }

  /**
   * Set up queue processors
   */
  private setupProcessors() {
    // Email processor
    this.emailQueue.process(async (job: Job<EmailJobData>) => {
      logger.info('Processing email job', {
        jobId: job.id,
        to: job.data.to,
        subject: job.data.subject,
      });

      const result = await sendEmail(job.data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      return result;
    });

    // SMS processor
    this.smsQueue.process(async (job: Job<SmsJobData>) => {
      logger.info('Processing SMS job', {
        jobId: job.id,
        to: job.data.to,
      });

      const result = await sendSms(job.data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send SMS');
      }

      return result;
    });

    // Scheduled notifications processor
    this.scheduledQueue.process(async (job: Job) => {
      logger.info('Processing scheduled notification job', {
        jobId: job.id,
        type: job.data.type,
      });

      // Process based on notification type
      if (job.data.type === 'email') {
        await this.addEmailJob(job.data.data);
      } else if (job.data.type === 'sms') {
        await this.addSmsJob(job.data.data);
      }

      return { processed: true };
    });
  }

  /**
   * Set up event listeners for monitoring
   */
  private setupEventListeners() {
    // Email queue events
    this.emailQueue.on('completed', (job, result) => {
      logger.info('Email job completed', {
        jobId: job.id,
        to: job.data.to,
        messageId: result.messageId,
      });
    });

    this.emailQueue.on('failed', (job, err) => {
      logger.error('Email job failed', {
        jobId: job?.id,
        to: job?.data.to,
        error: err.message,
        attempts: job?.attemptsMade,
      });
    });

    // SMS queue events
    this.smsQueue.on('completed', (job, result) => {
      logger.info('SMS job completed', {
        jobId: job.id,
        to: job.data.to,
        messageId: result.messageId,
      });
    });

    this.smsQueue.on('failed', (job, err) => {
      logger.error('SMS job failed', {
        jobId: job?.id,
        to: job?.data.to,
        error: err.message,
        attempts: job?.attemptsMade,
      });
    });

    // Scheduled queue events
    this.scheduledQueue.on('completed', (job) => {
      logger.info('Scheduled notification job completed', {
        jobId: job.id,
        type: job.data.type,
      });
    });

    this.scheduledQueue.on('failed', (job, err) => {
      logger.error('Scheduled notification job failed', {
        jobId: job?.id,
        error: err.message,
      });
    });
  }

  /**
   * Add email job to queue
   *
   * @param data - Email job data
   * @param options - Job options
   * @returns Job instance
   */
  async addEmailJob(
    data: EmailJobData,
    options?: JobOptions
  ): Promise<Job<EmailJobData>> {
    logger.info('Adding email job to queue', {
      to: data.to,
      subject: data.subject,
    });

    return this.emailQueue.add(data, options);
  }

  /**
   * Add SMS job to queue
   *
   * @param data - SMS job data
   * @param options - Job options
   * @returns Job instance
   */
  async addSmsJob(
    data: SmsJobData,
    options?: JobOptions
  ): Promise<Job<SmsJobData>> {
    logger.info('Adding SMS job to queue', {
      to: data.to,
    });

    return this.smsQueue.add(data, options);
  }

  /**
   * Schedule email notification
   *
   * @param data - Email job data
   * @param delay - Delay in milliseconds
   * @returns Job instance
   */
  async scheduleEmail(
    data: EmailJobData,
    delay: number
  ): Promise<Job<any>> {
    logger.info('Scheduling email notification', {
      to: data.to,
      subject: data.subject,
      delay,
    });

    return this.scheduledQueue.add(
      {
        type: 'email',
        data,
      },
      { delay }
    );
  }

  /**
   * Schedule SMS notification
   *
   * @param data - SMS job data
   * @param delay - Delay in milliseconds
   * @returns Job instance
   */
  async scheduleSms(
    data: SmsJobData,
    delay: number
  ): Promise<Job<any>> {
    logger.info('Scheduling SMS notification', {
      to: data.to,
      delay,
    });

    return this.scheduledQueue.add(
      {
        type: 'sms',
        data,
      },
      { delay }
    );
  }

  /**
   * Get email queue stats
   */
  async getEmailQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.emailQueue.getWaitingCount(),
      this.emailQueue.getActiveCount(),
      this.emailQueue.getCompletedCount(),
      this.emailQueue.getFailedCount(),
      this.emailQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Get SMS queue stats
   */
  async getSmsQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.smsQueue.getWaitingCount(),
      this.smsQueue.getActiveCount(),
      this.smsQueue.getCompletedCount(),
      this.smsQueue.getFailedCount(),
      this.smsQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Get scheduled queue stats
   */
  async getScheduledQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.scheduledQueue.getWaitingCount(),
      this.scheduledQueue.getActiveCount(),
      this.scheduledQueue.getCompletedCount(),
      this.scheduledQueue.getFailedCount(),
      this.scheduledQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Pause all queues
   */
  async pauseAll() {
    await Promise.all([
      this.emailQueue.pause(),
      this.smsQueue.pause(),
      this.scheduledQueue.pause(),
    ]);
    logger.info('All notification queues paused');
  }

  /**
   * Resume all queues
   */
  async resumeAll() {
    await Promise.all([
      this.emailQueue.resume(),
      this.smsQueue.resume(),
      this.scheduledQueue.resume(),
    ]);
    logger.info('All notification queues resumed');
  }

  /**
   * Close all queues
   */
  async closeAll() {
    await Promise.all([
      this.emailQueue.close(),
      this.smsQueue.close(),
      this.scheduledQueue.close(),
    ]);
    logger.info('All notification queues closed');
  }

  /**
   * Get queue instances for direct access
   */
  getQueues() {
    return {
      emailQueue: this.emailQueue,
      smsQueue: this.smsQueue,
      scheduledQueue: this.scheduledQueue,
    };
  }
}

// Create singleton instance
let notificationQueues: NotificationQueues | null = null;

/**
 * Get or create notification queues instance
 */
export function getNotificationQueues(): NotificationQueues {
  if (!notificationQueues) {
    notificationQueues = new NotificationQueues();
  }
  return notificationQueues;
}

/**
 * Initialize notification queues
 */
export function initializeQueues(): NotificationQueues {
  return getNotificationQueues();
}

export default {
  NotificationQueues,
  getNotificationQueues,
  initializeQueues,
};
