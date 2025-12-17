import { Appointment, AppointmentStatus, AppointmentType, Prisma } from '@prisma/client';
import { BaseRepository, PaginationOptions, PaginationResult } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export interface AppointmentFilters {
  patientId?: string;
  providerId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  fromDate?: Date;
  toDate?: Date;
}

export class AppointmentRepository extends BaseRepository<Appointment, typeof prisma.appointment> {
  constructor() {
    super(prisma.appointment, 'Appointment');
  }

  /**
   * Find appointments by patient ID
   */
  async findByPatientId(
    patientId: string,
    include?: Prisma.AppointmentInclude
  ): Promise<Appointment[]> {
    return this.model.findMany({
      where: { patientId },
      include,
      orderBy: { scheduledAt: 'desc' },
    });
  }

  /**
   * Find appointments by provider ID
   */
  async findByProviderId(
    providerId: string,
    include?: Prisma.AppointmentInclude
  ): Promise<Appointment[]> {
    return this.model.findMany({
      where: { providerId },
      include,
      orderBy: { scheduledAt: 'desc' },
    });
  }

  /**
   * Find appointments by status
   */
  async findByStatus(
    status: AppointmentStatus,
    include?: Prisma.AppointmentInclude
  ): Promise<Appointment[]> {
    return this.model.findMany({
      where: { status },
      include,
      orderBy: { scheduledAt: 'asc' },
    });
  }

  /**
   * Find appointments by type
   */
  async findByType(
    type: AppointmentType,
    include?: Prisma.AppointmentInclude
  ): Promise<Appointment[]> {
    return this.model.findMany({
      where: { type },
      include,
      orderBy: { scheduledAt: 'desc' },
    });
  }

  /**
   * Find appointments with filters and pagination
   */
  async findWithFilters(
    filters: AppointmentFilters,
    pagination: PaginationOptions,
    include?: Prisma.AppointmentInclude
  ): Promise<PaginationResult<Appointment>> {
    const where: Prisma.AppointmentWhereInput = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.providerId) {
      where.providerId = filters.providerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.fromDate || filters.toDate) {
      where.scheduledAt = {};
      if (filters.fromDate) {
        where.scheduledAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.scheduledAt.lte = filters.toDate;
      }
    }

    return this.findWithPagination(where, pagination, {
      include,
      orderBy: { scheduledAt: 'asc' },
    });
  }

  /**
   * Find upcoming appointments
   */
  async findUpcoming(
    options?: {
      patientId?: string;
      providerId?: string;
      limit?: number;
    }
  ): Promise<Appointment[]> {
    const where: Prisma.AppointmentWhereInput = {
      scheduledAt: {
        gte: new Date(),
      },
      status: {
        in: ['scheduled', 'confirmed'],
      },
    };

    if (options?.patientId) {
      where.patientId = options.patientId;
    }

    if (options?.providerId) {
      where.providerId = options.providerId;
    }

    return this.model.findMany({
      where,
      take: options?.limit || 50,
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find past appointments
   */
  async findPast(
    options?: {
      patientId?: string;
      providerId?: string;
      limit?: number;
    }
  ): Promise<Appointment[]> {
    const where: Prisma.AppointmentWhereInput = {
      scheduledAt: {
        lt: new Date(),
      },
    };

    if (options?.patientId) {
      where.patientId = options.patientId;
    }

    if (options?.providerId) {
      where.providerId = options.providerId;
    }

    return this.model.findMany({
      where,
      take: options?.limit || 50,
      orderBy: { scheduledAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find appointments for a specific date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      patientId?: string;
      providerId?: string;
      status?: AppointmentStatus;
    }
  ): Promise<Appointment[]> {
    const where: Prisma.AppointmentWhereInput = {
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (options?.patientId) {
      where.patientId = options.patientId;
    }

    if (options?.providerId) {
      where.providerId = options.providerId;
    }

    if (options?.status) {
      where.status = options.status;
    }

    return this.model.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find appointments for today
   */
  async findToday(providerId?: string): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: Prisma.AppointmentWhereInput = {
      scheduledAt: {
        gte: today,
        lt: tomorrow,
      },
    };

    if (providerId) {
      where.providerId = providerId;
    }

    return this.model.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update appointment status
   */
  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.model.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Cancel appointment
   */
  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, 'cancelled');
  }

  /**
   * Confirm appointment
   */
  async confirm(id: string): Promise<Appointment> {
    return this.updateStatus(id, 'confirmed');
  }

  /**
   * Mark appointment as completed
   */
  async complete(id: string): Promise<Appointment> {
    return this.updateStatus(id, 'completed');
  }

  /**
   * Check for scheduling conflicts
   */
  async hasConflict(
    providerId: string,
    scheduledAt: Date,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const endTime = new Date(scheduledAt.getTime() + duration * 60000);

    const where: Prisma.AppointmentWhereInput = {
      providerId,
      status: {
        in: ['scheduled', 'confirmed', 'in_progress'],
      },
      OR: [
        {
          AND: [
            { scheduledAt: { lte: scheduledAt } },
            {
              scheduledAt: {
                gte: new Date(scheduledAt.getTime() - 60 * 60000),
              },
            },
          ],
        },
      ],
    };

    if (excludeAppointmentId) {
      where.id = { not: excludeAppointmentId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Count appointments by status
   */
  async countByStatus(status: AppointmentStatus): Promise<number> {
    return this.model.count({ where: { status } });
  }

  /**
   * Count appointments by patient
   */
  async countByPatient(patientId: string): Promise<number> {
    return this.model.count({ where: { patientId } });
  }

  /**
   * Count appointments by provider
   */
  async countByProvider(providerId: string): Promise<number> {
    return this.model.count({ where: { providerId } });
  }

  /**
   * Get appointment with full details
   */
  async findWithFullDetails(id: string): Promise<Appointment | null> {
    return this.model.findUnique({
      where: { id },
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
        visit: true,
        encounter: {
          include: {
            notes: true,
          },
        },
      },
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
