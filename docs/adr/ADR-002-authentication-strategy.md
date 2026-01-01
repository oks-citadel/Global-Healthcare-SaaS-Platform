# ADR-002: Authentication Strategy (JWT)

## Status
Accepted

## Date
2025-12

## Context

The UnifiedHealth Platform requires a robust authentication and authorization system that:

1. **Supports Multiple Clients**: Web application, mobile apps (iOS/Android), admin portal, and partner API integrations
2. **Enables Microservices**: Authentication must work across distributed services without tight coupling
3. **Handles Healthcare Compliance**: HIPAA requires audit trails and secure access controls
4. **Provides Good UX**: Quick login, session persistence, seamless token refresh
5. **Scales Globally**: Must work efficiently across multi-region deployments

We evaluated several authentication approaches:

| Approach | Pros | Cons |
|----------|------|------|
| **Session-based** | Simple, server-controlled logout | Requires session store, doesn't scale well |
| **JWT** | Stateless, scalable, works across services | Token revocation complex, larger payload |
| **OAuth 2.0 + OIDC** | Standard, supports SSO | Complex setup, overkill for first-party apps |
| **API Keys** | Simple for service-to-service | Not suitable for end users |

## Decision

We will use **JSON Web Tokens (JWT)** as the primary authentication mechanism with the following implementation:

### Token Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        JWT Token                             │
├─────────────────────────────────────────────────────────────┤
│  Header: { alg: "RS256", typ: "JWT" }                       │
│  Payload: {                                                  │
│    sub: "user-uuid",          // User ID                     │
│    email: "user@example.com", // User email                  │
│    role: "patient",           // User role                   │
│    permissions: [...],        // Fine-grained permissions    │
│    iat: 1704067200,          // Issued at                    │
│    exp: 1704068100,          // Expires (15 min)             │
│    jti: "token-uuid"         // Token ID for revocation      │
│  }                                                           │
│  Signature: RS256(header + payload, private_key)             │
└─────────────────────────────────────────────────────────────┘
```

### Token Types

| Token | Lifetime | Purpose | Storage |
|-------|----------|---------|---------|
| **Access Token** | 15 minutes | API authentication | Memory/short-lived storage |
| **Refresh Token** | 7 days | Obtain new access tokens | HttpOnly secure cookie |
| **MFA Token** | 5 minutes | Temporary token during MFA flow | Memory only |

### Authentication Flow

```
┌────────┐         ┌────────────┐         ┌──────────┐
│ Client │         │Auth Service│         │  Redis   │
└───┬────┘         └─────┬──────┘         └────┬─────┘
    │                    │                     │
    │ POST /auth/login   │                     │
    │ {email, password}  │                     │
    │───────────────────>│                     │
    │                    │                     │
    │                    │ Validate credentials│
    │                    │<───────────────────>│
    │                    │                     │
    │                    │ Check MFA status    │
    │                    │<───────────────────>│
    │                    │                     │
    │  If MFA enabled:   │                     │
    │  {mfaRequired, mfaToken}                 │
    │<───────────────────│                     │
    │                    │                     │
    │ POST /mfa/verify   │                     │
    │ {mfaToken, code}   │                     │
    │───────────────────>│                     │
    │                    │                     │
    │ {accessToken,      │                     │
    │  refreshToken}     │                     │
    │<───────────────────│                     │
    │                    │                     │
    │ GET /api/resource  │                     │
    │ Authorization:     │                     │
    │   Bearer {token}   │                     │
    │───────────────────>│                     │
    │                    │ Verify signature    │
    │                    │ Check expiration    │
    │                    │ Validate jti        │
    │                    │<───────────────────>│
    │                    │                     │
    │  {resource data}   │                     │
    │<───────────────────│                     │
```

### Token Refresh Flow

```
Client                    Auth Service               Redis
   │                           │                       │
   │ POST /auth/refresh        │                       │
   │ {refreshToken}            │                       │
   │──────────────────────────>│                       │
   │                           │                       │
   │                           │ Validate refresh token│
   │                           │<─────────────────────>│
   │                           │                       │
   │                           │ Check not revoked     │
   │                           │<─────────────────────>│
   │                           │                       │
   │ {newAccessToken,          │                       │
   │  newRefreshToken}         │                       │
   │<──────────────────────────│                       │
   │                           │                       │
   │                           │ Revoke old refresh    │
   │                           │ token (rotation)      │
   │                           │──────────────────────>│
```

### Security Measures

1. **RS256 Signing**: Asymmetric key signing for secure verification across services
2. **Short Access Token Lifetime**: 15 minutes to limit exposure window
3. **Refresh Token Rotation**: New refresh token issued on each refresh
4. **Token Revocation**: JTI tracked in Redis for immediate revocation
5. **Secure Cookie Storage**: Refresh tokens in HttpOnly, Secure, SameSite cookies
6. **Rate Limiting**: Authentication endpoints rate-limited to prevent brute force
7. **Account Lockout**: Temporary lockout after failed login attempts
8. **MFA Support**: TOTP-based multi-factor authentication with backup codes

### Multi-Factor Authentication (MFA)

```
┌─────────────────────────────────────────────────────────────┐
│                     MFA Implementation                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Supported Methods:                                          │
│  ├── TOTP (Time-based One-Time Password)                    │
│  │   └── Compatible with Google Authenticator, Authy        │
│  └── Backup Codes                                            │
│      └── 10 single-use codes generated at enrollment        │
│                                                              │
│  Enrollment Flow:                                            │
│  1. User requests MFA enable -> QR code + secret returned   │
│  2. User scans QR in authenticator app                      │
│  3. User verifies with code -> MFA activated                │
│  4. Backup codes provided for emergency access              │
│                                                              │
│  Login Flow with MFA:                                        │
│  1. User provides email/password -> mfaToken returned       │
│  2. User provides TOTP code or backup code                  │
│  3. Verified -> full access token issued                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────┐
│                        RBAC Model                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Roles:                                                      │
│  ├── patient      (default for patient users)               │
│  ├── provider     (healthcare providers)                     │
│  ├── admin        (platform administrators)                  │
│  └── system       (internal service accounts)               │
│                                                              │
│  Permissions (examples):                                     │
│  ├── read:own_records     (patient reads their records)     │
│  ├── write:clinical_notes (provider writes notes)           │
│  ├── manage:users         (admin manages users)             │
│  └── access:all_patients  (admin/provider with consent)     │
│                                                              │
│  Enforcement:                                                │
│  ├── API Gateway: Role-based route access                   │
│  ├── Service Level: Permission-based resource access        │
│  └── Database: Row-level security where applicable          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Consequences

### Positive

1. **Stateless**: No server-side session storage needed; any service can verify tokens
2. **Scalable**: Works efficiently in distributed, multi-region deployments
3. **Performance**: Token verification is fast (signature check + expiration)
4. **Microservices Friendly**: Services can verify tokens without calling auth service
5. **Mobile Friendly**: Works well with mobile apps (vs session cookies)
6. **Audit Trail**: Token JTI enables comprehensive access logging
7. **Standards Based**: JWT is well-understood with broad tooling support

### Negative

1. **Token Size**: JWTs are larger than session IDs (~500 bytes vs ~32 bytes)
2. **Revocation Complexity**: Requires Redis check for immediate revocation
3. **Key Management**: RS256 keys must be securely distributed and rotated
4. **Clock Skew**: Token expiration depends on synchronized clocks

### Neutral

1. **Client Implementation**: Clients must handle token refresh logic
2. **Token Exposure**: Tokens in logs must be redacted

## Mitigations

1. **Token Size**: Minimize claims; use short claim names
2. **Revocation**: Redis lookup optimized with minimal latency
3. **Key Rotation**: Automated key rotation with overlap period
4. **Clock Skew**: 30-second tolerance in expiration validation

## References

- [Auth Service Implementation](../../services/auth-service/)
- [RFC 7519 - JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [OAuth 2.0 Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
- [HIPAA Security Rule - Access Control](https://www.hhs.gov/hipaa/for-professionals/security/)
