# Incident Runbooks

## Overview

This document contains comprehensive runbooks for responding to the 10 major incident scenarios in the Unified Health platform. Each runbook provides step-by-step guidance for detection, diagnosis, resolution, and post-incident activities.

**Document Version:** 1.0.0
**Last Updated:** 2026-01-05
**Owner:** Platform Operations Team

---

## Table of Contents

1. [Database Connection Failure (Aurora PostgreSQL)](#1-database-connection-failure-aurora-postgresql)
2. [Redis/ElastiCache Outage](#2-rediselasticache-outage)
3. [EKS Node Failure](#3-eks-node-failure)
4. [API Gateway 5xx Errors](#4-api-gateway-5xx-errors)
5. [Authentication Service Down](#5-authentication-service-down)
6. [High Memory/CPU Usage](#6-high-memorycpu-usage)
7. [SSL Certificate Expiration](#7-ssl-certificate-expiration)
8. [DDoS Attack Detection](#8-ddos-attack-detection)
9. [Data Breach Response](#9-data-breach-response)
10. [Deployment Rollback](#10-deployment-rollback)

---

## 1. Database Connection Failure (Aurora PostgreSQL)

### Severity Level
**P0 - Critical**

Complete database connectivity loss affects all platform services and constitutes a major outage.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `DatabaseConnectionFailure` | `pg_up == 0` | Immediate |
| `HighConnectionLatency` | `pg_stat_activity_max_tx_duration > 300s` | 5 minutes |
| `ConnectionPoolExhausted` | `pg_stat_database_numbackends >= max_connections * 0.9` | 2 minutes |
| `ReplicationLagHigh` | `aurora_replica_lag_milliseconds > 1000` | 5 minutes |

**Prometheus Query:**
```promql
# Connection status
pg_up{job="aurora-postgresql"}

# Active connections
pg_stat_database_numbackends{datname="unified_health"}

# Connection pool utilization
sum(pg_pool_connections_active) / sum(pg_pool_connections_total) * 100
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| API Services | Complete failure - all API calls will fail |
| User Authentication | Users cannot log in |
| Appointments | Booking and retrieval fail |
| Billing | Payment processing halted |
| Video Consultations | Session data unavailable |
| Compliance | Audit logging suspended |

**Business Impact:**
- All users affected globally
- Revenue loss: Approximately $X per minute of downtime
- HIPAA compliance risk if audit logging fails

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Verify database connectivity from kubectl
kubectl exec -it $(kubectl get pod -l app=api -o jsonpath='{.items[0].metadata.name}') -- \
  pg_isready -h $DATABASE_HOST -p 5432 -U $DATABASE_USER

# 2. Check Aurora cluster status via AWS CLI
aws rds describe-db-clusters \
  --db-cluster-identifier unified-health-aurora \
  --query 'DBClusters[0].Status'

# 3. Check database instances
aws rds describe-db-instances \
  --filters "Name=db-cluster-id,Values=unified-health-aurora" \
  --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus]'

# 4. Review recent CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBClusterIdentifier,Value=unified-health-aurora \
  --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Maximum
```

#### Phase 2: Identify Root Cause (5-15 minutes)

**Check for common issues:**

```bash
# 1. Check if connections are exhausted
kubectl exec -it api-pod -- psql -c "SELECT count(*) FROM pg_stat_activity;"

# 2. Look for long-running queries
kubectl exec -it api-pod -- psql -c "
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
ORDER BY duration DESC;
"

# 3. Check for locks
kubectl exec -it api-pod -- psql -c "
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
"

# 4. Check security group rules
aws ec2 describe-security-groups \
  --group-ids sg-xxxxxxxxx \
  --query 'SecurityGroups[0].IpPermissions'

# 5. Verify VPC connectivity
aws ec2 describe-vpc-endpoints \
  --filters "Name=vpc-id,Values=vpc-xxxxxxxxx"
```

#### Phase 3: Resolution Actions

**Scenario A: Connection Pool Exhausted**
```bash
# 1. Kill idle connections
kubectl exec -it api-pod -- psql -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < now() - interval '10 minutes';
"

# 2. Restart API pods to reset connection pools
kubectl rollout restart deployment/api-deployment

# 3. Increase connection pool size if needed
kubectl set env deployment/api-deployment DATABASE_POOL_SIZE=50
```

**Scenario B: Aurora Instance Failure**
```bash
# 1. Check failover status
aws rds describe-events \
  --source-identifier unified-health-aurora \
  --source-type db-cluster \
  --duration 60

# 2. Force failover if needed
aws rds failover-db-cluster \
  --db-cluster-identifier unified-health-aurora \
  --target-db-instance-identifier unified-health-aurora-replica

# 3. Update DNS if using custom endpoints
aws route53 change-resource-record-sets \
  --hosted-zone-id ZXXXXXXXXXXXXX \
  --change-batch file://dns-failover.json
```

**Scenario C: Network/Security Group Issue**
```bash
# 1. Verify security group allows traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-database \
  --protocol tcp \
  --port 5432 \
  --source-group sg-eks-nodes

# 2. Check VPC peering connection
aws ec2 describe-vpc-peering-connections \
  --filters "Name=status-code,Values=active"
```

#### Phase 4: Verification (Post-Resolution)

```bash
# 1. Verify database connectivity
kubectl exec -it api-pod -- pg_isready -h $DATABASE_HOST

# 2. Run health check
curl -s https://api.theunifiedhealth.com/health | jq '.database'

# 3. Verify application metrics
kubectl top pods -l app=api

# 4. Check error rates in Prometheus
# Error rate should return to < 0.1%
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-5 min | On-call engineer investigates | PagerDuty auto-page |
| 5-15 min | Escalate to Database Team Lead | @db-team-lead |
| 15-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min | Escalate to CTO | @cto |

**External Escalation:**
- AWS Support (Enterprise): Open severity 1 case
- AWS TAM: Direct contact for P0 incidents

### Post-Incident Actions

1. **Immediate (Within 24 hours):**
   - [ ] Update status page to resolved
   - [ ] Notify affected customers via email
   - [ ] Create incident ticket with timeline
   - [ ] Preserve logs and metrics for analysis

2. **Short-term (Within 72 hours):**
   - [ ] Conduct blameless post-mortem
   - [ ] Document root cause analysis
   - [ ] Identify preventive measures
   - [ ] Update runbook if needed

3. **Long-term (Within 2 weeks):**
   - [ ] Implement preventive measures
   - [ ] Add additional monitoring/alerts
   - [ ] Update disaster recovery plan
   - [ ] Share learnings with team

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Aurora Dashboard | `https://grafana.theunifiedhealth.com/d/aurora-overview` |
| Database Connections | `https://grafana.theunifiedhealth.com/d/db-connections` |
| CloudWatch Logs | `https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/unified-health-aurora` |
| Kibana Logs | `https://kibana.theunifiedhealth.com/app/discover#/?_g=(filters:!(),query:(match_all:()),time:(from:now-1h,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,key:service,negate:!f,type:phrase),query:(match_phrase:(service:database)))),index:'logs-*')` |

---

## 2. Redis/ElastiCache Outage

### Severity Level
**P1 - High**

Redis outage degrades performance significantly and breaks session management but does not cause complete service failure.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `RedisDown` | `redis_up == 0` | Immediate |
| `RedisHighMemory` | `redis_memory_used_bytes / redis_memory_max_bytes > 0.9` | 5 minutes |
| `RedisHighLatency` | `redis_commands_latency_seconds_avg > 0.1` | 5 minutes |
| `RedisReplicationLag` | `redis_replication_lag > 10` | 2 minutes |
| `RedisCacheHitRateLow` | `redis_keyspace_hits / (redis_keyspace_hits + redis_keyspace_misses) < 0.8` | 10 minutes |

**Prometheus Query:**
```promql
# Redis availability
redis_up{job="elasticache"}

# Memory usage
redis_memory_used_bytes / redis_memory_max_bytes * 100

# Command latency
redis_commands_duration_seconds_total / redis_commands_processed_total
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Session Management | Users may be logged out |
| Rate Limiting | May not function correctly |
| Caching | Database load increases significantly |
| Real-time Features | WebSocket state lost |
| API Performance | Response times increase 3-5x |

**Business Impact:**
- Degraded user experience
- Potential security issues with rate limiting down
- Increased database costs due to cache miss

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check ElastiCache cluster status
aws elasticache describe-cache-clusters \
  --cache-cluster-id unified-health-redis \
  --show-cache-node-info

# 2. Check replication group status
aws elasticache describe-replication-groups \
  --replication-group-id unified-health-redis-rg

# 3. Test connectivity from application pod
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST ping

# 4. Check cluster events
aws elasticache describe-events \
  --source-type cache-cluster \
  --duration 60
```

#### Phase 2: Identify Root Cause (5-15 minutes)

```bash
# 1. Check memory usage
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST info memory

# 2. Check for slow commands
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST slowlog get 10

# 3. Check client connections
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST client list | wc -l

# 4. Check cluster health
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST cluster info

# 5. Review CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ElastiCache \
  --metric-name CPUUtilization \
  --dimensions Name=CacheClusterId,Value=unified-health-redis \
  --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Maximum
```

#### Phase 3: Resolution Actions

**Scenario A: Memory Exhaustion**
```bash
# 1. Identify large keys
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST --bigkeys

# 2. Clear expired keys
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST \
  eval "return redis.call('SCAN', 0, 'COUNT', 10000)" 0

# 3. Flush non-critical caches (with caution)
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST \
  eval "local keys = redis.call('keys', 'cache:*'); for i=1,#keys,5000 do redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) end" 0

# 4. Scale up cluster if needed
aws elasticache modify-replication-group \
  --replication-group-id unified-health-redis-rg \
  --cache-node-type cache.r6g.large \
  --apply-immediately
```

**Scenario B: Node Failure**
```bash
# 1. Force failover to replica
aws elasticache modify-replication-group \
  --replication-group-id unified-health-redis-rg \
  --primary-cluster-id unified-health-redis-replica \
  --apply-immediately

# 2. Replace failed node
aws elasticache create-cache-cluster \
  --cache-cluster-id unified-health-redis-new \
  --replication-group-id unified-health-redis-rg \
  --cache-node-type cache.r6g.medium
```

**Scenario C: Network Issue**
```bash
# 1. Check security groups
aws ec2 describe-security-groups \
  --group-ids sg-elasticache \
  --query 'SecurityGroups[0].IpPermissions'

# 2. Verify subnet configuration
aws elasticache describe-cache-subnet-groups \
  --cache-subnet-group-name unified-health-redis-subnet
```

**Application Fallback (Graceful Degradation):**
```bash
# Enable fallback mode in application
kubectl set env deployment/api-deployment REDIS_FALLBACK_MODE=true

# This activates:
# - Database-backed sessions
# - In-memory rate limiting
# - Disabled caching (direct DB queries)
```

#### Phase 4: Verification

```bash
# 1. Verify Redis connectivity
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST ping

# 2. Check replication status
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST info replication

# 3. Verify cache hit rate recovering
kubectl exec -it api-pod -- redis-cli -h $REDIS_HOST info stats | grep keyspace

# 4. Check application health
curl -s https://api.theunifiedhealth.com/health | jq '.redis'
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-5 min | On-call engineer investigates | PagerDuty auto-page |
| 5-15 min | Escalate to Platform Team Lead | @platform-lead |
| 15-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min | AWS Support escalation | Enterprise Support |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Verify all sessions are restored
   - [ ] Check rate limiting is functioning
   - [ ] Monitor cache hit rates

2. **Short-term:**
   - [ ] Review memory usage patterns
   - [ ] Analyze key distribution
   - [ ] Implement key expiration policies

3. **Long-term:**
   - [ ] Consider Redis cluster mode
   - [ ] Implement circuit breakers
   - [ ] Add memory alerts at lower thresholds

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Redis Dashboard | `https://grafana.theunifiedhealth.com/d/redis-overview` |
| ElastiCache Console | `https://console.aws.amazon.com/elasticache/home` |
| Cache Performance | `https://grafana.theunifiedhealth.com/d/cache-perf` |
| Application Logs | `https://kibana.theunifiedhealth.com` (filter: `service:redis`) |

---

## 3. EKS Node Failure

### Severity Level
**P1 - High**

Node failure affects workload scheduling and may cause service degradation depending on replica count and pod distribution.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `NodeNotReady` | `kube_node_status_condition{condition="Ready",status="true"} == 0` | 2 minutes |
| `NodeMemoryPressure` | `kube_node_status_condition{condition="MemoryPressure",status="true"} == 1` | 5 minutes |
| `NodeDiskPressure` | `kube_node_status_condition{condition="DiskPressure",status="true"} == 1` | 5 minutes |
| `PodEvictions` | `increase(kube_pod_container_status_terminated_reason{reason="Evicted"}[5m]) > 5` | Immediate |
| `NodeCountLow` | `count(kube_node_info) < 3` | Immediate |

**Prometheus Query:**
```promql
# Node status
kube_node_status_condition{condition="Ready",status="true"}

# Node resource pressure
kube_node_status_condition{condition=~"MemoryPressure|DiskPressure|PIDPressure",status="true"}

# Pods not running
sum(kube_pod_status_phase{phase!="Running",phase!="Succeeded"})
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Pod Scheduling | New pods may fail to schedule |
| Running Workloads | Pods on failed node terminated |
| Service Availability | Depends on replica distribution |
| Auto-scaling | May be impaired |

**Business Impact:**
- Potential service degradation
- Reduced fault tolerance
- Possible cascading failures if remaining nodes overloaded

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check node status
kubectl get nodes -o wide

# 2. Identify unhealthy nodes
kubectl get nodes -o json | jq '.items[] | select(.status.conditions[] | select(.type=="Ready" and .status!="True")) | .metadata.name'

# 3. Check node conditions
kubectl describe node <node-name> | grep -A 20 "Conditions:"

# 4. Check pods on affected node
kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=<node-name>

# 5. Check EKS node group status
aws eks describe-nodegroup \
  --cluster-name unified-health-cluster \
  --nodegroup-name unified-health-nodegroup
```

#### Phase 2: Identify Root Cause (5-15 minutes)

```bash
# 1. Check node events
kubectl get events --field-selector involvedObject.kind=Node,involvedObject.name=<node-name>

# 2. Check EC2 instance status
aws ec2 describe-instance-status \
  --instance-ids i-xxxxxxxxx

# 3. Check system logs
aws logs get-log-events \
  --log-group-name /aws/eks/unified-health-cluster/cluster \
  --log-stream-name <node-name>

# 4. Check for resource exhaustion
kubectl top node <node-name>

# 5. Check kubelet status (if accessible)
kubectl debug node/<node-name> -it --image=busybox -- journalctl -u kubelet --since "30 minutes ago"
```

#### Phase 3: Resolution Actions

**Scenario A: Temporary Node Issue**
```bash
# 1. Cordon the node (prevent new scheduling)
kubectl cordon <node-name>

# 2. Drain workloads gracefully
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --grace-period=60

# 3. Wait for pods to reschedule
kubectl get pods -o wide --watch

# 4. If node recovers, uncordon
kubectl uncordon <node-name>
```

**Scenario B: Node Needs Replacement**
```bash
# 1. Cordon and drain
kubectl cordon <node-name>
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force

# 2. Terminate EC2 instance (ASG will replace)
aws ec2 terminate-instances --instance-ids i-xxxxxxxxx

# 3. Alternatively, update node group to refresh nodes
aws eks update-nodegroup-config \
  --cluster-name unified-health-cluster \
  --nodegroup-name unified-health-nodegroup \
  --scaling-config minSize=3,maxSize=10,desiredSize=5

# 4. Monitor new node joining
kubectl get nodes --watch
```

**Scenario C: Scale Out to Handle Load**
```bash
# 1. Increase desired capacity
aws eks update-nodegroup-config \
  --cluster-name unified-health-cluster \
  --nodegroup-name unified-health-nodegroup \
  --scaling-config desiredSize=6

# 2. Or use cluster autoscaler annotation
kubectl annotate deployment api-deployment \
  cluster-autoscaler.kubernetes.io/safe-to-evict="false"
```

**Emergency Pod Rescheduling:**
```bash
# Force reschedule critical pods
kubectl delete pod -l app=api --field-selector spec.nodeName=<node-name>

# Verify pods rescheduled
kubectl get pods -l app=api -o wide
```

#### Phase 4: Verification

```bash
# 1. Verify all nodes ready
kubectl get nodes

# 2. Check all pods running
kubectl get pods --all-namespaces | grep -v Running | grep -v Completed

# 3. Verify service endpoints
kubectl get endpoints

# 4. Check application health
for svc in api auth billing; do
  curl -s https://${svc}.theunifiedhealth.com/health
done

# 5. Verify cluster autoscaler
kubectl logs -n kube-system -l app=cluster-autoscaler --tail=50
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-5 min | On-call engineer investigates | PagerDuty auto-page |
| 5-15 min | Escalate to Platform Team | @platform-team |
| 15-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min | AWS Support (if AWS issue) | Enterprise Support |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Verify all services healthy
   - [ ] Check replica distribution across nodes
   - [ ] Monitor cluster capacity

2. **Short-term:**
   - [ ] Review pod anti-affinity rules
   - [ ] Analyze node failure cause
   - [ ] Update node health checks

3. **Long-term:**
   - [ ] Implement pod disruption budgets
   - [ ] Review node group sizing
   - [ ] Consider spot instance strategies

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| EKS Dashboard | `https://grafana.theunifiedhealth.com/d/eks-overview` |
| Node Resources | `https://grafana.theunifiedhealth.com/d/node-resources` |
| Pod Status | `https://grafana.theunifiedhealth.com/d/pod-status` |
| EKS Console | `https://console.aws.amazon.com/eks/home` |
| CloudWatch Container Insights | `https://console.aws.amazon.com/cloudwatch/home#container-insights:` |

---

## 4. API Gateway 5xx Errors

### Severity Level
**P1 - High** (if error rate > 5%)
**P2 - Medium** (if error rate 1-5%)

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `High5xxErrorRate` | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05` | 5 minutes |
| `APILatencyHigh` | `histogram_quantile(0.99, http_request_duration_seconds_bucket) > 2` | 5 minutes |
| `APIGateway5xx` | `aws_apigateway_5xx_error_sum > 100` | 1 minute |
| `UpstreamErrors` | `nginx_upstream_errors_total > 50` | 1 minute |

**Prometheus Query:**
```promql
# Error rate percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# Error breakdown by endpoint
sum by (path, status) (rate(http_requests_total{status=~"5.."}[5m]))

# Latency p99
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| User Requests | Requests failing with errors |
| Mobile Apps | App functionality broken |
| Third-party Integrations | Partner API calls failing |
| Data Consistency | Potential transaction failures |

**Business Impact:**
- Direct user impact
- Potential revenue loss
- Partner SLA violations
- Customer complaints

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check current error rate
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total

# 2. Identify affected endpoints
kubectl logs -l app=api --since=5m | grep -i "error\|500\|502\|503\|504" | head -50

# 3. Check API Gateway metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name 5XXError \
  --dimensions Name=ApiName,Value=unified-health-api \
  --start-time $(date -u -d '15 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Sum

# 4. Check pod status
kubectl get pods -l app=api

# 5. Check recent deployments
kubectl rollout history deployment/api-deployment
```

#### Phase 2: Identify Root Cause (5-15 minutes)

```bash
# 1. Check application logs for stack traces
kubectl logs -l app=api --since=10m | grep -A 10 "Error\|Exception"

# 2. Check upstream service health
for svc in auth database redis; do
  kubectl exec -it api-pod -- curl -s http://${svc}-service/health
done

# 3. Check resource utilization
kubectl top pods -l app=api

# 4. Check for OOMKilled containers
kubectl get pods -l app=api -o json | jq '.items[].status.containerStatuses[] | select(.lastState.terminated.reason=="OOMKilled")'

# 5. Check database connectivity
kubectl exec -it api-pod -- pg_isready -h $DATABASE_HOST

# 6. Review recent changes
git log --oneline -10

# 7. Check ingress controller
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=100
```

#### Phase 3: Resolution Actions

**Scenario A: Application Bug/Exception**
```bash
# 1. If recent deployment caused issue, rollback
kubectl rollout undo deployment/api-deployment

# 2. Verify rollback
kubectl rollout status deployment/api-deployment

# 3. Monitor error rate
watch -n 5 'kubectl exec -it $(kubectl get pod -l app=api -o jsonpath="{.items[0].metadata.name}") -- curl -s localhost:9090/metrics | grep http_requests_total'
```

**Scenario B: Upstream Service Failure**
```bash
# 1. Identify failing upstream
kubectl logs -l app=api --since=5m | grep "connect refused\|timeout\|ECONNREFUSED"

# 2. Check upstream service
kubectl get pods -l app=<upstream-service>
kubectl logs -l app=<upstream-service> --tail=50

# 3. Restart upstream if needed
kubectl rollout restart deployment/<upstream-service>

# 4. If database issue, see Database runbook
# If Redis issue, see Redis runbook
```

**Scenario C: Resource Exhaustion**
```bash
# 1. Scale up replicas
kubectl scale deployment/api-deployment --replicas=10

# 2. Increase resource limits
kubectl set resources deployment/api-deployment \
  --limits=cpu=2000m,memory=2Gi \
  --requests=cpu=500m,memory=512Mi

# 3. Enable horizontal pod autoscaler
kubectl autoscale deployment/api-deployment \
  --min=3 --max=20 --cpu-percent=70
```

**Scenario D: Rate Limiting/DDoS**
```bash
# 1. Check request patterns
kubectl logs -l app=api --since=5m | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# 2. Enable rate limiting
kubectl apply -f k8s/rate-limit-config.yaml

# 3. Block suspicious IPs
kubectl exec -it ingress-controller -- nginx -c "deny 1.2.3.4;"
```

#### Phase 4: Verification

```bash
# 1. Check error rate decreasing
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep 'http_requests_total{.*status="5'

# 2. Test critical endpoints
curl -s -o /dev/null -w "%{http_code}" https://api.theunifiedhealth.com/health
curl -s -o /dev/null -w "%{http_code}" https://api.theunifiedhealth.com/v1/appointments

# 3. Monitor for 15 minutes
# Error rate should stabilize below 0.1%

# 4. Check user-facing impact
# Review customer support tickets
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-5 min | On-call engineer investigates | PagerDuty auto-page |
| 5-15 min | Escalate to API Team Lead | @api-team-lead |
| 15-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min | Executive notification | @cto |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Update status page
   - [ ] Notify affected customers
   - [ ] Document timeline

2. **Short-term:**
   - [ ] Root cause analysis
   - [ ] Fix underlying bug
   - [ ] Improve error handling

3. **Long-term:**
   - [ ] Add circuit breakers
   - [ ] Improve retry logic
   - [ ] Enhanced monitoring

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| API Dashboard | `https://grafana.theunifiedhealth.com/d/api-overview` |
| Error Analysis | `https://grafana.theunifiedhealth.com/d/error-analysis` |
| API Gateway Console | `https://console.aws.amazon.com/apigateway/home` |
| Application Logs | `https://kibana.theunifiedhealth.com` (filter: `level:error`) |

---

## 5. Authentication Service Down

### Severity Level
**P0 - Critical**

Authentication service failure prevents all users from logging in and may affect active sessions.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `AuthServiceDown` | `up{job="auth-service"} == 0` | Immediate |
| `AuthFailureRateHigh` | `rate(auth_login_failures_total[5m]) / rate(auth_login_attempts_total[5m]) > 0.3` | 2 minutes |
| `TokenValidationFailures` | `rate(auth_token_validation_errors[5m]) > 10` | 1 minute |
| `JWTServiceError` | `auth_jwt_errors_total > 0` | Immediate |

**Prometheus Query:**
```promql
# Auth service status
up{job="auth-service"}

# Login success rate
sum(rate(auth_login_success_total[5m])) / sum(rate(auth_login_attempts_total[5m])) * 100

# Token validation errors
rate(auth_token_validation_errors[5m])
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| User Login | No users can authenticate |
| Active Sessions | Existing tokens still valid until expiry |
| API Access | Protected endpoints may fail |
| Mobile Apps | Cannot refresh tokens |
| SSO/OAuth | Third-party auth broken |

**Business Impact:**
- Complete user lockout (new logins)
- Potential security concern
- All user-facing features affected
- Compliance implications

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check auth service pods
kubectl get pods -l app=auth-service

# 2. Check service endpoints
kubectl get endpoints auth-service

# 3. Test auth service directly
kubectl exec -it api-pod -- curl -s http://auth-service/health

# 4. Check auth service logs
kubectl logs -l app=auth-service --tail=100

# 5. Check identity provider status
curl -s https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXX/.well-known/openid-configuration
```

#### Phase 2: Identify Root Cause (5-15 minutes)

```bash
# 1. Check for errors in logs
kubectl logs -l app=auth-service --since=10m | grep -i "error\|exception\|failed"

# 2. Check Cognito/IDP status
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_XXXXXXXX

# 3. Check JWT signing key availability
kubectl get secret jwt-signing-key -o yaml

# 4. Check database connectivity (for user store)
kubectl exec -it auth-pod -- pg_isready -h $AUTH_DATABASE_HOST

# 5. Check Redis (for session store)
kubectl exec -it auth-pod -- redis-cli -h $REDIS_HOST ping

# 6. Verify SSL certificates
kubectl exec -it auth-pod -- openssl s_client -connect cognito-idp.us-east-1.amazonaws.com:443 -brief
```

#### Phase 3: Resolution Actions

**Scenario A: Auth Pod Failure**
```bash
# 1. Restart auth service
kubectl rollout restart deployment/auth-service

# 2. Watch pod startup
kubectl get pods -l app=auth-service --watch

# 3. Scale up if needed
kubectl scale deployment/auth-service --replicas=5

# 4. Check pod events
kubectl describe pod -l app=auth-service
```

**Scenario B: Identity Provider Issue**
```bash
# 1. If Cognito issue, check AWS status
# https://health.aws.amazon.com/

# 2. Enable fallback authentication (if configured)
kubectl set env deployment/auth-service AUTH_FALLBACK_MODE=true

# 3. If using custom IDP, check its health
curl -s https://your-idp.com/.well-known/openid-configuration
```

**Scenario C: JWT/Token Issues**
```bash
# 1. Rotate JWT signing keys
kubectl create secret generic jwt-signing-key \
  --from-file=private.pem=/path/to/new/private.pem \
  --from-file=public.pem=/path/to/new/public.pem \
  --dry-run=client -o yaml | kubectl apply -f -

# 2. Restart auth service to pick up new keys
kubectl rollout restart deployment/auth-service

# 3. Note: This will invalidate existing tokens
```

**Scenario D: Database Connection Issue**
```bash
# 1. Check auth database
kubectl exec -it auth-pod -- psql -h $AUTH_DATABASE_HOST -c "SELECT 1"

# 2. If database is down, see Database runbook
# 3. If connection pool exhausted:
kubectl exec -it auth-pod -- psql -h $AUTH_DATABASE_HOST -c "SELECT count(*) FROM pg_stat_activity"
```

**Emergency: Enable Bypass (Use with extreme caution)**
```bash
# ONLY for P0 emergency with executive approval
# This allows read-only access with reduced security
kubectl set env deployment/api-deployment AUTH_EMERGENCY_BYPASS=true

# Document who approved and when
# Revert as soon as auth is restored
```

#### Phase 4: Verification

```bash
# 1. Test login endpoint
curl -X POST https://api.theunifiedhealth.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# 2. Test token validation
curl -H "Authorization: Bearer $TOKEN" \
  https://api.theunifiedhealth.com/v1/me

# 3. Check auth metrics
kubectl exec -it auth-pod -- curl -s localhost:9090/metrics | grep auth_

# 4. Monitor login success rate
# Should return to > 99%
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0 min | Immediate page to Security + Platform | PagerDuty |
| 5 min | Escalate to Security Team Lead | @security-lead |
| 10 min | Escalate to Engineering Manager | @eng-manager |
| 15 min | Executive notification | @cto, @ciso |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Verify all users can authenticate
   - [ ] Check for unauthorized access during outage
   - [ ] Update status page

2. **Short-term:**
   - [ ] Security audit of authentication logs
   - [ ] Review token policies
   - [ ] Implement auth service redundancy

3. **Long-term:**
   - [ ] Add authentication circuit breaker
   - [ ] Implement graceful degradation
   - [ ] Review IDP redundancy

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Auth Dashboard | `https://grafana.theunifiedhealth.com/d/auth-overview` |
| Login Analytics | `https://grafana.theunifiedhealth.com/d/login-analytics` |
| Cognito Console | `https://console.aws.amazon.com/cognito/home` |
| Security Logs | `https://kibana.theunifiedhealth.com` (filter: `service:auth`) |

---

## 6. High Memory/CPU Usage

### Severity Level
**P2 - Medium** (< 90% sustained)
**P1 - High** (> 90% sustained or OOMKills occurring)

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `HighCPUUsage` | `avg(rate(container_cpu_usage_seconds_total[5m])) by (pod) / avg(kube_pod_container_resource_limits{resource="cpu"}) by (pod) > 0.9` | 10 minutes |
| `HighMemoryUsage` | `container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9` | 5 minutes |
| `OOMKilled` | `increase(kube_pod_container_status_terminated_reason{reason="OOMKilled"}[5m]) > 0` | Immediate |
| `NodeCPUHigh` | `100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90` | 10 minutes |
| `NodeMemoryHigh` | `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9` | 5 minutes |

**Prometheus Query:**
```promql
# Pod CPU usage percentage
sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod, namespace)
/
sum(kube_pod_container_resource_limits{resource="cpu"}) by (pod, namespace) * 100

# Pod memory usage percentage
sum(container_memory_usage_bytes{container!=""}) by (pod, namespace)
/
sum(kube_pod_container_resource_limits{resource="memory"}) by (pod, namespace) * 100

# OOMKills
sum(increase(kube_pod_container_status_terminated_reason{reason="OOMKilled"}[1h])) by (pod)
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Application Performance | Slow response times |
| Pod Stability | Risk of OOMKill/restarts |
| Request Processing | Request queue buildup |
| Scheduling | New pods may not schedule |

**Business Impact:**
- Degraded user experience
- Increased latency
- Potential service instability
- Resource costs increase

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check current resource usage
kubectl top pods --all-namespaces --sort-by=cpu | head -20
kubectl top pods --all-namespaces --sort-by=memory | head -20

# 2. Check node resources
kubectl top nodes

# 3. Identify pods with high usage
kubectl get pods --all-namespaces -o json | jq '.items[] | select(.status.containerStatuses[].restartCount > 3) | .metadata.name'

# 4. Check for OOMKilled pods
kubectl get events --field-selector reason=OOMKilled

# 5. Check HPA status
kubectl get hpa --all-namespaces
```

#### Phase 2: Identify Root Cause (5-15 minutes)

```bash
# 1. Get detailed pod metrics
kubectl describe pod <high-usage-pod>

# 2. Check container processes (CPU)
kubectl exec -it <pod> -- top -b -n 1

# 3. Check memory breakdown
kubectl exec -it <pod> -- cat /proc/meminfo

# 4. Look for memory leaks
kubectl logs <pod> --since=1h | grep -i "memory\|heap\|gc"

# 5. Check for runaway queries (if applicable)
kubectl exec -it <pod> -- ps aux --sort=-%mem | head -10

# 6. Review recent deployments
kubectl rollout history deployment/<deployment>

# 7. Check if traffic spike caused issue
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total
```

#### Phase 3: Resolution Actions

**Scenario A: Memory Leak**
```bash
# 1. Restart affected pods (immediate relief)
kubectl rollout restart deployment/<affected-deployment>

# 2. If leak is in application code, rollback
kubectl rollout undo deployment/<affected-deployment>

# 3. Enable memory profiling for analysis
kubectl set env deployment/<deployment> ENABLE_MEMORY_PROFILING=true

# 4. Collect heap dump before restart (if possible)
kubectl exec -it <pod> -- node --heapsnapshot-signal=SIGUSR2 &
kubectl exec -it <pod> -- kill -SIGUSR2 1
kubectl cp <pod>:/app/Heap.*.heapsnapshot ./heapdump.heapsnapshot
```

**Scenario B: Traffic Spike**
```bash
# 1. Scale horizontally
kubectl scale deployment/<deployment> --replicas=10

# 2. Enable HPA if not already
kubectl autoscale deployment/<deployment> \
  --min=3 --max=20 --cpu-percent=70

# 3. Add memory-based scaling
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: <deployment>-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: <deployment>
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF
```

**Scenario C: Resource Limits Too Low**
```bash
# 1. Increase resource limits
kubectl set resources deployment/<deployment> \
  --limits=cpu=2000m,memory=4Gi \
  --requests=cpu=500m,memory=1Gi

# 2. Verify new limits applied
kubectl describe deployment/<deployment> | grep -A 5 "Limits:"
```

**Scenario D: Inefficient Queries/Operations**
```bash
# 1. Identify slow queries
kubectl exec -it api-pod -- psql -c "
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
"

# 2. Check for missing indexes
kubectl exec -it api-pod -- psql -c "
SELECT relname, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;
"

# 3. Kill expensive queries if needed
kubectl exec -it api-pod -- psql -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 minutes';
"
```

#### Phase 4: Verification

```bash
# 1. Monitor resource usage
watch -n 5 'kubectl top pods -l app=<deployment>'

# 2. Check no more OOMKills
kubectl get events --field-selector reason=OOMKilled --since=10m

# 3. Verify response times normal
curl -w "@curl-format.txt" -o /dev/null -s https://api.theunifiedhealth.com/health

# 4. Check HPA is scaling appropriately
kubectl get hpa <deployment>-hpa --watch
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-10 min | On-call engineer investigates | PagerDuty |
| 10-20 min | Escalate to Platform Team | @platform-team |
| 20-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min | Consider capacity planning review | @cto |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Verify resources stabilized
   - [ ] Document resource patterns
   - [ ] Check for data loss

2. **Short-term:**
   - [ ] Profile application memory usage
   - [ ] Review resource limits
   - [ ] Implement memory leak detection

3. **Long-term:**
   - [ ] Capacity planning review
   - [ ] Implement resource quotas
   - [ ] Add predictive scaling

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Resource Dashboard | `https://grafana.theunifiedhealth.com/d/resource-usage` |
| Node Resources | `https://grafana.theunifiedhealth.com/d/node-resources` |
| Container Insights | `https://console.aws.amazon.com/cloudwatch/home#container-insights:` |
| Application Profiling | `https://grafana.theunifiedhealth.com/d/app-profiling` |

---

## 7. SSL Certificate Expiration

### Severity Level
**P0 - Critical** (if expired)
**P2 - Medium** (if expiring within 7 days)
**P3 - Low** (if expiring within 30 days)

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `SSLCertExpiringSoon` | `ssl_certificate_expiry_seconds < 7 * 24 * 3600` | 7 days |
| `SSLCertExpiringCritical` | `ssl_certificate_expiry_seconds < 24 * 3600` | 24 hours |
| `SSLCertExpired` | `ssl_certificate_expiry_seconds <= 0` | Immediate |
| `ACMCertExpiring` | AWS ACM notification | 45 days |

**Prometheus Query:**
```promql
# Days until expiration
ssl_certificate_expiry_seconds / 86400

# Certificates expiring within 7 days
ssl_certificate_expiry_seconds < 604800

# Check specific domains
ssl_certificate_expiry_seconds{domain=~".*theunifiedhealth.com"}
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| HTTPS Access | Users see security warnings |
| API Calls | TLS handshake failures |
| Mobile Apps | Connection refused |
| Integrations | Partner API calls fail |
| Trust | User confidence degraded |

**Business Impact:**
- Users cannot access platform securely
- Browser warnings damage trust
- Compliance violations (HIPAA requires encryption)
- Complete service unavailability

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check certificate expiration
echo | openssl s_client -servername api.theunifiedhealth.com -connect api.theunifiedhealth.com:443 2>/dev/null | openssl x509 -noout -dates

# 2. Check all domains
for domain in api.theunifiedhealth.com app.theunifiedhealth.com auth.theunifiedhealth.com; do
  echo "=== $domain ==="
  echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates
done

# 3. Check ACM certificates
aws acm list-certificates --query 'CertificateSummaryList[*].[DomainName,CertificateArn]' --output table

# 4. Check certificate details
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx \
  --query 'Certificate.[DomainName,Status,NotAfter]'

# 5. Check Kubernetes TLS secrets
kubectl get secrets --all-namespaces -o json | jq '.items[] | select(.type=="kubernetes.io/tls") | .metadata.name'
```

#### Phase 2: Identify Root Cause (5-10 minutes)

```bash
# 1. Check if ACM auto-renewal failed
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx \
  --query 'Certificate.RenewalSummary'

# 2. Check DNS validation status
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx \
  --query 'Certificate.DomainValidationOptions'

# 3. Check cert-manager status (if using)
kubectl get certificates --all-namespaces
kubectl get certificaterequests --all-namespaces
kubectl describe certificate <cert-name> -n <namespace>

# 4. Check Let's Encrypt rate limits (if applicable)
# https://letsencrypt.org/docs/rate-limits/
```

#### Phase 3: Resolution Actions

**Scenario A: ACM Certificate (AWS-Managed)**
```bash
# 1. If renewal pending validation, verify DNS
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx \
  --query 'Certificate.DomainValidationOptions[*].[DomainName,ValidationStatus,ResourceRecord]'

# 2. Add missing DNS records
aws route53 change-resource-record-sets \
  --hosted-zone-id ZXXXXXXXXXXXXX \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "_xxxxx.theunifiedhealth.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "_xxxxx.acm-validations.aws"}]
      }
    }]
  }'

# 3. Request renewal manually if needed
aws acm renew-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx

# 4. Wait for validation (usually < 30 minutes)
watch -n 30 'aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:123456789:certificate/xxx --query Certificate.Status'
```

**Scenario B: Kubernetes cert-manager**
```bash
# 1. Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager --tail=100

# 2. Delete and recreate certificate request
kubectl delete certificaterequest <request-name> -n <namespace>

# 3. Trigger certificate renewal
kubectl annotate certificate <cert-name> -n <namespace> \
  cert-manager.io/issuer-name-changed-trigger=$(date +%s)

# 4. Check new certificate
kubectl get certificate <cert-name> -n <namespace> -o yaml
```

**Scenario C: Manual Certificate Renewal**
```bash
# 1. Generate new CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout theunifiedhealth.key \
  -out theunifiedhealth.csr \
  -subj "/C=US/ST=State/L=City/O=UnifiedHealth/CN=*.theunifiedhealth.com"

# 2. Submit CSR to CA and obtain certificate

# 3. Create Kubernetes secret
kubectl create secret tls unified-health-tls \
  --cert=theunifiedhealth.crt \
  --key=theunifiedhealth.key \
  --dry-run=client -o yaml | kubectl apply -f -

# 4. Restart ingress controller to pick up new cert
kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx
```

**Scenario D: Emergency - Certificate Already Expired**
```bash
# 1. If ACM, request new certificate immediately
aws acm request-certificate \
  --domain-name "*.theunifiedhealth.com" \
  --validation-method DNS \
  --subject-alternative-names "theunifiedhealth.com"

# 2. Update ALB/CloudFront to use new certificate ARN
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --certificates CertificateArn=arn:aws:acm:...

# 3. Or temporarily disable HTTPS redirect (LAST RESORT)
# This exposes traffic - use only if absolutely necessary
kubectl patch ingress unified-health-ingress -p '{"metadata":{"annotations":{"nginx.ingress.kubernetes.io/ssl-redirect":"false"}}}'
```

#### Phase 4: Verification

```bash
# 1. Verify new certificate
echo | openssl s_client -servername api.theunifiedhealth.com -connect api.theunifiedhealth.com:443 2>/dev/null | openssl x509 -noout -dates -subject

# 2. Check certificate chain
echo | openssl s_client -servername api.theunifiedhealth.com -connect api.theunifiedhealth.com:443 2>/dev/null | openssl x509 -noout -text | grep -A 2 "Issuer:"

# 3. Test HTTPS connectivity
curl -Iv https://api.theunifiedhealth.com/health 2>&1 | grep -E "SSL|subject|expire"

# 4. Verify no browser warnings
# Test in Chrome/Firefox/Safari manually

# 5. Check all endpoints
for domain in api.theunifiedhealth.com app.theunifiedhealth.com; do
  curl -s -o /dev/null -w "%{http_code}" https://$domain/health
done
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| If expired | Immediate escalation | @security-lead, @platform-lead |
| 0-15 min | On-call engineer | PagerDuty |
| 15-30 min | Platform Team Lead | @platform-lead |
| 30+ min | Engineering Manager | @eng-manager |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Verify all certificates renewed
   - [ ] Test all HTTPS endpoints
   - [ ] Clear CDN cache if needed

2. **Short-term:**
   - [ ] Review certificate monitoring
   - [ ] Implement earlier alerting (45+ days)
   - [ ] Document renewal procedures

3. **Long-term:**
   - [ ] Automate certificate renewal
   - [ ] Implement certificate transparency monitoring
   - [ ] Regular certificate audit

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| SSL Dashboard | `https://grafana.theunifiedhealth.com/d/ssl-certificates` |
| ACM Console | `https://console.aws.amazon.com/acm/home` |
| cert-manager Dashboard | `https://grafana.theunifiedhealth.com/d/cert-manager` |
| Certificate Logs | `https://kibana.theunifiedhealth.com` (filter: `certificate`) |

---

## 8. DDoS Attack Detection

### Severity Level
**P0 - Critical**

DDoS attacks can cause complete service unavailability and significant infrastructure costs.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `AnomalousTrafficSpike` | `rate(http_requests_total[1m]) > 10 * avg_over_time(rate(http_requests_total[1m])[1h:1m])` | Immediate |
| `DDoSDetected` | AWS Shield Advanced notification | Immediate |
| `HighErrorRateSpike` | `rate(http_requests_total{status=~"5.."}[1m]) > 1000` | 1 minute |
| `ConnectionFlood` | `sum(nginx_connections_active) > 10000` | 1 minute |
| `WAFBlockedRequests` | `aws_waf_blocked_requests > 1000` | 1 minute |

**Prometheus Query:**
```promql
# Request rate anomaly
rate(http_requests_total[1m]) / avg_over_time(rate(http_requests_total[1m])[1h:1m])

# Requests by IP (top offenders)
topk(10, sum by (client_ip) (rate(http_requests_total[5m])))

# Geographic anomaly
sum by (country) (rate(http_requests_total[5m]))
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Service Availability | Potential complete outage |
| Response Times | Severe degradation |
| Infrastructure Costs | Bandwidth/compute costs spike |
| Legitimate Users | Cannot access service |

**Business Impact:**
- Service unavailable to all users
- Revenue loss during attack
- Potential data exfiltration attempt cover
- Reputation damage

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check current traffic levels
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total

# 2. Identify traffic sources
kubectl logs -l app=ingress-nginx --tail=1000 | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# 3. Check AWS Shield status
aws shield describe-attack --attack-id <attack-id>

# 4. Check WAF blocked requests
aws wafv2 get-sampled-requests \
  --web-acl-arn arn:aws:wafv2:us-east-1:123456789:regional/webacl/unified-health-waf/xxx \
  --rule-metric-name BlockedRequests \
  --scope REGIONAL \
  --time-window StartTime=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ),EndTime=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --max-items 100

# 5. Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name RequestCount \
  --dimensions Name=LoadBalancer,Value=app/unified-health-alb/xxx \
  --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Sum
```

#### Phase 2: Identify Attack Pattern (5-10 minutes)

```bash
# 1. Analyze request patterns
kubectl logs -l app=ingress-nginx --tail=10000 | \
  awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# 2. Identify attacking IPs
kubectl logs -l app=ingress-nginx --tail=10000 | \
  awk '$9 ~ /^[45]/ {print $1}' | sort | uniq -c | sort -rn | head -50

# 3. Check for specific attack vectors
# - HTTP flood
kubectl logs -l app=ingress-nginx --tail=1000 | grep -c "GET / HTTP"

# - Slowloris
kubectl exec -it ingress-pod -- ss -tn | grep ESTABLISHED | wc -l

# - Application layer attack
kubectl logs -l app=api --tail=1000 | grep -i "timeout\|error" | wc -l

# 4. Check geographic distribution
kubectl logs -l app=ingress-nginx --tail=10000 | \
  awk '{print $1}' | xargs -I {} geoiplookup {} | \
  sort | uniq -c | sort -rn | head -20
```

#### Phase 3: Resolution Actions

**Immediate Mitigation:**
```bash
# 1. Enable AWS Shield Advanced response (if subscribed)
aws shield create-protection \
  --name unified-health-protection \
  --resource-arn arn:aws:elasticloadbalancing:...

# 2. Enable WAF rate limiting
aws wafv2 update-web-acl \
  --name unified-health-waf \
  --scope REGIONAL \
  --id xxx \
  --default-action Allow={} \
  --rules file://rate-limit-rule.json \
  --lock-token xxx

# Rate limit rule (rate-limit-rule.json):
{
  "Name": "RateLimit",
  "Priority": 1,
  "Statement": {
    "RateBasedStatement": {
      "Limit": 2000,
      "AggregateKeyType": "IP"
    }
  },
  "Action": {"Block": {}},
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "RateLimit"
  }
}
```

**Block Attacking IPs:**
```bash
# 1. Create IP set for blocking
aws wafv2 create-ip-set \
  --name blocked-ips \
  --scope REGIONAL \
  --ip-address-version IPV4 \
  --addresses "1.2.3.4/32" "5.6.7.8/32"

# 2. Add blocking rule to WAF
aws wafv2 update-web-acl \
  --name unified-health-waf \
  --scope REGIONAL \
  --rules file://block-ip-rule.json
```

**Enable CloudFront/CDN Protection:**
```bash
# 1. Route traffic through CloudFront
# Update DNS to point to CloudFront distribution

# 2. Enable CloudFront WAF
aws cloudfront update-distribution \
  --id EXXXXXXXXXXXXX \
  --distribution-config file://cf-config-with-waf.json
```

**Geographic Blocking (if attack from specific regions):**
```bash
# 1. Add geo-blocking rule to WAF
aws wafv2 update-web-acl \
  --name unified-health-waf \
  --scope REGIONAL \
  --rules file://geo-block-rule.json

# geo-block-rule.json:
{
  "Name": "GeoBlock",
  "Priority": 2,
  "Statement": {
    "GeoMatchStatement": {
      "CountryCodes": ["CN", "RU", "KP"]
    }
  },
  "Action": {"Block": {}},
  "VisibilityConfig": {...}
}
```

**Scale Infrastructure:**
```bash
# 1. Scale application pods
kubectl scale deployment/api-deployment --replicas=20

# 2. Scale ingress controllers
kubectl scale deployment/ingress-nginx-controller --replicas=10

# 3. Increase ALB capacity (request to AWS Support for persistent high capacity)
```

#### Phase 4: Verification

```bash
# 1. Monitor traffic levels
watch -n 5 'kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total'

# 2. Check blocked request rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/WAFV2 \
  --metric-name BlockedRequests \
  --dimensions Name=WebACL,Value=unified-health-waf \
  --start-time $(date -u -d '10 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Sum

# 3. Verify legitimate traffic is passing
curl -w "%{http_code}\n" https://api.theunifiedhealth.com/health

# 4. Check application metrics
kubectl top pods -l app=api
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0 min | Immediate page to Security Team | @security-team |
| 0 min | Notify Engineering Manager | @eng-manager |
| 5 min | Escalate to CISO | @ciso |
| 10 min | Executive notification | @cto, @ceo |
| Ongoing | AWS Shield Response Team | Enterprise Support |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Maintain elevated protection
   - [ ] Document attack vectors
   - [ ] Preserve logs for analysis

2. **Short-term:**
   - [ ] Forensic analysis of attack
   - [ ] Review and improve WAF rules
   - [ ] Update incident response plan

3. **Long-term:**
   - [ ] Consider AWS Shield Advanced
   - [ ] Implement better rate limiting
   - [ ] Add geographic restrictions
   - [ ] Regular DDoS simulation exercises

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Security Dashboard | `https://grafana.theunifiedhealth.com/d/security-overview` |
| WAF Dashboard | `https://grafana.theunifiedhealth.com/d/waf-metrics` |
| AWS Shield Console | `https://console.aws.amazon.com/shield/home` |
| WAF Console | `https://console.aws.amazon.com/wafv2/home` |
| Traffic Analysis | `https://kibana.theunifiedhealth.com` (filter: `type:access-log`) |

---

## 9. Data Breach Response

### Severity Level
**P0 - Critical (Security)**

Data breaches are the highest priority security incidents and require immediate, coordinated response across technical and business teams.

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `UnauthorizedDataAccess` | Unusual data access patterns | Immediate |
| `MassDataExport` | `data_export_volume > 10GB` in 1 hour | Immediate |
| `SuspiciousAPIActivity` | Abnormal API access patterns | 5 minutes |
| `PrivilegeEscalation` | Unauthorized permission changes | Immediate |
| `AWSGuardDutyAlert` | GuardDuty finding severity HIGH | Immediate |
| `CloudTrailAnomaly` | Unusual AWS API activity | Immediate |

**Security Queries:**
```sql
-- Unusual data access
SELECT user_id, COUNT(*) as access_count,
       array_agg(DISTINCT table_name) as tables_accessed
FROM audit_log
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING COUNT(*) > 1000;

-- Large data exports
SELECT * FROM audit_log
WHERE action = 'DATA_EXPORT'
AND data_size_bytes > 100000000
AND timestamp > NOW() - INTERVAL '24 hours';
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Patient Data | PHI/PII potentially exposed |
| Compliance | HIPAA breach notification required |
| Trust | Patient/provider confidence impacted |
| Legal | Potential regulatory fines |
| Business | Reputation damage |

**HIPAA Requirements:**
- Breach affecting 500+ individuals: Notify HHS within 60 days
- Notify affected individuals without unreasonable delay
- Notify media if 500+ individuals in a state affected

### Step-by-Step Resolution

#### Phase 1: Initial Detection and Containment (0-15 minutes)

**CRITICAL: Preserve evidence before taking action**

```bash
# 1. Document current state
date > /tmp/breach-response-$(date +%Y%m%d%H%M%S).log
kubectl get pods --all-namespaces >> /tmp/breach-response-*.log
kubectl get events --all-namespaces >> /tmp/breach-response-*.log

# 2. Identify compromised systems
aws guardduty list-findings \
  --detector-id xxx \
  --finding-criteria '{"Criterion": {"severity": {"Gte": 7}}}' \
  --query 'FindingIds'

# 3. Get finding details
aws guardduty get-findings \
  --detector-id xxx \
  --finding-ids "finding-id"

# 4. Check for unauthorized access
kubectl logs -l app=api --since=1h | grep -i "unauthorized\|forbidden\|authentication failed"

# 5. Review CloudTrail for suspicious activity
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=GetSecretValue \
  --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)
```

**Immediate Containment:**
```bash
# 1. Isolate compromised systems (if identified)
kubectl cordon <compromised-node>
kubectl delete pod <compromised-pod> --grace-period=0 --force

# 2. Revoke compromised credentials
aws iam update-access-key \
  --user-name <compromised-user> \
  --access-key-id <key-id> \
  --status Inactive

# 3. Rotate database credentials
kubectl create secret generic db-credentials \
  --from-literal=password=$(openssl rand -base64 32) \
  --dry-run=client -o yaml | kubectl apply -f -

# 4. Invalidate all user sessions
kubectl exec -it redis-pod -- redis-cli FLUSHDB

# 5. Enable enhanced logging
kubectl set env deployment/api-deployment LOG_LEVEL=debug AUDIT_ALL_REQUESTS=true
```

#### Phase 2: Assessment and Investigation (15 minutes - 2 hours)

**Determine Breach Scope:**
```bash
# 1. Identify affected data
kubectl exec -it api-pod -- psql -c "
SELECT table_name, COUNT(*) as affected_records
FROM audit_log
WHERE user_id = '<suspicious-user>'
AND action IN ('SELECT', 'EXPORT', 'DOWNLOAD')
AND timestamp > '<incident-start-time>'
GROUP BY table_name;
"

# 2. Identify affected patients
kubectl exec -it api-pod -- psql -c "
SELECT DISTINCT patient_id
FROM audit_log
WHERE user_id = '<suspicious-user>'
AND timestamp > '<incident-start-time>'
AND table_name IN ('patients', 'medical_records', 'prescriptions');
"

# 3. Check for data exfiltration
kubectl logs -l app=api --since=24h | grep -E "data.*export|download.*patient|bulk.*request"

# 4. Review network logs
aws logs filter-log-events \
  --log-group-name vpc-flow-logs \
  --filter-pattern "dstPort=443 AND bytes>1000000"

# 5. Check for lateral movement
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=<compromised-user>
```

**Evidence Collection:**
```bash
# 1. Create forensic snapshots
aws ec2 create-snapshot \
  --volume-id vol-xxxxxxxxx \
  --description "Forensic snapshot - breach investigation $(date +%Y%m%d)"

# 2. Export logs
aws logs create-export-task \
  --log-group-name /aws/eks/unified-health-cluster/cluster \
  --from $(date -u -d '7 days ago' +%s)000 \
  --to $(date -u +%s)000 \
  --destination unified-health-forensic-logs \
  --destination-prefix breach-investigation-$(date +%Y%m%d)

# 3. Preserve database audit logs
kubectl exec -it api-pod -- pg_dump -t audit_log > audit_log_backup_$(date +%Y%m%d).sql

# 4. Export CloudTrail logs
aws s3 sync s3://cloudtrail-logs/AWSLogs/ ./cloudtrail-backup/
```

#### Phase 3: Eradication and Recovery (2-24 hours)

**Remove Threat:**
```bash
# 1. Remove compromised accounts
kubectl exec -it api-pod -- psql -c "
UPDATE users SET status = 'suspended', password_hash = NULL
WHERE user_id = '<compromised-user>';
"

# 2. Remove malicious code/backdoors (if found)
kubectl rollout undo deployment/api-deployment --to-revision=<known-good>

# 3. Rotate all secrets
./scripts/rotate-all-secrets.sh

# 4. Update security groups
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# 5. Enable additional security controls
aws guardduty update-detector \
  --detector-id xxx \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES
```

**System Recovery:**
```bash
# 1. Deploy clean images
kubectl set image deployment/api-deployment api=unified-health/api:verified-clean-$(date +%Y%m%d)

# 2. Restore from verified backup if needed
./scripts/restore-database.sh --backup-id verified-clean-backup

# 3. Re-enable services gradually
kubectl scale deployment/api-deployment --replicas=1
# Monitor for 15 minutes
kubectl scale deployment/api-deployment --replicas=5

# 4. Enable enhanced monitoring
kubectl apply -f k8s/security/enhanced-monitoring.yaml
```

#### Phase 4: Notification and Compliance (24-72 hours)

**Internal Notification:**
```markdown
Notify in order:
1. CISO - Immediate
2. CTO - Within 15 minutes
3. CEO - Within 30 minutes
4. Legal Counsel - Within 1 hour
5. PR/Communications - Within 2 hours
6. Board of Directors - Within 24 hours (if material)
```

**Regulatory Notification:**
```markdown
HIPAA Requirements:
- [ ] Notify HHS Secretary (within 60 days for 500+ individuals)
- [ ] Notify affected individuals (without unreasonable delay)
- [ ] Notify media (if 500+ in single state/jurisdiction)
- [ ] Document breach in breach log

HHS Breach Portal: https://ocrportal.hhs.gov/ocr/breach/wizard_breach.jsf

State Requirements:
- Review state-specific breach notification laws
- Some states require notification within 30-45 days
```

**Patient Notification Template:**
```markdown
Subject: Important Security Notice from UnifiedHealth

Dear [Patient Name],

We are writing to inform you of a security incident that may have affected your personal health information...

[Include: What happened, what information was involved, what we are doing,
what you can do, contact information for questions]

We are offering [X] months of free credit monitoring...

Sincerely,
[Privacy Officer]
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0 min | Security Team Lead | @security-lead |
| 5 min | CISO | @ciso |
| 15 min | CTO | @cto |
| 30 min | CEO | @ceo |
| 1 hour | Legal Counsel | @legal |
| 2 hours | External Forensics (if needed) | Contracted IR firm |

### Post-Incident Actions

1. **Immediate (0-72 hours):**
   - [ ] Contain and eradicate threat
   - [ ] Preserve all evidence
   - [ ] Notify internal stakeholders
   - [ ] Engage legal counsel
   - [ ] Begin regulatory notifications

2. **Short-term (1-4 weeks):**
   - [ ] Complete forensic investigation
   - [ ] Implement emergency security controls
   - [ ] Complete all notifications
   - [ ] Offer credit monitoring to affected individuals
   - [ ] Prepare for regulatory inquiries

3. **Long-term (1-6 months):**
   - [ ] Comprehensive security review
   - [ ] Implement additional controls
   - [ ] Staff security training
   - [ ] Update incident response plan
   - [ ] Third-party security audit

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Security Dashboard | `https://grafana.theunifiedhealth.com/d/security-overview` |
| GuardDuty Console | `https://console.aws.amazon.com/guardduty/home` |
| CloudTrail Console | `https://console.aws.amazon.com/cloudtrail/home` |
| Audit Logs | `https://kibana.theunifiedhealth.com` (filter: `type:audit`) |
| SIEM | `https://siem.theunifiedhealth.com` |

### Important Contacts

| Role | Contact | When to Notify |
|------|---------|----------------|
| Security Team | security@theunifiedhealth.com | Immediately |
| Privacy Officer | privacy@theunifiedhealth.com | Within 1 hour |
| Legal Counsel | legal@theunifiedhealth.com | Within 1 hour |
| External Forensics | [IR Firm Contact] | If needed |
| HHS OCR | ocrmail@hhs.gov | As required |
| Cyber Insurance | [Insurance Contact] | Within 24 hours |

---

## 10. Deployment Rollback

### Severity Level
**P1 - High** (if deployment caused outage)
**P2 - Medium** (if deployment caused degradation)

### Detection Method (Alerts)

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| `DeploymentFailed` | Deployment rollout failed | Immediate |
| `ErrorRateSpikePostDeploy` | Error rate increase > 5x after deployment | 5 minutes |
| `LatencySpike` | p99 latency increase > 3x after deployment | 5 minutes |
| `PodCrashLoop` | Pod restart count > 5 in 10 minutes | 10 minutes |
| `HealthCheckFailures` | Readiness probe failures | 2 minutes |

**Prometheus Query:**
```promql
# Error rate change after deployment
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total{status=~"5.."}[5m] offset 1h))

# Deployment status
kube_deployment_status_replicas_ready / kube_deployment_status_replicas_desired

# Pod restart rate
sum(increase(kube_pod_container_status_restarts_total[10m])) by (pod)
```

### Impact Assessment

| Component | Impact |
|-----------|--------|
| Service Availability | Depends on failure mode |
| User Experience | Degraded or broken features |
| Data Integrity | Risk of data corruption |
| Business Operations | Potential revenue impact |

**Business Impact:**
- Service degradation or outage
- User frustration and complaints
- Potential data issues
- Time and resources for recovery

### Step-by-Step Resolution

#### Phase 1: Initial Assessment (0-5 minutes)

```bash
# 1. Check deployment status
kubectl rollout status deployment/api-deployment

# 2. Check pod status
kubectl get pods -l app=api

# 3. Check recent deployment history
kubectl rollout history deployment/api-deployment

# 4. Check pod events
kubectl describe pods -l app=api | grep -A 10 "Events:"

# 5. Check application logs
kubectl logs -l app=api --tail=100 | grep -i "error\|exception\|fatal"

# 6. Check error rates
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total
```

#### Phase 2: Decide on Rollback (5-10 minutes)

**Rollback Criteria - Roll back immediately if:**
- [ ] Service is completely down
- [ ] Error rate > 10%
- [ ] Critical functionality broken
- [ ] Data corruption occurring
- [ ] Security vulnerability introduced

**Proceed with caution if:**
- [ ] Error rate 1-10%
- [ ] Performance degraded but functional
- [ ] Non-critical features affected

```bash
# 1. Compare current vs previous version metrics
# Current version
kubectl exec -it api-pod -- curl -s localhost:9090/metrics | grep http_requests_total

# 2. Check if issue is widespread or isolated
kubectl logs -l app=api --tail=500 | grep -c "error"

# 3. Quick test of critical endpoints
curl -s -o /dev/null -w "%{http_code}" https://api.theunifiedhealth.com/health
curl -s -o /dev/null -w "%{http_code}" https://api.theunifiedhealth.com/v1/appointments
curl -s -o /dev/null -w "%{http_code}" https://api.theunifiedhealth.com/v1/auth/login
```

#### Phase 3: Execute Rollback

**Standard Rollback (Kubernetes):**
```bash
# 1. Rollback to previous revision
kubectl rollout undo deployment/api-deployment

# 2. Monitor rollback progress
kubectl rollout status deployment/api-deployment --watch

# 3. Verify pods are running
kubectl get pods -l app=api

# 4. Verify rollback successful
kubectl describe deployment/api-deployment | grep Image
```

**Rollback to Specific Version:**
```bash
# 1. List deployment history
kubectl rollout history deployment/api-deployment

# 2. Get details of specific revision
kubectl rollout history deployment/api-deployment --revision=3

# 3. Rollback to specific revision
kubectl rollout undo deployment/api-deployment --to-revision=3

# 4. Monitor
kubectl rollout status deployment/api-deployment
```

**Database Migration Rollback (if applicable):**
```bash
# 1. Check current migration version
kubectl exec -it api-pod -- pnpm db:version

# 2. Rollback database migration
kubectl exec -it api-pod -- pnpm db:rollback

# 3. Verify migration rolled back
kubectl exec -it api-pod -- pnpm db:version

# Note: Some migrations may not be reversible
# Check migration scripts before rolling back
```

**Blue-Green Deployment Rollback:**
```bash
# 1. Switch traffic back to blue environment
kubectl patch service api-service -p '{"spec":{"selector":{"version":"blue"}}}'

# 2. Verify traffic routing
kubectl get service api-service -o yaml | grep version

# 3. Scale down green environment
kubectl scale deployment/api-deployment-green --replicas=0
```

**Canary Deployment Rollback:**
```bash
# 1. Remove canary deployment
kubectl delete deployment/api-deployment-canary

# 2. Update ingress to remove canary routing
kubectl annotate ingress unified-health-ingress \
  nginx.ingress.kubernetes.io/canary- \
  nginx.ingress.kubernetes.io/canary-weight-

# 3. Verify all traffic going to stable
kubectl get ingress unified-health-ingress -o yaml
```

**Feature Flag Rollback:**
```bash
# 1. Disable problematic feature flag
kubectl exec -it api-pod -- curl -X POST http://localhost:3000/admin/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"feature":"new-checkout-flow","enabled":false}'

# 2. Clear feature flag cache
kubectl exec -it redis-pod -- redis-cli DEL "feature:new-checkout-flow"

# 3. Verify feature disabled
curl -s https://api.theunifiedhealth.com/v1/features | jq '.features'
```

#### Phase 4: Verification

```bash
# 1. Verify correct version deployed
kubectl describe deployment/api-deployment | grep Image

# 2. Check all pods healthy
kubectl get pods -l app=api

# 3. Run health checks
curl -s https://api.theunifiedhealth.com/health | jq

# 4. Test critical endpoints
for endpoint in /health /v1/appointments /v1/patients; do
  echo "Testing $endpoint"
  curl -s -o /dev/null -w "%{http_code}\n" https://api.theunifiedhealth.com$endpoint
done

# 5. Check error rate decreasing
watch -n 10 'kubectl exec -it $(kubectl get pod -l app=api -o jsonpath="{.items[0].metadata.name}") -- curl -s localhost:9090/metrics | grep http_requests_total | grep status=\"5'

# 6. Monitor for 30 minutes
# Ensure stability before closing incident

# 7. Check business metrics
# Verify appointments, logins, payments working
```

### Escalation Path

| Time | Action | Contact |
|------|--------|---------|
| 0-5 min | On-call engineer executes rollback | PagerDuty |
| 5-15 min | Notify Team Lead | @team-lead |
| 15-30 min | Escalate to Engineering Manager | @eng-manager |
| 30+ min (if rollback fails) | Escalate to CTO | @cto |

### Post-Incident Actions

1. **Immediate:**
   - [ ] Confirm rollback successful
   - [ ] Update status page
   - [ ] Notify team of rollback
   - [ ] Document what was rolled back

2. **Short-term (within 24 hours):**
   - [ ] Root cause analysis
   - [ ] Fix issues in development
   - [ ] Add tests to prevent regression
   - [ ] Update deployment checklist

3. **Long-term:**
   - [ ] Improve CI/CD pipeline
   - [ ] Add more automated testing
   - [ ] Improve canary deployment process
   - [ ] Review deployment procedures

### Deployment Checklist (Prevention)

Before deploying:
- [ ] All tests passing in CI
- [ ] Code review approved
- [ ] Staging environment tested
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Feature flags configured
- [ ] Monitoring dashboards ready
- [ ] On-call engineer aware

### Related Dashboards/Logs

| Resource | URL |
|----------|-----|
| Deployment Dashboard | `https://grafana.theunifiedhealth.com/d/deployments` |
| CI/CD Pipeline | `https://github.com/unified-health/platform/actions` |
| ArgoCD | `https://argocd.theunifiedhealth.com` |
| Application Logs | `https://kibana.theunifiedhealth.com` |
| Error Tracking | `https://sentry.theunifiedhealth.com` |

---

## Appendix A: Quick Reference Commands

### Kubernetes Quick Commands

```bash
# Pod status
kubectl get pods -l app=<service>

# Recent logs
kubectl logs -l app=<service> --tail=100

# Describe resources
kubectl describe deployment/<deployment>

# Rollback
kubectl rollout undo deployment/<deployment>

# Scale
kubectl scale deployment/<deployment> --replicas=<n>

# Restart
kubectl rollout restart deployment/<deployment>

# Exec into pod
kubectl exec -it <pod> -- /bin/sh
```

### AWS Quick Commands

```bash
# RDS status
aws rds describe-db-instances --db-instance-identifier <instance>

# ElastiCache status
aws elasticache describe-cache-clusters --cache-cluster-id <cluster>

# EKS cluster
aws eks describe-cluster --name <cluster>

# CloudWatch metrics
aws cloudwatch get-metric-statistics --namespace <namespace> --metric-name <metric> ...
```

### Health Check URLs

| Service | Health Check URL |
|---------|------------------|
| API Gateway | `https://api.theunifiedhealth.com/health` |
| Auth Service | `https://auth.theunifiedhealth.com/health` |
| Billing Service | `https://billing.theunifiedhealth.com/health` |
| Video Service | `https://video.theunifiedhealth.com/health` |

---

## Appendix B: Contact Information

### On-Call Rotation

| Team | PagerDuty Service | Slack Channel |
|------|-------------------|---------------|
| Platform | platform-oncall | #platform-ops |
| Security | security-oncall | #security-alerts |
| Database | database-oncall | #database-ops |
| API | api-oncall | #api-ops |

### External Contacts

| Service | Contact | SLA |
|---------|---------|-----|
| AWS Enterprise Support | AWS Console | 15 min (Critical) |
| Datadog Support | support@datadoghq.com | 1 hour |
| PagerDuty Support | support@pagerduty.com | 4 hours |

### Vendor Status Pages

| Vendor | Status Page |
|--------|-------------|
| AWS | https://status.aws.amazon.com |
| Datadog | https://status.datadoghq.com |
| PagerDuty | https://status.pagerduty.com |
| Stripe | https://status.stripe.com |
| Twilio | https://status.twilio.com |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-05 | Platform Team | Initial release |

---

**Review Schedule:** Quarterly
**Next Review:** 2026-04-05
**Owner:** Platform Operations Team
