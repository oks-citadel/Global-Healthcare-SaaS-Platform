# Branding Alignment Report

**Date:** January 2, 2026
**Domain:** theunifiedhealth.com
**Project:** The Unified Health Platform

---

## Executive Summary

This report documents the controlled branding alignment completed across the entire platform. All user-facing text has been updated to use consistent canonical branding while preserving all system stability - no routes, schemas, identifiers, or infrastructure were modified.

### Canonical Brand Rules Applied

| Context | Brand Name |
|---------|------------|
| External-facing system identity | **The Unified Health** |
| UI shorthand (dashboards/navigation) | **Unified Health** |
| Domain | **theunifiedhealth.com** |
| Email domain | **@theunifiedhealth.com** |
| Legal entity | **The Unified Health, Inc.** |

---

## Change Log

### 1. Branding Configuration (Single Source of Truth)

**New File Created:**
- `packages/country-config/src/branding.ts` - Central branding configuration

**Files Modified:**
- `packages/country-config/src/index.ts` - Added branding exports
- `packages/country-config/src/types.ts` - Updated `GLOBAL_CONFIG.platformName`

### 2. Frontend Applications

| File | Change |
|------|--------|
| `apps/web/src/app/layout.tsx` | Title: "Unified Health - Healthcare Portal" |
| `apps/web/src/components/layout/Header.tsx` | Logo text: "Unified Health" |
| `apps/web/src/components/layout/Footer.tsx` | Copyright example updated |
| `apps/web/src/app/login/page.tsx` | Welcome text updated |
| `apps/admin/src/app/layout.tsx` | Title: "Admin Dashboard - Unified Health" |
| `apps/provider-portal/src/app/layout.tsx` | Already correct |
| `apps/mobile/app.json` | App name: "Unified Health" |

### 3. i18n Localization

| File | Changes |
|------|---------|
| `packages/i18n/src/locales/en/common.json` | `app.name`: "The Unified Health", `app.welcome`: "Welcome to The Unified Health" |
| `packages/i18n/src/locales/en/auth.json` | `register.subtitle`: "Join The Unified Health" |

### 4. Email Templates (16 HTML files)

| Template | Changes |
|----------|---------|
| `base.html` | Title, header, copyright footer |
| `welcome.html` | All "UnifiedHealth" references |
| `password-reset.html` | Account reference, team signature |
| `subscription-welcome.html` | Welcome text, team signature |
| `appointment-confirmation.html` | Team signature |
| `appointment-reminder.html` | Team signature |
| `invoice.html` | Company name, team signature |
| `visit-summary.html` | Thank you text, team signature |

### 5. Auth Service

| File | Changes |
|------|---------|
| `services/auth-service/src/config/index.ts` | Default email sender name |
| `services/auth-service/src/utils/email.ts` | All email templates (password reset, verification, welcome) |

### 6. Legal Documents

| Document | Changes |
|----------|---------|
| `docs/compliance/PRIVACY-POLICY.md` | Company name, contact emails (@theunifiedhealth.com), legal entity |
| `docs/compliance/TERMS-OF-SERVICE.md` | Company name, contact emails, legal entity, copyright |

### 7. API Documentation (OpenAPI/Swagger)

| File | Changes |
|------|---------|
| `services/api-gateway/openapi.yaml` | info.title, description, contact email, license URL |
| `services/api/openapi.yaml` | info.title, description, contact email, license URL |
| `services/auth-service/openapi.yaml` | info.title, description, contact email, license URL |
| `services/notification-service/openapi.yaml` | info.title, description, contact email, license URL |
| `services/telehealth-service/openapi.yaml` | info.title, description, contact email, license URL |
| `services/api/src/docs/swagger.ts` | title, contact, license, customSiteTitle |

### 8. Infrastructure (Terraform/K8s/Helm)

**Terraform AWS (`infrastructure/terraform-aws/`):**
- `main.tf` - Header comment, Product tag
- `variables.tf` - Header comment
- `providers.tf` - Product tags for all regions
- `outputs.tf` - Header comment
- `versions.tf` - Header comment
- `environments/*.tfvars` - Header comments

**Helm Charts (`infrastructure/helm/unified-health/`):**
- `Chart.yaml` - Description, maintainer name
- `values.yaml` - Header comment
- `values-production.yaml` - Header comment
- `values-staging.yaml` - Header comment
- `templates/NOTES.txt` - Deployment message

**Kubernetes (`infrastructure/kubernetes/`):**
- All base manifests - Header comments
- All overlay manifests - Header comments, description annotations

### 9. Monitoring Dashboards

| File | Changes |
|------|---------|
| `infrastructure/monitoring/dashboards/healthcare-platform-overview.json` | Title, description |
| `infrastructure/monitoring/dashboards/unified-health-dashboard.json` | Dashboard header |

### 10. CI/CD Branding Enforcement

**Modified:**
- `.github/workflows/ci-tests.yml` - Added `branding-check` job

**New CI Job Features:**
- Scans for disallowed branding patterns
- Fails builds if old variants detected
- Excludes internal identifiers (package names, env vars)
- Integrated into CI gate

---

## Summary Statistics

| Category | Files Modified |
|----------|---------------|
| Branding Configuration | 3 |
| Frontend Apps | 7 |
| i18n Localization | 2 |
| Email Templates | 8+ |
| Auth Service | 2 |
| Legal Documents | 2 |
| API Documentation | 6 |
| Terraform | 10+ |
| Kubernetes | 20+ |
| Helm Charts | 5 |
| Monitoring | 2 |
| CI/CD | 1 |
| **Total** | **~70+ files** |

---

## Verification Checklist

- [x] No routes, URLs, or API paths changed
- [x] No database schemas, tables, or columns renamed
- [x] No environment variables renamed
- [x] No color palettes, layouts, or UX flows modified
- [x] No internal identifiers changed (package names, namespaces, etc.)
- [x] Auth flows remain functional
- [x] Email template structure preserved
- [x] All changes are text-level and reversible

---

## Brand Guardrails Implemented

### 1. Single Source of Truth
Location: `packages/country-config/src/branding.ts`

Exports:
- `BRANDING` - Central configuration object
- `BrandingHelpers` - Helper functions
- `ALLOWED_BRAND_VARIANTS` - For validation
- `DISALLOWED_BRAND_PATTERNS` - For CI enforcement

### 2. CI Enforcement
Location: `.github/workflows/ci-tests.yml`

The `branding-check` job:
- Runs on every PR and push to main/develop
- Scans user-facing files for disallowed patterns
- Blocks merge if violations found
- Excludes internal identifiers via whitelist

### 3. Allowed Patterns

| Pattern | Use Case |
|---------|----------|
| `The Unified Health` | External-facing, canonical |
| `Unified Health` | UI shorthand, navigation |
| `theunifiedhealth.com` | Domain references |

### 4. Disallowed Patterns

| Pattern | Reason |
|---------|--------|
| `UnifiedHealth` | Missing space |
| `Unified Healthcare` | Old variant |
| `unified-health.com` | Wrong domain |
| `unifiedhealth.com` | Wrong domain |

---

## Final Assertion

Branding is now **canonical**, **consistent**, and **guarded against future drift**.

All changes align with the domain `theunifiedhealth.com` and follow the established brand rules without introducing any breaking changes to the platform.

---

*Report generated as part of controlled asset rebranding initiative.*
