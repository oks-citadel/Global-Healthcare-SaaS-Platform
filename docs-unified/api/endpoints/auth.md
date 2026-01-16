# Authentication Endpoints

Authentication endpoints for user registration, login, and token management.

## Base Path

All authentication endpoints are prefixed with `/api/v1/auth`

## Endpoints

### Register User

Create a new user account.

```http
POST /api/v1/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "role": "patient"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 12 characters) |
| firstName | string | Yes | First name (max 100 characters) |
| lastName | string | Yes | Last name (max 100 characters) |
| phone | string | No | Phone number |
| dateOfBirth | string | No | Date of birth (ISO 8601 format) |
| role | string | No | User role: `patient`, `provider`, `admin` (default: `patient`) |

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "createdAt": "2024-12-17T12:00:00.000Z",
    "updatedAt": "2024-12-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `422 Unprocessable Entity` - Validation error
- `409 Conflict` - Email already registered

---

### Login

Authenticate and receive access tokens.

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password |

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "createdAt": "2024-12-17T12:00:00.000Z",
    "updatedAt": "2024-12-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid credentials
- `422 Unprocessable Entity` - Validation error

---

### Get Current User

Get the currently authenticated user's information.

```http
GET /api/v1/auth/me
```

**Authentication:** Required (Bearer token)

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "patient",
  "organizationId": "org-id-123",
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired token

---

### Refresh Token

Obtain a new access token using a refresh token.

```http
POST /api/v1/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Valid refresh token |

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or expired refresh token

---

### Logout

Invalidate the current session.

```http
POST /api/v1/auth/logout
```

**Authentication:** Required (Bearer token)

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired token

---

### Get Roles

Get all available user roles (Admin only).

```http
GET /api/v1/roles
```

**Authentication:** Required (Bearer token)

**Authorization:** Admin only

**Response (200 OK):**

```json
{
  "roles": [
    {
      "id": "role-1",
      "name": "patient",
      "description": "Patient user with limited access",
      "permissions": ["read:own-profile", "read:own-appointments"]
    },
    {
      "id": "role-2",
      "name": "provider",
      "description": "Healthcare provider with clinical access",
      "permissions": ["read:patients", "write:encounters", "read:appointments"]
    },
    {
      "id": "role-3",
      "name": "admin",
      "description": "System administrator with full access",
      "permissions": ["*"]
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired token
- `403 Forbidden` - Insufficient permissions

---

## SDK Usage Examples

### TypeScript SDK

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
});

// Register
const authResponse = await client.register({
  email: 'newuser@example.com',
  password: 'SecurePassword123!',
  firstName: 'Jane',
  lastName: 'Smith',
  role: 'patient',
});

console.log('User registered:', authResponse.user);

// Login
const loginResponse = await client.login({
  email: 'newuser@example.com',
  password: 'SecurePassword123!',
});

console.log('Logged in, access token:', loginResponse.accessToken);

// Get current user
const currentUser = await client.getCurrentUser();
console.log('Current user:', currentUser);

// Logout
await client.logout();
console.log('Logged out successfully');
```

### JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:4000/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'SecurePassword123!',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'patient',
  }),
});

const registerData = await registerResponse.json();
const accessToken = registerData.accessToken;

// Get current user with token
const userResponse = await fetch('http://localhost:4000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const user = await userResponse.json();
console.log('Current user:', user);
```

---

## Security Considerations

### Password Requirements

- Minimum 12 characters
- Should contain a mix of:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Token Management

- **Access Tokens**: Short-lived (1 hour), used for API requests
- **Refresh Tokens**: Long-lived (30 days), used to obtain new access tokens
- Store tokens securely (e.g., httpOnly cookies, secure storage)
- Never expose tokens in URLs or logs

### Best Practices

1. Always use HTTPS in production
2. Implement proper token refresh logic
3. Handle token expiration gracefully
4. Logout on sensitive actions
5. Implement rate limiting on authentication endpoints
6. Use strong password policies
7. Consider implementing MFA (Multi-Factor Authentication)

---

## Rate Limiting

Authentication endpoints have stricter rate limits:

- **Register/Login**: 5 requests per minute per IP
- **Other endpoints**: 20 requests per minute per IP

---

## Related Documentation

- [User Endpoints](./users.md)
- [Patient Endpoints](./patients.md)
- [Getting Started Guide](../getting-started.md)
