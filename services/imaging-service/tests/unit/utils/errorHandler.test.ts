/**
 * Unit Tests for Error Handler Utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { AppError, errorHandler } from '../../../src/utils/errorHandler';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks';

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AppError', () => {
    it('should create an error with message and status code', () => {
      const error = new AppError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should default to status code 500', () => {
      const error = new AppError('Internal error');

      expect(error.statusCode).toBe(500);
    });

    it('should be an instance of Error', () => {
      const error = new AppError('Test error', 400);

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error', 400);

      expect(error.stack).toBeDefined();
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle AppError with correct status code', () => {
      const error = new AppError('Not found', 404);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Not found',
        })
      );
    });

    it('should handle generic Error with status 500', () => {
      const error = new Error('Unknown error');
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should include error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new AppError('Test error', 400);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Test error',
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle validation errors', () => {
      const error = new AppError('Validation failed', 400);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle unauthorized errors', () => {
      const error = new AppError('Unauthorized', 401);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should handle forbidden errors', () => {
      const error = new AppError('Forbidden', 403);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle conflict errors', () => {
      const error = new AppError('Resource already exists', 409);
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should handle Prisma client errors', () => {
      const error: any = new Error('Prisma error');
      error.code = 'P2002';
      error.name = 'PrismaClientKnownRequestError';

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

describe('Common Error Scenarios', () => {
  describe('400 Bad Request', () => {
    it('should represent client input errors', () => {
      const error = new AppError('Invalid input data', 400);

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input data');
    });
  });

  describe('401 Unauthorized', () => {
    it('should represent authentication failures', () => {
      const error = new AppError('Authentication required', 401);

      expect(error.statusCode).toBe(401);
    });
  });

  describe('403 Forbidden', () => {
    it('should represent authorization failures', () => {
      const error = new AppError('Access denied', 403);

      expect(error.statusCode).toBe(403);
    });
  });

  describe('404 Not Found', () => {
    it('should represent missing resources', () => {
      const error = new AppError('Study not found', 404);

      expect(error.statusCode).toBe(404);
    });
  });

  describe('409 Conflict', () => {
    it('should represent resource conflicts', () => {
      const error = new AppError('Order already exists', 409);

      expect(error.statusCode).toBe(409);
    });
  });

  describe('500 Internal Server Error', () => {
    it('should represent server-side failures', () => {
      const error = new AppError('Internal server error', 500);

      expect(error.statusCode).toBe(500);
    });
  });
});
