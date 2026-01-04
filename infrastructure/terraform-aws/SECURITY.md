# AWS Infrastructure Security Documentation

**Document Version:** 1.0
**Last Updated:** January 2025
**Classification:** Internal - Security Documentation
**Compliance:** HIPAA, SOC2, GDPR, POPIA, ISO 27001

---

## Table of Contents

1. [Threat Model Summary](#threat-model-summary)
2. [IAM Architecture](#iam-architecture)
3. [Encryption Strategy](#encryption-strategy)
4. [Network Security](#network-security)
5. [Incident Response Overview](#incident-response-overview)

---

## Threat Model Summary

### Threat Categories

| Category | Threat | Risk Level | Mitigation |
|----------|--------|------------|------------|
| **Data Breach** | Unauthorized PHI access | Critical | Encryption, RBAC, audit logging |
| **Network Attack** | DDoS, port scanning | High | WAF, rate limiting, VPC isolation |
| **Injection** | SQL injection, XSS | High | WAFv2 managed rules, input validation |
| **Credential Theft** | Phishing, brute force | High | MFA, Secrets Manager, GuardDuty |
| **Insider Threat** | Malicious employee | Medium | Least privilege, CloudTrail, audit logs |
| **Supply Chain** | Compromised dependencies | Medium | ECR scanning, Trivy, Snyk |
| **Ransomware** | Data encryption attack | High | AWS Backup, cross-region replication |

### STRIDE Analysis

| Threat | Description | Controls |
|--------|-------------|----------|
| **S**poofing | Identity impersonation | JWT auth, MFA, session management |
| **T**ampering | Data modification | Integrity hashing, audit logging, TLS |
| **R**epudiation | Denying actions | CloudTrail, immutable audit logs |
| **I**nformation Disclosure | PHI exposure | AES-256 encryption, TLS 1.3, VPC endpoints |
| **D**enial of Service | Service unavailability | WAF rate limiting, auto-scaling, multi-AZ |
| **E**levation of Privilege | Unauthorized access | RBAC, least privilege IAM, Security Hub |

### Attack Surface

```
Internet
    |
    v
[CloudFront CDN] --> [WAFv2] --> [ALB] --> [EKS Private Subnets]
                                              |
                                    [RDS] [ElastiCache] [S3]
                                    (Private Subnets - No Internet)
```

**Exposed Endpoints:**
- CloudFront distributions (static assets)
- Application Load Balancer (API endpoints)
- All protected by WAFv2 with HIPAA-compliant rules

**Internal Services:**
- EKS clusters in private subnets
- RDS PostgreSQL in isolated database subnets
- ElastiCache Redis in isolated cache subnets
- S3 buckets with VPC endpoints only

---

## IAM Architecture

### Role-Based Access Model

```
AWS Account Root (Emergency Only)
    |
    +-- OrganizationAdmin (Terraform/CI-CD)
    |       |-- Full infrastructure management
    |       |-- State file management
    |
    +-- SecurityAdmin
    |       |-- Security Hub, GuardDuty, CloudTrail
    |       |-- KMS key management
    |       |-- WAF configuration
    |
    +-- DeveloperRole
    |       |-- EKS access (kubectl)
    |       |-- ECR push/pull
    |       |-- CloudWatch logs read
    |
    +-- ReadOnlyRole
    |       |-- Console read access
    |       |-- CloudWatch dashboards
    |
    +-- ServiceRoles
            |-- EKS Node Role
            |-- CodePipeline Role
            |-- Lambda Execution Roles
```

### IAM Policies

**Least Privilege Principle:**
- All IAM policies follow least privilege
- Service-linked roles for AWS managed services
- Resource-based policies for cross-account access

**Key Policies:**

| Role | Services | Permissions |
|------|----------|-------------|
| EKS Node Role | ECR, CloudWatch, S3, Secrets Manager | Pull images, write logs, read secrets |
| CodePipeline Role | ECR, EKS, S3, CodeBuild | CI/CD operations only |
| CloudTrail Role | CloudWatch Logs, S3 | Write audit logs |
| Flow Logs Role | CloudWatch Logs | Write VPC flow logs |

### Service Control Policies

```json
{
  "Deny": [
    "Disable CloudTrail",
    "Delete KMS keys",
    "Modify GuardDuty",
    "Disable Security Hub",
    "Create unencrypted resources"
  ]
}
```

### MFA Requirements

- **Root account:** Hardware MFA required
- **Admin roles:** Virtual MFA required
- **Developer roles:** Virtual MFA required
- **Service roles:** N/A (assumed by services)

---

## Encryption Strategy

### KMS Key Architecture

```
KMS Keys
    |
    +-- cloudtrail-kms
    |       |-- Purpose: CloudTrail log encryption
    |       |-- Rotation: Automatic (annual)
    |       |-- Deletion window: 30 days
    |
    +-- rds-kms (per region)
    |       |-- Purpose: RDS database encryption
    |       |-- Rotation: Automatic (annual)
    |
    +-- s3-kms
    |       |-- Purpose: S3 bucket encryption
    |       |-- Rotation: Automatic (annual)
    |
    +-- elasticache-kms (per region)
    |       |-- Purpose: Redis cache encryption
    |       |-- Rotation: Automatic (annual)
    |
    +-- sns-sqs-kms
            |-- Purpose: Message queue encryption
            |-- Rotation: Automatic (annual)
```

### Encryption at Rest

| Resource | Algorithm | Key Management | Evidence |
|----------|-----------|----------------|----------|
| RDS PostgreSQL | AES-256 | AWS KMS (CMK) | `modules/rds/main.tf` |
| S3 Buckets | AES-256 | AWS KMS (CMK) | `modules/s3/main.tf` |
| ElastiCache Redis | AES-256 | AWS KMS (CMK) | `modules/elasticache/main.tf` |
| EBS Volumes | AES-256 | AWS KMS (CMK) | `modules/eks/main.tf` |
| CloudTrail Logs | AES-256 | AWS KMS (CMK) | `modules/security/main.tf` |
| SNS/SQS Messages | AES-256 | AWS KMS (CMK) | `modules/sns-sqs/main.tf` |
| Secrets Manager | AES-256 | AWS KMS (CMK) | `modules/secrets-manager/main.tf` |
| Backup Vault | AES-256 | AWS KMS (CMK) | `modules/backup/vaults.tf` |

### Encryption in Transit (TLS)

| Connection | Protocol | Cipher Suite | Configuration |
|------------|----------|--------------|---------------|
| Client to CloudFront | TLS 1.3 | TLS_AES_256_GCM_SHA384 | CloudFront viewer policy |
| CloudFront to ALB | TLS 1.2+ | AWS-managed | Origin protocol policy |
| ALB to EKS | TLS 1.2+ | AWS-managed | Target group HTTPS |
| EKS to RDS | TLS 1.3 | PostgreSQL SSL | `rds.force_ssl = 1` |
| EKS to ElastiCache | TLS 1.2+ | Redis TLS | Transit encryption enabled |
| EKS to S3 | TLS 1.2+ | HTTPS only | VPC endpoint policy |
| Internal services | mTLS | Istio/Envoy | Service mesh |

### Certificate Management

```
ACM Certificates
    |
    +-- theunifiedhealth.com (Production)
    |       |-- Auto-renewal: Yes
    |       |-- Validation: DNS (Route53)
    |       |-- Attached to: CloudFront, ALB
    |
    +-- *.theunifiedhealth.com (Wildcard)
            |-- Covers: api, app, provider, admin subdomains
```

---

## Network Security

### VPC Architecture (Per Region)

```
VPC (10.X.0.0/16)
    |
    +-- Public Subnets (10.X.1-3.0/24)
    |       |-- NAT Gateways
    |       |-- Application Load Balancers
    |       |-- Bastion hosts (if needed)
    |
    +-- Private Subnets (10.X.11-13.0/24)
    |       |-- EKS Worker Nodes
    |       |-- Application pods
    |       |-- No direct internet access
    |
    +-- Database Subnets (10.X.21-23.0/24)
    |       |-- RDS PostgreSQL
    |       |-- No internet access
    |       |-- Isolated from public
    |
    +-- Cache Subnets (10.X.31-33.0/24)
            |-- ElastiCache Redis
            |-- No internet access
            |-- Isolated from public
```

### Security Groups

| Security Group | Inbound | Outbound | Purpose |
|----------------|---------|----------|---------|
| ALB SG | 443 from 0.0.0.0/0 | All to VPC | Load balancer |
| EKS Node SG | 443 from ALB SG | HTTPS to VPC endpoints | Application nodes |
| RDS SG | 5432 from EKS Node SG | None | Database access |
| ElastiCache SG | 6379 from EKS Node SG | None | Cache access |
| VPC Endpoints SG | 443 from VPC CIDR | All | AWS service access |

### Network ACLs

- **Public subnets:** Allow HTTP/HTTPS inbound, ephemeral outbound
- **Private subnets:** Deny direct internet, allow VPC traffic
- **Database subnets:** Allow PostgreSQL from private only
- **Cache subnets:** Allow Redis from private only

### VPC Endpoints (Private Connectivity)

| Endpoint | Type | Purpose |
|----------|------|---------|
| S3 | Gateway | Access S3 without internet |
| ECR API | Interface | Pull container images |
| ECR DKR | Interface | Docker registry access |
| Secrets Manager | Interface | Retrieve secrets securely |
| CloudWatch Logs | Interface | Ship logs without internet |
| STS | Interface | IAM role assumption |

### VPC Flow Logs

- **Status:** Enabled for all VPCs
- **Destination:** CloudWatch Logs
- **Retention:** 90 days (configurable)
- **Traffic type:** ALL (accept + reject)
- **Format:** Default AWS format
- **Evidence:** `modules/vpc/main.tf`

### WAFv2 Configuration

**Enabled Rules:**

| Rule | Priority | Action | Purpose |
|------|----------|--------|---------|
| AWS Common Rule Set | 1 | Block | General web exploits |
| SQL Injection Rules | 2 | Block | SQLi protection |
| Known Bad Inputs | 3 | Block | Malicious payloads |
| Linux OS Rules | 4 | Block | OS-level attacks |
| IP Reputation List | 5 | Block | Known malicious IPs |
| Anonymous IP List | 6 | Block | TOR/proxy blocking |
| Rate Limit (2000/5min) | 7 | Block | DDoS protection |
| Geo-Blocking | 8 | Block | Data residency compliance |
| XSS Protection | 9 | Block | Cross-site scripting |
| Bad Bot Blocking | 10 | Block | Malicious crawlers |

**Evidence:** `modules/waf/main.tf`

---

## Incident Response Overview

### Detection Capabilities

| Service | Capability | Response Time |
|---------|------------|---------------|
| **GuardDuty** | Threat detection | 15-minute findings |
| **Security Hub** | Compliance monitoring | Real-time |
| **CloudTrail** | API audit logging | Near real-time |
| **VPC Flow Logs** | Network traffic analysis | 1-minute aggregation |
| **CloudWatch Alarms** | Metric thresholds | 1-5 minutes |
| **WAF Logging** | Web attack detection | Real-time |

### GuardDuty Configuration

```terraform
# Enabled threat detection sources
- S3 Data Events
- Kubernetes Audit Logs
- Malware Protection (EBS)
- Lambda Network Activity

# Finding severity thresholds
- HIGH/CRITICAL: Immediate SNS notification
- MEDIUM: 15-minute batch notification
- LOW: Daily digest
```

### Security Hub Standards

| Standard | Status | Coverage |
|----------|--------|----------|
| AWS Foundational Security | Enabled | All regions |
| CIS AWS Foundations 1.4 | Enabled | All regions |
| HIPAA Security | Enabled | US regions |

### Alerting Architecture

```
Detection Event
    |
    v
[GuardDuty / Security Hub / CloudWatch]
    |
    v
[EventBridge Rule]
    |
    v
[SNS Topic (KMS encrypted)]
    |
    +-- Email: security-team@unifiedhealthcare.com
    +-- PagerDuty: Critical incidents
    +-- Slack: #security-alerts
    +-- Lambda: Auto-remediation (optional)
```

### Incident Severity Levels

| Level | Description | Response SLA | Escalation |
|-------|-------------|--------------|------------|
| P1 - Critical | Active PHI breach, ransomware | 15 minutes | CSO, CEO, Legal |
| P2 - High | Unauthorized access attempt | 1 hour | Security team lead |
| P3 - Medium | Suspicious activity, policy violation | 4 hours | Security analyst |
| P4 - Low | Failed attacks, informational | 24 hours | Security review |

### Evidence Preservation

**CloudTrail:**
- 7-year retention (HIPAA compliant)
- Log file validation enabled
- Cross-region logging
- KMS encryption
- S3 lifecycle: Active -> Standard-IA (90d) -> Glacier (365d)

**Flow Logs:**
- 90-day CloudWatch retention
- Export to S3 for long-term (optional)

**WAF Logs:**
- Kinesis Firehose to S3
- Sensitive headers redacted (HIPAA)

### Auto-Remediation Examples

| Finding | Auto-Response |
|---------|---------------|
| Public S3 bucket | Block public access |
| Unencrypted EBS | Enable encryption |
| Security group 0.0.0.0/0 | Remove rule, notify |
| Unused IAM credentials | Disable after 90 days |

---

## Compliance Mapping

| Control | AWS Service | Configuration |
|---------|-------------|---------------|
| HIPAA 164.312(a)(1) - Access Control | IAM, EKS RBAC | Least privilege |
| HIPAA 164.312(b) - Audit Controls | CloudTrail, CloudWatch | 7-year retention |
| HIPAA 164.312(c)(1) - Integrity | KMS, S3 versioning | Checksums, encryption |
| HIPAA 164.312(d) - Authentication | Cognito, MFA | Multi-factor auth |
| HIPAA 164.312(e)(1) - Transmission | TLS 1.3, VPC endpoints | Encryption in transit |
| SOC2 CC6.1 - Logical Access | IAM policies | Role-based access |
| SOC2 CC7.2 - System Monitoring | GuardDuty, Security Hub | Continuous monitoring |
| GDPR Art. 32 - Security | Full encryption stack | Data protection |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01 | Security Team | Initial security documentation |

**Review Schedule:** Quarterly or upon significant infrastructure changes

**Contacts:**
- Security Team: security@unifiedhealthcare.com
- Compliance: compliance@unifiedhealthcare.com

---

**Document Classification:** Internal - Security Documentation
**Access:** Security Team, Infrastructure Team, Compliance Team
