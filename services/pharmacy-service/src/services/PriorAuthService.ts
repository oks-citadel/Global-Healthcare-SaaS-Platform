import { PrismaClient, PriorAuthStatus, Prisma } from '../generated/client';

const prisma = new PrismaClient();

// Type for Prisma where clauses
type PriorAuthWhereInput = Prisma.PriorAuthorizationWhereInput;

export interface CreatePriorAuthData {
  prescriptionId: string;
  prescriptionItemId: string;
  patientId: string;
  providerId: string;
  payerId?: string;
  medicationName: string;
  ndcCode?: string;
  diagnosis: string[];
  justification: string;
  supportingDocs?: Record<string, unknown>;
}

export class PriorAuthService {
  /**
   * Submit a prior authorization request
   */
  async submitPriorAuth(data: CreatePriorAuthData) {
    const priorAuth = await prisma.priorAuthorization.create({
      data: {
        ...data,
        status: 'pending',
        requestDate: new Date(),
      },
    });

    return priorAuth;
  }

  /**
   * Get prior authorization details
   */
  async getPriorAuth(id: string) {
    return await prisma.priorAuthorization.findUnique({
      where: { id },
      include: {
        dispensings: true,
      },
    });
  }

  /**
   * List prior authorizations with filters
   */
  async listPriorAuths(filters: {
    patientId?: string;
    providerId?: string;
    status?: PriorAuthStatus;
    limit?: number;
    offset?: number;
  }) {
    const where: PriorAuthWhereInput = {};
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.providerId) where.providerId = filters.providerId;
    if (filters.status) where.status = filters.status;

    const [priorAuths, total] = await Promise.all([
      prisma.priorAuthorization.findMany({
        where,
        orderBy: { requestDate: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.priorAuthorization.count({ where }),
    ]);

    return { priorAuths, total };
  }

  /**
   * Approve a prior authorization
   */
  async approvePriorAuth(
    id: string,
    data: {
      authorizationNumber: string;
      expirationDate?: Date;
      reviewerNotes?: string;
    }
  ) {
    const now = new Date();

    // Default expiration: 1 year from approval
    const defaultExpiration = new Date();
    defaultExpiration.setFullYear(defaultExpiration.getFullYear() + 1);

    return await prisma.priorAuthorization.update({
      where: { id },
      data: {
        status: 'approved',
        approvalDate: now,
        approvalDate: now,
        authorizationNumber: data.authorizationNumber,
        expirationDate: data.expirationDate || defaultExpiration,
        reviewerNotes: data.reviewerNotes,
      },
    });
  }

  /**
   * Deny a prior authorization
   */
  async denyPriorAuth(
    id: string,
    data: {
      denialReason: string;
      reviewerNotes?: string;
    }
  ) {
    const now = new Date();

    return await prisma.priorAuthorization.update({
      where: { id },
      data: {
        status: 'denied',
        denialDate: now,
        approvalDate: now,
        denialReason: data.denialReason,
        reviewerNotes: data.reviewerNotes,
      },
    });
  }

  /**
   * Appeal a denied prior authorization
   */
  async appealPriorAuth(
    id: string,
    appealNotes: string
  ) {
    const priorAuth = await prisma.priorAuthorization.findUnique({
      where: { id },
    });

    if (!priorAuth) {
      throw new Error('Prior authorization not found');
    }

    if (priorAuth.status !== 'denied') {
      throw new Error('Can only appeal denied prior authorizations');
    }

    return await prisma.priorAuthorization.update({
      where: { id },
      data: {
        status: 'appealed',
        requestDate: new Date(),
        appealNotes,
      },
    });
  }

  /**
   * Check if medication requires prior authorization
   */
  async checkPriorAuthRequired(medicationId: string): Promise<boolean> {
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      select: { requiresPriorAuth: true },
    });

    return medication?.requiresPriorAuth || false;
  }

  /**
   * Check if patient has active prior auth for medication
   */
  async hasActivePriorAuth(
    patientId: string,
    medicationName: string
  ): Promise<{ hasAuth: boolean; priorAuth?: Awaited<ReturnType<typeof prisma.priorAuthorization.findFirst>> | undefined }> {
    const activePriorAuth = await prisma.priorAuthorization.findFirst({
      where: {
        patientId,
        medicationName: {
          contains: medicationName,
          mode: 'insensitive',
        },
        status: 'approved',
        expirationDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        approvalDate: 'desc',
      },
    });

    return {
      hasAuth: !!activePriorAuth,
      priorAuth: activePriorAuth || undefined,
    };
  }

  /**
   * Get prior auths expiring soon
   */
  async getExpiringSoon(daysAhead = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return await prisma.priorAuthorization.findMany({
      where: {
        status: 'approved',
        expirationDate: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });
  }

  /**
   * Mark expired prior authorizations
   */
  async markExpiredAuthorizations() {
    const now = new Date();

    const result = await prisma.priorAuthorization.updateMany({
      where: {
        status: 'approved',
        expirationDate: {
          lt: now,
        },
      },
      data: {
        status: 'expired',
      },
    });

    return result;
  }

  /**
   * Get prior auth statistics
   */
  async getStatistics(filters?: {
    providerId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: PriorAuthWhereInput = {};
    if (filters?.providerId) where.providerId = filters.providerId;
    if (filters?.startDate || filters?.endDate) {
      where.requestDate = {};
      if (filters.startDate) (where.requestDate as Record<string, Date>).gte = filters.startDate;
      if (filters.endDate) (where.requestDate as Record<string, Date>).lte = filters.endDate;
    }

    const [total, approved, denied, pending, appealed] = await Promise.all([
      prisma.priorAuthorization.count({ where }),
      prisma.priorAuthorization.count({ where: { ...where, status: 'approved' } }),
      prisma.priorAuthorization.count({ where: { ...where, status: 'denied' } }),
      prisma.priorAuthorization.count({ where: { ...where, status: 'pending' } }),
      prisma.priorAuthorization.count({ where: { ...where, status: 'appealed' } }),
    ]);

    return {
      total,
      approved,
      denied,
      pending,
      appealed,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      denialRate: total > 0 ? (denied / total) * 100 : 0,
    };
  }
}

export default new PriorAuthService();
