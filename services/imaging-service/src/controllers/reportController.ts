import { Request, Response, NextFunction } from 'express';
import reportService from '../services/reportService';
import { CreateRadiologyReportDTO, UpdateRadiologyReportDTO } from '../types';
import { asyncHandler } from '../utils/errorHandler';

export const createReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const reportData: CreateRadiologyReportDTO = req.body;
    const report = await reportService.createReport(reportData);

    res.status(201).json({
      status: 'success',
      data: { report },
    });
  }
);

export const getReportById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const report = await reportService.getReportById(id);

    res.status(200).json({
      status: 'success',
      data: { report },
    });
  }
);

export const getReportsByStudy = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { studyId } = req.params;
    const reports = await reportService.getReportByStudyId(studyId);

    res.status(200).json({
      status: 'success',
      data: { reports },
    });
  }
);

export const updateReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updateData: UpdateRadiologyReportDTO = req.body;
    const report = await reportService.updateReport(id, updateData);

    res.status(200).json({
      status: 'success',
      data: { report },
    });
  }
);

export const signReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { signedBy } = req.body;
    const report = await reportService.signReport(id, signedBy);

    res.status(200).json({
      status: 'success',
      data: { report },
    });
  }
);

export const amendReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { amendmentReason, ...updates } = req.body;
    const report = await reportService.amendReport(id, amendmentReason, updates);

    res.status(200).json({
      status: 'success',
      data: { report },
    });
  }
);

export const getReportsByRadiologist = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { radiologistId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await reportService.getReportsByRadiologist(radiologistId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);

export const deleteReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    await reportService.deleteReport(id);

    res.status(204).send();
  }
);
