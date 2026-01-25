# Environment Variables Inventory

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **Classification:** Internal Use Only
>
> **WARNING:** This document contains variable names only. Never commit actual values to version control.

## Quick Reference

| Platform | Configuration Location | Encryption |
|----------|----------------------|------------|
| Vercel | Dashboard → Project → Settings → Environment Variables | At rest |
| Railway | Dashboard → Service → Variables | At rest |
| GitHub | N/A - No secrets in code | N/A |

---

## Vercel Environment Variables

### Web Application (`apps/web`)

#### Production Environment

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public | Yes | API base URL (`https://api.yourdomain.com`) |
| `NEXT_PUBLIC_WEBSOCKET_URL` | Public | Yes | WebSocket URL (`wss://ws.yourdomain.com`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | No | Stripe publishable key for payments |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | No | Sentry DSN for error tracking |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Public | No | Google Analytics tracking ID |
| `NEXT_PUBLIC_ENABLE_TELEHEALTH` | Public | No | Feature flag: telehealth (`true`/`false`) |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | Public | No | Feature flag: payments (`true`/`false`) |
| `API_SECRET_KEY` | Secret | No | Server-side API key |
| `SESSION_SECRET` | Secret | No | Session encryption secret (32+ chars) |

#### Preview Environment

| Variable | Value (Template) |
|----------|------------------|
| `NEXT_PUBLIC_API_URL` | `https://api-staging.yourdomain.com` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | `wss://ws-staging.yourdomain.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | `false` |

### Admin Dashboard (`apps/admin`)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public | Yes | API base URL |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | No | Sentry DSN |
| `API_SECRET_KEY` | Secret | No | Admin API key |
| `SESSION_SECRET` | Secret | No | Session secret |

### Provider Portal (`apps/provider-portal`)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public | Yes | API base URL |
| `NEXT_PUBLIC_WEBSOCKET_URL` | Public | Yes | WebSocket for real-time |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | No | Sentry DSN |

---

## Railway Environment Variables

### Shared Variables (Project Level)

These variables are available to all services via Railway's variable references.

| Variable | Reference | Description |
|----------|-----------|-------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-populated PostgreSQL connection |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Auto-populated Redis connection |
| `REDIS_HOST` | `${{Redis.REDIS_HOST}}` | Redis hostname |
| `REDIS_PORT` | `${{Redis.REDIS_PORT}}` | Redis port |
| `REDIS_PASSWORD` | `${{Redis.REDIS_PASSWORD}}` | Redis password |

### API Gateway (`services/api-gateway`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment (`production`/`staging`) |
| `PORT` | Yes | `3000` | Service port |
| `LOG_LEVEL` | No | `info` | Logging level |
| `JWT_SECRET` | Yes | - | JWT signing secret (32+ chars) |
| `CORS_ORIGINS` | Yes | - | Comma-separated allowed origins |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | No | `10` | Auth endpoint limit |
| `REDIS_HOST` | Yes | - | Redis host for rate limiting |
| `REDIS_PORT` | Yes | `6379` | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `API_SERVICE_URL` | Yes | - | Core API internal URL |
| `AUTH_SERVICE_URL` | Yes | - | Auth service internal URL |
| `NOTIFICATION_SERVICE_URL` | Yes | - | Notification service URL |
| `TELEHEALTH_SERVICE_URL` | Yes | - | Telehealth service URL |
| `PHARMACY_SERVICE_URL` | Yes | - | Pharmacy service URL |
| `LABORATORY_SERVICE_URL` | Yes | - | Laboratory service URL |
| `IMAGING_SERVICE_URL` | Yes | - | Imaging service URL |
| `MENTAL_HEALTH_SERVICE_URL` | Yes | - | Mental health service URL |
| `CHRONIC_CARE_SERVICE_URL` | Yes | - | Chronic care service URL |
| `CLINICAL_TRIALS_SERVICE_URL` | Yes | - | Clinical trials service URL |
| `DENIAL_MANAGEMENT_SERVICE_URL` | Yes | - | Denial management URL |
| `HOME_HEALTH_SERVICE_URL` | Yes | - | Home health service URL |
| `POPULATION_HEALTH_SERVICE_URL` | Yes | - | Population health URL |
| `PRICE_TRANSPARENCY_SERVICE_URL` | Yes | - | Price transparency URL |
| `VENDOR_RISK_SERVICE_URL` | Yes | - | Vendor risk service URL |
| `INTEROPERABILITY_SERVICE_URL` | Yes | - | FHIR/HL7 service URL |
| `SENTRY_DSN` | No | - | Sentry error tracking |

### Core API (`services/api`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment |
| `PORT` | Yes | `8080` | Service port |
| `API_VERSION` | No | `1.0.0` | API version |
| `LOG_LEVEL` | No | `info` | Logging level |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `DB_CONNECTION_LIMIT` | No | `10` | Max DB connections |
| `DB_POOL_TIMEOUT` | No | `10` | Pool timeout (seconds) |
| `DB_QUERY_TIMEOUT` | No | `30000` | Query timeout (ms) |
| `JWT_SECRET` | Yes | - | JWT secret (must match gateway) |
| `JWT_EXPIRY` | No | `1h` | Access token expiry |
| `REFRESH_TOKEN_EXPIRY` | No | `7d` | Refresh token expiry |
| `ENCRYPTION_KEY` | Yes | - | AES-256 key (64 hex chars) |
| `FIELD_ENCRYPTION_KEY` | Yes | - | PII field encryption key |
| `REDIS_HOST` | Yes | - | Redis host |
| `REDIS_PORT` | Yes | `6379` | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `CORS_ORIGINS` | Yes | - | Allowed CORS origins |
| `RATE_LIMIT_MAX` | No | `100` | Rate limit |
| `AWS_REGION` | Yes | `us-east-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | Yes | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | - | AWS secret key |
| `AWS_S3_BUCKET` | Yes | - | S3 bucket for documents |
| `STRIPE_SECRET_KEY` | No | - | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | - | Stripe webhook secret |
| `SMTP_HOST` | No | - | Email SMTP host |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASSWORD` | No | - | SMTP password |
| `SMTP_FROM` | No | - | From email address |
| `FIREBASE_PROJECT_ID` | No | - | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | No | - | Firebase client email |
| `FIREBASE_PRIVATE_KEY` | No | - | Firebase private key |
| `VAPID_PUBLIC_KEY` | No | - | Web push public key |
| `VAPID_PRIVATE_KEY` | No | - | Web push private key |
| `SENTRY_DSN` | No | - | Sentry DSN |

### Auth Service (`services/auth-service`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment |
| `PORT` | Yes | `3001` | Service port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection |
| `JWT_SECRET` | Yes | - | JWT secret |
| `JWT_EXPIRES_IN` | No | `15m` | Token expiry |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh expiry |
| `BCRYPT_ROUNDS` | No | `12` | Password hashing rounds |
| `MAX_LOGIN_ATTEMPTS` | No | `5` | Before lockout |
| `LOCKOUT_DURATION_MINUTES` | No | `15` | Lockout duration |
| `MFA_ISSUER` | No | `YourApp` | MFA issuer name |
| `MFA_ENCRYPTION_KEY` | Yes | - | MFA secret encryption |
| `OAUTH_CALLBACK_BASE_URL` | No | - | OAuth callback base |
| `GOOGLE_CLIENT_ID` | No | - | Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | No | - | Google OAuth secret |
| `FACEBOOK_APP_ID` | No | - | Facebook app ID |
| `FACEBOOK_APP_SECRET` | No | - | Facebook secret |
| `APPLE_CLIENT_ID` | No | - | Apple Sign-in ID |
| `APPLE_TEAM_ID` | No | - | Apple team ID |
| `APPLE_KEY_ID` | No | - | Apple key ID |
| `APPLE_PRIVATE_KEY` | No | - | Apple private key |
| `MICROSOFT_CLIENT_ID` | No | - | Microsoft OAuth ID |
| `MICROSOFT_CLIENT_SECRET` | No | - | Microsoft secret |
| `REDIS_HOST` | Yes | - | Redis for sessions |
| `REDIS_PORT` | Yes | - | Redis port |

### Notification Service (`services/notification-service`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment |
| `PORT` | Yes | `3002` | Service port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection |
| `REDIS_HOST` | Yes | - | Redis for job queue |
| `REDIS_PORT` | Yes | - | Redis port |
| `AWS_REGION` | Yes | - | AWS region for SES |
| `AWS_ACCESS_KEY_ID` | Yes | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | - | AWS secret key |
| `TWILIO_ACCOUNT_SID` | No | - | Twilio for SMS |
| `TWILIO_AUTH_TOKEN` | No | - | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | No | - | Twilio phone number |
| `FIREBASE_PROJECT_ID` | No | - | Firebase for push |
| `FIREBASE_CLIENT_EMAIL` | No | - | Firebase email |
| `FIREBASE_PRIVATE_KEY` | No | - | Firebase key |

### Telehealth Service (`services/telehealth-service`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment |
| `PORT` | Yes | `3003` | Service port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection |
| `JWT_SECRET` | Yes | - | JWT secret |
| `REDIS_HOST` | Yes | - | Redis for sessions |
| `REDIS_PORT` | Yes | - | Redis port |
| `WEBRTC_ICE_SERVERS` | No | - | ICE server config |

### Other Services (Common Variables)

Each microservice requires at minimum:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Environment (`production`/`staging`) |
| `PORT` | Yes | Service port (see port allocation) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT secret for auth validation |
| `LOG_LEVEL` | No | Logging level (`debug`/`info`/`warn`/`error`) |

---

## Service Port Allocation

| Service | Port |
|---------|------|
| API Gateway | 3000 |
| Auth Service | 3001 |
| Notification Service | 3002 |
| Telehealth Service | 3003 |
| Pharmacy Service | 3004 |
| Laboratory Service | 3005 |
| Imaging Service | 3006 |
| Mental Health Service | 3007 |
| Chronic Care Service | 3008 |
| Clinical Trials Service | 3009 |
| Denial Management Service | 3010 |
| Home Health Service | 3011 |
| Population Health Service | 3012 |
| Vendor Risk Service | 3013 |
| Price Transparency Service | 3014 |
| Interoperability Service | 3015 |
| Core API | 8080 |

---

## Railway Internal URLs

Railway services communicate over private network. Use these patterns:

```bash
# Internal service URL pattern
http://<service-name>.railway.internal:<port>

# Examples
API_SERVICE_URL=http://api.railway.internal:8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
NOTIFICATION_SERVICE_URL=http://notification-service.railway.internal:3002
```

---

## Environment Variable Templates

### Production API Gateway (.env.template)

```bash
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Authentication
JWT_SECRET=

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com,https://provider.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=10

# Redis (Railway auto-populates)
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# Service URLs (Railway internal networking)
API_SERVICE_URL=http://api.railway.internal:8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
NOTIFICATION_SERVICE_URL=http://notification-service.railway.internal:3002
TELEHEALTH_SERVICE_URL=http://telehealth-service.railway.internal:3003
PHARMACY_SERVICE_URL=http://pharmacy-service.railway.internal:3004
LABORATORY_SERVICE_URL=http://laboratory-service.railway.internal:3005
IMAGING_SERVICE_URL=http://imaging-service.railway.internal:3006
MENTAL_HEALTH_SERVICE_URL=http://mental-health-service.railway.internal:3007
CHRONIC_CARE_SERVICE_URL=http://chronic-care-service.railway.internal:3008
CLINICAL_TRIALS_SERVICE_URL=http://clinical-trials-service.railway.internal:3009
DENIAL_MANAGEMENT_SERVICE_URL=http://denial-management-service.railway.internal:3010
HOME_HEALTH_SERVICE_URL=http://home-health-service.railway.internal:3011
POPULATION_HEALTH_SERVICE_URL=http://population-health-service.railway.internal:3012
VENDOR_RISK_SERVICE_URL=http://vendor-risk-service.railway.internal:3013
PRICE_TRANSPARENCY_SERVICE_URL=http://price-transparency-service.railway.internal:3014
INTEROPERABILITY_SERVICE_URL=http://interoperability-service.railway.internal:3015

# Monitoring (optional)
SENTRY_DSN=
```

### Production Core API (.env.template)

```bash
# Server
NODE_ENV=production
PORT=8080
API_VERSION=1.0.0
LOG_LEVEL=info

# Database (Railway auto-populates)
DATABASE_URL=
DB_CONNECTION_LIMIT=20
DB_POOL_TIMEOUT=10

# Authentication
JWT_SECRET=
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=
FIELD_ENCRYPTION_KEY=

# Redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Stripe (if using payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# Push Notifications
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Monitoring
SENTRY_DSN=
```

---

## Migration Checklist

### From AWS to Railway

| AWS Variable | Railway Variable | Notes |
|--------------|------------------|-------|
| `RDS_HOSTNAME` | `${{Postgres.PGHOST}}` | Auto-populated |
| `RDS_DB_NAME` | `${{Postgres.PGDATABASE}}` | Auto-populated |
| `RDS_USERNAME` | `${{Postgres.PGUSER}}` | Auto-populated |
| `RDS_PASSWORD` | `${{Postgres.PGPASSWORD}}` | Auto-populated |
| `ELASTICACHE_ENDPOINT` | `${{Redis.REDIS_HOST}}` | Auto-populated |
| `AWS_SECRETS_*` | Manual in Dashboard | Copy values |

### Variable Migration Steps

1. **Export current values:**
   ```bash
   # From AWS Parameter Store or Secrets Manager
   aws ssm get-parameters-by-path --path /prod/ --with-decryption
   ```

2. **Import to Railway:**
   - Go to Railway Dashboard
   - Select service
   - Click "Variables"
   - Add each variable

3. **Import to Vercel:**
   - Go to Vercel Dashboard
   - Select project
   - Go to Settings → Environment Variables
   - Add each variable
   - Select appropriate environment (Production/Preview/Development)

4. **Verify:**
   ```bash
   # Railway
   railway variables

   # Vercel
   vercel env ls
   ```

---

## Security Notes

1. **Never commit secrets to Git**
   - Use `.env.example` files with placeholder values
   - Add `.env*` to `.gitignore`

2. **Rotate secrets regularly**
   - JWT_SECRET: Quarterly
   - API keys: Annually
   - Database passwords: On personnel change

3. **Use strong secrets**
   ```bash
   # Generate secure secrets
   openssl rand -hex 32  # For JWT, encryption keys
   openssl rand -base64 32  # For API keys
   ```

4. **Audit access**
   - Review who has access to Vercel/Railway dashboards
   - Use SSO where available
   - Enable 2FA on all accounts
