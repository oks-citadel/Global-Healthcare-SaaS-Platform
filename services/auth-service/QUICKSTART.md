# Auth Service - Quick Start

Get the authentication service running in 5 minutes.

## Option 1: Docker Compose (Recommended)

```bash
# Navigate to auth-service directory
cd services/auth-service

# Start database and service
docker-compose up -d

# View logs
docker-compose logs -f auth-service

# Test health endpoint
curl http://localhost:3001/health
```

Done! Service is running at `http://localhost:3001`

## Option 2: Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Update DATABASE_URL in .env
# Example: postgresql://user:pass@localhost:5432/auth_db

# 4. Generate Prisma Client
npm run db:generate

# 5. Run migrations
npm run db:migrate

# 6. Start development server
npm run dev
```

Service is running at `http://localhost:3001`

## Test the Service

### Register a new user

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### Get current user (use access token)

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh token

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Available Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/me` - Get current user (requires auth)
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email
- `POST /auth/resend-verification` - Resend verification

## Environment Variables

Minimum required in `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db
JWT_SECRET=your-secret-key-min-32-characters-long
```

See `.env.example` for all options.

## Database UI

Open Prisma Studio to view/edit database:

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

## Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=3002
```

### Database connection failed
```bash
# Test database connection
npm run db:validate

# Reset database (WARNING: Deletes all data)
npm run db:reset
```

### Can't generate Prisma Client
```bash
# Make sure you're in auth-service directory
cd services/auth-service

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Read `README.md` for detailed documentation
2. See `INTEGRATION.md` for API Gateway setup
3. Review `DEPLOYMENT.md` for production deployment
4. Check `EXTRACTION_SUMMARY.md` for full feature list

## Stop Services

```bash
# Docker Compose
docker-compose down

# Local (Ctrl+C in terminal)
```

## Clean Up

```bash
# Remove database volumes (Docker)
docker-compose down -v

# Remove node_modules
rm -rf node_modules
```
