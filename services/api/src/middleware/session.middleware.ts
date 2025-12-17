import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors.js';
import { auditService } from '../services/audit.service.js';

/**
 * HIPAA Session Management Middleware
 * Implements automatic session timeout and re-authentication for sensitive operations
 * Compliant with HIPAA Access Control requirements (45 CFR § 164.312(a)(2))
 */

/**
 * Session store (in-memory for development, use Redis in production)
 */
interface SessionData {
  userId: string;
  email: string;
  role: string;
  lastActivity: number;
  createdAt: number;
  ipAddress: string;
  userAgent: string;
  requiresReauth?: boolean;
}

const sessions = new Map<string, SessionData>();

/**
 * Configuration
 */
const SESSION_CONFIG = {
  // 15 minutes of inactivity (HIPAA recommendation)
  INACTIVITY_TIMEOUT: 15 * 60 * 1000, // 15 minutes

  // Maximum session duration (8 hours)
  MAX_SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 hours

  // Re-authentication timeout for sensitive operations (5 minutes)
  REAUTH_TIMEOUT: 5 * 60 * 1000, // 5 minutes

  // Maximum concurrent sessions per user
  MAX_CONCURRENT_SESSIONS: 3,

  // Cleanup interval for expired sessions
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

/**
 * Sensitive operations that require recent authentication
 */
const SENSITIVE_OPERATIONS = [
  '/api/v1/patients/:id',
  '/api/v1/encounters',
  '/api/v1/documents/download',
  '/api/v1/prescriptions',
  '/api/v1/lab-results',
  '/api/v1/users/:id/password',
  '/api/v1/settings/security',
  '/api/v1/export',
];

/**
 * Get session ID from request (from token or header)
 */
function getSessionId(req: Request): string | null {
  // Get from custom header
  const sessionId = req.headers['x-session-id'] as string;
  if (sessionId) return sessionId;

  // Generate from user ID and token
  if (req.user) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.substring(7);
      return `${req.user.userId}-${token.substring(0, 16)}`;
    }
  }

  return null;
}

/**
 * Get client IP address
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return typeof realIp === 'string' ? realIp : realIp[0];
  }

  return req.socket.remoteAddress || 'unknown';
}

/**
 * Check if path requires sensitive operation authentication
 */
function isSensitiveOperation(path: string): boolean {
  return SENSITIVE_OPERATIONS.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');
    return regex.test(path);
  });
}

/**
 * Create a new session
 */
export function createSession(
  userId: string,
  email: string,
  role: string,
  ipAddress: string,
  userAgent: string
): string {
  const sessionId = `session-${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Check concurrent sessions
  const userSessions = Array.from(sessions.entries())
    .filter(([_, data]) => data.userId === userId)
    .sort((a, b) => b[1].lastActivity - a[1].lastActivity);

  // Remove oldest sessions if limit exceeded
  if (userSessions.length >= SESSION_CONFIG.MAX_CONCURRENT_SESSIONS) {
    const sessionsToRemove = userSessions.slice(SESSION_CONFIG.MAX_CONCURRENT_SESSIONS - 1);
    sessionsToRemove.forEach(([id]) => {
      sessions.delete(id);
      console.log(`Session terminated due to concurrent limit: ${id}`);
    });
  }

  const sessionData: SessionData = {
    userId,
    email,
    role,
    lastActivity: Date.now(),
    createdAt: Date.now(),
    ipAddress,
    userAgent,
  };

  sessions.set(sessionId, sessionData);

  // Log session creation
  auditService.logEvent({
    userId,
    action: 'session_created',
    resource: 'session',
    resourceId: sessionId,
    details: {
      sessionId,
      concurrentSessions: userSessions.length + 1,
    },
    ipAddress,
    userAgent,
  }).catch(console.error);

  return sessionId;
}

/**
 * Get session data
 */
export function getSession(sessionId: string): SessionData | null {
  return sessions.get(sessionId) || null;
}

/**
 * Update session activity
 */
export function updateSessionActivity(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.lastActivity = Date.now();
    session.requiresReauth = false;
  }
}

/**
 * Mark session as requiring re-authentication
 */
export function requireReauth(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.requiresReauth = true;
  }
}

/**
 * Terminate session
 */
export function terminateSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    sessions.delete(sessionId);

    // Log session termination
    auditService.logEvent({
      userId: session.userId,
      action: 'session_terminated',
      resource: 'session',
      resourceId: sessionId,
      details: {
        sessionId,
        duration: Date.now() - session.createdAt,
      },
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    }).catch(console.error);
  }
}

/**
 * Terminate all user sessions
 */
export function terminateAllUserSessions(userId: string): void {
  const userSessions = Array.from(sessions.entries())
    .filter(([_, data]) => data.userId === userId);

  userSessions.forEach(([sessionId]) => {
    terminateSession(sessionId);
  });
}

/**
 * Cleanup expired sessions
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  const expiredSessions: string[] = [];

  sessions.forEach((session, sessionId) => {
    const inactiveTime = now - session.lastActivity;
    const sessionDuration = now - session.createdAt;

    if (
      inactiveTime > SESSION_CONFIG.INACTIVITY_TIMEOUT ||
      sessionDuration > SESSION_CONFIG.MAX_SESSION_DURATION
    ) {
      expiredSessions.push(sessionId);
    }
  });

  expiredSessions.forEach(sessionId => {
    const session = sessions.get(sessionId);
    if (session) {
      console.log(`Session expired: ${sessionId} (user: ${session.userId})`);

      // Log session expiration
      auditService.logEvent({
        userId: session.userId,
        action: 'session_expired',
        resource: 'session',
        resourceId: sessionId,
        details: {
          sessionId,
          reason: now - session.lastActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT
            ? 'inactivity_timeout'
            : 'max_duration',
          inactiveTime: now - session.lastActivity,
          duration: now - session.createdAt,
        },
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      }).catch(console.error);

      sessions.delete(sessionId);
    }
  });

  if (expiredSessions.length > 0) {
    console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
  }
}

// Start cleanup interval
setInterval(cleanupExpiredSessions, SESSION_CONFIG.CLEANUP_INTERVAL);

/**
 * Middleware to check session timeout
 * Automatically terminates sessions after 15 minutes of inactivity
 */
export const checkSessionTimeout = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Skip if not authenticated
    if (!req.user) {
      return next();
    }

    const sessionId = getSessionId(req);
    if (!sessionId) {
      return next(new UnauthorizedError('No session ID found'));
    }

    const session = getSession(sessionId);
    if (!session) {
      return next(new UnauthorizedError('Session not found'));
    }

    const now = Date.now();
    const inactiveTime = now - session.lastActivity;
    const sessionDuration = now - session.createdAt;

    // Check inactivity timeout
    if (inactiveTime > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
      terminateSession(sessionId);
      return next(new UnauthorizedError('Session expired due to inactivity'));
    }

    // Check maximum session duration
    if (sessionDuration > SESSION_CONFIG.MAX_SESSION_DURATION) {
      terminateSession(sessionId);
      return next(new UnauthorizedError('Session expired due to maximum duration'));
    }

    // Update last activity
    updateSessionActivity(sessionId);

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require recent authentication for sensitive operations
 * Forces re-authentication if last activity was more than 5 minutes ago
 */
export const requireRecentAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Skip if not a sensitive operation
    if (!isSensitiveOperation(req.path)) {
      return next();
    }

    // Skip if not authenticated
    if (!req.user) {
      return next();
    }

    const sessionId = getSessionId(req);
    if (!sessionId) {
      return next(new UnauthorizedError('No session ID found'));
    }

    const session = getSession(sessionId);
    if (!session) {
      return next(new UnauthorizedError('Session not found'));
    }

    const now = Date.now();
    const timeSinceActivity = now - session.lastActivity;

    // Check if recent authentication is required
    if (timeSinceActivity > SESSION_CONFIG.REAUTH_TIMEOUT || session.requiresReauth) {
      // Mark session as requiring re-authentication
      requireReauth(sessionId);

      // Log re-authentication requirement
      auditService.logEvent({
        userId: session.userId,
        action: 'reauth_required',
        resource: 'session',
        resourceId: sessionId,
        details: {
          path: req.path,
          timeSinceActivity,
        },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
      }).catch(console.error);

      return next(new UnauthorizedError('Recent authentication required for this operation'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify session integrity
 * Checks IP address and user agent consistency
 */
export const verifySessionIntegrity = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Skip if not authenticated
    if (!req.user) {
      return next();
    }

    const sessionId = getSessionId(req);
    if (!sessionId) {
      return next();
    }

    const session = getSession(sessionId);
    if (!session) {
      return next();
    }

    const currentIp = getClientIp(req);
    const currentUserAgent = req.headers['user-agent'] || 'unknown';

    // Check IP address consistency (optional, can be disabled for mobile users)
    const checkIpConsistency = process.env.CHECK_SESSION_IP !== 'false';
    if (checkIpConsistency && session.ipAddress !== currentIp) {
      console.warn(`Session IP mismatch: ${sessionId} (expected: ${session.ipAddress}, got: ${currentIp})`);

      // Log suspicious activity
      auditService.logEvent({
        userId: session.userId,
        action: 'session_ip_mismatch',
        resource: 'session',
        resourceId: sessionId,
        details: {
          expectedIp: session.ipAddress,
          actualIp: currentIp,
        },
        ipAddress: currentIp,
        userAgent: currentUserAgent,
      }).catch(console.error);

      terminateSession(sessionId);
      return next(new UnauthorizedError('Session integrity violation'));
    }

    // Check user agent consistency (warning only)
    if (session.userAgent !== currentUserAgent) {
      console.warn(`Session user agent mismatch: ${sessionId}`);

      auditService.logEvent({
        userId: session.userId,
        action: 'session_useragent_mismatch',
        resource: 'session',
        resourceId: sessionId,
        details: {
          expectedUserAgent: session.userAgent,
          actualUserAgent: currentUserAgent,
        },
        ipAddress: currentIp,
        userAgent: currentUserAgent,
      }).catch(console.error);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Combined session management middleware
 */
export const sessionManager = [
  checkSessionTimeout,
  verifySessionIntegrity,
  requireRecentAuth,
];

/**
 * Get session statistics
 */
export function getSessionStats(): {
  totalSessions: number;
  activeSessions: number;
  sessionsByUser: Record<string, number>;
} {
  const now = Date.now();
  let activeSessions = 0;
  const sessionsByUser: Record<string, number> = {};

  sessions.forEach(session => {
    const inactiveTime = now - session.lastActivity;
    if (inactiveTime <= SESSION_CONFIG.INACTIVITY_TIMEOUT) {
      activeSessions++;
    }

    sessionsByUser[session.userId] = (sessionsByUser[session.userId] || 0) + 1;
  });

  return {
    totalSessions: sessions.size,
    activeSessions,
    sessionsByUser,
  };
}

export default {
  createSession,
  getSession,
  updateSessionActivity,
  requireReauth,
  terminateSession,
  terminateAllUserSessions,
  checkSessionTimeout,
  requireRecentAuth,
  verifySessionIntegrity,
  sessionManager,
  getSessionStats,
};
