import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appointmentService } from '../../../src/services/appointment.service.js';
import { NotFoundError } from '../../../src/utils/errors.js';
import { prisma } from '../../../src/lib/prisma.js';

// Mock Prisma client
vi.mock('../../../src/lib/prisma.js', () => ({
  prisma: {
    appointment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    patient: {
      findUnique: vi.fn(),
    },
    provider: {
      findUnique: vi.fn(),
    },
  },
}));

describe('AppointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create an appointment successfully', async () => {
      const mockAppointment = {
        id: 'appt-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date('2025-01-20T10:00:00Z'),
        duration: 30,
        type: 'checkup',
        status: 'scheduled',
        reasonForVisit: 'Annual checkup',
        notes: 'First visit',
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.create).mockResolvedValue(mockAppointment);

      const input = {
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: '2025-01-20T10:00:00Z',
        duration: 30,
        type: 'checkup' as const,
        reasonForVisit: 'Annual checkup',
        notes: 'First visit',
      };

      const result = await appointmentService.createAppointment(input);

      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: {
          patientId: input.patientId,
          providerId: input.providerId,
          scheduledAt: new Date(input.scheduledAt),
          duration: input.duration,
          type: input.type,
          status: 'scheduled',
          reasonForVisit: input.reasonForVisit,
          notes: input.notes,
        },
      });

      expect(result).toEqual({
        id: mockAppointment.id,
        patientId: mockAppointment.patientId,
        providerId: mockAppointment.providerId,
        scheduledAt: mockAppointment.scheduledAt.toISOString(),
        duration: mockAppointment.duration,
        type: mockAppointment.type,
        status: mockAppointment.status,
        reasonForVisit: mockAppointment.reasonForVisit,
        notes: mockAppointment.notes,
        createdAt: mockAppointment.createdAt.toISOString(),
        updatedAt: mockAppointment.updatedAt.toISOString(),
      });
    });

    it('should create appointment with null optional fields', async () => {
      const mockAppointment = {
        id: 'appt-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date('2025-01-20T10:00:00Z'),
        duration: 30,
        type: 'checkup',
        status: 'scheduled',
        reasonForVisit: null,
        notes: null,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.create).mockResolvedValue(mockAppointment);

      const input = {
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: '2025-01-20T10:00:00Z',
        duration: 30,
        type: 'checkup' as const,
      };

      const result = await appointmentService.createAppointment(input);

      expect(result.reasonForVisit).toBeNull();
      expect(result.notes).toBeNull();
    });

    it('should handle creation errors', async () => {
      vi.mocked(prisma.appointment.create).mockRejectedValue(
        new Error('Database error')
      );

      const input = {
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: '2025-01-20T10:00:00Z',
        duration: 30,
        type: 'checkup' as const,
      };

      await expect(appointmentService.createAppointment(input)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('listAppointments', () => {
    it('should list appointments with pagination', async () => {
      const mockAppointments = [
        {
          id: 'appt-1',
          patientId: 'patient-123',
          providerId: 'provider-123',
          scheduledAt: new Date('2025-01-20T10:00:00Z'),
          duration: 30,
          type: 'checkup',
          status: 'scheduled',
          reasonForVisit: 'Annual checkup',
          notes: null,
          createdAt: new Date('2025-01-15T10:00:00Z'),
          updatedAt: new Date('2025-01-15T10:00:00Z'),
        },
        {
          id: 'appt-2',
          patientId: 'patient-123',
          providerId: 'provider-123',
          scheduledAt: new Date('2025-01-21T14:00:00Z'),
          duration: 45,
          type: 'followup',
          status: 'scheduled',
          reasonForVisit: 'Follow-up',
          notes: null,
          createdAt: new Date('2025-01-15T11:00:00Z'),
          updatedAt: new Date('2025-01-15T11:00:00Z'),
        },
      ];

      vi.mocked(prisma.appointment.count).mockResolvedValue(2);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue(mockAppointments);

      const filters = {
        page: 1,
        limit: 10,
      };

      const result = await appointmentService.listAppointments(filters);

      expect(prisma.appointment.count).toHaveBeenCalledWith({ where: {} });
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter appointments by patientId', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        patientId: 'patient-123',
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.count).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
      });
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });

    it('should filter appointments by providerId', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        providerId: 'provider-123',
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { providerId: 'provider-123' },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });

    it('should filter appointments by status', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        status: 'scheduled' as const,
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { status: 'scheduled' },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });

    it('should filter appointments by date range', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        from: '2025-01-20T00:00:00Z',
        to: '2025-01-25T23:59:59Z',
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {
          scheduledAt: {
            gte: new Date('2025-01-20T00:00:00Z'),
            lte: new Date('2025-01-25T23:59:59Z'),
          },
        },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });

    it('should filter appointments by from date only', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        from: '2025-01-20T00:00:00Z',
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {
          scheduledAt: {
            gte: new Date('2025-01-20T00:00:00Z'),
          },
        },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });

    it('should handle pagination correctly for page 2', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(25);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 2,
        limit: 10,
      };

      const result = await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 10,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });

      expect(result.pagination.totalPages).toBe(3);
    });

    it('should combine multiple filters', async () => {
      vi.mocked(prisma.appointment.count).mockResolvedValue(1);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const filters = {
        page: 1,
        limit: 10,
        patientId: 'patient-123',
        status: 'scheduled' as const,
        from: '2025-01-20T00:00:00Z',
        to: '2025-01-25T23:59:59Z',
      };

      await appointmentService.listAppointments(filters);

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-123',
          status: 'scheduled',
          scheduledAt: {
            gte: new Date('2025-01-20T00:00:00Z'),
            lte: new Date('2025-01-25T23:59:59Z'),
          },
        },
        skip: 0,
        take: 10,
        orderBy: { scheduledAt: 'asc' },
      });
    });
  });

  describe('getAppointmentById', () => {
    it('should retrieve an appointment by ID', async () => {
      const mockAppointment = {
        id: 'appt-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date('2025-01-20T10:00:00Z'),
        duration: 30,
        type: 'checkup',
        status: 'scheduled',
        reasonForVisit: 'Annual checkup',
        notes: null,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(mockAppointment);

      const result = await appointmentService.getAppointmentById('appt-123');

      expect(prisma.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
      });

      expect(result).toEqual({
        id: mockAppointment.id,
        patientId: mockAppointment.patientId,
        providerId: mockAppointment.providerId,
        scheduledAt: mockAppointment.scheduledAt.toISOString(),
        duration: mockAppointment.duration,
        type: mockAppointment.type,
        status: mockAppointment.status,
        reasonForVisit: mockAppointment.reasonForVisit,
        notes: mockAppointment.notes,
        createdAt: mockAppointment.createdAt.toISOString(),
        updatedAt: mockAppointment.updatedAt.toISOString(),
      });
    });

    it('should throw NotFoundError when appointment does not exist', async () => {
      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(null);

      await expect(
        appointmentService.getAppointmentById('non-existent-id')
      ).rejects.toThrow(NotFoundError);

      await expect(
        appointmentService.getAppointmentById('non-existent-id')
      ).rejects.toThrow('Appointment not found');
    });
  });

  describe('updateAppointment', () => {
    const existingAppointment = {
      id: 'appt-123',
      patientId: 'patient-123',
      providerId: 'provider-123',
      scheduledAt: new Date('2025-01-20T10:00:00Z'),
      duration: 30,
      type: 'checkup',
      status: 'scheduled',
      reasonForVisit: 'Annual checkup',
      notes: null,
      createdAt: new Date('2025-01-15T10:00:00Z'),
      updatedAt: new Date('2025-01-15T10:00:00Z'),
    };

    it('should update appointment successfully', async () => {
      const updatedAppointment = {
        ...existingAppointment,
        scheduledAt: new Date('2025-01-21T14:00:00Z'),
        duration: 45,
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(existingAppointment);
      vi.mocked(prisma.appointment.update).mockResolvedValue(updatedAppointment);

      const input = {
        scheduledAt: '2025-01-21T14:00:00Z',
        duration: 45,
      };

      const result = await appointmentService.updateAppointment('appt-123', input);

      expect(prisma.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
      });

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
        data: {
          scheduledAt: new Date(input.scheduledAt),
          type: existingAppointment.type,
          duration: input.duration,
          status: existingAppointment.status,
          reasonForVisit: existingAppointment.reasonForVisit,
          notes: existingAppointment.notes,
        },
      });

      expect(result.scheduledAt).toBe(updatedAppointment.scheduledAt.toISOString());
      expect(result.duration).toBe(45);
    });

    it('should update appointment status', async () => {
      const updatedAppointment = {
        ...existingAppointment,
        status: 'completed',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(existingAppointment);
      vi.mocked(prisma.appointment.update).mockResolvedValue(updatedAppointment);

      const input = {
        status: 'completed' as const,
      };

      const result = await appointmentService.updateAppointment('appt-123', input);

      expect(result.status).toBe('completed');
    });

    it('should update notes and reason for visit', async () => {
      const updatedAppointment = {
        ...existingAppointment,
        reasonForVisit: 'Updated reason',
        notes: 'Additional notes',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(existingAppointment);
      vi.mocked(prisma.appointment.update).mockResolvedValue(updatedAppointment);

      const input = {
        reasonForVisit: 'Updated reason',
        notes: 'Additional notes',
      };

      const result = await appointmentService.updateAppointment('appt-123', input);

      expect(result.reasonForVisit).toBe('Updated reason');
      expect(result.notes).toBe('Additional notes');
    });

    it('should allow clearing notes by setting to null', async () => {
      const updatedAppointment = {
        ...existingAppointment,
        notes: null,
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
        ...existingAppointment,
        notes: 'Some notes',
      });
      vi.mocked(prisma.appointment.update).mockResolvedValue(updatedAppointment);

      const input = {
        notes: null,
      };

      const result = await appointmentService.updateAppointment('appt-123', input);

      expect(result.notes).toBeNull();
    });

    it('should throw NotFoundError when appointment does not exist', async () => {
      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(null);

      const input = {
        status: 'completed' as const,
      };

      await expect(
        appointmentService.updateAppointment('non-existent-id', input)
      ).rejects.toThrow(NotFoundError);
    });

    it('should preserve existing values when not provided in update', async () => {
      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(existingAppointment);
      vi.mocked(prisma.appointment.update).mockResolvedValue(existingAppointment);

      const input = {};

      await appointmentService.updateAppointment('appt-123', input);

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
        data: {
          scheduledAt: existingAppointment.scheduledAt,
          type: existingAppointment.type,
          duration: existingAppointment.duration,
          status: existingAppointment.status,
          reasonForVisit: existingAppointment.reasonForVisit,
          notes: existingAppointment.notes,
        },
      });
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel an appointment successfully', async () => {
      const mockAppointment = {
        id: 'appt-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date('2025-01-20T10:00:00Z'),
        duration: 30,
        type: 'checkup',
        status: 'scheduled',
        reasonForVisit: 'Annual checkup',
        notes: null,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(mockAppointment);
      vi.mocked(prisma.appointment.update).mockResolvedValue({
        ...mockAppointment,
        status: 'cancelled',
      });

      await appointmentService.cancelAppointment('appt-123');

      expect(prisma.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
      });

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-123' },
        data: { status: 'cancelled' },
      });
    });

    it('should throw NotFoundError when appointment does not exist', async () => {
      vi.mocked(prisma.appointment.findUnique).mockResolvedValue(null);

      await expect(
        appointmentService.cancelAppointment('non-existent-id')
      ).rejects.toThrow(NotFoundError);

      expect(prisma.appointment.update).not.toHaveBeenCalled();
    });
  });

  describe('getPatientIdByUserId', () => {
    it('should retrieve patient ID by user ID', async () => {
      const mockPatient = {
        id: 'patient-123',
      };

      vi.mocked(prisma.patient.findUnique).mockResolvedValue(mockPatient as any);

      const result = await appointmentService.getPatientIdByUserId('user-123');

      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true },
      });

      expect(result).toBe('patient-123');
    });

    it('should throw NotFoundError when patient does not exist', async () => {
      vi.mocked(prisma.patient.findUnique).mockResolvedValue(null);

      await expect(
        appointmentService.getPatientIdByUserId('non-existent-user')
      ).rejects.toThrow(NotFoundError);

      await expect(
        appointmentService.getPatientIdByUserId('non-existent-user')
      ).rejects.toThrow('Patient not found for this user');
    });
  });

  describe('getProviderIdByUserId', () => {
    it('should retrieve provider ID by user ID', async () => {
      const mockProvider = {
        id: 'provider-123',
      };

      vi.mocked(prisma.provider.findUnique).mockResolvedValue(mockProvider as any);

      const result = await appointmentService.getProviderIdByUserId('user-123');

      expect(prisma.provider.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true },
      });

      expect(result).toBe('provider-123');
    });

    it('should throw NotFoundError when provider does not exist', async () => {
      vi.mocked(prisma.provider.findUnique).mockResolvedValue(null);

      await expect(
        appointmentService.getProviderIdByUserId('non-existent-user')
      ).rejects.toThrow(NotFoundError);

      await expect(
        appointmentService.getProviderIdByUserId('non-existent-user')
      ).rejects.toThrow('Provider not found for this user');
    });
  });
});
