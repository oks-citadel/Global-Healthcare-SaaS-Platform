-- Mental Health Service Initial Schema Migration
-- Generated: 2024-12-22T12:01:00Z
-- Description: Creates tables for therapy sessions, assessments, crisis interventions, treatment plans, mood logs, and support groups

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('individual', 'group', 'couples', 'family');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('PHQ9', 'GAD7', 'PCL5', 'AUDIT', 'DAST', 'MDQ', 'YBOCS', 'PSS', 'general_intake');

-- CreateEnum
CREATE TYPE "CrisisType" AS ENUM ('suicidal_ideation', 'self_harm', 'panic_attack', 'psychotic_episode', 'substance_overdose', 'domestic_violence', 'trauma', 'other');

-- CreateEnum
CREATE TYPE "CrisisSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "CrisisStatus" AS ENUM ('active', 'monitoring', 'resolved', 'escalated');

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'scheduled',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "modality" TEXT,
    "notes" TEXT,
    "homework" TEXT,
    "nextSessionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentalHealthAssessment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assessedBy" TEXT NOT NULL,
    "assessmentType" "AssessmentType" NOT NULL,
    "score" INTEGER,
    "severity" TEXT,
    "results" JSONB NOT NULL,
    "notes" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentalHealthAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrisisIntervention" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "responderId" TEXT,
    "crisisType" "CrisisType" NOT NULL,
    "severity" "CrisisSeverity" NOT NULL,
    "status" "CrisisStatus" NOT NULL DEFAULT 'active',
    "description" TEXT NOT NULL,
    "interventions" TEXT[],
    "outcome" TEXT,
    "referredTo" TEXT,
    "contactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT true,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrisisIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentPlan" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "diagnosis" TEXT[],
    "goals" JSONB NOT NULL,
    "interventions" JSONB NOT NULL,
    "medications" JSONB,
    "frequency" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "moodRating" INTEGER NOT NULL,
    "energy" INTEGER,
    "anxiety" INTEGER,
    "sleep" INTEGER,
    "notes" TEXT,
    "triggers" TEXT[],
    "activities" TEXT[],
    "logDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "facilitatorId" TEXT NOT NULL,
    "schedule" JSONB NOT NULL,
    "maxMembers" INTEGER NOT NULL DEFAULT 12,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "SupportGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TherapySession_patientId_idx" ON "TherapySession"("patientId");

-- CreateIndex
CREATE INDEX "TherapySession_therapistId_idx" ON "TherapySession"("therapistId");

-- CreateIndex
CREATE INDEX "TherapySession_scheduledAt_idx" ON "TherapySession"("scheduledAt");

-- CreateIndex
CREATE INDEX "TherapySession_status_idx" ON "TherapySession"("status");

-- CreateIndex
CREATE INDEX "TherapySession_patientId_scheduledAt_idx" ON "TherapySession"("patientId", "scheduledAt");

-- CreateIndex
CREATE INDEX "TherapySession_therapistId_scheduledAt_idx" ON "TherapySession"("therapistId", "scheduledAt");

-- CreateIndex
CREATE INDEX "MentalHealthAssessment_patientId_idx" ON "MentalHealthAssessment"("patientId");

-- CreateIndex
CREATE INDEX "MentalHealthAssessment_assessedBy_idx" ON "MentalHealthAssessment"("assessedBy");

-- CreateIndex
CREATE INDEX "MentalHealthAssessment_assessmentType_idx" ON "MentalHealthAssessment"("assessmentType");

-- CreateIndex
CREATE INDEX "MentalHealthAssessment_patientId_createdAt_idx" ON "MentalHealthAssessment"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "CrisisIntervention_patientId_idx" ON "CrisisIntervention"("patientId");

-- CreateIndex
CREATE INDEX "CrisisIntervention_responderId_idx" ON "CrisisIntervention"("responderId");

-- CreateIndex
CREATE INDEX "CrisisIntervention_status_idx" ON "CrisisIntervention"("status");

-- CreateIndex
CREATE INDEX "CrisisIntervention_severity_idx" ON "CrisisIntervention"("severity");

-- CreateIndex
CREATE INDEX "CrisisIntervention_contactedAt_idx" ON "CrisisIntervention"("contactedAt");

-- CreateIndex
CREATE INDEX "CrisisIntervention_patientId_contactedAt_idx" ON "CrisisIntervention"("patientId", "contactedAt");

-- CreateIndex
CREATE INDEX "TreatmentPlan_patientId_idx" ON "TreatmentPlan"("patientId");

-- CreateIndex
CREATE INDEX "TreatmentPlan_providerId_idx" ON "TreatmentPlan"("providerId");

-- CreateIndex
CREATE INDEX "TreatmentPlan_status_idx" ON "TreatmentPlan"("status");

-- CreateIndex
CREATE INDEX "TreatmentPlan_reviewDate_idx" ON "TreatmentPlan"("reviewDate");

-- CreateIndex
CREATE INDEX "MoodLog_patientId_idx" ON "MoodLog"("patientId");

-- CreateIndex
CREATE INDEX "MoodLog_logDate_idx" ON "MoodLog"("logDate");

-- CreateIndex
CREATE INDEX "MoodLog_patientId_logDate_idx" ON "MoodLog"("patientId", "logDate");

-- CreateIndex
CREATE INDEX "SupportGroup_type_idx" ON "SupportGroup"("type");

-- CreateIndex
CREATE INDEX "SupportGroup_facilitatorId_idx" ON "SupportGroup"("facilitatorId");

-- CreateIndex
CREATE INDEX "SupportGroup_isActive_idx" ON "SupportGroup"("isActive");

-- CreateIndex
CREATE INDEX "SupportGroupMember_groupId_idx" ON "SupportGroupMember"("groupId");

-- CreateIndex
CREATE INDEX "SupportGroupMember_patientId_idx" ON "SupportGroupMember"("patientId");

-- CreateIndex
CREATE INDEX "SupportGroupMember_status_idx" ON "SupportGroupMember"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SupportGroupMember_groupId_patientId_key" ON "SupportGroupMember"("groupId", "patientId");

-- AddForeignKey
ALTER TABLE "SupportGroupMember" ADD CONSTRAINT "SupportGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SupportGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "TherapySession" IS 'Therapy sessions between patients and therapists';
COMMENT ON TABLE "MentalHealthAssessment" IS 'Standardized mental health assessments (PHQ-9, GAD-7, etc.)';
COMMENT ON TABLE "CrisisIntervention" IS 'Crisis intervention records for emergency mental health situations';
COMMENT ON TABLE "TreatmentPlan" IS 'Long-term treatment plans for mental health patients';
COMMENT ON TABLE "MoodLog" IS 'Patient self-reported mood and wellness logs';
COMMENT ON TABLE "SupportGroup" IS 'Mental health support groups';
COMMENT ON TABLE "SupportGroupMember" IS 'Support group membership records';
