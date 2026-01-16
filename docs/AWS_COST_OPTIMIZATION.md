# AWS Cost Optimization Guide - The Unified Health

## Environment Classification

| Environment | Status | Protection Level | Monthly Budget |
|-------------|--------|------------------|----------------|
| **PRODUCTION** | Active | High (deletion protection) | $1,500 |
| **STAGING** | Idle | Medium | $100 |
| **DEV** | Scaled to 0 | Low | $500 |

---

## Current Resource Status (Updated Jan 2, 2026)

### EKS Clusters (4 total)
| Cluster | Environment | Status | Est. Monthly Cost |
|---------|-------------|--------|-------------------|
| `unified-health-prod-eks` | PRODUCTION | Running (2 app + 2 system nodes) | $360 + $72 = $432 |
| `flamoral-prod-eks` | PRODUCTION | Running | ~$422 |
| `broxiva-prod-eks` | PRODUCTION | Running | ~$350 |
| `applyforus-dev` | DEV | **Scaled to 0** | $72 (control plane only) |

### RDS Aurora Clusters (3 total)
| Cluster | Environment | Status | Est. Monthly Cost |
|---------|-------------|--------|-------------------|
| `unified-health-prod-aurora` | PRODUCTION | Available | ~$180-$280 (Serverless v2, min 0.5 ACU) |
| `flamoral-prod-aurora` | PRODUCTION | Available | ~$120 (Serverless v2) |
| `flamoral-staging-aurora` | STAGING | **STOPPED** | $0 |

### ElastiCache Redis (4 total)
| Cluster | Environment | Status | Est. Monthly Cost |
|---------|-------------|--------|-------------------|
| `unified-health-prod-redis` | PRODUCTION | Running | ~$310 (2x r6g.large) |
| `flamoral-prod-redis` | PRODUCTION | Running | ~$310 (2x r6g.large) |
| `flamoral-staging-redis` | STAGING | Running | ~$50 (t3.small) |
| `dev-applyforus` | DEV | Running | ~$15 (t4g.micro) |

---

## Cost Savings Already Implemented

1. **flamoral-staging-aurora** - STOPPED (saves ~$100/mo)
2. **applyforus-dev EKS nodes** - Scaled to 0 (saves ~$200/mo)
3. **Dev budgets** - Already configured with alerts
4. **flamoral-staging-redis** - DELETED with snapshot (saves ~$50/mo)
5. **dev-applyforus Redis** - DELETED with snapshot (saves ~$15/mo)

## Optimizations Implemented (Jan 2, 2026)

1. **unified-health-prod-eks application nodes** - Reduced from 3 to 2 (saves ~$140/mo)
2. **unified-health-prod-aurora** - Reduced min ACU from 2.0 to 0.5 (saves ~$50-100/mo during low traffic)
3. **ElastiCache Redis** - Kept at 2x r6g.large for HIPAA compliance (no change)

**Total estimated monthly savings: ~$205-255/mo**

---

## Recommended Actions

### Immediate Actions (Safe to Execute)

#### 1. Stop Staging Redis (when staging DB is stopped)
```bash
# flamoral-staging-redis is running but the database is stopped
# This costs ~$50/mo for no reason
# Note: ElastiCache cannot be "stopped", only deleted with snapshot

# Create snapshot before deletion
aws elasticache create-snapshot \
  --replication-group-id flamoral-staging-redis \
  --snapshot-name flamoral-staging-redis-backup-$(date +%Y%m%d) \
  --region us-east-1

# Delete the cluster (can be restored from snapshot)
aws elasticache delete-replication-group \
  --replication-group-id flamoral-staging-redis \
  --final-snapshot-identifier flamoral-staging-redis-final \
  --region us-east-1
```

#### 2. Consider Stopping Dev Redis
```bash
# dev-applyforus costs ~$15/mo but nothing is using it
aws elasticache delete-replication-group \
  --replication-group-id dev-applyforus \
  --final-snapshot-identifier dev-applyforus-final \
  --region us-east-1
```

#### 3. Delete Unused EKS Cluster (if confirmed unused)
```bash
# applyforus-dev has 0 nodes but control plane costs $72/mo
# Only delete if the project is abandoned
# aws eks delete-cluster --name applyforus-dev --region us-east-1
```

---

## Production Cost Optimization

### Aurora Serverless v2 Optimization
Current settings for `unified-health-prod-aurora`:
- Min: 2 ACU
- Max: 16 ACU

**Recommendation:** Keep as-is for production. The min of 2 ACU ensures quick response times.

### Redis Optimization Options
Current: 2x cache.r6g.large = ~$310/mo

**Options:**
1. **Reduce to 1 node** (remove replica) - saves ~$155/mo but loses HA
2. **Downsize to r6g.medium** - saves ~$100/mo with same HA
3. **Keep current** - best for production healthcare workload

**Recommendation:** Keep current for HIPAA compliance and HA requirements.

---

## Budget Alerts (Already Configured)

| Budget Name | Limit | Current Spend | Status |
|-------------|-------|---------------|--------|
| dev-compute-budget | $250 | $54.88 | HEALTHY |
| dev-database-budget | $100 | $15.37 | HEALTHY |
| dev-monthly-budget | $500 | $0 | HEALTHY |

---

## Re-Enable Strategy

### Restore Staging Environment
```bash
# 1. Start Aurora cluster
aws rds start-db-cluster \
  --db-cluster-identifier flamoral-staging-aurora \
  --region us-east-1

# 2. Restore Redis from snapshot
aws elasticache create-replication-group \
  --replication-group-id flamoral-staging-redis \
  --replication-group-description "Redis for flamoral staging" \
  --snapshot-name flamoral-staging-redis-final \
  --cache-node-type cache.t3.small \
  --engine redis \
  --region us-east-1
```

### Restore Dev Environment
```bash
# 1. Scale up EKS nodes
aws eks update-nodegroup-config \
  --cluster-name applyforus-dev \
  --nodegroup-name application \
  --scaling-config minSize=1,maxSize=5,desiredSize=2 \
  --region us-east-1

# 2. Restore Redis from snapshot
aws elasticache create-replication-group \
  --replication-group-id dev-applyforus \
  --replication-group-description "ElastiCache Redis for applyforus" \
  --snapshot-name dev-applyforus-final \
  --cache-node-type cache.t4g.micro \
  --engine redis \
  --region us-east-1
```

---

## Monthly Cost Summary

| Category | Production | Staging | Dev | Total |
|----------|------------|---------|-----|-------|
| EKS Control Plane | $216 | - | $72 | $288 |
| EC2 Nodes | $782 | - | $0 | $782 |
| RDS Aurora | $400 | $0 | - | $400 |
| ElastiCache | $620 | $50 | $15 | $685 |
| ELB/VPC/Other | ~$200 | - | - | $200 |
| **Total** | ~$2,218 | ~$50 | ~$87 | **~$2,355/mo** |

### Potential Savings
- Stop staging Redis: **$50/mo**
- Stop dev Redis: **$15/mo**
- Delete dev EKS: **$72/mo**
- **Total potential:** **$137/mo**

---

## CI/CD Cost Control

CodeBuild spike on Jan 1: **$87** (from multiple build attempts)

### Recommendations:
1. Enable build caching in CodeBuild
2. Use `--no-cache` flag sparingly
3. Consolidate build triggers
4. Consider using Spot instances for builds

---

## HIPAA/Compliance Considerations

**DO NOT reduce or stop:**
- unified-health-prod-aurora (patient data)
- unified-health-prod-redis (session data)
- unified-health-prod-eks (production workloads)

**Safe to optimize:**
- Staging environments (when not in active use)
- Dev environments (already optimized)
- CodeBuild (use caching)

---

Last Updated: January 2, 2026
