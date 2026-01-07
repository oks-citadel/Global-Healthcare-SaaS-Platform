# DNS-01 Challenge Implementation Guide for UnifiedHealth Platform

## Overview

This document provides comprehensive guidance for implementing DNS-01 ACME challenges with cert-manager on the UnifiedHealth EKS platform. DNS-01 is required when HTTP-01 challenges fail due to firewall restrictions on port 80.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Options](#solution-options)
3. [Recommended Approach: AWS Route53 with IRSA](#recommended-approach-aws-route53-with-irsa)
4. [Alternative: IAM User Credentials](#alternative-iam-user-credentials)
5. [Alternative: ACME-DNS for nip.io Domains](#alternative-acme-dns-for-nipio-domains)
6. [Implementation Steps](#implementation-steps)
7. [Troubleshooting](#troubleshooting)
8. [References](#references)

---

## Problem Statement

**Current Situation:**
- Platform: AWS EKS (`unified-health-eks`)
- Region: `us-east-1` (primary), `eu-west-1` (Europe), `af-south-1` (Africa)
- Current Domain: `api.thetheunifiedhealth.com`
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
- **Solution**: Use a real domain with Route53, or use ACME-DNS with CNAME delegation

---

## Solution Options

| Option | Pros | Cons | Recommended For |
|--------|------|------|-----------------|
| **Route53 + IRSA** | Most secure, no secrets to manage | Requires owned domain | Production |
| **Route53 + IAM User** | Works without IRSA | Requires secret management | Legacy clusters |
| **ACME-DNS** | Works with any domain via CNAME | Additional infrastructure | nip.io workaround |
| **External DNS Provider** | Flexibility | May have costs | Multi-cloud |

---

## Recommended Approach: AWS Route53 with IRSA

### Prerequisites

1. **Own a domain** (e.g., `theunifiedhealth.com`)
2. **Route53 Hosted Zone** in your AWS account
3. **EKS cluster** with OIDC provider enabled
4. **IAM Role** with Route53 permissions configured for IRSA

### Step 1: Enable OIDC Provider on EKS

```bash
# Check if OIDC provider is enabled
aws eks describe-cluster \
  --name unified-health-eks \
  --region us-east-1 \
  --query "cluster.identity.oidc.issuer" \
  --output text

# Associate OIDC provider (if not already done)
eksctl utils associate-iam-oidc-provider \
  --cluster unified-health-eks \
  --region us-east-1 \
  --approve

# Get the OIDC issuer URL
OIDC_ISSUER=$(aws eks describe-cluster \
  --name unified-health-eks \
  --region us-east-1 \
  --query "cluster.identity.oidc.issuer" \
  --output text)
echo "OIDC Issuer: $OIDC_ISSUER"
```

### Step 2: Create Route53 Hosted Zone

```bash
# Create hosted zone (if not exists)
aws route53 create-hosted-zone \
  --name theunifiedhealth.com \
  --caller-reference $(date +%s)

# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "theunifiedhealth.com" \
  --query "HostedZones[0].Id" \
  --output text | cut -d'/' -f3)
echo "Hosted Zone ID: $HOSTED_ZONE_ID"
```

**Important**: After creating the zone, update your domain registrar's nameservers to point to Route53. Get the nameservers with:

```bash
aws route53 get-hosted-zone \
  --id $HOSTED_ZONE_ID \
  --query "DelegationSet.NameServers" \
  --output text
```

### Step 3: Create IAM Policy for cert-manager

```bash
# Create IAM policy document
cat > cert-manager-route53-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "route53:GetChange",
            "Resource": "arn:aws:route53:::change/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets",
                "route53:ListResourceRecordSets"
            ],
            "Resource": "arn:aws:route53:::hostedzone/${HOSTED_ZONE_ID}"
        },
        {
            "Effect": "Allow",
            "Action": "route53:ListHostedZonesByName",
            "Resource": "*"
        }
    ]
}
EOF

# Create the policy
aws iam create-policy \
  --policy-name CertManagerRoute53Policy \
  --policy-document file://cert-manager-route53-policy.json
```

### Step 4: Create IAM Role for IRSA

```bash
# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
OIDC_PROVIDER=$(echo $OIDC_ISSUER | sed 's|https://||')

# Create trust policy
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "${OIDC_PROVIDER}:sub": "system:serviceaccount:cert-manager:cert-manager",
                    "${OIDC_PROVIDER}:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
EOF

# Create the role
aws iam create-role \
  --role-name CertManagerRoute53Role \
  --assume-role-policy-document file://trust-policy.json

# Attach the policy
aws iam attach-role-policy \
  --role-name CertManagerRoute53Role \
  --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/CertManagerRoute53Policy
```

### Step 5: Configure cert-manager with IRSA

```bash
# Annotate cert-manager service account
kubectl annotate serviceaccount cert-manager \
  -n cert-manager \
  eks.amazonaws.com/role-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:role/CertManagerRoute53Role

# Restart cert-manager to pick up new credentials
kubectl rollout restart deployment cert-manager -n cert-manager
```

Or install cert-manager with IRSA annotation:

```bash
helm upgrade cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.16.2 \
  --set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:role/CertManagerRoute53Role"
```

### Step 6: Apply ClusterIssuer

Edit `dns01-clusterissuer-route53.yaml` with your values:
- `region`: Your AWS region (e.g., `us-east-1`)
- `hostedZoneID`: Your Route53 hosted zone ID

```bash
# Apply the ClusterIssuer
kubectl apply -f dns01-clusterissuer-route53.yaml
```

### Step 7: Verify Configuration

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

## Alternative: IAM User Credentials

Use this if IRSA is not available.

### Create IAM User

```bash
# Create IAM user
aws iam create-user --user-name cert-manager-dns01

# Attach policy
aws iam attach-user-policy \
  --user-name cert-manager-dns01 \
  --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/CertManagerRoute53Policy

# Create access key
aws iam create-access-key --user-name cert-manager-dns01
# Save the AccessKeyId and SecretAccessKey
```

### Create Kubernetes Secret

```bash
kubectl create secret generic aws-route53-credentials \
  --namespace cert-manager \
  --from-literal=access-key-id="YOUR_ACCESS_KEY_ID" \
  --from-literal=secret-access-key="YOUR_SECRET_ACCESS_KEY"
```

### Apply IAM User ClusterIssuer

Edit `dns01-clusterissuer-aws-iam.yaml` with your values and apply:

```bash
kubectl apply -f dns01-clusterissuer-aws-iam.yaml
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
   _acme-challenge.api.your-ip.nip.io CNAME your-subdomain.acme-dns.server
   ```

4. **Apply acme-dns ClusterIssuer**:
   ```bash
   kubectl apply -f acme-dns-clusterissuer.yaml
   ```

---

## Implementation Steps Summary

### For Production (with owned domain):

```bash
# 1. Run the automated setup script
./setup-dns01-aws.sh

# 2. Update domain registrar nameservers (manual step)

# 3. Apply DNS-01 ClusterIssuer
kubectl apply -f dns01-clusterissuer-route53.yaml

# 4. Apply Certificates
kubectl apply -f dns01-certificate.yaml

# 5. Update Ingress to use DNS-01 certificates
kubectl apply -f ingress-dns01.yaml
```

### For Development (with nip.io):

Since nip.io doesn't support DNS-01, consider:

1. **Skip TLS for development** (not recommended for prod-like testing)
2. **Use a subdomain of your production domain** (e.g., `dev.theunifiedhealth.com`)
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
| `AccessDenied` | Check IAM role permissions and IRSA configuration |
| `NXDOMAIN` | DNS zone not propagated; wait or check nameservers |
| `Timeout` | Check network connectivity to Route53 API |
| `Unable to get TXT record` | Check DNS propagation with `dig _acme-challenge.domain TXT` |
| `AssumeRoleWithWebIdentity` error | Verify OIDC provider and trust policy |

### Verify DNS Propagation

```bash
# Check TXT record (during challenge)
dig _acme-challenge.theunifiedhealth.com TXT

# Check Route53 directly
aws route53 list-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --query "ResourceRecordSets[?Name=='_acme-challenge.theunifiedhealth.com.']"
```

---

## References

- [cert-manager Route53 Documentation](https://cert-manager.io/docs/configuration/acme/dns01/route53/)
- [cert-manager EKS Tutorial](https://cert-manager.io/docs/tutorials/getting-started-with-cert-manager-on-aws-eks/)
- [AWS IRSA Documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [Let's Encrypt Challenge Types](https://letsencrypt.org/docs/challenge-types/)
- [acme-dns GitHub](https://github.com/joohoi/acme-dns)
- [eksctl IRSA Documentation](https://eksctl.io/usage/iamserviceaccounts/)

---

## Files Created

| File | Purpose |
|------|---------|
| `dns01-clusterissuer-route53.yaml` | ClusterIssuer with IRSA (Route53) |
| `dns01-clusterissuer-aws-iam.yaml` | ClusterIssuer with IAM credentials |
| `dns01-certificate.yaml` | Certificate resources |
| `acme-dns-clusterissuer.yaml` | ACME-DNS ClusterIssuer (for nip.io workaround) |
| `ingress-dns01.yaml` | Updated Ingress with DNS-01 annotations |
| `setup-dns01-aws.sh` | Automated setup script for AWS |
