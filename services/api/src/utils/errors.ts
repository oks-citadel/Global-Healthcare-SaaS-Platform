/**
 * Error Classification
 */
export enum ErrorCategory {
  CLIENT = 'CLIENT',           // 4xx errors - client's fault
  SERVER = 'SERVER',           // 5xx errors - server's fault
  EXTERNAL = 'EXTERNAL',       // External service failures
  VALIDATION = 'VALIDATION',   // Data validation errors
  AUTHENTICATION = 'AUTHENTICATION', // Auth/authz errors
  BUSINESS = 'BUSINESS'        // Business logic violations
}

/**
 * Error Severity
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Error Codes Enum
 */
export enum ErrorCode {
  // General errors (1000-1999)
  INTERNAL_ERROR = 'ERR_1000',
  BAD_REQUEST = 'ERR_1001',
  UNAUTHORIZED = 'ERR_1002',
  FORBIDDEN = 'ERR_1003',
  NOT_FOUND = 'ERR_1004',
  CONFLICT = 'ERR_1005',
  VALIDATION_ERROR = 'ERR_1006',
  RATE_LIMIT_EXCEEDED = 'ERR_1007',
  SERVICE_UNAVAILABLE = 'ERR_1008',

  // Authentication errors (2000-2099)
  INVALID_CREDENTIALS = 'ERR_2000',
  TOKEN_EXPIRED = 'ERR_2001',
  TOKEN_INVALID = 'ERR_2002',
  TOKEN_MISSING = 'ERR_2003',
  SESSION_EXPIRED = 'ERR_2004',
  MFA_REQUIRED = 'ERR_2005',
  MFA_INVALID = 'ERR_2006',

  // Authorization errors (2100-2199)
  INSUFFICIENT_PERMISSIONS = 'ERR_2100',
  RESOURCE_ACCESS_DENIED = 'ERR_2101',
  ORGANIZATION_ACCESS_DENIED = 'ERR_2102',

  // User errors (3000-3099)
  USER_NOT_FOUND = 'ERR_3000',
  USER_ALREADY_EXISTS = 'ERR_3001',
  USER_INACTIVE = 'ERR_3002',
  USER_SUSPENDED = 'ERR_3003',
  INVALID_EMAIL = 'ERR_3004',
  WEAK_PASSWORD = 'ERR_3005',

  // Appointment errors (4000-4099)
  APPOINTMENT_NOT_FOUND = 'ERR_4000',
  APPOINTMENT_CONFLICT = 'ERR_4001',
  APPOINTMENT_PAST_DATE = 'ERR_4002',
  APPOINTMENT_CANCELLED = 'ERR_4003',
  APPOINTMENT_NOT_MODIFIABLE = 'ERR_4004',

  // Medical record errors (5000-5099)
  RECORD_NOT_FOUND = 'ERR_5000',
  RECORD_ACCESS_DENIED = 'ERR_5001',
  RECORD_LOCKED = 'ERR_5002',
  INVALID_MEDICAL_DATA = 'ERR_5003',

  // Payment errors (6000-6099)
  PAYMENT_FAILED = 'ERR_6000',
  PAYMENT_DECLINED = 'ERR_6001',
  INVALID_CARD = 'ERR_6002',
  INSUFFICIENT_FUNDS = 'ERR_6003',
  PAYMENT_GATEWAY_ERROR = 'ERR_6004',

  // External service errors (7000-7999)
  EMAIL_SERVICE_ERROR = 'ERR_7000',
  SMS_SERVICE_ERROR = 'ERR_7001',
  STORAGE_SERVICE_ERROR = 'ERR_7002',
  NOTIFICATION_SERVICE_ERROR = 'ERR_7003',
  PAYMENT_SERVICE_ERROR = 'ERR_7004',

  // Database errors (8000-8099)
  DATABASE_CONNECTION_ERROR = 'ERR_8000',
  DATABASE_QUERY_ERROR = 'ERR_8001',
  DATABASE_CONSTRAINT_VIOLATION = 'ERR_8002',
  DATABASE_DEADLOCK = 'ERR_8003',

  // Cache errors (8100-8199)
  CACHE_CONNECTION_ERROR = 'ERR_8100',
  CACHE_OPERATION_ERROR = 'ERR_8101',

  // File errors (9000-9099)
  FILE_NOT_FOUND = 'ERR_9000',
  FILE_TOO_LARGE = 'ERR_9001',
  INVALID_FILE_TYPE = 'ERR_9002',
  FILE_UPLOAD_FAILED = 'ERR_9003'
}

/**
 * Serializable error details
 */
export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  [key: string]: any;
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly details?: ErrorDetails[];
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    isOperational: boolean = true,
    category: ErrorCategory = ErrorCategory.SERVER,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: ErrorDetails[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.category = category;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date();
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      category: this.category,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId
    };
  }

  /**
   * Set request ID for correlation
   */
  setRequestId(requestId: string): this {
    (this as any).requestId = requestId;
    return this;
  }

  /**
   * Check if error should be reported to monitoring
   */
  shouldReport(): boolean {
    return !this.isOperational || this.severity === ErrorSeverity.CRITICAL;
  }
}

// Client Errors (4xx)

export class BadRequestError extends AppError {
  constructor(
    message: string = 'Bad request',
    code: ErrorCode = ErrorCode.BAD_REQUEST,
    details?: ErrorDetails[]
  ) {
    super(
      message,
      400,
      code,
      true,
      ErrorCategory.CLIENT,
      ErrorSeverity.LOW,
      details
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = 'Unauthorized',
    code: ErrorCode = ErrorCode.UNAUTHORIZED
  ) {
    super(
      message,
      401,
      code,
      true,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.MEDIUM
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = 'Forbidden',
    code: ErrorCode = ErrorCode.FORBIDDEN
  ) {
    super(
      message,
      403,
      code,
      true,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.MEDIUM
    );
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    code: ErrorCode = ErrorCode.NOT_FOUND
  ) {
    super(
      message,
      404,
      code,
      true,
      ErrorCategory.CLIENT,
      ErrorSeverity.LOW
    );
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = 'Resource conflict',
    code: ErrorCode = ErrorCode.CONFLICT,
    details?: ErrorDetails[]
  ) {
    super(
      message,
      409,
      code,
      true,
      ErrorCategory.BUSINESS,
      ErrorSeverity.MEDIUM,
      details
    );
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation error',
    code: ErrorCode = ErrorCode.VALIDATION_ERROR,
    details?: ErrorDetails[]
  ) {
    super(
      message,
      422,
      code,
      true,
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      details
    );
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number
  ) {
    super(
      message,
      429,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      true,
      ErrorCategory.CLIENT,
      ErrorSeverity.LOW,
      retryAfter ? [{ retryAfter }] : undefined
    );
  }
}

// Server Errors (5xx)

export class InternalError extends AppError {
  constructor(
    message: string = 'Internal server error',
    code: ErrorCode = ErrorCode.INTERNAL_ERROR
  ) {
    super(
      message,
      500,
      code,
      false,
      ErrorCategory.SERVER,
      ErrorSeverity.HIGH
    );
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message: string = 'Service temporarily unavailable',
    retryAfter?: number
  ) {
    super(
      message,
      503,
      ErrorCode.SERVICE_UNAVAILABLE,
      true,
      ErrorCategory.SERVER,
      ErrorSeverity.HIGH,
      retryAfter ? [{ retryAfter }] : undefined
    );
  }
}

// Authentication Errors

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message: string = 'Invalid credentials') {
    super(message, ErrorCode.INVALID_CREDENTIALS);
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = 'Token has expired') {
    super(message, ErrorCode.TOKEN_EXPIRED);
  }
}

export class TokenInvalidError extends UnauthorizedError {
  constructor(message: string = 'Invalid token') {
    super(message, ErrorCode.TOKEN_INVALID);
  }
}

export class MFARequiredError extends UnauthorizedError {
  constructor(message: string = 'Multi-factor authentication required') {
    super(message, ErrorCode.MFA_REQUIRED);
  }
}

// External Service Errors

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message: string,
    code: ErrorCode,
    isRetryable: boolean = true
  ) {
    super(
      `${service}: ${message}`,
      503,
      code,
      isRetryable,
      ErrorCategory.EXTERNAL,
      ErrorSeverity.HIGH
    );
  }
}

export class EmailServiceError extends ExternalServiceError {
  constructor(message: string = 'Email service error', isRetryable = true) {
    super('Email Service', message, ErrorCode.EMAIL_SERVICE_ERROR, isRetryable);
  }
}

export class SMSServiceError extends ExternalServiceError {
  constructor(message: string = 'SMS service error', isRetryable = true) {
    super('SMS Service', message, ErrorCode.SMS_SERVICE_ERROR, isRetryable);
  }
}

export class PaymentServiceError extends ExternalServiceError {
  constructor(message: string = 'Payment service error', isRetryable = true) {
    super('Payment Service', message, ErrorCode.PAYMENT_SERVICE_ERROR, isRetryable);
  }
}

export class StorageServiceError extends ExternalServiceError {
  constructor(message: string = 'Storage service error', isRetryable = true) {
    super('Storage Service', message, ErrorCode.STORAGE_SERVICE_ERROR, isRetryable);
  }
}

// Database Errors

export class DatabaseError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.DATABASE_QUERY_ERROR,
    isRetryable: boolean = false
  ) {
    super(
      message,
      500,
      code,
      isRetryable,
      ErrorCategory.SERVER,
      ErrorSeverity.CRITICAL
    );
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message: string = 'Database connection error') {
    super(message, ErrorCode.DATABASE_CONNECTION_ERROR, true);
  }
}

export class DatabaseDeadlockError extends DatabaseError {
  constructor(message: string = 'Database deadlock detected') {
    super(message, ErrorCode.DATABASE_DEADLOCK, true);
  }
}

// Domain-specific Errors

export class AppointmentError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    details?: ErrorDetails[]
  ) {
    super(
      message,
      400,
      code,
      true,
      ErrorCategory.BUSINESS,
      ErrorSeverity.MEDIUM,
      details
    );
  }
}

export class MedicalRecordError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 400
  ) {
    super(
      message,
      statusCode,
      code,
      true,
      ErrorCategory.BUSINESS,
      ErrorSeverity.HIGH
    );
  }
}

export class PaymentError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.PAYMENT_FAILED,
    details?: ErrorDetails[]
  ) {
    super(
      message,
      402,
      code,
      true,
      ErrorCategory.BUSINESS,
      ErrorSeverity.HIGH,
      details
    );
  }
}

/**
 * Error factory for creating errors from error codes
 */
export class ErrorFactory {
  static create(
    code: ErrorCode,
    message?: string,
    details?: ErrorDetails[]
  ): AppError {
    const defaultMessages: Record<ErrorCode, string> = {
      [ErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred',
      [ErrorCode.BAD_REQUEST]: 'Invalid request',
      [ErrorCode.UNAUTHORIZED]: 'Authentication required',
      [ErrorCode.FORBIDDEN]: 'Access denied',
      [ErrorCode.NOT_FOUND]: 'Resource not found',
      [ErrorCode.CONFLICT]: 'Resource conflict',
      [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
      [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests',
      [ErrorCode.SERVICE_UNAVAILABLE]: 'Service unavailable',
      [ErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password',
      [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired',
      [ErrorCode.TOKEN_INVALID]: 'Invalid authentication token',
      [ErrorCode.TOKEN_MISSING]: 'Authentication token required',
      [ErrorCode.SESSION_EXPIRED]: 'Your session has expired',
      [ErrorCode.MFA_REQUIRED]: 'Multi-factor authentication required',
      [ErrorCode.MFA_INVALID]: 'Invalid verification code',
      [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
      [ErrorCode.RESOURCE_ACCESS_DENIED]: 'Access to resource denied',
      [ErrorCode.ORGANIZATION_ACCESS_DENIED]: 'Organization access denied',
      [ErrorCode.USER_NOT_FOUND]: 'User not found',
      [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
      [ErrorCode.USER_INACTIVE]: 'User account is inactive',
      [ErrorCode.USER_SUSPENDED]: 'User account is suspended',
      [ErrorCode.INVALID_EMAIL]: 'Invalid email address',
      [ErrorCode.WEAK_PASSWORD]: 'Password does not meet requirements',
      [ErrorCode.APPOINTMENT_NOT_FOUND]: 'Appointment not found',
      [ErrorCode.APPOINTMENT_CONFLICT]: 'Appointment time conflict',
      [ErrorCode.APPOINTMENT_PAST_DATE]: 'Cannot schedule past appointment',
      [ErrorCode.APPOINTMENT_CANCELLED]: 'Appointment is cancelled',
      [ErrorCode.APPOINTMENT_NOT_MODIFIABLE]: 'Appointment cannot be modified',
      [ErrorCode.RECORD_NOT_FOUND]: 'Medical record not found',
      [ErrorCode.RECORD_ACCESS_DENIED]: 'Access to medical record denied',
      [ErrorCode.RECORD_LOCKED]: 'Medical record is locked',
      [ErrorCode.INVALID_MEDICAL_DATA]: 'Invalid medical data',
      [ErrorCode.PAYMENT_FAILED]: 'Payment failed',
      [ErrorCode.PAYMENT_DECLINED]: 'Payment declined',
      [ErrorCode.INVALID_CARD]: 'Invalid card information',
      [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds',
      [ErrorCode.PAYMENT_GATEWAY_ERROR]: 'Payment gateway error',
      [ErrorCode.EMAIL_SERVICE_ERROR]: 'Email service error',
      [ErrorCode.SMS_SERVICE_ERROR]: 'SMS service error',
      [ErrorCode.STORAGE_SERVICE_ERROR]: 'Storage service error',
      [ErrorCode.NOTIFICATION_SERVICE_ERROR]: 'Notification service error',
      [ErrorCode.PAYMENT_SERVICE_ERROR]: 'Payment service error',
      [ErrorCode.DATABASE_CONNECTION_ERROR]: 'Database connection error',
      [ErrorCode.DATABASE_QUERY_ERROR]: 'Database query error',
      [ErrorCode.DATABASE_CONSTRAINT_VIOLATION]: 'Database constraint violation',
      [ErrorCode.DATABASE_DEADLOCK]: 'Database deadlock',
      [ErrorCode.CACHE_CONNECTION_ERROR]: 'Cache connection error',
      [ErrorCode.CACHE_OPERATION_ERROR]: 'Cache operation error',
      [ErrorCode.FILE_NOT_FOUND]: 'File not found',
      [ErrorCode.FILE_TOO_LARGE]: 'File too large',
      [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type',
      [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed'
    };

    const errorMessage = message || defaultMessages[code] || 'An error occurred';

    // Map error codes to error classes
    if (code.startsWith('ERR_2')) {
      return new UnauthorizedError(errorMessage, code);
    } else if (code.startsWith('ERR_4')) {
      return new AppointmentError(errorMessage, code, details);
    } else if (code.startsWith('ERR_5')) {
      return new MedicalRecordError(errorMessage, code);
    } else if (code.startsWith('ERR_6')) {
      return new PaymentError(errorMessage, code, details);
    } else if (code.startsWith('ERR_7')) {
      return new ExternalServiceError('External Service', errorMessage, code);
    } else if (code.startsWith('ERR_8')) {
      return new DatabaseError(errorMessage, code);
    }

    return new AppError(errorMessage, 500, code);
  }
}

/**
 * Utility to check if an error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}
