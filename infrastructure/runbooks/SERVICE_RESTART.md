# Service Restart Runbook

**Document Version:** 1.0
**Last Updated:** 2025-12
**Owner:** Platform Operations Team
**Classification:** Internal

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Restart Checklist](#pre-restart-checklist)
3. [Restart Procedures](#restart-procedures)
4. [Post-Restart Verification](#post-restart-verification)
5. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

This runbook provides procedures for safely restarting services in the UnifiedHealth Platform. Restarts may be needed for:

- Applying configuration changes
- Clearing memory/resource issues
- Recovery from hung states
- Certificate/secret rotation

### When to Use This Runbook

- Scheduled maintenance requiring restarts
- Incident response when restart is appropriate mitigation
- After configuration changes requiring restart
- Memory leak mitigation

### When NOT to Restart

- Underlying infrastructure issue (fix infra first)
- Database connectivity issues (fix database first)
- During active deployments
- If restart loop is occurring (investigate root cause)

---

## Pre-Restart Checklist

### Before Any Restart

- [ ] Verify the service actually needs a restart
- [ ] Check if there's an ongoing incident or deployment
- [ ] Notify the team in `#deployments` Slack channel
- [ ] Verify replica count allows for rolling restart
- [ ] Check for any scheduled appointments/active video calls (telehealth)
- [ ] Have monitoring dashboards open

### Command to Check Current State

```bash
# Get current pod status and replica count
kubectl get pods -n unified-health -l app=<service-name>

# Check if pods are healthy
kubectl describe pods -n unified-health -l app=<service-name> | grep -A 3 "Conditions:"

# Check deployment status
kubectl rollout status deployment/<service-name> -n unified-health

# Check for active connections (if applicable)
kubectl exec -it -n unified-health deploy/<service-name> -- netstat -an | grep ESTABLISHED | wc -l
```

---

## Restart Procedures

### Method 1: Rolling Restart (Preferred - Zero Downtime)

Use for production environments. Pods are restarted one at a time.

```bash
# Rolling restart - restarts pods one by one
kubectl rollout restart deployment/<deployment-name> -n unified-health

# Monitor the rollout
kubectl rollout status deployment/<deployment-name> -n unified-health

# Watch pods restart
kubectl get pods -n unified-health -l app=<service-name> -w
```

**Services and Deployment Names:**

| Service | Deployment Name |
|---------|-----------------|
| API Gateway | api-gateway |
| Auth Service | auth-service |
| Telehealth Service | telehealth-service |
| Notification Service | notification-service |
| Laboratory Service | laboratory-service |
| Pharmacy Service | pharmacy-service |
| Mental Health Service | mental-health-service |
| Chronic Care Service | chronic-care-service |

### Method 2: Scale Down/Up

Use when rolling restart doesn't apply changes or pods are stuck.

```bash
# Scale down to 0
kubectl scale deployment/<deployment-name> -n unified-health --replicas=0

# Wait for termination
kubectl wait --for=delete pod -l app=<service-name> -n unified-health --timeout=60s

# Scale back up
kubectl scale deployment/<deployment-name> -n unified-health --replicas=3

# Monitor
kubectl get pods -n unified-health -l app=<service-name> -w
```

**Warning:** This causes brief downtime. Use only when necessary.

### Method 3: Delete Individual Pod

Use for restarting a specific problematic pod.

```bash
# Identify the problematic pod
kubectl get pods -n unified-health -l app=<service-name>

# Delete the specific pod (will be recreated automatically)
kubectl delete pod <pod-name> -n unified-health

# Verify new pod is created and running
kubectl get pods -n unified-health -l app=<service-name> -w
```

### Method 4: Force Delete (Last Resort)

Use only when pod is stuck in Terminating state for > 5 minutes.

```bash
# Check if pod is stuck terminating
kubectl get pods -n unified-health | grep Terminating

# Force delete (use with caution)
kubectl delete pod <pod-name> -n unified-health --grace-period=0 --force

# Verify
kubectl get pods -n unified-health -l app=<service-name>
```

---

## Service-Specific Procedures

### API Gateway Restart

```bash
# Pre-check: Verify traffic routing
kubectl get endpoints api-gateway -n unified-health

# Rolling restart
kubectl rollout restart deployment/api-gateway -n unified-health

# Monitor
kubectl rollout status deployment/api-gateway -n unified-health

# Verify: Check health endpoint
curl -s https://api.unifiedhealth.io/health | jq
```

### Auth Service Restart

```bash
# Pre-check: Check active sessions (Redis)
kubectl exec -it -n unified-health redis-master-0 -- redis-cli DBSIZE

# Rolling restart
kubectl rollout restart deployment/auth-service -n unified-health

# Monitor
kubectl rollout status deployment/auth-service -n unified-health

# Verify: Test login
curl -X POST https://api.unifiedhealth.io/auth/health
```

**Note:** Active user sessions are stored in Redis and will persist through restart.

### Telehealth Service Restart

**Important:** Check for active video calls before restarting.

```bash
# Pre-check: Query for active visits
kubectl exec -it -n unified-health deploy/telehealth-service -- \
  npx prisma db execute --stdin <<< "SELECT count(*) FROM visits WHERE status = 'in_progress';"

# If active calls exist:
# - Consider scheduling restart for off-peak hours
# - Or proceed with rolling restart (calls will be preserved)

# Rolling restart
kubectl rollout restart deployment/telehealth-service -n unified-health

# Monitor
kubectl rollout status deployment/telehealth-service -n unified-health

# Verify
curl -s https://api.unifiedhealth.io/telehealth/health
```

### Notification Service Restart

```bash
# Pre-check: Check pending notifications queue
kubectl exec -it -n unified-health deploy/notification-service -- \
  npx prisma db execute --stdin <<< "SELECT count(*) FROM notifications WHERE status = 'queued';"

# Rolling restart
kubectl rollout restart deployment/notification-service -n unified-health

# Verify: Queued notifications will resume processing
kubectl logs -n unified-health -l app=notification-service --since=5m | grep "Processing"
```

### Redis Restart

**Warning:** Redis restart will clear in-memory data. Use only if persistent mode is enabled.

```bash
# Check if Redis has persistence enabled
kubectl exec -it -n unified-health redis-master-0 -- redis-cli CONFIG GET appendonly

# Safe restart (if AOF enabled)
kubectl rollout restart statefulset/redis -n unified-health

# Verify data persisted
kubectl exec -it -n unified-health redis-master-0 -- redis-cli DBSIZE
```

---

## Post-Restart Verification

### Step 1: Pod Health Check

```bash
# All pods running
kubectl get pods -n unified-health -l app=<service-name>

# No restarts after initial
kubectl get pods -n unified-health -l app=<service-name> -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].restartCount}{"\n"}{end}'

# Pod logs show normal startup
kubectl logs -n unified-health -l app=<service-name> --since=5m | tail -20
```

### Step 2: Endpoint Health Check

```bash
# Check health endpoint
curl -s https://api.unifiedhealth.io/health | jq

# Check readiness endpoint
curl -s https://api.unifiedhealth.io/ready | jq

# Check specific service health
curl -s https://api.unifiedhealth.io/<service>/health | jq
```

### Step 3: Metrics Check

Open Grafana dashboards and verify:
- Request rate is normal
- Error rate is low/zero
- Response times are normal
- No alerts triggered

### Step 4: Functional Check

```bash
# Run smoke tests
cd tests/smoke
npm run test:production

# Or manual verification of key endpoints
curl -s -X POST https://api.unifiedhealth.io/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' | jq
```

---

## Troubleshooting

### Pod Won't Start

```bash
# Check pod events
kubectl describe pod <pod-name> -n unified-health | tail -30

# Common issues:
# - ImagePullBackOff: Check image name/registry credentials
# - CrashLoopBackOff: Check logs for startup error
# - Pending: Check node resources/scheduling
```

### Pod Keeps Crashing

```bash
# Get crash logs
kubectl logs <pod-name> -n unified-health --previous

# Check container exit code
kubectl describe pod <pod-name> -n unified-health | grep "Exit Code"

# Common exit codes:
# 1 - Application error
# 137 - OOMKilled (out of memory)
# 143 - SIGTERM (graceful shutdown)
```

### Rolling Restart Stuck

```bash
# Check rollout status
kubectl rollout status deployment/<deployment-name> -n unified-health

# Check pod disruption budget
kubectl get pdb -n unified-health

# If stuck, check why pods can't be scheduled
kubectl describe deployment/<deployment-name> -n unified-health
```

### Service Unavailable After Restart

```bash
# Check endpoints
kubectl get endpoints <service-name> -n unified-health

# Check service selector matches pods
kubectl get service <service-name> -n unified-health -o yaml | grep selector -A 5
kubectl get pods -n unified-health --show-labels

# Check ingress
kubectl get ingress -n unified-health
```

### Memory Leak Returns After Restart

If the service crashes again due to memory:

```bash
# Check memory usage over time
kubectl top pods -n unified-health -l app=<service-name>

# Increase memory limits temporarily
kubectl set resources deployment/<deployment-name> -n unified-health \
  --limits=memory=2Gi

# Create ticket to investigate root cause
```

---

## Quick Reference

### Common Commands

```bash
# List all deployments
kubectl get deployments -n unified-health

# Rolling restart all services
for deploy in $(kubectl get deployments -n unified-health -o name); do
  kubectl rollout restart $deploy -n unified-health
done

# Check all pod statuses
kubectl get pods -n unified-health -o wide

# Watch pod events
kubectl get events -n unified-health --sort-by='.lastTimestamp' -w

# Get pod resource usage
kubectl top pods -n unified-health
```

### Service Dependencies

When restarting, consider dependency order:

```
1. Infrastructure (Redis, PostgreSQL) - Rarely restart
2. Auth Service - Core dependency for all services
3. API Gateway - Routes all traffic
4. Individual services (Telehealth, Notification, etc.)
```

---

**Document Classification:** Internal
**Review Frequency:** Semi-annually
**Next Review Date:** 2026-06
