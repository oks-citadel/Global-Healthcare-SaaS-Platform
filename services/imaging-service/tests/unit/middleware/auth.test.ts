/**
 * Unit Tests for Auth Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { authenticate, authorize } from '../../../src/middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_ISSUER = process.env.JWT_ISSUER || 'global-healthcare-platform';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'imaging-service';

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-123');
      expect(req.user.email).toBe('test@example.com');
      expect(req.user.role).toBe('provider');
      expect(next).toHaveBeenCalled();
    });

    it('should reject request without authorization header', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication required',
          statusCode: 401,
        })
      );
    });

    it('should reject request with invalid authorization format', () => {
      const req = mockRequest({
        headers: {
          authorization: 'InvalidFormat token123',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication required',
          statusCode: 401,
        })
      );
    });

    it('should reject expired token', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '-1h', // Already expired
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token expired',
          statusCode: 401,
        })
      );
    });

    it('should reject invalid token signature', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
        'wrong-secret',
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token',
          statusCode: 401,
        })
      );
    });

    it('should reject token with invalid issuer', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
        JWT_SECRET,
        {
          issuer: 'wrong-issuer',
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token',
          statusCode: 401,
        })
      );
    });

    it('should reject token missing required fields', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          // Missing email and role
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token payload',
          statusCode: 401,
        })
      );
    });

    it('should include permissions in user object', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'admin',
          permissions: ['read:studies', 'write:reports'],
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(req.user.permissions).toContain('read:studies');
      expect(req.user.permissions).toContain('write:reports');
    });

    it('should include organizationId in user object', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
          organizationId: 'org-123',
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(req.user.organizationId).toBe('org-123');
    });

    it('should include facilityIds in user object', () => {
      const token = jwt.sign(
        {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
          facilityIds: ['facility-1', 'facility-2'],
        },
        JWT_SECRET,
        {
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: '1h',
        }
      );

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      authenticate(req as any, res as any, next);

      expect(req.user.facilityIds).toContain('facility-1');
      expect(req.user.facilityIds).toContain('facility-2');
    });
  });

  describe('authorize', () => {
    it('should allow access for authorized role', () => {
      const req = mockRequest({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = authorize('provider', 'admin');
      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('should deny access for unauthorized role', () => {
      const req = mockRequest({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'patient',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = authorize('provider', 'admin');
      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Access denied'),
          statusCode: 403,
        })
      );
    });

    it('should deny access when user is not set', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      const middleware = authorize('provider');
      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
        })
      );
    });

    it('should allow admin access to all resources', () => {
      const req = mockRequest({
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          role: 'admin',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = authorize('admin');
      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle multiple allowed roles', () => {
      const roles = ['provider', 'radiologist', 'admin'];

      roles.forEach(role => {
        const req = mockRequest({
          user: {
            id: 'user-123',
            email: 'test@example.com',
            role,
          },
        });
        const res = mockResponse();
        const next = vi.fn();

        const middleware = authorize('provider', 'radiologist', 'admin');
        middleware(req as any, res as any, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
