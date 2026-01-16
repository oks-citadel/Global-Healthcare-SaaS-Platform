/**
 * Services Index
 *
 * Central export point for all API services.
 * This file aggregates and re-exports all service modules for easy importing.
 */

// Authentication & Authorization
export * from "./auth.service.js";
export * from "./mfa.service.js";

// User Management
export * from "./user.service.js";
export * from "./impersonation.service.js";

// Patient & Provider
export * from "./patient.service.js";
export * from "./provider.service.js";

// Clinical
export * from "./appointment.service.js";
export * from "./encounter.service.js";
export * from "./visit.service.js";
export * from "./consent.service.js";
export * from "./document.service.js";

// Billing & Payments
export * from "./billing.service.js";
export * from "./payment.service.js";
export * from "./subscription.service.js";
export * from "./plan.service.js";
export * from "./appointment-billing.service.js";
export * from "./billing-reconciliation.service.js";
export * from "./stripe-webhook.service.js";

// Notifications & Communications
export * from "./notification.service.js";
export * from "./push.service.js";
export * from "./email-templates.service.js";
export * from "./sms-templates.service.js";

// Email service exports (explicit to avoid naming conflicts)
export {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAppointmentConfirmation as sendAppointmentConfirmationEmail,
  sendAppointmentReminder as sendAppointmentReminderEmail,
  sendVisitSummary,
  sendInvoice,
  emailService,
} from "./email.service.js";

// SMS service exports (explicit to avoid naming conflicts)
export {
  sendAppointmentReminder as sendAppointmentReminderSms,
  sendAppointmentConfirmation as sendAppointmentConfirmationSms,
  sendVisitLink,
  sendVerificationCode,
  sendPrescriptionReady,
  sendTestResultsAvailable,
  sendPaymentReminder,
  sendAppointmentCancellation,
  sendAppointmentRescheduled,
  sendPaymentConfirmation,
  sendLabResultsAvailable,
  sendReferralNotification,
  sendMedicationReminder,
  sendEmergencyAlert,
  smsService,
} from "./sms.service.js";

// Scheduling
export * from "./surgical-scheduling.service.js";
export * from "./post-discharge.service.js";

// Infrastructure
export * from "./audit.service.js";
export * from "./cache.service.js";
export * from "./query-optimizer.service.js";

// Real-time
export * from "./webrtc.service.js";
