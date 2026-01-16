# Security Documentation

**UnifiedHealth Global Platform - Security Architecture**

---

## Table of Contents

1. [Overview](#overview)
2. [Security Architecture](#security-architecture)
3. [Running Security Checks](#running-security-checks)
4. [PR Gating Requirements](#pr-gating-requirements)
5. [DTO Policy](#dto-policy)
6. [Authorization Policy](#authorization-policy)
7. [State Machine Rules](#state-machine-rules)
8. [Audit Logging](#audit-logging)
9. [Contributing Security-Safe Code](#contributing-security-safe-code)
10. [Incident Response](#incident-response)

---

## Overview

This document describes the security architecture, policies, and procedures for the UnifiedHealth Global Platform. All developers must understand and follow these guidelines to maintain the security posture of the application.

### Compliance Frameworks

The platform is designed to comply with:

- **HIPAA** - Health Insurance Portability and Accountability Act
- **GDPR** - General Data Protection Regulation
- **CCPA** - California Consumer Privacy Act
- **SOC 2** - Service Organization Control 2

---

## Security Architecture

### Defense in Depth

The platform implements multiple layers of security:

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│  - Rate Limiting                                                │
│  - DDoS Protection                                              │
│  - Request Validation                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Layer                          │
│  - JWT Verification                                              │
│  - Token Rotation                                                │
│  - Session Management                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Authorization Layer                           │
│  - Role-Based Access Control (RBAC)                             │
│  - Resource Ownership Verification                               │
│  - Tenant Isolation                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Input Validation Layer                        │
│  - DTO Schema Validation (Zod)                                  │
│  - Server-Owned Field Rejection                                  │
│  - Sanitization                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  - State Machine Enforcement                                     │
│  - Approval Flow Validation                                      │
│  - Idempotency Handling                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│  - Field-Level Encryption (AES-256-GCM)                         │
│  - Audit Logging                                                 │
│  - Tenant Scoping                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Running Security Checks

### Local Development

Run all security checks before committing:

```bash
# Full security check (recommended before PR)
pnpm security:pr

# Individual checks:
pnpm security:audit         # Dependency vulnerability scan
pnpm security:agent         # Custom security pattern scan
pnpm security:abuse-tests   # Business logic abuse tests
pnpm security:secrets       # Secret detection (gitleaks)
pnpm security:all           # All checks including lint/typecheck
```

### Understanding Results

The security agent outputs a report to `SECURITY/security-report.md` with findings categorized by severity:

| Severity | Action Required                |
| -------- | ------------------------------ |
| CRITICAL | Fix immediately, blocks merge  |
| HIGH     | Fix within 24 hours            |
| MEDIUM   | Fix within 1 week              |
| LOW      | Address in regular maintenance |

---

## PR Gating Requirements

Every Pull Request triggers automated security checks via GitHub Actions. The following must pass:

1. **Dependency Audit** - No high/critical vulnerabilities in dependencies
2. **SAST Analysis** - Semgrep scans for security patterns
3. **Secret Scanning** - Gitleaks detects leaked secrets
4. **Security Agent** - Custom vulnerability pattern detection
5. **Abuse Tests** - Business logic abuse test suite

### What Blocks a Merge

- Any CRITICAL or HIGH severity finding from security agent
- Failing business logic abuse tests
- Detected secrets in code
- Known high/critical CVEs in dependencies

---

## DTO Policy

### Server-Owned Fields

The following fields can NEVER be set via client input:

```typescript
// Identity & Access Control
("role", "isAdmin", "permissions", "status", "emailVerified");

// Ownership & Tenancy
("userId", "tenantId", "ownerId", "createdBy", "updatedBy");

// Approval & Workflow States
("approved", "approvedBy", "verified", "verifiedBy", "workflowState");

// Subscription & Billing
("subscriptionTier",
  "billingStatus",
  "quota",
  "credits",
  "balance",
  "discount");

// System Fields
("id", "createdAt", "updatedAt", "deletedAt", "version");

// Security Tokens
("password", "passwordHash", "refreshToken", "apiKey");
```

### DTO Schema Requirements

All DTOs must:

1. **Use `.strict()`** - Reject unknown fields
2. **Validate all inputs** - No raw `req.body` passthrough
3. **Define explicit allowlist** - Only include safe, user-settable fields

Example:

```typescript
export const UpdateUserSchema = z
  .object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    // role, status, etc. are intentionally NOT included
  })
  .strict(); // Rejects unknown fields
```

---

## Authorization Policy

### Role-Based Access Control

| Role       | Permissions                                                  |
| ---------- | ------------------------------------------------------------ |
| `admin`    | Full access to all resources                                 |
| `provider` | Read/write patients, encounters, appointments, prescriptions |
| `patient`  | Read/write own data only                                     |
| `staff`    | Read appointments/patients, write appointments               |

### Authorization Pattern

Every controller must implement authorization:

```typescript
// 1. Authenticate the user
router.get("/resources/:id", authenticate, async (req, res) => {
  // 2. Extract actor
  const actor = extractActor(req);

  // 3. Get resource context
  const resource = await getResource(req.params.id);

  // 4. Authorize
  const result = authorize(actor, "read", {
    resourceType: "resource",
    resourceId: resource.id,
    ownerId: resource.ownerId,
    tenantId: resource.tenantId,
  });

  if (!result.allowed) {
    throw new ForbiddenError(result.reason);
  }

  // 5. Proceed with business logic
  res.json(resource);
});
```

### Tenant Isolation

All database queries MUST include tenant scoping:

```typescript
// CORRECT
const resources = await prisma.resource.findMany({
  where: {
    tenantId: req.user.tenantId, // Always include
    ...otherFilters,
  },
});

// WRONG - Cross-tenant data leak
const resources = await prisma.resource.findMany({
  where: { ...otherFilters }, // Missing tenant filter!
});
```

---

## State Machine Rules

### Encounter States

```
SCHEDULED ──start──> IN_PROGRESS ──end──> COMPLETED
     │                    │
     └──cancel───>  CANCELLED  <───cancel───┘
```

Valid transitions:

- `SCHEDULED` → `IN_PROGRESS` (via `/encounters/:id/start`)
- `SCHEDULED` → `CANCELLED` (via `/encounters/:id/cancel`)
- `IN_PROGRESS` → `COMPLETED` (via `/encounters/:id/end`)
- `IN_PROGRESS` → `CANCELLED` (via `/encounters/:id/cancel`)

**Invalid**: Direct status changes via PATCH endpoint

### Appointment States

```
PENDING ──confirm──> CONFIRMED ──checkIn──> CHECKED_IN ──start──> IN_PROGRESS ──complete──> COMPLETED
   │                     │                      │
   └──cancel───>  CANCELLED  <───cancel────┘    └──noShow──> NO_SHOW
```

### Implementation

Use the state machine utility:

```typescript
import {
  validateStateTransition,
  ENCOUNTER_STATE_MACHINE,
} from "../lib/security-policy.js";

// Validate transition before updating
const newState = validateStateTransition(
  ENCOUNTER_STATE_MACHINE,
  encounter.status,
  "start", // action
);

// If no error thrown, proceed with update
await prisma.encounter.update({
  where: { id: encounterId },
  data: { status: newState },
});
```

---

## Audit Logging

### Required Events

The following actions MUST be logged:

| Category       | Events                                                   |
| -------------- | -------------------------------------------------------- |
| Authentication | Login, logout, failed login, password change, MFA events |
| Authorization  | Access denied, role changes, permission grants           |
| PHI Access     | View patient record, download document, export data      |
| Workflow       | State transitions, approvals, rejections                 |
| Admin          | User management, configuration changes, bulk operations  |
| Billing        | Subscription changes, payment events, refunds            |

### Audit Log Schema

```typescript
interface AuditEvent {
  id: string; // Unique event ID
  userId: string; // Actor performing action
  tenantId: string; // Tenant context
  action: string; // Action type (e.g., "PHI_ACCESS")
  resource: string; // Resource type (e.g., "patient")
  resourceId: string; // Specific resource ID
  details: {
    // Additional context
    before?: object; // State before change
    after?: object; // State after change
    reason?: string; // Reason for action
  };
  ipAddress: string; // Client IP
  userAgent: string; // Client user agent
  correlationId: string; // Request correlation ID
  timestamp: Date; // Event timestamp
}
```

### Retention

Audit logs are retained for **6 years** per HIPAA requirements.

---

## Contributing Security-Safe Code

### New Endpoint Checklist

When adding a new endpoint:

- [ ] Create strict DTO schema with `.strict()`
- [ ] Add authentication middleware
- [ ] Add authorization check
- [ ] Verify tenant isolation in queries
- [ ] Add audit logging for sensitive operations
- [ ] Write abuse test cases
- [ ] Update endpoint inventory

### Code Review Security Checklist

Reviewers should verify:

- [ ] No `req.body` passed directly to ORM
- [ ] No server-owned fields in DTOs
- [ ] Authorization checks present
- [ ] Tenant scoping in queries
- [ ] No hardcoded secrets
- [ ] No console.log with sensitive data
- [ ] Error responses don't leak internal details

### Security Testing

Before submitting a PR:

```bash
# Run the full security suite
pnpm security:pr

# Run specific abuse tests
pnpm security:abuse-tests

# Check for secrets
pnpm security:secrets
```

---

## Incident Response

### Reporting Security Issues

Report security vulnerabilities to: `security@unifiedhealth.io`

Do NOT:

- Open public GitHub issues for security vulnerabilities
- Discuss vulnerabilities in public channels

### Incident Severity Levels

| Level         | Description                        | Response Time |
| ------------- | ---------------------------------- | ------------- |
| P1 - Critical | Active exploitation, data breach   | Immediate     |
| P2 - High     | Vulnerability with easy exploit    | 4 hours       |
| P3 - Medium   | Vulnerability requiring conditions | 24 hours      |
| P4 - Low      | Informational, hardening           | 1 week        |

### Breach Notification

Per HIPAA requirements, breaches affecting PHI must be reported within **60 days**.

---

## Files Reference

| File                                                 | Purpose                               |
| ---------------------------------------------------- | ------------------------------------- |
| `SECURITY/endpoint-inventory.md`                     | Complete API endpoint security matrix |
| `SECURITY/security-report.md`                        | Latest security scan results          |
| `services/api/src/lib/security-policy.ts`            | Authorization policy layer            |
| `services/api/src/middleware/security.middleware.ts` | Security middleware                   |
| `services/api/tests/security/business-logic-abuse/`  | Abuse test suite                      |
| `tools/security-agent/scan.ts`                       | Security scanner                      |
| `.github/workflows/security-check.yml`               | CI security pipeline                  |

---

## Version History

| Version | Date       | Changes                    |
| ------- | ---------- | -------------------------- |
| 1.0     | 2024-12-23 | Initial security hardening |

---

_UnifiedHealth Global Platform - Security Documentation_
