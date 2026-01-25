# Platform Migration: GoDaddy + Vercel + Railway

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **Status:** Production Ready
> **Owner:** Platform/SRE Team

## Overview

This documentation covers the production-grade deployment of a SaaS platform using:

| Component | Provider | Purpose |
|-----------|----------|---------|
| **DNS** | GoDaddy | Domain registration and DNS management |
| **Frontend** | Vercel | Static hosting, edge functions, CDN |
| **Backend** | Railway | API services, databases, Redis, workers |
| **Source Control** | GitHub | Code repository, CI/CD quality gates |

## Documentation Index

| Document | Description |
|----------|-------------|
| [architecture.md](./architecture.md) | System architecture, dependency mapping, current vs target state |
| [dns-cutover.md](./dns-cutover.md) | GoDaddy DNS records, TTL strategy, cutover procedures |
| [deployments.md](./deployments.md) | Vercel and Railway configuration, environment setup |
| [rollback.md](./rollback.md) | Emergency rollback procedures for all components |
| [observability.md](./observability.md) | Monitoring, logging, alerting, incident response |
| [security-baseline.md](./security-baseline.md) | Security controls, TLS, rate limiting, secrets |
| [env-vars-inventory.md](./env-vars-inventory.md) | Complete environment variable reference |

## Quick Reference

### Domain Architecture

```
yourdomain.com              → Vercel (marketing/landing)
app.yourdomain.com          → Vercel (main web application)
admin.yourdomain.com        → Vercel (admin dashboard)
provider.yourdomain.com     → Vercel (provider portal)
api.yourdomain.com          → Railway (API gateway)
ws.yourdomain.com           → Railway (WebSocket/realtime)
staging.yourdomain.com      → Vercel (staging environment)
api-staging.yourdomain.com  → Railway (staging API)
```

### Deployment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│   Vercel    │────▶│  Frontend   │
│   (source)  │     │   (build)   │     │  (CDN edge) │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │            ┌─────────────┐     ┌─────────────┐
       └───────────▶│   Railway   │────▶│   Backend   │
                    │   (deploy)  │     │  (services) │
                    └─────────────┘     └─────────────┘
```

### Emergency Contacts

| Role | Contact | Escalation Time |
|------|---------|-----------------|
| Primary On-Call | PagerDuty rotation | Immediate |
| Platform Lead | #platform-alerts Slack | 5 minutes |
| Security Team | security@company.com | 15 minutes |

## Pre-Migration Checklist

- [ ] All environment variables documented and ready
- [ ] DNS TTLs lowered (300s) 48 hours before cutover
- [ ] Vercel project created and configured
- [ ] Railway project created with all services
- [ ] Database migration plan reviewed
- [ ] Rollback procedures tested
- [ ] Monitoring dashboards configured
- [ ] Team notified of maintenance window

## Assumptions

> **IMPORTANT:** The following assumptions are made throughout this documentation.
> Validate each assumption before proceeding with migration.

| Assumption | Validation Command | Status |
|------------|-------------------|--------|
| GoDaddy DNS is authoritative | `dig NS yourdomain.com` | Pending |
| No existing Cloudflare proxy | `dig +short yourdomain.com` (should not show CF IPs) | Pending |
| PostgreSQL version >= 15 | `psql --version` | Pending |
| Node.js version >= 22 | `node --version` | Pending |
| All services have health endpoints | `curl /health` on each service | Pending |

## Success Criteria

1. **Zero Downtime:** No service interruption during cutover
2. **Full Functionality:** All features operational post-migration
3. **Performance:** P95 latency within 10% of baseline
4. **Observability:** All dashboards and alerts functional
5. **Security:** All security controls active and verified
