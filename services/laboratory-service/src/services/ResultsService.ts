import { PrismaClient, LabResult } from '@prisma/client';
import { CreateLabResultInput } from '../types';
import logger from '../utils/logger';
import { validateReferenceRange, validateCriticalValue } from '../utils/validators';

export class ResultsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createResult(input: CreateLabResultInput, performedBy: string) {
    try {
      // Auto-detect abnormal values if reference range provided
      let isAbnormal = input.isAbnormal || false;
      let isCritical = input.isCritical || false;
      let abnormalFlag = input.abnormalFlag;

      if (input.numericValue && input.referenceRange) {
        const validation = validateReferenceRange(input.numericValue, input.referenceRange);
        isAbnormal = validation.isAbnormal;
        isCritical = validation.isCritical;
        abnormalFlag = validation.abnormalFlag;
      }

      const result = await this.prisma.labResult.create({
        data: {
          testId: input.testId,
          componentCode: input.componentCode,
          componentName: input.componentName,
          value: input.value,
          numericValue: input.numericValue,
          unit: input.unit,
          referenceRange: input.referenceRange,
          isAbnormal,
          isCritical,
          abnormalFlag: abnormalFlag as any,
          interpretation: input.interpretation,
          notes: input.notes,
          performedBy,
          verifiedBy: input.verifiedBy,
        },
      });

      // Update test status
      await this.updateTestStatus(input.testId);

      logger.info('Lab result created', {
        resultId: result.id,
        testId: result.testId,
        isAbnormal,
        isCritical,
      });

      return result;
    } catch (error) {
      logger.error('Error creating lab result', { error, input });
      throw error;
    }
  }

  async createBulkResults(testId: string, results: Omit<CreateLabResultInput, 'testId'>[], performedBy: string) {
    try {
      const createdResults = await Promise.all(
        results.map((result) =>
          this.createResult({ ...result, testId }, performedBy)
        )
      );

      logger.info('Bulk lab results created', {
        testId,
        count: createdResults.length,
      });

      return createdResults;
    } catch (error) {
      logger.error('Error creating bulk lab results', { error, testId });
      throw error;
    }
  }

  async getResultById(resultId: string) {
    try {
      const result = await this.prisma.labResult.findUnique({
        where: { id: resultId },
        include: {
          test: {
            include: {
              order: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      logger.error('Error fetching lab result', { error, resultId });
      throw error;
    }
  }

  async getResultsByTest(testId: string) {
    try {
      const results = await this.prisma.labResult.findMany({
        where: { testId },
        orderBy: { resultedAt: 'asc' },
      });

      return results;
    } catch (error) {
      logger.error('Error fetching test results', { error, testId });
      throw error;
    }
  }

  async getResultsByOrder(orderId: string) {
    try {
      const results = await this.prisma.labResult.findMany({
        where: {
          test: {
            orderId,
          },
        },
        include: {
          test: true,
        },
        orderBy: { resultedAt: 'asc' },
      });

      return results;
    } catch (error) {
      logger.error('Error fetching order results', { error, orderId });
      throw error;
    }
  }

  async getResultsByPatient(patientId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: any = {
        test: {
          order: {
            patientId,
            status: 'completed',
          },
        },
      };

      if (filters?.startDate || filters?.endDate) {
        where.resultedAt = {};
        if (filters.startDate) {
          where.resultedAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.resultedAt.lte = filters.endDate;
        }
      }

      if (filters?.category) {
        where.test.category = filters.category;
      }

      const [results, total] = await Promise.all([
        this.prisma.labResult.findMany({
          where,
          include: {
            test: {
              include: {
                order: {
                  select: {
                    orderNumber: true,
                    orderedAt: true,
                    providerId: true,
                  },
                },
              },
            },
          },
          orderBy: { resultedAt: 'desc' },
          take: filters?.limit || 50,
          skip: filters?.offset || 0,
        }),
        this.prisma.labResult.count({ where }),
      ]);

      return { results, total };
    } catch (error) {
      logger.error('Error fetching patient results', { error, patientId });
      throw error;
    }
  }

  async getAbnormalResults(patientId?: string, limit: number = 20) {
    try {
      const where: any = {
        isAbnormal: true,
      };

      if (patientId) {
        where.test = {
          order: {
            patientId,
          },
        };
      }

      const results = await this.prisma.labResult.findMany({
        where,
        include: {
          test: {
            include: {
              order: true,
            },
          },
        },
        orderBy: { resultedAt: 'desc' },
        take: limit,
      });

      return results;
    } catch (error) {
      logger.error('Error fetching abnormal results', { error, patientId });
      throw error;
    }
  }

  async getCriticalResults(limit: number = 20) {
    try {
      const results = await this.prisma.labResult.findMany({
        where: {
          isCritical: true,
        },
        include: {
          test: {
            include: {
              order: true,
            },
          },
        },
        orderBy: { resultedAt: 'desc' },
        take: limit,
      });

      return results;
    } catch (error) {
      logger.error('Error fetching critical results', { error });
      throw error;
    }
  }

  async verifyResult(resultId: string, verifiedBy: string) {
    try {
      const result = await this.prisma.labResult.update({
        where: { id: resultId },
        data: {
          verifiedBy,
          verifiedAt: new Date(),
        },
      });

      logger.info('Lab result verified', {
        resultId: result.id,
        verifiedBy,
      });

      return result;
    } catch (error) {
      logger.error('Error verifying lab result', { error, resultId });
      throw error;
    }
  }

  async updateResult(resultId: string, updates: Partial<CreateLabResultInput>) {
    try {
      const result = await this.prisma.labResult.update({
        where: { id: resultId },
        data: updates,
      });

      logger.info('Lab result updated', {
        resultId: result.id,
      });

      return result;
    } catch (error) {
      logger.error('Error updating lab result', { error, resultId });
      throw error;
    }
  }

  async deleteResult(resultId: string) {
    try {
      const result = await this.prisma.labResult.delete({
        where: { id: resultId },
      });

      logger.info('Lab result deleted', {
        resultId: result.id,
      });

      return result;
    } catch (error) {
      logger.error('Error deleting lab result', { error, resultId });
      throw error;
    }
  }

  private async updateTestStatus(testId: string) {
    try {
      // Check if all components have results
      const test = await this.prisma.labTest.findUnique({
        where: { id: testId },
        include: {
          results: true,
        },
      });

      if (!test) {
        return;
      }

      // If test has results and some are verified, mark as completed
      if (test.results.length > 0) {
        const allVerified = test.results.every((r) => r.verifiedBy);

        await this.prisma.labTest.update({
          where: { id: testId },
          data: {
            status: allVerified ? 'completed' : 'processing',
          },
        });

        // Update order status if all tests are completed
        await this.updateOrderStatus(test.orderId);
      }
    } catch (error) {
      logger.error('Error updating test status', { error, testId });
    }
  }

  private async updateOrderStatus(orderId: string) {
    try {
      const order = await this.prisma.labOrder.findUnique({
        where: { id: orderId },
        include: {
          tests: true,
        },
      });

      if (!order) {
        return;
      }

      const allCompleted = order.tests.every((t) => t.status === 'completed');
      const someCompleted = order.tests.some((t) => t.status === 'completed');

      if (allCompleted) {
        await this.prisma.labOrder.update({
          where: { id: orderId },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        });
      } else if (someCompleted) {
        await this.prisma.labOrder.update({
          where: { id: orderId },
          data: {
            status: 'processing',
          },
        });
      }
    } catch (error) {
      logger.error('Error updating order status', { error, orderId });
    }
  }
}
