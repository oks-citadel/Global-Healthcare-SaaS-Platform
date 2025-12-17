import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  ListAppointmentsInput,
  AppointmentResponse,
  PaginatedAppointments,
} from '../dtos/appointment.dto.js';
import { NotFoundError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export const appointmentService = {
  /**
   * Create appointment
   */
  async createAppointment(input: CreateAppointmentInput): Promise<AppointmentResponse> {
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
   */
  async cancelAppointment(id: string): Promise<void> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
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
