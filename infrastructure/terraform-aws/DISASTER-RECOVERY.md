# AWS Disaster Recovery Plan

## RTO/RPO Definitions

| Metric | Target | Description |
|--------|--------|-------------|
| **RTO (Recovery Time Objective)** | 4 hours | Maximum acceptable downtime |
| **RPO (Recovery Point Objective)** | 1 hour | Maximum acceptable data loss |

### Tiered Recovery Objectives

| Tier | Systems | RTO | RPO |
|------|---------|-----|-----|
| Tier 1 (Critical) | API Gateway, Auth Service, Patient Service | 1 hour | 15 min |
| Tier 2 (Important) | Appointment, Billing, Telehealth | 2 hours | 30 min |
| Tier 3 (Standard) | Analytics, Reporting, Admin Portal | 4 hours | 1 hour |

## Backup Procedures

### Aurora PostgreSQL

**Automated Backups**:
- Retention: 35 days
- Window: Daily at 03:00-05:00 UTC
- Type: Continuous with point-in-time recovery (PITR)

**Manual Snapshots**:
- Frequency: Before major deployments
- Retention: 90 days
- Cross-region copy: Enabled to secondary region

**Backup Verification**:
```bash
# List available snapshots
aws rds describe-db-cluster-snapshots \
  --db-cluster-identifier unified-health-prod-americas-aurora

# Verify PITR window
aws rds describe-db-clusters \
  --db-cluster-identifier unified-health-prod-americas-aurora \
  --query 'DBClusters[0].{EarliestRestore:EarliestRestorableTime,LatestRestore:LatestRestorableTime}'
```

### ElastiCache Redis

**Automated Backups**:
- Retention: 7 days
- Window: Daily at 05:00-06:00 UTC
- Type: RDB snapshots

**Export to S3**:
```bash
# Create manual backup
aws elasticache create-snapshot \
  --replication-group-id unified-health-prod-americas-redis \
  --snapshot-name manual-backup-$(date +%Y%m%d)
```

### S3 Buckets

**Versioning**: Enabled on all buckets
**Cross-Region Replication**: Enabled to secondary region
**Lifecycle Policies**:
- Transition to Glacier: 90 days
- Delete old versions: 365 days

### Secrets Manager

**Automatic Backup**: Built-in versioning
**Cross-Region Replication**: Manual via Terraform

### EKS Configuration

**GitOps**: All Kubernetes manifests in Git
**Terraform State**: S3 with versioning + DynamoDB locking
**Helm Charts**: Versioned in repository

## Failover Runbook

### Scenario 1: Single AZ Failure

**Impact**: Partial degradation, automatic recovery
**Actions**: No manual intervention required

Aurora, ElastiCache, and EKS are deployed across 3 AZs. Automatic failover handles AZ failures.

### Scenario 2: Regional Database Failure

**Trigger**: Aurora cluster unreachable >5 minutes

**Steps**:

1. **Assess** (5 min)
   ```bash
   # Check cluster status
   aws rds describe-db-clusters \
     --db-cluster-identifier unified-health-prod-americas-aurora

   # Check events
   aws rds describe-events \
     --source-type db-cluster \
     --duration 60
   ```

2. **Failover to Read Replica** (if available, 5 min)
   ```bash
   aws rds failover-db-cluster \
     --db-cluster-identifier unified-health-prod-americas-aurora
   ```

3. **Restore from Snapshot** (if failover fails, 30-60 min)
   ```bash
   # Restore to point in time
   aws rds restore-db-cluster-to-point-in-time \
     --source-db-cluster-identifier unified-health-prod-americas-aurora \
     --db-cluster-identifier unified-health-prod-americas-aurora-restored \
     --restore-to-time "2025-01-04T10:00:00Z" \
     --vpc-security-group-ids sg-xxxxx \
     --db-subnet-group-name unified-health-prod-americas-db-subnet-group
   ```

4. **Update Application Config** (10 min)
   - Update Secrets Manager with new endpoint
   - Restart affected pods: `kubectl rollout restart deployment -n prod`

5. **Verify** (15 min)
   - Run health checks
   - Verify data integrity
   - Monitor error rates

### Scenario 3: Regional EKS Failure

**Trigger**: EKS API server unreachable, nodes not scheduling

**Steps**:

1. **Assess** (5 min)
   ```bash
   aws eks describe-cluster --name unified-health-prod-americas-eks
   kubectl get nodes
   ```

2. **Attempt Recovery** (15 min)
   - Wait for AWS automatic recovery
   - Check AWS Health Dashboard

3. **Traffic Reroute** (if extended outage, 10 min)
   ```bash
   # Update Route 53 weights
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890 \
     --change-batch file://failover-to-europe.json
   ```

4. **Regional Failover** (if >1 hour outage)
   - Route traffic to secondary region
   - Notify users of degraded service
   - Prepare for data sync when primary recovers

### Scenario 4: Complete Regional Outage

**Trigger**: Entire AWS region unavailable (rare)

**Steps**:

1. **Declare Disaster** (5 min)
   - Notify incident commander
   - Update status page

2. **Activate Secondary Region** (30 min)
   - Verify secondary region health
   - Update Route 53 to route all traffic to secondary
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890 \
     --change-batch file://full-failover.json
   ```

3. **Database Recovery** (60 min)
   - Restore from cross-region snapshot
   - Accept RPO data loss

4. **Application Deployment** (30 min)
   - Verify all services running in secondary
   - Scale up secondary region capacity

5. **Validation** (30 min)
   - Full functional testing
   - Performance verification
   - Security validation

**Total RTO for Complete Regional Outage**: ~2.5 hours

### Scenario 5: Data Corruption

**Trigger**: Application bug or malicious action corrupts data

**Steps**:

1. **Stop Writes** (5 min)
   - Scale down application pods
   - Enable database read-only mode

2. **Assess Damage** (30 min)
   - Identify affected tables/data
   - Determine corruption timeline

3. **Point-in-Time Recovery** (60 min)
   ```bash
   aws rds restore-db-cluster-to-point-in-time \
     --source-db-cluster-identifier unified-health-prod-americas-aurora \
     --db-cluster-identifier unified-health-prod-americas-aurora-clean \
     --restore-to-time "2025-01-04T09:30:00Z"
   ```

4. **Data Reconciliation** (varies)
   - Compare corrupted vs clean data
   - Manually recover transactions between corruption and detection

5. **Resume Operations** (30 min)
   - Point application to restored database
   - Re-enable writes
   - Monitor closely

## Recovery Testing Schedule

### Monthly Tests

| Test | Scope | Method |
|------|-------|--------|
| Backup Verification | All databases | Restore to test environment |
| Snapshot Integrity | Aurora, Redis | List and validate snapshots |
| Secrets Recovery | Secrets Manager | Restore deleted secret |

### Quarterly Tests

| Test | Scope | Method |
|------|-------|--------|
| Single AZ Failover | EKS, Aurora | Terminate instances in single AZ |
| Database Failover | Aurora | Force failover to replica |
| Cache Failover | Redis | Promote replica |
| Point-in-Time Recovery | Aurora | Restore to 1 hour prior |

### Annual Tests

| Test | Scope | Method |
|------|-------|--------|
| Full Regional Failover | All services | Simulate region outage |
| Data Corruption Recovery | Database | Controlled corruption + recovery |
| Complete Rebuild | All infrastructure | Terraform destroy + apply |

### Test Documentation

Each test must document:
- Date and participants
- Actual vs expected RTO/RPO
- Issues encountered
- Remediation actions
- Sign-off from engineering lead

## Recovery Contacts

| Role | Primary | Backup |
|------|---------|--------|
| Incident Commander | VP Engineering | CTO |
| Database Lead | DBA Team Lead | Senior DBA |
| Platform Lead | DevOps Lead | Senior SRE |
| Application Lead | Backend Lead | Senior Developer |
| Communications | Product Manager | Marketing Lead |

## Runbook Locations

| Runbook | Location |
|---------|----------|
| Database Recovery | `docs/runbooks/database-recovery.md` |
| EKS Recovery | `docs/runbooks/eks-recovery.md` |
| Redis Recovery | `docs/runbooks/redis-recovery.md` |
| Regional Failover | `docs/runbooks/regional-failover.md` |
| Data Corruption | `docs/runbooks/data-corruption.md` |

## Post-Incident Actions

1. **Incident Review** (within 48 hours)
   - Timeline of events
   - Root cause analysis
   - Impact assessment

2. **Documentation Update** (within 1 week)
   - Update runbooks with lessons learned
   - Revise RTO/RPO if necessary

3. **Process Improvement** (within 2 weeks)
   - Implement preventive measures
   - Add monitoring/alerting
   - Schedule additional testing if needed

## Compliance Considerations

### HIPAA Requirements

- All backups must be encrypted (KMS)
- Audit logs of all recovery actions
- Access to backup data requires approval
- Recovery testing must be documented

### Data Residency

- US data must remain in us-east-1
- EU data must remain in eu-west-1
- Africa data must remain in af-south-1
- Cross-region recovery only within same compliance zone
