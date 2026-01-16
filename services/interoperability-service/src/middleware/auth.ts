import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import forge from 'node-forge';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
  };
  partner?: {
    id: string;
    name: string;
    type: string;
  };
  clientCertificate?: {
    subject: string;
    issuer: string;
    fingerprint: string;
    valid: boolean;
  };
}

/**
 * OAuth2 Bearer Token Authentication
 */
export const oauth2Auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Bearer token required',
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const jwtSecret = process.env.JWT_SECRET || 'interoperability-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;

    req.user = {
      id: decoded.sub || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (error) {
    logger.warn('OAuth2 authentication failed', { error: (error as Error).message });
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Mutual TLS Authentication
 * Validates client certificate presented during TLS handshake
 */
export const mutualTLSAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // In production, the client certificate is passed by the load balancer
  const clientCert = req.headers['x-client-cert'] as string ||
                     (req.socket as any).getPeerCertificate?.();

  if (!clientCert) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Client certificate required for mutual TLS',
    });
    return;
  }

  try {
    let certificate: forge.pki.Certificate;

    if (typeof clientCert === 'string') {
      // Parse PEM certificate from header
      const decoded = Buffer.from(clientCert, 'base64').toString('utf-8');
      certificate = forge.pki.certificateFromPem(decoded);
    } else {
      // Already parsed by TLS layer
      certificate = clientCert;
    }

    // Extract certificate details
    const subject = certificate.subject.getField('CN')?.value || '';
    const issuer = certificate.issuer.getField('CN')?.value || '';
    const fingerprint = forge.md.sha256.create()
      .update(forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes())
      .digest()
      .toHex();

    // Verify certificate is not expired
    const now = new Date();
    const notBefore = certificate.validity.notBefore;
    const notAfter = certificate.validity.notAfter;

    if (now < notBefore || now > notAfter) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Client certificate has expired or is not yet valid',
      });
      return;
    }

    // Look up trading partner by certificate fingerprint
    const partner = await prisma.tradingPartner.findFirst({
      where: {
        certificates: {
          path: ['fingerprint'],
          equals: fingerprint,
        },
        status: 'active',
      },
    });

    if (!partner) {
      logger.warn('Unknown client certificate', { fingerprint, subject });
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Client certificate not recognized',
      });
      return;
    }

    req.clientCertificate = {
      subject,
      issuer,
      fingerprint,
      valid: true,
    };

    req.partner = {
      id: partner.id,
      name: partner.name,
      type: partner.type,
    };

    logger.info('Mutual TLS authentication successful', {
      partnerId: partner.id,
      partnerName: partner.name,
      fingerprint,
    });

    next();
  } catch (error) {
    logger.error('Mutual TLS authentication failed', { error: (error as Error).message });
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid client certificate',
    });
  }
};

/**
 * SMART on FHIR Authentication
 * Validates SMART backend services token
 */
export const smartOnFhirAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'SMART on FHIR access token required',
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    // Decode JWT to get issuer
    const decoded = jwt.decode(token, { complete: true }) as any;
    if (!decoded) {
      throw new Error('Invalid JWT format');
    }

    const iss = decoded.payload.iss;
    const aud = decoded.payload.aud;

    // Look up FHIR endpoint to get public key
    const endpoint = await prisma.fhirEndpoint.findFirst({
      where: {
        OR: [
          { url: iss },
          { tokenEndpoint: iss },
        ],
        status: 'active',
      },
    });

    if (!endpoint) {
      throw new Error('Unknown SMART on FHIR issuer');
    }

    // In production, fetch JWKS and verify signature
    // For now, accept if endpoint is found and token is well-formed

    req.user = {
      id: decoded.payload.sub || 'smart-client',
      email: decoded.payload.sub || 'smart-client@system',
      role: 'system',
      organizationId: endpoint.organizationNpi || undefined,
    };

    next();
  } catch (error) {
    logger.warn('SMART on FHIR authentication failed', { error: (error as Error).message });
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid SMART on FHIR token',
    });
  }
};

/**
 * API Key Authentication
 * For simpler integrations that don't require OAuth2
 */
export const apiKeyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required',
    });
    return;
  }

  try {
    // Look up partner by API key (stored in clientId field for simplicity)
    const partner = await prisma.tradingPartner.findFirst({
      where: {
        clientId: apiKey,
        status: 'active',
      },
    });

    if (!partner) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key',
      });
      return;
    }

    req.partner = {
      id: partner.id,
      name: partner.name,
      type: partner.type,
    };

    next();
  } catch (error) {
    logger.error('API key authentication failed', { error: (error as Error).message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error',
    });
  }
};

/**
 * Flexible authentication middleware that tries multiple methods
 */
export const flexibleAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  const clientCert = req.headers['x-client-cert'] as string;

  // Try OAuth2 first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return oauth2Auth(req, res, next);
  }

  // Try API key
  if (apiKey) {
    return apiKeyAuth(req, res, next);
  }

  // Try mutual TLS
  if (clientCert) {
    return mutualTLSAuth(req, res, next);
  }

  // No authentication method provided
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication required. Provide Bearer token, API key, or client certificate.',
  });
};
