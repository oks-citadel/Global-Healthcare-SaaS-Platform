import { Request, Response, NextFunction } from 'express';
import criticalFindingService from '../services/criticalFindingService';
import { CreateCriticalFindingDTO, UpdateCriticalFindingDTO } from '../types';
import { asyncHandler } from '../utils/errorHandler';

export const createCriticalFinding = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const findingData: CreateCriticalFindingDTO = req.body;
    const finding = await criticalFindingService.createCriticalFinding(findingData);

    res.status(201).json({
      status: 'success',
      data: { finding },
    });
  }
);

export const getCriticalFindingById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const finding = await criticalFindingService.getCriticalFindingById(id);

    res.status(200).json({
      status: 'success',
      data: { finding },
    });
  }
);

export const getCriticalFindingsByStudy = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studyId } = req.params;
    const findings = await criticalFindingService.getCriticalFindingsByStudy(studyId);

    res.status(200).json({
      status: 'success',
      data: { findings },
    });
  }
);

export const updateCriticalFinding = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData: UpdateCriticalFindingDTO = req.body;
    const finding = await criticalFindingService.updateCriticalFinding(id, updateData);

    res.status(200).json({
      status: 'success',
      data: { finding },
    });
  }
);

export const acknowledgeCriticalFinding = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;
    const finding = await criticalFindingService.acknowledgeCriticalFinding(id, acknowledgedBy);

    res.status(200).json({
      status: 'success',
      data: { finding },
    });
  }
);

export const getPendingCriticalFindings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await criticalFindingService.getPendingCriticalFindings(page, limit);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);

export const getCriticalFindingsBySeverity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { severity } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await criticalFindingService.getCriticalFindingsBySeverity(
      severity as any,
      page,
      limit
    );

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);
