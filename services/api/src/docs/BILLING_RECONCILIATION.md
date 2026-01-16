# Billing Reconciliation Service Documentation

## Overview

The Billing Reconciliation Service ensures consistency between Stripe payments and internal database records. It runs daily (or on-demand) to detect and report discrepancies, helping maintain accurate financial records and quickly identify issues.

## Table of Contents

1. [Features](#features)
2. [Configuration](#configuration)
3. [Alert Integrations](#alert-integrations)
4. [Usage](#usage)
5. [Reconciliation Results](#reconciliation-results)
6. [Troubleshooting](#troubleshooting)

## Features

- **Daily Reconciliation**: Automatically compares Stripe transactions with database records
- **Discrepancy Detection**: Identifies missing payments, amount mismatches, and sync issues
- **Slack Alerts**: Sends notifications for any billing discrepancies
- **PagerDuty Integration**: Triggers critical incidents for severe discrepancies (>5%)
- **Automatic Recommendations**: Generates actionable recommendations based on findings
- **Missing Payment Sync**: Can automatically sync missing payments from Stripe

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Slack webhook URL for billing discrepancy alerts
# Get this from: Slack App > Incoming Webhooks > Add New Webhook
SLACK_WEBHOOK_URL=your-slack-webhook-url-here

# PagerDuty routing key for critical billing alerts (>5% discrepancy)
# Get this from: PagerDuty > Services > Integrations > Events API v2
PAGERDUTY_ROUTING_KEY=your-pagerduty-routing-key

# Optional: Reconciliation settings
BILLING_RECONCILIATION_TOLERANCE_PERCENT=1  # Default tolerance before alerting
BILLING_RECONCILIATION_INCLUDE_REFUNDS=true # Include refunds in reconciliation
```

### Setting Up Slack Webhook

1. Go to your Slack workspace's App Directory
2. Search for "Incoming Webhooks" or create a new app
3. Add a new webhook to your desired channel (e.g., `#billing-alerts`)
4. Copy the webhook URL and set it as `SLACK_WEBHOOK_URL`

### Setting Up PagerDuty Integration

1. Log in to PagerDuty
2. Go to **Services** > Select or create a service
3. Navigate to **Integrations** tab
4. Add a new integration with type **Events API v2**
5. Copy the **Routing Key** and set it as `PAGERDUTY_ROUTING_KEY`

## Alert Integrations

### Slack Alerts

Slack alerts are sent for **all** billing discrepancies and include:

- Stripe total vs Database total
- Discrepancy amount and percentage
- Number of missing payments (both directions)
- Number of amount mismatches
- Top 3 recommendations

**Alert Colors:**
- Orange (`#FFA500`): Warning (discrepancy <= 5%)
- Red (`#FF0000`): Critical (discrepancy > 5%)

### PagerDuty Alerts

PagerDuty incidents are **only** triggered for critical discrepancies (>5%) and include:

- Summary of the issue
- Full reconciliation details in custom fields
- Link to the reconciliation dashboard
- Deduplication key to prevent duplicate incidents on the same day

## Usage

### Creating the Service

```typescript
import { createBillingReconciliationService } from './services/billing-reconciliation.service';

// Create service instance
const reconciliationService = await createBillingReconciliationService();
```

### Running Daily Reconciliation

```typescript
// Run reconciliation for the previous day
const result = await reconciliationService.runDailyReconciliation();

console.log('Reconciliation Status:', result.status);
console.log('Discrepancy:', result.discrepancy);
```

### Custom Date Range Reconciliation

```typescript
const result = await reconciliationService.reconcile({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  tolerancePercentage: 0.5, // 0.5% tolerance
  includeRefunds: true,
});
```

### Syncing Missing Payments

```typescript
// If reconciliation finds missing payments, sync them
if (result.missingInDatabase.length > 0) {
  const syncResult = await reconciliationService.syncMissingPayments(
    result.missingInDatabase
  );
  console.log(`Synced ${syncResult.synced} payments`);
  console.log(`Failed to sync: ${syncResult.failed.join(', ')}`);
}
```

### Setting Up a Cron Job

To run reconciliation daily, add a cron job or scheduled task:

```typescript
import cron from 'node-cron';
import { createBillingReconciliationService } from './services/billing-reconciliation.service';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    const service = await createBillingReconciliationService();
    const result = await service.runDailyReconciliation();

    console.log('Daily reconciliation completed:', result.status);
  } catch (error) {
    console.error('Reconciliation failed:', error);
  }
});
```

## Reconciliation Results

The service returns a `ReconciliationResult` object:

```typescript
interface ReconciliationResult {
  date: string;                    // ISO date of reconciliation
  stripeTotal: number;             // Total from Stripe (in dollars)
  databaseTotal: number;           // Total from database (in dollars)
  discrepancy: number;             // Absolute difference (in dollars)
  discrepancyPercentage: number;   // Percentage difference
  missingInDatabase: string[];     // Payment IDs in Stripe but not in DB
  missingInStripe: string[];       // Payment IDs in DB but not in Stripe
  amountMismatches: Array<{
    paymentId: string;
    stripeAmount: number;
    databaseAmount: number;
    difference: number;
  }>;
  status: 'success' | 'discrepancy_found' | 'error';
  recommendations: string[];       // Actionable recommendations
}
```

### Status Values

- **success**: No significant discrepancies found (within tolerance)
- **discrepancy_found**: Discrepancies detected above tolerance threshold
- **error**: Reconciliation failed due to an error

## Troubleshooting

### Common Issues

#### Slack alerts not being sent

1. Verify `SLACK_WEBHOOK_URL` is set correctly
2. Check the webhook URL is valid and not expired
3. Review logs for "Failed to send Slack alert" errors
4. Ensure the channel still exists and webhook has permission

#### PagerDuty incidents not triggering

1. Verify `PAGERDUTY_ROUTING_KEY` is set correctly
2. Ensure the discrepancy exceeds 5% (critical threshold)
3. Check PagerDuty service is not in maintenance mode
4. Review logs for "Failed to send PagerDuty alert" errors

#### High discrepancy rates

1. **Webhook failures**: Check if Stripe webhooks are being delivered
2. **Timezone issues**: Ensure date ranges use consistent timezones
3. **Refund timing**: Refunds processed after reconciliation window may cause discrepancies
4. **Manual entries**: Database entries without corresponding Stripe records

### Monitoring

The service logs all reconciliation activities:

```
INFO: Starting billing reconciliation
INFO: Reconciliation completed { status, discrepancy, duration }
WARN: Billing discrepancy detected { discrepancy, severity }
INFO: Slack alert sent successfully
INFO: PagerDuty alert sent successfully
ERROR: Failed to send Slack/PagerDuty alert
```

### Best Practices

1. **Run reconciliation during low-traffic hours** to minimize impact
2. **Set appropriate tolerance levels** based on your business requirements
3. **Monitor alert channels** and respond to discrepancies promptly
4. **Review recommendations** and take corrective action
5. **Sync missing payments** regularly to maintain data consistency
6. **Test integrations** in staging before enabling in production

## Database Model

The service stores reconciliation results in the `ReconciliationReport` table:

```prisma
model ReconciliationReport {
  id                    String   @id @default(uuid())
  date                  DateTime
  stripeTotal           Float
  databaseTotal         Float
  discrepancy           Float
  discrepancyPercentage Float
  status                String
  details               Json     // Contains missingInDatabase, missingInStripe, etc.
  createdAt             DateTime @default(now())
}
```

This allows for historical tracking and trend analysis of billing discrepancies.
