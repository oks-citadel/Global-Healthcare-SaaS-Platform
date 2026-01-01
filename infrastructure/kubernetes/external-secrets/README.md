# External Secrets for UnifiedHealth Platform

This directory contains External Secrets Operator (ESO) configurations for syncing secrets from AWS Secrets Manager to Kubernetes.

## Prerequisites

1. **External Secrets Operator** installed in the cluster:
   ```bash
   helm repo add external-secrets https://charts.external-secrets.io
   helm install external-secrets external-secrets/external-secrets \
     -n external-secrets --create-namespace
   ```

2. **IAM Role for Service Accounts (IRSA)** configured:
   - Create an IAM role with Secrets Manager read access
   - Associate the role with the external-secrets ServiceAccount
   - Update the `eks.amazonaws.com/role-arn` annotation in `cluster-secret-store.yaml`

3. **AWS Secrets** created in Secrets Manager with the following structure:

   - `unified-health/database` - Database credentials
   - `unified-health/redis` - Redis credentials
   - `unified-health/jwt` - JWT and encryption keys
   - `unified-health/third-party` - Third-party API keys
   - `unified-health/hipaa` - HIPAA compliance encryption keys

## AWS Secrets Structure

### unified-health/database
```json
{
  "username": "unified_health",
  "password": "your-secure-password",
  "host": "aurora-cluster.xxxxx.us-east-1.rds.amazonaws.com",
  "port": "5432",
  "database": "unified_health"
}
```

### unified-health/redis
```json
{
  "auth_token": "your-redis-auth-token",
  "primary_endpoint": "redis-cluster.xxxxx.cache.amazonaws.com",
  "reader_endpoint": "redis-cluster-ro.xxxxx.cache.amazonaws.com",
  "port": "6379"
}
```

### unified-health/jwt
```json
{
  "jwt_secret": "your-jwt-secret-min-32-characters",
  "jwt_refresh_secret": "your-refresh-secret-min-32-characters",
  "encryption_key": "your-32-byte-encryption-key"
}
```

### unified-health/third-party
```json
{
  "sendgrid_api_key": "SG.xxx",
  "twilio_account_sid": "ACxxx",
  "twilio_auth_token": "xxx",
  "twilio_api_key": "SKxxx",
  "twilio_api_secret": "xxx",
  "stripe_secret_key": "sk_xxx",
  "stripe_webhook_secret": "whsec_xxx"
}
```

### unified-health/hipaa
```json
{
  "phi_encryption_key": "your-phi-encryption-key-256-bits",
  "data_encryption_key": "your-data-encryption-key-256-bits",
  "audit_encryption_key": "your-audit-encryption-key-256-bits",
  "backup_encryption_key": "your-backup-encryption-key-256-bits"
}
```

## Deployment

```bash
# Apply all external secrets
kubectl apply -k infrastructure/kubernetes/external-secrets/

# Verify secrets are synced
kubectl get externalsecrets -n unified-health
kubectl get secrets -n unified-health

# Check for sync errors
kubectl describe externalsecret database-credentials -n unified-health
```

## IAM Policy

The IAM role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:unified-health/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "arn:aws:kms:*:*:key/*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "secretsmanager.*.amazonaws.com"
        }
      }
    }
  ]
}
```

## Troubleshooting

1. **Secret not syncing**: Check the ExternalSecret status
   ```bash
   kubectl describe externalsecret <name> -n unified-health
   ```

2. **Permission denied**: Verify IRSA configuration
   ```bash
   kubectl describe serviceaccount external-secrets-sa -n external-secrets
   ```

3. **Secret not found**: Ensure the secret exists in AWS Secrets Manager
   ```bash
   aws secretsmanager describe-secret --secret-id unified-health/database
   ```
