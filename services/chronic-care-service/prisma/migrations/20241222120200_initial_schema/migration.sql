-- Chronic Care Service Initial Schema Migration
-- Generated: 2024-12-22T12:02:00Z
-- Description: Creates tables for care plans, care tasks, monitoring devices, vital readings, alerts, and goals

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('active', 'completed', 'suspended', 'cancelled');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('medication', 'measurement', 'exercise', 'diet', 'appointment', 'other');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'completed', 'missed', 'cancelled');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('blood_pressure_monitor', 'glucose_meter', 'pulse_oximeter', 'weight_scale', 'thermometer', 'heart_rate_monitor', 'peak_flow_meter', 'ecg_monitor');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned');

-- CreateEnum
CREATE TYPE "VitalType" AS ENUM ('blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'blood_glucose', 'oxygen_saturation', 'temperature', 'weight', 'respiratory_rate', 'peak_flow');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('vital_out_of_range', 'missed_medication', 'missed_measurement', 'device_offline', 'no_activity', 'threshold_exceeded');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('info', 'warning', 'critical');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('new', 'acknowledged', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('weight_loss', 'blood_pressure', 'blood_glucose', 'exercise', 'medication_adherence', 'diet', 'sleep', 'stress_management', 'other');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('active', 'completed', 'paused', 'cancelled');

-- CreateTable
CREATE TABLE "CarePlan" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "goals" JSONB NOT NULL,
    "interventions" JSONB NOT NULL,
    "reviewSchedule" TEXT,
    "nextReviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareTask" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" "TaskType" NOT NULL,
    "frequency" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringDevice" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'active',
    "lastSyncAt" TIMESTAMP(3),
    "batteryLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoringDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalReading" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "carePlanId" TEXT,
    "deviceId" TEXT,
    "vitalType" "VitalType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VitalReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "carePlanId" TEXT,
    "alertType" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'new',
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "carePlanId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goalType" "GoalType" NOT NULL,
    "targetValue" DOUBLE PRECISION,
    "targetUnit" TEXT,
    "targetDate" TIMESTAMP(3),
    "frequency" TEXT,
    "status" "GoalStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalProgress" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarePlan_patientId_idx" ON "CarePlan"("patientId");

-- CreateIndex
CREATE INDEX "CarePlan_providerId_idx" ON "CarePlan"("providerId");

-- CreateIndex
CREATE INDEX "CarePlan_status_idx" ON "CarePlan"("status");

-- CreateIndex
CREATE INDEX "CarePlan_nextReviewDate_idx" ON "CarePlan"("nextReviewDate");

-- CreateIndex
CREATE INDEX "CareTask_carePlanId_idx" ON "CareTask"("carePlanId");

-- CreateIndex
CREATE INDEX "CareTask_status_idx" ON "CareTask"("status");

-- CreateIndex
CREATE INDEX "CareTask_dueDate_idx" ON "CareTask"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoringDevice_serialNumber_key" ON "MonitoringDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "MonitoringDevice_patientId_idx" ON "MonitoringDevice"("patientId");

-- CreateIndex
CREATE INDEX "MonitoringDevice_deviceType_idx" ON "MonitoringDevice"("deviceType");

-- CreateIndex
CREATE INDEX "MonitoringDevice_status_idx" ON "MonitoringDevice"("status");

-- CreateIndex
CREATE INDEX "MonitoringDevice_serialNumber_idx" ON "MonitoringDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "VitalReading_patientId_idx" ON "VitalReading"("patientId");

-- CreateIndex
CREATE INDEX "VitalReading_carePlanId_idx" ON "VitalReading"("carePlanId");

-- CreateIndex
CREATE INDEX "VitalReading_deviceId_idx" ON "VitalReading"("deviceId");

-- CreateIndex
CREATE INDEX "VitalReading_vitalType_idx" ON "VitalReading"("vitalType");

-- CreateIndex
CREATE INDEX "VitalReading_recordedAt_idx" ON "VitalReading"("recordedAt");

-- CreateIndex
CREATE INDEX "VitalReading_patientId_recordedAt_idx" ON "VitalReading"("patientId", "recordedAt");

-- CreateIndex
CREATE INDEX "Alert_patientId_idx" ON "Alert"("patientId");

-- CreateIndex
CREATE INDEX "Alert_carePlanId_idx" ON "Alert"("carePlanId");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "Goal_patientId_idx" ON "Goal"("patientId");

-- CreateIndex
CREATE INDEX "Goal_carePlanId_idx" ON "Goal"("carePlanId");

-- CreateIndex
CREATE INDEX "Goal_status_idx" ON "Goal"("status");

-- CreateIndex
CREATE INDEX "Goal_goalType_idx" ON "Goal"("goalType");

-- CreateIndex
CREATE INDEX "GoalProgress_goalId_idx" ON "GoalProgress"("goalId");

-- CreateIndex
CREATE INDEX "GoalProgress_recordedAt_idx" ON "GoalProgress"("recordedAt");

-- AddForeignKey
ALTER TABLE "CareTask" ADD CONSTRAINT "CareTask_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalReading" ADD CONSTRAINT "VitalReading_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalReading" ADD CONSTRAINT "VitalReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "MonitoringDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalProgress" ADD CONSTRAINT "GoalProgress_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "CarePlan" IS 'Chronic care management plans for patients with ongoing conditions';
COMMENT ON TABLE "CareTask" IS 'Tasks assigned as part of care plans (medications, exercises, etc.)';
COMMENT ON TABLE "MonitoringDevice" IS 'Patient monitoring devices (blood pressure monitors, glucose meters, etc.)';
COMMENT ON TABLE "VitalReading" IS 'Vital sign readings from monitoring devices or manual entry';
COMMENT ON TABLE "Alert" IS 'Care alerts for abnormal readings or missed tasks';
COMMENT ON TABLE "Goal" IS 'Patient health goals (weight loss, blood pressure targets, etc.)';
COMMENT ON TABLE "GoalProgress" IS 'Progress tracking for patient health goals';
