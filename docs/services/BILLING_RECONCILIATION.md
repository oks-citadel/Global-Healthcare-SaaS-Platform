# Billing Reconciliation Service

## Overview

The Billing Reconciliation Service ensures consistency between Stripe payments and internal database records. It runs daily reconciliation jobs to detect and report discrepancies between the payment processor and the platform's internal payment records.

**Service Location:** `services/api/src/services/billing-reconciliation.service.ts`

---

## Table of Contents

- [Purpose](#purpose)
- [Configuration](#configuration)
- [Usage](#usage)
- [Reconciliation Process](#reconciliation-process)
- [Alerting](#alerting)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

---

## Purpose

The service addresses the following critical business needs:

1. **Financial Accuracy** - Ensure all Stripe payments are correctly recorded in the database
2. **Audit Compliance** - Maintain accurate financial records for HIPAA and SOC 2 compliance
3. **Revenue Integrity** - Detect missing payments, refunds, or amount mismatches
4. **Operational Visibility** - Provide daily reports on billing system health

---

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe API secret key | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `RECONCILIATION_TOLERANCE` | Discrepancy tolerance percentage | No | `0.01` (1%) |
| `SLACK_BILLING_WEBHOOK` | Slack webhook for billing alerts | No | - |
| `PAGERDUTY_ROUTING_KEY` | PagerDuty routing key for critical alerts | No | - |

### Reconciliation Config Options

```typescript
interface ReconciliationConfig {
  startDate: Date;              // Start of reconciliation period
  endDate: Date;                // End of reconciliation period
  tolerancePercentage?: number; // Acceptable discrepancy (default: 0.01 = 1%)
  includeRefunds?: boolean;     // Include refunds in reconciliation (default: true)
  autoFix?: boolean;            // Auto-sync missing payments (default: false)
}
```

### Alert Thresholds

| Threshold | Severity | Action |
|-----------|----------|--------|
| <= 1% discrepancy | Success | No alert |
| 1-5% discrepancy | Warning | Slack notification, schedule review within 24 hours |
| > 5% discrepancy | Critical | PagerDuty alert, immediate investigation required |

---

## Usage

### Daily Automated Reconciliation

The service is designed to run as a daily cron job. Add the following to your job scheduler:

```bash
# Run at 2 AM UTC daily
0 2 * * * node scripts/run-billing-reconciliation.js
```

**Example scheduler script:**

```typescript
import { BillingReconciliationService } from './services/billing-reconciliation.service';
import Stripe from 'stripe';
import { PrismaClient } from './generated/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

const reconciliationService = new BillingReconciliationService(stripe, prisma);

// Run daily reconciliation
async function main() {
  const result = await reconciliationService.runDailyReconciliation();
  console.log('Reconciliation completed:', result.status);
  process.exit(result.status === 'success' ? 0 : 1);
}

main().catch(console.error);
```

### Manual Reconciliation

For custom date ranges or ad-hoc reconciliation:

```typescript
const result = await reconciliationService.reconcile({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  includeRefunds: true,
  tolerancePercentage: 0.005, // 0.5% tolerance
});
```

### Syncing Missing Payments

When reconciliation finds payments in Stripe that are missing from the database:

```typescript
const { synced, failed } = await reconciliationService.syncMissingPayments([
  'pi_1234567890',
  'pi_0987654321',
]);

console.log(`Synced: ${synced}, Failed: ${failed.length}`);
```

---

## Reconciliation Process

### Step 1: Data Collection

1. Fetch all successful PaymentIntents from Stripe for the date range
2. Fetch all successful refunds from Stripe (if `includeRefunds` is true)
3. Query the local `Payment` and `Refund` tables for the same period

### Step 2: Comparison

The service performs three types of comparisons:

| Check | Description |
|-------|-------------|
| **Missing in Database** | Stripe payments without corresponding database records |
| **Missing in Stripe** | Database records without Stripe payment IDs (potential test data or manual entries) |
| **Amount Mismatches** | Payments where Stripe amount differs from database amount |

### Step 3: Totals Calculation

```
Stripe Total = Sum(Stripe Payments) - Sum(Stripe Refunds)
Database Total = Sum(DB Payments) - Sum(DB Refunds)
Discrepancy = |Stripe Total - Database Total|
Discrepancy % = (Discrepancy / Stripe Total) * 100
```

### Step 4: Reporting

Results are:
1. Stored in the `ReconciliationReport` table
2. Logged to the application logs
3. Sent via alerts if discrepancies exceed thresholds

---

## Alerting

### Slack Integration

Configure the `SLACK_BILLING_WEBHOOK` environment variable to enable Slack notifications.

**Alert Message Format:**

```
:warning: Billing Reconciliation Alert

Date: 2025-01-15
Status: discrepancy_found
Discrepancy: $1,234.56 (2.3%)

Missing in Database: 5 payments
Amount Mismatches: 2 payments

Recommendations:
- 5 Stripe payments not found in database. Run webhook sync.
- Discrepancy between 1-5%. Schedule review within 24 hours.
```

### PagerDuty Integration

For critical alerts (>5% discrepancy), configure `PAGERDUTY_ROUTING_KEY`:

```typescript
// Critical alert triggers
if (discrepancyPercentage > 5) {
  // Triggers PagerDuty incident
  // Recommended: Pause automated billing until resolved
}
```

### Custom Alert Integration

To add custom alerting (email, Teams, etc.), modify the `sendDiscrepancyAlert` method:

```typescript
private async sendDiscrepancyAlert(result: ReconciliationResult): Promise<void> {
  // Existing logging
  logger.warn('Billing discrepancy detected', { ... });

  // Add custom integrations here
  await this.slackService.send({ ... });
  await this.pagerDutyService.createIncident({ ... });
  await this.emailService.sendToFinanceTeam({ ... });
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Missing in Database" Payments

**Cause:** Stripe webhooks failed to process or were missed.

**Resolution:**
1. Check webhook logs in Stripe Dashboard
2. Run `syncMissingPayments()` for the affected payment IDs
3. Investigate webhook endpoint reliability

```typescript
// Sync specific payments
await reconciliationService.syncMissingPayments(result.missingInDatabase);
```

#### 2. "Missing in Stripe" Records

**Cause:** Usually test data, manual entries, or payments from a different Stripe account.

**Resolution:**
1. Review records to determine if they are test data
2. If legitimate, investigate payment processor routing
3. Consider marking as "manual" payments with null Stripe IDs

#### 3. Amount Mismatches

**Cause:** Currency conversion issues, partial refunds, or data entry errors.

**Resolution:**
1. Check for currency conversion in multi-currency transactions
2. Verify partial refund handling
3. Review any manual payment adjustments

#### 4. High Discrepancy Rate

**Cause:** Systematic issue with webhook processing or database sync.

**Resolution:**
1. Check API Gateway logs for webhook failures
2. Verify Stripe webhook secret is correct
3. Review database connection stability
4. Check for recent deployments that may have affected the billing flow

### Diagnostic Queries

**Find orphaned payments:**

```sql
SELECT * FROM "Payment"
WHERE "stripePaymentIntentId" IS NULL
AND "status" = 'succeeded'
AND "createdAt" > NOW() - INTERVAL '7 days';
```

**Check webhook processing:**

```sql
SELECT
  DATE("createdAt") as date,
  COUNT(*) as total_webhooks,
  SUM(CASE WHEN "status" = 'processed' THEN 1 ELSE 0 END) as processed,
  SUM(CASE WHEN "status" = 'failed' THEN 1 ELSE 0 END) as failed
FROM "WebhookEventLog"
WHERE "source" = 'stripe'
GROUP BY DATE("createdAt")
ORDER BY date DESC
LIMIT 7;
```

---

## API Reference

### BillingReconciliationService

#### Constructor

```typescript
constructor(stripe: Stripe, prisma: PrismaClient)
```

#### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `reconcile(config)` | Run reconciliation for a date range | `Promise<ReconciliationResult>` |
| `runDailyReconciliation()` | Run reconciliation for the previous day | `Promise<ReconciliationResult>` |
| `syncMissingPayments(ids)` | Sync missing payments from Stripe | `Promise<{synced, failed}>` |

### ReconciliationResult

```typescript
interface ReconciliationResult {
  date: string;                    // ISO timestamp of reconciliation run
  stripeTotal: number;             // Total from Stripe (in dollars)
  databaseTotal: number;           // Total from database (in dollars)
  discrepancy: number;             // Absolute difference (in dollars)
  discrepancyPercentage: number;   // Percentage of discrepancy
  missingInDatabase: string[];     // Stripe payment IDs not in DB
  missingInStripe: string[];       // DB payment IDs not in Stripe
  amountMismatches: Array<{        // Payments with different amounts
    paymentId: string;
    stripeAmount: number;
    databaseAmount: number;
    difference: number;
  }>;
  status: 'success' | 'discrepancy_found' | 'error';
  recommendations: string[];        // Suggested actions
}
```

---

## Database Schema

### ReconciliationReport Table

```prisma
model ReconciliationReport {
  id                    String   @id @default(uuid())
  date                  DateTime
  stripeTotal           Decimal
  databaseTotal         Decimal
  discrepancy           Decimal
  discrepancyPercentage Float
  status                String
  details               Json
  createdAt             DateTime @default(now())
}
```

---

## Best Practices

1. **Run Daily:** Schedule reconciliation to run every day, even on weekends
2. **Review Weekly:** Finance team should review weekly summary reports
3. **Investigate Quickly:** Address discrepancies within 24 hours for amounts >$1000
4. **Monitor Trends:** Track discrepancy percentages over time to identify patterns
5. **Test Webhooks:** Regularly verify Stripe webhook delivery

---

## Related Documentation

- [Stripe Integration Guide](../../STRIPE_INTEGRATION.md)
- [API Error Codes](../api/ERROR_CODES.md)
- [Audit Logging Documentation](../compliance/AUDIT-LOGGING-DOCUMENTATION.md)

---

**Last Updated:** January 2025
**Maintained By:** Platform Engineering Team
