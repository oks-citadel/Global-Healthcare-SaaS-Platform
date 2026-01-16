# User Impersonation Service

## Overview

The User Impersonation Service allows authorized administrators and support staff to temporarily access user accounts for debugging and customer support purposes. This feature is designed with security as the top priority, implementing multiple layers of protection and comprehensive audit logging.

## Security Controls

### 1. Environment-Based Enable/Disable

The impersonation feature is **disabled by default** and must be explicitly enabled via environment variable:

```env
IMPERSONATION_ENABLED=true
```

When disabled, all impersonation attempts will be rejected with a `SERVICE_DISABLED` error.

### 2. Role-Based Access Control

Only users with specific roles can initiate impersonation:

| Role | Can Impersonate Regular Users | Can Impersonate Admins |
|------|------------------------------|------------------------|
| SUPPORT | Yes | No |
| ADMIN | Yes | No |
| SUPER_ADMIN | Yes | Yes |

- Regular SUPPORT and ADMIN users cannot impersonate other administrators
- Only SUPER_ADMIN role can impersonate other admin users
- Regular users (PATIENT, PROVIDER, etc.) cannot use impersonation

### 3. Time-Limited Sessions

All impersonation sessions are strictly time-limited:

- **Default duration**: 60 minutes (1 hour)
- **Maximum duration**: 60 minutes (hardcoded limit)
- **Configurable via**: `MAX_IMPERSONATION_DURATION` environment variable

Sessions automatically expire after the configured duration. The maximum cannot exceed 60 minutes regardless of configuration.

### 4. Rate Limiting

To prevent abuse, impersonation is rate-limited per admin:

- **Limit**: 10 impersonation sessions per admin per hour
- **Window**: 1 hour rolling window
- Rate limits are tracked in Redis and reset automatically

When the rate limit is exceeded, a `RATE_LIMIT_EXCEEDED` error is returned.

### 5. Support Ticket Requirement

By default, a support ticket ID is required to start an impersonation session:

- Ensures impersonation is tied to legitimate support requests
- Creates an audit trail linking impersonation to specific issues
- Can be configured via the `requireTicketId` option

### 6. User Notifications

Users are automatically notified when their account is being impersonated:

- **Start notification**: In-app security alert when impersonation begins
- **End notification**: Alert when impersonation session ends
- Notifications include ticket reference and duration
- Cannot be disabled for production deployments

### 7. Comprehensive Audit Logging

Every impersonation action is fully logged:

**Logged Events**:
- `IMPERSONATION_STARTED`: Session initiation
- `IMPERSONATION_ENDED`: Session termination (manual, expired, or forced)

**Logged Data**:
- Admin user ID and email
- Target user ID and email
- Session ID (UUID)
- Support ticket ID
- IP address
- User agent string
- Reason for impersonation
- Start/end timestamps
- Session duration

Audit logs are stored in:
1. Database `AuditLog` table (permanent storage)
2. Redis for 90 days (ended sessions)
3. Console output for real-time monitoring

### 8. Single Active Session Per Admin

Each admin can only have one active impersonation session at a time:

- Prevents simultaneous impersonation of multiple users
- Reduces risk of session confusion
- Ensures clear accountability

## Configuration

### Environment Variables

```env
# Enable/disable impersonation (default: false)
IMPERSONATION_ENABLED=false

# Maximum session duration in minutes (default: 60, max: 60)
MAX_IMPERSONATION_DURATION=60
```

### Programmatic Configuration

```typescript
import { createImpersonationService } from './services/impersonation.service';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const impersonationService = createImpersonationService(prisma, redis, {
  enabled: true,
  maxDurationMinutes: 30,
  requireTicketId: true,
  notifyUser: true,
  allowedRoles: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'],
  excludedRoles: ['ADMIN', 'SUPER_ADMIN'],
  rateLimitMaxAttempts: 10,
  rateLimitWindowSeconds: 3600,
});
```

## Usage

### Starting an Impersonation Session

```typescript
const token = await impersonationService.startImpersonation({
  adminId: 'admin-user-id',
  targetUserId: 'user-to-impersonate-id',
  reason: 'Investigating billing issue reported by user',
  ticketId: 'SUPPORT-12345',
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
});

// token.token - Use this for API calls as the impersonated user
// token.expiresAt - Session expiration time
// token.sessionId - Unique session identifier
```

### Validating an Impersonation Token

```typescript
const session = await impersonationService.validateToken(token);
if (session) {
  // Token is valid, session contains impersonation details
  console.log(`Admin ${session.adminEmail} is impersonating ${session.targetUserEmail}`);
} else {
  // Token is invalid or expired
}
```

### Ending an Impersonation Session

```typescript
// Manual end
await impersonationService.endImpersonation(sessionId, 'manual');

// Force end (e.g., security event)
await impersonationService.endImpersonation(sessionId, 'forced');
```

### Getting Active Sessions (Monitoring)

```typescript
const activeSessions = await impersonationService.getAllActiveSessions();
console.log(`Currently ${activeSessions.length} active impersonation sessions`);
```

### Checking Rate Limit Status

```typescript
const rateLimit = await impersonationService.getRateLimitRemaining(adminId);
console.log(`Remaining: ${rateLimit.remaining}/${rateLimit.limit}`);
console.log(`Resets in: ${rateLimit.resetInSeconds} seconds`);
```

### Force End Sessions for a User

In case of security concerns, all impersonation sessions for a specific user can be terminated:

```typescript
const count = await impersonationService.forceEndAllSessionsForUser(userId);
console.log(`Terminated ${count} impersonation sessions`);
```

## Error Codes

| Code | Description |
|------|-------------|
| `SERVICE_DISABLED` | Impersonation feature is not enabled |
| `ADMIN_NOT_FOUND` | Admin user ID not found |
| `USER_NOT_FOUND` | Target user ID not found |
| `INSUFFICIENT_PERMISSIONS` | Admin role cannot perform impersonation |
| `CANNOT_IMPERSONATE_ADMIN` | Non-super-admin trying to impersonate admin |
| `TICKET_REQUIRED` | Support ticket ID is required |
| `SESSION_ALREADY_ACTIVE` | Admin already has an active session |
| `SESSION_NOT_FOUND` | Session ID not found |
| `RATE_LIMIT_EXCEEDED` | Too many impersonation attempts |

## Security Best Practices

### For Deployment

1. **Keep disabled by default**: Only enable `IMPERSONATION_ENABLED=true` when actively needed
2. **Monitor audit logs**: Set up alerts for impersonation events in your SIEM
3. **Review access regularly**: Periodically audit who has impersonation-capable roles
4. **Use short sessions**: Configure `MAX_IMPERSONATION_DURATION` to the minimum needed

### For Admins Using Impersonation

1. **Always provide a valid ticket ID**: Creates accountability
2. **Document the reason clearly**: Helps with audit reviews
3. **End sessions promptly**: Don't leave sessions active longer than needed
4. **Never share impersonation tokens**: They're tied to your admin account

### For Security Teams

1. **Monitor for anomalies**:
   - High frequency of impersonation by specific admins
   - Impersonation outside business hours
   - Impersonation of privileged accounts

2. **Retain audit logs**: Keep impersonation audit logs for compliance (minimum 1 year recommended)

3. **Regular access reviews**: Quarterly review of who has ADMIN/SUPER_ADMIN/SUPPORT roles

## Compliance Considerations

### HIPAA

- All impersonation events create audit trail entries required by HIPAA
- PHI access through impersonation is logged with admin identity
- Session time limits reduce exposure window

### SOC 2

- Role-based access control satisfies access management requirements
- Audit logging provides evidence for monitoring controls
- Rate limiting demonstrates abuse prevention controls

### GDPR

- Users are notified when their data is accessed via impersonation
- Clear purpose requirement (ticket ID + reason) supports legitimate interest basis
- Audit logs support accountability principle

## Troubleshooting

### "SERVICE_DISABLED" Error

```
Error: User impersonation is disabled. Set IMPERSONATION_ENABLED=true to enable.
```

**Solution**: Add `IMPERSONATION_ENABLED=true` to your environment variables and restart the service.

### "RATE_LIMIT_EXCEEDED" Error

```
Error: Rate limit exceeded. Maximum 10 impersonation sessions per hour allowed.
```

**Solution**: Wait for the rate limit window to reset (up to 1 hour) or contact a SUPER_ADMIN to review if additional impersonation capacity is needed.

### Session Expired Unexpectedly

Sessions expire after `MAX_IMPERSONATION_DURATION` minutes (default 60). If you need longer sessions, this is intentionally limited for security. Consider ending and starting a new session if more time is needed.

## API Reference

### ImpersonationService Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `isEnabled()` | Check if service is enabled | `boolean` |
| `getConfig()` | Get current configuration | `ImpersonationConfig` |
| `startImpersonation(request)` | Start a new session | `ImpersonationToken` |
| `endImpersonation(sessionId, reason)` | End an active session | `void` |
| `validateToken(token)` | Validate an impersonation token | `ImpersonationSession \| null` |
| `getActiveSessionByAdmin(adminId)` | Get admin's active session | `ImpersonationSession \| null` |
| `getAllActiveSessions()` | List all active sessions | `ImpersonationSession[]` |
| `forceEndAllSessionsForUser(userId)` | End all sessions for a user | `number` |
| `getImpersonationHistory(filters, pagination)` | Query session history | `{ sessions, total }` |
| `getRateLimitRemaining(adminId)` | Check rate limit status | `{ remaining, limit, resetInSeconds }` |
