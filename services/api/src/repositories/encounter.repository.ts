import { Encounter, EncounterStatus, EncounterType, ClinicalNote, Prisma } from '../generated/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class EncounterRepository extends BaseRepository<Encounter, typeof prisma.encounter> {
  constructor() {
    super(prisma.encounter, 'Encounter');
  }

  /**
   * Find encounters by patient ID
   */
  async findByPatientId(
    patientId: string,
    include?: Prisma.EncounterInclude
  ): Promise<Encounter[]> {
    return this.model.findMany({
      where: { patientId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find encounters by provider ID
   */
  async findByProviderId(
    providerId: string,
    include?: Prisma.EncounterInclude
  ): Promise<Encounter[]> {
    return this.model.findMany({
      where: { providerId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find encounter by appointment ID
   */
  async findByAppointmentId(
    appointmentId: string,
    include?: Prisma.EncounterInclude
  ): Promise<Encounter | null> {
    return this.model.findUnique({
      where: { appointmentId },
      include,
    });
  }

  /**
   * Find encounters by status
   */
  async findByStatus(
    status: EncounterStatus,
    include?: Prisma.EncounterInclude
  ): Promise<Encounter[]> {
    return this.model.findMany({
      where: { status },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find encounters by type
   */
  async findByType(
    type: EncounterType,
    include?: Prisma.EncounterInclude
  ): Promise<Encounter[]> {
    return this.model.findMany({
      where: { type },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find active encounters
   */
  async findActive(providerId?: string): Promise<Encounter[]> {
    const where: Prisma.EncounterWhereInput = {
      status: {
        in: ['planned', 'in_progress'],
      },
    };

    if (providerId) {
      where.providerId = providerId;
    }

    return this.model.findMany({
      where,
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
        notes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find encounters with full details
   */
  async findWithFullDetails(id: string): Promise<Encounter | null> {
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
        appointment: true,
        notes: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  /**
   * Find encounters by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      patientId?: string;
      providerId?: string;
      status?: EncounterStatus;
    }
  ): Promise<Encounter[]> {
    const where: Prisma.EncounterWhereInput = {
      createdAt: {
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
        notes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update encounter status
   */
  async updateStatus(id: string, status: EncounterStatus): Promise<Encounter> {
    const data: Prisma.EncounterUpdateInput = { status };

    // Auto-set startedAt when transitioning to in_progress
    if (status === 'in_progress') {
      const encounter = await this.findById(id);
      if (encounter && !encounter.startedAt) {
        data.startedAt = new Date();
      }
    }

    // Auto-set endedAt when transitioning to finished
    if (status === 'finished') {
      const encounter = await this.findById(id);
      if (encounter && !encounter.endedAt) {
        data.endedAt = new Date();
      }
    }

    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Start encounter
   */
  async start(id: string): Promise<Encounter> {
    return this.model.update({
      where: { id },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
    });
  }

  /**
   * End encounter
   */
  async end(id: string): Promise<Encounter> {
    return this.model.update({
      where: { id },
      data: {
        status: 'finished',
        endedAt: new Date(),
      },
    });
  }

  /**
   * Cancel encounter
   */
  async cancel(id: string): Promise<Encounter> {
    return this.updateStatus(id, 'cancelled');
  }

  /**
   * Count encounters by status
   */
  async countByStatus(status: EncounterStatus): Promise<number> {
    return this.model.count({ where: { status } });
  }

  /**
   * Count encounters by patient
   */
  async countByPatient(patientId: string): Promise<number> {
    return this.model.count({ where: { patientId } });
  }

  /**
   * Count encounters by provider
   */
  async countByProvider(providerId: string): Promise<number> {
    return this.model.count({ where: { providerId } });
  }

  /**
   * Get recent encounters
   */
  async findRecent(limit: number = 10, providerId?: string): Promise<Encounter[]> {
    const where: Prisma.EncounterWhereInput = {};

    if (providerId) {
      where.providerId = providerId;
    }

    return this.model.findMany({
      where,
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
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add clinical note to encounter
   */
  async addNote(
    encounterId: string,
    noteData: {
      authorId: string;
      noteType: string;
      content: string;
    }
  ): Promise<ClinicalNote> {
    return prisma.clinicalNote.create({
      data: {
        encounterId,
        authorId: noteData.authorId,
        noteType: noteData.noteType,
        content: noteData.content,
      },
    });
  }

  /**
   * Get clinical notes for encounter
   */
  async getNotes(encounterId: string): Promise<ClinicalNote[]> {
    return prisma.clinicalNote.findMany({
      where: { encounterId },
      orderBy: { timestamp: 'asc' },
    });
  }

  /**
   * Update clinical note
   */
  async updateNote(
    noteId: string,
    content: string
  ): Promise<ClinicalNote> {
    return prisma.clinicalNote.update({
      where: { id: noteId },
      data: { content },
    });
  }

  /**
   * Delete clinical note
   */
  async deleteNote(noteId: string): Promise<ClinicalNote> {
    return prisma.clinicalNote.delete({
      where: { id: noteId },
    });
  }

  /**
   * Get encounter duration
   */
  async getDuration(id: string): Promise<number | null> {
    const encounter = await this.findById(id);

    if (!encounter || !encounter.startedAt || !encounter.endedAt) {
      return null;
    }

    return encounter.endedAt.getTime() - encounter.startedAt.getTime();
  }

  /**
   * Get encounter statistics for provider
   */
  async getProviderStats(
    providerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    total: number;
    planned: number;
    inProgress: number;
    finished: number;
    cancelled: number;
    averageDuration: number | null;
  }> {
    const where: Prisma.EncounterWhereInput = { providerId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, planned, inProgress, finished, cancelled, encounters] = await Promise.all([
      this.model.count({ where }),
      this.model.count({ where: { ...where, status: 'planned' } }),
      this.model.count({ where: { ...where, status: 'in_progress' } }),
      this.model.count({ where: { ...where, status: 'finished' } }),
      this.model.count({ where: { ...where, status: 'cancelled' } }),
      this.model.findMany({
        where: {
          ...where,
          status: 'finished',
          startedAt: { not: null },
          endedAt: { not: null },
        },
        select: {
          startedAt: true,
          endedAt: true,
        },
      }),
    ]);

    let averageDuration: number | null = null;
    if (encounters.length > 0) {
      const totalDuration = encounters.reduce((sum, e) => {
        if (e.startedAt && e.endedAt) {
          return sum + (e.endedAt.getTime() - e.startedAt.getTime());
        }
        return sum;
      }, 0);
      averageDuration = totalDuration / encounters.length;
    }

    return {
      total,
      planned,
      inProgress,
      finished,
      cancelled,
      averageDuration,
    };
  }
}

export const encounterRepository = new EncounterRepository();
