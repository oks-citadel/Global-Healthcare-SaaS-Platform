# CI/CD Pipeline Validation Checklist

This checklist ensures all CI/CD components are properly configured and tested before production use.

## Pre-Deployment Validation

### GitHub Configuration

- [ ] All required secrets configured in GitHub Settings
  - [ ] `AZURE_CREDENTIALS`
  - [ ] `SNYK_TOKEN`
  - [ ] `SLACK_WEBHOOK_URL`
  - [ ] `EMAIL_USERNAME`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `NOTIFICATION_EMAIL`

- [ ] GitHub Environments created
  - [ ] `ci`
  - [ ] `staging`
  - [ ] `staging-approval`
  - [ ] `production`
  - [ ] `production-approval`

- [ ] Branch protection rules configured
  - [ ] `main` branch requires PR reviews
  - [ ] `main` branch requires status checks
  - [ ] `develop` branch configured

### Azure Configuration

- [ ] Azure Container Registry (ACR) created
  - [ ] Name: `unifiedhealthacr`
  - [ ] Service principal access configured
  - [ ] Image retention policies set

- [ ] Azure Kubernetes Service (AKS) clusters created
  - [ ] Staging: `unified-health-aks-staging`
  - [ ] Production: `unified-health-aks-prod`
  - [ ] Node pools configured
  - [ ] Auto-scaling enabled

- [ ] Azure PostgreSQL Flexible Server created
  - [ ] Staging database configured
  - [ ] Production database configured
  - [ ] Automatic backups enabled
  - [ ] Firewall rules configured

- [ ] Azure Redis Cache created
  - [ ] Staging instance configured
  - [ ] Production instance configured
  - [ ] SSL enabled

- [ ] Azure Key Vault created
  - [ ] Staging: `unified-health-kv-staging`
  - [ ] Production: `unified-health-kv-production`
  - [ ] All required secrets stored
  - [ ] Access policies configured

### Kubernetes Configuration

- [ ] Namespaces created
  - [ ] `unified-health-staging`
  - [ ] `unified-health-prod`

- [ ] Secrets created in each namespace
  - [ ] `acr-secret` (ACR credentials)
  - [ ] `unified-health-secrets` (application secrets)

- [ ] Ingress controller installed
  - [ ] NGINX ingress controller
  - [ ] SSL certificates configured

- [ ] Cert-manager installed
  - [ ] Let's Encrypt issuer configured
  - [ ] Auto-renewal enabled

## Workflow Validation

### 1. CI Pipeline (`ci.yml`)

- [ ] Workflow syntax is valid (`act --list` or manual check)
- [ ] All jobs defined:
  - [ ] `lint`
  - [ ] `test-unit`
  - [ ] `test-integration`
  - [ ] `security-scan`
  - [ ] `build-api`
  - [ ] `build-web`
  - [ ] `terraform-validate`
  - [ ] `push-images`
  - [ ] `trigger-staging-deploy`

- [ ] Test workflow on feature branch
- [ ] Verify linting runs correctly
- [ ] Verify tests execute
- [ ] Verify security scans complete
- [ ] Verify Docker builds succeed

### 2. Docker Build (`docker-build.yml`)

- [ ] Workflow syntax is valid
- [ ] Matrix strategy configured correctly
- [ ] Azure ACR login works
- [ ] Images build successfully
- [ ] Security scanning runs
- [ ] SARIF upload works

### 3. Staging Deployment (`deploy-staging.yml`)

- [ ] Workflow syntax is valid
- [ ] Can trigger manually
- [ ] Azure authentication works
- [ ] AKS credentials retrieved
- [ ] Database migrations run
- [ ] Deployments succeed
- [ ] Health checks pass
- [ ] Smoke tests run
- [ ] Notifications sent

### 4. Production Deployment (`deploy-production.yml`)

- [ ] Workflow syntax is valid
- [ ] Manual trigger only
- [ ] Approval gate works
- [ ] Pre-deployment checks pass
- [ ] Database backup created
- [ ] Blue-green deployment works
- [ ] Traffic switching succeeds
- [ ] Rollback mechanism tested
- [ ] Notifications sent

### 5. Database Migration (`database-migration.yml`)

- [ ] Workflow syntax is valid
- [ ] Environment selection works
- [ ] Migration types all work:
  - [ ] Deploy
  - [ ] Rollback
  - [ ] Status
  - [ ] Reset (non-production only)
- [ ] Dry-run mode works
- [ ] Backup creation works
- [ ] Verification runs

### 6. Rollback (`rollback.yml`)

- [ ] Workflow syntax is valid
- [ ] Manual trigger works
- [ ] Approval required for production
- [ ] Snapshot creation works
- [ ] Deployment rollback works
- [ ] Database rollback works
- [ ] Verification succeeds
- [ ] Critical alerts sent

### 7. Release Automation (`release.yml`)

- [ ] Workflow syntax is valid
- [ ] Commit analysis works
- [ ] Version calculation correct
- [ ] Changelog generation works
- [ ] Git tag creation works
- [ ] GitHub release created
- [ ] Docker images tagged
- [ ] Notifications sent

### 8. Dependency Updates (`dependency-update.yml`)

- [ ] Workflow syntax is valid
- [ ] Schedule configured correctly
- [ ] Dependency check works
- [ ] PR creation works
- [ ] Security audit runs
- [ ] Issue creation works

### 9. Security Scanning (`security-scan.yml`)

- [ ] Workflow syntax is valid
- [ ] CodeQL analysis runs
- [ ] Snyk scanning works
- [ ] OWASP check runs
- [ ] Secret scanning works
- [ ] Trivy scanning works
- [ ] License checking works
- [ ] SARIF uploads work

### 10. Dependabot (`dependabot.yml`)

- [ ] Configuration syntax valid
- [ ] All package ecosystems covered
- [ ] Schedule configured
- [ ] PR limits set
- [ ] Labels configured

## Helm Chart Validation

- [ ] Chart structure correct
- [ ] `Chart.yaml` valid
- [ ] `values.yaml` complete
- [ ] Environment values files created
  - [ ] `values-staging.yaml`
  - [ ] `values-production.yaml`

- [ ] All templates created:
  - [ ] `_helpers.tpl`
  - [ ] `serviceaccount.yaml`
  - [ ] `api-deployment.yaml`
  - [ ] `web-deployment.yaml`
  - [ ] `service.yaml`
  - [ ] `ingress.yaml`
  - [ ] `configmap.yaml`
  - [ ] `hpa.yaml`
  - [ ] `pdb.yaml`
  - [ ] `networkpolicy.yaml`
  - [ ] `pvc.yaml`
  - [ ] `NOTES.txt`

- [ ] Helm lint passes
  ```bash
  helm lint ./infrastructure/helm/unified-health
  ```

- [ ] Dry-run installation works
  ```bash
  helm install --dry-run --debug unified-health ./infrastructure/helm/unified-health
  ```

- [ ] Template rendering correct
  ```bash
  helm template unified-health ./infrastructure/helm/unified-health
  ```

## Integration Testing

### Staging Workflow Test

1. [ ] Create feature branch
2. [ ] Make code change
3. [ ] Push to GitHub
4. [ ] CI pipeline runs automatically
5. [ ] All checks pass
6. [ ] Create PR to main
7. [ ] PR checks pass
8. [ ] Merge PR
9. [ ] Staging deployment triggers
10. [ ] Application deployed successfully
11. [ ] Health checks pass
12. [ ] E2E tests pass

### Production Workflow Test

1. [ ] Trigger release workflow
2. [ ] Version tag created
3. [ ] GitHub release created
4. [ ] Trigger production deployment
5. [ ] Provide approval
6. [ ] Database backup created
7. [ ] Blue-green deployment succeeds
8. [ ] Health checks pass
9. [ ] Traffic switched
10. [ ] Old deployment scaled down

### Database Migration Test

1. [ ] Trigger migration workflow
2. [ ] Select staging environment
3. [ ] Choose "status" migration type
4. [ ] Verify status check runs
5. [ ] Trigger with "deploy" type
6. [ ] Verify migration runs
7. [ ] Verify verification succeeds

### Rollback Test

1. [ ] Deploy version v1.0.0
2. [ ] Verify deployment
3. [ ] Deploy version v1.0.1
4. [ ] Trigger rollback to v1.0.0
5. [ ] Verify snapshot created
6. [ ] Verify rollback succeeds
7. [ ] Verify health checks pass

## Security Validation

- [ ] No secrets in code
- [ ] All secrets in GitHub Secrets or Azure Key Vault
- [ ] SARIF uploads to GitHub Security
- [ ] Security tab shows findings
- [ ] Secret scanning enabled
- [ ] Dependabot alerts enabled
- [ ] CodeQL scanning enabled

## Monitoring Validation

- [ ] Slack notifications received
- [ ] Email alerts received
- [ ] GitHub status checks visible
- [ ] Deployment logs accessible
- [ ] Metrics visible in Azure Monitor
- [ ] Application Insights configured

## Performance Validation

- [ ] CI pipeline completes in < 15 minutes
- [ ] Docker builds use cache effectively
- [ ] Staging deployment completes in < 10 minutes
- [ ] Production deployment completes in < 15 minutes
- [ ] Database migrations complete in < 5 minutes

## Documentation Validation

- [ ] Workflow README created
- [ ] Helm README created
- [ ] Implementation summary created
- [ ] Validation checklist created (this file)
- [ ] All documentation accurate and complete

## Final Checks

- [ ] All workflows successfully tested
- [ ] No critical vulnerabilities in code
- [ ] All secrets properly secured
- [ ] Monitoring and alerting working
- [ ] Rollback procedures tested
- [ ] Team trained on workflows
- [ ] Documentation reviewed
- [ ] Production deployment approved

## Sign-off

Once all items are checked, the CI/CD pipeline is ready for production use.

**Validated By:** ________________________

**Date:** ________________________

**Approved By:** ________________________

**Date:** ________________________

---

## Troubleshooting Common Issues

### Workflow Fails

1. Check workflow logs in GitHub Actions
2. Verify all secrets are configured
3. Check Azure resource availability
4. Verify syntax with `act --list`

### Deployment Fails

1. Check AKS cluster health
2. Verify pod status with `kubectl get pods`
3. Check pod logs with `kubectl logs`
4. Verify secrets are mounted correctly

### Security Scan Fails

1. Review SARIF report
2. Check for actual vulnerabilities vs. false positives
3. Update dependencies if needed
4. Adjust security thresholds if appropriate

### Helm Install Fails

1. Run `helm lint` to check syntax
2. Verify all required secrets exist
3. Check values files for errors
4. Use `--dry-run --debug` to troubleshoot

---

**Note:** This checklist should be reviewed and updated regularly as the pipeline evolves.
