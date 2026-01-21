# Incident Response Runbook
## Unified Health Platform

**Version:** 1.0
**Last Updated:** 2025-12-17
**Owner:** SRE Team
**On-Call:** oncall@thetheunifiedhealth.com

---

## Table of Contents

1. [Overview](#overview)
2. [Incident Severity Levels](#incident-severity-levels)
3. [Incident Response Process](#incident-response-process)
4. [Common Incident Scenarios](#common-incident-scenarios)
5. [Escalation Procedures](#escalation-procedures)
6. [Communication Templates](#communication-templates)
7. [Post-Incident Procedures](#post-incident-procedures)
8. [Tools and Access](#tools-and-access)

---

## Overview

This runbook provides standardized procedures for responding to incidents affecting the Unified Health Platform. All incidents must be handled according to HIPAA compliance requirements and patient safety considerations.

### Key Principles

- **Patient Safety First**: Healthcare operations take priority
- **HIPAA Compliance**: Maintain audit trails and protect PHI
- **Clear Communication**: Keep stakeholders informed
- **Blameless Culture**: Focus on resolution, not blame
- **Learn and Improve**: Every incident is a learning opportunity

---

## Incident Severity Levels

### Severity 0 (SEV0) - Critical

**Impact:** Complete service outage or critical data breach affecting patient care

**Response Time:** Immediate (< 5 minutes)

**Examples:**
- Complete platform outage
- PHI data breach or unauthorized access
- Payment system failure affecting all transactions
- Database corruption or data loss
- Critical security vulnerability being actively exploited

**Response Team:**
- Incident Commander
- On-Call SRE
- Engineering Lead
- Security Lead (for security incidents)
- Executive Sponsor
- Communications Lead

**Communication:**
- Immediate notification to executives
- Customer status page update within 15 minutes
- Updates every 30 minutes

### Severity 1 (SEV1) - High

**Impact:** Major feature unavailable or significant performance degradation

**Response Time:** < 15 minutes

**Examples:**
- Appointment booking system down
- Video consultation service unavailable
- Significant API latency (> 5s P95)
- Single region outage
- Authentication service degraded

**Response Team:**
- Incident Commander
- On-Call SRE
- Relevant Engineering Team

**Communication:**
- Notify engineering leadership
- Status page update within 30 minutes
- Updates every 1 hour

### Severity 2 (SEV2) - Medium

**Impact:** Non-critical feature unavailable or minor performance issues

**Response Time:** < 1 hour

**Examples:**
- Notification service delayed
- Search functionality degraded
- Non-critical API endpoints slow
- Single availability zone issues
- Elevated error rates (< 5%)

**Response Team:**
- On-Call SRE
- Relevant Engineering Team

**Communication:**
- Internal team notification
- Status page update if customer-facing
- Updates as needed

### Severity 3 (SEV3) - Low

**Impact:** Minor issues with workarounds available

**Response Time:** Next business day

**Examples:**
- UI cosmetic issues
- Non-critical logging errors
- Dashboard display issues
- Minor documentation problems

**Response Team:**
- Assigned engineer

**Communication:**
- Standard ticket workflow
- No status page update required

---

## Incident Response Process

### Phase 1: Detection and Alert (0-5 minutes)

#### 1.1 Alert Received

**Sources:**
- Azure Monitor alerts
- Application Insights
- Prometheus/Grafana alerts
- Customer reports
- Automated health checks

**Actions:**
```bash
# Acknowledge the alert
# Check alert details in monitoring dashboard
# Verify the issue is real (not false positive)

# Quick verification commands
curl https://api.thetheunifiedhealth.com/health
az monitor metrics list --resource <resource-id>
kubectl get pods -n unified-health
```

#### 1.2 Initial Assessment

**Questions to Answer:**
- What is the impact? (Users affected, features down)
- What is the scope? (Geographic, service-specific)
- Is patient care affected?
- Is PHI at risk?
- What is the appropriate severity level?

**Actions:**
- Determine severity level
- Open incident ticket
- Start incident timeline documentation

### Phase 2: Response and Mitigation (5-30 minutes)

#### 2.1 Assemble Response Team

**For SEV0/SEV1:**
```
# Create incident Slack channel
/incident create #incident-YYYYMMDD-001 "Brief description"

# Page on-call engineer
python scripts/page_oncall.py --severity SEV0 --message "Description"

# Notify stakeholders
python scripts/notify_incident.py --severity SEV0 --channels executive,engineering
```

#### 2.2 Establish Incident Command

**Incident Commander Responsibilities:**
- Lead the response effort
- Coordinate team members
- Make critical decisions
- Ensure communication flows
- Maintain incident timeline

**First Commands:**
```bash
# Check system health
kubectl get pods -n unified-health -o wide
kubectl top nodes
kubectl describe pod <pod-name> -n unified-health

# Check recent deployments
kubectl rollout history deployment/unified-health-api -n unified-health

# Check logs for errors
kubectl logs -f deployment/unified-health-api -n unified-health --tail=100
az monitor log-analytics query --workspace <workspace-id> --analytics-query "ApplicationLogs_CL | where Level == 'ERROR' | top 50 by TimeGenerated desc"

# Check metrics
az monitor metrics list --resource <resource-id> --metric "Percentage CPU"
```

#### 2.3 Implement Immediate Mitigation

**Common Mitigation Strategies:**

**1. Rollback Recent Deployment:**
```bash
# Check deployment history
kubectl rollout history deployment/unified-health-api -n unified-health

# Rollback to previous version
kubectl rollout undo deployment/unified-health-api -n unified-health

# Verify rollback
kubectl rollout status deployment/unified-health-api -n unified-health
```

**2. Scale Resources:**
```bash
# Scale up pods
kubectl scale deployment/unified-health-api --replicas=10 -n unified-health

# Scale Azure resources
az aks scale --name unified-health-cluster --resource-group unified-health-rg --node-count 5
```

**3. Restart Services:**
```bash
# Restart deployment
kubectl rollout restart deployment/unified-health-api -n unified-health

# Delete problematic pods (will auto-recreate)
kubectl delete pod <pod-name> -n unified-health
```

**4. Enable Circuit Breaker:**
```bash
# Update configuration to enable circuit breaker
kubectl patch configmap unified-health-config -n unified-health --patch '{"data":{"CIRCUIT_BREAKER_ENABLED":"true"}}'
```

**5. Failover to Secondary Region:**
```bash
# Update Azure Traffic Manager
az network traffic-manager endpoint update \
  --name primary-endpoint \
  --profile-name unified-health-tm \
  --resource-group unified-health-rg \
  --type azureEndpoints \
  --endpoint-status Disabled

az network traffic-manager endpoint update \
  --name secondary-endpoint \
  --profile-name unified-health-tm \
  --resource-group unified-health-rg \
  --type azureEndpoints \
  --endpoint-status Enabled
```

### Phase 3: Communication (Ongoing)

#### 3.1 Internal Communication

**Slack Incident Channel Updates:**
```
[00:00] INCIDENT OPENED - SEV1
Description: API latency exceeding 5s
Impact: All users experiencing slow response times
IC: @john.doe
Status: Investigating

[00:15] UPDATE
Root cause identified: Database connection pool exhausted
Action: Scaling database connections from 100 to 300
ETA: 5 minutes

[00:25] UPDATE
Mitigation applied. Monitoring recovery.
API latency: 5.2s -> 0.8s
Status: Monitoring
```

#### 3.2 External Communication

**Status Page Update Template:**
```
Title: [Service Name] - [Issue Description]

We are currently investigating reports of [issue description].
Users may experience [impact description].

Our team is actively working to resolve this issue.
We will provide an update within [timeframe].

Last Updated: [timestamp]
Status: Investigating | Identified | Monitoring | Resolved
```

**Customer Communication (if needed):**
```
Subject: Service Update - [Date/Time]

Dear Valued Customer,

We are writing to inform you about a service disruption that
occurred on [date] at [time].

Impact: [Description of what was affected]
Duration: [Start time] to [End time]
Root Cause: [Brief explanation]
Resolution: [What was done]

We sincerely apologize for any inconvenience this may have caused.
[If applicable: No patient data was compromised during this incident.]

If you have any questions, please contact support@thetheunifiedhealth.com.

Regards,
Unified Health Operations Team
```

### Phase 4: Resolution and Recovery (30 minutes - 4 hours)

#### 4.1 Verify Resolution

**Checklist:**
- [ ] All metrics returned to normal levels
- [ ] Error rates below threshold
- [ ] Latency within SLO targets
- [ ] All services responding to health checks
- [ ] No active alerts
- [ ] Customer reports indicate normal operation

**Verification Commands:**
```bash
# Check all pods healthy
kubectl get pods -n unified-health | grep -v Running

# Check metrics
curl https://api.thetheunifiedhealth.com/metrics | grep error_rate

# Check recent logs
kubectl logs deployment/unified-health-api -n unified-health --since=15m | grep ERROR

# Verify SLIs
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where TimeGenerated > ago(15m) | summarize ErrorCount=countif(Level=='ERROR'), TotalCount=count() | extend ErrorRate=ErrorCount*100.0/TotalCount"
```

#### 4.2 Monitor for Regression

**Monitoring Period:** 2x incident duration (minimum 1 hour)

**Dashboards to Watch:**
- System Health Dashboard
- API Performance Dashboard
- Business Metrics Dashboard

**Set up enhanced monitoring:**
```bash
# Temporarily increase alert sensitivity
az monitor metrics alert update \
  --name high-error-rate \
  --resource-group unified-health-rg \
  --evaluation-frequency 1m \
  --window-size 5m
```

#### 4.3 Close Incident

**Before Closing:**
- [ ] All systems verified healthy
- [ ] Monitoring period completed
- [ ] Timeline documented
- [ ] Initial incident report drafted
- [ ] Stakeholders notified of resolution

**Close Procedure:**
```
# Update incident ticket
Status: Resolved
Resolution: [Brief description]
Duration: [Start time] to [End time]
Impact: [User count, duration, services affected]

# Post final update
/incident update #incident-YYYYMMDD-001 "RESOLVED - All systems nominal"

# Schedule post-incident review
/calendar create "Post-Incident Review: [Incident Name]" +2days
```

---

## Common Incident Scenarios

### Scenario 1: High API Error Rate

**Symptoms:**
- Error rate > 5%
- 5xx status codes increasing
- Alert: "High API Error Rate"

**Investigation Steps:**

```bash
# 1. Check error distribution
kubectl logs deployment/unified-health-api -n unified-health --tail=500 | grep ERROR | awk '{print $5}' | sort | uniq -c

# 2. Check recent deployments
kubectl rollout history deployment/unified-health-api -n unified-health

# 3. Check database connectivity
kubectl exec -it deployment/unified-health-api -n unified-health -- nc -zv postgres-service 5432

# 4. Check external service health
curl -I https://external-service.com/health

# 5. Review Application Insights
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where Level == 'ERROR' | summarize count() by Message | top 10 by count_"
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Bad deployment | Rollback to previous version |
| Database connection pool exhausted | Increase pool size |
| External service down | Enable circuit breaker |
| Memory leak | Restart pods, investigate |
| Database deadlock | Identify and fix query |

### Scenario 2: High API Latency

**Symptoms:**
- P95 latency > 1s
- P99 latency > 3s
- Alert: "High API Response Time"

**Investigation Steps:**

```bash
# 1. Check pod resource usage
kubectl top pods -n unified-health

# 2. Check database query performance
kubectl exec -it postgres-0 -n unified-health -- psql -U unified_health -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC;"

# 3. Check for slow endpoints
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where TimeGenerated > ago(15m) | summarize avg(Duration) by Route | order by avg_Duration desc"

# 4. Check cache hit rate
curl https://api.thetheunifiedhealth.com/metrics | grep cache_hit

# 5. Check network latency
kubectl exec -it deployment/unified-health-api -n unified-health -- ping -c 5 postgres-service
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| High load | Scale up pods/nodes |
| Slow database queries | Add indexes, optimize queries |
| Low cache hit rate | Warm cache, increase cache size |
| N+1 query problem | Implement query batching |
| External service slow | Increase timeout, enable caching |

### Scenario 3: Database Connection Issues

**Symptoms:**
- Database connection errors
- Connection pool exhausted
- Alert: "Database Connection Errors"

**Investigation Steps:**

```bash
# 1. Check database status
kubectl get pods -n unified-health | grep postgres

# 2. Check connection pool metrics
curl https://api.thetheunifiedhealth.com/metrics | grep db_connection_pool

# 3. Check database logs
kubectl logs postgres-0 -n unified-health --tail=200

# 4. Check active connections
kubectl exec -it postgres-0 -n unified-health -- psql -U unified_health -c "SELECT count(*) FROM pg_stat_activity;"

# 5. Check for long-running queries
kubectl exec -it postgres-0 -n unified-health -- psql -U unified_health -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC LIMIT 10;"
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Connection pool too small | Increase pool size |
| Connection leak | Restart app, fix code |
| Database overloaded | Scale database, optimize queries |
| Long-running queries | Kill queries, optimize |
| Network issues | Check network connectivity |

### Scenario 4: Service Outage (Pod Crashes)

**Symptoms:**
- Pods in CrashLoopBackOff
- Service unavailable
- Alert: "Pod Restart Loop"

**Investigation Steps:**

```bash
# 1. Check pod status
kubectl get pods -n unified-health

# 2. Describe problematic pod
kubectl describe pod <pod-name> -n unified-health

# 3. Check logs from crashed container
kubectl logs <pod-name> -n unified-health --previous

# 4. Check events
kubectl get events -n unified-health --sort-by='.lastTimestamp'

# 5. Check resource limits
kubectl describe pod <pod-name> -n unified-health | grep -A 5 Limits
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| OOMKilled | Increase memory limits |
| Configuration error | Fix config, redeploy |
| Missing dependencies | Check external services |
| Health check failing | Adjust health check or fix app |
| Image pull error | Check image registry |

### Scenario 5: Authentication/Authorization Failures

**Symptoms:**
- Users cannot log in
- High rate of 401/403 errors
- Alert: "Authentication Failures"

**Investigation Steps:**

```bash
# 1. Check auth service logs
kubectl logs deployment/unified-health-api -n unified-health | grep -i auth

# 2. Check JWT validation
curl -X POST https://api.thetheunifiedhealth.com/api/v1/auth/verify \
  -H "Authorization: Bearer <token>"

# 3. Check Redis (session store)
kubectl exec -it redis-0 -n unified-health -- redis-cli ping

# 4. Check authentication metrics
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where Message contains 'auth' | summarize count() by Level"
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| JWT secret changed | Update secret, invalidate tokens |
| Redis down | Restart Redis, check persistence |
| Token expiration issue | Adjust token TTL |
| OAuth provider down | Enable fallback auth |
| Clock skew | Sync time across services |

### Scenario 6: Payment Processing Failures

**Symptoms:**
- Payment transactions failing
- High payment error rate
- Alert: "Payment Processing Failures"

**Investigation Steps:**

```bash
# 1. Check payment service logs
kubectl logs deployment/unified-health-api -n unified-health | grep -i payment

# 2. Check payment gateway connectivity
curl -I https://payment-gateway.com/health

# 3. Check payment error distribution
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where Component == 'payment' and Level == 'ERROR' | summarize count() by Message"

# 4. Check payment metrics
curl https://api.thetheunifiedhealth.com/metrics | grep payment_
```

**Critical Actions:**
- [ ] Verify no duplicate charges
- [ ] Check for failed transactions requiring refund
- [ ] Notify finance team
- [ ] Document all failed transactions for reconciliation

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Payment gateway down | Switch to backup gateway |
| API key expired | Update credentials |
| Rate limiting | Implement retry with backoff |
| Network timeout | Increase timeout, add retries |
| Validation errors | Fix validation logic |

---

## Escalation Procedures

### When to Escalate

**Escalate Immediately If:**
- SEV0 incident lasting > 30 minutes
- Patient safety at risk
- PHI data breach suspected
- Unable to mitigate within expected timeframe
- Multiple services affected
- Cross-team coordination needed

### Escalation Path

```
Level 1: On-Call SRE
  ↓ (15 min for SEV0, 30 min for SEV1)
Level 2: Engineering Lead + Senior SRE
  ↓ (30 min for SEV0, 1 hr for SEV1)
Level 3: VP Engineering + CTO
  ↓ (1 hr for SEV0, 2 hr for SEV1)
Level 4: CEO + Executive Team
```

### Escalation Contacts

| Role | Contact | Phone | Email |
|------|---------|-------|-------|
| On-Call SRE | PagerDuty | +1-555-0100 | oncall@thetheunifiedhealth.com |
| Engineering Lead | John Doe | +1-555-0101 | john.doe@thetheunifiedhealth.com |
| Senior SRE | Jane Smith | +1-555-0102 | jane.smith@theunifiedhealth.com |
| VP Engineering | Bob Johnson | +1-555-0103 | bob.johnson@theunifiedhealth.com |
| CTO | Alice Williams | +1-555-0104 | alice.williams@theunifiedhealth.com |
| Security Lead | Charlie Brown | +1-555-0105 | charlie.brown@theunifiedhealth.com |
| Compliance Officer | Diana Prince | +1-555-0106 | diana.prince@theunifiedhealth.com |

---

## Communication Templates

### Internal Incident Notification

```
INCIDENT ALERT - SEV[X]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Severity: SEV[X]
Status: [Investigating | Identified | Monitoring | Resolved]
Started: [YYYY-MM-DD HH:MM UTC]

IMPACT:
[Description of user impact]

SCOPE:
[Which services/regions affected]

INCIDENT COMMANDER: @[name]

CURRENT ACTIONS:
[What is being done]

NEXT UPDATE: [Timeframe]

Incident Channel: #incident-YYYYMMDD-###
War Room: [Meeting link if applicable]
```

### Status Page Update

```
[🔴 Major Outage | 🟡 Partial Outage | 🟢 Operational]

Service: [Service Name]
Status: [Investigating | Identified | Monitoring | Resolved]

We are currently experiencing [issue description].

Impact: [User-facing impact]

Current Status: [What we're doing]

Next Update: [Timeframe]

Timestamp: [YYYY-MM-DD HH:MM UTC]
```

### Executive Briefing

```
EXECUTIVE INCIDENT BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Incident: [Brief title]
Severity: SEV[X]
Duration: [HH:MM]
Status: [Current status]

BUSINESS IMPACT:
• Users Affected: [Number/Percentage]
• Revenue Impact: $[Amount] (estimated)
• Reputation Risk: [Low | Medium | High]
• Compliance Risk: [Low | Medium | High]

TECHNICAL SUMMARY:
[Non-technical explanation of what happened]

CURRENT STATUS:
[What is being done]

ESTIMATED RESOLUTION:
[Timeframe]

CUSTOMER COMMUNICATION:
[What has been communicated]

NEXT STEPS:
[What happens next]

Incident Commander: [Name]
```

---

## Post-Incident Procedures

### Immediate Post-Incident (Day 0)

**Within 24 Hours:**

1. **Document Incident Timeline**
   - Create detailed timeline with all actions taken
   - Include timestamps, decisions made, commands run
   - Document who did what

2. **Preliminary Report**
   - Brief summary of what happened
   - Impact assessment
   - Immediate remediation taken
   - Initial lessons learned

3. **Data Collection**
   ```bash
   # Export logs from incident period
   az monitor log-analytics query --workspace <workspace-id> \
     --analytics-query "ApplicationLogs_CL | where TimeGenerated between (datetime(start) .. datetime(end))" \
     --output json > incident-logs.json

   # Export metrics
   az monitor metrics list --resource <resource-id> \
     --start-time <start> --end-time <end> \
     --output json > incident-metrics.json

   # Export Kubernetes events
   kubectl get events -n unified-health \
     --sort-by='.lastTimestamp' > incident-k8s-events.txt
   ```

### Post-Incident Review Meeting (Day 1-3)

**Schedule Within 3 Business Days**

**Attendees:**
- Incident Commander
- All responders
- Engineering leads
- Product managers
- Relevant stakeholders

**Agenda:**

1. **Timeline Review** (10 min)
   - Walk through incident timeline
   - What happened, when, why

2. **Impact Assessment** (10 min)
   - Users affected
   - Duration
   - Revenue impact
   - Compliance implications

3. **Root Cause Analysis** (20 min)
   - What was the root cause?
   - Why did it happen?
   - Why didn't we catch it earlier?
   - Use 5 Whys technique

4. **What Went Well** (10 min)
   - Effective actions taken
   - Good decisions made
   - Positive team dynamics

5. **What Could Be Improved** (20 min)
   - Gaps in monitoring/alerting
   - Process improvements needed
   - Documentation gaps
   - Tool limitations

6. **Action Items** (10 min)
   - Specific, actionable improvements
   - Assign owners and due dates
   - Prioritize based on impact

**Blameless Culture:**
- Focus on systems and processes, not individuals
- Encourage honest discussion
- Assume good intent
- Learn from mistakes

### Post-Incident Report

**Template:**

```markdown
# Post-Incident Report: [Incident Title]

## Incident Summary

**Date:** YYYY-MM-DD
**Duration:** HH:MM
**Severity:** SEV[X]
**Status:** Resolved
**Incident Commander:** [Name]

## Executive Summary

[2-3 paragraph summary suitable for executives]

## Impact

- **Users Affected:** [Number/Percentage]
- **Duration:** [Total downtime]
- **Revenue Impact:** $[Amount]
- **Services Affected:** [List]
- **Data Integrity:** [Any data loss/corruption]
- **Compliance:** [Any compliance implications]

## Timeline

| Time (UTC) | Event | Action Taken |
|------------|-------|--------------|
| 10:00 | Alert triggered | On-call notified |
| 10:05 | Investigation started | Checked logs, metrics |
| 10:15 | Root cause identified | Database connection pool exhausted |
| 10:20 | Mitigation applied | Increased connection pool size |
| 10:30 | Service restored | Verified metrics normal |
| 11:30 | Incident closed | Monitoring completed |

## Root Cause

[Detailed explanation of what caused the incident]

### Contributing Factors

1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## Resolution

[What was done to resolve the incident]

## Detection

- **How Detected:** [Alert, customer report, etc.]
- **Time to Detect:** [Duration from start to detection]
- **Could We Detect Sooner?** [Yes/No and how]

## Response

- **Time to Response:** [Duration from detection to first action]
- **What Went Well:** [List positive aspects]
- **What Could Improve:** [List areas for improvement]

## Lessons Learned

### What Went Well

1. [Item 1]
2. [Item 2]
3. [Item 3]

### What Could Be Improved

1. [Item 1]
2. [Item 2]
3. [Item 3]

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| Implement better monitoring for X | @john | High | 2025-12-24 | Open |
| Add runbook for Y scenario | @jane | Medium | 2025-12-31 | Open |
| Increase connection pool default | @bob | High | 2025-12-20 | Done |

## Appendix

### Metrics During Incident

[Include graphs, charts of key metrics]

### Related Tickets

- [Ticket #123]
- [Ticket #456]

### References

- [Dashboard links]
- [Log queries]
- [External documentation]
```

### Follow-Up Actions

**Week 1:**
- [ ] Complete post-incident report
- [ ] Share report with stakeholders
- [ ] Begin implementing high-priority action items
- [ ] Update runbooks based on learnings

**Week 2-4:**
- [ ] Implement medium-priority action items
- [ ] Update monitoring/alerting
- [ ] Conduct knowledge-sharing session
- [ ] Update documentation

**Monthly:**
- [ ] Review action item completion
- [ ] Track metrics to verify improvements
- [ ] Share learnings in engineering all-hands

---

## Tools and Access

### Monitoring and Observability

| Tool | URL | Purpose |
|------|-----|---------|
| Azure Portal | https://portal.azure.com | Cloud infrastructure |
| Application Insights | https://portal.azure.com/#blade/Microsoft_Azure_Monitoring | APM and diagnostics |
| Grafana | https://grafana.thetheunifiedhealth.com | Dashboards and visualization |
| Prometheus | https://prometheus.theunifiedhealth.com | Metrics collection |
| Log Analytics | https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/logs | Log queries |

### Communication

| Tool | URL | Purpose |
|------|-----|---------|
| Slack | https://unifiedhealth.slack.com | Team communication |
| PagerDuty | https://unifiedhealth.pagerduty.com | On-call management |
| Status Page | https://status.theunifiedhealth.com | Customer communication |
| Zoom | https://zoom.us/my/unifiedhealth | War rooms |

### Development and Deployment

| Tool | URL | Purpose |
|------|-----|---------|
| GitHub | https://github.com/unifiedhealth | Source code |
| Azure DevOps | https://dev.azure.com/unifiedhealth | CI/CD |
| AKS Dashboard | `kubectl proxy` | Kubernetes management |
| kubectl | Command line | Kubernetes CLI |

### Documentation

| Resource | URL | Purpose |
|----------|-----|---------|
| Runbooks | https://wiki.thetheunifiedhealth.com/runbooks | Operational procedures |
| Architecture Docs | https://wiki.thetheunifiedhealth.com/architecture | System architecture |
| API Docs | https://api.thetheunifiedhealth.com/docs | API reference |
| SLO Dashboard | https://grafana.thetheunifiedhealth.com/d/slo | SLI/SLO tracking |

### Access Requirements

**Required Access:**
- Azure Portal (Contributor role)
- Azure Kubernetes Service (kubectl access)
- Application Insights (Reader role minimum)
- PagerDuty (Responder role)
- Slack (Member of #incidents channel)
- GitHub (Write access to repositories)

**Emergency Access:**
- Break-glass credentials: Stored in 1Password vault "Emergency Access"
- Database read-only access: Available via bastion host
- Production kubectl access: Requires approval + MFA

### Useful Commands Cheat Sheet

```bash
# Quick system health check
kubectl get pods -n unified-health
kubectl top nodes
az monitor metrics list --resource <resource-id> --metric "Percentage CPU"

# Check recent errors
kubectl logs deployment/unified-health-api -n unified-health --tail=100 | grep ERROR

# Scale application
kubectl scale deployment/unified-health-api --replicas=10 -n unified-health

# Rollback deployment
kubectl rollout undo deployment/unified-health-api -n unified-health

# Check pod resource usage
kubectl top pods -n unified-health

# Describe problematic pod
kubectl describe pod <pod-name> -n unified-health

# Check database connections
kubectl exec -it postgres-0 -n unified-health -- psql -U unified_health -c "SELECT count(*) FROM pg_stat_activity;"

# View Application Insights logs
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where Level == 'ERROR' | top 50 by TimeGenerated desc"

# Check alert rules
az monitor metrics alert list --resource-group unified-health-rg

# Check service endpoints
curl -I https://api.thetheunifiedhealth.com/health
```

---

## Appendix: Incident Response Checklist

### SEV0/SEV1 Incident Response Checklist

- [ ] Alert acknowledged
- [ ] Severity level determined
- [ ] Incident ticket created
- [ ] Incident Commander assigned
- [ ] Response team assembled
- [ ] Incident channel created (#incident-YYYYMMDD-###)
- [ ] Initial investigation started
- [ ] Executives notified (SEV0 only)
- [ ] Status page updated
- [ ] Timeline documentation started
- [ ] Root cause identified
- [ ] Mitigation plan created
- [ ] Mitigation implemented
- [ ] Service recovery verified
- [ ] Customer-facing communication sent
- [ ] Monitoring period completed
- [ ] Incident closed
- [ ] Post-incident review scheduled
- [ ] Preliminary report completed
- [ ] Detailed post-incident report completed
- [ ] Action items tracked
- [ ] Runbooks updated
- [ ] Monitoring improved
- [ ] Lessons shared with team

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | SRE Team | Initial version |

**Review Schedule:** Quarterly

**Next Review Date:** 2026-03-17

**Feedback:** For feedback or improvements to this runbook, please create a pull request or contact sre@thetheunifiedhealth.com
