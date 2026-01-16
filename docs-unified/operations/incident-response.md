# Incident Response Runbook

This document defines the incident response procedures for the Unified Healthcare Platform, ensuring rapid detection, response, and recovery from service disruptions and security incidents.

## Table of Contents

- [Overview](#overview)
- [Incident Classification](#incident-classification)
- [Response Team and Roles](#response-team-and-roles)
- [Incident Response Process](#incident-response-process)
- [Communication Templates](#communication-templates)
- [Runbooks by Incident Type](#runbooks-by-incident-type)
- [Post-Incident Procedures](#post-incident-procedures)
- [Tools and Access](#tools-and-access)
- [Escalation Contacts](#escalation-contacts)

---

## Overview

### Purpose

This runbook provides structured procedures for responding to incidents affecting the Unified Healthcare Platform. Given the healthcare context and HIPAA compliance requirements, rapid and documented response is critical.

### Scope

Covers all incidents affecting:
- Service availability
- Data integrity
- Security breaches
- Performance degradation
- Compliance violations

### Compliance Requirements

All incident responses must:
- Be documented within 24 hours
- Include PHI exposure assessment
- Follow HIPAA Breach Notification requirements (if applicable)
- Maintain audit trail for 6 years

---

## Incident Classification

### Severity Levels

| Severity | Definition | Response Time | Examples |
|----------|-----------|---------------|----------|
| **SEV-1 (Critical)** | Complete service outage or data breach | 15 minutes | Platform down, PHI breach, ransomware |
| **SEV-2 (High)** | Major feature unavailable or degraded | 30 minutes | Payment processing down, auth failures |
| **SEV-3 (Medium)** | Minor feature impact, workaround exists | 2 hours | Slow API responses, single service down |
| **SEV-4 (Low)** | Minimal impact, cosmetic issues | 24 hours | UI bugs, non-critical errors |

### Impact Assessment Matrix

| Factor | High Impact | Medium Impact | Low Impact |
|--------|-------------|---------------|------------|
| **Users Affected** | >50% | 10-50% | <10% |
| **Revenue Impact** | >$10K/hour | $1K-$10K/hour | <$1K/hour |
| **Data at Risk** | PHI/PII exposed | Potential exposure | No exposure |
| **Compliance** | HIPAA violation | Audit finding | Minor issue |

---

## Response Team and Roles

### Incident Commander (IC)

**Responsibilities:**
- Overall incident coordination
- Decision-making authority
- External communication approval
- Escalation decisions

**On-Call Rotation:** Platform Engineering Lead

### Technical Lead (TL)

**Responsibilities:**
- Technical investigation
- Coordinate engineering response
- Implement fixes
- Document technical details

**On-Call Rotation:** Senior Engineers

### Communications Lead (CL)

**Responsibilities:**
- Status page updates
- Customer notifications
- Internal stakeholder updates
- Media coordination (if needed)

**On-Call Rotation:** Product/Support Lead

### Security Lead (SL)

**Responsibilities:**
- Security incident triage
- Forensic analysis
- Compliance assessment
- Breach notification coordination

**On-Call Rotation:** Security Team

---

## Incident Response Process

### Phase 1: Detection and Triage (0-15 minutes)

```
┌─────────────────────────────────────────────────────────────────┐
│                     DETECTION SOURCES                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │Alerting │  │Customer │  │Internal │  │Security │           │
│  │ System  │  │ Report  │  │  Report │  │  Tools  │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
└───────┼────────────┼────────────┼────────────┼─────────────────┘
        └────────────┴─────┬──────┴────────────┘
                           │
                    ┌──────▼──────┐
                    │   TRIAGE    │
                    │ (On-Call)   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
      ┌───────▼───────┐        ┌───────▼───────┐
      │  SEV-1/SEV-2  │        │  SEV-3/SEV-4  │
      │  Page IC      │        │  Ticket       │
      └───────────────┘        └───────────────┘
```

**Steps:**

1. **Acknowledge Alert** (within 5 minutes)
   ```bash
   # PagerDuty acknowledgment
   pd incident:ack --incident-id <ID>
   ```

2. **Initial Assessment**
   - What is broken?
   - Who is affected?
   - When did it start?
   - What changed recently?

3. **Classify Severity**
   - Use Impact Assessment Matrix
   - When in doubt, escalate UP

4. **Create Incident Channel**
   ```
   Slack: #incident-YYYY-MM-DD-<brief-description>
   ```

5. **Page Incident Commander** (SEV-1/SEV-2)
   ```bash
   pd incident:create --severity=1 --title="<description>"
   ```

### Phase 2: Response and Mitigation (15-60 minutes)

**Immediate Actions:**

1. **Establish Command**
   - IC announces role in incident channel
   - Assign TL, CL, SL as needed

2. **Status Page Update** (within 15 minutes of SEV-1/SEV-2)
   ```
   Title: Service Disruption - [Component]
   Status: Investigating
   Body: We are investigating reports of [issue]. Updates to follow.
   ```

3. **Gather Information**
   ```bash
   # Check service health
   kubectl get pods -n unified-health
   kubectl describe pod <pod-name> -n unified-health

   # Check logs
   kubectl logs -n unified-health <pod-name> --tail=100

   # Check metrics
   # Open Grafana: https://grafana.unified-health.io
   ```

4. **Implement Mitigation**
   - Prioritize restoring service over root cause
   - Consider rollback if recent deployment
   - Scale resources if capacity issue

**Mitigation Options:**

| Issue Type | Quick Mitigation |
|------------|------------------|
| Bad deployment | `kubectl rollout undo deployment/<name>` |
| Pod crashes | `kubectl rollout restart deployment/<name>` |
| High load | `kubectl scale deployment/<name> --replicas=<N>` |
| Database issues | Failover to replica |
| External service | Enable circuit breaker / fallback |

### Phase 3: Resolution (1-4 hours)

1. **Confirm Resolution**
   - Verify metrics return to normal
   - Test affected functionality
   - Monitor for recurrence

2. **Update Status Page**
   ```
   Status: Resolved
   Body: The issue affecting [component] has been resolved.
         [Brief explanation]. We apologize for any inconvenience.
   ```

3. **Document Timeline**
   - All actions taken
   - All decisions made
   - Key findings

### Phase 4: Post-Incident (24-72 hours)

1. **Post-Incident Review** (within 48 hours)
2. **Update Documentation**
3. **Implement Preventive Measures**
4. **Close Incident Ticket**

---

## Communication Templates

### Status Page - Investigating

```
Title: [Component] Service Disruption

Status: Investigating

We are currently investigating an issue affecting [component/service].
Users may experience [symptoms]. Our team is actively working on resolution.

Started: [YYYY-MM-DD HH:MM UTC]
```

### Status Page - Identified

```
Title: [Component] Service Disruption

Status: Identified

We have identified the cause of the [component] issue as [brief cause].
Our team is implementing a fix. We expect resolution within [timeframe].

Started: [YYYY-MM-DD HH:MM UTC]
```

### Status Page - Resolved

```
Title: [Component] Service Disruption - Resolved

Status: Resolved

The issue affecting [component] has been resolved. [Brief explanation of
cause and fix]. Service has been restored to normal operation.

Duration: [X hours Y minutes]
Started: [YYYY-MM-DD HH:MM UTC]
Resolved: [YYYY-MM-DD HH:MM UTC]

We apologize for any inconvenience caused.
```

### Customer Email - Major Incident

```
Subject: Service Incident Notification - [Brief Description]

Dear [Customer Name],

We are writing to inform you of a service incident that affected
[service/component] on [date] from [start time] to [end time] UTC.

INCIDENT SUMMARY
- Duration: [X hours Y minutes]
- Impact: [Description of impact]
- Root Cause: [Brief, non-technical explanation]

ACTIONS TAKEN
[List of actions taken to resolve]

PREVENTIVE MEASURES
[List of measures being implemented to prevent recurrence]

DATA IMPACT
[Statement about data integrity/PHI exposure if applicable]

We sincerely apologize for any inconvenience this may have caused.
If you have any questions, please contact support@unified-health.com.

Sincerely,
[Name]
Unified Healthcare Platform Team
```

### Internal Slack Update Template

```
:rotating_light: INCIDENT UPDATE :rotating_light:

*Incident:* [Brief description]
*Severity:* SEV-[X]
*Status:* [Investigating/Identified/Mitigating/Resolved]
*IC:* @[name]
*Channel:* #incident-[name]

*Current State:*
[1-2 sentences about current status]

*Next Actions:*
- [Action 1]
- [Action 2]

*ETA to Resolution:* [Time estimate or "Unknown"]
```

---

## Runbooks by Incident Type

### 1. Complete Service Outage (SEV-1)

**Symptoms:**
- All API requests failing
- Health checks failing
- No pods running

**Immediate Actions:**

```bash
# 1. Check cluster health
kubectl get nodes
kubectl get pods -n unified-health

# 2. Check for resource issues
kubectl top nodes
kubectl describe nodes

# 3. Check recent deployments
kubectl rollout history deployment/unified-health-api -n unified-health

# 4. If bad deployment, rollback
kubectl rollout undo deployment/unified-health-api -n unified-health

# 5. Check events
kubectl get events -n unified-health --sort-by='.lastTimestamp'
```

**Escalation Path:**
1. On-call Engineer (0-5 min)
2. Platform Lead (5-15 min)
3. VP Engineering (15-30 min)
4. CEO (30+ min for SEV-1)

---

### 2. Database Outage (SEV-1)

**Symptoms:**
- Database connection errors
- API requests timing out
- PostgreSQL not responding

**Immediate Actions:**

```bash
# 1. Check database status
kubectl get pods -n unified-health -l app=postgresql

# 2. Check database logs
kubectl logs -n unified-health postgresql-0 --tail=100

# 3. Check connection pool
# In Grafana: Database Metrics Dashboard

# 4. Failover to replica (if configured)
kubectl exec -n unified-health postgresql-0 -- pg_ctl promote

# 5. Check disk space
kubectl exec -n unified-health postgresql-0 -- df -h /var/lib/postgresql/data
```

**Recovery Procedures:**

```bash
# Restore from backup (if needed)
kubectl exec -n unified-health postgresql-0 -- \
  pg_restore -d unified_health /backups/latest.dump

# Verify data integrity
kubectl exec -n unified-health postgresql-0 -- \
  psql -d unified_health -c "SELECT COUNT(*) FROM users;"
```

---

### 3. Security Breach / PHI Exposure (SEV-1)

**Symptoms:**
- Unauthorized access detected
- Data exfiltration alerts
- Suspicious activity in audit logs

**Immediate Actions:**

```bash
# 1. ISOLATE - Contain the breach
# Revoke compromised credentials immediately
kubectl create secret generic api-keys --from-literal=key=REVOKED --dry-run=client -o yaml | kubectl apply -f -

# 2. Block suspicious IPs
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: block-suspicious-ip
spec:
  podSelector: {}
  ingress:
  - from:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - <SUSPICIOUS_IP>/32
EOF

# 3. Preserve evidence - DO NOT DELETE LOGS
kubectl logs -n unified-health <pod-name> --all-containers > /evidence/logs-$(date +%Y%m%d-%H%M%S).txt

# 4. Check audit logs
kubectl exec -n unified-health api-pod -- \
  cat /var/log/unified-health/audit.log | grep -i "unauthorized\|breach\|suspicious"
```

**Required Notifications:**

| Timeline | Action |
|----------|--------|
| Immediate | Security Team, IC, Legal |
| 1 hour | CISO, VP Engineering |
| 24 hours | Affected users assessment |
| 72 hours | HHS notification (if PHI breach >500 individuals) |

**HIPAA Breach Assessment Checklist:**

- [ ] Was PHI involved?
- [ ] How many records affected?
- [ ] Was data encrypted?
- [ ] What type of PHI (names, SSN, medical records)?
- [ ] Who had unauthorized access?
- [ ] Was data exfiltrated or just accessed?
- [ ] Risk of harm to individuals?

---

### 4. Authentication System Failure (SEV-2)

**Symptoms:**
- Users cannot log in
- JWT validation failures
- Token refresh failing

**Immediate Actions:**

```bash
# 1. Check auth service
kubectl get pods -n unified-health -l service=auth
kubectl logs -n unified-health -l service=auth --tail=100

# 2. Verify JWT secret is valid
kubectl get secret jwt-secret -n unified-health -o yaml

# 3. Check Redis session store
kubectl exec -n unified-health redis-0 -- redis-cli ping
kubectl exec -n unified-health redis-0 -- redis-cli info memory

# 4. Restart auth service if needed
kubectl rollout restart deployment/auth-service -n unified-health

# 5. Clear session cache (last resort - will log out all users)
kubectl exec -n unified-health redis-0 -- redis-cli FLUSHDB
```

---

### 5. Payment Processing Failure (SEV-2)

**Symptoms:**
- Stripe/payment errors
- Users cannot complete subscriptions
- Webhook failures

**Immediate Actions:**

```bash
# 1. Check Stripe status
curl -s https://status.stripe.com/api/v2/status.json | jq .status

# 2. Check payment service logs
kubectl logs -n unified-health -l service=payment --tail=100

# 3. Verify Stripe API key
kubectl get secret stripe-secrets -n unified-health -o yaml

# 4. Check webhook endpoint
curl -X POST https://api.unified-health.io/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 5. Verify webhook signature secret
kubectl exec -n unified-health api-pod -- env | grep STRIPE
```

**Customer Communication:**
- Enable banner: "Payment processing temporarily unavailable"
- Queue transactions for retry
- Do not charge customers multiple times

---

### 6. High Latency / Performance Degradation (SEV-3)

**Symptoms:**
- API response times >2s
- Grafana alerts for latency
- User complaints about slowness

**Investigation:**

```bash
# 1. Check API latency metrics
# Grafana: API Overview Dashboard -> Request Duration

# 2. Identify slow endpoints
kubectl exec -n unified-health api-pod -- \
  cat /var/log/unified-health/access.log | \
  awk '$NF > 2000 {print $7}' | sort | uniq -c | sort -rn | head -20

# 3. Check database slow queries
kubectl exec -n unified-health postgresql-0 -- \
  psql -d unified_health -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# 4. Check resource usage
kubectl top pods -n unified-health

# 5. Scale if needed
kubectl scale deployment/unified-health-api -n unified-health --replicas=5
```

**Optimization Actions:**
- Enable query caching
- Add database indexes
- Implement pagination
- Enable CDN for static assets

---

### 7. Third-Party Service Outage (SEV-2/3)

**Affected Services:**
- Stripe (Payments)
- Twilio (SMS)
- SendGrid (Email)
- Azure (Cloud Infrastructure)

**Immediate Actions:**

```bash
# 1. Check service status pages
# Stripe: https://status.stripe.com
# Twilio: https://status.twilio.com
# SendGrid: https://status.sendgrid.com
# Azure: https://status.azure.com

# 2. Enable fallback/degraded mode
kubectl set env deployment/unified-health-api \
  ENABLE_FALLBACK_MODE=true \
  -n unified-health

# 3. Queue failed operations for retry
kubectl exec -n unified-health api-pod -- \
  node scripts/queue-failed-operations.js
```

**Degraded Mode Behaviors:**
| Service | Fallback Behavior |
|---------|-------------------|
| Stripe | Queue payments, notify users |
| Twilio | Log SMS, email fallback |
| SendGrid | Queue emails, retry later |
| Azure Storage | Local cache, sync later |

---

### 8. Kubernetes Node Failure (SEV-2)

**Symptoms:**
- Node NotReady status
- Pods in Pending state
- Scheduling failures

**Immediate Actions:**

```bash
# 1. Check node status
kubectl get nodes
kubectl describe node <node-name>

# 2. Cordon failed node
kubectl cordon <node-name>

# 3. Drain workloads
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 4. Check pod redistribution
kubectl get pods -n unified-health -o wide

# 5. If cloud provider, check instance health
az vm get-instance-view --name <vm-name> --resource-group <rg>
```

---

## Post-Incident Procedures

### Post-Incident Review (PIR)

**Schedule:** Within 48 hours of resolution

**Attendees:**
- Incident Commander
- Technical Lead
- All responders
- Relevant stakeholders

**Agenda:**

1. **Timeline Review** (15 min)
   - Exact sequence of events
   - Detection to resolution time
   - Key decision points

2. **Root Cause Analysis** (20 min)
   - 5 Whys analysis
   - Contributing factors
   - What broke down?

3. **Response Assessment** (15 min)
   - What went well?
   - What could improve?
   - Communication effectiveness

4. **Action Items** (10 min)
   - Preventive measures
   - Documentation updates
   - Tool improvements

### PIR Document Template

```markdown
# Post-Incident Review: [Incident Title]

## Summary
- **Date:** YYYY-MM-DD
- **Duration:** X hours Y minutes
- **Severity:** SEV-X
- **Impact:** [Description]
- **Root Cause:** [Brief statement]

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | [Event description] |

## Root Cause Analysis
### What happened?
[Detailed technical explanation]

### Why did it happen?
1. Why? [First why]
2. Why? [Second why]
3. Why? [Third why]
4. Why? [Fourth why]
5. Why? [Root cause]

### Contributing Factors
- [Factor 1]
- [Factor 2]

## Impact
- **Users Affected:** [Number/percentage]
- **Revenue Impact:** [$X]
- **Data Impact:** [None/Description]

## Response Analysis
### What went well
- [Item 1]
- [Item 2]

### What could improve
- [Item 1]
- [Item 2]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | @name | YYYY-MM-DD | Open |

## Lessons Learned
[Key takeaways for the team]
```

---

## Tools and Access

### Monitoring and Alerting

| Tool | URL | Purpose |
|------|-----|---------|
| Grafana | https://grafana.unified-health.io | Dashboards & metrics |
| Prometheus | https://prometheus.unified-health.io | Metrics queries |
| AlertManager | https://alertmanager.unified-health.io | Alert management |
| Jaeger | https://jaeger.unified-health.io | Distributed tracing |

### Infrastructure

| Tool | Access | Purpose |
|------|--------|---------|
| kubectl | VPN + kubeconfig | Kubernetes management |
| Azure Portal | SSO | Cloud infrastructure |
| PagerDuty | SSO | On-call & alerting |

### Communication

| Tool | Channel | Purpose |
|------|---------|---------|
| Slack | #incidents | Incident coordination |
| Slack | #on-call | On-call handoffs |
| Status Page | status.unified-health.io | Public status |

### Useful Commands

```bash
# Quick health check
kubectl get pods -n unified-health | grep -v Running

# Recent events
kubectl get events -n unified-health --sort-by='.lastTimestamp' | tail -20

# API logs (last 5 minutes)
kubectl logs -n unified-health -l app=api --since=5m

# Database connections
kubectl exec -n unified-health postgresql-0 -- \
  psql -c "SELECT count(*) FROM pg_stat_activity;"

# Redis status
kubectl exec -n unified-health redis-0 -- redis-cli info

# Force pod restart
kubectl delete pod <pod-name> -n unified-health

# Scale deployment
kubectl scale deployment/<name> -n unified-health --replicas=<N>
```

---

## Escalation Contacts

### On-Call Rotation

| Role | Primary | Backup |
|------|---------|--------|
| Platform Engineer | PagerDuty Schedule | PagerDuty Schedule |
| Security | security-oncall@unified-health.io | CISO |
| Database | dba-oncall@unified-health.io | Platform Lead |

### Management Escalation

| Severity | Escalate To | Contact |
|----------|-------------|---------|
| SEV-1 | VP Engineering | +1-XXX-XXX-XXXX |
| SEV-1 (30+ min) | CTO | +1-XXX-XXX-XXXX |
| Security Breach | CISO | +1-XXX-XXX-XXXX |
| PHI Breach | Legal + Compliance | compliance@unified-health.io |

### External Contacts

| Service | Support Contact | Escalation |
|---------|-----------------|------------|
| Azure | Azure Support Portal | Premier Support |
| Stripe | support@stripe.com | Dashboard escalation |
| Twilio | support@twilio.com | Account manager |
| SendGrid | support@sendgrid.com | Account manager |

---

## Appendix

### Incident Severity Decision Tree

```
Is the platform completely unavailable?
├── YES → SEV-1
└── NO
    └── Is PHI potentially exposed?
        ├── YES → SEV-1
        └── NO
            └── Is a critical feature (auth, payments) down?
                ├── YES → SEV-2
                └── NO
                    └── Are >10% of users affected?
                        ├── YES → SEV-3
                        └── NO → SEV-4
```

### HIPAA Breach Notification Requirements

| Breach Size | Notification Timeline |
|-------------|----------------------|
| <500 individuals | Annual report to HHS |
| ≥500 individuals | 60 days to HHS and affected individuals |
| ≥500 in one state | Media notification required |

### Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-01-15 | 1.0 | Platform Team | Initial version |

---

**Document Owner:** Platform Engineering Team
**Review Cycle:** Quarterly
**Last Review:** 2025-01-15
**Next Review:** 2025-04-15
