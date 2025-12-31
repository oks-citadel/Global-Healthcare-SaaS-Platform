# AWS EOL/EOS Risk Report

## Global Healthcare SaaS Platform - Lifecycle Intelligence Report

**Report Date:** December 30, 2025
**Report Period:** Q1 2026 Planning
**Next Review:** January 30, 2026

---

## Executive Summary

This report provides a comprehensive analysis of AWS resource lifecycle status for the Global Healthcare SaaS Platform. The analysis identifies resources approaching end-of-life (EOL) or end-of-support (EOS) dates and provides actionable upgrade recommendations.

### Risk Overview

| Risk Level | Count | Description |
|------------|-------|-------------|
| Critical   | 0     | Past EOL or in extended support |
| Red        | 3     | Less than 180 days until EOL |
| Yellow     | 3     | Between 180-365 days until EOL |
| Green      | 25    | More than 365 days until EOL |

**Total Resources Tracked:** 31

---

## Immediate Action Required (RED)

### 1. Amazon EKS Clusters - Version 1.29

**Status:** Standard Support Ends March 23, 2025 (83 days)

| Cluster | Region | Current Version | Risk Level |
|---------|--------|-----------------|------------|
| eks-americas | us-east-1 | 1.29 | RED |
| eks-europe | eu-west-1 | 1.29 | RED |
| eks-africa | af-south-1 | 1.29 | RED |

**Impact:**
- EKS 1.29 enters extended support on March 23, 2025
- Extended support incurs additional charges of $0.60 per cluster per hour
- Estimated additional monthly cost: ~$1,296 per cluster (~$3,888 total)

**Recommended Action:**
1. **Target Version:** EKS 1.31 (Standard support until November 2025)
2. **Timeline:** Complete upgrade by March 15, 2025
3. **Upgrade Path:** 1.29 -> 1.30 -> 1.31 (sequential upgrades required)

**Upgrade Steps:**
```bash
# For each cluster, upgrade sequentially
# Step 1: Update EKS cluster version
eksctl upgrade cluster --name <cluster-name> --version 1.30

# Step 2: Update node groups
eksctl upgrade nodegroup --cluster <cluster-name> --name <nodegroup>

# Step 3: Repeat for 1.31
eksctl upgrade cluster --name <cluster-name> --version 1.31
```

**Terraform Changes Required:**
```hcl
# infrastructure/terraform-aws/variables.tf
variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.31"  # Changed from "1.29"
}
```

**Pre-Upgrade Checklist:**
- [ ] Review Kubernetes 1.30 and 1.31 deprecation notices
- [ ] Test application compatibility in staging environment
- [ ] Update kube-proxy, coredns, and vpc-cni addon versions
- [ ] Verify PodDisruptionBudgets are in place
- [ ] Schedule maintenance window (recommend 2-hour window per cluster)
- [ ] Notify stakeholders of planned upgrade

---

## Planning Required (YELLOW)

### 2. Amazon Linux 2 (EKS Node AMIs)

**Status:** Standard Support Ends June 30, 2025 (182 days)

| Component | Region | Current Version | Target |
|-----------|--------|-----------------|--------|
| EKS Node AMI | us-east-1 | Amazon Linux 2 | Amazon Linux 2023 |
| EKS Node AMI | eu-west-1 | Amazon Linux 2 | Amazon Linux 2023 |
| EKS Node AMI | af-south-1 | Amazon Linux 2 | Amazon Linux 2023 |

**Impact:**
- Security patches will cease after June 30, 2025
- Extended support available until June 30, 2026 (with potential cost implications)
- AL2023 offers improved security posture and newer kernel

**Recommended Action:**
1. **Target:** Migrate to Amazon Linux 2023 optimized AMIs
2. **Timeline:** Complete by June 15, 2025
3. **Approach:** Rolling node group replacement

**Migration Strategy:**
```hcl
# Create new node group with AL2023
resource "aws_eks_node_group" "application_al2023" {
  # ... existing config ...

  # Specify AL2023 AMI type
  ami_type = "AL2023_x86_64_STANDARD"  # or AL2023_ARM_64_STANDARD for Graviton
}
```

### 3. kube-proxy Addon

**Status:** Version tied to EKS 1.29

| Addon | Current Version | Target Version |
|-------|-----------------|----------------|
| kube-proxy | v1.29.7-eksbuild.5 | v1.31.2-eksbuild.3 |

**Action:** Upgrade alongside EKS cluster upgrade (included in EKS upgrade checklist above)

---

## Monitoring Status (GREEN)

### Aurora PostgreSQL (All Regions)

| Resource | Version | EOL Date | Days Until EOL |
|----------|---------|----------|----------------|
| aurora-americas | 15.4 | Nov 2027 | 672 |
| aurora-europe | 15.4 | Nov 2027 | 672 |
| aurora-africa | 15.4 | Nov 2027 | 672 |

**Status:** Well within support window. Consider minor version upgrade to 15.6 for latest patches.

### ElastiCache Redis (All Regions)

| Resource | Version | EOL Date | Days Until EOL |
|----------|---------|----------|----------------|
| redis-americas | 7.0 | Sep 2026 | 611 |
| redis-europe | 7.0 | Sep 2026 | 611 |
| redis-africa | 7.0 | Sep 2026 | 611 |

**Status:** Well within support window. Consider upgrade to 7.1 for performance improvements.

### Node.js Container Runtimes

| Service | Current | EOL Date | Days | Recommendation |
|---------|---------|----------|------|----------------|
| api-service | 25 | Apr 2028 | 822 | Consider Node 22 LTS for stability |
| web-app | 25 | Apr 2028 | 822 | Consider Node 22 LTS for stability |
| api-gateway | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| telehealth-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| laboratory-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| pharmacy-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| imaging-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| mental-health-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| chronic-care-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| auth-service | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |
| mobile-app | 20 | Apr 2026 | 486 | Upgrade to Node 22 LTS |

**Recommendation:** Standardize all services on Node.js 22 LTS for production stability and unified maintenance.

### AWS SDK

| Package | Current | Status | Recommendation |
|---------|---------|--------|----------------|
| @aws-sdk/client-s3 | ^3.400.0 | Supported | Update to ^3.700.0 |
| @aws-sdk/client-secrets-manager | ^3.400.0 | Supported | Update to ^3.700.0 |
| @aws-sdk/client-kms | ^3.400.0 | Supported | Update to ^3.700.0 |
| @aws-sdk/s3-request-presigner | ^3.400.0 | Supported | Update to ^3.700.0 |

**Status:** Using supported AWS SDK v3. Update to latest patch versions for security fixes.

### EC2 Instance Types

| Type | Generation | Status |
|------|------------|--------|
| m6i.large | Gen 6 Intel | Current |
| m6i.xlarge | Gen 6 Intel | Current |
| m6i.2xlarge | Gen 6 Intel | Current |
| cache.r6g.large | Gen 6 Graviton2 | Current |
| db.r6g.large | Gen 6 Graviton2 | Current |

**Status:** All instance types are current generation. Consider M7i/R7g for future upgrades.

---

## Deprecated Services Check

| Service | Status | In Use | Action |
|---------|--------|--------|--------|
| AWS SDK v2 | Deprecated Sep 2024 | No | None required |
| Amazon Elasticsearch | Deprecated Sep 2021 | No | None required |
| Classic Load Balancer | Deprecated | No | None required |

**Status:** Platform is not using any deprecated AWS services.

---

## Cost Impact Analysis

### Current State (No Action)

If EKS clusters remain on version 1.29 past March 23, 2025:

| Item | Monthly Cost |
|------|--------------|
| Extended Support (3 clusters) | $3,888 |
| Annual Extended Support Cost | $46,656 |

### Recommended State (After Upgrades)

| Item | Monthly Cost |
|------|--------------|
| EKS Standard Support | $0 (included) |
| Estimated Savings | $46,656/year |

---

## Upgrade Timeline Recommendation

### Q1 2026 (January - March)

| Week | Action | Priority |
|------|--------|----------|
| Jan 6-10 | Test EKS 1.30 upgrade in staging | High |
| Jan 13-17 | Upgrade staging to EKS 1.30 | High |
| Jan 20-24 | Test EKS 1.31 upgrade in staging | High |
| Jan 27-31 | Upgrade staging to EKS 1.31 | High |
| Feb 3-7 | Production upgrade planning | High |
| Feb 10-14 | Upgrade eks-americas to 1.30, then 1.31 | High |
| Feb 17-21 | Upgrade eks-europe to 1.30, then 1.31 | High |
| Feb 24-28 | Upgrade eks-africa to 1.30, then 1.31 | High |
| Mar 3-7 | Validation and monitoring | High |

### Q2 2026 (April - June)

| Week | Action | Priority |
|------|--------|----------|
| Apr | Node.js 22 LTS migration for all services | Medium |
| May | AWS SDK update to latest v3 | Low |
| Jun | AL2023 migration planning | Medium |

---

## Compliance Considerations

### Healthcare Compliance (HIPAA, SOC2)

- **Security Patches:** Maintaining supported versions ensures continued security patches critical for HIPAA compliance
- **Audit Trail:** Document all upgrade activities for compliance audits
- **Change Management:** Follow established change management procedures for all upgrades

### Regional Compliance

| Region | Compliance | Notes |
|--------|------------|-------|
| Americas (us-east-1) | HIPAA, SOC2, ISO27001 | US data residency requirements |
| Europe (eu-west-1) | GDPR, ISO27001, SOC2 | EU data residency requirements |
| Africa (af-south-1) | POPIA, ISO27001, SOC2 | South Africa data residency requirements |

---

## Monitoring and Alerting

### Recommended Monitoring Setup

```yaml
# Add to CloudWatch alarms
- EKS version deprecation alerts
- Node AMI age monitoring
- SDK version tracking
- Runtime version monitoring
```

### Registry Update Schedule

- **Weekly:** Automated scan for new AWS deprecation announcements
- **Monthly:** Full lifecycle registry review
- **Quarterly:** Risk assessment report generation

---

## Appendix: Reference Links

### AWS Official Documentation

- [EKS Version Calendar](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html)
- [Aurora PostgreSQL Versions](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.VersionPolicy.html)
- [ElastiCache Redis Versions](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/supported-engine-versions.html)
- [Amazon Linux 2 FAQs](https://aws.amazon.com/amazon-linux-2/faqs/)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)

### Internal References

- Registry File: `lifecycle/aws-eol-registry.json`
- Terraform Config: `infrastructure/terraform-aws/`
- EKS Module: `infrastructure/terraform-aws/modules/eks/`
- RDS Module: `infrastructure/terraform-aws/modules/rds/`
- ElastiCache Module: `infrastructure/terraform-aws/modules/elasticache/`

---

**Report Generated By:** AWS Lifecycle Intelligence Agent
**Report Version:** 1.0.0
**Classification:** Internal Use Only
