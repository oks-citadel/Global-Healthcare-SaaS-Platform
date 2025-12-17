/**
 * Push Notification Background Jobs
 *
 * Scheduled tasks for push notification management
 */

import { pushService } from '../services/push.service.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { NotificationType } from '@prisma/client';

/**
 * Send appointment reminders for upcoming appointments
 *
 * This job should run every hour to check for appointments
 * that need reminders (24 hours and 1 hour before)
 */
export async function sendAppointmentReminders() {
  try {
    logger.info('Starting appointment reminder job');

    const now = new Date();

    // Find appointments that need 24-hour reminders
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyFiveHoursFromNow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const appointmentsFor24HrReminder = await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: twentyFourHoursFromNow,
          lt: twentyFiveHoursFromNow,
        },
        status: {
          in: ['scheduled', 'confirmed'],
        },
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
      },
    });

    // Find appointments that need 1-hour reminders
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const appointmentsFor1HrReminder = await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: oneHourFromNow,
          lt: twoHoursFromNow,
        },
        status: {
          in: ['scheduled', 'confirmed'],
        },
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send 24-hour reminders
    let sent24Hr = 0;
    for (const appointment of appointmentsFor24HrReminder) {
      try {
        const formattedDate = appointment.scheduledAt.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        const formattedTime = appointment.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

        await pushService.sendPushNotification(appointment.patient.userId, {
          title: 'Appointment Reminder',
          body: `Your appointment with Dr. ${appointment.provider.user.lastName} is tomorrow at ${formattedTime}`,
          type: 'appointment_reminder' as NotificationType,
          data: {
            appointmentId: appointment.id,
            providerId: appointment.providerId,
            scheduledAt: appointment.scheduledAt.toISOString(),
            action: 'view_appointment',
            deepLink: `/appointments/${appointment.id}`,
          },
        });

        sent24Hr++;
      } catch (error) {
        logger.error('Failed to send 24-hour reminder', {
          error,
          appointmentId: appointment.id,
        });
      }
    }

    // Send 1-hour reminders
    let sent1Hr = 0;
    for (const appointment of appointmentsFor1HrReminder) {
      try {
        const formattedTime = appointment.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

        await pushService.sendPushNotification(appointment.patient.userId, {
          title: 'Appointment Starting Soon',
          body: `Your appointment with Dr. ${appointment.provider.user.lastName} starts in 1 hour at ${formattedTime}`,
          type: 'appointment_reminder' as NotificationType,
          data: {
            appointmentId: appointment.id,
            providerId: appointment.providerId,
            scheduledAt: appointment.scheduledAt.toISOString(),
            action: 'view_appointment',
            deepLink: `/appointments/${appointment.id}`,
            urgent: true,
          },
        });

        sent1Hr++;
      } catch (error) {
        logger.error('Failed to send 1-hour reminder', {
          error,
          appointmentId: appointment.id,
        });
      }
    }

    logger.info({
      sent24Hr,
      sent1Hr,
      total: sent24Hr + sent1Hr,
    }, 'Appointment reminder job completed');

    return { sent24Hr, sent1Hr, total: sent24Hr + sent1Hr };
  } catch (error) {
    logger.error('Appointment reminder job failed', { error });
    throw error;
  }
}

/**
 * Clean up old notifications
 *
 * This job should run daily to remove old read and failed notifications
 */
export async function cleanupOldNotifications() {
  try {
    logger.info('Starting notification cleanup job');

    // Delete read notifications older than 90 days
    const deletedCount = await pushService.deleteOldNotifications(90);

    logger.info({ deletedCount }, 'Notification cleanup job completed');

    return { deletedCount };
  } catch (error) {
    logger.error('Notification cleanup job failed', { error });
    throw error;
  }
}

/**
 * Deactivate stale device tokens
 *
 * This job should run daily to deactivate tokens that haven't been used
 * in over 90 days (likely uninstalled apps or inactive devices)
 */
export async function deactivateStaleTokens() {
  try {
    logger.info('Starting stale token deactivation job');

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.deviceToken.updateMany({
      where: {
        lastUsedAt: {
          lt: ninetyDaysAgo,
        },
        active: true,
      },
      data: {
        active: false,
      },
    });

    logger.info({ deactivatedCount: result.count }, 'Stale token deactivation completed');

    return { deactivatedCount: result.count };
  } catch (error) {
    logger.error('Stale token deactivation job failed', { error });
    throw error;
  }
}

/**
 * Retry failed notifications
 *
 * This job should run every few hours to retry notifications that failed
 * due to temporary issues (e.g., network errors)
 */
export async function retryFailedNotifications() {
  try {
    logger.info('Starting failed notification retry job');

    // Get failed notifications from the last 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const failedNotifications = await prisma.pushNotification.findMany({
      where: {
        status: 'failed',
        createdAt: {
          gte: twentyFourHoursAgo,
        },
        // Only retry notifications that haven't been retried too many times
        // You might want to add a retryCount field to track this
      },
      take: 100, // Limit to prevent overwhelming the system
    });

    let retriedCount = 0;
    let successCount = 0;

    for (const notification of failedNotifications) {
      try {
        await pushService.sendPushNotification(notification.userId, {
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data as Record<string, any> | undefined,
        });

        retriedCount++;
        successCount++;
      } catch (error) {
        logger.error('Failed to retry notification', {
          error,
          notificationId: notification.id,
        });
        retriedCount++;
      }
    }

    logger.info({
      retriedCount,
      successCount,
      failedCount: retriedCount - successCount,
    }, 'Failed notification retry job completed');

    return { retriedCount, successCount, failedCount: retriedCount - successCount };
  } catch (error) {
    logger.error('Failed notification retry job failed', { error });
    throw error;
  }
}

/**
 * Send scheduled notifications
 *
 * This job processes notifications that were delayed due to quiet hours
 */
export async function sendScheduledNotifications() {
  try {
    logger.info('Starting scheduled notification job');

    // Get all pending notifications
    const pendingNotifications = await prisma.pushNotification.findMany({
      where: {
        status: 'pending',
      },
      take: 500, // Process in batches
    });

    let sentCount = 0;
    let skippedCount = 0;

    for (const notification of pendingNotifications) {
      try {
        // Check if user is still in quiet hours
        const deviceTokens = await pushService.getUserDeviceTokens(notification.userId);

        if (deviceTokens.length === 0) {
          // Mark as failed if no devices
          await prisma.pushNotification.update({
            where: { id: notification.id },
            data: {
              status: 'failed',
              failedReason: 'No active device tokens',
            },
          });
          skippedCount++;
          continue;
        }

        // Try to send
        await pushService.sendPushNotification(notification.userId, {
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data as Record<string, any> | undefined,
        });

        sentCount++;
      } catch (error) {
        logger.error('Failed to send scheduled notification', {
          error,
          notificationId: notification.id,
        });
        skippedCount++;
      }
    }

    logger.info({
      sentCount,
      skippedCount,
      total: pendingNotifications.length,
    }, 'Scheduled notification job completed');

    return { sentCount, skippedCount, total: pendingNotifications.length };
  } catch (error) {
    logger.error('Scheduled notification job failed', { error });
    throw error;
  }
}

/**
 * Generate notification metrics report
 *
 * This job should run daily to generate metrics for monitoring
 */
export async function generateNotificationMetrics() {
  try {
    logger.info('Generating notification metrics');

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get notification counts by status
    const statusCounts = await prisma.pushNotification.groupBy({
      by: ['status'],
      _count: true,
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    // Get notification counts by type
    const typeCounts = await prisma.pushNotification.groupBy({
      by: ['type'],
      _count: true,
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    // Get device token counts by platform
    const platformCounts = await prisma.deviceToken.groupBy({
      by: ['platform'],
      _count: true,
      where: {
        active: true,
      },
    });

    // Calculate delivery rate
    const totalSent = statusCounts.find(s => s.status === 'sent')?._count || 0;
    const totalFailed = statusCounts.find(s => s.status === 'failed')?._count || 0;
    const totalNotifications = totalSent + totalFailed;
    const deliveryRate = totalNotifications > 0
      ? ((totalSent / totalNotifications) * 100).toFixed(2)
      : '0';

    const metrics = {
      period: '24h',
      timestamp: new Date().toISOString(),
      notifications: {
        byStatus: statusCounts,
        byType: typeCounts,
        totalSent,
        totalFailed,
        deliveryRate: `${deliveryRate}%`,
      },
      devices: {
        byPlatform: platformCounts,
        totalActive: platformCounts.reduce((sum, p) => sum + p._count, 0),
      },
    };

    logger.info(metrics, 'Notification metrics generated');

    return metrics;
  } catch (error) {
    logger.error('Failed to generate notification metrics', { error });
    throw error;
  }
}

/**
 * Initialize all scheduled jobs
 *
 * This should be called on server startup to register all cron jobs
 */
export function initializeNotificationJobs() {
  // Note: In production, use a proper job scheduler like:
  // - node-cron
  // - Bull (with Redis)
  // - Agenda (with MongoDB)
  // - AWS EventBridge
  // - Google Cloud Scheduler

  logger.info('Initializing notification jobs');

  // Example using node-cron (you need to install it first):
  // import cron from 'node-cron';
  //
  // // Send appointment reminders every hour
  // cron.schedule('0 * * * *', async () => {
  //   await sendAppointmentReminders();
  // });
  //
  // // Clean up old notifications daily at 2 AM
  // cron.schedule('0 2 * * *', async () => {
  //   await cleanupOldNotifications();
  // });
  //
  // // Deactivate stale tokens daily at 3 AM
  // cron.schedule('0 3 * * *', async () => {
  //   await deactivateStaleTokens();
  // });
  //
  // // Retry failed notifications every 6 hours
  // cron.schedule('0 */6 * * *', async () => {
  //   await retryFailedNotifications();
  // });
  //
  // // Send scheduled notifications every 15 minutes
  // cron.schedule('*/15 * * * *', async () => {
  //   await sendScheduledNotifications();
  // });
  //
  // // Generate metrics daily at midnight
  // cron.schedule('0 0 * * *', async () => {
  //   await generateNotificationMetrics();
  // });

  logger.info('Notification jobs initialized');
}

// Export all jobs
export const notificationJobs = {
  sendAppointmentReminders,
  cleanupOldNotifications,
  deactivateStaleTokens,
  retryFailedNotifications,
  sendScheduledNotifications,
  generateNotificationMetrics,
  initializeNotificationJobs,
};

export default notificationJobs;
