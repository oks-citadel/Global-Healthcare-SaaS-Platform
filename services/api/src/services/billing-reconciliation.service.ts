/**
 * Billing Reconciliation Service
 *
 * Ensures consistency between Stripe payments and internal database records.
 * Runs daily to detect and report discrepancies.
 *
 * Integrations:
 * - Slack: For billing discrepancy alerts (warning level)
 * - PagerDuty: For critical billing issues requiring immediate attention
 */

import Stripe from "stripe";
import { PrismaClient } from "../generated/client";
import { logger } from "../utils/logger";

/**
 * Alert severity levels for billing discrepancies
 */
type AlertSeverity = "warning" | "critical";

/**
 * Slack webhook message format
 */
interface SlackMessage {
  channel?: string;
  username?: string;
  icon_emoji?: string;
  attachments: Array<{
    color: string;
    title: string;
    text: string;
    fields: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
    footer: string;
    ts: number;
  }>;
}

/**
 * PagerDuty Events API v2 payload
 */
interface PagerDutyEvent {
  routing_key: string;
  event_action: "trigger" | "acknowledge" | "resolve";
  dedup_key?: string;
  payload: {
    summary: string;
    source: string;
    severity: "critical" | "error" | "warning" | "info";
    timestamp?: string;
    component?: string;
    group?: string;
    class?: string;
    custom_details?: Record<string, unknown>;
  };
  links?: Array<{ href: string; text: string }>;
  images?: Array<{ src: string; href?: string; alt?: string }>;
}

interface ReconciliationResult {
  date: string;
  stripeTotal: number;
  databaseTotal: number;
  discrepancy: number;
  discrepancyPercentage: number;
  missingInDatabase: string[];
  missingInStripe: string[];
  amountMismatches: Array<{
    paymentId: string;
    stripeAmount: number;
    databaseAmount: number;
    difference: number;
  }>;
  status: "success" | "discrepancy_found" | "error";
  recommendations: string[];
}

interface ReconciliationConfig {
  startDate: Date;
  endDate: Date;
  tolerancePercentage?: number;
  includeRefunds?: boolean;
  autoFix?: boolean;
}

export class BillingReconciliationService {
  private stripe: Stripe;
  private prisma: PrismaClient;
  private tolerancePercentage: number;

  constructor(stripe: Stripe, prisma: PrismaClient) {
    this.stripe = stripe;
    this.prisma = prisma;
    this.tolerancePercentage = 0.01; // 1% tolerance by default
  }

  /**
   * Run full reconciliation for a date range
   */
  async reconcile(config: ReconciliationConfig): Promise<ReconciliationResult> {
    const startTime = Date.now();
    const {
      startDate,
      endDate,
      tolerancePercentage,
      includeRefunds = true,
    } = config;

    if (tolerancePercentage !== undefined) {
      this.tolerancePercentage = tolerancePercentage;
    }

    logger.info("Starting billing reconciliation", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    try {
      // Fetch Stripe transactions
      const stripePayments = await this.fetchStripePayments(startDate, endDate);
      const stripeRefunds = includeRefunds
        ? await this.fetchStripeRefunds(startDate, endDate)
        : [];

      // Fetch database records
      const dbPayments = await this.fetchDatabasePayments(startDate, endDate);
      const dbRefunds = includeRefunds
        ? await this.fetchDatabaseRefunds(startDate, endDate)
        : [];

      // Calculate totals
      const stripePaymentTotal = stripePayments.reduce(
        (sum, p) => sum + p.amount,
        0,
      );
      const stripeRefundTotal = stripeRefunds.reduce(
        (sum, r) => sum + r.amount,
        0,
      );
      const stripeTotal = stripePaymentTotal - stripeRefundTotal;

      const dbPaymentTotal = dbPayments.reduce(
        (sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number(p.amount)),
        0
      );
      const dbRefundTotal = dbRefunds.reduce(
        (sum, r) => sum + (typeof r.amount === "number" ? r.amount : Number(r.amount)),
        0
      );
      const databaseTotal = dbPaymentTotal - dbRefundTotal;

      // Find discrepancies
      const missingInDatabase = this.findMissingRecords(
        stripePayments.map((p) => p.id),
        dbPayments.map((p) => p.stripePaymentIntentId),
      );

      const missingInStripe = this.findMissingRecords(
        dbPayments
          .map((p) => p.stripePaymentIntentId)
          .filter(Boolean) as string[],
        stripePayments.map((p) => p.id),
      );

      const amountMismatches = this.findAmountMismatches(
        stripePayments,
        dbPayments,
      );

      // Calculate discrepancy
      const discrepancy = Math.abs(stripeTotal - databaseTotal);
      const discrepancyPercentage =
        stripeTotal > 0 ? (discrepancy / stripeTotal) * 100 : 0;

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        missingInDatabase,
        missingInStripe,
        amountMismatches,
        discrepancyPercentage,
      );

      // Determine status
      const status =
        discrepancyPercentage <= this.tolerancePercentage * 100
          ? "success"
          : "discrepancy_found";

      const result: ReconciliationResult = {
        date: new Date().toISOString(),
        stripeTotal: stripeTotal / 100, // Convert from cents
        databaseTotal: databaseTotal / 100,
        discrepancy: discrepancy / 100,
        discrepancyPercentage,
        missingInDatabase,
        missingInStripe,
        amountMismatches: amountMismatches.map((m) => ({
          ...m,
          stripeAmount: m.stripeAmount / 100,
          databaseAmount: m.databaseAmount / 100,
          difference: m.difference / 100,
        })),
        status,
        recommendations,
      };

      // Log results
      logger.info("Reconciliation completed", {
        status: result.status,
        discrepancy: result.discrepancy,
        discrepancyPercentage: result.discrepancyPercentage,
        duration: Date.now() - startTime,
      });

      // Store reconciliation result
      await this.storeReconciliationResult(result);

      // Alert if discrepancy found
      if (status === "discrepancy_found") {
        await this.sendDiscrepancyAlert(result);
      }

      return result;
    } catch (error) {
      logger.error("Reconciliation failed", { error });
      throw error;
    }
  }

  /**
   * Fetch payments from Stripe
   */
  private async fetchStripePayments(
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created: number;
      metadata: Record<string, string>;
    }>
  > {
    const payments: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created: number;
      metadata: Record<string, string>;
    }> = [];

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const response = await this.stripe.paymentIntents.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000),
        },
        limit: 100,
        starting_after: startingAfter,
      });

      for (const intent of response.data) {
        if (intent.status === "succeeded") {
          payments.push({
            id: intent.id,
            amount: intent.amount,
            currency: intent.currency,
            status: intent.status,
            created: intent.created,
            metadata: intent.metadata as Record<string, string>,
          });
        }
      }

      hasMore = response.has_more;
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    return payments;
  }

  /**
   * Fetch refunds from Stripe
   */
  private async fetchStripeRefunds(
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      id: string;
      amount: number;
      paymentIntentId: string;
      created: number;
    }>
  > {
    const refunds: Array<{
      id: string;
      amount: number;
      paymentIntentId: string;
      created: number;
    }> = [];

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const response = await this.stripe.refunds.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000),
        },
        limit: 100,
        starting_after: startingAfter,
      });

      for (const refund of response.data) {
        refunds.push({
          id: refund.id,
          amount: refund.amount,
          paymentIntentId: refund.payment_intent as string,
          created: refund.created,
        });
      }

      hasMore = response.has_more;
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    return refunds;
  }

  /**
   * Fetch payments from database
   */
  private async fetchDatabasePayments(
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "succeeded",
      },
      select: {
        id: true,
        stripePaymentIntentId: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /**
   * Fetch refunds from database
   */
  private async fetchDatabaseRefunds(
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.refund.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "succeeded",
      },
      select: {
        id: true,
        stripeRefundId: true,
        amount: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find records missing in one system
   */
  private findMissingRecords(
    sourceIds: string[],
    targetIds: string[],
  ): string[] {
    const targetSet = new Set(targetIds);
    return sourceIds.filter((id) => !targetSet.has(id));
  }

  /**
   * Find amount mismatches between Stripe and database
   */
  private findAmountMismatches(
    stripePayments: Array<{ id: string; amount: number }>,
    dbPayments: Array<{ stripePaymentIntentId: string | null; amount: unknown }>,
  ): Array<{
    paymentId: string;
    stripeAmount: number;
    databaseAmount: number;
    difference: number;
  }> {
    const mismatches: Array<{
      paymentId: string;
      stripeAmount: number;
      databaseAmount: number;
      difference: number;
    }> = [];

    const dbPaymentMap = new Map(
      dbPayments
        .filter((p) => p.stripePaymentIntentId)
        .map((p) => [p.stripePaymentIntentId!, Number(p.amount)]),
    );

    for (const stripePayment of stripePayments) {
      const dbAmount = dbPaymentMap.get(stripePayment.id);
      if (dbAmount !== undefined && dbAmount !== stripePayment.amount) {
        mismatches.push({
          paymentId: stripePayment.id,
          stripeAmount: stripePayment.amount,
          databaseAmount: dbAmount,
          difference: stripePayment.amount - dbAmount,
        });
      }
    }

    return mismatches;
  }

  /**
   * Generate recommendations based on discrepancies
   */
  private generateRecommendations(
    missingInDatabase: string[],
    missingInStripe: string[],
    amountMismatches: Array<{
      paymentId: string;
      stripeAmount: number;
      databaseAmount: number;
      difference: number;
    }>,
    discrepancyPercentage: number,
  ): string[] {
    const recommendations: string[] = [];

    if (missingInDatabase.length > 0) {
      recommendations.push(
        `${missingInDatabase.length} Stripe payments not found in database. ` +
          `Run webhook sync or manual import for: ${missingInDatabase.slice(0, 5).join(", ")}${missingInDatabase.length > 5 ? "..." : ""}`,
      );
    }

    if (missingInStripe.length > 0) {
      recommendations.push(
        `${missingInStripe.length} database payments not found in Stripe. ` +
          `Investigate potential manual entries or test data.`,
      );
    }

    if (amountMismatches.length > 0) {
      recommendations.push(
        `${amountMismatches.length} payments have amount mismatches. ` +
          `Review currency conversion, partial refunds, or data entry errors.`,
      );
    }

    if (discrepancyPercentage > 5) {
      recommendations.push(
        `Discrepancy exceeds 5%. Immediate investigation required. ` +
          `Consider pausing automated billing until resolved.`,
      );
    } else if (discrepancyPercentage > 1) {
      recommendations.push(
        `Discrepancy between 1-5%. Schedule review within 24 hours.`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("No issues found. Systems are in sync.");
    }

    return recommendations;
  }

  /**
   * Store reconciliation result in database
   */
  private async storeReconciliationResult(
    result: ReconciliationResult,
  ): Promise<void> {
    await this.prisma.reconciliationReport.create({
      data: {
        date: new Date(result.date),
        stripeTotal: result.stripeTotal,
        databaseTotal: result.databaseTotal,
        discrepancy: result.discrepancy,
        discrepancyPercentage: result.discrepancyPercentage,
        status: result.status,
        details: JSON.stringify({
          missingInDatabase: result.missingInDatabase,
          missingInStripe: result.missingInStripe,
          amountMismatches: result.amountMismatches,
          recommendations: result.recommendations,
        }),
      },
    });
  }

  /**
   * Send alert for discrepancies via Slack and/or PagerDuty
   */
  private async sendDiscrepancyAlert(
    result: ReconciliationResult,
  ): Promise<void> {
    const severity: AlertSeverity =
      result.discrepancyPercentage > 5 ? "critical" : "warning";

    logger.warn("Billing discrepancy detected", {
      discrepancy: result.discrepancy,
      discrepancyPercentage: result.discrepancyPercentage,
      missingInDatabase: result.missingInDatabase.length,
      missingInStripe: result.missingInStripe.length,
      amountMismatches: result.amountMismatches.length,
      severity,
    });

    // Send alerts in parallel
    const alertPromises: Promise<void>[] = [];

    // Always send to Slack for any discrepancy
    alertPromises.push(this.sendSlackAlert(result, severity));

    // Send to PagerDuty only for critical issues (>5% discrepancy)
    if (severity === "critical") {
      alertPromises.push(this.sendPagerDutyAlert(result));
    }

    // Wait for all alerts to complete (but don't fail if one fails)
    const results = await Promise.allSettled(alertPromises);
    results.forEach((promiseResult, index) => {
      if (promiseResult.status === "rejected") {
        logger.error("Failed to send alert", {
          alertType: index === 0 ? "slack" : "pagerduty",
          error: promiseResult.reason,
        });
      }
    });
  }

  /**
   * Send alert to Slack webhook
   */
  private async sendSlackAlert(
    result: ReconciliationResult,
    severity: AlertSeverity,
  ): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      logger.debug("Slack webhook URL not configured, skipping Slack alert");
      return;
    }

    const color = severity === "critical" ? "#FF0000" : "#FFA500";
    const emoji = severity === "critical" ? ":rotating_light:" : ":warning:";

    const message: SlackMessage = {
      username: "Billing Reconciliation Bot",
      icon_emoji: ":money_with_wings:",
      attachments: [
        {
          color,
          title: `${emoji} Billing Reconciliation Alert - ${severity.toUpperCase()}`,
          text: `A billing discrepancy of $${result.discrepancy.toFixed(2)} (${result.discrepancyPercentage.toFixed(2)}%) has been detected.`,
          fields: [
            {
              title: "Stripe Total",
              value: `$${result.stripeTotal.toFixed(2)}`,
              short: true,
            },
            {
              title: "Database Total",
              value: `$${result.databaseTotal.toFixed(2)}`,
              short: true,
            },
            {
              title: "Discrepancy",
              value: `$${result.discrepancy.toFixed(2)} (${result.discrepancyPercentage.toFixed(2)}%)`,
              short: true,
            },
            {
              title: "Missing in Database",
              value: `${result.missingInDatabase.length} payments`,
              short: true,
            },
            {
              title: "Missing in Stripe",
              value: `${result.missingInStripe.length} payments`,
              short: true,
            },
            {
              title: "Amount Mismatches",
              value: `${result.amountMismatches.length} payments`,
              short: true,
            },
            {
              title: "Recommendations",
              value:
                result.recommendations.slice(0, 3).join("\n") ||
                "No recommendations",
              short: false,
            },
          ],
          footer: "Unified Health Billing Reconciliation Service",
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook returned ${response.status}: ${response.statusText}`);
      }

      logger.info("Slack alert sent successfully", {
        severity,
        discrepancy: result.discrepancy,
      });
    } catch (error) {
      logger.error("Failed to send Slack alert", {
        error: error instanceof Error ? error.message : "Unknown error",
        severity,
      });
      throw error;
    }
  }

  /**
   * Send alert to PagerDuty Events API v2
   */
  private async sendPagerDutyAlert(result: ReconciliationResult): Promise<void> {
    const routingKey = process.env.PAGERDUTY_ROUTING_KEY;

    if (!routingKey) {
      logger.debug(
        "PagerDuty routing key not configured, skipping PagerDuty alert",
      );
      return;
    }

    const dedupKey = `billing-reconciliation-${new Date().toISOString().split("T")[0]}`;

    const event: PagerDutyEvent = {
      routing_key: routingKey,
      event_action: "trigger",
      dedup_key: dedupKey,
      payload: {
        summary: `CRITICAL: Billing discrepancy of $${result.discrepancy.toFixed(2)} (${result.discrepancyPercentage.toFixed(2)}%) detected`,
        source: "unified-health-billing-reconciliation",
        severity: "critical",
        timestamp: new Date().toISOString(),
        component: "billing",
        group: "financial",
        class: "reconciliation",
        custom_details: {
          stripe_total: result.stripeTotal,
          database_total: result.databaseTotal,
          discrepancy_amount: result.discrepancy,
          discrepancy_percentage: result.discrepancyPercentage,
          missing_in_database_count: result.missingInDatabase.length,
          missing_in_stripe_count: result.missingInStripe.length,
          amount_mismatches_count: result.amountMismatches.length,
          recommendations: result.recommendations,
          reconciliation_date: result.date,
        },
      },
      links: [
        {
          href:
            process.env.APP_URL
              ? `${process.env.APP_URL}/admin/billing/reconciliation`
              : "https://dashboard.unifiedhealth.com/admin/billing/reconciliation",
          text: "View Reconciliation Dashboard",
        },
      ],
    };

    try {
      const response = await fetch(
        "https://events.pagerduty.com/v2/enqueue",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `PagerDuty API returned ${response.status}: ${errorBody}`,
        );
      }

      const responseData = await response.json();
      logger.info("PagerDuty alert sent successfully", {
        dedupKey,
        discrepancy: result.discrepancy,
        status: responseData.status,
      });
    } catch (error) {
      logger.error("Failed to send PagerDuty alert", {
        error: error instanceof Error ? error.message : "Unknown error",
        dedupKey,
      });
      throw error;
    }
  }

  /**
   * Run daily reconciliation job
   */
  async runDailyReconciliation(): Promise<ReconciliationResult> {
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 1);

    return this.reconcile({
      startDate,
      endDate,
      includeRefunds: true,
    });
  }

  /**
   * Sync missing payments from Stripe to database
   */
  async syncMissingPayments(paymentIntentIds: string[]): Promise<{
    synced: number;
    failed: string[];
  }> {
    const failed: string[] = [];
    let synced = 0;

    for (const id of paymentIntentIds) {
      try {
        const intent = await this.stripe.paymentIntents.retrieve(id);

        if (intent.status === "succeeded") {
          await this.prisma.payment.create({
            data: {
              stripePaymentIntentId: intent.id,
              amount: intent.amount,
              currency: intent.currency,
              status: "succeeded",
              metadata: intent.metadata,
              userId: intent.metadata.userId || null,
              createdAt: new Date(intent.created * 1000),
            },
          });
          synced++;
        }
      } catch (error) {
        logger.error("Failed to sync payment", { paymentIntentId: id, error });
        failed.push(id);
      }
    }

    return { synced, failed };
  }
}

/**
 * Factory function to create a BillingReconciliationService instance
 * with proper Stripe and Prisma dependencies
 */
export async function createBillingReconciliationService(): Promise<BillingReconciliationService> {
  const { getStripeInstance } = await import("../lib/stripe.js");
  const { prisma } = await import("../lib/prisma.js");
  return new BillingReconciliationService(getStripeInstance(), prisma);
}

export default BillingReconciliationService;
