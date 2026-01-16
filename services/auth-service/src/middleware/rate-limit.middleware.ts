import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';
import { config } from '../config/index.js';

/**
 * General rate limiter for all endpoints
 */
export const generalLimiter: RequestHandler = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

/**
 * Strict rate limiter for authentication endpoints
 * (login, register, password reset)
 */
export const authLimiter: RequestHandler = rateLimit({
  windowMs: config.rateLimit.authWindowMs,
  max: config.rateLimit.authMaxRequests,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count successful requests too
}) as unknown as RequestHandler;

/**
 * Very strict rate limiter for password reset
 */
export const passwordResetLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;
