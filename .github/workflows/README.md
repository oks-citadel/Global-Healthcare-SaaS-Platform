# CI/CD Pipeline Documentation

This directory contains all GitHub Actions workflows for the UnifiedHealth Global Platform. The CI/CD pipeline is designed for Azure Cloud deployment with comprehensive quality gates, security scanning, and deployment automation.

## Workflows Overview

### 1. CI Pipeline (`ci.yml`)

**Triggers:** Push/PR to main/develop branches

**Purpose:** Continuous Integration with comprehensive quality checks

**Jobs:**
- Linting and type checking
- Unit tests with coverage
- Integration tests (PostgreSQL + Redis)
- Security scanning (Trivy, npm audit)
- Docker image building for API and Web
- Terraform validation
- SBOM generation
- Auto-push to Azure ACR (main branch only)

**Quality Gates:**
- All linting must pass
- Type checking must pass
- Unit test coverage tracked
- Security vulnerabilities reported
- Docker images must scan clean

---

### 2. Docker Build (`docker-build.yml`)

**Triggers:** Push to main/develop/release branches, tags

**Purpose:** Build and push Docker images to Azure Container Registry

**Jobs:**
- Multi-service build (API, Web)
- Security scanning
- Image tagging with metadata
- SARIF upload to GitHub Security

**Features:**
- Matrix strategy for parallel builds
- GitHub Actions cache for faster builds
- Semantic versioning support
- Azure ACR integration

---

### 3. Staging Deployment (`deploy-staging.yml`)

**Triggers:** Push to main branch, manual dispatch

**Purpose:** Deploy to Azure AKS staging environment

**Jobs:**
- Build and test
- Push to Azure ACR
- Deploy to AKS
- Database migrations
- Smoke tests
- E2E tests with Playwright
- Slack/email notifications

**Features:**
- Automatic deployment on main branch
- Health checks before declaring success
- Rollout verification
- Post-deployment testing

---

### 4. Production Deployment (`deploy-production.yml`)

**Triggers:** Manual workflow dispatch only

**Purpose:** Deploy to production with blue-green strategy

**Jobs:**
- Pre-deployment checks (approval required)
- Database backup (Azure PostgreSQL)
- Build and security scan
- Blue-green deployment to AKS
- Traffic switching
- Automatic rollback on failure
- Notifications

**Features:**
- Manual approval gate
- Blue-green deployment strategy
- Zero-downtime deployment
- Automatic rollback
- Database backup before deployment
- Version tagging required

---

### 5. Database Migration (`database-migration.yml`)

**Triggers:** Manual workflow dispatch

**Purpose:** Standalone database migration workflow

**Jobs:**
- Pre-flight connectivity checks
- Database backup (production only)
- Migration execution (deploy/rollback/status/reset)
- Verification
- Automatic rollback on failure

**Features:**
- Dry-run mode
- Environment selection (staging/production)
- Migration types: deploy, rollback, status, reset
- Automatic backup for production
- Health checks post-migration

---

### 6. Manual Rollback (`rollback.yml`)

**Triggers:** Manual workflow dispatch (emergency use)

**Purpose:** Emergency rollback for production incidents

**Jobs:**
- Rollback validation
- Snapshot creation
- Deployment rollback (blue-green)
- Database rollback
- Verification
- Critical alerts

**Features:**
- Approval required for production
- Creates snapshot before rollback
- Supports deployment and/or database rollback
- Target version selection
- Comprehensive notifications

---

### 7. Release Automation (`release.yml`)

**Triggers:** Push to main, manual dispatch

**Purpose:** Automated semantic versioning and release creation

**Jobs:**
- Commit analysis (conventional commits)
- Version calculation (major/minor/patch)
- Changelog generation
- Build and test
- Git tag creation
- GitHub release creation
- Release Docker images

**Features:**
- Conventional commits parsing
- Automatic version bumping
- Changelog generation
- GitHub release notes
- Docker image tagging

---

### 8. Dependency Updates (`dependency-update.yml`)

**Triggers:** Weekly schedule (Monday 9 AM UTC), manual dispatch

**Purpose:** Automated dependency updates and security patches

**Jobs:**
- Check for outdated dependencies
- Update dependencies
- Run tests
- Create pull request
- Security audit (npm audit)
- Issue creation for vulnerabilities

**Features:**
- Automatic PR creation
- Security vulnerability tracking
- Scheduled weekly runs
- Audit reports

---

### 9. Security Scanning (`security-scan.yml`)

**Triggers:** Push/PR to main/develop, daily schedule, manual dispatch

**Purpose:** Comprehensive security analysis

**Jobs:**
- CodeQL analysis (JavaScript/TypeScript)
- Snyk vulnerability scanning
- OWASP dependency check
- Secret scanning (Gitleaks)
- Trivy filesystem scan
- NPM audit
- License compliance check
- Docker image security scan
- Security summary report

**Features:**
- Multiple security tools
- SARIF upload to GitHub Security
- Scheduled daily scans
- License compliance checking
- Comprehensive reporting

---

### 10. Azure Deployment (`azure-deploy.yml`)

**Purpose:** Azure-specific deployment automation

**Features:**
- Azure resource provisioning
- AKS cluster management
- Azure services integration
- Infrastructure as Code

---

## Secrets Configuration

### Required GitHub Secrets

```
AZURE_CREDENTIALS          # Azure service principal credentials
SNYK_TOKEN                 # Snyk API token
SLACK_WEBHOOK_URL          # Slack notifications
EMAIL_USERNAME             # Email notifications
EMAIL_PASSWORD             # Email notifications
NOTIFICATION_EMAIL         # Alert recipient email
GITLEAKS_LICENSE          # Gitleaks license (optional)
```

### Azure Key Vault Secrets

```
database-url              # PostgreSQL connection string
redis-url                 # Redis connection string
jwt-secret                # JWT signing secret
stripe-secret-key         # Stripe API key
stripe-webhook-secret     # Stripe webhook secret
```

## Environment Setup

### 1. GitHub Environments

Create the following environments in GitHub:

- `ci` - CI testing environment
- `staging` - Staging deployment
- `staging-approval` - Staging with approval
- `production` - Production deployment
- `production-approval` - Production with approval

### 2. Environment Variables

Each workflow uses these environment variables:

```yaml
NODE_VERSION: '20'
PNPM_VERSION: '9'
ACR_NAME: unifiedhealthacr
AKS_CLUSTER: unified-health-aks-{env}
RESOURCE_GROUP: unified-health-rg-{env}
NAMESPACE: unified-health-{env}
```

## Deployment Flow

### Standard Flow

```
Developer Push → CI Pipeline → Build Docker Images →
Deploy to Staging → Run Tests → Manual Approval →
Deploy to Production (Blue-Green) → Monitor → Success/Rollback
```

### Hotfix Flow

```
Hotfix Branch → CI Pipeline → Manual Deploy to Staging →
Test → Create Release → Deploy to Production → Monitor
```

### Rollback Flow

```
Incident Detected → Manual Rollback Workflow →
Create Snapshot → Switch to Previous Version →
Verify → Notify Team
```

## Best Practices

### 1. Commit Messages

Use conventional commits for automatic release notes:

```
feat: add new telemedicine feature
fix: resolve payment processing issue
docs: update API documentation
chore: update dependencies
BREAKING CHANGE: migrate to new API version
```

### 2. Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches
- `release/*` - Release branches

### 3. Version Tags

- Format: `v{major}.{minor}.{patch}`
- Example: `v1.2.3`
- Required for production deployments

### 4. Security

- Never commit secrets
- Use GitHub Secrets for sensitive data
- Azure Key Vault for runtime secrets
- Regular security scans
- Dependency updates weekly

## Monitoring and Alerts

### Slack Notifications

All workflows send notifications to Slack:
- Deployment status
- Security findings
- Rollback events
- Release notifications

### Email Alerts

Critical events trigger email alerts:
- Production deployment failures
- Database migration failures
- Rollback executions

### GitHub Security

- SARIF uploads for all security scans
- Security tab shows all findings
- Automated issue creation for vulnerabilities

## Troubleshooting

### Workflow Failures

1. Check workflow logs in GitHub Actions
2. Review failed job steps
3. Check Azure resources status
4. Verify secrets are configured
5. Check AKS cluster health

### Deployment Issues

1. Verify Docker images are pushed to ACR
2. Check AKS pod status: `kubectl get pods -n {namespace}`
3. Review pod logs: `kubectl logs {pod-name} -n {namespace}`
4. Check ingress configuration
5. Verify database migrations completed

### Rollback Issues

1. Check snapshot was created
2. Verify target version exists
3. Review rollback logs
4. Check database state
5. Verify traffic routing

## Performance Optimization

### Build Times

- GitHub Actions cache for dependencies
- Docker layer caching (BuildKit)
- Parallel job execution
- Matrix strategies for multi-service builds

### Deployment Speed

- Pre-built Docker images
- Blue-green for zero-downtime
- Parallel deployments where possible
- Optimized health check timing

## Maintenance

### Weekly Tasks

- Review dependency update PRs
- Check security scan results
- Monitor workflow performance
- Review failed workflows

### Monthly Tasks

- Update workflow versions
- Review and optimize build times
- Audit secret rotation
- Review monitoring metrics

## Support and Resources

- GitHub Actions Documentation: https://docs.github.com/actions
- Azure AKS Documentation: https://docs.microsoft.com/azure/aks/
- Helm Documentation: https://helm.sh/docs/
- Internal Wiki: (add your wiki link)

## Contributing

When modifying workflows:

1. Test in staging first
2. Document changes in this README
3. Update relevant documentation
4. Get peer review
5. Monitor first runs carefully

---

For questions or issues, contact the DevOps team or create an issue in the repository.
