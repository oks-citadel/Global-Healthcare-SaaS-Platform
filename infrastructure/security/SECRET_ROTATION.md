# Secret Rotation Procedures

**Document Version:** 1.0.0
**Last Updated:** 2025-12-31
**Classification:** CONFIDENTIAL
**Review Frequency:** Quarterly
**Next Review:** 2026-03-31

## Overview

This document outlines the procedures for rotating secrets and credentials used by the Global Healthcare SaaS Platform. Regular secret rotation is a critical security practice mandated by HIPAA, SOC 2, and industry best practices.

## Rotation Schedule Summary

| Secret Type | Rotation Frequency | Automated | Owner |
|-------------|-------------------|-----------|-------|
| JWT Signing Keys | 90 days | Yes | Platform Team |
| Database Credentials | 90 days | Yes | Database Team |
| API Keys | 90 days | Partial | Platform Team |
| Encryption Keys (PHI) | 90 days | Yes | Security Team |
| TLS/SSL Certificates | 365 days | Yes | Infrastructure Team |
| Service Account Tokens | 90 days | Yes | Platform Team |
| OAuth Client Secrets | 180 days | No | Identity Team |
| Webhook Secrets | 90 days | No | Integration Team |

## Secret Storage Locations

### Production Secrets

| Provider | Service | Use Case |
|----------|---------|----------|
| AWS Secrets Manager | Primary | PHI encryption keys, database credentials |
| Azure Key Vault | Secondary | JWT keys, API keys, certificates |
| HashiCorp Vault | Optional | Dynamic secrets, PKI |
| Kubernetes Secrets | Runtime | Pod-injected secrets (sealed secrets) |

### Development Secrets

- Local `.env` files (never committed)
- `.env.example` for template reference
- Development-only secrets in secure password manager

## Rotation Procedures

### 1. JWT Signing Key Rotation

**Frequency:** Every 90 days
**Automation:** AWS Lambda + Secrets Manager

#### Procedure

1. **Generate New Key**
   ```bash
   # Generate new 256-bit secret
   openssl rand -base64 32 > new-jwt-secret.txt
   ```

2. **Store in Secrets Manager**
   ```bash
   aws secretsmanager update-secret \
     --secret-id unifiedhealth/jwt-secret \
     --secret-string file://new-jwt-secret.txt
   ```

3. **Enable Dual-Key Period**
   - Configure application to accept both old and new keys
   - Duration: 24 hours (allows existing tokens to expire)

4. **Update Kubernetes Secrets**
   ```bash
   kubectl create secret generic jwt-secret \
     --from-file=JWT_SECRET=new-jwt-secret.txt \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

5. **Rolling Restart Services**
   ```bash
   kubectl rollout restart deployment/api-service
   kubectl rollout restart deployment/auth-service
   ```

6. **Verify**
   - Test authentication endpoints
   - Check service health
   - Monitor error rates

7. **Cleanup**
   - Remove old key after 24-hour dual-key period
   - Securely delete local key files
   - Update rotation log

#### Automated Rotation (Recommended)

```yaml
# AWS Secrets Manager Rotation Lambda
rotation_lambda_arn: arn:aws:lambda:us-east-1:123456789:function:jwt-secret-rotation
rotation_rules:
  automatically_after_days: 90
```

### 2. Database Credential Rotation

**Frequency:** Every 90 days
**Automation:** AWS RDS Secrets Manager Integration

#### PostgreSQL (Primary Database)

1. **Initiate Rotation**
   ```bash
   aws secretsmanager rotate-secret \
     --secret-id unifiedhealth/db-credentials \
     --rotation-lambda-arn arn:aws:lambda:us-east-1:123456789:function:rds-rotation
   ```

2. **Rotation Lambda Flow**
   - Creates new credentials
   - Updates RDS user password
   - Tests connection
   - Updates secret version

3. **Application Impact**
   - Connection pools automatically refresh
   - Brief connection delays possible during rotation
   - No downtime required

#### Manual Rotation (If Needed)

```bash
# 1. Generate new password
NEW_PASSWORD=$(openssl rand -base64 24)

# 2. Update database
psql -h $DB_HOST -U $ADMIN_USER << EOF
ALTER USER app_user WITH PASSWORD '${NEW_PASSWORD}';
EOF

# 3. Update Secrets Manager
aws secretsmanager put-secret-value \
  --secret-id unifiedhealth/db-credentials \
  --secret-string "{\"username\":\"app_user\",\"password\":\"${NEW_PASSWORD}\"}"

# 4. Restart services
kubectl rollout restart deployment/api-service
```

### 3. PHI Encryption Key Rotation

**Frequency:** Every 90 days
**Automation:** AWS KMS with Envelope Encryption

#### Key Rotation Process

1. **Enable Automatic Rotation in KMS**
   ```bash
   aws kms enable-key-rotation --key-id alias/phi-encryption-key
   ```

2. **Re-encrypt Existing Data (If Required)**
   - For AWS KMS, automatic key rotation handles this
   - Application uses key aliases, not specific versions

3. **Verify Encryption Operations**
   ```bash
   # Test encryption with new key version
   aws kms encrypt \
     --key-id alias/phi-encryption-key \
     --plaintext "test-data"
   ```

#### Application-Level Key Rotation

For field-level encryption (AuditLogger hash secret, etc.):

1. **Generate New Key**
   ```bash
   openssl rand -hex 32 > new-hash-secret.txt
   ```

2. **Update Configuration**
   ```bash
   aws secretsmanager update-secret \
     --secret-id unifiedhealth/audit-hash-secret \
     --secret-string file://new-hash-secret.txt
   ```

3. **Note on Audit Logs**
   - Previous audit entries remain verifiable with old key
   - Store previous hash secrets for verification purposes
   - New entries use new key

### 4. TLS/SSL Certificate Rotation

**Frequency:** 365 days (or before expiry)
**Automation:** cert-manager in Kubernetes

#### Kubernetes cert-manager (Automated)

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-tls-cert
spec:
  secretName: api-tls-secret
  duration: 2160h  # 90 days
  renewBefore: 360h  # Renew 15 days before expiry
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
```

#### Manual Certificate Rotation

1. **Generate CSR**
   ```bash
   openssl req -new -key server.key -out server.csr \
     -subj "/CN=api.thetheunifiedhealth.com"
   ```

2. **Obtain Certificate from CA**
   - Submit CSR to Certificate Authority
   - Download signed certificate

3. **Update Kubernetes Secret**
   ```bash
   kubectl create secret tls api-tls-secret \
     --cert=server.crt \
     --key=server.key \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

4. **Trigger Ingress Reload**
   ```bash
   kubectl rollout restart deployment/nginx-ingress-controller
   ```

### 5. API Key Rotation

**Frequency:** Every 90 days
**Automation:** Partial (manual trigger, automated execution)

#### Third-Party API Keys

1. **Inventory API Keys**
   - Stripe API keys
   - Twilio credentials
   - SendGrid API keys
   - External healthcare APIs

2. **Rotation Steps**
   - Generate new key in provider dashboard
   - Update in Secrets Manager
   - Deploy to services
   - Verify functionality
   - Revoke old key in provider dashboard

3. **Example: Stripe Key Rotation**
   ```bash
   # 1. Generate new key in Stripe Dashboard

   # 2. Update Secrets Manager
   aws secretsmanager update-secret \
     --secret-id unifiedhealth/stripe-api-key \
     --secret-string "sk_live_new_key_here"

   # 3. Restart payment services
   kubectl rollout restart deployment/api-service

   # 4. Verify payments working
   # 5. Revoke old key in Stripe Dashboard
   ```

### 6. OAuth Client Secret Rotation

**Frequency:** Every 180 days
**Automation:** Manual

1. **Generate New Secret**
   - In OAuth provider (Azure AD, Auth0, etc.)
   - Generate new client secret

2. **Update Application**
   ```bash
   aws secretsmanager update-secret \
     --secret-id unifiedhealth/oauth-client-secret \
     --secret-string "new-client-secret"
   ```

3. **Dual-Secret Period**
   - Keep old secret active for 24 hours
   - Monitor authentication success rates

4. **Remove Old Secret**
   - After 24 hours, remove old secret from OAuth provider

## Emergency Rotation Procedures

### Compromised Secret Response

1. **Immediate Actions (within 15 minutes)**
   - Rotate compromised secret immediately
   - Alert security team
   - Begin incident response procedure

2. **Rotation Priority Order**
   ```
   1. PHI Encryption Keys (CRITICAL)
   2. Database Credentials (CRITICAL)
   3. JWT Signing Keys (HIGH)
   4. API Keys (HIGH)
   5. OAuth Secrets (MEDIUM)
   ```

3. **Emergency Rotation Commands**
   ```bash
   # Emergency JWT rotation
   ./scripts/emergency-rotate-jwt.sh

   # Emergency database credential rotation
   ./scripts/emergency-rotate-db.sh

   # Emergency PHI key rotation
   ./scripts/emergency-rotate-phi-key.sh
   ```

4. **Post-Incident**
   - Document timeline and actions
   - Review access logs
   - Assess data exposure
   - Report to compliance if PHI involved

## Monitoring and Alerting

### Rotation Tracking

```yaml
# CloudWatch Alarm for Secret Age
aws cloudwatch put-metric-alarm \
  --alarm-name "SecretAgeExceeded" \
  --metric-name "SecretAge" \
  --namespace "SecretsManager" \
  --threshold 80  # Alert at 80 days
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --period 86400  # Daily check
```

### Rotation Audit Log

All rotations are logged in:
- AWS CloudTrail
- Azure Activity Log
- Application audit logs

## Automation Scripts

### Location: `infrastructure/scripts/secret-rotation/`

| Script | Purpose |
|--------|---------|
| `rotate-jwt.sh` | Rotate JWT signing keys |
| `rotate-db-credentials.sh` | Rotate database passwords |
| `rotate-api-keys.sh` | Rotate external API keys |
| `emergency-rotate-all.sh` | Emergency rotation of all secrets |
| `verify-rotation.sh` | Verify secret rotation completed successfully |

### Terraform Configuration

```hcl
# Enable automatic rotation for Secrets Manager secrets
resource "aws_secretsmanager_secret_rotation" "jwt_rotation" {
  secret_id           = aws_secretsmanager_secret.jwt_secret.id
  rotation_lambda_arn = aws_lambda_function.secret_rotation.arn

  rotation_rules {
    automatically_after_days = 90
  }
}
```

## Compliance Requirements

### HIPAA (45 CFR 164.312)

- Encryption keys must be rotated regularly
- Access to keys must be logged
- Key management procedures must be documented

### SOC 2

- Cryptographic key rotation at defined intervals
- Emergency key replacement procedures
- Key access restricted to authorized personnel

### PCI DSS

- Change cryptographic keys annually at minimum
- Change keys when known or suspected compromise
- Retire old keys securely

## Rollback Procedures

If a rotation causes issues:

1. **Identify Impact**
   - Check service health
   - Review error logs
   - Assess scope of impact

2. **Rollback to Previous Version**
   ```bash
   # Retrieve previous secret version
   aws secretsmanager get-secret-value \
     --secret-id unifiedhealth/jwt-secret \
     --version-stage AWSPREVIOUS

   # Restore previous version
   aws secretsmanager update-secret-version-stage \
     --secret-id unifiedhealth/jwt-secret \
     --version-stage AWSCURRENT \
     --move-to-version-id previous-version-id
   ```

3. **Restart Services**
   ```bash
   kubectl rollout restart deployment --all
   ```

4. **Document and Investigate**
   - Record rollback reason
   - Investigate root cause
   - Schedule retry after fix

## Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| Security Team Lead | security@thetheunifiedhealth.com | Overall secret management |
| Platform Team | platform@theunifiedhealth.com | Application secret integration |
| Infrastructure Team | infra@theunifiedhealth.com | Cloud secret services |
| On-Call | pagerduty.com/unifiedhealth | Emergency rotation |

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-31 | Security Team | Initial document creation |

---

*This document is CONFIDENTIAL and intended for authorized personnel only. Unauthorized disclosure is prohibited.*
