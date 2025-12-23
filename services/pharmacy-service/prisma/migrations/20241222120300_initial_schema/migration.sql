-- Pharmacy Service Initial Schema Migration
-- Generated: 2024-12-22T12:03:00Z
-- Description: Creates tables for prescriptions, prescription items, pharmacies, and medications

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('active', 'completed', 'cancelled', 'expired');

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "encounterId" TEXT,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT,
    "quantity" INTEGER,
    "refillsAllowed" INTEGER NOT NULL DEFAULT 0,
    "refillsUsed" INTEGER NOT NULL DEFAULT 0,
    "instructions" TEXT,
    "isGenericAllowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" JSONB NOT NULL,
    "operatingHours" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "brandNames" TEXT[],
    "strength" TEXT NOT NULL,
    "dosageForm" TEXT NOT NULL,
    "manufacturer" TEXT,
    "ndcCode" TEXT,
    "description" TEXT,
    "sideEffects" TEXT[],
    "interactions" TEXT[],
    "isControlled" BOOLEAN NOT NULL DEFAULT false,
    "schedule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_providerId_idx" ON "Prescription"("providerId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "Prescription_validUntil_idx" ON "Prescription"("validUntil");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE INDEX "PrescriptionItem_medicationName_idx" ON "PrescriptionItem"("medicationName");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_licenseNumber_key" ON "Pharmacy"("licenseNumber");

-- CreateIndex
CREATE INDEX "Pharmacy_licenseNumber_idx" ON "Pharmacy"("licenseNumber");

-- CreateIndex
CREATE INDEX "Pharmacy_isActive_idx" ON "Pharmacy"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_ndcCode_key" ON "Medication"("ndcCode");

-- CreateIndex
CREATE INDEX "Medication_name_idx" ON "Medication"("name");

-- CreateIndex
CREATE INDEX "Medication_genericName_idx" ON "Medication"("genericName");

-- CreateIndex
CREATE INDEX "Medication_ndcCode_idx" ON "Medication"("ndcCode");

-- CreateIndex
CREATE INDEX "Medication_isActive_idx" ON "Medication"("isActive");

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "Prescription" IS 'Medical prescriptions issued by providers';
COMMENT ON TABLE "PrescriptionItem" IS 'Individual medication items within a prescription';
COMMENT ON TABLE "Pharmacy" IS 'Partner pharmacies for prescription fulfillment';
COMMENT ON TABLE "Medication" IS 'Medication database with drug information and interactions';
