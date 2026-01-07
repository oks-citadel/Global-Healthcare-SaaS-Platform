# API Deprecation Policy

**Last Updated:** January 5, 2026
**Version:** 1.0
**Owner:** Platform Engineering

## Overview

This document defines the API versioning strategy, deprecation timeline, and migration procedures for the Unified Health platform. It ensures clients have adequate time to migrate while allowing the platform to evolve.

---

## Versioning Strategy

### URL-Based Versioning

All API endpoints are versioned using URL path prefixes:

```
https://api.thetheunifiedhealth.com/api/v1/patients
https://api.thetheunifiedhealth.com/api/v2/patients
```

### Version Format

- **Major version**: Breaking changes (v1 → v2)
- **Minor version**: Additive changes (documented in changelog)
- **Patch version**: Bug fixes (no API changes)

Only major versions are exposed in the URL. Minor and patch versions are transparent to clients.

---

## Support Policy

### Version Lifecycle

| Phase          | Duration      | Description                      |
| -------------- | ------------- | -------------------------------- |
| **Current**    | Ongoing       | Active development, new features |
| **Supported**  | 12 months min | Bug fixes, security patches      |
| **Deprecated** | 6 months      | No new features, security only   |
| **Sunset**     | -             | Removed from service             |

### Support Matrix

| Version | Status    | Release Date | Deprecation Date | Sunset Date |
| ------- | --------- | ------------ | ---------------- | ----------- |
| v1      | Supported | 2025-01-01   | 2026-07-01       | 2027-01-01  |
| v2      | Current   | 2026-01-01   | TBD              | TBD         |

**Commitment:** We will support at least 2 major versions simultaneously.

---

## Deprecation Process

### Timeline

```
Day 0        Day 30       Day 90       Day 150      Day 180
  │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Announce │ │Warning  │ │Migration│ │Final    │ │Sunset   │
│Deprec.  │ │Headers  │ │Support  │ │Warning  │ │Version  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Phase 1: Announcement (Day 0)

1. **Documentation Update**
   - Deprecation notice added to API docs
   - Migration guide published
   - Changelog updated

2. **Communication**
   - Email to all API consumers
   - In-app notification for dashboard users
   - Blog post announcement
   - Status page update

3. **New Version Available**
   - New API version fully documented
   - SDKs updated with new version support

### Phase 2: Warning Headers (Day 30)

Add deprecation headers to all responses:

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: <https://docs.thetheunifiedhealth.com/api/migration/v1-to-v2>; rel="deprecation"
X-API-Deprecation-Info: This API version will be removed on 2027-01-01. Please migrate to v2.
```

### Phase 3: Migration Support (Day 90)

1. **Dedicated Support**
   - Migration office hours
   - Priority support tickets for migration issues
   - SDK migration tools released

2. **Usage Monitoring**
   - Track deprecated endpoint usage
   - Contact high-volume users directly
   - Provide usage reports to clients

### Phase 4: Final Warning (Day 150)

1. **Increased Communication**
   - Weekly email reminders
   - Dashboard banners
   - Direct outreach to remaining users

2. **Rate Limiting**
   - Consider reducing rate limits on deprecated version
   - Encourage migration through soft restrictions

### Phase 5: Sunset (Day 180)

1. **Version Removal**
   - Deprecated version returns 410 Gone
   - Error message includes migration instructions

```json
{
  "error": {
    "code": "API_VERSION_SUNSET",
    "message": "API v1 has been sunset as of 2027-01-01",
    "migration_url": "https://docs.thetheunifiedhealth.com/api/migration/v1-to-v2",
    "current_version": "v2"
  }
}
```

---

## Breaking vs Non-Breaking Changes

### Non-Breaking Changes (No Version Bump)

These changes can be made to any supported version:

- ✅ Adding new endpoints
- ✅ Adding new optional request parameters
- ✅ Adding new response fields
- ✅ Adding new enum values (with default handling)
- ✅ Increasing rate limits
- ✅ Bug fixes that don't change behavior
- ✅ Performance improvements
- ✅ Adding new error codes (with proper HTTP status)

### Breaking Changes (Require New Version)

These changes require a new major version:

- ❌ Removing endpoints
- ❌ Removing request/response fields
- ❌ Changing field types
- ❌ Changing field names
- ❌ Changing URL structure
- ❌ Changing authentication method
- ❌ Changing error response format
- ❌ Reducing rate limits
- ❌ Changing pagination format
- ❌ Removing enum values

---

## Migration Guide Template

### v1 to v2 Migration Guide

#### Summary of Changes

| Change Type        | Count |
| ------------------ | ----- |
| Removed Endpoints  | 3     |
| Modified Endpoints | 8     |
| New Endpoints      | 15    |
| Schema Changes     | 12    |

#### Endpoint Changes

##### Removed Endpoints

| v1 Endpoint                  | Replacement                        | Notes          |
| ---------------------------- | ---------------------------------- | -------------- |
| `GET /v1/legacy/search`      | `GET /v2/search`                   | Unified search |
| `POST /v1/appointments/bulk` | `POST /v2/appointments` with array | Simplified     |

##### Modified Endpoints

| v1 Endpoint             | v2 Endpoint             | Changes                      |
| ----------------------- | ----------------------- | ---------------------------- |
| `GET /v1/patients/{id}` | `GET /v2/patients/{id}` | Response includes `metadata` |
| `POST /v1/appointments` | `POST /v2/appointments` | `date` → `scheduledAt`       |

#### Request/Response Changes

**Appointment Creation**

v1 Request:

```json
{
  "patient_id": "123",
  "provider_id": "456",
  "date": "2026-01-15",
  "time": "14:00",
  "type": "checkup"
}
```

v2 Request:

```json
{
  "patientId": "123",
  "providerId": "456",
  "scheduledAt": "2026-01-15T14:00:00Z",
  "type": "checkup",
  "duration": 30
}
```

#### SDK Updates

**JavaScript SDK**

```bash
# Update SDK
npm install @unified-health/sdk@2.0.0

# Update imports
- import { Client } from '@unified-health/sdk/v1';
+ import { Client } from '@unified-health/sdk';

# Update API calls
- client.appointments.create({ date: '2026-01-15', time: '14:00' })
+ client.appointments.create({ scheduledAt: '2026-01-15T14:00:00Z' })
```

#### Testing Migration

1. **Parallel Testing**

   ```bash
   # Run tests against both versions
   API_VERSION=v1 npm test
   API_VERSION=v2 npm test
   ```

2. **Shadow Traffic**
   - Enable shadow mode to send requests to both versions
   - Compare responses for discrepancies

3. **Gradual Rollout**
   - Migrate read endpoints first
   - Then migrate write endpoints
   - Monitor error rates throughout

---

## Client Notification Templates

### Initial Deprecation Email

```
Subject: [Action Required] Unified Health API v1 Deprecation Notice

Dear Developer,

We are writing to inform you that Unified Health API v1 will be deprecated
on July 1, 2026, and sunset on January 1, 2027.

Key Dates:
- July 1, 2026: v1 officially deprecated (warning headers added)
- January 1, 2027: v1 removed from service

What You Need to Do:
1. Review the migration guide: [link]
2. Update your integration to use API v2
3. Test your integration thoroughly
4. Complete migration before December 15, 2026

Resources:
- Migration Guide: https://docs.thetheunifiedhealth.com/api/migration/v1-to-v2
- API v2 Reference: https://docs.thetheunifiedhealth.com/api/v2
- SDK Updates: https://docs.thetheunifiedhealth.com/sdk/upgrade

Need Help?
- Migration support: migration-support@thetheunifiedhealth.com
- Office hours: Every Tuesday 2-3 PM EST

Thank you for using Unified Health.
```

### Final Warning Email

```
Subject: [URGENT] Unified Health API v1 Sunset in 30 Days

Dear Developer,

This is a final reminder that Unified Health API v1 will be permanently
removed on January 1, 2027 - just 30 days from now.

Your Current Status:
- API v1 calls in last 30 days: [count]
- Endpoints used: [list]

Our records show you are still using API v1. Please complete your migration
immediately to avoid service disruption.

If you have already migrated, please verify no legacy integrations remain.

Emergency Support:
- Priority ticket: https://support.thetheunifiedhealth.com/migration
- Phone: 1-800-XXX-XXXX (mention "API migration")

Thank you for your prompt attention.
```

---

## Internal Procedures

### Before Deprecating

- [ ] New version fully implemented and tested
- [ ] Migration guide completed
- [ ] SDK updates released
- [ ] Documentation updated
- [ ] Communication plan approved
- [ ] Support team briefed
- [ ] Monitoring dashboards updated

### During Deprecation Period

- [ ] Weekly usage monitoring
- [ ] Contact top 10 users by volume
- [ ] Track migration progress
- [ ] Address migration issues promptly
- [ ] Update status page

### At Sunset

- [ ] Verify remaining usage is minimal
- [ ] Send final notification
- [ ] Update routing to return 410
- [ ] Archive deprecated code
- [ ] Update documentation
- [ ] Close deprecation project

---

## Exception Policy

### Requesting an Extension

Clients may request a deprecation extension under these circumstances:

1. **Critical dependency** - Integration is mission-critical
2. **Resource constraints** - Documented migration blockers
3. **Large migration scope** - Enterprise integrations

**Process:**

1. Submit request via support ticket
2. Include: business justification, migration plan, requested timeline
3. Review by API team within 5 business days
4. Extensions granted for max 90 additional days

---

## Version History

| Version | Changes        | Date       |
| ------- | -------------- | ---------- |
| 1.0     | Initial policy | 2026-01-05 |

---

## Contacts

- **API Team:** api-team@thetheunifiedhealth.com
- **Migration Support:** migration-support@thetheunifiedhealth.com
- **Documentation:** docs@thetheunifiedhealth.com
