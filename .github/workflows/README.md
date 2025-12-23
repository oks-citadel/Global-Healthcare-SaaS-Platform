# GitHub Actions Workflows

## Active Workflows

### Web Frontend - Build & Deploy (`web-frontend-deploy.yml`)

Primary CI/CD workflow for the UnifiedHealth Platform.

**Triggers:**
- Push to `main` branch (paths: `apps/web/**`, `packages/sdk/**`)
- Manual workflow dispatch

**Jobs:**
1. **Build** - Builds SDK and web frontend, pushes to Azure Container Registry
2. **Security Scan** - Runs Trivy vulnerability scanner
3. **Deploy to AKS** - Optional deployment to Azure Kubernetes Service
4. **Notify** - Posts build status summary

### Test Actions (`test-actions.yml`)

Simple workflow for testing GitHub Actions configuration.

## Required Secrets

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Azure AD application client ID (OIDC) |
| `AZURE_TENANT_ID` | Azure AD tenant ID (OIDC) |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_CREDENTIALS` | Service principal credentials (fallback) |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) |

## Azure Resources

| Resource | Name |
|----------|------|
| Container Registry | `acrunifiedhealthdev2.azurecr.io` |
| Resource Group | `rg-unified-health-dev2` |
| AKS Cluster | `aks-unified-health-dev2` |

## Manual Deployment

```bash
gh workflow run "Web Frontend - Build & Deploy" \
  --field deploy_to_aks=true \
  --field environment=production
```

## Troubleshooting

```bash
# View workflow runs
gh run list --workflow="Web Frontend - Build & Deploy"

# View logs
gh run view <run-id> --log

# Check AKS status
kubectl get pods -n unifiedhealth-dev
```
