import { PrismaClient } from '../generated/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateImagingOrderDTO, UpdateImagingOrderDTO, ImagingOrderFilters } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

class OrderService {
  async createOrder(data: CreateImagingOrderDTO) {
    try {
      const orderNumber = `IMG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = await prisma.imagingOrder.create({
        data: {
          orderNumber,
          ...data,
        },
      });

      logger.info(`Imaging order created: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Error creating imaging order', error);
      throw new AppError('Failed to create imaging order', 500);
    }
  }

  async getOrders(filters: ImagingOrderFilters) {
    try {
      const {
        page = 1,
        limit = 10,
        patientId,
        providerId,
        facilityId,
        status,
        modality,
        priority,
        startDate,
        endDate,
      } = filters;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (patientId) where.patientId = patientId;
      if (providerId) where.providerId = providerId;
      if (facilityId) where.facilityId = facilityId;
      if (status) where.status = status;
      if (modality) where.modality = modality;
      if (priority) where.priority = priority;

      if (startDate || endDate) {
        where.requestedAt = {};
        if (startDate) where.requestedAt.gte = startDate;
        if (endDate) where.requestedAt.lte = endDate;
      }

      const [orders, total] = await Promise.all([
        prisma.imagingOrder.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            studies: {
              select: {
                id: true,
                accessionNumber: true,
                status: true,
              },
            },
          },
        }),
        prisma.imagingOrder.count({ where }),
      ]);

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching imaging orders', error);
      throw new AppError('Failed to fetch imaging orders', 500);
    }
  }

  async getOrderById(id: string) {
    try {
      const order = await prisma.imagingOrder.findUnique({
        where: { id },
        include: {
          studies: {
            include: {
              reports: true,
              criticalFindings: true,
            },
          },
        },
      });

      if (!order) {
        throw new AppError('Imaging order not found', 404);
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching imaging order', error);
      throw new AppError('Failed to fetch imaging order', 500);
    }
  }

  async updateOrder(id: string, data: UpdateImagingOrderDTO) {
    try {
      const order = await prisma.imagingOrder.update({
        where: { id },
        data,
      });

      logger.info(`Imaging order updated: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Error updating imaging order', error);
      throw new AppError('Failed to update imaging order', 500);
    }
  }

  async cancelOrder(id: string) {
    try {
      const order = await prisma.imagingOrder.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      logger.info(`Imaging order cancelled: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Error cancelling imaging order', error);
      throw new AppError('Failed to cancel imaging order', 500);
    }
  }

  async getOrdersByPatient(patientId: string) {
    try {
      const orders = await prisma.imagingOrder.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
          studies: {
            select: {
              id: true,
              accessionNumber: true,
              status: true,
              studyDate: true,
            },
          },
        },
      });

      return orders;
    } catch (error) {
      logger.error('Error fetching patient imaging orders', error);
      throw new AppError('Failed to fetch patient imaging orders', 500);
    }
  }
}

export default new OrderService();
