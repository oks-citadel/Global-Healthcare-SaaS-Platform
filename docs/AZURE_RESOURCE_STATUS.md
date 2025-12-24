# Azure Resource Status Report

**Generated:** 2025-12-24T00:30:00Z
**Action:** Resources shutdown for cost optimization

---

## Resources Stopped

| Resource Type              | Name                        | Resource Group         | Previous State | Current State       |
| -------------------------- | --------------------------- | ---------------------- | -------------- | ------------------- |
| AKS Cluster                | aks-unified-health-dev2     | rg-unified-health-dev2 | Running        | **Stopped**         |
| PostgreSQL Flexible Server | unified-health-postgres-dev | rg-unified-health-dev2 | Ready          | **Stopped**         |
| PostgreSQL Flexible Server | psql-unified-health-dev2    | rg-unified-health-dev2 | Stopped        | Stopped (unchanged) |

---

## Resources Still Running

| Resource Type            | Name                 | Notes                      |
| ------------------------ | -------------------- | -------------------------- |
| Azure Container Registry | acrunifiedhealthdev2 | Required for image storage |
| Virtual Network          | aks-vnet             | No compute cost            |
| Public IPs               | Various              | Minimal cost               |

---

## Important Notes

1. **PostgreSQL Auto-Start:** Azure will automatically start the PostgreSQL server after 7 days if not manually started. Monitor this to avoid unexpected costs.

2. **ACR Retention:** Container Registry is still active. Images will persist but incur storage costs. Consider implementing retention policies.

3. **Static Resources:** VNet, NSGs, and storage accounts remain active but have minimal or no cost when idle.

---

## How to Restart Resources

### Restart AKS Cluster

```bash
# Start the AKS cluster
az aks start --name aks-unified-health-dev2 --resource-group rg-unified-health-dev2

# Verify cluster is running
az aks show --name aks-unified-health-dev2 --resource-group rg-unified-health-dev2 --query "powerState.code"

# Get credentials
az aks get-credentials --name aks-unified-health-dev2 --resource-group rg-unified-health-dev2

# Verify nodes are ready
kubectl get nodes
```

### Restart PostgreSQL

```bash
# Start the PostgreSQL server
az postgres flexible-server start --name unified-health-postgres-dev --resource-group rg-unified-health-dev2

# Verify server is ready
az postgres flexible-server show --name unified-health-postgres-dev --resource-group rg-unified-health-dev2 --query "state"
```

### Full Environment Restart

```bash
# 1. Start PostgreSQL first (required for apps)
az postgres flexible-server start --name unified-health-postgres-dev --resource-group rg-unified-health-dev2

# 2. Wait for PostgreSQL to be ready (2-5 minutes)
watch -n 10 "az postgres flexible-server show --name unified-health-postgres-dev --resource-group rg-unified-health-dev2 --query 'state' -o tsv"

# 3. Start AKS cluster
az aks start --name aks-unified-health-dev2 --resource-group rg-unified-health-dev2

# 4. Wait for AKS to be ready (5-10 minutes)
watch -n 10 "az aks show --name aks-unified-health-dev2 --resource-group rg-unified-health-dev2 --query 'powerState.code' -o tsv"

# 5. Verify deployment
kubectl get pods -n unifiedhealth-production
```

---

## Estimated Savings

| Resource      | Approx. Cost/Hour | Status  | Savings        |
| ------------- | ----------------- | ------- | -------------- |
| AKS (2 nodes) | ~$0.20/hr         | Stopped | ~$4.80/day     |
| PostgreSQL    | ~$0.10/hr         | Stopped | ~$2.40/day     |
| **Total**     |                   |         | **~$7.20/day** |

_Note: Actual costs vary by region and usage. Check Azure Cost Management for accurate figures._

---

## Contact

For questions about Azure resource management:

- Infrastructure Team: infra@unifiedhealth.io
- DevOps: devops@unifiedhealth.io
