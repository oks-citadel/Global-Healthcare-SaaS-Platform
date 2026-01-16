# Database Growth Projections & Scaling Strategy

**Last Updated:** January 5, 2026
**Version:** 1.0
**Owner:** Platform Engineering

## Executive Summary

This document provides growth projections, capacity planning, and scaling strategies for the Unified Health database infrastructure. It covers Aurora PostgreSQL, ElastiCache Redis, and S3 storage.

---

## Current Infrastructure

### Aurora PostgreSQL

| Attribute           | Value                 |
| ------------------- | --------------------- |
| **Instance Class**  | db.r6g.xlarge         |
| **vCPUs**           | 4                     |
| **Memory**          | 32 GB                 |
| **Storage Type**    | Aurora I/O-Optimized  |
| **Current Storage** | ~50 GB                |
| **Max Storage**     | 128 TB (auto-scaling) |
| **Read Replicas**   | 2                     |
| **Multi-AZ**        | Yes                   |

### ElastiCache Redis

| Attribute        | Value                 |
| ---------------- | --------------------- |
| **Node Type**    | cache.r6g.large       |
| **Memory**       | 13.07 GB              |
| **Nodes**        | 2 (primary + replica) |
| **Cluster Mode** | Disabled              |

### S3 Storage

| Bucket            | Current Size | Purpose                 |
| ----------------- | ------------ | ----------------------- |
| Medical Documents | ~100 GB      | PHI documents, images   |
| Audit Logs        | ~20 GB       | Compliance audit trails |
| Backups           | ~200 GB      | Database backups        |

---

## Growth Projections

### User Growth Assumptions

| Metric               | Current | Year 1 | Year 2  | Year 3  |
| -------------------- | ------- | ------ | ------- | ------- |
| Active Patients      | 10,000  | 50,000 | 200,000 | 500,000 |
| Active Providers     | 500     | 2,000  | 8,000   | 20,000  |
| Daily Appointments   | 1,000   | 5,000  | 20,000  | 50,000  |
| Monthly Transactions | 5,000   | 25,000 | 100,000 | 250,000 |

### Database Storage Projections

#### Per-User Data Estimates

| Data Type               | Size per User | Notes                              |
| ----------------------- | ------------- | ---------------------------------- |
| User Profile            | 5 KB          | Basic info, preferences            |
| Medical History         | 50 KB         | Conditions, allergies, medications |
| Appointments (annual)   | 10 KB         | ~12 appointments/year              |
| Messages                | 20 KB         | Provider communication             |
| Audit Logs              | 100 KB        | Access logs, changes               |
| **Total per User/Year** | **185 KB**    |                                    |

#### Projected Database Size

| Timeframe | Users   | Data Size | With Indexes | Total (2x buffer) |
| --------- | ------- | --------- | ------------ | ----------------- |
| Current   | 10,000  | 1.8 GB    | 2.7 GB       | 5.4 GB            |
| Year 1    | 50,000  | 9.2 GB    | 13.8 GB      | 27.6 GB           |
| Year 2    | 200,000 | 37 GB     | 55.5 GB      | 111 GB            |
| Year 3    | 500,000 | 92.5 GB   | 138.7 GB     | 277.5 GB          |

### Document Storage Projections (S3)

| Timeframe | Medical Docs | Audit Logs | Backups | Total  |
| --------- | ------------ | ---------- | ------- | ------ |
| Current   | 100 GB       | 20 GB      | 200 GB  | 320 GB |
| Year 1    | 500 GB       | 100 GB     | 500 GB  | 1.1 TB |
| Year 2    | 2 TB         | 400 GB     | 1 TB    | 3.4 TB |
| Year 3    | 5 TB         | 1 TB       | 2 TB    | 8 TB   |

### Redis Cache Projections

| Timeframe | Active Sessions | Cached Queries | Feature Flags | Total  |
| --------- | --------------- | -------------- | ------------- | ------ |
| Current   | 500 MB          | 1 GB           | 10 MB         | 1.5 GB |
| Year 1    | 2 GB            | 4 GB           | 50 MB         | 6 GB   |
| Year 2    | 8 GB            | 16 GB          | 100 MB        | 24 GB  |
| Year 3    | 20 GB           | 40 GB          | 200 MB        | 60 GB  |

---

## Table-Level Analysis

### Largest Tables (Projected)

| Table             | Year 1 Rows | Year 3 Rows | Row Size  | Year 3 Size |
| ----------------- | ----------- | ----------- | --------- | ----------- |
| `audit_logs`      | 50M         | 500M        | 500 bytes | 250 GB      |
| `appointments`    | 2M          | 20M         | 1 KB      | 20 GB       |
| `messages`        | 5M          | 50M         | 500 bytes | 25 GB       |
| `medical_records` | 500K        | 5M          | 2 KB      | 10 GB       |
| `payments`        | 300K        | 3M          | 500 bytes | 1.5 GB      |
| `users`           | 50K         | 500K        | 2 KB      | 1 GB        |

### Index Strategy

| Table             | Indexes | Size Ratio | Notes                                 |
| ----------------- | ------- | ---------- | ------------------------------------- |
| `audit_logs`      | 4       | 1.5x       | userId, timestamp, action, resourceId |
| `appointments`    | 5       | 1.5x       | patientId, providerId, date, status   |
| `users`           | 3       | 1.2x       | email, phone (unique)                 |
| `medical_records` | 4       | 1.5x       | patientId, type, date                 |

---

## Scaling Triggers & Thresholds

### Aurora PostgreSQL

| Metric          | Warning | Critical | Action                |
| --------------- | ------- | -------- | --------------------- |
| CPU Utilization | > 70%   | > 85%    | Scale up instance     |
| Free Memory     | < 4 GB  | < 2 GB   | Scale up instance     |
| Storage Used    | > 70%   | > 85%    | Monitor (auto-scales) |
| Connections     | > 80%   | > 90%    | Add read replicas     |
| Replication Lag | > 100ms | > 500ms  | Investigate           |
| Query Time p99  | > 200ms | > 500ms  | Optimize queries      |

### ElastiCache Redis

| Metric          | Warning   | Critical   | Action                |
| --------------- | --------- | ---------- | --------------------- |
| CPU Utilization | > 65%     | > 80%      | Scale up node type    |
| Memory Used     | > 70%     | > 85%      | Scale up or add nodes |
| Cache Hit Ratio | < 90%     | < 80%      | Review cache strategy |
| Evictions       | > 100/min | > 1000/min | Increase memory       |
| Connections     | > 50K     | > 60K      | Add nodes             |

---

## Scaling Roadmap

### Phase 1: Current → 50K Users (Year 1)

**Timeline:** Q1-Q4 2026

**Actions:**

- [x] Current db.r6g.xlarge is sufficient
- [ ] Add 1 additional read replica (total 3)
- [ ] Implement query result caching
- [ ] Set up automated performance monitoring

**Estimated Cost Impact:** +$500/month

### Phase 2: 50K → 200K Users (Year 2)

**Timeline:** Q1-Q4 2027

**Actions:**

- [ ] Upgrade to db.r6g.2xlarge (8 vCPU, 64 GB)
- [ ] Add 2 more read replicas (total 5)
- [ ] Implement table partitioning for audit_logs
- [ ] Upgrade Redis to cache.r6g.xlarge
- [ ] Enable Redis cluster mode

**Estimated Cost Impact:** +$2,000/month

### Phase 3: 200K → 500K Users (Year 3)

**Timeline:** Q1-Q4 2028

**Actions:**

- [ ] Upgrade to db.r6g.4xlarge (16 vCPU, 128 GB)
- [ ] Implement database sharding strategy
- [ ] Archive historical data (> 3 years)
- [ ] Multi-region read replicas
- [ ] Redis cluster with 3 shards

**Estimated Cost Impact:** +$5,000/month

---

## Partitioning Strategy

### Audit Logs Table

Partition by month for efficient queries and archival:

```sql
-- Create partitioned table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    action VARCHAR(100),
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_logs_2026_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Automated partition creation (pg_partman)
SELECT partman.create_parent(
    p_parent_table => 'public.audit_logs',
    p_control => 'created_at',
    p_type => 'native',
    p_interval => '1 month',
    p_premake => 3
);
```

### Appointments Table

Partition by date for time-based queries:

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50),
    type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (scheduled_at);
```

---

## Archival Strategy

### Data Retention Periods

| Data Type       | Active   | Archive | Delete         |
| --------------- | -------- | ------- | -------------- |
| Audit Logs      | 1 year   | 6 years | After 7 years  |
| Appointments    | 2 years  | 8 years | After 10 years |
| Medical Records | 10 years | N/A     | Never (HIPAA)  |
| Messages        | 2 years  | 5 years | After 7 years  |
| Payments        | 1 year   | 7 years | After 7 years  |

### Archive Process

1. **Monthly Archive Job:**

   ```sql
   -- Move old audit logs to archive
   INSERT INTO audit_logs_archive
   SELECT * FROM audit_logs
   WHERE created_at < NOW() - INTERVAL '1 year';

   -- Delete from main table
   DELETE FROM audit_logs
   WHERE created_at < NOW() - INTERVAL '1 year';
   ```

2. **S3 Glacier for Cold Storage:**
   - Compress archived data
   - Upload to S3 Glacier Deep Archive
   - Maintain index in database for retrieval

---

## Read Replica Strategy

### Current Configuration

```
Primary (us-east-1a) ──┬── Replica 1 (us-east-1b) [Reporting]
                       └── Replica 2 (us-east-1c) [Read traffic]
```

### Target Configuration (Year 2)

```
Primary (us-east-1a) ──┬── Replica 1 (us-east-1b) [Read traffic]
                       ├── Replica 2 (us-east-1c) [Read traffic]
                       ├── Replica 3 (us-east-1b) [Reporting]
                       ├── Replica 4 (us-west-2a) [DR/West Coast]
                       └── Replica 5 (eu-west-1a) [EU traffic]
```

### Query Routing

| Query Type      | Target            | Notes                    |
| --------------- | ----------------- | ------------------------ |
| Writes          | Primary           | All INSERT/UPDATE/DELETE |
| Real-time reads | Primary/Replica   | User-facing queries      |
| Reports         | Reporting replica | Scheduled reports        |
| Analytics       | Reporting replica | Dashboard queries        |
| DR reads        | DR replica        | Failover only            |

---

## Performance Optimization

### Query Optimization Targets

| Query Type         | Current p99 | Target p99 |
| ------------------ | ----------- | ---------- |
| User lookup        | 10ms        | 5ms        |
| Appointment search | 50ms        | 20ms       |
| Provider search    | 100ms       | 30ms       |
| Audit log insert   | 5ms         | 5ms        |
| Report generation  | 5s          | 2s         |

### Index Recommendations

```sql
-- High-priority indexes
CREATE INDEX CONCURRENTLY idx_appointments_patient_date
ON appointments(patient_id, scheduled_at DESC);

CREATE INDEX CONCURRENTLY idx_appointments_provider_date
ON appointments(provider_id, scheduled_at DESC);

CREATE INDEX CONCURRENTLY idx_audit_logs_user_time
ON audit_logs(user_id, created_at DESC);

-- Partial indexes for common queries
CREATE INDEX CONCURRENTLY idx_appointments_upcoming
ON appointments(scheduled_at)
WHERE status = 'scheduled' AND scheduled_at > NOW();
```

---

## Cost Projections

### Database Costs (Monthly)

| Component      | Current    | Year 1     | Year 2     | Year 3     |
| -------------- | ---------- | ---------- | ---------- | ---------- |
| Aurora Primary | $500       | $500       | $1,000     | $2,000     |
| Read Replicas  | $600       | $900       | $1,500     | $3,000     |
| Storage (I/O)  | $100       | $300       | $800       | $1,500     |
| Backups        | $50        | $100       | $200       | $400       |
| **Subtotal**   | **$1,250** | **$1,800** | **$3,500** | **$6,900** |

### Redis Costs (Monthly)

| Component    | Current  | Year 1   | Year 2   | Year 3     |
| ------------ | -------- | -------- | -------- | ---------- |
| Nodes        | $300     | $300     | $600     | $1,200     |
| Backups      | $20      | $50      | $100     | $200       |
| **Subtotal** | **$320** | **$350** | **$700** | **$1,400** |

### S3 Costs (Monthly)

| Component    | Current | Year 1  | Year 2   | Year 3   |
| ------------ | ------- | ------- | -------- | -------- |
| Standard     | $10     | $30     | $100     | $200     |
| Glacier      | $0      | $5      | $20      | $50      |
| Requests     | $5      | $20     | $50      | $100     |
| **Subtotal** | **$15** | **$55** | **$170** | **$350** |

### Total Database Infrastructure (Monthly)

| Timeframe | Cost   | YoY Change |
| --------- | ------ | ---------- |
| Current   | $1,585 | -          |
| Year 1    | $2,205 | +39%       |
| Year 2    | $4,370 | +98%       |
| Year 3    | $8,650 | +98%       |

---

## Monitoring & Alerts

### CloudWatch Alarms

```yaml
# Aurora Alarms
- CPUUtilization > 70% for 5 minutes → Warning
- CPUUtilization > 85% for 5 minutes → Critical
- FreeableMemory < 4GB for 5 minutes → Warning
- DatabaseConnections > 80% max for 5 minutes → Warning
- AuroraReplicaLag > 100ms for 5 minutes → Warning

# Redis Alarms
- CPUUtilization > 65% for 5 minutes → Warning
- DatabaseMemoryUsagePercentage > 70% → Warning
- CacheHitRate < 90% for 15 minutes → Warning
- Evictions > 100 for 5 minutes → Warning
```

### Grafana Dashboards

1. **Database Overview**
   - Connection counts
   - Query latency (p50, p95, p99)
   - Replication lag
   - Storage growth

2. **Table Statistics**
   - Row counts by table
   - Index usage
   - Dead tuple ratio
   - Vacuum status

3. **Query Performance**
   - Slow query log
   - Most frequent queries
   - Index hit ratio

---

## Action Items

### Immediate (P0)

- [x] Document current state
- [x] Set up CloudWatch alarms
- [ ] Enable Performance Insights
- [ ] Configure automated backups verification

### Short-term (P1)

- [ ] Implement audit_logs partitioning
- [ ] Add reporting read replica
- [ ] Set up automated vacuum tuning
- [ ] Create capacity dashboard

### Medium-term (P2)

- [ ] Plan Year 2 scaling
- [ ] Design sharding strategy
- [ ] Implement data archival automation
- [ ] Multi-region replica setup

---

## Change Log

| Date       | Version | Change           | Author               |
| ---------- | ------- | ---------------- | -------------------- |
| 2026-01-05 | 1.0     | Initial creation | Platform Engineering |
