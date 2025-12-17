import {
  CreateEncounterInput,
  UpdateEncounterInput,
  AddClinicalNoteInput,
  EncounterResponseType,
  EncounterStatus
} from '../dtos/encounter.dto.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export const encounterService = {
  /**
   * Create a new encounter
   */
  async createEncounter(input: CreateEncounterInput, providerId: string): Promise<EncounterResponseType> {
    const encounter = await prisma.encounter.create({
      data: {
        patientId: input.patientId,
        providerId: input.providerId || providerId,
        appointmentId: input.appointmentId || null,
        type: input.type,
        status: 'planned',
      },
      include: {
        notes: true,
      },
    });

    return {
      id: encounter.id,
      patientId: encounter.patientId,
      providerId: encounter.providerId,
      appointmentId: encounter.appointmentId,
      type: encounter.type,
      status: encounter.status,
      startedAt: encounter.startedAt?.toISOString() || null,
      endedAt: encounter.endedAt?.toISOString() || null,
      notes: encounter.notes.map(note => ({
        id: note.id,
        encounterId: note.encounterId,
        authorId: note.authorId,
        noteType: note.noteType,
        content: note.content,
        timestamp: note.timestamp.toISOString(),
      })),
      createdAt: encounter.createdAt.toISOString(),
      updatedAt: encounter.updatedAt.toISOString(),
    };
  },

  /**
   * Get encounter by ID
   */
  async getEncounterById(id: string): Promise<EncounterResponseType> {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
      include: { notes: true },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    return {
      id: encounter.id,
      patientId: encounter.patientId,
      providerId: encounter.providerId,
      appointmentId: encounter.appointmentId,
      type: encounter.type,
      status: encounter.status,
      startedAt: encounter.startedAt?.toISOString() || null,
      endedAt: encounter.endedAt?.toISOString() || null,
      notes: encounter.notes.map(note => ({
        id: note.id,
        encounterId: note.encounterId,
        authorId: note.authorId,
        noteType: note.noteType,
        content: note.content,
        timestamp: note.timestamp.toISOString(),
      })),
      createdAt: encounter.createdAt.toISOString(),
      updatedAt: encounter.updatedAt.toISOString(),
    };
  },

  /**
   * Get encounters by patient ID
   */
  async getEncountersByPatientId(patientId: string): Promise<EncounterResponseType[]> {
    const encounters = await prisma.encounter.findMany({
      where: { patientId },
      include: { notes: true },
      orderBy: { createdAt: 'desc' },
    });

    return encounters.map(encounter => ({
      id: encounter.id,
      patientId: encounter.patientId,
      providerId: encounter.providerId,
      appointmentId: encounter.appointmentId,
      type: encounter.type,
      status: encounter.status,
      startedAt: encounter.startedAt?.toISOString() || null,
      endedAt: encounter.endedAt?.toISOString() || null,
      notes: encounter.notes.map(note => ({
        id: note.id,
        encounterId: note.encounterId,
        authorId: note.authorId,
        noteType: note.noteType,
        content: note.content,
        timestamp: note.timestamp.toISOString(),
      })),
      createdAt: encounter.createdAt.toISOString(),
      updatedAt: encounter.updatedAt.toISOString(),
    }));
  },

  /**
   * Get encounters by provider ID
   */
  async getEncountersByProviderId(providerId: string): Promise<EncounterResponseType[]> {
    const encounters = await prisma.encounter.findMany({
      where: { providerId },
      include: { notes: true },
      orderBy: { createdAt: 'desc' },
    });

    return encounters.map(encounter => ({
      id: encounter.id,
      patientId: encounter.patientId,
      providerId: encounter.providerId,
      appointmentId: encounter.appointmentId,
      type: encounter.type,
      status: encounter.status,
      startedAt: encounter.startedAt?.toISOString() || null,
      endedAt: encounter.endedAt?.toISOString() || null,
      notes: encounter.notes.map(note => ({
        id: note.id,
        encounterId: note.encounterId,
        authorId: note.authorId,
        noteType: note.noteType,
        content: note.content,
        timestamp: note.timestamp.toISOString(),
      })),
      createdAt: encounter.createdAt.toISOString(),
      updatedAt: encounter.updatedAt.toISOString(),
    }));
  },

  /**
   * Update encounter
   */
  async updateEncounter(id: string, input: UpdateEncounterInput): Promise<EncounterResponseType> {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    // Validate status transitions
    if (input.status) {
      const validTransitions: Record<EncounterStatus, EncounterStatus[]> = {
        'planned': ['in_progress', 'cancelled'],
        'in_progress': ['finished', 'cancelled'],
        'finished': [],
        'cancelled': [],
      };

      if (!validTransitions[encounter.status].includes(input.status)) {
        throw new BadRequestError(
          `Cannot transition encounter from ${encounter.status} to ${input.status}`
        );
      }
    }

    const updateData: any = {};
    if (input.status) updateData.status = input.status;
    if (input.startedAt) updateData.startedAt = new Date(input.startedAt);
    if (input.endedAt) updateData.endedAt = new Date(input.endedAt);

    // Auto-set startedAt when transitioning to in_progress
    if (input.status === 'in_progress' && !encounter.startedAt) {
      updateData.startedAt = new Date();
    }

    // Auto-set endedAt when transitioning to finished
    if (input.status === 'finished' && !encounter.endedAt) {
      updateData.endedAt = new Date();
    }

    const updatedEncounter = await prisma.encounter.update({
      where: { id },
      data: updateData,
      include: { notes: true },
    });

    return {
      id: updatedEncounter.id,
      patientId: updatedEncounter.patientId,
      providerId: updatedEncounter.providerId,
      appointmentId: updatedEncounter.appointmentId,
      type: updatedEncounter.type,
      status: updatedEncounter.status,
      startedAt: updatedEncounter.startedAt?.toISOString() || null,
      endedAt: updatedEncounter.endedAt?.toISOString() || null,
      notes: updatedEncounter.notes.map(note => ({
        id: note.id,
        encounterId: note.encounterId,
        authorId: note.authorId,
        noteType: note.noteType,
        content: note.content,
        timestamp: note.timestamp.toISOString(),
      })),
      createdAt: updatedEncounter.createdAt.toISOString(),
      updatedAt: updatedEncounter.updatedAt.toISOString(),
    };
  },

  /**
   * Add clinical note to encounter
   */
  async addClinicalNote(
    encounterId: string,
    input: AddClinicalNoteInput,
    authorId: string
  ): Promise<any> {
    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    // Only allow notes on active encounters
    if (encounter.status === 'cancelled') {
      throw new BadRequestError('Cannot add notes to a cancelled encounter');
    }

    const note = await prisma.clinicalNote.create({
      data: {
        encounterId,
        authorId,
        noteType: input.noteType,
        content: input.content,
      },
    });

    return {
      id: note.id,
      encounterId: note.encounterId,
      authorId: note.authorId,
      noteType: note.noteType,
      content: note.content,
      timestamp: note.timestamp.toISOString(),
    };
  },

  /**
   * Get clinical notes for an encounter
   */
  async getClinicalNotes(encounterId: string): Promise<any[]> {
    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    const notes = await prisma.clinicalNote.findMany({
      where: { encounterId },
      orderBy: { timestamp: 'asc' },
    });

    return notes.map(note => ({
      id: note.id,
      encounterId: note.encounterId,
      authorId: note.authorId,
      noteType: note.noteType,
      content: note.content,
      timestamp: note.timestamp.toISOString(),
    }));
  },

  /**
   * Start an encounter
   */
  async startEncounter(id: string): Promise<EncounterResponseType> {
    return this.updateEncounter(id, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    });
  },

  /**
   * End an encounter
   */
  async endEncounter(id: string): Promise<EncounterResponseType> {
    return this.updateEncounter(id, {
      status: 'finished',
      endedAt: new Date().toISOString(),
    });
  },
};
