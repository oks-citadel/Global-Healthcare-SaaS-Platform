import {
  PrismaClient,
  Vendor,
  VendorStatus,
  VendorCategory,
  VendorTier,
  RiskLevel,
  DataAccessLevel,
} from '../generated/client';
import { addMonths } from 'date-fns';

const prisma = new PrismaClient();

export interface CreateVendorData {
  name: string;
  legalName?: string;
  dbaName?: string;
  taxId?: string;
  dunsNumber?: string;
  website?: string;
  description?: string;
  category: VendorCategory;
  tier?: VendorTier;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  address?: Record<string, unknown>;
  dataAccessLevel?: DataAccessLevel;
  phiAccess?: boolean;
  piiAccess?: boolean;
  notes?: string;
  createdBy?: string;
}

export interface UpdateVendorData {
  name?: string;
  legalName?: string;
  dbaName?: string;
  taxId?: string;
  dunsNumber?: string;
  website?: string;
  description?: string;
  category?: VendorCategory;
  tier?: VendorTier;
  status?: VendorStatus;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  address?: Record<string, unknown>;
  dataAccessLevel?: DataAccessLevel;
  phiAccess?: boolean;
  piiAccess?: boolean;
  notes?: string;
  updatedBy?: string;
}

export interface VendorFilters {
  status?: VendorStatus;
  category?: VendorCategory;
  tier?: VendorTier;
  riskLevel?: RiskLevel;
  phiAccess?: boolean;
  piiAccess?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export class VendorService {
  async createVendor(data: CreateVendorData): Promise<Vendor> {
    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        legalName: data.legalName,
        dbaName: data.dbaName,
        taxId: data.taxId,
        dunsNumber: data.dunsNumber,
        website: data.website,
        description: data.description,
        category: data.category,
        tier: data.tier || VendorTier.TIER_3,
        primaryContactName: data.primaryContactName,
        primaryContactEmail: data.primaryContactEmail,
        primaryContactPhone: data.primaryContactPhone,
        address: data.address,
        dataAccessLevel: data.dataAccessLevel || DataAccessLevel.NONE,
        phiAccess: data.phiAccess || false,
        piiAccess: data.piiAccess || false,
        notes: data.notes,
        createdBy: data.createdBy,
        // Set next review date based on tier
        nextReviewDate: this.calculateNextReviewDate(data.tier || VendorTier.TIER_3),
      },
    });

    return vendor;
  }

  async getVendor(id: string): Promise<Vendor | null> {
    return prisma.vendor.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        contracts: {
          where: { status: 'ACTIVE' },
        },
        certifications: {
          where: { status: 'VALID' },
        },
        incidents: {
          where: {
            status: {
              notIn: ['CLOSED'],
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        remediations: {
          where: {
            status: {
              notIn: ['COMPLETED', 'CANCELLED'],
            },
          },
        },
      },
    });
  }

  async listVendors(filters: VendorFilters): Promise<{ vendors: Vendor[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.tier) where.tier = filters.tier;
    if (filters.riskLevel) where.riskLevel = filters.riskLevel;
    if (filters.phiAccess !== undefined) where.phiAccess = filters.phiAccess;
    if (filters.piiAccess !== undefined) where.piiAccess = filters.piiAccess;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { legalName: { contains: filters.search, mode: 'insensitive' } },
        { dbaName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where: where as Parameters<typeof prisma.vendor.findMany>[0]['where'],
        orderBy: { name: 'asc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
        include: {
          _count: {
            select: {
              assessments: true,
              contracts: true,
              incidents: true,
            },
          },
        },
      }),
      prisma.vendor.count({ where: where as Parameters<typeof prisma.vendor.count>[0]['where'] }),
    ]);

    return { vendors, total };
  }

  async updateVendor(id: string, data: UpdateVendorData): Promise<Vendor> {
    const updateData: Record<string, unknown> = { ...data };

    // If tier is changing, update the next review date
    if (data.tier) {
      updateData.nextReviewDate = this.calculateNextReviewDate(data.tier);
    }

    return prisma.vendor.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.vendor.update>[0]['data'],
    });
  }

  async updateVendorStatus(id: string, status: VendorStatus, userId?: string): Promise<Vendor> {
    const updateData: Record<string, unknown> = {
      status,
      updatedBy: userId,
    };

    if (status === VendorStatus.APPROVED) {
      updateData.onboardingDate = new Date();
    }

    return prisma.vendor.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.vendor.update>[0]['data'],
    });
  }

  async updateRiskScore(id: string, riskScore: number, riskLevel: RiskLevel): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data: {
        riskScore,
        riskLevel,
        lastReviewDate: new Date(),
      },
    });
  }

  async getVendorsDueForReview(daysAhead: number = 30): Promise<Vendor[]> {
    const futureDate = addMonths(new Date(), 0);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return prisma.vendor.findMany({
      where: {
        status: VendorStatus.APPROVED,
        nextReviewDate: {
          lte: futureDate,
        },
      },
      orderBy: { nextReviewDate: 'asc' },
    });
  }

  async getHighRiskVendors(): Promise<Vendor[]> {
    return prisma.vendor.findMany({
      where: {
        riskLevel: {
          in: [RiskLevel.CRITICAL, RiskLevel.HIGH],
        },
        status: VendorStatus.APPROVED,
      },
      include: {
        incidents: {
          where: {
            status: { notIn: ['CLOSED'] },
          },
        },
        remediations: {
          where: {
            status: { notIn: ['COMPLETED', 'CANCELLED'] },
          },
        },
      },
      orderBy: { riskScore: 'desc' },
    });
  }

  async getVendorStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byTier: Record<string, number>;
    byRiskLevel: Record<string, number>;
    byCategory: Record<string, number>;
    phiAccessCount: number;
    piiAccessCount: number;
  }> {
    const [
      total,
      byStatus,
      byTier,
      byRiskLevel,
      byCategory,
      phiAccessCount,
      piiAccessCount,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.vendor.groupBy({
        by: ['tier'],
        _count: true,
      }),
      prisma.vendor.groupBy({
        by: ['riskLevel'],
        _count: true,
      }),
      prisma.vendor.groupBy({
        by: ['category'],
        _count: true,
      }),
      prisma.vendor.count({ where: { phiAccess: true } }),
      prisma.vendor.count({ where: { piiAccess: true } }),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
      byTier: Object.fromEntries(byTier.map((t) => [t.tier, t._count])),
      byRiskLevel: Object.fromEntries(byRiskLevel.map((r) => [r.riskLevel, r._count])),
      byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
      phiAccessCount,
      piiAccessCount,
    };
  }

  async archiveVendor(id: string, userId?: string): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data: {
        status: VendorStatus.ARCHIVED,
        updatedBy: userId,
      },
    });
  }

  private calculateNextReviewDate(tier: VendorTier): Date {
    const now = new Date();
    switch (tier) {
      case VendorTier.TIER_1:
        return addMonths(now, 3); // Quarterly for critical vendors
      case VendorTier.TIER_2:
        return addMonths(now, 6); // Semi-annually for important vendors
      case VendorTier.TIER_3:
        return addMonths(now, 12); // Annually for standard vendors
      case VendorTier.TIER_4:
        return addMonths(now, 24); // Every 2 years for minimal risk
      default:
        return addMonths(now, 12);
    }
  }
}

export default new VendorService();
