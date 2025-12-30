# Deployment Checklist - Unified Healthcare Platform (AWS)

Use this checklist to ensure all prerequisites and deployment steps are completed before going live on AWS infrastructure.

## Pre-Deployment Checklist

### AWS Infrastructure

- [ ] AWS account is active and accessible
- [ ] AWS Organizations configured (if multi-account)
- [ ] IAM users/roles created with appropriate permissions
- [ ] Service Control Policies (SCPs) configured for compliance

### Amazon EKS Cluster

- [ ] EKS cluster created and running
- [ ] EKS cluster version is 1.29 or later
- [ ] OIDC provider enabled for IRSA
- [ ] EKS add-ons installed:
  - [ ] VPC CNI
  - [ ] CoreDNS
  - [ ] kube-proxy
  - [ ] EBS CSI Driver
- [ ] Node groups configured:
  - [ ] System node group (m6i.large, 2-4 nodes)
  - [ ] Application node group (m6i.xlarge, 2-10 nodes)
- [ ] Cluster Autoscaler configured
- [ ] AWS Load Balancer Controller installed

### Amazon ECR (Container Registry)

- [ ] ECR repositories created for all services:
  - [ ] `unified-health/api-gateway`
  - [ ] `unified-health/telehealth-service`
  - [ ] `unified-health/mental-health-service`
  - [ ] `unified-health/chronic-care-service`
  - [ ] `unified-health/pharmacy-service`
  - [ ] `unified-health/laboratory-service`
  - [ ] `unified-health/auth-service`
  - [ ] `unified-health/web-app`
  - [ ] `unified-health/provider-portal`
  - [ ] `unified-health/admin-portal`
- [ ] Image scanning enabled on push
- [ ] Lifecycle policies configured for image retention
- [ ] Cross-region replication configured (if multi-region)

### Amazon RDS for PostgreSQL

- [ ] RDS instance or Aurora cluster created
- [ ] Engine version: PostgreSQL 15.x
- [ ] Instance class: db.r6g.large or higher
- [ ] Multi-AZ deployment enabled
- [ ] Encryption at rest enabled (KMS)
- [ ] Automated backups enabled (35 days retention)
- [ ] Performance Insights enabled
- [ ] Enhanced Monitoring enabled
- [ ] Security group configured (EKS nodes only)
- [ ] Parameter group configured for optimization
- [ ] Database subnet group configured

### Amazon ElastiCache for Redis

- [ ] ElastiCache cluster created
- [ ] Engine version: Redis 7.x
- [ ] Node type: cache.r6g.large
- [ ] Cluster mode enabled (if required)
- [ ] Multi-AZ with automatic failover
- [ ] Encryption at rest enabled
- [ ] Encryption in transit enabled
- [ ] Auth token configured
- [ ] Security group configured (EKS nodes only)
- [ ] Subnet group configured

### Amazon S3 Buckets

- [ ] Document storage bucket created
- [ ] Medical imaging bucket created
- [ ] Backup bucket created
- [ ] Terraform state bucket created
- [ ] Versioning enabled on all buckets
- [ ] Server-side encryption enabled (SSE-S3 or SSE-KMS)
- [ ] Bucket policies configured
- [ ] CORS configuration (if needed)
- [ ] Lifecycle rules for archival to Glacier
- [ ] Cross-region replication (if required)

### AWS Secrets Manager

- [ ] `unified-health/database` - PostgreSQL connection string
- [ ] `unified-health/database-username` - Database username
- [ ] `unified-health/database-password` - Database password
- [ ] `unified-health/jwt-secret` - JWT signing secret
- [ ] `unified-health/jwt-refresh-secret` - JWT refresh token secret
- [ ] `unified-health/redis-auth-token` - Redis AUTH token
- [ ] `unified-health/encryption-key` - Data encryption key
- [ ] `unified-health/encryption-key-id` - Encryption key identifier
- [ ] `unified-health/phi-encryption-key` - PHI-specific encryption key
- [ ] `unified-health/sendgrid-api-key` - SendGrid API key
- [ ] `unified-health/twilio-account-sid` - Twilio account SID
- [ ] `unified-health/twilio-auth-token` - Twilio auth token
- [ ] `unified-health/s3-access-key` - S3 access credentials (if not using IRSA)
- [ ] `unified-health/oauth-client-id` - OAuth client ID
- [ ] `unified-health/oauth-client-secret` - OAuth client secret
- [ ] `unified-health/session-secret` - Session encryption secret
- [ ] `unified-health/webhook-signing-secret` - Webhook signature verification
- [ ] `unified-health/stripe-api-key` - Stripe API key (if using)
- [ ] `unified-health/stripe-webhook-secret` - Stripe webhook secret
- [ ] Automatic rotation configured for applicable secrets

### Amazon Route 53 DNS

- [ ] Hosted zone created for domain
- [ ] A/ALIAS records configured:
  - [ ] `api.unifiedhealth.com` - Production API
  - [ ] `api-staging.unifiedhealth.com` - Staging API
  - [ ] `app.unifiedhealth.com` - Web application
- [ ] Health checks configured
- [ ] Failover routing policies (if multi-region)
- [ ] Latency-based routing (if multi-region)
- [ ] DNSSEC enabled (optional)

### Networking (VPC)

- [ ] VPC created with appropriate CIDR (e.g., 10.10.0.0/16)
- [ ] Public subnets (3 AZs) for load balancers
- [ ] Private subnets (3 AZs) for EKS nodes
- [ ] Database subnets (3 AZs) for RDS
- [ ] ElastiCache subnets (3 AZs) for Redis
- [ ] NAT Gateways (one per AZ for HA)
- [ ] Internet Gateway attached
- [ ] Route tables configured
- [ ] VPC Flow Logs enabled
- [ ] VPC Endpoints for AWS services:
  - [ ] S3 Gateway endpoint
  - [ ] ECR API/DKR endpoints
  - [ ] Secrets Manager endpoint
  - [ ] STS endpoint
  - [ ] CloudWatch Logs endpoint

### Security

- [ ] AWS WAF configured with ALB
- [ ] AWS Shield Standard enabled (automatic)
- [ ] AWS Shield Advanced enabled (optional)
- [ ] Security Hub enabled
- [ ] GuardDuty enabled
- [ ] CloudTrail enabled
- [ ] Config rules for compliance
- [ ] KMS keys created for encryption
- [ ] IAM policies follow least privilege

### Kubernetes Components

- [ ] kubectl installed and configured
- [ ] kustomize installed (v5.0+)
- [ ] Helm installed (v3.12+)
- [ ] AWS Load Balancer Controller installed
- [ ] NGINX Ingress Controller installed
- [ ] cert-manager installed
- [ ] cert-manager ClusterIssuer configured (Route 53 DNS01)
- [ ] AWS Secrets Store CSI Driver installed
- [ ] Metrics Server installed
- [ ] Prometheus installed (optional)
- [ ] Grafana installed (optional)
- [ ] Fluent Bit for CloudWatch Logs

### AWS IRSA Configuration

- [ ] OIDC provider created for EKS cluster
- [ ] IAM roles created for service accounts:
  - [ ] `unified-health-api-role` - API service role
  - [ ] `aws-load-balancer-controller-role` - ALB controller
  - [ ] `cert-manager-role` - cert-manager for Route 53
  - [ ] `external-dns-role` - ExternalDNS (if using)
  - [ ] `cluster-autoscaler-role` - Cluster Autoscaler
- [ ] Trust relationships configured with OIDC
- [ ] IAM policies attached with minimal permissions

### Application Configuration

- [ ] Docker images built and pushed to ECR
- [ ] Image tags properly versioned (semantic versioning)
- [ ] Database migrations prepared
- [ ] ConfigMaps reviewed and customized
- [ ] Environment variables validated
- [ ] Feature flags configured appropriately
- [ ] CORS origins configured correctly
- [ ] Rate limits configured appropriately

## Staging Deployment Checklist

### Pre-Deployment

- [ ] Connect to EKS cluster: `aws eks update-kubeconfig --region us-east-1 --name unified-health-staging-americas-eks`
- [ ] Verify kubectl context: `kubectl config current-context`
- [ ] Verify node status: `kubectl get nodes`
- [ ] Create staging namespace: `kubectl create namespace unified-health-staging`
- [ ] Review staging kustomization: `kustomize build overlays/staging | less`
- [ ] Set environment variables:
  ```bash
  export AWS_ACCOUNT_ID="your-account-id"
  export AWS_REGION="us-east-1"
  export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
  ```

### Deployment

- [ ] Authenticate to ECR: `aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}`
- [ ] Deploy to staging: `kubectl apply -k overlays/staging`
- [ ] Wait for rollout: `kubectl rollout status deployment -n unified-health-staging`
- [ ] Verify pods are running: `kubectl get pods -n unified-health-staging`
- [ ] Check pod logs for errors: `kubectl logs -n unified-health-staging -l app=unified-health-api`
- [ ] Verify services: `kubectl get svc -n unified-health-staging`
- [ ] Verify ingress: `kubectl get ingress -n unified-health-staging`
- [ ] Check certificate status: `kubectl get certificate -n unified-health-staging`
- [ ] Verify ALB created: `aws elbv2 describe-load-balancers --query "LoadBalancers[?contains(LoadBalancerName, 'staging')]"`

### Post-Deployment Validation

- [ ] Test health endpoint: `curl https://api-staging.unifiedhealth.com/health`
- [ ] Test readiness endpoint: `curl https://api-staging.unifiedhealth.com/ready`
- [ ] Test API authentication
- [ ] Test database connectivity (RDS)
- [ ] Test Redis connectivity (ElastiCache)
- [ ] Test S3 file upload functionality
- [ ] Test email notifications (SendGrid/SES)
- [ ] Test SMS notifications (Twilio/SNS)
- [ ] Verify CloudWatch logs are being collected
- [ ] Verify Prometheus metrics are being scraped
- [ ] Test autoscaling behavior
- [ ] Run integration tests
- [ ] Run end-to-end tests
- [ ] Performance testing (load testing)
- [ ] Security scanning (OWASP ZAP, etc.)

## Production Deployment Checklist

### Pre-Deployment

- [ ] All staging tests passed
- [ ] Code review completed
- [ ] Security review completed
- [ ] Compliance review completed (HIPAA, GDPR, POPIA)
- [ ] Backup current production state
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window (if needed)
- [ ] Notify stakeholders of deployment
- [ ] Connect to production EKS: `aws eks update-kubeconfig --region us-east-1 --name unified-health-prod-americas-eks`
- [ ] Create production namespace: `kubectl create namespace unified-health-production`
- [ ] Review production kustomization: `kustomize build overlays/production | less`
- [ ] Verify production image tags (use specific versions, not `latest`)

### Deployment

- [ ] Deploy to production: `kubectl apply -k overlays/production`
- [ ] Monitor rollout: `kubectl rollout status deployment -n unified-health-production`
- [ ] Verify pods are running: `kubectl get pods -n unified-health-production -w`
- [ ] Check pod logs: `kubectl logs -n unified-health-production -l app=unified-health-api --tail=100`
- [ ] Verify all 3 replicas are healthy
- [ ] Verify services: `kubectl get svc -n unified-health-production`
- [ ] Verify ingress: `kubectl get ingress -n unified-health-production`
- [ ] Verify certificate is valid: `kubectl describe certificate -n unified-health-production`
- [ ] Verify HPA is active: `kubectl get hpa -n unified-health-production`
- [ ] Verify PDB is configured: `kubectl get pdb -n unified-health-production`
- [ ] Verify ALB health: `aws elbv2 describe-target-health --target-group-arn <target-group-arn>`

### Post-Deployment Validation

- [ ] Test health endpoint: `curl https://api.unifiedhealth.com/health`
- [ ] Test readiness endpoint: `curl https://api.unifiedhealth.com/ready`
- [ ] Test API authentication from production client
- [ ] Verify database connections (no connection pool exhaustion)
- [ ] Verify Redis connections
- [ ] Test critical user workflows
- [ ] Verify audit logging is working (CloudWatch Logs)
- [ ] Verify encryption is working (PHI data)
- [ ] Check SSL/TLS certificate is valid
- [ ] Test from multiple geographic locations
- [ ] Monitor error rates in CloudWatch
- [ ] Monitor response times (X-Ray traces)
- [ ] Monitor resource utilization (CPU, memory)
- [ ] Verify autoscaling behavior
- [ ] Test disaster recovery procedures
- [ ] Verify AWS Backup is running

### Security Validation

- [ ] Network policies are enforced
- [ ] Security groups properly configured
- [ ] RBAC roles are properly configured
- [ ] Service account has minimal required permissions (IRSA)
- [ ] Pods are running as non-root user
- [ ] Read-only root filesystem is enabled
- [ ] No capabilities are granted unnecessarily
- [ ] Secrets are not exposed in logs
- [ ] TLS/SSL is enforced (ALB + NGINX)
- [ ] Rate limiting is active
- [ ] AWS WAF rules are active
- [ ] DDoS protection is configured (AWS Shield)
- [ ] Security headers are present in responses
- [ ] GuardDuty findings reviewed
- [ ] Security Hub compliance score acceptable

### Compliance Validation (HIPAA/GDPR/POPIA)

- [ ] PHI data is encrypted at rest (KMS)
- [ ] PHI data is encrypted in transit (TLS 1.2+)
- [ ] Audit logging is enabled and comprehensive (CloudTrail + CloudWatch)
- [ ] Access controls are properly configured (IAM + RBAC)
- [ ] Data retention policies are implemented (S3 lifecycle)
- [ ] Right to erasure is supported (GDPR/POPIA)
- [ ] Consent management is implemented
- [ ] Data breach notification procedures are in place
- [ ] Privacy policy is displayed and accessible
- [ ] Terms of service are displayed and accessible
- [ ] AWS Config rules passing
- [ ] Business Associate Agreement (BAA) in place with AWS

## Monitoring Setup

- [ ] CloudWatch Container Insights enabled
- [ ] CloudWatch alarms configured for:
  - [ ] High error rate (5xx errors)
  - [ ] High response time (p99 latency)
  - [ ] High CPU usage (>80%)
  - [ ] High memory usage (>80%)
  - [ ] Pod crashes (CrashLoopBackOff)
  - [ ] Certificate expiration (<30 days)
  - [ ] RDS connection failures
  - [ ] ElastiCache connection failures
  - [ ] S3 access errors
- [ ] SNS topics for alarm notifications
- [ ] CloudWatch dashboards created
- [ ] X-Ray tracing enabled
- [ ] Prometheus/Grafana dashboards (optional)
- [ ] On-call rotation is configured (PagerDuty/OpsGenie)
- [ ] Incident response procedures are documented
- [ ] Runbooks are created for common issues

## Documentation

- [ ] Deployment documentation is up-to-date
- [ ] Architecture diagrams are current
- [ ] API documentation is published
- [ ] Runbooks are accessible to on-call team
- [ ] Disaster recovery procedures are documented
- [ ] Contact information is current
- [ ] Escalation procedures are documented

## Rollback Preparation

- [ ] Previous version tag is documented
- [ ] Rollback command is prepared:
  ```bash
  kubectl rollout undo deployment/unified-health-api -n unified-health-production
  ```
- [ ] Database migration rollback is prepared (if applicable)
- [ ] Rollback testing is completed in staging
- [ ] Rollback decision criteria are defined
- [ ] Rollback approval process is defined

## Post-Deployment

- [ ] Monitor application for 24 hours
- [ ] Review CloudWatch logs daily for first week
- [ ] Review GuardDuty findings
- [ ] Conduct post-deployment review meeting
- [ ] Document lessons learned
- [ ] Update runbooks based on deployment experience
- [ ] Archive deployment artifacts
- [ ] Send deployment success notification to stakeholders
- [ ] Update cost tracking/budgets

## Emergency Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| DevOps Lead | | | 24/7 |
| Platform Engineer | | | Business hours |
| Database Administrator | | | On-call |
| Security Officer | | | On-call |
| Compliance Officer | | | Business hours |
| AWS TAM | | | Business hours |

## Rollback Procedure

If issues are detected post-deployment:

1. **Assess severity**: Determine if immediate rollback is needed
2. **Notify team**: Alert relevant stakeholders via Slack/PagerDuty
3. **Execute rollback**:
   ```bash
   kubectl rollout undo deployment/unified-health-api -n unified-health-production
   ```
4. **Verify rollback**: Ensure previous version is running correctly
5. **Check ALB targets**: Verify all targets are healthy
6. **Investigate issue**: Determine root cause using CloudWatch Logs and X-Ray
7. **Document incident**: Create post-mortem document
8. **Fix and redeploy**: Address issue and redeploy when ready

## Sign-Off

- [ ] DevOps Lead approval
- [ ] Platform Engineer approval
- [ ] Security Officer approval
- [ ] Product Manager approval
- [ ] CTO approval (for production)

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Approved By**: _______________
**Version**: _______________
**AWS Account ID**: _______________
**EKS Cluster**: _______________

---

**Last Updated**: 2025-12-29
