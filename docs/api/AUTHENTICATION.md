# Authentication Guide

## Overview

The Unified Health API uses JWT (JSON Web Tokens) for authentication and implements OAuth 2.0 and OpenID Connect (OIDC) for third-party integrations. This guide covers all authentication mechanisms supported by the platform.

## Authentication Methods

### 1. JWT Bearer Token Authentication

The primary authentication method for API access.

#### Registration

**Endpoint:** `POST /api/v1/auth/register`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "phoneNumber": "+1234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Login

**Endpoint:** `POST /api/v1/auth/login`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "usr_abc123",
      "email": "patient@example.com",
      "role": "patient"
    }
  }
}
```

#### Token Refresh

**Endpoint:** `POST /api/v1/auth/refresh`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Using Access Tokens

Include the access token in the Authorization header:

```bash
curl -X GET https://api.thetheunifiedhealth.com/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. API Key Authentication

For server-to-server integrations and machine-to-machine communication.

#### Generating API Keys

**Endpoint:** `POST /api/v1/api-keys`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/api-keys \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Integration",
    "scopes": ["read:patients", "write:appointments"],
    "expiresIn": 31536000
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "key_xyz789",
    "key": "<your-api-key>",
    "name": "Production Integration",
    "scopes": ["read:patients", "write:appointments"],
    "createdAt": "2025-12-17T10:00:00Z",
    "expiresAt": "2026-12-17T10:00:00Z"
  }
}
```

**Important:** Save the API key securely. It will only be shown once.

#### Using API Keys

Include the API key in the X-API-Key header:

```bash
curl -X GET https://api.thetheunifiedhealth.com/api/v1/patients \
  -H "X-API-Key: <your-api-key>"
```

### 3. OAuth 2.0 / OpenID Connect

For third-party applications and SSO integrations.

#### Authorization Code Flow

**Step 1: Authorization Request**

Redirect users to:
```
https://api.thetheunifiedhealth.com/oauth/authorize?
  response_type=code&
  client_id={client_id}&
  redirect_uri={redirect_uri}&
  scope=openid profile email&
  state={random_state}
```

**Step 2: Authorization Callback**

User is redirected back with authorization code:
```
https://yourapp.com/callback?code={authorization_code}&state={state}
```

**Step 3: Exchange Code for Tokens**

```bash
curl -X POST https://api.thetheunifiedhealth.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code={authorization_code}" \
  -d "client_id={client_id}" \
  -d "client_secret={client_secret}" \
  -d "redirect_uri={redirect_uri}"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}
```

#### Client Credentials Flow

For machine-to-machine communication:

```bash
curl -X POST https://api.thetheunifiedhealth.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id={client_id}" \
  -d "client_secret={client_secret}" \
  -d "scope=read:patients write:appointments"
```

## Multi-Factor Authentication (MFA)

### Enabling MFA

**Endpoint:** `POST /api/v1/auth/mfa/enable`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/mfa/enable \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "totp"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "backupCodes": [
      "ABC123-DEF456",
      "GHI789-JKL012"
    ]
  }
}
```

### Verifying MFA

**Endpoint:** `POST /api/v1/auth/mfa/verify`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/mfa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_abc123",
    "code": "123456"
  }'
```

### Login with MFA

When MFA is enabled, login requires a two-step process:

**Step 1: Initial Login**
```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "mfaToken": "mfa_temp_token_123",
    "methods": ["totp", "sms"]
  }
}
```

**Step 2: Verify MFA Code**
```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/mfa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "mfaToken": "mfa_temp_token_123",
    "code": "123456",
    "method": "totp"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

## Role-Based Access Control (RBAC)

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **patient** | Patient users | Access own health records, book appointments |
| **provider** | Healthcare providers | Access assigned patients, clinical documentation |
| **admin** | Platform administrators | Full system access, user management |
| **staff** | Administrative staff | Scheduling, billing, patient support |
| **lab_technician** | Laboratory staff | Lab orders, results entry |
| **pharmacist** | Pharmacy staff | Prescription fulfillment |
| **radiologist** | Imaging specialists | Imaging orders, interpretations |

### Permission Scopes

Scopes define granular permissions for API access:

#### Patient Scopes
- `read:patients` - Read patient records
- `write:patients` - Create/update patient records
- `delete:patients` - Delete patient records

#### Appointment Scopes
- `read:appointments` - View appointments
- `write:appointments` - Create/update appointments
- `delete:appointments` - Cancel appointments

#### Clinical Scopes
- `read:encounters` - View clinical encounters
- `write:encounters` - Document encounters
- `read:prescriptions` - View prescriptions
- `write:prescriptions` - Create prescriptions

#### Billing Scopes
- `read:billing` - View billing information
- `write:billing` - Process payments
- `refund:billing` - Issue refunds

### Checking Permissions

**Endpoint:** `GET /api/v1/auth/permissions`

```bash
curl -X GET https://api.thetheunifiedhealth.com/api/v1/auth/permissions \
  -H "Authorization: Bearer {access_token}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "provider",
    "permissions": [
      "read:patients",
      "write:patients",
      "read:appointments",
      "write:appointments",
      "read:encounters",
      "write:encounters",
      "read:prescriptions",
      "write:prescriptions"
    ]
  }
}
```

## Password Management

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)
- Cannot contain common passwords
- Cannot be the same as previous 5 passwords

### Password Reset

**Step 1: Request Reset**

**Endpoint:** `POST /api/v1/auth/password/reset-request`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

**Step 2: Reset Password**

**Endpoint:** `POST /api/v1/auth/password/reset`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "newPassword": "NewSecurePassword123!"
  }'
```

### Change Password

**Endpoint:** `PUT /api/v1/auth/password/change`

```bash
curl -X PUT https://api.thetheunifiedhealth.com/api/v1/auth/password/change \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword123!"
  }'
```

## Session Management

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/logout \
  -H "Authorization: Bearer {access_token}"
```

### Logout All Sessions

**Endpoint:** `POST /api/v1/auth/logout-all`

```bash
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/logout-all \
  -H "Authorization: Bearer {access_token}"
```

### Active Sessions

**Endpoint:** `GET /api/v1/auth/sessions`

```bash
curl -X GET https://api.thetheunifiedhealth.com/api/v1/auth/sessions \
  -H "Authorization: Bearer {access_token}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "sess_123",
        "device": "Chrome on Windows",
        "ipAddress": "192.168.1.1",
        "location": "New York, US",
        "lastActive": "2025-12-17T10:30:00Z",
        "isCurrent": true
      }
    ]
  }
}
```

## Token Security

### Token Structure

JWT tokens contain:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "usr_abc123",
    "email": "patient@example.com",
    "role": "patient",
    "iat": 1702819200,
    "exp": 1702822800
  }
}
```

### Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 1 hour |
| Refresh Token | 30 days |
| API Key | Custom (up to 1 year) |
| MFA Token | 5 minutes |
| Password Reset Token | 1 hour |

### Token Storage

**Recommended:**
- Web: HttpOnly cookies or secure localStorage
- Mobile: Secure device storage (Keychain/Keystore)
- Server: Environment variables or secret management

**Never:**
- Store in plain text
- Commit to version control
- Log tokens
- Include in URLs

## Security Best Practices

1. **Use HTTPS only** - Never send tokens over HTTP
2. **Implement token refresh** - Refresh tokens before expiration
3. **Validate tokens** - Verify signature and claims
4. **Handle token expiration** - Gracefully handle expired tokens
5. **Secure storage** - Use appropriate storage mechanisms
6. **Rotate secrets** - Regularly rotate API keys
7. **Enable MFA** - Require MFA for sensitive operations
8. **Monitor sessions** - Track and audit authentication events
9. **Implement rate limiting** - Protect against brute force attacks
10. **Use strong passwords** - Enforce password policies

## Troubleshooting

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `INVALID_CREDENTIALS` | Email or password incorrect | Verify credentials |
| `TOKEN_EXPIRED` | Access token has expired | Refresh the token |
| `INVALID_TOKEN` | Token is malformed or invalid | Re-authenticate |
| `MFA_REQUIRED` | MFA verification needed | Complete MFA flow |
| `INSUFFICIENT_PERMISSIONS` | Missing required permissions | Check role/scopes |
| `ACCOUNT_LOCKED` | Too many failed login attempts | Wait or contact support |

### Testing Authentication

Use the sandbox environment for testing:
```
https://api-sandbox.thetheunifiedhealth.com/api/v1
```

**Test Accounts:**
- Patient: `patient@test.com` / `TestPassword123!`
- Provider: `provider@test.com` / `TestPassword123!`
- Admin: `admin@test.com` / `TestPassword123!`

---

**Last Updated:** 2025-12-17
