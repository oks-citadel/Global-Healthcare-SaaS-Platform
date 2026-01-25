# Rollback Runbook

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **Severity:** Critical Operations Document

## Rollback Decision Matrix

| Symptom | Severity | Action | Rollback Type |
|---------|----------|--------|---------------|
| 5xx errors > 10% for 5 min | Critical | Immediate rollback | Full |
| API latency P95 > 5s for 10 min | High | Rollback if not improving | Backend |
| Auth failures > 5% | Critical | Immediate rollback | Auth service |
| Database connection errors | Critical | Immediate rollback | Backend |
| Payment processing failure | Critical | Immediate rollback | API |
| UI rendering broken | High | Rollback frontend | Frontend |
| Feature regression | Medium | Targeted rollback | Specific service |

## Quick Reference Commands

### Emergency Rollback (< 2 minutes)

```bash
# Vercel - Instant rollback to previous
vercel rollback --yes

# Railway - Rollback all services
railway rollback --all

# DNS - If needed (update in GoDaddy)
# Restore old A/CNAME records from backup
```

---

## 1. Vercel Frontend Rollback

### Option A: Dashboard Rollback (Recommended)

1. Go to https://vercel.com/dashboard
2. Select the affected project
3. Click "Deployments" tab
4. Find the last known good deployment
5. Click "..." menu → "Promote to Production"
6. Confirm promotion

**Expected Time:** < 30 seconds

### Option B: CLI Rollback

```bash
# List recent deployments
vercel ls

# Output example:
# Age     Status   Duration  URL
# 2m      Ready    45s       app-abc123.vercel.app
# 1h      Ready    42s       app-def456.vercel.app  ← Last known good
# 2h      Ready    44s       app-ghi789.vercel.app

# Rollback to specific deployment
vercel rollback app-def456.vercel.app

# Or rollback to previous (most recent working)
vercel rollback
```

### Option C: Git Revert Rollback

```bash
# Identify the bad commit
git log --oneline -10

# Revert the bad commit
git revert <bad-commit-sha>

# Push to trigger new deployment
git push origin main
```

**Note:** This creates a new deployment, not an instant rollback.

### Verify Vercel Rollback

```bash
# Check deployment status
vercel ls --limit 3

# Verify site is up
curl -I https://app.yourdomain.com

# Test critical paths
curl -s https://app.yourdomain.com | grep -q "<!DOCTYPE html>" && echo "OK" || echo "FAIL"
```

---

## 2. Railway Backend Rollback

### Option A: Dashboard Rollback (Recommended)

1. Go to https://railway.app/dashboard
2. Select project → Select service
3. Click "Deployments" tab
4. Find last known good deployment
5. Click "..." → "Redeploy"

**Expected Time:** 1-3 minutes per service

### Option B: CLI Rollback

```bash
# Link to project
railway link

# List deployments for a service
railway deployments --service api-gateway

# Rollback specific service
railway rollback --service api-gateway

# Rollback all services
railway rollback --all
```

### Option C: Rollback Specific Services

**Priority Order:**
1. API Gateway (affects all traffic)
2. Auth Service (affects authentication)
3. Core API (affects data operations)
4. Other services (as needed)

```bash
# Rollback in priority order
railway rollback --service api-gateway
railway rollback --service auth-service
railway rollback --service api
```

### Verify Railway Rollback

```bash
# Check service health
curl -s https://api.yourdomain.com/health | jq .

# Expected output:
# {
#   "status": "healthy",
#   "timestamp": "2026-01-24T12:00:00.000Z",
#   "version": "1.0.0"
# }

# Check all services
for service in api-gateway auth-service api notification-service; do
  echo "Checking $service..."
  railway run --service $service curl -s localhost:$PORT/health
done
```

---

## 3. Database Rollback

### Warning: Database Changes Are Critical

> **DANGER:** Database rollbacks can cause data loss. Always prefer
> application-level rollbacks first.

### Scenario A: Bad Migration (Schema Change)

```bash
# Connect to Railway PostgreSQL
railway connect postgres

# Check migration history
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;

# If using Prisma, rollback migration
cd services/api
railway run pnpm prisma migrate resolve --rolled-back <migration-name>
```

### Scenario B: Bad Data Change

```bash
# If data was incorrectly modified, restore from backup

# Option 1: Point-in-Time Recovery (Railway)
# Contact Railway support for PITR within retention window

# Option 2: Restore from backup
# 1. Create new database instance
# 2. Restore backup to new instance
# 3. Verify data integrity
# 4. Switch connection strings
```

### Scenario C: Database Unreachable

```bash
# Check Railway PostgreSQL status
railway status

# If database is down, Railway will auto-restart
# If persistent issue, scale database or contact support

# Verify connectivity
railway run psql $DATABASE_URL -c "SELECT 1"
```

---

## 4. DNS Rollback

### When to Rollback DNS

- New infrastructure completely unreachable
- SSL certificate issues
- Routing to wrong endpoints

### DNS Rollback Procedure

**GoDaddy Dashboard:**

1. Log into GoDaddy: https://dcc.godaddy.com/
2. Go to DNS Management
3. Restore records from backup (see dns-cutover.md)

**Records to Restore:**

| Record | Rollback Value |
|--------|----------------|
| `@` A | `<old-ip>` |
| `app` CNAME | `<old-target>` |
| `api` CNAME | `<old-target>` |

### Verify DNS Rollback

```bash
# Check propagation (may take 5-30 minutes with 300s TTL)
watch -n 30 'dig +short yourdomain.com'

# Once propagated, verify endpoints
curl -I https://yourdomain.com
curl -I https://api.yourdomain.com/health
```

---

## 5. Full System Rollback

### When to Execute Full Rollback

- Complete system failure
- Multiple services compromised
- Security incident
- Data integrity concerns

### Full Rollback Checklist

```
□ STEP 1: Notify team (Slack: #incidents)
□ STEP 2: Rollback Vercel frontend
□ STEP 3: Rollback Railway services (priority order)
□ STEP 4: Verify all health endpoints
□ STEP 5: If needed, rollback DNS
□ STEP 6: Verify user-facing functionality
□ STEP 7: Document incident
□ STEP 8: Post-mortem scheduling
```

### Full Rollback Script

```bash
#!/bin/bash
# emergency-rollback.sh
# Usage: ./emergency-rollback.sh

set -e

echo "⚠️  EMERGENCY ROLLBACK INITIATED"
echo "================================"
echo ""

# Confirm
read -p "Are you sure you want to rollback all services? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Rollback cancelled."
    exit 1
fi

echo ""
echo "Step 1: Rolling back Vercel frontend..."
vercel rollback --yes || echo "Vercel rollback failed, continuing..."

echo ""
echo "Step 2: Rolling back Railway services..."
railway rollback --service api-gateway || true
railway rollback --service auth-service || true
railway rollback --service api || true
railway rollback --service notification-service || true
railway rollback --service telehealth-service || true

echo ""
echo "Step 3: Verifying health endpoints..."
sleep 30  # Wait for services to stabilize

endpoints=(
    "https://app.yourdomain.com"
    "https://api.yourdomain.com/health"
)

for endpoint in "${endpoints[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    if [ "$status" -eq 200 ]; then
        echo "✅ $endpoint - OK"
    else
        echo "❌ $endpoint - FAILED ($status)"
    fi
done

echo ""
echo "================================"
echo "Rollback complete. Please verify manually."
echo "If issues persist, escalate to on-call."
```

---

## 6. Partial Rollback Scenarios

### Scenario: Only Frontend Broken

```bash
# Symptoms: UI errors, white screen, React errors

# Rollback frontend only
vercel rollback

# Backend stays on current version
# No Railway changes needed
```

### Scenario: Only Auth Service Broken

```bash
# Symptoms: Login failures, 401 errors

# Rollback auth service only
railway rollback --service auth-service

# Restart dependent services to clear connections
railway restart --service api-gateway
railway restart --service api
```

### Scenario: Only API Service Broken

```bash
# Symptoms: 500 errors, data not saving

# Rollback API service
railway rollback --service api

# Other services continue working
```

### Scenario: Database Migration Issue

```bash
# Symptoms: Schema errors, missing columns

# DO NOT rollback application yet

# 1. Check migration status
railway run --service api npx prisma migrate status

# 2. If failed migration, resolve it
railway run --service api npx prisma migrate resolve --rolled-back <name>

# 3. If data corruption, restore from backup
# (Contact Railway support or use manual backup)
```

---

## 7. Rollback Verification Checklist

After any rollback, verify these items:

### Frontend Verification

```bash
□ Homepage loads: curl -I https://app.yourdomain.com
□ Static assets load: Check browser console for 404s
□ JavaScript executes: Test interactive elements
□ API calls work: Network tab shows 200 responses
□ Authentication works: Can log in
□ Critical flows work: Complete main user journeys
```

### Backend Verification

```bash
□ Health endpoints respond:
  curl https://api.yourdomain.com/health

□ Database connectivity:
  railway run --service api node -e "require('./src/lib/prisma').prisma.\$queryRaw\`SELECT 1\`"

□ Redis connectivity:
  railway run --service api node -e "require('./src/lib/redis').redis.ping()"

□ Auth tokens work:
  # Login and verify JWT is issued

□ API responses correct:
  curl https://api.yourdomain.com/api/v1/health
```

### Critical Path Testing

```bash
# Run smoke tests
./scripts/smoke-tests.sh

# Or manual testing:
□ User can sign up
□ User can log in
□ User can view dashboard
□ User can perform core action (e.g., book appointment)
□ User can make payment (if applicable)
□ User can log out
```

---

## 8. Post-Rollback Procedures

### Immediate Actions (< 1 hour)

1. **Notify stakeholders:**
   ```
   Subject: Service Rollback Completed - [Incident ID]

   The following services were rolled back at [TIME] UTC:
   - [Service list]

   Root cause investigation is ongoing.
   Current status: Stable

   Next update in 30 minutes.
   ```

2. **Preserve evidence:**
   ```bash
   # Save logs from bad deployment
   railway logs --service api --since 2h > incident-logs-api.txt
   vercel logs --since 2h > incident-logs-frontend.txt
   ```

3. **Create incident ticket:**
   - Title: `[INCIDENT] Rollback required - <description>`
   - Severity: P1/P2
   - Timeline of events
   - Services affected
   - Users impacted

### Follow-up Actions (< 24 hours)

1. **Root cause analysis:**
   - Review deployment diff
   - Check for configuration issues
   - Review test coverage

2. **Fix and validate:**
   - Create hotfix branch
   - Add tests for failure scenario
   - Review in staging first

3. **Schedule post-mortem:**
   - Within 48 hours of incident
   - Include all involved parties
   - Document action items

---

## 9. Emergency Contacts

| Role | Contact | When to Escalate |
|------|---------|------------------|
| On-Call Engineer | PagerDuty rotation | First contact |
| Platform Lead | @platform-lead (Slack) | Any P1 incident |
| Engineering Manager | @eng-manager (Slack) | Extended outage > 30 min |
| Security Team | security@company.com | Data breach suspected |
| Vercel Support | support.vercel.com | Platform issues |
| Railway Support | railway.app/help | Platform issues |

### Escalation Timeline

| Duration | Action |
|----------|--------|
| 0-5 min | On-call engineer responds |
| 5-15 min | Begin rollback if needed |
| 15-30 min | Escalate to Platform Lead |
| 30-60 min | Escalate to Engineering Manager |
| 60+ min | Executive notification |

---

## 10. Rollback Testing

### Monthly Rollback Drill

```bash
# Schedule: First Tuesday of each month, staging environment

# 1. Deploy known good version to staging
# 2. Deploy "bad" version (intentionally broken)
# 3. Detect issue (monitoring/alerts)
# 4. Execute rollback
# 5. Verify recovery
# 6. Document timing and issues
```

### Rollback Drill Checklist

```
□ Drill scheduled and announced
□ Staging environment prepared
□ "Bad" deployment ready
□ Monitoring active
□ Team available
□ Execute rollback
□ Verify recovery
□ Document results
□ Update procedures if needed
```
