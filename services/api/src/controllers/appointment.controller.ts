import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointment.service.js';
import { appointmentBillingService } from '../services/appointment-billing.service.js';
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
  ListAppointmentsSchema,
  CreateAppointmentPaymentSchema,
  ConfirmAppointmentPaymentSchema,
  CompleteAppointmentBillingSchema,
  RefundAppointmentPaymentSchema,
  GetAppointmentPriceSchema,
} from '../dtos/appointment.dto.js';
import { ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const appointmentController = {
  /**
   * POST /appointments
   * Create a new appointment
   * For paid appointment types, a payment intent will be created automatically
   */
  createAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateAppointmentSchema.parse(req.body);

      // SECURITY FIX: Only admins and providers can skip payment
      // Patients must always go through the payment flow for paid appointments
      if (input.skipPayment && req.user?.role === 'patient') {
        logger.warn('Patient attempted to use skipPayment privilege', {
          userId: req.user.userId,
          appointmentType: input.type,
          ipAddress: req.ip,
        });
        // Strip the skipPayment flag - don't throw error to avoid information leakage
        input.skipPayment = false;
      }

      // Pass userId if available for payment creation
      const userId = req.user?.userId;
      const appointment = await appointmentService.createAppointment(input, userId);

      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments
   * List appointments with filters
   */
  listAppointments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListAppointmentsSchema.parse(req.query);

      // Patients can only see their own appointments
      if (req.user?.role === 'patient') {
        const patientId = await appointmentService.getPatientIdByUserId(req.user.userId);
        filters.patientId = patientId;
      }

      // Providers can see their own appointments
      if (req.user?.role === 'provider') {
        const providerId = await appointmentService.getProviderIdByUserId(req.user.userId);
        filters.providerId = providerId;
      }

      const result = await appointmentService.listAppointments(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments/:id
   * Get appointment by ID
   */
  getAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      // Check access
      await appointmentController.checkAppointmentAccess(req, appointment);

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /appointments/:id
   * Update appointment
   */
  updateAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdateAppointmentSchema.parse(req.body);

      // Verify access before update
      const existing = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, existing);

      const appointment = await appointmentService.updateAppointment(id, input);
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /appointments/:id
   * Cancel appointment
   */
  deleteAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access before cancellation
      const existing = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, existing);

      await appointmentService.cancelAppointment(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Helper: Check if user has access to appointment
   */
  checkAppointmentAccess: async (req: Request, appointment: { patientId: string; providerId: string }) => {
    if (req.user?.role === 'admin') return;

    if (req.user?.role === 'patient') {
      const patientId = await appointmentService.getPatientIdByUserId(req.user.userId);
      if (appointment.patientId !== patientId) {
        throw new ForbiddenError('Cannot access this appointment');
      }
    }

    if (req.user?.role === 'provider') {
      const providerId = await appointmentService.getProviderIdByUserId(req.user.userId);
      if (appointment.providerId !== providerId) {
        throw new ForbiddenError('Cannot access this appointment');
      }
    }
  },

  // ==========================================
  // Appointment Billing Endpoints
  // ==========================================

  /**
   * GET /appointments/pricing
   * Get price estimate for an appointment type
   */
  getAppointmentPrice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = GetAppointmentPriceSchema.parse(req.query);
      const { amount, currency, isPaid } = appointmentBillingService.calculateAppointmentPrice(
        input.type,
        input.duration
      );

      res.json({
        type: input.type,
        duration: input.duration,
        price: {
          amount,
          amountFormatted: (amount / 100).toFixed(2),
          currency,
          isPaid,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /appointments/:id/payment
   * Create a payment for an existing appointment
   */
  createAppointmentPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const input = CreateAppointmentPaymentSchema.parse({ ...req.body, appointmentId: id });

      // Verify access to appointment
      const appointment = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, appointment);

      const result = await appointmentBillingService.createAppointmentPayment(
        req.user.userId,
        {
          appointmentId: id,
          patientId: appointment.patientId,
          providerId: appointment.providerId,
          appointmentType: appointment.type,
          duration: appointment.duration,
          paymentMethodId: input.paymentMethodId,
          metadata: input.metadata,
        }
      );

      res.status(201).json({
        payment: {
          id: result.paymentId,
          paymentIntentId: result.paymentIntentId,
          amount: result.amount,
          amountFormatted: (result.amount / 100).toFixed(2),
          currency: result.currency,
          status: result.status,
          requiresAction: result.requiresAction,
        },
        clientSecret: result.clientSecret,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments/:id/payment
   * Get payment status for an appointment
   */
  getAppointmentPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access to appointment
      const appointment = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, appointment);

      const payment = await appointmentBillingService.getAppointmentPayment(id);

      if (!payment) {
        // Check if this appointment type requires payment
        const isPaid = appointmentBillingService.isAppointmentTypePaid(appointment.type);
        const { amount, currency } = appointmentBillingService.calculateAppointmentPrice(
          appointment.type,
          appointment.duration
        );

        res.json({
          appointmentId: id,
          payment: null,
          requiresPayment: isPaid,
          estimatedPrice: isPaid ? {
            amount,
            amountFormatted: (amount / 100).toFixed(2),
            currency,
          } : null,
        });
        return;
      }

      res.json({
        appointmentId: id,
        payment: {
          id: payment.id,
          stripePaymentIntentId: payment.stripePaymentIntentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          description: payment.description,
          createdAt: payment.createdAt,
        },
        requiresPayment: false,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /appointments/:id/payment/confirm
   * Confirm payment for an appointment with a payment method
   */
  confirmAppointmentPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = ConfirmAppointmentPaymentSchema.parse(req.body);

      // Verify access to appointment
      const appointment = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, appointment);

      const result = await appointmentBillingService.confirmAppointmentPayment(
        id,
        input.paymentMethodId
      );

      res.json({
        payment: {
          id: result.paymentId,
          paymentIntentId: result.paymentIntentId,
          amount: result.amount,
          amountFormatted: (result.amount / 100).toFixed(2),
          currency: result.currency,
          status: result.status,
          requiresAction: result.requiresAction,
        },
        clientSecret: result.clientSecret,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /appointments/:id/billing/complete
   * Complete billing after appointment (for providers/admins)
   * Can add additional charges if needed
   */
  completeAppointmentBilling: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = CompleteAppointmentBillingSchema.parse(req.body);

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Only providers and admins can complete billing
      if (req.user.role !== 'provider' && req.user.role !== 'admin') {
        res.status(403).json({ error: 'Only providers and admins can complete billing' });
        return;
      }

      // Verify access to appointment
      const appointment = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, appointment);

      const result = await appointmentBillingService.completeAppointmentBilling(
        req.user.userId,
        {
          appointmentId: id,
          additionalCharges: input.additionalCharges,
          paymentMethodId: input.paymentMethodId,
          metadata: input.metadata,
        }
      );

      if (!result) {
        res.json({
          appointmentId: id,
          message: 'No billing action required',
          billing: null,
        });
        return;
      }

      res.json({
        appointmentId: id,
        billing: {
          paymentId: result.paymentId,
          amount: result.amount,
          amountFormatted: (result.amount / 100).toFixed(2),
          currency: result.currency,
          status: result.status,
          requiresAction: result.requiresAction,
        },
        clientSecret: result.clientSecret,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments/:id/billing/summary
   * Get billing summary for an appointment
   */
  getAppointmentBillingSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access to appointment
      const appointment = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, appointment);

      const summary = await appointmentBillingService.getAppointmentBillingSummary(id);

      res.json({
        appointmentId: id,
        ...summary,
        totalChargedFormatted: (summary.totalCharged / 100).toFixed(2),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /appointments/:id/payment/refund
   * Refund payment for an appointment (admin only)
   */
  refundAppointmentPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = RefundAppointmentPaymentSchema.parse(req.body);

      // Only admins can issue refunds
      if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Only admins can issue refunds' });
        return;
      }

      const result = await appointmentBillingService.refundAppointmentPayment(
        id,
        input.amount,
        input.reason
      );

      res.json({
        appointmentId: id,
        refund: {
          paymentId: result.payment.id,
          amount: result.refund.amount,
          amountFormatted: (result.refund.amount / 100).toFixed(2),
          currency: result.refund.currency,
          status: result.refund.status,
          reason: result.refund.reason,
        },
        message: 'Refund processed successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
