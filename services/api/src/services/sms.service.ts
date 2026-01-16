import { sendSms } from '../lib/aws-sms.js';
import { logger } from '../utils/logger.js';

/**
 * SMS Service
 *
 * High-level SMS service with message templates
 */

const APP_URL = process.env.APP_URL || 'https://theunifiedhealth.com';
const APP_NAME = process.env.APP_NAME || 'Unified Health';

/**
 * Send appointment reminder SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Appointment data
 */
export async function sendAppointmentReminder(
  phoneNumber: string,
  data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    location?: string;
    isVirtual: boolean;
    appointmentId: string;
  }
) {
  try {
    logger.info('Sending appointment reminder SMS', {
      phoneNumber,
      appointmentId: data.appointmentId,
    });

    let message = `Hi ${data.patientName}, this is a reminder about your appointment with Dr. ${data.providerName} on ${data.appointmentDate} at ${data.appointmentTime}.`;

    if (data.isVirtual) {
      message += ` This is a virtual visit. Join at: ${APP_URL}/appointments/${data.appointmentId}/join`;
    } else if (data.location) {
      message += ` Location: ${data.location}.`;
    }

    message += ` Reply CONFIRM to confirm or call us to reschedule. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send appointment reminder SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment reminder SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send virtual visit link SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Visit data
 */
export async function sendVisitLink(
  phoneNumber: string,
  data: {
    patientName: string;
    providerName: string;
    appointmentId: string;
    startTime?: string;
  }
) {
  try {
    logger.info('Sending visit link SMS', {
      phoneNumber,
      appointmentId: data.appointmentId,
    });

    const joinUrl = `${APP_URL}/appointments/${data.appointmentId}/join`;
    let message = `Hi ${data.patientName}, your virtual visit with Dr. ${data.providerName}`;

    if (data.startTime) {
      message += ` starts at ${data.startTime}`;
    } else {
      message += ` is ready`;
    }

    message += `. Join here: ${joinUrl} - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send visit link SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending visit link SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send verification code SMS
 *
 * @param phoneNumber - User's phone number
 * @param verificationCode - Verification code
 */
export async function sendVerificationCode(
  phoneNumber: string,
  verificationCode: string
) {
  try {
    logger.info('Sending verification code SMS', { phoneNumber });

    const message = `Your ${APP_NAME} verification code is: ${verificationCode}. This code will expire in 10 minutes. Do not share this code with anyone.`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send verification code SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending verification code SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send appointment confirmation SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Appointment data
 */
export async function sendAppointmentConfirmation(
  phoneNumber: string,
  data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentId: string;
  }
) {
  try {
    logger.info('Sending appointment confirmation SMS', {
      phoneNumber,
      appointmentId: data.appointmentId,
    });

    const message = `Hi ${data.patientName}, your appointment with Dr. ${data.providerName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}. View details: ${APP_URL}/appointments/${data.appointmentId} - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send appointment confirmation SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment confirmation SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send prescription ready notification SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Prescription data
 */
export async function sendPrescriptionReady(
  phoneNumber: string,
  data: {
    patientName: string;
    pharmacyName: string;
    prescriptionName: string;
  }
) {
  try {
    logger.info('Sending prescription ready SMS', { phoneNumber });

    const message = `Hi ${data.patientName}, your prescription for ${data.prescriptionName} is ready for pickup at ${data.pharmacyName}. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send prescription ready SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending prescription ready SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send test results available SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param patientName - Patient's name
 */
export async function sendTestResultsAvailable(
  phoneNumber: string,
  patientName: string
) {
  try {
    logger.info('Sending test results available SMS', { phoneNumber });

    const message = `Hi ${patientName}, your test results are now available. Log in to ${APP_URL} to view them securely. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send test results SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending test results SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send payment reminder SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Payment data
 */
export async function sendPaymentReminder(
  phoneNumber: string,
  data: {
    patientName: string;
    amount: string;
    dueDate: string;
    invoiceId: string;
  }
) {
  try {
    logger.info('Sending payment reminder SMS', {
      phoneNumber,
      invoiceId: data.invoiceId,
    });

    const message = `Hi ${data.patientName}, you have an outstanding balance of ${data.amount} due by ${data.dueDate}. Pay now: ${APP_URL}/invoices/${data.invoiceId}/pay - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send payment reminder SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending payment reminder SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send appointment cancellation SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Appointment data
 */
export async function sendAppointmentCancellation(
  phoneNumber: string,
  data: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
  }
) {
  try {
    logger.info('Sending appointment cancellation SMS', { phoneNumber });

    let message = `Hi ${data.patientName}, your appointment with Dr. ${data.providerName} on ${data.appointmentDate} at ${data.appointmentTime} has been cancelled.`;

    if (data.reason) {
      message += ` Reason: ${data.reason}.`;
    }

    message += ` To reschedule, visit ${APP_URL} or call us. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send appointment cancellation SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment cancellation SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send appointment rescheduled SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Appointment data
 */
export async function sendAppointmentRescheduled(
  phoneNumber: string,
  data: {
    patientName: string;
    providerName: string;
    oldDate: string;
    oldTime: string;
    newDate: string;
    newTime: string;
    appointmentId: string;
  }
) {
  try {
    logger.info('Sending appointment rescheduled SMS', {
      phoneNumber,
      appointmentId: data.appointmentId,
    });

    const message = `Hi ${data.patientName}, your appointment with Dr. ${data.providerName} has been rescheduled from ${data.oldDate} at ${data.oldTime} to ${data.newDate} at ${data.newTime}. View details: ${APP_URL}/appointments/${data.appointmentId} - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send appointment rescheduled SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending appointment rescheduled SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send payment confirmation SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Payment data
 */
export async function sendPaymentConfirmation(
  phoneNumber: string,
  data: {
    patientName: string;
    amount: string;
    transactionId: string;
    paymentDate: string;
  }
) {
  try {
    logger.info('Sending payment confirmation SMS', {
      phoneNumber,
      transactionId: data.transactionId,
    });

    const message = `Hi ${data.patientName}, we have received your payment of ${data.amount} on ${data.paymentDate}. Transaction ID: ${data.transactionId}. Thank you! - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send payment confirmation SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending payment confirmation SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send lab results available SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Lab results data
 */
export async function sendLabResultsAvailable(
  phoneNumber: string,
  data: {
    patientName: string;
    testName?: string;
  }
) {
  try {
    logger.info('Sending lab results available SMS', { phoneNumber });

    let message = `Hi ${data.patientName}, `;

    if (data.testName) {
      message += `your ${data.testName} results are `;
    } else {
      message += `your lab results are `;
    }

    message += `now available. Log in to ${APP_URL} to view them securely. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send lab results SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending lab results SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send referral notification SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Referral data
 */
export async function sendReferralNotification(
  phoneNumber: string,
  data: {
    patientName: string;
    specialistName: string;
    specialty: string;
  }
) {
  try {
    logger.info('Sending referral notification SMS', { phoneNumber });

    const message = `Hi ${data.patientName}, you have been referred to ${data.specialistName} (${data.specialty}). They will contact you shortly to schedule an appointment. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send referral notification SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending referral notification SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send medication reminder SMS
 *
 * @param phoneNumber - Patient's phone number
 * @param data - Medication data
 */
export async function sendMedicationReminder(
  phoneNumber: string,
  data: {
    patientName: string;
    medicationName: string;
    dosage: string;
    time: string;
  }
) {
  try {
    logger.info('Sending medication reminder SMS', { phoneNumber });

    const message = `Hi ${data.patientName}, reminder to take your ${data.medicationName} (${data.dosage}) at ${data.time}. - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send medication reminder SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending medication reminder SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

/**
 * Send emergency alert SMS
 *
 * @param phoneNumber - Phone number to send alert
 * @param data - Emergency data
 */
export async function sendEmergencyAlert(
  phoneNumber: string,
  data: {
    recipientName: string;
    patientName: string;
    alertType: string;
    message: string;
    contactNumber?: string;
  }
) {
  try {
    logger.info('Sending emergency alert SMS', { phoneNumber });

    let message = `URGENT: ${data.recipientName}, ${data.patientName} - ${data.alertType}: ${data.message}`;

    if (data.contactNumber) {
      message += ` Contact: ${data.contactNumber}`;
    }

    message += ` - ${APP_NAME}`;

    const result = await sendSms({
      to: phoneNumber,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send emergency alert SMS', {
        phoneNumber,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending emergency alert SMS', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phoneNumber,
    });
    throw error;
  }
}

export const smsService = {
  sendAppointmentReminder,
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendAppointmentRescheduled,
  sendVisitLink,
  sendVerificationCode,
  sendPrescriptionReady,
  sendTestResultsAvailable,
  sendLabResultsAvailable,
  sendPaymentReminder,
  sendPaymentConfirmation,
  sendReferralNotification,
  sendMedicationReminder,
  sendEmergencyAlert,
};

export default smsService;
