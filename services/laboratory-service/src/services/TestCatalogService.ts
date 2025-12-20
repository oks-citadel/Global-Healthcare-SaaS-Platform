import { PrismaClient, TestCategory } from '@prisma/client';
import { CreateTestCatalogInput, ReferenceRangeInput } from '../types';
import logger from '../utils/logger';

export class TestCatalogService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTest(input: CreateTestCatalogInput) {
    try {
      // Note: Using DiagnosticTest model from existing schema
      // In production with updated schema, you would use TestCatalog model
      const test = await this.prisma.diagnosticTest.create({
        data: {
          code: input.code,
          name: input.name,
          category: input.category,
          description: input.description,
          preparation: input.preparation,
          sampleType: input.sampleType,
          turnaroundTime: input.turnaroundTime,
          price: input.price,
          currency: input.currency || 'USD',
          isActive: true,
        },
      });

      logger.info('Test catalog entry created', {
        testId: test.id,
        code: test.code,
        name: test.name,
      });

      return test;
    } catch (error) {
      logger.error('Error creating test catalog entry', { error, input });
      throw error;
    }
  }

  async getTestById(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.findUnique({
        where: { id: testId },
      });

      return test;
    } catch (error) {
      logger.error('Error fetching test', { error, testId });
      throw error;
    }
  }

  async getTestByCode(code: string) {
    try {
      const test = await this.prisma.diagnosticTest.findUnique({
        where: { code },
      });

      return test;
    } catch (error) {
      logger.error('Error fetching test by code', { error, code });
      throw error;
    }
  }

  async getAllTests(filters?: {
    category?: TestCategory;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: any = {};

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { code: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [tests, total] = await Promise.all([
        this.prisma.diagnosticTest.findMany({
          where,
          orderBy: { name: 'asc' },
          take: filters?.limit || 50,
          skip: filters?.offset || 0,
        }),
        this.prisma.diagnosticTest.count({ where }),
      ]);

      return { tests, total };
    } catch (error) {
      logger.error('Error fetching tests', { error, filters });
      throw error;
    }
  }

  async getTestsByCategory(category: TestCategory) {
    return this.getAllTests({ category, isActive: true });
  }

  async updateTest(testId: string, updates: Partial<CreateTestCatalogInput>) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: updates,
      });

      logger.info('Test catalog entry updated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error updating test', { error, testId, updates });
      throw error;
    }
  }

  async deactivateTest(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: { isActive: false },
      });

      logger.info('Test catalog entry deactivated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error deactivating test', { error, testId });
      throw error;
    }
  }

  async activateTest(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: { isActive: true },
      });

      logger.info('Test catalog entry activated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error activating test', { error, testId });
      throw error;
    }
  }

  async deleteTest(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.delete({
        where: { id: testId },
      });

      logger.info('Test catalog entry deleted', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error deleting test', { error, testId });
      throw error;
    }
  }

  async searchTests(query: string, limit: number = 20) {
    return this.getAllTests({ search: query, isActive: true, limit });
  }

  async getTestStatistics() {
    try {
      const [total, active, inactive] = await Promise.all([
        this.prisma.diagnosticTest.count(),
        this.prisma.diagnosticTest.count({ where: { isActive: true } }),
        this.prisma.diagnosticTest.count({ where: { isActive: false } }),
      ]);

      // Count by category
      const categories = await this.prisma.diagnosticTest.groupBy({
        by: ['category'],
        _count: true,
        where: { isActive: true },
      });

      const byCategory = categories.reduce(
        (acc, curr) => {
          acc[curr.category] = curr._count;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        total,
        active,
        inactive,
        byCategory,
      };
    } catch (error) {
      logger.error('Error fetching test statistics', { error });
      throw error;
    }
  }

  // Reference Range Methods (for when ReferenceRange model is added)
  async addReferenceRange(testId: string, rangeData: ReferenceRangeInput) {
    // TODO: Implement when ReferenceRange model is added to schema
    logger.info('Reference range would be added (placeholder)', {
      testId,
      rangeData,
    });

    /*
    const range = await this.prisma.referenceRange.create({
      data: {
        testCatalogId: testId,
        ...rangeData,
      },
    });

    return range;
    */

    return null;
  }

  async getReferenceRanges(testId: string) {
    // TODO: Implement when ReferenceRange model is added to schema
    /*
    const ranges = await this.prisma.referenceRange.findMany({
      where: { testCatalogId: testId },
      orderBy: { componentName: 'asc' },
    });

    return ranges;
    */

    return [];
  }

  async updateReferenceRange(rangeId: string, updates: Partial<ReferenceRangeInput>) {
    // TODO: Implement when ReferenceRange model is added to schema
    /*
    const range = await this.prisma.referenceRange.update({
      where: { id: rangeId },
      data: updates,
    });

    return range;
    */

    return null;
  }

  async deleteReferenceRange(rangeId: string) {
    // TODO: Implement when ReferenceRange model is added to schema
    /*
    const range = await this.prisma.referenceRange.delete({
      where: { id: rangeId },
    });

    return range;
    */

    return null;
  }
}
