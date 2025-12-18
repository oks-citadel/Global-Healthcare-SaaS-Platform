# Database Production Deployment Checklist

## Pre-Deployment (1 Week Before)

### Environment Setup
- [ ] PostgreSQL 13+ installed and configured
- [ ] Database credentials stored in secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Environment variables configured (.env.production)
- [ ] DATABASE_URL properly formatted and tested
- [ ] SSL/TLS certificates installed for database connections
- [ ] Firewall rules configured (allow only application servers)

### Schema Preparation
- [ ] Review Prisma schema (`prisma/schema.prisma`)
- [ ] Verify all indexes are optimized
- [ ] Test migrations in staging environment
- [ ] Document any custom migrations needed
- [ ] Review foreign key constraints
- [ ] Check for potential data conflicts

### Backup Infrastructure
- [ ] Backup storage location configured
- [ ] Backup retention policy set (default: 30 days)
- [ ] Automated backup cron jobs configured
- [ ] Test backup script execution
- [ ] Verify backup integrity checks
- [ ] Document restore procedures
- [ ] Set up offsite backup replication

### Security Hardening
- [ ] Database not publicly accessible
- [ ] Strong passwords set (min 16 characters)
- [ ] Default admin password configured (`ADMIN_DEFAULT_PASSWORD`)
- [ ] SSL/TLS enforced for connections
- [ ] IP whitelist configured
- [ ] Audit logging enabled
- [ ] Encryption at rest enabled
- [ ] Encryption in transit enabled

---

## Deployment Day

### Pre-Deployment Verification (2 hours before)
- [ ] All stakeholders notified
- [ ] Maintenance window scheduled
- [ ] Rollback plan reviewed and approved
- [ ] Team availability confirmed
- [ ] Monitoring systems active
- [ ] Communication channels open (Slack, Teams, etc.)

### Database Creation (1 hour before)
```bash
# 1. Create database
createdb -h <host> -U <user> healthcare_db

# 2. Verify connection
psql -h <host> -U <user> -d healthcare_db -c '\l'

# 3. Set environment variable
export DATABASE_URL="postgresql://user:pass@host:5432/healthcare_db"
```

- [ ] Database created successfully
- [ ] Connection verified
- [ ] Environment variables set

### Schema Deployment
```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Run migrations
npm run db:migrate:prod

# 3. Verify migration status
npx prisma migrate status
```

- [ ] Prisma client generated
- [ ] Migrations applied successfully
- [ ] No pending migrations
- [ ] Schema validated

### Production Seed Data
```bash
# 1. Set admin password
export ADMIN_DEFAULT_PASSWORD="YourSecurePassword123!"

# 2. Run production seed
npm run db:seed:prod

# 3. Verify seed data
npm run db:validate
```

- [ ] Admin password set securely
- [ ] Subscription plans created (6 plans)
- [ ] Health packages created (5 packages)
- [ ] Diagnostic tests created (5 tests)
- [ ] Admin user created successfully
- [ ] Seed data verified

### Post-Deployment Verification
```bash
# 1. Run health checks
npm run db:validate

# 2. Check table counts
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Plan\";"

# 3. Verify indexes
psql $DATABASE_URL -c "\di"

# 4. Check connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

- [ ] Health checks passed
- [ ] Expected table counts verified
- [ ] All indexes created
- [ ] Connection pool healthy
- [ ] No errors in logs

---

## Post-Deployment (Within 24 Hours)

### Security Actions
- [ ] Change default admin password (CRITICAL!)
- [ ] Enable MFA for admin account
- [ ] Create additional admin users if needed
- [ ] Review and restrict database user permissions
- [ ] Verify audit logging is working
- [ ] Test authentication flow

### Backup Verification
```bash
# 1. Create first production backup
npm run db:backup

# 2. Verify backup
ls -lh /var/backups/postgresql/

# 3. Test restore in separate environment (optional but recommended)
npm run db:restore /path/to/backup
```

- [ ] First backup created successfully
- [ ] Backup files accessible
- [ ] Backup integrity verified
- [ ] Restore procedure tested (staging)

### Monitoring Setup
- [ ] Database monitoring enabled (Datadog, New Relic, etc.)
- [ ] Alert thresholds configured:
  - [ ] Connection pool > 80%
  - [ ] Query duration > 5s
  - [ ] Disk space < 20%
  - [ ] Failed queries > 10/min
  - [ ] Replication lag > 5s (if applicable)
- [ ] Health check scheduled (hourly)
- [ ] Backup monitoring enabled
- [ ] Log aggregation configured

### Performance Baseline
```bash
# Collect baseline metrics
npm run db:validate

# Check slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

- [ ] Performance baseline documented
- [ ] Slow query monitoring enabled
- [ ] Cache hit ratio recorded
- [ ] Connection pool metrics recorded

### Application Integration
- [ ] Application successfully connects to database
- [ ] API health endpoint returns 200 OK
- [ ] User registration works
- [ ] User login works
- [ ] Critical API endpoints tested:
  - [ ] `POST /api/v1/auth/register`
  - [ ] `POST /api/v1/auth/login`
  - [ ] `GET /api/v1/users/me`
  - [ ] `POST /api/v1/appointments`
  - [ ] `GET /api/v1/subscriptions`

---

## Week 1 Post-Deployment

### Daily Checks
- [ ] Review database logs for errors
- [ ] Check backup completion
- [ ] Monitor query performance
- [ ] Review connection pool usage
- [ ] Check disk space usage

### Performance Tuning
- [ ] Review slow query log
- [ ] Optimize identified slow queries
- [ ] Adjust connection pool settings if needed
- [ ] Update table statistics: `ANALYZE;`
- [ ] Review and adjust PostgreSQL configuration

### Security Audit
- [ ] Review access logs
- [ ] Verify no unauthorized access attempts
- [ ] Check for SQL injection attempts
- [ ] Review user permissions
- [ ] Verify encryption settings

### Data Quality
- [ ] Verify no orphaned records
- [ ] Check foreign key integrity
- [ ] Review data consistency
- [ ] Monitor data growth rate
- [ ] Verify backup coverage

---

## Ongoing Maintenance Schedule

### Daily
- [ ] Automated backup execution and verification
- [ ] Health check monitoring
- [ ] Review error logs
- [ ] Monitor disk space

### Weekly
- [ ] Review slow queries
- [ ] Backup restore test (staging)
- [ ] Review database growth trends
- [ ] Update table statistics
- [ ] Security log review

### Monthly
- [ ] Full disaster recovery drill
- [ ] Performance tuning review
- [ ] Index usage analysis
- [ ] Vacuum and analyze all tables
- [ ] Security audit
- [ ] Backup retention cleanup

### Quarterly
- [ ] Comprehensive security review
- [ ] Disaster recovery plan update
- [ ] Capacity planning review
- [ ] Documentation update
- [ ] Team training/knowledge transfer

---

## Rollback Procedures

### If Issues Detected During Deployment

1. **Stop deployment immediately**
2. **Assess severity:**
   - Critical: Data corruption, security breach
   - High: Significant errors, failed migrations
   - Medium: Performance issues, warnings

3. **Rollback steps:**
```bash
# 1. Mark migration as rolled back
npx prisma migrate resolve --rolled-back <migration_name>

# 2. Restore from pre-deployment backup
npm run db:restore /path/to/pre-deployment-backup

# 3. Verify restore
npm run db:validate

# 4. Test application
curl http://localhost:3000/health
```

4. **Document incident:**
   - What went wrong
   - Actions taken
   - Lessons learned
   - Updated deployment plan

### Emergency Contacts
- **Database Administrator:** [Name] - [Phone] - [Email]
- **DevOps Lead:** [Name] - [Phone] - [Email]
- **CTO/Tech Lead:** [Name] - [Phone] - [Email]
- **On-Call Engineer:** [PagerDuty/Slack]

---

## Success Criteria

Deployment is considered successful when:

- [ ] All migrations applied without errors
- [ ] Health checks passing
- [ ] Application connects successfully
- [ ] No critical errors in logs
- [ ] Performance metrics within acceptable range
- [ ] Backups configured and tested
- [ ] Monitoring and alerts active
- [ ] Security measures verified
- [ ] Admin can log in and change password
- [ ] Team sign-off received

---

## Documentation

Ensure these documents are accessible:

- [ ] `DATABASE_PRODUCTION_GUIDE.md` - Comprehensive production guide
- [ ] `DATABASE_MIGRATION_RUNBOOK.md` - Detailed migration procedures
- [ ] `schema.prisma` - Current database schema
- [ ] Environment configuration documented
- [ ] Access credentials documented (in secure vault)
- [ ] Monitoring dashboard URLs documented
- [ ] Escalation procedures documented

---

## Sign-off

### Pre-Deployment Approval
- [ ] Database Administrator: _________________ Date: _______
- [ ] DevOps Lead: _________________ Date: _______
- [ ] CTO/Tech Lead: _________________ Date: _______

### Post-Deployment Verification
- [ ] Database Administrator: _________________ Date: _______
- [ ] Application Team Lead: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______

---

## Notes

Use this section to document any deployment-specific notes, issues encountered, or deviations from the standard procedure.

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Next Review:** [Schedule quarterly review]
