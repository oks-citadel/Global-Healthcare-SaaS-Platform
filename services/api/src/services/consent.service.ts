import { NotFoundError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import type { ConsentType, Prisma } from '../generated/client/index.js';

/**
 * Input type for creating a consent record
 */
interface CreateConsentInput {
  patientId: string;
  type: string;
  granted: boolean;
  scope?: string;
  expiresAt?: string;
}

/**
 * Response type for consent records
 */
interface ConsentResponse {
  id: string;
  patientId: string;
  type: string;
  granted: boolean;
  scope: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Valid consent type values matching the Prisma enum
 */
const VALID_CONSENT_TYPES: readonly ConsentType[] = [
  'data_sharing',
  'treatment',
  'marketing',
  'research',
] as const;

/**
 * Type guard to validate consent type string
 */
function isValidConsentType(type: string): type is ConsentType {
  return VALID_CONSENT_TYPES.includes(type as ConsentType);
}

/**
 * Consent database record type from Prisma
 */
type ConsentRecord = Prisma.ConsentGetPayload<object>;

/**
 * Transform a consent database record to API response format
 */
function transformConsentToResponse(consent: ConsentRecord): ConsentResponse {
  return {
    id: consent.id,
    patientId: consent.patientId,
    type: consent.type,
    granted: consent.granted,
    scope: consent.scope,
    expiresAt: consent.expiresAt?.toISOString() ?? null,
    createdAt: consent.createdAt.toISOString(),
    updatedAt: consent.updatedAt.toISOString(),
  };
}

export const consentService = {
  /**
   * Create consent record
   */
  async createConsent(input: CreateConsentInput): Promise<ConsentResponse> {
    // Validate consent type
    if (!isValidConsentType(input.type)) {
      throw new Error(`Invalid consent type: ${input.type}. Valid types are: ${VALID_CONSENT_TYPES.join(', ')}`);
    }

    const consent = await prisma.consent.create({
      data: {
        patientId: input.patientId,
        type: input.type,
        granted: input.granted,
        scope: input.scope ?? null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });

    return transformConsentToResponse(consent);
  },

  /**
   * Get consent by ID
   */
  async getConsentById(id: string): Promise<ConsentResponse> {
    const consent = await prisma.consent.findUnique({
      where: { id },
    });

    if (!consent) {
      throw new NotFoundError('Consent not found');
    }

    return transformConsentToResponse(consent);
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
