-- Telehealth Service Initial Schema Migration
-- Generated: 2024-12-22T12:00:00Z
-- Description: Creates tables for telehealth appointments, visits, chat messages, and provider availability

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('video', 'audio', 'chat', 'in_person');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "reasonForVisit" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'waiting',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "roomId" TEXT NOT NULL,
    "iceServers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachments" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderAvailability" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderBreak" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderBreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_providerId_idx" ON "Appointment"("providerId");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_patientId_scheduledAt_idx" ON "Appointment"("patientId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_providerId_scheduledAt_idx" ON "Appointment"("providerId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_appointmentId_key" ON "Visit"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_sessionToken_key" ON "Visit"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_roomId_key" ON "Visit"("roomId");

-- CreateIndex
CREATE INDEX "Visit_appointmentId_idx" ON "Visit"("appointmentId");

-- CreateIndex
CREATE INDEX "Visit_sessionToken_idx" ON "Visit"("sessionToken");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- CreateIndex
CREATE INDEX "Visit_roomId_idx" ON "Visit"("roomId");

-- CreateIndex
CREATE INDEX "ChatMessage_visitId_idx" ON "ChatMessage"("visitId");

-- CreateIndex
CREATE INDEX "ChatMessage_timestamp_idx" ON "ChatMessage"("timestamp");

-- CreateIndex
CREATE INDEX "ChatMessage_visitId_timestamp_idx" ON "ChatMessage"("visitId", "timestamp");

-- CreateIndex
CREATE INDEX "ProviderAvailability_providerId_idx" ON "ProviderAvailability"("providerId");

-- CreateIndex
CREATE INDEX "ProviderAvailability_providerId_dayOfWeek_idx" ON "ProviderAvailability"("providerId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "ProviderAvailability_isActive_idx" ON "ProviderAvailability"("isActive");

-- CreateIndex
CREATE INDEX "ProviderBreak_providerId_idx" ON "ProviderBreak"("providerId");

-- CreateIndex
CREATE INDEX "ProviderBreak_startTime_endTime_idx" ON "ProviderBreak"("startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "Appointment" IS 'Telehealth appointments between patients and providers';
COMMENT ON TABLE "Visit" IS 'Active video/audio visits with WebRTC connection info';
COMMENT ON TABLE "ChatMessage" IS 'Real-time chat messages during telehealth visits';
COMMENT ON TABLE "ProviderAvailability" IS 'Provider weekly availability schedule';
COMMENT ON TABLE "ProviderBreak" IS 'Temporary provider unavailability periods';
