-- CreateEnum for WebhookEventStatus
CREATE TYPE "WebhookEventStatus" AS ENUM ('pending', 'processing', 'succeeded', 'failed');

-- CreateTable for WebhookEventLog
CREATE TABLE "WebhookEventLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'pending',
    "payload" JSONB NOT NULL,
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "processingTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for unique eventId (ensures idempotency)
CREATE UNIQUE INDEX "WebhookEventLog_eventId_key" ON "WebhookEventLog"("eventId");

-- CreateIndex for fast lookups
CREATE INDEX "WebhookEventLog_eventId_idx" ON "WebhookEventLog"("eventId");
CREATE INDEX "WebhookEventLog_eventType_idx" ON "WebhookEventLog"("eventType");
CREATE INDEX "WebhookEventLog_status_idx" ON "WebhookEventLog"("status");
CREATE INDEX "WebhookEventLog_createdAt_idx" ON "WebhookEventLog"("createdAt");
CREATE INDEX "WebhookEventLog_eventType_status_idx" ON "WebhookEventLog"("eventType", "status");

-- Add comments for documentation
COMMENT ON TABLE "WebhookEventLog" IS 'Logs all Stripe webhook events for idempotency and debugging';
COMMENT ON COLUMN "WebhookEventLog"."eventId" IS 'Stripe event ID (evt_...) - unique constraint ensures idempotency';
COMMENT ON COLUMN "WebhookEventLog"."status" IS 'Processing status: pending -> processing -> succeeded/failed';
COMMENT ON COLUMN "WebhookEventLog"."retryCount" IS 'Number of retry attempts (max 3)';
COMMENT ON COLUMN "WebhookEventLog"."processingTimeMs" IS 'Total processing time in milliseconds';
