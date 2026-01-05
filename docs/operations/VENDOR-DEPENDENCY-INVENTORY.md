# Vendor Dependency Inventory

**Last Updated:** January 5, 2026
**Version:** 1.0
**Owner:** Platform Engineering

## Overview

This document provides a comprehensive inventory of all third-party vendor dependencies for the Unified Health platform. It includes SLA information, contacts, fallback strategies, and risk assessments.

---

## Critical Vendors (Tier 1)

These vendors are essential for core platform operations. Outages directly impact user experience.

### 1. Amazon Web Services (AWS)

| Attribute          | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Service**        | Cloud Infrastructure                                                               |
| **Components**     | EKS, Aurora PostgreSQL, ElastiCache, S3, Route53, CloudFront, ACM, Secrets Manager |
| **SLA**            | 99.99% (Aurora), 99.95% (EKS), 99.9% (S3)                                          |
| **BAA Signed**     | Yes                                                                                |
| **Contract Type**  | Enterprise Support                                                                 |
| **Monthly Cost**   | ~$15,000-25,000 (variable)                                                         |
| **Support Portal** | https://console.aws.amazon.com/support                                             |
| **Status Page**    | https://status.aws.amazon.com                                                      |

**Primary Contact:**

- AWS Enterprise Support: 1-800-xxx-xxxx
- TAM: [Assigned Technical Account Manager]
- Account ID: 992382449461

**Fallback Strategy:**

- Multi-region deployment (us-east-1 primary, us-west-2 DR)
- Cross-region Aurora read replicas
- S3 cross-region replication enabled
- Route53 health checks with automatic failover

**Risk Assessment:** LOW (multi-region architecture mitigates single-region failures)

---

### 2. Stripe

| Attribute        | Value                                               |
| ---------------- | --------------------------------------------------- |
| **Service**      | Payment Processing                                  |
| **Components**   | Payments, Subscriptions, Invoicing, Customer Portal |
| **SLA**          | 99.99% API availability                             |
| **BAA Signed**   | Yes                                                 |
| **PCI DSS**      | Level 1 Service Provider                            |
| **Monthly Cost** | 2.9% + $0.30 per transaction                        |
| **API Version**  | 2023-10-16                                          |
| **Dashboard**    | https://dashboard.stripe.com                        |
| **Status Page**  | https://status.stripe.com                           |

**Primary Contact:**

- Stripe Support: support@stripe.com
- Account Manager: [Assigned Rep]
- Account ID: acct_xxxxxxxxxxxxx

**Fallback Strategy:**

- Secondary processor: Adyen (integration ready, dormant)
- Manual payment processing procedures documented
- Offline payment capture for critical appointments

**Risk Assessment:** MEDIUM (single payment processor, backup available but not active)

**Action Items:**

- [ ] Activate Adyen integration for failover
- [ ] Test payment processor switch quarterly

---

### 3. Twilio

| Attribute           | Value                                            |
| ------------------- | ------------------------------------------------ |
| **Service**         | SMS & Voice Communications                       |
| **Components**      | SMS, MFA OTP, Appointment reminders, Voice calls |
| **SLA**             | 99.95% API availability                          |
| **BAA Signed**      | Yes                                              |
| **HIPAA Compliant** | Yes (with BAA)                                   |
| **Monthly Cost**    | ~$500-1,500 (usage-based)                        |
| **Dashboard**       | https://console.twilio.com                       |
| **Status Page**     | https://status.twilio.com                        |

**Primary Contact:**

- Twilio Support: https://support.twilio.com
- Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

**Fallback Strategy:**

- Backup provider: AWS SNS (configured)
- Email fallback for non-critical notifications
- In-app notification system as secondary channel

**Risk Assessment:** LOW (backup providers configured)

---

### 4. SendGrid

| Attribute        | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Service**      | Email Delivery                                                   |
| **Components**   | Transactional emails, Appointment confirmations, Password resets |
| **SLA**          | 99.95% API availability                                          |
| **BAA Signed**   | Yes                                                              |
| **Monthly Cost** | ~$200-500 (usage-based)                                          |
| **Dashboard**    | https://app.sendgrid.com                                         |
| **Status Page**  | https://status.sendgrid.com                                      |

**Primary Contact:**

- SendGrid Support: support@sendgrid.com
- API Key: SG.xxxxxxxxxx

**Fallback Strategy:**

- Backup provider: AWS SES (configured)
- SPF/DKIM/DMARC configured for both providers
- Queue-based retry with exponential backoff

**Risk Assessment:** LOW (backup provider configured)

**Email Deliverability Configuration:**

- SPF Record: `v=spf1 include:sendgrid.net include:amazonses.com ~all`
- DKIM: Configured for theunifiedhealth.com
- DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@theunifiedhealth.com`

---

## Important Vendors (Tier 2)

These vendors support important but non-critical functions.

### 5. Auth0 (Okta)

| Attribute         | Value                             |
| ----------------- | --------------------------------- |
| **Service**       | Identity & SSO (Enterprise)       |
| **Components**    | Enterprise SSO, Social login, MFA |
| **SLA**           | 99.99%                            |
| **BAA Signed**    | Yes                               |
| **SOC 2 Type II** | Yes                               |
| **Monthly Cost**  | ~$500 (Enterprise tier)           |
| **Dashboard**     | https://manage.auth0.com          |
| **Status Page**   | https://status.auth0.com          |

**Primary Contact:**

- Auth0 Support: support@auth0.com
- Tenant: unified-health.auth0.com

**Fallback Strategy:**

- Local authentication always available
- JWT tokens cached for short-term outages
- Manual account recovery procedures

**Risk Assessment:** LOW (local auth available)

---

### 6. Daily.co

| Attribute           | Value                                             |
| ------------------- | ------------------------------------------------- |
| **Service**         | Video Conferencing                                |
| **Components**      | Telehealth video calls, Screen sharing, Recording |
| **SLA**             | 99.9%                                             |
| **BAA Signed**      | Yes                                               |
| **HIPAA Compliant** | Yes                                               |
| **Monthly Cost**    | ~$300-800 (usage-based)                           |
| **Dashboard**       | https://dashboard.daily.co                        |
| **Status Page**     | https://status.daily.co                           |

**Primary Contact:**

- Daily.co Support: support@daily.co
- API Key: xxxxxxxxxxxxxxxxxxxxxxxx

**Fallback Strategy:**

- Backup provider: Twilio Video (integration available)
- Phone-based consultation as last resort
- Reschedule functionality

**Risk Assessment:** MEDIUM (telehealth is core feature)

---

### 7. Datadog

| Attribute        | Value                        |
| ---------------- | ---------------------------- |
| **Service**      | Observability & Monitoring   |
| **Components**   | APM, Logs, Metrics, Alerting |
| **SLA**          | 99.9%                        |
| **Monthly Cost** | ~$800-1,500                  |
| **Dashboard**    | https://app.datadoghq.com    |
| **Status Page**  | https://status.datadoghq.com |

**Primary Contact:**

- Datadog Support: support@datadoghq.com
- Org ID: unified-health

**Fallback Strategy:**

- Prometheus/Grafana self-hosted (deployed)
- CloudWatch as AWS-native backup
- ELK stack for logs

**Risk Assessment:** LOW (self-hosted backup available)

---

### 8. PagerDuty

| Attribute        | Value                                                |
| ---------------- | ---------------------------------------------------- |
| **Service**      | Incident Management                                  |
| **Components**   | On-call scheduling, Alert routing, Incident response |
| **SLA**          | 99.9%                                                |
| **Monthly Cost** | ~$200-400                                            |
| **Dashboard**    | https://unified-health.pagerduty.com                 |
| **Status Page**  | https://status.pagerduty.com                         |

**Primary Contact:**

- PagerDuty Support: support@pagerduty.com

**Fallback Strategy:**

- Slack alerting as secondary channel
- Email escalation chain
- Phone tree for critical incidents

**Risk Assessment:** LOW (multiple backup channels)

---

## Supporting Vendors (Tier 3)

### 9. Sentry

| Attribute        | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Service**      | Error Tracking                                           |
| **Components**   | Error monitoring, Performance monitoring, Session replay |
| **SLA**          | 99.9%                                                    |
| **Monthly Cost** | ~$100-300                                                |
| **Dashboard**    | https://sentry.io                                        |

**Fallback:** CloudWatch Logs, custom error tracking

---

### 10. LaunchDarkly

| Attribute        | Value                        |
| ---------------- | ---------------------------- |
| **Service**      | Feature Flags (External)     |
| **Components**   | Feature toggles, A/B testing |
| **SLA**          | 99.99%                       |
| **Monthly Cost** | ~$200-500                    |

**Note:** Internal feature flag system (`@unified-health/feature-flags`) is primary. LaunchDarkly is optional enterprise add-on.

---

### 11. GitHub

| Attribute        | Value                          |
| ---------------- | ------------------------------ |
| **Service**      | Source Control & CI/CD         |
| **Components**   | Git hosting, Actions, Packages |
| **SLA**          | 99.9%                          |
| **Monthly Cost** | ~$200 (Team plan)              |
| **Status Page**  | https://www.githubstatus.com   |

**Fallback:** Local Git mirrors, AWS CodeCommit

---

### 12. npm Registry

| Attribute        | Value                    |
| ---------------- | ------------------------ |
| **Service**      | Package Registry         |
| **SLA**          | 99.9%                    |
| **Monthly Cost** | Free (public packages)   |
| **Status Page**  | https://status.npmjs.org |

**Fallback:** Verdaccio private registry, cached node_modules

---

## Vendor Risk Matrix

| Vendor    | Impact   | Likelihood | Risk Score | Mitigation Status         |
| --------- | -------- | ---------- | ---------- | ------------------------- |
| AWS       | Critical | Very Low   | LOW        | Multi-region ✅           |
| Stripe    | Critical | Low        | MEDIUM     | Backup processor ready ⚠️ |
| Twilio    | High     | Low        | LOW        | AWS SNS backup ✅         |
| SendGrid  | High     | Low        | LOW        | AWS SES backup ✅         |
| Auth0     | Medium   | Very Low   | LOW        | Local auth ✅             |
| Daily.co  | High     | Low        | MEDIUM     | Twilio Video backup ⚠️    |
| Datadog   | Medium   | Low        | LOW        | Self-hosted backup ✅     |
| PagerDuty | Medium   | Very Low   | LOW        | Multi-channel ✅          |
| Sentry    | Low      | Low        | LOW        | CloudWatch backup ✅      |
| GitHub    | Medium   | Very Low   | LOW        | CodeCommit backup ✅      |

---

## Emergency Contacts

### Escalation Path

1. **Level 1:** On-call engineer via PagerDuty
2. **Level 2:** Engineering Manager
3. **Level 3:** VP Engineering
4. **Level 4:** CTO

### Vendor Emergency Contacts

| Vendor    | Emergency Contact          | Response Time |
| --------- | -------------------------- | ------------- |
| AWS       | Enterprise Support Hotline | 15 minutes    |
| Stripe    | support@stripe.com         | 4 hours       |
| Twilio    | Emergency ticket           | 2 hours       |
| Daily.co  | support@daily.co           | 4 hours       |
| PagerDuty | Status webhook             | Automatic     |

---

## Vendor Review Schedule

| Review Type         | Frequency | Next Review  |
| ------------------- | --------- | ------------ |
| SLA Compliance      | Monthly   | Feb 1, 2026  |
| Security Assessment | Quarterly | Mar 15, 2026 |
| Cost Optimization   | Quarterly | Mar 15, 2026 |
| Contract Renewal    | Annual    | Dec 1, 2026  |
| BAA Verification    | Annual    | Dec 1, 2026  |

---

## Action Items

### Immediate (P0)

- [x] Document all vendor dependencies
- [ ] Test Stripe → Adyen failover
- [ ] Verify all BAAs are current

### Short-term (P1)

- [ ] Implement vendor health dashboard
- [ ] Create automated SLA monitoring
- [ ] Document vendor switch procedures

### Medium-term (P2)

- [ ] Negotiate multi-year contracts
- [ ] Implement cost allocation tagging
- [ ] Create vendor scorecards

---

## Change Log

| Date       | Version | Change           | Author               |
| ---------- | ------- | ---------------- | -------------------- |
| 2026-01-05 | 1.0     | Initial creation | Platform Engineering |
