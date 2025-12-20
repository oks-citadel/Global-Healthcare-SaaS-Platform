import { Request, Response, NextFunction } from 'express';
import studyService from '../services/studyService';
import { CreateStudyDTO, UpdateStudyDTO, StudyFilters } from '../types';
import { asyncHandler } from '../utils/errorHandler';

export const createStudy = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const studyData: CreateStudyDTO = req.body;
    const study = await studyService.createStudy(studyData);

    res.status(201).json({
      status: 'success',
      data: { study },
    });
  }
);

export const getStudies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters: StudyFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      patientId: req.query.patientId as string,
      orderId: req.query.orderId as string,
      modality: req.query.modality as any,
      status: req.query.status as any,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };

    const result = await studyService.getStudies(filters);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);

export const getStudyById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const study = await studyService.getStudyById(id);

    res.status(200).json({
      status: 'success',
      data: { study },
    });
  }
);

export const updateStudy = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData: UpdateStudyDTO = req.body;
    const study = await studyService.updateStudy(id, updateData);

    res.status(200).json({
      status: 'success',
      data: { study },
    });
  }
);

export const updateStudyStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const study = await studyService.updateStudyStatus(id, status);

    res.status(200).json({
      status: 'success',
      data: { study },
    });
  }
);

export const getStudyByAccessionNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessionNumber } = req.params;
    const study = await studyService.getStudyByAccessionNumber(accessionNumber);

    res.status(200).json({
      status: 'success',
      data: { study },
    });
  }
);
