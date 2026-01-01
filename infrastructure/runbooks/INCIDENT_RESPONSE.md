# Incident Response Runbook

**Document Version:** 1.0
**Last Updated:** 2025-12
**Owner:** Platform Operations Team
**Classification:** Internal - Restricted

---

## Table of Contents

1. [Overview](#overview)
2. [Severity Levels](#severity-levels)
3. [Incident Detection](#incident-detection)
4. [Response Procedures](#response-procedures)
5. [Communication Templates](#communication-templates)
6. [Post-Incident Review](#post-incident-review)

---

## Overview

### Purpose

This runbook provides step-by-step procedures for responding to incidents affecting the UnifiedHealth Platform. The goal is to minimize patient impact, restore services quickly, and prevent recurrence.

### Scope

This runbook covers:
- Production environment incidents
- Security incidents
- Data incidents (corruption, loss)
- Third-party service outages affecting our platform

### Key Principles

1. **Patient Safety First**: Healthcare decisions may depend on our platform
2. **Clear Communication**: Keep stakeholders informed throughout
3. **Systematic Response**: Follow procedures, don't improvise under pressure
4. **Document Everything**: Actions taken, decisions made, timeline

---

## Severity Levels

### SEV-1: Critical

**Criteria:**
- Complete service outage (all users affected)
- Data breach or security compromise
- Patient safety at risk
- Core functionality unavailable (login, appointments, video calls)

**Response Time:** Immediate (< 5 minutes)
**Target Resolution:** < 1 hour
**Communication Cadence:** Every 15 minutes

### SEV-2: High

**Criteria:**
- Partial service outage (subset of users affected)
- Significant performance degradation (> 2x normal latency)
- Single region unavailable
- Payment processing failures

**Response Time:** < 15 minutes
**Target Resolution:** < 4 hours
**Communication Cadence:** Every 30 minutes

### SEV-3: Medium

**Criteria:**
- Minor feature unavailable
- Intermittent errors (< 1% of requests)
- Non-critical service degradation
- Third-party integration issues

**Response Time:** < 1 hour
**Target Resolution:** < 24 hours
**Communication Cadence:** Every 2 hours

### SEV-4: Low

**Criteria:**
- Cosmetic issues
- Minor bugs affecting few users
- Non-urgent maintenance needed

**Response Time:** Next business day
**Target Resolution:** < 1 week
**Communication Cadence:** Daily summary

---

## Incident Detection

### Monitoring Sources

| Source | What It Detects | Alert Channel |
|--------|-----------------|---------------|
| **Azure Monitor** | Infrastructure health, metrics | PagerDuty |
| **Prometheus** | Application metrics, SLOs | PagerDuty, Slack |
| **Grafana Alerts** | Dashboard-based alerts | Slack |
| **Health Probes** | Service availability | PagerDuty |
| **Log Analytics** | Error patterns, anomalies | Slack |
| **User Reports** | User-facing issues | Support tickets |

### Key Metrics to Watch

```
┌─────────────────────────────────────────────────────────────┐
│                    Critical Metrics                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Availability:                                               │
│  ├── API health check success rate     Target: > 99.9%      │
│  └── Video call connection rate        Target: > 99%        │
│                                                              │
│  Performance:                                                │
│  ├── API response time (p95)           Target: < 200ms      │
│  ├── API response time (p99)           Target: < 500ms      │
│  └── Database query time (p95)         Target: < 50ms       │
│                                                              │
│  Errors:                                                     │
│  ├── HTTP 5xx error rate               Target: < 0.1%       │
│  └── Failed authentication rate        Target: < 1%         │
│                                                              │
│  Capacity:                                                   │
│  ├── CPU utilization                   Alert: > 80%         │
│  ├── Memory utilization                Alert: > 85%         │
│  ├── Database connections              Alert: > 80% pool    │
│  └── Disk usage                        Alert: > 75%         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Response Procedures

### Step 1: Acknowledge and Assess (5 minutes)

1. **Acknowledge the Alert**
   ```bash
   # In PagerDuty: Click "Acknowledge"
   # In Slack: React with :eyes: emoji
   ```

2. **Join the Incident Channel**
   - Create incident channel: `#incident-YYYY-MM-DD-brief-description`
   - Or use existing: `#incidents`

3. **Initial Assessment**
   ```bash
   # Check service health
   kubectl get pods -n unified-health
   kubectl top pods -n unified-health

   # Check recent deployments
   kubectl rollout history deployment -n unified-health

   # Check error rates
   # Open Grafana: https://grafana.unifiedhealth.io
   ```

4. **Assign Severity Level**
   - Based on criteria above
   - Escalate if uncertain

### Step 2: Communicate (Ongoing)

1. **Internal Communication**
   ```
   [INCIDENT DECLARED] SEV-X: Brief Description

   Incident Commander: @username
   Status: Investigating
   Impact: Description of user impact
   ETA: Assessing

   Updates will be posted every X minutes.
   ```

2. **Status Page Update** (SEV-1, SEV-2)
   - Log into https://status.unifiedhealth.io
   - Create incident with appropriate components
   - Set status: Investigating

3. **Stakeholder Notification** (SEV-1)
   - Page VP Engineering
   - Notify Customer Success team
   - Alert Support team leads

### Step 3: Diagnose (15-30 minutes)

1. **Check Recent Changes**
   ```bash
   # Recent deployments
   kubectl rollout history deployment/unified-health-api -n unified-health

   # Recent config changes
   kubectl get configmap -n unified-health -o yaml

   # Git commits in last 24h
   git log --oneline --since="24 hours ago"
   ```

2. **Check Dependencies**
   ```bash
   # Database connectivity
   kubectl exec -it -n unified-health deploy/unified-health-api -- \
     npx prisma db execute --stdin <<< "SELECT 1"

   # Redis connectivity
   kubectl exec -it -n unified-health redis-master-0 -- redis-cli ping

   # External service status
   curl -s https://status.stripe.com/api/v2/status.json
   curl -s https://status.twilio.com/api/v2/status.json
   ```

3. **Check Logs**
   ```bash
   # Application logs
   kubectl logs -n unified-health -l app=unified-health-api --since=30m | grep -i error

   # Container crash logs
   kubectl describe pod -n unified-health -l app=unified-health-api | grep -A 5 "Last State"
   ```

4. **Check Metrics**
   - Open Grafana dashboards
   - Look for anomalies in:
     - Request rate
     - Error rate
     - Latency
     - Resource utilization

### Step 4: Mitigate (varies)

#### If Recent Deployment Caused Issue

```bash
# Rollback to previous version
kubectl rollout undo deployment/unified-health-api -n unified-health

# Verify rollback
kubectl rollout status deployment/unified-health-api -n unified-health

# Confirm health
curl https://api.unifiedhealth.io/health
```

#### If Feature Flag Caused Issue

```bash
# Disable problematic feature
kubectl exec -it -n unified-health redis-master-0 -- redis-cli
SET feature:problematic_feature false
```

#### If Database Issue

```bash
# Check connection pool
kubectl exec -it -n unified-health deploy/unified-health-api -- \
  npx prisma db execute --stdin <<< "SELECT count(*) FROM pg_stat_activity;"

# Kill long-running queries (if needed, with caution)
kubectl exec -it -n unified-health deploy/unified-health-api -- \
  npx prisma db execute --stdin <<< "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';"
```

#### If Capacity Issue

```bash
# Scale up pods
kubectl scale deployment/unified-health-api -n unified-health --replicas=6

# Scale up nodes (if needed)
az aks scale --resource-group unified-health-rg --name unified-health-aks --node-count 5
```

#### If Third-Party Service Down

1. Check if failover/fallback exists
2. Enable graceful degradation mode
3. Communicate expected impact to users

### Step 5: Verify Resolution

1. **Check Health Endpoints**
   ```bash
   curl -s https://api.unifiedhealth.io/health | jq
   curl -s https://api.unifiedhealth.io/ready | jq
   ```

2. **Check Error Rates**
   - Verify error rate dropping in Grafana
   - Check logs for new errors

3. **Test Critical Flows**
   ```bash
   # Run smoke tests
   cd tests/smoke && npm run test:production
   ```

4. **Monitor for 15 Minutes**
   - Watch dashboards
   - No new alerts should trigger

### Step 6: Close Incident

1. **Update Status Page**
   - Set status: Resolved
   - Add resolution details

2. **Notify Stakeholders**
   ```
   [INCIDENT RESOLVED] SEV-X: Brief Description

   Duration: X hours Y minutes
   Root Cause: Brief description
   Resolution: What was done

   Post-incident review scheduled for: [date/time]
   ```

3. **Create Incident Record**
   - Document in incident tracking system
   - Link to Slack thread
   - Attach relevant logs/metrics

---

## Communication Templates

### Status Page - Investigating

```
We are currently investigating reports of [issue description].

Users may experience [impact description].

Our team is actively working to identify and resolve the issue.
We will provide updates every [X] minutes.
```

### Status Page - Identified

```
We have identified the cause of [issue description].

The issue is related to [root cause brief].

Our team is implementing a fix and we expect resolution within [ETA].
```

### Status Page - Resolved

```
The issue affecting [service/feature] has been resolved.

Root Cause: [Brief description]
Duration: [Start time] to [End time]

We apologize for any inconvenience caused. A detailed post-incident
review will be conducted to prevent recurrence.
```

### Customer Email (SEV-1 Only)

```
Subject: Service Incident Notification - [Date]

Dear [Customer Name],

We experienced a service incident on [date] from [start time] to [end time]
that may have affected your access to [service/feature].

What happened:
[Brief, non-technical description]

What we did:
[Resolution summary]

What we're doing to prevent recurrence:
[Planned improvements]

If you have any questions or concerns, please contact your account
manager or email support@unifiedhealth.io.

Sincerely,
The UnifiedHealth Platform Team
```

---

## Post-Incident Review

### Timeline

- **Within 24 hours**: Draft incident report
- **Within 72 hours**: Post-incident review meeting
- **Within 1 week**: Action items assigned and tracked

### Review Meeting Agenda

1. **Timeline Reconstruction** (15 min)
   - What happened, when?
   - Who was involved?
   - What actions were taken?

2. **Root Cause Analysis** (20 min)
   - What caused the incident?
   - Why did it happen?
   - 5 Whys analysis

3. **Impact Assessment** (10 min)
   - Users affected
   - Duration
   - Business impact

4. **Response Evaluation** (10 min)
   - What went well?
   - What could be improved?
   - Were runbooks followed?

5. **Action Items** (15 min)
   - Prevention measures
   - Detection improvements
   - Response improvements
   - Owner and timeline for each

### Incident Report Template

```markdown
# Incident Report: [Title]

## Summary
- **Date**: YYYY-MM-DD
- **Duration**: X hours Y minutes
- **Severity**: SEV-X
- **Incident Commander**: Name
- **Impact**: Brief description

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | Alert triggered |
| HH:MM | Incident commander engaged |
| HH:MM | Root cause identified |
| HH:MM | Fix implemented |
| HH:MM | Monitoring confirmed resolution |
| HH:MM | Incident closed |

## Root Cause
[Detailed description of what caused the incident]

## Resolution
[What was done to resolve the incident]

## Impact
- Users affected: X
- Requests failed: X
- Revenue impact: $X

## Lessons Learned
### What went well
-
-

### What could be improved
-
-

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| | | | |

## Appendix
- Link to metrics/dashboards
- Relevant log snippets
- Related tickets/PRs
```

---

## Emergency Contacts

| Role | Name | Phone | Escalation Level |
|------|------|-------|------------------|
| On-Call Engineer | Rotation | PagerDuty | L1 |
| DevOps Lead | TBD | +1-XXX-XXX-XXXX | L2 |
| Engineering Manager | TBD | +1-XXX-XXX-XXXX | L3 |
| VP Engineering | TBD | +1-XXX-XXX-XXXX | L4 |
| CISO (security) | TBD | +1-XXX-XXX-XXXX | Security |

---

**Document Classification:** Internal - Restricted
**Review Frequency:** Quarterly
**Next Review Date:** 2026-03
