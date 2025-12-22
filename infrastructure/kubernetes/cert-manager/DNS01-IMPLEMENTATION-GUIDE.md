# DNS-01 Challenge Implementation Guide for UnifiedHealth Platform

## Overview

This document provides comprehensive guidance for implementing DNS-01 ACME challenges with cert-manager on the UnifiedHealth AKS platform. DNS-01 is required when HTTP-01 challenges fail due to firewall restrictions on port 80.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Options](#solution-options)
3. [Recommended Approach: Azure DNS with Workload Identity](#recommended-approach-azure-dns-with-workload-identity)
4. [Alternative: Service Principal Authentication](#alternative-service-principal-authentication)
5. [Alternative: ACME-DNS for nip.io Domains](#alternative-acme-dns-for-nipio-domains)
6. [Implementation Steps](#implementation-steps)
7. [Troubleshooting](#troubleshooting)
8. [References](#references)

---

## Problem Statement

**Current Situation:**
- Platform: Azure AKS (`aks-unified-health-dev2`)
- Resource Group: `rg-unified-health-dev2`
- Current Domain: `api.20-3-27-63.nip.io` (nip.io wildcard DNS)
- Issue: HTTP-01 challenge fails because external firewall blocks port 80
- cert-manager is installed with `letsencrypt-prod` ClusterIssuer

**Why DNS-01?**
- Does not require port 80 to be open
- Supports wildcard certificates (`*.domain.com`)
- Works behind firewalls, NAT, and load balancers
- Required for private/internal-only services

**nip.io Limitation:**
- nip.io is a wildcard DNS service that resolves `*.IP.nip.io` to the IP address
- You do NOT control the nip.io DNS zone
- DNS-01 challenges are NOT possible with nip.io directly
- **Solution**: Use a real domain with Azure DNS, or use ACME-DNS with CNAME delegation

---

## Solution Options

| Option | Pros | Cons | Recommended For |
|--------|------|------|-----------------|
| **Azure DNS + Workload Identity** | Most secure, no secrets to manage | Requires owned domain | Production |
| **Azure DNS + Service Principal** | Works without workload identity | Requires secret management | Legacy clusters |
| **ACME-DNS** | Works with any domain via CNAME | Additional infrastructure | nip.io workaround |
| **External DNS Provider** | Flexibility | May have costs | Multi-cloud |

---

## Recommended Approach: Azure DNS with Workload Identity

### Prerequisites

1. **Own a domain** (e.g., `unifiedhealth.com`)
2. **Azure DNS Zone** in your subscription
3. **AKS cluster** with OIDC issuer and workload identity enabled
4. **Managed Identity** with DNS Zone Contributor role

### Step 1: Enable Workload Identity on AKS

```bash
# Check if workload identity is enabled
az aks show \
  --name aks-unified-health-dev2 \
  --resource-group rg-unified-health-dev2 \
  --query "oidcIssuerProfile.enabled"

# Enable if not already enabled
az aks update \
  --name aks-unified-health-dev2 \
  --resource-group rg-unified-health-dev2 \
  --enable-oidc-issuer \
  --enable-workload-identity

# Get the OIDC issuer URL
az aks show \
  --name aks-unified-health-dev2 \
  --resource-group rg-unified-health-dev2 \
  --query "oidcIssuerProfile.issuerUrl" -o tsv
```

### Step 2: Create Azure DNS Zone

```bash
# Create resource group for DNS (if not exists)
az group create --name rg-unified-health-dns --location eastus

# Create DNS zone
az network dns zone create \
  --name unifiedhealth.com \
  --resource-group rg-unified-health-dns
```

**Important**: After creating the zone, update your domain registrar's nameservers to point to Azure DNS. Get the nameservers with:

```bash
az network dns zone show \
  --name unifiedhealth.com \
  --resource-group rg-unified-health-dns \
  --query "nameServers" -o tsv
```

### Step 3: Create Managed Identity for cert-manager

```bash
# Create managed identity
az identity create \
  --name id-cert-manager-dev2 \
  --resource-group rg-unified-health-dev2

# Get identity client ID
IDENTITY_CLIENT_ID=$(az identity show \
  --name id-cert-manager-dev2 \
  --resource-group rg-unified-health-dev2 \
  --query "clientId" -o tsv)

echo "Identity Client ID: $IDENTITY_CLIENT_ID"
```

### Step 4: Assign DNS Zone Contributor Role

```bash
# Get DNS zone ID
DNS_ZONE_ID=$(az network dns zone show \
  --name unifiedhealth.com \
  --resource-group rg-unified-health-dns \
  --query "id" -o tsv)

# Get identity principal ID
IDENTITY_PRINCIPAL_ID=$(az identity show \
  --name id-cert-manager-dev2 \
  --resource-group rg-unified-health-dev2 \
  --query "principalId" -o tsv)

# Assign DNS Zone Contributor role
az role assignment create \
  --assignee $IDENTITY_PRINCIPAL_ID \
  --role "DNS Zone Contributor" \
  --scope $DNS_ZONE_ID
```

### Step 5: Create Federated Credential

```bash
# Get AKS OIDC issuer URL
AKS_OIDC_ISSUER=$(az aks show \
  --name aks-unified-health-dev2 \
  --resource-group rg-unified-health-dev2 \
  --query "oidcIssuerProfile.issuerUrl" -o tsv)

# Create federated credential
az identity federated-credential create \
  --name cert-manager-federated \
  --identity-name id-cert-manager-dev2 \
  --resource-group rg-unified-health-dev2 \
  --issuer $AKS_OIDC_ISSUER \
  --subject "system:serviceaccount:cert-manager:cert-manager" \
  --audience "api://AzureADTokenExchange"
```

### Step 6: Update cert-manager with Workload Identity Labels

```bash
# Update cert-manager using Helm values
helm upgrade cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.16.2 \
  --values cert-manager-values.yaml \
  --set "serviceAccount.annotations.azure\.workload\.identity/client-id=$IDENTITY_CLIENT_ID" \
  --set "podLabels.azure\.workload\.identity/use=true"
```

### Step 7: Apply ClusterIssuer

Edit `dns01-clusterissuer-azure.yaml` with your values:
- `subscriptionID`: Your Azure subscription ID
- `resourceGroupName`: `rg-unified-health-dns`
- `hostedZoneName`: `unifiedhealth.com`
- `managedIdentity.clientID`: The managed identity client ID from Step 3

```bash
# Apply the ClusterIssuer
kubectl apply -f dns01-clusterissuer-azure.yaml
```

### Step 8: Verify Configuration

```bash
# Check ClusterIssuer status
kubectl describe clusterissuer letsencrypt-prod-dns01

# Check for ACME account registration
kubectl get secret -n cert-manager | grep letsencrypt

# Test with a certificate
kubectl apply -f dns01-certificate.yaml

# Check certificate status
kubectl describe certificate unified-health-tls-dns01 -n unified-health
```

---

## Alternative: Service Principal Authentication

Use this if workload identity is not available.

### Create Service Principal

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "sp-cert-manager-dns01" \
  --role "DNS Zone Contributor" \
  --scopes $DNS_ZONE_ID

# Output will include:
# - appId (clientID)
# - password (clientSecret)
# - tenant (tenantID)
```

### Create Kubernetes Secret

```bash
kubectl create secret generic azure-dns-sp-secret \
  --namespace cert-manager \
  --from-literal=client-secret="YOUR_SP_PASSWORD"
```

### Apply Service Principal ClusterIssuer

Edit `dns01-clusterissuer-azure-sp.yaml` with your values and apply:

```bash
kubectl apply -f dns01-clusterissuer-azure-sp.yaml
```

---

## Alternative: ACME-DNS for nip.io Domains

If you must use nip.io or don't have a custom domain, use ACME-DNS:

### How ACME-DNS Works

1. Deploy an acme-dns server (self-hosted or public)
2. Register your domain with acme-dns
3. Create a CNAME record: `_acme-challenge.your.nip.io -> your-subdomain.acme-dns.server`
4. cert-manager updates the acme-dns TXT record for DNS-01 challenges

### Setup Steps

1. **Deploy acme-dns** (example using Docker):
   ```bash
   docker run -d \
     -p 53:53 \
     -p 53:53/udp \
     -p 443:443 \
     --name acme-dns \
     joohoi/acme-dns
   ```

2. **Register your domain**:
   ```bash
   curl -X POST https://your-acme-dns-server/register
   ```

3. **Create CNAME in your DNS** (if you control a parent zone):
   ```
   _acme-challenge.api.20-3-27-63.nip.io CNAME your-subdomain.acme-dns.server
   ```

4. **Apply acme-dns ClusterIssuer**:
   ```bash
   kubectl apply -f acme-dns-clusterissuer.yaml
   ```

---

## Implementation Steps Summary

### For Production (with owned domain):

```bash
# 1. Prepare Azure resources (one-time setup)
terraform apply -target=module.dns

# 2. Update domain registrar nameservers (manual step)

# 3. Upgrade cert-manager with workload identity
helm upgrade cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --values cert-manager-values.yaml

# 4. Apply DNS-01 ClusterIssuer
kubectl apply -f dns01-clusterissuer-azure.yaml

# 5. Apply Certificates
kubectl apply -f dns01-certificate.yaml

# 6. Update Ingress to use DNS-01 certificates
kubectl apply -f ingress-dns01.yaml
```

### For Development (with nip.io):

Since nip.io doesn't support DNS-01, consider:

1. **Skip TLS for development** (not recommended for prod-like testing)
2. **Use a subdomain of your production domain** (e.g., `dev.unifiedhealth.com`)
3. **Use self-signed certificates** with cert-manager's `selfsigned-issuer`
4. **Deploy ACME-DNS** and configure CNAME delegation

---

## Troubleshooting

### Check cert-manager logs

```bash
kubectl logs -n cert-manager -l app.kubernetes.io/component=controller --tail=100
```

### Check Certificate status

```bash
kubectl describe certificate <name> -n <namespace>
kubectl describe certificaterequest <name> -n <namespace>
kubectl describe order <name> -n <namespace>
kubectl describe challenge <name> -n <namespace>
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `AuthorizationFailed` | Check managed identity role assignment |
| `NXDOMAIN` | DNS zone not propagated; wait or check nameservers |
| `Timeout` | Check network connectivity to Azure DNS API |
| `Unable to get TXT record` | Check DNS propagation with `dig _acme-challenge.domain TXT` |
| `401 Unauthorized` | Check workload identity configuration |

### Verify DNS Propagation

```bash
# Check TXT record (during challenge)
dig _acme-challenge.unifiedhealth.com TXT

# Check Azure DNS directly
az network dns record-set txt show \
  --zone-name unifiedhealth.com \
  --resource-group rg-unified-health-dns \
  --name _acme-challenge
```

---

## References

- [cert-manager Azure DNS Documentation](https://cert-manager.io/docs/configuration/acme/dns01/azuredns/)
- [cert-manager AKS Tutorial](https://cert-manager.io/docs/tutorials/getting-started-aks-letsencrypt/)
- [Azure Workload Identity](https://azure.github.io/azure-workload-identity/docs/)
- [Let's Encrypt Challenge Types](https://letsencrypt.org/docs/challenge-types/)
- [acme-dns GitHub](https://github.com/joohoi/acme-dns)
- [AKS DNS-01 Solver Example](https://github.com/Mimetis/AKS_DNS01Solver)

---

## Files Created

| File | Purpose |
|------|---------|
| `dns01-clusterissuer-azure.yaml` | ClusterIssuer with Workload Identity |
| `dns01-clusterissuer-azure-sp.yaml` | ClusterIssuer with Service Principal |
| `dns01-certificate.yaml` | Certificate resources |
| `acme-dns-clusterissuer.yaml` | ACME-DNS ClusterIssuer (for nip.io workaround) |
| `ingress-dns01.yaml` | Updated Ingress with DNS-01 annotations |
| `cert-manager-values.yaml` | Helm values for cert-manager |
| `dns-zone-cert-manager.tf` | Terraform for Azure DNS resources |
