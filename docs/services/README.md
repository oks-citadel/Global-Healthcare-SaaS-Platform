# Services Documentation

## Overview

This directory contains documentation for internal platform services that are not exposed as public APIs but provide critical infrastructure functionality.

---

## Available Service Documentation

| Service | Description | Status |
|---------|-------------|--------|
| [Billing Reconciliation](./BILLING_RECONCILIATION.md) | Stripe payment reconciliation with internal database | Active |
| [Impersonation](./IMPERSONATION.md) | Admin user impersonation for support | Disabled (requires security review) |

---

## Service Categories

### Financial Services

- **Billing Reconciliation** - Ensures consistency between Stripe and internal payment records
- Daily automated reconciliation with configurable alerting

### Administrative Services

- **Impersonation** - Allows authorized support staff to access user accounts
- Requires explicit enablement and security review

---

## Adding New Service Documentation

When documenting a new internal service:

1. Create a new Markdown file: `SERVICE_NAME.md`
2. Use the following template structure:
   - Overview
   - Configuration
   - Usage
   - Troubleshooting
   - API Reference (if applicable)

3. Update this README to include the new service

4. Link from relevant documentation:
   - `docs/README.md` for main navigation
   - Related compliance/security docs as needed

---

## Related Documentation

- [API Documentation](../api/README.md)
- [Architecture Documentation](../architecture/README.md)
- [Operations Documentation](../operations/README.md)
- [User Guides](../user-guides/README.md)

---

**Last Updated:** January 2025
