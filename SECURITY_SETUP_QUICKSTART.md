# Security Setup - Quick Start Guide

**UnifiedHealth Global Healthcare Platform**

This guide will help you get started with the security tooling and processes.

---

## 1. Developer Machine Setup (5 minutes)

### Install Security Tools

**macOS:**
```bash
# Install Gitleaks (secret detection)
brew install gitleaks

# Install Trivy (container scanning)
brew install aquasecurity/trivy/trivy

# Install SonarQube Scanner (optional)
brew install sonar-scanner
```

**Linux (Ubuntu/Debian):**
```bash
# Install Gitleaks
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.0/gitleaks_8.18.0_linux_x64.tar.gz
tar -xzf gitleaks_8.18.0_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/

# Install Trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

**Windows (WSL2 or Git Bash):**
```bash
# Install Gitleaks
curl -sSfL https://raw.githubusercontent.com/gitleaks/gitleaks/master/scripts/install.sh | sh -s -- -b /usr/local/bin

# Install Trivy
wget https://github.com/aquasecurity/trivy/releases/download/v0.48.0/trivy_0.48.0_Linux-64bit.tar.gz
tar -xzf trivy_0.48.0_Linux-64bit.tar.gz
sudo mv trivy /usr/local/bin/
```

### Install Project Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Global-Healthcare-SaaS-Platform

# Install dependencies
pnpm install

# Install Git hooks (automatic security checks)
pnpm prepare
```

### Verify Installation

```bash
# Check installed tools
gitleaks version
trivy --version

# Test security scripts
pnpm security:all
```

---

## 2. Understanding Security Checks

### Pre-commit Hooks (Automatic)

Every time you commit, these checks run automatically:

1. ✅ **ESLint Security Rules** - Detects insecure code patterns
2. ✅ **Secret Detection** - Scans for hardcoded credentials
3. ✅ **Dependency Audit** - Checks for vulnerable packages
4. ✅ **.env File Detection** - Prevents committing sensitive files

**What to do if a check fails:**
- Review the error message
- Fix the issue
- Commit again

### Pre-push Hooks (Automatic)

Before pushing to remote, these checks run:

1. ✅ **Full Secret Scan** - Complete repository scan
2. ✅ **Test Suite** - All tests must pass
3. ✅ **Type Checking** - TypeScript validation
4. ✅ **Critical Vulnerabilities** - No critical CVEs allowed

**Push will be blocked if any check fails.**

---

## 3. Manual Security Scans

### Quick Security Check (30 seconds)

```bash
pnpm security:all
```

Runs:
- Dependency audit
- Secret detection
- Linting
- Type checking

**Use before:** Creating a pull request

### Full Security Scan (2-5 minutes)

```bash
pnpm security:scan
```

Generates comprehensive reports:
- Dependency vulnerabilities
- License compliance
- Malicious package detection
- Security recommendations

**Reports saved to:** `security-reports/`

### Container Security Scan (3-10 minutes)

```bash
pnpm security:container
```

Scans Docker images for:
- OS vulnerabilities
- Application vulnerabilities
- Secrets in images
- Misconfigurations
- SBOM generation

**Use before:** Deploying containers

---

## 4. Common Workflows

### Starting a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make your changes
# ... code ...

# 3. Run security check before committing
pnpm security:all

# 4. Commit (hooks run automatically)
git commit -m "feat: add new feature"

# 5. Push (hooks run automatically)
git push origin feature/new-feature
```

### Before Creating a Pull Request

```bash
# 1. Run full security scan
pnpm security:scan

# 2. Review the reports in security-reports/

# 3. Fix any issues found

# 4. Run tests
pnpm test

# 5. Create PR
```

### Handling Security Alerts

#### If secrets are detected:

```bash
# 1. IMMEDIATELY revoke/rotate the credential
# 2. Remove from code and use environment variables
# 3. Update .env.example (not .env!)
# 4. Commit the fix

# Example:
# Before:
const apiKey = "sk_live_123456789";

# After:
const apiKey = process.env.STRIPE_API_KEY;
```

#### If vulnerabilities are found:

```bash
# 1. Check the severity
pnpm audit

# 2. Try automatic fix
pnpm security:audit:fix

# 3. If no fix available:
#    - Document in .snyk
#    - Implement compensating controls
#    - Update dependency when fix is released
```

---

## 5. Security Best Practices

### DO ✅

- Use environment variables for secrets
- Run security checks before committing
- Review security scan reports
- Update dependencies regularly
- Follow SECURE_CODING_GUIDELINES.md
- Use strong, unique passwords
- Enable MFA on all accounts
- Encrypt PHI/PII data
- Log security events
- Review code for security issues

### DON'T ❌

- Commit .env files
- Hardcode secrets in code
- Ignore security warnings
- Use weak cryptography
- Log sensitive data
- Disable security checks
- Use deprecated packages
- Trust user input
- Skip input validation
- Expose detailed error messages

---

## 6. CI/CD Security Gates

When you push code, it goes through 6 security gates:

### Gate 1: Dependency Vulnerabilities
**Checks:** Critical and high CVEs
**Fails if:** Any critical/high vulnerabilities found

### Gate 2: Secret Detection
**Checks:** Hardcoded credentials
**Fails if:** Any secrets detected

### Gate 3: Static Analysis (SAST)
**Checks:** Code security issues
**Fails if:** Critical security bugs found

### Gate 4: Container Security
**Checks:** Docker image vulnerabilities
**Fails if:** Critical vulnerabilities in images

### Gate 5: License Compliance
**Checks:** Forbidden licenses (GPL, AGPL)
**Fails if:** Incompatible licenses detected

### Gate 6: Infrastructure Security
**Checks:** Terraform/K8s configs
**Fails if:** Critical misconfigurations found

**All gates must pass for deployment to production.**

---

## 7. Environment Variables

### Required for Development

Create a `.env` file (DO NOT COMMIT!):

```bash
# Copy from example
cp .env.example .env

# Edit with your values
nano .env
```

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/healthcare_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Encryption
ENCRYPTION_KEY=your-encryption-key-hex-64-chars

# Stripe (use test keys in development)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Never commit .env files!** They are in `.gitignore`.

---

## 8. Troubleshooting

### "Gitleaks not installed"

```bash
# macOS
brew install gitleaks

# Linux
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_linux_x64.tar.gz
tar -xzf gitleaks_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

### "Hooks not running"

```bash
# Reinstall hooks
pnpm prepare

# Check hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### "False positive secret detection"

Add to `.gitleaks.toml`:

```toml
[allowlist]
regexes = [
    '''your-false-positive-pattern''',
]
```

### "Vulnerability with no fix"

Document in `.snyk`:

```yaml
ignore:
  'SNYK-JS-PACKAGE-123456':
    - '*':
        reason: 'No fix available, compensating controls in place'
        expires: '2025-03-01T00:00:00.000Z'
```

---

## 9. Getting Help

### Documentation

- **Secure Coding Guidelines:** `SECURE_CODING_GUIDELINES.md`
- **Full Implementation Guide:** `DEVSECOPS_IMPLEMENTATION.md`
- **Security Configuration:** `security-gate.config.yml`

### Support Channels

- **Security Team:** security@thetheunifiedhealth.com
- **DevOps Team:** devops@thetheunifiedhealth.com
- **Slack:** #security-help

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Gitleaks Docs](https://github.com/gitleaks/gitleaks)
- [Trivy Docs](https://aquasecurity.github.io/trivy/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)

---

## 10. Quick Reference

### Most Common Commands

```bash
# Quick security check
pnpm security:all

# Full scan with reports
pnpm security:scan

# Check for secrets
pnpm security:secrets

# Audit dependencies
pnpm security:audit

# Fix vulnerabilities
pnpm security:audit:fix

# Scan containers
pnpm security:container

# Run SonarQube
pnpm security:sonar
```

### File Locations

```
Security Configuration:
├── .gitleaks.toml              # Secret detection rules
├── .trivy-secret.yaml          # Container secret rules
├── .eslintrc.security.js       # Code security rules
├── sonar-project.properties    # SAST configuration
└── security-gate.config.yml    # CI/CD gates

Scripts:
├── scripts/security-scan.sh
├── scripts/container-security-scan.sh
└── scripts/run-sonar-scan.sh

Hooks:
├── .husky/pre-commit
├── .husky/commit-msg
└── .husky/pre-push

Reports:
└── security-reports/           # Generated reports
```

---

## Next Steps

1. ✅ Install security tools
2. ✅ Run `pnpm install` and `pnpm prepare`
3. ✅ Read `SECURE_CODING_GUIDELINES.md`
4. ✅ Run your first security scan: `pnpm security:all`
5. ✅ Make a test commit to see hooks in action

**You're all set! Happy secure coding! 🔒**

---

**Last Updated:** December 2025
**Version:** 1.0
