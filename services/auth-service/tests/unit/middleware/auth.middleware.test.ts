/**
 * Unit Tests for Auth Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks';
import { mockJwtPayload } from '../helpers/fixtures';

// Mock config
vi.mock('../../../src/config/index.js', () => ({
  config: {
    jwt: {
      secret: 'test-jwt-secret-key-for-testing-purposes-only',
      algorithm: 'HS256',
      publicKey: undefined,
    },
  },
}));

// Import after mocking
import { authenticate, authorize, optionalAuth } from '../../../src/middleware/auth.middleware';

describe('Auth Middleware', () => {
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  let next: ReturnType<typeof mockNext>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid JWT token', () => {
      const token = jwt.sign(
        mockJwtPayload,
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '15m' }
      );

      req.headers.authorization = `Bearer ${token}`;

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe(mockJwtPayload.userId);
      expect(req.user.email).toBe(mockJwtPayload.email);
      expect(req.user.role).toBe(mockJwtPayload.role);
      expect(next).toHaveBeenCalledWith();
    });

    it('should throw UnauthorizedError when no token provided', () => {
      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No token provided',
        statusCode: 401,
      }));
    });

    it('should throw UnauthorizedError for missing Bearer prefix', () => {
      req.headers.authorization = 'InvalidToken';

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No token provided',
        statusCode: 401,
      }));
    });

    it('should throw UnauthorizedError for invalid token', () => {
      req.headers.authorization = 'Bearer invalid.jwt.token';

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid token',
        statusCode: 401,
      }));
    });

    it('should throw UnauthorizedError for expired token', () => {
      const token = jwt.sign(
        mockJwtPayload,
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '-1s' }
      );

      req.headers.authorization = `Bearer ${token}`;

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Token expired',
        statusCode: 401,
      }));
    });

    it('should throw UnauthorizedError for token signed with wrong secret', () => {
      const token = jwt.sign(
        mockJwtPayload,
        'wrong-secret',
        { expiresIn: '15m' }
      );

      req.headers.authorization = `Bearer ${token}`;

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid token',
        statusCode: 401,
      }));
    });
  });

  describe('authorize', () => {
    it('should allow access for user with correct role', () => {
      req.user = { userId: 'user-123', email: 'test@example.com', role: 'admin' };

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should allow access for user with any of allowed roles', () => {
      req.user = { userId: 'user-123', email: 'test@example.com', role: 'provider' };

      const middleware = authorize('admin', 'provider');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should throw UnauthorizedError when user not authenticated', () => {
      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Not authenticated',
        statusCode: 401,
      }));
    });

    it('should throw ForbiddenError when user role not allowed', () => {
      req.user = { userId: 'user-123', email: 'test@example.com', role: 'patient' };

      const middleware = authorize('admin', 'provider');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Insufficient permissions',
        statusCode: 403,
      }));
    });

    it('should work with multiple roles', () => {
      req.user = { userId: 'user-123', email: 'test@example.com', role: 'patient' };

      const middleware = authorize('patient', 'provider', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('optionalAuth', () => {
    it('should set user if valid token provided', () => {
      const token = jwt.sign(
        mockJwtPayload,
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '15m' }
      );

      req.headers.authorization = `Bearer ${token}`;

      optionalAuth(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe(mockJwtPayload.userId);
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if no token provided', () => {
      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid.jwt.token';

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if token is expired', () => {
      const token = jwt.sign(
        mockJwtPayload,
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '-1s' }
      );

      req.headers.authorization = `Bearer ${token}`;

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if authorization header has wrong format', () => {
      req.headers.authorization = 'Basic credentials';

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });
});
