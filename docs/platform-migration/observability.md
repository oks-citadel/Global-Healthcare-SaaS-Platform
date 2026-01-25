# Observability and Incident Response

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24

## Observability Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OBSERVABILITY STACK                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │    Vercel     │  │    Railway    │  │   External    │           │
│  │  (Frontend)   │  │   (Backend)   │  │  (Optional)   │           │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘           │
│          │                  │                  │                    │
│          ▼                  ▼                  ▼                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                     PLATFORM METRICS                          │ │
│  │  - Vercel Analytics (Web Vitals, Edge, Functions)            │ │
│  │  - Railway Metrics (CPU, Memory, Network, Disk)              │ │
│  └───────────────────────────────────────────────────────────────┘ │
│          │                  │                  │                    │
│          ▼                  ▼                  ▼                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                        LOGGING                                │ │
│  │  - Vercel Logs (Build, Runtime, Edge)                        │ │
│  │  - Railway Logs (Application, Deploy)                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│          │                  │                  │                    │
│          ▼                  ▼                  ▼                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                       ALERTING                                │ │
│  │  - Uptime Monitoring (UptimeRobot/BetterStack)               │ │
│  │  - Error Tracking (Sentry - Optional)                         │ │
│  │  - PagerDuty/Slack Integration                                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Vercel Observability (Frontend)

### Vercel Analytics

**Enable via Dashboard:**
1. Project Settings → Analytics
2. Enable "Web Analytics"
3. Enable "Speed Insights"

**Metrics Available:**
- **Web Vitals:** LCP, FID, CLS, TTFB, INP
- **Traffic:** Page views, unique visitors, top pages
- **Performance:** Load time distribution, slow pages
- **Edge:** Edge function invocations, duration

### Vercel Logs

**Access via Dashboard:**
- Project → Deployments → Select deployment → Logs
- Project → Functions → Select function → Logs

**Log Types:**
| Type | Description | Retention |
|------|-------------|-----------|
| Build Logs | Compilation output | 30 days |
| Runtime Logs | Serverless function output | 1 hour (Pro: 3 days) |
| Edge Logs | Edge function output | 1 hour (Pro: 3 days) |

**CLI Access:**
```bash
# Real-time logs
vercel logs --follow

# Logs from specific deployment
vercel logs <deployment-url>

# Filter by timestamp
vercel logs --since 2h
```

### Vercel Speed Insights

**Configuration:**
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Vercel Firewall & Security Logs

**Access via Dashboard:**
- Project → Security → Firewall
- View blocked requests, attack patterns

---

## Railway Observability (Backend)

### Railway Metrics

**Access via Dashboard:**
- Service → Metrics tab

**Available Metrics:**
| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| CPU Usage | Container CPU % | > 80% for 5 min |
| Memory Usage | Container RAM | > 85% of limit |
| Network In/Out | Bytes transferred | N/A (monitoring only) |
| Disk Usage | Persistent storage | > 80% |
| Request Count | HTTP requests/min | Baseline + 50% |
| Response Time | P50/P95/P99 latency | P95 > 2s |

### Railway Logs

**Access via Dashboard:**
- Service → Logs tab

**CLI Access:**
```bash
# Real-time logs
railway logs --follow

# Logs for specific service
railway logs --service api-gateway

# Historical logs
railway logs --since 2h
```

### Application-Level Logging

**Winston Logger Configuration:**
```typescript
// packages/observability/src/logging/index.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME,
    version: process.env.API_VERSION,
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export { logger };
```

**Structured Log Format:**
```json
{
  "level": "info",
  "message": "Request completed",
  "timestamp": "2026-01-24T12:00:00.000Z",
  "service": "api-gateway",
  "version": "1.0.0",
  "environment": "production",
  "requestId": "abc-123",
  "method": "GET",
  "path": "/api/v1/users",
  "statusCode": 200,
  "duration": 45
}
```

### Railway Health Checks

**Configure health checks:**
- Service → Settings → Health Check Path: `/health`
- Timeout: 30 seconds
- Interval: 30 seconds

**Health Endpoint Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-24T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": { "status": "healthy", "latency": 5 },
    "redis": { "status": "healthy", "latency": 1 },
    "memory": { "status": "healthy", "used": "256MB", "limit": "512MB" }
  }
}
```

---

## External Monitoring (Recommended)

### Uptime Monitoring

**Setup UptimeRobot or BetterStack:**

**Monitors to Create:**

| Monitor | URL | Check Interval | Alert After |
|---------|-----|----------------|-------------|
| Web App | `https://app.yourdomain.com` | 1 min | 2 failures |
| Admin Portal | `https://admin.yourdomain.com` | 5 min | 2 failures |
| API Health | `https://api.yourdomain.com/health` | 1 min | 2 failures |
| API Response | `https://api.yourdomain.com/api/v1/status` | 1 min | 2 failures |
| WebSocket | `wss://ws.yourdomain.com` | 5 min | 2 failures |

**Alert Configuration:**
```yaml
# UptimeRobot configuration example
monitors:
  - name: "Production - Web App"
    url: "https://app.yourdomain.com"
    type: https
    interval: 60
    alert_contacts:
      - pagerduty_integration
      - slack_channel

  - name: "Production - API Health"
    url: "https://api.yourdomain.com/health"
    type: https
    interval: 60
    expected_status: 200
    expected_body: '"status":"healthy"'
    alert_contacts:
      - pagerduty_integration
      - slack_channel
```

### Error Tracking (Optional - Sentry)

**Frontend Setup:**
```typescript
// app/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 0.1,
});
```

**Backend Setup:**
```typescript
// services/api/src/lib/sentry.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  release: process.env.API_VERSION,
});

// Express error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Alerting Configuration

### Alert Channels

| Channel | Purpose | Response Time |
|---------|---------|---------------|
| PagerDuty | Critical alerts (P1) | Immediate |
| Slack #incidents | All incidents | 5 minutes |
| Slack #alerts | Warning alerts | 15 minutes |
| Email | Summaries, non-urgent | 1 hour |

### PagerDuty Integration

**Setup:**
1. Create PagerDuty service for the application
2. Generate integration key
3. Configure in monitoring tools

**Escalation Policy:**
```yaml
Escalation Policy: Production Services
Steps:
  1. Level 1 (0 min): Primary On-Call
  2. Level 2 (15 min): Secondary On-Call
  3. Level 3 (30 min): Engineering Manager
  4. Level 4 (60 min): VP Engineering
```

### Slack Integration

**Channels:**
- `#prod-alerts` - Automated alerts
- `#incidents` - Active incidents
- `#platform` - Platform team discussions

**Webhook Configuration:**
```bash
# Environment variable
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...

# Alert format
{
  "channel": "#prod-alerts",
  "username": "Monitor Bot",
  "icon_emoji": ":warning:",
  "attachments": [{
    "color": "danger",
    "title": "API Health Check Failed",
    "text": "api.yourdomain.com/health returned 503",
    "fields": [
      { "title": "Environment", "value": "Production", "short": true },
      { "title": "Duration", "value": "5 minutes", "short": true }
    ]
  }]
}
```

### Alert Rules

**Critical (P1) - PagerDuty:**
| Condition | Threshold | Action |
|-----------|-----------|--------|
| Site Down | 2+ consecutive failures | Page immediately |
| API 5xx Rate | > 10% for 5 min | Page immediately |
| Auth Failures | > 20% for 5 min | Page immediately |
| Database Down | Any connection failure | Page immediately |

**Warning (P2) - Slack:**
| Condition | Threshold | Action |
|-----------|-----------|--------|
| API Latency | P95 > 2s for 10 min | Slack alert |
| Memory Usage | > 80% for 10 min | Slack alert |
| Error Rate | > 5% for 10 min | Slack alert |
| Cert Expiry | < 14 days | Slack alert |

---

## Dashboards

### Vercel Dashboard

**Key Views:**
1. **Overview** - Deployment status, recent builds
2. **Analytics** - Traffic, Web Vitals
3. **Logs** - Real-time and historical
4. **Functions** - Serverless metrics

### Railway Dashboard

**Key Views:**
1. **Project Overview** - All services status
2. **Service Metrics** - CPU, Memory, Network
3. **Logs** - Application logs
4. **Deployments** - History, rollback options

### Custom Status Page (Optional)

**BetterStack/Statuspage Setup:**
```yaml
Components:
  - name: Web Application
    description: Main user interface
    group: Frontend

  - name: Admin Portal
    description: Administrative dashboard
    group: Frontend

  - name: API
    description: Core API services
    group: Backend

  - name: Authentication
    description: Login and signup
    group: Backend

  - name: Database
    description: Data storage
    group: Infrastructure
```

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| P1 | Critical - Service down | 15 min | Complete outage, data breach |
| P2 | High - Major degradation | 1 hour | Partial outage, auth issues |
| P3 | Medium - Minor impact | 4 hours | Slow performance, minor bugs |
| P4 | Low - Minimal impact | 24 hours | Cosmetic issues, feature requests |

### Incident Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INCIDENT DETECTED                            │
│                    (Alert fires)                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: ACKNOWLEDGE (< 5 min)                                   │
│ - Acknowledge alert in PagerDuty                                │
│ - Join #incidents Slack channel                                 │
│ - Initial assessment                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: TRIAGE (< 15 min)                                       │
│ - Determine severity (P1/P2/P3/P4)                              │
│ - Identify affected systems                                     │
│ - Assign incident commander                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: INVESTIGATE                                             │
│ - Check dashboards and logs                                     │
│ - Identify root cause                                           │
│ - Document findings                                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: MITIGATE                                                │
│ - Execute fix or rollback                                       │
│ - Verify resolution                                             │
│ - Update stakeholders                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: RESOLVE                                                 │
│ - Confirm service restored                                      │
│ - Close alert/incident                                          │
│ - Schedule post-mortem (P1/P2)                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Incident Commander Checklist

```markdown
## Incident: [TITLE]
**Severity:** P[X]
**Started:** [TIME]
**Commander:** [NAME]

### Status Updates
- [ ] Initial assessment posted to #incidents
- [ ] Stakeholders notified (if P1/P2)
- [ ] Status page updated (if public-facing)

### Investigation
- [ ] Checked Vercel logs
- [ ] Checked Railway logs
- [ ] Checked error tracking (Sentry)
- [ ] Checked uptime monitors
- [ ] Identified root cause

### Mitigation
- [ ] Fix deployed OR rollback executed
- [ ] Service verified healthy
- [ ] Monitoring confirmed normal

### Resolution
- [ ] Alert closed
- [ ] #incidents updated
- [ ] Post-mortem scheduled (P1/P2)
- [ ] Timeline documented
```

### Communication Templates

**Initial Alert (Slack):**
```
🚨 *INCIDENT STARTED*

*Service:* [Service Name]
*Severity:* P[X]
*Status:* Investigating
*Impact:* [Brief description]

*Commander:* @[name]
*War Room:* #incidents

Updates will be posted every 15 minutes.
```

**Status Update:**
```
📊 *INCIDENT UPDATE*

*Service:* [Service Name]
*Status:* [Investigating/Mitigating/Resolved]
*Duration:* [X] minutes

*Current Actions:*
- [What's being done]

*Next Update:* [Time]
```

**Resolution:**
```
✅ *INCIDENT RESOLVED*

*Service:* [Service Name]
*Duration:* [X] minutes
*Impact:* [Number of users/requests affected]

*Root Cause:* [Brief description]
*Resolution:* [What fixed it]

Post-mortem scheduled for [Date].
```

---

## Runbook: Common Issues

### Issue: High API Latency

```bash
# 1. Check Railway metrics
railway logs --service api-gateway --since 15m | grep -i "slow\|timeout"

# 2. Check database performance
railway connect postgres
\x
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

# 3. Check Redis
railway connect redis
INFO memory
SLOWLOG GET 10

# 4. If issue persists, scale service
# Via Railway Dashboard: Service → Settings → Replicas
```

### Issue: Database Connection Errors

```bash
# 1. Check connection count
railway connect postgres
SELECT count(*) FROM pg_stat_activity;

# 2. Check for blocked queries
SELECT * FROM pg_stat_activity
WHERE state = 'active'
AND waiting = true;

# 3. Kill long-running queries if needed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE duration > interval '5 minutes';
```

### Issue: Memory Pressure

```bash
# 1. Check service memory
# Railway Dashboard: Service → Metrics

# 2. If at limit, restart service
railway restart --service api

# 3. If recurring, increase memory limit
# Railway Dashboard: Service → Settings → Resources
```

### Issue: SSL Certificate Error

```bash
# Vercel: Auto-renewed, check domain settings
# Project → Settings → Domains → Check certificate status

# Railway: Auto-renewed, check service domain
# Service → Settings → Custom Domain → Verify DNS

# If issues, remove and re-add domain
```

---

## Maintenance Windows

### Scheduled Maintenance

**Notification Template:**
```
📅 *SCHEDULED MAINTENANCE*

*Date:* [Date]
*Time:* [Start] - [End] UTC
*Services:* [List]
*Impact:* [Expected impact]

*What's Happening:*
[Brief description]

*User Action:*
[Any actions users should take]
```

### Maintenance Checklist

```markdown
## Pre-Maintenance
- [ ] Notify users 48 hours in advance
- [ ] Notify users 24 hours in advance
- [ ] Update status page
- [ ] Verify rollback plan

## During Maintenance
- [ ] Begin at scheduled time
- [ ] Execute changes
- [ ] Verify each step
- [ ] Post updates every 30 min

## Post-Maintenance
- [ ] Verify all services healthy
- [ ] Run smoke tests
- [ ] Update status page
- [ ] Send completion notice
```
