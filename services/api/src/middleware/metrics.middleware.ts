import { Request, Response, NextFunction } from 'express';
import {
  httpRequestDuration,
  httpRequestCounter,
  activeConnections,
  normalizePath,
} from '../lib/metrics.js';

/**
 * Middleware to collect HTTP request metrics for Prometheus
 * Tracks request duration, count, and active connections
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Increment active connections
  activeConnections.inc();

  // Store the original end function
  const originalEnd = res.end;

  // Override the end function to collect metrics
  res.end = function (this: Response, ...args: unknown[]): Response {
    // Calculate request duration
    const duration = (Date.now() - startTime) / 1000;

    // Normalize the path (remove IDs and dynamic segments)
    const normalizedPath = normalizePath(req.path || req.url);

    // Get route path if available (from express router)
    const route = (req.route?.path as string) || normalizedPath;

    // Record metrics
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode.toString(),
      },
      duration
    );

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });

    // Decrement active connections
    activeConnections.dec();

    // Call the original end function
    return originalEnd.apply(this, args as []);
  };

  next();
}

/**
 * Middleware to exclude specific paths from metrics collection
 * Useful for health checks and metrics endpoints
 */
export function excludeMetricsForPaths(paths: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (paths.some(path => req.path.startsWith(path))) {
      return next();
    }
    return metricsMiddleware(req, res, next);
  };
}
