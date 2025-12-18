# Production Deployment - Security Checklist

**Project:** Unified Healthcare SaaS Platform
**Date:** 2025-12-17
**Environment:** Production
**Compliance:** HIPAA, GDPR, SOC 2

---

## Pre-Deployment Security Checklist

Use this checklist to ensure all security requirements are met before deploying to production.

---

## 1. Azure Key Vault Deployment

### ☐ 1.1 Provision Key Vault

```bash
cd infrastructure/azure
./provision-keyvault.sh
```

**Verify:**
- [ ] Key Vault created in correct Azure subscription
- [ ] Resource group: `unified-health-rg` (or configured name)
- [ ] Location: Same as other production resources
- [ ] SKU: Premium (for HSM support)
- [ ] Soft-delete enabled (90 days)
- [ ] Purge protection enabled

### ☐ 1.2 Configure Access Policies

**Verify:**
- [ ] Service principal created for application
- [ ] Service principal has correct permissions:
  - Secret permissions: get, list
  - Key permissions: get, list, decrypt, unwrapKey
- [ ] Admin user has full permissions
- [ ] Diagnostic logging enabled
- [ ] Access policies follow least privilege

### ☐ 1.3 Populate Secrets

```bash
./populate-keyvault.sh
```

**Critical Secrets to Populate:**
- [ ] JWT-SECRET (minimum 64 characters)
- [ ] ENCRYPTION-KEY (exactly 32 characters)
- [ ] DATABASE-URL
- [ ] DATABASE-PASSWORD
- [ ] REDIS-PASSWORD
- [ ] STRIPE-SECRET-KEY
- [ ] STRIPE-WEBHOOK-SECRET
- [ ] TWILIO-ACCOUNT-SID
- [ ] TWILIO-AUTH-TOKEN
- [ ] SENDGRID-API-KEY
- [ ] AWS-ACCESS-KEY-ID
- [ ] AWS-SECRET-ACCESS-KEY

**Verify:**
- [ ] All secrets populated
- [ ] No default/test values in production
- [ ] Secret names follow convention (hyphens, not underscores)
- [ ] Secrets are strong (random, long)

### ☐ 1.4 Test Key Vault Access

```bash
# Test from application server
az keyvault secret show \
  --vault-name your-kv-name \
  --name JWT-SECRET
```

**Verify:**
- [ ] Application can access Key Vault
- [ ] Secrets retrieved successfully
- [ ] No authentication errors

---

## 2. Environment Configuration

### ☐ 2.1 Update Production .env

**Required Variables:**
```env
NODE_ENV=production
AZURE_KEY_VAULT_URL=https://your-kv.vault.azure.net/
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx
AZURE_TENANT_ID=xxx
AZURE_KEY_VAULT_ENABLED=true
```

**Remove from .env (now in Key Vault):**
- [ ] JWT_SECRET removed/commented
- [ ] ENCRYPTION_KEY removed/commented
- [ ] DATABASE_PASSWORD removed/commented
- [ ] All API keys removed/commented
- [ ] All sensitive credentials removed/commented

### ☐ 2.2 CORS Configuration

```env
# UPDATE THIS!
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com
```

**Verify:**
- [ ] All localhost origins removed
- [ ] Only production domains listed
- [ ] HTTPS URLs only
- [ ] No wildcards (*) used

### ☐ 2.3 Security Settings

**Verify:**
```env
NODE_ENV=production
LOG_LEVEL=info (not debug)
RATE_LIMIT_MAX=100 (or appropriate value)
ENABLE_MALWARE_SCAN=true
```

---

## 3. TLS/HTTPS Configuration

### ☐ 3.1 SSL Certificates

**Verify:**
- [ ] Valid SSL certificate installed
- [ ] Certificate from trusted CA
- [ ] Certificate not expired
- [ ] Certificate matches domain
- [ ] Intermediate certificates installed
- [ ] Certificate auto-renewal configured

### ☐ 3.2 TLS Configuration

**Verify:**
- [ ] TLS 1.2 minimum (TLS 1.3 recommended)
- [ ] Strong cipher suites only
- [ ] Weak ciphers disabled (RC4, DES, 3DES)
- [ ] Perfect Forward Secrecy enabled
- [ ] HSTS enabled

**Test:**
```bash
# Test TLS configuration
curl -I https://api.yourdomain.com/health

# Should see:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### ☐ 3.3 HTTPS Enforcement

**Verify:**
- [ ] HTTP → HTTPS redirect configured
- [ ] HSTS preload submitted (optional but recommended)
- [ ] All API endpoints use HTTPS
- [ ] No mixed content warnings

---

## 4. Network Security

### ☐ 4.1 Web Application Firewall (WAF)

**Deploy Azure WAF:**
```bash
# Example: Create WAF policy
az network application-gateway waf-policy create \
  --name unified-health-waf \
  --resource-group unified-health-rg
```

**Verify:**
- [ ] Azure WAF deployed
- [ ] OWASP Core Rule Set enabled
- [ ] Custom rules configured (if needed)
- [ ] WAF in Prevention mode (not Detection)
- [ ] WAF logs enabled

### ☐ 4.2 DDoS Protection

**Verify:**
- [ ] Azure DDoS Protection Standard enabled
- [ ] DDoS protection plan created
- [ ] All public IPs protected
- [ ] DDoS telemetry configured

### ☐ 4.3 Network Segmentation

**Verify:**
- [ ] Database in private subnet
- [ ] Redis in private subnet
- [ ] Application in separate subnet
- [ ] Network Security Groups (NSG) configured
- [ ] Only necessary ports open

### ☐ 4.4 Firewall Rules

**Verify:**
- [ ] Inbound rules restricted
- [ ] Outbound rules defined
- [ ] Database access restricted to application subnet
- [ ] Admin access via VPN/Bastion only
- [ ] Unnecessary ports closed

---

## 5. Database Security

### ☐ 5.1 PostgreSQL Security

**Verify:**
- [ ] SSL/TLS required for connections
- [ ] Strong password set
- [ ] Password in Azure Key Vault
- [ ] Only application can connect
- [ ] Admin access restricted
- [ ] Database firewall configured

### ☐ 5.2 Database Encryption

**Verify:**
- [ ] Transparent Data Encryption (TDE) enabled
- [ ] Backups encrypted
- [ ] Connection string uses SSL mode
- [ ] Encryption at rest enabled

### ☐ 5.3 Database Audit Logging

**Verify:**
- [ ] Audit logging enabled
- [ ] Failed login attempts logged
- [ ] DDL changes logged
- [ ] DML on sensitive tables logged
- [ ] Logs retained for 6 years (HIPAA)

---

## 6. Application Security

### ☐ 6.1 Dependencies

**Run security audit:**
```bash
cd services/api
pnpm audit
pnpm audit --fix
```

**Verify:**
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities
- [ ] All dependencies up to date
- [ ] Unused dependencies removed

### ☐ 6.2 Security Headers

**Test headers:**
```bash
curl -I https://api.yourdomain.com/health
```

**Verify all headers present:**
- [ ] Content-Security-Policy
- [ ] Strict-Transport-Security
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy
- [ ] Permissions-Policy
- [ ] X-Powered-By removed

### ☐ 6.3 Rate Limiting

**Test rate limiting:**
```bash
# Exceed rate limit
for i in {1..10}; do
  curl https://api.yourdomain.com/api/v1/auth/login \
    -X POST -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}'
done
```

**Verify:**
- [ ] Rate limiting active
- [ ] 429 Too Many Requests returned
- [ ] IP blocking works
- [ ] Rate limit headers present
- [ ] Redis configured (for distributed rate limiting)

---

## 7. Authentication & Authorization

### ☐ 7.1 JWT Configuration

**Verify:**
- [ ] JWT_SECRET in Azure Key Vault
- [ ] JWT_SECRET is strong (64+ characters)
- [ ] Access token expiry: 15 minutes
- [ ] Refresh token expiry: 7 days
- [ ] Token rotation enabled
- [ ] Issuer and audience claims set

### ☐ 7.2 Password Security

**Verify:**
- [ ] bcrypt with 12 rounds
- [ ] Minimum 12 characters enforced
- [ ] Complexity requirements enforced
- [ ] Account lockout: 5 attempts / 30 minutes
- [ ] Password reset rate limited

### ☐ 7.3 Multi-Factor Authentication

**Status:**
- [ ] MFA implemented (if required)
- [ ] TOTP support
- [ ] SMS backup (optional)
- [ ] Recovery codes

---

## 8. Encryption

### ☐ 8.1 Data at Rest

**Verify:**
- [ ] AES-256-GCM encryption
- [ ] Master key in Azure Key Vault
- [ ] PHI fields encrypted
- [ ] Database encryption enabled

### ☐ 8.2 Data in Transit

**Verify:**
- [ ] TLS 1.3 (or 1.2 minimum)
- [ ] All connections use HTTPS
- [ ] Database connections use SSL
- [ ] Redis connections use TLS

### ☐ 8.3 Encryption Key Management

**Verify:**
- [ ] Encryption key in Key Vault
- [ ] Key length: 32 bytes (256 bits)
- [ ] Key rotation procedure documented
- [ ] Old keys retained for recovery

---

## 9. Monitoring & Logging

### ☐ 9.1 Audit Logging

**Verify:**
- [ ] All PHI access logged
- [ ] Authentication events logged
- [ ] Failed logins logged
- [ ] Data exports logged
- [ ] Configuration changes logged
- [ ] Log retention: 6 years

### ☐ 9.2 Security Monitoring

**Configure alerts for:**
- [ ] Failed login threshold (5 attempts)
- [ ] Rate limit violations
- [ ] Data export events
- [ ] Configuration changes
- [ ] Security policy violations
- [ ] Unusual access patterns

### ☐ 9.3 SIEM Integration

**Verify:**
- [ ] Azure Sentinel configured (or similar)
- [ ] Logs forwarded to SIEM
- [ ] Correlation rules defined
- [ ] Alerting configured
- [ ] 24/7 monitoring (if required)

---

## 10. Compliance

### ☐ 10.1 HIPAA Compliance

**Verify:**
- [ ] Business Associate Agreement signed
- [ ] Risk assessment completed
- [ ] PHI encryption enabled
- [ ] Access controls configured
- [ ] Audit logging enabled (6-year retention)
- [ ] Breach notification procedures documented
- [ ] HIPAA training completed

### ☐ 10.2 GDPR Compliance

**Verify:**
- [ ] Privacy policy published
- [ ] Data Processing Agreement signed
- [ ] User consent mechanism
- [ ] Right to access implemented
- [ ] Right to erasure implemented
- [ ] Data portability implemented
- [ ] DPIA completed (if required)

### ☐ 10.3 SOC 2 Compliance

**Verify:**
- [ ] Security policies documented
- [ ] Access control procedures
- [ ] Change management process
- [ ] Vendor management
- [ ] Incident response plan

---

## 11. Backups & Disaster Recovery

### ☐ 11.1 Database Backups

**Verify:**
- [ ] Automated daily backups
- [ ] Backup encryption enabled
- [ ] 30-day retention
- [ ] Backups tested regularly
- [ ] Point-in-time recovery enabled

### ☐ 11.2 Application Backups

**Verify:**
- [ ] Configuration backups
- [ ] Code repository backups
- [ ] Key Vault backups
- [ ] Infrastructure as Code saved

### ☐ 11.3 Disaster Recovery

**Verify:**
- [ ] DR plan documented
- [ ] RTO/RPO defined
- [ ] Failover procedures tested
- [ ] Multi-region deployment (if required)

---

## 12. Container Security

### ☐ 12.1 Container Images

**Verify:**
- [ ] Base images from trusted sources
- [ ] Images scanned for vulnerabilities
- [ ] No secrets in images
- [ ] Non-root user configured
- [ ] Minimal base images used

### ☐ 12.2 Container Runtime

**Verify:**
- [ ] Read-only root filesystem
- [ ] Resource limits defined
- [ ] Security scanning enabled (Trivy/Snyk)
- [ ] Regular image updates

---

## 13. Testing

### ☐ 13.1 Security Testing

**Complete before deployment:**
- [ ] Unit tests pass (pnpm test)
- [ ] Integration tests pass
- [ ] Security-specific tests pass
- [ ] Encryption tests pass
- [ ] Validation tests pass
- [ ] Key Vault integration tested

### ☐ 13.2 Penetration Testing

**Conduct tests for:**
- [ ] OWASP Top 10
- [ ] SQL/NoSQL Injection
- [ ] XSS attacks
- [ ] Authentication bypass
- [ ] Authorization bypass
- [ ] Rate limiting
- [ ] Encryption validation

**Tools used:**
- [ ] OWASP ZAP
- [ ] Burp Suite
- [ ] SQLMap
- [ ] Nmap

### ☐ 13.3 Load Testing

**Verify:**
- [ ] Application handles expected load
- [ ] Rate limiting scales
- [ ] Database performs well
- [ ] No memory leaks
- [ ] Auto-scaling configured

---

## 14. Incident Response

### ☐ 14.1 Incident Response Plan

**Verify:**
- [ ] IR plan documented
- [ ] IR team identified
- [ ] Contact list current
- [ ] Escalation procedures defined
- [ ] Communication plan ready

### ☐ 14.2 Breach Notification

**Verify:**
- [ ] Breach notification email configured
- [ ] Legal counsel contacts
- [ ] Regulatory contacts (HHS OCR)
- [ ] Breach response checklist
- [ ] 60-day deadline understood

### ☐ 14.3 Emergency Procedures

**Verify:**
- [ ] Rollback procedures documented
- [ ] Emergency shutdown procedures
- [ ] Data isolation procedures
- [ ] On-call rotation configured

---

## 15. Documentation

### ☐ 15.1 Security Documentation

**Verify complete:**
- [ ] Security architecture diagram
- [ ] Data flow diagrams
- [ ] Encryption procedures
- [ ] Key management procedures
- [ ] Access control policies
- [ ] Audit log procedures

### ☐ 15.2 Operational Documentation

**Verify complete:**
- [ ] Deployment procedures
- [ ] Monitoring procedures
- [ ] Backup/restore procedures
- [ ] Incident response runbooks
- [ ] Security patching procedures

---

## 16. Final Verification

### ☐ 16.1 Security Scan

```bash
# Run final security checks
pnpm audit
pnpm test:security

# External scans
curl https://api.yourdomain.com/health
ssllabs-scan api.yourdomain.com
```

### ☐ 16.2 Configuration Review

**Review all configurations:**
- [ ] Environment variables correct
- [ ] No debug mode enabled
- [ ] No test/default credentials
- [ ] All localhost references removed
- [ ] CORS origins production-only
- [ ] Log level set to 'info'

### ☐ 16.3 Access Review

**Verify:**
- [ ] Admin access restricted
- [ ] Service accounts follow least privilege
- [ ] Unused accounts removed
- [ ] API keys rotated
- [ ] SSH keys current

---

## 17. Sign-Off

### Pre-Deployment Checklist Completion

**Completed by:** _______________________
**Date:** _______________________
**Signature:** _______________________

### Security Review Approval

**Security Officer:** _______________________
**Date:** _______________________
**Signature:** _______________________

### Compliance Review Approval

**Compliance Officer:** _______________________
**Date:** _______________________
**Signature:** _______________________

### Final Deployment Approval

**CTO/Technical Lead:** _______________________
**Date:** _______________________
**Signature:** _______________________

---

## Post-Deployment

### ☐ Immediate (First 24 Hours)

- [ ] Monitor error logs
- [ ] Monitor security alerts
- [ ] Verify backups running
- [ ] Test all critical paths
- [ ] Monitor performance metrics

### ☐ First Week

- [ ] Review all security alerts
- [ ] Verify audit logs
- [ ] Check failed login attempts
- [ ] Monitor rate limiting
- [ ] Review access patterns

### ☐ First Month

- [ ] Conduct security review
- [ ] Review incident response
- [ ] Update documentation
- [ ] Plan security training
- [ ] Schedule penetration testing

---

## Emergency Contacts

- **Security Team:** security@unifiedhealth.io
- **On-Call:** [Configure]
- **Compliance:** compliance@unifiedhealth.io
- **Breach Notification:** breach@unifiedhealth.io

---

## Notes

Use this section for deployment-specific notes, issues, or deviations:

```
[Your notes here]
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Next Review:** Before each production deployment
