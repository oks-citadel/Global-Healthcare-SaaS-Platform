// @ts-nocheck
/**
 * Security Middleware
 *
 * Centralized security enforcement for all API endpoints.
 * Implements defense in depth with multiple security layers.
 *
 * @module security-middleware
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import {
  authorize,
  extractActor,
  checkServerOwnedFields,
  logAuthorizationDecision,
  checkIdempotencyKey,
  recordIdempotencyKey,
  validateStateTransition,
  StateMachine,
  Action,
  ResourceType,
  ResourceContext,
} from "../lib/security-policy.js";
import { auditService } from "../services/audit.service.js";
import { BadRequestError, ForbiddenError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

/**
 * Validate request body against a DTO schema
 * Rejects unknown fields by default
 */
export function validateDTO<T>(schema: ZodSchema<T>) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Parse and validate the request body
      const validated = schema.parse(req.body);

      // Check for server-owned fields that shouldn't be in the request
      if (req.body && typeof req.body === "object") {
        const blockedFields = checkServerOwnedFields(
          req.body as Record<string, unknown>,
        );
        if (blockedFields.length > 0) {
          // Log the attempt
          if (req.user) {
            await auditService.logEvent({
              userId: req.user.userId,
              action: "BLOCKED_FIELD_ATTEMPT",
              resource: req.path,
              details: {
                blockedFields,
                method: req.method,
              },
              ipAddress: req.ip,
              userAgent: req.headers["user-agent"],
            });
          }

          throw new BadRequestError(
            `Request contains restricted fields: ${blockedFields.join(", ")}`,
          );
        }
      }

      // Replace body with validated (sanitized) data
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new BadRequestError(
            `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
          ),
        );
      } else {
        next(error);
      }
    }
  };
}

/**
 * Authorization middleware factory
 * Checks if user has permission to perform action on resource
 */
export function authorizeAction(
  action: Action,
  resourceType: ResourceType,
  getResourceContext?: (
    req: Request,
  ) => Promise<Partial<ResourceContext>> | Partial<ResourceContext>,
) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const actor = extractActor(req);

      let resourceContext: ResourceContext = {
        resourceType,
        resourceId: req.params.id,
      };

      // Get additional resource context if provided
      if (getResourceContext) {
        const additionalContext = await getResourceContext(req);
        resourceContext = { ...resourceContext, ...additionalContext };
      }

      const result = authorize(actor, action, resourceContext, {
        requestData: req.body as Record<string, unknown>,
      });

      // Log the authorization decision
      await logAuthorizationDecision(
        {
          actor,
          action,
          resource: resourceContext,
          requestData: req.body as Record<string, unknown>,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
        result,
      );

      if (!result.allowed) {
        throw new ForbiddenError(result.reason || "Access denied");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Audit logging middleware
 * Logs all actions on sensitive resources
 */
export function auditLog(
  action: string,
  resourceType: string,
  getDetails?: (req: Request, res: Response) => Record<string, unknown>,
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Intercept response to log after success
    res.json = function (body: unknown) {
      // Log the audit event asynchronously
      if (req.user) {
        const details = getDetails ? getDetails(req, res) : {};
        auditService
          .logEvent({
            userId: req.user.userId,
            action,
            resource: resourceType,
            resourceId: req.params.id,
            details: {
              ...details,
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
            },
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
          })
          .catch((err) => {
            logger.error("Failed to log audit event", { error: err });
          });
      }

      return originalJson(body);
    };

    next();
  };
}

/**
 * State machine validation middleware
 * Validates state transitions for workflow operations
 */
export function validateStateChange<TState extends string>(
  stateMachine: StateMachine<TState>,
  action: string,
  getCurrentState: (req: Request) => Promise<TState>,
) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const currentState = await getCurrentState(req);
      const newState = validateStateTransition(
        stateMachine,
        currentState,
        action,
      );

      // Attach new state to request for controller to use
      (req as any).validatedNewState = newState;
      (req as any).previousState = currentState;

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Idempotency middleware
 * Prevents duplicate operations using idempotency keys
 */
export function idempotency(getKey?: (req: Request) => string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Get idempotency key from header or generate from request
      const idempotencyKey =
        (req.headers["x-idempotency-key"] as string) ||
        (getKey ? getKey(req) : null);

      if (!idempotencyKey) {
        // No idempotency key, proceed normally
        return next();
      }

      // Check if this key was already processed
      const previousResult = checkIdempotencyKey(idempotencyKey);

      if (previousResult !== null) {
        // Return cached result
        logger.info("Returning cached idempotency result", {
          key: idempotencyKey,
          userId: req.user?.userId,
        });

        return res.status(200).json(previousResult);
      }

      // Store original json method to capture result
      const originalJson = res.json.bind(res);

      res.json = function (body: unknown) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          recordIdempotencyKey(idempotencyKey, body);
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Tenant isolation middleware
 * Ensures all queries are scoped to the user's tenant
 */
export function enforceTenantIsolation() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return next();
      }

      // Attach tenant context to request
      const tenantId = (req.user as any).tenantId;
      (req as any).tenantContext = {
        tenantId,
        enforceIsolation: true,
      };

      // Check if request body contains tenantId
      if (req.body?.tenantId && req.body.tenantId !== tenantId) {
        throw new ForbiddenError("Cross-tenant access denied");
      }

      // Check if query params contain tenantId
      if (req.query?.tenantId && req.query.tenantId !== tenantId) {
        throw new ForbiddenError("Cross-tenant access denied");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Rate limiting by role
 * Applies different rate limits based on user role
 */
export function roleBasedRateLimit(limits: {
  patient?: number;
  provider?: number;
  admin?: number;
  default: number;
}) {
  const requestCounts = new Map<string, { count: number; resetAt: number }>();
  const windowMs = 60 * 1000; // 1 minute window

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const role = req.user?.role || "anonymous";
    const userId = req.user?.userId || req.ip || "anonymous";
    const key = `${userId}:${req.path}`;

    const limit = limits[role as keyof typeof limits] || limits.default;

    const now = Date.now();
    let record = requestCounts.get(key);

    if (!record || record.resetAt < now) {
      record = { count: 0, resetAt: now + windowMs };
      requestCounts.set(key, record);
    }

    record.count++;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetAt / 1000));

    if (record.count > limit) {
      res.status(429).json({
        error: "TooManyRequests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((record.resetAt - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Security headers middleware
 * Adds security headers to all responses
 */
export function securityHeaders() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");

    // Prevent MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // XSS protection
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content Security Policy
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'",
    );

    // Strict Transport Security (HSTS)
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload",
      );
    }

    // Permissions Policy
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()",
    );

    next();
  };
}

/**
 * Sensitive data masking for logs
 * Masks sensitive fields in request/response data
 */
const SENSITIVE_FIELDS = new Set([
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "secret",
  "ssn",
  "socialSecurityNumber",
  "creditCard",
  "cardNumber",
  "cvv",
  "pin",
]);

export function maskSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      masked[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Request logging middleware with sensitive data masking
 */
export function secureRequestLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Log request
    logger.info("Incoming request", {
      method: req.method,
      path: req.path,
      query: maskSensitiveData(req.query),
      body: maskSensitiveData(req.body),
      userId: req.user?.userId,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Log response when finished
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 400 ? "warn" : "info";

      logger[level]("Request completed", {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.userId,
      });
    });

    next();
  };
}

export default {
  validateDTO,
  authorizeAction,
  auditLog,
  validateStateChange,
  idempotency,
  enforceTenantIsolation,
  roleBasedRateLimit,
  securityHeaders,
  maskSensitiveData,
  secureRequestLogger,
};
