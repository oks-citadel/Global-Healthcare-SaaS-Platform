/**
 * Push Notification Integration Examples
 *
 * This file demonstrates how to integrate push notifications
 * into various services of the Unified Health platform.
 */

import { pushService } from '../services/push.service.js';
import { NotificationType } from '../generated/client';
import { logger } from '../utils/logger.js';

/**
 * Example 1: Send Appointment Confirmation
 *
 * Send a push notification when an appointment is created
 */
export async function sendAppointmentConfirmation(
  userId: string,
  appointmentData: {
    id: string;
    providerName: string;
    scheduledAt: Date;
    type: string;
  }
) {
  try {
    const formattedDate = appointmentData.scheduledAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = appointmentData.scheduledAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    await pushService.sendPushNotification(userId, {
      title: 'Appointment Confirmed',
      body: `Your appointment with ${appointmentData.providerName} is scheduled for ${formattedDate} at ${formattedTime}`,
      type: 'appointment_confirmation' as NotificationType,
      data: {
        appointmentId: appointmentData.id,
        action: 'view_appointment',
        deepLink: `/appointments/${appointmentData.id}`,
      },
    });

    logger.info('Appointment confirmation sent', { userId, appointmentId: appointmentData.id });
  } catch (error) {
    logger.error('Failed to send appointment confirmation', { error, userId });
    // Don't throw - notification failure shouldn't break appointment creation
  }
}

/**
 * Example 2: Send Appointment Reminder (Scheduled Job)
 *
 * Send reminders 24 hours and 1 hour before appointments
 */
export async function sendAppointmentReminders() {
  try {
    const { prisma } = await import('../lib/prisma.js');

    // Find appointments in the next 24-25 hours (24hr reminder)
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);

    const tomorrowEnd = new Date();
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 25);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: tomorrow,
          lte: tomorrowEnd,
        },
        status: 'scheduled',
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

    // Send reminders
    for (const appointment of upcomingAppointments) {
      await pushService.sendPushNotification(appointment.patient.userId, {
        title: 'Appointment Reminder',
        body: `Your appointment with Dr. ${appointment.provider.user.lastName} is tomorrow at ${appointment.scheduledAt.toLocaleTimeString()}`,
        type: 'appointment_reminder' as NotificationType,
        data: {
          appointmentId: appointment.id,
          action: 'view_appointment',
          deepLink: `/appointments/${appointment.id}`,
        },
      });
    }

    logger.info('Appointment reminders sent', { count: upcomingAppointments.length });
  } catch (error) {
    logger.error('Failed to send appointment reminders', { error });
  }
}

/**
 * Example 3: Send Message Received Notification
 *
 * Notify user when they receive a chat message during a visit
 */
export async function notifyMessageReceived(
  recipientUserId: string,
  senderName: string,
  messagePreview: string,
  visitId: string
) {
  try {
    await pushService.sendPushNotification(recipientUserId, {
      title: `Message from ${senderName}`,
      body: messagePreview.substring(0, 100),
      type: 'message_received' as NotificationType,
      data: {
        visitId,
        action: 'open_chat',
        deepLink: `/visits/${visitId}/chat`,
      },
    });
  } catch (error) {
    logger.error('Failed to send message notification', { error, recipientUserId });
  }
}

/**
 * Example 4: Send Lab Results Available Notification
 *
 * Notify patient when lab results are ready
 */
export async function notifyLabResultsAvailable(
  patientUserId: string,
  labTestName: string,
  documentId: string
) {
  try {
    await pushService.sendPushNotification(patientUserId, {
      title: 'Lab Results Available',
      body: `Your ${labTestName} results are now available for review`,
      type: 'lab_results_available' as NotificationType,
      data: {
        documentId,
        action: 'view_results',
        deepLink: `/documents/${documentId}`,
      },
    });
  } catch (error) {
    logger.error('Failed to send lab results notification', { error, patientUserId });
  }
}

/**
 * Example 5: Send Prescription Ready Notification
 *
 * Notify patient when prescription is ready for pickup
 */
export async function notifyPrescriptionReady(
  patientUserId: string,
  prescriptionDetails: {
    medicationName: string;
    pharmacy: string;
  }
) {
  try {
    await pushService.sendPushNotification(patientUserId, {
      title: 'Prescription Ready',
      body: `Your prescription for ${prescriptionDetails.medicationName} is ready for pickup at ${prescriptionDetails.pharmacy}`,
      type: 'prescription_ready' as NotificationType,
      data: {
        action: 'view_prescription',
        deepLink: '/prescriptions',
      },
    });
  } catch (error) {
    logger.error('Failed to send prescription notification', { error, patientUserId });
  }
}

/**
 * Example 6: Send Payment Due Reminder
 *
 * Remind user about upcoming payment
 */
export async function sendPaymentReminder(
  userId: string,
  paymentDetails: {
    amount: number;
    dueDate: Date;
    invoiceId: string;
  }
) {
  try {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(paymentDetails.amount);

    const formattedDate = paymentDetails.dueDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });

    await pushService.sendPushNotification(userId, {
      title: 'Payment Reminder',
      body: `Your payment of ${formattedAmount} is due on ${formattedDate}`,
      type: 'payment_due' as NotificationType,
      data: {
        invoiceId: paymentDetails.invoiceId,
        amount: paymentDetails.amount,
        action: 'make_payment',
        deepLink: `/invoices/${paymentDetails.invoiceId}`,
      },
    });
  } catch (error) {
    logger.error('Failed to send payment reminder', { error, userId });
  }
}

/**
 * Example 7: Send Payment Confirmation
 *
 * Confirm successful payment
 */
export async function sendPaymentConfirmation(
  userId: string,
  paymentDetails: {
    amount: number;
    transactionId: string;
  }
) {
  try {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(paymentDetails.amount);

    await pushService.sendPushNotification(userId, {
      title: 'Payment Received',
      body: `Your payment of ${formattedAmount} has been processed successfully`,
      type: 'payment_received' as NotificationType,
      data: {
        transactionId: paymentDetails.transactionId,
        amount: paymentDetails.amount,
        action: 'view_receipt',
        deepLink: `/payments/${paymentDetails.transactionId}`,
      },
    });
  } catch (error) {
    logger.error('Failed to send payment confirmation', { error, userId });
  }
}

/**
 * Example 8: Send Appointment Cancellation
 *
 * Notify user when appointment is cancelled
 */
export async function notifyAppointmentCancelled(
  userId: string,
  appointmentData: {
    id: string;
    providerName: string;
    scheduledAt: Date;
    cancellationReason?: string;
  }
) {
  try {
    const formattedDate = appointmentData.scheduledAt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const body = appointmentData.cancellationReason
      ? `Your appointment with ${appointmentData.providerName} on ${formattedDate} has been cancelled. Reason: ${appointmentData.cancellationReason}`
      : `Your appointment with ${appointmentData.providerName} on ${formattedDate} has been cancelled`;

    await pushService.sendPushNotification(userId, {
      title: 'Appointment Cancelled',
      body,
      type: 'appointment_cancelled' as NotificationType,
      data: {
        appointmentId: appointmentData.id,
        action: 'book_new_appointment',
        deepLink: '/appointments/book',
      },
    });
  } catch (error) {
    logger.error('Failed to send cancellation notification', { error, userId });
  }
}

/**
 * Example 9: Batch Notification for System Maintenance
 *
 * Notify all users about scheduled maintenance
 */
export async function notifySystemMaintenance(
  maintenanceDetails: {
    startTime: Date;
    endTime: Date;
    affectedServices: string[];
  }
) {
  try {
    const { prisma } = await import('../lib/prisma.js');

    // Get all active users
    const activeUsers = await prisma.user.findMany({
      where: { status: 'active' },
      select: { id: true },
    });

    const userIds = activeUsers.map(u => u.id);

    const formattedStart = maintenanceDetails.startTime.toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    await pushService.sendBatchPushNotifications(userIds, {
      title: 'Scheduled Maintenance',
      body: `The system will be unavailable starting ${formattedStart} for scheduled maintenance`,
      type: 'general' as NotificationType,
      data: {
        maintenanceStart: maintenanceDetails.startTime.toISOString(),
        maintenanceEnd: maintenanceDetails.endTime.toISOString(),
        affectedServices: maintenanceDetails.affectedServices,
      },
    });

    logger.info('System maintenance notifications sent', { userCount: userIds.length });
  } catch (error) {
    logger.error('Failed to send maintenance notifications', { error });
  }
}

/**
 * Example 10: Conditional Notification Based on User Preferences
 *
 * Check preferences before sending
 */
export async function sendConditionalNotification(
  userId: string,
  notification: {
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, any>;
  }
) {
  try {
    // Get user preferences
    const preferences = await pushService.getNotificationPreferences(userId);

    // Check if push is enabled
    if (!preferences.pushEnabled) {
      logger.info('Push notifications disabled for user', { userId });
      return;
    }

    // Check type-specific preferences
    const typeEnabled = checkNotificationTypeEnabled(preferences, notification.type);
    if (!typeEnabled) {
      logger.info('Notification type disabled for user', { userId, type: notification.type });
      return;
    }

    // Send notification (service will check quiet hours)
    await pushService.sendPushNotification(userId, notification);
  } catch (error) {
    logger.error('Failed to send conditional notification', { error, userId });
  }
}

/**
 * Helper function to check if notification type is enabled
 */
function checkNotificationTypeEnabled(
  preferences: any,
  type: NotificationType
): boolean {
  const typeMap: Record<string, keyof typeof preferences> = {
    appointment_reminder: 'appointmentReminders',
    appointment_confirmation: 'appointmentReminders',
    appointment_cancelled: 'appointmentReminders',
    message_received: 'messageAlerts',
    prescription_ready: 'prescriptionAlerts',
    lab_results_available: 'labResultAlerts',
    payment_due: 'paymentAlerts',
    payment_received: 'paymentAlerts',
    general: 'pushEnabled',
  };

  const preferenceKey = typeMap[type];
  return preferenceKey ? preferences[preferenceKey] : true;
}

/**
 * Example 11: Integration with Appointment Service
 *
 * Complete example showing integration in appointment service
 */
export class AppointmentServiceWithNotifications {
  async createAppointment(appointmentData: any) {
    const { prisma } = await import('../lib/prisma.js');

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    // Send confirmation notification
    await sendAppointmentConfirmation(
      appointment.patient.userId,
      {
        id: appointment.id,
        providerName: `Dr. ${appointment.provider.user.lastName}`,
        scheduledAt: appointment.scheduledAt,
        type: appointment.type,
      }
    );

    return appointment;
  }

  async cancelAppointment(appointmentId: string, cancellationReason?: string) {
    const { prisma } = await import('../lib/prisma.js');

    // Get appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'cancelled' },
    });

    // Send cancellation notification
    await notifyAppointmentCancelled(
      appointment.patient.userId,
      {
        id: appointment.id,
        providerName: `Dr. ${appointment.provider.user.lastName}`,
        scheduledAt: appointment.scheduledAt,
        cancellationReason,
      }
    );

    return updatedAppointment;
  }
}

/**
 * Example 12: Scheduled Job for Reminders
 *
 * Cron job to send appointment reminders
 */
export async function scheduleAppointmentReminders() {
  // This would be called by a cron job or scheduler
  // Example using node-cron:
  // cron.schedule('0 9 * * *', async () => {
  //   await sendAppointmentReminders();
  // });

  await sendAppointmentReminders();
}

// Export all examples
export default {
  sendAppointmentConfirmation,
  sendAppointmentReminders,
  notifyMessageReceived,
  notifyLabResultsAvailable,
  notifyPrescriptionReady,
  sendPaymentReminder,
  sendPaymentConfirmation,
  notifyAppointmentCancelled,
  notifySystemMaintenance,
  sendConditionalNotification,
  AppointmentServiceWithNotifications,
  scheduleAppointmentReminders,
};
