import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { sendAppointmentReminder as sendAppointmentReminderEmail } from '../services/email.service.js';
import { sendAppointmentReminder as sendAppointmentReminderSms } from '../services/sms.service.js';
import { getNotificationQueues } from '../lib/queue.js';

/**
 * Notification Scheduler
 *
 * Cron jobs for sending scheduled notifications:
 * - 24-hour appointment reminders
 * - 1-hour virtual visit reminders
 * - Prescription refill reminders
 * - Payment reminders
 */

const prisma = new PrismaClient();
const queues = getNotificationQueues();

/**
 * Send 24-hour appointment reminders
 *
 * Runs every hour to check for appointments in the next 24 hours
 */
export function schedule24HourReminders() {
  // Run every hour
  const task = cron.schedule('0 * * * *', async () => {
    try {
      logger.info('Running 24-hour appointment reminder job');

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000);

      // Find appointments scheduled between 23-24 hours from now
      // that haven't had reminders sent
      const appointments = await prisma.appointment.findMany({
        where: {
          startTime: {
            gte: in23Hours,
            lte: in24Hours,
          },
          status: 'confirmed',
          reminderSent: false,
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

      logger.info(
        { count: appointments.length },
        'Found appointments for 24-hour reminders'
      );

      // Send reminders
      for (const appointment of appointments) {
        try {
          const appointmentDate = appointment.startTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const appointmentTime = appointment.startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          const reminderData = {
            patientName: appointment.patient.user.name,
            appointmentId: appointment.id,
            providerName: appointment.provider.user.name,
            appointmentDate,
            appointmentTime,
            duration: appointment.duration,
            appointmentType: appointment.type,
            isVirtual: appointment.type === 'virtual',
            location: appointment.location || undefined,
            clinicName: appointment.clinicName || undefined,
            joinUrl: appointment.type === 'virtual'
              ? `${process.env.APP_URL}/appointments/${appointment.id}/join`
              : undefined,
            mapsUrl: appointment.location
              ? `https://maps.google.com/?q=${encodeURIComponent(appointment.location)}`
              : undefined,
          };

          // Queue email reminder
          await queues.addEmailJob({
            to: appointment.patient.user.email,
            subject: `Reminder: Appointment Tomorrow - ${appointmentDate}`,
            templatePath: 'appointment-reminder.html',
            templateData: reminderData,
          });

          // Queue SMS reminder if phone number is available
          if (appointment.patient.phoneNumber) {
            await queues.addSmsJob({
              to: appointment.patient.phoneNumber,
              message: await sendAppointmentReminderSms(
                appointment.patient.phoneNumber,
                {
                  patientName: appointment.patient.user.name,
                  providerName: appointment.provider.user.name,
                  appointmentDate,
                  appointmentTime,
                  location: appointment.location || undefined,
                  isVirtual: appointment.type === 'virtual',
                  appointmentId: appointment.id,
                }
              ).then(() => ''), // Convert to message string
            });
          }

          // Mark reminder as sent
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSent: true },
          });

          logger.info(
            { appointmentId: appointment.id },
            'Sent 24-hour appointment reminder'
          );
        } catch (error) {
          logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            appointmentId: appointment.id,
          }, 'Failed to send 24-hour appointment reminder');
        }
      }

      logger.info('Completed 24-hour appointment reminder job');
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Error in 24-hour appointment reminder job');
    }
  });

  logger.info('24-hour appointment reminder job scheduled');
  return task;
}

/**
 * Send 1-hour virtual visit reminders
 *
 * Runs every 15 minutes to check for virtual appointments in the next hour
 */
export function schedule1HourVirtualVisitReminders() {
  // Run every 15 minutes
  const task = cron.schedule('*/15 * * * *', async () => {
    try {
      logger.info('Running 1-hour virtual visit reminder job');

      const now = new Date();
      const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
      const in45Minutes = new Date(now.getTime() + 45 * 60 * 1000);

      // Find virtual appointments scheduled between 45-60 minutes from now
      // that haven't had immediate reminders sent
      const appointments = await prisma.appointment.findMany({
        where: {
          startTime: {
            gte: in45Minutes,
            lte: in1Hour,
          },
          type: 'virtual',
          status: 'confirmed',
          immediateReminderSent: false,
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

      logger.info(
        { count: appointments.length },
        'Found virtual appointments for 1-hour reminders'
      );

      // Send reminders
      for (const appointment of appointments) {
        try {
          const appointmentTime = appointment.startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          const joinUrl = `${process.env.APP_URL}/appointments/${appointment.id}/join`;

          // Queue SMS reminder (more immediate for virtual visits)
          if (appointment.patient.phoneNumber) {
            await queues.addSmsJob({
              to: appointment.patient.phoneNumber,
              message: `Hi ${appointment.patient.user.name}, your virtual visit with Dr. ${appointment.provider.user.name} starts in 1 hour at ${appointmentTime}. Join here: ${joinUrl}`,
            });
          }

          // Also send email with join link
          await queues.addEmailJob({
            to: appointment.patient.user.email,
            subject: `Starting Soon: Virtual Visit at ${appointmentTime}`,
            templatePath: 'appointment-reminder.html',
            templateData: {
              patientName: appointment.patient.user.name,
              appointmentId: appointment.id,
              providerName: appointment.provider.user.name,
              appointmentDate: 'Today',
              appointmentTime,
              duration: appointment.duration,
              appointmentType: appointment.type,
              isVirtual: true,
              joinUrl,
            },
          });

          // Mark immediate reminder as sent
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { immediateReminderSent: true },
          });

          logger.info(
            { appointmentId: appointment.id },
            'Sent 1-hour virtual visit reminder'
          );
        } catch (error) {
          logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            appointmentId: appointment.id,
          }, 'Failed to send 1-hour virtual visit reminder');
        }
      }

      logger.info('Completed 1-hour virtual visit reminder job');
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Error in 1-hour virtual visit reminder job');
    }
  });

  logger.info('1-hour virtual visit reminder job scheduled');
  return task;
}

/**
 * Send prescription refill reminders
 *
 * Runs daily at 9am to check for prescriptions expiring in 7 days
 */
export function schedulePrescriptionRefillReminders() {
  // Run daily at 9:00 AM
  const task = cron.schedule('0 9 * * *', async () => {
    try {
      logger.info('Running prescription refill reminder job');

      const now = new Date();
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

      // Find prescriptions expiring in 7 days
      const prescriptions = await prisma.prescription.findMany({
        where: {
          expiryDate: {
            gte: in6Days,
            lte: in7Days,
          },
          status: 'active',
          refillReminderSent: false,
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
        },
      });

      logger.info(
        { count: prescriptions.length },
        'Found prescriptions for refill reminders'
      );

      // Send reminders
      for (const prescription of prescriptions) {
        try {
          const message = `Hi ${prescription.patient.user.name}, your prescription for ${prescription.medicationName} expires in 7 days. Please request a refill if needed.`;

          // Queue email
          await queues.addEmailJob({
            to: prescription.patient.user.email,
            subject: 'Prescription Refill Reminder',
            html: `<p>${message}</p><p>Visit your dashboard to request a refill: ${process.env.APP_URL}/prescriptions</p>`,
          });

          // Queue SMS if phone available
          if (prescription.patient.phoneNumber) {
            await queues.addSmsJob({
              to: prescription.patient.phoneNumber,
              message: message + ` Refill at: ${process.env.APP_URL}/prescriptions/${prescription.id}/refill`,
            });
          }

          // Mark reminder as sent
          await prisma.prescription.update({
            where: { id: prescription.id },
            data: { refillReminderSent: true },
          });

          logger.info(
            { prescriptionId: prescription.id },
            'Sent prescription refill reminder'
          );
        } catch (error) {
          logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            prescriptionId: prescription.id,
          }, 'Failed to send prescription refill reminder');
        }
      }

      logger.info('Completed prescription refill reminder job');
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Error in prescription refill reminder job');
    }
  });

  logger.info('Prescription refill reminder job scheduled');
  return task;
}

/**
 * Send payment reminders
 *
 * Runs daily at 10am to check for overdue invoices
 */
export function schedulePaymentReminders() {
  // Run daily at 10:00 AM
  const task = cron.schedule('0 10 * * *', async () => {
    try {
      logger.info('Running payment reminder job');

      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Find overdue invoices
      const invoices = await prisma.invoice.findMany({
        where: {
          dueDate: {
            lt: now,
            gte: yesterday,
          },
          status: 'pending',
          reminderSent: false,
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
        },
      });

      logger.info(
        { count: invoices.length },
        'Found overdue invoices for payment reminders'
      );

      // Send reminders
      for (const invoice of invoices) {
        try {
          const dueDate = invoice.dueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Queue email
          await queues.addEmailJob({
            to: invoice.patient.user.email,
            subject: `Payment Reminder - Invoice ${invoice.invoiceNumber}`,
            templatePath: 'invoice.html',
            templateData: {
              patientName: invoice.patient.user.name,
              invoiceId: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              invoiceDate: invoice.createdAt.toLocaleDateString(),
              visitDate: invoice.visitDate?.toLocaleDateString() || 'N/A',
              providerName: 'UnifiedHealth',
              paymentStatus: 'overdue',
              items: invoice.items as any,
              subtotal: invoice.subtotal.toString(),
              totalAmount: invoice.total.toString(),
              amountDue: invoice.amountDue.toString(),
              isPending: true,
              dueDate,
            },
          });

          // Queue SMS if phone available
          if (invoice.patient.phoneNumber) {
            await queues.addSmsJob({
              to: invoice.patient.phoneNumber,
              message: `Hi ${invoice.patient.user.name}, your payment of $${invoice.amountDue} is overdue. Please pay at: ${process.env.APP_URL}/invoices/${invoice.id}/pay`,
            });
          }

          // Mark reminder as sent
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { reminderSent: true },
          });

          logger.info(
            { invoiceId: invoice.id },
            'Sent payment reminder'
          );
        } catch (error) {
          logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            invoiceId: invoice.id,
          }, 'Failed to send payment reminder');
        }
      }

      logger.info('Completed payment reminder job');
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Error in payment reminder job');
    }
  });

  logger.info('Payment reminder job scheduled');
  return task;
}

/**
 * Start all scheduled jobs
 */
export function startAllScheduledJobs() {
  logger.info('Starting all scheduled notification jobs');

  const tasks = {
    appointmentReminders: schedule24HourReminders(),
    virtualVisitReminders: schedule1HourVirtualVisitReminders(),
    prescriptionRefills: schedulePrescriptionRefillReminders(),
    paymentReminders: schedulePaymentReminders(),
  };

  logger.info('All scheduled notification jobs started');

  return tasks;
}

/**
 * Stop all scheduled jobs
 */
export function stopAllScheduledJobs(tasks: Record<string, cron.ScheduledTask>) {
  logger.info('Stopping all scheduled notification jobs');

  Object.entries(tasks).forEach(([name, task]) => {
    task.stop();
    logger.info({ jobName: name }, 'Stopped scheduled job');
  });

  logger.info('All scheduled notification jobs stopped');
}

export default {
  schedule24HourReminders,
  schedule1HourVirtualVisitReminders,
  schedulePrescriptionRefillReminders,
  schedulePaymentReminders,
  startAllScheduledJobs,
  stopAllScheduledJobs,
};
