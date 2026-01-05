/**
 * Admin User Impersonation Service
 *
 * Allows authorized support/admin users to impersonate other users
 * for debugging and support purposes. All actions are fully audited.
 *
 * Security Features:
 * - Strict role-based access control
 * - Full audit trail of all impersonation sessions
 * - Time-limited sessions (max 1 hour)
 * - Cannot impersonate other admins without super-admin role
 * - Real-time notifications to impersonated users
 * - IP and device fingerprint logging
 */

import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { randomUUID } from "crypto";

// Types
export interface ImpersonationSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  targetUserId: string;
  targetUserEmail: string;
  reason: string;
  ticketId?: string;
  startedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  endedAt?: Date;
  endReason?: "manual" | "expired" | "forced";
}

export interface ImpersonationConfig {
  maxDurationMinutes: number;
  requireTicketId: boolean;
  notifyUser: boolean;
  allowedRoles: string[];
  excludedRoles: string[];
}

export interface StartImpersonationRequest {
  adminId: string;
  targetUserId: string;
  reason: string;
  ticketId?: string;
  ipAddress: string;
  userAgent: string;
}

export interface ImpersonationToken {
  token: string;
  sessionId: string;
  originalAdminId: string;
  impersonatedUserId: string;
  expiresAt: Date;
}

const DEFAULT_CONFIG: ImpersonationConfig = {
  maxDurationMinutes: 60,
  requireTicketId: true,
  notifyUser: true,
  allowedRoles: ["ADMIN", "SUPER_ADMIN", "SUPPORT"],
  excludedRoles: ["ADMIN", "SUPER_ADMIN"], // Cannot impersonate other admins
};

export class ImpersonationService {
  private prisma: PrismaClient;
  private redis: Redis;
  private config: ImpersonationConfig;

  constructor(
    prisma: PrismaClient,
    redis: Redis,
    config: Partial<ImpersonationConfig> = {},
  ) {
    this.prisma = prisma;
    this.redis = redis;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start an impersonation session
   */
  async startImpersonation(
    request: StartImpersonationRequest,
  ): Promise<ImpersonationToken> {
    // Validate admin has permission
    const admin = await this.prisma.user.findUnique({
      where: { id: request.adminId },
      select: { id: true, email: true, role: true },
    });

    if (!admin) {
      throw new ImpersonationError("ADMIN_NOT_FOUND", "Admin user not found");
    }

    if (!this.config.allowedRoles.includes(admin.role)) {
      throw new ImpersonationError(
        "INSUFFICIENT_PERMISSIONS",
        "Admin does not have permission to impersonate users",
      );
    }

    // Validate target user exists and can be impersonated
    const targetUser = await this.prisma.user.findUnique({
      where: { id: request.targetUserId },
      select: { id: true, email: true, role: true },
    });

    if (!targetUser) {
      throw new ImpersonationError("USER_NOT_FOUND", "Target user not found");
    }

    // Check if target is protected (admin/super-admin)
    if (this.config.excludedRoles.includes(targetUser.role)) {
      // Only super-admins can impersonate other admins
      if (admin.role !== "SUPER_ADMIN") {
        throw new ImpersonationError(
          "CANNOT_IMPERSONATE_ADMIN",
          "Cannot impersonate admin users without super-admin privileges",
        );
      }
    }

    // Require ticket ID for audit trail
    if (this.config.requireTicketId && !request.ticketId) {
      throw new ImpersonationError(
        "TICKET_REQUIRED",
        "A support ticket ID is required to start impersonation",
      );
    }

    // Check for existing active session by this admin
    const existingSession = await this.getActiveSessionByAdmin(request.adminId);
    if (existingSession) {
      throw new ImpersonationError(
        "SESSION_ALREADY_ACTIVE",
        "Admin already has an active impersonation session",
      );
    }

    // Create the session
    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + this.config.maxDurationMinutes * 60 * 1000,
    );

    const session: ImpersonationSession = {
      sessionId,
      adminId: admin.id,
      adminEmail: admin.email,
      targetUserId: targetUser.id,
      targetUserEmail: targetUser.email,
      reason: request.reason,
      ticketId: request.ticketId,
      startedAt: now,
      expiresAt,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    };

    // Store session in Redis
    await this.redis.setex(
      `impersonation:session:${sessionId}`,
      this.config.maxDurationMinutes * 60,
      JSON.stringify(session),
    );

    // Store admin's active session reference
    await this.redis.setex(
      `impersonation:admin:${admin.id}`,
      this.config.maxDurationMinutes * 60,
      sessionId,
    );

    // Create audit log entry
    await this.createAuditLog({
      action: "IMPERSONATION_STARTED",
      adminId: admin.id,
      targetUserId: targetUser.id,
      sessionId,
      metadata: {
        reason: request.reason,
        ticketId: request.ticketId,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
      },
    });

    // Notify the user if configured
    if (this.config.notifyUser) {
      await this.notifyUser(targetUser.id, targetUser.email, session);
    }

    // Generate impersonation token
    const token = this.generateImpersonationToken(session);

    return {
      token,
      sessionId,
      originalAdminId: admin.id,
      impersonatedUserId: targetUser.id,
      expiresAt,
    };
  }

  /**
   * End an impersonation session
   */
  async endImpersonation(
    sessionId: string,
    endReason: "manual" | "expired" | "forced" = "manual",
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new ImpersonationError("SESSION_NOT_FOUND", "Session not found");
    }

    // Update session
    session.endedAt = new Date();
    session.endReason = endReason;

    // Store ended session for audit (keep for 90 days)
    await this.redis.setex(
      `impersonation:ended:${sessionId}`,
      90 * 24 * 60 * 60,
      JSON.stringify(session),
    );

    // Remove active session references
    await this.redis.del(`impersonation:session:${sessionId}`);
    await this.redis.del(`impersonation:admin:${session.adminId}`);

    // Create audit log
    await this.createAuditLog({
      action: "IMPERSONATION_ENDED",
      adminId: session.adminId,
      targetUserId: session.targetUserId,
      sessionId,
      metadata: {
        endReason,
        duration: Math.round(
          (session.endedAt.getTime() - session.startedAt.getTime()) / 1000,
        ),
      },
    });

    // Notify user that impersonation has ended
    if (this.config.notifyUser) {
      await this.notifyUserEnded(session.targetUserId, session);
    }
  }

  /**
   * Validate an impersonation token
   */
  async validateToken(token: string): Promise<ImpersonationSession | null> {
    try {
      const decoded = this.decodeImpersonationToken(token);
      const session = await this.getSession(decoded.sessionId);

      if (!session) {
        return null;
      }

      // Check if expired
      if (new Date() > new Date(session.expiresAt)) {
        await this.endImpersonation(session.sessionId, "expired");
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Get active session by admin ID
   */
  async getActiveSessionByAdmin(
    adminId: string,
  ): Promise<ImpersonationSession | null> {
    const sessionId = await this.redis.get(`impersonation:admin:${adminId}`);
    if (!sessionId) {
      return null;
    }
    return this.getSession(sessionId);
  }

  /**
   * Get all active impersonation sessions (for monitoring)
   */
  async getAllActiveSessions(): Promise<ImpersonationSession[]> {
    const keys = await this.redis.keys("impersonation:session:*");
    const sessions: ImpersonationSession[] = [];

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        sessions.push(JSON.parse(data));
      }
    }

    return sessions;
  }

  /**
   * Force end all sessions for a user (e.g., security event)
   */
  async forceEndAllSessionsForUser(targetUserId: string): Promise<number> {
    const sessions = await this.getAllActiveSessions();
    let count = 0;

    for (const session of sessions) {
      if (session.targetUserId === targetUserId) {
        await this.endImpersonation(session.sessionId, "forced");
        count++;
      }
    }

    return count;
  }

  /**
   * Get impersonation history for audit
   */
  async getImpersonationHistory(
    filters: {
      adminId?: string;
      targetUserId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    pagination: { page: number; limit: number },
  ): Promise<{ sessions: ImpersonationSession[]; total: number }> {
    // In production, query from audit logs table
    // This is a simplified implementation using Redis
    const keys = await this.redis.keys("impersonation:ended:*");
    let sessions: ImpersonationSession[] = [];

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const session = JSON.parse(data) as ImpersonationSession;

        // Apply filters
        if (filters.adminId && session.adminId !== filters.adminId) continue;
        if (
          filters.targetUserId &&
          session.targetUserId !== filters.targetUserId
        )
          continue;
        if (
          filters.startDate &&
          new Date(session.startedAt) < filters.startDate
        )
          continue;
        if (filters.endDate && new Date(session.startedAt) > filters.endDate)
          continue;

        sessions.push(session);
      }
    }

    // Sort by most recent
    sessions.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );

    const total = sessions.length;
    const start = (pagination.page - 1) * pagination.limit;
    sessions = sessions.slice(start, start + pagination.limit);

    return { sessions, total };
  }

  // Private methods

  private async getSession(
    sessionId: string,
  ): Promise<ImpersonationSession | null> {
    const data = await this.redis.get(`impersonation:session:${sessionId}`);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  private generateImpersonationToken(session: ImpersonationSession): string {
    // In production, use JWT with short expiry
    const payload = {
      type: "impersonation",
      sessionId: session.sessionId,
      adminId: session.adminId,
      targetUserId: session.targetUserId,
      exp: session.expiresAt.getTime(),
    };
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
  }

  private decodeImpersonationToken(token: string): {
    sessionId: string;
    adminId: string;
    targetUserId: string;
    exp: number;
  } {
    const payload = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8"),
    );

    if (payload.type !== "impersonation") {
      throw new Error("Invalid token type");
    }

    if (payload.exp < Date.now()) {
      throw new Error("Token expired");
    }

    return payload;
  }

  private async createAuditLog(entry: {
    action: string;
    adminId: string;
    targetUserId: string;
    sessionId: string;
    metadata: Record<string, unknown>;
  }): Promise<void> {
    // Store in database audit_logs table
    await this.prisma.auditLog.create({
      data: {
        userId: entry.adminId,
        action: entry.action,
        resourceType: "IMPERSONATION",
        resourceId: entry.targetUserId,
        details: {
          sessionId: entry.sessionId,
          ...entry.metadata,
        },
        ipAddress: (entry.metadata.ipAddress as string) || "unknown",
      },
    });

    // Also log to console for immediate visibility
    // eslint-disable-next-line no-console
    console.log("[IMPERSONATION_AUDIT]", JSON.stringify(entry));
  }

  private async notifyUser(
    userId: string,
    email: string,
    session: ImpersonationSession,
  ): Promise<void> {
    // In production, send email and/or in-app notification
    // eslint-disable-next-line no-console
    console.log(`[IMPERSONATION_NOTIFY] User ${email} is being impersonated`);

    // Create in-app notification
    await this.prisma.notification.create({
      data: {
        userId,
        type: "SECURITY",
        title: "Support Access Active",
        message: `A Unified Health support representative is accessing your account to assist with ticket #${session.ticketId || "N/A"}. This access will automatically expire in ${this.config.maxDurationMinutes} minutes.`,
        metadata: {
          sessionId: session.sessionId,
          adminEmail: session.adminEmail,
          reason: session.reason,
        },
      },
    });
  }

  private async notifyUserEnded(
    userId: string,
    session: ImpersonationSession,
  ): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId,
        type: "SECURITY",
        title: "Support Access Ended",
        message: `Support access to your account has ended. If you did not request support, please contact us immediately.`,
        metadata: {
          sessionId: session.sessionId,
          duration: Math.round(
            ((session.endedAt?.getTime() || Date.now()) -
              session.startedAt.getTime()) /
              1000,
          ),
        },
      },
    });
  }
}

// Custom error class
export class ImpersonationError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ImpersonationError";
  }
}

// Factory function
export function createImpersonationService(
  prisma: PrismaClient,
  redis: Redis,
  config?: Partial<ImpersonationConfig>,
): ImpersonationService {
  return new ImpersonationService(prisma, redis, config);
}
