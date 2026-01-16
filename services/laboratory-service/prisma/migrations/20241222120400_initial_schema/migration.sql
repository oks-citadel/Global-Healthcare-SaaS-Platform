-- Laboratory Service Initial Schema Migration
-- Generated: 2024-12-22T12:04:00Z
-- Description: Creates tables for lab orders, lab tests, lab results, and diagnostic tests

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'collected', 'processing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderPriority" AS ENUM ('routine', 'urgent', 'stat');

-- CreateEnum
CREATE TYPE "TestCategory" AS ENUM ('hematology', 'biochemistry', 'immunology', 'microbiology', 'pathology', 'radiology', 'cardiology', 'endocrinology', 'other');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "encounterId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "priority" "OrderPriority" NOT NULL DEFAULT 'routine',
    "clinicalInfo" TEXT,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "testCode" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "category" "TestCategory" NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "referenceRange" TEXT,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "abnormalFlag" TEXT,
    "notes" TEXT,
    "performedBy" TEXT,
    "verifiedBy" TEXT,
    "resultedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "TestCategory" NOT NULL,
    "description" TEXT,
    "preparation" TEXT,
    "sampleType" TEXT,
    "turnaroundTime" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "referenceRanges" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_orderNumber_key" ON "LabOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "LabOrder_patientId_idx" ON "LabOrder"("patientId");

-- CreateIndex
CREATE INDEX "LabOrder_providerId_idx" ON "LabOrder"("providerId");

-- CreateIndex
CREATE INDEX "LabOrder_status_idx" ON "LabOrder"("status");

-- CreateIndex
CREATE INDEX "LabOrder_orderNumber_idx" ON "LabOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "LabOrder_orderedAt_idx" ON "LabOrder"("orderedAt");

-- CreateIndex
CREATE INDEX "LabTest_orderId_idx" ON "LabTest"("orderId");

-- CreateIndex
CREATE INDEX "LabTest_testCode_idx" ON "LabTest"("testCode");

-- CreateIndex
CREATE INDEX "LabTest_status_idx" ON "LabTest"("status");

-- CreateIndex
CREATE INDEX "LabResult_testId_idx" ON "LabResult"("testId");

-- CreateIndex
CREATE INDEX "LabResult_isAbnormal_idx" ON "LabResult"("isAbnormal");

-- CreateIndex
CREATE INDEX "LabResult_resultedAt_idx" ON "LabResult"("resultedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticTest_code_key" ON "DiagnosticTest"("code");

-- CreateIndex
CREATE INDEX "DiagnosticTest_code_idx" ON "DiagnosticTest"("code");

-- CreateIndex
CREATE INDEX "DiagnosticTest_category_idx" ON "DiagnosticTest"("category");

-- CreateIndex
CREATE INDEX "DiagnosticTest_isActive_idx" ON "DiagnosticTest"("isActive");

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LabOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "LabTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "LabOrder" IS 'Laboratory test orders from providers';
COMMENT ON TABLE "LabTest" IS 'Individual tests within a lab order';
COMMENT ON TABLE "LabResult" IS 'Test results with values and reference ranges';
COMMENT ON TABLE "DiagnosticTest" IS 'Catalog of available diagnostic tests with pricing';
