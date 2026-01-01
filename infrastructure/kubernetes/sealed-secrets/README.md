# Sealed Secrets for UnifiedHealth Platform

This directory contains Sealed Secrets configurations as an alternative to External Secrets Operator for managing Kubernetes secrets.

## Overview

Sealed Secrets allows you to encrypt secrets that can only be decrypted by the Sealed Secrets controller running in your cluster. The encrypted secrets can be safely stored in Git.

## Prerequisites

1. **Sealed Secrets Controller** installed in the cluster:
   ```bash
   helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
   helm install sealed-secrets sealed-secrets/sealed-secrets \
     -n kube-system
   ```

2. **kubeseal CLI** installed locally:
   ```bash
   # macOS
   brew install kubeseal

   # Linux
   wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-0.24.0-linux-amd64.tar.gz
   tar -xvzf kubeseal-0.24.0-linux-amd64.tar.gz
   sudo mv kubeseal /usr/local/bin/
   ```

## Creating Sealed Secrets

### Step 1: Create a regular Kubernetes secret

```bash
# Create secret from literal values
kubectl create secret generic database-credentials \
  --namespace=unified-health \
  --from-literal=DB_USERNAME=unified_health \
  --from-literal=DB_PASSWORD='your-secure-password' \
  --from-literal=DB_HOST=aurora-cluster.xxxxx.us-east-1.rds.amazonaws.com \
  --dry-run=client -o yaml > /tmp/database-secret.yaml
```

### Step 2: Seal the secret

```bash
# Seal the secret using the cluster's public key
kubeseal --format=yaml < /tmp/database-secret.yaml > sealed-secrets/sealed-database-credentials.yaml

# Clean up the unencrypted secret
rm /tmp/database-secret.yaml
```

### Step 3: Apply the sealed secret

```bash
kubectl apply -f sealed-secrets/sealed-database-credentials.yaml
```

## Using the Sealing Script

A helper script is provided to simplify secret sealing:

```bash
# Make the script executable
chmod +x seal-secret.sh

# Seal a secret
./seal-secret.sh database-credentials unified-health \
  "DB_USERNAME=unified_health" \
  "DB_PASSWORD=your-password" \
  "DB_HOST=aurora.xxxxx.rds.amazonaws.com"
```

## Directory Structure

```
sealed-secrets/
├── README.md                          # This file
├── seal-secret.sh                     # Helper script for sealing secrets
├── sealed-database-credentials.yaml   # Sealed database credentials
├── sealed-redis-credentials.yaml      # Sealed Redis credentials
├── sealed-jwt-secrets.yaml            # Sealed JWT/auth secrets
├── sealed-third-party-secrets.yaml    # Sealed third-party API keys
└── sealed-hipaa-secrets.yaml          # Sealed HIPAA compliance keys
```

## Security Considerations

1. **Never commit unencrypted secrets** - Only sealed secrets should be stored in Git
2. **Rotate controller keys periodically** - Use `kubeseal --fetch-cert` to get the current public key
3. **Backup controller keys** - The controller's private key is essential for decryption
4. **Namespace scoping** - Sealed secrets are scoped to a specific namespace by default

## Comparison with External Secrets

| Feature | Sealed Secrets | External Secrets |
|---------|---------------|------------------|
| Secret Storage | Git (encrypted) | AWS Secrets Manager |
| Rotation | Manual re-seal | Automatic |
| Audit Trail | Git history | CloudTrail |
| Complexity | Lower | Higher |
| External Dependencies | None | AWS |

## Troubleshooting

1. **Decryption failed**: Ensure the sealed secret was created for the correct cluster
2. **Wrong namespace**: Sealed secrets are namespace-bound by default
3. **Controller restart**: Secrets may need re-sealing if controller keys change
