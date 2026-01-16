# Admin User Impersonation Service

## Overview

The Impersonation Service allows authorized support and admin users to temporarily access user accounts for debugging and support purposes. All impersonation actions are fully audited with comprehensive security controls.

**Service Location:** `services/api/src/services/impersonation.service.ts.disabled`

> **Note:** This service is currently disabled (`.disabled` extension) and must be explicitly enabled after security review. See [Enabling the Service](#enabling-the-service).

---

## Table of Contents

- [Security Requirements](#security-requirements)
- [Authorization Model](#authorization-model)
- [Configuration](#configuration)
- [Usage](#usage)
- [Audit Log Review Procedures](#audit-log-review-procedures)
- [Support Team Procedures](#support-team-procedures)
- [API Reference](#api-reference)
- [Incident Response](#incident-response)

---

## Security Requirements

### Prerequisites for Deployment

Before enabling this service in production, ensure:

- [ ] Security team has reviewed and approved the implementation
- [ ] Legal team has approved user notification language
- [ ] Privacy policy includes disclosure about support access
- [ ] Audit log retention meets compliance requirements (minimum 90 days)
- [ ] PagerDuty/alerting is configured for impersonation events
- [ ] Regular audit review schedule is established

### Security Features

| Feature | Description |
|---------|-------------|
| **Role-Based Access** | Only ADMIN, SUPER_ADMIN, and SUPPORT roles can impersonate |
| **Admin Protection** | Cannot impersonate other admins without SUPER_ADMIN role |
| **Time-Limited Sessions** | Maximum 60-minute session duration |
| **Support Ticket Required** | Must provide ticket ID for audit trail |
| **User Notifications** | Users are notified when impersonation starts/ends |
| **Full Audit Trail** | All actions logged with IP and user agent |
| **Session Monitoring** | Real-time visibility into active impersonation sessions |
| **Force Termination** | Ability to immediately end all sessions for a user |

---

## Authorization Model

### Role Permissions

| Role | Can Impersonate | Can Impersonate Admins | Session Limit |
|------|-----------------|------------------------|---------------|
| SUPPORT | Patients, Providers | No | 60 min |
| ADMIN | Patients, Providers | No | 60 min |
| SUPER_ADMIN | All users | Yes | 60 min |

### Protected Users

The following roles cannot be impersonated by non-SUPER_ADMIN users:
- ADMIN
- SUPER_ADMIN

### Validation Checks

When starting an impersonation session, the service validates:

1. Admin user exists and has valid permissions
2. Target user exists and is impersonatable
3. Support ticket ID is provided (if required)
4. No existing active session for this admin
5. Target user is not protected (unless SUPER_ADMIN)

---

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REDIS_URL` | Redis connection for session storage | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `IMPERSONATION_MAX_DURATION` | Maximum session duration (minutes) | No | `60` |
| `IMPERSONATION_REQUIRE_TICKET` | Require support ticket ID | No | `true` |
| `IMPERSONATION_NOTIFY_USER` | Send notifications to impersonated users | No | `true` |

### Service Configuration

```typescript
interface ImpersonationConfig {
  maxDurationMinutes: number;     // Default: 60
  requireTicketId: boolean;       // Default: true
  notifyUser: boolean;            // Default: true
  allowedRoles: string[];         // Default: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT']
  excludedRoles: string[];        // Default: ['ADMIN', 'SUPER_ADMIN']
}
```

### Enabling the Service

1. Rename the service file:
   ```bash
   mv services/api/src/services/impersonation.service.ts.disabled \
      services/api/src/services/impersonation.service.ts
   ```

2. Add to service registry in your API initialization:
   ```typescript
   import { createImpersonationService } from './services/impersonation.service';

   const impersonationService = createImpersonationService(prisma, redis, {
     maxDurationMinutes: 60,
     requireTicketId: true,
     notifyUser: true,
   });
   ```

3. Register API routes (see [API Reference](#api-reference))

---

## Usage

### Starting an Impersonation Session

```typescript
const token = await impersonationService.startImpersonation({
  adminId: 'admin-user-uuid',
  targetUserId: 'target-user-uuid',
  reason: 'Investigating payment issue reported in ticket',
  ticketId: 'TICKET-12345',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});

// Use token.token for subsequent requests as the impersonated user
```

### Validating Impersonation Token

In your authentication middleware:

```typescript
async function authMiddleware(req, res, next) {
  const impersonationToken = req.headers['x-impersonation-token'];

  if (impersonationToken) {
    const session = await impersonationService.validateToken(impersonationToken);
    if (session) {
      req.user = await getUser(session.targetUserId);
      req.impersonationSession = session;
      req.isImpersonated = true;
      return next();
    }
  }

  // Normal auth flow...
}
```

### Ending an Impersonation Session

```typescript
// Manual end by admin
await impersonationService.endImpersonation(sessionId, 'manual');

// Force end (security event)
await impersonationService.endImpersonation(sessionId, 'forced');

// Automatic expiration handled by service
```

### Monitoring Active Sessions

```typescript
// Get all active impersonation sessions
const activeSessions = await impersonationService.getAllActiveSessions();

// Check for session by admin
const adminSession = await impersonationService.getActiveSessionByAdmin(adminId);

// Force end all sessions for a user (e.g., security incident)
const count = await impersonationService.forceEndAllSessionsForUser(userId);
```

---

## Audit Log Review Procedures

### Daily Review Checklist

The Security/Compliance team should review impersonation logs daily:

1. **Check for unusual patterns:**
   - Same user impersonated multiple times
   - Sessions exceeding 30 minutes
   - Multiple failed impersonation attempts
   - Impersonation outside business hours

2. **Verify ticket correlation:**
   - Each impersonation should have a valid support ticket
   - Ticket reason should match impersonation reason

3. **Review forced terminations:**
   - Any "forced" session ends require investigation

### Weekly Audit Report

Generate a weekly summary:

```typescript
const history = await impersonationService.getImpersonationHistory(
  {
    startDate: weekStart,
    endDate: weekEnd,
  },
  { page: 1, limit: 1000 }
);

// Generate report
const report = {
  totalSessions: history.total,
  uniqueAdmins: new Set(history.sessions.map(s => s.adminId)).size,
  uniqueUsers: new Set(history.sessions.map(s => s.targetUserId)).size,
  averageDuration: calculateAverageDuration(history.sessions),
  byEndReason: groupBy(history.sessions, 'endReason'),
};
```

### Audit Log Queries

**Find all impersonations for a specific user:**

```sql
SELECT * FROM "AuditLog"
WHERE "resourceType" = 'IMPERSONATION'
AND "resourceId" = 'target-user-uuid'
ORDER BY "createdAt" DESC;
```

**Find long-running sessions:**

```sql
SELECT * FROM "AuditLog"
WHERE "resourceType" = 'IMPERSONATION'
AND "action" = 'IMPERSONATION_ENDED'
AND (details->>'duration')::int > 1800  -- > 30 minutes
ORDER BY "createdAt" DESC;
```

**Sessions without tickets (compliance issue):**

```sql
SELECT * FROM "AuditLog"
WHERE "resourceType" = 'IMPERSONATION'
AND "action" = 'IMPERSONATION_STARTED'
AND (details->>'ticketId') IS NULL
ORDER BY "createdAt" DESC;
```

### Retention Requirements

| Data Type | Retention Period | Location |
|-----------|------------------|----------|
| Active Sessions | Until expired (max 60 min) | Redis |
| Ended Sessions | 90 days | Redis |
| Audit Logs | 7 years | PostgreSQL |
| User Notifications | 1 year | PostgreSQL |

---

## Support Team Procedures

### When to Use Impersonation

Use impersonation ONLY when:

1. User has explicitly requested support
2. Support ticket exists documenting the issue
3. Issue cannot be diagnosed from logs/admin panels
4. User has been informed support may access their account

### Step-by-Step Process

#### 1. Create Support Ticket

- Document user's issue in detail
- Note all troubleshooting steps already attempted
- Get user confirmation for account access

#### 2. Start Impersonation

1. Navigate to Admin Panel > Support Tools > Impersonation
2. Enter user's email or ID
3. Enter support ticket ID
4. Provide brief reason (will be audited)
5. Click "Start Session"

#### 3. During Session

- Perform only actions necessary to diagnose/resolve the issue
- Do not access unnecessary data (PHI, financial, etc.)
- Document all findings in the support ticket
- End session as soon as possible

#### 4. End Session

1. Click "End Impersonation" in the admin bar
2. Or session will auto-expire after 60 minutes
3. User receives notification that access has ended

#### 5. Documentation

- Update support ticket with findings
- Note any actions taken on behalf of user
- Close ticket with resolution

### Prohibited Actions During Impersonation

- Accessing data unrelated to the support issue
- Making changes without user authorization
- Sharing screenshots or data externally
- Accessing financial/billing information (unless ticket-related)
- Accessing other users' data through impersonated account

---

## API Reference

### Endpoints

#### POST /admin/impersonation/start

Start an impersonation session.

**Request:**
```json
{
  "targetUserId": "uuid",
  "reason": "Investigating issue with appointment booking",
  "ticketId": "TICKET-12345"
}
```

**Response:**
```json
{
  "token": "base64-encoded-token",
  "sessionId": "uuid",
  "originalAdminId": "uuid",
  "impersonatedUserId": "uuid",
  "expiresAt": "2025-01-15T15:00:00Z"
}
```

#### POST /admin/impersonation/:sessionId/end

End an impersonation session.

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "duration": 1234
}
```

#### GET /admin/impersonation/active

List all active impersonation sessions (monitoring).

**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "uuid",
      "adminEmail": "admin@example.com",
      "targetUserEmail": "user@example.com",
      "reason": "...",
      "startedAt": "2025-01-15T14:00:00Z",
      "expiresAt": "2025-01-15T15:00:00Z"
    }
  ]
}
```

#### GET /admin/impersonation/history

Query impersonation history.

**Query Parameters:**
- `adminId` - Filter by admin
- `targetUserId` - Filter by target user
- `startDate` - Start of date range
- `endDate` - End of date range
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

### Error Codes

| Code | Description |
|------|-------------|
| `ADMIN_NOT_FOUND` | Admin user ID does not exist |
| `USER_NOT_FOUND` | Target user ID does not exist |
| `INSUFFICIENT_PERMISSIONS` | Admin role cannot impersonate |
| `CANNOT_IMPERSONATE_ADMIN` | Target is admin (requires SUPER_ADMIN) |
| `TICKET_REQUIRED` | Support ticket ID is required |
| `SESSION_ALREADY_ACTIVE` | Admin already has an active session |
| `SESSION_NOT_FOUND` | Session ID does not exist |

---

## Incident Response

### Security Incident: Unauthorized Access

If impersonation is suspected to have been misused:

1. **Immediate Actions:**
   ```typescript
   // Force end all sessions for the affected user
   await impersonationService.forceEndAllSessionsForUser(userId);

   // Disable the admin's account
   await userService.disableUser(adminId);
   ```

2. **Investigation:**
   - Pull all audit logs for the admin
   - Review all actions taken during impersonation
   - Check for data exfiltration
   - Notify security team

3. **User Communication:**
   - Notify affected user immediately
   - Provide transparency about what was accessed
   - Offer support (password reset, etc.)

4. **Remediation:**
   - Review admin access policies
   - Consider additional controls
   - Document incident and response

### Disabling Impersonation Service

In case of security emergency, disable the service:

```bash
# Rename to disable
mv services/api/src/services/impersonation.service.ts \
   services/api/src/services/impersonation.service.ts.disabled

# Restart API service
pm2 restart api-service
```

---

## Related Documentation

- [Access Control Matrix](../ACCESS_CONTROL_MATRIX.md)
- [Audit Logging Documentation](../compliance/AUDIT-LOGGING-DOCUMENTATION.md)
- [Incident Response Procedures](../compliance/INCIDENT-RESPONSE-PROCEDURES.md)
- [HIPAA Compliance Checklist](../compliance/HIPAA-COMPLIANCE-CHECKLIST.md)

---

**Last Updated:** January 2025
**Maintained By:** Security & Platform Engineering Teams
**Review Required:** Annually or after any security incident
