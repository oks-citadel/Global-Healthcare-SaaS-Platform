/**
 * Unit Tests for extractUser Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractUser, requireUser, UserRequest } from '../../../src/middleware/extractUser';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks';

describe('extractUser Middleware', () => {
  describe('extractUser', () => {
    it('should extract user from headers when all required headers present', () => {
      const req = mockRequest({
        headers: {
          'x-user-id': 'user-123',
          'x-user-role': 'provider',
          'x-user-email': 'test@example.com',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      });
      expect(next).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledWith();
    });

    it('should not set user when x-user-id header is missing', () => {
      const req = mockRequest({
        headers: {
          'x-user-role': 'provider',
          'x-user-email': 'test@example.com',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should not set user when x-user-role header is missing', () => {
      const req = mockRequest({
        headers: {
          'x-user-id': 'user-123',
          'x-user-email': 'test@example.com',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should not set user when x-user-email header is missing', () => {
      const req = mockRequest({
        headers: {
          'x-user-id': 'user-123',
          'x-user-role': 'provider',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should not set user when all headers are missing', () => {
      const req = mockRequest({
        headers: {},
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should handle empty string headers as falsy', () => {
      const req = mockRequest({
        headers: {
          'x-user-id': '',
          'x-user-role': 'provider',
          'x-user-email': 'test@example.com',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      extractUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should handle different user roles', () => {
      const roles = ['patient', 'provider', 'admin', 'lab_tech'];

      roles.forEach(role => {
        const req = mockRequest({
          headers: {
            'x-user-id': 'user-123',
            'x-user-role': role,
            'x-user-email': 'test@example.com',
          },
        }) as UserRequest;
        const res = mockResponse();
        const next = mockNext();

        extractUser(req, res, next);

        expect(req.user?.role).toBe(role);
      });
    });
  });

  describe('requireUser', () => {
    it('should call next when user is present', () => {
      const req = mockRequest({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'provider',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      requireUser(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not present', () => {
      const req = mockRequest({
        user: undefined,
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      requireUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'User information not found',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user is null', () => {
      const req = mockRequest({
        user: null,
      }) as unknown as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      requireUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'User information not found',
      });
    });
  });

  describe('Integration - extractUser followed by requireUser', () => {
    it('should pass through both middlewares with valid headers', () => {
      const req = mockRequest({
        headers: {
          'x-user-id': 'user-123',
          'x-user-role': 'provider',
          'x-user-email': 'test@example.com',
        },
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      // First middleware
      extractUser(req, res, next);

      // Second middleware
      requireUser(req, res, next);

      expect(next).toHaveBeenCalledTimes(2);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail at requireUser when headers are missing', () => {
      const req = mockRequest({
        headers: {},
      }) as UserRequest;
      const res = mockResponse();
      const next = mockNext();

      // First middleware
      extractUser(req, res, next);

      // Second middleware
      requireUser(req, res, next);

      // extractUser calls next once, requireUser responds with 401
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
