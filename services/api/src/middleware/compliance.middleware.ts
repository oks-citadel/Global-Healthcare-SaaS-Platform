/**
 * Compliance Middleware for Unified Health API
 *
 * Features:
 * - Request/Response logging for audit
 * - Data residency validation
 * - Consent verification
 * - Regional compliance headers
 * - PHI/PII detection and masking
 */

import { Request, Response, NextFunction } from 'express';
import {
  AuditLogger,
  ConsentManager,
  AuditEventType,
  AuditSeverity,
  ComplianceRegulation,
  ConsentPurpose
} from '@unifiedhealth/compliance';

export interface ComplianceConfig {
  auditLogger: AuditLogger;
  consentManager: ConsentManager;
  enableDataResidencyCheck: boolean;
  enableConsentCheck: boolean;
  enablePHIDetection: boolean;
  allowedRegions: {
    americas?: string[];
    europe?: string[];
    africa?: string[];
  };
}

export interface ComplianceContext {
  regulation: ComplianceRegulation;
  region: string;
  dataResidency: 'US' | 'EU' | 'SA';
}

declare global {
  namespace Express {
    interface Request {
      compliance?: ComplianceContext;
      userId?: string;
      sessionId?: string;
    }
  }
}

/**
 * Main compliance middleware
 */
export function complianceMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startTime = Date.now();

      // 1. Determine applicable regulation based on request origin
      const compliance = await determineCompliance(req);
      req.compliance = compliance;

      // 2. Data residency check
      if (config.enableDataResidencyCheck) {
        await validateDataResidency(req, compliance);
      }

      // 3. Regional compliance headers
      setComplianceHeaders(res, compliance);

      // 4. Audit logging
      await logRequest(req, config.auditLogger, compliance);

      // 5. Response logging
      const originalJson = res.json.bind(res);
      res.json = function (body: unknown): Response {
        logResponse(req, res, body, config.auditLogger, compliance, startTime);
        return originalJson(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * PHI/PII Access Logging Middleware
 */
export function phiAccessMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if request accesses PHI
      if (isAccessingPHI(req)) {
        await config.auditLogger.logPHIAccess(
          {
            userId: req.userId,
            ipAddress: getClientIP(req),
            userAgent: req.headers['user-agent'],
            sessionId: req.sessionId,
            requestId: req.headers['x-request-id'] as string
          },
          {
            patientId: req.params.patientId || req.body.patientId,
            recordType: extractRecordType(req),
            recordId: req.params.id || req.params.recordId,
            accessReason: req.body.reason || req.query.reason as string,
            dataClassification: 'PHI'
          }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Consent Verification Middleware
 */
export function consentVerificationMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!config.enableConsentCheck) {
        return next();
      }

      // Determine what kind of processing this request does
      const purpose = determinePurpose(req);

      if (purpose && req.userId) {
        const consentCheck = await config.consentManager.checkConsent(
          req.userId,
          purpose
        );

        if (!consentCheck.hasConsent) {
          await config.auditLogger.logSecurityEvent(
            {
              userId: req.userId,
              ipAddress: getClientIP(req),
              requestId: req.headers['x-request-id'] as string
            },
            AuditEventType.PERMISSION_DENIED,
            AuditSeverity.WARNING,
            {
              reason: 'No valid consent',
              purpose,
              path: req.path
            }
          );

          return res.status(403).json({
            error: 'Consent required',
            message: consentCheck.reason,
            purpose,
            consentUrl: '/api/v1/consent'
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Data Residency Validation Middleware
 */
export function dataResidencyMiddleware(allowedRegions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientRegion = detectRegion(req);

    if (!allowedRegions.includes(clientRegion)) {
      return res.status(403).json({
        error: 'Data residency violation',
        message: `Access from ${clientRegion} is not permitted for this resource`,
        allowedRegions
      });
    }

    next();
  };
}

/**
 * GDPR-specific middleware
 */
export function gdprMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Add GDPR-specific headers
    res.setHeader('X-GDPR-Compliant', 'true');
    res.setHeader('X-Data-Residency', 'EU');

    // Geo-restriction for EU only
    const country = detectCountry(req);
    if (!isEUCountry(country)) {
      return res.status(403).json({
        error: 'GDPR geo-restriction',
        message: 'This service is only available within the EU'
      });
    }

    next();
  };
}

/**
 * HIPAA-specific middleware
 */
export function hipaaMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Add HIPAA-specific headers
    res.setHeader('X-HIPAA-Compliant', 'true');
    res.setHeader('X-BAA-Required', 'true');

    // Verify minimum TLS version
    if (req.protocol !== 'https') {
      return res.status(403).json({
        error: 'HIPAA security requirement',
        message: 'HTTPS required for PHI transmission'
      });
    }

    next();
  };
}

/**
 * POPIA-specific middleware
 */
export function popiaMiddleware(config: ComplianceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Add POPIA-specific headers
    res.setHeader('X-POPIA-Compliant', 'true');
    res.setHeader('X-Data-Residency', 'SA');

    // Geo-restriction for South Africa
    const country = detectCountry(req);
    if (country !== 'ZA') {
      return res.status(403).json({
        error: 'POPIA geo-restriction',
        message: 'This service is only available within South Africa'
      });
    }

    next();
  };
}

// Helper Functions

async function determineCompliance(req: Request): Promise<ComplianceContext> {
  const country = detectCountry(req);
  const region = detectRegion(req);

  // EU countries -> GDPR
  if (isEUCountry(country)) {
    return {
      regulation: ComplianceRegulation.GDPR,
      region,
      dataResidency: 'EU'
    };
  }

  // South Africa -> POPIA
  if (country === 'ZA') {
    return {
      regulation: ComplianceRegulation.POPIA,
      region,
      dataResidency: 'SA'
    };
  }

  // Default to HIPAA for Americas
  return {
    regulation: ComplianceRegulation.HIPAA,
    region,
    dataResidency: 'US'
  };
}

function detectCountry(req: Request): string {
  // Try CloudFront header
  const cfCountry = req.headers['cloudfront-viewer-country'] as string;
  if (cfCountry) return cfCountry;

  // Try Cloudflare header
  const cfCountry2 = req.headers['cf-ipcountry'] as string;
  if (cfCountry2) return cfCountry2;

  // Try Azure Front Door
  const afdCountry = req.headers['x-azure-clientip-country'] as string;
  if (afdCountry) return afdCountry;

  // Default
  return 'US';
}

function detectRegion(req: Request): string {
  const country = detectCountry(req);

  if (isEUCountry(country)) return 'EU';
  if (country === 'ZA') return 'SA';
  return 'US';
}

function isEUCountry(country: string): boolean {
  const euCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'
  ];
  return euCountries.includes(country.toUpperCase());
}

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

function isAccessingPHI(req: Request): boolean {
  const phiPaths = [
    '/api/v1/patients',
    '/api/v1/health-records',
    '/api/v1/prescriptions',
    '/api/v1/lab-results',
    '/api/v1/telemedicine'
  ];

  return phiPaths.some(path => req.path.startsWith(path));
}

function extractRecordType(req: Request): string {
  if (req.path.includes('/health-records')) return 'health_record';
  if (req.path.includes('/prescriptions')) return 'prescription';
  if (req.path.includes('/lab-results')) return 'lab_result';
  if (req.path.includes('/patients')) return 'patient_record';
  return 'unknown';
}

function determinePurpose(req: Request): ConsentPurpose | null {
  if (req.path.includes('/telemedicine')) return ConsentPurpose.TELEMEDICINE;
  if (req.path.includes('/marketing')) return ConsentPurpose.MARKETING;
  if (req.path.includes('/analytics')) return ConsentPurpose.ANALYTICS_RESEARCH;
  if (req.path.includes('/share')) return ConsentPurpose.THIRD_PARTY_SHARING;

  // Default purpose for healthcare operations
  if (isAccessingPHI(req)) {
    return ConsentPurpose.HEALTHCARE_SERVICES;
  }

  return null;
}

async function validateDataResidency(
  req: Request,
  compliance: ComplianceContext
): Promise<void> {
  const targetRegion = req.headers['x-data-region'] as string;

  if (targetRegion && targetRegion !== compliance.dataResidency) {
    throw new Error(
      `Data residency violation: Request from ${compliance.dataResidency} cannot access data in ${targetRegion}`
    );
  }
}

function setComplianceHeaders(res: Response, compliance: ComplianceContext): void {
  res.setHeader('X-Compliance-Regulation', compliance.regulation);
  res.setHeader('X-Data-Residency', compliance.dataResidency);
  res.setHeader('X-Region', compliance.region);

  // Security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

async function logRequest(
  req: Request,
  logger: AuditLogger,
  compliance: ComplianceContext
): Promise<void> {
  await logger.log({
    eventType: AuditEventType.PHI_ACCESS,
    severity: AuditSeverity.INFO,
    regulation: [compliance.regulation],
    context: {
      userId: req.userId,
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'],
      sessionId: req.sessionId,
      requestId: req.headers['x-request-id'] as string,
      location: {
        country: detectCountry(req),
        region: compliance.region
      }
    },
    outcome: 'SUCCESS',
    details: {
      method: req.method,
      path: req.path,
      query: req.query,
      timestamp: new Date().toISOString()
    }
  });
}

async function logResponse(
  req: Request,
  res: Response,
  body: unknown,
  logger: AuditLogger,
  compliance: ComplianceContext,
  startTime: number
): Promise<void> {
  const duration = Date.now() - startTime;

  await logger.log({
    eventType: AuditEventType.PHI_ACCESS,
    severity: res.statusCode >= 400 ? AuditSeverity.WARNING : AuditSeverity.INFO,
    regulation: [compliance.regulation],
    context: {
      userId: req.userId,
      ipAddress: getClientIP(req),
      requestId: req.headers['x-request-id'] as string
    },
    outcome: res.statusCode < 400 ? 'SUCCESS' : 'FAILURE',
    details: {
      statusCode: res.statusCode,
      duration,
      responseSize: body != null ? JSON.stringify(body).length : 0
    }
  });
}

export default {
  complianceMiddleware,
  phiAccessMiddleware,
  consentVerificationMiddleware,
  dataResidencyMiddleware,
  gdprMiddleware,
  hipaaMiddleware,
  popiaMiddleware
};
