// @ts-nocheck
import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';
import { authController } from '../controllers/auth.controller.js';
import { userController } from '../controllers/user.controller.js';
import { patientController } from '../controllers/patient.controller.js';
import { encounterController } from '../controllers/encounter.controller.js';
import { documentController } from '../controllers/document.controller.js';
import { appointmentController } from '../controllers/appointment.controller.js';
import { visitController } from '../controllers/visit.controller.js';
import { planController } from '../controllers/plan.controller.js';
import { subscriptionController } from '../controllers/subscription.controller.js';
import { auditController } from '../controllers/audit.controller.js';
import { consentController } from '../controllers/consent.controller.js';
import { notificationController } from '../controllers/notification.controller.js';
import { paymentController } from '../controllers/payment.controller.js';
import { pushController } from '../controllers/push.controller.js';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate, authorize, requireSubscription, requireEmailVerified } from '../middleware/auth.middleware.js';
import { stripeWebhookIdempotency, webhookIdempotency } from '../middleware/idempotency.middleware.js';
import stripeWebhookRouter from './webhooks/stripe.js';
import { premiumRoutes } from './premium.routes.js';
import { postDischargeRoutes } from './post-discharge.routes.js';
import { surgicalRoutes } from './surgical.routes.js';

const router = Router();

// ==========================================
// Platform & System Endpoints
// ==========================================
router.get('/version', healthController.getVersion);
router.get('/config/public', healthController.getPublicConfig);

// ==========================================
// Dashboard Endpoints
// ==========================================
router.get('/dashboard/stats', authenticate, dashboardController.getStats);
router.get('/dashboard/quick-actions', authenticate, dashboardController.getQuickActions);

// ==========================================
// Auth Endpoints
// ==========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.me);

// ==========================================
// Roles Endpoint
// ==========================================
router.get('/roles', authenticate, authorize('admin'), authController.getRoles);

// ==========================================
// User Endpoints
// ==========================================
router.get('/users/:id', authenticate, userController.getUser);
router.patch('/users/:id', authenticate, userController.updateUser);

// ==========================================
// GDPR Data Subject Rights Endpoints
// ==========================================
// Article 20: Right to data portability
router.get('/users/me/export', authenticate, userController.exportUserData);
// Article 17: Right to erasure
router.delete('/users/me', authenticate, userController.deleteAccount);

// ==========================================
// Patient Endpoints
// ==========================================
router.post('/patients', authenticate, patientController.createPatient);
router.get('/patients/:id', authenticate, patientController.getPatient);
router.patch('/patients/:id', authenticate, patientController.updatePatient);

// ==========================================
// Encounter Endpoints
// ==========================================
router.post('/encounters', authenticate, authorize('provider', 'admin'), encounterController.createEncounter);
router.get('/encounters', authenticate, encounterController.listEncounters);
router.get('/encounters/:id', authenticate, encounterController.getEncounter);
router.patch('/encounters/:id', authenticate, authorize('provider', 'admin'), encounterController.updateEncounter);
router.post('/encounters/:id/notes', authenticate, authorize('provider', 'admin'), encounterController.addClinicalNote);
router.get('/encounters/:id/notes', authenticate, encounterController.getClinicalNotes);
router.post('/encounters/:id/start', authenticate, authorize('provider', 'admin'), encounterController.startEncounter);
router.post('/encounters/:id/end', authenticate, authorize('provider', 'admin'), encounterController.endEncounter);

// ==========================================
// Document Endpoints
// ==========================================
router.post('/documents', authenticate, documentController.uploadDocument);
router.get('/documents', authenticate, documentController.listDocuments);
router.get('/documents/:id', authenticate, documentController.getDocument);
router.get('/documents/:id/download', authenticate, documentController.getDownloadUrl);
router.delete('/documents/:id', authenticate, documentController.deleteDocument);
router.get('/patients/:patientId/documents', authenticate, documentController.getPatientDocuments);

// ==========================================
// Appointment Endpoints (Subscription Required)
// ==========================================
router.post('/appointments', authenticate, requireSubscription, appointmentController.createAppointment);
router.get('/appointments', authenticate, appointmentController.listAppointments);
router.get('/appointments/pricing', authenticate, appointmentController.getAppointmentPrice);
router.get('/appointments/:id', authenticate, appointmentController.getAppointment);
router.patch('/appointments/:id', authenticate, requireSubscription, appointmentController.updateAppointment);
router.delete('/appointments/:id', authenticate, appointmentController.deleteAppointment);

// ==========================================
// Appointment Billing Endpoints
// ==========================================
router.post('/appointments/:id/payment', authenticate, appointmentController.createAppointmentPayment);
router.get('/appointments/:id/payment', authenticate, appointmentController.getAppointmentPayment);
router.post('/appointments/:id/payment/confirm', authenticate, appointmentController.confirmAppointmentPayment);
router.post('/appointments/:id/payment/refund', authenticate, authorize('admin'), appointmentController.refundAppointmentPayment);
router.post('/appointments/:id/billing/complete', authenticate, authorize('provider', 'admin'), appointmentController.completeAppointmentBilling);
router.get('/appointments/:id/billing/summary', authenticate, appointmentController.getAppointmentBillingSummary);

// ==========================================
// Visit Endpoints
// ==========================================
router.post('/visits/:id/start', authenticate, visitController.startVisit);
router.post('/visits/:id/end', authenticate, visitController.endVisit);
router.post('/visits/:id/chat', authenticate, visitController.sendChatMessage);

// ==========================================
// Plan Endpoints
// ==========================================
router.get('/plans', planController.listPlans);

// ==========================================
// Subscription Endpoints
// ==========================================
router.post('/subscriptions', authenticate, subscriptionController.createSubscription);
router.delete('/subscriptions/:id', authenticate, subscriptionController.cancelSubscription);

// ==========================================
// Billing Webhook (Stripe) - Legacy
// ==========================================
router.post('/billing/webhook', stripeWebhookIdempotency(), subscriptionController.handleWebhook);

// ==========================================
// Stripe Webhooks (Dedicated Route)
// ==========================================
// IMPORTANT: This route requires raw body parsing
// Configure in your main app.ts before JSON parsing:
// app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
router.use('/webhooks/stripe', stripeWebhookRouter);

// ==========================================
// Internal Billing Endpoints (Service-to-Service)
// ==========================================
// Telehealth service billing webhook - receives billing events from telehealth service
// Uses idempotency based on visitId header to prevent duplicate billing
router.post(
  '/billing/telehealth-visit',
  webhookIdempotency({
    source: 'telehealth',
    getEventId: (req) => req.body?.visitId || req.headers['x-visit-id'] as string || null,
    getEventType: () => 'telehealth-billing',
    markProcessedImmediately: false,
  }),
  async (req, res) => {
  try {
    const serviceKey = req.headers['x-service-key'];
    const expectedKey = process.env.SERVICE_API_KEY;

    // Verify service-to-service authentication
    if (!expectedKey || serviceKey !== expectedKey) {
      res.status(401).json({ error: 'Unauthorized service request' });
      return;
    }

    const {
      visitId,
      appointmentId,
      patientId,
      providerId,
      durationMinutes,
      completedAt,
      billable,
    } = req.body;

    if (!billable) {
      res.json({ success: true, message: 'Visit not billable, skipped' });
      return;
    }

    // Import appointment billing service and process the billing
    const { appointmentBillingService } = await import('../services/appointment-billing.service.js');
    const { logger } = await import('../utils/logger.js');

    logger.info('Telehealth billing event received', {
      visitId,
      appointmentId,
      durationMinutes,
    });

    // Complete the appointment billing
    const billingResult = await appointmentBillingService.completeAppointmentBilling(
      patientId,
      {
        appointmentId,
        appointmentType: 'video',
        durationMinutes,
        providerId,
      }
    );

    // Mark event as processed after successful billing
    if (req.webhookIdempotency?.markAsProcessed) {
      await req.webhookIdempotency.markAsProcessed();
    }

    logger.info('Telehealth billing completed', {
      visitId,
      appointmentId,
      paymentId: billingResult.payment?.id,
    });

    res.json({
      success: true,
      message: 'Telehealth visit billed successfully',
      billingResult,
    });
  } catch (error: any) {
    const { logger } = await import('../utils/logger.js');
    logger.error('Telehealth billing error', { error: error.message });
    res.status(500).json({
      error: 'Billing failed',
      message: error.message,
    });
  }
});

// ==========================================
// Payment Endpoints (Stripe)
// ==========================================
router.get('/payments/config', paymentController.getConfig);
router.post('/payments/setup-intent', authenticate, paymentController.createSetupIntent);
router.post('/payments/subscription', authenticate, paymentController.createSubscription);
router.get('/payments/subscription', authenticate, paymentController.getCurrentSubscription);
router.delete('/payments/subscription', authenticate, paymentController.cancelSubscription);
router.post('/payments/payment-method', authenticate, paymentController.updatePaymentMethod);
router.post('/payments/payment-method/save', authenticate, paymentController.savePaymentMethod);
router.get('/payments/payment-methods', authenticate, paymentController.getPaymentMethods);
router.delete('/payments/payment-method/:id', authenticate, paymentController.removePaymentMethod);
router.post('/payments/charge', authenticate, paymentController.createCharge);
router.get('/payments/history', authenticate, paymentController.getPaymentHistory);
router.get('/payments/:id', authenticate, paymentController.getPayment);
router.post('/payments/:id/refund', authenticate, paymentController.refundPayment);
router.get('/payments/invoices', authenticate, paymentController.getInvoices);
router.post('/payments/webhook', stripeWebhookIdempotency(), paymentController.handleWebhook);

// ==========================================
// Notification Endpoints
// ==========================================
router.post('/notifications/email', authenticate, authorize('admin'), notificationController.sendEmail);
router.post('/notifications/sms', authenticate, authorize('admin'), notificationController.sendSms);
router.post('/notifications/email/batch', authenticate, authorize('admin'), notificationController.sendBatchEmail);
router.post('/notifications/sms/batch', authenticate, authorize('admin'), notificationController.sendBatchSms);
router.get('/notifications/sms/:id/status', authenticate, authorize('admin'), notificationController.getSmsStatus);

// ==========================================
// Audit Endpoints
// ==========================================
router.get('/audit/events', authenticate, authorize('admin'), auditController.listEvents);

// ==========================================
// Consent Endpoints
// ==========================================
router.post('/consents', authenticate, consentController.createConsent);
router.get('/consents/:id', authenticate, consentController.getConsent);

// ==========================================
// Push Notification Endpoints
// ==========================================
// Device registration
router.post('/push/register', authenticate, pushController.registerDevice);
router.delete('/push/unregister', authenticate, pushController.unregisterDevice);
router.get('/push/devices', authenticate, pushController.getDevices);

// Notifications
router.get('/push/notifications', authenticate, pushController.getNotifications);
router.patch('/push/notifications/:id/read', authenticate, pushController.markAsRead);
router.post('/push/notifications/mark-all-read', authenticate, pushController.markAllAsRead);
router.get('/push/unread-count', authenticate, pushController.getUnreadCount);

// Preferences
router.get('/push/preferences', authenticate, pushController.getPreferences);
router.put('/push/preferences', authenticate, pushController.updatePreferences);

// Admin endpoints
router.post('/push/send', authenticate, authorize('admin'), pushController.sendNotification);
router.post('/push/send-batch', authenticate, authorize('admin'), pushController.sendBatchNotifications);

// ==========================================
// Premium Feature Routes (Subscription Gated)
// ==========================================
router.use('/', premiumRoutes);

// ==========================================
// Post-Discharge Follow-Up Routes
// ==========================================
router.use('/discharges', postDischargeRoutes);

// ==========================================
// Surgical Scheduling Routes
// ==========================================
// Provides OR block management, case scheduling, duration prediction,
// schedule optimization, emergency insertion, and utilization analytics
router.use('/surgical', surgicalRoutes);

export { router as routes };
