import { Request, Response, NextFunction } from 'express';
import orderService from '../services/orderService';
import { CreateImagingOrderDTO, UpdateImagingOrderDTO, ImagingOrderFilters } from '../types';
import { asyncHandler } from '../utils/errorHandler';

export const createOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const orderData: CreateImagingOrderDTO = req.body;
    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      status: 'success',
      data: { order },
    });
  }
);

export const getOrders = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters: ImagingOrderFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      patientId: req.query.patientId as string,
      providerId: req.query.providerId as string,
      facilityId: req.query.facilityId as string,
      status: req.query.status as any,
      modality: req.query.modality as any,
      priority: req.query.priority as any,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };

    const result = await orderService.getOrders(filters);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  }
);

export const updateOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updateData: UpdateImagingOrderDTO = req.body;
    const order = await orderService.updateOrder(id, updateData);

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  }
);

export const cancelOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const order = await orderService.cancelOrder(id);

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  }
);

export const getOrdersByPatient = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { patientId } = req.params;
    const orders = await orderService.getOrdersByPatient(patientId);

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  }
);
