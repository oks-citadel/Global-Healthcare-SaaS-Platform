# Asset Branding Deployment & Usage Guide

**Version:** 1.0.0
**Last Updated:** 2026-01-08
**Audience:** Developers, DevOps, Platform Engineers

---

## Overview

The `@unified-health/asset-branding` package is the single source of truth for all visual identity across The Unified Health platform. This guide covers installation, usage, deployment, and version management.

---

## 1. Package Structure

```
@unified-health/asset-branding/
├── dist/
│   ├── index.js          # CommonJS bundle
│   ├── index.mjs         # ESM bundle
│   ├── index.d.ts        # TypeScript declarations
│   ├── tokens.json       # Design tokens
│   ├── theme.css         # CSS variables
│   ├── theme.min.css     # Minified CSS
│   ├── patient.theme.json
│   └── provider.theme.json
├── icons/
│   ├── healthcare.svg
│   ├── shield-check.svg
│   ├── user-medical.svg
│   └── ... (more icons)
├── src/
│   └── tailwind.config.ts
└── package.json
```

---

## 2. Installation

### NPM/PNPM (Recommended)

```bash
# Using pnpm (project default)
pnpm add @unified-health/asset-branding

# Using npm
npm install @unified-health/asset-branding
```

### From ECR (Docker Image)

```bash
# Pull the asset-branding image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker pull <account>.dkr.ecr.us-east-1.amazonaws.com/unified-health-prod/asset-branding:v1.0.0
```

---

## 3. Usage Patterns

### Pattern A: Build-Time Vendoring (Recommended)

Import tokens and styles directly into your build process.

```tsx
// Import design tokens
import tokens from '@unified-health/asset-branding/tokens';
import { clinicalBlue, semanticColors } from '@unified-health/asset-branding';

// Import CSS theme
import '@unified-health/asset-branding/theme.css';

// Use tokens in your components
const primaryColor = tokens.color.brand['clinical-blue']['500'].$value;
```

**Tailwind CSS Integration:**

```javascript
// tailwind.config.js
const unifiedHealthPreset = require('@unified-health/asset-branding/tailwind');

module.exports = {
  presets: [unifiedHealthPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // Your customizations...
};
```

### Pattern B: CSS Variables (Runtime)

Link the CSS theme file for runtime token consumption.

```html
<!-- In your HTML head -->
<link rel="stylesheet" href="path/to/@unified-health/asset-branding/dist/theme.css">
```

```css
/* Use variables in your CSS */
.button-primary {
  background-color: var(--uh-clinical-blue-500);
  color: var(--uh-text-inverse);
  border-radius: var(--uh-radius-md);
  padding: var(--uh-space-3) var(--uh-space-4);
}

.button-primary:hover {
  background-color: var(--uh-clinical-blue-600);
}

.button-primary:focus-visible {
  box-shadow: var(--uh-shadow-focus-ring);
}
```

### Pattern C: Docker Volume Mount

For containerized services, mount assets from the asset-branding image.

```yaml
# docker-compose.yml
services:
  asset-branding:
    image: ${ECR_REPO}/asset-branding:${BRANDING_VERSION}
    volumes:
      - branding-assets:/assets:ro

  web-app:
    image: ${ECR_REPO}/web-app:${APP_VERSION}
    environment:
      - ASSET_BRANDING_VERSION=${BRANDING_VERSION}
    volumes:
      - branding-assets:/app/public/branding:ro
    depends_on:
      - asset-branding

volumes:
  branding-assets:
```

---

## 4. Role-Based Theming

The package includes separate theme configurations for patients and providers.

```tsx
import { getThemeByRole } from '@unified-health/asset-branding';

// Get theme based on user role
const theme = getThemeByRole('patient'); // or 'provider'

// Apply role-specific styling
const buttonStyle = theme.componentOverrides.Button.primary;
```

### Patient Theme

- Larger touch targets (48px minimum)
- Warmer, more approachable colors
- Simpler, clearer language guidelines
- More generous spacing

### Provider Theme

- Efficient, compact layouts
- Clinical data display optimizations
- Data provenance indicators
- Professional medical terminology

---

## 5. Version Management

### Semantic Versioning

All branding versions follow semver:

- **Major (X.0.0):** Breaking visual changes
- **Minor (0.X.0):** New tokens/components (backward compatible)
- **Patch (0.0.X):** Bug fixes, documentation

### Version Pinning (Required)

**CRITICAL:** Never use `:latest` tags. All services must pin to specific versions.

```yaml
# WRONG
image: unified-health-prod/asset-branding:latest

# CORRECT
image: unified-health-prod/asset-branding:v1.0.0
image: unified-health-prod/asset-branding:sha256:abc123...
```

### Checking Current Version

```bash
# From SSM Parameter Store
aws ssm get-parameter --name /unified-health/prod/asset-branding/current-version

# From package
node -e "console.log(require('@unified-health/asset-branding/package.json').version)"
```

---

## 6. CI/CD Integration

### Version Validation

Add to your CI pipeline:

```yaml
# .github/workflows/build.yml
- name: Validate branding version
  run: |
    BRANDING_VERSION=$(cat package.json | jq -r '.dependencies["@unified-health/asset-branding"]')
    if [[ "$BRANDING_VERSION" == "*" || "$BRANDING_VERSION" == "latest" ]]; then
      echo "ERROR: Branding version must be pinned"
      exit 1
    fi
```

### Build Order

Asset branding must build first:

```yaml
jobs:
  build-branding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build asset-branding
        run: pnpm --filter @unified-health/asset-branding build

  build-services:
    needs: build-branding
    strategy:
      matrix:
        service: [web-app, provider-portal, admin-portal]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build ${{ matrix.service }}
        run: pnpm --filter ${{ matrix.service }} build
```

### Token Validation

```yaml
- name: Validate tokens
  run: pnpm --filter @unified-health/asset-branding validate
```

---

## 7. Terraform Integration

### ECR Repository

```hcl
module "asset_branding_ecr" {
  source = "./modules/ecr-asset-branding"

  environment         = "prod"
  kms_key_arn        = module.kms.key_arn
  alarm_sns_topic_arn = module.alerts.sns_topic_arn

  tags = {
    Team = "platform"
  }
}
```

### ECS Service Configuration

```hcl
module "ecs_fargate" {
  source = "./modules/ecs-fargate"

  environment             = "prod"
  asset_branding_version  = "v1.0.0"  # Pin to specific version

  service_versions = {
    "web-app"         = "v2.3.1"
    "provider-portal" = "v1.8.0"
    "admin-portal"    = "v1.5.2"
  }

  # ... other configuration
}
```

---

## 8. Rollback Procedures

### Identify Current Version

```bash
aws ssm get-parameter --name /unified-health/prod/asset-branding/current-version
```

### Roll Back to Previous Version

```bash
# Update SSM parameter
aws ssm put-parameter \
  --name /unified-health/prod/asset-branding/current-version \
  --value "v0.9.0" \
  --overwrite

# Trigger redeployment
aws ecs update-service \
  --cluster unified-health-prod \
  --service web-app \
  --force-new-deployment
```

### Terraform Rollback

```bash
# Revert to previous version in tfvars
terraform apply -var="asset_branding_version=v0.9.0"
```

---

## 9. Compatibility Matrix

| Service | Min Branding Version | Max Branding Version |
|---------|---------------------|---------------------|
| web-app v2.x | v1.0.0 | v1.x.x |
| provider-portal v1.x | v1.0.0 | v1.x.x |
| admin-portal v1.x | v1.0.0 | v1.x.x |
| mobile v1.x | v1.0.0 | v1.x.x |
| kiosk v1.x | v1.0.0 | v1.x.x |

---

## 10. Troubleshooting

### Missing CSS Variables

**Symptom:** CSS variables not resolving

**Solution:**
```tsx
// Ensure theme.css is imported before your components
import '@unified-health/asset-branding/theme.css';
import './your-styles.css';
```

### TypeScript Errors

**Symptom:** Cannot find module '@unified-health/asset-branding'

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

### Docker Build Failures

**Symptom:** Cannot pull asset-branding image

**Solution:**
```bash
# Ensure ECR login is current
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Verify image exists
aws ecr describe-images --repository-name unified-health-prod/asset-branding --image-ids imageTag=v1.0.0
```

---

## 11. Support

- **Documentation:** `/docs/architecture/ui-trust-model.md`
- **Brand Guidelines:** `/brand/brand-system.md`
- **UX Standards:** `/brand/ux-language-standards.md`
- **Clinical Checklist:** `/qa/clinical-ux-risk-checklist.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial release |

---

*This guide is maintained by the Platform Engineering team.*
