# Synthetic Monitoring

This directory contains configuration for external synthetic monitoring probes to detect issues before customers do.

## Overview

Synthetic monitoring performs automated tests from external locations to verify:

- API availability and response times
- Web application accessibility
- SSL certificate validity
- DNS resolution
- User journey completion
- Performance baselines

## Components

### 1. Health Probes

Basic HTTP health checks that run every 30 seconds:

| Probe        | Endpoint              | Threshold |
| ------------ | --------------------- | --------- |
| API Health   | `/health`             | 500ms     |
| API Ready    | `/ready`              | 1000ms    |
| Web App      | `/`                   | 2000ms    |
| Auth Service | `/api/v1/auth/health` | 300ms     |
| Database     | `/health/db`          | 500ms     |
| Cache        | `/health/cache`       | 500ms     |

### 2. SSL Certificate Monitoring

Monitors SSL certificates for expiration:

- Warning: 30 days before expiry
- Critical: 7 days before expiry

### 3. DNS Monitoring

Verifies DNS records every 5 minutes:

- A records
- AAAA records
- CNAME records

### 4. Synthetic Transactions

Browser-based user journey tests every 5 minutes:

- Login flow
- Provider search flow
- Appointment booking flow (planned)

## Deployment

```bash
# Deploy synthetic monitoring
kubectl apply -f synthetic-monitoring.yaml

# Verify deployment
kubectl get cronjobs -n monitoring
kubectl get prometheusrules -n monitoring
```

## Alert Routing

| Severity | Destination            | Response Time     |
| -------- | ---------------------- | ----------------- |
| Critical | PagerDuty (P1)         | 15 minutes        |
| High     | PagerDuty (P2)         | 1 hour            |
| Warning  | Slack #platform-alerts | 4 hours           |
| Info     | Slack #platform-alerts | Next business day |

## Runbooks

When an alert fires, follow the corresponding runbook:

- [API Health Failure](../../runbooks/api-health-failure.md)
- [Web Health Failure](../../runbooks/web-health-failure.md)
- [Database Failure](../../runbooks/database-failure.md)
- [SSL Certificate Expiry](../../runbooks/ssl-certificate-expiry.md)

## Adding New Probes

1. Add probe configuration to `synthetic-monitoring.yaml`
2. Add corresponding alert rule in PrometheusRule
3. Create runbook for the new probe
4. Test in staging before production

## Metrics

Synthetic monitoring exposes these Prometheus metrics:

- `probe_success` - 1 if probe succeeded, 0 if failed
- `probe_duration_seconds` - Duration of probe
- `probe_ssl_earliest_cert_expiry` - Unix timestamp of certificate expiry
- `synthetic_test_success` - 1 if synthetic test passed
- `synthetic_test_duration_seconds` - Duration of synthetic test

## Dashboard

View synthetic monitoring results in Grafana:

- Dashboard: "Synthetic Monitoring Overview"
- URL: https://grafana.thetheunifiedhealth.com/d/synthetic-monitoring

## Testing

Run synthetic tests manually:

```bash
# Test API health
curl -s https://api.thetheunifiedhealth.com/health | jq .

# Test with timing
curl -w "\nTotal time: %{time_total}s\n" https://api.thetheunifiedhealth.com/health

# Test SSL certificate
openssl s_client -connect api.thetheunifiedhealth.com:443 2>/dev/null | openssl x509 -noout -dates
```

## External Monitoring Services

For additional coverage, consider integrating with:

- **Pingdom** - External uptime monitoring
- **StatusPage.io** - Public status page
- **Better Uptime** - Incident communication
- **Checkly** - Browser-based monitoring

## Maintenance

- Review probe configurations monthly
- Update thresholds based on actual performance
- Test alerting paths quarterly
- Update runbooks when procedures change
