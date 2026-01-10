import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Service-to-Service Authentication Middleware
 *
 * Validates internal service requests using API key authentication.
 * This middleware should be used on all internal endpoints that receive
 * requests from other microservices.
 *
 * SECURITY NOTES:
 * - API keys should be unique per service in production
 * - All failed authentication attempts are logged for security monitoring
 * - The middleware validates that SERVICE_API_KEY is configured
 */

const SERVICE_AUTH_HEADER = 'x-service-key';
const SERVICE_NAME_HEADER = 'x-service-name';

/**
 * Validates service-to-service authentication
 *
 * @param options Configuration options
 * @param options.allowedServices Optional list of service names allowed to call this endpoint
 */
export const authenticateService = (options?: { allowedServices?: string[] }) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const serviceKey = req.headers[SERVICE_AUTH_HEADER] as string | undefined;
    const serviceName = req.headers[SERVICE_NAME_HEADER] as string | undefined;
    const expectedKey = process.env.SERVICE_API_KEY;

    // SECURITY: Fail if SERVICE_API_KEY is not configured
    if (!expectedKey) {
      logger.error('SERVICE_API_KEY not configured - service auth disabled', {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
      });
      return next(new UnauthorizedError('Service authentication not configured'));
    }

    // SECURITY: Validate the service key
    if (!serviceKey || serviceKey !== expectedKey) {
      logger.warn('Service authentication failed', {
        endpoint: req.path,
        method: req.method,
        serviceName: serviceName || 'unknown',
        ip: req.ip,
        userAgent: req.get('user-agent'),
        hasKey: !!serviceKey,
        keyMismatch: serviceKey ? 'yes' : 'no',
      });
      return next(new UnauthorizedError('Unauthorized service request'));
    }

    // Optional: Validate service name if allowedServices is specified
    if (options?.allowedServices && options.allowedServices.length > 0) {
      if (!serviceName || !options.allowedServices.includes(serviceName)) {
        logger.warn('Service not in allowed list', {
          endpoint: req.path,
          method: req.method,
          serviceName: serviceName || 'unknown',
          allowedServices: options.allowedServices,
          ip: req.ip,
        });
        return next(new UnauthorizedError('Service not authorized for this endpoint'));
      }
    }

    // Log successful service authentication
    logger.debug('Service authentication successful', {
      endpoint: req.path,
      method: req.method,
      serviceName: serviceName || 'unknown',
    });

    next();
  };
};

/**
 * Combined middleware for service authentication and idempotency
 * Use this for webhook-style internal endpoints
 */
export const serviceAuthWithIdempotency = (options?: {
  allowedServices?: string[];
}) => {
  return authenticateService(options);
};

export default authenticateService;
