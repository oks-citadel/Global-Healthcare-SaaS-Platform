# Auth Service Deployment Guide

## Prerequisites

1. PostgreSQL 15+ database
2. Node.js 20+
3. Environment variables configured

## Local Development

### 1. Install Dependencies

```bash
cd services/auth-service
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5433/auth_db?schema=public
JWT_SECRET=your-secret-key-min-32-characters
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Verify database connection
npm run db:validate
```

### 4. Start Development Server

```bash
npm run dev
```

Service will be available at `http://localhost:3001`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start database and service
docker-compose up -d

# View logs
docker-compose logs -f auth-service

# Stop services
docker-compose down
```

### Using Dockerfile

```bash
# Build image
docker build -t auth-service:latest .

# Run container
docker run -d \
  -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  --name auth-service \
  auth-service:latest
```

## Production Deployment

### 1. Database Setup

Create a dedicated PostgreSQL database:

```sql
CREATE DATABASE auth_db;
CREATE USER auth_user WITH ENCRYPTED PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
```

### 2. Generate RSA Keys (RS256)

For enhanced security, use RS256 algorithm:

```bash
# Generate private key (2048-bit)
openssl genrsa -out private.key 2048

# Generate public key
openssl rsa -in private.key -pubout -out public.key

# Secure the private key
chmod 600 private.key
```

Store keys securely (Azure Key Vault, AWS Secrets Manager, etc.)

### 3. Environment Configuration

Production `.env`:

```env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://auth_user:password@db-host:5432/auth_db?schema=public&sslmode=require

# JWT - RS256 (Recommended)
JWT_PRIVATE_KEY_PATH=/secure/path/private.key
JWT_PUBLIC_KEY_PATH=/secure/path/public.key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
PASSWORD_RESET_EXPIRY_HOURS=1
EMAIL_VERIFICATION_EXPIRY_HOURS=24

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=warn
```

### 4. Run Migrations

```bash
npm run db:migrate:prod
```

### 5. Build and Start

```bash
# Build
npm run build

# Start
npm start
```

## Kubernetes Deployment

### 1. Create Secret

```bash
kubectl create secret generic auth-service-secrets \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=JWT_SECRET=... \
  --from-file=private.key=/path/to/private.key \
  --from-file=public.key=/path/to/public.key
```

### 2. Apply Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: your-registry/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-service-secrets
              key: DATABASE_URL
        - name: JWT_PRIVATE_KEY_PATH
          value: "/keys/private.key"
        - name: JWT_PUBLIC_KEY_PATH
          value: "/keys/public.key"
        volumeMounts:
        - name: jwt-keys
          mountPath: /keys
          readOnly: true
        livenessProbe:
          httpGet:
            path: /live
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 20
          periodSeconds: 5
      volumes:
      - name: jwt-keys
        secret:
          secretName: auth-service-secrets
          items:
          - key: private.key
            path: private.key
          - key: public.key
            path: public.key
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
```

Apply:

```bash
kubectl apply -f k8s/deployment.yaml
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -l app=auth-service

# Check logs
kubectl logs -l app=auth-service -f

# Test health endpoint
kubectl port-forward svc/auth-service 3001:3001
curl http://localhost:3001/health
```

## Health Checks

### Endpoints

- **Liveness**: `GET /live` - Always returns 200 if service is running
- **Readiness**: `GET /ready` - Returns 200 if service can accept traffic (DB connected)
- **Health**: `GET /health` - Detailed health info

### Health Response

```json
{
  "status": "healthy",
  "service": "auth-service",
  "version": "1.0.0",
  "timestamp": "2024-12-21T10:30:00Z",
  "database": "connected"
}
```

## Monitoring

### Metrics to Track

1. **Authentication Metrics**
   - Login success/failure rate
   - Registration rate
   - Token refresh rate
   - Average response time

2. **Security Metrics**
   - Failed login attempts
   - Account lockouts
   - Password reset requests
   - Suspicious activity

3. **System Metrics**
   - Request rate
   - Error rate
   - Database connection pool
   - Memory usage
   - CPU usage

### Logging

Logs are structured JSON in production:

```json
{
  "timestamp": "2024-12-21T10:30:00Z",
  "level": "info",
  "service": "auth-service",
  "message": "User logged in",
  "userId": "uuid",
  "ipAddress": "1.2.3.4"
}
```

## Database Maintenance

### Backups

```bash
# Backup database
pg_dump -h localhost -U auth_user -d auth_db > auth_db_backup.sql

# Restore
psql -h localhost -U auth_user -d auth_db < auth_db_backup.sql
```

### Cleanup Old Tokens

Run periodically to remove expired tokens:

```sql
-- Delete expired refresh tokens
DELETE FROM "RefreshToken" WHERE "expiresAt" < NOW();

-- Delete used password reset tokens older than 7 days
DELETE FROM "PasswordResetToken"
WHERE "isUsed" = true AND "createdAt" < NOW() - INTERVAL '7 days';

-- Delete used email verification tokens older than 7 days
DELETE FROM "EmailVerificationToken"
WHERE "isUsed" = true AND "createdAt" < NOW() - INTERVAL '7 days';
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npm run db:validate

# Check Prisma Client generation
npm run db:generate

# Reset database (DEV ONLY!)
npm run db:reset
```

### JWT Issues

If tokens are invalid:

1. Verify JWT_SECRET matches between auth-service and API gateway
2. For RS256, ensure public/private keys are correct
3. Check token expiration times
4. Verify algorithm matches (HS256 vs RS256)

### Performance Issues

1. Check database connection pool
2. Monitor slow queries
3. Review rate limiting settings
4. Check for locked accounts

## Security Checklist

- [ ] Strong JWT secret (min 32 characters) or RS256 keys
- [ ] Database credentials secured
- [ ] HTTPS enabled in production
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Account lockout configured
- [ ] Password requirements enforced
- [ ] Logging enabled (no sensitive data)
- [ ] Secrets stored in vault
- [ ] Database SSL enabled

## Migration from Monolith

See `INTEGRATION.md` for detailed migration steps.

## Support

For issues or questions:
- Check logs: `docker-compose logs -f auth-service`
- Review health: `curl http://localhost:3001/health`
- Database: `npm run db:studio`
