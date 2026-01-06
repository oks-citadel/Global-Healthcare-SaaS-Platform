# Release Notes Template

## Version [X.Y.Z]

**Release Date:** YYYY-MM-DD

**Release Type:** Major | Minor | Patch | Security

---

## Highlights

> Brief summary of the most important changes in this release (2-3 sentences).

---

## New Features

### Feature 1
- **Description:** Brief description of the feature
- **Impact:** Who benefits and how
- **Documentation:** Link to relevant documentation

### Feature 2
- **Description:** Brief description of the feature
- **Impact:** Who benefits and how
- **Documentation:** Link to relevant documentation

---

## Improvements

- Improvement 1: Description of enhancement
- Improvement 2: Description of enhancement
- Improvement 3: Description of enhancement

---

## Bug Fixes

| Issue ID | Description | Severity |
|----------|-------------|----------|
| #XXX | Description of bug that was fixed | Critical/High/Medium/Low |
| #XXX | Description of bug that was fixed | Critical/High/Medium/Low |

---

## Security Updates

> Note: Security issues are disclosed after patches are applied.

- Security fix 1: Brief description (CVE-XXXX-XXXXX if applicable)
- Security fix 2: Brief description

---

## Breaking Changes

### Change 1
- **What changed:** Description of the breaking change
- **Why:** Reason for the change
- **Migration:** Steps to update your code

### Change 2
- **What changed:** Description of the breaking change
- **Why:** Reason for the change
- **Migration:** Steps to update your code

---

## Migration Guide

### Prerequisites
- Requirement 1
- Requirement 2

### Step-by-Step Migration

#### 1. Backup Your Data
```bash
# Example backup command
```

#### 2. Update Dependencies
```bash
# Example update command
pnpm update
```

#### 3. Apply Database Migrations
```bash
# Example migration command
pnpm db:migrate
```

#### 4. Update Configuration
- Configuration change 1
- Configuration change 2

#### 5. Verify Installation
```bash
# Example verification command
pnpm test
```

### Rollback Procedure
If issues occur, follow these steps to rollback:
1. Step 1
2. Step 2
3. Step 3

---

## Deprecations

The following features are deprecated and will be removed in a future release:

| Feature | Deprecated In | Removal Target | Alternative |
|---------|--------------|----------------|-------------|
| Feature A | v1.0.0 | v2.0.0 | Use Feature B instead |

---

## Known Issues

- Issue 1: Description and workaround
- Issue 2: Description and workaround

---

## Performance Improvements

- Performance improvement 1: X% faster/reduced
- Performance improvement 2: X% faster/reduced

---

## Dependencies Updated

| Package | Previous Version | New Version | Notes |
|---------|-----------------|-------------|-------|
| package-name | 1.0.0 | 2.0.0 | Major update |

---

## Contributors

We would like to thank all contributors who helped make this release possible:

### Core Team
- @contributor1 - Feature development
- @contributor2 - Bug fixes

### Community Contributors
- @contributor3 - Documentation
- @contributor4 - Testing

### Special Thanks
- Special acknowledgment for exceptional contributions

---

## Support

- **Documentation:** [Link to docs]
- **Issues:** [Link to issue tracker]
- **Discussions:** [Link to discussions]
- **Security:** [security@example.com]

---

## Checksums

```
SHA256 Checksums:
- package.tar.gz: [checksum]
- package.zip: [checksum]
```

---

## Full Changelog

For a complete list of changes, see [CHANGELOG.md](../CHANGELOG.md) or compare versions on GitHub.
