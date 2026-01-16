import { Patient, Gender, Prisma } from '../generated/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class PatientRepository extends BaseRepository<Patient, typeof prisma.patient> {
  constructor() {
    super(prisma.patient, 'Patient');
  }

  /**
   * Find patient by user ID
   */
  async findByUserId(userId: string, include?: Prisma.PatientInclude): Promise<Patient | null> {
    return this.model.findUnique({
      where: { userId },
      include,
    });
  }

  /**
   * Find patient by medical record number
   */
  async findByMRN(medicalRecordNumber: string, include?: Prisma.PatientInclude): Promise<Patient | null> {
    return this.model.findUnique({
      where: { medicalRecordNumber },
      include,
    });
  }

  /**
   * Find patients by gender
   */
  async findByGender(gender: Gender, include?: Prisma.PatientInclude): Promise<Patient[]> {
    return this.model.findMany({
      where: { gender },
      include,
    });
  }

  /**
   * Find patients by blood type
   */
  async findByBloodType(bloodType: string, include?: Prisma.PatientInclude): Promise<Patient[]> {
    return this.model.findMany({
      where: { bloodType },
      include,
    });
  }

  /**
   * Find patients with specific allergy
   */
  async findByAllergy(allergy: string): Promise<Patient[]> {
    return this.model.findMany({
      where: {
        allergies: {
          has: allergy,
        },
      },
    });
  }

  /**
   * Find patients with any allergies
   */
  async findWithAllergies(): Promise<Patient[]> {
    return this.model.findMany({
      where: {
        allergies: {
          isEmpty: false,
        },
      },
    });
  }

  /**
   * Find patient with full details
   */
  async findWithFullDetails(id: string): Promise<Patient | null> {
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
        },
        encounters: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        consents: true,
      },
    });
  }

  /**
   * Search patients by name or MRN
   */
  async searchPatients(
    query: string,
    options?: {
      limit?: number;
      includeUser?: boolean;
    }
  ): Promise<Patient[]> {
    const include: Prisma.PatientInclude | undefined = options?.includeUser
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
      where: {
        OR: [
          { medicalRecordNumber: { contains: query, mode: 'insensitive' } },
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
      },
      include,
      take: options?.limit || 50,
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  /**
   * Find patients by age range
   */
  async findByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    const now = new Date();
    const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const minDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());

    return this.model.findMany({
      where: {
        dateOfBirth: {
          gte: minDate,
          lte: maxDate,
        },
      },
    });
  }

  /**
   * Find patients with upcoming appointments
   */
  async findWithUpcomingAppointments(fromDate?: Date): Promise<Patient[]> {
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
   * Count patients by gender
   */
  async countByGender(gender: Gender): Promise<number> {
    return this.model.count({
      where: { gender },
    });
  }

  /**
   * Find recently created patients
   */
  async findRecentPatients(limit: number = 10): Promise<Patient[]> {
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
   * Check if MRN exists
   */
  async mrnExists(medicalRecordNumber: string, excludePatientId?: string): Promise<boolean> {
    const where: Prisma.PatientWhereInput = { medicalRecordNumber };

    if (excludePatientId) {
      where.id = { not: excludePatientId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Update patient allergies
   */
  async updateAllergies(id: string, allergies: string[]): Promise<Patient> {
    return this.model.update({
      where: { id },
      data: { allergies },
    });
  }

  /**
   * Add allergy to patient
   */
  async addAllergy(id: string, allergy: string): Promise<Patient> {
    const patient = await this.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const allergies = [...patient.allergies, allergy];
    return this.updateAllergies(id, allergies);
  }

  /**
   * Remove allergy from patient
   */
  async removeAllergy(id: string, allergy: string): Promise<Patient> {
    const patient = await this.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const allergies = patient.allergies.filter((a) => a !== allergy);
    return this.updateAllergies(id, allergies);
  }

  /**
   * Update emergency contact
   */
  async updateEmergencyContact(id: string, emergencyContact: any): Promise<Patient> {
    return this.model.update({
      where: { id },
      data: { emergencyContact },
    });
  }
}

export const patientRepository = new PatientRepository();
