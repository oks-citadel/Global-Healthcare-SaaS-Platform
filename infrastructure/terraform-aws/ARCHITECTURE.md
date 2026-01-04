# AWS Infrastructure Architecture

## Overview

The Unified Health Platform runs on AWS with multi-region deployment across Americas (us-east-1), Europe (eu-west-1), and Africa (af-south-1). Each region operates independently with its own EKS cluster, Aurora PostgreSQL database, and ElastiCache Redis cluster.

## System Architecture Diagram

```
                                    Internet
                                        |
                          +-------------+-------------+
                          |     Amazon Route 53      |
                          |   (theunifiedhealth.com) |
                          +-------------+-------------+
                                        |
            +---------------------------+---------------------------+
            |                           |                           |
            v                           v                           v
    +---------------+           +---------------+           +---------------+
    |  CloudFront   |           |  CloudFront   |           |  CloudFront   |
    |  (us-east-1)  |           |  (eu-west-1)  |           |  (af-south-1) |
    +-------+-------+           +-------+-------+           +-------+-------+
            |                           |                           |
            v                           v                           v
    +---------------+           +---------------+           +---------------+
    |   AWS WAF     |           |   AWS WAF     |           |   AWS WAF     |
    +-------+-------+           +-------+-------+           +-------+-------+
            |                           |                           |
            v                           v                           v
    +---------------+           +---------------+           +---------------+
    |     ALB       |           |     ALB       |           |     ALB       |
    | (Public Subnet)|          | (Public Subnet)|          | (Public Subnet)|
    +-------+-------+           +-------+-------+           +-------+-------+
            |                           |                           |
============|===========================|===========================|========
    VPC 10.10.0.0/16            VPC 10.20.0.0/16            VPC 10.30.0.0/16
            |                           |                           |
            v                           v                           v
    +---------------+           +---------------+           +---------------+
    |  EKS Cluster  |           |  EKS Cluster  |           |  EKS Cluster  |
    |   v1.29       |           |   v1.29       |           |   v1.29       |
    | (Private Subnet)|         | (Private Subnet)|         | (Private Subnet)|
    |  3-20 nodes   |           |  3-20 nodes   |           |  3-20 nodes   |
    +---+-------+---+           +---+-------+---+           +---+-------+---+
        |       |                   |       |                   |       |
        v       v                   v       v                   v       v
+----------+ +----------+   +----------+ +----------+   +----------+ +----------+
| Aurora   | |ElastiCache|  | Aurora   | |ElastiCache|  | Aurora   | |ElastiCache|
|PostgreSQL| |  Redis    |  |PostgreSQL| |  Redis    |  |PostgreSQL| |  Redis    |
| (DB Sub) | |(Cache Sub)|  | (DB Sub) | |(Cache Sub)|  | (DB Sub) | |(Cache Sub)|
+----------+ +----------+   +----------+ +----------+   +----------+ +----------+
```

## AWS Service Map

| Service | Configuration | Purpose |
|---------|--------------|---------|
| **EKS** | v1.29, m6i.xlarge/2xlarge nodes | Container orchestration |
| **Aurora PostgreSQL** | v15.4, db.r6g.large, Multi-AZ | Primary database |
| **ElastiCache Redis** | v7.0, cache.r6g.xlarge, 3 clusters | Session/cache |
| **Route 53** | Hosted zone, health checks | DNS management |
| **CloudFront** | PriceClass_All, TLS 1.2+ | CDN/edge caching |
| **ALB** | HTTPS, WAF-enabled | Load balancing |
| **ECR** | Cross-region replication | Container registry |
| **S3** | Versioned, encrypted | Object storage |
| **Secrets Manager** | Auto-rotation | Credentials management |
| **KMS** | Per-service keys, rotation | Encryption keys |
| **CloudWatch** | 90-day retention | Logging/monitoring |
| **SNS/SQS** | KMS-encrypted, FIFO support | Messaging |
| **SES** | DKIM/SPF/DMARC | Transactional email |

## Data Flow: SNS -> SQS -> Services -> SES

```
+------------------+     +--------------------+     +-------------------+
|   Application    |     |    SNS Topics      |     |    SQS Queues     |
|   Services       |---->| - user-notifications|---->| - email-processing|
|   (EKS Pods)     |     | - appointment-events|     | - sms-processing  |
+------------------+     | - patient-events   |     | - appointment-proc|
                         | - billing-events   |     | - billing-proc    |
                         | - clinical-events  |     | - clinical-proc   |
                         | - telehealth-events|     | - analytics-proc  |
                         | - system-alerts    |     | - webhook-proc    |
                         +--------------------+     +--------+----------+
                                                             |
                    +----------------------------------------+
                    |
                    v
+-------------------+     +-------------------+     +-------------------+
|  Worker Services  |     |   Dead Letter     |     |      AWS SES      |
|  (EKS Consumers)  |---->|   Queues (DLQ)    |     |   Email Delivery  |
|                   |     | - Per queue DLQ   |     | - Bounce handling |
|  - Email worker   |     | - 14-day retention|     | - Complaint notif |
|  - SMS worker     |     | - CloudWatch alarms|    | - DMARC reports   |
|  - Billing worker |     +-------------------+     +-------------------+
+--------+----------+
         |
         v
+-------------------+
|   External APIs   |
| - Payment gateway |
| - Telehealth      |
| - Lab integrations|
+-------------------+
```

### Message Flow Details

1. **Event Publication**: Services publish events to appropriate SNS topics
2. **Fan-out**: SNS distributes to subscribed SQS queues based on configuration
3. **Processing**: Worker pods poll SQS queues and process messages
4. **Email Delivery**: Email worker sends via SES with configuration set
5. **Failure Handling**: Failed messages route to DLQ after 3-5 retries
6. **Monitoring**: CloudWatch alarms trigger on DLQ depth and message age

## Network Topology

### VPC Structure (per region)

```
VPC: 10.X0.0.0/16 (X=1 Americas, X=2 Europe, X=3 Africa)
|
+-- Public Subnets (3 AZs)
|   |-- 10.X0.1.0/24 (AZ-a) - NAT Gateway, ALB
|   |-- 10.X0.2.0/24 (AZ-b) - NAT Gateway, ALB
|   |-- 10.X0.3.0/24 (AZ-c) - NAT Gateway, ALB
|
+-- Private Subnets (3 AZs)
|   |-- 10.X0.11.0/24 (AZ-a) - EKS nodes
|   |-- 10.X0.12.0/24 (AZ-b) - EKS nodes
|   |-- 10.X0.13.0/24 (AZ-c) - EKS nodes
|
+-- Database Subnets (3 AZs)
|   |-- 10.X0.21.0/24 (AZ-a) - Aurora
|   |-- 10.X0.22.0/24 (AZ-b) - Aurora
|   |-- 10.X0.23.0/24 (AZ-c) - Aurora
|
+-- ElastiCache Subnets (3 AZs)
    |-- 10.X0.31.0/24 (AZ-a) - Redis
    |-- 10.X0.32.0/24 (AZ-b) - Redis
    |-- 10.X0.33.0/24 (AZ-c) - Redis
```

### VPC Endpoints

Private connectivity to AWS services (no internet egress required):

- **S3** (Gateway endpoint)
- **ECR API** (Interface endpoint)
- **ECR DKR** (Interface endpoint)
- **Secrets Manager** (Interface endpoint)

### Security Groups

| Security Group | Inbound Rules | Purpose |
|---------------|---------------|---------|
| ALB SG | 443/TCP from 0.0.0.0/0 | Public HTTPS |
| EKS Cluster SG | 443/TCP from Node SG | API server |
| EKS Node SG | All from self, 1025-65535 from Cluster | Node comms |
| RDS SG | 5432/TCP from Node SG | Database access |
| Redis SG | 6379/TCP from Node SG | Cache access |
| VPC Endpoints SG | 443/TCP from VPC CIDR | AWS service access |

### Flow Logs

VPC Flow Logs enabled for all VPCs:
- Destination: CloudWatch Logs
- Traffic type: ALL (ACCEPT + REJECT)
- Retention: 90 days

## EKS Cluster Architecture

### Node Groups

| Node Group | Instance Types | Scaling | Purpose |
|------------|---------------|---------|---------|
| System | m6i.large | 2-4 nodes | CoreDNS, kube-proxy, add-ons |
| Application | m6i.xlarge, m6i.2xlarge | 3-20 nodes | Application workloads |

### Add-ons

- **vpc-cni**: Pod networking with ENI
- **coredns**: Cluster DNS
- **kube-proxy**: Network proxy
- **aws-ebs-csi-driver**: Persistent volume support

### IRSA (IAM Roles for Service Accounts)

Pod-level AWS permissions via OIDC federation:
- EBS CSI Driver role
- External Secrets Operator role
- Application service roles

## Database Architecture

### Aurora PostgreSQL Cluster

```
+------------------+
|  Writer Instance |
|  (db.r6g.large)  |
+--------+---------+
         |
    +----+----+
    |         |
    v         v
+--------+ +--------+
| Reader | | Reader |
|   #1   | |   #2   |
+--------+ +--------+
```

- **Engine**: Aurora PostgreSQL 15.4 (Serverless v2 capable)
- **Encryption**: KMS with auto-rotation
- **Backup**: 35-day retention, automated snapshots
- **Logs**: PostgreSQL logs exported to CloudWatch
- **Parameters**: pg_stat_statements, pgaudit enabled

## Compliance Architecture

| Region | Compliance Standards | Data Residency |
|--------|---------------------|----------------|
| Americas (us-east-1) | HIPAA, SOC2, ISO27001 | US only |
| Europe (eu-west-1) | GDPR, SOC2, ISO27001 | EU only |
| Africa (af-south-1) | POPIA, SOC2, ISO27001 | South Africa only |

### HIPAA Controls

- All data encrypted at rest (KMS)
- All data encrypted in transit (TLS 1.2+)
- Audit logging (CloudWatch, CloudTrail)
- Access controls (IAM, RBAC)
- PHI access logging (dedicated log group)
