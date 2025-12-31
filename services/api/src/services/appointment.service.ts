import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  ListAppointmentsInput,
  AppointmentResponse,
  PaginatedAppointments,
  AppointmentWithBillingResponse,
} from '../dtos/appointment.dto.js';
import { NotFoundError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import { appointmentBillingService } from './appointment-billing.service.js';
import { logger } from '../utils/logger.js';

export const appointmentService = {
  /**
   * Create appointment
   * If the appointment type is paid and skipPayment is not true,
   * a payment intent will be created for the appointment.
   */
  async createAppointment(
    input: CreateAppointmentInput,
    userId?: string
  ): Promise<AppointmentWithBillingResponse> {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: input.patientId,
        providerId: input.providerId,
        scheduledAt: new Date(input.scheduledAt),
        duration: input.duration,
        type: input.type,
        status: 'scheduled',
        reasonForVisit: input.reasonForVisit || null,
        notes: input.notes || null,
      },
    });

    const response: AppointmentWithBillingResponse = {
      id: appointment.id,
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      scheduledAt: appointment.scheduledAt.toISOString(),
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      reasonForVisit: appointment.reasonForVisit,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    };

    // Check if payment is required for this appointment type
    const isPaidType = appointmentBillingService.isAppointmentTypePaid(input.type);

    if (isPaidType && !input.skipPayment && userId) {
      try {
        // Create payment intent for the appointment
        const billingResult = await appointmentBillingService.createAppointmentPayment(
          userId,
          {
            appointmentId: appointment.id,
            patientId: input.patientId,
            providerId: input.providerId,
            appointmentType: input.type,
            duration: input.duration,
            paymentMethodId: input.paymentMethodId,
          }
        );

        response.billing = {
          paymentId: billingResult.paymentId,
          paymentIntentId: billingResult.paymentIntentId,
          clientSecret: billingResult.clientSecret,
          amount: billingResult.amount,
          currency: billingResult.currency,
          status: billingResult.status,
          requiresAction: billingResult.requiresAction,
          isPaid: billingResult.status === 'succeeded',
        };

        logger.info(`Created appointment ${appointment.id} with payment ${billingResult.paymentId}`);
      } catch (error) {
        // Log error but don't fail appointment creation
        // Payment can be collected later
        logger.error(`Failed to create payment for appointment ${appointment.id}:`, error);

        // Add billing info without payment
        const { amount, currency } = appointmentBillingService.calculateAppointmentPrice(
          input.type,
          input.duration
        );
        response.billing = {
          amount,
          currency,
          status: 'payment_required',
          isPaid: false,
        };
      }
    } else if (isPaidType && !input.skipPayment) {
      // Appointment requires payment but no userId provided - include price info
      const { amount, currency } = appointmentBillingService.calculateAppointmentPrice(
        input.type,
        input.duration
      );
      response.billing = {
        amount,
        currency,
        status: 'payment_required',
        isPaid: false,
      };
    }

    return response;
  },

  /**
   * List appointments with filters
   */
  async listAppointments(filters: ListAppointmentsInput): Promise<PaginatedAppointments> {
    const where: any = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters.providerId) {
      where.providerId = filters.providerId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.from || filters.to) {
      where.scheduledAt = {};
      if (filters.from) {
        where.scheduledAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.scheduledAt.lte = new Date(filters.to);
      }
    }

    const total = await prisma.appointment.count({ where });
    const totalPages = Math.ceil(total / filters.limit);
    const offset = (filters.page - 1) * filters.limit;

    const appointments = await prisma.appointment.findMany({
      where,
      skip: offset,
      take: filters.limit,
      orderBy: { scheduledAt: 'asc' },
    });

    const data = appointments.map(appointment => ({
      id: appointment.id,
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      scheduledAt: appointment.scheduledAt.toISOString(),
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      reasonForVisit: appointment.reasonForVisit,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));

    return {
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string): Promise<AppointmentResponse> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      scheduledAt: appointment.scheduledAt.toISOString(),
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      reasonForVisit: appointment.reasonForVisit,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    };
  },

  /**
   * Update appointment
   */
  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<AppointmentResponse> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : appointment.scheduledAt,
        type: input.type || appointment.type,
        duration: input.duration || appointment.duration,
        status: input.status || appointment.status,
        reasonForVisit: input.reasonForVisit !== undefined ? input.reasonForVisit : appointment.reasonForVisit,
        notes: input.notes !== undefined ? input.notes : appointment.notes,
      },
    });

    return {
      id: updatedAppointment.id,
      patientId: updatedAppointment.patientId,
      providerId: updatedAppointment.providerId,
      scheduledAt: updatedAppointment.scheduledAt.toISOString(),
      duration: updatedAppointment.duration,
      type: updatedAppointment.type,
      status: updatedAppointment.status,
      reasonForVisit: updatedAppointment.reasonForVisit,
      notes: updatedAppointment.notes,
      createdAt: updatedAppointment.createdAt.toISOString(),
      updatedAt: updatedAppointment.updatedAt.toISOString(),
    };
  },

  /**
   * Cancel appointment
   * Also cancels any pending payments associated with the appointment
   */
  async cancelAppointment(id: string, refundIfPaid: boolean = false): Promise<void> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    // Cancel or refund any associated payments
    try {
      const payment = await appointmentBillingService.getAppointmentPayment(id);

      if (payment) {
        if (payment.status === 'succeeded' && refundIfPaid) {
          // Refund the payment
          await appointmentBillingService.refundAppointmentPayment(
            id,
            undefined, // Full refund
            'requested_by_customer'
          );
          logger.info(`Refunded payment for cancelled appointment ${id}`);
        } else if (payment.status !== 'succeeded') {
          // Cancel the pending payment
          await appointmentBillingService.cancelAppointmentPayment(id);
          logger.info(`Cancelled pending payment for appointment ${id}`);
        }
      }
    } catch (error) {
      // Log but don't fail the cancellation
      logger.error(`Error handling payment for cancelled appointment ${id}:`, error);
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  },

  /**
   * Get patient ID by user ID
   */
  async getPatientIdByUserId(userId: string): Promise<string> {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundError('Patient not found for this user');
    }

    return patient.id;
  },

  /**
   * Get provider ID by user ID
   */
  async getProviderIdByUserId(userId: string): Promise<string> {
    const provider = await prisma.provider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      throw new NotFoundError('Provider not found for this user');
    }

    return provider.id;
  },
};
