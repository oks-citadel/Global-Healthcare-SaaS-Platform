# Software Bill of Materials (SBOM) Policy

## Overview

This document outlines the SBOM generation, management, and compliance policy for the UnifiedHealth Global Platform. SBOMs provide a comprehensive inventory of all software components, dependencies, and their relationships, enabling transparency in the software supply chain.

## Table of Contents

1. [Purpose](#purpose)
2. [Scope](#scope)
3. [SBOM Generation Process](#sbom-generation-process)
4. [Update Frequency](#update-frequency)
5. [Compliance Requirements](#compliance-requirements)
6. [Reading and Using the SBOM](#reading-and-using-the-sbom)
7. [Storage and Retention](#storage-and-retention)
8. [Vulnerability Management](#vulnerability-management)
9. [Roles and Responsibilities](#roles-and-responsibilities)

---

## Purpose

The SBOM policy serves to:

- Provide complete transparency into software dependencies
- Enable rapid identification of vulnerable components
- Support regulatory compliance (HIPAA, SOC2, GDPR)
- Facilitate incident response and risk assessment
- Meet federal requirements for software supply chain security
- Support customer due diligence and audit requirements

## Scope

This policy applies to:

- All production applications and services
- Development and staging environments
- Third-party libraries and dependencies
- Container images and base images
- Infrastructure-as-Code dependencies
- Frontend and backend packages

## SBOM Generation Process

### Automated Generation

SBOMs are automatically generated using CycloneDX format through our CI/CD pipeline:

```bash
# Generate SBOM for root project
pnpm sbom:generate

# Generate SBOM in XML format
pnpm sbom:generate:xml

# Generate SBOMs for all workspaces
pnpm sbom:generate:all
```

### Manual Generation

For ad-hoc SBOM generation:

```bash
# Using npx directly
npx @cyclonedx/cyclonedx-npm --output-file sbom.json --output-format JSON

# With specific options
npx @cyclonedx/cyclonedx-npm \
  --output-file sbom.json \
  --output-format JSON \
  --spec-version 1.5 \
  --mc-type application \
  --flatten-components
```

### Workspace-Specific SBOMs

Generate SBOMs for individual workspaces:

```bash
# Run the generation script
./scripts/generate-sbom.sh [version]

# Or generate for specific workspace
cd apps/web && npx @cyclonedx/cyclonedx-npm --output-file sbom-web.json
```

### Trigger Events

SBOMs are generated on:

| Event | Trigger | Storage |
|-------|---------|---------|
| Release | Git tag `v*` | S3 + Release artifacts |
| Manual | Workflow dispatch | S3 + GitHub artifacts |
| Scheduled | Weekly (optional) | S3 |
| PR Merge | Main branch push | GitHub artifacts |

## Update Frequency

### Required Updates

| Scenario | Frequency | Owner |
|----------|-----------|-------|
| Production releases | Every release | Release Manager |
| Security patches | Immediate | Security Team |
| Dependency updates | With each update | Development Team |
| Quarterly audits | Every 90 days | Compliance Team |

### Recommended Schedule

- **Daily**: Development environment SBOMs
- **Weekly**: Staging environment SBOMs
- **Per-release**: Production SBOMs
- **On-demand**: Security incident response

## Compliance Requirements

### Regulatory Frameworks

#### HIPAA
- SBOMs support the technical safeguard requirements
- Enable tracking of systems handling PHI
- Facilitate security risk assessments

#### SOC2
- Support Trust Services Criteria for security
- Enable continuous monitoring controls
- Provide audit trail for software changes

#### GDPR
- Document processing system components
- Support Data Protection Impact Assessments
- Enable transparency in data handling systems

#### Executive Order 14028
- Compliant with federal SBOM requirements
- Machine-readable format (CycloneDX)
- Minimum required data fields included

### Required SBOM Fields

Each SBOM must contain:

| Field | Description | Required |
|-------|-------------|----------|
| `bomFormat` | CycloneDX | Yes |
| `specVersion` | 1.4 or higher | Yes |
| `serialNumber` | Unique identifier | Yes |
| `version` | SBOM version | Yes |
| `metadata.timestamp` | Generation time | Yes |
| `metadata.component` | Root component info | Yes |
| `components` | Dependency list | Yes |
| `dependencies` | Relationship graph | Recommended |

## Reading and Using the SBOM

### SBOM Structure

The CycloneDX SBOM follows this structure:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:...",
  "version": 1,
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "tools": [...],
    "component": {
      "type": "application",
      "name": "unified-health-platform",
      "version": "1.0.0"
    }
  },
  "components": [
    {
      "type": "library",
      "name": "express",
      "version": "4.18.2",
      "purl": "pkg:npm/express@4.18.2",
      "licenses": [{"license": {"id": "MIT"}}],
      "hashes": [{"alg": "SHA-256", "content": "..."}]
    }
  ],
  "dependencies": [...]
}
```

### Key Fields Explained

#### Component Types
- `application`: The main application
- `library`: Third-party dependencies
- `framework`: Application frameworks
- `file`: Individual files

#### Package URL (PURL)
Standardized format for identifying packages:
```
pkg:npm/express@4.18.2
pkg:npm/%40types/node@20.0.0
```

#### Licenses
Identifies open source license compliance:
```json
{
  "licenses": [
    {"license": {"id": "MIT"}},
    {"license": {"id": "Apache-2.0"}}
  ]
}
```

### Tools for Analysis

#### Command Line Tools

```bash
# View component count
jq '.components | length' sbom.json

# List all package names
jq '.components[].name' sbom.json

# Find specific package
jq '.components[] | select(.name == "lodash")' sbom.json

# List packages by license
jq '.components[] | select(.licenses[].license.id == "MIT") | .name' sbom.json

# Export to CSV
jq -r '.components[] | [.name, .version, .licenses[0].license.id // "Unknown"] | @csv' sbom.json
```

#### Visual Tools

- **Dependency-Track**: Open source SBOM analysis platform
- **OWASP Dependency-Check**: Vulnerability scanning
- **Anchore**: Container and SBOM analysis
- **Snyk**: Security scanning integration

### Integration with Security Tools

```bash
# Upload to Dependency-Track
curl -X POST "https://dtrack.example.com/api/v1/bom" \
  -H "X-Api-Key: ${DT_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @sbom.json

# Scan with Grype
grype sbom:./sbom.json

# Analyze with Syft
syft -o cyclonedx-json ./sbom.json
```

## Storage and Retention

### Storage Locations

| Location | Purpose | Access |
|----------|---------|--------|
| S3 Compliance Bucket | Long-term storage | Restricted |
| GitHub Release | Public distribution | Public |
| GitHub Artifacts | CI/CD artifacts | Team |
| Dependency-Track | Analysis platform | Security Team |

### Retention Policy

| Type | Retention Period | Justification |
|------|-----------------|---------------|
| Production releases | 7 years | Compliance requirements |
| Security incidents | 7 years | Audit trail |
| Development builds | 90 days | Debugging |
| PR artifacts | 30 days | Review |

### S3 Storage Structure

```
s3://unified-health-sbom-compliance/
  sbom/
    index.json              # Master index
    latest/                 # Current release
      sbom-root.json
      sbom-manifest.json
    v1.0.0/
      20240115-103000/
        sbom-root.json
        sbom-web.json
        sbom-api.json
        checksums.sha256
```

## Vulnerability Management

### Integration Workflow

1. **Generation**: SBOM created during CI/CD
2. **Upload**: Automatically sent to Dependency-Track
3. **Analysis**: Continuous vulnerability scanning
4. **Alerting**: Notifications for new CVEs
5. **Remediation**: Tracked in security backlog

### Response SLAs

| Severity | Response Time | Resolution Time |
|----------|--------------|-----------------|
| Critical | 4 hours | 24 hours |
| High | 24 hours | 7 days |
| Medium | 7 days | 30 days |
| Low | 30 days | 90 days |

### CVE Tracking

When a vulnerability is identified:

1. Cross-reference SBOM components with CVE database
2. Determine affected versions and deployment status
3. Assess risk based on component usage
4. Plan and execute remediation
5. Generate new SBOM after patching
6. Document in security incident log

## Roles and Responsibilities

### Security Team
- Define SBOM policy and standards
- Review and approve tools
- Monitor vulnerability feeds
- Coordinate incident response

### Development Team
- Maintain dependency hygiene
- Review dependency updates
- Address vulnerability findings
- Ensure SBOM accuracy

### Release Manager
- Verify SBOM generation in releases
- Attach SBOMs to release artifacts
- Coordinate with compliance team

### Compliance Team
- Audit SBOM processes quarterly
- Maintain retention records
- Support external audits
- Track regulatory changes

### DevOps/Platform Team
- Maintain CI/CD pipelines
- Manage S3 storage
- Configure analysis tools
- Monitor generation failures

---

## Quick Reference

### Common Commands

```bash
# Generate JSON SBOM
pnpm sbom:generate

# Generate XML SBOM
pnpm sbom:generate:xml

# Generate all workspace SBOMs
pnpm sbom:generate:all

# View SBOM summary
jq '{format: .bomFormat, version: .specVersion, components: (.components | length)}' sbom.json
```

### Verification Checklist

- [ ] SBOM generated successfully
- [ ] All components listed
- [ ] Licenses identified
- [ ] Uploaded to S3
- [ ] Attached to release
- [ ] No critical vulnerabilities
- [ ] Manifest file created
- [ ] Checksums verified

### Contact Information

- **Security Team**: security@thetheunifiedhealth.com
- **Compliance Team**: compliance@thetheunifiedhealth.com
- **DevOps Support**: devops@thetheunifiedhealth.com
- **Slack Channel**: #security-sbom

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Security Team | Initial release |

## References

- [CycloneDX Specification](https://cyclonedx.org/specification/overview/)
- [NTIA SBOM Minimum Elements](https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom)
- [Executive Order 14028](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/)
- [OWASP Dependency-Track](https://dependencytrack.org/)
