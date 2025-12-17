import { Consent, ConsentType, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class ConsentRepository extends BaseRepository<Consent, typeof prisma.consent> {
  constructor() {
    super(prisma.consent, 'Consent');
  }

  /**
   * Find consents by patient ID
   */
  async findByPatientId(
    patientId: string,
    include?: Prisma.ConsentInclude
  ): Promise<Consent[]> {
    return this.model.findMany({
      where: { patientId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find consents by patient and type
   */
  async findByPatientAndType(
    patientId: string,
    type: ConsentType,
    include?: Prisma.ConsentInclude
  ): Promise<Consent[]> {
    return this.model.findMany({
      where: {
        patientId,
        type,
      },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find active consent by patient and type
   */
  async findActiveByPatientAndType(
    patientId: string,
    type: ConsentType,
    include?: Prisma.ConsentInclude
  ): Promise<Consent | null> {
    return this.model.findFirst({
      where: {
        patientId,
        type,
        granted: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find consents by type
   */
  async findByType(
    type: ConsentType,
    include?: Prisma.ConsentInclude
  ): Promise<Consent[]> {
    return this.model.findMany({
      where: { type },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find granted consents
   */
  async findGranted(patientId?: string): Promise<Consent[]> {
    const where: Prisma.ConsentWhereInput = {
      granted: true,
    };

    if (patientId) {
      where.patientId = patientId;
    }

    return this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find revoked consents
   */
  async findRevoked(patientId?: string): Promise<Consent[]> {
    const where: Prisma.ConsentWhereInput = {
      granted: false,
    };

    if (patientId) {
      where.patientId = patientId;
    }

    return this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find expired consents
   */
  async findExpired(patientId?: string): Promise<Consent[]> {
    const where: Prisma.ConsentWhereInput = {
      granted: true,
      expiresAt: {
        lt: new Date(),
      },
    };

    if (patientId) {
      where.patientId = patientId;
    }

    return this.model.findMany({
      where,
      orderBy: { expiresAt: 'desc' },
    });
  }

  /**
   * Find expiring consents
   */
  async findExpiring(daysFromNow: number = 30, patientId?: string): Promise<Consent[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysFromNow);

    const where: Prisma.ConsentWhereInput = {
      granted: true,
      expiresAt: {
        lte: endDate,
        gt: new Date(),
      },
    };

    if (patientId) {
      where.patientId = patientId;
    }

    return this.model.findMany({
      where,
      orderBy: { expiresAt: 'asc' },
    });
  }

  /**
   * Check if patient has granted consent for a specific type
   */
  async hasGrantedConsent(patientId: string, type: ConsentType): Promise<boolean> {
    const consent = await this.findActiveByPatientAndType(patientId, type);
    return consent !== null;
  }

  /**
   * Grant consent
   */
  async grantConsent(
    patientId: string,
    type: ConsentType,
    options?: {
      scope?: string;
      expiresAt?: Date;
    }
  ): Promise<Consent> {
    return this.model.create({
      data: {
        patientId,
        type,
        granted: true,
        scope: options?.scope || null,
        expiresAt: options?.expiresAt || null,
      },
    });
  }

  /**
   * Revoke consent
   */
  async revokeConsent(
    patientId: string,
    type: ConsentType
  ): Promise<Consent> {
    return this.model.create({
      data: {
        patientId,
        type,
        granted: false,
      },
    });
  }

  /**
   * Update consent
   */
  async updateConsent(
    id: string,
    data: {
      granted?: boolean;
      scope?: string;
      expiresAt?: Date | null;
    }
  ): Promise<Consent> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Find consents by scope
   */
  async findByScope(scope: string): Promise<Consent[]> {
    return this.model.findMany({
      where: {
        scope: {
          contains: scope,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get consent history for patient
   */
  async getPatientHistory(patientId: string, type?: ConsentType): Promise<Consent[]> {
    const where: Prisma.ConsentWhereInput = { patientId };

    if (type) {
      where.type = type;
    }

    return this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count consents by type
   */
  async countByType(type: ConsentType): Promise<number> {
    return this.model.count({ where: { type } });
  }

  /**
   * Count granted consents by type
   */
  async countGrantedByType(type: ConsentType): Promise<number> {
    return this.model.count({
      where: {
        type,
        granted: true,
      },
    });
  }

  /**
   * Get consent statistics
   */
  async getStats(): Promise<{
    total: number;
    granted: number;
    revoked: number;
    expired: number;
    expiringIn30Days: number;
    byType: Record<ConsentType, { total: number; granted: number }>;
  }> {
    const [total, granted, revoked, expired, expiringIn30Days, byTypeData] = await Promise.all([
      this.count(),
      this.model.count({ where: { granted: true } }),
      this.model.count({ where: { granted: false } }),
      this.findExpired().then((consents) => consents.length),
      this.findExpiring(30).then((consents) => consents.length),
      this.model.groupBy({
        by: ['type', 'granted'],
        _count: true,
      }),
    ]);

    const byType: Record<ConsentType, { total: number; granted: number }> = {
      data_sharing: { total: 0, granted: 0 },
      treatment: { total: 0, granted: 0 },
      marketing: { total: 0, granted: 0 },
      research: { total: 0, granted: 0 },
    };

    byTypeData.forEach((item: any) => {
      if (!byType[item.type]) {
        byType[item.type] = { total: 0, granted: 0 };
      }
      byType[item.type].total += item._count;
      if (item.granted) {
        byType[item.type].granted += item._count;
      }
    });

    return {
      total,
      granted,
      revoked,
      expired,
      expiringIn30Days,
      byType,
    };
  }

  /**
   * Get patient consent summary
   */
  async getPatientSummary(patientId: string): Promise<{
    dataSharing: boolean;
    treatment: boolean;
    marketing: boolean;
    research: boolean;
  }> {
    const [dataSharing, treatment, marketing, research] = await Promise.all([
      this.hasGrantedConsent(patientId, 'data_sharing'),
      this.hasGrantedConsent(patientId, 'treatment'),
      this.hasGrantedConsent(patientId, 'marketing'),
      this.hasGrantedConsent(patientId, 'research'),
    ]);

    return {
      dataSharing,
      treatment,
      marketing,
      research,
    };
  }

  /**
   * Find consents needing renewal
   */
  async findNeedingRenewal(daysFromNow: number = 30): Promise<Consent[]> {
    return this.findExpiring(daysFromNow);
  }

  /**
   * Bulk grant consents for patient
   */
  async bulkGrantConsents(
    patientId: string,
    consents: Array<{
      type: ConsentType;
      scope?: string;
      expiresAt?: Date;
    }>
  ): Promise<{ count: number }> {
    const data = consents.map((consent) => ({
      patientId,
      type: consent.type,
      granted: true,
      scope: consent.scope || null,
      expiresAt: consent.expiresAt || null,
    }));

    return this.createMany(data);
  }

  /**
   * Get active consents with patient info
   */
  async findActiveWithPatientInfo(type?: ConsentType): Promise<Consent[]> {
    const where: Prisma.ConsentWhereInput = {
      granted: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    if (type) {
      where.type = type;
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
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const consentRepository = new ConsentRepository();
