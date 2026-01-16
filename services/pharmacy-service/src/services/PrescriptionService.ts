import { PrismaClient, PrescriptionStatus } from '../generated/client';

const prisma = new PrismaClient();

export interface CreatePrescriptionData {
  patientId: string;
  providerId: string;
  encounterId?: string;
  notes?: string;
  validUntil?: Date;
  items: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration?: string;
    quantity?: number;
    refillsAllowed: number;
    instructions?: string;
    isGenericAllowed: boolean;
    ndcCode?: string;
    rxNormCode?: string;
    deaSchedule?: string;
  }>;
}

export interface UpdatePrescriptionData {
  status?: PrescriptionStatus;
  notes?: string;
  validUntil?: Date;
}

export class PrescriptionService {
  async createPrescription(data: CreatePrescriptionData) {
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        encounterId: data.encounterId,
        notes: data.notes,
        validUntil: data.validUntil,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
      },
    });

    return prescription;
  }

  async getPrescription(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return prescription;
  }

  async listPrescriptions(filters: {
    patientId?: string;
    providerId?: string;
    status?: PrescriptionStatus;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.providerId) where.providerId = filters.providerId;
    if (filters.status) where.status = filters.status;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.prescription.count({ where }),
    ]);

    return { prescriptions, total };
  }

  async updatePrescription(id: string, data: UpdatePrescriptionData) {
    const prescription = await prisma.prescription.update({
      where: { id },
      data,
      include: { items: true },
    });

    return prescription;
  }

  async cancelPrescription(id: string) {
    return this.updatePrescription(id, { status: 'cancelled' });
  }

  async checkExpiredPrescriptions() {
    const now = new Date();
    const expiredCount = await prisma.prescription.updateMany({
      where: {
        validUntil: {
          lte: now,
        },
        status: 'active',
      },
      data: {
        status: 'expired',
      },
    });

    return expiredCount;
  }

  async getRefillsRemaining(prescriptionItemId: string) {
    const item = await prisma.prescriptionItem.findUnique({
      where: { id: prescriptionItemId },
    });

    if (!item) return null;

    return {
      allowed: item.refillsAllowed,
      used: item.refillsUsed,
      remaining: item.refillsAllowed - item.refillsUsed,
    };
  }

  async incrementRefillCount(prescriptionItemId: string) {
    const item = await prisma.prescriptionItem.update({
      where: { id: prescriptionItemId },
      data: {
        refillsUsed: {
          increment: 1,
        },
      },
    });

    return item;
  }
}

export default new PrescriptionService();
