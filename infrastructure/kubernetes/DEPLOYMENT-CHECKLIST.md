# Deployment Checklist - Unified Healthcare Platform

Use this checklist to ensure all prerequisites and deployment steps are completed before going live.

## Pre-Deployment Checklist

### Azure Infrastructure

- [ ] Azure subscription is active and accessible
- [ ] Resource group created: `unified-health-rg`
- [ ] AKS cluster created and running
- [ ] AKS cluster has workload identity enabled
- [ ] AKS cluster has OIDC issuer enabled
- [ ] ACR created and attached to AKS
- [ ] Azure Database for PostgreSQL created
- [ ] Azure Cache for Redis created
- [ ] Azure Key Vault created
- [ ] Virtual Network configured
- [ ] Network Security Groups configured
- [ ] Azure Monitor workspace created
- [ ] Application Insights instance created

### Azure Key Vault Secrets

- [ ] `database-url` - PostgreSQL connection string
- [ ] `database-username` - Database username
- [ ] `database-password` - Database password
- [ ] `jwt-secret` - JWT signing secret
- [ ] `jwt-refresh-secret` - JWT refresh token secret
- [ ] `redis-password` - Redis password
- [ ] `encryption-key` - Data encryption key
- [ ] `encryption-key-id` - Encryption key identifier
- [ ] `data-encryption-key` - General data encryption
- [ ] `phi-encryption-key` - PHI-specific encryption key
- [ ] `sendgrid-api-key` - SendGrid API key
- [ ] `twilio-account-sid` - Twilio account SID
- [ ] `twilio-auth-token` - Twilio auth token
- [ ] `azure-storage-account-name` - Storage account name
- [ ] `azure-storage-account-key` - Storage account key
- [ ] `oauth-client-id` - OAuth client ID
- [ ] `oauth-client-secret` - OAuth client secret
- [ ] `session-secret` - Session encryption secret
- [ ] `webhook-signing-secret` - Webhook signature verification
- [ ] `stripe-api-key` - Stripe API key (if using)
- [ ] `stripe-webhook-secret` - Stripe webhook secret

### Kubernetes Components

- [ ] kubectl installed and configured
- [ ] kustomize installed (v5.0+)
- [ ] Helm installed (v3.12+)
- [ ] NGINX Ingress Controller installed
- [ ] cert-manager installed
- [ ] cert-manager ClusterIssuer configured
- [ ] Azure Workload Identity webhook installed
- [ ] Metrics Server installed
- [ ] Cluster Autoscaler installed (optional)
- [ ] Prometheus installed (optional)
- [ ] Grafana installed (optional)

### Azure Workload Identity Configuration

- [ ] Azure AD application created
- [ ] Service principal created
- [ ] Federated identity credential created
- [ ] OIDC issuer URL obtained from AKS
- [ ] Key Vault access permissions granted
- [ ] Storage account access permissions granted
- [ ] Database access permissions granted (if using managed identity)

### DNS Configuration

- [ ] Domain purchased and configured
- [ ] DNS zone created in Azure DNS or external provider
- [ ] A record for staging: `api-staging.unifiedhealth.com`
- [ ] A record for production: `api.unifiedhealth.com`
- [ ] Wildcard certificate configured (optional)
- [ ] DNS propagation verified

### Application Configuration

- [ ] Docker images built and pushed to ACR
- [ ] Image tags properly versioned
- [ ] Database migrations ready
- [ ] ConfigMaps reviewed and customized
- [ ] Environment variables validated
- [ ] Feature flags configured appropriately
- [ ] CORS origins configured correctly
- [ ] Rate limits configured appropriately

## Staging Deployment Checklist

### Pre-Deployment

- [ ] Connect to AKS cluster
- [ ] Verify kubectl context: `kubectl config current-context`
- [ ] Create staging namespace: `kubectl create namespace unified-health-staging`
- [ ] Review staging kustomization: `kustomize build overlays/staging | less`
- [ ] Set environment variables (ACR_LOGIN_SERVER, AZURE_CLIENT_ID, etc.)

### Deployment

- [ ] Deploy to staging: `kubectl apply -k overlays/staging`
- [ ] Wait for rollout: `kubectl rollout status deployment -n unified-health-staging`
- [ ] Verify pods are running: `kubectl get pods -n unified-health-staging`
- [ ] Check pod logs for errors: `kubectl logs -n unified-health-staging -l app=unified-health-api`
- [ ] Verify services: `kubectl get svc -n unified-health-staging`
- [ ] Verify ingress: `kubectl get ingress -n unified-health-staging`
- [ ] Check certificate status: `kubectl get certificate -n unified-health-staging`

### Post-Deployment Validation

- [ ] Test health endpoint: `curl https://api-staging.unifiedhealth.com/health`
- [ ] Test readiness endpoint: `curl https://api-staging.unifiedhealth.com/ready`
- [ ] Test API authentication
- [ ] Test database connectivity
- [ ] Test Redis connectivity
- [ ] Test file upload functionality
- [ ] Test email notifications
- [ ] Test SMS notifications (if applicable)
- [ ] Verify logs are being collected
- [ ] Verify metrics are being scraped
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
- [ ] Compliance review completed (HIPAA, GDPR)
- [ ] Backup current production state
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window (if needed)
- [ ] Notify stakeholders of deployment
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

### Post-Deployment Validation

- [ ] Test health endpoint: `curl https://api.unifiedhealth.com/health`
- [ ] Test readiness endpoint: `curl https://api.unifiedhealth.com/ready`
- [ ] Test API authentication from production client
- [ ] Verify database connections (no connection pool exhaustion)
- [ ] Verify Redis connections
- [ ] Test critical user workflows
- [ ] Verify audit logging is working
- [ ] Verify encryption is working (PHI data)
- [ ] Check SSL/TLS certificate is valid
- [ ] Test from multiple geographic locations
- [ ] Monitor error rates in Application Insights
- [ ] Monitor response times
- [ ] Monitor resource utilization (CPU, memory)
- [ ] Verify autoscaling behavior
- [ ] Test disaster recovery procedures
- [ ] Verify backups are running

### Security Validation

- [ ] Network policies are enforced
- [ ] RBAC roles are properly configured
- [ ] Service account has minimal required permissions
- [ ] Pods are running as non-root user
- [ ] Read-only root filesystem is enabled
- [ ] No capabilities are granted unnecessarily
- [ ] Secrets are not exposed in logs
- [ ] TLS/SSL is enforced
- [ ] Rate limiting is active
- [ ] WAF rules are active (ModSecurity)
- [ ] DDoS protection is configured
- [ ] Security headers are present in responses

### Compliance Validation (HIPAA/GDPR)

- [ ] PHI data is encrypted at rest
- [ ] PHI data is encrypted in transit
- [ ] Audit logging is enabled and comprehensive
- [ ] Access controls are properly configured
- [ ] Data retention policies are implemented
- [ ] Right to erasure is supported
- [ ] Consent management is implemented
- [ ] Data breach notification procedures are in place
- [ ] Privacy policy is displayed and accessible
- [ ] Terms of service are displayed and accessible

## Monitoring Setup

- [ ] Prometheus scraping is configured
- [ ] Grafana dashboards are created
- [ ] Alerts are configured for:
  - [ ] High error rate
  - [ ] High response time
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Pod crashes
  - [ ] Certificate expiration
  - [ ] Database connection failures
  - [ ] Redis connection failures
- [ ] On-call rotation is configured
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
- [ ] Rollback command is prepared
- [ ] Database migration rollback is prepared (if applicable)
- [ ] Rollback testing is completed in staging
- [ ] Rollback decision criteria are defined
- [ ] Rollback approval process is defined

## Post-Deployment

- [ ] Monitor application for 24 hours
- [ ] Review error logs daily for first week
- [ ] Conduct post-deployment review meeting
- [ ] Document lessons learned
- [ ] Update runbooks based on deployment experience
- [ ] Archive deployment artifacts
- [ ] Send deployment success notification to stakeholders

## Emergency Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| DevOps Lead | | | 24/7 |
| Platform Engineer | | | Business hours |
| Database Administrator | | | On-call |
| Security Officer | | | On-call |
| Compliance Officer | | | Business hours |

## Rollback Procedure

If issues are detected post-deployment:

1. **Assess severity**: Determine if immediate rollback is needed
2. **Notify team**: Alert relevant stakeholders
3. **Execute rollback**:
   ```bash
   kubectl rollout undo deployment/unified-health-api -n unified-health-production
   ```
4. **Verify rollback**: Ensure previous version is running correctly
5. **Investigate issue**: Determine root cause
6. **Document incident**: Create post-mortem document
7. **Fix and redeploy**: Address issue and redeploy when ready

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

---

**Last Updated**: 2025-12-17
