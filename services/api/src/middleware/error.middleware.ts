import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import {
  AppError,
  ErrorCategory,
  ErrorSeverity,
  ErrorCode,
  TokenExpiredError,
  TokenInvalidError,
  ValidationError,
  ErrorDetails
} from '../utils/errors.js';

/**
 * Sentry or error tracking integration placeholder
 * Replace with actual implementation when Sentry is configured
 */
interface ErrorTracker {
  captureException(error: Error, context?: any): void;
  captureMessage(message: string, level?: string): void;
}

// Placeholder for error tracker (to be replaced with actual Sentry instance)
let errorTracker: ErrorTracker | null = null;

export function initializeErrorTracking(tracker: ErrorTracker): void {
  errorTracker = tracker;
  logger.info('Error tracking initialized');
}

/**
 * Extract request ID from various sources
 */
function getRequestId(req: Request): string {
  return (
    (req.headers['x-request-id'] as string) ||
    (req.headers['x-correlation-id'] as string) ||
    (req as any).id ||
    'unknown'
  );
}

/**
 * Classify error category and severity
 */
function classifyError(err: Error): {
  category: ErrorCategory;
  severity: ErrorSeverity;
} {
  if (err instanceof AppError) {
    return {
      category: err.category,
      severity: err.severity
    };
  }

  // Default classification for unknown errors
  const statusCode = (err as any).statusCode || 500;

  if (statusCode >= 400 && statusCode < 500) {
    return {
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.LOW
    };
  }

  return {
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.HIGH
  };
}

/**
 * Check if error should be reported to tracking service
 */
function shouldReportError(err: Error): boolean {
  if (err instanceof AppError) {
    return err.shouldReport();
  }

  // Report all non-AppError errors
  return true;
}

/**
 * Sanitize error message for production
 */
function sanitizeErrorMessage(err: Error, isDevelopment: boolean): string {
  if (isDevelopment) {
    return err.message;
  }

  if (err instanceof AppError && err.isOperational) {
    return err.message;
  }

  // Don't expose internal error details in production
  return 'An unexpected error occurred';
}

/**
 * Build error context for tracking
 */
function buildErrorContext(req: Request, err: Error) {
  return {
    requestId: getRequestId(req),
    method: req.method,
    path: req.path,
    query: req.query,
    body: sanitizeRequestBody(req.body),
    headers: sanitizeHeaders(req.headers),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    user: (req as any).user
      ? {
          id: (req as any).user.id,
          email: (req as any).user.email,
          role: (req as any).user.role
        }
      : undefined,
    timestamp: new Date().toISOString()
  };
}

/**
 * Sanitize request body - remove sensitive fields
 */
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'accessToken',
    'refreshToken',
    'creditCard',
    'ssn',
    'socialSecurityNumber'
  ];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Sanitize headers - remove sensitive information
 */
function sanitizeHeaders(headers: any): any {
  const sanitized = { ...headers };
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-access-token'
  ];

  for (const header of sensitiveHeaders) {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Enhanced error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = getRequestId(req);
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const { category, severity } = classifyError(err);

  // Set request ID on AppError for correlation
  if (err instanceof AppError) {
    err.setRequestId(requestId);
  }

  // Build error context
  const errorContext = buildErrorContext(req, err);

  // Log the error with appropriate level
  const logLevel = severity === ErrorSeverity.CRITICAL ? 'error' : 'warn';
  logger[logLevel]('Request error', {
    error: {
      name: err.name,
      message: err.message,
      stack: isDevelopment ? err.stack : undefined,
      code: (err as any).code,
      category,
      severity
    },
    ...errorContext
  });

  // Report to error tracking service (e.g., Sentry)
  if (shouldReportError(err) && errorTracker) {
    try {
      errorTracker.captureException(err, {
        tags: {
          category,
          severity,
          requestId
        },
        extra: errorContext
      });
    } catch (trackingError) {
      logger.error('Failed to report error to tracking service', {
        error: trackingError instanceof Error ? trackingError.message : 'Unknown'
      });
    }
  }

  // Handle AppError - structured error response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      code: err.code,
      category: err.category,
      severity: err.severity,
      details: err.details,
      timestamp: err.timestamp.toISOString(),
      requestId,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details: ErrorDetails[] = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
      value: e.code !== 'invalid_type' ? undefined : e.message
    }));

    return res.status(422).json({
      error: 'ValidationError',
      message: 'Request validation failed',
      code: ErrorCode.VALIDATION_ERROR,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      details,
      timestamp: new Date().toISOString(),
      requestId,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const tokenError = new TokenInvalidError('Invalid authentication token');
    tokenError.setRequestId(requestId);

    return res.status(401).json({
      error: tokenError.name,
      message: tokenError.message,
      code: tokenError.code,
      category: tokenError.category,
      severity: tokenError.severity,
      timestamp: tokenError.timestamp.toISOString(),
      requestId
    });
  }

  if (err.name === 'TokenExpiredError') {
    const tokenError = new TokenExpiredError('Authentication token has expired');
    tokenError.setRequestId(requestId);

    return res.status(401).json({
      error: tokenError.name,
      message: tokenError.message,
      code: tokenError.code,
      category: tokenError.category,
      severity: tokenError.severity,
      timestamp: tokenError.timestamp.toISOString(),
      requestId
    });
  }

  // Handle Prisma errors
  if ((err as any).code?.startsWith('P')) {
    return handlePrismaError(err as any, req, res, requestId, isDevelopment);
  }

  // Handle multer (file upload) errors
  if (err.name === 'MulterError') {
    return handleMulterError(err as any, req, res, requestId);
  }

  // Default to 500 internal server error
  const statusCode = (err as any).statusCode || 500;
  const message = sanitizeErrorMessage(err, isDevelopment);

  return res.status(statusCode).json({
    error: 'InternalServerError',
    message,
    code: ErrorCode.INTERNAL_ERROR,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.HIGH,
    timestamp: new Date().toISOString(),
    requestId,
    ...(isDevelopment && { stack: err.stack })
  });
};

/**
 * Handle Prisma database errors
 */
function handlePrismaError(
  err: any,
  req: Request,
  res: Response,
  requestId: string,
  isDevelopment: boolean
) {
  const prismaErrorMap: Record<string, { status: number; code: ErrorCode; message: string }> = {
    P2002: {
      status: 409,
      code: ErrorCode.CONFLICT,
      message: 'A unique constraint would be violated'
    },
    P2025: {
      status: 404,
      code: ErrorCode.NOT_FOUND,
      message: 'Record not found'
    },
    P2003: {
      status: 400,
      code: ErrorCode.BAD_REQUEST,
      message: 'Foreign key constraint failed'
    },
    P2024: {
      status: 408,
      code: ErrorCode.DATABASE_CONNECTION_ERROR,
      message: 'Database connection timeout'
    }
  };

  const errorInfo = prismaErrorMap[err.code] || {
    status: 500,
    code: ErrorCode.DATABASE_QUERY_ERROR,
    message: 'Database operation failed'
  };

  return res.status(errorInfo.status).json({
    error: 'DatabaseError',
    message: errorInfo.message,
    code: errorInfo.code,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.HIGH,
    timestamp: new Date().toISOString(),
    requestId,
    ...(isDevelopment && { details: [{ prismaCode: err.code, meta: err.meta }] })
  });
}

/**
 * Handle Multer file upload errors
 */
function handleMulterError(
  err: any,
  req: Request,
  res: Response,
  requestId: string
) {
  const multerErrorMap: Record<string, { code: ErrorCode; message: string }> = {
    LIMIT_FILE_SIZE: {
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'File size exceeds the maximum allowed'
    },
    LIMIT_FILE_COUNT: {
      code: ErrorCode.BAD_REQUEST,
      message: 'Too many files uploaded'
    },
    LIMIT_UNEXPECTED_FILE: {
      code: ErrorCode.BAD_REQUEST,
      message: 'Unexpected file field'
    }
  };

  const errorInfo = multerErrorMap[err.code] || {
    code: ErrorCode.FILE_UPLOAD_FAILED,
    message: 'File upload failed'
  };

  return res.status(400).json({
    error: 'FileUploadError',
    message: errorInfo.message,
    code: errorInfo.code,
    category: ErrorCategory.CLIENT,
    severity: ErrorSeverity.LOW,
    timestamp: new Date().toISOString(),
    requestId
  });
}

/**
 * Async error wrapper - catches async errors in route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = getRequestId(req);

  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    requestId
  });

  return res.status(404).json({
    error: 'NotFoundError',
    message: `Route ${req.method} ${req.path} not found`,
    code: ErrorCode.NOT_FOUND,
    category: ErrorCategory.CLIENT,
    severity: ErrorSeverity.LOW,
    timestamp: new Date().toISOString(),
    requestId
  });
};
