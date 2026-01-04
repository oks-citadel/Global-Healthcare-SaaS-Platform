/**
 * Unit Tests for Error Classes
 */

import { describe, it, expect } from 'vitest';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
} from '../../../src/utils/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with message and status code', () => {
      const error = new AppError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should allow setting isOperational to false', () => {
      const error = new AppError('System error', 500, false);

      expect(error.isOperational).toBe(false);
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error', 400);

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AppError');
    });
  });

  describe('BadRequestError', () => {
    it('should create 400 error', () => {
      const error = new BadRequestError('Invalid input');

      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should be catchable as AppError', () => {
      const error = new BadRequestError('Test');

      const isBadRequest = error instanceof BadRequestError;
      const isAppError = error instanceof AppError;

      expect(isBadRequest).toBe(true);
      expect(isAppError).toBe(true);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create 401 error', () => {
      const error = new UnauthorizedError('Not authenticated');

      expect(error.message).toBe('Not authenticated');
      expect(error.statusCode).toBe(401);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('ForbiddenError', () => {
    it('should create 403 error', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('NotFoundError', () => {
    it('should create 404 error', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('ConflictError', () => {
    it('should create 409 error', () => {
      const error = new ConflictError('Resource already exists');

      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('TooManyRequestsError', () => {
    it('should create 429 error', () => {
      const error = new TooManyRequestsError('Rate limit exceeded');

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('InternalServerError', () => {
    it('should create 500 error', () => {
      const error = new InternalServerError('Server error');

      expect(error.message).toBe('Server error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false); // Non-operational by default
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('Error handling', () => {
    it('should work with try-catch', () => {
      let caughtError: AppError | null = null;

      try {
        throw new BadRequestError('Test error');
      } catch (error) {
        if (error instanceof AppError) {
          caughtError = error;
        }
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError?.statusCode).toBe(400);
    });

    it('should work with instanceof checks', () => {
      const errors = [
        new BadRequestError('Bad'),
        new UnauthorizedError('Unauth'),
        new NotFoundError('Not found'),
      ];

      const badRequests = errors.filter((e) => e instanceof BadRequestError);
      const appErrors = errors.filter((e) => e instanceof AppError);

      expect(badRequests).toHaveLength(1);
      expect(appErrors).toHaveLength(3);
    });

    it('should preserve error name', () => {
      const error = new UnauthorizedError('Test');

      expect(error.name).toBe('Error');
    });

    it('should be serializable to JSON', () => {
      const error = new BadRequestError('Validation failed');
      const serialized = JSON.stringify({
        message: error.message,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
      });

      const parsed = JSON.parse(serialized);

      expect(parsed.message).toBe('Validation failed');
      expect(parsed.statusCode).toBe(400);
    });
  });
});
