# AWS Infrastructure Cost Analysis

## Current Monthly Spend Estimate (Production)

Based on deployed infrastructure configuration in `prod.tfvars`:

### Compute (EKS)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| EKS Cluster | Control plane | 3 regions | $219 |
| System Nodes | m6i.large On-Demand | 6 nodes (2/region) | $540 |
| App Nodes | m6i.xlarge On-Demand | 15 nodes (5/region) | $2,025 |
| NAT Gateway | Per AZ | 9 (3/region) | $970 |
| Data Transfer | NAT egress | ~500GB/region | $450 |
| **Subtotal** | | | **$4,204** |

### Database (Aurora PostgreSQL)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Writer Instance | db.r6g.large | 3 regions | $570 |
| Reader Instance | db.r6g.large | 3 regions | $570 |
| Storage | 100GB per region | 300GB total | $30 |
| I/O | ~5M requests/day | 3 regions | $150 |
| Backup Storage | 35-day retention | ~200GB | $20 |
| **Subtotal** | | | **$1,340** |

### Cache (ElastiCache Redis)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Redis Nodes | cache.r6g.xlarge | 9 nodes (3/region) | $2,160 |
| Backup Storage | 7-day retention | ~50GB | $5 |
| **Subtotal** | | | **$2,165** |

### Networking & CDN

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Route 53 | Hosted zone | 1 | $0.50 |
| Route 53 | Query volume | ~10M queries | $40 |
| Health Checks | HTTPS | 6 endpoints | $15 |
| CloudFront | 500GB transfer | 3 distributions | $85 |
| ALB | Per hour + LCU | 3 regions | $180 |
| Elastic IPs | NAT Gateway | 9 | $32 |
| **Subtotal** | | | **$352** |

### Storage (S3)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Standard Storage | First 50TB | ~500GB | $12 |
| Requests | PUT/GET | ~10M | $5 |
| Data Transfer | To CloudFront | Free | $0 |
| **Subtotal** | | | **$17** |

### Messaging (SNS/SQS)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| SNS Requests | 7 topics, ~1M msgs/day | 30M/month | $15 |
| SQS Requests | 8 queues + 8 DLQs | ~50M/month | $20 |
| SNS Data Transfer | Message payload | ~10GB | $1 |
| **Subtotal** | | | **$36** |

### Email (SES)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Email Sending | Transactional | ~500K emails | $50 |
| Receiving | Bounce/complaint | ~10K | $1 |
| **Subtotal** | | | **$51** |

### Security & Management

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| KMS Keys | Per-service keys | 15 keys | $15 |
| KMS Requests | Encryption ops | ~10M | $30 |
| Secrets Manager | Secrets stored | 20 secrets | $8 |
| AWS WAF | WebACL + rules | 3 regions | $45 |
| WAF Requests | Per 10K requests | ~100M | $60 |
| **Subtotal** | | | **$158** |

### Monitoring (CloudWatch)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Log Ingestion | 90-day retention | ~500GB/month | $250 |
| Log Storage | Archived | ~1TB | $30 |
| Metrics | Custom metrics | ~200 | $60 |
| Dashboards | 3 dashboards | Standard | $9 |
| Alarms | ~50 alarms | Standard | $5 |
| **Subtotal** | | | **$354** |

### Container Registry (ECR)

| Component | Configuration | Qty | Est. Monthly |
|-----------|--------------|-----|-------------|
| Storage | 10 repositories | ~50GB | $5 |
| Data Transfer | Cross-region replication | ~20GB | $2 |
| **Subtotal** | | | **$7** |

---

### Total Monthly Estimate

| Category | Amount |
|----------|--------|
| Compute (EKS) | $4,204 |
| Database (Aurora) | $1,340 |
| Cache (ElastiCache) | $2,165 |
| Networking & CDN | $352 |
| Storage (S3) | $17 |
| Messaging (SNS/SQS) | $36 |
| Email (SES) | $51 |
| Security & Management | $158 |
| Monitoring (CloudWatch) | $354 |
| Container Registry (ECR) | $7 |
| **TOTAL** | **$8,684/month** |

**Annual Estimate**: ~$104,208 (without Reserved Instances)

## Budget Assumptions

### Traffic Assumptions

- 100,000 monthly active users
- 1M API requests/day
- 500K emails/month
- 50GB log ingestion/day

### Growth Assumptions

- 20% month-over-month user growth
- Linear scaling of compute resources
- Database storage grows 10GB/month

### Excluded Costs

- AWS Support (Business: $100/month minimum or 10% of usage)
- Data transfer between regions (cross-region sync)
- Third-party tools (monitoring, APM)
- Development/staging environments

## Scaling Cost Projections

### Low Growth Scenario (2x users in 12 months)

| Month | Users | EKS Nodes | Monthly Cost |
|-------|-------|-----------|--------------|
| 0 | 100K | 15 | $8,684 |
| 6 | 150K | 18 | $9,500 |
| 12 | 200K | 24 | $11,200 |

### High Growth Scenario (10x users in 12 months)

| Month | Users | EKS Nodes | Monthly Cost |
|-------|-------|-----------|--------------|
| 0 | 100K | 15 | $8,684 |
| 6 | 500K | 45 | $18,500 |
| 12 | 1M | 60 | $28,000 |

### Cost Scaling Factors

| Component | Scaling Trigger | Cost Impact |
|-----------|----------------|-------------|
| EKS Nodes | CPU/memory utilization >70% | +$135/node (m6i.xlarge) |
| Aurora | Storage >80% or CPU >70% | +$190/instance upgrade |
| ElastiCache | Memory >80% | +$240/node upgrade |
| NAT Gateway | Data transfer | +$0.045/GB |
| CloudWatch | Log volume | +$0.50/GB ingested |

## Reserved Instance Recommendations

### Compute Savings Plan (EKS EC2)

| Option | Commitment | Savings | Annual Cost |
|--------|------------|---------|-------------|
| No commitment | On-Demand | 0% | $30,780 |
| 1-year Compute Savings Plan | All Upfront | 40% | $18,468 |
| 3-year Compute Savings Plan | All Upfront | 60% | $12,312 |

**Recommendation**: 1-year Compute Savings Plan for baseline capacity (12 nodes), On-Demand for burst.

### Aurora Reserved Instances

| Option | Commitment | Savings | Annual Cost |
|--------|------------|---------|-------------|
| No commitment | On-Demand | 0% | $13,680 |
| 1-year Reserved | All Upfront | 35% | $8,892 |
| 3-year Reserved | All Upfront | 55% | $6,156 |

**Recommendation**: 1-year Reserved for all regions if committed to multi-region deployment.

### ElastiCache Reserved Nodes

| Option | Commitment | Savings | Annual Cost |
|--------|------------|---------|-------------|
| No commitment | On-Demand | 0% | $25,920 |
| 1-year Reserved | All Upfront | 35% | $16,848 |
| 3-year Reserved | All Upfront | 55% | $11,664 |

**Recommendation**: 1-year Reserved for production clusters.

### Total Savings with Reservations

| Scenario | Annual Cost | Savings |
|----------|-------------|---------|
| All On-Demand | $104,208 | - |
| 1-year Reservations | $72,936 | $31,272 (30%) |
| 3-year Reservations | $58,500 | $45,708 (44%) |

## Cost Optimization Recommendations

### Immediate Actions

1. **Enable Spot Instances for non-critical workloads**
   - Potential savings: 60-70% on application node group
   - Risk: Instance interruption (mitigate with PDB)

2. **Right-size underutilized resources**
   - Review CloudWatch metrics for utilization
   - Downsize dev/staging environments

3. **Optimize NAT Gateway costs**
   - Use VPC endpoints for AWS services (already implemented)
   - Consider NAT instances for low-traffic regions

4. **Reduce CloudWatch log retention**
   - Archive to S3 after 30 days
   - Use S3 Glacier for long-term compliance storage

### Medium-Term Actions

1. **Purchase Savings Plans/Reserved Instances**
   - Start with 1-year commitment for predictable workloads
   - Evaluate 3-year after first year of production

2. **Implement auto-scaling policies**
   - Scale down during off-peak hours
   - Reduce minimum nodes on weekends

3. **Optimize Aurora storage**
   - Archive old data to S3
   - Implement table partitioning

### Cost Monitoring

Enable AWS Cost Explorer and set up:
- Daily cost anomaly detection
- Monthly budget alerts at 50%, 80%, 100%
- Cost allocation tags (already enabled via Terraform)

Budget alert email: ops@unifiedhealth.com
Monthly budget: $50,000 (allows for growth headroom)
