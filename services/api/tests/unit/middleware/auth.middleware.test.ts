import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticate, authorize, optionalAuth } from '../../../src/middleware/auth.middleware.js';
import { UnauthorizedError, ForbiddenError } from '../../../src/utils/errors.js';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks.js';
import { mockJwtPayload } from '../helpers/fixtures.js';
import jwt from 'jsonwebtoken';

// Mock config
vi.mock('../../../src/config/index.js', () => ({
  config: {
    jwt: {
      secret: 'test-jwt-secret',
      expiresIn: '1h',
    },
  },
}));

describe('Auth Middleware', () => {
  describe('authenticate', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should authenticate valid token', () => {
      const token = 'valid-jwt-token';
      req.headers.authorization = `Bearer ${token}`;

      vi.spyOn(jwt, 'verify').mockReturnValue(mockJwtPayload as any);

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-jwt-secret');
      expect(req.user).toEqual(mockJwtPayload);
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject request without authorization header', () => {
      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('No token provided');
    });

    it('should reject request without Bearer prefix', () => {
      req.headers.authorization = 'invalid-token';

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('No token provided');
    });

    it('should reject invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';

      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('Invalid token');
    });

    it('should reject expired token', () => {
      req.headers.authorization = 'Bearer expired-token';

      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.TokenExpiredError('jwt expired', new Date());
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('Token expired');
    });

    it('should pass through other errors', () => {
      req.headers.authorization = 'Bearer some-token';

      const customError = new Error('Custom error');
      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw customError;
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(customError);
    });

    it('should extract token correctly', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      req.headers.authorization = `Bearer ${token}`;

      vi.spyOn(jwt, 'verify').mockReturnValue(mockJwtPayload as any);

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-jwt-secret');
    });

    it('should handle authorization header with extra spaces', () => {
      req.headers.authorization = 'Bearer    valid-token';

      vi.spyOn(jwt, 'verify').mockReturnValue(mockJwtPayload as any);

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
    });
  });

  describe('authorize', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should allow user with correct role', () => {
      req.user = { ...mockJwtPayload, role: 'patient' };

      const middleware = authorize('patient', 'provider');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should allow admin access', () => {
      req.user = { ...mockJwtPayload, role: 'admin' };

      const middleware = authorize('patient', 'provider', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject user without required role', () => {
      req.user = { ...mockJwtPayload, role: 'patient' };

      const middleware = authorize('provider', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(next.mock.calls[0][0].message).toBe('Insufficient permissions');
    });

    it('should reject unauthenticated user', () => {
      req.user = undefined;

      const middleware = authorize('patient');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('Not authenticated');
    });

    it('should allow single role', () => {
      req.user = { ...mockJwtPayload, role: 'provider' };

      const middleware = authorize('provider');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should handle multiple allowed roles', () => {
      req.user = { ...mockJwtPayload, role: 'provider' };

      const middleware = authorize('patient', 'provider', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject when role not in allowed list', () => {
      req.user = { ...mockJwtPayload, role: 'patient' };

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('optionalAuth', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should set user if valid token provided', () => {
      const token = 'valid-jwt-token';
      req.headers.authorization = `Bearer ${token}`;

      vi.spyOn(jwt, 'verify').mockReturnValue(mockJwtPayload as any);

      optionalAuth(req, res, next);

      expect(req.user).toEqual(mockJwtPayload);
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if no token', () => {
      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';

      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without user if token expired', () => {
      req.headers.authorization = 'Bearer expired-token';

      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.TokenExpiredError('jwt expired', new Date());
      });

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should not throw errors for invalid auth', () => {
      req.headers.authorization = 'Invalid format';

      optionalAuth(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle missing Bearer prefix', () => {
      req.headers.authorization = 'some-token';

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should handle empty authorization header', () => {
      req.headers.authorization = '';

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('JWT payload structure', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = mockRequest();
      res = mockResponse();
      next = mockNext();
      vi.clearAllMocks();
    });

    it('should validate payload has required fields', () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'patient',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      vi.spyOn(jwt, 'verify').mockReturnValue(payload as any);

      authenticate(req, res, next);

      expect(req.user).toHaveProperty('userId');
      expect(req.user).toHaveProperty('email');
      expect(req.user).toHaveProperty('role');
      expect(req.user).toHaveProperty('iat');
      expect(req.user).toHaveProperty('exp');
    });

    it('should preserve all payload fields', () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'provider',
        iat: 1234567890,
        exp: 1234571490,
        customField: 'custom-value',
      };

      vi.spyOn(jwt, 'verify').mockReturnValue(payload as any);

      authenticate(req, res, next);

      expect(req.user).toEqual(payload);
    });
  });
});
