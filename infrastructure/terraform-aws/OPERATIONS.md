# AWS Infrastructure Operations

## Service Level Indicators (SLIs)

### Availability

| Metric | Measurement | Source |
|--------|-------------|--------|
| API Availability | % of successful health check responses | Route 53 health checks |
| EKS Control Plane | % of API server uptime | CloudWatch EKS metrics |
| Database Availability | % of successful connections | Aurora CloudWatch metrics |
| Cache Availability | % of successful Redis operations | ElastiCache CloudWatch |

### Latency

| Metric | Measurement | Source |
|--------|-------------|--------|
| API Response Time | p50, p95, p99 latency | ALB target response time |
| Database Query Time | Average query duration | Aurora Performance Insights |
| Cache Hit Latency | Average GET/SET latency | ElastiCache CloudWatch |
| DNS Resolution | Time to resolve | Route 53 latency metrics |

### Error Rate

| Metric | Measurement | Source |
|--------|-------------|--------|
| HTTP Error Rate | % of 5xx responses | ALB request count metrics |
| Application Errors | Count of ERROR/FATAL logs | CloudWatch Log metric filters |
| Database Errors | Connection failures, query errors | Aurora CloudWatch metrics |
| Message Processing Failures | DLQ message count | SQS CloudWatch metrics |

## Service Level Objectives (SLOs)

| Objective | Target | Measurement Window |
|-----------|--------|-------------------|
| **Availability** | 99.9% uptime | Rolling 30 days |
| **API Latency** | <200ms p99 | Rolling 1 hour |
| **Error Rate** | <0.1% 5xx | Rolling 1 hour |
| **Database Latency** | <50ms p99 | Rolling 1 hour |
| **Cache Hit Ratio** | >95% | Rolling 1 hour |
| **Message Processing** | <5 min age | Per queue |

### SLO Burn Rate Alerts

| Alert Severity | Burn Rate | Window | Action |
|----------------|-----------|--------|--------|
| Critical | 14.4x | 1 hour | Page on-call |
| High | 6x | 6 hours | Page during business hours |
| Medium | 3x | 1 day | Slack notification |
| Low | 1x | 3 days | Ticket creation |

## CloudWatch Alarms

### EKS Cluster Alarms

| Alarm | Threshold | Period | Action |
|-------|-----------|--------|--------|
| Node CPU High | >80% avg | 5 min, 3 periods | SNS -> PagerDuty |
| Node Memory High | >85% avg | 5 min, 3 periods | SNS -> PagerDuty |
| Pod Restart Count | >5 restarts | 15 min | SNS -> Slack |
| Failed Node Count | >0 | 5 min | SNS -> PagerDuty |

### Aurora Database Alarms

| Alarm | Threshold | Period | Action |
|-------|-----------|--------|--------|
| CPU Utilization | >80% avg | 5 min, 3 periods | SNS -> PagerDuty |
| Free Storage | <10 GB | 5 min, 3 periods | SNS -> PagerDuty |
| Connection Count | >80% of max | 5 min | SNS -> Slack |
| Replication Lag | >30 seconds | 5 min | SNS -> PagerDuty |

### ElastiCache Alarms

| Alarm | Threshold | Period | Action |
|-------|-----------|--------|--------|
| CPU Utilization | >80% avg | 5 min, 3 periods | SNS -> PagerDuty |
| Memory Usage | >85% | 5 min, 3 periods | SNS -> PagerDuty |
| Evictions | >1000/min | 5 min | SNS -> Slack |
| Cache Hit Ratio | <90% | 15 min | SNS -> Slack |

### SQS Queue Alarms

| Alarm | Threshold | Period | Action |
|-------|-----------|--------|--------|
| DLQ Messages | >0 | 5 min | SNS -> PagerDuty |
| Message Age | >1 hour (varies by queue) | 5 min | SNS -> Slack |
| Queue Depth | >10000 | 5 min | SNS -> Slack |

### SES Email Alarms

| Alarm | Threshold | Period | Action |
|-------|-----------|--------|--------|
| Bounce Rate | >5% | 5 min | SNS -> PagerDuty |
| Complaint Rate | >0.1% | 5 min | SNS -> PagerDuty |

## On-Call Procedures

### Escalation Path

```
Level 1 (0-15 min)    -> Primary On-Call Engineer
Level 2 (15-30 min)   -> Secondary On-Call Engineer
Level 3 (30-60 min)   -> Engineering Lead
Level 4 (60+ min)     -> VP Engineering + Incident Commander
```

### On-Call Responsibilities

1. **Acknowledge alerts** within 5 minutes
2. **Assess severity** using runbook criteria
3. **Mitigate impact** using documented procedures
4. **Communicate status** via incident Slack channel
5. **Escalate** if resolution exceeds 15 minutes
6. **Document** all actions in incident log

### Incident Severity Levels

| Level | Criteria | Response Time | Communication |
|-------|----------|---------------|---------------|
| SEV1 | Complete service outage | 5 min | All hands, status page |
| SEV2 | Major feature unavailable | 15 min | Team leads, status page |
| SEV3 | Degraded performance | 30 min | Team channel |
| SEV4 | Minor issue, workaround exists | 4 hours | Ticket |

### Communication Templates

**Initial Response (Slack)**:
```
INCIDENT: [Brief description]
SEVERITY: SEV[1-4]
IMPACT: [User-facing impact]
STATUS: Investigating
OWNER: [Your name]
NEXT UPDATE: [Time]
```

**Status Page Update**:
```
We are currently investigating [issue description].
Some users may experience [impact].
We will provide an update within [time].
```

## Runbook References

### High CPU - EKS Nodes

1. Check pod resource requests/limits: `kubectl top pods -A`
2. Identify resource-heavy pods: `kubectl describe nodes`
3. Scale deployment if needed: `kubectl scale deployment/<name> --replicas=N`
4. Consider node group scaling via AWS Console or Terraform

### High CPU - Aurora Database

1. Check Performance Insights in AWS Console
2. Identify slow queries:
   ```sql
   SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
   ```
3. Consider read replica promotion for read-heavy workloads
4. Review and optimize problematic queries

### DLQ Messages Appearing

1. Check DLQ in SQS Console for message content
2. Identify failure pattern from message attributes
3. Review CloudWatch Logs for processing errors
4. Fix underlying issue and redrive messages:
   ```bash
   aws sqs start-message-move-task \
     --source-arn <dlq-arn> \
     --destination-arn <main-queue-arn>
   ```

### Redis Memory High

1. Check key distribution: `redis-cli --bigkeys`
2. Review TTL settings on frequently used keys
3. Consider eviction policy adjustment
4. Scale up node type if necessary (requires maintenance window)

### SES Bounce Rate High

1. Review bounce notifications in SQS bounce queue
2. Identify patterns (hard vs soft bounces)
3. Remove invalid addresses from mailing lists
4. Contact AWS Support if deliverability issue persists

## Monitoring Dashboards

### Primary Dashboard: unified-health-{env}-overview

Widgets:
- Error count by service
- Security events (auth failures, suspicious activity)
- PHI access count
- API latency percentiles
- Alarm status panel
- Recent errors log query

### Database Dashboard

Access via RDS Console -> Performance Insights:
- Top SQL queries
- Wait events
- Database load
- Counter metrics

### Container Dashboard

Deploy via CloudWatch Container Insights:
- Pod CPU/memory utilization
- Network I/O
- Storage utilization
- Container restarts

## Useful CloudWatch Insights Queries

### Error Analysis
```
fields @timestamp, @message, @logStream
| filter @message like /(?i)error|exception|fail/
| stats count(*) as error_count by bin(5m)
| sort @timestamp desc
```

### Authentication Failures
```
fields @timestamp, @message
| filter @message like /(?i)authentication failed|login failed|unauthorized/
| stats count(*) as failure_count by bin(5m)
| sort @timestamp desc
```

### PHI Access Audit
```
fields @timestamp, @message
| parse @message /user:(?<user>\S+)/
| parse @message /patient:(?<patient>\S+)/
| parse @message /action:(?<action>\S+)/
| stats count(*) as access_count by user, action
| sort access_count desc
```

### Slow API Requests
```
fields @timestamp, @message
| parse @message /duration:(?<duration>\d+)/
| filter duration > 1000
| stats count(*) as slow_count, avg(duration) as avg_duration by bin(5m)
| sort @timestamp desc
```

## Maintenance Windows

| Service | Window | Frequency | Auto-applied |
|---------|--------|-----------|--------------|
| EKS Control Plane | AWS-managed | As needed | Yes |
| Aurora | Sun 03:00-05:00 UTC | Weekly | No |
| ElastiCache | Sun 05:00-06:00 UTC | As needed | Yes |
| EKS Node Groups | Rolling update | On apply | N/A |

### Planned Maintenance Process

1. Announce maintenance 72 hours in advance
2. Create change request ticket
3. Update status page with maintenance window
4. Execute during low-traffic period
5. Validate service health post-maintenance
6. Close change request with outcome

## Contact Information

| Role | Contact | Escalation Path |
|------|---------|-----------------|
| On-Call Primary | PagerDuty rotation | ops@unifiedhealth.com |
| On-Call Secondary | PagerDuty rotation | ops@unifiedhealth.com |
| Engineering Lead | Direct contact | engineering-leads@unifiedhealth.com |
| AWS Support | AWS Console | Business/Enterprise support |
