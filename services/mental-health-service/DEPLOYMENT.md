# Mental Health Service - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- npm or yarn package manager
- Access to API Gateway (for authentication headers)

## Initial Setup

### 1. Install Dependencies
```bash
cd services/mental-health-service
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mental_health_db
PORT=3002
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Database Setup

#### Create Database
```bash
createdb mental_health_db
```

#### Run Migrations
```bash
npm run db:migrate:prod
```

This will create all necessary tables:
- TherapySession
- TreatmentPlan
- TreatmentGoal
- MentalHealthAssessment
- AssessmentResponse
- ProgressNote
- CrisisIntervention
- PsychMedication
- GroupSession
- GroupSessionAttendee
- SupportGroup
- SupportGroupMember
- MoodLog
- ConsentRecord

#### Generate Prisma Client
```bash
npm run db:generate
```

### 4. Build Application
```bash
npm run build
```

### 5. Start Service
```bash
npm start
```

For development:
```bash
npm run dev
```

## Health Check

Verify the service is running:
```bash
curl http://localhost:3002/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "mental-health-service",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

## Database Migrations

### Create a New Migration
```bash
npx prisma migrate dev --name descriptive_migration_name
```

### Apply Migrations in Production
```bash
npm run db:migrate:prod
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

## Testing the Service

### 1. Test Health Endpoint
```bash
curl http://localhost:3002/health
```

### 2. Test Assessment Questions (No Auth Required)
```bash
curl http://localhost:3002/assessments/instruments/PHQ9/questions
```

### 3. Test Protected Endpoint (With Auth Headers)
```bash
curl -X GET http://localhost:3002/sessions \
  -H "x-user-id: your-user-uuid" \
  -H "x-user-email: user@example.com" \
  -H "x-user-role: patient"
```

### 4. Create a Test Session
```bash
curl -X POST http://localhost:3002/sessions \
  -H "Content-Type: application/json" \
  -H "x-user-id: patient-uuid" \
  -H "x-user-email: patient@example.com" \
  -H "x-user-role: patient" \
  -d '{
    "therapistId": "therapist-uuid",
    "sessionType": "individual",
    "scheduledAt": "2024-02-01T14:00:00Z",
    "duration": 60,
    "modality": "CBT"
  }'
```

## Production Deployment

### Docker Deployment

1. Build Docker image:
```bash
docker build -t mental-health-service .
```

2. Run container:
```bash
docker run -d \
  -p 3002:3002 \
  -e DATABASE_URL="postgresql://user:password@db:5432/mental_health_db" \
  --name mental-health-service \
  mental-health-service
```

### Using Docker Compose

Ensure your `docker-compose.yml` includes:
```yaml
services:
  mental-health-service:
    build: ./services/mental-health-service
    ports:
      - "3002:3002"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/mental_health_db
      NODE_ENV: production
    depends_on:
      - postgres
```

### Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (if available).

## Monitoring & Logging

### Logs
The service logs to stdout. In production, configure log aggregation:
- CloudWatch (AWS)
- Stackdriver (GCP)
- Application Insights (Azure)
- ELK Stack
- Datadog

### Health Checks
Configure health check endpoint in your load balancer:
- Path: `/health`
- Expected Status: 200
- Interval: 30s

### Metrics to Monitor
- Response time by endpoint
- Error rates
- Database connection pool status
- Active crisis interventions count
- Assessment completion rates

## Security Considerations

### 1. Database Security
- Use SSL/TLS for database connections
- Implement connection pooling
- Regular backups
- Encrypt sensitive data at rest

### 2. API Security
- HTTPS only in production
- Rate limiting (especially for crisis endpoints)
- Request size limits
- CORS configuration

### 3. HIPAA Compliance
- Encrypt data in transit (TLS 1.2+)
- Encrypt data at rest
- Audit logging for all PHI access
- Automatic session timeout
- Strong authentication

### 4. 42 CFR Part 2 Compliance
- All consent records must be retained
- Audit all substance use record access
- Implement consent expiration checks
- Emergency consent limited to 72 hours

## Backup & Recovery

### Database Backups
```bash
# Backup
pg_dump -h localhost -U user mental_health_db > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U user mental_health_db < backup_20240115.sql
```

### Automated Backups
Configure automated daily backups:
- Full backup daily
- Retain backups for 30 days
- Test restore procedures monthly

## Troubleshooting

### Service Won't Start

1. Check database connection:
```bash
psql $DATABASE_URL
```

2. Check if port is available:
```bash
netstat -an | grep 3002
```

3. Verify environment variables:
```bash
node -e "console.log(process.env.DATABASE_URL)"
```

### Database Connection Errors

1. Verify database is running:
```bash
pg_isready -h localhost -p 5432
```

2. Check connection string format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

3. Check Prisma client:
```bash
npm run db:generate
```

### Migration Failures

1. Check migration status:
```bash
npx prisma migrate status
```

2. Resolve failed migrations:
```bash
npx prisma migrate resolve --rolled-back "migration_name"
```

## Performance Optimization

### Database Indexes
The schema includes indexes on:
- Patient IDs (all tables)
- Provider IDs
- Session dates
- Assessment dates
- Crisis severity and status

### Query Optimization
- Use Prisma's select to fetch only needed fields
- Implement pagination for large result sets
- Cache frequently accessed data (Redis)

### Connection Pooling
Configure Prisma connection pool:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=10"
```

## Maintenance

### Regular Tasks
- Weekly: Review error logs
- Monthly: Database optimization (VACUUM)
- Monthly: Review and archive old records
- Quarterly: Security audit
- Annually: HIPAA compliance review

### Updating Dependencies
```bash
npm audit
npm update
npm audit fix
```

### Database Maintenance
```bash
# Analyze database
psql -d mental_health_db -c "ANALYZE;"

# Vacuum database
psql -d mental_health_db -c "VACUUM ANALYZE;"
```

## Scaling

### Horizontal Scaling
- Service is stateless and can be scaled horizontally
- Use load balancer to distribute traffic
- Ensure database can handle increased connections

### Database Scaling
- Implement read replicas for reporting
- Consider partitioning large tables (sessions, assessments)
- Use connection pooling (PgBouncer)

## Support & Documentation

- API Documentation: See `API_ENDPOINTS.md`
- Feature Documentation: See `README.md`
- Schema Reference: Check `prisma/schema.prisma`
- Emergency Contacts: Built into crisis endpoints

## Compliance Checklist

Before going live:
- [ ] SSL/TLS certificates installed
- [ ] Database encrypted at rest
- [ ] Audit logging enabled
- [ ] Backup procedures tested
- [ ] HIPAA compliance reviewed
- [ ] 42 CFR Part 2 procedures documented
- [ ] Consent forms legally reviewed
- [ ] Privacy policy updated
- [ ] Staff training completed
- [ ] Incident response plan in place

## Emergency Procedures

### Service Outage
1. Check health endpoint
2. Review application logs
3. Check database connectivity
4. Verify API Gateway status
5. Contact on-call engineer

### Data Breach
1. Immediately isolate affected systems
2. Notify security team
3. Follow incident response plan
4. Comply with HIPAA breach notification (72 hours)
5. Document all actions taken

### Crisis Alert Failures
- Ensure crisis endpoints are priority in monitoring
- Implement fallback notification system
- Maintain emergency contact list
- Test crisis protocols monthly
