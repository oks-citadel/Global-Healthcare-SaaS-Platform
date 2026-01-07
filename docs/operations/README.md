# Operations Documentation

## Overview

This documentation covers the operational aspects of running the Unified Health Global Platform, including monitoring, logging, troubleshooting, incident response, and maintenance procedures.

## Operational Excellence Pillars

1. **Reliability** - System uptime and availability
2. **Performance** - Response times and throughput
3. **Security** - Data protection and compliance
4. **Cost Optimization** - Resource efficiency
5. **Operational Excellence** - Process automation and improvement

## Service Level Objectives (SLOs)

### Availability Targets

| Service | SLO | Measurement |
|---------|-----|-------------|
| **API Gateway** | 99.9% | Uptime per month (43m downtime allowed) |
| **Web Application** | 99.9% | Successful page loads |
| **Database** | 99.95% | Query success rate |
| **Video Consultations** | 99.5% | Call connection success |

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (p95)** | < 200ms | 95th percentile response time |
| **API Response Time (p99)** | < 500ms | 99th percentile response time |
| **Database Query Time (p95)** | < 50ms | Query execution time |
| **Page Load Time (p95)** | < 2 seconds | First contentful paint |
| **Video Call Setup** | < 5 seconds | Time to establish connection |

### Error Rate Targets

| Service | Target | Action Threshold |
|---------|--------|------------------|
| **API Errors** | < 0.1% | Alert if > 1% |
| **Failed Logins** | < 5% | Monitor for attacks |
| **Payment Failures** | < 2% | Investigate immediately |
| **Database Errors** | < 0.01% | Page on-call |

## Monitoring

### Key Metrics Dashboard

**System Health:**
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Pod/container status

**Application Metrics:**
- Request rate (requests/second)
- Response times (p50, p95, p99)
- Error rates (4xx, 5xx)
- Active connections
- Queue depth

**Business Metrics:**
- Active users
- Appointments booked
- Video calls in progress
- Payments processed
- User registrations

### Prometheus Queries

**API Response Time (p95):**
```promql
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)
```

**Error Rate:**
```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
* 100
```

**Database Connection Pool:**
```promql
pg_stat_database_numbackends{datname="unified_health"}
```

### Grafana Dashboards

**Available Dashboards:**
1. **API Overview** - Request rates, response times, errors
2. **Database Performance** - Query times, connections, replication lag
3. **System Resources** - CPU, memory, disk, network
4. **Business KPIs** - User activity, revenue, conversions
5. **Security** - Failed logins, suspicious activity

**Access:**
```
https://grafana.yourdomain.com
Username: admin (change after first login)
```

## Logging

### Log Aggregation

**ELK Stack (Elasticsearch, Logstash, Kibana):**
- Centralized logging for all services
- Structured JSON logs
- 30-day retention (90-day for audit logs)

**Access Kibana:**
```
https://kibana.yourdomain.com
```

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | Application errors | `logger.error('Payment failed', { orderId, error })` |
| **WARN** | Warning conditions | `logger.warn('High memory usage', { usage: 85 })` |
| **INFO** | Informational messages | `logger.info('User logged in', { userId })` |
| **DEBUG** | Debug information | `logger.debug('Processing request', { body })` |

### Structured Logging Format

```json
{
  "timestamp": "2025-12-17T10:30:00.000Z",
  "level": "info",
  "service": "api",
  "message": "User logged in",
  "userId": "usr_123",
  "ip": "192.168.1.1",
  "requestId": "req_abc123",
  "duration": 150
}
```

### Common Log Queries

**Failed Login Attempts:**
```
level:error AND message:"Login failed"
```

**Slow API Requests:**
```
duration:>1000 AND service:api
```

**Payment Errors:**
```
service:billing AND level:error
```

## Alerting

### Alert Channels

- **PagerDuty** - Critical alerts (on-call)
- **Slack** - Warning and info alerts (#ops-alerts)
- **Email** - Daily summaries and reports

### Alert Rules

#### Critical Alerts (Page Immediately)

**Service Down:**
```yaml
alert: ServiceDown
expr: up{job="api"} == 0
for: 1m
severity: critical
description: "API service is down"
```

**High Error Rate:**
```yaml
alert: HighErrorRate
expr: (sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) > 0.05
for: 5m
severity: critical
description: "Error rate > 5%"
```

**Database Connection Failures:**
```yaml
alert: DatabaseConnectionFailure
expr: pg_up == 0
for: 1m
severity: critical
description: "Cannot connect to database"
```

#### Warning Alerts (Investigate During Business Hours)

**High Memory Usage:**
```yaml
alert: HighMemoryUsage
expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) < 0.1
for: 10m
severity: warning
description: "Memory usage > 90%"
```

**Slow API Response:**
```yaml
alert: SlowAPIResponse
expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
for: 10m
severity: warning
description: "p95 response time > 500ms"
```

## Incident Response

### Incident Severity Levels

| Severity | Definition | Response Time | Example |
|----------|------------|---------------|---------|
| **P0 - Critical** | Complete service outage | Immediate | API down, database crash |
| **P1 - High** | Major functionality broken | 15 minutes | Payments failing, login broken |
| **P2 - Medium** | Partial functionality affected | 1 hour | Feature not working, slow performance |
| **P3 - Low** | Minor issues | Next business day | UI glitch, typo |

### Incident Response Process

**1. Detect**
- Automated monitoring alerts
- User reports
- Internal discovery

**2. Acknowledge**
- On-call engineer acknowledges alert
- Create incident in PagerDuty
- Notify team in Slack

**3. Investigate**
- Check dashboards and logs
- Review recent deployments
- Identify root cause

**4. Mitigate**
- Implement immediate fix
- Rollback if needed
- Communicate status updates

**5. Resolve**
- Verify fix is working
- Monitor for 30 minutes
- Close incident

**6. Post-Mortem**
- Document incident
- Identify root cause
- Create action items
- Share learnings

### Incident Communication

**Status Page:** https://status.thetheunifiedhealth.com

**Update Template:**
```
[INVESTIGATING] We are investigating reports of [issue].
[IDENTIFIED] We have identified the cause: [description]
[MONITORING] A fix has been deployed. We are monitoring.
[RESOLVED] The issue has been resolved. Service is normal.
```

## Maintenance Windows

### Scheduled Maintenance

**Timing:**
- Tuesdays, 2:00 AM - 4:00 AM UTC
- Low traffic period
- 7-day advance notice

**Procedure:**
1. Announce maintenance 7 days before
2. Deploy to staging first
3. Create database backup
4. Enable maintenance mode
5. Deploy updates
6. Run smoke tests
7. Disable maintenance mode
8. Monitor for 1 hour

### Emergency Maintenance

**Criteria:**
- Critical security vulnerability
- Data integrity issue
- System stability problem

**Procedure:**
1. Get approval from CTO
2. Notify via status page
3. Execute fix
4. Post-incident review

## Database Operations

### Backup Procedures

**Automated Backups:**
```bash
# Daily full backup at 2 AM
0 2 * * * /scripts/backup-postgres.sh

# Hourly WAL archiving
0 * * * * /scripts/archive-wal.sh
```

**Backup Verification:**
```bash
# Weekly restore test
0 3 * * 0 /scripts/test-restore.sh
```

**Backup Retention:**
- Daily backups: 30 days
- Weekly backups: 90 days
- Monthly backups: 1 year
- Audit logs: 7 years

### Database Maintenance

**Weekly Tasks:**
- Vacuum analyze
- Index maintenance
- Check for slow queries
- Review query plans

**Monthly Tasks:**
- Full vacuum (during maintenance window)
- Statistics update
- Storage cleanup
- Performance review

### Database Migrations

**Pre-Migration Checklist:**
- [ ] Migration tested in staging
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Maintenance window scheduled

**Migration Execution:**
```bash
# 1. Create backup
./scripts/backup-database.sh

# 2. Run migration
kubectl exec -it api-pod -- pnpm db:migrate

# 3. Verify migration
kubectl exec -it api-pod -- pnpm db:validate

# 4. Rollback if needed
kubectl exec -it api-pod -- pnpm db:rollback
```

## Security Operations

### Security Monitoring

**Real-time Alerts:**
- Failed login attempts (>10 per hour)
- Suspicious API usage patterns
- Unusual data access
- SQL injection attempts
- XSS attempts

**Security Scans:**
- Daily vulnerability scan (Snyk)
- Weekly dependency audit
- Monthly penetration test

### Security Incident Response

**Process:**
1. **Detect** - Security alert triggered
2. **Contain** - Isolate affected systems
3. **Investigate** - Analyze logs and impact
4. **Eradicate** - Remove threat
5. **Recover** - Restore normal operations
6. **Report** - Document and notify if required

### Access Management

**Principle of Least Privilege:**
- Production access requires approval
- Temporary elevated access (4 hours)
- All access logged and audited
- Regular access reviews

**Production Access:**
```bash
# Request temporary access
./scripts/request-prod-access.sh

# Access granted for 4 hours
# All actions logged
```

## Performance Optimization

### Database Optimization

**Query Optimization:**
```sql
-- Identify slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_appointments_patient_id
ON appointments(patient_id);
```

**Connection Pool Tuning:**
```
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
```

### API Optimization

**Caching Strategy:**
- Redis for frequently accessed data
- CDN for static assets
- Database query result caching

**Rate Limiting:**
```
- Free tier: 60 requests/minute
- Paid tier: 300 requests/minute
- Enterprise: Custom limits
```

## Cost Optimization

### Resource Right-Sizing

**Monthly Review:**
- Analyze resource usage
- Identify over-provisioned instances
- Adjust based on actual demand

**Auto-Scaling:**
- Scale down during off-peak hours
- Scale up during peak hours
- Set min/max limits

### Cost Monitoring

**Budget Alerts:**
- Alert at 80% of monthly budget
- Daily cost reports
- Resource tagging for cost allocation

## Disaster Recovery

### Backup Strategy

**RTO/RPO Targets:**
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 15 minutes

**Backup Locations:**
- Primary: Same region
- Secondary: Different region
- Tertiary: Different cloud provider

### DR Testing

**Quarterly DR Drill:**
1. Simulate disaster scenario
2. Execute recovery procedures
3. Verify data integrity
4. Document recovery time
5. Update DR plan if needed

### Failover Procedures

**Database Failover:**
```bash
# Promote replica to primary
pg_ctl promote -D /var/lib/postgresql/data

# Update connection strings
kubectl set env deployment/api DATABASE_URL=new-primary-url
```

**Application Failover:**
```bash
# Switch traffic to DR region
kubectl apply -f k8s/failover/ingress-dr.yaml

# Verify traffic routing
curl https://api.yourdomain.com/health
```

## Troubleshooting Guide

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed troubleshooting procedures.

## Runbooks

Common operational procedures:
- [Deploy New Version](./runbooks/deploy.md)
- [Scale Services](./runbooks/scale.md)
- [Rotate Secrets](./runbooks/rotate-secrets.md)
- [Database Failover](./runbooks/db-failover.md)
- [Incident Response](./runbooks/incident-response.md)

## On-Call Guide

### On-Call Rotation

- 1-week rotation
- Primary and secondary on-call
- Handoff meeting every Monday

### On-Call Responsibilities

- Respond to alerts within 15 minutes
- Investigate and resolve incidents
- Escalate if needed
- Document all actions
- Update runbooks

### Escalation Path

1. **L1:** On-call engineer
2. **L2:** Team lead
3. **L3:** Engineering manager
4. **L4:** CTO

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0
