import { sendEmail } from '../lib/email.js';
import { logger } from '../utils/logger.js';

/**
 * Email Service
 *
 * High-level email service with template-specific methods
 */

const APP_URL = process.env.APP_URL || 'https://unifiedhealth.com';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@unifiedhealth.com';
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+1-800-UNIFIED';
const BILLING_PHONE = process.env.BILLING_PHONE || '+1-800-BILLING';

/**
 * Get common template data
 */
function getCommonData() {
  return {
    appUrl: APP_URL,
    supportEmail: SUPPORT_EMAIL,
    supportPhone: SUPPORT_PHONE,
    billingPhone: BILLING_PHONE,
    year: new Date().getFullYear().toString(),
  };
}

/**
 * Send welcome email to new users
 *
 * @param email - User's email address
 * @param userName - User's name
 */
export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    logger.info('Sending welcome email', { email, userName });

    const result = await sendEmail({
      to: email,
      subject: 'Welcome to UnifiedHealth!',
      templatePath: 'welcome.html',
      templateData: {
        ...getCommonData(),
        email,
        userName,
      },
    });

    if (!result.success) {
      logger.error('Failed to send welcome email', { email, error: result.error });
    }

    return result;
  } catch (error) {
    logger.error('Error sending welcome email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
    });
    throw error;
  }
}

/**
 * Send password reset email
 *
 * @param email - User's email address
 * @param userName - User's name
 * @param resetToken - Password reset token
 */
export async function sendPasswordResetEmail(
  email: string,
  userName: string,
  resetToken: string
) {
  try {
    logger.info('Sending password reset email', { email, userName });

    const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;
    const requestedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const result = await sendEmail({
      to: email,
      subject: 'Reset Your Password - UnifiedHealth',
      templatePath: 'password-reset.html',
      templateData: {
        ...getCommonData(),
        email,
        userName,
        resetUrl,
        requestedAt,
        expiryTime: '1 hour',
      },
    });

    if (!result.success) {
      logger.error('Failed to send password reset email', { email, error: result.error });
    }

    return result;
  } catch (error) {
    logger.error('Error sending password reset email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
    });
    throw error;
  }
}

/**
 * Send appointment confirmation email
 *
 * @param data - Appointment data
 */
export async function sendAppointmentConfirmation(data: {
  email: string;
  patientName: string;
  appointmentId: string;
  providerName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  appointmentType: string;
  isVirtual: boolean;
  location?: string;
  notes?: string;
}) {
  try {
    logger.info('Sending appointment confirmation email', {
      email: data.email,
      appointmentId: data.appointmentId,
    });

    const result = await sendEmail({
      to: data.email,
      subject: `Appointment Confirmed - ${data.appointmentDate}`,
      templatePath: 'appointment-confirmation.html',
      templateData: {
        ...getCommonData(),
        email: data.email,
        ...data,
      },
    });

    if (!result.success) {
      logger.error('Failed to send appointment confirmation email', {
        email: data.email,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment confirmation email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email,
    });
    throw error;
  }
}

/**
 * Send appointment reminder email
 *
 * @param data - Appointment data
 */
export async function sendAppointmentReminder(data: {
  email: string;
  patientName: string;
  appointmentId: string;
  providerName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  appointmentType: string;
  isVirtual: boolean;
  joinUrl?: string;
  location?: string;
  clinicName?: string;
  mapsUrl?: string;
}) {
  try {
    logger.info('Sending appointment reminder email', {
      email: data.email,
      appointmentId: data.appointmentId,
    });

    const result = await sendEmail({
      to: data.email,
      subject: `Reminder: Appointment Tomorrow - ${data.appointmentDate}`,
      templatePath: 'appointment-reminder.html',
      templateData: {
        ...getCommonData(),
        email: data.email,
        ...data,
      },
    });

    if (!result.success) {
      logger.error('Failed to send appointment reminder email', {
        email: data.email,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment reminder email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email,
    });
    throw error;
  }
}

/**
 * Send visit summary email
 *
 * @param data - Visit data
 */
export async function sendVisitSummary(data: {
  email: string;
  patientName: string;
  visitId: string;
  visitDate: string;
  providerName: string;
  providerId: string;
  specialty: string;
  visitType: string;
  diagnosis?: string;
  prescriptions?: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
  labOrders?: string[];
  followUp?: string;
  followUpDate?: string;
  notes?: string;
}) {
  try {
    logger.info('Sending visit summary email', {
      email: data.email,
      visitId: data.visitId,
    });

    const result = await sendEmail({
      to: data.email,
      subject: `Visit Summary - ${data.visitDate}`,
      templatePath: 'visit-summary.html',
      templateData: {
        ...getCommonData(),
        email: data.email,
        ...data,
      },
    });

    if (!result.success) {
      logger.error('Failed to send visit summary email', {
        email: data.email,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending visit summary email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email,
    });
    throw error;
  }
}

/**
 * Send invoice email
 *
 * @param data - Invoice data
 */
export async function sendInvoice(data: {
  email: string;
  patientName: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  visitDate: string;
  providerName: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  items: Array<{
    description: string;
    amount: string;
  }>;
  subtotal: string;
  discount?: string;
  discountPercent?: string;
  tax?: string;
  insuranceCovered?: string;
  totalAmount: string;
  amountDue?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    claimStatus: string;
  };
  isPending?: boolean;
  isPaid?: boolean;
  dueDate?: string;
  paymentDate?: string;
  transactionId?: string;
  paymentUrl?: string;
}) {
  try {
    logger.info('Sending invoice email', {
      email: data.email,
      invoiceId: data.invoiceId,
    });

    // Determine status color
    const statusColor =
      data.paymentStatus === 'paid'
        ? '#48bb78'
        : data.paymentStatus === 'overdue'
        ? '#f56565'
        : '#ed8936';

    const result = await sendEmail({
      to: data.email,
      subject: `Invoice ${data.invoiceNumber} - UnifiedHealth`,
      templatePath: 'invoice.html',
      templateData: {
        ...getCommonData(),
        email: data.email,
        statusColor,
        paymentUrl: data.paymentUrl || `${APP_URL}/invoices/${data.invoiceId}/pay`,
        ...data,
      },
    });

    if (!result.success) {
      logger.error('Failed to send invoice email', {
        email: data.email,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending invoice email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email,
    });
    throw error;
  }
}

export const emailService = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendVisitSummary,
  sendInvoice,
};

export default emailService;
