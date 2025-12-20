import { Request, Response, NextFunction } from 'express';
import imageService from '../services/imageService';
import { CreateImageDTO } from '../types';
import { asyncHandler } from '../utils/errorHandler';

export const createImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const imageData: CreateImageDTO = req.body;
    const image = await imageService.createImage(imageData);

    res.status(201).json({
      status: 'success',
      data: { image },
    });
  }
);

export const getImagesByStudy = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const images = await imageService.getImagesByStudy(id);

    res.status(200).json({
      status: 'success',
      data: { images },
    });
  }
);

export const getImageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const image = await imageService.getImageById(id);

    res.status(200).json({
      status: 'success',
      data: { image },
    });
  }
);

export const getImagesBySeries = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, seriesUID } = req.params;
    const images = await imageService.getImagesBySeries(id, seriesUID);

    res.status(200).json({
      status: 'success',
      data: { images },
    });
  }
);

export const getImageUrl = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const expiresInMinutes = parseInt(req.query.expires as string) || 60;
    const url = await imageService.getImageUrl(id, expiresInMinutes);

    res.status(200).json({
      status: 'success',
      data: { url },
    });
  }
);

export const updateImageMetadata = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { metadata } = req.body;
    const image = await imageService.updateImageMetadata(id, metadata);

    res.status(200).json({
      status: 'success',
      data: { image },
    });
  }
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await imageService.deleteImage(id);

    res.status(204).send();
  }
);
