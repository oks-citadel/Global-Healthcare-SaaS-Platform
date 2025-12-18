# DevSecOps Implementation Summary

**UnifiedHealth Global Healthcare Platform**

Version: 1.0
Implementation Date: December 2025

---

## Executive Summary

This document provides a comprehensive overview of the DevSecOps security integration implemented for the UnifiedHealth Platform. The implementation follows industry best practices and compliance requirements for healthcare applications (HIPAA, GDPR, PCI DSS).

**Security Integration Status:** ✅ Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Security Scanning Tools](#security-scanning-tools)
3. [Pre-commit Security Hooks](#pre-commit-security-hooks)
4. [CI/CD Security Gates](#cicd-security-gates)
5. [Configuration Files](#configuration-files)
6. [Security Scripts](#security-scripts)
7. [Usage Instructions](#usage-instructions)
8. [Quality Gates](#quality-gates)
9. [Compliance Matrix](#compliance-matrix)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Security Layers Implemented

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Developer Workstation                                       │
│  ├─ Pre-commit Hooks                                         │
│  │  ├─ Secret Detection (Gitleaks)                          │
│  │  ├─ ESLint Security Rules                                │
│  │  └─ Dependency Audit                                     │
│  │                                                           │
│  ├─ Commit Message Hook                                     │
│  │  └─ Secret Detection in Messages                         │
│  │                                                           │
│  └─ Pre-push Hook                                           │
│     ├─ Full Secret Scan                                     │
│     ├─ Test Suite                                           │
│     ├─ Type Checking                                        │
│     └─ Vulnerability Check                                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CI/CD Pipeline (GitHub Actions)                            │
│  ├─ Security Gate Workflow                                  │
│  │  ├─ Gate 1: Dependency Vulnerabilities                  │
│  │  ├─ Gate 2: Secret Detection                            │
│  │  ├─ Gate 3: Static Analysis (SAST)                      │
│  │  ├─ Gate 4: Container Security                          │
│  │  ├─ Gate 5: License Compliance                          │
│  │  └─ Gate 6: Infrastructure Security                     │
│  │                                                           │
│  ├─ Secret Scanning Workflow                                │
│  │  ├─ Gitleaks                                             │
│  │  ├─ Trivy Secrets                                        │
│  │  ├─ TruffleHog                                           │
│  │  └─ Custom Pattern Matching                             │
│  │                                                           │
│  └─ Container Scanning                                      │
│     ├─ Trivy Image Scan                                     │
│     ├─ SBOM Generation                                      │
│     └─ Vulnerability Assessment                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Deployment Gates                                           │
│  ├─ Development: Medium Security                            │
│  ├─ Staging: High Security                                  │
│  └─ Production: Critical Security + Manual Approval         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Scanning Tools

### 1. Dependency Vulnerability Scanning

**Tools:**
- **pnpm audit** - Built-in npm package vulnerability scanner
- **Snyk** - Third-party vulnerability scanner with extensive database

**Configuration Files:**
- `.snyk` - Snyk policy configuration
- `scripts/security-scan.sh` - Automated scanning script

**Usage:**
```bash
# Quick audit
pnpm security:audit

# Fix vulnerabilities automatically
pnpm security:audit:fix

# Full security scan with reports
pnpm security:scan
```

**Reports Location:**
`security-reports/`

### 2. Static Application Security Testing (SAST)

**Tools:**
- **ESLint** with security plugins
- **SonarQube** for comprehensive code analysis
- **CodeQL** for semantic code analysis

**Configuration Files:**
- `.eslintrc.security.js` - ESLint security rules
- `sonar-project.properties` - SonarQube configuration
- `scripts/run-sonar-scan.sh` - SonarQube scanner script

**Security Rules Enforced:**
- SQL Injection detection
- XSS prevention
- Command Injection detection
- Insecure cryptographic practices
- Regular expression DoS (ReDoS)
- Hardcoded secrets detection
- Prototype pollution prevention

**Usage:**
```bash
# Run ESLint with security rules
pnpm lint

# Run SonarQube scan
pnpm security:sonar
```

### 3. Container Security Scanning

**Tool:** Trivy (Aqua Security)

**Scans Performed:**
- OS package vulnerabilities
- Application dependency vulnerabilities
- Secret detection in images
- Misconfiguration detection
- SBOM (Software Bill of Materials) generation

**Configuration Files:**
- `trivy.yaml` - Trivy configuration
- `.trivyignore` - Vulnerability exceptions
- `.trivy-secret.yaml` - Secret detection rules
- `scripts/container-security-scan.sh` - Container scanning script

**Usage:**
```bash
# Scan all container images
pnpm security:container

# Scan specific image
trivy image unified-health-api:latest
```

### 4. Secret Detection

**Tools:**
- **Gitleaks** - Primary secret detection tool
- **Trivy** - Secondary secret scanning
- **TruffleHog** - Historical secret scanning

**Configuration Files:**
- `.gitleaks.toml` - Gitleaks rules and allowlists
- `.trivy-secret.yaml` - Trivy secret detection rules

**Secrets Detected:**
- AWS credentials
- Azure credentials
- Database connection strings
- API keys (Stripe, SendGrid, etc.)
- JWT secrets
- Private keys
- OAuth secrets
- Healthcare-specific keys (FHIR, HIPAA)

**Usage:**
```bash
# Scan for secrets
pnpm security:secrets

# Full secret scan with history
gitleaks detect --verbose
```

---

## Pre-commit Security Hooks

### Installed Hooks

#### 1. Pre-commit Hook
**File:** `.husky/pre-commit`

**Checks Performed:**
- ✅ Lint-staged (ESLint with security rules)
- ✅ Secret detection on staged files
- ✅ Package.json security review
- ✅ Dependency audit
- ✅ .env file detection
- ✅ Common secret patterns

**Auto-blocks commit if:**
- Secrets detected
- .env files staged
- ESLint security violations
- High/critical vulnerabilities in new dependencies

#### 2. Commit Message Hook
**File:** `.husky/commit-msg`

**Checks Performed:**
- ✅ Secret detection in commit message
- ✅ Conventional commit format validation
- ✅ Credential pattern detection

#### 3. Pre-push Hook
**File:** `.husky/pre-push`

**Checks Performed:**
- ✅ Full repository secret scan
- ✅ Test suite execution
- ✅ Type checking
- ✅ Critical vulnerability check

**Auto-blocks push if:**
- Secrets found in repository
- Tests failing
- Type errors present
- Critical vulnerabilities detected

---

## CI/CD Security Gates

### Security Gate Workflow
**File:** `.github/workflows/security-gate.yml`

All gates must pass before deployment is allowed.

#### Gate 1: Dependency Vulnerabilities
**Threshold:** 0 critical, 0 high vulnerabilities
- pnpm audit scan
- Snyk vulnerability scan
- License compliance check

#### Gate 2: Secret Detection
**Threshold:** 0 secrets allowed
- Gitleaks full repository scan
- Trivy secret detection
- .env file check
- Custom pattern matching

#### Gate 3: Static Analysis (SAST)
**Threshold:** 0 critical security issues
- ESLint security rules
- TypeScript type checking
- CodeQL semantic analysis
- SonarQube quality gate

#### Gate 4: Container Security
**Threshold:** 0 critical, 0 high vulnerabilities
- Trivy container image scan
- Base image vulnerability check
- SBOM generation
- Configuration validation

#### Gate 5: License Compliance
**Threshold:** 0 forbidden licenses
- License scanner
- GPL/AGPL detection
- Commercial compatibility check

#### Gate 6: Infrastructure Security
**Threshold:** 0 critical IaC issues
- Terraform validation
- Trivy IaC scan
- Configuration security check

### Secret Scanning Workflow
**File:** `.github/workflows/secret-scanning.yml`

**Scheduled:** Daily at 2 AM UTC

**Scans:**
- Gitleaks historical scan
- Trivy secret detection
- TruffleHog deep scan
- Custom pattern matching

**Notifications:**
- Slack alerts on detection
- Email to security team
- GitHub Security alerts

---

## Configuration Files

### Core Configuration

```
.
├── .eslintrc.security.js          # ESLint security rules
├── .gitleaks.toml                 # Gitleaks configuration
├── .snyk                          # Snyk policy
├── .trivyignore                   # Trivy exceptions
├── .trivy-secret.yaml             # Trivy secret rules
├── trivy.yaml                     # Trivy main config
├── sonar-project.properties       # SonarQube config
├── security-gate.config.yml       # Security gate thresholds
└── SECURE_CODING_GUIDELINES.md    # Developer guidelines
```

### Scripts

```
scripts/
├── security-scan.sh               # Dependency & license scanning
├── container-security-scan.sh     # Container image scanning
└── run-sonar-scan.sh              # SAST with SonarQube
```

### GitHub Actions

```
.github/workflows/
├── security-gate.yml              # Main security gate
├── secret-scanning.yml            # Secret detection
└── ci.yml (updated)               # Integrated security checks
```

### Husky Hooks

```
.husky/
├── pre-commit                     # Pre-commit security checks
├── commit-msg                     # Commit message validation
└── pre-push                       # Pre-push security gate
```

---

## Security Scripts

### 1. Comprehensive Security Scan
```bash
pnpm security:scan
```

**Performs:**
- Dependency vulnerability scan (pnpm audit)
- Snyk scan (if configured)
- License compliance check
- Malicious package detection
- Report generation

**Output:**
- `security-reports/pnpm-audit-*.json`
- `security-reports/snyk-report-*.json`
- `security-reports/license-check-*.txt`
- `security-reports/security-report-*.md`

### 2. Container Security Scan
```bash
pnpm security:container
```

**Performs:**
- Docker image vulnerability scan
- Secret detection in images
- Misconfiguration detection
- SBOM generation
- Base image security check

**Output:**
- `security-reports/container-scans/*.txt` (vulnerabilities)
- `security-reports/container-scans/*.json` (detailed report)
- `security-reports/container-scans/*.sarif` (GitHub Security)
- `security-reports/container-scans/*.sbom.json` (SBOM)

### 3. SonarQube Scan
```bash
pnpm security:sonar
```

**Requires:**
- SonarQube server running
- `SONAR_HOST_URL` environment variable
- `SONAR_TOKEN` environment variable

**Performs:**
- Code quality analysis
- Security hotspot detection
- Code coverage analysis
- Technical debt calculation

### 4. Quick Security Check
```bash
pnpm security:all
```

**Performs:**
- Dependency audit
- Secret detection
- Linting
- Type checking

**Use case:** Quick pre-commit verification

---

## Usage Instructions

### For Developers

#### Initial Setup

1. **Install Git Hooks**
```bash
pnpm install
pnpm prepare  # Installs Husky hooks
```

2. **Install Security Tools**
```bash
# macOS
brew install gitleaks trivy

# Linux
# Gitleaks
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.0/gitleaks_8.18.0_linux_x64.tar.gz
tar -xzf gitleaks_8.18.0_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/

# Trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

3. **Configure Environment**
```bash
# Copy example environment file
cp .env.example .env

# Never commit .env files!
# They are in .gitignore
```

#### Daily Workflow

1. **Before Committing**
```bash
# Hooks run automatically, but you can manually check:
pnpm lint
pnpm typecheck
pnpm security:secrets
```

2. **Before Pushing**
```bash
# Run comprehensive security check
pnpm security:all
```

3. **Before Creating PR**
```bash
# Run full security scan
pnpm security:scan

# Check for vulnerabilities
pnpm security:audit
```

#### Handling Security Issues

**If secrets are detected:**
1. Remove the secret from code
2. Revoke/rotate the credential
3. Update .gitleaks.toml if false positive
4. Commit the fix

**If vulnerabilities are found:**
1. Review the vulnerability report
2. Update dependencies: `pnpm update`
3. If no fix available, document in `.snyk`
4. Implement compensating controls

**If license issues are found:**
1. Review the license compatibility
2. Replace with compatible alternative
3. Or document legal approval

### For DevOps Engineers

#### Setting up CI/CD

1. **Configure GitHub Secrets**
```
SNYK_TOKEN          - Snyk API token
SONAR_TOKEN         - SonarQube token
SLACK_WEBHOOK_URL   - Slack notifications
AZURE_CREDENTIALS   - Azure deployment
```

2. **Configure SonarQube**
```bash
# Set environment variables
export SONAR_HOST_URL=https://sonarqube.company.com
export SONAR_TOKEN=your-token

# Run scan
pnpm security:sonar
```

3. **Enable Security Scanning**
- Enable GitHub Advanced Security
- Enable Dependabot alerts
- Enable Secret scanning
- Enable Code scanning

#### Monitoring Security

**Daily Tasks:**
- Review security scan reports
- Check for new vulnerabilities
- Review secret scanning alerts

**Weekly Tasks:**
- Review dependency updates
- Check license compliance
- Update security tools
- Review access logs

**Monthly Tasks:**
- Security audit review
- Update security policies
- Penetration testing
- Incident response drill

---

## Quality Gates

### Development Environment
**Security Level:** Medium

**Required Checks:**
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests

**Auto-deploy:** Yes

### Staging Environment
**Security Level:** High

**Required Checks:**
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests
- ✅ Integration tests
- ✅ Dependency scan
- ✅ Secret detection
- ✅ Static analysis

**Auto-deploy:** Yes
**Manual Approval:** No

### Production Environment
**Security Level:** Critical

**Required Checks:**
- ✅ All security gates must pass
- ✅ E2E tests
- ✅ Container security scan
- ✅ Infrastructure validation
- ✅ License compliance
- ✅ Security team review

**Auto-deploy:** No
**Manual Approval:** Yes (2 approvers required)
**Required Approvers:** Security team, Platform lead

---

## Compliance Matrix

### HIPAA Compliance

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Access Control | JWT + RBAC | ✅ |
| Audit Controls | Comprehensive logging | ✅ |
| Integrity | Data encryption at rest/transit | ✅ |
| Transmission Security | HTTPS, TLS 1.3 | ✅ |
| Authentication | MFA for sensitive operations | ✅ |
| Automatic Logoff | 15-minute timeout | ✅ |
| Encryption | AES-256-GCM | ✅ |

### GDPR Compliance

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Data Minimization | Minimum necessary access | ✅ |
| Right to Erasure | Soft/hard delete | ✅ |
| Data Portability | Export functionality | ✅ |
| Consent Management | Explicit consent tracking | ✅ |
| Privacy by Design | Security-first development | ✅ |
| Data Breach Notification | Automated alerting | ✅ |

### PCI DSS Compliance

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| No Card Storage | Tokenization via Stripe | ✅ |
| Encryption | End-to-end encryption | ✅ |
| Access Control | Least privilege | ✅ |
| Monitoring | Comprehensive logging | ✅ |
| Secure Transmission | HTTPS only | ✅ |
| Vulnerability Management | Automated scanning | ✅ |

---

## Troubleshooting

### Common Issues

#### 1. Pre-commit Hook Failing

**Issue:** "Gitleaks not installed"
**Solution:**
```bash
# macOS
brew install gitleaks

# Linux
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_linux_x64.tar.gz
tar -xzf gitleaks_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

#### 2. False Positive Secret Detection

**Issue:** Legitimate code flagged as secret
**Solution:** Add to `.gitleaks.toml` allowlist
```toml
[allowlist]
regexes = [
    '''your-pattern-here''',
]
```

#### 3. Vulnerability in Dependency

**Issue:** pnpm audit fails with vulnerabilities
**Solution:**
```bash
# Try automatic fix
pnpm audit --fix

# If no fix available, document in .snyk
# Then implement compensating controls
```

#### 4. Container Scan Failing

**Issue:** High vulnerabilities in base image
**Solution:**
```bash
# Update base image in Dockerfile
FROM node:20-alpine  # Latest version

# Or use specific patched version
FROM node:20.11-alpine
```

#### 5. SonarQube Quality Gate Failing

**Issue:** Code quality below threshold
**Solution:**
- Review SonarQube dashboard
- Fix critical security issues first
- Improve test coverage
- Reduce code complexity

---

## Security Metrics & Reporting

### Key Metrics Tracked

1. **Vulnerability Trends**
   - Critical vulnerabilities over time
   - Mean time to remediation
   - Vulnerability density

2. **Security Gate Performance**
   - Pass/fail rate
   - Gate execution time
   - Blockers by gate

3. **Secret Detection**
   - Secrets detected
   - False positive rate
   - Time to revocation

4. **Code Quality**
   - Security hotspots
   - Code coverage
   - Technical debt

### Reports Generated

**Daily:**
- Dependency vulnerability report
- Secret scanning report

**Weekly:**
- Consolidated security report
- Trend analysis
- Compliance status

**Monthly:**
- Executive summary
- Risk assessment
- Remediation plan

---

## Next Steps & Recommendations

### Immediate Actions

1. ✅ Install security tools on all developer machines
2. ✅ Configure CI/CD secrets
3. ✅ Enable GitHub Advanced Security
4. ✅ Train team on secure coding guidelines

### Short-term (1-3 months)

1. 📋 Implement runtime application security (RASP)
2. 📋 Set up SIEM integration
3. 📋 Conduct penetration testing
4. 📋 Implement security champions program

### Long-term (3-12 months)

1. 📋 Achieve SOC 2 Type II certification
2. 📋 Implement zero-trust architecture
3. 📋 Automated threat modeling
4. 📋 Bug bounty program

---

## Support & Resources

### Internal Resources
- **Security Team:** security@unifiedhealth.com
- **DevOps Team:** devops@unifiedhealth.com
- **Documentation:** `/docs/security/`

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [SonarQube Documentation](https://docs.sonarqube.org/)

---

## Changelog

### Version 1.0 (December 2025)
- ✅ Initial DevSecOps implementation
- ✅ All security gates configured
- ✅ Pre-commit hooks installed
- ✅ CI/CD security integration
- ✅ Comprehensive documentation

---

**Document Owner:** DevSecOps Team
**Last Review:** December 2025
**Next Review:** March 2026
