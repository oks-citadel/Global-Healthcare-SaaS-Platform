# Quick Deployment Guide - UnifiedHealth Platform Infrastructure

## Prerequisites Checklist

- [ ] Azure CLI installed (`az --version`)
- [ ] Terraform >= 1.6.0 installed (`terraform --version`)
- [ ] Azure subscription access with Contributor role
- [ ] Logged in to Azure (`az login`)
- [ ] Selected correct subscription (`az account set --subscription <id>`)

## First-Time Setup (One-time)

### Step 1: Create Backend Storage

```bash
# Make script executable
chmod +x setup-backend.sh

# Run backend setup
./setup-backend.sh
```

**What this creates**:
- Resource group: `unified-health-tfstate-rg`
- 3 storage accounts (dev, staging, prod)
- Blob containers with versioning and soft delete

### Step 2: Set Required Secrets

Edit the appropriate environment file:

```bash
# For dev environment
vim environments/dev.tfvars
```

**Required values to set**:
```hcl
# PostgreSQL password (CHANGE THIS!)
postgresql_admin_password = "YourSecurePassword123!"

# Alert email (CHANGE THIS!)
alert_email_address = "your-email@example.com"

# Optional: Webhook for alerts (Slack, PagerDuty)
alert_webhook_url = "your-slack-webhook-url"
```

**Password Requirements**:
- 8-128 characters
- Mix of uppercase, lowercase, numbers, special characters
- Must not contain username

## Deploy to Development

### Quick Deploy (Bash)

```bash
# Review what will be created
./deploy.sh -e dev -a plan

# Deploy infrastructure
./deploy.sh -e dev -a apply

# Auto-approve (skip confirmation)
./deploy.sh -e dev -a apply -y
```

### Quick Deploy (PowerShell)

```powershell
# Review what will be created
.\deploy.ps1 -Environment dev -Action plan

# Deploy infrastructure
.\deploy.ps1 -Environment dev -Action apply

# Auto-approve (skip confirmation)
.\deploy.ps1 -Environment dev -Action apply -AutoApprove
```

### Manual Deploy

```bash
# Initialize Terraform
terraform init -backend-config=environments/dev.tfbackend

# Review plan
terraform plan -var-file=environments/dev.tfvars -out=dev.tfplan

# Apply changes
terraform apply dev.tfplan

# View outputs
terraform output
```

## Deploy to Staging

Same as dev, but use `-e staging` or `-Environment staging`:

```bash
./deploy.sh -e staging -a plan
./deploy.sh -e staging -a apply
```

## Deploy to Production

**IMPORTANT**: Production has extra safeguards!

```bash
# Always plan first
./deploy.sh -e prod -a plan

# Review plan carefully
# Apply (requires confirmation)
./deploy.sh -e prod -a apply
```

**Production Checklist**:
- [ ] Tested in dev and staging
- [ ] Reviewed Terraform plan output
- [ ] Notified team of deployment
- [ ] Scheduled during maintenance window
- [ ] Have rollback plan ready

## After Deployment

### 1. Verify Infrastructure

```bash
# Get outputs
terraform output

# Check AKS cluster
az aks get-credentials --resource-group rg-unified-health-dev --name aks-unified-health-dev
kubectl get nodes

# Test PostgreSQL connection
psql "host=$(terraform output -raw postgresql_fqdn) port=5432 dbname=unified_health user=unifiedhealth_admin sslmode=require"
```

### 2. Configure Kubernetes

```bash
# Navigate to Kubernetes configs
cd ../kubernetes

# Deploy infrastructure components
kubectl apply -f namespaces/
kubectl apply -f config/
```

### 3. Set Up Monitoring

```bash
# Get Application Insights connection string
terraform output application_insights_connection_string

# Add to your application configuration
# APPLICATIONINSIGHTS_CONNECTION_STRING=<value>
```

## Common Tasks

### View Current State

```bash
# List all resources
terraform state list

# Show specific resource
terraform state show azurerm_kubernetes_cluster.main
```

### Update Infrastructure

```bash
# Modify variables in environments/*.tfvars
vim environments/dev.tfvars

# Plan changes
./deploy.sh -e dev -a plan

# Apply if plan looks good
./deploy.sh -e dev -a apply
```

### Destroy Infrastructure

**WARNING**: This will delete ALL resources!

```bash
# Development
./deploy.sh -e dev -a destroy

# Staging
./deploy.sh -e staging -a destroy

# Production (extra confirmation required)
./deploy.sh -e prod -a destroy
# Type "destroy-prod" when prompted
```

## Troubleshooting

### Issue: State Lock Error

```bash
# Break the lease on state blob
az storage blob lease break \
  --container-name tfstate-dev \
  --blob-name dev/terraform.tfstate \
  --account-name unifiedhealthtfstatedev
```

### Issue: Backend Not Found

```bash
# Verify storage account exists
az storage account show \
  --name unifiedhealthtfstatedev \
  --resource-group unified-health-tfstate-rg

# Re-run backend setup if needed
./setup-backend.sh
```

### Issue: Invalid Credentials

```bash
# Check current account
az account show

# Login again
az login

# Select correct subscription
az account set --subscription "Your Subscription Name"
```

### Issue: Quota Exceeded

```bash
# Check quota
az vm list-usage --location eastus --output table

# Request increase via Azure Portal:
# Portal > Subscriptions > Usage + quotas
```

## Security Reminders

### Never Commit These Files

```bash
# Add to .gitignore
*.tfvars.local
*.tfstate
*.tfstate.backup
.terraform/
*.tfplan
terraform-debug.log
```

### Rotate Secrets Regularly

```bash
# Update PostgreSQL password
az postgres flexible-server update \
  --resource-group rg-unified-health-prod \
  --name psql-unified-health-prod \
  --admin-password "NewSecurePassword456!"

# Update in Terraform state
terraform apply -var="postgresql_admin_password=NewSecurePassword456!" \
  -var-file=environments/prod.tfvars
```

### Review Access Regularly

```bash
# List role assignments
az role assignment list \
  --resource-group rg-unified-health-prod \
  --output table
```

## Monitoring & Alerts

### View Logs

```bash
# Portal: Azure Monitor > Log Analytics Workspaces > log-unified-health-prod

# Query logs via CLI
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "AzureDiagnostics | where TimeGenerated > ago(1h) | take 100"
```

### Check Alerts

```bash
# List active alerts
az monitor metrics alert list \
  --resource-group rg-unified-health-prod \
  --output table
```

### View Costs

```bash
# Portal: Cost Management + Billing > Cost Analysis

# Filter by resource group: rg-unified-health-prod
# Group by: Resource or Service
# Timeframe: Last 30 days
```

## Backup & Recovery

### Manual Backup Before Changes

```bash
# Backup Terraform state
terraform state pull > backup-$(date +%Y%m%d-%H%M%S).tfstate

# Backup PostgreSQL
az postgres flexible-server backup create \
  --resource-group rg-unified-health-prod \
  --name psql-unified-health-prod \
  --backup-name manual-backup-$(date +%Y%m%d)
```

### Restore from Backup

```bash
# Restore PostgreSQL to point in time
az postgres flexible-server restore \
  --resource-group rg-unified-health-prod \
  --name psql-unified-health-prod-restored \
  --source-server psql-unified-health-prod \
  --restore-time "2024-12-17T13:00:00Z"

# Restore Terraform state
terraform state push backup-20241217-130000.tfstate
```

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/infrastructure.yml`:

```yaml
name: Deploy Infrastructure

on:
  push:
    branches: [main]
    paths: ['infrastructure/terraform/**']
  pull_request:
    paths: ['infrastructure/terraform/**']

env:
  TF_VERSION: 1.6.0

jobs:
  terraform:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging, prod]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Terraform Init
        run: |
          cd infrastructure/terraform
          terraform init -backend-config=environments/${{ matrix.environment }}.tfbackend

      - name: Terraform Plan
        run: |
          cd infrastructure/terraform
          terraform plan -var-file=environments/${{ matrix.environment }}.tfvars

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && matrix.environment != 'prod'
        run: |
          cd infrastructure/terraform
          terraform apply -auto-approve -var-file=environments/${{ matrix.environment }}.tfvars
```

### Required Secrets

Add to GitHub repository secrets:
- `AZURE_CREDENTIALS`: Service principal JSON
- `TF_VAR_postgresql_admin_password`: Database password
- `TF_VAR_alert_email_address`: Alert email

## Next Steps

After infrastructure deployment:

1. **Deploy Applications**
   ```bash
   cd ../kubernetes
   ./deploy.sh
   ```

2. **Configure DNS**
   - Get Application Gateway public IP
   - Create A record: `api.yourdomain.com -> <public-ip>`
   - Create A record: `app.yourdomain.com -> <public-ip>`

3. **SSL Certificates**
   - Import SSL certificate to Key Vault
   - Update Application Gateway configuration
   - Enable HTTPS redirect

4. **Initialize Database**
   ```bash
   # Run migrations
   kubectl exec -it <api-pod> -- npm run migrate

   # Seed initial data
   kubectl exec -it <api-pod> -- npm run seed
   ```

5. **Test Application**
   ```bash
   # Get ingress IP
   kubectl get ingress -n unified-health

   # Test health endpoint
   curl https://api.yourdomain.com/health
   ```

## Support

For issues or questions:
- Check logs in Azure Portal (Log Analytics)
- Review Terraform documentation
- Contact DevOps team
- Create issue in repository

---

**Quick Reference Card**

| Task | Command |
|------|---------|
| Deploy dev | `./deploy.sh -e dev -a apply` |
| Deploy staging | `./deploy.sh -e staging -a apply` |
| Deploy prod | `./deploy.sh -e prod -a apply` |
| Destroy dev | `./deploy.sh -e dev -a destroy` |
| View outputs | `terraform output` |
| Get kubeconfig | `az aks get-credentials -g rg-unified-health-dev -n aks-unified-health-dev` |
| View logs | Portal > Log Analytics > Logs |
| Check costs | Portal > Cost Management |

---

**Document Version**: 1.0.0
**Last Updated**: December 17, 2024
