# Authentication Service

Standalone microservice for user authentication, registration, and token management extracted from the monolith.

## Features

- User registration with email verification
- Login with JWT access/refresh tokens
- Token refresh with rotation (security best practice)
- Password reset flow
- Email verification
- Account lockout after failed login attempts
- Rate limiting on auth endpoints
- RS256 JWT signing (recommended for production)
- Refresh token family tracking (detects token reuse)

## Technology Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The service will start on `http://localhost:3001`

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| POST | `/auth/verify-email` | Verify email with token |
| POST | `/auth/resend-verification` | Resend verification email |

### Protected Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/logout` | Logout user (requires auth) |
| GET | `/auth/me` | Get current user (requires auth) |

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with DB status |
| GET | `/ready` | Readiness probe |
| GET | `/live` | Liveness probe |

## Security Features

### 1. Password Requirements

- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 2. Account Lockout

- Locks account after 5 failed login attempts (configurable)
- Lockout duration: 15 minutes (configurable)

### 3. Rate Limiting

- General: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour

### 4. Token Security

- **Access tokens**: Short-lived (15 minutes)
- **Refresh tokens**: Long-lived (30 days)
- **Token rotation**: New refresh token on each refresh
- **Token family tracking**: Detects and revokes stolen tokens
- **RS256 signing**: Asymmetric signing for production

## Production Deployment

### Generate RSA Keys for RS256

```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate public key
openssl rsa -in private.key -pubout -out public.key
```

Update `.env`:

```env
JWT_PRIVATE_KEY_PATH=/path/to/private.key
JWT_PUBLIC_KEY_PATH=/path/to/public.key
```

### Docker Build

```bash
docker build -t auth-service .
docker run -p 3001:3001 --env-file .env auth-service
```

### Environment Variables

See `.env.example` for all configuration options.

## Database Schema

### User

- `id`: UUID primary key
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `firstName`, `lastName`: User name
- `role`: patient | provider | admin
- `status`: active | inactive | pending | suspended
- `emailVerified`: Boolean
- `failedLoginAttempts`: Counter
- `lockedUntil`: Lockout timestamp

### RefreshToken

- Token rotation support
- Token family tracking
- Revocation flag
- IP address and user agent tracking

### PasswordResetToken

- One-time use tokens
- Expiration (1 hour)
- Linked to user

### EmailVerificationToken

- One-time use tokens
- Expiration (24 hours)
- Linked to user

## Integration with API Gateway

The API Gateway should route `/api/auth/*` to this service:

```typescript
// API Gateway configuration
{
  name: 'auth-service',
  url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  routes: ['/auth/*']
}
```

## Development

```bash
# Run in development mode with watch
npm run dev

# Build
npm run build

# Run production build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Database
npm run db:migrate      # Run migrations
npm run db:generate     # Generate Prisma client
npm run db:studio       # Open Prisma Studio
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Migration from Monolith

This service was extracted from `services/api` following the strangler pattern:

1. **Extracted code**:
   - `controllers/auth.controller.ts`
   - `services/auth.service.ts`
   - `dtos/auth.dto.ts`
   - `middleware/auth.middleware.ts`

2. **Enhanced features**:
   - Token rotation for refresh tokens
   - Token family tracking
   - Account lockout
   - Stricter rate limiting
   - RS256 JWT support

3. **Database migration**:
   - User and RefreshToken tables moved to separate DB
   - Added PasswordResetToken and EmailVerificationToken tables

## Port Assignment

- **Port**: 3001 (as per monolith extraction plan)
- Configured in `.env` via `PORT` variable

## Monitoring

Health check endpoint provides:
- Service status
- Database connection status
- Timestamp
- Version

```bash
curl http://localhost:3001/health
```

## License

Proprietary - World Unified Healthcare Platform
