import { NotFoundError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export const consentService = {
  /**
   * Create consent record
   */
  async createConsent(input: {
    patientId: string;
    type: string;
    granted: boolean;
    scope?: string;
    expiresAt?: string;
  }): Promise<any> {
    const consent = await prisma.consent.create({
      data: {
        patientId: input.patientId,
        type: input.type as any,
        granted: input.granted,
        scope: input.scope || null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });

    return {
      id: consent.id,
      patientId: consent.patientId,
      type: consent.type,
      granted: consent.granted,
      scope: consent.scope,
      expiresAt: consent.expiresAt?.toISOString() || null,
      createdAt: consent.createdAt.toISOString(),
      updatedAt: consent.updatedAt.toISOString(),
    };
  },

  /**
   * Get consent by ID
   */
  async getConsentById(id: string): Promise<any> {
    const consent = await prisma.consent.findUnique({
      where: { id },
    });

    if (!consent) {
      throw new NotFoundError('Consent not found');
    }

    return {
      id: consent.id,
      patientId: consent.patientId,
      type: consent.type,
      granted: consent.granted,
      scope: consent.scope,
      expiresAt: consent.expiresAt?.toISOString() || null,
      createdAt: consent.createdAt.toISOString(),
      updatedAt: consent.updatedAt.toISOString(),
    };
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
};
