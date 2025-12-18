# Rollback Runbook - UnifiedHealth Global Platform

**Version:** 1.0
**Last Updated:** December 2024
**Owner:** Release Management Team
**Classification:** Internal - Restricted

---

## Table of Contents

1. [Overview](#overview)
2. [Rollback Decision Criteria](#rollback-decision-criteria)
3. [Rollback Methods](#rollback-methods)
4. [Application Rollback Procedures](#application-rollback-procedures)
5. [Database Rollback Procedures](#database-rollback-procedures)
6. [Infrastructure Rollback Procedures](#infrastructure-rollback-procedures)
7. [Partial Rollback Procedures](#partial-rollback-procedures)
8. [Post-Rollback Validation](#post-rollback-validation)
9. [Communication Procedures](#communication-procedures)
10. [Root Cause Analysis](#root-cause-analysis)

---

## Overview

### Purpose
This runbook provides detailed procedures for rolling back deployments when issues are detected in production. It ensures safe, rapid recovery to the last known good state.

### Rollback Philosophy
- **Safety First:** Protect data integrity above all else
- **Speed:** Execute rollback quickly to minimize user impact
- **Communication:** Keep all stakeholders informed
- **Learning:** Document and learn from rollback events

### Key Principles
1. **No Rollback Without Approval:** Get proper authorization
2. **Data Preservation:** Never sacrifice data integrity for speed
3. **Complete Testing:** Validate rollback before declaring success
4. **Document Everything:** Record all actions and decisions

### Rollback Authority

| Scenario | Decision Maker | Approval Time |
|----------|---------------|---------------|
| Critical Production Issue | Release Manager | Immediate |
| Data Integrity Risk | Release Manager + DBA | < 5 minutes |
| Security Incident | Release Manager + CISO | Immediate |
| Business Impact | Release Manager + VP Engineering | < 10 minutes |
| Customer-Facing Outage | Release Manager | Immediate |

---

## Rollback Decision Criteria

### When to Rollback

#### Mandatory Rollback Triggers (Immediate Action)

1. **Critical System Failures**
   - [ ] Complete service outage (all regions down)
   - [ ] API error rate > 5% for 5+ minutes
   - [ ] Database corruption detected
   - [ ] Data loss occurring
   - [ ] Security breach or vulnerability actively exploited

2. **Performance Degradation**
   - [ ] API p95 response time > 1000ms for 10+ minutes
   - [ ] API p99 response time > 2000ms for 10+ minutes
   - [ ] Database query timeout rate > 10%
   - [ ] Memory leak causing OOM errors
   - [ ] CPU saturation > 95% with no auto-scaling

3. **Data Integrity Issues**
   - [ ] Data corruption in production database
   - [ ] Incorrect data being written
   - [ ] Foreign key constraint violations
   - [ ] Data inconsistency between services
   - [ ] Audit log failures

4. **Security Issues**
   - [ ] Critical vulnerability discovered and exploited
   - [ ] Unauthorized data access detected
   - [ ] Authentication bypass discovered
   - [ ] Sensitive data exposed
   - [ ] DDoS attack succeeding

5. **Business Impact**
   - [ ] Payment processing failures > 10%
   - [ ] Critical user journeys completely broken
   - [ ] More than 100 customer complaints in 1 hour
   - [ ] Regulatory compliance violation
   - [ ] Legal liability exposure

#### Discretionary Rollback Triggers (Evaluation Required)

1. **Moderate Issues**
   - Error rate 1-5% sustained
   - Non-critical feature failures
   - Performance degradation within SLA but worse than baseline
   - Minor user experience issues
   - Non-critical bug affecting small user percentage

2. **Evaluation Factors**
   - Severity of issue
   - Number of affected users
   - Ability to fix forward
   - Time to fix vs. time to rollback
   - Business criticality
   - Regulatory implications

### When NOT to Rollback

**Consider Fix-Forward Instead When:**
- Issue can be resolved in < 15 minutes
- Only affecting non-critical features
- Feature flag can disable problematic functionality
- Hot-patch available and tested
- Rollback would cause more disruption than issue
- Data migration cannot be reversed

---

## Rollback Methods

### Method Comparison

| Method | Speed | Data Safety | Complexity | Use Case |
|--------|-------|-------------|------------|----------|
| Kubernetes Rollback | 5-10 min | High | Low | Application code changes only |
| Feature Flag Disable | 1-2 min | High | Very Low | Feature-specific issues |
| DNS Rollback | 5-15 min | High | Medium | Infrastructure changes |
| Database Rollback | 30-60 min | Medium | High | Schema changes with data issues |
| Full System Rollback | 60-120 min | Medium | Very High | Complete deployment failure |

### Selecting Rollback Method

**Decision Tree:**

```
Is there a database schema change?
├── NO → Is it a feature-flagged change?
│   ├── YES → Use Feature Flag Disable (Method 2)
│   └── NO → Use Kubernetes Rollback (Method 1)
└── YES → Is the data corrupted or lost?
    ├── YES → Use Database Rollback (Method 4)
    └── NO → Can we keep the new schema?
        ├── YES → Use Kubernetes Rollback (Method 1)
        └── NO → Use Database Rollback (Method 4)
```

---

## Application Rollback Procedures

### Method 1: Kubernetes Rollback (Recommended)

**Use Case:** Application code changes without database schema modifications
**Duration:** 5-10 minutes
**Risk Level:** Low
**Data Impact:** None

#### Prerequisites Checklist
- [ ] Previous deployment version identified
- [ ] Previous deployment was successful
- [ ] No database schema changes in current deployment
- [ ] Rollback approval obtained

---

#### Step 1: Initiate Rollback (2 minutes)

```bash
# Verify current deployment status
kubectl get deployments -n unified-health

# Check deployment history
kubectl rollout history deployment/unified-health-api -n unified-health

# Identify previous revision
kubectl rollout history deployment/unified-health-api -n unified-health --revision=PREVIOUS_REVISION

# Example output:
# deployment.apps/unified-health-api with revision #4
# Pod Template:
#   Labels:	app=unified-health-api
#   version=v1.1.0
```

**Checklist:**
- [ ] Current revision identified
- [ ] Previous revision verified
- [ ] Previous revision was stable

---

#### Step 2: Execute Rollback (3-5 minutes)

```bash
# Rollback API deployment
kubectl rollout undo deployment/unified-health-api -n unified-health

# Monitor rollback progress
kubectl rollout status deployment/unified-health-api -n unified-health

# Watch pods being replaced
watch kubectl get pods -n unified-health -l app=unified-health-api

# Verify new pods are running previous version
kubectl get pods -n unified-health -l app=unified-health-api -o jsonpath='{.items[*].spec.containers[*].image}'
```

**Expected Output:**
```
Waiting for deployment "unified-health-api" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "unified-health-api" rollout to finish: 1 old replicas are pending termination...
deployment "unified-health-api" successfully rolled out
```

**Checklist:**
- [ ] Rollback command executed
- [ ] Pods being replaced
- [ ] New pods starting successfully
- [ ] Image version verified

---

#### Step 3: Verify Services (2-3 minutes)

```bash
# Check pod health
kubectl get pods -n unified-health -l app=unified-health-api

# All pods should show READY 1/1 and STATUS Running

# Check pod logs for errors
kubectl logs -n unified-health -l app=unified-health-api --tail=50

# Verify health endpoint
curl https://api.unifiedhealth.io/health

# Expected: {"status":"healthy","version":"v1.1.0"}

# Check service endpoints
kubectl get endpoints unified-health-api -n unified-health

# Verify traffic is routing to rolled-back pods
kubectl describe service unified-health-api -n unified-health
```

**Checklist:**
- [ ] All pods running
- [ ] No errors in logs
- [ ] Health check passing
- [ ] Endpoints updated
- [ ] Traffic routing correctly

---

#### Step 4: Multi-Region Rollback (if applicable)

```bash
# Repeat rollback for each region

# US West
kubectl rollout undo deployment/unified-health-api -n unified-health --context=us-west
kubectl rollout status deployment/unified-health-api -n unified-health --context=us-west

# EU Frankfurt
kubectl rollout undo deployment/unified-health-api -n unified-health --context=eu-central
kubectl rollout status deployment/unified-health-api -n unified-health --context=eu-central

# Asia Singapore
kubectl rollout undo deployment/unified-health-api -n unified-health --context=asia-southeast
kubectl rollout status deployment/unified-health-api -n unified-health --context=asia-southeast
```

**Checklist:**
- [ ] US West rolled back
- [ ] EU rolled back
- [ ] Asia rolled back
- [ ] All regions verified

---

### Method 2: Feature Flag Disable (Fastest)

**Use Case:** New feature causing issues, feature is flag-controlled
**Duration:** 1-2 minutes
**Risk Level:** Very Low
**Data Impact:** None

#### Step 1: Identify Problematic Features

```bash
# Connect to Redis (feature flag store)
kubectl exec -it -n unified-health redis-master-0 -- redis-cli

# List all feature flags
KEYS feature:*

# Example output:
# 1) "feature:new_appointment_ui"
# 2) "feature:enhanced_analytics"
# 3) "feature:ai_triage_v2"
```

---

#### Step 2: Disable Features

```bash
# Disable specific feature
SET feature:new_appointment_ui false

# Or disable for percentage of users
SET feature:new_appointment_ui:percentage 0

# Verify
GET feature:new_appointment_ui

# Should return: "false"

# Save changes
SAVE
```

**Checklist:**
- [ ] Problematic features identified
- [ ] Features disabled
- [ ] Changes verified
- [ ] Changes persisted

---

#### Step 3: Monitor Impact

```bash
# Monitor error rate (should decrease)
kubectl exec -it -n monitoring prometheus-0 -- \
  promtool query instant 'rate(http_requests_total{status=~"5.."}[5m])'

# Monitor user sessions (should stabilize)
kubectl exec -it -n unified-health redis-master-0 -- redis-cli
> KEYS session:*
> DBSIZE

# Check application logs
kubectl logs -n unified-health -l app=unified-health-api --tail=100 --since=5m
```

**Checklist:**
- [ ] Error rate decreased
- [ ] User sessions stable
- [ ] No new errors in logs

---

### Method 3: Container Image Rollback

**Use Case:** Specific service needs rollback without full deployment rollback
**Duration:** 5-8 minutes
**Risk Level:** Low
**Data Impact:** None

#### Step 1: Identify Previous Image

```bash
# Check image history
kubectl describe deployment unified-health-api -n unified-health | grep Image

# Or check container registry
az acr repository show-tags \
  --name unifiedhealthacr \
  --repository unified-health-api \
  --orderby time_desc

# Example output:
# v1.2.0 (current - problematic)
# v1.1.0 (previous - stable)
# v1.0.0
```

---

#### Step 2: Update Image Version

```bash
# Set image to previous version
kubectl set image deployment/unified-health-api \
  api=acr.azurecr.io/unified-health-api:v1.1.0 \
  -n unified-health

# Monitor rollout
kubectl rollout status deployment/unified-health-api -n unified-health

# Verify image update
kubectl get pods -n unified-health -l app=unified-health-api -o jsonpath='{.items[*].spec.containers[*].image}'
```

**Checklist:**
- [ ] Previous image identified
- [ ] Image update command executed
- [ ] Rollout completed
- [ ] Image version verified

---

## Database Rollback Procedures

### Method 4: Database Schema Rollback

**Use Case:** Database migration caused issues or data corruption
**Duration:** 30-60 minutes
**Risk Level:** High
**Data Impact:** Potential data loss

**WARNING:** This is the most complex and risky rollback method. Only proceed if absolutely necessary.

---

#### Prerequisites (Critical)

**Before Starting:**
- [ ] **STOP ALL APPLICATION WRITES** - Scale deployment to 0 replicas
- [ ] Database backup exists and verified
- [ ] Backup is from before problematic migration
- [ ] Rollback approval from DBA + VP Engineering
- [ ] Estimated data loss assessed and accepted
- [ ] All stakeholders notified

---

#### Step 1: Stop Application (5 minutes)

```bash
# Stop all API instances to prevent writes
kubectl scale deployment unified-health-api -n unified-health --replicas=0

# Verify all pods terminated
kubectl get pods -n unified-health -l app=unified-health-api

# Should show: No resources found

# Update status page
curl -X POST https://api.statuspage.io/v1/status \
  -d "status=major_outage" \
  -d "message=Emergency maintenance in progress"
```

**Checklist:**
- [ ] All API pods stopped
- [ ] No active connections to database
- [ ] Status page updated
- [ ] Stakeholders notified

---

#### Step 2: Verify Database State (5 minutes)

```bash
# Connect to database
psql -U unified_health -d unified_health_prod

# Check active connections
SELECT COUNT(*) FROM pg_stat_activity WHERE datname='unified_health_prod';
-- Should return: 1 (only your connection)

# List all tables
\dt

# Check recent migrations
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;

# Exit
\q
```

**Checklist:**
- [ ] No active application connections
- [ ] Current schema identified
- [ ] Migration history reviewed

---

#### Step 3: Create Emergency Backup (10 minutes)

```bash
# Create final backup before rollback
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
pg_dump -U unified_health -d unified_health_prod \
  -F c -f /backups/emergency-backup-$TIMESTAMP.dump

# Verify backup
ls -lh /backups/emergency-backup-$TIMESTAMP.dump

# Calculate checksum
sha256sum /backups/emergency-backup-$TIMESTAMP.dump > /backups/emergency-backup-$TIMESTAMP.sha256

# Copy to secure location
aws s3 cp /backups/emergency-backup-$TIMESTAMP.dump \
  s3://unified-health-backups/emergency/

aws s3 cp /backups/emergency-backup-$TIMESTAMP.sha256 \
  s3://unified-health-backups/emergency/
```

**Checklist:**
- [ ] Emergency backup created
- [ ] Backup size reasonable
- [ ] Checksum calculated
- [ ] Backup uploaded to S3

---

#### Step 4: Identify Rollback Point (5 minutes)

```bash
# List available backups
aws s3 ls s3://unified-health-backups/daily/ | grep "$(date -d yesterday +%Y%m%d)"

# Example output:
# 2024-12-16-020000-prod-backup.dump
# 2024-12-16-020000-prod-backup.sha256

# Download backup
aws s3 cp s3://unified-health-backups/daily/2024-12-16-020000-prod-backup.dump \
  /restore/rollback-backup.dump

# Verify checksum
aws s3 cp s3://unified-health-backups/daily/2024-12-16-020000-prod-backup.sha256 \
  /restore/rollback-backup.sha256

sha256sum -c /restore/rollback-backup.sha256
# Should output: rollback-backup.dump: OK
```

**Checklist:**
- [ ] Rollback backup identified
- [ ] Backup downloaded
- [ ] Checksum verified
- [ ] Backup timestamp confirmed

---

#### Step 5: Execute Database Restore (15-30 minutes)

```bash
# Drop and recreate database (DANGER!)
psql -U postgres -c "DROP DATABASE unified_health_prod;"
psql -U postgres -c "CREATE DATABASE unified_health_prod OWNER unified_health;"

# Restore from backup
pg_restore -U unified_health -d unified_health_prod \
  -c --if-exists \
  /restore/rollback-backup.dump

# This will take 15-30 minutes depending on database size
# Monitor progress:
watch "psql -U unified_health -d unified_health_prod -c 'SELECT COUNT(*) FROM patients;'"
```

**Expected Output:**
```
pg_restore: creating TABLE "public.patients"
pg_restore: creating TABLE "public.providers"
pg_restore: creating TABLE "public.appointments"
...
pg_restore: processing data for table "public.patients"
pg_restore: processing data for table "public.providers"
...
```

**Checklist:**
- [ ] Database dropped
- [ ] Database recreated
- [ ] Restore started
- [ ] Restore progress monitored

---

#### Step 6: Verify Database Integrity (10 minutes)

```bash
# Connect to database
psql -U unified_health -d unified_health_prod

-- Verify table counts
SELECT
  'patients' AS table_name,
  COUNT(*) AS row_count
FROM patients
UNION ALL
SELECT 'providers', COUNT(*) FROM providers
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'users', COUNT(*) FROM users;

-- Check for orphaned data
SELECT COUNT(*) FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
WHERE p.id IS NULL;
-- Should return: 0

-- Verify foreign keys
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE contype = 'f';

-- Verify indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check schema version
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 1;

\q
```

**Checklist:**
- [ ] Table row counts match expected values
- [ ] No orphaned foreign key references
- [ ] All foreign keys exist
- [ ] All indexes created
- [ ] Schema version correct

---

#### Step 7: Rollback Application Code (5 minutes)

```bash
# Rollback to application version compatible with restored schema
kubectl set image deployment/unified-health-api \
  api=acr.azurecr.io/unified-health-api:v1.1.0 \
  -n unified-health

# Scale back up
kubectl scale deployment unified-health-api -n unified-health --replicas=3

# Monitor pod startup
watch kubectl get pods -n unified-health -l app=unified-health-api

# Wait for all pods to be Running and READY 1/1
```

**Checklist:**
- [ ] Application image rolled back
- [ ] Deployment scaled up
- [ ] All pods running
- [ ] Health checks passing

---

## Infrastructure Rollback Procedures

### Method 5: DNS Rollback

**Use Case:** Infrastructure or routing changes
**Duration:** 10-20 minutes (includes DNS propagation)
**Risk Level:** Medium
**Data Impact:** None

#### Step 1: Identify DNS Changes

```bash
# Check current DNS records
dig api.unifiedhealth.io
dig app.unifiedhealth.io

# Example output:
# api.unifiedhealth.io. 300 IN A 203.0.113.1

# Retrieve previous DNS configuration from IaC
git log -p infrastructure/dns/route53.tf
```

---

#### Step 2: Revert DNS Changes

```bash
# Using AWS Route53
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789ABC \
  --change-batch file://dns-rollback.json

# dns-rollback.json:
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "api.unifiedhealth.io",
      "Type": "A",
      "TTL": 300,
      "ResourceRecords": [
        {"Value": "OLD_IP_ADDRESS"}
      ]
    }
  }]
}

# Verify change status
aws route53 get-change --id CHANGE_ID
```

**Checklist:**
- [ ] Previous DNS values identified
- [ ] DNS update submitted
- [ ] Change status verified

---

#### Step 3: Verify DNS Propagation

```bash
# Check DNS from multiple locations
dig @8.8.8.8 api.unifiedhealth.io  # Google DNS
dig @1.1.1.1 api.unifiedhealth.io  # Cloudflare DNS

# Monitor propagation (may take 5-10 minutes)
watch -n 10 "dig api.unifiedhealth.io +short"

# Test from different regions
curl -I https://api.unifiedhealth.io
```

**Checklist:**
- [ ] DNS updated in authoritative server
- [ ] DNS propagated to public resolvers
- [ ] Application accessible via DNS

---

### Method 6: Load Balancer Rollback

**Use Case:** Load balancer configuration changes
**Duration:** 5-10 minutes
**Risk Level:** Medium
**Data Impact:** None

#### Step 1: Identify Current Configuration

```bash
# For AWS ALB
aws elbv2 describe-load-balancers \
  --names unified-health-alb

# For AWS Target Groups
aws elbv2 describe-target-groups \
  --load-balancer-arn ALB_ARN
```

---

#### Step 2: Revert Load Balancer Rules

```bash
# Update target group to point to old deployment
aws elbv2 modify-target-group \
  --target-group-arn TG_ARN \
  --health-check-path /health \
  --health-check-interval-seconds 30

# Update listener rules
aws elbv2 modify-rule \
  --rule-arn RULE_ARN \
  --actions Type=forward,TargetGroupArn=OLD_TG_ARN
```

**Checklist:**
- [ ] Target group updated
- [ ] Listener rules updated
- [ ] Health checks configured

---

## Partial Rollback Procedures

### Method 7: Single Service Rollback

**Use Case:** One microservice causing issues, others are fine
**Duration:** 5-10 minutes
**Risk Level:** Low
**Data Impact:** None

#### Identify Problematic Service

```bash
# Check error rates per service
kubectl exec -it -n monitoring prometheus-0 -- \
  promtool query instant \
  'rate(http_requests_total{status=~"5.."}[5m])' \
  | grep -v "^$" | sort -k2 -rn

# Example output:
# http_requests_total{service="appointment-service"} 0.15
# http_requests_total{service="patient-service"} 0.01
# http_requests_total{service="provider-service"} 0.00

# Appointment service has high error rate
```

---

#### Rollback Single Service

```bash
# Rollback only the problematic service
kubectl rollout undo deployment/appointment-service -n unified-health

# Monitor
kubectl rollout status deployment/appointment-service -n unified-health

# Verify
kubectl get pods -n unified-health -l app=appointment-service
```

**Checklist:**
- [ ] Problematic service identified
- [ ] Service rolled back
- [ ] Error rate decreased
- [ ] Other services unaffected

---

### Method 8: Regional Rollback

**Use Case:** Issues in specific region only
**Duration:** 10-15 minutes
**Risk Level:** Low
**Data Impact:** None

#### Rollback Single Region

```bash
# Rollback US West region only
kubectl rollout undo deployment/unified-health-api \
  -n unified-health \
  --context=us-west

# Monitor
kubectl rollout status deployment/unified-health-api \
  -n unified-health \
  --context=us-west

# Verify regional health
curl https://us-west.api.unifiedhealth.io/health
```

**Checklist:**
- [ ] Problematic region identified
- [ ] Region rolled back
- [ ] Regional health verified
- [ ] Other regions unaffected

---

## Post-Rollback Validation

### Validation Checklist

#### Immediate Validation (First 15 Minutes)

**System Health:**
- [ ] All services running
- [ ] All health checks passing
- [ ] No pods in CrashLoopBackOff
- [ ] No high error rates
- [ ] Response times within SLA

**Application Functionality:**
- [ ] User login working
- [ ] Critical user flows working
- [ ] API endpoints responding
- [ ] Database queries succeeding
- [ ] External integrations working

**Run Smoke Tests:**
```bash
cd tests/smoke
npm run test:smoke:production

# All tests should pass
```

---

#### Extended Validation (First Hour)

**Monitor Key Metrics:**

```bash
# Monitor error rate
kubectl exec -it -n monitoring prometheus-0 -- \
  promtool query instant 'rate(http_requests_total{status=~"5.."}[5m])'

# Monitor response time
kubectl exec -it -n monitoring prometheus-0 -- \
  promtool query instant \
  'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))'

# Monitor active users
kubectl exec -it -n unified-health redis-master-0 -- redis-cli DBSIZE
```

**Validation Checklist:**
- [ ] Error rate < 0.1%
- [ ] p95 response time < 200ms
- [ ] No memory leaks
- [ ] No database issues
- [ ] User sessions stable
- [ ] No customer complaints

---

#### Data Integrity Validation

```bash
# Connect to database
psql -U unified_health -d unified_health_prod

-- Run data integrity checks
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM providers;

-- Check for orphaned records
SELECT COUNT(*) FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
WHERE p.id IS NULL;

-- Verify recent activity
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS count
FROM appointments
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Data Validation Checklist:**
- [ ] Record counts reasonable
- [ ] No orphaned records
- [ ] Recent activity present
- [ ] No data corruption
- [ ] Foreign keys intact

---

## Communication Procedures

### Rollback Communication Template

#### Initial Rollback Notification

**Channel:** Slack (#incidents, #engineering), Email, Status Page
**Timing:** Immediately when rollback initiated

```
ROLLBACK INITIATED

Version: v[X.Y.Z]
Reason: [Brief description of issue]
Started: [HH:MM UTC]
Estimated Duration: [XX] minutes
Decision Maker: [Name]

Current Status: Rolling back to v[X.Y.Z-1]

Updates will be provided every 10 minutes.

Incident Channel: #incident-YYYY-MM-DD
War Room: [Zoom Link]
```

---

#### Progress Updates (Every 10 Minutes)

```
ROLLBACK UPDATE [HH:MM UTC]

Progress: [XX%] complete
Current Phase: [Phase description]
Status: [On track / Delayed / Completed]

Completed:
- [Step 1]
- [Step 2]

In Progress:
- [Current step]

Next:
- [Next step]

Issues: [None / Description]
```

---

#### Rollback Complete Notification

```
ROLLBACK COMPLETED

Version: Reverted to v[X.Y.Z-1]
Start Time: [HH:MM UTC]
End Time: [HH:MM UTC]
Duration: [XX] minutes
Status: SUCCESS

Validation Results:
✓ All health checks passing
✓ Smoke tests passed
✓ Error rate normalized
✓ Response times within SLA

Current System Status: OPERATIONAL

Root Cause Analysis: Scheduled for [Date/Time]

Post-Mortem Document: [Link]
```

---

### Stakeholder Communication

#### Internal Stakeholders

**Email Template:**
```
Subject: Production Rollback - v[X.Y.Z]

Team,

We have completed a rollback of production deployment v[X.Y.Z] due to [issue description].

Timeline:
- Issue Detected: [HH:MM UTC]
- Rollback Initiated: [HH:MM UTC]
- Rollback Completed: [HH:MM UTC]
- Total Duration: [XX] minutes

Impact:
- User Impact: [Description]
- Affected Users: [Estimated number or percentage]
- Data Loss: [None / Description]

Current Status:
- System operational
- All services healthy
- Monitoring for any residual issues

Next Steps:
- Root cause analysis: [Date/Time]
- Post-mortem: [Date/Time]
- Re-deployment plan: TBD

For questions, contact: [Release Manager]
```

---

#### Customer Communication (if needed)

**Email Template:**
```
Subject: Service Interruption - Resolved

Dear Valued Customer,

We experienced a brief service interruption earlier today that has now been resolved.

Timeline:
- Issue Started: [HH:MM Local Time]
- Issue Resolved: [HH:MM Local Time]
- Duration: [XX] minutes

Impact:
- [Description of customer impact]
- Your data remains secure and intact

Current Status:
All services are now operating normally.

We sincerely apologize for any inconvenience this may have caused.

If you have any questions or concerns, please contact our support team at support@unifiedhealth.io.

Thank you for your patience and understanding.

Best regards,
UnifiedHealth Team
```

---

## Root Cause Analysis

### Immediate Actions (Within 1 Hour of Rollback)

- [ ] Document timeline of events
- [ ] Collect all relevant logs
- [ ] Capture system state before/after
- [ ] Identify what failed
- [ ] Estimate user impact
- [ ] Preserve evidence for analysis

### Root Cause Analysis Template

```markdown
# Root Cause Analysis - Rollback [YYYY-MM-DD]

## Executive Summary
[2-3 sentence summary of what happened and why]

## Incident Timeline

| Time (UTC) | Event |
|------------|-------|
| [HH:MM] | [Event description] |
| [HH:MM] | [Event description] |

## Impact Assessment

**User Impact:**
- Affected Users: [Number or percentage]
- Duration: [XX] minutes
- Severity: [Critical / High / Medium / Low]

**Business Impact:**
- Revenue Impact: [Estimated $ amount]
- SLA Breach: [Yes / No]
- Customer Complaints: [Number]

**Data Impact:**
- Data Loss: [Yes / No / Description]
- Data Corruption: [Yes / No / Description]

## Root Cause

**Primary Cause:**
[Detailed description of what caused the issue]

**Contributing Factors:**
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## What Went Wrong

**Technical Issues:**
- [Issue 1]
- [Issue 2]

**Process Issues:**
- [Issue 1]
- [Issue 2]

**Testing Gaps:**
- [Gap 1]
- [Gap 2]

## What Went Right

**Positive Aspects:**
- [Success 1]
- [Success 2]

## Lessons Learned

1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]

## Action Items

| Action | Owner | Due Date | Priority | Status |
|--------|-------|----------|----------|--------|
| [Action 1] | [Name] | [Date] | High | Open |
| [Action 2] | [Name] | [Date] | Medium | Open |

## Prevention Measures

**Immediate Actions:**
- [Action 1]
- [Action 2]

**Long-term Improvements:**
- [Improvement 1]
- [Improvement 2]

## Updated Procedures

- [ ] Deployment runbook updated
- [ ] Rollback runbook updated
- [ ] Testing procedures enhanced
- [ ] Monitoring alerts added

## Conclusion

[Summary and commitment to improvement]
```

---

### Post-Mortem Meeting Agenda

**Within 24 Hours of Rollback:**

1. **Review Timeline** (10 minutes)
   - What happened and when
   - Key decision points

2. **Discuss Root Cause** (15 minutes)
   - Technical analysis
   - Contributing factors

3. **Impact Assessment** (10 minutes)
   - User impact
   - Business impact
   - Data impact

4. **What Went Wrong** (15 minutes)
   - Technical issues
   - Process issues
   - Testing gaps

5. **What Went Right** (10 minutes)
   - Successes to build on

6. **Action Items** (20 minutes)
   - Prevention measures
   - Process improvements
   - Testing enhancements

7. **Documentation Updates** (10 minutes)
   - Runbook updates
   - Procedure changes

---

## Appendix

### A. Rollback Decision Matrix

| Issue Severity | Error Rate | Response Time | User Impact | Decision |
|---------------|------------|---------------|-------------|----------|
| Critical | >5% | >1000ms | >50% | IMMEDIATE ROLLBACK |
| High | 1-5% | 500-1000ms | 10-50% | EVALUATE (5 min) |
| Medium | 0.5-1% | 300-500ms | 1-10% | MONITOR (15 min) |
| Low | <0.5% | <300ms | <1% | FIX FORWARD |

### B. Rollback Checklist Summary

**Pre-Rollback:**
- [ ] Issue severity confirmed
- [ ] Rollback method selected
- [ ] Approval obtained
- [ ] Stakeholders notified
- [ ] War room established

**During Rollback:**
- [ ] Rollback steps executed
- [ ] Progress monitored
- [ ] Updates provided
- [ ] Issues documented

**Post-Rollback:**
- [ ] Validation completed
- [ ] Smoke tests passed
- [ ] Stakeholders notified
- [ ] RCA scheduled
- [ ] Documentation updated

### C. Emergency Contacts

[See Go-Live Plan for full contact list]

### D. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-17 | Release Management | Initial version |

---

**Document Classification:** Internal - Restricted
**Review Frequency:** After each rollback event
**Next Review Date:** After next deployment
