import { PrismaClient, OrderStatus } from '../generated/client';
import { CreateLabOrderInput, UpdateLabOrderInput, FilterOptions } from '../types';
import logger from '../utils/logger';

export class OrderService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOrder(input: CreateLabOrderInput, providerId: string) {
    try {
      const orderNumber = this.generateOrderNumber();

      const order = await this.prisma.labOrder.create({
        data: {
          patientId: input.patientId,
          providerId,
          encounterId: input.encounterId,
          orderNumber,
          priority: input.priority || 'routine',
          clinicalInfo: input.clinicalInfo,
          tests: {
            create: input.tests.map((test) => ({
              testCode: test.testCode,
              testName: test.testName,
              category: test.category,
              status: 'pending',
            })),
          },
        },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });

      logger.info('Lab order created', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        patientId: order.patientId,
        providerId: order.providerId,
      });

      return order;
    } catch (error) {
      logger.error('Error creating lab order', { error, input });
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.prisma.labOrder.findUnique({
        where: { id: orderId },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      logger.error('Error fetching lab order', { error, orderId });
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string) {
    try {
      const order = await this.prisma.labOrder.findUnique({
        where: { orderNumber },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      logger.error('Error fetching lab order by number', { error, orderNumber });
      throw error;
    }
  }

  async getOrders(filters: FilterOptions) {
    try {
      const where: any = {};

      if (filters.patientId) {
        where.patientId = filters.patientId;
      }

      if (filters.providerId) {
        where.providerId = filters.providerId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.startDate || filters.endDate) {
        where.orderedAt = {};
        if (filters.startDate) {
          where.orderedAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.orderedAt.lte = filters.endDate;
        }
      }

      if (filters.category) {
        where.tests = {
          some: {
            category: filters.category,
          },
        };
      }

      const [orders, total] = await Promise.all([
        this.prisma.labOrder.findMany({
          where,
          include: {
            tests: {
              include: {
                results: true,
              },
            },
          },
          orderBy: { orderedAt: 'desc' },
          take: filters.limit || 20,
          skip: filters.offset || 0,
        }),
        this.prisma.labOrder.count({ where }),
      ]);

      return { orders, total };
    } catch (error) {
      logger.error('Error fetching lab orders', { error, filters });
      throw error;
    }
  }

  async updateOrder(orderId: string, input: UpdateLabOrderInput) {
    try {
      const updateData: any = {};

      if (input.status) {
        updateData.status = input.status;

        // Auto-set timestamps based on status
        if (input.status === 'collected' && !input.collectedAt) {
          updateData.collectedAt = new Date();
        }

        if (input.status === 'completed' && !input.completedAt) {
          updateData.completedAt = new Date();
        }
      }

      if (input.collectedAt) {
        updateData.collectedAt = input.collectedAt;
      }

      if (input.completedAt) {
        updateData.completedAt = input.completedAt;
      }

      if (input.reportUrl) {
        updateData.reportUrl = input.reportUrl;
      }

      const order = await this.prisma.labOrder.update({
        where: { id: orderId },
        data: updateData,
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });

      logger.info('Lab order updated', {
        orderId: order.id,
        status: order.status,
      });

      return order;
    } catch (error) {
      logger.error('Error updating lab order', { error, orderId, input });
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.updateOrder(orderId, { status });
  }

  async cancelOrder(orderId: string, reason?: string) {
    try {
      const order = await this.prisma.labOrder.update({
        where: { id: orderId },
        data: {
          status: 'cancelled',
          tests: {
            updateMany: {
              where: { orderId },
              data: { status: 'cancelled' },
            },
          },
        },
        include: {
          tests: true,
        },
      });

      logger.info('Lab order cancelled', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        reason,
      });

      return order;
    } catch (error) {
      logger.error('Error cancelling lab order', { error, orderId });
      throw error;
    }
  }

  async getOrdersByPatient(patientId: string, limit: number = 20, offset: number = 0) {
    return this.getOrders({ patientId, limit, offset });
  }

  async getOrdersByProvider(providerId: string, limit: number = 20, offset: number = 0) {
    return this.getOrders({ providerId, limit, offset });
  }

  async getOrderStatistics(patientId?: string, providerId?: string) {
    try {
      const where: any = {};

      if (patientId) {
        where.patientId = patientId;
      }

      if (providerId) {
        where.providerId = providerId;
      }

      const [
        total,
        pending,
        collected,
        processing,
        completed,
        cancelled,
        urgentOrders,
        statOrders,
      ] = await Promise.all([
        this.prisma.labOrder.count({ where }),
        this.prisma.labOrder.count({ where: { ...where, status: 'pending' } }),
        this.prisma.labOrder.count({ where: { ...where, status: 'collected' } }),
        this.prisma.labOrder.count({ where: { ...where, status: 'processing' } }),
        this.prisma.labOrder.count({ where: { ...where, status: 'completed' } }),
        this.prisma.labOrder.count({ where: { ...where, status: 'cancelled' } }),
        this.prisma.labOrder.count({ where: { ...where, priority: 'urgent' } }),
        this.prisma.labOrder.count({ where: { ...where, priority: 'stat' } }),
      ]);

      return {
        total,
        byStatus: {
          pending,
          collected,
          processing,
          completed,
          cancelled,
        },
        byPriority: {
          urgent: urgentOrders,
          stat: statOrders,
          routine: total - urgentOrders - statOrders,
        },
      };
    } catch (error) {
      logger.error('Error fetching order statistics', { error });
      throw error;
    }
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `LAB-${timestamp}-${random}`;
  }
}
