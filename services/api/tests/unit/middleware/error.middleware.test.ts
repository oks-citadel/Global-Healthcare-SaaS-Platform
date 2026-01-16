import { describe, it, expect, beforeEach, vi } from 'vitest';
import { errorHandler, notFoundHandler, asyncHandler } from '../../../src/middleware/error.middleware.js';
import { AppError, UnauthorizedError, ValidationError, ErrorCode, ErrorCategory, ErrorSeverity } from '../../../src/utils/errors.js';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks.js';
import { ZodError } from 'zod';

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Error Middleware', () => {
  describe('errorHandler', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
      process.env.NODE_ENV = 'test';
    });

    it('should handle AppError', () => {
      const error = new UnauthorizedError('Unauthorized access');
      req.headers['x-request-id'] = 'test-request-id';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'UnauthorizedError',
          message: 'Unauthorized access',
          code: ErrorCode.UNAUTHORIZED,
          category: ErrorCategory.AUTHENTICATION,
          severity: ErrorSeverity.MEDIUM,
          requestId: 'test-request-id',
        })
      );
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Test error');
      req.headers['x-request-id'] = 'test-id';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('stack');
    });

    it('should not include stack trace in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('Test error');

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');
    });

    it('should handle Zod validation errors', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          path: ['email'],
          message: 'Invalid email',
          expected: 'string',
          received: 'number',
        },
      ]);

      errorHandler(zodError as any, req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'ValidationError',
          code: ErrorCode.VALIDATION_ERROR,
          category: ErrorCategory.VALIDATION,
          details: expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Invalid email',
            }),
          ]),
        })
      );
    });

    it('should handle JWT JsonWebTokenError', () => {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'TokenInvalidError',
          code: ErrorCode.TOKEN_INVALID,
        })
      );
    });

    it('should handle JWT TokenExpiredError', () => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'TokenExpiredError',
          code: ErrorCode.TOKEN_EXPIRED,
        })
      );
    });

    it('should handle Prisma unique constraint violation', () => {
      const error = {
        code: 'P2002',
        meta: { target: ['email'] },
        message: 'Unique constraint failed',
      };

      errorHandler(error as any, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'DatabaseError',
          code: ErrorCode.CONFLICT,
        })
      );
    });

    it('should handle Prisma record not found', () => {
      const error = {
        code: 'P2025',
        message: 'Record not found',
      };

      errorHandler(error as any, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'DatabaseError',
          code: ErrorCode.NOT_FOUND,
        })
      );
    });

    it('should handle Multer file size error', () => {
      const error = {
        name: 'MulterError',
        code: 'LIMIT_FILE_SIZE',
        message: 'File too large',
      };

      errorHandler(error as any, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'FileUploadError',
          code: ErrorCode.FILE_TOO_LARGE,
        })
      );
    });

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'InternalServerError',
          code: ErrorCode.INTERNAL_ERROR,
          category: ErrorCategory.SERVER,
          severity: ErrorSeverity.HIGH,
        })
      );
    });

    it('should sanitize error message in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Sensitive internal error details');
      (error as any).statusCode = 500;

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.message).toBe('An unexpected error occurred');
    });

    it('should preserve operational error message in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new ValidationError('Invalid input data');

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.message).toBe('Invalid input data');
    });

    it('should extract request ID from various headers', () => {
      req.headers['x-correlation-id'] = 'correlation-123';

      const error = new AppError('Test error');
      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.requestId).toBe('correlation-123');
    });

    it('should use unknown request ID if not provided', () => {
      const error = new AppError('Test error');
      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.requestId).toBe('unknown');
    });

    it('should handle errors with custom status codes', () => {
      const error = new Error('Custom error');
      (error as any).statusCode = 418;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(418);
    });
  });

  describe('notFoundHandler', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should return 404 error', () => {
      req.method = 'GET';
      req.path = '/api/nonexistent';

      notFoundHandler(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'NotFoundError',
          message: 'Route GET /api/nonexistent not found',
          code: ErrorCode.NOT_FOUND,
          category: ErrorCategory.CLIENT,
          severity: ErrorSeverity.LOW,
        })
      );
    });

    it('should include request ID', () => {
      req.method = 'POST';
      req.path = '/api/test';
      req.headers['x-request-id'] = 'test-id';

      notFoundHandler(req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.requestId).toBe('test-id');
    });
  });

  describe('asyncHandler', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should handle successful async operations', async () => {
      const handler = asyncHandler(async (req, res) => {
        res.json({ success: true });
      });

      await handler(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch async errors', async () => {
      const error = new Error('Async error');
      const handler = asyncHandler(async () => {
        throw error;
      });

      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should catch rejected promises', async () => {
      const error = new Error('Promise rejection');
      const handler = asyncHandler(async () => {
        throw error;
      });

      // The handler returns immediately, but we need to wait for the Promise to settle
      handler(req, res, next);

      // Wait for the microtask queue to flush
      await new Promise(resolve => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should pass through non-async handlers', async () => {
      const handler = asyncHandler((req, res) => {
        res.json({ data: 'test' });
        return Promise.resolve();
      });

      await handler(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ data: 'test' });
    });
  });
});
