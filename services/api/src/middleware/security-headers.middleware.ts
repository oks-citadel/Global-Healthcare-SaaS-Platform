/**
 * Enhanced Security Headers Middleware
 *
 * Purpose: Apply comprehensive security headers to all HTTP responses
 * Compliance: OWASP Top 10, HIPAA Security Rule
 *
 * Headers Configured:
 * - Content Security Policy (CSP)
 * - HTTP Strict Transport Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 * - Permissions-Policy
 * - X-DNS-Prefetch-Control
 */

import { Request, Response, NextFunction } from 'express';
import { securityConfig } from '../config/security.js';

/**
 * Security Headers Middleware
 * Applies all security headers to responses
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Content Security Policy (CSP)
  // Prevents XSS attacks by controlling which resources can be loaded
  const cspDirectives = Object.entries(securityConfig.csp.directives)
    .map(([directive, values]) => {
      const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabDirective} ${values.join(' ')}`;
    })
    .join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // HTTP Strict Transport Security (HSTS)
  // Forces HTTPS connections
  if (process.env.NODE_ENV === 'production') {
    const hstsValue = [
      `max-age=${securityConfig.headers.hsts.maxAge}`,
      securityConfig.headers.hsts.includeSubDomains ? 'includeSubDomains' : '',
      securityConfig.headers.hsts.preload ? 'preload' : '',
    ]
      .filter(Boolean)
      .join('; ');

    res.setHeader('Strict-Transport-Security', hstsValue);
  }

  // X-Frame-Options
  // Prevents clickjacking attacks
  res.setHeader('X-Frame-Options', securityConfig.headers.frameOptions);

  // X-Content-Type-Options
  // Prevents MIME type sniffing
  res.setHeader('X-Content-Type-Options', securityConfig.headers.contentTypeOptions);

  // X-XSS-Protection
  // Enables browser's XSS filter
  res.setHeader('X-XSS-Protection', securityConfig.headers.xssProtection);

  // Referrer-Policy
  // Controls how much referrer information is included with requests
  res.setHeader('Referrer-Policy', securityConfig.headers.referrerPolicy);

  // Permissions-Policy (formerly Feature-Policy)
  // Controls which browser features can be used
  const permissionsPolicy = Object.entries(securityConfig.headers.permissionsPolicy)
    .map(([feature, allowlist]) => {
      if (Array.isArray(allowlist) && allowlist.length === 0) {
        return `${feature}=()`;
      }
      return `${feature}=(${allowlist.join(' ')})`;
    })
    .join(', ');

  res.setHeader('Permissions-Policy', permissionsPolicy);

  // X-DNS-Prefetch-Control
  // Controls DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // X-Download-Options
  // Prevents Internet Explorer from executing downloads in site's context
  res.setHeader('X-Download-Options', 'noopen');

  // X-Permitted-Cross-Domain-Policies
  // Controls Adobe Flash and PDF cross-domain policies
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Cache-Control for API responses
  // Prevent caching of sensitive data
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Add custom security headers
  res.setHeader('X-Content-Security-Policy', cspDirectives); // Legacy support
  res.setHeader('X-WebKit-CSP', cspDirectives); // Legacy support

  next();
}

/**
 * Strict CSP for production
 * More restrictive CSP for production environments
 */
export function strictSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Production-only strict CSP
  if (process.env.NODE_ENV === 'production') {
    const strictCsp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join('; ');

    res.setHeader('Content-Security-Policy', strictCsp);
  }

  next();
}

/**
 * CORS Security Headers
 * Apply CORS headers based on configuration
 */
export function corsSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && securityConfig.cors.origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow all origins
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', securityConfig.cors.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', securityConfig.cors.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Expose-Headers', securityConfig.cors.exposedHeaders.join(', '));

  if (securityConfig.cors.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Max-Age', securityConfig.cors.maxAge.toString());

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
}

/**
 * API-specific security headers
 * Additional headers for API endpoints
 */
export function apiSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent caching of API responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Add request tracking header
  const requestId = req.headers['x-request-id'] || generateRequestId();
  res.setHeader('X-Request-ID', requestId as string);

  // Add API version header
  res.setHeader('X-API-Version', process.env.API_VERSION || '1.0.0');

  next();
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Helmet-like security headers (comprehensive)
 * Combines all security headers in one middleware
 */
export function comprehensiveSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  securityHeaders(req, res, () => {
    apiSecurityHeaders(req, res, next);
  });
}

/**
 * Development-friendly security headers
 * Relaxed headers for development environment
 */
export function developmentSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Relaxed CSP for development
  const devCsp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: http:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss: http: https:",
    "frame-src 'self'",
    "object-src 'none'",
  ].join('; ');

  res.setHeader('Content-Security-Policy', devCsp);
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');

  next();
}

/**
 * Security headers for static files
 * Appropriate caching for static assets
 */
export function staticFileSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Allow caching for static files
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  // Still apply security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  next();
}

/**
 * Security headers for file downloads
 * Prevent execution of downloaded files
 */
export function downloadSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Content-Disposition', 'attachment');

  // Prevent caching of downloads
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');

  next();
}

/**
 * Report-Only CSP for testing
 * Use this to test CSP without blocking resources
 */
export function reportOnlyCSP(reportUri?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cspDirectives = Object.entries(securityConfig.csp.directives)
      .map(([directive, values]) => {
        const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabDirective} ${values.join(' ')}`;
      })
      .join('; ');

    const cspWithReport = reportUri
      ? `${cspDirectives}; report-uri ${reportUri}`
      : cspDirectives;

    res.setHeader('Content-Security-Policy-Report-Only', cspWithReport);
    next();
  };
}

export default {
  securityHeaders,
  strictSecurityHeaders,
  corsSecurityHeaders,
  apiSecurityHeaders,
  comprehensiveSecurityHeaders,
  developmentSecurityHeaders,
  staticFileSecurityHeaders,
  downloadSecurityHeaders,
  reportOnlyCSP,
};
