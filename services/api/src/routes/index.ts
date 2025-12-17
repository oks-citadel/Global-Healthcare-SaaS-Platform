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
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// ==========================================
// Platform & System Endpoints
// ==========================================
router.get('/version', healthController.getVersion);
router.get('/config/public', healthController.getPublicConfig);

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
// Appointment Endpoints
// ==========================================
router.post('/appointments', authenticate, appointmentController.createAppointment);
router.get('/appointments', authenticate, appointmentController.listAppointments);
router.get('/appointments/:id', authenticate, appointmentController.getAppointment);
router.patch('/appointments/:id', authenticate, appointmentController.updateAppointment);
router.delete('/appointments/:id', authenticate, appointmentController.deleteAppointment);

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
// Billing Webhook (Stripe)
// ==========================================
router.post('/billing/webhook', subscriptionController.handleWebhook);

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
router.post('/payments/webhook', paymentController.handleWebhook);

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

export { router as routes };
