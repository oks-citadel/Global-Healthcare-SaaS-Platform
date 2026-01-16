import { Provider, Prisma } from '../generated/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class ProviderRepository extends BaseRepository<Provider, typeof prisma.provider> {
  constructor() {
    super(prisma.provider, 'Provider');
  }

  /**
   * Find provider by user ID
   */
  async findByUserId(userId: string, include?: Prisma.ProviderInclude): Promise<Provider | null> {
    return this.model.findUnique({
      where: { userId },
      include,
    });
  }

  /**
   * Find provider by license number
   */
  async findByLicenseNumber(licenseNumber: string, include?: Prisma.ProviderInclude): Promise<Provider | null> {
    return this.model.findFirst({
      where: { licenseNumber },
      include,
    });
  }

  /**
   * Find providers by specialty
   */
  async findBySpecialty(specialty: string, include?: Prisma.ProviderInclude): Promise<Provider[]> {
    return this.model.findMany({
      where: {
        specialty: {
          has: specialty,
        },
      },
      include,
    });
  }

  /**
   * Find providers with any of the specialties
   */
  async findBySpecialties(specialties: string[], include?: Prisma.ProviderInclude): Promise<Provider[]> {
    return this.model.findMany({
      where: {
        specialty: {
          hasSome: specialties,
        },
      },
      include,
    });
  }

  /**
   * Find available providers
   */
  async findAvailable(include?: Prisma.ProviderInclude): Promise<Provider[]> {
    return this.model.findMany({
      where: { available: true },
      include,
    });
  }

  /**
   * Find available providers by specialty
   */
  async findAvailableBySpecialty(specialty: string): Promise<Provider[]> {
    return this.model.findMany({
      where: {
        available: true,
        specialty: {
          has: specialty,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Find provider with full details
   */
  async findWithFullDetails(id: string): Promise<Provider | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
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
          },
        },
        encounters: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Search providers by name, specialty, or license number
   */
  async searchProviders(
    query: string,
    options?: {
      limit?: number;
      includeUser?: boolean;
      onlyAvailable?: boolean;
    }
  ): Promise<Provider[]> {
    const where: Prisma.ProviderWhereInput = {
      OR: [
        { licenseNumber: { contains: query, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      ],
    };

    if (options?.onlyAvailable) {
      where.available = true;
    }

    const include: Prisma.ProviderInclude | undefined = options?.includeUser
      ? {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        }
      : undefined;

    return this.model.findMany({
      where,
      include,
      take: options?.limit || 50,
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  /**
   * Update provider availability
   */
  async updateAvailability(id: string, available: boolean): Promise<Provider> {
    return this.model.update({
      where: { id },
      data: { available },
    });
  }

  /**
   * Update provider specialties
   */
  async updateSpecialties(id: string, specialties: string[]): Promise<Provider> {
    return this.model.update({
      where: { id },
      data: { specialty: specialties },
    });
  }

  /**
   * Add specialty to provider
   */
  async addSpecialty(id: string, specialty: string): Promise<Provider> {
    const provider = await this.findById(id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const specialties = [...provider.specialty, specialty];
    return this.updateSpecialties(id, specialties);
  }

  /**
   * Remove specialty from provider
   */
  async removeSpecialty(id: string, specialty: string): Promise<Provider> {
    const provider = await this.findById(id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const specialties = provider.specialty.filter((s) => s !== specialty);
    return this.updateSpecialties(id, specialties);
  }

  /**
   * Find providers with upcoming appointments
   */
  async findWithUpcomingAppointments(fromDate?: Date): Promise<Provider[]> {
    const from = fromDate || new Date();

    return this.model.findMany({
      where: {
        appointments: {
          some: {
            scheduledAt: {
              gte: from,
            },
            status: {
              in: ['scheduled', 'confirmed'],
            },
          },
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        appointments: {
          where: {
            scheduledAt: {
              gte: from,
            },
            status: {
              in: ['scheduled', 'confirmed'],
            },
          },
          orderBy: { scheduledAt: 'asc' },
        },
      },
    });
  }

  /**
   * Count providers by specialty
   */
  async countBySpecialty(specialty: string): Promise<number> {
    return this.model.count({
      where: {
        specialty: {
          has: specialty,
        },
      },
    });
  }

  /**
   * Count available providers
   */
  async countAvailable(): Promise<number> {
    return this.model.count({
      where: { available: true },
    });
  }

  /**
   * Find recently created providers
   */
  async findRecentProviders(limit: number = 10): Promise<Provider[]> {
    return this.model.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if license number exists
   */
  async licenseExists(licenseNumber: string, excludeProviderId?: string): Promise<boolean> {
    const where: Prisma.ProviderWhereInput = { licenseNumber };

    if (excludeProviderId) {
      where.id = { not: excludeProviderId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string): Promise<{
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalEncounters: number;
  }> {
    const [
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalEncounters,
    ] = await Promise.all([
      prisma.appointment.count({ where: { providerId } }),
      prisma.appointment.count({ where: { providerId, status: 'completed' } }),
      prisma.appointment.count({ where: { providerId, status: 'cancelled' } }),
      prisma.encounter.count({ where: { providerId } }),
    ]);

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalEncounters,
    };
  }
}

export const providerRepository = new ProviderRepository();
