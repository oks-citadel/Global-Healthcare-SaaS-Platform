# Infrastructure Cost Modeling

**Last Updated:** January 5, 2026
**Version:** 1.0
**Owner:** Platform Engineering / Finance

## Executive Summary

This document provides cost projections and optimization strategies for the Unified Health cloud infrastructure. It covers compute, storage, networking, and third-party services.

---

## Current Monthly Costs

### AWS Infrastructure

| Service               | Component                   | Monthly Cost |
| --------------------- | --------------------------- | ------------ |
| **EKS**               | Control plane               | $73          |
|                       | Worker nodes (3x m5.xlarge) | $432         |
|                       | Load balancers              | $50          |
| **Aurora PostgreSQL** | Primary (db.r6g.xlarge)     | $500         |
|                       | Read replicas (2x)          | $600         |
|                       | Storage & I/O               | $100         |
| **ElastiCache**       | Redis nodes (2x)            | $320         |
| **S3**                | Storage + requests          | $50          |
| **CloudFront**        | CDN distribution            | $100         |
| **Route53**           | DNS + health checks         | $25          |
| **Secrets Manager**   | Secrets storage             | $20          |
| **CloudWatch**        | Logs + metrics              | $150         |
| **WAF**               | Web firewall                | $30          |
| **Backup**            | AWS Backup                  | $50          |
| **Data Transfer**     | Egress                      | $200         |
| **Subtotal AWS**      |                             | **$2,700**   |

### Third-Party Services

| Service                  | Purpose                   | Monthly Cost            |
| ------------------------ | ------------------------- | ----------------------- |
| Stripe                   | Payment processing        | Variable (2.9% + $0.30) |
| Twilio                   | SMS/Voice                 | $500                    |
| SendGrid                 | Email                     | $200                    |
| Datadog                  | Monitoring                | $1,000                  |
| PagerDuty                | Incident management       | $200                    |
| Auth0                    | Identity (Enterprise SSO) | $500                    |
| Daily.co                 | Video conferencing        | $500                    |
| GitHub                   | Source control            | $200                    |
| Sentry                   | Error tracking            | $150                    |
| **Subtotal Third-Party** |                           | **$3,250**              |

### Current Total: ~$5,950/month + payment processing fees

---

## Cost Projections by User Scale

### Assumptions

- Linear scaling for compute
- Sub-linear scaling for databases (efficiency gains)
- Fixed costs for some services
- Payment processing: avg $50/transaction

### Projected Monthly Costs

| Component             | 10K Users  | 50K Users  | 200K Users  | 500K Users  |
| --------------------- | ---------- | ---------- | ----------- | ----------- |
| **Compute (EKS)**     | $555       | $1,500     | $4,000      | $10,000     |
| **Database (Aurora)** | $1,200     | $1,800     | $3,500      | $7,000      |
| **Cache (Redis)**     | $320       | $350       | $700        | $1,400      |
| **Storage (S3)**      | $50        | $100       | $250        | $500        |
| **CDN (CloudFront)**  | $100       | $300       | $800        | $2,000      |
| **Other AWS**         | $475       | $600       | $1,000      | $1,500      |
| **AWS Subtotal**      | $2,700     | $4,650     | $10,250     | $22,400     |
| **Third-Party**       | $3,250     | $4,500     | $8,000      | $15,000     |
| **Total**             | **$5,950** | **$9,150** | **$18,250** | **$37,400** |

### Cost per User

| Scale      | Monthly Cost | Cost/User/Month |
| ---------- | ------------ | --------------- |
| 10K Users  | $5,950       | $0.60           |
| 50K Users  | $9,150       | $0.18           |
| 200K Users | $18,250      | $0.09           |
| 500K Users | $37,400      | $0.07           |

**Target:** Maintain cost per user below $0.15 at scale

---

## Cost by Category

### Compute Costs

| Scale | Nodes | Instance Type | Monthly |
| ----- | ----- | ------------- | ------- |
| 10K   | 3     | m5.xlarge     | $432    |
| 50K   | 6     | m5.xlarge     | $864    |
| 200K  | 5     | m5.2xlarge    | $1,440  |
| 500K  | 10    | m5.2xlarge    | $2,880  |

**Optimization:** Use Spot instances for non-critical workloads (40% savings)

### Database Costs

| Scale | Instance    | Replicas | Storage | Monthly |
| ----- | ----------- | -------- | ------- | ------- |
| 10K   | r6g.xlarge  | 2        | 50 GB   | $1,200  |
| 50K   | r6g.xlarge  | 3        | 100 GB  | $1,800  |
| 200K  | r6g.2xlarge | 5        | 300 GB  | $3,500  |
| 500K  | r6g.4xlarge | 7        | 600 GB  | $7,000  |

**Optimization:** Reserved instances (1-year) save 30%

### Storage Costs (S3)

| Scale | Medical Docs | Backups | Logs   | Monthly |
| ----- | ------------ | ------- | ------ | ------- |
| 10K   | 100 GB       | 200 GB  | 20 GB  | $50     |
| 50K   | 500 GB       | 500 GB  | 100 GB | $100    |
| 200K  | 2 TB         | 1 TB    | 400 GB | $250    |
| 500K  | 5 TB         | 2 TB    | 1 TB   | $500    |

**Optimization:** Lifecycle policies move old data to Glacier (80% savings)

---

## Third-Party Service Scaling

### Stripe (Payment Processing)

| Metric            | 10K Users | 50K Users | 200K Users | 500K Users |
| ----------------- | --------- | --------- | ---------- | ---------- |
| Transactions/mo   | 5,000     | 25,000    | 100,000    | 250,000    |
| Avg transaction   | $50       | $50       | $50        | $50        |
| Volume            | $250K     | $1.25M    | $5M        | $12.5M     |
| Fees (2.9%+$0.30) | $8,750    | $43,750   | $175,000   | $437,500   |

**Note:** Fees passed to customers or included in pricing

### Twilio (Communications)

| Usage              | 10K Users | 50K Users  | 200K Users | 500K Users  |
| ------------------ | --------- | ---------- | ---------- | ----------- |
| SMS/month          | 20,000    | 100,000    | 400,000    | 1,000,000   |
| Cost ($0.0079/SMS) | $158      | $790       | $3,160     | $7,900      |
| Voice (minutes)    | 5,000     | 25,000     | 100,000    | 250,000     |
| Cost ($0.014/min)  | $70       | $350       | $1,400     | $3,500      |
| **Total**          | **$228**  | **$1,140** | **$4,560** | **$11,400** |

### SendGrid (Email)

| Volume       | 10K Users | 50K Users | 200K Users | 500K Users |
| ------------ | --------- | --------- | ---------- | ---------- |
| Emails/month | 50,000    | 250,000   | 1,000,000  | 2,500,000  |
| Plan         | Pro 100K  | Pro 300K  | Premier 1M | Premier 3M |
| Cost         | $90       | $250      | $900       | $1,500     |

### Datadog (Monitoring)

| Hosts        | 10K Users | 50K Users  | 200K Users | 500K Users  |
| ------------ | --------- | ---------- | ---------- | ----------- |
| Infra hosts  | 10        | 20         | 50         | 100         |
| APM hosts    | 5         | 10         | 25         | 50          |
| Logs (GB/mo) | 100       | 300        | 1,000      | 3,000       |
| **Total**    | **$800**  | **$1,500** | **$4,000** | **$10,000** |

---

## Cost Optimization Strategies

### 1. Reserved Instances (30-40% savings)

| Service     | Current   | Reserved (1yr) | Savings     |
| ----------- | --------- | -------------- | ----------- |
| EKS nodes   | $432/mo   | $302/mo        | $130/mo     |
| Aurora      | $1,100/mo | $770/mo        | $330/mo     |
| ElastiCache | $320/mo   | $224/mo        | $96/mo      |
| **Total**   | $1,852/mo | $1,296/mo      | **$556/mo** |

### 2. Spot Instances for Non-Critical Workloads

- Background jobs
- Data processing
- Development environments
- Estimated savings: $200/month

### 3. S3 Lifecycle Policies

```yaml
Rules:
  - Transition to Glacier after 90 days (audit logs)
  - Transition to Deep Archive after 365 days
  - Delete non-essential after 7 years

Estimated savings: $100/month at 500K scale
```

### 4. Right-Sizing

Monthly review of:

- Underutilized EC2 instances
- Over-provisioned database instances
- Unused Elastic IPs
- Idle load balancers

Estimated savings: 10-15% of compute costs

### 5. Data Transfer Optimization

- Use CloudFront for static assets
- Enable compression
- Optimize API payload sizes
- Use VPC endpoints for AWS services

Estimated savings: $50-100/month

---

## Budget Alerts

### CloudWatch Billing Alerts

```yaml
Alerts:
  - Warning: 80% of monthly budget
  - Critical: 100% of monthly budget
  - Anomaly: 20% deviation from forecast

Thresholds:
  - Current: $6,000/month
  - Year 1: $10,000/month
  - Year 2: $20,000/month
```

### Cost Allocation Tags

All resources tagged with:

- `Environment`: production, staging, development
- `Service`: api, web, database, cache
- `Team`: platform, application, data
- `CostCenter`: engineering, operations

---

## Annual Budget

### Year 1 (2026)

| Quarter    | Users | Monthly Cost | Quarterly   |
| ---------- | ----- | ------------ | ----------- |
| Q1         | 15K   | $6,500       | $19,500     |
| Q2         | 25K   | $7,500       | $22,500     |
| Q3         | 35K   | $8,500       | $25,500     |
| Q4         | 50K   | $9,500       | $28,500     |
| **Annual** |       |              | **$96,000** |

### Year 2 (2027)

| Quarter    | Users | Monthly Cost | Quarterly    |
| ---------- | ----- | ------------ | ------------ |
| Q1         | 75K   | $11,000      | $33,000      |
| Q2         | 100K  | $13,000      | $39,000      |
| Q3         | 150K  | $15,500      | $46,500      |
| Q4         | 200K  | $18,000      | $54,000      |
| **Annual** |       |              | **$172,500** |

### Year 3 (2028)

| Quarter    | Users | Monthly Cost | Quarterly    |
| ---------- | ----- | ------------ | ------------ |
| Q1         | 275K  | $23,000      | $69,000      |
| Q2         | 350K  | $28,000      | $84,000      |
| Q3         | 425K  | $33,000      | $99,000      |
| Q4         | 500K  | $38,000      | $114,000     |
| **Annual** |       |              | **$366,000** |

---

## Cost per Feature

### Feature Cost Breakdown

| Feature       | Infrastructure | Third-Party | Total/Month |
| ------------- | -------------- | ----------- | ----------- |
| Core Platform | $1,500         | $500        | $2,000      |
| Appointments  | $300           | $200        | $500        |
| Telehealth    | $400           | $800        | $1,200      |
| Billing       | $200           | Variable    | $200+       |
| Messaging     | $150           | $400        | $550        |
| Analytics     | $300           | $500        | $800        |
| Compliance    | $200           | $100        | $300        |

### Feature ROI Analysis

| Feature    | Monthly Cost | Revenue Impact | ROI |
| ---------- | ------------ | -------------- | --- |
| Telehealth | $1,200       | High           | 10x |
| Billing    | $200         | Direct         | 50x |
| Analytics  | $800         | Medium         | 5x  |
| Compliance | $300         | Required       | N/A |

---

## Optimization Action Items

### Immediate (P0)

- [ ] Enable Reserved Instances for production
- [ ] Set up billing alerts
- [ ] Review and right-size instances

### Short-term (P1)

- [ ] Implement S3 lifecycle policies
- [ ] Enable Spot instances for dev/staging
- [ ] Optimize data transfer

### Medium-term (P2)

- [ ] Evaluate Savings Plans
- [ ] Consider multi-year commitments
- [ ] Review third-party alternatives

---

## Appendix: AWS Pricing Reference

### EC2 Pricing (us-east-1)

| Instance   | vCPU | Memory | On-Demand | Reserved (1yr) |
| ---------- | ---- | ------ | --------- | -------------- |
| m5.large   | 2    | 8 GB   | $0.096/hr | $0.067/hr      |
| m5.xlarge  | 4    | 16 GB  | $0.192/hr | $0.134/hr      |
| m5.2xlarge | 8    | 32 GB  | $0.384/hr | $0.269/hr      |

### Aurora Pricing

| Instance       | vCPU | Memory | On-Demand |
| -------------- | ---- | ------ | --------- |
| db.r6g.large   | 2    | 16 GB  | $0.26/hr  |
| db.r6g.xlarge  | 4    | 32 GB  | $0.52/hr  |
| db.r6g.2xlarge | 8    | 64 GB  | $1.04/hr  |

### S3 Pricing

| Storage Class        | $/GB/month |
| -------------------- | ---------- |
| Standard             | $0.023     |
| Intelligent-Tiering  | $0.023     |
| Glacier              | $0.004     |
| Glacier Deep Archive | $0.00099   |

---

## Change Log

| Date       | Version | Change           | Author               |
| ---------- | ------- | ---------------- | -------------------- |
| 2026-01-05 | 1.0     | Initial creation | Platform Engineering |
