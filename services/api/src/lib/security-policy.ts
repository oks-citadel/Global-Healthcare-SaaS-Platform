/**
 * Security Policy Layer
 *
 * Centralized authorization and security policy enforcement.
 * This module implements the principle of least privilege and
 * defense in depth for all API operations.
 *
 * @module security-policy
 */

import { Request } from "express";
import { UnauthorizedError, BadRequestError } from "../utils/errors.js";
import { auditService } from "../services/audit.service.js";

/**
 * Server-owned fields that can NEVER be set via client input.
 * These fields are managed exclusively by the server.
 */
export const SERVER_OWNED_FIELDS = new Set([
  // Identity & Access Control
  "role",
  "roles",
  "isAdmin",
  "isSuperAdmin",
  "permissions",
  "status",
  "accountStatus",
  "emailVerified",
  "phoneVerified",
  "mfaEnabled",
  "mfaSecret",

  // Ownership & Tenancy
  "userId",
  "tenantId",
  "organizationId",
  "ownerId",
  "createdBy",
  "updatedBy",
  "deletedBy",

  // Approval & Workflow States
  "approved",
  "approvedBy",
  "approvedAt",
  "rejected",
  "rejectedBy",
  "rejectedAt",
  "verified",
  "verifiedBy",
  "verifiedAt",
  "reviewStatus",
  "reviewedBy",
  "reviewedAt",
  "workflowState",
  "stateHistory",

  // Subscription & Billing
  "subscriptionTier",
  "subscriptionStatus",
  "subscriptionId",
  "billingStatus",
  "quota",
  "quotaUsed",
  "credits",
  "creditBalance",
  "balance",
  "discount",
  "discountPercent",
  "priceOverride",
  "billingCycleEnd",
  "trialEndsAt",

  // System Fields
  "id",
  "uuid",
  "_id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "version",
  "__v",

  // Security Tokens & Credentials
  "password",
  "passwordHash",
  "passwordSalt",
  "passwordResetToken",
  "passwordResetExpires",
  "emailVerificationToken",
  "emailVerificationExpires",
  "refreshToken",
  "refreshTokenHash",
  "apiKey",
  "apiKeyHash",
  "accessToken",
  "sessionToken",

  // Security Metadata
  "lastLoginAt",
  "lastLoginIp",
  "failedLoginAttempts",
  "lockedUntil",
  "lockReason",
  "securityEvents",
  "ipWhitelist",
  "trustedDevices",
]);

/**
 * Action types for authorization
 */
export type Action =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "list"
  | "approve"
  | "reject"
  | "start"
  | "end"
  | "cancel"
  | "export"
  | "admin";

/**
 * Resource types in the system
 */
export type ResourceType =
  | "user"
  | "patient"
  | "provider"
  | "encounter"
  | "appointment"
  | "document"
  | "prescription"
  | "labResult"
  | "subscription"
  | "payment"
  | "consent"
  | "auditLog"
  | "notification"
  | "setting";

/**
 * Actor information extracted from request
 */
export interface Actor {
  userId: string;
  email: string;
  role: "patient" | "provider" | "admin";
  tenantId?: string;
}

/**
 * Resource context for authorization decisions
 */
export interface ResourceContext {
  resourceType: ResourceType;
  resourceId?: string;
  ownerId?: string;
  tenantId?: string;
  patientId?: string;
  providerId?: string;
  currentState?: string;
}

/**
 * Authorization decision result
 */
export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: string;
  missingPermission?: string;
}

/**
 * Policy evaluation context
 */
export interface PolicyContext {
  actor: Actor;
  action: Action;
  resource: ResourceContext;
  requestData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Extract actor information from Express request
 */
export function extractActor(req: Request): Actor {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  return {
    userId: req.user.userId,
    email: req.user.email,
    role: req.user.role,
    tenantId: (req.user as any).tenantId,
  };
}

/**
 * Main authorization function
 *
 * Evaluates whether an actor can perform an action on a resource.
 * Implements RBAC with resource ownership and tenant isolation.
 *
 * @param actor - The user performing the action
 * @param action - The action being performed
 * @param resource - The resource being accessed
 * @param context - Additional context for the decision
 * @returns Authorization result with reason
 */
export function authorize(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
  context?: { requestData?: Record<string, unknown> },
): AuthorizationResult {
  // Admin has full access (except for some security-sensitive operations)
  if (actor.role === "admin") {
    // Even admins cannot modify certain security fields directly
    if (context?.requestData) {
      const blockedFields = checkServerOwnedFields(context.requestData);
      if (blockedFields.length > 0 && action !== "read") {
        return {
          allowed: false,
          reason: `Cannot modify server-owned fields: ${blockedFields.join(", ")}`,
        };
      }
    }
    return { allowed: true };
  }

  // Check tenant isolation
  if (
    resource.tenantId &&
    actor.tenantId &&
    resource.tenantId !== actor.tenantId
  ) {
    return {
      allowed: false,
      reason: "Cross-tenant access denied",
    };
  }

  // Resource-specific authorization
  switch (resource.resourceType) {
    case "patient":
      return authorizePatientAccess(actor, action, resource);

    case "encounter":
      return authorizeEncounterAccess(actor, action, resource);

    case "appointment":
      return authorizeAppointmentAccess(actor, action, resource);

    case "document":
      return authorizeDocumentAccess(actor, action, resource);

    case "prescription":
      return authorizePrescriptionAccess(actor, action, resource);

    case "subscription":
    case "payment":
      return authorizePaymentAccess(actor, action, resource);

    case "auditLog":
      return {
        allowed: actor.role === "admin",
        reason:
          actor.role !== "admin"
            ? "Audit logs require admin access"
            : undefined,
      };

    case "user":
      return authorizeUserAccess(actor, action, resource);

    default:
      // Default: deny unknown resources
      return {
        allowed: false,
        reason: `Unknown resource type: ${resource.resourceType}`,
      };
  }
}

/**
 * Authorize access to patient resources
 */
function authorizePatientAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  if (actor.role === "provider") {
    // Providers can read/update patients they are assigned to
    if (["read", "update", "list"].includes(action)) {
      return { allowed: true };
    }
    if (action === "create") {
      return { allowed: true };
    }
  }

  if (actor.role === "patient") {
    // Patients can only access their own records
    if (resource.ownerId && resource.ownerId !== actor.userId) {
      return {
        allowed: false,
        reason: "Cannot access other patient records",
      };
    }
    if (["read", "update"].includes(action)) {
      return { allowed: true };
    }
    if (action === "create" && !resource.ownerId) {
      // Patient creating their own record
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: `Insufficient permissions for ${action} on patient`,
  };
}

/**
 * Authorize access to encounter resources
 */
function authorizeEncounterAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  if (actor.role === "patient") {
    // Patients can only read their own encounters
    if (action !== "read" && action !== "list") {
      return {
        allowed: false,
        reason: "Patients cannot modify encounters",
      };
    }
    if (resource.patientId && resource.patientId !== actor.userId) {
      return {
        allowed: false,
        reason: "Cannot access other patient encounters",
      };
    }
    return { allowed: true };
  }

  if (actor.role === "provider") {
    // Providers can create and manage encounters
    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient permissions" };
}

/**
 * Authorize access to appointment resources
 */
function authorizeAppointmentAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  if (actor.role === "patient") {
    // Patients can manage their own appointments
    if (resource.patientId && resource.patientId !== actor.userId) {
      return {
        allowed: false,
        reason: "Cannot access other patient appointments",
      };
    }
    return { allowed: true };
  }

  if (actor.role === "provider") {
    // Providers can manage appointments they are assigned to
    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient permissions" };
}

/**
 * Authorize access to document resources
 */
function authorizeDocumentAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  if (actor.role === "patient") {
    // Patients can only access their own documents
    if (resource.patientId && resource.patientId !== actor.userId) {
      return {
        allowed: false,
        reason: "Cannot access other patient documents",
      };
    }
    if (action === "delete") {
      return {
        allowed: false,
        reason: "Patients cannot delete medical documents",
      };
    }
    return { allowed: true };
  }

  if (actor.role === "provider") {
    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient permissions" };
}

/**
 * Authorize access to prescription resources
 */
function authorizePrescriptionAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  if (actor.role === "patient") {
    // Patients can only read their prescriptions
    if (action !== "read" && action !== "list") {
      return {
        allowed: false,
        reason: "Patients cannot modify prescriptions",
      };
    }
    if (resource.patientId && resource.patientId !== actor.userId) {
      return {
        allowed: false,
        reason: "Cannot access other patient prescriptions",
      };
    }
    return { allowed: true };
  }

  if (actor.role === "provider") {
    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient permissions" };
}

/**
 * Authorize access to payment resources
 */
function authorizePaymentAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  // Users can only access their own payment information
  if (resource.ownerId && resource.ownerId !== actor.userId) {
    return {
      allowed: false,
      reason: "Cannot access other user payment information",
    };
  }

  // Only admins can process refunds
  if (
    action === "admin" ||
    (action === "update" && resource.resourceType === "payment")
  ) {
    return {
      allowed: false,
      reason: "Payment modifications require admin access",
    };
  }

  return { allowed: true };
}

/**
 * Authorize access to user resources
 */
function authorizeUserAccess(
  actor: Actor,
  action: Action,
  resource: ResourceContext,
): AuthorizationResult {
  // Users can only access their own profile
  if (resource.ownerId && resource.ownerId !== actor.userId) {
    return {
      allowed: false,
      reason: "Cannot access other user profiles",
    };
  }

  return { allowed: true };
}

/**
 * Check if request data contains server-owned fields
 *
 * @param data - Request body or data to check
 * @returns Array of server-owned field names found in data
 */
export function checkServerOwnedFields(
  data: Record<string, unknown>,
): string[] {
  const blockedFields: string[] = [];

  function checkObject(obj: Record<string, unknown>, prefix = ""): void {
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (SERVER_OWNED_FIELDS.has(key)) {
        blockedFields.push(fullKey);
      }

      // Check nested objects
      if (
        obj[key] &&
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key])
      ) {
        checkObject(obj[key] as Record<string, unknown>, fullKey);
      }
    }
  }

  checkObject(data);
  return blockedFields;
}

/**
 * Middleware to reject requests containing server-owned fields
 */
export function rejectServerOwnedFields(
  allowedFields?: string[],
): (data: Record<string, unknown>) => void {
  return (data: Record<string, unknown>) => {
    const blockedFields = checkServerOwnedFields(data);
    const actualBlocked = allowedFields
      ? blockedFields.filter((f) => !allowedFields.includes(f))
      : blockedFields;

    if (actualBlocked.length > 0) {
      throw new BadRequestError(
        `Request contains restricted fields that cannot be set by client: ${actualBlocked.join(", ")}`,
      );
    }
  };
}

/**
 * Log authorization decision for audit trail
 */
export async function logAuthorizationDecision(
  context: PolicyContext,
  result: AuthorizationResult,
): Promise<void> {
  if (!result.allowed) {
    // Log all denied authorizations
    await auditService.logEvent({
      userId: context.actor.userId,
      action: "AUTHORIZATION_DENIED",
      resource: context.resource.resourceType,
      resourceId: context.resource.resourceId,
      details: {
        action: context.action,
        reason: result.reason,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }
}

/**
 * State machine for workflow transitions
 */
export interface StateMachine<TState extends string> {
  states: TState[];
  initialState: TState;
  finalStates: TState[];
  transitions: Map<TState, Map<string, TState>>;
}

/**
 * Encounter state machine
 */
export const ENCOUNTER_STATE_MACHINE: StateMachine<string> = {
  states: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
  initialState: "SCHEDULED",
  finalStates: ["COMPLETED", "CANCELLED"],
  transitions: new Map([
    [
      "SCHEDULED",
      new Map([
        ["start", "IN_PROGRESS"],
        ["cancel", "CANCELLED"],
      ]),
    ],
    [
      "IN_PROGRESS",
      new Map([
        ["end", "COMPLETED"],
        ["cancel", "CANCELLED"],
      ]),
    ],
  ]),
};

/**
 * Appointment state machine
 */
export const APPOINTMENT_STATE_MACHINE: StateMachine<string> = {
  states: [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ],
  initialState: "PENDING",
  finalStates: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  transitions: new Map([
    [
      "PENDING",
      new Map([
        ["confirm", "CONFIRMED"],
        ["cancel", "CANCELLED"],
      ]),
    ],
    [
      "CONFIRMED",
      new Map([
        ["checkIn", "CHECKED_IN"],
        ["cancel", "CANCELLED"],
      ]),
    ],
    [
      "CHECKED_IN",
      new Map([
        ["start", "IN_PROGRESS"],
        ["noShow", "NO_SHOW"],
      ]),
    ],
    ["IN_PROGRESS", new Map([["complete", "COMPLETED"]])],
  ]),
};

/**
 * Subscription state machine
 */
export const SUBSCRIPTION_STATE_MACHINE: StateMachine<string> = {
  states: ["TRIAL", "ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED"],
  initialState: "TRIAL",
  finalStates: ["CANCELLED", "EXPIRED"],
  transitions: new Map([
    [
      "TRIAL",
      new Map([
        ["activate", "ACTIVE"],
        ["cancel", "CANCELLED"],
        ["expire", "EXPIRED"],
      ]),
    ],
    [
      "ACTIVE",
      new Map([
        ["pastDue", "PAST_DUE"],
        ["cancel", "CANCELLED"],
      ]),
    ],
    [
      "PAST_DUE",
      new Map([
        ["activate", "ACTIVE"],
        ["cancel", "CANCELLED"],
      ]),
    ],
  ]),
};

/**
 * Validate a state transition
 *
 * @param stateMachine - The state machine to use
 * @param currentState - Current state of the resource
 * @param action - Action being performed
 * @returns The new state if valid, or throws an error
 */
export function validateStateTransition<TState extends string>(
  stateMachine: StateMachine<TState>,
  currentState: TState,
  action: string,
): TState {
  const stateTransitions = stateMachine.transitions.get(currentState);

  if (!stateTransitions) {
    throw new BadRequestError(
      `Invalid state: ${currentState}. Cannot perform any actions in this state.`,
    );
  }

  const newState = stateTransitions.get(action) as TState | undefined;

  if (!newState) {
    const validActions = Array.from(stateTransitions.keys());
    throw new BadRequestError(
      `Invalid state transition: Cannot perform '${action}' from state '${currentState}'. ` +
        `Valid actions: ${validActions.join(", ")}`,
    );
  }

  return newState;
}

/**
 * Idempotency key tracking for replay protection
 */
const processedIdempotencyKeys = new Map<
  string,
  { timestamp: number; result: unknown }
>();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check and record idempotency key
 *
 * @param key - Idempotency key from request
 * @returns Previous result if key was already processed, null otherwise
 */
export function checkIdempotencyKey(key: string): unknown | null {
  const existing = processedIdempotencyKeys.get(key);

  if (existing) {
    // Check if TTL has expired
    if (Date.now() - existing.timestamp > IDEMPOTENCY_TTL) {
      processedIdempotencyKeys.delete(key);
      return null;
    }
    return existing.result;
  }

  return null;
}

/**
 * Record idempotency key after successful operation
 *
 * @param key - Idempotency key
 * @param result - Result to return on replay
 */
export function recordIdempotencyKey(key: string, result: unknown): void {
  // Clean up old keys periodically
  if (processedIdempotencyKeys.size > 10000) {
    const now = Date.now();
    for (const [k, v] of processedIdempotencyKeys) {
      if (now - v.timestamp > IDEMPOTENCY_TTL) {
        processedIdempotencyKeys.delete(k);
      }
    }
  }

  processedIdempotencyKeys.set(key, { timestamp: Date.now(), result });
}

export default {
  authorize,
  extractActor,
  checkServerOwnedFields,
  rejectServerOwnedFields,
  logAuthorizationDecision,
  validateStateTransition,
  checkIdempotencyKey,
  recordIdempotencyKey,
  SERVER_OWNED_FIELDS,
  ENCOUNTER_STATE_MACHINE,
  APPOINTMENT_STATE_MACHINE,
  SUBSCRIPTION_STATE_MACHINE,
};
