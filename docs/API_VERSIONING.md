# API Versioning Strategy

**Document Version:** 1.0
**Last Updated:** 2025-12
**Owner:** Platform Engineering Team

---

## Table of Contents

1. [Overview](#overview)
2. [Versioning Approach](#versioning-approach)
3. [Version Lifecycle](#version-lifecycle)
4. [Breaking vs Non-Breaking Changes](#breaking-vs-non-breaking-changes)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Client Migration Guide](#client-migration-guide)
7. [Version Matrix](#version-matrix)

---

## Overview

### Purpose

This document defines the API versioning strategy for the Unified Health Platform. A consistent versioning approach ensures:

- **Stability**: Clients can rely on API behavior not changing unexpectedly
- **Evolution**: The platform can evolve without breaking existing integrations
- **Communication**: Clear expectations about API lifecycle and deprecation
- **Compliance**: Audit trail of API changes for regulatory requirements

### Scope

This strategy applies to:
- Public REST APIs
- Internal service-to-service APIs
- Webhook payloads
- SDK libraries

---

## Versioning Approach

### URL-Based Versioning

We use **URL path versioning** as the primary versioning mechanism:

```
https://api.theunifiedhealth.com/api/v1/patients
https://api.theunifiedhealth.com/api/v2/patients
```

### Why URL-Based Versioning?

| Approach | Pros | Cons | Our Choice |
|----------|------|------|------------|
| **URL Path** (`/v1/`) | Clear, cacheable, easy routing | URL changes for new version | **Selected** |
| Header (`Accept-Version: v1`) | Clean URLs | Less visible, caching complex | Not used |
| Query Param (`?version=1`) | Easy to add | Not RESTful, caching issues | Not used |
| Content-Type (`application/vnd.uh.v1+json`) | Precise | Complex, low adoption | Not used |

### Version Format

```
v{major}

Examples:
- v1  (current stable)
- v2  (next major version)
```

We use **major versions only** in the URL. Minor and patch changes are backward-compatible and don't require URL changes.

### Internal Version Tracking

Internally, we track versions semantically:

```
{major}.{minor}.{patch}

Examples:
- 1.0.0  Initial v1 release
- 1.1.0  New feature (backward-compatible)
- 1.1.1  Bug fix
- 2.0.0  Breaking change (new URL: /v2/)
```

---

## Version Lifecycle

### Lifecycle Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API Version Lifecycle                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐│
│  │  Alpha   │───>│   Beta   │───>│  Stable  │───>│Deprecated│───>│ Sunset ││
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └────────┘│
│                                                                              │
│  Alpha:      Internal testing, may change without notice                     │
│  Beta:       Public preview, changes with notice                             │
│  Stable:     Production-ready, follows deprecation policy                    │
│  Deprecated: Still functional, migration recommended                         │
│  Sunset:     Removed, returns 410 Gone                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Timelines

| Transition | Minimum Duration | Communication |
|------------|------------------|---------------|
| Alpha -> Beta | 4 weeks | Developer portal announcement |
| Beta -> Stable | 4 weeks | Email to beta users |
| Stable -> Deprecated | 6 months notice | Email + in-API headers |
| Deprecated -> Sunset | 12 months | Multiple warnings |

### Deprecation Headers

When a version is deprecated, responses include:

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 31 Dec 2026 23:59:59 GMT
Link: <https://api.theunifiedhealth.com/api/v2/patients>; rel="successor-version"

{
  "data": {...},
  "meta": {
    "deprecationNotice": "This API version is deprecated. Please migrate to v2 by Dec 31, 2026."
  }
}
```

---

## Breaking vs Non-Breaking Changes

### Non-Breaking Changes (No Version Bump)

These changes are safe and don't require a new major version:

| Change Type | Example | Impact |
|-------------|---------|--------|
| **Add endpoint** | `POST /patients/{id}/notes` | New functionality |
| **Add optional field** | Response: `"middleName": "J."` | Clients ignore unknown |
| **Add optional parameter** | `?includeArchived=true` | Defaults preserve behavior |
| **Extend enum** | Status: + `"on_hold"` | Clients should handle unknown |
| **Increase rate limits** | 100 -> 200 req/min | Performance improvement |
| **Fix bugs** | Correct error codes | Matches documentation |

**Client Recommendation:** Clients should be designed to ignore unknown fields and handle unknown enum values gracefully.

### Breaking Changes (Require Version Bump)

These changes require a new major version:

| Change Type | Example | Migration Required |
|-------------|---------|-------------------|
| **Remove endpoint** | Delete `/legacy/patients` | Update API calls |
| **Remove field** | Remove `ssn` from response | Remove field usage |
| **Rename field** | `firstName` -> `givenName` | Update field mapping |
| **Change field type** | `age: "25"` -> `age: 25` | Update parsing |
| **Change URL structure** | `/patient/{id}` -> `/patients/{id}` | Update URLs |
| **Change authentication** | API key -> OAuth | Update auth flow |
| **Change error format** | Different error schema | Update error handling |
| **Remove enum value** | Status: - `"pending"` | Handle missing values |
| **Make optional required** | `phone` now required | Provide required fields |

---

## Implementation Guidelines

### Endpoint Structure

```
/api/v{version}/{service}/{resource}

Examples:
/api/v1/auth/login
/api/v1/patients
/api/v1/patients/{id}
/api/v1/patients/{id}/appointments
/api/v1/telehealth/visits/{id}/messages
```

### Service-Level Versioning

Each microservice maintains its own version aligned with the API version:

```
┌───────────────────────────────────────────────────────────────┐
│                    Version Alignment                           │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  API Gateway          Auth Service        Telehealth Service  │
│  ┌────────────┐       ┌────────────┐      ┌────────────┐      │
│  │  /api/v1   │──────>│ v1.x.x     │      │ v1.x.x     │      │
│  │  /api/v2   │──────>│ v2.x.x     │      │ v2.x.x     │      │
│  └────────────┘       └────────────┘      └────────────┘      │
│                                                                │
│  The API Gateway routes to the appropriate service version    │
│  based on the URL version prefix.                             │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### Code Organization

```
services/
└── auth-service/
    └── src/
        ├── routes/
        │   ├── v1/              # v1 routes
        │   │   ├── auth.routes.ts
        │   │   └── mfa.routes.ts
        │   └── v2/              # v2 routes (when needed)
        │       ├── auth.routes.ts
        │       └── mfa.routes.ts
        ├── controllers/
        │   ├── v1/
        │   └── v2/
        └── schemas/
            ├── v1/              # Request/response schemas
            └── v2/
```

### Version Negotiation in Gateway

```typescript
// API Gateway routing configuration
const routeConfig = {
  '/api/v1/auth/*': {
    target: 'http://auth-service-v1:3000',
    pathRewrite: { '^/api/v1/auth': '' }
  },
  '/api/v2/auth/*': {
    target: 'http://auth-service-v2:3000',
    pathRewrite: { '^/api/v2/auth': '' }
  }
};
```

### OpenAPI Specification per Version

Each version has its own OpenAPI specification:

```yaml
# services/api/openapi-v1.yaml
openapi: 3.0.3
info:
  title: Unified Health Platform API
  version: 1.0.0
  description: v1 API specification

# services/api/openapi-v2.yaml
openapi: 3.0.3
info:
  title: Unified Health Platform API
  version: 2.0.0
  description: v2 API specification
```

---

## Client Migration Guide

### Migration Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Client Migration Process                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. ANNOUNCEMENT (6+ months before sunset)                                   │
│     └── Email notification to all API consumers                             │
│     └── Developer portal announcement                                        │
│     └── API responses include deprecation headers                           │
│                                                                              │
│  2. DOCUMENTATION (available at announcement)                                │
│     └── Migration guide published                                            │
│     └── Breaking changes documented                                          │
│     └── Code examples for new version                                        │
│                                                                              │
│  3. PARALLEL OPERATION (during migration period)                             │
│     └── Both versions available                                              │
│     └── New version is default for new integrations                         │
│     └── Old version continues to work                                        │
│                                                                              │
│  4. MIGRATION SUPPORT                                                        │
│     └── Office hours for developers                                          │
│     └── SDK updates released                                                 │
│     └── Sandbox environment with new version                                 │
│                                                                              │
│  5. DEPRECATION WARNINGS (3 months before sunset)                            │
│     └── Increased warning frequency                                          │
│     └── Direct outreach to remaining users                                   │
│                                                                              │
│  6. SUNSET                                                                   │
│     └── Old version returns 410 Gone                                         │
│     └── Error response includes migration URL                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example: v1 to v2 Migration

#### Change: Patient Resource Structure

**v1 Response:**
```json
{
  "id": "pat_123",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-15",
  "address": "123 Main St, City, ST 12345"
}
```

**v2 Response:**
```json
{
  "id": "pat_123",
  "name": {
    "given": "John",
    "family": "Doe"
  },
  "birthDate": "1990-01-15",
  "address": {
    "line": ["123 Main St"],
    "city": "City",
    "state": "ST",
    "postalCode": "12345"
  }
}
```

#### Migration Steps

1. **Update SDK** (if using official SDK)
   ```bash
   npm install @unified-health/sdk@2.0.0
   ```

2. **Update Code**
   ```javascript
   // Before (v1)
   const patientName = `${patient.firstName} ${patient.lastName}`;
   const dob = patient.dob;

   // After (v2)
   const patientName = `${patient.name.given} ${patient.name.family}`;
   const dob = patient.birthDate;
   ```

3. **Update API Endpoint**
   ```javascript
   // Before
   const response = await fetch('/api/v1/patients/123');

   // After
   const response = await fetch('/api/v2/patients/123');
   ```

4. **Test Thoroughly**
   - Use sandbox environment
   - Run integration tests
   - Verify error handling

### Backward Compatibility Helpers

During migration periods, we may provide compatibility options:

```http
GET /api/v2/patients/123?format=v1-compat
```

This returns v2 data in v1-compatible structure (where feasible).

---

## Version Matrix

### Current Versions

| API Version | Status | Release Date | Deprecation Date | Sunset Date |
|-------------|--------|--------------|------------------|-------------|
| **v1** | Stable | 2025-01 | TBD | TBD |
| v2 | Planning | TBD | TBD | TBD |

### Service Version Compatibility

| Service | v1 API Support | v2 API Support |
|---------|----------------|----------------|
| Auth Service | v1.x.x | Planned |
| Telehealth Service | v1.x.x | Planned |
| Notification Service | v1.x.x | Planned |
| Laboratory Service | v1.x.x | Planned |
| Pharmacy Service | v1.x.x | Planned |

### SDK Version Compatibility

| SDK | Supported API Versions | Latest Version |
|-----|------------------------|----------------|
| JavaScript/TypeScript | v1 | 1.0.0 |
| Python | v1 | 1.0.0 |
| Java | v1 | 1.0.0 |
| Go | v1 | 1.0.0 |

---

## Best Practices

### For API Developers

1. **Design for Evolution**: Use objects instead of primitives for extensibility
2. **Document Everything**: Every change should be in changelog
3. **Test Backward Compatibility**: Automated tests for non-breaking changes
4. **Use Feature Flags**: For gradual rollout of new behaviors
5. **Monitor Usage**: Track which versions clients are using

### For API Consumers

1. **Use Official SDKs**: They handle versioning for you
2. **Subscribe to Announcements**: Get notified of deprecations
3. **Test in Sandbox**: Validate against new versions early
4. **Handle Unknown Fields**: Ignore fields you don't recognize
5. **Monitor Deprecation Headers**: Set up alerts for deprecation warnings

---

## References

- [OpenAPI Specifications](../services/api/openapi.yaml)
- [API Documentation](./api/README.md)
- [ADR-001: Microservices Architecture](./adr/ADR-001-microservices-architecture.md)
- [Semantic Versioning](https://semver.org/)

---

**Document Classification:** Public
**Review Frequency:** Annually
**Next Review Date:** 2026-12
