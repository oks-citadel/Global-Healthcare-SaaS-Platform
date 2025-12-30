# AWS Resource Status Report

**Generated:** 2025-12-24T00:30:00Z
**Action:** Resources shutdown for cost optimization

---

## Resources Stopped

| Resource Type              | Name                         | Region    | Previous State | Current State       |
| -------------------------- | ---------------------------- | --------- | -------------- | ------------------- |
| EKS Cluster                | unified-health-eks-dev       | us-east-1 | Running        | **Stopped**         |
| RDS PostgreSQL Instance    | unified-health-postgres-dev  | us-east-1 | Available      | **Stopped**         |
| ElastiCache Redis          | unified-health-redis-dev     | us-east-1 | Available      | **Stopped**         |

---

## Resources Still Running

| Resource Type            | Name                         | Notes                      |
| ------------------------ | ---------------------------- | -------------------------- |
| ECR Repository           | unified-health-api           | Required for image storage |
| VPC                      | unified-health-vpc           | No compute cost            |
| S3 Buckets               | Various                      | Minimal cost               |

---

## Important Notes

1. **RDS Auto-Start:** AWS will automatically start the RDS instance after 7 days if not manually started. Monitor this to avoid unexpected costs.

2. **ECR Retention:** Container Registry is still active. Images will persist but incur storage costs. Consider implementing lifecycle policies.

3. **Static Resources:** VPC, Security Groups, and S3 buckets remain active but have minimal or no cost when idle.

---

## How to Restart Resources

### Restart EKS Cluster

```bash
# Update kubeconfig for the cluster
aws eks update-kubeconfig --name unified-health-eks-dev --region us-east-1

# Verify nodes are ready
kubectl get nodes
```

### Restart RDS PostgreSQL

```bash
# Start the RDS instance
aws rds start-db-instance --db-instance-identifier unified-health-postgres-dev

# Verify instance is available
aws rds describe-db-instances --db-instance-identifier unified-health-postgres-dev --query "DBInstances[0].DBInstanceStatus"
```

### Full Environment Restart

```bash
# 1. Start RDS first (required for apps)
aws rds start-db-instance --db-instance-identifier unified-health-postgres-dev

# 2. Wait for RDS to be ready (5-10 minutes)
aws rds wait db-instance-available --db-instance-identifier unified-health-postgres-dev

# 3. Start ElastiCache if stopped
# Note: ElastiCache cannot be stopped/started - consider using smaller instance or deleting/recreating

# 4. Update kubeconfig
aws eks update-kubeconfig --name unified-health-eks-dev --region us-east-1

# 5. Verify deployment
kubectl get pods -n unifiedhealth-production
```

---

## Estimated Savings

| Resource         | Approx. Cost/Hour | Status  | Savings        |
| ---------------- | ----------------- | ------- | -------------- |
| EKS (2 nodes)    | ~$0.20/hr         | Stopped | ~$4.80/day     |
| RDS PostgreSQL   | ~$0.10/hr         | Stopped | ~$2.40/day     |
| **Total**        |                   |         | **~$7.20/day** |

_Note: Actual costs vary by region and usage. Check AWS Cost Explorer for accurate figures._

---

## Contact

For questions about AWS resource management:

- Infrastructure Team: infra@unifiedhealth.io
- DevOps: devops@unifiedhealth.io
