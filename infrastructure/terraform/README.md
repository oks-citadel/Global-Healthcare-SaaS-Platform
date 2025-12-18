# UnifiedHealth Platform - Azure Infrastructure

This directory contains Terraform configurations for deploying the UnifiedHealth Platform infrastructure on Azure.

## Architecture Overview

The infrastructure consists of:

- **Azure Kubernetes Service (AKS)**: Container orchestration for microservices
- **Azure PostgreSQL Flexible Server**: Primary database with HIPAA-compliant configuration
- **Azure Redis Cache**: Session management and caching layer
- **Azure Container Registry (ACR)**: Private container image registry with geo-replication
- **Azure Key Vault**: Secrets and certificate management
- **Azure Storage Account**: Document storage with encryption and versioning
- **Azure Virtual Network**: Network isolation with subnets and NSGs
- **Log Analytics & Application Insights**: Monitoring and observability
- **Azure Monitor Alerts**: Proactive alerting for critical metrics

### Optional Modules

- **Azure Front Door**: Global CDN and load balancing with WAF
- **Azure Application Gateway**: Regional load balancing with WAF
- **Private Endpoints**: Private connectivity for Azure services

## Prerequisites

1. **Azure CLI** (>= 2.50.0)
   ```bash
   az --version
   az login
   ```

2. **Terraform** (>= 1.6.0)
   ```bash
   terraform --version
   ```

3. **Azure Subscription** with appropriate permissions
   - Contributor role or higher
   - Ability to create service principals and role assignments

4. **Backend Storage Account** for Terraform state
   - Run `./setup-backend.sh` to create storage accounts

## Directory Structure

```
terraform/
├── main.tf                      # Main infrastructure resources
├── variables.tf                 # Variable definitions
├── outputs.tf                   # Output definitions
├── backend.tf                   # Backend configuration
├── deploy.sh                    # Bash deployment script
├── deploy.ps1                   # PowerShell deployment script
├── setup-backend.sh             # Backend storage setup script
├── environments/
│   ├── dev.tfvars              # Development environment variables
│   ├── dev.tfbackend           # Development backend config
│   ├── staging.tfvars          # Staging environment variables
│   ├── staging.tfbackend       # Staging backend config
│   ├── prod.tfvars             # Production environment variables
│   └── prod.tfbackend          # Production backend config
└── modules/
    ├── frontdoor/              # Azure Front Door module
    ├── application-gateway/    # Application Gateway module
    └── private-endpoints/      # Private Endpoints module
```

## Quick Start

### 1. Setup Backend Storage

First-time setup to create Azure Storage accounts for Terraform state:

```bash
# Make script executable
chmod +x setup-backend.sh

# Run backend setup
./setup-backend.sh
```

This creates:
- Resource group: `unified-health-tfstate-rg`
- Storage accounts for dev, staging, and prod
- Blob containers with versioning and soft delete enabled

### 2. Configure Environment Variables

Create a `.tfvars` file for your environment or use the existing templates:

```bash
# Copy and customize for your environment
cp environments/dev.tfvars environments/dev.tfvars.local
```

Update the following sensitive values:
- `postgresql_admin_password`: Strong password for PostgreSQL
- `alert_email_address`: Email for infrastructure alerts

### 3. Deploy Infrastructure

#### Using Bash (Linux/macOS/WSL)

```bash
# Make script executable
chmod +x deploy.sh

# Plan deployment
./deploy.sh -e dev -a plan

# Apply deployment
./deploy.sh -e dev -a apply

# Destroy (if needed)
./deploy.sh -e dev -a destroy
```

#### Using PowerShell (Windows)

```powershell
# Plan deployment
.\deploy.ps1 -Environment dev -Action plan

# Apply deployment
.\deploy.ps1 -Environment dev -Action apply

# Destroy (if needed)
.\deploy.ps1 -Environment dev -Action destroy
```

### 4. Manual Deployment (Alternative)

If you prefer manual Terraform commands:

```bash
# Initialize with backend
terraform init -backend-config=environments/dev.tfbackend

# Plan
terraform plan -var-file=environments/dev.tfvars -out=dev.tfplan

# Apply
terraform apply dev.tfplan

# Show outputs
terraform output
```

## Environment-Specific Configurations

### Development

- **Cost-optimized** configuration
- Basic tier for PostgreSQL
- Standard tier for Redis
- Single-zone deployment
- Minimal node counts

### Staging

- **Production-like** setup with reduced capacity
- General Purpose PostgreSQL
- Standard Redis with moderate capacity
- Multi-zone capable
- Suitable for load testing

### Production

- **High-availability** configuration
- Memory-optimized PostgreSQL
- Premium Redis with geo-replication
- ACR geo-replication enabled
- Multi-zone deployment
- Enhanced monitoring and alerting
- Resource locks on critical resources

## Security Best Practices

### HIPAA Compliance

1. **Encryption**
   - All data encrypted at rest (Azure Storage Service Encryption)
   - TLS 1.2+ enforced for all connections
   - Private endpoints for internal traffic

2. **Network Isolation**
   - Virtual network with dedicated subnets
   - Network Security Groups (NSGs) with deny-by-default rules
   - Database accessible only from AKS subnet

3. **Access Control**
   - Azure RBAC for all resources
   - Key Vault for secrets management
   - Managed identities instead of service principals

4. **Audit & Monitoring**
   - All resources send logs to Log Analytics
   - Diagnostic settings enabled on all services
   - Real-time alerts for critical events
   - 90-day log retention

### Secrets Management

Never commit sensitive values to version control:

```bash
# Add to .gitignore
*.tfvars.local
*.tfstate
*.tfstate.backup
.terraform/
```

Use environment variables or Azure Key Vault for secrets:

```bash
export TF_VAR_postgresql_admin_password="your-secure-password"
```

## Monitoring & Alerting

The infrastructure includes comprehensive monitoring:

### Metrics Collected

- **AKS**: Node CPU/Memory, Pod counts, Network traffic
- **PostgreSQL**: CPU, Memory, Storage, Connections, Replication lag
- **Redis**: CPU, Memory, Cache hits/misses, Connected clients
- **Storage**: Transactions, Availability, Latency

### Alert Rules

- High CPU usage (>80%)
- High memory usage (>80%)
- High storage usage (>85%)
- Service availability issues
- Backup failures

### Accessing Logs

```bash
# Query logs using Azure CLI
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "AzureDiagnostics | take 10"
```

## Cost Optimization

### Development (~$200-300/month)

- Minimal node counts
- Basic tier services
- Single-region deployment

### Staging (~$500-700/month)

- Production-like but fewer nodes
- No geo-replication
- Standard tier services

### Production (~$1,500-2,500/month)

- High availability
- Geo-replication
- Premium tier services
- Auto-scaling enabled

### Cost Reduction Tips

1. Use Azure Reservations for 1-3 year commitments (up to 72% savings)
2. Enable auto-scaling to match demand
3. Use spot instances for non-critical workloads
4. Review and delete unused resources regularly
5. Use Azure Cost Management for tracking

## Troubleshooting

### Common Issues

#### 1. Terraform State Lock

```bash
# If state is locked, break the lease
az storage blob lease break \
  --container-name tfstate-dev \
  --blob-name dev/terraform.tfstate \
  --account-name unifiedhealthtfstatedev
```

#### 2. Backend Initialization Failed

```bash
# Check if storage account exists
az storage account show \
  --name unifiedhealthtfstatedev \
  --resource-group unified-health-tfstate-rg

# Verify authentication
az account show
```

#### 3. PostgreSQL Password Requirements

Password must:
- Be 8-128 characters long
- Contain characters from three categories: uppercase, lowercase, numbers, special characters
- Not contain username

#### 4. Resource Quota Limits

```bash
# Check quota usage
az vm list-usage --location eastus --output table

# Request quota increase through Azure Portal
```

### Debug Mode

Enable Terraform debug logging:

```bash
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform-debug.log
terraform plan -var-file=environments/dev.tfvars
```

## Disaster Recovery

### Backup Strategy

1. **PostgreSQL**: Automated backups with 35-day retention
2. **Storage Account**: Soft delete enabled (7-30 days retention)
3. **Terraform State**: Versioning and soft delete enabled

### Recovery Procedures

#### Restore PostgreSQL

```bash
az postgres flexible-server restore \
  --resource-group rg-unified-health-prod \
  --name psql-unified-health-prod-restored \
  --source-server psql-unified-health-prod \
  --restore-time "2024-01-15T13:10:00Z"
```

#### Restore Terraform State

```bash
# List state versions
az storage blob list \
  --container-name tfstate-prod \
  --account-name unifiedhealthtfstateprd \
  --include v

# Download specific version
az storage blob download \
  --container-name tfstate-prod \
  --name prod/terraform.tfstate \
  --version-id <version-id> \
  --file terraform.tfstate.backup
```

## Updating Infrastructure

### Safe Update Process

1. **Test in Dev**: Deploy changes to dev environment first
2. **Review Plan**: Always review `terraform plan` output
3. **Staging Validation**: Test in staging before production
4. **Backup**: Take manual backups before major changes
5. **Maintenance Window**: Schedule production updates during off-peak hours
6. **Rollback Plan**: Know how to revert changes if needed

### Rolling Back

```bash
# Restore previous state version
terraform state pull > backup.tfstate
terraform state push backup.tfstate

# Or use previous plan
terraform apply previous.tfplan
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Infrastructure

on:
  push:
    branches: [main]
    paths: ['infrastructure/terraform/**']

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Terraform Init
        run: terraform init -backend-config=environments/prod.tfbackend

      - name: Terraform Plan
        run: terraform plan -var-file=environments/prod.tfvars

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve -var-file=environments/prod.tfvars
```

## Additional Resources

- [Azure Terraform Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)
- [HIPAA on Azure](https://docs.microsoft.com/azure/compliance/offerings/offering-hipaa-us)
- [Azure Well-Architected Framework](https://docs.microsoft.com/azure/architecture/framework/)

## Support

For infrastructure issues or questions:
- Create an issue in the repository
- Contact the DevOps team
- Review Azure Service Health dashboard

## License

Copyright (c) 2024 UnifiedHealth Platform
